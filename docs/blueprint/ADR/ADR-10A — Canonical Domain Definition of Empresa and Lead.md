# ADR-10A — Definición Canónica de Empresa y Lead

| Campo | Valor |
| --- | --- |
| Código | ADR-10A |
| Clasificación | Architecture Decision Record — Dominio |
| Versión | 2.1 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad de dominio | **PO-01** (Approved) · APS-07 v2.0 · APS-03 v3.0 |
| Precede a | ADR-11 · *(ADR-10: `Archived` desde el 2026-07-29)* |

> **Sobre el nombre.** Se conserva la numeración `10A` propuesta por el Product Owner porque expresa precedencia lógica sobre ADR-10 sin renumerar decisiones ya emitidas. Se ajusta el título a «Empresa y Lead» porque la ambigüedad no reside en un solo concepto, sino en la frontera entre dos.

---

> # ⚠ Documento alineado con PO-01
>
> **Este ADR ya no define el dominio.** La autoridad funcional sobre Empresa, Lead, Registro y Biblioteca de Leads corresponde a **PO-01** (Approved, 2026-07-29) y a su desarrollo en **APS-07 v2.0**.
>
> **Qué se hizo en la v2.0.** Se neutralizó todo razonamiento que contradecía a PO-01, marcándolo expresamente como **derogado** o como **contexto histórico**. **Ningún contenido fue eliminado:** el texto original se conserva íntegro y cada corrección figura junto a él, para que la evolución del razonamiento siga siendo trazable.
>
> **Qué quedó confirmado.** La investigación de este ADR acertó en lo esencial. Sus §4.1 a §4.5 —la matriz de consistencia— anticiparon correctamente cuatro de las cinco conclusiones que PO-01 terminó adoptando: que la Biblioteca registra desde el descubrimiento, que el Lead Hunter no analiza, que el Blueprint **ordena y clasifica pero nunca trunca**, y que el modelo es acumulativo por principio.
>
> **En qué se equivocó.** En el criterio de cualificación (§5.2, §5.5 y §6): sostuvo que una Empresa se convierte en Lead al alcanzar una **banda de oportunidad**. PO-01 §3 estableció que el único evento de cualificación es el **Registro**. Ese error se hereda en las respuestas 2, 3, 4, 5, 7 y 8 de §6, todas corregidas en esta versión.
>
> **Por qué fue necesario PO-01.** Este ADR resolvió por **interpretación** lo que solo podía resolverse por **decisión**. Su §7 lo reconoció explícitamente al dejar C-1, C-5, C-6 y C-8 fuera de su alcance. Ese reconocimiento es lo que hizo inevitable una decisión de Product Office.
>
> **Sobre el estado.** `Draft` → `Review`, única transición disponible conforme a `AF-01-DIAG-001`. El paso a `Approved` requiere la ratificación del Product Office prevista en §11.

---

# Historial de Versiones

| Versión | Fecha | Descripción | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-07-28 | Creación inicial. Define canónicamente Empresa, Lead, Biblioteca de Leads y Registro; establece la transición entre estadios; documenta ocho contradicciones del Blueprint y propone una regla de precedencia. | ADR-10 y ADR-11 alcanzaron conclusiones divergentes por apoyarse en definiciones de dominio incompatibles entre documentos aprobados. Ninguna decisión posterior de persistencia puede tomarse sin resolver primero qué es un Lead. |
| **2.1** | 2026-07-29 | **Ratificación formal.** Estado `Review` → **`Approved`**. Se cierra §11 con la constancia de la ratificación. **No se modifica ningún contenido técnico:** ni las definiciones de §5, ni las respuestas de §6, ni el cierre de §7, ni §9. | Sprint **GOV-01**. La Definition of Done quedó cerrada en la v2.0 y su propio cierre declaraba que el paso a `Approved` «requiere únicamente la ratificación formal del Product Office sobre esta v2.0». **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 2.0 | 2026-07-29 | **Alineación con PO-01.** Se corrigen §5.2 y §5.5 (criterio de cualificación), las respuestas 2, 3, 4, 5, 7 y 8 de §6, §4.6, §8 y §9. Se marca §3 como sustituida por ADS-00 v1.2 y §4.1-§4.5 como confirmadas por PO-01. Se cierra §7 (las ocho contradicciones) y §11 (Definition of Done). Estado `Draft` → `Review`. **Ningún contenido eliminado:** todo texto derogado se conserva junto a su corrección. | Fase 2 de PLAN-01 y PO-01 §9.2: «ADR-10A — sus definiciones quedan sustituidas por §1, §2 y §3». El criterio de cualificación por banda de §5.5 contradecía directamente a PO-01 §3 y §7. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo y Alcance
3. Regla de Precedencia Documental
4. Matriz de Consistencia
5. Definiciones Canónicas
6. Respuestas a las Preguntas de Dominio
7. Contradicciones que Requieren Resolución del Product Office
8. Consecuencias
9. ADRs Dependientes
10. Referencias
11. Definition of Done

---

# 1. Resumen Ejecutivo

El Blueprint contiene **dos definiciones incompatibles de la Biblioteca de Leads** y **dos atribuciones incompatibles de responsabilidades entre agentes**. Ambos pares figuran en documentos aprobados.

De esa ambigüedad se derivaron dos ADR con conclusiones opuestas: ADR-10 recomendó almacenar únicamente lo entregado; ADR-11 sostuvo que debía almacenarse todo lo descubierto. Ninguno estaba equivocado respecto de la fuente que consultó; ambos consultaron fuentes parciales.

Este ADR no introduce reglas nuevas. Fija la interpretación canónica aplicando una regla de precedencia derivada del propio Blueprint, y enumera las contradicciones que solo el Product Office puede resolver.

---

# 2. Objetivo y Alcance

## Objetivo

Establecer qué es una Empresa, qué es un Lead, cuándo ocurre la transición entre ambos y qué representa la Biblioteca de Leads.

## Incluye

Definiciones de dominio, la frontera entre estadios, el significado del Registro y la resolución documental de las contradicciones detectadas.

## No incluye

Este documento **no** menciona motores de datos, componentes técnicos, capas, ni ningún elemento de implementación. Es un documento de dominio puro. Las decisiones sobre dónde y cómo se materializan estos conceptos corresponden a ADR-10, ADR-11 y sus sucesores.

---

# 3. Regla de Precedencia Documental

> ## 📜 Contexto histórico — Sustituida por ADS-00 v1.2
>
> **Esta sección conserva únicamente valor histórico.** Su hallazgo era correcto y su recomendación fue atendida.
>
> El vacío que denunciaba —la ausencia de jerarquía documental declarada, identificado aquí como **C-8** y en AR-01 como **V-5**— **fue subsanado el 2026-07-29**: ADS-00 v1.2 incorporó la sección *Jerarquía Documental y Regla de Precedencia*, con orden oficial `AF › PO › APS › ADR › DP › REV › AR` y seis reglas de aplicación (R-1 a R-6).
>
> **Las cuatro reglas derivadas que siguen quedan sustituidas** por esa jerarquía declarada. Se conservan porque documentan cómo se razonó en ausencia de norma, y porque tres de ellas fueron sustancialmente recogidas en el estándar: la Regla 2 (especificidad) y la Regla 3 (normatividad) inspiran la R-2 de ADS-00; la Regla 4 (trazabilidad) fue **corregida** —la cadena `APS → ADR → AF` que enunciaba invertía el lugar de AF, que ADS-00 v1.2 sitúa en el **nivel constitucional**, por encima de todo.
>
> **Ninguna de estas cuatro reglas debe aplicarse ya.** Para resolver cualquier conflicto documental, úsese ADS-00 v1.2.

**Hallazgo previo:** ni `INDEX.md`, ni ADS-00, ni AF-00 establecen una jerarquía explícita entre documentos del Blueprint. Su ausencia es la causa raíz de que dos ADR pudieran alcanzar conclusiones opuestas sin que ninguno incumpliera una regla. **Se recomienda subsanarla** (§7, C-8).

En su ausencia, se deriva la siguiente regla a partir de evidencia textual:

**Regla 1 — Supremacía de la Visión.** APS-01 §1: *«Cuando exista un conflicto entre una funcionalidad y la Product Vision, prevalecerá siempre la visión.»* Es la única declaración de precedencia explícita del Blueprint.

**Regla 2 — Especificidad.** Cuando dos documentos tratan el mismo concepto, prevalece aquel cuya **sección está dedicada al concepto** sobre la mención incidental dentro de un listado o glosario. Fundamento: ADS-00 §1 (Claridad) y §5 (Implementabilidad) exigen que un documento técnico sea suficiente por sí mismo; una definición desarrollada y normativa satisface ese estándar, un elemento de lista no.

**Regla 3 — Normatividad.** Un enunciado prescriptivo («deberá», «debe incluir») prevalece sobre uno descriptivo.

**Regla 4 — Trazabilidad.** ADS-00 §3 fija la cadena `APS → ADR → AF`. Un ADR no puede contradecir un APS; puede interpretarlo.

---

# 4. Matriz de Consistencia

> ## ✅ Nota de vigencia (v2.0)
>
> **Las resoluciones de §4.1 a §4.5 fueron confirmadas por PO-01.** Esta matriz es la aportación más sólida del documento y conserva plena validez analítica:
>
> | § | Resolución de la v1.0 | Estado tras PO-01 |
> | --- | --- | --- |
> | 4.1 | «La Biblioteca de Leads registra a la Empresa **desde su descubrimiento** y conserva su historial completo» | **Confirmada.** PO-01 §4; APS-07 v2.0 §8.1 |
> | 4.2 | El Lead Hunter **no** analiza; la priorización pertenece al Lead Analyzer | **Confirmada.** APS-03 v3.0 §7.1 y §7.2 |
> | 4.3 | «El Blueprint **ordena y clasifica; en ningún punto trunca**» | **Confirmada.** PO-01 §6 y §7; APS-03 v3.0 §8.2 |
> | 4.4 | La deduplicación es responsabilidad del Lead Hunter y es criterio de éxito de la V1 | **Confirmada.** PO-01 §3; APS-02 v2.1 FR-008 |
> | 4.5 | El Blueprint es **acumulativo por principio**: nada se reemplaza ni se descarta | **Confirmada.** PO-01 §8; APS-07 v2.0 §7.2 |
> | 4.6 | Orden del Score respecto del Análisis: «sin resolver» | **Resuelta.** Véase la corrección al final de §4.6 |
>
> **Advertencia de lectura.** Las columnas «Texto literal» de las tablas siguientes citan **APS-02 v2.0, APS-03 v2.1 y APS-07 v1.0**, versiones hoy corregidas. Se conservan sin modificar porque son la **evidencia** de las contradicciones que este ADR documentó: alterarlas destruiría el valor probatorio del análisis. Las contradicciones que registran **ya no existen** en el Blueprint vigente.

## 4.1 Biblioteca de Leads

| Documento | Texto literal | Implica |
| --- | --- | --- |
| **APS-07 §8** *(sección dedicada)* | «Su función es evitar duplicados y **conservar el historial completo de cada empresa**.» · «Cada registro **deberá incluir**, como mínimo: … **Estado del análisis** … **Opportunity Score** … **Fecha de descubrimiento** …» | Registro **desde el descubrimiento**, con estado de análisis como atributo |
| **APS-07 §7** | «Registro — La empresa se almacena en la Biblioteca de Leads» *(etapa posterior a Descubrimiento, anterior a Análisis)* | Registro **antes** del análisis |
| **APS-03 §7** | Lead Hunter: «**Registrar nuevas empresas** en la Biblioteca de Leads» | Registro **antes** del análisis |
| **APS-03 §8** | «3. Lead Hunter **consulta** la Biblioteca de Leads para evitar duplicados» | La Biblioteca precede al análisis en el flujo |
| **APS-02 §6** *(listado)* | «Almacenamiento persistente de empresas **ya analizadas**» | Registro **después** del análisis |
| **APS-02 Glosario** | «Base de conocimiento que almacena empresas **previamente analizadas**» | Registro **después** del análisis |
| **APS-03 Glosario** | «Repositorio persistente donde se almacenan las empresas **ya procesadas**» | Ambiguo |
| **APS-07 Glosario** | «Repositorio central donde se almacena el historial de **empresas analizadas**» | Registro **después** del análisis |

**Resolución.** APS-07 §8 es la única **sección dedicada** a la Biblioteca y la única **normativa** («deberá incluir»). Por las Reglas 2 y 3 prevalece. Es además internamente decisiva: exigir un campo **«Estado del análisis»** solo tiene sentido si un registro puede existir **sin haber sido analizado**. Un registro que únicamente existiera tras el análisis tendría ese estado constante y el campo carecería de propósito.

Las cuatro menciones a «empresas analizadas» son descripciones abreviadas del caso de uso predominante, no definiciones del conjunto.

> **La Biblioteca de Leads registra a la Empresa desde su descubrimiento y conserva su historial completo.**

## 4.2 Responsabilidades de los agentes

| Documento | Texto literal | Implica |
| --- | --- | --- |
| **APS-03 §7** *(sección dedicada)* | Lead Hunter: «Buscar empresas · Obtener información pública · Detectar posibles duplicados · Registrar nuevas empresas · Entregar el conjunto» | Lead Hunter **no** analiza |
| **APS-03 §7** *(sección dedicada)* | Lead Analyzer: «Analizar el sitio web · Evaluar la presencia digital · Revisar reseñas · Identificar oportunidades · **Calcular el Opportunity Score** · Generar observaciones» | Lead Analyzer evalúa y puntúa |
| **APS-03 Glosario** | «Lead Analyzer: Agente encargado del análisis **y priorización** de oportunidades» | Lead Analyzer **prioriza** |
| **APS-02 Glosario** | «Lead Hunter: Agente responsable de descubrir **y analizar** empresas» | Lead Hunter **sí** analiza |

**Resolución.** APS-03 es el documento cuya finalidad declarada (§3) es «establecer qué agentes existen y cuáles son sus responsabilidades». Por Regla 2 prevalece sobre el glosario de APS-02. El descubrimiento y el análisis son responsabilidades de agentes distintos, y **la priorización pertenece al Lead Analyzer**.

## 4.3 Priorización y selección

| Documento | Texto literal | Implica |
| --- | --- | --- |
| **APS-01 §5** | Problemas resueltos: «**baja priorización de oportunidades**» · «pérdida de tiempo en empresas con baja probabilidad de conversión» | La priorización es promesa de producto |
| **APS-01 §6** | El usuario sabrá «qué empresas representan **las mejores oportunidades**» | Ídem |
| **APS-01 §7** | «identificar oportunidades comerciales **de alta calidad**» | Ídem |
| **APS-08 §8** | 90-100: «Alta prioridad. **Debe aparecer entre los primeros resultados.**» | Norma de **ordenación** |
| **APS-08 §8** | Define cinco bandas, incluidas 40-59 «Oportunidad Baja» y 0-39 «Oportunidad Muy Baja» | Las oportunidades de banda baja **se clasifican y existen** |
| **APS-03 §8** | «4. **Las nuevas empresas** pasan al Lead Analyzer» | Sin cuantificador ni recorte |

**Resolución.** No hay contradicción. El Blueprint **ordena y clasifica; en ningún punto trunca**. Priorizar es una capacidad del negocio respaldada por APS-01 (Regla 1) y normada por APS-08 §8. Descartar un subconjunto no aparece en ningún documento.

## 4.4 Duplicados

| Documento | Texto literal |
| --- | --- |
| **APS-03 §7** | Lead Hunter: «Detectar posibles duplicados» |
| **APS-03 §8** | «3. Lead Hunter consulta la Biblioteca de Leads para evitar duplicados» |
| **APS-07 §8** | «Su función es evitar duplicados…» |
| **APS-02 §9** | Criterio de éxito V1: «la Biblioteca de Leads **evite correctamente los duplicados**» |

**Resolución.** Consistente en los cuatro. La deduplicación es responsabilidad del Lead Hunter y se apoya en la Biblioteca. Es, además, **criterio de éxito de la V1** (APS-02 §9), lo que eleva su importancia: no es una optimización.

## 4.5 Historial y trazabilidad

| Documento | Texto literal |
| --- | --- |
| **APS-07 §5** | «Historial — Registro cronológico de toda actividad realizada» *(activo propio)* |
| **APS-07 §6** | «Cada transición **agregará nuevo conocimiento sin reemplazar la información anterior**» |
| **APS-07 §8** | Cada registro incluye «Historial de modificaciones» · «Ningún agente podrá modificar directamente la información sin dejar trazabilidad» |
| **APS-07 §4.4** | «Evolución sin pérdida» |

**Resolución.** Consistente. El Blueprint es **acumulativo por principio**: la información no se reemplaza ni se descarta.

## 4.6 Opportunity Score — sujeto de la puntuación

| Documento | Texto literal |
| --- | --- |
| **APS-08 Glosario** | «potencial comercial de **una empresa**» |
| **APS-02 / APS-03 Glosarios** | «potencial comercial de **un lead**» |
| **APS-07 §6** | `Lead Analizado → Opportunity Score` *(estadio posterior al análisis)* |
| **APS-07 §7** | Evaluación **después** de Análisis |
| **ADR-02 §8** | `Lead Hunter → Scoring → Pitch Generator` *(sin Lead Analyzer)* |

**Resolución parcial.** El sujeto es indiferente bajo este ADR: la puntuación se aplica a la entidad en su estadio evaluable. El **orden** respecto del análisis permanece **sin resolver** (§7, C-5).

> **Corrección (v2.0) — C-5 y C-7 resueltas.**
>
> **El orden es: primero el Análisis, después la Evaluación.** PO-01 §5 y §8; APS-07 v2.0 §6.3. El Opportunity Score se calcula **sobre** el conocimiento que produce el Análisis, nunca antes. La divergencia de ADR-02 §8 queda resuelta a favor de APS-07.
>
> **El sujeto de la puntuación es el Lead**, no la Empresa. Ya no es indiferente: bajo PO-01 §5 el Score es un **atributo del Lead**, y solo existen Leads después del Registro. APS-08 v1.1 §14 y APS-07 v2.0 §16 recogen esta corrección.
>
> **Un Lead sin Opportunity Score es un estado válido.** La ausencia de puntuación no degrada ni excluye.

# 5. Definiciones Canónicas

## 5.1 Empresa

> **Empresa** — Negocio real del que AKVEZ ha obtenido información pública. Su existencia en el sistema no implica juicio comercial alguno.

Fundamento: APS-07 §5 («Información pública sobre negocios»).

## 5.2 Lead

> **Lead** — Empresa identificada como oportunidad comercial.

Fundamento: APS-07 §5 y APS-02 Glosario («Empresa identificada como posible cliente»). La identificación es **cualitativa**: se determina por el juicio comercial que el sistema emite sobre la Empresa, nunca por su posición relativa frente a otras.

> ### ⛔ Definición derogada — Sustituida por PO-01 §2
>
> **La definición anterior no es válida.** La definición canónica vigente es:
>
> > **Lead** — Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto.
>
> **Qué cambia.** La diferencia entre Empresa y Lead **no es de calidad, es de pertenencia**. La Empresa pertenece al mercado; el Lead pertenece al embudo del usuario. No hay juicio comercial alguno en la transición.
>
> **Por qué se equivocó la v1.0.** Su fundamento —APS-07 §5 v1.0, «Empresas identificadas como oportunidades comerciales»— **fue derogado** por PO-01 §2 y sustituido en APS-07 v2.0 §5. El razonamiento era correcto respecto de la fuente que citaba; la fuente era el error.
>
> **Consecuencia.** Un Lead **no requiere** juicio comercial, ni análisis, ni Opportunity Score, ni banda. Todo eso ocurre **después** de ser Lead y lo enriquece sin cambiar lo que es.

## 5.3 Biblioteca de Leads

> **Biblioteca de Leads** — Núcleo del conocimiento de AKVEZ. Conserva el historial completo de cada Empresa conocida, desde su descubrimiento, e incorpora el conocimiento que cada etapa genera sobre ella.

Fundamento: APS-07 §8 y §6.

## 5.4 Registro

> **Registro** — Acto por el que una Empresa recién descubierta pasa a formar parte del conocimiento permanente de AKVEZ. Es responsabilidad del Lead Hunter y ocurre inmediatamente después del Descubrimiento.

Fundamento: APS-07 §7, APS-03 §7.

## 5.5 Criterio de cualificación

> Una Empresa se convierte en Lead cuando el juicio comercial de AKVEZ la sitúa en una **banda de oportunidad** que la hace relevante para el usuario.

Fundamento: APS-08 §8 define cinco bandas cualitativas. El umbral concreto es una **política de negocio** que corresponde fijar al Product Office (§7, C-6), no una decisión de arquitectura.

> ### ⛔ Criterio derogado — Sustituido por PO-01 §3
>
> **Éste es el error central de la v1.0 de este documento.** El criterio anterior no es válido y no debe aplicarse.
>
> **Criterio canónico vigente:**
>
> > **El Registro.** Una Empresa se convierte en Lead en el momento exacto en que AKVEZ la incorpora a la Biblioteca de Leads del usuario, inmediatamente después de descubrirla y comprobar que no estaba ya presente.
> >
> > **Es el único evento de cualificación. No existen otros.**
>
> **Por qué el criterio de banda era incorrecto.** El Product Office lo resolvió en sentido contrario por tres razones, todas de PO-01 §3 y §7:
>
> 1. **La memoria completa es condición de la deduplicación**, que APS-02 §9 declara criterio de éxito de la V1. Cualificar antes de registrar rompería la funcionalidad que define el éxito del producto.
> 2. **El juicio comercial llega después, no antes.** Exigir que una Empresa esté ya juzgada para ser Lead invierte el orden del trabajo: no se puede analizar lo que aún no ha entrado.
> 3. **Un umbral automático sustituiría el criterio del usuario**, en contra de APS-01 §8.2: «la IA existirá para potenciar el criterio del usuario, no para sustituirlo».
>
> **C-6 queda resuelta, pero por disolución.** La v1.0 preguntaba «¿cuál es el umbral de banda que cualifica?». La respuesta de PO-01 §7 es que **no existe ni existirá umbral alguno**. La pregunta carecía de objeto: presuponía una cualificación por calidad que el dominio no tiene.
>
> **Las cinco bandas de APS-08 §8 conservan plena validez** — pero como **etiquetas de prioridad**, no como criterio de admisión. Así lo declara ahora APS-08 v1.1 §8.6.

---

# 6. Respuestas a las Preguntas de Dominio

| # | Pregunta | Respuesta canónica | Fundamento |
| --- | --- | --- | --- |
| 1 | ¿Qué es exactamente una Empresa? | Negocio real con información pública conocida, sin juicio comercial asociado | APS-07 §5 |
| 2 | ¿Qué es exactamente un Lead? | Empresa identificada como oportunidad comercial | APS-07 §5, APS-02 Glosario |
| 3 | ¿Cuándo una Empresa se convierte en Lead? | Cuando el juicio comercial la sitúa en una banda de oportunidad relevante. Es una transición **cualitativa**, no posicional | APS-08 §8, APS-07 §6 |
| 4 | ¿Puede existir una Empresa sin convertirse en Lead? | **Sí.** Es el caso normal. APS-08 §8 prevé bandas «Oportunidad Baja» y «Muy Baja»; conserva su historial en la Biblioteca | APS-08 §8, APS-07 §8 |
| 5 | ¿Puede existir un Lead sin haber sido analizado? | **No.** La cualificación exige juicio comercial, y el juicio exige evaluación. Sí puede existir una **Empresa registrada y no analizada**: por eso APS-07 §8 exige el campo «Estado del análisis» | APS-07 §8, APS-08 |
| 6 | ¿Qué representa la Biblioteca de Leads? | El conocimiento acumulado de AKVEZ sobre cada Empresa conocida, desde su descubrimiento. No es una lista de resultados entregados | APS-07 §8 |
| 7 | ¿Qué representa el conjunto almacenado? | Todas las Empresas descubiertas, cada una con el estado de conocimiento alcanzado. Un subconjunto de ellas son Leads | APS-07 §8, §6 |
| 8 | ¿Qué significa «registrar» un Lead? | Incorporar la Empresa al conocimiento permanente tras el descubrimiento. Se registra la **Empresa**; se convierte en Lead más tarde, sin nuevo registro — APS-07 §6: «sin reemplazar la información anterior» | APS-07 §6, §7 |
| 9 | ¿Qué activos define APS-07? | Ocho: Empresas · Leads · Análisis · Opportunity Scores · Pitches · Usuarios · Historial · Métricas | APS-07 §5 |
| 10 | ¿Qué prevalece si APS-02 y APS-03 se contradicen? | El documento cuya **sección dedicada** trata el concepto (Regla 2), y el enunciado **normativo** sobre el descriptivo (Regla 3). Sobre agentes prevalece APS-03; sobre la Biblioteca prevalece APS-07 §8. Ante conflicto con la Visión, prevalece APS-01 (Regla 1) | APS-01 §1, ADS-00 §1, §3, §5 |

> ## ⛔ Respuestas corregidas (v2.0)
>
> **La tabla anterior se conserva como registro del razonamiento original. Seis de sus diez respuestas quedaron derogadas por PO-01.** Las respuestas vigentes son:
>
> | # | Pregunta | Respuesta canónica **vigente** | Fundamento |
> | --- | --- | --- | --- |
> | 1 | ¿Qué es exactamente una Empresa? | *(sin cambios)* Negocio real con información pública conocida, sin juicio comercial asociado | PO-01 §1 · APS-07 v2.0 §5 |
> | **2** | ¿Qué es exactamente un Lead? | **Empresa incorporada al espacio de trabajo comercial de un usuario concreto.** No «identificada como oportunidad comercial» | PO-01 §2 |
> | **3** | ¿Cuándo una Empresa se convierte en Lead? | **En el Registro.** Es un hecho de pertenencia, no un juicio: ni cualitativo ni posicional | PO-01 §3 |
> | **4** | ¿Puede existir una Empresa sin convertirse en Lead? | **No, una vez descubierta y registrada.** Toda Empresa descubierta y no duplicada se registra, y el Registro la convierte en Lead. Solo permanece como mera Empresa lo aún no descubierto para ese usuario | PO-01 §3, §4 |
> | **5** | ¿Puede existir un Lead sin haber sido analizado? | **Sí.** Es el estado normal de todo Lead recién registrado, y es un estado válido y esperado. La v1.0 respondía «No» | PO-01 §2, §8 |
> | 6 | ¿Qué representa la Biblioteca de Leads? | *(sin cambios sustantivos)* El conocimiento acumulado sobre cada Empresa descubierta para el usuario. No es una lista de resultados entregados | PO-01 §4 · APS-07 v2.0 §8 |
> | **7** | ¿Qué representa el conjunto almacenado? | Todas las Empresas descubiertas, cada una con su conocimiento acumulado. **Todas ellas son Leads**, no «un subconjunto» | PO-01 §4 |
> | **8** | ¿Qué significa «registrar» un Lead? | Incorporar la Empresa a la Biblioteca del usuario. **El Registro es la conversión misma**, no un paso previo a ella: no se registra una Empresa que «se convierte en Lead más tarde» | PO-01 §3 |
> | 9 | ¿Qué activos define APS-07? | *(sin cambios)* Ocho: Empresas · Leads · Análisis · Opportunity Scores · Pitches · Usuarios · Historial · Métricas | APS-07 v2.0 §5 |
> | **10** | ¿Qué prevalece ante una contradicción documental? | **La jerarquía declarada en ADS-00 v1.2:** `AF › PO › APS › ADR › DP › REV › AR`, con sus reglas R-1 a R-6. Las reglas derivadas de §3 ya no se aplican | ADS-00 v1.2 |
>
> **Nota sobre la respuesta 5.** Su inversión —de «No» a «Sí»— es la consecuencia más visible del cambio de criterio de cualificación. La v1.0 razonaba correctamente **dentro** de su premisa: si ser Lead exige juicio comercial, y el juicio exige análisis, entonces no puede haber Lead sin analizar. Al caer la premisa (§5.5), cae la conclusión.

---

# 7. Contradicciones que Requieren Resolución del Product Office

Este ADR resuelve mediante interpretación; las siguientes requieren **decisión formal**.

| # | Contradicción | Documentos | Impacto |
| --- | --- | --- | --- |
| **C-1** | ¿La Biblioteca contiene todo lo descubierto o solo lo analizado? | APS-07 §8 vs APS-02 §6 y tres glosarios | **Crítico.** Determina el contenido del conocimiento de AKVEZ. Interpretado a favor de APS-07 §8 |
| **C-2** | ¿Lead Hunter analiza? | APS-02 Glosario vs APS-03 §7 | Alto. Interpretado a favor de APS-03 |
| **C-3** | ¿Se registra la Empresa o el Lead? | APS-03 §7 («empresas») vs el nombre «Biblioteca de **Leads**» | Medio. El nombre del activo no coincide con su contenido |
| **C-4** | ¿`Scoring` de ADR-02 §8 es el Lead Analyzer o una capacidad distinta? | ADR-02 §8 vs APS-03 §7 | Alto. Origen de un error en ADR-10 §4.3 |
| **C-5** | ¿La Evaluación precede o sigue al Análisis? | APS-07 §7 y §6 (después) vs ADR-02 §8 (antes) | **Alto. Sin resolver.** Condiciona el orden del flujo |
| **C-6** | ¿Cuál es el umbral de banda que convierte una Empresa en Lead? | APS-08 §8 define bandas pero no umbral de cualificación | **Crítico. Sin resolver.** Es una política de negocio |
| **C-7** | ¿El Opportunity Score se aplica a Empresa o a Lead? | APS-08 Glosario vs APS-02/APS-03 | Bajo |
| **C-8** | El Blueprint carece de jerarquía documental explícita | INDEX, ADS-00, AF-00 | **Crítico.** Causa raíz de ADR-10 vs ADR-11 |

> ## ✅ Estado de cierre de las ocho contradicciones (v2.0)
>
> **Las ocho quedaron resueltas.** Ninguna permanece abierta. Este inventario fue la aportación que hizo posible la decisión.
>
> | # | Resolución | Documento que la resuelve |
> | --- | --- | --- |
> | **C-1** | **Resuelta — a favor de APS-07 §8**, como este ADR había interpretado. La Biblioteca contiene **todo lo descubierto**. APS-02 v2.1 §6 y los tres glosarios divergentes fueron corregidos | PO-01 §4 · APS-02 v2.1 · APS-07 v2.0 §8 |
> | **C-2** | **Resuelta — a favor de APS-03**, como este ADR había interpretado. **El Lead Hunter no analiza.** El glosario de APS-02 fue corregido | APS-02 v2.1 §15 · APS-03 v3.0 §7.1 |
> | **C-3** | **Resuelta — el nombre es correcto.** La Biblioteca de Leads **no** contendrá mayoritariamente Empresas: contendrá exclusivamente Leads, porque entrar en ella es lo que convierte una Empresa en Lead. La objeción se disolvió con el nuevo criterio de cualificación | PO-01 §4 |
> | **C-4** | **Resuelta.** El bloque `Scoring` de ADR-02 §8 **es** una operación del Lead Analyzer, no una capacidad separada. No existe capacidad de selección que ubicar | APS-03 v3.0 §7.2 · PO-01 §6 |
> | **C-5** | **Resuelta.** La Evaluación **sigue** al Análisis. Prevalece el orden de APS-07 sobre el de ADR-02 §8 | PO-01 §5, §8 · APS-07 v2.0 §6.3 |
> | **C-6** | **Resuelta por disolución.** **No existe umbral de cualificación** ni lo habrá. La pregunta presuponía una cualificación por calidad que el dominio no tiene | PO-01 §7 · APS-08 v1.1 §8.6 |
> | **C-7** | **Resuelta.** El Opportunity Score se aplica al **Lead** | PO-01 §5 · APS-08 v1.1 §14 |
> | **C-8** | **Resuelta.** La jerarquía documental fue declarada: `AF › PO › APS › ADR › DP › REV › AR`, con reglas R-1 a R-6 | ADS-00 v1.2 |
>
> **Balance.** De las ocho, **cinco se resolvieron en el sentido que este ADR interpretó** (C-1, C-2, C-4, C-5, C-7) y **una en su contra** (C-6, y con ella el criterio de §5.5). Las dos restantes (C-3, C-8) se resolvieron de forma que este documento no podía anticipar: una por disolución, otra por acto normativo del Product Office.

---

# 8. Consecuencias

## Positivas

- Empresa, Lead, Biblioteca y Registro quedan definidos con fundamento textual y sin reglas inventadas.
- Se dispone de una regla de precedencia aplicable a futuras contradicciones.
- La cualificación queda establecida como **cualitativa** (banda), no posicional (ranking), eliminando la premisa que enfrentó a ADR-10 con ADR-11.
- Las ocho contradicciones quedan inventariadas y priorizadas.

## Negativas

- La regla de precedencia es **derivada**, no declarada. Vinculante solo si el Product Office la ratifica.
- Tres contradicciones (C-5, C-6, C-8) quedan sin resolver y bloquean decisiones posteriores.
- La interpretación de C-1 a favor de APS-07 §8 implica que la Biblioteca debe conservar más información de la que la implementación vigente conserva.
- El activo «Biblioteca de **Leads**» contendrá mayoritariamente **Empresas** (C-3). El nombre es engañoso; corregirlo exigiría enmendar cuatro documentos.

## ADRs afectados

| ADR | Impacto |
| --- | --- |
| **ADR-10** | Su premisa de cualificación (posicional) queda sustituida por la canónica (banda). Requiere revisión |
| **ADR-11** | Su premisa principal queda formalmente invalidada por APS-01 §5-§7 y APS-08 §8 |
| **ADR-02** | C-4 y C-5 requieren aclaración de su §8 |
| **ADR-05** | El conjunto que su §10 modela queda definido por este ADR |

> ## ⛔ Consecuencias corregidas (v2.0)
>
> **Positivas — dos requieren corrección:**
>
> - «La cualificación queda establecida como **cualitativa** (banda), no posicional (ranking)» → **Derogada.** La cualificación no es ni cualitativa ni posicional: es el **Registro** (PO-01 §3). Lo que sí se confirma es el fondo de la observación —que la cualificación **no es posicional**—, y con ello la eliminación de la premisa que enfrentó a ADR-10 con ADR-11.
> - «Se dispone de una regla de precedencia aplicable» → **Sustituida** por la jerarquía declarada en ADS-00 v1.2.
> - Las otras dos consecuencias positivas se **confirman**: las definiciones tienen fundamento textual y las ocho contradicciones quedaron inventariadas, priorizadas y hoy **cerradas**.
>
> **Negativas — las cuatro quedaron superadas:**
>
> | Consecuencia negativa de la v1.0 | Estado |
> | --- | --- |
> | «La regla de precedencia es derivada, no declarada» | **Superada.** ADS-00 v1.2 la declara |
> | «C-5, C-6 y C-8 quedan sin resolver y bloquean decisiones posteriores» | **Superada.** Las tres resueltas; véase el cierre de §7 |
> | «La Biblioteca debe conservar más información de la que conserva la implementación» | **Confirmada y ahora normativa.** Es exactamente lo que exige PO-01 §4. Queda como trabajo de implementación, enumerado en PO-01 §9.3 |
> | «El activo Biblioteca de **Leads** contendrá mayoritariamente **Empresas**. El nombre es engañoso» | **Derogada.** Contendrá exclusivamente Leads. **El nombre es correcto** (PO-01 §4). No hay que enmendar cuatro documentos |
>
> **ADRs afectados — corrección:**
>
> - **ADR-10**: su premisa no queda sustituida por «la canónica (banda)», sino por el **Registro**. El documento fue **archivado** el 2026-07-29.
> - **ADR-11**: su premisa principal **no** queda invalidada por APS-01 §5-§7 y APS-08 §8. Su objeto —la ubicación de la capacidad de selección— queda **disuelto**: PO-01 §6 declara que no existe selección ni Top N en el dominio.

---

# 9. ADRs Dependientes

1. **Revisión de ADR-10** — tras la ratificación de este documento.
2. **Reescritura de ADR-11** — sobre la base documental completa.
3. **Política de Cualificación** — resolución de C-6.
4. **Orden Canónico del Flujo** — resolución de C-5.
5. **Jerarquía Documental del Blueprint** — resolución de C-8. **Debería ser el primero.**
6. **Identidad Natural de la Empresa** — prerrequisito de la deduplicación exigida por APS-02 §9.

> ## ✅ Estado de los seis documentos dependientes (v2.0)
>
> | # | Documento previsto | Estado |
> | --- | --- | --- |
> | 1 | Revisión de ADR-10 | **Ejecutada.** ADR-10 pasó a `Archived` el 2026-07-29 |
> | 2 | Reescritura de ADR-11 | **Pendiente de decisión del Product Office.** PLAN-01 §4 lo da por **retirado**, al quedar su objeto disuelto por PO-01 §6 y §7 |
> | 3 | Política de Cualificación | **Innecesario.** No existe umbral que fijar (PO-01 §7) |
> | 4 | Orden Canónico del Flujo | **Innecesario.** Resuelto por PO-01 §5 y §8, y recogido en APS-07 v2.0 §6.3 y APS-03 v3.0 §8.1 |
> | 5 | Jerarquía Documental del Blueprint | **Ejecutado.** ADS-00 v1.2. La v1.0 acertó al señalar que «debería ser el primero»: así se ejecutó, en la Fase 0 de PLAN-01 |
> | 6 | Identidad Natural de la Empresa | **Vigente y pendiente.** Sigue siendo prerrequisito de la deduplicación exigida por APS-02 §9. **Es el único de los seis que continúa siendo necesario** |

---

# 10. Referencias

## 10.1 Autoridad vigente (v2.0)

- **PO-01 — Decisión de Producto: Definición Canónica de Lead**, §1, §2, §3, §4, §5, §6, §7, §8. Autoridad funcional del dominio.
- **APS-07 v2.0 — Data & Knowledge Architecture**, §5, §6.3, §7, §7.1, §7.2, §8, §16.
- **APS-03 v3.0 — Agent Architecture**, §7.1, §7.2, §8.1, §8.2.
- **APS-02 v2.1 — Product Scope**, §6, FR-008, §15.
- **APS-08 v1.1 — Opportunity Scoring Framework**, §3.1, §8.6, §14.
- **ADS-00 v1.2 — Documentation Standard**, *Jerarquía Documental y Regla de Precedencia*.
- **PLAN-01 — Plan de Consolidación del Blueprint**, §4, §7 (Fase 2).

## 10.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-02, APS-03, APS-07 y APS-08 remiten a las versiones vigentes en 2026-07-28, hoy corregidas.

APS-01 §1, §5, §6, §7 · APS-02 §6, §9, Glosario · APS-03 §3, §7, §8, §11, Glosario · APS-07 §4.4, §5, §6, §7, §8, Glosario · APS-08 §7, §8, Glosario · ADR-01 Glosario · ADR-02 §7, §8 · ADR-05 §10 · ADR-10 · ADR-11 · ADS-00 §1, §3, §5

---

# 11. Definition of Done

1. El Product Office ratifica o corrige las cinco definiciones canónicas de §5.
2. El Product Office ratifica la regla de precedencia de §3 o publica una jerarquía documental propia (C-8).
3. Se resuelven **C-1**, **C-5** y **C-6**.
4. Se confirma si el nombre «Biblioteca de Leads» se mantiene pese a C-3.

Hasta entonces permanece en **Draft** y ninguna decisión de persistencia debe emitirse ni revisarse.

> ## ✅ Definition of Done — cerrada (v2.0)
>
> **Los cuatro puntos quedaron cumplidos el 2026-07-29.** La condición de permanencia en `Draft` dejó de tener efecto.
>
> | # | Condición | Cumplimiento |
> | --- | --- | --- |
> | 1 | Ratificación o corrección de las definiciones de §5 | **Cumplida — con corrección.** PO-01 §1-§4 ratificó §5.1, §5.3 y §5.4, y **corrigió** §5.2 y §5.5 |
> | 2 | Ratificación de la regla de §3 o jerarquía propia | **Cumplida — mediante jerarquía propia.** ADS-00 v1.2 |
> | 3 | Resolución de C-1, C-5 y C-6 | **Cumplida.** Las tres, y las cinco restantes. Véase el cierre de §7 |
> | 4 | Confirmación del nombre «Biblioteca de Leads» | **Cumplida — el nombre se mantiene.** PO-01 §4: «El nombre es correcto» |
>
> **Estado resultante:** `Review`. El paso a `Approved` requiere únicamente la ratificación formal del Product Office sobre esta v2.0, ya alineada con el dominio consolidado.
>
> ---
>
> ## ✅ Ratificación formal — v2.1, 2026-07-29
>
> **El Product Office ratificó esta v2.0 en el sprint GOV-01.** Estado `Review` → **`Approved`**.
>
> No se exigió corrección alguna: la condición pendiente era el acto de aprobación, no una modificación de contenido.
>
> **Queda derogada** la restricción «ninguna decisión de persistencia debe emitirse ni revisarse»: las decisiones de persistencia están habilitadas desde la aprobación de PO-01, y su alcance figura en PO-01 §9.3.
