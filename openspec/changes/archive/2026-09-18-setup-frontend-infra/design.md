## Context

El backend ya cuenta con la infraestructura base de red y de base de datos preparadas (en las propuestas `setup-backend-infra` y `create-db-infra`). El frontend de AIFindOps necesitará un entorno robusto para poder consumir la API, visualizar grandes volúmenes de datos mediante tablas/gráficos y gestionar estados de filtros.

## Goals / Non-Goals

**Goals:**
- Configurar Vite con React 18+ y TypeScript (Template).
- Integrar TailwindCSS v4 sin configuración pesada de PostCSS antigua.
- Establecer las bases para Zustand (store global) y React Query (caché de red).
- Instalar `recharts` o equivalente para futuros dashboards.
- Integrar `react-router-dom` para la navegación.

**Non-Goals:**
- No se implementarán pantallas completas ni conexión real a la API en esta fase (solo el esqueleto y configuración de dependencias).
- No se implementará autenticación (eso corresponde al desarrollo de un feature completo).

## Decisions

### 1. Build Tool: Vite
- **Decisión:** Se utilizará Vite en lugar de Create React App o Next.js (ya que el requerimiento es un frontend de React + Vite).
- **Rationale:** Vite es el estándar actual para SPAs, ofreciendo un HMR instantáneo y build optimizado con Rollup.
- **Alternativa:** Next.js. Descartado ya que el PRD y la especificación técnica indican React + Vite, un modelo puro SPA.

### 2. Estilos: TailwindCSS v4
- **Decisión:** TailwindCSS v4.
- **Rationale:** La v4 elimina gran parte de la configuración basada en PostCSS tradicional para un modelo más "zero-config", aumentando el rendimiento de compilación. Las clases utilitarias agilizan el desarrollo de UI complejas como las de los Dashboards.

### 3. Manejo de Estado: Zustand + React Query
- **Decisión:** Zustand para estado local/global simple y React Query para estado asíncrono.
- **Rationale:** Redux Toolkit es demasiado verboso para los requisitos actuales. Zustand ofrece una API limpia y directa. React Query es indispensable para el manejo automático de caché, paginación e invalidación al consumir la API del backend.

## Risks / Trade-offs

- **[Risk] Complejidad del Enrutamiento SPA:** Si la app crece, un router cliente puro (React Router) podría volverse pesado para cargar en el bundle inicial.
  - **Mitigation:** Se implementará lazy-loading (`React.lazy`) a nivel de ruta desde el inicio.
