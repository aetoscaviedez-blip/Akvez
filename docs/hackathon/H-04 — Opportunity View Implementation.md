# H-04 — Opportunity View Implementation

| Campo | Valor |
| --- | --- |
| Documento | **H-04 — Opportunity View Implementation** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Fase 1 implementada y validada** |
| Fecha | 2026-08-05 |
| Sprint | **H-04 — Demo Experience (Fase 1)** |
| Antecedentes | H-03-F2 *(publicó el `breakdown` que esta pantalla consume)* · H-02C · AKVEZ-HACKATHON-ROADMAP §5 *(H-02 tarea 2.2)* |

> **Solo frontend.** No se ha tocado `server/`, ni dominio, ni lógica de negocio, ni prompts, ni Opportunity Score, ni Gemini, ni Places, ni el Blueprint, ni ningún DTO.

---

# 1. Qué se construyó

**La Opportunity View: una pantalla de detalle dedicada a un solo negocio**, que responde *«¿por qué este negocio puntúa lo que puntúa?»* con el desglose completo del Score en tarjetas.

**Hasta ahora esa explicación existía plegada dentro de una tarjeta de la lista**, en unos 360 px de ancho, compitiendo con el resto del contenido. **Es la «Pantalla 2» que el roadmap describía en H-02 tarea 2.2 y que nunca llegó a existir como tal.**

## 1.1 Cómo se llega

| Vía | Dónde |
| --- | --- |
| **Clic en el nombre del negocio** | Disponible **siempre**, también si el Lead no trae Evaluación |
| **«Ver cómo se calculó este Score»** | En el bloque de Opportunity Intelligence, solo cuando hay desglose |
| **Volver** | Enlace superior — devuelve a los resultados sin perder la búsqueda |

**Con un Lead abierto, la pantalla se dedica entera a él:** el formulario de búsqueda y la lista se retiran. El desglose necesita el ancho completo para leerse, y en la demo la atención debe estar en un único negocio.

**No se introdujo router.** La conmutación usa la misma técnica que `App` ya emplea para sus pestañas.

## 1.2 Anatomía de la pantalla

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Volver a los resultados                                      │
├─────────────────────────────────────────────────────────────────┤
│  HERO                                                           │
│  [Google Maps] [Sitio web · Sitio web deficiente]               │
│                                                                 │
│  La Fogata Parrilla                            78 /100          │
│  🌐 sitio · 🗺️ Maps · 📞 tel · ⭐4.6 · 312     Oportunidad Alta  │
│  ─────────────────────────────────────────────────────────────  │
│  🛡️ Confianza: media │ 📊 Cobertura: 62% │ 🗂️ WP-01 v1.0        │
└─────────────────────────────────────────────────────────────────┘

  ¿Por qué obtuvo ese Score?
  El Opportunity Score no lo inventa la IA: es determinista y reproducible.

  ┌ Presencia Web ────────┐ ┌ Potencial de Mejora ──┐ ┌ Compatibilidad ───────┐
  │ Peso 25%      +21.62  │ │ Peso 25%      +18.40  │ │ Peso 20%      +14.10  │
  │ ██████████████░░  80  │ │ ████████████░░░░  72  │ │ ███████████░░░░░  68  │
  │ rationale…            │ │ rationale…            │ │ rationale…            │
  │ ✓ Medido: …           │ │ ✓ Medido: …           │ │ ✓ Medido: …           │
  │ − No medible: …       │ │ − No medible: …       │ │ − No medible: …       │
  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘
  ┌ Reputación ───────────┐ ┌ Identidad Digital ────┐ ┌ Información Comercial ┐
  │ Peso 12%          —   │ │ …                     │ │ …                     │
  │ ▨▨▨▨▨▨▨▨  sin medir   │ │                       │ │                       │
  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘

  ┌ Suma de las 6 contribuciones          78.42  ≈  78 ┐

  Análisis del negocio
  [descripción] [Por qué necesita web] [Impacto financiero]
  [Problemas detectados ×3] [Ángulo de oportunidad]

  ┌ ¿Contactamos a La Fogata Parrilla?  → Generar mensaje ┐
```

---

# 2. 🔴 Hallazgo — las categorías del ejemplo del encargo no existen

**El encargo ilustraba las tarjetas con `SEO`, `Redes Sociales`, `Reviews` y `Google Business`.**

> ### **Ninguna de esas cuatro es una categoría del sistema.**

**Las seis reales, transcritas de `weightingProfile.ts` (WP-01 v1.0, APS-08 §7.1):**

| Categoría | Peso |
| --- | :-: |
| **Presencia Web** | **25%** |
| **Potencial de Mejora** | **25%** |
| **Compatibilidad** | **20%** |
| **Reputación** | **12%** |
| **Identidad Digital** | **10%** |
| **Información Comercial** | **8%** |

**Se implementaron las reales.** El encargo dice *«No inventar absolutamente ningún dato. Todo debe salir del breakdown existente»*, y eso rige también sobre su propio ejemplo: la pantalla pinta las categorías que llegan, sean cuales sean, sin lista fija en el frontend.

> **Consecuencia práctica:** si mañana se publica **WP-02** con otras categorías o pesos, **esta pantalla no se toca.**

---

# 3. De dónde sale cada píxel

**Todo procede del `Prospect` que ya estaba en memoria**, mapeado por `prospectMapper` desde `LeadResponseDTO`. **La vista no llama al servidor, no calcula el Score, no deriva métricas y no rellena huecos.**

| En pantalla | Campo | Transformación |
| --- | --- | --- |
| Nombre, web, teléfono, Maps, ⭐, reseñas, fuente | `name` `website` `phone` `googleMapsUrl` `rating` `reviewCount` `source` | **Ninguna** |
| **Opportunity Score** | `score` | **Ninguna** |
| **Banda** | `band` | **Ninguna** |
| **Classification** | `classification` | **Ninguna** — rotulada «Sitio web · …», §5.2 |
| **Confidence** | `confidence` | **Ninguna** |
| **Coverage** | `coverage` | `×100` — **cambio de unidad**, la proporción 0-1 se muestra en % |
| **Perfil de Ponderación** | `scoreVersion` | **Ninguna** |
| Título de tarjeta · «Peso N%» | `category` · `weight` | **Ninguna** |
| **Barra** y «N/100» | `partialScore` | **Ninguna** — §5.1 |
| **«+N»** | `contribution` | `toFixed(2)` — **formato** |
| Texto explicativo | `rationale` | **Ninguna** |
| «Medido» / «No medible» | `measuredFactors` · `unmeasuredFactors` | `join(" · ")` |
| Análisis, problemas, ángulo, impacto | `description` `flaws` `angle` `revenueLoss` `whyWebsiteNeeded` | **Ninguna** |

**Única operación aritmética de toda la pantalla:** la **suma de contribuciones** del pie del desglose. No produce información nueva — **reconstruye el Score ya recibido** y hace visible la Reproducibilidad de **ADR-14 §6.3**. Es la misma suma que `shared/components/ScoreBreakdown` ya hacía.

---

# 4. Checklist visual de mejoras

## 4.1 Jerarquía y espacio

- [x] **Vista de detalle dedicada** — el negocio deja de competir con un formulario de búsqueda y otras cuatro tarjetas
- [x] **Score a 72 px** (`text-7xl`), con `/100` como unidad tenue al lado — el número es el ancla visual de la pantalla
- [x] **Nombre del negocio a 48 px** con `leading-[1.1]` y `tracking-tight` — escala editorial, no de formulario
- [x] **Ritmo vertical uniforme** — `space-y-10` entre secciones, `p-8/p-10` dentro de los contenedores
- [x] **Tres niveles tipográficos claros**: título de sección → etiqueta en versalitas `tracking-widest` → cuerpo
- [x] **Cifras con `tabular-nums`** — las columnas de números no bailan al cambiar de Lead

## 4.2 El desglose como producto

- [x] **Una tarjeta por categoría**, en rejilla de **1 / 2 / 3 columnas** según el ancho
- [x] **Barra de progreso por categoría** con pista y relleno redondeados
- [x] **Contribución como cifra destacada** (`text-2xl font-black`), no como texto corrido
- [x] **Peso en chip monoespaciado** — dato de perfil, se lee como dato
- [x] **Factores medidos / no medibles con iconografía distinta** (✓ acento · − apagado)
- [x] **Pie de reconstrucción** que muestra `Σ contribuciones ≈ Score`

## 4.3 Superficie y color

- [x] **Halo difuso** en el hero (`blur-3xl`) — profundidad sin peso visual; **no codifica ningún dato**
- [x] **Franja de calidad del análisis** en tres celdas divididas, con icono en contenedor propio
- [x] **Bordes que responden al puntero** — `hover:border-accent-green/35` con transición de 300 ms
- [x] **Radios coherentes** — `rounded-3xl` contenedores, `rounded-2xl` tarjetas, `rounded-lg` chips
- [x] **Un solo acento** en toda la pantalla; el segundo color queda para el impacto financiero
- [x] **Cero colores nuevos** — únicamente los tokens de `@theme` ya definidos

## 4.4 Movimiento

- [x] **Entrada ascendente** de la vista y de cada tarjeta (`ak-rise`, 0,5 s, `cubic-bezier(0.22,1,0.36,1)`)
- [x] **Cascada escalonada** de 60 ms por tarjeta, acotada a 8
- [x] **Crecimiento de barras** desde el borde izquierdo (`ak-bar`, 0,7 s), **animando `scaleX`, nunca el ancho** — el ancho *es* el dato
- [x] **Micro-movimiento en los enlaces** — la flecha se desplaza 2 px al pasar el puntero
- [x] 🔴 **Todo bajo `motion-safe:`** — quien pidió movimiento reducido ve la pantalla completa, sin animar. **Verificado en el CSS compilado**
- [x] **Ninguna librería nueva** — `motion` sigue instalado y sin usar, igual que antes

## 4.5 Honestidad visual — lo que la pantalla **no** hace

- [x] **`partialScore === null` no pinta barra llena ni vacía**: pista rayada y «sin medir». Una barra a cero afirmaría «puntuó 0», que es otra cosa **(R-38)**
- [x] **Sin Score se rinde «—»**, nunca un número de relleno
- [x] **Sin desglose se explica por qué no lo hay**, en vez de una rejilla vacía
- [x] **Sin ángulo se declara**, no se inventa uno
- [x] **Lista de problemas vacía se declara** como resultado del análisis
- [x] **`isDemo` se rotula** también en esta pantalla — un dato de ejemplo no puede confundirse con un resultado real
- [x] **Ausencia de sitio web declarada** como hecho comercial, no como hueco

---

# 5. Dos decisiones de diseño que merecen justificarse

## 5.1 La barra mide `partialScore`, no `contribution`

**`contribution` no tiene tope fijo.** Vale `(weight × partialScore) / evaluatedWeight`, donde `evaluatedWeight` es la suma de los pesos que **sí** se pudieron medir. Si solo puntúa una categoría, **su contribución es el Score entero**.

> **Una barra proporcional a la contribución necesitaría un máximo inventado.** El componente anterior usa `contribution / 25` —25 es el peso máximo de WP-01— y **se satura cuando la cobertura es parcial**.
>
> **`partialScore` está acotado a 0-100 por definición.** Con él, la barra responde a *«¿qué tal puntuó esta categoría?»* y el número a *«¿cuántos puntos aportó?»*. **Dos preguntas distintas, cada una con su dato real y ningún máximo fabricado.**

## 5.2 `classification` se rotula «Sitio web · …»

**`classification` es el estado del sitio web** —*Sin sitio web · Sitio web deficiente · Sitio web básico*—, **no la banda del Opportunity Score**. La banda es `band`, y tiene su lugar junto al número.

El propio backend advierte la distinción, y `LeadCard` ya la había sufrido: mostraba `classification` bajo el rótulo «Lead Score». **Aquí se rotula con su significado real** para que no vuelva a leerse como una calificación comercial.

---

# 6. Archivos

| # | Archivo | Cambio | Líneas aprox. |
| :-: | --- | --- | :-: |
| **1** | `src/modules/lead-hunter/presentation/OpportunityView.tsx` | 🟢 **Creado** — la pantalla | **~400** |
| **2** | `src/modules/lead-hunter/presentation/components/ScoreCategoryCard.tsx` | 🟢 **Creado** — tarjeta de categoría | **~150** |
| **3** | `src/modules/lead-hunter/presentation/LeadHunter.tsx` | 🟡 Modificado — estado de apertura y conmutación | **+35** |
| **4** | `src/modules/lead-hunter/presentation/components/LeadCard.tsx` | 🟡 Modificado — dos accesos a la vista; se retira el desglose en línea | **+20 / −12** |
| **5** | `src/index.css` | 🟡 Modificado — dos animaciones con prefijo `ak-` | **+22** |
| **6** | `docs/hackathon/H-04 — Opportunity View Implementation.md` | 🟢 **Creado** — este documento | — |

**Backend: cero ficheros tocados.**

## 6.1 Lo único que se retiró

**El desglose plegable dentro de `LeadCard`.** El botón «Ver cómo se calculó este Score» **sigue existiendo y sigue llevando al mismo contenido** — ahora abre la Opportunity View en lugar de desplegar 55 px de tarjeta.

> **No se pierde nada y no se duplica nada.** `shared/components/ScoreBreakdown` **sigue intacto** al servicio de la Biblioteca. Mantener además el desplegable habría dejado **dos presentaciones del mismo desglose**, que es exactamente lo que el encargo prohíbe.

---

# 7. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** · 26 ficheros |
| `npm run build` | ✅ **Compila** — CSS 38,28 → **46,85 kB**, JS 282,24 → **297,78 kB** |
| Animaciones en el CSS compilado | ✅ `ak-rise`, `ak-bar` y **`prefers-reduced-motion`** presentes |

## 7.1 Verificación de render

**Sin navegador disponible en el entorno, la pantalla se renderizó en Node con `react-dom/server`** —script desechable, ejecutado y eliminado; no queda en el repositorio— **contra dos Leads sintéticos que ejercitan ambas ramas**:

| Rama | Comprobación | Resultado |
| --- | --- | :-: |
| **Lead evaluado** | Score `78`, banda, confianza, `62% medidos`, `WP-01 v1.0`, categoría, `+21.62`, `80/100`, `sin medir` | ✅ **Los 10 valores presentes** |
| **Lead sin evaluar** | Rinde `—`, rinde «aún no tiene Evaluación» | ✅ |
| **Lead sin evaluar** | **No aparece ningún `0/100`** | ✅ **No fabrica ceros** |

> **La tercera comprobación es la que importa:** confirma por ejecución que la ausencia se representa como ausencia.

## 7.2 🔴 Lo que no pudo verificarse

**No hay extensión de navegador conectada en este entorno**, de modo que:

| Sin verificar | Consecuencia |
| --- | --- |
| **Aspecto real en pantalla** | Tipografías, espaciado y color están razonados, **no vistos** |
| **Animaciones en movimiento** | Compiladas y correctas en CSS, **no observadas** |
| **Comportamiento responsive real** | Las rejillas declaran 1/2/3 columnas; **no se probó ningún ancho** |
| **Capturas** *(entregable 3)* | **No aplica — no se pudieron tomar** |

> **Es la revisión pendiente antes de la demo.** Basta con `npm run dev` y abrir un negocio; si quieres, lo levanto y lo recorremos.

---

# 8. Datos que **no** llegan al frontend

> Conforme al encargo: *«Si algún dato necesario no llega al frontend: documentarlo. No inventarlo.»*

| # | Dato | Estado | Impacto en esta pantalla |
| :-: | --- | --- | --- |
| **1** | **`usedFallbackAnalysis` por Lead** | 🔴 **No cruza el DTO.** Solo llega el agregado `metadata.usedFallbackEngine`, de toda la lista | **La Opportunity View no puede decir si *este* negocio lo analizó la IA o el respaldo.** El aviso vive en la lista, y al abrir un negocio **se pierde de vista**. Es la brecha más relevante |
| **2** | **`calculatedAt`** | 🟢 **Sí llega** y se mapea | **No se muestra**: la marca temporal de emisión aportaba ruido junto a la versión del perfil. Disponible sin coste si se quiere |
| **3** | **`measuredFactors` / `unmeasuredFactors`** | 🟢 **Llegan** | ✅ Se muestran |
| **4** | **Métricas de ejecución** *(consultas, tiempos, modelo)* | 🔴 **No cruzan** | **Bloqueadas en H-03B** — sin relación con esta pantalla |

> **El punto 1 no se resolvió aquí:** exigiría ampliar `LeadResponseDTO`, que este sprint prohíbe expresamente *(«NO modificar DTO»)*. **Se documenta y se propone**, §10.

---

# 9. Riesgos

| # | Riesgo | Prob. | Impacto | Nota |
| :-: | --- | :-: | :-: | --- |
| **R-1** | **El aspecto no se ha visto.** Todo el diseño está razonado sobre el código, no observado | 🔴 **Alta** | 🟡 Medio | **Requiere una pasada visual antes de la demo** — §7.2 |
| **R-2** | **Un Lead con las 6 categorías sin medir** rinde seis tarjetas rayadas seguidas: correcto, pero visualmente pobre | 🟢 Baja | 🟢 Bajo | Es el estado honesto. Se acepta |
| **R-3** | **Los Leads de ejemplo de `App.tsx` no traen `breakdown`**: abrir uno muestra el estado «sin desglose» | 🔴 **Alta** | 🟡 **Medio en demo** | **Al abrir la demo sin buscar, la pantalla estrella se ve vacía.** Hay que **hacer una búsqueda real antes de enseñarla** |
| **R-4** | **`rationale` es texto del dominio de longitud libre**; una explicación larga desequilibra su tarjeta | 🟡 Media | 🟢 Bajo | Las tarjetas son de altura libre; la rejilla lo absorbe |
| **R-5** | **La Biblioteca no se rediseñó** y sigue con el desglose anterior: dos estéticas para el mismo dato | 🔴 Alta | 🟡 Medio | **Fuera del alcance de esta fase.** §10 |

---

# 10. Hallazgos y propuestas — **no implementados**

| # | Hallazgo | Propuesta | Coste |
| :-: | --- | --- | :-: |
| **1** | **`animate-fade-in` es una clase muerta.** Se usa en **`LeadHunter.tsx` (3 veces)** y **nunca se define**: Tailwind 4 no la trae y `@theme` no la declara. **Esas tres animaciones no ocurren hoy** | Declarar `--animate-fade-in` junto a las nuevas | **4 líneas** |
| **2** | **Comentario obsoleto en `src/shared/types/index.ts:104-111`**: afirma que `band` *«hoy no llega por la ruta de búsqueda»*. **H-03-F2 lo publicó** y `prospectMapper.ts:77` lo mapea. La pantalla nueva lo demuestra | Corregir el comentario | **4 líneas** |
| **3** | **Origen del análisis por Lead** *(§8, punto 1)* | Mapear `usedFallbackAnalysis` al DTO y rendir un distintivo en el hero | **DTO + mapper + UI** — requiere decisión, ADR-06 |
| **4** | **La Biblioteca conserva la estética anterior** | Reutilizar `ScoreCategoryCard` en `LeadLibrary` | **~30 líneas** |
| **5** | **`calculatedAt` llega y no se usa** | Mostrarlo junto al Perfil de Ponderación | **~5 líneas** |

> **Ninguno se implementó.** Los cinco caen fuera de «Opportunity View», y el encargo pide construir esa pantalla, no barrer el frontend. **El 1 y el 2 son triviales y de riesgo nulo**; el **4** es el que más subiría la percepción de producto terminado en la Fase 2.

---

# 11. Verificación de las restricciones del encargo

| Restricción | Estado |
| --- | :-: |
| No modificar Blueprint · dominio · lógica de negocio · prompts · Opportunity Score · Gemini · Places | ✅ **Cumplida** — `server/` sin tocar |
| **Solo frontend** | ✅ **Cumplida** — 5 ficheros, todos en `src/` |
| **NO crear lógica** | ✅ Solo estado de navegación (`openedLeadId`) |
| **NO duplicar datos** | ✅ El desglose en línea se retira al crearse la vista dedicada |
| **NO recalcular Score** | ✅ Única suma: la reconstrucción de ADR-14 §6.3, ya existente |
| **NO modificar DTO** | ✅ **Ningún contrato tocado** |
| **No introducir librerías nuevas** | ✅ **Cero dependencias añadidas** — `lucide-react` y Tailwind ya estaban |
| **No inventar ningún dato** | ✅ §3 — incluida la corrección de las categorías del propio ejemplo, §2 |

---

# 12. Referencias

**Código creado:** `src/modules/lead-hunter/presentation/OpportunityView.tsx` · `src/modules/lead-hunter/presentation/components/ScoreCategoryCard.tsx`.

**Código modificado:** `src/modules/lead-hunter/presentation/LeadHunter.tsx` · `src/modules/lead-hunter/presentation/components/LeadCard.tsx` · `src/index.css`.

**Código consultado, no tocado:** `server/modules/lead-analyzer/domain/weightingProfile.ts` *(WP-01, categorías y pesos)* · `server/modules/lead-analyzer/domain/opportunityScore.ts:103-115,325-375` *(bandas, `contribution`, `coverage`, `confidence`)* · `server/shared/contracts/opportunityScore.ts:43-64` · `src/shared/types/index.ts` · `src/modules/lead-hunter/domain/prospectMapper.ts:72-82` · `src/shared/components/ScoreBreakdown.tsx`.

**Blueprint:** APS-08 §6, §7.1, §8, §9, §11 · ADR-14 §6.3, §7.1 · DEV-00 R-38, R-45, R-48.

**Documentos:** H-03-F2 — Score Exposure Implementation · H-02C — Fallback Visibility Audit · H-03B — AI Showcase DTO Implementation Audit · AKVEZ-HACKATHON-ROADMAP §5 (H-02 tarea 2.2).
