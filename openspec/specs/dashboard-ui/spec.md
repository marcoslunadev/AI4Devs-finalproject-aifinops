# dashboard-ui

## Purpose
Define los requisitos visuales, de internacionalización y temáticos para el panel de control principal de AIFinOps, asegurando accesibilidad y usabilidad.
## Requirements
### Requirement: Soporte Multi-idioma (i18n)
El frontend SHALL soportar la internacionalización de toda su interfaz, permitiendo cambiar el idioma dinámicamente entre Inglés y Español (por defecto).

#### Scenario: Cambio de idioma en tiempo real
- **WHEN** un usuario selecciona "Inglés" en el selector de idiomas
- **THEN** todos los textos de la interfaz (botones, tablas, KPIs) se traducen al inglés inmediatamente sin recargar la página

### Requirement: Temas Claro y Oscuro (Theming)
El sistema SHALL permitir al usuario alternar entre modos de visualización claro y oscuro.

#### Scenario: Activación de modo oscuro
- **WHEN** el usuario hace clic en el botón de "Modo Oscuro"
- **THEN** el sistema aplica las clases de TailwindCSS correspondientes invirtiendo los colores de fondo y texto adecuadamente

### Requirement: Visualización de KPIs y Tabla Jerárquica (Executive Dashboard)
El Dashboard SHALL presentar en su cabecera 6 tarjetas de métricas clave (Total Cost, Total Executions, Total Tokens, Avg Cost per Execution, Active Organizations, Error Rate) con indicadores de tendencia (micro-sparklines o variaciones porcentuales). Además, SHALL presentar una tabla interactiva para desglosar datos financieros y de uso por Organización.

#### Scenario: Visualización interactiva de Drill-Down por Entorno
- **WHEN** el usuario visualiza la tabla en el nivel "Organización" (ej. VASS) y hace clic en el icono de expandir
- **THEN** la tabla despliega filas anidadas mostrando los datos de los Entornos que pertenecen a esa Organización (PROD, PRE, DEV)
- **AND** alinea las columnas de los entornos exactamente bajo las columnas de la organización padre, mostrando "No Data" o "—" si un entorno no tiene consumo en el periodo seleccionado

### Requirement: Consumo de Datos de Telemetría vía API Real
El frontend Dashboard UI SHALL consumir las métricas reales del backend mediante peticiones HTTP asíncronas con TanStack React Query, mostrando indicadores visuales de carga (Skeletons) y reintentos automáticos en caso de fallo.

#### Scenario: Carga exitosa de métricas desde la API
- **WHEN** el usuario accede al Dashboard
- **THEN** el sistema realiza peticiones GET a `/api/v1/telemetry/kpis`, `/api/v1/telemetry/chart` y `/api/v1/telemetry/breakdown`
- **AND** reemplaza los esqueletos de carga por los datos dinámicos devueltos por la API

#### Scenario: Manejo de error de red o timeout
- **WHEN** la API del backend devuelve un error HTTP 5xx o de conexión
- **THEN** el Dashboard muestra un estado de error claro con un botón para reintentar la carga (`Retry`) sin romper la interfaz

### Requirement: Navegación por Pestañas del Dashboard
El Dashboard UI SHALL incluir una barra de pestañas de navegación principal (Executive Overview vs Model & Provider Analytics) permitiendo conmutar la vista sin perder el estado de los filtros globales activos.

#### Scenario: Transición entre vistas de la interfaz
- **WHEN** el usuario hace clic en la pestaña "Model & Provider Analytics"
- **THEN** la interfaz conmuta suavemente el contenido principal mostrando la vista de analítica de modelos sin recargar la página

### Requirement: Centro de Notificaciones y Banners de Alerta
El Dashboard UI SHALL incluir en el Header un icono de campana con contador de alertas activas y un desplegable (Drawer/Popover) que liste las anomalías recientes con accesos directos de acción.

#### Scenario: Visualización de alertas activas en la cabecera
- **WHEN** existen 2 anomalías no resueltas en el sistema
- **THEN** el icono de campana en el Header muestra un badge numérico "2" con animación de atención y permite desplegar el menú de alertas al hacer clic

### Requirement: Indicador de Estado de Ingesta y Timestamp de Última Actualización
El Executive Dashboard UI SHALL mostrar en su cabecera un indicador visual animado cuando exista un proceso de ingesta de datos en curso y la fecha y hora de la última ingesta completada.

#### Scenario: Visualización de ingesta en curso
- **WHEN** la API devuelva que el estado de ingesta es `"PROCESSING"`
- **THEN** la cabecera del Dashboard muestra una insignia animada indicando "Ingestando nuevos datos..."
- **AND** activa un sondeado dinámico (polling) cada 5 segundos hasta que el estado cambie a `"COMPLETED"`

#### Scenario: Visualización de última actualización completada
- **WHEN** la API devuelva que el estado de ingesta es `"COMPLETED"` con una fecha `lastIngestedAt` válida
- **THEN** la cabecera del Dashboard muestra la etiqueta de timestamp en formato legible (ej. "Última actualización: 03/10/2026 12:30h")

### Requirement: Formateo Numérico Compacto y Estabilidad de Iconos en Tarjetas KPI
Las tarjetas KPI del Executive Dashboard SHALL formatear cifras superiores a 1.000 usando sufijos de notación compacta (K, M, B) y MUST proteger la posición del icono dentro del contenedor flexbox impidiendo que se desplace o reduzca debido a la longitud del número.

#### Scenario: Visualización de un coste o número de ejecuciones elevado
- **WHEN** un valor numérico en una tarjeta KPI es grande (ej. 1,845,200 ejecuciones o $45,280.50)
- **THEN** la tarjeta muestra el valor formateado de manera compacta (ej. `1.85M` o `$45.3K`)
- **AND** el icono de la tarjeta mantiene su tamaño fijo de 40x40px (`shrink-0`) alineado en la esquina superior derecha sin desbordamiento.

### Requirement: Traducción Completa de Componentes del Dashboard (`dashboard-ui`)
Todos los textos, cabeceras, subenunciados, etiquetas de badges, banners de presupuesto y mensajes de estado de carga/error en el Executive Dashboard SHALL utilizar claves de traducción gestionadas por `react-i18next`.

#### Scenario: Cambio de idioma a inglés en el Executive Dashboard
- **WHEN** el usuario selecciona "English" en el selector de idioma del Header
- **THEN** todos los literales del Dashboard (incluyendo la cabecera ejecutiva, badges de KPI "Active/Optimal", avisos de presupuesto, mensajes de error y textos de la tabla jerárquica) se renderizan inmediatamente en inglés

### Requirement: Selector Dinámico de Ámbito de Organización en el Header
La cabecera del sistema SHALL integrar un selector desplegable dinámico (`OrganizationScopeSelector`) que muestre las entidades registradas en el backend y permita acotar todo el Dashboard a una organización específica mediante su UUID real en la URL.

#### Scenario: Selección de entidad específica en el Header
- **WHEN** el usuario selecciona una compañía en el selector del Header (ej. "VASS Global Tech")
- **THEN** la URL se actualiza con `?organizationId=<uuid>`
- **AND** todos los componentes del Dashboard (KPIs, gráfica temporal y tabla jerárquica) recalculan sus datos mostrando únicamente el consumo de esa entidad

### Requirement: Barra de Filtros Globales del Dashboard
El frontend SHALL presentar en la parte superior del Dashboard una barra de filtros interactiva que permita filtrar métricas por rango de fechas (7d, 30d, 90d, custom), modelos/proveedores de IA, y scope de Organización o Entorno.

#### Scenario: Filtrado por rango temporal en tiempo real
- **WHEN** el usuario selecciona el rango de fecha "Últimos 7 días" (7D)
- **THEN** todas las tarjetas de KPI, el gráfico de tendencia y la tabla jerárquica actualizan inmediatamente sus métricas según dicho periodo

#### Scenario: Sincronización de estado de filtros en la URL
- **WHEN** el usuario aplica un filtro de modelo (ej. `model=gpt-4o&range=30d`)
- **THEN** el sistema refleja automáticamente los parámetros en la URL de navegación (`window.location.search`)
- **AND** al compartir o recargar la URL, los filtros se restauran exactamente en el estado seleccionado
