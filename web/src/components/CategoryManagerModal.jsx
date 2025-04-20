import './CategoryManagerModal.css';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FaPen, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// This component lets users manage categories: add, edit, or delete them
export default function CategoryManagerModal({ isOpen, onClose, categories, onCategoryChange, onCategoryDeleted }) {
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '' }); // For new category form
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // Controls emoji picker visibility

  if (!isOpen) return null;

  // Add a new category to the backend
  const handleAdd = async () => {
    if (!newCategory.name) return;

    await fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    });

    // Reset state after adding
    setNewCategory({ name: '', emoji: '' });
    setIsAddingNew(false);
    setPickerTarget(null);
    onCategoryChange();  // refresh the list
  };

  // Update an existing category
  const handleEdit = async () => {
    await fetch(`http://localhost:3000/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCategory)
    });

    setEditingCategory(null);
    setPickerTarget(null);
    onCategoryChange(); // refresh the list
  };

  // Delete a category from the backend (this won't delete the tasks)
  const handleDelete = async (id) => {
    if (!confirm('The category will be deleted, but related tasks will remain. Are you sure?')) return;

    await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'DELETE'
    });

    onCategoryChange();
    onCategoryDeleted?.();
  };

  return (
    <div className="category-modal-overlay">
      <div className="category-modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Manage Categories</h3>

        <ul className="category-list">
          {categories.map(cat => (
            <li key={cat.id} className="category-item">
              {editingCategory?.id === cat.id ? (
                <>
                  {/* Edit form UI */}
                  <input
                    type="text"
                    value={`${editingCategory.emoji || ''} ${editingCategory.name}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(editingCategory.emoji || '', '').trimStart();
                      setEditingCategory({ ...editingCategory, name: val });
                    }}
                    placeholder="Category name"
                  />
                  <div className="emoji-picker-row">
                    <button
                      type="button"
                      className={`emoji-btn ${pickerTarget === cat.id ? 'active' : ''}`}
                      onClick={() => setPickerTarget(pickerTarget === cat.id ? null : cat.id)}
                    >
                      {editingCategory.emoji || '♥️'} Pick Emoji
                    </button>
                    {pickerTarget === cat.id && (
                      <div className="emoji-popover">
                        <EmojiPicker
                          onEmojiClick={(emojiData) =>
                            setEditingCategory({ ...editingCategory, emoji: emojiData.emoji })
                          }
                          theme="dark"
                        />
                      </div>
                    )}
                  </div>
                  <button className="icon-btn confirm" onClick={handleEdit}>
                    <FaCheck size={16} />
                  </button>
                  <button className="icon-btn cancel" onClick={() => {
                    setEditingCategory(null);
                    setPickerTarget(null);
                  }}>
                    <FaTimes size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span>{cat.emoji ? `${cat.emoji} ` : ''}{cat.name}</span>
                  <div className="actions">
                    <button className="icon-btn" onClick={() => setEditingCategory(cat)}>
                      <FaPen size={16} color="#ffffff" />
                    </button>
                    <button className="icon-btn" onClick={() => handleDelete(cat.id)}>
                      <FaTrash size={16} color="#ffffff" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}

          {isAddingNew ? (
            <li className="category-item">
              {/* New category form */}
              <input
                type="text"
                placeholder="New category name"
                value={`${newCategory.emoji || ''} ${newCategory.name}`}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    name: e.target.value.replace(newCategory.emoji || '', '').trimStart()
                  })
                }
              />
              <div className="emoji-picker-row">
                <button
                  type="button"
                  className={`emoji-btn ${pickerTarget === 'new' ? 'active' : ''}`}
                  onClick={() => setPickerTarget(pickerTarget === 'new' ? null : 'new')}
                >
                  {newCategory.emoji || '♥️'} Pick Emoji
                </button>
                {pickerTarget === 'new' && (
                  <div className="emoji-popover">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setNewCategory({ ...newCategory, emoji: emojiData.emoji });
                        setPickerTarget(null);
                      }}
                      theme="dark"
                    />
                  </div>
                )}
              </div>
              <button className="icon-btn confirm" onClick={handleAdd}>
                <FaCheck size={16} />
              </button>
              <button
                className="icon-btn cancel"
                onClick={() => {
                  setNewCategory({ name: '', emoji: '' });
                  setIsAddingNew(false);
                  setPickerTarget(null);
                }}
              >
                <FaTimes size={16} />
              </button>
            </li>
          ) : (
            <li>
              <button
                className="new-category-btn"
                onClick={() => setIsAddingNew(true)}
              >
                + New
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}