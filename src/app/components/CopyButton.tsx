'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="text-white hover:text-white/80 transition-colors text-sm flex items-center gap-2 mt-3 cursor-pointer"
    >
      <span className="font-mono">{text}</span>
      <span className="text-xs">{copied ? '(Copied!)' : '(Click to copy)'}</span>
    </button>
  );
}
