# COM-22 — Diseño del `ProposalRepositoryAdapter`

| Campo | Valor |
| --- | --- |
| Código | COM-22 |
| Clasificación | **Diseño técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Define el adapter. No lo implementa y no enmienda ningún ADR** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 14 |
| Relacionado | **COM-21** *(la forma que traduce)* · COM-19 · COM-20 · ADR-08 · ADR-13 §10.3 |

> **Cero código.** El adapter que aquí se diseña **no existe todavía**.

---

# 1. Qué es, y qué precedente sigue

**Un Database Adapter de `shared/persistence/adapters/`** *(ADR-08 §8)*: la única capa autorizada a traducir entre el Persistence Contract y el Persistence Model *(ADR-08 §7 · R-26)*.

**Tiene tres hermanos, y uno es el precedente exacto:**

| Adapter | Semántica | ¿Sirve de modelo? |
| --- | --- | :-: |
| `inMemoryBuyerDiagnosisAdapter` | **Versionado · append-only** | ✅ **Sí** — A-6 se versiona igual que A-11 |
| `inMemoryCommercialSequenceAdapter` | Actualizable | ⛔ No — expone `update`; A-6 no puede |
| `inMemoryLeadAdapter` | Registro | ⛔ No |

> **A-6 y A-11 comparten ciclo:** *«cada emisión añade una versión sin retirar la anterior»*, y **ADR-13 §10.2 prohíbe implementar el versionado como sobrescritura**.

**El primero será un adapter en memoria**, como sus tres hermanos: *«valida la frontera Contract → Mapper → Model de punta a punta antes del motor real de ADS-02»*. **No es la persistencia definitiva y debe decirlo.**

---

# 2. Responsabilidad exacta

## 2.1 Qué hace

| # | Responsabilidad | Regla |
| :-: | --- | --- |
| **1** | **Implementa `ProposalRepository`** — las cuatro operaciones, sin añadir ninguna | AL-06 · ADR-08 §6 |
| **2** | **Traduce Contract ↔ Model**, delegando en un mapper de funciones puras | **ADR-08 §7 · R-26** |
| **3** | **Genera identidad de persistencia y metadatos**: `id`, `userId`, `createdAt` | ADR-08 §6 |
| **4** | **Conserva el almacén append-only**: solo crece | **V-1 · ADR-13 §10.2** |
| **5** | **Ordena y selecciona** por número de emisión al leer | **V-2** *(§5.2)* |
| **6** | **Devuelve `Identified<Proposal>`** — el contrato más el identificador | ADR-05 §7, Decisión 3 |

## 2.2 Qué nunca debe hacer

| # | Prohibido | Regla |
| :-: | --- | --- |
| **1** | **Exponer `update` o borrado** — A-6 se versiona; no hay cuarta operación | ADR-13 §10.1, §10.3 |
| **2** | **Exponer nada de estadio** — emitir no cambia el estadio del Lead | **P-I3 · LS-3** |
| **3** | **Marcar una propuesta como enviada** — AKVEZ **no envía y no observa** | **P-I5 · PO-02 §6.2** |
| **4** | **Reescribir la identidad** `(leadId, moment, issue)` | §7.5 |
| **5** | **Añadir, quitar o reordenar hechos afirmables** | **RA-4 · RE-1** |
| **6** | **Devolver una entidad de dominio** — su salida es el contrato | §4.3 |
| **7** | **Importar `modules/*/domain/`** | **ADR-08 §10 · R-27** |
| **8** | **Filtrar, recortar o limitar un conjunto devuelto** | **R-42 · R-44** |
| **9** | **Interpretar el vocabulario** — el modelo almacena `string`; **validarlo es del dominio** | Precedente de los tres modelos |

## 2.3 Dependencias

**Cinco, y ninguna más:**

```text
ProposalRepository        (repositories/)  ← la interfaz que implementa
Proposal                  (contracts/)     ← lo que recibe y devuelve
ProposalModel             (models/)        ← lo que almacena
proposalMapper            (adapters/)      ← la traducción
randomUUID                (crypto)         ← identidad de persistencia
```

**No puede depender de nada más.** En particular **no conoce `modules/pitch-generator/`** —ni su dominio, ni su `application/`— y **no conoce HTTP, ni configuración, ni ningún otro repositorio**.

---

# 3. El flujo completo

```text
┌─ ESCRITURA ─────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [1] Entidad `Proposal`            application/ · dominio del módulo         │
│       │                            La construye el caso de uso; nunca sale   │
│       │                            de él tal cual                            │
│       ▼  traducción explícita  (ADR-08 §5 — no son el mismo tipo)            │
│  [2] Persistence Contract          la frontera. `application/` no lo importa: │
│       │                            la forma la impone la firma del repositorio│
│       ▼  save(...)                                                           │
│  [3] ══ ADAPTER ══  genera id · userId · createdAt                           │
│       │             y delega en el mapper                                    │
│       ▼                                                                      │
│  [4] `ProposalModel`               forma almacenada                          │
│       │                                                                      │
│       ▼  append                                                              │
│  [5] Almacén                       **solo crece** (V-1 · §10.2)              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ LECTURA ───────────────────────────────────────────────────────────────────┐
│  [5] Almacén                                                                │
│       ▼  filtra por identidad · ordena por `issue`                          │
│  [4] `ProposalModel`                                                        │
│       ▼  ══ ADAPTER ══  mapper inverso + adjunta `id`                       │
│  [3] `Identified<Proposal>`        **aquí termina el adapter**              │
│       ▼                                                                     │
│  [2] Persistence Contract          lo consume `application/`                │
│       ▼  reconstrucción + derivación de `lead`   ⟵ NO es del adapter        │
│  [1] Entidad `Proposal`            se rearma en `application/`              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.1 Dónde empieza y dónde termina el adapter

> ### **El adapter cubre los tramos [2]↔[5]. Nunca toca [1].**

**No construye la entidad de dominio al leer, y no puede:** **ADR-08 §10 · R-27** le prohíben importar `modules/*/domain/`, de modo que **no puede nombrar el tipo `Proposal` del dominio**. Su salida es el contrato.

**La derivación de `lead` por hecho —COM-21 §3.3— ocurre en [2]→[1], en `application/`.** Es donde ya se hace hoy: `GenerateDiagnosis` toma del repositorio **solo `id`**, *«que es una cadena y no un contrato»*, y arma su emisión con valores propios.

---

# 4. Las cuatro operaciones

## 4.1 `save`

**Añade una emisión. Nunca sustituye** *(V-1 · P-I2)*.

**El `issue` llega ya decidido en el contrato** porque **forma parte de la identidad del agregado** *(ADR-16 §4.4 · AG-1)*, y lo derivó el caso de uso del historial. **El adapter lo conserva tal cual**: reescribirlo haría que la identidad devuelta no fuese la que el dominio construyó.

**Genera `id`, `userId` y `createdAt`**, y los pasa **explícitamente** al mapper: *«funciones puras — sin I/O y sin generación de identificadores ni marcas temporales»*.

> **Unicidad de `(leadId, moment, issue)`: la garantiza el motor, no el adapter.** Es una **restricción compuesta**, el mecanismo que ADS-02 eligió PostgreSQL para resolver. **En memoria y con un solo proceso no hay concurrencia que la ponga a prueba** — y es exactamente lo que su hermano A-11 declara. **Deuda F-2**, que alcanza a esta terna.

## 4.2 `findCurrentByMoment`

**Devuelve la emisión vigente de un momento: la de mayor `issue`.** `null` cuando ese momento no ha producido ninguna.

> **Esto resuelve la ambigüedad que COM-19 §9 señaló** —*«¿vigente por `issue` o por `issuedAt`?»*— **por derivación, no por decisión nueva:**
>
> 1. **`issue` es monótono creciente por `(lead, momento)`**: lo deriva el caso de uso del historial y **V-1 · P-I2** garantizan que solo se añade.
> 2. **`issuedAt` no ofrece esa garantía**: es una marca de reloj cuyo **origen está abierto** *(`COM-12 RC-4`)*. Ordenar por ella haría que *«cuál es la vigente»* dependiera de una cuestión sin decidir.
> 3. **El hermano A-11 ya resuelve así su `findCurrentByLeadId`**: *«la vigente es la más reciente, es decir, la de mayor `issue`»*.

## 4.3 `findVersionsByMoment`

**Todas las emisiones de un momento, de la más antigua a la más reciente**, ordenadas por `issue`.

**Es lo que hace verificable P-I2:** si una regeneración hubiese sustituido a la anterior, **se vería aquí**.

## 4.4 `findByLeadId`

**Todas las emisiones del Lead, de cualquier momento. Sin filtro ni recorte:** un límite aquí reintroduciría en la frontera de persistencia un recorte sobre el conjunto, **prohibido por R-42 y R-44**.

---

# 5. Traducciones, campo por campo

## 5.1 Las cinco clases

| Clase | Qué significa |
| --- | --- |
| **Copia directa** | Mismo valor, mismo tipo |
| **Transformación** | Mismo valor, **otra representación** — conjunto cerrado ⇄ `string`, lista inmutable ⇄ mutable |
| **Reconstrucción** | Se rearma una **estructura** que estaba descompuesta |
| **Derivación** | El valor **sale de otro campo** que el registro sí conserva |
| **Generación** | El valor **no existía antes**: lo produce el adapter |

> **La quinta clase es necesaria y no estaba en el enunciado:** `id`, `userId` y `createdAt` **no se traducen — nacen aquí**, y confundirlos con una copia ocultaría que el adapter es su único autor.

## 5.2 Escritura · Contract → Model

| Campo del Model | Origen | Clase |
| --- | --- | :-: |
| `id` | `randomUUID()` | **Generación** |
| `userId` | Constante de un solo inquilino — **F-3** | **Generación** |
| `createdAt` | Reloj del adapter | **Generación** |
| `leadId` | `Proposal.leadId` | Copia directa |
| `moment` | `Proposal.moment` | **Transformación** — conjunto cerrado → `string` |
| `issue` | `Proposal.issue` | Copia directa |
| `text` | `Proposal.text` | Copia directa |
| `channel` | `Proposal.channel` | **Transformación** |
| `criteriaVersion` | `Proposal.criteriaVersion` | Copia directa |
| `issuedAt` | `Proposal.issuedAt` | Copia directa |
| `strategy.objective` · `barrier` · `emotion` · `channel` · `moment` | Ídem en el contrato | **Transformación** |
| `strategy.focus` · `relevanceElement` · `expectedOutcome` | Ídem | Copia directa |
| `strategy.resumedThread` · `openedThread` | Ídem | **Copia condicional** — **la ausencia se conserva; nunca se escribe `undefined`** *(R-38)* |
| `strategy.evidenceBase[]` | `AffirmableFactRecord[]` | **Transformación** — §5.4 |
| `affirmableFacts[]` | `AffirmableFactRecord[]` | **Transformación** — §5.4 |

## 5.3 Lectura · Model → Contract

| Campo del Contract | Origen | Clase |
| --- | --- | :-: |
| `leadId` · `issue` · `text` · `criteriaVersion` · `issuedAt` | Ídem en el modelo | Copia directa |
| `moment` · `channel` | `string` del modelo | **Reconstrucción** del conjunto cerrado |
| `strategy` | `CommercialStrategyModel` | **Reconstrucción** anidada, conservando las ausencias |
| `affirmableFacts[]` · `strategy.evidenceBase[]` | `AffirmableFactModel[]` | **Reconstrucción** — §5.4 |
| `id` | `model.id` | **No entra en el contrato**: se adjunta en `Identified<T>` |

## 5.4 El hecho afirmable

| Campo | Escritura | Lectura |
| --- | :-: | :-: |
| `statement` | Copia directa | Copia directa |
| `kind` | **Transformación** — conjunto cerrado → `string` | **Reconstrucción** |
| `source.observation` | **Transformación** | **Reconstrucción** |
| `source.source` | Copia directa | Copia directa |

**La estructura anidada de `source` se conserva en ambos sentidos.** Aplanarla obligaría a rearmarla al leer, y **el mapper no debe inventar forma**.

## 5.5 Lo que el adapter **no** traduce

| Dato | Clase | Dónde ocurre |
| --- | :-: | --- |
| **`lead` de cada hecho** | **Derivación** — de `Proposal.leadId` | **`application/`**, al rearmar la entidad *(COM-21 §3.3)* |
| **`ProposalId`** — la terna `(lead, moment, issue)` | **Reconstrucción** | **`application/`** |

> **Ambas son las únicas de su clase en todo el recorrido, y ninguna pertenece al adapter.** Es la frontera de §3.1.

---

# 6. Traducciones que NO existen

**Se enumeran porque su ausencia es la garantía:**

- **No se traduce ninguna decisión.** El adapter **no lee** `objective`, `barrier` ni `emotion` para nada: los **copia**.
- **No se traduce el vocabulario.** El modelo guarda `string` y **la validación pertenece al dominio** — el mismo criterio de `BuyerDiagnosisModel` y `CommercialSequenceModel`.
- **No se traduce la evidencia a otra forma.** Cada hecho entra y sale **con sus tres campos**; ninguno se resume, se concatena ni se recalcula.

---

# 7. Comprobación de los cinco límites

## 7.1 No toma decisiones comerciales

**No puede, y no por disciplina:** **ADR-08 §10 · R-27** le prohíben importar `modules/*/domain/`, de modo que **no tiene acceso a ninguna función de decisión**. Los conjuntos cerrados que maneja están **replicados** en `contracts/commercialValues.ts` *«verificados por lectura directa — no importados»*, y una réplica de vocabulario **no decide**: nombra.

## 7.2 No calcula estrategia

**La estrategia llega completa dentro del contrato.** El adapter **no tiene ninguna función que construya una** —`selectStrategy` vive en el `domain/` del módulo, inalcanzable desde aquí— y su mapper **copia los diez contenidos uno a uno**.

**ADR-16 §7** atribuye la estrategia a `domain/`; **RA-R1 · RC-3** declaran que decidirla fuera es la fuga más probable de la arquitectura comercial. **Aquí es estructuralmente imposible.**

## 7.3 No genera hechos

**RA-4** — *«el adapter no puede añadir un solo hecho»*, y **RE-1** — *«la lista es cerrada y ninguna capa la amplía»*.

**El mapper recorre la lista recibida y produce exactamente un elemento por elemento**: no tiene constructor de hechos, no consulta A-2 ni A-4 —no puede: no conoce Lead Hunter ni Lead Analyzer— y **no reejecuta la proyección**, que además devolvería otra lista *(COM-20 §4.1)*.

## 7.4 No modifica criterios

**`criteriaVersion` se copia literalmente**, en los dos sentidos. El adapter **no conoce el Perfil transcrito** —vive en `domain/`— y **COM-15** prohíbe generar, derivar o versionar una designación. **Un `string` copiado no puede convertirse en una decisión de producto.**

## 7.5 No altera la identidad

**`leadId`, `moment` e `issue` se copian sin tocarlos.** El precedente de A-11 lo enuncia: *«reescribirlo aquí haría que la identidad devuelta no fuese la que el dominio construyó»*.

**El `id` que sí genera no es la identidad del negocio**: es el identificador de persistencia, y **ADR-05 §7, Decisión 3** declara que *«el id pertenece a persistencia, no a la entidad de negocio»*. **La identidad comercial sigue siendo la terna**, y el adapter no la produce ni la valida.

---

# 8. Ficheros implicados

## 8.1 Nuevos

| # | Fichero | Por qué |
| :-: | --- | --- |
| **1** | `shared/persistence/models/ProposalModel.ts` | **No existe.** A-6 es el único activo comercial con contrato y sin modelo — forma en COM-21 §2.3 |
| **2** | `shared/persistence/contracts/AffirmableFact.ts` | Declara `AffirmableFactRecord`, que **los contratos de `Proposal` y `CommercialStrategy` comparten**. En fichero propio para que ninguno importe al otro |
| **3** | `shared/persistence/adapters/proposalMapper.ts` | **La frontera de mapeo** *(ADR-08 §7 · R-26)*: funciones puras, sin I/O ni generación |
| **4** | `shared/persistence/adapters/inMemoryProposalAdapter.ts` | **El adapter de este diseño** |
| **5** | `shared/persistence/adapters/proposalRepository.contract.ts` | **Suite de comportamiento**, hermana de las tres existentes: append-only, vigencia por `issue`, historial completo, ausencia de borrado |
| **6** | `shared/persistence/adapters/inMemoryProposalAdapter.test.ts` | Ejecuta la suite contra este adapter |

## 8.2 Modificados

| # | Fichero | Qué cambia | Origen |
| :-: | --- | --- | --- |
| **7** | `contracts/Proposal.ts` | `affirmableFacts` cambia de tipo | COM-21 |
| **8** | `contracts/CommercialStrategy.ts` | `evidenceBase` cambia de tipo | COM-21 |
| **9** | `contracts/commercialValues.ts` | Se replican dos conjuntos cerrados | COM-21 |
| **10** | `models/CommercialSequenceModel.ts` | Su `CommercialStrategyModel` sigue al contrato | **COM-21 §5** — alcanza a A-12 |
| **11** | `adapters/commercialSequenceMapper.ts` | **Revisar**: copia la lista sin inspeccionarla y podría compilar sin cambio | COM-21 §5 |
| **12** | `modules/pitch-generator/application/generateProposal.ts` | La traducción a la frontera deja de reducir cada hecho a su enunciado, en sus dos puntos | COM-21 |
| **13** | Las tres suites de `generateProposal` | Aserciones sobre lo entregado a persistir | COM-21 |

> **Los siete son consecuencia de COM-21, no de este diseño.** Se listan porque **la implementación del adapter no compila sin ellos**.

## 8.3 Sin cambios

| Fichero | Por qué |
| --- | --- |
| `repositories/ProposalRepository.ts` | **La interfaz no cambia.** Sus firmas se expresan en términos de `Proposal`, y el tipo cambia por debajo. **El adapter se diseña contra ella, no la modifica** |
| `modules/pitch-generator/domain/commercial/*` | La entidad **ya declara `ClosedFactList`**: nunca perdió nada |
| `contracts/CommercialSequence.ts` | **Usa** el contrato de estrategia; no lo declara |
| `contracts/OutreachPitch.ts` · `repositories/OutreachPitchRepository.ts` | El par heredado sobre A-6, **sin uso**. **Su retirada es otra decisión y el motor no puede implementar ambos** |
| `bootstrap/compositionRoot.ts` | **Construir el adapter es cableado**, y el cableado es otro sprint |
| Orchestrators · rutas · `shared/mappers/` · `shared/contracts/` | Ídem |

---

# 9. Límites conocidos que el adapter hereda

**Ninguno es nuevo y ninguno se resuelve aquí. Se enumeran para que el adapter los declare en lugar de disimularlos**, como hacen sus tres hermanos.

| # | Límite | Estado |
| :-: | --- | --- |
| **1** | **`userId` de un solo inquilino** — no satisface ADR-05 §14 | **F-3** |
| **2** | **Unicidad de `(leadId, moment, issue)`** — la debe garantizar el motor | **F-2** · §4.1 |
| **3** | **`createdAt` no observable desde el contrato de repositorio** | **F-9** |
| **4** | **Los datos no sobreviven a un reinicio** | Propio de un adapter de validación |
| **5** | **Dos repositorios sobre A-6** — `OutreachPitchRepository` declara el mismo activo | Sin uso; su retirada es otra decisión |
| **6** | **`issuedAt` de origen abierto** | **`COM-12 RC-4`** — por eso la vigencia no se ordena por él *(§4.2)* |

---

# 10. Referencias

**ADR-05** §7, §14 · **ADR-08** §5, §6, §7, §8, §10 · **ADR-13** §10.1, §10.2, §10.3, V-1, V-2 · **ADR-16** §4.4, §7, RC-3, P-I2, P-I3, P-I5, AG-1 · **ADR-17** AL-06 · **ADS-02** · **APS-18** RE-1 · **ADR-15** RA-4, RA-R1 · **DEV-00** R-22, R-26, R-27, R-38, R-42, R-44, F-2, F-3, F-9 · **PO-02** §6.2, LS-3 · **COM-12** RC-4 · **COM-19** §7.2, §9 · **COM-20** §4.1 · **COM-21** §2.3, §3.3, §5.
