# COM-48 — Análisis de Nomenclatura del Campo de Versión

| Campo | Valor |
| --- | --- |
| Código | COM-48 / 2 |
| Clasificación | **Análisis de ubicación documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **DETENIDO** — requiere modificar DEV-00. Propuesta registrada, **no aplicada** |
| Fecha | 2026-08-04 |
| Objeto | `issue` frente a `emission` |
| Antecedentes | COM-43 §5.4 *(H-7)* · COM-44/1 §2, §3 · COM-45/1 §2.4 · COM-46/2 §5 |

> **DEV-00 no ha sido modificado. Ningún documento del Blueprint tocado por este análisis.**

---

# 1. El hecho

| Activo | Campo | ¿Cumple **V-2**? |
| :-: | :-: | :-: |
| **A-6** Propuesta | `issue` | ✅ |
| **A-11** Diagnóstico Comercial | `issue` | ✅ |
| **A-4 / A-5** Análisis y Opportunity Score | **`emission`** | ✅ **Sí** |

> ### **Los tres cumplen V-2.** Ordenan por número de emisión; **ninguno por marca temporal** *(COM-43 §5.2)*.
>
> **No es un defecto de conformidad: es una inconsistencia de nomenclatura.**

**Y ADR-13 §10.3 V-2, ya aplicada, cita `(issue)` entre paréntesis** — lo que hace visible la divergencia sin resolverla.

---

# 2. Dónde debe vivir la convención

> ## **`DEV-00 §5.1 — Nombres`.**

## 2.1 Fundamento

**ADS-00, categoría DEV:**

| Campo | Texto literal |
| --- | --- |
| **Propósito** | *«Operacionalizar el Blueprint: convertir decisiones aprobadas en reglas, **convenciones** y procesos que puedan comprobarse sobre la implementación»* |
| **Alcance** | *«Estructura del repositorio, **convenciones técnicas**, organización del código…»* |
| **Documentos admisibles** | *«Reglas de implementación, **convenciones de código**…»* |

**Y la convención existe como sección: `DEV-00 §5.1 — Nombres`**, con once entradas.

## 2.2 Descarte de los demás candidatos

| Candidato | ¿Por qué NO |
| --- | --- |
| **ADR-13** | ⛔ **Excluido por el sprint.** Y con fundamento: **la nomenclatura técnica es materia de DEV**, no de ADR *(ADS-00)*. El enunciado normativo de V-2 es *«mayor número de emisión»*; `(issue)` es paréntesis ilustrativo |
| **ADS-02** | ⛔ **Excluido por el sprint.** Y con fundamento: es *Documento de Implementación* del **motor**; describe **cómo PostgreSQL satisface** las garantías, no cómo se llaman los campos del contrato. **COM-47 escribió su fila de vigencia sin nombrar el campo, precisamente por esto** |
| **ADR-08 §6** | ❌ Fija el nombre del **Persistence Contract** *(«nombre de la entidad, sin sufijo»)*, **no de sus campos** |
| **ADS-01 §3.2** | ❌ Es **mapa tema → documento**. Remite, no decide |
| **ARCH-01** | ❌ *«No es autoridad: es un mapa físico… ante discrepancia prevalece el ADR»* — **ADS-01 §3.1** |

> ### **DEV-00 §5.1 es el único candidato con autoridad sobre la materia.**

---

# 3. 🔴 Por qué el sprint se detiene aquí

**La Tarea 3 lo condicionaba: *«Si requiere modificar DEV-00: DETENER y registrar propuesta.»* Lo requiere.**

## 3.1 DEV-00 §5.1 no tiene fila que cubra el caso

**Sus once entradas, íntegras:**

| Elemento | Nivel |
| --- | :-: |
| Entidad de dominio · Persistence Contract · Persistence Model · Repository Interface · Database Adapter | **Tipo / fichero** |
| DTO público · Mapper público | **Tipo / fichero** |
| Caso de uso · Factory de caso de uso · Tipo de la función de caso de uso · Agent API | **Función / tipo** |

> ### **Las once nombran *artefactos* —ficheros, tipos, funciones—. Ninguna nombra un *campo dentro de un contrato*.**

**Y §5.3 — *Interfaces y tipos*— tampoco:** sus cuatro reglas tratan de **derivación y estructura** *(R-16, R-14, R-38, ADR-08 §6)*, no de nombres de miembro.

## 3.2 ⚠️ No es «añadir una fila»: es extender la granularidad de §5.1

> **Hoy §5.1 gobierna la nomenclatura de artefactos. Cubrir el nombre de un campo la extiende al nivel de miembro.**
>
> **Es una decisión de alcance sobre DEV-00**, no una entrada más. **Debe tomarse a sabiendas**, y no le corresponde a este análisis.

---

# 4. Propuesta registrada — **NO aplicada**

## 4.1 Ubicación

**`DEV-00 §5.1`**, fila nueva.

## 4.2 Las opciones que el propietario debe valorar

> **Se enumeran como información. Este documento NO elige** — el sprint prohíbe crear decisiones nuevas.

| # | Opción | Impacto en código | Nota |
| :-: | --- | :-: | --- |
| **A** | **Unificar en `issue`** | ⚠️ **Sí** — `LeadAnalysis` contract, `LeadAnalysisModel`, `leadAnalysisMapper`, `inMemoryLeadAnalysisAdapter` | Alinea con **A-6 y A-11**, y con el paréntesis de V-2 |
| **B** | **Unificar en `emission`** | ⚠️ **Sí, mayor** — `Proposal`, `BuyerDiagnosis`, sus modelos, mappers y dos adapters | Alinea con el término del Blueprint: **V-2 dice *«número de emisión»*** |
| **C** | **Declarar ambos admisibles** y que la regla es el **concepto** | ❌ **Ninguno** | Registra el estado actual. **Deja la inconsistencia** |
| **D** | **No añadir regla** | ❌ Ninguno | El próximo activo versionado elegirá sin criterio |

> ⚠️ **Tensión entre A y B que conviene ver:** **el Blueprint dice *«número de emisión»***, que se traduce naturalmente como `emission`; **pero el paréntesis de V-2 y dos de los tres activos dicen `issue`**. **Ninguna autoridad resuelve cuál prevalece.**

## 4.3 Lo que la propuesta NO contempla

- ❌ **No se propone modificar ADR-13** — el sprint lo excluye y la materia no es suya.
- ❌ **No se propone modificar ADS-02** — ídem. **COM-47 ya escribió su fila sin nombrar el campo.**
- ❌ **No se propone tocar código.** Cualquier unificación lo arrastraría, y **requiere sprint propio**.

---

# 5. Propietario

| Rol | Actor |
| --- | --- |
| **Decide la convención y su alcance** | **AKVEZ Architecture Team** — vía **DEV-00 §5.1** |
| **Ejecuta la unificación, si se decide A o B** | **Ingeniería**, en sprint propio |

**Severidad:** 🟢 **Baja.** **No hay defecto de conformidad**: los tres activos cumplen V-2. El riesgo es de **legibilidad y de deriva futura**.

---

# 6. Riesgo de no resolverlo

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **Un lector de V-2 concluye que A-5 incumple** por usar `emission`, cuando su semántica cumple | 🟡 Media |
| **2** | **El próximo activo versionado elige nombre sin criterio** y añade una tercera forma | 🟢 Baja |
| **3** | **La unificación se hace tarde**, con más código que arrastrar | 🟢 Baja |

---

# 7. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **La convención debe vivir en `DEV-00 §5.1`** — único candidato con autoridad |
| **2** | **No pertenece a ADR-13 ni a ADS-02**, y ambos ya están redactados en consecuencia |
| **3** | 🔴 **Requiere modificar DEV-00 → sprint DETENIDO en este punto**, conforme a la Tarea 3 |
| **4** | **No es añadir una fila: extiende §5.1 del nivel de artefacto al de campo** |
| **5** | **Cuatro opciones registradas, ninguna elegida** |
| **6** | **Propietario: Architecture Team.** Severidad 🟢 baja — **no hay defecto de conformidad** |

---

# 8. Referencias

**ADS-00 v1.3** — *categoría DEV* *(propósito, alcance, documentos admisibles)*, R-7 · **ADS-01 v1.4** §3.1, §3.2 · **ADS-02 v1.2** §7 · **ADR-08 v1.2** §6 · **ADR-13 v1.3** §10.3 *(V-2)* · **ARCH-01 v1.3** · **DEV-00** §5.1, §5.3, R-14, R-16, R-38 · **COM-43** §5.2, §5.4 · **COM-44/1** §2, §3 · **COM-45/1** §2.4 · **COM-46/2** §5 · **COM-47**.
