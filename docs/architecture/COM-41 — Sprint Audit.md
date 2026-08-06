# COM-41 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-41 / C |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado.** Bloque A documentado · **Bloque B ejecutado** |
| Fecha | 2026-08-04 |
| Sprint | **COM-41 — ADS-02 Alignment + Agent Factory Migration** |

---

# 1. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 pruebas · 26 ficheros** |

| Métrica | Inicial | Final |
| --- | :-: | :-: |
| **Pruebas** | **197** | **197** |
| Ficheros de prueba | 26 | 26 |
| **Pruebas modificadas** | — | **0** |
| **Pruebas creadas** | — | **0** |

> ### **197 → 197, sin tocar ninguna prueba.** Es el criterio más fuerte de equivalencia de comportamiento: el mismo conjunto de aserciones sigue verde tras cambiar la forma de construcción.

---

# 2. Archivos modificados — 3

| # | Fichero | Cambio | Líneas |
| :-: | --- | --- | :-: |
| **1** | `server/modules/lead-hunter/presentation/LeadHunterAgent.ts` | **+`LeadHunterAgentDeps`**, firma desestructurada | +12 |
| **2** | `server/modules/lead-analyzer/presentation/LeadAnalyzerAgent.ts` | **+`LeadAnalyzerAgentDeps`**, firma desestructurada | +12 |
| **3** | `server/bootstrap/compositionRoot.ts` | **2 llamadas** con nombres + 1 comentario | ~3 |

## 2.1 Estado final de las firmas

```ts
export function createLeadHunterAgent({
  discoverProspects,
  listLeadLibrary
}: LeadHunterAgentDeps): LeadHunterAgentApi

export function createLeadAnalyzerAgent({
  analyzeProspects,
  listLeadScores
}: LeadAnalyzerAgentDeps): LeadAnalyzerAgentApi
```

```ts
const leadHunterAgent   = createLeadHunterAgent({ discoverProspects, listLeadLibrary });
const leadAnalyzerAgent = createLeadAnalyzerAgent({ analyzeProspects, listLeadScores });
```

## 2.2 Verificación de discriminación

> **Se revirtió temporalmente la llamada de `createLeadHunterAgent` a la forma posicional:**
>
> ```
> compositionRoot.ts(124,68): error TS2554: Expected 1 arguments, but got 2.
> ```
>
> ✅ **La migración surte efecto: la forma posicional ya no compila.** Restaurado y verificado limpio.

---

# 3. Archivos creados — 3

| # | Documento | Naturaleza |
| :-: | --- | --- |
| **1** | `COM-41 — ADS-02 Alignment Proposal.md` | 🟡 Propuesta — **ADS-02 no modificado** |
| **2** | `COM-41 — Agent Factory Migration Audit.md` | 🟢 Auditoría previa, redactada **antes** de tocar código |
| **3** | `COM-41 — Sprint Audit.md` | Este documento |

---

# 4. Archivos NO tocados

| Ámbito | Estado |
| --- | :-: |
| `domain/` | ✅ **Intacto** |
| `application/` | ✅ **Intacto** |
| `infrastructure/` | ✅ **Intacto** |
| `routes/` | ✅ **Intacto** |
| `orchestrators/` | ✅ **Intacto** |
| `docs/blueprint/` | ✅ **Intacto** — verificado |
| `createPitchGeneratorAgent` | ✅ **Intacto** — ya conforme |
| `GenerateProposal` · `selectStrategy` | ✅ **Intactos** — siguen detenidos |
| Todas las pruebas | ✅ **Intactas** |

## 4.1 Prohibiciones del sprint — verificación

| Prohibición | Cumplida |
| --- | :-: |
| Sin **wrappers** | ✅ Ninguno |
| Sin **interfaces nuevas** más allá de las dos `Deps` exigidas por D-1 | ✅ |
| Sin **flags**, **aliases** ni **adaptadores temporales** | ✅ Ninguno |
| Sin **abstracción compartida / factory base** | ✅ **Cada módulo declara su propia `Deps`** — ADR-19 no autoriza otra cosa |
| Sin **rutas HTTP** | ✅ Cinco handlers, los mismos |
| **Agent API** sin cambios | ✅ `LeadHunterAgentApi` y `LeadAnalyzerAgentApi` intactas |
| **B-1**, **B-2**, **SP-01** sin tocar | ✅ |

---

# 5. Bloque A — resultado

**Auditoría completa de ADS-02 §7: once filas contrastadas. Cuatro divergencias.**

| ID | Fila | Origen | En alcance nombrado | Propuesta |
| :-: | --- | --- | :-: | :-: |
| **D-1** | Versión vigente distinguible | ADR-13 **v1.3** | ✅ Sí | ✅ Desdoblar en dos filas |
| **D-2** | Siete garantías G-1 a G-7 | ADR-13 **v1.3** | ✅ Sí | ✅ Pasar a **diez** |
| **D-3** | **Catálogo cerrado de eventos** | ADR-13 **v1.2** | ⚠️ **No — hallazgo nuevo** | ✅ Pasar a **nueve (E-1 a E-9)** |
| **D-4** | Historial de solo crecimiento | Indeterminado | ⚠️ No | ❌ **Se eleva, no se corrige** |

## 5.1 Los dos hallazgos que aporta la auditoría completa

> ### **D-3 — ADS-02 §7 dice «siete eventos». Son nueve desde ADR-13 v1.2.**
>
> **ADS-02 v1.1 es del 2026-07-29; ADR-13 v1.2 se actualizó el 2026-07-30 incorporando E-7, E-8 y E-9.** **ADS-02 nunca se resincronizó**, y ningún sprint lo había detectado porque nadie había auditado §7 completo.

> ### **ADS-02 no menciona en ningún punto A-6, A-11 ni A-12.**
>
> Cero ocurrencias en todo el documento. **Es la raíz común de D-2, D-3 y de la Capa B de F-2**: ADS-02 quedó anclado al modelo anterior a la extensión comercial de ADR-13 v1.2.

## 5.2 Verificaciones exigidas por el sprint

| Exigencia | Resultado |
| --- | :-: |
| *«Separar criterio de selección y conservación de marca temporal»* | ✅ **Dos filas.** V-3 gana fila propia, que no tenía |
| *«No eliminar V-3»* | ✅ **Conservada y reforzada** |
| *«La modificación no crea garantías nuevas, solo sincroniza»* | ✅ **Verificado** — G-8/G-9/G-10 las creó **ADR-13 v1.3**, no esta propuesta |

**ADS-02 no ha sido modificado.** Requiere aprobación del **Product Office**, que aprobó su v1.1 en GOV-01.

---

# 6. Cumplimiento de ADR-19

| Agent API | Antes | Después | D-1 |
| --- | --- | --- | :-: |
| `createPitchGeneratorAgent` | Nominal | Nominal | ✅ |
| `createLeadHunterAgent` | **Posicional** | **Nominal** | ✅ |
| `createLeadAnalyzerAgent` | **Posicional** | **Nominal** | ✅ |

> ### ✅ **Las tres Agent API del backend cumplen ADR-19 D-1. La divergencia registrada desde COM-33 §3.3 queda cerrada.**

**El riesgo 1 de ADR-19 §10** —*«la migración no se ejecuta nunca y las tres Agent API quedan divergentes con una norma vigente que lo prohíbe»*— **queda cerrado.**

---

# 7. Limitación documentada

> ### **No se han creado pruebas nuevas, y el sprint exige explicar por qué.**
>
> Una prueba antirregresión de cableado **no puede detectar aquí el error real**. Las dos de `pitchGeneratorAgent` *(COM-33 §3.4)* discriminan porque **cuatro de sus seis dependencias eran indistinguibles por tipo** y el cruce **compilaba**.
>
> **En estas dos, las aridades difieren** —3 vs 0 argumentos, 4 vs 0—, de modo que **cruzarlas ya era error de compilación antes de migrar**. Una prueba de cableado **pasaría siempre**: sugeriría una garantía que no aporta.
>
> **Lo que sí verifica la migración:** `tsc` rechaza la forma posicional *(§2.2)*, y **197 pruebas sin modificar** confirman comportamiento idéntico.

---

# 8. Cambios fuera de alcance

> ## **Ninguno.**

| Comprobación | Resultado |
| --- | :-: |
| ¿Se modificó algo no autorizado? | ❌ **No** |
| ¿Se aplicó alguna decisión sin aprobación? | ❌ **No.** ADS-02 sigue sin tocar |
| ¿Se creó alguna abstracción no autorizada? | ❌ **No** |
| ¿Se tocó el Blueprint? | ❌ **No** |

---

# 9. Bloqueos y pendientes

## 9.1 Bloqueos vigentes — sin cambios

| ID | Descripción | Sev. | Propietario |
| --- | --- | :-: | --- |
| **B-1** | `SP-01` sin publicar | 🔴 | Product Office |
| **B-2** | Reintentos del punto de control | 🔴 | Product Office |
| **CH-01/02/03** | Longitud de canal | 🔴 | Product Office |
| **F-1** | Dos puertos de redacción | 🟡 | Arquitectura |
| **F-2** | Capas B y C | 🟡 | Arch. Team · Engineering |
| **F-3** · **F-9** | `userId` placeholder · `createdAt` | 🟡 | Ingeniería |

## 9.2 Pendientes documentales

| # | Acto | Propietario | Sev. |
| :-: | --- | --- | :-: |
| **1** | **Aplicar COM-41/A a ADS-02 §7** *(D-1, D-2, D-3)* | **Product Office** | 🔴 **Alta** |
| **2** | **Verificar D-4** — referencia `§12.1, E-5` | Architecture Team | 🟢 Baja |
| **3** | **Aplicar ADR-13 v1.3 al fichero del Blueprint** | Architecture Team | 🔴 Alta |
| **4** | **Resolver numeración ADR-18 / ADR-19** y catalogar | **Product Office** | 🟡 |
| **5** | **Descender R-a a R-d a DEV-00 §3** | Architecture Team | 🟡 |
| **6** | **Cerrar COM-19 §9** | Architecture Team | 🟡 |
| **7** | **ADS-02 §3** — requisitos de motor *(F-2 Capa B)* | Arch. Team · Product Office | 🟡 |
| **8** | **Enmendar ADR-08 §13** | Architecture Team | 🟡 |

> **El acto 5 pasa a ser ejecutable con menos fricción**: las tres Agent API ya cumplen D-1, de modo que **R-a no nacería incumplida por ningún módulo**.

---

# 10. Referencias

**ADR-09 v1.3** §5.1, §5.2, §5.3 · **ADR-12 v1.1** E-5 · **ADR-13 v1.2** §10.3, §12.1, §12.3, §13.1, §13.4 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-19 v1.0** §5.1, §5.2, §9.1, §9.2, §10 · **ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.1** §7 · **DEV-00** R-54, R-55 · **COM-33** §3, §3.4 · **COM-39** · **COM-40/1** a **COM-40/5** · **COM-41/A** · **COM-41/B**.
