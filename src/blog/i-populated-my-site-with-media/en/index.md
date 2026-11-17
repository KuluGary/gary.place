---
title: I populated my site with media
lang: en
date: 2025-05-29
tags: ["web-dev", "changelog"]
codify: true
description: Previously, my site was only populated with content I hand crafted. Now, I've started pulling from some services to populate it with my favourite media.
---

In the [first few versions](https://web.archive.org/web/20240522101420/https://kulugary.neocities.org/) of my personal site all my [Global data](https://www.11ty.dev/docs/data-global/) was from [hand-crafted JSON files](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/sites.json#L3) I'd update myself from time to time. This was fine for its purpose: I would add new info very rarely and I had complete control over how I wanted the data to be structured.

A few weeks back I came across [PhotoGabble's bookshelf](https://photogabble.co.uk/books/) and [Cory Dransfeldt's site](https://www.coryd.dev/), and liked how they showcased their favourite media. I think your artistic preferences can say a lot about who you are as a person, and sharing it with the world can help other like-minded people to discover new things they may have not even have heard about.

Needless to say, I wanted to do something similar to those cool websites and got carried away with it. You can see the full result at [my media page](/media) and each individual page such as [manga](/manga) or [games](/games).

## Obtaining from the source

First I thought about what media I enjoy and interact with the most, and would like to share with people. If I had to put it in order it'd be something like _Youtube videos_, _comics_, _games_, _shows_ and _music_. Knowing this, I wanted a way to automate retrieving some kind of lists that I can parse and display in this site.

Aside from the obvious –like using Youtube to track videos –, I had to see where I did or could track these lists. For games I chose the following:

- [How Long To Beat](https://howlongtobeat.com/) for games,
- [Trakt.tv](https://trakt.tv/dashboard) for shows and movies,
- [MangaDex](https://mangadex.org/) for manga,
- [YouTube](https://www.youtube.com/) for videos,
- and [Spotify](https://open.spotify.com/) for music.

I also later added webcomics, but I made that a little differently and I may write a follow-up article about it.

The problem with some of these services –specifically HLTB and Trakt.tv –is that no public API is available. HLTB has an an [open discussion](https://howlongtobeat.com/forum/thread/807/1) about it, but there's nothing planned in the roadmap yet.

For these specific cases, I resorted to webscaping.

### Webscraping

Webscraping is a practice I'm skilled at but is never my first choice to obtain any kind of data from a provider. Aside from any ethical implications it may have, its unreliability and dependance on the source's front end makes it a not very robust way of retrieving data.

However that may be, I created some data files in my site and implemented the webscraping algorithm with [Puppeteer](https://www.npmjs.com/package/puppeteer).

#### Webscraping my game lists

HLTB allows you to have a few "lists" depending based on the status of the game. To organize my data, I created an object based on these status keys and which public URL matches it.

```js
const PAGES = {
  playing: `https://howlongtobeat.com/user/${HLTB_USER}/games/playing/1`,
  backlog: `https://howlongtobeat.com/user/${HLTB_USER}/games/backlog/1`,
  favourites: `https://howlongtobeat.com/user/${HLTB_USER}/games/custom/1`,
  played: `https://howlongtobeat.com/user/${HLTB_USER}/games/custom2/1`,
  completed: `https://howlongtobeat.com/user/${HLTB_USER}/games/completed/1`,
  retired: `https://howlongtobeat.com/user/${HLTB_USER}/games/retired/1`,
};
```

Thanks to this, I can iterate through each page in order to access it with [Puppeteer](https://www.npmjs.com/package/puppeteer).

```js
for (const [status, url] of Object.entries(PAGES)) {
  collection[status] = await scrapeGamesFromPage(page, url, status);
}
```

In each of these pages, there's a list from where we can obtain a `div` element with some game information.

```js
await page.waitForSelector("#user_games");
```

Since the information obtained from can be a little scarce, I created two functions: [one scrapes the list itself](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/games.js#L88), and the other [navigates to the game's profile where it obtains the rest of the data needed](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/games.js#L29). With this, I had all the data I needed to structure my objects.

```js
{
  id,
  type: "games",
  title,
  description,
  genres,
  platform,
  link,
  thumbnail: image,
  updatedAt: extendedInfo?.date_updated,
  addedAt: extendedInfo?.date_added,
  startedAt: extendedInfo?.date_start,
  completedAt: extendedInfo?.date_complete,
  playtime,
  rate,
  author: { name: developer },
}
```

See the full implementation [here](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/games.js).

#### Webscraping my movies and shows

Trakt.tv works extremely similar. I also had a object with `[key: Status]: Url` where I iterate to visit and scrape data from a grid of elements. As a small benefit, Trakt.tv makes use of a lot of data-attributes in their DOM elements, so obtaining the data was easier in some instances.

```js
const [title, link, originalTitle, id, date_created, date_added] = await Promise.all([
  titleEl.evaluate((el) => el.innerText),
  linkEl.evaluate((el) => el.href),
  element.evaluate((el) => el.getAttribute("data-title")),
  element.evaluate((el) => el.getAttribute("data-list-item-id")),
  element.evaluate((el) => el.getAttribute("data-released")),
  element.evaluate((el) => el.getAttribute("data-added")),
]);
```

See the full implementation [here](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/shows.js).

### Using the Youtube API

In order to retrieve the videos I wanted to share in my site, I made a public playlist with my favourite ones. My first instinct to retrieve them was through its feed URL `https://www.youtube.com/feeds/videos.xml?playlist_id=`; however the data available through this method was lacking so I started looking into [Youtube's public API](https://developers.google.com/youtube/v3?hl=es-419).

After setting up the API keys, I could implement an HTTP Request to obtain the `playlistItems`.

```js
const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");

url.searchParams.append("part", "snippet");
url.searchParams.append("part", "contentDetails");
url.searchParams.append("maxResults", "50");
url.searchParams.append("playlistId", playlistId);
url.searchParams.append("key", process.env.YOUTUBE_API_KEY);

const response = await fetch(url);
```

The problem again was that it lacked some of the details I wanted to share, like the number of views or the `tags`. For that, I had to make another Request.

```js
const url = new URL("https://www.googleapis.com/youtube/v3/videos");
url.searchParams.append("part", "contentDetails");
url.searchParams.append("part", "snippet");
url.searchParams.append("part", "statistics");
url.searchParams.append("id", videoId);
url.searchParams.append("key", process.env.YOUTUBE_API_KEY);

const response = await fetch(url);
```

With this I had all the info I could see myself needing, including some additional properties I may use in the future.

```js
{
  id: video.contentDetails.videoId,
  type: "videos",
  title: video.snippet.title,
  description: video.snippet.description,
  link: `https://youtube.com/watch?v=${video.contentDetails.videoId}`,
  thumbnail: video.snippet.thumbnails.standard?.url,
  createdAt: video.contentDetails.videoPublishedAt,
  updatedAt: video.snippet.publishedAt,
  author: {
    name: video.snippet.videoOwnerChannelTitle,
    link: `https://youtube.com/channel/${video.snippet.videoOwnerChannelId}`,
  },
  rate,
  views,
  duration,
  tags,
}
```

See the full implementation [here](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/videos.js).

### Using the MangaDex API

MangaDex also has a public API, documentation and Swagger so it wasn't particularly difficult to retrieve my data. In that case I had the following object to do a lookup for the URLs.

```js
{
  MANGA_LIST: `https://api.mangadex.org/list/${MANGA_LIST_ID}`,
  MANGA_BASE:
    "https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica",
  CHAPTER_BASE: "https://api.mangadex.org/chapter",
  FOLLOWS:
    "https://api.mangadex.org/user/follows/manga?&includes[]=cover_art&includes[]=artist&includes[]=author&includes[]=manga",
  STATUS: "https://api.mangadex.org/manga/status",
};
```

The first difference I needed to implement was an authorization function, where I would retrieve a JSON web token in order to send in further request as a `Bearer token`.

```js
async function authenticate() {
  const credentials = {
    grant_type: "password",
    username: process.env.MANGADEX_USERNAME,
    password: process.env.MANGADEX_PASSWORD,
    client_id: process.env.MANGADEX_CLIENT_ID,
    client_secret: process.env.MANGADEX_CLIENT_SECRET,
  };

  const formData = qs.stringify(credentials);

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  }).then((res) => res.json());

  headers.Authorization = `Bearer ${response.access_token}`;
}
```

With this, each and every subsequent request would be properly authenticated and authorized.

```js
const [followList, statusMap, favouriteList] = await Promise.all([
  fetchAllPaginated(ENDPOINTS.FOLLOWS, headers),
  fetchJSON(ENDPOINTS.STATUS, headers),
  fetchJSON(ENDPOINTS.MANGA_LIST),
]);
```

The `/user/follows` endpoint has a maximum limit of `100`, so in order to retrieve all my following manga –with all its different potential status –, I had to implement a paginated request. This was fairly easy, since the API itself returns everything needed.

```js
async function fetchAllPaginated(url, headers = {}) {
  const limit = 100;
  let offset = 0;
  let allData = [];
  let hasMore = true;

  while (hasMore) {
    const paginatedUrl = `${url}&limit=${limit}&offset=${offset}`;
    const response = await fetchJSON(paginatedUrl, headers);
    allData = allData.concat(response.data);
    offset += limit;
    hasMore = response.total ? offset < response.total : response.data.length === limit;
  }

  return allData;
}
```

The other small pitfall is that MangaDex includes a CORS firewall to disallow linking to their images –for me, I wanted the covers –, so instead I had to download them into memory.

```js
async function downloadCover(url, fileName) {
  const buffer = await fetch(url)
    .then((res) => res.buffer())
    .catch((err) => OPTIONS.logError && console.error(err));
  const filePath = `${coverPath}/manga/${fileName}`;

  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, buffer);
}
```

And with this I had all the data needed.

```js
{
  id,
  type: "manga",
  title,
  description,
  genres,
  author: { name: author },
  rating,
  link: manga.attributes.links?.raw,
  thumbnail: `/assets/images/covers/manga/${coverFileName}`,
  updatedAt: latestChapter.data?.attributes?.publishAt ?? manga.attributes.updatedAt,
}
```

See the full implementation [here](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/manga.js).

### Using the Spotify API

I have to say I'm not a big Spotify user, but in order to keep track and order my music for this site, I created a playlist which then I wanted to recover its information through their API.

```js
const PLAYLISTS = {
  favourites: "79jHGYxWHmhXthpE0o8DIK",
};
```

After setting up my API keys I needed to use them in the authentication step to generate the headers needed for every other request.

```js
async function authenticateSpotify() {
  const authRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_SECRET_KEY,
    }),
  });

  const { access_token } = await authRes.json();
  headers["Authorization"] = `Bearer ${access_token}`;
}
```

After that I could iterate through all the playlists I wanted to recover, and fetch the playlist tracks.

```js
for (const [key, playlistId] of Object.entries(PLAYLISTS)) {
  log("[Spotify]", `📥 Fetching playlist: ${key}`);
  const playlistData = await fetchPlaylistTracks(playlistId);
  collection[key] = await transformPlaylistItems(playlistData.items);
}
```

Once fetched I just had to map the data into the object structure I wanted to use and I was done.

```js
{
  id: track.id,
  type: "music",
  title: track.name,
  thumbnail: track.album.images[0]?.url || null,
  author: {
    name: track.artists.map((a) => a.name).join(", "),
  },
  genres,
  addedAt: item.added_at,
}
```

See the full implementation [here](https://github.com/KuluGary/website/blob/f78d2af512e84a37054dc0256ac767590bcec057/src/_data/music.js).

## Applying the data to my HTML templates

For this website I'm using 11ty with Nunjucks, so once I have my global data accessible in every template, I just had to display it.

I created a few reusable components to show my media as either a description or a grid of thumbnails, with toggle buttons inside each header to show it as the users preference. In order to do that I only had to choose which data I wanted to pass to the component.

{% raw %}

```njk
{% set media = shows.favourites | limit(5) %}
{% set href = "/shows/status/favourites" %}
{% set sectionTitle = "Favourite shows" %}
{% include "components/media-list-section.html" %}
```

{% endraw %}

This rendered the html as I wanted it. You can see how this looks in my [media page](/page), where each section is defined with this structure. The choise of grid or list is saved into the users `LocalStorage`, as I wanted it to persist between navigation and visits to my page.

## Final notes

The full implementation is my [site's repository](https://github.com/KuluGary/website). You can check out all my data files, my template implementations and how I generate different pages for each of them.

Thanks for reading this far and if you have any questions
