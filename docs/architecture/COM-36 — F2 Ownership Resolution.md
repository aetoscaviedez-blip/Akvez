# COM-36 — Resolución de Propiedad de F-2

| Campo | Valor |
| --- | --- |
| Código | COM-36 / 3 |
| Clasificación | **Asignación de propiedad de deuda** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Propiedad asignada por autoridad documentada.** F-2 sigue **abierta** en las tres capas |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-36, tarea 3 |
| Antecedentes | **COM-33 §5** · **COM-34/3** *(clarificación)* · **COM-35/3** |

> **No se han creado índices. No se han creado constraints. No se ha tocado ningún adapter. Cero cambios de código.**
>
> **Se define propiedad. NO se implementa garantía.**

---

# 1. Las cuatro respuestas, en una tabla

| Pregunta | Respuesta | Autoridad que lo establece |
| --- | --- | --- |
| **¿Quién define la identidad?** | **ADR-16** *(A-6, A-11, A-12)* · **ADR-12** *(Lead)* — **Architecture Team** | **DDD-01 §9.2** |
| **¿Quién define la garantía?** | **ADR-13 §12.3** — **Architecture Team**, aprobado por **Product Office** | **DDD-01 §9.2** |
| **¿Quién implementa?** | **Ingeniería**, sobre el motor de **ADS-02** | ADS-02 §3, §7 |
| **¿Qué está bloqueado?** | **Las capas B y C.** La **A no está iniciada** | §5 |

---

# 2. Capa A — Definición de identidad · **Architecture Team**

## 2.1 Qué comprende

**Dos materias distintas que suelen confundirse:**

| A.1 — **Qué identifica al agregado** | A.2 — **Qué garantía se le exige a la persistencia para preservarlo** |
| --- | --- |

## 2.2 A.1 — La identidad · ✅ **DECIDIDA**

| Activo | Identidad | Documento | Autoridad declarada |
| --- | --- | --- | --- |
| **A-6** Propuesta | `(Lead, momento de la secuencia, número de emisión)` | **ADR-16 §4.4** | **DDD-01 §9.2** — *«Entidades, invariantes… **es la autoridad del modelo de dominio**»* |
| **A-11** Diagnóstico | `(Lead, número de emisión)` | **ADR-16 §4.2** | ídem |
| **A-12** Secuencia | `(Lead, número de secuencia)` | **ADR-16 §4.3** · CS-I5 | ídem |
| **A-1** Lead | `(Referencia de Origen, Usuario)` | **ADR-12 §7.2** | **DDD-01 §9.2** — *«Identidad del Lead y de la Empresa → **ADR-12**»* |

**Y el código la respeta:** el número que discrimina —`issue`, `sequence`, `moment`— **llega al adapter ya decidido por el caso de uso**, derivado del historial. El adapter lo conserva tal cual; reescribirlo haría que la identidad devuelta no fuese la que el dominio construyó.

> **ADR-13 §12.4 lo blinda:** *«La identidad del Lead **no podrá depender en ningún grado** del motor de persistencia.»*

## 2.3 A.2 — La garantía exigida · 🔴 **NO EXISTE para los activos comerciales**

**ADR-13 §12.3 declara siete garantías. Las siete son del Lead.**

| Garantía | Enunciado | Alcance |
| --- | --- | :-: |
| **G-6** | *«Dentro del espacio de un usuario **no coexisten dos Leads** con la misma Referencia de Origen»* | **Solo A-1** |
| G-1 · G-2 · G-3 · G-4 · G-5 · G-7 | Referencia de Origen, propietario, identificador, fecha, historial, multiplicidad | **Solo A-1** |

> ### 🔴 **No existe G-equivalente para A-6, A-11 ni A-12.**
>
> **Y el documento que debe declararla está identificado sin ambigüedad. DDD-01 §9.2:**
>
> | Concepto | Autoridad única |
> | --- | --- |
> | **Qué se persiste, cuándo y con qué semántica** | **ADR-13** |
>
> **La garantía que falta debe declararse en ADR-13 §12.3, y en ningún otro sitio.**

**Propietario de la Capa A:** `Responsable` de **ADR-13** y **ADR-16** = **AKVEZ Architecture Team**.
**Estado: 🔴 no iniciada.**

---

# 3. Capa B — Requisito operativo · **Architecture Team redacta · Product Office aprueba**

## 3.1 Qué comprende

**Qué se le exige al motor real para que la garantía de A.2 se cumpla.** Vive en **ADS-02 §3**, *«Requisitos Impuestos por la Arquitectura… **no negociables**»*.

## 3.2 Estado · 🔴 **Cubre solo A-1**

| # | Requisito | Alcance literal | Origen que cita |
| --- | --- | --- | --- |
| **RQ-2** | *«**Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** | ADR-12 §12.2 · **ADR-13 §12.3, G-6** |

> ### **RQ-2 cita G-6 como su origen. Para los activos comerciales no hay nada que citar, porque la garantía de la Capa A no existe.**
>
> **La Capa B no puede adelantarse a la A.** ADS-02 declara estar *«**Gobernado por ADR-13**»*: un requisito de motor sin garantía de arquitectura que lo origine sería **un requisito huérfano**.

## 3.3 ⚠️ No confundir RQ-4 con unicidad

| **RQ-4** | *«**Escritura acumulativa**: versiones sucesivas de análisis, puntuación y propuesta sin sobrescribir»* |
| --- | --- |
| **Garantiza** | Que las versiones **se acumulan** |
| **NO garantiza** | Que no haya **dos con el mismo número**. Un almacén puede acumular perfectamente dos filas con `issue = 3` |

## 3.4 ⚠️ Precisión sobre el propietario

**El sprint propone «Capa B → ADS-02/Product». El registro documental es más preciso, y la diferencia importa:**

| Campo de la cabecera de ADS-02 | Valor |
| --- | --- |
| `Responsable` | **AKVEZ Architecture Team** |
| `Aprobado por` | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| `Gobernado por` | **ADR-13** · ADR-05 · ADR-08 · ADR-12 |

> ### **Redacta el Architecture Team; aprueba el Product Office.**
>
> **No es un matiz formal:** si se atribuyera la redacción al Product Office, la Capa B quedaría a la espera de un actor que **no es el `Responsable` del documento**, y el bloqueo se volvería permanente por dirigirse a la puerta equivocada.
>
> **La lectura «Product» del sprint es correcta en cuanto a la aprobación, e incompleta en cuanto a la redacción.** Se registra la discrepancia en lugar de adoptar cualquiera de las dos en silencio.

**Estado: ⛔ bloqueada por la Capa A.**

---

# 4. Capa C — Implementación técnica · **Ingeniería**

| Elemento | Estado |
| --- | :-: |
| **Motor real** | 🔴 **No existe.** Los cinco adapters son en memoria — *«de validación, **no la persistencia definitiva**»* *(ADR-08 §8 · ADR-09 §6)* |
| Restricciones compuestas sobre A-6, A-11, A-12 | 🔴 No implementadas |
| Pruebas de concurrencia | 🔴 **No escribibles.** Sin motor y con un solo proceso **no hay concurrencia que probar** |

**Lo que Ingeniería sí ha hecho, y es lo correcto: declarar el hueco donde intentaría taparse.**

| Fichero | Qué declara |
| --- | --- |
| `buyerDiagnosisRepository.contract.ts:14` | *«QUÉ NO VERIFICA: la unicidad de `(leadId, issue)` bajo concurrencia (deuda F-2). No es comprobable sin un motor real»* |
| `commercialSequenceRepository.contract.ts:21` | *«La unicidad de `(leadId, sequence)` bajo concurrencia — deuda F-2»* |
| `proposalRepository.contract.ts:18` | *«la unicidad de `(leadId, moment, issue)` bajo concurrencia (deuda F-2)»* |
| `inMemoryProposalAdapter.ts:54-57` | *«la unicidad de `(leadId, moment, issue)` debe garantizarla el motor con una **restricción compuesta**»* |

**Estado: ⛔ bloqueada por la Capa B.**

---

# 5. Qué está bloqueado — el diagnóstico completo

| Capa | Materia | Propietario | Documento | Estado |
| :-: | --- | --- | --- | :-: |
| **A.1** | Identidad del agregado | Architecture Team | ADR-16 · ADR-12 | ✅ **Decidida** |
| **A.2** | **Garantía exigida a la persistencia** | **Architecture Team** | **ADR-13 §12.3** | 🔴 **No iniciada** |
| **B** | Requisito al motor | **Architecture Team** redacta · **Product Office** aprueba | **ADS-02 §3** | ⛔ Bloqueada por A.2 |
| **C** | Restricción compuesta y pruebas | **Ingeniería** | Adapter de motor real | ⛔ Bloqueada por B |

> ## **La atribución histórica «Ingeniería, con ADS-02» describía la Capa C. Las capas A.2 y B nunca se asignaron a nadie.**
>
> **Ésa es la corrección que aporta este documento.** No cierra F-2 y no la reasigna a un actor nuevo: **la desagrega**, y al desagregarla aparece que **dos tercios de F-2 no tenían dueño**.

## 5.1 Lo que NO se garantiza hoy — enunciado sin adornos

> **Nada impide que existan dos filas con la misma identidad en A-6, A-11 y A-12.**
>
> Entre la lectura del historial y la escritura **no hay atomicidad**. Dos escrituras concurrentes leerían el mismo historial, derivarían el mismo número y producirían dos filas con la misma identidad — **en silencio**.
>
> **Que hoy no ocurra es una propiedad del entorno —un proceso, memoria—, no una garantía del diseño.**

## 5.2 El caso de A-1 es distinto, y no debe confundirse

`inMemoryLeadAdapter` **sí resuelve en código** la unicidad de `(userId, identityKey)`. **Eso no es F-2:**

- Es la desviación **A-03**, 🟡 `Partially Resolved` en **AR-05 §5.1**.
- Su riesgo es **RC-10**: *«la unicidad la garantiza el código, no el motor. Con un motor real y varios procesos, dos registros concurrentes de la misma identidad podrían duplicar un Lead»*.
- **R-31** ya declara quién debe garantizarla: *«la unicidad de `(Referencia de Origen, Usuario)` la garantiza **el motor**, no el código de aplicación»*.

> **A-1 tiene resolución parcial, regla que la exige y riesgo registrado. Los tres activos comerciales no tienen ninguna de las tres cosas.**

---

# 6. 🔴 Dos bloqueos que este documento no puede levantar

## 6.1 Ningún documento *es* el registro de la serie F-

**F-2 aparece restatada, nunca declarada**, en **COM-06 §11, COM-10 §7, COM-13 §2.4, COM-19 §10, COM-21 §9 y COM-23 §7** — con **cuatro redacciones distintas**.

**El precedente existe:** la serie **A-/T-** tiene **AR-05 §5.1** como *«ésta es la tabla vigente»*, con fecha y sprint responsable. **La serie F- no tiene equivalente.**

> **Este documento asigna la propiedad de F-2. No puede escribirla en un registro que no existe.**

### Redacción propuesta, para cuando ese registro exista

> **F-2** — Unicidad de la identidad de agregado en el motor real: `(leadId, issue)` para A-11, `(leadId, sequence)` para A-12 y **`(leadId, moment, issue)` para A-6**.
> **Propietario en secuencia:** **(A.2)** Architecture Team — ADR-13 §12.3 · **(B)** Architecture Team redacta / Product Office aprueba — ADS-02 §3 · **(C)** Ingeniería — implementación.
> **C está bloqueada por B, y B por A.2.**

**Incorpora la terna de A-6 que COM-19 §7.2 pedía** y que cuatro de los seis documentos ya recogían.

## 6.2 El identificador `F-2` sigue colisionado

| | **F-2 · deuda** *(serie comercial)* | **F-2 · regla** *(ADR-17 §8.2)* |
| --- | --- | --- |
| Naturaleza | Deuda abierta | **Regla `Approved`** |
| Citas en código | **4** — adapters y suites de contrato | **3** — `generateDiagnosis.ts:61`, `createSequence.ts:80`, `generateOutreachPitch.ts:43` |

> **La asimetría indica cuál renombrar:** la de ADR-17 §8.2 está `Approved` y catalogada; la de la serie comercial **no está fijada en ningún documento**. **Renombrar la segunda no rompe nada; renombrar la primera exige enmendar un ADR.**
>
> **No se renombra aquí.** Debe hacerse **en el mismo acto** que cree el registro de §6.1 — es el momento de coste cero.

---

# 7. Qué se pide

| # | Acción | Quién | Desbloquea |
| :-: | --- | --- | --- |
| **1** | **Crear el registro de la serie F-**, con el patrón de AR-05 §5.1, y volcar la redacción de §6.1 | **Architecture Team** | Que F-2 tenga **una** redacción y dueño registrado |
| **2** | **Renombrar la F-2 de la serie comercial** en ese mismo acto | **Architecture Team** | Que las siete citas del código sean inequívocas |
| **3** | **Capa A.2** — añadir a **ADR-13 §12.3** las garantías de unicidad de identidad para A-6, A-11 y A-12 | **Architecture Team** | **La Capa B** |
| **4** | **Capa B** — añadir a **ADS-02 §3** los requisitos correspondientes, citando origen en el punto 3 | **Architecture Team** redacta · **Product Office** aprueba | **La Capa C.** F-2 pasa a ser ejecutable |

> **Ninguna requiere código. Ninguna puede ejecutarla Ingeniería.**
>
> **Los puntos 3 y 4 son los que convierten F-2 en trabajo real.** Hasta entonces, la atribución a Ingeniería es formalmente correcta y **prácticamente inerte**.

---

# 8. Lo que este documento **no** hace

- ❌ **No cierra F-2.** Sigue abierta en las tres capas.
- ❌ **No afirma ninguna garantía inexistente** *(§5.1)*.
- ❌ **No crea índices, constraints ni migraciones.**
- ❌ **No toca adapters** ni ningún otro código.
- ❌ **No modifica ADR-13, ADS-02, ADR-16 ni ningún COM anterior.**
- ❌ **No crea el registro F-** ni renombra nada *(§6)*.

---

# 9. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se acepta la separación y no se ejecutan los puntos 3 y 4.** F-2 queda con propiedad clara **y siendo igual de inejecutable** | 🔴 Alta |
| **2** | **Se lee «propiedad asignada» como «deuda encaminada».** **La Capa A.2 no se ha iniciado** | 🟡 Media |
| **3** | **El registro de §6.1 no se crea** y esta asignación se convierte en la **séptima** redacción dispersa | 🟡 Media |
| **4** | **Llega el motor real antes que A.2 y B**, y las restricciones se diseñan sin requisito que las origine | 🟡 Media |
| **5** | **La Capa B se dirige al Product Office como redactor** y queda esperando a quien no es el `Responsable` de ADS-02 *(§3.4)* | 🟡 Media |

---

# 10. Referencias

**ADR-08 v1.2** §8, §10 · **ADR-09 v1.3** §6 · **ADR-12 v1.1** §7.2, §12.2 · **ADR-13 v1.2** §10.3, §11.1, §12.3 *(G-1 a G-7)*, §12.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2 · **ADS-00 v1.3** R-5, R-7 · **ADS-02 v1.1** *(cabecera)*, §3 *(RQ-1 a RQ-9)*, §7, §9 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** R-30, R-31 · **AR-05** §5.1 *(A-03)*, RC-10 · **COM-06** · **COM-10** §7 · **COM-13** §2.4 · **COM-19** §7.2, §10 · **COM-21** §9 · **COM-23** §7 · **COM-33** §5 · **COM-34/3** · **COM-35/3**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
