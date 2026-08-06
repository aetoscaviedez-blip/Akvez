# ADR-16 — Arquitectura del Dominio Comercial

| Campo | Valor |
| --- | --- |
| Código | ADR-16 |
| Clasificación | Architecture Decision Record — Arquitectura de dominio |
| Versión | 1.1 |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** y **Architecture Team** — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Autoridad de dominio | **PO-01 v1.2** · **PO-02 v1.3** · APS-07 v2.1 · **APS-18 v1.2** · **APS-19 v1.1** · **APS-20 v1.1** — *todos `Approved`* |
| Subordinado a | **ADR-15 v1.2** — la Línea de Decisión de su §8 es la regla que este documento aplica |

> **Naturaleza del documento.** ADR-15 decidió **dónde vive cada preocupación**. Este documento decide **sobre qué objetos opera**, **qué eventos los escriben** y **qué casos de uso los coordinan**.
>
> **No redefine el `Lead`.** Está decidido en PO-01, ADR-10A y ADR-12: se referencia y **nunca se reinterpreta** (R-2).
>
> **No decide implementación.** Ni esquema, ni tipos, ni nombres de campo. **La estructura física la localiza ARCH-01 §1 y la anatomía del caso de uso la decide ADR-17.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-30 | AKVEZ Product Office · Architecture Team | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se incorpora **§13** con la constancia de la ratificación y la verificación de entidades, casos de uso, eventos, restricciones y criterios contra APS-18, APS-19 y APS-20. **Se cierran los seis puntos de §10.3.** Se corrigen dos referencias cruzadas obsoletas a **«ARCH-01 §7, abierta»** —§2 y la nota de portada—: ARCH-01 §7 son las *Validaciones obligatorias*, cerradas; la materia abierta era §6, hoy decidida por **ADR-17**. Se actualizan las versiones citadas en §11 y §12 y se retira la calificación de ARCH-01 como *«documento de trabajo»*. **No se modifica ninguna decisión:** ni D-1 a D-6, ni las cinco entidades de §4 con sus invariantes, ni las relaciones de §5, ni la correspondencia de §6, ni los cuatro casos de uso de §7, ni RC-1 a RC-15, ni los quince criterios CA-16-01 a CA-16-15. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 6. **ADR-15 v1.2 quedó `Approved` en el paso 5**, de modo que el documento del que éste es subordinado ya no es un `Draft`. |
| 1.0 | 2026-07-30 | AKVEZ Architecture Team | Definición de la arquitectura del dominio comercial: decisiones arquitectónicas, cinco entidades, relaciones, correspondencia con los nueve eventos de ADR-13, cuatro casos de uso, restricciones, riesgos y criterios de aceptación. | Sprint de **Estabilización del Dominio Comercial**. **Consolida y sustituye al borrador homónimo del mismo día** —*Commercial Domain Model*—, que nunca salió de `Draft` ni fue aprobado: se reestructura a las diez secciones solicitadas y se le incorporan **§3 (decisiones), §6 (eventos), §7 (casos de uso) y §10 (criterios de aceptación)**, ausentes en aquél. Ninguna entidad, relación ni invariante de aquel borrador resulta modificada. |

---

# 1. Objetivo

Dejar el dominio comercial **implementable sin decisiones pendientes**: qué entidades existen, qué las escribe, qué las coordina y cómo se verifica que la **Línea de Decisión** de ADR-15 §8 se respeta.

**Criterio de éxito, y es literal:** un desarrollador nuevo debe poder responder cinco preguntas leyendo este documento, **sin abrir una sola carpeta de infraestructura**. Se comprueban en **§10.2**.

---

# 2. Alcance

**Define:** las cinco entidades del dominio comercial · su identidad, contenido conceptual e invariantes · sus relaciones y cardinalidad · su correspondencia con los activos y eventos de ADR-13 · los cuatro casos de uso · las restricciones vinculantes · los criterios de aceptación.

**No define:** el criterio comercial *(APS-18)* · cómo se miden las variables *(APS-19)* · las restricciones de canal *(APS-20)* · el esquema de persistencia *(ADS-02)* · la **anatomía del caso de uso, los puertos y la regla de dependencia** *(**ADR-17**)* · la estructura física, que **ARCH-01 §1 localiza** · prompts, proveedor generativo, endpoints ni interfaz.

> **Compatibilidad con ARCH-01 v1.3 — verificada.** Las cinco entidades residen en `domain/` y **ninguna contiene API, proveedor, modelo de IA ni detalle de almacenamiento**. Los cuatro casos de uso de §7 son los de ARCH-01 §4, **con la nomenclatura de este documento**: ARCH-01 §4 se sincronizó con §7 en su v1.3, porque **un ADR prevalece sobre un mapa que está fuera de la Clasificación Oficial**.
>
> **Consecuencia de la Opción B, hoy en vigor por ADR-17 §12:** la dependencia de `GenerateProposal` sobre la redacción es **un puerto declarado por el `domain/` del módulo**, no el adapter concreto *(ADR-17 §6.3 · AL-07 · AL-19)*. **Lo que esta sección presuponía es ahora norma exigible.**

---

# 3. Decisiones arquitectónicas

## D-1 — La Línea de Decisión gobierna el dominio comercial

> **Todo lo que decide vive en `domain/`. Todo lo que comunica vive en `infrastructure/`.**

Es la regla de **ADR-15 §8**. Este documento la aplica; no la reinterpreta.

**«Comunicar» incluye tanto expresar como persistir:** el adapter generativo y los adapters de persistencia están ambos por debajo de la línea. **Ninguno decide nada.**

## D-2 — `application/` coordina y no decide

Un caso de uso **encadena** decisiones que toma el dominio. Si un caso de uso contiene una condición que altera el sentido comercial de un contacto, **esa condición pertenece a `domain/`** *(ADR-15 RA-6)*.

**Es la fuga más probable de la Línea**, porque se disfraza de orquestación.

## D-3 — La regla de canal es dominio; el valor numérico no

**Distinción que parece una violación y no lo es:**

| Qué | Dónde | Por qué |
| --- | --- | --- |
| *«Una nota de conexión transporta exactamente un hecho observado»* | **`domain/`** | Es una **regla comercial** *(APS-20 §6.2)* |
| *«El límite del canal es N caracteres»* | **Infraestructura** *(valor en APS-17)* | Es una **limitación técnica impuesta por un tercero** *(R-50 · ADR-11 §8.1 · APS-17 G-3)* |

Situar el número en `domain/` violaría APS-17 G-3; situar la regla en infraestructura violaría D-1. **El reparto es obligatorio en ambos sentidos.**

## D-4 — Producir y declarar son entidades distintas

`Proposal` es lo que AKVEZ **produce**. `ContactEvent` es lo que el usuario **declara**.

Fundirlas reintroduciría la conflación que **PO-01 v1.2** corrigió en seis documentos. **Es la decisión que sostiene la honestidad del modelo entero.**

## D-5 — El dominio comercial no crea ni destruye Leads

Ninguna entidad de este documento registra, elimina, oculta, ordena ni puntúa Leads *(PO-01 §6-§8 · APS-19 §3.1)*.

## D-6 — Toda escritura pasa por un evento declarado

**ADR-13 §13.4 cierra el catálogo.** Ninguna entidad se escribe fuera de los nueve eventos de §13.1. **§6 fija la correspondencia completa.**

---

# 4. Entidades

Cinco. Una ya existe y **no se redefine**.

## 4.1 `Lead` — referenciada, no definida

Definición canónica en **PO-01 §2**, identidad en **ADR-12 §7**, forma persistida en **ADR-13 A-1/A-2**, estados en **PO-02 §5.1**.

Lo único que este ADR declara: **es el sujeto de todas las demás entidades** —ninguna existe sin él—, **no es propiedad del sistema comercial** *(lo registra el Lead Hunter)*, y **su estadio solo lo modifica `ContactEvent`** (§4.5).

## 4.2 `BuyerDiagnosis`

**Qué es.** La lectura comercial de un negocio: cómo abordarlo *(APS-19 §1)*.

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, número de emisión)` |
| **Contenido** | Las **siete variables** de APS-19 §6, cada una con su **clase de conocimiento**, sus **indicios** y su valor cuando proceda · la **confianza declarada** · la versión del criterio comercial |
| **Ciclo** | **Versionado.** Cada emisión añade; ninguna retira *(ADR-13 §10.3)* |
| **Vigencia** | La emisión más reciente |

**Invariantes:** **BD-I1** toda variable declara su clase — *Observable*, *Inferida* o *Desconocida*; **BD-I2** ninguna *Desconocida* tiene valor; **BD-I3** toda *Inferida* conserva sus indicios; **BD-I4** el `CommercialState` **es la variable BD-1**, no un campo aparte; **BD-I5** **no es comparable entre Leads**: no produce puntuación ni orden.

> **`CommercialState` ≠ estadio del `Lead`.** El primero describe **lo que el comprador sabe**; el segundo, **lo que AKVEZ ha hecho con el Lead**. Un Lead puede ser `Scored` y su comprador *Inconsciente* a la vez *(PO-02 LS-5)*.

## 4.3 `CommercialSequence`

**Qué es.** El plan de contactos propuesto para conseguir una conversación *(PO-02 §4)*.

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, número de secuencia)` |
| **Contenido** | Plan de momentos *(APS-18 §9.2)* · momento vigente · por contacto: estrategia, `Proposal` y resultado declarado |
| **Ciclo** | **Actualizable.** El rastro lo conserva **A-8** |
| **Estados** | `Diseñada` · `En curso` · `Concluida` · `Detenida` |

**Invariantes:** **CS-I1** es una propuesta, **no un compromiso**; **CS-I2** concluye al alcanzar una conversación; **CS-I3** agotarla o detenerla **no expulsa** al Lead; **CS-I4** ningún momento se emite sin **acción del usuario para ese contacto concreto**; **CS-I5** un Lead puede tener varias secuencias, y una nueva no borra la anterior; **CS-I6** **no contiene disparadores temporales**.

## 4.4 `Proposal`

**Qué es.** El artefacto de **un** contacto: **estrategia, evidencia y texto** *(PO-02 §3)*.

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, momento de la secuencia, número de emisión)` |
| **Contenido** | La **estrategia** *(APS-18 §8.1)* · la **lista cerrada de hechos afirmables** · el **texto** · el **canal** · la versión del criterio |
| **Ciclo** | **Versionada.** Regenerar añade |

**Invariantes:** **P-I1** **no es solo el texto** — sin estrategia y evidencia no puede explicarse después; **P-I2** regenerar **nunca sustituye**; **P-I3** **emitirla no cambia el estadio**; **P-I4** ninguna afirmación suya carece de evidencia en la lista cerrada; **P-I5** **emitida y nunca enviada es un estado válido**.

## 4.5 `ContactEvent`

**Qué es.** **Lo que el usuario declara que ocurrió.** La única entidad que AKVEZ no produce.

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, momento de la secuencia, marca temporal)` |
| **Contenido** | Qué contacto se emitió · el resultado declarado · la manifestación del comprador, si la hubo |
| **Ciclo** | **Solo crece.** Ninguna declaración se elimina ni se altera |
| **Autor** | **El usuario. Nunca un agente** *(APS-09 §9)* |

**Invariantes:** **CE-I1** **es el único hecho que lleva un `Lead` a `Contacted`**; **CE-I2** sin él la secuencia **no avanza** — el sistema no supone lo que no le consta; **CE-I3** una manifestación **prevalece sobre toda lectura inferida** y **versiona el `BuyerDiagnosis`**; **CE-I4** **nunca lo genera el sistema**: ni por inferencia, ni por tiempo, ni por detección.

> **Es la entidad que hace honesto el modelo.** Sin ella, AKVEZ registraría como hechos cosas que solo ha producido.

---

# 5. Relaciones

```
                          Lead  (PO-01 · ADR-12)
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   BuyerDiagnosis    CommercialSequence     estadio (A-3)
     1..n emisiones      0..n secuencias           ▲
        │                   │                      │
        │                   │  1..n momentos       │
        │                   ▼                      │
        │              Proposal                    │
        │            1..n emisiones                │
        │                   │                      │
        │                   ▼                      │
        └────versiona──  ContactEvent  ───transición───┘
                          0..n
```

| Relación | Cardinalidad | Regla |
| --- | :-: | --- |
| `Lead` → `BuyerDiagnosis` | 1 : 0..n | Puede no existir. Un Lead sin diagnóstico es válido |
| `Lead` → `CommercialSequence` | 1 : 0..n | Varias a lo largo del tiempo *(CS-I5)* |
| `CommercialSequence` → `Proposal` | 1 : 0..n | Una o varias emisiones por momento |
| `Proposal` → `ContactEvent` | 1 : **0..1** | **Una Propuesta puede no haberse enviado nunca** *(P-I5)* |
| `ContactEvent` → `BuyerDiagnosis` | 0..1 : 1 | Solo si hubo manifestación *(CE-I3)* |
| `ContactEvent` → estadio | 0..n : 1 | **Única vía hacia `Contacted`** *(CE-I1)* |

---

# 6. Eventos

**Correspondencia completa con ADR-13 §13.1.** Ninguna entidad se escribe fuera de estos eventos *(D-6)*.

| Entidad | Activo | Evento | Autor | Semántica |
| --- | :-: | :-: | --- | --- |
| `BuyerDiagnosis` | **A-11** | **E-7** | Pitch Generator | **Versiona** |
| `CommercialSequence` | **A-12** | **E-8** | Pitch Generator | **Actualiza** |
| `Proposal` | **A-6** | **E-5** | Pitch Generator | **Versiona.** **No toca el estadio** |
| `ContactEvent` | **A-7 · A-8** | **E-9** | **El usuario** | Actualiza · **versiona A-11 condicionalmente** |
| `Lead` | A-1 · A-2 · A-3 | E-2 · E-2b | Lead Hunter | Registrar · Actualizar |

## 6.1 E-9 y su condicionalidad

Es el único evento del catálogo con semántica condicional junto a E-2/E-2b:

| Lo que el usuario declara | Efecto |
| --- | --- |
| **No respondió** | Actualiza A-12 y A-8. **No versiona** |
| **Respondió**, sin contenido aprovechable | Actualiza A-3, A-12 y A-8. **No versiona** |
| **Respondió con manifestación** | Actualiza A-3, A-12, A-8 **y versiona A-11** *(CE-I3)* |

## 6.2 Qué evento modifica la Biblioteca

**Los nueve de ADR-13 §13.1, y ninguno más.** De ellos, **cuatro pertenecen al dominio comercial** —E-5, E-7, E-8, E-9— y **solo E-9 modifica el estadio de un Lead**.

---

# 7. Casos de uso

Cuatro, uno por evento comercial. **Todos viven en `application/` y ninguno decide** *(D-2)*.

| Caso de uso | Qué **decide** `domain/` | Qué **coordina** `application/` | Qué **comunica** `infrastructure/` | Evento |
| --- | --- | --- | --- | :-: |
| **`GenerateDiagnosis`** | Las siete variables, su clase, sus indicios y la confianza | Obtiene evidencia y Score ya unidos; invoca el cálculo; entrega para persistir | Persistencia de A-11 | **E-7** |
| **`CreateSequence`** | El plan de momentos, su orden y sus objetivos | Encadena diagnóstico → plan; entrega para persistir | Persistencia de A-12 | **E-8** |
| **`GenerateProposal`** | La estrategia · la **lista cerrada** · **el punto de control** | Encadena estrategia → redacción → verificación; **rehace si no supera el control** | **Redacción generativa** · persistencia de A-6 | **E-5** |
| **`RegisterContact`** | Si la declaración produce transición · si contiene manifestación · si versiona el diagnóstico | Recibe la declaración; aplica la decisión del dominio; entrega para persistir | Persistencia de A-3, A-11, A-12, A-8 | **E-9** |

> **`GenerateProposal` es el único que atraviesa la Línea de Decisión, y lo hace en un solo sentido.** `domain/` construye la lista cerrada, `infrastructure/` redacta con ella, `domain/` verifica contra ella. **El adapter no puede añadir un solo hecho** *(ADR-15 §10.2)*.
>
> **`RegisterContact` no decide nada por su cuenta**: la regla «una declaración de contacto produce `Contacted`» es una **regla comercial** y vive en `domain/`. El caso de uso solo la aplica.

---

# 8. Restricciones

| # | Restricción | Origen |
| --- | --- | --- |
| **RC-1** | **Ninguna decisión comercial reside fuera de `domain/`** | D-1 · ADR-15 RA-1 |
| **RC-2** | **`infrastructure/` no decide objetivo, barrera, evidencia ni estrategia** | D-1 · ADR-15 RA-2 |
| **RC-3** | **`application/` coordina; no decide** | D-2 · ADR-15 RA-6 |
| **RC-4** | **Prohibida la lógica comercial en `routes/`.** Son adaptadores HTTP delgados | **R-12 · R-13** |
| **RC-5** | **Prohibida la lógica de negocio en componentes de interfaz.** Un componente presenta y captura; no decide reglas del dominio | **R-48** |
| **RC-6** | **Ningún servicio mezcla dominio e infraestructura.** La Línea de Decisión no admite excepciones locales | D-1 · DEV-00 **RI-2** |
| **RC-7** | **Ninguna automatización.** Ningún contacto se emite sin acción del usuario **para ese contacto concreto** | **PO-02 §2.1** · APS-09 §7 |
| **RC-8** | **Ningún disparador temporal** en ninguna capa | CS-I6 · PO-02 §6.2 |
| **RC-9** | **Ninguna entidad se destruye.** Regenerar añade | ADR-13 §10.2 |
| **RC-10** | **Ninguna entidad rellena lo desconocido** | BD-I2 · R-38 |
| **RC-11** | **Ninguna entidad contiene datos personales de terceros** | APS-19 §4.5 |
| **RC-12** | **Ninguna entidad comercial produce puntuación, orden ni exclusión** | BD-I5 · D-5 |
| **RC-13** | **Toda entidad emitida conserva la versión del criterio** | ADR-15 RA-7 |
| **RC-14** | **Solo `ContactEvent` produce `Contacted`** | CE-I1 · D-4 |
| **RC-15** | **Ninguna unidad de código concentra más de una preocupación** de ADR-15 §7.1 | D-1 · D-2 |

> **RC-15 es la respuesta a «no crear componentes gigantes».** No se expresa por número de líneas, que no es verificable ni significativo, sino por **preocupación**: una unidad que diagnostica **y** decide estrategia **y** redacta es un componente gigante aunque sea corta, porque **hace irreconocible dónde está la Línea de Decisión**.

---

# 9. Riesgos

| # | Riesgo | Impacto | Mitigación |
| --- | --- | :-: | --- |
| **R-1** | **Fundir `Proposal` y `ContactEvent`**, reintroduciendo la conflación que seis documentos acaban de corregir | **Alto** | D-4 · RC-14 · CA-04 |
| **R-2** | **El criterio se filtra a `application/`** disfrazado de coordinación | **Alto** | D-2 · RC-3 · CA-02 |
| **R-3** | **La lista cerrada se amplía en `infrastructure/`** por conveniencia | **Alto** | §7 · RC-2 · CA-07 |
| **R-4** | **`BuyerDiagnosis` deriva hacia una puntuación** y se vuelve cualificación encubierta | **Alto** | BD-I5 · RC-12 · CA-09 |
| **R-5** | **Sin `ContactEvent` el modelo queda inerte**, porque depende de que el usuario declare | Medio-alto | CE-I2. Riesgo de adopción ya declarado en PO-02 §9.4 |
| **R-6** | **`CommercialState` se confunde con el estadio del `Lead`** | Medio-alto | BD-I4 · CA-10 |
| **R-7** | **El punto de control migra a `infrastructure/`** por proximidad al adapter | Medio-alto | §7 · ADR-15 §10.1 · CA-08 |
| **R-8** | **El valor numérico de canal acaba en `domain/`** | Medio | D-3 · CA-11 |
| **R-9** | **Versionar `Proposal` por momento multiplica el volumen** | Medio | Coste asumido en ADR-13 §10.3 |

---

# 10. Criterios de aceptación

## 10.1 Criterios verificables

Numerados **CA-16-xx**, distintos de los `CA` de APS-18, los `CD` de APS-19 y los `CC` de APS-20.

| # | Criterio | Cómo se comprueba |
| --- | --- | --- |
| **CA-16-01** | Ninguna regla comercial reside fuera de `domain/` | Inspección de `application/` e `infrastructure/` |
| **CA-16-02** | Ningún caso de uso contiene una condición que altere el sentido comercial | Inspección de los cuatro casos de uso |
| **CA-16-03** | `infrastructure/` no importa ninguna decisión: recibe estrategia y lista cerrada ya construidas | Inspección del adapter de redacción |
| **CA-16-04** | **Solo `ContactEvent` modifica el estadio del `Lead`** | Ninguna otra entidad escribe A-3 |
| **CA-16-05** | Emitir una `Proposal` no modifica el estadio | E-5 no toca A-3 |
| **CA-16-06** | Toda escritura corresponde a un evento de ADR-13 §13.1 | Trazado escritura ↔ evento |
| **CA-16-07** | Ningún texto afirma un hecho fuera de la lista cerrada | Contraste texto ↔ lista |
| **CA-16-08** | El punto de control reside en `domain/` | Ubicación del verificador |
| **CA-16-09** | Ninguna entidad comercial produce puntuación, orden ni exclusión | Ausencia de valor agregado y de comparación |
| **CA-16-10** | `CommercialState` reside dentro de `BuyerDiagnosis` y **no** en el `Lead` | Inspección de ambas entidades |
| **CA-16-11** | Ningún valor numérico de canal reside en `domain/` | Los valores proceden de APS-17 |
| **CA-16-12** | Ninguna variable *Desconocida* tiene valor asignado | Inspección del diagnóstico |
| **CA-16-13** | Ninguna entidad se sustituye al regenerar | La versión anterior persiste |
| **CA-16-14** | Ningún contacto se emite sin acción del usuario para ese contacto | Ausencia de disparador automático y temporal |
| **CA-16-15** | Ninguna unidad concentra más de una preocupación de ADR-15 §7.1 | Inspección por preocupación |

## 10.2 La prueba del desarrollador nuevo

**Condición de cierre de este ADR.** Las cinco respuestas deben obtenerse **sin abrir infraestructura**. Si alguna dependiera de ella, el diseño está mal y hay que detenerse *(D-1)*.

| Pregunta | Respuesta | Dónde consta |
| --- | --- | --- |
| **¿Dónde vive una regla comercial?** | En **`domain/`** del módulo comercial. **Sin excepción** | D-1 · §7 |
| **¿Dónde cambia un `Lead` de estado?** | La **regla** que lo decide, en `domain/`. La **escritura**, en `shared/persistence/adapters/`. **Y solo por `ContactEvent`** | CE-I1 · RC-14 · §7 |
| **¿Qué evento modifica la Biblioteca?** | Los **nueve** de ADR-13 §13.1. **Cuatro son comerciales** —E-5, E-7, E-8, E-9— y **solo E-9 toca el estadio** | §6 · §6.2 |
| **¿Qué parte decide?** | Las **preocupaciones 3, 4 y 5** de ADR-15 §7.1 — diagnóstico, secuencia y estrategia. Todas en `domain/` | §7 |
| **¿Qué parte solamente comunica?** | La **preocupación 6** —redacción generativa— y los **adapters de persistencia**. Ninguna decide | §7 · D-1 |

**Ninguna de las cinco respuestas depende de infraestructura.** La segunda la menciona, pero solo como **destino de una escritura ya decidida** — que es exactamente lo que D-1 permite.

## 10.3 Definition of Done

> ## ✅ Los seis puntos quedan cumplidos — Sprint *Gobernanza Final*, 2026-07-30. Véase §13.

1. ✅ Ratificar las **cinco entidades** y sus invariantes. — *§13.1*
2. ✅ Ratificar **D-4** —`Proposal` ≠ `ContactEvent`— como invariante **RC-14**. — *§13.1*
3. ✅ Ratificar la correspondencia entidad ↔ activo ↔ evento de **§6**. — *§13.3*
4. ✅ Confirmar que **una `Proposal` puede no haberse enviado nunca** *(§5)*. — *§13.1*
5. ✅ Confirmar que `BuyerDiagnosis` **se versiona** y `CommercialSequence` **no**. — *§13.3*
6. ✅ Confirmar **D-3** — la regla de canal es dominio; el valor numérico no. — *§13.4*

---

# 11. Dependencias

- **PO-01 v1.2** §2, §5, §8 · **PO-02 v1.3** §2, §3, §4, §5, §5.1, §7.
- **APS-07 v2.1** · **APS-18 v1.2** §8, §9, §10, §11 · **APS-19 v1.1** §3.1, §4, §5, §6 · **APS-20 v1.1** §5, §6, §7 · **APS-09** §9 · **APS-17 v1.1** §9.
- **ADR-12 v1.1** §7 · **ADR-13 v1.2** §6.2, §10.2, §10.3, §13.1, §13.4 · **ADR-15 v1.2** §7, §8, §9, §10 · **ADR-11 v2.1** §8.1.
- **ADR-17 v1.1** §5, §6, §7, §12, §14. **Decide la anatomía de los cuatro casos de uso de §7 y hace exigible el puerto de redacción.**
- **DEV-00 v1.4** R-12, R-13, R-38, R-48, R-50, R-59, RI-2.
- **ARCH-01 v1.3** — mapa de localización de la estructura física. **Prevalece este ADR ante discrepancia.**

**Condiciona a:** el esquema de persistencia · ADS-02 · toda implementación del sistema comercial.

---

# 12. Referencias

PO-01 v1.2 · PO-02 v1.3 · APS-07 v2.1 · APS-09 · APS-17 v1.1 · APS-18 v1.2 · APS-19 v1.1 · APS-20 v1.1 · ADR-11 v2.1 · ADR-12 v1.1 · ADR-13 v1.2 · ADR-15 v1.2 · **ADR-17 v1.1** · ADS-00 v1.3 · DEV-00 v1.4 · ARCH-01 v1.3 · COM-02 *(documento de trabajo, fuera del catálogo)*.

---

# 13. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office y Architecture Team, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 6.

## 13.1 Entidades — ratificadas

**Las cinco entidades de §4 y sus invariantes se ratifican íntegras.**

| Entidad | Invariantes | Resultado |
| --- | :-: | :-: |
| **`Lead`** — referenciada, no definida | §4.1 | ✅ **No se redefine.** PO-01 §2 · ADR-12 §7 · PO-02 §5.1 |
| **`BuyerDiagnosis`** | BD-I1 a BD-I5 | ✅ **BD-I5** —no produce puntuación ni orden— es lo que impide que degenere en cualificación encubierta |
| **`CommercialSequence`** | CS-I1 a CS-I6 | ✅ **CS-I3** —agotarla no expulsa— y **CS-I6** —sin disparadores temporales— coinciden con PO-01 §8 y PO-02 §6.2 |
| **`Proposal`** | P-I1 a P-I5 | ✅ **P-I5 confirmado**: *emitida y nunca enviada es un estado válido*. Es el punto 4 de §10.3 |
| **`ContactEvent`** | CE-I1 a CE-I4 | ✅ **CE-I1**: única vía hacia `Contacted` |

> **D-4 se ratifica como invariante RC-14** *(punto 2 de §10.3)*. **`Proposal` es lo que AKVEZ produce; `ContactEvent` es lo que el usuario declara.** Fundirlas reintroduciría la conflación que **PO-01 v1.2, APS-07 v2.1, APS-03 v3.1, ADS-01 v1.2 y ADR-13 v1.2** acaban de corregir en cinco documentos. **Es la decisión que sostiene la honestidad del modelo, y la que más caro costaría perder.**

## 13.2 Casos de uso — ratificados, con su nomenclatura canónica

> **Los cuatro nombres oficiales son los de §7: `GenerateDiagnosis` · `CreateSequence` · `GenerateProposal` · `RegisterContact`.**

**ARCH-01 §4 usaba otros tres nombres.** La discrepancia se resuelve por precedencia —**ADR-16 es orden 4; ARCH-01 está fuera de la Clasificación Oficial**— y **ARCH-01 v1.3 se sincronizó con este documento** en el paso 8 del sprint. *(ADS-00, Terminología: un concepto tendrá un único nombre oficial.)*

| Comprobación | Resultado |
| --- | :-: |
| **Los cuatro viven en `application/` y ninguno decide** *(D-2 · RC-3)* | ✅ |
| **Cada uno corresponde a un solo evento** de ADR-13 §13.1 *(D-6)* | ✅ Coincide con **AL-04** de ADR-17 |
| **`GenerateProposal` es el único que atraviesa la Línea de Decisión, en un solo sentido** | ✅ `domain/` construye → `infrastructure/` redacta → `domain/` verifica |
| **`RegisterContact` no decide por su cuenta**: la regla que produce `Contacted` vive en `domain/` | ✅ **RC-14 · CE-I1** |
| La dependencia de `GenerateProposal` sobre la redacción es **un puerto**, no un adapter | ✅ Exigible desde **ADR-17 AL-19** |

## 13.3 Eventos — correspondencia ratificada

**§6 se ratifica íntegro contra ADR-13 v1.2 §13.1.**

| Comprobación | Resultado |
| --- | :-: |
| **`BuyerDiagnosis` → A-11 → E-7 → versiona** · **`CommercialSequence` → A-12 → E-8 → actualiza** | ✅ **Punto 5 de §10.3 confirmado**: el diagnóstico se versiona; la secuencia, no |
| **`Proposal` → A-6 → E-5 → versiona y NO toca el estadio** | ✅ Coincide con **PO-02 §5** y **LS-3** |
| **`ContactEvent` → A-7, A-8 → E-9 → actualiza y versiona A-11 condicionalmente** | ✅ **§6.1** desarrolla los tres casos |
| **Ninguna entidad se escribe fuera de los nueve eventos** *(D-6 · ADR-13 §13.4)* | ✅ |
| **Solo E-9 modifica el estadio** *(§6.2)* | ✅ **CA-16-04 y CA-16-05** |

## 13.4 Restricciones y criterios — ratificados

**RC-1 a RC-15 y CA-16-01 a CA-16-15 se ratifican íntegros.**

- **D-3 confirmado** *(punto 6 de §10.3)*: la regla de canal es dominio; el valor numérico es infraestructura, con su valor en APS-17. Coincide literalmente con **APS-20 §3.3** y **ARCH-01 §2.3**. ⚠️ **Los tres valores `CH-01` a `CH-03` todavía no existen en APS-17** *(APS-20 Q-3)*, de modo que **CA-16-11 no puede comprobarse plenamente**. Es una acción de producto registrada, no un defecto de este ADR.
- **RC-15** —ninguna unidad concentra más de una preocupación— se refuerza con **AL-04** de ADR-17.
- ⚠️ **Colisión de identificadores declarada.** `RC-1` designa aquí una restricción y en **AR-05 §8** un riesgo abierto; `R-1` a `R-9` de §9 colisionan con las reglas `R-01` a `R-64` de DEV-00. **No es una contradicción y no altera ninguna decisión**, pero obliga a citar siempre el documento junto al código. Registrado como hallazgo de higiene documental.

## 13.5 Compatibilidad con APS-18, APS-19 y APS-20

| Documento | Comprobación | Resultado |
| --- | --- | :-: |
| **APS-18 v1.2** | Ocho principios · Estrategia §8.1 · Secuencia §9 · Regla de Evidencia §11 → **RC-1, RC-2, P-I4, CS-I1 a CS-I6** | ✅ |
| **APS-18 §7.5** | *«Recomendar detener» nunca es umbral de exclusión* → **RC-12 · CS-I3** | ✅ |
| **APS-19 v1.1** | Siete variables, clases de conocimiento y confianza → **BD-I1, BD-I2, BD-I3** · **RC-10** | ✅ |
| **APS-19 §5.5 · PO-02 LS-5** | `CommercialState` ≠ estadio → **BD-I4** y el riesgo **R-6** | ✅ |
| **APS-20 v1.1** | Tres canales y sus restricciones → **D-3** · el `canal` de `Proposal` §4.4 | ✅ |
| **APS-20 §12 Q-4 · APS-18 RG-5** | Ausencia de marco sobre contacto en frío | ⚠️ **Registrada como acción de producto.** No afecta a ninguna entidad de este ADR |
| **PO-02 v1.3 §7** | Los cinco datos que deben sobrevivir | ✅ Cubiertos por A-6, A-7, A-8, A-11, A-12 y **RC-13** |

**Ninguna contradicción detectada.**

## 13.6 Riesgos al ratificar

**R-1 a R-9 de §9 se mantienen intactos.** Los dos de mayor severidad se ratifican expresamente como **abiertos y no automatizables**:

- **R-2** —el criterio se filtra a `application/`— es el mismo **RA-R1** de ADR-15 §16, ratificado como vivo en su §21.3.
- **R-4** —`BuyerDiagnosis` deriva hacia una puntuación— es lo que **BD-I5, RC-12 y CA-16-09** existen para impedir.

**Su verificación automática es el vacío V-4 de DEV-00, que sigue abierto.**

## 13.7 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.1 son: estado, historial, autoridad de portada, corrección de las dos referencias a *«ARCH-01 §7, abierta»*, cierre de los seis puntos de §10.3, versiones citadas en §11 y §12 y esta sección.
