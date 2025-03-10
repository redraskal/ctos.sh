'use client';

import { ReactNode, useRef, useEffect, useReducer } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTerminal } from '@/app/(terminal)/contexts/TerminalContext';
import { ResizeHandles } from './ResizeHandles';
import { TitleBar } from './TitleBar';
import { ContentSection } from './ContentSection';
import { Footer } from './Footer';
import { NAV_ITEMS } from './TerminalWindow.constants';

interface TerminalWindowProps {
  children: ReactNode;
  defaultContent?: string;
  onContentChange?: (content: string) => void;
  onHalClick?: () => void;
  isGameTerminal?: boolean;
  onClose?: () => void;
  onGameTerminalToggle?: () => void;
  terminalId: string;
}

interface TerminalState {
  isDragging: boolean;
  isResizing: boolean;
  resizeDirection: string;
  dragStart: { x: number; y: number };
  size: { width: number; height: number };
  isMobile: boolean;
}

type TerminalAction =
  | { type: 'START_DRAG'; payload: { x: number; y: number } }
  | { type: 'STOP_DRAG' }
  | { type: 'START_RESIZE'; payload: { direction: string; x: number; y: number } }
  | { type: 'STOP_RESIZE' }
  | { type: 'UPDATE_SIZE'; payload: { width: number; height: number } }
  | { type: 'UPDATE_DRAG'; payload: { x: number; y: number } }
  | { type: 'SET_MOBILE'; payload: boolean };

function reducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'START_DRAG':
      return { ...state, isDragging: true, dragStart: action.payload };
    case 'STOP_DRAG':
      return { ...state, isDragging: false };
    case 'START_RESIZE':
      return {
        ...state,
        isResizing: true,
        resizeDirection: action.payload.direction,
        dragStart: { x: action.payload.x, y: action.payload.y },
      };
    case 'STOP_RESIZE':
      return { ...state, isResizing: false, resizeDirection: '' };
    case 'UPDATE_SIZE':
      return { ...state, size: action.payload };
    case 'UPDATE_DRAG':
      return { ...state, dragStart: action.payload };
    case 'SET_MOBILE':
      return { ...state, isMobile: action.payload };
    default:
      return state;
  }
}

export default function TerminalWindow({
  children,
  defaultContent,
  onContentChange,
  onHalClick,
  isGameTerminal,
  onClose,
  terminalId,
}: TerminalWindowProps) {
  const [state, dispatch] = useReducer(reducer, {
    isDragging: false,
    isResizing: false,
    resizeDirection: '',
    dragStart: { x: 0, y: 0 },
    size: {
      width: typeof window !== 'undefined' ? (window.innerWidth < 768 ? window.innerWidth : 1024) : 1024,
      height:
        typeof window !== 'undefined'
          ? window.innerWidth < 768
            ? window.innerHeight
            : isGameTerminal
              ? 600
              : 700
          : 700,
    },
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  });

  const isInitialized = useRef(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { terminalStates, updateTerminalPosition, bringToFront } = useTerminal();
  const { position } = terminalStates[terminalId];

  const title = isGameTerminal
    ? 'WOPR - THERMONUCLEAR WAR'
    : `/var/www/html${pathname === '/' ? '/index.html' : pathname + '.html'}`;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      dispatch({ type: 'SET_MOBILE', payload: mobile });

      if (mobile) {
        dispatch({ type: 'UPDATE_SIZE', payload: { width: window.innerWidth, height: window.innerHeight } });
        updateTerminalPosition(terminalId, { x: 0, y: 0 });
      } else if (!isInitialized.current) {
        dispatch({ type: 'UPDATE_SIZE', payload: { width: 1024, height: isGameTerminal ? 600 : 700 } });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    isInitialized.current = true;

    return () => window.removeEventListener('resize', handleResize);
  }, [terminalId, isGameTerminal, updateTerminalPosition]);

  // Remove tilde key handler since it's now handled globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !isNaN(Number(e.key))) {
        const index = Number(e.key) - 1;
        if (index >= 0 && index < NAV_ITEMS.length) {
          const targetPath = NAV_ITEMS[index].path;
          if (targetPath !== pathname) {
            e.preventDefault();
            router.push(targetPath);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging && !state.isResizing) return;

      if (state.isDragging) {
        const deltaX = e.clientX - state.dragStart.x;
        const deltaY = e.clientY - state.dragStart.y;

        updateTerminalPosition(terminalId, {
          x: position.x + deltaX,
          y: position.y + deltaY,
        });

        dispatch({ type: 'UPDATE_DRAG', payload: { x: e.clientX, y: e.clientY } });
      }

      if (state.isResizing) {
        const deltaX = e.clientX - state.dragStart.x;
        const deltaY = e.clientY - state.dragStart.y;

        dispatch({ type: 'UPDATE_DRAG', payload: { x: e.clientX, y: e.clientY } });

        dispatch({
          type: 'UPDATE_SIZE',
          payload: {
            width: Math.max(400, state.size.width + (state.resizeDirection.includes('e') ? deltaX : 0)),
            height: Math.max(300, state.size.height + (state.resizeDirection.includes('s') ? deltaY : 0)),
          },
        });
      }
    };

    if (state.isDragging || state.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state, position, updateTerminalPosition, terminalId]);

  const handleMouseUp = () => {
    dispatch({ type: 'STOP_DRAG' });
    dispatch({ type: 'STOP_RESIZE' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (terminalRef.current && e.target === terminalRef.current.querySelector('.terminal-title-bar')) {
      dispatch({ type: 'START_DRAG', payload: { x: e.clientX, y: e.clientY } });
      bringToFront(terminalId);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    dispatch({ type: 'START_RESIZE', payload: { direction, x: e.clientX, y: e.clientY } });
  };

  return (
    <div
      ref={terminalRef}
      className={`font-mono ${state.isMobile ? 'fixed inset-0' : ''}`}
      style={{
        transform: state.isMobile ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        transition: state.isDragging || state.isResizing ? 'none' : 'transform 0.1s ease-out',
        zIndex: terminalStates[terminalId].zIndex,
        width: state.size.width,
        height: state.size.height,
      }}
      onMouseDown={!state.isMobile ? handleMouseDown : undefined}
      suppressHydrationWarning
    >
      {/* resize handles for large screens */}
      {!state.isMobile && <ResizeHandles handleResizeStart={handleResizeStart} />}

      <div
        className="
        relative
        h-full
        flex flex-col
        border-2 border-white/30
        bg-black/80 backdrop-blur-md
        shadow-[0_0_15px_rgba(0,0,0,0.5)]
        overflow-hidden
        rounded-md
      "
      >
        <TitleBar title={title} isGameTerminal={isGameTerminal} isMobile={state.isMobile} onClose={onClose} />

        <ContentSection
          isGameTerminal={isGameTerminal}
          defaultContent={defaultContent}
          onContentChange={onContentChange}
        >
          {children}
        </ContentSection>

        <Footer isGameTerminal={isGameTerminal} isMobile={state.isMobile} onHalClick={onHalClick} />
      </div>
    </div>
  );
}
