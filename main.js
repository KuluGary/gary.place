var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => EleventyNunjucksHighlighter
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_view = require("@codemirror/view");
var CODE_TOKEN_RE = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--[\w-]+(?=\s*:)|\b(?:if|elif|else|endif|for|endfor|set|include|extends|block|endblock|macro|endmacro|call|endcall|filter|endfilter|import|from|raw|endraw|with|endwith|do|as|in|not|and|or|true|false|null|none)\b|\b(?:gallery|endgallery|image|endimage|youtube|endyoutube|alert|endalert)\b|\b[\w-]+(?=\s*=)|\b\d+\b/g;
function tokenClass(token) {
  if (/^(if|elif|else|endif|for|endfor|set|include|extends|block|endblock|macro|endmacro|call|endcall|filter|endfilter|import|from|raw|endraw|with|endwith|do|as|in|not|and|or|true|false|null|none)$/.test(token)) {
    return "enhl-keyword";
  }
  if (/^(gallery|endgallery|image|endimage|youtube|endyoutube|alert|endalert)$/.test(token)) {
    return "enhl-shortcode";
  }
  if (/^["']/.test(token)) return "enhl-string";
  if (/^--/.test(token)) return "enhl-cssvar";
  if (/^\d+$/.test(token)) return "enhl-number";
  return "enhl-attribute";
}
function parseRegionAt(text, start) {
  if (text[start] !== "{" || start + 1 >= text.length) {
    return null;
  }
  const marker = text[start + 1];
  if (marker !== "%" && marker !== "{" && marker !== "#") {
    return null;
  }
  const closing = marker === "%" ? "%}" : marker === "{" ? "}}" : "#}";
  let bodyStart = start + 2;
  if (text[bodyStart] === "-" || text[bodyStart] === "+") {
    bodyStart++;
  }
  const comment = marker === "#";
  let quote = null;
  let escaped = false;
  for (let i = bodyStart; i < text.length; i++) {
    const char = text[i];
    if (!comment) {
      if (quote) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === "\\") {
          escaped = true;
          continue;
        }
        if (char === quote) {
          quote = null;
        }
        continue;
      }
      if (char === "'" || char === '"') {
        quote = char;
        continue;
      }
    }
    if (char === closing[0] && text[i + 1] === closing[1]) {
      const bodyEnd = i > bodyStart && (text[i - 1] === "-" || text[i - 1] === "+") ? i - 1 : i;
      const end = i + 2;
      return {
        start,
        bodyStart,
        bodyEnd,
        end,
        comment
      };
    }
  }
  return {
    start,
    bodyStart,
    bodyEnd: text.length,
    end: text.length,
    comment
  };
}
function findNextOpening(text, from) {
  let index = text.indexOf("{", from);
  while (index !== -1) {
    if (text[index + 1] === "%" || text[index + 1] === "{" || text[index + 1] === "#") {
      return index;
    }
    index = text.indexOf("{", index + 1);
  }
  return -1;
}
function findEndraw(text, from) {
  let position = from;
  while (position < text.length) {
    const start = findNextOpening(text, position);
    if (start === -1) return null;
    const region = parseRegionAt(text, start);
    if (!region) {
      position = start + 1;
      continue;
    }
    if (!region.comment && text[start + 1] === "%") {
      const body = text.slice(region.bodyStart, region.bodyEnd).trim();
      if (/^endraw\s*$/.test(body)) {
        return region;
      }
    }
    position = region.end;
  }
  return null;
}
function findNunjucksRegions(text) {
  const regions = [];
  let position = 0;
  while (position < text.length) {
    const start = findNextOpening(text, position);
    if (start === -1) break;
    const region = parseRegionAt(text, start);
    if (!region) {
      position = start + 1;
      continue;
    }
    regions.push(region);
    if (!region.comment && text[start + 1] === "%") {
      const body = text.slice(region.bodyStart, region.bodyEnd).trim();
      if (/^raw\s*$/.test(body)) {
        const endraw = findEndraw(text, region.end);
        if (endraw) {
          regions.push(endraw);
          position = endraw.end;
          continue;
        }
        break;
      }
    }
    position = region.end;
  }
  return regions;
}
function buildDecorations(view) {
  const ranges = [];
  const text = view.state.doc.toString();
  const regions = findNunjucksRegions(text);
  for (const region of regions) {
    for (const visible of view.visibleRanges) {
      const start = Math.max(region.start, visible.from);
      const end = Math.min(region.end, visible.to);
      if (start >= end) continue;
      const openingEnd = Math.min(region.bodyStart, end);
      if (openingEnd > start) {
        ranges.push(
          import_view.Decoration.mark({ class: "enhl-delimiter" }).range(start, openingEnd)
        );
      }
      if (region.comment) {
        const commentStart = Math.max(region.bodyStart, start);
        const commentEnd = Math.min(region.bodyEnd, end);
        if (commentEnd > commentStart) {
          ranges.push(
            import_view.Decoration.mark({ class: "enhl-comment" }).range(
              commentStart,
              commentEnd
            )
          );
        }
        continue;
      }
      const bodyStart = Math.max(region.bodyStart, start);
      const bodyEnd = Math.min(region.bodyEnd, end);
      if (bodyEnd > bodyStart) {
        const body = text.slice(bodyStart, bodyEnd);
        CODE_TOKEN_RE.lastIndex = 0;
        let match;
        while ((match = CODE_TOKEN_RE.exec(body)) !== null) {
          const from = bodyStart + match.index;
          const to = from + match[0].length;
          ranges.push(
            import_view.Decoration.mark({
              class: tokenClass(match[0])
            }).range(from, to)
          );
        }
      }
      const closingStart = Math.max(region.bodyEnd, start);
      if (end > closingStart) {
        ranges.push(
          import_view.Decoration.mark({ class: "enhl-delimiter" }).range(
            closingStart,
            end
          )
        );
      }
    }
  }
  ranges.sort((a, b) => a.from - b.from || a.to - b.to);
  return import_view.Decoration.set(ranges, true);
}
var editorHighlighter = import_view.ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = buildDecorations(view);
    }
    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (value) => value.decorations
  }
);
function makeReadingViewProcessor() {
  return (element) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );
    const nodes = [];
    let current;
    while (current = walker.nextNode()) {
      const parent = current.parentElement;
      if (!parent || parent.closest("code, pre, a, .math, .frontmatter")) {
        continue;
      }
      if (current.textContent?.includes("{")) {
        nodes.push(current);
      }
    }
    for (const node of nodes) {
      const text = node.textContent || "";
      const regions = findNunjucksRegions(text);
      if (!regions.length) continue;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const region of regions) {
        if (region.start > cursor) {
          fragment.append(
            document.createTextNode(text.slice(cursor, region.start))
          );
        }
        const opening = document.createElement("span");
        opening.className = "enhl-delimiter";
        opening.textContent = text.slice(region.start, region.bodyStart);
        fragment.append(opening);
        const body = text.slice(region.bodyStart, region.bodyEnd);
        if (region.comment) {
          const comment = document.createElement("span");
          comment.className = "enhl-comment";
          comment.textContent = body;
          fragment.append(comment);
        } else {
          CODE_TOKEN_RE.lastIndex = 0;
          let last = 0;
          let match;
          while ((match = CODE_TOKEN_RE.exec(body)) !== null) {
            if (match.index > last) {
              fragment.append(
                document.createTextNode(body.slice(last, match.index))
              );
            }
            const span = document.createElement("span");
            span.className = tokenClass(match[0]);
            span.textContent = match[0];
            fragment.append(span);
            last = match.index + match[0].length;
          }
          if (last < body.length) {
            fragment.append(
              document.createTextNode(body.slice(last))
            );
          }
        }
        const closing = document.createElement("span");
        closing.className = "enhl-delimiter";
        closing.textContent = text.slice(region.bodyEnd, region.end);
        fragment.append(closing);
        cursor = region.end;
      }
      if (cursor < text.length) {
        fragment.append(
          document.createTextNode(text.slice(cursor))
        );
      }
      node.replaceWith(fragment);
    }
  };
}
var EleventyNunjucksHighlighter = class extends import_obsidian.Plugin {
  async onload() {
    this.registerEditorExtension(editorHighlighter);
    this.registerMarkdownPostProcessor(makeReadingViewProcessor());
  }
};
