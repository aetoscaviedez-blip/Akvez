# COM-40 — Auditoría de Alineación del Ordenamiento de Versiones

| Campo | Valor |
| --- | --- |
| Código | COM-40 / 1 |
| Clasificación | **Auditoría de divergencia documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Divergencia localizada y tipificada.** ADS-02 **no modificado** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-40, tarea 1 |
| Antecedentes | **ADR-13 v1.3** Cambio B *(la autoridad)* · COM-19 §9 · COM-37/2 · COM-38/3 · COM-39 §7.1 |

> **Cero cambios de código. ADS-02 no ha sido editado.**

---

# 1. Autoridad vigente

> ## **`ADR-13 v1.3 §10.3 V-2` — `Approved`, 2026-08-04, AKVEZ Architecture Team.**

**Texto normativo:**

> *«Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión (`issue`) dentro de su clave de identidad.** El número de emisión **forma parte de la identidad del agregado** (ADR-16 §4.2, §4.4) y es **monótono creciente por V-1**. **`issuedAt` es metadato temporal y NO determina la vigencia.** Aplica a los cuatro activos versionados de esta sección.»*

**Por qué ADR-13 es la autoridad — DDD-01 §9.2:** *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»*. Cuál es la versión vigente **es semántica de persistencia**.

## 1.1 La regla, sin ambigüedad

| Criterio | Estado |
| --- | :-: |
| **Mayor `issue`** | ✅ **Determina la vigencia** |
| **`issuedAt`** | ⚪ **Metadato temporal.** No determina precedencia |
| **Marca temporal en general** | ❌ **No define precedencia** |

---

# 2. La divergencia encontrada

## 2.1 Dónde está

**`ADS-02 §7` — Compatibilidad con ADR-13, línea 172, fila «Versión vigente distinguible»:**

```
| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |
```

| Documento | Qué dice | Rango |
| --- | --- | --- |
| **ADR-13 v1.3 §10.3 V-2** | **Mayor `issue`.** `issuedAt` **no** determina vigencia | **ADR — orden 4.** Autoridad sobre semántica de persistencia |
| **ADS-02 §7** | *«**Marca temporal** por emisión; la vigente es la más reciente»* | **Documento de Implementación**, cabecera: *«**Gobernado por ADR-13**»* |

> ### 🔴 **ADS-02 §7 dice hoy lo contrario que la regla vigente.**

## 2.2 Por qué esto no era una contradicción antes, y ahora sí

**Antes de ADR-13 v1.3, V-2 decía solo *«la más reciente»* sin declarar respecto de qué.** ADS-02 §7 **completaba** el hueco con «marca temporal» y el código lo completaba con `issue`: **dos rellenos divergentes de una regla incompleta**, no un conflicto entre documentos *(COM-38/3 §1.2)*.

> **Con V-2 completada, el hueco desaparece y el relleno de ADS-02 §7 pasa a ser una afirmación contraria a su documento gobernante.**

## 2.3 Hallazgo adicional — la fila conflaciona V-2 y V-3

**La fila cita `§10.3, V-2`, pero su texto cubre dos reglas distintas:**

| Fragmento | Qué regla satisface | ¿Correcto? |
| --- | --- | :-: |
| *«**Marca temporal por emisión**»* | **V-3** — *«Cada versión **conserva** su marca temporal…»* | ✅ **Sí, y debe conservarse** |
| *«la vigente es **la más reciente**»* *(por marca temporal)* | **V-2** — criterio de vigencia | 🔴 **Contrario a V-2 enmendada** |

> ### **Corregir la fila no debe eliminar la conservación de la marca temporal: V-3 sigue exigiéndola.**
>
> **`ADS-02 §7` no tiene fila propia para V-3.** La conservación temporal solo aparece **dentro** de la fila de V-2. Separar ambas es parte de la corrección.

## 2.4 Segunda divergencia en la misma sección — **fuera del encargo, pero de la misma enmienda**

**`ADS-02 §7`, fila «Siete garantías G-1 a G-7»:**

```
| **Siete garantías G-1 a G-7** | §12.3 | G-1, G-2, G-4: columnas inmutables… **G-6: restricción de unicidad — es la garantía central.** G-7: … |
```

> **ADR-13 v1.3 Cambio C añadió G-8, G-9 y G-10.** **Las garantías ya no son siete: son diez.** La fila queda desactualizada por la misma enmienda que motiva esta auditoría.
>
> **Se registra aquí y se incorpora a la propuesta de COM-40/2.** No corregirla dejaría ADS-02 §7 parcialmente sincronizado, que es peor que no sincronizado.

---

# 3. Código actual — ya conforme

| Adapter | Operación | Criterio implementado | ¿Conforme a V-2 v1.3? |
| --- | --- | --- | :-: |
| `inMemoryProposalAdapter` | `findCurrentByMoment` | **Mayor `issue`**, explícitamente **no** `issuedAt` | ✅ **Sí** |
| `inMemoryBuyerDiagnosisAdapter` | Emisión vigente | **Mayor `issue`** | ✅ **Sí** |
| `inMemoryCommercialSequenceAdapter` | `save` · `update` | **No versiona** — A-12 es actualizable | ✅ **Fuera de alcance de V-2** |
| `inMemoryLeadAnalysisAdapter` *(A-5)* | — | ⚠️ **No auditado** | ⚠️ **Sin verificar** |

**Comentario vigente en `inMemoryProposalAdapter.ts:70-78`:**

> *«**No se ordena por `issuedAt`**… `issue` es monótono creciente por `(Lead, momento)`… mientras que la marca temporal es un valor de reloj **cuyo origen sigue abierto**.»*

> ### **El código no requiere ningún cambio.** La enmienda **regulariza** lo que ya hacía, por su propio fundamento.

## 3.1 ⚠️ Lo que el código NO tiene

> **Ninguna suite de contrato prueba el criterio de vigencia.** `proposalRepository.contract.ts` verifica que `findCurrentByMoment` devuelve *«la más reciente»*, pero **no discrimina** entre ordenar por `issue` y ordenar por `issuedAt` con datos donde ambos difieran.
>
> **Con la regla ya fijada, esa prueba pasa a ser escribible.** Se registra como trabajo pendiente; **no se ejecuta en este sprint.**

---

# 4. ¿Requiere ADS-02 actualización?

> ## ✅ **SÍ. Dos filas de §7.**

| # | Fila | Motivo | Urgencia |
| :-: | --- | --- | :-: |
| **1** | **«Versión vigente distinguible»** | Dice *«marca temporal»*; **contrario a V-2 v1.3** | 🔴 **Alta** |
| **2** | **«Siete garantías G-1 a G-7»** | Ahora son **diez** — G-8/G-9/G-10 | 🟡 Media |

## 4.1 Por qué la urgencia de la fila 1 es alta

> **ADS-02 es el documento de referencia del motor real** — selecciona PostgreSQL y describe cómo satisface cada requisito de ADR-13.
>
> **Quien implemente el adapter de motor leerá §7, no el código en memoria.** Con la fila sin corregir, **implementaría la vigencia por marca temporal**, y al sustituir el adapter **cambiaría qué propuesta ve el usuario** — sin que ninguna prueba lo detectara, porque las suites actuales no discriminan *(§3.1)*.
>
> **Es exactamente la divergencia que ADR-13 v1.3 Cambio B cierra.** Dejar ADS-02 sin corregir la reintroduce por la puerta de atrás.

## 4.2 Qué NO requiere cambio en ADS-02

| Sección | Motivo |
| --- | :-: |
| **§3** — RQ-1 a RQ-9 | ⚠️ **Requiere ampliación por G-8/G-9/G-10**, pero es **F-2 Capa B**, materia distinta de esta auditoría |
| **§4, §5, §6** — motor, justificación, alternativas | Sin relación |
| **§8, §9** | Sin relación |
| **§7**, las otras nueve filas | Sin relación con la enmienda |

---

# 5. Impacto registrado

## 5.1 En documentos

| Documento | Impacto | Acción |
| --- | :-: | --- |
| **ADR-13 v1.3** | ✅ Ninguno | **Es la autoridad** |
| **ADS-02 §7** | 🔴 **Dos filas** | Corregir — propuesta en **COM-40/2** |
| **ADS-02 §3** | 🟡 Ampliación | **F-2 Capa B**, sprint distinto |
| **COM-19 §9** | ✅ **Respondida** | Cerrar formalmente |
| **ADR-16** · **PO-02** · **DDD-01** | ✅ Ninguno | Coinciden |

## 5.2 En código

> **Ninguno.** Los dos adapters versionados ya ordenan por `issue`.

**Trabajo futuro, no de este sprint:**

| # | Trabajo | Precondición |
| :-: | --- | :-: |
| 1 | **Prueba discriminante del criterio** en las suites de contrato de A-6 y A-11 | Ninguna — ya es escribible |
| 2 | **Auditar `inMemoryLeadAnalysisAdapter` (A-5)** frente a V-2 | Ninguna |
| 3 | Restricciones del motor real | ⛔ ADS-02 §3 |

---

# 6. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **La autoridad es ADR-13 v1.3 §10.3 V-2.** La regla es única: **mayor `issue`** |
| **2** | **ADS-02 §7 diverge** y debe corregirse — **dos filas**, no una |
| **3** | **El código ya es conforme.** Cero cambios requeridos |
| **4** | **La corrección de ADS-02 no se aplica en este sprint** — propuesta en **COM-40/2**, `Draft` hasta aprobación |
| **5** | ⚠️ **Ninguna prueba discrimina hoy el criterio.** Con la regla fijada, ya es escribible |

---

# 7. Referencias

**ADR-13 v1.2** §10.3 *(V-1 a V-5)*, §12.3 · **ADR-13 v1.3 Consolidated Amendment** Cambios B y C · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1, R-2 · **ADS-02 v1.1** *(cabecera)*, §3, §7 · **DDD-01 v1.1** §9.2 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-37/2** · **COM-38/3** · **COM-39** §7.1.
