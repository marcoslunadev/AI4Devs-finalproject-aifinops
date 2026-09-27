## ADDED Requirements

### Requirement: Centro de Notificaciones y Banners de Alerta
El Dashboard UI SHALL incluir en el Header un icono de campana con contador de alertas activas y un desplegable (Drawer/Popover) que liste las anomalías recientes con accesos directos de acción.

#### Scenario: Visualización de alertas activas en la cabecera
- **WHEN** existen 2 anomalías no resueltas en el sistema
- **THEN** el icono de campana en el Header muestra un badge numérico "2" con animación de atención y permite desplegar el menú de alertas al hacer clic
