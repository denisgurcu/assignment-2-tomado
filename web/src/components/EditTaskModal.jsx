import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig'; // Ensure this is your configured Axios instance
import './EditTaskModal.css';
import { FaChevronDown, FaTrash } from 'react-icons/fa';

export default function EditTaskModal({ isOpen, onClose, onEdit, task, defaultStatus }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || defaultStatus || ''); // Status is either from the task or defaultStatus
  const [categoryId, setCategoryId] = useState(task?.category_id || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      console.log('Categories fetched:', response.data); // Debug log
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories.');
      setCategories([]); // Fallback to an empty array
    }
  };

  // Generate preview when a file is selected
  useEffect(() => {
    if (!file) return setPreview(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status); // Ensure status is included
    formData.append('category_id', categoryId ? categoryId : null); // Ensure null for empty category
    if (file) formData.append('file', file);

    console.log('Submitting task with data:', {
      title,
      description,
      status,
      category_id: categoryId ? categoryId : null, // Debugging log
      file,
    });

    try {
      const response = await axiosInstance.put(`/tasks/${task.id}`, formData);

      if (response.status === 200 || response.status === 204) {
        console.log('Task updated successfully:', response.data);
        onEdit(); // Refresh task list
        onClose(); // Close modal
      } else {
        alert('Something went wrong: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating task:', err.response?.data || err.message);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>EDIT TASK</h3>
        {error && <p className="error-message">{error}</p>}
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

          <label htmlFor="status">Status:</label>
          <div className="custom-select-wrapper">
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <FaChevronDown className="select-arrow" />
          </div>

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
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}