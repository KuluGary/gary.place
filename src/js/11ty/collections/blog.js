import { chunk } from "../helpers/array.js";

/**
 * Returns all language variants of blog posts inside src/blog.
 * @param {Eleventy.collection} collectionApi
 * @returns a list of blog posts
 */
export function getAllBlogPosts(collectionApi) {
  return collectionApi.getFilteredByGlob("src/blog/**/*.md");
}

/**
 * Returns the default-language blog posts inside src/blog.
 * @param {Eleventy.collection} collectionApi
 * @returns a list of blog posts
 */
export function getBlogPosts(collectionApi) {
  return getAllBlogPosts(collectionApi);
}

/**
 * Creates paginated blog tag pages - flattens double pagination into single layer
 * Each entry represents one page of one tag
 * @param {Eleventy.collection} collectionApi
 * @returns {Array<Object>} Flattened array of tag pages with their posts
 */
export function getBlogTagPages(collectionApi) {
  const blogPosts = getBlogPosts(collectionApi);
  const paginationSize = 10;
  const tagMap = [];

  const uniqueTagSet = new Set();

  blogPosts.forEach((post) => {
    if (post.data.tags) {
      post.data.tags.forEach((tag) => {
        uniqueTagSet.add(tag);
      });
    }
  });

  const tagArray = [...uniqueTagSet];

  for (const tagName of tagArray) {
    const taggedPosts = blogPosts.filter((post) => post.data.tags && post.data.tags.includes(tagName));

    const sortedPosts = taggedPosts.sort((a, b) => b.date - a.date);

    const pagedItems = chunk(sortedPosts, paginationSize);

    for (let pageNumber = 0; pageNumber < pagedItems.length; pageNumber++) {
      tagMap.push({
        tagName: tagName,
        pageNumber: pageNumber,
        totalPages: pagedItems.length,
        pageData: pagedItems[pageNumber],
      });
    }
  }

  return tagMap;
}
