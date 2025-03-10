'use client';

import { useEffect, useCallback, useRef, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPostItem } from './BlogPostItem';
import KeyboardHints from '../KeyboardHints';
import { AUTO_NAVIGATION_TIMEOUT } from './BlogPostList.constants';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  author?: {
    name?: string;
    avatar?: string;
    url?: string;
  };
}

interface BlogPostListProps {
  posts: Post[];
}

interface BlogPostListState {
  selectedIndex: number;
  isClient: boolean;
  isPressing: boolean;
  pressProgress: number;
}

type BlogPostListAction =
  | { type: 'SET_CLIENT' }
  | { type: 'SET_SELECTED_INDEX'; index: number }
  | { type: 'START_PRESSING' }
  | { type: 'STOP_PRESSING' }
  | { type: 'SET_PRESS_PROGRESS'; progress: number }
  | { type: 'RESET_PRESS_PROGRESS' };

function blogPostListReducer(state: BlogPostListState, action: BlogPostListAction): BlogPostListState {
  switch (action.type) {
    case 'SET_CLIENT':
      return { ...state, isClient: true };
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedIndex: action.index };
    case 'START_PRESSING':
      return { ...state, isPressing: true };
    case 'STOP_PRESSING':
      return { ...state, isPressing: false };
    case 'SET_PRESS_PROGRESS':
      return { ...state, pressProgress: action.progress };
    case 'RESET_PRESS_PROGRESS':
      return { ...state, pressProgress: 0 };
    default:
      return state;
  }
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  const initialState: BlogPostListState = {
    selectedIndex: 0,
    isClient: false,
    isPressing: false,
    pressProgress: 0,
  };

  const [state, dispatch] = useReducer(blogPostListReducer, initialState);
  const { selectedIndex, isClient, isPressing, pressProgress } = state;

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: 'SET_CLIENT' });
  }, []);

  // Handle press start and timeout
  useEffect(() => {
    if (isPressing && isClient) {
      pressStartTimeRef.current = Date.now();

      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }

      pressTimerRef.current = setTimeout(() => {
        if (posts[selectedIndex]) {
          dispatch({ type: 'STOP_PRESSING' });
          dispatch({ type: 'RESET_PRESS_PROGRESS' });
          router.push(`/blog/${posts[selectedIndex].slug}`);
        }
      }, AUTO_NAVIGATION_TIMEOUT);
    } else {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    }

    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, [isPressing, isClient, selectedIndex, posts, router]);

  // Handle animation separately
  useEffect(() => {
    const updateAnimation = () => {
      if (isPressing && isClient) {
        const elapsed = Date.now() - pressStartTimeRef.current;
        const progress = Math.min(elapsed / AUTO_NAVIGATION_TIMEOUT, 1);
        dispatch({ type: 'SET_PRESS_PROGRESS', progress });
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    if (isPressing && isClient) {
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (pressProgress > 0) {
        dispatch({ type: 'RESET_PRESS_PROGRESS' });
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPressing, isClient, dispatch]);

  const handleKeyNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        dispatch({
          type: 'SET_SELECTED_INDEX',
          index: selectedIndex > 0 ? selectedIndex - 1 : posts.length - 1,
        });
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        dispatch({
          type: 'SET_SELECTED_INDEX',
          index: selectedIndex < posts.length - 1 ? selectedIndex + 1 : 0,
        });
      } else if (e.key === 'Enter' && posts[selectedIndex]) {
        if (e.type === 'keydown') {
          e.preventDefault();
          dispatch({ type: 'START_PRESSING' });
        }
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    },
    [posts, selectedIndex, router]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && posts[selectedIndex]) {
        e.preventDefault();
        dispatch({ type: 'STOP_PRESSING' });
        if (pressProgress < 0.95) {
          router.push(`/blog/${posts[selectedIndex].slug}`);
        }
      }
    },
    [posts, selectedIndex, router, pressProgress]
  );

  const preventDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (isClient) {
        dispatch({ type: 'SET_SELECTED_INDEX', index });
      }
    },
    [isClient]
  );

  const handleMouseDown = useCallback(
    (index: number) => {
      if (isClient && selectedIndex === index) {
        dispatch({ type: 'START_PRESSING' });
      }
    },
    [isClient, selectedIndex]
  );

  const handleMouseUp = useCallback(
    (index: number) => {
      if (isClient && selectedIndex === index && isPressing) {
        dispatch({ type: 'STOP_PRESSING' });
        if (pressProgress < 0.95) {
          router.push(`/blog/${posts[selectedIndex].slug}`);
        }
      }
    },
    [isClient, selectedIndex, isPressing, pressProgress, router, posts]
  );

  const handleMouseLeave = useCallback(() => {
    if (isClient && isPressing) {
      dispatch({ type: 'STOP_PRESSING' });
    }
  }, [isClient, isPressing]);

  useEffect(() => {
    if (isClient) {
      window.addEventListener('keydown', handleKeyNavigation);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyNavigation);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [handleKeyNavigation, handleKeyUp, isClient]);

  if (posts.length === 0) {
    return (
      <p className="font-mono text-lg text-zinc-500 dark:text-zinc-400">No posts available yet. Check back soon!</p>
    );
  }

  return (
    <div className="mt-8 space-y-1 focus:outline-none" tabIndex={0}>
      {isClient && <KeyboardHints hints={['Use ↑/↓ or W/S to navigate', 'Enter to activate', 'Esc to return home']} />}

      {posts.map((post, index) => (
        <BlogPostItem
          key={post.slug}
          post={post}
          index={index}
          selectedIndex={selectedIndex}
          isPressing={isPressing}
          pressProgress={pressProgress}
          isClient={isClient}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          preventDrag={preventDrag}
        />
      ))}
    </div>
  );
}
