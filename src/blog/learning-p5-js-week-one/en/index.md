---
title: "Learning p5.js week one: Paper marbling algorithm"
lang: en
date: 2025-10-04
tags: ["creative-coding", "learning"]
description: "Week one of p5.js experiments: a digital take on paper marbling, where geometry and color mix into flowing, unpredictable patterns."
---

This week starts my first experiment with [p5.js](https://p5js.org/). The subject for today is the paper marbling algorithm, based in the implementation explained in [this video](https://www.youtube.com/watch?v=p7IGZTjC008) by [The Coding Train](https://thecodingtrain.com/).

Paper marbling, as defined by [Wikipedia](https://en.wikipedia.org/wiki/Paper_marbling), is:

> [...] a method of [aqueous](https://en.wikipedia.org/wiki/Aqueous_solution "Aqueous solution") surface design, which can produce patterns similar to smooth [marble](https://en.wikipedia.org/wiki/Marble "Marble") or other kinds of [stone](https://en.wikipedia.org/wiki/Stone "Stone").

In this context, the algorithm is a way to recreate that effect digitally: a simulation of ink swirling across a virtual surface.

## How It Works

To bring that idea into code, the script simulates the process of dropping colored ink onto a virtual surface and shaping it into marbled patterns. Each ink drop is represented by a set of vertices forming a circle. When new drops interact, they distort each other using a geometric transformation that mimics how fluids displace ink on water.

Dragging the mouse adds "tines", brush-like waves that pull and stretch the surface in a given direction. The deformation strength fades with distance, creating the rippled lines typical of marbled paper.

All the parameters (color palette, drop sizes, and deformation strength) can be tweaked through simple UI elements. It's a surprisingly compact sketch for how organic the results look.

## Final result

<iframe src="https://editor.p5js.org/KuluGary/full/cjTCcIybY" height="720px"></iframe>

## References

- [Coding Challenge 183: Paper Marbling Algorithm](https://www.youtube.com/watch?v=p7IGZTjC008) by [The Coding Train](https://www.youtube.com/@TheCodingTrain).
- [Digital Marbling](https://blog.amandaghassaei.com/2022/10/25/digital-marbling/) by [Amanda Ghassaei](https://amandaghassaei.com/).
- [Mathematical Marbling](https://people.csail.mit.edu/jaffer/Marbling/) by [Audrey Jaffer](https://people.csail.mit.edu/jaffer/).
