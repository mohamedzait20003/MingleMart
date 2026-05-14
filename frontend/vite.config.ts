import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    manifest: true,
    outDir: 'dist/client',
  },
  ssr: {
    // Keep these as external to use their native ESM exports
    external: ['react-router-dom', 'react-router', 'redux-persist'],
    noExternal: [
      '@react-oauth/google',
      'react-redux',
      '@reduxjs/toolkit',
      'react-toastify',
      'axios',
    ],
  },
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
  },
})
