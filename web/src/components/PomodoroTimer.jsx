import { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const modes = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [seconds, setSeconds] = useState(modes[mode]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  useEffect(() => {
    setSeconds(modes[mode]);
    setIsRunning(false);
  }, [mode]);

  const format = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="pomodoro">
      <div className="mode-switch">
        <button className={mode === 'focus' ? 'active' : ''} onClick={() => setMode('focus')}>Focus</button>
        <button className={mode === 'short' ? 'active' : ''} onClick={() => setMode('short')}>Short Break</button>
        <button className={mode === 'long' ? 'active' : ''} onClick={() => setMode('long')}>Long Break</button>
      </div>
      <h1>{format(seconds)}</h1>
      <button onClick={() => setIsRunning(prev => !prev)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}
