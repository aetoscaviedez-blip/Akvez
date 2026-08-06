# COM-37 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-37 / 5 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado. Cero cambios funcionales** |
| Fecha | 2026-08-04 |
| Sprint | **COM-37 — Governance Resolution & Blueprint Alignment** |

---

# 1. Estado

## 1.1 Código

| Métrica | Valor |
| --- | :-: |
| **Ficheros de código modificados** | **0** |
| **Ficheros de código creados** | **0** |
| **Ficheros de código eliminados** | **0** |
| **Pruebas modificadas** | **0** |
| **Pruebas creadas** | **0** |

**Directorios protegidos por el sprint — ninguno tocado:**

`domain/` · `application/` · `infrastructure/` · `presentation/` · `bootstrap/` · `routes/`

> **La excepción prevista —*«salvo si una decisión documental aprobada requiere explícitamente actualizar referencias»*— no se ha activado: ninguna decisión se aprobó en este sprint.**

## 1.2 Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 pruebas · 26 ficheros** |

**Idéntico al estado de entrada.** *(Recordatorio de COM-33 §1: `npm run lint` es `tsc --noEmit`; el proyecto no tiene linter.)*

## 1.3 Blueprint

| Comprobación | Resultado |
| --- | :-: |
| Documentos de `docs/blueprint/` modificados | **0** |
| `INDEX.md` tocado | ❌ **No** — prohibido por el sprint |
| Documentos marcados `Deprecated` | **0** — prohibido por el sprint |
| Documentos eliminados | **0** — prohibido por el sprint |
| ADR-XX promovido a `Approved` | ❌ **No** — sin autoridad *(COM-37/1)* |

## 1.4 Documentos creados — 5

| # | Documento | Naturaleza |
| :-: | --- | --- |
| **1** | `COM-37 — Agent API Factory Ratification Decision.md` | Dictamen · **B-4 pendiente con responsable** |
| **2** | `COM-37 — Proposal Version Ordering Resolution.md` | Propuesta + propiedad · **B-5 con propietario** |
| **3** | `COM-37 — ADR-13 A6 Correction Proposal.md` | Corrección redactada, **no aplicada** |
| **4** | `COM-37 — F2 Implementation Requirements.md` | Requisitos por capa, **nada implementado** |
| **5** | `COM-37 — Sprint Audit.md` | Este documento |

---

# 2. Bloqueos actuales

**Todos se mantienen. Ninguno se cierra en este sprint.**

| ID | Descripción | Sev. | Propietario | Estado |
| --- | --- | :-: | --- | :-: |
| **B-1** | **`SP-01` sin publicar** — `selectStrategy` lanza; la emisión no es reproducible | 🔴 | **Product Office** | Abierto |
| **B-2** | **Reintentos del punto de control** sin valor aprobado | 🔴 | **Product Office**, vía APS-17 | Abierto |
| **B-4** | **ADR-19 sin autoridad de aprobación** | 🟡 | **Product Office** *(aprueba)* · Architecture Team *(redacta)* | Abierto · **responsable nominado** |
| **B-5** | **Criterio de vigencia de versión sin declarar** — ADR-13 §10.3 V-2 | 🔴 | **Architecture Team** *(define)* · Product Office *(aprueba)* | Abierto · **propietario asignado** |
| **CH-01/02/03** | **Longitud de canal** — propuesta en APS-17, **no publicada** | 🔴 | **Product Office** | Abierto |
| **F-1** | **Dos puertos de redacción** sobre el mismo cometido | 🟡 | Arquitectura | Abierto |
| **F-2** | **Unicidad de identidad en el motor real** — A-6, A-11, A-12 | 🟡 | **A.2** Arch. Team · **B** Arch. Team/Product Office · **C** Ingeniería | Abierto **en las tres capas** |

## 2.1 Qué cambió en los bloqueos — solo su claridad

| Bloqueo | Antes de COM-37 | Después |
| --- | --- | --- |
| **B-4** | Sin responsable nominado | **Product Office aprueba · Architecture Team redacta.** Cinco pasos para levantarlo |
| **B-5** | Sin propietario | **ADR-13 §10.3 es el documento propietario.** Enmienda redactada |
| **F-2** | *«Ingeniería, con ADS-02»* | **Tres capas, tres propietarios.** G-8/G-10 y RQ-10/RQ-12 redactados |

> **Ninguno se ha cerrado. Se ha eliminado la ambigüedad sobre quién puede cerrarlos.**

## 2.2 Deuda documental abierta y no bloqueante

| ID | Descripción | Propietario |
| --- | --- | --- |
| **ADR-13 §6.2 A-6** | Celda defectuosa · corrección redactada *(COM-37/3)* | Architecture Team |
| **ADR-08 §13** | Nombra `OutreachPitchRepository` como trabajo pendiente · enmienda redactada *(COM-34 §6.1)* | Architecture Team |
| **Registro serie F-** | **No existe.** Seis documentos, cuatro redacciones | Architecture Team |
| **Colisión `F-2`** | Deuda comercial vs regla ADR-17 §8.2 | Architecture Team |
| **`COM-12 RC-4`** | Origen de `issuedAt` | Arquitectura |
| **F-3** · **F-9** | `userId` placeholder · `createdAt` no observable | Ingeniería |
| **Inventario ADR-13 §6.2** | Solo A-6 auditado. **A-4 y A-5 sin comprobar** | Architecture Team |

---

# 3. Confirmación

## 3.1 ¿Existe alguna decisión todavía tomada por inferencia?

> ## ⚠️ **SÍ — dos, y ambas están vivas en el código.**

**Se responde con precisión en lugar de con un «no» cómodo.**

| # | Decisión | Dónde vive | Por qué es inferencia | Estado |
| :-: | --- | --- | --- | :-: |
| **1** | **La versión vigente es la de mayor `issue`** | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` | **ADR-13 V-2 dice «la más reciente» sin declarar respecto de qué.** El adapter completó la regla con un razonamiento propio *(COM-22 §4.2)*. **Ningún documento lo autoriza** | **B-5** · redactada la enmienda |
| **2** | **`createPitchGeneratorAgent` recibe objeto nominal** | `presentation/pitchGeneratorAgent.ts` | Autorizada por **documento de sprint (COM-33)**, no por el Blueprint. **ADR-17 §8.2 F-1 gobierna `application/`**, no `presentation/` | **B-4** · ADR-19 en `Draft` |

> ### **Las dos están registradas, tienen bloqueo, propietario y texto de enmienda redactado. Ninguna se ha ocultado, y ninguna se ha convertido en norma por el paso del tiempo.**

**Y dos que NO son inferencia, aunque pudieran parecerlo:**

| Decisión | Por qué no es inferencia |
| --- | --- |
| **La autoridad de A-6 es PO-02 §3 / ADR-16 §4.4** | **Dos vías documentales convergentes:** ADS-00 *Orden de Precedencia* + R-2, y DDD-01 §9.1/§9.2. **Ninguna requiere inferir** |
| **El ejemplo de ADR-09 §5.2 no es normativo** | **Autodeclaración literal** del propio ADR-09: *«forma ilustrativa del patrón (no es implementación)»* |

## 3.2 ¿Existe alguna regla del Blueprint contradicha?

> ## ⚠️ **SÍ — una, dentro del propio Blueprint. Ninguna por el código.**

| # | Contradicción | Naturaleza | Estado |
| :-: | --- | --- | :-: |
| **1** | **ADR-13 §6.2 fila A-6** *(«Asunto · mensaje · tono»)* **contra PO-02 §3** *(«no es solo el texto»)* | **Interna al Blueprint.** No la causa el código. Infringe **ADS-00 R-2** — un documento de orden 4 redefine a uno de orden 2 | 🔴 **Viva.** Corrección redactada en **COM-37/3**, no aplicada |

**Y dos situaciones que NO son contradicción vigente, aunque conviene registrarlas:**

| Situación | Por qué no es contradicción hoy |
| --- | --- |
| **ADR-08 §13 nombra `OutreachPitchRepository` como trabajo pendiente y el código no lo conecta** | Es **trabajo no hecho**, no una regla infringida. ⚠️ **Se convertiría en contradicción si alguien lo conectara**: COM-19 §10 declara que *«el motor no puede implementar ambos»* |
| **ADS-02 §7 dice «marca temporal» y el código ordena por `issue`** | **ADS-02 §7 describe cómo PostgreSQL satisfaría V-2 en el motor real. No hay motor.** ⚠️ **Se convertiría en contradicción el día que exista** — es el impacto 1 de COM-37/2 §5 |

> **Ninguna regla DEV-00 está infringida.** Verificado sobre R-07, R-11, R-22, R-23, R-26, R-27, R-30, R-31, R-54, R-55, R-56, R-57.

## 3.3 ¿Existe alguna modificación de código necesaria antes de aprobación?

> ## ✅ **NO. Ninguna.**

**El código es correcto bajo las reglas hoy vigentes.** Las modificaciones que existen son **posteriores** a decisiones aún no tomadas:

| Modificación | Precondición | Alcance |
| --- | --- | :-: |
| Migrar `createLeadHunterAgent` y `createLeadAnalyzerAgent` | ⛔ **ADR-19 `Approved`** | 2 factorías · 1 fichero de wiring |
| Confirmar o corregir el criterio de vigencia · añadir prueba discriminante | ⛔ **B-5 resuelto** | 2 adapters · 2 suites |
| Eliminar el par heredado sobre A-6 *(3 ficheros)* | ⛔ **Enmienda a ADR-08 §13** | 3 ficheros · 2 comentarios |
| Constraints, transacciones y pruebas de F-2 · C-1 a C-13 | ⛔ **Capas A.2 y B** | Motor real |

> ### **Ninguna es necesaria *antes* de aprobar. Todas son consecuencia *de* aprobar.**

---

# 4. Criterios de aceptación

| # | Criterio | Estado | Evidencia |
| :-: | --- | :-: | --- |
| **1** | No existe decisión arquitectónica sin propietario | ✅ | §2 — los siete bloqueos tienen propietario nominado |
| **2** | ADR-19 aprobado, rechazado **o pendiente con responsable** | ✅ | **Pendiente con responsable** — COM-37/1 §3.2 |
| **3** | Proposal Version Ordering tiene propietario | ✅ | **ADR-13 §10.3** · Architecture Team — COM-37/2 §1 |
| **4** | ADR-13 A-6 tiene corrección propuesta | ✅ | COM-37/3 §3 |
| **5** | F-2 tiene requisitos claros | ✅ | COM-37/4 — G-8/G-10, RQ-10/RQ-12, C-1 a C-13 |
| **6** | Código permanece sin cambios | ✅ | §1.1 — **0 ficheros** |

---

# 5. «No hacer» — verificación

| Prohibición | Cumplida |
| --- | :-: |
| Implementar `selectStrategy` | ✅ **No tocado.** Sigue lanzando |
| Crear rutas HTTP | ✅ **Ninguna.** Cinco handlers, los mismos |
| Modificar Agent API | ✅ **No tocada** |
| Tocar `INDEX.md` | ✅ **No tocado** |
| Eliminar documentos | ✅ **Ninguno** |
| Marcar documentos `Deprecated` | ✅ **Ninguno** |

---

# 6. Qué espera aprobación del Architecture Team

| # | Acción | Documento | Desbloquea |
| :-: | --- | --- | --- |
| **1** | **Corregir ADR-13 §6.2, fila A-6** | COM-37/3 | La contradicción viva de §3.2 |
| **2** | **Declarar el criterio de vigencia en ADR-13 §10.3 V-2** | COM-37/2 | **B-5** · COM-19 §9 |
| **3** | **Aprobar ADR-19** *(Product Office)* | COM-37/1 | **B-4** · migración de 2 Agent API |
| **4** | **Añadir G-8/G-10 a ADR-13 §12.3** | COM-37/4 | **F-2 Capa B** |
| **5** | **Enmendar ADR-08 §13** | COM-34 §6.1 | Retirada del par heredado |
| **6** | **Crear el registro de la serie F-** y resolver la colisión del identificador | COM-37/4 §6 | Que F-2 tenga una redacción |

> **Ninguna requiere código. Cuatro de las seis tocan un solo documento.**
>
> **Las acciones 1, 2 y 4 tocan todas ADR-13** — conviene agruparlas en una sola enmienda **v1.3** en lugar de tres.

---

# 7. Referencias

**ADS-00 v1.3** · **PO-02 v1.3** §3 · **APS-17** · **ADR-04 v1.3** · **ADR-08 v1.2** §13 · **ADR-09 v1.3** §5.2, §6 · **ADR-12 v1.1** · **ADR-13 v1.2** §6.2, §10.3, §12.3 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2 · **ADS-02 v1.1** §3, §7 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** · **AR-05** §5.1 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-33** · **COM-34** · **COM-35** · **COM-36** · **COM-37/1** a **COM-37/4**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
