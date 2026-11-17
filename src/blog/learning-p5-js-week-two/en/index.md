---
title: "Learning p5.js week two: Marching Squares"
lang: en
date: 2025-10-11
tags: ["creative-coding", "learning"]
description: "Week two of p5.js experiments: implementing the marching squares algorithm in JavaScript to generate procedural worlds from simple values."
---

This week's experiment dives into the **marching squares** algorithm, following [this video](https://www.youtube.com/watch?v=0ZONMNUKTfU) from [The Coding Train](https://thecodingtrain.com/).

## What are Marching Squares

According to [Wikipedia](https://en.wikipedia.org/wiki/Marching_squares):

> [...] an [algorithm](https://en.wikipedia.org/wiki/Algorithm "Algorithm") that generates [contours](https://en.wikipedia.org/wiki/Contour_lines "Contour lines") for a two-dimensional [scalar field](https://en.wikipedia.org/wiki/Scalar_field "Scalar field") (rectangular [array](https://en.wikipedia.org/wiki/Array_data_structure "Array data structure") of individual numerical values)

In simpler terms, it’s a way to turn a field of numbers into shapes.
Its 3D cousin, [marching cubes](https://en.wikipedia.org/wiki/Marching_cubes), is often used in [game development](/blog/tags/game-dev) to build procedural worlds — think [Minecraft](https://www.minecraft.net) or [Terraria](https://terraria.org).

If you're curious about how that looks in practice, [Sebastian Lague’s video](https://www.youtube.com/watch?v=M3iI2l0ltbE) is a great deep dive into generating landscapes on the fly.

## How It Works

The script builds a grid of cells across the canvas like a chessboard, and assigns each corner a value based on a noise function.

Each square is then evaluated: depending on which corners are above or below a threshold, a contour line is drawn through it. The result is a fluid, organic network of lines that seem to outline invisible terrain.

It's a surprisingly compact algorithm for what it does. With just a few loops and a bit of logic, a world starts to take shape from numbers alone.

## Final result

<iframe src="https://editor.p5js.org/KuluGary/full/zzYneA4wT" height="350px"></iframe>

## References

- [Coding Marching Squares](https://www.youtube.com/watch?v=0ZONMNUKTfU) by [The Coding Train](https://thecodingtrain.com/).
- [open-simplex-noise-js](https://github.com/joshforisha/open-simplex-noise-js) by [Josh Forisha](https://github.com/joshforisha).
