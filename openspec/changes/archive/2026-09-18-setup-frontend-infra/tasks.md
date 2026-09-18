## 1. Configuración de Vite y React

- [x] 1.1 Crear un nuevo proyecto React con Vite (template TypeScript) en el subdirectorio `frontend`.
- [x] 1.2 Limpiar la plantilla inicial (eliminar logos de Vite, CSS por defecto y estilos no utilizados de `App.css`/`index.css`).
- [x] 1.3 Configurar `tsconfig.json` para aliases de rutas (ej. `@/*` apuntando a `src/*`).

## 2. Instalación de TailWind CSS v4

- [x] 2.1 Instalar TailwindCSS v4 y su plugin para Vite (`@tailwindcss/vite`).
- [x] 2.2 Configurar el plugin de Tailwind en `vite.config.ts`.
- [x] 2.3 Añadir la importación `@import "tailwindcss";` en el archivo CSS global (`src/index.css`).
- [x] 2.4 Probar que las clases utilitarias de Tailwind renderizan correctamente.

## 3. Dependencias Core de Estado y UI

- [x] 3.1 Instalar dependencias para estado: `zustand`, `@tanstack/react-query`.
- [x] 3.2 Instalar dependencias para UI/Navegación: `react-router-dom`, `lucide-react`, `recharts`, `clsx`, `tailwind-merge`.
- [x] 3.3 Configurar un `QueryClient` global y el `<QueryClientProvider>` en `main.tsx`.

## 4. Estructura de Carpetas

- [x] 4.1 Crear estructura de directorios en `src/`: `components/ui`, `pages`, `store`, `hooks`, `lib`, `services`.
- [x] 4.2 Crear un router base en `App.tsx` usando `react-router-dom` con una ruta inicial `/`.
