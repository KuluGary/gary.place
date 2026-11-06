import { getOriginalUrl } from "./utils.js";

/**
 * Generates the markup for an audio element.
 *
 * Nunjucks usage:
 *
 *     {% audio section=category, slug=postSlug %}
 *     theme.wav | Main theme. | Gary C. | Videogame OST | thumbnail.png
 *     {% endaudio %}
 * @param {string} content
 * @param {AudioOptions} options
 * @returns {string}
 */
export async function generateAudio(content, { section, slug }) {
  const audio = parseAudioContent(content);
  return `
		<figure class="audio">
			<figcaption>
				<div class="audio-details">
					<span class="title">${audio.title}</span>
					${audio.author ? `<span class="artist">${audio.author}</span>` : ""}
					${audio.album ? `<span class="album">${audio.album}</span>` : ""}
				</div>
				${audio.thumbnail ? `<img class="album-cover" src="${getOriginalUrl(section, slug, audio.thumbnail)}">` : ""}
			</figcaption>
			<audio controls="">
				<source src="${getOriginalUrl(section, slug, audio.filename)}" type="audio/${audio.extension}" />
				</audio>
		</figure>
`;
}

function parseAudioContent(content) {
  const [filename, title, author, album, thumbnail] = content
    .trim()
    .split("|")
    .map((value) => value.trim());

  if (!filename) {
    throw new Error("An audio filename is required.");
  }

  const extension = filename.split(".").pop();

  return {
    filename,
    title,
    author,
    album,
    thumbnail,
    extension,
  };
}

/**
 * @typedef {Object} AudioOptions
 * @property {string} section
 * @property {string} slug
 */

/**
 * @typedef {Object} AudioDefinition
 * @property {string} filename
 * @property {string} title
 * @property {string} author
 * @property {string} thumbnail
 */
