---
title: Leaflet for Fantasy Maps
date: 2023-12-22
lang: en
tags: ["web-dev", "leaflet"]
codify: true
description: Fantasy maps are a cool way to polish your worldbuilding, and you can share them online with extra interactivity thanks the the LeafletJS library.
---

We've all seen it: When you buy a new book from any fantasy series -be it [The Lord of the Rings](https://en.wikipedia.org/wiki/The_Lord_of_the_Rings) or [The Witcher](https://en.wikipedia.org/wiki/The_Witcher) -, it oftens includes a detailed map to allow you to immerse yourself in the world and its locations.

As it was expected, with the advent of the Internet and new ways to share stories, fantasy maps have evolved to adapt themselves to the new ecosystem. No need to go further than Netflix's The Witcher, where they took Andrzej Sapkowski's map of the Continent and gave it a [new layer of interactivity](https://www.witchernetflix.com/es/map/captured-by-nilfgaard).

Aside from the use for aesthetic utility, there's also a practicality to the concept of a fantasy map. If there wasn't, there wouldn't be a whole [website](https://mapgenie.io/) dedicated to interactive videogame maps. Whatever the reason, a book series, videogame or TTRPG campaign, it's not uncommon to want to make your own fantasy map and share it online.

## Leaflet.js

As it is with most technology dilemmas, there's not a single solution to this problem. There's tens of JavaScript libraries that allow to make one's own map, and [Leaflet](https://leafletjs.com/) is one of them.

[Leaflet](https://leafletjs.com/) is used for typical use cases for maps in the world of web development, but if you look deeper into [its documentation](https://leafletjs.com/examples/crs-simple/crs-simple.html), you may realize that nothing's stopping you from using different geography from real-world's Earth. That's why [Leaflet](https://leafletjs.com/) is an excellent option to include interactivity to your fantasy worlds.

## How to make the map

Before you can add interactivity with [Leaflet](https://leafletjs.com/) and publish it to your website, you need to generate your map. There's tons of options available for your: you may choose to pick up pen and paper, paint it digitally in your software of choice, ...

[![How to download a map from Azhaar's](./assets/screenshot1.gif "How to download a map from Azhaar's")](./assets/screenshot1.gif)

However, if all other choise is out of your reach, because you lack the skill or time to make them from scratch, there's some alternatives I can recommend. You can't bring up interactive fantasy maps without mentioning [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/). The raw amount of choice of configuration and customization it offers makes it explaining the software way out of this article's scope, but I can send you to its [subreddit](https://www.reddit.com/r/FantasyMapGenerator/) where you may find information and ask any questions.

Otherwise, if you are interested in smaller-scale maps, [Watabou](https://watabou.github.io/) has a few generators that can generates anything from cities to kingdoms and dungeons.

## Implementation

**Note**: If you have no previous knowledge of [Leaflet](https://leafletjs.com/), I recommend you go through their [quick start guide](https://leafletjs.com/examples/quick-start/). It will get you up to speed about the basics of [Leaflet](https://leafletjs.com/).

Once you have the image that represents your map, you may start your implementation with [Leaflet](https://leafletjs.com/). [Leaflet](https://leafletjs.com/) is very intuitive and I urge you to play around with any configuration, but let's start with some examples.

```js
let map = L.map("map", {
  crs: L.CRS.Simple,
  maxBounds: bounds,
  minZoom: -2,
  maxZoom: -1,
  maxBoundsViscosity: 1,
});

map.fitBounds(bounds);
```

We initialize our map with a few parameters. The parameters minZoom and maxZoom are quite self-explanatory: they allow you to know how much you can zoom in or out of the map. Depending on the image size and map you have chosen, you may need to modify these values.

The maxBounds parameter is an imaginary rectangle of where the user can move when navigating your map. In the case of this example, it would be something like this: `bounds = [[0, 0], [3736, 5952]],`.

[![Differences between maxBoundsViscosity](./assets/screenshot2.gif "Differences between maxBoundsViscosity ")](./assets/screenshot2.gif)

Finally, `maxBoundsViscosity` is a parameter that you can optionally modify. By default, it has a value of `0.0`, and what it does is that if you go beyond the maxBounds, instead of stopping completely, it allows you to move a little (determined by the value you set) and when you release the mouse, it returns you to your position. With a value of `1`, it doesn't allow you to see anything beyond the bounds.

```js
L.imageOverlay("assets/images/map.jpg", bounds).addTo(map);
```

[ImageOverlay](https://leafletjs.com/reference.html#imageoverlay) is a type of Raster Layer that [Leaflet](https://leafletjs.com/) uses to render a [raster image](https://en.wikipedia.org/wiki/Raster_graphics). If we were to make a real-world map, we would use [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON), but in our case a static image is more than enough.

Once we've included these lines of code, our map is already displayed on the screen. At this point, we could consider the implementation complete and publish it directly on our website. However, there are still some things we can do to improve its interactivity.

If you have any implementation questions, here's the code we've written up to this point.

<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash="yLwbvRX" data-user="KuluGary" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KuluGary/pen/yLwbvRX">
  Leaflet JS 1</a> by Gary Cuétara (<a href="https://codepen.io/KuluGary">@KuluGary</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### Markers

It's not uncommon for an interactive map to have markers that specify the position of certain points of interest in our fantasy world. If we take [this Skyrim interactive map](https://mapgenie.io/skyrim/maps/skyrim), we'll see its full of markers that signal cities, camps and other relevant places.

Lucky for us, [Leaflet](https://leafletjs.com/) makes it really easy to implement this kind of marker. In an object array, we can define what kind of markers we want to include.

```js
const markers = [
  { id: "marker-1", position: [2502, 1070] },
  { id: "marker-2", position: [2038, 2480] },
  { id: "marker-3", position: [2048, 3578] },
];
```

We can define as much as we want in these objects. As an example, we can also define what kind of marker each one is.

```js
  { id: "marker-1", position: [2502, 1070], type: "#city" },
```

If you only want one kind of marker, you don't have to include the `type` parameter. Otherwise, it will be useful to know which SVG element to use to visualize it.

If you want to download SVG icons for fantasy markers, I recommend [Game-icons.net](https://game-icons.net/tags/building.html), where you can find hundreds of high-quality icons which really fit this kind of map.

```js
let layers;
// ...

layers = new L.LayerGroup();

for (const marker of markers) {
  const myIcon = L.divIcon({
    className: "place-marker",
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><use href="${marker.type}" /></svg></div>`,
    iconAnchor: [20, 20],
  });

  const newMarker = L.marker(marker.position, { icon: myIcon });

  layers.addLayer(newMarker);
  map.addLayer(layers);
}
```

To start, we iterate over each of the markers in our array, and from there, we obtain the ID of the SVG we will use, which is stored under the `type` property. To fetch this SVG, we make use of the [use](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) property, allowing us to use an SVG that we have already defined in our HTML.

Next, we create a marker of type [DivIcon](https://leafletjs.com/reference.html#divicon). There are extensions and plugins in [Leaflet](https://leafletjs.com/) that enable you to use [SVG icons directly](https://github.com/iatkin/leaflet-svgicon), but for simplicity, we can do it this way for now.

## Appendix

There's lots of ways to improve a map of this kind. Using the [Skyrim map](https://mapgenie.io/skyrim/maps/skyrim) we mentioned earlier as an example, you can add a navigation bar, a searchbar, ways to toggle the markers on and off, and some pop-ups that appear when you click on a marker.

For any of these, I recommend you check out the [Leaflet examples](https://leafletjs.com/examples.html) and their [documentation](https://leafletjs.com/reference.html), where you can find tons of information regarding features you can add to your map.

And that's it. I hope this article is useful to you to start your adventure with fantasy map generation.

## Sources

1. [Leaflet](https://leafletjs.com/)
2. [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/)
3. [Watabou's Generator](https://watabou.itch.io/)
4. [MapGenie's game maps](https://mapgenie.io/)
