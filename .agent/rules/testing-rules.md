# Regla de Desarrollo Guiado por Pruebas (TDD) y Testing Inteligente

- **Flujo TDD Obligatorio**: Siempre que vayas a implementar una nueva funcionalidad (por ejemplo, desarrollando tareas de un `opsx-apply`), **DEBES** seguir este ciclo:
  1. Escribe primero el test de la nueva funcionalidad.
  2. Ejecuta el test para demostrar que falla.
  3. Implementa el código necesario.
  4. Vuelve a ejecutar el test para confirmar que ahora pasa.
- **Testing Inteligente**: No ejecutes las suites de test completas si no es necesario. Si estás trabajando en `backend/`, ejecuta **sólo** los tests de backend. Si trabajas en `frontend/`, ejecuta **sólo** los de frontend.
- **Autonomía**: Haz esto proactivamente. No esperes a que el usuario te pida ejecutar los tests; la ejecución de las pruebas debe integrarse de forma natural en tu proceso de codificación.
