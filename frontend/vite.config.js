import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.VITE_SERVER_ADDRESS, // Use SERVER_ADDRESS from .env
    },
  },
})
