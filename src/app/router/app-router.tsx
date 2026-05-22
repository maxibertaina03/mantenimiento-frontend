import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth } from './require-auth';
import { RequireRole } from './require-role';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';

import SignInPage from '@/pages/auth/sign-in.page';
import SignUpPage from '@/pages/auth/sign-up.page';
import DashboardPage from '@/pages/dashboard/dashboard.page';
import NotFoundPage from '@/pages/not-found.page';
import { PlaceholderPage } from '@/pages/placeholder.page';
import MachinesPage from '@/pages/machines/machines.page';
import MachineDetailPage from '@/pages/machines/machine-detail.page';
import MaintenancePage from '@/pages/maintenance/maintenance.page';

export function AppRouter() {
  return (
    <Routes>
      {/* Auth (público) */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Route>

      {/* Privado */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/machines/:id" element={<MachineDetailPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/tools" element={<PlaceholderPage title="Herramientas" />} />
          <Route path="/materials" element={<PlaceholderPage title="Materiales" />} />
          <Route path="/providers" element={<PlaceholderPage title="Proveedores" />} />

          <Route element={<RequireRole roles={['ADMIN', 'SUPERVISOR']} />}>
            <Route path="/users" element={<PlaceholderPage title="Usuarios" />} />
            <Route path="/audit" element={<PlaceholderPage title="Auditoría" />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
