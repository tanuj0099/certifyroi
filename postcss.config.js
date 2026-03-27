// ─────────────────────────────────────────────────────────
// THIS FILE IS REQUIRED for @tailwind directives in index.css.
// Without it, Vite doesn't know to run Tailwind's PostCSS plugin,
// so @tailwind base/components/utilities are emitted as invalid CSS.
// ─────────────────────────────────────────────────────────
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}