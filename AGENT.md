# Reglas de Contexto y Directrices para Asistentes de IA (AGENT.md)

Este documento define el contexto operativo, arquitectura, restricciones técnicas y convenciones de desarrollo que todo asistente de IA (Antigravity, Gemini, Claude, Cursor, Copilot) debe seguir estrictamente al contribuir a este repositorio.

---

## 1. Contexto del Producto y Alcance del MVP

* **Proyecto:** AIFinOps — Plataforma de Observabilidad, Gobernanza y FinOps de IA.
* **Propósito:** Monitorizar y optimizar el consumo de modelos y agentes de IA (OpenAI, Gemini, Anthropic) en la empresa, permitiendo a los roles directivos (CIO/FinOps) atribuir costes por Organización, Departamento y Usuario.
* **Alcance MVP (Camino Feliz Prioritario):**
  1. Ingesta de un único formato de archivo estructurado: **JSON / JSONL** (formato CSV pospuesto para v2).
  2. Dos roles esenciales de acceso RBAC: `ADMIN` (administración e ingesta) y `FINOPS_VIEWER` (consulta y filtros).
  3. Matriz jerárquica colapsable (*Organización ➔ Departamento ➔ Usuario*) con sumatorios en cascada y filtro de entorno (**DEV**, **PRE**, **PRO**, **TODOS**).
  4. Vista de Detalle de Agente (`AgentDetailView`) como explorador de auditoría granular (ficha técnica y llamadas paginadas).
  5. Cálculo financiero determinista basado en la tabla versionada de tarifas `ModelPrice`.
  6. Datos semilla realistas (`seed.ts`) que alimentan inmediatamente la jerarquía con datos creíbles.

---

## 2. Stack Tecnológico Mandatorio

* **Backend:**
  * Node.js v22+ (LTS) con **TypeScript** en modo estricto (`strict: true`).
  * Framework: **Express.js**.
  * Arquitectura: **Clean Architecture / Arquitectura en Capas** (separación estricta entre Controllers, Services y Repositories).
  * ORM y Base de Datos: **Prisma ORM** con **PostgreSQL 16** (vía Docker Compose).
  * Seguridad: **JWT** (firmado con HMAC-SHA256), **bcrypt** (salt rounds 10), **Helmet**, **CORS**, **express-rate-limit**.
  * Validación: **Zod** para todos los DTOs y esquemas de entrada.
  * Ingesta multipart: **Multer** para carga de ficheros `.json` / `.jsonl`.
* **Frontend:**
  * **React 18+** SPA con **Vite** y **TypeScript**.
  * Estilos: **TailwindCSS** utilitario (diseño profesional, limpio, paletas modernas, sin CSS arbitrario desordenado).
  * Gráficos analíticos: **Recharts**.
  * Iconos: **Lucide React**.
  * Estado y cliente HTTP: **Axios** con interceptores JWT, **Zustand** o **React Query** para estado servidor.
* **Testing:**
  * Unitarios y servicios: **Vitest** (especialmente para `AggregationEngine` y `CostCalculatorService`).
  * Integración HTTP: **Supertest** + **Vitest**.
  * End-to-End: **Playwright** (camino feliz: Login ➔ Dashboard ➔ Drill-Down ➔ Detalle de Agente).

---

## 3. Convenciones de Arquitectura y Código

### 3.1. Backend (Clean Architecture)
* **Controllers (`/src/controllers`):** Delgados (*thin controllers*). Únicamente reciben la `Request`, validan con el schema de `Zod`, invocan al servicio correspondiente y formatean la `Response` HTTP con el código de estado adecuado (200, 201, 400, 401, 404, 500).
* **Services (`/src/services`):** Contienen toda la lógica de negocio, cálculos financieros y reglas de agregación. No deben manipular objetos `req` ni `res` de Express.
* **Repositories (`/src/repositories`):** Único punto de contacto con `prismaClient`. Encapsulan las queries SQL y agregaciones relacionales.
* **Cálculo Financiero:** Los costes monetarios deben manejarse siempre con tipos numéricos de alta precisión (`Decimal` en Prisma y base de datos, nunca floats que introduzcan errores de redondeo).
  $$\text{cost\_usd} = \left(\text{prompt\_tokens} \times \frac{\text{prompt\_price\_per\_1k}}{1000}\right) + \left(\text{completion\_tokens} \times \frac{\text{completion\_price\_per\_1k}}{1000}\right)$$

### 3.2. Formato de Ingesta y Resolución de Identidad
* Los logs de LLMs no traen `user_id` ni `agent_id` nativos. El estándar de AIFinOps espera el formato:
  ```json
  {
    "agentId": "agent_cm4918239",
    "userEmail": "dev.user@acme.com",
    "environment": "PRO",
    "provider": "OPENAI",
    "model": "gpt-4o",
    "promptTokens": 1250,
    "completionTokens": 430,
    "latencyMs": 850,
    "status": "SUCCESS",
    "executedAt": "2026-10-15T10:15:30Z"
  }
  ```
* En caso de recibir solo `userEmail`, el servicio de ingesta resuelve el `user_id` consultando la base de datos.
* Los estados de ejecución permitidos en todo el sistema son estrictamente:
  `SUCCESS` | `ERROR` | `TIMEOUT` | `RATE_LIMIT_EXCEEDED`

### 3.3. Base de Datos y Migraciones
* Toda modificación en el modelo de datos debe realizarse en `backend/prisma/schema.prisma`.
* Tras modificar el esquema, ejecutar siempre:
  ```bash
  npx prisma migrate dev --name <descripcion_cambio>
  ```
* Mantener siempre actualizado el script de datos semilla `seed.ts` con tarifas vigentes en `ModelPrice` y datos relacionales consistentes.

---

## 4. Guía de Generación de Tests Asistida por IA

Cuando se solicite a la IA generar tests para una funcionalidad:
1. **Tests guiados por Gherkin:** Tomar los escenarios descritos en las Historias de Usuario (`HU-01`, `HU-02`, `HU-03`) como especificación formal para estructurar los bloques `describe` e `it`.
2. **Motor de Agregación (`AggregationEngine`):**
   * Validar sumatorios en cascada: $\sum \text{Users} = \text{Department}$ y $\sum \text{Departments} = \text{Organization}$.
   * Comprobar que los filtros por entorno excluyen rigurosamente las llamadas de otros entornos.
3. **Mocks y Aislamiento:** En tests unitarios, mockear el cliente Prisma para probar la lógica de cálculo financiero de forma instantánea y determinista.

---

## 5. Flujo Git y Criterios de Pull Request

* Seguir Git Flow simplificado: ramas de feature (`feature/<nombre>`), rama de integración (`develop`) y rama de producción (`main`).
* Formato de commits convencionales: `feat(...)`, `fix(...)`, `test(...)`, `docs(...)`, `refactor(...)`.
* Al redactar o revisar una Pull Request con IA:
  * Presentar los criterios de aceptación y DoD como una lista verificable.
  * No declarar tests en verde ni métricas de rendimiento en pasado hasta que el código haya sido ejecutado y validado en el entorno local o CI.
