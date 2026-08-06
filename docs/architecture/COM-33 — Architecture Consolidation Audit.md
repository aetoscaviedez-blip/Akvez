# COM-33 — Auditoría de Consolidación Arquitectónica

| Campo | Valor |
| --- | --- |
| Código | COM-33 |
| Clasificación | **Auditoría técnica** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Deuda interna reducida sin cambio de comportamiento.** Dos retiradas rechazadas y elevadas |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-33 — Architecture Consolidation |
| Relacionado | **COM-23 §4.1** *(duplicación entre mappers)* · **COM-19 §7.2** *(F-2)* · **COM-21 §5** · **ADR-08 §13** · **ADR-17 §8.2** |

> **`GenerateProposal` no se ha tocado.** `selectStrategy` sigue lanzando, el punto de control sigue sin cuerpo y **no se ha creado ninguna ruta HTTP**. **B-1 y B-2 siguen abiertos** y nada de este sprint los aproxima ni los rodea.
>
> **Ningún contrato público cambió. Ningún fichero de `domain/` cambió.**

---

# 1. Verificación

| Comprobación | Antes | Después |
| --- | :-: | :-: |
| `npm run lint` | ✅ limpio | ✅ limpio |
| `npx tsc --noEmit` | ✅ limpio | ✅ limpio |
| `npm test` | ✅ **191** · 25 ficheros | ✅ **197** · 26 ficheros |

**Las 191 pruebas anteriores siguen pasando sin modificar ninguna aserción.** Las seis nuevas son cobertura añadida, no sustitución.

> ⚠️ **`npm run lint` y `npx tsc --noEmit` son el mismo comando.** `package.json` define `"lint": "tsc --noEmit"`: **el proyecto no tiene linter**. Se informa porque el handoff los listaba como dos verificaciones independientes, y no lo son. *(§6, riesgo 4)*

---

# 2. Tarea 1 — Duplicación entre mappers · ✅ **Ejecutada**

## 2.1 Qué se encontró

**Cuatro traducciones duplicadas**, no una:

| Función | `proposalMapper` | `commercialSequenceMapper` |
| --- | --- | --- |
| `toFactRecord` | Declarada | **Idéntica**, carácter a carácter |
| `toFactModel` | Declarada | **Inline**, como literal dentro de `.map()` |
| `toStrategyModel` | Declarada | **Idéntica** |
| `toStrategy` | Declarada | **Idéntica** |

**La duplicación era mecánica, y esto es lo que lo demuestra:** los cuatro tipos que se traducen —`AffirmableFactRecord`, `AffirmableFactModel`, `CommercialStrategy`, `CommercialStrategyModel`— tienen **declaración canónica única y compartida**. No había una versión de la estrategia por agregado que justificase dos traducciones: **COM-21 §5 ya había decidido lo contrario**, y `CommercialStrategyModel` lo dice en su propio comentario —*«la estrategia que un contacto conserva es la misma que conserva una `Proposal`»*.

> **El riesgo no era la repetición: era la divergencia silenciosa.** Cambiar una copia y no la otra hacía que A-6 y A-12 almacenasen la misma estrategia de dos formas distintas, y **ninguna prueba existente lo habría detectado** — cada suite de contrato comparaba cada agregado **consigo mismo**.

## 2.2 Qué se hizo

**Helper puro extraído** — `shared/persistence/adapters/commercialStrategyMapper.ts`:

`toAffirmableFactModel` · `toAffirmableFactRecord` · `toCommercialStrategyModel` · `toCommercialStrategy`

**No es un mapper universal, y no puede llegar a serlo:**

- **No conoce ningún agregado.** No traduce `Proposal`, no traduce `CommercialSequence`, no declara `meta` de persistencia y no nombra ninguna fila.
- **La responsabilidad por agregado queda íntegra.** `toProposalModel` / `toProposal` siguen siendo los únicos que conocen la identidad y los metadatos de A-6; `toPlannedMomentModel`, `toPlannedMoment` y el resultado declarado siguen siendo exclusivos de A-12.
- **Vive en `shared/persistence/adapters/`**, de modo que **R-26** se mantiene: la conversión Contract ↔ Model no sale del Database Adapter.

## 2.3 Pruebas añadidas — 4

`commercialStrategyMapper.test.ts`. **Ambas propiedades se verificaron rompiendo el código a propósito:**

| Prueba | Discrimina contra | Verificado |
| --- | --- | :-: |
| A-6 y A-12 almacenan la misma estrategia de forma idéntica | **Reintroducir una copia por agregado** | ✅ falla |
| La estrategia sobrevive al viaje completo | Un helper que pierda un campo | ✅ falla |
| La ausencia de los hilos se conserva igual en ambos | Un hilo ausente que pase a existir vacío (R-38) | — |
| Traducir copia, no aliasa | Un mapper que devuelva la misma referencia | — |

> **La primera prueba compara CLAVES en el caso de los hilos, no valores.** `{ resumedThread: undefined }` es igual a `{}` bajo `toEqual`, y comparar valores habría dejado pasar exactamente el defecto que R-38 protege. *(Lección de handoff §4.2, aplicada.)*

## 2.4 Lo que NO se hizo, y por qué

> **`CommercialStrategyModel` sigue declarado dentro de `models/CommercialSequenceModel.ts`**, de modo que `proposalMapper` importa el modelo de la estrategia **desde el fichero de modelo de otro agregado**.
>
> **Es un acoplamiento real y queda registrado.** No se movió porque **no es necesidad mecánica**: nada del sprint lo exige, mover una declaración entre ficheros de modelo toca la frontera de persistencia de dos agregados, y `AffirmableFactModel` ya sentó el precedente de cuándo un tipo compartido merece fichero propio. **Propuesto, no implementado** *(§7, punto 1)*.

---

# 3. Tarea 2 — `createPitchGeneratorAgent` a objeto de opciones · ✅ **Ejecutada**

## 3.1 Por qué era deuda, en concreto

**Seis parámetros posicionales, y cuatro de ellos con la misma forma** — `(input) => Promise<Result>`. Consecuencia exacta:

> **Intercambiar dos dependencias compilaba sin error.** El defecto solo se manifestaba al ejecutar la operación equivocada. Y en las pruebas era peor: los dobles se escriben como `as any` o `as never`, de modo que **el compilador no distinguía ninguno de los seis**. `commercialFactsOrchestrator.test.ts` pasaba literalmente `fail as any` seis veces.

Coste ya pagado: **las mismas cinco llamadas hubo que tocarlas en los Sprints 19 y 31** *(handoff §4.7)*.

## 3.2 Qué se hizo

Nueva interfaz `PitchGeneratorAgentDeps` con los seis campos nombrados. **Ninguno opcional, ninguno con valor por defecto** — un valor por defecto sería construir dentro de la fachada, competencia exclusiva del Composition Root *(ADR-09 §5.3 · R-55)*.

**Siete puntos de llamada actualizados**, comportamiento idéntico:

| Fichero | Llamadas |
| --- | :-: |
| `bootstrap/compositionRoot.ts` | 1 |
| `routes/diagnosisRoute.test.ts` | 2 |
| `routes/sequenceRoute.test.ts` | 1 |
| `orchestrators/commercialFactsOrchestrator.test.ts` | 1 |
| `modules/pitch-generator/presentation/pitchGeneratorAgent.test.ts` | 1 |
| `modules/pitch-generator/presentation/generateDiagnosis.integration.test.ts` | 1 |

## 3.3 ⚠️ Hallazgo de gobernanza — la regla citada no alcanza a esta capa

**`ADR-17 §8.2 F-1`** impone la forma que se ha adoptado: *«la factory recibe **un único parámetro**: un objeto `<CasoDeUso>Deps` con nombres»*.

> ### **Pero ADR-17 gobierna `application/`, no `presentation/`.**
>
> Su título es *Application Layer Architecture* y F-1 habla de **factorías de caso de uso**. **La Agent API es `presentation/`**, y **ningún documento aprobado publica la forma de su factoría**. DEV-00 §5.1 solo fija el **nombre** (`create` + agente + `Agent`), no la firma.

**Dos consecuencias, y conviene que consten:**

1. **El cambio se ha hecho por analogía y por coste medido**, no porque una norma vinculante lo exigiera. El Sprint lo autorizó explícitamente; **la autoridad es el documento de sprint, no ADR-17**.
2. **`createLeadHunterAgent` y `createLeadAnalyzerAgent` siguen siendo posicionales — y NO están en infracción.** Con dos parámetros cada uno, el coste que motivó este cambio no existe allí. **No se han tocado**: uniformar las tres Agent API es una decisión de arquitectura, y este sprint no la tiene. *(§7, punto 2)*

> **La asimetría es deliberada y queda declarada.** Se prefiere una inconsistencia registrada a una refactorización de tres módulos sin documento que la respalde.

## 3.4 Pruebas añadidas — 2

`pitchGeneratorAgent.test.ts`, bloque *«cableado de dependencias»*. **Seis dobles distinguibles**: cada operación debe devolver la marca de **su** dependencia.

| Prueba | Discrimina contra | Verificado |
| --- | --- | :-: |
| Cada dependencia alcanza su propia operación, y ninguna otra | **Dos dependencias cruzadas** | ✅ falla |
| El orden de declaración no significa nada | Una factoría que aún leyera por posición | ✅ falla |

Se comprobó cruzando `readReducedDiagnosis` con `readReducedSequence` en la fachada: **ambas pruebas caen**, además de cuatro de las anteriores.

---

# 4. Tarea 3 — Auditoría de `OutreachPitchRepository` · 🔴 **Retirada RECHAZADA**

## 4.1 Resultado de la auditoría: cero uso en código

| Dimensión | Resultado |
| --- | --- |
| **Consumidores** | **Ninguno.** Ningún fichero lo importa |
| **Imports** | **Ninguno.** La única mención en código es **un comentario** en `ProposalRepository.ts:9` |
| **Rutas** | **Ninguna** |
| **Pruebas** | **Ninguna.** No tiene suite de contrato — a diferencia de `LeadRepository`, `BuyerDiagnosisRepository`, `CommercialSequenceRepository` y `ProposalRepository`, que sí la tienen |
| **Adapters** | **Ninguno lo implementa** |

**La auditoría se extendió a su par completo**, y el resultado es el mismo:

| Fichero | Estado |
| --- | --- |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | Huérfano. Solo lo alcanza su propio contrato |
| `shared/persistence/contracts/OutreachPitch.ts` | Huérfano. **Su único importador es el repositorio anterior** |
| `modules/pitch-generator/domain/OutreachPitch.ts` | **También huérfano.** Ningún fichero lo importa |

> **Son tres ficheros, no dos**, y forman un ciclo cerrado sobre sí mismos: retirar uno deja a los otros sin razón de ser.

## 4.2 Por qué NO se retira

**La condición del Sprint —«solo retirar si está confirmado sin uso»— se cumple en el código y NO se cumple en el Blueprint.**

> ### **ADR-08 §13 sigue nombrándolo como trabajo pendiente.**
>
> Bajo **«Impacta / habilita»**:
>
> *«La conexión real de `LeadRepository`, `LeadAnalysisRepository` y **`OutreachPitchRepository`** a `application/` de cada módulo.»*
>
> **ADR-08 no ha sido enmendado en ese punto.** Un ADR vigente declara que ese repositorio **debe conectarse**, no retirarse.

**`ProposalRepository` lo sustituye *conceptualmente*, y eso no es lo mismo que retirarlo.** ADR-16 §4.4 fijó `Proposal` como la forma canónica de A-6, pero **ningún documento aprobado deroga el par anterior**. Los cuatro documentos que lo tocaron dicen exactamente lo mismo:

| Documento | Qué dice |
| --- | --- |
| **COM-13 §2.5** | *«hoy no lo usa nadie»* |
| **COM-19 §10**, hallazgo 6 | *«El motor no puede implementar ambos»* |
| **COM-21** · **COM-22 §11** | *«Su retirada es **otra decisión**»* |
| **COM-23 §7**, punto 10 | *«Retirada del par heredado sobre A-6»* — 🟡 · propietario: **Arquitectura** |

**Se aplica la restricción absoluta de CLAUDE.md:** *«Si existe un conflicto entre el Blueprint y el código, detener la implementación y reportarlo antes de continuar.»*

> **La retirada está técnicamente desbloqueada y documentalmente bloqueada.** No falta análisis: falta **una enmienda a ADR-08 §13** que retire el repositorio de su lista de trabajo pendiente. Es un acto de Arquitectura, y **COM-23 §7 ya se lo había asignado**.

## 4.3 Qué queda listo para el momento en que se autorice

**Tres ficheros, borrado limpio, sin ningún otro cambio:**

```
server/shared/persistence/repositories/OutreachPitchRepository.ts
server/shared/persistence/contracts/OutreachPitch.ts
server/modules/pitch-generator/domain/OutreachPitch.ts
```

Y **un comentario que actualizar**: `ProposalRepository.ts:9`, que hoy remite al par retirado.

> **`generateOutreachPitch` NO forma parte de esto.** El caso de uso heredado y su puerto `pitchDraftingPort` **están vivos y en producción** —los usa `/api/prospect/outreach`—. **F-1** *(dos puertos de redacción)* es una deuda **distinta** de la retirada del par de persistencia, y este sprint no la toca.

---

# 5. Tarea 4 — Auditoría de F-2 · 📋 **Documentada, no resuelta**

## 5.1 Qué garantiza F-2 hoy: **nada, en el motor**

**F-2 alcanza a tres agregados**, y en los tres el número que discrimina la identidad **llega ya decidido por el caso de uso**, derivado del historial existente. El adapter lo conserva tal cual.

| Activo | Tupla | Adapter | Quién decide el número |
| --- | --- | --- | --- |
| **A-11** Diagnóstico | `(leadId, issue)` | `inMemoryBuyerDiagnosisAdapter` | El caso de uso |
| **A-12** Secuencia | `(leadId, sequence)` | `inMemoryCommercialSequenceAdapter` | El caso de uso |
| **A-6** Propuesta | `(leadId, moment, issue)` | `inMemoryProposalAdapter` | El caso de uso |

> **En memoria y con un solo proceso no hay concurrencia que lo ponga a prueba.** Dos escrituras concurrentes producirían **dos filas con la misma tupla**, en silencio. La garantía la debe dar el motor real con una **restricción compuesta** *(ADS-02)*.

**Contraste que conviene no confundir:** `inMemoryLeadAdapter` **sí resuelve en código** la unicidad de `(userId, identityKey)`. Eso **no es F-2**: es **A-03**, con su propio riesgo **RC-10** en AR-05 §5.1. F-2 no tiene ni siquiera esa resolución parcial.

## 5.2 Propietario

**«Ingeniería, con ADS-02»** — constante en COM-10 §7, COM-13 §2.4, COM-21 §9 y COM-23 §7 punto 11.

> ⚠️ **«Ingeniería» aquí no significa que Ingeniería pueda cerrarla.** Significa que quien la ejecutará es Ingeniería **cuando exista el motor de ADS-02**. Hoy **no hay motor**: los cuatro adapters son en memoria y explícitamente *«de validación, no la persistencia definitiva»*. **F-2 no es ejecutable en este sprint ni en ninguno anterior al motor real.**

## 5.3 Pruebas existentes: tres suites la declaran fuera de alcance, y explican por qué

| Suite de contrato | Qué declara |
| --- | --- |
| `buyerDiagnosisRepository.contract.ts:14` | *«QUÉ NO VERIFICA: la unicidad de `(leadId, issue)` bajo concurrencia (deuda F-2). No es comprobable sin un motor real»* |
| `commercialSequenceRepository.contract.ts:21` | *«La unicidad de `(leadId, sequence)` bajo concurrencia — deuda F-2»* |
| `proposalRepository.contract.ts:18` | *«la unicidad de `(leadId, moment, issue)` bajo concurrencia (deuda F-2)»* |

**No es un hueco tapado: es un hueco declarado en el sitio correcto**, con la razón por la que no puede cerrarse allí. Se añade `inMemoryProposalAdapter.ts:54-57`, que registra la consecuencia para el motor.

## 5.4 🔴 Por qué «actualizar F-2» NO se ejecutó

El encargo venía de **COM-19 §7.2**: *«**Alcanza también a `(leadId, moment, issue)` de A-6**, y conviene que F-2 lo diga»*. Al ir a ejecutarlo aparece el obstáculo:

> ### **Ningún documento *es* el registro de F-2.**
>
> F-2 aparece **restatado, nunca declarado**, en al menos seis documentos —**COM-06 §11, COM-10 §7, COM-13 §2.4 y §10, COM-19 §10, COM-21 §9, COM-23 §7**— y **con redacciones distintas entre sí**:
>
> | Documento | Redacción |
> | --- | --- |
> | COM-06 · COM-10 | *«`(leadId, issue)` y `(leadId, sequence)`»* |
> | COM-13 §2.4 | *«`(lead, momento, nº de emisión)`»* |
> | COM-23 §7 | *«unicidad de `(leadId, moment, issue)`»* |
>
> **COM-13 y COM-23 ya dicen la terna de A-6.** El registro **más antiguo** es el que no la dice — y **actualizarlo exige antes decidir cuál de los seis es el registro**.

**Esto no es trabajo de Ingeniería y no se ha inventado una solución.** Se necesita que Arquitectura **designe el documento registro de la serie F-**, igual que **AR-05 §5.1** lo es de la serie A-/T-. *(§7, punto 3.)*

## 5.5 ⚠️ Hallazgo adicional — **`F-2` es un identificador colisionado**

**Dos deudas distintas se llaman F-2, y ambas se citan en el código:**

| Registro | Qué es | Dónde se cita |
| --- | --- | --- |
| **Serie F- de la auditoría comercial** | *Unicidad en el motor real* — **una deuda** | COM-06 · COM-10 · COM-13 · COM-19 · COM-21 · COM-23 |
| **`ADR-17 §8.2 F-2`** | *«Cada campo de `Deps` es un puerto o una función de caso de uso del propio módulo»* — **una regla** | `generateDiagnosis.ts:61` · `createSequence.ts:80` · `generateOutreachPitch.ts:43` |

> **Tres comentarios de `application/` dicen «F-2» refiriéndose a la regla de ADR-17**, no a la deuda de unicidad. Hoy no engaña a nadie porque el contexto lo aclara; **con el registro F- consolidado, engañará.**
>
> **No se ha renombrado nada.** Renombrar un identificador de una tabla de deuda es una decisión de gobernanza. *(§7, punto 4.)*

---

# 6. Riesgos

| # | Riesgo | Severidad | Origen |
| :-: | --- | :-: | --- |
| **1** | **La forma de la factoría de Agent API sigue sin documento que la fije.** `pitchGeneratorAgent` es nominal por decisión de sprint; los otros dos son posicionales. **El próximo agente que se escriba no tendrá regla que consultar** | 🟡 Media | §3.3 |
| **2** | **`OutreachPitchRepository` sigue vivo y ADR-08 §13 sigue pidiendo conectarlo.** Un sprint futuro podría **conectarlo** en lugar de retirarlo, creyendo que cumple el ADR — y habría **dos repositorios sobre A-6 en uso** | 🔴 **Alta** | §4.2 |
| **3** | **F-2 no tiene documento registro.** Cada auditoría lo restata con su propia redacción; **la divergencia crece con cada sprint** | 🟡 Media | §5.4 |
| **4** | **El proyecto no tiene linter.** `npm run lint` es `tsc --noEmit`. Toda verificación de estilo, imports no usados o complejidad **es hoy inexistente**, y los informes que citan «lint limpio» miden el compilador | 🟡 Media | §1 |
| **5** | **`CommercialStrategyModel` vive en el fichero de modelo de otro agregado**, y `proposalMapper` lo importa desde allí | 🟢 Baja | §2.4 |

---

# 7. Cambios rechazados — propuestos, **no implementados**

| # | Propuesta | Por qué no se hizo | Quién decide |
| :-: | --- | --- | --- |
| **1** | **Mover `CommercialStrategyModel`** a `models/CommercialStrategyModel.ts`, con el precedente de `AffirmableFactModel` | **No es necesidad mecánica.** Toca la frontera de persistencia de dos agregados | Arquitectura |
| **2** | **Migrar `createLeadHunterAgent` y `createLeadAnalyzerAgent`** a objeto de opciones | **Fuera del alcance del Sprint**, que nombra una sola factoría. Con dos parámetros, el coste que motivó el cambio no existe | Arquitectura |
| **3** | **Retirar el par heredado sobre A-6** *(tres ficheros)* | **ADR-08 §13 lo declara trabajo pendiente.** Requiere enmienda al ADR | **Arquitectura** — ya asignado en COM-23 §7 punto 10 |
| **4** | **Actualizar la redacción de F-2** con la terna de A-6 | **Ningún documento es el registro de F-2.** Hay que designarlo antes | **Arquitectura** |
| **5** | **Renombrar la colisión `F-2`** entre la serie comercial y ADR-17 §8.2 | Renombrar un identificador de deuda es gobernanza | **Arquitectura** |
| **6** | **Declarar en un ADR la forma de la factoría de Agent API** | Ningún documento la publica hoy | Arquitectura |

---

# 8. Bloqueos restantes

**Ninguno de los cuatro bloqueos anteriores se ha movido, y este sprint no los toca:**

| ID | Estado | Nota |
| --- | :-: | --- |
| **B-1** — `SP-01` sin publicar | 🔴 **Abierto** | `selectStrategy` sigue lanzando. **Sin cambios** |
| **B-2** — Reintentos del punto de control | 🔴 **Abierto** | El punto de control sigue sin cuerpo |
| **B-3** — Enriquecer la lista de hechos observados | 🟡 Abierto | Sin cambios |
| **F-1** — Dos puertos de redacción | 🟡 Abierto | **Distinto de §4.** El puerto heredado está **en uso** |

**Deuda cerrada por este sprint:** **COM-23 §7 punto 13** — *«traducción duplicada entre mappers»* → ✅ **resuelta** *(§2)*. Y **handoff §5.3 punto 11** — *«migrar a objeto de opciones»* → ✅ **resuelta** *(§3)*.

**Deuda que este sprint deja lista pero no cierra:** **COM-23 §7 punto 10** *(retirada del par heredado)* — auditada, con lista de ficheros exacta, **a la espera de enmienda a ADR-08 §13**.

---

# 9. Inventario de cambios

## 9.1 Creados — 3

| Fichero | Qué es |
| --- | --- |
| `shared/persistence/adapters/commercialStrategyMapper.ts` | El helper puro compartido |
| `shared/persistence/adapters/commercialStrategyMapper.test.ts` | 4 pruebas |
| `docs/architecture/COM-33 — Architecture Consolidation Audit.md` | Este documento |

## 9.2 Modificados — 7

| Fichero | Qué cambió |
| --- | --- |
| `shared/persistence/adapters/proposalMapper.ts` | Cuatro funciones locales retiradas; usa el helper |
| `shared/persistence/adapters/commercialSequenceMapper.ts` | Cuatro traducciones locales retiradas; usa el helper |
| `modules/pitch-generator/presentation/pitchGeneratorAgent.ts` | `PitchGeneratorAgentDeps`; factoría nominal |
| `bootstrap/compositionRoot.ts` | La llamada, con nombres |
| `modules/pitch-generator/presentation/pitchGeneratorAgent.test.ts` | Llamada actualizada · **+2 pruebas** |
| `routes/diagnosisRoute.test.ts` · `routes/sequenceRoute.test.ts` · `orchestrators/commercialFactsOrchestrator.test.ts` · `modules/.../generateDiagnosis.integration.test.ts` | Llamadas actualizadas |

## 9.3 Eliminados — **ninguno**

## 9.4 No tocado

`src/` *(frontend)* · `lead-hunter` · `lead-analyzer` · **todo `domain/`** · `routes/` *(código)* · `orchestrators/` *(código)* · los contratos y modelos de persistencia · **ningún ADR ni documento del Blueprint** · **ningún documento COM anterior**.

---

# 10. Referencias

**ADR-08** §10, §13 · **ADR-09** §5.2, §5.3 · **ADR-13** §10.3 · **ADR-16** §4.4 · **ADR-17** §8.2 *(F-1, F-2)*, §14 AL-08 · **APS-18** §8.1, §11.1 · **DEV-00** §5.1, §5.2, R-16, R-26, R-27, R-38, R-55 · **AR-05** §5.1 · **COM-06** · **COM-10** §7 · **COM-13** §2.4, §2.5 · **COM-19** §7.2, §10 · **COM-20** · **COM-21** §5 · **COM-22** §11 · **COM-23** §4.1, §7.
