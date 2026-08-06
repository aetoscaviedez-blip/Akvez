import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { registerRoutes } from "../routes";
import { buildApplicationDependencies } from "./compositionRoot";
import { isProduction, getPort } from "../shared/config/env";

export async function startServer(): Promise<void> {
  const app = express();
  // T-14 — el puerto procede del entorno a través de `shared/config`, única
  // frontera con `process.env` en el backend (ADR-04 §11).
  const PORT = getPort();
  app.use(express.json());

  // Composition Root: se construye el grafo de dependencias una única vez,
  // antes de registrar rutas (ADR-09 §5.1, §6).
  const dependencies = buildApplicationDependencies();
  registerRoutes(app, dependencies);

  // Static serving
  // La lectura de entorno pasa por `shared/config` — única frontera con
  // `process.env` en el backend (ADR-04 §11). Semántica idéntica a la anterior.
  if (!isProduction()) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor LeadFlow corriendo en http://0.0.0.0:${PORT}`);
  });
}
