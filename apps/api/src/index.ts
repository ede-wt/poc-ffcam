import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { todos } from "./db/schema";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:4173", "http://localhost:5173"],
  })
);

app.get("/todos", async (c) => {
  const todos = await db.query.todos.findMany();
  return c.json(todos);
});

app.post("/todos", async (c) => {
  const todo = await db
    .insert(todos)
    .values(await c.req.json())
    .returning();

  return c.json(todo, 201);
});

export default app;
