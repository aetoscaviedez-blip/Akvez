# COM-13 — `GenerateProposal` Integration Readiness

| Campo | Valor |
| --- | --- |
| Código | COM-13 |
| Clasificación | **Auditoría de integración** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Audita y prepara. No cablea, no decide y no aprueba nada** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 10 · Fase 4 |
| Relacionado | COM-07 · COM-09 · COM-10 · COM-11 · COM-12 · ADR-08 · ADR-09 · ADR-17 |

> **Ninguna línea de código se ha escrito ni modificado en esta fase.** Este documento es su único entregable.

---

# 1. Estado actual

## 1.1 Qué está terminado

| # | Pieza | Ubicación | Verificado por |
| :-: | --- | --- | --- |
| **1** | **Contrato de entrada** — cinco campos de COM-07 §6 | `application/generateProposal.ts` | Igualdad exacta de tipos + claves en ejecución |
| **2** | **Contrato de salida** — las cinco ramas de COM-09 §4.2 | Ídem | Igualdad exacta de la unión y de cada rama |
| **3** | **Flujo completo** — validar → estrategia → redacción → control → persistir → resultado | Ídem | Traza de orden exacto |
| **4** | **Errores tipados** — tres, sobre la taxonomía cerrada de APS-03 §12 | `domain/commercial/proposalErrors.ts` | Categoría e instancia por error |
| **5** | **Puntos de decisión aislados y declarados** | `domain/commercial/selectStrategy.ts` · `controlPoint.ts` | Lanzan; ninguno decide |
| **6** | **Puerto de redacción nuevo** | `domain/commercial/proposalDraftingPort.ts` | §3 de este documento |
| **7** | **Fuente única de evidencia** | `application/generateProposal.ts` | Revertirla rompe 4 pruebas |

**37 pruebas** cubren el caso de uso: estructura *(10)*, flujo *(19)* y errores *(8)*, sobre un total de 114 en verde.

## 1.2 Qué NO está hecho, por decisión

**`GenerateProposal` no está construido en el Composition Root, no se expone en la Agent API, no tiene Orchestrator y no tiene ruta.** No es un olvido: **con B-1 abierto el caso de uso no puede emitir**, y cablear una operación que siempre lanza expondría un fallo interno como si fuera una capacidad.

---

# 2. Auditoría 1 — `ProposalRepository`

## 2.1 Qué existe

| Artefacto | Estado | Ubicación |
| --- | :-: | --- |
| **Repository Interface** | ✅ | `shared/persistence/repositories/ProposalRepository.ts` |
| **Persistence Contract** de `Proposal` | ✅ | `shared/persistence/contracts/Proposal.ts` |
| **Persistence Contract** de `CommercialStrategy` | ✅ | `shared/persistence/contracts/CommercialStrategy.ts` |

**Los tres cumplen ADR-08 §5 y §10:** replican la forma del dominio **sin importarlo**, y la interfaz se expresa en términos del Persistence Contract, que es lo que `application/` consume.

**Cumple también ADR-15 §12 y ADR-13 §10.3:** `save` es *append-only* **(V-1 · P-I2)**, `findCurrentByMoment` devuelve la vigente **(V-2)**, `findVersionsByMoment` hace **comprobable P-I2**, y **no existe operación de estadio** — la corrección que ADR-13 v1.2 aplicó a E-5 retirándole A-3 se sostiene **por construcción** (P-I3 · LS-3).

## 2.2 Qué falta

| Artefacto | Estado | Precedente que lo define |
| --- | :-: | --- |
| **Persistence Model** | ⛔ **No existe** | `models/CommercialSequenceModel.ts` |
| **Mapper** Contract ↔ Model | ⛔ **No existe** | `adapters/commercialSequenceMapper.ts` |
| **Database Adapter** | ⛔ **No existe** | `adapters/inMemoryCommercialSequenceAdapter.ts` |
| **Suite de contrato de comportamiento** | ⛔ **No existe** | `adapters/commercialSequenceRepository.contract.ts` |

> **A-6 es el único activo comercial con Repository Interface y sin adapter.** A-11 y A-12 tienen los cuatro artefactos; A-6 tiene cero.

## 2.3 Por qué NO debe crearse todavía

**Falta una decisión arquitectónica, y afecta precisamente a la forma de lo almacenado.**

**`COM-12 RC-5`** pregunta si A-6 debe conservar `kind` y `source` de cada hecho o basta el enunciado. El Persistence Contract declara hoy `affirmableFacts: string[]` y `evidenceBase: string[]`.

**Escribir el Model ahora congelaría esa forma**, y el riesgo no es reversible del todo: **si RC-5 se decide en sentido contrario, las emisiones ya escritas no podrán completarse retroactivamente** — el origen perdido no se reconstruye, y hacerlo sería rellenar un dato inexistente **(R-38)**.

**Es exactamente el supuesto que esta fase manda respetar:** *«no crear implementación si falta una decisión arquitectónica»*.

## 2.4 Responsables

| Qué | Propietario |
| --- | --- |
| **`COM-12 RC-5`** — qué conserva A-6 por hecho | **Arquitectura**, vía ADR-08 y ADS-02 |
| **Model · Mapper · Adapter · suite de contrato** | **Ingeniería**, **una vez resuelto RC-5** |
| **F-2** — unicidad `(lead, momento, nº de emisión)` en el motor real | **Ingeniería**, con ADS-02 |
| **F-3** — `userId` placeholder de un solo inquilino | **Ingeniería** |

## 2.5 Hallazgo — dos repositorios sobre el mismo activo

**`OutreachPitchRepository` y `ProposalRepository` declaran ambos A-6.** El primero responde al modelo anterior —asunto, mensaje, tono— y **hoy no lo usa nadie**; el segundo es el canónico de ADR-16 §4.4.

**Ninguna capa debe usar los dos**, y **el motor real no puede implementar ambos sobre el mismo activo sin decidir cuál prevalece**. La retirada del anterior es una migración pendiente, no una tarea de este sprint.

---

# 3. Auditoría 2 — `ProposalDraftingPort`

## 3.1 Verificación punto por punto

| Exigencia | Veredicto | Evidencia |
| --- | :-: | --- |
| **Recibe únicamente `strategy` y `facts`** | ✅ | `ProposalDraftingInput` declara dos campos; prueba de igualdad exacta de claves |
| **No recibe narrativa libre** | ✅ | **No hay campo de texto suelto.** `Contexto` y `Prompt context` son sinónimos **prohibidos** de la lista cerrada (DDD-01 §8) por sugerir algo ampliable |
| **No recibe `BuyerDiagnosis` completo** | ✅ | El diagnóstico **no entra**, ni completo ni recortado: se agotó en la decisión de estrategia |
| **No recibe datos externos** | ✅ | Sin credenciales (P-4), sin configuración, sin nombre de proveedor (P-2), sin parámetro operativo (P-3) |
| **Devuelve solo texto** | ✅ | `Promise<string>`. APS-18 §10.2: *«Devuelve: el texto. Nada más»* |

## 3.2 Cumplimiento de COM-09 §6

> ✅ **Confirmado.** *«El nuevo debe recibir la estrategia y la lista cerrada y devolver solo texto»*.

**Los siete elementos que APS-18 §10.2 enumera —objetivo, barrera, emoción, hilo que retoma, hilo que deja planteado, canal— son campos de `CommercialStrategy`**, de modo que el puerto no los declara sueltos: declararlos otra vez permitiría entregar un objetivo distinto del que la estrategia decidió.

**Y desde el ajuste de la Fase 3+, `facts` es `strategy.evidenceBase`:** ya no hay dos listas que puedan divergir.

## 3.3 Qué falta para integrarlo

**No tiene adapter.** `infrastructure/pitchGenerationAdapter.ts` implementa `PitchDraftingPort` —el puerto heredado—, no éste.

**Los dos puertos coexisten deliberadamente** (COM-09 §6 · deuda **F-1** del Sprint 01) hasta retirar el flujo anterior. **Ninguna capa debe usar los dos.**

**Este adapter no está bloqueado por gobernanza:** todo lo que necesita —los diez contenidos de APS-18 §8.1 y la lista cerrada— está publicado. **Solo está bloqueado por utilidad**: sin estrategia que materializar (B-1), no hay nada que redactar.

---

# 4. Auditoría 3 — Composition Root readiness

## 4.1 Dónde se construiría

**`server/bootstrap/compositionRoot.ts`, en `buildApplicationDependencies()`**, junto a `generateDiagnosis` y `createSequence`. **Es el único lugar del sistema autorizado** a construir adapters de persistencia (ADR-09 §5.1) y de proveedor (ADR-17 §9.1 · AL-20).

## 4.2 Qué recibiría

```text
createGenerateProposal({
  proposalDraftingPort,   ← adapter de proveedor, por construir
  proposalRepository      ← adapter de persistencia, por construir (§2.3)
})
```

**Dos dependencias. Ninguna más** (COM-09 §6 · AL-08). Ambas **no existen todavía**, y ese es hoy el impedimento técnico del cableado.

## 4.3 Qué módulos quedarían involucrados

| Capa | Componente | Estado |
| --- | --- | :-: |
| `infrastructure/` | Adapter del puerto de redacción | ⛔ por crear |
| `shared/persistence/adapters/` | Adapter de `ProposalRepository` | ⛔ por crear · **bloqueado por RC-5** |
| `application/` | `createGenerateProposal` | ✅ existe |
| `presentation/` | `PitchGeneratorAgentApi.generateProposal` | ⛔ por añadir |
| `orchestrators/` | Orchestrator de la propuesta | ⛔ por crear |
| `routes/` + `shared/contracts/` + `shared/mappers/` | Ruta, DTO público y mapper | ⛔ por crear |

## 4.4 Ya montado y esperando

**`runCommercialFacts` existe, está construido en el Composition Root y no tiene consumidor** — con un `void` explícito que lo declara. Fue deliberado: *«su consumidor es `GenerateProposal`, que no existe. Se construye aquí para que la frontera quede montada y verificada antes de escribirlo»*.

**Es la única de las cuatro fuentes de COM-07 §1 que ya está resuelta de extremo a extremo.**

---

# 5. Auditoría 4 — Frontera del Orchestrator

## 5.1 Lo que `GenerateProposal` no puede hacer — verificado

| Prohibición | Veredicto | Cómo está garantizado |
| --- | :-: | --- |
| **Buscar Leads** | ✅ | No importa `lead-hunter`; **D-5** prohíbe a toda entidad comercial registrar, ordenar o puntuar Leads |
| **Consultar repositorios ajenos** | ✅ | `Deps` tiene dos claves; un `Proxy` que lanza ante cualquier otra prueba que **ninguna se toca** |
| **Llamar a agentes** | ✅ | Sin imports de `presentation/` ajena (R-02 · R-03 · R-11 · ADR-04 §7.6) |
| **Obtener la estrategia** | ✅ | **No se recibe: la produce `domain/`** (COM-07 §4.2). El tipo de entrada no la declara |
| **Consultar A-11 o A-12** | ✅ | Entran como dato; una prueba comprueba que **ningún repositorio se toca** aunque la ejecución muera en la decisión |

**El único repositorio que conoce es el de su propio activo, y solo usa dos de sus cuatro operaciones** —`findVersionsByMoment` y `save`—, ambas después del punto de control.

## 5.2 ⚠️ Hallazgo principal — quién prepara la entrada, y con qué

**COM-07 §1 atribuye al Orchestrator reunir las cuatro fuentes. Hoy no puede reunir dos de ellas.**

| Fuente | ¿Alcanzable desde un Orchestrator? | Por qué |
| --- | :-: | --- |
| **Hechos afirmables** | ✅ | `runCommercialFacts`, ya construido |
| **`criteriaVersion`** | ✅ | Constante de `domain/` que **declara ausencia**; se transcribe, no se genera |
| **Diagnóstico vigente, recortado** | ⛔ **No** | **La Agent API no expone ninguna lectura de A-11** |
| **Secuencia, recortada** | ⛔ **No** | **Tampoco de A-12** |

**Y no basta con exponerlas:** un Orchestrator **no conoce persistencia (R-24)** y **no contiene lógica de negocio (R-10)**. El recorte que COM-07 §2 exige —**quitar los indicios**, excluir el valor de las `Desconocida`— y la derivación de `previousThread` y `previousContribution` **no son copias de campos: son decisiones sobre qué puede alcanzar al mensaje**. Hacerlas en el Orchestrator sería la fuga que **RA-R1 y RC-3** declaran la más probable de la arquitectura comercial.

> **Consecuencia:** el recorte pertenece a `pitch-generator`, y la Agent API debería exponer **la lectura ya recortada**, no el agregado. **Qué forma toma esa lectura —una operación de consulta por agregado, o una que devuelva la entrada de COM-07 ya compuesta— no está decidido en ningún documento aprobado.**

**No se decide aquí.** Es la decisión que debe tomarse **antes** de escribir el Orchestrator, y su propietario es **Arquitectura**.

---

# 6. Dependencias necesarias — lista exacta

## 6.1 Del caso de uso

| # | Dependencia | Forma | Regla | Estado |
| :-: | --- | --- | --- | :-: |
| **1** | `proposalDraftingPort` | Puerto declarado en `domain/` | ADR-16 §2 · ADR-17 §6.3 | ✅ declarado · ⛔ sin adapter |
| **2** | `proposalRepository` | **Repository Interface, nunca el adapter** | AL-06 · R-22 | ✅ declarada · ⛔ sin adapter |

**Nada más entra en `Deps`** (COM-09 §6). Las funciones de `domain/` se importan directamente (D-A1); el número de reintentos **no es puerto ni caso de uso** y no puede vivir ahí (AL-08 · COM-11 §4.2).

## 6.2 De la integración

| # | Artefacto | Capa | Bloqueado por |
| :-: | --- | --- | --- |
| **1** | Persistence Model de `Proposal` | `shared/persistence/models/` | **`COM-12 RC-5`** |
| **2** | Mapper Contract ↔ Model | `shared/persistence/adapters/` | Ídem |
| **3** | Database Adapter | `shared/persistence/adapters/` | Ídem |
| **4** | Suite de contrato de comportamiento | `shared/persistence/adapters/` | Ídem |
| **5** | Adapter del puerto de redacción | `modules/pitch-generator/infrastructure/` | **B-1** *(utilidad, no gobernanza)* |
| **6** | Lectura recortada de A-11 y A-12 | `pitch-generator` | **§5.2 — decisión pendiente** |
| **7** | `generateProposal` en la Agent API | `presentation/` | 5 y 6 |
| **8** | Orchestrator de la propuesta | `orchestrators/` | 6 y 7 |
| **9** | DTO público, mapper y ruta | `shared/contracts/` · `shared/mappers/` · `routes/` | 8 · **F-5** |

---

# 7. Bloqueos externos

**Ninguno es de ingeniería y ninguno se resuelve escribiendo código** (COM-11 §6).

## B-1 — Perfil de Estrategia

🔴 **Abierto.** `SP-01` sin publicar. Propietario: **Product Office**.

**Se conserva como ausencia gobernada, y así permanece:**

- `selectStrategy` **lanza** `StrategyProfileUnavailableError` — no devuelve una estrategia mínima, ni parcial, ni marcada como provisional.
- **No existe estrategia por defecto** (RC-10 · BD-R2 · R-38), y una prueba comprueba que **nada se redacta y nada se persiste** cuando falta.
- `criteriaVersion` entra como `SIN-PERFIL-DE-ESTRATEGIA`: **declara la ausencia** en lugar de fabricar una versión.

## B-2 — Reintentos del punto de control

🔴 **Abierto.** Propietario: **Product Office**, con el documento de autoridad por decidir *(COM-11 §4.3 recomienda APS-18)*.

**El dominio conserva la ausencia de decisión:**

- **No existe ninguna constante**, ni valor por defecto, ni bucle.
- Una prueba comprueba que **el módulo no publica ningún valor** salvo la fábrica.
- El `TODO(B-2)` está en los dos puntos que COM-11 §4 señala, con la ubicación futura del valor: **transcrito en `domain/`**, nunca en `Deps` ni en configuración.

---

# 8. Riesgos

| # | Riesgo | Severidad | Evaluación |
| :-: | --- | :-: | --- |
| **1** | **Componer la entrada en el Orchestrator** *(§5.2)* | 🔴 **Alta** | Es el camino natural cuando falte la lectura recortada, y **es la fuga de RA-R1 · RC-3**: recortar el diagnóstico es decidir qué puede alcanzar al mensaje |
| **2** | **Congelar el Model antes de `COM-12 RC-5`** *(§2.3)* | 🔴 **Alta** | Las emisiones escritas **no podrán completarse retroactivamente** |
| **3** | **Dos repositorios sobre A-6** *(§2.5)* | 🟡 Media | El motor real no puede implementar ambos sin decidir cuál prevalece |
| **4** | **Dos puertos de redacción** *(§3.3 · F-1)* | 🟡 Media | Coexistencia aprobada, pero **ninguna capa debe usar los dos** |
| **5** | **Cablear con B-1 abierto** | 🔴 **Crítica** | Toda emisión llevaría `SIN-PERFIL-DE-ESTRATEGIA` y ADR-18 §10.4 propone no reetiquetarlas: **el defecto sería permanente** (COM-10 §5) |
| **6** | **`COM-12 RC-4`** — origen de `issuedAt` | 🟡 Media | Dos casos de uso hermanos fechan de forma distinta |
| **7** | **F-2** — unicidad `(lead, momento, emisión)` | 🟡 Media | No la garantiza ningún motor todavía |
| **8** | **F-3** — `userId` placeholder | 🟡 Media | Heredado; no satisface ADR-05 §14 |
| **9** | **F-5** — vocabulario con tildes en el contrato público | 🟡 Media | Alcanza a la propuesta: `Demostración` y `Reactivación` viajarían en su DTO |
| **10** | **El `catch` de la redacción traduce cualquier error** a `drafting_unavailable` | 🟢 Baja | COM-09 §7 lo asume así; estrecharlo sería decisión nueva |

---

# 9. Plan de integración futura

**Sin código. Cada paso declara su precondición, y ninguno puede adelantarse a ella.**

| # | Paso | Precondición | Propietario |
| :-: | --- | --- | --- |
| **0** | **Resolver B-1 y B-2** | Las cuatro condiciones de COM-11 §6 | **Product Office** |
| **1** | **Decidir `COM-12 RC-5`** — qué conserva A-6 por hecho | — *(independiente de B-1)* | **Arquitectura** |
| **2** | **Decidir la forma de la lectura recortada** de A-11 y A-12 *(§5.2)* | — *(independiente de B-1)* | **Arquitectura** |
| **3** | **Transcribir `SP-01`** en `selectStrategy` y el número de reintentos en `domain/` | Paso 0 | Ingeniería |
| **4** | **Implementar el punto de control** — las cinco comprobaciones de APS-18 §10.3 | Paso 3 | Ingeniería |
| **5** | **Cerrar el bucle rehacer→verificar** en `application/` | Pasos 3 y 4 | Ingeniería |
| **6** | **Model, Mapper, Adapter y suite de contrato** de `Proposal` | Paso 1 | Ingeniería |
| **7** | **Adapter del puerto de redacción** | Paso 3 | Ingeniería |
| **8** | **Lectura recortada** de A-11 y A-12 en `pitch-generator` | Paso 2 | Ingeniería |
| **9** | **Exponer `generateProposal`** en la Agent API | Pasos 5 a 8 | Ingeniería |
| **10** | **Orchestrator de la propuesta** — reúne las cuatro fuentes de COM-07 §1 | Paso 9 | Ingeniería |
| **11** | **Construir en el Composition Root** | Pasos 6, 7 y 10 | Ingeniería |
| **12** | **DTO público, mapper y ruta** | Paso 11 · F-5 | Ingeniería |

> **Los pasos 1 y 2 no dependen de B-1 y pueden decidirse ya.** Son el trabajo de arquitectura que hoy está disponible; todo lo demás espera al Product Office.

---

# 10. Referencias

**ADR-04** §7.6, §10, §11 · **ADR-05** §14 · **ADR-08** §5, §6, §7, §10 · **ADR-09** §5.1, §5.3, §6 · **ADR-13** §10.1, §10.3, §13.1 · **ADR-15** §7.2, §10, §12 · **ADR-16** §2, §4.4, §7, RC-3, P-I2, P-I3 · **ADR-17** §6.3, §9.1, §13, AL-06, AL-08, AL-20 · **ADR-18** *(Draft)* §10.4 · **APS-03** §7.1, §7.3, §12 · **APS-18** §8.1, §10.2, §10.3 · **DDD-01** §4.2, §8 · **DEV-00** R-02, R-03, R-10, R-11, R-22, R-24, R-38, R-42, R-44, R-52, D-5, D-A1 · **COM-07** · **COM-09** · **COM-10** · **COM-11** · **COM-12**.
