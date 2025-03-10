import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';

const dir = join(cwd(), 'blog');

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: React.ReactNode;
  readingTime: string;
  author?: {
    name?: string;
    avatar?: string;
    url?: string;
  };
};

export async function getPostSlugs() {
  try {
    const slugs = await readdir(dir);
    return slugs.filter((slug) => slug.endsWith('.mdx'));
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = join(dir, `${slug}.mdx`);
    const fileContent = await readFile(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<{
      title: string;
      date: string;
      excerpt: string;
      author?: {
        name?: string;
        avatar?: string;
        url?: string;
      };
    }>({
      source: fileContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [
            [
              rehypeShiki,
              {
                theme: 'vesper',
                langs: ['typescript', 'javascript', 'jsx', 'tsx', 'json', 'bash', 'sql'],
              },
            ],
            rehypeSlug,
          ],
        },
      },
      components: {},
    });

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt,
      content,
      readingTime: estimateReadingTime(fileContent),
      author: frontmatter.author,
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all posts sorted by date (newest first)
 * @returns All posts sorted by date
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const slugs = await getPostSlugs();
    const postsPromises = slugs.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const post = await getPostBySlug(slug);
      return post;
    });

    const posts = (await Promise.all(postsPromises)).filter((post): post is Post => post !== null);

    return posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}
