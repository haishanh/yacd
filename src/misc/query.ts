import { QueryCache, QueryClient } from 'react-query';

const queryCache = new QueryCache();
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});
