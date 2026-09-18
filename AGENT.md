# Reglas de Agente (AIFindOps)

Este archivo define el contexto y las reglas que cualquier agente de Inteligencia Artificial debe seguir al contribuir a este proyecto.

## 1. Contexto del Proyecto
AIFindOps es una plataforma de observabilidad y FinOps diseñada para monitorizar, auditar y optimizar el consumo de modelos de Inteligencia Artificial (OpenAI, Gemini, etc.) a nivel organizativo, departamental y de usuario.

## 2. Stack Tecnológico
Todas las implementaciones y resoluciones de problemas deben utilizar estrictamente este stack:
- **Frontend:** React 18+ (SPA), Vite, TypeScript, TailwindCSS, Lucide Icons, Recharts. Estado con Zustand/React Query.
- **Backend:** Node.js, Express, TypeScript. Arquitectura en capas (Clean Architecture).
- **Base de Datos:** PostgreSQL 16 (contenerizada con Docker Compose), ORM Prisma.
- **Seguridad:** JWT, encriptación bcrypt, validación con Zod, Helmet.

## 3. Arquitectura y Patrones de Código
- **Backend:** Se debe mantener una separación estricta entre Controladores (HTTP), Servicios (Lógica de Negocio) y Repositorios (Acceso a Datos).
- **Base de Datos:** Las modificaciones al esquema deben hacerse siempre a través de `schema.prisma`. Tras cualquier cambio, se debe ejecutar `npx prisma migrate dev` para mantener la sincronización y generar los tipos.
- **Frontend:** Uso exclusivo de componentes funcionales de React con Hooks. Estilos mediante clases utilitarias de TailwindCSS. Evitar CSS custom salvo excepciones justificadas.
- **Validaciones:** Toda entrada de datos en la API debe ser validada con `Zod` antes de llegar a los servicios.

## 4. Orquestación e Infraestructura
- El entorno de desarrollo depende de un contenedor Docker para PostgreSQL.
- Para arrancar la base de datos se debe ejecutar: `docker compose up -d` desde el directorio raíz o `/docker`.
- No modificar el esquema de variables de entorno sin actualizar `.env.example`.

## 5. Directrices de Comunicación del Agente
- Respuestas precisas, enfocadas en el código.
- Mantener los comentarios en el código en español, al igual que la documentación.
- Si una librería requerida no está instalada, procede a instalarla (ej. `npm install ...`) justificándolo brevemente.
