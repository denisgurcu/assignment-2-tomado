import { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const modes = {
  focus: 5,   // 25 minutes (remove * 60 and change to 5 for testing)
  short: 3,    //  5 minutes (remove * 60 and  change to 3 for testing)
  long: 7     // 15 minutes (remove * 60 and  change to 7 for testing)
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [seconds, setSeconds] = useState(modes['focus']);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [isManual, setIsManual] = useState(false); // NEW: Track manual mode override

  // Countdown interval
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  // Update timer when mode changes
  useEffect(() => {
    setSeconds(modes[mode]);
  }, [mode]);

  // When timer reaches 0
  useEffect(() => {
    if (seconds === 0 && isRunning && !hasCompletedCycle) {
      if (mode === 'focus') {
        const shine = new Audio('/shine.mp3');
        shine.volume = 0.7;
        shine.play().catch(e => console.warn('Shine audio failed:', e));

        const newCycle = cycleCount + 1;
        setCycleCount(newCycle);

        if (newCycle === 4) {
          setMode('long');
        } else {
          setMode('short');
        }
      }

      else if (mode === 'short') {
        const bell = new Audio('/bell.mp3');
        bell.volume = 0.7;
        bell.play().catch(e => console.warn('Bell audio failed:', e));

        setMode('focus');
      }

      else if (mode === 'long') {
        const bell1 = new Audio('/bell.mp3');
        bell1.volume = 0.7;
        bell1.play().catch(e => console.warn('Bell 1 failed:', e));

        setTimeout(() => {
          const bell2 = new Audio('/bell.mp3');
          bell2.volume = 0.7;
          bell2.play().catch(e => console.warn('Bell 2 failed:', e));
        }, 600);

        // ✅ Reset everything to default Focus mode
        setMode('focus');
        setSeconds(modes['focus']);
        setIsRunning(false);
        setCycleCount(0);
        setHasCompletedCycle(true);
        setIsManual(false);
      }
    }
  }, [seconds]);

  const format = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="pomodoro">
      <div className="mode-switch">
        <button
          className={mode === 'focus' ? 'active' : ''}
          onClick={() => {
            setMode('focus');
            setIsManual(false); // ✅ Resume cycle logic
          }}
        >
          Focus
        </button>
        <button
          className={mode === 'short' ? 'active' : ''}
          onClick={() => {
            setMode('short');
            setIsManual(true); // ✅ Manual override
          }}
        >
          Short Break
        </button>
        <button
          className={mode === 'long' ? 'active' : ''}
          onClick={() => {
            setMode('long');
            setIsManual(true);
          }}
        >
          Long Break
        </button>
      </div>

      <div className="cycle-indicator">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            className={`dot ${i < cycleCount % 4 ? 'active' : ''} ${
              !isManual && i === cycleCount % 4 && isRunning && !hasCompletedCycle ? 'breathing' : ''
            }`}
          />
        ))}
      </div>

      {isManual && (
        <p className="manual-note">Manual mode: cycle progress is paused.</p>
      )}

      <h1>{format(seconds)}</h1>
      <div className="timer-controls">
        <button
          className={`start-btn ${isRunning ? 'active' : ''}`}
          onClick={() => {
            if (hasCompletedCycle) {
              setMode('focus');
              setCycleCount(0);
              setHasCompletedCycle(false);
              setSeconds(modes['focus']);
              setIsManual(false);
            }
            setIsRunning(prev => !prev);
          }}
        >
          {hasCompletedCycle ? 'Restart' : isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          className="reset-btn"
          onClick={() => {
            setSeconds(modes[mode]);
            setIsRunning(false);
          }}
        >
          &#x21bb;
        </button>
      </div>
    </div>
  );
}
