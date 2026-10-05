## ADDED Requirements

### Requirement: Selector Dinámico de Ámbito de Organización en el Header
La cabecera del sistema SHALL integrar un selector desplegable dinámico (`OrganizationScopeSelector`) que muestre las entidades registradas en el backend y permita acotar todo el Dashboard a una organización específica mediante su UUID real en la URL.

#### Scenario: Selección de entidad específica en el Header
- **WHEN** el usuario selecciona una compañía en el selector del Header (ej. "VASS Global Tech")
- **THEN** la URL se actualiza con `?organizationId=<uuid>`
- **AND** todos los componentes del Dashboard (KPIs, gráfica temporal y tabla jerárquica) recalculan sus datos mostrando únicamente el consumo de esa entidad
