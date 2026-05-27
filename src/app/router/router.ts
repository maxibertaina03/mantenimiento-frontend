import { Router, RootRoute } from '@tanstack/react-router';
import { routeTree } from './routes';

export const router = new Router({ routeTree });

// Register router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
