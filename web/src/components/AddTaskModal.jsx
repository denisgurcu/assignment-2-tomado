import { useState, useEffect } from 'react';
import './AddTaskModal.css';
import { FaChevronDown, FaTrash } from 'react-icons/fa';

// this is the modal where users can add a new task
export default function AddTaskModal({ isOpen, onClose, onAdd, currentColumn }) {
    // These are the form fields for the task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // when the modal opens, get all available categories from the server
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3000/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [isOpen]);

  // When a file is selected, convert it to a preview image using FileReader
  useEffect(() => {
    if (!file) return setPreview(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  // this runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return; // no submission without a title

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId || ''); formData.append('status', currentColumn); // Use the current column as the default status
    if (file) formData.append('file', file);

    try {
      // Send the task to the backend
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      // reset the form and close the modal
      if (res.ok) {
        onAdd(); // Refresh task list
        onClose();  // Close modal
        setTitle('');
        setDescription('');
        setCategoryId('');
        setFile(null);
        setPreview(null);
      } else {
        alert("Something went wrong: " + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error!');
    }
  };

  // If modal is not open, don’t render anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>ADD NEW TASK</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="category">Category:</label>
          <div className="custom-select-wrapper">
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <FaChevronDown className="select-arrow" />
          </div>


          <label htmlFor="file" className="file-upload">
            Upload Image (optional)
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {preview && (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                aria-label="Remove uploaded image"
              >
                <FaTrash size={12} />
              </button>

            </div>
          )}
          <div className="modal-actions">
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
