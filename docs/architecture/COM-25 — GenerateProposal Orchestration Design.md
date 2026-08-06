# COM-25 — Diseño de la Orquestación de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-25 |
| Clasificación | **Diseño técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Diseña la composición. No implementa el Orchestrator** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 19 |
| Relacionado | COM-07 §6 · COM-09 §4.2 · COM-14 · COM-16 · COM-23 · COM-24 |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§7, BLOCKED, fila 5.** Clasificaba *«exponer `GenerateProposal` en la Agent API»* como **decisión de Product Office**, por *«publicar una operación que con B-1 siempre falla»*.
>
> **No era de Product Office: era una obligación de R-07 · ADR-04 §7.7**, y no equivalía a publicar *(COM-30 §2.2)*. **COM-31 la ejecutó sin crear ninguna ruta.**
>
> **El resto del documento sigue vigente**, incluidos el hallazgo de §4.5 —la ausencia no cabe en el contrato— y las demás filas de §7.

> **Cero cambios de código.** `lint` limpio, `tsc --noEmit` limpio, **175 pruebas en verde**.

---

# 1. Alcance y ficheros revisados

**Auditado sobre el código**, no sobre la documentación.

| Fichero | Qué se comprobó |
| --- | --- |
| `orchestrators/*.ts` *(6)* | Dónde viven, qué importan, qué responsabilidad tiene cada uno |
| `presentation/pitchGeneratorAgent.ts` | Qué expone la fachada tras COM-24 |
| `application/generateProposal.ts` | La forma exacta de `GenerateProposalInput` y de su `Result` |
| `application/readReduced{Diagnosis,Sequence}.ts` | Qué devuelven, incluida la ausencia |
| `domain/commercial/factConsumption.ts` | La forma de `AffirmableEvidence` |
| `orchestrators/commercialFactsOrchestrator.ts` | Qué produce y con qué firma |
| `shared/persistence/{repositories,adapters}/` | Si A-11 y A-12 tienen lectura vigente |

---

# 2. Dónde vive el Orchestrator, y si existe candidato

## 2.1 Dónde debe vivir

> **`server/orchestrators/`, como una función construida desde el Composition Root.**

**R-11** — *«Todo workflow pasa por un Orchestrator. `routes/` **nunca** invoca un agente directamente, ni siquiera de un solo módulo»*. **ADR-04 §7.6** — **ningún agente conoce ni invoca a otro**: el Orchestrator es el único canal por el que se encuentran.

## 2.2 ¿Existe candidato? — **No. Ninguno sirve, y ninguno debe ampliarse**

| Orchestrator existente | Qué coordina | ¿Sirve? |
| --- | --- | :-: |
| `commercialDiagnosisOrchestrator` | E-7 · emitir diagnóstico | ⛔ Otro evento |
| `commercialSequenceOrchestrator` | E-8 · diseñar secuencia | ⛔ Otro evento |
| `commercialFactsOrchestrator` | Derivar hechos afirmables | ⚠️ **Es una fuente, no el compositor** — §4.4 |
| `pitchOutreachOrchestrator` | Flujo heredado de redacción | ⛔ Flujo anterior (F-1) |
| `leadAcquisition` · `leadLibrary` | Lead Hunter + Lead Analyzer | ⛔ Otro dominio |

**Cada Orchestrator existente coordina un workflow y solo uno.** Ampliar cualquiera para componer la propuesta rompería esa correspondencia y mezclaría dos eventos en un componente.

> **Conclusión: hará falta uno nuevo** —un `commercialProposalOrchestrator`— **y este documento no lo crea.**

---

# 3. La frontera del Orchestrator

## 3.1 Qué puede hacer

| Permitido | Regla que lo respalda |
| --- | --- |
| **Invocar Agent APIs** | Es su razón de ser: **ADR-04 §7.6** |
| **Invocar varias en paralelo y combinar lo devuelto** | Precedente: `commercialFactsOrchestrator` invoca dos agentes con `Promise.all` |
| **Copiar campos de un resultado a otro** | *«Traducción de campos, no interpretación»* — precedente literal |
| **Construir el DTO de entrada de un caso de uso** | Precedente: `commercialFactsOrchestrator` compone `ObservedInput` |

## 3.2 Qué no puede hacer

| Prohibido | Regla |
| --- | --- |
| **Decidir la estrategia** | **ADR-16 §7** la atribuye a `domain/`; hacerlo aquí es **la fuga que RA-R1 · RC-3 declaran la más probable** |
| **Interpretar el diagnóstico** | **R-10** — sin lógica de negocio. **El recorte ya lo decidió `domain/`** (COM-14 §2.2) |
| **Modificar los hechos** | **RA-4 · RE-1** — la lista es cerrada y **ninguna capa la amplía** |
| **Crear texto comercial** | **APS-18 §10.1** — redacta el modelo, y solo desde una estrategia decidida |
| **Validar reglas de negocio** | **R-10** — validar es decidir qué es admisible |
| **Conocer persistencia** | **R-24**, verificado: **ningún Orchestrator la importa** |
| **Conocer HTTP o DTO públicos** | **R-08 · R-09** |

> **La prueba de que no decide es que no puede:** todo lo que recibe llega **ya recortado**, y lo único que hace con ello es **ponerlo en un sobre**.

---

# 4. Ensamblaje de `GenerateProposalInput`

## 4.1 El contrato de destino

**Cuatro campos** — COM-07 §6, corregido por COM-14 §4.1, COM-15 §3 y COM-16 §5.

## 4.2 Campo a campo

| Campo | De dónde | Clase | Estado |
| --- | --- | :-: | :-: |
| **`lead`** | De la petición, tal cual | **Copia** | ✅ |
| **`diagnosis`** | `pitchGeneratorAgent.readReducedDiagnosis(lead)` | **Copia** | ⚠️ **§4.5** |
| **`sequence`** | `pitchGeneratorAgent.readReducedSequence(lead)` | **Copia** | ⚠️ **§4.5** |
| **`evidence`** | `{ lead, facts: runCommercialFacts(lead) }` | **Derivación** — compone el sobre con dos valores que ya tiene | ✅ *(§4.4)* |

**Ninguno es transformación ni interpretación.** Tres son copia literal y el cuarto es **la construcción de un sobre**, que es exactamente lo que §3.1 autoriza.

## 4.3 Sobre `moment`, que el enunciado lista como fuente

> **El momento no es una entrada separada, y no debe serlo.**

**Viaja dentro de `ReducedSequence.moment`**, y la lectura lo deriva de `currentMoment` *(COM-16 §4)*. Pasarlo además por fuera **permitiría pedir una propuesta para un momento distinto del que la secuencia dicta**, y **CS-I4 · RC-7** exigen que ningún momento se emita sin acción del usuario **para ese contacto concreto**.

## 4.4 ⚠️ La evidencia exige que un Orchestrator componga a otro

**`runCommercialFacts` ya existe, ya está construido en el Composition Root y ya no tiene consumidor**. Devuelve `ClosedFactList`; el sobre `AffirmableEvidence` añade el `lead`.

**El compositor de la propuesta necesita esos hechos, y hay dos vías:**

| Vía | Veredicto |
| --- | :-: |
| **Recibir `RunCommercialFactsFn` por inyección** | ✅ **Es una función, no un agente.** El Composition Root entrega un workflow a otro, igual que hoy entrega workflows a las rutas. **ADR-04 §7.6 prohíbe que un *agente* conozca a otro** — y aquí ninguno lo hace |
| **Reunir los tres agentes otra vez** | ⛔ **Duplicaría** la composición de `ObservedInput`, que ya existe una vez |

> **La primera es la lectura coherente, y ningún documento aprobado la enuncia.** Se recomienda **ratificarla antes de escribir el Orchestrator**, no darla por supuesta: es la primera vez que un workflow dependería de otro.

## 4.5 🔴 El bloqueo real: la ausencia no cabe en el contrato

**Las dos lecturas devuelven `ReducedDiagnosis | null` y `ReducedSequence | null`. Los dos campos de la entrada son obligatorios.**

| Situación | ¿Puede expresarse hoy? |
| --- | :-: |
| **Sin diagnóstico vigente** | ⚠️ **A medias.** COM-09 §7 define la rama `diagnosis_missing`, pero **el tipo de la entrada no admite la ausencia**: el Orchestrator no puede pasarla sin forzar el tipo. La rama solo se alcanza con una entrada mal formada |
| **Sin secuencia vigente, o sin contacto en curso** | ⛔ **No.** **COM-09 §4.2 no tiene ninguna rama para esto**, y el campo tampoco admite ausencia |

**Consecuencia:** con un Lead sin secuencia, **el Orchestrator no puede construir la entrada y el caso de uso no tiene desenlace que devolver**. La única salida sería que el Orchestrator decidiera qué hacer — **y eso sería una regla de negocio en el sitio prohibido** *(§3.2)*.

**Tres salidas posibles, y las tres son decisiones de arquitectura:**

1. **Hacer opcionales `diagnosis` y `sequence`** en la entrada, y que el caso de uso las declare ausentes → exige **una rama nueva en COM-09 §4.2**.
2. **Que el Orchestrator no invoque** cuando falte alguna → traslada la decisión a la capa que no debe decidir.
3. **Que las lecturas no admitan ausencia** → contradice COM-14 y COM-16, donde `null` es estado válido.

> **Ninguna se decide aquí.** Es el bloqueo que impide escribir el Orchestrator, y **es de arquitectura, no de Product Office**.

---

# 5. Dependencias faltantes

## 5.1 A-11 · `BuyerDiagnosis`

| Pieza | Estado |
| --- | :-: |
| Persistence Contract · Model · Mapper | ✅ Existen |
| Adapter *(`inMemoryBuyerDiagnosisAdapter`)* | ✅ Existe, con suite de contrato |
| Repository Interface con lectura vigente *(`findCurrentByLeadId`)* | ✅ Existe |
| Lectura recortada *(`readReducedDiagnosis`)* | ✅ Existe, probada y **expuesta** (COM-24) |
| Diseño | ✅ **Completo** — COM-14 |

## 5.2 A-12 · `CommercialSequence`

| Pieza | Estado |
| --- | :-: |
| Persistence Contract · Model · Mapper | ✅ Existen |
| Adapter *(`inMemoryCommercialSequenceAdapter`)* | ✅ Existe, con suite de contrato |
| Repository Interface | ⚠️ **No tiene «lectura vigente» propia**: expone `findByLeadId`, y **la vigente la deriva `application/`** —la de mayor número de secuencia, CS-I5— *(COM-16)*. **No es una carencia**: A-12 se actualiza, no se versiona |
| Lectura recortada *(`readReducedSequence`)* | ✅ Existe, probada y **expuesta** (COM-24) |
| Diseño | ✅ **Completo** — COM-16 |

> **No falta ninguna pieza de A-11 ni de A-12.** Lo que falta es el compositor, y lo que lo bloquea es §4.5.

---

# 6. Auditoría de límites

**Comprobado sobre los imports de los seis Orchestrators existentes.**

| Límite | Resultado |
| --- | :-: |
| **No importa `shared/persistence/`** | ✅ **Cero**, en los seis |
| **No conoce `ProposalModel`, `CommercialStrategyModel` ni `BuyerDiagnosisModel`** | ✅ **Cero** |
| **No conoce adapters ni repositorios** | ✅ **Cero** |
| **No importa `modules/*/domain/`** | ⚠️ **Uno lo hace** — §6.1 |

## 6.1 ⚠️ `commercialFactsOrchestrator` importa dos tipos de `domain/`

Importa `ObservedInput` y `ClosedFactList` de `modules/pitch-generator/domain/commercial/`.

**Son tipos, no decisiones**, y los necesita para declarar su firma y componer el DTO que entrega a la Agent API. **Ningún ADR lo prohíbe**: **R-02 · R-03** prohíben que **el dominio de un módulo** importe el de otro, no que un Orchestrator nombre un tipo del módulo que coordina. El precedente se repite en `leadLibraryOrchestrator`, que importa tipos de `application/`.

> **Pero el enunciado de este sprint pide confirmar que el Orchestrator «NO importa `modules/*/domain`», y el código ya lo hace.** Se registra la discrepancia **sin resolverla**: si esa regla debe ser vinculante, hay un Orchestrator que la incumple hoy; si no lo es, conviene que un documento lo diga, porque **el compositor de la propuesta necesitará nombrar `ReducedDiagnosis`, `ReducedSequence` y `AffirmableEvidence`**.

---

# 7. READY / BLOCKED

## ✅ READY — piezas existentes y verificadas

| Pieza | Dónde |
| --- | --- |
| **Lectura recortada del diagnóstico** | `application/readReducedDiagnosis.ts` · expuesta en la Agent API |
| **Lectura recortada de la secuencia** | `application/readReducedSequence.ts` · expuesta en la Agent API |
| **Proyecciones puras de ambos agregados** | `domain/commercial/reduce{Diagnosis,Sequence}.ts` |
| **Derivación de hechos afirmables** | `orchestrators/commercialFactsOrchestrator.ts` · construida y **sin consumidor** |
| **`GenerateProposal` resoluble por inyección** | Construido en el Composition Root |
| **Persistencia de A-6 completa** | Contrato · Model · Mapper · Adapter · suite |
| **Adapter de redacción** | `infrastructure/proposalDraftingAdapter.ts` |
| **Ambos repositorios con sus adapters y suites** | A-11 y A-12 |

## 🔴 BLOCKED — piezas pendientes

| # | Pieza | Naturaleza | Propietario |
| :-: | --- | --- | --- |
| **1** | **Cómo se expresa la ausencia de diagnóstico o de secuencia** *(§4.5)* | **Arquitectura** — exige rama nueva u opcionalidad | Arquitectura |
| **2** | **Si un Orchestrator puede recibir otro workflow** *(§4.4)* | Arquitectura — recomendación dada, sin ratificar | Arquitectura |
| **3** | **Si un Orchestrator puede nombrar tipos de `domain/`** *(§6.1)* | Arquitectura — el código ya lo hace | Arquitectura |
| **4** | **El Orchestrator mismo** | Ingeniería, **tras 1, 2 y 3** | Ingeniería |
| **5** | **Exponer `GenerateProposal` en la Agent API** | Decisión: publicar una operación que con **B-1** siempre falla | Product Office |
| **6** | **B-1 · B-2 · CH-01/02/03 · RC-4 · COM-16 §8** | Sin cambios | Product Office · Arquitectura |

---

# 8. El flujo

```text
   ┌──────────────────────┐   ┌──────────────────────┐
   │ BuyerDiagnosis (A-11)│   │CommercialSequence(A-12)│      Lead Hunter + Lead Analyzer
   └──────────┬───────────┘   └──────────┬───────────┘                  │
              │  Repository              │  Repository                  │  Agent APIs
              ▼                          ▼                              ▼
   ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────────┐
   │ application/         │   │ application/         │   │ commercialFactsOrchestrator│
   │ readReducedDiagnosis │   │ readReducedSequence  │   │  → ClosedFactList          │
   └──────────┬───────────┘   └──────────┬───────────┘   └────────────┬─────────────┘
              │  aplica                  │  aplica                    │
              ▼                          ▼                            │
   ┌──────────────────────┐   ┌──────────────────────┐                │
   │ domain/              │   │ domain/              │                │
   │ reduceDiagnosis      │   │ reduceSequence       │                │
   └──────────┬───────────┘   └──────────┬───────────┘                │
              │ ReducedDiagnosis         │ ReducedSequence            │
              ▼                          ▼                            │
   ┌──────────────────────────────────────────────────┐               │
   │            PitchGeneratorAgentApi                │               │
   │   readReducedDiagnosis · readReducedSequence     │               │
   └──────────────────────┬───────────────────────────┘               │
                          │                                           │
                          ▼                                           ▼
              ┌──────────────────────────────────────────────────────────┐
              │   ORCHESTRATOR DE LA PROPUESTA  ·  NO EXISTE  🔴          │
              │   copia · copia · copia · compone el sobre de evidencia   │
              │   no decide · no interpreta · no valida                   │
              └───────────────────────────┬──────────────────────────────┘
                                          │ GenerateProposalInput
                                          ▼
                            ┌──────────────────────────┐
                            │     GenerateProposal      │
                            │  bloqueado por B-1 al emitir│
                            └──────────────────────────┘
```

---

# 9. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **La rama `diagnosis_missing` es hoy inalcanzable por la vía normal** *(§4.5)*: el tipo no admite la ausencia que la rama describe | 🔴 |
| **2** | **No existe desenlace para «sin secuencia»**, y es un estado corriente: todo Lead con diagnóstico y sin secuencia diseñada | 🔴 |
| **3** | **Cuatro piezas construidas sin consumidor** — `runCommercialFacts`, `generateProposal` y las dos lecturas | 🟡 |
| **4** | **La dependencia workflow → workflow no tiene precedente** *(§4.4)* | 🟡 |
| **5** | **La regla sobre importar `domain/` desde un Orchestrator no está escrita**, y el código ya la interpreta *(§6.1)* | 🟡 |

---

# 10. Referencias

**ADR-04** §7.6 · **ADR-09** §5.1 · **ADR-15** §12, RA-4, RA-R1 · **ADR-16** §7, RC-3, RC-7, CS-I4, CS-I5 · **ADR-17** AL-08 · **APS-18** §10.1, RE-1, RE-5 · **DEV-00** R-02, R-03, R-08, R-09, R-10, R-11, R-24 · **COM-07** §6 · **COM-09** §4.2, §7 · **COM-14** · **COM-15** · **COM-16** · **COM-23** · **COM-24**.
