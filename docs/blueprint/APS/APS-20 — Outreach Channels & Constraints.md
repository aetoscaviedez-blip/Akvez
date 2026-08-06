# APS-20 — Outreach Channels & Constraints

## APS-20 — Outreach Channels & Constraints

**Versión:** 1.1

**Estado:** ✅ Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Aprobado por:** AKVEZ Product Office — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30

**Estándar Aplicado:** ADS-00 v1.3

**Autoridad de dominio:** PO-01 v1.2 · **PO-02 v1.3** (Approved) · **APS-18 v1.2** (marco comercial, Approved) · **APS-19 v1.1** (diagnóstico, Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-30 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se incorpora **§17** con la constancia de la ratificación. **Q-3 y Q-4 de §12 se ratifican como acciones de producto pendientes**, con destinatario y disparador expresos: **no son decisiones de arquitectura y no bloquean el Architecture Freeze**, pero **Q-3 impide comprobar CC-02** hasta que APS-17 publique CH-01 a CH-03. Se actualizan las versiones citadas en la portada y en **§13** —APS-18 v1.1 → **v1.2**, APS-19 v1.0 → **v1.1**— y se da de alta **PO-02 v1.3**. **No se modifica ninguna sección de contenido:** ni §3, ni la personalización de §4, ni las restricciones comunes de §5, ni los tres canales de §6, ni la correspondencia canal-momento de §7, ni los 20 criterios de §9. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 4. Verificados el ciclo comercial —correspondencia canal ↔ momento de la Secuencia— y las reglas de negocio de §5, contra PO-02 v1.3 y APS-18 v1.2. |
| 1.0 | 2026-07-30 | AKVEZ Product Office | Primera definición oficial de los **canales de contacto y sus restricciones**: qué es un canal en AKVEZ, qué significa personalización, restricciones comunes a todo canal, los tres canales iniciales —Email frío, LinkedIn Connection Note e Instagram DM— con su propósito, longitud, personalización esperada y elementos permitidos y prohibidos, y la correspondencia entre canal y momento de la secuencia. **No define automatización, ni envío, ni seguimiento, ni ningún mensaje.** | Sprint **COM-05**. Cierra la frontera de alcance declarada en **APS-18 §2** y **APS-19 §2**. **Dos cuestiones quedan elevadas al Product Office sin resolver: §12.** |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Qué es un canal en AKVEZ
4. Personalización
5. Restricciones comunes a todo canal
6. Los tres canales iniciales
7. Correspondencia entre canal y momento de la secuencia
8. Relación con APS-18 y APS-19
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

Un canal no es un formato: **es un contrato de comportamiento**.

Un correo frío, una nota de conexión de LinkedIn y un mensaje directo de Instagram admiten longitudes distintas, registros distintos y expectativas distintas. **El mismo contenido, trasladado sin adaptación de uno a otro, deja de funcionar en dos de los tres.**

Este documento define qué admite cada canal, qué prohíbe y **qué momentos de la secuencia puede transportar**. Su tesis operativa: **el canal no decide la estrategia; la restringe.** Cuando un canal no puede transportar una estrategia, **se cambia el canal, nunca la estrategia**.

**Un canal no es una integración.** AKVEZ no envía nada (APS-09 Nivel 2): el usuario envía. Este documento describe superficies de comunicación, no servicios conectados.

---

# 2. Propósito del Documento

Establecer las restricciones de comunicación por canal, de modo que toda estrategia producida conforme a APS-18 pueda materializarse sin degradarse ni incumplir el canal en que se emite.

**Lo que este documento decide:**

- Qué es un canal y qué papel tiene en la arquitectura comercial.
- Qué significa personalización, en términos comprobables.
- Qué restricciones rigen en todo canal, y cuáles en cada uno.
- Qué momentos de la secuencia admite cada canal.

**Lo que este documento no decide, deliberadamente:**

- **El envío.** No define cómo, cuándo ni con qué servicio se envía nada.
- **Ninguna automatización, integración ni seguimiento.**
- **Ningún mensaje, texto, plantilla ni instrucción para ningún modelo.**
- **Los valores numéricos de los límites** *(§3.3 y §12, cuestión Q-3)*.
- **Nada relativo a `LeadStatus`** ni al ciclo de vida de PO-01.

---

# 3. Qué es un canal en AKVEZ

## 3.1 El canal restringe; no decide

**El orden es invariable:**

```
Diagnóstico  →  Estrategia  →  Canal  →  Redacción
```

La estrategia se decide **antes** de elegir canal *(APS-18 §8.3)*. El canal determina después **si esa estrategia cabe** y en qué forma.

**Regla de resolución del conflicto.** Cuando una estrategia no cabe en el canal previsto:

1. **Se cambia de canal**, si otro la admite.
2. Si ningún canal la admite, **la estrategia es demasiado pesada para un solo contacto** y debe repartirse en dos momentos de la secuencia.
3. **Nunca se abrevia la estrategia hasta que quepa**, y **nunca se excede el canal para que quepa.**

**Por qué.** Abreviar una estrategia hasta encajarla produce un mensaje que ya no persigue el objetivo que justificaba su existencia — un contacto que no rompe ninguna barrera y consume una oportunidad.

## 3.2 El canal no amplía la base de evidencia

**Regla determinante.**

La lista cerrada de hechos afirmables procede **exclusivamente del análisis** *(APS-18 §10.2 · APS-19 §8.4)*. **El canal no la modifica.**

Que un canal exponga información sobre el negocio —publicaciones, actividad reciente, perfil— **no convierte esa información en hecho afirmable**. No procede del análisis, no está registrada, no es reproducible y nadie ha verificado su vigencia.

**Consecuencia práctica:** contactar por Instagram **no autoriza** a afirmar nada visto en Instagram. Si esa información debiera poder afirmarse, tendría que incorporarse al análisis — decisión de APS-08 y APS-19, no de este documento.

**Sin esta regla, la Regla de Evidencia se vacía por el canal**, que es su fuga más probable.

## 3.3 Los límites del canal no los fija AKVEZ

**Las longitudes máximas y las restricciones de formato las impone cada plataforma**, y pueden cambiar sin que AKVEZ decida nada.

Por tanto **no se publican valores numéricos en este documento**: quedarían obsoletos sin que ninguna decisión de producto lo hubiera provocado, y **R-50 exige que todo límite proceda de APS-17**, nunca de un literal disperso.

Este documento **propone** los parámetros correspondientes conforme al procedimiento de **APS-17 §9, G-4**. Véase **§12, cuestión Q-3**.

## 3.4 Canal no es integración

**APS-11 §9** enumera LinkedIn y las plataformas de correo entre las integraciones **futuras**. Ninguna existe hoy, y **este documento no requiere ninguna**: el usuario envía manualmente *(APS-18 §9.4)*.

Un canal, en APS-20, es **una superficie de comunicación con reglas propias**, no un servicio conectado.

---

# 4. Personalización

## 4.1 Qué no es

**Personalizar no es insertar el nombre del negocio.** Un mensaje que solo cambia el nombre es un mensaje masivo con una variable, y el receptor lo reconoce de inmediato.

## 4.2 Qué es

> **Personalización es la densidad de hechos observados específicos de este negocio que un contacto contiene.**

Se mide contando **hechos observados** —de la lista cerrada de §3.2— que **solo podrían decirse de este negocio y de ningún otro**.

Es la aplicación directa de **Progressive Relevance** *(APS-18 §4.7)*: el interés procede de la especificidad, no de la intriga.

## 4.3 El suelo mínimo

> **Ningún contacto es admisible en ningún canal si no contiene al menos un hecho observado específico de este negocio.**

Es la restricción común más importante de este documento, y la única que ningún canal puede relajar. Un contacto sin ningún hecho específico **no es un contacto en frío personalizado: es un envío masivo**, con independencia de lo bien redactado que esté.

## 4.4 La densidad esperada depende del canal

La capacidad del canal determina cuántos hechos caben **sin degradar la legibilidad**. Más no es mejor: acumular observaciones en un espacio corto produce un mensaje denso que nadie termina de leer.

---

# 5. Restricciones comunes a todo canal

Rigen en los tres canales y en cualquiera que se incorpore.

| # | Restricción | Origen |
| --- | --- | --- |
| **RC-1** | **Al menos un hecho observado específico del negocio** | §4.3 |
| **RC-2** | **Ninguna afirmación fuera de la lista cerrada de hechos afirmables** | APS-18 §10.2 · CA-18 |
| **RC-3** | **Ninguna alusión a un hallazgo que no se enuncia** | APS-18 §4.7 · CA-23 |
| **RC-4** | **Ninguna información condicionada a que el receptor responda** | APS-18 §4.7 · CA-24 |
| **RC-5** | **Ninguna referencia temporal sin indicio que la sostenga** | APS-18 §4.8 · APS-19 §8.2 |
| **RC-6** | **Ninguna lectura inferida enunciada como hecho** | APS-19 §8.4 · CD-19 |
| **RC-7** | **Ninguna emoción interna atribuida al receptor** | APS-19 §4.4 · CD-05 |
| **RC-8** | **Ni miedo, ni vergüenza, ni culpa, ni presión temporal** | APS-18 §8.5 |
| **RC-9** | **Ningún identificador técnico, traza ni dato interno** | APS-04 §A.9, UI-9 |
| **RC-10** | **Ningún dato personal inferido del receptor** | APS-19 §4.5 · CD-06 |
| **RC-11** | **El emisor se identifica como la persona real que es** | AF-00, Principio 10 |
| **RC-12** | **Ningún contacto depende de señales de lectura o apertura** | APS-18 §9.5 |
| **RC-13** | **Ningún reconocimiento crítico sin reconocimiento previo** | APS-18 §4.1 · CA-06 |

> **Sobre RC-11 y RC-12.** **RC-11** prohíbe toda forma de suplantación o de emisor ambiguo: es aplicación directa del Principio 10 de AF-00. **RC-12** impide que el diseño asuma que AKVEZ sabe si un mensaje se leyó — **no lo sabe**, porque no observa el canal: el resultado lo declara el usuario *(APS-18 §9.5)*.

---

# 6. Los tres canales iniciales

## 6.1 Email frío

**Propósito.** Es el canal de **mayor capacidad** y el único con asunto. Soporta la secuencia completa y es el canal por defecto cuando existe dirección de correo.

**Micro-yes alcanzables.** Hasta *aceptar hablar* — los cinco peldaños de APS-18 §4.5.

**Longitud.** La mayor de los tres. Valor en **APS-17**, parámetro propuesto `CH-01` *(§12, Q-3)*.

**Personalización esperada.** **Alta:** admite varios hechos observados sin degradar la legibilidad.

**Elementos permitidos:**

- Asunto.
- Cuerpo estructurado en párrafos breves.
- **Un enlace como máximo**, y solo a un activo propio del emisor.
- Firma con identidad real y verificable.
- **Una** pregunta final explícita y respondible.

**Elementos prohibidos:**

- **Adjuntos de cualquier tipo.** Señal de correo no deseado en un primer contacto y motivo frecuente de no entrega.
- Imágenes incrustadas y maquetación de boletín.
- **Más de un enlace.**
- **Un asunto que prometa algo que el cuerpo no entrega.** Es ocultamiento en el punto de mayor visibilidad: **incumple el Principio 10 de AF-00 y CA-23**.
- **Formato que simule ser respuesta a un hilo previo inexistente** —«RE:», «Fwd:»—. Es suplantación de contexto y vulnera **RC-11**.
- Remitente que no identifique a la persona real.
- Más de una pregunta.

## 6.2 LinkedIn Connection Note

**Propósito.** Es **el canal más restrictivo de los tres** y el más malinterpretado. Su objetivo **no es conseguir una conversación: es conseguir la conexión.**

**Micro-yes alcanzable.** **Uno solo: *reconocerse*.** Aceptar una solicitud de conexión es un acto afirmativo de coste muy bajo, y corresponde al segundo peldaño de APS-18 §4.5. **No alcanza *responder*** y no debe diseñarse para ello.

**Longitud.** La más restrictiva. Valor en **APS-17**, parámetro propuesto `CH-02` *(§12, Q-3)*.

**Personalización esperada.** **Exactamente un hecho observado.** No cabe más sin abreviar hasta perder sentido.

**Elementos permitidos:**

- Una observación específica y verificable sobre el negocio.
- Identificación del emisor.

**Elementos prohibidos:**

- **Enlaces.** Consumen el límite y no se comportan como tales en este contexto.
- **Cualquier oferta**, propuesta o mención de servicio.
- **Cualquier petición de reunión, llamada o respuesta.**
- Abreviaturas o supresiones que degraden la observación para hacerla caber.

> **Regla propia de este canal.** **Si la observación no cabe, no se abrevia: se cambia de canal.** Una observación mutilada deja de ser específica, y sin especificidad el contacto incumple **RC-1**.

## 6.3 Instagram DM

**Propósito.** Canal de **registro informal**, en un espacio que el negocio atiende de forma habitual porque publica en él. Su ventaja es la cercanía; su riesgo, la intrusión.

**Micro-yes alcanzables.** Hasta *aceptar ver algo*. **No alcanza *aceptar hablar***.

**Longitud.** Intermedia, con exigencia de brevedad muy superior a la del correo. Valor en **APS-17**, parámetro propuesto `CH-03` *(§12, Q-3)*.

**Personalización esperada.** **Uno o dos hechos observados.**

**Elementos permitidos:**

- Registro conversacional y directo.
- Mensaje breve, en una sola emisión.
- **Una** pregunta.

**Elementos prohibidos:**

- **Enlaces.** Mal tolerados en el canal y perjudiciales para la entrega.
- Registro formal de correo: saludos protocolarios, firmas, estructura de carta.
- **Cualquier oferta.** El canal no la admite sin resultar intrusivo.
- **Varios mensajes consecutivos.** Es insistencia dentro de un mismo contacto y vulnera el espíritu de **SC-R3** de APS-18.
- Audio, imagen o vídeo.
- **Toda afirmación sobre lo publicado en el propio canal** — **§3.2**.

## 6.4 Cuadro comparativo

| | **Email frío** | **LinkedIn Connection Note** | **Instagram DM** |
| --- | :-: | :-: | :-: |
| **Asunto** | ✅ Sí | ❌ No existe | ❌ No existe |
| **Capacidad** | Alta | **Muy baja** | Media-baja |
| **Registro** | Profesional | Profesional | **Informal** |
| **Hechos observados** | Varios | **Exactamente uno** | Uno o dos |
| **Enlaces** | Uno, propio | ❌ Prohibidos | ❌ Prohibidos |
| **Oferta admisible** | ✅ Sí | ❌ No | ❌ No |
| **Micro-yes máximo** | Aceptar hablar | **Reconocerse** | Aceptar ver algo |
| **Adjuntos** | ❌ Prohibidos | ❌ No aplica | ❌ Prohibidos |

---

# 7. Correspondencia entre canal y momento de la secuencia

**No todo canal transporta todo momento.** Es consecuencia directa de la capacidad: una nota de conexión no puede sostener una oferta, y forzarla produce un mensaje que incumple su propio canal.

| Momento *(APS-18 §9.2)* | Email frío | LinkedIn Note | Instagram DM |
| --- | :-: | :-: | :-: |
| **1 · Reconocimiento** | ✅ | ✅ | ✅ |
| **2 · Evidencia** | ✅ | ❌ | ✅ |
| **3 · Demostración** | ✅ | ❌ | ✅ |
| **4 · Oferta** | ✅ | ❌ | ❌ |
| **5 · Seguimiento** | ✅ | ❌ | ✅ |
| **6 · Reactivación** | ✅ | ❌ | ✅ |

**Reglas de la correspondencia:**

**CM-1 — La nota de conexión solo transporta el momento 1.** Agotado, la secuencia continúa por otro canal.

**CM-2 — La oferta solo se emite por correo.** Es el único canal con capacidad y registro adecuados.

**CM-3 — Una secuencia puede cambiar de canal entre momentos.** El cambio es una decisión de estrategia *(APS-18 §8.1)*, no una consecuencia técnica.

**CM-4 — El cambio de canal no reinicia la secuencia.** El hilo se mantiene: el contacto siguiente retoma el del anterior aunque llegue por otra vía *(APS-18 §4.6 · CA-08)*.

---

# 8. Relación con APS-18 y APS-19

## 8.1 Qué consume este documento

| De | Qué consume |
| --- | --- |
| **APS-18 §4.5** | La escalera de micro-yes, para fijar el techo de cada canal |
| **APS-18 §4.7** | Progressive Relevance, base de la definición de personalización (§4.2) |
| **APS-18 §9.2** | Los seis momentos, para la correspondencia de §7 |
| **APS-18 §10.2** | La lista cerrada de hechos afirmables, que el canal **no amplía** (§3.2) |
| **APS-19 §8.2** | Las restricciones derivadas de variables Desconocidas |

## 8.2 Qué aporta al resto del marco

Aporta **la restricción de forma** que el Nivel 3 de APS-18 §10 necesita: el redactor recibe el canal **con sus límites**, y el punto de control de APS-18 §10.3 puede comprobar objetivamente si el texto los respeta.

**Sin APS-20, la comprobación «¿respeta el canal?» de APS-18 §10.3 carecía de criterio.** Este documento se lo aporta.

## 8.3 Lo que este documento no altera

- **No modifica** ninguna estrategia, ningún diagnóstico ni ningún principio.
- **No amplía** la base de evidencia (§3.2).
- **No introduce** ningún nivel de autonomía nuevo: el usuario sigue enviando *(APS-18 §9.4)*.

---

# 9. Criterios de Aceptación

Numerados **CC-xx**, distintos de los **CA-xx** de APS-18 y de los **CD-xx** de APS-19.

| # | Criterio | Cómo se comprueba | Origen |
| --- | --- | --- | --- |
| **CC-01** | **Todo contacto contiene al menos un hecho observado específico del negocio** | Recuento de hechos específicos ≥ 1 | §4.3 · RC-1 |
| **CC-02** | Ningún contacto excede el límite publicado de su canal | Longitud ≤ límite de APS-17 | §3.3 |
| **CC-03** | **Ningún contacto afirma información procedente del canal y no del análisis** | Contraste afirmación ↔ lista cerrada | §3.2 |
| **CC-04** | La estrategia se fija antes que el canal | El canal no altera objetivo ni barrera | §3.1 |
| **CC-05** | **Ninguna estrategia se abrevia para caber en un canal** | Ante conflicto consta cambio de canal o reparto en dos momentos | §3.1 |
| **CC-06** | La nota de conexión transporta **únicamente** el momento 1 | Inspección de la secuencia | §7 CM-1 |
| **CC-07** | **Ninguna oferta se emite por un canal distinto del correo** | Inspección de la secuencia | §7 CM-2 |
| **CC-08** | Un cambio de canal **no reinicia** la secuencia | El contacto siguiente retoma el hilo anterior | §7 CM-4 |
| **CC-09** | El correo contiene **como máximo un enlace**, y a un activo propio | Recuento de enlaces ≤ 1 | §6.1 |
| **CC-10** | **Ningún contacto incluye adjuntos** | Ausencia de adjuntos | §6.1 · §6.3 |
| **CC-11** | **El asunto no promete nada que el cuerpo no entregue** | Contraste asunto ↔ cuerpo | §6.1 · CA-23 |
| **CC-12** | **Ningún asunto simula ser respuesta a un hilo previo** | Ausencia de prefijos de respuesta o reenvío | §6.1 · RC-11 |
| **CC-13** | Ni la nota de conexión ni el DM contienen enlaces | Recuento de enlaces = 0 | §6.2 · §6.3 |
| **CC-14** | La nota de conexión contiene **exactamente un** hecho observado | Recuento = 1 | §6.2 |
| **CC-15** | **Ninguna observación se abrevia hasta perder especificidad** | La observación es íntegra o se cambió de canal | §6.2 |
| **CC-16** | El DM se emite en **un solo mensaje** | Recuento de emisiones por contacto = 1 | §6.3 |
| **CC-17** | **El emisor se identifica como la persona real** en todo canal | Presencia de identidad real | RC-11 |
| **CC-18** | **Ningún contacto contiene más de una pregunta** | Recuento de preguntas ≤ 1 | §6.1 · §6.3 |
| **CC-19** | Ningún contacto depende de señales de lectura o apertura | Ausencia de dependencia de esas señales | RC-12 |
| **CC-20** | **Las trece restricciones comunes se cumplen en los tres canales** | Verificación de RC-1 a RC-13 | §5 |

---

# 10. Casos Especiales

**CE-1 — El negocio solo tiene un canal disponible.** Frecuente: muchos negocios sin sitio web solo son alcanzables por Instagram. **La secuencia se diseña con los momentos que ese canal admite** (§7), y no se fuerza ninguno que no soporte. Si el canal no admite oferta, **la secuencia termina antes** — resultado válido, y detenerse lo es *(APS-18 §7.5)*.

**CE-2 — El negocio no tiene ningún canal alcanzable.** Estado válido. **No convierte al Lead en peor ni lo retira de nada** *(PO-01 §8)*. No se propone secuencia.

**CE-3 — La observación disponible no cabe en la nota de conexión.** Se cambia de canal; **no se abrevia** *(§6.2 · CC-15)*.

**CE-4 — La plataforma modifica su límite.** Se actualiza el parámetro en APS-17. **No requiere modificar este documento** — es precisamente la propiedad que justifica §3.3.

**CE-5 — El canal muestra información valiosa sobre el negocio.** No se afirma *(§3.2)*. Si debiera poder afirmarse, la vía es incorporarla al análisis, no al mensaje.

**CE-6 — El usuario reescribe el texto y excede el canal.** Es su derecho *(APS-18 §8.4)*. El sistema **advierte**; no impide ni corrige. La responsabilidad sobre lo enviado es del usuario *(APS-09 §9)*.

---

# 11. Riesgos

| # | Riesgo | Impacto | Mitigación |
| --- | --- | :-: | --- |
| **RH-1** | **La base de evidencia se amplía por el canal**, vaciando la Regla de Evidencia | **Alto** | §3.2 · CC-03. **Es la fuga más probable de todo el marco** |
| **RH-2** | **La estrategia se abrevia para caber**, produciendo contactos que no rompen ninguna barrera | **Alto** | §3.1 · CC-05 · CC-15 |
| **RH-3** | **La nota de conexión se diseña para conseguir respuesta**, objetivo que no puede alcanzar | Medio-alto | §6.2 · CC-06 |
| **RH-4** | **Los límites no existen todavía en APS-17**, y CC-02 no puede comprobarse | Medio-alto | **§12, Q-3.** Bloquea la verificación, no el diseño |
| **RH-5** | **Las condiciones de uso de las plataformas no están cubiertas por ningún documento aprobado** | Medio-alto | **§12, Q-4.** Preexistente; este documento lo agudiza al nombrar plataformas concretas |
| **RH-6** | **Instagram y LinkedIn pueden restringir el contacto no solicitado** con independencia de que el envío sea manual | Medio | Fuera del control de AKVEZ. El riesgo lo asume el usuario, que es quien envía |
| **RH-7** | **Las restricciones de §6 derivan de principios, no de datos observados** | Medio | Misma provisionalidad declarada que WP-01 en APS-08 §7.1. Se ajustarán con operación real |

---

# 12. Cuestiones elevadas al Product Office

> ## 📌 Pronunciamiento del Product Office — Sprint *Gobernanza Final*, 2026-07-30
>
> **Las dos cuestiones son de producto, no de arquitectura**, y por eso **no impiden el Architecture Freeze** ni la ratificación de este documento. **Ninguna se resuelve aquí**: ambas exigen modificar un APS ajeno, expresamente fuera del alcance del sprint que las examina.
>
> | # | Estado | Destinatario | Disparador |
> | :-: | :-: | --- | --- |
> | **Q-3** | 🟡 **Acción de producto registrada** | **APS-17 §6** — revisión **aditiva** que publique `CH-01`, `CH-02` y `CH-03` | **Antes de implementar la redacción de cualquier canal.** Los tres parámetros ya tienen capa declarada *(Infraestructura)* y prueba de invariancia superada; **falta publicarlos, no decidirlos** |
> | **Q-4** | 🟡 **Acción de producto registrada** | **APS-10** — incorporar contacto en frío, base legal y condiciones de uso de plataformas de terceros | **Antes de la salida al mercado** *(APS-15)*. **Preexistente**: consta como **RG-5** en APS-18 §14 desde su v1.0 |
>
> ⚠️ **Consecuencia expresa de Q-3, y debe conocerse:** **el criterio `CC-02` de §9 no puede comprobarse** mientras los tres parámetros no existan en APS-17. Es una limitación **declarada**, no un incumplimiento de este documento — **R-50 prohíbe precisamente que APS-20 los publique por su cuenta**.
>
> **Ninguna de las dos es una decisión abierta sobre arquitectura comercial.** Q-3 es configuración cuya capa **ya decidió ADR-11 §8.3**; Q-4 es marco legal y de confianza.

## Q-3 — Los límites de canal no existen en APS-17, y R-50 exige que procedan de allí

**R-50 de DEV-00 es terminante:** *«Todo límite, cupo, tanda, tiempo de espera o número de reintentos usa el valor publicado en APS-17. No se inventan valores ni se codifican literales dispersos.»*

**APS-17 §6 publica únicamente `PG-01` a `PG-04`.** No existe ningún parámetro de canal.

**Este documento no los publica**, porque hacerlo sería fijarlos fuera de APS-17 —contra R-50— y congelar en un APS unos valores que **cambian por decisión de terceros** (§3.3).

**Se proponen tres parámetros**, con su capa y el resultado de la prueba de admisibilidad de APS-17 §3, conforme al procedimiento de **G-4**:

| Parámetro propuesto | Qué fija | Capa | **Prueba del Criterio de Invariancia** |
| --- | --- | --- | --- |
| **`CH-01`** | Longitud máxima del correo frío | Infraestructura | *¿Cambiaría el conjunto de Leads del usuario?* → **No.** Restringe el mensaje, no el conjunto → **Admisible** |
| **`CH-02`** | Longitud máxima de la nota de conexión | Infraestructura | **No** → **Admisible** |
| **`CH-03`** | Longitud máxima del mensaje directo | Infraestructura | **No** → **Admisible** |

**Ninguno reside en la capa de dominio**, conforme a **G-3** y ADR-11 §8.1.

**Publicarlos exige revisar APS-17**, lo que este sprint tiene expresamente prohibido. **Hasta que existan, CC-02 no puede comprobarse.** Se solicita autorización para una revisión aditiva de APS-17 §6.

## Q-4 — Ningún documento aprobado cubre el contacto en frío ni las condiciones de uso de las plataformas

Este documento nombra **tres plataformas de terceros** cuyas condiciones de uso regulan el contacto comercial no solicitado.

**APS-10 — Security, Privacy & Trust Framework no contiene ninguna disposición sobre contacto en frío, base legal, consentimiento ni condiciones de uso de plataformas de terceros.** Verificado por lectura directa.

**No es un problema que introduzca APS-20** —ya constaba como **RG-5** en APS-18 §14—, pero **este documento lo agudiza**: pasar de hablar de «canales» en abstracto a nombrar Email, LinkedIn e Instagram convierte un vacío general en uno concreto y atribuible.

**El riesgo recae sobre el usuario**, que es quien envía, y AKVEZ es quien redacta lo que envía. **La cuestión excede el alcance de un APS de canales** y corresponde a una revisión de APS-10, prohibida en el sprint que la detectó.

> 📌 **Disposición del Product Office, 2026-07-30.** **Q-4 queda registrada como acción de producto con destinatario y disparador**: revisión de **APS-10**, exigible **antes de la salida al mercado** *(APS-15)*. **No es una decisión de arquitectura** y no condiciona el Architecture Freeze. Consta también como **RG-5** en APS-18 §14 y en el mapa de pendientes de **ADS-01 §11**.

---

# 13. Dependencias

Este documento depende de:

- **AF-00 — The Constitution of AKVEZ.** Artículo IV, Principio 10.
- **PO-01 v1.2 — Decisión Canónica de Lead.** §8.
- **PO-02 v1.3 — Alcance del Sistema Comercial.** §2 *(la Prueba del Disparador)* · §4 · §6.2.
- **APS-18 v1.2 — Commercial Strategy Framework.** §4.5, §4.7, §4.8, §8.4, §8.5, §9.2, §9.4, §10.2, §10.3.
- **APS-19 v1.1 — Buyer Diagnosis Model.** §4.4, §4.5, §8.2, §8.4.
- **APS-09 — AI Decision Framework.** §7 (Nivel 2), §9.
- **APS-04 v4.0 — Human Interface System.** §A.9 (UI-9).
- **APS-11 — Integration Architecture & External Services.** §9. *(Véase §3.4)*
- **APS-17 v1.1 — Initial Product Parameters.** §3, §6, §9. **Véase Q-3.**
- **APS-10 — Security, Privacy & Trust Framework.** **Véase Q-4.**
- **DEV-00 v1.4 — Implementation Rules.** R-50, R-52. **Véase Q-3.**
- **ADS-00 v1.3 — Documentation Standard.**
- **ADR-11 v2.1 — Frontera entre Dominio e Implementación.** §8.3 — *decide que el valor de canal es infraestructura*.
- **ADR-16 v1.1 — Arquitectura del Dominio Comercial.** **D-3** — *la regla de canal es dominio; el valor numérico no*.

**Condiciona a:** los ADR del sistema comercial · toda implementación de la redacción y de su verificación.

---

# 14. Glosario

**Canal:** Superficie de comunicación con reglas propias de longitud, registro y formato. **No es una integración** *(§3.4)*.

**Personalización:** Densidad de **hechos observados específicos** de un negocio que un contacto contiene. **No es insertar el nombre** *(§4.2)*.

**Hecho observado específico:** Hecho de la lista cerrada de hechos afirmables que **solo podría decirse de este negocio** *(§4.2)*.

**Capacidad del canal:** Cuánta estrategia puede transportar un canal sin degradarla ni incumplir sus límites.

**Restricción común:** Regla que rige en todos los canales y que ninguno puede relajar *(§5)*.

**Correspondencia canal-momento:** Relación que declara qué momentos de la secuencia admite cada canal *(§7)*.

---

# 15. Referencias

- AF-00 — The Constitution of AKVEZ, Artículo IV, Principio 10.
- PO-01 — Decisión Canónica de Lead, §8.
- ADS-00 v1.3 — Documentation Standard.
- APS-04 v4.0 — Human Interface System, §A.9.
- APS-09 — AI Decision Framework, §7, §9.
- APS-10 — Security, Privacy & Trust Framework.
- APS-11 — Integration Architecture & External Services, §9.
- APS-17 v1.1 — Initial Product Parameters, §3, §6, §9.
- APS-18 v1.2 — Commercial Strategy Framework, §4, §8, §9, §10.
- APS-19 v1.1 — Buyer Diagnosis Model, §4, §8.
- PO-02 v1.3 — Alcance del Sistema Comercial, §2, §4, §6.2.
- ADR-11 v2.1 §8.3 · ADR-15 v1.2 §9.3 · ADR-16 v1.1 D-3.
- DEV-00 v1.4 — Implementation Rules, R-50, R-52.

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

**AQS Total:** **98/100**

**Estado:** ✅ **APPROVED**

**Deducción, y por qué se mantiene:**

- **Implementabilidad −2.** **Q-3 sigue siendo una acción de producto pendiente**: **CC-02 no puede comprobarse** mientras APS-17 no publique `CH-01`, `CH-02` y `CH-03`. El documento es completo y consistente; **una de sus veinte comprobaciones carece hoy de valor de referencia**, y puntuar implementabilidad plena sería inexacto.

> **La deducción no se levanta al ratificar, y es deliberado.** Ratificar no fabrica los tres parámetros. **Se aprueba el documento, no se declara verificable lo que no lo es.**

**Ratificado con Q-3 y Q-4 registradas como acciones de producto** —ninguna es un conflicto normativo ni una decisión de arquitectura—, **pero CC-02 no será verificable hasta que APS-17 se revise.**

---

# 17. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 4.

## 17.1 Verificación del ciclo comercial

**Correspondencia canal ↔ momento de la Secuencia** *(§7)*, contrastada con APS-18 §9 y PO-02 §4:

| Comprobación | Resultado |
| --- | :-: |
| Cada momento de la Secuencia tiene canal admisible declarado, y ninguno queda sin correspondencia | ✅ |
| **La Secuencia se diseña completa y no se ejecuta**: ningún canal implica envío ni integración *(§3.4)* | ✅ |
| **La Prueba del Disparador de PO-02 §2.1 se supera**: ningún canal admite emitir un contacto sin acción del usuario **para ese contacto concreto** | ✅ |
| **Ningún canal detecta respuestas, lecturas ni aperturas** — PO-02 §6.2 puntos 10 a 13 | ✅ |
| **Alcanzar una conversación concluye la Secuencia**; agotarla **no expulsa al Lead** — PO-02 §4 regla 5 · PO-01 §8 | ✅ |

## 17.2 Verificación de las reglas de negocio

| Comprobación | Resultado |
| --- | :-: |
| **Ninguna afirmación fuera de la lista cerrada de hechos afirmables** — APS-18 §11 · APS-19 §4.2 · ADR-15 §10.2 | ✅ |
| **La regla de canal es dominio; el valor numérico no** — la distinción de §3.3 coincide literalmente con **ADR-16 D-3** y **ARCH-01 §2.3** | ✅ |
| **Ningún valor de canal reside en `domain/`** — APS-17 G-3 · ADR-11 §8.1 · **R-52** | ✅ |
| **Ninguna traza ni identificador técnico alcanza al receptor** — APS-04 §A.9 UI-9 | ✅ |
| **No se almacena dato personal de terceros** — PO-02 §7.3 · APS-19 §4.5 · ADR-16 RC-11 | ✅ |

## 17.3 Compatibilidad verificada

| Documento | Resultado |
| --- | :-: |
| **PO-02 v1.3** §2, §4, §6.2 | ✅ Compatible |
| **APS-18 v1.2** §9 *(Secuencia)*, §11 *(Regla de Evidencia)* | ✅ Compatible |
| **APS-19 v1.1** §4.4, §4.5 *(clases de conocimiento)* | ✅ Compatible |
| **APS-02 v2.1 §7** — *«Automatización de seguimiento»* excluida | ✅ Compatible. **Diseñar un canal no es automatizarlo** *(PO-02 §2.2)* |
| **APS-11 §9** — integraciones | ✅ Compatible. **Un canal no es una integración** *(§3.4)* |

## 17.4 Riesgos al ratificar

**Los riesgos de §11 se mantienen intactos.** El más relevante al ratificar es el que **Q-4** describe: AKVEZ redacta lo que el usuario envía, y **ningún documento aprobado cubre todavía el contacto en frío**. **Es exposición de producto, no defecto de arquitectura**, y su destinatario es APS-10.

## 17.5 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.1 son: estado, historial, autoridad de portada, el pronunciamiento sobre Q-3 y Q-4 en §12, versiones citadas en §13, la nota del AQS y esta sección.
