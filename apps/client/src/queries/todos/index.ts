/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import React from "react";

export const todosKeys = {
  all: () => ["todos"],
  update: () => [...todosKeys.all(), "update"],
  delete: () => [...todosKeys.all(), "delete"],
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");

  const todosQuery = useQuery({
    queryKey: todosKeys.all(),
    queryFn: api.fetchTodos,
  });

  const addTodo = useMutation({
    mutationKey: todosKeys.all(),
    onMutate: async ({ title }: any) => {
      await queryClient.cancelQueries({ queryKey: todosKeys.all() });
      const previousTodos =
        queryClient.getQueryData<any[]>(todosKeys.all()) || [];

      setTitle("");

      queryClient.setQueryData(todosKeys.all(), [
        ...previousTodos,
        { id: new Date(), title: title, done: 0 },
      ]);

      return { previousTodos };
    },
    onError: (_err, _todo, context) => {
      queryClient.setQueryData(todosKeys.all(), context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all() });
    },
  });

  return {
    todosQuery,
    title,
    setTitle,
    addTodo,
  };
};

export const useTodo = () => {
  const queryClient = useQueryClient();

  const deleteTodo = useMutation({
    mutationKey: todosKeys.delete(),
    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({ queryKey: todosKeys.all() });
      const previousTodos =
        queryClient.getQueryData<any[]>(todosKeys.all()) || [];

      queryClient.setQueryData(
        todosKeys.all(),
        previousTodos.filter((todo) => todo.id !== id)
      );

      return { previousTodos };
    },
    onError: (_err, _todo, context) => {
      queryClient.setQueryData(todosKeys.all(), context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all() });
    },
  });

  const updateTodo = useMutation({
    mutationKey: todosKeys.update(),
    onMutate: async ({ id, done }: { id: string; done: boolean }) => {
      await queryClient.cancelQueries({ queryKey: todosKeys.all() });
      const previousTodos =
        queryClient.getQueryData<any[]>(todosKeys.all()) || [];

      queryClient.setQueryData(
        todosKeys.all(),
        previousTodos.map((todo) => (todo.id === id ? { ...todo, done } : todo))
      );

      return { previousTodos };
    },
    onError: (_err, _todo, context) => {
      queryClient.setQueryData(todosKeys.all(), context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all() });
    },
  });

  return {
    deleteTodo,
    updateTodo,
  };
};
