## ADDED Requirements

### Requirement: Traducción Completa de Componentes del Dashboard (`dashboard-ui`)
Todos los textos, cabeceras, subenunciados, etiquetas de badges, banners de presupuesto y mensajes de estado de carga/error en el Executive Dashboard SHALL utilizar claves de traducción gestionadas por `react-i18next`.

#### Scenario: Cambio de idioma a inglés en el Executive Dashboard
- **WHEN** el usuario selecciona "English" en el selector de idioma del Header
- **THEN** todos los literales del Dashboard (incluyendo la cabecera ejecutiva, badges de KPI "Active/Optimal", avisos de presupuesto, mensajes de error y textos de la tabla jerárquica) se renderizan inmediatamente en inglés
