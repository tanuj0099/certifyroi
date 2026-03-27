import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Apply the same CSP as vercel.json so `npm run dev` behaves like production.
    // Vite's HMR uses eval() for source-maps — 'unsafe-eval' permits it.
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://*.firebaseapp.com https://*.firebase.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://api.groq.com https://www.google-analytics.com https://*.googleapis.com https://*.firebase.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
        "frame-src https://*.firebaseapp.com",
        "object-src 'none'",
        "base-uri 'self'",
      ].join('; '),
    },
  },
})