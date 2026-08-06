# COM-44 — Impacto de Cambios en ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-44 / 3 |
| Clasificación | **Lista de impacto documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Lista completa. ADS-02 NO modificado** |
| Fecha | 2026-08-04 |
| Documento objeto | **ADS-02 v1.1** |
| Antecedentes | COM-40/1 · COM-40/2 · COM-41/A · COM-42/A · COM-42/B · **COM-44/2** |

> **ADS-02 intacto. `docs/blueprint/` intacto. Cero cambios de código.**

---

# 1. Resumen por naturaleza

| Naturaleza | Cambios | Sección |
| --- | :-: | :-: |
| 🔴 **Correcciones obligatorias por autoridad** | **4** | §2 |
| 🟡 **Mejoras recomendadas** | **2** | §3 |
| 🔵 **Requieren Product Office** | **2** | §4 |

**Todos en `§7` salvo los de §4.**

---

# 2. 🔴 Correcciones obligatorias por autoridad

**Obligatorias porque ADS-02 declara en su cabecera: *«Gobernado por **ADR-13** · ADR-05 · ADR-08 · ADR-12»*, y ADS-00 R-1 impone corregir el documento que diverge de su gobernante.**

## 2.1 C-1 — Criterio de vigencia · §7

| | |
| --- | --- |
| **Fila actual** | `| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |` |
| **Problema** | Afirma que la vigencia la determina **la marca temporal** |
| **Autoridad** | **ADR-13 §10.3 V-2** — v1.3 `Approved`, refinada en v1.4 propuesta |
| **Texto propuesto** | `| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión por fila.** La vigente es la de **mayor número de emisión dentro de su clave de identidad** — no la de marca temporal más reciente. Consulta por `MAX()` sobre esa columna, con índice compuesto |` |

> ⚠️ **Con V-2 enunciada por concepto** *(COM-44/2 §3)*, **el texto de ADS-02 no debe fijar el nombre del campo**: hoy difiere entre activos —`issue` en A-6 y A-11, `emission` en A-4/A-5— **sin que ninguno incumpla**.

## 2.2 C-2 — Conservación de la marca temporal · §7 · **fila nueva**

| | |
| --- | --- |
| **Problema** | **§7 no tiene fila propia para V-3.** La conservación temporal solo aparece **dentro** de la fila de V-2 |
| **Riesgo** | Corregir C-1 sin añadir esta fila **elimina la única constancia de V-3 en §7** |
| **Autoridad** | **ADR-13 §10.3 V-3** — vigente sin cambios desde v1.2 |
| **Texto propuesto** | `| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas de marca temporal y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |` |

## 2.3 C-3 — Número de garantías · §7

| | |
| --- | --- |
| **Fila actual** | `| **Siete garantías G-1 a G-7** | §12.3 | … **G-6: restricción de unicidad — es la garantía central.** … |` |
| **Problema** | **Son diez** desde ADR-13 v1.3 |
| **Autoridad** | **ADR-13 §12.3** — v1.3 `Approved` |
| **Texto propuesto** | `| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura, con independencia de qué capa lo derive. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |` |

**✅ Verificación:** no se crean garantías. Las crea **ADR-13 v1.3/v1.4**; §7 solo describe **cómo PostgreSQL las satisface**.

## 2.4 C-4 — Número de eventos · §7

| | |
| --- | --- |
| **Fila actual** | `| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **siete** eventos de ADR-13 §13 |` |
| **Problema** | **ADR-13 §13.1 declara nueve: E-1 a E-9**, más la variante E-2b |
| **Autoridad** | **ADR-13 v1.2 §13.1 · §13.4** — `Approved` desde **2026-07-30** |
| **Texto propuesto** | `| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |` |

> ⚠️ **C-4 no deriva de v1.3 ni de v1.4.** Es un desfase de **ADR-13 v1.2**, abierto desde el 2026-07-30. **ADS-02 v1.1 es del 2026-07-29 y nunca se resincronizó.**

---

# 3. 🟡 Mejoras recomendadas — **no exigidas por autoridad**

## 3.1 M-1 — Reconocer los dos patrones de derivación · §7

**Si ADR-13 v1.4 incorpora la nota de G-9** *(COM-44/2 §5.3)*, **§7 debería reflejarla**: el motor real encontrará **dos patrones** —derivación en el adapter para A-4/A-5, en el caso de uso para A-6/A-11— y **cada uno exige una transacción distinta**.

**No exigida:** G-9 en su forma v1.3 no menciona los patrones. **Depende de que se apruebe v1.4.**

## 3.2 M-2 — Desambiguar la referencia `§12.1, E-5` · §7

**Fila:** `| **Historial de solo crecimiento** | §12.1, E-5 | Tabla de historial sin actualización ni borrado |`

**COM-42/A §7 lo determinó: la cita resuelve contra **ADR-12 §12.1 E-5***, cuyo texto —*«El historial — Solo crece»*— **coincide literalmente**. **No es errónea**; es **ambigua** por aparecer bajo una columna titulada *«Requisito de ADR-13»*.

> **Mejora sugerida:** citar `ADR-12 §12.1, E-5` explícitamente.
> **No exigida:** ninguna autoridad lo requiere, y **COM-42/A ya descartó corregirla**.

---

# 4. 🔵 Puntos que requieren Product Office

## 4.1 P-1 — Aprobación de la corrección de §7

**Redacta el Architecture Team** *(`Responsable` de ADS-02)*; **aprueba el Product Office**, que aprobó su v1.1 en **GOV-01**.

**Alcanza a C-1, C-2, C-3, C-4** y, si procede, a M-1 y M-2. **Versión resultante: ADS-02 v1.2.**

## 4.2 P-2 — Requisitos de motor en §3 · **F-2 Capa B**

**§3 —*Requisitos Impuestos por la Arquitectura*, «no negociables»— cubre la unicidad con un solo requisito:**

| # | Requisito | Alcance |
| --- | --- | :-: |
| **RQ-2** | *«Unicidad compuesta garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** |

**Faltan los requisitos derivados de G-8, G-9 y G-10** para A-6, A-11 y A-12.

> ### ⚠️ **P-2 NO forma parte de la corrección de §7 y no debe mezclarse.**
>
> **§7 describe *cómo* el motor satisface lo exigido. §3 *exige*.** Son secciones distintas, con alcances distintos.
>
> **Y P-2 está bloqueado por una cuestión abierta:** **la identidad lógica de A-4/A-5 no está declarada por ningún documento** *(COM-44/2 §5.2)*. Redactar RQ para los activos comerciales sin resolverla dejaría el Score fuera, o lo incluiría por inferencia.

**Propietario:** **Architecture Team** *(redacta)* · **Product Office** *(aprueba)*. **Sprint distinto.**

---

# 5. Impacto por sección de ADS-02

| Sección | Impacto | Naturaleza |
| --- | :-: | --- |
| §1, §2 | ✅ Ninguno | — |
| **§3** | ⚠️ **Ampliación pendiente** | 🔵 **P-2** — sprint distinto |
| §4, §5, §6 *(motor, justificación, alternativas)* | ✅ **Ninguno** | **PostgreSQL y Supabase no se revisan** |
| **§7** | 🔴 **3 sustituciones + 1 alta** — de **11 a 12 filas** | C-1 a C-4 |
| §8 *(compat. ADR-05, ADR-08)* | ✅ Ninguno | — |
| §9 *(compat. ADR-12)* | ✅ Ninguno | — |
| §10, §11 | ✅ Ninguno | — |

> **La selección de motor no se cuestiona.** PostgreSQL satisface el criterio nuevo con **una columna entera e índice compuesto** — más simple que ordenar por marca temporal.

---

# 6. Impacto en código

> ## **Ninguno.**

| Adapter | Criterio | ¿Conforme? |
| --- | --- | :-: |
| `inMemoryProposalAdapter` | Mayor `issue` | ✅ |
| `inMemoryBuyerDiagnosisAdapter` | Mayor `issue` | ✅ |
| `inMemoryLeadAnalysisAdapter` | Mayor `emission` | ✅ **Conforme a V-2 por concepto** |

**Ninguna implementación ordena por marca temporal** *(COM-43 §5.2)*. **197 pruebas verdes, sin cambios.**

---

# 7. Orden de aplicación

| # | Acto | Bloqueado por |
| :-: | --- | :-: |
| **1** | **Aplicar ADR-13 v1.3 o v1.4** al fichero del Blueprint | **Nada** |
| **2** | **Aprobar y aplicar C-1 a C-4** en ADS-02 §7 | ⛔ **1** |
| **3** | Sincronizar `docs/blueprint/INDEX.md` — ADR-13 y ADS-02 | ⛔ 1, 2 |
| **4** | **P-2** — requisitos de §3 | ⛔ 1 + identidad de A-4/A-5 |

> ⚠️ **Invertir 1 y 2 deja ADS-02 v1.2 citando V-2 enmendada y G-8/G-9/G-10 cuando el ADR físico aún no los contiene.**

---

# 8. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **No se corrige §7.** Quien implemente el motor **lee §7, no el código**, e implementa la vigencia por marca temporal | 🔴 **Alta** |
| **2** | **Se aplica C-1 sin C-2** y **V-3 pierde su única constancia** en §7 | 🟡 Media |
| **3** | **Se corrige solo la vigencia** y las filas de garantías y eventos quedan desactualizadas, sugiriendo que §7 se revisó entera | 🟡 Media |
| **4** | **Se mezcla P-2 con la corrección de §7** y la aprobación se bloquea por una cuestión —la identidad de A-4/A-5— **ajena a §7** | 🟡 Media |
| **5** | **El texto de C-1 fija el nombre del campo** y **A-5 parece incumplir** | 🟡 Media |

---

# 9. Referencias

**ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.1** *(cabecera)*, §1 a §11 · **ADR-05 v1.4** §14 · **ADR-08 v1.2** §10 · **ADR-12 v1.1** §7.2, §12.1 *(E-5)* · **ADR-13 v1.2** §10.3, §12.3, §13.1, §13.4 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **DDD-01 v1.1** §2.1 · **DEV-00** R-30, R-64 · **COM-40/1** · **COM-40/2** · **COM-41/A** · **COM-42/A** §7 · **COM-42/B** · **COM-43** §5 · **COM-44/1** · **COM-44/2**.
