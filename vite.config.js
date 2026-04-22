import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple Vite plugin to mock Vercel serverless functions locally
const vercelApiMockPlugin = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/generate' && req.method === 'POST') {
        // Read body
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            req.body = JSON.parse(body);
            // Load the API handler dynamically
            const { default: handler } = await server.ssrLoadModule('/api/generate.js');
            
            // Mock Vercel's res.status().json()
            const mockRes = {
              status(code) {
                res.statusCode = code;
                return mockRes;
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              }
            };
            
            await handler(req, mockRes);
          } catch (error) {
            console.error('API Mock Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMockPlugin()],
})
