## ADDED Requirements

### Requirement: Protección contra Fuerza Bruta y CPU DoS en Endpoint de Login
El endpoint de autenticación `POST /api/v1/auth/login` SHALL estar protegido por un middleware de limitación de tasa estricto (`authLimiter`) que restrinja los intentos de autenticación a un máximo de 10 solicitudes por dirección IP en una ventana de 15 minutos. Si se sobrepasa dicho límite, el sistema SHALL responder con código HTTP 429 Too Many Requests sin invocar la función de cálculo de hash `bcrypt.compare`, mitigando ataques de fuerza bruta y saturación del Event Loop de Node.js por consumo excesivo de CPU.

#### Scenario: Intentos de autenticación dentro del umbral
- **WHEN** un cliente realiza intentos de login dentro de la cuota permitida (<= 10 intentos en 15 minutos)
- **THEN** el sistema evalúa las credenciales y responde 200 OK o 401 Unauthorized según corresponda

#### Scenario: Bloqueo temporal por exceso de intentos de login
- **WHEN** una dirección IP sobrepasa el límite de 10 intentos de login en la ventana de 15 minutos
- **THEN** el sistema rechaza la solicitud inmediatamente con código HTTP 429 Too Many Requests
- **AND** retorna un mensaje informativo indicando que los intentos han sido bloqueados temporalmente

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral
