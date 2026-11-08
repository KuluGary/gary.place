import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import dotenv from "dotenv";
import Eleventy from "@11ty/eleventy";
import { optimizeRssImages } from "../11ty/filters/image.js";

dotenv.config();

const API_BASE = "https://api.buttondown.com/v1";
const SITE_URL = "https://gary.place";
const NEWSLETTER_DIR = path.resolve("src/newsletter");
const API_KEY = process.env.BUTTONDOWN_API_KEY;

const EMAIL_LANGUAGE = process.env.NEWSLETTER_EMAIL_LANGUAGE ?? "en";

if (!API_KEY) {
  throw new Error("Missing BUTTONDOWN_API_KEY environment variable.");
}

if (!["en", "es"].includes(EMAIL_LANGUAGE)) {
  throw new Error("NEWSLETTER_EMAIL_LANGUAGE must be en or es.");
}

async function buttondownRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Token ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Buttondown returned invalid JSON (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(`Buttondown API error ${response.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

function absoluteUrls(html) {
  return html.replace(/\b(href|src)=(["'])(.*?)\2/gi, (match, attribute, quote, value) => {
    if (!value || value.startsWith("#") || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)) {
      return match;
    }

    const absolute = new URL(value, SITE_URL).href;

    return `${attribute}=${quote}${absolute}${quote}`;
  });
}

async function renderNewsletterHtml(slug, language) {
  const outputPath = path.join(
    process.cwd(),
    "_site",
    "newsletter",
    slug,
    ...(language === "es" ? ["es", "index.html"] : ["index.html"]),
  );

  const pageHtml = await fs.readFile(outputPath, "utf8");

  const article = pageHtml.match(/<article\b(?=[^>]*\bid=["']content["'])[^>]*>([\s\S]*?)<\/article>/i);

  if (!article) {
    throw new Error(`Could not find the rendered newsletter article in ${outputPath}`);
  }

  let html = article[1];

  // Replace responsive picture elements with their fallback image.
  html = html.replace(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi, (match, contents) => {
    const img = contents.match(/<img\b[^>]*>/i);
    return img ? img[0] : "";
  });

  // Remove website-only image wrappers and attributes.
  html = html.replace(/\sclass=(["'])[^"']*\1/gi, "");
  html = html.replace(/\sloading=(["'])[^"']*\1/gi, "");
  html = html.replace(/\sdecoding=(["'])[^"']*\1/gi, "");
  html = html.replace(/\ssrcset=(["'])[^"']*\1/gi, "");
  html = html.replace(/\ssizes=(["'])[^"']*\1/gi, "");
  html = html.replace(/\stabindex=(["'])[^"']*\1/gi, "");

  // Remove anchor links used for website headings.
  html = html.replace(/<a\b[^>]*class=["'][^"']*anchor-link[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "");

  // Remove lightbox-specific attributes.
  html = html.replace(/\sdata-glightbox=(["'])[^"']*\1/gi, "");

  // Make images responsive in email clients.
  html = html.replace(/<img\b([^>]*)>/gi, (match, attributes) => {
    const cleanAttributes = attributes.replace(/\swidth=(["'])[^"']*\1/gi, "").replace(/\sheight=(["'])[^"']*\1/gi, "");

    return `<img${cleanAttributes} style="display:block; max-width:100%; height:auto; margin:0 auto;">`;
  });

  // Remove lightbox links but preserve their image contents.
  html = html.replace(
    /<a\b([^>]*class=["'][^"']*glightbox[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi,
    (match, attributes, contents) => {
      const href = attributes.match(/\bhref=(["'])(.*?)\1/i);
      return href ? `<a href="${href[2]}">${contents}</a>` : contents;
    },
  );

  return absoluteUrls(html);
}

function getTranslationUrl(slug) {
  const path = EMAIL_LANGUAGE === "en" ? `/newsletter/${slug}/es/` : `/newsletter/${slug}/`;

  return new URL(path, SITE_URL).href;
}

function appendTranslationFooter(html, slug) {
  const translationUrl = getTranslationUrl(slug);

  const footer =
    EMAIL_LANGUAGE === "en"
      ? `También puedes leer la <a href="${translationUrl}">versión en español.</a>`
      : `You can also read <a href="${translationUrl}">the English version.</a>`;

  // Give headings a handwritten-style font with stronger weight.
  html = html.replace(
    /<(h[1-6])(\b[^>]*)>/gi,
    (match, tag, attributes) =>
      `<${tag}${attributes} style="font-family:'Patrick Hand','Comic Sans MS',cursive; font-weight:700;">`,
  );

  return `
    <div style="font-family:ui-rounded,'Hiragino Maru Gothic ProN',Quicksand,Comfortaa,Manjari,'Arial Rounded MT','Arial Rounded MT Bold',Calibri,'Source Sans Pro',sans-serif; font-size:14px; line-height:1.7;">
      ${html.trim()}
      <hr style="border:0; border-top:1px solid;border-style:dotted">
      <p style="font-size:12px; line-height:1.6; text-align:center; color:#888;">
        ${footer}
      </p>
    </div>
  `;
}

async function getNewsletterFolders() {
  const entries = await fs.readdir(NEWSLETTER_DIR, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function readNewsletter(filePath, slug, language) {
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);

  if (data.draft) {
    console.log(`Skipping draft newsletter: ${filePath}`);
    return null;
  }

  if (!data.title || !data.description || !data.date) {
    throw new Error(`${filePath} must include title, description, and date in its front matter.`);
  }

  const rawDate = data.date;

  const date = rawDate instanceof Date ? rawDate : new Date(`${String(rawDate).slice(0, 10)}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in ${filePath}: ${rawDate}`);
  }

  return {
    title: String(data.title),
    description: String(data.description),
    date: date.toISOString(),
    html: await renderNewsletterHtml(slug, language),
  };
}

async function getExistingEmails() {
  const emails = [];

  for (let page = 1; page <= 100; page++) {
    const query = new URLSearchParams({
      page: String(page),
    });

    const data = await buttondownRequest(`/emails?${query}`);
    const results = data.results ?? [];

    emails.push(...results);

    if (!results.length || emails.length >= data.count) {
      break;
    }
  }

  return emails;
}

async function createDraft({ slug, newsletter, existingEmails }) {
  const marker = `gary.place-newsletter:${slug}`;

  const existing = existingEmails.find((email) => email.metadata?.gary_place_newsletter === marker);

  if (existing) {
    console.log(`Skipping existing email: ${marker} (ID ${existing.id})`);
    return;
  }

  const language = EMAIL_LANGUAGE;

  const archivePath = language === "es" ? `/newsletter/${slug}/es/` : `/newsletter/${slug}/`;

  const canonicalUrl = new URL(archivePath, SITE_URL).href;

  const html = appendTranslationFooter(
    newsletter.html.replace(/<a\b[^>]*href=["']#[^"']*["'][^>]*>\s*#\s*<\/a>/gi, ""),
    slug,
  );

  const body = `<!-- buttondown-editor-mode: fancy -->${html.trim()}`;

  const payload = {
    subject: newsletter.title,

    body,

    description: newsletter.description,

    canonical_url: canonicalUrl,

    slug: `${slug}-${language}`,

    status: "draft",

    metadata: {
      gary_place_newsletter: marker,
      newsletter_slug: slug,
      newsletter_language: language,
      original_date: newsletter.date,
    },
  };

  const result = await buttondownRequest("/emails", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log(`Created ${language} draft: "${newsletter.title}" (ID ${result.id})`);

  console.log(`Draft URL: ${result.absolute_url}`);
}

async function main() {
  // Build the website first so we can use its rendered HTML.
  await new Eleventy(".", "_site", {
    configPath: ".eleventy.js",
    quietMode: true,
  }).write();

  const existingEmails = await getExistingEmails();
  const folders = await getNewsletterFolders();

  for (const slug of folders) {
    const folder = path.join(NEWSLETTER_DIR, slug);

    const englishPath = path.join(folder, "index.md");
    const spanishPath = path.join(folder, "es.md");

    const files = await fs.readdir(folder);

    // Both language versions are required.
    if (!files.includes("index.md") || !files.includes("es.md")) {
      console.log(`Skipping ${slug}: both language files are required.`);
      continue;
    }

    const [english, spanish] = await Promise.all([
      readNewsletter(englishPath, slug, "en"),
      readNewsletter(spanishPath, slug, "es"),
    ]);

    if (!english || !spanish) {
      console.log(`Skipping ${slug}: at least one language version is a draft.`);
      continue;
    }

    const newsletter = EMAIL_LANGUAGE === "en" ? english : spanish;

    await createDraft({
      slug,
      newsletter,
      existingEmails,
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
