import React from 'react';
import { createRootRoute, createRoute } from '@tanstack/react-router';
import RootLayout from '@/layouts/root-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { RequireAuth } from './require-auth';
import { RequireRole } from './require-role';

import SignInPage from '@/pages/auth/sign-in.page';
import SignUpPage from '@/pages/auth/sign-up.page';
import DashboardPage from '@/pages/dashboard/dashboard.page';
import NotFoundPage from '@/pages/not-found.page';
import { PlaceholderPage } from '@/pages/placeholder.page';
import MachinesPage from '@/pages/machines/machines.page';
import MachineDetailPage from '@/pages/machines/machine-detail.page';
import MaintenancePage from '@/pages/maintenance/maintenance.page';
import MaterialsPage from '@/pages/materials/materials.page';
import ToolsPage from '@/pages/tools/tools.page';
import ProvidersPage from '@/pages/providers/providers.page';
import AuditPage from '@/pages/audit/audit.page';

const RootIndex = () => {
  const navigate = require('@tanstack/react-router').useNavigate();
  React.useEffect(() => {
    navigate({ to: '/dashboard' });
  }, [navigate]);
  return null;
};

// Root
const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

// Auth layout
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
  notFoundComponent: NotFoundPage,
});

// Auth routes - usamos splat para que Clerk maneje sus sub-rutas internas
// (sign-in/factor-one, sign-in/verify-email, etc.)
const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-in',
  component: SignInPage,
});

const signInSplatRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-in/$',
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up',
  component: SignUpPage,
});

const signUpSplatRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up/$',
  component: SignUpPage,
});

// Protected layout
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: RequireAuth,
});

// Dashboard layout
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: 'dashboard-layout',
  component: DashboardLayout,
  notFoundComponent: NotFoundPage,
});

// Dashboard routes
const rootIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  component: RootIndex,
});

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const machinesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/machines',
  component: MachinesPage,
});

const machineDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/machines/$id',
  component: MachineDetailPage,
});

const maintenanceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/maintenance',
  component: MaintenancePage,
});

const toolsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/tools',
  component: ToolsPage,
});

const materialsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/materials',
  component: MaterialsPage,
});

const providersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/providers',
  component: ProvidersPage,
});

// Admin routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  id: 'admin',
  component: () => <RequireRole roles={['ADMIN', 'SUPERVISOR']} />,
});

const usersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/users',
  component: () => <PlaceholderPage title="Usuarios" />,
});

const auditRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/audit',
  component: AuditPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([signInRoute, signInSplatRoute, signUpRoute, signUpSplatRoute]),
  protectedLayoutRoute.addChildren([
    dashboardLayoutRoute.addChildren([
      rootIndexRoute,
      dashboardRoute,
      machinesRoute,
      machineDetailRoute,
      maintenanceRoute,
      toolsRoute,
      materialsRoute,
      providersRoute,
      adminLayoutRoute.addChildren([usersRoute, auditRoute]),
    ]),
  ]),
]);

export { routeTree };
