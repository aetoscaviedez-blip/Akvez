# H-04 Fase 2 — Opportunity View Premium

| Campo | Valor |
| --- | --- |
| Documento | **H-04 Fase 2 — Opportunity View Premium** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y validado** · ⏸️ **Detenido a la espera de revisión** |
| Fecha | 2026-08-05 |
| Sprint | **H-04 Fase 2 — Demo Experience** |
| Relación | **Sustituye la descripción estructural de H-04 Fase 1 §1.2.** El resto de aquel documento sigue vigente |

> **Solo UI.** No se tocó `server/`, ni `domain/`, ni `application/`, ni `infrastructure/`, ni prompts, ni Blueprint, ni Docker, ni Cloud Run, ni DTOs, ni contratos, ni APIs.

---

# 1. Archivos

| # | Archivo | Cambio | Líneas |
| :-: | --- | --- | :-: |
| **1** | `src/modules/lead-hunter/presentation/OpportunityView.tsx` | 🔵 **Reescrito** — composición en 6 secciones | **~430** |
| **2** | `src/modules/lead-hunter/presentation/components/OpportunityHero.tsx` | 🟢 **Creado** — Hero Card con anillo de Score | **~270** |
| **3** | `src/modules/lead-hunter/presentation/components/ExecutiveSummary.tsx` | 🟢 **Creado** — resumen ejecutivo | **~290** |
| **4** | `src/modules/lead-hunter/presentation/components/FactorInventory.tsx` | 🟢 **Creado** — inventario de factores, reutilizado por dos secciones | **~110** |
| **5** | `src/modules/lead-hunter/presentation/components/ScoreCategoryCard.tsx` | 🟡 Modificado — dos cifras separadas, estado «sin medir» reforzado | **~135** |
| **6** | `src/index.css` | 🟡 Modificado — animación `ak-ring` | **+12** |
| **7** | `docs/hackathon/H-04 Fase 2 — Opportunity View Premium.md` | 🟢 **Creado** — este documento | — |

**`LeadHunter.tsx` y `LeadCard.tsx` no se tocaron:** la vista conserva la misma firma de props que en Fase 1, de modo que el cableado existente sigue sirviendo.

**Cero dependencias nuevas.** `motion` sigue instalado y sin usar, igual que antes.

---

# 2. Resumen técnico

## 2.1 Estructura, en el orden pedido

| # | Sección | Componente | Fuente de datos |
| :-: | --- | --- | --- |
| **1** | **Hero Card** | `OpportunityHero` | `name` `website` `phone` `googleMapsUrl` `rating` `reviewCount` `source` `classification` `isDemo` `score` `band` `coverage` `confidence` `scoreVersion` |
| **2** | **Resumen ejecutivo** | `ExecutiveSummary` | `breakdown` `coverage` `confidence` `scoreVersion` |
| **3** | **¿Por qué obtuvo ese Score?** | `ScoreCategoryCard` ×N | `breakdown` |
| **4** | **Qué encontró AKVEZ** | `FactorInventory` + paneles | `measuredFactors` · `description` `flaws` `whyWebsiteNeeded` `revenueLoss` |
| **5** | **Qué falta medir** | `FactorInventory` | `unmeasuredFactors` |
| **6** | **Próximos pasos** | — | `angle` |

**Cobertura y confianza no tienen sección propia:** aparecen **dos veces y con papeles distintos** —cifra en el Hero, explicación con recuentos en el resumen ejecutivo— en lugar de repetirse una tercera vez al final.

## 2.2 El Hero Card

**Anillo SVG** de circunferencia fija que representa **el mismo `score` impreso en su centro**, sobre la escala 0-100 que es la del propio Score. **No introduce ninguna magnitud nueva y no se dibuja sin puntuación.**

Se anima con `ak-ring`, un keyframe que recorre `stroke-dashoffset` entre dos variables CSS que fija el componente: **el CSS no conoce ningún número.**

**Franja inferior en tres celdas:** Cobertura *(con barra)* · Confianza · Estado del análisis *(con la versión del Perfil)*.

## 2.3 El resumen ejecutivo — **ni una palabra generada**

**No hay IA, ni plantillas de prosa, ni adjetivos sobre el negocio.** El resumen **selecciona y ordena** entradas del `breakdown` que ya se muestran íntegras más abajo, y enseña sus cifras. Todo texto fijo describe **la métrica**, nunca al negocio concreto.

**Las tres agregaciones, y por qué no son métricas nuevas:**

| Se muestra | Cómo se obtiene | Equivalencia en el dominio |
| --- | --- | --- |
| «8 de 14 factores medidos» | Suma de longitudes de `measuredFactors` y `unmeasuredFactors` | **Es `coverage` en recuento** — `opportunityScore.ts:353-357` lo define igual |
| «Peso evaluado: 100 de 100» | Suma de `weight` de las categorías con `partialScore` | **Es `evaluatedWeight`** — `opportunityScore.ts:329-332`, misma definición |
| Orden de las señales | `sort` por `contribution` | Reordena una copia de lo ya mostrado |

> **Ninguna produce un valor que el dominio no calcule ya con esa misma definición**, de modo que **no pueden divergir del Score publicado.**

## 2.4 Animaciones

| Nombre | Qué anima | Dónde |
| --- | --- | --- |
| `ak-rise` | Opacidad + 12 px de desplazamiento, 0,5 s | Hero, casillas, tarjetas — en cascada de 45-55 ms |
| `ak-bar` | `scaleX` desde el borde izquierdo, 0,7 s | Barras de categoría, cobertura, señales |
| `ak-ring` | `stroke-dashoffset`, 1,1 s | Anillo del Score |

**Las tres bajo `motion-safe:`** — verificado en el CSS compilado: `prefers-reduced-motion` está presente. **Las barras animan `scaleX`, nunca el ancho: el ancho *es* el dato.**

---

# 3. ⚠️ Dos decisiones que cambian lo que la pantalla dice

## 3.1 «Fortalezas» y «debilidades» son **de la oportunidad**, no del negocio

`opportunityScore.ts:7-12` lo declara en su cabecera:

> *«**Oportunidad comercial para este usuario, no calidad del negocio.** […] una web ausente **sube** el Score: es un hallazgo, no una carencia.»*

> ### **Llamar «fortaleza del negocio» a una puntuación alta en Presencia Web habría invertido el significado del dato:** esa puntuación es alta **precisamente cuando el negocio no tiene sitio propio**.
>
> **Ante un jurado, ese error es caro**: bastaría una pregunta —*«¿entonces el 100 en Presencia Web significa que su web es excelente?»*— para desmontar la pantalla.

**Las casillas se titulan «Señales que más aportan» y «Señales que menos aportan»**, con el subtítulo *«Categorías que más puntos suman al Score»*. **Se ordena por `contribution`**, que es lo que efectivamente construye la puntuación, y cada señal muestra además su `partialScore` y su `weight` para que el orden sea verificable.

**Y la pantalla lo explica en una línea, bajo el título del resumen:** *«Un Score alto mide oportunidad comercial para ti, no calidad del negocio»*. **Es la frase que convierte un número raro en un argumento fuerte.**

## 3.2 El Hero **no declara** si el análisis lo hizo la IA o el respaldo

**Ese dato existe por Lead en el backend** (`usedFallbackAnalysis`) **pero no cruza el contrato público.** Solo llega `metadata.usedFallbackEngine`, que describe **la lista entera**.

> **Trasladar un agregado de la lista a un negocio concreto afirmaría de *este* negocio algo que solo se sabe del conjunto** — exactamente el tipo de inferencia que H-02C retiró de la interfaz.

**«Estado del análisis» se limita a lo verificable:** si hay Evaluación emitida, y bajo qué versión del Perfil de Ponderación. **La brecha sigue documentada** *(H-04 Fase 1 §8, punto 1)* y sigue exigiendo ampliar el DTO, que este sprint prohíbe.

## 3.3 Nota sobre la Tarea 4 del encargo

El encargo pide mostrar *«Factores medidos»* **y** *«Factores encontrados»*. **En los datos hay un solo array de factores medibles: `measuredFactors`.**

**Se interpretó como dos orígenes distintos de evidencia**, y así se rotulan por separado dentro de la misma sección:

| Subtítulo | Origen |
| --- | --- |
| **«Factores medidos por el motor de puntuación»** | `measuredFactors` — modelo determinista |
| **«Hallazgos del análisis del negocio»** | `description` `flaws` `whyWebsiteNeeded` `revenueLoss` |

> **Fundirlos en una sola lista habría atribuido a uno lo que produjo el otro.** Los hallazgos **no se atribuyen a la IA**, por lo mismo que §3.2.

---

# 4. Comportamiento en los seis estados exigidos

**Verificado por ejecución**, renderizando la pantalla en Node con `react-dom/server`:

| Estado | Comportamiento | ✓ |
| --- | --- | :-: |
| **Cobertura alta** *(86 %)* | «8 de 14 factores», «100 de 100 puntos», «6 de 6 categorías». **Ninguna categoría marcada «sin medir»** | ✅ |
| **Cobertura baja** *(18 %)* | 3 categorías rinden «sin medir»; **solo la categoría medida imprime una cifra**; «25 de 100 puntos»; **ninguna contribución se imprime como `+0.00`** | ✅ |
| **Score alto** *(92)* | Anillo casi completo, banda «Oportunidad Excelente» | ✅ |
| **Score bajo** *(24)* | Anillo corto, banda «Oportunidad Muy Baja». Misma jerarquía, sin degradación visual | ✅ |
| **Score 0 real** | **Se muestra `0`, no «—»** — `0` es una puntuación, no una ausencia (R-45) | ✅ |
| **Sin breakdown** | Resumen y desglose rinden estados explicados; **la sección «Qué falta medir» no se rinde vacía** | ✅ |
| **Sin evaluación** | Hero declara «Sin Evaluación»; el resumen explica que *«no significa que puntuara cero»*; **no se imprime la escala `/100`** | ✅ |
| **Una sola categoría medida** | **La misma señal no aparece como la que más y la que menos aporta**; se declara «No hay más categorías medidas» | ✅ |

> **Las dos comprobaciones que más importan** son que la cobertura baja **no fabrica ceros** y que el Score `0` **no se confunde con ausencia**. Ambas pasan.

---

# 5. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** · 26 ficheros |
| `npm run build` | ✅ **Compila** |
| `ak-rise` · `ak-bar` · `ak-ring` · `prefers-reduced-motion` en el CSS compilado | ✅ **Los cuatro presentes** |
| Repositorio limpio | ✅ Los scripts de verificación se ejecutaron y se eliminaron; **no queda ninguno** |

## 5.1 🔴 Capturas — no fue posible

**No hay extensión de navegador conectada en este entorno.** En consecuencia:

| Sin verificar | Consecuencia |
| --- | --- |
| **Aspecto real** | Tipografía, espaciado, color y el anillo están razonados, **no vistos** |
| **Animaciones en movimiento** | Compiladas y correctas en CSS, **no observadas** |
| **Responsive real** | Las rejillas declaran 1/2/3 columnas; **no se probó ningún ancho** |

> **Sigue siendo la revisión pendiente antes de la demo, y ahora pesa más que en Fase 1**: la pantalla tiene seis secciones y un anillo SVG. **Basta con `npm run dev` y abrir un negocio.**

---

# 6. Riesgos

| # | Riesgo | Prob. | Impacto | Nota |
| :-: | --- | :-: | :-: | --- |
| **R-1** | **La pantalla no se ha visto.** Todo el diseño está razonado sobre el código | 🔴 **Alta** | 🟡 Medio | §5.1 — pasada visual obligatoria antes de la demo |
| **R-2** | **Los Leads de ejemplo de `App.tsx` no traen `breakdown`**: abrir uno muestra tres estados vacíos seguidos | 🔴 **Alta** | 🟡 **Medio en demo** | **Hay que hacer una búsqueda real antes de enseñar esta pantalla.** Ya señalado en Fase 1 R-3 |
| **R-3** | **La pantalla es larga** — seis secciones. En una demo cronometrada exige *scroll* guiado | 🟡 Media | 🟢 Bajo | El orden lo fijó el encargo. Un índice lateral sería Fase 3 |
| **R-4** | **`rationale` es texto de longitud libre**; una explicación larga desequilibra su tarjeta | 🟡 Media | 🟢 Bajo | Altura libre; la rejilla lo absorbe |
| **R-5** | **La Biblioteca conserva la estética anterior** y el `ScoreBreakdown` original | 🔴 Alta | 🟡 Medio | **Fuera de alcance.** Sigue siendo la mejora de mayor retorno pendiente |

---

# 7. Verificación de las restricciones del encargo

| Restricción | Estado |
| --- | :-: |
| No modificar dominio · `application/` · `infrastructure/` · prompts · Blueprint | ✅ **`server/` sin tocar** |
| No tocar Docker · Cloud Run · DTOs · APIs · contratos | ✅ **Cumplida** |
| Reutilizar componentes existentes | ✅ `FactorInventory` sirve a **dos** secciones; `ScoreCategoryCard` se conserva y refina |
| No inventar datos · no crear texto ficticio | ✅ §2.3 — el resumen selecciona y ordena, no redacta |
| Estado vacío cuando el dato no existe | ✅ §4 — ocho estados verificados |
| No cambiar Score · Band · Coverage · Confidence · Weight · Contribution · Rationale | ✅ **Ninguno se altera**; solo cambio de unidad en `coverage` *(0-1 → %)* |
| No crear campos nuevos · no agregar mocks | ✅ **Cumplida** |
| **No hardcodear textos específicos del negocio** | ✅ **Todo texto fijo describe la métrica**, nunca a un negocio concreto |

---

# 8. Referencias

**Creado:** `components/OpportunityHero.tsx` · `components/ExecutiveSummary.tsx` · `components/FactorInventory.tsx`.
**Modificado:** `OpportunityView.tsx` · `components/ScoreCategoryCard.tsx` · `src/index.css`.

**Consultado, no tocado:** `server/modules/lead-analyzer/domain/opportunityScore.ts:7-12` *(dirección del Score)*, `:329-332` *(`evaluatedWeight`)*, `:353-357` *(`coverage`)* · `weightingProfile.ts` *(WP-01)* · `src/shared/types/index.ts` · `src/modules/lead-hunter/domain/prospectMapper.ts`.

**Blueprint:** APS-08 §6, §7.1, §8, §9, §11 · ADR-14 §6.3 · DEV-00 R-38, R-45, R-48.

**Documentos:** H-04 Fase 1 — Opportunity View Implementation · H-02C — Fallback Visibility Audit · H-03-F2 — Score Exposure Implementation.
