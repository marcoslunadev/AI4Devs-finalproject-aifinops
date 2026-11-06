## Why

La pantalla de inicio de sesión (`/login`) contenía botones de acceso rápido de demostración ("Admin" y "Viewer") pensados para agilizar pruebas iniciales. Para elevar la calidad visual y transmitir una experiencia corporativa realista y lista para producción ante la evaluación final, se requiere ocultar dichos botones de atajo, requiriendo que el usuario introduzca manualmente sus credenciales. Las credenciales de prueba se mantienen íntegramente preservadas y visibles en el `README.md`.

## What Changes

- **Ocultación de atajos de demo en Login**: Retirar de la interfaz visual de `LoginPage.tsx` el contenedor y los botones de auto-rellenado rápido "Admin" y "Viewer".
- **Preservación de credenciales de prueba**: Mantener intactas las credenciales de prueba maestras (`admin@aifinops.com` / `Admin_M4rc0s` y `viewer@aifinops.com` / `Viewer_M4rc0s`) en la Sección 0.6 y Sección 1.5 del `README.md` para facilitar la evaluación local y en la nube.
- **Limpieza de estado y handlers en frontend**: Retirar o deshabilitar la función `handleFillDemo` en `LoginPage.tsx` asegurando que no se generen advertencias de linting o tipos no utilizados.
- **Alineación de pruebas automatizadas**: Asegurar que las suites de pruebas unitarias y E2E sigan verificando la autenticación manual sin depender de botones de atajo en el DOM.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `user-authentication`: Modifica el requerimiento del formulario de login para exigir la entrada manual de credenciales (identificador y contraseña) en la vista `/login`, prescindiendo de botones de auto-rellenado directo en la interfaz gráfica.

## Impact

- **Frontend**: Modificación directa en `frontend/src/pages/LoginPage.tsx`.
- **Testing**: Verificación de tests en `frontend/src/components/__tests__/`.
- **Documentación**: Confirmación de que `README.md` conserva la tabla de credenciales de prueba.
