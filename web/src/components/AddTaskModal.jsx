import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig'; 
import './AddTaskModal.css';
import { FaChevronDown, FaTrash } from 'react-icons/fa';

export default function AddTaskModal({ isOpen, onClose, onAdd, currentColumn }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await axiosInstance.get('/categories');
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    }
  };

  // Generate image preview when a file is selected
  useEffect(() => {
    if (!file) return setPreview(null);
    console.log('Generating preview for file:', file.name);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    console.log('Submitting task:', { title, description, categoryId, currentColumn, file });
    if (!title.trim()) {
      alert('Title is required!');
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId || '');
    formData.append('status', currentColumn); // Use the current column as the default status
    if (file) formData.append('file', file);
  
    try {
      const response = await axiosInstance.post('/tasks', formData);
      console.log('Task creation response:', response);
  
      if (response.status === 200 || response.status === 201) {
        console.log('Task created successfully:', response.data);
        onAdd(); // Refresh task list
        onClose(); // Close modal
        resetForm(); // Clear form fields
      } else {
        console.error('Unexpected response:', response);
        alert('Something went wrong: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error submitting task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setFile(null);
    setPreview(null);
  };

  // If modal is not open, don’t render anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>ADD NEW TASK</h3>
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
              {loading ? 'Adding Task...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}