/**
 * Returns other language variants for the current blog post.
 * @param {Array<Object>} collection - A list of Eleventy collection items.
 * @param {string} postSlug - Shared folder slug for the post.
 * @param {string} currentUrl - Current page URL.
 * @returns {Array<Object>} Translated variants of the current post.
 */
export function getTranslations(collection, postSlug, currentUrl) {
  return collection
    .filter((post) => post.data.postSlug === postSlug && post.url !== currentUrl)
    .sort((a, b) => a.data.lang.localeCompare(b.data.lang));
}

/**
 * Filters Eleventy posts by language.
 * @param {Array<Object>} collection - A list of Eleventy collection items.
 * @param {string} lang - Language code to keep.
 * @returns {Array<Object>} Posts matching the language.
 */
export function filterByLang(collection, lang = "en") {
  return collection.filter((post) => post.data.lang === lang);
}

/**
 * Returns the neighboring item in a collection relative to the current page.
 * @param {Array<Object>} collection - A list of Eleventy collection items.
 * @param {Object} page - The current Eleventy page.
 * @param {number} offset - The position relative to the current page.
 * @returns {Object | undefined} The neighboring collection item.
 */
export function getAdjacentCollectionItem(collection, page, offset) {
  const index = collection.findIndex(
    (item) =>
      item.inputPath === page.inputPath &&
      (item.outputPath === page.outputPath || item.url === page.url),
  );

  return index < 0 ? undefined : collection[index + offset];
}
