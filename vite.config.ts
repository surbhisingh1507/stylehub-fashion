import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'stylehub-redirect-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            res.statusCode = 302
            res.setHeader('Location', '/stylehub/index.html')
            res.end()
            return
          }
          next()
        })
      }
    }
  ],
})
