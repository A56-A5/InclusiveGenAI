
import type { Post, Comment, User } from '../types';
import { INITIAL_POSTS } from '../constants';

const POSTS_STORAGE_KEY = 'geminigram_posts';

// Hydrate dates from JSON strings
const hydratePost = (post: Post): Post => ({
  ...post,
  timestamp: new Date(post.timestamp),
  comments: post.comments.map(comment => ({
    ...comment,
    timestamp: new Date(comment.timestamp)
  }))
});

let posts: Post[] = (() => {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts) as Post[];
      return parsedPosts.map(hydratePost);
    }
  } catch (e) {
    console.error("Failed to parse posts from localStorage", e);
  }
  
  // If nothing in storage, seed it
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  return [...INITIAL_POSTS];
})();

const savePosts = () => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

const simulateDelay = <T,>(data: T, delay: number = 300): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getPosts = async (): Promise<Post[]> => {
  const sortedPosts = [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return simulateDelay(sortedPosts);
};

export const addPost = async (caption: string, imageUrl: string, user: User, aiCaption?: string): Promise<Post> => {
  const newPost: Post = {
    id: `post-${Date.now()}`,
    user,
    imageUrl,
    caption,
    aiCaption,
    likes: 0,
    isLiked: false,
    comments: [],
    timestamp: new Date(),
  };
  posts = [newPost, ...posts];
  savePosts();
  return simulateDelay(newPost);
};

export const toggleLike = async (postId: string): Promise<Post | null> => {
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const post = { ...posts[postIndex] };
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    posts[postIndex] = post;
    savePosts();
    return simulateDelay(post);
  }
  return Promise.resolve(null);
};

export const addComment = async (postId: string, text: string, user: User): Promise<Comment | null> => {
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const newComment: Comment = {
      id: `comment-${postId}-${Date.now()}`,
      user,
      text,
      timestamp: new Date(),
    };
    posts[postIndex].comments.push(newComment);
    savePosts();
    return simulateDelay(newComment);
  }
  return Promise.resolve(null);
};
