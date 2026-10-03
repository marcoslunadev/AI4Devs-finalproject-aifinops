## Context

Actualmente en `frontend/src/lib/i18n.ts` existen diccionarios parciales para `es` y `en`. Sin embargo, múltiples componentes visuales (`Dashboard.tsx`, `ModelAnalytics.tsx`, `BudgetWarningBanner.tsx`, `NotificationDrawer.tsx`, `CostChart.tsx`, `DrillDownTable.tsx` y los gráficos de analítica) contienen cadenas duras en español sin envolver en `t()`, o utilizan claves faltantes en el diccionario `en`.

## Goals / Non-Goals

**Goals:**
- Centralizar todas las traducciones de la interfaz en `frontend/src/lib/i18n.ts` para los idiomas `es` y `en`.
- Garantizar que el 100% de los elementos visuales interactivos y estáticos se adapten en tiempo real al cambiar de idioma.
- Refactorizar las etiquetas dinámicas de gráficos de Recharts (tooltips, leyendas y nombres de ejes).

**Non-Goals:**
- No se incluirán nuevos idiomas adicionales a los soportados (`es` y `en`).
- No se modificará la estructura de rutas ni las respuestas JSON del backend.

## Decisions

1. **Estructura Jerárquica de Diccionarios i18n**:
   - Organizar las claves bajo namespaces temáticos dentro de `i18n.ts`: `common`, `dashboard`, `kpis`, `charts`, `alerts`, `notifications`, `analytics` y `table`.
   - *Alternativa considerada*: Usar archivos JSON separados por idioma. *Razón de la elección*: Mantener el archivo comprimido y unificado `i18n.ts` previene peticiones HTTP asíncronas adicionales durante la carga inicial.

2. **Refactorización de Componentes React**:
   - Inyectar `const { t } = useTranslation();` en componentes puros como `BudgetWarningBanner`, `NotificationDrawer`, `Skeletons` y gráficos de Recharts.
   - Pasar los literales traducidos a las propiedades `name`, `label` y `formatter` de Recharts.

## Risks / Trade-offs

- **[Riesgo]**: Olvidar literales en subcomponentes modales o tooltips de gráficos.
  - *Mitigación*: Revisión sistemática archivo por archivo mediante búsqueda de patrones de texto en castellano.
