---
name: react-i18n-expert
description: Guía y mejores prácticas para la internacionalización (i18n) en componentes Frontend (React 18+ y react-i18next) del proyecto AIFinOps. Se activa al aplicar tareas del frontend, refactorizar componentes o añadir nuevas características con soporte bilingüe (Español/Inglés).
triggers:
  - i18n
  - translation
  - react-i18next
  - useTranslation
  - t()
  - frontend i18n
  - multilanguage
role: specialist
scope: implementation
output-format: code
---

# React i18n Expert (AIFinOps)

Especialista en internacionalización (i18n) para el frontend de AIFinOps. Define las reglas estrictas y flujos de trabajo para asegurar que la aplicación soporte un cambio de idioma fluido (Español / Inglés) en todos sus componentes.

## Cuándo activar esta Skill

- Durante la ejecución de `/opsx-apply` en tareas que afecten al Frontend/React.
- Al crear o refactorizar componentes React (`.tsx`) en `frontend/src/components` o `frontend/src/pages`.
- Al añadir nuevos textos, avisos, badges, alertas, tooltips o gráficos.

## Reglas Obligatorias (MUST DO)

1. **Uso del Hook `useTranslation`**:
   - Inyectar siempre `const { t } = useTranslation();` de `react-i18next` en los componentes React.
   - Envolver todo texto visible al usuario con `t('namespace.clave')`.

2. **Mantenimiento Simétrico de Diccionarios (`frontend/src/lib/i18n.ts`)**:
   - Cada clave añadida al diccionario `es.translation` **DEBE** tener obligatoriamente su traducción correspondiente en `en.translation`.
   - Organizar las claves por namespaces lógicos: `header`, `kpis`, `charts`, `table`, `analytics`, `alerts`, `notifications`, `common`.

3. **Elementos Específicos a Traducir**:
   - **Gráficos (Recharts)**: Traducir etiquetas de ejes ($X$ y $Y$), leyendas, nombres de series y `formatter` de Tooltips.
   - **Badges y Estados**: Traducir estados como `"Activas"` / `"Active"`, `"Óptimo"` / `"Optimal"`, `"Alerta"` / `"Warning"`.
   - **Banners y Notificaciones**: Traducir títulos, descripciones y acciones de los banners de presupuesto (`BudgetWarningBanner`) y del panel de notificaciones (`NotificationDrawer`).
   - **Estados de Carga y Error**: Traducir mensajes dentro de `Skeletons.tsx` y componentes `ErrorState`.

4. **Interpolación de Variables**:
   - Utilizar interpolación de `i18next` para valores dinámicos en lugar de concatenación manual de cadenas.
   - Ejemplo: `t('notifications.count', { count: 5 })`.

## Reglas Prohibidas (MUST NOT DO)

- **Cadenas duras (Hardcoded Strings)**: Prohibido incluir literales en castellano o inglés directamente en los elementos JSX/TSX.
- **Concatenación manual de traducciones**: No unir `t('key1') + " " + t('key2')`, definir una sola clave estructurada.
- **Traducciones asimétricas**: No dejar claves presentes en `es` pero ausentes en `en` (o viceversa).

## Flujo de Trabajo para Aplicar i18n en una Tarea

1. **Identificar Literales**: Escanear el archivo `.tsx` en busca de textos estáticos.
2. **Definir Claves en `i18n.ts`**: Añadir las entradas equivalentes en los objetos `es.translation` y `en.translation`.
3. **Reemplazar en Componente**: Sustituir el texto plano por `{t('namespace.key')}`.
4. **Verificación de Compilación**: Ejecutar `npm run build` en el directorio `frontend/` para asegurar que no hay errores de sintaxis ni tipos rotos.
