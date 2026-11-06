---
title: I added webmentions to my site
lang: en
date: 2025-06-02
tags: ["web-dev", "changelog"]
codify: true
description: After looking for ways to add interactivity with my blog posts, I decided to add Webmentions to my site.
---

Something that is usually seen in any kind of blog is a way to interact with each post. Usually you can leave comments, but there are also ways to track likes and shares in social media. Some website authors use a ready-to-use service like [Disqus](https://disqus.com/), an automated third-party system [Netlify functions](https://www.aleksandrhovhannisyan.com/blog/static-site-comments-github-issues/), or something handmade with a custom database.

This website is SSG'd (static-site generated), by which I mean that all the content is pre-built and my hosting service serves raw HTML files. In order to fit the what I want from this website, whatever solution I came up with had to match certain requirements.

- It had to give me full control of how to display the interactions,
- It should be a free and/or open-source solution
- It should not require the user to login into this site or provide any information to me
- It should be simple, unobtrusive and optional

To fulfill all these requirements, I started to look around the web. Enter [Webmentions](https://en.wikipedia.org/wiki/Webmention).

## Webmentions

Paraphrasing W3C, webmentions are a way for a website to be notified whenever another site links to it –hence, _web mentions_. In this way, instead of having a centralized service to keep track of interactions, it allows a [federated](https://en.wikipedia.org/wiki/Federation_(information_technology)) approach in which instead of forcing the user to interact with my platform, I simply get notified whenever they do it in any external site.

### Webmention io

There are a lot of ways to implement webmentions, but as far as I've seen a top contender is [webmention.io](https://webmention.io); a simple hosted service to receive webmentions from anywhere, with an API to retrieve these webmentions and showcase them in your site however you like.

Since [webmention.io](https://webmention.io) is a webmention receiver, this should work fine if my site is shared by someone who has webmentions integrated in their site. The only problem is that in this day and age, interaction mostly happens through social media and most of them don't use the webmentions protocol.

For that, there's a service called [brid.gy](https://brid.gy/).

### Bridgy

[brid.gy](https://brid.gy/) monitors any linked social media to see who interacts with your site. If I share a link to this article in [Bluesky](https://bsky.app/) and someone replies, likes or reposts, [brid.gy](https://brid.gy/) would send a webmention to [webmention.io](https://webmention.io), which I could later fetch with their API and showcase it in my site.

### Fetching my webmentions

Once [brid.gy](https://brid.gy/) and [webmention.io](https://webmention.io) are sending and receiving webmentions respectively, I then can bring them into my site and handle them as I see fit. Since this site is made with [11ty](https://www.11ty.dev/), I can retrieve my webmentions in a [global data file](https://www.11ty.dev/docs/data-global/) and have access to them in any of my templates.

To do this I just need to do a simple authorized HTTP Request.

```js
const response = await fetch(
  `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTIONS_TOKEN}&per-page=1000`
);

const body = await response.json();
const webmentions = body.children;

return webmentions;
```

With my webmentions available as JSON files, I can hanle them and display them however I want. If you wanna see how they are working, you can check them in [this article's footer](/blog/i-added-webmentions-to-my-site#post-footer).

{% raw %}

```njk
{% set reposts = mentions | webmentionsByType('repost-of') | filterOwnWebmentions %}
{% set likes = mentions | webmentionsByType('like-of') | filterOwnWebmentions %}
{% set replies = mentions | webmentionsByType('in-reply-to')  %}

{% set repostsSize = reposts.length %}
{% set likesSize = likes.length %}
{% set repliesSize = replies.length %}

{% set interactions = likes | mergeArrays(reposts) %}

{# ... #}

<div class="social-media">
	{% if likesSize > 0 %}
		<svg {# ... #}></svg>{{ likesSize }}
	{% endif %}

	{% if repostsSize > 0 %}
		<svg {# ... #}></svg>
		{{repostsSize}}
	{% endif %}

	{% if repliesSize > 0 %}
		<svg {# ... #}></svg>
		{{repliesSize}}
	{% endif %}

	<div class="share-buttons">
		{% include "components/share-buttons.html" %}
	</div>
</div>
```

{%endraw%}


## Sending Webmentions

<span class="sub">

This section is being added today, Nov. 6th 2026, as to complete this article.

</span>

So far, I've focused on receiving webmentions from other websites and displaying them on my own site. But webmentions work both ways. When you publish a post that links to someone else's website, you can notify that website about the link by sending a webmention.

A webmention sender scans your posts, extracts outbound links, checks whether the destination websites advertise a webmention endpoint, and sends a notification to those endpoints.

One tool that can do this is [@remy/webmention](https://github.com/RemySharp/webmention).

### Using your RSS feed as the source

An interesting detail is that you can point the sender at your RSS feed rather than an individual blog post URL.

This can be particularly useful with hosted blogging platforms. Depending on how the platform generates its HTML, the sender might identify the wrong source URL when inspecting an individual post. Using the RSS feed avoids this problem because the feed contains the canonical URLs of individual posts.

For example, you can scan your feed without sending anything:

```
npx @remy/webmention https://gary.place/feed.xml --limit 0 --debug
```

The tool defaults to dry-run mode, so this command discovers endpoints but does not send webmentions.

### What I found

I ran this against my own RSS feed, which contained 10 posts at the time of testing.

The tool found 136 link references across those posts. After checking the destinations, it discovered four webmention endpoints:

- [rknight.me](https://rknight.me/blog/adding-webmentions-to-your-site/)
- [jay.gooby.org](https://jay.gooby.org/2021/01/15/getting-webmentions-and-bridgy-working)
- [janmonschke.com](https://janmonschke.com/adding-webmentions-to-your-static-blog/)
- [sia.codes](https://sia.codes/posts/webmentions-eleventy-in-depth/)

All four endpoints used webmention.io.

The tool also skipped some links, including YouTube videos and GitHub URLs. So the number of discovered endpoints is not a simple measure of all the websites that might support webmentions.

Still, four endpoints from 136 link references gives a good indication of how limited adoption remains.

One other thing worth noting: the tool correctly identified the individual post URL as the source, even though I supplied the RSS feed URL:

`https://gary.place/post/i-added-webmentions-to-my-site/`

That's a useful confirmation that the feed-based approach works with my blog.

### Sending the webmentions

Once you're happy with the dry-run results, you can add the `--send` flag:

```
npx @remy/webmention https://gary.place/feed.xml --limit 0 --send
```

This tells the tool to send webmentions to the endpoints it discovers.

I'd recommend starting with a small number of posts before scanning your entire feed.

For more details, see [Usama's article on sending webmentions from a blog](https://justblogged.com/blog/webmentions-on-a-blog).

## Next steps

The main problem remaining with my approach to webmentions is the fact that they will only be obtained whenever I choose to rebuild and deploy a new version of the site. The easiest way to fix this may be to configure some sort of cron job to periodically rebuild my site and deploy it, which would also refetch any webmention I may have available.

## Further reading

There were a few articles I used to help me implement these webmentions. Here they are:

- [Adding Webmentions to Your Site](https://rknight.me/blog/adding-webmentions-to-your-site/) by Robb Knight.
- [Getting web mentions and brid.gy working on the blog ](https://jay.gooby.org/2021/01/15/getting-webmentions-and-bridgy-working) by Jay Caines-Gooby
- [Adding webmentions to my site](https://bobmonsour.com/blog/adding-webmentions-to-my-site/) by Bob Monsour
- [Add the ability to send Webmentions to other IndieWeb sites](https://indiewebify.me/#send-webmentions) by IndieWebify.Me
- [Adding webmentions to your static blog](https://janmonschke.com/adding-webmentions-to-your-static-blog/) by Jan Monschke
- [An In-Depth Tutorial of Webmentions + Eleventy](https://sia.codes/posts/webmentions-eleventy-in-depth/) by Sia Karamalegos
