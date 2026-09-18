## Why

Con la base de datos y el backend planificados, necesitamos sentar las bases del Frontend de AIFindOps. El frontend es crítico ya que alojará el Dashboard Ejecutivo y las tablas de Drill-Down. Iniciar la aplicación con React y Vite garantiza un entorno de desarrollo rápido y moderno.

## What Changes

- Inicialización de un proyecto React con Vite (template TypeScript).
- Instalación de TailwindCSS v4 para el sistema de diseño.
- Configuración de Zustand para el manejo del estado global (auth, filtros) y React Query para la obtención de datos del backend.
- Instalación de Recharts para los gráficos del dashboard.
- Estructuración inicial de carpetas del frontend (`src/components`, `src/pages`, `src/hooks`).

## Capabilities

### New Capabilities
- `frontend-app`: Define la arquitectura base del cliente web, la estrategia de enrutamiento y el sistema de diseño visual (UI) para AIFindOps.

### Modified Capabilities
<!-- No requirement changes in existing capabilities for this task -->

## Impact

Este cambio crea el esqueleto del frontend. Afectará la estructura del repositorio agregando la carpeta `frontend`. Sienta las bases para que el equipo pueda empezar a construir componentes UI reutilizables y conectar con la API de Ingesta/Métricas.
