import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  server: {
    proxy: {
      // Proxy to HuggingFace IDM-VTON Gradio Space (avoids CORS)
      '/hf-tryon': {
        target: 'https://yisol-idm-vton.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-tryon/, ''),
        secure: true
      }
    }
  }
})
