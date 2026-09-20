import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from /portfolio/, and answers unknown paths (like a refresh on
// /portfolio/projects) with 404.html. Copying index.html to 404.html lets the router take over.
function spaFallback() {
  let outDir
  return {
    name: 'spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

export default defineConfig(({ command }) => ({
  // Only the production build is served from the /portfolio/ sub-path; `npm run dev` stays at "/".
  base: command === 'build' ? '/portfolio/' : '/',
  plugins: [react(), tailwindcss(), spaFallback()],
}))
