import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/posts';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  // Converting the ISO string once per card keeps the JSX lean.
  const dateLabel = React.useMemo(() => {
    return new Date(post.publishDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [post.publishDate]);

  return (
    <article className="post-card">
      <header className="post-card__header">
        <div className="post-card__author">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author?.name || 'Author avatar'}
              className="post-card__avatar"
              loading="lazy"
            />
          )}
          <div>
            <p className="post-card__author-name">{post.author?.name}</p>
            <time
              className="post-card__date"
              dateTime={post.publishDate}
              aria-label="Publish date"
            >
              {dateLabel}
            </time>
          </div>
        </div>
        <h3 className="post-card__title">{post.title}</h3>
      </header>
      <p className="post-card__summary">{post.summary}</p>
      <ul className="post-card__categories">
        {post.categories?.map((category) => (
          <li key={category.id} className="post-card__category">
            {category.name}
          </li>
        ))}
      </ul>
      <Link to={`/posts/${post.id}`} className="post-card__link">
        Read more →
      </Link>
    </article>
  );
}

export default PostCard;
