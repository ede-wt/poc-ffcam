import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { todos } from "./db/schema";
import { eq } from "drizzle-orm";

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

app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const { title, done } = await c.req.json();
  const todo = await db
    .update(todos)
    .set({ title, done })
    .where(eq(todos.id, +id))
    .returning();

  return c.json(todo, 200);
});

app.delete("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const todo = await db.delete(todos).where(eq(todos.id, +id)).returning();
  return c.json(todo, 200);
});

export default app;
