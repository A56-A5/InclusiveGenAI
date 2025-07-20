
import React, { useRef, useEffect, useState } from 'react';
import type { Post } from '../types';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import PostComments from './PostComments';

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  isActive: boolean;
  onSetActive: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onToggleLike, onAddComment, isActive, onSetActive }) => {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const postRef = useRef<HTMLElement>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const speechQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isSpeakingRef = useRef(false);

  const handleCommentClick = () => {
    // This is a placeholder for focusing the comment input.
    // In a real app, this might need more robust logic.
    const commentForm = document.querySelector(`form[data-post-id="${post.id}"] input`);
    if(commentForm) {
      (commentForm as HTMLInputElement).focus();
    }
  };

  // Queue-based readAloud function
  const readAloud = (text: string) => {
    if (!window.speechSynthesis) {
      console.log('❌ Speech synthesis not supported');
      return;
    }
    
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      console.log('🔊 Speech started:', text.substring(0, 50) + '...');
      isSpeakingRef.current = true;
    };
    
    utterance.onend = () => {
      console.log('🔇 Speech ended');
      isSpeakingRef.current = false;
      // Process next item in queue
      if (speechQueueRef.current.length > 0) {
        const nextUtterance = speechQueueRef.current.shift();
        if (nextUtterance) {
          window.speechSynthesis.speak(nextUtterance);
        }
      }
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      isSpeakingRef.current = false;
      // Process next item in queue even on error
      if (speechQueueRef.current.length > 0) {
        const nextUtterance = speechQueueRef.current.shift();
        if (nextUtterance) {
          window.speechSynthesis.speak(nextUtterance);
        }
      }
    };
    
    // Add to queue
    speechQueueRef.current.push(utterance);
    
    // Start speaking if not already speaking
    if (!isSpeakingRef.current) {
      window.speechSynthesis.speak(utterance);
    }
  };

  // Process post when it becomes active
  const processPost = () => {
    console.log('👁️ Processing active post:', post.id);
    setHasProcessed(true);

    // Clear any existing speech queue
    window.speechSynthesis.cancel();
    speechQueueRef.current = [];
    isSpeakingRef.current = false;

    // Read the post information in the specified format
    const postText = `${post.user.username} posted`;
    readAloud(postText);

    // Read the user's caption if available
    if (post.caption) {
      readAloud(`caption: ${post.caption}`);
    }

    // Read the stored AI caption if available
    if (post.aiCaption) {
      console.log('🔊 Reading stored AI caption for post:', post.id);
      readAloud(`image caption: ${post.aiCaption}`);
    } else {
      console.log('📝 No AI caption stored for post:', post.id);
    }
  };

  // Handle when post becomes active
  useEffect(() => {
    if (isActive && !hasProcessed) {
      // Process immediately when post becomes active
      processPost();
    }
  }, [isActive, hasProcessed]);

  // Reset when post becomes inactive
  useEffect(() => {
    if (!isActive) {
      setHasProcessed(false);
      // Stop any ongoing speech when post becomes inactive
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        speechQueueRef.current = [];
        isSpeakingRef.current = false;
      }
    }
  }, [isActive]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('👁️ Post became visible (intersection):', post.id);
            onSetActive(post.id);
          }
        });
      },
      {
        threshold: 0.7, // 70% visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [post.id, onSetActive]);

  return (
    <article 
      ref={postRef} 
      className={`bg-white border border-gray-300 rounded-lg my-4 overflow-hidden transition-all duration-300 ${
        isActive ? 'active ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <PostHeader user={post.user} />
      <img
        src={post.imageUrl}
        alt={`Post by ${post.user.username}`}
        className="w-full h-auto object-cover"
      />
      <PostActions
        isLiked={post.isLiked}
        onLike={() => onToggleLike(post.id)}
        onComment={handleCommentClick}
      />
      <div className="px-4 pb-1">
        <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>
        {post.aiCaption && (
          <p className="text-sm text-gray-600 mt-1">
            🧠 AI Caption: {post.aiCaption}
          </p>
        )}
      </div>
      <PostComments post={post} onAddComment={onAddComment} />
    </article>
  );
};

export default PostCard;
