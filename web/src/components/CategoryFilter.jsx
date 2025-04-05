import './CategoryFilter.css';
import { FaPen, FaTrash } from 'react-icons/fa';

export default function CategoryFilter({ categories, selected, onSelect, onManageClick }) {
  return (
    <div className="category-filter-container">
      <div className="category-filter-wrapper">
        <div className="category-pills">
          <span className="category-label">Categories:</span>
          <button className={`pill ${selected === 'All' ? 'active' : ''}`} onClick={() => onSelect('All')}>
            All
          </button>
          {categories.map(cat => (
  <button
    key={cat.id}
    className={`pill ${selected === cat.name ? 'active' : ''}`}
    onClick={() => onSelect(cat.name)}
  >
    {cat.emoji && <span className="emoji">{cat.emoji}</span>} {cat.name}
  </button>
))}
        </div>
      </div>
      <button className="pill-icon manage-btn" title="Manage Categories" onClick={onManageClick}>
  <FaPen size={30} color="#ffffff" />
</button>

    </div>
  );
}
