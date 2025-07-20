
import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onToggleLike, onAddComment }) => {
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Set the first post as active initially
  useEffect(() => {
    if (posts.length > 0 && !activePostId) {
      setActivePostId(posts[0].id);
    }
  }, [posts, activePostId]);

  const handleSetActive = (postId: string) => {
    setActivePostId(postId);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600">No posts yet.</h2>
        <p className="text-gray-400">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          onAddComment={onAddComment}
          isActive={activePostId === post.id}
          onSetActive={handleSetActive}
        />
      ))}
    </div>
  );
};

export default Feed;
