# COM-38 — Bloqueo de Aprobación de ADR-19

| Campo | Valor |
| --- | --- |
| Código | COM-38 / 1 |
| Clasificación | **Registro de bloqueo** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **ADR-19 permanece en `Draft`.** Bloqueo **B-4** abierto |
| Fecha | 2026-08-04 |
| Objeto | `docs/architecture/ADR-XX — Agent API Factory Construction Pattern.md` v0.1 |
| Antecedentes | COM-33 §3.3 · COM-34 t2 · COM-35/2 · COM-36/2 · COM-37/1 |

> **ADR-XX no se ha modificado.** Ni su estado, ni su contenido, ni su ubicación.
> **Cero cambios de código.** `createLeadHunterAgent` y `createLeadAnalyzerAgent` intactos.

---

# 1. Pregunta A — ¿Existe autoridad documental suficiente para aprobar ADR-19?

> ## 🔴 **NO.**

**Resultado aplicado: mantener `Draft`.** No se aprueba por inferencia ni por uso existente.

---

# 2. Auditoría — seis documentos, incluidos dos no revisados hasta hoy

**Los sprints anteriores auditaron ADR-04, ADR-09, ADR-17 y DEV-00. Este sprint añade ARCH-01 y ADS-01.**

| # | Documento | Qué fija sobre la factoría de `presentation/` | ¿Obliga? |
| :-: | --- | --- | :-: |
| **1** | **ADR-04** §7.7, §10, glosario | **Qué expone** la Agent API y hacia quién. La Agent API es *«el conjunto de capacidades que el agente expone hacia el Orchestrator»* | ❌ **No** |
| **2** | **ADR-09 §5.2** | Ejemplo `createLeadHunterAgent(discoverProspects)`, encabezado por ***«forma ilustrativa del patrón (no es implementación)»***. Su enunciado decisional **nombra `application/`** | ❌ **No** |
| **3** | **ADR-09 §5.3 · R-55** | **Quién construye**. Nada sobre la firma | ❌ No |
| **4** | **ADR-17 §8.2 F-1** | Objeto `Deps` con nombres — **para `application/`** | ❌ **No alcanza** |
| **5** | **DEV-00 §5.1** | `create` + agente + `Agent` — **solo el nombre** | ❌ No |
| **6** | **ARCH-01** §1.2, §4, §6.1 DR-4 | **§3** | ❌ **No** |
| **7** | **ADS-01 §3.2** | **§4** | ❌ **No** |

## 2.1 Hallazgo nuevo — ARCH-01 confirma el alcance, no lo amplía

**ARCH-01 §4** *(«Casos de uso — `application/`»)*:

> *«Su anatomía —**firma, factory, contrato de resultado y puertos**— la decide **ADR-17 §5 a §8**.»*

> ### **La frase que más se acerca a fijar una firma de factory está en la sección de `application/`, y remite a ADR-17 — que gobierna `application/`.**

**Lo que ARCH-01 sí dice de `presentation/`:**

| Referencia | Texto | Materia |
| --- | --- | --- |
| **§1.2** | *«**Expone.** Agent API en backend… Contenido admitido: **el tipo del caso de uso que expone `application/`**»* | **De qué depende**, no cómo se construye |
| **§6.1 DR-4** | *«**`presentation/` depende solo del tipo del caso de uso** que expone `application/`»* *(R-07 · R-23)* | Ídem |

> **Ninguna menciona la forma del parámetro.**

**Y ARCH-01 no podría suplir el hueco aunque lo mencionara. ADS-01 lo declara expresamente:**

> *«**ARCH-01 no es autoridad: es un mapa físico**… **Ante discrepancia prevalece el ADR.** «ARCH» no pertenece a la Clasificación Oficial de ADS-00, que es cerrada.»*

## 2.2 Hallazgo nuevo — ADS-01 §3.2, y su título es el dato

**ADS-01 v1.4 `Approved` contiene la fila más cercana a una obligación:**

> *«**¿Qué recibe la factory?** → **ADR-17 §8** — un objeto `Deps`, sin dependencias opcionales»*

> ### **Pero la sección que la contiene se titula: «3.2 — **La capa de aplicación** — dónde está cada cosa».**
>
> **La fila está acotada por el título de su propia sección.** Sus filas vecinas lo confirman: *«¿Qué forma tiene un caso de uso?»*, *«¿Qué devuelve?»*, *«¿Dónde se declara un puerto?»*. **Todas son de `application/`.**

**ADS-01 no tiene ninguna sección equivalente para `presentation/`.**

## 2.3 Conclusión de la auditoría

> ### **Siete referencias en seis documentos. Ninguna publica la firma de la factoría de la Agent API.**
>
> **El hueco queda confirmado por sexta auditoría independiente**, ahora incluyendo el mapa físico *(ARCH-01)* y el mapa temático *(ADS-01)*, que son precisamente los documentos que existirían para localizar una regla si existiera.

---

# 3. Motivo del bloqueo

## 3.1 D-1 es materia nueva — y eso no es un defecto del ADR

| # | Decisión | Documento que la respalda | ¿Nueva? |
| :-: | --- | --- | :-: |
| **D-1** | Factory con un único parámetro nominal | **NINGUNO** | ⚠️ **SÍ** |
| **D-2** | Ninguna dependencia opcional ni por defecto | **R-55** · ADR-09 §5.3 | ❌ No |
| **D-3** | La factory no ejecuta trabajo ni valida | ADR-09 §5.2, §6 · DEV-00 §6.1 | ❌ No |
| **D-4** | Composition Root, único constructor | **R-54 · R-55 · R-57** · ADR-09 §5.1 | ❌ No |
| **D-5** | Agent API, frontera pública del módulo | **R-07 · R-23** · ADR-04 §7.7 · ARCH-01 DR-4 | ❌ No |
| **D-6** | Un Orchestrator nunca alcanza `application/` | **R-07** · ADR-04 §7.7, §7.8 | ❌ No |

## 3.2 Por qué el bloqueo no puede levantarse con más investigación

> ### **Ningún documento existente puede respaldar D-1, porque D-1 es exactamente lo que ningún documento dice.**
>
> **Un ADR que *crea* autoridad no puede *derivarla* de los documentos que consulta.** Ni ADR-08, ni ADR-13, ni ADR-17 cumplieron esa condición cuando se escribieron: **todos crearon norma que antes no existía.**
>
> **La condición se satisface con un acto de aprobación, no con una cita.** Seguir auditando no cambiará el resultado.

## 3.3 Lo que sí respalda a D-1: evidencia medida, no autoridad

| Evidencia | Fuente |
| --- | --- |
| **Cuatro de seis dependencias son `(input) => Promise<Result>`.** Intercambiar dos **compilaba sin error** | COM-33 §3.1 |
| En pruebas los dobles son `as any` / `as never`: **el compilador no distinguía ninguna de las seis** | COM-33 §3.1 |
| **Las mismas cinco llamadas se tocaron en los Sprints 19 y 31** | handoff §4.7 |
| Migración verificada con **2 pruebas antirregresión que caen al cruzar dependencias** | COM-33 §3.4 |

> ⚠️ **«Evidencia medida» no es «autoridad documental».** Convertir la primera en la segunda es exactamente la función de un ADR — **y es el acto que falta**.

---

# 4. Autoridad faltante y responsable de aprobación

## 4.1 El patrón del Blueprint, sin excepciones

| Documento | `Responsable` *(redacta)* | `Aprobado por` |
| --- | --- | --- |
| **ADR-08** v1.2 | Architecture Team | **Product Owner** — cierre Sprint 13 T4 |
| **ADR-13** v1.2 | Architecture Team | **AKVEZ Product Office** — GOV-01 |
| **ADR-16** v1.1 · **ADR-17** v1.1 | Architecture Team | **Product Office y Architecture Team** — *Architecture Freeze* |
| **ADS-02** v1.1 | Architecture Team | **AKVEZ Product Office** — GOV-01 |
| **ARCH-01** v1.3 | Architecture Team | **Product Office · Architecture Team** — *Architecture Freeze* |

> ### **Ningún documento del Blueprint se aprueba a sí mismo, y ninguno lo aprueba quien lo redacta.**

## 4.2 Ficha del bloqueo

| Campo | Valor |
| --- | --- |
| **ID** | **B-4** |
| **Autoridad faltante** | **Un acto de aprobación de ADR-19.** No falta análisis, contenido ni verificación |
| **Responsable de aprobación** | **AKVEZ Product Office** |
| **Responsable de redacción final** | **AKVEZ Architecture Team** |
| **Severidad** | 🟡 **Media** — **no bloquea desarrollo**: el código actual es correcto bajo las reglas vigentes |
| **Antigüedad** | Abierto desde **COM-34** *(2026-08-04)* |

---

# 5. Pasos necesarios para levantarlo

| # | Paso | Quién | Nota |
| :-: | --- | --- | --- |
| **1** | **Pronunciamiento explícito de aprobación** sobre el contenido de ADR-XX | **Product Office** | Es el único paso que no puede sustituirse por análisis |
| **2** | Aplicar los dos cambios de simplificación: retirar §8 *(cuestión abierta, resuelta en COM-36/2 §2.1.1)* y el riesgo 3 de §10 | Architecture Team | No altera D-1 a D-6 |
| **3** | Asignar el número **ADR-19** y catalogarlo en `INDEX.md` | Architecture Team | ⚠️ **Este sprint no toca `INDEX.md`** |
| **4** | Trasladar el fichero a `docs/blueprint/ADR/` | Architecture Team | — |
| **5** | `Estado: Draft → Approved`, con `Aprobado por` y fecha | Architecture Team | — |
| **6** | **Solo después:** R-a a R-d en DEV-00 | Architecture Team | ⛔ Antes produce **reglas nulas** *(ADS-00 R-7)* |
| **7** | **Solo después:** migrar `createLeadHunterAgent` y `createLeadAnalyzerAgent` | Ingeniería | ⛔ En un sprint que lo incluya en su alcance |

> ⚠️ **Riesgo del paso 7 si se omite:** aprobar sin planificar la migración deja las tres Agent API divergentes **con una norma que lo prohíbe**. **Hoy la divergencia no infringe nada; después sí.**

---

# 6. Estado formal

| Campo | Valor |
| --- | :-: |
| **Estado de ADR-XX** | 🟡 **`Draft` — sin cambios** |
| Contenido verificado | ✅ Apto |
| Cuestión abierta §8 | ✅ Resuelta *(COM-36/2)* |
| Documentos auditados sin hallar autoridad | **6** |
| **Aprobado por** | ⬜ **Pendiente — AKVEZ Product Office** |

> ✅ **Criterio de aceptación del sprint cumplido: ADR-19 tiene estado claro — `Draft` bloqueado, con responsable.**

---

# 7. Referencias

**ADR-04 v1.3** §7.7, §7.8, §10, §17 · **ADR-08 v1.2** *(Historial)* · **ADR-09 v1.3** §5.1, §5.2, §5.3, §6 · **ADR-13 v1.2** · **ADR-16 v1.1** · **ADR-17 v1.1** §8.2 · **ADS-00 v1.3** *Estados del Documento*, R-4, R-7 · **ADS-01 v1.4** §3.2 · **ADS-02 v1.1** · **ARCH-01 v1.3** §1.2, §4, §6.1 *(DR-4)*, §8.1 · **DEV-00** §5.1, §6.1, R-07, R-23, R-54, R-55, R-57 · **AR-05** RC-2 · **COM-33** §3 · **COM-35/2** · **COM-36/2** · **COM-37/1**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
