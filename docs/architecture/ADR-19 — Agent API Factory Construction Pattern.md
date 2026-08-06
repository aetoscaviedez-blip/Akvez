# ADR-19 — Patrón de Construcción de la Agent API

| Campo | Valor |
| --- | --- |
| Código | **ADR-19** |
| Clasificación | Architecture Decision Record — Arquitectura de capa |
| Versión | **1.0** |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-08-04 |
| Última actualización | 2026-08-04 |
| Responsable | AKVEZ Architecture Team |
| **Approved by** | **AKVEZ Architecture Team** |
| **Date** | **2026-08-04** |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Ubicación | `docs/architecture/` — véase §14 |
| Origen | Sprint COM-39, tarea 1 · hallazgo **COM-33 §3.3** |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 0.1 | 2026-08-04 | Ingeniería | Borrador `Draft` como `ADR-XX`. Seis decisiones D-1 a D-6; §8 dejaba abierta la relación con el ejemplo de ADR-09 §5.2. | Sprint COM-34, tarea 2. Hueco normativo detectado en COM-33 §3.3: ninguna regla publicada fija la firma de la factoría de `presentation/`. |
| **1.0** | **2026-08-04** | **AKVEZ Architecture Team** | **Ratificación.** Estado `Draft` → **`Approved`**; número `ADR-XX` → **`ADR-19`**. **Se cierra la cuestión abierta de §8** adoptando la lectura A, por autodeclaración literal de ADR-09 §5.2 *(«forma ilustrativa del patrón (no es implementación)»)*; en consecuencia se retira aquella sección y el riesgo asociado. **Ninguna de las seis decisiones D-1 a D-6 se modifica.** | Sprint **COM-39 — Architecture Governance Closure**. Seis auditorías documentales independientes *(COM-34 a COM-38)* confirmaron que **ningún documento del Blueprint publica la firma de la factoría de la Agent API**, y que el hueco solo puede cerrarse con un acto de autoridad. Levanta el bloqueo **B-4**. |

---

# 1. Resumen Ejecutivo

**Existe una regla publicada para la forma de la factory de `application/` —ADR-17 §8.2— y ninguna para la de `presentation/`.**

**COM-33 §3.3** lo detectó al migrar `createPitchGeneratorAgent` a objeto de dependencias: la migración era correcta y su coste estaba medido, pero **ADR-17 gobierna `application/`**, y la Agent API es `presentation/`. **DEV-00 §5.1 solo fija el nombre** de la factoría *(`create` + agente + `Agent`)*, **no su firma**.

Este ADR cierra ese hueco. **Cinco de sus seis decisiones son reglas ya vigentes** —ADR-04, ADR-09, ADR-17, DEV-00— **enunciadas para la capa que ninguna nombraba explícitamente**. **Solo D-1 crea norma nueva**, y es la razón por la que este documento existe.

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

- **La forma de las factorías de `application/`** — decidida en **ADR-17 §8.2**. Este ADR **no la altera**.
- **El mecanismo de inyección** — decidido en **ADR-09 §5.2**. Este ADR **no lo altera**.
- **Qué operaciones expone cada Agent API** — competencia del ADR de dominio que las atribuye *(ADR-16 §6 · APS-03 §7)*.
- **La migración de las Agent API existentes** — §9. **No se ejecuta con esta aprobación.**

---

# 4. Contexto

**Estado del código al 2026-08-04:**

| Agent API | Parámetros | Forma |
| --- | :-: | --- |
| `createLeadHunterAgent` | 2 | Posicional |
| `createLeadAnalyzerAgent` | 2 | Posicional |
| `createPitchGeneratorAgent` | 6 | **Objeto nominal** |

**Qué fija cada documento previo, y hasta dónde llega — seis auditados:**

| Documento | Qué fija | Alcance |
| --- | --- | --- |
| **ADR-04 §7.7** | `presentation/` es la única superficie externa del módulo | **Qué expone**, no cómo se construye |
| **ADR-09 §5.2** | Ejemplo `createLeadHunterAgent(discoverProspects)` | **Autodeclarado *«forma ilustrativa del patrón (no es implementación)»***; su enunciado decisional **nombra `application/`** |
| **ADR-09 §5.3 · R-55** | Ninguna capa distinta del Composition Root construye sus dependencias | **Quién construye**, no la firma |
| **ADR-17 §8.2 F-1** | Objeto `Deps` con nombres | **`application/` únicamente** |
| **DEV-00 §5.1** | `create` + agente + `Agent` | **Solo el nombre** |
| **ARCH-01 §4 · §1.2 · DR-4** | *«firma, factory… la decide ADR-17 §5 a §8»* — **en la sección de `application/`**. De `presentation/` solo fija **de qué depende** | No alcanza la firma |
| **ADS-01 §3.2** | *«¿Qué recibe la factory? → ADR-17 §8»* | **Acotado por el título de su sección: «La capa de aplicación»** |

> ### **El hueco es exacto: ningún documento publica la firma de la factoría de la Agent API.**

---

# 5. Decisión

## 5.1 D-1 — La factory recibe un único parámetro con nombres

> ## **`modules/*/presentation/` expone una factory que recibe un único parámetro: un objeto `<Agente>AgentDeps` cuyos campos son funciones de caso de uso del propio módulo, con nombre.**

### Forma aprobada

```ts
createPitchGeneratorAgent({
  readDiagnosis,
  readSequence,
  generateProposal
})
```

### Forma prohibida

```ts
createPitchGeneratorAgent(
  readDiagnosis,
  readSequence,
  generateProposal
)
```

> ⚠️ **El bloque anterior ilustra LA FORMA, no la firma real de ningún agente.** Los nombres de campo los declara cada módulo en su propia interfaz `<Agente>AgentDeps`; `pitchGeneratorAgent` declara hoy seis: `generateOutreachPitch`, `generateDiagnosis`, `createSequence`, `readReducedDiagnosis`, `readReducedSequence`, `generateProposal`.
>
> **Esta advertencia es deliberada.** El único ejemplo previo de una factoría de `presentation/` —ADR-09 §5.2— se leyó durante sprints como si fijara una firma, y no lo hacía. **Un ejemplo sin etiqueta de alcance es la causa documentada de este ADR.**

### Fundamento — empírico, no estético

Las funciones de caso de uso comparten forma. En `pitchGeneratorAgent`, **cuatro de las seis dependencias son `(input) => Promise<Result>`**. Con parámetros posicionales:

- **Intercambiar dos compilaba sin error.** El defecto solo aparecía al ejecutar la operación equivocada.
- **En pruebas era peor:** los dobles se escriben `as any` / `as never`, y el compilador **no distinguía ninguna de las seis**. Una suite pasaba literalmente `fail as any` seis veces.
- **Añadir un parámetro obligó a tocar las mismas cinco llamadas en dos sprints distintos** *(Sprints 19 y 31)*.

> **Es un defecto que `strict` no detecta.** Ésa es la razón de la regla.

## 5.2 D-2 — Ninguna dependencia es opcional ni tiene valor por defecto

> **Todo campo de `<Agente>AgentDeps` es obligatorio.**

Un valor por defecto sería **construir dentro de `presentation/`**, prohibido por **R-55** y **ADR-09 §5.3**. Equivale a **ADR-17 §8.2 F-3** para `application/`.

## 5.3 D-3 — La factory no ejecuta trabajo ni valida

> **Solo cierra sobre sus dependencias y devuelve el objeto de la Agent API.**

No abre conexiones, no lee configuración, no invoca proveedores y **no valida sus dependencias en tiempo de ejecución**: el compilador con `strict` es la verificación *(DEV-00 §6.1)*. Equivale a **F-4** y **F-5** de ADR-17 §8.2.

## 5.4 D-4 — El Composition Root es el único constructor

> **`server/bootstrap/` es el único lugar autorizado a invocar `create<Agente>Agent`.**

**No es decisión nueva:** es **R-54**, **R-55** y **ADR-09 §5.1** aplicados a esta capa. Se enuncia porque su infracción tiene una forma característica **y ya ocurrida**: el agente como `const` exportado que construye su propia cadena al importarse, que **R-57** prohíbe como singleton de módulo y **ADR-15 §9.5** declaró *«prerrequisito técnico de todo lo demás»*.

**Corolario verificable:** construir el grafo dos veces debe producir dos grafos independientes. *(Cubierto por `compositionRoot.test.ts`.)*

## 5.5 D-5 — La Agent API es la frontera pública del módulo

> **`presentation/` es la única superficie del módulo que un componente externo conoce.**

**ADR-04 §7.7 · R-07 · ARCH-01 DR-4.** Dos consecuencias explícitas:

| Consecuencia | Regla |
| --- | --- |
| La Agent API **no importa `shared/persistence/`** en ninguna de sus cuatro subcarpetas — **sin excepción** | **R-23** · ADR-08 §10 |
| El repositorio viaja **capturado en el closure** del caso de uso, fuera de la superficie de tipos | ADR-09 §5.2 |

## 5.6 D-6 — Un Orchestrator nunca alcanza `application/`

> **Un Orchestrator recibe Agent API construidas. Nunca recibe, importa ni invoca una función de caso de uso directamente.**

**R-07 · ADR-04 §7.7, §7.8.**

> ### ⚠️ **Es la regla que el proyecto ya infringió, y por eso se enuncia aparte.**
>
> **COM-30 y COM-31** documentan el caso: durante **tres sprints**, `commercialProposalOrchestrator` recibió `GenerateProposal` por inyección directa desde el Composition Root. El razonamiento que lo sostenía **confundía la Agent API con la superficie de producto**.
>
> **ADR-04, glosario:** la Agent API es *«el conjunto de capacidades que el agente expone **hacia el Orchestrator**»*. **La publicación al producto es la ruta HTTP** *(§7.8)*.
>
> > **Exponer ≠ publicar.** Una operación puede estar en la Agent API y no tener ruta. Es el estado de `GenerateProposal` hoy, y es correcto.

**Corolario:** el Composition Root pasa a un Orchestrator **agentes y workflows ya construidos**, nunca casos de uso sueltos.

---

# 6. Relación con el ejemplo de ADR-09 §5.2 — **resuelta**

**ADR-09 §5.2 muestra `createLeadHunterAgent(discoverProspects: DiscoverProspectsFn)`, un parámetro posicional.**

> ### **No hay tensión con D-1, y lo establece el texto literal de ADR-09 — no una interpretación.**

| Constatación | Fuente |
| --- | --- |
| El bloque va **encabezado por *«forma ilustrativa del patrón (no es implementación)»*** | ADR-09 §5.2 |
| Su **enunciado decisional nombra `application/`**: *«`modules/*/application/` expone una factory que recibe sus dependencias…»* | ADR-09 §5.2 |
| **El código real diverge del ejemplo desde hace sprints** —`createLeadHunterAgent` recibe **dos** parámetros, el ejemplo muestra **uno**— y **ninguna auditoría lo señaló jamás** | Código · COM-33 a COM-38 |

> **ADR-09 §5.2 no impone forma alguna a `presentation/`. No necesita nota de superación y no se modifica.**

---

# 7. Relación con los ADR vigentes

**Este ADR extiende. No modifica ninguno.**

| ADR | Relación |
| --- | --- |
| **ADR-04** | **Sin cambios.** §7.7 y §7.8 se citan y refuerzan |
| **ADR-09** | **Sin cambios.** §5.2 conserva su texto íntegro — §6 |
| **ADR-17** | **Sin cambios.** §8.2 sigue gobernando `application/` **y solo `application/`** |
| **ADR-08** | **Sin cambios.** §10 y R-23 se citan íntegros |

**Mecanismo:** el precedente de **ADR-09 §8.1**, que extendió la tabla de ADR-08 §10 *«añadiendo una fila, sin modificar ninguna de las existentes»*, y que **ADR-17 §9.1** replicó del mismo modo. **Este ADR aplica el mismo patrón a una capa que ninguno de los tres nombra.**

---

# 8. Reglas derivadas para DEV-00

**Ahora que este ADR está `Approved`, DEV-00 puede incorporarlas** *(antes habrían sido nulas por ADS-00 R-7)*:

| # | Regla | Fuente |
| --- | --- | --- |
| **R-a** | `modules/*/presentation/` expone una factory que recibe **un único parámetro**: un objeto `<Agente>AgentDeps` con nombres | §5.1 |
| **R-b** | Ninguna dependencia de la Agent API es opcional ni tiene valor por defecto | §5.2 |
| **R-c** | La factory de la Agent API **no ejecuta trabajo ni valida** en tiempo de ejecución | §5.3 |
| **R-d** | **Un Orchestrator no recibe ni invoca funciones de `application/`.** Solo Agent API y workflows ya construidos | §5.6 |

> **La numeración definitiva la asigna DEV-00**, no este documento.

---

# 9. Aplicación y migración

## 9.1 Aplicación inmediata

> ## **Toda Agent API Factory NUEVA debe construirse con objeto de dependencias nombrado, desde el 2026-08-04.**

## 9.2 ⛔ Agent API existentes — NO migrar todavía

| Agent API | Estado | Acción |
| --- | :-: | --- |
| `createPitchGeneratorAgent` | ✅ Conforme | **Ninguna** |
| `createLeadHunterAgent` | Posicional, 2 params | **Migrar — en sprint separado** |
| `createLeadAnalyzerAgent` | Posicional, 2 params | **Migrar — en sprint separado** |

> ### **La aprobación de este ADR crea la regla. La migración es un sprint separado y NO forma parte de esta aprobación.**
>
> Con dos parámetros, el coste que motivó D-1 no se materializa: la migración es **uniformidad**, no corrección de defecto. **Ninguna de las dos produce hoy un defecto observable.**

---

# 10. Riesgos

| # | Riesgo | Severidad | Mitigación |
| :-: | --- | :-: | --- |
| **1** | **La migración de §9.2 no se ejecuta nunca** y las tres Agent API quedan divergentes **con una norma vigente que lo prohíbe** | 🔴 **Alta** | Sprint de migración planificado explícitamente |
| **2** | **Las reglas R-a a R-d no descienden a DEV-00** y el ADR no llega a quien escribe código | 🟡 Media | §8 |
| **3** | **El ejemplo de §5.1 se lee como firma real** de `pitchGeneratorAgent` | 🟢 Baja | Advertencia explícita en §5.1 |

---

# 11. Alternativas evaluadas

| Alternativa | Motivo del descarte |
| --- | --- |
| **A — No escribir nada** | Es el estado previo. Produjo COM-33 §3.3: una migración correcta **sin documento que la respalde** |
| **B — Enmendar ADR-17 para cubrir `presentation/`** | ADR-17 es *Application Layer Architecture*. Ampliarlo desdibuja su alcance, y **modificar un ADR `Approved` es más invasivo que añadir uno** |
| **C — Escribirlo como regla DEV-00 directamente** | **Nula por ADS-00 R-7**: una regla DEV que no deriva de un documento superior *«es nula, y su presencia constituye un defecto»* |
| **D — Este ADR** | ✅ **Adoptada.** Extiende sin modificar, con el precedente de ADR-09 §8.1 y ADR-17 §9.1 |

---

# 12. Definition of Done

- [x] Contenido verificado contra su fundamento — COM-37/1 §4, COM-38/1 §3.
- [x] **Cuestión abierta del ejemplo de ADR-09 §5.2 resuelta** — §6.
- [x] Número asignado: **ADR-19**.
- [x] Estado `Draft` → **`Approved`**, con autoridad y fecha registradas.
- [x] Catalogado — `docs/architecture/INDEX.md`.
- [ ] Reglas **R-a a R-d** en DEV-00 §3, con numeración propia.
- [ ] Migración de §9.2, en sprint separado.
- [ ] **Traslado a `docs/blueprint/ADR/`** — §14.

---

# 13. Impacto en el código

> **Ninguno con esta aprobación.**

| Elemento | Efecto |
| --- | :-: |
| `createPitchGeneratorAgent` | ✅ **Ya conforme.** Sin cambios |
| `createLeadHunterAgent` · `createLeadAnalyzerAgent` | ⏸️ **Migración diferida** a sprint separado *(§9.2)* |
| Toda Agent API nueva | ✅ Debe seguir D-1 desde hoy |

**197 pruebas verdes. Ningún fichero de código modificado por esta aprobación.**

---

# 14. ⚠️ Nota de ubicación

**Este documento reside en `docs/architecture/`, no en `docs/blueprint/ADR/`.**

**La Clasificación Oficial de ADS-00 es cerrada y el catálogo del Blueprint se sincroniza en `docs/blueprint/INDEX.md`, que este sprint no ha tocado.** En consecuencia:

- **ADR-19 es `Approved` y vinculante** por el acto de aprobación del Architecture Team registrado en la cabecera.
- **Su alta en el catálogo del Blueprint —traslado a `docs/blueprint/ADR/` y sincronización de `docs/blueprint/INDEX.md`— es un acto pendiente**, que corresponde al Product Office en un cierre de bloque de gobernanza.

**Se registra para que la diferencia no se descubra más tarde.**

---

# 15. Referencias

**ADR-04 v1.3** §7.6, §7.7, §7.8, §10, §17 · **ADR-08 v1.2** §10 · **ADR-09 v1.3** §5.1, §5.2, §5.3, §6, §7, §8, §8.1 · **ADR-15 v1.2** §9.5 · **ADR-16 v1.1** §6 · **ADR-17 v1.1** §8.1, §8.2, §9.1, §14 · **ADS-00 v1.3** *Estados del Documento*, R-4, R-5, R-7 · **ADS-01 v1.4** §3.1, §3.2 · **ARCH-01 v1.3** §1.2, §4, §6.1 *(DR-4)* · **DEV-00** §5.1, §6.1, R-07, R-11, R-23, R-54, R-55, R-56, R-57 · **AR-05** RC-2 · **APS-03** §7 · **COM-30** · **COM-31** · **COM-33** §3 · **COM-34** a **COM-38**.
