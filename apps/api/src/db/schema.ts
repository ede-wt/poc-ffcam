import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const todos = table("todos", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  done: t.integer().default(0),
});
