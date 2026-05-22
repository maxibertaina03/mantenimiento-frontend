import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-muted-foreground">La página que buscás no existe.</p>
      <Button asChild>
        <Link to="/dashboard">Volver al dashboard</Link>
      </Button>
    </div>
  );
}
