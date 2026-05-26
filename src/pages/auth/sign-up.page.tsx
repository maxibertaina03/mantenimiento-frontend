import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

/**
 * Registro público deshabilitado: este es un sistema interno y los usuarios
 * sólo los crea el administrador. El sign-up de Clerk también está apagado
 * desde el dashboard de Clerk → User & Authentication → Restrictions.
 */
export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardTitle>Registro deshabilitado</CardTitle>
        <CardDescription>
          Los usuarios se crean únicamente por un administrador del sistema.
          Si necesitás acceso, contactá al responsable.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild>
          <Link to="/sign-in">Volver al login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
