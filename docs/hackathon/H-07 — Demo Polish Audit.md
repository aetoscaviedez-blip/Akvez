# H-07 — Demo Polish & Visual Excellence · Auditoría

| Campo | Valor |
| --- | --- |
| Documento | **H-07 — Demo Polish Audit** |
| Clasificación | **Dirección de arte y revisión de producto** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Auditoría entregada · cero código escrito · pendiente de aprobación** |
| Fecha | 2026-08-05 |
| Referencia visual | **Visual DNA of AKVEZ Demo** *(mismo sprint, ya cerrado)* |
| Alcance | **Solo `presentation/`.** Dominio, application, infrastructure, backend, prompts, DTO y Blueprint quedan intactos |
| Pantallas | Executive Dashboard · Lead Hunter · Opportunity View · AI Showcase · Pitch Generator |

---

# 0. Veredicto

**AKVEZ no tiene un problema de estética. Tiene un problema de sistema.**

Cada pantalla, por separado, está bien construida: la disciplina de integridad de seis sprints se nota, los estados vacíos están explicados y ninguna cifra miente —salvo una, y está en la cabecera—. **El problema es que las cinco pantallas no comparten un mismo lenguaje.**

Un jurado que recorra la demo verá **cuatro encabezados de pantalla distintos, seis sistemas de estado vacío, tres naranjas, seis radios y dos generaciones de diseño conviviendo**. La conclusión que sacará no es «esto es feo». Es peor: **«esto lo han montado varias personas y nadie lo ha unificado»** — exactamente lo contrario de «producto financiado».

## Los tres hallazgos que deciden el sprint

| | Hallazgo | Por qué decide |
| :-: | --- | --- |
| **1** | 🔴 **El sistema de color está invertido en la raíz.** `--color-accent-green` **vale naranja** y `--color-secondary-orange` **vale violeta** | La regla nº 2 del ADN —*naranja marca, violeta inteligencia, verde dinero*— **no puede cumplirse hoy en ninguna pantalla**, porque el único token disponible pinta las tres cosas del mismo color. **Sin esto, el resto del sprint es maquillaje** |
| **2** | 🔴 **La cabecera publica un número inventado.** `leads.length * 11 + 72` | Es la primera cifra que el jurado lee, está en pantalla los tres minutos completos, y **es lo único fabricado que queda en todo el producto**. Una pregunta sobre ella hunde la credibilidad que sostiene todo lo demás |
| **3** | 🟠 **Ninguna pantalla tiene un protagonista.** El Score nunca domina | La regla nº 1 del ADN pide **7× el cuerpo**. Hoy el Score compite en tamaño con el nombre del negocio, y en `LeadCard` va a 18 px. **Sin un solo destino para la mirada, la interfaz se lee como panel de administración** |

> ### La buena noticia
>
> **Los tres se resuelven sin tocar una sola línea fuera de `presentation/` y `index.css`**, y los dos primeros son cambios de minutos con efecto en las cinco pantallas a la vez. **El coste de este sprint está concentrado en la fase 2 (primitivas compartidas), no en la 1.**

---

# 1. Identidad visual

## F-01 · 🔴 Los tokens de color mienten sobre su propio nombre

`src/index.css`:

```css
--color-accent-green:    #ff7a00;   /* ← es NARANJA */
--color-secondary-orange: #8b5cf6;   /* ← es VIOLETA */
```

**No es una molestia de nomenclatura: es la causa raíz de que el sistema de color no exista.** Con un token llamado «verde» que pinta naranja, cada pantalla ha acabado usando `accent-green` para **todo**: marca, acción, inteligencia, validación y dinero. El resultado medido en el código:

| Rol del ADN | Color esperado | Color real hoy |
| --- | :-: | :-: |
| Marca y acción | 🟠 `#F97316` | `accent-green` *(naranja)* |
| **Inteligencia y análisis** | 🟣 `#8B5CF6` | **`accent-green` (naranja)** |
| **Dinero y validación** | 🟢 `#22C55E` | **`accent-green` (naranja)** |

**El violeta —el color que el ADN reserva a la inteligencia— solo se usa hoy para advertencias e impacto financiero.** Está exactamente invertido respecto de la referencia.

## F-02 · 🔴 No existe el verde, y la banda del Score es naranja

Regla nº 3 del ADN: **la banda es verde**, porque es un valor conseguido, no una marca. Hoy, en `OpportunityHero.tsx:187`, la banda se pinta `border-accent-green/30 bg-accent-green/10 text-accent-green` — naranja sobre naranja, dentro de un hero que ya es naranja. **Lo mismo ocurre con los checks de verificación de `AIShowcase`** (naranjas, cuando el ADN los quiere verdes) y con toda la franja de calidad del Hero.

**Consecuencia perceptual:** una pantalla monocroma naranja no jerarquiza. Si todo es acento, no hay acento.

## F-03 · 🔴 Tres naranjas conviven en la aplicación

| Valor | Dónde | Cuántas veces |
| :-: | --- | :-: |
| `#ff7a00` | Token `accent-green` | Global |
| **`#E28A5D`** | Cabecera, avatar, **`SearchCtaButton`**, botón activo de `LeadCard` | **12** |
| `#ff6b35` | Icono de la Brújula | 1 |

> ### El caso más grave está en el CTA
>
> **El botón «Buscar oportunidades» del Dashboard es `#ff7a00`. El botón «Buscar» del Lead Hunter es `#E28A5D`.**
>
> Son las dos acciones primarias consecutivas del recorrido de la demo — **la segunda pantalla repinta la acción principal de la primera en otro color.** Es la ruptura de narrativa más visible de todo el producto y no requiere rediseño: requiere borrar un hexadecimal.

## F-04 · 🟠 El fondo no es el de la referencia, y falta la tercera capa

- **Fondo:** `#0a0a0a` neutro frente a `#0A0A0F` de la referencia. El tinte azul-violáceo es lo que separa «producto» de «apagado».
- **Solo hay dos superficies** (`dark-bg`, `dark-surface`). La referencia usa **tres ascendentes**: `#0A0A0F → #121218 → #1A1A24`.
- **Y la jerarquía está invertida:** las tarjetas interiores reutilizan `dark-bg`, que es el fondo de la página. Un contenedor anidado queda **más oscuro que su padre** — al revés de la referencia, donde cada nivel de anidamiento **sube** ~6 puntos de luz.

Se ve en `OpportunityView` (`bg-dark-bg` dentro de secciones), `LeadCard` (bloque de Opportunity Intelligence), `ExecutiveSummary` (contenedores de icono) y `AIShowcase`.

## F-05 · 🟠 Los radios no forman un sistema

Seis valores en uso, sin regla: `rounded-2xl` (54) · `rounded-xl` (37) · `rounded-full` (28) · `rounded-md` (13) · `rounded-lg` (11) · `rounded-3xl` (6).

El ADN pide **cuatro escalones con significado**: 16 contenedor · 14 tarjeta · 12 interior · 10 control, y `full` **solo** en píldoras, barras y círculos. Hoy `rounded-2xl` (16 px) se aplica indistintamente a un hero, a un chip de 24 px de alto y a un `textarea`.

## F-06 · 🟠 La escala tipográfica no existe

Doce tamaños ad hoc. **`text-xs` (102 usos) y `text-[10px]` (65) son el 62 % de todo el texto de la aplicación.**

La ratio que define el carácter de la referencia es **96 / 13 = 7,4×**. La de AKVEZ hoy es **48 / 12 = 4×**, y ese 48 px lo comparten el Score **y** el nombre del negocio. **Dos elementos al mismo tamaño significa que ninguno manda.**

## F-07 · 🟡 Sombras y «neon» contradicen la profundidad del ADN

`shadow-sm` (7) · `shadow-md` (7) · `shadow-lg` (5) · `shadow-inner` (1) · `.neon-glow` · `.neon-border`.

El ADN es explícito: **cero sombras proyectadas, profundidad puramente lumínica.** Es precisamente lo que separa una interfaz sobria de una plantilla. El propio nombre `neon-*` describe un lenguaje visual —brillo, resplandor— que la referencia no tiene.

## F-08 · 🟡 Emojis y Lucide conviven

`📌 🌐 🗺️ 🔍 🎯 ⭐ 💡 🔥 ✅ ⚠️` en 8 archivos, concentrados en **`LeadCard`** (6) y `App`.

La referencia es **100 % iconografía lineal**. El emoji es, junto a la sombra genérica, el marcador visual número uno de «prototipo»: renderiza distinto en cada sistema operativo, no acepta el color del contexto y rompe la alineación de la línea base.

**Matiz:** el `⚠️` de las marcas de dato de ejemplo cumple una función de integridad, no decorativa. Se sustituye por su equivalente Lucide, **no se elimina el aviso**.

## F-09 · 🟡 Seis colores crudos de Tailwind fuera de la paleta

`red-400/500` · `amber-300/400/500` · `orange-400` · `teal-400` · `emerald-400/500`. La mayoría en `LeadCard` (clasificación y fuente) y en los avisos de dato de ejemplo.

El ADN admite exactamente **dos acentos puntuales**: ámbar para la valoración, rojo para «sin sitio web». `teal` y `emerald` no pertenecen al sistema.

---

# 2. Consistencia

> **Esta es la sección que más peso tiene en la percepción de «un único producto», y donde más trabajo hay.**

## F-10 · 🔴 Cuatro encabezados de pantalla distintos

| Pantalla | Anatomía |
| --- | --- |
| Executive Dashboard | Eyebrow con icono → `h2` 4xl/5xl · **sin borde** |
| Lead Hunter | **`border-l-4` naranja** → `h2` 3xl **UPPERCASE** |
| Pitch Generator | **`border-l-4` naranja** → `h2` 3xl **sentence case** |
| Opportunity View | Botón volver → hero card *(sin encabezado propio)* |
| AI Showcase | Botón volver → eyebrow → `h2` 4xl/5xl |

**Cinco pantallas, cuatro tratamientos.** Hunter y Pitch comparten el borde izquierdo pero difieren en el uso de mayúsculas; Dashboard y Showcase comparten la escala pero no el borde. **Es el primer indicio que percibe el ojo al cambiar de pestaña**, y el que produce la sensación de «he cambiado de aplicación».

## F-11 · 🟠 Cuatro sistemas de sección para la misma función

| Componente | Archivo | Anatomía |
| --- | --- | --- |
| `Section` | `ExecutiveDashboard.tsx:525` | icono fijo `Activity` + título + lead |
| `Section` | `OpportunityView.tsx:282` | icono variable + **eyebrow** + título + lead |
| `Stage` | `AIShowcase.tsx:375` | **paso numerado + línea de tiempo lateral** + título + lead |
| `NarrativeStep` | `pitch-generator/components/` | **paso numerado** + eyebrow + título + lead |

**Dos de ellos comparten nombre y difieren en firma. Otros dos hacen lo mismo con nombre distinto.** Son cuatro implementaciones de un único concepto: *encabezado de bloque*.

## F-12 · 🟠 Seis sistemas de estado vacío

`EmptyState` (Dashboard) · `EmptyPanel` (OpportunityView) · `Unavailable` (AIShowcase) · `AbsentData` (PitchGenerator) · `EmptyLine` (ExecutiveSummary) · `EmptyState.tsx` (Lead Hunter).

Tres usan borde punteado, uno usa borde sólido, uno es texto en cursiva sin contenedor. **Y los estados vacíos son especialmente visibles en una demo**, porque el jurado ve la aplicación antes de la primera búsqueda.

## F-13 · 🟠 `InsightPanel` está duplicado literalmente

`OpportunityView.tsx:337-364` y `PitchGenerator.tsx:694-721` contienen **el mismo componente, carácter por carácter**, en dos módulos distintos. Divergirán en la primera modificación que toque uno solo.

## F-14 · 🔴 `LeadCard` pertenece a otra generación de diseño

**Es el componente más visible de la demo** —aparece en el Dashboard *y* en el Lead Hunter, y es lo que el jurado ve durante más tiempo— **y es el más alejado de la referencia.** Concentra:

- **6 emojis** (`📌 🌐 🗺️ 🔍 🎯 ⭐`)
- **6 colores crudos** de Tailwind
- **`#E28A5D` hardcodeado** en su botón activo
- `shadow-inner`, `shadow-sm`, `shadow-md`, `neon-glow`
- **Dos `animate-pulse`** sobre iconos de llama, sin significado asociado
- El Score a **`text-lg` (18 px)** dentro de una caja de 56 px con una llama superpuesta
- Tres botones inferiores con un tratamiento que no se repite en ninguna otra pantalla

**Cinco chips distintos en su cabecera**, cada uno con su propio esquema de color.

## F-15 · 🟠 Cinco anatomías de chip

| Dónde | Radio | Tratamiento |
| --- | :-: | --- |
| `LeadCard` clasificación | `md` | color por valor *(rojo / naranja / ámbar)* |
| `LeadCard` fuente | `md` | color por valor *(teal / naranja)* |
| `OpportunityHero` | `md` | neutro sobre `dark-bg` |
| `PitchGenerator` `Chip` | `md` | neutro *(componente propio)* |
| `LeadCard` «Maps Verificado» | `rounded` | naranja al 10 %, 9 px |

El ADN define **un** chip: superficie elevada, borde 1 px, radio 10 px, **el icono lleva el color semántico y el texto no**.

## F-16 · 🟠 Los botones no comparten sistema

Alturas `py-2.5` a `py-7`; radios `lg`, `xl`, `2xl`, `3xl`; unos con `uppercase tracking-wider font-display`, otros en `font-sans` sentence case; unos con sombra de color, otros sin sombra; `active:scale-[0.98]` en uno solo. **El ADN exige que los elementos de una misma fila compartan altura exacta** — hoy no ocurre ni dentro de un mismo componente.

---

# 3. Narrativa — el recorrido de la demo

**Recorrido mental: Dashboard → Lead Hunter → Opportunity View → AI Showcase → Pitch Generator.**

| Transición | ¿Un solo producto? | Qué se rompe exactamente |
| --- | :-: | --- |
| **Dashboard → Lead Hunter** | 🔴 **No** | El encabezado cambia de anatomía *(eyebrow → borde izquierdo + mayúsculas)*, **el CTA primario cambia de color** (`#ff7a00` → `#E28A5D`), y aparece `LeadCard` con emojis y seis colores nuevos. **Es la peor transición del recorrido, y es la primera** |
| **Lead Hunter → Opportunity View** | 🟠 Parcial | La navegación desaparece y no hay migas: solo un «Volver a los resultados» de 12 px arriba a la izquierda. **La vista de detalle no declara dónde está** — la referencia lo resuelve con «5 de 94» y flechas de navegación |
| **Opportunity View → AI Showcase** | 🟢 **Sí** | La mejor transición del producto. Mismo ritmo, misma escala, misma familia de secciones. **Es la prueba de que el sistema es alcanzable** |
| **AI Showcase → Pitch Generator** | 🟠 Parcial | Se vuelve al `chrome` global *(pestañas + Brújula)* que las dos vistas anteriores habían ocultado, y el encabezado cambia otra vez de anatomía. **El usuario percibe que ha salido de un flujo y ha entrado en otra herramienta** |

## F-17 · 🟠 La «Brújula del Freelancer» retrasa el contenido en cada pantalla

Un panel de ~100 px con texto de manual, encima de tres de las cinco pantallas. **En una demo de tres minutos, es tiempo de pantalla gastado en instrucciones que nadie lee.** La referencia resuelve la ayuda contextual con una tarjeta pequeña, lateral y **descartable** (`×`).

## F-18 · 🔴 La cabecera global no es la de la referencia — y publica un dato fabricado

```tsx
{leads.length * 11 + 72} oportunidades encontradas
```

**Es la única cifra inventada que queda en AKVEZ.** El resto del producto declara escrupulosamente lo que sabe y lo que no; esta línea multiplica por once. **Está en pantalla durante toda la demo y es la primera cifra que el jurado lee.**

> **Este es el punto que la sección §9 del Visual DNA anticipó.** La referencia insinúa escala con contadores por nicho y ciudad (218 · 156 · 94…). **AKVEZ no tiene esos contadores, y la respuesta no es fabricarlos: es no publicar ninguno.** La cabecera puede declarar lo que sí es cierto —cuántos negocios hay en el espacio de trabajo— sin inventar nada.

Además, la cabecera difiere de la referencia en el lockup del logo (`AK` circular + `VEZ` con `tracking-widest`, que se lee partido), y omite los botones de ayuda y notificaciones.

## F-19 · 🟠 El pie de página nombra otro producto

> «© 2026 **LeadFlow Colombia Suite**» · «Bautizado con Google Gemini en Español»

**El producto se llama AKVEZ.** Aparece en las cinco pantallas. Es una ruptura de identidad literal, en texto, permanente.

## F-20 · 🟡 La Biblioteca es una sexta pestaña fuera del alcance del sprint

`LeadLibrary` está en la navegación principal, es alcanzable en un clic desde cualquier pantalla y **no figura entre las cinco pantallas a revisar**. Si el jurado la abre, verá una pantalla sin pulir junto a cuatro pulidas.

**No propongo incluirla en el alcance.** Propongo decidir explícitamente si se pule o se oculta durante la demo — es una decisión del Product Owner, no del sprint.

---

# 4. Micro UX

## F-21 · 🟠 No hay skeletons en ninguna pantalla

- **Lead Hunter:** `SearchingLoader` es un stepper de texto con seis mensajes rotando cada 2,5 s. **Es la espera más larga de la demo** —una búsqueda real— y el área de resultados queda vacía.
- **Pitch Generator:** un icono `Sparkles` girando dentro de una caja.

Un skeleton que reproduzca la silueta de las tarjetas que van a llegar es **la señal de acabado más barata que existe**, y convierte la espera en anticipación en lugar de en incertidumbre.

## F-22 · 🟠 El foco no está diseñado

Todo el tratamiento de foco del producto son dos reglas: `.neon-border:focus` en CSS y `focus:border-accent-green` en dos campos. **Ningún botón tiene `focus-visible`.** Además de accesibilidad, es un detalle que un jurado técnico comprueba con el tabulador.

## F-23 · 🟡 El hover no tiene gramática

Cuatro comportamientos distintos sin criterio: cambio de borde, `brightness-110`, cambio de fondo, y ningún efecto. `active:scale-[0.98]` existe **en un solo botón** de toda la aplicación.

## F-24 · 🟡 Movimiento sin significado

Dos `animate-pulse` sobre iconos de llama en `LeadCard`, y el punto verde `animate-ping` de la cabecera. El del punto **sí** significa algo *(«el agente está activo»)* y la referencia lo tiene. **Las llamas no significan nada** y compiten con él.

**El resto del sistema de animación está bien resuelto:** `ak-rise`, `ak-bar` y `ak-ring` están bien pensadas, escalonadas y correctamente protegidas con `motion-safe:`. **No se tocan.**

## F-25 · 🟡 Las transiciones entre pantallas son instantáneas

El cambio de pestaña y la entrada a la Opportunity View son cortes secos. `ak-rise` ya existe y ya está en uso: aplicarla a la raíz de cada vista es una línea por pantalla.

## F-26 · 🟢 Ausencias menores de la referencia

Los iconos `(i)` de explicación junto a cada dato no obvio *(regla nº 10 del ADN)*; el `capitalize` de `HeroStat` sobre valores ya formateados; la ausencia de `tabular-nums` en algunas cifras que sí cambian.

---

# 5. Roadmap propuesto

**Ordenado por impacto visual descendente y riesgo técnico ascendente.** Cada fase se entrega y se aprueba por separado, conforme a los Principios de Trabajo.

---

## Fase 1 · Fundación de tokens

> **Máximo impacto, mínimo riesgo. Ninguna estructura se toca: solo valores.**

| | Contenido | Hallazgos |
| :-: | --- | :-: |
| 1.1 | **Corregir el sistema de color en `index.css`**: tres tokens con nombre veraz *(marca / inteligencia / validación)*, con los valores de APS-04 y de la referencia | F-01 · F-02 |
| 1.2 | **Tercera capa de superficie** y fondo `#0A0A0F`. Jerarquía lumínica ascendente | F-04 |
| 1.3 | **Eliminar los tres naranjas paralelos.** `#E28A5D`, `#D37B4F`, `#ff6b35` → token único | F-03 |
| 1.4 | **Escala de radios de cuatro escalones** y escala tipográfica declarada | F-05 · F-06 |
| 1.5 | **Retirar sombras y `neon-*`** en favor de profundidad lumínica | F-07 |
| 1.6 | ⚡ **Quick wins de identidad:** retirar la cifra fabricada de la cabecera · corregir el pie de página | **F-18 · F-19** |

**Riesgo:** bajo. **Impacto:** las cinco pantallas a la vez.
**Nota:** 1.6 son dos ediciones de texto con impacto desproporcionado. **Van primero.**

---

## Fase 2 · Primitivas compartidas

> **La fase más cara y la que decide si AKVEZ parece un producto. No añade pantallas ni funciones: consolida lo que ya existe.**

| | Primitiva | Sustituye a |
| :-: | --- | --- |
| 2.1 | **`ScreenHeader`** — una anatomía para las cinco pantallas | 4 encabezados *(F-10)* |
| 2.2 | **`SectionHeader`** — con variantes *simple* y *numerada*, conservando la línea de tiempo del Showcase | `Section` ×2, `Stage`, `NarrativeStep` *(F-11)* |
| 2.3 | **`EmptyState`** — una anatomía, con variantes de tono | 6 implementaciones *(F-12)* |
| 2.4 | **`Card` / `Panel`** — tres niveles de superficie | Contenedores ad hoc *(F-04)* |
| 2.5 | **`Chip`** — icono coloreado, texto neutro | 5 anatomías *(F-15)* |
| 2.6 | **`Button`** — primario / secundario / fantasma, altura fija | Botones sueltos *(F-16)* |
| 2.7 | **`InsightPanel` a `shared/components/`** | Duplicado literal *(F-13)* |

**Riesgo:** medio — toca las cinco pantallas. **Mitigación:** ninguna primitiva cambia comportamiento; se sustituye marcado, nunca lógica ni condiciones de renderizado. **Los estados de integridad —avisos de dato de ejemplo, declaraciones de ausencia, motor de respaldo— se conservan literalmente.**

---

## Fase 3 · `LeadCard`

> **El componente más visible de la demo, y el más alejado de la referencia. Merece fase propia.**

Reconstrucción sobre las primitivas de la Fase 2: chips unificados, sin emojis, sin colores crudos, sin sombras, **Score con peso real**, tres acciones de altura idéntica con una sola primaria.

**Riesgo:** medio-bajo, aislado en un archivo. **Impacto:** alcanza Dashboard y Lead Hunter simultáneamente. *(F-14 · F-08 · F-09)*

---

## Fase 4 · Jerarquía y protagonista

| | Contenido |
| :-: | --- |
| 4.1 | **El Score domina.** Escala editorial 7×, un solo protagonista por pantalla |
| 4.2 | **Una única acción primaria por pantalla.** El resto baja a secundaria |
| 4.3 | **Banda del Score en verde** — regla nº 3 del ADN |
| 4.4 | **Violeta para toda la inteligencia:** iconos de análisis, barras de confianza, desglose |

*(F-02 · F-06)* · **Riesgo:** bajo tras la Fase 1.

---

## Fase 5 · Chrome global y narrativa

Cabecera conforme a la referencia · pestañas en sentence case · **retirada o reducción de la Brújula a tarjeta lateral descartable** · migas de navegación en las vistas de detalle · transición de entrada por pantalla.

*(F-17 · F-18 · F-25)* · **Riesgo:** bajo. **Requiere una decisión del PO sobre la Brújula.**

---

## Fase 6 · Micro UX

Skeletons de búsqueda y de redacción · `focus-visible` sistemático · gramática única de hover · retirada del movimiento sin significado · iconos `(i)` de explicación.

*(F-21 · F-22 · F-23 · F-24 · F-26)* · **Riesgo:** muy bajo. **Es la fase que se puede recortar si el tiempo aprieta** — y la única.

---

# 6. Riesgos, conflictos y límites

## 6.1 Conflicto con el Blueprint — ya registrado, no reabierto

**APS-04 §13** asigna `radius-full` a botones primarios, secundarios y chips. **La referencia los muestra a 10 px.** Conforme al orden de autoridad de H-07, el Visual DNA resolvió a favor de la imagen y propuso anotar la corrección en APS-04 §27. **Este documento se limita a ejecutar esa resolución; no la reabre.**

**No se ha detectado ningún otro conflicto** entre el Blueprint y las propuestas de esta auditoría. Toda la Fase 2 consolida componentes **sin alterar navegación, vocabulario de dominio ni comportamiento**, que es donde APS-04 tiene autoridad absoluta.

## 6.2 El riesgo real del sprint: la integridad como activo

La referencia muestra **«Valor potencial del proyecto · USD 800 - 1,500»**, un portafolio fotográfico y contadores por nicho. **AKVEZ no calcula ninguna de esas tres cosas.**

**El Visual DNA §9 ya fijó la resolución: 100 % del ADN visual, 0 % de los datos inventados.** Esta auditoría la sostiene y añade una consecuencia operativa: **F-18 va en sentido contrario y está en el código hoy.** Retirar esa cifra no es una concesión estética — **es lo que permite que la respuesta a «¿de dónde sale ese número?» sea siempre demostrable en pantalla.**

## 6.3 Lo que este sprint NO toca

- **Dominio, application, infrastructure, backend, prompts, DTO, Blueprint** — sin excepción.
- **Ninguna condición de renderizado ligada a integridad:** avisos de dato de ejemplo, declaraciones de ausencia, `typeof score === "number"`, estado del motor de análisis, atribución separada de factores medidos y análisis del negocio. **Se les cambia la ropa, nunca la lógica.**
- **El sistema de animación existente** (`ak-rise`, `ak-bar`, `ak-ring`) y su protección `motion-safe:`.
- **Ninguna pantalla nueva, ninguna funcionalidad nueva, ningún campo nuevo.**

## 6.4 Decisiones que corresponden al Product Owner

| | Decisión |
| :-: | --- |
| **1** | **La Brújula del Freelancer** — ¿se retira, se reduce a tarjeta lateral descartable, o se conserva? *(F-17)* |
| **2** | **La Biblioteca** — ¿entra en el alcance de pulido, o se mantiene fuera de la ruta de la demo? *(F-20)* |
| **3** | **La cabecera** — confirmar qué cifra se publica en sustitución de la fabricada *(F-18)* |

---

# 7. Resumen de hallazgos

| Grav. | # | Hallazgos |
| :-: | :-: | --- |
| 🔴 **Crítico** | **6** | F-01 tokens invertidos · F-02 sin verde, banda naranja · F-03 tres naranjas *(CTA incluido)* · F-10 cuatro encabezados · F-14 `LeadCard` · F-18 cifra fabricada en cabecera |
| 🟠 **Alto** | **12** | F-04 superficies · F-05 radios · F-06 tipografía · F-11 secciones · F-12 estados vacíos · F-13 duplicado · F-15 chips · F-16 botones · F-17 Brújula · F-19 pie de página · F-21 skeletons · F-22 foco |
| 🟡 **Medio** | **7** | F-07 sombras · F-08 emojis · F-09 colores crudos · F-20 Biblioteca · F-23 hover · F-24 movimiento · F-25 transiciones |
| 🟢 **Opcional** | **1** | F-26 ausencias menores |

---

**Auditoría entregada. Cero código escrito. A la espera de aprobación de la Fase 1.**
