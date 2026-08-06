# DEV-05 — Identidad, Registro Idempotente y Publicación del Score Breakdown

**DEV** *(orden 8)* · v1.0 · **Draft** · 2026-07-30 · AKVEZ Engineering · ADS-00 v1.3
*Registro de ejecución. No modifica ninguna decisión arquitectónica ni documental.*

## 1. Qué se implementó

Cuatro tareas, todas derivadas de decisiones ya aprobadas. **Ninguna decisión nueva.**

| # | Tarea | Origen normativo | Estado |
| --- | --- | --- | :-: |
| 1 | **A-02** — el Registro pasa al Lead Hunter | APS-03 §7.1, §7.2 · ADR-08 §10 (R-22) | ✅ Cerrada |
| 2 | **Registro idempotente por identidad** | ADR-12 §7 · ADR-13 §11.3 (I-1, I-2) | ✅ Implementada |
| 3 | **T-14** — el puerto se lee del entorno | ADR-04 §11 · DEV-00 RI-9 | ✅ Cerrada |
| 4 | **Publicar el Score Breakdown** | APS-08 §9 | ⚠️ Parcial — §4.1 |

### 1.1 A-02 — el Registro vuelve a su agente

`analyzeProspects.ts` importaba `shared/persistence/contracts/Lead` para construir el Lead que persistía. **R-22 lo prohíbe expresamente**, y era la única violación de frontera del repositorio desde DEV-01A §5.

**La causa no era el import, sino la ubicación del Registro.** APS-03 §7.1 lo atribuye al **Lead Hunter**; §7.2 dice del Lead Analyzer que «no crea Leads: opera sobre Leads que ya existen en la Biblioteca». Trasladado el Registro a `discoverProspects`, el import desaparece por sí solo: `analyzeProspects` ya no recibe `LeadRepository`, solo `LeadAnalysisRepository`.

`discoverProspects` cumple ahora la segunda mitad de §7.1 —«entregar al siguiente agente el conjunto de **Leads registrados, con su identidad ya asignada**»—: devuelve cada candidato enriquecido con el `id` que asignó la persistencia. La decisión que DEV-03 §4 (B-2) declaró bloqueante —«dónde reside la entidad `Lead` de `lead-analyzer`»— **queda sin objeto**: ese módulo ya no necesita la entidad.

### 1.2 Identidad canónica y Registro idempotente

**Fichero nuevo: `modules/lead-hunter/domain/leadIdentity.ts`** — cálculo puro, sin I/O, sin imports externos al módulo (R-04). Materializa ADR-12 §7:

- **Referencia de Origen** `(Fuente, Designación)` — identidad natural, con la Fuente como parte **inseparable** (§7.1).
- **Huella de Identidad** `(denominación, localización)` — subsidiaria, **solo en ausencia** de Referencia de Origen (§7.3, regla **S-1**).
- `null` cuando no hay ninguna de las dos. La Empresa **se registra igualmente** —ninguna etapa expulsa (PO-01 §8)— pero no podrá reconocerse después. **Nunca se inventa una identidad** (**S-3**).

**Se conserva la Designación que ya se pedía y se descartaba.** `googlePlacesAdapter` incluía `places.id` en el `FieldMask` y lo tiraba al mapear: el sistema no guardaba ninguna identidad natural y **cada búsqueda volvía a registrar las mismas Empresas como Leads nuevos**. Es la desviación **D-2** de DEV-04 §4. ADR-12 §7.4 autoriza expresamente conservarlo: «el dominio no adopta el identificador de un proveedor: exige que exista uno y lo conserva» — no es una capacidad propietaria filtrada al dominio (ADR-11 §9, E-6).

**La deduplicación deja de agruparse por nombre.** Tanto la unificación de sub-consultas del adapter como `deduplicateLeads` agrupaban por nombre normalizado, lo que **fusionaba establecimientos reales que comparten enseña** —dos «Café Central» en barrios distintos colapsaban en uno y uno desaparecía de la Biblioteca—, contra **S-3** y **R-44**. Ambas agrupan ahora por identidad de ADR-12, que es lo único admisible según **I-2**.

**`LeadRepository` expresa la identidad.** Se añaden `register(lead)` —idempotente respecto de la identidad— y `findByIdentity(key)`; `save` se conserva para escritura sin deduplicar, con la advertencia expresa de que **el flujo de descubrimiento usa `register`**. El Persistence Contract `Lead` incorpora `identityKey`, `identitySource` e `identityDesignation`.

Comportamiento de `register`, transcrito de ADR-13 §11.3 y §10.3-§10.4:

| Situación | Efecto |
| --- | --- |
| Identidad ausente en la Biblioteca | Se crea el Lead |
| Identidad ya presente | **No se crea nada.** Se actualizan los atributos que difieran (U-1) y se devuelve el Lead existente con su `id` original |
| `identityKey === null` | Se registra siempre (PO-01 §8 · S-3) |

**Nunca se tocan** `id` (R-35 · E-3), `createdAt` (R-36 · E-4 · U-3) ni `status` (**V-5**: un redescubrimiento no devuelve a `Prospect` un Lead ya contactado).

### 1.3 T-14 — el puerto procede del entorno

`startServer.ts` declaraba `const PORT = 3000` e ignoraba `process.env.PORT`, lo que impedía desplegar en cualquier plataforma que asigne el puerto —Cloud Run incluida, que `.env.example` menciona—.

La lectura vive en **`shared/config/env.ts`** (`getPort()`), única frontera del backend con `process.env` (ADR-04 §11 · **RI-9**). Un valor **ausente, vacío, no numérico o fuera del rango TCP** cae al valor por defecto `3000` con aviso, en lugar de arrancar en un puerto imprevisto o tumbar el proceso: es el mismo criterio que ya seguía el resto del módulo.

### 1.4 Publicación del Score Breakdown

Cierra la desviación **D-3** de DEV-04 §4 **en la Biblioteca**. Se define `ScoreBreakdownEntryDTO` en `shared/contracts/leadLibrary.ts` y `GET /api/leads` publica, por cada una de las seis categorías de APS-08 §6: categoría, peso de WP-01, parcial 0-100, contribución normalizada, factores medidos, **factores no medibles** y explicación legible.

**La lista blanca del mapper se mantiene campo a campo** (ADR-06 §11 · UI-9): `label` interno no cruza la frontera, y los campos de Score solo se añaden si existe emisión. Se comprueba `scoreVersion` y **no** `score`, porque una emisión real puede tener `score === null` cuando ninguna categoría fue medible, y esa emisión existe y debe publicarse con su versión (R-38 · R-45).

**Los factores no medibles se publican deliberadamente.** APS-08 §11 obliga a declarar que la confianza puede ser limitada; decir *qué* no se pudo medir es la forma honesta de hacerlo. Ocultarlos daría al Score una precisión que no tiene.

La Biblioteca (P-08) muestra el desglose bajo un control **«Por qué este Score»**, plegado por defecto y reversible.

### 1.5 Inventario de ficheros

**Nuevo (1):** `modules/lead-hunter/domain/leadIdentity.ts`.

**Modificados (24):**

| Ámbito | Ficheros |
| --- | --- |
| Identidad y Registro | `deduplicateLeads.ts` · `googlePlacesAdapter.ts` · `discoverProspects.ts` · `analyzeProspects.ts` · `compositionRoot.ts` · `LeadHunterAgent.ts` · `LeadAnalyzerAgent.ts` |
| Persistencia | `repositories/LeadRepository.ts` · `contracts/Lead.ts` · `models/LeadModel.ts` · `adapters/leadMapper.ts` · `adapters/inMemoryLeadAdapter.ts` · `adapters/leadRepository.contract.ts` |
| T-14 | `shared/config/env.ts` · `bootstrap/startServer.ts` |
| Breakdown | `shared/contracts/leadLibrary.ts` · `shared/mappers/leadLibraryMapper.ts` · `orchestrators/leadLibraryOrchestrator.ts` · `application/listLeadScores.ts` · `application/listLeadLibrary.ts` · `domain/LeadAnalysis.ts` · `contracts/LeadAnalysis.ts` |
| Frontend | `loadLeadLibrary.ts` · `leadLibraryApi.ts` · `LeadLibrary.tsx` |

**Ninguna dependencia nueva.** `package.json` no incorpora paquetes: las cuatro tareas se resuelven con lo ya presente.

---

## 2. Validación ejecutada

Ejecutada íntegramente el 2026-07-30 sobre el árbol de trabajo actual.

| Comprobación | Resultado |
| --- | :-: |
| `tsc --noEmit` con `strict: true` | ✅ **0 errores** (DoD-2) |
| `npm run build` *(vite + esbuild)* | ✅ exit 0 — `dist/server.cjs` 87,1 kB |
| Dependencias nuevas | ✅ **0** |
| Dependencias circulares | ✅ **0** sobre 141 aristas internas, 91 ficheros |
| Fronteras de capa (R-04/05/06/08/09/13/15/17/18/21-25/29/54, O-4) | ✅ **0 violaciones** — §2.1 |
| `process.env` fuera de `shared/config/` | ✅ **0** *(los 2 aciertos del barrido son comentarios)* |
| Contrato de `LeadRepository` | ✅ **37 aserciones**, incluidas las de `register` y `findByIdentity` |
| Flujo completo sobre HTTP real | ✅ **25/25** verificaciones — §2.2 |
| Regresión de rutas y Pitch Generator | ✅ **6/6** verificaciones — §2.3 |

### 2.1 Fronteras — la única violación conocida ha desaparecido

Barrido de 91 ficheros y 141 aristas: **cero violaciones**. **A-02 era la única que quedaba** desde DEV-01A §5, y está cerrada.

El barrido señala `shared/ai/geminiClient.ts` por importar `@google/genai`, que **no es una violación**: **ADR-04 §11** sitúa expresamente el cliente Gemini en `shared/ai`, con la regla de acceso «únicamente desde `infrastructure/`». Verificado: sus cinco importadores están todos en `infrastructure/` (`leadAnalysisAdapter`, `groundingSearchAdapter`, `pitchGenerationAdapter`). **Ninguno en `domain/` ni en `application/`.**

### 2.2 Flujo completo — 25 verificaciones sobre HTTP real

Servidor arrancado con `startServer()` real. **Único elemento sustituido: el proveedor externo Google Places**, por no existir clave (bloqueo **B-1** de DEV-03 §4, todavía abierto). Todo lo demás es código del repositorio. Sin `GEMINI_API_KEY`, el análisis recorre la vía de respaldo — que es también lo que se quería ejercitar.

| Materia | Verificado |
| --- | --- |
| **T-14** | El servidor escucha en el `PORT` del entorno (4319), no en 3000 |
| **Identidad · S-3** | 20 sub-consultas → 13 Leads. Los dos «Café Central» **siguen siendo dos Leads distintos** |
| **APS-03 §7.1** | Todo Lead llega del Lead Hunter con su identidad ya asignada |
| **R-42 · R-44** | `leads.length === total`: la Biblioteca no pagina ni recorta |
| **R-34 · R-VIN** | Las 13 emisiones publican su versión — `WP-01 v1.0` |
| **APS-08 §9** | El desglose cruza la frontera HTTP con las **6 categorías**, cada una con su explicación |
| **APS-08 §7.1** | Los pesos publicados suman **100** — 25+25+20+12+10+8 |
| **APS-08 §11** | Se publica qué se midió y qué no es medible |
| **ADR-14 §6.3** | Las contribuciones publicadas **reconstruyen el Score** (93 = 93) |
| **WS-05** | Orden por Score descendente |
| **ADR-06 §11 · UI-9** | La lista blanca no filtra `identityKey`, `userId` ni etiquetas internas |
| **ADR-13 §11.3 I-1** | **Repetir la búsqueda idéntica no altera el conjunto: 13 → 13** |
| **R-35 · E-3** | Ningún identificador se reasigna ni se regenera entre búsquedas |
| **ADR-12 §7.1** | Tercera búsqueda con **otro nicho y otra ciudad**: las 12 Empresas con Referencia de Origen se reconocen y **no se duplican** |
| **R-44 · PO-01 §8** | Ningún Lead se expulsa ni pierde su Evaluación |

**Un matiz de la tercera búsqueda, verificado y correcto.** La Biblioteca pasó de 13 a 14, no a 13. La Empresa que entró es la **única sin Designación**, identificada por Huella `(denominación, localización)`: descubierta en otra ciudad es, **por la definición misma de la huella** (ADR-12 §7.3), otra Empresa. **S-1** declara la huella provisional y **S-3** ordena no fusionar ante la duda. Las 12 con Referencia de Origen se reconocieron todas — el log del servidor lo confirma: «12 de 13 Empresas ya estaban en la Biblioteca». **Es el comportamiento que ADR-12 exige, no una desviación.**

### 2.3 Regresión — nada de lo anterior se rompió

| Superficie | Resultado |
| --- | :-: |
| Lead Hunter — descubrimiento y Registro | ✅ |
| Lead Analyzer — análisis, respaldo y emisión de Score | ✅ |
| Biblioteca (P-08) — lectura, orden y total | ✅ |
| Lead Scoring — WP-01 v1.0, bandas, confianza | ✅ |
| Breakdown — desglose completo | ✅ |
| Registro — idempotente | ✅ |
| Identidad — Referencia de Origen y Huella | ✅ |
| Orchestrators — adquisición y Biblioteca | ✅ |
| **Pitch Generator** | ✅ `POST /api/prospect/outreach` genera propuesta por la vía de respaldo; validación de entrada devuelve 400 |
| Biblioteca vacía | ✅ Éxito con conjunto vacío, **nunca error** (R-45 · UI-7) |

---

## 3. Desviaciones — estado tras DEV-05

| # | Desviación | Estado anterior | Estado tras DEV-05 |
| --- | --- | :-: | :-: |
| **A-01** | `LeadStatus` incluye valores contra PO-01 §8 | 🔴 Abierta | 🔴 **Abierta** — Product Office |
| **A-02** | `application/` importa un Persistence Contract | 🔴 Abierta | ✅ **Corregida en código** — §1.1 |
| **A-03** | `LeadRepository` no expresa la identidad ni la Unidad de Registro atómica | 🔴 Abierta | ⚠️ **Parcial** — §3.1 |
| **A-04** | `shared/observability/` sin declarar | ✅ `Closed` | ✅ `Closed` |
| **T-14** | Puerto fijado en código | 🔴 Abierta | ✅ **Corregida en código** — §1.3 |

> **A-02 y T-14 están corregidas en el código, no `Closed` documentalmente.** El registro vivo de desviaciones es **AR-05 §5.1**, y su última actualización —el cierre de A-04— se ejecutó dentro de un sprint de gobernanza (GOV-04). Un sprint de implementación **no cambia el estado formal de una desviación**. Véase §6.

### 3.1 A-03 — resuelta la mitad que dependía del código

A-03 tiene dos mitades. **La primera está resuelta:** `LeadRepository` **sí expresa ahora** la identidad `(Referencia de Origen, Usuario)` —`register`, `findByIdentity`, y `identityKey`/`identitySource`/`identityDesignation` en el Persistence Contract—, y el índice del adapter está acotado al espacio del usuario, nunca entre usuarios (ADR-12 §7.2, corolario).

**La segunda no puede resolverse desde el código.** **R-31** exige que la unicidad de `(Referencia de Origen, Usuario)` la garantice **el motor**, no la aplicación; **R-30** exige que determinar identidad, comprobar presencia y escribir sean una operación **indivisible**. `inMemoryLeadAdapter` lo resuelve con un `Map` y un solo proceso: **funciona, pero no es la garantía que ADS-02 §5 (RQ-2) y la verificación heredada VH-3 piden.** Queda registrado como limitación del adapter de validación, **no como cumplimiento**, y así consta también en el propio fichero.

**A-03 permanece abierta.** Su cierre corresponde al Architecture Team y llega con el motor real (ADS-02).

---

## 4. Hallazgos abiertos

### 4.1 H-1 — el Score viaja sin explicación en la pantalla de resultados

**APS-08 §9 es universal: «Todo Opportunity Score deberá acompañarse de una explicación».** DEV-05 la publica en `GET /api/leads`, pero **`POST /api/prospect/search` sigue publicando `score: number` a secas** —sin banda, sin versión de Perfil y sin desglose—. `SearchResponseDTO` no los declara y `leadResponseMapper` no los mapea.

**D-3 de DEV-04 §4 queda cerrada para la Biblioteca y abierta para la pantalla de resultados.** No se amplió aquí porque el alcance aprobado decía «publicar el Score Breakdown» y la superficie afectada por la deuda documentada era la Biblioteca; extender el contrato público de búsqueda es una decisión de contrato (ADR-06), no una consecuencia mecánica. **Se reporta, no se implementa.**

### 4.2 H-2 — dos valores por defecto sustituyen a un Score ausente

**Preexistentes, no introducidos por DEV-05.** Ambos incumplen **R-38** —«un atributo ausente se representa como ausente, nunca con un valor por defecto»— y **UI-7**:

| Fichero | Línea | Código |
| --- | :-: | --- |
| `src/modules/lead-hunter/presentation/components/LeadCard.tsx` | 129 | `{lead.score \|\| 70}` |
| `src/modules/lead-hunter/domain/prospectMapper.ts` | 33 | `score: raw.score \|\| 60` |

**No es hipotético:** `calculateOpportunityScore` devuelve `score: number | null` y emite `null` cuando ninguna categoría resulta medible. El operador `||` además convierte un Score legítimo de **0** en el valor por defecto. La Biblioteca ya lo hace bien —omite el campo—; es la pantalla de resultados la que lo rellena.

**Corregirlo exige antes resolver H-1**, porque hoy el contrato de búsqueda declara `score` como `number` obligatorio: representar la ausencia como ausencia empieza por permitir que el contrato la exprese.

### 4.3 H-3 — comentarios que citan un ADR `Archived` y contradicen al código

**DEV-00 §10: ningún documento `Archived` es fuente de ninguna regla.** Es la raíz documental que DEV-03 §4 registró como **B-4**, y **sigue abierta**. Cinco comentarios citan «H-04 / ADR-10»:

| Fichero | Línea | Problema |
| --- | :-: | --- |
| `bootstrap/compositionRoot.ts` | 44 | Dice que el Registro ocurre «dentro del Lead Analyzer» — **contradice las dos líneas siguientes y el código** |
| `lead-hunter/application/discoverProspects.ts` | 105 | «Este caso de uso YA NO PERSISTE» — **contradice el bloque REGISTRO que sigue** |
| `lead-analyzer/presentation/LeadAnalyzerAgent.ts` | 34 | «el Registro ocurre dentro de…» — obsoleto tras §1.1 |
| `lead-analyzer/application/analyzeProspects.ts` | 197 | Menciona un `slice` que ya no existe |
| `orchestrators/leadAcquisitionOrchestrator.ts` | 20 | Cita ADR-10 como fundamento de la inyección |

**Ningún comentario altera el comportamiento** —las 31 verificaciones sobre HTTP real de §2.2 y §2.3 se ejecutaron sobre este código—, pero **describen lo contrario de lo que el código hace**, que es la forma más costosa de deuda documental. La sexta cita, en `analyzeProspects.ts:29`, es correcta: explica precisamente que ADR-10 está `Archived`.

**Limpieza propuesta, no ejecutada:** es una modificación de ficheros fuera de las cuatro tareas aprobadas. Requiere autorización expresa.

### 4.4 H-4 — D-1 de DEV-04 sigue esperando pronunciamiento

**Las funciones de puntuación por categoría no están documentadas en ningún documento aprobado.** APS-08 §6 enumera *qué* factores evalúa cada categoría, pero no *cómo* convertir los datos disponibles en la parcial 0-100. DEV-04 §4 lo elevó al Product Office, autoridad de APS-08 (ADR-14 §8.1), y **no ha sido resuelto**. DEV-05 no lo tocó: no formaba parte del alcance.

La cobertura sigue siendo **50 %** —12 de 24 factores medibles—, y por eso la confianza se declara **media**.

---

## 5. Riesgos abiertos

| # | Riesgo | Impacto |
| --- | --- | --- |
| **RD-1** | **La persistencia sigue siendo en memoria.** `inMemoryLeadAdapter` e `inMemoryLeadAnalysisAdapter` no sobreviven a un reinicio | La idempotencia verificada en §2.2 **es real dentro de un proceso**. Tras reiniciar, la Biblioteca queda vacía y el Registro vuelve a crear todo. **La regla I-1 se cumple; su utilidad práctica depende del motor real** (ADS-02) |
| **RD-2** | **`userId` es un placeholder.** No satisface ADR-05 §14 | Bloqueante para multi-usuario. La deduplicación está acotada a un único espacio de usuario que hoy es constante |
| **RD-3** | **R-31 no se cumple: la unicidad la garantiza el código** | §3.1. Con un motor real y varios procesos, dos registros concurrentes de la misma identidad podrían duplicar |
| **RD-4** | **B-1 de DEV-03 sigue abierto:** sin `GOOGLE_PLACES_API_KEY` no hay demo real | Solo existe `.env.example`. Google Places es la única fuente activa y **no tiene respaldo por decisión expresa (H-01)** |
| **RD-5** | **La Huella de Identidad es provisional** (S-1) | Una Empresa sin Designación cambia de identidad si cambia la localización con que se descubre — verificado en §2.2. Es correcto hoy; su reconciliación es materia de ADR-12 §9.5 |
| **RD-6** | **R-8 de ADR-14: WP-01 es provisional** | Sus pesos «derivan de los principios aprobados, no de datos observados». Su sustitución sigue ADR-14 §8.4 |
| **RD-7** | **RI-5 de DEV-00: no hay test runner** | Las 68 verificaciones de §2 se ejecutaron con `node:assert` y arneses externos al repositorio. **Solo `leadRepository.contract.ts` está versionado**; el resto no es reejecutable por un tercero sin reescribirlo. Vacío **V-1**, pendiente antes de cerrar DEV-01 |

---

## 6. Sincronización documental pendiente

**Este sprint no modifica ningún ADR, APS, ADS ni AR, y no toca el INDEX.** Es deliberado y conforme a la cadencia vigente: el INDEX y el registro de desviaciones de **AR-05 §5.1** se sincronizan **al cerrar un bloque de gobernanza**, no tras cada sprint de implementación. Por eso el INDEX tampoco cataloga aún DEV-03 ni DEV-04.

**No es deuda: es el estado normal a media ejecución.** Lo que sigue es el inventario que el próximo bloque de gobernanza recogerá, anotado aquí para que no haya que reconstruirlo:

| # | Documento | Qué falta |
| --- | --- | --- |
| 1 | **AR-05 §5.1** | Registrar **A-02** y **T-14** como `Closed`, con la evidencia de §2. Actualizar «quedan cuatro desviaciones abiertas» → **A-01 y A-03** |
| 2 | **AR-05 §5.1** | Anotar que **A-03 está parcialmente resuelta** (§3.1): la mitad de código está hecha; la garantía del motor no |
| 3 | **INDEX §4.6** | Catalogar **DEV-03**, **DEV-04** y **DEV-05**; el recuento de la categoría DEV pasa de 5 a 8 |
| 4 | **INDEX** — cabecera y §5.5 | Actualizar el recuento de documentos y la fila «Desviaciones abiertas» |
| 5 | **INDEX §4.8** | **REV-03** figura catalogado pero **el fichero no existe** en `docs/blueprint/REV/`. Discrepancia preexistente, ajena a DEV-05 |

**Ninguna de las cinco puede ejecutarse desde un sprint de implementación.** Se reportan aquí para que el bloque de gobernanza las recoja.

---

## 7. Estado final

**DEV-05 está completo en su alcance aprobado.** Las cuatro tareas están implementadas y verificadas; la validación completa se ejecutó sin fallos; no hay regresión en ninguna superficie.

**A-02 y T-14 están corregidas en el código** y solo esperan su registro formal. **A-03 avanzó** hasta donde el código puede llevarla. **A-01 no se tocó.**

**Cuatro hallazgos quedan abiertos y ninguno se implementó por su cuenta:** H-1 y H-2 exigen decidir el contrato público de búsqueda (ADR-06); H-3 es una limpieza de comentarios fuera de alcance; H-4 espera al Product Office desde DEV-04.

*Referencias: APS-03 §7.1, §7.2, §12 · APS-04 §A.3.5, §A.9 · APS-07 §5, §7.1, §8.4 · APS-08 §6, §7.1, §8, §8.6, §9, §11 · APS-17 §3.1, §4 (WS-01, WS-02, WS-05), §5, §8 · ADR-04 §7.6, §10, §11 · ADR-05 §6, §7, §14 · ADR-06 §10, §11 · ADR-07 §7, §8 · ADR-08 §5, §7, §10 · ADR-09 §5.1-§5.3, §6 · ADR-11 §8.1-§8.3, §9 · ADR-12 §7.1-§7.4, §8.3, §9.5, §12.1-§12.2 · ADR-13 §10.2-§10.4, §11.1-§11.3, §12.3 · ADR-14 §6.3, §8.1, §8.4, R-INM, R-VIN · ADS-02 §5, §5.3, §7 · PO-01 §5, §7, §8 · DEV-00 v1.2 §3, §4, §6.1, §10, R-04, R-06, R-19, R-22, R-30 a R-38, R-42, R-44, R-45, R-50, R-54, R-64, O-4, UI-4, UI-7, UI-9, RI-5, RI-9 · DEV-01A §5 (A-02) · DEV-01B (T-14) · DEV-03 §3, §4 · DEV-04 §4 (D-1, D-2, D-3) · AR-05 §5.1.*
