## Context

The frontend application is an SPA built with React, Vite, and TailwindCSS v4. It requires a solid foundation for its main dashboard, including components for data visualization (recharts), multi-language support (i18n), and a flexible theme system (Dark/Light).

## Goals / Non-Goals

**Goals:**
- Configurar i18next para la gestión de idiomas (Inglés / Español).
- Implementar un ThemeProvider usando React Context y las utilidades de TailwindCSS v4 para Dark Mode.
- Diseñar y crear los componentes base para las tarjetas de KPI y tablas jerárquicas usando una librería de UI ligera o componentes custom con Tailwind.

**Non-Goals:**
- Implementar la carga real de datos desde el backend en esta fase (se usarán datos mockeados para estructurar la UI).
- Soportar otros idiomas adicionales al inglés y español por ahora.

## Decisions

### Decisión 1: Librería de Internacionalización
**Opción seleccionada**: `i18next` junto con `react-i18next`.
**Alternativas consideradas**: `react-intl`, contextos personalizados.
**Rationale**: Es el estándar de facto en React, ligero, modular, y cuenta con amplio soporte de la comunidad.

### Decisión 2: Implementación de Modo Oscuro
**Opción seleccionada**: TailwindCSS dark mode configurado mediante la clase `dark` en el tag HTML.
**Alternativas consideradas**: CSS Variables manuales.
**Rationale**: Tailwind v4 gestiona el modo oscuro de forma muy limpia. Solo necesitamos un pequeño `ThemeProvider` en React que lea el estado local o la preferencia del sistema y haga un toggle de la clase `dark` en el `<html className="dark">`.

### Decisión 3: Gráficos y Tablas
**Opción seleccionada**: `recharts` para gráficos de líneas/barras y HTML native `table` estilizado con Tailwind para la tabla jerárquica.
**Alternativas consideradas**: Chart.js, AG Grid.
**Rationale**: `recharts` es nativo en React y muy declarativo. Para la tabla, siendo un MVP, una tabla nativa estilizada nos da control total sobre la lógica de expandir/contraer filas para el Drill-down (Organización -> Dept -> Usuario) sin el peso de librerías de data-grid completas.

### Decisión 4: Layout y Métricas del Executive Dashboard
**Opción seleccionada**: 
- **Top KPIs**: 6 tarjetas (Total Cost, Total Executions, Total Tokens, Avg Cost per Execution, Active Organizations, Error Rate) con indicadores de tendencia (micro-sparklines o porcentajes vs periodo anterior).
- **Tabla Detallada**: Jerarquía de 2 niveles: Organización (Padre) desplegable hacia Entornos (Hijos: PROD, DEV, PRE). Las columnas se dividen en Periodo Actual vs Totales (incluyendo barra visual de Budget Burn %).
**Alternativas consideradas**: Vistas planas sin desglose de entorno.
**Rationale**: Los ejecutivos (C-Level, FinOps) necesitan ver el agregado por centro de coste (Organización) con capacidad de analizar rápidamente si el coste anómalo proviene de producción o desarrollo (Entorno). La barra de "Budget Burn" ayuda a visualizar el riesgo financiero rápidamente.

## Risks / Trade-offs

- **Risk**: El archivo de traducciones puede crecer mucho.
  - **Mitigation**: Cargar las traducciones bajo demanda o separarlas por namespaces si la aplicación crece significativamente.
- **Risk**: La tabla jerárquica nativa puede volverse lenta con miles de filas.
  - **Mitigation**: Para el MVP los datos de organizaciones y entornos son muy acotados. Si crece en el futuro, se migrará a react-table o AG Grid.
