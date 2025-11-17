import React from 'react';
import { Category } from '../../types/posts';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (categoryId: string) => void;
  onClear: () => void;
}

function CategoryFilter({
  categories,
  selectedCategories,
  onToggle,
  onClear,
}: CategoryFilterProps) {
  return (
    <section className="category-filter">
      <header>
        <h2>Categories</h2>
        <p>Toggle a category to narrow the posts list.</p>
      </header>
      <div className="category-filter__actions">
        {selectedCategories.length > 0 && (
          // Clearing only appears when needed so the UI stays calm.
          <button type="button" className="link-button" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
      {/* We keep the filter controls as buttons so they are operable via keyboard */}
      <ul className="category-filter__list">
        {categories.map((category) => {
          const isActive = selectedCategories.includes(category.id);
          return (
            <li key={category.id}>
              <button
                type="button"
                className={`category-filter__button ${
                  isActive ? 'is-active' : ''
                }`}
                onClick={() => onToggle(category.id)}
                aria-pressed={isActive}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default CategoryFilter;
