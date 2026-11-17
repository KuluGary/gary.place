import pluginRss from "@11ty/eleventy-plugin-rss";
import PostCSSPlugin from "@jgarber/eleventy-plugin-postcss";
import syntaxHighlight from "@pborenstein/eleventy-md-syntax-highlight";
import subsetting from "@photogabble/eleventy-plugin-font-subsetting";
import postGraph from "@rknightuk/eleventy-plugin-post-graph";
import dotenv from "dotenv";

import { I18nPlugin, RenderPlugin } from "@11ty/eleventy";
import { getAllBlogPosts, getBlogPosts, getBlogTagPages } from "./src/js/11ty/collections/blog.js";
import { getAllJournalPosts, getJournalPosts, getJournalTagPages } from "./src/js/11ty/collections/journal.js";
import {
  getAllNewsletterPosts,
  getNewsletterByYear,
  getNewsletterPosts,
} from "./src/js/11ty/collections/newsletter.js";
import { getAllPosts, getAllPostsWithTranslations, getPostTagPages } from "./src/js/11ty/collections/post.js";
import { limit, slice, split } from "./src/js/11ty/filters/array.js";
import { formatDate, formatDuration, sortByDate } from "./src/js/11ty/filters/date.js";
import { optimizeRssImages } from "./src/js/11ty/filters/image.js";
import { asciiPunct, plaintextHtml, plainUrl } from "./src/js/11ty/filters/plaintext.js";
import { pad, unslugify } from "./src/js/11ty/filters/string.js";
import { filterByLang, getAdjacentCollectionItem, getTranslations } from "./src/js/11ty/filters/translations.js";
import { filterOwnWebmentions, getWebmentionsByUrl, webmentionsByType } from "./src/js/11ty/filters/webmentions.js";
import { generateAudio } from "./src/js/11ty/shortcodes/audio.js";
import { generateGallery } from "./src/js/11ty/shortcodes/images/gallery.js";
import { generateImage } from "./src/js/11ty/shortcodes/images/image.js";
import { addRule } from "./src/js/11ty/shortcodes/string.js";
import mdIt from "./src/js/lib/markdown-it.js";
import { fullPageMetadata, plainTextMetadata } from "./src/js/metadata.js";

dotenv.config();

const isPlain = process.env.ELEVENTY_MODE === "plain";

export default async function (eleventyConfig) {
  eleventyConfig.addGlobalData("rootURL", process.env.ROOT_URL);
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());
  eleventyConfig.addGlobalData("isPlain", isPlain);
  eleventyConfig.addGlobalData("plainRoot", isPlain ? "" : "/plain");
  eleventyConfig.addGlobalData("metadata", isPlain ? plainTextMetadata : fullPageMetadata);

  if (!isPlain) {
    eleventyConfig.ignores.add("./src/plaintext");
  }

  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/blog/**/assets");
  eleventyConfig.addPassthroughCopy("./src/journal/**/assets");
  eleventyConfig.addPassthroughCopy("./src/newsletter/**/assets");
  eleventyConfig.addPassthroughCopy({ "./src/assets/images/cap.svg": "plain/cap.svg" });
  eleventyConfig.addPassthroughCopy("_redirects");

  eleventyConfig.addWatchTarget("./src/css");
  eleventyConfig.addWatchTarget("./src/js");
  eleventyConfig.addWatchTarget("./src/blog/**/*.md");
  eleventyConfig.addWatchTarget("./src/journal/**/*.md");
  eleventyConfig.addWatchTarget("./src/newsletter/**/*.md");
  eleventyConfig.addWatchTarget("./src/data");

  /** Filters */
  eleventyConfig.addFilter("formatDate", formatDate);
  eleventyConfig.addFilter("formatDuration", formatDuration);
  eleventyConfig.addFilter("sortByDate", sortByDate);
  eleventyConfig.addFilter("limit", limit);
  eleventyConfig.addFilter("slice", slice);
  eleventyConfig.addFilter("split", split);
  eleventyConfig.addFilter("pad", pad);
  eleventyConfig.addFilter("unslugify", unslugify);
  eleventyConfig.addFilter("getTranslations", getTranslations);
  eleventyConfig.addFilter("filterByLang", filterByLang);
  eleventyConfig.addFilter("getAdjacentCollectionItem", getAdjacentCollectionItem);
  eleventyConfig.addFilter("filterOwnWebmentions", filterOwnWebmentions);
  eleventyConfig.addFilter("getWebmentionsByUrl", getWebmentionsByUrl);
  eleventyConfig.addFilter("webmentionsByType", webmentionsByType);
  eleventyConfig.addFilter("rssImages", optimizeRssImages);
  eleventyConfig.addFilter("plaintextHtml", plaintextHtml);
  eleventyConfig.addFilter("asciiPunct", asciiPunct);
  eleventyConfig.addFilter("plainUrl", plainUrl);

  /* Libraries */
  eleventyConfig.setLibrary("md", mdIt);

  /** Shortcodes */
  eleventyConfig.addPairedNunjucksAsyncShortcode("gallery", generateGallery);
  eleventyConfig.addPairedNunjucksAsyncShortcode("image", generateImage);
  eleventyConfig.addPairedNunjucksAsyncShortcode("audio", generateAudio);
  eleventyConfig.addShortcode("rule", addRule);

  /* Plugins */
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(PostCSSPlugin);
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addPlugin(postGraph, {
    limit: 1,
    sort: "desc",
    noLabels: true,
    noStyles: true,
  });
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
    errorMode: "allow-fallback",
  });
  eleventyConfig.addPlugin(subsetting, {
    enabled: process.env.ELEVENTY_ENV !== "production",
    dist: "_site/assets/fonts",
    quiet: true,
    srcFiles: [
      "./src/assets/fonts/PatrickHandSC-Regular.woff2",
      "./src/assets/fonts/MapleMono-CN-Regular.woff2",
      "./src/assets/fonts/MapleMono-Italic.woff2",
      "./src/assets/fonts/MapleMono-Bold.woff2",
      "./src/assets/fonts/ZenKurenaido-Regular.ttf",
    ],
  });
  eleventyConfig.addPlugin(pluginRss);

  /** Collections */
  eleventyConfig.addCollection("blog", getBlogPosts);
  eleventyConfig.addCollection("blogAll", getAllBlogPosts);
  eleventyConfig.addCollection("blogTagPages", getBlogTagPages);
  eleventyConfig.addCollection("journal", getJournalPosts);
  eleventyConfig.addCollection("journalTagPages", getJournalTagPages);
  eleventyConfig.addCollection("newsletter", getNewsletterPosts);
  eleventyConfig.addCollection("newsletterAll", getAllNewsletterPosts);
  eleventyConfig.addCollection("newsletterByYear", getNewsletterByYear);
  eleventyConfig.addCollection("posts", getAllPosts);
  eleventyConfig.addCollection("postsWithTranslations", getAllPostsWithTranslations);
  eleventyConfig.addCollection("postTagPages", getPostTagPages);

  if (isPlain) {
    eleventyConfig.ignores.add("./src/pages/**");
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "data",
      output: "_site",
      layouts: "_layouts",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
