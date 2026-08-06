# INDEX — `docs/architecture/`

| Campo | Valor |
| --- | --- |
| Alcance | Catálogo de la documentación arquitectónica de **`docs/architecture/`** |
| Última sincronización | **2026-08-04** — Sprint **COM-39** |
| Responsable | AKVEZ Architecture Team |

> ## ⚠️ Este índice **no es** `docs/blueprint/INDEX.md`
>
> **Son dos ficheros distintos.** Éste cataloga `docs/architecture/`; aquél cataloga el **Blueprint**, cuya Clasificación Oficial es cerrada *(ADS-00)*.
>
> **`docs/blueprint/INDEX.md` no ha sido modificado.** El alta de ADR-19 y de la enmienda ADR-13 v1.3 en el catálogo del Blueprint es un **acto pendiente** que corresponde al Product Office en un cierre de bloque de gobernanza.

---

# 1. Decisiones aprobadas

| Documento | Estado | Fecha | Aprobado por |
| --- | :-: | :-: | --- |
| **ADR-19 — Agent API Factory Construction Pattern** | ✅ **Approved** | 2026-08-04 | AKVEZ Architecture Team |
| **ADR-13 v1.3 — Consolidated Amendment** | ✅ **Approved** | 2026-08-04 | AKVEZ Architecture Team |

## 1.1 Qué decide cada una

| Documento | Decide |
| --- | --- |
| **ADR-19** | La **firma de la factoría de la Agent API**: objeto de dependencias nombrado *(D-1)*, más cinco reglas ya vigentes enunciadas para `presentation/` *(D-2 a D-6)*. **Levanta B-4** |
| **ADR-13 v1.3** | **A** — contenido canónico de **A-6** · **B** — la versión vigente es la de **mayor `issue`**; `issuedAt` es metadato · **C** — garantías **G-8, G-9, G-10** de identidad. **Levanta B-5 y la Capa A.2 de F-2** |

---

# 2. Serie COM — auditorías y decisiones de sprint

**Documentos de trabajo. No pertenecen a la Clasificación Oficial de ADS-00 y no tienen autoridad propia.**

| Documento | Materia |
| --- | --- |
| COM-02 a COM-11 | Inteligencia comercial, Perfil de Estrategia, contrato de entrada de `GenerateProposal` |
| COM-12 a COM-23 | Contratos reducidos, persistencia de A-6, auditoría de integración |
| COM-24 a COM-32 | Agent API, orquestación, infracción de R-07 y su corrección |
| COM-33 | Consolidación arquitectónica — mappers, factoría nominal, auditoría de F-2 |
| **COM-34** a **COM-38** | **Gobernanza.** Superseded by **ADR-13 v1.3** and **ADR-19** — §3 |
| **COM-39** | **Cierre de gobernanza.** Auditoría de este sprint |

---

# 3. Documentos superados por las decisiones de COM-39

**Ninguno se elimina. Ninguno se marca `Deprecated`.** Conservan su valor como registro del análisis que condujo a las decisiones.

| Documento | Superseded by |
| --- | --- |
| **COM-34** *(1 documento)* | ADR-13 v1.3 · ADR-19 |
| **COM-35** *(4 documentos)* | ADR-13 v1.3 · ADR-19 |
| **COM-36** *(4 documentos)* | ADR-13 v1.3 · ADR-19 |
| **COM-37** *(5 documentos)* | ADR-13 v1.3 · ADR-19 |
| **COM-38** *(5 documentos)* | ADR-13 v1.3 · ADR-19 |

> ⚠️ **La supersesión alcanza a las materias decididas** —A-6, ordenamiento de versiones, patrón de factoría, garantías de F-2—. **No alcanza a las cuestiones que estos documentos registran y que siguen abiertas**, señaladamente **la enmienda de ADR-08 §13** *(COM-34 §6.1)*, que **ninguna de las dos decisiones de hoy toca**.

---

# 4. Bloqueos vigentes tras COM-39

| ID | Descripción | Sev. | Propietario |
| --- | --- | :-: | --- |
| **B-1** | `SP-01` sin publicar | 🔴 | Product Office |
| **B-2** | Reintentos del punto de control | 🔴 | Product Office, vía APS-17 |
| **CH-01/02/03** | Longitud de canal | 🔴 | Product Office |
| **F-1** | Dos puertos de redacción | 🟡 | Arquitectura |
| **F-2** | Unicidad de identidad — **Capa A.2 resuelta**; **B y C abiertas** | 🟡 | Arch. Team *(B)* · Engineering *(C)* |
| **F-3** · **F-9** | `userId` placeholder · `createdAt` no observable | 🟡 | Ingeniería |

**Levantados en este sprint:** **B-4** *(ADR-19)* · **B-5** *(ADR-13 v1.3 Cambio B)*.

---

# 5. Referencias

**ADS-00 v1.3** *(Clasificación Oficial, Jerarquía Documental)* · **`docs/blueprint/INDEX.md`** *(catálogo del Blueprint — fichero distinto, no modificado)*.
