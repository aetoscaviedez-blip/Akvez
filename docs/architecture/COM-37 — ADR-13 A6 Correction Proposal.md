# COM-37 — Propuesta de Corrección de ADR-13 §6.2, fila A-6

| Campo | Valor |
| --- | --- |
| Código | COM-37 / 3 |
| Clasificación | **Propuesta de corrección documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propuesta redactada. NO aplicada** |
| Fecha | 2026-08-04 |
| Documento a corregir | **ADR-13 v1.2 §6.2**, fila **A-6**, columna **«Contenido»** |
| Antecedentes | **COM-34 §5.2** · **COM-35/1** · **COM-36/1** |

> **No se ha modificado ADR-13. No se ha tocado código. No se ha marcado nada `Deprecated`.**

---

# 1. Qué se corrige, y qué no

| | |
| --- | --- |
| **Se corrige** | **Una celda**: fila A-6, columna «Contenido», de la tabla de §6.2 |
| **NO se corrige** | La columna «Momento de escritura» de esa misma fila · §10.3 *(versionado)* · §11 *(atomicidad)* · §12.3 *(garantías)* · §13 *(catálogo de eventos)* · **ninguna otra fila del inventario** |
| **NO se retira** | **ADR-13 conserva íntegra su autoridad.** No se marca `Deprecated`, no se archiva |

> **ADS-00 R-1:** *«La precedencia resuelve conflictos, no sustituye documentos. Que un documento prevalezca **no anula al otro. Obliga a corregirlo**.»*

---

# 2. Texto actual

**ADR-13 v1.2, §6.2 — *Inventario de estado durable*, fila A-6:**

```
| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |
```

| Columna | Valor actual | Veredicto |
| --- | --- | :-: |
| # | **A-6** | ✅ Correcto |
| Activo | **Propuesta comercial** | ✅ Correcto |
| **Contenido** | **Asunto · mensaje · tono** | 🔴 **Defectuoso** |
| Momento de escritura | Al generarse. **Versionada** | ✅ **Correcto — no se toca** |

---

# 3. Texto corregido propuesto

```
| **A-6** | **Propuesta comercial** | La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |
```

**Cambia una celda. Se añade la remisión a la autoridad para que el desfase no pueda repetirse.**

## 3.1 Registro exigido por ADS-00 R-3

**Historial de Versiones de ADR-13 — nueva fila v1.3:**

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.3** | *(a fijar)* | AKVEZ Architecture Team | **Corrección de la columna «Contenido» de la fila A-6 en §6.2**, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4. **Ningún contenido decisional resulta afectado:** la semántica de escritura (§10.3), la Unidad de Registro (§11.1), las siete garantías (§12.3) y el catálogo de eventos (§13) permanecen íntegros. Ninguna otra fila del inventario se modifica. | La celda contradecía **PO-02 §3** *(orden 2)*, que declara que una Propuesta Comercial es *«la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa»* y que **«no es solo el texto»**. Conforme a **ADS-00 R-1 y R-3**, el documento de menor precedencia debe actualizarse. Detectado en COM-34 §5.2 y resuelto por autoridad en COM-36/1. |

---

# 4. Justificación

## 4.1 PO-02 §3 — la autoridad de producto *(orden 2)*

**Texto literal:**

> *«Una Propuesta Comercial es el artefacto completo producido para un contacto: **la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa**.»*
>
> **«No es solo el texto.»**

**Su justificación de producto, en el mismo §3:**

> *«Una propuesta conservada como texto suelto **no puede explicarse después**: nadie podrá saber qué perseguía, qué evidencia la sostenía ni bajo qué criterio se decidió.»*

**Y su regla 4:** *«Toda Propuesta queda vinculada a la **versión del criterio comercial** que la produjo.»*

> ### **«Asunto · mensaje · tono» es texto suelto con metadatos de forma — exactamente lo que PO-02 §3 declara insuficiente, y con la palabra que emplea: «no puede explicarse después».**

**Rango:** **ADS-00, Orden Oficial de Precedencia** sitúa **PO en orden 2**, con autoridad *«máxima sobre el dominio. **Deroga de hecho cualquier definición divergente**»*; **ADR en orden 4**. Y **ADS-00 R-2**: *«Un documento de categoría inferior **nunca podrá reinterpretar** a uno superior. Podrá desarrollarlo, detallarlo o aplicarlo. **Nunca redefinirlo**.»*

## 4.2 DDD-01 — la autoridad por concepto

**DDD-01 v1.1 §9.2**, tabla de autoridad:

| Concepto | Autoridad única | Nota literal |
| --- | --- | --- |
| **Entidades, invariantes, eventos y casos de uso comerciales** | **ADR-16** | *«Orden 4. **Es la autoridad del modelo de dominio**»* |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** | *«Catálogo cerrado de activos y eventos»* |

**DDD-01 §2.1**, fila `Proposal`:

| Concepto | Tipo | **Autoridad** | Desarrollado en |
| --- | --- | --- | --- |
| **Proposal** | Entidad · Aggregate Root | **ADR-16 §4.4** | PO-02 §3 · APS-18 §8 · **ADR-13 A-6** |

**DDD-01 §9.1**, la regla que las separa:

> *«**Autoridad** es quien decide que el concepto existe y **qué lo delimita**. **Desarrollo** es quien detalla su contenido **sin poder cambiar sus límites**… ante discrepancia, **prevalece la autoridad, y el documento de desarrollo es el defectuoso**.»*

> ### **Para `Proposal`, ADR-13 figura como «Desarrollado en», no como autoridad. Su celda de contenido cambió los límites del concepto — que es justo lo que §9.1 prohíbe al desarrollo.**

**Nota de alcance:** **la autoridad de ADR-13 es real y no se discute.** Sobre A-6 decide —y sigue decidiendo, sin corrección— que **existe**, que se escribe **al generarse** y que es **versionada**. **La columna «Contenido» describe el contenido de la entidad, que es materia de ADR-16.**

## 4.3 ADR-16 §4.4 — la autoridad arquitectónica

**Texto literal:**

> **Qué es.** *«El artefacto de **un** contacto: **estrategia, evidencia y texto** **(PO-02 §3)**.»*

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, momento de la secuencia, número de emisión)` |
| **Contenido** | La **estrategia** *(APS-18 §8.1)* · la **lista cerrada de hechos afirmables** · el **texto** · el **canal** · la versión del criterio |
| **Ciclo** | **Versionada.** Regenerar añade |

**Invariante P-I1:** *«**no es solo el texto** — sin estrategia y evidencia no puede explicarse después»*.

> **ADR-16 §4.4 cita a PO-02 §3 expresamente.** No es una decisión paralela: es **el desarrollo arquitectónico de una decisión de producto ya tomada**. Por eso no forma parte del conflicto.

## 4.4 Comparación final

| Elemento | PO-02 §3 *(orden 2)* | ADR-16 §4.4 | **ADR-13 §6.2 actual** | **Corregido** |
| --- | :-: | :-: | :-: | :-: |
| Estrategia | ✅ | ✅ | ❌ *(solo «tono»)* | ✅ |
| **Evidencia** | ✅ | ✅ | ❌ **Ausente** | ✅ |
| Texto | ✅ | ✅ | ✅ *(«mensaje»)* | ✅ |
| Canal | — | ✅ | ❌ | ✅ |
| Versión del criterio | ✅ *(regla 4)* | ✅ | ❌ | ✅ |
| Asunto | — | ❌ | ✅ | — |

---

# 5. Impacto de aplicar la corrección

## 5.1 En documentos

| Documento | Impacto |
| --- | :-: |
| **PO-02 §3** · **ADR-16 §4.4** · **APS-18 §8** · **DDD-01** | ✅ **Ninguno.** Coinciden entre sí |
| **ADR-13** §10, §11, §12, §13 | ✅ **Ninguno. Íntegros** |
| **ADR-13 §6.2**, demás filas | ✅ **Ninguno** |
| **ADR-08 §13** | ✅ Ninguno **por esta corrección** *(su enmienda es COM-34 §6.1, independiente)* |

## 5.2 En código · **ninguno inmediato**

| Fichero | Réplica de | Efecto |
| --- | --- | :-: |
| `shared/persistence/contracts/Proposal.ts` | **ADR-16 §4.4** | ✅ **Correcto. Sin cambios** |
| `shared/persistence/contracts/OutreachPitch.ts` | ADR-13 §6.2 *(defectuoso)* | ⚠️ Pierde respaldo canónico |
| `modules/pitch-generator/domain/OutreachPitch.ts` | ídem | ⚠️ ídem |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | ídem | ⚠️ ídem |

**Las 197 pruebas siguen verdes: ninguna depende de los tres ficheros heredados.**

> ### ⛔ **Aplicar esta corrección NO autoriza retirar el par heredado.**
>
> Disuelve el **obstáculo 2** de COM-34 §5.2 —esos ficheros dejan de replicar una fuente canónica—, pero **el obstáculo 1 sigue en pie: ADR-08 §13 continúa nombrando `OutreachPitchRepository` como trabajo pendiente**. La retirada requiere **su propia enmienda** *(COM-34 §6.1)*.

## 5.3 ⚠️ Alcance no auditado

**El inventario de §6.2 tiene doce filas. Solo se ha examinado A-6.**

**A-4** *(«Diagnóstico de presencia digital · carencias · oportunidades»)* y **A-5** *(«Puntuación · banda · explicación»)* podrían arrastrar el mismo desfase frente a sus autoridades. **No comprobado.** Esta propuesta **no lo afirma ni lo descarta**, y **no propone tocarlas**.

---

# 6. Quién debe aplicarla

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Redacta la corrección** | **AKVEZ Architecture Team** | `Responsable` de ADR-13 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADR-13 v1.2 en **GOV-01** |

> **Si corregir una celda de inventario exige nueva aprobación del Product Office o basta el registro del Architecture Team lo decide el procedimiento de gobernanza — no este documento.** Se señala porque el Historial de ADR-13 registra al Product Office como autoridad aprobadora, y **la v1.2 fue un «Cambio Menor conforme a APS-13 §9»**: existe precedente de enmienda acotada.

---

# 7. Referencias

**ADS-00 v1.3** — *Orden Oficial de Precedencia*, R-1, R-2, R-3, R-5 · **PO-02 v1.3** §3 · **APS-13** §9 *(cambio menor)* · **APS-18 v1.2** §8, §8.1 · **ADR-08 v1.2** §13 · **ADR-13 v1.2** §6.2, §10.3, §11.1, §12.3, §13, *Historial* · **ADR-16 v1.1** §4.4 *(P-I1)* · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **COM-34** §5.2, §6.1 · **COM-35/1** · **COM-36/1**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
