import React from 'react';

interface KeyboardHintsProps {
  hints: string[];
  className?: string;
}

export default function KeyboardHints({ hints, className = '' }: KeyboardHintsProps) {
  return (
    <div className={`font-mono text-xs text-zinc-400 mb-6 px-4 pb-3 ${className}`}>
      {hints.map((hint, index) => (
        <React.Fragment key={index}>
          {index > 0 && ' • '}
          {hint}
        </React.Fragment>
      ))}
    </div>
  );
}
