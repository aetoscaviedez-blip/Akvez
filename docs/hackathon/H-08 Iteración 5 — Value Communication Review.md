# H-08 Iteración 5 — Value Communication Review

| Campo | Valor |
| --- | --- |
| Documento | **H-08 Iteración 5 — Value Communication Review** |
| Registro | **Comunicación de valor.** No es una revisión visual |
| Estado | 🟡 **Análisis · cero código · pendiente de decisión** |
| Fecha | 2026-08-06 |
| Método | Lectura literal de lo que hay en pantalla en los primeros segundos. Sin interpretar |

---

# 0. La respuesta a la pregunta principal

> **¿Podría un diseñador freelance que nunca ha visto AKVEZ responder «qué hace» después de mirarlo cinco segundos?**

## No.

Podría responder **qué es** —un panel con un agente— y **qué ha hecho** —encontrar dos negocios—. Pero no **para qué le sirve a él**.

Y hay una razón concreta y corregible: **la pantalla de entrada habla de la actividad de la herramienta, no del problema del usuario.**

---

# 1. Qué entiende en los primeros 3 segundos

**Literalmente, lo único legible a esa velocidad:**

```
AKVEZ  PRO
● Agente activo · 2 negocios en tu espacio de trabajo
Panel   Oportunidades   Biblioteca   Generar mensaje
Esto es lo que AKVEZ ha encontrado para ti
0        2        2        2
```

**La conclusión literal disponible es esta:**

> *«Es un panel de algo que se llama AKVEZ. Tiene un "agente". Ha encontrado 2 negocios. Casi todo está a cero.»*

**Lo que NO puede saber a los 3 segundos:**

- Qué clase de negocios busca.
- Para quién.
- Por qué querría él una lista de negocios.
- Qué haría con ellos.

Y hay un detalle que hace daño de verdad: **los cuatro elementos más grandes de la pantalla de entrada son un 0 y tres 2.** El producto abre comunicando, con sus tipos más grandes, **que aquí no ha pasado casi nada**.

---

# 2. Qué entiende a los 10 segundos

Ya puede leer las apostillas y el subtítulo de la acción:

> **«Elige nicho y ciudad; el agente rastrea Google Places y puntúa cada negocio.»**

**Esa frase es la mejor explicación del producto que existe en toda la aplicación.** Es concreta, es verdadera y se entiende sin contexto.

**Y está de subtítulo de un botón**, por debajo de cuatro contadores y de un aviso.

A los 10 segundos, entonces, entiende: *«busca negocios en Google Places por nicho y ciudad y les pone una puntuación»*.

**Sigue sin entender el porqué.** El porqué —qué gana él— solo aparece si abre una tarjeta y llega hasta el «Ángulo de oportunidad», que está al final. Eso son dos clics y cerca de un minuto.

---

# 3. Cuál es el beneficio percibido

**Ninguno.**

La interfaz comunica una **capacidad** —encontrar y puntuar negocios— pero no un beneficio. Un beneficio responde a «¿qué gano yo?», y esa pregunta no se contesta en ningún punto de las dos primeras pantallas.

El beneficio real existe dentro del producto y es bueno:

> **«Aquí tienes negocios que necesitan lo que tú vendes, con el argumento de venta ya escrito.»**

Está en los datos. **No está en la comunicación.**

---

# 4. Cuál es la propuesta de valor dominante

**No hay una. Hay tres, y compiten.**

| # | Propuesta | Dónde vive | Superficie que ocupa |
| :-: | --- | --- | :-: |
| **1** | *El agente busca clientes por ti* | Cabecera, titular del Panel, CTA | Poca |
| **2** | *El Opportunity Score es determinista y reproducible* | Opportunity View **completa** + AI Showcase **completo** | **Enorme** |
| **3** | *Te escribe el mensaje de contacto* | Cuarta pestaña | Poca |

> ### Y aquí está el desajuste central de la comunicación:
>
> **AKVEZ dedica su mayor superficie a su prueba y su menor superficie a su promesa.**
>
> Dos pantallas enteras —de cinco— existen para demostrar que la puntuación es reproducible. Eso es **la evidencia**, y es excelente que exista. Pero **nadie compra una evidencia**: se compra la promesa, y la evidencia sirve para sostenerla cuando alguien duda.

Hoy AKVEZ presenta el peritaje antes que la oferta.

---

# 5. Qué emoción produce

## Indiferencia.

No desconfianza —el producto se gana la confianza rápido—. No saturación —está limpio—. **Indiferencia**, que es la emoción que produce algo correcto que no te habla de ti.

Todo lo que dice la primera pantalla es sobre sí mismo: lo que ha hecho, cuánto ha analizado, en qué estado están sus servicios. **En ningún momento aparece el usuario ni su situación.**

---

# 6. Qué información sobra — por comunicación

**No sobra por diseño. Sobra porque retrasa la comprensión.**

| Qué | Por qué estorba |
| --- | --- |
| **«Búsquedas · 0 · Ejecutadas en esta sesión»** | **El número más prominente del producto es un cero que mide la sesión, no el valor.** No informa de nada y comunica vacío |
| **«Analizados» y «Con Opportunity Score» como métricas separadas** | Son distinciones internas del canal de procesamiento. Para un recién llegado **son el mismo 2 escrito tres veces** |
| **«Estado del sistema»** *(servidor, Places, Gemini, motor de respaldo)* | Es telemetría operativa. Interesa a un jurado técnico **después**; a los cinco segundos es ruido |
| **El embudo de oportunidad** | Repite las mismas cifras de arriba |
| **Vocabulario interno**: «Evaluación emitida», «Perfil de Ponderación WP-01», «Cobertura de factores», «contribución» | Es preciso y es correcto, pero **exige un glosario que el usuario no tiene** |

## Y un caso que hay que mirar de frente

**El aviso «2 de estos 2 negocios son datos de ejemplo».**

Es obligatorio, lo he defendido seis sprints y **no propongo tocarlo**. Pero en términos de comunicación hay que decir lo que hace: es el segundo elemento más prominente de la pantalla de entrada **y lo que dice es «nada de esto es real»**.

> **La solución no es quitar el aviso. Es no hacer la demo con datos de ejemplo.**
>
> Si la demo arranca con una búsqueda real ejecutada, el aviso desaparece solo — porque deja de ser cierto.

---

# 7. Qué información importante llega demasiado tarde

| Qué | Cuándo llega hoy | Por qué importa |
| --- | --- | --- |
| **El ángulo de oportunidad** | Al final de la tarjeta, tras dos clics | **Es lo único que responde «¿y esto para qué me sirve?».** Es el trabajo que el usuario puede cobrar |
| **«Sin sitio web»** | Como distintivo pequeño entre otros cuatro | **Es el hecho comercialmente decisivo del producto entero.** Un negocio sin web es literalmente el cliente |
| **La frase que explica el producto** | Subtítulo de un botón | Es la mejor frase que tiene AKVEZ |
| **Que existe un mensaje de contacto redactado** | Cuarta pestaña | Es el cierre del ciclo y lo que convierte una lista en una herramienta de venta |

---

# 8. Qué debería aparecer antes — sin inventar nada

**Todo lo que sigue ya existe en el producto. Solo cambia de sitio o de rango.**

1. **La frase explicativa** que hoy es subtítulo de un botón → primera cosa que se lee.
2. **El ángulo de oportunidad** → arriba en la tarjeta, no al final.
3. **El estado del sitio web** → como titular del hallazgo, no como uno más de cinco distintivos.
4. **Un resultado real** —una tarjeta— en lugar de contadores → lo primero que se ve al abrir.
5. **El mensaje de contacto** como parte visible del recorrido desde el principio, no como una pestaña al final.

---

# 9. Qué parece herramienta y qué parece resultado

| Parece **herramienta** | Parece **resultado** |
| --- | --- |
| El lateral del Lead Hunter: desplegables, estilo de diseño, casilla de nicho personalizado | **La `LeadCard`** |
| El selector de canal y el campo de instrucciones | El hero de la Opportunity View |
| El panel de firma del diseñador | El AI Showcase |
| «Estado del sistema» | **El mensaje generado** |
| El embudo | |
| El botón «Actualizar» de la Biblioteca | |

## El desequilibrio que más pesa

**En la referencia, el lateral izquierdo muestra lo que se ha encontrado:** «Fotógrafos 218», «Bogotá 94». Es un **inventario**. Comunica abundancia y trabajo hecho.

**En AKVEZ, el lateral izquierdo muestra lo que hay que configurar.** Mismo sitio de la pantalla, mensaje opuesto: **la referencia enseña resultados donde AKVEZ pide preparativos.**

Es el punto donde más se nota que AKVEZ vende herramienta y la referencia vende resultado.

---

# 10. Qué pantalla comunica mejor y peor la promesa

## Mejor: **la `LeadCard`** *(dentro del Lead Hunter)*

No es una pantalla, pero es la unidad que mejor comunica el producto, y por una razón sólida: **es el único lugar donde el argumento completo está junto.**

Quién es el negocio · qué le pasa · cuánto puntúa · qué le venderías · un botón para escribirle.

**Es AKVEZ entero dentro de un objeto.** Si solo se pudiera enseñar una cosa en la demo, sería esta.

## Peor: **el Executive Dashboard**

Y agrava el problema que sea **la pantalla de entrada**.

Comunica **la actividad de la herramienta en una sesión vacía**: cuántas búsquedas, cuántos analizados, en qué estado están los servicios. Responde a *«¿qué ha hecho esta herramienta?»* — una pregunta que el usuario todavía no se ha hecho — **antes de responder «¿para qué sirve?»**.

Un panel de control es la pantalla correcta para el usuario número cien. **Es la peor pantalla posible para el usuario número uno**, y un jurado siempre es el usuario número uno.

---

# 11. Oportunidades

**Ninguna exige un dato nuevo.**

- **El producto ya tiene su mejor frase escrita.** Solo está en el sitio equivocado.
- **El producto ya tiene apetito**: el ángulo comercial. Solo está al final.
- **El producto ya tiene un objeto que lo explica entero**: la tarjeta. Solo no es lo primero que se ve.
- **El producto ya tiene su hecho decisivo**: «sin sitio web». Solo está tratado como un dato más.
- **El producto ya tiene su prueba**: el Score reproducible. Solo está ocupando el sitio de la promesa.

> **AKVEZ no tiene un problema de contenido. Tiene un problema de orden.**

---

# Las 10 decisiones que harían que AKVEZ se entendiera en menos de 5 segundos

| # | Decisión | Por qué |
| :-: | --- | --- |
| **1** | **Que la entrada muestre un resultado, no contadores.** Que lo primero que se vea sea un negocio encontrado con su puntuación y su ángulo — no cuántas búsquedas lleva la sesión | Hoy los cuatro elementos más grandes del producto son un 0 y tres 2. **Se abre comunicando vacío.** Es la decisión de mayor impacto de toda la lista |
| **2** | **Elegir UNA propuesta de valor y subordinar las otras dos.** La promesa es *a quién venderle y con qué argumento*. **El Score es la prueba, no la promesa** | Tres propuestas compitiendo es cero propuestas. Y hoy la prueba ocupa dos de las cinco pantallas |
| **3** | **Subir la frase que ya explica el producto.** «Elige nicho y ciudad; el agente rastrea Google Places y puntúa cada negocio» debe ser lo primero que se lee, no el subtítulo de un botón | **Es la mejor frase del producto** y está enterrada. Coste cero |
| **4** | **Promover el ángulo de oportunidad al primer plano de la tarjeta** | Es lo único que responde «¿qué gano yo?». Convierte una ficha en una oferta |
| **5** | **Retirar el cero y fusionar las métricas redundantes** | «Encontrados / Analizados / Con Score» son el mismo número tres veces, y «Búsquedas: 0» solo comunica que no ha pasado nada |
| **6** | **Traducir el vocabulario interno.** «Evaluación emitida», «Perfil de Ponderación», «Cobertura de factores» | Son precisos y son correctos, pero **exigen un glosario**. Cada término sin traducir retrasa la comprensión unos segundos |
| **7** | **Hacer de «Sin sitio web» el titular del hallazgo** | Es el hecho comercialmente decisivo del producto y hoy es un distintivo entre cinco |
| **8** | **Que el lateral del Hunter muestre lo encontrado, no solo lo que hay que configurar** | Mismo sitio que la referencia, mensaje opuesto: **inventario en vez de preparativos** |
| **9** | **Bajar «Estado del sistema» y el embudo del primer plano** | Telemetría y repetición. Ambas retrasan la comprensión sin añadir nada al recién llegado |
| **10** | **Hacer la demo con una búsqueda real, no con datos de ejemplo** | **No es una decisión de interfaz: es de guion.** El aviso «nada de esto es real» es el segundo elemento más prominente de la pantalla de entrada, y desaparece solo en cuanto deja de ser cierto |

---

**Revisión entregada. Cero código. A la espera de que decidas cómo debe comunicar AKVEZ antes de seguir refinando la interfaz.**
