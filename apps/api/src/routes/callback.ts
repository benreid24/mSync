import express from "express";

import { Callback } from "@msync/entities/callback.js";
import { getRequestContext } from "@msync/plugins/db/index.js";
import { CallbackIdSchema, NewCallbackSchema } from "@msync/api-types";

export const router: express.Router = express.Router();

router.post("/", async (req, res) => {
  const db = getRequestContext();
  const { url, eventType } = NewCallbackSchema.parse(req.body);

  const callback: Callback = new Callback();
  callback.url = url;
  callback.eventType = eventType;

  db.persist(callback);
  await db.flush();

  res.status(200).json({ callback });
});

router.get("/list", async (req, res) => {
  const db = getRequestContext();
  const callbacks = await db.find(Callback, {});
  res.status(200).json({ callbacks });
});

router.delete("/:id", async (req, res) => {
  const db = getRequestContext();
  const { id } = CallbackIdSchema.parse(req.params);

  const callback = await db.findOne(Callback, { id });
  if (!callback) {
    return res.status(404).json({ message: "Callback not found" });
  }

  db.remove(callback);
  await db.flush();

  res.status(200).json({ message: "Callback deleted" });
});

router.put("/:id", async (req, res) => {
  const db = getRequestContext();
  const { id } = CallbackIdSchema.parse(req.params);
  const { url, eventType } = NewCallbackSchema.parse(req.body);

  const callback = await db.findOne(Callback, { id });
  if (!callback) {
    return res.status(404).json({ message: "Callback not found" });
  }

  callback.url = url;
  callback.eventType = eventType;
  await db.flush();

  res.status(200).json({ callback });
});
