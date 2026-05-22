# Mantenimiento2 · Web (React + Vite)

SPA del sistema de mantenimiento e inventario.

## Stack

- **React 18 + Vite 5 + TypeScript estricto**
- **Routing**: React Router DOM v6 (data router)
- **UI**: TailwindCSS + Shadcn/UI (Radix primitives)
- **Server state**: TanStack Query
- **UI state**: Zustand (slices por dominio)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios con interceptor de Clerk
- **Auth**: `@clerk/clerk-react`
- **Notifications**: Sonner (toasts)

## Arquitectura (inspirada en Feature-Sliced Design)

```
src/
├── app/                  # Composition root: providers, router, query client
├── pages/                # Page-level components (rutas)
├── widgets/              # Composiciones reutilizables (sidebar, header, breadcrumbs)
├── features/             # Casos de uso de UI por dominio (e.g. tools/loan-form)
├── entities/             # Modelos de dominio + UI cards/badges atómicas
├── shared/               # Reutilizable horizontal
│   ├── api/              # Cliente HTTP y endpoints tipados
│   ├── config/           # Constantes, env
│   ├── hooks/            # use-* genéricos
│   ├── lib/              # utils, axios, query-client, fetch wrapper
│   ├── store/            # Zustand stores transversales
│   ├── types/            # Tipos compartidos (espejo de los DTOs del backend)
│   └── ui/               # Componentes Shadcn (button, dialog, table, etc.)
├── layouts/              # DashboardLayout, AuthLayout
├── styles/               # Tailwind base + tokens
└── main.tsx
```

### Reglas de dependencia

```
app → pages → widgets → features → entities → shared
```

Una capa nunca importa hacia arriba. Por ejemplo, `entities/` jamás importa de `features/`.

## Comandos

```bash
pnpm install
pnpm dev           # Vite dev server (proxy /api → http://localhost:3000)
pnpm build         # tsc -b && vite build
pnpm typecheck
pnpm lint
pnpm test
```

## Autenticación

`<ClerkProvider>` envuelve la app. El cliente Axios añade automáticamente el JWT vía `getToken()` en cada request. Rutas protegidas se envuelven con `<RequireAuth>`; verificación de rol con `<RequireRole roles={['ADMIN']}>`.
