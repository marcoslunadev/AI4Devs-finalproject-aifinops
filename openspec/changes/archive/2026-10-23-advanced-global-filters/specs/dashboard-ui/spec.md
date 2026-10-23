## ADDED Requirements

### Requirement: Barra de Filtros Globales del Dashboard
El frontend SHALL presentar en la parte superior del Dashboard una barra de filtros interactiva que permita filtrar métricas por rango de fechas (7d, 30d, 90d, custom), modelos/proveedores de IA, y scope de Organización o Entorno.

#### Scenario: Filtrado por rango temporal en tiempo real
- **WHEN** el usuario selecciona el rango de fecha "Últimos 7 días" (7D)
- **THEN** todas las tarjetas de KPI, el gráfico de tendencia y la tabla jerárquica actualizan inmediatamente sus métricas según dicho periodo

#### Scenario: Sincronización de estado de filtros en la URL
- **WHEN** el usuario aplica un filtro de modelo (ej. `model=gpt-4o&range=30d`)
- **THEN** el sistema refleja automáticamente los parámetros en la URL de navegación (`window.location.search`)
- **AND** al compartir o recargar la URL, los filtros se restauran exactamente en el estado seleccionado
