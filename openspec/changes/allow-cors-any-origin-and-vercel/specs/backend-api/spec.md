## MODIFIED Requirements

### Requirement: Seguridad de Transporte y Cabeceras
La API SHALL protegerse activamente contra vectores de ataque comunes web mientras permite el consumo legítimo de la API desde cualquier origen de cliente web sin bloqueos por CORS.
- SHALL incluir cabeceras de seguridad mediante Helmet adaptando la directiva `Cross-Origin-Resource-Policy` (`cross-origin` o permisiva) para no restringir el acceso a clientes cross-origin.
- SHALL aceptar peticiones cross-origin (CORS) desde cualquier dominio arbitrario (`*` o reflejo de origen del solicitante), garantizando la no emisión de errores CORS ante orígenes no preconfigurados.
- SHALL soportar expresamente el dominio de frontend desplegado en producción: `https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app`, así como entornos locales (`http://localhost:5173`, `http://localhost:3000`).
- SHALL responder con éxito a las peticiones preflight HTTP (`OPTIONS`) retornando las cabeceras `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` y `Access-Control-Allow-Headers` permitiendo cabeceras habituales de autenticación (`Authorization`) y tipos de contenido (`Content-Type`).

#### Scenario: Petición desde el Frontend desplegado en Vercel
- **WHEN** el frontend desplegado en `https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app` realiza una petición HTTP al backend
- **THEN** el sistema procesa la petición retornando el header `Access-Control-Allow-Origin` correspondiente sin errores de bloqueo de CORS ni CORP

#### Scenario: Petición desde un origen arbitrario
- **WHEN** un cliente HTTP web desde cualquier otro dominio realiza una petición a los endpoints de la API
- **THEN** el sistema responde exitosamente sin rechazo de CORS y con cabeceras que permiten la lectura de la respuesta

#### Scenario: Petición preflight OPTIONS
- **WHEN** un navegador envía una petición `OPTIONS` con cabeceras `Origin`, `Access-Control-Request-Method` y `Access-Control-Request-Headers`
- **THEN** el sistema responde con código HTTP `200` o `204` y cabeceras que autorizan el método y cabeceras solicitadas

## ADDED Requirements

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral
