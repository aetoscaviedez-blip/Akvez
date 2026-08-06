# COM-46 — Checklist de Sincronización de ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-46 / 1 |
| Clasificación | **Checklist de sincronización** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Checklist listo. ADS-02 NO modificado** |
| Fecha | 2026-08-04 |
| Documento objeto | **ADS-02 v1.1** → **v1.2** pendiente |
| Precondición | ✅ **CUMPLIDA** — ADR-13 v1.3 aplicada al Blueprint en este sprint |
| Antecedentes | COM-40/2 · COM-41/A · COM-42/A · COM-42/B · COM-44/3 · COM-45/1 §6 |

> **ADS-02 no ha sido modificado.** Este documento **lista**; no corrige.

---

# 1. Estado de la dependencia

| | Antes de COM-46 | Ahora |
| --- | :-: | :-: |
| **ADR-13 en el Blueprint** | v1.2 — sin la enmienda | ✅ **v1.3 — aplicada** |
| **ADS-02 puede citar V-2 enmendada** | ❌ No existía | ✅ **Sí** |
| **ADS-02 puede citar G-8/G-9/G-10** | ❌ No existían | ✅ **Sí** |

> ### **La precondición que bloqueaba la corrección de ADS-02 queda levantada.** El fichero del Blueprint ya contiene los textos que §7 debe citar.

---

# 2. Cambios necesarios — cuatro, todos en §7

**Detalle completo en COM-44/3 §2. Aquí, la lista ejecutable.**

## 2.1 ☐ C-1 — Criterio de vigencia

| | |
| --- | --- |
| **Fila actual** *(línea 172)* | `| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |` |
| **Problema** | Afirma que la vigencia la determina **la marca temporal** |
| **Autoridad** | **ADR-13 v1.3 §10.3 V-2** — ✅ **ya en el Blueprint** |
| **Texto propuesto** | `| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión por fila.** La vigente es la de **mayor número de emisión dentro de su clave de identidad** — no la de marca temporal más reciente. Consulta por `MAX()` sobre esa columna, con índice compuesto |` |

## 2.2 ☐ C-2 — Conservación de la marca temporal · **fila nueva**

| | |
| --- | --- |
| **Problema** | **§7 no tiene fila para V-3.** La conservación temporal solo aparece **dentro** de la fila de V-2 |
| **Riesgo si se omite** | Aplicar C-1 sin C-2 **elimina la única constancia de V-3 en §7** |
| **Autoridad** | **ADR-13 §10.3 V-3** — vigente **sin cambios desde v1.2** |
| **Texto propuesto** | `| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas de marca temporal y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |` |

## 2.3 ☐ C-3 — Número de garantías

| | |
| --- | --- |
| **Fila actual** | `| **Siete garantías G-1 a G-7** | §12.3 | … **G-6: restricción de unicidad — es la garantía central.** … |` |
| **Problema** | **Son diez** — ADR-13 v1.3 §12.3 |
| **Autoridad** | **ADR-13 v1.3 §12.3** — ✅ **ya en el Blueprint** |
| **Texto propuesto** | `| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |` |

## 2.4 ☐ C-4 — Número de eventos

| | |
| --- | --- |
| **Fila actual** | `| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **siete** eventos de ADR-13 §13 |` |
| **Problema** | **ADR-13 §13.1 declara nueve: E-1 a E-9**, más la variante E-2b |
| **Autoridad** | **ADR-13 v1.2 §13.1 · §13.4** — `Approved` desde **2026-07-30** |
| **Texto propuesto** | `| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |` |

> ⚠️ **C-4 no deriva de v1.3.** Es un desfase de **v1.2**, abierto desde el 2026-07-30 y **nunca detectado hasta COM-41/A**.

---

# 3. Referencias que deben actualizarse

| # | Referencia | Dónde | Acción |
| :-: | --- | --- | --- |
| **1** | `§10.3, V-2` | §7, fila de vigencia | ✅ Se mantiene — el texto de la columna cambia |
| **2** | `§10.3, V-3` | §7 | ➕ **Nueva** — la fila no existe |
| **3** | `§12.3` — *«siete garantías»* | §7 | 🔄 **Diez** |
| **4** | `§13.4` — *«siete eventos»* | §7 | 🔄 **Nueve, E-1 a E-9** |
| **5** | Versión de ADR-13 citada | Cabecera de ADS-02 *(«Gobernado por ADR-13»)* | ✅ **Sin cambio** — no cita versión |
| **6** | Versión de ADS-02 | `docs/blueprint/INDEX.md` | 🔄 **1.1 → 1.2**, al aplicar |

## 3.1 ⚠️ Referencia que NO se corrige

**`§7`, fila *«Historial de solo crecimiento | §12.1, E-5»*.**

**COM-42/A §7 lo determinó:** la cita resuelve contra **ADR-12 §12.1, exigencia E-5** —*«El historial — Solo crece. Ninguna entrada se elimina ni se modifica retroactivamente»*—, **coincidencia literal**. **No es errónea**; es **ambigua** por figurar bajo una columna titulada *«Requisito de ADR-13»*.

> **Ninguna autoridad exige cambiarla. No se incluye en el checklist.**

---

# 4. Dependencias pendientes

| # | Dependencia | Estado | ¿Bloquea el checklist? |
| :-: | --- | :-: | :-: |
| **1** | **ADR-13 v1.3 en el Blueprint** | ✅ **Cumplida en COM-46** | ❌ No |
| **2** | **Aprobación del Product Office** para ADS-02 v1.2 | 🔴 **Pendiente** | ✅ **SÍ — es la única** |
| **3** | Identidad lógica de A-4/A-5 *(AT-c)* | 🟡 Abierta | ❌ **No** — afecta a §3, no a §7 |
| **4** | Nombre del campo `issue`/`emission` *(AT-e)* | 🟡 Abierta | ❌ **No** — C-1 **no fija el nombre** |

> ### **Una sola dependencia bloquea: la aprobación del Product Office.**

## 4.1 Lo que este checklist NO cubre

> **`ADS-02 §3` — requisitos de motor derivados de G-8/G-9/G-10. Es la Capa B de F-2, y es materia distinta.**
>
> **§7 describe *cómo* el motor satisface lo exigido. §3 *exige*.** Mezclarlas bloquearía la aprobación de §7 con una cuestión abierta —la identidad lógica de A-4/A-5— **ajena a §7**.

## 4.2 Nota derivada de COM-45/1 §2.4

**COM-45 determinó que la nota sobre los *dos patrones de derivación* —el adapter para A-4/A-5, el caso de uso para A-6/A-11— corresponde a ADS-02 §7 y no a ADR-13 §12.3**, porque §7 es la columna del *«cómo lo satisface»*.

> **Se registra como candidata a incorporarse al texto de C-3**, no como cambio exigido. **Sin autoridad que lo imponga.**

---

# 5. Orden de ejecución

| # | Acto | Estado |
| :-: | --- | :-: |
| **1** | Aplicar ADR-13 v1.3 al Blueprint | ✅ **Hecho — COM-46** |
| **2** | **Aprobar ADS-02 v1.2** *(C-1 a C-4)* | 🔴 **Pendiente — Product Office** |
| **3** | Aplicar los cuatro cambios a §7 | ⛔ Tras 2 |
| **4** | Actualizar `docs/blueprint/INDEX.md` — ADS-02 **1.1 → 1.2** | ⛔ Tras 3 |
| **5** | **Cerrar COM-19 §9** — la pregunta queda respondida por V-2 aplicada | 🟡 Ejecutable ya |
| **6** | **§3 — F-2 Capa B** | ⛔ Sprint distinto |

> ⚠️ **Los cuatro cambios van juntos.** Aplicar solo C-1 dejaría §7 **parcialmente sincronizada**, que **COM-42/B riesgo 2** identifica como peor que no sincronizarla.

---

# 6. Riesgo principal

> **§7 sigue afirmando que la vigencia la determina la marca temporal, y ADR-13 ya dice lo contrario en el Blueprint.**
>
> **Desde hoy la divergencia es entre dos documentos vigentes**, no entre un documento y una enmienda sin aplicar. **Quien implemente el motor real lee §7, no el código.**

---

# 7. Referencias

**ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.1** *(cabecera)*, §2.2, §3, §7 · **ADR-12 v1.1** §12.1 *(E-5)* · **ADR-13 v1.3** §10.3 *(V-2, V-3)*, §12.3 *(G-1 a G-10)*, §13.1, §13.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **COM-19** §9 · **COM-40/2** · **COM-41/A** · **COM-42/A** §7 · **COM-42/B** · **COM-44/3** · **COM-45/1** §2.4, §6.
