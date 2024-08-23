import { QueryClient } from "@tanstack/react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      suspense: false,
      retry: 1,
      retryDelay: 1500,
    },
  },
});

export const QueryKey = {
  LINKED_TASKS: "linked_tasks",
  TASKS: "tasks",
};
