## Why

AIFindOps requires processing potentially large telemetry logs (JSON/CSV) from various AI models and platforms. To avoid memory saturation, we need an asynchronous, streaming-based ingestion engine that can also adapt its parsing logic based on flexible mapping configurations (e.g., dynamically mapping columns based on filename).

## What Changes

- Implementation of a streaming parser for large CSV/JSON logs to ensure low memory footprint.
- A dynamic mapping layer that configures how input data maps to the `ExecutionLog` Prisma schema based on parameters like the filename.
- An asynchronous ingestion worker or service that handles the parsing in the background and logs progress to `IngestionAuditLog`.
- New API endpoints to upload files and trigger the async ingestion process.

## Capabilities

### New Capabilities
- `data-ingestion`: Asynchronous processing, streaming, and dynamic mapping of AI execution logs from CSV/JSON into the system.

### Modified Capabilities

## Impact

- **Backend / Services**: New ingestion service, dynamic mapping logic, file upload routes, and background task handling.
- **Database**: Populates `ExecutionLog` and `IngestionAuditLog` tables.
