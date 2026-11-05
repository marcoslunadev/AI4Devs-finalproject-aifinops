# AIFinOps — Plataforma de Observabilidad, Gobernanza y FinOps de IA

## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests y Validación](#7-registro-y-validación-de-pull-requests-roadmap-y-métricas-reales-verificadas)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**
Marcos Luna Rodríguez

### **0.2. Nombre del proyecto:**
AIFinOps

### **0.3. Descripción breve del proyecto:**
AIFinOps es una plataforma integral de observabilidad, gobernanza y FinOps de Inteligencia Artificial diseñada para monitorizar, auditar y optimizar el consumo de modelos y agentes de IA (OpenAI, Google Gemini, Anthropic, etc.) a nivel de organizaciones, departamentos y usuarios, ofreciendo visibilidad multidimensional filtrable por entornos (DEV, PRE y PRO).

### **0.4. Evidencia de funcionamiento y URLs de Despliegue:**
* **Frontend SPA (Vercel CDN):** [https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app/](https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app/)
* **Backend API REST (Render):** [https://aifinops-backend.onrender.com/api/v1](https://aifinops-backend.onrender.com/api/v1) *(Nota: en plan gratuito el backend entra en reposo y puede tardar ~30s en reactivarse en la primera petición)*
* **Base de datos Cloud:** PostgreSQL 16 alojada en Neon Serverless.

### **0.5. URL del Repositorio de Entrega:**
* **Repositorio de Código y Documentación:** `https://github.com/marcoslunadev/AI4Devs-finalproject-aifinops`
* **Rama Definitiva de Entrega:** `final-project-MDLR`

### **0.6. Credenciales de Prueba (Demo / Test Credentials):**
Para acceder a la plataforma tanto en la versión desplegada como en local, utiliza las siguientes cuentas sembradas de forma determinista:

| Rol de Acceso | Email / Login | Contraseña | Capacidades y Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador (`ADMIN`)** | `admin@aifinops.com` *(o usuario `admin`)* | `Admin_M4rc0s` | Acceso completo: KPIs ejecutivos, filtros DEV/PRE/PRO, detalle de agentes y **subida/ingesta multipart de archivos de telemetría**. |
| **Visor FinOps (`FINOPS_VIEWER`)** | `viewer@aifinops.com` *(o usuario `viewer`)* | `Viewer_M4rc0s` | Acceso de auditoría: Dashboard de métricas a 90 días, matriz colapsable Drill-Down (*Org ➔ Dept ➔ User*) y ficha técnica de agente. |

### **0.7. Verificación de la Suite de Tests Automatizados (62 Tests Pasando - 100% Éxito):**
El proyecto cuenta con una batería integral de 62 pruebas que cubren cálculo financiero determinista, agregaciones relacionales, contratos HTTP y el flujo completo de navegación e interactividad del frontend:

```bash
# Ejecutar toda la batería de tests (Backend + Frontend) desde la raíz:
npm test

# O ejecutar por componente:
npm run test:backend   # 49 tests (unitarios + integración HTTP con Supertest)
npm run test:frontend  # 13 tests (componentes, rutas protegidas y Happy Path E2E)
```


---

## 1. Descripción general del producto

### **1.1. Objetivo:**
En la actualidad, las empresas se enfrentan a un crecimiento exponencial y descontrolado en el uso de modelos fundacionales y agentes autónomos de Inteligencia Artificial (OpenAI, Google Gemini, Claude, etc.). Esta situación genera problemas críticos como el *Shadow AI*, facturas impredecibles de proveedores, falta de atribución de costes por centros de responsabilidad y ausencia de métricas de rendimiento y adopción.

**Propósito y Valor:**
AIFinOps centraliza la telemetría, auditoría y control financiero del consumo de IA en la empresa, transformando datos crudos de ejecución en información estratégica.

**¿Qué soluciona?**
* **Falta de visibilidad:** Desconocimiento de qué agentes, departamentos o usuarios generan el gasto.
* **Control presupuestario (FinOps):** Permite calcular el coste unitario por ejecución, token y departamento.
* **Gobierno y Auditoría:** Supervisión de latencias, tasas de error y cumplimiento de entornos (DEV, PRE, PRO).
* **Toma de decisiones:** Proporciona a los roles directivos información en tiempo casi real para justificar el ROI y planificar inversiones en IA.

**Público Objetivo:**
* **C-Level & Directivos (CIO, CTO, CFO):** Visualización de KPIs ejecutivos globales, tendencias a 90 días y distribución presupuestaria.
* **Gestores de Innovación & Heads of AI:** Monitorización del catálogo de agentes, adopción por departamentos y rendimiento técnico.
* **Líderes de Departamento (Managers):** Control del consumo y ejecuciones de los usuarios bajo su responsabilidad.

---

### **1.2. Características y funcionalidades principales:**

#### **1.2.1. Alcance Acotado del MVP (Camino Feliz - Entrega del Máster):**
Para garantizar la viabilidad y máxima robustez en el tiempo de entrega del máster, el alcance del MVP se focaliza en un **camino feliz** de alto impacto:

1. **Ingesta y Normalización de Logs de IA (Data Ingestion Engine):**
   * **Formato Único Estándar (JSON / JSONL):** Procesamiento y validación estricta de ficheros de telemetría estructurados.
   * **Cálculo Financiero Automatizado:** Normalización de tokens (Input/Prompt, Output/Completion) y cálculo monetario exacto del coste (`cost_usd`) aplicando la tabla de precios versionada por modelo y proveedor (`ModelPrice`).
   * **Auditoría de Ingesta:** Registro transaccional del lote (`IngestionBatch`) con métricas de eventos procesados y fallidos.

2. **Dashboard Ejecutivo con KPIs Globales (Ventana de 90 días / Rango dinámico):**
   * Panel superior con métricas consolidadas:
     * **Total de Agentes de IA Activos** (nuevos vs acumulados).
     * **Volumen Total de Tokens** (desglose Input / Output).
     * **Coste Total Acumulado ($/€)** con comparativa de tendencia.
     * **Coste Medio por Ejecución** (Unit Economics de IA).
     * **Mix de Proveedores / Modelos** (distribución porcentual de cuota de uso).
     * **Tasa de Éxito / SLA** (% de llamadas `SUCCESS` vs incidencias).

3. **Matriz Jerárquica Drill-Down (Organización ➔ Departamento ➔ Usuario):**
   * Tabla analítica interactiva con agregación matemática en cascada: la suma de usuarios conforma el total del departamento, y la suma de departamentos conforma el total de la organización.
   * Filtros dinámicos multidimensionales: selector de rango temporal y filtro de entorno (**DEV**, **PRE**, **PRO**, **TODOS**).
   * Despliegue en acordeón interactivo (*Organización ➔ Departamento ➔ Usuario*).

4. **Explorador de Auditoría Granular (Vista de Detalle de Agente):**
   * **Ficha Técnica de Agente (`AgentDetailView`):** Vista especializada para auditar el inventario de agentes, versiones, cuotas de uso y el histórico cronológico paginado de ejecuciones (timestamp, usuario invocador, modelo, tokens, coste, latencia y estado).

5. **Control de Acceso Simplificado (RBAC Core):**
   * Autenticación segura mediante **JWT** con 2 roles operativos clave en el MVP:
     * `ADMIN`: Acceso completo a métricas, subida e ingesta de ficheros de telemetría y administración.
     * `FINOPS_VIEWER`: Acceso de lectura ejecutiva al Dashboard, tabla jerárquica y filtros de entorno.

6. **Datos Semilla Realistas (`seed.ts`):**
   * Generación determinista de organizaciones, departamentos, usuarios, agentes y telemetría histórica con patrones de consumo realistas para que el dashboard y los sumatorios tengan significado inmediato.

#### **1.2.2. Roadmap y Funcionalidades para Versión 2 (Post-MVP):**
* Ingesta de ficheros en formato plano `CSV`.
* Ampliación del modelo RBAC a 4 roles (`SUPER_ADMIN` multi-tenant y `AUDITOR` de cumplimiento normativo).
* Integración de webhooks con gestores externos de incidencias y ticketing (Jira / Slack / PagerDuty).
* Vistas de detalle dedicadas e independientes para Organización y Departamento (en MVP se exploran dentro de la jerarquía drill-down).
* Conector en streaming directo con proxies empresariales (Cloudflare AI Gateway / LiteLLM).

---

### **1.3. Estrategia de Ingesta y Resolución de Identidad (Mapeo de Logs Reales):**

Un log nativo directo de proveedores como OpenAI o Google Gemini contiene parámetros técnicos (modelo, tokens, timestamp, id de petición), pero **carece de identificadores organizativos** (`user_id`, `department_id` o `agent_id`). Para resolver esta brecha y dotar de coherencia total al sistema, AIFinOps establece la siguiente estrategia:

```
[ Petición de IA en la Empresa ]
             │
             ▼
[ Wrapper SDK / AI Gateway Corporativo ]
(Inyecta metadatos: x-agent-id, x-user-email, environment)
             │
             ▼
[ Fichero de Telemetría JSON/JSONL ]
             │
             ▼
[ Ingestion Engine de AIFinOps ]
  ├─ 1. Valida esquema del evento con Zod.
  ├─ 2. Resuelve user_id a partir del email (o ID) contra la BBDD (datos semilla/reales).
  ├─ 3. Resuelve agent_id a partir del catálogo de agentes registrados.
  ├─ 4. Consulta tabla MODEL_PRICE para calcular coste exacto en USD.
  └─ 5. Inserta transacción atómica en EXECUTION_LOG vinculada al INGESTION_BATCH.
```

1. **Formato Estándar de Evento AIFinOps:**
   Cada evento en el fichero JSON/JSONL incluye la información técnica del LLM junto con las etiquetas de atribución corporativa (`agentId`, `userEmail` o `userId`, `environment`).
2. **Mapeo Automático en Ingesta:**
   El motor de ingesta busca el `userEmail` en la tabla `User`. Si no se especifica usuario o agente, el sistema lo mapea automáticamente al usuario por defecto del departamento o al agente asignado por defecto a la organización, evitando pérdidas de datos.
3. **Mecanismo de Subida (Frontend ➔ API):**
   El modal de subida en el Frontend envía el archivo mediante **`multipart/form-data`** al endpoint `POST /api/v1/ingestion/logs`. El backend procesa el fichero en streaming/batch para un consumo eficiente de memoria.

---

### **1.4. Diseño y experiencia de usuario:**

La experiencia de usuario está optimizada para ofrecer una navegación fluida, profesional y orientada al análisis de datos sin sobrecarga cognitiva:

```
+---------------------------------------------------------------------------------------+
|  [Logo AIFinOps]   Organización: [Acme Corp v]   Entorno: [TODOS | DEV | PRE | PRO]   |
+---------------------------------------------------------------------------------------+
|  KPIs GLOBALES (Últimos 90 días):                                                     |
|  +----------------+ +----------------+ +----------------+ +------------------------+  |
|  | Agentes Activos| | Tokens Totales | | Coste Total    | | Coste Medio/Ejecución  |  |
|  |     24 (+3)    | |  145.8M tokens | |   $ 1,420.50   | |       $ 0.0042         |  |
|  +----------------+ +----------------+ +----------------+ +------------------------+  |
+---------------------------------------------------------------------------------------+
|  TABLA JERÁRQUICA DE CONSUMO (Drill-Down Matrix)             [Rango: Últimos 30 días v]
|                                                                                       |
|  Entidad / Jerarquía             | Agentes Nuevos | Ejecuciones | Tokens       | Coste |
|  --------------------------------+----------------+-------------+--------------+-------|
|  [-] Acme Corp (Organización)    |       8        |   345,210   | 145,800,000  | $1,420|
|     [-] Ingeniería (Dept)        |       5        |   280,000   | 112,000,000  | $1,100|
|        - Juan Pérez (User - PRO) |       2        |   150,000   |  65,000,000  | $ 620 |
|        - Ana Gómez (User - DEV)  |       3        |   130,000   |  47,000,000  | $ 480 |
|     [+] Marketing (Dept)         |       3        |    65,210   |  33,800,000  | $ 320 |
+---------------------------------------------------------------------------------------+
```

**Flujo de Navegación del Usuario:**
1. **Acceso:** Login con credenciales seguras y redirección según rol (`ADMIN` o `FINOPS_VIEWER`).
2. **Dashboard Central:** Vista ejecutiva de KPIs y tabla jerárquica con filtros de entorno aplicables en tiempo real.
3. **Exploración Jerárquica:** El usuario despliega la fila de su organización o departamento para identificar picos de consumo o anomalías.
4. **Inspección Profunda:** Al hacer clic en un agente en la tabla, el sistema abre la vista de detalle de agente (`AgentDetailView`) con gráficos temporales y el histórico cronológico de ejecuciones.
5. **Módulo de Ingesta:** Modal drag-and-drop para subir nuevos ficheros JSON/JSONL con validación y previsualización de datos.

---

### **1.5. Instrucciones de instalación:**

El proyecto está diseñado para levantarse localmente de forma rápida y reproducible utilizando **Docker Compose** para la base de datos y scripts de desarrollo para frontend y backend.

#### **Requisitos previos:**
* Node.js v22+ (LTS) y npm v10+
* Docker Desktop o Docker Engine con Docker Compose v2+
* Git

#### **Paso 1: Clonar el repositorio**
```bash
git clone https://github.com/marcoslunadev/AI4Devs-finalproject-aifinops.git
cd AI4Devs-finalproject-aifinops
```

#### **Paso 2: Configurar las variables de entorno**
Copiar el archivo de ejemplo para la raíz, backend y frontend:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Contenido configurado en `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://aifinops:password@localhost:5432/aifinops_db?schema=public"
JWT_SECRET="super_secret_jwt_key_aifinops_master_2026"
VITE_API_URL="http://localhost:3000/api/v1"
```

#### **Paso 3: Levantar la base de datos PostgreSQL con Docker Compose**
```bash
docker compose up -d
```
> Esto levantará un contenedor de **PostgreSQL 16** en el puerto `5432` con volumen persistente (`pgdata`).

#### **Paso 4: Instalar dependencias y ejecutar migraciones de BBDD**
```bash
# 1. Instalar dependencias en backend y frontend
cd backend && npm install
cd ../frontend && npm install
cd ..

# 2. Generar cliente de Prisma y aplicar migraciones
cd backend
npx prisma migrate dev --name init

# 3. Poblar la base de datos con datos semilla (organizaciones, departamentos, usuarios, agentes, tarifas ModelPrice y 700 logs a 90 días)
npx prisma db seed
cd ..
```

#### **Paso 5: Ejecutar la Suite de Tests Automatizados (58 Tests)**
```bash
# Ejecutar todos los tests (backend + frontend) desde la raíz:
npm test

# O individualmente:
npm run test:backend   # 49 tests de backend (unitarios + integración HTTP con Supertest)
npm run test:frontend  # 9 tests de frontend (componentes y navegación con Vitest)
```

#### **Paso 6: Iniciar los servidores de desarrollo**
Puedes arrancarlos desde la raíz con los scripts unificados o en terminales separadas:

* **Desde la raíz:**
  * Terminal 1 (Backend): `npm run dev:backend` (en `http://localhost:3000`)
  * Terminal 2 (Frontend): `npm run dev:frontend` (en `http://localhost:5173`)

* **O accediendo a cada directorio:**
  * Terminal 1: `cd backend && npm run dev`
  * Terminal 2: `cd frontend && npm run dev`


---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

```mermaid
flowchart TB
    subgraph ClientLayer ["Capa de Presentación (Frontend SPA)"]
        UI["React 18 + Vite + TypeScript"]
        Router["React Router DOM"]
        State["Zustand / React Query"]
        Tailwind["TailwindCSS + Lucide + Recharts"]
    end

    subgraph Security ["Seguridad y Middleware"]
        CORS["CORS & Helmet"]
        AuthMid["JWT Auth & RBAC Middleware"]
        RateLimit["Express Rate Limiter"]
    end

    subgraph APILayer ["Capa de Backend (Node.js + Express API)"]
        RouterAPI["Express REST Router"]
        
        subgraph Controllers ["Controladores"]
        AuthController["Auth Controller"]
        MetricsController["Metrics & Dashboard Controller"]
        AgentController["Agent & Traceability Controller"]
        IngestionController["Log Ingestion Controller"]
        end

        subgraph Services ["Capa de Negocio / Dominio"]
        AuthService["Auth Service (Bcrypt + JWT)"]
        AggregationService["Aggregation Engine (Hierarchical Rollup)"]
        AgentService["Agent Catalog Service"]
        IngestionParser["Log Parser & Normalizer (Zod Schema)"]
        end

        subgraph Repositories ["Capa de Acceso a Datos"]
        PrismaClient["Prisma ORM Client"]
        end
    end

    subgraph DataLayer ["Capa de Persistencia & Infraestructura"]
        subgraph DockerCompose ["Docker Container: PostgreSQL 16"]
            PGMaster[("PostgreSQL DB
(Relacional + JSONB + BRIN Indexes)")]
            Volume[("Persistent Docker Volume
(postgres_data)")]
        end
    end

    subgraph ExternalSources ["Fuentes Externas de Telemetría"]
        LogsJSON["Ficheros Logs JSON / JSONL / CSV"]
        OpenAI["OpenAI Telemetry Events"]
        Gemini["Google Gemini Events"]
    end

    %% Conexiones
    UI --> Router --> State --> Tailwind
    State -->|HTTP / JSON Requests| Security
    Security --> CORS --> AuthMid --> RateLimit --> RouterAPI
    
    RouterAPI --> AuthController --> AuthService --> PrismaClient
    RouterAPI --> MetricsController --> AggregationService --> PrismaClient
    RouterAPI --> AgentController --> AgentService --> PrismaClient
    RouterAPI --> IngestionController --> IngestionParser --> PrismaClient

    ExternalSources -->|Upload / Batch| IngestionController
    PrismaClient -->|SQL Connection Pool| PGMaster
    PGMaster --- Volume
```

#### **Justificación Arquitectónica:**
* **Patrón de Arquitectura Limpia por Capas (Clean Architecture):** Se desacoplan la capa de presentación (controladores HTTP), la lógica de negocio (servicios y motores de agregación) y la persistencia (Prisma Repositories). Esto permite testear la lógica de cálculo financiero de forma aislada.
* **Separación Frontend/Backend:** La SPA en React garantiza una experiencia de usuario interactiva y fluida para el drill-down colapsable sin recargas de página, consumiendo una API REST tipada de alto rendimiento.
* **PostgreSQL contenerizado con Docker Compose:** Proporciona un entorno de desarrollo aislado, determinista y listo para replicar en entornos de testing e integración continua (CI).

#### **Beneficios y Trade-offs:**
* **Beneficios:**
  * **Consistencia e integridad:** Estricta integridad referencial para la jerarquía *Organización ➔ Departamento ➔ Usuario*.
  * **Potencia analítica en SQL:** Agregaciones complejas con `GROUP BY`, `SUM` y filtros de series temporales directamente en el motor de base de datos.
  * **Flexibilidad con JSONB:** Permite almacenar metadatos heterogéneos de diferentes proveedores de LLM sin alterar el esquema.
* **Sacrificios / Déficits identificados:**
  * Para volúmenes extremos (cientos de millones de ejecuciones diarias), una base de datos relacional pura requeriría una estrategia de particionado temporal o la delegación de métricas de telemetría a un almacén columnar como ClickHouse/TimescaleDB. Para el alcance del proyecto y MVP, PostgreSQL con índices adecuados cubre sobradamente el rendimiento requerido.

---

### **2.2. Descripción de componentes principales:**

1. **Frontend Client (React + Vite + TypeScript):**
   * Gestiona el estado de la aplicación, el renderizado de gráficos analíticos (Recharts) y la interacción de la tabla jerárquica con acordeón multinivel.
2. **API Gateway & Router (Express + TypeScript):**
   * Punto de entrada de las peticiones HTTP, validación de esquemas de entrada con Zod, control de cabeceras de seguridad con Helmet y gestión de CORS.
3. **Ingestion Engine & Parser:**
   * Módulo encargado de recibir ficheros de logs en formato batch, validar la estructura de eventos de IA, normalizar costes/tokens según la tabla de precios del modelo y persistirlos transaccionalmente.
4. **Aggregation & Metrics Engine:**
   * Motor de cálculo que ejecuta consultas optimizadas de agregación en cascada para calcular KPIs globales y desgloses por Organización, Departamento, Usuario y Entorno (DEV, PRE, PRO).
5. **Prisma ORM & PostgreSQL Database:**
   * Capa de persistencia tipada que maneja modelos, migraciones y ejecución de consultas sobre el contenedor PostgreSQL.

#### **2.2.1. Sistema de Diseño e Identidad Visual (Look & Feel):**
* **Tokens y Paleta de Color:**
  * **Modo Oscuro:** Fondo base en Obsidian Deep (`#080b11`), superficies de tarjetas y tablas en Slate Obsidian (`#0f1420`), superficies elevadas e inputs en `#171e2e` con bordes sutiles `border-white/10`.
  * **Modo Claro:** Fondo base en Slate 50 (`#f8fafc`), superficies de tarjetas y tablas en blanco puro (`#ffffff`) con bordes `slate-200`.
  * **Acentos:** Cian (`#06b6d4` / `#0891b2`) para interactividad y curvas analíticas; Esmeralda (`#10b981` / `#059669`) para métricas de coste y cumplimiento presupuestario; y gradiente insignia `linear-gradient(135deg, #06b6d4 0%, #10b981 100%)`.
* **Jerarquía Tipográfica (Google Fonts):**
  * `Outfit` (`font-heading`): Títulos de vistas, encabezados ejecutivos y nombres de sección.
  * `Inter` (`font-sans`): Textos descriptivos, botones de acción y celdas de tabla.
  * `JetBrains Mono` (`font-mono`): Importes en USD, volúmenes de tokens, latencias y códigos.
* **Identidad Visual y Theming:**
  * Emblema tecnológico CPU estilizado en contenedor squircle con gradiente cian-esmeralda en Header y Login.
  * Favicon SVG corporativo adaptado con trazados en cian y esmeralda.
  * Inicialización anti-FOUC en `index.html` para conmutación inmediata de tema sin parpadeos.

---

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros:**

El proyecto sigue una estructura limpia y modular organizada como monorepo:

```
AI4Devs-finalproject/
├── docker/
│   └── docker-compose.yml        # Definición del contenedor PostgreSQL y volúmenes
├── backend/
│   ├── src/
│   │   ├── config/               # Variables de entorno y configuración
│   │   ├── controllers/          # Manejadores de rutas HTTP (Auth, Metrics, Ingestion, Agents)
│   │   ├── services/             # Lógica de negocio (Agregación, Ingesta, Auditoría, Precios)
│   │   ├── repositories/         # Consultas de acceso a datos y agregaciones Prisma
│   │   ├── middlewares/          # Auth JWT, RBAC, validación Zod, Error Handler
│   │   ├── schemas/              # Esquemas de validación Zod (DTOs)
│   │   ├── types/                # Tipos e interfaces TypeScript
│   │   └── app.ts                # Inicialización de Express y middlewares
│   ├── prisma/
│   │   ├── schema.prisma         # Esquema de base de datos relacional
│   │   ├── migrations/           # Historial de migraciones SQL
│   │   └── seed.ts               # Semilla con datos de prueba realistas
│   ├── tests/                    # Tests unitarios y de integración (Vitest + Supertest)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── assets/               # Recursos estáticos e iconos
│   │   ├── components/           # Componentes UI reutilizables (KPI Cards, Tables, Charts, Modals)
│   │   ├── pages/                # Vistas principales (Dashboard, AgentDetail, Traceability, Login)
│   │   ├── hooks/                # Custom React Hooks para fetching y filtros
│   │   ├── services/             # Cliente API (Axios / Fetch)
│   │   ├── types/                # Definiciones de tipos para frontend
│   │   ├── App.tsx               # Enrutamiento principal
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── prompts.md                    # Registro de interacción y prompts de IA
├── readme.md                     # Documentación técnica del proyecto
└── .env.example                  # Plantilla de variables de entorno
```

---

### **2.4. Infraestructura y despliegue:**

```mermaid
flowchart LR
    subgraph LocalDev ["Entorno de Desarrollo Local"]
        DevFE["Vite Dev Server (Port 5173)"]
        DevBE["Express Server (Port 3000)"]
        DevDB["Docker Compose: Postgres 16 (Port 5432)"]
        DevFE --> DevBE --> DevDB
    end

    subgraph CloudProd ["Entorno de Producción (Entrega 3)"]
        ProdFE["Frontend: Vercel / Netlify (CDN Edge)"]
        ProdBE["Backend: Render / Railway (Node.js Container)"]
        ProdDB[("Cloud PostgreSQL: Neon / Supabase / Railway")]
        ProdFE -->|HTTPS API Requests| ProdBE -->|SSL Connection Pool| ProdDB
    end
```

* **Local:** Contenedor Docker para PostgreSQL con persistencia en volumen `postgres_data`. Hot-reloading en Frontend (Vite) y Backend (tsx/nodemon).
* **Producción (Entrega 3):**
  * Frontend: Despliegue estático continuo en Vercel con integración a GitHub.
  * Backend: Contenedor en Railway / Render con pipelines automáticos de CI/CD.
  * Base de Datos: PostgreSQL gestionado en la nube (Neon / Supabase / Railway) con backups automáticos y pooling de conexiones.

---

### **2.5. Seguridad:**

1. **Autenticación y Autorización:**
   * Tokens **JWT (JSON Web Tokens)** firmados con algoritmo HMAC-SHA256 y tiempo de expiración configurable.
   * Middleware **RBAC** que valida el rol (`ADMIN`, `FINOPS_VIEWER`) y comprueba los permisos de acceso y subida de telemetría.
2. **Protección de Datos y Contraseñas:**
   * Hashing seguro de contraseñas con **bcrypt** (cost factor 10+).
   * Variables de entorno para secretos (`.env`) excluidas estrictamente de git (`.gitignore`).
3. **Seguridad en la Capa HTTP y API:**
   * **Helmet:** Configuración de cabeceras HTTP seguras (CSP, HSTS, X-Content-Type-Options).
   * **CORS:** Restricción estricta de orígenes permitidos.
   * **Express Rate Limiting:** Protección contra ataques de fuerza bruta y saturación de peticiones en endpoints de autenticación e ingesta.
   * **Validación e Inmunización:** Validación de payloads con **Zod** para prevenir inyecciones y datos corruptos.

---

### **2.6. Tests:**

* **Tests Unitarios (Vitest):** Cobertura exhaustiva de la lógica de cálculo del motor de agregación jerárquica (sumatorios en cascada, cálculo de costes medios y normalización de tokens de proveedores aplicando `ModelPrice`).
* **Tests de Integración (Supertest + Vitest):** Verificación de los endpoints principales de la API (`/api/v1/auth/login`, `/api/v1/ingestion/logs`, `/api/v1/metrics/dashboard`, `/api/v1/agents/{agentId}/executions`), validando códigos de estado HTTP, autenticación JWT y persistencia en una BBDD PostgreSQL de test.
* **Tests End-to-End (Playwright):** Prueba automatizada del flujo crítico: Login ➔ Carga del Dashboard con KPIs ➔ Despliegue del acordeón jerárquico (*Org ➔ Dept ➔ User*) ➔ Filtrado por entorno DEV/PRO.

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

```mermaid
erDiagram
    ORGANIZATION ||--o{ DEPARTMENT : "contiene"
    ORGANIZATION ||--o{ AI_AGENT : "posee"
    DEPARTMENT ||--o{ USER : "emplea"
    USER ||--o{ EXECUTION_LOG : "ejecuta"
    AI_AGENT ||--o{ EXECUTION_LOG : "es_ejecutado"
    INGESTION_BATCH ||--o{ EXECUTION_LOG : "registra"
    USER }|--|| ROLE : "tiene_rol"
    MODEL_PRICE ||--o{ EXECUTION_LOG : "tarifica"

    ORGANIZATION {
        string id PK "cuid/uuid"
        string name "unique, not null"
        string tax_id "cif/nif opcional"
        timestamp created_at
        timestamp updated_at
    }

    DEPARTMENT {
        string id PK "cuid/uuid"
        string organization_id FK "not null"
        string name "not null"
        string code "identificador interno"
        timestamp created_at
    }

    ROLE {
        string id PK
        string code "ADMIN, FINOPS_VIEWER (extensible a AUDITOR, DEPT_MANAGER)"
        string description
    }

    USER {
        string id PK "cuid/uuid"
        string department_id FK "not null"
        string role_id FK "not null"
        string email "unique, not null"
        string password_hash "not null"
        string full_name "not null"
        boolean is_active "default true"
        timestamp created_at
    }

    AI_AGENT {
        string id PK "cuid/uuid"
        string organization_id FK "not null"
        string name "not null"
        string provider "OPENAI, GOOGLE_GEMINI, ANTHROPIC"
        string model_default "gpt-4o, gemini-1.5-pro, etc."
        string version "1.0.0"
        string description
        boolean is_active "default true"
        timestamp created_at
    }

    MODEL_PRICE {
        string id PK "cuid/uuid"
        string provider "OPENAI, GOOGLE_GEMINI, ANTHROPIC"
        string model_name "gpt-4o, gemini-1.5-pro, claude-3-5-sonnet"
        decimal prompt_price_per_1k "numeric(10,6), not null"
        decimal completion_price_per_1k "numeric(10,6), not null"
        timestamp effective_from "not null"
        boolean is_active "default true"
        timestamp created_at
    }

    INGESTION_BATCH {
        string id PK "cuid/uuid"
        string filename "not null"
        string source "FILE_UPLOAD, API_GATEWAY, AGENT_PROXY"
        string status "PENDING, PROCESSED, FAILED, PARTIAL_ERROR"
        int total_records "default 0"
        int processed_records "default 0"
        int failed_records "default 0"
        string uploaded_by_user_id FK "nullable"
        timestamp processed_at
        timestamp created_at
    }

    EXECUTION_LOG {
        string id PK "cuid/uuid"
        string agent_id FK "not null"
        string user_id FK "not null"
        string batch_id FK "nullable"
        string environment "DEV, PRE, PRO (not null)"
        string provider "OPENAI, GOOGLE_GEMINI, etc."
        string model "gpt-4o, gemini-1.5-pro, etc."
        int prompt_tokens "not null, default 0"
        int completion_tokens "not null, default 0"
        int total_tokens "not null, default 0"
        decimal cost_usd "numeric(10,6), not null"
        int latency_ms "not null"
        string status "SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED"
        jsonb metadata "detalles del proveedor y payload"
        timestamp executed_at "not null, indexed"
        timestamp created_at "default now"
    }
```

---

### **3.2. Descripción de entidades principales:**

#### **1. `ORGANIZATION` (Organizaciones)**
* Representa la entidad raíz corporativa.
* **Campos:**
  * `id` (String, PK, CUID/UUID): Identificador único.
  * `name` (String, Not Null, Unique): Nombre comercial de la organización.
  * `tax_id` (String, Nullable): CIF/NIF o identificador fiscal.
  * `created_at` / `updated_at` (Timestamp): Marcas de tiempo de auditoría.

#### **2. `DEPARTMENT` (Departamentos)**
* Unidad organizativa dentro de una organización (ej. *Ingeniería, Marketing, Finanzas, Producto*).
* **Campos:**
  * `id` (String, PK): Identificador único.
  * `organization_id` (String, FK, Not Null): Referencia a `ORGANIZATION.id` (Restricción `ON DELETE CASCADE`).
  * `name` (String, Not Null): Nombre del departamento.
  * `code` (String, Nullable): Código departamental interno (ej. `ENG-01`).

#### **3. `USER` (Usuarios del Sistema)**
* Usuarios que ejecutan agentes o acceden a la plataforma de gestión. Cada usuario pertenece estrictamente a una organización y a un departamento.
* **Campos:**
  * `id` (String, PK): Identificador único.
  * `department_id` (String, FK, Not Null): Referencia a `DEPARTMENT.id`.
  * `role_id` (String, FK, Not Null): Referencia a `ROLE.id`.
  * `email` (String, Not Null, Unique): Correo electrónico para autenticación y mapeo de logs.
  * `password_hash` (String, Not Null): Contraseña cifrada con bcrypt.
  * `full_name` (String, Not Null): Nombre completo del usuario.
  * `is_active` (Boolean, Default True): Estado de la cuenta.

#### **4. `AI_AGENT` (Catálogo de Agentes de IA)**
* Definición de agentes y modelos autónomos dados de alta dentro de la organización.
* **Campos:**
  * `id` (String, PK): Identificador único.
  * `organization_id` (String, FK, Not Null): Organización propietaria del agente.
  * `name` (String, Not Null): Nombre identificativo del agente (ej. *DataAnalyzer-Agent*, *SupportBot-v2*).
  * `provider` (String, Not Null): Proveedor de IA (`OPENAI`, `GOOGLE_GEMINI`, `ANTHROPIC`, `MISTRAL`).
  * `model_default` (String, Not Null): Modelo base (ej. `gpt-4o`, `gemini-1.5-pro`).
  * `version` (String, Default '1.0.0'): Versión del agente.
  * `is_active` (Boolean, Default True): Disponibilidad operativa.

#### **5. `MODEL_PRICE` (Tarifas y Costes Oficiales de Modelos)**
* Catálogo de precios versionados por modelo y proveedor para garantizar cálculos financieros deterministas y auditables sin discrepancias.
* **Campos:**
  * `id` (String, PK, CUID/UUID): Identificador único de la tarifa.
  * `provider` (String, Not Null): Proveedor del modelo (`OPENAI`, `GOOGLE_GEMINI`, `ANTHROPIC`).
  * `model_name` (String, Not Null): Nombre del modelo base (ej. `gpt-4o`, `gemini-1.5-pro`).
  * `prompt_price_per_1k` (Decimal 10,6, Not Null): Precio en USD por cada 1,000 tokens de entrada/prompt.
  * `completion_price_per_1k` (Decimal 10,6, Not Null): Precio en USD por cada 1,000 tokens de salida/completion.
  * `effective_from` (Timestamp, Not Null): Fecha a partir de la cual entra en vigor la tarifa.
  * `is_active` (Boolean, Default True): Indica si es la tarifa activa vigente.
  * `created_at` (Timestamp, Default now): Fecha de registro de la tarifa.
* **Fórmula de cálculo financiero:**
  $$\text{cost\_usd} = \left(\text{prompt\_tokens} \times \frac{\text{prompt\_price\_per\_1k}}{1000}\right) + \left(\text{completion\_tokens} \times \frac{\text{completion\_price\_per\_1k}}{1000}\right)$$

#### **6. `INGESTION_BATCH` (Lotes y Auditoría de Ingesta)**
* Registro de auditoría y trazabilidad de los ficheros de telemetría procesados por el motor de ingesta.
* **Campos:**
  * `id` (String, PK, CUID/UUID): Identificador único del lote.
  * `filename` (String, Not Null): Nombre del fichero original subido (ej. `openai_telemetry_2026_10.json`).
  * `source` (String, Not Null): Canal de entrada (`FILE_UPLOAD`, `API_GATEWAY`, `AGENT_PROXY`).
  * `status` (String, Not Null): Estado del procesamiento (`PENDING`, `PROCESSED`, `FAILED`, `PARTIAL_ERROR`).
  * `total_records` (Int, Default 0): Número total de líneas/eventos leídos en el fichero.
  * `processed_records` (Int, Default 0): Eventos validados, normalizados e insertados con éxito.
  * `failed_records` (Int, Default 0): Eventos descartados por errores de esquema o validación.
  * `error_summary` (JSONB, Nullable): Resumen estructurado de errores y líneas conflictivas para depuración.
  * `uploaded_by_user_id` (String, FK, Nullable): Usuario que ejecutó la subida (`USER.id`).
  * `processed_at` (Timestamp, Nullable): Fecha y hora de finalización del procesamiento.
  * `created_at` (Timestamp, Default now): Fecha y hora de recepción del archivo.

#### **7. `EXECUTION_LOG` (Telemetría de Ejecuciones y Consumo)**
* Registro inmutable de cada invocación o inferencia realizada por un agente. Es la tabla de mayor volumen y base de las consultas analíticas.
* **Campos:**
  * `id` (String, PK): Identificador único de ejecución.
  * `agent_id` (String, FK, Not Null): Agente invocado (`AI_AGENT.id`).
  * `user_id` (String, FK, Not Null): Usuario que originó la petición (`USER.id`).
  * `batch_id` (String, FK, Nullable): Identificador del lote de ingesta origen (`INGESTION_BATCH.id`).
  * `environment` (Enum String, Not Null): Entorno de ejecución (`DEV`, `PRE`, `PRO`).
  * `provider` (String, Not Null): Proveedor utilizado en la llamada.
  * `model` (String, Not Null): Modelo concreto utilizado (ej. `gpt-4o-2024-08-06`).
  * `prompt_tokens` (Int, Not Null): Tokens de entrada/contexto.
  * `completion_tokens` (Int, Not Null): Tokens de salida/generación.
  * `total_tokens` (Int, Not Null): Suma calculada de tokens.
  * `cost_usd` (Decimal 10,6, Not Null): Coste monetario exacto de la ejecución en USD calculado con `MODEL_PRICE`.
  * `latency_ms` (Int, Not Null): Tiempo de respuesta en milisegundos.
  * `status` (Enum String, Not Null): Estado unificado de ejecución (`SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`).
  * `metadata` (JSONB, Nullable): Datos adicionales (temperatura, request_id de proveedor, error stack).
  * `executed_at` (Timestamp, Not Null, Index): Fecha/hora exacta de la llamada.
  * `created_at` (Timestamp, Default now): Fecha de inserción en la plataforma.

---

## 4. Especificación de la API

A continuación se describe la especificación completa en formato **OpenAPI 3.0 (Swagger)**, cubriendo el ciclo completo del MVP (Autenticación, Ingesta multipart/JSON, Dashboard Jerárquico y Detalle de Agente):

```yaml
openapi: 3.0.3
info:
  title: AIFinOps API
  description: API de Observabilidad, Gobernanza y FinOps para monitorización y control de consumo de IA en la empresa.
  version: 1.0.0
servers:
  - url: http://localhost:3000/api/v1
    description: Servidor de desarrollo local

paths:
  /auth/login:
    post:
      summary: Autenticación de usuario y obtención de token JWT
      description: Valida credenciales contra la base de datos (bcrypt) y retorna un token JWT firmado junto con la información del usuario y su rol.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Autenticación exitosa
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          description: Credenciales incorrectas o usuario inactivo

  /auth/me:
    get:
      summary: Obtener perfil del usuario autenticado
      description: Devuelve la información de sesión, rol y jerarquía (organización/departamento) del usuario autenticado.
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Perfil de usuario recuperado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfileResponse'
        '401':
          description: Token no válido o expirado

  /ingestion/logs:
    post:
      summary: Ingesta de fichero o lote de logs de telemetría de IA
      description: Recibe ficheros de telemetría (JSON/JSONL) mediante carga multipart desde el modal del frontend, o un array de eventos JSON directo para integraciones M2M/Gateway. Normaliza tokens, resuelve mapeos de usuario/agente y calcula costes con la tabla MODEL_PRICE.
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
              properties:
                file:
                  type: string
                  format: binary
                  description: Fichero de log en formato .json o .jsonl
                source:
                  type: string
                  default: "FILE_UPLOAD"
                  enum: [FILE_UPLOAD, API_GATEWAY, AGENT_PROXY]
          application/json:
            schema:
              type: object
              required:
                - source
                - events
              properties:
                source:
                  type: string
                  example: "API_GATEWAY"
                filename:
                  type: string
                  example: "openai_telemetry_batch.json"
                events:
                  type: array
                  items:
                    $ref: '#/components/schemas/ExecutionEventInput'
      responses:
        '201':
          description: Lote procesado e insertado correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  batchId:
                    type: string
                    example: "batch_clw98127391283"
                  recordsProcessed:
                    type: integer
                    example: 1500
                  recordsFailed:
                    type: integer
                    example: 0
                  totalCostCalculated:
                    type: number
                    format: float
                    example: 24.8512
        '400':
          description: Error en el formato de archivo o validación de esquemas (Zod)

  /metrics/dashboard:
    get:
      summary: Obtención de KPIs globales y agregaciones jerárquicas (Drill-Down)
      description: Devuelve las métricas consolidadas (últimos 90 días o rango seleccionado) y la matriz jerárquica con sumatorios en cascada (Organización -> Departamento -> Usuario).
      security:
        - BearerAuth: []
      parameters:
        - name: organizationId
          in: query
          required: false
          schema:
            type: string
          description: Filtrar por organización concreta
        - name: environment
          in: query
          required: false
          schema:
            type: string
            enum: [ALL, DEV, PRE, PRO]
            default: ALL
          description: Entorno de ejecución a filtrar
        - name: startDate
          in: query
          required: false
          schema:
            type: string
            format: date
          example: "2026-06-01"
        - name: endDate
          in: query
          required: false
          schema:
            type: string
            format: date
          example: "2026-09-01"
      responses:
        '200':
          description: KPIs globales y árbol jerárquico de consumo
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardMetricsResponse'

  /agents/{agentId}:
    get:
      summary: Ficha técnica y métricas consolidadas de un agente de IA
      description: Retorna la información general del agente, versión, proveedor, modelo por defecto y estadísticas de uso.
      security:
        - BearerAuth: []
      parameters:
        - name: agentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Ficha del agente obtenida exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentDetailResponse'
        '404':
          description: Agente no encontrado

  /agents/{agentId}/executions:
    get:
      summary: Trazabilidad y detalle de ejecuciones de un agente de IA
      description: Obtiene el histórico granular paginado de ejecuciones de un agente específico con métricas de tokens, costes calculados, latencias y estado.
      security:
        - BearerAuth: []
      parameters:
        - name: agentId
          in: path
          required: true
          schema:
            type: string
        - name: environment
          in: query
          required: false
          schema:
            type: string
            enum: [DEV, PRE, PRO]
        - name: status
          in: query
          required: false
          schema:
            type: string
            enum: [SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED]
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            default: 50
        - name: offset
          in: query
          required: false
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Lista paginada de ejecuciones del agente
          content:
            application/json:
              schema:
                type: object
                properties:
                  agentId:
                    type: string
                    example: "agent_cm4918239"
                  agentName:
                    type: string
                    example: "DataAnalyzer-Agent"
                  totalExecutions:
                    type: integer
                    example: 3420
                  items:
                    type: array
                    items:
                      $ref: '#/components/schemas/ExecutionDetailItem'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: "admin@acme.com"
        password:
          type: string
          format: password
          example: "SecurePass2026!"

    LoginResponse:
      type: object
      properties:
        token:
          type: string
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        user:
          $ref: '#/components/schemas/UserProfileResponse'

    UserProfileResponse:
      type: object
      properties:
        id:
          type: string
          example: "usr_10"
        email:
          type: string
          example: "admin@acme.com"
        fullName:
          type: string
          example: "Marcos Luna"
        role:
          type: string
          enum: [ADMIN, FINOPS_VIEWER]
          example: "ADMIN"
        organizationId:
          type: string
          example: "org_1"
        organizationName:
          type: string
          example: "Acme Corp"

    AgentDetailResponse:
      type: object
      properties:
        id:
          type: string
          example: "agent_cm4918239"
        name:
          type: string
          example: "DataAnalyzer-Agent"
        provider:
          type: string
          example: "OPENAI"
        modelDefault:
          type: string
          example: "gpt-4o"
        version:
          type: string
          example: "1.0.0"
        description:
          type: string
          example: "Agente autónomo para análisis predictivo de datos financieros."
        isActive:
          type: boolean
          example: true
        totalExecutions:
          type: integer
          example: 45200
        totalCostUsd:
          type: number
          example: 184.25

    ExecutionEventInput:
      type: object
      required:
        - agentId
        - environment
        - provider
        - model
        - promptTokens
        - completionTokens
        - latencyMs
        - executedAt
      properties:
        agentId:
          type: string
          example: "agent_cm4918239"
        userId:
          type: string
          example: "usr_823941"
        userEmail:
          type: string
          format: email
          example: "dev.user@acme.com"
          description: Permite resolver automáticamente el usuario si no se dispone del userId interno.
        environment:
          type: string
          enum: [DEV, PRE, PRO]
          example: "PRO"
        provider:
          type: string
          example: "OPENAI"
        model:
          type: string
          example: "gpt-4o"
        promptTokens:
          type: integer
          example: 1250
        completionTokens:
          type: integer
          example: 430
        latencyMs:
          type: integer
          example: 850
        status:
          type: string
          enum: [SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED]
          example: "SUCCESS"
        executedAt:
          type: string
          format: date-time
          example: "2026-09-18T10:15:30Z"

    DashboardMetricsResponse:
      type: object
      properties:
        kpis:
          type: object
          properties:
            activeAgents:
              type: integer
              example: 24
            newAgentsInRange:
              type: integer
              example: 5
            totalTokens:
              type: integer
              example: 145800000
            promptTokens:
              type: integer
              example: 98200000
            completionTokens:
              type: integer
              example: 47600000
            totalCostUsd:
              type: number
              format: float
              example: 1420.50
            averageCostPerExecution:
              type: number
              format: float
              example: 0.004115
            successRatePercentage:
              type: number
              example: 99.4
        hierarchy:
          type: array
          items:
            $ref: '#/components/schemas/OrganizationAggregation'

    OrganizationAggregation:
      type: object
      properties:
        organizationId:
          type: string
          example: "org_1"
        organizationName:
          type: string
          example: "Acme Corp"
        newAgentsCount:
          type: integer
          example: 8
        totalExecutions:
          type: integer
          example: 345210
        totalTokens:
          type: integer
          example: 145800000
        totalCostUsd:
          type: number
          example: 1420.50
        departments:
          type: array
          items:
            $ref: '#/components/schemas/DepartmentAggregation'

    DepartmentAggregation:
      type: object
      properties:
        departmentId:
          type: string
          example: "dept_eng"
        departmentName:
          type: string
          example: "Ingeniería"
        newAgentsCount:
          type: integer
          example: 5
        totalExecutions:
          type: integer
          example: 280000
        totalCostUsd:
          type: number
          example: 1100.00
        users:
          type: array
          items:
            $ref: '#/components/schemas/UserAggregation'

    UserAggregation:
      type: object
      properties:
        userId:
          type: string
          example: "usr_10"
        userName:
          type: string
          example: "Juan Pérez"
        environment:
          type: string
          example: "PRO"
        totalExecutions:
          type: integer
          example: 150000
        totalTokens:
          type: integer
          example: 65000000
        totalCostUsd:
          type: number
          example: 620.00

    ExecutionDetailItem:
      type: object
      properties:
        id:
          type: string
          example: "exec_9812401"
        userName:
          type: string
          example: "Ana Gómez"
        departmentName:
          type: string
          example: "Ingeniería"
        environment:
          type: string
          example: "DEV"
        model:
          type: string
          example: "gpt-4o"
        promptTokens:
          type: integer
          example: 2100
        completionTokens:
          type: integer
          example: 650
        costUsd:
          type: number
          example: 0.0084
        latencyMs:
          type: integer
          example: 920
        status:
          type: string
          enum: [SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED]
          example: "SUCCESS"
        executedAt:
          type: string
          format: date-time
          example: "2026-09-18T09:40:12Z"
```

---

## 5. Historias de Usuario

### **Historia de Usuario 1**
* **Identificador:** `HU-01`
* **Título:** Visualización del Dashboard Ejecutivo y Matriz Jerárquica Drill-Down
* **Como:** CIO / Gestor de Innovación de la empresa,
* **Quiero:** Visualizar los KPIs globales de consumo de IA a 90 días y desplegar una tabla en cascada por Organización, Departamento y Usuario con filtros de entorno (DEV, PRE, PRO, TODOS),
* **Para:** Analizar la distribución del gasto de IA por centros de coste, detectar anomalías presupuestarias y tomar decisiones informadas sobre la adopción tecnológica.

**Criterios de Aceptación (Gherkin):**
* **Escenario 1: Carga exitosa de KPIs globales**
  * **Dado que** un usuario autenticado con rol directivo (`ADMIN` o `FINOPS_VIEWER`) accede al Dashboard,
  * **Cuando** la página principal se carga,
  * **Entonces** debe visualizar en el panel superior: Total de agentes activos, Tokens totales (Input/Output), Coste total acumulado en USD, Coste medio por ejecución y Mix de modelos del periodo seleccionado.
* **Escenario 2: Despliegue jerárquico de la tabla (Drill-Down)**
  * **Dado que** el usuario visualiza la fila de su organización con los sumatorios totales,
  * **Cuando** hace clic en el botón de descolapsar (+),
  * **Entonces** se muestran las filas de cada departamento asociado, y la suma de las métricas de los departamentos debe coincidir exactamente con el total de la organización.
  * **Y cuando** hace clic en un departamento, se despliegan sus usuarios individuales con su desglose de consumo por entorno.
* **Escenario 3: Filtro por entorno**
  * **Dado que** el usuario selecciona el filtro de entorno "PRO",
  * **Cuando** se aplica el filtro,
  * **Entonces** todos los KPIs y sumatorios de la tabla jerárquica se recalculan en tiempo real para mostrar únicamente las ejecuciones realizadas en entorno productivo.

---

### **Historia de Usuario 2**
* **Identificador:** `HU-02`
* **Título:** Ingesta y normalización de archivos de logs de telemetría de IA
* **Como:** Administrador del Sistema / Ingeniero de Plataforma,
* **Quiero:** Subir ficheros estructurados (JSON/JSONL) con eventos de telemetría de OpenAI o Google Gemini desde el modal de la aplicación,
* **Para:** Centralizar, validar y normalizar automáticamente los registros de consumo, resolviendo usuarios/agentes y calculando el coste monetario exacto según la tabla de precios.

**Criterios de Aceptación (Gherkin):**
* **Escenario 1: Ingesta de fichero válido**
  * **Dado que** el administrador selecciona un archivo `.json` o `.jsonl` con eventos de telemetría válidos en el modal,
  * **Cuando** envía la solicitud `multipart/form-data` al endpoint `POST /api/v1/ingestion/logs`,
  * **Entonces** el sistema valida los esquemas con Zod, resuelve la asignación de usuario (`userEmail`/`userId`) y agente (`agentId`), calcula el coste monetario con la tabla `MODEL_PRICE`, persiste las ejecuciones vinculadas al lote `INGESTION_BATCH` y retorna un estado `201 Created` con el ID de lote y el número de registros procesados.
* **Escenario 2: Manejo de errores de formato o campos corruptos**
  * **Dado que** el archivo contiene registros con campos obligatorios ausentes (ej. falta `promptTokens` o `model`),
  * **Cuando** se procesa la ingesta,
  * **Entonces** el sistema descarta los registros corruptos registrándolos en `failed_records` y `error_summary`, devuelve un `400 Bad Request` si el lote es inválido y no corrompe los datos previamente existentes.

---

### **Historia de Usuario 3**
* **Identificador:** `HU-03`
* **Título:** Auditoría y trazabilidad granular de ejecuciones por Agente de IA
* **Como:** Responsable de Departamento / Auditor de FinOps,
* **Quiero:** Navegar a la vista de detalle de un agente de IA específico y revisar su ficha técnica e historial cronológico de llamadas,
* **Para:** Auditar el uso adecuado de los modelos, verificar latencias, identificar ejecuciones fallidas o con límites excedidos y supervisar qué usuario realiza cada invocación.

**Criterios de Aceptación (Gherkin):**
* **Escenario 1: Acceso a la vista de detalle de agente**
  * **Dado que** el usuario hace clic sobre el nombre de un agente en el Dashboard,
  * **Cuando** se carga la vista de detalle `AgentDetailView`,
  * **Entonces** se muestra la ficha técnica (proveedor, modelo por defecto, versión, coste acumulado) y una tabla paginada con cada una de sus ejecuciones individuales (timestamp, usuario, entorno, tokens, coste y latencia).
* **Escenario 2: Filtrado por estado de ejecución**
  * **Dado que** el auditor desea revisar anomalías o incidencias en las llamadas del agente,
  * **Cuando** filtra la tabla de ejecuciones por estado "ERROR", "TIMEOUT" o "RATE_LIMIT_EXCEEDED",
  * **Entonces** la tabla muestra únicamente las llamadas fallidas con el código de error, latencia y usuario responsable.

---

## 6. Tickets de Trabajo

### **Ticket 1: Infraestructura de BBDD, Esquema Prisma, Tabla de Precios y Docker Compose**
* **ID:** `TCK-001`
* **Componente:** Base de Datos / Infraestructura
* **Tipo:** Tarea Técnica / Setup
* **Estimación:** 5 Story Points
* **Descripción:**
  Configurar el entorno contenerizado de PostgreSQL 16 utilizando Docker Compose, definir el esquema completo de entidades en `schema.prisma` (incluyendo `ModelPrice` e `IngestionBatch`), crear las migraciones iniciales y desarrollar un script de semillas (`seed.ts`) con datos de prueba realistas para organizaciones, departamentos, usuarios, agentes de IA, tarifas vigentes y telemetría histórica.
* **Dependencias:** Ninguna (Tarea inicial).
* **Tareas a realizar:**
  1. Crear archivo `docker/docker-compose.yml` con el servicio `postgres:16-alpine`, volumen persistente `postgres_data` y variables de entorno.
  2. Inicializar Prisma en el backend (`npx prisma init`).
  3. Definir los modelos en `schema.prisma`: `Organization`, `Department`, `Role`, `User`, `AiAgent`, `ModelPrice`, `IngestionBatch`, `ExecutionLog`.
  4. Configurar índices en `ExecutionLog` (`executed_at`, `agent_id`, `user_id`, `environment`) y campo `metadata` tipo `Json`.
  5. Configurar enum unificado de estado en `ExecutionLog`: `SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`.
  6. Ejecutar migración inicial (`npx prisma migrate dev --name init_schema`).
  7. Escribir script `prisma/seed.ts` con al menos 2 organizaciones, 4 departamentos, 8 usuarios, 6 agentes, tarifas para GPT-4o, Gemini 1.5 Pro y Claude 3.5 Sonnet, y más de 1,000 registros de telemetría distribuidos en entornos DEV, PRE y PRO.
* **Criterios de Aceptación (Definition of Done):**
  * El comando `docker compose up -d` levanta la base de datos sin errores en el puerto 5432.
  * El comando `npx prisma db seed` puebla la base de datos con relaciones coherentes, tarifas activas e integridad referencial demostrable.

---

### **Ticket 2: Autenticación, Motor de Ingesta Multipart y API de Métricas Jerárquicas**
* **ID:** `TCK-002`
* **Componente:** Backend (Node.js + Express + TypeScript)
* **Tipo:** Feature Backend
* **Estimación:** 8 Story Points
* **Descripción:**
  Implementar la arquitectura limpia en el backend, incluyendo la autenticación JWT (`/auth/login`, `/auth/me`), el middleware RBAC (`ADMIN`, `FINOPS_VIEWER`), el motor de ingesta de ficheros de telemetría (JSON/JSONL) con soporte multipart y resolución de identidades (`userEmail` / `agentId`), el cálculo de costes aplicando `ModelPrice` y los endpoints analíticos que calculan los KPIs y la matriz jerárquica agregada.
* **Dependencias:** `TCK-001`.
* **Tareas a realizar:**
  1. Configurar servidor Express con middlewares de seguridad (`cors`, `helmet`, `express-rate-limit`).
  2. Implementar servicio de autenticación con `bcrypt`, verificación de credenciales y generación de JWT en `POST /api/v1/auth/login` y `GET /api/v1/auth/me`.
  3. Crear middleware `authenticateJWT` y `authorizeRoles`.
  4. Desarrollar `IngestionService` con parser de ficheros JSON/JSONL (usando Multer para multipart/form-data), validación Zod, mapeo automático de usuario/agente y cálculo matemático de costes según `ModelPrice`.
  5. Desarrollar `MetricsService` con consultas SQL / Prisma optimizadas que agreguen tokens, costes y ejecuciones agrupadas jerárquicamente (*Org ➔ Dept ➔ User*).
  6. Desarrollar `AgentService` y exponer endpoints:
     * `GET /api/v1/agents/:agentId` (Ficha técnica y métricas agregadas).
     * `GET /api/v1/agents/:agentId/executions` (Listado paginado de llamadas filtrable por entorno y estado).
  7. Escribir tests unitarios con Vitest para el motor de cálculo y tests de integración con Supertest.
* **Criterios de Aceptación (Definition of Done):**
  * Cobertura de tests en la capa de servicios > 80%.
  * Todos los endpoints responden conforme al contrato OpenAPI 3.0 documentado.

---

### **Ticket 3: Dashboard Ejecutivo, Login, Tabla Drill-Down y Detalle de Agente**
* **ID:** `TCK-003`
* **Componente:** Frontend (React + Vite + TypeScript)
* **Tipo:** Feature Frontend
* **Estimación:** 8 Story Points
* **Descripción:**
  Construir la interfaz de usuario en React con TailwindCSS, creando la pantalla de inicio de sesión con JWT, el panel superior de KPIs ejecutivos, la tabla interactiva colapsable (*Organización ➔ Departamento ➔ Usuario*) con sumatorios en cascada, la barra de filtros de entorno (DEV/PRE/PRO), el modal de subida de ficheros de telemetría y la vista de detalle de agente (`AgentDetailView`).
* **Dependencias:** `TCK-002`.
* **Tareas a realizar:**
  1. Inicializar proyecto React con Vite, TypeScript, TailwindCSS y Lucide Icons.
  2. Implementar cliente API con Axios, interceptor de token JWT y vista `LoginPage`.
  3. Crear componente `KpiCard` y gráficos de distribución de modelos con Recharts.
  4. Desarrollar el componente `DrillDownTable` con soporte para expandir/colapsar filas jerárquicas y cálculo reactivo de sumatorios en cascada.
  5. Implementar selector de entorno (`DEV`, `PRE`, `PRO`, `TODOS`) y selector de fechas con recálculo dinámico.
  6. Construir la vista de detalle de agente (`AgentDetailView`) con histórico paginado de ejecuciones y filtros por estado de llamada.
  7. Crear componente `LogUploadModal` con soporte drag-and-drop para subir ficheros `.json`/`.jsonl` mediante multipart.
* **Criterios de Aceptación (Definition of Done):**
  * La interfaz es 100% responsiva y accesible.
  * El despliegue de acordeón es fluido y los sumatorios coinciden matemáticamente en todos los niveles.

---

## 7. Registro y Validación de Pull Requests (Roadmap y Métricas Reales Verificadas)

> **Nota de transparencia metodológica:** En consonancia con la evaluación de la Entrega 1 y los estándares del máster, esta sección registra el estado de desarrollo y los resultados empíricos verificados en los entornos de ejecución (`develop` / `feature/entrega-2-MDLR`). Las métricas de cobertura y pruebas reflejan ejecuciones reales en local/CI.

### **Pull Request 1 (Completada y Verificada)**
* **Título:** `feat(infra): setup docker-compose, prisma schema with model-pricing and realistic seeders`
* **Rama Origen:** `feature/db-docker-prisma-setup` (integrada en `feature/entrega-2-MDLR`) ➔ **Rama Destino:** `develop`
* **Estado:** **Completada y Verificada** (Entrega 2)
* **Alcance de cambios ejecutados:**
  * Configuración de `docker/docker-compose.yml` para servicio PostgreSQL 16 con volumen persistente (`postgres_data`).
  * Definición en `backend/prisma/schema.prisma` de los modelos: `Organization`, `Department`, `Role`, `User`, `AiAgent`, `ModelPrice`, `IngestionBatch`, `ExecutionLog`.
  * Índices relacionales y compuestos para optimización de series temporales y enum unificado de estados (`SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`).
  * Implementación y ejecución de `seed.ts` con catálogo de precios de modelos (`gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet`, `gemini-1.5-pro`) y datos relacionales consistentes para simular consumo corporativo.
* **Criterios de Validación Verificados:**
  * [x] Arranque de contenedor verificado con `docker compose up -d` (PostgreSQL 16 en puerto 5432).
  * [x] Migraciones Prisma ejecutadas exitosamente (`npx prisma migrate dev`).
  * [x] Base de datos poblada de forma determinista con `npx prisma db seed`.

---

### **Pull Request 2 (Completada y Verificada)**
* **Título:** `feat(backend): implement clean architecture, JWT auth, multipart ingestion & metrics API`
* **Rama Origen:** `feature/backend-core-api` (integrada en `feature/entrega-2-MDLR`) ➔ **Rama Destino:** `develop`
* **Estado:** **Completada y Verificada** (Entrega 2)
* **Alcance de cambios ejecutados:**
  * Arquitectura limpia desacoplada: Controllers, Services y Repositories (Prisma) con modo TypeScript estricto (`strict: true`).
  * Autenticación JWT con HMAC-SHA256 (`/auth/login`, `/auth/me`), hash bcrypt y middleware de autorización RBAC (`ADMIN`, `FINOPS_VIEWER`).
  * Pipeline de ingesta multipart (`POST /api/v1/ingestion/logs`) con validación Zod v4, resolución de identidades (`userEmail` ➔ `user_id`, `agentId` ➔ `agent_id`) y cálculo financiero determinista con `ModelPrice`.
  * Motor de agregación jerárquica (`GET /api/v1/metrics/dashboard`) con sumatorios en cascada (*Organización ➔ Departamento ➔ Usuario*) y filtrado estricto por entorno (`DEV`, `PRE`, `PRO`, `TODOS`).
  * Auditoría y trazabilidad granular con endpoints de detalle de agente (`GET /api/v1/agents/:agentId` y `/executions`).
  * Subsanación de 15 errores estrictos de compilación TypeScript y gestión segura de promesas asíncronas para auditoría de lotes (`IngestionBatch`).
* **Criterios de Validación Verificados:**
  * [x] **Compilación TypeScript sin errores:** `npm run build` en `backend/` finaliza con código 0.
  * [x] **Suite de Tests Unitarios y de Integración (Vitest):**
    * **49 de 49 tests ejecutados y pasando (100% de éxito)** en 6 archivos de suite (`CostCalculatorService.test.ts`, `AggregationEngine.test.ts`, `IngestionService.test.ts`, `AuthService.test.ts`, `AgentController.test.ts`, `auth.integration.test.ts`).
    * **Cobertura de código alcanzada:** **89.2% de Statements** y **89.6% de Lines** (superando holgadamente el objetivo del 80%).
  * [x] **Comando de reproducción:** `cd backend && npx vitest run --coverage`.

---

### **Pull Request 3 (Implementada y Verificada en Local)**
* **Título:** `feat(frontend): build executive dashboard, dynamic drill-down table, agent detail view & component test suite`
* **Rama Origen:** `feature/frontend-dashboard-drilldown` (integrada en `feature/entrega-2-MDLR`) ➔ **Rama Destino:** `main`
* **Estado:** **Implementada y Verificada** (Entrega 2/3)
* **Alcance de cambios ejecutados:**
  * Interfaz SPA construida con React 18, Vite y TypeScript con sistema de diseño Obsidian Deep (modo oscuro/claro, tipografías `Outfit`, `Inter` y `JetBrains Mono`).
  * Panel superior de KPIs ejecutivos a 90 días (tokens, costes, agentes activos, SLA).
  * Tabla interactiva colapsable Drill-Down (*Org ➔ Dept ➔ User*) con sumatorios en cascada y soporte de filtrado en tiempo real por entorno (**DEV**, **PRE**, **PRO**, **TODOS**).
  * Ficha técnica y auditoría en `AgentDetailView` con listado de ejecuciones.
  * Modal drag-and-drop para ingesta multipart de logs JSON/JSONL.
  * Configuración de suite de pruebas unitarias y de componentes con **Vitest**, **React Testing Library** y **jsdom** aislada de la compilación de producción mediante `vitest.config.ts`.
* **Criterios de Validación Verificados:**
  * [x] **Compilación y bundle de producción:** `npm run build` en `frontend/` finaliza con código 0 y bundle optimizado en `dist/`.
  * [x] **Suite de Tests de Componentes y Flujo E2E (Vitest + Testing Library):**
    * **13 de 13 tests ejecutados y pasando (100% de éxito)** en 4 archivos de suite (`KpiCard.test.tsx`, `ProtectedRoute.test.tsx`, `DrillDownTable.test.tsx`, `HappyPathFlow.test.tsx`).
  * [x] **Comando de reproducción:** `npm test` o `cd frontend && npm test`.

