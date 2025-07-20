
import React from 'react';
import Icon from './Icon';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenCreatePost: () => void;
  onLogout: () => void;
}

const ICON_PATHS = {
  ADD: "M12 4.5C11.5858 4.5 11.25 4.83579 11.25 5.25V11.25H5.25C4.83579 11.25 4.5 11.5858 4.5 12C4.5 12.4142 4.83579 12.75 5.25 12.75H11.25V18.75C11.25 19.1642 11.5858 19.5 12 19.5C12.4142 19.5 12.75 19.1642 12.75 18.75V12.75H18.75C19.1642 12.75 19.5 12.4142 19.5 12C19.5 11.5858 19.1642 11.25 18.75 11.25H12.75V5.25C12.75 4.83579 12.4142 4.5 12 4.5Z",
  LOGOUT: "M15.75 9.75l-4.5 4.5-4.5-4.5" // Simplified path, using transform for arrow direction
};

const Header: React.FC<HeaderProps> = ({ user, onOpenCreatePost, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-2xl font-serif italic font-semibold text-primary">sensora.ai</h1>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
                <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full object-cover"/>
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.username}</span>
            </div>
            <button
              onClick={onOpenCreatePost}
              className="p-2 rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="Create new post"
            >
              <Icon path={ICON_PATHS.ADD} className="w-7 h-7 text-primary" />
            </button>
             <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="Logout"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
