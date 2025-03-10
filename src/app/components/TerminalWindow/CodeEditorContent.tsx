import { ReactNode, useEffect, useRef, useState } from 'react';
import { LineNumbers } from './LineNumbers';

export function CodeEditorContent({
  children,
  defaultContent,
  onContentChange,
  isMobile,
}: {
  children?: ReactNode;
  defaultContent?: string;
  onContentChange?: (content: string) => void;
  isMobile?: boolean;
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
    if (!contentRef.current || isEditing || isMobile) return;

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
  }, [children, isEditing, isMobile]);

  const handleInput = (e: React.FormEvent) => {
    const target = e.target as HTMLElement;
    if (!target.isContentEditable) return;

    if (!isMobile) {
      setIsEditing(true);
    }

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
      <LineNumbers lineCount={lineCount} />

      <div
        ref={contentRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`
            flex-1 relative font-mono leading-6
            text-white/90
            whitespace-pre-wrap
            [text-shadow:0_0_5px_rgba(255,255,255,0.3)]
            caret-white/70
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}
      >
        {children}
      </div>
    </div>
  );
}
