# COM-08 — Checklist de Aprobación del Perfil de Estrategia

| Campo | Valor |
| --- | --- |
| Código | COM-08 |
| Clasificación | **Checklist de gobernanza** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Instrumento. No aprueba nada** |
| Fecha | 2026-08-01 |
| Destinatario | **AKVEZ Product Office** |
| Motivo | Sprint 07 · Fase 2 |
| Objeto | **ADR-18 — Perfil de Estrategia** *(Draft)* |

> **ADR-18 sigue `Draft` y este documento no lo aprueba.** Existe para que la aprobación, cuando ocurra, no deje huecos: enumera lo que hay que decidir, lo que el código puede transcribir y **lo que el código nunca debe decidir**.

---

# 1. Qué debe aprobar el Product Office

**Cuatro actos, en este orden. Los cuatro son suyos y ninguno de ingeniería.**

| # | Acto | Sin él… |
| :-: | --- | --- |
| **1** | **Pronunciarse sobre las tres cuestiones abiertas** *(§2)* | El ADR no puede cerrarse: su contenido depende de las respuestas |
| **2** | **Ratificar o enmendar las doce reglas SP-01…SP-12** | No hay norma exigible, solo una propuesta |
| **3** | **Asignar el código oficial** del documento | `ADR-18` es provisional; asignarlo es acto de gobernanza |
| **4** | **Publicar `SP-01`** — la primera versión del criterio | 🔴 **`GenerateProposal` sigue bloqueado.** Aprobar el ADR **no desbloquea nada por sí solo** |

> ⚠️ **El acto 4 es el que más fácilmente se olvida y el único que desbloquea.** ADR-18 decide **qué es** el Perfil y **quién lo cambia**; **`SP-01` es su contenido**, y es un acto separado — igual que `WP-01` fue posterior a ADR-14. **Aprobar 1-3 sin 4 deja el bloqueo intacto con apariencia de resuelto** *(riesgo RA18-2)*.

---

# 2. Preguntas abiertas

| # | Pregunta | Por qué importa |
| :-: | --- | --- |
| **1** | **¿Puede el Perfil matizar la barrera** que APS-18 §9.2 ya tabula por momento? | Determina el contenido C-3 de cada versión. Si la tabla es intocable, el Perfil decide menos de lo previsto |
| **2** | **¿La designación es `SP-nn`** o APS-18 fija otro esquema? | Afecta a todo lo que se emita a partir de la aprobación |
| **3** | **¿El criterio se publica en APS-18** o en un anexo propio? | APS-18 es su autoridad de contenido *(DDD-01 §9.2)*; un anexo exigiría declarar su relación con ella |
| **4** | **¿Qué se hace con lo emitido bajo ausencia declarada?** | ADR-18 §10.4 propone **no reetiquetar**. Requiere confirmación |
| **5** | **¿Una versión nueva invalida lo emitido con la anterior?** | ADR-18 SP-05 propone **que no**, por paralelismo con ADR-14 §6.6 |

---

# 3. Qué puede transcribir el código

**Transcribir ≠ decidir.** El precedente es literal: `weightingProfile.ts` declara en su cabecera *«ESTE FICHERO NO DECIDE NADA. Transcribe los valores publicados en APS-08 §7.1»*.

| ✅ El código puede | Condición |
| --- | --- |
| Contener la **tabla de correspondencias** publicada | Con la designación de la versión que transcribe |
| Contener la **designación** `SP-nn` como constante | Recibida del documento, jamás construida |
| **Vincular** cada emisión a esa designación | Es lo que **RC-13** exige |
| **Declarar la ausencia** cuando no hay versión vigente | Con el marcador ya en uso |

| ⛔ El código nunca debe | Por qué |
| --- | --- |
| **Generar una versión** | **SP-07.** Un identificador autoasignado **no acredita ninguna decisión de gobierno** |
| **Derivar la versión de una fecha o un hash** | **SP-08.** Una fecha dice *cuándo*, no *bajo qué criterio*; y una versión debe poder **repetirse**, no solo ordenarse |
| **Inventar un `"v1"` provisional** | **SP-09 · R-38.** Sería un valor por defecto sustituyendo un dato inexistente |
| **Aplicar una estrategia por defecto** | Ver §4 |
| **Editar una versión publicada** | **SP-04 · R-INM.** Cambiar el criterio publica una versión nueva |
| **Ampliar la tabla sin publicación previa** | Convertiría al código en autoridad de contenido |

---

# 4. Las tres confirmaciones que el sprint exige

## 4.1 `criteriaVersion` no nace en código

> ✅ **Confirmado.** **SP-07** lo prohíbe; ADR-18 §10.1 lo razona; y **ninguna línea del código actual la genera**: `CRITERIA_VERSION_ABSENT` es una constante literal que **declara ausencia**, no una versión fabricada.

## 4.2 No existe versión automática

> ✅ **Confirmado.** No hay derivación de fecha, contador ni hash. **SP-08** lo prohíbe expresamente.
>
> **Distíngase del número de emisión:** `issue` y `sequence` **sí los deriva el sistema**, y es correcto — son **identidad de una emisión**, no versión de un criterio. Confundirlos sería el error.

## 4.3 No existe estrategia por defecto

> ✅ **Confirmado, y hoy es cierto por construcción:** `CreateSequence` **deja toda `strategy` ausente** y hay pruebas que lo verifican. **Ninguna capa la rellena.**
>
> **Es la confirmación más importante de las tres.** Una estrategia por defecto sería una decisión comercial tomada sin criterio y sin autor — indistinguible después de una decidida. **RC-10 · BD-R2 · R-38** prohíben rellenar lo ausente, y **ADR-15 §7.2** exige que toda estrategia sea reproducible a partir de una versión del Perfil. **Una estrategia por defecto no lo sería jamás.**

---

# 5. Después de la aprobación

| # | Paso | Responsable |
| :-: | --- | --- |
| 1 | Publicar `SP-01` con el contenido mínimo C-1…C-7 de ADR-18 §9 | **Product Office** |
| 2 | Transcribir a `domain/`, con la cabecera declarativa del precedente | Ingeniería |
| 3 | Sustituir el marcador de ausencia en las emisiones **nuevas** | Ingeniería |
| 4 | **No reetiquetar** las anteriores, si se confirma la pregunta 4 | — |
| 5 | Abrir el sprint de `GenerateProposal` | **Product Office** |

> **El paso 5 sigue exigiendo además resolver el productor de hechos observados** *(COM-04 §7.1)*. **Son dos bloqueos independientes**, y este checklist solo cubre uno.

---

# 6. Referencias

**ADR-13** §10.3 · **ADR-14** §6.6, §7.2, §8.1, R-INM · **ADR-15** §7.2, §7.4 · **ADR-16** RC-13 · **ADR-18** *(Draft)* §9, §10, §11, §14, SP-04…SP-09 · **APS-08** §7.1 · **APS-18** §9.2 · **DDD-01** §9.2 · **DEV-00** R-38 · **COM-04** · **COM-06**.
