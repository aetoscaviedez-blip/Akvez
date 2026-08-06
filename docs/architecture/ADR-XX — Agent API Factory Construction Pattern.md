# ADR-XX — Patrón de Construcción de la Agent API

| Campo | Valor |
| --- | --- |
| Código | **`ADR-XX` — número sin asignar** *(candidato: **ADR-19**; el siguiente libre tras ADR-18)* |
| Clasificación | Architecture Decision Record — Arquitectura de capa |
| Versión | 0.1 |
| Estado | 🟡 **`Draft`** — **propuesta. No vinculante** |
| Fecha de creación | 2026-08-04 |
| Responsable | Propuesto por Ingeniería · **pendiente de AKVEZ Architecture Team** |
| Ubicación | **`docs/architecture/`**, *fuera del Blueprint* |
| Estándar aplicado | ADS-00 v1.3 |
| Motivo | Sprint COM-34, tarea 2 — hallazgo **COM-33 §3.3** |

> ## ⚠️ Tres advertencias de gobernanza, antes de nada
>
> **1. Este documento NO está en el Blueprint.** Vive en `docs/architecture/`, no en `docs/blueprint/ADR/`. **No se ha modificado ningún documento del Blueprint** y **`INDEX.md` no se ha tocado**.
>
> **2. El número no está asignado.** Se propone **ADR-19**; asignarlo y catalogarlo es un acto de gobernanza que corresponde al cierre de un bloque, no a un sprint de ingeniería.
>
> **3. `Draft` no obliga. ADS-00 R-4:** *«Un documento en estado `Draft` nunca prevalecerá sobre uno `Approved`.»* **Mientras este ADR no se ratifique, el código existente no está en infracción por no seguirlo.**

---

# 1. Resumen Ejecutivo

**Existe una regla publicada para la forma de la factory de `application/` —ADR-17 §8.2— y ninguna para la de `presentation/`.**

**COM-33 §3.3** lo encontró al migrar `createPitchGeneratorAgent` a objeto de opciones: la migración era correcta y el coste que la motivaba estaba medido, pero **ADR-17 gobierna `application/`**, y la Agent API es `presentation/`. **DEV-00 §5.1 solo fija el nombre** de la factoría *(`create` + agente + `Agent`)*, **no su firma**.

Resultado: **las tres Agent API del backend se construyen hoy de dos formas distintas, y ninguna infringe nada.**

Este ADR propone cerrar ese hueco. **No introduce ninguna decisión nueva:** cada regla que declara ya existe en ADR-04, ADR-09 o ADR-17. Lo que hace es **enunciarlas juntas para la capa que ninguna de las tres nombra explícitamente**.

---

# 2. Objetivo

Fijar, para la capa `presentation/` de todo módulo backend:

1. La **forma del parámetro** de su factory.
2. Quién la **construye**, y quién no puede.
3. Qué **frontera** representa.
4. Qué **no puede alcanzarla** desde fuera.

---

# 3. Alcance

## 3.1 Incluye

- La firma de `create<Agente>Agent` en `modules/*/presentation/`.
- Su relación con el Composition Root y con los Orchestrators.

## 3.2 No incluye

- **La forma de las factorías de `application/`** — ya decidida, **ADR-17 §8.2**. Este ADR no la altera.
- **El mecanismo de inyección** — ya decidido, **ADR-09 §5.2**. Este ADR no lo altera.
- **Qué operaciones expone cada Agent API.** Es competencia del ADR de dominio que las atribuye *(ADR-16 §6, APS-03 §7)*.
- **La migración de las Agent API existentes.** Se propone en §9; **no se ejecuta aquí**.

---

# 4. Contexto — el hueco, con nombres

**Estado real del código al 2026-08-04:**

| Agent API | Parámetros | Forma | ¿Infringe algo? |
| --- | :-: | --- | :-: |
| `createLeadHunterAgent` | 2 | **Posicional** | ❌ **No.** Ninguna regla publicada la alcanza |
| `createLeadAnalyzerAgent` | 2 | **Posicional** | ❌ **No** |
| `createPitchGeneratorAgent` | 6 → **objeto** | **Nominal** *(COM-33 §3)* | ❌ **No.** Autorizada por documento de sprint |

**Qué dice cada documento existente, y hasta dónde llega:**

| Documento | Qué fija | Alcance |
| --- | --- | --- |
| **ADR-04 §7.7** | `presentation/` es la única superficie externa del módulo | **Qué expone**, no cómo se construye |
| **ADR-09 §5.2** | Ejemplo `createLeadHunterAgent(discoverProspects: DiscoverProspectsFn)` | ⚠️ **Es «forma ilustrativa del patrón (no es implementación)»** — y muestra **un** parámetro posicional |
| **ADR-09 §5.3 · R-55** | Ninguna capa distinta del Composition Root construye sus dependencias | **Quién construye**, no la firma |
| **ADR-17 §8.2 F-1** | La factory recibe **un único parámetro**: objeto `Deps` con nombres | ⚠️ **`application/` únicamente** |
| **DEV-00 §5.1** | Nombre: `create` + agente + `Agent` | **Solo el nombre** |

> ### **El hueco es exacto: nadie publica la firma de la factoría de `presentation/`.**
>
> **Y el único ejemplo publicado —ADR-09 §5.2— es posicional**, con la advertencia expresa de que ilustra el patrón y no es implementación. Un desarrollador que buscara la regla encontraría **un ejemplo posicional en un ADR `Approved`** y **una regla nominal en un ADR que no gobierna su capa**.

---

# 5. Decisión propuesta

## 5.1 D-1 — La factory de la Agent API recibe un único parámetro con nombres

> **`modules/*/presentation/` expone una factory que recibe un único parámetro: un objeto `<Agente>AgentDeps` cuyos campos son funciones de caso de uso del propio módulo, con nombre.**

**Fundamento — y es empírico, no estético:**

Las funciones de caso de uso comparten forma. En `pitchGeneratorAgent`, **cuatro de las seis dependencias son `(input) => Promise<Result>`**. Con parámetros posicionales:

- **Intercambiar dos compilaba sin error.** El defecto solo aparecía al ejecutar la operación equivocada.
- **En las pruebas era peor:** los dobles se escriben `as any` / `as never`, y el compilador no distinguía ninguno de los seis. Una suite pasaba literalmente `fail as any` seis veces.
- **Añadir un parámetro obligó a tocar las mismas cinco llamadas en dos sprints distintos** *(Sprints 19 y 31)*.

**Es la misma forma que ADR-17 §8.2 F-1 impone a `application/`, y por la misma razón.** Este ADR **no la extiende por analogía**: la enuncia para `presentation/` con su propia justificación medida.

## 5.2 D-2 — Ninguna dependencia es opcional ni tiene valor por defecto

> **Todo campo de `<Agente>AgentDeps` es obligatorio.**

Un valor por defecto sería **construir dentro de `presentation/`**, prohibido por **R-55** y **ADR-09 §5.3**. Es la misma prohibición que **ADR-17 §8.2 F-3** enuncia para `application/`.

## 5.3 D-3 — La factory no ejecuta trabajo ni valida

> **Solo cierra sobre sus dependencias y devuelve el objeto de la Agent API.**

No abre conexiones, no lee configuración, no invoca proveedores y **no valida sus dependencias en tiempo de ejecución**: el compilador con `strict` es la verificación *(DEV-00 §6.1)*. Equivale a **F-4** y **F-5** de ADR-17 §8.2.

## 5.4 D-4 — El Composition Root es el único constructor

> **`server/bootstrap/` es el único lugar autorizado a invocar `create<Agente>Agent`.**

**No es una decisión nueva** — es **R-54**, **R-55** y **ADR-09 §5.1** aplicados a esta capa. Se enuncia porque su infracción tiene una forma característica y ya ocurrida: **el agente como `const` exportado que construye su propia cadena al importarse**, que **R-57** prohíbe como singleton de módulo y **ADR-15 §9.5** declaró *«prerrequisito técnico de todo lo demás»*.

**Corolario verificable:** construir el grafo dos veces debe producir dos grafos independientes. *(Ya cubierto por `compositionRoot.test.ts`.)*

## 5.5 D-5 — La Agent API es la frontera pública del módulo

> **`presentation/` es la única superficie del módulo que un componente externo conoce.**

**ADR-04 §7.7**, **R-07**. Dos consecuencias que este ADR hace explícitas:

| Consecuencia | Regla |
| --- | --- |
| La Agent API **no importa `shared/persistence/`** en ninguna de sus cuatro subcarpetas — **sin excepción** | **R-23** · ADR-08 §10 |
| El repositorio viaja **capturado en el closure** del caso de uso, fuera de la superficie de tipos | ADR-09 §5.2 |

> **Es lo que permite que `presentation/` transporte un caso de uso con persistencia dentro sin conocer nunca que la persistencia existe.**

## 5.6 D-6 — Un Orchestrator nunca alcanza `application/`

> **Un Orchestrator recibe Agent API construidas. Nunca recibe, importa ni invoca una función de caso de uso directamente.**

**R-07 · ADR-04 §7.7 · §7.8.**

> ### ⚠️ **Esta es la regla que el proyecto ya infringió, y por eso se enuncia aparte.**
>
> **COM-30 y COM-31** documentan el caso: durante **tres sprints**, `commercialProposalOrchestrator` recibió `GenerateProposal` por inyección directa desde el Composition Root. El razonamiento que lo sostenía —*«exponerlo presentaría un bloqueo de gobernanza como si fuera una función del producto»*— **confundía la Agent API con la superficie de producto**.
>
> **ADR-04, glosario:** la Agent API es *«el conjunto de capacidades que el agente expone **hacia el Orchestrator**»*. **La publicación al producto es la ruta HTTP** *(§7.8)*.
>
> > **Exponer ≠ publicar.** Una operación puede estar en la Agent API y no tener ruta. Es el estado en que `GenerateProposal` está hoy, y es correcto.

**Corolario:** el Composition Root pasa a un Orchestrator **agentes y workflows ya construidos**, nunca casos de uso sueltos.

---

# 6. Reglas derivadas propuestas para DEV-00

**Si este ADR se ratifica**, DEV-00 debería incorporar:

| # | Regla | Fuente |
| --- | --- | --- |
| **R-a** | `modules/*/presentation/` expone una factory que recibe **un único parámetro**: un objeto `<Agente>AgentDeps` con nombres | §5.1 |
| **R-b** | Ninguna dependencia de la Agent API es opcional ni tiene valor por defecto | §5.2 |
| **R-c** | La factory de la Agent API **no ejecuta trabajo ni valida** en tiempo de ejecución | §5.3 |
| **R-d** | **Un Orchestrator no recibe ni invoca funciones de `application/`.** Solo Agent API y workflows ya construidos | §5.6 |

> **La numeración la asigna DEV-00, no este documento.** **ADS-00 R-7:** *«La categoría DEV es siempre derivada y nunca prevalece… Una regla DEV que no derive de un documento superior es nula.»* **Escribir R-a a R-d en DEV-00 antes de ratificar este ADR las haría nulas.**

---

# 7. Cómo se relaciona con los ADR vigentes

**Este ADR extiende. No modifica ninguno.**

| ADR | Relación |
| --- | --- |
| **ADR-04** | **Sin cambios.** §7.7 y §7.8 se citan y se refuerzan; nada se reinterpreta |
| **ADR-09** | **Sin cambios decisionales.** ⚠️ Su §5.2 contiene el **único ejemplo publicado** de una factoría de `presentation/`, y es posicional — **véase §8** |
| **ADR-17** | **Sin cambios.** Su §8.2 sigue gobernando `application/` **y solo `application/`** |
| **ADR-08** | **Sin cambios.** §10 y R-23 se citan íntegros |

**El mecanismo es el precedente de ADR-09 §8.1**, que extendió la tabla de ADR-08 §10 *«añadiendo una fila, sin modificar ninguna de las existentes»*, y que a su vez fue extendido por ADR-17 §9.1 del mismo modo. **Este ADR usa el mismo patrón sobre una capa que ninguno de los tres nombra.**

---

# 8. ⚠️ Cuestión abierta — el ejemplo de ADR-09 §5.2

**ADR-09 §5.2 muestra:**

```
export function createLeadHunterAgent(discoverProspects: DiscoverProspectsFn) { ... }
```

**Un parámetro, posicional.** Si este ADR se ratifica, ese ejemplo queda **en tensión** con D-1.

**Tres lecturas posibles, y este documento no elige:**

| # | Lectura | Consecuencia |
| :-: | --- | --- |
| **A** | El ejemplo es **ilustrativo** — el propio ADR-09 lo dice: *«forma ilustrativa del patrón (no es implementación)»*— y **no decide firma**. No hay tensión | Nada que corregir |
| **B** | El ejemplo **sí fija** una forma, y D-1 lo supera | ADR-09 necesita una **nota de superación** en §5.2 |
| **C** | Con **un solo parámetro** la ambigüedad posicional no existe, y D-1 debería aplicar **solo a partir de dos** | D-1 se reformula con umbral |

> **Recomendación de Ingeniería: la lectura A**, por el texto literal de ADR-09. **Pero es una interpretación de un ADR `Approved`, y ADS-00 R-5 impide que se resuelva aquí.** Se eleva.

---

# 9. Migración — **propuesta, no ejecutada**

| Agent API | Estado | Acción propuesta |
| --- | :-: | --- |
| `createPitchGeneratorAgent` | ✅ Nominal | Ninguna. Ya conforme |
| `createLeadHunterAgent` | Posicional, 2 params | **Migrar** — 1 llamada en el Composition Root |
| `createLeadAnalyzerAgent` | Posicional, 2 params | **Migrar** — 1 llamada en el Composition Root |

> **Con dos parámetros el coste que motivó D-1 no existe.** La migración de las dos restantes es **uniformidad**, no corrección de defecto: **ninguna de las dos está en infracción hoy**, y no lo estará hasta que este ADR se ratifique.
>
> **No se ha ejecutado.** Requiere ratificación previa y un sprint que la incluya en su alcance.

---

# 10. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se ratifica y no se ejecuta**, y las tres Agent API quedan divergentes **con una norma que lo prohíbe** — hoy la divergencia al menos no infringe nada | 🔴 Alta |
| **2** | **Se cita como norma vinculante estando en `Draft`.** Es **RC-2** de AR-05: *«un DP `Approved` se cita como norma sin haber descendido a un documento de orden superior»*, aquí en su forma más débil aún | 🔴 Alta |
| **3** | **La tensión con ADR-09 §5.2 no se resuelve** y cada sprint la reinterpreta | 🟡 Media |
| **4** | **Las reglas R-a a R-d se escriben en DEV-00 antes de la ratificación**, y nacen nulas por ADS-00 R-7 | 🟡 Media |

---

# 11. Alternativas evaluadas

| Alternativa | Motivo del descarte |
| --- | --- |
| **A — No escribir nada.** Dejar la firma sin norma | Es el estado actual. Produjo COM-33 §3.3: una migración correcta **sin documento que la respalde**. El próximo agente no tendrá regla que consultar |
| **B — Enmendar ADR-17 para que cubra `presentation/`** | ADR-17 es *Application Layer Architecture*. Ampliarlo a otra capa desdibuja su alcance, y **modificar un ADR `Approved` es más invasivo que añadir uno** |
| **C — Escribirlo como regla DEV-00 directamente** | **Nula por ADS-00 R-7**: una regla DEV que no deriva de un documento superior *«es nula, y su presencia constituye un defecto»* |
| **D — Este ADR** *(propuesto)* | Extiende sin modificar, con el precedente de ADR-09 §8.1 y ADR-17 §9.1 |

---

# 12. Definition of Done

- [ ] Revisado por el Architecture Team.
- [ ] **Resuelta la cuestión abierta de §8** *(ejemplo de ADR-09 §5.2)*.
- [ ] Número asignado y catalogado en `INDEX.md`.
- [ ] Trasladado a `docs/blueprint/ADR/`.
- [ ] Estado `Draft` → `Approved`, con aprobación registrada.
- [ ] **Solo entonces:** reglas R-a a R-d en DEV-00 §3, con numeración propia.
- [ ] **Solo entonces:** migración de §9, en un sprint que la incluya en su alcance.

---

# 13. Referencias

**ADR-04** §7.6, §7.7, §7.8, §10, §17 *(glosario)* · **ADR-08** §10 · **ADR-09** §5.1, §5.2, §5.3, §6, §7, §8, §8.1 · **ADR-15** §9.5 · **ADR-16** §6 · **ADR-17** §8.1, §8.2, §9.1, §14 · **ADS-00** R-4, R-5, R-7, *Estados del Documento* · **DEV-00** §5.1, §6.1, R-07, R-11, R-23, R-54, R-55, R-56, R-57 · **AR-05** RC-2, RC-11 · **COM-30** · **COM-31** · **COM-33** §3.
