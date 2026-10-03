## 1. Ampliación de Diccionarios i18n (`frontend/src/lib/i18n.ts`)

- [x] 1.1 Identificar y añadir todas las claves faltantes para los módulos Dashboard, Analítica, Alertas, Drawer de Notificaciones, Gráficos y Errores en `es` y `en`.

## 2. Refactorización de Componentes del Dashboard

- [x] 2.1 Refactorizar `Dashboard.tsx`, `CostChart.tsx`, `DrillDownTable.tsx`, `BudgetWarningBanner.tsx` y `NotificationDrawer.tsx` reemplazando textos duros por llamadas a `t()`.
- [x] 2.2 Refactorizar `Skeletons.tsx` y estados de error/carga para usar traducciones dinámicas.

## 3. Refactorización de Componentes de Model Analytics

- [x] 3.1 Refactorizar `ModelAnalytics.tsx`, `ModelDistributionChart.tsx`, `TokenRatioChart.tsx` y `ModelEfficiencyChart.tsx` integrando `t()` en títulos, leyendas y tooltips de Recharts.

## 4. Verificación y Pruebas

- [x] 4.1 Comprobar mediante cambio de idioma en vivo (Español ↔ English) que no quedan cadenas sin traducir en ninguna vista.
- [x] 4.2 Ejecutar la compilación del frontend (`npm run build`) para verificar la integridad del código TypeScript.
