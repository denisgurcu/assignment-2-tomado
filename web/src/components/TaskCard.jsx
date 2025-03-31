// TaskCard.jsx
import './TaskCard.css';

export default function TaskCard({ task, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-top">
        <p>{task.title}</p>
        <button className="delete-btn" onClick={onDelete}>×</button>
      </div>

      {task.category && (
        <span className="category-label">{task.category}</span>
      )}
    </div>
  );
}
