## Purpose
Permite al sistema procesar archivos de telemetría de IA de forma asíncrona, tolerando grandes volúmenes de datos mediante streaming y un mapeo de datos paramétrico basado en el origen.

## ADDED Requirements

### Requirement: Ingesta asíncrona tolerante a fallos
El sistema SHALL recibir archivos de logs (JSON/CSV) y procesarlos en segundo plano sin bloquear la solicitud HTTP inicial. El progreso y resultado de esta operación SHALL registrarse para auditoría.

#### Scenario: Subida de archivo masivo
- **WHEN** el usuario sube un archivo CSV de 500MB
- **THEN** el sistema responde inmediatamente con un identificador de seguimiento y HTTP 202 Accepted
- **AND** procesa las filas en background registrando el estado final en IngestionAuditLog

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
