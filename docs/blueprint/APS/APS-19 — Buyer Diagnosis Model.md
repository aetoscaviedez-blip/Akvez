# APS-19 — Buyer Diagnosis Model

## APS-19 — Buyer Diagnosis Model

**Versión:** 1.1

**Estado:** ✅ Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Aprobado por:** AKVEZ Product Office — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30

**Estándar Aplicado:** ADS-00 v1.3

**Autoridad de dominio:** PO-01 v1.2 · **PO-02 v1.3** (Approved) · APS-07 v2.1 (Approved) · **APS-18 v1.2** (marco comercial, Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-30 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierran las **dos cuestiones elevadas de §12**: **Q-1 `Closed`** por ADR-13 v1.2 y **Q-2 `Closed`** confirmando las denominaciones epistémicas de APS-18 §7.2. Se incorpora **§17** con la constancia de la ratificación. Se actualizan las versiones citadas en la portada y en **§13** —APS-07 v2.0 → **v2.1**, APS-03 v3.0 → **v3.1**, APS-18 v1.1 → **v1.2**— y se da de alta **PO-02 v1.3**. **No se modifica ninguna sección de contenido:** ni §3, ni el principio de evidencia de §4, ni el Modelo de Consciencia de §5, ni las siete variables de §6, ni la confianza de §7, ni la relación con la Estrategia de §8, ni los 21 criterios de §9, ni los riesgos de §11. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 3. Verificadas la distinción respecto del **Opportunity Score** y la del **Commercial State**, que son las dos fronteras que este documento existe para sostener. |
| 1.0 | 2026-07-30 | AKVEZ Product Office | Primera definición oficial del **modelo de diagnóstico comercial del comprador**: su distinción respecto del Opportunity Score, el principio de evidencia aplicado a estados internos, el modelo de consciencia, las siete variables con sus indicios posibles y sus límites de afirmación, la confianza del diagnóstico y su relación con la Estrategia Comercial. **No decide cómo se implementa, ni cómo se persiste, ni qué se dice en ningún mensaje.** | Sprint **COM-04**. Cierra la frontera de alcance que **APS-18 §6.2** declaró expresamente: «cómo se mide cada variable no se decide aquí […] es materia de APS-19». **Dos cuestiones quedan elevadas al Product Office sin resolver: §12.** |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Buyer Diagnosis frente a Opportunity Score
4. Principio de Evidencia aplicado al Diagnóstico
5. Modelo de Consciencia
6. Variables del Diagnóstico
7. Confianza del Diagnóstico
8. Relación con la Estrategia Comercial
9. Criterios de Aceptación
10. Casos Especiales
11. Riesgos
12. Cuestiones elevadas al Product Office
13. Dependencias
14. Glosario
15. Referencias
16. Evaluación AQS
17. Ratificación

---

# 1. Resumen Ejecutivo

El **Buyer Diagnosis** es la lectura comercial de un negocio: **cómo abordarlo**, no cuánto vale.

El Opportunity Score responde a *¿merece la pena?*. El Buyer Diagnosis responde a *¿por dónde se entra?*.

Este documento establece qué variables componen esa lectura, qué indicios podrían sostener cada una, y —con la misma importancia— **qué no autoriza a afirmar ninguna de ellas**.

Su tesis central es incómoda y deliberada: **ninguna variable del diagnóstico es directamente observable.** Todas describen estados internos de un negocio y de quien lo dirige. Lo observable son los **indicios**; la variable es siempre una **lectura**. En consecuencia, la mayoría de las variables valdrán **Desconocida** antes del primer contacto, y **eso es el estado correcto, no un fallo del modelo**.

---

# 2. Propósito del Documento

Cerrar la frontera de alcance que APS-18 §6.2 declaró: definir **cómo podrían medirse** las siete variables del Buyer Diagnosis.

**Lo que este documento decide:**

- Qué representa cada variable y por qué existe.
- Qué indicios podrían sostenerla.
- Qué **no** permite afirmar, en ningún caso.
- Cómo se reconoce el estado de consciencia de un comprador.
- Cómo se declara la confianza del diagnóstico.
- Cómo el diagnóstico alimenta la Estrategia Comercial.

**Lo que este documento no decide, deliberadamente:**

- **Escalas numéricas, algoritmos ni fórmulas.** Describe indicios, no cálculos.
- **Cómo se persiste el diagnóstico** *(materia de ADR — véase §12)*.
- **Qué restricciones impone cada canal** *(materia de APS-20)*.
- **Qué se dice en ningún mensaje.** No contiene textos ni instrucciones para ningún modelo.
- **La relación entre el Modelo de Consciencia y `LeadStatus`** *(§5.5)*.

---

# 3. Buyer Diagnosis frente a Opportunity Score

**Son dos juicios distintos sobre el mismo negocio, y confundirlos degradaría los dos.**

| | **Opportunity Score** *(APS-08)* | **Buyer Diagnosis** *(este documento)* |
| --- | --- | --- |
| **Pregunta** | ¿Cuánto potencial comercial tiene? | ¿Cómo se aborda? |
| **Objeto** | La **oportunidad de negocio** | La **posición del comprador** |
| **Naturaleza** | Cuantitativa — 0 a 100 con banda | **Cualitativa** — siete lecturas con su confianza |
| **Función operativa** | **Clasificar y ordenar** *(APS-08 §8.6)* | **Orientar la estrategia** *(§8)* |
| **Comparabilidad** | Comparable entre Leads | **No comparable.** Describe un caso, no lo puntúa |
| **Qué produce** | Una prioridad | Un **punto de entrada** |

## 3.1 El Buyer Diagnosis no es un segundo Score

**Prohibición expresa.** El Buyer Diagnosis **no produce una puntuación**, **no ordena Leads** y **no los compara entre sí**.

Reducirlo a un número lo convertiría en un segundo criterio de priorización, y con ello en un mecanismo de cualificación encubierto — exactamente lo que **PO-01 §7** y **APS-08 §8.6** prohíben. **Un Lead con diagnóstico desfavorable no baja en ninguna lista y no deja de poder contactarse** (APS-18 §7.5).

## 3.2 Relación de dependencia

**El Buyer Diagnosis consume el Opportunity Score; nunca lo modifica.**

El desglose por categorías de APS-08 §9 —con sus factores medidos y **no medibles**— es la principal fuente de indicios de este modelo. Ningún resultado del diagnóstico puede alterar una puntuación, una banda ni una emisión de Score.

---

# 4. Principio de Evidencia aplicado al Diagnóstico

## 4.1 Ninguna variable es directamente observable

Las siete variables describen **estados internos**: lo que un negocio sabe, teme, supone o cree de sí mismo.

**AKVEZ no observa estados internos. Observa artefactos públicos.**

De ahí la estructura obligatoria de toda variable:

```
Indicio observable

↓

Lectura inferida

↓

Confianza declarada
```

**El indicio es un hecho. La lectura es una interpretación. Nunca se presentan como lo mismo.**

## 4.2 Las tres clases de conocimiento

Aplicación de la **Regla de Evidencia** de APS-18 §11 al diagnóstico:

| Clase | Cuándo se aplica a una variable | Qué autoriza |
| --- | --- | --- |
| **Observable** | Su valor está establecido por un **hecho constatado**: un dato público inequívoco o **una manifestación del propio comprador** reportada por el usuario | Puede afirmarse |
| **Inferida** | Su valor es una lectura construida sobre indicios | **Orienta la estrategia. Nunca se afirma como hecho** |
| **Desconocida** | Ni se ha constatado ni los indicios disponibles permiten inferirla | Puede reconocerse abiertamente. **Nunca se rellena** |

## 4.3 La única vía hacia lo Observable es la manifestación del comprador

Antes de cualquier contacto, **ninguna variable puede ser Observable**: no existe manifestación alguna.

Una variable pasa a Observable cuando **el comprador la manifiesta** y el usuario lo declara. Es coherente con **APS-18 §7.4 CS-R3** —«un contacto enviado no avanza el estado; lo avanza la reacción del comprador»— y con **APS-18 §9.5**.

**Regla de precedencia.** Si una manifestación del comprador contradice una lectura inferida, **prevalece la manifestación**, sin excepción. La lectura anterior no se borra: se sustituye y queda constancia (§10, CE-4).

## 4.4 Ninguna emoción interna se afirma como hecho

**Prohibición absoluta.** El sistema **nunca** afirma que un negocio *teme*, *desconfía*, *ignora*, *se resiste* ni *está frustrado*.

Puede afirmar el indicio —«el sitio no se actualiza desde hace tiempo»— y puede **orientar la estrategia** con la lectura. **No puede enunciar la lectura como si fuera un hecho del mundo.**

**Por qué es absoluta.** Atribuir una emoción a alguien que no la ha manifestado es, a la vez, una afirmación no verificable —contra el Principio 2 de AF-00— y un modo seguro de perder la conversación: nada cierra más rápido a un desconocido que decirle cómo se siente.

## 4.5 El diagnóstico no infiere datos personales

Las siete variables describen **el negocio**. Ninguna infiere, registra ni utiliza características de personas: ni edad, ni formación, ni capacidad económica, ni situación personal.

Es la aplicación de **APS-18 §6.1 BD-5** y una obligación que este documento refuerza en cada variable de §6.

---

# 5. Modelo de Consciencia

## 5.1 Qué es

El **Modelo de Consciencia** describe **qué sabe y qué reconoce hoy un negocio** respecto del problema, la solución y el proveedor.

Corresponde a la variable **BD-1** de APS-18 §6 y desarrolla los cinco estados que **APS-18 §7.2** ya fijó.

> **Este documento adopta los cinco estados de APS-18 §7.2 sin renombrarlos ni añadir ninguno.** Su aportación es **cómo se reconoce cada uno**, no cuáles son. Redefinirlos crearía un segundo vocabulario para el mismo concepto — precisamente el modo de fallo que PO-01 tuvo que corregir en el dominio del Lead. **Véase §12, cuestión Q-2.**

## 5.2 Los cinco estados y sus indicios

| Estado | Qué significa | Indicios posibles | Qué **no** permite afirmar |
| --- | --- | --- | --- |
| **Inconsciente** | No percibe que exista un problema | Ausencia total de activo digital propio · presencia únicamente en directorios de terceros | Que el negocio «no sabe» o «no le importa» |
| **Consciente del Problema** | Reconoce la carencia; no sabe que tiene arreglo accesible | **Activo digital iniciado y desatendido** · información visiblemente obsoleta · dominio propio sin contenido | Que lo considere prioritario |
| **Consciente de la Solución** | Sabe que se resuelve; no sabe con quién | Uso de herramientas de creación asistida · presencia construida con medios visiblemente limitados | Que esté buscando proveedor **ahora** |
| **Consciente del Proveedor** | Sabe con quién podría resolverlo; aún no ha hablado | **Solo constatable por manifestación** del comprador | Nada, mientras no haya manifestación |
| **Conversación** | Está hablando con el profesional | **Manifestación directa**, declarada por el usuario | — |

## 5.3 El indicio más valioso del modelo

**Un activo digital iniciado y después desatendido.**

Indica algo que ninguna otra señal aporta: **el negocio ya se planteó el problema y su intento no prosperó.** Está por tanto más avanzado que uno sin presencia alguna, y a la vez arrastra una experiencia previa que condiciona toda aproximación posterior — lo que conecta directamente con **BD-4**.

**Distinguir «nunca lo intentó» de «lo intentó y quedó a medias» es la decisión de entrada más importante del modelo.** Son dos conversaciones distintas y un mismo mensaje no sirve para las dos.

## 5.4 Reglas del Modelo de Consciencia

**MC-1 — Los dos últimos estados no son inferibles.** *Consciente del Proveedor* y *Conversación* **solo se establecen por manifestación** del comprador. Ningún indicio público los sostiene.

**MC-2 — El estado puede ser Desconocido.** Un Lead sin análisis suficiente no tiene estado asignable, y es correcto.

**MC-3 — El estado no avanza por actividad de AKVEZ.** Enviar contactos no lo modifica *(APS-18 §7.4 CS-R3)*.

**MC-4 — El estado puede retroceder** *(APS-18 §7.4 CS-R1)*.

**MC-5 — Ningún estado descalifica.** Ninguna posición en el modelo impide contactar a un Lead *(APS-18 §7.5)*.

## 5.5 Independencia respecto de `LeadStatus` y de PO-01

**El Modelo de Consciencia es una dimensión independiente.**

- **No sustituye** al estadio del ciclo de vida de **PO-01 §8**.
- **No se relaciona** con `LeadStatus`. Esa correspondencia sigue sin decidirse, conforme a **APS-18 §7.6**, porque el vocabulario de `LeadStatus` está en disputa *(desviación **A-01**, abierta ante el Product Office)*.
- **No modifica ningún documento existente.**

Un Lead puede estar en el estadio *Evaluado* y ser, a la vez, *Inconsciente*. Son dos ejes distintos: **uno describe lo que AKVEZ ha hecho con el Lead; el otro, lo que el comprador sabe.**

---

# 6. Variables del Diagnóstico

Las siete variables son las de **APS-18 §6**. Este documento no añade ni retira ninguna.

**Formato de cada una:** qué representa · por qué existe · cómo podría medirse · qué **no** permite afirmar.

## 6.1 BD-1 — Nivel de consciencia

**Qué representa.** Qué sabe y qué reconoce el negocio. Desarrollada íntegramente en §5.

**Por qué existe.** Determina el **punto de entrada** de toda la estrategia. Es la variable de la que dependen las demás.

**Cómo podría medirse.** Por los indicios de §5.2, y por manifestación del comprador.

**Qué no permite afirmar.** Que el negocio sea ignorante, negligente o desinteresado. **La ausencia de presencia digital puede responder a una decisión deliberada, a un canal alternativo que le funciona o a falta de tiempo. Ninguna de las tres es ignorancia.**

## 6.2 BD-2 — Urgencia

**Qué representa.** Si existe alguna razón **real** para actuar ahora.

**Por qué existe.** Para impedir que se fabrique. Su función principal es **autorizar o prohibir** cualquier referencia temporal en un contacto *(APS-18 §4.8)*.

**Cómo podría medirse.** Por indicios verificables y escasos: activo digital caído o inaccesible · información caducada visible · dominio expirado. **Fuera de estos casos, no hay indicio público de urgencia.**

**Su valor por defecto es Desconocida, y lo será casi siempre.** Es el resultado correcto.

**Qué no permite afirmar.** Que el negocio **necesita** actuar ya. La urgencia del vendedor no es un indicio.

## 6.3 BD-3 — Sofisticación

**Qué representa.** Cuánta exposición previa tiene el negocio a soluciones de este tipo.

**Por qué existe.** Determina el **nivel de detalle y el registro del lenguaje**. Explicar lo obvio a quien ya lo sabe resulta condescendiente; dar por sabido lo que no se sabe resulta ininteligible. Ambos errores cierran la conversación.

**Cómo podría medirse.** Por la naturaleza de los activos digitales existentes: dominio propio frente a subdominio gratuito · presencia de funcionalidad —reserva, catálogo, pago— · indicios de intervención profesional previa.

**Qué no permite afirmar.** **Nada sobre la persona.** No es nivel educativo, ni capacidad, ni inteligencia. Es exposición previa a una categoría de solución, y nada más.

## 6.4 BD-4 — Riesgo percibido

**Qué representa.** Qué teme el negocio que salga mal si acepta.

**Por qué existe.** Es la barrera dominante en el momento de la oferta *(APS-18 §5.1, barrera Riesgo)*. Sin esta lectura, la oferta se formula a ciegas.

**Cómo podría medirse.** El indicio más fuerte, y prácticamente el único disponible, es **el intento previo fallido** de §5.3: quien invirtió y no obtuvo resultado teme repetirlo, y ese temor es específico y anticipa una objeción concreta.

**Fuera de ese caso, su valor por defecto es Desconocida.**

**Qué no permite afirmar.** Que el negocio *desconfía*, *ha sido engañado* o *tiene miedo*. Son estados internos y **§4.4 los prohíbe expresamente**.

## 6.5 BD-5 — Coste percibido

**Qué representa.** Qué **cree** el negocio que le costará: en dinero, en tiempo y en atención.

**Por qué existe.** Determina **cuándo puede aparecer una oferta** y cuánto debe reducirse el coste de decir que sí.

**Cómo podría medirse.** Con indicios débiles y solo indirectos: volumen de reseñas como aproximación al tamaño de operación · categoría del negocio. **Este documento reconoce que ningún indicio público sostiene esta variable con solidez.**

**Qué no permite afirmar.** **El presupuesto, los ingresos, la capacidad económica o la disposición a pagar de nadie.** Inferirlo sería a la vez poco fiable y contrario a §4.5. Esta variable describe una **percepción de coste**, nunca una capacidad de pago.

## 6.6 BD-6 — Nivel de confianza

**Qué representa.** Cuánta credibilidad concede hoy el negocio a un desconocido que le escribe.

**Por qué existe.** Determina cuánta evidencia debe aportar un contacto antes de proponer nada *(APS-18 §4.4)*.

**Cómo podría medirse.** **Ningún indicio público la sostiene.** Es, estructuralmente, la variable menos observable del modelo.

**Su valor es Desconocida hasta que exista una manifestación del comprador.** Este documento lo declara como comportamiento normal, no como carencia.

**Qué no permite afirmar.** Que el negocio sea desconfiado, receloso o escéptico. **Es la variable más tentadora de inventar y la menos sostenible: se declara así para que nadie la rellene.**

## 6.7 BD-7 — Identidad profesional

**Qué representa.** Cómo se ve a sí mismo el negocio.

**Por qué existe.** Determina **qué se reconoce antes de observar nada crítico**. Es la variable que impide el error más caro del contacto en frío: decirle a un negocio que está mal.

**Cómo podría medirse.** Por la combinación de reputación visible y volumen —una calificación alta con muchas reseñas indica un negocio que se percibe como bueno y que atribuye su éxito al boca a boca— y por cómo se presenta en su categoría.

**Qué no permite afirmar.** Si el negocio **acierta** al verse así. El diagnóstico registra su autopercepción; **no la evalúa, no la corrige y no la contradice**.

---

# 7. Confianza del Diagnóstico

## 7.1 Todo diagnóstico declara su confianza

Obligación heredada de **APS-18 §6.1 BD-3** y coherente con **APS-08 §11** y **APS-09 §8**.

La confianza se sostiene en **cuántas variables tienen apoyo real** y en la solidez de los indicios que las sostienen. Un diagnóstico con cinco variables Desconocidas es **válido y utilizable**, pero no puede presentarse con la misma confianza que uno con cinco variables sostenidas.

## 7.2 Un diagnóstico con desconocidos es un diagnóstico correcto

**Antes del primer contacto, lo esperable es:**

| Variable | Estado esperado antes del primer contacto |
| --- | :-: |
| BD-1 Nivel de consciencia | **Inferida** |
| BD-2 Urgencia | **Desconocida** *(salvo indicio explícito)* |
| BD-3 Sofisticación | **Inferida** |
| BD-4 Riesgo percibido | **Desconocida** *(salvo intento previo fallido)* |
| BD-5 Coste percibido | **Desconocida** |
| BD-6 Nivel de confianza | **Desconocida** |
| BD-7 Identidad profesional | **Inferida** |

**Tres inferidas y cuatro desconocidas es el resultado normal de un diagnóstico en frío honesto.**

Un diagnóstico que presente siete variables sostenidas antes del primer contacto **no es un diagnóstico mejor: es un diagnóstico que ha rellenado huecos**. Es el modo de fallo que APS-18 §11.4 advirtió, y §9 lo somete a criterio verificable.

## 7.3 La cobertura heredada limita el techo

La base de indicios procede del análisis, cuya cobertura es **parcial por declaración propia** *(APS-08 §11)*.

**El Buyer Diagnosis no puede ser más fiable que la evidencia de la que se deriva.** No compensa esa limitación: la hereda y la declara.

---

# 8. Relación con la Estrategia Comercial

## 8.1 Qué alimenta cada variable

El diagnóstico **no produce mensajes**: produce **restricciones y orientaciones** que la Estrategia Comercial de APS-18 §8 consume.

| Variable | Qué decide en la estrategia | Sección de APS-18 |
| --- | --- | --- |
| **BD-1** Consciencia | El **objetivo** del contacto y el punto de entrada | §4.5 · §8.3 |
| **BD-2** Urgencia | **Si se admite alguna referencia temporal** — normalmente, no | §4.8 |
| **BD-3** Sofisticación | El nivel de detalle y el registro | §8.1, *enfoque* |
| **BD-4** Riesgo percibido | La **barrera** dominante en el momento de la oferta | §5.1 |
| **BD-5** Coste percibido | **Cuándo puede aparecer** una oferta | §4.4 · §9.2 |
| **BD-6** Confianza | **Cuánta evidencia** debe preceder a cualquier propuesta | §4.4 |
| **BD-7** Identidad | **Qué se reconoce primero**, antes de cualquier observación crítica | §4.1 · CA-06 |

## 8.2 Una variable Desconocida restringe; no bloquea

**Regla central de esta sección.**

Una variable Desconocida **no impide** producir una estrategia. **Estrecha el espacio de estrategias admisibles.**

| Si es Desconocida… | La estrategia debe… |
| --- | --- |
| **BD-2** Urgencia | **No formular ninguna referencia temporal** |
| **BD-4** Riesgo percibido | No anticipar objeciones; esperar a que se manifiesten |
| **BD-5** Coste percibido | **No situar una oferta todavía** |
| **BD-6** Confianza | Asumir el nivel más bajo y aportar evidencia antes de proponer |
| **BD-1** Consciencia | Entrar por el punto más neutro: la observación verificable |

**Ninguna variable Desconocida autoriza a suponer un valor.** Autoriza a elegir la estrategia que funciona sin conocerlo.

## 8.3 El diagnóstico no decide, orienta

El Buyer Diagnosis **no elige** el objetivo, la barrera ni el canal: esas decisiones pertenecen a la Estrategia Comercial *(APS-18 §8.3)*.

**El diagnóstico aporta la lectura; la estrategia decide sobre ella.** Un diagnóstico no es un plan.

## 8.4 El diagnóstico nunca cruza al mensaje

**Ninguna lectura inferida puede enunciarse en un contacto.**

Lo que viaja al contacto es la **lista cerrada de hechos afirmables** de APS-18 §10.2 — construida **solo con indicios observables**, nunca con lecturas.

**El diagnóstico decide cómo se habla. No decide qué se afirma.**

---

# 9. Criterios de Aceptación

Numerados **CD-xx** para que ninguna referencia se confunda con los **CA-xx** de APS-18.

| # | Criterio | Cómo se comprueba | Origen |
| --- | --- | --- | --- |
| **CD-01** | Toda variable declara su clase: Observable, Inferida o Desconocida | Las siete variables tienen clase asignada | §4.2 |
| **CD-02** | **Ninguna variable es Observable antes del primer contacto** | Inspección del diagnóstico inicial | §4.3 |
| **CD-03** | Toda variable Inferida declara **los indicios** que la sostienen | Cada lectura enumera su indicio | §4.1 |
| **CD-04** | **Ninguna variable Desconocida tiene valor asignado** | Ausencia = ausencia, sin valor por defecto | §4.2 · APS-07 §8.4 |
| **CD-05** | **Ninguna emoción interna se afirma como hecho** | Ningún enunciado atribuye temor, desconfianza, ignorancia o frustración | §4.4 |
| **CD-06** | Ninguna variable contiene ni infiere datos personales | Inspección de las siete variables | §4.5 |
| **CD-07** | **Ninguna variable infiere capacidad económica ni disposición a pagar** | Inspección de BD-5 | §6.5 |
| **CD-08** | El diagnóstico **no produce ninguna puntuación** | Ausencia de valor numérico agregado | §3.1 |
| **CD-09** | El diagnóstico **no ordena ni compara Leads** | No existe operación de comparación entre diagnósticos | §3.1 |
| **CD-10** | Ningún diagnóstico impide contactar un Lead | No existe regla de exclusión derivada del diagnóstico | §3.1 · §5.4 MC-5 |
| **CD-11** | El diagnóstico **no modifica ninguna emisión de Opportunity Score** | El Score anterior y posterior coinciden | §3.2 |
| **CD-12** | Los estados *Consciente del Proveedor* y *Conversación* **solo se establecen por manifestación** | Ambos exigen manifestación declarada | §5.4 MC-1 |
| **CD-13** | El Modelo de Consciencia no avanza por actividad de AKVEZ | Enviar un contacto no altera el estado | §5.4 MC-3 |
| **CD-14** | **Una manifestación del comprador prevalece sobre toda lectura inferida** | Ante conflicto, se conserva la manifestación | §4.3 |
| **CD-15** | Todo diagnóstico declara su confianza | Presencia del valor de confianza | §7.1 |
| **CD-16** | **Un diagnóstico con variables Desconocidas es válido y utilizable** | No se rechaza ni se bloquea la estrategia | §7.2 · §8.2 |
| **CD-17** | Si BD-2 es Desconocida, la estrategia **no formula ninguna referencia temporal** | Inspección de la estrategia resultante | §8.2 |
| **CD-18** | Si BD-5 es Desconocida, la estrategia **no sitúa una oferta** | Inspección de la secuencia resultante | §8.2 |
| **CD-19** | **Ninguna lectura inferida aparece en la lista de hechos afirmables** | Contraste lectura ↔ lista | §8.4 |
| **CD-20** | El Modelo de Consciencia **no se relaciona con `LeadStatus`** | Ausencia de correspondencia declarada | §5.5 |
| **CD-21** | El diagnóstico **no emite juicio sobre la autopercepción del negocio** | BD-7 registra, no evalúa | §6.7 |

---

# 10. Casos Especiales

**CE-1 — Lead sin análisis.** No hay indicios: **las siete variables son Desconocidas**. El diagnóstico existe, es válido y su confianza es la mínima. No bloquea nada, pero **APS-18 §13 CE-1** establece que no se propone estrategia sin evidencia.

**CE-2 — Todas las variables Desconocidas.** Válido *(§7.2)*. Autoriza únicamente contactos construidos sobre indicios observables mínimos. **Nunca autoriza a inferir para rellenar.**

**CE-3 — Indicios contradictorios.** Dos indicios sostienen lecturas incompatibles. **La variable pasa a Desconocida**, no a una lectura intermedia. Promediar dos interpretaciones opuestas produce una tercera que ningún indicio sostiene.

**CE-4 — El comprador contradice el diagnóstico.** Prevalece la manifestación *(§4.3)*. La lectura anterior **no se destruye**: se sustituye y queda constancia. Un diagnóstico refutado por el propio comprador es la información más valiosa que el modelo puede recibir.

**CE-5 — El negocio resolvió el problema por su cuenta.** Estado válido. El diagnóstico lo registra; **no lo convierte en un Lead peor** ni lo retira de nada *(PO-01 §8)*.

**CE-6 — Reputación excelente y ninguna presencia web propia.** El caso más frecuente y el más fácil de estropear. **BD-7 debe leerse antes que BD-1:** el negocio no tiene un problema de calidad, tiene un techo de alcance. Cualquier estrategia que sugiera lo contrario incumple **APS-18 CA-06**.

---

# 11. Riesgos

| # | Riesgo | Impacto | Mitigación |
| --- | --- | :-: | --- |
| **RD-1** | **Rellenar los desconocidos.** Un diagnóstico completo parece mejor que uno honesto, y la presión por completarlo es constante | **Alto** | §7.2 · CD-02 · CD-04. **Es el modo de fallo principal de este modelo** |
| **RD-2** | **Que el diagnóstico se convierta en una segunda puntuación** y con ella en cualificación encubierta | **Alto** | §3.1 · CD-08 · CD-09 · CD-10 |
| **RD-3** | **Que una lectura inferida se filtre al mensaje** como si fuera un hecho | **Alto** | §8.4 · CD-19 · APS-18 §10.3, punto 3 |
| **RD-4** | **Cuatro de siete variables serán Desconocidas casi siempre**, lo que puede leerse como que el modelo no funciona | Medio-alto | §7.2. **Es el comportamiento correcto**, y debe comunicarse como tal |
| **RD-5** | **La cobertura heredada limita el techo del diagnóstico** | Medio-alto | §7.3 · APS-08 §11 |
| **RD-6** | **Que BD-3 o BD-5 deriven hacia juicios sobre personas** | Medio-alto | §4.5 · §6.3 · §6.5 · CD-06 · CD-07 |
| **RD-7** | **Los indicios de §5.2 y §6 no están validados con datos observados** | Medio | Derivan de principios, no de evidencia. Misma provisionalidad declarada que WP-01 en APS-08 §7.1 |
| **RD-8** | **Sin declaración del usuario, ninguna variable llega nunca a Observable** | Medio | §4.3. Depende del mismo reporte del que depende APS-18 §9.5 — **es el mismo riesgo de adopción, no uno nuevo** |

---

# 12. Cuestiones elevadas al Product Office

**Dos cuestiones se detectaron durante la redacción.**

> ## ✅ Las dos quedan `Closed` — Sprint *Gobernanza Final*, 2026-07-30
>
> | # | Estado | Resolución |
> | :-: | :-: | --- |
> | **Q-1** | ✅ **`Closed`** | **ADR-13 v1.2** incorporó **A-11** *(Diagnóstico Comercial, versionado)* y **A-12** *(Secuencia Comercial, actualizable)* a §6.2, y **E-7, E-8 y E-9** al catálogo de §13.1. **La *foreclosure* de §13.4 dejó de aplicarse por el acto de gobernanza que esa misma regla exigía.** Véase ADR-15 §15 |
> | **Q-2** | ✅ **`Closed`** | **El Product Office confirma las denominaciones epistémicas de APS-18 §7.2** —*Consciente del Problema · de la Solución · del Proveedor*—, que son las que este documento ya adoptaba. **APS-18 §7.2 no se modifica.** Las denominaciones conductuales propuestas en COM-04 §3 quedan **descartadas** por el motivo 2 de esta sección: describen actividad que AKVEZ no observa, y dejarían dos estados en *Desconocida* de forma permanente |
>
> **Lo que sigue se conserva como registro del análisis. Ninguna de las dos es una cuestión pendiente.**

## Q-1 — El diagnóstico no cabe en el catálogo de activos de ADR-13 — ✅ `Closed`

**ADR-13 §6.2** enumera diez activos durables, **A-1 a A-10**. **Ninguno corresponde al Buyer Diagnosis ni al Commercial State.**

**ADR-13 §13.1** enumera seis eventos de escritura, **E-1 a E-6**. **Ninguno los produce.**

**ADR-13 §13.4 cierra el catálogo de forma expresa:**

> «Ningún evento no enumerado aquí podrá escribir en la Biblioteca. Incorporar un evento de escritura nuevo exigirá **enmendar este ADR**.»

**Consecuencia.** APS-18 §7.4 (CS-R3) y §9.5 exigen funcionalmente que el diagnóstico y el estado **sobrevivan entre contactos**. Hacerlo durable **requiere enmendar ADR-13**.

**Este documento no lo resuelve y no decide la persistencia** *(§2)*. Se reporta porque la foreclosure ya existe y conviene que se conozca antes de redactar ningún ADR. **La enmienda de ADR-13 corresponde al Architecture Team, no a un APS.**

## Q-2 — Denominación de los estados de consciencia — ✅ `Closed`

El encargo COM-04 §3 propuso, **a título de ejemplo**, cinco estados con denominaciones distintas de las que **APS-18 §7.2** ya fijó: *«Explorando soluciones»* y *«Evaluando proveedores»* frente a *«Consciente de la Solución»* y *«Consciente del Proveedor»*.

**Este documento adopta las de APS-18** por dos motivos:

1. **Evita duplicar vocabulario.** Dos nombres para el mismo concepto en dos APS vigentes es el defecto documental que PO-01 tuvo que corregir en el dominio del Lead.
2. **Las denominaciones conductuales no son reconocibles.** *Explorar* y *evaluar* describen **actividad**; AKVEZ no observa la actividad de nadie. Adoptarlas dejaría ambos estados en *Desconocida* de forma permanente. Las denominaciones epistémicas de APS-18 sí admiten indicios *(§5.2)*.

**Si el Product Office prefiere las denominaciones conductuales, deberá modificarse APS-18 §7.2** — lo que este sprint tiene expresamente prohibido. **Se solicita confirmación.**

> ✅ **Confirmado el 2026-07-30.** Se adoptan las denominaciones **epistémicas** de APS-18 §7.2. **APS-18 no se modifica.** El vocabulario del Modelo de Consciencia queda cerrado.

---

# 13. Dependencias

Este documento depende de:

- **AF-00 — The Constitution of AKVEZ.** Artículo IV, Principios 2 y 10.
- **PO-01 v1.2 — Decisión Canónica de Lead.** §5, §7, §8.
- **PO-02 v1.3 — Alcance del Sistema Comercial.** §5.1 *(LS-5: el estadio no es el Commercial State)* · §7.
- **APS-18 v1.2 — Commercial Strategy Framework.** §4, §6, §7, §8, §10, §11. **Marco del que este documento es desarrollo.**
- **APS-08 v1.2 — Opportunity Scoring Framework.** §6, §8.6, §9, §11. **Fuente principal de indicios.**
- **APS-09 — AI Decision Framework.** §8.
- **APS-07 v2.1 — Data & Knowledge Architecture.** §8.4.
- **APS-03 v3.1 — Agent Architecture.** §7.2.
- **ADS-00 v1.3 — Documentation Standard.**
- **ADR-13 v1.2 — Motor Canónico de Persistencia.** §6.2, §13.1, §13.4. **Q-1 `Closed`** — véase §12.

**Condiciona a:** APS-20 · los ADR del sistema comercial · toda implementación del diagnóstico.

---

# 14. Glosario

**Buyer Diagnosis:** Lectura comercial de un negocio, expresada en siete variables con su clase de conocimiento y su confianza declarada. Responde a *cómo abordar*, nunca a *cuánto vale*. *(§1, §3)*

**Indicio:** Hecho público observable del que se deriva una lectura. **El indicio es un hecho; la lectura no.** *(§4.1)*

**Lectura inferida:** Interpretación construida sobre indicios. Orienta la estrategia; **nunca se afirma como hecho**. *(§4.2)*

**Manifestación:** Declaración del propio comprador, reportada por el usuario. **Única vía por la que una variable llega a Observable.** *(§4.3)*

**Modelo de Consciencia:** Desarrollo de BD-1. Describe qué sabe y qué reconoce un negocio. Adopta los cinco estados de APS-18 §7.2. *(§5)*

**Clase de conocimiento:** Observable, Inferida o Desconocida. Toda variable declara la suya. *(§4.2)*

**Desconocida:** Clase que indica ausencia de apoyo suficiente. **Es un resultado válido y esperado**, nunca un fallo. *(§7.2)*

**Confianza del diagnóstico:** Declaración de cuánto se sostiene la lectura en su conjunto. *(§7)*

---

# 15. Referencias

- AF-00 — The Constitution of AKVEZ, Artículo IV, Principios 2 y 10.
- PO-01 v1.2 — Decisión Canónica de Lead, §5, §7, §8.
- PO-02 v1.3 — Alcance del Sistema Comercial, §5.1 *(LS-5)*, §7.
- ADS-00 v1.3 — Documentation Standard.
- APS-07 v2.1 — Data & Knowledge Architecture, §8.4.
- APS-08 v1.2 — Opportunity Scoring Framework, §6, §8.6, §9, §11.
- APS-09 — AI Decision Framework, §8.
- APS-18 v1.2 — Commercial Strategy Framework, §4, §6, §7, §8, §10, §11, §13.
- APS-20 v1.1 — Outreach Channels & Constraints.
- ADR-13 v1.2 — Motor Canónico de Persistencia, §6.2, §13.1, §13.4.
- ADR-15 v1.2 · ADR-16 v1.1 — arquitectura del sistema y del dominio comercial.
- COM-02 — Commercial Intelligence Architecture Draft *(documento de trabajo, fuera del catálogo del Blueprint)*.

---

# 16. Evaluación AQS

| Criterio | Puntaje |
| --- | --- |
| Claridad | 20/20 |
| Completitud | 20/20 |
| Implementabilidad | **18/20** |
| Consistencia | 15/15 |
| Escalabilidad | 15/15 |
| Calidad Editorial | 10/10 |

**AQS Total:** **98/100** → ✅ **100/100** *(v1.1)*

**Estado:** ✅ **APPROVED**

**Deducción original, y por qué queda levantada:**

- **Implementabilidad −2.** La cuestión **Q-1** estaba abierta: el diagnóstico y el estado de consciencia **no podían persistirse sin enmendar ADR-13 §13.4**.
- ✅ **Levantada en la v1.1.** **ADR-13 v1.2 ejecutó la enmienda**: A-11 y A-12 en §6.2, E-7, E-8 y E-9 en §13.1. **La durabilidad ya no está foreclosed.** **Implementabilidad 18 → 20 · AQS 98 → 100.**

> **La advertencia final de la v1.0 —«ninguna implementación podrá emprenderse hasta que ADR-13 se enmiende»— queda sin objeto y no debe citarse.** La enmienda está ejecutada.

---

# 17. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 3.

## 17.1 Verificación de la frontera con el Opportunity Score

**Es la frontera que este documento existe para sostener**, y la que su §3 declara. Verificada contra APS-08 y ADR-14:

| Comprobación | Resultado |
| --- | :-: |
| El Buyer Diagnosis responde a **cómo abordar**, nunca a **cuánto vale** *(§1, §3)* | ✅ |
| **No produce puntuación, orden ni comparación entre Leads** *(BD-I5 de ADR-16 · RC-12)* | ✅ |
| **No condiciona el registro, la conservación ni la presentación de ningún Lead** — PO-01 §7 · APS-08 §8.6 · R-42, R-43, R-44 | ✅ |
| **Consume** la evidencia y el Score del Lead Analyzer y **nunca los modifica** *(§3.2)* | ✅ |
| Los dos ejes son **independientes**: un Lead `Scored` puede tener a su comprador *Inconsciente* | ✅ |

> **Es la garantía de que el diagnóstico no degenera en cualificación encubierta** —riesgo **R-4** de ADR-16—, que es la forma en que un umbral de exclusión podría reaparecer sin llamarse así.

## 17.2 Verificación de la frontera con el Commercial State

| Comprobación | Resultado |
| --- | :-: |
| El **Commercial State es la variable BD-1** del diagnóstico, **no un campo aparte ni un estadio del Lead** *(§5 · ADR-16 BD-I4)* | ✅ |
| **LS-5 de PO-02 v1.3 §5.1** lo confirma desde el rango que decide el vocabulario del estadio: *«el estado no es el Commercial State […] son dos ejes independientes»* | ✅ |
| **§5.5** de este documento declara la independencia respecto de `LeadStatus` y de PO-01 | ✅ |
| Los cinco estados usan las **denominaciones epistémicas** de APS-18 §7.2 — **Q-2 `Closed`**, sin duplicar vocabulario *(ADS-00, Terminología)* | ✅ |

## 17.3 Compatibilidad verificada

| Documento | Resultado |
| --- | :-: |
| **PO-02 v1.3** §5.1 (LS-5), §6.2 punto 17, §7 | ✅ Compatible |
| **APS-18 v1.2** §6, §7 — este documento es su desarrollo, declarado en §2 | ✅ Compatible |
| **ADR-13 v1.2** §6.2, §13.1 — **Q-1 `Closed`** | ✅ Compatible |
| **APS-19 §4.2 · R-38** — una variable *Desconocida* **no tiene valor** y atraviesa las capas sin rellenarse | ✅ Reforzado |

## 17.4 Riesgos al ratificar

**Los riesgos de §11 se mantienen intactos**, con su redacción y severidad. Ninguno se cierra y ninguno impide la ratificación: son riesgos del modelo, no defectos del documento.

## 17.5 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.1 son: estado, historial, autoridad de portada, cierre de Q-1 y Q-2 en §12, versiones citadas en §13, levantamiento de la deducción del AQS y esta sección.
