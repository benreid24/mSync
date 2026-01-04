import zod from "zod";

const BaseSyncStateSchema = zod.object({
  errors: zod.array(zod.string()),
});

const InProgressStateSchema = BaseSyncStateSchema.extend({
  state: zod.literal("syncing"),
  playlistsCompleted: zod.number().min(0),
  totalPlaylists: zod.number().min(0),
  totalVideos: zod.number().min(0),
  videosDownloaded: zod.number().min(0),
  videosCopied: zod.number().min(0),
  videosCompleted: zod.number().min(0),
});

const IdleStateSchema = BaseSyncStateSchema.extend({
  state: zod.literal("idle"),
});

export const SyncStateSchema = zod.union([
  InProgressStateSchema,
  IdleStateSchema,
]);

export type SyncState = zod.infer<typeof SyncStateSchema>;
export type InProgressState = zod.infer<typeof InProgressStateSchema>;
export type IdleState = zod.infer<typeof IdleStateSchema>;
