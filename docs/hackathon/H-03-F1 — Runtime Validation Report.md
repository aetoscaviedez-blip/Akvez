# H-03 · Fase 1 — Informe de Validación de Runtime

| Campo | Valor |
| --- | --- |
| Documento | **H-03-F1 — Runtime Validation Report** |
| Clasificación | **Informe de validación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Parcial** — todo lo verificable sin credenciales, hecho. **Lo demás, bloqueado** |
| Fecha | 2026-08-04 |
| Antecedentes | H-03 §3.1 *(fase 0)* · AKVEZ-02 · H-01 |

---

# 1. Objetivo

**Conocer el estado real del runtime antes de construir cualquier UI.** El sprint lo exige: *«No continuar hasta conocer el estado real.»*

---

# 2. Cambios realizados

> ## **NINGUNO. Cero líneas de código.**

**Esta fase es de medición.** Todo lo que sigue procede de leer el código y contar, no de ejecutarlo.

# 3. Archivos modificados

> ## **Ninguno.** Verificado por fecha de modificación sobre `src/` y `server/`.

---

# 4. Resultados de la validación

## 4.1 ✅ Modelo de IA — **RESUELTO**

**Riesgo abierto desde H-01: *«`gemini-3.5-flash` sin verificar; si no existe, todo cae al respaldo en silencio»*.**

| Comprobación | Resultado |
| --- | :-: |
| SDK instalado | **`@google/genai` v2.14.0** |
| ¿`gemini-3.5-flash` figura en los tipos del SDK? | ✅ **SÍ** |

**Identificadores declarados en los `.d.ts` del SDK:**

```
gemini-2.0-flash · gemini-2.0-flash-001 · gemini-2.0-flash-lite
gemini-2.5-flash · gemini-2.5-flash-lite · gemini-2.5-pro
gemini-3-flash-preview · gemini-3-pro-preview
gemini-3.1-flash-lite · gemini-3.1-pro-preview
gemini-3.5-flash   ← el que AKVEZ usa
gemini-3.6-flash
gemini-flash-latest · gemini-flash-lite-latest
```

> ### **El identificador es válido según el SDK.** El riesgo de *«modelo inexistente ⇒ 404 ⇒ respaldo silencioso»* **queda muy reducido**.

⚠️ **Matiz honesto:** que el SDK lo declare **no garantiza** que el proyecto GCP tenga acceso a ese modelo ni que la clave esté habilitada para él. **Sigue haciendo falta una llamada real** — pero ya no es una incógnita ciega.

**Observación:** existe **`gemini-3.6-flash`**, más reciente. **No se propone cambiarlo** — el encargo prohíbe tocar el modelo, y `3.5-flash` es válido.

## 4.2 🔴 Credenciales — **AUSENTES**

```
GOOGLE_PLACES_API_KEY: AUSENTE
GEMINI_API_KEY:        AUSENTE
.env:                  NO EXISTE
```

**Y crear un `.env` no bastaría:** `dotenv` está en `package.json:19` y **nunca se importa**; `"dev": "tsx server.ts"` no pasa `--env-file`.

## 4.3 ⭐ Coste por búsqueda — **MEDIDO POR PRIMERA VEZ**

**Hasta ahora lo describí como *«decenas de llamadas»*. Aquí está el número exacto.**

### Consultas a Places API por búsqueda

| Ciudad | Zonas en `zones.ts` | **Sub-consultas** | Resultados máx. *(`pageSize: 20`)* |
| --- | :-: | :-: | :-: |
| **Bogotá** | 19 | **20** | **400** |
| **Medellín** | 15 | **16** | 320 |
| **Cali** | 14 | **15** | 300 |
| **Barranquilla** | 14 | **15** | 300 |
| Cualquier otra | — | **1** | 20 |

**Fórmula:** `1 (consulta general) + N (zonas de la ciudad)`, **todas en paralelo** *(`Promise.allSettled`, `googlePlacesAdapter.ts:86`)*.

> ### ⚠️ **«Buscar más» repite el ciclo completo.** Cada pulsación son **otras 20 consultas** en Bogotá.
>
> **Una demo con una búsqueda y dos «buscar más» en Bogotá = 60 consultas facturables.**

### 🔴 Llamadas a Gemini — sin límite superior

**`analyzeProspects.ts:139` — `const selected = scored;`**

> **No hay recorte. Se analizan TODOS los leads deduplicados.**

El código lo justifica expresamente *(línea 145)*: **ADR-11 §8.2** prohíbe a `application/` imponer limitaciones sobre el conjunto. **Es correcto arquitectónicamente y caro operativamente.**

| Parámetro | Valor |
| --- | :-: |
| Tamaño de tanda *(WS-01)* | **10 leads** |
| Tandas simultáneas *(WS-02)* | **5** |
| **Llamadas a Gemini** | **`ceil(leads_únicos / 10)`** |
| Reintentos por llamada | **hasta 5**, solo ante errores transitorios |

**Escenario Bogotá:** 400 resultados brutos → deduplicados por `place.id` → **si quedan ~150 únicos, son ~15 llamadas a Gemini**. Con reintentos por cuota, hasta 75.

### ⚠️ Nivel de facturación de Places

El `FieldMask` incluye **`rating` y `userRatingCount`** *(`googlePlacesAdapter.ts:70`)*, campos que **elevan el SKU** de Text Search en Places API (New).

> **No indico precios**: cambian y no debo afirmarlos de memoria. **Lo verificable es el número de llamadas y su composición de campos** — con eso, el precio se calcula contra el tarifario vigente de GCP.

## 4.4 ✅ Visibilidad de errores — verificada por lectura

| Fallo | ¿Visible? | Dónde |
| --- | :-: | --- |
| Falta `GOOGLE_PLACES_API_KEY` | ✅ **HTTP 400 explícito** | `prospectSearchRoute.ts:39` |
| Places falla por completo | ✅ **HTTP 500** | `googlePlacesAdapter.ts:113` → ruta `:94` |
| Places falla parcialmente | ⚪ Absorbido, registrado en consola | Correcto por **R-64** |
| **Gemini no responde** | ✅ **Declarado en UI** | H-02B — *«Análisis sin IA»* |
| **Pitch por plantilla** | ✅ **Declarado en UI** | H-02D — `FALLBACK_TEMPLATE` |
| **Origen de pitch desconocido** | ✅ **Declarado** | H-02D |

> ### **Ningún fallo es hoy silencioso en la experiencia visible.** Es el resultado acumulado de H-02A → H-02D.

## 4.5 🔴 Lo que NO pudo validarse

| # | Validación | Bloqueado por |
| :-: | --- | --- |
| **1** | Que Places responda de verdad | Credencial ausente |
| **2** | Que el modelo responda con **esta** clave y proyecto | Credencial ausente |
| **3** | **Duración real** de una búsqueda | Ídem |
| **4** | **Ratio de deduplicación real** *(400 brutos → ¿cuántos únicos?)* | Ídem |
| **5** | Calidad del análisis de Gemini | Ídem |
| **6** | Coste monetario efectivo | Ídem + tarifario |

> **El punto 4 es el que más importa para el coste:** determina cuántas llamadas a Gemini se hacen. **Solo se conoce ejecutando.**

---

# 5. Procedimiento de validación — listo para ejecutar

**Cuando haya credenciales. No requiere ningún cambio de código.**

```bash
# 1 · Credenciales en el proceso (dotenv NO se carga)
export GOOGLE_PLACES_API_KEY="..."
export GEMINI_API_KEY="..."

# 2 · Arrancar
npm run dev

# 3 · Búsqueda de coste mínimo: ciudad SIN zonas = 1 sola consulta
curl -s -X POST localhost:3000/api/prospect/search \
  -H "Content-Type: application/json" \
  -d '{"industry":"Restaurantes","location":"Manizales","designerStyle":"minimalista"}' \
  | head -c 2000
```

## 5.1 Qué observar

| Señal | Dónde | Significado |
| --- | --- | --- |
| **`metadata.usedFallbackEngine`** | Respuesta | `false` ⇒ **Gemini respondió** · `true` ⇒ respaldo |
| **`[Places API] Consulta exitosa: …`** | Consola | Places respondió |
| **Reporte de ejecución** | Consola, al final | **consultas · encontrados · deduplicados · llamadas Gemini · reintentos · modelo · ms** |
| `Gemini no devolvió análisis para N de N` | Consola | Respaldo, con recuento |

> ### ⚠️ **Empezar por una ciudad sin zonas** —Manizales, Pereira, Bucaramanga— **es 1 consulta en lugar de 20.** Valida la cadena completa con el mínimo gasto.

## 5.2 Los tres casos a comprobar

| Caso | Cómo | Esperado |
| --- | --- | :-: |
| **IA activa** | Ambas credenciales | 🟢 *«Analizado con IA»* · `usedFallbackEngine: false` |
| **Respaldo** | **Solo Places**, sin `GEMINI_API_KEY` | 🟠 *«Análisis sin IA»* · `true` |
| **Sin credencial** | Ninguna | 🔴 **HTTP 400** explícito |

**El segundo es reproducible hoy mismo con solo la clave de Places.**

---

# 6. Impacto arquitectónico

> ## **Ninguno. No se modificó código.**

| Comprobación | Estado |
| --- | :-: |
| `domain/` · `application/` · `infrastructure/` · `presentation/` | ✅ Intactos |
| Contratos públicos | ✅ Intactos |
| `docs/blueprint/` | ✅ Intacto |
| Lógica de dominio en UI | ✅ Ninguna |
| Datos falsos creados | ✅ Ninguno |
| Fallbacks silenciosos introducidos | ✅ Ninguno |

---

# 7. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Archivos `.ts`/`.tsx` modificados | **0** |

---

# 8. Riesgos

| # | Riesgo | Sev. | Estado |
| :-: | --- | :-: | --- |
| **1** | **La demo no puede ejecutarse.** Sin credenciales en el proceso, HTTP 400 al primer clic | 🔴 **Alta** | **Bloqueante** — requiere decisión §9 |
| **2** | **Coste de Bogotá: 20 consultas por búsqueda**, y «Buscar más» repite | 🟡 **Media** | **Medido.** Mitigable eligiendo ciudad |
| **3** | **Llamadas a Gemini sin techo** — `ceil(únicos/10)`, hasta 5 reintentos cada una | 🟡 Media | **Correcto por ADR-11 §8.2.** No se propone limitar |
| **4** | **Ratio de deduplicación desconocido** ⇒ el coste de Gemini no es predecible | 🟡 Media | Solo medible ejecutando |
| **5** | **Acceso al modelo no confirmado** para la clave concreta | 🟡 **Media** *(era 🔴)* | **Reducido** — §4.1 |
| **6** | **Arranque en frío** si se despliega en Cloud Run + búsqueda lenta | 🟡 Media | Fase 3 |
| **7** | **Cero pruebas del camino de demo** | 🟡 Media | Deuda asumida |

## 8.1 Riesgo cerrado en esta fase

> ✅ **«Modelo inexistente ⇒ respaldo silencioso»** — abierto desde H-01, **degradado de 🔴 a 🟡**: el identificador es válido según el SDK.

---

# 9. Próximo paso recomendado

## 9.1 🔴 Decisión bloqueante

> ### **¿Cómo llegan las credenciales al proceso?**

| Opción | Cambio | Ventaja |
| --- | :-: | --- |
| **A · Exportar en el shell** | **Cero código** | Inmediato. **Recomendada para validar hoy** |
| **B · `import "dotenv/config"` en `server.ts`** | **1 línea** | Reproducible; `dotenv` ya es dependencia |
| **C · Secrets de plataforma** | Cero código | Es lo que `.env.example` asume — **necesario para Cloud Run** |

**Recomiendo A para la validación inmediata y C para el despliegue.** **B solo si quieres ejecución local reproducible por terceros.**

## 9.2 Orden inmediato

| # | Acción | Requiere |
| :-: | --- | :-: |
| **1** | **Ejecutar §5 con una ciudad sin zonas** — valida la cadena completa con 1 consulta | Credenciales |
| **2** | **Anotar del reporte:** deduplicación real, llamadas a Gemini, duración | — |
| **3** | **Repetir en Bogotá** una sola vez y comparar coste | — |
| **4** | **Elegir el nicho y la ciudad de la demo** con esos datos | — |

## 9.3 Qué puede avanzar en paralelo, sin credenciales

| Fase | Motivo |
| --- | :-: |
| **H-03.4 · Cloud** — `Dockerfile` | No depende de la UI ni de credenciales para construirse |
| **H-03.1 · Reliability** — estados vacíos y de error | Solo UI |

> ⚠️ **Las fases 2 y 3 de H-03 —Opportunity View y AI Showcase— siguen esperando la aprobación de las dos ampliaciones de DTO** *(H-03 §6.2)*. **Esta fase no las desbloquea.**

---

# 10. Referencias

**Medido en:** `server/modules/lead-hunter/domain/zones.ts` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:37-59,70,86,113` · `server/modules/lead-analyzer/application/analyzeProspects.ts:139,145` · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:9,24-27` · `server/shared/ai/generateWithRetry.ts` · `node_modules/@google/genai` **v2.14.0** *(typings)*

**Verificado sin modificar:** `server/shared/config/env.ts` · `server/routes/prospectSearchRoute.ts:39,81,94` · `server/shared/observability/executionReport.ts` · `package.json:7,19`

**Documentos:** H-03 §3.1 · H-02D · H-02B · H-02C · AKVEZ-02 §1.2, §2.1, §3 · H-01 · DEV-00 R-64 · **ADR-11 §8.2**
