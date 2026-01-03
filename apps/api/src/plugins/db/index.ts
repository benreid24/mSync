import { MikroORM } from "@mikro-orm/better-sqlite";
import config from "./config.js";
import { mkdir } from "fs";
import { DATA_PATH } from "@msync/env.js";

mkdir(DATA_PATH, { recursive: true }, (err) => {
  if (err) {
    console.error("Error creating database directory:", err);
  }
});

const orm = MikroORM.initSync(config);

// Create schema if it doesn't exist
const generator = orm.schema;
await generator.updateSchema();

export function getORM() {
  return orm;
}

export function getRequestContext() {
  return orm.em.fork();
}

export type DB = ReturnType<typeof getRequestContext>;
