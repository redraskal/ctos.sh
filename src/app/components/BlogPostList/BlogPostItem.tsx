'use client';

import React from 'react';
import AuthorAvatar from '../AuthorAvatar';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  author?: {
    name?: string;
    avatar?: string;
    url?: string;
  };
}

interface BlogPostItemProps {
  post: Post;
  index: number;
  selectedIndex: number;
  isPressing: boolean;
  pressProgress: number;
  isClient: boolean;
  onMouseEnter: (index: number) => void;
  onMouseDown: (index: number) => void;
  onMouseUp: (index: number) => void;
  onMouseLeave: () => void;
  preventDrag: (e: React.DragEvent) => void;
}

export function BlogPostItem({
  post,
  index,
  selectedIndex,
  isPressing,
  pressProgress,
  isClient,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  preventDrag,
}: BlogPostItemProps) {
  return (
    <div
      className="block no-underline select-none"
      draggable="false"
      onMouseEnter={() => onMouseEnter(index)}
      onClick={(e) => e.preventDefault()}
      onMouseDown={() => onMouseDown(index)}
      onMouseUp={() => onMouseUp(index)}
      onMouseLeave={onMouseLeave}
      onDragStart={preventDrag}
    >
      <div
        className={`
          w-full p-3 px-4 rounded-sm 
          flex items-center justify-between
          border-l-4 relative overflow-hidden
          select-none
          ${
            isClient && selectedIndex === index
              ? isPressing
                ? 'shadow-inner transform scale-[0.985] transition-all duration-75 text-black border-l-blue-600'
                : 'bg-white text-black border-l-blue-500 shadow-md transform translate-x-1 transition-all duration-150'
              : 'bg-white/30 dark:bg-black/30 text-black dark:text-white border-l-transparent hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-150'
          }
          cursor-pointer
        `}
        draggable="false"
      >
        {isClient && selectedIndex === index && isPressing && (
          <div
            className="absolute inset-0 pointer-events-none bg-white"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, 
                  transparent ${100 - pressProgress * 100}%, 
                  rgba(0,0,0,0.9) ${100 - pressProgress * 100}%),
                url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.3' fill-rule='nonzero'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")
              `,
              backgroundBlendMode: 'multiply',
              transition: 'opacity 150ms',
            }}
          />
        )}

        <div className="flex-1 relative z-10 select-none">
          <div
            className={`
            font-mono text-lg font-semibold select-none
            sm:truncate whitespace-normal break-words
            ${
              isClient && selectedIndex === index
                ? isPressing && pressProgress > 0.5
                  ? 'text-white'
                  : 'text-black'
                : ''
            }
          `}
          >
            {post.title}
          </div>

          <div className="flex items-center mt-1 space-x-3 select-none">
            <AuthorAvatar author={post.author} size="small" />

            <span
              className={`
              font-mono text-xs select-none
              ${
                isClient && selectedIndex === index
                  ? isPressing && pressProgress > 0.5
                    ? 'text-white'
                    : 'text-gray-700'
                  : 'text-gray-700 dark:text-gray-300'
              }
            `}
            >
              {post.author?.name || 'Anonymous'}
            </span>

            <span
              className={`
              font-mono text-xs select-none
              ${
                isClient && selectedIndex === index
                  ? isPressing && pressProgress > 0.5
                    ? 'text-gray-300'
                    : 'text-gray-500'
                  : 'text-gray-500 dark:text-gray-400'
              }
            `}
            >
              {post.date} • {post.readingTime}
            </span>
          </div>
        </div>

        <div
          className={`
          font-mono text-sm transition-opacity duration-150 relative z-10 select-none hidden md:block
          ${isClient && selectedIndex === index ? 'opacity-100' : 'opacity-50'}
          ${isClient && selectedIndex === index && isPressing && pressProgress > 0.5 ? 'text-white' : 'text-black'}
        `}
        >
          {isClient && selectedIndex === index ? (
            isPressing ? (
              <>
                <span>➔ Navigating </span>
                <span className="inline-block">{Math.floor(pressProgress * 100)}%</span>
              </>
            ) : (
              '→ Press Enter'
            )
          ) : (
            '→'
          )}
        </div>
      </div>
    </div>
  );
}
