# ADR-15 — Arquitectura del Sistema de Inteligencia Comercial

| Campo | Valor |
| --- | --- |
| Código | ADR-15 |
| Clasificación | Architecture Decision Record — Arquitectura de módulo |
| Versión | 1.2 |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** y **Architecture Team** — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Autoridad de dominio | **PO-01 v1.2** · **PO-02 v1.3** · **APS-18 v1.2** · **APS-19 v1.1** · **APS-20 v1.1** — *todos `Approved`* |
| Resuelve | La ubicación arquitectónica de las seis preocupaciones del sistema comercial. **Evalúa** la cuestión **Q-1** de APS-19 §12 |

> **Naturaleza del documento.** Define **dónde vive cada preocupación** del sistema comercial y qué frontera separa a unas de otras. Establece la línea que ninguna decisión comercial puede cruzar.
>
> **No rediseña el marco comercial.** No modifica los principios de APS-18 §4, ni las variables de APS-19 §6, ni las restricciones de canal de APS-20 §5-§6. **No decide prompts, ni proveedor generativo, ni endpoints, ni interfaz, ni automatización alguna.**
>
> **No modifica ADR-13.** La extensión de §11 es una **propuesta evaluada**, no una enmienda.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-07-30 | AKVEZ Product Office · Architecture Team | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se incorpora **§21** con la constancia de la ratificación, la verificación de la Línea de Decisión, del reparto de las seis preocupaciones y de los riesgos **RA-R1** y **RA-R6**. **Se cierra el punto 6 de §20**: el **ADR de gobernanza del Perfil de Estrategia queda `Pospuesto` con disparador expreso y verificable** — se exige **antes de emitir la primera estrategia**, es decir antes de implementar `GenerateProposal`. **§20 queda sin ningún punto pendiente.** Se actualizan las versiones citadas en §17 y §19 y se precisa en §4 que **COM-01 es un sprint, no un documento**. **No se modifica ninguna decisión:** ni la Línea de Decisión de §8, ni el reparto de §7, ni la ubicación del punto de control de §10, ni ninguna de las trece restricciones de §13. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 5. Los cuatro documentos de los que deriva —PO-02, APS-18, APS-19 y APS-20— quedaron `Approved` en los pasos 1 a 4, de modo que **este ADR ya no deriva de ningún `Draft`**. |
| **1.1** | 2026-07-30 | AKVEZ Architecture Team | **Cierre de Q-1 y Q-5.** Ambas pasan a **`Closed`** en §15. **§11** se marca como **ejecutada** por ADR-13 v1.2, con constancia de la única diferencia sustantiva: se creó **E-9** como evento propio en lugar de ampliar E-6. **§16** cierra el riesgo **RA-R4** y **§20** los puntos 4 y 5 de la Definition of Done. Se retiran todas las afirmaciones de que **la persistencia bloquea la Secuencia**. **No se modifica ninguna decisión:** ni la Línea de Decisión de §8, ni el reparto de §7, ni la ubicación del punto de control de §10, ni ninguna de las trece restricciones de §13. | Sprint *Cierre de Arquitectura Base*, punto 3. **ADR-13 v1.2** resolvió Q-1 y **PO-02 §8 con APS-03 v3.1** resolvió Q-5. El documento llevaba dos sprints afirmando bloqueos inexistentes, lo que inducía a diferir trabajo ya desbloqueado. |
| 1.0 | 2026-07-30 | AKVEZ Architecture Team | Creación inicial. Separa las **seis preocupaciones** del sistema comercial y fija su ubicación por capas; establece la **Línea de Decisión** entre criterio y expresión; sitúa el **punto de control** de APS-18 §10.3 en `domain/`; declara la obligación de Orchestrator frente al Lead Analyzer; y **evalúa** la extensión de ADR-13 solicitada por Q-1 de APS-19. | Sprint **COM-06**. Deriva APS-18, APS-19 y APS-20 hacia una decisión de arquitectura. **Dos conflictos quedan elevados sin resolver: §15.** |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Principios Rectores
7. Decisión — Las seis preocupaciones
8. La Línea de Decisión
9. Ubicación por capas
10. El punto de control y la lista cerrada
11. Propuesta de extensión de ADR-13 — evaluación de Q-1
12. Comunicación con otros agentes
13. Restricciones Vinculantes
14. Consecuencias
15. Conflictos detectados y elevados
16. Riesgos
17. Dependencias
18. Glosario
19. Referencias
20. Definition of Done
21. Ratificación

---

# 1. Resumen Ejecutivo

El sistema comercial de AKVEZ tiene **seis preocupaciones distintas** que hoy están fundidas en un único prompt dentro de `infrastructure/`.

Este ADR las separa y les asigna ubicación. Su decisión central es una sola frontera, la **Línea de Decisión**:

> **Todo lo que decide vive en `domain/`. Solo lo que expresa vive en `infrastructure/`.**

Cinco de las seis preocupaciones son deterministas, versionables y explicables, y pertenecen al dominio. **Una sola —la redacción— es generativa**, y recibe las decisiones ya tomadas.

Es el mismo reparto que AKVEZ ya validó con el Opportunity Score: el criterio reside en un artefacto gobernado, y el modelo no lo inventa. **La novedad no es el patrón, sino aplicarlo a la venta.**

---

# 2. Objetivo

Definir la arquitectura de alto nivel del sistema comercial: qué preocupaciones existen, quién es dueño de cada una, en qué capa reside y qué frontera no puede cruzar.

---

# 3. Alcance

**Este ADR define:**

- La separación de las seis preocupaciones y su ubicación.
- La Línea de Decisión entre criterio y expresión.
- Las fronteras de `domain/`, `application/`, `infrastructure/` y `presentation/` en este módulo.
- Dónde reside el punto de control de APS-18 §10.3.
- Cómo obtiene el sistema comercial la evidencia y el Score, que pertenecen a otro agente.
- Una **propuesta evaluada** de extensión de ADR-13.

**Este ADR no define:**

- Prompts, instrucciones, proveedor generativo ni modelo concreto.
- Endpoints, contratos públicos ni interfaz de usuario.
- Automatización, envío ni integración con ninguna plataforma.
- La gobernanza del Perfil de Estrategia *(§7.4)*.
- El esquema de persistencia ni el motor *(ADS-02)*.
- Ninguna estructura de código concreta.

---

# 4. Contexto

**Lo que ya está decidido y este ADR debe respetar:**

| Documento | Qué aporta |
| --- | --- |
| **PO-02 v1.3** | Alcance del Sistema Comercial · Prueba del Disparador · los cuatro estados del Lead · qué debe sobrevivir entre contactos |
| **APS-18 v1.2** | Ocho principios comerciales · Commercial Strategy Engine · Commercial State · Estrategia · Secuencia · papel de la IA · Regla de Evidencia · 25 criterios |
| **APS-19 v1.1** | Siete variables · clases de conocimiento · Modelo de Consciencia · 21 criterios |
| **APS-20 v1.1** | Tres canales · restricciones comunes · correspondencia canal-momento · 20 criterios |
| **ADR-01 · ADR-04** | Cuatro capas por módulo · Orchestrator obligatorio · ubicación de Tools |
| **ADR-08 · ADR-09** | Frontera de persistencia · Composition Root |
| **ADR-11** | Ninguna limitación técnica reside en el dominio |
| **ADR-13** | Estrategia de escritura · catálogo cerrado de activos y eventos |

**El estado actual del código**, registrado en el sprint **COM-01** *(no existe documento con ese código)* y confirmado en **DEV-05 §1**: el agente comercial es una función suelta con un prompt de 35 líneas en `infrastructure/`; su Agent API es un singleton de módulo; no recibe dependencias inyectadas; no persiste nada; y la transición a *Contactado* nunca ocurre.

---

# 5. Problema

**La estrategia comercial no es un objeto en ninguna parte.**

Hoy el criterio comercial —qué perseguir, qué evidencia usar, qué barrera romper— está interpolado en una cadena de texto dentro de un adapter. En esa forma **no puede versionarse, no puede compararse, no puede explicarse y no puede demostrarse que un cambio lo mejore**.

APS-18 §10.1 exige que el modelo **redacte y no decida**. Sin una ubicación arquitectónica que lo haga cierto, esa exigencia es una intención.

**El problema que este ADR resuelve es dónde ponen el pie las decisiones comerciales para dejar de ser texto.**

---

# 6. Principios Rectores

**PR-1 — El criterio pertenece al dominio.** Toda decisión comercial es determinista, inspeccionable y reproducible.

**PR-2 — Lo generativo se aísla.** El proveedor generativo se invoca desde un único punto y no participa en ninguna decisión.

**PR-3 — La evidencia no se amplía nunca.** Ninguna capa añade hechos afirmables a los que produjo el análisis *(APS-18 §11 · APS-19 §8.4 · APS-20 §3.2)*.

**PR-4 — Lo que verifica no puede depender de lo verificado.** El control de APS-18 §10.3 no puede residir junto a la llamada que comprueba.

**PR-5 — Ninguna capa ejecuta.** El sistema diseña y recomienda; el usuario envía *(APS-09 §7, Nivel 2)*.

**PR-6 — La ausencia se propaga como ausencia.** Una variable Desconocida atraviesa todas las capas sin rellenarse *(APS-19 §4.2 · R-38)*.

---

# 7. Decisión — Las seis preocupaciones

## 7.1 Separación y ubicación

| # | Preocupación | Pregunta que responde | Dueño | Ubicación | Naturaleza |
| :-: | --- | --- | --- | --- | --- |
| **1** | **Evidence** | ¿Qué se observó? | **Lead Analyzer** | Módulo existente | Hechos |
| **2** | **Opportunity Score** | ¿Merece la pena? | **Lead Analyzer** | Módulo existente | Cuantitativa |
| **3** | **Buyer Diagnosis** | ¿Cómo se aborda? | Sistema comercial | **`domain/`** | Cualitativa · determinista |
| **4** | **Commercial Intelligence** | ¿Qué contacto toca ahora? | Sistema comercial | **`domain/` + `application/`** | Estado y secuencia |
| **5** | **Commercial Strategy** | ¿Qué persigue este contacto? | Sistema comercial | **`domain/`** | Determinista |
| **6** | **Outreach Generation** | ¿Cómo se dice? | Sistema comercial | **`infrastructure/`** | **Generativa** |

## 7.2 Precisiones sobre cada preocupación

**1 y 2 pertenecen a otro agente.** Evidence y Opportunity Score los produce el **Lead Analyzer** (APS-03 §7.2). El sistema comercial **los consume y nunca los modifica** *(APS-19 §3.2)*. Su obtención impone la regla de §12.

**3 — Buyer Diagnosis.** Cálculo puro sobre evidencia ya producida. Sin I/O, sin proveedor externo: es una **Tool de cálculo puro** en el sentido de ADR-04 §10, y por tanto vive en `domain/`.

**4 — Commercial Intelligence.** Es la preocupación **nueva** y la que justifica este ADR. Gobierna la **Secuencia** y su estado en el tiempo: qué se dijo ya, qué resultado se declaró, qué momento procede ahora.

> **Distinción determinante entre 4 y 5.** **Commercial Intelligence decide *qué contacto viene ahora*; Commercial Strategy decide *qué hace ese contacto*.** La primera opera sobre la secuencia y tiene memoria; la segunda opera sobre un contacto y no la necesita. Confundirlas reintroduciría el estado dentro de la decisión puntual y haría la estrategia irreproducible.

**5 — Commercial Strategy.** Materializa el motor de APS-18 §5. Determinista: dado el mismo diagnóstico, el mismo estado y el mismo Perfil de Estrategia, produce la misma estrategia.

**6 — Outreach Generation.** **Única preocupación generativa.** Recibe decisiones tomadas y la lista cerrada de hechos afirmables. **No decide nada** *(APS-18 §10.1)*.

## 7.3 Reparto determinista / generativo

```
Evidence ─┐
          ├─► Buyer Diagnosis ─► Commercial Intelligence ─► Commercial Strategy ═══► Outreach
Score ────┘        (3)                    (4)                       (5)               (6)

          └──────────── DETERMINISTA · domain/ ────────────────────────┘  │  GENERATIVA
                                                                          │  infrastructure/
                                                            LÍNEA DE DECISIÓN
```

**Cinco de seis preocupaciones son deterministas.** La proporción no es casual: es lo que hace el sistema explicable y mejorable.

## 7.4 El Perfil de Estrategia

Commercial Strategy consume un **Perfil de Estrategia**: artefacto **versionado e inmutable en caliente** que codifica el criterio comercial, análogo al Perfil de Ponderación del Opportunity Score.

**Este ADR declara su existencia y su ubicación —`domain/`— y nada más.** Su gobernanza —quién lo aprueba, cuándo cambia, cómo se transita entre versiones— **es materia de un ADR propio**, por el mismo motivo por el que ADR-14 existe separado de APS-08. **No se decide aquí.**

> ## 📌 El ADR del Perfil de Estrategia queda `Pospuesto` — decisión del Product Office, 2026-07-30
>
> **Es una decisión cerrada, no una cuestión abierta.** Se pospone **con disparador expreso y verificable**:
>
> | | |
> | --- | --- |
> | **Estado** | ✅ **`Pospuesto`** — no `Pendiente`, no ambiguo |
> | **Disparador** | **Antes de emitir la primera estrategia comercial**, es decir **antes de implementar `GenerateProposal`** *(ADR-16 §7)*. **Ninguna versión del Perfil puede publicarse sin él** *(RA-R6)* |
> | **Qué desbloquea entretanto** | **`GenerateDiagnosis` y `CreateSequence`**, los dos primeros casos de uso de ADR-16 §7. **No consumen el Perfil**: lo consume Commercial Strategy, que es la preocupación 5 |
> | **Qué exige antes de redactarse** | El **contenido** del Perfil, que **tampoco está publicado en ningún APS**. Es el precedente literal de **ADR-14**, que gobierna un Perfil —WP-01— cuyo contenido ya existía en **APS-08 §7.1**. **Gobernar un artefacto inexistente sería vacío** |
> | **Por qué posponer no deja nada abierto** | La **estructura** del Perfil ya está decidida aquí: versionado, inmutable en caliente, y **toda estrategia emitida queda vinculada a la versión que la produjo** *(RA-7)*. Lo que falta es **quién lo aprueba y cómo se transita entre versiones** — gobernanza, no arquitectura |
>
> **Consecuencia operativa, y debe conocerse:** la implementación del dominio comercial puede iniciarse y avanzar hasta `CreateSequence`. **`GenerateProposal` no puede completarse** sin este ADR y sin el APS que publique el contenido del Perfil.

**Toda estrategia emitida queda vinculada a la versión del Perfil que la produjo.** Sin esa vinculación, una estrategia conservada no podría reproducirse ni explicarse.

---

# 8. La Línea de Decisión

> **Decisión central de este ADR.**
>
> **Existe una única frontera entre las preocupaciones 5 y 6. Por encima se decide; por debajo se expresa. Ninguna decisión comercial puede cruzarla hacia abajo, y ningún resultado generativo puede cruzarla hacia arriba.**

**Qué implica hacia abajo.** `infrastructure/` recibe decisiones cerradas: objetivo, barrera, emoción admisible, hilo, canal con sus restricciones y **la lista cerrada de hechos afirmables**. No recibe el diagnóstico completo, ni la secuencia, ni el estado — **no los necesita, y recibirlos le permitiría inferir**.

**Qué implica hacia arriba.** Ningún resultado del proveedor generativo modifica un diagnóstico, un estado, una estrategia ni una secuencia. **El texto es una salida terminal.**

**Por qué una sola línea y no varias.** Una arquitectura con varias fronteras porosas termina teniendo ninguna. Una única línea, explícita y verificable, es comprobable en revisión y no admite excepciones locales — que es el modo por el que las fronteras se pierden *(DEV-00 RI-2)*.

---

# 9. Ubicación por capas

El módulo conserva **exactamente** las cuatro capas de ADR-01 y ADR-04. No se introduce ninguna carpeta nueva *(DEV-00 RI-7)*.

## 9.1 `domain/`

**Contiene:** el modelo del Buyer Diagnosis y sus siete variables · el Modelo de Consciencia · las reglas de la Estrategia · las reglas de la Secuencia y sus seis momentos · el Perfil de Estrategia · las restricciones de canal en su forma de dominio · **el punto de control de §10** · la construcción de la lista cerrada de hechos afirmables.

**No puede:** importar nada externo a su módulo · conocer persistencia · conocer HTTP · conocer el proveedor generativo · conocer observabilidad · **alojar ningún parámetro configurable** *(APS-17 G-3 · ADR-11 §8.1)*.

**Es puro y reproducible.** Dadas las mismas entradas, produce siempre la misma salida — condición sin la cual el criterio comercial no podría versionarse.

## 9.2 `application/`

**Contiene:** los casos de uso que coordinan las preocupaciones 3, 4 y 5 · la orquestación interna del ciclo diagnóstico → estado → estrategia → redacción → verificación · la recepción de las Repository Interfaces.

**No puede:** contener criterio comercial · importar adapters, models ni contracts de persistencia *(R-22)* · importar contratos públicos ni mappers *(R-05)* · construir sus propias dependencias *(R-55)*.

> **Regla propia de este módulo.** `application/` **coordina, nunca decide**. Si un caso de uso contiene una condición que altera el sentido comercial de un contacto, esa condición pertenece a `domain/`. Es la vía más probable por la que el criterio se escaparía del dominio.

## 9.3 `infrastructure/`

**Contiene:** el adapter de redacción —única preocupación generativa— y cualquier otro proveedor externo · **los valores operativos de canal**, que son limitaciones técnicas y residen aquí conforme a APS-20 §3.3 y APS-17 §8.

**No puede:** decidir objetivo, barrera, evidencia ni estrategia · ampliar la lista cerrada de hechos afirmables · **alojar el punto de control** *(§10)*.

**Es sustituible.** Cambiar de proveedor generativo no altera ninguna decisión comercial: es la prueba de que la Línea de Decisión está bien trazada.

## 9.4 `presentation/`

**Contiene:** la Agent API — única superficie del módulo que el Orchestrator conoce *(R-07)*.

**No puede:** importar `shared/persistence/` en ninguna de sus formas, **sin excepción** *(R-23)* · exponer estructuras internas del dominio comercial.

## 9.5 Construcción

El módulo se construye **íntegramente desde el Composition Root** *(ADR-09 §5.1)*: factories que reciben dependencias y devuelven el caso de uso ya vinculado *(R-56)*. **Se prohíbe el singleton de módulo** *(R-57)*.

> **Corrige una desviación del código actual.** El agente comercial es hoy un `const` exportado, construido fuera del Composition Root. Es la única razón por la que no admite dependencias nuevas, y por tanto **prerrequisito técnico** de todo lo demás.

---

# 10. El punto de control y la lista cerrada

## 10.1 El punto de control reside en `domain/`

**APS-18 §10.3** exige verificar todo texto contra la estrategia que lo originó, en cinco comprobaciones.

**Decisión: esa verificación reside en `domain/`, no en `infrastructure/`.**

**Fundamento — PR-4.** Si el control viviera junto a la llamada al proveedor, sería parte de aquello que comprueba: compartiría dependencias, evolucionaría con el adapter y podría relajarse al sustituirlo. En `domain/` es **puro, reproducible y sobrevive a cualquier cambio de proveedor**.

Es lo que convierte «el modelo no decide» de intención en **propiedad verificable**.

## 10.2 La lista cerrada se construye en `domain/`

La lista de hechos afirmables se construye **exclusivamente** a partir de conocimiento **Observado** *(APS-19 §4.2)*. Ninguna lectura Inferida entra en ella *(CD-19)*.

**Circuito cerrado, íntegramente gobernado por el dominio:**

```
domain/ construye la lista  →  infrastructure/ redacta con ella  →  domain/ verifica contra ella
```

`infrastructure/` **no puede añadir** un solo hecho. Un texto que afirme algo fuera de la lista **no supera el control y se rehace**; no se entrega con advertencia *(APS-18 §10.3)*.

## 10.3 Consecuencia sobre AF-00

El control comprueba también que ningún texto **aluda a un hallazgo sin enunciarlo** *(CA-23)* ni **condicione información a una respuesta** *(CA-24)*.

**Es el mecanismo que hace exigible el Principio 10 de AF-00 en el código**, y no solo en la especificación.

---

# 11. Propuesta de extensión de ADR-13 — evaluación de Q-1

> ## ✅ Esta sección quedó **ejecutada** — ADR-13 v1.2
>
> **La propuesta de §11 se aplicó**, con **una diferencia sustantiva** respecto de lo que aquí se evaluó: en §11.4 se proponía **ampliar E-6**; el análisis posterior lo descartó y creó **E-9** como evento propio.
>
> **Motivo:** E-6 declara *«¿Versiona? No»*, y una manifestación del comprador **versiona A-11** *(APS-19 §4.3)*. Ampliarlo habría roto su propia semántica. El precedente **E-2/E-2b** sostiene un evento con semántica condicional.
>
> **El catálogo vigente está en ADR-13 v1.2 §13.1.** Lo que sigue se conserva como registro del razonamiento que condujo a la enmienda — **no como propuesta pendiente**.

## 11.1 El problema

**ADR-13 §6.2** enumera diez activos, A-1 a A-10. **ADR-13 §13.1** enumera seis eventos, E-1 a E-6. **Ninguno cubre el diagnóstico comercial ni la secuencia.** Y §13.4 cierra el catálogo: *«Ningún evento no enumerado aquí podrá escribir en la Biblioteca.»*

Sin embargo **APS-18 §7.4 (CS-R3) y §9.5 exigen funcionalmente que ambos sobrevivan entre contactos**: sin memoria no hay secuencia.

## 11.2 Evaluación de la propuesta recibida

El encargo propuso **un activo (A-11) y un evento (E-7)**. **La evaluación concluye que un solo activo es insuficiente**, y el motivo es la semántica de escritura.

**ADR-13 §10.2 distingue tres semánticas: registrar, actualizar y versionar.** Los dos objetos las necesitan distintas:

| Objeto | Semántica requerida | Por qué |
| --- | --- | --- |
| **Diagnóstico Comercial** | **Versionar** | APS-19 CE-4 y CE-7: una manifestación del comprador **sustituye** la lectura anterior, que **no se destruye** |
| **Secuencia Comercial** | **Actualizar** | Su estado evoluciona con cada contacto. Versionarla en cada uno multiplicaría el volumen sin aportar nada: el historial ya lo conserva **A-8** |

**Fundirlos en un solo activo impondría a uno la semántica del otro.** Versionar la secuencia asumiría un coste de volumen que ADR-13 §19 aceptó **solo para tres activos**; no versionar el diagnóstico incumpliría APS-19 CE-4.

## 11.3 Activos propuestos

| # | Activo | Contenido | Momento de escritura |
| --- | --- | --- | --- |
| **A-11** | **Diagnóstico Comercial** | Las siete variables con su clase, sus indicios y su confianza · **el Commercial State** · la versión del Perfil de Estrategia | Al emitirse. **Versionado** |
| **A-12** | **Secuencia Comercial** | Plan de momentos · momento vigente · por cada contacto, su estrategia y el resultado declarado | Al diseñarse y en cada actualización. **Actualizable** |

> **El Commercial State no requiere activo propio.** Es la variable **BD-1** del diagnóstico *(APS-19 §5.1)*, y reside dentro de A-11. Reconocerlo evita un tercer activo y mantiene una sola fuente de verdad.

> **La Propuesta sigue siendo A-6.** No se propone activo nuevo para ella ni se altera E-5.

## 11.4 Eventos propuestos

| # | Evento | Agente | ¿Escribe? | ¿Actualiza? | ¿Versiona? | Activos |
| --- | --- | --- | :-: | :-: | :-: | --- |
| **E-7** | **Diagnóstico comercial emitido** | Sistema comercial | Sí | No | **Sí** | A-11, A-8, A-10 |
| **E-8** | **Secuencia comercial diseñada o actualizada** | Sistema comercial | Sí | **Sí** | No | A-12, A-8, A-10 |
| **E-6′** | **Resultado de contacto declarado** | — *(usuario)* | Sí | **Sí** | No | A-7, A-8, **A-11**, **A-12** |

**Sobre E-6′ — extensión, no evento nuevo.** Declarar el resultado de un contacto es **una decisión del usuario sobre un Lead**, exactamente la naturaleza de **E-6**, que ya cubre descarte, recuperación y notas. Se propone **ampliar los activos afectados de E-6** en lugar de crear un E-9.

**Fundamento.** §13.4 existe para impedir que la superficie de escritura crezca sin control. Extender un evento de naturaleza idéntica es el cambio menor y respeta ese propósito mejor que añadir uno nuevo.

**Por qué el resultado declarado toca A-11.** Una manifestación del comprador puede convertir una variable de Inferida en Observable *(APS-19 §4.3)*, y prevalece sobre toda lectura previa. Sin escritura sobre A-11, esa regla no sería aplicable.

## 11.5 Alcance de la enmienda que se solicitaría

**ADR-13 §6.2** — dos filas nuevas. **§10.3** — el diagnóstico se suma a los activos versionados; **la secuencia no**. **§13.1** — dos filas nuevas y una ampliación de E-6. **§13.3** — precisión sobre E-6′.

**Ninguna decisión existente de ADR-13 resulta modificada.** Es una extensión **aditiva**, y por su naturaleza sería un **Cambio Menor** conforme a APS-13 §9 — valoración que corresponde confirmar al Architecture Team.

---

# 12. Comunicación con otros agentes

**ADR-04 §7.6 es terminante: ningún agente conoce ni invoca a otro.**

Evidence y Opportunity Score pertenecen al **Lead Analyzer**. En consecuencia:

> **El sistema comercial no invoca al Lead Analyzer. Un Orchestrator reúne ambos resultados y los entrega ya unidos.**

Es exactamente el patrón que el producto ya aplica en la consulta de la Biblioteca, donde un Orchestrator une Leads registrados y Scores vigentes sin que ninguno de los dos agentes sepa del otro.

**Consecuencia sobre `domain/`:** el diagnóstico recibe la evidencia **como entrada**, nunca la busca. Es lo que le permite ser puro.

---

# 13. Restricciones Vinculantes

| # | Restricción | Origen |
| --- | --- | --- |
| **RA-1** | **Ninguna decisión comercial reside fuera de `domain/`** | §8 · PR-1 |
| **RA-2** | **`infrastructure/` no decide objetivo, barrera, evidencia ni estrategia** | §8 · APS-18 §10.1 |
| **RA-3** | **El punto de control reside en `domain/`** | §10.1 · PR-4 |
| **RA-4** | **La lista cerrada se construye en `domain/` y no se amplía en ninguna capa** | §10.2 · PR-3 |
| **RA-5** | **Ningún resultado generativo modifica diagnóstico, estado, estrategia ni secuencia** | §8 |
| **RA-6** | **`application/` coordina; no decide** | §9.2 |
| **RA-7** | **Toda estrategia emitida queda vinculada a la versión del Perfil que la produjo** | §7.4 |
| **RA-8** | **El sistema comercial no invoca a ningún otro agente** | §12 · ADR-04 §7.6 |
| **RA-9** | **El módulo se construye íntegramente desde el Composition Root. Prohibido el singleton** | §9.5 · R-54 · R-57 |
| **RA-10** | **Ningún parámetro configurable reside en `domain/`** | §9.1 · APS-17 G-3 |
| **RA-11** | **Ninguna capa envía, integra ni ejecuta contacto alguno** | PR-5 · APS-09 §7 |
| **RA-12** | **Una variable Desconocida atraviesa todas las capas sin rellenarse** | PR-6 · APS-19 CD-04 |
| **RA-13** | **No se crea ninguna carpeta fuera de las cuatro capas de ADR-01** | §9 · DEV-00 RI-7 |

---

# 14. Consecuencias

**Positivas.**

- El criterio comercial pasa a ser **inspeccionable, versionable y reproducible**.
- Sustituir el proveedor generativo deja de afectar a ninguna decisión.
- Los 66 criterios de APS-18, APS-19 y APS-20 pasan a tener **una ubicación donde comprobarse**.
- El punto de control hace exigible el Principio 10 de AF-00 **en el código**.

**Costes asumidos.**

- **Más superficie determinista que escribir.** Cinco de seis preocupaciones son código de dominio; el prompt único era mucho más barato de producir. **Es el coste de que el sistema sea explicable.**
- **El módulo actual debe normalizarse antes** *(§9.5)*.
- **Nada puede persistirse hasta que ADR-13 se enmiende** *(§11)*.

**Neutras.**

- No cambia ningún contrato público ni ninguna pantalla.
- No cambia el comportamiento observable de ningún otro agente.

---

# 15. Conflictos detectados y elevados

**Ninguno se resuelve en este documento.**

## Q-5 — ✅ **`Closed`**

**Resuelta por PO-02 §8**, documento de orden 2 — el único rango capaz de decidir entre dos APS de orden 3. La salida del agente pasó a ser **doble** —Secuencia diseñada y Propuesta por contacto— y **APS-03 v3.1** la incorporó. **Lo que sigue se conserva como registro del conflicto y de su análisis.**

### *(Registro histórico)* APS-03 §7.3 definía una salida única; APS-18 §9 define una secuencia

**APS-03 v3.0 §7.3** declara como salida del agente: *«**Lead Contactado**: Lead con propuesta comercial generada»* — **una** propuesta, un disparo.

**APS-18 §9** define una **Secuencia** de hasta seis momentos con memoria y estado.

**Ambos son APS, orden 3.** ADS-00 resuelve los conflictos por precedencia de orden, y **entre dos documentos del mismo orden no hay regla que decida**. **ADR-15 es orden 4 y, por R-2, no puede reinterpretar a ninguno de los dos.**

**Este ADR se detiene y lo reporta.**

**Alcance real del conflicto.** Las responsabilidades de §7.3 —«interpretar el análisis realizado», «preparar un primer acercamiento comercial»— **sí acogen** el diagnóstico y la estrategia. **Lo que no acogen es la secuencia**: la salida declarada es singular.

**Consecuencia *(en su momento)*.** ADR-15 podía diseñarse en su integridad, pero la Secuencia no podía implementarse mientras APS-03 §7.3 declarase una salida única. Se propuso revisar §7.3 como prerrequisito.

> ✅ **Ejecutado.** **PO-02 §8** decidió la salida doble y **APS-03 v3.1** la incorporó. **Este párrafo describe una situación superada y no debe citarse como bloqueo vigente.**

## Q-1 — ✅ **`Closed`**

**Resuelta por ADR-13 v1.2** *(sprint de Estabilización del Dominio Comercial)*.

La enmienda incorporó **A-11** *(Diagnóstico Comercial, versionado)* y **A-12** *(Secuencia Comercial, actualizable)* a §6.2, elevó §10.3 a cuatro activos versionados, y añadió **E-7**, **E-8** y **E-9** al catálogo de §13.1, corrigiendo además **E-5**, que dejó de actualizar el estadio.

**§13.4 ya no impide nada**: la enmienda fue precisamente el acto de gobernanza que esa regla exigía.

> **La Secuencia es implementable.** La afirmación de la v1.0 —«la Secuencia no puede implementarse»— **quedó sin objeto** y no debe citarse. Lo que hoy condiciona la implementación es la sincronización de **DEV-00 §4.1** con la decisión de **ARCH-01 §6.0**, no la persistencia.

---

# 16. Riesgos

| # | Riesgo | Impacto | Mitigación |
| --- | --- | :-: | --- |
| **RA-R1** | **El criterio se filtra a `application/`** mediante condiciones que parecen coordinación | **Alto** | §9.2 · RA-6. Es la fuga más probable de la Línea de Decisión |
| **RA-R2** | **La lista cerrada se amplía en `infrastructure/`** por conveniencia | **Alto** | §10.2 · RA-4 · el propio punto de control |
| **RA-R3** | **El punto de control se desplaza a `infrastructure/`** por proximidad al adapter | **Alto** | §10.1 · RA-3 · PR-4 |
| **RA-R4** | ~~**Q-5 y Q-1 sin resolver** bloquean la Secuencia~~ | — | ✅ **Cerrado.** Q-5 por PO-02 §8 y APS-03 v3.1; Q-1 por ADR-13 v1.2. **La Secuencia es implementable** |
| **RA-R5** | **El coste determinista invita a volver al prompt único** | Medio-alto | §14. Es una decisión ya tomada, no una preferencia |
| **RA-R6** | **El Perfil de Estrategia nace sin gobernanza** | Medio | **Sigue abierto, y su mitigación es hoy un disparador declarado.** §7.4: el ADR queda **`Pospuesto`** y **se exige antes de emitir la primera estrategia** —antes de `GenerateProposal`—. **Ninguna versión del Perfil puede publicarse antes.** El riesgo real ya no es que nazca sin gobernanza, sino **que se implemente `GenerateProposal` sin advertir el disparador** |
| **RA-R7** | **La deuda del módulo actual** impide inyectar dependencias | Medio | §9.5. Prerrequisito técnico acotado |

---

# 17. Dependencias

- **AF-00** — Artículo IV, Principios 2 y 10.
- **PO-01 v1.2** — §5, §7, §8.
- **PO-02 v1.3** — §2, §3, §4, §5, §5.1, §7. **Resolvió Q-5.**
- **APS-18 v1.2** — §4, §5, §8, §9, §10, §11.
- **APS-19 v1.1** — §3.2, §4, §5, §8.
- **APS-20 v1.1** — §3.2, §3.3, §5, §7.
- **APS-09** — §7 (Nivel 2), §9.
- **APS-03 v3.1** — §7.2, §7.3. **Q-5 `Closed`.**
- **APS-17 v1.1** — §8, §9 (G-3).
- **ADR-01** — §8, §10.
- **ADR-04** — §7.6, §7.7, §8, §10, §11.
- **ADR-08** — §10 · **ADR-09** — §5, §6 · **ADR-11** — §8.1.
- **ADR-13 v1.2** — §6.2, §10.2, §10.3, §13.1, §13.4. **Q-1 `Closed`** — véase §11.
- **ADR-14 v1.2** — precedente estructural del Perfil versionado. **Precedente también del aplazamiento de §7.4**: ADR-14 gobierna un Perfil cuyo contenido ya existía.
- **ADR-16 v1.1** — aplica este ADR al modelo de entidades y casos de uso.
- **ADR-17 v1.1** — anatomía del caso de uso y puertos. **Hace exigible la presuposición de §9.2** de que `application/` no importa adapters concretos.
- **DEV-00 v1.4** — R-04, R-05, R-07, R-22, R-23, R-54 a R-57, RI-2, RI-7.

**Condiciona a:** el ADR de gobernanza del Perfil de Estrategia *(`Pospuesto`, §7.4)* · toda implementación del sistema comercial.

---

# 18. Glosario

**Línea de Decisión:** Frontera única entre lo que decide y lo que expresa. Separa las preocupaciones 5 y 6. *(§8)*

**Commercial Intelligence:** Preocupación que gobierna la Secuencia y su estado en el tiempo. Decide **qué contacto viene ahora**. *(§7.2)*

**Commercial Strategy:** Preocupación que decide **qué hace un contacto**. Sin memoria propia. *(§7.2)*

**Outreach Generation:** Única preocupación generativa. Recibe decisiones tomadas y redacta. *(§7.2)*

**Perfil de Estrategia:** Artefacto versionado e inmutable en caliente que codifica el criterio comercial. Su gobernanza es materia de un ADR propio. *(§7.4)*

**Punto de control:** Verificación de todo texto contra su estrategia. **Reside en `domain/`.** *(§10.1)*

**Lista cerrada de hechos afirmables:** Conjunto de hechos Observados que un contacto puede enunciar. Se construye en `domain/` y **ninguna capa la amplía**. *(§10.2)*

---

# 19. Referencias

- AF-00 — The Constitution of AKVEZ, Artículo IV, Principios 2 y 10.
- PO-01 — Decisión Canónica de Lead, §5, §7, §8.
- ADS-00 v1.3 — Documentation Standard, *Jerarquía Documental* (R-2, R-4).
- PO-01 v1.2 · **PO-02 v1.3** — Alcance del Sistema Comercial.
- APS-03 v3.1 — Agent Architecture, §7.2, §7.3, §8.
- APS-09 — AI Decision Framework, §7, §9.
- APS-13 — Product Governance Framework, §9.
- APS-17 v1.1 — Initial Product Parameters, §8, §9.
- APS-18 v1.2 — Commercial Strategy Framework.
- APS-19 v1.1 — Buyer Diagnosis Model.
- APS-20 v1.1 — Outreach Channels & Constraints.
- ADR-01 · ADR-04 v1.3 · ADR-08 v1.2 · **ADR-09 v1.3** · ADR-11 v2.1 · ADR-13 v1.2 · ADR-14 v1.2 · **ADR-16 v1.1** · **ADR-17 v1.1**.
- DEV-00 v1.4 — Implementation Rules.
- COM-02 — Commercial Intelligence Architecture Draft *(documento de trabajo en `docs/architecture/`, fuera del catálogo del Blueprint; no es autoridad vigente)*.

---

# 20. Definition of Done

Este ADR quedará cerrado cuando el **AKVEZ Product Office** y el **Architecture Team**:

1. **Ratifiquen la Línea de Decisión** de §8 como frontera única del sistema comercial.
2. **Ratifiquen el reparto** de las seis preocupaciones de §7.1.
3. **Ratifiquen la ubicación del punto de control** en `domain/` (§10.1).
4. ~~Se pronuncien sobre la propuesta de extensión de ADR-13~~ — ✅ **Cumplido.** **ADR-13 v1.2** incorporó A-11, A-12, E-7, E-8 y E-9, y corrigió E-5. Se adoptaron **dos activos**, y **E-9 como evento propio** en lugar de ampliar E-6.
5. ~~Se pronuncien sobre Q-5~~ — ✅ **Cumplido.** **PO-02 §8** y **APS-03 v3.1**.
6. ~~**Autoricen o pospongan** el ADR de gobernanza del Perfil de Estrategia (§7.4)~~ — ✅ **Cumplido. `Pospuesto` con disparador expreso**, véase §7.4 y §21.4.

> ## ✅ Los seis puntos están cumplidos. **§20 no tiene ningún punto pendiente.**
>
> **La Secuencia es implementable.** La sincronización de **DEV-00** con **ARCH-01 §6.0**, que la v1.1 declaraba condicionante, **se ejecutó en este mismo sprint** por la vía normativa correcta: **ADR-17** decide y **DEV-00 v1.4** transcribe.
>
> **Lo único que condiciona el inicio del código es la normalización del módulo comercial de §9.5**, que es trabajo de implementación y no una decisión pendiente.

---

# 21. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office y Architecture Team, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 5.

## 21.1 La Línea de Decisión — ratificada como frontera única

> **Todo lo que decide vive en `domain/`. Todo lo que expresa o comunica vive en `infrastructure/`.**

| Comprobación | Resultado |
| --- | :-: |
| **Es una sola frontera**, entre las preocupaciones 5 y 6 *(§8)*. No hay fronteras porosas múltiples | ✅ |
| **Ninguna decisión comercial la cruza hacia abajo**; **ningún resultado generativo la cruza hacia arriba** | ✅ |
| Se aplica sin reinterpretación en **ADR-16 D-1** y se localiza en **ARCH-01 §2.0** | ✅ |
| **Concordancia de redacción verificada.** §8 de este ADR dice *«solo lo que expresa»*; **ADR-16 D-1 precisa que comunicar incluye expresar y persistir**. **No son dos reglas: ADR-16 desarrolla ésta**, como declara su propia portada *(«Subordinado a ADR-15»)*. **Ambas designan la misma frontera** | ✅ |

## 21.2 El reparto de las seis preocupaciones — ratificado

**§7.1 se ratifica íntegro.** Cinco de las seis son deterministas y viven en `domain/`; **solo la redacción es generativa**. La segunda —el Opportunity Score— **pertenece al Lead Analyzer**, lo que hace obligatorio el Orchestrator de §12 *(ADR-04 §7.6)*.

**Verificado contra ADR-16 §7:** los cuatro casos de uso cubren las preocupaciones 3, 4 y 5 y **ninguno decide** *(RA-6 · D-2)*.

## 21.3 RA-R1 — el riesgo que el Architecture Team declara vivo

> **RA-R1 —«el criterio se filtra a `application/`»— se ratifica como riesgo abierto de severidad Alta, y no se cierra.**

**Es la fuga más probable de toda la arquitectura comercial**, declarada por triplicado: **RA-R1** aquí, **R-2** en ADR-16 §9 y **RC-3** en ADR-16 §8. **Ningún compilador la detecta.**

| Mitigación | Dónde |
| --- | --- |
| La regla | **RA-6** · ADR-16 **D-2** y **RC-3** |
| La prueba operativa | **ADR-17 §11.1** — *¿cambiaría la respuesta si la condición se escribiese al revés?* |
| La regla verificable | **ADR-17 AL-18** |
| El criterio de aceptación | **ADR-16 CA-16-02** |

**Se ratifica que estas cuatro mitigaciones son de revisión, no automáticas.** Su verificación automática es el vacío **V-4** de DEV-00, que sigue abierto.

## 21.4 RA-R6 y el ADR del Perfil de Estrategia — decisión expresa

> **El ADR de gobernanza del Perfil de Estrategia queda `Pospuesto`, con disparador expreso: se exige antes de emitir la primera estrategia comercial.**

**No queda ningún estado ambiguo.** La tabla completa está en **§7.4**. En resumen:

- **Qué se decidió aquí y sigue vigente:** el Perfil existe, vive en `domain/`, es **versionado e inmutable en caliente**, y **toda estrategia queda vinculada a la versión que la produjo** *(RA-7)*.
- **Qué queda para el ADR pospuesto:** quién lo aprueba, cuándo cambia y cómo se transita entre versiones.
- **Qué desbloquea:** `GenerateDiagnosis` y `CreateSequence`.
- **Qué no desbloquea:** `GenerateProposal`.

**RA-R6 permanece abierto** *(§16)*.

## 21.5 Compatibilidad verificada

| Documento | Resultado |
| --- | :-: |
| **PO-02 v1.3** — alcance, Prueba del Disparador, LS-1 a LS-5 | ✅ **PR-5 y RA-11** coinciden: ninguna capa envía, integra ni ejecuta |
| **APS-18 v1.2 §10.1** — el modelo redacta y no decide | ✅ Es el fundamento de §8 y de §10 |
| **APS-19 v1.1** — siete variables y clases de conocimiento | ✅ **PR-6 y RA-12**: una variable *Desconocida* atraviesa las capas sin rellenarse |
| **APS-20 v1.1 §3.3** — el valor de canal es infraestructura | ✅ **§9.3** lo sitúa allí. Coincide con **ADR-16 D-3** |
| **ADR-13 v1.2** — catálogo de nueve eventos | ✅ **Q-1 `Closed`** *(§11, §15)* |
| **ADR-04 §7.6** — ningún agente conoce a otro | ✅ **§12 · RA-8** |
| **ADR-17 v1.1 §6.3** — el puerto de proveedor lo declara `domain/` | ✅ Hace **estructural** la mitigación de RA-R2 |

## 21.6 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.2 son: estado, historial, autoridad de portada, la decisión sobre el Perfil de Estrategia en §7.4, la mitigación actualizada de RA-R6, el cierre del punto 6 de §20, las versiones citadas en §17 y §19, la precisión sobre COM-01 en §4 y esta sección.
