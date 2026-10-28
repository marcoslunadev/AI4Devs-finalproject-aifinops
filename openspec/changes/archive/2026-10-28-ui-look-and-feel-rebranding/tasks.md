## 1. Fundamentos y Sistema de Tokens

- [x] 1.1 Configurar tipografías de Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`) y script anti-FOUC en `index.html`.
- [x] 1.2 Definir directivas `@theme` y variables de tokens de color (`#080b11`, `#0f1420`, `#171e2e`, `#06b6d4`, `#10b981`) en `src/index.css`.
- [x] 1.3 Adaptar el archivo vectorial corporativo `public/favicon.svg` y `public/icons.svg` con la nueva paleta cromática cian y esmeralda.

## 2. Layout, Cabecera y Navegación

- [x] 2.1 Actualizar `DashboardLayout.tsx` con fondo base obsidian `#080b11` y estilos de selección.
- [x] 2.2 Integrar el emblema tecnológico CPU con squircle y gradiente cian-esmeralda en `Header.tsx`.
- [x] 2.3 Adaptar `NavigationTabs.tsx` con píldoras de navegación activas en gradiente cian-esmeralda y sombra luminosa.
- [x] 2.4 Actualizar `GlobalFilterBar.tsx` y `OrganizationScopeSelector.tsx` con fondos `#0f1420` / `#171e2e` y bordes `border-white/10`.

## 3. Vistas del Dashboard, Analítica y Autenticación

- [x] 3.1 Rediseñar `LoginPage.tsx` con el emblema CPU centralizado, fondo obsidian, resplandores ambientales y botones de acceso rápido estilizados.
- [x] 3.2 Actualizar `Dashboard.tsx` y `KpiCard.tsx` con títulos en `font-heading`, cifras en `font-mono` y acentos luminosos.
- [x] 3.3 Adaptar `CostChart.tsx`, `ModelDistributionChart.tsx`, `TokenRatioChart.tsx` y `ModelEfficiencyChart.tsx` con áreas cian, barras esmeralda y tooltips oscuros.
- [x] 3.4 Actualizar `DrillDownTable.tsx`, `ExecutionLogsView.tsx` y `AgentDetailView.tsx` con hovers `hover:bg-cyan-500/5` y paginadores con gradiente de marca.
- [x] 3.5 Sincronizar modales, banners de alerta y esqueletos en `NotificationDrawer.tsx`, `BudgetWarningBanner.tsx` y `Skeletons.tsx`.

## 4. Validación de Calidad

- [x] 4.1 Verificar compilación estricta TypeScript (`tsc -b`) y empaquetado de producción con Vite (`vite build`).
- [x] 4.2 Validar reglas de linter (`oxlint`) con cero errores en todos los archivos modificados.
- [x] 4.3 Validación visual interactiva en navegador en modo claro y modo oscuro para todas las vistas.
