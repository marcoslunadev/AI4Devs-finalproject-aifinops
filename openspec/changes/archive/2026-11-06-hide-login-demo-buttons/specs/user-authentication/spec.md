## MODIFIED Requirements

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
