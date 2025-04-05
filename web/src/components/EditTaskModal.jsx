import { useState, useEffect } from 'react';
import './EditTaskModal.css';
import { FaChevronDown, FaTrash } from 'react-icons/fa';

// this modal is for users to edit an existing task
export default function EditTaskModal({ isOpen, onClose, task, onUpdate }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [categoryId, setCategoryId] = useState(task.category_id || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(task.image ? `http://localhost:3000/uploads/${task.image}` : null);
  const [categories, setCategories] = useState([]);

  // this tells us if the user removed the image (so we can update the backend accordingly)
const [removeImage, setRemoveImage] = useState(false);


  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3000/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
        setRemoveImage(false); // Reset image removal state

    }
  }, [isOpen]);

    // if user uploads a new file, generate a preview for it (so they can also delete it from this modal too if they want to)
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
  
    //  formdata for uploading a file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId || '');
    formData.append('status', task.status);
  
    if (file) {
      formData.append('file', file);
    }
  
    if (removeImage) {
      formData.append('remove_image', 'true'); // tells backend to remove existing image
    }
  
    const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      body: formData
    });
  
    const data = await res.json();
  
    if (res.ok) {
      onUpdate(); // refresh data in parent 
    } else {
      alert('Update failed: ' + (data?.message || 'Unknown error'));
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Category</label>
          <div className="custom-select-wrapper">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <FaChevronDown className="select-arrow" />
          </div>

          <label className="file-upload">
            Upload New Image (optional)
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
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
                  setRemoveImage(true); // tell backend to delete image

                }}
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit">Update Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
