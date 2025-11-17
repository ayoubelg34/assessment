import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Post } from '../../types/posts';

interface PostDetailProps {
  posts: Post[];
  status: 'idle' | 'loading' | 'success' | 'error';
}

function PostDetail({ posts, status }: PostDetailProps) {
  const { postId } = useParams<{ postId: string }>();

  // Grab the post from the already-fetched list to avoid a second network roundtrip.
  const post = React.useMemo(() => {
    return posts.find((entry) => entry.id === postId);
  }, [posts, postId]);

  const dateLabel = React.useMemo(() => {
    if (!post) return '';
    return new Date(post.publishDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [post]);

  if (status === 'loading') {
    // When the user loads a detail page directly we still show the loader while the list fetches.
    return (
      <main className="detail-main">
        <div className="container">
          <p className="status" role="status">
            Loading post…
          </p>
        </div>
      </main>
    );
  }

  if (!post) {
    // The user might refresh on an id that no longer exists, so give them a graceful exit.
    return (
      <main className="detail-main">
        <div className="container">
          <p className="status status--error" role="alert">
            This post could not be found.
          </p>
          <Link to="/" className="button button--inline">
            Back to all posts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detail-main">
      <div className="container">
        <article className="post-detail">
          <header className="post-detail__header">
            <Link to="/" className="back-link">
              ← Back to posts
            </Link>
            <h2>{post.title}</h2>
            <div className="post-detail__meta">
              {post.author?.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author?.name || 'Author avatar'}
                  className="post-detail__avatar"
                />
              )}
              <div>
                <p className="post-detail__author">{post.author?.name}</p>
                <time dateTime={post.publishDate}>{dateLabel}</time>
              </div>
            </div>
            <ul className="post-detail__categories">
              {post.categories?.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </header>
          <section className="post-detail__body">
            <p>{post.summary}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              vitae ipsum a urna tempus efficitur. Integer id massa nec libero
              eleifend feugiat a vel dolor.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

export default PostDetail;
