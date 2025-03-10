import { getPostBySlug, getPostSlugs } from '@/app/lib/mdx';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AuthorAvatar from '@/app/components/AuthorAvatar';
import PageBackground from '@/app/components/PageBackground';
import TerminalContainer from '@/app/components/TerminalContainer';
import KeyboardHints from '@/app/components/KeyboardHints';

const BlogPostContent = dynamic(() => import('@/app/components/BlogPostContent'));

export async function generateStaticParams() {
  const posts = await getPostSlugs();

  return posts.map((post: string) => ({
    slug: post.replace(/\.mdx$/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Benjamin Ryan',
    };
  }

  return {
    title: `${post.title} | Benjamin Ryan`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageBackground>
      <TerminalContainer title={`/blog/${post.slug}.mdx`}>
        <div className="bg-white dark:bg-transparent">
          <BlogPostContent>
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-mono prose-headings:tracking-tighter p-6 md:p-10 flex-grow">
              <div className="relative">
                <div className="absolute inset-0 font-mono text-sm text-black/10 dark:text-white/10 overflow-hidden whitespace-pre z-0 pointer-events-none select-none">
                  {'░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓\n'}
                  {'▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░\n'}
                  {'░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░\n'}
                  {'▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░\n'}
                  {'░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓\n'}
                  {'▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░\n'}
                </div>
                <div className="relative z-10 before:absolute before:inset-0 before:bg-[url('/atlas_blog.png')] before:bg-repeat before:opacity-10 before:dark:opacity-5 before:-z-10">
                  <h1
                    className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 post-title"
                    tabIndex={0}
                  >
                    {post.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-7 -mt-1 author-info" tabIndex={0}>
                <AuthorAvatar author={post.author} size="medium" />
                <div className="flex flex-col">
                  <span className="font-mono text-base font-semibold text-black dark:text-white">
                    {post.author?.url ? (
                      <Link href={post.author.url} target="_blank" className="no-underline hover:underline">
                        {post.author?.name || 'Anonymous'}
                      </Link>
                    ) : (
                      post.author?.name || 'Anonymous'
                    )}
                  </span>
                  <time className="font-mono text-sm text-blue-400 mt-1 post-date">{post.date}</time>
                </div>
              </div>

              <KeyboardHints
                hints={['Use ↑/↓ to navigate content', 'Enter to activate', 'Esc to return to blog list']}
              />

              <div className="post-content" tabIndex={0}>
                {post.content}
              </div>

              <Link
                href="/blog"
                className="font-mono text-sm mt-8 no-underline hover:underline text-zinc-400 inline-block"
                tabIndex={0}
              >
                ← See more posts
              </Link>
            </div>
          </BlogPostContent>
        </div>
      </TerminalContainer>
    </PageBackground>
  );
}
