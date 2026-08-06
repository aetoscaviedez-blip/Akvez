# H-03B — AI Showcase DTO Implementation Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-03B — AI Showcase DTO Implementation Audit** |
| Clasificación | **Registro de implementación / auditoría técnica** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Tareas 1, 2 y 3 completadas** *(auditoría y diseño)* · 🔴 **Tarea 4 NO implementada** — dos bloqueos, §5 |
| Fecha | 2026-08-05 |
| Sprint | **H-03B — AI Showcase Backend (DTO)** |
| Antecedentes | H-03-F2 *(ampliación aditiva del mismo DTO)* · H-02B — AI Transparency Audit · DP-02 · DEV-00 §3.11 |

> **Cero cambios de código.** No se ha modificado ni un fichero de `server/` ni de `src/`. Este documento audita, diseña y **se detiene antes de implementar**, conforme a la restricción de CLAUDE.md sobre conflictos con el Blueprint.

---

# 1. Tarea 1 — Auditoría del `executionReport`

## 1.1 Dónde vive y cómo funciona

| Aspecto | Hecho |
| --- | --- |
| **Fichero único** | `server/shared/observability/executionReport.ts` — **431 líneas** |
| **Se crea** | `runWithExecutionReport()` *(línea 132)*, invocado por `prospectSearchRoute.ts:47` y `prospectOutreachRoute.ts` |
| **Ámbito** | **Por request**, mediante `AsyncLocalStorage` *(línea 121)* — dos búsquedas concurrentes no se pisan los datos |
| **Se llena** | **24 llamadas `record*`** repartidas en 9 ficheros de `application/`, `infrastructure/`, `routes/` y `shared/ai/` |
| **Se consume** | ⚠️ **Un único consumidor:** `printExecutionReport()` → `console.log`. **Nada más lo lee** |
| **Se emite** | En el `finally` de la ruta *(`prospectSearchRoute.ts:99`)* — también en la rama de error |

## 1.2 Estructura completa — `ExecutionReport`

| Campo | Tipo | Se registra en | Contenido |
| --- | --- | --- | --- |
| `flow` | `"LEAD_HUNTER" \| "PITCH_GENERATOR"` | Apertura | Flujo instrumentado |
| `timestamp` | `string` ISO | Apertura | Inicio del request |
| `startedAt` | `number` | Apertura | Marca para el tiempo total |
| `subject` | `Array<[string,string]>` | Apertura | `City:` / `Niche:` — **saneados** |
| `googlePlaces` | `{queries, found, ms}` | `googlePlacesAdapter.ts:110` | Sub-consultas, registros crudos, duración |
| `deduplication` | `{before, after, ms}` | `discoverProspects.ts:106` | Antes/después de deduplicar |
| `persistence` | `{saved, ids[], ms}` | `discoverProspects.ts:183` | Leads registrados e **identificadores internos** |
| `leadAnalyzer` | `{received, analyzed, ms}` | `analyzeProspects.ts:349` | Recibidos vs. analizados |
| `gemini` | `{model, success, ms, fallback, fallbackReason?, attempts?, failure?}` | `leadAnalysisAdapter.ts:211,220` · `generateWithRetry.ts:11,14` | ⚠️ **Una sola ranura** — §1.4 |
| `analysis` | `{source, detail?}` | `analyzeProspects.ts:287-296` | `GEMINI` / `FALLBACK` / `GEMINI+FALLBACK` |
| `returned` | `number` | `prospectSearchRoute.ts:66,89` | Leads devueltos |

**Tiempos registrados: cuatro parciales** — `googlePlaces.ms`, `deduplication.ms`, `persistence.ms`, `leadAnalyzer.ms`, más `gemini.ms`. **El tiempo total NO se almacena:** se calcula en el momento de imprimir, `Date.now() - report.startedAt` *(línea 310)*.

## 1.3 Las tres reglas que el propio fichero declara

Transcritas de su cabecera *(líneas 1-24)*:

| Regla declarada | Texto |
| --- | --- |
| **Ubicación** | *«No conoce DTOs, ni contratos públicos, ni persistencia: solo recibe números, nombres y duraciones ya calculados»* |
| **Alcance** | *«Instrumentación pura. Ninguna función de este archivo altera el resultado de la operación que observa: todas devuelven `void`»* |
| **Seguridad** | *«Nunca se registran API Keys ni prompts»* — `sanitizeText` en el punto de registro |

## 1.4 ⚠️ Hallazgo — `gemini` es **una ranura que se sobrescribe**, no un acumulador

**`recordGeminiCall` no suma: reemplaza `report.gemini` completo** *(líneas 174-187)*. Lo mismo `recordGeminiFailure` y `recordGeminiAttempts`.

**Y una búsqueda hace varias llamadas al modelo:**

| Hecho | Evidencia |
| --- | --- |
| El análisis se fragmenta en tandas de **10** *(WS-01)* | `leadAnalysisAdapter.ts:24` |
| Se ejecutan hasta **5 simultáneas** *(WS-02)* | `leadAnalysisAdapter.ts:27` |
| **Cada tanda llama a `recordGeminiCall`** | `leadAnalysisAdapter.ts:220`, dentro de `analyzeBatch` |

> ### **Consecuencia:** en una búsqueda de 30 leads hay **3 llamadas al modelo** y `report.gemini.ms` contiene **la duración de la última en registrarse**, no la suma ni el máximo. Con concurrencia, *cuál* sea la última es no determinista.
>
> **`gemini.attempts` sufre lo mismo:** son los intentos de la última llamada registrada, no del conjunto.
>
> **Esto es correcto para un log de consola** —el reporte describe *una* llamada representativa— **y es engañoso como métrica publicada.** Ver §3.3.

---

# 2. Tarea 2 — Auditoría de `SearchResponseMetadata`

## 2.1 Estructura actual

`server/shared/contracts/prospectSearch.ts:87-89` — **tres líneas**:

```ts
export interface SearchResponseMetadata {
  usedFallbackEngine?: boolean;
}
```

**Su propia documentación la declara diseñada para crecer:**

> *«Contenedor **extensible** para señales futuras (ej. `usedFallbackEngine`). Reemplaza el uso de `message` como mecanismo de control (ADR-06, Decisión Importante 3)»*

## 2.2 Compatibilidad hacia atrás — ✅ verificada

| Consumidor | Fichero | Lectura |
| --- | --- | --- |
| Búsqueda inicial | `src/modules/lead-hunter/application/searchProspects.ts:37` | `!!data.metadata?.usedFallbackEngine` |
| Búsqueda incremental | `src/modules/lead-hunter/application/searchMoreProspects.ts:49,77` | idéntica |
| Pantalla | `LeadHunter.tsx:53,111,151,273` | Booleano de estado |

> **Los tres consumidores leen un campo nominado y ninguno itera las claves de `metadata`.** Añadir propiedades **opcionales** es estrictamente aditivo: **ningún consumidor actual se entera**. Es el mismo patrón validado en **H-03-F2**, donde `LeadResponseDTO` creció en 6 campos sin romper a nadie.

## 2.3 ¿Puede transportar el `executionReport`? — **Sí técnicamente. No arquitectónicamente.**

| Dimensión | Veredicto |
| --- | --- |
| **Capacidad estructural** | ✅ **Sí.** Un objeto opcional anidado cabe sin fricción |
| **Compatibilidad** | ✅ **Sí.** Aditivo puro |
| **Aislamiento del contrato** *(ADR-06 §11)* | ⚠️ El contrato **no puede importar** de `shared/observability`. Exigiría **declarar tipos propios** en `shared/contracts/` y mapear campo a campo — no reexportar `ExecutionReport` |
| **Disponibilidad del dato en la ruta** | 🔴 **No.** §5.1 |
| **Permiso para publicarlo** | 🔴 **No.** §5.2 |

---

# 3. Tarea 3 — Diseño de la ampliación

## 3.1 Los 10 campos pedidos, contra el dato que existe

| # | Campo pedido | ¿Existe? | Origen real | Veredicto |
| :-: | --- | :-: | --- | :-: |
| 1 | `totalQueries` | ✅ | `googlePlaces.queries` | ✅ **Publicable verbatim** |
| 2 | `totalBusinessesFound` | ✅ | `googlePlaces.found` | ✅ **Publicable verbatim** |
| 3 | `uniqueBusinesses` | ✅ | `deduplication.after` | ✅ **Publicable verbatim** |
| 4 | `placesExecutionTime` | ✅ | `googlePlaces.ms` | ✅ **Publicable verbatim** |
| 5 | `modelUsed` | ✅ | `gemini.model` | ✅ **Publicable verbatim** |
| 6 | `duplicatesRemoved` | ⚠️ | `deduplication.before − after` | ⚠️ **Es un cálculo** — prohibido por el propio sprint |
| 7 | `executionTime` | ⚠️ | `Date.now() − startedAt` | ⚠️ **No está almacenado**; se deriva al imprimir |
| 8 | `retryCount` | ⚠️ | `gemini.attempts` | ⚠️ **Semántica distinta** — son *intentos* de **una** llamada, y `1` significa «sin reintentos» |
| 9 | `geminiExecutionTime` | 🔴 | `gemini.ms` | 🔴 **Engañoso** — es la **última** llamada, no el total *(§1.4)* |
| 10 | `geminiCalls` | 🔴 | **No existe** | 🔴 **Sería una métrica nueva** — prohibida por el propio sprint |

> ### **5 de 10 se pueden publicar tal cual. 3 exigen un cálculo que el sprint prohíbe. 1 no existe. 1 publicaría un número que el jurado leería como algo que no es.**

## 3.2 Lo que además existe y nadie pidió

`deduplication.before` · `deduplication.ms` · `leadAnalyzer.received` · `leadAnalyzer.analyzed` · `leadAnalyzer.ms` · `analysis.source` · `analysis.detail` · `gemini.success` · `gemini.fallback` · `gemini.fallbackReason` · `returned`.

> **`analysis.source`** —`GEMINI` / `FALLBACK` / `GEMINI+FALLBACK`— **es el dato más valioso del reporte para el eje AI**: es la declaración explícita del origen del contenido, más precisa que el booleano `usedFallbackEngine` que ya se publica. **Se señala; no se propone publicarlo sin decisión.**

## 3.3 🔴 Lo que **no** debe publicarse en ningún caso

| Campo | Motivo |
| --- | --- |
| **`persistence.ids`** | **Identificadores internos.** UI-9 los prohíbe **por nombre**: *«identificadores técnicos»* |
| **`gemini.failure.*`** | Tipo de error, código HTTP y mensaje del proveedor: **traza de diagnóstico** |
| **`gemini.fallbackReason`** | Mensaje de error saneado, pero **texto de traza** |
| **`subject`** | Redundante: el usuario ya conoce la ciudad y el nicho que pidió |

## 3.4 Diseño propuesto — **listo para implementar si se autoriza**

**Solo los 5 campos de §3.1 que son publicables verbatim.** Ni un cálculo, ni una métrica nueva, ni un dato de §3.3.

```ts
// server/shared/contracts/prospectSearch.ts — ampliación propuesta

/**
 * Métricas de ejecución de la búsqueda. Ampliación ADITIVA y OPCIONAL.
 * Cada campo es un valor YA REGISTRADO durante la ejecución: no se calcula,
 * no se agrega y no se deriva ninguno. Ausente = no se midió (R-38).
 */
export interface SearchExecutionMetricsDTO {
  /** Sub-consultas ejecutadas contra Places, incluidas las fallidas. */
  totalQueries?: number;
  /** Registros crudos devueltos por las sub-consultas exitosas. */
  totalBusinessesFound?: number;
  /** Empresas distintas tras la deduplicación por identidad. */
  uniqueBusinesses?: number;
  /** Duración de la fase de descubrimiento, en milisegundos. */
  placesExecutionTime?: number;
  /** Modelo declarado por el adapter que realizó el análisis. */
  modelUsed?: string;
}

export interface SearchResponseMetadata {
  usedFallbackEngine?: boolean;
  /** Ampliación aditiva: ningún consumidor actual la lee. */
  execution?: SearchExecutionMetricsDTO;
}
```

**Y en `prospectSearchRoute.ts`, dentro del ámbito ya abierto:**

```ts
const report = readExecutionReport();            // ← función que HOY NO EXISTE (§5.1)
metadata: {
  usedFallbackEngine,
  execution: {
    totalQueries:         report?.googlePlaces?.queries,
    totalBusinessesFound: report?.googlePlaces?.found,
    uniqueBusinesses:     report?.deduplication?.after,
    placesExecutionTime:  report?.googlePlaces?.ms,
    modelUsed:            report?.gemini?.model
  }
}
```

**Coste estimado si se autoriza:** ~20 líneas en `prospectSearch.ts`, ~10 en `prospectSearchRoute.ts`, **~4 en `executionReport.ts`** *(el lector)*. **Tres ficheros. Cero cambios en `domain/`, `application/`, `infrastructure/` o persistencia.**

---

# 4. Verificación del §5 del encargo — qué NO cambia

**Nada cambia. No se ha escrito una línea de código.**

| Área | Estado |
| --- | :-: |
| `domain/` · `application/` · `infrastructure/` · persistencia | ✅ **Intactas** |
| Opportunity Score · Gemini · prompts | ✅ **Intactos** |
| `executionReport.ts` | ✅ **Intacto** |
| Lead Hunter · Pitch Generator · UI | ✅ **Intactos** |
| `Dockerfile` · `.dockerignore` · `cloudbuild.yaml` | ✅ **Intactos** — H-03A sin tocar |
| Blueprint | ✅ **Intacto** |

---

# 5. 🔴 Tarea 4 — Por qué no se implementó

## 5.1 Bloqueo A — **El sprint se contradice a sí mismo**

**Restricción del encargo:** *«NO modificar: `executionReport`»*.

**Pero el reporte no tiene lector.** Las 13 funciones exportadas del fichero son 11 `record*` que devuelven `void`, `runWithExecutionReport` y `printExecutionReport`. **El acceso al reporte vivo es `current()`, en la línea 123 — y `current` NO está exportada.** El `AsyncLocalStorage` es privado del módulo *(línea 121)*.

**Las tres vías posibles, y por qué las tres están cerradas:**

| Vía | Choca con |
| --- | --- |
| **A ·** Exportar un lector desde `executionReport.ts` | 🔴 *«NO modificar: `executionReport`»* |
| **B ·** Que la ruta calcule las métricas por su cuenta | 🔴 *«NO crear lógica nueva, cálculos nuevos»*. Además **el dato no está ahí**: el workflow devuelve `{deduplicatedLeads, references, leads}` *(`prospectSearchRoute.ts:53`)* — ni tiempos, ni consultas, ni modelo |
| **C ·** Que `application/` devuelva las métricas | 🔴 *«NO modificar: dominio, aplicación, infraestructura»* |

> ### **No existe una cuarta vía.** Para publicar un dato del reporte hay que poder leerlo, y hoy **nadie puede** salvo el propio fichero. **La Tarea 4 es inejecutable dentro de sus propias restricciones**, con independencia de lo que diga el Blueprint.

## 5.2 Bloqueo B — **Conflicto con una regla vinculante del Blueprint**

| Fuente | Regla |
| --- | --- |
| **DEV-00 §3.11, O-6** | **«Las trazas no se exponen nunca al usuario»** — fuente: APS-04 §A.9 UI-9 |
| **APS-04 §A.9, UI-9** | **«La interfaz no expondrá información interna, identificadores técnicos ni trazas»** — fuente: APS-10 · ADR-07 |
| **DP-02 §4.3, O-6** | Idéntica. Ratificada en GOV-03 e incorporada a DEV-00 en GOV-04 |

**Y el código ya lo dice, en el punto exacto donde habría que tocar** — `prospectSearchRoute.ts:79-80`:

> *«El dato **NO se lee del reporte de observabilidad**: la instrumentación no puede ser fuente de una respuesta HTTP.»*

**Ese comentario documenta una decisión tomada en H-02:** `usedFallbackEngine` **se propaga desde los leads**, no desde el reporte, **pudiendo haberse leído del reporte con menos esfuerzo.** Se eligió la vía costosa precisamente para no convertir la observabilidad en fuente de respuesta.

> ### **DEV-00 es normativo, no consultivo.** O-6 no es una recomendación de DP-02: DP-02 tiene autoridad consultiva *(orden 5)*, pero **O-6 descendió a DEV-00 §3.11 en el sprint GOV-04 con fuerza normativa de ADR-04 §11**. Es exactamente el supuesto en el que un DP sí obliga.

### Matiz que conviene precisar

**O-1 no es el obstáculo.** O-1 dice que *«toda función de registro devuelve `void`»* — un **lector** no es una función de registro y no alteraría el resultado observado. **El obstáculo es O-6 y su fuente UI-9**, que no hablan de cómo se registra sino de **qué llega al usuario**.

**Y el sprint es de backend, sí — pero su objetivo declarado es** *«para que posteriormente puedan mostrarse en la demo»*. **Publicar en el contrato público con el fin declarado de pintarlo es la primera mitad de lo que UI-9 prohíbe**, no una actividad distinta.

## 5.3 Bloqueo C — **Integridad de la demo**, si los otros dos se levantan

**Aunque el PO autorice A y B, dos de los campos pedidos no deberían publicarse tal como se pidieron:**

| Campo | Lo que el jurado leería | Lo que el número es |
| --- | --- | --- |
| **`geminiExecutionTime`** | *«La IA tardó 1,8 s»* | La duración de **una de las 3 tandas** — el total real sería ~3× mayor |
| **`retryCount`** | *«Hubo N reintentos»* | Los **intentos** de la última llamada registrada. `1` = **ninguno** |

> **Esto es exactamente el problema que H-02B y H-02C existieron para cerrar:** que la pantalla afirme sobre la IA algo que el sistema no ha medido. **Un AI Showcase construido sobre métricas mal etiquetadas es más peligroso que no tener AI Showcase**, porque un miembro del jurado puede pedir la cuenta.
>
> **Por eso el diseño de §3.4 los excluye**, aun siendo técnicamente publicables.

---

# 6. Referencias

**Código:** `server/shared/observability/executionReport.ts:26,100-114,121-125,132-143,174-187,219-227,272-280,310` · `server/shared/contracts/prospectSearch.ts:82-96` · `server/routes/prospectSearchRoute.ts:47,53,76-81,83-90,99` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:110` · `server/modules/lead-hunter/application/discoverProspects.ts:106,183` · `server/modules/lead-analyzer/application/analyzeProspects.ts:166-178,280-296,349` · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:9,24,27,211,220` · `server/shared/ai/generateWithRetry.ts:11,14` · `src/modules/lead-hunter/application/searchProspects.ts:37` · `src/modules/lead-hunter/application/searchMoreProspects.ts:49,77` · `src/modules/lead-hunter/presentation/LeadHunter.tsx:53,111,151,273`.

**Blueprint:** **DEV-00 §3.11 (O-1 a O-6)** · **APS-04 §A.9 (UI-9)** · DP-02 §4.1, §4.3, §8.1 · ADR-04 §11 · ADR-06 §10, §11 · ADR-07 · APS-10 · APS-16 §14 · APS-17 §4 (WS-01, WS-02).

**Documentos:** H-03-F2 — Score Exposure Implementation · H-02B — AI Transparency Audit · H-02C — Fallback Visibility Audit · H-03A — Cloud Deployment Audit.
