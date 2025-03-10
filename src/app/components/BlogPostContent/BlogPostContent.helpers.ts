'use client';

/**
 * Finds all focusable elements in the blog post content
 * @param {HTMLElement} container - The container element to search within
 * @returns {HTMLElement[]} - Array of focusable elements
 */
export function findFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  // Get all possible elements
  const allElements = Array.from(
    container.querySelectorAll('.post-title, .author-info, h1, h2, h3, h4, h5, h6, a[href="/blog"]')
  ) as HTMLElement[];

  // Filter out elements inside author-info except for the author-info div itself
  return allElements.filter((el) => {
    // Keep author-info as a container but not its children
    if (el.classList.contains('author-info')) {
      return true;
    }

    // Check if this element is inside author-info
    let parent = el.parentElement;
    while (parent) {
      if (parent.classList.contains('author-info')) {
        return false; // Skip elements inside author-info
      }
      parent = parent.parentElement;
    }

    // Keep only headings that are inside post-content
    if (el.tagName.match(/^H[1-6]$/) && !el.classList.contains('post-title')) {
      let insidePostContent = false;
      parent = el.parentElement;
      while (parent) {
        if (parent.classList.contains('post-content')) {
          insidePostContent = true;
          break;
        }
        parent = parent.parentElement;
      }
      return insidePostContent;
    }

    // Keep title and back link
    return el.classList.contains('post-title') || (el.tagName === 'A' && el.getAttribute('href') === '/blog');
  });
}

/**
 * Finds the author link in the blog post content
 * @param {HTMLElement} container - The container element to search within
 * @returns {string|null} - The author link URL or null if not found
 */
export function findAuthorLink(container: HTMLElement | null): string | null {
  if (!container) return null;

  const authorLink = container.querySelector('.author-info a');
  return authorLink ? authorLink.getAttribute('href') : null;
}
