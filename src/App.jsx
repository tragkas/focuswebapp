import { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Brain, Clock, Menu, X } from 'lucide-react';
import './App.css';
import RealTimeClock from './components/RealTimeClock';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const [view, setView] = useState('clock'); // 'clock' or 'pomodoro'
  const [isIdle, setIsIdle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Global Menu & Settings State
  const [showMenu, setShowMenu] = useState(false);
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);

  const idleTimerRef = useRef(null);
  const containerRef = useRef(null); // Ref for specific container fullscreen

  // Idle Detection Logic
  useEffect(() => {
    const handleMouseMove = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3000); // 3 seconds of inactivity -> idle
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseMove);
    window.addEventListener('keydown', handleMouseMove);

    // Init timer
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseMove);
      window.removeEventListener('keydown', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen on the CONTAINER, not the whole doc, so relative positioning holds
      if (containerRef.current) {
        containerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error("Error enabling fullscreen:", err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  const toggleView = () => {
    setView(v => v === 'clock' ? 'pomodoro' : 'clock');
  };

  return (
    <div className={`app-container ${isIdle ? 'idle' : ''}`} ref={containerRef}>
      {/* GLOBAL SANDWICH MENU BUTTON (Top Right) */}
      <button
        className="top-menu-btn"
        onClick={() => setShowMenu(true)}
        aria-label="Open Menu"
      >
        <Menu size={24} color="white" />
      </button>

      {/* GLOBAL MENU OVERLAY */}
      <div className={`mobile-settings-overlay ${showMenu ? 'visible' : ''}`}>
        <div className="overlay-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setShowMenu(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="overlay-content">
          {/* Global Actions */}
          <div className="menu-actions-large">
            <button className="menu-action-btn" onClick={() => {
              toggleView();
              setShowMenu(false);
            }}>
              {view === 'clock' ? <Brain size={32} /> : <Clock size={32} />}
              <span>{view === 'clock' ? 'Focus Mode' : 'Clock Mode'}</span>
            </button>

            <button className="menu-action-btn" onClick={() => {
              toggleFullscreen();
              setShowMenu(false);
            }}>
              {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            <button className="menu-action-btn" onClick={() => setShowMenu(false)}>
              <X size={32} />
              <span>Exit Menu</span>
            </button>
          </div>

          {/* Settings - Only visible in Pomodoro Mode */}
          {view === 'pomodoro' && (
            <>
              <div className="setting-divider-horizontal"></div>
              <div className="setting-group-large">
                <label>FOCUS LENGTH (MIN)</label>
                <div className="setting-control-large">
                  <button onClick={() => setFocusLength(f => Math.max(1, f - 1))}>-</button>
                  <span>{focusLength}</span>
                  <button onClick={() => setFocusLength(f => f + 1)}>+</button>
                </div>
              </div>
              <div className="setting-group-large">
                <label>BREAK LENGTH (MIN)</label>
                <div className="setting-control-large">
                  <button onClick={() => setBreakLength(d => Math.max(1, d - 1))}>-</button>
                  <span>{breakLength}</span>
                  <button onClick={() => setBreakLength(d => d + 1)}>+</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <main className="clock-container">
        {view === 'clock' ?
          <RealTimeClock /> :
          <PomodoroTimer
            // Removed toggleView/toggleFullscreen props as they are now in the global menu
            focusLength={focusLength}
            breakLength={breakLength}
          />
        }
      </main>

      {/* Bottom Right Controls */}
      <div className="bottom-controls fade-element">
        {/* Brain Icon acts as the Mode Toggle now */}
        <button
          className={`icon-btn brain-icon ${view === 'pomodoro' ? 'active' : ''}`}
          onClick={toggleView}
          title="Toggle Timer/Clock"
        >
          <Brain size={24} />
        </button>

        <button className="icon-btn fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  )
}

export default App;
