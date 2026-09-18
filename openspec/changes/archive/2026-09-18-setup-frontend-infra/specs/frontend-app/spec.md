## Purpose
Define la estructura fundacional, la arquitectura del estado del cliente y la estrategia visual base (Tailwind) para el frontend de AIFindOps.

## ADDED Requirements

### Requirement: Enrutamiento del lado del cliente (SPA)
El frontend SHALL estar estructurado como una Single Page Application (SPA) usando un enrutador (e.g., React Router o Wouter) que gestione la navegación sin recargas completas de página.

#### Scenario: Navegación entre vistas
- **WHEN** un usuario hace clic en un enlace del menú de navegación
- **THEN** la URL cambia sin recargar el navegador
- **AND** la vista correspondiente se renderiza inmediatamente

### Requirement: Manejo de Estado Global y Asíncrono
El frontend SHALL utilizar mecanismos estandarizados para manejar estado. El estado global síncrono (ej. usuario autenticado, filtros del dashboard) SHALL manejarse con Zustand. El estado asíncrono y caché de servidor SHALL manejarse con React Query para garantizar coherencia y reintentos.

#### Scenario: Petición de datos con React Query
- **WHEN** el componente Dashboard se monta
- **THEN** React Query realiza una petición al backend
- **AND** el componente muestra un indicador de carga mientras espera la respuesta

### Requirement: Sistema de Diseño Visual Consistente
La aplicación SHALL implementar un sistema de diseño visual basado en TailwindCSS v4. No se SHALL utilizar CSS nativo suelto a menos que sea estrictamente necesario para animaciones complejas o directivas raíz.

#### Scenario: Estilos de Componente UI
- **WHEN** el desarrollador crea un nuevo componente de botón
- **THEN** utiliza clases utilitarias de Tailwind (ej. `bg-blue-600 hover:bg-blue-700`)
- **AND** los estilos se aplican sin necesidad de archivos CSS separados
