## Purpose

Permite inspeccionar de forma analítica y detallada las ejecuciones de modelos de IA agrupadas jerárquicamente por Organización, Departamento y Modelo LLM.

## ADDED Requirements

### Requirement: Vista Detallada de Ejecuciones por Departamento
El sistema SHALL exponer una vista interactiva de ejecuciones que muestre el desglose jerárquico Entidad ➔ Departamento ➔ Modelo LLM con datos de volumen de llamadas, consumo de tokens de entrada/salida, coste acumulado y latencia promedio en milisegundos.

#### Scenario: Visualización del desglose por departamento
- **WHEN** el usuario navega a la pestaña de Analítica por Departamento
- **THEN** el sistema renderiza la tabla jerárquica con las organizaciones, sus departamentos asociados y los modelos LLM utilizados
- **AND** muestra el volumen de llamadas, tokens (prompt/completion), coste total y latencia promedio
