import { getPostLang, DEFAULT_LANG } from "./utils.js";

/**
 * Returns all language variants of newsletter posts inside src/newsletter.
 * @param {Eleventy.collection} collectionApi
 * @returns a list of newsletter posts
 */
export function getAllNewsletterPosts(collectionApi) {
  return collectionApi.getFilteredByGlob("src/newsletter/**/*.md");
}

/**
 * Returns the default-language newsletter posts inside src/newsletter.
 * @param {Eleventy.collection} collectionApi
 * @returns a list of newsletter posts
 */
export function getNewsletterPosts(collectionApi) {
  return getAllNewsletterPosts(collectionApi);
}

/**
 * Groups newsletter posts by year based on their publication date.
 *
 * @param {Eleventy.collection} collectionApi
 * @returns {Object.<number, Array<Object>>} An object where each key is a year and each value is an array of newsletters published in that year.
 */
export function getNewsletterByYear(collectionApi) {
  const newsletters = getNewsletterPosts(collectionApi);

  const byYear = {};

  newsletters.forEach((newsletter) => {
    const date = new Date(newsletter.date);
    const year = date.getFullYear();

    if (!byYear[year]) {
      byYear[year] = [];
    }

    byYear[year].push(newsletter);
  });

  return byYear;
}
