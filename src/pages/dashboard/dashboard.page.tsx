import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  CheckCircle2,
  HandCoins,
  Hammer,
  Settings2,
  Wrench,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';

import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard';

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {userLoading ? (
            <Skeleton className="h-7 w-64" />
          ) : (
            <>Hola, {user?.firstName ?? user?.username ?? user?.email ?? 'usuario'}</>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">Resumen general del estado del sistema.</p>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Máquinas operativas"
          icon={Settings2}
          value={stats?.machines.operational}
          total={stats?.machines.total}
          loading={statsLoading}
          onClick={() => navigate('/machines')}
        />
        <KpiCard
          title="Mantenimientos pendientes"
          icon={CalendarClock}
          value={stats?.maintenance.pending}
          loading={statsLoading}
          tone={stats && stats.maintenance.pending > 0 ? 'warning' : 'default'}
          onClick={() => navigate('/maintenance')}
        />
        <KpiCard
          title="Herramientas prestadas"
          icon={HandCoins}
          value={stats?.tools.onLoan}
          total={stats?.tools.total}
          loading={statsLoading}
          onClick={() => navigate('/tools')}
        />
        <KpiCard
          title="Materiales con stock bajo"
          icon={Boxes}
          value={stats?.materials.lowStock}
          loading={statsLoading}
          tone={stats && stats.materials.lowStock > 0 ? 'destructive' : 'default'}
          onClick={() => navigate('/materials')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4" /> Estado de máquinas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row
              label="Operativas"
              value={stats?.machines.operational ?? '—'}
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              loading={statsLoading}
            />
            <Row
              label="En mantenimiento"
              value={stats?.machines.inMaintenance ?? '—'}
              icon={<Wrench className="h-4 w-4 text-amber-600" />}
              loading={statsLoading}
            />
            <Row
              label="Fuera de servicio"
              value={stats?.machines.outOfService ?? '—'}
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              loading={statsLoading}
            />
            {!!stats?.machines.preventiveDue && (
              <Row
                label="Preventivos vencidos"
                value={stats.machines.preventiveDue}
                icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
                tone="destructive"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hammer className="h-4 w-4" /> Herramientas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Disponibles" value={stats?.tools.available ?? '—'} loading={statsLoading} />
            <Row label="Prestadas" value={stats?.tools.onLoan ?? '—'} loading={statsLoading} />
            <Row label="En reparación" value={stats?.tools.inRepair ?? '—'} loading={statsLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Programados" value={stats?.maintenance.scheduled ?? '—'} loading={statsLoading} />
            <Row label="En curso" value={stats?.maintenance.inProgress ?? '—'} loading={statsLoading} />
            <Row
              label="Cerrados (30 días)"
              value={stats?.maintenance.completedLast30d ?? '—'}
              loading={statsLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto mt-2 flex"
              onClick={() => navigate('/maintenance')}
            >
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number | undefined;
  total?: number;
  loading?: boolean;
  tone?: 'default' | 'warning' | 'destructive';
  onClick?: () => void;
}

function KpiCard({ title, icon: Icon, value, total, loading, tone = 'default', onClick }: KpiCardProps) {
  const toneClass =
    tone === 'destructive'
      ? 'text-destructive'
      : tone === 'warning'
        ? 'text-amber-600'
        : 'text-foreground';
  return (
    <Card
      className={onClick ? 'cursor-pointer transition-colors hover:bg-muted/50' : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className={`text-3xl ${toneClass}`}>
          {loading ? <Skeleton className="h-8 w-16" /> : (value ?? '—')}
        </CardTitle>
      </CardHeader>
      {total !== undefined && (
        <CardContent>
          <p className="text-xs text-muted-foreground">de {total} totales</p>
        </CardContent>
      )}
    </Card>
  );
}

function Row({
  label,
  value,
  icon,
  loading,
  tone,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  loading?: boolean;
  tone?: 'destructive';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={`font-medium tabular-nums ${tone === 'destructive' ? 'text-destructive' : ''}`}>
        {loading ? <Skeleton className="h-4 w-8" /> : value}
      </span>
    </div>
  );
}
