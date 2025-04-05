import './CategoryFilter.css';

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
              {cat.emoji ? `${cat.emoji} ` : ''}{cat.name}
            </button>
          ))}
        </div>
      </div>
      <button className="pill-icon manage-btn" title="Manage Categories" onClick={onManageClick}>→</button>
    </div>
  );
}
