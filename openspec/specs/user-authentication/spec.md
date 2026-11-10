## Purpose

Permite a los usuarios autenticarse de forma interactiva en la plataforma AIFinOps mediante usuario/email y contraseña, conservando el token JWT de sesión de forma segura en el cliente para proteger rutas y atribuir permisos RBAC (ADMIN y FINOPS_VIEWER).
## Requirements
### Requirement: Formulario y Flujo de Login en Frontend
El sistema frontend SHALL ofrecer una vista dedicada `/login` con formulario de acceso mediante identificador (usuario o email) y contraseña con diseño limpio corporativo.
- La interfaz de `/login` SHALL requerir la introducción manual de credenciales por parte del usuario y NO SHALL mostrar botones de atajo o auto-rellenado de demostración en la interfaz gráfica.
- El formulario SHALL validar que los campos no estén vacíos antes de enviar la petición.
- El formulario SHALL mostrar mensajes de error claros y estilizados cuando las credenciales sean rechazadas con código 401.
- Al autenticarse correctamente, el sistema SHALL almacenar el token JWT y redirigir inmediatamente al Dashboard principal (`/`).

#### Scenario: Ausencia de botones de atajo en la interfaz de login
- **WHEN** un usuario accede a la pantalla `/login`
- **THEN** la interfaz no muestra botones de atajo de demostración ("Admin" / "Viewer"), requiriendo que las credenciales se introduzcan a través de los campos de texto del formulario

#### Scenario: Inicio de sesión exitoso como Admin
- **WHEN** el usuario ingresa manualmente el identificador `admin` (o `admin@aifinops.com`) y la contraseña `Admin_M4rc0s`
- **THEN** la aplicación recibe el token JWT, lo guarda en el store de sesión y navega al Dashboard

#### Scenario: Intento de inicio de sesión con contraseña inválida
- **WHEN** el usuario ingresa credenciales incorrectas en el formulario
- **THEN** la aplicación muestra una alerta de error en rojo y permanece en la página de login

### Requirement: Protección de Rutas del Dashboard (Guardián de Acceso)
El sistema frontend SHALL proteger todas las rutas privadas (`/`, `/analytics/models`, `/analytics/departments`) impidiendo el acceso a visitantes sin token activo.
- Si un usuario no autenticado intenta navegar a una ruta protegida, el sistema SHALL redirigirlo automáticamente a `/login`.
- Al recibir una respuesta HTTP 401 de cualquier endpoint del backend, el cliente HTTP SHALL invalidar la sesión y redirigir a `/login`.

#### Scenario: Intento de acceso directo sin autenticación previa
- **WHEN** un usuario sin sesión activa navega directamente a `http://localhost:5173/`
- **THEN** el componente de protección intercepta la navegación y redirige a `/login`

### Requirement: Visualización de Rol RBAC y Cierre de Sesión
El sistema frontend SHALL exhibir en el encabezado del layout el usuario conectado, su rol (`ADMIN` o `FINOPS_VIEWER`) y un botón para cerrar sesión.
- Al hacer clic en "Cerrar Sesión", el sistema SHALL purgar el token y el perfil de `localStorage` y redirigir a `/login`.

#### Scenario: Cierre de sesión voluntario
- **WHEN** un usuario autenticado pulsa el botón "Cerrar Sesión" en la barra superior
- **THEN** la sesión local es destruida y el usuario es devuelto a `/login`

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


