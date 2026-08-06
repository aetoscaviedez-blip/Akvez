// ⚠️ **Debe ir antes que cualquier otro import (H-12 · P0).**
//
// `dotenv` figuraba en `package.json` desde el inicio del proyecto, pero
// **ningún fichero lo importaba nunca**. El efecto: un `.env` local se
// escribía y no se leía, `process.env.GOOGLE_PLACES_API_KEY` quedaba
// `undefined`, y la búsqueda respondía «Falta la clave [...] en los Secrets»
// aunque la clave estuviera correctamente puesta en el fichero.
//
// **Producción nunca estuvo afectada:** Cloud Run inyecta los secretos como
// variables de entorno reales (`cloudbuild.yaml --set-secrets`), así que
// `process.env` ya viene poblado y `dotenv` no encuentra fichero y no hace
// nada. El eslabón roto era exclusivamente el desarrollo local.
//
// El import va primero porque `startServer` construye el Composition Root, y
// los adapters reciben su credencial **en el arranque** (ADR-17 §6.3 P-4): si
// el entorno se poblara después, ya sería tarde.
import "dotenv/config";

import { startServer } from "./server/bootstrap/startServer";

startServer();
