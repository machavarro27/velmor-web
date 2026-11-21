import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 800,
    },
  },
  resolve: {
    preserveSymlinks: command === 'build',
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
