import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ComponentWithChildren } from '../types';

const queryClient = new QueryClient();

export function AppQueryClientProvider({ children }: ComponentWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
