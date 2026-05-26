import { SignIn } from '@clerk/clerk-react';

/**
 * `signUpUrl` apunta a la página informativa de registro deshabilitado.
 * Clerk de todas formas oculta el link a sign-up si está apagado desde el dashboard.
 */
export default function SignInPage() {
  return <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />;
}
