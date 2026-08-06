# COM-36 — Decisión sobre el Patrón Agent API Factory

| Campo | Valor |
| --- | --- |
| Código | COM-36 / 2 |
| Clasificación | **Dictamen sobre propuesta de ADR** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **ADR-19 SE MANTIENE EN `Draft`.** Falta autoridad documental para aprobarlo |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-36, tarea 2 |
| Objeto | `docs/architecture/ADR-XX — Agent API Factory Construction Pattern.md` v0.1 |
| Antecedentes | **COM-33 §3.3** · **COM-34** tarea 2 · **COM-35/2** |

> **Cero cambios de código. Ninguna Agent API migrada. El estado de ADR-19 no se ha modificado.**

---

# 1. Decisión

> ## 🔴 **MANTENER `Draft`.**

**Fundamento — la regla del propio sprint:**

> *«Toda resolución debe estar respaldada por documentos existentes. **Si falta autoridad documental, crear una propuesta Draft y detenerse**.»*

**La propuesta Draft ya existe: es ADR-19.** Lo que procede es **detenerse**, registrar el bloqueo y elevarlo.

> ### **Y la razón es estructural, no un tecnicismo: ningún documento existente puede respaldar D-1, porque D-1 es precisamente lo que ningún documento dice.**
>
> **Un ADR que *crea* autoridad no puede *derivarla* de los documentos que consulta.** Exigir respaldo documental previo a la decisión que el ADR existe para tomar es una condición que **ningún ADR nuevo podría cumplir jamás**. La condición se satisface con un **acto de aprobación**, no con una cita.

---

# 2. Investigación — las tres preguntas del sprint

## 2.1 ¿Existe obligación documental? · **NO**

**Cuatro documentos revisados. Ninguno obliga.**

| Documento | Qué dice sobre la factoría de `presentation/` | ¿Obliga? |
| --- | --- | :-: |
| **ADR-04** §7.7, §10, glosario | **Qué expone** la Agent API y hacia quién. **Nada sobre cómo se construye** | ❌ **No** |
| **ADR-09 §5.2** | Muestra `createLeadHunterAgent(discoverProspects: DiscoverProspectsFn)` — **un parámetro posicional** | ⚠️ **Ver §2.1.1** |
| **ADR-09 §5.3 · R-55** | **Quién construye** *(solo el Composition Root)*. Nada sobre la firma | ❌ **No** |
| **ADR-17 §8.2 F-1** | *«La factory recibe un único parámetro: un objeto `<CasoDeUso>Deps` con nombres»* | ❌ **No alcanza.** Gobierna **`application/`** |
| **DEV-00 §5.1** | *«Agent API → `create` + agente + `Agent`»* | ❌ **Solo el nombre** |

### 2.1.1 El ejemplo de ADR-09 §5.2 no obliga, **y lo dice él mismo**

**El bloque va encabezado por:**

> *«**Forma ilustrativa del patrón (no es implementación)**»*

**Y el enunciado decisional de §5.2, en el mismo apartado, es:**

> *«**`modules/*/application/` expone una factory** que recibe sus dependencias y devuelve la función de caso de uso ya vinculada.»*

| Constatación | Consecuencia |
| --- | --- |
| El enunciado decisional **nombra `application/`**, no `presentation/` | §5.2 **no decide** la firma de la Agent API |
| El bloque **se autodeclara «no es implementación»** | El ejemplo ilustra el **mecanismo de closure**, que es lo que §5.2 explica |
| **El código diverge del ejemplo desde hace sprints** — `createLeadHunterAgent` recibe **dos** parámetros; el ejemplo muestra **uno** — y **ninguna auditoría lo señaló nunca** | Nadie lo ha tratado como normativo |

> **Conclusión: ADR-09 §5.2 no impone forma alguna a `presentation/`, y no necesita nota de superación.**

> ### **El hueco es exacto y queda confirmado: ningún documento del Blueprint publica la firma de la factoría de la Agent API.**

## 2.2 ¿Patrón recomendado o preferencia? · **RECOMENDADO, con coste medido — pero hoy sin rango normativo**

**No es preferencia de estilo. El defecto que previene es de una clase que `strict` no detecta:**

| Evidencia | Fuente |
| --- | --- |
| **Cuatro de las seis dependencias son `(input) => Promise<Result>`.** Intercambiar dos **compilaba sin error**; el defecto solo aparecía al ejecutar la operación equivocada | COM-33 §3.1 |
| En pruebas los dobles son `as any` / `as never`: **el compilador no distinguía ninguna de las seis**. Una suite pasaba `fail as any` seis veces | COM-33 §3.1 |
| **Las mismas cinco llamadas hubo que tocarlas en los Sprints 19 y 31** | handoff §4.7 |
| Migrado en COM-33 con **2 pruebas antirregresión verificadas** — caen al cruzar dos dependencias | COM-33 §3.4 |

**Pero:**

> ⚠️ **«Recomendado con justificación medida» no es un rango documental.** Mientras ADR-19 esté en `Draft`, **ADS-00 R-4** aplica: *«Un documento en estado `Draft` nunca prevalecerá sobre uno `Approved`.»* **Hoy el patrón es una práctica de ingeniería respaldada por evidencia, no una norma.**

## 2.3 ¿Debe aplicarse a los agentes existentes? · **NO, todavía no**

**Estado real al 2026-08-04:**

| Agent API | Firma | ¿Infringe? |
| --- | --- | :-: |
| `createLeadHunterAgent(discoverProspects, listLeadLibrary)` | Posicional, **2** | ❌ **No.** Ninguna regla publicada la alcanza |
| `createLeadAnalyzerAgent(analyzeProspects, listLeadScores)` | Posicional, **2** | ❌ **No** |
| `createPitchGeneratorAgent({ …6 })` | **Nominal** | ❌ **No.** Autorizada por documento de sprint |

**Dos razones para no migrar ahora, y las dos son documentales:**

1. **Sin ADR-19 `Approved` no hay norma que aplicar.** Migrar sería ejecutar una regla que aún no obliga — **RC-2** de AR-05: *«un documento se cita como norma vinculante sin haber descendido a un documento de orden superior»*.
2. **Con dos parámetros, el coste que motivó el patrón no existe.** La migración sería **uniformidad**, no corrección de defecto. **Ninguna de las dos está en infracción y no lo estará hasta la ratificación.**

> **El sprint COM-36 prohíbe además modificar `presentation/` y `bootstrap/`**, que es donde vive toda migración posible.

---

# 3. Verificación del contenido de ADR-19

**Aunque no se apruebe, el contenido se ha verificado contra su fundamento.**

| # | Decisión | Fundamento existente | ¿Materia nueva? |
| :-: | --- | --- | :-: |
| **D-1** | Factory con un único parámetro nominal | **Ninguno.** Análogo a ADR-17 §8.2 F-1, que **no alcanza a esta capa** | ⚠️ **SÍ — la única** |
| **D-2** | Ninguna dependencia opcional ni por defecto | **R-55** · ADR-09 §5.3 | ❌ No |
| **D-3** | La factory no ejecuta trabajo ni valida | ADR-09 §5.2, §6 · DEV-00 §6.1 | ❌ No |
| **D-4** | Composition Root, único constructor | **R-54 · R-55 · R-57** · ADR-09 §5.1 | ❌ No |
| **D-5** | Agent API, frontera pública del módulo | **R-07 · R-23** · ADR-04 §7.7 | ❌ No |
| **D-6** | Un Orchestrator nunca alcanza `application/` | **R-07** · ADR-04 §7.7, §7.8 | ❌ No |

> ### **Cinco de las seis son reglas vigentes enunciadas para una capa que ninguna nombraba. Solo D-1 requiere un acto de autoridad.**
>
> **D-6 merece mención aparte:** es la regla que el proyecto **ya infringió durante tres sprints** *(COM-30, COM-31)*. Enunciarla no es materia nueva — es hacer explícito lo que R-07 ya decía.

## 3.1 Cambios recomendados al Draft, antes de una eventual aprobación

| # | Cambio | Motivo |
| :-: | --- | --- |
| **1** | **Retirar §8** *(cuestión abierta sobre ADR-09 §5.2)* y sustituirlo por la constatación de **§2.1.1** de este dictamen | Queda resuelto por el texto literal de ADR-09 |
| **2** | Retirar el **riesgo 3** de §10 | Deja de aplicar |

**Es simplificación, no revisión.** No altera D-1 a D-6. **No se ha aplicado**: el sprint no autoriza modificar el Draft.

---

# 4. Bloqueo registrado

| Campo | Valor |
| --- | --- |
| **Bloqueo** | **B-4** *(propuesto)* — **ADR-19 sin autoridad de aprobación** |
| **Qué impide** | Que el patrón de construcción de Agent API sea norma · que R-a a R-d entren en DEV-00 · que se migren las dos Agent API restantes |
| **Qué falta** | **Un acto de aprobación** por la autoridad competente. **No falta análisis ni contenido** |
| **Quién puede levantarlo** | **AKVEZ Architecture Team** y/o **Product Office** — §5 |
| **Severidad** | 🟡 Media. **No bloquea desarrollo**: el código actual es correcto bajo las reglas vigentes |

---

# 5. Quién puede aprobarlo, según el registro del propio Blueprint

**Ningún ADR del Blueprint se aprueba a sí mismo, y ninguno lo aprueba quien lo redacta.**

| ADR | `Responsable` *(redacta)* | `Aprobado por` |
| --- | --- | --- |
| **ADR-08** | Architecture Team | **Product Owner** — cierre de Sprint 13, Tarea 4 |
| **ADR-13** | Architecture Team | **AKVEZ Product Office** — GOV-01 |
| **ADR-16** · **ADR-17** | Architecture Team | **Product Office y Architecture Team** — *Architecture Freeze* |

> ### **El patrón es constante: redacta Ingeniería o el Architecture Team; aprueba el Product Office.**
>
> **Este dictamen aporta lo que corresponde a un Technical Lead:** verificación del contenido contra su fundamento, respuesta a las tres preguntas, resolución de la cuestión abierta con texto documental y el registro del bloqueo. **El acto de aprobación no le corresponde.**

## 5.1 Cómo levantar el bloqueo

**Si el Product Office desea aprobar ADR-19, basta con un pronunciamiento explícito.** En ese caso, y solo entonces, procede:

| # | Acto |
| :-: | --- |
| 1 | Aplicar los dos cambios de §3.1 |
| 2 | Asignar el número **ADR-19** y catalogarlo en `INDEX.md` |
| 3 | Trasladar el fichero a `docs/blueprint/ADR/` |
| 4 | `Estado: Draft → Approved`, con `Aprobado por` y fecha registrados |
| 5 | **Solo después:** R-a a R-d en DEV-00 · migración de las dos Agent API |

> ⚠️ **El paso 5 antes del 4 produce reglas nulas.** **ADS-00 R-7:** *«Una regla DEV que no derive de un documento superior es **nula**, y su presencia constituye **un defecto**.»*

**Bloque de firma:**

| Campo | Valor |
| --- | --- |
| Dictamen técnico | ✅ **Contenido verificado y apto** — 2026-08-04 |
| Cuestión abierta §8 | ✅ **Resuelta** *(§2.1.1)* |
| Estado del documento | 🔴 **`Draft` — sin cambios** |
| **Aprobado por** | ⬜ **Pendiente** |

---

# 6. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **El Draft se cita como norma sin ratificar.** Es **RC-2** de AR-05 materializado | 🔴 Alta |
| **2** | **Se aprueba y no se ejecuta la migración.** Las tres Agent API quedarían divergentes **con una norma que lo prohíbe** — hoy la divergencia no infringe nada | 🔴 Alta |
| **3** | **R-a a R-d se escriben en DEV-00 antes de la aprobación** y nacen nulas | 🟡 Media |
| **4** | **El Draft permanece indefinidamente** y el próximo agente se escribe sin regla que consultar — que es el estado que produjo COM-33 §3.3 | 🟡 Media |

---

# 7. Referencias

**ADR-04 v1.3** §7.7, §7.8, §10, §17 · **ADR-08 v1.2** §10, *Historial* · **ADR-09 v1.3** §5.1, §5.2, §5.3, §6, §8, §8.1 · **ADR-13 v1.2** *(Aprobado por)* · **ADR-16 v1.1** · **ADR-17 v1.1** §8.2, §9.1 · **ADS-00 v1.3** *Estados del Documento*, R-4, R-7 · **DEV-00** §5.1, §6.1, R-07, R-23, R-54, R-55, R-56, R-57 · **AR-05** RC-2 · **COM-30** · **COM-31** · **COM-33** §3 · **COM-34** tarea 2 · **COM-35/2**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
