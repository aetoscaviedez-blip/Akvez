# H-08 Iteración 7 — Demo Experience Review

| Campo | Valor |
| --- | --- |
| Documento | **H-08 Iteración 7 — Demo Experience Review** |
| Registro | **Experiencia de demo.** Se juzga por si vende, no por si se ve mejor |
| Estado | 🟡 **Análisis + plan · cero código** |
| Fecha | 2026-08-06 |
| Regla | Solo lo que AKVEZ ya hace. Ninguna funcionalidad, métrica, beneficio ni dato inventado |

---

# 0. Nota de proceso, dicha una vez

**Es la sexta revisión de H-08 y llevamos una implementación.** El diagnóstico ya está: sabemos qué falla, por qué y en qué orden.

**Los cuatro primeros puntos del plan de este documento son microcopy y flujo** — horas, no días — y son los que más mueven las cuatro preguntas. Lo caro a estas alturas no es equivocarse: es llegar a la hackathon con el análisis perfecto y la demo sin tocar.

Dicho. Vamos al análisis.

---

# 1. Las cuatro preguntas, cronometradas hoy

| Pregunta | ¿Se responde? | Cuándo |
| --- | :-: | --- |
| **¿Qué hace AKVEZ?** | 🟠 Parcial | A los **10 s**, y solo si el ojo baja hasta el subtítulo de un botón |
| **¿Por qué debería importarme?** | 🔴 **No** | **Nunca en las dos primeras pantallas.** Solo si se abre una tarjeta y se llega al ángulo comercial |
| **¿Por qué es diferente?** | 🟠 Parcial | A los **60-90 s**, en el AI Showcase |
| **¿Por qué debería creerle?** | ✅ **Sí** | Rápido y bien. **Es la única de las cuatro que AKVEZ responde con soltura** |

> **AKVEZ responde antes «por qué creerle» que «por qué importarme».** Está contestando la objeción de un escéptico antes de haber despertado el interés de un interesado.

---

# 2. Evaluación del recorrido, como película

## 2.1 · Momentos muertos

| Dónde | Qué pasa |
| --- | --- |
| **Los primeros 8 segundos** | El Dashboard abre con contadores de una sesión vacía. **El plano de apertura de la película no tiene sujeto** |
| **El embudo** | Cuatro tarjetas grandes con las mismas cifras de 400 px más arriba |
| **«Estado del sistema»** | Telemetría. En una película sería el rótulo de los permisos de rodaje |
| **La antesala del Pitch** | Selector, firma y aviso ámbar retrasan la entrada al relato |
| **El final del AI Showcase** | Termina en un bloque de estado. **La escena no cierra: se apaga** |

## 2.2 · Repeticiones

**Dos, y una es seria.**

**Menor:** el embudo repite las métricas del panel.

**Seria: la Opportunity View y el AI Showcase explican lo mismo.** Las dos despliegan las categorías del Score. Una lo llama «¿Por qué obtuvo ese Score?» y la otra «¿Cómo calculó el Score?».

> En el producto está justificado —una responde *qué concluyó* y la otra *cómo lo hizo*—. **En una demo de dos minutos es contar la misma idea dos veces**, y es el tramo donde más atención se pierde.

## 2.3 · Cambios bruscos

**Uno solo, y ya no es de estilo: es de temperatura.** Del Lead Hunter —donde acaban de aterrizar resultados y hay energía— a la Opportunity View, que abre en modo informe. **La demo sube y baja de pulso justo después de su mejor momento.**

## 2.4 · Pantallas fuera de sitio

| | |
| --- | --- |
| **Demasiado pronto** | **Dashboard.** Resume trabajo acumulado en el minuto cero, cuando no hay ninguno |
| **Demasiado tarde** | **Pitch Generator.** Es el desenlace y es la cuarta pestaña. El jurado puede no llegar |
| **Demasiado larga** | **AI Showcase.** Seis pasos del mismo tamaño. La idea que aporta cabe en veinte segundos |

---

# 3. La regla de impacto, aplicada

**Protagonista único · un mensaje · una acción.**

| Pantalla | Protagonista | Mensaje | Acción | |
| --- | --- | :-: | --- | :-: |
| **Dashboard** | **Ninguno.** Cuatro cifras iguales | **Tres**: actividad, embudo, estado | CTA presente ✓ | 🔴 **Falla dos de tres** |
| **Lead Hunter** | El Score de la primera tarjeta — **pero le gana en superficie el aviso violeta** | Uno ✓ | Buscar ✓ | 🟠 |
| **Opportunity View** | **El 85** ✓ Inequívoco | **Dos**: por qué puntúa **y** qué falta medir | Generar mensaje ✓ | 🟠 |
| **AI Showcase** | **Ninguno.** El raíl es estructura, no protagonista | Uno ✓ | **Ninguna.** Termina en un bloque de estado | 🟠 |
| **Pitch Generator** | Ninguno hasta que existe el mensaje | Uno ✓ | Generar ✓ | 🟠 |

> ### El patrón: **solo una pantalla del producto tiene protagonista**, y **dos terminan sin invitar a nada**.

---

# 4. Evaluación emocional

| Pantalla | Emoción hoy | |
| --- | --- | :-: |
| **Dashboard** | **Indiferencia** | 🔴 Prohibida |
| **Lead Hunter** *(buscando)* | **Expectativa** | ✅ |
| **Lead Hunter** *(resultados)* | **Descubrimiento** | ✅ |
| **Opportunity View** | **Curiosidad** | ✅ |
| **AI Showcase** | **Confianza** | ✅ |
| **Pitch Generator** *(con mensaje)* | **Satisfacción** | ✅ |

## El hallazgo más limpio de esta revisión

> ## **Quita la primera pantalla y el arco emocional ya es perfecto.**
>
> expectativa → descubrimiento → curiosidad → confianza → **satisfacción**
>
> Ese es exactamente el arco de una demo que gana. **AKVEZ ya lo tiene construido, de la pantalla 2 en adelante.**

**El único compás roto es el de apertura.** No hay que rediseñar el recorrido emocional: hay que dejar de empezar por fuera de él.

---

# 5. Evaluación narrativa y de ritmo

| Tramo | Ritmo |
| --- | --- |
| **Apertura** | 🔴 **Plano.** Nada acelera |
| **La búsqueda** | ✅ **Tensión creciente.** El escáner narra y el jurado espera. **Es el mejor uso del tiempo de toda la demo** |
| **Aterrizan los resultados** | ✅ **La única aceleración del producto** |
| **Opportunity View** | 🟠 Desacelera. Correcto para asimilar, **pero justo después del pico** |
| **AI Showcase** | 🔴 **Se estanca.** Seis compases idénticos |
| **Pitch, antes del paso 01** | 🟠 Se frena con trámite |
| **El mensaje** | ✅ **Debería ser el clímax — y hoy es un bloque más** |

**Dónde debería sorprender y no lo hace:** al aparecer el mensaje. Es el único punto del recorrido donde el producto entrega algo que el usuario no tenía.

---

# 6. El momento WOW

**Confirmado y sin cambios:** *el mensaje generado citando el problema concreto de ese negocio.*

**Lo que esta revisión añade es qué le está robando fuerza:**

1. **Llega en la cuarta pestaña.** Un clímax al que hay que navegar deliberadamente no es un clímax: es una sección.
2. **Se presenta como un bloque igual a los demás.** El desenlace del recorrido tiene el mismo tratamiento que los pasos de preparación.
3. **Tiene competencia.** El desglose del Score aparece dos veces antes y también reclama ser un momento. **La regla dice un solo WOW; hoy hay tres candidatos compitiendo.**

> **Todo lo anterior debe preparar el mensaje. Todo lo posterior debe reforzarlo.** Hoy lo anterior compite con él y lo posterior no existe.

---

# 7. Microcopy — de informativo a persuasivo

**El cambio de mayor rendimiento por hora invertida.** Todas estas reescrituras **siguen siendo literalmente ciertas**.

| Dónde | Hoy | Propuesta | Por qué sigue siendo verdad |
| --- | --- | --- | --- |
| **Titular del Dashboard** | «Esto es lo que AKVEZ ha encontrado para ti» | **«Negocios reales con trabajo web pendiente»** | Todo lead tiene o **ausencia de web** o una deficiencia clasificada. Habla del usuario, no del producto |
| **Titular del Hunter** | «Encuentra negocios reales con deficiencias de conversión» | **«Encuentra negocios que necesitan una web mejor»** | Mismo hecho, sin jerga. «Deficiencias de conversión» no significa nada fuera del oficio |
| **Sección de la tarjeta** | «Problemas web detectados» | **«Lo que puedes arreglar»** | Son exactamente los trabajos que el freelance facturaría. **Reencuadra un déficit ajeno como un encargo propio** |
| **Sección de la tarjeta** | «Ángulo de oportunidad» | **«Lo que le venderías»** | El ángulo *es* la propuesta comercial derivada para este usuario |
| **Panel de la tarjeta** | «Impacto financiero estimado» | **«Cuánto les cuesta hoy · estimado por el análisis»** | Conserva íntegra la reserva —«estimado»— y gana urgencia |
| **Encabezado de resultados** | «Leads detectados en Colombia (2 de 2)» | **«Negocios encontrados (2 de 2)»** | «Lead» es jerga; un jurado no técnico no la comparte |
| **Métrica del panel** | «Con Opportunity Score · Con Evaluación emitida» | **«Puntuados · Con desglose por categorías»** | «Evaluación emitida» es vocabulario interno |
| **Límites del análisis** | «Qué falta medir» | **«Lo que AKVEZ no pudo medir»** | **Cambia una carencia del informe por una declaración del sistema.** Suena a integridad, no a hueco |
| **Métrica del panel** | «Búsquedas · 0 · Ejecutadas en esta sesión» | **Retirar** | El número más grande del producto es un cero que no informa de nada |

## Lo que NO hay que tocar

**«Dato de ejemplo — no es un resultado real», «No consta para este negocio», «Sin comprobar».** Esos textos son el activo diferencial del producto. **Persuadir no es suavizar.**

---

# 8. Qué eliminar, mover, simplificar y potenciar

## Eliminar del recorrido *(no del producto)*

Biblioteca · embudo · estado del sistema · panel de firma · exploración de los tres canales.

## Mover

| Qué | De dónde | A dónde |
| --- | --- | --- |
| **Dashboard** | Apertura | **Cierre** — donde significa «esto se acumula» |
| **El ángulo comercial** | Fondo de la tarjeta | **Primer plano** — es el apetito |
| **La frase que explica el producto** | Subtítulo de un botón | **Lo primero que se lee** |
| **El desglose del Score** | Aparece en dos pantallas | **En una sola durante la demo** |

## Simplificar

**El AI Showcase a tres pasos visibles.** La idea que aporta —*el número es auditable y el sistema declara lo que no sabe*— no necesita seis.

**El Dashboard a un resumen corto.** Sin embudo, sin telemetría.

## Potenciar

**El mensaje generado.** Es el clímax y debe parecerlo: más superficie, otro material, sensación de documento y no de bloque de interfaz.

**El instante de la búsqueda.** Es la mejor tensión del producto y hoy se percibe como espera. Es un momento narrativo, no un cargador.

**El estado del sitio web.** «Sin sitio web» es el hecho comercialmente decisivo y hoy es un distintivo entre cinco.

---

# 9. Qué haría que un jurado recuerde AKVEZ al final del evento

Al final de una hackathon, un jurado ha visto veinte demos. **No sobreviven las funcionalidades. Sobreviven una frase y una imagen.**

## La frase

> ### *«Es el que te dice a quién escribirle y ya te escribe el correo.»*

Corta, repetible entre jurados, y describe el producto entero sin adjetivos.

## La imagen

> ### **El correo redactado, junto al problema que cita.**

Es la única imagen del producto que contiene la promesa y la prueba a la vez.

## Y una tercera cosa que nadie más va a tener

En una sala donde **todas** las demos prometen de más, AKVEZ puede permitirse decir lo contrario:

> ### *«Fue el único que me dijo lo que no sabía.»*

**«Lo que AKVEZ no pudo medir» es un activo competitivo, no una nota legal.** Un jurado técnico que lleva veinte demos escuchando certezas recuerda al que le enseñó sus límites — porque es el único al que puede creer.

**Esas tres cosas son la estrategia de memorabilidad.** No hay que construir ninguna: hay que colocarlas.

---

# 10. Plan priorizado

**Ordenado por impacto sobre las cuatro preguntas y la prueba de 30 segundos.**

| # | Acción | Responde a | Esfuerzo | Impacto |
| :-: | --- | :-: | :-: | :-: |
| **1** | **Reordenar el recorrido: abrir en Lead Hunter, cerrar en Dashboard** | ¿Qué hace? · ¿Por qué importarme? | 🟢 Bajo | 🔴 **Máximo** |
| **2** | **Microcopy de valor** *(las nueve cadenas de §7)* | ¿Qué hace? · ¿Por qué importarme? | 🟢 **Muy bajo** | 🔴 **Máximo** |
| **3** | **Promover el ángulo comercial en la tarjeta** | ¿Por qué importarme? | 🟢 Bajo | 🟠 Alto |
| **4** | **Retirar del recorrido embudo, telemetría y Biblioteca** | Ritmo | 🟢 Bajo | 🟠 Alto |
| **5** | **Dar protagonista al Dashboard** *(una cifra manda, tres subordinadas)* | ¿Qué hace? | 🟡 Medio | 🟠 Alto |
| **6** | **Racionar el color: que el aviso violeta deje de ganarle al Score** | Jerarquía | 🟢 Bajo | 🟠 Alto |
| **7** | **Potenciar el mensaje generado como clímax** | WOW | 🟡 Medio | 🔴 **Máximo sobre el recuerdo** |
| **8** | **Cerrar las pantallas que terminan muertas** *(Showcase, Dashboard)* | Acción | 🟢 Bajo | 🟡 Medio |
| **9** | **Reducir el AI Showcase a tres compases** | Ritmo | 🟡 Medio | 🟡 Medio |
| **10** | **Composición: segundo eje y densidad** | Percepción premium | 🔴 **Alto** | 🟠 Alto |

## La lectura del plan

**Del 1 al 4 son horas de trabajo y mueven las dos preguntas que hoy fallan.** Si solo se hiciera eso, la demo cambiaría más que con todo H-07 junto.

**El 7 es el que decide el recuerdo.**

**El 10 es el único caro** — y es el que menos afecta a que el jurado *entienda*. Afecta a que le parezca *cara*. Es una decisión de prioridad legítima, pero conviene tomarla sabiendo que es la última en orden de rentabilidad antes de un evento.

---

**Análisis y dirección entregados. Cero código. A la espera de que apruebes el plan — o al menos los cuatro primeros.**
