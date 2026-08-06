# COM-31 — Auditoría de integración de `GenerateProposal` en la Agent API

| Campo | Valor |
| --- | --- |
| Código | COM-31 |
| Clasificación | **Auditoría de integración** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Cierra la infracción declarada en COM-30. Ninguna capacidad publicada** |
| Fecha | 2026-08-04 |
| Motivo | Sprint 31 |
| Relacionado | **COM-30** *(la decisión que ejecuta)* · COM-24 · COM-27 §7.3 · COM-28 §4.4 · COM-29 §5 |

> **La Agent API es frontera arquitectónica, no superficie comercial.** Exponer no es publicar: **no se creó ninguna ruta**.

---

# 1. Decisión tomada

> ## **`GenerateProposal` entra en `PitchGeneratorAgentApi`. El Orchestrator deja de recibirlo.**

**Ejecuta la Opción B de COM-30 §8**, y cierra la infracción de **R-07 · ADR-04 §7.7** que llevaba tres sprints en el árbol:

```text
ANTES   Orchestrator ──────────────► application/generateProposal      ⛔ R-07
AHORA   Orchestrator ──► presentation/ ──► application/generateProposal ✅
```

**El Orchestrator pasa de tres dependencias a dos** —la fachada y el workflow de hechos— y **el sistema queda sin excepciones**: los siete Orchestrators obtienen todo por Agent API.

---

# 2. Archivos modificados

| # | Archivo | Cambio |
| :-: | --- | --- |
| **1** | `presentation/pitchGeneratorAgent.ts` | Operación `generateProposal` y **sexto parámetro** en la factoría. **Delegación pura**: ni envuelve, ni traduce, ni decide |
| **2** | `presentation/pitchGeneratorAgent.test.ts` | Prueba de delegación por identidad en ambos sentidos + superficie cerrada de **siete** operaciones |
| **3** | `orchestrators/commercialProposalOrchestrator.ts` | **De tres dependencias a dos.** Invoca `pitchGeneratorAgent.generateProposal` |
| **4** | `orchestrators/commercialProposalOrchestrator.test.ts` | El doble mueve la emisión a la fachada; **dos pruebas nuevas** *(§4)* |
| **5** | `bootstrap/compositionRoot.ts` | `generateProposal` se entrega **a la Agent API**; el Orchestrator deja de recibirlo |
| **6** | `bootstrap/compositionRoot.test.ts` | La composición refleja las dos dependencias |
| **7** | **5 llamadas a `createPitchGeneratorAgent` en pruebas existentes** | Sexto argumento, con el idioma ya usado: **un doble que lanza si se invoca** |

**Archivos creados:** este documento.

**No se tocaron:** `domain/` · `application/` · `contracts/` · `models/` · `repositories/` · `routes/`. **Ningún wrapper, ninguna interfaz nueva, ningún flag, ningún renombrado.**

---

# 3. Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ Limpio |
| `npx tsc --noEmit` | ✅ Limpio |
| `npm test` | ✅ **191 pruebas** *(188 → 191: **+3**)* |
| Rutas nuevas | ✅ **Ninguna** — siguen cinco manejadores, con prueba |
| Endpoints · DTO públicos · mappers | ✅ **Ninguno** |

---

# 4. Las pruebas que exigía el sprint

| Exigencia | Cómo se comprueba |
| --- | --- |
| **El Orchestrator nunca recibe `GenerateProposalFn`** | `CommercialProposalDependencies` tiene **dos claves**, y una prueba fija el conjunto y comprueba que `generateProposal` no está |
| **La Agent API delega sin modificar** | **Identidad en ambos sentidos**: el input entra tal cual —`toBe`— y el `Result` sale tal cual. Si envolviera o tradujera, fallaría |
| **La referencia del resultado es la recibida** | Ídem, sobre el objeto congelado del doble |
| **B-1 es bloqueo de ruta, no de arquitectura** | Una prueba comprueba que **la emisión se invoca por la fachada** y otra que **no existe manejador de propuesta**: el flujo llega hasta el caso de uso, y la publicación sigue cerrada donde debe |

**Y una que no se pedía:** la superficie del módulo queda **cerrada en siete operaciones**. Si apareciera una octava sin decidirse, la prueba lo diría.

---

# 5. Impacto sobre el Blueprint

> ## **Ninguna enmienda.**

**R-07 y ADR-04 §7.7 ya gobernaban el caso**; este sprint **restituye el cumplimiento**, no cambia la regla. **ADR-04 ya distingue** la Agent API —*«el conjunto de capacidades que el agente expone hacia el Orchestrator»*— de la superficie de producto, que es la ruta *(§7.8)*.

## 5.1 Documentos de la serie COM que quedan corregidos

**COM-30 §7 los enumeró; este sprint los deja sin efecto en ese punto:**

| Documento | Afirmaba | Estado |
| --- | --- | :-: |
| **COM-24 §3.4** | Que exponerlo publicaría una capacidad bloqueada | ⚠️ **Superado**: confundía Agent API con ruta |
| **COM-27 §7.3** | *«Asimetría aceptada»* | ⚠️ **Superado**: era infracción |
| **COM-28 §4.4** | Ídem, marcado 🟡 | ⚠️ **Superado** |
| **COM-29 §5** | *«Mantener hasta que B-1 se cierre»* | ⚠️ **Superado**: B-1 no lo justificaba |

**Ninguno se modifica** —la restricción del sprint lo prohíbe—; **COM-30 y COM-31 prevalecen sobre los cuatro en este punto.**

## 5.2 Lo que sigue pendiente de enunciar

**La dependencia workflow → workflow** —el Orchestrator recibe `runCommercialFacts`— **sigue sin nombrarla ningún ADR**. No la prohíbe ninguna regla —lo prohibido es que un **agente** conozca a otro *(ADR-04 §7.6)*— y **está en uso desde el Sprint 28**. Conviene enunciarla.

---

# 6. Riesgos restantes

## 6.1 Técnicos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **B-1 abierto**: `selectStrategy` lanza, de modo que **el flujo nunca llega a emitir**. Cambió el camino, no el desenlace | 🔴 |
| **2** | **Sexto parámetro posicional** en `createPitchGeneratorAgent`. COM-24 §4 avisó de que *«el sexto empezará a doler»*, y ya duele: **cinco pruebas ajustadas por segunda vez**. El compilador sigue protegiendo la transposición, porque **ningún par de tipos es mutuamente asignable** | 🟡 |
| **3** | **La fachada tiene siete operaciones y tres sin consumidor final**: las dos lecturas y la emisión solo las usa el compositor, **que ninguna ruta invoca** | 🟡 |
| **4** | **`diagnosis_missing` puede producirse en dos sitios** —el compositor y el caso de uso—, con el mismo vocabulario | 🟡 |

## 6.2 Arquitectónicos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **5** | **Una operación expuesta que siempre falla** puede leerse como capacidad disponible **si algún día se le añade ruta sin revisar B-1**. **Mitigación aplicada**: la operación lo declara en su propia documentación, con el precedente de `createSequence` | 🟡 |
| **6** | **La dependencia workflow → workflow sigue sin enunciado** *(§5.2)* | 🟡 |
| **7** | **COM-07 §6 sigue sin anotar** como *superseded* | 🟢 |

---

# 7. Bloqueos restantes

**Sin cambios y sin tocar:** **B-1** *(`SP-01`)* · **B-2** *(reintentos)* · **CH-01/02/03** *(longitud de canal)* · **`COM-12 RC-4`** · **COM-16 §8.1 y §8.2** · **F-1** y la retirada del par heredado sobre A-6.

> **B-1 conserva exactamente un efecto: impide la ruta.** Ya no justifica ninguna excepción de frontera — **porque ya no hay ninguna**.

---

# 8. Referencias

**ADR-04** §7.6, §7.7, §7.8, §10, glosario · **ADR-09** §5.1, §6 · **ADR-15** §7.2, §9.5 · **ADR-16** §7 · **ADR-17** AL-12 · **DEV-00** R-07, §4.4 *(corrección v1.3)*, R-11, R-24 · **COM-24** §3.4, §4 · **COM-27** §7.3 · **COM-28** §4.4 · **COM-29** §5 · **COM-30**.
