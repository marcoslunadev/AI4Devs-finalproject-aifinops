## 1. Setup Base y Configuraciones
- [x] 1.1 Instalar e inicializar `i18next` y `react-i18next` con diccionarios de idiomas (en, es).
- [x] 1.2 Crear el componente `ThemeProvider` para gestionar la preferencia (Claro/Oscuro) inyectando la clase `dark` en HTML.

## 2. Layout y Controles Generales
- [x] 2.1 Crear el componente `DashboardLayout` que incluya un Header.
- [x] 2.2 Agregar controles en el Header para alternar Idioma y Tema (Claro/Oscuro).

## 3. Componentes de Métrica (KPIs) y Gráficos
- [x] 3.1 Crear un componente UI reutilizable `KpiCard` para mostrar indicadores numéricos globales.
- [x] 3.2 Instalar `recharts` y crear el componente `CostChart` para renderizar la evolución temporal de costes y tokens.

## 4. Tabla de Drill-down Jerárquico
- [x] 4.1 Diseñar e implementar el componente `DrillDownTable` usando HTML `<table/>` nativo y Tailwind.
- [x] 4.2 Agregar lógica de estado local a la tabla para expandir/contraer filas simulando la navegación Organización -> Departamento -> Usuario.

## 5. Integración Final del Dashboard
- [x] 5.1 Integrar todos los componentes (Tarjetas KPI, Gráficos y Tabla) en `pages/Dashboard.tsx`.
- [x] 5.2 Alimentar temporalmente con datos "mock" hardcodeados para validar la visualización y el i18n.
