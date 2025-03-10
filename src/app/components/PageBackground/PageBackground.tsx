import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageBackground({ children, className = '' }: PageBackgroundProps) {
  return (
    <main
      className={`font-sans relative min-h-screen flex flex-col ${className}`}
      style={{
        backgroundImage: `url("/pattern-bg.svg")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <article className="py-20 px-6 relative flex-grow flex items-stretch">
        <div className="max-w-6xl mx-auto relative md:p-5 w-full flex flex-col">{children}</div>
      </article>
    </main>
  );
}
