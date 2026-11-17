---
title: "Learning p5.js week five: Worley Noise"
lang: en
date: 2025-11-08
description: "Week five of p5.js sketches: This time I try to implement Worley Noise, a different approach to OpenSimplex Noise, the one I used for Marching Squares."
tags: ["creative-coding", "learning"]
---

This time I'll be sketching the **Worley Noise** algorithm following [this implementation](https://www.youtube.com/watch?v=4066MndcyCk) by [The Coding Train](https://thecodingtrain.com/).

## What is Worley Noise

According to [Wikipedia](https://en.wikipedia.org/wiki/Worley_noise):

> [...] is a [noise](https://en.wikipedia.org/wiki/Gradient_noise "Gradient noise") function [...] that outputs a real value at a given coordinate that corresponds to the [distance](https://en.wikipedia.org/wiki/Distance "Distance") of the nth nearest seed (usually n=1) and the seeds are distributed evenly through the region.

Explained more simply, Worley noise is a way to make natural-looking patterns by measuring how far each point in space is from a set of random “feature points.”

It's often used in computer graphics to create textures that look like stone, water, cells, or bubbles, because the distance-based patterns feel organic and irregular.

## How It Works

The sketch builds a noise texture called Worley noise.

It begins by scattering random "feature points" throughout a 3D space, then for each pixel in a 2D image, it calculates how far that pixel's (x, y, z) position is from the nearest feature points. These distances are used to determine texture intensity and shape.

The two closest distances are blended through a contrast function and mapped to colors from a palette, producing smooth, cell-like patterns. Each animation frame uses a different z-slice of the 3D space, creating an evolving effect.

## Final result

<iframe src="https://editor.p5js.org/KuluGary/full/6WtRz8N7G"></iframe>

## References

- [Coding Worley Noise](https://www.youtube.com/watch?v=4066MndcyCk) by [The Coding Train](https://thecodingtrain.com/).
- [A Cellular Texture Basis Function](https://www.rhythmiccanvas.com/research/papers/worley.pdf) by **Steven Worley**.
