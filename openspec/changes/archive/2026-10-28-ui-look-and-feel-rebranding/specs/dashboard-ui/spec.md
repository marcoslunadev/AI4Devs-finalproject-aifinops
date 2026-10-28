## MODIFIED Requirements

### Requirement: Temas Claro y Oscuro (Theming)
El sistema SHALL permitir al usuario alternar dinámicamente entre modo de visualización claro y oscuro mediante un control interactivo en la cabecera. La transición entre temas SHALL ser instantánea y sin destellos desestilizados (anti-FOUC) al recargar la página. En modo oscuro, el fondo SHALL ser `#080b11` con superficies de tarjetas en `#0f1420`, bordes sutiles en `border-white/10` y textos en escala de grises de alto contraste (`text-white`, `text-slate-300`, `text-slate-400`). En modo claro, el fondo SHALL ser `#f8fafc` con tarjetas en blanco puro (`#ffffff`) y bordes en `slate-200`.

#### Scenario: Activación de modo oscuro
- **WHEN** el usuario hace clic en el botón de alternancia de tema
- **THEN** el sistema añade la clase `dark` al elemento raíz `<html>`, conmuta las variables CSS y actualiza la preferencia en `localStorage`
- **AND** los fondos cambian a obsidian deep `#080b11` y las tarjetas a `#0f1420` preservando los acentos cian y esmeralda

#### Scenario: Carga inicial sin destello visual (anti-FOUC)
- **WHEN** el navegador carga o recarga cualquier página de la aplicación
- **THEN** un script síncrono en `index.html` evalúa la preferencia guardada antes del renderizado de React, evitando parpadeos de color no deseados
