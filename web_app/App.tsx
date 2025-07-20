
import React, { useState, useEffect, useCallback } from 'react';
import type { Post, User } from './types';
import * as postService from './services/postService';
import * as authService from './services/authService';
import Header from './components/Header';
import Feed from './components/Feed';
import CreatePostModal from './components/CreatePostModal';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAuthLoading(false);
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const fetchedPosts = await postService.getPosts();
    setPosts(fetchedPosts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, fetchPosts]);

  const handleToggleLike = async (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
    await postService.toggleLike(postId);
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!currentUser) return;
    const newComment = await postService.addComment(postId, text, currentUser);
    if (newComment) {
      // Re-fetch to get the latest state with the new comment
      await fetchPosts();
    }
  };

  const handleAddPost = async (caption: string, imageUrl: string, aiCaption?: string) => {
    if (!currentUser) return;
    await postService.addPost(caption, imageUrl, currentUser, aiCaption);
    await fetchPosts(); // Re-fetch all posts to show the new one at the top
  };
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setPosts([]); // Clear posts on logout
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={currentUser}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading feed...</div>
        ) : (
          <Feed posts={posts} onToggleLike={handleToggleLike} onAddComment={handleAddComment} />
        )}
      </main>
      {isCreatePostOpen && (
        <CreatePostModal 
          onClose={() => setIsCreatePostOpen(false)}
          onAddPost={handleAddPost}
        />
      )}
    </div>
  );
};

export default App;
