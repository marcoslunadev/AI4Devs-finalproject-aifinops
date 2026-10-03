## Why

Al cambiar el idioma de la aplicación a inglés desde el selector del Header, varios componentes principales (Dashboard, Model Analytics, gráficos de Recharts, alertas, drawers de notificaciones y estados de error/carga) siguen mostrando cadenas de texto codificadas directamente en español en lugar de utilizar las claves de traducción de `react-i18next`. Esto provoca una experiencia de usuario incoherente e incompleta en entornos bilingües.

## What Changes

- Revisar exhaustivamente todos los componentes y páginas del frontend (`Dashboard`, `ModelAnalytics`, `CostChart`, `DrillDownTable`, `NotificationDrawer`, `BudgetWarningBanner`, `Skeletons`, gráficos de analítica) y reemplazar las cadenas de texto literales en español por llamadas a `t('clave')`.
- Ampliar las definiciones de diccionarios `es.json` / `en.json` (o `resources` en `i18n.ts`) para añadir todas las traducciones faltantes en inglés y español.
- Garantizar que las etiquetas de ejes, tooltips, estados vacíos, badges de estado y mensajes de alerta/error reaccionen dinámicamente al cambio de idioma actual.

## Capabilities

### Modified Capabilities
- `dashboard-ui`: Soporte completo de i18n bilingüe (Español/Inglés) en todos los componentes visuales del Dashboard (KPIs, gráfica temporal, tabla jerárquica y alertas).
- `model-analytics`: Traducción dinámica completa de las tarjetas informativas y los tres gráficos analíticos por proveedor y modelo (distribución, ratio de tokens y matriz de eficiencia).

## Impact

- **Frontend (`frontend/src`)**:
  - Actualización del archivo de recursos `frontend/src/lib/i18n.ts` con nuevos namespaces y claves de traducción para inglés y español.
  - Refactorización de componentes React (`Dashboard.tsx`, `ModelAnalytics.tsx`, `CostChart.tsx`, `DrillDownTable.tsx`, `NotificationDrawer.tsx`, `BudgetWarningBanner.tsx`, `Skeletons.tsx`, etc.) para consumir el hook `useTranslation()`.
- **APIs / Backend**: Sin impacto en el servidor Express o la base de datos PostgreSQL.
