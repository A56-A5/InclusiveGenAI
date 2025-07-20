
import React from 'react';
import type { User } from '../types';

interface PostHeaderProps {
  user: User;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user }) => (
  <div className="flex items-center p-4">
    <img
      src={user.avatarUrl}
      alt={`${user.username}'s avatar`}
      className="w-8 h-8 rounded-full object-cover"
    />
    <span className="ml-3 font-semibold text-sm text-gray-800">{user.username}</span>
  </div>
);

export default PostHeader;
