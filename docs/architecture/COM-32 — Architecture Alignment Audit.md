# COM-32 — Auditoría de Alineación Documental

| Campo | Valor |
| --- | --- |
| Código | COM-32 |
| Clasificación | **Auditoría documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Registra qué quedó superseded y por qué. No altera ninguna decisión** |
| Fecha | 2026-08-04 |
| Motivo | Sprint 32 |
| Relacionado | **COM-30** *(la decisión)* · **COM-31** *(la ejecución)* · COM-23 a COM-29 |

> **Cero cambios de código.** Solo documentación COM.
>
> **Ninguna decisión histórica se ha borrado.** Cada documento afectado conserva su texto íntegro y recibe **un marcador al inicio** que declara qué secciones quedan superadas y qué sigue vigente.

---

# 1. Qué cambió, en una frase

**COM-30 detectó que `commercialProposalOrchestrator` invocaba `application/` directamente —infringiendo R-07 y ADR-04 §7.7— y COM-31 lo corrigió**: `GenerateProposal` entró en la Agent API y **no se creó ninguna ruta**.

**El error que arrastraban siete documentos era uno solo, y conceptual:**

> ### **Confundir la Agent API con la superficie de producto.**
>
> **ADR-04, glosario:** la Agent API es *«el conjunto de capacidades que el agente expone **hacia el Orchestrator**»*. **La publicación al producto es la ruta HTTP** *(§7.8)*.
>
> **Exponer ≠ publicar.** De ahí que B-1 —que impide publicar— se usara durante tres sprints para justificar una excepción de frontera que nunca justificó.

---

# 2. Registro de afirmaciones superadas

**Ocho documentos auditados. Siete afectados. COM-30 no lo está: es la fuente.**

| Doc | Sección | Afirmación superada | Por qué |
| --- | --- | --- | --- |
| **COM-23** | **§7.2**, último párrafo | *«Lo que sí exige una decisión… es si debe publicarse una operación que, con B-1 abierto, falla siempre»* | Exponer en la Agent API **no es publicar** *(COM-30 §2.2)* |
| **COM-24** | **§3.4** íntegro | *«`GenerateProposal` sigue sin operación en la Agent API… publicar una operación que siempre falla presentaría un bloqueo de gobernanza como si fuera una función del producto»* | **Es el origen del error.** El argumento vale para la ruta, no para la fachada |
| **COM-24** | **§5**, fila B-1 | *«Impide emitir y **desaconseja exponer** `GenerateProposal`»* | B-1 impide la ruta; **no desaconseja exponer** |
| **COM-25** | **§7**, BLOCKED fila 5 | *«Exponer `GenerateProposal` en la Agent API — Product Office»* | **No era de Product Office**: era obligación de **R-07** |
| **COM-26** | **§5.2** fila «Use cases» · **§5.5** · **§6.1** riesgo 1 · **§7** decisión 4 | *«El compositor tendría que recibir `GenerateProposalFn` directamente… es una asimetría»*, sin recomendación por pertenecer al Product Office | **No era asimetría: era infracción**, y la decisión era de arquitectura |
| **COM-27** | **§3** fila «Use cases» · **§7.3** fila 2 | *«Inyectado como `GenerateProposalFn`… consecuencia aceptada: asimetría con sus dos hermanos»* | **La consecuencia no era aceptable** |
| **COM-28** | **§4.2** fila `generateProposal` · **§4.4** último párrafo · **§6.2** riesgo 7 | Ídem, con severidad **🟡** | **Correspondía 🔴** *(COM-30 §7)* |
| **COM-29** | **§5** íntegro · **§6** decisión 4 · **§9** último párrafo | *«Mantener la inyección directa hasta que B-1 se cierre»* | **B-1 nunca la justificó**: la infracción era independiente del bloqueo |

## 2.1 Lo que **NO** queda superado, y conviene no confundir

| Doc | Qué sigue plenamente vigente |
| --- | --- |
| **COM-23** | Las **dos respuestas de §7**, los cuatro hallazgos de §4 y toda la verificación de fronteras de §3 |
| **COM-24** | **Todo lo demás**: es la fuente de la exposición de las **dos lecturas recortadas**, que COM-31 confirmó |
| **COM-25** | **§4.5** —la ausencia no cabe en el contrato— y las demás filas de §7 |
| **COM-26** | **Las decisiones 1 a 3 de §7**: ausencia, origen de los hechos e imports de `domain/` |
| **COM-27** | **§7.1** —la evidencia solo procede de `runCommercialFacts`, que evitó una infracción de RE-1— y **§5.2** |
| **COM-28** | ⚠️ **El razonamiento de §4.4 sobre las dos lecturas**: rechazar inyectarlas sueltas **sigue siendo correcto** |
| **COM-29** | ⚠️ **§0 y §1 a §4**, su aportación principal: **la premisa del sprint era falsa** —las lecturas siempre pasaron por la fachada— y las opciones A y C quedan descartadas |

> **La distinción importa:** cuatro de los siete documentos contienen, junto a la afirmación superada, **razonamientos que COM-31 confirmó**. Marcar el documento entero habría destruido esa distinción.

---

# 3. Decisión final

> ## **Una sola superficie por módulo. Una sola frontera de publicación.**

| # | Decisión | Estado |
| :-: | --- | :-: |
| **1** | **`GenerateProposal` vive en `PitchGeneratorAgentApi`** | ✅ **Ejecutada** — COM-31 |
| **2** | **Ningún Orchestrator invoca `application/`** | ✅ **Restituida** — R-07 |
| **3** | **No hay ruta de propuesta, y no debe haberla mientras B-1 siga abierto** | ⏸️ **Vigente** |
| **4** | **B-1 conserva un solo efecto: impedir la ruta** | ✅ **Aclarada** |
| **5** | **Una capacidad no publicada se expone en la Agent API y no recibe ruta** | ✅ **Patrón confirmado** — cinco precedentes *(COM-30 §3)* |

---

# 4. Impacto sobre el Blueprint

> ## **Ninguna enmienda. Ninguna regla nueva.**

**R-07 · ADR-04 §7.7 · §7.8 y el glosario ya gobernaban el caso.** Lo ocurrido **no fue un vacío normativo sino una lectura incompleta**: la regla existía y no se citó en siete documentos.

## 4.1 Lo único que sigue mereciendo enunciarse

**La dependencia workflow → workflow** —un Orchestrator recibiendo `runCommercialFacts`— **está en uso desde el Sprint 28 y ningún ADR la nombra**. No la prohíbe ninguna regla; **lo prohibido es que un *agente* conozca a otro** *(ADR-04 §7.6)*. **Sigue pendiente de enunciado**, no de decisión.

---

# 5. Archivos afectados

## 5.1 Modificados en este sprint — **solo documentación**

| # | Archivo | Cambio |
| :-: | --- | --- |
| **1** | `COM-23 — GenerateProposal Final Integration Audit.md` | Marcador **SUPERSEDED BY COM-31 — parcialmente** |
| **2** | `COM-24 — PitchGeneratorAgentApi Exposure.md` | Ídem |
| **3** | `COM-25 — GenerateProposal Orchestration Design.md` | Ídem |
| **4** | `COM-26 — GenerateProposal Orchestrator Design.md` | Ídem |
| **5** | `COM-27 — GenerateProposal Orchestrator Implementation Plan.md` | Ídem |
| **6** | `COM-28 — CommercialProposal Orchestrator Integration Audit.md` | Ídem |
| **7** | `COM-29 — Agent API Boundary Resolution.md` | Ídem |

**Cada marcador** *(a)* identifica las secciones superadas, *(b)* explica por qué, *(c)* **declara expresamente qué sigue vigente**, y *(d)* **no elimina una sola línea**.

## 5.2 Creados

**Este documento.**

## 5.3 No tocados

`src/` · `server/` en cualquiera de sus capas · pruebas · configuración. **Cero código.**

---

# 6. Riesgos pendientes

## 6.1 Documentales

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Un lector que abra un documento por su índice puede leer una afirmación superada** antes de llegar al marcador. **Mitigación**: el marcador está **inmediatamente bajo la cabecera**, antes de todo contenido | 🟢 |
| **2** | **COM-07 §6 sigue sin anotar** como *superseded* en los tres puntos que COM-14, COM-15 y COM-16 corrigieron. **Lo recomendó COM-18 §1.2 y nunca se hizo** — es la deuda documental más antigua abierta | 🟡 |
| **3** | **La serie COM tiene 32 documentos y ningún índice.** Localizar qué decide qué exige leerlos en orden | 🟡 |

## 6.2 Arquitectónicos — heredados, sin cambios

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **4** | **B-1 abierto**: el flujo nunca llega a emitir | 🔴 |
| **5** | **Sexto parámetro posicional** en `createPitchGeneratorAgent`; un séptimo pediría revisar la forma | 🟡 |
| **6** | **Tres operaciones de la fachada sin consumidor final** | 🟡 |
| **7** | **Dependencia workflow → workflow sin enunciado** *(§4.1)* | 🟡 |
| **8** | **Traducción duplicada entre mappers** *(COM-23 §4.1)* | 🟡 |
| **9** | **F-1** y la retirada del par heredado sobre A-6 | 🟡 |

---

# 7. Bloqueos restantes

**Sin cambios y sin tocar:** **B-1** · **B-2** · **CH-01/02/03** · **`COM-12 RC-4`** · **COM-16 §8.1 y §8.2** · **F-1**.

> **Ninguno es documental.** La alineación de este sprint **no desbloquea nada y no pretendía hacerlo**: deja el registro coherente con el código.

---

# 8. Referencias

**ADR-04** §7.6, §7.7, §7.8, glosario · **DEV-00** R-07, §4.4 *(corrección v1.3)* · **COM-07** §6 · **COM-18** §1.2 · **COM-23** a **COM-29** · **COM-30** · **COM-31**.
