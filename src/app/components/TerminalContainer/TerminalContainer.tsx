import React from 'react';

interface TerminalContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function TerminalContainer({
  title,
  children,
  className = '',
  contentClassName = '',
}: TerminalContainerProps) {
  return (
    <div
      className={`font-mono border-2 border-white/30 dark:border-white/30 bg-white dark:bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden rounded-md ${className}`}
    >
      <div className="terminal-title-bar relative flex items-center px-4 py-2 bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/10 border-b-2 border-white/20 dark:border-white/20 select-none">
        <div className="flex justify-center items-center w-full text-zinc-700 dark:text-white/50 text-sm tracking-wider uppercase pointer-events-none">
          {title}
        </div>
      </div>

      <div className={`bg-white dark:bg-transparent ${contentClassName}`}>{children}</div>
    </div>
  );
}
