import React from 'react';
import Link from 'next/link';

interface Author {
  name?: string;
  avatar?: string;
  url?: string;
}

interface AuthorAvatarProps {
  author?: Author;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function AuthorAvatar({ author, size = 'medium', className = '' }: AuthorAvatarProps) {
  const sizeClasses: Record<string, string> = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10 md:w-12 md:h-12',
    large: 'w-16 h-16',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30 dark:border-white/30 flex items-center justify-center ${className}`}
    >
      {author?.avatar &&
        (author.url ? (
          <Link href={author.url} target="_blank">
            <img
              src={author.avatar}
              alt={`Avatar of ${author?.name || 'Author'}`}
              className="w-full h-full object-cover object-center aspect-square"
              draggable="false"
            />
          </Link>
        ) : (
          <img
            src={author.avatar}
            alt={`Avatar of ${author?.name || 'Author'}`}
            className="w-full h-full object-cover object-center aspect-square"
            draggable="false"
          />
        ))}
      {!author?.avatar && (
        <div className="w-full h-full bg-black flex items-center justify-center text-white font-mono text-lg">
          {author?.name?.charAt(0) || 'A'}
        </div>
      )}
    </div>
  );
}
