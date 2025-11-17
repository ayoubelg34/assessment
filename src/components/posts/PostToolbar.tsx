import React from 'react';

interface PostToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (value: 'newest' | 'oldest') => void;
  totalResults: number;
}

function PostToolbar({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  totalResults,
}: PostToolbarProps) {
  return (
    <section className="post-toolbar" aria-label="Search and sorting">
      <div className="post-toolbar__search">
        {/* Search input controls both title + summary because that’s what product asked for */}
        <label htmlFor="post-search">Search posts</label>
        <div className="post-toolbar__search-input">
          <span className="post-toolbar__search-icon" aria-hidden="true" />
          <input
            id="post-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, summary, or author"
          />
          {searchQuery && (
            <button
              type="button"
              className="link-button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="post-toolbar__sort">
        <label htmlFor="post-sort">Sort by</label>
        <select
          id="post-sort"
          value={sortOrder}
          onChange={(event) =>
            onSortChange(event.target.value as 'newest' | 'oldest')
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Quick feedback so the user knows the search really filtered the list */}
      <p className="post-toolbar__results">
        {totalResults} {totalResults === 1 ? 'result' : 'results'}
      </p>
    </section>
  );
}

export default PostToolbar;
