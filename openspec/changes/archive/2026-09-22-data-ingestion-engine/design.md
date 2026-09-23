## Context

AIFinOps needs to ingest potentially massive telemetry files from various AI providers. The current backend uses Node.js and Express, which is single-threaded. Loading huge files into memory or blocking the event loop would degrade API performance for other requests. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Procesar archivos de forma asíncrona sin bloquear el event loop principal.
- Consumir poca memoria (streaming).
- Soportar mapeos dinámicos basados en adaptadores para diferentes orígenes de logs.

**Non-Goals:**
- Construir una infraestructura compleja de colas distribuidas (ej. Kafka, RabbitMQ) en esta fase MVP.
- Soportar todos los formatos de logs existentes de fábrica; solo sentar la base extensible.

## Decisions

### Decisión 1: Streaming Parser
**Opción seleccionada**: Utilizar la librería `csv-parse` para CSV y el módulo nativo `readline` para NDJSON.
**Alternativas consideradas**: `papaparse` o cargar todo en memoria.
**Rationale**: `csv-parse` implementa la API nativa de Streams de Node.js, permitiendo backpressure y procesamiento por chunks, lo cual mantiene la memoria controlada a unos pocos MBs.

### Decisión 2: Patrón Adapter para el Mapeo Dinámico y Extracción de Contexto
**Opción seleccionada**: Interfaz `LogAdapter` con implementaciones como `OpenAIAdapter`, `AzureAdapter`, etc. Adicionalmente, el `IngestionService` extrae la Organización y Entorno del nombre del archivo (formato `[Org]_[Env]_...`) y lo pasa como contexto a los adaptadores para que lo inyecten en los `metadata` de `ExecutionLog`.
**Alternativas consideradas**: Configuraciones JSON estáticas o forzar al usuario a enviar metadata explícita vía API.
**Rationale**: Una interfaz en código (TypeScript) permite conversiones complejas (ej. calcular coste si el CSV solo trae tokens, parsear fechas en distintos formatos) que un simple JSON de mapeo 1:1 no permitiría. La selección del adaptador se hará mediante expresiones regulares sobre el nombre del archivo (ej. `/azure/i.test(filename)`). Usar la convención de nombre de archivo para inyectar Organización y Entorno mantiene la API limpia (sin necesidad de payload extra complejo) y es fácil de automatizar para los publicadores de logs.

### Decisión 3: Procesamiento Asíncrono "In-Memory Queue" (MVP)
**Opción seleccionada**: Una vez recibido el archivo, responder 202 Accepted, e iniciar el stream en un bloque de ejecución en background (Promesa suelta o Worker Thread sencillo), actualizando `IngestionAuditLog`.
**Alternativas consideradas**: BullMQ + Redis.
**Rationale**: Para el MVP y no añadir dependencias pesadas de infraestructura como Redis, un procesamiento en background dentro de Node es suficiente si delegamos el I/O pesado a los streams y a la BD PostgreSQL.

## Risks / Trade-offs

- **Risk**: Si el servidor se reinicia mientras hay un stream procesándose, la ingesta quedará en estado `PENDING` indefinidamente y se perderá el progreso.
  - **Mitigation**: Diseñar la inserción para que sea idempotente o dejar como asunción MVP que en caso de fallo se debe re-subir el fichero, marcando los PENDING antiguos como FAILED en el arranque.
