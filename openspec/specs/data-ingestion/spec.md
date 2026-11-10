## Purpose
Permite al sistema procesar archivos de telemetría de IA de forma asíncrona, tolerando grandes volúmenes de datos mediante streaming y un mapeo de datos paramétrico basado en el origen.

## Requirements

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

### Requirement: Streaming de lectura para bajo consumo de memoria
El sistema SHALL procesar los archivos línea a línea o por lotes limitados (chunks) usando streams, sin cargar el archivo completo en memoria en ningún momento.

#### Scenario: Consumo de recursos contenido
- **WHEN** se procesa un log de varios Gigabytes
- **THEN** la memoria del proceso de Node.js no excede el límite basal de forma proporcional al tamaño del fichero

### Requirement: Mapeo de columnas dinámico y Contexto
El sistema SHALL permitir definir e inyectar configuraciones de mapeo (adapters) de columnas que traduzcan la estructura de origen (e.g. logs de OpenAI vs Azure) al esquema canónico interno `ExecutionLog`. La selección del mapeo SHALL ser dinámica, pudiendo basarse en parámetros explícitos o inferirse (ej. por nombre de archivo o metadatos). Además, el sistema SHALL extraer información de contexto (como Organización y Entorno) directamente del nombre del archivo y adjuntarlo al log.

#### Scenario: Ingesta de formato Azure OpenAI
- **WHEN** el sistema procesa un fichero identificado como "formato Azure" (por convención o parámetro)
- **THEN** aplica el mapeo específico que extrae correctamente el coste y tokens de dicho formato al modelo genérico de BD

#### Scenario: Extracción de Organización y Entorno del Nombre de Archivo
- **WHEN** el usuario sube un archivo nombrado `VASS_PROD_openai_logs.csv`
- **THEN** el sistema extrae `VASS` como organización y `PROD` como entorno
- **AND** los inyecta en el campo `metadata` de cada `ExecutionLog` guardado

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral

