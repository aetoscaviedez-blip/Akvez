# COM-38 — Aplicación de la Corrección de ADR-13 §6.2 A-6

| Campo | Valor |
| --- | --- |
| Código | COM-38 / 2 |
| Clasificación | **Propuesta de corrección documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Preparada. NO aplicada** — a la espera de autorización |
| Fecha | 2026-08-04 |
| Documento a corregir | **ADR-13 v1.2 §6.2**, fila **A-6**, columna **«Contenido»** |
| Antecedentes | COM-34 §5.2 · COM-35/1 · COM-36/1 · COM-37/3 |

> **ADR-13 no ha sido editado.** Nada marcado `Deprecated`, nada eliminado, **cero cambios de código**.

---

# 1. Alcance — una celda

| | |
| --- | --- |
| **Se corrige** | Fila **A-6**, columna **«Contenido»**, tabla de **§6.2** |
| **NO se corrige** | La columna «Momento de escritura» de esa fila · §10.3 · §11.1 · §12.3 · §13 · **ninguna otra fila del inventario** |
| **NO se retira** | **ADR-13 conserva su autoridad íntegra.** No `Deprecated`, no archivado, no reemplazado |

> **ADS-00 R-1:** *«La precedencia resuelve conflictos, no sustituye documentos. Que un documento prevalezca **no anula al otro. Obliga a corregirlo**.»*

---

# 2. Texto actual

```
| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |
```

| Columna | Valor | Veredicto |
| --- | --- | :-: |
| # | **A-6** | ✅ |
| Activo | **Propuesta comercial** | ✅ |
| **Contenido** | **Asunto · mensaje · tono** | 🔴 **Defectuoso** |
| Momento de escritura | Al generarse. **Versionada** | ✅ **No se toca** |

---

# 3. Texto propuesto

```
| **A-6** | **Propuesta comercial** | La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |
```

**Se añade la remisión a la autoridad para que el desfase no pueda repetirse.**

## 3.1 Registro exigido por ADS-00 R-3 — Historial de ADR-13, v1.3

> **Corrección de la columna «Contenido» de la fila A-6 en §6.2**, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4. **Ningún contenido decisional resulta afectado:** la semántica de escritura (§10.3), la Unidad de Registro (§11.1), las siete garantías (§12.3) y el catálogo de eventos (§13) permanecen íntegros. Ninguna otra fila del inventario se modifica.
>
> **Motivo:** la celda contradecía **PO-02 §3** *(orden 2)*, que declara que una Propuesta Comercial es *«la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa»* y que **«no es solo el texto»**. Conforme a **ADS-00 R-1 y R-3**, el documento de menor precedencia debe actualizarse. Detectado en COM-34 §5.2; resuelto por autoridad en COM-36/1.

---

# 4. Justificación

## 4.1 PO-02 §3 — autoridad de producto, **orden 2**

> *«Una Propuesta Comercial es el artefacto completo producido para un contacto: **la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa**.»*
>
> **«No es solo el texto.»**
>
> *«Una propuesta conservada como texto suelto **no puede explicarse después**: nadie podrá saber qué perseguía, qué evidencia la sostenía ni bajo qué criterio se decidió.»*

**Regla 4:** *«Toda Propuesta queda vinculada a la **versión del criterio comercial** que la produjo.»*

> ### **«Asunto · mensaje · tono» es texto suelto con metadatos de forma — exactamente lo que PO-02 §3 declara insuficiente, y con sus mismas palabras.**

**Rango:** **ADS-00** sitúa **PO en orden 2** —autoridad *«máxima sobre el dominio. **Deroga de hecho cualquier definición divergente**»*— y **ADR en orden 4**. **R-2:** *«Un documento de categoría inferior **nunca podrá reinterpretar** a uno superior… **Nunca redefinirlo**.»*

## 4.2 DDD-01 — autoridad por concepto

**§9.2:**

| Concepto | Autoridad única |
| --- | --- |
| **Entidades, invariantes, eventos y casos de uso comerciales** | **ADR-16** — *«es la autoridad del modelo de dominio»* |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** |

**§2.1**, fila `Proposal`: **Autoridad → ADR-16 §4.4** · *Desarrollado en* → PO-02 §3 · APS-18 §8 · **ADR-13 A-6**.

**§9.1:** *«**Autoridad** es quien decide que el concepto existe y **qué lo delimita**. **Desarrollo** es quien detalla su contenido **sin poder cambiar sus límites**… ante discrepancia, **prevalece la autoridad, y el documento de desarrollo es el defectuoso**.»*

> ### **Para `Proposal`, ADR-13 figura como «Desarrollado en», no como autoridad. Su celda de contenido cambió los límites del concepto — justo lo que §9.1 prohíbe al desarrollo.**

**Alcance:** la autoridad de ADR-13 **es real y no se discute**. Sobre A-6 decide —y sigue decidiendo— que **existe**, que se escribe **al generarse** y que es **versionada**.

## 4.3 ADR-16 §4.4 — autoridad arquitectónica

> **Qué es.** *«El artefacto de **un** contacto: **estrategia, evidencia y texto** **(PO-02 §3)**.»*

| Aspecto | Decisión |
| --- | --- |
| **Identidad** | `(Lead, momento de la secuencia, número de emisión)` |
| **Contenido** | La estrategia *(APS-18 §8.1)* · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio |
| **Ciclo** | **Versionada.** Regenerar añade |

**P-I1:** *«**no es solo el texto** — sin estrategia y evidencia no puede explicarse después»*.

> **ADR-16 §4.4 cita a PO-02 §3 expresamente: no es decisión paralela, es su desarrollo arquitectónico. Por eso no forma parte del conflicto.**

## 4.4 Comparación

| Elemento | PO-02 §3 | ADR-16 §4.4 | **ADR-13 §6.2 hoy** | **Corregido** |
| --- | :-: | :-: | :-: | :-: |
| Estrategia | ✅ | ✅ | ❌ *(solo «tono»)* | ✅ |
| **Evidencia** | ✅ | ✅ | ❌ **Ausente** | ✅ |
| Texto | ✅ | ✅ | ✅ *(«mensaje»)* | ✅ |
| Canal | — | ✅ | ❌ | ✅ |
| Versión del criterio | ✅ | ✅ | ❌ | ✅ |
| Asunto | — | ❌ | ✅ | — |

---

# 5. Documentos afectados

| Documento | Impacto | Acción |
| --- | :-: | --- |
| **PO-02 §3** | ✅ Ninguno | Es la autoridad. **No se toca** |
| **ADR-16 §4.4** | ✅ Ninguno | Coincide. **No se toca** |
| **APS-18 §8** · **DDD-01** | ✅ Ninguno | Coinciden |
| **ADR-13 §6.2**, fila A-6 | ⚠️ **Una celda** | Corregir + registro v1.3 |
| **ADR-13** §10, §11, §12, §13 | ✅ Ninguno | **Íntegros** |
| **ADR-13 §6.2**, otras 11 filas | ✅ Ninguno **por esta corrección** | ⚠️ **No auditadas** — §6.3 |
| **ADR-08 §13** | ✅ Ninguno | Su enmienda es **COM-34 §6.1**, independiente |
| **ADS-01 §3.2** · **ARCH-01** | ✅ Ninguno | No describen el contenido de A-6 |
| **INDEX.md** | ✅ **Ninguno** | Una corrección de celda **no altera el catálogo** |

---

# 6. Impacto

## 6.1 En código · **ninguno inmediato**

| Fichero | Réplica de | Efecto |
| --- | --- | :-: |
| `shared/persistence/contracts/Proposal.ts` | **ADR-16 §4.4** | ✅ **Correcto. Sin cambios** |
| `shared/persistence/contracts/OutreachPitch.ts` | ADR-13 §6.2 *(defectuoso)* | ⚠️ Pierde respaldo canónico |
| `modules/pitch-generator/domain/OutreachPitch.ts` | ídem | ⚠️ ídem |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | ídem | ⚠️ ídem |

**197/197 se mantienen: ninguna prueba depende de los tres ficheros heredados.**

## 6.2 ⛔ Lo que esta corrección NO autoriza

> **Disuelve el obstáculo 2 de COM-34 §5.2** —esos ficheros dejan de replicar una fuente canónica—, **pero NO autoriza retirarlos.**
>
> **ADR-08 §13 sigue nombrando `OutreachPitchRepository` como trabajo pendiente.** La retirada requiere **su propia enmienda** *(COM-34 §6.1)*, que es un acto distinto.

## 6.3 ⚠️ Alcance no auditado

**El inventario de §6.2 tiene doce filas. Solo A-6 se ha examinado.**

**A-4** *(«Diagnóstico de presencia digital · carencias · oportunidades»)* y **A-5** *(«Puntuación · banda · explicación»)* podrían arrastrar el mismo desfase frente a sus autoridades. **No comprobado.** Esta propuesta **no lo afirma, no lo descarta y no propone tocarlas**.

---

# 7. Quién debe aplicarla

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Redacta** | **AKVEZ Architecture Team** | `Responsable` de ADR-13 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADR-13 v1.2 en **GOV-01** |

> **Precedente de enmienda acotada:** la propia v1.2 se registró como **«Cambio Menor conforme a APS-13 §9»**.

## 7.1 Recomendación operativa

> ### **Tres propuestas abiertas tocan ADR-13. Conviene agruparlas en una sola enmienda v1.3:**
>
> | # | Propuesta | Sección |
> | :-: | --- | --- |
> | 1 | **Corrección de la celda A-6** | §6.2 |
> | 2 | **Criterio de vigencia V-2** | §10.3 — COM-38/3 |
> | 3 | **Garantías G-8/G-9/G-10** | §12.3 — COM-38/4 |
>
> **Tres actos separados sobre el mismo documento multiplican el registro sin aportar nada.**

---

# 8. Referencias

**ADS-00 v1.3** — *Orden de Precedencia*, R-1, R-2, R-3, R-5 · **PO-02 v1.3** §3 · **APS-13** §9 · **APS-18 v1.2** §8, §8.1 · **ADR-08 v1.2** §13 · **ADR-13 v1.2** §6.2, §10.3, §11.1, §12.3, §13, *Historial* · **ADR-16 v1.1** §4.4 · **ADS-01 v1.4** §3.2 · **ARCH-01 v1.3** · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **COM-34** §5.2, §6.1 · **COM-35/1** · **COM-36/1** · **COM-37/3**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
