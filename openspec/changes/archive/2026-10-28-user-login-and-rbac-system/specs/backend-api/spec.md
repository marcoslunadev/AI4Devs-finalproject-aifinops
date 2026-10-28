## ADDED Requirements

### Requirement: Autenticación Unificada por Identificador (Username o Email)
El endpoint `POST /api/v1/auth/login` SHALL permitir a los usuarios autenticarse proporcionando en el campo `email` tanto su dirección de correo completa como su nombre de usuario base.
- Si el cliente envía `admin`, el sistema buscará `admin@aifinops.com` o coincidencia exacta de nombre/email.
- Si el cliente envía `viewer`, el sistema buscará `viewer@aifinops.com` o coincidencia exacta de nombre/email.
- La contraseña enviada SHALL compararse de forma segura mediante `bcrypt.compare`.

#### Scenario: Autenticación mediante username corto
- **WHEN** un usuario envía `POST /api/v1/auth/login` con `{ "email": "admin", "password": "Admin_M4rc0s" }`
- **THEN** el sistema valida el hash de contraseña y responde con `200 OK`, el token JWT y el rol `ADMIN`

### Requirement: Usuarios Semilla Maestros RBAC (admin y viewer)
La base de datos SHALL contar con los usuarios predeterminados de acceso para pruebas y demostración de roles:
- Usuario `admin` (email: `admin@aifinops.com`, password: `Admin_M4rc0s`, rol: `ADMIN`).
- Usuario `viewer` (email: `viewer@aifinops.com`, password: `Viewer_M4rc0s`, rol: `FINOPS_VIEWER`).

#### Scenario: Sembrado de credenciales maestras
- **WHEN** se ejecuta el script de semillas `seed.ts`
- **THEN** la base de datos registra a ambos usuarios con sus contraseñas hasheadas con salt rounds 10
