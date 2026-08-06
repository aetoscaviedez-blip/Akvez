# ADR-09 — Dependency Injection Strategy

| Campo | Valor |
| --- | --- |
| Código | ADR-09 |
| Clasificación | Architecture Decision Record |
| Versión | 1.3 |
| Estado | Approved |
| Fecha de creación | 2026-07-27 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Nivel de confidencialidad | Interno |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-27 | Architecture Team | Creación inicial. Define el Composition Root y el mecanismo por el cual `modules/*/application/` recibe una instancia concreta de una Repository Interface sin importar `shared/persistence/adapters/` y sin que `modules/*/presentation/` conozca `shared/persistence/` en ninguna forma. | Sprint 14, Tarea 5 quedó bloqueada: la tarea exige inyección explícita de `LeadRepository` en `discoverProspects.ts`, pero la única vía de inyección disponible atraviesa `LeadHunterAgent` (capa `presentation`), prohibido por ADR-08 §10 «sin excepción». ADR-08 §3 dejó esta decisión explícitamente fuera de alcance, difiriéndola «al Sprint que ejecute este ADR». Este es ese Sprint. |
| 1.1 | 2026-07-27 | Architecture Team | Cambio de estado Draft → Approved. Sin modificaciones al contenido decisional de v1.0. | El Product Owner aprobó formalmente este ADR junto con el ajuste de alcance descrito en §10, y autorizó su ejecución. La estrategia fue implementada en Sprint 14, Tarea 5, confirmando en código que no requiere enmendar ADR-05, ADR-06, ADR-07 ni ADR-08: `modules/*/presentation/` no importa `shared/persistence/` en ninguna forma. |
| **1.3** | 2026-07-30 | AKVEZ Architecture Team | **Sincronización con ADR-17, `Approved`. Estrictamente aditiva.** Se actualiza **§8.1** para reflejar que la extensión de la tabla de §8 **está en vigor** y no pendiente: **ADR-17 §9.1 (AL-20)** añade la fila que autoriza a `bootstrap/` a importar `modules/*/infrastructure/` **exclusivamente** para construir adapters de proveedor y vincularlos a su puerto. Se actualiza la referencia de **§13** y la nota de estado final. **No se modifica ninguna decisión, ninguna fila de la tabla de §8, ni §5, §6, §7, §9, §10, §11, §12 ni §14.** | Sprint **Gobernanza Final (Architecture Freeze)**, paso 9. **ADR-17 pasó a `Approved` en el paso 7.** La v1.2 registró el punto de contacto como pendiente; esta versión lo cierra. |
| **1.2** | 2026-07-30 | AKVEZ Architecture Team | **Nota de sincronización, estrictamente aditiva.** Se añade **§8.1**, que declara el alcance temporal de la tabla de §8 y remite a **ADR-17 §9.1** como documento que la **extiende** —no la modifica— con la fila que la dependencia hexagonal estricta requiere. Alta de **ADR-17** en §13. **No se modifica ninguna decisión, ninguna fila de la tabla de §8, ni §5, §6, §7, §9, §10, §11, §12 ni §14.** El contenido decisional de la v1.0 permanece íntegro. | Sprint *Cierre de Arquitectura Base*, punto 1. La tabla de §8 prohíbe a `bootstrap/` importar `modules/*/infrastructure/`. **La prohibición es correcta bajo la arquitectura vigente** —`application/` importa su propio adapter y el Composition Root no tiene nada que construir allí—, pero **sería inejecutable bajo la Opción B** de ARCH-01 §6.0, donde alguien debe construir el adapter que implementa el puerto. Se registra el punto exacto de contacto para que la contradicción no se descubra durante la implementación. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto — El Bloqueo
5. Decisión Arquitectónica
6. Ciclo de Vida de los Adapters
7. Qué NO es esta Decisión
8. Dependencias Permitidas y Prohibidas
9. Flujo de Wiring
10. Impacto en el Código Existente
11. Riesgos
12. KPIs
13. Dependencias
14. Glosario
15. Referencias
16. Definition of Done

> **Secciones omitidas:** este ADR omite «Diagramas» extensos y «Anexos» por su naturaleza deliberadamente acotada (ADS-00, *Estructura Obligatoria*: «La omisión de alguna sección deberá estar justificada por la naturaleza del documento»). Resuelve un único bloqueo arquitectónico.

---

# 1. Resumen Ejecutivo

ADR-08 definió **qué** puede importar cada capa de persistencia, pero dejó sin definir **cómo** `modules/*/application/` obtiene una instancia concreta de una Repository Interface (ADR-08 §3, "No incluye"). Sin esa definición, la integración de persistencia al flujo real es imposible sin violar alguna regla ya aprobada.

Este ADR resuelve el bloqueo mediante **inyección por aplicación parcial desde un Composition Root único**, ubicado en `server/bootstrap/`.

La decisión central: `application/` expone **factories** que reciben sus dependencias y devuelven la función de caso de uso ya vinculada. Las capas superiores (`presentation/`, `orchestrators/`, `routes/`) reciben esa función **ya construida**, cuyo tipo no menciona persistencia en ninguna forma. Solo el Composition Root conoce `shared/persistence/adapters/`.

**Consecuencia clave: ADR-08 no requiere enmienda.** La prohibición de §10 («`modules/*/presentation/` no puede importar `shared/persistence/` — sin excepción») se respeta íntegramente, porque `presentation/` nunca nombra un tipo de persistencia.

Este ADR es de diseño únicamente — no implementa código.

---

# 2. Objetivo

- Definir el **Composition Root** del backend: ubicación única y responsabilidad.
- Definir el mecanismo por el cual `modules/*/application/` obtiene una Repository Interface concreta **sin importar `shared/persistence/adapters/`**.
- Definir el **ciclo de vida** de los Database Adapters, hoy `InMemoryLeadAdapter`, mañana un motor real.
- Hacerlo **sin framework de DI, sin Service Locator y sin Singletons globales**.
- Desbloquear Sprint 14, Tarea 5, sin modificar ADR-05, ADR-06, ADR-07 ni ADR-08.

---

# 3. Alcance

## Incluye

- La ubicación y responsabilidad del Composition Root.
- El patrón de construcción de casos de uso (factory + aplicación parcial).
- El mecanismo de propagación de dependencias hasta `application/`, atravesando `presentation/` sin acoplarla.
- El ciclo de vida y la propiedad (*ownership*) de las instancias de Adapter.
- La delimitación explícita frente a Service Locator, Singleton global y contenedores de DI.

## No incluye

- **Ningún cambio a ADR-05, ADR-06, ADR-07 ni ADR-08.** Donde este ADR necesita apoyarse en ellos, lo hace **por referencia**, nunca modificándolos.
- La elección del motor de base de datos, ORM o proveedor cloud (ADR-05 §5 — sigue sin resolverse).
- El modelo de `User` y la estrategia de aislamiento por usuario (Sprint 13, Tarea 1, Decisión 4 — sigue pendiente).
- La asignación del `status` inicial de un Lead descubierto — es una decisión de dominio, no de inyección. Debe resolverse en la tarea que ejecute este ADR.
- El tipado real de `DiscoverProspectsResult` (hoy `any[]`) — deuda preexistente, fuera de alcance.
- **Cualquier código.** Las firmas mostradas en §5 y §9 son **ilustrativas del diseño**, no implementación.

---

# 4. Contexto — El Bloqueo

Sprint 14, Tarea 5 exige conectar `LeadRepository` a `discoverProspects.ts` mediante «dependencia explícita», prohibiendo Service Locator, Singleton global, variables globales y contenedores de DI.

Al intentarlo, toda vía disponible resulta bloqueada por una regla ya aprobada:

| Vía de inyección | Regla que la bloquea |
| --- | --- |
| `discoverProspects` instancia el adapter | ADR-08 §10: `modules/*/application/` no puede importar `shared/persistence/adapters/` |
| `LeadHunterAgent` lo instancia o lo reenvía tipado | ADR-08 §10: `modules/*/presentation/` no puede importar `shared/persistence/` — **sin excepción** |
| El Orchestrator lo crea y lo pasa | Atraviesa `presentation/` (misma regla). Además ADR-08 §8: *«Routes / Orchestrators: siguen sin conocer persistencia en ninguna forma»* (ADR-05 §6, Principio 1) |
| Instancia a nivel de módulo | Singleton global — prohibido por la propia tarea |

La causa raíz no es una contradicción entre ADRs, sino una **omisión deliberada**: ADR-08 §3 difirió esta decisión. Este ADR la cierra.

---

# 5. Decisión Arquitectónica

## 5.1 Composition Root único

> **Se establece `server/bootstrap/` como el único Composition Root del backend. Es el único lugar del sistema autorizado a importar `shared/persistence/adapters/` y a construir instancias concretas de Database Adapter.**

Justificación: `server/bootstrap/startServer.ts` ya es el punto de arranque real del proceso y la única capa que existe *por encima* de `routes/`. No conoce dominio, ni negocio, ni HTTP semántico — solo ensambla el sistema. Es el lugar natural donde «lo concreto» se une a «lo abstracto».

## 5.2 Inyección por aplicación parcial

> **`modules/*/application/` expone una factory que recibe sus dependencias y devuelve la función de caso de uso ya vinculada. Las capas superiores reciben la función construida, no las dependencias.**

Forma ilustrativa del patrón (no es implementación):

```
// application/  — importa la Repository INTERFACE (permitido, ADR-08 §10)
export type DiscoverProspectsFn =
  (industry, location, apiKey, excludeNames) => Promise<DiscoverProspectsResult>;

export function createDiscoverProspects(
  deps: { leadRepository: LeadRepository }
): DiscoverProspectsFn { ... }
```

```
// presentation/ — importa SOLO el tipo de application/.
// Nunca nombra LeadRepository. Nunca importa shared/persistence/.
export function createLeadHunterAgent(discoverProspects: DiscoverProspectsFn) { ... }
```

El mecanismo es un **closure**: la dependencia queda capturada en el momento de construcción y desaparece de la superficie de tipos. Por eso `presentation/` puede transportar un caso de uso con persistencia dentro sin conocer nunca que la persistencia existe.

## 5.3 Regla derivada

> **Ninguna capa distinta del Composition Root construye sus propias dependencias. Toda capa recibe lo que necesita ya construido, por parámetro.**

---

# 6. Ciclo de Vida de los Adapters

| Aspecto | Decisión |
| --- | --- |
| **Creación** | Una vez, durante el arranque del proceso, en el Composition Root. |
| **Propiedad** | Del Composition Root. Ninguna otra capa lo crea, lo reemplaza ni lo destruye. |
| **Alcance** | Toda la vida del proceso. Las capas inferiores lo reciben por referencia. |
| **Multiplicidad** | Una instancia por Repository Interface. |
| **Sustitución** | Cambiar `InMemoryLeadAdapter` por un adapter de motor real es un cambio de **una línea en el Composition Root**. Ninguna otra capa se entera. |

**Nota sobre `InMemoryLeadAdapter`:** su `Map` interno vive mientras viva el proceso. Los datos **no** sobreviven a un reinicio — sigue siendo un adapter de validación (ADR-08 §8), no persistencia definitiva. Lo que esta decisión garantiza es que el `Map` no se descarte entre requests, que era el requisito mínimo para que `save()` no fuera un no-op.

---

# 7. Qué NO es esta Decisión

Delimitación explícita frente a los patrones prohibidos por Sprint 14, Tarea 5:

| Patrón prohibido | Por qué esta decisión no lo es |
| --- | --- |
| **Framework de DI** | No se introduce ninguna dependencia nueva. El mecanismo es una función que recibe parámetros — TypeScript puro. |
| **Service Locator** | Nadie *pide* una dependencia a un registro central. Cada capa **recibe** lo que necesita por parámetro. No existe `container.get(...)`. |
| **Singleton global** | No hay export mutable a nivel de módulo, ni variable global, ni acceso desde cualquier punto. Existe **una instancia**, pero es **propiedad** del Composition Root y viaja **explícitamente** por la cadena de parámetros. La diferencia es la accesibilidad: un Singleton global es alcanzable desde cualquier archivo; esta instancia solo es alcanzable por quien la recibió. |
| **Variable global** | No se introduce ninguna. |

---

# 8. Dependencias Permitidas y Prohibidas

Este ADR **no modifica** la tabla de ADR-08 §10. La **extiende** añadiendo la única capa que ADR-08 no contemplaba:

| Capa | Puede importar | No puede importar |
| --- | --- | --- |
| `server/bootstrap/` (Composition Root) | `shared/persistence/adapters/`; `shared/persistence/repositories/`; las factories de `modules/*/application/` y `modules/*/presentation/`; `orchestrators/`; `routes/`; `express` | `modules/*/domain/`; `modules/*/infrastructure/`; `shared/persistence/models/`; SDKs de IA o de proveedores externos |

Todas las demás filas de ADR-08 §10 permanecen **exactamente como están**. En particular se confirman sin cambio:

- `modules/*/application/` **puede** importar la Repository Interface correspondiente; **no puede** importar `adapters/`, `models/` ni `contracts/`.
- `modules/*/presentation/` **no puede** importar `shared/persistence/` en ninguna de sus cuatro subcarpetas — **sin excepción**.

## 8.1 Alcance de esta tabla — extensión por ADR-17 *(v1.3)*

**La fila de §8 resuelve un problema concreto: cómo llega una Repository Interface concreta a `application/`.** Ese era el bloqueo que originó este ADR *(§4)*, y por eso la columna de prohibiciones incluye `modules/*/infrastructure/`: **bajo la arquitectura vigente al escribirse, el Composition Root no tiene nada que construir ahí.** `application/` importa su propio adapter de proveedor, facultad que **ADR-07 §8** le concede.

**Esa premisa deja de valer si `application/` pasa a depender de puertos también para los proveedores externos.** Entonces alguien tiene que construir el adapter que implementa el puerto, y **el único lugar autorizado a construir es el Composition Root** *(§5.1, §5.3)*.

| | |
| --- | --- |
| **Qué decide este ADR** | El mecanismo: factory, aplicación parcial, propiedad del Composition Root, sin framework de DI. **Íntegramente vigente y sin cambios** |
| **Qué no decidió** | Si el proveedor externo se recibe como puerto. **La cuestión no se planteó**: el bloqueo del Sprint 14 era de persistencia |
| **Dónde se decidió** | **ADR-17 §12 — AL-19**, `Approved` desde el 2026-07-30 |
| **Cómo se ajusta esta tabla** | **ADR-17 §9.1 la extiende con una fila**, sin modificar ninguna de las existentes. Es el mismo mecanismo que §8 de este documento aplicó sobre la tabla de **ADR-08 §10** |

> ## ✅ Fila añadida por ADR-17 §9.1 — **en vigor**
>
> | Capa | Puede importar | No puede importar |
> | --- | --- | --- |
> | `server/bootstrap/` | Todo lo que ya declara §8, **más `modules/*/infrastructure/` exclusivamente para construir adapters de proveedor y vincularlos a su puerto** | Todo lo que ya declara §8. **`modules/*/domain/` sigue prohibido**, salvo el **tipo** del puerto necesario para tipar la vinculación |
>
> **La extensión es acotada y verificable por grep** *(ADR-17 KPI-4)*: `bootstrap/` puede importar `modules/*/infrastructure/` **solo para construir y vincular**. **Invocarlo, leer de él o componer lógica con él sigue prohibido.**
>
> **Ninguna otra fila de §8 cambia.** En particular se confirman sin alteración: `shared/persistence/adapters/` solo se importa desde `bootstrap/` *(R-54)*, y `modules/*/presentation/` no importa `shared/persistence/` **sin excepción** *(R-23)*.

---

# 9. Flujo de Wiring

```
server/bootstrap/  (Composition Root)
  │
  ├─ crea  InMemoryLeadAdapter                    → LeadRepository
  │
  ├─ createDiscoverProspects({ leadRepository })  → DiscoverProspectsFn
  │        (application/ — conoce la Interface, nunca el Adapter)
  │
  ├─ createLeadHunterAgent(discoverProspectsFn)   → LeadHunterAgent
  │        (presentation/ — no conoce persistencia en ninguna forma)
  │
  ├─ createLeadAcquisitionWorkflow(agents)        → Workflow
  │        (orchestrators/ — no conoce persistencia, ADR-05 §6 P1)
  │
  └─ registerRoutes(app, { workflow })            → Express
           (routes/ — no conoce persistencia, ADR-05 §6 P1)
```

**Dirección de la dependencia:** lo concreto (Adapter) se inyecta desde arriba; el conocimiento no fluye hacia abajo. Cada capa solo conoce la abstracción que recibe.

---

# 10. Impacto en el Código Existente

Este ADR es de diseño; el impacto se materializa en la tarea que lo ejecute.

| Archivo | Cambio previsto | Naturaleza |
| --- | --- | --- |
| `server/bootstrap/startServer.ts` | Construir el grafo de dependencias antes de `registerRoutes`. | Estructural |
| `server/routes/index.ts` | `registerRoutes` recibe las dependencias ya construidas. | Estructural |
| `server/routes/prospectSearchRoute.ts` | El handler pasa a construirse por factory. | Estructural |
| `server/orchestrators/leadAcquisitionOrchestrator.ts` | El workflow pasa a construirse por factory. | Estructural |
| `server/modules/lead-hunter/presentation/LeadHunterAgent.ts` | El Agent pasa a construirse por factory. | Estructural |
| `server/modules/lead-hunter/application/discoverProspects.ts` | Expone factory; recibe `LeadRepository`. | Estructural + funcional |

> ⚠️ **Nota de alcance para Sprint 14, Tarea 5.** Tal como fue especificada, la Tarea 5 prohíbe modificar rutas HTTP. Implementar este ADR **requiere modificar `routes/` y `orchestrators/` estructuralmente** — para que reciban dependencias, no para cambiar su comportamiento.
>
> Se preservan sin excepción: **contratos HTTP, DTOs públicos, comportamiento de negocio y `analyzeProspects.ts`**. Ninguna de esas capas pasa a «conocer persistencia» (ADR-05 §6, Principio 1): reciben una función cuyo tipo no menciona repositorios.
>
> El alcance de la Tarea 5 debe ajustarse en consecuencia. Requiere aprobación del Product Owner.

---

# 11. Riesgos

| # | Riesgo | Mitigación |
| --- | --- | --- |
| R1 | El Composition Root crece hasta volverse inmanejable al añadirse más módulos y repositorios. | Se limita a ensamblar. Si crece, se divide por módulo **dentro** de `bootstrap/`, nunca delegando construcción a capas inferiores. |
| R2 | Alguien construye un adapter fuera del Composition Root, reintroduciendo acoplamiento. | KPI verificable por grep (§12): 0 imports de `shared/persistence/adapters/` fuera de `bootstrap/`. |
| R3 | El threading de parámetros se percibe como verboso frente a un contenedor DI. | Aceptado conscientemente: la verbosidad es explícita y rastreable; un contenedor oculta el grafo y fue descartado por la Tarea 5. |
| R4 | Confusión entre «instancia única propiedad del Composition Root» y «Singleton global». | Delimitado explícitamente en §7. |
| R5 | El ajuste de alcance de la Tarea 5 (§10) se interpreta como permiso para tocar contratos públicos. | §10 lo acota: cambios **estructurales**, nunca de contrato HTTP, DTO ni comportamiento. |

---

# 12. KPIs

Verificables por grep, en la línea de ADR-06/ADR-07/ADR-08:

- **0** imports de `shared/persistence/adapters/` fuera de `server/bootstrap/`.
- **0** imports de `shared/persistence/` en cualquier archivo de `modules/*/presentation/`.
- **0** imports de `shared/persistence/contracts/`, `models/` o `adapters/` en `modules/*/application/`.
- **0** dependencias nuevas en `package.json` atribuibles a inyección de dependencias.
- **1** única ubicación de construcción de Adapters en todo el backend.
- **1** línea a modificar para sustituir `InMemoryLeadAdapter` por un adapter de motor real.

---

# 13. Dependencias

- **ADR-08** — define qué puede importar cada capa. Este ADR lo respeta íntegramente y lo extiende con la fila de `bootstrap/` (§8).
- **ADR-05** — Principio 1: routes y orchestrators no conocen persistencia. Preservado (§9).
- **ADR-04** — Agent API como única puerta de acceso al módulo. Preservado: la factory devuelve la misma Agent API, solo cambia cómo se construye.
- **ADR-06 / ADR-07** — frontera HTTP pública. **Intacta**: este ADR no toca contratos públicos ni DTOs.
- **ADR-17 v1.1** *(`Approved`)* — Application Layer Architecture. **Extiende la tabla de §8** con la fila que la dependencia por puerto de proveedor requiere *(AL-20)*, y define la anatomía del caso de uso que §5.2 solo ilustraba. **No modifica ninguna decisión de este ADR.** Véase **§8.1**.

> ⚠️ **Precisión sobre el ejemplo ilustrativo de §5.2.** La firma `(industry, location, apiKey, excludeNames)` que allí aparece **hace viajar una credencial por la capa de aplicación**, lo que **ADR-17 §6.3 (P-4) prohíbe**: la clave la recibe el adapter desde `shared/config/`, nunca el caso de uso. **El ejemplo se conserva porque documenta el código de 2026-07-27**, y §3 de este ADR ya declara que sus firmas son ilustrativas y no implementación. **No debe copiarse.**

---

# 14. Glosario

**Composition Root:** único lugar del sistema donde se construye el grafo de dependencias concretas. En AKVEZ: `server/bootstrap/`.

**Aplicación parcial:** técnica por la cual una función recibe parte de sus argumentos y devuelve otra función que espera el resto. Aquí, la dependencia queda capturada en un closure y desaparece de la superficie de tipos.

**Factory:** función que recibe dependencias y devuelve el componente ya construido. Distinta de un contenedor de DI: no registra, no resuelve, no busca — solo construye lo que se le pasa.

**Ownership (propiedad):** capa responsable del ciclo de vida de una instancia. Aquí, siempre el Composition Root.

---

# 15. Referencias

- ADR-04 — Backend Agent Architecture.
- ADR-05 — Persistence Architecture & Data Layer (§5 motor sin decidir; §6 Principio 1).
- ADR-08 — Persistence Boundary & Repository Isolation (§3 alcance diferido; §8 responsabilidades; §10 dependencias permitidas).
- ADS-00 — Documentation Standard.
- Sprint 13, Tarea 1 — Persistence Architecture Audit (Decisión 4 pendiente).
- Sprint 14, Tarea 4 — InMemoryLeadAdapter (adapter de validación).
- Sprint 14, Tarea 5 — Connect Persistence to Application (bloqueada; origen de este ADR).

---

# 16. Definition of Done

Este ADR podrá considerarse terminado cuando:

- Defina una ubicación única e inequívoca del Composition Root. ✅
- Defina cómo `application/` obtiene una Repository Interface sin depender de `adapters/`. ✅
- Defina el ciclo de vida y la propiedad de los Adapters. ✅
- No introduzca framework de DI, Service Locator ni Singleton global. ✅
- No modifique ADR-05, ADR-06, ADR-07 ni ADR-08 — solo los referencie. ✅
- Declare explícitamente su impacto sobre el alcance de Sprint 14, Tarea 5. ✅
- **Sea revisado y aprobado formalmente por el Product Owner.** ✅

---

> **Estado actual:** este ADR se encuentra en **Approved** (v1.3, 2026-07-30). Constituye una decisión arquitectónica permanente conforme a ADS-00. Fue ejecutado en Sprint 14, Tarea 5: el Composition Root vive en `server/bootstrap/compositionRoot.ts` y es el único punto del backend que importa `shared/persistence/adapters/`.
>
> **Las v1.2 y v1.3 no alteran nada de lo anterior.** Añaden **§8.1**, que declara el alcance de la tabla de §8 y registra la fila con que **ADR-17 §9.1** la extiende. **Ninguna de las decisiones de §5 a §7 resulta modificada, y ninguna fila preexistente de §8 cambia.**
