import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    url: process.env.DATABASE_URL!,
  },
});
