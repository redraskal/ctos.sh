import PageBackground from '@/app/components/PageBackground';
import TerminalContainer from '@/app/components/TerminalContainer';
import { getAllPosts } from '@/app/lib/mdx';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const BlogPostList = dynamic(() => import('@/app/components/BlogPostList'));

export const metadata: Metadata = {
  title: 'Blog | Benjamin Ryan',
  description: 'Posts about web development, technology, and more.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <PageBackground>
      <TerminalContainer title="/blog/page.tsx">
        <div className="bg-white dark:bg-transparent">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-mono prose-headings:tracking-tighter p-6 md:p-10 flex-grow">
            <div className="relative z-10 before:absolute before:inset-0 before:bg-[url('/atlas_blog.png')] before:bg-repeat before:opacity-10 before:dark:opacity-5 before:-z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">ctos.sh - Blog</h1>
              <p>
                Hey, I&apos;m Ben! Welcome to my blog! I write about web development, technology, and other topics I&apos;m
                passionate about.
              </p>
            </div>

            <BlogPostList posts={posts} />
          </div>
        </div>
      </TerminalContainer>
    </PageBackground>
  );
}
