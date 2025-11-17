import React from 'react';
import CategoryFilter from './filters/CategoryFilter';
import Pagination from './common/Pagination';
import PostList from './posts/PostList';
import PostToolbar from './posts/PostToolbar';
import { Category, Post } from '../types/posts';

interface HomePageProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (value: 'newest' | 'oldest') => void;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  displayedPosts: Post[];
  visibleCount: number;
  totalFiltered: number;
  onLoadMore: () => void;
}

function HomePage({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  isLoading,
  hasError,
  errorMessage,
  displayedPosts,
  visibleCount,
  totalFiltered,
  onLoadMore,
}: HomePageProps) {
  return (
    <main className="app-main">
      <div className="container layout">
        {/* Sidebar stays on the left on desktop and collapses above the content on mobile */}
        <aside className="sidebar" aria-label="Category filter">
          {categories.length > 0 ? (
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onToggle={onToggleCategory}
              onClear={onClearFilters}
            />
          ) : (
            <p className="category-filter__empty">
              {isLoading ? 'Loading categories…' : 'No categories to show yet.'}
            </p>
          )}
        </aside>

        <section className="posts-area">
          {isLoading && (
            <p className="status" role="status">
              Loading posts…
            </p>
          )}
          {hasError && (
            <p className="status status--error" role="alert">
              {errorMessage}
            </p>
          )}
          {!isLoading && !hasError && (
            <>
              {/* Search + sort controls live with the list so they remain close to the results */}
              <PostToolbar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
                totalResults={totalFiltered}
              />
              <PostList posts={displayedPosts} />
              <Pagination
                visibleCount={visibleCount}
                totalCount={totalFiltered}
                onLoadMore={onLoadMore}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default HomePage;
