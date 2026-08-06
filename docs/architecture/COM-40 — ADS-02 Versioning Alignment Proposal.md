# COM-40 — Propuesta de Alineación de Versionado en ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-40 / 2 |
| Clasificación | **Propuesta de corrección documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **`Draft` hasta aprobación.** ADS-02 **no editado** |
| Fecha | 2026-08-04 |
| Documento a corregir | **ADS-02 v1.1 §7** — Compatibilidad con ADR-13 |
| Autoridad invocada | **ADR-13 v1.3** Cambios B y C — `Approved` 2026-08-04 |
| Antecedentes | **COM-40/1** *(la auditoría)* |

> **ADS-02 no ha sido modificado. Cero cambios de código.**

---

# 1. Sección actual

**`ADS-02 §7` — *Compatibilidad con ADR-13*, tabla de once filas. Dos requieren corrección:**

## 1.1 Fila «Versión vigente distinguible» *(línea 172)*

```
| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |
```

## 1.2 Fila «Siete garantías G-1 a G-7»

```
| **Siete garantías G-1 a G-7** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad — es la garantía central.** G-7: relación uno a muchos de referencias de origen |
```

---

# 2. Problema detectado

## 2.1 Problema 1 — la fila de vigencia contradice a su documento gobernante

| Documento | Qué dice |
| --- | --- |
| **ADR-13 v1.3 §10.3 V-2** | **La vigente es la de mayor `issue`.** *«`issuedAt` es metadato temporal y **NO determina la vigencia**»* |
| **ADS-02 §7** | *«**Marca temporal** por emisión; la vigente es la más reciente»* |

**ADS-02 declara en su cabecera: *«Gobernado por **ADR-13** · ADR-05 · ADR-08 · ADR-12»*.**

> ### 🔴 **Un documento gobernado afirma lo contrario que su gobernante.**

## 2.2 Problema 2 — la fila conflaciona V-2 y V-3

**La fila cita `§10.3, V-2` pero su texto cubre dos reglas:**

| Fragmento | Regla | Veredicto |
| --- | --- | :-: |
| *«Marca temporal por emisión»* | **V-3** — *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* | ✅ **Correcto. Debe conservarse** |
| *«la vigente es la más reciente»* | **V-2** | 🔴 **Contrario a la regla vigente** |

> ⚠️ **`ADS-02 §7` no tiene fila propia para V-3.** Si la corrección se limitara a sustituir el texto, **desaparecería la única mención a la conservación de la marca temporal**, que V-3 **sigue exigiendo**. **Hay que separar las dos filas, no reemplazar una.**

## 2.3 Problema 3 — las garantías ya no son siete

**ADR-13 v1.3 Cambio C añadió:**

| # | Garantía |
| --- | --- |
| **G-8** | **Unicidad de identidad** — impedir múltiples registros con la misma identidad lógica |
| **G-9** | **Atomicidad de la persistencia** — operaciones concurrentes no producen duplicados |
| **G-10** | **Resolución determinista de conflictos** — no duplicar, no sobrescribir en silencio, resultado determinista |

> **La fila dice «Siete garantías G-1 a G-7». Son diez.** Corregir solo la fila de vigencia dejaría §7 **parcialmente sincronizado**, que es peor que no sincronizado: sugeriría que se revisó entera.

---

# 3. Texto propuesto

## 3.1 Sustituir la fila «Versión vigente distinguible» por **dos filas**

```
| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión (`issue`) por fila.** La vigente es la de **mayor `issue` dentro de su clave de identidad** — no la de marca temporal más reciente (ADR-13 v1.3). Consulta por `MAX(issue)` sobre la clave, con índice compuesto |
| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas `issued_at` y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |
```

## 3.2 Sustituir la fila de garantías

```
| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead — es la garantía central.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |
```

## 3.3 Registro en el Historial de Versiones de ADS-02 — **v1.2**

> **Sincronización de §7 con ADR-13 v1.3.** La fila *«Versión vigente distinguible»* se desdobla en dos: **la vigencia pasa a determinarse por mayor número de emisión (`issue`)**, conforme a **V-2 enmendada**, y **la conservación de la marca temporal se declara en fila propia bajo V-3**, de la que carecía. La fila de garantías pasa de **siete a diez** con **G-8, G-9 y G-10**. **Ningún contenido de §3, §4, §5, §6, §8 ni §9 resulta afectado**: ni la selección de PostgreSQL, ni el compromiso de portabilidad, ni las alternativas evaluadas, ni las verificaciones de compatibilidad con ADR-05, ADR-08 y ADR-12.
>
> **Motivo:** §7 afirmaba que la versión vigente se determina por marca temporal, contra **ADR-13 v1.3 §10.3 V-2**, que declara que la determina el mayor `issue`. ADS-02 está **«Gobernado por ADR-13»**, de modo que la corrección corresponde a este documento *(ADS-00 R-1)*. Detectado en **COM-40/1**.

---

# 4. Impacto

## 4.1 En ADS-02

| Sección | Impacto |
| --- | :-: |
| **§7** | ⚠️ **Dos filas sustituidas, una añadida** — de 11 a 12 filas |
| §1, §2 | ✅ Ninguno |
| §3 *(RQ-1 a RQ-9)* | ⚠️ **Requiere ampliación separada** — §4.3 |
| §4, §5, §6 *(motor, justificación, alternativas)* | ✅ **Ninguno.** PostgreSQL y Supabase no se revisan |
| §8, §9 *(compat. ADR-05, ADR-08, ADR-12)* | ✅ Ninguno |
| §10, §11 | ✅ Ninguno |

> **La selección de motor no se toca.** PostgreSQL satisface el criterio nuevo igual de bien: una columna entera con índice compuesto y `MAX(issue)` es más simple que ordenar por marca temporal.

## 4.2 En código

> **Ninguno.** Los dos adapters versionados **ya ordenan por `issue`** *(COM-40/1 §3)*.

## 4.3 ⚠️ Lo que esta propuesta **NO** cubre

> **§7 declara cómo el motor satisface las garantías. §3 declara los requisitos exigidos al motor.**
>
> **Añadir a §3 los requisitos de unicidad compuesta derivados de G-8/G-9/G-10 es la Capa B de F-2** —COM-39 §7.1 acto 3—, **materia distinta y sprint distinto**. Esta propuesta **solo sincroniza §7**.

---

# 5. Documentos afectados

| Documento | Efecto | Acción |
| --- | :-: | --- |
| **ADS-02 §7** | 🔴 **Directo** | Aplicar §3 + registro v1.2 |
| **ADR-13 v1.3** | ✅ Ninguno | **Es la autoridad** |
| **ADS-02 §3** | 🟡 Pendiente | **F-2 Capa B** — sprint separado |
| **COM-19 §9** | ✅ Respondida | Cerrar formalmente |
| **`docs/blueprint/INDEX.md`** | ⚠️ Versión de ADS-02: **1.1 → 1.2** | Sincronización de catálogo |
| **ADS-01 §3.2** | ✅ Ninguno | No describe el criterio de vigencia |
| **ARCH-01** · **DDD-01** | ✅ Ninguno | — |

---

# 6. Autoridad para aplicarla

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Redacta** | **AKVEZ Architecture Team** | `Responsable` de ADS-02 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADS-02 v1.1 en **GOV-01** |

> **Esta propuesta permanece `Draft` hasta ese pronunciamiento.** No se aplica en este sprint.

---

# 7. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **La propuesta no se aplica.** ADS-02 §7 sigue diciendo «marca temporal», y **quien implemente el motor real leerá §7, no el código** — reintroduciendo la divergencia que ADR-13 v1.3 cerró | 🔴 **Alta** |
| **2** | **Se corrige solo la fila de vigencia** y la de garantías queda en «siete», sugiriendo que §7 se revisó entera | 🟡 Media |
| **3** | **La corrección elimina la mención a la marca temporal** en lugar de desdoblarla, y **V-3 pierde su única constancia en §7** | 🟡 Media |
| **4** | **Se confunde esta propuesta con la Capa B de F-2.** Son secciones distintas: **§7 describe cómo se satisface; §3 exige** | 🟢 Baja |

---

# 8. Referencias

**ADR-13 v1.2** §10.3 *(V-1 a V-5)*, §12.3 *(G-1 a G-7)* · **ADR-13 v1.3 Consolidated Amendment** Cambios B y C · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.1** *(cabecera)*, §3, §4, §5, §7, §8, §9 · **DDD-01 v1.1** §9.2 · **COM-19** §9 · **COM-39** §7.1 · **COM-40/1**.
