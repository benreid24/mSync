import { MikroORM } from "@mikro-orm/better-sqlite";
import config from "./config.js";

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
