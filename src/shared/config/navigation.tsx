import {
  LayoutDashboard,
  Wrench,
  Boxes,
  Cog,
  Hammer,
  Truck,
  Users,
  History,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/shared/types/iam';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: 'General',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Operación',
    items: [
      { label: 'Máquinas', to: '/machines', icon: Cog },
      { label: 'Mantenimientos', to: '/maintenance', icon: Hammer },
      { label: 'Herramientas', to: '/tools', icon: Wrench },
      { label: 'Materiales', to: '/materials', icon: Boxes },
    ],
  },
  {
    label: 'Catálogos',
    items: [{ label: 'Proveedores', to: '/providers', icon: Truck }],
  },
  {
    label: 'Administración',
    items: [
      {
        label: 'Usuarios',
        to: '/users',
        icon: Users,
        roles: ['ADMIN', 'SUPERVISOR'],
      },
      {
        label: 'Auditoría',
        to: '/audit',
        icon: History,
        roles: ['ADMIN', 'SUPERVISOR'],
      },
    ],
  },
];
