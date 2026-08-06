# COM-29 — Resolución de la frontera Agent API / Orchestrator

| Campo | Valor |
| --- | --- |
| Código | COM-29 |
| Clasificación | **Resolución de frontera** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Ratifica lo vigente y corrige una premisa. No propone cambios de código** |
| Fecha | 2026-08-04 |
| Motivo | Sprint 29 |
| Relacionado | **COM-24** *(la fachada)* · COM-26 · **COM-27 §7.3** · **COM-28 §4.4** |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§5 íntegro · §6, decisión 4 · §9, último párrafo.** Recomendaban *«mantener la inyección directa hasta que B-1 se cierre»*, tratándola como asimetría reversible.
>
> **B-1 nunca la justificó** *(COM-30 §2.2)*: impide la **ruta**, no la frontera. **La infracción de R-07 era independiente del bloqueo**, y **COM-31 la cerró sin esperar a `SP-01`**.
>
> ⚠️ **Lo que sigue plenamente en vigor**, y es la aportación principal de este documento: **§0** —la corrección de la premisa: las dos lecturas **siempre** se alcanzaron por la fachada— y **§1 a §4**, que descartan las opciones A y C. **COM-31 confirmó la opción B.**

> **Cero cambios de código.** `lint` limpio, `tsc --noEmit` limpio, **188 pruebas**, sin variación.

---

# 0. ⚠️ Corrección de la premisa

> **El enunciado parte de un hecho que el código no sostiene.**

**Dice:** *«el Composition Root inyecta directamente `readReducedDiagnosis` y `readReducedSequence` al Orchestrator»*.

**Verificado sobre el código:**

```text
orchestrators/commercialProposalOrchestrator.ts
  export interface CommercialProposalDependencies {
    pitchGeneratorAgent: PitchGeneratorAgentApi;   ← la fachada, no las lecturas
    runCommercialFacts:  RunCommercialFactsFn;
    generateProposal:    GenerateProposalFn;
  }

bootstrap/compositionRoot.ts:210
  createCommercialProposal({ pitchGeneratorAgent, runCommercialFacts, generateProposal })
```

**El Orchestrator nunca ha recibido las dos lecturas.** Las alcanza **a través de `PitchGeneratorAgentApi`**, que es donde COM-24 las expuso.

**Lo que sí ocurre en el Composition Root** *(líneas 168-176)* es que **construye las dos lecturas y se las inyecta a la Agent API**. Eso **no es una fuga**: es exactamente su función. **ADR-09 §5.1** lo declara *«el único lugar del sistema autorizado a construir»*, y por eso conoce `application/` — igual que construye `createGenerateDiagnosis` y `createCreateSequence`.

> **La opción B ya está en vigor.** Este documento la ratifica y **no propone ningún cambio** para las lecturas.

**Lo que sí queda abierto es otra cosa, y el enunciado no la nombra:** **`generateProposal` sí se inyecta directamente**, saltando la fachada *(§5)*.

---

# 1. Precedentes — cómo obtiene datos cada Orchestrator

**Los siete, verificados por sus imports.**

| Orchestrator | Obtiene datos de | ¿Conoce `application/`? | ¿Conoce `domain/`? | ¿Conoce persistencia? |
| --- | --- | :-: | :-: | :-: |
| `leadAcquisitionOrchestrator` | 2 Agent API | ⛔ No | ⛔ No | ⛔ No |
| `leadLibraryOrchestrator` | 2 Agent API | 🟡 **Tipos** | ⛔ No | ⛔ No |
| `pitchOutreachOrchestrator` | 1 Agent API | ⛔ No | ⛔ No | ⛔ No |
| `commercialDiagnosisOrchestrator` | 1 Agent API | 🟡 **Tipos** | ⛔ No | ⛔ No |
| `commercialSequenceOrchestrator` | 1 Agent API | 🟡 **Tipos** | ⛔ No | ⛔ No |
| `commercialFactsOrchestrator` | 3 Agent API | ⛔ No | 🟡 **2 tipos** | ⛔ No |
| **`commercialProposalOrchestrator`** | **1 Agent API + 1 workflow** | ⚠️ **Tipos + una función que invoca** | ⛔ **No** | ⛔ No |

## 1.1 Qué dice el patrón

1. **Los siete obtienen sus datos por Agent API.** Sin excepción.
2. **Conocer *tipos* de `application/` es corriente**: cuatro lo hacen, para declarar su firma.
3. **Invocar una función de `application/` es único del nuevo**, y es la anomalía real *(§5)*.
4. **Ninguno conoce persistencia.** **R-24**, intacto.
5. **Todas las dependencias se construyen en el Composition Root** *(ADR-09 §5.1 · R-55)*.

> **La distinción que importa no es «tipos sí, funciones no», sino *por dónde entran los datos*.** Los siete entran por la fachada del módulo; **solo `generateProposal` entra por un lado.**

---

# 2. Opción A — El Orchestrator recibe las lecturas sueltas

| | |
| --- | --- |
| **Qué sería** | `readReducedDiagnosis` y `readReducedSequence` inyectadas directamente |
| **Ventaja** | Una indirección menos |
| **Riesgo decisivo** | ⛔ **`pitchGeneratorAgent.ts` declara ser la única API pública del módulo**: *«Ningún componente externo debe acceder a `application/`, `domain/` o `infrastructure/` directamente»*. Recibirlas sueltas **es acceder a `application/` desde fuera** |
| **Coste oculto** | **Dejaría sin objeto el Sprint 19 (COM-24)**, cuyo único fin fue exponerlas en la fachada **para que el Orchestrator pudiera alcanzarlas** |
| **Precedente** | **Ninguno**: los siete Orchestrators obtienen datos por Agent API |

**Veredicto: ⛔ descartada.** No es «consistente con la implementación actual» —la implementación actual es la B *(§0)*—, y rompería la puerta única sin ganar nada.

---

# 3. Opción B — A través de la Agent API *(en vigor)*

| | |
| --- | --- |
| **Qué es** | El Orchestrator recibe `PitchGeneratorAgentApi` y llama `readReducedDiagnosis` / `readReducedSequence` |
| **Ventaja** | **Una sola puerta pública por módulo**, y la que ya declara serlo |
| **¿Fachada artificial?** | **No.** La fachada **ya existía** desde ADR-15 §9.5, con seis operaciones y tres consumidores. **No se crea nada** |
| **Precedente** | **Los siete Orchestrators** |
| **Encapsulamiento** | El Orchestrator **no sabe que existen dos casos de uso de lectura**, ni cómo se construyen, ni sobre qué repositorios |
| **Coste** | **Cero. Ya está implementado y probado** |

**Respaldo normativo:**

- **ADR-04** sitúa `presentation/` como **la capa de Agent API** del módulo.
- **R-11** — todo workflow pasa por un Orchestrator; **ADR-04 §7.6** — ningún agente conoce a otro. **La fachada es el punto de encuentro.**
- **COM-24 §3.1** — *«la única salida es que cada módulo exponga lo suyo, ya recortado»*.

**Veredicto: ✅ recomendada, y ya vigente.**

---

# 4. Opción C — Un `ProposalContextProvider` en `application/`

| | |
| --- | --- |
| **Qué sería** | Un compositor que agrupa las dos lecturas y las entrega juntas |
| **Ventaja alegada** | Que el Orchestrator no conozca varios lectores |
| **Problema 1** | **El Orchestrator ya no conoce varios lectores**: conoce **una fachada** *(§0)*. **Resuelve un problema que no existe** |
| **Problema 2** | ⛔ **Sería un wrapper sin responsabilidad.** No decide, no recorta, no combina: reenvía. **La restricción del propio sprint lo prohíbe**: *«no crear nuevas abstracciones solo para satisfacer arquitectura»* |
| **Problema 3** | **Introduce un concepto que el Blueprint no nombra**. `Contexto` es además **sinónimo prohibido** de la lista cerrada *(DDD-01 §8)*, por sugerir algo ampliable |
| **Problema 4** | **Añadiría un tercer sitio donde el diagnóstico y la secuencia viajan juntos**, tras la fachada y el Orchestrator |

**Veredicto: ⛔ descartada**, por la restricción del propio sprint.

---

# 5. La discrepancia real — `generateProposal`

**Es la única que existe, y COM-27 §7.3 y COM-28 §4.4 ya la registraron.**

```text
pitchGeneratorAgent   →  readReducedDiagnosis   ✅ por la fachada
pitchGeneratorAgent   →  readReducedSequence    ✅ por la fachada
runCommercialFacts    →  workflow inyectado     ✅ no es un agente
generateProposal      →  application/ directo   ⚠️ salta la fachada
```

## 5.1 Por qué está así

**`GenerateProposal` no está expuesto en la Agent API, deliberadamente:** con **B-1** abierto **no puede emitir** —`selectStrategy` lanza mientras `SP-01` no se publique— y **publicar una operación que siempre falla presentaría un bloqueo de gobernanza como si fuera una función del producto** *(COM-24 §3.4)*.

**No hay forma de invocarlo por la fachada sin exponerlo primero.**

## 5.2 Las dos salidas, y ninguna es de ingeniería

| Salida | Efecto | Quién decide |
| --- | --- | --- |
| **Mantener la inyección directa** | La asimetría persiste **mientras B-1 esté abierto**; **es reversible en una línea** el día que se exponga | Statu quo |
| **Exponer `generateProposal` en la Agent API** | Restaura la puerta única, y **publica una capacidad que siempre falla** | **Product Office** |

> **Recomendación: mantener la inyección directa hasta que B-1 se cierre, y revisarla ese mismo día.** No es deuda oculta: está documentada en tres sitios y **desaparece con el bloqueo que la causó**.

---

# 6. Recomendación final

> ## **Opción B para las lecturas — ya en vigor. Ningún cambio de código.**
>
> ## **`generateProposal` sigue inyectado hasta que B-1 se cierre.**

| # | Decisión | Estado |
| :-: | --- | :-: |
| **1** | Las lecturas se alcanzan **por la Agent API** | ✅ **Vigente** — nada que hacer |
| **2** | **No se crea** `ProposalContextProvider` | ✅ Descartada |
| **3** | **No se inyectan las lecturas sueltas** | ✅ Descartada |
| **4** | `generateProposal` **sigue inyectado**, con revisión atada a B-1 | ⏸️ Condicionada |

---

# 7. Archivos que cambiarían

## 7.1 Si se aprueba la recomendación

> **Ninguno.**

## 7.2 Si se aprobara la opción A

| Archivo | Cambio |
| --- | --- |
| `orchestrators/commercialProposalOrchestrator.ts` | Sustituir la fachada por dos funciones |
| `orchestrators/commercialProposalOrchestrator.test.ts` | Rehacer el arnés y **la prueba que comprueba que ninguna otra operación del agente se toca** |
| `bootstrap/compositionRoot.ts` | Pasar las dos lecturas al Orchestrator |
| `presentation/pitchGeneratorAgent.ts` | ⚠️ **Retirar las dos operaciones o su cabecera**: quedarían expuestas y sin consumidor, y la frase *«única API pública»* dejaría de ser cierta |
| **COM-24** | Quedaría **sin objeto**: su único fin fue exponerlas |

## 7.3 Si se aprobara la opción C

Todo lo anterior **más** un fichero nuevo en `application/` y su suite, **sin ninguna responsabilidad propia**.

---

# 8. ¿Requiere actualizar el Blueprint?

| Cuestión | ¿Enmienda? |
| --- | :-: |
| **Las lecturas por la fachada** | ⛔ **No.** ADR-04, R-11 y la cabecera de `pitchGeneratorAgent.ts` ya lo sostienen |
| **`generateProposal` inyectado** | ⛔ **No mientras sea transitorio.** Si se decidiera permanente, **sí**: la frase «única API pública» dejaría de ser exacta |
| **La dependencia workflow → workflow** | 🟡 **Conviene enunciarla.** Ningún ADR la prohíbe —lo prohibido es que un **agente** conozca a otro— pero **tampoco la nombra**, y ya está en uso |

---

# 9. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Actuar sobre la premisa del enunciado habría roto la frontera correcta**: habría sustituido la fachada por acceso directo a `application/`, dejando COM-24 sin objeto | 🔴 *(evitado)* |
| **2** | **La asimetría de `generateProposal` persiste** mientras B-1 siga abierto | 🟡 |
| **3** | **La fachada tiene seis operaciones y dos sin consumidor final** — las lecturas solo las usa el compositor, que nadie invoca | 🟡 |
| **4** | **La dependencia workflow → workflow sigue sin enunciado** | 🟡 |
| **5** | **COM-07 §6 sigue sin anotar** como *superseded* | 🟢 |

---

# 10. Bloqueos restantes

**Sin cambios y sin tocar:** **B-1** · **B-2** · **CH-01/02/03** · **`COM-12 RC-4`** · **COM-16 §8.1 y §8.2** · **F-1** y la retirada del par heredado sobre A-6.

**B-1 es el único que afecta a este documento**: cerrarlo elimina la asimetría de §5 y la decisión 4 se resuelve sola.

---

# 11. Referencias

**ADR-04** §7.6, §10 · **ADR-09** §5.1 · **ADR-15** §9.5, §12 · **ADR-16** §7 · **ADR-17** §9.1 · **DDD-01** §8 · **DEV-00** R-11, R-24, R-55 · **COM-24** §3.1, §3.4 · **COM-26** · **COM-27** §7.3 · **COM-28** §4.4.
