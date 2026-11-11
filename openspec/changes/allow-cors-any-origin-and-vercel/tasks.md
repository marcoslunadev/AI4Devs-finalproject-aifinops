## 1. Configuración de Middlewares en Backend

- [x] 1.1 Configurar el middleware `cors` en `backend/src/app.ts` con resolución permisiva y dinámica (`origin: true`, `credentials: true`), métodos REST permitidos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`), cabeceras autorizadas (`Content-Type`, `Authorization`, `X-Requested-With`) y tiempo de preflight `maxAge`.
- [x] 1.2 Configurar `helmet` en `backend/src/app.ts` con la directiva `crossOriginResourcePolicy: { policy: "cross-origin" }` para permitir el consumo de recursos desde orígenes cruzados sin bloqueos de navegador.
- [x] 1.3 Actualizar `backend/.env.example` para documentar la configuración de orígenes y entorno si aplica.

## 2. Pruebas Automatizadas y Verificación

- [x] 2.1 Implementar tests de integración en backend para validar peticiones enviadas con el origen desplegado en Vercel (`https://ai-4-devs-finalproject-aifinops.vercel.app`), verificando que se devuelva la cabecera `Access-Control-Allow-Origin` adecuada.
- [x] 2.2 Implementar tests de integración en backend con orígenes arbitrarios (ej. `https://random-client.example.com`, `http://localhost:5173`) confirmando que no se emiten errores de CORS y se responde satisfactoriamente.
- [x] 2.3 Implementar tests de peticiones preflight HTTP (`OPTIONS`) asegurando respuesta exitosa (`200` o `204`) con las cabeceras `Access-Control-Allow-Methods` y `Access-Control-Allow-Headers`.
- [x] 2.4 Validar la presencia de la cabecera `Cross-Origin-Resource-Policy: cross-origin` en las respuestas HTTP generadas por Helmet.
- [x] 2.5 Ejecutar la suite completa de pruebas con verificación de umbrales de cobertura (`npm test`) garantizando que la cobertura se mantenga superior al 80% (>= 80%).
