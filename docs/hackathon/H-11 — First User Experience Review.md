# H-11 — First User Experience Review

**Sprint:** H-11 · First User Experience (FU-X)
**Rol:** Chief Product Officer · UX Strategist · Product Designer Senior
**Alcance:** análisis. Cero código.
**Fecha:** 2026-08-06

---

## 1. Diagnóstico

Recorrí AKVEZ de principio a fin como si no lo conociera. La conclusión es incómoda y la digo primero:

> **AKVEZ pide antes de dar.**

Un usuario nuevo, en su primer minuto, atraviesa este orden:

| # | Momento | Qué recibe |
|---|---------|-----------|
| 1 | Formulario de alta (5 campos) | nada |
| 2 | Espacio de trabajo vacío | nada |
| 3 | Pulsa buscar | nada |
| 4 | Espera ~30 s | nada |
| 5 | Llegan los resultados | **primer valor** |

Cuatro pasos sin recompensa antes del primero con recompensa. Y el primero de todos —el formulario— es el único que exige esfuerzo real.

Eso no es un problema visual. H-10 dejó la interfaz consistente y el Design System cerrado; ahí no está la deuda. **La deuda es de secuencia.** AKVEZ tiene las piezas correctas en el orden equivocado.

El diagnóstico completo se resume en tres frases:

1. **El producto se presenta antes de demostrarse.** El alta ocupa el lugar donde debería ir la prueba.
2. **Las pantallas vacías señalan en vez de actuar.** Cuando no hay datos, AKVEZ explica dónde está el botón en lugar de ofrecerlo.
3. **En cada pantalla, la acción está detrás de su propia explicación.** El botón de generar vive en el paso 04. El desglose del Score aparece después de un enlace que te saca de la pantalla.

Ninguno de los tres requiere funcionalidad nueva. Los tres son reordenamientos.

---

## 2. Recorrido pantalla por pantalla

### 2.1 Primer ingreso — el alta (`FirstRunProfile`)

**¿Qué estoy viendo?** Un formulario de cinco campos que me pregunta quién soy.
**¿Qué debería hacer?** Rellenarlo. Está claro.
**¿Qué valor recibo?** Ninguno. Todavía no he visto el producto.
**¿Hay fricción?** Sí, y es la mayor del recorrido.

El alta resolvió un problema real en H-10.1: antes, los mensajes salían firmados por un perfil inventado. Eso había que arreglarlo y se arregló bien.

Pero introdujo otro: **el perfil solo se necesita en el momento de redactar el mensaje**, que es el paso 4 de 5 del recorrido. No hace falta para buscar. No hace falta para ver resultados. No hace falta para leer un Score. Se está pidiendo unos 90 segundos antes de que sirva para algo.

El coste medible: el alta **duplica el tiempo hasta el primer valor**. Sin ella, el recorrido es *abrir → buscar → resultados*, tres pasos y ~40 segundos. Con ella son cinco pasos y ~90.

Y hay un segundo coste, específico de hackathon: **los primeros 20 segundos de la demo son un formulario.** El jurado mira a alguien escribiendo su nombre.

### 2.2 Estado vacío del Lead Hunter

**¿Qué estoy viendo?** Un panel grande y centrado que dice *«Inicia la búsqueda de leads»*.
**¿Qué debería hacer?** Según el propio texto: *«Configura el nicho y la ciudad **a la izquierda**».*

Ahí está el fallo. **El elemento que ocupa la mayor superficie de la pantalla existe únicamente para mandarme a mirar a otro sitio.** Es un cartel que apunta, no un sitio donde actuar. El ojo aterriza en el centro, lee, y tiene que volver atrás.

Peor aún: **el nicho y la ciudad ya vienen puestos** (`NICHE_PRESETS[0]` y `"Bogotá"`). El usuario está literalmente a un clic de su primer resultado y el producto no se lo dice. Le pide configurar algo que ya está configurado.

### 2.3 La búsqueda

**¿Qué valor recibo?** Los mensajes del escáner son buenos: convierten 30 segundos de espera en 30 segundos de narración. Es de lo mejor del producto.

Pero **el guion contradice al producto** en el momento más observado de la demo:

| Dice | Debería decir | Por qué importa |
|------|---------------|-----------------|
| «Buscando listados reales en **Google Search**…» | Google Places | AKVEZ no usa Google Search. Es un dato falso sobre nuestra propia arquitectura. |
| «Calculando el **Lead Score**…» | Opportunity Score | Nombre retirado del producto. Aparece aquí y en ningún otro sitio. |

Un jurado técnico que oiga «Google Search» y luego lea «Google Places» en el resto de la interfaz detecta la costura.

### 2.4 Resultados

**¿Qué estoy viendo?** La cabecera de descubrimiento (H-10.1 P4) y una lista de tarjetas. Este es el mejor momento del producto: es donde por fin pasa algo.

**¿Qué debería hacer ahora?** No lo sé. Y ese es el hallazgo.

Han llegado los resultados y **nada me invita a abrir uno**. Las tarjetas tienen tres botones cada una, pero ninguna señal de que el nombre del negocio lleva a una pantalla de análisis mucho más rica. El usuario tiene que descubrirlo. En una demo cronometrada, eso se traduce en el presentador diciendo «y si hago clic aquí…», que es exactamente la frase que revela que la interfaz no guiaba sola.

### 2.5 Opportunity View

**¿Qué estoy viendo?** Un Score grande y seis secciones de análisis. Es la pantalla más densa y la más valiosa.

**¿Hay algo que me distraiga?** Sí, uno concreto y ubicado: el enlace **«Ver cómo lo analizó AKVEZ»** aparece en la línea 97, **antes** de «¿Por qué obtuvo ese Score?» en la línea 109.

Es decir: el producto me ofrece una excursión lateral **antes** de haberme explicado lo que estoy mirando. Se me invita a salir de la pantalla en el momento en que aún estoy entrando en ella. El AI Showcase es una pieza excelente —es la prueba de que hay inteligencia real detrás—, pero colocada ahí compite con el contenido en vez de recompensarlo.

**¿Qué elemento falta?** Nada. Esta pantalla tiene todo lo que necesita. Solo está en desorden.

### 2.6 Generación del mensaje

**¿Qué debería hacer?** Generar el mensaje. Para eso entré.
**¿Hay pasos innecesarios?** Sí. Cinco secciones numeradas, y **el botón de generar está en la 04**:

```
01  El negocio          → resumen de lo que ya vi
02  Problema encontrado → resumen de lo que ya vi
03  Oportunidad         → resumen de lo que ya vi
04  Pitch generado      → LA ACCIÓN
05  Acción recomendada
```

**Tres pantallas de recapitulación entre el usuario y aquello por lo que vino.** El contexto no está mal —es tranquilizador ver sobre qué negocio se va a escribir— pero está delante en lugar de al lado. El usuario llega decidido y el producto le hace repasar la decisión.

### 2.7 Dashboard

**¿Qué valor recibo?** Con una búsqueda hecha, tres cifras honestas. Correcto y sobrio.

**¿Qué elemento sobra?** **«Estado del sistema»** (servidor, Places, Gemini, respaldo). Es telemetría de ingeniería en un producto para diseñadores freelance. A un usuario nuevo no le dice nada; a un jurado le dice que no decidimos para quién es esta pantalla.

Atenúa la gravedad que sea la última sección de la última pestaña. Por eso no es crítico.

### 2.8 Navegación completa

Cuatro pestañas: *Oportunidades · Generar mensaje · Panel · Biblioteca*.

**¿Qué navegación no aporta?** **Biblioteca.** Muestra el mismo concepto que el espacio de trabajo, con otro nombre y **con otra cifra** —una lee de `localStorage`, la otra del servidor—. Un usuario nuevo ve «12 oportunidades» en una pestaña y «0» en otra, y concluye, razonablemente, que algo está roto.

Está señalado desde H-10 y sigue siendo la mayor rotura de continuidad del producto.

---

## 3. Continuidad, fluidez, recompensa, motivación

### Continuidad — ¿una aplicación o cinco páginas?

**Cuatro quintas partes de una aplicación.** Oportunidades → Opportunity View → Generar mensaje encadenan bien; comparten lenguaje visual y se pasan el contexto. Panel cierra el círculo.

**Biblioteca es la quinta página.** No por su diseño —usa el mismo sistema— sino porque cuenta una verdad distinta sobre los mismos datos.

### Fluidez — ¿dónde piensa demasiado el usuario?

Tres puntos exactos:

1. **Tras el alta**, al aterrizar en una pantalla vacía que le manda mirar a otro lado.
2. **Tras la búsqueda**, cuando llegan resultados y no sabe que las tarjetas se abren.
3. **Al entrar al Pitch**, cuando busca el botón de generar y encuentra un resumen.

Los tres son el mismo error con tres caras: **la acción no está donde está el ojo.**

### Recompensa — ¿cada acción genera recompensa visual?

Mayormente sí, y esto es mérito de H-08 y H-10.1:

| Acción | Recompensa | Estado |
|--------|-----------|--------|
| Buscar | cabecera de descubrimiento | ✅ fuerte |
| Abrir una tarjeta | Score con animación | ✅ fuerte |
| Generar | bloque «Listo para enviar» | ✅ el clímax |
| Copiar | etiqueta «Copiado» 2 s | ⚠️ débil |
| Terminar el ciclo | «Siguiente oportunidad» | ✅ correcto |

El único flojo es **copiar**, y es precisamente el acto final: el momento en que el usuario obtiene lo que vino a buscar se acusa con una etiqueta gris de dos segundos.

### Motivación — ¿quiere seguir explorando?

**Sí, si llega.** La tarjeta «Siguiente oportunidad» cierra el bucle bien y empuja a repetirlo. El problema de motivación de AKVEZ **no está al final del recorrido, está al principio**: el riesgo no es que el usuario se aburra en el paso 5, es que el formulario del paso 1 lo pierda antes de ver nada.

---

## 4. Hallazgos

### 🔴 H-11.1 — Sin claves de API, la primera experiencia es un error rojo

Verificado en este entorno: `GOOGLE_PLACES_API_KEY` no está configurada. El recorrido real de un usuario nuevo hoy es **formulario → pantalla vacía → clic → error**. Fin.

Y como H-10.1 retiró los datos de ejemplo —decisión correcta de producto—, **ya no queda nada que enseñar cuando la búsqueda falla**. Retirar el sample data mejoró la honestidad y aumentó el riesgo de demo. Ambas cosas son ciertas a la vez.

- **Impacto:** total. No hay producto que evaluar.
- **Coste:** conseguir dos claves + configurarlas. Cero código.
- **Recomendación:** bloqueante absoluto. Nada de este documento importa hasta resolverlo. Secundariamente, valorar un **«ver un ejemplo» explícito y etiquetado** —el usuario lo elige, no se le impone— como red de seguridad ante un fallo de red en vivo. No sería funcionalidad nueva: es el sample data que ya existió, ahora opcional y rotulado.

### 🔴 H-11.2 — El alta se pide ~90 segundos antes de necesitarse

El perfil solo hace falta al redactar el mensaje. Pedirlo al segundo cero duplica el tiempo hasta el primer valor y convierte los primeros 20 segundos de la demo en un formulario.

- **Responde a:** ¿el usuario obtiene valor antes? **Sí, a la mitad de tiempo.**
- **Impacto:** el más alto del documento.
- **Coste:** medio. Mover la puerta, no eliminarla: el usuario busca y explora libremente, y el alta aparece **al pulsar «generar mensaje»**, que es donde su utilidad es evidente y donde el usuario ya quiere darla porque va a firmar con su nombre.
- **Riesgo:** ninguno de integridad. El perfil sigue siendo obligatorio antes de escribir; solo se pide cuando se entiende para qué.
- **Recomendación:** **implementar.** Es el cambio de mayor retorno del sprint.

### 🟠 H-11.3 — El estado vacío señala en lugar de actuar

El elemento de mayor superficie de la pantalla inicial existe solo para redirigir la mirada. Además, nicho y ciudad **ya vienen configurados**: el usuario está a un clic y no lo sabe.

- **Responde a:** ¿reduce fricción? **Sí, elimina un rebote de mirada completo.**
- **Impacto:** alto — es la segunda pantalla que ve todo el mundo.
- **Coste:** bajo. Poner la acción donde ya mira el ojo y decir la verdad: que ya está listo para buscar Cafeterías en Bogotá.
- **Recomendación:** **implementar.**

### 🟠 H-11.4 — El escáner nombra tecnologías que AKVEZ no usa

«Google Search» (usamos Places) y «Lead Score» (nombre retirado), en el momento más observado de la demo.

- **Responde a:** ¿se siente más profesional? **Sí, y además hoy es incorrecto.**
- **Impacto:** alto en credibilidad, nulo en función.
- **Coste:** trivial. Dos cadenas de texto.
- **Recomendación:** **implementar.** Mejor relación impacto/coste del documento.

### 🟠 H-11.5 — En el Pitch, la acción está detrás de tres pasos de resumen

El botón de generar vive en el paso 04, tras tres secciones que repiten lo que el usuario acaba de leer.

- **Responde a:** ¿reduce fricción? **Sí, tres pantallas de scroll.**
- **Impacto:** alto — es el camino al momento «wow».
- **Coste:** medio. No borrar el contexto: subordinarlo. La acción primero, el detalle disponible debajo.
- **Recomendación:** **implementar.**

### 🟠 H-11.6 — El enlace al AI Showcase interrumpe antes de tiempo

Aparece antes del desglose del Score: invita a salir de la pantalla antes de haber explicado lo que se está mirando.

- **Responde a:** ¿entiende antes el producto? **Sí — primero comprender, después profundizar.**
- **Impacto:** medio-alto. Afecta a la pantalla más valiosa.
- **Coste:** bajo. Es mover un bloque.
- **Recomendación:** **implementar.** El Showcase gana: pasa de distracción a recompensa.

### 🟡 H-11.7 — Nada invita a abrir una tarjeta tras la búsqueda

Llegan los resultados y el usuario no sabe que el análisis profundo está a un clic.

- **Impacto:** medio. Cuesta el descubrimiento de la mejor pantalla del producto.
- **Coste:** bajo.
- **Recomendación:** **implementar** si entra en el sprint. No es bloqueante.

### 🟡 H-11.8 — Biblioteca y espacio de trabajo contradicen sus cifras

Dos nombres y dos números para el mismo concepto, por origen de datos distinto (`localStorage` vs. servidor). Arquitectónicamente correcto (APS-04 §A.3.4), confuso para una persona.

- **Impacto:** medio. Rompe la sensación de aplicación única.
- **Coste:** **decisión de producto, no de código.** Requiere que el PO defina qué significa cada superficie.
- **Recomendación:** **decidir en este sprint, implementar en el siguiente.** No lo resuelvo yo: excede mi mandato.

### 🟡 H-11.9 — «Estado del sistema» es telemetría en un producto para diseñadores

- **Impacto:** bajo — última sección de la última pestaña.
- **Coste:** trivial.
- **Recomendación:** **posponer.** Bien ubicado, hace poco daño.

### 🟢 H-11.10 — El acuse de «Copiado» es el más débil del recorrido

El acto final del ciclo —obtener el mensaje— se celebra con una etiqueta de dos segundos.

- **Impacto:** bajo pero mal situado: es el último recuerdo que se lleva el usuario.
- **Coste:** trivial.
- **Recomendación:** **implementar** solo si sobra tiempo.

### 🟢 H-11.11 — Tres palabras para un concepto

*negocio* / *lead* / *oportunidad* conviven. Heredado de H-10.

- **Recomendación:** **posponer.** Requiere decisión de vocabulario del PO.

---

## 5. Tabla de priorización

| # | Hallazgo | Prio | Impacto | Coste | Recomendación |
|---|----------|------|---------|-------|---------------|
| 1 | Sin claves no hay producto | 🔴 | Total | Cero código | **Bloqueante** |
| 2 | El alta llega 90 s antes | 🔴 | Muy alto | Medio | **Implementar** |
| 3 | El vacío señala, no actúa | 🟠 | Alto | Bajo | **Implementar** |
| 4 | El escáner miente | 🟠 | Alto | Trivial | **Implementar** |
| 5 | La acción tras 3 resúmenes | 🟠 | Alto | Medio | **Implementar** |
| 6 | Showcase interrumpe | 🟠 | Medio-alto | Bajo | **Implementar** |
| 7 | Nada invita a abrir tarjeta | 🟡 | Medio | Bajo | Si entra |
| 8 | Biblioteca vs. workspace | 🟡 | Medio | Decisión PO | **Decidir** |
| 9 | Estado del sistema | 🟡 | Bajo | Trivial | Posponer |
| 10 | «Copiado» débil | 🟢 | Bajo | Trivial | Si sobra |
| 11 | Tres palabras | 🟢 | Bajo | Decisión PO | Posponer |

---

## 6. Recomendación final

**Un solo tema, no once arreglos.** Los hallazgos 2 al 7 son la misma frase repetida en seis pantallas:

> **La acción está detrás de su explicación. Ponla delante.**

Si solo pudiera cambiar una cosa de todo AKVEZ, sería el **hallazgo 2**: mover el alta al momento en que sirve. Es lo único que cambia la primera impresión de *«esto me está pidiendo datos»* a *«esto me acaba de encontrar doce clientes»*.

Recomiendo un H-11.1 acotado a **2, 3, 4, 5 y 6** — cinco cambios, todos reordenamientos, ninguno funcionalidad nueva, ninguno toca backend, dominio, agentes, prompts ni contratos. El 7 entra si el tiempo lo permite.

**Y antes de todo eso, las claves.** Sin `GOOGLE_PLACES_API_KEY` y `GEMINI_API_KEY` no hay demo que pulir. Es el único punto de este documento que no puedo resolver desde el código.

---

## 7. Qué he verificado y qué no

**Verificado en código:** copy del escáner (`LeadHunter.tsx:104-111`), valores por defecto (`:55`, `:58`), texto del estado vacío (`:375-379`), numeración del Pitch (`PitchGenerator.tsx:245-534`), posición del enlace al Showcase (`OpportunityView.tsx:97` vs `:109`), secciones del Dashboard.

**No verificado:** el recorrido con resultados reales en vivo. Está bloqueado por la ausencia de claves. Los hallazgos 4, 6 y 7 se apoyan en lectura de código y en las capturas de sesiones anteriores con datos cargados, no en una ejecución de hoy.

**No implementado:** nada. Ni una línea. Espero aprobación.
