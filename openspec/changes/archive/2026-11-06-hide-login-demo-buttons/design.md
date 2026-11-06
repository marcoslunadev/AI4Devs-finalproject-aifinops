## Context

La pantalla de acceso `LoginPage.tsx` presentaba un bloque `Quick Demo Access Buttons` con dos botones que invocaban `handleFillDemo` para precargar `admin`/`Admin_M4rc0s` y `viewer`/`Viewer_M4rc0s`. Véase `proposal.md` para la motivación de eliminar este componente en favor de una experiencia corporativa más realista.

## Goals / Non-Goals

**Goals:**
- Ocultar/retirar del árbol de renderizado de `LoginPage.tsx` los botones de acceso rápido de demo ("Admin" y "Viewer").
- Mantener y asegurar que las credenciales de prueba sigan claramente accesibles en `README.md` (Secciones 0.6 y 1.5) y mediante comentarios explicativos en el código de `LoginPage.tsx`.
- Mantener la suite de pruebas unitarias y E2E pasando con un 100% de éxito.

**Non-Goals:**
- Modificar el endpoint de autenticación del backend (`POST /api/v1/auth/login`) ni alterar las contraseñas o roles de los usuarios sembrados.
- Modificar la lógica de almacenamiento de sesión en `authStore.ts`.

## Decisions

### Decisión 1: Retirada del bloque JSX de botones de acceso rápido en `LoginPage.tsx`
* **Elección**: Eliminar el bloque visual de botones de demo y la función auxiliar `handleFillDemo` en `LoginPage.tsx`.
* **Alternativa descartada**: Ocultarlos mediante una variable de entorno (`VITE_SHOW_DEMO_BUTTONS=false`) o un comentario HTML. Se descarta para no introducir flags innecesarias en una pantalla corporativa final de entrega.
* **Comentario en código**: Se añade un comentario en la cabecera del formulario de `LoginPage.tsx` indicando las credenciales de demo disponibles para desarrollo y evaluación:
  ```tsx
  // Credenciales de prueba:
  // Admin: admin@aifinops.com (o admin) / Admin_M4rc0s
  // Viewer: viewer@aifinops.com (o viewer) / Viewer_M4rc0s
  ```

### Decisión 2: Preservación de credenciales en `README.md`
* Se confirma que la tabla de credenciales de prueba en `README.md` (Sección 0.6) permanezca destacada y actualizada con ambos roles (`ADMIN` y `FINOPS_VIEWER`), asegurando que cualquier instructor o evaluador las tenga visibles a primera vista.

## Risks / Trade-offs

* **[Riesgo]**: Posibles tests de frontend que intenten buscar los botones "Admin" o "Viewer" en el DOM.  
  * **Mitigación**: Revisar `frontend/src/components/__tests__/`. En la suite actual (`HappyPathFlow.test.tsx`), los tests simulan la interacción rellenando directamente los inputs o actualizando `useAuthStore`, garantizando compatibilidad total. Se ejecutará `npm test` tras la modificación para certificar 0 regresiones.
