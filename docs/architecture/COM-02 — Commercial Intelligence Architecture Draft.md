# COM-02 — Commercial Intelligence Architecture Draft

| Campo | Valor |
| --- | --- |
| Código | COM-02 |
| Clasificación | **Documento de trabajo** — ver nota de cumplimiento ADS-00 |
| Versión | 1.0 |
| Estado | **Draft** — pendiente de revisión del Product Owner |
| Fecha | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Origen | Bloque COM-01, resolución del 2026-07-30 |

**Nota de cumplimiento ADS-00.** La Clasificación Oficial de ADS-00 es **cerrada**; «COM» no pertenece a ella. Este documento **no es autoridad vigente y no se cataloga en el INDEX**: es un borrador de arquitectura funcional del que se derivarán después los APS y ADR correspondientes, que sí serán vinculantes. Mismo precedente que **GOV → AR-04** (INDEX §4.8). Ante cualquier discrepancia con un documento `Approved`, **prevalece el documento aprobado**.

**Alcance de este documento.** Responde a una sola pregunta: **¿cómo funciona AKVEZ para vender en frío, desde el primer contacto hasta generar una conversación?** Describe arquitectura **funcional**: qué decide el sistema, con qué información y en qué orden. **No contiene detalle técnico, ni contratos, ni prompts, ni código.**

---

# Tabla de Contenido

1. Qué cambia
2. El principio rector: nada se afirma sin evidencia
3. La frontera que no se cruza: diseñar no es ejecutar
4. Los cuatro niveles
5. El recorrido completo
6. La Secuencia y sus seis momentos
7. Memoria: qué recuerda el sistema
8. El papel del usuario
9. El bucle de aprendizaje
10. Qué **no** hace el sistema
11. Coherencia con el Blueprint
12. Decisiones de producto detectadas
13. Riesgos y preguntas abiertas

---

# 1. Qué cambia

**AKVEZ deja de generar mensajes y pasa a diseñar estrategia comercial.**

| | Antes | Ahora |
| --- | --- | --- |
| **Unidad de trabajo** | Un mensaje | Un **movimiento**: un intento de mover al comprador un paso |
| **Objetivo** | Que el texto quede bien | **Conseguir una conversación** |
| **Alcance temporal** | Un disparo | Una **secuencia** de contactos con memoria |
| **Quién decide qué decir** | El modelo generativo | **El sistema.** El modelo solo redacta |
| **Base de las afirmaciones** | Lo que el modelo infiera | **La evidencia del análisis** |
| **Qué se conserva** | Nada | Todo, **versionado** |

**El objetivo aprobado es acompañar al diseñador hasta conseguir una conversación con el cliente.** No es cerrar una venta: AKVEZ no puede observar una venta, pero sí puede observar una respuesta. La conversación es el resultado que el sistema persigue, mide y sabe reconocer.

**Corolario que gobierna todo lo demás:** el objetivo del primer contacto **nunca es vender**. Es conseguir que responder resulte más barato que ignorar.

---

# 2. El principio rector: nada se afirma sin evidencia

**Regla de Evidencia — toda afirmación comercial sobre un negocio debe poder rastrearse hasta un hallazgo del análisis.**

El sistema distingue tres clases de conocimiento, y **cada una autoriza un uso distinto**:

| Clase | Origen | Qué autoriza |
| --- | --- | --- |
| **Observado** | Hallazgo del análisis: presencia web, reputación visible, datos de contacto, categoría | **Puede afirmarse** en un mensaje |
| **Inferido** | Lectura comercial construida sobre lo observado | **Puede orientar** el enfoque. **Nunca puede afirmarse** como hecho |
| **Desconocido** | Factores que el análisis declara **no medibles** | Puede reconocerse abiertamente. **Nunca puede rellenarse** |

Esta separación es lo que hace que «el modelo ya no decide» sea una propiedad real y no una aspiración: el redactor recibe una **lista cerrada de hechos afirmables** y no puede salir de ella.

**Tres consecuencias que conviene aceptar de entrada:**

1. **El sistema dirá menos cosas, y serán ciertas.** Un mensaje que afirma tres hechos verificables convierte mejor en frío que uno que afirma diez plausibles, porque el receptor comprueba el primero y decide si sigue leyendo.
2. **La cobertura real es limitada y hay que declararlo.** Hoy solo la mitad de los factores del modelo de evaluación son medibles con información pública. El diagnóstico comercial hereda esa limitación y **debe declararla**, igual que el Opportunity Score declara su confianza.
3. **Lo que no se pudo medir tiene valor comercial propio.** «No puedo saber desde fuera si tu web carga rápido en móvil» es una frase honesta, específica y difícil de ignorar. **La ignorancia declarada es un activo de confianza**, no una carencia que ocultar.

---

# 3. La frontera que no se cruza: diseñar no es ejecutar

| | **Diseñar** *(dentro de la V1)* | **Ejecutar** *(fuera de la V1)* |
| --- | --- | --- |
| Diagnosticar al comprador | ✅ | |
| Decidir la estrategia del contacto | ✅ | |
| Redactar el mensaje | ✅ | |
| Diseñar la secuencia completa | ✅ | |
| Recomendar el siguiente paso | ✅ | |
| **Enviar el mensaje** | | ❌ |
| **Detectar la respuesta automáticamente** | | ❌ |
| **Disparar seguimientos por tiempo** | | ❌ |
| **Actualizar estados sin el usuario** | | ❌ |

**El sistema entrega un plan y un texto listo. El usuario envía.** Esa única frontera mantiene todo el sistema comercial en el nivel de autonomía aprobado para la V1 —la IA propone, el usuario decide y ejecuta— **sin necesidad de modificar ningún documento aprobado**.

**No es una limitación provisional que haya que tolerar: es una decisión de diseño con dos ventajas propias.** Primera, el diseñador conserva el juicio profesional sobre a quién contacta y con qué palabras, que es donde está su responsabilidad reputacional. Segunda, el sistema recibe del usuario una señal de resultado **explícita y fiable** —respondió o no respondió— que ninguna detección automática le daría con la misma calidad en esta etapa.

---

# 4. Los cuatro niveles

## Nivel 1 — Diagnóstico · *quién es este comprador*

**Entra:** el Lead, su análisis, su Opportunity Score, su desglose por categorías y los factores que el análisis declaró no medibles.

**Sale:** una lectura comercial del negocio, con seis dimensiones y su confianza declarada.

| Dimensión | Qué establece | Ejemplo de lectura |
| --- | --- | --- |
| **Nivel de consciencia** | ¿Sabe que tiene el problema? | Sin web = no se lo ha planteado · Web abandonada = **lo intentó y falló** · Web correcta = lo resolvió a su manera |
| **Dolor** | Qué consecuencia de negocio se deriva de las categorías más bajas | La carencia técnica traducida a lo que le cuesta |
| **Identidad** | Cómo se ve a sí mismo el negocio | Muchas reseñas y buena calificación = «somos buenos, la gente nos encuentra igual» |
| **Urgencia** | ¿Hay algo que lo haga ahora? | **Casi siempre: ninguna evidencia de urgencia** |
| **Objeciones** | Qué dirá que no, antes de decirlo | «no tengo tiempo», «ya lo intenté», «¿quién eres?», «¿cuánto cuesta?» |
| **Confianza** | Cuánto de esto se sostiene | Se declara; no se disimula |

**Dos reglas que definen la calidad de este nivel:**

- **La identidad no se ataca.** Un negocio con reputación excelente y sin web no tiene un problema de calidad: tiene un techo de alcance. Decirle que su negocio está mal es perder la conversación en la primera línea. **La estrategia debe partir de reconocer lo que hizo bien.**
- **La urgencia no se fabrica.** Si no hay evidencia de urgencia, el diagnóstico dice que no la hay. Inventarla es el mecanismo más común de la venta en frío mala y el más rápido para destruir confianza.

## Nivel 2 — Estrategia · *qué persigue este contacto*

**Decide, para un solo contacto**, seis cosas:

| Decisión | Qué fija |
| --- | --- |
| **Objetivo** | El **micro-yes** que se busca. Uno solo |
| **Barrera** | La única resistencia que este contacto debe romper |
| **Qué revelar** | Los hechos observados que se ponen sobre la mesa |
| **Qué NO revelar** | Lo que se reserva deliberadamente, y **dónde se entrega si responde** |
| **Emoción** | Qué se activa: curiosidad, reconocimiento, comparación suave |
| **Canal y momento** | Dónde y cuándo tiene sentido |

**La escalera de micro-yes.** Cada contacto persigue **un solo peldaño**, y no se salta ninguno:

```
leer  →  reconocerse  →  responder  →  aceptar ver algo  →  aceptar hablar
```

**Las barreras, en su orden natural.** El comprador en frío las levanta siempre en esta secuencia:

```
¿quién eres?  →  ¿esto es para mí?  →  ¿esto es verdad?  →  ¿por qué ahora?  →  ¿qué me cuesta?
```

**Protocolo de Curiosidad Progresiva.** Cada contacto **cierra el bucle que abrió el anterior** y abre uno ligeramente mayor. La curiosidad no se acumula indefinidamente: se paga y se reinvierte.

> **Límite ético, y es una decisión de arquitectura, no de estilo.** Lo que se reserva debe ser **real y entregable**. Si el sistema insinúa que vio algo, tiene que haberlo visto, y debe entregarlo si el receptor responde — **haya venta o no**. Un bucle que no se cierra es un engaño, y un engaño a escala es un riesgo reputacional para el usuario, no para AKVEZ. **Emociones excluidas por diseño: miedo, vergüenza y presión.** No son eficaces en frío y son incompatibles con la identidad del producto.

## Nivel 3 — Copywriting · *cómo se dice*

**Es el único nivel donde interviene el modelo generativo, y llega con las decisiones ya tomadas.**

Recibe: el objetivo, la barrera, la emoción, el bucle que abre, el bucle que cierra, el canal con sus restricciones y —esencial— **la lista cerrada de hechos afirmables**.

Devuelve: el texto.

**No decide** qué objetivo perseguir, qué revelar, qué callar ni qué afirmar. **No puede introducir un hecho que no esté en la lista.**

**Antes de llegar al usuario, el texto se verifica contra la estrategia que lo originó:** ¿persigue el micro-yes fijado? ¿respeta el canal? ¿afirma algo fuera de la lista? ¿cierra el bucle anterior? **Ese punto de control es lo que convierte «el modelo ya no decide» en una propiedad verificable.** Un texto que no lo supera se rehace; no se publica con una advertencia.

## Nivel 4 — Secuencia · *el plan completo*

**Una secuencia no es una lista de mensajes: es una estrategia con memoria.**

Se diseña **completa desde el principio** —el diseñador ve el plan entero antes de enviar nada— pero **cada contacto se re-estrategiza justo antes de usarse**, a la luz de lo que realmente ocurrió. El plan es estable; el siguiente movimiento es adaptativo.

**La secuencia termina cuando hay conversación.** No cuando se agotan los contactos, y no cuando hay venta: **una respuesta es el éxito**, porque a partir de ahí el que vende es el diseñador, no AKVEZ.

---

# 5. El recorrido completo

**Ésta es la respuesta a la pregunta de este documento.**

### Paso 0 · Punto de partida

Un **Lead Evaluado**: registrado, analizado, puntuado, con su desglose por categorías. La materia prima ya existe — es lo que el sistema construyó en los bloques anteriores.

### Paso 1 · Diagnóstico comercial

El sistema lee el Score y su desglose y produce la lectura del comprador (Nivel 1), **declarando su confianza**. Separa lo observado de lo inferido y de lo desconocido.

### Paso 2 · Diseño de la secuencia

Se propone el plan completo: cuántos contactos, qué persigue cada uno, qué barrera rompe, por qué canal y con qué separación. **El diseñador ve la estrategia entera antes de enviar nada** y entiende por qué el contacto 1 no pide una reunión.

### Paso 3 · Preparación del primer contacto

Estrategia (Nivel 2) → redacción (Nivel 3) → verificación. Se entrega el texto **junto con su explicación**: qué persigue, qué evidencia usa, qué deja abierto.

### Paso 4 · Revisión y envío

El diseñador lee, ajusta si quiere, **y envía él mismo**. AKVEZ no toca el canal.

### Paso 5 · Reporte del resultado

El diseñador indica qué pasó. La señal mínima es de un toque: **respondió / no respondió**. Si respondió, puede aportar lo que le dijeron.

### Paso 6 · Decisión del siguiente movimiento

- **Respondió** → **la secuencia ha cumplido su objetivo.** El Lead pasa a *conversación abierta* y AKVEZ deja de empujar. Puede ayudar a responder, pero ya no hay secuencia.
- **No respondió** → el sistema re-estrategiza: la barrera sigue viva o ha cambiado, y el contacto 2 se prepara **sabiendo exactamente qué se dijo ya**, para no repetirlo y para cerrar el bucle abierto.
- **Respondió que no** → se registra la objeción real. Es la información más valiosa del sistema, y alimenta el aprendizaje.

### Paso 7 · Repetición

Hasta que haya conversación, se agote la secuencia, o el usuario decida parar. **Cualquiera de los tres finales es válido.** Un Lead que nunca respondió sigue en la Biblioteca, con su historial íntegro y disponible para una reactivación posterior con otro ángulo.

### Paso 8 · Constancia

Cada contacto emitido, con su diagnóstico, su estrategia, su evidencia, su texto y su resultado, **queda conservado y versionado**. Nada se sustituye.

---

# 6. La Secuencia y sus seis momentos

| # | Momento | Objetivo | Barrera que rompe | Qué **no** hace |
| --- | --- | --- | --- | --- |
| **1** | **Contacto 1 — Reconocimiento** | Que lea y se reconozca | *¿quién eres?* / *¿esto es para mí?* | No propone nada. No pide nada |
| **2** | **Contacto 2 — Evidencia** | Que responda una palabra | *¿esto es verdad?* | No insiste. **Cierra el bucle abierto en el 1** |
| **3** | **Contacto 3 — Demostración** | Que acepte ver algo | *¿esto me sirve a mí?* | No pide reunión. No habla de precio |
| **4** | **Oferta** | Que acepte hablar | *¿qué me cuesta?* | No presiona. No pone plazos falsos |
| **5** | **Seguimiento** | Recuperar la atención perdida | *inercia* | **No repite el mensaje anterior.** Aporta algo nuevo |
| **6** | **Reactivación** | Reabrir mucho después, con otro ángulo | *el momento no era ése* | No reinicia la misma secuencia |

**Cuatro reglas de la secuencia:**

1. **La secuencia se detiene sola en cuanto hay respuesta.** Cualquier momento puede ser el último, y ése es el resultado buscado.
2. **El silencio es información, no fracaso.** Indica qué barrera no se rompió, y eso decide el movimiento siguiente.
3. **Ningún momento repite al anterior.** Si un contacto no aporta algo que el anterior no tenía, no se envía. Insistir sin aportar es lo que convierte el contacto en frío en spam.
4. **Agotar la secuencia no expulsa al Lead.** Permanece en la Biblioteca con su historial completo, exactamente igual que un Lead sin analizar.

---

# 7. Memoria: qué recuerda el sistema

**Sin memoria no hay secuencia, y sin persistencia no hay memoria.** El sistema conserva cuatro cosas:

| Qué | Por qué | Regla |
| --- | --- | --- |
| **El diagnóstico comercial** | Para poder explicar después por qué se eligió ese enfoque | Versionado, con la versión del criterio que lo produjo |
| **La secuencia y su estado** | Es lo que hace representable «el contacto 2» | Se conserva el plan **y** su evolución |
| **Cada Propuesta emitida** | Regenerar no puede destruir una versión que el usuario prefería | **Versionada. Nunca se sustituye** |
| **Cada resultado reportado** | Es la única señal real de qué funciona | Solo crece |

**Criterio de reconstrucción.** Dado un contacto conservado, debe poder reconstruirse **por qué dijo lo que dijo**: qué evidencia lo sostenía, qué objetivo perseguía y bajo qué versión del criterio comercial se decidió. Es el mismo estándar de reproducibilidad que ya se exige al Opportunity Score, aplicado a la venta.

**El criterio comercial es un artefacto versionado, no un texto.** Igual que el Opportunity Score tiene un Perfil de Ponderación publicado y gobernado, la estrategia comercial tendrá un **Perfil de Estrategia** con versión. Sin él, ningún cambio podría demostrarse como mejora: exactamente el error que el producto ya evitó una vez en la evaluación.

---

# 8. El papel del usuario

**El diseñador no es un espectador del sistema: es quien ejecuta.**

| Decide | Hace | No tiene que hacer |
| --- | --- | --- |
| A quién contactar | **Enviar los mensajes** | Escribir de cero |
| Si el enfoque le representa | Reportar qué pasó | Decidir la estrategia |
| Qué palabras usar finalmente | Conversar cuando respondan | Recordar qué dijo a quién |
| Cuándo parar | | Inventar el siguiente paso |

**El reporte de resultado es el punto más frágil de todo el sistema.** Si el usuario no lo hace, la secuencia se queda ciega y el aprendizaje se detiene. Por eso debe costar **un toque**, presentarse en el momento natural —al volver al Lead— y no bloquear nada si se omite. Un sistema que exige disciplina administrativa al usuario deja de usarse en dos semanas.

---

# 9. El bucle de aprendizaje

**Sin automatizar nada.** El sistema acumula, para cada contacto: qué barrera atacó, qué objetivo persiguió, qué evidencia usó, qué canal, qué versión del criterio comercial, y **qué respondió el mundo**.

Con eso puede responderse, con el tiempo, lo único que importa: **qué tipo de primer contacto consigue conversación, y en qué tipo de negocio.**

**Dos cautelas honestas:**

- **El volumen tarda.** Ninguna conclusión será estadísticamente sólida al principio. El sistema debe poder decir «todavía no lo sé» — igual que hoy declara confianza media en el Score.
- **La mejora del criterio comercial es una decisión gobernada, no un ajuste silencioso.** Cambiar el criterio cambia todos los mensajes futuros; debe versionarse y quedar constancia, no aplicarse sin más.

---

# 10. Qué **no** hace el sistema

**Enumeración deliberada.** Cada línea protege una decisión ya aprobada.

- **No envía nada.** No integra correo, LinkedIn ni Instagram.
- **No detecta respuestas** ni lee bandejas de entrada.
- **No dispara seguimientos por tiempo.** Ningún contacto sale sin que el usuario lo mande.
- **No actualiza estados por su cuenta.**
- **No es un CRM**, ni agenda, ni pipeline.
- **No responde por el usuario** en una conversación abierta.
- **No inventa hechos.** No afirma nada fuera de la evidencia.
- **No infiere datos personales** de quien está al otro lado.
- **No puntúa personas.** El Opportunity Score evalúa la oportunidad de negocio; no evalúa a nadie.
- **No expulsa Leads.** Ninguna secuencia agotada retira nada de la Biblioteca.
- **No destruye versiones.** Regenerar añade; nunca sustituye.
- **No fabrica urgencia** ni plazos que no existen.

---

# 11. Coherencia con el Blueprint

## 11.1 Lo que esta arquitectura respeta

| Decisión vigente | Cómo se respeta |
| --- | --- |
| **Nivel 2 de autonomía en la V1** | El sistema diseña y recomienda; **el usuario ejecuta el envío** (§3) |
| **La decisión de contactar es del usuario** | Es literalmente el paso 4 del recorrido |
| **Ninguna etapa expulsa a un Lead** | Agotar una secuencia no retira nada (§6, regla 4) |
| **No existe umbral de exclusión ni Top N** | Ningún Score condiciona que un Lead pueda recibir una secuencia |
| **Un Lead sin propuesta es estado válido** | No contactar nunca es un final legítimo |
| **La Propuesta es activo versionado** | §7 — y **corrige un incumplimiento vivo hoy** |
| **Explicabilidad** | Todo contacto llega con su explicación y su confianza declarada |
| **Detenerse es válido** | Los tres finales del paso 7 son válidos |

## 11.2 Lo que exigirá revisión documental — **más adelante, no ahora**

| Documento | Por qué |
| --- | --- |
| **APS-03 §7.3** | Define el agente como «generar una propuesta comercial inicial». Cambia el concepto |
| **APS-04 P-10 y N-3** | El Pitch Workspace deja de ser una pantalla que produce un mensaje |
| **APS-02 §6-§7 y glosario** | La definición de «Pitch Generator» y la frontera con «seguimiento» |
| **APS-10** | **No contiene nada sobre contacto en frío ni base legal.** Es un vacío real |
| **ADR-13 §10 y §13** | Incorporar la Secuencia al catálogo de activos versionados |
| **PO-01 §8** | El ciclo termina en *Lead Contactado*; aquí aparece *conversación abierta* |

**Ninguna se toca en este documento.** Se enumeran para que la derivación posterior a APS y ADR sepa exactamente qué alcanza.

---

# 12. Decisiones de producto detectadas

Aparecieron durante el diseño, como estaba previsto. **Son candidatas a PO-02; ninguna se decide aquí.**

| # | Decisión | Por qué es de producto y no de arquitectura |
| --- | --- | :-- |
| **D-1** | **¿Cuál es el éxito del sistema comercial: una conversación o una venta?** Este documento asume **conversación** | Redefine el estado terminal del ciclo de vida del Lead, que es autoridad de dominio |
| **D-2** | **¿Puede el sistema recomendar dejar de contactar a un Lead?** | Recomendar parar **no es** expulsar, pero la frontera con un umbral de exclusión —prohibido— es fina y necesita pronunciamiento expreso |
| **D-3** | **¿Qué estados atraviesa un Lead durante una secuencia?** «Contactado y sin respuesta» hoy no existe | Es exactamente el vocabulario en disputa en la desviación **A-01**, abierta ante el Product Office |
| **D-4** | **¿Reportar el resultado es obligatorio u opcional?** | Obligatorio produce fricción; opcional produce aprendizaje con huecos. Es una decisión de producto, no técnica (§8) |
| **D-5** | **¿Cuánto puede reservarse el sistema antes de que dejar de ser curiosidad y sea un truco?** | Este documento propone una regla —**lo reservado debe ser real y entregable aunque no haya venta**— que debería ratificarse expresamente |

**D-3 es la más urgente:** el Nivel 4 no puede especificarse en un APS mientras el vocabulario de estados esté en disputa.

---

# 13. Riesgos y preguntas abiertas

| # | Riesgo | Nota |
| --- | --- | --- |
| **RC-1** | **La base de evidencia es más delgada de lo que parece.** Solo la mitad de los factores del modelo de evaluación son medibles hoy | El diagnóstico comercial hereda esa cobertura. **Debe declararla, no compensarla** |
| **RC-2** | **El reporte de resultado depende de la disciplina del usuario** | Sin él, la secuencia queda ciega. Es el mayor riesgo de adopción del sistema (§8) |
| **RC-3** | **La secuencia puede degenerar en insistencia** si la regla «ningún contacto repite al anterior» no se verifica de verdad | Es la diferencia entre contacto en frío y spam |
| **RC-4** | **Vacío legal sobre el contacto en frío** | Ningún documento aprobado lo cubre. **No lo introduce este diseño: ya existe** |
| **RC-5** | **El criterio comercial no tiene todavía evidencia que lo respalde** | Nacerá derivado de principios, no de datos observados — igual que el Perfil de Ponderación del Score, y con la misma provisionalidad declarada |
| **RC-6** | **Deuda técnica previa del módulo** | El agente actual está fuera del patrón de construcción del resto del backend y no admite dependencias nuevas. **Es prerrequisito de implementación**, no de diseño |

---

**Fin del borrador.** Pendiente de revisión del Product Owner antes de derivar APS y ADR.
