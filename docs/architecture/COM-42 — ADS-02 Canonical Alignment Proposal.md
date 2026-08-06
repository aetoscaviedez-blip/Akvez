# COM-42 — Propuesta de Alineación Canónica de ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-42 / A |
| Clasificación | **Auditoría + propuesta de corrección documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propuesta completa. ADS-02 NO modificado** |
| Fecha | 2026-08-04 |
| Documento auditado | **ADS-02 v1.1** — con foco en **§7** |
| Antecedentes | COM-40/1 · COM-40/2 · COM-41/A |

> **`docs/blueprint/` intacto. ADS-02, ADR-13 y ADR-19 sin modificar. Cero cambios de código.**
>
> **Ninguna corrección propuesta crea reglas, garantías, requisitos ni eventos.** Todas sincronizan ADS-02 con decisiones ya aprobadas.

---

# 1. El riesgo que esta propuesta ataja

> ### **El riesgo no está en el código: está en que quien implemente el motor real lea ADS-02 y reconstruya reglas derogadas.**
>
> **ADS-02 es el documento de referencia del motor** — selecciona PostgreSQL y describe **cómo satisface cada requisito de ADR-13**. Un implementador no lee `inMemoryProposalAdapter`: lee §7.
>
> **Con §7 sin sincronizar, implementaría la vigencia por marca temporal** — y al sustituir el adapter **cambiaría qué propuesta ve el usuario**, sin que ninguna prueba lo detectara.

---

# 2. Auditoría completa — §7, once filas

**Cada fila contrastada contra ADR-13 v1.3, ADR-16, PO-02 y DDD-01. Sin corregir por interpretación.**

| # | Fila | Referencia | Veredicto |
| :-: | --- | --- | :-: |
| 1 | Unidad de Registro atómica | §11.1 | ✅ Vigente |
| 2 | Reconciliación atómica | §11.1 · §9.5 | ✅ Vigente |
| 3 | Idempotencia del Registro | §11.3 | ✅ Vigente |
| 4 | Registrar · Actualizar · Versionar | §10.1 | ✅ Vigente |
| 5 | Ninguna destrucción de conocimiento | §10.2 | ✅ Vigente |
| **6** | **Versión vigente distinguible** | §10.3, V-2 | 🔴 **D-1 — DIVERGENTE** |
| 7 | El Score conserva su perfil de usuario | §10.3, V-4 | ✅ Vigente |
| 8 | Historial de solo crecimiento | §12.1, E-5 | ✅ **D-4 — RESUELTA: correcta** |
| **9** | **Siete garantías G-1 a G-7** | §12.3 | 🔴 **D-3 — DESACTUALIZADA** |
| 10 | Independencia del motor | §12.4 | ✅ Vigente |
| **11** | **Catálogo cerrado de eventos** | §13.4 | 🔴 **D-5 — DESACTUALIZADA** |

**Además:** **D-2** — falta fila propia para **V-3** *(§4)*.

## 2.1 Auditoría del resto de ADS-02

| Sección | Contraste | Veredicto |
| --- | --- | :-: |
| **§3** *(RQ-1 a RQ-9)* | ADR-13 v1.3 §12.3 G-8/G-9/G-10 | ⚠️ **Sin requisitos para los activos comerciales** — es **F-2 Capa B**, materia distinta |
| §4, §5, §6 *(motor, justificación, alternativas)* | — | ✅ Sin relación |
| §8 *(compat. ADR-05 y ADR-08)* | ADR-05 §14 · ADR-08 §10 | ✅ Vigente |
| §9 *(compat. ADR-12)* | ADR-12 §7.2, §12.1, §12.3 | ✅ Vigente |
| §10, §11 | — | ✅ Sin relación |

## 2.2 🔴 Cobertura de activos comerciales · **inexistente**

**Búsqueda exhaustiva sobre ADS-02 completo:**

| Término | Ocurrencias |
| --- | :-: |
| `A-6` · `A-11` · `A-12` | **0** |
| `Propuesta` · `Diagnóstico` · `Secuencia` | **0** |

> ### **ADS-02 no menciona los tres activos comerciales en ningún punto.**
>
> **Causa raíz, y explica D-3 y D-5 a la vez:** **ADS-02 v1.1 es del 2026-07-29**; **ADR-13 v1.2 se actualizó el 2026-07-30** incorporando **A-11**, **A-12**, **E-7**, **E-8** y **E-9**. **ADS-02 nunca se resincronizó tras aquella enmienda.**
>
> **Las divergencias no son de v1.3 solamente: dos son de v1.2 y llevan abiertas desde entonces.**

---

# 3. D-1 — Criterio de selección de versión

## 3.1 Fila actual *(línea 172)*

```
| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |
```

## 3.2 Divergencia

| Documento | Qué dice |
| --- | --- |
| **ADR-13 v1.3 §10.3 V-2** | *«La vigente es la de **mayor número de emisión (`issue`)**… **`issuedAt` es metadato temporal y NO determina la vigencia**»* |
| **ADS-02 §7** | *«**Marca temporal** por emisión; la vigente es la más reciente»* |

## 3.3 Autoridad que exige el cambio

**`ADR-13 v1.3 §10.3 V-2`** — `Approved` 2026-08-04.
**ADS-02** declara en cabecera: *«**Gobernado por ADR-13** · ADR-05 · ADR-08 · ADR-12»*.
**ADS-00 R-1:** *«Que un documento prevalezca **no anula al otro. Obliga a corregirlo**.»*

## 3.4 Propuesta exacta

```
| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión (`issue`) por fila.** La vigente es la de **mayor `issue` dentro de su clave de identidad** — no la de marca temporal más reciente. Consulta por `MAX(issue)` sobre la clave, con índice compuesto |
```

> **No mezcla conceptos:** esta fila decide **selección** y nada más. La **conservación** pasa a D-2.

---

# 4. D-2 — Conservación de la marca temporal *(V-3)*

## 4.1 Problema

**La fila actual conflaciona dos reglas distintas:**

| Fragmento | Regla | Veredicto |
| --- | --- | :-: |
| *«Marca temporal por emisión»* | **V-3** — *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* | ✅ **Correcto** |
| *«la vigente es la más reciente»* | **V-2** | 🔴 Derogado |

> ### ⚠️ **`ADS-02 §7` NO tiene fila propia para V-3.** Sustituir el texto sin desdoblar **eliminaría la única constancia de la conservación temporal en toda la sección**.

## 4.2 Autoridad

**`ADR-13 §10.3 V-3`** — vigente **sin cambios** desde v1.2. **ADR-13 v1.3 no la tocó.**

## 4.3 Propuesta exacta — **fila nueva**

```
| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas `issued_at` y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |
```

## 4.4 ✅ Verificación exigida

| Comprobación | Resultado |
| --- | :-: |
| ¿Se elimina V-3? | ❌ **No. Se refuerza** con fila propia |
| ¿Queda separada del ordenamiento? | ✅ **Sí** — D-1 decide selección, D-2 conservación |
| ¿Se crea alguna regla? | ❌ **No.** V-3 existe desde ADR-13 v1.2 |

---

# 5. D-3 — Número de garantías

## 5.1 Fila actual

```
| **Siete garantías G-1 a G-7** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad — es la garantía central.** G-7: relación uno a muchos de referencias de origen |
```

## 5.2 Divergencia

**ADR-13 v1.3 Cambio C añadió G-8, G-9 y G-10. §12.3 declara ahora diez.**

## 5.3 Autoridad

**`ADR-13 v1.3 §12.3`** — `Approved` 2026-08-04.

## 5.4 Propuesta exacta

```
| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |
```

## 5.5 ✅ Verificación — **solo sincronización documental**

| Comprobación | Resultado |
| --- | :-: |
| ¿G-8, G-9, G-10 se crean aquí? | ❌ **No.** Las crea **ADR-13 v1.3 Cambio C** |
| ¿Se añade contenido normativo? | ❌ **No.** Se describe **cómo PostgreSQL las satisface**, que es la función de §7 |
| ¿Se altera G-1 a G-7? | ❌ **No** |

> ⚠️ **Único matiz de redacción:** se retira *«es la garantía central»* de G-6 y se acota a *«sobre la identidad del Lead»*. **G-6 permanece íntegra**; deja de ser *la* central porque **G-8 la generaliza**. **Es precisión de alcance, no cambio de regla.**

---

# 6. D-5 — Número de eventos

## 6.1 Fila actual

```
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **siete** eventos de ADR-13 §13 |
```

## 6.2 Divergencia

**ADR-13 §13.1 declara diez filas: E-1, E-2, E-2b, E-3, E-4, E-5, E-6, E-7, E-8, E-9.** El catálogo del Blueprint lo resume como *«**nueve eventos: E-1 a E-9**»*.

> ### **ADS-02 dice «siete». No lo son desde ADR-13 v1.2.**

## 6.3 Autoridad

**`ADR-13 v1.2 §13.1` y `§13.4`** — `Approved` desde **2026-07-30**.

> ⚠️ **D-5 NO deriva de ADR-13 v1.3.** Es un desfase de **v1.2**, sin detectar hasta la auditoría completa.

## 6.4 Propuesta exacta

```
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |
```

## 6.5 ✅ Verificación

| Comprobación | Resultado |
| --- | :-: |
| ¿Se añade algún evento? | ❌ **No.** E-7, E-8 y E-9 los creó **ADR-13 v1.2** |
| ¿Se altera §13.4? | ❌ **No.** La regla de cierre es la misma |

---

# 7. D-4 — Referencia `§12.1, E-5` · ✅ **RESUELTA — no es divergencia**

**COM-41/A §5 la registró como *«referencia dudosa»* y la elevó sin corregir. Este sprint la investiga y la cierra.**

## 7.1 Investigación

| Candidato | Contenido | ¿Corresponde? |
| --- | --- | :-: |
| **ADR-13 §12.1** | *«**Regla de precedencia** — La identidad se determina antes de escribir, nunca al escribir»* | ❌ **No.** No trata del historial |
| **ADR-12 §12.1** | *«**Qué debe permanecer estable**»* — tabla de exigencias **E-1 a E-5** | ✅ **Sí** |

**ADR-12 §12.1, exigencia E-5, texto literal:**

> *«**El historial** — **Solo crece. Ninguna entrada se elimina ni se modifica retroactivamente.**»*

**Fila de ADS-02 §7:** *«**Historial de solo crecimiento** | §12.1, E-5 | Tabla de historial sin actualización ni borrado»*

> ### **Correspondencia exacta, palabra por palabra.**

**Confirmación cruzada:** **ADR-13 §12.3, garantía G-5** declara su origen como **«ADR-12 E-5»**. La cadena es la misma.

## 7.2 Determinación

| Pregunta | Respuesta |
| --- | :-: |
| **¿Corresponde?** | ✅ **Sí.** Resuelve contra **ADR-12 §12.1 E-5** |
| **¿Está desactualizada?** | ❌ **No.** ADR-12 §12.1 E-5 sigue vigente sin cambios |
| **¿Requiere corrección?** | ❌ **No** |

> **La única imprecisión es de *presentación*: la cita remite a ADR-12 dentro de una columna titulada *«Requisito de ADR-13»*.** Es **ambigua, no errónea** — y ADS-02 §7 hace lo mismo en otras filas al trazar hasta el origen último.
>
> ### **No existe autoridad que exija cambiarla. Conforme a la restricción del sprint, NO se propone corrección.**

**Corrección a COM-41/A §5:** aquel documento la clasificó como divergencia D-4 pendiente de verificación. **Verificada, no lo es.**

---

# 8. Resumen de divergencias

| ID | Fila | Origen del desfase | Propuesta |
| :-: | --- | --- | :-: |
| **D-1** | Versión vigente distinguible | **ADR-13 v1.3** | ✅ §3.4 |
| **D-2** | *(falta)* Conservación de marca temporal | **ADR-13 v1.2** — nunca tuvo fila | ✅ §4.3 — **fila nueva** |
| **D-3** | Siete garantías G-1 a G-7 | **ADR-13 v1.3** | ✅ §5.4 |
| **D-4** | Historial de solo crecimiento | — | ❌ **No es divergencia** — §7 |
| **D-5** | Catálogo cerrado de eventos | **ADR-13 v1.2** | ✅ §6.4 |

**Resultado sobre §7: de 11 filas a 12** — tres sustituidas, una añadida.

---

# 9. Impacto

| Ámbito | Impacto |
| --- | :-: |
| **ADS-02 §7** | ⚠️ **3 filas sustituidas + 1 añadida** |
| **ADS-02 §3** | ⚠️ Ampliación pendiente — **F-2 Capa B**, sprint distinto |
| ADS-02 §1, §2, §4 a §6, §8 a §11 | ✅ **Ninguno.** PostgreSQL y Supabase no se revisan |
| **Código** | ✅ **Ninguno.** Ambos adapters versionados ya ordenan por `issue` |
| **ADR-13 v1.3** · **ADR-16** · **PO-02** · **DDD-01** | ✅ Ninguno — son la autoridad |
| **`docs/blueprint/INDEX.md`** | ⚠️ Versión de ADS-02: **1.1 → 1.2** |

---

# 10. Referencias

**ADR-12 v1.1** §12.1 *(E-1 a E-5)*, §12.2, §12.3 · **ADR-13 v1.2** §10.1, §10.2, §10.3, §11.1, §11.3, §12.1, §12.3, §12.4, §13.1, §13.4, *Historial* · **ADR-13 v1.3 Consolidated Amendment** Cambios B y C · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1, R-2, R-3 · **ADS-02 v1.1** *(cabecera)*, §3, §7, §8, §9 · **PO-02 v1.3** §3 · **DDD-01 v1.1** §2.1, §9.2 · **COM-40/1** · **COM-40/2** · **COM-41/A**.
