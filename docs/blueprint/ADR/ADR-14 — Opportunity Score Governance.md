# ADR-14 — Gobernanza del Opportunity Score

| Campo | Valor |
| --- | --- |
| Código | ADR-14 |
| Clasificación | Architecture Decision Record — Gobernanza |
| Versión | 1.2 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad de dominio | **PO-01** (Approved) · **APS-08 v1.2** |
| Resuelve | Deuda crítica **DC-4** (AR-02 §4.1) — *cerrada; el Perfil **WP-01** está publicado en APS-08 v1.2 §7.1* |

> **Naturaleza del documento.** Define el **gobierno** del sistema de ponderaciones del Opportunity Score: quién lo decide, cuándo puede cambiar, cómo se versiona y cómo se preservan la comparabilidad y la reproducibilidad.
>
> **No rediseña el algoritmo.** No modifica las seis categorías de evaluación de APS-08 §6, ni la escala de 0 a 100 de §7, ni los cinco rangos de banda de §8. **No asigna ningún valor de ponderación.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Creación inicial. Define el Perfil de Ponderación como artefacto versionado e inmutable, sus principios rectores, su gobernanza, su ciclo de vigencia, las reglas de comparabilidad entre versiones y el tratamiento de los Scores históricos. | Deuda crítica **DC-4** de AR-02 §4.1. APS-08 §7 declara que «las ponderaciones podrán modificarse con el tiempo» y §10 que «el aprendizaje deberá producirse de forma controlada y documentada», sin definir qué significa *controlada* ni quién autoriza el cambio. Sin gobierno, cada modificación alteraría en silencio el orden de todos los Leads del producto. |
| **1.2** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra la Definition of Done de §18. **No se modifica ningún contenido técnico:** ni el Perfil como artefacto versionado de §7, ni el reparto de §8.1, ni las reglas de comparabilidad de §10, ni las siete restricciones de §12. | Sprint **GOV-01**. Los puntos 1, 2, 3, 4 y 6 de §18 son actos de ratificación. El punto 5 —determinar cuándo se publica la primera versión del Perfil— **quedó cumplido de hecho**: **WP-01 v1.0** se publicó en APS-08 v1.2 §7.1 durante el sprint PC-01, con constancia expresa de emitirse sin evidencia de uso real (§3.4, R-8). **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 1.1 | 2026-07-29 | AKVEZ Architecture Team | **Aditivo.** Se incorpora el principio **§6.8 — Estabilidad Operacional** y, como mecanismo que lo hace exigible, el elemento obligatorio **C-10 (Estrategia de Transición)** en §7.2. Se añade la condición **G-5** en §8.3 y el punto 6 a la Definition of Done. **Ninguna decisión de la v1.0 resulta modificada.** | Recomendación de la revisión arquitectónica de ADR-14 (2026-07-29), aprobada por el Product Office. La v1.0 regulaba la **aprobación** de un Perfil, pero no su **despliegue**: nada obligaba a documentar cómo se transita de una versión a la siguiente en producción. Refuerza las mitigaciones de los riesgos R-6 y R-7. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Principios Rectores
7. Decisión — El Perfil de Ponderación
8. Gobernanza
9. Versionado y Vigencia
10. Comparabilidad entre Versiones
11. Interpretación de Scores Históricos
12. Restricciones Vinculantes
13. Consecuencias
14. Riesgos
15. Dependencias
16. Glosario
17. Referencias
18. Definition of Done

---

# 1. Resumen Ejecutivo

APS-08 §7 establece que el Opportunity Score resulta de «la combinación ponderada de todas las categorías de evaluación» y que «las ponderaciones podrán modificarse con el tiempo». APS-08 §10 añade que el aprendizaje «deberá producirse de forma controlada y documentada».

Ningún documento define qué significa *controlada*, quién autoriza el cambio ni qué ocurre con las puntuaciones ya emitidas cuando las ponderaciones cambian.

La consecuencia es grave y silenciosa: **una modificación de ponderaciones reordena la Biblioteca entera de todos los usuarios**, sin producir error, sin dejar rastro y sin que nadie lo advierta. El usuario vería mañana en primer lugar un Lead que ayer estaba en el puesto cuarenta, sin explicación posible.

Este ADR lo resuelve mediante tres decisiones:

1. **Las ponderaciones se agrupan en un artefacto propio, versionado e inmutable: el Perfil de Ponderación** (§7).
2. **Todo Opportunity Score queda vinculado de forma permanente a la versión del Perfil que lo produjo** (§7.3). Sin ese vínculo, una puntuación es un número sin significado.
3. **Dos puntuaciones solo son comparables si proceden de la misma versión** (§10). Ordenar mezclando versiones está prohibido; la reordenación bajo una versión nueva se realiza mediante **reevaluación**, que emite una puntuación nueva sin destruir la anterior.

---

# 2. Objetivo

Responder de forma exclusiva y definitiva:

> **¿Quién define las ponderaciones? ¿Cuándo pueden modificarse? ¿Cómo se versionan? ¿Cómo se interpretan los Scores históricos? ¿Cómo se mantiene la comparabilidad entre versiones?**

---

# 3. Alcance

## 3.1 Incluye

- Los principios rectores del sistema de ponderaciones (§6).
- La definición del Perfil de Ponderación como artefacto de dominio (§7).
- La autoridad, las condiciones y el procedimiento para modificarlo (§8).
- Su versionado, vigencia y conservación (§9).
- Las reglas de comparabilidad entre versiones y el mecanismo de reevaluación (§10).
- La interpretación de puntuaciones emitidas bajo versiones anteriores (§11).

## 3.2 No incluye

Este ADR **no decide, y ninguna de sus conclusiones debe interpretarse como decisión sobre**:

- **Los valores concretos de las ponderaciones.** Ninguno.
- Las categorías de evaluación de APS-08 §6, su número o su contenido.
- La escala de puntuación de APS-08 §7 ni los rangos de banda de §8.
- La fórmula de combinación de las puntuaciones parciales.
- Los criterios internos de cada categoría.
- El mecanismo técnico de cálculo, almacenamiento o consulta.

## 3.3 Materias cerradas

No se reabre ninguna materia de ADR-11 §9. En particular, **ninguna ponderación, ni ninguna versión de ellas, podrá determinar qué Leads existen, se registran o se conservan** (§12).

## 3.4 Cierre parcial de DC-4

> **Este ADR no cierra DC-4 por completo, y conviene declararlo expresamente.**
>
> AR-02 §5.2 identificó la deuda como «**las ponderaciones del Opportunity Score no están definidas** … sin ellas el Score no puede calcularse». Este ADR establece **quién las define, cómo y con qué garantías** — no **cuáles son**.
>
> **Queda pendiente la publicación de la primera versión del Perfil de Ponderación**, conforme al procedimiento de §8.4. Hasta entonces, el Opportunity Score sigue sin poder calcularse y DC-4 permanece parcialmente abierta.
>
> Esta separación es deliberada: definir valores antes de existir el gobierno que los versiona habría producido exactamente el problema descrito en §5.

---

# 4. Contexto

## 4.1 Qué establece APS-08

| Sección | Enunciado |
| --- | --- |
| **§4.1** Transparencia | «Toda puntuación deberá poder explicarse» |
| **§4.2** Consistencia | «Dos empresas con características similares deberán obtener resultados comparables» |
| **§4.3** Adaptabilidad | «El modelo podrá evolucionar a medida que AKVEZ aprenda del comportamiento real» |
| **§4.4** Neutralidad | «No favorecerá empresas únicamente por su tamaño o reputación» |
| **§4.5** Evidencia | «Cada punto otorgado deberá corresponder a una característica observable» |
| **§6** | Seis categorías de evaluación |
| **§7** | Escala 0-100 · combinación ponderada · «las ponderaciones podrán modificarse con el tiempo conforme el producto recopile evidencia suficiente» |
| **§8** | Cinco bandas |
| **§9** | Explicabilidad obligatoria de toda puntuación |
| **§10** | Fuentes de aprendizaje. «El aprendizaje deberá producirse de forma **controlada y documentada**» |
| **§8.6** *(v1.1)* | El Score clasifica y ordena. Nunca crea, nunca elimina, nunca define umbral |

## 4.2 Qué establece el dominio consolidado

| Fuente | Enunciado aplicable |
| --- | --- |
| **PO-01 §5** | El Score «no cambia lo que el Lead **es**; cambia lo que el Lead **vale**». Su única función operativa es **permitir ordenar** |
| **PO-01 §7** | No existe umbral. La priorización se expresa por orden y etiqueta, nunca por exclusión |
| **PO-01 §8** | «Nada se reemplaza. Cada etapa añade conocimiento» |
| **ADR-10A §5.5** | El criterio de cualificación por banda quedó **derogado**. Las bandas son etiquetas de prioridad, no criterios de admisión |
| **ADR-11 §9, E-3** | Queda excluido del dominio «cualquier valor mínimo que condicione la permanencia o la visibilidad de un Lead» |
| **ADR-13 §8.1** | El Score **no es reconstruible**: depende del perfil del usuario en el momento de la evaluación |
| **ADR-13 §10.3, V-4** | El Score es un **activo versionado**. Cada versión conserva el perfil de usuario con el que se calculó |
| **APS-04 v4.0 §A.5 (P-11)** | Prohibido el recálculo retroactivo por cambio de perfil del usuario |

## 4.3 Qué establece la gobernanza vigente

**APS-13 §6** atribuye a la **Fundadora** la «aprobación de cambios mayores» y al **Chief Product Officer** la coherencia estratégica y documental. **APS-13 §7** fija el proceso: Identificación → Análisis → Evaluación → Validación → Aprobación → Documentación → Implementación. **APS-13 §9** clasifica los cambios en Editorial, Menor, Mayor y Estratégico.

Este ADR **no crea gobernanza nueva**: aplica la existente a una materia que carecía de clasificación.

## 4.4 Dos dependencias distintas del Score

Es imprescindible no confundirlas, porque se gobiernan de forma diferente:

| Dependencia | Qué es | Quién la controla | Documento que la gobierna |
| --- | --- | --- | --- |
| **Perfil del usuario** | Servicios, cliente objetivo y ámbito del profesional. Alimenta la categoría *Compatibilidad* (APS-08 §6.6) | **El usuario** | APS-04 v4.0 (P-11) · ADR-13 (V-4) |
| **Perfil de Ponderación** | Peso de cada categoría en la combinación (APS-08 §7) | **El Product Office** | **Este ADR** |

Un cambio del primero afecta a **un usuario**. Un cambio del segundo afecta a **todos los Leads de todos los usuarios**. De ahí que el segundo exija un gobierno propio.

---

# 5. Problema

**Una modificación de ponderaciones reordena el producto entero sin dejar rastro.**

**P-1 — El cambio es invisible.** Modificar un peso no produce error ni aviso. El sistema sigue funcionando y devolviendo puntuaciones. El único síntoma es que el orden de la Biblioteca cambia por razones que el usuario no puede conocer, lo que contradice frontalmente APS-08 §4.1 (Transparencia) y §9 (Explicabilidad).

**P-2 — Las puntuaciones dejan de ser comparables sin que nadie lo advierta.** Un Lead puntuado con 72 bajo unas ponderaciones y otro con 68 bajo otras distintas no son ordenables entre sí: los números miden cosas diferentes. Ordenarlos juntos produce una jerarquía falsa que aparenta ser correcta. Vulnera APS-08 §4.2 (Consistencia).

**P-3 — El histórico se vuelve ininterpretable.** Sin saber con qué ponderaciones se emitió, una puntuación pasada no puede explicarse ni reproducirse. Se pierde la capacidad de responder «¿por qué me diste 41 a esta empresa en marzo?».

**P-4 — No hay autoridad designada.** APS-08 §7 admite el cambio sin decir quién lo autoriza. En ausencia de designación, la decisión la toma de hecho quien modifica el parámetro — el mecanismo que originó la investigación cerrada por PO-01.

**P-5 — Nada impide que una ponderación se use como umbral encubierto.** Asignar peso cero a una categoría, o ponderar de modo que ciertos negocios nunca superen un valor, produciría el efecto de exclusión que PO-01 §7 prohíbe, sin declarar umbral alguno.

---

# 6. Principios Rectores

## 6.1 Estabilidad

> **Las ponderaciones son estables por defecto. El cambio es la excepción y debe justificarse.**

El Opportunity Score es la promesa central del producto: que el usuario sepa cuáles son las mejores oportunidades (APS-01 §6). Una métrica que cambia con frecuencia deja de ser una referencia y se convierte en ruido.

## 6.2 Comparabilidad histórica

> **Dos puntuaciones solo son comparables si proceden de la misma versión del Perfil de Ponderación.**

Es la traducción operativa de APS-08 §4.2. La comparabilidad no se presume: se demuestra por identidad de versión.

## 6.3 Reproducibilidad

> **Toda puntuación emitida deberá poder recalcularse y obtener el mismo resultado**, dados los mismos datos de entrada, el mismo perfil de usuario y la misma versión del Perfil de Ponderación.

Sin reproducibilidad, la explicabilidad que exige APS-08 §9 es imposible: no puede explicarse un número que no puede reconstruirse.

## 6.4 Trazabilidad

> **Toda puntuación deberá poder rastrearse hasta la versión que la produjo, y toda versión hasta la evidencia y la decisión que la justificaron.**

Aplica APS-07 v2.0 §4.3 y ADS-00 (*Trazabilidad*) al sistema de ponderaciones.

## 6.5 Auditabilidad

> **Toda modificación deberá quedar registrada con su motivo, su evidencia, su autoridad aprobatoria y su fecha, de forma permanente.**

Aplica APS-13 §8: «Nunca se eliminará el historial de decisiones.»

## 6.6 No destrucción

> **Una versión nueva nunca sustituye a la anterior: la sucede.**

Es la aplicación de PO-01 §8 y de ADR-13 §10.2 al Perfil de Ponderación. Ninguna versión publicada se elimina ni se modifica.

## 6.7 Neutralidad respecto de la existencia

> **Las ponderaciones determinan el orden. Nunca la existencia.**

Ninguna configuración de pesos podrá excluir, ocultar ni impedir el registro de un Lead (PO-01 §6 y §7; ADR-11 §9, E-3). Desarrollado en §12.

## 6.8 Estabilidad Operacional

> **Ningún cambio en un Perfil de Ponderación podrá desplegarse directamente sobre producción sin existir una estrategia documentada de transición que preserve la comparabilidad y permita verificar el impacto sobre el orden de los Leads.**

**Qué añade respecto de los principios anteriores.** Los siete principios precedentes gobiernan la **decisión**: quién aprueba, con qué evidencia y con qué garantías de reproducibilidad. Éste gobierna el **despliegue**.

Son cosas distintas. Un Perfil correctamente aprobado —con evidencia suficiente, impacto evaluado y autoridad competente— puede aun así deteriorar el producto si entra en vigor de forma abrupta sobre una Biblioteca poblada: durante la transición coexistirán puntuaciones de dos versiones, y el orden que el usuario ve dejará de ser el que ninguna de las dos versiones prescribe.

**Qué exige.** Toda versión aprobada deberá acompañarse de una **Estrategia de Transición** documentada (C-10, §7.2) que responda a tres preguntas:

1. **Cómo se preserva la comparabilidad** durante el intervalo en que coexistan ambas versiones, conforme a R-COMP, R-ORD y las reglas T-1 a T-4 de §10.4.
2. **Cómo se verifica el impacto real** sobre el orden de los Leads una vez desplegada, y no solo el impacto simulado en la fase 3 del procedimiento (§8.4).
3. **En qué plazo concluye la transición**, es decir, cuándo la Biblioteca queda íntegramente reevaluada bajo la versión vigente.

**Qué no cambia.** Este principio **no modifica ninguna decisión de este ADR**. No altera las competencias de §8.1, ni las condiciones de §8.3, ni el versionado de §9, ni las reglas de comparabilidad de §10, ni las restricciones de §12. Añade una obligación documental sobre el despliegue que antes no existía.

**Relación con los riesgos.** Refuerza la mitigación de **R-6** —transición aplazada indefinidamente, que la pregunta 3 impide— y de **R-7** —despliegue sin verificación de impacto, que la pregunta 2 extiende del plano simulado al real.

---

# 7. Decisión — El Perfil de Ponderación

## 7.1 Definición

> **Se constituye el Perfil de Ponderación: el artefacto de dominio que asigna a cada categoría de evaluación de APS-08 §6 su peso dentro de la combinación que produce el Opportunity Score.**

Las ponderaciones dejan de ser un parámetro disperso de la implementación y pasan a ser un **artefacto identificable, versionado y gobernado**.

## 7.2 Contenido mínimo de una versión

Toda versión del Perfil de Ponderación deberá contener:

| # | Elemento | Obligatorio |
| --- | --- | --- |
| **C-1** | Identificador de versión | Sí |
| **C-2** | Peso asignado a cada una de las seis categorías de APS-08 §6 | Sí |
| **C-3** | Fecha de publicación | Sí |
| **C-4** | Fecha de entrada en vigor | Sí |
| **C-5** | Autoridad que la aprobó | Sí |
| **C-6** | Motivo del cambio respecto de la versión anterior | Sí, salvo en la versión inicial |
| **C-7** | Evidencia que lo sustenta, conforme a APS-08 §10 | Sí, salvo en la versión inicial |
| **C-8** | Impacto esperado sobre el orden de los Leads existentes | Sí |
| **C-9** | Versión que sucede | Sí, salvo en la versión inicial |
| **C-10** | **Estrategia de Transición**, conforme a §6.8 | Sí, salvo en la versión inicial |

**C-8 es la exigencia más relevante.** Obliga a que quien propone el cambio haya evaluado su efecto **antes** de aprobarlo, y no después de haberlo desplegado.

**C-10 es su contrapartida en el despliegue.** C-8 documenta el impacto **previsto**; C-10 documenta cómo se transita hasta él y cómo se comprueba que el impacto **real** coincide. Deberá responder a las tres preguntas de §6.8 y no podrá omitirse: una versión aprobada sin Estrategia de Transición **no puede entrar en vigor**.

> **Excepción única.** La versión inicial no requiere C-6, C-7, C-9 ni C-10, por no suceder a ninguna otra: no existe transición que documentar cuando no hay versión previa ni puntuaciones emitidas.

## 7.3 Inmutabilidad y vinculación

> **R-INM. Una versión publicada del Perfil de Ponderación es inmutable.** No se modifica, no se corrige y no se elimina. Un cambio, por pequeño que sea, exige una versión nueva.

> **R-VIN. Todo Opportunity Score emitido queda vinculado de forma permanente a la versión del Perfil que lo produjo.**

R-VIN extiende la regla **V-4** de ADR-13 §10.3, que ya exige conservar el perfil de usuario con el que se calculó. Con ambas, una puntuación conserva sus dos dependencias (§4.4) y se vuelve reproducible (§6.3).

**Una puntuación sin versión de Perfil asociada es un número sin significado** y no podrá utilizarse para ordenar ni para explicar.

## 7.4 Naturaleza documental

El Perfil de Ponderación es **contenido de producto**, no de arquitectura: fija cuánto vale cada característica comercial. Su autoridad natural es el Product Office, y su lugar documental es **APS-08**, conforme a la jerarquía de ADS-00 v1.2.

> **Este ADR gobierna el artefacto; no lo contiene.** La primera versión y sus sucesivas deberán incorporarse a APS-08 mediante el procedimiento de §8.4. Modificar APS-08 queda expresamente fuera del alcance de este sprint.

---

# 8. Gobernanza

## 8.1 Quién define las ponderaciones

| Rol | Competencia |
| --- | --- |
| **Product Office** | **Decide.** Aprueba la publicación de toda versión del Perfil de Ponderación |
| **Fundadora** | **Aprueba**, conforme a APS-13 §6, por tratarse de un cambio **Mayor** (§8.2) |
| **Chief Product Officer** | **Propone y documenta.** Reúne la evidencia, redacta la propuesta y garantiza la coherencia documental (APS-13 §6) |
| **Architecture Team** | **Implementa y verifica.** No decide pesos. Garantiza el cumplimiento de §7.3, §9 y §10 |
| **Equipo de Desarrollo** | **Ejecuta.** No modifica ponderaciones bajo ninguna circunstancia |

> **Regla vinculante.** **Ninguna ponderación podrá modificarse desde el código, la configuración o la operación sin una versión publicada y aprobada del Perfil.** Un cambio de peso no es un ajuste técnico: es una decisión de producto.

## 8.2 Clasificación del cambio

> **Toda modificación del Perfil de Ponderación es un cambio Mayor** conforme a APS-13 §9.

**Fundamento.** APS-13 define *Mayor* como el cambio «que afecta funcionalidades importantes» y «requiere actualización documental». Una modificación de pesos altera el orden de presentación de todos los Leads de todos los usuarios, que es la promesa central del producto (APS-01 §6).

**No es un cambio Menor**, porque no es una «pequeña mejora funcional». **No es Editorial**, porque no es redacción. **No alcanza a Estratégico**, salvo que el cambio afecte a las categorías de evaluación de APS-08 §6 —lo que quedaría fuera del alcance de este ADR y exigiría revisión completa del Blueprint.

## 8.3 Bajo qué condiciones puede modificarse

Una versión nueva solo podrá proponerse cuando concurran **las cuatro** condiciones siguientes:

| # | Condición |
| --- | --- |
| **G-1** | **Existe evidencia suficiente**, procedente de las fuentes de aprendizaje de APS-08 §10: clientes conseguidos, oportunidades descartadas, retroalimentación de usuarios y resultados de campañas comerciales |
| **G-2** | **La evidencia es observable**, conforme a APS-08 §4.5. Una intuición, una preferencia o un caso aislado no bastan |
| **G-3** | **El impacto sobre el orden de los Leads existentes ha sido evaluado** y documentado (C-8) |
| **G-4** | **El cambio propuesto no vulnera ninguna restricción de §12**, y en particular no produce exclusión encubierta |
| **G-5** | **Existe una Estrategia de Transición documentada** (C-10), conforme al principio de Estabilidad Operacional de §6.8 |

**Regla de estabilidad.** Conforme a §6.1, la ausencia de evidencia es motivo suficiente para no modificar. **La carga de la justificación recae siempre sobre quien propone el cambio, nunca sobre quien propone conservar.**

## 8.4 Procedimiento

Aplica el proceso de APS-13 §7 sin alteración:

| Fase | Trabajo |
| --- | --- |
| **1. Identificación** | Se detecta evidencia que sugiere una ponderación inadecuada |
| **2. Análisis** | Se verifica G-1 y G-2. Se cuantifica la evidencia |
| **3. Evaluación** | Se simula el efecto sobre el orden de los Leads existentes (G-3, C-8) |
| **4. Validación** | El Architecture Team verifica G-4 y el cumplimiento de §12 |
| **5. Aprobación** | La Fundadora aprueba, por tratarse de cambio Mayor (APS-13 §6) |
| **6. Documentación** | Se publica la versión nueva en APS-08 con los nueve elementos de §7.2, y se incrementa la versión de APS-08 conforme a ADS-00 |
| **7. Implementación** | Entra en vigor en la fecha declarada (C-4). Se aplica §10 a los Leads existentes |

**Ninguna fase puede omitirse.** La fase 3 es la que impide desplegar un cambio cuyo efecto se desconoce.

## 8.5 Qué documentación se exige

La aprobación exige, como mínimo:

1. Los nueve elementos de §7.2.
2. La evidencia de G-1, con su origen y su volumen.
3. El resultado de la simulación de impacto de la fase 3.
4. La declaración expresa de conformidad con §12.
5. El registro en el Historial de Versiones de APS-08, conforme a APS-13 §8.

---

# 9. Versionado y Vigencia

## 9.1 Identificación

Cada versión del Perfil de Ponderación se identifica de forma unívoca e irrepetible. **Un identificador de versión no se reutiliza jamás**, ni siquiera si la versión se retira antes de entrar en vigor.

## 9.2 Estados de una versión

| Estado | Significado |
| --- | --- |
| **Propuesta** | Redactada, pendiente de aprobación. No puede utilizarse para puntuar |
| **Aprobada** | Aprobada conforme a §8.4, con fecha de entrada en vigor futura |
| **Vigente** | En uso. **Existe exactamente una versión vigente en cada momento** |
| **Sucedida** | Ha sido reemplazada como vigente. **Se conserva permanentemente** |

> **Regla de unicidad.** En todo momento existe **una y solo una** versión vigente. Ninguna puntuación podrá emitirse bajo una versión que no lo sea.

## 9.3 Conservación

> **R-CON. Todas las versiones del Perfil de Ponderación se conservan de forma permanente, incluidas las sucedidas.**

**Por qué.** Sin la versión sucedida, las puntuaciones emitidas bajo ella dejan de ser reproducibles (§6.3) y explicables (APS-08 §9). Eliminar una versión antigua **destruye retroactivamente el significado** de todas las puntuaciones que produjo.

Es la aplicación de PO-01 §8 y de ADR-13 §10.2 al Perfil: una versión sucedida no es obsoleta, es **histórica**.

## 9.4 Compatibilidad

> **Las versiones del Perfil de Ponderación no son compatibles entre sí.**

No existe conversión, equivalencia ni factor de ajuste entre versiones. Una puntuación de 70 bajo una versión no equivale a 70 bajo otra, ni a ningún otro valor calculable.

**Consecuencia.** La compatibilidad no se resuelve traduciendo, sino **reevaluando** (§10.3).

## 9.5 Vigencia

- Una versión entra en vigor en la fecha declarada en C-4, nunca antes.
- Su vigencia termina cuando otra versión entra en vigor.
- **La entrada en vigor no altera ninguna puntuación ya emitida** (§11.1).

---

# 10. Comparabilidad entre Versiones

## 10.1 Regla de comparabilidad

> **R-COMP. Dos Opportunity Scores son comparables si, y solo si, fueron emitidos bajo la misma versión del Perfil de Ponderación.**

## 10.2 Regla de ordenación

> **R-ORD. Toda vista que presente Leads ordenados por Opportunity Score deberá construir ese orden a partir de puntuaciones emitidas bajo una única versión.**

**Ordenar mezclando versiones está prohibido.** Produce una jerarquía falsa con apariencia de correcta, que es la forma más dañina de error: no se detecta.

## 10.3 Reevaluación

Cuando entra en vigor una versión nueva, los Leads ya evaluados conservan puntuaciones de la versión anterior. La única forma admisible de restaurar la comparabilidad es la **reevaluación**.

> **R-REEV. La reevaluación consiste en calcular una puntuación nueva bajo la versión vigente, que se incorpora como emisión adicional del activo versionado, conforme a ADR-13 §10.3.**

| # | Regla de reevaluación |
| --- | --- |
| **RV-1** | **No sobrescribe.** La puntuación anterior se conserva con su versión de Perfil asociada (§6.6; ADR-13 V-1) |
| **RV-2** | **No altera la identidad del Lead** ni su estadio del ciclo de vida (ADR-13 V-5; ADR-12 §8.2) |
| **RV-3** | **No altera el conjunto de Leads.** Ninguna reevaluación puede añadir, retirar ni ocultar un Lead (ADR-11 §7.1) |
| **RV-4** | **Es una operación del Lead Analyzer**, conforme a APS-03 v3.0 §7.2. Ningún otro componente puede emitir puntuaciones |
| **RV-5** | **Utiliza el perfil de usuario vigente** en el momento de la reevaluación, y lo conserva conforme a ADR-13 V-4 |
| **RV-6** | **Requiere análisis previo.** Un Lead sin analizar no se reevalúa: permanece sin puntuación, que es estado válido (PO-01 §5) |

## 10.4 Ordenación durante la transición

Entre la entrada en vigor de una versión y la reevaluación completa de la Biblioteca coexistirán puntuaciones de dos versiones. Durante ese intervalo:

| # | Regla |
| --- | --- |
| **T-1** | La vista se ordenará por la puntuación de la **versión vigente**, cuando exista |
| **T-2** | Los Leads aún no reevaluados se ordenarán por su puntuación anterior, **señalando expresamente** que corresponde a una versión previa |
| **T-3** | **Ningún Lead se ocultará** por estar pendiente de reevaluación (PO-01 §7; APS-04 v4.0 §A.9, UI-2) |
| **T-4** | La interfaz deberá permitir al usuario reconocer que la vista está en transición |

**T-2 y T-4 aplican APS-08 §4.1 (Transparencia).** Un orden provisional es aceptable; un orden provisional presentado como definitivo, no.

## 10.5 Prohibición de recálculo silencioso

> **R-SIL. Está prohibido recalcular una puntuación sin emitir una versión nueva del activo y sin dejar constancia.**

Un recálculo silencioso vulneraría simultáneamente §6.3 (Reproducibilidad), §6.4 (Trazabilidad), §6.5 (Auditabilidad) y ADR-13 §10.2.

---

# 11. Interpretación de Scores Históricos

## 11.1 Las puntuaciones emitidas no se alteran

> **R-HIST. Ninguna puntuación emitida se modifica, se recalcula en su sitio ni se elimina al cambiar el Perfil de Ponderación.**

Es coherente con la prohibición análoga de APS-04 v4.0 §A.5 (P-11) respecto del perfil del usuario, y con PO-01 §8.

## 11.2 Cómo se lee una puntuación histórica

Una puntuación histórica se interpreta **siempre en el contexto de su versión**. Su lectura correcta no es «este Lead vale 68», sino:

> «Este Lead valía 68 **conforme al criterio comercial vigente en la fecha de su evaluación**.»

## 11.3 Qué conserva valor y qué no

| Uso de una puntuación histórica | ¿Válido? |
| --- | --- |
| Explicar por qué un Lead se presentó en cierta posición en su momento | **Sí.** Es su función principal |
| Auditar la evolución del criterio comercial de AKVEZ | **Sí** |
| Servir de evidencia para una modificación futura del Perfil (G-1) | **Sí** |
| Comparar con una puntuación de otra versión | **No** (R-COMP) |
| Ordenar junto a puntuaciones de otra versión | **No** (R-ORD) |
| Presentarse al usuario como valor actual | **No.** Deberá señalarse como histórica (T-2) |

## 11.4 La banda también es histórica

Las bandas de APS-08 §8 se derivan de la puntuación. Una puntuación histórica arrastra su banda histórica, que **no se recalcula** aunque los rangos permanezcan invariables: la banda es función del valor, y el valor es propio de su versión.

---

# 12. Restricciones Vinculantes

Derivan de PO-01 y de ADR-11 §9. **No admiten excepción, y ninguna versión del Perfil podrá vulnerarlas.**

| # | Restricción | Fundamento |
| --- | --- | --- |
| **RV-A** | Ninguna ponderación podrá impedir que una Empresa se registre | PO-01 §3 · ADR-11 E-1 |
| **RV-B** | Ninguna ponderación podrá retirar un Lead de la Biblioteca | PO-01 §8 · ADR-11 E-5 |
| **RV-C** | Ninguna ponderación podrá ocultar un Lead de la vista del usuario | PO-01 §7 · APS-08 v1.1 §8.6 |
| **RV-D** | Ninguna configuración de pesos podrá producir un **umbral encubierto**: un valor por debajo del cual un Lead deje de presentarse o de conservarse | PO-01 §7 · ADR-11 E-3 |
| **RV-E** | Ninguna ponderación podrá introducir sesgo por tamaño o reputación como criterio en sí mismo | APS-08 §4.4 (Neutralidad) |
| **RV-F** | Toda puntuación deberá seguir siendo explicable tras el cambio | APS-08 §4.1, §9 |
| **RV-G** | El cambio de ponderaciones no podrá justificarse en una limitación técnica, de coste o de proveedor | ADR-11 §7.2, E-6 |

## 12.1 Precisión sobre RV-D

Es la restricción más sutil y la que exige verificación activa en la fase 4 del procedimiento (§8.4).

Un umbral no necesita declararse para existir. Basta con ponderar de modo que cierta clase de negocios no pueda superar un valor y que la interfaz, la paginación o cualquier otra capa la sitúe fuera del alcance práctico del usuario.

> **Criterio de verificación.** Se aplicará el Criterio de Invariancia del Conjunto de ADR-11 §7.1: si al modificar las ponderaciones **cambia qué Leads existen, se conservan o resultan alcanzables** —y no únicamente su orden—, el cambio es inadmisible.

---

# 13. Consecuencias

## 13.1 Positivas

- **El Opportunity Score se vuelve reproducible y auditable.** Toda puntuación puede recalcularse y explicarse, cumpliendo por fin APS-08 §4.1 y §9.
- **Los cambios de criterio dejan de ser invisibles.** Toda modificación exige evidencia, simulación de impacto y aprobación de la Fundadora.
- **La comparabilidad deja de presumirse.** R-COMP y R-ORD impiden la jerarquía falsa descrita en P-2.
- **El histórico conserva su significado**, porque las versiones sucedidas se conservan permanentemente (R-CON).
- **El criterio comercial de AKVEZ se convierte en un activo trazable**, cuya evolución puede estudiarse.
- **No se crea gobernanza nueva.** Se aplica APS-13 §6, §7 y §9 a una materia que carecía de clasificación.
- **Se cierra la vía del umbral encubierto** (RV-D), que era la única forma en que la exclusión derogada por PO-01 §7 podía reaparecer.

## 13.2 Negativas

- **Modificar ponderaciones se vuelve costoso.** Exige evidencia, simulación, aprobación de la Fundadora y actualización documental. Es coste deliberado: §6.1 hace del cambio la excepción.
- **La reevaluación tiene coste de ejecución** proporcional al tamaño de la Biblioteca, que solo crece (PO-01 §4).
- **El volumen crece.** Cada reevaluación añade una emisión, conforme a ADR-13 §10.3.
- **Aparece un periodo de transición con orden mixto** (§10.4), que la interfaz debe saber representar — obligación nueva para APS-04.
- **Este ADR no hace calculable el Score.** Solo lo gobierna (§3.4).

---

# 14. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **Las ponderaciones se modifican desde configuración o código**, eludiendo el gobierno. Es el modo natural de incumplimiento: cambiar un número es trivial | **Alta** | §8.1, regla vinculante. Debe verificarse que ningún peso sea modificable sin versión publicada |
| **R-2** | **Se ordena mezclando versiones** y se produce una jerarquía falsa que nadie detecta | **Alta** | R-ORD y §10.4 |
| **R-3** | **Se recalcula en su sitio** al cambiar de versión, destruyendo el histórico y su reproducibilidad | **Alta** | R-HIST, R-SIL y RV-1 |
| **R-4** | **Se introduce un umbral encubierto** mediante una configuración de pesos | **Alta** | RV-D y §12.1. Verificación obligatoria en la fase 4 |
| **R-5** | **Las versiones sucedidas se eliminan** para ahorrar espacio, dejando ininterpretables las puntuaciones históricas | Media | R-CON |
| **R-6** | **La reevaluación masiva se aplaza indefinidamente** y la Biblioteca queda con orden mixto de forma permanente | Media | §10.4. Debe fijarse plazo al aprobar cada versión |
| **R-7** | **Se publica una versión sin simulación de impacto**, por urgencia | Media | G-3, C-8 y fase 3 del procedimiento |
| **R-8** | **La primera versión se define sin evidencia**, por necesidad de arrancar, y su carácter provisional se olvida | Media | §3.4 y punto 5 de la DoD (§18) |

---

# 15. Dependencias

**Depende de:**

- **PO-01** §5, §6, §7, §8. Autoridad funcional del dominio.
- **APS-08 v1.1** §4, §6, §7, §8, §8.6, §9, §10. **Objeto gobernado por este ADR.**
- **APS-13** §6, §7, §8, §9. Marco de gobernanza aplicado sin alteración.
- **ADR-13** §8.1, §10.2, §10.3 (V-1, V-4, V-5). El Score es activo versionado; el versionado del Perfil se apoya en el suyo.
- **ADR-12** §8.2. El Score no altera la identidad del Lead.
- **ADR-11** §7.1, §7.2, §9 (E-1, E-3, E-5, E-6). Criterio de Invariancia y materias cerradas.
- **ADR-10A v2.0** §5.5, §7 (C-6). Derogación del criterio de cualificación por banda.
- **APS-04 v4.0** §A.5 (P-11), §A.9 (UI-2, UI-8). Prohibición de recálculo retroactivo y reglas de presentación.
- **APS-07 v2.0** §4.3, §16. Trazabilidad y definición del Opportunity Score.
- **APS-01** §6. La priorización como promesa de producto.
- **ADS-00 v1.2**. Jerarquía documental y control de cambios.

**Condiciona a:**

- La **publicación de la primera versión del Perfil de Ponderación** en APS-08, pendiente (§3.4).
- La implementación del cálculo y del almacenamiento del Opportunity Score, dentro del alcance de PO-01 §9.3.
- Una futura revisión de **APS-04**, que deberá representar el estado de transición de §10.4.

**No afecta a:** ADR-01, ADR-02, ADR-05, ADR-06, ADR-07, ADR-08 ni ADR-09.

---

# 16. Glosario

| Término | Definición |
| --- | --- |
| **Perfil de Ponderación** | Artefacto de dominio que asigna a cada categoría de evaluación de APS-08 §6 su peso en la combinación que produce el Opportunity Score. Versionado e inmutable (§7) |
| **Versión vigente** | Única versión del Perfil bajo la cual pueden emitirse puntuaciones en un momento dado (§9.2) |
| **Versión sucedida** | Versión reemplazada como vigente. Se conserva permanentemente (R-CON) |
| **Reevaluación** | Cálculo de una puntuación nueva bajo la versión vigente, incorporada como emisión adicional sin sustituir a la anterior (§10.3) |
| **Umbral encubierto** | Configuración de pesos que produce el efecto de un umbral de exclusión sin declararlo. Prohibida por RV-D |
| **Perfil del usuario** | Datos profesionales que alimentan la categoría *Compatibilidad*. **No debe confundirse con el Perfil de Ponderación** (§4.4) |
| **Comparabilidad** | Propiedad por la que dos puntuaciones pueden ordenarse entre sí. Requiere identidad de versión (R-COMP) |

---

# 17. Referencias

- **PO-01** — Decisión de Producto: Definición Canónica de Lead, §3, §5, §6, §7, §8, §9.3.
- **APS-01** — Product Vision, §6, §8.2.
- **APS-04 v4.0** — Human Interface System, §A.5 (P-11), §A.9 (UI-2, UI-8).
- **APS-07 v2.0** — Data & Knowledge Architecture, §4.3, §16.
- **APS-08 v1.1** — Opportunity Scoring Framework, §4, §6, §7, §8, §8.6, §9, §10.
- **APS-13** — Product Governance Framework, §6, §7, §8, §9.
- **ADS-00 v1.2** — Documentation Standard.
- **ADR-10A v2.0** — Definición Canónica de Empresa y Lead, §5.5, §7.
- **ADR-11** — Frontera entre Dominio e Implementación, §7.1, §7.2, §9.
- **ADR-12** — Identidad Canónica del Lead, §8.2.
- **ADR-13** — Motor Canónico de Persistencia, §8.1, §10.2, §10.3.
- **AR-02** — Blueprint Readiness Assessment, §4.1 (DC-4), §5.2.

---

# 18. Definition of Done

Este ADR podrá considerarse completo cuando el Product Office:

1. **Ratifique el Perfil de Ponderación** como artefacto de dominio versionado e inmutable (§7), y su vinculación permanente con toda puntuación emitida (R-VIN).
2. **Confirme el reparto de competencias de §8.1** y la clasificación de toda modificación como cambio **Mayor** conforme a APS-13 §9.
3. **Apruebe las reglas de comparabilidad** R-COMP y R-ORD, y el mecanismo de reevaluación de §10.3 como única vía admisible de restaurar la comparabilidad.
4. **Ratifique las siete restricciones vinculantes de §12**, y en particular **RV-D**, junto con su criterio de verificación de §12.1.
5. **Determine cuándo se publica la primera versión del Perfil de Ponderación** en APS-08, dejando constancia de que se emitirá **sin evidencia de uso real** —por no existir todavía— y de que deberá revisarse cuando la haya (§3.4, R-8).
6. **Ratifique el principio de Estabilidad Operacional** (§6.8) y la exigencia de una Estrategia de Transición (C-10, G-5) como condición de entrada en vigor de toda versión sucesora.

Hasta que los seis puntos se cumplan, este documento permanece en estado **`Draft`** y no habilita ninguna implementación.

> **Recordatorio de alcance.** Cumplidos los cinco puntos, **DC-4 seguirá parcialmente abierta** hasta que la primera versión del Perfil de Ponderación esté publicada en APS-08. Este ADR establece el gobierno; no los valores.

---

> ## ✅ Definition of Done — cerrada (v1.2, 2026-07-29)
>
> **Los seis puntos quedaron cumplidos en el sprint GOV-01.** La condición de permanencia en `Draft` dejó de tener efecto y el documento **habilita implementación**.
>
> | # | Condición | Cumplimiento |
> | --- | --- | --- |
> | 1 | Ratificación del Perfil como artefacto versionado e inmutable (§7) y de R-VIN | **Cumplida** |
> | 2 | Confirmación del reparto de §8.1 y de la clasificación como cambio Mayor | **Cumplida.** Conforme a APS-13 §9 |
> | 3 | Aprobación de R-COMP, R-ORD y del mecanismo de reevaluación de §10.3 | **Cumplida** |
> | 4 | Ratificación de las siete restricciones de §12, en especial **RV-D** | **Cumplida.** Verificadas una a una en APS-08 v1.2 §7.1 |
> | 5 | Determinación del momento de publicación del primer Perfil | **Cumplida — de hecho.** **WP-01 v1.0** publicado en **APS-08 v1.2 §7.1** durante el sprint PC-01, con constancia de emitirse sin evidencia de uso real (§3.4, R-8) |
> | 6 | Ratificación de la Estabilidad Operacional (§6.8) y de la Estrategia de Transición | **Cumplida.** C-10 y G-5 son condición de entrada en vigor de toda versión sucesora |
>
> **Autoridad:** AKVEZ Product Office, pronunciamiento del 2026-07-29.
>
> **Efecto sobre DC-4.** El recordatorio de alcance anterior **queda superado**: el gobierno lo fija este ADR y los valores están publicados en APS-08 v1.2 §7.1. La deuda crítica **DC-4** queda cerrada por completo, no parcialmente.
