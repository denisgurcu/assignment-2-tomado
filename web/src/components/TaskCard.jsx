import './TaskCard.css';
import { FaTrash, FaPen } from 'react-icons/fa';

export default function TaskCard({ task, onDelete, onEdit }) {
  console.log("Task data:", task);
  console.log("Image filename:", task.image);

  return (
    <div className="task-card">
      <div className="task-controls">
      <button
          className="edit-btn"
          onClick={onEdit}
          aria-label="Edit task"
        >
          <FaPen />
        </button>
        <button className="trash-btn" onClick={onDelete} aria-label="Delete task">
          <FaTrash />
        </button>
      </div>

      <div className="task-top">
        <p className="task-title">{task.title}</p>
      </div>

      <hr className="divider" />

      {task.description && (
        <>
          <p className="task-description">{task.description}</p>
          <hr />
        </>
      )}

      {task.image && (
        <>
          <img
            src={`http://localhost:3000/uploads/${task.image}`}
            alt={task.title}
            className="task-image"
          />
<hr className="divider" />
        </>
      )}

      {task.category && (
        <span className="category-pill">
          {task.category_emoji} {task.category}
        </span>
      )}
    </div>
  );
}
