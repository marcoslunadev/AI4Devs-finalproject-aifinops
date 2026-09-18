---
name: run-tests
description: Ejecuta la suite de tests del proyecto. Soporta flags para especificar entorno (ej. /run-tests backend).
---

# Run Tests

Cuando se active esta skill, evalúa si el usuario ha proporcionado algún modificador o flag (ej. `/run-tests backend` o `/run-tests front`).

Dependiendo de la intención del usuario:
- Si especifica **backend**: navega a `backend/` y ejecuta solo los tests del backend (`npm test`).
- Si especifica **frontend**: navega a `frontend/` y ejecuta solo los tests del frontend (`npm test`).
- Si no especifica nada: ejecuta ambos secuencialmente.

Pasos de la ejecución:
1. Lanza el comando de test correspondiente.
2. Analiza los resultados. Si los tests fallan, reporta el error y propón/implementa la solución necesaria.
3. Genera un breve reporte final de éxito o fracaso.
