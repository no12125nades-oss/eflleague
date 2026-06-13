import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let client: ReturnType<typeof postgres> | undefined;
let instance: ReturnType<typeof drizzle<typeof fullSchema>> | undefined;

export function getDb() {
  if (!client) {
    client = postgres(env.databaseUrl, {
      ssl: "require",
    });
  }

  if (!instance) {
    instance = drizzle(client, {
      schema: fullSchema,
    });
  }

  return instance;
}
