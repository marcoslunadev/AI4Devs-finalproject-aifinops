# Subagentes y Skills Propuestos (AIFinOps)

Durante el ciclo de vida del desarrollo de AIFinOps, se propone la integración de los siguientes subagentes y skills para asegurar calidad, seguridad y consistencia en el código. Estos deben integrarse en el entorno de OpenSpec / Antigravity.

## 1. Subagente: `db-architect`
**Propósito:** Especialista en la capa de datos.
**Funciones:**
- Revisar y auditar todas las modificaciones al archivo `schema.prisma`.
- Validar las relaciones y tipos de datos antes de generar migraciones.
- Sugerir índices de rendimiento para consultas analíticas pesadas (esencial para los dashboards).

## 2. Subagente: `react-ui-builder`
**Propósito:** Experto en desarrollo de interfaces y UX.
**Funciones:**
- Traducir los requisitos del PRD en componentes de React 18 usando TailwindCSS.
- Auditar la consistencia del diseño (usabilidad, responsividad, accesibilidad).
- Implementar la funcionalidad de Drill-Down y filtros interactivos en las tablas de AIFinOps.

## 3. Subagente: `security-auditor`
**Propósito:** Análisis de seguridad y OWASP.
**Funciones:**
- Revisar las reglas de autenticación y autorización (RBAC, middlewares JWT).
- Realizar pruebas estáticas de código (SAST) sobre los endpoints expuestos en Express.
- Asegurar que la ingesta de logs valida correctamente los esquemas usando Zod, evitando inyecciones o procesamiento de datos corruptos.

## Uso Operativo
Estos subagentes serán invocados mediante el flujo de OpenSpec (`/opsx-propose`, `/plan`) o asignados a tareas específicas del checklist de la Entrega 2 y Entrega 3.
