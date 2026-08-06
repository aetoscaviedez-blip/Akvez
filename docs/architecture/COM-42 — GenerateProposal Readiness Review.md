# COM-42 — Revisión de Estado de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-42 / D |
| Clasificación | **Revisión de estado** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **`GenerateProposal` permanece DETENIDO** |
| Fecha | 2026-08-04 |
| Antecedentes | COM-10 §6 · COM-11 · handoff §2.3 · COM-39 · COM-41 |

> **Cero cambios de código. No se ha implementado nada.**

---

# 1. Conclusión

> ## 🔴 **`GenerateProposal` permanece detenido, y es el estado correcto.**

**Nada de lo ocurrido entre COM-39 y COM-41 —ADR-19, ADR-13 v1.3, la migración de dos Agent API— aproxima ni rodea los bloqueos de emisión.**

---

# 2. ¿B-1 sigue bloqueando? · ✅ **SÍ**

## 2.1 Estado

| Campo | Valor |
| --- | --- |
| **Bloqueo** | **B-1** — `SP-01` *(Perfil de Estrategia)* **sin publicar** |
| **Propietario** | **AKVEZ Product Office** |
| **Severidad** | 🔴 **Crítica** |
| **Movimiento desde COM-39** | **Ninguno** |

## 2.2 Verificación en código

**`domain/commercial/selectStrategy.ts` — sigue lanzando:**

```
:16  // **TODO(B-1 · COM-11 §3.2) — transcribir el Perfil de Estrategia cuando `SP-01`
:87  throw new StrategyProfileUnavailableError(
:88    "La decisión de estrategia exige el Perfil de Estrategia publicado (SP-01, bloqueo B-1). "
```

## 2.3 Por qué es la conducta correcta

> **Sin versión del Perfil de Estrategia la emisión no es reproducible** *(ADR-15 §7.2)*, y **P-I1** *(ADR-16 §4.4)* exige que una `Proposal` pueda explicarse después: *«sin estrategia y evidencia no puede explicarse después»*.
>
> **Emitir con `SP-01` ausente produciría propuestas etiquetadas `SIN-PERFIL-DE-ESTRATEGIA` de forma permanente** — **ADR-18 §10.4 propone no reetiquetarlas**, de modo que **el defecto sería irreversible** *(COM-10 §5)*.

---

# 3. ¿B-2 sigue bloqueando? · ✅ **SÍ**

## 3.1 Estado

| Campo | Valor |
| --- | --- |
| **Bloqueo** | **B-2** — **número de reintentos del punto de control** sin valor aprobado |
| **Propietario** | **AKVEZ Product Office**, vía **APS-17** |
| **Severidad** | 🔴 Crítica |
| **Movimiento desde COM-39** | **Ninguno** |

## 3.2 Verificación en código

**`domain/commercial/controlPoint.ts` — sigue lanzando:**

```
:40  // **B-2**, es **criterio comercial y no capacidad técnica** (COM-11 §4.3)
:73  throw new ControlPointUnavailableError(
```

> **El punto de control no tiene cuerpo, y no puede tenerlo:** el número de reintentos es **criterio comercial, no capacidad técnica** *(COM-11 §4.3)*. Decidirlo en `domain/` sería que el caso de uso fijara un parámetro que no le corresponde *(R-52)*.

---

# 4. ¿Algún cambio de ADR-19 afecta a `GenerateProposal`? · ❌ **NO**

## 4.1 Análisis decisión por decisión

| Decisión de ADR-19 | ¿Afecta a `GenerateProposal`? | Motivo |
| --- | :-: | --- |
| **D-1** — factory nominal | ❌ **No** | `createPitchGeneratorAgent` **ya cumplía** desde COM-33 |
| **D-2** — sin dependencias opcionales | ❌ No | Ya cumplía |
| **D-3** — la factory no ejecuta trabajo | ❌ No | Ya cumplía |
| **D-4** — Composition Root único constructor | ❌ No | Ya cumplía |
| **D-5** — Agent API, frontera pública | ❌ No | Ya cumplía |
| **D-6** — el Orchestrator no alcanza `application/` | ❌ **No** | **Corregido en COM-31**, antes de ADR-19 |

> ### **ADR-19 no tocó `pitchGeneratorAgent`, ni el caso de uso, ni el Orchestrator.** La migración de COM-41 alcanzó **solo** a `createLeadHunterAgent` y `createLeadAnalyzerAgent`.

## 4.2 ¿Y ADR-13 v1.3?

| Cambio | ¿Afecta a `GenerateProposal`? |
| --- | :-: |
| **A** — contenido canónico de A-6 | ❌ **No.** `contracts/Proposal.ts` ya replicaba **ADR-16 §4.4** |
| **B** — vigencia por `issue` | ❌ **No.** `inMemoryProposalAdapter` ya ordenaba por `issue` |
| **C** — G-8/G-9/G-10 | ❌ **No.** Son garantías **exigidas al motor**; no hay motor |

> **Ambas decisiones regularizaron lo que el código ya hacía. Ninguna alteró el comportamiento de la emisión.**

---

# 5. ¿Existe código preparado para `SP-01`? · ⚠️ **Sí — preparado, y deliberadamente sin cuerpo**

## 5.1 Qué existe

| Elemento | Estado |
| --- | :-: |
| `selectStrategy.ts` | ✅ **Existe.** Punto de decisión declarado — **lanza** |
| `controlPoint.ts` | ✅ **Existe.** Punto de control declarado — **lanza** |
| `proposalErrors.ts` | ✅ Dos errores tipados sobre la taxonomía cerrada |
| `generateProposal.ts` | ✅ Flujo completo: validar → estrategia → redacción → control → persistir |
| `proposalDraftingPort` + adapter | ✅ Construidos y cableados |
| Persistencia de A-6 | ✅ Contrato, modelo, mapper, adapter, suite |
| `commercialProposalOrchestrator` | ✅ Construido y cableado |
| Agent API | ✅ **Expone `generateProposal`** — siete operaciones |

## 5.2 Qué NO existe, y es correcto

| Elemento | Estado |
| --- | :-: |
| **Cuerpo de `selectStrategy`** | ❌ **Lanza.** ⛔ B-1 |
| **Cuerpo del punto de control** | ❌ **Lanza.** ⛔ B-1 y B-2 |
| **Bucle rehacer → verificar** | ❌ ⛔ B-2 |
| **Ruta HTTP de propuesta** | ❌ **No existe, y no debe existir** |

## 5.3 Verificación de la ausencia de ruta

**`routes/index.ts` registra cinco endpoints:**

```
/api/health · /api/prospect/search · /api/leads
/api/prospect/outreach · /api/leads/:leadId/diagnosis · /api/leads/:leadId/sequence
```

> ### **No hay ruta de propuesta.** `compositionRoot.test.ts` lo verifica: *«sin endpoints nuevos… `expect(Object.keys(deps)).not.toContain("handleProposal")`»*.

## 5.4 ⚠️ Precisión importante

> **«Código preparado para SP-01» no significa «código a la espera de un valor».**
>
> **`selectStrategy` no tiene una constante vacía ni un valor por defecto que rellenar.** **Lanza**, y su cabecera lo declara. Es la aplicación de la regla que el handoff §5.5 fijó:
>
> > *«Antes de añadir una constante, un valor por defecto o una rama nueva, comprobar que un documento aprobado la publica. Si no la publica: **declarar la ausencia o lanzar. Nunca rellenar.**»*
>
> **Cuando `SP-01` se publique, el trabajo será transcribir C-3a/b/c** *(COM-11 §3.2)* **con la cabecera «ESTE FICHERO NO DECIDE NADA»**, precedente `weightingProfile.ts` — **no rellenar un hueco esperando**.

---

# 6. Resumen

| Pregunta | Respuesta |
| --- | :-: |
| **¿B-1 sigue bloqueando?** | ✅ **Sí** — `selectStrategy` lanza |
| **¿B-2 sigue bloqueando?** | ✅ **Sí** — el punto de control no tiene cuerpo |
| **¿ADR-19 afecta a `GenerateProposal`?** | ❌ **No** — `pitchGeneratorAgent` ya cumplía |
| **¿ADR-13 v1.3 afecta a `GenerateProposal`?** | ❌ **No** — regularizó lo ya implementado |
| **¿Existe código preparado para `SP-01`?** | ⚠️ **Toda la cadena, salvo dos puntos que lanzan** — por diseño |
| **¿Existe ruta HTTP?** | ❌ **No, y no debe** |

## 6.1 Qué desbloquearía la emisión

| # | Acción | Quién | Desbloquea |
| :-: | --- | --- | :-: |
| **1** | **Publicar `SP-01`** con C-3a, C-3b y C-3c | **Product Office** | **B-1** |
| **2** | **Fijar el número de reintentos** y su documento de autoridad | **Product Office**, vía APS-17 | **B-2** |
| **3** | **Publicar la longitud de canal** — CH-01, CH-02, CH-03 | **Product Office** | El adapter deja de enviar sin límite |

> **Las tres son del Product Office. Ninguna es de Ingeniería ni de Arquitectura.**

## 6.2 Orden cuando llegue `SP-01`

> **`selectStrategy` → punto de control (APS-18 §10.3, cinco comprobaciones) → bucle con el valor de B-2 → y SOLO ENTONCES la ruta HTTP.**
>
> *(handoff §5.4, sin cambios.)*

---

# 7. Conclusión

> ## **`GenerateProposal` permanece detenido, y correctamente detenido.**
>
> **No es un defecto pendiente de arreglar: es la conducta que el Blueprint exige.** Ningún trabajo de gobernanza de COM-39 a COM-42 lo altera, y **ninguno debía alterarlo**.

---

# 8. Referencias

**ADR-15 v1.2** §7.2 · **ADR-16 v1.1** §4.4 *(P-I1 a P-I5)* · **ADR-18 v0.1** §10.4 · **ADR-19 v1.0** §5.1 a §5.6, §9.2 · **ADR-13 v1.3 Consolidated Amendment** · **APS-17** · **APS-18** §10.3 · **DEV-00** R-38, R-52 · **COM-10** §5, §6 · **COM-11** §3.2, §4.3 · **COM-30** · **COM-31** · **COM-33** §3 · **COM-39** · **COM-41** · **handoff** §2.3, §5.4, §5.5.
