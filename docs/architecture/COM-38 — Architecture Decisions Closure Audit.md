# COM-38 — Auditoría de Cierre de Decisiones Arquitectónicas

| Campo | Valor |
| --- | --- |
| Código | COM-38 / 5 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado. Cero cambios funcionales** |
| Fecha | 2026-08-04 |
| Sprint | **COM-38 — Architecture Decisions Closure** |

---

# 1. Cambios realizados

## 1.1 Documentos creados — 5

| # | Documento | Naturaleza | Resultado |
| :-: | --- | --- | --- |
| **1** | `COM-38 — ADR-19 Approval Blocker.md` | Registro de bloqueo | **B-4 abierto.** ADR-XX permanece `Draft` |
| **2** | `COM-38 — ADR-13 A6 Correction Application.md` | Propuesta de corrección | **Preparada, no aplicada** |
| **3** | `COM-38 — Proposal Version Ordering Resolution.md` | Propiedad + propuesta | **Propietario definido.** Criterio propuesto |
| **4** | `COM-38 — F2 Ownership Follow-up.md` | Seguimiento de propiedad | **Tabla de propiedad definida.** F-2 abierta |
| **5** | `COM-38 — Architecture Decisions Closure Audit.md` | Este documento | — |

## 1.2 Aportación nueva de este sprint

**El sprint no repitió las auditorías previas: amplió la de ADR-19 a dos documentos nunca revisados.**

| Documento | Hallazgo | Efecto |
| --- | --- | :-: |
| **ARCH-01 §4** | *«Su anatomía —**firma, factory**, contrato de resultado y puertos— la decide ADR-17 §5 a §8»* — **en la sección de `application/`** | Confirma el alcance |
| **ARCH-01 §1.2 · §6.1 DR-4** | De `presentation/` solo fija **de qué depende** *(«el tipo del caso de uso»)*, no cómo se construye | Confirma el hueco |
| **ADS-01 §3.2** | *«**¿Qué recibe la factory?** → ADR-17 §8 — un objeto `Deps`»* — pero la sección se titula **«La capa de aplicación»** | **Acotada por su propio título** |
| **ADS-01 §3.1** | *«**ARCH-01 no es autoridad: es un mapa físico**… ante discrepancia prevalece el ADR»* | ARCH-01 no puede suplir el hueco |

> ### **Seis documentos auditados. Ninguno publica la firma de la factoría de la Agent API. El hueco queda confirmado por los dos documentos que existirían precisamente para localizar esa regla si existiera.**

---

# 2. Cambios NO realizados

## 2.1 Código · **intacto**

| Métrica | Valor |
| --- | :-: |
| Ficheros `.ts` / `.tsx` modificados | **0** |
| Ficheros de código creados | **0** |
| Ficheros de código eliminados | **0** |
| Pruebas modificadas o creadas | **0** |

**Verificado por búsqueda de modificaciones posteriores al inicio del sprint sobre `server/` y `src/`: sin resultados.**

**Directorios protegidos — ninguno tocado:** `domain/` · `application/` · `infrastructure/` · `presentation/` · `bootstrap/`

## 2.2 Validación *(Paso 5)*

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 pruebas · 26 ficheros** |

**Idéntico al estado de entrada.**

## 2.3 Prohibiciones del sprint — verificación

| Prohibición | Cumplida |
| --- | :-: |
| No modificar archivos `.ts` | ✅ **0 modificados** |
| No crear endpoints | ✅ Cinco handlers, los mismos |
| No implementar **F-2** | ✅ Sin constraints, migraciones ni adapters tocados |
| No implementar **SP-01** | ✅ No tocado |
| No implementar `selectStrategy` | ✅ **Sigue lanzando** `StrategyProfileUnavailableError` |
| No aplicar decisiones no aprobadas | ✅ **Ninguna aplicada** |
| No convertir propuestas en normas | ✅ Las cuatro propuestas están marcadas como tales |
| No inferir autoridad | ✅ §4.1 |

## 2.4 Blueprint · **intacto**

| Comprobación | Resultado |
| --- | :-: |
| Documentos de `docs/blueprint/` modificados | **0** — verificado |
| **`INDEX.md`** | ❌ **No tocado** |
| ADR-XX promovido a `Approved` | ❌ **No** — sin autoridad |
| Documentos marcados `Deprecated` o eliminados | **0** |

> **Objetivo 5 del sprint — *«Actualización de índice documental únicamente si una decisión queda aprobada»*: ninguna decisión quedó aprobada, luego el índice NO se actualiza.** La condición se cumple por no activarse.

---

# 3. Decisiones cerradas

> ## **Ninguna.**

**Este sprint no aprobó nada, y no podía hacerlo: la aprobación no le corresponde.**

**Lo que sí quedó cerrado son cuestiones *de análisis*, que no son decisiones de arquitectura:**

| # | Cuestión | Estado | Cerrada por |
| :-: | --- | :-: | --- |
| **1** | ¿Existe autoridad documental para ADR-19? | ✅ **Respondida: NO** | Auditoría de 6 documentos — COM-38/1 |
| **2** | ¿Es normativo el ejemplo de ADR-09 §5.2? | ✅ **Respondida: NO** | Autodeclaración literal del propio ADR-09 |
| **3** | ¿Cuál documento tiene autoridad sobre la vigencia de versión? | ✅ **Respondida: ADR-13 §10.3** | DDD-01 §9.2 |
| **4** | ¿A-12 está alcanzada por V-2? | ✅ **Respondida: NO** | ADR-13 §6.2 y §10.3 — *«actualizable, no versionado»* |
| **5** | ¿Cuál documento es defectuoso en el conflicto de A-6? | ✅ **Respondida: ADR-13 §6.2, una celda** | ADS-00 R-1/R-2 · DDD-01 §9.1 |

> **Responder quién decide no es decidir.** **ADS-00 R-5** autoriza exactamente eso y nada más: *«aplicar esta jerarquía **únicamente para determinar qué documento debe corregirse**»*.

---

# 4. Decisiones pendientes, con propietario

| # | Decisión | Propietario | Documento propuesta | Sev. |
| :-: | --- | --- | --- | :-: |
| **1** | **Aprobar ADR-19** | **Product Office** *(aprueba)* · Architecture Team *(redacta)* | COM-38/1 | 🟡 |
| **2** | **Corregir ADR-13 §6.2, fila A-6** | **Architecture Team** · aprueba Product Office | COM-38/2 | 🔴 |
| **3** | **Declarar el criterio de vigencia en ADR-13 §10.3 V-2** | **Architecture Team** · aprueba Product Office | COM-38/3 | 🔴 |
| **4** | **Añadir G-8/G-9/G-10 a ADR-13 §12.3** | **Architecture Team** | COM-38/4 | 🟡 |
| **5** | **Añadir RQ-10/RQ-11/RQ-12 a ADS-02 §3** | **Architecture Team** · aprueba Product Office | COM-38/4 | 🟡 |
| **6** | **Enmendar ADR-08 §13** | **Architecture Team** | COM-34 §6.1 | 🟡 |
| **7** | **Crear el registro de la serie F-** y resolver la colisión del identificador | **Architecture Team** | COM-38/4 §6 | 🟡 |

> ### ✅ **No existe decisión arquitectónica sin propietario.**

## 4.1 ¿Hay decisiones aplicadas sin aprobación?

**Dos, ambas anteriores a este sprint, ambas registradas con bloqueo. Ninguna se ha convertido en norma.**

| # | Decisión aplicada en código | Por qué carece de aprobación | Bloqueo |
| :-: | --- | --- | :-: |
| **1** | **La versión vigente es la de mayor `issue`** | ADR-13 V-2 no declara criterio; el adapter lo completó *(COM-22 §4.2)* | **B-5** |
| **2** | **`createPitchGeneratorAgent` recibe objeto nominal** | Autorizada por documento de sprint *(COM-33)*, no por el Blueprint | **B-4** |

> **Ambas tienen propietario, texto de enmienda redactado y bloqueo registrado. Este sprint no las ha ampliado, normalizado ni citado como norma.**

## 4.2 Bloqueos vigentes

| ID | Descripción | Sev. | Propietario |
| --- | --- | :-: | --- |
| **B-1** | `SP-01` sin publicar | 🔴 | Product Office |
| **B-2** | Reintentos del punto de control | 🔴 | Product Office, vía APS-17 |
| **B-4** | ADR-19 sin autoridad de aprobación | 🟡 | **Product Office** |
| **B-5** | Criterio de vigencia sin declarar | 🔴 | **Architecture Team** |
| **CH-01/02/03** | Longitud de canal | 🔴 | Product Office |
| **F-1** | Dos puertos de redacción | 🟡 | Arquitectura |
| **F-2** | Unicidad de identidad en el motor | 🟡 | **A.2/B** Arch. Team · **C** Engineering |

---

# 5. Impacto Blueprint

## 5.1 Requiere actualización

| Documento | Sección | Naturaleza | Precondición |
| --- | --- | --- | :-: |
| **ADR-13** | **§6.2** fila A-6 | Corrección de **una celda** | Aprobación |
| **ADR-13** | **§10.3 V-2** | **Completar** la regla | Aprobación |
| **ADR-13** | **§12.3** | **Añadir** G-8/G-9/G-10 | Aprobación |
| **ADS-02** | **§3** | **Añadir** RQ-10/RQ-11/RQ-12 | ⛔ Tras ADR-13 §12.3 |
| **ADS-02** | **§7** | Alinear con V-2 | ⛔ Tras ADR-13 §10.3 |
| **ADR-08** | **§13** | Retirar `OutreachPitchRepository` de la lista de trabajo | Aprobación |
| **DEV-00** | §3 | R-a a R-d | ⛔ Tras ADR-19 `Approved` |
| **INDEX.md** | — | Alta de ADR-19 | ⛔ Tras ADR-19 `Approved` |

> ### **Tres de las ocho tocan ADR-13. Recomendación: una sola enmienda v1.3 que agrupe §6.2, §10.3 y §12.3**, en lugar de tres actos de registro sobre el mismo documento.

## 5.2 No requiere actualización

| Documento | Motivo |
| --- | --- |
| **PO-02 §3** | **Es la autoridad.** Coincide con ADR-16 §4.4 |
| **ADR-16** | Coincide con PO-02. **Es la autoridad del modelo de dominio** |
| **APS-18** · **APS-19** · **APS-20** | Sin conflicto detectado |
| **ADR-04** · **ADR-09** · **ADR-17** | **ADR-19 los extendería sin modificarlos** — precedente de ADR-09 §8.1 y ADR-17 §9.1 |
| **ADR-12** · **ADS-01** · **ARCH-01** · **DDD-01** | Sin conflicto detectado |
| **AR-05 §5.1** | Registro de la serie A-/T-. **F- necesita registro propio**, no cabe aquí |

## 5.3 Alcance no auditado — se mantiene abierto

> **El inventario de ADR-13 §6.2 tiene doce filas y solo A-6 ha sido examinada.** **A-4** *(«Diagnóstico de presencia digital · carencias · oportunidades»)* y **A-5** *(«Puntuación · banda · explicación»)* podrían arrastrar el mismo desfase. **No comprobado. Este sprint no lo afirma ni lo descarta.**

---

# 6. Criterios de aceptación

| # | Criterio | Estado | Evidencia |
| :-: | --- | :-: | --- |
| **1** | No existe decisión arquitectónica **aplicada sin aprobación** | ⚠️ **Dos, registradas y bloqueadas** | §4.1 — ninguna nueva; ninguna normalizada |
| **2** | ADR-19 tiene estado claro | ✅ **`Draft` bloqueado, con responsable** | COM-38/1 |
| **3** | Corrección de ADR-13 preparada **y no aplicada** | ✅ | COM-38/2 |
| **4** | Versionado tiene propietario definido | ✅ **ADR-13 §10.3 · Architecture Team** | COM-38/3 |
| **5** | F-2 tiene ownership claro | ✅ **Tabla de tres capas** | COM-38/4 |
| **6** | Código sin cambios | ✅ **0 ficheros** | §2.1 |

> **El criterio 1 se marca ⚠️ y no ✅ deliberadamente.** Las dos decisiones de §4.1 **estaban aplicadas antes de este sprint**. Marcarlo ✅ sugeriría que no existen; **están registradas, con bloqueo y propietario, y su resolución depende de las decisiones 1 y 3 de §4**.

---

# 7. Estado al cierre

> **`GenerateProposal` sigue construido y detenido.** `selectStrategy` lanza, el punto de control no tiene cuerpo, **no hay ruta HTTP** y **B-1 sigue abierto**.
>
> **No se continúa con `GenerateProposal`.** A la espera de aprobación del **Architecture Team**.

---

# 8. Referencias

**ADS-00 v1.3** *Orden de Precedencia*, R-1 a R-7, *Estados del Documento* · **ADS-01 v1.4** §3.1, §3.2 · **ADS-02 v1.1** §3, §7 · **PO-02 v1.3** §3 · **APS-17** · **ARCH-01 v1.3** §1.2, §4, §6.1 · **ADR-04 v1.3** · **ADR-08 v1.2** §13 · **ADR-09 v1.3** §5.2, §6, §8.1 · **ADR-12 v1.1** · **ADR-13 v1.2** §6.2, §10.3, §12.3 · **ADR-16 v1.1** · **ADR-17 v1.1** §8.2, §9.1 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** · **AR-05** §5.1 · **COM-19** §9 · **COM-22** §4.2 · **COM-33** a **COM-37** · **COM-38/1** a **COM-38/4**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
