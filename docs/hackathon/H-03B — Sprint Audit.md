# H-03B — Sprint Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-03B — Sprint Audit** |
| Clasificación | **Registro de sprint** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ⏸️ **Sprint detenido en la Tarea 4** — auditoría y diseño entregados; implementación **no autorizada** |
| Fecha | 2026-08-05 |
| Sprint | **H-03B — AI Showcase Backend (DTO)** |
| Documento hermano | **H-03B — AI Showcase DTO Implementation Audit** *(evidencia técnica completa)* |

---

# 1. Veredicto

> ### **Las Tareas 1, 2 y 3 están completas. La Tarea 4 no se implementó, y no por prudencia: es inejecutable dentro de las restricciones del propio sprint, y además choca con una regla vinculante del Blueprint.**

**El diseño está terminado y listo para aplicarse en cuanto haya autorización.** No queda trabajo de análisis pendiente: queda una decisión.

---

# 2. Cumplimiento tarea por tarea

| # | Tarea | Estado | Resultado |
| :-: | --- | :-: | --- |
| **1** | **Auditar el `executionReport`** | ✅ **Completa** | 431 líneas · 11 métricas · 24 puntos de registro en 9 ficheros · **un único consumidor: `console.log`** |
| **2** | **Auditar `SearchResponseMetadata`** | ✅ **Completa** | 3 líneas · 3 consumidores en el frontend, todos por nombre · **ampliable sin romper a nadie** |
| **3** | **Diseñar la ampliación** | ✅ **Completa** | **5 campos publicables verbatim** de los 10 pedidos · DTO redactado y listo |
| **4** | **Implementar el DTO** | 🔴 **NO implementada** | **Dos bloqueos independientes** — §3 |
| **5** | **Verificación final** | ✅ **Completa** | **Nada cambió**: no se escribió una línea de código — §5 |

---

# 3. Los dos bloqueos

## 3.1 🔴 Bloqueo A — El sprint se contradice a sí mismo

**El encargo prohíbe modificar `executionReport`. Pero el reporte no tiene lector.**

`current()` —la única función que devuelve el reporte vivo— **está en la línea 123 y no se exporta.** El `AsyncLocalStorage` es privado del módulo. Las 13 funciones exportadas son 11 `record*` que devuelven `void`, el abridor de ámbito y el impresor.

**Las tres vías, las tres cerradas:**

| Vía | Choca con |
| --- | --- |
| Exportar un lector | *«NO modificar: `executionReport`»* |
| Que la ruta lo calcule | *«NO crear cálculos nuevos»* — **y el dato no está ahí**: el workflow devuelve leads y referencias, ni un tiempo |
| Que `application/` lo devuelva | *«NO modificar: aplicación»* |

> **El coste real de levantarlo es de 4 líneas** —`export function readExecutionReport()`—. **La barrera no es técnica, es de permiso.**

## 3.2 🔴 Bloqueo B — Regla vinculante del Blueprint

| Fuente | Regla |
| --- | --- |
| **DEV-00 §3.11, O-6** | **«Las trazas no se exponen nunca al usuario»** |
| **APS-04 §A.9, UI-9** | **«La interfaz no expondrá información interna, identificadores técnicos ni trazas»** |

**Y la decisión ya está tomada y escrita en el código, en el punto exacto donde habría que tocar** — `prospectSearchRoute.ts:79-80`:

> *«El dato **NO se lee del reporte de observabilidad**: la instrumentación no puede ser fuente de una respuesta HTTP.»*

**En H-02 se pudo leer `usedFallbackEngine` del reporte —era más barato— y se eligió propagarlo desde los leads para no cruzar esa frontera.** Implementar la Tarea 4 revertiría esa decisión sin declararlo.

> **O-6 no es consultiva.** DP-02 tiene autoridad de orden 5, pero **O-6 descendió a DEV-00 §3.11 en GOV-04 con fuerza normativa de ADR-04 §11**. Es el supuesto en que la regla obliga.

## 3.3 ⚠️ Bloqueo C — Integridad, si los otros dos se levantan

**`gemini` es una ranura que se sobrescribe, no un acumulador** *(`executionReport.ts:174-187`)*. Una búsqueda de 30 leads hace **3 llamadas** al modelo *(tandas de 10, hasta 5 simultáneas)*, y el reporte conserva **la última registrada**.

| Campo pedido | Lo que el jurado leería | Lo que el número es |
| --- | --- | --- |
| **`geminiExecutionTime`** | *«La IA tardó 1,8 s»* | Una de 3 tandas. **El total real es ~3× mayor** |
| **`retryCount`** | *«Hubo N reintentos»* | Intentos de **una** llamada. `1` significa **ninguno** |
| **`geminiCalls`** | *«N llamadas a la IA»* | **No existe.** Nadie las cuenta |

> **Es el mismo fallo que H-02B y H-02C cerraron:** que la pantalla afirme sobre la IA algo que el sistema no midió. **El diseño de §3.4 del documento hermano los excluye deliberadamente**, aunque dos de ellos sean técnicamente publicables.

---

# 4. Archivos y líneas

| Concepto | Valor |
| --- | --- |
| **Archivos de código modificados** | **0** |
| **Archivos de código creados** | **0** |
| **Archivos de código eliminados** | **0** |
| **Líneas de código modificadas** | **0** |
| **Archivos creados** | **2** — ambos documentación, los entregables del encargo |

| Archivo creado | Naturaleza |
| --- | --- |
| `docs/hackathon/H-03B — AI Showcase DTO Implementation Audit.md` | Auditoría técnica y diseño |
| `docs/hackathon/H-03B — Sprint Audit.md` | Este documento |

**Coste de la implementación cuando se autorice** *(estimado, no ejecutado)*:

| Fichero | Líneas aprox. | Naturaleza |
| --- | :-: | --- |
| `server/shared/contracts/prospectSearch.ts` | **~20** | Interfaz nueva + 1 campo opcional |
| `server/routes/prospectSearchRoute.ts` | **~10** | Mapeo campo a campo |
| `server/shared/observability/executionReport.ts` | **~4** | Lector — **requiere levantar el Bloqueo A** |
| **Total** | **~34** | **3 ficheros** |

---

# 5. Impacto arquitectónico

## 5.1 Del sprint tal como se ejecutó — **ninguno**

| Área | Estado |
| --- | :-: |
| `domain/` · `application/` · `infrastructure/` · persistencia | ✅ **Intactas** |
| Opportunity Score · Gemini · prompts | ✅ **Intactos** |
| `executionReport.ts` · Lead Hunter · Pitch Generator | ✅ **Intactos** |
| UI · DTOs · contratos | ✅ **Intactos** |
| `Dockerfile` · `.dockerignore` · `cloudbuild.yaml` *(H-03A)* | ✅ **Intactos** |
| Blueprint | ✅ **Intacto** |

## 5.2 De la implementación propuesta — **acotado pero real**

| Dimensión | Impacto |
| --- | --- |
| **Contrato público** | ⚠️ **Aditivo.** Gobernado por ADR-06/ADR-07. Mismo patrón validado en H-03-F2 |
| **Compatibilidad** | ✅ **Total.** Los 3 consumidores leen campos por nombre; ninguno itera claves |
| **Dirección de dependencias** | ✅ **Sin cambio.** `routes/` ya importa observabilidad; `shared/contracts/` **no importaría** de `shared/observability` — tipos propios, mapeo campo a campo *(R-15)* |
| **Frontera de observabilidad** | 🔴 **Sí cambia.** La instrumentación pasaría de tener **un consumidor** *(consola)* a **dos** *(consola + HTTP)*. **Es el punto que exige decisión** |

> **Ese último renglón es el sprint entero.** Lo demás es mecánico.

---

# 6. Riesgos encontrados

| # | Riesgo | Prob. | Impacto | Nota |
| :-: | --- | :-: | :-: | --- |
| **R-1** | **Publicar métricas de Gemini mal etiquetadas** — un tiempo parcial presentado como total *(§3.3)* | 🔴 Alta *(si se implementa lo pedido literalmente)* | 🔴 **Descalificatorio ante el jurado** | El diseño entregado ya los excluye |
| **R-2** | **La observabilidad se convierte en fuente de respuesta HTTP.** Un cambio futuro en el reporte —hoy libre, porque solo lo lee la consola— **pasaría a romper el contrato público** | 🟡 Media | 🟡 Alto | Es acoplamiento diferido: no duele al implementarlo, duele al mantenerlo |
| **R-3** | **Filtrar `persistence.ids` o `gemini.failure`** al ampliar el DTO más adelante | 🟡 Media | 🔴 Alto | **UI-9 los prohíbe por nombre.** Documentados como no publicables |
| **R-4** | **Contradicción silenciosa con H-02:** revertir de facto la decisión de `prospectSearchRoute.ts:79-80` sin declararlo | 🔴 Alta | 🟡 Medio | Se cierra dejando constancia en el documento de sprint que autorice |
| **R-5** | **Se implementa la UI del Showcase sobre campos que no llegan** | 🟢 Baja | 🟡 Medio | El backend **no está listo**. Ninguna pantalla debe planificarse contra este DTO todavía |

---

# 7. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** · 26 ficheros |

> **El resultado era inevitable —no se tocó código— y aun así se ejecutó.** Deja constancia de que el árbol queda en el mismo estado verde con que lo recibió H-03B.

---

# 8. Decisión: **detenerse**

**Conforme a CLAUDE.md** —*«Si existe un conflicto entre el Blueprint y el código, detener la implementación y reportarlo antes de continuar»*— **el sprint se detiene en la Tarea 4.**

**No se pide una aclaración de requisitos: el requisito se entendió.** Lo que se entrega es la evidencia de que **no puede ejecutarse sin una decisión que no corresponde al Ingeniero Senior.**

## 8.1 Lo que el PO debe decidir

| # | Decisión | Qué desbloquea |
| :-: | --- | --- |
| **1** | **¿Se autoriza exportar un lector desde `executionReport.ts`?** *(~4 líneas, sin alterar ninguna función de registro)* | **Bloqueo A** |
| **2** | **¿Se acepta que la observabilidad alimente el contrato público?** Exige pronunciarse sobre **O-6** y **UI-9**, y sobre la nota de `prospectSearchRoute.ts:79-80` | **Bloqueo B** |
| **3** | **¿Se acepta el recorte a 5 campos** —`totalQueries`, `totalBusinessesFound`, `uniqueBusinesses`, `placesExecutionTime`, `modelUsed`— **frente a los 10 pedidos?** | **Bloqueo C** |

## 8.2 Tres salidas posibles

| Salida | Descripción | Coste | Toca Blueprint |
| --- | --- | :-: | :-: |
| **A · Autorizar el diseño de §3.4** | 5 campos verbatim, ningún cálculo, ninguna traza | **~34 líneas · 3 ficheros** | ⚠️ **Sí** — exige pronunciarse sobre O-6/UI-9 |
| **B · Registrar el Showcase como desviación** | Implementar con constancia expresa en **AR-05 §5.1** de que O-6 se excepciona para el eje Cloud/AI de la hackathon | ~34 líneas **+ sprint de gobernanza** | ✅ **Sí, formalmente** |
| **C · Alimentar el Showcase sin tocar observabilidad** | Publicar solo lo que **ya cruza** la frontera hoy: `usedFallbackEngine` + el `breakdown` del Score que **H-03-F2 ya expuso** | **0 líneas de backend** | ❌ **No** |

> ### **Recomendación técnica: evaluar C antes que A.**
>
> **H-03-F2 ya publicó `band`, `confidence`, `coverage`, `scoreVersion` y el `breakdown` completo con `rationale` por categoría.** Eso es **razonamiento explicable de la IA**, ya disponible en el DTO, **hoy, sin tocar una línea ni rozar el Blueprint**.
>
> **`totalQueries: 14` y `placesExecutionTime: 3200` son telemetría de operación**, no inteligencia. Ante un jurado, *«así es como el sistema puntuó este negocio y por qué»* pesa más que *«el sistema hizo 14 consultas»* — **y no cuesta un sprint de gobernanza.**
>
> **A y B siguen sobre la mesa.** Si el objetivo es el contador en pantalla, **A es el camino limpio** y este documento deja el diseño listo. La recomendación es de prioridad, no de veto.

---

# 9. Qué NO se hizo — conforme al encargo

| Fuera de alcance | Estado |
| --- | :-: |
| Dashboard · AI Showcase · gráficas · animaciones · **cualquier UI** | ✅ **No construido** |
| Endpoints nuevos · lógica nueva · cálculos nuevos · métricas nuevas | ✅ **No creados** |
| Modificación de `executionReport`, Opportunity Score, Gemini, prompts | ✅ **No realizada** |
| Modificación de `Dockerfile` / Cloud Run *(H-03A)* | ✅ **No realizada** |

---

# 10. Referencias

**Evidencia técnica completa:** `docs/hackathon/H-03B — AI Showcase DTO Implementation Audit.md`.

**Código:** `server/shared/observability/executionReport.ts:121-125,174-187` · `server/shared/contracts/prospectSearch.ts:82-96` · `server/routes/prospectSearchRoute.ts:53,76-81` · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:24,27,220`.

**Blueprint:** **DEV-00 §3.11 (O-6)** · **APS-04 §A.9 (UI-9)** · DP-02 §4.3, §8.1 · ADR-04 §11 · ADR-06 §10-11 · ADR-07 · APS-10 · AR-05 §5.1.

**Documentos:** H-03-F2 — Score Exposure Implementation · H-02B — AI Transparency Audit · H-02C — Fallback Visibility Audit · H-03A — Cloud Deployment Audit.
