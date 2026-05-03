import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/stats.html',
            gzipSize: true,
            open: false,
          }),
        ]
      : []),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide'
        },
      },
    },
  },
}))
