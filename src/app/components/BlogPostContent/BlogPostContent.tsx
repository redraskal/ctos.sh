'use client';

import { useEffect, useRef, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { findFocusableElements, findAuthorLink } from './BlogPostContent.helpers';
import { FOCUS_STYLE, INACTIVITY_TIMEOUT } from './BlogPostContent.constants';

interface BlogPostContentProps {
  children: React.ReactNode;
}

interface BlogPostContentState {
  currentFocusIndex: number;
  focusableElements: HTMLElement[];
  showFocusIndicator: boolean;
  isKeyboardMode: boolean;
}

type BlogPostContentAction =
  | { type: 'SET_FOCUS_INDEX'; index: number }
  | { type: 'SET_FOCUSABLE_ELEMENTS'; elements: HTMLElement[] }
  | { type: 'SHOW_FOCUS_INDICATOR' }
  | { type: 'HIDE_FOCUS_INDICATOR' }
  | { type: 'ENABLE_KEYBOARD_MODE' }
  | { type: 'NEXT_FOCUS' }
  | { type: 'PREV_FOCUS' };

function blogPostContentReducer(state: BlogPostContentState, action: BlogPostContentAction): BlogPostContentState {
  switch (action.type) {
    case 'SET_FOCUS_INDEX':
      return { ...state, currentFocusIndex: action.index };
    case 'SET_FOCUSABLE_ELEMENTS':
      return { ...state, focusableElements: action.elements };
    case 'SHOW_FOCUS_INDICATOR':
      return { ...state, showFocusIndicator: true };
    case 'HIDE_FOCUS_INDICATOR':
      return { ...state, showFocusIndicator: false };
    case 'ENABLE_KEYBOARD_MODE':
      return { ...state, isKeyboardMode: true };
    case 'NEXT_FOCUS':
      return {
        ...state,
        currentFocusIndex:
          state.currentFocusIndex < state.focusableElements.length - 1 ? state.currentFocusIndex + 1 : 0,
      };
    case 'PREV_FOCUS':
      return {
        ...state,
        currentFocusIndex:
          state.currentFocusIndex > 0 ? state.currentFocusIndex - 1 : state.focusableElements.length - 1,
      };
    default:
      return state;
  }
}

export default function BlogPostContent({ children }: BlogPostContentProps) {
  const [state, dispatch] = useReducer(blogPostContentReducer, {
    currentFocusIndex: -1,
    focusableElements: [],
    showFocusIndicator: false,
    isKeyboardMode: false,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const authorLinkRef = useRef<string | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const timer = setTimeout(() => {
        const container = contentRef.current;
        if (!container) return;

        dispatch({ type: 'SET_FOCUSABLE_ELEMENTS', elements: findFocusableElements(container) });
        authorLinkRef.current = findAuthorLink(container);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    dispatch({ type: 'SHOW_FOCUS_INDICATOR' });

    inactivityTimerRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE_FOCUS_INDICATOR' });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const { currentFocusIndex, focusableElements, isKeyboardMode } = state;

    if (currentFocusIndex >= 0 && currentFocusIndex < focusableElements.length) {
      const element = focusableElements[currentFocusIndex];
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (isKeyboardMode) {
          resetInactivityTimer();
          element.classList.add('keyboard-focus-element');

          return () => {
            element.classList.remove('keyboard-focus-element');
          };
        }
      }
    }
  }, [state.currentFocusIndex, state.focusableElements, state.isKeyboardMode]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { isKeyboardMode, focusableElements, currentFocusIndex } = state;

      if (!isKeyboardMode && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Tab')) {
        dispatch({ type: 'ENABLE_KEYBOARD_MODE' });
      }

      if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && focusableElements.length > 0) {
        e.preventDefault();
        dispatch({ type: 'NEXT_FOCUS' });
      } else if ((e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) && focusableElements.length > 0) {
        e.preventDefault();
        dispatch({ type: 'PREV_FOCUS' });
      }

      if (['ArrowDown', 'ArrowUp', 'Tab'].includes(e.key) && isKeyboardMode) {
        resetInactivityTimer();
      } else if (e.key === 'Enter') {
        const currentElement = focusableElements[currentFocusIndex];

        if (currentElement && currentElement.classList.contains('author-info') && authorLinkRef.current) {
          e.preventDefault();
          if (authorLinkRef.current.startsWith('/')) {
            router.push(authorLinkRef.current);
          } else {
            window.open(authorLinkRef.current, '_blank');
          }
        } else if (currentElement && currentElement.tagName === 'A') {
          e.preventDefault();
          const href = currentElement.getAttribute('href');
          if (href) {
            if (href.startsWith('/')) {
              router.push(href);
            } else {
              window.open(href, '_blank');
            }
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/blog');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, router]);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = FOCUS_STYLE.replace('var(--focus-opacity, 1)', state.showFocusIndicator ? '1' : '0');
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [state.showFocusIndicator, state.isKeyboardMode]);

  return (
    <div ref={contentRef} className="relative" tabIndex={-1}>
      {children}
    </div>
  );
}
