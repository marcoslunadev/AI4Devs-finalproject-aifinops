## ADDED Requirements

### Requirement: Traducción Completa de Analítica de Modelos (`model-analytics`)
Todos los títulos de gráficos, leyendas, ejes X/Y, tooltips y descripciones de tarjetas en la vista de Analítica por Modelo SHALL utilizar claves de traducción i18n para inglés y español.

#### Scenario: Cambio de idioma a inglés en la vista Model Analytics
- **WHEN** el usuario selecciona "English" mientras navega por la página de Analítica por Modelo y Proveedor
- **THEN** los encabezados de los tres gráficos (`ModelDistributionChart`, `TokenRatioChart`, `ModelEfficiencyChart`), los nombres de los ejes y las leyendas de tooltips cambian automáticamente al idioma inglés
