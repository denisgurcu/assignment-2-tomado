import './TaskCard.css';
import { FaTrash, FaPen } from 'react-icons/fa';

// this component is for individual task card on the board
export default function TaskCard({ task, onDelete, onEdit }) {
    // my debug attempts couldn't get the image to show up for a long while
  console.log("Task data:", task);
  console.log("Image filename:", task.image);

  return (
    // if the task is dropped to done, strikethrough it
    <div className={`task-card ${task.status === 'done' ? 'done' : ''}`}>
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

      {/* if an image exists display it */}
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
      {/* if the task has a category, show it*/}
      {task.category && (
        <span className="category-pill">
          {task.category_emoji} {task.category}
        </span>
      )}
    </div>
  );
}
