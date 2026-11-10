## MODIFIED Requirements

### Requirement: Ingesta asíncrona tolerante a fallos
El sistema SHALL recibir archivos de logs (JSON/JSONL) de forma controlada y procesarlos en segundo plano sin bloquear la solicitud HTTP inicial.
- La subida de archivos en `POST /api/v1/ingestion/upload` SHALL requerir autenticación obligatoria y permiso de rol `ADMIN` (`requireRole([Role.ADMIN])`).
- El middleware de subida SHALL limitar estrictamente el tamaño del archivo a un máximo de 10MB para prevenir ataques de agotamiento de disco (Disk Exhaustion DoS) en el almacenamiento temporal.
- El sistema SHALL rechazar con código HTTP 400 cualquier archivo cuya extensión o tipo no corresponda a `.json` o `.jsonl`.
- Las peticiones válidas SHALL responder inmediatamente con un identificador de seguimiento y HTTP 202 Accepted, procesando las filas en background.

#### Scenario: Subida de archivo masivo dentro del límite por usuario Admin
- **WHEN** un usuario con rol `ADMIN` sube un archivo JSON/JSONL de telemetría válido menor o igual a 10MB
- **THEN** el sistema responde inmediatamente con un identificador de seguimiento y HTTP 202 Accepted
- **AND** procesa las filas en background registrando el estado final en IngestionBatch

#### Scenario: Rechazo por exceder límite de tamaño de archivo (>10MB)
- **WHEN** un cliente intenta subir un archivo que supera el umbral de 10MB
- **THEN** el sistema aborta la subida y responde con error de tamaño excedido antes de saturar el disco

#### Scenario: Rechazo por formato de archivo no permitido
- **WHEN** un cliente intenta subir un archivo con extensión no autorizada (ej. `.exe`, `.sh`, `.pdf`)
- **THEN** el sistema rechaza la petición con HTTP 400 informando que solo se admiten archivos `.json` o `.jsonl`

#### Scenario: Intento de subida por usuario sin credenciales o rol insuficiente
- **WHEN** un cliente anónimo o con rol `FINOPS_VIEWER` intenta hacer una petición POST a `/api/v1/ingestion/upload`
- **THEN** el sistema responde con HTTP 401 Unauthorized o HTTP 403 Forbidden impidiendo la subida

## ADDED Requirements

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral
