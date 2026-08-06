# COM-15 — Propiedad y Origen de `criteriaVersion`

| Campo | Valor |
| --- | --- |
| Código | COM-15 |
| Clasificación | **Contrato técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Decide el origen. No publica ninguna versión y no enmienda ningún ADR aprobado** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 10 · Fase 5 |
| Relacionado | COM-07 §4 · COM-11 §3 · COM-13 §5.2 · ADR-14 · ADR-15 §7.4 · ADR-18 *(Draft)* |

> **Este documento no crea ninguna versión.** No publica `SP-01`, no fija su contenido y no desbloquea B-1.

---

# 1. Qué es `criteriaVersion`

> **La designación de la versión del Perfil de Estrategia bajo la que se produjo una emisión.**

**RC-13 — toda entidad emitida conserva la versión del criterio que la produjo.** *«Sin ella, una decisión conservada no puede reproducirse»* *(DDD-01 §4.2)*.

## 1.1 Qué NO es

| No es | Por qué |
| --- | --- |
| **Una versión de software** | Versiona **el criterio comercial**, no el código que lo aplica |
| **Un parámetro** | `Configuración` y `Parámetros` son sinónimos **prohibidos** del Perfil *(DDD-01 §8)*: *«un parámetro se ajusta; esto **se versiona y se vincula a cada emisión**»* |
| **Un artefacto técnico** | **Es una decisión de producto.** De ahí las prohibiciones de §4.2 |

---

# 2. Propietario

> ## **Product Office.**

**No está abierta: ya está decidida** *(COM-10 §2.1)*.

| Fuente | Qué establece |
| --- | --- |
| **ADR-15 §7.4 (RA-7)** | Atribuye el Perfil de Estrategia al **Product Office** |
| **DDD-01 §2.2 · §4.2** | Lo confirma, y declara **Product Office** owner del Value Object |
| **DDD-01 §9.2** | El criterio comercial **lo decide APS-18** |

**Reparto exacto** *(COM-10 §2.1, pregunta 4)*:

| | |
| --- | --- |
| **Producto decide** | El criterio · la designación · la aprobación · la sucesión de versiones |
| **El código hace** | **Transcribir** · vincular cada emisión a la designación · **declarar la ausencia** cuando no hay versión |
| **El código nunca** | Generar una versión · derivarla de fecha o hash · inventar `"v1"` · editar una publicada · ampliar la tabla |

---

# 3. Fuente

## 3.1 La decisión

> ## **`criteriaVersion` lo estampa `domain/` desde el criterio que aplicó. No entra como argumento.**

**El Perfil se transcribe en `domain/` junto a su designación, y la emisión se sella con la designación del perfil que realmente se usó.**

## 3.2 Por qué — el precedente es literal y está en el código

**AKVEZ ya resolvió este problema exacto para el Opportunity Score**, y **COM-10 §2.1 declara ese precedente aplicable**: *«es el precedente exacto de `weightingProfile.ts` respecto de APS-08 §7.1»*.

| Pieza | Qué hace hoy |
| --- | --- |
| `weightingProfile.ts` | Transcribe los pesos **y la designación**: `version: "WP-01 v1.0"`. Cabecera: **«ESTE FICHERO NO DECIDE NADA»** |
| `currentWeightingProfile()` | *«El perfil vigente. **Único punto del código que decide cuál se aplica**»* |
| `opportunityScore.ts` | `profileVersion: profile.version` — **la emisión se sella desde el perfil aplicado** |
| `generateDiagnosis.ts` | `criteriaVersion: CRITERIA_VERSION_ABSENT`, **importado de `domain/`** |

> **En los dos precedentes la versión nunca es un argumento: acompaña al criterio y viaja con él hasta la emisión.**

## 3.3 Por qué no puede ser un argumento

**Es el punto en que la decisión se separa del borrador de COM-07 §6, y la razón es de integridad, no de estilo.**

Si la versión entra por argumento, **quien invoca puede declarar una versión distinta de la que el dominio aplicó**: una emisión sellada como `SP-02` producida por el criterio transcrito de `SP-01`. **Nada en el sistema podría detectarlo**, y el sello dejaría de probar lo único que existe para probar.

**Eso vacía RC-13 y ADR-15 §7.2:** *«dado el mismo diagnóstico, el mismo estado y la misma versión del Perfil»* solo es verificable si **la versión sellada es la que se aplicó**.

**Y la lectura literal de COM-07 §4.1 —*«bajo qué versión debe decidirse»*— no añade capacidad**: **ADR-14 §9.2**, que gobierna el precedente, garantiza *«una y sola una versión vigente en cada momento»* y que **ninguna emisión se produce bajo una versión que no lo sea**. Si ADR-18 replica esa gobernanza —y §9 de ADR-18 replica el sobre de ADR-14 §7.2—, **el argumento solo podría llevar legalmente la versión vigente**: exactamente la que `domain/` ya tiene, con la posibilidad añadida de equivocarse.

> ⚠️ **Condición de revisión.** Si **ADR-18** se aprueba permitiendo emitir bajo una versión **no vigente** —reproducir una decisión histórica—, el argumento recupera su función y **esta decisión debe revisarse**. Hoy ningún documento lo permite.

## 3.4 Dónde vive, capa por capa

| Pregunta del sprint | Respuesta |
| --- | --- |
| **¿Strategy Profile?** | ✅ **Sí, es su contenido**: la designación es C-1 del sobre de ADR-18 §9 y **pertenece al Perfil**, no a quien lo consume |
| **¿Domain constant?** | ✅ **Sí, como transcripción**: `domain/` copia la designación publicada. **No la decide** |
| **¿Application layer?** | ⛔ **No.** `application/` **coordina; no decide** *(D-2 · RC-3)*. Puede leer la designación del dominio para sellar la emisión; **no puede elegirla ni recibirla** |
| **¿Otro documento aprobado?** | ✅ **APS-18** es la autoridad de contenido *(DDD-01 §9.2)*; **ADR-18** define el sobre y la sucesión |

## 3.5 ¿Debe llegar como input del Orchestrator?

> ## **No.**

**Un Orchestrator no contiene lógica de negocio** *(R-10)*, y **elegir bajo qué criterio se emite es la decisión comercial más determinante del sistema**. Que la transportase —aunque fuese copiando una constante— lo convertiría en el punto donde se decide el criterio.

**El Orchestrator compone las cuatro fuentes de COM-07 §1 y ninguna de ellas es el criterio:** el criterio no es evidencia que se reúna, es la regla con la que se lee.

---

# 4. Reglas de cambio

## 4.1 Cómo cambia una versión

| Regla | Enunciado |
| --- | --- |
| **Inmutabilidad** | **Una versión publicada no se edita.** Si el criterio cambia, **se publica una versión nueva** — precedente **R-INM** en `weightingProfile.ts` |
| **Identidad** | La designación **nunca se reutiliza** *(ADR-14 §9.1, C-1)* |
| **Vigencia** | **Una y sola una vigente** en cada momento *(ADR-14 §9.2)* |
| **Sucesión** | Toda versión posterior a la inicial declara **a cuál sucede**, por qué y con qué impacto *(ADR-18 §9, C-6…C-10)* |
| **Vinculación** | Toda entidad emitida **conserva la designación aplicada** *(RC-13)* |
| **Retroactividad** | **Las emisiones bajo ausencia no se reetiquetan** — propuesto en ADR-18 §10.4, **pendiente de confirmación** *(COM-11 §2.2)* |

## 4.2 Prohibido en código — sin excepción

| Prohibido | Por qué |
| --- | --- |
| **Generar una versión** | Producto decide; código transcribe |
| **Derivarla de una fecha o de un hash** | Sería un artefacto técnico haciéndose pasar por una decisión |
| **Un contador incremental** | Ídem, y **ADR-14 §9.1** exige que la designación no se reutilice ni se derive |
| **Inventar `"v1"`** | **R-38 · RC-10 · BD-R2** — un valor por defecto que sustituye a un dato inexistente |
| **Editar una versión publicada** | **R-INM** |
| **Ampliar la tabla del Perfil** | **COM-11 §3.3** |

## 4.3 Mientras no exista `SP-01` — la ausencia declarada

**`CRITERIA_VERSION_ABSENT = "SIN-PERFIL-DE-ESTRATEGIA"`** ya existe, está en uso por `GenerateDiagnosis` y **es la forma aprobada de conservar la ausencia**.

**Se declara la ausencia en lugar de fabricar una versión:** inventar `"v1"` produciría **apariencia de trazabilidad sin trazabilidad**, que es exactamente lo que RC-13 existe para impedir. **RE-3 — lo desconocido se declara, no se disimula.**

**Es detectable por búsqueda:** el día que `SP-01` se publique, ese identificador marca cada emisión que debe migrarse —o que ADR-18 §10.4 decide **no** reetiquetar—.

---

# 5. Relación con el Strategy Profile

| | **Perfil de Estrategia (`SP-01`)** | **`criteriaVersion`** |
| --- | --- | --- |
| Qué es | **El criterio**: las tres correspondencias C-3a/b/c *(COM-11 §3.2)* | **Su designación** |
| Dónde se publica | **APS-18** *(DDD-01 §9.2)*; el sobre lo define **ADR-18 §9** | Dentro del propio Perfil, como C-1 |
| Qué hace el código | **Transcribe** las correspondencias en `domain/` | **Transcribe la designación** y la sella en cada emisión |
| Qué viaja a la emisión | **Nada.** El criterio decide; no se conserva | **La designación**, y solo ella |

> **Son inseparables por diseño: la designación sin el criterio no reproduce nada, y el criterio sin designación no es citable.** Que ambos se transcriban **en el mismo lugar** es lo que impide que se separen.

**Estado: `SP-01` no está publicado.** Bloqueo **B-1**, propietario **Product Office** *(COM-11 §1)*. **Este documento no lo desbloquea.**

---

# 6. Impacto

## 6.1 Cambios de código pendientes de aprobación

| # | Cambio | Alcance |
| :-: | --- | --- |
| **1** | **Retirar `criteriaVersion` de `GenerateProposalInput`** | `application/generateProposal.ts` y sus tres suites. La entrada de COM-07 §6 pasaría de **cinco campos a cuatro** |
| **2** | **Sellar la emisión desde `domain/`** | Donde hoy se lee `input.criteriaVersion` — dos puntos: la emisión y la entrega a persistencia |
| **3** | **Un punto único que declara el criterio vigente**, simétrico de `currentWeightingProfile()` | `domain/commercial/`. **Devolvería hoy la ausencia declarada; no una versión inventada** |
| **4** | **Mover `CRITERIA_VERSION_ABSENT`** de `diagnoseBuyer.ts` a `criteriaVersion.ts` | Traslado mecánico. Hoy la marca de ausencia vive en el fichero de la lectura del comprador, no en el del Value Object que la nombra |

**Ninguno se ejecuta en esta fase.** **El cambio 1 es el único que altera un contrato ya escrito**, y con él desaparece `MissingCriteriaVersionError`: **una entrada no puede omitir lo que no envía**.

## 6.2 Qué NO cambia

- **`selectStrategy` sigue lanzando.** Sin `SP-01` no hay criterio, y **no existe estrategia por defecto** *(RC-10 · BD-R2 · R-38)*.
- **`GenerateDiagnosis` no se toca**: ya sella desde `domain/`, que es justo la forma que este documento generaliza.
- **Ningún ADR aprobado se enmienda.** ADR-14, ADR-15 y ADR-16 sostienen la decisión; **ADR-18 está `Draft`**, y §3.3 anota la única condición que la revisaría.

---

# 7. Referencias

**ADR-14** §7.1, §7.2, §9.1, §9.2, R-INM · **ADR-15** §7.2, §7.4, RA-7 · **ADR-16** §7, RC-3, RC-10, RC-13 · **ADR-17** §7.3, D-2 · **ADR-18** *(Draft)* §9, §10.4, §11 · **APS-08** §7.1 · **APS-18** · **DDD-01** §2.2, §4.2, §8, §9.2 · **DEV-00** R-10, R-38, R-52, BD-R2 · **COM-07** §4.1, §4.3, §6 · **COM-10** §2.1 · **COM-11** §1, §2.2, §3.2, §3.3 · **COM-13** §5.2.
