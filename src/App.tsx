import { AppProviders } from '@/app/providers/app-providers';
import { AppErrorBoundary } from '@/app/router/error-boundary';

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProviders />
    </AppErrorBoundary>
  );
}
