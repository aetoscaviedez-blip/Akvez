# H-07 F6 — Final Demo Readiness

| Campo | Valor |
| --- | --- |
| Documento | **H-07 F6 — Final Demo Readiness** |
| Clasificación | **Sprint de inspección** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Informe entregado · cero código escrito** |
| Fecha | 2026-08-06 |
| Método | Recorrido completo como usuario · Chrome a 1440×960 · medición en el DOM · **inspección de lo que las fases anteriores no tocaron** |
| Referencia | **Imagen oficial de la demo** *(la que originó el Visual DNA)* — no versiones anteriores de AKVEZ |

---

# 0. La conclusión, primero

**Las cinco pantallas del guion de demo están listas.** Tipografía, medida de lectura, contraste, jerarquía, color semántico y narrativa se sostienen — lo he vuelto a medir y no hay ni un bloque por encima de 80 caracteres por línea ni texto por debajo de 14 px.

**El problema no está en esas cinco pantallas. Está en lo que las rodea.**

> ### Ocho archivos nunca entraron en el sistema de diseño.
>
> Cuatro son **el lateral del Lead Hunter** —lo primero que un jurado toca—, uno es **la Biblioteca**, que está a un clic desde cualquier pantalla, y otro es **`ScoreBreakdown`**, que se abre justo en el momento de mayor credibilidad técnica de la demo.
>
> **Las fases F1-F5 midieron su éxito sobre las cinco pantallas del guion, y estos quedaron fuera del foco.** Si el jurado se sale del guion —y suele salirse—, ve el producto anterior a H-07.

Y hay un defecto de composición que no depende de ningún componente: **el Lead Hunter deja 1.555 px de columna vacía**, el 28 % del ancho, durante todo el desplazamiento.

---

# 1. ¿Parece un producto SaaS premium? — pantalla por pantalla

**No respondo «sí». Lo argumento, y señalo lo que aún parece amateur.**

| Pantalla | Veredicto | Por qué |
| --- | :-: | --- |
| **Executive Dashboard** | ✅ **Sí** | Titular editorial a 48 px, cuatro cifras en rejilla sin costuras, una sola acción naranja. **Se lee como un panel de producto, no como un informe.** Nada amateur |
| **Opportunity View** | ✅ **Sí, la mejor** | El 85 a 60 px dentro del anillo no compite con nada. La franja de calidad debajo es exactamente el tratamiento de la referencia |
| **AI Showcase** | ✅ **Sí** | Los pasos numerados con raíl vertical dan sensación de proceso deliberado. **Es la pantalla que mejor comunica «esto lo pensó alguien»** |
| **Pitch Generator** | 🟠 **Casi** | La secuencia numerada funciona. **Pero el selector de canal es un control segmentado hecho a medida** que no existe en ninguna otra pantalla |
| **Lead Hunter** | 🔴 **No del todo** | El contenido de la derecha es premium. **El lateral izquierdo pertenece a otro producto**: encabezados en mayúsculas display, barra de desplazamiento nativa a la vista, radios propios. Y debajo, un cuarto de pantalla vacío |
| **Lead Library** *(fuera de guion, a un clic)* | 🔴 **No** | Encabezado en MAYÚSCULAS, contador en monoespaciada, estado vacío hecho a mano. **Es la única pantalla que sigue siendo la de antes de H-07** |

---

# 2. Hallazgos

## 🔴 Crítico

### F6-01 · El Lead Hunter deja el 28 % del ancho vacío

| | |
| --- | --- |
| **Problema** | El lateral mide **948 px de contenido** dentro de una caja de **2.504 px**: **1.555 px de columna negra vacía** que acompañan todo el desplazamiento de resultados. **Y eso con solo 2 leads** — con cinco, la columna vacía triplica |
| **Impacto** | 🔴 Es de los defectos que un jurado nota sin saber nombrarlo: *«¿por qué hay un tercio de pantalla en negro?»*. Rompe la sensación de densidad de producto que la referencia transmite |
| **Solución** | `lg:sticky lg:top-24 self-start` en el lateral: los filtros acompañan el desplazamiento en lugar de quedarse arriba. **Es el patrón estándar de cualquier SaaS con panel de filtros** |
| **Esfuerzo** | 🟢 **Trivial** — una clase |

### F6-02 · Lead Library nunca entró en el sistema de diseño

| | |
| --- | --- |
| **Problema** | Encabezado **«BIBLIOTECA DE LEADS» en mayúsculas display**, estado vacío **«TU BIBLIOTECA ESTÁ VACÍA»** en mayúsculas, contador **«0 Leads registrados» en monoespaciada**, cabecera con anatomía propia. No importa ni una primitiva |
| **Impacto** | 🔴 **Está a un clic desde las cinco pantallas.** Si el jurado la abre, ve exactamente el producto que las seis fases anteriores corrigieron. Es la ruptura de coherencia más grande que queda |
| **Solución** | Migrar a `SectionHeader`, `EmptyState`, `Badge` y `Button`. No hay lógica que tocar |
| **Esfuerzo** | 🟠 **Medio** — un archivo de ~320 líneas |

### F6-03 · Los cuatro controles del lateral nunca se migraron

| | |
| --- | --- |
| **Problema** | `NicheSelector`, `CitySelector`, `DesignStyleConfigPanel` y `SearchCtaButton` conservan encabezados `font-display uppercase`, radios propios (`rounded-2xl`, `rounded-xl`) y sus propios esquemas de color |
| **Impacto** | 🔴 **Es el primer bloque con el que interactúa quien prueba la demo.** Y está justo al lado de una `LeadCard` reconstruida, de modo que el contraste de acabado se ve en la misma pantalla |
| **Solución** | `Surface` + `Eyebrow` + `Button`; el ítem de lista puede quedarse como está, solo unificando radio y tipografía |
| **Esfuerzo** | 🟠 **Medio** — cuatro archivos pequeños |

---

## 🟠 Importante

### F6-04 · Barra de desplazamiento nativa a la vista

| | |
| --- | --- |
| **Problema** | La lista de nichos (`max-h-[310px] overflow-y-auto`) muestra la barra gris del sistema operativo |
| **Impacto** | 🟠 Junto al emoji y a la sombra genérica, **es uno de los tres marcadores clásicos de «prototipo»**. Además rompe la paleta: es el único gris claro de toda la interfaz |
| **Solución** | Estilar la barra en el CSS global *(ancho 6 px, pulgar sobre `surface-raised`)*. Una regla, sirve a toda la aplicación |
| **Esfuerzo** | 🟢 Trivial |

### F6-05 · `ScoreBreakdown` sin migrar

| | |
| --- | --- |
| **Problema** | Conserva `font-display uppercase`, sus propias barras y `text-app-muted/70` en la nota |
| **Impacto** | 🟠 **Se abre desde «Comprobar la aritmética» del AI Showcase — el momento en que la demo demuestra que el Score es reproducible.** Es el peor sitio posible para que baje el acabado |
| **Solución** | `Meter` + `Eyebrow`; la aritmética no se toca |
| **Esfuerzo** | 🟢 Bajo |

### F6-06 · Ningún control tiene `focus-visible`

| | |
| --- | --- |
| **Problema** | Comprobado en el DOM: **no hay ninguna regla de foco en toda la aplicación** |
| **Impacto** | 🟠 Un jurado técnico que tabule no ve dónde está. Y es un incumplimiento de accesibilidad que se detecta en diez segundos |
| **Solución** | Una regla global `:focus-visible` con anillo de marca |
| **Esfuerzo** | 🟢 Trivial |

### F6-07 · `font-mono` repartido sin criterio

| | |
| --- | --- |
| **Problema** | Aparece en 12 archivos: versiones del Perfil, «/ 100», porcentajes, «de 2», contadores de la Biblioteca. **A veces marca dato técnico y a veces no** |
| **Impacto** | 🟠 La monoespaciada comunica «esto es una máquina». Usada sin regla, comunica descuido |
| **Solución** | Fijar la regla —solo identificadores y versiones— y retirarla del resto |
| **Esfuerzo** | 🟢 Bajo |

### F6-08 · El emoji vive dentro del dato de muestra

| | |
| --- | --- |
| **Problema** | `classification: "🔥 Lead Excelente"` en `CL_SAMPLE_LEADS`. El componente ya no genera emojis; lo pinta porque viene en el contenido |
| **Impacto** | 🟠 Visible en las dos pantallas más usadas de la demo |
| **Solución** | Dos cadenas en `App.tsx`. **Es un cambio de datos, no de presentación** — sigue esperando su autorización |
| **Esfuerzo** | 🟢 Trivial · ⚠️ **requiere decisión** |

---

## 🟡 Menor

| # | Problema | Impacto | Solución | Esfuerzo |
| :-: | --- | :-: | --- | :-: |
| **F6-09** | El selector de canal del Pitch es un control segmentado a medida | 🟡 Anatomía única en el producto | Aceptable: ninguna primitiva cubre un segmented control. **Solo unificar radio y tipografía** | 🟢 |
| **F6-10** | La cabecera global (logo, PRO, ajustes, avatar) nunca pasó por el sistema | 🟡 Se ve siempre, pero es sobria y no desentona | Unificar el distintivo PRO con `Badge` | 🟢 |
| **F6-11** | El lateral no tiene contadores por nicho ni por ciudad, la referencia sí | 🟡 La referencia insinúa volumen de mercado con «218 · 156 · 94» | **Ninguna. AKVEZ no tiene ese dato y fabricarlo sería exactamente lo que seis sprints han evitado** | — |

---

## 🟢 Correcto — no tocar

| Área | Comprobación |
| --- | --- |
| **Tipografía en las 5 pantallas de guion** | 0 bloques > 80 cpl · 0 texto < 14 px · cuerpo a 16 px con interlineado 1.65 |
| **Contraste** | Mínimo medido **6,16:1**. Gris, naranja, violeta y verde sobre negro pasan AA |
| **Jerarquía** | Las cinco pantallas abren por su titular. Score 60 → titular 48 → sección 26 → cuerpo 16 |
| **Color semántico** | Naranja solo en marca, CTA y Score. Violeta solo en análisis. Verde solo en validación. **Sin excepciones detectadas** |
| **CTA** | Una sola acción primaria por pantalla, altura idéntica en cada fila |
| **Estados vacíos y declaraciones de ausencia** | Una sola anatomía, 16 px, medida acotada |

---

# 3. Flujo de demo — ¿se siente como un producto?

**Dashboard → Lead Hunter → Opportunity View → AI Showcase → Pitch Generator**

| Transición | Veredicto | Nota |
| --- | :-: | --- |
| Dashboard → Lead Hunter | 🟠 | La derecha continúa el lenguaje; **el lateral izquierdo lo rompe** *(F6-03)* |
| Lead Hunter → Opportunity View | ✅ | Natural. La tarjeta se expande en la vista de detalle |
| Opportunity View → AI Showcase | ✅ | **La mejor del producto.** Mismo ritmo, mismos pasos, misma escala |
| AI Showcase → Pitch Generator | ✅ | Los pasos numerados son literalmente el mismo componente. **Se nota, y para bien** |

> **La narrativa se sostiene.** El único corte brusco está en el primer salto, y lo causa un bloque que nunca entró en el sistema — no la narrativa en sí.

---

# 4. Comparación con la referencia oficial

| Elemento de la referencia | Estado en AKVEZ |
| --- | :-: |
| Fondo azulado, tres superficies ascendentes, cero sombras | ✅ **Igual** |
| Naranja marca · violeta inteligencia · verde validación | ✅ **Igual** |
| Cifra protagonista dominando la pantalla | ✅ **Igual** *(60 px)* |
| Rejilla de datos sin costuras | ✅ **Igual** — es lo más parecido a la imagen |
| Tarjetas de acción con icono, dos líneas y flecha; una sola sólida | ✅ **Igual** |
| Píldora de banda en verde | ✅ **Igual** |
| **Lateral como panel único con listas y contadores** | 🔴 **Distinto** — tres acordeones apilados, sin contadores |
| **Valor económico del proyecto · portafolio · «5 de 94»** | ⬜ **Ausente por decisión** — el dato no existe *(Visual DNA §9)* |

---

# 5. Blueprint — verificación de no regresión

| Documento | Estado |
| --- | :-: |
| **APS** *(01-20)* | ✅ Sin tocar. La única discrepancia —**APS-04 §13**, radios de botón— sigue registrada y resuelta a favor de la imagen por el orden de autoridad de H-07 |
| **ADS / ADR** | ✅ Sin tocar |
| **AF / WP** | ✅ Sin tocar. Ningún cambio afecta al Perfil de Ponderación ni al cálculo |
| **Arquitectura y módulos** | ✅ `shared/components/ui` vive en presentación. **Dominio, application e infrastructure sin una línea modificada en seis fases** |
| **Responsabilidades** | ✅ Ninguna primitiva conoce el dominio; todas reciben datos ya mapeados |

**No se ha sacrificado arquitectura por estética en ningún punto.**

---

# 6. Recomendación

**Tres bloques, por orden de impacto sobre lo que un jurado ve:**

| Orden | Qué | Corrige | Esfuerzo |
| :-: | --- | :-: | :-: |
| **1** | **Lateral pegajoso + barra de desplazamiento + `focus-visible`** | F6-01, F6-04, F6-06 | 🟢 **Tres reglas.** Máximo efecto por línea escrita |
| **2** | **Migrar los cuatro selectores del lateral** | F6-03 | 🟠 Medio |
| **3** | **Migrar Lead Library y `ScoreBreakdown`** | F6-02, F6-05 | 🟠 Medio |

**F6-07 y F6-09 a F6-11 no los recomiendo antes de la hackathon:** su relación entre riesgo y efecto visible no lo justifica.

**F6-08 sigue esperando su decisión** — es dato, no interfaz.

---

**Informe entregado. Cero código escrito. No avanzo al siguiente Sprint hasta su revisión.**
