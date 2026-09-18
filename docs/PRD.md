# Product Requirements Document (PRD) - AIFinOps

---

## 1. Resumen ejecutivo

**Objetivo del Producto:**
En la actualidad, las empresas se enfrentan a un crecimiento exponencial y descontrolado en el uso de modelos fundacionales y agentes autónomos de Inteligencia Artificial (OpenAI, Google Gemini, Claude, etc.). Esta situación genera problemas críticos como el *Shadow AI*, facturas impredecibles de proveedores, falta de atribución de costes por centros de responsabilidad y ausencia de métricas de rendimiento. AIFinOps centraliza la telemetría, auditoría y control financiero del consumo de IA, transformando datos crudos en información estratégica.

**Qué es:**
Una plataforma integral de observabilidad y FinOps de IA diseñada para monitorizar, auditar y optimizar el consumo a nivel de organizaciones, departamentos y usuarios, ofreciendo una visibilidad multidimensional.

### Qué NO incluye el MVP (out of scope explícito)
- Conectores en tiempo real directos a las APIs de los proveedores (la ingesta será vía subida de ficheros de logs).
- Alertas automatizadas por superación de presupuestos (post-MVP).
- Funcionalidad de "Kill Switch" para apagar agentes de IA desde la plataforma.
- Integración con SSO corporativos (SAML/Okta), solo autenticación básica JWT.
- Facturación interna automatizada (Chargeback automático a centros de coste).

---

## 2. Usuario objetivo

**Perfil primario:**
- **C-Level & Directives (CIO, CTO, CFO):** Necesitan visualización de KPIs globales, tendencias a 90 días y distribución del gasto.
- **Gestores de Innovación & Heads of AI:** Requieren monitorizar el catálogo de agentes, la adopción por departamento y el rendimiento.
- **Líderes de Departamento (Managers):** Buscan control detallado del consumo de los usuarios bajo su responsabilidad.

**Job to be done:**
*"Como responsable de tecnología/finanzas, necesito un panel centralizado donde pueda ver exactamente cuánto estamos gastando en IA, quién lo está gastando y en qué agentes, para poder predecir facturas y auditar el uso sin tener que pedir reportes manuales a cada equipo."*

---

## 3. Requisitos funcionales

### 3.1 — Autenticación y Autorización
AIFinOps maneja información financiera sensible, por lo que requiere control de acceso estricto.
- **Autenticación:** Los usuarios deben iniciar sesión con credenciales (email y contraseña) validadas contra la base de datos (hashing con bcrypt y tokens JWT).
- **RBAC Jerárquico:** Existen roles definidos (SuperAdmin, Org Manager, Dept Manager, Auditor) que determinan qué nivel de los datos (Organización, Departamento, o globales) puede visualizar cada usuario.

### 3.2 — Ingesta y Normalización de Logs
El motor de alimentación de datos de la plataforma, diseñado para manejar grandes volúmenes de forma segura.
- **Subida de ficheros:** Los administradores pueden subir ficheros de telemetría (JSON, JSONL, CSV) generados por SDKs o gateways de IA.
- **Procesamiento Asíncrono y Auditoría:** La ingesta masiva se realiza en background (asíncrona) para no bloquear el servidor. Se debe mantener un registro de auditoría en la base de datos por cada fichero procesado, capturando su estado (pendiente, completado, error), cantidad de registros procesados con éxito, y el detalle de cualquier fallo de ingesta para garantizar la trazabilidad y que no haya pérdida de datos.
- **Normalización:** El sistema debe parsear los ficheros y estandarizar tokens de entrada/salida, costes, latencias, timestamps y modelo/proveedor.

### 3.3 — Dashboard Ejecutivo (KPIs Globales)
La vista de alto nivel para la toma de decisiones.
- **Métricas:** Debe mostrar Total de Agentes Activos, Volumen de Tokens, Coste Total Acumulado, Coste Medio por Ejecución y Mix de Proveedores.
- **Filtros Temporales:** Los KPIs deben calcularse en base a un rango de fechas (por defecto los últimos 90 días).

### 3.4 — Matriz Jerárquica Drill-Down
El núcleo analítico de la aplicación.
- **Tabla en Cascada:** Una tabla interactiva con sumatorios en cascada: Organización ➔ Departamento ➔ Usuario.
- **Filtros Multidimensionales:** Los datos mostrados en la tabla deben poder filtrarse por entorno (DEV, PRE, PRO) y rango de fechas.
- **Interacción:** Hacer clic en una fila despliega el nivel jerárquico inferior (ej. al hacer clic en una Organización, se muestran sus Departamentos).

### 3.5 — Explorador de Auditoría Granular
Para investigar anomalías o revisar el uso.
- **Historial de Ejecuciones:** Vistas de detalle donde se pueda rastrear el uso individual de los modelos por parte de un usuario o agente, mostrando el historial cronológico de ejecuciones, errores y latencias.

---

## 4. Requisitos no funcionales

- **Privacidad y Seguridad:** Aislamiento de datos por Organización (multi-tenant lógico). Sanitización de entradas (Helmet, Zod) y protección contra ataques comunes (OWASP).
- **Rendimiento:** Las consultas de agregación (sumatorios jerárquicos) deben responder en menos de 2 segundos, requiriendo el uso de índices adecuados y tipos de datos optimizados en PostgreSQL (ej. JSONB para metadata flexible).
- **Responsive:** La interfaz (Dashboard y Tablas) debe ser responsiva y utilizable en pantallas de escritorio y tablets.
- **Auditabilidad:** Las acciones de subida de ficheros y cambios de roles deben quedar registradas.

---

## 5. Stack técnico (contexto para el equipo)

> *Nota: Esta sección da contexto general. Las especificaciones detalladas residen en el directorio `openspec/` y en `AGENT.md`.*

- **Backend:** Node.js, Express (TypeScript), Clean Architecture.
- **Base de Datos:** PostgreSQL 16 (vía Docker Compose) y Prisma ORM.
- **Frontend:** React 18+, Vite, TypeScript, TailwindCSS, Recharts para gráficas, y Zustand/React Query para manejo de estado.
- **Seguridad:** JWT, bcrypt, Zod (validación de esquemas).

---

## 6. Criterios de éxito del MVP

El MVP se considerará exitoso si cumple con los siguientes hitos:
1. **Precisión de Costes:** El sumatorio total de costes calculado por el motor de agregación coincide con los datos crudos subidos sin pérdida de precisión decimal.
2. **Navegabilidad:** Un usuario con rol Directivo puede navegar desde la vista global de Organización hasta el consumo de un Usuario específico en menos de 3 clics.
3. **Carga Inicial:** El sistema puede procesar un fichero de logs de 10,000 registros e insertarlo normalizado en la base de datos en menos de 10 segundos.

---

## 7. Riesgos conocidos

- **Cálculo Financiero (Float/Decimal):** Riesgo de pérdida de precisión en los cálculos de costes de tokens si se utilizan tipos `float` estándar en lugar de tipos numéricos precisos (`Decimal` en Prisma/PostgreSQL).
- **Rendimiento de Agregación:** Con millones de registros de telemetría, los cálculos en tiempo real en la tabla Drill-Down pueden ser lentos. Si esto ocurre, se requerirá explorar vistas materializadas, aunque no es el alcance inicial del MVP.
- **Diversidad de Formatos de Logs:** Cada proveedor de IA (OpenAI, Anthropic) tiene formatos de respuesta distintos; el *Ingestion Engine* debe ser lo suficientemente robusto para no fallar si cambian ligeramente.

---

## 8. Glosario

- **Agente de IA:** Entidad lógica o aplicación que consume modelos de IA para realizar una tarea.
- **Telemetría:** Datos crudos resultantes de la ejecución de una IA (ej. tokens usados, tiempo de respuesta).
- **FinOps:** Práctica de gestión financiera en la nube, en este caso aplicada al control de costes de IA.
- **Shadow AI:** Uso no autorizado o no trackeado de modelos de IA por parte de los empleados.
- **Drill-Down:** Capacidad de navegar desde datos agregados generales hacia los detalles más granulares.
