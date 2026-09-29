## ADDED Requirements

### Requirement: Formateo Numérico Compacto y Estabilidad de Iconos en Tarjetas KPI
Las tarjetas KPI del Executive Dashboard SHALL formatear cifras superiores a 1.000 usando sufijos de notación compacta (K, M, B) y MUST proteger la posición del icono dentro del contenedor flexbox impidiendo que se desplace o reduzca debido a la longitud del número.

#### Scenario: Visualización de un coste o número de ejecuciones elevado
- **WHEN** un valor numérico en una tarjeta KPI es grande (ej. 1,845,200 ejecuciones o $45,280.50)
- **THEN** la tarjeta muestra el valor formateado de manera compacta (ej. `1.85M` o `$45.3K`)
- **AND** el icono de la tarjeta mantiene su tamaño fijo de 40x40px (`shrink-0`) alineado en la esquina superior derecha sin desbordamiento.
