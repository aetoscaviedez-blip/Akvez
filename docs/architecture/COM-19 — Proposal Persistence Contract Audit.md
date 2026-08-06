# COM-19 — Auditoría del Contrato de Persistencia de `Proposal`

| Campo | Valor |
| --- | --- |
| Código | COM-19 |
| Clasificación | **Auditoría de contrato** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Audita y dictamina. No implementa, no propone implementación y no enmienda ningún ADR** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 12 · Fase 1 |
| Relacionado | COM-09 · COM-12 · COM-13 · COM-15 · COM-16 · COM-18 · ADR-08 · ADR-13 · ADR-16 §4.4 |

> **Cero cambios de código.** Ninguna prueba modificada.

---

# 1. Alcance y método

**Comparación campo a campo** de la entidad de dominio `Proposal` (A-6) contra su Persistence Contract, su Repository Interface y el contrato de `CommercialStrategy` que ambos usan, leyendo el código y no la documentación.

| Superficie | Fichero |
| --- | --- |
| Entidad de dominio | `modules/pitch-generator/domain/commercial/Proposal.ts` |
| Persistence Contract | `shared/persistence/contracts/Proposal.ts` |
| Persistence Contract de la estrategia | `shared/persistence/contracts/CommercialStrategy.ts` |
| Repository Interface | `shared/persistence/repositories/ProposalRepository.ts` |
| Hecho afirmable | `modules/pitch-generator/domain/commercial/evidence.ts` |

---

# 2. Qué debe persistirse

**Nueve campos. Cada uno con la regla que lo exige; ninguno sobra.**

| Campo | Por qué debe conservarse | Regla |
| --- | --- | --- |
| **`leadId` · `moment` · `issue`** | **Son la identidad del agregado** | ADR-16 §4.4 · AG-1 |
| **`strategy`** | **Una `Proposal` no es solo el texto**: sin la estrategia *«no puede explicarse después, que es exactamente lo que la hace útil»* | **P-I1** |
| **`affirmableFacts`** | **Hace comprobable P-I4 *después***: sin ella nadie puede verificar que ninguna afirmación carecía de respaldo | **P-I4** · COM-09 §4.2 |
| **`text`** | Es el contacto que se emitió | ADR-16 §4.4 |
| **`channel`** | Dónde y cuándo tiene sentido | APS-18 §8.1 |
| **`criteriaVersion`** | **Toda entidad emitida conserva la versión del criterio** | **RC-13** |
| **`issuedAt`** | **Cada emisión conserva su marca temporal** | **V-3** |

## 2.1 Lo que el contrato NO expone, y hace bien

**No existe operación ni campo de estadio**, y **no puede existir**: emitir una `Proposal` **no cambia el estadio del Lead** *(P-I3 · LS-3)*, y ADR-13 v1.2 retiró A-3 de E-5 precisamente para cerrar esa conflación. **No existe «marcar como enviada»**: AKVEZ **no envía y no observa** *(P-I5 · PO-02 §6.2)*.

**`save` es append-only** *(V-1 · P-I2)* y **no hay borrado**: ADR-13 §10.1 no admite una cuarta operación.

---

# 3. Qué nunca debe persistirse — verificado ausente

| Prohibido | ¿Presente? | Regla |
| --- | :-: | --- |
| **La manifestación del comprador** | ✅ Ausente | COM-16 §5.5 — sería contenido enunciable ajeno a la proyección *(RE-1)* |
| **Los indicios del diagnóstico** | ✅ Ausente | COM-07 §2.2 — segunda vía hacia la lista cerrada |
| **Cualquier dato del Opportunity Score** *(score, banda, clasificación, `profileVersion`)* | ✅ Ausente | **BD-I5 · RC-12 · CD-11** — el diagnóstico no produce puntuación, y ninguna emisión comercial altera el Score |
| **Los cinco campos narrativos del análisis** | ✅ Ausente | COM-04 §4 — nunca pertenecieron a este agregado |
| **El estadio del Lead** | ✅ Ausente | P-I3 · LS-3 |
| **Variables `Desconocida` con valor** | ✅ Ausente | BD-I2 — el diagnóstico no se persiste aquí en ninguna forma |

**Ningún dato prohibido alcanza A-6.** La frontera está limpia en esa dirección.

---

# 4. Qué hoy no puede persistirse correctamente

## 4.1 La pérdida, con precisión

**Un hecho afirmable tiene cuatro campos. El contrato de persistencia conserva uno y medio.**

| Campo de `AffirmableFact` | Persistido | Recuperable después | Cómo |
| --- | :-: | :-: | --- |
| **`statement`** | ✅ Sí | ✅ Sí | Es el `string` que se almacena |
| **`lead`** | ⛔ No | ✅ **Sí** | Se deduce de `Proposal.leadId`: la proyección produce hechos de **un solo** Lead |
| **`kind`** | ⛔ No | ⛔ **No** | Uno de cuatro valores cerrados. **No se deduce del enunciado** |
| **`source.observation` · `source.source`** | ⛔ No | ⛔ **No** | Es la **Referencia de Origen** *(ADR-12 §7.1, §7.4)*. **Nada en la fila la contiene** |

**Ocurre dos veces en la misma fila**, porque el contrato declara `string[]` en dos sitios:

```text
Proposal.affirmableFacts       : string[]   ← eran AffirmableFact[]
Proposal.strategy.evidenceBase : string[]   ← eran AffirmableFact[]
```

## 4.2 Por qué no se puede reconstruir por otra vía

**La tentación es rehacer la proyección**: `generateAffirmableFacts` es determinista, luego bastaría volver a ejecutarla.

> **No sirve, y el motivo es el que hace útil conservar la lista.**

La proyección se alimenta de **atributos de la Empresa (A-2)** y **factores medidos de la evaluación (A-4)**, y **ambos cambian con el tiempo**: un negocio publica un sitio web, cambia su teléfono, acumula reseñas. **Reejecutarla produciría la lista de hoy, no la de la emisión.** Y P-I4 se pregunta por **la lista contra la que se verificó aquel texto**.

**Reconstruir `kind` y `source` desde el enunciado sería inventarlos** — prohibido por **R-38**: un valor por defecto que sustituye a un dato inexistente.

## 4.3 Consecuencia exacta sobre las reglas

| Regla | ¿Comprobable tras recargar? | Por qué |
| --- | :-: | --- |
| **P-I4** — ninguna afirmación sin evidencia en la lista | 🟡 **Parcialmente** | Se puede contrastar el texto contra los **enunciados**. **No se puede comprobar que cada enunciado fuese observado** |
| **APS-18 §11.1** — toda afirmación se rastrea hasta un hallazgo del análisis | ⛔ **No** | **El rastro es exactamente `source`**, y no está |
| **RE-2** — lo inferido no cruza al mensaje | ⛔ **No verificable** | Se apoyaba en `kind`, que solo admite clases observadas |

> **En memoria la trazabilidad es completa; en la fila persistida, no.** La diferencia solo se manifiesta en una auditoría posterior — **que es el momento para el que la lista se conserva**.

---

# 5. Verificación de los once elementos

| # | Elemento | Veredicto |
| :-: | --- | --- |
| **1** | **`evidenceBase`** | ⛔ **Degradado** a `string[]`. Pierde `kind` y `source` *(§4)* |
| **2** | **`affirmableFacts`** | ⛔ **Degradado** igual, en el mismo registro |
| **3** | **`criteriaVersion`** | ✅ **Íntegro.** `string`, hoy `SIN-PERFIL-DE-ESTRATEGIA`. **RC-13 satisfecho**: la designación se conserva, y **COM-15** garantiza que la selló `domain/` |
| **4** | **`strategy`** | 🟡 **Nueve de diez contenidos íntegros.** Solo `evidenceBase` se degrada |
| **5** | **`source`** | ⛔ **No se persiste.** Es el elemento que rompe §4.3 |
| **6** | **`kind`** | ⛔ **No se persiste** |
| **7** | **`issue`** | ✅ **Íntegro**, pero **lo calcula quien invoca** *(§7.2)* |
| **8** | **`sequence`** | ⚠️ **No existe en el modelo.** No es pérdida: **nunca entró** *(COM-16 §8.1)* |
| **9** | **`responded`** | ✅ **Correctamente ausente.** Vive en A-12 —`PlannedMoment.declaredOutcome`—, y **ADR-13 §6.2 separó A-6 de A-12 deliberadamente** |
| **10** | **`previousThread`** | ✅ **Conservado indirectamente**: es `strategy.resumedThread`, que **CA-08** obliga a que sea el hilo que dejó el anterior |
| **11** | **`previousContribution`** | ✅ **Correctamente ausente.** Reconstruible desde A-12: son los `relevanceElement` de las estrategias de los momentos anteriores |

> **Los tres últimos no son pérdidas: son datos de otro agregado.** Persistirlos en A-6 los duplicaría y **DDD-01 §5.4** explica por qué no deben fundirse.

---

# 6. ¿El contrato actual permite reconstruir completamente una `Proposal` emitida?

> # **No.**

## 6.1 Justificación

**Una `Proposal` reconstruida desde la fila persistida no es del tipo `Proposal`.**

La entidad exige `affirmableFacts: ClosedFactList` y `strategy.evidenceBase: ClosedFactList`, esto es, `readonly AffirmableFact[]`. **De la fila solo salen cadenas.** Para construir un `AffirmableFact` harían falta `kind` y `source`, **y no están ni pueden derivarse** *(§4.1, §4.2)*.

**La reconstrucción solo sería posible fabricando dos campos por hecho, que es precisamente lo que R-38 prohíbe.**

## 6.2 Qué sí se reconstruye

**Todo lo demás.** La identidad, los nueve contenidos restantes de la estrategia, el texto, el canal, la versión del criterio y la marca temporal **salen íntegros**. **La pérdida está acotada a dos campos de cada hecho afirmable**, y no alcanza a ninguna otra parte del agregado.

## 6.3 Una segunda reconstrucción, distinta y también incompleta

> **Reconstruir la `Proposal` no es lo mismo que reconstruir la decisión que la produjo.**

**ADR-15 §7.2** exige que la estrategia sea determinista *«dado el mismo diagnóstico, el mismo estado y la misma versión del Perfil»*. La fila conserva **la tercera variable** —`criteriaVersion`— pero **no dice qué emisión del diagnóstico se leyó**: A-11 está versionado, y **A-6 no referencia ninguna de sus emisiones**.

**Puede inferirse** cotejando `issuedAt` con las emisiones de A-11, pero es una **inferencia**, no una referencia — y el origen de `issuedAt` está abierto en **`COM-12 RC-4`**.

**Es un hallazgo distinto de RC-5 y no debe confundirse con él:** RC-5 afecta a **qué se afirmó**; éste, a **por qué se decidió así**. **Se registra en §7.3.**

---

# 7. Pérdidas de información — dónde, quién, qué documento

## 7.1 Pérdida 1 — trazabilidad del hecho afirmable *(`COM-12 RC-5`)*

| | |
| --- | --- |
| **Dónde ocurre** | `shared/persistence/contracts/Proposal.ts` → `affirmableFacts: string[]` · `shared/persistence/contracts/CommercialStrategy.ts` → `evidenceBase: string[]` |
| **En qué momento** | **Al traducir dominio → frontera**, en `generateProposal.ts`. **La traducción es correcta**: la impone la firma del repositorio, y `application/` no puede importar el contrato *(ADR-17 §13, prohibición 4)* |
| **Quién es responsable** | **Arquitectura.** El Persistence Contract replica la entidad *«verificado por lectura directa… no importado»* *(ADR-08 §10 · DEV-00 §5.2)*, y **quien decidió `string[]` decidió qué conserva A-6** |
| **Qué documento debe corregirse** | **El Persistence Contract de `Proposal` y el de `CommercialStrategy`**, bajo **ADR-08** y **ADS-02**. **ADR-16 §4.4** no necesita enmienda: la entidad ya declara `ClosedFactList` — **es la frontera la que no lo replica** |

## 7.2 Pérdida 2 — el número de emisión lo decide quien invoca *(F-2)*

**No es pérdida de datos: es una garantía que el contrato no da.**

`save(proposal)` **recibe el `issue` ya calculado**; quien invoca lo obtiene de `findVersionsByMoment(...).length + 1`. **Entre esa lectura y la escritura no hay nada que impida que dos emisiones simultáneas del mismo momento calculen el mismo número**, y con ello **V-1 y P-I2** —regenerar añade, nunca sustituye— dependerían del azar.

| | |
| --- | --- |
| **Dónde** | `ProposalRepository.save`, que no asigna ni verifica la identidad |
| **Quién** | **Ingeniería**, con **ADS-02** |
| **Documento** | **F-2 ya lo registra** *(«unicidad `(leadId, issue)` / `(leadId, sequence)` en el motor real»)*. **Alcanza también a `(leadId, moment, issue)` de A-6**, y conviene que F-2 lo diga |

> **El mismo patrón existe en `GenerateDiagnosis` y `CreateSequence`.** No es un defecto de este contrato: es sistémico, y por eso su dueño es el motor.

## 7.3 Pérdida 3 — la emisión del diagnóstico que se leyó *(nuevo)*

| | |
| --- | --- |
| **Dónde** | La entidad `Proposal` **no declara referencia a `BuyerDiagnosisId`**, y su Persistence Contract tampoco |
| **Consecuencia** | **La decisión no es reproducible por referencia**, solo por inferencia temporal *(§6.3)*. **P-I1** —una `Proposal` debe poder explicarse después— queda apoyada en `issuedAt` |
| **Quién** | **Arquitectura** |
| **Documento** | **ADR-16 §4.4** —el contenido de A-6— y, si se acepta, su Persistence Contract. **Colinda con COM-16 §8.1**, que preguntaba lo mismo respecto de la secuencia: **son la misma decisión con dos objetos** |

## 7.4 Ambigüedad — tres datos escritos dos veces

**`channel`, `moment` y la lista de hechos se persisten sueltos *y* dentro de `strategy`** *(COM-18 §3.3)*.

**Para la reconstrucción importa:** si una fila los tuviera divergentes, **nada dice cuál manda**. El código no puede producir esa fila —los escribe desde la misma estrategia—, pero **el esquema la admite**. **Arquitectura**, vía **ADR-16 §4.4**.

---

# 8. Estado de `COM-12 RC-5`

> ## 🔴 **Sigue abierto. Esta auditoría no puede cerrarlo — y lo deja decidible.**

## 8.1 Por qué no puede cerrarse aquí

**Cerrarlo es elegir entre dos opciones**, y ambas son decisiones de arquitectura sobre un contrato existente:

| Opción | Qué implica | Coste |
| --- | --- | --- |
| **A · Conservar `kind` y `source`** | Cambiar los dos Persistence Contracts y el Model que aún no existe | **APS-18 §11.1 pasa a ser comprobable tras recargar.** No hay emisiones escritas todavía: **el coste es mínimo hoy y crece con la primera fila** |
| **B · Conservar solo el enunciado** | Ningún cambio | **Se acepta que la trazabilidad no sobrevive a la persistencia**, y debe **declararse explícitamente** en el contrato — hoy no se declara: se lee como si nada se perdiera |

**Ninguna es de ingeniería, y la auditoría no elige.**

## 8.2 Qué aporta esta auditoría para decidirlo

1. **La pérdida está medida:** **dos de los cuatro campos** de cada hecho; `lead` recuperable, `statement` intacto *(§4.1)*.
2. **No es recuperable por otra vía**, y el motivo —la proyección depende de A-2 y A-4, que cambian— **es el mismo que justifica conservar la lista** *(§4.2)*.
3. **Se sabe exactamente qué regla deja de ser verificable:** **APS-18 §11.1**, íntegra; **P-I4**, a medias; **RE-2**, no verificable *(§4.3)*.
4. **La ventana es ahora:** **no existe ninguna emisión persistida**, porque no existe adapter y B-1 impide emitir. **La opción A no tiene coste de migración hoy.** Con la primera fila escrita, el origen perdido **no se reconstruye**.

## 8.3 Efecto sobre el adapter

> **El adapter de `ProposalRepository` NO puede implementarse hoy sin deuda arquitectónica.**

**Y el bloqueo es acotado:** todo lo demás del adapter está especificado sin ambigüedad —identidad, *append-only*, versionado, ausencia de borrado y de estadio—. **Lo único indeterminado es la forma de las dos listas de hechos**, que es justo lo que el Model tiene que fijar.

**Escribir el Model antes de decidir RC-5 congelaría `string[]`** *(COM-13 §2.3)*.

---

# 9. Riesgos residuales del contrato

| # | Riesgo | Severidad | Nota |
| :-: | --- | :-: | --- |
| **1** | **RC-5** — trazabilidad perdida | 🔴 Alta | §7.1 · §8 |
| **2** | **Vigencia sin criterio declarado** | 🟡 Media | `findCurrentByMoment` promete *«la más reciente (V-2)»* **sin decir respecto de qué**: ¿mayor `issue` o mayor `issuedAt`? Con `issuedAt` de origen abierto *(RC-4)*, **conviene que el contrato lo fije** |
| **3** | **F-2** — unicidad de `(leadId, moment, issue)` | 🟡 Media | §7.2 |
| **4** | **F-9** — `createdAt` no observable desde el contrato | 🟡 Media | Ya registrado; A-6 hereda la limitación |
| **5** | **F-3** — `userId` placeholder de un solo inquilino | 🟡 Media | Lo heredará el adapter, como sus tres hermanos |
| **6** | **Dos repositorios sobre A-6** | 🟡 Media | `OutreachPitchRepository` declara el mismo activo bajo el modelo anterior y **no lo usa nadie**. **El motor no puede implementar ambos** |
| **7** | **Referencia al diagnóstico ausente** | 🟡 Media | §7.3 |
| **8** | **`issuedAt` persistido no cabe en la entidad** | 🟢 Baja | La fila lo tiene; `Proposal` no lo declara. **La reconstrucción lo descarta** *(RC-4)* |

---

# 10. Conclusión

| Pregunta | Respuesta |
| --- | --- |
| **¿El contrato permite reconstruir completamente una `Proposal` emitida?** | **No** — §6 |
| **¿Dónde está la pérdida?** | En **dos campos de cada hecho afirmable**, en dos puntos de la misma fila — §4.1 |
| **¿Puede implementarse el adapter sin deuda?** | **No, hoy.** El bloqueo es **solo** la forma de las dos listas — §8.3 |
| **¿`COM-12 RC-5` puede cerrarse?** | **No por esta auditoría. Sí por Arquitectura**, y **con coste mínimo mientras no exista ninguna fila escrita** — §8 |

---

# 11. Referencias

**ADR-08** §5, §6, §10 · **ADR-12** §7.1, §7.4 · **ADR-13** §6.2, §10.1, §10.3, §13.1, V-1, V-2, V-3 · **ADR-15** §7.2, §10 · **ADR-16** §4.4, RC-12, RC-13, BD-I2, BD-I5, P-I1, P-I2, P-I3, P-I4, P-I5, AG-1 · **ADR-17** §13, AL-06 · **APS-18** §8.1, §11.1, RE-1, RE-2, CA-08 · **APS-19** CD-11 · **DDD-01** §4.2, §5.4 · **DEV-00** §5.2, R-22, R-38, F-2, F-3, F-9 · **PO-02** §6.2, LS-3 · **COM-04** §4 · **COM-07** §2.2 · **COM-09** §4.2, §6 · **COM-12** RC-4, RC-5 · **COM-13** §2.3 · **COM-15** · **COM-16** §5.5, §8.1 · **COM-18** §3.3.
