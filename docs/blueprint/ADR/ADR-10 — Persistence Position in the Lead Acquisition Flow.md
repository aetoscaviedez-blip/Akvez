# ADR-10 — Ubicación de la Persistencia en el Flujo de Adquisición de Leads

| Campo | Valor |
| --- | --- |
| Código | ADR-10 |
| Clasificación | Architecture Decision Record |
| Versión | 1.2 |
| Estado | **Archived** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 |
| Autoridad vigente sobre esta materia | **PO-01** (Approved) · APS-07 v2.0 · APS-03 v3.0 |

---

> # ⚠ Documento archivado
>
> **Este ADR fue archivado tras la aprobación de PO-01.**
>
> **Se conserva exclusivamente con fines históricos y de trazabilidad.** Las decisiones normativas que contiene fueron reemplazadas por PO-01 y por la consolidación posterior del Blueprint (PLAN-01).
>
> **No debe citarse como fundamento de ninguna decisión vigente.** En particular, la recomendación de §10 y las conclusiones de §1 y §11 **no representan la posición actual de AKVEZ**.
>
> **Autoridad vigente:**
>
> | Materia | Documento vigente |
> | --- | --- |
> | Definición de Empresa, Lead y Biblioteca de Leads | PO-01 §1-§4 · APS-07 v2.0 §5, §8 |
> | Posición y alcance del Registro | PO-01 §3 · APS-07 v2.0 §7 · APS-03 v3.0 §8.1 |
> | Responsabilidades de los agentes | APS-03 v3.0 §7 |
> | Tensiones T1 y T2 (§7 de este documento) | **Resueltas.** APS-07 v2.0 §7.1 y §6.3 |
>
> **Qué conserva valor.** El planteamiento del problema (§4, §5), el marco conceptual vigente en su momento (§6), la identificación de las tensiones T1 y T2 (§7), el análisis comparativo de las cuatro alternativas (§8) y la matriz de impacto arquitectónico (§9) siguen siendo un registro fiel del razonamiento que hizo necesaria una decisión de Product Office.
>
> **Ninguna sección ha sido eliminada, reescrita ni renumerada.**

---

> ## ⚠ Nota de excepción — Transición de estado no contemplada
>
> **Este archivado se ejecutó mediante una transición de estado que el Blueprint no contempla.**
>
> **La limitación.** `AF-01-DIAG-001` (*Estados del documento*, v0.1) define el ciclo de vida documental como:
>
> ```
> [*] → Draft → Review → Approved → { Deprecated, Archived }
>                                     Deprecated → Archived
> ```
>
> **No existe ninguna transición `Draft → Archived`.** ADR-10 se encontraba en estado `Draft` en el momento de su archivado, por lo que la transición ejecutada carece de cobertura en el diagrama de estados vigente.
>
> **Naturaleza de la decisión.** El archivado de ADR-10 fue una **decisión excepcional del Product Office**, adoptada el 2026-07-29 con conocimiento expreso de esta limitación y con la instrucción explícita de no modificar AF-01 en esta fase.
>
> **No constituye precedente.** Esta excepción **no autoriza** ninguna transición `Draft → Archived` en otros documentos del Blueprint, y en particular no se extiende a ADR-10A ni a ADR-11, que se encuentran en situación análoga. Cada caso requerirá decisión expresa del Product Office **hasta que AF-01 sea revisado**.
>
> ### Deuda arquitectónica registrada
>
> | # | Deuda | Documento afectado | Severidad | Resolución prevista |
> | --- | --- | --- | --- | --- |
> | **DT-01** | El ciclo de vida documental de `AF-01-DIAG-001` no contempla la retirada de documentos que nunca alcanzaron el estado `Approved`. Obliga a resolver caso por caso mediante excepción del Product Office | AF-01 *(no modificado)* · ADS-00 *(Estados del Documento)* | **Media** | Revisión de AF-01 y de su diagrama de estados, con incremento de versión conforme a ADS-00 (*Diagramas*). **Pendiente de planificación.** Afecta a ADR-10A y ADR-11 |
>
> Conforme a ADS-00 **R-6**, un conflicto con AF no se resuelve por precedencia. La deuda queda registrada y elevada; su resolución corresponde al Product Office.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | Architecture Team | Creación inicial. Define en qué punto del flujo de adquisición debe ocurrir la persistencia de un Lead, y documenta dos tensiones internas del Blueprint detectadas durante el análisis. | La auditoría de persistencia (hallazgo H-04) determinó que el flujo almacena todos los negocios descubiertos y entrega únicamente una selección. Corregirlo exige decidir primero qué representa el repositorio, decisión que ningún documento vigente resuelve de forma inequívoca. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Cambio de estado documental: `Draft` → `Archived`.** Se añade la nota de archivo al inicio del documento y se actualizan las referencias cruzadas de §13 y §16. **No se modifica ningún contenido histórico:** no se elimina ninguna sección, no se reescribe ningún razonamiento, no se altera ninguna alternativa, fecha ni numeración. | Fase 2 de PLAN-01. La materia que este ADR resolvía quedó decidida por **PO-01** §3 y §4, cuya autoridad de dominio prevalece conforme a ADS-00 (*Jerarquía Documental*). El documento deja de ser normativo y pasa a registro histórico, conforme al estado `Archived` de ADS-00: «Documento conservado únicamente con fines históricos». |
| 1.2 | 2026-07-29 | AKVEZ Product Office | **Adición de dos notas editoriales.** *Nota de excepción* tras la nota de archivo, que declara la transición `Draft → Archived` como excepción sin valor de precedente y registra la deuda arquitectónica **DT-01**. *Nota editorial* inmediatamente antes de §17, que declara sin efecto la condición de permanencia en `Draft`. **Ningún contenido original modificado.** | Corrección documental P1.1. Cierra las inconsistencias **C-2** (transición no contemplada por `AF-01-DIAG-001`) y **C-4** (contradicción entre §17 y la portada) sin modificar AF-01 ni el razonamiento histórico del documento. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Marco Conceptual del Blueprint
7. Tensiones Detectadas en el Blueprint
8. Alternativas Consideradas
9. Impacto Arquitectónico
10. Decisión Recomendada
11. Consecuencias
12. Riesgos
13. Dependencias y ADRs Afectados
14. ADRs Futuros Necesarios
15. Glosario
16. Referencias
17. Definition of Done

> **Secciones omitidas:** «Diagramas» extensos y «Anexos». Este documento resuelve una única pregunta arquitectónica y su omisión está justificada por ADS-00 (*Estructura Obligatoria*).

---

# 1. Resumen Ejecutivo

El flujo de adquisición de leads almacena **todos** los negocios que descubre y entrega al usuario únicamente una selección de los mejores. Como consecuencia, entre el 85 % y el 90 % de los registros almacenados no se devuelven, no se analizan y ningún componente del sistema los consulta.

El análisis determinó que esto **no es un defecto de implementación**. Es la consecuencia de una decisión que nunca se tomó explícitamente: *¿qué representa el repositorio de Leads — todo lo que el sistema encontró, o aquello que el sistema consideró una oportunidad comercial?*

Ambas respuestas son defendibles. El Blueprint contiene evidencia a favor de cada una, en documentos distintos y aprobados. Este ADR compara las alternativas, documenta las tensiones detectadas y recomienda una posición.

La recomendación es **persistir después de la selección y antes del análisis**, porque es la única posición en la que el contenido del repositorio coincide con la definición de *Lead* que establece APS-07 §5.

---

# 2. Objetivo

Responder exclusivamente a la pregunta:

> **¿En qué punto del flujo de adquisición debe ocurrir la persistencia de un Lead?**

---

# 3. Alcance

## Incluye

- La posición de la persistencia dentro del flujo de adquisición.
- El significado del contenido del repositorio de Leads.
- El impacto de cada alternativa sobre los componentes del flujo.

## No incluye

Este ADR **no** aborda, y ninguna de sus conclusiones debe interpretarse como una decisión sobre:

- Motores de base de datos concretos o su modelado físico.
- Índices, claves, restricciones o esquemas.
- Idempotencia de las operaciones de escritura.
- Rendimiento, volumen, concurrencia o coste de almacenamiento.
- Estrategia de deduplicación entre búsquedas sucesivas.
- Multiusuario, propiedad de datos o retención.

Todo lo anterior pertenece a ADRs posteriores (§14) y **depende** de la decisión que aquí se tome, no al revés.

---

# 4. Contexto

## 4.1 El flujo actual

```
Google Places
      ↓
Deduplicación
      ↓
PERSISTENCIA          ← todos los negocios descubiertos
      ↓
Puntuación y selección
      ↓
Análisis
      ↓
Respuesta HTTP        ← únicamente la selección
```

## 4.2 Dónde aparece el Lead

Un negocio entra al sistema cuando Google Places lo devuelve. En ese momento es un conjunto de datos públicos: nombre, sitio web, teléfono, enlace de mapa, calificación y número de reseñas. Tras la deduplicación, el flujo lo convierte en la entidad de dominio **Lead** y le asigna el estado inicial `Prospect`.

La entidad de dominio se define en el código como *«un negocio descubierto, antes de cualquier análisis de oportunidad»*. Es decir: hoy, ser un Lead equivale a haber sido encontrado.

## 4.3 Dónde se persiste

Inmediatamente después de la deduplicación y **antes** de cualquier evaluación. La capa de persistencia asigna el identificador y los metadatos técnicos, y devuelve la entidad identificada. Una búsqueda típica almacena en este punto del orden de setenta registros.

## 4.4 Dónde se selecciona y dónde se analiza

Ambas operaciones ocurren **dentro del mismo caso de uso** del Lead Analyzer. Ese caso de uso puntúa todos los negocios recibidos, ordena por puntuación, recorta a los diez mejores y solo entonces solicita el análisis de consultoría.

La selección no es hoy un paso visible del flujo: es un efecto interno del análisis. **Ningún otro componente del sistema puede saber qué negocios serán seleccionados.**

## 4.5 Dónde se responde

La ruta de búsqueda devuelve únicamente los leads analizados. Los negocios descubiertos que no superaron la selección no aparecen en la respuesta, y no existe ningún endpoint que permita recuperarlos posteriormente.

---

# 5. Problema

La ambigüedad no está en el número de registros almacenados. Está en **qué significa el repositorio**.

Dos lecturas coherentes y mutuamente incompatibles conviven hoy en el sistema:

**Lectura 1 — El repositorio es un registro del descubrimiento.** Almacena todo lo que el sistema encontró. Su valor es la trazabilidad: permite responder «¿por qué no me mostraste este negocio?» y constituye la memoria del territorio explorado. Bajo esta lectura, los setenta registros son correctos y no existe ningún problema.

**Lectura 2 — El repositorio es un registro de oportunidades comerciales.** Almacena aquello que el sistema juzgó digno de perseguir. Su valor es operativo: alimenta el embudo comercial. Bajo esta lectura, sesenta de esos setenta registros no deberían existir.

El sistema **no ha elegido** entre ambas. Actúa según la Lectura 1 en la escritura, pero modela según la Lectura 2 en la entidad: el Lead almacenado incluye un campo de estado con un ciclo de vida comercial completo — *Prospect, Audited, Pitched, Replied, Won, Stale* — que la inmensa mayoría de los registros no podrá recorrer jamás, porque nunca fueron entregados a nadie.

Esa contradicción entre lo que se escribe y lo que se modela es la ambigüedad arquitectónica que este ADR debe cerrar. Mientras persista, cualquier decisión posterior sobre el repositorio se tomará sobre una definición inestable.

---

# 6. Marco Conceptual del Blueprint

APS-07 (*Data & Knowledge Architecture*, Approved) resulta directamente aplicable y aporta tres definiciones decisivas.

**§5 — Activos de Información.** Distingue explícitamente dos activos:

| Activo | Definición literal |
| --- | --- |
| **Empresas** | «Información pública sobre negocios.» |
| **Leads** | «Empresas **identificadas como oportunidades comerciales**.» |

Un Lead no es, según el Blueprint, un negocio encontrado. Es un negocio **calificado**.

**§6 — Modelo Conceptual de Datos.** Establece una progresión de estados:

```
Empresa → Lead → Lead Analizado → Opportunity Score → Pitch → Cliente Potencial → Cliente Confirmado
```

con la regla: *«Cada transición agregará nuevo conocimiento sin reemplazar la información anterior.»* Empresa y Lead son **estadios distintos**, no sinónimos.

**§7 — Ciclo de Vida de un Lead.** Enumera las etapas: Descubrimiento → **Registro** → Análisis → Evaluación → Propuesta, y describe el Registro como *«La empresa se almacena en la Biblioteca de Leads.»*

A esto se suma **ADR-02 §8** (*Modelo de Ejecución*, Approved), que sitúa `Scoring` como bloque propio entre Lead Hunter y Pitch Generator, y afirma: *«Cada bloque representa una capacidad independiente.»*

---

# 7. Tensiones Detectadas en el Blueprint

El análisis reveló dos inconsistencias internas del Blueprint. Se documentan aquí porque condicionan la decisión y porque su resolución definitiva excede la autoridad de este ADR.

## T1 — APS-07 §5 y §7 no coinciden sobre qué se almacena

§5 define Lead como una empresa **ya identificada como oportunidad comercial**. §7 sitúa el Registro **inmediatamente después del Descubrimiento**, antes del Análisis y de la Evaluación — es decir, antes de que exista identificación alguna de oportunidad.

Si se sigue §7 al pie de la letra, la «Biblioteca de Leads» contiene empresas no calificadas, lo que contradice la definición de §5.

**Interpretación propuesta:** §5 es una definición normativa; §7 es una descripción narrativa del recorrido. En caso de conflicto, la definición prevalece sobre la narración. Bajo esta interpretación, el «Registro» de §7 corresponde al almacenamiento de la **Empresa**, y la Biblioteca de Leads recibe la entidad solo tras la transición `Empresa → Lead` de §6.

Esta interpretación requiere confirmación del equipo de arquitectura.

## T2 — APS-07 §7 y ADR-02 §8 no coinciden sobre cuándo se puntúa

APS-07 §7 coloca la Evaluación (Opportunity Score) **después** del Análisis. ADR-02 §8 coloca `Scoring` **inmediatamente después** de Lead Hunter, antes de las capacidades posteriores. La implementación actual sigue el orden de ADR-02: puntúa antes de analizar.

Esta tensión es relevante porque, si la puntuación precede al análisis, existe un punto del flujo en el que un negocio ya está calificado pero todavía no analizado — precisamente el punto que la alternativa recomendada requiere.

---

# 8. Alternativas Consideradas

## 8.1 Opción A — Persistir inmediatamente después del descubrimiento

*Formaliza el comportamiento actual como decisión consciente.*

**Responsabilidades.** El caso de uso de descubrimiento asume tres cometidos: consultar las fuentes, deduplicar y almacenar. El repositorio pasa a significar «memoria de todo lo explorado». La capacidad de selección permanece invisible dentro del análisis.

**Ventajas.**

- Conserva la trazabilidad completa del territorio explorado. Es la única alternativa que permite responder por qué un negocio concreto no fue mostrado.
- Es coherente con la lectura literal de APS-07 §7 (Registro inmediatamente posterior al Descubrimiento).
- Es coherente con la definición actual de la entidad de dominio, que describe el Lead como un negocio descubierto y aún no analizado.
- No exige mover ninguna responsabilidad ni modificar ningún contrato. Riesgo de ejecución nulo.

**Desventajas.**

- Contradice la definición normativa de APS-07 §5: almacena empresas no calificadas bajo el nombre de Lead.
- El repositorio conserva un ciclo de vida comercial que la mayoría de sus registros no puede recorrer, lo que hace que el campo de estado carezca de significado para ellos.
- Conflagra en un solo modelo dos activos que el Blueprint define por separado (Empresas y Leads), impidiendo que cualquiera de los dos evolucione con su propia semántica.
- Mantiene la selección como efecto interno del análisis, en contra de ADR-02 §8.

## 8.2 Opción B — Persistir solamente después del análisis

**Responsabilidades.** El descubrimiento se limita a consultar y deduplicar. El almacenamiento se desplaza al final del flujo, tras la generación del análisis de consultoría. El repositorio pasa a significar «lo que efectivamente se entregó al usuario».

**Ventajas.**

- Garantiza por construcción que todo registro almacenado fue entregado. Elimina por completo los registros no utilizados.
- Otorga al descubrimiento una responsabilidad única.

**Desventajas.**

- **Invierte la dirección del modelado.** La salida del Lead Analyzer no es un Lead: es una vista de consultoría sobre un Lead, construida para su presentación al usuario. Derivar la entidad de dominio a partir de esa vista significa reconstruir el modelo desde su representación, lo que contradice el sentido de las capas establecido por ADR-01 y ADR-05.
- **Pierde fidelidad de datos.** El análisis sustituye valores ausentes por textos destinados a la interfaz. Un negocio sin sitio web y sin teléfono deja de tener campos vacíos y pasa a tener frases explicativas. Persistir desde esa salida almacenaría prosa donde el contrato de persistencia espera datos.
- **Colapsa dos estadios que APS-07 §6 define como distintos.** El estadio *Lead* nunca quedaría registrado: se saltaría directamente a *Lead Analizado*, incumpliendo la regla de que cada transición agrega conocimiento sin reemplazar el anterior.
- **Desplaza el momento de asignación del identificador.** Al no existir identidad de almacenamiento durante el análisis, la correspondencia entre cada análisis y su identificador debe reconstruirse mediante un mecanismo que hoy no existe.
- Es la única alternativa que **deshace** trabajo ya aprobado y verificado sobre la propagación del identificador.

## 8.3 Opción C — Persistir ambos estadios mediante modelos distintos

*Un activo Empresa para todo lo descubierto; un activo Lead para lo calificado.*

**Responsabilidades.** El descubrimiento almacena Empresas. La capacidad de selección promueve algunas Empresas a Leads y las almacena como tales. El análisis opera sobre Leads. Cada activo tiene su propio modelo, su propio ciclo de vida y su propio contrato de persistencia.

**Ventajas.**

- **Es la alternativa que reproduce con mayor fidelidad el Blueprint.** APS-07 §5 ya define ambos activos y §6 ya define la transición entre ellos. No introduce ningún concepto nuevo: implementa uno existente.
- Resuelve la tensión T1 sin necesidad de interpretar: §7 describe el registro de la Empresa; §5 define el Lead.
- Conserva la trazabilidad completa del descubrimiento (ventaja de A) **y** un repositorio de Leads semánticamente limpio (ventaja de B), sin los inconvenientes de ninguna.
- Cada activo puede evolucionar de forma independiente.

**Desventajas.**

- Duplica la superficie de persistencia: dos modelos, dos contratos, dos repositorios que mantener y verificar.
- **Introduce un activo que ningún caso de uso consume hoy.** Ninguna funcionalidad actual ni prevista para el corto plazo requiere consultar Empresas descubiertas y no seleccionadas.
- Es la alternativa de mayor coste de construcción y la que más amplía la superficie del sistema, para resolver un problema sin manifestación observable.
- Exige definir el ciclo de vida del activo Empresa, que el Blueprint enuncia pero no detalla.

**Evaluación.** C no es incorrecta; es **prematura**. Su justificación no depende de este ADR, sino de que aparezca un consumidor del activo Empresa.

## 8.4 Opción D — Persistir después de la selección y antes del análisis

*Alternativa no incluida en el encargo original; se añade porque constituye un punto real y distinto del flujo, y porque el análisis la identificó como la posición que satisface la definición normativa del Blueprint con un solo modelo.*

**Responsabilidades.** El descubrimiento consulta y deduplica. La selección — hoy oculta dentro del análisis — pasa a ser un paso visible del flujo, conforme al bloque `Scoring` de ADR-02 §8. La persistencia almacena únicamente los negocios calificados. El análisis opera sobre entidades ya almacenadas e identificadas.

**Ventajas.**

- **El contenido del repositorio coincide exactamente con la definición de APS-07 §5:** empresas identificadas como oportunidades comerciales. Ni más, ni menos.
- **Persiste el estadio correcto.** Almacena el Lead como Lead, antes de que el análisis lo transforme en su representación de consultoría. No hay inversión de modelado ni pérdida de fidelidad de datos.
- **Preserva el orden actual de identidad.** Como la persistencia sigue precediendo al análisis, el identificador continúa asignándose antes de que el Lead recorra el resto del flujo. No requiere mecanismo alguno de reconstrucción.
- Materializa el bloque `Scoring` que ADR-02 §8 declara capacidad independiente y al que APS-08 dedica un framework completo sin contrapartida en la implementación.
- Otorga responsabilidad única a cada caso de uso del flujo.

**Desventajas.**

- **Renuncia a la trazabilidad del descubrimiento.** Los negocios no seleccionados dejan de existir para el sistema; deja de ser posible explicar por qué un negocio no fue mostrado.
- Exige convertir la selección en un paso explícito del flujo, lo que afecta a la superficie pública de dos módulos y a la coordinación del proceso.
- Deja sin implementar el activo Empresa de APS-07 §5, que permanecería como concepto sin representación.

---

# 9. Impacto Arquitectónico

| Componente | Opción A | Opción B | Opción C | Opción D |
| --- | --- | --- | --- | --- |
| **Lead Repository** | Significa «todo lo descubierto». Contradice APS-07 §5 | Significa «lo entregado». Colapsa dos estadios de §6 | Se desdobla en dos repositorios con semánticas propias | Significa «lo calificado». Coincide con APS-07 §5 |
| **Lead Analyzer** | Sin cambios. Conserva selección y análisis fusionados | Su salida pasa a alimentar la persistencia: acoplamiento nuevo entre módulos | Cede la selección; opera solo sobre Leads | Cede la selección; opera solo sobre Leads |
| **Orchestrator** | Sin cambios. Coordina dos pasos | Coordina tres pasos y debe reasociar identidades | Coordina cuatro pasos y dos activos | Coordina tres pasos, sin manipular datos |
| **Search Route** | Sin cambios | Debe recibir la identidad por una vía distinta de la actual | Sin cambios | Sin cambios |
| **Contratos** | Ninguno se altera | Cambia la superficie pública del Lead Analyzer | Nuevo contrato de persistencia para Empresa | Cambia la superficie pública de dos módulos; ningún contrato público de API |
| **Futuras bases de datos** | Almacenarán un conjunto cuyo significado no está definido | Almacenarán vistas de presentación en lugar de entidades | Modelo de datos alineado con APS-07, a costa de dos estructuras | Modelo de datos con un significado unívoco y estable |
| **Métricas (APS-06)** | Permite medir cobertura de mercado; impide medir tasa de calificación | Impide ambas: solo conoce lo entregado | Permite medir ambas: cobertura y tasa de conversión Empresa→Lead | Permite medir calificación; impide medir cobertura de mercado |
| **Observabilidad** | Sin efecto. Las métricas de ejecución ya distinguen descubierto de entregado | El reporte perdería el punto de escritura previo al análisis | Requiere distinguir dos escrituras en el reporte | Sin efecto. El reporte ya registra descubrimiento, deduplicación y persistencia por separado |

Ninguna de las alternativas modifica los contratos públicos de la API ni el comportamiento observable por el usuario final. La decisión es interna al sistema.

---

# 10. Decisión Recomendada

**Se recomienda la Opción D: persistir después de la selección y antes del análisis.**

## 10.1 Por qué respeta mejor DDD

Un repositorio, en el modelado por dominio, materializa la colección de una entidad. Su contenido debe ser exactamente el conjunto que la definición de esa entidad describe. Hoy no lo es: el repositorio de Leads contiene mayoritariamente negocios que el Blueprint no considera Leads.

La Opción D restablece esa correspondencia sin redefinir la entidad y sin inventar conceptos: aplica la definición que APS-07 §5 ya establece.

Adicionalmente, D es la única alternativa que persiste la entidad **en su estadio de dominio**. La Opción B almacenaría la representación que el análisis construye para el usuario, invirtiendo la relación entre modelo y vista. La Opción D almacena el Lead mientras sigue siendo un Lead.

Por último, D asigna a cada caso de uso una responsabilidad única — descubrir, seleccionar, almacenar, analizar — cumpliendo el principio de Responsabilidad Única de ADR-02 §7.1, que el flujo actual incumple en dos de sus casos de uso.

## 10.2 Por qué reduce deuda técnica

D no añade deuda: retira tres deudas existentes.

- Elimina la ambigüedad sobre el significado del repositorio, que hoy bloquea cualquier decisión posterior sobre persistencia.
- Disuelve la fusión entre selección y análisis, que impide a cualquier otro componente conocer el resultado de la calificación.
- Cierra la desviación respecto de ADR-02 §8, dando existencia real al bloque `Scoring` y sustento a APS-08.

Las Opciones A y B, en cambio, consolidan o desplazan la deuda sin retirarla.

## 10.3 Por qué escala mejor

Al hacer visible la selección, el criterio de calificación deja de estar acoplado al proveedor de análisis. APS-08 anticipa que el modelo de puntuación evolucionará y aprenderá; con la selección fusionada dentro del análisis, esa evolución obliga a intervenir el Lead Analyzer. Con la selección como capacidad propia, el criterio puede evolucionar de forma independiente.

Además, D deja el sistema en la posición correcta para adoptar la Opción C más adelante **de forma aditiva**: incorporar un repositorio de Empresas no invalidaría el repositorio de Leads resultante de D. Esto es coherente con la regla de APS-07 §6 según la cual cada transición agrega conocimiento sin reemplazar el anterior. La Opción B, por el contrario, no admite esa evolución sin deshacerse.

## 10.4 Qué problemas resuelve

- Define de forma unívoca qué representa el repositorio de Leads.
- Elimina los registros almacenados que ningún componente puede alcanzar.
- Hace explícita la capacidad de selección, conforme a ADR-02 §8 y APS-08.
- Devuelve responsabilidad única a los casos de uso del flujo de adquisición.
- Estabiliza la definición sobre la que se apoyarán las decisiones de persistencia futuras.

## 10.5 Qué problemas NO resuelve

Se enumeran explícitamente para evitar que este ADR se cite como fundamento de decisiones que no ha tomado:

- **No resuelve la duplicación entre búsquedas sucesivas.** Un mismo negocio calificado en dos búsquedas distintas seguirá almacenándose dos veces. Depende de la existencia de una clave natural y de una estrategia de escritura, ajenas a este ADR.
- **No resuelve el hecho de que ningún componente lea lo almacenado.** El repositorio seguirá siendo de solo escritura hasta que exista una funcionalidad que lo consulte.
- **No resuelve la ausencia del activo Empresa** definido en APS-07 §5, que permanecerá sin representación.
- **No resuelve las tensiones T1 y T2 del Blueprint.** Las documenta y propone una interpretación; su resolución formal corresponde al equipo de arquitectura.
- **No aborda ninguna cuestión de motor de datos, modelado físico, rendimiento ni volumen.**
- **No modifica el ciclo de vida del estado del Lead**, que seguirá sin actualizarse mientras ningún caso de uso lo requiera.

---

# 11. Consecuencias

## 11.1 Consecuencias positivas

- El contenido del repositorio adquiere un significado unívoco y verificable frente a APS-07 §5.
- Desaparecen los registros inalcanzables: todo lo almacenado corresponde a un negocio calificado.
- La capacidad de selección se hace visible y auditable, y puede evolucionar de forma independiente del proveedor de análisis.
- Cada caso de uso del flujo recupera una responsabilidad única.
- Las decisiones de persistencia posteriores pasan a apoyarse sobre una definición estable.
- La adopción posterior de la Opción C queda abierta y es aditiva.

## 11.2 Consecuencias negativas

- **Se pierde la memoria del descubrimiento.** Deja de ser posible explicar por qué un negocio concreto no fue mostrado, y se pierde la base para métricas de cobertura de mercado. Es el coste real de esta decisión y debe asumirse conscientemente.
- El activo Empresa de APS-07 §5 queda sin representación hasta que se adopte la Opción C.
- La superficie pública de dos módulos debe cambiar para que la selección sea un paso explícito, lo que implica una intervención en el flujo de adquisición con su correspondiente riesgo de ejecución.
- La decisión depende de la interpretación de T1 propuesta en §7. Si el equipo de arquitectura resuelve T1 en sentido contrario — es decir, si confirma que la Biblioteca de Leads debe registrar el descubrimiento —, la alternativa correcta pasaría a ser A o C, y este ADR debería revisarse.

## 11.3 ADRs afectados

| ADR | Naturaleza del impacto |
| --- | --- |
| **ADR-02** — Orquestación de Capacidades | Se refuerza. La decisión materializa el bloque `Scoring` de §8 y restablece §7.1. No requiere enmienda |
| **ADR-04** — Backend Agent Architecture | Afectado. La selección como capacidad propia debe ubicarse conforme a su modelo de capas y de Agent API |
| **ADR-05** — Persistence Architecture & Data Layer | Afectado en su §10 (Modelo Conceptual Inicial): el conjunto que el repositorio representa queda definido por este ADR |
| **ADR-08** — Persistence Boundary & Repository Isolation | No afectado. Las reglas de aislamiento se mantienen íntegras cualquiera que sea la posición elegida |
| **ADR-09** — Dependency Injection Strategy | No afectado en sus reglas; sí en su aplicación, al variar el conjunto de componentes que reciben la Repository Interface |
| **APS-07** — Data & Knowledge Architecture | Requiere aclaración formal de la tensión T1 (§7 de este documento) |
| **APS-08** — Opportunity Scoring Framework | Se refuerza. Adquiere por primera vez una ubicación arquitectónica identificable |

## 11.4 ADRs futuros necesarios

Esta decisión habilita, y en algunos casos exige, los siguientes documentos posteriores:

1. **ADR de Identidad Natural del Lead** — Determinar si el sistema debe conservar un identificador estable de origen para cada negocio, y qué constituye la identidad de un Lead entre búsquedas distintas. Es prerrequisito de cualquier estrategia de escritura no duplicada.
2. **ADR de Estrategia de Escritura** — Definir el comportamiento del repositorio ante un negocio ya almacenado. Depende del anterior.
3. **ADR de Motor de Persistencia** — Sustitución del adaptador de validación por un motor real. Debe ejecutarse **después** de este ADR: de lo contrario, el motor definitivo heredaría un repositorio cuyo significado no está decidido.
4. **ADR de Ubicación de la Capacidad de Selección** — Precisar dónde reside `Scoring` conforme a ADR-02 §8 y ADR-04, y cómo se expone.
5. **ADR del Activo Empresa** — Requerido únicamente si se adopta la Opción C. Debe definir el ciclo de vida del activo y el caso de uso que lo consume.
6. **Enmienda de APS-07** — Resolución formal de las tensiones T1 y T2.

---

# 12. Riesgos

| Riesgo | Severidad | Observación |
| --- | --- | --- |
| La interpretación de T1 se resuelve en sentido contrario | Alta | Invalidaría la recomendación. Debe confirmarse antes de ejecutar |
| La decisión se implementa bajo presión de calendario | Alta | Afecta a la superficie de dos módulos y a la coordinación del flujo. No debe acometerse en paralelo a un hito de demostración |
| El motor de persistencia definitivo se adopta antes que esta decisión | Alta | Heredaría un repositorio de significado indefinido y consolidaría la ambigüedad |
| La pérdida de trazabilidad del descubrimiento se advierte tarde | Media | Debe validarse con el Product Owner que ninguna funcionalidad prevista dependa de consultar negocios no seleccionados |
| El ADR se cita como fundamento de decisiones que no ha tomado | Media | Mitigado mediante §3 («No incluye») y §10.5 |

---

# 13. Dependencias y ADRs Afectados

**Depende de:** APS-07 §5, §6 y §7 (activos de información, modelo conceptual y ciclo de vida); APS-08 (framework de puntuación); ADR-01 (arquitectura modular por capas); ADR-02 §7 y §8 (principios de orquestación y modelo de ejecución); ADR-05 (arquitectura de persistencia); ADR-08 (frontera de persistencia).

**Condiciona a:** los seis documentos enumerados en §11.4.

> **Nota de referencia cruzada (v1.1).** Todas las citas de APS-07 contenidas en este documento remiten a **APS-07 v1.0**, vigente en la fecha de redacción. APS-07 fue reescrito a **v2.0** el 2026-07-29 y sus §5, §6 y §7 tienen hoy un contenido distinto. Las citas se conservan sin modificar por fidelidad histórica; para consultar el enunciado vigente véase APS-07 v2.0.
>
> **Condiciona a:** ninguno. Los seis documentos de §11.4 dejaron de depender de este ADR al archivarse. Su materia corresponde ahora a PO-01 y a la planificación de PLAN-01.

---

# 14. ADRs Futuros Necesarios

Véase §11.4.

---

# 15. Glosario

| Término | Definición |
| --- | --- |
| **Empresa** | Negocio real sobre el que el sistema dispone de información pública. APS-07 §5 |
| **Lead** | Empresa identificada como oportunidad comercial. APS-07 §5 |
| **Lead Analizado** | Lead sobre el que se ha generado información de consultoría. APS-07 §6 |
| **Descubrimiento** | Etapa en la que Lead Hunter localiza empresas en las fuentes externas |
| **Selección** | Operación que determina qué empresas descubiertas se consideran oportunidades comerciales |
| **Registro** | Etapa en la que una entidad se almacena de forma duradera. APS-07 §7 |
| **Posición de la persistencia** | Punto del flujo en el que ocurre el Registro. Objeto de este ADR |

---

# 16. Referencias

## 16.1 Autoridad vigente sobre la materia de este ADR

Documentos que **sustituyen** a este ADR y que deben consultarse en su lugar:

- **PO-01 — Decisión de Producto: Definición Canónica de Lead** (Approved, 2026-07-29). Autoridad funcional del dominio Empresa → Lead. Sustituye la decisión de §10 y las conclusiones de §1 y §11.
- **APS-07 v2.0 — Data & Knowledge Architecture.** Referencia oficial del dominio. §5 (Empresa y Lead), §6.3 (orden Análisis → Evaluación, resuelve T2), §7 y §7.1 (Registro, resuelve T1), §8 (Biblioteca de Leads).
- **APS-03 v3.0 — Agent Architecture.** §7 (responsabilidades de los agentes), §8.1 (flujo canónico con el paso de Registro), §8.2 (prohibiciones del flujo).
- **PLAN-01 — Plan de Consolidación del Blueprint.** §4 y §7, Fase 2. Origen del archivo de este documento.
- **ADS-00 v1.2 — Documentation Standard.** *Jerarquía Documental y Regla de Precedencia*; *Estados del Documento* (definición de `Archived`).

## 16.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-07 remiten a **APS-07 v1.0**, no a la versión vigente.

- APS-07 — Data & Knowledge Architecture, §5, §6, §7 *(v1.0 — derogada)*
- APS-08 — Opportunity Scoring Framework
- APS-06 — Success Metrics & Product Analytics
- ADR-01 — Arquitectura Modular Orientada a Capacidades
- ADR-02 — Orquestación de Capacidades y Agentes, §7, §8
- ADR-04 — Backend Agent Architecture
- ADR-05 — Persistence Architecture & Data Layer, §10
- ADR-08 — Persistence Boundary & Repository Isolation
- ADR-09 — Dependency Injection Strategy
- ADS-00 — Documentation Standard
- Informe de Auditoría de Persistencia del Lead Hunter (hallazgo H-04)

---

> **Nota editorial (v1.1).** La sección siguiente se conserva **íntegra y sin modificar**, tal como fue redactada el 2026-07-28.
>
> Su condición final —«*este documento permanece en estado Draft y no habilita ninguna implementación*»— pertenecía al **estado histórico** del documento y **dejó de tener efecto el 2026-07-29**, fecha en que ADR-10 fue archivado oficialmente conforme a la portada y al Historial de Versiones v1.1.
>
> Los cuatro puntos que enumera fueron resueltos por **PO-01**, si bien con un resultado distinto al que este ADR recomendaba en §10. La condición ya no es exigible: un documento en estado `Archived` no habilita implementación alguna por definición.
>
> Esta nota no altera el contenido original. Existe únicamente para evitar que la lectura literal de §17 contradiga el estado declarado en la portada.

---

# 17. Definition of Done

Este ADR se considerará completo cuando el equipo de arquitectura y el Product Owner:

1. Confirmen o rechacen la interpretación de la tensión T1 propuesta en §7.
2. Aprueben una de las cuatro alternativas de §8.
3. Validen que ninguna funcionalidad prevista dependa de consultar negocios descubiertos y no seleccionados (§11.2).
4. Confirmen que el ADR de Motor de Persistencia (§11.4, punto 3) no se iniciará antes de la resolución de este documento.

Hasta que los cuatro puntos se cumplan, este documento permanece en estado **Draft** y no habilita ninguna implementación.
