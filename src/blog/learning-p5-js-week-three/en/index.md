---
title: "Learning p5.js week three: Wave Function Collapse"
lang: en
date: 2025-10-26
description: "Week three of learning p5.js: implementing the Wave Function Collapse algorithm in JavaScript to generate procedural patterns and explore constraint-based systems."
tags: ["creative-coding", "learning"]
---

After a short break, this week I’m exploring the **Wave Function Collapse** algorithm, following [this video](https://www.youtube.com/watch?v=rI_y2GAlQFM) by [The Coding Train](https://thecodingtrain.com/).

## What Is Wave Function Collapse

According to [Wikipedia](https://en.wikipedia.org/wiki/Model_synthesis):

> [...] a family of [constraint-solving](https://en.wikipedia.org/wiki/Constraint_solving "Constraint solving") [algorithms](https://en.wikipedia.org/wiki/Algorithm "Algorithm") commonly used in [procedural generation](https://en.wikipedia.org/wiki/Procedural_generation "Procedural generation"), especially in the [video game industry](https://en.wikipedia.org/wiki/Video_game_industry "Video game industry").

In simpler terms, it’s a system that generates patterns or terrains based on rules: it decides what can go where, making sure every new tile fits the constraints of its neighbors.

It’s often used in procedural world generation for games, where randomness needs to feel intentional.

## How It Works

The sketch creates a grid of cells across the canvas and assigns a tile to each one.

Every time a new tile is placed, it checks the constraints of its neighbors and narrows down the possible options. If more than one tile fits, it picks one at random while balancing order and chance.

What emerges is a patchwork of tiles that looks structured yet organic, as if the design grew naturally from a set of invisible rules.

## Final Result

<iframe src="https://editor.p5js.org/KuluGary/full/bsDgOBTKQ" height="350px"></iframe>

Here’s the sketch in motion. Watch how the grid resolves itself into a coherent pattern.

## References

- [Coding Challenge 171: Wave Function Collapse](https://www.youtube.com/watch?v=rI_y2GAlQFM) by [The Coding Train](https://thecodingtrain.com/).
- [Wave Function Collapse algorithm](https://github.com/mxgmn/WaveFunctionCollapse) by [Maxim Gumin](https://github.com/mxgmn).
- [Model Synthesis](https://paulmerrell.org/model-synthesis/) by [Paul Merrell](https://paulmerrell.org/).
- [“Wave Function Collapse” in Processing](https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983) at [The Processing Foundation](https://discourse.processing.org/).