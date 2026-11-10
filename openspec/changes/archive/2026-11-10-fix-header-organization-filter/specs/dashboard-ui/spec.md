## MODIFIED Requirements

### Requirement: Selector Dinámico de Ámbito de Organización en el Header
La cabecera del sistema SHALL integrar un selector desplegable dinámico (`OrganizationScopeSelector`) conectado bidireccionalmente con el almacén global de filtros (`useFilterStore`), que muestre las entidades registradas en el backend y permita acotar todo el Dashboard a una organización específica mediante su UUID real en la URL y en el estado global. El selector SHALL mantener la entidad seleccionada visible en el dropdown, sincronizar de forma reactiva los parámetros de la URL sin borrarlos ni provocar condiciones de carrera, y contar con una cobertura de pruebas unitarias superior al 80%.

#### Scenario: Selección de entidad específica en el Header
- **WHEN** el usuario selecciona una compañía en el selector del Header (ej. "VASS Global Tech")
- **THEN** el selector refleja inmediatamente el valor seleccionado sin volver a la opción por defecto
- **AND** el estado global (`useFilterStore.organizationId`) se actualiza con el UUID de la organización seleccionada
- **AND** la URL del navegador se actualiza manteniendo `?organizationId=<uuid>`
- **AND** todos los componentes del Dashboard (KPIs, gráfica temporal y tabla jerárquica) recalculan y refrescan sus datos mostrando únicamente el consumo atribuido a esa entidad

#### Scenario: Selección de "Todas las Entidades" (limpieza de filtro)
- **WHEN** el usuario selecciona la opción "Todas las Entidades" en el desplegable
- **THEN** el estado global `organizationId` se limpia a cadena vacía
- **AND** el parámetro `organizationId` se elimina limpiamente de la URL sin afectar a los demás filtros activos (entorno, fechas, modelos)
- **AND** todos los componentes del Dashboard muestran las métricas consolidadas globales de todas las organizaciones

#### Scenario: Hidratación inicial y navegación directa desde URL
- **WHEN** un usuario accede directamente a la aplicación con el parámetro `?organizationId=<uuid>` en la URL
- **THEN** el hook `useSyncFilterParams` hidrata el almacén global `useFilterStore` con dicho `organizationId`
- **AND** el desplegable `OrganizationScopeSelector` muestra seleccionada la entidad correspondiente al UUID
- **AND** el sincronizador de parámetros de la URL no elimina dicho parámetro durante el ciclo de vida del componente

#### Scenario: Cobertura de pruebas automatizadas del selector y sincronización
- **WHEN** se ejecuta la suite de pruebas unitarias e integración en el frontend (`vitest run --coverage`)
- **THEN** los tests de `OrganizationScopeSelector` y `useSyncFilterParams` superan un 80% de cobertura de líneas, ramas, funciones y sentencias
- **AND** validan el cambio de selección, la limpieza del filtro, la hidratación desde URL y la sincronización con `useFilterStore`
