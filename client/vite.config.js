import { defineConfig } from 'vite'
import collegeReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [collegeReact()],
  server: { port: 5173 }
})