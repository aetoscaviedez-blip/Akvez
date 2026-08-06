# Handoff — `GenerateProposal` (Sprints 10 → 32)

**Fecha:** 2026-08-04 · **Rama:** `main` · **Estado:** verde y detenido a la espera de Product Office.

---

# 1. Objetivo

**Construir `GenerateProposal` —el cuarto caso de uso canónico de ADR-16 §7, evento E-5— completo de extremo a extremo, sin emitir todavía.**

El encargo se desarrolló en veintitrés sprints encadenados: diseño del caso de uso, contratos reducidos de sus dos agregados de entrada, persistencia de A-6, adapter de redacción, Orchestrator compositor y cableado. **Con una restricción constante: no inventar ninguna decisión de producto.**

Donde el Blueprint no publica un valor, **el código declara la ausencia o lanza**. Nunca rellena.

---

# 2. En qué estado terminó todo

## 2.1 Verificación

```
npm run lint       ✅ limpio
npx tsc --noEmit   ✅ limpio
npm test           ✅ 191 pruebas · 25 ficheros
```

## 2.2 Qué funciona hoy

| Pieza | Estado |
| --- | :-: |
| Contrato de entrada y salida de `GenerateProposal` | ✅ Completo y probado |
| Flujo interno: validar → estrategia → redacción → control → persistir | ✅ Implementado |
| Errores tipados sobre la taxonomía de APS-03 §12 | ✅ |
| Lectura recortada de `BuyerDiagnosis` (A-11) | ✅ Proyección + lector + expuesta |
| Lectura recortada de `CommercialSequence` (A-12) | ✅ Proyección + lector + expuesta |
| Persistencia de A-6: contrato, modelo, mapper, adapter, suite | ✅ Reversibilidad demostrada |
| Adapter de redacción sobre Gemini | ✅ |
| `commercialProposalOrchestrator` | ✅ Construido y cableado |
| Agent API | ✅ Siete operaciones, superficie cerrada |

## 2.3 Qué NO funciona, y por qué es correcto

> **`GenerateProposal` no puede emitir. `selectStrategy` lanza `StrategyProfileUnavailableError` mientras `SP-01` no se publique (B-1).**

**No es un defecto: es la conducta que el Blueprint exige.** Sin versión del Perfil de Estrategia la emisión **no es reproducible** *(ADR-15 §7.2)*, y **P-I1** dice que sin estrategia explicable una `Proposal` *«no puede explicarse después, que es exactamente lo que la hace útil»*.

**El punto de control tampoco tiene cuerpo**, por el mismo bloqueo y por B-2.

**No hay ruta HTTP, y no debe haberla todavía.** El flujo llega hasta el caso de uso y se detiene ahí.

---

# 3. Archivos tocados

## 3.1 Creados — código *(24)*

**`modules/pitch-generator/domain/commercial/`**

| Archivo | Qué es |
| --- | --- |
| `proposalDraftingPort.ts` | Puerto canónico de redacción: recibe estrategia + lista cerrada, devuelve texto |
| `selectStrategy.ts` | Punto de decisión de estrategia. **Lanza** — bloqueado por B-1 |
| `controlPoint.ts` | Punto de control. **Lanza** — depende de B-1 |
| `proposalErrors.ts` | Dos errores explícitos sobre la taxonomía cerrada |
| `reducedDiagnosis.ts` · `reducedSequence.ts` | Los dos contratos reducidos |
| `reduceDiagnosis.ts` + test | Proyección de A-11 |
| `reduceSequence.ts` + test | Proyección de A-12 |

**`modules/pitch-generator/application/`**

| Archivo | Qué es |
| --- | --- |
| `generateProposal.ts` | El caso de uso |
| `generateProposal.structure.test.ts` | Forma de entrada, salida y dependencias, con guardas de tipo |
| `generateProposal.flow.test.ts` | Orden, ramas y fuente única de evidencia |
| `generateProposal.errors.test.ts` | Errores esperados, con `domain/` real |
| `readReducedDiagnosis.ts` + test · `readReducedSequence.ts` + test | Los dos lectores |

**`modules/pitch-generator/infrastructure/`** — `proposalDraftingAdapter.ts` + test.

**`shared/persistence/`** — `contracts/AffirmableFact.ts` · `models/AffirmableFactModel.ts` · `models/ProposalModel.ts` · `adapters/proposalMapper.ts` · `adapters/inMemoryProposalAdapter.ts` · `adapters/proposalRepository.contract.ts` + su test.

**`orchestrators/`** — `commercialProposalOrchestrator.ts` + test.
**`bootstrap/`** — `compositionRoot.test.ts`.

## 3.2 Modificados — código *(10)*

| Archivo | Qué cambió |
| --- | --- |
| `shared/persistence/contracts/Proposal.ts` | `affirmableFacts: string[]` → `AffirmableFactRecord[]` |
| `shared/persistence/contracts/CommercialStrategy.ts` | `evidenceBase: string[]` → `AffirmableFactRecord[]` |
| `shared/persistence/contracts/commercialValues.ts` | Dos conjuntos cerrados replicados: `FactKind`, `EvidenceObservation` |
| `shared/persistence/models/CommercialSequenceModel.ts` | Su `CommercialStrategyModel` sigue al contrato compartido |
| `shared/persistence/adapters/commercialSequenceMapper.ts` | Reconstrucción del hecho en la lectura |
| `modules/pitch-generator/presentation/pitchGeneratorAgent.ts` | **Tres operaciones nuevas**: las dos lecturas y `generateProposal`. De 3 a 6 parámetros |
| `bootstrap/compositionRoot.ts` | Repositorio de A-6, adapter de redacción, caso de uso, dos lectores y el Orchestrator |
| `generateDiagnosis.integration.test.ts` · `commercialFactsOrchestrator.test.ts` · `diagnosisRoute.test.ts` · `sequenceRoute.test.ts` | Argumentos nuevos en las llamadas a `createPitchGeneratorAgent` |

## 3.3 Documentación — `docs/architecture/`

**Creados (20):** COM-12 a COM-16, COM-18 a COM-32. *(No existe COM-17: el Product Office lo reservó.)*

**Modificados (7):** COM-23 a COM-29, con marcadores **SUPERSEDED BY COM-31 — parcialmente**. **Ninguna línea eliminada.**

## 3.4 Lo que NO se tocó

`src/` *(frontend)* · `lead-hunter` · `lead-analyzer` · `GenerateDiagnosis` · `CreateSequence` · `routes/` · los tres adapters de persistencia preexistentes · ningún ADR ni documento del Blueprint.

---

# 4. Qué se intentó y falló — para no repetirlo

## 4.1 🔴 El error de fondo: confundir Agent API con superficie de producto

**Qué pasó.** En COM-24 §3.4 argumenté que exponer `GenerateProposal` en la Agent API *«presentaría un bloqueo de gobernanza como si fuera una función del producto»*. **COM-27, COM-28 y COM-29 heredaron ese razonamiento por cita**, y durante tres sprints el Orchestrator invocó `application/` directamente.

**Por qué estaba mal.** **DEV-00 R-07**: *«`presentation/` (Agent API) es la única superficie del módulo que el Orchestrator conoce»*. **ADR-04, glosario**: la Agent API expone *«hacia el Orchestrator»*; **la superficie de producto es la ruta HTTP**. Y **DEV-00 v1.3 ya había corregido su propio diagrama** por este mismo motivo.

**Coste:** tres sprints con una infracción viva y cuatro documentos que hubo que marcar.

> ### **Lección: antes de razonar desde un comentario del código, buscar la regla en DEV-00 §3 y en el ADR que la respalda.** La regla existía; nadie la citó.

## 4.2 🟡 Pruebas que buscan subcadenas en JSON — dos falsos positivos

**Qué pasó.** `expect(JSON.stringify(x)).not.toContain("indicios")` falló **aunque el recorte funcionaba**: la cadena de confianza dice literalmente *«…con apoyo en **indicios** del análisis»*. Volvió a ocurrir en las pruebas de la Agent API.

> ### **Lección: comparar CLAVES, no subcadenas.** Para lo demás, contrastar contra **el valor real** —el enunciado del indicio—, nunca contra una palabra que puede aparecer en prosa legítima.

## 4.3 🟡 `??` tratando `null` como «no configurado»

**Qué pasó.** `overrides.diagnosis ?? DEFAULT` hacía imposible probar el caso `null`, que era justo el caso a probar.

> ### **Lección: usar `"clave" in overrides`.** Es la misma distinción que **R-38** protege en el dominio: **ausente y vacío no significan lo mismo**.

## 4.4 🟡 Un getter evaluado al desestructurar

**Qué pasó.** `harness()` devolvía `get decided()` para exponer un valor calculado *después*; `const { decided } = harness()` lo evaluó **inmediatamente** y dio `undefined`.

> ### **Lección: no exponer estado diferido por getter en un objeto que se desestructura.** Se resolvió mejor: el doble devuelve una lista **distinta en referencia** de la de entrada, lo que además hizo la prueba **discriminante**.

## 4.5 🟡 `vi.fn(async () => X)` sin parámetro declarado

`mock.calls[0][0]` **no compila**: el tipo de `calls` es la tupla vacía.

> ### **Lección: declarar `vi.fn(async (_input: unknown) => …)`** cuando la prueba vaya a inspeccionar el argumento.

## 4.6 🟡 Profundidad de import equivocada

`domain/commercial/proposalErrors.ts` importó `../../../shared/errors` en lugar de `../../../../`. El síntoma **no fue** «módulo no encontrado» sino **cuatro errores en cascada de tipo `Expected 0 arguments, but got 1`**, porque la clase base quedó sin resolver.

> ### **Lección: ante errores de aridad inexplicables en clases derivadas, comprobar primero que la clase base resuelve.**

## 4.7 🟡 Un parámetro obligatorio rompe cinco pruebas — dos veces

Añadir parámetros a `createPitchGeneratorAgent` obligó a tocar **las mismas cinco llamadas** en los Sprints 19 y 31.

> ### **Lección: la factoría posicional ya duele con seis. El séptimo parámetro exige migrar a un objeto de opciones** — y hacerlo antes, no después.

## 4.8 🔴 Tres sprints se detuvieron por especificaciones que no se podían cumplir

| Sprint | Qué pedía | Por qué no se pudo |
| --- | --- | --- |
| **15** | Implementar el adapter **sin tocar `GenerateProposal`** | El cambio de contrato rompía **dos líneas** del caso de uso: sin tocarlas no compilaba |
| **16** | Registrar `ProposalDraftingPort` | **Ningún adapter lo implementaba todavía** |
| **27** | Derivar `evidence` de **`CommercialFacts + ReducedDiagnosis`** | **Habría infringido RE-1**: sumar el diagnóstico abre una segunda vía hacia la lista cerrada, que es lo que COM-07 §2.2 cerró |

> ### **Lección: verificar el código antes de implementar el enunciado.** El Sprint 29 lo demostró al revés: **su premisa era falsa** —afirmaba que el Composition Root inyectaba las lecturas sueltas, y nunca fue así—. **Actuar sobre ella habría roto la frontera correcta.**

## 4.9 🟢 Una transcripción incompleta, detectada a tiempo

Al transcribir APS-20 §6 al adapter de redacción **omití la lista de prohibidos de Instagram DM**, que incluye la más importante: *«toda afirmación sobre lo publicado en el propio canal»* **(§3.2: el canal no amplía la base de evidencia)**.

> ### **Lección: al transcribir una sección del Blueprint, leerla entera.** El `sed` inicial cortó la salida y no lo noté hasta releer.

---

# 5. Pasos siguientes exactos

## 5.1 🔴 Product Office — nada avanza sin esto

| # | Acción | Documento | Desbloquea |
| :-: | --- | --- | --- |
| **1** | **Publicar `SP-01`** con las tres correspondencias **C-3a, C-3b y C-3c** | **COM-11 §3.2** | **B-1** — `selectStrategy` puede implementarse y el flujo puede emitir |
| **2** | **Fijar el número de reintentos del punto de control** y su documento de autoridad | **COM-11 §4** | **B-2** — el bucle rehacer→verificar |
| **3** | **Publicar la longitud de canal**: `CH-01`, `CH-02`, `CH-03` | APS-17 · **COM-17 pendiente** | El adapter deja de enviar sin límite |
| **4** | **Decidir el alcance de la memoria**: ¿`previousContribution` es del contacto anterior o de todos? | **COM-16 §8.2** | La política de llenado |

## 5.2 🟡 Arquitectura — se puede hacer ya, sin Product Office

| # | Acción | Documento |
| :-: | --- | --- |
| **5** | **Decidir el origen de `issuedAt`**: ¿entra en COM-07 §6 o lo pone `application/`? | **COM-12 RC-4** |
| **6** | **Decidir si una `Proposal` conserva de qué secuencia y de qué emisión de diagnóstico nació** | **COM-16 §8.1** · **COM-19 §7.3** |
| **7** | **Decidir la doble escritura**: canal, momento y lista se persisten dos veces | **COM-18 §3.3** |
| **8** | **Anotar COM-07 §6 como *superseded*** en los tres puntos que COM-14, COM-15 y COM-16 corrigieron | **COM-18 §1.2** — deuda documental más antigua abierta |
| **9** | **Enunciar la dependencia workflow → workflow** en un ADR: está en uso y ningún documento la nombra | **COM-32 §4.1** |

## 5.3 🟢 Ingeniería — sin dependencias externas

| # | Acción | Documento |
| :-: | --- | --- |
| **10** | **Unificar la traducción duplicada** entre `proposalMapper` y `commercialSequenceMapper` | **COM-23 §4.1** |
| **11** | **Migrar `createPitchGeneratorAgent` a objeto de opciones** antes del séptimo parámetro | §4.7 |
| **12** | **Retirar el par heredado sobre A-6** —`OutreachPitchRepository`— y el puerto de redacción anterior | **F-1** |
| **13** | **Actualizar F-2** para incluir la terna `(leadId, moment, issue)` | **COM-19 §7.2** |

## 5.4 El sprint siguiente, en concreto

> **Si llega `SP-01`:** implementar `selectStrategy` transcribiendo C-3a/b/c —**con la cabecera «ESTE FICHERO NO DECIDE NADA»**, precedente `weightingProfile.ts`—, después el punto de control con las cinco comprobaciones de APS-18 §10.3, después el bucle con el valor de B-2, y **solo entonces** la ruta HTTP.
>
> **Si no llega:** ejecutar 5 a 9 de §5.2 —cinco decisiones de arquitectura que no dependen de nadie más— y **cerrar formalmente `COM-12 RC-5` y `COM-19 §9`**, que **COM-23 §6 declaró cerrables** y solo esperan un pronunciamiento.

## 5.5 Regla que conviene mantener

**Nada de lo construido inventa un valor de producto.** Antes de añadir una constante, un valor por defecto o una rama nueva, comprobar que **un documento aprobado la publica**. Si no la publica:

**declarar la ausencia** —como `SIN-PERFIL-DE-ESTRATEGIA`— **o lanzar. Nunca rellenar.**

---

# 6. Mapa rápido de la serie COM

| Documento | Qué decide |
| --- | --- |
| **COM-12** | Registro de `RC-4` *(origen de `issuedAt`)* y `RC-5` *(trazabilidad al persistir)* |
| **COM-13** | Preparación de integración: qué existe, qué falta, quién es responsable |
| **COM-14** | **Contrato del diagnóstico reducido** y la cadena que lo produce |
| **COM-15** | **`criteriaVersion` lo sella `domain/`; no entra como argumento** |
| **COM-16** | **Contrato de la secuencia reducida** |
| **COM-18** | Auditoría final de los contratos reducidos |
| **COM-19 · COM-20 · COM-21** | Persistencia de A-6: auditoría, **resolución de RC-5** y modelo definitivo |
| **COM-22** | Diseño del adapter de `ProposalRepository` |
| **COM-23** | Auditoría de integración de extremo a extremo |
| **COM-24** | Exposición de las dos lecturas en la Agent API |
| **COM-25 · COM-26 · COM-27** | Orquestación: diseño, decisiones y plan |
| **COM-28** | Integración del Orchestrator |
| **COM-29** | Frontera Agent API / Orchestrator |
| **COM-30 · COM-31** | **La infracción de R-07 y su corrección** |
| **COM-32** | Alineación documental |
