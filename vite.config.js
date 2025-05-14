// vite.config.js
import { defineConfig } from 'vite'
import react       from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // whether to polyfill process,Buffer, etc.
      globals: { buffer: true, process: true },
      // enable protocol imports (e.g. `import fs from 'node:fs'`)
      protocolImports: true,
    })
  ],
  resolve: {
    alias: {
      // Sometimes you still want explicit alias for buffer
      buffer: 'buffer/'
    }
  },
  define: {
    // Make sure globalThis is honored
    global: 'globalThis'
  }
})
