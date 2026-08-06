# COM-35 — Decisión de Propiedad de F-2

| Campo | Valor |
| --- | --- |
| Código | COM-35 / 3 |
| Clasificación | **Asignación de propiedad de deuda** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Propiedad separada y asignada por autoridad documentada.** F-2 sigue **abierta** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-35, tarea 3 |
| Relacionado | **F-2 Identity Guarantee Clarification** *(COM-34/3)* · COM-33 §5 · COM-19 §7.2 |

> **Cero cambios de código. F-2 no se cierra.**
>
> **Lo que se decide es quién puede moverla — no que esté resuelta.**

---

# 1. El problema de propiedad, en una frase

> ### **F-2 lleva seis documentos atribuida a «Ingeniería, con ADS-02», y Ingeniería no puede tocarla: los dos pasos que la desbloquean son de Arquitectura y nadie los tenía asignados.**

**La atribución no era falsa: estaba incompleta.** Describía **quién ejecuta el último paso**, no quién puede llegar hasta él.

---

# 2. Las tres capas, y quién es dueño de cada una

## 2.1 Capa A — **Arquitectura**: la identidad y su garantía exigida

**Qué decide:** qué identifica a cada agregado, y **qué garantía se le exige a la persistencia** para preservarla.

| Materia | Documento | Autoridad documentada | Estado |
| --- | --- | --- | :-: |
| Identidad de A-6 `(Lead, momento, número de emisión)` | **ADR-16 §4.4** | **DDD-01 §9.2** — *«Entidades, invariantes… **es la autoridad del modelo de dominio**»* | ✅ **Decidida** |
| Identidad de A-11 y A-12 | **ADR-16 §4.2 · §4.3** | ídem | ✅ **Decidida** |
| Identidad del Lead | **ADR-12 §7.2** | **DDD-01 §9.2** — *«Identidad del Lead y de la Empresa → ADR-12»* | ✅ **Decidida** |
| **Garantías exigidas a la persistencia** | **ADR-13 §12.3** *(G-1 a G-7)* | **DDD-01 §9.2** — *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»* | 🔴 **Solo cubren el Lead** |

> ### **Aquí está el hueco, y es de Arquitectura.**
>
> **Las siete garantías G-1 a G-7 de ADR-13 §12.3 son todas del Lead.** La central, **G-6**, dice: *«Dentro del espacio de un usuario **no coexisten dos Leads** con la misma Referencia de Origen»*.
>
> **No existe G-equivalente para A-6, A-11 ni A-12.** Y **DDD-01 §9.2 declara que quien decide «qué se persiste y con qué semántica» es ADR-13** — luego **la garantía que falta debe declararse ahí**, y no en otro sitio.

**Propietario de la Capa A: `Responsable` de ADR-13 y ADR-16 = AKVEZ Architecture Team.**

## 2.2 Capa B — **Requisitos**: qué se le exige al motor

**Qué decide:** qué debe satisfacer el motor real para que la garantía de la Capa A se cumpla.

**ADS-02 §3** enumera nueve requisitos *«no negociables»*. El de unicidad es **uno**:

| # | Requisito | Alcance literal | Origen declarado |
| --- | --- | --- | --- |
| **RQ-2** | *«**Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** | ADR-12 §12.2 · **ADR-13 §12.3, G-6** |

> ### **RQ-2 cita G-6 como su origen. No hay nada que citar para los activos comerciales, porque la garantía no existe.**
>
> **La Capa B no puede adelantarse a la Capa A.** ADS-02 declara estar *«Gobernado por ADR-13»*: un requisito de motor sin garantía de arquitectura que lo origine **sería un requisito huérfano**, exactamente el defecto que ADS-00 R-7 tipifica para DEV y que ADS-02 evita citando origen en cada fila.

**Y conviene no confundir RQ-4 con unicidad:**

| RQ-4 | *«**Escritura acumulativa**: versiones sucesivas de análisis, puntuación y propuesta sin sobrescribir»* |
| --- | --- |
| **Qué garantiza** | Que las versiones **se acumulan** |
| **Qué NO garantiza** | Que **no haya dos con el mismo número**. Un almacén puede acumular perfectamente dos filas con `issue = 3` |

**Propietario de la Capa B: `Responsable` de ADS-02 = AKVEZ Architecture Team** *(aprobado por Product Office, sprint GOV-01)*.

## 2.3 Capa C — **Implementación**: la restricción en el motor

**Qué hace:** crear las restricciones compuestas en PostgreSQL y **probarlas contra el motor**, no contra el adapter en memoria.

| Elemento | Estado |
| --- | :-: |
| Motor real | 🔴 **No existe.** Los cinco adapters son en memoria, *«de validación, no la persistencia definitiva»* |
| Restricciones compuestas sobre los tres activos comerciales | 🔴 No implementadas |
| Pruebas de concurrencia | 🔴 **No escribibles.** Sin motor y con un solo proceso no hay concurrencia que probar |

**Propietario de la Capa C: Ingeniería.** ⛔ **Bloqueada por A y B.**

---

# 3. Decisión de propiedad

> ## **F-2 no tiene un propietario: tiene tres, en secuencia estricta.**

| Capa | Materia | Propietario | Documento a modificar | Estado |
| :-: | --- | --- | --- | :-: |
| **A** | Garantía de identidad exigida a la persistencia | **Architecture Team** | **ADR-13 §12.3** — añadir garantías para A-6, A-11, A-12 | 🔴 **No iniciada** |
| **B** | Requisito impuesto al motor | **Architecture Team** | **ADS-02 §3** — añadir los RQ correspondientes, citando origen en A | ⛔ Bloqueada por A |
| **C** | Restricción compuesta y sus pruebas | **Ingeniería** | Código del adapter de motor real | ⛔ Bloqueada por B |

> ### **La atribución «Ingeniería, con ADS-02» describe la Capa C. Las capas A y B nunca se asignaron.**
>
> **Ésa es la corrección que este documento aporta.** No cierra F-2, no la reasigna a nadie nuevo: **la desagrega** y descubre que **dos tercios de ella nunca tuvieron dueño**.

## 3.1 Redacción propuesta para la atribución de F-2

| | Texto |
| --- | --- |
| **Hoy** | *«F-2 — Unicidad `(leadId, issue)` / `(leadId, sequence)` en el motor real · Propietario: Ingeniería, con ADS-02»* |
| **Propuesto** | *«**F-2** — Unicidad de la identidad de agregado en el motor real: `(leadId, issue)` para A-11, `(leadId, sequence)` para A-12 y **`(leadId, moment, issue)` para A-6**. **Propietario en secuencia: (A) Architecture Team — ADR-13 §12.3; (B) Architecture Team — ADS-02 §3; (C) Ingeniería — implementación. C está bloqueada por B, y B por A.»*** |

**Incorpora la terna de A-6 que COM-19 §7.2 pedía**, y que cuatro de los seis documentos ya recogían.

---

# 4. ⚠️ Sigue sin poder ejecutarse una cosa: dónde se escribe esa redacción

**COM-33 §5.4 y COM-34/3 §8 lo registraron y sigue vigente:**

> ### **Ningún documento *es* el registro de la serie F-.**

F-2 aparece **restatada, nunca declarada**, en COM-06 §11, COM-10 §7, COM-13 §2.4, COM-19 §10, COM-21 §9 y COM-23 §7 — **con cuatro redacciones distintas**.

**El precedente existe:** la serie **A-/T-** tiene **AR-05 §5.1** como *«ésta es la tabla vigente»*, con fecha de actualización y sprint responsable. **La serie F- no tiene equivalente.**

> **Este documento asigna la propiedad de F-2. No puede escribir esa asignación en un registro que no existe.** Se pide en §6, punto 1.

---

# 5. 🔴 Y sigue sin resolverse la colisión del nombre

**Dos cosas distintas se llaman `F-2`, y ambas se citan en código:**

| | **F-2 · deuda** *(serie comercial)* | **F-2 · regla** *(ADR-17 §8.2)* |
| --- | --- | --- |
| Naturaleza | Deuda abierta | **Regla `Approved`** |
| Citas en código | 4 — en adapters y suites de contrato | 3 — en `application/` |

> **La asimetría indica cuál debe renombrarse:** la de **ADR-17 §8.2 está `Approved` y catalogada**; la de la serie comercial **no está fijada en ningún documento** *(§4)*. **Renombrar la segunda no rompe nada; renombrar la primera exige enmendar un ADR.**
>
> **No se renombra aquí.** Se recomienda hacerlo **en el mismo acto** que cree el registro de §4 — es el momento de coste cero.

---

# 6. Qué se pide

| # | Acción | Quién | Desbloquea |
| :-: | --- | --- | --- |
| **1** | **Crear el registro de la serie F-**, con el patrón de AR-05 §5.1, y **volcar en él la redacción de §3.1** | **Architecture Team** | Que F-2 tenga **una** redacción y un dueño registrado |
| **2** | **Renombrar la F-2 de la serie comercial** en ese mismo acto *(§5)* | **Architecture Team** | Que las siete citas del código sean inequívocas |
| **3** | **Capa A** — añadir a **ADR-13 §12.3** las garantías de unicidad de identidad para A-6, A-11 y A-12 | **Architecture Team** | **La Capa B** |
| **4** | **Capa B** — añadir a **ADS-02 §3** los requisitos correspondientes, citando su origen en el punto 3 | **Architecture Team** | **La Capa C** — F-2 pasa a ser ejecutable |

> **Ninguna de las cuatro requiere código. Ninguna puede ejecutarla Ingeniería.**
>
> **Los puntos 3 y 4 son los que convierten F-2 en trabajo real.** Hasta entonces, la atribución a Ingeniería es formalmente correcta y prácticamente inerte.

---

# 7. Lo que este documento **no** hace

- ❌ **No cierra F-2.** Sigue 🟡 abierta en las tres capas.
- ❌ **No afirma ninguna garantía inexistente.** Hoy **nada** impide dos filas con la misma identidad en A-6, A-11 y A-12: la ausencia de fallo es una propiedad del entorno —un proceso, memoria—, no del diseño.
- ❌ **No modifica ADS-02, ADR-13, ADR-16 ni ningún COM anterior.**
- ❌ **No crea el registro F-.** Crearlo es el punto 1, y es un acto de gobernanza.
- ❌ **No renombra nada.**
- ❌ **No cambia código.**

---

# 8. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se acepta la separación en tres capas y no se ejecutan los puntos 3 y 4.** F-2 queda con propiedad clara **y siendo igual de inejecutable** | 🔴 Alta |
| **2** | **Se lee «propiedad asignada» como «deuda encaminada».** No lo está: **la Capa A no se ha iniciado** | 🟡 Media |
| **3** | **El registro de §4 no se crea** y esta asignación se convierte en la **séptima** redacción dispersa de F-2 | 🟡 Media |
| **4** | **Llega el motor real antes que las capas A y B**, y las restricciones se diseñan sin requisito que las origine | 🟡 Media |

---

# 9. Referencias

**ADR-12 v1.1** §7.2, §12.2 · **ADR-13 v1.2** §10.3, §11.1, §12.3 *(G-1 a G-7)*, §12.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2 *(F-2 · regla)* · **ADS-00 v1.3** R-5, R-7 · **ADS-02 v1.1** §3 *(RQ-1 a RQ-9)*, §7, §9 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** R-30, R-31 · **AR-05** §5.1, RC-10 · **COM-06** · **COM-10** §7 · **COM-13** §2.4 · **COM-19** §7.2, §10 · **COM-21** §9 · **COM-23** §7 · **COM-33** §5 · **COM-34/3**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
