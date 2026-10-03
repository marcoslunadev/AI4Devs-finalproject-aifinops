## Why

En pantallas o contenedores con anchura reducida, algunas tarjetas KPI experimentan desbordamiento visual cuando las cifras de costes o ejecuciones contienen muchos dígitos (ej. `$1,845,200.00` o `1,845,200 ejecuciones`). Esto desplaza lateralmente el icono de la tarjeta KPI rompiendo la alineación y el diseño ejecutivo del dashboard. Además, la lectura de números extensos es menos clara para perfiles ejecutivos.

## What Changes

- Formateo compacto universal para grandes números usando sufijos estándar (`K`, `M`, `B`, `T`) mediante `Intl.NumberFormat` con notación compacta (`notation: "compact"`).
- Ajuste del layout flexbox y prevención de encogimiento/desplazamiento en el icono de las tarjetas KPI (`KpiCard.tsx`):
  - Añadido de `shrink-0` e indicación de anchura mínima al contenedor del icono.
  - Ajuste de truncado responsivo (`truncate`, `min-w-0`) en la tipografía de las cifras del KPI para garantizar que el icono permanezca inmóvil en su posición alineada a la derecha.
- Actualización de los helpers de formato en `Dashboard.tsx` para aplicar formato compacto a costes, ejecuciones, tokens y promedios.

## Capabilities

### Modified Capabilities

- `dashboard-ui`: Las tarjetas KPI de la vista ejecutiva formatearán cifras numéricas superiores a 1.000 con notación compacta (ej. `$1.85M`, `452.8K`) y garantizarán la estabilidad posicional del icono sin desbordamientos laterales.

## Impact

- **Frontend**:
  - `frontend/src/components/KpiCard.tsx`: Flexbox `min-w-0` y protección de dimensiones del icono.
  - `frontend/src/pages/Dashboard.tsx`: Formateador numérico compacto reutilizable.
  - `frontend/src/utils/formatters.ts` (opcional/helper): Utilidades de formateo numérico de FinOps.
