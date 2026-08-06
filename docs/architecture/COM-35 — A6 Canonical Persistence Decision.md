# COM-35 — Decisión de Fuente Canónica de A-6

| Campo | Valor |
| --- | --- |
| Código | COM-35 / 1 |
| Clasificación | **Resolución de conflicto documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Resuelto por jerarquía documentada.** La corrección **no se ha aplicado** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-35, tarea 1 — conflicto detectado en **COM-34 §5.2** |
| Relacionado | **COM-34** · COM-33 §4 |

> **Cero cambios de código. Cero documentos del Blueprint modificados.**
>
> **La contradicción no se resuelve aquí por inferencia: ya estaba resuelta por un documento de categoría superior.** Este documento lo localiza y lo demuestra.

---

# 1. Corrección del planteamiento

**COM-34 §5.2 lo planteó como un conflicto entre dos ADR y concluyó que ADS-00 R-4 era indeterminada.** *(Misma categoría, mismo estado, misma fecha.)*

**Esa conclusión era correcta y el planteamiento estaba incompleto.**

> ### **El conflicto real no es ADR-13 contra ADR-16. Es ADR-13 §6.2 contra PO-02 §3 — y ahí la jerarquía es inequívoca.**

**ADR-16 §4.4 no es parte del conflicto: coincide con PO-02 §3.**

---

# 2. Comparación de las tres fuentes

## 2.1 Qué dice cada una

| Documento | Categoría · **Orden** | Estado | Qué declara que es A-6 / `Proposal` |
| --- | --- | :-: | --- |
| **PO-02 §3** | **PO — orden 2** | ✅ `Approved` | *«El artefacto completo producido para un contacto: **la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa**»* · **«No es solo el texto.»** |
| **ADR-16 §4.4** | ADR — orden 4 | ✅ `Approved` | *«**estrategia, evidencia y texto** (PO-02 §3)»* · Contenido: la estrategia · la lista cerrada · el texto · el canal · la versión del criterio |
| **ADR-13 §6.2** | ADR — orden 4 | ✅ `Approved` | *«**Asunto · mensaje · tono**»* |

> **ADR-16 §4.4 cita a PO-02 §3 expresamente.** No es una decisión paralela: es el desarrollo arquitectónico de una decisión de producto ya tomada.

## 2.2 Dónde está exactamente la divergencia

| Elemento | PO-02 §3 | ADR-16 §4.4 | ADR-13 §6.2 |
| --- | :-: | :-: | :-: |
| **Estrategia** | ✅ *«la estrategia que lo decide»* | ✅ | ❌ *(solo «tono»)* |
| **Evidencia** | ✅ *«la evidencia que lo sostiene»* | ✅ lista cerrada | ❌ **Ausente** |
| **Texto** | ✅ *«el texto que lo expresa»* | ✅ | ✅ *(«mensaje»)* |
| **Canal** | — | ✅ | ❌ |
| **Versión del criterio** | ✅ regla 4 | ✅ | ❌ |
| **Asunto** | — | ❌ | ✅ |

**PO-02 §3 no solo enumera: excluye.** *«No es solo el texto»* es una afirmación negativa explícita, y su justificación de producto la razona: *«Una propuesta conservada como texto suelto **no puede explicarse después**»*.

> **ADR-13 §6.2 describe A-6 como texto suelto con metadatos de forma** —asunto, mensaje, tono—. **Es precisamente lo que PO-02 §3 declara insuficiente.**

---

# 3. Qué regla resuelve, y por qué no es inferencia

## 3.1 La jerarquía es explícita

**ADS-00 — Orden Oficial de Precedencia:**

> *«En caso de conflicto entre dos documentos, **prevalece el de menor número de orden**.»*

| Orden | Categoría | Autoridad declarada |
| :-: | --- | --- |
| **2** | **PO — Product Decision** | *«**Máxima sobre el dominio. Deroga de hecho cualquier definición divergente**»* |
| 4 | ADR — Architecture Decision Record | *«Vinculante sobre la implementación»* |

**ADS-00 R-2:** *«Un documento de categoría inferior **nunca podrá reinterpretar** a uno superior. Podrá desarrollarlo, detallarlo o aplicarlo. **Nunca redefinirlo**.»*

> ### **ADR-13 §6.2 redefine A-6 en términos que PO-02 §3 excluye. Es exactamente lo que R-2 prohíbe.**

## 3.2 Y la autoridad por concepto lo confirma por una segunda vía

**DDD-01 §9.2** —`Approved`, glosario **ratificado** como vocabulario obligatorio— asigna:

| Concepto | Autoridad única | Nota del propio DDD-01 |
| --- | --- | --- |
| **Entidades, invariantes, eventos y casos de uso comerciales** | **ADR-16** | *«**Es la autoridad del modelo de dominio**»* |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** | *«Catálogo cerrado de activos y eventos»* |

**DDD-01 §2.1**, fila `Proposal`:

| Concepto | **Autoridad** | Desarrollado en |
| --- | --- | --- |
| **Proposal** | **ADR-16 §4.4** | PO-02 §3 · APS-18 §8 · **ADR-13 A-6** |

**Y DDD-01 §9.1 fija la regla que las separa:**

> *«**Autoridad** es quien decide que el concepto existe y **qué lo delimita**. **Desarrollo** es quien detalla su contenido **sin poder cambiar sus límites**… ante discrepancia, **prevalece la autoridad, y el documento de desarrollo es el defectuoso**.»*

> ### **ADR-13 figura como «Desarrollado en», no como autoridad, para `Proposal`.**
>
> **La autoridad de ADR-13 es real y no se discute: decide *qué se persiste, cuándo y con qué semántica*.** Sobre A-6 decide —y sigue vigente sin discusión— que **existe**, que se escribe **al generarse** y que es **versionada**. **La columna «Contenido» de su §6.2 describe el contenido de la entidad, que es materia de ADR-16.**

## 3.3 Las dos vías convergen

| Vía | Fundamento | Conclusión |
| :-: | --- | --- |
| **A** | ADS-00, orden de precedencia + R-2 | **PO-02 §3 prevalece.** ADR-13 §6.2 debe corregirse |
| **B** | DDD-01 §9.1 y §9.2, autoridad por concepto | **ADR-16 §4.4 es la autoridad.** ADR-13 §6.2 es desarrollo defectuoso |

**Dos rutas documentales independientes, misma conclusión. Ninguna requiere inferir nada.**

---

# 4. Hasta dónde llega este documento

**ADS-00 R-5:** *«Una IA nunca resolverá un conflicto documental por cuenta propia. Deberá señalarlo y **aplicar esta jerarquía únicamente para determinar qué documento debe corregirse**.»*

> **Es exactamente lo que se ha hecho, y es todo lo que se hace.** Se determina **cuál es el documento defectuoso**. **No se corrige.**

**ADS-00 R-1:** *«La precedencia resuelve conflictos, no sustituye documentos. Que un documento prevalezca **no anula al otro. Obliga a corregirlo**.»*

---

# 5. Decisión propuesta

> ## **Fuente canónica única de A-6: `ADR-16 §4.4`, en desarrollo de `PO-02 §3`.**

| # | Enunciado |
| :-: | --- |
| **1** | **`PO-02 §3` es la decisión de producto** sobre qué es una Propuesta Comercial. Orden 2. **No se toca** |
| **2** | **`ADR-16 §4.4` es la autoridad arquitectónica** del contenido de la entidad y de su identidad `(Lead, momento, número de emisión)`. **No se toca** |
| **3** | **`ADR-13` conserva íntegra su autoridad** sobre qué se persiste, cuándo y con qué semántica: A-6 existe, se escribe al generarse y es **versionada** *(§10.3 V-1)*. **No se toca** |
| **4** | **`ADR-13 §6.2`, columna «Contenido» de la fila A-6, es el documento defectuoso** y debe corregirse para remitir a ADR-16 §4.4 |

## 5.1 Corrección propuesta — **no aplicada**

| | Texto de la fila A-6 en ADR-13 §6.2 |
| --- | --- |
| **Hoy** | `| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |` |
| **Propuesto** | `| **A-6** | **Propuesta comercial** | La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |` |

**Cambia una celda. No cambia la semántica de escritura, que es la autoridad de ADR-13.**

**Registro exigido por ADS-00 R-3** — Historial de Versiones de ADR-13, v1.3, motivo: *«Corrección de la columna «Contenido» de A-6 en §6.2, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4 y contradecía PO-02 §3. Ningún contenido decisional de este ADR resulta afectado: la semántica de escritura, el versionado y el catálogo de eventos permanecen íntegros.»*

---

# 6. Impacto

## 6.1 En el código — **ninguno hoy, uno mañana**

| Fichero | Réplica de | Efecto de la decisión |
| --- | --- | --- |
| `shared/persistence/contracts/Proposal.ts` | **ADR-16 §4.4** | ✅ **Correcto.** Réplica de la fuente canónica. **Sin cambios** |
| `shared/persistence/contracts/OutreachPitch.ts` | **ADR-13 §6.2** *(defectuoso)* | ⚠️ **Queda sin fuente canónica que lo respalde** |
| `modules/pitch-generator/domain/OutreachPitch.ts` | ídem | ⚠️ ídem |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | ídem | ⚠️ ídem |

> ### **Consecuencia directa sobre COM-34: el obstáculo 2 desaparece.**
>
> COM-34 §5.2 no podía proponer la retirada del par heredado porque **`contracts/OutreachPitch.ts` replicaba fielmente un ADR `Approved`**. Con ADR-13 §6.2 identificado como defectuoso, **ese respaldo se disuelve**: el par heredado deja de tener fuente canónica.
>
> **El obstáculo 1 —ADR-08 §13— sigue en pie.** La retirada continúa requiriendo su enmienda. **Nada se elimina en este sprint.**

## 6.2 En los documentos

| Documento | Impacto |
| --- | :-: |
| **PO-02** · **ADR-16** · **APS-18** · **DDD-01** | **Ninguno.** Coinciden entre sí |
| **ADR-13** | **Una celda de §6.2.** §10, §11, §12, §13 **íntegros** |
| **ADR-08 §13** | **Ninguno por esta decisión.** Su enmienda es COM-34 §6.1, independiente |
| **COM-34 §5.2** | **Superado.** El conflicto queda tipificado y con documento defectuoso identificado |

## 6.3 ⚠️ Alcance no auditado

**El inventario de ADR-13 §6.2 tiene doce filas y solo se ha examinado A-6.**

**A-4** *(«Diagnóstico de presencia digital · carencias · oportunidades»)* y **A-5** *(«Puntuación · banda · explicación»)* podrían arrastrar el mismo desfase frente a sus autoridades respectivas. **No se ha comprobado, y este documento no lo afirma ni lo descarta.** Registrado en §8.

---

# 7. Qué se pide

| # | Acción | Quién | Fundamento |
| :-: | --- | --- | --- |
| **1** | **Ratificar que la fuente canónica de A-6 es ADR-16 §4.4**, en desarrollo de PO-02 §3 | **Architecture Team** | §5 |
| **2** | **Aplicar la corrección de §5.1 a ADR-13 §6.2**, con su registro en el Historial de Versiones | **Architecture Team** — es el `Responsable` de ADR-13 | ADS-00 R-1, R-3 |
| **3** | **Decidir si se audita el resto del inventario de ADR-13 §6.2** | **Architecture Team** | §6.3 |

> **ADR-13 fue aprobado por el Product Office** *(sprint GOV-01)*. **Si la corrección de una celda de inventario exige nueva aprobación del Product Office o basta con el registro del Architecture Team, lo decide el procedimiento de gobernanza — no este documento.**

---

# 8. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se ratifica la decisión y no se corrige ADR-13 §6.2.** La contradicción sobrevive con un documento que la declara resuelta — **peor que hoy**, porque parecerá cerrada | 🔴 Alta |
| **2** | **El resto del inventario §6.2 arrastra el mismo desfase** y nadie lo comprueba *(§6.3)* | 🟡 Media |
| **3** | **Se interpreta que esta decisión autoriza la retirada del par heredado.** **No lo hace:** ADR-08 §13 sigue pendiente *(COM-34 §6.1)* | 🟡 Media |

---

# 9. Referencias

**ADS-00 v1.3** — *Orden Oficial de Precedencia*, R-1, R-2, R-3, R-5 · **PO-02 v1.3** §3 · **ADR-13 v1.2** §6.2, §10.3, §12, §13 · **ADR-16 v1.1** §4.4 · **APS-18** §8 · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **ADR-08 v1.2** §13 · **COM-33** §4 · **COM-34** §4, §5.2, §6.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
