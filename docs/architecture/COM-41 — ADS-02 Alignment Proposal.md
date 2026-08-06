# COM-41 — Propuesta de Alineación de ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-41 / A |
| Clasificación | **Auditoría + propuesta de corrección documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propuesta redactada. ADS-02 NO modificado** |
| Fecha | 2026-08-04 |
| Documento auditado | **ADS-02 v1.1 §7** — *Compatibilidad con ADR-13* |
| Antecedentes | COM-40/1 · COM-40/2 |

> **`docs/blueprint/` no ha sido modificado.**
>
> **Ninguna corrección propuesta crea garantías, requisitos ni eventos nuevos. Todas sincronizan ADS-02 con decisiones ya aprobadas.**

---

# 1. Auditoría completa de ADS-02 §7 — once filas

**Cada fila contrastada contra ADR-13 v1.3, PO-02 y DDD-01. Sin asumir equivalencias.**

| # | Fila | Referencia | Veredicto |
| :-: | --- | --- | :-: |
| 1 | Unidad de Registro atómica | §11.1 | ✅ Vigente |
| 2 | Reconciliación atómica | §11.1 · §9.5 | ✅ Vigente |
| 3 | Idempotencia del Registro | §11.3 | ✅ Vigente |
| 4 | Registrar · Actualizar · Versionar | §10.1 | ✅ Vigente |
| 5 | Ninguna destrucción de conocimiento | §10.2 | ✅ Vigente |
| **6** | **Versión vigente distinguible** | §10.3, V-2 | 🔴 **DIVERGENTE — D-1** |
| 7 | El Score conserva su perfil de usuario | §10.3, V-4 | ✅ Vigente |
| 8 | Historial de solo crecimiento | §12.1, E-5 | ⚠️ **Referencia dudosa — D-4** |
| **9** | **Siete garantías G-1 a G-7** | §12.3 | 🔴 **DESACTUALIZADA — D-2** |
| 10 | Independencia del motor | §12.4 | ✅ Vigente |
| **11** | **Catálogo cerrado de eventos** | §13.4 | 🔴 **DESACTUALIZADA — D-3** |

## 1.1 Cobertura de Proposal y activos comerciales · 🔴 **inexistente**

**Búsqueda exhaustiva sobre ADS-02 completo:**

| Término | Ocurrencias |
| --- | :-: |
| `A-6` · `A-11` · `A-12` | **0** |
| `Propuesta` · `Diagnóstico` · `Secuencia` | **0** |
| `comercial` | **1** — y es una nota sobre `NULL`, ajena a los activos |

> ### **ADS-02 no menciona en ningún punto los tres activos comerciales.**
>
> **No es un defecto de §7:** ADS-02 v1.1 es del **2026-07-29** y **ADR-13 v1.2 —que incorporó A-11 y A-12 al inventario— se actualizó el 2026-07-30**. **ADS-02 nunca se resincronizó tras aquella enmienda.**
>
> **Ésta es la raíz común de D-2, D-3 y de la Capa B de F-2.**

---

# 2. Divergencia D-1 — criterio de vigencia

## 2.1 Fila actual *(línea 172)*

```
| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |
```

## 2.2 Problema detectado

| Documento | Qué dice |
| --- | --- |
| **ADR-13 v1.3 §10.3 V-2** | *«La vigente es la de **mayor número de emisión (`issue`)**… **`issuedAt` es metadato temporal y NO determina la vigencia**»* |
| **ADS-02 §7** | *«**Marca temporal** por emisión; la vigente es **la más reciente**»* |

**Y la fila conflaciona dos reglas distintas:**

| Fragmento | Regla que satisface | Veredicto |
| --- | --- | :-: |
| *«Marca temporal por emisión»* | **V-3** — *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* | ✅ **Correcto. Debe conservarse** |
| *«la vigente es la más reciente»* | **V-2** | 🔴 **Contrario a la regla vigente** |

> ### ⚠️ **`ADS-02 §7` no tiene fila propia para V-3.** Sustituir el texto sin más **eliminaría la única constancia de la conservación temporal**, que V-3 sigue exigiendo. **Hay que desdoblar, no reemplazar.**

## 2.3 Autoridad que exige el cambio

**`ADR-13 v1.3 §10.3 V-2`** — `Approved` 2026-08-04.

**ADS-02 declara en su cabecera: *«Gobernado por **ADR-13** · ADR-05 · ADR-08 · ADR-12»*.** Conforme a **ADS-00 R-1**, *«que un documento prevalezca no anula al otro: obliga a corregirlo»*.

## 2.4 Propuesta exacta — **dos filas en lugar de una**

```
| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión (`issue`) por fila.** La vigente es la de **mayor `issue` dentro de su clave de identidad** — no la de marca temporal más reciente. Consulta por `MAX(issue)` sobre la clave, con índice compuesto |
| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas `issued_at` y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |
```

> ✅ **Ambas responsabilidades se conservan.** V-2 gana criterio explícito; V-3 gana fila propia, que no tenía.

---

# 3. Divergencia D-2 — número de garantías

## 3.1 Fila actual

```
| **Siete garantías G-1 a G-7** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad — es la garantía central.** G-7: relación uno a muchos de referencias de origen |
```

## 3.2 Problema detectado

**ADR-13 v1.3 Cambio C añadió tres garantías. §12.3 declara ahora diez, no siete.**

## 3.3 Autoridad

**`ADR-13 v1.3 §12.3`** — `Approved` 2026-08-04.

## 3.4 Propuesta exacta

```
| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |
```

## 3.5 ✅ Verificación exigida por el sprint — **no se crean garantías nuevas**

| Comprobación | Resultado |
| --- | :-: |
| ¿G-8, G-9, G-10 se crean aquí? | ❌ **No.** Las crea **ADR-13 v1.3 Cambio C** |
| ¿El texto propuesto añade contenido normativo? | ❌ **No.** Describe **cómo PostgreSQL las satisface**, que es la función de §7 |
| ¿Se altera G-1 a G-7? | ❌ **No** |

> ⚠️ **Un solo matiz de redacción:** se retira *«es la garantía central»* de G-6 y se acota a *«sobre la identidad del Lead»*. **G-6 sigue siendo íntegra**; deja de ser *la* central porque **G-8 la generaliza a los demás agregados**. **Es precisión, no cambio de alcance.**

---

# 4. 🔴 Divergencia D-3 — número de eventos · **hallazgo nuevo**

## 4.1 Fila actual

```
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **siete** eventos de ADR-13 §13 |
```

## 4.2 Problema detectado

**ADR-13 §13.1 declara diez filas de evento: E-1, E-2, E-2b, E-3, E-4, E-5, E-6, E-7, E-8, E-9.** El catálogo del Blueprint lo resume como *«**nueve eventos: E-1 a E-9**»*.

> ### **ADS-02 §7 dice «siete». No lo son desde ADR-13 v1.2.**

**Origen del desfase — y no es esta enmienda:**

| Documento | Última actualización | Efecto |
| --- | :-: | --- |
| **ADS-02 v1.1** | **2026-07-29** | Escrito cuando el catálogo tenía menos eventos |
| **ADR-13 v1.2** | **2026-07-30** | *«§13.1 corrige **E-5** e incorpora **E-7**, **E-8** y **E-9**»* |

> ### ⚠️ **D-3 NO deriva de ADR-13 v1.3.** Es un desfase anterior, **de ADR-13 v1.2**, que **ningún sprint había detectado** porque nadie había auditado §7 completo.
>
> **Se registra conforme a la tarea A1** —*«Registrar cualquier divergencia»*—, **y se marca como fuera de las dos correcciones nombradas por el sprint.**

## 4.3 Autoridad

**`ADR-13 v1.2 §13.1` y `§13.4`** — `Approved` desde 2026-07-30.

## 4.4 Propuesta exacta

```
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |
```

## 4.5 ✅ Verificación — **no se crean eventos**

| Comprobación | Resultado |
| --- | :-: |
| ¿Se añade algún evento? | ❌ **No.** E-7, E-8 y E-9 los creó **ADR-13 v1.2** |
| ¿Se altera §13.4? | ❌ **No.** La regla de cierre es la misma |

---

# 5. ⚠️ Divergencia D-4 — referencia dudosa *(no se propone corrección)*

## 5.1 Fila actual

```
| **Historial de solo crecimiento** | §12.1, E-5 | Tabla de historial sin actualización ni borrado |
```

## 5.2 Observación

**En ADR-13, `§12.1` es *«Regla de precedencia»***, que no trata del historial. **La garantía del historial es `G-5`, en §12.3, y su origen declarado es `ADR-12 E-5`.**

> **La cita parece remitir a ADR-12 §12.1 / E-5, no a ADR-13** — pero la columna se titula *«Requisito de **ADR-13**»*.

## 5.3 Por qué NO se propone corrección

> **No hay certeza de que sea un error.** La ambigüedad podría ser de redacción de la columna, no de la referencia. **Corregirlo por inferencia infringiría la regla del sprint.**
>
> **Se eleva para verificación del Architecture Team.** El contenido de la fila —*«tabla de historial sin actualización ni borrado»*— **es correcto en cualquier caso**.

---

# 6. Impacto

## 6.1 En ADS-02

| Sección | Impacto |
| --- | :-: |
| **§7** | ⚠️ **Tres filas sustituidas, una añadida** — de **11 a 12** filas |
| §1, §2 | ✅ Ninguno |
| **§3** *(RQ-1 a RQ-9)* | ⚠️ **Requiere ampliación — pero es F-2 Capa B**, materia y sprint distintos |
| §4, §5, §6 *(motor, justificación, alternativas)* | ✅ **Ninguno.** PostgreSQL y Supabase no se revisan |
| §8, §9, §10, §11 | ✅ Ninguno |

> **La selección de motor no se toca.** PostgreSQL satisface el criterio nuevo con una columna entera e índice compuesto — **más simple** que ordenar por marca temporal.

## 6.2 En código

> **Ninguno.** Ambos adapters versionados **ya ordenan por `issue`** *(COM-40/1 §3)*.

## 6.3 Registro propuesto para el Historial de ADS-02 — **v1.2**

> **Sincronización de §7 con ADR-13 v1.2 y v1.3.** La fila *«Versión vigente distinguible»* **se desdobla en dos**: la vigencia pasa a determinarse por **mayor `issue`** *(V-2 enmendada)*, y la **conservación de la marca temporal se declara en fila propia bajo V-3**, de la que carecía. La fila de garantías pasa de **siete a diez** *(G-8, G-9, G-10)*. La fila de catálogo de eventos pasa de **siete a nueve** *(E-1 a E-9)*. **Ningún contenido de §1 a §6 ni de §8 a §11 resulta afectado:** ni la selección de PostgreSQL, ni el compromiso de portabilidad, ni las alternativas, ni las verificaciones de compatibilidad con ADR-05, ADR-08 y ADR-12.
>
> **Motivo:** §7 afirmaba que la versión vigente se determina por marca temporal, contra **ADR-13 v1.3 §10.3 V-2**; contaba **siete** garantías cuando §12.3 declara **diez**; y **siete** eventos cuando §13.1 declara **nueve** desde ADR-13 v1.2. ADS-02 está *«Gobernado por ADR-13»*, de modo que la corrección le corresponde *(ADS-00 R-1)*. Detectado en **COM-40/1** y completado en **COM-41/A**.

---

# 7. ¿Requiere aprobación? · ✅ **SÍ**

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Redacta** | **AKVEZ Architecture Team** | `Responsable` de ADS-02 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADS-02 v1.1 en **GOV-01** |

> **Esta propuesta permanece pendiente hasta ese pronunciamiento. ADS-02 no se ha tocado.**

---

# 8. Resumen de divergencias

| ID | Fila | Origen del desfase | ¿En el alcance nombrado por el sprint? | Propuesta |
| :-: | --- | --- | :-: | :-: |
| **D-1** | Versión vigente distinguible | **ADR-13 v1.3** | ✅ Sí — *«Vigencia»* | ✅ §2.4 |
| **D-2** | Siete garantías G-1 a G-7 | **ADR-13 v1.3** | ✅ Sí — *«Garantías»* | ✅ §3.4 |
| **D-3** | Catálogo cerrado de eventos | **ADR-13 v1.2** | ⚠️ **No — hallazgo de la auditoría completa** | ✅ §4.4 |
| **D-4** | Historial de solo crecimiento | Indeterminado | ⚠️ No | ❌ **Se eleva, no se corrige** |

> **D-3 y D-4 aparecen porque la tarea A1 exigía auditar §7 completo.** **D-3 lleva sin detectarse desde el 2026-07-30.**

---

# 9. Referencias

**ADR-12 v1.1** E-5 · **ADR-13 v1.2** §10.1, §10.2, §10.3, §11.1, §11.3, §12.1, §12.3, §12.4, §13.1, §13.4, *Historial* · **ADR-13 v1.3 Consolidated Amendment** Cambios B y C · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1, R-2, R-3 · **ADS-02 v1.1** *(cabecera)*, §3, §7 · **PO-02 v1.3** §3 · **DDD-01 v1.1** §2.1, §9.2 · **`docs/blueprint/INDEX.md`** *(«nueve eventos: E-1 a E-9»)* · **COM-40/1** · **COM-40/2**.
