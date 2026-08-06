# COM-23 — Auditoría Final de Integración de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-23 |
| Clasificación | **Auditoría de cierre** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Audita. No decide, no cierra riesgos y no modifica nada** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 18 — Auditoría Final de Integración |
| Relacionado | COM-07 · COM-09 · COM-12 a COM-16 · COM-18 a COM-22 |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§7.2, último párrafo.** Presentaba como decisión pendiente *«si debe publicarse una operación que, con B-1 abierto, falla siempre»*. **COM-30 §2.2 estableció que exponer en la Agent API no es publicar** —la Agent API expone **hacia el Orchestrator**, y la superficie de producto es la ruta *(ADR-04, glosario · §7.8)*—, y **COM-31 lo ejecutó**.
>
> **El resto del documento sigue vigente**, incluidas sus dos respuestas de §7.1 y §7.2 y los hallazgos de §4.

> **Cero cambios de código.** Todas las comprobaciones se han ejecutado sobre el código, no sobre la documentación.

---

# 1. Alcance

**Auditar de extremo a extremo lo construido entre los Sprints 10 y 20**, contra ADR-08, ADR-12, ADR-13, ADR-14, ADR-15, ADR-16, ADR-17 y ADR-18 *(Draft)*, y contra la serie COM-07…COM-22.

**Qué NO cubre:** la Agent API, los Orchestrators y las rutas de la propuesta — **no existen todavía**, deliberadamente.

**Estado del árbol en el momento de auditar:** `lint` limpio, `tsc --noEmit` limpio, **167 pruebas en verde**.

---

# 2. Componentes auditados

| # | Componente | Capa |
| :-: | --- | --- |
| **1** | `GenerateProposal` | `application/` |
| **2** | `ReadReducedDiagnosis` · `reduceDiagnosis` | `application/` · `domain/` |
| **3** | `ReadReducedSequence` · `reduceSequence` | `application/` · `domain/` |
| **4** | `selectStrategy` · `passesControlPoint` · `proposalErrors` | `domain/` |
| **5** | `ProposalDraftingPort` · `ProposalDraftingAdapter` | `domain/` · `infrastructure/` |
| **6** | `ProposalRepository` · `Proposal` · `CommercialStrategy` · `AffirmableFactRecord` | `shared/persistence/` |
| **7** | `ProposalModel` · `AffirmableFactModel` · `proposalMapper` · `inMemoryProposalAdapter` | `shared/persistence/` |
| **8** | Composition Root | `bootstrap/` |

---

# 3. Verificaciones realizadas

## 3.1 Dependencias — **sin violaciones**

**Comprobado por búsqueda exhaustiva sobre el árbol, en las cinco direcciones que las reglas prohíben:**

| Dirección prohibida | Regla | Resultado |
| --- | --- | :-: |
| `domain/` → persistencia · `infrastructure/` · `shared/ai` · otro módulo · `application/` | R-04 · D-A1 · ADR-04 §11 | ✅ **Cero** |
| `application/` → `persistence/{contracts,models,adapters}` · `shared/ai` · `infrastructure/` · HTTP | **ADR-17 §13**, prohibiciones 2 a 7 · R-22 | ✅ **Cero** |
| `shared/persistence/` → `modules/*/domain/` | **ADR-08 §10 · R-27** | ✅ **Cero** — las once menciones son **comentarios** que declaran la verificación por lectura directa |
| `presentation/` → `shared/persistence/` | **R-23**, «sin excepción» | ✅ **Cero** en código de producción *(§4.3)* |
| `orchestrators/` → persistencia | **R-24** | ✅ **Cero** |

**Los tres imports que podrían parecer excepciones no lo son:**

- **`domain/commercial/proposalErrors.ts` → `shared/errors`**: ADR-04 §11 lo declara *«accesible desde cualquier capa»* y el módulo **no tiene dependencias**.
- **`infrastructure/proposalDraftingAdapter.ts` → `shared/ai`**: accesible **únicamente desde `infrastructure/`**, que es donde está.
- **`bootstrap/compositionRoot.ts` → `modules/*/infrastructure/`**: **ADR-17 §9.1 (AL-20)** lo autoriza **solo aquí**, y solo para construir y pasar como valor de `Deps` — que es exactamente su uso.

## 3.2 Flujo — **sin flujo inverso**

```text
Lead Analyzer ─┐
Lead Hunter  ──┴─► Orchestrator ─► hechos afirmables ──┐
                                                        │
ReadReducedDiagnosis (A-11) ───────────────────────────┤
ReadReducedSequence  (A-12) ───────────────────────────┤
                                                        ▼
                                            GenerateProposal
                                                        │
                          domain/ decide  ──────────────┤
                          ProposalDraftingAdapter ──────┤
                          domain/ verifica ─────────────┤
                                                        ▼
                                            ProposalRepository
```

**Verificado que nadie remonta el flujo:**

- **`GenerateProposal` no busca nada**: `Deps` tiene **dos** claves y una prueba con `Proxy` comprueba que **ninguna otra se toca**.
- **No conoce Lead Hunter ni Lead Analyzer**: sin imports, comprobado.
- **El adapter de redacción no vuelve hacia atrás**: sus imports son el cliente de IA, la observabilidad, la taxonomía de errores y su propio puerto — **y hay una prueba que lo verifica sobre el fichero**.
- **La persistencia no conoce el dominio**: replica sus formas sin importarlas.
- **Las dos lecturas no escriben**: sendas pruebas comprueban que **solo se invoca la operación de lectura** y ninguna de escritura.

## 3.3 Responsabilidades — **cada una, exactamente una vez**

| Responsabilidad | Dónde vive | ¿Duplicada? |
| --- | --- | :-: |
| **Reducción del diagnóstico** | `domain/commercial/reduceDiagnosis.ts` | ✅ Una |
| **Reducción de la secuencia** | `domain/commercial/reduceSequence.ts` | ✅ Una |
| **Lectura del agregado vigente** | `application/readReduced{Diagnosis,Sequence}.ts` | ✅ Una por agregado |
| **Selección de estrategia** | `domain/commercial/selectStrategy.ts` | ✅ Una |
| **Punto de control** | `domain/commercial/controlPoint.ts` | ✅ Una |
| **Generación del texto** | `infrastructure/proposalDraftingAdapter.ts` | ⚠️ **§4.2** |
| **Persistencia de A-6** | `adapters/inMemoryProposalAdapter.ts` | ⚠️ **§4.2** |
| **Composition Root** | `bootstrap/compositionRoot.ts` | ✅ Uno |

> **Ninguna decisión comercial aparece dos veces.** Lo que sí se repite es **traducción**, y es el hallazgo §4.1.

## 3.4 Contratos — **coherentes**

| Concepto | Dominio | Persistence Contract | Persistence Model |
| --- | --- | --- | --- |
| **Estrategia** | 10 contenidos *(APS-18 §8.1)* | Los mismos 10 | Los mismos 10, conjuntos cerrados como `string` |
| **Hecho afirmable** | `lead` · `kind` · `statement` · `source` | `kind` · `statement` · `source` | Ídem, con `string` |
| **Origen** | `observation` · `source` | Ídem | Ídem, con `string` |
| **Propuesta** | `id` · `strategy` · `affirmableFacts` · `text` · `channel` · `criteriaVersion` | Los mismos, con la identidad desplegada, **más `issuedAt`** | Ídem, **más `id` · `userId` · `createdAt`** |

**Las dos asimetrías son deliberadas y están justificadas:**

- **`lead` no viaja por hecho** — **COM-20 §3.1**: es derivable de `Proposal.leadId` con demostración, y **derivar no es rellenar**.
- **`issuedAt` está en la frontera y no en la entidad** — **V-3** lo exige al persistir; la entidad no lo declara. **Es `COM-12 RC-4`, abierto.**

**`ProposalModel` no lleva `updatedAt`**, y es correcto: **ADR-13 §10.3** clasifica A-6 como **versionado, no actualizable**, y el repositorio **no expone `update`**.

## 3.5 Persistencia — **reversibilidad completa**

**La suite de contrato afirma el viaje entero con una comparación profunda**: Contract → Model → Contract devuelve **exactamente lo escrito**, salvo el `id` que añade la persistencia.

**Y la comprobación discrimina**, verificado empíricamente en el Sprint 15: sustituir el mapper por uno que pierda `kind` y `source` **la hace fallar**.

**Cubre además** la conservación de la ausencia —un hilo inexistente no reaparece—, la inmutabilidad de lo conservado y el caso que hace discriminante todo el diseño: un hecho `atributo_de_empresa`, **la observación que admite dos `kind`**.

## 3.6 Composition Root

| Comprobación | Resultado |
| --- | :-: |
| **Dependencias registradas** | 5 repositorios · 4 adapters de proveedor · casos de uso · 3 agentes · 6 workflows · 5 rutas |
| **Instancia única por Repository Interface** *(ADR-09 §6)* | ✅ `buyerDiagnosisRepository` se comparte entre `GenerateDiagnosis` y `CreateSequence` — **la misma instancia**, que es lo que hace que lo leído sea lo escrito |
| **Duplicadas** | ✅ **Ninguna** |
| **Ciclos** | ✅ **Ninguno** — un ciclo dejaría una factoría en `undefined`; el grafo se construye y hay prueba |
| **Sin registrar** | ⚠️ **§4.4** |
| **Filtración de persistencia a `routes/`** | ✅ Ninguna: `RouteDependencies` son cinco funciones, con prueba |
| **Singleton de módulo** *(R-57)* | ✅ Dos arranques producen grafos independientes, con prueba |

---

# 4. Hallazgos

## 4.1 🟡 Traducción duplicada entre dos mappers

**`proposalMapper.ts` y `commercialSequenceMapper.ts` contienen la misma traducción**, sobre los mismos tipos: los diez contenidos de la estrategia y los tres campos del hecho afirmable, en ambos sentidos.

**Causa:** el Persistence Contract de la estrategia **es compartido** por A-6 y A-12 *(COM-21 §5)*, pero **cada mapper es autocontenido** —es el patrón de los tres mappers preexistentes— y no hay ninguno común.

| | |
| --- | --- |
| **Qué NO es** | **No es lógica de negocio duplicada.** Ninguna decisión comercial se toma dos veces: es copia de campos |
| **Riesgo real** | **Que diverjan.** Si un contenido de la estrategia cambia, hay que tocar dos ficheros, y **nada obliga a tocar el segundo** |
| **Por qué no se unificó** | **COM-22 §8.1 no lista ningún mapper compartido**, y crearlo habría sido una decisión no documentada |

**Un tercer punto enumera los mismos campos**: `toPersistedStrategy` en `generateProposal.ts`. **No es duplicación de la misma traducción** —es otra frontera, dominio → contrato— pero eleva a **tres** los sitios donde los diez contenidos se escriben a mano.

## 4.2 🟡 Dos implementaciones vivas por responsabilidad, sobre el mismo activo

**Ninguna es un error: son las dos caras de la deuda F-1 y de la retirada pendiente del legado.**

| Responsabilidad | Canónica | Heredada | Estado |
| --- | --- | --- | :-: |
| **Redacción** | `proposalDraftingAdapter` *(`ProposalDraftingPort`)* | `pitchGenerationAdapter` *(`PitchDraftingPort`)* | **Ambos construidos** en cada arranque |
| **Persistencia de A-6** | `ProposalRepository` **con adapter** | `OutreachPitchRepository` **sin adapter** | El heredado **no lo usa nadie** |

**Los tipos impiden confundirlos** —son puertos distintos y no intercambiables—, pero **el motor real no podrá implementar dos repositorios sobre A-6** sin decidir cuál prevalece.

## 4.3 🟢 Un test de `presentation/` importa un adapter

`presentation/generateDiagnosis.integration.test.ts` importa `inMemoryBuyerDiagnosisAdapter`. **R-23 gobierna el código de producción de la capa**, y una prueba de integración que construye la cadena real es su propósito. **Es preexistente y no se ha ampliado.** Se registra por completitud.

## 4.4 🟡 Las dos lecturas recortadas no están registradas

**`createReducedDiagnosisReader` y `createReducedSequenceReader` existen, están probados y no se construyen en ningún sitio.**

**No es un olvido**: exponerlos exige añadir parámetros a `createPitchGeneratorAgent` y, con ello, tocar el Composition Root — que los sprints que los crearon prohibían expresamente.

**Consecuencia operativa:** **ningún Orchestrator puede componer todavía la entrada de COM-07**, aunque las cuatro fuentes existan ya por separado.

## 4.5 🟡 COM-07 §6 sigue sin anotar

**Es la única discrepancia entre un documento y el código.**

`GenerateProposalInput` tiene **cuatro** campos; el dibujo de COM-07 §6 muestra cinco, más `commercialState` y `sequenceNumber`. **Las tres diferencias se decidieron después y con justificación** —COM-15 §3, COM-14 §4.1 y COM-16 §5.1—, y **COM-18 §1.2 recomendó anotar COM-07 como *superseded* en esos tres puntos. No se ha hecho.**

**No es una desviación de la implementación:** COM-07 declara en su cabecera *«no decide»*, y las tres correcciones se apoyan en documentos `Approved`. **Es deuda documental.**

---

# 5. Riesgos abiertos

**Ninguno se cierra en este documento.**

| # | Riesgo | Severidad | Propietario |
| :-: | --- | :-: | --- |
| **1** | **B-1 — `SP-01` sin publicar.** `selectStrategy` lanza; **no se puede emitir** | 🔴 | Product Office |
| **2** | **B-2 — reintentos del punto de control sin valor aprobado** | 🔴 | Product Office |
| **3** | **CH-01/02/03 — longitud de canal**, propuesta en APS-17 y **no publicada** | 🔴 | Product Office |
| **4** | **`COM-12 RC-4` — origen de `issuedAt`** | 🟡 | Arquitectura |
| **5** | **COM-16 §8.1 — de qué secuencia nació una propuesta.** A-6 no lo conserva | 🔴 | Arquitectura |
| **6** | **COM-16 §8.2 — alcance de la memoria.** La implementación **transporta la memoria completa y deja ambas lecturas vivas** | 🔴 | Product Office |
| **7** | **COM-19 §7.3 — qué emisión del diagnóstico se leyó.** No se referencia | 🟡 | Arquitectura |
| **8** | **COM-18 §3.3 — canal, momento y lista escritos dos veces** en la fila | 🔴 | Arquitectura |
| **9** | **F-1 — dos puertos de redacción**, ambos con adapter | 🟡 | Arquitectura |
| **10** | **Retirada del par heredado sobre A-6** | 🟡 | Arquitectura |
| **11** | **F-2 — unicidad de `(leadId, moment, issue)`** en el motor real | 🟡 | Ingeniería, con ADS-02 |
| **12** | **F-3 — `userId` de un solo inquilino** · **F-9 — `createdAt` no observable** | 🟡 | Ingeniería |
| **13** | **§4.1 — traducción duplicada entre mappers** | 🟡 | Ingeniería |
| **14** | **§4.5 — COM-07 §6 sin anotar** | 🟢 | Arquitectura |

---

# 6. Riesgos potencialmente cerrables

> **Se indican; NO se cierran.**

| Riesgo | Por qué podría cerrarse | Qué falta para cerrarlo |
| --- | --- | --- |
| **`COM-12 RC-5`** — trazabilidad del hecho al persistir | **Decidido en COM-20, formalizado en COM-21 e implementado y verificado en el Sprint 15.** `statement`, `kind` y `source` sobreviven al viaje completo, y la prueba **discrimina**: un mapper que los pierda la hace fallar | **Un pronunciamiento**. Técnicamente no queda nada pendiente |
| **COM-19 §9** — «vigente» por `issue` o por `issuedAt` | **Resuelto por derivación** en COM-22 §4.2 e implementado: la vigente es **la de mayor `issue`**, con prueba que falla si un adapter devuelve «la última insertada» | Ídem |
| **COM-13 §2.3** — el adapter de A-6 no podía escribirse sin decidir RC-5 | **Ya está escrito**, con Model, Mapper, adapter y suite de contrato | Ídem |
| **COM-19 §7.2** — F-2 no mencionaba la terna de A-6 | Es una **actualización de redacción** de una deuda existente | Actualizar el registro de deuda |

**Ninguno de los cuatro requiere código.** Los tres primeros son **actos de registro** sobre trabajo ya verificado.

---

# 7. Conclusión

## 7.1 ¿La implementación coincide exactamente con el Blueprint?

> # **Sí.**

**Justificación, en cuatro comprobaciones ejecutadas sobre el código:**

1. **Cero imports prohibidos**, en las cinco direcciones que las reglas cierran *(§3.1)*. Las únicas travesías de frontera son las tres que un ADR autoriza nominalmente.
2. **Cada responsabilidad existe una vez** *(§3.3)*, y **ninguna decisión comercial se toma fuera del dominio**: la estrategia se produce en `domain/`, el recorte de ambos agregados también, y `application/` encadena sin decidir.
3. **No hay ningún valor inventado.** No existe estrategia por defecto, ni constante de reintentos, ni versión de criterio fabricada, ni límite de canal. **Donde el Blueprint no publica un valor, el código declara la ausencia** — `SIN-PERFIL-DE-ESTRATEGIA`— o **lanza**.
4. **Donde un documento preliminar contradecía a uno `Approved`, prevaleció el `Approved`**: `commercialState` salió por BD-I4, `criteriaVersion` por RC-13 y ADR-15 §7.2, y `sequenceNumber` por F-8.

**Con una precisión necesaria: coincidir no es estar completo.** La implementación **no contradice nada** y está **deliberadamente incompleta** — `selectStrategy` y el punto de control no tienen cuerpo porque B-1 lo impide, y esa incompletitud **es la conducta que el Blueprint exige**, no una desviación de él.

**La única discrepancia documento ↔ código es COM-07 §6 sin anotar** *(§4.5)*, y es deuda documental sobre un documento que declara no decidir.

## 7.2 ¿Existe deuda técnica que impida comenzar la integración con la Agent API?

> # **No.**

**Justificación:**

- **Las cuatro fuentes de COM-07 existen y funcionan**: los hechos afirmables *(`runCommercialFacts`, ya construido)*, el diagnóstico reducido, la secuencia reducida y la versión del criterio *(sellada desde `domain/`)*.
- **`GenerateProposal` es completamente resoluble por inyección**: sus dos dependencias aprobadas se satisfacen con adapters reales, y el Composition Root ya lo construye.
- **La persistencia está cerrada**: contrato, modelo, mapper, adapter y suite de comportamiento, con reversibilidad demostrada.
- **Lo que falta es trabajo, no deuda**: tres parámetros nuevos en `createPitchGeneratorAgent` y su paso en el arranque *(§4.4)*.

**Los riesgos abiertos de §5 no impiden integrar:**

- **B-1 y B-2 impiden *emitir*, no *integrar*.** Un Orchestrator puede componer la entrada y las dos lecturas funcionan hoy.
- **§4.1 y §4.2 son deuda de calidad y de migración**, sin efecto sobre la integración.

> ⚠️ **Lo que sí exige una decisión antes de exponer `GenerateProposal` —no una corrección técnica— es si debe publicarse una operación que, con B-1 abierto, falla siempre.** Las dos lecturas recortadas **no tienen ese problema y pueden exponerse hoy**.

---

# 8. Referencias

**ADR-04** §10, §11 · **ADR-05** §7, §14 · **ADR-08** §5, §6, §7, §8, §10 · **ADR-09** §5.1, §6 · **ADR-12** §7.1, §7.4 · **ADR-13** §10.1, §10.2, §10.3, §13.1, V-1, V-2, V-3 · **ADR-14** §9.1, §9.2 · **ADR-15** §7.2, §7.4, §10, §12, RA-4, RA-R1 · **ADR-16** §4.2, §4.3, §4.4, §7, RC-2, RC-3, RC-13, BD-I2, BD-I4, P-I1…P-I5, AG-1, AG-3 · **ADR-17** §6.3, §9.1, §13, AL-06, AL-08, AL-12, AL-13, AL-14, AL-16, AL-20 · **ADR-18** *(Draft)* · **ADS-02** · **APS-03** §12 · **APS-18** §8.1, §9.1, §10.1, §10.2, §10.3, §11.1, RE-1, RE-5, SC-R1, SC-R3, SC-R4, CA-08, CA-18 · **APS-20** §3.2, §6 · **DDD-01** §4.2, §5.4, §8 · **DEV-00** R-04, R-22, R-23, R-24, R-26, R-27, R-38, R-42, R-44, R-52, R-57, R-61, R-62, R-63, D-A1, F-1, F-2, F-3, F-8, F-9 · **COM-07** a **COM-22**.
