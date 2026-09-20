# Portfolio

My personal portfolio site, built with Vite, React, Tailwind CSS and Motion.

Live site: https://a-huss20.github.io/portfolio/

## What is in it

- A landing screen with an interactive star field that follows the mouse, a horizon glow and hill silhouette, then a smooth scroll down into About.
- A Skills section with a draggable 3D word globe that can be filtered by category.
- Separate Projects, About and Work pages with animated page transitions.
- Scroll-reveal animations on every section, and hover and click animations on every button.
- A burgundy colour palette defined once as Tailwind theme tokens in `src/index.css`.

## Built with

- [Vite](https://vite.dev/) and [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion](https://motion.dev/) (`motion/react`) for animation
- [React Router](https://reactrouter.com/) for the pages
- Fonts from Google Fonts: Barlow, Epilogue and Instrument Serif

## Run it locally

You need [Node.js](https://nodejs.org/) (the LTS version).

```
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:5173.

To make a production build and preview it:

```
npm run build
npm run preview
```

## Changing the content

Nearly all the words and links live in one file, `src/data/site.js`: the hero, projects, about text, skills and work history. The colours are in `src/index.css`.

## Project layout

```
src/
  components/   Navbar, Hero, StarField, SkillsCloud, Button, Reveal, ...
  pages/        Home, Projects, About, Work, NotFound
  data/site.js  All of the site's content
  lib/          Small hooks
```

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.
