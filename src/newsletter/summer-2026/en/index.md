---
title: "Summer 2026"
date: 2026-09-25
tags: personal
description: What I’ve been up to these past months.
lightbox: true
---

This summer’s been rough, huh?

In Europe we’ve had one of the hottest seasons in recorded history. Maybe you’ve heard or read about it in the news. Now that we’re closer to the fall, I hope we get a little bit of a breather.

Even though it’s been tough, I’ve tried to keep working on stuff all the same.

## Website redesign

I’ve had the itch to rework my personal site for a while now. I think my first prototypes go back to late last year, but I didn’t find something I was content with until now.

{% gallery section=category, slug=postSlug %}
screenshot-2.png | First iteration of this website
screenshot-1.png | Second iteration of this website
{% endgallery %}

In the end I went for something a little minimalistic. I used [Hyperblam's docs](https://hyperblam.how/) and [Toby Fox's website](https://toby.fangamer.com/) for inspiration.

{% image section=category, slug=postSlug %}
website.png | A screenshot of the home page of gary.place | Newest design for gary.place
{% endimage %}

## Personal media tracker

I've written a few articles about my [media tracker](/blog/i-populated-my-site-with-media/) in the past, but since then I reworked it to become a CLI tool that is completely configurable and can synchronize specific sources. For example:

`tracker sync youtube playlist-items --playlist "$YOUTUBE_PLAYLIST_ID"`

With this I can self-host it easier and also share it with family and friends who want to use it.

## Game development

I’ve been working in a small prototype based on the *Fushigi no Dungeon* series. If the name doesn’t ring a bell, it’s the series which Pokémon Mystery Dungeon spun-off of. The original one, *Torneko no Daibōken: Fushigi no Dungeon*, recently got an HD re-release [on Steam](https://store.steampowered.com/app/4027450/Dragon_Quest_Heroes_Tornekos_Mystery_Dungeon_Classic_HD/) and other current-gen consoles.

On my prototype, I’m working on re-creating the dungeon-generation algorithm.


{% image section=category, slug=postSlug %}
dungeon-generation.gif | A showcase of multiple dungeon layouts being generated in real time.
{% endimage %}

Thankfully, lots of smart people have already made [fan-made](https://wiki.pmdo.pmdcollab.org/Grid_of_Rooms_Generation) [implementations](https://github.com/hayesgr/Dungeon_gen) of those [features](https://github.com/EpicYoshiMaster/dungeon-mystery), so I had lots of references while writing the code.

{% image section=category, slug=postSlug %}
dungeon-navigation.gif | A small character-sprite navigating the generated dungeon.
{% endimage %}

Right now it’s just a prototype, but maybe later it’ll shape up into something more.

## What’s next?

Well, in terms of this site, I have a few posts on draft right now that I’ll be publishing in the coming months. Aside from game-making, I have stuff written about a few games I want to talk about.

I also plan to keep developing the prototype, and uploading it to [itch.io](https://itch.io/) when it’s done.

Regarding my personal life, the following months seem to be shaping up to be quite busy. I have to take care of some house issues that have shown up during the summer, and some job stuff to take care of too. I don’t quite particularly want the busyness, but it is what it is.

Let’s try to have a good fall this year, alright?