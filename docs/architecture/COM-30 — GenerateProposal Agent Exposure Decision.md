# COM-30 — Decisión de exposición de `GenerateProposal` en la Agent API

| Campo | Valor |
| --- | --- |
| Código | COM-30 |
| Clasificación | **Decisión de frontera** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **Corrige tres documentos anteriores. Declara una violación de regla en vigor** |
| Fecha | 2026-08-04 |
| Motivo | Sprint 30 |
| Relacionado | **DEV-00 R-07** · **ADR-04 §7.7** · COM-24 §3.4 · COM-27 §7.3 · COM-28 §4.4 · COM-29 §5 |

> **Cero cambios de código.** `lint` limpio, `tsc --noEmit` limpio, **188 pruebas**, sin variación.
>
> ⚠️ **Este documento corrige a COM-24, COM-27, COM-28 y COM-29**, que trataron como *asimetría aceptable* algo que **una regla vigente prohíbe**.

---

# 1. La regla que faltaba en el análisis anterior

**Los cuatro documentos que examinaron esta frontera razonaron sobre la cabecera de `pitchGeneratorAgent.ts`. La regla estaba en DEV-00, con fuente en ADR-04:**

> ### **R-07 — «`presentation/` (Agent API) es la única superficie del módulo que el Orchestrator conoce»**
> *Fuente: ADR-04 §7.7 · §10*

> ### **ADR-04 §7.7 — «Los agentes solo exponen sus capacidades mediante su capa `presentation`. Ningún componente externo accede a `domain`, `application` o `infrastructure` de un módulo directamente.»**

**Y hay un precedente de corrección que describe exactamente este caso.** **DEV-00 v1.3** enmendó su propio diagrama de flujo porque omitía la Agent API entre el Orchestrator y `application/`:

> *«Un desarrollador que siguiese §4.4 escribiría un Orchestrator invocando `application/` directamente, **prohibido por R-07**.»*

**Es literalmente lo que hoy hace `commercialProposalOrchestrator`.**

---

# 2. Respuestas

## 2.1 ¿La excepción actual viola algún ADR?

> ## **Sí. Viola R-07 y ADR-04 §7.7.**

`commercialProposalOrchestrator` recibe `generateProposal: GenerateProposalFn` **y lo invoca**. Eso es **un Orchestrator invocando `application/` directamente** — el supuesto que DEV-00 v1.3 corrigió su propio diagrama para impedir.

### Una distinción que el análisis debe conservar

| Qué hace un Orchestrator | ¿Viola R-07? |
| --- | :-: |
| **Importar *tipos* de `application/`** para declarar su firma —`CreateSequenceInput`, `GenerateProposalResult`— | ⛔ **No.** Cuatro de los siete lo hacen. R-07 habla de **la superficie que conoce y usa**, no de nombrar un tipo |
| **Recibir e invocar una *función* de `application/`** | ✅ **Sí.** Es acceso directo a la capa, y **solo el nuevo lo hace** |

**Los seis Orchestrators anteriores obtienen sus datos exclusivamente por Agent API. Ninguno invoca `application/`.**

## 2.2 ¿B-1 es justificación suficiente para mantenerla?

> ## **No. Y el motivo es que B-1 nunca justificó esto.**

**B-1 justifica no publicar una capacidad a los usuarios. La Agent API no es la superficie de usuario.**

**ADR-04, glosario:** *«**Agent API:** … el conjunto de capacidades que el agente expone **hacia el Orchestrator**»*. **Su audiencia es el Orchestrator, no el producto.**

**La superficie de producto es la ruta HTTP**, y **ADR-04 §7.8** exige que ninguna ruta invoque `presentation` sin pasar por un Orchestrator.

> ### ⚠️ **Corrección de COM-24 §3.4**
>
> Aquel documento razonó que exponer `generateProposal` *«presentaría un bloqueo de gobernanza como si fuera una función del producto»*. **Ese argumento es correcto para la ruta y equivocado para la Agent API**: confundí ambas superficies bajo la palabra «publicar». **COM-27 §7.3, COM-28 §4.4 y COM-29 §5 heredaron el error** y trataron como asimetría aceptable lo que R-07 prohíbe.
>
> **Lo que B-1 sostiene sigue en pie: no debe haber ruta.** Lo que no sostiene es saltarse la fachada.

## 2.3 ¿Cuándo exactamente debe cambiar?

> ## **Ahora. No cuando B-1 se cierre.**

**La violación es independiente de B-1**: existe porque el Orchestrator invoca `application/`, no porque el caso de uso falle. **Cerrar B-1 no la corrige, y mantenerla hasta entonces prolonga una infracción sin plazo** — que es el riesgo que la propia Opción A enuncia: *«puede permanecer indefinidamente»*.

**Condición de cambio, sin ambigüedad:**

| Cambia | No cambia |
| --- | --- |
| **`generateProposal` pasa a la Agent API** | **No se crea ninguna ruta.** La superficie de producto sigue cerrada mientras B-1 siga abierto |

## 2.4 ¿Qué archivos cambiarían? — §5

## 2.5 ¿Necesita actualización del Blueprint?

> ## **No.**

**R-07 y ADR-04 §7.7 ya gobiernan el caso, y ADR-04 §7.8 ya distingue la ruta de la Agent API.** No falta ninguna regla: **faltaba leerla**.

**Lo que sí debe actualizarse es la serie COM** *(§7)*: cuatro documentos registran como aceptable algo que no lo es.

---

# 3. Precedentes — cómo trata el proyecto una capacidad no publicada

**Buscado en la Agent API, en los Orchestrators y en el Composition Root.**

| Caso | Cómo se resolvió | Fuente |
| --- | --- | --- |
| **`createSequence`** | ✅ **Expuesto en la Agent API *antes* de tener ruta.** Su propia documentación lo dice: *«Se expone aquí porque sin superficie pública el registro del caso de uso en el Composition Root quedaría inerte. **La ruta HTTP pertenece a la Fase 3**»* | `pitchGeneratorAgent.ts` |
| **`observeFacts`** | ✅ Expuesto en la Agent API; su único consumidor es un Orchestrator. **Nunca tuvo ruta** | Ídem |
| **`runCommercialFacts`** | ✅ Construido en el Composition Root **sin consumidor durante cinco sprints**, con `void` y el motivo escrito | `compositionRoot.ts` |
| **`readReducedDiagnosis` · `readReducedSequence`** | ✅ **Expuestas en la Agent API sin ruta** — COM-24 | Ídem |
| **`generateProposal`** | ⚠️ **El único caso que se saltó la fachada** | — |

> ### **El patrón del proyecto es inequívoco: una capacidad no publicada se expone en la Agent API y no recibe ruta.**
>
> **La frontera de publicación es la ruta HTTP, no la Agent API** — y cinco casos anteriores lo demuestran.

**Diferencia real con `createSequence`:** aquél **funcionaba**; `generateProposal` **lanza** por B-1. **Pero el modo de fallo no cambia con el camino**: hoy el Orchestrator ya lo invoca y ya falla igual. **Lo único que cambia es por dónde entra.**

---

# 4. Las tres opciones

## 4.1 Opción A — Mantenerlo fuera hasta `SP-01`

| | |
| --- | --- |
| **Ventaja alegada** | No modifica contratos públicos |
| **Realidad** | ⛔ **Es una infracción de R-07 en vigor**, no una excepción temporal |
| **Riesgo que el propio enunciado señala** | *«Puede permanecer indefinidamente»* — y **atarla a B-1, que no depende de ingeniería, es exactamente cómo eso ocurre** |

**Veredicto: ⛔ descartada.**

## 4.2 Opción B — Añadirlo a la Agent API, sin ruta

| | |
| --- | --- |
| **Ventaja** | ✅ **Restaura R-07** y elimina la única excepción arquitectónica del sistema |
| **Riesgo alegado** | *«La API pública expone una capacidad que falla por gobernanza»* |
| **Evaluación del riesgo** | 🟢 **Bajo.** La Agent API **expone hacia el Orchestrator**, no hacia el producto *(ADR-04, glosario)*. **Su único consumidor sería el mismo que hoy**, y fallaría igual |
| **Riesgo alegado 2** | *«Puede confundirse con feature disponible»* |
| **Evaluación** | 🟢 **Sin ruta no hay feature.** Y el precedente de `createSequence` **documenta la operación como no publicada en su propia declaración** — el mismo remedio sirve aquí |
| **Precedente** | ✅ **Cinco casos** *(§3)* |

**Veredicto: ✅ recomendada.**

## 4.3 Opción C — Una Agent API interna para capacidades incompletas

> **Pregunta del enunciado: ¿existe precedente? — **No. Ninguno.**

**Y no debe crearse:**

- **ADR-04 §7.7 y §10 declaran una sola superficie por módulo.** Una segunda **rompería la propiedad que R-07 enuncia**: dejaría de haber *una* superficie que el Orchestrator conoce.
- **Sería un wrapper sin responsabilidad**: no decide, no traduce, no protege nada que la ausencia de ruta no proteja ya.
- **El propio enunciado lo prohíbe**: *«no crear wrappers»*, *«no crear flags»*.
- **`createSequence` demuestra que no hace falta**: una capacidad incompleta convive en la Agent API **sin ninguna infraestructura adicional**.

**Veredicto: ⛔ descartada.**

---

# 5. Archivos que cambiarían con la Opción B

| # | Archivo | Cambio |
| :-: | --- | --- |
| **1** | `presentation/pitchGeneratorAgent.ts` | Una operación `generateProposal` y **un sexto parámetro** en la factoría. **Documentada como no publicada**, con el precedente de `createSequence` |
| **2** | `bootstrap/compositionRoot.ts` | `generateProposal` pasa a la Agent API; el Orchestrator deja de recibirlo |
| **3** | `orchestrators/commercialProposalOrchestrator.ts` | **De tres dependencias a dos**: la fachada y el workflow de hechos. **Simplifica** |
| **4** | `orchestrators/commercialProposalOrchestrator.test.ts` | El arnés pasa a invocar por la fachada |
| **5** | **5 llamadas a `createPitchGeneratorAgent` en pruebas existentes** | Un sexto argumento, con el idioma ya usado: **un doble que lanza si se invoca** |
| **6** | `bootstrap/compositionRoot.test.ts` | La prueba de composición del compositor |

**Ninguna ruta. Ningún DTO público. Ningún mapper. Ningún endpoint.**

**Documentos a anotar:** COM-24 §3.4 · COM-27 §7.3 · COM-28 §4.4 · COM-29 §5 *(§7)*.

---

# 6. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **La infracción de R-07 lleva tres sprints en el árbol**, registrada como aceptable en cuatro documentos | 🔴 |
| **2** | **La Agent API llegaría a siete operaciones**, dos de ellas sin consumidor final y una que siempre falla. **Sin ruta, ninguna es alcanzable desde fuera** | 🟡 |
| **3** | **Sexto parámetro posicional** en `createPitchGeneratorAgent`. COM-24 §4 ya avisó: *«el sexto empezará a doler»*. **El compilador sigue protegiendo la transposición**, porque ningún par de tipos es mutuamente asignable | 🟡 |
| **4** | **Volver a tocar cinco pruebas existentes** por un parámetro obligatorio. Mecánico, pero es la segunda vez | 🟢 |
| **5** | **Exponer una operación que lanza** puede leerse como capacidad disponible **si algún día se le añade ruta sin revisar B-1**. Mitigación: **declararlo en la propia operación**, como hizo `createSequence` | 🟡 |

---

# 7. Corrección de documentos anteriores

| Documento | Qué afirmó | Corrección |
| --- | --- | --- |
| **COM-24 §3.4** | Que exponerlo *«presentaría un bloqueo de gobernanza como si fuera una función del producto»* | **Cierto para la ruta; falso para la Agent API**, cuya audiencia es el Orchestrator *(ADR-04, glosario)* |
| **COM-27 §7.3** | Que la inyección directa era *«una asimetría aceptada»* | **Es una infracción de R-07**, no una asimetría |
| **COM-28 §4.4** | Ídem, con el riesgo marcado 🟡 | **Debe ser 🔴** |
| **COM-29 §5** | Que convenía *«mantenerla hasta que B-1 se cierre»* | **B-1 no la justifica** *(§2.2)*. Debe corregirse ahora |

**Ninguno de los cuatro se modifica en este sprint** —la restricción lo prohíbe—, y **COM-30 prevalece sobre los cuatro en este punto**.

---

# 8. Recomendación final

> ## **Opción B: exponer `generateProposal` en la Agent API, sin ruta, ahora.**

| # | Decisión | Justificación |
| :-: | --- | --- |
| **1** | **Exponerlo en la Agent API** | **R-07 · ADR-04 §7.7** — es la única superficie que el Orchestrator conoce |
| **2** | **No crear ruta** | **B-1 sigue abierto**: sin `SP-01` la emisión no es reproducible *(ADR-15 §7.2)*. **Aquí B-1 sí decide** |
| **3** | **Declararlo no publicado en su propia documentación** | Precedente literal de `createSequence` |
| **4** | **No crear una Agent API interna** | Sin precedente; rompería la superficie única |

**El resultado es una arquitectura sin excepciones: siete Orchestrators, todos por la fachada; una superficie por módulo; y la publicación al producto sigue cerrada por donde debe estarlo — la ruta.**

---

# 9. Bloqueos restantes

**Sin cambios y sin tocar:** **B-1** · **B-2** · **CH-01/02/03** · **`COM-12 RC-4`** · **COM-16 §8.1 y §8.2** · **F-1** y la retirada del par heredado sobre A-6.

**B-1 conserva un efecto y pierde otro:** sigue impidiendo la ruta; **deja de justificar la infracción de R-07**.

---

# 10. Referencias

**ADR-04** §7.7, §7.8, §10, glosario · **ADR-09** §5.1, §9 · **ADR-15** §7.2, §9.5 · **ADR-07** §8 · **DEV-00** §3 R-07, §4.4 *(corrección v1.3)*, R-11, R-23 · **COM-24** §3.4, §4 · **COM-27** §7.3 · **COM-28** §4.4 · **COM-29** §5.
