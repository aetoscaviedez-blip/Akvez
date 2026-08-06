# H-07C — Fase 2 · El Design System de AKVEZ

| Campo | Valor |
| --- | --- |
| Documento | **H-07C — Fase 2 Implementation** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementada · `tsc --noEmit` y `vite build` en verde** · pendiente de aprobación para la Fase 3 |
| Fecha | 2026-08-05 |
| Objetivo | **Reducir el número de componentes visuales distintos.** No escribir menos código: tener menos anatomías |
| Alcance | **`src/shared/components/ui/` + 20 archivos de `presentation/`.** Dominio, application, infrastructure, backend, IA, prompts, DTO y Blueprint **sin una línea modificada** |

---

# 1. El problema, y por qué decidía la demo

**AKVEZ no tenía un problema de estética: tenía ~101 implementaciones de unas 9 ideas.**

Cuatro sistemas de encabezado, ocho de estado vacío, cinco anatomías de chip, catorce botones sin altura común, y **`InsightPanel` duplicado carácter por carácter en dos módulos**. Cada pantalla, por separado, estaba bien construida. Juntas, el usuario percibía el cambio de anatomía al cambiar de pestaña y lo leía —correctamente— como **cambio de aplicación**.

> **Un jurado no verbaliza «cuatro encabezados distintos».** Verbaliza *«esto lo han montado varias personas y nadie lo ha unificado»* — que es lo contrario de «producto financiado y listo para vender».

---

# 2. El censo, y la decisión canónica

| # | Categoría | Implementaciones | Usos | Diferencias reales | Canónico |
| :-: | --- | :-: | :-: | --- | --- |
| 1 | **Section Headers** | **9** | 24 | Escala, eyebrow, icono vs numeral, raíl | `SectionHeader` |
| 2 | **Empty States** | **8** | 14 | Icono, título, punteado | `EmptyState` |
| 3 | **Containers / Cards** | **12+** | 40+ | Superficie, tinte, punteado, radio | `Surface` |
| 4 | **Insight Panels / banners** | **11** | 17 | Solo el tono | `Callout` |
| 5 | **Status Badges** | **5** | 13 | Color por valor, icono | `Badge` |
| 6 | **Metric Cards** | **4** | 21 | Icono, caption, medidor | `StatGrid` + `StatTile` |
| 7 | **CTA** | **6** | 14 | Relleno, altura, tipografía | `Button` + `ActionCard` |
| 8 | **Medidores** | **5** | 5 | Grosor, tono | `Meter` |
| 9 | **Marcos de icono** | **7** | 7 | Tamaño, forma | `IconFrame` |
| | **Total** | **~67 anatomías** | **~155** | | **10 primitivas** |

---

# 3. Las diez primitivas

Cada una responde a las cuatro preguntas de entrada del sistema: *¿existe ya un equivalente? ¿puede generalizarse? ¿puede parametrizarse? ¿sirve en las cinco pantallas?*

| Primitiva | Qué es | Decisión de diseño relevante |
| --- | --- | --- |
| **`Surface`** | El contenedor. Todo bloque vive dentro de uno | `level` **es la posición en la pila de profundidad**, no un estilo: `card` → `raised` asciende en luz. `variant="dashed"` marca ausencia |
| **`SectionHeader`** | El único encabezado, en dos niveles | **`screen` se usa una vez por pantalla.** El paso numerado es una sección con `step`, no un tercer nivel. **Retira el borde izquierdo naranja** de Hunter y Pitch |
| **`Callout`** | Bloque que afirma algo sobre lo que contiene | **Casi todos sus usos son declaraciones de integridad.** El tono nunca es estético: `warn` = reserva, `danger` = fallo, `success` = verificado |
| **`EmptyState`** | La ausencia declarada | **Es lo que un jurado ve antes de la primera búsqueda.** El punteado es la gramática de R-38 |
| **`Button`** | La acción | Altura fija por tamaño: **los elementos de una fila comparten altura exacta** |
| **`ActionCard`** | La acción que se explica | **Es la anatomía de «¿QUÉ PUEDES HACER AHORA?» de la referencia.** `available={false}` atenúa, no oculta |
| **`Badge`** | El chip de dato | **El icono lleva el color; el texto, no.** Permite cinco chips en fila sin convertirla en un semáforo |
| **`StatGrid` + `StatTile`** | La cifra con su definición | `caption` no es decorativa: **una cifra sin decir qué cuenta no se puede comprobar** |
| **`Meter`** | La barra proporcional | **Nunca introduce una magnitud nueva.** `value === undefined` rinde pista rayada, no barra vacía: cero ≠ ausencia |
| **`IconFrame`** | El marco del icono | Dos formas: circular con tinte para razonamiento, cuadrado neutro para dato |

**Más `tone.ts`** — el único sitio donde el color semántico se traduce a clases. Cambiar la intensidad de un tinte en toda la aplicación es cambiar un número.

---

# 4. Reducción medida

## 4.1 Componentes eliminados

**Diez componentes locales borrados del código:**

| Componente | Vivía en | Sustituido por |
| --- | --- | --- |
| `MetricTile` | Executive Dashboard | `StatTile` |
| `Section` | Executive Dashboard | `SectionHeader` |
| `EmptyState` *(local)* | Executive Dashboard | `EmptyState` |
| `Section` | Opportunity View | `SectionHeader` |
| `EmptyPanel` | Opportunity View | `EmptyState` |
| **`InsightPanel`** | **Opportunity View** | `Callout` |
| `Stage` | AI Showcase | `SectionHeader` |
| `Fact` | AI Showcase | `StatTile` |
| `Unavailable` | AI Showcase | `EmptyState` |
| `ScreenHeader` | Pitch Generator | `SectionHeader` |
| `Chip` | Pitch Generator | `Badge` |
| `ActionLink` | Pitch Generator | `ActionCard` |
| **`InsightPanel`** | **Pitch Generator** *(duplicado literal)* | `Callout` |

**Y tres archivos completos eliminados:**

- `lead-hunter/presentation/components/EmptyState.tsx`
- `lead-hunter/presentation/components/SearchErrorBanner.tsx`
- `pitch-generator/presentation/components/NarrativeStep.tsx` *(incluía `AbsentData`, idéntica a `Unavailable`)*

## 4.2 Rastro medible

| Señal | Antes | Después | Nota |
| --- | :-: | :-: | --- |
| **Anatomías visuales distintas** | **~67** | **10** | −85 % |
| Implementaciones de estado vacío | 8 | **1** | |
| Sistemas de encabezado | 9 | **1** | |
| `border-dashed` ad hoc | 14 | **1** | El resto vive dentro de `Surface` |
| Tarjeta `rounded-2xl + border + bg` repetida | 12 | **0** | |
| Rejillas `gap-px` copiadas | 3 | **1** | Dentro de `StatGrid` |
| **Peso del bundle JS** | 345,5 kB | **335,6 kB** | **−9,9 kB pese a añadir 10 primitivas** |

> **El bundle baja mientras el sistema crece.** Es la prueba objetiva de que lo añadido sustituye más de lo que suma.

## 4.3 Componentes creados

**Once archivos nuevos**, todos en `src/shared/components/ui/`: las diez primitivas más `tone.ts`. Ninguno es específico de una pantalla; **los diez se usan en tres o más**.

---

# 5. Correcciones semánticas que la consolidación hizo posibles

**Al existir el vocabulario, el reparto empezó a corregirse solo donde era inequívoco:**

| Cambio | Por qué |
| --- | --- |
| **Banda del Score → verde** | Regla 3 del ADN: es un **valor conseguido**, no una marca. El naranja se reserva a la cifra y a la acción |
| **Checks de factores medidos → verde** | Una medición lograda es una validación |
| **Estado del sistema → verde / ámbar / rojo** | `ok` era naranja: indistinguible de la marca |
| **Estado del sistema gana etiqueta de texto** | Antes el nivel vivía **solo en el color del icono**: quien no distinguiera los tonos no leía nada |
| **Banners de IA → violeta** | El violeta es inteligencia y análisis. Es su primer uso real en el producto |
| **`animate-pulse` del loader retirado** | Latía la tarjeta entera, texto incluido, y hacía ilegible el mensaje de progreso justo cuando es lo único que hay que leer |
| **CTA con texto oscuro sobre naranja** | 7,9:1 frente a 2,9:1 — el blanco fallaba AA |

---

# 6. Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npx tsc --noEmit` | ✅ **0 errores** |
| `npx vite build` | ✅ **1690 módulos · 3,5 s** |
| Utilidades nuevas presentes en el CSS compilado | ✅ `rounded-container/card/inset/control`, `bg-intel`, `bg-success` |
| Componentes locales duplicados restantes | ✅ **0** |

**Riesgo controlado:** una clase de Tailwind inexistente no rompe el build, solo deja de pintar. Por eso se verificó **la presencia efectiva de cada utilidad nueva en el CSS de salida**, no solo que el proyecto compilara.

---

# 7. Qué NO se ha tocado

- **Dominio, application, infrastructure, backend, IA, prompts, DTO, Blueprint** — sin excepción.
- **Ninguna condición de renderizado, ningún cálculo, ningún estado.** Cada `if`, cada `typeof score === "number"`, cada declaración de ausencia y cada aviso de dato de ejemplo **conservan su lógica exacta**: cambiaron de envoltorio, nunca de comportamiento.
- **El sistema de animación** (`ak-rise`, `ak-bar`, `ak-ring`) y su protección `motion-safe:`.
- **Ninguna pantalla, funcionalidad ni campo nuevo.**

---

# 8. Deuda declarada

| # | Pendiente | Fase |
| :-: | --- | :-: |
| **1** | **`LeadCard` sigue sin migrar.** Es el componente más visible de la demo y el más alejado de la referencia: emojis, colores por valor, Score a 18 px. **Se reconstruye entero sobre las primitivas** | **3** |
| **2** | **`LeadLibrary`** conserva estilos ad hoc. Está fuera de las cinco pantallas del sprint, pero es alcanzable en un clic — **decisión pendiente del PO** | — |
| **3** | `ScoreBreakdown` no usa `Meter` todavía | 3 |
| **4** | `SubHeading` sobrevive como helper local en Opportunity View. **Es un estilo tipográfico, no una anatomía** — no justifica una primitiva | — |
| **5** | La escala tipográfica (`text-score`, `text-figure`) sigue **declarada y sin aplicar**: el reparto de jerarquía es Fase 4 | 4 |

---

**Fase 2 entregada y verificada. A la espera de aprobación para la Fase 3 — reconstrucción de `LeadCard`.**
