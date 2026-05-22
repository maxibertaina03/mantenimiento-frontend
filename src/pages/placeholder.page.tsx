import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface PlaceholderProps {
  title: string;
  description?: string;
}

/**
 * Placeholder reutilizable para módulos no implementados aún.
 * Se reemplazará por la página real cuando cada bounded context se construya.
 */
export function PlaceholderPage({ title, description }: PlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description ?? 'Módulo en construcción. Forma parte de la Fase 2.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Esta página será reemplazada por la implementación real del módulo siguiendo el patrón
        DDD (domain → application → infrastructure → presentation).
      </CardContent>
    </Card>
  );
}
