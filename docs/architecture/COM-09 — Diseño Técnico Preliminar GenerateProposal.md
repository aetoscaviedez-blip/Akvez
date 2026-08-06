# COM-09 — Diseño Técnico Preliminar de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-09 |
| Clasificación | **Diseño técnico preliminar** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Sin implementación. Bloqueado por dos decisiones de gobernanza** |
| Fecha | 2026-08-01 |
| Motivo | Sprint 07 · Fase 3 |
| Relacionado | COM-07 *(entrada)* · COM-08 *(bloqueo)* · ADR-16 §7 |

> **No se ha escrito código y no debe escribirse todavía** *(§8)*.

---

# 1. Qué es `GenerateProposal`

**El cuarto caso de uso canónico de ADR-16 §7. Evento E-5.** Y **el único que atraviesa la Línea de Decisión**, en un solo sentido:

```text
domain/ construye la lista cerrada
        → infrastructure/ redacta con ella
                → domain/ VERIFICA contra ella
                        → si no supera, REHACE
```

*(ADR-15 §10 · ADR-16 §7)*

---

# 2. Reparto de responsabilidades

**Transcrito de ADR-16 §7, no propuesto:**

| Capa | Qué le corresponde |
| --- | --- |
| **`domain/`** | La **estrategia** · la **lista cerrada** · **el punto de control** |
| **`application/`** | Encadena estrategia → redacción → verificación; **rehace si no supera el control**; entrega para persistir |
| **`infrastructure/`** | **Redacción generativa** · persistencia de A-6 |

> **La redacción es lo único generativo, y no decide nada.** APS-18 §10.1: *«el modelo de IA redacta. No decide»*. **RA-5**: ningún resultado generativo modifica diagnóstico, estado, estrategia ni secuencia — **el texto es una salida terminal**.

---

# 3. Entrada

**Definida en COM-07 §6 y no se repite aquí.** Cinco elementos: `lead`, `diagnosis` recortado, `evidence` *(`AffirmableEvidence`)*, `criteriaVersion` y `sequence` sin canal.

**Nada más entra**, y cada exclusión tiene su regla en COM-07 §7.

---

# 4. Salida

## 4.1 Sobre el nombre «ProposalDraft»

> ⚠️ **`ProposalDraft` no existe en el Blueprint, y proponerlo introduciría un concepto nuevo.**

**`Proposal` no tiene estado de borrador.** ADR-16 §4.4 la define emitida y versionada; **P-I5** declara que *«emitida y nunca enviada es un estado válido»* — que es precisamente lo que un «borrador» pretendería nombrar, **ya cubierto**. Añadir un estado intermedio obligaría a decidir cuándo deja de serlo, y **ningún evento del catálogo cerrado lo escribe**.

**Se propone en su lugar** el patrón ya usado por los otros tres casos de uso: un `Result` como unión discriminada que transporta **la emisión producida**.

## 4.2 Forma propuesta

```text
GenerateProposalResult
  ├── { outcome: "success";  proposal: ProposalEmission; event: ProposalIssued }
  ├── { outcome: "control_failed";      attempts: number }
  ├── { outcome: "drafting_unavailable" }
  ├── { outcome: "diagnosis_missing" }
  └── { outcome: "persistence_failed";  reason: string }

ProposalEmission                        (en tipos del propio módulo — C-2 · AL-13)
  ├── id · lead · moment · issue
  ├── strategy         CommercialStrategy   ← la produjo domain/
  ├── affirmableFacts  ClosedFactList       ← contra la que se verificó
  ├── text · channel
  └── criteriaVersion
```

**`affirmableFacts` viaja con la emisión y no es redundante:** es lo que hace **P-I4** comprobable *después* — sin ella, nadie puede verificar que ninguna afirmación carecía de respaldo.

---

# 5. El punto de control

**Es la pieza más delicada del caso de uso.**

| Regla | Enunciado |
| --- | --- |
| **ADR-15 §10** | *«Un texto que no supera el control **se rehace; no se entrega con advertencia**»* |
| **DDD-01 §8** | Sinónimos prohibidos: `Validación`, `Filtro`, `Guardrail` — *«un filtro deja pasar con advertencia; **esto rehace**»* |
| **P-I4** | Ninguna afirmación carece de evidencia en la lista cerrada |
| **RA-4** | **El adapter no puede añadir un solo hecho** |

**Consecuencia de diseño:** el bucle rehacer→verificar vive en `application/` *(ADR-16 §7: «rehace si no supera el control»)*, y **la verificación en `domain/`**. Separarlos así es lo que impide que el reintento acabe decidiendo algo.

> **Cuestión abierta 1 — ¿cuántos reintentos?** Es un **parámetro operativo**: su valor pertenece a **APS-17**, no al dominio *(R-52 · P-3)*. **Ningún documento lo fija hoy.** Y agotar los reintentos **debe ser una rama del resultado** —`control_failed`—, nunca un texto entregado con reserva.

---

# 6. Dependencias permitidas

| Dependencia | Forma | Regla |
| --- | --- | --- |
| **Puerto de redacción** | Declarado en `domain/`, cumpliendo P-1…P-4 | ADR-16 §2 · ADR-17 §6.3 |
| **`ProposalRepository`** | Repository Interface, **nunca el adapter** | AL-06 · R-22 |
| Función de dominio de estrategia | Import directo del propio `domain/` | D-A1 |
| Punto de control | Ídem | D-A1 |

**Prohibido en `Deps`:** cualquier otra cosa *(AL-08)*. En particular **no** `BuyerDiagnosisRepository` ni `CommercialSequenceRepository`: **el diagnóstico y la secuencia entran como dato**, no se buscan *(ADR-15 §12)*.

> **El puerto de redacción existente no sirve.** `PitchDraftingPort` recibe `designer` y `lead` sin tipar y devuelve un `PitchDraft` — es el flujo heredado. **El nuevo debe recibir la estrategia y la lista cerrada** y devolver solo texto *(APS-18 §10.2)*. Son dos puertos distintos y **conviene que coexistan** hasta retirar el flujo anterior *(deuda F-1 de Sprint 01)*.

---

# 7. Errores posibles

| Situación | Tratamiento | Regla |
| --- | --- | --- |
| El proveedor de redacción falla | **El adapter lo envuelve conservando `cause`**; el caso de uso **nunca ve un error de SDK** | AL-14 · R-63 |
| El texto no supera el control | **Se rehace.** Agotados los intentos → rama `control_failed` | ADR-15 §10 |
| No hay diagnóstico vigente | Rama `diagnosis_missing` | ADR-16 §7 |
| Falla la persistencia | Rama `persistence_failed`, sin motivo técnico al usuario | R-61 · UI-9 |
| **Se rompe un invariante** —p. ej. una afirmación sin respaldo tras el control— | **Se lanza.** Un invariante roto **nunca es rama de resultado** | **AL-16 · R-62** |

---

# 8. Por qué no puede implementarse todavía

| # | Bloqueo | Responsable |
| :-: | --- | --- |
| **1** | **`SP-01` sin publicar.** Sin versión del Perfil, la estrategia **no es reproducible** *(ADR-15 §7.2)*, y una `Proposal` no reproducible incumple su razón de ser | **Product Office** — COM-08 |
| **2** | **Productor de hechos observados sin decidir.** La lista se sostiene hoy en `measuredFactors`, que **no fue diseñado para esto** | **APS-08 / APS-19** — COM-04 §7.1 |

**Ninguno es de ingeniería y ninguno se resuelve escribiendo código.**

---

# 9. Cuestiones abiertas

1. **¿Cuántos reintentos admite el punto de control?** *(§5)* — parámetro de APS-17.
2. **¿Qué distingue «no superó el control» de «el proveedor no respondió»** de cara al usuario? Ambos dejan al Lead sin propuesta, pero **solo el primero es información sobre el criterio**.
3. **¿Conviven los dos puertos de redacción** o se migra el flujo heredado a la vez? *(§6)*
4. **¿Los indicios del diagnóstico pueden afirmarse?** Heredada de COM-07 §8.

---

# 10. Referencias

**ADR-13** §13.1 · **ADR-15** §7.2, §10, §12, RA-4, RA-5 · **ADR-16** §2, §4.4, §7, P-I4, P-I5 · **ADR-17** §6.3, AL-06, AL-08, AL-13, AL-14, AL-16 · **APS-17** · **APS-18** §10.1, §10.2 · **DDD-01** §8 · **DEV-00** R-22, R-52, R-61, R-62, R-63, UI-9, D-A1 · **COM-04** · **COM-07** · **COM-08**.
