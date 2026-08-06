# COM-28 — Auditoría de Integración del Orchestrator de la Propuesta

| Campo | Valor |
| --- | --- |
| Código | COM-28 |
| Clasificación | **Auditoría de integración** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Registra lo integrado. No publica ninguna capacidad** |
| Fecha | 2026-08-04 |
| Motivo | Sprint 28 |
| Relacionado | COM-24 · COM-25 · COM-26 · **COM-27** *(el plan que ejecuta)* |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§4.2, fila `generateProposal` · §4.4, último párrafo · §6.2, riesgo 7.** Registraban la inyección directa como **asimetría aceptada**, con riesgo **🟡**.
>
> **Era una infracción de R-07 · ADR-04 §7.7, y su severidad correspondía a 🔴** *(COM-30 §7)*. **COM-31 la cerró.**
>
> ⚠️ **Lo que NO queda superseded, y conviene no confundir:** el razonamiento de **§4.4 sobre las dos lecturas** —rechazar inyectarlas sueltas y alcanzarlas por la fachada— **sigue vigente y COM-29 y COM-31 lo confirmaron**.

> **Integrar no es publicar.** El compositor queda construido en el arranque y **sin ruta**: con **B-1** abierto no habría capacidad que publicar.

---

# 1. Archivos creados

**Ninguno.** El Orchestrator y su suite se crearon en el sprint anterior; **este sprint solo lo integra**.

# 2. Archivos modificados

| Archivo | Cambio |
| --- | --- |
| `bootstrap/compositionRoot.ts` | Construcción de `createCommercialProposal` con sus tres dependencias. Retirados los dos `void` de `generateProposal` y `runCommercialFacts`: **ya tienen consumidor** |
| `bootstrap/compositionRoot.test.ts` | Dos pruebas de composición |

**Nada más.** No se tocaron `domain/`, contratos, modelos, repositorios, persistencia, adapters ni rutas.

---

# 3. Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ Limpio |
| `npx tsc --noEmit` | ✅ Limpio |
| `npm test` | ✅ **188 pruebas** *(186 → 188: **+2** de composición)* |
| Endpoints nuevos | ✅ **Ninguno** — siguen siendo cinco manejadores, con prueba |
| Lógica comercial nueva | ✅ **Ninguna** |

---

# 4. Decisiones tomadas

## 4.1 Por qué se cableó así

**Es el patrón de sus cinco hermanos**: el Composition Root construye el workflow con dependencias ya construidas, **una instancia por Repository Interface** *(ADR-09 §6)*, y nadie construye las suyas *(R-55)*.

**El orden importa y está impuesto por el grafo**: el compositor se construye **después** de `runCommercialFacts`, que a su vez necesita los tres agentes.

## 4.2 Dependencias que usa — tres

| Dependencia | Por qué |
| --- | --- |
| **`pitchGeneratorAgent`** | Por él llegan **las dos lecturas recortadas** *(COM-24)*. Es **la única superficie pública del módulo**: *«ningún componente externo debe acceder a `application/`, `domain/` o `infrastructure/` directamente»* |
| **`runCommercialFacts`** | **La fuente autorizada de evidencia.** Es **una función ya construida, no un agente**: quien conoce a los tres agentes sigue siendo el único autorizado a hacerlo *(R-11 · ADR-04 §7.6)* |
| **`generateProposal`** | ⚠️ **Inyectado directamente** — §4.4 |

## 4.3 Dependencias rechazadas

| Rechazada | Por qué |
| --- | --- |
| **Cualquier repositorio** | **R-24** — un Orchestrator no conoce persistencia |
| **Cualquier adapter** | Se construyen en el Composition Root *(ADR-17 §9.1)* y no cruzan hacia aquí |
| **`LeadHunterAgentApi` · `LeadAnalyzerAgentApi`** | **No los necesita**: la evidencia llega compuesta. Recibirlos duplicaría lo que `commercialFactsOrchestrator` ya hace **una vez** |
| **`readReducedDiagnosis` y `readReducedSequence` sueltos** | ⚠️ **§4.4** |

## 4.4 ⚠️ Una diferencia con la forma propuesta en el enunciado

**El enunciado propone estas dependencias:**

```ts
type CommercialProposalDependencies = {
  readReducedDiagnosis: ReadReducedDiagnosisFn;
  readReducedSequence: ReadReducedSequenceFn;
  runCommercialFacts:  RunCommercialFactsFn;
  generateProposal:    GenerateProposalFn;
};
```

**La implementación recibe `pitchGeneratorAgent` en lugar de las dos lecturas sueltas, y no se ha cambiado.** El motivo:

> **`pitchGeneratorAgent.ts` declara ser la única API pública del módulo:** *«Ningún componente externo debe acceder a `application/`, `domain/` o `infrastructure/` directamente»*.

**Inyectar las dos lecturas sueltas sería acceder a `application/` desde fuera del módulo** — y **dejaría sin sentido el Sprint 19 (COM-24)**, cuyo único objeto fue exponerlas en la fachada precisamente para que el Orchestrator pudiera alcanzarlas.

**El caso de `generateProposal` es distinto y sí se inyecta suelto**, porque **no está expuesto en la Agent API** y no debe estarlo mientras B-1 siga abierto. **COM-27 §7.3 aceptó esa asimetría expresamente.**

> **No se resuelve por código:** si el Product Office prefiere la forma del enunciado, **debe decidirse si la Agent API deja de ser la única superficie pública** — y eso alcanza a `pitchGeneratorAgent.ts` y a COM-24. **Recomendación: mantener la forma actual.**

---

# 5. Auditoría de fronteras

**Búsqueda completa de imports de `modules/*/domain` desde `infrastructure/`, `presentation/` y `shared/`.**

## 5.1 El resultado que importa

> ### ✅ **Cero cruces entre módulos.** Ningún módulo importa el `domain/`, `application/` ni `infrastructure/` de otro.

**Es la prohibición real** —**R-02 · R-03**— y está intacta.

## 5.2 Lo que la búsqueda literal sí encuentra, y por qué **no** es una violación

| Origen | Hits | Veredicto |
| --- | :-: | --- |
| `infrastructure/` → **su propio** `domain/` | 6 | ✅ **Obligatorio.** Un adapter **implementa el puerto que `domain/` declara** *(ADR-16 §2 · ADR-17 §6.3)*. Sin ese import no hay adapter posible |
| `presentation/` → **su propio** `domain/` | 5 | ✅ **Correcto por diseño.** Son tipos, y `generateAffirmableFacts` es **una Tool de cálculo puro que `presentation/` declara y expone** *(DEV-00 §5.4 · ADR-04 §10)*, documentado en el propio fichero |
| `shared/` → `domain/` | **0** | ✅ **ADR-08 §10** |

**Ninguno se ha corregido**, conforme a la instrucción: **la formulación literal del enunciado señalaría imports que las reglas exigen**. La distinción que separa lo correcto de lo prohibido es **dentro del módulo frente a entre módulos**, y **D-A1** autoriza expresamente la primera.

## 5.3 El Orchestrator nuevo

**No importa `domain/` en absoluto** —ni el suyo, porque no tiene—, y una prueba lo comprueba sobre el fichero: sin `persistence`, sin `adapters`, sin `models`, sin `Repository`, sin `infrastructure`, sin `/domain/` y sin `express`.

---

# 6. Riesgos

## 6.1 Técnicos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **B-1 abierto: el flujo completo nunca termina.** `selectStrategy` lanza, de modo que **el compositor solo puede alcanzar `diagnosis_missing` o el error de entrada**. Sus 11 pruebas usan dobles —correcto— pero **no habrá integración real hasta que `SP-01` se publique** | 🔴 |
| **2** | **Cinco piezas siguen sin consumidor final**: el adapter de redacción, el repositorio de A-6, las dos lecturas y **el propio compositor** — que se construye y **nadie invoca** | 🟡 |
| **3** | **Dos adapters de redacción vivos** *(F-1)* y **dos repositorios sobre A-6**, uno sin uso | 🟡 |
| **4** | **`diagnosis_missing` puede producirse en dos sitios** — el compositor y el caso de uso. Mismo desenlace y mismo vocabulario, pero **la del caso de uso queda inalcanzable por este camino** | 🟡 |

## 6.2 Arquitectónicos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **5** | **§4.4 — la forma de las dependencias diverge del enunciado.** Sostenerla mantiene la fachada como única puerta; cambiarla exigiría revisar COM-24 y la cabecera de `pitchGeneratorAgent.ts` | 🟡 |
| **6** | **Primera dependencia workflow → workflow.** No la prohíbe ningún ADR —lo prohibido es que un **agente** conozca a otro— pero **tampoco la enuncia ninguno** | 🟡 |
| **7** | **`generateProposal` inyectado sin pasar por la fachada.** Asimetría aceptada en COM-27 §7.3, **reversible el día que se exponga** | 🟡 |
| **8** | **COM-07 §6 sigue sin anotar** como *superseded* en los tres puntos que COM-14, COM-15 y COM-16 corrigieron | 🟢 |

---

# 7. Bloqueos restantes

**Sin cambios y sin tocar:** **B-1** *(`SP-01`)* · **B-2** *(reintentos)* · **CH-01/02/03** *(longitud de canal)* · **`COM-12 RC-4`** *(origen de `issuedAt`)* · **COM-16 §8.1 y §8.2** · **F-1** y la retirada del par heredado sobre A-6.

**Ninguno impidió esta integración**, y **solo B-1 impide que el flujo llegue hasta el final.**

---

# 8. Referencias

**ADR-04** §7.6, §10 · **ADR-08** §10 · **ADR-09** §6 · **ADR-15** §12 · **ADR-16** §2, §4.4 · **ADR-17** §6.3, §9.1, AL-12 · **DEV-00** §5.4, R-02, R-03, R-10, R-11, R-24, R-55, D-A1 · **COM-24** §3.4 · **COM-25** · **COM-26** · **COM-27** §7.3.
