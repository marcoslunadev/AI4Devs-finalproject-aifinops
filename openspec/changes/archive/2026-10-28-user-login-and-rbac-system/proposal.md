## Why

La aplicación actualmente carece de una interfaz interactiva de inicio de sesión en el frontend, permitiendo el acceso directo a los paneles analíticos sin verificación de credenciales ni distinción visual de permisos entre roles. Es imprescindible implementar un sistema completo de autenticación y dar de alta las credenciales oficiales de acceso para los roles `ADMIN` y `FINOPS_VIEWER`.

## What Changes

- **Backend & Semillas de Datos**:
  - Incorporación en `backend/prisma/seed.ts` de los dos usuarios solicitados:
    - Usuario con rol `ADMIN`: username `admin` / email `admin@aifinops.com` con contraseña `Admin_M4rc0s` hasheada con bcrypt.
    - Usuario con rol `FINOPS_VIEWER`: username `viewer` / email `viewer@aifinops.com` con contraseña `Viewer_M4rc0s` hasheada con bcrypt.
  - Mejora en `AuthService` para permitir inicio de sesión indistintamente por email o nombre de usuario (`admin` / `viewer`).
- **Frontend (React 18 + TypeScript + TailwindCSS)**:
  - Nueva página de autenticación `LoginPage.tsx` con formulario responsivo, validaciones y diseño corporativo premium.
  - Store de autenticación `authStore.ts` (Zustand) con persistencia en `localStorage` del token JWT, rol y datos de usuario.
  - Componente guardián `ProtectedRoute.tsx` para restringir el acceso a usuarios no autenticados y redirigir automáticamente a `/login`.
  - Integración en `DashboardLayout` de selector de perfil, badge visual del rol (`ADMIN` / `FINOPS_VIEWER`) y botón de cierre de sesión (`Cerrar Sesión`).
  - Interceptor HTTP en Axios para inyectar la cabecera `Authorization: Bearer <token>` en todas las llamadas a la API y gestionar revocación o expiración (401).

## Capabilities

### New Capabilities
- `user-authentication`: Flujo completo de inicio de sesión de usuario en frontend, gestión del estado de sesión con JWT, protección de rutas y cierre de sesión.

### Modified Capabilities
- `backend-api`: Soporte para autenticación por identificador flexible (email o username) y alta de usuarios maestros `admin` y `viewer` en la base de datos.

## Impact

- **Backend**: `backend/src/modules/auth/services/AuthService.ts`, `backend/prisma/seed.ts`.
- **Frontend**: `frontend/src/App.tsx`, `frontend/src/pages/LoginPage.tsx`, `frontend/src/components/ProtectedRoute.tsx`, `frontend/src/store/authStore.ts`, `frontend/src/components/DashboardLayout.tsx`.
