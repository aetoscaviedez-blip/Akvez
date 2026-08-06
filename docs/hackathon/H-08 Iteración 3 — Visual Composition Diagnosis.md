# H-08 Iteración 3 — Diagnóstico de Composición

| Campo | Valor |
| --- | --- |
| Documento | **H-08 Iteración 3 — Visual Composition Diagnosis** |
| Clasificación | **Dirección de arte** — diagnóstico. No es Blueprint, no es auditoría técnica |
| Estado | 🟡 **Diagnóstico · cero código · pendiente de aprobación** |
| Fecha | 2026-08-06 |
| Método | **Prueba del entrecerrado**: escala de grises + desenfoque hasta que ningún texto se lee. Solo masas |

---

# 0. El hallazgo que reordena todo el diagnóstico

Al desenfocar las cinco pantallas y ponerlas en fila, esperaba encontrar incoherencia. **Encontré lo contrario, y es peor.**

> ## AKVEZ ya no tiene un problema de inconsistencia. Tiene un problema de **monotonía**.
>
> Las cinco siluetas son **la misma silueta**: una escalera de barras horizontales del mismo ancho, alineadas al margen izquierdo, con el tercio derecho en negro.

Durante H-07 luché contra la inconsistencia y gané. **Y esa victoria produjo el problema actual:** unifiqué tanto que eliminé la variedad interna. Un jurado desenfocando la demo no percibe «mismo lenguaje visual». Percibe **«la misma página cinco veces»**.

La referencia hace justo lo contrario: **es una sola pantalla, pero internamente variadísima** — columna estrecha texturada contra bloques grandes, un punto brillante, filas de cuatro y de tres, una ruptura naranja. AKVEZ tiene cinco pantallas internamente idénticas entre sí.

**Consistencia por uniformidad no es lo mismo que coherencia por sistema.** Lo primero aburre; lo segundo convence.

---

# 1. La prueba del entrecerrado

## 1.1 · La referencia, desenfocada

Lo que sobrevive al desenfoque:

- Una **columna vertical estrecha a la izquierda, densamente texturada** — se percibe como grano fino, casi como un patrón de rayas.
- A su derecha, **un bloque grande y limpio** con **un punto muy brillante en su cuadrante superior derecho**.
- Debajo, **una fila de cuatro masas pequeñas iguales**.
- Debajo, **una fila de tres masas medianas, de las cuales una brilla**.
- Al pie, **dos masas pequeñas**.

**Tres cosas son evidentes sin leer una palabra:** hay un punto de gravedad, hay contraste de grano entre izquierda y derecha, y hay dos rupturas de patrón deliberadas.

## 1.2 · AKVEZ, desenfocado

| Pantalla | Silueta al desenfocar |
| --- | --- |
| **Dashboard** | Barra fina · barra fina · mancha media a 2/3 · dos hilos finos · **losa gris uniforme dividida en cuatro** · banda ámbar · **losa naranja**. Todo del mismo ancho |
| **Lead Hunter** | Barra · barra · mancha · luego **dos columnas** — tres burbujas apiladas a la izquierda, y a la derecha **una banda violeta saturada** seguida de una tarjeta grande con **un punto naranja pequeño** arriba |
| **Opportunity View** | **Una tarjeta grande con un anillo brillante a la derecha** — y después, escalera de manchas alineadas a la izquierda con el 40 % derecho en negro |
| **AI Showcase** | **Una línea vertical fina con cuadraditos a intervalos regulares**, y colgando de ella manchas cortas alineadas a la izquierda. El 45 % derecho, negro |
| **Pitch Generator** | Barra · mancha · **dos burbujas del mismo tamaño lado a lado** · **banda ámbar ancha** · línea vertical con cuadraditos · manchas a la izquierda |

## 1.3 · Las respuestas al ejercicio

**¿Hacia dónde cae el ojo primero?**

- En la referencia: **al punto brillante del cuadrante superior derecho.** Inequívoco.
- En AKVEZ: **a la masa cromática más grande, que casi nunca es la importante.** En el Dashboard cae en la losa naranja del CTA. En el Lead Hunter cae en la banda violeta —que no es el protagonista—. En el Pitch cae en la banda ámbar de advertencia. **Solo en Opportunity View cae donde debe.**

**¿Qué masas dominan?**

En AKVEZ dominan **bandas horizontales a todo el ancho**. Y una banda a todo el ancho es la forma más pesada y menos informativa que existe: pesa mucho y no dirige nada, porque no tiene un lado hacia el que empujar.

**¿Dónde respira la composición?**

Aquí está el fallo más caro. **AKVEZ respira en el lugar equivocado: respira sobre el lienzo, en el tercio derecho, en negro.** La referencia respira *dentro* de sus tarjetas. El aire de AKVEZ se lee como falta de contenido; el de la referencia, como holgura.

**¿Dónde hay tensión?**

**En un solo sitio de todo el producto: el hero de Opportunity View**, donde una masa izquierda y una derecha de tamaños distintos se disputan la mirada y gana la pequeña porque es más brillante. En ningún otro punto hay dos masas desiguales dialogando.

**¿Dónde hay equilibrio?**

Hay **equilibrio simétrico** —el más aburrido— en casi todas partes: bandas centradas en el ancho, repetidas. Equilibrio simétrico es estabilidad sin energía. Es el equilibrio de una pared, no el de una composición.

**¿Qué pesa demasiado?**

1. **La banda violeta «Analizado con IA»** del Lead Hunter — es la mancha cromática mayor de su pantalla y no es el mensaje.
2. **La banda ámbar de dato de ejemplo** en el Pitch — domina la entrada a la narrativa con una advertencia.
3. **La losa naranja del CTA** del Dashboard — correcta como acción, pero a todo el ancho pesa más que las métricas, que son el contenido.
4. **El embudo del Dashboard** — cuatro tarjetas grandes seguidas, la mayor acumulación de masa idéntica del producto.

**¿Qué no pesa nada?**

1. **La fila de pestañas.** Al desenfocar, desaparece. La navegación del producto es invisible.
2. **Los rótulos en versalitas.** Correcto: deben desaparecer.
3. **El titular de pantalla.** Tras la iteración 1 se calmó — quizá demasiado: al desenfocar es una mancha gris media que no reclama nada. Bajó de gritar a **susurrar**, y el registro correcto está en medio.
4. **El 85 en el Lead Hunter.** Es un punto brillante pequeño perdido junto a una banda violeta enorme.

---

# 2. Dónde se rompe el ritmo

No dónde hay un elemento feo. **Dónde el recorrido pierde velocidad.**

| Momento | Qué ocurre |
| --- | --- |
| **Dashboard, al pasar del CTA al embudo** | La narrativa **frena en seco**. Venías de una acción y entras en cuatro tarjetas grandes que repiten cifras ya vistas 400 px antes. El ojo pasa de avanzar a recorrer un inventario |
| **Dashboard, en «Últimos negocios»** | **Se interrumpe el flujo:** aparecen tres tarjetas completas que son la pantalla siguiente entera, dentro de la pantalla actual. El usuario ya vio el Lead Hunter sin haber llegado |
| **Lead Hunter, al entrar** | El titular a todo el ancho **desconecta el encabezado del cuerpo**. Se lee «cartel» y luego «aplicación»: dos momentos, no uno |
| **Opportunity View, a los ~400 px** | **La pantalla se contradice.** El hero enseña que hay dos zonas; a partir de ahí la derecha desaparece. La promesa espacial se rompe y el ojo se queda sin la mitad que le habían prometido |
| **AI Showcase, en cada paso** | **No se rompe: nunca acelera.** Compases idénticos de principio a fin. Sin variación de tempo, seis pasos se perciben como doce |
| **Pitch Generator, antes del paso 01** | Tres masas de peso parecido —selector, firma, advertencia— **retrasan la entrada a la historia**. La narración empieza con trámite |
| **Pitch Generator, en el paso 04** | **La tarjeta que debería ser protagonista no lo es.** Es el desenlace del recorrido completo y se presenta con el mismo peso que los pasos de preparación |

---

# 3. ¿Un producto o cinco herramientas?

**Un producto. Sin ninguna duda.** Ese debate está cerrado: paleta, tipografía, chips, botones, tarjetas y encabezados son idénticos en las cinco pantallas.

**Pero el recorrido no progresa.** Cinco pantallas con la misma silueta producen la sensación de estar **navegando el mismo sitio en círculos**. Una demo tiene que sentirse como un ascenso: cada pantalla debe parecer un escalón por encima de la anterior, y aquí las cinco están al mismo nivel.

**La única que rompe la monotonía es Opportunity View**, y por eso —aun estando comprometida por debajo del hero— es la que un jurado recordaría.

---

# 4. Las cinco preguntas

## 1 · Si solo pudiera cambiar una decisión de composición

> ### **Quitarle a los bloques el derecho automático a ocupar todo el ancho.**

Hoy cada bloque reclama el 100 % del lienzo por defecto. **De esa única decisión salen los cuatro fallos del entrecerrado a la vez:**

- Sin bloques de anchos distintos **no puede haber grano**, y sin grano no se percibe asimetría.
- Sin anchos distintos **no puede haber protagonista**, porque el ancho es el primer indicador de importancia.
- Sin anchos distintos **el aire sobra por el lado derecho** en lugar de quedarse dentro de las tarjetas.
- Sin anchos distintos **el ojo baja en línea recta**, y una línea recta no tiene tensión.

Es la raíz. Todo lo demás es consecuencia.

## 2 · Si solo pudiera eliminar una sección completa

> ### **El embudo de oportunidad del Dashboard.**

Cuesta cerca de **1.200 px de altura** y las cuatro cifras que muestra **son literalmente las mismas cuatro cifras de la rejilla de métricas que está 400 px más arriba**. Lo único que añade es la relación entre ellas —«2 de 2»—, y eso cabe en un renglón.

**Mejora el producto por tres vías:**

1. Elimina **la mayor acumulación de masa idéntica** del producto: cuatro tarjetas grandes seguidas, que es el tramo donde el entrecerrado peor sale.
2. **Acorta el desplazamiento del Dashboard casi a la mitad**, y una demo se juzga por lo que cabe en pantalla, no por lo que hay al final del scroll.
3. Retira una repetición. **Un producto premium no dice dos veces lo mismo** — decirlo dos veces comunica que no había suficiente que decir.

*(Segunda candidata: «Últimos negocios», que mete la pantalla siguiente entera dentro de esta. Pero el embudo aporta menos.)*

## 3 · La pantalla más débil hoy

> ### **Executive Dashboard.**

Dos razones, y la segunda es la grave:

**No tiene centro de gravedad.** Ninguno. Es una losa gris de cuatro celdas iguales, una banda ámbar y una losa naranja. Al desenfocar, **no hay un solo punto hacia el que caiga el ojo**. Hay muchas tarjetas; no hay composición.

**Y es la primera pantalla.** Un fallo en la posición 1 cuesta muchísimo más que el mismo fallo en la posición 5, porque los cinco segundos que deciden la percepción se gastan ahí. Ahora mismo AKVEZ **abre por su pantalla más floja**.

## 4 · La pantalla más fuerte hoy

> ### **Opportunity View — por su hero, no por la pantalla entera.**

Es el único punto del producto donde ocurren simultáneamente las tres cosas que hacen premium a la referencia: **masas desiguales dialogando, un punto de gravedad inequívoco y contraste de tamaño entre lo que identifica y lo que puntúa.**

**El AI Showcase es la mejor *dirigida*** —el raíl numerado es el dispositivo más sofisticado del producto— pero le falta lo esencial: no tiene punto de gravedad, solo estructura.

Y hay que decirlo entero: **Opportunity View es la más fuerte durante sus primeros 400 px y una de las más flojas después.**

## 5 · Porcentaje de parecido visual con la referencia

**Sin optimismo. Ponderado por lo que cada dimensión aporta a la percepción premium:**

| Dimensión | Peso | AKVEZ | Argumento |
| --- | :-: | :-: | --- |
| Paleta y significado del color | 15 % | **90 %** | Tres colores, tres significados, sin excepciones |
| Tipografía: familia, escala y peso | 15 % | **85 %** | La grotesca única cerró la brecha; falta afinar el registro |
| Sistema de piezas: chips, botones, tarjetas | 15 % | **85 %** | Una anatomía por concepto |
| Legibilidad y ritmo tipográfico | 10 % | **90 %** | Medida, interlineado y contraste resueltos |
| Materialidad de las superficies | 10 % | **70 %** | Hay luz; la referencia tiene más capas |
| **Composición y reparto de masas** | **25 %** | **25 %** | **Sin empezar** |
| **Densidad de información** | **10 %** | **30 %** | La referencia muestra ~40 datos; AKVEZ, ~10 por pantalla |

> ## **≈ 64 %**

**Y el dato que importa más que la cifra:** el 36 % que falta **está concentrado casi entero en las dos dimensiones que no hemos tocado** — composición y densidad suman el 35 % del peso total.

Dicho de otro modo: **el 64 % conseguido era la parte barata.** Se compra con tokens, escalas y primitivas. **El 36 % restante no se compra con nada de eso**: exige rehacer cómo se reparten las masas sobre el lienzo, que es trabajo de maquetación, no de sistema.

---

# 5. Veredicto

**AKVEZ ya no parece una aplicación mal diseñada. Parece una aplicación bien diseñada.**

Y esa es exactamente la distancia que queda: **entre «bien diseñada» y «cara».**

Lo que separa una cosa de la otra no es más pulido — es que la composición tenga **una opinión**. Hoy AKVEZ presenta su información con corrección y sin jerarquía espacial. La referencia **argumenta** con el espacio: decide qué es grande, qué es pequeño, qué está arriba a la derecha y qué se repite.

> **La prueba a superar sigue siendo la misma:** desenfoca la pantalla. Si la mancha es una escalera de rectángulos del mismo ancho, es un documento. Si hay masas de tamaños distintos con un punto claro de gravedad, es un producto.
>
> **Hoy la pasa un solo bloque de los cinco.**

---

**Diagnóstico entregado. Cero código escrito. A la espera de aprobación para definir la Iteración 4.**
