import express from "express";

import { router as playlistRouter } from "./playlist.js";
import { router as syncRouter } from "./sync.js";
import { router as callbackRouter } from "./callback.js";

export function setRoutes(app: express.Express) {
  app.get("/api/health", (req, res) => {
    res.status(200).send("OK");
  });

  app.use("/api/playlist", playlistRouter);
  app.use("/api/sync", syncRouter);
  app.use("/api/callback", callbackRouter);
}
