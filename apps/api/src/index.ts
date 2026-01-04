import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ZodError } from "zod";

import { PORT, isDev } from "@msync/env.js";
import { setRoutes } from "./routes/index.js";
import { initPlugins } from "./plugins/init.js";
import { getSyncer } from "./sync/syncer.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize plugins
initPlugins();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up API routes FIRST (before frontend serving)
setRoutes(app);

// Serve React app
if (!isDev) {
  const buildPath = path.resolve(__dirname, "../../web/dist");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  const { createProxyMiddleware } = await import("http-proxy-middleware");
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:3001", // Vite dev server
      changeOrigin: true,
    })
  );
}

// Error handler - MUST be after routes
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: err.errors,
      });
    }
    next(err);
  }
);

// Run syncer every 10 minutes
const TEN_MINUTES = 10 * 60 * 1000;
setInterval(() => {
  const syncer = getSyncer();
  console.log("Background sync triggered");
  syncer.startSync();
}, TEN_MINUTES);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
