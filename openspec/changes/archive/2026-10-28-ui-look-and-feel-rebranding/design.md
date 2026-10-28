## Context

El frontend de AIFinOps está construido con React 18, Vite y TailwindCSS v4 (`@tailwindcss/vite`). La interfaz utilizaba previamente esquemas de color por defecto en tonos índigo/púrpura y fondos oscuros genéricos basados en `slate-900`. Para dotar a la plataforma de una estética de observabilidad técnica y financiera de alto impacto, se ha rediseñado la identidad visual estableciendo tokens semánticos claros para modo claro y modo oscuro.

## Goals / Non-Goals

**Goals:**
- Establecer una paleta de color estructurada y moderna: base oscura Obsidian (`#080b11`), tarjetas en `#0f1420`, acentos en Cian (`#06b6d4`) y Esmeralda (`#10b981`), y base clara Slate 50 (`#f8fafc`) con tarjetas en blanco puro (`#ffffff`).
- Incorporar una jerarquía tipográfica triple cargada vía Google Fonts (`Outfit` para títulos, `Inter` para cuerpo y `JetBrains Mono` para datos numéricos y códigos).
- Actualizar componentes clave: Header, NavigationTabs, GlobalFilterBar, KpiCard, CostChart, DrillDownTable, ExecutionLogsView, ModelAnalytics, AgentDetailView, NotificationDrawer y Skeletons.
- Mantener intacta la lógica de negocio, hooks de telemetría, internacionalización (`react-i18next`), control de roles (RBAC) y contratos de API.
- Adaptar el favicon SVG y el emblema tecnológico CPU a la nueva paleta de colores.

**Non-Goals:**
- Modificar el backend, endpoints REST, esquemas de Prisma o lógica de cálculo de costes.
- Alterar la estructura de rutas o añadir nuevas dependencias pesadas de estilos (se utiliza estrictamente Tailwind v4 y utilidades existentes).

## Decisions

### 1. Definición de Tokens en Tailwind v4 vía `@theme` y variables CSS
- **Decisión**: Centralizar los tokens de color en `src/index.css` utilizando el bloque `@theme` de Tailwind v4 y selectores `:root` / `html.dark`.
- **Valores**:
  - `--color-brand-obsidian`: `#080b11`
  - `--color-brand-card`: `#0f1420`
  - `--color-brand-elevated`: `#171e2e`
  - `--color-brand-cyan`: `#06b6d4`
  - `--color-brand-emerald`: `#10b981`
- **Alternativa descartada**: `tailwind.config.js` clásico de v3 (Tailwind v4 gestiona temas directamente en el archivo CSS de entrada).

### 2. Tipografía Multifuente con Carga Preconectada
- **Decisión**: Añadir `preconnect` a `fonts.googleapis.com` en `index.html` cargando `Outfit`, `Inter` y `JetBrains Mono`. Mapear las clases `font-heading`, `font-sans` y `font-mono`.
- **Alternativa descartada**: Fuentes locales empaquetadas (mayor tamaño inicial de bundle, Google Fonts optimiza subsets en CDN con caché eficiente).

### 3. Preservación del Emblema Tecnológico CPU
- **Decisión**: Mantener el logotipo de AIFinOps basado en el icono `Cpu` de `lucide-react` alojado en un contenedor squircle con gradiente dinámico cian-esmeralda y fondo `#080b11`/`#0f1420`, garantizando identidad propia del producto.

### 4. Adaptación del Favicon SVG Corporativo
- **Decisión**: Sustituir en `public/favicon.svg` los antiguos tonos púrpuras por el degradado cian (`#06b6d4`) y esmeralda (`#10b981`), reflejando la identidad en la pestaña del navegador.

## Risks / Trade-offs

- **[Riesgo de Flash de color al recargar (FOUC)]** → Mitigado con un script inline bloqueante en `index.html` que evalúa `localStorage.getItem('aifinops-theme')` antes de que React comience el montaje del DOM.
- **[Riesgo de rotura en contraste o legibilidad]** → Mitigado manteniendo escalas contrastadas de texto (`slate-900` sobre fondos claros, y `white` / `slate-200` sobre fondos oscuros).
