import { ReactNode } from 'react';
import TerminalEffects from '@/app/components/TerminalEffects';
import { CodeEditorContent } from './CodeEditorContent';

interface ContentSectionProps {
  children: ReactNode;
  isGameTerminal?: boolean;
  defaultContent?: string;
  onContentChange?: (content: string) => void;
  isMobile?: boolean;
}

export function ContentSection({
  children,
  isGameTerminal = false,
  defaultContent,
  onContentChange,
  isMobile = false,
}: ContentSectionProps) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <TerminalEffects />

      <div
        className={`
          relative flex-1
          ${!isGameTerminal ? 'min-h-0' : 'h-auto'}
          overflow-auto
          shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]
          p-4
        `}
      >
        {!isGameTerminal ? (
          <CodeEditorContent defaultContent={defaultContent} onContentChange={onContentChange} isMobile={isMobile}>
            {children}
          </CodeEditorContent>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
