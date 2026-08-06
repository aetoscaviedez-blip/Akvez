# COM-36 — Resolución Canónica de A-6

| Campo | Valor |
| --- | --- |
| Código | COM-36 / 1 |
| Clasificación | **Resolución de conflicto documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Resuelto por autoridad documentada.** Ninguna corrección aplicada |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-36, tarea 1 |
| Antecedentes | **COM-34 §5.2** *(detección)* · **COM-35/1** *(reencuadre)* |

> **No se ha modificado ningún ADR. No se ha tocado código.**

---

# 1. Autoridad utilizada

**Cinco documentos consultados, en el orden que el sprint exige.**

| # | Documento | Qué aporta | Rango |
| :-: | --- | --- | --- |
| **1** | **ADS-00 v1.3** — *Orden Oficial de Precedencia*, R-1 a R-5 | La regla que resuelve | Estándar documental, fuera de la cadena |
| **2** | **PO-02 v1.3 §3** | **Qué es una Propuesta Comercial** | **PO — orden 2.** *«Máxima sobre el dominio. Deroga de hecho cualquier definición divergente»* |
| **3** | **DDD-01 v1.1 §9.1, §9.2, §2.1** | **Quién es autoridad de cada concepto** | Sin autoridad propia. *«Nombra; no decide»* — **remite** a las anteriores |
| **4** | **ADR-16 v1.1 §4.4** | Contenido e identidad de `Proposal` | ADR — orden 4 |
| **5** | **ADR-13 v1.2 §6.2, §10.3** | Inventario de estado durable y semántica de escritura | ADR — orden 4 |

## 1.1 Texto literal de la autoridad decisoria

**PO-02 §3** *(orden 2)*:

> *«Una Propuesta Comercial es el artefacto completo producido para un contacto: **la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa**.»*
>
> **«No es solo el texto.»**

**Su justificación de producto**, en el mismo §3:

> *«Una propuesta conservada como texto suelto **no puede explicarse después**: nadie podrá saber qué perseguía, qué evidencia la sostenía ni bajo qué criterio se decidió.»*

---

# 2. Conflicto detectado

## 2.1 Enunciado exacto

| Documento | Orden | Estado | Qué declara que contiene A-6 |
| --- | :-: | :-: | --- |
| **PO-02 §3** | **2** | `Approved` | Estrategia · evidencia · texto. **«No es solo el texto»** |
| **ADR-16 §4.4** | 4 | `Approved` | Estrategia · lista cerrada de hechos afirmables · texto · canal · versión del criterio |
| **ADR-13 §6.2** | 4 | `Approved` | **Asunto · mensaje · tono** |

## 2.2 Dónde está la divergencia

| Elemento | PO-02 §3 | ADR-16 §4.4 | ADR-13 §6.2 |
| --- | :-: | :-: | :-: |
| Estrategia | ✅ | ✅ | ❌ *(solo «tono»)* |
| **Evidencia** | ✅ | ✅ | ❌ **Ausente** |
| Texto | ✅ | ✅ | ✅ *(«mensaje»)* |
| Canal | — | ✅ | ❌ |
| Versión del criterio | ✅ *(regla 4)* | ✅ | ❌ |

> ### **ADR-13 §6.2 describe A-6 como texto suelto con metadatos de forma. Es exactamente lo que PO-02 §3 declara insuficiente.**

## 2.3 Corrección del planteamiento anterior

**COM-34 §5.2 lo planteó como ADR-13 contra ADR-16 y concluyó que ADS-00 R-4 era indeterminada** —misma categoría, mismo estado, misma fecha—. **La conclusión era correcta y el planteamiento incompleto:**

> **ADR-16 §4.4 no es parte del conflicto.** Coincide con PO-02 §3 y **lo cita expresamente**: *«estrategia, evidencia y texto **(PO-02 §3)**»*. Es el desarrollo arquitectónico de una decisión de producto ya tomada.
>
> **El conflicto es ADR-13 §6.2 contra PO-02 §3 — y ahí la jerarquía no es indeterminada.**

---

# 3. Decisión final

## 3.1 Qué documento tiene autoridad

> ## **Autoridad de producto: `PO-02 §3`. Autoridad arquitectónica: `ADR-16 §4.4`, en desarrollo de la anterior.**

**Dos vías documentales independientes lo establecen:**

### Vía A — precedencia de categoría *(ADS-00)*

**ADS-00, Orden Oficial:** *«En caso de conflicto entre dos documentos, **prevalece el de menor número de orden**.»* **PO es orden 2; ADR es orden 4.**

**ADS-00 R-2:** *«Un documento de categoría inferior **nunca podrá reinterpretar** a uno superior. Podrá desarrollarlo, detallarlo o aplicarlo. **Nunca redefinirlo**.»*

### Vía B — autoridad por concepto *(DDD-01)*

**DDD-01 §9.2** asigna:

| Concepto | Autoridad única |
| --- | --- |
| **Entidades, invariantes, eventos y casos de uso comerciales** | **ADR-16** — *«**es la autoridad del modelo de dominio**»* |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** |

**DDD-01 §2.1**, fila `Proposal`: **Autoridad → `ADR-16 §4.4`** · Desarrollado en → *PO-02 §3 · APS-18 §8 · **ADR-13 A-6***.

**DDD-01 §9.1:** *«**Autoridad** es quien decide que el concepto existe y **qué lo delimita**. **Desarrollo** es quien detalla su contenido **sin poder cambiar sus límites**… ante discrepancia, **prevalece la autoridad, y el documento de desarrollo es el defectuoso**.»*

> **Las dos vías convergen sin inferencia.**

## 3.2 ⚠️ Qué documento queda `Superseded`

> ## **Ninguno.**

**El sprint pregunta cuál queda superseded. La respuesta documentada es que ninguno, y conviene que conste por qué:**

| Razón | Fundamento |
| --- | --- |
| **`Superseded` no es un estado del catálogo.** ADS-00 admite exactamente cinco: `Draft`, `Review`, `Approved`, `Deprecated`, `Archived` | ADS-00 *Estados del Documento* · ADR-05 v1.4 |
| **`Deprecated` significa «documento reemplazado»** y se aplica al documento entero. **ADR-13 no está reemplazado**: su §10, §11, §12 y §13 son autoridad vigente e indiscutida | ADS-00 |
| **La precedencia no anula: obliga a corregir** | **ADS-00 R-1**: *«Que un documento prevalezca **no anula al otro. Obliga a corregirlo**»* |

> ### **Lo que queda defectuoso es una celda, no un documento.** ADR-13 conserva íntegra su autoridad sobre A-6 en lo que le corresponde: que **existe**, que se escribe **al generarse** y que es **versionada** *(§10.3 V-1)*.

## 3.3 Qué documento debe modificarse

> ## **`ADR-13 §6.2`, fila A-6, columna «Contenido».**

**Corrección propuesta — NO aplicada, conforme a *«No modificar ADR todavía»*:**

| | Texto |
| --- | --- |
| **Hoy** | `| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |` |
| **Propuesto** | `| **A-6** | **Propuesta comercial** | La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |` |

**Registro exigido por ADS-00 R-3** — Historial de ADR-13, **v1.3**:

> *«Corrección de la columna «Contenido» de la fila A-6 en §6.2, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4 y contradecía PO-02 §3. **Ningún contenido decisional resulta afectado**: la semántica de escritura (§10.3), las garantías (§12.3) y el catálogo de eventos (§13) permanecen íntegros.»*

## 3.4 Hasta dónde llega esta resolución

**ADS-00 R-5:** *«Una IA nunca resolverá un conflicto documental por cuenta propia. Deberá señalarlo y **aplicar esta jerarquía únicamente para determinar qué documento debe corregirse**.»*

> **Se ha determinado cuál es el documento defectuoso. No se ha corregido.** Es el límite exacto que R-5 autoriza.

---

# 4. Documentos afectados

| Documento | Impacto | Acción |
| --- | :-: | --- |
| **PO-02 §3** | ✅ Ninguno | Es la autoridad. **No se toca** |
| **ADR-16 §4.4** | ✅ Ninguno | Coincide con PO-02. **No se toca** |
| **APS-18 §8** · **DDD-01** | ✅ Ninguno | Coinciden |
| **ADR-13 §6.2** | ⚠️ **Una celda** | Corregir *(§3.3)* + registro v1.3 |
| **ADR-13** §10, §11, §12, §13 | ✅ Ninguno | **Íntegros** |
| **ADR-08 §13** | ✅ Ninguno **por esta resolución** | Su enmienda es **COM-34 §6.1**, independiente |

---

# 5. Impacto esperado

## 5.1 En el código — ninguno hoy

| Fichero | Réplica de | Efecto |
| --- | --- | :-: |
| `shared/persistence/contracts/Proposal.ts` | **ADR-16 §4.4** | ✅ **Correcto. Sin cambios** |
| `shared/persistence/contracts/OutreachPitch.ts` | ADR-13 §6.2 *(defectuoso)* | ⚠️ Pierde respaldo canónico |
| `modules/pitch-generator/domain/OutreachPitch.ts` | ídem | ⚠️ ídem |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | ídem | ⚠️ ídem |

**Las 197 pruebas siguen verdes. Ninguna depende de los tres ficheros heredados.**

## 5.2 Sobre la retirada del par heredado

> **El obstáculo 2 de COM-34 §5.2 se disuelve:** `OutreachPitch.ts` ya no replica una fuente canónica, porque la fuente que replicaba es la celda defectuosa.
>
> ### ⛔ **El obstáculo 1 sigue en pie. ADR-08 §13 continúa nombrando `OutreachPitchRepository` como trabajo pendiente.**
>
> **La retirada sigue requiriendo la enmienda de COM-34 §6.1. Nada se elimina en este sprint.**

## 5.3 Alcance no auditado

**El inventario de ADR-13 §6.2 tiene doce filas. Solo se ha examinado A-6.**

**A-4** *(«Diagnóstico de presencia digital · carencias · oportunidades»)* y **A-5** *(«Puntuación · banda · explicación»)* podrían arrastrar el mismo desfase frente a sus autoridades. **No comprobado. Este documento no lo afirma ni lo descarta.**

---

# 6. Qué se pide

| # | Acción | Quién |
| :-: | --- | --- |
| **1** | **Ratificar** que la autoridad de A-6 es PO-02 §3, desarrollada por ADR-16 §4.4 | **Architecture Team** |
| **2** | **Aplicar la corrección de §3.3** a ADR-13 §6.2, con registro v1.3 | **Architecture Team** *(`Responsable` de ADR-13)* |
| **3** | **Decidir si se audita el resto del inventario §6.2** *(§5.3)* | **Architecture Team** |

> **ADR-13 fue aprobado por el Product Office** *(GOV-01)*. **Si corregir una celda de inventario exige nueva aprobación del Product Office o basta el registro del Architecture Team lo decide el procedimiento de gobernanza, no este documento.**

---

# 7. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se ratifica y no se corrige ADR-13 §6.2.** La contradicción sobrevive con un documento que la declara resuelta — **peor que hoy** | 🔴 Alta |
| **2** | **Se lee esta resolución como autorización para retirar el par heredado.** **No lo es** *(§5.2)* | 🟡 Media |
| **3** | **El resto del inventario §6.2 arrastra el mismo desfase** y nadie lo comprueba | 🟡 Media |

---

# 8. Referencias

**ADS-00 v1.3** — *Orden Oficial de Precedencia*, *Estados del Documento*, R-1, R-2, R-3, R-4, R-5 · **PO-02 v1.3** §3 · **APS-18 v1.2** §8 · **ADR-05 v1.4** *(precedente de estados)* · **ADR-08 v1.2** §13 · **ADR-13 v1.2** §6.2, §10.3, §12.3, §13 · **ADR-16 v1.1** §4.4 · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **COM-33** §4 · **COM-34** §5.2, §6.1 · **COM-35/1**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
