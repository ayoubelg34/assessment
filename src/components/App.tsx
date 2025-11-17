import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useSearchParams } from 'react-router-dom';
import HomePage from './HomePage';
import PostDetail from './posts/PostDetail';
import { Post, PostsResponse, Category } from '../types/posts';

const PAGE_SIZE = 6;
type Status = 'idle' | 'loading' | 'success' | 'error';
type SortOrder = 'newest' | 'oldest';

const normaliseCategory = (category: Category): Category => {
  const name = category.name.trim();
  const key = name.toLowerCase();
  return { id: key, name };
};

const dedupeCategories = (categories?: Category[]): Category[] => {
  if (!categories) return [];

  const unique = new Map<string, Category>();
  categories.forEach((category) => {
    const normalized = normaliseCategory(category);
    if (!unique.has(normalized.id)) {
      unique.set(normalized.id, normalized);
    }
  });
  return Array.from(unique.values());
};

const normalisePosts = (rawPosts: Post[]): Post[] => {
  return rawPosts.map((post) => ({
    ...post,
    categories: dedupeCategories(post.categories),
  }));
};

function App() {
  // Master copy of posts fetched from MirageJS.
  const [posts, setPosts] = useState<Post[]>([]);
  // Used to drive loading and error states from a single flag.
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  // Controls pagination window size for the “Load more” feature.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Search & ordering inputs are stored at the top so multiple components stay in sync.
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategories = useMemo<string[]>(() => {
    const fromParams = searchParams.get('categories');
    if (!fromParams) return [];
    // Query param is a comma separated string. Using a Set prevents duplicates when editing the URL manually.
    return Array.from(new Set(fromParams.split(',').filter(Boolean)));
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategories, searchQuery, sortOrder]);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');

    fetch('/api/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load posts.');
        }
        return response.json();
      })
      .then((payload: PostsResponse) => {
        if (!isMounted) return;
        // Clean up data before storing it so the UI only deals with deduplicated records.
        setPosts(normalisePosts(payload.posts ?? []));
        setStatus('success');
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorMessage('Something went wrong while fetching posts.');
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueByName = new Map<string, Category>();

    posts.forEach((post) => {
      post.categories?.forEach((category) => {
        const normalized = normaliseCategory(category);

        if (!uniqueByName.has(normalized.id)) {
          uniqueByName.set(normalized.id, normalized);
        }
      });
    });

    return Array.from(uniqueByName.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [posts]);


  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let processed = posts;

    if (selectedCategories.length > 0) {
      processed = processed.filter((post) =>
        post.categories?.some((category) =>
          selectedCategories.includes(category.id)
        )
      );
    }

    if (query) {
      // Lightweight search across title, summary and author name.
      processed = processed.filter((post) => {
        const authorName = post.author?.name?.toLowerCase() || '';
        return (
          post.title.toLowerCase().includes(query) ||
          post.summary.toLowerCase().includes(query) ||
          authorName.includes(query)
        );
      });
    }

    return [...processed].sort((a, b) => {
      // Sorting stays stable because we sort a shallow copy of the array.
      const aTime = new Date(a.publishDate).getTime();
      const bTime = new Date(b.publishDate).getTime();
      if (sortOrder === 'newest') {
        return bTime - aTime;
      }
      return aTime - bTime;
    });
  }, [posts, selectedCategories, searchQuery, sortOrder]);

  const displayedPosts = useMemo(() => {
    // Pagination is a simple slice because the dataset is static; no server paging needed.
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleToggleCategory = (categoryId: string) => {
    const isActive = selectedCategories.includes(categoryId);
    const next = isActive
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    const nextParams = new URLSearchParams(searchParams);
    if (next.length) {
      nextParams.set('categories', next.join(','));
    } else {
      nextParams.delete('categories');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    // Clearing happens entirely through the URL, keeping the source of truth consistent.
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('categories');
    setSearchParams(nextParams, { replace: true });
  };

  const handleLoadMore = () => {
    // We guard against overshooting when the filtered list shrinks.
    setVisibleCount((current) =>
      Math.min(current + PAGE_SIZE, filteredPosts.length)
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value: SortOrder) => {
    // Sorting only flips the direction at the moment, so we store the enum as-is.
    setSortOrder(value);
  };

  const isLoading = status === 'loading';
  const hasError = status === 'error';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <p className="eyebrow">Lizard Global Assessment by Ayoub EL GHAZI</p>
          <div className="app-header__top">
            <h1>Insights & Stories</h1>
              <Link to="/" className="home-link">
                All posts
              </Link>
          </div>
          <p className="subtitle">
            Browse the latest product news, marketing tips, and best practices.
          </p>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onClearFilters={handleClearFilters}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              isLoading={isLoading}
              hasError={hasError}
              errorMessage={errorMessage}
              displayedPosts={displayedPosts}
              visibleCount={visibleCount}
              totalFiltered={filteredPosts.length}
              onLoadMore={handleLoadMore}
            />
          }
        />
        <Route
          path="/posts/:postId"
          element={<PostDetail posts={posts} status={status} />}
        />
      </Routes>

      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Lizard Global. Built with ReactLizard.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
