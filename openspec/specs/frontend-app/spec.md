## Purpose
Define la estructura fundacional, la arquitectura del estado del cliente y la estrategia visual base (Tailwind) para el frontend de AIFinOps.

## Requirements

### Requirement: Enrutamiento del lado del cliente (SPA)
El frontend SHALL estar estructurado como una Single Page Application (SPA) usando un enrutador (e.g., React Router o Wouter) que gestione la navegación sin recargas completas de página.

#### Scenario: Navegación entre vistas
- **WHEN** un usuario hace clic en un enlace del menú de navegación
- **THEN** la URL cambia sin recargar el navegador
- **AND** la vista correspondiente se renderiza inmediatamente

### Requirement: Manejo de Estado Global y Asíncrono
El frontend SHALL utilizar mecanismos estandarizados para manejar estado. El estado global síncrono (ej. usuario autenticado, filtros del dashboard) SHALL manejarse con Zustand. El estado asíncrono y caché de servidor SHALL manejarse con React Query para garantizar coherencia y reintentos.

#### Scenario: Petición de datos con React Query
- **WHEN** el componente Dashboard se monta
- **THEN** React Query realiza una petición al backend
- **AND** el componente muestra un indicador de carga mientras espera la respuesta

### Requirement: Sistema de Diseño Visual Consistente
La aplicación SHALL implementar un sistema de diseño visual unificado basado en TailwindCSS v4 con tokens semánticos de diseño centralizados en variables CSS y directivas `@theme`. El sistema SHALL estructurarse en torno a una paleta oscura Obsidian (`#080b11`) para el fondo base, superficies de tarjetas y contenedores en `#0f1420` y superficies elevadas o popovers en `#171e2e`. El modo claro SHALL utilizar un fondo Slate 50 (`#f8fafc`) con tarjetas en blanco puro (`#ffffff`). Los acentos principales de interactividad y foco SHALL ser Cian (`#06b6d4`) y los acentos financieros y de métricas óptimas SHALL ser Esmeralda (`#10b981`), complementados con un gradiente de acción `linear-gradient(135deg, #06b6d4 0%, #10b981 100%)`.

#### Scenario: Estilos de Componente UI con Tokens Semánticos
- **WHEN** se renderiza cualquier componente o contenedor interactivo de la interfaz
- **THEN** los estilos se aplican utilizando las clases utilitarias y tokens del sistema de diseño (ej. `dark:bg-[#0f1420]`, `bg-gradient-to-r from-cyan-500 to-emerald-500`) sin CSS arbitrario desordenado
- **AND** la interfaz mantiene consistencia visual armónica tanto en modo claro como en modo oscuro

### Requirement: Jerarquía Tipográfica Multifuente
El frontend SHALL implementar una jerarquía tipográfica tecnológica de alto impacto cargada desde Google Fonts:
1. Fuente `Outfit` (`font-heading`) para títulos, encabezados principales, nombres de secciones y cifras destacadas de KPIs.
2. Fuente `Inter` (`font-sans`) para el cuerpo de texto, descripciones, botones, etiquetas de navegación y celdas de tabla.
3. Fuente `JetBrains Mono` (`font-mono`) para cifras financieras en USD, contadores de tokens, latencias en milisegundos e identificadores de sistema.

#### Scenario: Renderizado tipográfico diferenciado
- **WHEN** un usuario visualiza el Dashboard o vistas analíticas
- **THEN** los títulos de sección se muestran con la tipografía `Outfit`, los textos explicativos con `Inter` y las métricas numéricas y costes con `JetBrains Mono`

### Requirement: Identidad Visual y Emblemas Corporativos
El frontend SHALL presentar en la cabecera (`Header`) y en la pantalla de autenticación (`LoginPage`) el emblema tecnológico CPU de AIFinOps alojado en un contenedor squircle con gradiente cian-esmeralda y sombra luminosa. Asimismo, el favicon SVG de la aplicación (`favicon.svg`) SHALL estar adaptado cromáticamente a la gama de cian y esmeralda.

#### Scenario: Visualización del emblema en cabecera y login
- **WHEN** se carga la cabecera o la pantalla de inicio de sesión
- **THEN** se renderiza el emblema tecnológico CPU estilizado con gradiente cian-esmeralda y el favicon del navegador muestra los tonos corporativos
