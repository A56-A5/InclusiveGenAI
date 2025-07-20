
import React from 'react';
import Icon from './Icon';

interface PostActionsProps {
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
}

const ICON_PATHS = {
  HEART_SOLID: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  HEART_OUTLINE: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z",
  COMMENT: "M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
};

const PostActions: React.FC<PostActionsProps> = ({ isLiked, onLike, onComment }) => {
  return (
    <div className="flex items-center px-4 pt-2 pb-1">
      <button onClick={onLike} className="p-2 -ml-2" aria-label="Like post">
        <Icon 
          path={isLiked ? ICON_PATHS.HEART_SOLID : ICON_PATHS.HEART_OUTLINE}
          className={`w-7 h-7 transition-transform duration-200 ease-in-out ${isLiked ? 'text-red-500 scale-110' : 'text-gray-800 hover:text-gray-500'}`} 
        />
      </button>
      <button onClick={onComment} className="p-2" aria-label="Comment on post">
        <Icon path={ICON_PATHS.COMMENT} className="w-7 h-7 text-gray-800 hover:text-gray-500" />
      </button>
    </div>
  );
};

export default PostActions;
