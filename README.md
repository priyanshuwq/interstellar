# Interstellar — A Cinematic Web Experience

A visually immersive, space-themed website inspired by Christopher Nolan's *Interstellar*. Built as a frontend design showcase using Next.js, React, Tailwind CSS, and Three.js.

## What it is

A single-page cinematic experience that takes you through the key elements of the Interstellar universe:

- **Hero** — Typing animation that seamlessly transitions into the navigation bar
- **The Mission** — Tactical HUD-style mission objective cards alongside the 3D Endurance spacecraft
- **Gargantua** — A real-time, physically-accurate raymarched black hole with gravitational lensing, accretion disk, and Doppler shift
- **Time Dilation** — An interactive demonstration of relativity (hover to watch Earth years fly by)
- **Crew** — Character profiles with cinematic portrait reveals on hover
- **Soundtrack** — Hans Zimmer's theme plays in the background with a toggle in the navbar

## Tech

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Three.js** via React Three Fiber + Drei
- **GSAP** + ScrollTrigger for scroll-driven animations
- **Custom GLSL shader** for the black hole (600-step raymarching with relativistic physics)

## The Black Hole

The Gargantua visualization is not a video or image — it's a real-time fragment shader running in the browser. It simulates:

- Gravitational lensing of background starfields
- Relativistic accretion disk with temperature-based coloring
- Doppler shifting and relativistic beaming
- Lorentz transformation of light rays

The physics are based on the Schwarzschild metric, the same math used in the actual film's visual effects.

## Credits

- Film: *Interstellar* (2014) directed by Christopher Nolan
- Music: Hans Zimmer — Main Theme
- Endurance 3D Model: [Sketchfab](https://sketchfab.com)
- Black hole shader adapted from [sirxemic/threejs-blackhole](https://github.com/vlwkaos/threejs-blackhole)

---

Made by [Priyanshu](https://shekhr.dev)
