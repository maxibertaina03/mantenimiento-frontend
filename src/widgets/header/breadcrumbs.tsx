import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  machines: 'Máquinas',
  maintenance: 'Mantenimientos',
  tools: 'Herramientas',
  materials: 'Materiales',
  providers: 'Proveedores',
  users: 'Usuarios',
  audit: 'Auditoría',
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = LABELS[segment] ?? segment;
        return (
          <span key={path} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={path} className="hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
