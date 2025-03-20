import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@design-system': '/src/@design-system',
      '@features': '/src/@features',
      '@shared': '/src/@shared',
    },
  },
})
