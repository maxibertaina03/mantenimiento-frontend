import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

import { env } from '@/shared/config/env';
import { queryClient } from '@/shared/lib/query-client';
import { router } from '@/app/router/router';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { ClerkAuthBridge } from './clerk-auth-bridge';
import { ThemeProvider } from './theme-provider';

export function AppProviders() {
  return (
    <ClerkProvider
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl={env.VITE_CLERK_SIGN_IN_URL}
      signUpUrl={env.VITE_CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={env.VITE_CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={env.VITE_CLERK_AFTER_SIGN_UP_URL}
    >
      <ClerkAuthBridge>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider delayDuration={150}>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors closeButton />
              {env.VITE_APP_ENV !== 'production' ? <TanStackRouterDevtools router={router} /> : null}
              {env.VITE_APP_ENV !== 'production' ? (
                <ReactQueryDevtools initialIsOpen={false} />
              ) : null}
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkAuthBridge>
    </ClerkProvider>
  );
}
