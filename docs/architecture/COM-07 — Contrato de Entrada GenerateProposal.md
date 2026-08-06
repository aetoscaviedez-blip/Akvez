# COM-07 — Contrato de Entrada de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-07 |
| Clasificación | **Contrato técnico preliminar** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **No decide. Define qué puede entrar y qué no** |
| Fecha | 2026-08-01 |
| Motivo | Sprint 07 · Fase 1 |
| Relacionado | COM-04 · COM-05 · COM-06 · ADR-18 *(Draft)* |

> **Este documento no diseña el caso de uso** *(eso es COM-09)*. Define **exclusivamente su superficie de entrada**: qué información necesita y, sobre todo, **qué no puede alcanzarle**.

---

# 1. Las cuatro fuentes

| # | Fuente | Aporta | Estado |
| :-: | --- | --- | :-: |
| 1 | **`BuyerDiagnosis` vigente** | La lectura del comprador | ✅ Existe |
| 2 | **Hechos afirmables** | Lo único que el texto puede afirmar | ✅ Existe |
| 3 | **Perfil de Estrategia** | El criterio que decide la estrategia | 🔴 No existe |
| 4 | **`CommercialSequence`** | Qué contacto toca y qué dijeron los anteriores | ✅ Existe |

**Ninguna se busca: todas entran.** ADR-15 §12 — *«recibe la evidencia ya unida y **nunca la busca**»*. Quien las reúne es el Orchestrator *(R-11 · COM-06 §2.1)*.

---

# 2. Fuente 1 — Diagnóstico vigente

## 2.1 Qué puede consumir

| Campo | Para qué | Regla |
| --- | --- | --- |
| **`variables[].id`** y **`knowledgeClass`** | Saber **qué se sabe y qué no**. De ahí salen las restricciones de APS-19 §8.2 | CD-01 |
| **Valor de BD-1** *(`CommercialState`)* | **El punto de entrada** de toda la estrategia | APS-18 §7 |
| **Valores de las variables `Inferida`** | **Orientar** enfoque y objetivo | RE-2 |
| **`confidence`** | Ajustar cuánta evidencia aportar antes de proponer | APS-19 §7 |
| **`criteriaVersion`** | Saber bajo qué criterio se emitió | RC-13 |

## 2.2 Qué NO puede salir del diagnóstico

| Campo | Por qué |
| --- | --- |
| **`variables[].indicios`** | ⚠️ **La razón es sutil y determinante.** APS-19 §4.1 dice que *«el indicio es un hecho»*, luego **podrían afirmarse**. Pero admitirlos abriría **una segunda vía** hacia la lista cerrada, junto a la proyección — y **una lista con dos orígenes deja de ser cerrada de forma verificable** *(RE-1)*. Los indicios se quedan donde están: **justifican la lectura, no alimentan el mensaje** |
| **El valor de una variable `Desconocida`** | No existe. **BD-I2** |
| **Cualquier lectura, como enunciado** | **RE-2** — lo inferido decide el enfoque; **nunca se afirma** |

> **Sobre «`GenerateProposal` no puede conocer `BuyerDiagnosis` internamente»** *(Sprint 05 · Fase 4)*: este sprint lo incorpora como entrada, lo cual **no contradice aquello**. La prohibición era **ir a buscarlo** —leer su repositorio, navegar su agregado—. Aquí **llega ya resuelto y recortado**: solo lo de §2.1.

---

# 3. Fuente 2 — Hechos afirmables

**Se usa `AffirmableEvidence`, ya existente** *(`domain/commercial/factConsumption.ts`)*. No se define nada nuevo.

Sus garantías, ya verificadas por `affirmableFacts.contract.ts`:

- Todo hecho es **observado**; no hay clase inferida.
- Todo hecho declara **origen** y **Fuente**.
- **Ningún texto narrativo entra** — `description`, `flaws`, `angle`, `revenueLoss`, `whyWebsiteNeeded` no tienen `EvidenceSource` que los acredite.
- **Inmutable tras la entrega**: `readonly` + `freeze`.
- **Lista vacía es válida**: un contacto que no pueda afirmar nada es información, no un fallo *(RE-5)*.

---

# 4. Fuente 3 — Perfil de Estrategia

## 4.1 Qué entra

> **Únicamente la versión** — `criteriaVersion`.

**El contenido del criterio no viaja como dato de entrada:** vive transcrito en `domain/` *(ADR-18 §7)*, igual que `weightingProfile.ts`. Lo que entra es **bajo qué versión debe decidirse**, que es lo que **RC-13** obliga a conservar en la emisión.

## 4.2 Confirmación exigida por el sprint

> ✅ **`CommercialStrategy` no se genera en la entrada, y `GenerateProposal` no la recibe: la produce su `domain/`.**

ADR-16 §7 se lo atribuye expresamente: *«qué decide `domain/`: la estrategia · la lista cerrada · el punto de control»*. Recibirla ya hecha significaría que alguien decidió fuera del dominio — la fuga que **RA-R1** y **RC-3** declaran la más probable de la arquitectura comercial.

## 4.3 Estado

🔴 **No existe.** ADR-18 `Draft`, `SP-01` sin publicar. **Mientras tanto, `criteriaVersion` entra como `SIN-PERFIL-DE-ESTRATEGIA`**, y ese valor **es la razón por la que el caso de uso no debe escribirse todavía**: sin Perfil, la estrategia no es reproducible *(ADR-15 §7.2)*, y una `Proposal` no reproducible incumple su propia razón de ser.

---

# 5. Fuente 4 — Secuencia comercial

## 5.1 Qué puede aportar

| Dato | Para qué | Regla |
| --- | --- | --- |
| **Momento vigente** | Determina objetivo y barrera | APS-18 §9.2 |
| **Hilo que dejó planteado el contacto anterior** | El siguiente lo retoma | §4.6 · CA-08 |
| **Qué aportaron los contactos anteriores** | **SC-R3 — ningún contacto repite al anterior. Si no aporta algo nuevo, no se emite** | §9.3 |
| **Resultado declarado del contacto anterior** | **SC-R4 — el silencio es información**: indica qué barrera no se rompió | §9.3 |
| **Número de secuencia** | Parte de la identidad de la emisión | ADR-16 §4.4 |

## 5.2 Qué NO puede aportar

| Prohibido | Por qué |
| --- | --- |
| **El canal** | ⚠️ **Es contenido de la estrategia, no del plan** *(APS-18 §8.1)*, y **CM-3** declara que elegirlo es decisión de estrategia. La secuencia **no lo lleva**: `PlannedMoment` no tiene campo de canal, por diseño *(Sprint 03)* |
| **Decisiones estratégicas ya tomadas** | **SC-R1** — la estrategia se decide **antes de usar** cada contacto, no al planificar |
| **El estado de la secuencia como criterio de exclusión** | **CS-I3 · APS-18 §7.5** — detenerla o agotarla **no expulsa al Lead** |

---

# 6. El contrato, en una vista

```text
GenerateProposalInput
  ├── lead              LeadReference
  ├── diagnosis         { commercialState?, variables[{id, class, value?}], confidence }
  │                     ⛔ sin indicios · sin valores de Desconocida
  ├── evidence          AffirmableEvidence          (ya existente, inmutable)
  ├── criteriaVersion   string                      (hoy: SIN-PERFIL-DE-ESTRATEGIA)
  └── sequence          { moment, sequenceNumber, previousThread?, previousContribution[],
                          previousOutcome? }
                        ⛔ sin canal · sin estrategias previas
```

**Nada más entra.** Cada campo tiene una regla que lo justifica; ninguno está «por si acaso» *(Sprint 04 · F-8)*.

---

# 7. Lo que este contrato hace imposible

| Imposible | Mecanismo |
| --- | --- |
| Afirmar una inferencia | `AffirmableFact` no tiene clase inferida; los indicios no entran |
| Afirmar narrativa generativa | Ningún `EvidenceSource` la acredita |
| Afirmar una pérdida económica | Ídem, y CD-07 |
| Decidir la estrategia fuera del dominio | No se recibe: se produce dentro |
| Elegir canal desde la secuencia | La secuencia no lo lleva |
| Emitir sin criterio versionado | `criteriaVersion` es obligatorio; su ausencia se declara |

---

# 8. Cuestión abierta

**¿Los indicios del diagnóstico podrían alguna vez ser afirmables?** *(§2.2)*

APS-19 §4.1 dice que son hechos, luego la respuesta teórica es sí. Este contrato **los excluye** para conservar una lista cerrada de origen único y verificable. **Si el Product Office prefiere admitirlos, debe decidirse cómo se unifican las dos vías** — no se resuelve en implementación.

---

# 9. Referencias

**ADR-15** §7.2, §12 · **ADR-16** §4.4, §7, RC-3 · **ADR-18** §7 · **APS-18** §4.6, §7, §7.5, §8.1, §9.2, §9.3, RE-1, RE-2, RE-5, SC-R1, SC-R3, SC-R4, CM-3 · **APS-19** §4.1, §7, §8.2, BD-I2, CD-01, CD-07 · **DDD-01** CS-I3 · **DEV-00** R-11 · **COM-04** · **COM-05** · **COM-06**.
