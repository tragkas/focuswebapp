import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Menu, X, Brain, Maximize, Minimize } from 'lucide-react';
import FlipCard from './FlipCard';
import './PomodoroTimer.css';

const PomodoroTimer = ({ toggleView, toggleFullscreen, isFullscreen }) => {
    const [focusLength, setFocusLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    const [timeLeft, setTimeLeft] = useState(focusLength * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'

    const timerRef = useRef(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(mode === 'focus' ? focusLength * 60 : breakLength * 60);
        }
    }, [focusLength, breakLength, mode]);

    const playSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;

        // Nice bell sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            playSound();

            if (mode === 'focus') {
                // Focus ended -> Auto-start Break
                setMode('break');
                setTimeLeft(breakLength * 60);
                setIsActive(true);
            } else {
                // Break ended -> STOP. Switch to Focus but do NOT start.
                setMode('focus');
                setTimeLeft(focusLength * 60);
                setIsActive(false);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode, focusLength, breakLength]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? focusLength * 60 : breakLength * 60);
    };

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <div className="pomodoro-timer">
            {/* Top Right Menu Button for Mobile */}
            <button
                className="top-menu-btn"
                onClick={() => setShowSettings(true)}
                aria-label="Open Settings"
            >
                <Menu size={24} color="white" />
            </button>

            <div className="timer-display">
                {/* 2 Cards Only: MM and SS */}
                <FlipCard digit={minutes} />
                {/* Gap handled by CSS */}
                <FlipCard digit={seconds} />
            </div>

            {/* Floating Control Dock */}
            <div className="control-dock">
                <div className="dock-info">
                    <span className="mode-label">{mode === 'focus' ? 'FOCUS' : 'BREAK'}</span>
                    <span className="status-label">{isActive ? 'Running' : 'Paused'}</span>
                </div>

                <div className="dock-actions">
                    <button className="dock-btn main-action" onClick={toggleTimer}>
                        {isActive ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
                    </button>

                    <button className="dock-btn secondary-action" onClick={resetTimer}>
                        <RotateCcw size={20} />
                    </button>

                    <button className="dock-btn secondary-action" onClick={resetTimer}>
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Settings Overlay (Sandwich Menu) */}
            <div className={`mobile-settings-overlay ${showSettings ? 'visible' : ''}`}>
                <div className="overlay-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={() => setShowSettings(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="overlay-content">
                    {/* Menu Actions */}
                    <div className="menu-actions-large">
                        <button className="menu-action-btn" onClick={toggleView}>
                            <Brain size={32} />
                            <span>Switch to Clock</span>
                        </button>

                        <button className="menu-action-btn" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
                            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                        </button>
                    </div>

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
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
