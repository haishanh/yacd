import { QueryCache, QueryClient } from '@tanstack/react-query';

const queryCache = new QueryCache();
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});
