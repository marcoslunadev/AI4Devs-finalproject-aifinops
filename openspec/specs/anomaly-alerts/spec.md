# anomaly-alerts Specification

## Purpose
Permite detectar picos anómalos de coste de IA y umbrales de presupuesto crítico, notificando a los equipos de FinOps mediante banners de advertencia y un panel de notificaciones en tiempo real.

## Requirements
### Requirement: Alertas de Desviación Presupuestaria (Budget Burn Warning)
El sistema SHALL calcular de forma continua el porcentaje de presupuesto consumido por Organización y Entorno, emitiendo una alerta visual cuando supere el 85% (Warning) o el 100% (Critical).

#### Scenario: Notificación visual al superar el 85% de presupuesto
- **WHEN** el consumo de una organización alcanza el 86% de su presupuesto asignado
- **THEN** el sistema resalta la fila en la tabla con un indicador de advertencia amarillo y añade una alerta activa al panel de notificaciones
