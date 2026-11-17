---
title: Scrapping HLTB
date: 2024-11-15
tags: ["web-dev"]
description: The game tracking platform How Long To Beat doesn't have a public facing API, so I've made a JS script to scrap my public profile for my Now page.
---

If you had a peek in my [Now page](/now), you may have seen I have a list of games categorized by state of play at the moment. This page is made thanks to a [JSON Data File](https://www.11ty.dev/docs/data-global/) I generate by webscrapping my [public How Long To Beat profile](https://howlongtobeat.com/user/KuluGary), and then use it to populate the HTML.

While I wanted to use an API to access HLTB data, I found a [forum thread](https://howlongtobeat.com/forum/thread/807/1) asking for the same, and found out there's no public API available at the moment. So as a temporary measure, I made a small Node script using [Puppeteer](https://pptr.dev/) to scrape the data I need and save it in my files from time to time.

It's fairly specific to my use case and it's not particularly performant or thought out, but if it can be of use to you, here you have it:

<a href="/assets/files/dump-games.js" download>Download the script here.</a>
