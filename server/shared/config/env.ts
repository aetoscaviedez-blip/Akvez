// Lectura y validación centralizada de la configuración de entorno.
//
// Origen normativo: ADR-04 §11 declara que `shared/config` contiene la
// "lectura y validación centralizada de GEMINI_API_KEY, GOOGLE_PLACES_API_KEY,
// etc., reemplazando las lecturas dispersas de `process.env`", y es
// "accesible desde cualquier capa".
//
// REGLA: ningún otro fichero del backend lee `process.env` directamente.
// Este módulo es la única frontera con el entorno del proceso.
//
// No valida al importar: una variable ausente es un estado legítimo en
// desarrollo, y fallar durante la carga del módulo impediría arrancar el
// servidor precisamente cuando hace falta diagnosticar el problema.

/** Credencial del proveedor de IA. Ausente es estado válido: existe respaldo. */
export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/** Credencial del proveedor de descubrimiento. Ausente es estado válido. */
export function getGooglePlacesApiKey(): string | undefined {
  return process.env.GOOGLE_PLACES_API_KEY;
}

/**
 * Entorno de ejecución declarado, normalizado a minúsculas para que
 * `Production` y `production` no produzcan comportamientos distintos.
 */
export function getNodeEnv(): string {
  return (process.env.NODE_ENV || "").trim().toLowerCase();
}

/**
 * Verdadero solo en producción declarada.
 *
 * Conserva exactamente la semántica previa de `startServer.ts`, que servía
 * assets estáticos únicamente cuando `NODE_ENV === "production"` y usaba Vite
 * en modo middleware en cualquier otro caso.
 */
export function isProduction(): boolean {
  return getNodeEnv() === "production";
}

/** Puerto por defecto cuando el entorno no declara ninguno. */
const DEFAULT_PORT = 3000;

/**
 * Puerto de escucha del servidor HTTP.
 *
 * Cierra la desviación **T-14**: `startServer.ts` fijaba `const PORT = 3000` e
 * ignoraba `process.env.PORT`, lo que impedía desplegar en cualquier entorno que
 * asigne el puerto (Cloud Run, Heroku, contenedores). La lectura vive aquí porque
 * `shared/config` es **la única frontera con el entorno del proceso**
 * (ADR-04 §11 · DEV-00 RI-9).
 *
 * Un valor ausente, vacío, no numérico o fuera del rango válido de puertos TCP
 * **cae al valor por defecto** en lugar de arrancar en un puerto imprevisto o
 * hacer caer el proceso: la configuración inválida no debe impedir diagnosticar
 * el problema, que es el mismo criterio que ya sigue el resto de este módulo.
 */
export function getPort(): number {
  const raw = (process.env.PORT || "").trim();
  if (raw === "") return DEFAULT_PORT;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    console.warn(`[config] PORT="${raw}" no es un puerto válido. Se usa ${DEFAULT_PORT}.`);
    return DEFAULT_PORT;
  }
  return parsed;
}
