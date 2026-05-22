import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded bg-primary" />
        <h1 className="text-xl font-semibold">Mantenimiento2</h1>
      </div>
      <Outlet />
    </div>
  );
}
