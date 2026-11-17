export const DEFAULT_LANG = "en";

export function getPathParts(page) {
  return (page.inputPath || "").replace(/\\/g, "/").split("/");
}

export function getPostSlug(page, category = "blog") {
  const parts = getPathParts(page);
  const blogIndex = parts.indexOf(category);

  return blogIndex >= 0 ? parts[blogIndex + 1] : page.fileSlug;
}

export function getLang(page, lang) {
  if (lang) return lang;

  const parts = getPathParts(page);

  if (parts.includes("es")) return "es";
  if (parts.includes("ja")) return "ja";

  return DEFAULT_LANG;
}

export function getPostLayout(lang, base = "post") {
  switch (lang) {
    case "es":
      return `${base}-es.html`;
    case "jp":
    case "en":
    default:
      return `${base}-en.html`;
  }
}
