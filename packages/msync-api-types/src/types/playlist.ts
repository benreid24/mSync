import zod from 'zod';

export const GetPlaylistParamsSchema = zod.object({
  id: zod.coerce.number(),
});

export const NewPlaylistSchema = zod.object({
  name: zod.string().min(1),
  source: zod.string().min(1),
  folder: zod.string().min(1),
});

export type NewPlaylist = zod.infer<typeof NewPlaylistSchema>;

export const PlaylistSchema = NewPlaylistSchema.extend({
  id: zod.coerce.number(),
  lastChecked: zod.date().nullable(),
  lastFetched: zod.date().nullable(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export type Playlist = zod.infer<typeof PlaylistSchema>;
