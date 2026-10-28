## Why

La plataforma AIFinOps requería modernizar y profesionalizar su identidad visual y coherencia estética ("Look & Feel"), estableciendo una experiencia de usuario de alto nivel para roles directivos y técnicos de FinOps. Era necesario dotar a la plataforma de un sistema de diseño consistente con paleta oscura obsidian de alto contraste, superficies modulares, acentos cian y esmeralda para métricas y gráficos, tipografía multi-fuente jerárquica y coherencia cromática en el logo y favicon tanto en modo claro como oscuro.

## What Changes

- **Tokens de diseño y paleta cromática centralizada en TailwindCSS v4**:
  - Modo Oscuro: Fondo principal en Obsidian Deep (`#080b11`), superficies de tarjetas y tablas en Slate Obsidian (`#0f1420`), superficies elevadas e inputs en `#171e2e` con bordes sutiles translúcidos (`border-white/10`).
  - Modo Claro: Fondo en Slate 50 (`#f8fafc`), tarjetas en blanco puro (`#ffffff`) y bordes en `slate-200`.
  - Acentos de marca: Cian (`#06b6d4`) para foco, elementos interactivos y gráficos temporales; Esmeralda (`#10b981`) para métricas de coste, presupuesto y ratios; y gradiente insignia `linear-gradient(135deg, #06b6d4 0%, #10b981 100%)`.
- **Jerarquía tipográfica moderna**:
  - `Outfit`: Tipografía display/heading para títulos principales, cabeceras de tarjetas y números de impacto.
  - `Inter`: Tipografía sans-serif para textos de lectura, controles y tablas.
  - `JetBrains Mono`: Tipografía monoespaciada para importes monetarios, contadores de tokens, latencias y códigos.
- **Identidad visual del emblema tecnológico y favicon**:
  - Emblema CPU integrado en squircle con gradiente cian-esmeralda en `Header.tsx` y `LoginPage.tsx`.
  - Favicon SVG corporativo adaptado a la paleta cian y esmeralda con reflejos de luz en cian 50.
- **Adaptación integral de componentes UI**:
  - Actualización de `DashboardLayout`, `Header`, `NavigationTabs`, `GlobalFilterBar`, `KpiCard`, `CostChart`, `DrillDownTable`, `ExecutionLogsView`, `ModelAnalytics`, `AgentDetailView`, `NotificationDrawer`, `BudgetWarningBanner` y `Skeletons`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `frontend-app`: Incorpora la especificación del sistema de tokens de diseño, paleta cromática, jerarquía tipográfica y recursos vectoriales corporativos.
- `dashboard-ui`: Refina los requisitos de los temas claro y oscuro, tarjetas KPI, gráficos analíticos y componentes de tabla con la nueva estética.

## Impact

- **Frontend**: Afecta a `index.html`, `src/index.css`, `public/favicon.svg`, `public/icons.svg` y a los componentes principales de `src/components/` y `src/pages/`.
- **Backend / APIs**: Sin impacto. Totalmente desacoplado de la lógica de negocio y base de datos.
- **Dependencias**: Sin nuevas dependencias de paquetes; utiliza TailwindCSS v4 y Google Fonts.
