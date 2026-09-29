## 1. Navegación por Pestañas del Dashboard
- [x] 1.1 Crear la barra de pestañas de navegación principal (Executive Overview / Model Analytics) en `frontend/src/components/NavigationTabs.tsx`.
- [x] 1.2 Configurar el enrutamiento o la conmutación de pestañas en `App.tsx` manteniendo los parámetros globales de la URL.

## 2. Componentes Visuales de Analítica por Modelo (Recharts)
- [x] 2.1 Crear `ModelDistributionChart.tsx` (Gráfico Donut/Pie de cuota de gasto por proveedor) en `frontend/src/components/analytics/`.
- [x] 2.2 Crear `TokenRatioChart.tsx` (Gráfico de barras comparativo de Input Tokens vs Output Tokens por modelo).
- [x] 2.3 Crear `ModelEfficiencyChart.tsx` (Gráfico Scatter / Matriz de Latencia ms vs Coste $ por llamada).

## 3. Integración de la Vista y Traducciones i18n
- [x] 3.1 Crear la página contenedora `frontend/src/pages/ModelAnalytics.tsx` integrando los 3 gráficos y métricas resumen.
- [x] 3.2 Añadir diccionarios de traducción (en, es) para todas las leyendas y métricas de analítica de modelos en `src/lib/i18n.ts`.
