import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { Skeleton } from '@/shared/ui/skeleton';

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLoading ? (
            <Skeleton className="h-7 w-64" />
          ) : (
            <>Hola, {user?.firstName ?? user?.email ?? 'usuario'}</>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del estado del sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Máquinas operativas" value="—" hint="Próximamente" />
        <KpiCard title="Mantenimientos pendientes" value="—" hint="Próximamente" />
        <KpiCard title="Herramientas prestadas" value="—" hint="Próximamente" />
        <KpiCard title="Stock bajo" value="—" hint="Próximamente" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            La fundación del sistema está lista. Los módulos funcionales (máquinas,
            mantenimientos, herramientas, materiales, proveedores) se construirán a continuación
            siguiendo el patrón DDD definido.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>Backend: NestJS · DDD · Clean Architecture · Prisma · PostgreSQL · Clerk</li>
            <li>Frontend: React 18 · Vite · Tailwind · Shadcn/UI · TanStack Query · Zustand</li>
            <li>Auditoría automática vía interceptor + AuditWriter</li>
            <li>Multi-tenant preparado, no activo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
