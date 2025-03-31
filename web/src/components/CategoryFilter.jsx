
// CategoryFilter.jsx
import './CategoryFilter.css';

const categories = ['All', 'Work', 'BCIT', 'Chores'];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-filter">
      <span>Categories:</span>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`pill ${selected === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
      <button className="pill add">+</button>
    </div>
  );
}
