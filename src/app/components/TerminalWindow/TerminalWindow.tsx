'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTerminal } from '@/app/contexts/TerminalContext';
import TerminalEffects from './TerminalEffects';

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

interface Size {
  width: number;
  height: number;
}

interface NavItem {
  label: string;
  path: string;
  shortcut: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'PROFILE', path: '/', shortcut: 'Alt+1' },
  { label: 'PROJECTS', path: '/projects', shortcut: 'Alt+2' },
  { label: 'EXPERIENCE', path: '/experience', shortcut: 'Alt+3' },
  { label: 'CONTACT', path: '/contact', shortcut: 'Alt+4' },
];

function TerminalControl({ label, color, pulseColor, onClick }: { label: string; color: string; pulseColor: string; onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div className="group relative hover:cursor-pointer" onClick={handleClick}>
      {/* button */}
      <div className={`
        w-12 h-5
        ${color}
        border border-white/20
        shadow-[inset_0_0_2px_rgba(255,255,255,0.5)]
        skew-x-12
        select-none
      `}>
        {/* LED */}
        <div className={`
          absolute right-1 top-1/2 -translate-y-1/2
          w-1.5 h-1.5
          ${pulseColor}
          rounded-full
          shadow-[0_0_5px_currentColor]
          animate-pulse
        `} />
      </div>
      
      {/* label */}
      <span className="
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        text-[8px] font-bold tracking-wider
        text-white/70
        group-hover:text-white
        transition-colors
        select-none
      ">
        {label}
      </span>

      {/* glow */}
      <div className={`
        absolute inset-0
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        shadow-[0_0_10px_rgba(255,255,255,0.3)]
        skew-x-12
      `} />
    </div>
  );
}

function CodeEditorContent({ 
  children,
  defaultContent,
  onContentChange 
}: { 
  children?: ReactNode;
  defaultContent?: string;
  onContentChange?: (content: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Update line count when content changes
  useEffect(() => {
    if (contentRef.current) {
      const lines = contentRef.current.innerText.split('\n');
      setLineCount(Math.max(lines.length, 1));
    }
  }, [children, defaultContent]);

  useEffect(() => {
    if (!contentRef.current || isEditing) return;

    const makeNodesEditable = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const span = document.createElement('span');
        span.contentEditable = 'true';
        span.textContent = node.textContent;
        span.className = 'focus:bg-white/10 px-1 rounded transition-colors outline-none';
        node.parentNode?.replaceChild(span, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(makeNodesEditable);
      }
    };

    Array.from(contentRef.current.childNodes).forEach(makeNodesEditable);
  }, [children, isEditing]);

  const handleInput = (e: React.FormEvent) => {
    const target = e.target as HTMLElement;
    if (!target.isContentEditable) return;

    setIsEditing(true);
    if (contentRef.current) {
      onContentChange?.(contentRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  return (
    <div className="flex text-sm">
      {/* line numbers */}
      <div className="
        select-none
        pr-4 mr-4
        border-r border-white/20
        text-right text-white/30
        min-w-[3rem]
        hidden
        md:block
      ">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="leading-6">
            {String(i + 1).padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* content */}
      <div 
        ref={contentRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="
          flex-1 relative font-mono leading-6
          text-white/90
          whitespace-pre-wrap
          [text-shadow:0_0_5px_rgba(255,255,255,0.3)]
          caret-white/70
        "
      >
        {children}
      </div>
    </div>
  );
}

function TerminalTitle() {
  const pathname = usePathname();
  const title = `ben@dedsec00:/var/www/html${pathname === '/' ? '/index.html' : pathname + '.html'}`;

  return (
    <div className="
      flex justify-center items-center w-full
      text-white/50 text-sm tracking-wider uppercase
      pointer-events-none
    ">
      {title}
    </div>
  );
}

export default function TerminalWindow({ 
  children, 
  defaultContent, 
  onContentChange, 
  onHalClick,
  isGameTerminal,
  onClose,
  terminalId
}: TerminalWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>(() => ({
    width: typeof window !== 'undefined' ? (window.innerWidth < 768 ? window.innerWidth : 1024) : 1024,
    height: typeof window !== 'undefined' ? (window.innerWidth < 768 ? window.innerHeight : (isGameTerminal ? 600 : 700)) : 700
  }));
  // TODO: just remove this so call depth isn't an issue
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const isInitialized = useRef(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { terminalStates, updateTerminalPosition, bringToFront } = useTerminal();
  const { position } = terminalStates[terminalId];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      if (isMobile !== mobile) {
        setIsMobile(mobile);
      }

      if (mobile) {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
        updateTerminalPosition(terminalId, { x: 0, y: 0 });
      } else if (!isInitialized.current) {
        setSize({ 
          width: 1024, 
          height: isGameTerminal ? 600 : 700 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    isInitialized.current = true;

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, terminalId, isGameTerminal, updateTerminalPosition]);

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
      if (!isDragging && !isResizing) return;
      
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        updateTerminalPosition(terminalId, {
          x: position.x + deltaX,
          y: position.y + deltaY
        });
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }

      if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setDragStart({ x: e.clientX, y: e.clientY });

        setSize(prevSize => {
          const newSize = { ...prevSize };

          if (resizeDirection.includes('e')) {
            newSize.width = Math.max(400, prevSize.width + deltaX);
          }
          if (resizeDirection.includes('s')) {
            newSize.height = Math.max(300, prevSize.height + deltaY);
          }
          if (resizeDirection.includes('w')) {
            const newWidth = Math.max(400, prevSize.width - deltaX);
            if (newWidth !== prevSize.width) {
              updateTerminalPosition(terminalId, {
                ...position,
                x: position.x + (prevSize.width - newWidth)
              });
              newSize.width = newWidth;
            }
          }
          if (resizeDirection.includes('n')) {
            const newHeight = Math.max(300, prevSize.height - deltaY);
            if (newHeight !== prevSize.height) {
              updateTerminalPosition(terminalId, {
                ...position,
                y: position.y + (prevSize.height - newHeight)
              });
              newSize.height = newHeight;
            }
          }

          return newSize;
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, position, position.x, position.y, updateTerminalPosition, terminalId, resizeDirection]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (terminalRef.current && e.target === terminalRef.current.querySelector('.terminal-title-bar')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      bringToFront(terminalId);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      ref={terminalRef}
      className={`font-mono ${isMobile ? 'fixed inset-0' : ''}`}
      style={{
        transform: isMobile ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease-out',
        zIndex: terminalStates[terminalId].zIndex,
        width: size.width,
        height: size.height
      }}
      onMouseDown={!isMobile ? handleMouseDown : undefined}
      suppressHydrationWarning
    >
      {/* resize handles for large screens */}
      {!isMobile && (
        <>
          <div className="absolute -right-1 -bottom-1 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          <div className="absolute -left-1 -bottom-1 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute -right-1 -top-1 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute -left-1 -top-1 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 cursor-e-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 cursor-w-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 h-2 w-8 cursor-n-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-8 cursor-s-resize z-50" onMouseDown={(e) => handleResizeStart(e, 's')} />
        </>
      )}

      {/* terminal frame */}
      <div className="
        relative
        h-full
        flex flex-col
        border-2 border-white/30
        bg-black/80 backdrop-blur-md
        shadow-[0_0_15px_rgba(0,0,0,0.5)]
        overflow-hidden
        rounded-md
      ">
        {/* title bar */}
        <div className={`
          terminal-title-bar
          relative
          flex items-center
          px-4 py-2
          bg-gradient-to-r from-white/10 via-white/5 to-white/10
          border-b-2 border-white/20
          ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}
          select-none
        `}>
          {/* controls */}
          {!isGameTerminal && (
            <div className="gap-3 z-10 hidden md:flex">
              <TerminalControl 
                label="HAL" 
                color="bg-gradient-to-r from-red-900/50 to-red-700/50"
                pulseColor="bg-red-400"
                onClick={onHalClick}
              />
            </div>
          )}
          
          {/* title */}
          {!isGameTerminal ? (
            <TerminalTitle />
          ) : (
            <>
              <div className="
                flex-1 text-center
                text-white/50 text-sm tracking-wider uppercase
                pointer-events-none
                truncate
              ">
                WOPR - THERMONUCLEAR WAR
              </div>
              <div className="flex gap-3 z-10">
                <TerminalControl 
                  label="EXIT" 
                  color="bg-gradient-to-r from-red-900/50 to-red-700/50"
                  pulseColor="bg-red-400"
                  onClick={onClose}
                />
              </div>
            </>
          )}
        </div>

        {/* content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <TerminalEffects />
          
          <div className={`
            relative flex-1
            ${!isGameTerminal ? 'min-h-0' : 'h-auto'}
            overflow-auto
            shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]
            p-4
          `}>
            {!isGameTerminal ? (
              <CodeEditorContent
                defaultContent={defaultContent}
                onContentChange={onContentChange}
              >
                {children}
              </CodeEditorContent>
            ) : (
              children
            )}
          </div>
        </div>

        {/* footer */}
        <div className="
          relative
          flex items-center justify-between
          px-4 py-2
          bg-gradient-to-r from-white/10 via-white/5 to-white/10
          border-t-2 border-white/20
          text-xs text-white/50
          flex-wrap gap-2
        ">
          <div className="flex items-center gap-4 flex-wrap">
            <span>SYSTEM: READY</span>
          </div>

          {/* nav buttons */}
          {!isGameTerminal && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 flex-wrap">
              {NAV_ITEMS.map((item) => {
                const isCurrentPath = pathname === item.path;
                
                if (!isMobile) {
                  return (
                    <button
                      key={item.path}
                      onClick={() => !isCurrentPath && router.push(item.path)}
                      disabled={isCurrentPath}
                      className={`
                        px-3 py-1
                        border border-white/20
                        rounded-sm
                        transition-all duration-200
                        whitespace-nowrap
                        pointer-events-auto
                        ${isCurrentPath ? 
                          'bg-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] opacity-50' : 
                          'bg-black/50 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
                        }
                      `}
                    >
                      <span className="mr-2">{item.label}</span>
                      {!isMobile && <span className="text-white/30">[{item.shortcut}]</span>}
                    </button>
                  );
                } else {
                  return (
                    <a
                      href={item.path}
                      key={item.path}
                      className="px-3 py-1 transition-all duration-200 whitespace-nowrap"
                    >{item.label}</a>
                  )
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 