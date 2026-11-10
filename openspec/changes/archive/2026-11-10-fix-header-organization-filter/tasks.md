## 1. Refactorización de OrganizationScopeSelector

- [x] 1.1 Conectar `OrganizationScopeSelector.tsx` a `useFilterStore`, vinculando el valor del `<select>` con `organizationId` y actualizando el estado mediante `setOrganizationId`.
- [x] 1.2 Asegurar que el cambio a la opción por defecto ("Todas las Entidades") invoque `setOrganizationId("")` para limpiar el filtro.
- [x] 1.3 Preservar el estado de deshabilitado accesible (`disabled={isLoading}`) y las etiquetas de accesibilidad `aria-label` con i18n.

## 2. Robustecimiento de useSyncFilterParams

- [x] 2.1 Refactorizar la sincronización de `organizationId` en `useSyncFilterParams.ts` para evitar la eliminación espuria de parámetros al detectar mutaciones en la URL.
- [x] 2.2 Implementar control con refs para proteger la sincronización bidireccional evitando condiciones de carrera y re-renders infinitos entre `useSearchParams` y `useFilterStore`.
- [x] 2.3 Garantizar que al cargar la aplicación con `?organizationId=<uuid>` en la URL, el store global se hidrate correctamente y se mantenga sin sobreescrituras no deseadas.

## 3. Pruebas Automatizadas y Cobertura (>80%)

- [x] 3.1 Crear suite de pruebas unitarias para `OrganizationScopeSelector` en `frontend/src/components/__tests__/OrganizationScopeSelector.test.tsx` cubriendo renderizado, selección de entidad, limpieza y estado disabled.
- [x] 3.2 Crear suite de pruebas para `useSyncFilterParams` en `frontend/src/hooks/__tests__/useSyncFilterParams.test.ts` verificando hidratación desde URL, actualización de parámetros y limpieza.
- [x] 3.3 Ejecutar `npm test -- --coverage` y validar que la cobertura de código en los componentes modificados supere el umbral requerido del 80%.

## 4. Verificación y Validación de Calidad

- [x] 4.1 Ejecutar toda la suite de tests del frontend (`npm test -- --run`) asegurando que todos los tests pasen en verde.
- [x] 4.2 Validar la reactividad en el Dashboard al cambiar de organización, comprobando que las consultas de telemetría (KPIs, gráfica y tabla jerárquica) recalculen con el `organizationId` seleccionado.
