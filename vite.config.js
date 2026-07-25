import { defineConfig } from 'vite';

// Relative base so the built site works from any GitHub Pages sub-path.
export default defineConfig({
  base: './',
  // An unrelated postcss.config.js in the user's home directory would otherwise
  // be picked up by PostCSS's upward config search and break the CSS pipeline.
  css: { postcss: { plugins: [] } },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
  server: { host: true, port: 5183 },
});
