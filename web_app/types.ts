
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  aiCaption?: string; // Hidden caption from API for voice output
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: Date;
}
