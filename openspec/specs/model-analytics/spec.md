# model-analytics Specification

## Purpose
Proporciona vistas especializadas de analítica y observabilidad financiera sobre los modelos de IA (LLMs) y sus proveedores de infraestructura.
## Requirements
### Requirement: Cuadro de Mando de Distribución por Proveedor
El sistema SHALL presentar un gráfico interactivo tipo Donut/Pie que muestre el porcentaje y el coste real distribuido por proveedor de IA (OpenAI, Anthropic, Google Gemini, Meta/Bedrock), calculado a partir de los registros de telemetría de los últimos 30 días y sin datos sintéticos de respaldo.

#### Scenario: Visualización de cuota de gasto por proveedor
- **WHEN** el usuario navega a la pestaña "Model Analytics"
- **THEN** el sistema renderiza el gráfico Donut agrupando los costes reales por proveedor con su leyenda, total y porcentajes correspondientes

#### Scenario: Sin registros de telemetría
- **WHEN** no existen registros de ejecución en el período consultado
- **THEN** el gráfico muestra un total de coste cero y no presenta proveedores ficticios

### Requirement: Análisis de Ratio Tokens Input vs Output
El sistema SHALL visualizar en un gráfico de barras comparativo el volumen de tokens consumidos en prompts (Input) versus la generación de respuestas (Output) por cada modelo.

#### Scenario: Inspección de consumo de tokens por tipo
- **WHEN** el usuario examina el gráfico de tokens por modelo
- **THEN** el sistema distingue claramente las barras de Input Tokens y Output Tokens facilitando la detección de sobrecostes por contexto masivo

### Requirement: Matriz de Eficiencia Latencia vs Coste
El sistema SHALL calcular y visualizar la latencia promedio por llamada (ms) frente al coste promedio por token/ejecución para identificar modelos ineficientes o lentos.

#### Scenario: Detección de modelos lentos o costosos
- **WHEN** un modelo supera un umbral de latencia de 2500ms o coste elevado por llamada
- **THEN** el gráfico resalta dicho modelo con un indicador de advertencia para guiar la optimización

### Requirement: Traducción Completa de Analítica de Modelos (`model-analytics`)
Todos los títulos de gráficos, leyendas, ejes X/Y, tooltips y descripciones de tarjetas en la vista de Analítica por Modelo SHALL utilizar claves de traducción i18n para inglés y español.

#### Scenario: Cambio de idioma a inglés en la vista Model Analytics
- **WHEN** el usuario selecciona "English" mientras navega por la página de Analítica por Modelo y Proveedor
- **THEN** los encabezados de los tres gráficos (`ModelDistributionChart`, `TokenRatioChart`, `ModelEfficiencyChart`), los nombres de los ejes y las leyendas de tooltips cambian automáticamente al idioma inglés

