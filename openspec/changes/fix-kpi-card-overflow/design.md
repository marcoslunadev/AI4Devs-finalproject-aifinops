## Context

Ver `proposal.md` para la motivación. Actualmente en `KpiCard.tsx`, el contenedor flex principal no evita que el texto del número comprima el contenedor del icono (`shrink-0`), ni aplica formateo numérico abreviado (`compact notation`) para grandes cantidades de dinero o ejecuciones.

## Goals / Non-Goals

**Goals:**
- Ajustar la estructura Flexbox en `KpiCard.tsx` aplicando `shrink-0` al contenedor del icono e incluyendo `min-w-0` y `truncate` al contenedor de texto para garantizar que las cajas no se deformen en resoluciones estrechas.
- Crear utilidades de formateo en `frontend/src/utils/formatters.ts` que utilicen `Intl.NumberFormat` para notación compacta (`K`, `M`, `B`) en costes, ejecuciones y tokens.
- Actualizar `Dashboard.tsx` para usar la función de formateo numérico abreviado en todas las tarjetas KPI.

**Non-Goals:**
- Modificar las firmas de los esquemas API ni alterar los contratos Zod en el backend.

## Decisions

### Decisión 1: Notación Compacta Estándar (`Intl.NumberFormat`)
Utilizar la API nativa `Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' })` para cifras > 1.000.
- *Ejemplo*: 1.845.200 -> `1.85M`, 45.280,50 -> `$45.3K`, 452.800 -> `452.8K`.
- *Razón*: Estándar nativo del navegador, rápido, sin dependencias externas adicionales y ampliamente aceptado en dashboards de FinOps.

### Decisión 2: Estructura Flexbox Antidesbordamiento en `KpiCard.tsx`
Configurar el contenedor Flex como:
```tsx
<div className="flex items-start justify-between gap-3 min-w-0">
  <div className="space-y-1 min-w-0 flex-1">
    <span className="text-xl sm:text-2xl font-extrabold tracking-tight truncate block">
      {value}
    </span>
  </div>
  <div className="shrink-0 p-3 rounded-xl bg-gradient-to-br ...">
    <Icon className="w-5 h-5" />
  </div>
</div>
```
- *Razón*: `shrink-0` congela de forma inmutable la anchura del contenedor del icono, previniendo que el texto o las insignias lo empujen fuera de la caja.

## Risks / Trade-offs

- **[Riesgo]** Pérdida de precisión al mostrar decimales exactos en notación compacta.
  - *Mitigación*: Mostrar el valor completo exacto en el atributo `title` de la cifra o mantener 1-2 decimales en el formateador compacto (ej. `$45.28K`).
