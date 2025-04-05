import { useState, useEffect } from 'react';
import './AddTaskModal.css';

export default function AddTaskModal({ isOpen, onClose, onAdd, currentColumn }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3000/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!file) return setPreview(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId || '');    formData.append('status', currentColumn);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        onAdd();
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Task Title:</label>
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
            placeholder="Optional description"
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
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
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

          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <div className="modal-actions">
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
