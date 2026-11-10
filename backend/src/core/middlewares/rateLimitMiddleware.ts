import rateLimit from "express-rate-limit";

/**
 * Limitador global de peticiones para mitigar flooding y ataques DoS a nivel de aplicación.
 * 120 peticiones por ventana de 1 minuto por dirección IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones desde esta IP. Por favor, inténtelo de nuevo más tarde.",
  },
  skip: () => process.env.NODE_ENV === "test" && process.env.TEST_RATE_LIMIT !== "true",
});

/**
 * Limitador estricto para el endpoint de autenticación /login.
 * 10 intentos por ventana de 15 minutos por dirección IP para evitar fuerza bruta y saturación de CPU por bcrypt.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos de autenticación desde esta IP. Acceso temporalmente bloqueado.",
  },
  skip: () => process.env.NODE_ENV === "test" && process.env.TEST_RATE_LIMIT !== "true",
});
