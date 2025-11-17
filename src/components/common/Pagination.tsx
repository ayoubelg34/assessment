import React from 'react';

interface PaginationProps {
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
}

function Pagination({ visibleCount, totalCount, onLoadMore }: PaginationProps) {
  if (totalCount === 0) {
    return null;
  }

  const hasMore = visibleCount < totalCount;

  return (
    <div className="pagination">
      <p>
        Showing <strong>{Math.min(visibleCount, totalCount)}</strong> of{' '}
        <strong>{totalCount}</strong> posts
      </p>
      {hasMore && (
        // Button-only pagination keeps the UX simple for this small dataset.
        <button type="button" className="button" onClick={onLoadMore}>
          Load more
        </button>
      )}
      {!hasMore && (
        <p className="pagination__end" role="status">
          You&apos;re up to date.
        </p>
      )}
    </div>
  );
}

export default Pagination;
