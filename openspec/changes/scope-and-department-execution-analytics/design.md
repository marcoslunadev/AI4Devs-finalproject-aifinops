## Context

Actualmente la cabecera (`Header.tsx`) cuenta con un cuadro de búsqueda estático que no está conectado a los filtros de datos. El backend (`backend/src/modules/telemetry`) gestiona la telemetría agregada (`KPIs`, `Chart`, `Breakdown`) pero no expone un catálogo dinámico de organizaciones ni el filtrado por el UUID real de la entidad, ni el desglose agrupado por departamentos.

Consulte `proposal.md` para la motivación general del negocio y la descripción del cambio.

## Goals / Non-Goals

**Goals:**
- Reemplazar el cuadro de búsqueda del Header por `OrganizationScopeSelector.tsx` que cargue dinámicamente las entidades desde `GET /api/v1/telemetry/organizations`.
- Sincronizar la organización seleccionada con la URL mediante `?organizationId=<uuid>` para que todos los widgets del Dashboard (`KPIs`, `Chart`, `Breakdown`) respondan reactivamente.
- Implementar `GET /api/v1/telemetry/department-executions` en el backend agrupando por Organización, Departamento y Modelo LLM (`calls`, `tokens`, `cost`, `latency`).
- Implementar `ExecutionLogsView.tsx` como vista/pestana interactiva de desglose de ejecuciones por entidad/departamento.
- Asegurar cobertura i18n completa en Español e Inglés para todas las etiquetas y textos introducidos.

**Non-Goals:**
- Modificar la estructura física de la base de datos (el esquema de Prisma ya cuenta con los modelos `Organization`, `Department`, `User` y `ExecutionLog`).
- Crear interfaces de administración de altas/bajas de entidades o departamentos (solo lectura analítica).

## Decisions

### 1. Filtrado en Backend a través de Relaciones de Prisma
- **Decisión**: En `TelemetryRepository` y `TelemetryService`, filtrar `ExecutionLog` utilizando la relación `user.department.organizationId` o la asociación directa del usuario con la organización.
- **Razón**: Permite mantener la Clean Architecture sin introducir SQL nativo frágil y garantiza consistencia de datos cuando un log está asociado a un usuario asignado a un departamento y organización.
- **Alternativas consideradas**: Filtrar únicamente por texto/slug. Rechazado porque el usuario requiere filtrado por UUID real para evitar colisiones y mantener integridad referencial.

### 2. Sincronización del Estado de la Organización en el Frontend
- **Decisión**: Utilizar `useSearchParams` de React Router para controlar el estado de `organizationId`. Cuando el usuario cambia la entidad en `OrganizationScopeSelector`, se actualiza el parámetro URL `organizationId`.
- **Razón**: Facilita compartir URLs con el ámbito de la organización pre-filtrado y permite que los hooks de React Query refresquen automáticamente los datos agregados al cambiar la query key.
- **Alternativas consideradas**: Estado global exclusivo en Zustand. Rechazado porque se perdería el filtro al recargar la página o compartir el enlace.

### 3. Agrupación Jerárquica en `GET /api/v1/telemetry/department-executions`
- **Decisión**: La consulta de agregación en Prisma agrupará por `organization.name`, `department.name` y `model`. En caso de que existan ejecuciones sin departamento asignado, se agruparán bajo la etiqueta "Unassigned / Sin Asignar".
- **Razón**: Previene la pérdida de registros de telemetría históricos en el cuadro analítico.

### 4. Estructura de Componentes Frontend
- **`OrganizationScopeSelector.tsx`**: Renderiza un `<select>` estilizado con Tailwind CSS, mostrando "Todas las Entidades / All Organizations" como opción por defecto y las entidades devueltas por la API.
- **`ExecutionLogsView.tsx`**: Pestaña/Vista dedicada con tabla analítica que muestra la jerarquía Entidad ➔ Departamento ➔ Modelo, con badges de modelo, formato de coste (€/$) e indicadores de latencia.

## Risks / Trade-offs

- **[Registros de Telemetría sin Organización/Departamento]** → *Mitigación*: Agrupar logs huérfanos bajo la categoría "Sin departamento asignado" tanto en backend como en frontend.
- **[Rendimiento de Consultas de Agregación]** → *Mitigación*: Indexar campos de filtro (`userId`, `createdAt`) en `ExecutionLog` y aprovechar índices existentes de Prisma.

## Migration Plan

1. **Backend**:
   - Agregar método `getOrganizations` y `getDepartmentExecutions` en `TelemetryRepository` y `TelemetryService`.
   - Modificar métodos existentes (`getKpis`, `getChartData`, `getBreakdownData`) para recibir `organizationId?: string`.
   - Exponer endpoints en `TelemetryController` y `telemetryRoutes.ts`.
2. **Frontend**:
   - Añadir llamadas en `telemetryApi.ts`.
   - Crear `OrganizationScopeSelector.tsx` e integrarlo en `Header.tsx`.
   - Crear `ExecutionLogsView.tsx` e integrarlo en el router/tabs de la aplicación.
   - Añadir las claves de traducción en `es.json` y `en.json`.
