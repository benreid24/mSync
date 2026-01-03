import express from "express";
import path from "path";
import { ZodError } from "zod";

import { PORT, isDev } from "@msync/env.js";
import { setRoutes } from "./routes/index.js";
import { initPlugins } from "./plugins/init.js";

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
