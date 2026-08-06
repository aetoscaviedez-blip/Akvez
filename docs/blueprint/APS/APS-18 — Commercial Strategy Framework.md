# APS-18 — Commercial Strategy Framework

## APS-18 — Commercial Strategy Framework

**Versión:** 1.2

**Estado:** ✅ Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Aprobado por:** AKVEZ Product Office — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30

**Estándar Aplicado:** ADS-00 v1.3

**Autoridad de dominio:** PO-01 v1.2 · **PO-02 v1.3** (Approved) · APS-07 v2.1 (Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-07-30 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se incorpora **§19** con la constancia de la ratificación y las verificaciones ejecutadas. Se actualiza la autoridad de dominio de la portada —alta de **PO-02 v1.3**, APS-07 v2.0 → **v2.1**— y las versiones citadas en **§15** y **§17** —APS-03 v3.0 → **v3.1**, APS-07 v2.0 → **v2.1**—. Se cierra el riesgo **RG-8**, que declaraba las siete variables no calculables «hasta que exista APS-19». **No se modifica ninguna sección de contenido:** ni la filosofía de §3, ni los ocho principios de §4, ni el motor de §5, ni las siete variables de §6, ni el Commercial State de §7, ni la Estrategia de §8, ni la Secuencia de §9, ni el papel del modelo de §10, ni la Regla de Evidencia de §11, ni los 25 criterios de §12. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 2. Verificadas la autoridad del documento y su compatibilidad con **PO-02 v1.3**, ratificado en el paso 1. |
| **1.1** | 2026-07-30 | AKVEZ Product Office | **Resolución de IN-1.** Se **elimina «Mental Debt»** como principio operativo y se sustituye por **Progressive Relevance** (§4.7), con su definición oficial. Se retira **«Bucle»** del vocabulario —era el vehículo léxico del ocultamiento— y se sustituye por **«Hilo»**, explícito y respondible (§4.6, §8.1, §9.2, §10.2, §10.3, §16). Se reformula **§4.6** para que la continuidad de la secuencia no dependa de retener información. Se incorporan **CA-23, CA-24 y CA-25**; se actualiza **CA-08**. Se sustituye el riesgo **RG-1**. **No se modifica ninguna otra sección:** ni el objetivo de §3, ni el motor de §5, ni las siete variables de §6, ni el Commercial State de §7, ni la Regla de Evidencia de §11. | Sprint **COM-03.1**. Pronunciamiento del **AKVEZ Product Office** del 2026-07-30 sobre la inconsistencia **IN-1**. **IN-1 queda `Closed`**: el conflicto con el **Principio 10 de AF-00** —«nunca ocultaremos información para aumentar conversiones»— se resuelve por **eliminación del concepto en conflicto**, no por interpretación de la norma constitucional. **AF-00 no se modifica ni se reinterpreta.** |
| 1.0 | 2026-07-30 | AKVEZ Product Office | Primera definición oficial de **cómo vende AKVEZ**: objetivo del sistema comercial, principios, Commercial Strategy Engine, Buyer Diagnosis, Commercial State, Estrategia Comercial, Secuencia Comercial, papel del modelo de IA, Regla de Evidencia y criterios de aceptación. **No define cómo se implementa, ni cómo se redacta, ni cómo se mide ninguna variable.** | Sprint **COM-03**. Deriva la arquitectura funcional aprobada en **COM-02** hacia una especificación oficial. Equivalente comercial de **APS-08**. **Una inconsistencia de nivel constitucional queda abierta y aislada: IN-1, §4.7.** |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Filosofía del Sistema Comercial
4. Principios Comerciales Oficiales
5. Arquitectura del Commercial Strategy Engine
6. Buyer Diagnosis
7. Commercial State
8. La Estrategia Comercial
9. La Secuencia Comercial
10. El Papel del Modelo de Inteligencia Artificial
11. La Regla de Evidencia
12. Criterios de Aceptación
13. Casos Especiales
14. Riesgos
15. Dependencias
16. Glosario
17. Referencias
18. Evaluación AQS
19. Ratificación

---

# 1. Resumen Ejecutivo

El **Commercial Strategy Framework** define cómo AKVEZ vende.

AKVEZ no genera mensajes comerciales. AKVEZ **diseña la estrategia** que conduce a un profesional independiente desde un primer contacto en frío hasta una **conversación real** con un cliente potencial.

Este documento establece el objetivo del sistema comercial, los principios que lo gobiernan, las decisiones que toma y —con igual importancia— las que **nunca** toma.

Es el equivalente comercial de **APS-08**: así como APS-08 define cómo AKVEZ evalúa una oportunidad, APS-18 define cómo AKVEZ la convierte en conversación. Ambos comparten la misma exigencia: **el criterio pertenece al dominio, es explicable y es verificable.**

**Este documento no define cómo se implementa nada.** No contiene arquitectura técnica, ni contratos, ni algoritmos de medición, ni textos.

---

# 2. Propósito del Documento

Establecer la autoridad funcional del sistema comercial de AKVEZ.

Toda decisión posterior sobre el agente comercial —arquitectura, medición de variables, canales, interfaz o implementación— deberá poder justificarse contra este documento.

**Lo que este documento decide:**

- Qué persigue el sistema comercial.
- Qué principios lo gobiernan.
- Qué es un diagnóstico, una estrategia y una secuencia.
- Qué papel tiene el modelo de IA y cuál no.
- Qué puede afirmarse y con qué fundamento.

**Lo que este documento no decide, deliberadamente:**

- **Cómo se mide** ninguna variable del diagnóstico *(materia de APS-19)*.
- **Qué restricciones impone cada canal** *(materia de APS-20)*.
- **Cómo se estructura el código** *(materia de ADR)*.
- **Qué se le dice al modelo** para producir un texto.
- **Cómo se relaciona el Commercial State con `LeadStatus`** *(§7.6)*.

---

# 3. Filosofía del Sistema Comercial

## 3.1 El objetivo real

**El objetivo del sistema comercial de AKVEZ es conseguir una conversación entre el profesional y un cliente potencial.**

No es generar un mensaje. No es cerrar una venta.

**Por qué una conversación y no una venta.** AKVEZ puede observar una respuesta; **no puede observar un contrato firmado**. Optimizar un resultado que el sistema no puede verificar produciría una métrica que nadie puede comprobar, en contra del Principio 2 de AF-00 —«toda conclusión importante deberá poder justificarse con información clara y verificable»—.

Además, cerrar la venta es el oficio del profesional. AKVEZ existe para **amplificar su criterio, no para sustituirlo** (APS-01 §8.2). El sistema lo lleva hasta la mesa; quien se sienta a ella es él.

## 3.2 El objetivo del primer contacto nunca es vender

En frío, el receptor no conoce al profesional, no espera el mensaje y no ha manifestado ninguna necesidad.

**El objetivo del primer contacto es conseguir que responder resulte más barato que ignorar.**

Toda estrategia que persiga cerrar en el primer contacto contradice la naturaleza del canal frío y este documento la considera un error de diseño, no una preferencia de estilo.

## 3.3 Alcance del juicio del sistema comercial

**Lo que el sistema comercial hace:**

1. **Diagnostica** el estado comercial de un negocio a partir de la evidencia disponible.
2. **Diseña** una estrategia y una secuencia de contactos.
3. **Recomienda** el siguiente movimiento.
4. **Explica** por qué.

**Lo que el sistema comercial no hace, en ningún caso:**

5. **Nunca ejecuta.** No envía mensajes, no detecta respuestas y no actualiza nada por su cuenta (§9.4).
6. **Nunca decide a quién contacta el usuario.**
7. **Nunca descalifica a un negocio.** Ningún diagnóstico ni estado comercial impide contactar a un Lead (§7.5).
8. **Nunca afirma lo que no puede sostener** (§11).

---

# 4. Principios Comerciales Oficiales

Ocho principios. **Cada uno enuncia una obligación, una prohibición y una forma de comprobarse.** Un principio que no puede comprobarse no pertenece a este documento.

## 4.1 Venta consultiva

**Enunciado.** Se diagnostica antes de proponer. El sistema comprende el negocio antes de sugerirle nada.

**Obliga a** que toda estrategia parta de un diagnóstico existente.

**Prohíbe** proponer una solución antes de haber establecido el problema.

**Se comprueba** así: ninguna estrategia puede emitirse sin un Buyer Diagnosis asociado.

## 4.2 Descubrimiento antes que persuasión

**Enunciado.** Primero se entiende al comprador; después se le convence.

**Obliga a** que el primer contacto persiga comprensión y reconocimiento, no conversión.

**Prohíbe** que el contacto de objetivo *reconocimiento* contenga una oferta, un precio o una petición de reunión.

**Se comprueba** así: el primer contacto de toda secuencia tiene objetivo *reconocimiento* y no contiene oferta.

## 4.3 Evidencia antes que opinión

**Enunciado.** Toda afirmación comercial sobre un negocio debe poder rastrearse hasta un hallazgo del análisis.

**Obliga a** clasificar todo conocimiento como observado, inferido o desconocido (§11).

**Prohíbe** afirmar como hecho cualquier cosa que no sea observada.

**Se comprueba** así: toda afirmación de un contacto se corresponde con un hallazgo registrado.

## 4.4 Confianza antes que oferta

**Enunciado.** La oferta llega cuando la barrera de credibilidad está rota, no antes.

**Obliga a** que exista al menos un contacto previo de evidencia antes de cualquier oferta.

**Prohíbe** situar una oferta en una secuencia cuya barrera de credibilidad sigue viva.

**Se comprueba** así: ninguna secuencia sitúa un momento de tipo *Oferta* antes de un momento de tipo *Evidencia*.

## 4.5 Micro-Yes

**Enunciado.** Cada contacto persigue **un solo** avance, y no se salta ninguno.

La escalera es:

```
leer  →  reconocerse  →  responder  →  aceptar ver algo  →  aceptar hablar
```

**Obliga a** que cada contacto declare un único objetivo, correspondiente a un peldaño.

**Prohíbe** que un contacto persiga dos objetivos, o que salte un peldaño.

**Se comprueba** así: cada contacto declara exactamente un objetivo, y el de un contacto no dista más de un peldaño del anterior.

## 4.6 Progressive Curiosity Protocol

**Enunciado.** Cada contacto **retoma el hilo que dejó planteado el anterior**. Una secuencia se lee como **una conversación**, no como mensajes independientes dirigidos a la misma persona.

**Obliga a** que todo contacto posterior al primero retome explícitamente el hilo del que le precede.

**Prohíbe** encadenar contactos sin continuidad entre sí.

**Se comprueba** así: todo contacto a partir del segundo declara qué hilo retoma, y ese hilo es el que dejó planteado el anterior.

> **Un hilo es explícito y respondible.** Es una pregunta o un asunto que el contacto **enuncia**, no una intriga que reserva. El receptor puede cerrarlo cuando quiera, y si pregunta, **se le responde de inmediato**. Esa es la diferencia entre este principio y la retención de información, que **§4.7 prohíbe**.

## 4.7 Progressive Relevance

**Definición oficial.**

> **«AKVEZ genera interés mediante relevancia progresiva, evidencia específica y claridad contextual. Nunca mediante ocultamiento deliberado de información.»**

**Enunciado.** El interés se genera siendo **cada vez más relevante para este negocio concreto**, no reteniendo información.

**Obliga a** dos cosas:

1. Que cada contacto aporte **al menos un elemento de relevancia** que el anterior no contenía.
2. Que toda información solicitada por el receptor **se entregue de inmediato**, sin condición.

**Prohíbe:**

- Aludir a un hallazgo sin enunciarlo — «vi algo en tu web que te interesará».
- Condicionar la entrega de información a que el receptor responda.
- Cualquier otra forma de ocultamiento deliberado orientado a provocar respuesta.

**Se comprueba** así: **(a)** ningún contacto alude a un hallazgo que no enuncia; **(b)** ninguna información se condiciona a una respuesta; **(c)** cada contacto aporta un elemento de relevancia nuevo.

### Ejemplo de progresión — ilustrativo, no normativo

Cuatro contactos que **no retienen nada** y aun así incrementan el interés en cada paso:

| # | Qué aporta | Por qué es más relevante que el anterior |
| :-: | --- | --- |
| **1** | Una observación específica y verificable sobre este negocio | Demuestra que el mensaje **no es masivo** |
| **2** | La consecuencia de negocio que se deriva de esa observación | Conecta el hallazgo con **lo que le importa** |
| **3** | Algo aplicado a su caso concreto | Deja de ser una idea general y pasa a ser **su situación** |
| **4** | Qué haría falta para resolverlo | Convierte la conversación en **una decisión** |

**Ninguno de los cuatro reserva nada.** Cada uno **enuncia** lo que tiene y avanza en especificidad. El interés procede de la precisión creciente, no de la intriga.

> **Este principio sustituye a «Mental Debt»**, retirado del marco por el Product Office el 2026-07-30. Su formulación —reservar información deliberadamente para elevar la probabilidad de respuesta— era incompatible con el **Principio 10 de AF-00**: «Nunca ocultaremos información para aumentar conversiones». **La inconsistencia IN-1 queda `Closed` por eliminación del concepto en conflicto.** AF-00 no se modifica ni se reinterpreta.

## 4.8 La urgencia no se fabrica

**Enunciado.** Si no existe evidencia de urgencia, el sistema declara que no la hay.

**Obliga a** que toda referencia temporal proceda de un hallazgo observado.

**Prohíbe** plazos, escasez o consecuencias temporales que la evidencia no sostenga.

**Se comprueba** así: ninguna afirmación de urgencia carece de hallazgo que la respalde.

> **Nota sobre la identidad profesional.** Ningún principio autoriza a atacar la identidad de un negocio. Un negocio con reputación excelente y sin presencia web no tiene un problema de calidad: tiene un techo de alcance. **El reconocimiento precede siempre a la observación crítica** — es una obligación derivada de §4.1 y §4.2, y se comprueba en **CA-06**.

---

# 5. Arquitectura del Commercial Strategy Engine

El **Commercial Strategy Engine** es el mecanismo que convierte un diagnóstico en un movimiento comercial concreto.

```
Evidencia del Análisis

↓

Buyer Diagnosis

↓

Objetivo del Contacto

↓

Barrera a Romper

↓

Resultado Esperado

↓

Siguiente Paso
```

**Cada etapa recibe lo anterior y no puede saltarse ninguna.**

| Etapa | Recibe | Decide | Produce | Nunca hace |
| --- | --- | --- | --- | --- |
| **1 · Buyer Diagnosis** | Evidencia del análisis | Cómo se lee comercialmente este negocio | Las siete variables de §6, con su confianza | Inventar una variable que no puede sostener |
| **2 · Objetivo del Contacto** | El diagnóstico | Qué **un solo** avance persigue este contacto | Un peldaño de la escalera de §4.5 | Perseguir dos objetivos |
| **3 · Barrera a Romper** | El objetivo | Qué **única** resistencia impide ese avance | Una barrera de las cinco de §5.1 | Atacar varias barreras a la vez |
| **4 · Resultado Esperado** | Objetivo y barrera | Qué se considerará éxito de este contacto | Un resultado observable y binario | Definir un éxito que no pueda comprobarse |
| **5 · Siguiente Paso** | El resultado real | Qué movimiento procede ahora | La recomendación para el usuario | Ejecutarla |

## 5.1 Las barreras del comprador en frío

El comprador en frío levanta cinco resistencias, **siempre en este orden**:

```
¿quién eres?  →  ¿esto es para mí?  →  ¿esto es verdad?  →  ¿por qué ahora?  →  ¿qué me cuesta?
```

| Barrera | Qué significa | Qué la rompe |
| --- | --- | --- |
| **Identidad** | *¿Quién eres?* | Que el emisor sea reconocible y humano |
| **Relevancia** | *¿Esto es para mí?* | Que el mensaje sea inequívocamente sobre **este** negocio |
| **Credibilidad** | *¿Esto es verdad?* | Evidencia observable y comprobable |
| **Momento** | *¿Por qué ahora?* | Una razón real; nunca fabricada (§4.8) |
| **Riesgo** | *¿Qué me cuesta?* | Reducir el coste de decir que sí |

**Una barrera por contacto.** Atacar varias a la vez produce un mensaje largo que no rompe ninguna.

## 5.2 El resultado esperado debe ser observable

Un resultado esperado es válido únicamente si el usuario puede responder **sí o no** sin interpretar.

Válidos: *respondió*, *no respondió*, *pidió ver algo*, *aceptó hablar*, *dijo que no*.

**No válidos:** *generó interés*, *quedó pensando*, *mejoró la percepción de marca*. No son comprobables y este documento los excluye.

---

# 6. Buyer Diagnosis

El **Buyer Diagnosis** es la lectura comercial de un negocio. Describe **al comprador**, no a su sitio web — el diagnóstico técnico ya lo produce el Lead Analyzer (APS-03 §7.2).

**Siete variables. Todas de negocio. Ninguna personal.**

| # | Variable | Qué establece | Qué **no** es |
| --- | --- | --- | --- |
| **BD-1** | **Nivel de consciencia** | Si el negocio sabe que tiene el problema | No es su nivel de inteligencia ni de formación |
| **BD-2** | **Urgencia** | Si existe alguna razón real para actuar ahora | No es la urgencia que le convendría al vendedor |
| **BD-3** | **Sofisticación** | Cuánta exposición previa tiene a soluciones de este tipo | No es un juicio sobre su capacidad |
| **BD-4** | **Riesgo percibido** | Qué teme que salga mal si acepta | No es el riesgo real de la operación |
| **BD-5** | **Coste percibido** | Qué cree que le costará —en dinero, tiempo y atención— | No es el precio del servicio |
| **BD-6** | **Nivel de confianza** | Cuánta credibilidad concede hoy a un desconocido | No es una medida de su carácter |
| **BD-7** | **Identidad profesional** | Cómo se ve a sí mismo el negocio | No es una valoración de si acierta al verse así |

## 6.1 Reglas del diagnóstico

**BD-R1 — Toda variable puede declararse desconocida.** «Desconocido» es un valor **legítimo y esperado**, no un fallo del diagnóstico. Un diagnóstico con variables desconocidas es válido y utilizable.

**BD-R2 — Ninguna variable se rellena por defecto.** Es la aplicación de la Regla de Evidencia (§11) y de APS-07 §8.4: la ausencia se representa como ausencia.

**BD-R3 — El diagnóstico declara su confianza.** Igual que el Opportunity Score (APS-08 §11), un diagnóstico construido sobre información parcial debe decirlo.

**BD-R4 — El diagnóstico describe, no descalifica.** Ninguna combinación de valores hace que un negocio «no merezca» ser contactado (§7.5).

**BD-R5 — Ninguna variable admite datos personales.** El diagnóstico es sobre el negocio. No se infieren ni se registran características de personas.

## 6.2 Lo que este documento no decide

**Cómo se mide cada variable no se decide aquí.** Ni las escalas, ni los valores admisibles, ni la evidencia que alimenta cada una. Es materia de **APS-19 — Buyer Diagnosis Model**, todavía no autorizado.

Hasta que APS-19 exista, las siete variables son **conceptos definidos, no magnitudes calculables**.

---

# 7. Commercial State

## 7.1 Qué es

El **Commercial State** representa **la posición psicológica del comprador respecto del problema, la solución y el proveedor**.

Responde a una sola pregunta: **¿qué sabe y qué reconoce hoy este negocio?**

## 7.2 Los cinco estados

```
Inconsciente

↓

Consciente del Problema

↓

Consciente de la Solución

↓

Consciente del Proveedor

↓

Conversación
```

| Estado | Qué significa | Qué necesita para avanzar |
| --- | --- | --- |
| **Inconsciente** | No percibe que exista un problema | Que alguien se lo muestre sin acusarle |
| **Consciente del Problema** | Reconoce la carencia, no sabe que tiene arreglo accesible | Saber que existe una solución realista |
| **Consciente de la Solución** | Sabe que se resuelve, no sabe con quién | Un motivo para creer a **este** profesional |
| **Consciente del Proveedor** | Sabe con quién podría resolverlo, aún no ha hablado | Que hablar le cueste poco |
| **Conversación** | Está hablando con el profesional | **Nada. Es el objetivo alcanzado** |

## 7.3 Naturaleza del Commercial State

**Es un atributo del Lead, no un estadio de su ciclo de vida.**

Es exactamente la misma naturaleza que APS-08 atribuye al Opportunity Score: *«es un atributo del Lead, no un estadio de su ciclo de vida: no lo crea, no lo promueve y no lo expulsa»*.

En consecuencia, el Commercial State:

- **no crea** Leads;
- **no promueve** Leads;
- **no expulsa** Leads;
- **no sustituye** a ningún estadio del ciclo de vida de PO-01 §8.

## 7.4 Reglas de evolución

**CS-R1 — Puede retroceder.** Un negocio consciente de la solución puede volver a la indiferencia. El sistema debe admitirlo.

**CS-R2 — Puede detenerse indefinidamente.** Es un estado válido, igual que detenerse lo es en el ciclo de vida (PO-01 §8).

**CS-R3 — Solo avanza con evidencia.** Un contacto enviado no avanza el estado; **lo avanza la reacción del comprador**. Sin señal observada, el estado no cambia.

**CS-R4 — Puede ser desconocido.** Un Lead nunca contactado tiene un Commercial State indeterminado, y eso es correcto.

**CS-R5 — «Conversación» termina la secuencia, no la relación.** Alcanzarlo cumple el objetivo del sistema comercial (§3.1). A partir de ahí el sistema deja de empujar.

## 7.5 Ausencia de umbral comercial

**Ningún Commercial State y ningún Buyer Diagnosis condiciona que un Lead pueda ser contactado.**

Esta sección declara, para el sistema comercial, lo mismo que APS-08 §8.6 declara para el Opportunity Score.

**Lo que el Commercial State hace:** informar del punto de partida y orientar la estrategia.

**Lo que el Commercial State nunca hace:**

1. **Nunca descalifica un Lead.** Ninguna combinación de estado y diagnóstico impide contactarlo.
2. **Nunca oculta un Lead** de la Biblioteca ni de ninguna vista.
3. **Nunca define un mínimo** para recibir una estrategia o una secuencia.

**El sistema puede recomendar detener una secuencia; nunca puede excluir un Lead.** La diferencia es sustantiva: **detener una secuencia** es una recomendación sobre un esfuerzo comercial concreto, que el usuario acepta o ignora; **excluir un Lead** sería un umbral de exclusión, prohibido por PO-01 §7 y APS-08 §8.6. Un Lead cuya secuencia se detuvo permanece íntegro en la Biblioteca y puede recibir otra en cualquier momento.

## 7.6 Relación con `LeadStatus` — no se decide aquí

**El Commercial State es un concepto nuevo e independiente.** Este documento **no** lo relaciona con `LeadStatus`, **no** lo sustituye y **no** modifica PO-01.

La relación entre ambos vocabularios deberá declararse en su momento. **No puede decidirse hoy**: el conjunto de valores de `LeadStatus` es objeto de la desviación **A-01**, abierta y pendiente del Product Office. Fijar aquí una correspondencia consolidaría un vocabulario en disputa.

---

# 8. La Estrategia Comercial

Una **Estrategia Comercial** es el conjunto de decisiones que gobiernan **un contacto**.

## 8.1 Qué contiene

| Contenido | Descripción |
| --- | --- |
| **Objetivo** | El único avance que persigue (§4.5) |
| **Barrera** | La única resistencia que debe romper (§5.1) |
| **Base de evidencia** | Los hechos observados que puede afirmar (§11) |
| **Enfoque** | Qué se pone en primer plano, dada la identidad del negocio |
| **Emoción legítima** | Curiosidad, reconocimiento o comparación suave |
| **Hilo que retoma** | Qué asunto previo recoge (§4.6) |
| **Hilo que deja planteado** | Qué pregunta o asunto **enuncia** para el siguiente contacto |
| **Elemento de relevancia nuevo** | Qué aporta que el contacto anterior no contenía (§4.7) |
| **Canal y momento** | Dónde y cuándo tiene sentido |
| **Resultado esperado** | Qué se considerará éxito, en forma observable (§5.2) |

## 8.2 Qué no contiene

- **El texto del mensaje.** La redacción es posterior y separada (§10).
- **Instrucciones para el modelo.**
- **Detalle técnico** de ninguna clase.
- **Datos personales** de nadie.
- **Afirmaciones no sostenidas** por evidencia.

## 8.3 Qué decide

1. Qué se persigue en este contacto.
2. Qué resistencia se ataca.
3. Qué evidencia se pone sobre la mesa.
4. Qué emoción legítima se activa.
5. Por qué canal y en qué momento.
6. Qué se considerará éxito.

## 8.4 Qué nunca decide

1. **Si el contacto se envía.** Lo decide el usuario (§9.4).
2. **A quién se contacta.**
3. **Qué palabras finales se usan.** El usuario puede reescribir cualquier texto.
4. **Si un Lead merece esfuerzo comercial** (§7.5).
5. **Qué es cierto.** Eso lo determina la evidencia, no la estrategia.

## 8.5 Emociones admisibles

**Admisibles:** curiosidad, reconocimiento, comparación suave con el propio potencial del negocio.

**Excluidas por diseño:** miedo, vergüenza, culpa y presión temporal.

**Por qué.** No son eficaces en contacto frío —producen bloqueo, no respuesta— y son incompatibles con el Principio 10 de AF-00. La exclusión es **normativa, no estilística**.

---

# 9. La Secuencia Comercial

## 9.1 Qué es

Una **Secuencia Comercial** es el plan completo de contactos diseñado para conducir a un negocio hasta el estado **Conversación**.

**No es una lista de mensajes: es una estrategia con memoria.**

## 9.2 Los seis momentos

| # | Momento | Objetivo | Barrera | Nunca hace |
| --- | --- | --- | --- | --- |
| **1** | **Reconocimiento** | Que lea y se reconozca | Identidad · Relevancia | Proponer nada. Pedir nada |
| **2** | **Evidencia** | Que responda | Credibilidad | Insistir. **Retoma el hilo del 1** |
| **3** | **Demostración** | Que acepte ver algo | Relevancia aplicada | Pedir reunión. Hablar de precio |
| **4** | **Oferta** | Que acepte hablar | Riesgo | Presionar. Poner plazos falsos |
| **5** | **Seguimiento** | Recuperar la atención | Momento | **Repetir el contacto anterior** |
| **6** | **Reactivación** | Reabrir mucho después | Momento | Reiniciar la misma secuencia |

## 9.3 Reglas de la secuencia

**SC-R1 — Se diseña completa; se re-estrategiza contacto a contacto.** El plan íntegro es visible desde el principio; cada contacto se decide **antes de usarse**, a la luz de lo que realmente ocurrió.

**SC-R2 — Termina cuando existe conversación.** Cualquier momento puede ser el último, y ése es el resultado buscado.

**SC-R3 — Ningún contacto repite al anterior.** Si un contacto no aporta algo nuevo, **no se emite**. Insistir sin aportar convierte el contacto en frío en correo no deseado.

**SC-R4 — El silencio es información.** Indica qué barrera no se rompió y determina el movimiento siguiente. No es un fracaso ni autoriza a subir la presión.

**SC-R5 — Agotar una secuencia no expulsa al Lead.** Permanece íntegro en la Biblioteca con su historial, conforme a PO-01 §8 y APS-07 §7.2.

**SC-R6 — La secuencia no tiene disparadores temporales.** Ningún contacto se activa por el paso del tiempo (§9.4).

## 9.4 Alineación con APS-09 — Nivel 2

**APS-09 §7 fija el Nivel 2 — Recomendación como nivel de autonomía de la V1: «la IA propone acciones, pero el usuario decide si las ejecuta».** APS-09 §9 reserva expresamente al usuario la decisión de **contactar a una empresa**.

**La Secuencia Comercial se mantiene íntegramente en Nivel 2:**

| Actividad | Quién | Nivel |
| --- | --- | :-: |
| Diagnosticar | Sistema | 2 |
| Diseñar la estrategia | Sistema | 2 |
| Diseñar la secuencia | Sistema | 2 |
| Redactar el texto | Sistema | 2 |
| Recomendar el siguiente paso | Sistema | 2 |
| **Enviar el mensaje** | **Usuario** | — |
| **Detectar la respuesta** | **Usuario** | — |
| **Declarar el resultado** | **Usuario** | — |

**El sistema entrega un plan y un texto listo. El usuario envía.** Ninguna capacidad descrita en este documento requiere el Nivel 3, y **ninguna se ejercerá sin acción explícita del usuario**.

**Queda fuera de este marco, por corresponder al Nivel 3:** el envío automático, la detección automática de respuestas, los seguimientos disparados por tiempo y la actualización de estados sin intervención del usuario.

## 9.5 El resultado lo declara el usuario

El avance de una secuencia depende de que el usuario declare qué ocurrió. La declaración mínima es binaria: **respondió / no respondió**.

**Sin declaración, la secuencia no avanza.** Es una consecuencia deliberada del Nivel 2: el sistema no observa el canal y **no debe suponer** lo que no le consta.

---

# 10. El Papel del Modelo de Inteligencia Artificial

## 10.1 La regla

**El modelo de IA redacta. No decide.**

| El modelo… | |
| --- | :-: |
| **No decide** el objetivo del contacto | ❌ |
| **No diagnostica** al comprador | ❌ |
| **No cambia** la estrategia | ❌ |
| **No elige** qué evidencia usar | ❌ |
| **No determina** qué es cierto | ❌ |
| **Redacta** el texto que materializa una estrategia ya decidida | ✅ |

**Toda decisión comercial pertenece al dominio.** El modelo recibe decisiones tomadas y produce lenguaje.

## 10.2 Qué recibe y qué devuelve

**Recibe:** el objetivo, la barrera, la emoción admisible, el hilo que retoma, el hilo que deja planteado, el canal con sus restricciones y —de forma determinante— **la lista cerrada de hechos afirmables** (§11).

**Devuelve:** el texto. Nada más.

## 10.3 El punto de control

**Todo texto se verifica contra la estrategia que lo originó antes de llegar al usuario.**

La verificación comprueba cinco cosas:

1. ¿Persigue el objetivo declarado, y solo ése?
2. ¿Respeta las restricciones del canal?
3. **¿Afirma algo que no está en la lista de hechos afirmables?**
4. ¿Retoma el hilo que debía retomar?
5. **¿Alude a algún hallazgo sin enunciarlo?** *(§4.7)*

**Un texto que no supera la verificación se rehace. No se entrega con una advertencia.**

**Por qué esta sección es necesaria.** Sin un punto de control, «el modelo no decide» sería una intención y no una propiedad. Es la comprobación lo que la convierte en verificable, conforme al Principio 2 de AF-00.

## 10.4 Por qué el modelo no diagnostica

Un diagnóstico determina qué se dirá a un tercero en nombre del usuario. Si lo produjera un modelo generativo sin criterio gobernado:

- no podría explicarse por qué se dijo lo que se dijo;
- no podría versionarse el criterio;
- no podría demostrarse que un cambio mejora algo;
- las afirmaciones no serían rastreables a evidencia.

Es exactamente la razón por la que el Opportunity Score se calcula con un Perfil de Ponderación publicado y gobernado, y no lo estima un modelo. **El sistema comercial adopta el mismo criterio.**

---

# 11. La Regla de Evidencia

## 11.1 Enunciado

**Toda afirmación comercial sobre un negocio debe poder rastrearse hasta un hallazgo del análisis.**

## 11.2 Las tres clases de conocimiento

| Clase | Qué es | Qué autoriza | Qué prohíbe |
| --- | --- | --- | --- |
| **Observada** | Hallazgo del análisis: presencia web, reputación visible, datos de contacto, categoría | **Puede afirmarse** en un contacto | — |
| **Inferida** | Lectura comercial construida sobre lo observado | **Puede orientar** la estrategia | **Nunca puede afirmarse** como hecho |
| **Desconocida** | Aquello que el análisis declara no medible | **Puede reconocerse abiertamente** | **Nunca puede rellenarse** con un valor plausible |

## 11.3 Consecuencias

**RE-1 — La lista de hechos afirmables es cerrada.** El redactor no puede salir de ella (§10.2).

**RE-2 — Lo inferido no cruza al mensaje.** Puede decidir el enfoque; no puede enunciarse como hecho.

**RE-3 — Lo desconocido se declara, no se disimula.** Es coherente con APS-08 §11 y con el Principio 10 de AF-00.

**RE-4 — La ignorancia declarada es un activo de confianza.** Reconocer con precisión qué no puede saberse desde fuera es específico, honesto y difícil de ignorar. **No es una carencia que ocultar.**

**RE-5 — El sistema dirá menos cosas, y serán ciertas.** Es una consecuencia aceptada: en frío, tres hechos verificables convierten mejor que diez plausibles, porque el receptor comprueba el primero y decide si sigue leyendo.

## 11.4 Advertencia sobre la cobertura real

La base de evidencia disponible **es más delgada de lo que aparenta**. El modelo de evaluación declara que solo una parte de sus factores es medible con información pública (APS-08 §11).

**El Buyer Diagnosis hereda esa limitación y debe declararla, nunca compensarla.** Rellenar con inferencias los huecos de la evidencia produciría un diagnóstico aparentemente completo y realmente infundado — el modo de fallo más peligroso de este marco.

---

# 12. Criterios de Aceptación

Cada criterio es **objetivamente comprobable**. Un criterio que requiera interpretación no pertenece a esta sección.

| # | Criterio | Cómo se comprueba | Origen |
| --- | --- | --- | --- |
| **CA-01** | Toda estrategia tiene un Buyer Diagnosis asociado | No existe estrategia sin diagnóstico | §4.1 |
| **CA-02** | Cada contacto declara **exactamente un** objetivo | Recuento de objetivos por contacto = 1 | §4.5 |
| **CA-03** | El objetivo de un contacto no dista más de **un peldaño** del anterior | Comparación de peldaños consecutivos | §4.5 |
| **CA-04** | Cada contacto declara **exactamente una** barrera | Recuento de barreras por contacto = 1 | §5.1 |
| **CA-05** | El primer contacto de toda secuencia tiene objetivo *reconocimiento* y **no contiene oferta, precio ni petición de reunión** | Inspección del primer contacto | §4.2 |
| **CA-06** | Ningún contacto emite una observación crítica sin reconocimiento previo | Inspección del contacto | §4.1 · §4.2 |
| **CA-07** | Ninguna secuencia sitúa un momento *Oferta* antes de un momento *Evidencia* | Orden de los momentos | §4.4 |
| **CA-08** | Todo contacto a partir del segundo declara qué **hilo retoma**, y es el que dejó planteado el anterior | Trazado de hilos | §4.6 |
| **CA-09** | Toda afirmación de un contacto se corresponde con un hallazgo **observado** | Contraste afirmación ↔ evidencia | §11 |
| **CA-10** | Ninguna afirmación de urgencia carece de hallazgo que la respalde | Inspección de referencias temporales | §4.8 |
| **CA-11** | Ninguna variable del diagnóstico está rellenada por defecto | Las ausentes constan como desconocidas | §6.1 BD-2 |
| **CA-12** | Todo diagnóstico declara su confianza | Presencia del valor de confianza | §6.1 BD-3 |
| **CA-13** | El resultado esperado de todo contacto es **observable y binario** | Admite respuesta sí/no sin interpretar | §5.2 |
| **CA-14** | Ningún Commercial State ni diagnóstico impide contactar un Lead | No existe regla de exclusión | §7.5 |
| **CA-15** | Agotar una secuencia no retira el Lead de la Biblioteca | El Lead permanece con su historial | §9.3 SC-R5 |
| **CA-16** | Ningún contacto se emite sin acción explícita del usuario | No existe disparador temporal ni automático | §9.4 |
| **CA-17** | Ningún texto llega al usuario sin superar el punto de control de §10.3 | Registro de verificación por texto | §10.3 |
| **CA-18** | Ningún texto afirma un hecho fuera de la lista cerrada | Contraste texto ↔ lista | §10.2 · §11.3 RE-1 |
| **CA-19** | Ningún contacto activa miedo, vergüenza, culpa o presión temporal | Inspección del contacto | §8.5 |
| **CA-20** | El Commercial State solo avanza ante una señal declarada por el usuario | No hay avance sin declaración | §7.4 CS-R3 · §9.5 |
| **CA-21** | Ningún contacto repite el contenido del anterior | Comparación entre contactos consecutivos | §9.3 SC-R3 |
| **CA-22** | Ninguna variable del diagnóstico contiene datos personales | Inspección de las siete variables | §6.1 BD-5 |
| **CA-23** | **Ningún contacto alude a un hallazgo que no enuncia** | Toda referencia a un hallazgo va acompañada del hallazgo | §4.7 |
| **CA-24** | **Ninguna entrega de información se condiciona a que el receptor responda** | Inspección del contacto | §4.7 |
| **CA-25** | **Cada contacto aporta al menos un elemento de relevancia que el anterior no contenía** | Comparación con el contacto precedente | §4.7 |

> **CA-23, CA-24 y CA-25 se incorporaron en la v1.1** y verifican el principio de **Progressive Relevance**. Se añadieron al final para no alterar la numeración existente: **la trazabilidad de un criterio no debe romperse por una revisión posterior.**

---

# 13. Casos Especiales

**CE-1 — Lead sin análisis y sin Opportunity Score.** No puede producirse un Buyer Diagnosis fundado: no hay evidencia. **No es un error**, es un estado válido (PO-01 §5). El sistema lo declara y no propone estrategia.

**CE-2 — Diagnóstico con todas las variables desconocidas.** Válido. Autoriza únicamente contactos cuya base de evidencia sea observada y mínima. **Nunca autoriza a inferir para rellenar.**

**CE-3 — El comprador responde en el primer contacto.** La secuencia **termina inmediatamente**: se alcanzó el objetivo (§3.1). No se emiten los contactos restantes.

**CE-4 — El comprador responde que no.** Se registra la objeción real. Es la información más valiosa que el sistema puede recibir. **No autoriza a insistir**; sí a una reactivación posterior con otro ángulo (§9.2, momento 6).

**CE-5 — El usuario no declara el resultado.** La secuencia queda detenida. **No se supone nada** (§9.5). El Lead permanece íntegro.

**CE-6 — El usuario reescribe por completo el texto.** Es su derecho (§8.4). El sistema conserva la estrategia y el texto original, y registra que hubo reescritura.

**CE-7 — La evidencia disponible contradice el diagnóstico previo.** Prevalece la evidencia. El diagnóstico se reemite; **el anterior no se destruye**.

---

# 14. Riesgos

| # | Riesgo | Impacto | Mitigación |
| --- | --- | :-: | --- |
| **RG-1** | **La relevancia disponible es finita.** Progressive Relevance exige que cada contacto aporte algo nuevo, y la evidencia sobre un negocio se agota. Una secuencia larga puede quedarse **sin nada relevante que decir** antes de alcanzar la conversación | **Alto** | Es el efecto buscado, no un defecto: cuando no hay nada más relevante que aportar, **la secuencia se detiene** (SC-R3 · CA-25). Detenerse es válido (CS-R2) y no expulsa al Lead (SC-R5). **Sustituye al RG-1 de la v1.0, cerrado con IN-1** |
| **RG-2** | **La declaración de resultado depende de la disciplina del usuario.** Sin ella el sistema queda ciego | **Alto** | §9.5 · CE-5. Es el mayor riesgo de adopción del marco |
| **RG-3** | **La secuencia degenera en insistencia** si SC-R3 no se comprueba de verdad | **Alto** | CA-21. Es la diferencia entre contacto en frío y correo no deseado |
| **RG-4** | **La base de evidencia es delgada.** Solo parte de los factores es medible | Medio-alto | §11.4 · CA-11 · CA-12 |
| **RG-5** | **Ausencia de marco sobre contacto en frío.** Ningún documento aprobado cubre consentimiento ni base legal | Medio-alto | **Preexistente; no lo introduce este documento.** Materia de una revisión futura de APS-10 |
| **RG-6** | **El marco nace sin evidencia observada**, derivado de principios | Medio | Misma provisionalidad declarada que el Perfil de Ponderación en APS-08 §7.1 |
| **RG-7** | **«Recomendar detener» puede deslizarse hacia un umbral de exclusión** | Medio | §7.5 · CA-14. La distinción es normativa y comprobable |
| **RG-8** | ~~**Las siete variables no son calculables hasta que exista APS-19**~~ | — | ✅ **Cerrado.** **APS-19 v1.1 está `Approved`** *(Sprint Gobernanza Final, paso 3)* y desarrolla las siete variables con sus indicios y sus límites de afirmación |

---

# 15. Dependencias

Este documento depende de:

- **AF-00 — The Constitution of AKVEZ.** Artículo IV, Principios 2 y 10. **Nivel constitucional.**
- **PO-01 v1.2 — Decisión Canónica de Lead.** §5, §7, §8. Autoridad funcional del dominio.
- **PO-02 v1.3 — Alcance del Sistema Comercial.** §2, §3, §4, §5, §6. **Autoridad funcional del sistema comercial; resuelve Q-5.**
- **APS-07 v2.1 — Data & Knowledge Architecture.** §7.2, §8.4.
- **APS-08 v1.2 — Opportunity Scoring Framework.** §8.6, §9, §11. Precedente estructural y fuente de la evidencia.
- **APS-09 — AI Decision Framework.** §7 (Nivel 2), §8, §9.
- **APS-01 — Product Vision.** §8.2.
- **APS-02 v2.1 — Product Scope.**
- **APS-03 v3.1 — Agent Architecture.** §7.2, §7.3.
- **ADS-00 v1.3 — Documentation Standard.**
- **COM-02 — Commercial Intelligence Architecture Draft.** Origen funcional. *Documento de trabajo en `docs/architecture/`, fuera del catálogo del Blueprint. No es autoridad vigente.*

**Condiciona a:** APS-19 · APS-20 · los ADR del sistema comercial · toda implementación del agente comercial.

---

# 16. Glosario

**Sistema Comercial:** Conjunto de capacidades de AKVEZ dedicadas a conducir a un negocio desde el desconocimiento hasta una conversación con el profesional. Sustituye conceptualmente al «Pitch Generator».

**Conversación:** Intercambio real iniciado por el comprador tras un contacto. **Es el objetivo del sistema comercial** y el estado terminal del Commercial State.

**Buyer Diagnosis:** Lectura comercial de un negocio, expresada en siete variables de negocio con su confianza declarada. *(§6)*

**Commercial State:** Posición psicológica del comprador respecto del problema, la solución y el proveedor. **Es un atributo del Lead, no un estadio de su ciclo de vida.** *(§7)*

**Estrategia Comercial:** Conjunto de decisiones que gobiernan **un** contacto. *(§8)*

**Secuencia Comercial:** Plan completo de contactos diseñado para alcanzar el estado Conversación. **Se diseña; nunca se ejecuta automáticamente.** *(§9)*

**Micro-Yes:** Avance mínimo que persigue un contacto. Un contacto persigue uno solo. *(§4.5)*

**Barrera:** Resistencia del comprador que un contacto debe romper. Una por contacto. *(§5.1)*

**Progressive Relevance:** Principio oficial por el que AKVEZ genera interés mediante **relevancia progresiva, evidencia específica y claridad contextual, nunca mediante ocultamiento deliberado de información**. Sustituye al concepto «Mental Debt», retirado del marco. *(§4.7)*

**Hilo:** Pregunta o asunto que un contacto **enuncia de forma explícita** y que el siguiente retoma. Es **respondible en cualquier momento**: nada se retiene al receptor. *(§4.6)*

**Elemento de relevancia:** Aportación de un contacto que el anterior no contenía. Todo contacto debe incorporar al menos uno. *(§4.7 · CA-25)*

**Regla de Evidencia:** Obligación de que toda afirmación comercial sea rastreable hasta un hallazgo del análisis. *(§11)*

**Hecho afirmable:** Conocimiento observado que un contacto puede enunciar. La lista es cerrada. *(§11.3 RE-1)*

**Lead:** Empresa incorporada al espacio de trabajo comercial de un usuario. Existe desde su Registro. *(PO-01 §2)*

---

# 17. Referencias

- AF-00 — The Constitution of AKVEZ, Artículo IV, Principios 2 y 10.
- PO-01 v1.2 — Decisión Canónica de Lead, §5, §7, §8.
- **PO-02 v1.3 — Alcance del Sistema Comercial**, §2 a §8.
- ADS-00 v1.3 — Documentation Standard, *Jerarquía Documental* (R-6).
- APS-01 — Product Vision, §8.2.
- APS-02 v2.1 — Product Scope, §6, §7.
- APS-03 v3.1 — Agent Architecture, §7.2, §7.3.
- APS-07 v2.1 — Data & Knowledge Architecture, §7.2, §8.4.
- APS-08 v1.2 — Opportunity Scoring Framework, §4.5, §8.6, §9, §11.
- APS-09 — AI Decision Framework, §7, §8, §9.
- COM-02 — Commercial Intelligence Architecture Draft *(documento de trabajo, fuera del catálogo)*.

---

# 18. Evaluación AQS

| Criterio | Puntaje |
| --- | --- |
| Claridad | 20/20 |
| Completitud | **19/20** |
| Implementabilidad | 20/20 |
| Consistencia | **15/15** |
| Escalabilidad | 15/15 |
| Calidad Editorial | 10/10 |

**AQS Total:** **99/100**

**Estado:** ✅ **APPROVED**

**Variación respecto de la v1.0:**

- **Consistencia 12 → 15.** **IN-1 queda `Closed`.** No subsiste ningún conflicto con AF-00: el concepto incompatible fue eliminado, no reinterpretado. Los ocho principios de §4 son ahora mutuamente coherentes y compatibles con el Principio 10.
- **Completitud 17 → 19.** §4.7 deja de estar suspendido y el marco es aplicable en su totalidad. **Se mantiene −1**: las siete variables de §6 siguen sin ser calculables hasta que exista **APS-19**. Es una frontera de alcance declarada en §2 y §6.2, no una omisión.
- **v1.2 — la deducción restante queda cerrada.** **APS-19 v1.1 está `Approved`** y desarrolla las siete variables. **No se recalcula el AQS**: la evaluación corresponde al contenido, que la v1.2 no modifica.

---

# 19. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 2.

## 19.1 Verificación de autoridad

| Comprobación | Resultado |
| --- | :-: |
| **Es orden 3** y no reinterpreta ningún documento superior | ✅ |
| **AF-00, Artículo IV, Principios 2 y 10** — **IN-1 `Closed`** en la v1.1 por eliminación del concepto en conflicto, nunca por interpretación de la norma constitucional | ✅ |
| **PO-01 v1.2 §5, §7, §8** — ninguna etapa expulsa; no hay Top N ni umbral | ✅ |
| **Propietario y aprobador**: AKVEZ Product Office, que es la autoridad de la categoría APS | ✅ |

## 19.2 Compatibilidad con PO-02 v1.3

**PO-02 es orden 2 y prevalece.** Verificado punto por punto:

| PO-02 | APS-18 | Resultado |
| --- | --- | :-: |
| **§2** — diseñar ≠ ejecutar ≠ automatizar; **Prueba del Disparador** | §9 diseña la Secuencia; **§10.1** reserva al modelo la redacción y no la ejecución | ✅ **Compatible** |
| **§3** — la Propuesta es estrategia, evidencia y texto | §8.1 define la Estrategia y §11 la Regla de Evidencia. La Propuesta de PO-02 los contiene | ✅ |
| **§4** — la Secuencia es un plan, no un compromiso | **§9** define hasta seis momentos y **SC-R5** impide que agotarla expulse al Lead | ✅ |
| **§5** — Contactado solo por declaración del usuario | **§9.5 y CE-5** hacen depender el avance de la declaración. **APS-18 no atribuye transición de estadio a ningún acto del agente** | ✅ |
| **§6.2 punto 17** — prohibido puntuar, ordenar o descalificar por el diagnóstico | **§7.5 y CA-14**: «recomendar detener» **nunca** es umbral de exclusión | ✅ |
| **§8** — la salida del agente es **doble** | **C-1/Q-5 resueltas.** §9 aporta el plan; la Propuesta es la unidad. **APS-18 no requería cambio**, y así lo declaró PO-02 §8 | ✅ |

**Ninguna contradicción detectada.**

## 19.3 Riesgos al ratificar

**RG-8 se cierra** *(§14)*. **RG-1 a RG-7 se mantienen intactos**, con su redacción y severidad. Dos merecen constancia expresa:

- **RG-2** *(la declaración del usuario es condición de todo)* es el mismo riesgo que PO-02 §9.4 declara como **mayor riesgo de adopción**. **Es una consecuencia asumida del Nivel 2 de APS-09 §7, no un defecto corregible.**
- **RG-5** *(ausencia de marco sobre contacto en frío)* es **preexistente y de producto**, no de arquitectura. Reaparece como **Q-4 de APS-20 §12** y queda registrado allí como acción pendiente fuera de este sprint.

## 19.4 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.2 son: estado, historial, autoridad de portada, versiones citadas en §15 y §17, cierre de RG-8 y esta sección.
