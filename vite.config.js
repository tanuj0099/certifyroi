import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ─────────────────────────────────────────────────────────
// NUCLEAR RULE: NO CSP headers in dev.
// CSP is a PRODUCTION concern — handled entirely by vercel.json.
// Setting it here was the root cause of the `eval` block.
// Vite's HMR, esbuild, and React Fast Refresh all need eval() in dev.
// ─────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [react()],
})