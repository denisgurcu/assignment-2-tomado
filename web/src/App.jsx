import './App.css';
import PomodoroTimer from './components/PomodoroTimer';
import TaskBoard from './components/TaskBoard';

function App() {
  return (
    <div className="main-layout">
      <PomodoroTimer />
      <TaskBoard />
    </div>
  );
}

export default App;
