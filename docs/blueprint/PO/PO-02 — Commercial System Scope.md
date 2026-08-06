# PO-02 — Decisión de Producto: Alcance del Sistema Comercial

| Campo | Valor |
| --- | --- |
| Código | PO-02 |
| Clasificación | Product Decision — Autoridad Funcional del Sistema Comercial |
| Versión | 1.3 |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Redactado por | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30 |
| Autoridad sobre | Alcance, vocabulario y límites del Sistema Comercial |
| **Sustituye en autoridad a** | **PO-01 §8**, exclusivamente en cuanto al **evento que produce la transición a *Lead Contactado***. El resto de PO-01 permanece íntegro |
| Resuelve | **Q-5** de ADR-15 §15 · las cinco decisiones de producto de COM-02 §12 |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.3** | 2026-07-30 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra **§11** con la firma y se incorpora **§12**, con la constancia de la ratificación y las verificaciones ejecutadas. **Dos correcciones de sincronización interna, sin contenido decisional:** **§0 C-5** y **§9.4 tercera** afirmaban que «A-01 sigue abierta», redactadas en la v1.0 **antes** de que la v1.2 incorporase §5.1 y la cerrase. **No se modifica ninguna decisión:** §1 a §8, §9.1 a §9.3 y §10 permanecen literalmente intactos. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 1. Primer documento del orden obligatorio: **es orden 2 y toda la cadena comercial deriva de él.** Verificadas LS-1 a LS-5 y el cierre de A-01. |
| **1.2** | 2026-07-30 | Product Office | **Cierre de A-01.** Se incorpora **§5.1**, que fija los cuatro estados oficiales del Lead —`Lead · Analyzed · Scored · Contacted`— y retira los seis anteriores con su motivo. Se añaden las reglas **LS-1 a LS-5**. **Ninguna otra sección resulta modificada.** | Sprint de **Estabilización del Dominio Comercial**, decisión 1. La desviación **A-01** llevaba abierta desde DEV-01A y **solo el Product Office podía cerrarla**: `Stale` afecta a la **materia cerrada E-5 de ADR-11 §9**, que ningún ADR puede reabrir. El análisis **COM-08** añadió dos defectos no registrados: **la ausencia de un valor para *Lead Evaluado*** y la **ambigüedad sobrevenida de `Pitched`** tras la separación de §5. |
| **1.1** | 2026-07-30 | Architecture Team | **Corrección de alcance declarado.** Se completa **§9.1** con los tres documentos omitidos en la v1.0 —**PO-01 §8**, **APS-07** y **ADS-01**— y se renombra de «APS que deberán actualizarse» a «Documentos que deberán actualizarse», por contener ahora documentos de orden 2 y un ADS. Se incorpora a la portada la **declaración de sustitución parcial de PO-01 §8**. Se precisa en **§1** que el nombre oficial del agente se conserva hasta un acto de *naming* separado. **Ninguna decisión de producto resulta modificada:** §2 a §8 y §10 permanecen literalmente intactos. | Sprint **COM-09**, tarea 1. El análisis de impacto **COM-08** acreditó que la conflación «Contactado = propuesta generada» **nace en PO-01 §8** y se transcribe en APS-07 y ADS-01, documentos que la v1.0 no había identificado. Aprobar la v1.0 habría firmado una decisión cuyo propio alcance estaba mal declarado — riesgo **RI-1** de COM-08. |
| 1.0 | 2026-07-30 | Architecture Team | Redacción inicial. Decide el alcance del Sistema Comercial en la V1, la distinción entre diseñar, ejecutar y automatizar, las definiciones canónicas de **Lead Contactado**, **Propuesta Comercial** y **Secuencia Comercial**, la compatibilidad entre APS-03, APS-18, APS-09 y APS-02, y qué datos deben sobrevivir entre contactos. | Sprint **COM-07**. Desbloquea **ADR-15**, detenido por el conflicto **Q-5** entre dos documentos de orden 3, que ningún documento de orden inferior podía resolver. |

> **Naturaleza del documento.** Este documento **decide**. No analiza alternativas y no deja abierta ninguna cuestión de producto.
>
> **Es orden 2** conforme a ADS-00. Prevalece sobre APS y ADR, y **por eso puede resolver un conflicto entre dos APS** que ningún documento inferior podía resolver sin incumplir R-2.
>
> **No modifica ningún documento.** Decide, y **ordena** las actualizaciones que de ello se derivan en §9 — mismo procedimiento que PO-01 §9.

---

# 0. Contradicciones registradas antes de decidir

**Cinco contradicciones se registran aquí antes de tomar ninguna decisión.** Ninguna se resuelve por interpretación: las que este documento resuelve, las resuelve **decidiendo**.

## C-1 — Salida singular frente a secuencia

**APS-03 v3.0 §7.3** declara como salida del agente comercial: *«**Lead Contactado**: Lead con propuesta comercial generada»* — **una** propuesta.

**APS-18 v1.1 §9** define una **Secuencia** de hasta seis momentos.

**Ambos son orden 3.** ADS-00 resuelve los conflictos por precedencia de orden y **entre iguales no hay regla que decida**. Es el conflicto **Q-5** que detuvo ADR-15.

**Se resuelve en §3, §4 y §8.**

## C-2 — ¿Es la Secuencia una automatización de seguimiento?

**APS-02 v2.1 §7** excluye de la V1 la *«Automatización de seguimiento»*. **APS-05 §6** sitúa el seguimiento en la V2 y el *Follow-up Agent* en la V3.

Una Secuencia de varios contactos **podría leerse** como seguimiento.

**Se resuelve en §2.**

## C-3 — Generar un texto no es contactar a nadie

**ADR-13 §13.1** declara el evento **E-5 «Pitch generado»** y le atribuye **actualizar el estadio** del Lead — es decir, marcarlo *Contactado*.

**Generar una propuesta no contacta a nadie.** Un Lead cuya propuesta se redactó y nunca se envió **no ha sido contactado**, y registrarlo como tal haría que la Biblioteca afirmara algo falso.

**Se resuelve en §5.**

## C-4 — El catálogo de ADR-13 está cerrado

**ADR-13 §13.4:** *«Ningún evento no enumerado aquí podrá escribir en la Biblioteca.»* Ni el diagnóstico comercial ni la secuencia figuran en §6.2 ni en §13.1.

Es la cuestión **Q-1**, evaluada en ADR-15 §11.

**Este documento decide qué debe sobrevivir (§7). No decide cómo se persiste**: es materia de arquitectura, y su enmienda corresponde a un acto de gobernanza sobre ADR-13.

## C-5 — El vocabulario de estados sigue en disputa

La desviación **A-01** —los valores de `LeadStatus`— estaba abierta ante el Product Office cuando se redactó esta sección.

> ✅ **C-5 resuelta en la v1.2 de este documento.** **§5.1 fija los cuatro estados oficiales** —`Lead · Analyzed · Scored · Contacted`— con las reglas **LS-1 a LS-5**, y **A-01 queda `Closed` con la ratificación de la v1.3** (§12).
>
> **El párrafo anterior describe el estado en que se redactó la v1.0 y se conserva como registro.** No debe citarse como bloqueo vigente.

---

# 1. ¿Qué es el Sistema Comercial de AKVEZ?

> **El Sistema Comercial de AKVEZ es el conjunto de capacidades que acompañan al profesional desde que decide abordar un Lead hasta que consigue una conversación con él.**

No es un generador de mensajes. **Su resultado es una conversación**, no un texto.

**Sustituye en concepto al «Pitch Generator», pero no en nombre.**

**El nombre oficial del agente sigue siendo «Pitch Generator»** y no se renombra en este documento ni en las actualizaciones de §9.1. Cuando la claridad lo exija, se admite la forma **«Pitch Generator (Sistema Comercial)»**.

**El renombrado definitivo requiere un acto de *naming* separado**, todavía no convocado. **El concepto, en cambio, queda sustituido desde la aprobación de este documento**: lo que el agente hace es lo que define §6, con independencia de cómo se llame.

## Justificación de producto

AKVEZ existe para que un profesional independiente consiga clientes de forma constante. Un mensaje bien redactado no es un cliente. **La primera unidad de valor real, y la primera que AKVEZ puede observar, es una conversación abierta.**

No se elige *venta* como resultado porque **AKVEZ no puede observar una venta**. Perseguir un resultado que el sistema no puede verificar produciría una métrica que nadie puede comprobar. Cerrar es, además, el oficio del profesional: AKVEZ amplifica su criterio, no lo sustituye.

---

# 2. ¿Qué es diseñar, ejecutar y automatizar?

**Tres actos distintos. Confundirlos es lo que hace irresoluble el conflicto C-2.**

| Acto | Qué es | ¿Toca el mundo exterior? | Quién lo hace | ¿V1? |
| --- | --- | :-: | --- | :-: |
| **Diseñar** | Producir el diagnóstico, la estrategia, el plan de contactos y sus textos | **No** | AKVEZ | ✅ **Sí** |
| **Ejecutar** | Emitir un contacto concreto hacia un negocio | **Sí** | **El usuario** | ✅ Sí — *lo hace él* |
| **Automatizar** | Que un contacto se emita **sin acción del usuario para ese contacto** | Sí | AKVEZ | ❌ **No** |

## 2.1 La Prueba del Disparador

> **Ante cualquier capacidad comercial, se pregunta:**
>
> **¿Puede emitirse un contacto sin que el usuario ejecute una acción explícita *para ese contacto concreto*?**
>
> - **Sí** → es **automatización**. **Fuera de la V1.**
> - **No** → es **diseño**. **Dentro de la V1.**

**La expresión «para ese contacto concreto» es determinante.** Impide la lectura de que un usuario que aprueba una secuencia entera autoriza con ello sus seis envíos: eso **sería automatización**, porque cinco de los seis contactos se emitirían sin acción suya.

**Cada contacto exige una acción del usuario. Sin excepción.**

## 2.2 Consecuencia sobre C-2

**Diseñar una secuencia no es automatizar el seguimiento.**

Lo que APS-02 §7 excluye —y lo que APS-05 §6 sitúa en la V2 y la V3— es que **el sistema actúe por su cuenta**: que envíe, que detecte respuestas, que dispare contactos por el paso del tiempo. **Nada de eso está en la V1.**

Un plan que el usuario ve, aprueba contacto a contacto y ejecuta con sus propias manos **no es automatización: es asistencia**. **C-2 queda resuelta sin modificar APS-02.**

---

# 3. ¿Qué es una Propuesta Comercial?

> **Una Propuesta Comercial es el artefacto completo producido para un contacto: la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa.**

**No es solo el texto.**

## Justificación de producto

Una propuesta conservada como texto suelto **no puede explicarse después**: nadie podrá saber qué perseguía, qué evidencia la sostenía ni bajo qué criterio se decidió. Conservarla con su fundamento es lo que permite comparar dos versiones, aprender de lo que funcionó y responder al usuario cuando pregunte *por qué dice esto*.

## Reglas

1. **Una Propuesta corresponde a un contacto.** Singular, siempre.
2. **Toda Propuesta se conserva.** Regenerar **añade** una versión; **nunca sustituye** a la anterior.
3. **Una Propuesta generada y no enviada es un estado válido**, y **no convierte al Lead en Contactado** (§5).
4. **Toda Propuesta queda vinculada a la versión del criterio comercial que la produjo.**
5. **Ninguna afirmación de una Propuesta puede carecer de evidencia** procedente del análisis.

---

# 4. ¿Qué es una Secuencia Comercial?

> **Una Secuencia Comercial es el plan de contactos que AKVEZ propone a un profesional para conseguir una conversación con un Lead.**

**Es una propuesta de plan, no un compromiso de envío.**

## Justificación de producto

El contacto en frío no se resuelve en un mensaje. Presentar el plan completo desde el principio permite al profesional entender **por qué el primer contacto no pide una reunión**, que es la decisión que más cuesta aceptar y la que más determina el resultado.

## Reglas

1. **Se diseña completa**, y es visible antes de emitir nada.
2. **No obliga al usuario a nada.** Puede ignorarla, alterarla o detenerla en cualquier momento.
3. **Cada contacto exige una acción suya** (§2.1).
4. **Termina cuando hay conversación.** Es el objetivo, y alcanzarlo la concluye.
5. **Agotarla no expulsa al Lead.** Permanece íntegro en la Biblioteca, conforme a PO-01 §8.
6. **Detenerse es válido** en cualquier momento, igual que lo es en el ciclo de vida.
7. **Una Secuencia no es seguimiento automático** (§2.2).

---

# 5. ¿Cuándo un Lead está Contactado?

> **Un Lead está Contactado cuando el usuario declara haber emitido un contacto hacia él.**
>
> **No lo está por haberse generado una Propuesta.**

## Justificación de producto

Contactar es **un acto en el mundo**. AKVEZ no lo realiza —lo realiza el usuario— y **no puede observarlo**, porque no accede a ningún canal.

**La única fuente veraz es la declaración del usuario.** Marcar *Contactado* al generar un texto haría que la Biblioteca afirmara algo que nadie ha comprobado, y bastaría abrir una propuesta y descartarla para corromper el estadio de un Lead.

**Es preferible un dato ausente a un dato falso.** Un Lead con Propuesta generada y sin declaración permanece en su estadio anterior, que es exactamente lo que ocurrió.

## Consecuencia sobre C-3

**El evento E-5 de ADR-13 §13.1 no debe actualizar el estadio.** Generar una Propuesta escribe la Propuesta; **no cambia el estadio del Lead**.

La transición a *Contactado* corresponde a la **declaración del usuario**, cuya naturaleza es la del evento E-6 —decisiones del usuario— y no la de un evento de agente.

**Esta corrección se ordena en §9.2. Este documento no modifica ADR-13.**

---

## 5.1 ¿Cuáles son los estados oficiales del Lead? — cierre de A-01

> **Los estados persistidos del Lead son cuatro, y solo cuatro:**
>
> **`Lead` · `Analyzed` · `Scored` · `Contacted`**

| Estado | Significado | Lo produce |
| --- | --- | --- |
| **`Lead`** | Lead **registrado en la Biblioteca** | El Registro *(E-2)* |
| **`Analyzed`** | Lead con análisis completado | El Análisis *(E-3)* |
| **`Scored`** | Lead con evaluación comercial realizada | La Evaluación *(E-4)* |
| **`Contacted`** | Lead respecto del cual **el usuario declaró haber realizado contacto** | La declaración del usuario *(§5)* |

### Por qué se retiran los seis valores anteriores

El vocabulario vigente en el código —`Prospect · Audited · Pitched · Replied · Won · Stale`— presenta **cinco defectos**, tres registrados en la desviación **A-01** y dos detectados en el análisis **COM-08**:

| # | Valor | Defecto |
| :-: | --- | --- |
| 1 | `Prospect` | **Terminología del modelo derogado.** Contradice PO-01 §2 y la regla R-59 |
| 2 | `Stale` | **Sugiere caducidad.** Contradice PO-01 §8 —«ninguna etapa expulsa»— y la **materia cerrada E-5 de ADR-11 §9** |
| 3 | `Won` · `Replied` | Pertenecen a un embudo **posterior a la V1**, que PO-01 §8 sitúa expresamente fuera de alcance |
| 4 | **Ausencia** | **Ningún valor representa *Lead Evaluado***, que es el estadio que produce el Opportunity Score y **el único por el que la Biblioteca ordena** |
| 5 | `Pitched` | **Ambiguo desde §5.** Significa «propuesta lanzada», y emitir una Propuesta y declarar un contacto son ahora **dos hechos distintos**. No puede saberse cuál representa |

### Por qué esta decisión corresponde al Product Office

**ADR-11 §9 establece que ninguna materia cerrada puede reabrirse mediante un ADR**: solo una decisión del Product Office de rango igual o superior a PO-01. **`Stale` afecta a la materia cerrada E-5**, de modo que **ningún ADR ni documento DEV podía retirarlo**. Este documento tiene ese rango.

### Reglas

**LS-1 — La lista es cerrada.** Ningún valor adicional se admite sin decisión de Product Office de este rango.

**LS-2 — Ningún estado retira, oculta ni caduca un Lead.** No existe ni existirá un estado de expiración *(PO-01 §8 · ADR-11 §9, E-5)*.

**LS-3 — Los estados solo avanzan por el evento que los produce.** Emitir una Propuesta **no cambia el estado** *(§5)*.

**LS-4 — Un Lead puede detenerse indefinidamente en cualquier estado.** Es válido, no es un error *(PO-01 §8)*.

**LS-5 — El estado no es el Commercial State.** Aquél describe lo que AKVEZ ha hecho con el Lead; éste, lo que el comprador sabe *(APS-19 §5.5)*. **Son dos ejes independientes y ninguno sustituye al otro.**

> **A-01 queda `Closed` con la aprobación de este documento.** Su cierre formal en el registro de desviaciones corresponde al próximo bloque de gobernanza.

---

# 6. ¿Cuál es el alcance del Sistema Comercial en la V1?

## 6.1 Dentro del alcance

1. **Diagnóstico comercial** del Lead a partir de la evidencia del análisis.
2. **Diseño de la estrategia** de cada contacto.
3. **Diseño de la Secuencia** completa.
4. **Redacción** del texto de cada contacto.
5. **Verificación** del texto contra su estrategia y su evidencia.
6. **Recomendación** del siguiente movimiento.
7. **Memoria** entre contactos (§7).
8. **Registro de la declaración del usuario** sobre lo ocurrido.
9. **Explicación** de toda decisión comercial al usuario.

## 6.2 Fuera del alcance

10. **Enviar** cualquier contacto, por cualquier canal.
11. **Integrarse** con correo, LinkedIn, Instagram o cualquier plataforma.
12. **Detectar** respuestas o lecturas.
13. **Disparar** contactos por el paso del tiempo.
14. **Actualizar** estados sin declaración del usuario.
15. **Responder** por el usuario en una conversación abierta.
16. **CRM**, pipeline, agenda y gestión de contratos.
17. **Puntuar, ordenar o descalificar** Leads en función del diagnóstico.

> **Los puntos 10 a 15 no son limitaciones técnicas: son la frontera de §2.** Incorporarlos exigiría una decisión de producto nueva y el paso al Nivel 3 de autonomía, que APS-09 §7 reserva a versiones futuras.

---

# 7. ¿Qué datos deben sobrevivir entre contactos?

**Este documento decide *qué* debe sobrevivir. *Cómo* se persiste es materia de arquitectura (C-4).**

## 7.1 Debe sobrevivir

| # | Dato | Por qué |
| :-: | --- | --- |
| **1** | **El diagnóstico comercial vigente y sus versiones anteriores** | Sin él, cada contacto volvería a empezar de cero. Las versiones anteriores permiten ver cómo cambió la lectura |
| **2** | **La Secuencia: su plan y el momento vigente** | Es lo que hace representable «el contacto 2» |
| **3** | **Cada Propuesta emitida, íntegra y con su fundamento** | §3. Sin ella no puede explicarse ni compararse nada |
| **4** | **Cada declaración del usuario sobre lo ocurrido** | Es la única señal real de qué funciona, y lo único que mueve la secuencia |
| **5** | **La versión del criterio comercial con que se decidió** | Sin ella, una decisión conservada no puede reproducirse |

## 7.2 Reglas sobre lo que sobrevive

**S-1 — Nada se destruye.** Regenerar añade; una versión nueva nunca retira a la anterior.

**S-2 — El historial solo crece.** Ninguna entrada se elimina ni se altera retroactivamente.

**S-3 — Una declaración del usuario prevalece** sobre cualquier lectura que el sistema hubiera inferido.

**S-4 — Lo desconocido sobrevive como desconocido.** Nunca se rellena al conservarlo.

## 7.3 No debe almacenarse

- **Ningún dato personal** de quien está al otro lado de un contacto.
- **Ninguna afirmación** que no proceda del análisis o de una declaración del usuario.
- **Ninguna inferencia sobre capacidad económica** de nadie.

---

# 8. Compatibilidad resuelta

| Documento | Qué decía | Qué decide PO-02 | ¿Requiere cambio? |
| --- | --- | --- | :-: |
| **APS-03 §7.3** | Salida: *«Lead con propuesta comercial generada»* — singular | La salida del agente comercial es **doble**: una **Secuencia diseñada** y una **Propuesta por contacto**. La Propuesta sigue siendo singular; la Secuencia es el plan que ordena varias | ✅ **Sí** — §9.1 |
| **APS-18 §9** | Secuencia de seis momentos | **Compatible sin cambio.** La Secuencia es el plan; la Propuesta, la unidad | ❌ No |
| **APS-09 §7** | Nivel 2 en la V1 | **Compatible sin cambio.** Diseñar es Nivel 2; ejecutar lo hace el usuario (§2) | ❌ No |
| **APS-02 §7** | Excluye *«Automatización de seguimiento»* | **Compatible.** Diseñar no es automatizar (§2.2). Conviene precisarlo en el glosario para que no vuelva a leerse al revés | ⚠️ Aclaración |

**C-1 queda resuelta.** No había contradicción de fondo, sino una **confusión entre la unidad de salida y el plan que la ordena**. APS-03 §7.3 describía correctamente la unidad; le faltaba el plan.

**Este documento no reinterpreta APS-03: decide, y ordena su actualización en §9.1.** Es la facultad propia de un documento de orden 2.

---

# 9. Impacto Esperado

Enumeración, sin describir el modo de ejecución.

## 9.1 Documentos que deberán actualizarse

> **La conflación que §5 corrige está transcrita en cuatro niveles jerárquicos.** Cada documento copió fielmente al superior; ninguno inventó nada. **Por eso el orden de corrección no es indiferente:** corregir un documento antes que aquel del que deriva lo dejaría contradiciendo a su propia autoridad.

| Orden | Documento | Sección | Prioridad |
| :-: | --- | --- | :-: |
| **2** | **PO-01** | **§8** — el ciclo de vida y el rótulo del estadio terminal. **Es la raíz de la conflación** | **1.ª** |
| **3** | **APS-07** | **§16 Glosario** — la definición más explícita del Blueprint · **§7** *(Propuesta / Acción)* · **§6** *(diagrama APS-07-DIAG-001)* | **2.ª** |
| **3** | **APS-03** | **§7** tabla de agentes · **§7.3** responsabilidades y salidas · **§8.1** flujo canónico · Glosario | **3.ª** |
| **3** | **APS-02** | §6 y Glosario — precisar que *seguimiento automático* no incluye el diseño de una secuencia (§2.2) | 4.ª |
| **3** | **APS-04** | §A.5 (P-10) y **N-3** — el Pitch Workspace deja de producir un único mensaje | 4.ª |
| **—** | **ADS-01** | **§4.1** — fila del Pitch Generator en el mapa *quién hace qué* | **última** |

**El nombre del agente no cambia en ninguna de estas actualizaciones** (§1).

## 9.2 ADR que deberán revisarse

| Documento | Motivo |
| --- | --- |
| **ADR-13** | **§13.1 — E-5 deja de actualizar el estadio** (§5) · la transición a *Contactado* pasa a la declaración del usuario · incorporación de los activos y eventos que §7.1 exige conservar *(evaluados en ADR-15 §11)* |
| **ADR-15** | **Q-5 queda levantada.** Su §15 puede cerrarse en cuanto APS-03 §7.3 se actualice |

## 9.3 Código afectado

- La transición a *Contactado*, hoy inexistente en el flujo, pasa a depender de una declaración del usuario.
- La Propuesta debe conservarse con su fundamento, y **dejar de destruirse al regenerar**.
- El módulo comercial debe construirse desde el Composition Root para admitir persistencia.

## 9.4 Consecuencias que deben declararse expresamente

**Primera — la V1 exige trabajo manual.** El profesional enviará cada contacto con sus propias manos. **No es una carencia provisional: es la frontera de §2**, y conserva en él la responsabilidad sobre a quién escribe y con qué palabras. Debe comunicarse como decisión, no como limitación.

**Segunda — el sistema depende de que el usuario declare lo ocurrido.** Sin declaración, la Secuencia no avanza y el aprendizaje se detiene. **Es el mayor riesgo de adopción del Sistema Comercial**, y deriva directamente del Nivel 2.

**Tercera — ~~A-01 sigue abierta~~.** ✅ **Superada por la v1.2.** El texto original decía que este documento no fijaba el conjunto de valores del estadio y recomendaba cerrar A-01 en un acto propio. **Ese acto es §5.1**, incorporado en la v1.2: los cuatro estados oficiales quedan fijados con las reglas LS-1 a LS-5, y **A-01 queda `Closed`** con la ratificación de la v1.3 *(§12)*. **Se conserva la fila por trazabilidad; no debe citarse como decisión pendiente.**

---

# 10. Decisión Final

1. **El Sistema Comercial acompaña al profesional hasta conseguir una conversación.** Sustituye en concepto al *Pitch Generator*. *(§1)*
2. **Diseñar, ejecutar y automatizar son actos distintos.** La **Prueba del Disparador** los discrimina. *(§2)*
3. **Diseñar una secuencia no es automatizar el seguimiento.** APS-02 §7 no resulta vulnerado. *(§2.2)*
4. **Una Propuesta Comercial es estrategia, evidencia y texto**, no solo texto. Se conserva siempre; regenerar añade. *(§3)*
5. **Una Secuencia Comercial es un plan propuesto, no un compromiso de envío.** Cada contacto exige una acción del usuario. *(§4)*
6. **Un Lead está Contactado cuando el usuario declara haberlo contactado**, nunca por generarse una Propuesta. *(§5)*
7. **El alcance de la V1 es el de §6.** Enviar, detectar, disparar y actualizar por su cuenta quedan fuera.
8. **Cinco datos deben sobrevivir entre contactos**, y nada se destruye. *(§7)*
9. **La salida del agente comercial es doble: Secuencia y Propuesta.** **Q-5 queda resuelta.** *(§8)*
10. **Las actualizaciones de §9 no podrán iniciarse antes de la firma de §11.**

---

# 11. Firma

| Rol | Responsable | Estado | Fecha |
| --- | --- | :-: | --- |
| Redacción | AKVEZ Architecture Team | ✅ Completada | 2026-07-30 |
| **Aprobación** | **AKVEZ Product Office** | ✅ **Firmada** | **2026-07-30** |

> **Este documento constituye autoridad vigente desde su ratificación** *(v1.3)*. Las diez decisiones de §10 son exigibles, y las actualizaciones de §9 quedan habilitadas.

---

# 12. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 1.

## 12.1 Verificación de LS-1 a LS-5

| Regla | Verificación | Resultado |
| --- | --- | :-: |
| **LS-1** — La lista es cerrada | Contrastada con **ADR-11 §9** *(materias cerradas)*: fijar el vocabulario exige rango igual o superior a PO-01, y este documento lo tiene | ✅ |
| **LS-2** — Ningún estado retira, oculta ni caduca | Contrastada con **PO-01 §8**, **APS-07 §7.2** y la materia cerrada **E-5 de ADR-11 §9**. `Stale` queda retirado, que era el valor en conflicto | ✅ |
| **LS-3** — Los estados solo avanzan por su evento | Contrastada con **ADR-13 v1.2 §13.1**: **E-5 ya no actualiza el estadio** y **E-9** es el único que lo hace. La corrección ordenada en §9.2 **está ejecutada** | ✅ |
| **LS-4** — Detenerse indefinidamente es válido | Contrastada con **PO-01 §8** y **R-45** de DEV-00 | ✅ |
| **LS-5** — El estado no es el Commercial State | Contrastada con **APS-19 §5.5** y **ADR-16 BD-I4 y R-6**: dos ejes independientes, ninguno sustituye al otro | ✅ |

## 12.2 Cierre de A-01

> **La desviación A-01 queda `Closed`.**

Los cuatro estados oficiales son **`Lead · Analyzed · Scored · Contacted`** *(§5.1)*. Los seis valores anteriores —`Prospect · Audited · Pitched · Replied · Won · Stale`— quedan **retirados** con el motivo de cada uno documentado.

**Su registro formal se ejecuta en AR-05 §5.1** dentro de este mismo sprint, conforme a la cadencia vigente: el registro vivo de desviaciones solo cambia en un bloque de gobernanza.

**La corrección del código existente no forma parte de esta ratificación.** `LeadStatus` sigue declarando los seis valores derogados: es la deuda de implementación que el cierre de A-01 hace exigible, no un incumplimiento de este documento.

## 12.3 Compatibilidad verificada

| Documento | Resultado |
| --- | :-: |
| **PO-01 v1.2 §8** — sustitución parcial declarada en portada | ✅ Ejecutada. El estadio terminal es *«Lead respecto del cual el usuario ha declarado haber emitido un contacto»* |
| **APS-03 v3.1 §7.3** — salida doble | ✅ Ejecutada. **C-1 y Q-5 cerradas** |
| **APS-07 v2.1** · **ADS-01 v1.3** | ✅ Ejecutadas *(§9.1)* |
| **ADR-13 v1.2 §13.1** — E-5 deja de tocar el estadio; alta de E-7, E-8, E-9 | ✅ Ejecutada *(§9.2)* |
| **APS-02 §7** · **APS-09 §7** | ✅ Compatibles sin cambio *(§8)* |
| **ADR-11 §9 E-5** | ✅ No se reabre ninguna materia cerrada: se **retira** el valor que la vulneraba |

## 12.4 Hallazgo registrado — fuera de este sprint

> **H-24 — Las actualizaciones de §9.1 y §9.2 se ejecutaron antes de la firma de §11**, contra el punto 10 de §10 de este mismo documento.

**PO-01 v1.2, APS-07 v2.1, APS-03 v3.1, ADS-01 v1.2 y v1.3 y ADR-13 v1.2** se emitieron en los sprints COM-09 y *Estabilización del Dominio Comercial* citando a PO-02 como autoridad, **mientras PO-02 estaba en `Draft`**.

**Es la materialización exacta del riesgo RC-2 de AR-05** —tratar como norma una decisión que no ha descendido—. **La ratificación de hoy sanea el resultado**, porque el contenido aplicado coincide con el ratificado y las cinco actualizaciones se han verificado una a una en §12.3. **No sanea el procedimiento**, y se registra para que el Product Office se pronuncie sobre él fuera de este sprint. **No afecta a ninguna decisión de este documento.**

## 12.5 Alcance de esta ratificación

**No se modifica ninguna decisión.** Se corrigen dos afirmaciones internas —**§0 C-5** y **§9.4 tercera**— que declaraban A-01 abierta y que la v1.2 había dejado obsoletas al incorporar §5.1. **Es sincronización interna, no contenido nuevo.**
