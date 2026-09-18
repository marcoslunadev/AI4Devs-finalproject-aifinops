## Purpose
Define los requisitos visuales, de internacionalización y temáticos para el panel de control principal de AIFinOps, asegurando accesibilidad y usabilidad.

## ADDED Requirements

### Requirement: Soporte Multi-idioma (i18n)
El frontend SHALL soportar la internacionalización de toda su interfaz, permitiendo cambiar el idioma dinámicamente entre Inglés y Español (por defecto).

#### Scenario: Cambio de idioma en tiempo real
- **WHEN** un usuario selecciona "Inglés" en el selector de idiomas
- **THEN** todos los textos de la interfaz (botones, tablas, KPIs) se traducen al inglés inmediatamente sin recargar la página

### Requirement: Temas Claro y Oscuro (Theming)
El sistema SHALL permitir al usuario alternar entre modos de visualización claro y oscuro.

#### Scenario: Activación de modo oscuro
- **WHEN** el usuario hace clic en el botón de "Modo Oscuro"
- **THEN** el sistema aplica las clases de TailwindCSS correspondientes invirtiendo los colores de fondo y texto adecuadamente

### Requirement: Visualización de KPIs y Tabla Jerárquica
El Dashboard SHALL presentar tarjetas de métricas clave (KPIs) globales y una tabla interactiva para desglosar datos por Organización, Departamento y Usuario. Además, SHALL integrar gráficos (`recharts`) para ilustrar el consumo a lo largo del tiempo.

#### Scenario: Visualización interactiva de Drill-Down
- **WHEN** el usuario visualiza la tabla en el nivel "Organización" y hace clic en una fila
- **THEN** la tabla se actualiza o expande para mostrar los Departamentos que pertenecen a esa Organización
