import React from 'react';
import PostCard from './PostCard';
import { Post } from '../../types/posts';

interface PostListProps {
  posts: Post[];
}

function PostList({ posts }: PostListProps) {
  if (!posts.length) {
    return (
      <p className="post-list__empty" role="status">
        No posts match the current filters.
      </p>
    );
  }

  return (
    <ul className="post-list">
      {/* Staggered animation makes filtering changes easier to follow */}
      {posts.map((post, index) => {
        const style: React.CSSProperties = {
          animationDelay: `${index * 60}ms`,
        };
        return (
          <li key={post.id} className="post-list__item" style={style}>
            <PostCard post={post} />
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;
