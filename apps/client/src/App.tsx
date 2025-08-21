/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import {
  MutationCache,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import { todosKeys, useTodos } from "./queries/todos";
import * as api from "./queries/todos/api";
import toast, { Toaster } from "react-hot-toast";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

onlineManager.setOnline(navigator.onLine);

window.addEventListener("offline", () => {
  onlineManager.setOnline(false);
});

window.addEventListener("online", () => {
  onlineManager.setOnline(true);
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: Infinity,
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data: any) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  }),
});

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

queryClient.setMutationDefaults(todosKeys.all(), {
  mutationFn: async (todo: any) => {
    await queryClient.cancelQueries({ queryKey: todosKeys.all() });
    return await api.createTodo(todo);
  },
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <Todos />
      <ReactQueryDevtools initialIsOpen={false} />
      {import.meta.env.PROD && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
      <Toaster />
    </PersistQueryClientProvider>
  );
}

function Todos() {
  const { todosQuery, addTodo, title, setTitle } = useTodos();

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo.mutate({
      title,
    });
  };

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todosQuery.data?.map((todo: any) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <form onSubmit={handleOnSubmit}>
        <label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button type="submit">Add Todo</button>
        <div>
          Updated at: {new Date(todosQuery.dataUpdatedAt).toLocaleTimeString()}
        </div>
        <div>{todosQuery.isFetching && "fetching..."}</div>
        <div>
          {addTodo.isPaused
            ? "mutation paused - offline"
            : addTodo.isPending && "updating..."}
        </div>
      </form>
    </div>
  );
}

export default App;
