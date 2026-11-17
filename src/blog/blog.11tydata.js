import { getBubblesSignal } from "../js/11ty/bubbles.js";
import { getLang, getPostSlug, DEFAULT_LANG, getPostLayout } from "../js/i18n.js";

export default {
  category: "blog",
  css: ["/css/reset.css", "/css/variables.css", "/css/layouts/base.css", "/css/pages/post.css"],
  layout: "post.html",
  eleventyComputed: {
    lang: ({ lang, page }) => getLang(page, lang),
    postSlug: ({ page }) => getPostSlug(page),
    permalink: ({ draft, lang, page }) => {
      const baseUrl = draft ? "/drafts" : "/post";
      const postSlug = getPostSlug(page);
      const postLang = getLang(page, lang);
      const langSegment = postLang === DEFAULT_LANG ? "" : `${postLang}`;

      return `/${langSegment}/${baseUrl}/${postSlug}/`;
    },
    eleventyExcludeFromCollections: ({ draft }) =>
      draft && process.env.ENVIRONMENT === "PRODUCTION" ? true : undefined,
    ignore: ({ draft }) => (draft ? true : undefined),
    bubblesSignal: async (data) => {
      if (!data.page?.url || !data.rootURL) {
        return null;
      }

      const url = new URL(data.page.url, data.rootURL).href;

      return getBubblesSignal(url);
    },
  },
};
