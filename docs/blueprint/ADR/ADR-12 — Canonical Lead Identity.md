# ADR-12 — Identidad Canónica del Lead

| Campo | Valor |
| --- | --- |
| Código | ADR-12 |
| Clasificación | Architecture Decision Record — Dominio |
| Versión | 1.1 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad de dominio | **PO-01** (Approved) · APS-07 v2.0 · APS-03 v3.0 |
| Resuelve | Deuda crítica **DC-3** (AR-02 §4.1) |

> **Naturaleza del documento.** Documento de **dominio puro**. Define qué hace que dos Leads sean el mismo Lead. **No decide persistencia, ni motor de datos, ni claves técnicas, ni índices, ni estructura de base de datos.** Todo eso pertenece a decisiones posteriores y depende de ésta, no al revés.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra la Definition of Done de §18. **No se modifica ningún contenido técnico:** ni la identidad de §7, ni la Huella de Identidad, ni los casos límite de §10, ni las reglas de invariancia de §11. | Sprint **GOV-01**. Los puntos 1 a 4 de §18 son actos de ratificación, ejercidos por el Product Office. El punto 5 queda cerrado mediante asignación: la medición del riesgo **R-4** —qué proporción de descubrimientos carece de Referencia de Origen— se ejecuta en **DEV-01 — Architecture Bootstrap**, por requerir datos reales de la fuente. **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Creación inicial. Define la identidad natural de la Empresa y del Lead, las reglas de deduplicación, la separación entre identidad y atributos, los ocho casos límite y las reglas de invariancia. | Deuda crítica **DC-3** de AR-02 §4.1. Previsto como necesario en ADR-10 §11.4 punto 1 y en ADR-10A §9 punto 6, «el único de los seis que continúa siendo necesario». Sin identidad natural no hay deduplicación, y APS-02 v2.1 §9 la declara **criterio de éxito de la V1**. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Alternativas Consideradas
7. Decisión — Identidad Natural
8. Identidad frente a Atributos
9. Reglas de Deduplicación
10. Casos Límite
11. Reglas de Invariancia
12. Persistencia Conceptual
13. Consecuencias
14. Riesgos
15. Dependencias
16. Glosario
17. Referencias
18. Definition of Done

---

# 1. Resumen Ejecutivo

PO-01 §3 estableció que una Empresa se convierte en Lead al registrarse en la Biblioteca, **«tras descubrirla y comprobar que no estaba ya presente»**. Esa comprobación exige saber qué significa «estar ya presente», y ningún documento del Blueprint lo define.

Sin esa definición, la deduplicación no puede construirse. Y la deduplicación no es una optimización: **APS-02 v2.1 §9 la declara criterio de éxito de la V1**, y PO-01 §3 fundamenta el Registro exhaustivo precisamente en que la memoria completa es su condición.

Este ADR responde a la pregunta con dos decisiones encadenadas:

1. **La identidad de una Empresa es su Referencia de Origen**: la designación estable que la fuente de descubrimiento asigna a ese establecimiento concreto (§7.1).
2. **La identidad de un Lead es el par formado por la identidad de su Empresa y el usuario a cuyo espacio de trabajo pertenece** (§7.2).

La segunda se deduce del propio PO-01: la Empresa «no pertenece a nadie, es información del mercado» (§1); el Lead «pertenece al embudo del usuario» (§2). Dos usuarios que descubren el mismo negocio tienen **la misma Empresa y dos Leads distintos**.

Todo lo demás —nombre, teléfono, correo, sitio web, dirección, reputación, análisis, puntuación, propuesta, contacto y estado— es **atributo**, y ningún cambio en ellos altera la identidad.

---

# 2. Objetivo

Responder de forma definitiva y verificable:

> **¿Qué hace que dos Leads sean el mismo Lead?**

---

# 3. Alcance

## 3.1 Incluye

- Los atributos que constituyen la identidad de una Empresa y de un Lead.
- Los atributos que expresamente **no** la constituyen.
- Qué puede cambiar a lo largo de la vida de un Lead y qué no puede cambiar nunca.
- Las reglas de deduplicación y su comportamiento ante información parcial o sobrevenida.
- Ocho casos límite resueltos de forma explícita.
- Las reglas de invariancia: qué conserva la identidad y qué crea una nueva.
- Qué debe permanecer estable durante toda la vida del Lead, en términos conceptuales.

## 3.2 No incluye

Este ADR **no** decide, y ninguna de sus conclusiones debe interpretarse como decisión sobre:

- Motor de base de datos, esquema físico, índices, claves primarias o foráneas.
- Formato, longitud o algoritmo de generación de identificadores técnicos.
- Estrategia de escritura del repositorio ante un registro existente.
- Rendimiento, volumen, concurrencia o coste de las comprobaciones de duplicidad.
- Elección o sustitución de proveedores de descubrimiento.
- Retención, archivado o supresión de datos.

Estas materias **dependen** de la decisión aquí adoptada, no al revés.

## 3.3 Materias cerradas

Este ADR no reabre ninguna materia de las enumeradas en ADR-11 §9. En particular, **ninguna regla de identidad podrá determinar qué Leads existen por razones de calidad, cantidad o puntuación**.

---

# 4. Contexto

## 4.1 Qué exige el dominio consolidado

| Fuente | Exigencia |
| --- | --- |
| **PO-01 §3** | El Registro ocurre «tras descubrirla y comprobar que **no estaba ya presente**» |
| **PO-01 §3** | «La memoria completa es condición de la deduplicación», que es criterio de éxito de la V1 |
| **PO-01 §1** | La Empresa «no pertenece a nadie. Es información del mercado» |
| **PO-01 §2** | El Lead pertenece «al espacio de trabajo comercial de **un usuario concreto**» |
| **PO-01 §8** | «Nada se reemplaza. Cada etapa **añade** conocimiento» |
| **PO-01 §8** | «Ninguna etapa expulsa. Un Lead que entra en la Biblioteca permanece en ella» |
| **APS-02 v2.1 §9** | Criterio de salida de la V1: «la Biblioteca de Leads **evite correctamente los duplicados**» |
| **APS-02 v2.1 FR-008** | «El sistema evitará **registrar por duplicado** una Empresa ya presente en la Biblioteca» |
| **APS-07 v2.0 §8.2** | La Biblioteca permite afirmar «esto ya te lo mostré» |

## 4.2 De dónde procede el descubrimiento

APS-02 v2.1 §10 establece Google Maps como fuente principal de descubrimiento de la V1, y ADR-03 registra **Google Places** como proveedor.

Las fuentes de este tipo asignan a cada establecimiento una designación propia y estable, que sobrevive a los cambios de nombre, teléfono, horario y sitio web del negocio. Esa designación es el mejor candidato disponible a identidad natural, y su existencia no es una particularidad de un proveedor concreto: es una característica general de los directorios de establecimientos.

## 4.3 Estado actual de la implementación

Verificado por inspección del código:

- La entidad del frontend (`src/shared/types/index.ts`) **no contiene ninguna referencia de origen**. Su campo `id` es un identificador técnico asignado por el repositorio en el momento de guardar.
- Existe un campo `googleMapsUrl`, pero es un enlace de presentación, no una designación estable.
- En consecuencia, **hoy el mismo negocio descubierto en dos búsquedas produce dos registros distintos**.

Este ADR no corrige esa situación —no modifica código—, pero define el concepto que la corrección deberá implementar.

## 4.4 Antecedentes documentales

- **ADR-10 §11.4, punto 1** anticipó este documento: «Determinar si el sistema debe conservar un identificador estable de origen para cada negocio, y qué constituye la identidad de un Lead entre búsquedas distintas. Es prerrequisito de cualquier estrategia de escritura no duplicada.»
- **ADR-10A §9, punto 6** lo declaró «**el único de los seis que continúa siendo necesario**».
- **AR-02 §4.1** lo clasificó como deuda crítica **DC-3**, prioridad P0, impacto máximo.

---

# 5. Problema

**El Blueprint ordena deduplicar sin definir qué es un duplicado.**

De ahí se derivan tres problemas concretos:

**P-1 — La comprobación del Registro no es ejecutable.** PO-01 §3 exige comprobar que la Empresa «no estaba ya presente». Sin criterio de identidad, esa comprobación no puede escribirse.

**P-2 — La memoria comercial se degrada silenciosamente.** Si el mismo negocio se registra dos veces, la Biblioteca deja de poder afirmar «esto ya te lo mostré» y «esto lo descartaste». El conocimiento acumulado sobre un negocio queda repartido entre registros que el sistema no sabe que son el mismo. Es la pérdida exacta que PO-01 §3 buscaba evitar.

**P-3 — El criterio de éxito de la V1 queda al azar de la implementación.** APS-02 §9 lo condiciona a que la Biblioteca «evite correctamente los duplicados». Sin definición de duplicado, «correctamente» carece de significado y la decisión la tomará de hecho quien escriba el código — el mecanismo que originó la investigación que PO-01 cerró.

---

# 6. Alternativas Consideradas

## 6.1 Opción A — Identidad por identificador técnico

*El identificador que el repositorio asigna al guardar es la identidad.*

**Ventajas.** Coste nulo. Es el comportamiento actual. Unicidad garantizada por construcción.

**Desventajas.**

- **No resuelve nada.** Un identificador asignado en la escritura es siempre nuevo, luego dos descubrimientos del mismo negocio producen siempre dos identidades. La deduplicación es imposible por definición.
- Confunde identidad con identificador: el identificador *representa* la identidad, no la constituye.

**Evaluación.** Rechazada. Formaliza el defecto que este ADR debe corregir.

## 6.2 Opción B — Identidad por nombre y ubicación

*Dos registros son el mismo negocio si coinciden su nombre y su dirección.*

**Ventajas.** No depende de ninguna fuente externa. Comprensible sin conocimiento técnico.

**Desventajas.**

- **El nombre cambia.** Un negocio que se renombra pasaría a ser otro negocio, duplicándose y perdiendo su historial.
- **La dirección se escribe de muchas formas.** «C/ Mayor 3», «Calle Mayor, 3», «Mayor 3, 1º» designan el mismo lugar y no coinciden textualmente.
- Obliga a construir y mantener reglas de normalización lingüística, que son heurísticas y fallan de forma impredecible.
- Genera **falsos positivos**: dos franquicias homónimas en direcciones parecidas se fusionarían, perdiendo un Lead real.

**Evaluación.** Rechazada como identidad principal. Se conserva como mecanismo **subsidiario** en §7.3, porque es el único disponible cuando no hay referencia de origen.

## 6.3 Opción C — Identidad por sitio web

*El dominio del sitio web identifica al negocio.*

**Ventajas.** Estable para negocios consolidados. Fácil de normalizar.

**Desventajas.**

- **Inaplicable al caso central del producto.** La ausencia de sitio web es la oportunidad comercial más valiosa que AKVEZ detecta (APS-08 §6.5). Una identidad que exige sitio web deja fuera precisamente a los mejores Leads.
- Varios establecimientos de una misma cadena comparten dominio y se fusionarían.
- El dominio cambia con los rediseños y las migraciones.

**Evaluación.** Rechazada. Es incompatible con la propuesta de valor del producto.

## 6.4 Opción D — Identidad por Referencia de Origen *(adoptada)*

*La designación estable que la fuente de descubrimiento asigna al establecimiento constituye la identidad de la Empresa; el par con el usuario constituye la del Lead.*

**Ventajas.**

- **Es estable por diseño.** Sobrevive a cambios de nombre, teléfono, horario, sitio web y reputación, que es exactamente lo que se exige de una identidad.
- **Distingue establecimientos.** Dos sucursales de la misma cadena tienen designaciones distintas, y son negocios distintos.
- **No exige sitio web**, luego funciona para el caso central del producto.
- **No requiere heurística.** La comparación es exacta; no hay falsos positivos por semejanza textual.
- **Está disponible en el momento del descubrimiento**, antes del Registro, que es cuando PO-01 §3 exige la comprobación.

**Desventajas.**

- **Introduce una dependencia de la fuente**, que debe tratarse con cuidado frente a ADR-11 §9, E-6. Se aborda en §7.4 y en el riesgo R-1.
- **No siempre está disponible.** Requiere un mecanismo subsidiario (§7.3).
- Obliga a conservar la referencia de forma permanente, incluso si se cambia de proveedor.

**Evaluación.** Adoptada. Es la única alternativa estable ante los cambios que el negocio real experimenta, y la única aplicable a negocios sin presencia digital.

---

# 7. Decisión — Identidad Natural

## 7.1 Identidad de la Empresa

> **La identidad de una Empresa es su Referencia de Origen: la designación estable que la fuente de descubrimiento asigna al establecimiento concreto.**
>
> Se compone de dos elementos inseparables:
>
> | Elemento | Significado |
> | --- | --- |
> | **Fuente** | La fuente de descubrimiento que emitió la designación |
> | **Designación** | El valor que esa fuente asigna a ese establecimiento |
>
> La Fuente forma parte de la identidad: dos designaciones idénticas emitidas por fuentes distintas **no** son la misma Empresa mientras no se demuestre lo contrario (§9.4).

**Una Empresa es un establecimiento, no una marca.** Lo que se identifica es el negocio físico en un lugar, no la enseña comercial ni la sociedad mercantil que lo explota.

## 7.2 Identidad del Lead

> **La identidad de un Lead es el par formado por la identidad de su Empresa y el usuario a cuyo espacio de trabajo pertenece.**
>
> `Lead ≡ (Referencia de Origen de la Empresa, Usuario)`

**Fundamento.** Se deduce directamente de PO-01, sin añadir nada:

- PO-01 §1: la Empresa «**no pertenece a nadie**. Es información del mercado».
- PO-01 §2: el Lead es una Empresa «incorporada al espacio de trabajo comercial de **un usuario concreto**»; «la Empresa pertenece al mercado; el Lead pertenece a **tu** embudo».

**Consecuencia directa.** Si dos usuarios descubren el mismo negocio, existe **una Empresa y dos Leads**. No son duplicados: son dos relaciones distintas con el mismo hecho del mundo. Cada uno tiene su propio historial, su propia puntuación —que depende del perfil de su usuario, APS-08 §6.6— y su propio estado.

**Corolario.** La deduplicación **siempre opera dentro del espacio de un único usuario**. Nunca entre usuarios. Esto es además coherente con ADR-05 §14: «Un usuario nunca puede acceder a información perteneciente a otro usuario.»

## 7.3 Identidad subsidiaria — Huella de Identidad

> **Cuando el descubrimiento no proporcione Referencia de Origen, la identidad se establecerá provisionalmente mediante una Huella de Identidad**, formada por los atributos más estables disponibles: la denominación del negocio y su localización geográfica.

**Es un mecanismo degradado y expresamente provisional.** Se rige por tres reglas:

**S-1. Es subsidiaria.** Solo se aplica en ausencia de Referencia de Origen. Nunca la sustituye ni prevalece sobre ella.

**S-2. Es reconciliable.** Si más adelante aparece la Referencia de Origen del mismo establecimiento, **prevalece**, y el Lead identificado por huella se reconcilia con ella conservando todo su conocimiento acumulado (§9.5).

**S-3. Ante la duda, no se fusiona.** Si la huella no permite determinar con certeza que dos registros son el mismo establecimiento, **se tratan como Leads distintos**.

**Fundamento de S-3.** Un falso positivo fusiona dos negocios reales y **destruye información**: el usuario pierde un Lead que existía. Un falso negativo produce un duplicado, que es **visible, corregible y reversible**. Ante la asimetría, el dominio prefiere el error recuperable. Es además coherente con PO-01 §8: «Ninguna etapa expulsa.»

## 7.4 La identidad es del dominio, no del proveedor

La Referencia de Origen podría parecer una característica de proveedor propagada al dominio, lo que ADR-11 §9 prohíbe expresamente en **E-6**. No lo es, y conviene precisar por qué.

| Lo que exige el dominio | Lo que aporta el proveedor |
| --- | --- |
| Que toda Empresa tenga una designación **estable** que permita reconocerla entre descubrimientos | El valor concreto de esa designación |

**El dominio no adopta el identificador de un proveedor: exige que exista uno y lo conserva.** Qué fuente lo emita es una cuestión de integración.

**Comprobación mediante el Criterio de Invariancia del Conjunto** (ADR-11 §7.1): si mañana se cambiase de proveedor, ¿cambiaría el conjunto de Leads del usuario? **No.** Los Leads ya registrados conservan su Referencia de Origen histórica y siguen existiendo. Lo que cambia es la fuente de las designaciones futuras, no el contenido de la Biblioteca.

**Regla vinculante.** Ninguna Referencia de Origen se elimina ni se sobrescribe al cambiar de proveedor. Un Lead puede acumular referencias de varias fuentes; todas se conservan (§9.4).

---

# 8. Identidad frente a Atributos

## 8.1 Clasificación oficial

| Categoría | Elementos | ¿Constituye identidad? | ¿Puede cambiar? |
| --- | --- | --- | --- |
| **Identidad** | Referencia de Origen · Usuario | **Sí** | **Nunca** |
| **Descripción** | Nombre · Categoría · Descripción del negocio | No | Sí |
| **Localización** | Dirección · Coordenadas | No *(salvo §10.5)* | Sí, dentro del mismo establecimiento |
| **Contacto** | Teléfono · Correo · Sitio web · Redes sociales | No | Sí |
| **Reputación** | Calificación · Número de reseñas · Antigüedad | No | Sí |
| **Estado** | Estadio del ciclo de vida | No | Sí |
| **Análisis** | Diagnóstico de presencia digital · Carencias detectadas | No | Sí |
| **Opportunity Score** | Puntuación · Banda | No | Sí |
| **Pitch** | Propuesta generada · Tono · Asunto | No | Sí |
| **Contacto comercial** | Interacciones · Descarte · Notas del usuario | No | Sí |
| **Trazabilidad** | Fecha de descubrimiento · Historial | No | **Fecha de descubrimiento: nunca.** Historial: solo crece |

## 8.2 Regla de separación

> **Ninguno de los elementos clasificados como atributo modifica la identidad, cualquiera que sea su valor y cualquiera que sea su cambio.**

Esto alcanza expresamente a **Estado, Análisis, Opportunity Score, Pitch y Contacto**, conforme al alcance §3 de este sprint:

| Elemento | Precisión |
| --- | --- |
| **Estado** | Un Lead Evaluado y un Lead sin analizar pueden ser el mismo Lead. El estadio describe **cuánto sabemos**, no **de quién hablamos** |
| **Análisis** | Analizar añade conocimiento. Un Lead no se convierte en otro por haber sido analizado (PO-01 §8: «Nada se reemplaza») |
| **Opportunity Score** | Es un atributo, no un estadio (PO-01 §5). Su aparición, su ausencia y su modificación son indiferentes a la identidad |
| **Pitch** | Generar una propuesta no altera el sujeto sobre el que se genera |
| **Contacto** | Descartar, recuperar o anotar son decisiones del usuario **sobre** el Lead, no cambios del Lead |

## 8.3 Atributos inmutables

Tres elementos no cambian nunca durante la vida de un Lead:

1. **La Referencia de Origen.** Puede acumular referencias adicionales (§9.4); la original nunca se elimina ni se sustituye.
2. **El usuario propietario.** Un Lead no se transfiere entre espacios de trabajo. La V1 excluye la colaboración multiusuario (APS-02 §7).
3. **La fecha de descubrimiento.** Registra cuándo entró en la Biblioteca. Un redescubrimiento posterior **no la actualiza** (§10.8).

---

# 9. Reglas de Deduplicación

## 9.1 Cuándo dos registros representan la misma Empresa

> **Dos registros representan la misma Empresa cuando comparten Referencia de Origen.**

La comparación es **exacta**. No admite semejanza, aproximación ni umbral de similitud.

## 9.2 Cuándo representan Leads distintos

| Situación | Resultado |
| --- | --- |
| Referencias de Origen distintas | **Leads distintos** |
| Misma Empresa, **usuarios distintos** | **Leads distintos** — una Empresa, dos Leads (§7.2) |
| Misma Empresa, mismo usuario | **El mismo Lead.** No se registra de nuevo |
| Sin Referencia de Origen y huella no concluyente | **Leads distintos** (§7.3, S-3) |

## 9.3 Qué hacer cuando existe información parcial

**Regla D-1. La información incompleta nunca impide el Registro.**

Una Empresa sin teléfono, sin correo, sin sitio web o sin categoría **se registra igualmente**. La ausencia de atributos es información, no un defecto (APS-07 v2.0 §8.4).

**Regla D-2. La ausencia de Referencia de Origen activa la identidad subsidiaria** (§7.3), no el rechazo del registro.

**Regla D-3. Ningún dato faltante puede excluir a una Empresa del Registro.** Hacerlo vulneraría PO-01 §3 y §6, y constituiría una selección encubierta.

## 9.4 Qué hacer cuando aparecen nuevos datos

**Regla D-4 — Los atributos se actualizan; la identidad no.**

Cuando un redescubrimiento aporta valores distintos para atributos ya conocidos, se actualiza el atributo y se registra el cambio en el historial. La identidad permanece.

**Regla D-5 — El conocimiento se acumula, no se sustituye.**

Conforme a PO-01 §8, la actualización de un atributo **no borra** el análisis, la puntuación, la propuesta ni las decisiones previas del usuario. El historial conserva el valor anterior.

**Regla D-6 — Una nueva Referencia de Origen se añade, no reemplaza.**

Si una fuente distinta designa a un establecimiento ya conocido, la nueva referencia **se incorpora** al conjunto de referencias del Lead. La original se conserva. A partir de ese momento, cualquiera de las dos permite reconocerlo.

**Regla D-7 — Un cambio de atributo puede invalidar el análisis, nunca la identidad.**

Si una Empresa que carecía de sitio web pasa a tener uno, el diagnóstico previo queda obsoleto y puede solicitarse uno nuevo. **Sigue siendo el mismo Lead**, con el mismo historial.

## 9.5 Reconciliación

**Regla D-8.** Cuando un Lead identificado por Huella (§7.3) obtiene Referencia de Origen, se reconcilia: adopta la referencia como identidad principal y **conserva íntegramente** su historial, análisis, puntuación, propuestas y decisiones del usuario.

**Regla D-9.** Si la reconciliación revela que dos Leads del mismo usuario eran el mismo establecimiento, se unifican **acumulando** su conocimiento. Ninguna información se descarta y la fecha de descubrimiento conservada es **la más antigua** de las dos.

**Regla D-10.** La unificación por reconciliación **nunca reduce** el conocimiento del usuario. Si no puede unificarse sin perder información, no se unifica.

---

# 10. Casos Límite

Los ocho casos exigidos, resueltos de forma explícita.

## 10.1 La Empresa cambia de teléfono

**Misma identidad.** El teléfono es atributo de contacto (§8.1).

Se actualiza el atributo y se registra el cambio en el historial. El análisis, la puntuación y las propuestas permanecen. Ninguna acción adicional.

## 10.2 La Empresa cambia de correo electrónico

**Misma identidad.** Idéntico tratamiento que §10.1.

## 10.3 La Empresa cambia de sitio web

**Misma identidad.** El sitio web es atributo de contacto, no de identidad — y por eso se descartó la Opción C (§6.3).

**Particularidad.** Es el atributo que el Lead Analyzer examina. Su cambio **invalida el análisis previo** conforme a la regla D-7: el diagnóstico queda obsoleto y puede solicitarse uno nuevo. La puntuación anterior se conserva hasta que se emita una nueva.

**Caso relevante:** una Empresa que no tenía sitio web y ahora lo tiene sigue siendo el mismo Lead, aunque su oportunidad comercial haya cambiado por completo.

## 10.4 La Empresa cambia de nombre

**Misma identidad**, si la Referencia de Origen coincide. Es el caso que la Opción B no habría resuelto (§6.2).

Se actualiza el nombre y **se conserva el anterior en el historial**, de modo que el usuario pueda reconocer el negocio por la denominación que conoció.

**Sin Referencia de Origen:** la Huella de Identidad no reconocerá el establecimiento y se registrará como Lead distinto. Se aplica S-3: se prefiere el duplicado visible a la fusión errónea. Cuando aparezca la referencia, D-9 lo reconciliará.

## 10.5 La Empresa cambia de dirección

**Depende de si cambió el establecimiento o solo su descripción.**

| Situación | Resultado |
| --- | --- |
| La dirección se corrige o se reescribe, y el establecimiento es el mismo | **Misma identidad.** Se actualiza el atributo |
| El negocio **se traslada** a otro local, y la fuente conserva la designación | **Misma identidad.** Manda la Referencia de Origen |
| El negocio se traslada y la fuente emite una designación nueva | **Nueva identidad.** Se registra un Lead nuevo |

**Regla de resolución.** En caso de discrepancia entre la dirección y la Referencia de Origen, **prevalece la Referencia de Origen** (§7.1). La dirección es atributo; la referencia es identidad.

## 10.6 La Empresa abre una nueva sucursal

> **Empresa distinta. Lead distinto.**

Es una consecuencia directa de §7.1: **una Empresa es un establecimiento, no una marca**. Dos sucursales son dos negocios en dos lugares, con reputación, presencia digital y oportunidad comercial propias.

Ninguno de los dos hereda el análisis, la puntuación ni el historial del otro. No se relacionan entre sí: la agrupación por marca o por cadena **no forma parte del dominio de la V1** y no debe inferirse de este documento.

## 10.7 La Empresa cierra

> **La identidad persiste. El Lead permanece en la Biblioteca.**

Es aplicación directa de PO-01 §8: «Ninguna etapa expulsa. Un Lead que entra en la Biblioteca permanece en ella.»

El cierre se registra **como atributo** del Lead y como entrada del historial. No se elimina, no se oculta y no se excluye de las vistas —sin perjuicio de que el usuario pueda filtrarlo voluntariamente, conforme a la regla de filtros reversibles de ADR-11 §8.6 y APS-04 v4.0 §A.9, UI-3.

**Fundamento.** La memoria de que un negocio cerró es conocimiento útil: evita volver a presentarlo como oportunidad nueva. Es exactamente el propósito que PO-01 §3 atribuye al Registro exhaustivo.

## 10.8 La Empresa reaparece meses después

> **Misma identidad. Es el mismo Lead.**

Se reconoce por su Referencia de Origen y **no se registra de nuevo**. Éste es el caso que justifica la existencia de este ADR: sin identidad natural, cada reaparición produciría un Lead nuevo y la Biblioteca dejaría de poder afirmar «esto ya te lo mostré».

**Tratamiento:**

1. Se actualizan los atributos que hayan cambiado, conforme a D-4 y D-5.
2. **La fecha de descubrimiento no se modifica** (§8.3). Registra cuándo entró en la Biblioteca, no la última vez que se vio.
3. Se añade una entrada al historial dejando constancia del redescubrimiento y de su fecha.
4. **Se conserva la decisión previa del usuario.** Si lo había descartado, sigue descartado; el sistema no vuelve a presentarlo como novedad.
5. Si había cerrado y ha reabierto, se actualiza el atributo y **el historial conserva ambos hechos**.

---

# 11. Reglas de Invariancia

## 11.1 Cambios que conservan la identidad

| # | Cambio |
| --- | --- |
| **I-1** | Cualquier cambio en el nombre o la denominación comercial |
| **I-2** | Cualquier cambio en teléfono, correo, sitio web o redes sociales |
| **I-3** | Cualquier cambio en la dirección, mientras la Referencia de Origen se mantenga |
| **I-4** | Cualquier cambio en la categoría o la descripción del negocio |
| **I-5** | Cualquier cambio en la calificación, el número de reseñas o la reputación |
| **I-6** | Cualquier avance, retroceso o estancamiento en el ciclo de vida |
| **I-7** | La aparición, ausencia, modificación o recálculo del Opportunity Score y de su banda |
| **I-8** | La emisión, regeneración o edición de una propuesta comercial |
| **I-9** | El descarte por el usuario y su posterior recuperación |
| **I-10** | El cierre de la Empresa y su eventual reapertura |
| **I-11** | La incorporación de una Referencia de Origen adicional (D-6) |
| **I-12** | La reconciliación de una Huella de Identidad con su Referencia de Origen (D-8) |

## 11.2 Cambios que crean una nueva identidad

| # | Cambio |
| --- | --- |
| **N-1** | Una **Referencia de Origen distinta**, correspondiente a un establecimiento distinto |
| **N-2** | Un **usuario distinto**. Misma Empresa, Lead nuevo (§7.2) |
| **N-3** | Un **establecimiento nuevo** de la misma marca: sucursal, franquicia o local adicional (§10.6) |

## 11.3 Regla de cierre

> **Solo tres cambios crean identidad nueva. Todo lo demás la conserva.**
>
> Ante la duda sobre si un cambio crea identidad nueva, **la respuesta por defecto es que no la crea**, salvo que encaje exactamente en N-1, N-2 o N-3.

**Fundamento.** Crear una identidad nueva cuando debía conservarse produce un duplicado —visible y corregible—. Conservarla cuando debía crearse fusiona dos negocios reales y **destruye información** de forma que el usuario no puede advertir. La misma asimetría que fundamenta S-3.

---

# 12. Persistencia Conceptual

**Sin diseñar base de datos, sin decidir índices y sin decidir motores.** Esta sección enuncia únicamente qué debe permanecer estable durante toda la vida del Lead.

## 12.1 Qué debe permanecer estable

| # | Elemento | Exigencia |
| --- | --- | --- |
| **E-1** | **La Referencia de Origen** | Se conserva íntegra e inalterada durante toda la vida del Lead. Puede acumular referencias adicionales; ninguna se elimina ni se sobrescribe |
| **E-2** | **El usuario propietario** | No cambia nunca. No existe transferencia entre espacios de trabajo en la V1 |
| **E-3** | **El identificador interno** | Una vez asignado a un Lead, **no se reasigna, no se reutiliza y no se regenera**, aunque cambien todos sus atributos |
| **E-4** | **La fecha de descubrimiento** | Registra la entrada en la Biblioteca. No se actualiza en los redescubrimientos |
| **E-5** | **El historial** | Solo crece. Ninguna entrada se elimina ni se modifica retroactivamente |

## 12.2 Regla de unicidad

> **Dentro del espacio de un mismo usuario, no podrán coexistir dos Leads que compartan Referencia de Origen.**

Es la formulación conceptual del criterio de éxito de APS-02 v2.1 §9. **Cómo se garantice es materia de decisiones posteriores** y queda expresamente fuera del alcance de este ADR (§3.2).

## 12.3 Regla de correspondencia

> **El identificador interno representa la identidad; no la constituye.**

Un identificador técnico puede cambiar de formato, de longitud o de mecanismo de generación sin que la identidad del Lead se vea afectada, siempre que la correspondencia con su Referencia de Origen se conserve. Es la aplicación de ADR-11 §7.2: la implementación sirve al dominio y no al revés.

---

# 13. Consecuencias

## 13.1 Positivas

- **La comprobación del Registro pasa a ser ejecutable.** PO-01 §3 puede cumplirse: existe un criterio objetivo de «ya estaba presente».
- **La memoria comercial se vuelve fiable.** La Biblioteca puede afirmar «esto ya te lo mostré», «esto lo descartaste» y «esto lo contactaste», que es su función según APS-07 v2.0 §8.2.
- **El criterio de éxito de la V1 deja de depender de la implementación.** «Evitar correctamente los duplicados» adquiere significado verificable.
- **El conocimiento acumulado deja de fragmentarse.** El análisis, la puntuación y las decisiones del usuario se acumulan sobre un sujeto único a lo largo del tiempo.
- **Un negocio que cambia sigue siendo el mismo negocio.** Cambiar de nombre, de teléfono o de web ya no cuesta al usuario su historial.
- **La decisión es aditiva.** No modifica ninguna decisión arquitectónica vigente: ADR-01, ADR-05, ADR-08, ADR-09 y ADR-11 permanecen íntegros.

## 13.2 Negativas

- **Se introduce una dependencia de la fuente de descubrimiento.** Mitigada en §7.4 y acotada por la regla de conservación permanente de referencias, pero real. Es el coste consciente de la decisión.
- **La identidad subsidiaria es imperfecta por construcción.** Los Leads identificados por huella producirán duplicados en escenarios de cambio de nombre (§10.4). Es una consecuencia deliberada de S-3, no un defecto a corregir.
- **Se exige conservar información que la implementación actual no captura.** El modelo vigente carece de Referencia de Origen (§4.3); incorporarla es trabajo de la Fase 5.
- **Los Leads ya existentes carecen de identidad natural.** Requerirán reconciliación por huella, con las limitaciones de §7.3.
- **La agrupación por marca queda sin resolver.** §10.6 la excluye expresamente del dominio de la V1. Si el producto la necesita más adelante, exigirá una decisión nueva.

---

# 14. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **Sustitución del proveedor de descubrimiento.** Las designaciones futuras dejarían de corresponder con las históricas, rompiendo la continuidad de la deduplicación | **Alta** | §7.4 y D-6: las referencias históricas se conservan y un Lead puede acumular varias. La Huella de Identidad actúa de puente durante la transición |
| **R-2** | **Fusión errónea de dos negocios reales.** Destruye información sin que el usuario pueda advertirlo | **Alta** | S-3 y §11.3: ante la duda, no se fusiona. El dominio prefiere el duplicado visible |
| **R-3** | **La implementación asigna identidad en la escritura**, como hoy (§4.3), y la deduplicación no llega a funcionar | **Alta** | §12.3: el identificador interno representa la identidad, no la constituye. La comprobación debe preceder al Registro |
| **R-4** | **La fuente no proporciona designación estable** para una porción significativa de los descubrimientos, y la identidad subsidiaria pasa a ser el caso normal en lugar de la excepción | Media | Debe medirse durante la implementación. Si la proporción es alta, la Huella de Identidad requerirá una decisión propia |
| **R-5** | **Los redescubrimientos actualizan la fecha de descubrimiento**, y la Biblioteca pierde la noción de cuándo conoció cada negocio | Media | E-4 y §10.8, punto 2 |
| **R-6** | **La actualización de atributos sobrescribe el conocimiento previo**, en contra de PO-01 §8 | Media | D-5 y E-5: el historial conserva los valores anteriores |
| **R-7** | **La ausencia de datos se interpreta como impedimento para registrar**, reintroduciendo una selección encubierta | Media | D-1 y D-3 |

---

# 15. Dependencias

**Depende de:**

- **PO-01** §1, §2, §3, §5, §8. Autoridad funcional del dominio. Fundamento de §7.1, §7.2 y §11.
- **APS-07 v2.0** §7.2, §8.1, §8.2, §8.4. Contenido de la Biblioteca y opcionalidad de atributos.
- **APS-02 v2.1** §9, §10, FR-008. Criterio de éxito de la V1 y fuente de descubrimiento.
- **APS-03 v3.0** §7.1, §8.1. El Registro y la deduplicación son responsabilidad del Lead Hunter.
- **APS-08 v1.1** §6.6. El Opportunity Score depende del perfil del usuario, lo que fundamenta §7.2.
- **ADR-11** §7.1, §7.2, §9 (E-6). Criterio de Invariancia y frontera dominio/implementación.
- **ADR-05 v1.3** §10, §14. Modelo conceptual y aislamiento entre usuarios.
- **ADR-03** §88. Google Places como proveedor de descubrimiento.
- **ADS-00 v1.2**. Jerarquía documental y terminología.

**Condiciona a:**

- La **Estrategia de Escritura del repositorio**, prevista en ADR-10 §11.4 punto 2, que depende íntegramente de esta decisión.
- El **ADR de Motor de Persistencia** (deuda **DC-2** de AR-02), que deberá garantizar la regla de unicidad de §12.2.
- La implementación del caso de uso de descubrimiento y del adaptador de persistencia, enumerados en PO-01 §9.3.

**No afecta a:** ADR-01, ADR-02, ADR-04, ADR-06, ADR-07, ADR-08 ni ADR-09, cuyas reglas permanecen íntegras.

---

# 16. Glosario

| Término | Definición |
| --- | --- |
| **Identidad natural** | Conjunto de atributos que determinan que dos registros representan el mismo sujeto del mundo real, con independencia del identificador que el sistema les asigne |
| **Referencia de Origen** | Designación estable que una fuente de descubrimiento asigna a un establecimiento concreto. Compuesta por Fuente y Designación. Constituye la identidad de la Empresa (§7.1) |
| **Fuente** | Origen del descubrimiento que emitió una Referencia de Origen |
| **Huella de Identidad** | Mecanismo subsidiario de identificación, basado en denominación y localización, aplicable solo en ausencia de Referencia de Origen (§7.3) |
| **Reconciliación** | Operación por la que un Lead identificado por Huella adopta su Referencia de Origen conservando todo su conocimiento acumulado (§9.5) |
| **Identificador interno** | Valor que el sistema asigna para referirse a un Lead. **Representa** la identidad; no la constituye (§12.3) |
| **Establecimiento** | Negocio físico en un lugar concreto. Unidad de identidad de la Empresa. No debe confundirse con la marca ni con la sociedad mercantil (§7.1, §10.6) |
| **Atributo** | Todo dato de un Lead que no forma parte de su identidad. Puede cambiar sin alterarla (§8) |

---

# 17. Referencias

- **PO-01** — Decisión de Producto: Definición Canónica de Lead, §1, §2, §3, §5, §8.
- **APS-02 v2.1** — Product Scope, §7, §9, §10, FR-008.
- **APS-03 v3.0** — Agent Architecture, §7.1, §8.1, §8.2.
- **APS-04 v4.0** — Human Interface System, §A.9 (UI-3).
- **APS-07 v2.0** — Data & Knowledge Architecture, §7.2, §8.1, §8.2, §8.4.
- **APS-08 v1.1** — Opportunity Scoring Framework, §6.5, §6.6.
- **ADS-00 v1.2** — Documentation Standard.
- **ADR-03** — Integraciones Externas y Proveedores, §88.
- **ADR-05 v1.3** — Persistence Architecture & Data Layer, §10, §14.
- **ADR-10** — Ubicación de la Persistencia *(Archived)*, §11.4, punto 1.
- **ADR-10A v2.0** — Definición Canónica de Empresa y Lead, §9, punto 6.
- **ADR-11** — Frontera entre Dominio e Implementación, §7.1, §7.2, §8.6, §9.
- **AR-02** — Blueprint Readiness Assessment, §4.1 (DC-3), §5.2.

---

# 18. Definition of Done

Este ADR podrá considerarse completo cuando el Product Office:

1. **Ratifique la identidad de la Empresa** como Referencia de Origen (§7.1), y la del Lead como el par con el usuario (§7.2).
2. **Apruebe la Huella de Identidad como mecanismo subsidiario** y, en particular, la regla **S-3**: ante la duda, no se fusiona.
3. **Confirme la resolución del caso §10.6** — una sucursal es una Empresa distinta— y que la agrupación por marca queda fuera del dominio de la V1.
4. **Valide las tres reglas de invariancia de §11.2** como lista cerrada de supuestos que crean identidad nueva.
5. **Determine cuándo se mide el riesgo R-4**, es decir, qué proporción de descubrimientos carece de Referencia de Origen.

Hasta que los cinco puntos se cumplan, este documento permanece en estado **`Draft`** y no habilita ninguna implementación.

---

> ## ✅ Definition of Done — cerrada (v1.1, 2026-07-29)
>
> **Los cinco puntos quedaron cumplidos en el sprint GOV-01.** La condición de permanencia en `Draft` dejó de tener efecto y el documento **habilita implementación**.
>
> | # | Condición | Cumplimiento |
> | --- | --- | --- |
> | 1 | Ratificación de la identidad de Empresa (§7.1) y de Lead (§7.2) | **Cumplida.** La identidad del Lead es el par (Referencia de Origen, Usuario) |
> | 2 | Aprobación de la Huella de Identidad y de la regla **S-3** | **Cumplida.** Ante la duda, no se fusiona |
> | 3 | Confirmación del caso §10.6 — una sucursal es Empresa distinta | **Cumplida.** La agrupación por marca queda fuera del dominio de la V1 |
> | 4 | Validación de las tres reglas de §11.2 como lista cerrada | **Cumplida.** Solo tres supuestos crean identidad nueva |
> | 5 | Determinación del momento de medición del riesgo **R-4** | **Cumplida — mediante asignación a DEV-01.** Exige datos reales de la fuente; no es verificable sobre el diseño |
>
> **Autoridad:** AKVEZ Product Office, pronunciamiento del 2026-07-29.
>
> **Ningún contenido técnico fue modificado durante la ratificación.**
>
> **Efecto sobre DC-3.** La deuda crítica **DC-3** de AR-02 §4.1 queda cerrada por completo, en sustancia y en forma.
