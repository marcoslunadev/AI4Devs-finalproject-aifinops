## Purpose

Permite la administración y consulta versionada de tarifas por cada mil tokens para diferentes proveedores y modelos de IA, garantizando un cálculo financiero determinista y sin imprecisiones decimales para la observabilidad FinOps.

## ADDED Requirements

### Requirement: Versionado y Catálogo de Tarifas de Modelos
El sistema SHALL mantener una tabla versionada `ModelPrice` para almacenar los precios de entrada y salida de cada modelo de IA.
- Cada registro en `ModelPrice` SHALL contener `provider` (ej. OPENAI, ANTHROPIC, GEMINI), `model` (ej. gpt-4o, claude-3-5-sonnet), `promptPricePer1k` y `completionPricePer1k` con tipo nativo `Decimal(10, 6)`.
- El registro SHALL incluir `effectiveFrom` y un booleano `isActive` para permitir tarifas históricas y vigentes.
- Se SHALL garantizar unicidad en la combinación de proveedor, modelo y fecha de vigencia.

#### Scenario: Consulta de tarifa vigente para un modelo
- **WHEN** el motor de cálculo solicita el precio activo para el modelo `gpt-4o` de `OPENAI`
- **THEN** el sistema recupera la tarifa activa más reciente con sus precios por cada 1K tokens

### Requirement: Cálculo Determinista de Costes Financieros
El servicio de cálculo SHALL determinar el coste total en USD de una llamada de IA aplicando la tarifa vigente con aritmética decimal exacta.
- La fórmula aplicada SHALL ser: $\text{cost\_usd} = (\text{prompt\_tokens} \times \frac{\text{prompt\_price\_per\_1k}}{1000}) + (\text{completion\_tokens} \times \frac{\text{completion\_price\_per\_1k}}{1000})$.
- El sistema SHALL rechazar o emitir una excepción controlada si se intenta calcular el coste para un modelo no registrado en el catálogo activo de tarifas.

#### Scenario: Cálculo de llamada estándar con tarifas oficiales
- **WHEN** se procesa una ejecución con 1.250 prompt tokens y 430 completion tokens para un modelo con tarifas $0.005 / 1K y $0.015 / 1K
- **THEN** el coste resultante es calculado exactamente como $0.012700 USD sin errores de coma flotante

#### Scenario: Modelo sin tarifa registrada en catálogo
- **WHEN** se recibe una llamada de telemetría con un modelo inexistente en `ModelPrice`
- **THEN** el sistema marca el lote con advertencia y aplica una tarifa por defecto o registra error en auditoría
