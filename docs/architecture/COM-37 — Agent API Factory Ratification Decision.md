# COM-37 — Decisión de Ratificación del Patrón Agent API Factory

| Campo | Valor |
| --- | --- |
| Código | COM-37 / 1 |
| Clasificación | **Dictamen de ratificación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **PENDIENTE CON RESPONSABLE ASIGNADO.** No aprobado, no rechazado |
| Fecha | 2026-08-04 |
| Objeto | `docs/architecture/ADR-XX — Agent API Factory Construction Pattern.md` v0.1 `Draft` |
| Bloqueo | **B-4** — se mantiene abierto, ahora con responsable nominado |
| Antecedentes | **COM-33 §3.3** · **COM-34** t2 · **COM-35/2** · **COM-36/2** |

> **Cero cambios de código.** `createLeadHunterAgent` y `createLeadAnalyzerAgent` **no se han tocado**, conforme a la restricción del sprint.

---

# 1. Las cuatro respuestas

| # | Pregunta | Respuesta |
| :-: | --- | --- |
| **1** | ¿Existe autoridad suficiente para convertir ADR-XX en ADR-19? | 🔴 **NO — y no puede existir por adelantado.** §2 |
| **2** | ¿Quién tiene autoridad para aprobarlo? | **AKVEZ Product Office**, con redacción del **Architecture Team**. §3 |
| **3** | ¿Qué documentos respaldan la decisión? | **Cinco de las seis decisiones**, sí. **D-1, no: es materia nueva.** §4 |
| **4** | ¿Solo nuevas factories o migrar existentes? | **Solo nuevas, hasta la ratificación.** Después, migración recomendada pero **no urgente**. §5 |

---

# 2. Pregunta 1 — ¿Existe autoridad suficiente?

## 2.1 Respuesta: no, y la razón es estructural

> ### **Ningún documento existente puede respaldar D-1, porque D-1 es exactamente lo que ningún documento dice.**

**Un ADR que *crea* autoridad no puede *derivarla* de los documentos que consulta.** Exigir respaldo documental previo a la decisión que el ADR existe para tomar es una condición que **ningún ADR nuevo podría cumplir jamás** — ni ADR-08, ni ADR-13, ni ADR-17 la cumplieron cuando se escribieron.

**La condición se satisface con un acto de aprobación, no con una cita.**

## 2.2 El hueco, verificado por cuarta vez

| Documento | Qué fija sobre la factoría de `presentation/` | ¿Obliga? |
| --- | --- | :-: |
| **ADR-04** §7.7, §10, glosario | **Qué expone** la Agent API y hacia quién | ❌ No |
| **ADR-09 §5.2** | Ejemplo `createLeadHunterAgent(discoverProspects)`, **encabezado por *«forma ilustrativa del patrón (no es implementación)»***. Su enunciado decisional **nombra `application/`** | ❌ **No** |
| **ADR-09 §5.3 · R-55** | **Quién construye**. Nada sobre la firma | ❌ No |
| **ADR-17 §8.2 F-1** | Objeto `Deps` con nombres — **para `application/`** | ❌ No alcanza |
| **DEV-00 §5.1** | `create` + agente + `Agent` — **solo el nombre** | ❌ No |

> **Dato que cierra la cuestión del ejemplo de ADR-09 §5.2:** el código real diverge de él desde hace sprints —`createLeadHunterAgent` recibe **dos** parámetros, el ejemplo muestra **uno**— y **ninguna auditoría lo señaló nunca**. Nadie lo ha tratado como normativo.

## 2.3 Aplicación de la regla del sprint

**Regla principal:** *«No resolver por inferencia. Toda decisión debe estar respaldada por un documento con autoridad suficiente.»*

> **La propuesta `Draft` ya existe: es ADR-XX.** Lo que procede es **mantenerla, nominar responsable y detenerse** — que es lo que este documento hace.

---

# 3. Pregunta 2 — ¿Quién tiene autoridad para aprobarlo?

## 3.1 El patrón del propio Blueprint, sin excepciones

| ADR | `Responsable` *(redacta)* | `Aprobado por` |
| --- | --- | --- |
| **ADR-08** v1.2 | Architecture Team | **Product Owner** — cierre Sprint 13, Tarea 4 |
| **ADR-13** v1.2 | Architecture Team | **AKVEZ Product Office** — GOV-01 |
| **ADR-16** v1.1 | Architecture Team | **Product Office y Architecture Team** — *Architecture Freeze* |
| **ADR-17** v1.1 | Architecture Team | **Product Office y Architecture Team** — *Architecture Freeze* |
| **ADS-02** v1.1 | Architecture Team | **AKVEZ Product Office** — GOV-01 |

> ### **Ningún documento del Blueprint se aprueba a sí mismo, y ninguno lo aprueba quien lo redacta.**

## 3.2 Responsable nominado para B-4

| Campo | Valor |
| --- | --- |
| **Redacta** | **Ingeniería** *(borrador actual)* → a trasladar al **Architecture Team** |
| **Aprueba** | **AKVEZ Product Office** |
| **Qué falta** | **Un acto de aprobación.** No falta análisis, no falta contenido, no falta verificación |
| **Severidad** | 🟡 Media — **no bloquea desarrollo**: el código actual es correcto bajo las reglas vigentes |

## 3.3 Cómo levantar B-4 — cinco pasos

| # | Acto |
| :-: | --- |
| **1** | Aplicar los dos cambios recomendados: retirar §8 *(cuestión abierta, ya resuelta en COM-36/2 §2.1.1)* y el riesgo 3 de §10 |
| **2** | Asignar el número **ADR-19** y catalogarlo en `INDEX.md` |
| **3** | Trasladar el fichero a `docs/blueprint/ADR/` |
| **4** | `Estado: Draft → Approved`, con `Aprobado por` y fecha |
| **5** | **Solo después:** R-a a R-d en DEV-00 · migración de §5 |

> ⚠️ **El paso 5 antes del 4 produce reglas nulas.** **ADS-00 R-7:** *«Una regla DEV que no derive de un documento superior es **nula**, y su presencia constituye **un defecto**.»*
>
> ⚠️ **El paso 2 toca `INDEX.md`, que este sprint prohíbe expresamente.** No se ha hecho.

---

# 4. Pregunta 3 — ¿Qué documentos respaldan la decisión?

## 4.1 Decisión por decisión

| # | Decisión | Documento que la respalda | ¿Materia nueva? |
| :-: | --- | --- | :-: |
| **D-1** | Factory con un único parámetro nominal | **NINGUNO** | ⚠️ **SÍ — la única** |
| **D-2** | Ninguna dependencia opcional ni por defecto | **R-55** · ADR-09 §5.3 | ❌ No |
| **D-3** | La factory no ejecuta trabajo ni valida | ADR-09 §5.2, §6 · DEV-00 §6.1 | ❌ No |
| **D-4** | Composition Root, único constructor | **R-54 · R-55 · R-57** · ADR-09 §5.1 | ❌ No |
| **D-5** | Agent API, frontera pública del módulo | **R-07 · R-23** · ADR-04 §7.7 | ❌ No |
| **D-6** | Un Orchestrator nunca alcanza `application/` | **R-07** · ADR-04 §7.7, §7.8 | ❌ No |

> ### **Cinco de seis son reglas vigentes enunciadas para una capa que ninguna nombraba explícitamente. Solo D-1 requiere un acto de autoridad.**
>
> **D-6 merece mención:** es la regla que el proyecto **ya infringió durante tres sprints** *(COM-30, COM-31)*. Enunciarla **no es materia nueva** — es hacer explícito lo que R-07 ya decía y nadie citó.

## 4.2 Qué respalda a D-1: evidencia, no documento

**No es preferencia de estilo. Previene un defecto que `strict` no detecta:**

| Evidencia | Fuente |
| --- | --- |
| **Cuatro de seis dependencias son `(input) => Promise<Result>`.** Intercambiar dos **compilaba sin error** | COM-33 §3.1 |
| En pruebas los dobles son `as any` / `as never`: **el compilador no distinguía ninguna de las seis** | COM-33 §3.1 |
| **Las mismas cinco llamadas se tocaron en los Sprints 19 y 31** | handoff §4.7 |
| Migración verificada con **2 pruebas antirregresión que caen al cruzar dependencias** | COM-33 §3.4 |

> ⚠️ **«Evidencia medida» no es «autoridad documental».** Es exactamente lo que un ADR convierte en norma — y por eso hace falta el ADR.

---

# 5. Pregunta 4 — ¿Solo nuevas factories o migrar existentes?

## 5.1 Estado actual

| Agent API | Firma | ¿Infringe? |
| --- | --- | :-: |
| `createLeadHunterAgent(discoverProspects, listLeadLibrary)` | Posicional, **2** | ❌ **No** |
| `createLeadAnalyzerAgent(analyzeProspects, listLeadScores)` | Posicional, **2** | ❌ **No** |
| `createPitchGeneratorAgent({ …6 })` | **Nominal** | ❌ No |

## 5.2 Regla propuesta de aplicación

> ## **Antes de la ratificación: nada. Después: obligatorio para toda factory nueva; recomendado —no urgente— para las dos existentes.**

| Momento | Nuevas factories | `createLeadHunterAgent` · `createLeadAnalyzerAgent` |
| --- | --- | --- |
| **Hoy** *(ADR-19 en `Draft`)* | Sin obligación. `ADS-00 R-4`: un `Draft` **nunca prevalece** | **NO TOCAR** — restricción expresa del sprint |
| **Tras `Approved`** | ✅ **Obligatorio** | 🟡 **Recomendado**, en un sprint que lo incluya en su alcance |

**Dos razones para no migrarlas con urgencia, ambas documentales:**

1. **Con dos parámetros el coste que motivó D-1 no existe.** La migración sería **uniformidad**, no corrección de defecto.
2. **Migrar antes de la ratificación sería aplicar una norma que aún no obliga** — **RC-2** de AR-05: *«un documento se cita como norma vinculante sin haber descendido a un documento de orden superior»*.

## 5.3 ⚠️ Riesgo de la asimetría, registrado

> **Si ADR-19 se aprueba y la migración no se ejecuta, las tres Agent API quedan divergentes CON una norma que lo prohíbe.** Hoy la divergencia **no infringe nada**; después sí. **Aprobar sin planificar la migración empeora el estado.**

---

# 6. Veredicto formal

| Campo | Valor |
| --- | --- |
| **Estado de ADR-XX** | 🟡 **`Draft` — sin cambios** |
| Contenido verificado | ✅ Apto |
| Cuestión abierta §8 | ✅ Resuelta *(COM-36/2 §2.1.1)* |
| Cambios recomendados antes de aprobar | 2, de simplificación — **no aplicados** |
| **Bloqueo** | **B-4** · 🟡 Media · **abierto** |
| **Responsable de levantarlo** | **AKVEZ Product Office** *(aprueba)* · **Architecture Team** *(redacta)* |
| **Aprobado por** | ⬜ **Pendiente** |

> **Cumple el criterio de aceptación del sprint: ADR-19 queda «pendiente con responsable».**

---

# 7. Referencias

**ADR-04 v1.3** §7.7, §7.8, §10, §17 · **ADR-08 v1.2** *(Historial)* · **ADR-09 v1.3** §5.1, §5.2, §5.3, §6 · **ADR-13 v1.2** *(Aprobado por)* · **ADR-16 v1.1** · **ADR-17 v1.1** §8.2 · **ADS-00 v1.3** *Estados del Documento*, R-4, R-7 · **ADS-02 v1.1** *(Aprobado por)* · **DEV-00** §5.1, §6.1, R-07, R-23, R-54, R-55, R-57 · **AR-05** RC-2 · **COM-30** · **COM-31** · **COM-33** §3 · **COM-35/2** · **COM-36/2**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
