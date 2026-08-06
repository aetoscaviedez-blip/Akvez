# COM-46 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-46 / 2 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado.** **ADR-13 v1.3 APLICADA** · cero cambios de código |
| Fecha | 2026-08-04 |
| Sprint | **COM-46 — ADR-13 v1.3 Application + Governance Synchronization** |

> ### **Primera modificación del Blueprint en toda la cadena COM-33 → COM-46, y se hizo con autorización explícita del sprint.**

---

# 1. Cambios realizados

## 1.1 🔵 Blueprint — 2 ficheros

### `docs/blueprint/ADR/ADR-13 — Canonical Persistence Engine.md`

| # | Ubicación | Cambio |
| :-: | --- | --- |
| **1** | **Cabecera** | `Versión` **1.2 → 1.3** · `Última actualización` **2026-07-30 → 2026-08-04** |
| **2** | **Historial de Versiones** | ➕ **Fila v1.3** con descripción y motivo completos |
| **3** | **§6.2**, fila **A-6**, columna «Contenido» | *«Asunto · mensaje · tono»* → **estrategia · evidencia · texto · canal · versión del criterio** *(ADR-16 §4.4, en desarrollo de PO-02 §3)* |
| **4** | **§10.3**, regla **V-2** | Se completa: **la vigente es la de mayor número de emisión**; **`issuedAt` es metadato y NO determina la vigencia** |
| **5** | **§12.3** | ➕ **G-8** *(unicidad de identidad)* · **G-9** *(atomicidad)* · **G-10** *(resolución determinista)* |

### `docs/blueprint/INDEX.md`

| # | Cambio |
| :-: | --- |
| **6** | Fila de **ADR-13**: versión **1.2 → 1.3** · descriptor **«nueve eventos: E-1 a E-9 · diez garantías: G-1 a G-10»** |
| **7** | `Última actualización` del índice: **2026-07-30 → 2026-08-04** |

## 1.2 Documentos creados — 2

| # | Documento |
| :-: | --- |
| **1** | `COM-46 — ADS-02 Sync Checklist.md` |
| **2** | `COM-46 — Sprint Audit.md` |

## 1.3 Copias de respaldo

| Fichero | Respaldo |
| --- | --- |
| `ADR-13 — Canonical Persistence Engine.md` *(v1.2)* | `/tmp/ADR-13.v1.2.backup.md` |
| `INDEX.md` | `/tmp/INDEX.backup.md` |

---

# 2. Verificación de la aplicación

| Comprobación | Resultado |
| --- | :-: |
| Versión de cabecera | ✅ **1.3** |
| Fecha de última actualización | ✅ **2026-08-04** |
| Filas del Historial | ✅ **4** — 1.3, 1.2, 1.1, 1.0 |
| Garantías en §12.3 | ✅ **10** — G-1 a G-10 |
| Fila A-6 corregida | ✅ |
| Regla V-2 completada | ✅ |
| **Rastro de *«Asunto · mensaje · tono»*** | ✅ **Eliminado — 0 ocurrencias** |
| **Rastro de *«la más reciente y la que se presenta»*** | ✅ **Eliminado — 0 ocurrencias** |
| Secciones no enmendadas | ✅ **§6.1, §6.3, §10.1, §10.2, §10.4, §11, §12.1, §12.2, §12.4, §13 íntegras** |
| Otras once filas de §6.2 | ✅ **Sin tocar** |
| **V-1, V-3, V-4, V-5** · **G-1 a G-7** | ✅ **Texto conservado** |

> ### **Se aplicó v1.3 exactamente.** El enunciado de V-2 conserva el literal **`(issue)`** tal como fue aprobado. **No se aplicó ningún contenido de la propuesta v1.4** — habría sido aplicar algo no aprobado.

---

# 3. Cambios NO realizados

| Ámbito | Estado | Motivo |
| --- | :-: | --- |
| **`domain/`** · **`application/`** · **`infrastructure/`** · **`presentation/`** | ✅ **Intactos** | Prohibido por el sprint |
| `bootstrap/` · `routes/` | ✅ **Intactos** | — |
| **Contratos existentes** | ✅ **Sin cambios** | Prohibido |
| **ADS-02** | ✅ **NO modificado** | Tarea 3 — solo checklist |
| **DEV-00** | ✅ **NO modificado** | Tarea 4 — solo registro *(§5)* |
| **ADR-19** | ❌ **NO registrado** | 🔴 **Conflicto de numeración** — §4 |
| **Propuesta v1.4** | ❌ **No aplicada** | No aprobada |
| **ADR nuevos** | **0** | Prohibido |
| **Propuestas nuevas** | **0** | Prohibido |
| Contadores del índice *(69 / 63 / 52 / 11)* | ✅ **Sin tocar** | **No cambian**: ningún documento se dio de alta ni cambió de estado |
| `GenerateProposal` | ✅ **Detenido** | B-1 y B-2 sin mover |

---

# 4. 🔴 Bloqueo registrado — numeración de ADR-19

**La Tarea 2 lo condicionaba: *«No registrar ADR-19 todavía si existe conflicto de numeración»*. Existe.**

| # | Hecho | Verificado |
| :-: | --- | :-: |
| 1 | El último ADR catalogado en `INDEX.md` es **ADR-17** | ✅ |
| 2 | **`ADR-18 — Perfil de Estrategia.md` existe** como fichero | ✅ |
| 3 | **ADR-18 NO aparece en el catálogo** | ✅ |
| 4 | ADR-18 está en **`Draft`**, v0.1 | ✅ |
| 5 | **Su número es provisional por declaración propia** | ✅ |

**ADR-18, cabecera literal:** *«Código: **ADR-18** *(**provisional** — la asignación definitiva **corresponde al Product Office**)*»*.

> ### **Desde el catálogo, el siguiente número libre es 18, no 19. No se resuelve por inferencia.**

| Campo | Valor |
| --- | --- |
| **Bloqueo** | **PO-a** — numeración de ADR-18 / ADR-19 |
| **Propietario** | **AKVEZ Product Office** — por declaración expresa de ADR-18 |
| **Severidad** | 🟡 Media |
| **Efecto** | **ADR-19 sigue `Approved` y vinculante, y fuera del catálogo** |

---

# 5. Tarea 4 — DEV-00 · **registro, sin modificar**

> **DEV-00 NO ha sido modificado.**

## 5.1 Lo que debe resolverse allí

| Cuestión | **`issue` frente a `emission`** |
| --- | --- |
| **Situación** | A-6 y A-11 usan `issue`; **A-4/A-5 usan `emission`** |
| **Conformidad** | ✅ **Los tres cumplen V-2** — ordenan por número de emisión, ninguno por marca temporal *(COM-43 §5.2)* |
| **Dónde se resuelve** | **DEV-00 §5.1 — *Nombres*** |
| **Autoridad** | **ADS-00** asigna a la categoría **DEV** *«convenciones técnicas»* y *«convenciones de código»* |

## 5.2 Por qué NO pertenece a ADR-13

| # | Razón | Autoridad |
| :-: | --- | --- |
| **1** | **La nomenclatura técnica es materia de DEV**, no de ADR | **ADS-00**, alcance de DEV |
| **2** | **DEV-00 §5.1 es la tabla de nombres** del proyecto, y no cubre este campo | DEV-00 §5.1 |
| **3** | El enunciado normativo de V-2 es *«mayor número de emisión»*; **`(issue)` es paréntesis ilustrativo** | ADR-13 v1.3 §10.3 |
| **4** | Atar una regla a un nombre de campo reproduce el acoplamiento que la frontera de persistencia evita | ADR-08 §5 · **R-27** |

> ⚠️ **Consecuencia registrada:** con V-2 aplicada tal cual, **A-5 podría parecer no conforme** por usar `emission`. **No lo es** — su semántica cumple. **El cierre está en DEV-00 §5.1, no en una nueva enmienda a ADR-13** *(COM-45/1 §2.4)*.

**Propietario:** **AKVEZ Architecture Team**, vía DEV-00 §5.1. ⚠️ Unificar el nombre **arrastraría cambio de código** en `LeadAnalysis`, su modelo, su mapper y su adapter — **fuera del alcance de la enmienda**.

---

# 6. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Pruebas iniciales → finales | **197 → 197** |

## 6.1 Código

| Métrica | Valor |
| --- | :-: |
| **Ficheros `.ts` / `.tsx` modificados** | **0** — verificado por fecha |
| Ficheros de prueba modificados | **0** |
| **Impacto funcional** | **NINGUNO** |

> **La enmienda no exige cambio de código: el código ya era conforme.** `contracts/Proposal.ts` replicaba ADR-16 §4.4 desde COM-33; los tres adapters versionados ya ordenaban por número de emisión *(COM-43 §5.2)*.
>
> **G-8, G-9 y G-10 son garantías exigidas al motor real, que no existe.** Su implementación es **F-2 Capa C**, bloqueada.

---

# 7. Efecto sobre los bloqueos

| ID | Bloqueo | Antes | Ahora |
| :-: | --- | :-: | :-: |
| **AT-a** | Aplicación de ADR-13 al Blueprint | 🔴 Abierto | ✅ **CERRADO** |
| **PO-c** | Aprobación de ADS-02 §7 | 🔴 Bloqueado por AT-a | 🔴 **Desbloqueado — ejecutable ya** |
| **F-2 Capa B** | Requisitos de motor en ADS-02 §3 | ⛔ Bloqueado por AT-a | 🟡 **Desbloqueado** *(pendiente AT-c)* |
| **COM-19 §9** | Criterio de vigencia | 🔴 Abierto desde Sprint 19 | 🟢 **Respondido** — pendiente cierre formal |

**Se mantienen sin cambio:** **PO-a** · **PO-b** · **PO-d** *(SP-01)* · **PO-e** *(B-2)* · **PO-f** *(CH-01/02/03)* · **AT-b** a **AT-h** · **ING-a** a **ING-c**.

> ### **Un bloqueo cerrado, tres desbloqueados. De 17 a 16 abiertos.**

---

# 8. Criterios de aceptación

| # | Criterio | Estado |
| :-: | --- | :-: |
| **1** | ADR-13 v1.3 aplicada correctamente | ✅ **Verificado — §2** |
| **2** | Ninguna decisión nueva creada | ✅ **0 ADR, 0 propuestas** |
| **3** | ADS-02 y DEV-00 solo documentados | ✅ **Ninguno modificado** |
| **4** | Blueprint actualizado solo donde la autoridad lo permite | ✅ **ADR-13 y su fila del índice.** ADR-19 **no registrado** — §4 |
| **5** | `GenerateProposal` detenido | ✅ **`selectStrategy` sigue lanzando** |

---

# 9. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **ADS-02 §7 sigue diciendo *«marca temporal»*, y ADR-13 ya dice lo contrario en el Blueprint.** **Desde hoy es una divergencia entre dos documentos vigentes**, no entre uno y una enmienda sin aplicar | 🔴 **Alta** |
| **2** | **`(issue)` en V-2 se lee como nombre obligatorio** y A-5 parece incumplir | 🟡 Media |
| **3** | **ADR-19 sigue vinculante y fuera del catálogo** | 🟡 Media |
| **4** | **La propuesta v1.4 queda huérfana.** COM-45 recomendó repartirla; **si no se reparte ni se archiva, quedará como instrumento pendiente sobre un documento ya enmendado** | 🟡 Media |

> ⚠️ **El riesgo 1 se agrava con este sprint, y conviene decirlo:** aplicar ADR-13 **convierte una divergencia latente en una divergencia activa entre dos documentos `Approved`**. Es el precio de aplicar primero el documento gobernante, y es el orden correcto — **pero acorta el plazo de ADS-02.**

---

# 10. Siguiente paso

> ### **Aprobar y aplicar ADS-02 v1.2 — C-1 a C-4 de `COM-46 — ADS-02 Sync Checklist.md`.**

| Campo | Valor |
| --- | --- |
| **Precondición** | ✅ **Cumplida hoy** |
| **Autoridad** | **Product Office** *(aprueba)* · **Architecture Team** *(redacta)* |
| **Bloqueos** | **Ninguno** salvo la aprobación |
| **Código** | **Cero** |

**Ejecutable en paralelo, sin dependencias:** cerrar formalmente **COM-19 §9**, cuya pregunta queda respondida por V-2 aplicada.

---

# 11. Referencias

**ADS-00 v1.3** R-1, R-3, *categoría DEV* · **PO-02 v1.3** §3 · **ADR-08 v1.2** §5 · **ADR-12 v1.1** §12.1 · **ADR-13 v1.3** §6.2, §10.3, §12.3, §13.1 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-18 v0.1** *(cabecera)* · **ADR-19 v1.0** · **ADS-02 v1.1** §3, §7 · **DEV-00** §5.1, R-27, R-30, R-64 · **`docs/blueprint/INDEX.md`** · **COM-19** §9 · **COM-33** · **COM-43** §5.2 · **COM-44/3** · **COM-45/1** · **COM-46/1**.
