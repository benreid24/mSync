import { Options, BetterSqliteDriver } from "@mikro-orm/better-sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { isDev, DATA_PATH } from "@msync/env.js";

import { Playlist } from "@msync/entities/playlist.js";
import { Video } from "@msync/entities/video.js";
import { Callback } from "@msync/entities/callback.js";

const config: Options = {
  driver: BetterSqliteDriver,
  dbName: `${DATA_PATH}/sqlite.db`,
  entities: [Playlist, Video, Callback],
  metadataProvider: TsMorphMetadataProvider,
  debug: isDev,
  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
  ensureDatabase: true,
};

export default config;
