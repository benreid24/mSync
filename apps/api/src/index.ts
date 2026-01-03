import express from 'express';
import path from 'path';

import {setRoutes} from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve React app
if (!isDev) {
  const buildPath = path.resolve(__dirname, '../../web/dist');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  const {createProxyMiddleware} = await import('http-proxy-middleware');
  app.use(
      '/',
      createProxyMiddleware({
        target: 'http://localhost:3001',  // Vite dev server
        changeOrigin: true,
      }));
}

// Set up routes
setRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});