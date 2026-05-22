import { Component, type ReactNode } from 'react';
import { Button } from '@/shared/ui/button';

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary]', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">Algo salió mal</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {this.state.error.message ?? 'Error inesperado'}
        </p>
        <Button onClick={() => window.location.assign('/dashboard')}>Volver al inicio</Button>
      </div>
    );
  }
}
