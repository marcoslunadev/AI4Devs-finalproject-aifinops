## Purpose

Permite detectar picos anómalos de coste de IA y umbrales de presupuesto crítico, notificando a los equipos de FinOps y permitiendo la creación automatizada de tickets de seguimiento en Jira/Slack.

## ADDED Requirements

### Requirement: Alertas de Desviación Presupuestaria (Budget Burn Warning)
El sistema SHALL calcular de forma continua el porcentaje de presupuesto consumido por Organización y Entorno, emitiendo una alerta visual cuando supere el 85% (Warning) o el 100% (Critical).

#### Scenario: Notificación visual al superar el 85% de presupuesto
- **WHEN** el consumo de una organización alcanza el 86% de su presupuesto asignado
- **THEN** el sistema resalta la fila en la tabla con un indicador de advertencia amarillo y añade una alerta activa al panel de notificaciones

### Requirement: Integración de Webhooks de Jira / Slack
El sistema SHALL permitir al usuario enviar una alerta de anomalía seleccionada hacia el servidor de webhooks (`jira-webhook-server`) para crear un ticket de incidencia en Jira automáticamente.

#### Scenario: Creación de ticket de incidencia en Jira
- **WHEN** el usuario hace clic en "Crear Ticket Jira" sobre una alerta de coste anómalo
- **THEN** el frontend realiza una petición HTTP POST al `jira-webhook-server`
- **AND** muestra un mensaje flotante (Toast) confirmando la creación del ticket con su ID
