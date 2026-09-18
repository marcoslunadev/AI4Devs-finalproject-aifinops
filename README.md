# AIFinOps - Plataforma de Observabilidad y FinOps de IA

AIFinOps es una plataforma integral diseñada para monitorizar, auditar y optimizar el consumo de modelos y agentes de IA (OpenAI, Google Gemini, Anthropic, etc.) a nivel de organizaciones, departamentos y usuarios, ofreciendo visibilidad multidimensional filtrable por entornos (DEV, PRE y PRO).

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar el proyecto:
- **Node.js** (v18+)
- **NPM** (v9+)
- **Docker Desktop** (o Docker Engine con Docker Compose v2+)

## 🛠️ Instalación y Configuración Inicial

1. **Clonar el repositorio y acceder al directorio:**
   ```bash
   git clone https://github.com/marcoslunadev/AI4Devs-finalproject-aifinops.git
   cd AI4Devs-finalproject-aifinops
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
npm run dev:backend
```
El servidor backend estará disponible en `http://localhost:3000`.

**Terminal 2 (Frontend - React SPA):**
```bash
npm run dev:frontend
```
La aplicación web estará disponible en `http://localhost:5173`.

## 📚 Documentación de Negocio y Producto

Para entender el "Qué", "Por qué" y "Para quién" de este software, consulta el **Documento de Requisitos del Producto (PRD)**:
👉 [Ver PRD (Product Requirements Document)](docs/PRD.md)
