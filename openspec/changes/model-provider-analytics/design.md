## Context

The executive dashboard needs a dedicated analytics view focused specifically on model and provider breakdown. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Design `ModelAnalytics.tsx` view using modular Recharts components (`ModelDistributionChart`, `TokenRatioChart`, `ModelEfficiencyChart`).
- Implement navigation tab controls in `DashboardLayout.tsx` and sub-routing in `App.tsx`.
- Apply strict `react-expert` patterns: clean custom hooks, proper component memoization, accessibility, and zero inline style duplication.
- Ensure full i18n support across all charts and tooltips.

**Non-Goals:**
- Real-time model benchmarking suite or automated prompt engineering recommendations.

## Decisions

### Decisión 1: Reutilización de Recharts para Analítica de Modelos
**Opción seleccionada**: Recharts (`PieChart`/`Pie`, `BarChart`/`Bar` con apilado `stacked`, y `ScatterChart`/`Scatter`).
**Alternativas consideradas**: Chart.js, D3.js puro.
**Rationale**: Recharts ya está integrado en el proyecto, ofrece soporte nativo para TypeScript y React 19, y mantiene la coherencia estilística entre el gráfico de serie temporal y los nuevos gráficos de modelos.

### Decisión 2: Estructura de Componentes en el Frontend
**Opción seleccionada**: Ubicar los componentes analíticos en `frontend/src/components/analytics/`:
- `ModelDistributionChart.tsx` (Donut / Pie Chart por proveedor)
- `TokenRatioChart.tsx` (Input vs Output tokens por modelo)
- `ModelEfficiencyChart.tsx` (Scatter Latencia vs Coste por modelo)
- `ModelAnalytics.tsx` (Página/Vista contenedora principal)

## Risks / Trade-offs

- **Risk**: Complejidad visual al mostrar muchos modelos simultáneamente en el gráfico de dispersión (Scatter Plot).
  - **Mitigation**: Agrupar modelos secundarios en una categoría "Otros" o permitir filtrado dinámico desde la leyenda del gráfico.
