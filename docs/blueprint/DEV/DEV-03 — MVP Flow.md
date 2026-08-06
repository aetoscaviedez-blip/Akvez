# DEV-03 — MVP Flow

**DEV** *(orden 8)* · v1.0 · **Draft** · 2026-07-29 · AKVEZ Engineering · ADS-00 v1.3
*Registro de ejecución: no contiene reglas ni introduce arquitectura.*

## 1. Qué se implementó

**El flujo completo es funcional.** Verificado sobre HTTP real: `POST /api/prospect/search` → **23 empresas** descubiertas → 23 registradas → `GET /api/leads` devuelve **23**. Dashboard confirmado en navegador.

| Paso | Estado |
| --- | --- |
| Usuario → Lead Hunter → Google Places → Obtención de empresas | ✅ Ya existía |
| → Análisis | ✅ **Corregido** — procesa el conjunto completo en tandas |
| → Evaluación | ✅ Ordena por Score; ya no recorta |
| → **Persistencia del Lead** | ✅ **Corregido** — el Registro alcanza a *todas* las empresas |
| → **Dashboard** | ✅ **Nuevo** — Biblioteca (P-08) sobre persistencia real |

**Corrección crítica.** `analyzeProspects` hacía `.slice(0, 10)` **antes** de persistir: de 23 empresas solo 10 llegaban a la Biblioteca y **13 se perdían en silencio**. Era el parámetro «Máximo de Leads por ejecución» que **APS-17 §3.1 declaró inadmisible** por ser un Top N, sustituido por `WS-01`, una tanda que *recompone el conjunto completo*. Incumplía **APS-03 §7.2** («no trunca… no expulsa»), **R-42**, **R-44** y el Criterio de Invariancia (§3.6). Ahora se registra todo; `WS-01=10` y `WS-02=5` pasan a `infrastructure/`, donde APS-17 §8 las sitúa. La priorización por Score se conserva: solo desapareció el recorte. Además, el fallo de una tanda ya **no aborta el conjunto** (**R-64**).

**Camino de lectura nuevo.** La persistencia era escritura ciega: nada leía lo guardado y la UI mostraba datos de ejemplo en `localStorage`. Se construyó la cadena obligatoria de **R-19** sin atajos — `routes/` → `leadLibraryOrchestrator` → `LeadHunterAgent.listLibrary()` → `listLeadLibrary` → `LeadRepository.findAll()`. Vive en Lead Hunter porque **APS-03 §7.1** le atribuye «consultar la Biblioteca»; **no se creó ningún agente nuevo**.

**8 ficheros nuevos** (caso de uso, orchestrator, DTO, mapper, ruta, y api/caso de uso/vista en frontend) · **9 modificados** (`leadAnalysisAdapter`, `analyzeProspects`, `LeadRepository` +`findAll`, `inMemoryLeadAdapter`, `leadRepository.contract`, `LeadHunterAgent`, `compositionRoot`, `routes/index`, `App.tsx`).

## 2. Verificaciones

`tsc --noEmit` **0 errores** · `npm run build` exit 0 · flujo HTTP 23→23→23 · **0** dependencias circulares (84 ficheros) · contrato de `LeadRepository` pasa con 2 casos nuevos que blindan `findAll` · **0 violaciones de frontera nuevas** en 58 ficheros (R-04/05/08/09/13/15/17/21-25, O-4).

UI-2, UI-3, UI-4, UI-5, UI-7, UI-9, UI-10 respetadas: la Biblioteca no filtra, no trunca, no oculta por Score, no permite eliminar y **no expone el `id` técnico**. R-49: solo Design Tokens.

## 3. Qué queda pendiente

1. **Persistir Score y análisis.** **R-34** exige conservar el Perfil de Ponderación y su versión en cada emisión; definir esa forma es decisión de ADR-14. Hoy la Biblioteca muestra «Sin analizar», **estado válido** (R-45).
2. **Ordenar por Score** (`WS-05`) — depende de 1; ordenar sin Score exigiría inventar un valor, y **R-38** lo prohíbe.
3. **Persistencia real** — `inMemoryLeadAdapter` no sobrevive a un reinicio. Sustituirlo es **una línea** en `compositionRoot.ts` (ADR-09 §6).
4. **Aislamiento por usuario** — el adapter usa un `userId` placeholder; no satisface ADR-05 §14. Bloqueante para multi-usuario.
5. Deuda **O-5** (23 `console.*`) y **T-14** (puerto fijo) — ninguna impide la demo.

## 4. Bloqueos

**B-1 — Sin `GOOGLE_PLACES_API_KEY` no hay demo real.** No existe `.env`, solo `.env.example`. Google Places es la única fuente activa y **no tiene respaldo por decisión expresa (H-01)**: si falla devuelve error en lugar de inventar empresas. **Hay que aportar la clave para la hackathon.** `GEMINI_API_KEY` es opcional: sin ella el análisis usa el respaldo y el flujo se completa. El ciclo se verificó sustituyendo *solo* el proveedor externo por un stub externo al repositorio; todo lo demás ejecutado fue código real.

**B-2 — A-02 impide colocar el Registro en su agente.** APS-03 §7.1 lo atribuye al **Lead Hunter**; el código lo ejecuta en `lead-analyzer`, que además importa un Persistence Contract — **A-02**, abierta, Architecture Team. Moverlo exige decidir dónde reside la entidad `Lead` de `lead-analyzer`: **no se decidió**. El truncamiento sí se corrigió porque no dependía de ello, y el caso de uso nuevo **no amplía A-02** (solo importa la Repository Interface).

**B-3 — A-03 hace indistinguible «sin dato» de «cero».** `rating` y `reviewCount` son números obligatorios no anulables: la Biblioteca no puede garantizar la distinción que **R-38** exige. Se muestra «—» para el cero, con la limitación documentada en el código.

**B-4 — El código citaba un ADR `Archived` como autoridad.** Comentarios en `discoverProspects`, `analyzeProspects` y `compositionRoot` justificaban la posición del Registro en «H-04 / ADR-10». **ADR-10 está `Archived`**, y DEV-00 §10 establece que ningún documento `Archived` es fuente de regla alguna. Es la raíz documental de B-2. Se reporta; no se reescribió el histórico.

## 5. Desviaciones abiertas

**Sin cambios: A-01, A-02, A-03, T-14.** Ninguna nueva. **A-04 sigue `Closed`** (GOV-04).

*Referencias: APS-03 §7-§8 · APS-04 §A.3.4-§A.3.5, §A.9 · APS-07 §7.1 · APS-17 §3.1, §4, §8 · ADR-05 §6, §14 · ADR-06 §10-§11 · ADR-07 §7-§8 · ADR-08 §5, §7, §10 · ADR-09 §5-§6 · ADR-11 §8.2-§8.3 · ADR-13 §11.2 · ADR-14 · PO-01 §5-§8 · DEV-00 v1.2 §3, §6.1 · AR-05 §5.*
