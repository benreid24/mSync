import express from "express";

import { getSyncer } from "@msync/sync/syncer.js";

export const router: express.Router = express.Router();

router.post("/start", async (req, res) => {
  const syncer = getSyncer();
  const started = syncer.startSync();
  res
    .status(200)
    .json({
      started,
      message: started ? "Sync started" : "Sync already in progress",
    });
});

router.get("/state", async (req, res) => {
  const syncer = getSyncer();
  const state = syncer.getState();
  res.status(200).json({ state });
});
