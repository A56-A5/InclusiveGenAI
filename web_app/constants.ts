
import type { User, Post } from './types';

// Note: In a real app, never store plaintext passwords. This is for simulation purposes.
export const MOCK_USERS_WITH_PASSWORDS = [
  { id: 'user-1', username: 'alex_codes', avatarUrl: 'https://picsum.photos/seed/alex/100/100', password: 'password1' },
  { id: 'user-2', username: 'sara_designs', avatarUrl: 'https://picsum.photos/seed/sara/100/100', password: 'password2' },
  { id: 'user-3', username: 'mike_travels', avatarUrl: 'https://picsum.photos/seed/mike/100/100', password: 'password3' },
];

// This is the user data without passwords, safe to use throughout the app.
export const USERS: User[] = MOCK_USERS_WITH_PASSWORDS.map(({ password, ...user }) => user);

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    user: USERS[0],
    imageUrl: 'https://picsum.photos/seed/post1/600/600',
    caption: 'Exploring the serene beauty of the mountains. The air is so crisp and clean up here! #nature #mountains #adventure',
    aiCaption: 'A breathtaking mountain landscape with snow-capped peaks, lush green valleys, and clear blue skies. The scene captures the majestic beauty of nature with dramatic lighting.',
    likes: 128,
    isLiked: false,
    comments: [
      { id: 'comment-1-1', user: USERS[1], text: 'Wow, incredible view!', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: 'comment-1-2', user: USERS[2], text: 'I need to go there!', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'post-2',
    user: USERS[1],
    imageUrl: 'https://picsum.photos/seed/post2/600/750',
    caption: 'My latest UI/UX project is finally live. So proud of how the color palette turned out. What do you guys think? #uidesign #ux #webdev',
    aiCaption: 'A modern digital interface design with a sophisticated color palette featuring gradients and clean typography. The layout shows professional web design elements.',
    likes: 345,
    isLiked: true,
    comments: [
       { id: 'comment-2-1', user: USERS[0], text: 'Looks amazing, Sara!', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'post-3',
    user: USERS[2],
    imageUrl: 'https://picsum.photos/seed/post3/600/600',
    caption: 'Street food in a foreign city. The best way to experience a new culture. 🍜 #travel #foodie #explore',
    aiCaption: 'A vibrant street food scene with colorful dishes, steaming bowls of noodles, and local vendors. The atmosphere captures the energy and culture of street food markets.',
    likes: 210,
    isLiked: false,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];
