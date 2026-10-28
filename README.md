# AIFinOps — Plataforma de Observabilidad, Gobernanza y FinOps de IA

AIFinOps es una plataforma integral diseñada para monitorizar, auditar y optimizar el consumo de modelos y agentes de IA (OpenAI, Google Gemini, Anthropic, etc.) a nivel de organizaciones, departamentos y usuarios, ofreciendo visibilidad multidimensional filtrable por entornos (DEV, PRE y PRO).

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar el proyecto:
- **Node.js** (v22+ LTS)
- **NPM** (v10+)
- **Docker Desktop** (o Docker Engine con Docker Compose v2+)

## 🛠️ Instalación y Configuración Inicial

1. **Clonar el repositorio y acceder al directorio:**
   ```bash
   git clone https://github.com/marcoslunadev/AI4Devs-finalproject.git
   cd AI4Devs-finalproject
   ```

2. **Configuración de Variables de Entorno:**
   Copia el archivo de ejemplo para configurar el entorno local:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de que la variable `DATABASE_URL` apunte al contenedor local de PostgreSQL.

3. **Levantar la Infraestructura Local:**
   Arranca la base de datos PostgreSQL utilizando Docker Compose:
   ```bash
   docker compose up -d
   ```

4. **Instalación de Dependencias:**
   Instala todas las dependencias del proyecto:
   ```bash
   npm install
   ```

5. **Configuración de la Base de Datos:**
   Ejecuta las migraciones de Prisma para generar el esquema y genera el cliente, y luego inserta los datos semilla:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## ⚙️ Arranque de Servicios (Desarrollo)

Para iniciar los servidores en modo desarrollo, abre dos terminales distintas:

**Terminal 1 (Backend - API REST):**
```bash
cd backend
npm run dev
```
El servidor backend estará disponible en `http://localhost:3000`.

**Terminal 2 (Frontend - React SPA):**
```bash
cd frontend
npm run dev:frontend
```
La aplicación web estará disponible en `http://localhost:5173`.

## 🎨 Sistema de Diseño y Look & Feel

AIFinOps implementa un sistema de diseño visual unificado y tecnológico basado en **TailwindCSS v4**, optimizado para herramientas analíticas y de observabilidad de alta precisión:

### Tokens y Paleta de Color
* **Modo Oscuro (Dark Mode):**
  * Fondo principal: `#080b11` (Obsidian Deep).
  * Superficies modulares (tarjetas, tablas, modales): `#0f1420` con bordes sutiles `border-white/10`.
  * Superficies elevadas (dropdowns, inputs, popovers): `#171e2e`.
* **Modo Claro (Light Mode):**
  * Fondo principal: `#f8fafc` (Slate 50).
  * Superficies de tarjetas y tablas: `#ffffff` con bordes `border-slate-200`.
* **Acentos de Interacción y Métricas:**
  * **Cian (`#06b6d4` / `#0891b2`):** Elementos interactivos, foco, navegación activa y curvas temporales.
  * **Esmeralda (`#10b981` / `#059669`):** Métricas monetarias en USD, cumplimiento presupuestario y estados exitosos.
  * **Gradiente Insignia:** `linear-gradient(135deg, #06b6d4 0%, #10b981 100%)` para botones principales, badges y pestañas activas.

### Jerarquía Tipográfica
* **`Outfit` (`font-heading`):** Títulos, encabezados ejecutivos y nombres de sección.
* **`Inter` (`font-sans`):** Textos descriptivos, controles, botones y contenido de tablas.
* **`JetBrains Mono` (`font-mono`):** Importes financieros, recuentos de tokens, latencias y códigos de identificación.

### Identidad Visual y Theming
* **Emblema Tecnológico:** Logotipo CPU alojado en contenedor squircle con gradiente cian-esmeralda en la cabecera y la pantalla de acceso.
* **Favicon Corporativo:** Silueta vectorial SVG adaptada a los tonos cian y esmeralda.
* **Carga Anti-FOUC:** Script inline en `index.html` para transición instantánea de tema sin parpadeos al recargar.

## 📚 Documentación de Negocio y Producto

Para entender el "Qué", "Por qué" y "Para quién" de este software, consulta el **Documento de Requisitos del Producto (PRD)**:
👉 [Ver PRD (Product Requirements Document)](docs/PRD.md)
