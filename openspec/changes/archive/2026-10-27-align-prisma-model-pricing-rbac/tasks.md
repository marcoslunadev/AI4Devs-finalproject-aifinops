## 1. Actualización de Base de Datos y Prisma ORM

- [x] 1.1 Modificar `backend/prisma/schema.prisma` incorporando los modelos `ModelPrice`, `AiAgent`, el enum `Role` (`ADMIN`, `FINOPS_VIEWER`), extensión de `User` (`role`, `passwordHash`) y renombrado de `IngestionAuditLog` a `IngestionBatch` con sus campos completos.
- [x] 1.2 Extender el modelo `ExecutionLog` en Prisma con campos de entorno (`environment`), métricas de tokens (`promptTokens`, `completionTokens`, `totalTokens`), latencia (`latencyMs`), estado (`status`), claves foráneas e índices de agregación.
- [x] 1.3 Generar y aplicar la migración de base de datos ejecutando `npx prisma migrate dev --name align_model_pricing_rbac`.
- [x] 1.4 Actualizar `backend/prisma/seed.ts` con tarifas vigentes de modelos (OpenAI, Anthropic, Gemini), usuarios semilla con bcrypt y datos jerárquicos realistas.

## 2. Repositorios y Servicios de Negocio (Backend)

- [x] 2.1 Crear `ModelPriceRepository` y `AgentRepository` para consulta de tarifas vigentes y fichas técnicas de agentes.
- [x] 2.2 Implementar `CostCalculatorService` con cálculo determinista de costes por llamada de IA utilizando `Prisma.Decimal`.
- [x] 2.3 Refactorizar `IngestionService` para soportar resolución de identidad corporativa (`userEmail` y `agentId`), cálculo automático de coste y trazabilidad transaccional en `IngestionBatch`.
- [x] 2.4 Actualizar `AuthService` y middleware de autenticación/RBAC para validar contraseñas con bcrypt y firmar JWT con rol asignado (`ADMIN`, `FINOPS_VIEWER`).

## 3. Pruebas Unitarias y de Integración (Vitest)

- [x] 3.1 Implementar tests unitarios para `CostCalculatorService.test.ts` verificando la fórmula de tarificación y ausencia de errores de coma flotante.
- [x] 3.2 Implementar tests unitarios para `AggregationEngine.test.ts` comprobando sumatorios en cascada ($\sum Users = Dept$ y $\sum Depts = Org$) y aislamiento de entornos (DEV/PRE/PRO).
- [x] 3.3 Implementar tests de integración con Supertest para autenticación (`POST /api/v1/auth/login`), ingesta multipart y detalle de agente (`GET /api/v1/agents/:agentId`).

## 4. Validación Final

- [x] 4.1 Ejecutar la suite completa de tests backend (`npm test` / `vitest run`) asegurando 100% de tests en verde.
- [x] 4.2 Validar que la base de datos PostgreSQL local en Docker se inicializa correctamente con `npx prisma db seed`.
