import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or other framework plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Configure your API proxies here if needed
      // '/api': 'http://localhost:5000'
    },
    // Add your ngrok domain to the allowed hosts
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'f679-66-41-39-3.ngrok-free.app',
      // You can use wildcards to allow all ngrok subdomains
      // '*.ngrok-free.app'
    ]
  }
})