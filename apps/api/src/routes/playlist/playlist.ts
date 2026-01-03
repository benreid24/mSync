import express from "express";

import { Playlist as PlaylistEntity } from "@msync/entities/playlist.js";
import { getRequestContext } from "@msync/plugins/db/index.js";

import { GetPlaylistParamsSchema, CreatePlaylistBodySchema } from "./schema.js";

export const router: express.Router = express.Router();

router.get("/:id", async (req, res) => {
  const orm = getRequestContext();
  const { id } = GetPlaylistParamsSchema.parse(req.params);

  const playlist = await orm.findOne(PlaylistEntity, { id });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  res.status(200).json({ playlist });
});

router.post("/", async (req, res) => {
  const orm = getRequestContext();
  const { name, source, folder } = CreatePlaylistBodySchema.parse(req.body);

  const playlist = new PlaylistEntity();
  playlist.name = name;
  playlist.source = source;
  playlist.folder = folder;

  orm.persist(playlist);
  await orm.flush();

  res.status(201).json({ playlist });
});

router.delete("/:id", async (req, res) => {
  const orm = getRequestContext();
  const { id } = GetPlaylistParamsSchema.parse(req.params);

  const playlist = await orm.findOne(PlaylistEntity, { id });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  await orm.remove(playlist).flush();

  res.status(204).send();
});

router.put("/:id", async (req, res) => {
  const orm = getRequestContext();
  const { id } = GetPlaylistParamsSchema.parse(req.params);
  const { name, source, folder } = CreatePlaylistBodySchema.parse(req.body);

  const playlist = await orm.findOne(PlaylistEntity, { id });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  playlist.name = name;
  playlist.source = source;
  playlist.folder = folder;

  await orm.flush();

  res.status(200).json({ playlist });
});
