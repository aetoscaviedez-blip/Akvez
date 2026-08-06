import { defineConfig } from "vitest/config";

// Entorno de pruebas de AKVEZ (R-6 · APS-12).
//
// Cubre `server/` y `src/`. La cobertura no se exige todavía como umbral: fijar
// un porcentaje mínimo sería un parámetro operativo sin valor aprobado (R-52).
export default defineConfig({
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
