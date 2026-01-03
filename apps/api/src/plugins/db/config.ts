import { Options, BetterSqliteDriver } from "@mikro-orm/better-sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { isDev, DB_FILE } from "@msync/env.js";
import { Playlist } from "../../entities/playlist.js";

const config: Options = {
  driver: BetterSqliteDriver,
  dbName: DB_FILE,
  entities: [Playlist],
  metadataProvider: TsMorphMetadataProvider,
  debug: isDev,
  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
  ensureDatabase: true,
};

export default config;
