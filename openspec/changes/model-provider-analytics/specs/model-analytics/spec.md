## Purpose

Proporciona vistas especializadas de analítica y observabilidad financiera sobre los modelos de IA (LLMs) y sus proveedores de infraestructura.

## ADDED Requirements

### Requirement: Cuadro de Mando de Distribución por Proveedor
El sistema SHALL presentar un gráfico interactivo tipo Donut/Pie que muestre el porcentaje de gasto total distribuido por proveedor de IA (OpenAI, Anthropic, Google Gemini, Meta/Bedrock).

#### Scenario: Visualización de cuota de gasto por proveedor
- **WHEN** el usuario navega a la pestaña "Model Analytics"
- **THEN** el sistema renderiza el gráfico Donut agrupando los costes por proveedor con su leyenda y porcentajes correspondientes

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
