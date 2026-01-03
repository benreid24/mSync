import zod from 'zod';

export const PlaylistSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    tracks: zod.array(zod.string()),
});

export type Playlist = zod.infer<typeof PlaylistSchema>;
