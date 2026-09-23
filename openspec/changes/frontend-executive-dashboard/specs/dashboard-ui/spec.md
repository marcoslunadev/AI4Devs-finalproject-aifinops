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

### Requirement: Visualización de KPIs y Tabla Jerárquica (Executive Dashboard)
El Dashboard SHALL presentar en su cabecera 6 tarjetas de métricas clave (Total Cost, Total Executions, Total Tokens, Avg Cost per Execution, Active Organizations, Error Rate) con indicadores de tendencia (micro-sparklines o variaciones porcentuales). Además, SHALL presentar una tabla interactiva para desglosar datos financieros y de uso por Organización.

#### Scenario: Visualización interactiva de Drill-Down por Entorno
- **WHEN** el usuario visualiza la tabla en el nivel "Organización" (ej. VASS) y hace clic en el icono de expandir
- **THEN** la tabla despliega filas anidadas mostrando los datos de los Entornos que pertenecen a esa Organización (PROD, PRE, DEV)
- **AND** alinea las columnas de los entornos exactamente bajo las columnas de la organización padre, mostrando "No Data" o "—" si un entorno no tiene consumo en el periodo seleccionado
