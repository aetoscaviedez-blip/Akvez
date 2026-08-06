# H-06B — Visual Alignment Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-06B — Visual Alignment Audit** |
| Clasificación | **Auditoría de UX** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Auditoría entregada** · ⏸️ **Cero código escrito**, conforme al encargo · 🔴 **Comparación pixel a pixel bloqueada** — §0 |
| Fecha | 2026-08-05 |
| Sprint | **H-06B — Visual Alignment** |
| Alcance auditado | H-04 F1-F2 · H-05A · H-05B · H-06 — **12 ficheros, ~2.700 líneas de UI** |

> **No se ha modificado ni un fichero de código.** Este documento audita y propone; la implementación es H-06C.

---

# 0. 🔴 Lo primero: la imagen oficial no está disponible

**El encargo designa «la imagen oficial del Dashboard» como referencia definitiva. No venía adjunta en el mensaje y no existe en el repositorio** — verificado: `assets/` solo contiene `.aistudio/.gitignore`, `src/assets/` solo un `.gitkeep`, y no hay **ningún** `.png`, `.jpg`, `.svg`, `.fig` ni `.pdf` en todo el árbol fuera de `node_modules`.

## 0.1 Pero sí existe su codificación normativa

**`APS-04 — Human Interface System` es la imagen oficial traducida a especificación.** Su §26 lo dice literalmente:

> *«Referencia visual oficial de producto (captura de interfaz **"AKVEZ PRO" — vista Lead Detail / Oportunidades**), suministrada como fuente de verdad del diseño para esta versión.»*

Y su §11 cierra la cuestión de autoridad:

> *«Los Design Tokens constituyen la **única fuente oficial de verdad** para la implementación visual del producto.»*

> ### **Por tanto esta auditoría se hace contra APS-04, no contra una imagen que no tengo.**
>
> **Y es una base más sólida que mirar una captura:** APS-04 es Blueprint, y CLAUDE.md establece que el Blueprint prevalece. La regla del encargo —*«siempre prevalece el Dashboard oficial»*— se cumple auditando contra el documento que ese Dashboard generó.

## 0.2 Lo que sigue bloqueado hasta ver la imagen

**Siete preguntas que APS-04 no responde y que ninguna auditoría de código puede contestar:**

| # | Pregunta abierta |
| :-: | --- |
| **1** | **Composición real de la vista Lead Detail**: qué ocupa la mitad superior, cómo se reparte el ancho |
| **2** | **¿El Score se presenta como anillo, como cifra suelta o dentro de una tarjeta?** *(H-04 F2 eligió anillo sin referencia)* |
| **3** | **Contenido y comportamiento del panel lateral** — APS-04 §15 lo describe, pero no qué contiene en cada pantalla |
| **4** | **Densidad real**: cuántas tarjetas por fila y con cuánto aire |
| **5** | **Tratamiento del header**: altura, contenido, si el indicador «Agente activo» pertenece al diseño oficial |
| **6** | **Si existe una vista de Dashboard oficial**, o si la referencia es solo Lead Detail *(§26 sugiere lo segundo)* |
| **7** | **Jerarquía cromática exacta** en las tarjetas de razones |

> **Solicito la imagen.** Con ella, el §6.7 del plan H-06C se completa en una pasada; sin ella, esas siete decisiones seguirán tomándose por criterio propio, que es exactamente lo que este sprint quiere evitar.

## 0.3 Segunda limitación, acumulada

> 🔴 **Ninguna de las cuatro pantallas auditadas se ha visto nunca renderizada.** No hay extensión de navegador en el entorno desde H-04. **Esta auditoría es estructural y de tokens, no perceptual:** mide lo que el código declara, no lo que el ojo ve.

---

# 1. Veredicto por pantalla

**Sin rodeos, como pide el encargo.**

## 1.1 Opportunity View — **¿se parece al Dashboard oficial?**

> ### **Parece la misma familia, pero no el mismo producto.**

**Lo que sí converge:** superficie oscura, tarjeta con borde de 1px, jerarquía de datos sobre decoración, cifra del Score como elemento dominante, iconografía Lucide lineal.

**Lo que la delata como pantalla distinta:**

| # | Divergencia | Norma |
| :-: | --- | --- |
| **1** | **Todo el color de análisis es naranja.** Banda, confianza, cobertura, barras de categoría, iconos de insight: **todo `brand-primary`** | **APS-04 §11.1: el violeta `#8B5CF6` es el color de «Análisis/IA, iconos de insight, barra de confianza»** |
| **2** | **El Score mide 48px** (`text-5xl`) dentro del anillo | **APS-04 §9.4: Display XL = 56-64px** para el Opportunity Score |
| **3** | **El anillo SVG no está en el Design System.** §18 documenta «Métrica destacada (Score): cifra en `font-display`, tamaño Display, color de marca» — **una cifra, no un anillo** | §18 · §22 regla 4 |
| **4** | **Botones y chips con `rounded-xl`/`rounded-md`** | **APS-04 §13: botones primarios, chips y badges usan `radius-full`** |
| **5** | Los títulos de sección son `text-2xl` (24px) | §9.4: H1 = 28-32px |

## 1.2 AI Showcase — **¿respeta la estética o parece una herramienta separada?**

> ### **Parece una herramienta separada. Es la pantalla que más se aleja.**

**El motivo no es el estilo de sus tarjetas —esas sí son consistentes— sino su *forma*:**

| # | Problema de UX | Efecto |
| :-: | --- | --- |
| **1** | **Es una columna vertical de seis etapas con guía lateral.** Ninguna otra pantalla de AKVEZ tiene esa forma, y **no aparece en APS-04** | Se lee como un documento, no como una pantalla del producto |
| **2** | **Repite la Opportunity View.** Los pasos 04 y 05 son el mismo desglose y el mismo resultado *(reconocido en H-05B §1.2)* | **Dos pantallas que muestran lo mismo con dos formas distintas** |
| **3** | **No está en el inventario oficial de APS-04 §A.3.2** — trece pantallas, ninguna es un «AI Showcase» | Es una pantalla fuera del mapa |
| **4** | **Su acceso está enterrado**: resultados → Opportunity View → botón → Showcase | §7.4: una acción principal visible por pantalla |

**Es la pantalla con mejor material y peor encaje.** Su contenido —dimensiones evaluadas, evidencia, motor del análisis— es exactamente lo que un jurado quiere ver. **Su problema es que compite con la Opportunity View en vez de completarla.**

## 1.3 Executive Dashboard — **¿mantiene la identidad o parece otra aplicación?**

> ### **Mantiene la identidad. Es la más alineada de las tres… y sin embargo es la que incumple la especificación funcional de su propia pantalla.**

**Converge bien:** rejilla de métricas con divisores de 1px, cifras `font-display` dominantes, CTA de marca a ancho completo, estados vacíos declarados.

**Diverge en lo que APS-04 §A.5 dice que un Dashboard es:**

| # | Divergencia | Norma |
| :-: | --- | --- |
| **1** | 🔴 **Resume el espacio de trabajo (`localStorage`), no la Biblioteca** | **P-06: «Resumen de la Biblioteca — total de Leads, distribución por banda, cuántos sin analizar»**. Y §A.3.4 separa ambos de forma vinculante |
| **2** | **Muestra «Analizados»; la norma pide «cuántos sin analizar»** | P-06. Es el complemento, pero **la norma nombra la carencia**, que es lo accionable |
| **3** | **Reutiliza `LeadCard` completa** (355 líneas de detalle) en «Últimos negocios» | §A.5 P-06: «Abrir un Lead reciente» — un **acceso directo**, no la ficha entera |
| **4** | **El embudo de cuatro tramos no existe en APS-04** | §22 regla 4: todo componente nuevo se documenta antes de construirse |

**El punto 1 es el más serio de toda la auditoría:** no es un desajuste estético, es que **el Dashboard responde a la pregunta equivocada**. APS-04 §A.3.4 lo fija: Workspace = *«¿qué encontró en esta búsqueda?»*; Dashboard = *«¿por dónde sigo hoy?»*, **sobre la Biblioteca**.

---

# 2. Hallazgos transversales, medidos

**No son impresiones: son recuentos sobre los 12 ficheros de H-04, H-05 y H-06.**

| # | Hallazgo | Medida | Norma |
| :-: | --- | :-: | --- |
| **F-1** | 🔴 **Los nombres de los tokens mienten.** `accent-green` contiene **naranja**; `secondary-orange` contiene **violeta** | **Usados >150 veces en el código nuevo** | §22 regla 3 · §27 items 1-2 |
| **F-2** | 🔴 **El violeta se usa al revés.** Está reservado a análisis/IA/confianza y hoy solo viste el impacto financiero; **todo lo de IA es naranja** | 3 usos de violeta frente a >100 de naranja | **§11.1 · §18 (barra de progreso)** |
| **F-3** | **Cuatro naranjas conviven** en el producto: `#F97316` *(norma)*, `#ff7a00` *(token)*, `#E28A5D` *(12 usos)*, `#ff6b35` | **12 + 2 hex sueltos** heredados | §27 item 5 · §22 regla 1 |
| **F-4** | **Colores semánticos sin tokenizar** — `amber`, `red` y `rose` crudos de Tailwind | **16 usos** en pantallas nuevas | §11 · §27 items 3-4 |
| **F-5** | **Radios contra especificación**: botones y chips deben ser `radius-full` | **40 `rounded-2xl` · 12 `rounded-xl` · 6 `rounded-md`** frente a 12 `rounded-full` | §13 · §18 |
| **F-6** | **Espaciados fuera de escala** — utilidades `.5` (10px, 14px, 22px…) | **39 usos** | §12.1: base 4px, múltiplos de 8 |
| **F-7** | **Iconos por debajo del mínimo** — 14px y 12px | **16 usos** frente a 24 correctos de 16px | §17.1: 16px o 20px |
| **F-8** | **No existe panel lateral de aplicación** | La navegación es por pestañas superiores | §15: «panel lateral fijo (~280-300px) + contenido fluido» |
| **F-9** | **Ancho máximo 1280px** (`max-w-7xl`) | 3 usos en `App.tsx` | §15: recomendado **1440px** |
| **F-10** | **Motion fuera de tokens**: 300/500/700/1100 ms con `cubic-bezier(0.22,1,0.36,1)` | 3 animaciones propias | §20: 120/200/**320 ms**, easing `(0.4,0,0.2,1)` |
| **F-11** | **Tres pantallas nuevas no están en APS-04** — AI Showcase, Executive Dashboard, embudo | — | §22 regla 4 · §A.3.2 |

## 2.1 El hallazgo con mejor relación impacto/esfuerzo

> ### **F-2 — el violeta.**
>
> **APS-04 asigna al violeta `#8B5CF6` un papel preciso: «Análisis/IA, iconos de insight, barra de confianza, filtros seleccionados».** El naranja es marca y acción; el violeta es inteligencia.
>
> **AKVEZ colapsó los dos en naranja.** El resultado es una interfaz monocroma donde el Score, el botón de buscar, la confianza, la cobertura, los iconos de análisis y las seis barras de categoría **tienen el mismo color** — y por tanto la misma jerarquía.
>
> **Es exactamente por eso que las pantallas «no se parecen al Dashboard oficial» aunque usen los mismos tokens.** No falta un componente: falta el segundo color haciendo su trabajo.
>
> **Y es la corrección más barata del plan:** cambiar la clase de acento en los bloques de análisis. Ni un componente reconstruido.

---

# 3. Qué conservar

**Lo que ya converge y no debe tocarse en H-06C.**

| Elemento | Por qué se conserva |
| --- | --- |
| **Superficie oscura, borde de 1px, jerarquía por color de fondo** | §14: «la jerarquía se logra por diferencia de color de fondo y borde sutil, no por sombra» — **ya se cumple** |
| **`font-display` para cifras y títulos, `font-sans` para cuerpo** | §9.3 — correcto en las cuatro pantallas |
| **`tabular-nums` en todas las cifras** | §9.2, línea «Numérico tabular» — **ya implementado** |
| **Iconografía exclusivamente Lucide** | §22 regla 5 — cero mezcla de librerías |
| **Estados vacíos declarados con texto explicativo** | §7.5 y §19 (Loading, Error, Vacío) — **es el punto más fuerte de la implementación** |
| **`motion-safe:` en todas las animaciones** | §21 accesibilidad |
| **Labels en versalitas con tracking amplio** | §9.3 |
| **`ScoreCategoryCard`, `FactorInventory`, `LeadCard`, `ScoreBreakdown`** | Componentes sanos. **H-06C los re-viste, no los reescribe** |

---

# 4. Qué mover

| # | Qué | De → a | Motivo |
| :-: | --- | --- | --- |
| **1** | **El contenido del AI Showcase** | Pantalla propia → **integrado en la Opportunity View** | §1.2: hoy compite en vez de completar. Los pasos 01-03 y 06 son valiosos; 04-05 ya están en la Opportunity View |
| **2** | **La fuente del Dashboard** | `localStorage` del workspace → **la Biblioteca** *(`leadLibraryApi`, ya existe)* | **P-06** · §A.3.4 |
| **3** | **El acceso al proceso de análisis** | Botón enterrado tras la Opportunity View → **sección dentro de ella** | §7.4 |
| **4** | **Los hex sueltos de `App.tsx`** | Componentes → **tokens de `index.css`** | §22 regla 1 |
| **5** | **El CTA del Dashboard** | *(ya está en el Hero — **se conserva**)* | §7.4: acción principal siempre visible |

---

# 5. Qué eliminar

| # | Qué | Motivo |
| :-: | --- | --- |
| **1** | **El AI Showcase como pantalla independiente** | §A.3.2: no está en el inventario oficial. Su contenido se conserva; su **condición de pantalla** no |
| **2** | **La duplicación de los pasos 04-05** | Reconocida en H-05B §1.2. El desglose se enseña **una vez** |
| **3** | **`animate-fade-in` / `animate-fadeIn` muertas** | 6 usos restantes en `lead-hunter/`, sin definir desde siempre |
| **4** | **`#E28A5D`, `#D37B4F`, `#ff6b35`** | §27 item 5: cuatro naranjas donde debe haber uno |
| **5** | **Las utilidades de espaciado `.5` entre bloques** | §12.1: 4px y 12px son «ajustes finos dentro de un mismo componente», **nunca separación de bloques** |
| **6** | **`LeadCard` completa en el Dashboard** | P-06 pide **acceso directo**, no la ficha entera. Sustituir por una fila compacta |

---

# 6. Qué unificar

| # | Qué | Cómo |
| :-: | --- | --- |
| **1** | 🔴 **La semántica del color** | **Naranja = marca y acción. Violeta = análisis, IA, confianza, cobertura.** Una regla, aplicada en las cuatro pantallas |
| **2** | **Los nombres de los tokens** | `accent-green` → `brand-primary` · `secondary-orange` → `brand-secondary`, más los cuatro semánticos que faltan |
| **3** | **Los radios** | Botones, chips y badges → `radius-full`. Tarjetas → `radius-lg`/`radius-xl`. **Dos reglas, sin excepciones** |
| **4** | **Los encabezados de sección** | Hoy hay **tres** patrones distintos: `Section` de la Opportunity View, `Stage` del Showcase y `NarrativeStep` del Pitch. **Uno solo** |
| **5** | **Las tarjetas de métrica** | `MetricTile` *(Dashboard)*, `HeroStat` *(Opportunity)* y `Fact` *(Showcase)* hacen lo mismo. **Un componente** |
| **6** | **Los estados vacíos** | `AbsentData`, `Unavailable`, `EmptyPanel` y `EmptyState` son **cuatro implementaciones del mismo patrón** |
| **7** | **El motion** | Tres duraciones propias → los tres tokens de §20 |

> **Los puntos 4, 5 y 6 son deuda que yo mismo introduje** al construir cuatro pantallas en sprints consecutivos sin un componente base común. **Trece componentes locales donde APS-04 §18 pide un sistema.**

---

# 7. Qué simplificar

| # | Qué | Cómo |
| :-: | --- | --- |
| **1** | **La Opportunity View: 6 secciones** | Absorbe el Showcase → riesgo de crecer. **Plegar «Qué falta medir» y el desglose por defecto** |
| **2** | **El Dashboard: 5 secciones + CTA** | La actividad y el embudo dicen casi lo mismo con dos formas. **Fundir en una sola lectura del embudo** |
| **3** | **La densidad de `ScoreCategoryCard`** | Seis campos por tarjeta × 6 tarjetas. §7.3: «densidad sin ruido» — **mover `rationale` a revelado** |
| **4** | **El anillo del Score** | No está en §18. **Simplificar a cifra Display + banda**, salvo que la imagen oficial lo confirme |
| **5** | **La navegación: 4 pestañas** | Si el Showcase se integra, **vuelven a 3** |

---

# 8. Plan H-06C — Alineación Visual

> **Principio rector: converger, no reconstruir.** Ningún componente se reescribe. **Cinco de las siete fases son cambios de clase y de token.**

## 8.1 Fases

| Fase | Qué | Ficheros | Riesgo | ¿Bloqueada? |
| :-: | --- | :-: | :-: | :-: |
| **C-1** | **Capa de tokens.** Renombrar los dos tokens mentirosos y añadir los que faltan: `surface-elevated`, `border-strong`, `text-tertiary`, `success`, `warning`, `error`, `info`, radios, motion | `index.css` **+ renombrado mecánico** | 🟡 Medio *(alcance amplio, cambio trivial)* | ❌ No |
| **C-2** | 🔴 **Semántica del color.** Violeta a análisis, IA, confianza, cobertura y barras de categoría | ~8 ficheros | 🟢 Bajo | ❌ No |
| **C-3** | **Radios y espaciado.** `radius-full` en botones y chips; retirar las 39 utilidades `.5` de nivel bloque | ~12 ficheros | 🟢 Bajo | ❌ No |
| **C-4** | **Escala tipográfica.** Score a 56-64px; H1 a 28-32px; iconos a 16/20px | ~10 ficheros | 🟢 Bajo | ❌ No |
| **C-5** | **Unificación de componentes.** Un encabezado de sección, una tarjeta de métrica, un estado vacío | **−3 ficheros netos** | 🟡 Medio | ❌ No |
| **C-6** | **Integrar el AI Showcase** en la Opportunity View y retirar la cuarta pestaña | 3 ficheros | 🔴 **Alto** — cambia la navegación | ⚠️ **Requiere tu decisión** |
| **C-7** | **Dashboard sobre la Biblioteca** + acceso directo en vez de `LeadCard` | 2 ficheros | 🔴 **Alto** — cambia la fuente de datos | ⚠️ **Requiere tu decisión** |
| **C-8** | **Estructura**: panel lateral, ancho 1440px, header | `App.tsx` | 🔴 Alto | 🔴 **Bloqueada: exige la imagen** |

## 8.2 Orden recomendado

> **C-1 → C-2 → C-3 → C-4** en una sola tanda. **Son el 80 % del efecto visual con el 20 % del riesgo**, y ninguna necesita la imagen ni una decisión de producto.
>
> **C-5** después, como limpieza.
>
> **C-6, C-7 y C-8 son decisiones tuyas, no mías:** cambian navegación, fuente de datos y estructura de aplicación.

## 8.3 Lo que no hará H-06C

- **No reescribir `ScoreCategoryCard`, `FactorInventory`, `LeadCard`, `ScoreBreakdown` ni `PitchOutput`.** Se re-visten.
- **No introducir librerías.** `motion` sigue sin usarse.
- **No tocar backend, DTOs, dominio ni Blueprint.**
- **No implementar componentes marcados «Pendiente» en APS-04 §18.1** sin documentarlos antes *(§22 regla 4)*.

---

# 9. Tres decisiones que necesito de ti

| # | Decisión | Impacto |
| :-: | --- | --- |
| **1** | 🔴 **¿Me pasas la imagen oficial?** | Desbloquea C-8 y las siete preguntas de §0.2 |
| **2** | **¿El AI Showcase se integra en la Opportunity View** *(C-6)*, o se conserva como pantalla propia asumiendo que está fuera de APS-04 §A.3.2? | Navegación y duplicación |
| **3** | **¿El Dashboard pasa a leer la Biblioteca** *(C-7)*, como exige P-06? | **Es el incumplimiento normativo más serio de la auditoría** |

> **Conforme al encargo, no he escrito una línea de código.** Con tu respuesta a la 1, o con la autorización de C-1 a C-5, H-06C arranca.

---

# 10. Referencias

**Norma:** **APS-04 — Human Interface System** §A.3.2, §A.3.4, §A.5 (P-06, P-07, P-09), §A.9 (UI-1 a UI-10), §7, §9.2-9.4, §10, §11, §12, §13, §14, §15, §16, §17, §18, §19, §20, §21, §22, §26, §27.

**Código auditado:** `src/index.css` · `src/App.tsx` · `modules/lead-hunter/presentation/{OpportunityView,AIShowcase}.tsx` · `.../components/{OpportunityHero,ExecutiveSummary,ScoreCategoryCard,FactorInventory,LeadCard}.tsx` · `modules/pitch-generator/presentation/{PitchGenerator}.tsx` · `.../components/{NarrativeStep,PitchOutput,DesignerSignaturePanel}.tsx` · `modules/dashboard/presentation/{ExecutiveDashboard}.tsx` · `.../components/{FunnelStage,SystemStatus}.tsx` · `shared/components/ScoreBreakdown.tsx`.

**Documentos:** H-04 Fase 1 · H-04 Fase 2 · H-05A · H-05B · H-06 · H-05A — Checklist de Demo.
