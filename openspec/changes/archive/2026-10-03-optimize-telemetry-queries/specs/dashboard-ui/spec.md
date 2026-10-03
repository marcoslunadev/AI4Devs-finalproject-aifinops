## ADDED Requirements

### Requirement: Indicador de Estado de Ingesta y Timestamp de Última Actualización
El Executive Dashboard UI SHALL mostrar en su cabecera un indicador visual animado cuando exista un proceso de ingesta de datos en curso y la fecha y hora de la última ingesta completada.

#### Scenario: Visualización de ingesta en curso
- **WHEN** la API devuelva que el estado de ingesta es `"PROCESSING"`
- **THEN** la cabecera del Dashboard muestra una insignia animada indicando "Ingestando nuevos datos..."
- **AND** activa un sondeado dinámico (polling) cada 5 segundos hasta que el estado cambie a `"COMPLETED"`

#### Scenario: Visualización de última actualización completada
- **WHEN** la API devuelva que el estado de ingesta es `"COMPLETED"` con una fecha `lastIngestedAt` válida
- **THEN** la cabecera del Dashboard muestra la etiqueta de timestamp en formato legible (ej. "Última actualización: 03/10/2026 12:30h")
