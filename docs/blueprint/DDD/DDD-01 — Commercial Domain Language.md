# DDD-01 — Commercial Domain Language

| Campo | Valor |
| --- | --- |
| Código | DDD-01 |
| Clasificación | **Lenguaje Ubicuo del dominio comercial** — ver nota de cumplimiento ADS-00 |
| Versión | 1.1 |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — Sprint *Cierre definitivo de DDD-01*, 2026-07-30 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | **ADS-00 v1.3** |
| Subordinado a | **PO-01 v1.2 · PO-02 v1.3 · APS-18 v1.2 · APS-19 v1.1 · APS-20 v1.1 · ADR-12 v1.1 · ADR-13 v1.2 · ADR-15 v1.2 · ADR-16 v1.1** |

> ## Nota de cumplimiento ADS-00
>
> **La Clasificación Oficial de ADS-00 es cerrada y «DDD» no pertenece a ella.** Este documento se emite con el mismo criterio que **ARCH-01** y **ADS-API-01**: se cataloga por ser documentación oficial, y **no adquiere por ello autoridad alguna**.
>
> **Este documento no decide nada. Nombra.**
>
> Cada concepto remite al documento que lo decidió. **Ante cualquier discrepancia prevalece ese documento, y el defectuoso es éste.** Una entrada errónea aquí es un error de este glosario, nunca una decisión.
>
> **Nunca se cita DDD-01 como fundamento.** Se cita el documento al que remite. *(Registrado como **OBS-01**, §10.)*

> ## Qué no contiene este documento, por diseño
>
> **Ni una sola palabra de implementación.** No hay lenguajes, ni frameworks, ni motores, ni proveedores, ni adapters, ni casos de uso, ni endpoints, ni capas.
>
> Todo eso está decidido y localizado en otros documentos: **ADR-01** *(capas)*, **ADR-15** *(dónde vive cada preocupación)*, **ADR-16 §7** *(casos de uso)*, **ADR-17** *(cómo se escribe uno)*, **ARCH-01** *(dónde va cada pieza)*, **ADS-02** *(motor)*.
>
> **Aquí solo está el dominio: qué existe, cómo se llama y qué no puede dejar de ser cierto.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-30 | AKVEZ Product Office | **Aprobación del documento y consolidación editorial.** Estado `Draft` → **`Approved`**; se cierran los cinco puntos de §12. **Mejoras editoriales:** se incorpora la columna **`Owner`** —la autoridad funcional responsable de cada concepto— a las tablas de §2.1, §2.2, §2.3, §4.2, §4.3 y §5.2 y a las seis fichas de §3, con la regla que la distingue de la *Autoridad* documental en la nueva **§2.0**; se añade el **Apéndice A — Concept Lifecycle**; y se registra en **§10.1** la validación de las diez observaciones. **Ninguna modificación del dominio:** no cambia ningún nombre oficial, ninguna entidad, ningún evento, ningún Value Object, ningún Aggregate Root y ninguna regla. **No se introduce ninguna decisión y no se modifica ningún otro documento.** | Sprint **Cierre definitivo de DDD-01**. Consolidación exclusivamente editorial. La columna `Owner` responde a una pregunta que el documento no contestaba —*«¿quién es responsable de este concepto?»*— y que es distinta de *«¿qué documento lo decide?»*. **Los cinco owners proceden de APS-03 §7 y ADR-15 §7.1; ninguno es nuevo.** |
| 1.0 | 2026-07-30 | AKVEZ Architecture Team | Creación inicial. Fija el **Lenguaje Ubicuo del dominio comercial**: la tabla de conceptos (§2), las **seis entidades** con su ciclo completo (§3), los **Value Objects** con su justificación (§4), los **cinco Aggregate Roots** y el criterio que los determina (§5), los **invariantes** transcritos de sus fuentes (§6), el **mapa de relaciones** (§7), el **glosario oficial con sinónimos prohibidos** (§8), la **autoridad de cada concepto** (§9) y **diez observaciones** (§10). **Ningún concepto es de autoría propia y ninguna regla es nueva.** | Sprint **DDD-01**. Tras el *Architecture Freeze*, el dominio comercial está decidido y **repartido entre nueve documentos**. Un desarrollador que necesite saber qué es una `Proposal` debe hoy leer PO-02 §3, ADR-16 §4.4 y ADR-13 A-6, y descubrir por su cuenta que **el mismo concepto se llama de dos maneras** en dos de ellos. Ese reparto es correcto —cada documento decide lo suyo— pero **no produce un lenguaje común**, y un lenguaje que no es común deja de serlo en el código. |

---

# Tabla de Contenido

1. Propósito y cómo se usa
2. Tabla de conceptos
3. Entidades
4. Value Objects
5. Aggregates
6. Invariantes
7. Mapa de relaciones
8. Glosario oficial
9. Autoridad por concepto
10. Observaciones
11. Referencias
12. Definition of Done
· **Apéndice A — Concept Lifecycle**

---

# 1. Propósito y cómo se usa

## 1.1 Qué problema resuelve

**El dominio comercial de AKVEZ está decidido y está repartido.** Nueve documentos aprobados lo definen, cada uno con competencia sobre su parte. Ninguno contiene el vocabulario completo, y **dos de ellos nombran de forma distinta el mismo objeto**.

Un lenguaje ubicuo no añade conocimiento: **elimina la traducción**. Si un desarrollador, una IA y un documento usan tres palabras para la misma cosa, el modelo se degrada aunque cada uno tenga razón por separado.

## 1.2 Regla de uso

1. **Busca el concepto en §2.** Ahí está su tipo y su autoridad.
2. **Si necesitas el detalle, ve a §3, §4 o §5.**
3. **Si necesitas saber cómo llamarlo, ve a §8.** El glosario declara los **sinónimos prohibidos** y por qué lo son.
4. **Si algo aquí contradice a su autoridad, la autoridad gana.** Repórtalo como defecto de este documento.

## 1.3 Las tres preguntas que este documento debe permitir responder sin abrir otro

| Pregunta | Sección |
| --- | --- |
| **¿Qué objetos existen en el dominio comercial y cuáles son sus límites?** | §3 · §5 |
| **¿Qué no puede dejar de ser cierto nunca?** | §6 |
| **¿Cómo se llama cada cosa, y cómo no debe llamarse?** | §8 |

---

# 2. Tabla de conceptos

**Entregable 2.** Todo concepto del dominio comercial, con su tipo, su autoridad única y su owner.

## 2.0 `Autoridad` y `Owner` son dos ejes distintos

**Confundirlos es fácil y caro**, porque ambos responden a *«¿de quién es esto?»* — pero no a la misma pregunta.

| | **Autoridad** | **Owner** |
| --- | --- | --- |
| **Responde a** | *¿Qué documento decide este concepto?* | *¿Qué agente o actor es responsable de él?* |
| **Es** | Un documento del Blueprint | Una **autoridad funcional** — un agente de APS-03 §7, o el usuario |
| **Ante discrepancia** | Prevalece sobre este documento *(§1.2)* | Prevalece **APS-03 §7** sobre cualquier atribución de aquí |
| **Ejemplo** | `Proposal` → **ADR-16 §4.4** | `Proposal` → **Pitch Generator** |

**Los owners son cinco y ninguno es nuevo.** Proceden literalmente de **APS-03 §7**, **ADR-15 §7.1** y **ADR-16 §6**:

| Owner | Qué le corresponde | Fuente |
| --- | --- | --- |
| **Lead Hunter** | Descubrimiento y **Registro**. **Produce el Lead** | **APS-03 §7.1** · PO-01 §3 · ADR-16 §6 |
| **Lead Analyzer** | Análisis, Evaluación y ordenación. **No crea Leads** | **APS-03 §7.2** · ADR-15 §7.1 |
| **Pitch Generator** *(Sistema Comercial)* | Diagnóstico, estrategia, secuencia y propuesta | **APS-03 §7.3** · ADR-15 §7.1 · ADR-16 §6 |
| **El usuario** | **La declaración de contacto.** Nunca un agente | **APS-09 §9** · PO-02 §5 · ADR-16 §4.5 |
| **Product Office** | El **Perfil de Ponderación** y el criterio que gobierna | **ADR-14 §8.1** |

> **Sobre el nombre del owner comercial.** **PO-02 §1 conserva «Pitch Generator» como nombre oficial del agente** y admite la forma **«Pitch Generator (Sistema Comercial)»** cuando la claridad lo exija. **El renombrado requiere un acto de *naming* separado, todavía no convocado.** Este documento usa el nombre oficial.

> ⚠️ **El `Lead` es del Lead Hunter, no del Lead Analyzer.** **APS-03 §7.1** atribuye el Registro al Lead Hunter y **§7.2 dice del Lead Analyzer que *«no crea Leads: opera sobre Leads que ya existen en la Biblioteca»***. El Lead Analyzer **enriquece** el Lead con análisis y Score; **no es su owner**. Es la corrección que **DEV-05 §1.1** ejecutó en código al cerrar la desviación **A-02**.

## 2.1 Objetos del dominio

> **Cada concepto tiene una autoridad y solo una.** La columna *Desarrollado en* señala documentos que **detallan** el concepto sin decidirlo: ante discrepancia entre ambos, **prevalece la autoridad**. La regla que las separa está en §9.

| Concepto | Tipo | **Autoridad** | **Owner** | Desarrollado en | Activo | Evento |
| --- | :-: | --- | --- | --- | :-: | :-: |
| **Lead** | **Entidad · Aggregate Root** | **PO-01 §2** | **Lead Hunter** | PO-02 §5.1 · ADR-12 §7.2 · ADR-16 §4.1 | A-1, A-2, A-3, A-8 | E-2, E-2b |
| **BuyerDiagnosis** | **Entidad · Aggregate Root** | **ADR-16 §4.2** | **Pitch Generator** | APS-19 · APS-18 §6 · ADR-13 A-11 | A-11 | E-7 |
| **CommercialSequence** | **Entidad · Aggregate Root** | **ADR-16 §4.3** | **Pitch Generator** | PO-02 §4 · APS-18 §9 · ADR-13 A-12 | A-12 | E-8 |
| **Proposal** | **Entidad · Aggregate Root** | **ADR-16 §4.4** | **Pitch Generator** | PO-02 §3 · APS-18 §8 · ADR-13 A-6 | A-6 | E-5 |
| **ContactEvent** | **Entidad · Aggregate Root** | **ADR-16 §4.5** | **El usuario** | PO-02 §5 · ADR-13 E-9 | A-7 · A-8 | E-9 |
| **Commercial Strategy** | **Value Object** *(contenido de `Proposal`)* | **APS-18 §8** | **Pitch Generator** | ADR-15 §7.2 · APS-20 §3.1 | *dentro de* A-6 y A-12 | — |

> **`ContactEvent` es la única entidad cuyo owner no es un agente.** *«Es la única entidad que AKVEZ no produce»* *(ADR-16 §4.5)*, y **CE-I4** lo blinda: no la genera el sistema **ni por inferencia, ni por tiempo, ni por detección**.

> **Por qué la autoridad de las cuatro entidades comerciales es ADR-16 y no el APS que las describe.** **ADR-16 es la autoridad del *modelo de dominio*:** decide qué entidades existen, cuál es su identidad, su ciclo y sus invariantes. **Los APS deciden su *contenido*:** qué variables tiene un diagnóstico, qué momentos tiene una secuencia, qué decide una estrategia. **Son competencias distintas sobre el mismo objeto y no se solapan** — el propio ADR-16 lo declara en su §2 al enumerar lo que no define.
>
> **`Lead` es la excepción, y es correcta:** su autoridad es **PO-01**, orden 2, y **ADR-16 §4.1 declara expresamente que lo referencia y nunca lo redefine**.

> ⚠️ **`Commercial Strategy` no es una entidad.** **ADR-16 §4 define cinco entidades y no la incluye**; **ARCH-01 §3 la sitúa expresamente como *«parte de `Proposal`»***, y **ADR-16 §4.4** la enumera entre los contenidos de la Propuesta. **No tiene identidad propia, no se persiste por separado y ningún evento la escribe.** El enunciado del sprint la listaba entre las entidades. *(**OBS-02**, §10.)*

## 2.2 Value Objects

| Concepto | Autoridad | **Owner** | Vive dentro de |
| --- | --- | --- | --- |
| **Referencia de Origen** | **ADR-12 §7.1** | **Lead Hunter** | Identidad de la Empresa *(A-1)* |
| **Huella de Identidad** | **ADR-12 §7.3** | **Lead Hunter** | Identidad subsidiaria *(A-1)* |
| **Commercial State** | **APS-18 §7** | **Pitch Generator** | `BuyerDiagnosis` — es la variable **BD-1** |
| **Variable de diagnóstico** *(BD-1 a BD-7)* | **APS-19 §6** | **Pitch Generator** | `BuyerDiagnosis` |
| **Clase de conocimiento** | **APS-19 §4.2** | **Pitch Generator** | Cada variable de diagnóstico |
| **Indicio** | **APS-19 §4.1** | **Lead Analyzer** — *lo produce el análisis* | Cada variable *Inferida* |
| **Confianza declarada** | **APS-19 §7** | **Pitch Generator** | `BuyerDiagnosis` |
| **Commercial Strategy** | **APS-18 §8** | **Pitch Generator** | `Proposal` y cada momento de `CommercialSequence` |
| **Objetivo del contacto** *(Micro-Yes)* | **APS-18 §4.5** | **Pitch Generator** | `Commercial Strategy` |
| **Barrera** | **APS-18 §5.1** | **Pitch Generator** | `Commercial Strategy` |
| **Emoción admisible** | **APS-18 §8.5** | **Pitch Generator** | `Commercial Strategy` |
| **Hilo** | **APS-18 §4.6** | **Pitch Generator** | `Commercial Strategy` |
| **Elemento de relevancia** | **APS-18 §4.7** | **Pitch Generator** | `Commercial Strategy` |
| **Resultado esperado** | **APS-18 §5.2** | **Pitch Generator** | `Commercial Strategy` |
| **Hecho afirmable** | **APS-18 §11.3** | **Lead Analyzer** — *procede del análisis* | La lista cerrada |
| **Lista cerrada de hechos afirmables** | **ADR-15 §10.2** | **Pitch Generator** | `Proposal` |
| **Canal** | **APS-20 §3** | **Pitch Generator** | `Proposal` · `Commercial Strategy` |
| **Momento de la secuencia** | **APS-18 §9.2** | **Pitch Generator** | `CommercialSequence` |
| **Resultado declarado** | **APS-18 §9.5** | **El usuario** | `ContactEvent` |
| **Manifestación del comprador** | **APS-19 §4.3** | **El usuario** | `ContactEvent` |
| **Versión del criterio comercial** | **ADR-15 §7.4 (RA-7)** | **Product Office** | Toda entidad emitida |

> **Tres Value Objects tienen owner distinto del de la entidad que los contiene, y no es un descuido.**
>
> **`Indicio` y `Hecho afirmable` son del Lead Analyzer** aunque vivan dentro del diagnóstico y de la propuesta: **proceden del análisis y el sistema comercial nunca los amplía** *(APS-19 §3.2 · RE-1 · RA-4)*. **Es la Regla de Evidencia expresada como propiedad.**
>
> **`Resultado declarado` y `Manifestación del comprador` son del usuario**, aunque vivan dentro de una entidad que el sistema escribe. **El sistema registra lo que el usuario declara; no lo produce** *(CE-I4)*.

## 2.3 Conceptos de otro dominio que el comercial consume y nunca modifica

| Concepto | Autoridad | **Owner** | Qué puede hacer el sistema comercial con él |
| --- | --- | --- | --- |
| **Empresa** | **PO-01 §1** | **Lead Hunter** | Nada. **No la descubre ni la registra** |
| **Registro** | **PO-01 §3** | **Lead Hunter** | Nada. **El dominio comercial no crea Leads** *(D-5)* |
| **Biblioteca de Leads** | **PO-01 §4** | **Lead Hunter** — *quien la puebla* | Leerla. **Nunca retirar nada de ella** |
| **Estadio del ciclo de vida** | **PO-02 §5.1** | **El evento que lo produce** | **Solo `ContactEvent` lo toca**, y solo hacia `Contacted` *(CE-I1)* |
| **Análisis** | **APS-03 §7.2** | **Lead Analyzer** | Consumirlo. **Nunca modificarlo** |
| **Evidencia del análisis** | **APS-08 §9** | **Lead Analyzer** | Consumirla. **Nunca ampliarla** *(RE-1 · APS-20 §3.2)* |
| **Opportunity Score** | **PO-01 §5** | **Lead Analyzer** | Consumirlo. **Ningún resultado del diagnóstico puede alterarlo** *(APS-19 §3)* |
| **Banda** | **APS-08 §8** | **Lead Analyzer** | Consumirla |
| **Perfil de Ponderación** | **ADR-14 §7** | **Product Office** | Nada. Gobierna el Score, no el criterio comercial |
| **Perfil de Estrategia** | **ADR-15 §7.4** | **Product Office** — ⏸️ *gobernanza `Pospuesta`* | Consumirlo y **vincular a él toda estrategia emitida** *(RA-7)* |

---

# 3. Entidades

**Seis fichas.** Cinco entidades del modelo *(ADR-16 §4)* y `Commercial Strategy`, que **no es una entidad** y se documenta aquí porque el sprint la exige y porque confundirla con una es un error frecuente.

---

## 3.1 `Lead`

| | |
| --- | --- |
| **Owner** | **Lead Hunter** *(APS-03 §7.1 · PO-01 §3)*. **No el Lead Analyzer**, que «no crea Leads» *(APS-03 §7.2)* |
| **Qué es** | **Una Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto.** La diferencia entre Empresa y Lead **no es de calidad: es de pertenencia**. La Empresa pertenece al mercado; el Lead, a tu embudo *(PO-01 §2)* |
| **Qué no es** | **No es una promesa de conversión.** No es una garantía de calidad. **No necesita** análisis, puntuación, umbral ni posición en un ranking: todo eso le ocurre **después**, y lo enriquece sin cambiar lo que es *(PO-01 §2)*. **No es propiedad del sistema comercial**: lo registra el Lead Hunter *(ADR-16 §4.1)* |
| **Identidad** | **`(Referencia de Origen de la Empresa, Usuario)`** *(ADR-12 §7.2)*. En ausencia de Referencia de Origen, **Huella de Identidad**, provisional *(ADR-12 §7.3)* |
| **Quién la crea** | **El Lead Hunter**, mediante el **Registro** *(PO-01 §3 · APS-03 §7.1)* |
| **Quién puede modificarla** | Su **estadio**, solo el evento que lo produce *(PO-02 LS-3)*. Sus **atributos**, el Lead Hunter al redescubrirla *(E-2b)*. **El sistema comercial nunca la crea ni la destruye** *(ADR-16 D-5)* |
| **Cuándo nace** | **En el instante exacto del Registro**: cuando AKVEZ la incorpora a la Biblioteca tras descubrirla y comprobar que no estaba *(PO-01 §3)* |
| **Cuándo termina** | **Nunca.** *«Ninguna etapa expulsa. Un Lead que entra en la Biblioteca permanece en ella»* *(PO-01 §8)*. **No existe estado de caducidad y no existirá** *(PO-02 LS-2)* |
| **Eventos que la afectan** | **E-2** Registro · **E-2b** Redescubrimiento · **E-3** Analizado · **E-4** Score calculado · **E-6** Decisión del usuario · **E-9** Contacto declarado *(único que lo lleva a `Contacted`)* |
| **Documentos que la gobiernan** | **PO-01** *(qué es)* · **PO-02 §5.1** *(sus estados)* · **ADR-12** *(su identidad)* · **ADR-13** *(cómo se escribe)* |

> **Es el sujeto de todas las demás entidades: ninguna existe sin él** *(ADR-16 §4.1)*.

---

## 3.2 `BuyerDiagnosis`

> **Nombre canónico: `BuyerDiagnosis`.** **ADR-13 lo designa «Diagnóstico Comercial»** como activo **A-11**. Son el mismo objeto bajo dos nombres. *(**OBS-03**, §10.)*

| | |
| --- | --- |
| **Owner** | **Pitch Generator** *(APS-03 §7.3 · ADR-16 §6)* |
| **Qué es** | **La lectura comercial de un negocio: cómo abordarlo.** Siete variables, cada una con su clase de conocimiento, sus indicios y su valor cuando proceda, más la confianza declarada *(ADR-16 §4.2 · APS-19 §1)* |
| **Qué no es** | **No es el Opportunity Score, y la diferencia es la razón de que exista.** El Score responde a *«¿merece la pena?»*; el diagnóstico, a *«¿cómo se aborda?»* *(APS-19 §3)*. **No es comparable entre Leads: no produce puntuación ni orden** *(BD-I5)*. **No describe a una persona**: describe al negocio *(APS-19 §4.5)*. **No es un diagnóstico técnico** —ése lo produce el Lead Analyzer *(APS-18 §6)* |
| **Identidad** | **`(Lead, número de emisión)`** *(ADR-16 §4.2)* |
| **Quién la crea** | **El sistema comercial**, a partir de evidencia que **recibe ya unida** y **nunca busca** *(ADR-15 §12)* |
| **Quién puede modificarla** | **Nadie: se versiona.** Cada emisión añade; ninguna retira *(ADR-13 §10.3)*. Una **manifestación del comprador** declarada por el usuario produce una emisión nueva *(CE-I3)* |
| **Cuándo nace** | Al emitirse — evento **E-7** |
| **Cuándo termina** | **Nunca.** Vigente es la emisión más reciente; las anteriores **no se destruyen** *(ADR-16 §4.2)* |
| **Eventos que la afectan** | **E-7** emitido *(versiona)* · **E-9** contacto declarado, **solo si hubo manifestación** *(versiona condicionalmente)* |
| **Documentos que la gobiernan** | **APS-19** *(las siete variables y cómo se leen)* · **APS-18 §6** *(qué establece cada una)* · **ADR-16 §4.2** *(la entidad)* · **ADR-13 A-11** *(cómo se escribe)* |

**Invariantes:** **BD-I1** toda variable declara su clase · **BD-I2** ninguna *Desconocida* tiene valor · **BD-I3** toda *Inferida* conserva sus indicios · **BD-I4** el **Commercial State es la variable BD-1**, no un campo aparte · **BD-I5** **no produce puntuación ni orden**.

> **Un diagnóstico con variables desconocidas es un diagnóstico correcto**, no incompleto. Antes del primer contacto lo esperable son **tres inferidas y cuatro desconocidas**; presentar siete sostenidas *«no es un diagnóstico mejor: es un diagnóstico que ha rellenado huecos»* *(APS-19 §7.2)*.

---

## 3.3 `CommercialSequence`

| | |
| --- | --- |
| **Owner** | **Pitch Generator** *(APS-03 §7.3 · ADR-16 §6)* |
| **Qué es** | **El plan de contactos que AKVEZ propone para conseguir una conversación con un Lead** *(PO-02 §4)*. **No es una lista de mensajes: es una estrategia con memoria** *(APS-18 §9.1)* |
| **Qué no es** | **No es un compromiso de envío** *(CS-I1)*. **No es automatización de seguimiento**: diseñar no es automatizar *(PO-02 §2.2)*. **No contiene disparadores temporales** *(CS-I6 · SC-R6)*. **No obliga al usuario a nada**: puede ignorarla, alterarla o detenerla *(PO-02 §4)* |
| **Identidad** | **`(Lead, número de secuencia)`** *(ADR-16 §4.3)* |
| **Quién la crea** | El sistema comercial, a partir del diagnóstico vigente |
| **Quién puede modificarla** | **Se actualiza**, no se versiona: su estado evoluciona con cada contacto. **El rastro lo conserva el historial (A-8)** *(ADR-13 §6.2)* |
| **Cuándo nace** | Al diseñarse — evento **E-8** |
| **Cuándo termina** | **Concluye al alcanzar una conversación** *(CS-I2 · SC-R2)*. Puede además **detenerse** o **agotarse**, y ninguna de las dos cosas expulsa al Lead *(CS-I3 · SC-R5)*. **Un Lead puede tener varias secuencias, y una nueva no borra la anterior** *(CS-I5)* |
| **Eventos que la afectan** | **E-8** diseñada o actualizada · **E-9** contacto declarado *(actualiza)* |
| **Documentos que la gobiernan** | **PO-02 §4** *(qué es y qué no obliga)* · **APS-18 §9** *(los seis momentos y sus reglas)* · **APS-20 §7** *(qué canal transporta cada momento)* · **ADR-16 §4.3** · **ADR-13 A-12** |

**Estados:** `Diseñada` · `En curso` · `Concluida` · `Detenida` *(ADR-16 §4.3)*.

**Los seis momentos** *(APS-18 §9.2)*: **1** Reconocimiento · **2** Evidencia · **3** Demostración · **4** Oferta · **5** Seguimiento · **6** Reactivación.

> **Ningún momento se emite sin acción del usuario *para ese contacto concreto*** *(CS-I4 · PO-02 §2.1)*. **El silencio es información**, no fracaso, y no autoriza a subir la presión *(SC-R4)*.

---

## 3.4 `Proposal`

| | |
| --- | --- |
| **Owner** | **Pitch Generator** *(APS-03 §7.3 · ADR-16 §6)* |
| **Qué es** | **El artefacto completo de un contacto: la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa** *(PO-02 §3 · ADR-16 §4.4)* |
| **Qué no es** | **No es solo el texto** *(P-I1)*. Sin estrategia y evidencia **no puede explicarse después**, que es exactamente lo que la hace útil. **No cambia el estadio del Lead** *(P-I3 · LS-3)*. **No es un contacto**: producirla no contacta a nadie *(D-4)* |
| **Identidad** | **`(Lead, momento de la secuencia, número de emisión)`** *(ADR-16 §4.4)* |
| **Quién la crea** | El sistema comercial. **El texto lo produce un modelo generativo; las decisiones no** *(APS-18 §10.1 · ADR-15 §8)* |
| **Quién puede modificarla** | **Nadie: se versiona. Regenerar añade; nunca sustituye** *(P-I2 · PO-02 §3 regla 2)*. **El usuario puede reescribir cualquier texto antes de enviarlo** *(APS-18 §8.4)* |
| **Cuándo nace** | Al emitirse — evento **E-5** |
| **Cuándo termina** | **Nunca.** **Emitida y nunca enviada es un estado válido** *(P-I5)* |
| **Eventos que la afectan** | **E-5** emitida *(versiona; **no toca el estadio**)* |
| **Documentos que la gobiernan** | **PO-02 §3** *(qué es)* · **APS-18 §8** *(la estrategia que contiene)* · **APS-18 §11** *(la Regla de Evidencia)* · **APS-20** *(el canal)* · **ADR-16 §4.4** · **ADR-13 A-6** |

**Invariantes:** **P-I1** no es solo el texto · **P-I2** regenerar nunca sustituye · **P-I3** emitirla no cambia el estadio · **P-I4** **ninguna afirmación suya carece de evidencia en la lista cerrada** · **P-I5** emitida y no enviada es válida.

> **Es el único objeto que atraviesa la Línea de Decisión, y en un solo sentido:** el dominio construye la lista cerrada de hechos afirmables, el modelo redacta con ella, y **el dominio verifica contra ella**. **Un texto que no supera el control se rehace; no se entrega con advertencia** *(ADR-15 §10)*.

---

## 3.5 `ContactEvent`

| | |
| --- | --- |
| **Owner** | **El usuario.** Nunca un agente *(APS-09 §9 · ADR-16 §4.5)* |
| **Qué es** | **Lo que el usuario declara que ocurrió.** La única entidad del dominio que **AKVEZ no produce** *(ADR-16 §4.5)* |
| **Qué no es** | **No es una Propuesta.** Producir y declarar son hechos distintos, y **fundirlos reintroduciría la conflación que cinco documentos acaban de corregir** *(D-4)*. **No lo genera el sistema: ni por inferencia, ni por tiempo, ni por detección** *(CE-I4)* |
| **Identidad** | **`(Lead, momento de la secuencia, marca temporal)`** *(ADR-16 §4.5)* |
| **Quién lo crea** | **El usuario. Nunca un agente** *(APS-09 §9 · ADR-16 §4.5)* |
| **Quién puede modificarlo** | **Nadie. Solo crece: ninguna declaración se elimina ni se altera** *(ADR-16 §4.5 · S-2 de PO-02 §7.2)* |
| **Cuándo nace** | Cuando el usuario declara haber emitido un contacto — evento **E-9** |
| **Cuándo termina** | **Nunca** |
| **Eventos que lo afectan** | **E-9**, con **semántica condicional** *(§3.5.1)* |
| **Documentos que lo gobiernan** | **PO-02 §5** *(cuándo un Lead está Contactado)* · **ADR-16 §4.5, §6.1** · **ADR-13 E-9** · **APS-18 §9.5** *(la declaración mínima es binaria)* |

### 3.5.1 La condicionalidad de E-9

| Lo que el usuario declara | Efecto |
| --- | --- |
| **No respondió** | Actualiza la secuencia y el historial. **No versiona** |
| **Respondió, sin contenido aprovechable** | Actualiza el estadio, la secuencia y el historial. **No versiona** |
| **Respondió con manifestación** | Actualiza el estadio, la secuencia y el historial **y versiona el `BuyerDiagnosis`** *(CE-I3)* |

*(ADR-16 §6.1)*

**Invariantes:** **CE-I1** **es el único hecho que lleva un `Lead` a `Contacted`** · **CE-I2** sin él la secuencia **no avanza** — el sistema no supone lo que no le consta · **CE-I3** una manifestación **prevalece sobre toda lectura inferida** y versiona el diagnóstico · **CE-I4** nunca lo genera el sistema.

> **Es la entidad que hace honesto el modelo.** Sin ella, AKVEZ registraría como hechos cosas que solo ha producido *(ADR-16 §4.5)*.

---

## 3.6 `Commercial Strategy` — **no es una entidad**

| | |
| --- | --- |
| **Owner** | **Pitch Generator** *(APS-03 §7.3 · ADR-15 §7.1)* |
| **Qué es** | **El conjunto de decisiones que gobiernan un contacto** *(APS-18 §8)*: objetivo, barrera, base de evidencia, enfoque, emoción legítima, hilo que retoma, hilo que deja planteado, elemento de relevancia nuevo, canal y momento, resultado esperado |
| **Qué no es** | **No es una entidad**: no tiene identidad propia, no se persiste por separado y **ningún evento la escribe** *(§2.1 · ADR-16 §4)*. **No contiene el texto del mensaje** — la redacción es posterior y separada *(APS-18 §8.2)*. **No contiene instrucciones para el modelo, ni detalle técnico, ni datos personales, ni afirmaciones no sostenidas** |
| **Dónde vive** | **Dentro de `Proposal`** *(ARCH-01 §3 · ADR-16 §4.4)* y, por cada contacto, dentro de `CommercialSequence` *(ADR-16 §4.3)* |
| **Quién la crea** | El sistema comercial, mediante el **Commercial Strategy Engine** de APS-18 §5 |
| **Quién puede modificarla** | **Nadie.** Es inmutable dentro de la emisión que la contiene: se re-estrategiza **contacto a contacto**, y cada re-estrategia produce una emisión nueva *(SC-R1 · P-I2)* |
| **Qué nunca decide** | **Si el contacto se envía** *(lo decide el usuario)* · **a quién se contacta** · **qué palabras finales se usan** · **si un Lead merece esfuerzo comercial** · **qué es cierto** — *eso lo determina la evidencia* *(APS-18 §8.4)* |
| **Documentos que la gobiernan** | **APS-18 §5, §8** *(qué es y qué contiene)* · **APS-20 §3.1** *(el canal restringe después, y nunca la abrevia)* · **ADR-15 §7.2** *(es la preocupación 5, determinista)* |

> **Determinista por decisión.** Dado el mismo diagnóstico, el mismo estado y la misma versión del Perfil de Estrategia, produce la misma estrategia *(ADR-15 §7.2)*. **Es lo que la hace explicable y comparable**, y la razón de que no viva en un prompt.

---

# 4. Value Objects

**Un Value Object es un concepto sin identidad propia: se define por su valor, vive dentro de una entidad y no cambia — cambia la entidad que lo contiene.**

**Ninguno se declara aquí por suposición.** Cada uno se justifica con **tres pruebas** extraídas de documentos aprobados:

| Prueba | Pregunta |
| :-: | --- |
| **P1** | ¿Tiene identidad propia declarada en ADR-16 §4? |
| **P2** | ¿Tiene activo propio en ADR-13 §6.2 y evento propio en §13.1? |
| **P3** | ¿Puede cambiar sin que cambie la entidad que lo contiene? |

> **Si las tres respuestas son *no*, es un Value Object.** Si alguna es *sí*, es una entidad.

## 4.1 Los que el sprint propuso — verificados uno a uno

| Concepto propuesto | P1 | P2 | P3 | Veredicto |
| --- | :-: | :-: | :-: | --- |
| **Opportunity Score** | No | **Sí** — A-5, E-4 | No | ⚠️ **Value Object, pero de otro dominio.** Es un **atributo del Lead** *(PO-01 §5 · APS-08)*, **inmutable una vez emitido** —cada emisión conserva el perfil y la versión con que se calculó *(ADR-13 §10.3 V-4 · ADR-14 R-VIN)*—. **Pertenece al Lead Analyzer y el sistema comercial no lo modifica jamás** *(APS-19 §3.2)* |
| **Commercial State** | No | No — **reside dentro de A-11** | No | ✅ **Value Object.** **Es la variable BD-1 del diagnóstico, no un campo aparte** *(BD-I4 · ADR-13 §6.2)*. Uno de cinco valores de un conjunto cerrado *(APS-18 §7.2)* |
| **«Buyer Signals»** | — | — | — | ❌ **No existe en el Blueprint.** El concepto aprobado es **Indicio** *(APS-19 §4.1)*. *(**OBS-04**, §10)* |
| **«Buying Stage»** | — | — | — | ❌ **No existe, y es ambiguo entre dos conceptos que el Blueprint separa expresamente**: el **Commercial State** y el **estadio del ciclo de vida**. *(**OBS-04**, §10)* |

## 4.2 Value Objects del dominio comercial

| Concepto | Qué es | Por qué es VO | Autoridad | **Owner** |
| --- | --- | --- | --- | --- |
| **Commercial State** | La posición psicológica del comprador respecto del problema, la solución y el proveedor. Cinco valores: *Inconsciente · Consciente del Problema · Consciente de la Solución · Consciente del Proveedor · Conversación* | Es **BD-1** dentro del diagnóstico; sin activo ni evento propios | **APS-18 §7** | **Pitch Generator** |
| **Variable de diagnóstico** | Una de las siete lecturas: consciencia, urgencia, sofisticación, riesgo percibido, coste percibido, confianza, identidad profesional | Sin identidad; se sustituye entera al versionarse el diagnóstico | **APS-19 §6** | **Pitch Generator** |
| **Clase de conocimiento** | *Observable · Inferida · Desconocida.* Determina **qué autoriza** cada variable | Conjunto cerrado de tres valores | **APS-19 §4.2** | **Pitch Generator** |
| **Indicio** | **Un hecho público observable** del que se deriva una lectura. *«El indicio es un hecho; la lectura no»* | Es un dato, no un objeto con ciclo de vida | **APS-19 §4.1** | **Lead Analyzer** |
| **Confianza declarada** | Cuánto apoyo real tiene el diagnóstico | Atributo del diagnóstico | **APS-19 §7** | **Pitch Generator** |
| **Commercial Strategy** | Las decisiones que gobiernan un contacto *(§3.6)* | Sin identidad, sin activo, sin evento | **APS-18 §8** | **Pitch Generator** |
| **Objetivo del contacto** *(Micro-Yes)* | Un peldaño de la escalera *leer → reconocerse → responder → aceptar ver algo → aceptar hablar* | Valor de un conjunto cerrado y ordenado | **APS-18 §4.5** | **Pitch Generator** |
| **Barrera** | Una de las cinco resistencias del comprador en frío: *Identidad · Relevancia · Credibilidad · Momento · Riesgo* | Conjunto cerrado y ordenado | **APS-18 §5.1** | **Pitch Generator** |
| **Emoción admisible** | *Curiosidad · reconocimiento · comparación suave.* **Miedo, vergüenza, culpa y presión temporal están excluidos por diseño** | Conjunto cerrado. **La exclusión es normativa, no estilística** | **APS-18 §8.5** | **Pitch Generator** |
| **Hilo** | Pregunta o asunto que un contacto **enuncia** y el siguiente retoma. **Es respondible en cualquier momento** | Contenido de la estrategia | **APS-18 §4.6** | **Pitch Generator** |
| **Elemento de relevancia** | Lo que un contacto aporta y el anterior no contenía | Contenido de la estrategia | **APS-18 §4.7** | **Pitch Generator** |
| **Resultado esperado** | Qué se considerará éxito, **en forma observable y binaria** | Contenido de la estrategia | **APS-18 §5.2** | **Pitch Generator** |
| **Hecho afirmable** | Conocimiento **Observado** que un contacto puede enunciar | Dato derivado del análisis | **APS-18 §11.3** | **Lead Analyzer** |
| **Lista cerrada de hechos afirmables** | El conjunto completo de lo que un contacto puede afirmar. **Se construye en el dominio y ninguna capa la amplía** | Se construye por emisión; no persiste aparte | **ADR-15 §10.2** | **Pitch Generator** |
| **Canal** | **Superficie de comunicación con reglas propias** de longitud, registro y formato. **No es una integración** | Restricción, no objeto | **APS-20 §3** | **Pitch Generator** |
| **Momento de la secuencia** | Uno de los seis: *Reconocimiento · Evidencia · Demostración · Oferta · Seguimiento · Reactivación* | Conjunto cerrado y ordenado | **APS-18 §9.2** | **Pitch Generator** |
| **Resultado declarado** | Lo que el usuario declara que ocurrió. **La declaración mínima es binaria: respondió / no respondió** | Contenido del `ContactEvent` | **APS-18 §9.5** | **El usuario** |
| **Manifestación del comprador** | Lo que el comprador dijo. **Convierte una variable en Observable y prevalece sobre toda lectura inferida** | Contenido del `ContactEvent` | **APS-19 §4.3** | **El usuario** |
| **Versión del criterio comercial** | La versión del Perfil que produjo una emisión. **Sin ella, una decisión conservada no puede reproducirse** | Referencia inmutable | **ADR-15 §7.4 (RA-7)** · **RC-13** | **Product Office** |

## 4.3 Value Objects de identidad — del dominio del Lead, no del comercial

| Concepto | Qué es | Autoridad | **Owner** |
| --- | --- | --- | --- |
| **Referencia de Origen** | **`(Fuente, Designación)`** — la identidad natural de la Empresa. **La Fuente es inseparable**: dos designaciones idénticas de fuentes distintas no son la misma Empresa | **ADR-12 §7.1** | **Lead Hunter** |
| **Huella de Identidad** | **`(denominación, localización)`** — identidad **subsidiaria y provisional**, solo en ausencia de Referencia de Origen. **Ante la duda, no se fusiona** | **ADR-12 §7.3** | **Lead Hunter** |

> **Ambas son del Lead Hunter porque la identidad nace en el Registro y no se modifica después** *(ADR-13 A-1 · ADR-12 §12.1)*. **El sistema comercial las lee y nunca las toca.**

---

# 5. Aggregates

## 5.1 El criterio, y de dónde sale

**Ningún documento aprobado usa la palabra *aggregate*.** Lo que sí decide el Blueprint son los tres hechos de los que un agregado se deduce, y **este documento no añade ninguno**:

| Criterio | Fuente |
| --- | --- |
| **1 · Identidad propia declarada** | **ADR-16 §4** — cada entidad declara la suya |
| **2 · Activo y evento de escritura propios** | **ADR-13 §6.2 y §13.1** — catálogo cerrado |
| **3 · Semántica de escritura propia** — *registrar · actualizar · versionar* | **ADR-13 §10.2** |

> **El criterio decisivo es el tercero, y ADR-13 §6.2 lo razona expresamente** al explicar por qué A-11 y A-12 son **dos activos y no uno**: *«fundirlos impondría a uno la semántica del otro»*. **Dos objetos con semánticas de escritura distintas no pueden compartir frontera transaccional.**

**Y una cuarta condición, que es la que cierra el asunto:** **ADR-13 §11.1 declara que la única operación atómica del dominio es el Registro**, y **§11.2 admite la ejecución diferida** de todo lo demás. **Si el diagnóstico, la secuencia y la propuesta pueden escribirse en momentos distintos y de forma diferida, no comparten transacción con el Lead ni entre sí.**

## 5.2 Los cinco Aggregate Roots

| Aggregate Root | **Owner** | Contiene | Identidad | Semántica | Por qué es raíz |
| --- | --- | --- | --- | :-: | --- |
| **`Lead`** | **Lead Hunter** | Identidad · atributos de la Empresa · estadio · historial | `(Referencia de Origen, Usuario)` | **Registrar · actualizar** | **Es el sujeto de todo el dominio** *(ADR-16 §4.1)*. Su Registro es **la única operación atómica** *(ADR-13 §11.1)* |
| **`BuyerDiagnosis`** | **Pitch Generator** | Siete variables con clase, indicios y confianza · Commercial State · versión del criterio | `(Lead, nº de emisión)` | **Versionar** | Activo **A-11**, evento **E-7**, semántica **propia y distinta** de la secuencia *(ADR-13 §6.2)* |
| **`CommercialSequence`** | **Pitch Generator** | Plan de momentos · momento vigente · por contacto, su estrategia y su resultado | `(Lead, nº de secuencia)` | **Actualizar** | Activo **A-12**, evento **E-8**. **Se actualiza, no se versiona** — el rastro lo conserva A-8 |
| **`Proposal`** | **Pitch Generator** | Estrategia · lista cerrada · texto · canal · versión del criterio | `(Lead, momento, nº de emisión)` | **Versionar** | Activo **A-6**, evento **E-5**. **Regenerar añade** *(P-I2)*, semántica distinta de la secuencia que la contiene |
| **`ContactEvent`** | **El usuario** | Qué contacto se emitió · resultado declarado · manifestación, si la hubo | `(Lead, momento, marca temporal)` | **Solo crece** | Evento **E-9**, **autoría del usuario y no de un agente** *(CE-I4)*. **D-4 decide expresamente que producir y declarar son entidades distintas** |

## 5.3 Las tres reglas que gobiernan las fronteras

> **AG-1 — Toda identidad incluye al `Lead`.** Las cuatro entidades comerciales se identifican **por el Lead más un discriminante**, nunca de forma autónoma *(ADR-16 §4)*. **Se referencian entre sí por identidad, nunca conteniéndose.**

> **AG-2 — Una transacción, un agregado.** **Solo el Registro es atómico** *(ADR-13 §11.1)*. Todo lo demás **admite ejecución diferida**, y **una etapa fallida nunca retira un Lead ya registrado** *(ADR-13 §11.2 A-2 · R-64)*.

> **AG-3 — Toda escritura pasa por un evento declarado.** **El catálogo de ADR-13 §13.1 es cerrado**: *«ningún evento no enumerado aquí podrá escribir en la Biblioteca»* *(§13.4 · ADR-16 D-6)*. **Cuatro de los nueve son comerciales** —E-5, E-7, E-8, E-9— **y solo E-9 toca el estadio**.

## 5.4 Por qué `Proposal` no está dentro de `CommercialSequence`

**Es la frontera que más tienta a fundir**, porque la secuencia contiene, por cada contacto, su propuesta *(ADR-16 §4.3)*.

**No pueden compartir agregado por el criterio 3:** la secuencia **se actualiza** y la propuesta **se versiona**. Fundirlas obligaría a versionar la secuencia en cada emisión de texto —*«multiplicaría el volumen sin aportar nada»* *(ADR-13 §6.2)*— o a dejar de versionar la propuesta, **incumpliendo P-I2**.

**Es exactamente el mismo razonamiento con que ADR-13 §6.2 separó A-11 de A-12.** La secuencia **referencia** sus propuestas por identidad; no las contiene.

---

# 6. Invariantes

**Reglas que nunca pueden romperse.** **Ninguna es de autoría propia**, y **ninguna recibe un código nuevo**: se transcribe cada una con **el identificador que ya tiene en su documento**, para no añadir una serie más a un Blueprint que ya arrastra colisiones de código *(véase **OBS-09**)*.

## 6.1 Sobre el `Lead` — el dominio comercial no lo crea ni lo destruye

| # | Invariante | Fuente |
| --- | --- | --- |
| **PO-01 §8** | **Ninguna etapa expulsa a un Lead.** Un Lead que entra en la Biblioteca permanece en ella | PO-01 §8 · APS-07 §7.2 |
| **PO-01 §6** | **No existe Top N.** Ninguna consulta, tanda, cupo ni límite determina qué Leads existen | PO-01 §6 · ADR-11 §9 E-2 |
| **PO-01 §7** | **No existe umbral de exclusión.** Ninguna puntuación condiciona el registro, la conservación ni la presentación | PO-01 §7 · APS-08 §8.6 |
| **D-5** | **Ninguna entidad comercial registra, elimina, oculta, ordena ni puntúa Leads** | ADR-16 D-5 |
| **LS-1** | **Los estados del Lead son cuatro y la lista es cerrada** | PO-02 §5.1 |
| **LS-2** | **Ningún estado retira, oculta ni caduca un Lead.** No existe ni existirá un estado de expiración | PO-02 §5.1 |
| **LS-3** | **Los estados solo avanzan por el evento que los produce.** Emitir una Propuesta no cambia el estado | PO-02 §5.1 |
| **LS-4** | **Un Lead puede detenerse indefinidamente en cualquier estado.** Es válido, no es un error | PO-02 §5.1 |
| **CE-I1 · RC-14** | **Solo un `ContactEvent` produce `Contacted`** | ADR-16 §4.5, §8 |

## 6.2 Sobre la existencia — nada existe sin su sujeto

| # | Invariante | Fuente |
| --- | --- | --- |
| **ADR-16 §4.1** | **El `Lead` es el sujeto de todas las demás entidades: ninguna existe sin él** | ADR-16 §4.1 |
| **AG-1** | **Toda identidad comercial incluye al `Lead`** | ADR-16 §4.2-§4.5 |
| **CE-I2** | **Sin `ContactEvent` la secuencia no avanza.** El sistema no supone lo que no le consta | ADR-16 §4.5 |
| **CE-I4** | **`ContactEvent` nunca lo genera el sistema:** ni por inferencia, ni por tiempo, ni por detección | ADR-16 §4.5 · APS-09 §9 |

## 6.3 Sobre la escritura — nada se destruye

| # | Invariante | Fuente |
| --- | --- | --- |
| **RC-9** | **Ninguna entidad se destruye. Regenerar añade** | ADR-16 §8 · ADR-13 §10.2 |
| **S-1 · S-2** | **Nada se destruye; el historial solo crece** y ninguna entrada se altera retroactivamente | PO-02 §7.2 |
| **P-I2** | **Regenerar una `Proposal` nunca sustituye a la anterior** | ADR-16 §4.4 |
| **CS-I5** | **Una secuencia nueva no borra la anterior** | ADR-16 §4.3 |
| **D-6 · §13.4** | **Toda escritura pasa por un evento del catálogo cerrado de ADR-13 §13.1** | ADR-16 D-6 · ADR-13 §13.4 |
| **RC-13** | **Toda entidad emitida conserva la versión del criterio** que la produjo | ADR-16 §8 · ADR-15 RA-7 |

## 6.4 Sobre el estadio y el estado — dos ejes que nunca se confunden

| # | Invariante | Fuente |
| --- | --- | --- |
| **P-I3** | **Emitir una `Proposal` no cambia el estadio del Lead** | ADR-16 §4.4 |
| **BD-I4** | **El `Commercial State` es la variable BD-1 del diagnóstico**, no un campo del Lead ni un estadio | ADR-16 §4.2 |
| **LS-5** | **El estadio no es el Commercial State.** Aquél describe lo que AKVEZ ha hecho con el Lead; éste, lo que el comprador sabe. **Dos ejes independientes** | PO-02 §5.1 |
| **CS-R1 · CS-R2** | **El Commercial State puede retroceder y puede detenerse indefinidamente** | APS-18 §7.4 |
| **CS-R3** | **Solo avanza con evidencia.** Un contacto enviado no avanza el estado; **lo avanza la reacción del comprador** | APS-18 §7.4 |
| **CS-R4** | **Puede ser desconocido.** Un Lead nunca contactado tiene un estado indeterminado, y eso es correcto | APS-18 §7.4 |

## 6.5 Sobre el Opportunity Score — pertenece a otro dominio

| # | Invariante | Fuente |
| --- | --- | --- |
| **APS-19 §3.2** | **El sistema comercial consume el Score y la evidencia, y nunca los modifica** | APS-19 §3.2 |
| **APS-19 §3** | **Ningún resultado del diagnóstico puede alterar una puntuación, una banda ni una emisión de Score** | APS-19 §3 |
| **BD-I5 · RC-12** | **Ninguna entidad comercial produce puntuación, orden ni exclusión.** El diagnóstico **no es comparable entre Leads** | ADR-16 §4.2, §8 |
| **PO-01 §5** | El Score **no crea, no promueve y no expulsa** un Lead. Su única función operativa es **permitir ordenar** | PO-01 §5 · APS-08 §8.6 |
| **§7.5** | **Ningún Commercial State y ningún diagnóstico condiciona que un Lead pueda ser contactado.** El sistema **puede recomendar detener una secuencia; nunca puede excluir un Lead** | APS-18 §7.5 |

## 6.6 Sobre la evidencia — nada se afirma sin respaldo

| # | Invariante | Fuente |
| --- | --- | --- |
| **§11.1** | **Toda afirmación comercial debe poder rastrearse hasta un hallazgo del análisis** | APS-18 §11.1 |
| **RE-1** | **La lista de hechos afirmables es cerrada.** El redactor no puede salir de ella | APS-18 §11.3 · ADR-15 §10.2 |
| **RE-2** | **Lo inferido no cruza al mensaje.** Puede decidir el enfoque; **nunca enunciarse como hecho** | APS-18 §11.3 |
| **RE-3** | **Lo desconocido se declara, no se disimula** | APS-18 §11.3 |
| **P-I4** | **Ninguna afirmación de una `Proposal` carece de evidencia en la lista cerrada** | ADR-16 §4.4 |
| **BD-R2 · RC-10** | **Ninguna variable se rellena por defecto. La ausencia se representa como ausencia** | APS-18 §6.1 · ADR-16 §8 |
| **BD-I2** | **Ninguna variable *Desconocida* tiene valor asignado** | ADR-16 §4.2 |
| **§4.4** | **Prohibición absoluta: el sistema nunca afirma que un negocio teme, desconfía, ignora, se resiste ni está frustrado** | APS-19 §4.4 |
| **§4.3** | **Si una manifestación del comprador contradice una lectura inferida, prevalece la manifestación, sin excepción** | APS-19 §4.3 · CE-I3 |
| **§3.2** | **El canal no amplía la base de evidencia.** Contactar por una plataforma **no autoriza** a afirmar nada visto en ella | APS-20 §3.2 |
| **RC-11** | **Ninguna entidad contiene datos personales de terceros** | ADR-16 §8 · APS-19 §4.5 |

## 6.7 Sobre la ejecución — AKVEZ diseña; el usuario envía

| # | Invariante | Fuente |
| --- | --- | --- |
| **§2.1** | **Prueba del Disparador: si un contacto puede emitirse sin acción del usuario *para ese contacto concreto*, es automatización y está fuera de la V1** | PO-02 §2.1 |
| **RC-7 · CS-I4** | **Ninguna automatización.** Ningún contacto se emite sin acción del usuario para ese contacto concreto | ADR-16 §8, §4.3 |
| **RC-8 · CS-I6** | **Ningún disparador temporal en ninguna capa** | ADR-16 §8 · APS-18 SC-R6 |
| **§9.5** | **Sin declaración del usuario, la secuencia no avanza** | APS-18 §9.5 |
| **CS-I1** | **La secuencia es una propuesta, no un compromiso** | ADR-16 §4.3 |
| **CS-I3 · SC-R5** | **Agotar o detener una secuencia no expulsa al Lead** | ADR-16 §4.3 · APS-18 §9.3 |
| **P-I5** | **Una `Proposal` emitida y nunca enviada es un estado válido** | ADR-16 §4.4 |

## 6.8 Sobre la secuencia — cada contacto aporta algo

| # | Invariante | Fuente |
| --- | --- | --- |
| **SC-R3** | **Ningún contacto repite al anterior. Si no aporta algo nuevo, no se emite** | APS-18 §9.3 |
| **SC-R4** | **El silencio es información**, no fracaso, y no autoriza a subir la presión | APS-18 §9.3 |
| **§4.5** | **Cada contacto persigue un solo avance y no salta ningún peldaño** | APS-18 §4.5 |
| **§5.1** | **Una barrera por contacto.** Atacar varias produce un mensaje que no rompe ninguna | APS-18 §5.1 |
| **§4.7** | **Nunca se genera interés mediante ocultamiento deliberado.** Prohibido aludir a un hallazgo sin enunciarlo y condicionar información a una respuesta | APS-18 §4.7 |
| **§8.5** | **Miedo, vergüenza, culpa y presión temporal están excluidos por diseño.** La exclusión es **normativa, no estilística** | APS-18 §8.5 |
| **§3.1** | **Nunca se abrevia la estrategia hasta que quepa en el canal, y nunca se excede el canal para que quepa** | APS-20 §3.1 |

## 6.9 Sobre la frontera — quién decide y quién solo comunica

| # | Invariante | Fuente |
| --- | --- | --- |
| **D-1 · RA-1** | **Todo lo que decide vive en el dominio. Todo lo que expresa o comunica, fuera** | ADR-16 D-1 · ADR-15 §8 |
| **RC-2 · RA-2** | **Lo que comunica no decide objetivo, barrera, evidencia ni estrategia** | ADR-16 §8 · ADR-15 §13 |
| **RA-5** | **Ningún resultado generativo modifica un diagnóstico, un estado, una estrategia ni una secuencia. El texto es una salida terminal** | ADR-15 §8, §13 |
| **§10.3** | **Un texto que no supera el punto de control se rehace; no se entrega con advertencia** | ADR-15 §10 · APS-18 §10.3 |
| **RA-4** | **La lista cerrada se construye en el dominio y ninguna capa la amplía** | ADR-15 §13 |
| **D-3** | **La regla de canal es dominio; el valor numérico no** | ADR-16 D-3 |
| **RC-15** | **Ninguna unidad concentra más de una preocupación** | ADR-16 §8 |

---

# 7. Mapa de relaciones

**Entregable 3.**

## 7.1 Advertencia previa: hay dos mapas, y confundirlos es el error frecuente

**El dominio comercial tiene un mapa de *entidades* y un mapa de *decisión*, y no son el mismo.**

| Mapa | Qué representa | Autoridad |
| --- | --- | --- |
| **Relación entre entidades** | Qué objeto existe en función de cuál, y con qué cardinalidad | **ADR-16 §5** |
| **Flujo de decisión** | En qué orden se decide, de la evidencia al texto | **ADR-15 §7.3 · APS-18 §5** |

**Una lectura lineal *Lead → Diagnóstico → Estrategia → Secuencia → Propuesta → Contacto* mezcla los dos** y produce dos errores: sitúa `Commercial Strategy` como un objeto entre la secuencia y el diagnóstico —**no lo es** *(§3.6)*— e invierte el orden real, en el que **la secuencia precede a la estrategia de cada contacto** *(ADR-15 §7.3)*.

## 7.2 Mapa de entidades — el canónico

```text
                         ┌──────────────────────────────┐
                         │            LEAD              │  ◄── Aggregate Root
                         │  (Referencia de Origen,      │      Lo registra el Lead Hunter.
                         │              Usuario)        │      El dominio comercial NO lo crea
                         └──────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              │                         │                          │
              ▼                         ▼                          ▼
   ┌─────────────────────┐   ┌─────────────────────┐        ┌─────────────┐
   │   BuyerDiagnosis    │   │ CommercialSequence  │        │   estadio   │
   │  (Lead, nº emisión) │   │  (Lead, nº secuen.) │        │    (A-3)    │
   │  1 : 0..n           │   │  1 : 0..n           │        │             │
   │  ── VERSIONA ──     │   │  ── ACTUALIZA ──    │        └──────▲──────┘
   └──────────▲──────────┘   └──────────┬──────────┘               │
              │                         │ 1 : 0..n momentos        │
              │                         ▼                          │
              │              ┌─────────────────────┐               │
              │              │      Proposal       │               │
              │              │ (Lead, momento, nº) │               │
              │              │  ── VERSIONA ──     │               │
              │              └──────────┬──────────┘               │
              │                         │ 1 : 0..1                 │
              │                         ▼                          │
              │              ┌─────────────────────┐               │
              │   versiona   │    ContactEvent     │   ÚNICA VÍA   │
              └──────────────┤ (Lead, momento, ts) ├───────────────┘
                condicional  │  ── SOLO CRECE ──   │   hacia Contacted
                             │  Lo crea EL USUARIO │
                             └─────────────────────┘
```

**Identificador:** DDD-01-DIAG-001 · **Versión:** v1.0 · **Fecha de actualización:** 2026-07-30

## 7.3 Qué relación existe exactamente entre cada par

| Relación | Cardinalidad | Qué significa exactamente |
| --- | :-: | --- |
| **`Lead` → `BuyerDiagnosis`** | 1 : 0..n | **Puede no existir. Un Lead sin diagnóstico es válido.** Cada emisión añade una versión; la vigente es la más reciente y **ninguna anterior se destruye** |
| **`Lead` → `CommercialSequence`** | 1 : 0..n | **Varias a lo largo del tiempo.** Una nueva **no borra la anterior** *(CS-I5)*. Puede no existir ninguna |
| **`CommercialSequence` → `Proposal`** | 1 : 0..n | Una o varias emisiones **por momento**. **Regenerar añade** *(P-I2)*. La secuencia las referencia por identidad; **no las contiene** *(§5.4)* |
| **`Proposal` → `ContactEvent`** | 1 : **0..1** | **Una Propuesta puede no haberse enviado nunca** *(P-I5)*. La declaración se refiere al **momento**, no a una emisión concreta |
| **`ContactEvent` → `BuyerDiagnosis`** | 0..1 : 1 | **Solo si hubo manifestación.** Entonces **versiona el diagnóstico**, porque la manifestación prevalece sobre toda lectura inferida *(CE-I3 · APS-19 §4.3)* |
| **`ContactEvent` → estadio del `Lead`** | 0..n : 1 | **Única vía hacia `Contacted`** *(CE-I1 · RC-14)*. **Ningún otro evento comercial toca el estadio** |
| **`Commercial Strategy` ⊂ `Proposal`** | — | **Contención, no relación.** No es una entidad: es contenido *(§3.6)* |

## 7.4 Flujo de decisión — el otro mapa

```text
  Evidencia del Análisis  +  Opportunity Score        ← los produce el LEAD ANALYZER
              │                    │                    El sistema comercial los
              └──────────┬─────────┘                    RECIBE YA UNIDOS y nunca los busca
                         ▼
              ┌─────────────────────┐
              │  BuyerDiagnosis     │  ¿cómo se aborda?          DETERMINISTA
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ CommercialSequence  │  ¿qué contacto toca ahora? DETERMINISTA · con memoria
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ Commercial Strategy │  ¿qué hace este contacto?  DETERMINISTA · sin memoria
              └──────────┬──────────┘
   ══════════════════════╪══════════════════ LÍNEA DE DECISIÓN ══════════════
                         ▼
              ┌─────────────────────┐
              │    Redacción        │  ¿cómo se dice?            GENERATIVA
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │  Punto de control   │  ¿es admisible?            DETERMINISTA
              └─────────────────────┘   → si no lo supera, SE REHACE
```

**Identificador:** DDD-01-DIAG-002 · **Versión:** v1.0 · **Fecha de actualización:** 2026-07-30

*(ADR-15 §7.3, §8, §10 · APS-18 §5)*

> **La distinción determinante entre secuencia y estrategia:** **la secuencia decide *qué contacto viene ahora*; la estrategia decide *qué hace ese contacto*.** La primera tiene memoria; la segunda no la necesita. **Confundirlas haría la estrategia irreproducible** *(ADR-15 §7.2)*.

> **`Proposal` es el único objeto que atraviesa la Línea de Decisión, y en un solo sentido.** El dominio construye la lista cerrada → el modelo redacta con ella → **el dominio verifica contra ella**. **Ninguna decisión la cruza hacia abajo y ningún resultado generativo la cruza hacia arriba.**

---

# 8. Glosario oficial

**Entregable 4.** **Un concepto, un nombre.** Los sinónimos prohibidos lo están porque **contradicen un documento aprobado**, no por preferencia de estilo.

| Término oficial | Definición | ❌ No usar | Por qué | Aparece en |
| --- | --- | --- | --- | --- |
| **Empresa** | Negocio real que AKVEZ ha encontrado y sobre el que dispone de información pública. **Es un hecho del mundo, no un juicio** | *Prospect* · *Negocio candidato* | `Prospect` es terminología del modelo derogado *(PO-02 §5.1, defecto 1 · R-59)* | PO-01 §1 · APS-07 · ADR-12 |
| **Lead** | Empresa incorporada al espacio de trabajo comercial de **un usuario concreto** | *Prospect* · *Oportunidad* · *Contacto* | `Prospect` contradice PO-01 §2 y **R-59**. *Contacto* designa un hecho, no un objeto | PO-01 §2 · todos |
| **Registro** | Evento que convierte una Empresa en Lead. **Es la única definición válida** | *Guardado* · *Alta* · *Import* | PO-01 §3 lo declara evento único y nombrado | PO-01 §3 · ADR-13 §11.1 |
| **Biblioteca de Leads** | Todas las Empresas descubiertas para un usuario, cada una con todo su conocimiento acumulado. **Todo lo que hay en ella es un Lead** | *Lista* · *Resultados* · *Empresas procesadas* | Una **vista** es una proyección ordenada; **la Biblioteca solo crece** *(PO-01 §4 · APS-07 §8.3)* | PO-01 §4 |
| **Estadio del ciclo de vida** | Lo que **AKVEZ ha hecho** con el Lead. Cuatro valores: **`Lead · Analyzed · Scored · Contacted`** | *Buying Stage* · *Contact Stage* · *Contact Status* · *Prospect* · *Audited* · *Pitched* · *Replied* · *Won* · *Stale* | Los seis últimos **están retirados** *(PO-02 §5.1)*. *Buying Stage* **no existe** y confunde estadio con Commercial State *(LS-5)* | PO-02 §5.1 · PO-01 §8 |
| **Lead Contactado** | Lead respecto del cual **el usuario ha declarado** haber emitido un contacto | *Contacted Lead* · *Lead con propuesta generada* | La segunda es **la definición derogada**: emitir una Propuesta **no contacta a nadie** *(PO-02 §5 · P-I3)* | PO-02 §5 · PO-01 §8 |
| **Opportunity Score** | Puntuación 0-100 del potencial comercial de un Lead **para este usuario**. **Pertenece al Lead Analyzer** | *Lead Score* · *Business Score* · *Company Rating* | **Prohibidos literalmente por ADS-00**, *Terminología* | PO-01 §5 · APS-08 · ADR-14 |
| **Banda** | Traducción legible del Score, de *Oportunidad Excelente* a *Muy Baja* | *Categoría* · *Tier* · *Grado* | APS-08 §8 fija el término | APS-08 §8 |
| **BuyerDiagnosis** | La lectura comercial de un negocio: **cómo abordarlo** | *Commercial Diagnosis* · *Perfil del comprador* · *Buyer Profile* | **Ninguno aparece en documento aprobado.** ADR-13 lo designa **«Diagnóstico Comercial»** como activo A-11 *(**OBS-03**)* | APS-19 · ADR-16 §4.2 |
| **Commercial State** | La posición psicológica del comprador. **Es la variable BD-1 del diagnóstico** | *Buying Stage* · *Estado del Lead* · *LeadStatus* | **No es un estadio ni un campo del Lead** *(BD-I4 · LS-5)*. Confundirlos es el riesgo **R-6** de ADR-16 | APS-18 §7 · APS-19 §5 |
| **Indicio** | **Hecho público observable** del que se deriva una lectura. **El indicio es un hecho; la lectura no** | *Buyer Signals* · *Señal* · *Insight* | **No aparecen en ningún documento aprobado** *(**OBS-04**)*. *Insight* además sugiere conclusión, no hecho | APS-19 §4.1 |
| **Clase de conocimiento** | *Observable · Inferida · Desconocida* | *Nivel de certeza* · *Score de confianza* | Es un conjunto cerrado de tres valores, no una magnitud | APS-19 §4.2 · APS-18 §11.2 |
| **Commercial Strategy** | Las decisiones que gobiernan **un** contacto | *Plan* · *Táctica* · *Playbook* | *Plan* designa la **Secuencia**; usarlo aquí funde dos conceptos que ADR-15 §7.2 separa | APS-18 §8 |
| **CommercialSequence** | El plan de contactos propuesto para conseguir una conversación | *Campaña* · *Cadencia* · *Drip* · *Follow-up automático* | Las tres últimas implican **automatización**, fuera de la V1 *(PO-02 §2 · SC-R6)* | PO-02 §4 · APS-18 §9 |
| **Momento** | Uno de los seis pasos de la secuencia | *Paso* · *Touchpoint* · *Toque* | APS-18 §9.2 fija el término y el conjunto | APS-18 §9.2 |
| **Proposal** | Estrategia, evidencia y texto de **un** contacto. **No es solo el texto** | *Pitch* · *Mensaje* · *Copy* · *Outreach* | Reducirla al texto **contradice P-I1**: sin estrategia y evidencia no puede explicarse después | PO-02 §3 · ADR-16 §4.4 |
| **ContactEvent** | Lo que el usuario **declara** que ocurrió | *Envío* · *Interacción* · *Actividad* · *Touch* | AKVEZ **no envía y no observa** *(PO-02 §6.2)*. *Envío* atribuiría al sistema un acto del usuario | ADR-16 §4.5 · ADR-13 E-9 |
| **Manifestación del comprador** | Lo que el comprador dijo. **Prevalece sobre toda lectura inferida** | *Respuesta* · *Feedback* | *Respuesta* no distingue entre responder y **manifestar algo aprovechable** *(ADR-16 §6.1)* | APS-19 §4.3 |
| **Micro-Yes** | El **único** avance que persigue un contacto | *Objetivo múltiple* · *CTA* | Un contacto persigue **un solo** peldaño *(APS-18 §4.5)* | APS-18 §4.5 |
| **Barrera** | La **única** resistencia que un contacto debe romper | *Objeción* | Una objeción se formula; **una barrera existe antes de que nadie hable** | APS-18 §5.1 |
| **Hilo** | Pregunta o asunto que un contacto **enuncia** y el siguiente retoma. **Es respondible** | *Bucle* · *Loop* · *Gancho* | **`Bucle` fue retirado del vocabulario en APS-18 v1.1**: era el vehículo léxico del ocultamiento | APS-18 §4.6 |
| **Progressive Relevance** | Generar interés mediante **relevancia progresiva, evidencia específica y claridad contextual** | *Mental Debt* · *Curiosity gap* | **`Mental Debt` fue eliminado en APS-18 v1.1** por incompatible con el **Principio 10 de AF-00** | APS-18 §4.7 |
| **Hecho afirmable** | Conocimiento **Observado** que un contacto puede enunciar | *Dato* · *Argumento* | Solo lo **Observado** puede afirmarse; lo Inferido **nunca** *(RE-2)* | APS-18 §11.3 |
| **Lista cerrada de hechos afirmables** | El conjunto completo de lo que un contacto puede afirmar. **Ninguna capa la amplía** | *Contexto* · *Prompt context* | *Contexto* sugiere algo ampliable; **es cerrada** *(RE-1 · RA-4)* | ADR-15 §10.2 |
| **Punto de control** | Verificación de todo texto contra su estrategia y su lista cerrada | *Validación* · *Filtro* · *Guardrail* | Un filtro deja pasar con advertencia; **esto rehace** *(ADR-15 §10)* | ADR-15 §10 |
| **Línea de Decisión** | La frontera única: **todo lo que decide, en el dominio; todo lo que expresa o comunica, fuera** | *Separación de capas* | Designa una frontera **única y verificable**, no un principio general | ADR-15 §8 |
| **Canal** | Superficie de comunicación con reglas propias de longitud, registro y formato | *Integración* · *Conector* | **Un canal no es una integración**: no existe ninguna *(APS-20 §3.4)* | APS-20 §3 |
| **Perfil de Estrategia** | Artefacto **versionado e inmutable en caliente** que codifica el criterio comercial | *Configuración* · *Parámetros* | Un parámetro se ajusta; **esto se versiona y vincula a cada emisión** *(RA-7)* | ADR-15 §7.4 |
| **Perfil de Ponderación** | El artefacto equivalente para el Opportunity Score. Versión vigente: **WP-01** | *Pesos* · *Weights* | ADR-14 §7 fija el término | ADR-14 §7 · APS-08 §7.1 |
| **Referencia de Origen** | `(Fuente, Designación)` — identidad natural de la Empresa | *ID externo* · *Place ID* | **La Fuente es inseparable** y el nombre del proveedor **no entra en el dominio** *(ADR-11 §9 E-6)* | ADR-12 §7.1 |
| **Huella de Identidad** | `(denominación, localización)` — identidad **subsidiaria y provisional** | *Fallback ID* · *Clave alternativa* | Es **provisional y reconciliable**, no una clave alternativa estable *(S-1, S-2)* | ADR-12 §7.3 |

---

# 9. Autoridad por concepto

**Un concepto, una autoridad.** Ante discrepancia entre este documento y la autoridad, **prevalece la autoridad**.

## 9.1 La regla que separa autoridad de desarrollo

> **Autoridad es quien decide que el concepto existe y qué lo delimita. Desarrollo es quien detalla su contenido sin poder cambiar sus límites.**

**Un concepto tiene exactamente una autoridad.** Puede tener varios documentos que lo desarrollen, y eso **no lo convierte en un concepto con dos dueños**: ante discrepancia, **prevalece la autoridad**, y el documento de desarrollo es el defectuoso.

**Cuando dos documentos parecen decidir lo mismo, uno de los dos decide otra cosa.** El ejemplo canónico es el Opportunity Score: **PO-01 §5 decide qué es** —un atributo que ordena y no expulsa—, **APS-08 decide cómo se calcula** y **ADR-14 decide quién puede cambiar sus pesos**. **Tres decisiones distintas, sin solape.**

## 9.2 Tabla de autoridad

| Concepto | Autoridad única | Por qué esa y no otra |
| --- | --- | --- |
| **Empresa · Lead · Registro · Biblioteca** | **PO-01** | Orden 2. Es la decisión canónica del dominio |
| **Estadios del Lead · cuándo está Contactado** | **PO-02 §5, §5.1** | Orden 2. **Sustituye a PO-01 §8 solo en la transición a `Contacted`** |
| **Alcance del sistema comercial** | **PO-02 §6** | Orden 2 |
| **Identidad del Lead y de la Empresa** | **ADR-12** | Único documento que la decide |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** | Catálogo cerrado de activos y eventos |
| **Opportunity Score** | **PO-01 §5** — *qué es y qué no hace* | **APS-08** decide **cómo se calcula** y **ADR-14** decide **quién puede cambiar sus pesos**. Tres decisiones distintas, sin solape *(§9.1)* |
| **Criterio comercial: principios, estrategia, secuencia, evidencia** | **APS-18** | Es el equivalente comercial de APS-08 |
| **Commercial State** | **APS-18 §7** | Lo define; APS-19 §5 lo desarrolla como BD-1 |
| **Las siete variables y cómo se leen** | **APS-19** | Cierra la frontera que APS-18 §6.2 declaró |
| **Canales y sus restricciones** | **APS-20** | Cierra la frontera de APS-18 §2 y APS-19 §2 |
| **Dónde vive cada preocupación · Línea de Decisión · punto de control** | **ADR-15** | Orden 4 |
| **Entidades, invariantes, eventos y casos de uso comerciales** | **ADR-16** | Orden 4. **Es la autoridad del modelo de dominio** |
| **Perfil de Estrategia** *(existencia y ubicación)* | **ADR-15 §7.4** | ⏸️ Su **gobernanza** está `Pospuesta` y **exige ADR propio** |
| **El vocabulario de este documento** | **DDD-01** *(sin autoridad propia)* | **Nombra; no decide.** Toda entrada remite a las anteriores |

---

# 10. Observaciones

**Entregable 5.** **Diez observaciones. Ninguna se corrige aquí**, conforme a la restricción del sprint. **Ninguna es un error de decisión**: son defectos de forma, huecos de vocabulario o desincronizaciones menores.

| # | Observación | Severidad | Dónde |
| :-: | --- | :-: | --- |
| **OBS-01** | **«DDD» no pertenece a la Clasificación Oficial de ADS-00**, que es cerrada. Este documento se emite con el precedente de **ARCH-01** y **ADS-API-01**, declarando expresamente que **no tiene autoridad**. **Incorporar la categoría o confirmar el precedente corresponde al Product Office** | Media | ADS-00, *Clasificación Oficial* |
| **OBS-02** | **`Commercial Strategy` no es una entidad.** **ADR-16 §4 define cinco y no la incluye**; **ARCH-01 §3** la sitúa como *«parte de `Proposal`»*. El enunciado del sprint la listaba entre las entidades. **Se documenta como Value Object**, conforme a los documentos aprobados | Baja | §2.1 · §3.6 |
| **OBS-03** | **El mismo objeto tiene dos nombres oficiales.** **ADR-16 §4.2 y APS-19** lo llaman **`BuyerDiagnosis`**; **ADR-13 A-11 y E-7** lo llaman **«Diagnóstico Comercial»**. **ADS-00, *Terminología*: «un concepto tendrá un único nombre oficial».** Este documento adopta `BuyerDiagnosis` por ser el nombre de la entidad en su autoridad de modelo, **sin decidir nada** | **Media** | ADR-16 §4.2 · ADR-13 §6.2 |
| **OBS-04** | **«Buyer Signals» y «Buying Stage» no aparecen en ningún documento aprobado.** Los conceptos existentes son **Indicio** *(APS-19 §4.1)* y, para el segundo, **dos conceptos distintos que el Blueprint separa expresamente**: el **Commercial State** y el **estadio del ciclo de vida** *(LS-5 · BD-I4)*. **Introducirlos reintroduciría la confusión que R-6 de ADR-16 previene** | **Media** | §4.1 · §8 |
| **OBS-05** | **APS-18 §7.6 quedó superada y no se actualizó.** Declara que la relación entre Commercial State y `LeadStatus` *«no puede decidirse hoy»* porque **A-01 está abierta**. **A-01 está `Closed`** *(PO-02 §5.1 · AR-05 §5.1)* y **LS-5 sí declara la relación**: son dos ejes independientes | **Media** | APS-18 §7.6 |
| **OBS-06** | **Divergencia en los activos que escribe E-9.** **ADR-16 §6** le atribuye **A-7 · A-8**; **ADR-13 §13.1** le atribuye **A-3, A-11, A-12, A-8** —sin A-7—; y **ADR-16 §6.1**, dentro del mismo documento, enumera **A-3, A-12, A-8** y condicionalmente **A-11**. **Las tres listas difieren.** Prevalece ADR-13, que es el catálogo | **Media** | ADR-16 §6 · ADR-13 §13.1 |
| **OBS-07** | **Dos vocabularios para los cuatro estadios.** **PO-02 §5.1** fija **`Lead · Analyzed · Scored · Contacted`**; **ADR-13 A-3** los enumera como *«Lead · Analizado · Evaluado · Contactado»*. Es la misma lista en dos idiomas y **PO-02 prevalece**, pero un lector puede creer que son conjuntos distintos | Baja | ADR-13 §6.2 · PO-02 §5.1 |
| **OBS-08** | **`Proposal` → `ContactEvent` se declara 1 : 0..1** *(ADR-16 §5)*, pero **la identidad del `ContactEvent` es `(Lead, momento, marca temporal)`**, no `(Proposal, …)`. **La relación es en rigor momento → `ContactEvent`**, y un momento puede tener varias emisiones de `Proposal`. **No es una contradicción; es una imprecisión de la tabla de cardinalidades** | Baja | ADR-16 §4.5, §5 |
| **OBS-09** | **Colisión de identificadores entre documentos.** `RC-1` designa una restricción en ADR-16 §8 y un riesgo en AR-05 §8; `R-1` a `R-9`, riesgos en ADR-16 §9 y reglas en ADS-00; `E-1` a `E-6`, materias cerradas en ADR-11 §9 y eventos en ADR-13 §13.1. **Por eso §6 de este documento no crea ninguna serie nueva** y cita cada invariante con su código de origen. Ya advertido en **ADS-01 §10** | Media | Transversal |
| **OBS-10** | **DDD-01 no está catalogado en INDEX ni en ADS-01.** **Es la cadencia normal, no deuda**: ambos se sincronizan **al cerrar un bloque de gobernanza**, no tras cada sprint. Se anota para que el próximo lo recoja, junto con el alta de la carpeta `DDD/` en INDEX §3 | Baja | INDEX · ADS-01 |

> **Ninguna de las diez impide usar este documento.** **OBS-03 y OBS-04 son las que más afectan al lenguaje**, que es lo que este documento existe para fijar: la primera porque un concepto tiene dos nombres, la segunda porque el sprint proponía dos que no existen. **Ambas se han resuelto adoptando el término aprobado y registrando la alternativa como prohibida**, sin modificar ningún documento.

## 10.1 Validación de las diez observaciones — v1.1

**Revisadas una a una en el sprint de cierre. Ninguna se corrige, ninguna se resuelve y ninguna se reinterpreta.**

**El criterio de la revisión es uno solo:**

> **Una observación deja de serlo y pasa a ser una decisión si su resolución exige elegir entre alternativas, cambiar un nombre oficial o alterar una regla.** Mientras no exija ninguna de las tres, **es un registro y se conserva como tal.**

| # | ¿Sigue siendo observación? | Por qué no es una decisión |
| :-: | :-: | --- |
| **OBS-01** | ✅ Sí | Registra un **hecho de clasificación**: «DDD» no está en ADS-00. **No propone incorporarla.** Decidirlo corresponde al Product Office |
| **OBS-02** | ✅ Sí | **Registra lo que ADR-16 §4 ya decidió** —cinco entidades, y `Commercial Strategy` no está entre ellas—. **No decide nada: constata.** Véase la nota ampliada abajo |
| **OBS-03** | ✅ Sí | Registra que **dos documentos aprobados usan dos nombres** para el mismo objeto. **No elige entre ellos.** Véase la nota ampliada abajo |
| **OBS-04** | ✅ Sí | Registra que **dos términos del enunciado no existen** en ningún documento aprobado. **No los prohíbe por criterio propio.** Véase la nota ampliada abajo |
| **OBS-05** | ✅ Sí | Registra que **APS-18 §7.6 quedó superada** por hechos posteriores —el cierre de A-01 y LS-5—. **Corregir §7.6 exigiría modificar un APS**, prohibido |
| **OBS-06** | ✅ Sí | Registra que **tres listas de activos para E-9 difieren**. **No decide cuál es correcta**: se limita a señalar que ADR-13 es el catálogo |
| **OBS-07** | ✅ Sí | Registra **dos vocabularios para los cuatro estadios**. **No unifica**: constata que PO-02 prevalece por rango |
| **OBS-08** | ✅ Sí | Registra una **imprecisión de cardinalidad**. **Declara expresamente que no es una contradicción** |
| **OBS-09** | ✅ Sí | Registra una **colisión de identificadores ya advertida en ADS-01 §10**. **No renumera nada** |
| **OBS-10** | ✅ Sí | Registra un **estado de cadencia normal**, no una deuda. **No sincroniza el INDEX** |

**Las diez siguen siendo observaciones. Ninguna se ha convertido en decisión.**

### Las tres que el sprint pidió verificar expresamente

> **OBS-02 — `Commercial Strategy` no es una entidad.**
>
> **Sigue siendo observación, y es importante entender por qué.** No dice *«debería ser un Value Object»*: dice que **ADR-16 §4 define cinco entidades y no la incluye**, y que **ARCH-01 §3 la sitúa como *«parte de `Proposal`»***. **Son dos hechos documentales, no un juicio.**
>
> **Este documento la clasifica como Value Object aplicando el criterio de §4** —sin identidad, sin activo, sin evento—, **que también es transcripción**: los tres hechos proceden de ADR-16 §4 y ADR-13 §6.2 y §13.1. **Si el Product Office decidiera que es una entidad, el defecto estaría aquí y en ADR-16, no en la observación.**

> **OBS-03 — El mismo objeto tiene dos nombres oficiales.**
>
> **Sigue siendo observación, y no se resuelve.** **ADR-16 §4.2 y APS-19** lo llaman `BuyerDiagnosis`; **ADR-13 A-11 y E-7** lo llaman «Diagnóstico Comercial».
>
> **Este documento adopta `BuyerDiagnosis` y eso no es resolverla.** Adoptar un nombre para poder redactar **no decide cuál es el oficial ni corrige el otro documento**: el punto 3 de la Definition of Done lo eleva al Product Office, y **§12 sigue pidiendo ese pronunciamiento en la v1.1**. **Mientras no llegue, ambos nombres siguen apareciendo en documentos `Approved`.**

> **OBS-04 — «Buyer Signals» y «Buying Stage» no existen en el Blueprint.**
>
> **Sigue siendo observación.** No es un juicio sobre si son buenos términos: **es la constatación de que no aparecen en ningún documento aprobado**, verificada por búsqueda directa.
>
> **El glosario los registra como prohibidos, y tampoco eso los resuelve.** Lo prohibido no lo decide este documento: lo decide que **el concepto aprobado es *Indicio*** *(APS-19 §4.1)* y que **«Buying Stage» confunde dos conceptos que LS-5 y BD-I4 separan expresamente**. **Si el Product Office quisiera adoptarlos, tendría que modificar APS-19 y PO-02** — decisión que ni se propone ni se anticipa aquí.

---

# 11. Referencias

**Solo documentos `Approved`.** Ningún concepto de este glosario deriva de un documento en `Draft` ni `Archived`.

## 11.1 Autoridad de dominio

- **PO-01 v1.2** — §1, §2, §3, §4, §5, §6, §7, §8. **La decisión canónica del dominio.**
- **PO-02 v1.3** — §2, §2.1, §3, §4, §5, §5.1 *(LS-1 a LS-5)*, §6, §7. **Autoridad del sistema comercial.**

## 11.2 Especificación del producto

- **APS-08 v1.2** — §6, §8, §9, §11. Opportunity Score, bandas y explicabilidad.
- **APS-09** — §7 *(Nivel 2)*, §9. La decisión de contactar es del usuario.
- **APS-18 v1.2** — §4.5, §4.6, §4.7, §5, §5.1, §5.2, §6, §7, §8, §9, §10, §11.
- **APS-19 v1.1** — §3, §4, §5, §6, §7.
- **APS-20 v1.1** — §3, §5, §6, §7.
- **APS-03 v3.1** — §7.1, §7.2, §7.3. Reparto entre agentes.
- **APS-07 v2.1** — §7.2, §8, §8.4, §16.

## 11.3 Arquitectura

- **ADR-11 v2.1** — §8.1, §9. Ninguna limitación técnica reside en el dominio.
- **ADR-12 v1.1** — §7.1, §7.2, §7.3, §7.4. Identidad canónica.
- **ADR-13 v1.2** — §6.2 *(A-1 a A-12)*, §10.2, §10.3, §11.1, §11.2, §13.1 *(E-1 a E-9)*, §13.4.
- **ADR-14 v1.2** — §7. Perfil de Ponderación.
- **ADR-15 v1.2** — §7.2, §7.3, §7.4, §8, §10, §12, §13.
- **ADR-16 v1.1** — §3 *(D-1 a D-6)*, §4 *(las cinco entidades y sus invariantes)*, §5, §6, §8 *(RC-1 a RC-15)*.
- **ARCH-01 v1.3** — §2, §3. Localización de las capacidades comerciales.

## 11.4 Estándares

- **ADS-00 v1.3** — *Clasificación Oficial*, *Jerarquía Documental*, *Terminología*, *Estados del Documento*.
- **ADS-01 v1.4** — mapa tema → documento canónico.

---

# 12. Definition of Done

Este documento podrá pasar a `Approved` cuando el **AKVEZ Product Office**:

1. **Confirme el precedente de clasificación** de **OBS-01**: que un documento de lenguaje ubicuo puede emitirse fuera de la Clasificación Oficial con el criterio de ARCH-01, **sin adquirir autoridad**.
2. **Ratifique el glosario de §8** —y en particular sus **sinónimos prohibidos**— como vocabulario obligatorio de todo documento, código y conversación del dominio comercial.
3. **Se pronuncie sobre OBS-03**: cuál de los dos nombres —`BuyerDiagnosis` o *«Diagnóstico Comercial»*— es el oficial, y **en qué documento se corrige el otro**.
4. **Confirme la identificación de los cinco Aggregate Roots** de §5 como lectura correcta de ADR-16 §4 y ADR-13 §6.2, **o la corrija**.
5. **Confirme que `Commercial Strategy` no es una entidad** *(OBS-02)*.

> ## ✅ Los cinco puntos quedan cumplidos — 2026-07-30
>
> | # | Resolución |
> | :-: | --- |
> | **1** | ✅ **Confirmado el precedente de ARCH-01.** «DDD» se emite fuera de la Clasificación Oficial **sin adquirir autoridad**. **OBS-01 se conserva** |
> | **2** | ✅ **Ratificado el glosario de §8** —31 términos y sus sinónimos prohibidos— como **vocabulario obligatorio** de todo documento, código y conversación del dominio comercial |
> | **3** | ⏸️ **`BuyerDiagnosis` es el nombre que este documento usa; el pronunciamiento sobre cuál es el oficial no se emite en este sprint**, que es exclusivamente editorial. **OBS-03 permanece abierta y su corrección exigirá modificar ADR-13 o ADR-16** |
> | **4** | ✅ **Confirmados los cinco Aggregate Roots** de §5 como lectura correcta de ADR-16 §4 y ADR-13 §6.2, §10.2 y §11.1 |
> | **5** | ✅ **Confirmado que `Commercial Strategy` no es una entidad**, sino un **Value Object contenido en `Proposal`** *(OBS-02)* |
>
> **El punto 3 no bloquea la aprobación.** Es una discrepancia entre dos documentos ajenos a éste, registrada como **OBS-03** y cuyo destinatario es el Product Office. **DDD-01 usa un nombre y declara el otro; no decide entre ellos.**

**Este documento está en `Approved` desde la v1.1** *(2026-07-30)*.

> **DDD-01 no bloquea nada.** Todo su contenido es transcripción de decisiones ya vinculantes: **su fuerza procede de los documentos que cita, no de sí mismo.** Un desarrollador puede usarlo como mapa de vocabulario, **y ante cualquier discrepancia debe seguir la autoridad, no este documento.**

---

# Apéndice A — Concept Lifecycle

## A.1 Qué es este apéndice, y sobre todo qué no es

> ## ⚠️ **Este diagrama NO representa un flujo de ejecución.**
>
> **No es una secuencia de pasos. No es un caso de uso. No es un orden temporal. No es arquitectura.** Nada de lo que aparece aquí describe **cuándo** ocurre algo ni **quién** lo ejecuta.
>
> **Representa una sola cosa: qué concepto no puede entenderse sin el anterior.**

**AKVEZ tiene tres vistas del dominio comercial y son distintas.** Confundirlas es el error más frecuente al leer este documento:

| Vista | Qué representa | Dónde |
| --- | --- | :-: |
| **Relación entre entidades** | Qué objeto existe en función de cuál, **con cardinalidad** | §7.2 — *DIAG-001* |
| **Flujo de decisión** | En qué orden se decide, **de la evidencia al texto** | §7.4 — *DIAG-002* |
| **Ciclo de vida conceptual** | **Qué concepto presupone a cuál para poder ser definido** | **Este apéndice** |

**Un ejemplo de la diferencia, y es el que más aclara:** en el **flujo de decisión**, el diagnóstico produce la secuencia y la secuencia produce la estrategia. En el **ciclo de vida conceptual**, la estrategia **no aparece**, porque no es un objeto del dominio: es contenido de la `Proposal` *(§3.6)*.

## A.2 La cadena de presuposición

```text
                    ┌───────────────────────────────────────────────┐
                    │                     LEAD                      │
                    │   Una Empresa incorporada al espacio de       │
                    │   trabajo comercial de un usuario concreto    │
                    └───────────────────────┬───────────────────────┘
                                            │
                       no puede haber un diagnóstico
                        de un negocio que no es Lead
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │                BUYERDIAGNOSIS                 │
                    │   La lectura comercial: cómo se aborda        │
                    └───────────────────────┬───────────────────────┘
                                            │
                        no puede planificarse un contacto
                          sin saber cómo se aborda
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │              COMMERCIALSEQUENCE               │
                    │   El plan de contactos hasta la conversación  │
                    │   ── contiene: Commercial Strategy (VO) ──    │
                    └───────────────────────┬───────────────────────┘
                                            │
                       una propuesta es la de UN momento
                             de un plan que existe
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │                   PROPOSAL                    │
                    │   Estrategia, evidencia y texto de un contacto│
                    │   ── contiene: Commercial Strategy (VO) ──    │
                    └───────────────────────┬───────────────────────┘
                                            │
                      no puede declararse un contacto
                        que nunca se preparó
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │                 CONTACTEVENT                  │
                    │   Lo que el usuario declara que ocurrió       │
                    └───────────────────────────────────────────────┘
```

**Identificador:** DDD-01-DIAG-003 · **Versión:** v1.0 · **Fecha de actualización:** 2026-07-30

**Las flechas significan «no puede definirse sin».** No significan *«ocurre después de»*, ni *«lo produce»*, ni *«lo invoca»*.

## A.3 Cómo se lee cada eslabón

| Eslabón | Qué presupone exactamente | Fuente |
| --- | --- | --- |
| **`Lead`** | Nada del dominio comercial. **Es el sujeto: ninguna otra entidad existe sin él** | ADR-16 §4.1 |
| **`BuyerDiagnosis`** | Un `Lead`. Su identidad **es `(Lead, nº de emisión)`**: sin Lead no hay identidad posible | ADR-16 §4.2 |
| **`CommercialSequence`** | Un `Lead`, y **conceptualmente un diagnóstico**: un plan de contactos que no sabe cómo se aborda el negocio no es un plan | ADR-16 §4.3 · ADR-15 §7.3 |
| **`Proposal`** | Un **momento** de una secuencia. Su identidad **es `(Lead, momento, nº de emisión)`** | ADR-16 §4.4 |
| **`ContactEvent`** | Un **momento** respecto del cual declarar. Su identidad **es `(Lead, momento, marca temporal)`** | ADR-16 §4.5 |

## A.4 Cuatro precisiones sin las cuales la cadena se malinterpreta

> **A-1 — Es una cadena de presuposición, no de obligación.** **Ningún eslabón es obligatorio.** Un Lead sin diagnóstico es válido; un diagnóstico sin secuencia, también. **ADR-16 §5 declara las cardinalidades como `1 : 0..n`** precisamente por esto, y **PO-01 §8 lo dice del ciclo entero: *«detenerse es válido»***.

> **A-2 — La cadena no describe el orden en que se decide.** En el **flujo de decisión**, la secuencia se diseña **antes** que la estrategia de cada contacto *(ADR-15 §7.3)*. **Leer este apéndice como orden de ejecución produce ese error.**

> **A-3 — `Commercial Strategy` no es un eslabón.** No aparece como nodo porque **no es un objeto del dominio**: es contenido de `Proposal` y de cada momento de `CommercialSequence` *(§3.6 · OBS-02)*. **Se dibuja dentro de las dos cajas que la contienen, nunca entre ellas.**

> **A-4 — El último eslabón lo produce una persona, no el sistema.** `ContactEvent` **es la única entidad que AKVEZ no produce** *(ADR-16 §4.5)*, y **CE-I4** lo blinda: no la genera **ni por inferencia, ni por tiempo, ni por detección**. **La cadena termina fuera del sistema, y es deliberado.**

## A.5 Lo que la cadena no dice

| No dice | Dónde sí está |
| --- | --- |
| Cuándo ocurre cada cosa | **Nunca se decide.** El sistema **no tiene disparadores temporales** *(RC-8 · CS-I6)* |
| Quién ejecuta cada paso | §2.0 y la fila **Owner** de cada ficha de §3 |
| Qué evento escribe cada objeto | §2.1, columna *Evento* · ADR-13 §13.1 |
| Cuántos de cada uno puede haber | §7.3 — cardinalidades |
| En qué capa vive cada cosa | **Fuera de este documento** — ADR-15 · ARCH-01 |
