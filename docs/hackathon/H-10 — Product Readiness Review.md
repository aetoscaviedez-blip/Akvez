# H-10 — Product Readiness Review

| Campo | Valor |
| --- | --- |
| Documento | **H-10 — Product Readiness Review** |
| Registro | **Auditoría de producto.** No es técnica, no es visual, no es de composición |
| Estado | 🟡 **Análisis · cero código · pendiente de decisión** |
| Fecha | 2026-08-06 |
| Criterio | Solo cuentan los cambios que harían decir: *«esto ya parece una empresa»* |

---

# Resumen ejecutivo

**La interfaz ya no es el problema.** Tres sprints de dirección de arte la dejaron en un nivel que aguanta la comparación, y H-09 eliminó lo único que podía hundir la credibilidad —las afirmaciones que el producto no podía sostener—.

Lo que encontré al mirarlo como producto, y no como interfaz, es otra cosa:

> ## AKVEZ es **una demostración excelente de una capacidad**. Todavía no es **una herramienta que alguien use el martes siguiente**.

Y eso se nota en cinco puntos concretos, todos de producto y ninguno de diseño:

**El producto no sabe quién eres.** Firma los mensajes del usuario con «Estudio Creativo LeadFlow» — el nombre viejo del proyecto. **Cada correo que genera va firmado por una marca que no existe.**

**El producto se presenta a sí mismo como falso.** Arranca con dos negocios inventados y un aviso ámbar permanente que dice que no son reales. Es la pieza más «demo» de toda la aplicación, y está en la pantalla de entrada.

**El producto no recuerda el trabajo.** Marca internamente a quién ya escribiste y **no lo enseña en ninguna de las pantallas donde trabajas**. Un freelance que vuelva el jueves no sabe por dónde iba.

**El resultado de una búsqueda no se siente como un hallazgo.** Es el momento en que AKVEZ cumple su promesa, y aterriza como una lista con un rótulo pequeño.

**El recorrido no cierra el bucle.** Generas un mensaje, lo copias, y se acabó. No hay siguiente.

> **Ninguno de los cinco exige inventar un dato.** Los cinco están construidos sobre información que el producto ya tiene o ya sabe.

---

# 1. Primera impresión — los primeros cinco segundos

**Dónde mira:** al titular. *«Encuentra negocios que necesitan una web mejor»*. Es grande, está solo y dice lo que hace. **Esto ya está resuelto** — hace tres sprints no lo estaba.

**Qué entiende:** que el producto busca negocios con carencias web, eligiendo nicho y ciudad. **Correcto y rápido.**

**Qué siente:** interés cauto. Es un buen registro para un jurado técnico, aunque todavía no hay entusiasmo.

**Qué recuerda:** aquí está el problema. **Lo que más destaca cromáticamente en la entrada es un aviso ámbar que dice que los datos no son reales.** El producto se descalifica a sí mismo en su propia portada — con toda la razón, porque es verdad, pero eligiendo estar en esa situación.

---

# 2. Narrativa — ¿hay una historia?

**Sí, y funciona.** Descubrimiento → valor → evidencia → confianza → acción. El orden de las pestañas es el orden del relato y el arco emocional se sostiene.

**Pero la historia termina sin desenlace.** El clímax —el mensaje generado— llega bien, y después **no pasa nada**. No hay «siguiente», no hay «marcar como contactado», no hay retorno. El usuario se queda con un correo en el portapapeles y una pantalla que ya no le pide nada.

**Una demo puede terminar así. Un producto no.** Una herramienta de prospección es un bucle: buscas, eliges, escribes, vuelves. AKVEZ hoy es una línea recta.

---

# 3. Densidad visual

**Ya no hay espacios muertos de composición** — el lateral pegajoso y la retirada del embudo cerraron eso.

**Lo que queda vacío es de contenido, no de maquetación:**

- **Con datos de ejemplo, la Opportunity View se llena de «No disponible».** Cobertura, confianza, desglose: los Leads de muestra no traen ninguno, de modo que la pantalla más importante del producto se enseña medio hueca.
- **La Biblioteca aparece vacía mientras la cabecera dice que hay dos negocios.** No es un fallo: son dos almacenes distintos por decisión de arquitectura. **Pero el usuario ve dos contadores de lo mismo contradiciéndose en la misma pantalla.**

---

# 4. Jerarquía

| Debería verse | Se ve |
| --- | :-: |
| **1º** El titular con la promesa | ✅ |
| **2º** El Score del primer negocio | 🟠 Compite con el aviso violeta de IA, que ocupa más superficie |
| **3º** Lo que le venderías | ✅ Desde H-08 |

**Qué roba atención sin merecerla:**

- **El aviso de datos de ejemplo.** Es correcto que esté; el problema es que exista la situación que lo obliga.
- **El callout violeta «Analizado con IA»** a todo el ancho. Es una nota de procedencia con peso de titular.
- **El bloque «Firma del diseñador»** en el Pitch: ocupa la mitad de una fila y es configuración.

---

# 5. Valor — ¿aparece de inmediato?

**Sí.** El titular lo dice y la entradilla lo desarrolla. Esta dimensión está cerrada.

**El matiz que queda:** el valor aparece *enunciado*, no *demostrado*. Entre leer «encuentra negocios que necesitan una web mejor» y ver uno con nombre, teléfono y puntuación hay unos veinte segundos y una búsqueda de por medio. **En una demo con público, veinte segundos es mucho.**

---

# 6. Confianza

## Lo que la transmite — y es mucho

- **Que declara lo que no sabe.** «Lo que AKVEZ no pudo medir», «No consta el motor», «Sin comprobar». **Es el activo diferencial del producto** y no lo tiene nadie más.
- **Que el Score se reconstruye sumando sus partes** delante de quien mire.
- **Que los negocios son verificables:** nombre real, teléfono real, ficha de Maps.

## Lo que genera dudas

| Qué | Por qué |
| --- | --- |
| **El aviso de datos de ejemplo** | Es honesto, y aun así lo primero que comunica es «esto no es real» |
| **La firma «Estudio Creativo LeadFlow»** | Es el nombre viejo del proyecto. **Un jurado que lo vea en el mensaje generado piensa que el producto está a medio renombrar** — y tiene razón |
| **La Biblioteca vacía junto a «2 negocios»** | Dos cifras de lo mismo que no coinciden |
| **Que no haya cuenta ni nombre de usuario** | Todo es anónimo. Nada dice «esto es tuyo» |

## Qué parece demo y qué parece producto

| Parece **demo** | Parece **producto real** |
| --- | --- |
| Los dos negocios de ejemplo y su aviso | La `LeadCard` completa |
| La firma por defecto con el nombre viejo | El desglose del Score |
| El avatar genérico sin nombre | El mensaje generado |
| Que la Biblioteca no refleje el trabajo | Las declaraciones de lo no medido |

---

# 7. Consistencia

**Visual: resuelta.** Las seis pantallas comparten sistema desde H-09.

**De ritmo:** el AI Showcase sigue teniendo compases idénticos, pero ya no compite con la Opportunity View desde que se retiró el desglose duplicado.

**De narrativa — aquí queda la inconsistencia real:** *espacio de trabajo* y *Biblioteca* son dos conceptos con dos recuentos que el usuario percibe como uno solo. El producto usa además tres palabras para lo mismo: **negocio**, **Lead** y **oportunidad**.

**De interacción:** no hay ninguna acción que cambie el estado de un negocio desde donde se trabaja. Todo es leer y avanzar.

---

# 8. Preparación para un usuario real

**Un diseñador freelance de Bogotá, con clientes que buscar y sin tiempo.**

### ¿Lo entendería?

**Sí, y rápido.** El vocabulario es el suyo, los negocios son de su ciudad y el ángulo comercial está escrito en términos de trabajo facturable.

### ¿Lo usaría?

> **Una vez. Y ahí se quedaría.**

La prospección no es una sesión: es un hábito semanal. Al volver el jueves se encuentra con que **no sabe a quién escribió el martes**, no puede buscar aquel restaurante que le interesaba, y no tiene ninguna señal de por dónde iba.

**AKVEZ está construido para una sesión. El trabajo de su usuario dura meses.**

### ¿Lo recomendaría?

**Solo si el primer mensaje le funcionó.** El producto le entrega un artefacto excelente y después no acompaña. Que vuelva depende de algo que AKVEZ hoy ni mide ni sostiene.

---

# Los cinco cambios

**No veinte pequeños. Cinco que cambian la percepción.**

---

## 🔴 1 · El producto debe saber quién eres

| | |
| --- | --- |
| **Problema** | La firma por defecto es **«Estudio Creativo LeadFlow»** — el nombre anterior del proyecto. **Todo mensaje generado va firmado por una marca que no existe.** No hay nombre de usuario en ninguna parte; el avatar es un icono genérico |
| **Impacto** | 🔴 Es visible **dentro del momento WOW**. Un jurado que lea el correo firmado por otra marca concluye que el producto está a medio renombrar |
| **Prioridad** | **Máxima** |
| **Riesgo de no hacerlo** | Que el clímax de la demo contenga un error de marca |
| **Recomendación** | Que la primera ejecución pregunte **una sola cosa**: tu nombre o el de tu estudio. Todo lo demás se hereda. Y que ese nombre aparezca en la cabecera |
| **Beneficio** | La herramienta pasa de anónima a **mía**. Es el cambio más barato del documento y el que más «empresa» comunica |

---

## 🔴 2 · El producto no debe presentarse como falso

| | |
| --- | --- |
| **Problema** | Arranca con dos negocios inventados y un aviso ámbar permanente que dice que no son reales. **Es el segundo elemento más visible de la entrada** |
| **Impacto** | 🔴 El producto se descalifica en su propia portada. Y contamina todo lo demás: las cifras del Panel los cuentan, la Opportunity View se enseña con «No disponible» en cobertura y confianza porque los Leads de muestra no traen desglose |
| **Prioridad** | **Máxima** |
| **Riesgo de no hacerlo** | Que la mejor pantalla del producto se enseñe medio hueca |
| **Recomendación** | **Arrancar vacío, y que el vacío sea el onboarding.** Una pantalla con el titular, el nicho, la ciudad y un botón es más premium que una llena de datos rotulados como falsos. El estado vacío ya existe y está bien escrito |
| **Riesgo del cambio** | Si la búsqueda falla en directo no hay nada que enseñar. **Mitigación: ejecutar una búsqueda antes de presentar** — que además es lo que ya recomendé para el guion |
| **Beneficio** | Desaparece la pieza más «demo» del producto, **sin escribir una línea de aviso nueva** |

---

## 🟠 3 · El producto debe recordar el trabajo

| | |
| --- | --- |
| **Problema** | El estado del negocio —`Prospect` / `Pitched`— **se marca internamente y solo se muestra en la Biblioteca**. En el Hunter, en la tarjeta y en el Panel no aparece |
| **Impacto** | 🟠 Es **la respuesta a «¿lo usaría un freelance real?»**. Sin memoria del trabajo, la segunda sesión empieza a ciegas |
| **Prioridad** | Alta |
| **Riesgo de no hacerlo** | Que el producto sirva para una demo y no para un usuario |
| **Recomendación** | Que el estado sea visible **donde se trabaja**: un distintivo en la tarjeta y un recuento en el Panel. **El dato ya existe y ya se guarda** |
| **Beneficio** | Convierte una demostración en un flujo de trabajo. Es lo que separa herramienta de juguete |

---

## 🟠 4 · El resultado de una búsqueda debe sentirse como un hallazgo

| | |
| --- | --- |
| **Problema** | El instante en que AKVEZ cumple su promesa —vuelve con negocios reales— aterriza como una lista bajo un rótulo pequeño en versalitas |
| **Impacto** | 🟠 **Es el único momento del producto que puede provocar sorpresa** y hoy pasa desapercibido |
| **Prioridad** | Alta |
| **Riesgo de no hacerlo** | Que la demo no tenga ningún momento memorable antes del minuto y medio |
| **Recomendación** | Que el aterrizaje sea un acontecimiento con **cifras que el producto ya tiene**: cuántos encontró, en qué ciudad, cuántos sin sitio web. **Todo es contable sobre lo que está en pantalla** — ni una estimación |
| **Beneficio** | Da al recorrido un segundo pico, temprano, justo donde hoy no hay ninguno |

---

## 🟠 5 · El recorrido debe cerrar el bucle

| | |
| --- | --- |
| **Problema** | Se genera el mensaje, se copia, y la pantalla deja de pedir nada. **No hay siguiente** |
| **Impacto** | 🟠 La prospección es un bucle y el producto lo presenta como una línea recta. Además, la demo termina en una pantalla muerta |
| **Prioridad** | Alta |
| **Riesgo de no hacerlo** | Que el usuario no entienda que esto se repite — que es justamente donde está el valor |
| **Recomendación** | Tras copiar, ofrecer **la siguiente oportunidad**. *(La referencia oficial lo tiene: «Siguiente oportunidad» es su botón de cierre.)* Y marcar el negocio como contactado, que enlaza con el cambio 3 |
| **Beneficio** | El producto deja de terminar y empieza a continuar. **Es lo que hace que se perciba como algo que se usa, no como algo que se ve** |

---

# Otros hallazgos, sin entrar en los cinco

| | Hallazgo | Prioridad |
| :-: | --- | :-: |
| 🟠 | **Dos contadores del mismo concepto se contradicen**: «2 negocios en tu espacio de trabajo» frente a «0 Leads registrados». Es correcto por arquitectura y confuso por experiencia | Alta |
| 🟠 | **Tres palabras para lo mismo**: negocio, Lead, oportunidad | Media |
| 🟡 | El callout violeta de IA pesa más que el Score al que acompaña | Media |
| 🟡 | El AI Showcase mantiene compases idénticos | Baja |
| 🟢 | El chrome de cabecera y pie sigue fuera del sistema, aunque no desentona | Baja |

---

# Recomendación final

**Los cinco cambios se sostienen sobre información que el producto ya tiene.** Ninguno exige una funcionalidad nueva, una métrica inventada ni un dato que no exista.

Y hay un orden que conviene:

> **Los cambios 1 y 2 se hacen en una tarde y son los que más «empresa» comunican.** Uno retira un error de marca del momento culminante; el otro retira la etiqueta de «esto no es real» de la portada.
>
> **Los cambios 3 y 5 son los que responden a un usuario real** y van juntos: el estado visible y el bucle cerrado son la misma idea vista dos veces.
>
> **El cambio 4 es el que da un momento memorable temprano**, que es lo único que el recorrido no tiene todavía.

---

**Auditoría entregada. Cero código escrito. A la espera de tu decisión sobre cuáles ejecutar.**
