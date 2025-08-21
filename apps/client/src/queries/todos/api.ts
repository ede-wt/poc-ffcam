/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchTodos = async () => {
  const res = await fetch(import.meta.env.VITE_PUBLIC_API_URL + "/todos");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return await res.json();
};

export const createTodo = async (todo: any) => {
  const res = await fetch(import.meta.env.VITE_PUBLIC_API_URL + "/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return await res.json();
};
