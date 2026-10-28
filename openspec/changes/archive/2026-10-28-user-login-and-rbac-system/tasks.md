## 1. Backend: Usuarios Maestros y Resolución Flexible de Login

- [x] 1.1 Actualizar `backend/prisma/seed.ts` para dar de alta a los usuarios maestros: `admin` (email `admin@aifinops.com`, password `Admin_M4rc0s`, rol `ADMIN`) y `viewer` (email `viewer@aifinops.com`, password `Viewer_M4rc0s`, rol `FINOPS_VIEWER`).
- [x] 1.2 Ejecutar `npx prisma db seed` para registrar las credenciales en la base de datos PostgreSQL local.
- [x] 1.3 Modificar `AuthService.ts` para admitir autenticación flexible por username corto (`admin`, `viewer`) o por email completo.
- [x] 1.4 Agregar test de integración en Vitest validando el login tanto con `admin` / `Admin_M4rc0s` como con `viewer` / `Viewer_M4rc0s`.

## 2. Frontend: Estado de Autenticación y Cliente HTTP

- [x] 2.1 Implementar `frontend/src/store/authStore.ts` con Zustand y middleware `persist` para gestionar token, usuario, login y logout.
- [x] 2.2 Configurar el cliente HTTP centralizado en `frontend/src/services/api.ts` con interceptores para inyectar `Authorization: Bearer <token>` y gestionar expiración (401).

## 3. Frontend: Vistas y Componentes de Acceso

- [x] 3.1 Crear la página de inicio de sesión `frontend/src/pages/LoginPage.tsx` con formulario validado, selector de acceso rápido y diseño corporativo premium.
- [x] 3.2 Implementar el componente guardián `frontend/src/components/ProtectedRoute.tsx` para salvaguardar las rutas privadas.
- [x] 3.3 Actualizar `frontend/src/App.tsx` incorporando la ruta pública `/login` y envolviendo el dashboard bajo `ProtectedRoute`.
- [x] 3.4 Actualizar `frontend/src/components/DashboardLayout.tsx` para mostrar badge con el rol activo (`ADMIN` / `FINOPS_VIEWER`), nombre del usuario y botón de cierre de sesión.

## 4. Validación y Verificación End-to-End

- [x] 4.1 Ejecutar suite de pruebas de backend con Vitest asegurando 100% de tests en verde.
- [x] 4.2 Validar la compilación del frontend (`npm run build` o comprobación de TypeScript).
