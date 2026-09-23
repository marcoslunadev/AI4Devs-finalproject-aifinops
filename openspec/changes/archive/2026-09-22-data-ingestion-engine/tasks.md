## 1. Setup y Dependencias

- [x] 1.1 Instalar dependencias para parseo y manejo de subida de archivos en el backend (`csv-parse`, `multer` y sus tipos).
- [x] 1.2 Configurar el middleware de `multer` para guardar archivos temporales en disco (o buffer temporal según convenga para streaming).

## 2. Capa de Adaptadores (Mapeo Dinámico)

- [x] 2.1 Crear interfaz `LogAdapter` en `src/domain/adapters/LogAdapter.ts` que defina la firma para mapear una fila CSV/JSON al formato `ExecutionLog`.
- [x] 2.2 Implementar `OpenAIAdapter` y `AzureAdapter` (ejemplos base).
- [x] 2.3 Crear `AdapterResolver` o Factory que, dado un nombre de archivo, retorne la instancia del adaptador adecuado.

## 3. Servicio de Ingesta Asíncrona

- [x] 3.1 Crear `IngestionService` que reciba el path del archivo subido.
- [x] 3.2 Implementar la creación del registro `IngestionAuditLog` en estado `PENDING`.
- [x] 3.3 Implementar el parseo en streaming usando `csv-parse` para CSV (o `readline` para NDJSON) y el adapter resuelto.
- [x] 3.4 Agrupar filas parseadas y hacer inserción en lote (chunking) usando `prisma.executionLog.createMany`.
- [x] 3.5 Actualizar el estado del `IngestionAuditLog` a `COMPLETED` o `FAILED` al finalizar el stream.
- [x] 3.6 Extraer Organización y Entorno del nombre del archivo y pasarlo como contexto al adapter.

## 4. API Endpoints

- [x] 4.1 Crear `IngestionController` con el método `uploadLogFile`.
- [x] 4.2 Registrar la nueva ruta `POST /api/v1/ingestion/upload` protegida con JWT/Roles correspondientes.
