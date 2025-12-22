import { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Brain, Clock } from 'lucide-react';
import './App.css';
import RealTimeClock from './components/RealTimeClock';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const [view, setView] = useState('clock'); // 'clock' or 'pomodoro'
  const [isIdle, setIsIdle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      {/* Top Nav REMOVED per user request */}

      <main className="clock-container">
        {view === 'clock' ? <RealTimeClock /> : <PomodoroTimer />}
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
