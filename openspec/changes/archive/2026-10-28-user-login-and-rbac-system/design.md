## Context

Véase `proposal.md` y `specs/`. Aunque el backend cuenta con endpoints de autenticación, el frontend de AIFinOps carece de interfaz de inicio de sesión, store de gestión de estado de autenticación y protección de rutas. Este diseño define la arquitectura de autenticación en el cliente SPA y la integración de credenciales maestras para los roles `ADMIN` y `FINOPS_VIEWER`.

## Goals / Non-Goals

**Goals:**
- Crear la página `LoginPage.tsx` en el frontend con estética moderna, validación de campos, visualización de errores y feedback de carga.
- Implementar `authStore.ts` con Zustand para persistir en `localStorage` el token JWT y el perfil de usuario.
- Crear el componente `ProtectedRoute.tsx` que salvaguarde las rutas privadas del dashboard (`/`, `/analytics/models`, etc.).
- Modificar `DashboardLayout.tsx` para mostrar la información del usuario autenticado, su badge de rol (`ADMIN` / `FINOPS_VIEWER`) y el botón interactivo de "Cerrar Sesión".
- Configurar interceptores en Axios para inyectar automáticamente la cabecera `Authorization: Bearer <token>` y redirigir a `/login` si el token expira (401).
- Actualizar `seed.ts` y `AuthService.ts` en el backend para dar de alta y admitir credenciales maestras:
  - Usuario: `admin` o `admin@aifinops.com` / Contraseña: `Admin_M4rc0s` (Rol: `ADMIN`).
  - Usuario: `viewer` o `viewer@aifinops.com` / Contraseña: `Viewer_M4rc0s` (Rol: `FINOPS_VIEWER`).

**Non-Goals:**
- Registro abierto/público de usuarios (autoservicio) — reservado a administración corporativa en v2.
- Flujo de recuperación de contraseña vía correo SMTP — pospuesto para v2.

## Decisions

### 1. Store de Sesión con Zustand y Persistencia en `localStorage`
- **Decisión**: Utilizar Zustand con el middleware `persist` para sincronizar automáticamente el estado de sesión (`token`, `user`, `isAuthenticated`) con `localStorage`.
- **Alternativas consideradas**:
  - *Context API nativo de React*: Requiere boilerplate adicional y sincronización manual con `window.localStorage`.
  - *Cookies HTTP-only*: Introduce complejidad de configuración CORS y credenciales cross-origin entre puertos Vite (5173) y Express (3000) en entorno de desarrollo.
- **Razón**: Zustand es ligero, reactivo y ya forma parte del stack tecnológico aprobado en `AGENTS.md`.

### 2. Interceptor HTTP Centralizado (Axios)
- **Decisión**: Configurar interceptores de petición y respuesta en el cliente Axios global.
  - Petición: Inyecta `Authorization: Bearer ${token}` si existe en el store.
  - Respuesta: En caso de recibir `401 Unauthorized`, invoca `authStore.getState().logout()` y redirige al usuario a `/login`.
- **Razón**: Desacopla la lógica de seguridad de cada componente individual de la UI.

### 3. Resolución Flexible de Identificador en Login
- **Decisión**: `AuthService.login` aceptará tanto `admin` como `admin@aifinops.com`, así como `viewer` o `viewer@aifinops.com`.
- **Razón**: Permite a los evaluadores y usuarios ingresar con el nombre de usuario corto solicitado (`admin` / `viewer`) sin forzar la sintaxis de correo.

## Risks / Trade-offs

- **[Riesgo: Expiración de token JWT en segundo plano]** → *Mitigación*: El interceptor de Axios captura inmediatamente cualquier código 401 de la API, limpia el almacenamiento local y fuerza la redirección a `/login`.
- **[Riesgo: Parpadeo visual durante la comprobación de autenticación]** → *Mitigación*: `ProtectedRoute` lee el estado inicial sincrónicamente desde `localStorage` antes del primer renderizado de las vistas protegidas.
