# COM-39 — Auditoría de Cierre de Gobernanza

| Campo | Valor |
| --- | --- |
| Código | COM-39 |
| Clasificación | **Auditoría de cierre de bloque de gobernanza** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Bloque cerrado.** Dos decisiones aprobadas · cero cambios de código |
| Fecha | 2026-08-04 |
| Sprint | **COM-39 — Architecture Governance Closure** |

---

# 1. Estado anterior

| # | Cuestión | Estado al iniciar |
| :-: | --- | --- |
| **1** | **ADR-19** — patrón de construcción de la Agent API | 🔴 **`Draft`, bloqueado.** Bloqueo **B-4**, abierto desde COM-34. Cinco auditorías consecutivas confirmaron que **ningún documento del Blueprint publica la firma de la factoría de `presentation/`** y que el hueco solo podía cerrarse con un acto de autoridad |
| **2** | **A-6** — contenido canónico | 🔴 **Ambiguo.** **ADR-13 §6.2** decía *«Asunto · mensaje · tono»*; **PO-02 §3** *(orden 2)* declara *«no es solo el texto»*. Contradicción viva dentro del Blueprint, contra **ADS-00 R-2** |
| **3** | **Version ordering** — `issue` vs `issuedAt` | 🔴 **Sin criterio único.** **ADR-13 §10.3 V-2** decía *«la más reciente»* **sin declarar respecto de qué**; **ADS-02 §7** lo completaba con «marca temporal» y **el código con `issue`**. Bloqueo **B-5**, abierto desde **COM-19 §9 (Sprint 19)** |
| **4** | **F-2** — garantía de identidad | 🔴 **Sin requisitos completos.** **ADR-13 §12.3** declaraba siete garantías, **todas del Lead**; **ADS-02 RQ-2 solo cubre A-1**. Los tres activos comerciales **no tenían garantía alguna** |

## 1.1 Dos decisiones vivían en el código sin respaldo documental

| Decisión | Dónde | Bloqueo |
| --- | --- | :-: |
| La versión vigente es la de mayor `issue` | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` | **B-5** |
| `createPitchGeneratorAgent` recibe objeto nominal | `presentation/pitchGeneratorAgent.ts` | **B-4** |

---

# 2. Estado posterior

| # | Cuestión | Estado al cerrar |
| :-: | --- | --- |
| **1** | **ADR-19** | ✅ **`Approved`** — 2026-08-04, AKVEZ Architecture Team. **B-4 levantado** |
| **2** | **A-6** | ✅ **Canonicalizado** — ADR-13 v1.3 Cambio A. La contradicción con PO-02 §3 queda resuelta |
| **3** | **Version ordering** | ✅ **Regla normativa única** — ADR-13 v1.3 Cambio B: **la vigente es la de mayor `issue`**; `issuedAt` es metadato temporal. **B-5 levantado** |
| **4** | **F-2** | 🟡 **Capa A.2 cerrada** — G-8, G-9, G-10 en ADR-13 v1.3 Cambio C. **Capas B y C siguen abiertas** |

## 2.1 Reglas documentales consolidadas

| Regla | Documento | Efecto |
| --- | --- | --- |
| **Toda Agent API Factory nueva usa objeto de dependencias nombrado** | **ADR-19 §5.1 D-1** | Norma vigente desde hoy |
| Composition Root, único constructor · Agent API, frontera pública · Orchestrator nunca alcanza `application/` | **ADR-19 §5.4 a §5.6** | Reglas vigentes, ahora enunciadas para `presentation/` |
| **A-6 conserva estrategia, evidencia, texto, canal y versión del criterio** | **ADR-13 v1.3 §6.2** | Alineado con PO-02 §3 y ADR-16 §4.4 |
| **La versión vigente es la de mayor `issue`** | **ADR-13 v1.3 §10.3 V-2** | Criterio único para los **cuatro** activos versionados |
| **G-8 unicidad · G-9 atomicidad · G-10 resolución determinista** | **ADR-13 v1.3 §12.3** | Garantías exigidas a la persistencia |

## 2.2 Las dos decisiones de §1.1 quedan regularizadas

| Decisión | Ahora |
| --- | :-: |
| Ordenar por `issue` | ✅ **Conforme a V-2 enmendada** |
| Factoría nominal | ✅ **Conforme a ADR-19 D-1** |

> **Es regularización, no validación retroactiva.** Ambas decisiones se toman ahora por su propio fundamento, y el código resulta conforme. **Si el fundamento hubiera llevado a `issuedAt` o a la forma posicional, el código habría tenido que cambiar.**

---

# 3. Archivos creados — 4

| # | Archivo | Estado |
| :-: | --- | :-: |
| **1** | `docs/architecture/ADR-19 — Agent API Factory Construction Pattern.md` | ✅ **Approved** |
| **2** | `docs/architecture/ADR-13 v1.3 — Consolidated Amendment.md` | ✅ **Approved** |
| **3** | `docs/architecture/INDEX.md` | Catálogo de `docs/architecture/` |
| **4** | `docs/architecture/COM-39 — Governance Closure Audit.md` | Este documento |

> **`ADR-XX — Agent API Factory Construction Pattern.md` se conserva sin modificar** como registro del borrador. **ADR-19 es su versión definitiva.**

# 4. Archivos modificados — 19

**Referencia de supersesión añadida al final. Ninguno eliminado. Ninguno marcado `Deprecated`.**

| Serie | Ficheros |
| --- | :-: |
| **COM-34** | 1 |
| **COM-35** | 4 |
| **COM-36** | 4 |
| **COM-37** | 5 |
| **COM-38** | 5 |
| **Total** | **19** |

**Texto añadido:** *«Superseded by ADR-13 v1.3 and ADR-19»*, con la precisión de que **la supersesión alcanza a las materias decididas y no a las cuestiones abiertas** que estos documentos siguen siendo el único registro de — señaladamente la enmienda de **ADR-08 §13**.

---

# 5. Validación final

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 pruebas · 26 ficheros** |

| Métrica | Valor |
| --- | :-: |
| Ficheros `.ts` / `.tsx` modificados | **0** |
| Pruebas modificadas o creadas | **0** |
| Ficheros de `docs/blueprint/` modificados | **0** |

**Directorios protegidos — ninguno tocado:** `src/` · `server/` · `domain/` · `application/` · `infrastructure/` · `presentation/` · `bootstrap/`

**Prohibiciones del sprint:** ❌ wrappers · ❌ migración de factorías existentes · ❌ contratos públicos · ❌ cierre de F-2 por código. **Ninguna infringida.**

---

# 6. Decisiones arquitectónicas cerradas

| # | Decisión | Instrumento | Levanta |
| :-: | --- | --- | :-: |
| **1** | **Patrón de construcción de la Agent API** | **ADR-19** `Approved` | **B-4** |
| **2** | **Contenido canónico de A-6** | **ADR-13 v1.3** Cambio A | Contradicción ADR-13 §6.2 / PO-02 §3 |
| **3** | **Criterio de vigencia de versión** | **ADR-13 v1.3** Cambio B | **B-5** · responde **COM-19 §9** |
| **4** | **Garantías de identidad G-8/G-9/G-10** | **ADR-13 v1.3** Cambio C | **F-2 Capa A.2** |

---

# 7. Bloqueos restantes

| ID | Descripción | Sev. | Propietario |
| --- | --- | :-: | --- |
| **B-1** | **`SP-01` sin publicar** — `selectStrategy` lanza; la emisión no es reproducible | 🔴 | **Product Office** |
| **B-2** | **Reintentos del punto de control** sin valor aprobado | 🔴 | **Product Office**, vía APS-17 |
| **CH-01/02/03** | **Longitud de canal** — propuesta en APS-17, no publicada | 🔴 | **Product Office** |
| **F-1** | **Dos puertos de redacción** sobre el mismo cometido | 🟡 | Arquitectura |
| **F-2** | **Capas B y C** — requisitos de motor e implementación | 🟡 | **Arch. Team** *(B)* · **Engineering** *(C)* |
| **F-3** · **F-9** | `userId` placeholder · `createdAt` no observable | 🟡 | Ingeniería |

## 7.1 Actos de aplicación pendientes de las decisiones de hoy

**Las decisiones están aprobadas; su descenso a los documentos del Blueprint, no.**

| # | Acto | Documento | Urgencia |
| :-: | --- | --- | :-: |
| **1** | **Corregir ADS-02 §7** — dice «marca temporal», contra V-2 enmendada | ADS-02 | 🔴 **Alta** |
| **2** | **Aplicar los tres cambios y la fila v1.3** al fichero del Blueprint | `docs/blueprint/ADR/ADR-13` | 🔴 Alta |
| **3** | **Añadir requisitos de motor a ADS-02 §3** citando G-8/G-9/G-10 | ADS-02 | 🟡 **F-2 Capa B** |
| **4** | **Cerrar formalmente COM-19 §9** | — | 🟡 |
| **5** | **Descender R-a a R-d a DEV-00 §3** | DEV-00 | 🟡 |
| **6** | **Trasladar ADR-19 a `docs/blueprint/ADR/`** y sincronizar `docs/blueprint/INDEX.md` | Blueprint | 🟡 |
| **7** | **Enmendar ADR-08 §13** — retirada del par heredado sobre A-6 | ADR-08 | 🟡 |
| **8** | **Crear el registro de la serie F-** y resolver la colisión del identificador `F-2` | — | 🟡 |

> ### ⚠️ **El acto 1 es el más urgente.** **ADS-02 §7 dice hoy lo contrario que V-2 enmendada**, y ADS-02 es el documento de referencia del motor real. **Dejarlo sin corregir reintroduce exactamente la divergencia que el Cambio B cierra.**

## 7.2 ⚠️ Nota de alcance sobre las dos aprobaciones

**ADR-19 y ADR-13 v1.3 residen en `docs/architecture/`, no en el Blueprint.** `docs/blueprint/INDEX.md` **no ha sido modificado**, conforme a la restricción del sprint.

> **Son `Approved` y vinculantes por el acto de aprobación registrado en sus cabeceras.** Su **alta en el catálogo del Blueprint es un acto pendiente** *(§7.1, actos 2 y 6)*. **Se registra para que la diferencia no se descubra más tarde.**

---

# 8. Recomendación del siguiente sprint

> ## **COM-40 — Blueprint Descent & Agent API Migration**

**Dos bloques, en este orden:**

### Bloque 1 — Descenso documental *(sin código)*

Ejecutar los actos **1 a 6** de §7.1. **Empezando por el 1**, que es el único que hoy deja dos documentos diciendo cosas contrarias.

### Bloque 2 — Migración de las Agent API *(código, alcance cerrado)*

**Ahora está autorizada por ADR-19 §9.2, y ADR-19 la remite expresamente a un sprint separado — que es éste.**

| Trabajo | Alcance |
| --- | :-: |
| `createLeadHunterAgent` → objeto nominal | 1 factoría + 1 llamada en el Composition Root |
| `createLeadAnalyzerAgent` → objeto nominal | 1 factoría + 1 llamada |
| Pruebas antirregresión de cableado | 2, con el patrón ya verificado en COM-33 §3.4 |

> **Es el primer trabajo de código real desde COM-33**, y es pequeño, cerrado y con precedente probado.

### Lo que NO debe entrar en COM-40

**`GenerateProposal` sigue detenido.** **B-1 no se ha movido**: `selectStrategy` sigue lanzando, el punto de control sigue sin cuerpo y **no debe crearse ruta HTTP**. Nada de este sprint lo aproxima.

**F-2 Capa C** *(constraints, transacciones, pruebas de concurrencia)* **sigue bloqueada** hasta que exista ADS-02 §3 *(acto 3)* y un motor real.

---

# 9. Referencias

**ADS-00 v1.3** *Orden de Precedencia*, R-1 a R-7, *Estados del Documento* · **ADS-01 v1.4** §3.1, §3.2 · **ADS-02 v1.1** §3, §7 · **PO-02 v1.3** §3 · **APS-17** · **APS-18 v1.2** §8 · **ARCH-01 v1.3** §1.2, §4, §6.1 · **ADR-04 v1.3** §7.7, §7.8 · **ADR-08 v1.2** §13 · **ADR-09 v1.3** §5.1, §5.2, §6, §8.1 · **ADR-12 v1.1** §7.2 · **ADR-13 v1.2** §6.2, §10.3, §12.3 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2, §9.1 · **ADR-19 v1.0** · **ADR-13 v1.3 Consolidated Amendment** · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **DEV-00** · **AR-05** §5.1 · **COM-19** §9 · **COM-22** §4.2 · **COM-33** a **COM-38**.
