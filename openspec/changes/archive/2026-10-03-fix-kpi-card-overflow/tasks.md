## 1. Utilidades de Formateo de Números Compactos

- [x] 1.1 Crear el modulo de helpers de formateo en `frontend/src/utils/formatters.ts` que implemente notación compacta (K, M, B) para dinero, ejecuciones y tokens.

## 2. Ajuste de Layout Flexbox en KpiCard

- [x] 2.1 Actualizar `frontend/src/components/KpiCard.tsx` aplicando `shrink-0` e inmutabilidad de tamaño al contenedor del icono.
- [x] 2.2 Aplicar `min-w-0`, `truncate` y tamaño tipográfico responsivo al contenedor del valor en `KpiCard.tsx`.

## 3. Integración en Dashboard y Verificación

- [x] 3.1 Actualizar los formateadores en `frontend/src/pages/Dashboard.tsx` para usar las nuevas funciones compactas.
- [x] 3.2 Verificar compilación con `npm run build` en el frontend y validar que las tarjetas no tengan desbordamientos laterales.
