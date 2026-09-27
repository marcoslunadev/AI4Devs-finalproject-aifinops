## ADDED Requirements

### Requirement: Consumo de Datos de Telemetría vía API Real
El frontend Dashboard UI SHALL consumir las métricas reales del backend mediante peticiones HTTP asíncronas con TanStack React Query, mostrando indicadores visuales de carga (Skeletons) y reintentos automáticos en caso de fallo.

#### Scenario: Carga exitosa de métricas desde la API
- **WHEN** el usuario accede al Dashboard
- **THEN** el sistema realiza peticiones GET a `/api/v1/telemetry/kpis`, `/api/v1/telemetry/chart` y `/api/v1/telemetry/breakdown`
- **AND** reemplaza los esqueletos de carga por los datos dinámicos devueltos por la API

#### Scenario: Manejo de error de red o timeout
- **WHEN** la API del backend devuelve un error HTTP 5xx o de conexión
- **THEN** el Dashboard muestra un estado de error claro con un botón para reintentar la carga (`Retry`) sin romper la interfaz
