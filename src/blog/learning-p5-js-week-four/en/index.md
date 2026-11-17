---
title: "Learning p5.js week four: Hilbert Curve"
lang: en
date: 2025-11-01
description: "Week four of p5.js sketches: Implementing the Hilbert curve algorithm to draw the classic infinite space-filling curve."
tags: ["creative-coding", "learning"]
---

In this week's experiment I'll be diving into the **Hilbert curve** algorithm following along this video from [The Coding Train](https://thecodingtrain.com/).

## What is the Hilbert Curve

According to [Wikipedia](https://en.wikipedia.org/wiki/Hilbert_curve):

> [...] a [continuous](https://en.wikipedia.org/wiki/Geometric_continuity "Geometric continuity") [fractal](https://en.wikipedia.org/wiki/Fractal_curve "Fractal curve") [space-filling curve](https://en.wikipedia.org/wiki/Space-filling_curve "Space-filling curve").

In simpler terms, it's a mathematical curve that can theoretically fill an entire two-dimensional area by following a precise recursive pattern.

Each iteration (called an _order_) increases the resolution, bending the line tighter and tighter until it nearly becomes solid.

Hilbert curves show up in computer science, image compression, and even dithering algorithms for grayscale rendering.

## How It Works

The sketch builds the curve point by point.

Each position in the sequence is converted into an (x, y) coordinate using a **Hilbert index function**: a mapping from a single integer to a two-dimensional location.

For every frame:

- The curve progresses one segment forward.
- Each segment's color is smoothly interpolated along a palette, creating a gradient through the path.
- Once the final point is reached, the animation halts, revealing the entire pattern.

The algorithm scales with order so higher orders produce increasingly dense, woven paths that almost resemble clothing fibers under a microscope.

## Final result

<iframe src="https://editor.p5js.org/KuluGary/full/qTREixd8E" height="650px"></iframe>

## References

- [Coding the Hilbert Curve](https://www.youtube.com/watch?v=dSK-MW-zuAc) by [The Coding Train](https://thecodingtrain.com/).
- [One file JS program that draws Hilbert curve iteratively](https://github.com/marcin-chwedczuk/hilbert_curve) by [Marcin Chwedczuk](https://github.com/marcin-chwedczuk).
- [Hilbert's Curve: Is infinite math useful?](https://www.youtube.com/watch?v=3s7h2MHQtxc&pp=0gcJCR0AztywvtLA) by [3Blue1Brown](https://www.youtube.com/@3blue1brown).