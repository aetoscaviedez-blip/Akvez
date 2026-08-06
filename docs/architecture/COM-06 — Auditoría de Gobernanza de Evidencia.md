# COM-06 — Auditoría de Gobernanza de Evidencia

| Campo | Valor |
| --- | --- |
| Código | COM-06 |
| Clasificación | **Auditoría técnica** — no pertenece a la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Informe. No decide nada** |
| Fecha | 2026-08-01 |
| Responsable | Ingeniería |
| Motivo | Sprint 06, fases 1 a 3 |
| Relacionado | ADR-18 *(Draft)* · COM-03 · COM-04 · COM-05 |

---

# Fase 1 — Auditoría de ADR-18

## 1.1 Los cuatro criterios

| # | Criterio | Veredicto | Evidencia en ADR-18 |
| --- | --- | :-: | --- |
| 1 | **No convierte `CommercialStrategy` en artefacto persistente** | ✅ | §5: *«No es un activo de la Biblioteca… no entra en el catálogo de ADR-13 §6.2 y no necesita evento de escritura»*. El artefacto gobernado es **el Perfil**, no la estrategia |
| 2 | **No crea identidad propia al Value Object** | ✅ | §5: *«El Value Object es la `Commercial Strategy`… **confundirlos es el error de partida**»*. §2.2 los separa en siete filas |
| 3 | **No genera versiones desde código** | ✅ | **SP-07** y §10.1, con tres prohibiciones razonadas: código, marca temporal y `"v1"` provisional |
| 4 | **No introduce lógica comercial ejecutable** | ⚠️ **Con matiz** | Ver §1.2 |

## 1.2 El matiz del criterio 4

**ADR-18 no contiene lógica**, pero **§7 prescribe que la habrá**: el criterio se publica en APS-18 y `domain/` lo **transcribe**. Una tabla de correspondencias transcrita a código **es ejecutable por definición** — igual que `weightingProfile.ts` lo es hoy para el Score.

**No es un defecto del ADR: es su propósito.** Pero conviene que el Product Office lo apruebe sabiéndolo, con dos salvaguardas que el propio precedente ya impone:

- La transcripción **declara que no decide** y **no se edita** cuando el criterio cambia: se publica una versión nueva *(R-INM · SP-04)*.
- La lógica **es una correspondencia, no un algoritmo**: sin umbrales, sin cálculo y sin estado *(ADR-18 §5.1)*.

> **Riesgo asociado: RA18-3**, ya registrado — que la transcripción *derive* del criterio publicado.

## 1.3 Estado de aprobación

> ⛔ **ADR-18 no puede aprobarse en este sprint, y no debe.**

Su **§11 somete tres cuestiones al Product Office** y su **Definition of Done (§14)** exige pronunciamiento sobre las tres, ratificación de las doce reglas, asignación de código oficial y **publicación de `SP-01`**.

**Ninguna de las cuatro es competencia de ingeniería.** El documento permanece `Draft`, que por **ADS-00 R-4** no prevalece sobre nada.

**Las tres cuestiones abiertas, sin cambios:**

1. ¿Puede el Perfil matizar la barrera que APS-18 §9.2 tabula por momento?
2. ¿La designación es `SP-nn` o la fija APS-18 con otro esquema?
3. ¿Se publica el criterio en APS-18 o en un anexo propio?

---

# Fase 2 — El productor de `ObservedInput`

## 2.1 Quién tiene autoridad

> **El Orchestrator, y no por conveniencia sino porque es el único que puede.**

| Regla | Qué impide |
| --- | --- |
| **ADR-04 §7.6 · R-02 · R-03** | Que un agente conozca o invoque a otro |
| **D-A2** | Que el `domain/` comercial importe el `domain/` de otro módulo |
| **R-24** | Que el Orchestrator conozca persistencia — **por eso obtiene los datos por Agent API y no por repositorio** |
| **R-11** | Que una ruta invoque un agente directamente |

**Las cuatro juntas dejan un solo componente posible**, y es el implementado: `commercialFactsOrchestrator`.

> **No es una solución provisional.** La composición de `ObservedInput` es coordinación entre tres agentes, y coordinar es exactamente lo que un Orchestrator es. Trasladarla a cualquier otro sitio rompería una de las cuatro reglas.

## 2.2 Qué datos puede contener

Cada campo, con el agente que lo produce:

| Campo | Origen | Clase |
| --- | --- | --- |
| `lead` | Lead Hunter — identidad del Registro | Observado |
| `source` | Lead Hunter — **Fuente** de la Referencia de Origen | Observado *(ADR-12 §7.1 autoriza conservarla)* |
| `website` · `phone` | Lead Hunter — atributos de la Empresa | Observado |
| `rating` · `reviewCount` | Lead Hunter — reputación publicada | Observado |
| `measuredFactors` | Lead Analyzer — `breakdown[].measuredFactors` | Observado *(APS-08 §11)* |

## 2.3 Qué datos quedan prohibidos

| Prohibido | Por qué |
| --- | --- |
| `description` · `flaws` · `angle` · `revenueLoss` · `whyWebsiteNeeded` | **Prosa generativa**, no medición *(COM-04 §4)*. `revenueLoss` además infringiría CD-07 |
| `score` · `band` · `classification` | **Orientan, no afirman.** Son lectura, no observación |
| `unmeasuredFactors` | Es la declaración de lo **no** medido. Se declara desconocido, nunca se afirma *(RE-3)* |
| Las siete variables del `BuyerDiagnosis` | **`Inferida` nunca se afirma** *(RE-2)*. Además ninguna es `Observable` antes del primer contacto *(CD-02)* |
| `status` del Lead | Estadio del ciclo de vida: describe lo que **AKVEZ** hizo, no el negocio |

**La prohibición es estructural, no documental:** `ObservedInput` no declara ninguno de esos campos, de modo que **no hay por dónde entrar**. Lo verifica el compilador y lo confirma la suite reutilizable de `affirmableFacts.contract.ts`.

---

# Fase 3 — F-10: representación de la ausencia

## 3.1 Dónde se pierde

**Origen exacto: `modules/lead-hunter/infrastructure/googlePlacesAdapter.ts`, líneas 164-170.**

```ts
website:     place.websiteUri          || "",
phone:       place.nationalPhoneNumber || "",
googleMapsUrl: place.googleMapsUri     || "",
rating:      place.rating              || 0,
reviewCount: place.userRatingCount     || 0,
```

**El adapter convierte «la fuente no lo publica» en «vale cadena vacía» o «vale cero».** Es una infracción de **R-38** —*«un atributo ausente se representa como ausente; ningún valor por defecto sustituye a un dato que no existe»*— cometida en el punto donde el dato entra al sistema.

## 3.2 Dónde se cementa

**`shared/persistence/contracts/Lead.ts`** declara `website: string`, `phone: string`, `rating: number`, `reviewCount: number` — **todos obligatorios**. El Persistence Contract **no admite la ausencia**, de modo que aunque el adapter la conservase, no habría dónde guardarla.

**La pérdida se propaga después sin más transformación:** `LeadModel` → `RegisteredLead` → `listLeadLibrary` → Agent API.

## 3.3 Un caso que no llegó a ser hecho, y por poco

```ts
name: place.displayName?.text || "Negocio sin nombre"
```

**El sistema fabrica una denominación cuando la fuente no la publica.** No se ha convertido en afirmación **solo porque `ObservedInput` no declara `name`** — decisión tomada en el Sprint 05 por otro motivo. Un contacto que dijera *«Hola, Negocio sin nombre»* habría sido el resultado.

> **Se anota como advertencia: si alguna vez se añade `name` a la evidencia, este valor fabricado debe tratarse antes.**

## 3.4 Dónde debe corregirse

| Capa | ¿Corresponde? | Razonamiento |
| --- | :-: | --- |
| **Origen** *(adapter)* | ✅ **Sí, es el lugar correcto** | Es donde el dato entra y donde la ausencia todavía existe. Devolver `undefined` en lugar de `""`/`0` restituye lo que la fuente dijo |
| **Persistence Contract** | ✅ **Sí, es condición necesaria** | Sin campos opcionales no hay dónde conservar la ausencia. Sin este cambio, el del adapter no sirve de nada |
| **Orchestrator** | ⚠️ **Es donde está hoy, y es un parche** | Funciona y está probado, pero **repara aguas abajo lo que se rompió aguas arriba**: cualquier otro consumidor de `RegisteredLead` sigue recibiendo `""` y `0` |

> **La corrección pertenece al origen y al contrato de persistencia, en ese orden. El Orchestrator solo la anticipa.**

## 3.5 Alcance real de la corrección

Ocho puntos, en tres módulos y el frontend:

| # | Fichero | Cambio |
| --- | --- | --- |
| 1 | `lead-hunter/infrastructure/googlePlacesAdapter.ts` | Dejar de rellenar con `""` / `0` |
| 2 | `lead-hunter/domain/prospectDiscoveryPort.ts` | Campos opcionales en `DiscoveredProspect` |
| 3 | `shared/persistence/contracts/Lead.ts` | Campos opcionales |
| 4 | `shared/persistence/models/LeadModel.ts` | Ídem |
| 5 | `shared/persistence/adapters/leadMapper.ts` | Conservar la ausencia |
| 6 | `lead-hunter/application/listLeadLibrary.ts` | `RegisteredLead` con campos opcionales |
| 7 | `shared/mappers/leadLibraryMapper.ts` · DTO | Decidir cómo se publica la ausencia |
| 8 | `src/` | La UI debe distinguir «sin dato» de «cero» |

**Además, `leadRepository.contract.ts` deberá extenderse** para exigir que la ausencia sobreviva —hoy no lo comprueba, porque no podía—.

> ⚠️ **Toca el único flujo que está en producción.** Es un sprint propio, con su propia revisión, y **requiere autorización explícita** por afectar a `lead-hunter`.

## 3.6 Barrido de otras ausencias mal representadas

| Punto | Estado |
| --- | :-: |
| `measuredFactors` con cadenas vacías | ✅ La proyección las descarta |
| `rating: 0` con `reviewCount > 0` | ✅ Correcto — es una calificación real y baja, y debe afirmarse |
| `rating` genuinamente `0` que el `\|\| 0` vuelve indistinguible de ausente | ⚠️ **Indistinguible por diseño del origen.** Sin efecto hoy: la reputación solo se afirma con `reviewCount > 0` |
| `source` vacío | ✅ No ocurre: el adapter siempre declara la Fuente |
| `null` mal usado | ✅ No se encontró ninguno en la cadena de evidencia |

---

# 4. Riesgos

| # | Riesgo | Severidad |
| --- | --- | --- |
| **R-1** | **Que ADR-18 se apruebe sin publicar `SP-01`.** El bloqueo de `GenerateProposal` permanecería con apariencia de resuelto *(RA18-2)* | 🔴 Alta |
| **R-2** | **Que el productor de hechos observados nunca se decida.** COM-04 §7 elevó a APS-08/APS-19 si el Lead Analyzer debe producir hechos, y sigue abierta. Hoy la lista se sostiene en `measuredFactors`, que **no fue diseñado para esto** | 🔴 Alta |
| **R-3** | **Que F-10 se dé por resuelta porque el Orchestrator la repara.** La reparación es local: cualquier consumidor nuevo de `RegisteredLead` reintroduce el defecto sin darse cuenta | 🟡 Media |
| **R-4** | Que se añada `name` a `ObservedInput` sin tratar el *«Negocio sin nombre»* fabricado *(§3.3)* | 🟡 Media |

---

# 5. Deuda actualizada

| ID | Descripción | Estado |
| --- | --- | :-: |
| **F-2** | Unicidad `(leadId, issue)` y `(leadId, sequence)` en el motor real | 🟡 |
| **F-3** | `userId` placeholder de un solo inquilino | 🟡 |
| **F-5** | Vocabulario con tildes en el contrato público — requiere ADR-06 | 🟡 |
| **F-7** | `reachableChannels` sin productor real | 🔴 |
| **F-9** | `createdAt` no observable desde el contrato de repositorio | 🟡 |
| **F-10** | **Ausencia codificada como `""` y `0` en el origen** — auditada aquí; corrección localizada y dimensionada | 🔴 |
| **Bloqueo** | ADR-18 `Draft`, `SP-01` sin publicar | 🔴 |
| **Bloqueo** | Productor de hechos observados sin decidir *(COM-04 §7.1)* | 🔴 |

---

# 6. Conclusión

**Ninguna de las tres fases produjo un cambio de código, y no debía producirlo.**

`GenerateProposal` sigue bloqueado por **dos decisiones que no son de ingeniería**: la publicación de `SP-01` y la definición del productor de hechos observados. **F-10 no lo bloquea** —el Orchestrator lo repara— pero **deja el sistema con un defecto que solo está tapado en un punto**.

---

# 7. Referencias

**ADR-04** §7.6 · **ADR-08** §5 · **ADR-12** §7.1 · **ADR-13** §6.2 · **ADR-14** R-INM · **ADR-15** §7.2, §12 · **ADR-18** *(Draft)* §5, §7, §10, §11, §14, SP-04, SP-07 · **ADS-00** R-4 · **APS-08** §11 · **APS-18** §9.2, RE-2, RE-3 · **APS-19** CD-02, CD-07 · **DEV-00** R-02, R-03, R-11, R-24, R-38, D-A2 · **COM-03** · **COM-04** · **COM-05**.
