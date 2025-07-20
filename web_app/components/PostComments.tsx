
import React, { useState } from 'react';
import type { Post, Comment as CommentType } from '../types';

interface PostCommentsProps {
  post: Post;
  onAddComment: (postId: string, text: string) => void;
}

const timeSince = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  if (!targetDate || isNaN(targetDate.getTime())) {
    return '...'; // Fallback for invalid dates
  }

  const seconds = Math.floor((new Date().getTime() - targetDate.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(Math.max(0, seconds)) + "s";
}


const PostComments: React.FC<PostCommentsProps> = ({ post, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment('');
    }
  };
  
  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);

  return (
    <div className="px-4 pb-4">
      <p className="text-gray-800 text-sm mb-2">
        <span className="font-semibold">{post.user.username}</span> {post.caption}
      </p>

      {post.comments.length > 2 && !showAllComments && (
        <button onClick={() => setShowAllComments(true)} className="text-sm text-gray-500 mb-2">
          View all {post.comments.length} comments
        </button>
      )}

      <div className="space-y-1 text-sm">
        {displayedComments.map(comment => (
          <div key={comment.id} className="flex justify-between">
            <p>
              <span className="font-semibold">{comment.user.username}</span> {comment.text}
            </p>
            <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{timeSince(comment.timestamp)}</span>
          </div>
        ))}
      </div>
      
       {post.comments.length > 2 && showAllComments && (
        <button onClick={() => setShowAllComments(false)} className="text-sm text-gray-500 mt-2">
          Show less
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex items-center mt-3 border-t border-gray-200 pt-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-transparent text-sm border-none focus:ring-0"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="text-pink-500 font-semibold text-sm disabled:text-pink-300 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostComments;
