import { chunk } from "../helpers/array.js";
import { getPostLang, DEFAULT_LANG } from "./utils.js";

/**
 * Returns all language variants of journal posts inside src/journal.
 * @param {Eleventy.collection} collectionApi
 * @returns a list of blog posts
 */
export function getAllJournalPosts(collectionApi) {
  return collectionApi.getFilteredByGlob("src/journal/**/*.md");
}

/**
 * Returns a collection of all the journal posts inside md/journal
 * @param {Eleventy.collection} collectionApi
 * @returns a list of journal posts
 */
export function getJournalPosts(collectionApi) {
  return getAllJournalPosts(collectionApi);
}

/**
 * Creates paginated journal tag pages - flattens double pagination into single layer
 * Each entry represents one page of one tag
 * @param {Eleventy.collection} collectionApi
 * @returns {Array<Object>} Flattened array of tag pages with their posts
 */
export function getJournalTagPages(collectionApi) {
  const journalPosts = getJournalPosts(collectionApi);
  const paginationSize = 10;
  const tagMap = [];

  const uniqueTagSet = new Set();

  journalPosts.forEach((post) => {
    if (post.data.tags) {
      post.data.tags.forEach((tag) => {
        uniqueTagSet.add(tag);
      });
    }
  });

  const tagArray = [...uniqueTagSet];

  for (const tagName of tagArray) {
    const taggedPosts = journalPosts.filter((post) => post.data.tags && post.data.tags.includes(tagName));

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
