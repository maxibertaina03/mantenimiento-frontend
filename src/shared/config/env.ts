import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Falta VITE_CLERK_PUBLISHABLE_KEY'),
  VITE_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  VITE_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  VITE_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  VITE_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard'),
  VITE_APP_NAME: z.string().default('Mantenimiento2'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const message = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Variables de entorno inválidas:\n${message}`);
}

export const env = parsed.data;
