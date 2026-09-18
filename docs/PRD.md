# Product Requirements Document (PRD) - AIFindOps

## 1. Introducción y Objetivo
En la actualidad, las empresas se enfrentan a un crecimiento exponencial y descontrolado en el uso de modelos fundacionales y agentes autónomos de Inteligencia Artificial (OpenAI, Google Gemini, Claude, etc.). Esta situación genera problemas críticos como el *Shadow AI*, facturas impredecibles de proveedores, falta de atribución de costes por centros de responsabilidad y ausencia de métricas de rendimiento y adopción.

**Objetivo del Producto:**
AIFindOps centraliza la telemetría, auditoría y control financiero del consumo de IA en la empresa, transformando datos crudos de ejecución en información estratégica.

## 2. Público Objetivo (Target Audience)
El software está diseñado para los siguientes roles dentro de una organización:
* **C-Level & Directivos (CIO, CTO, CFO):** Necesitan visualización de KPIs ejecutivos globales, tendencias a 90 días y distribución presupuestaria.
* **Gestores de Innovación & Heads of AI:** Requieren monitorizar el catálogo de agentes, adopción por departamentos y rendimiento técnico.
* **Líderes de Departamento (Managers):** Buscan control del consumo y ejecuciones de los usuarios bajo su responsabilidad.

## 3. Características y Funcionalidades del MVP
El Producto Mínimo Viable (MVP) debe contemplar 4 funcionalidades críticas:

1. **Ingesta y Normalización de Logs de IA:**
   Procesamiento de ficheros de telemetría (JSON, JSONL, CSV) provenientes de gateways o SDKs de proveedores de IA, normalizando tokens, costes, latencias, timestamps y modelos.

2. **Dashboard Ejecutivo con KPIs Globales:**
   Panel superior con métricas agregadas (ventana de 90 días o rango dinámico):
   - Total de Agentes de IA Activos.
   - Volumen Total de Tokens.
   - Coste Total Acumulado.
   - Coste Medio por Ejecución.
   - Mix de Proveedores/Modelos y Tasa de Éxito.

3. **Matriz Jerárquica Drill-Down (Org ➔ Dept ➔ User):**
   Tabla interactiva con sumatorios en cascada. Filtros dinámicos multidimensionales por rango de fechas y entorno (DEV, PRE, PRO). Despliegue en acordeón para navegar desde la organización hasta el consumo granular del usuario.

4. **Explorador de Auditoría y Trazabilidad Granular:**
   Vistas de detalle de Organización, Departamento y Usuario para rastrear el uso individual de los modelos, revisar errores y auditar interacciones.

## 4. Historias de Usuario Principales
* **HU-01:** Como CIO / Gestor de Innovación, quiero visualizar los KPIs globales de consumo de IA a 90 días y desplegar una tabla en cascada por Organización, Departamento y Usuario con filtros de entorno (DEV, PRE, PRO), para analizar la distribución del gasto.
* **HU-02:** Como Administrador de Sistemas, quiero subir ficheros de logs (JSON/CSV) con eventos de ejecución de IA, para centralizar y estandarizar automáticamente los registros de consumo y cálculo de costes.
* **HU-03:** Como Auditor de Seguridad / Responsable, quiero navegar al detalle de un agente de IA o de un usuario específico y revisar su historial cronológico de ejecuciones, para auditar el uso adecuado de los modelos y verificar latencias/fallos.
