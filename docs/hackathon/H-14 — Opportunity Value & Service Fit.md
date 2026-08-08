# H-14 — Opportunity Value & Service Fit

**Sprint:** H-14 · Auditoría previa (§14)
**Estado:** 🟡 **Consistente con reservas** — tres decisiones pertenecen al PO
**Código modificado:** ninguno
**Fecha:** 2026-08-07

---

## 1. Objetivo

Transformar el diagnóstico pasivo de AKVEZ en una herramienta de decisión
comercial: que el profesional no lea «este negocio tiene problemas» sino «este
negocio tiene estas oportunidades y tú puedes ayudarlo así».

---

## 2. Problema

El bloque **«Lo que puedes arreglar»** renderiza `lead.flaws: string[]` como una
lista de superficies apagadas con icono `AlertTriangle` en ámbar. Comunica
*avería*, no *oportunidad*. El profesional termina de leerlo sabiendo qué está
roto, pero no qué puede vender.

### 2.1 Corrección a la premisa del sprint

H-14 sitúa la sección en la Opportunity View. **No está ahí.** Vive en
`LeadCard.tsx:404-425`. La Opportunity View tiene estas secciones:

```
Ver cómo lo analizó AKVEZ        (enlace al Showcase)
¿Por qué obtuvo ese Score?       (desglose)
Qué encontró AKVEZ               (evidencia)
  ├─ Por qué necesita un sitio web
  └─ Cuánto les cuesta hoy
Lo que AKVEZ no pudo medir       (ausencias declaradas)
Próximos pasos
  └─ Lo que le venderías          (el `angle`)
```

Esto **no invalida el sprint**, pero cambia dónde se interviene y obliga a
decidir si «Oportunidades para ti» vive en la tarjeta, en la vista de detalle o
en ambas. Es una decisión de producto, no de ingeniería.

---

## 3. Mapa de auditoría (§14)

### 3.1 Presentación

| Archivo | Responsabilidad | Reutilizable | Cambio necesario | Riesgo |
|---|---|:---:|---|:---:|
| `LeadCard.tsx` (476) | Tarjeta de resultado; **contiene «Lo que puedes arreglar»** (404-425) | ✅ | Sustituir el bloque | 🟠 |
| `OpportunityView.tsx` (282) | Detalle del negocio | ✅ | Insertar Oportunidades / Valor / Servicios | 🟠 |
| `OpportunityHero.tsx` (278) | Score + cabecera | ✅ | Ninguno | 🟢 |
| `ScoreCategoryCard.tsx` (121) | Tarjeta de categoría del desglose | ✅ **base para la tarjeta de oportunidad** | Ninguno | 🟢 |
| `ExecutiveSummary.tsx` (263) | Resumen narrativo | ✅ | Ninguno | 🟢 |
| `FactorInventory.tsx` (95) | Factores medidos / no medidos | ✅ | Ninguno | 🟢 |
| `AIShowcase.tsx` (385) | Rastro del análisis | ✅ | Declarar origen de recomendaciones | 🟡 |

### 3.2 Sistema de diseño

| Archivo | Responsabilidad | Reutilizable | Cambio |
|---|---|:---:|---|
| `shared/components/ui/` (11 primitivas) | Surface · Badge · Meter · IconFrame · StatGrid · Callout · Button · ActionCard · SectionHeader · EmptyState · Eyebrow | ✅ **todas** | Ninguno |
| `tone.ts` | Único traductor de color semántico a clase | ✅ | Ninguno |
| `index.css` `@theme` | Tokens | ✅ | **Ninguno** — la paleta ya cubre el caso |

**El color de éxito ya está especificado para esto.** APS-04 §10.3: *«Indica
oportunidades positivas, valores monetarios y confirmaciones. Se usa en: rango de
valor potencial del proyecto»*. No hace falta introducir ningún color nuevo.

### 3.3 Dominio y aplicación (backend)

| Archivo | Responsabilidad | Contrato | Cambio | Riesgo |
|---|---|---|---|:---:|
| `opportunityScore.ts` (375) | Score 0-100, seis categorías, WP-01 | `contracts/opportunityScore.ts` | **Ninguno** | 🔴 si se toca |
| `weightingProfile.ts` (117) | Perfil de ponderación WP-01 | ADR-14 | **Ninguno sin ADR** | 🔴 |
| `LeadAnalysis.ts` (73) | Modelo del análisis | interno | Extender con necesidades | 🟠 |
| `fallbackAnalysis.ts` (69) | **Motor heurístico determinista** | interno | **Base del fallback de Service Fit** | 🟢 |
| `analyzeProspects.ts` (357) | Orquestación del análisis | — | Punto de inserción | 🟠 |
| `leadAnalysisAdapter.ts` (232) | Gemini + `responseSchema` | puerto | **Precedente de validación** | 🟢 |

### 3.4 Perfil profesional

| Dónde vive | Forma actual |
|---|---|
| `src/shared/types/index.ts` → `DesignerProfile` | `skills: string` — **texto libre** |
| `server/shared/contracts/outreachPitch.ts` | `skills: string` — replicado en el contrato |
| Persistencia | `localStorage` (`akvez_profile_v1`) |
| Captura | `FirstRunProfile.tsx` — un campo «A qué te dedicas» |

**No existe `ProfessionalProfile`. No existe lista de servicios ni capacidades.**

### 3.5 Valor estimado

**No existe.** Búsqueda exhaustiva de `pricing`, `projectValue`, `estimatedValue`,
`priceRange`, `complexity`, `budget`, `presupuesto`, `tarifa`: **cero resultados**
en código.

---

## 4. Datos realmente disponibles

Esta es la restricción que gobierna todo el sprint. `FieldMask` de Google Places:

```
places.id · places.displayName · places.websiteUri
places.nationalPhoneNumber · places.googleMapsUri
places.rating · places.userRatingCount
```

Siete campos. Más lo que Gemini infiere: `flaws[]`, `description`, `revenueLoss`,
`angle`, `whyWebsiteNeeded`, `classification`.

### 4.1 Necesidades derivables hoy

| Necesidad | Fuente | ¿Derivable? |
|---|---|:---:|
| No website | `websiteUri` ausente | ✅ **dato duro** |
| Sin teléfono | `nationalPhoneNumber` ausente | ✅ **dato duro** |
| Reputación débil / sin reseñas | `rating` · `userRatingCount` | ✅ **dato duro** |
| Sitio web deficiente | `classification` (Gemini) | ⚠️ inferencia |
| Sin reservas online | `flaws[]` (Gemini) | ⚠️ inferencia |
| **Presencia visual pobre** | — | 🔴 **NO derivable** |
| **SEO local débil** | — | 🔴 **NO derivable** |
| **Sin flujo de contacto automatizado** | — | 🔴 **NO derivable** |

**Tres de las seis necesidades del §6 no se pueden sostener con ningún dato que
AKVEZ posea.** No pedimos `places.photos`, no consultamos posicionamiento, no
inspeccionamos formularios.

Mostrarlas violaría la regla del propio sprint (§1: *«Si una oportunidad no puede
justificarse mediante datos o reglas existentes, NO mostrarla»*) y la §13.

### 4.2 Trampa identificada

`nichePresets.ts` contiene `commonPainPoints` por nicho («menú en PDF estático»,
«sin sistema de reservas»). Son **supuestos del sector, no observaciones de ese
negocio**. Alimentar «Oportunidades para ti» desde ahí presentaría una conjetura
genérica como hallazgo específico — exactamente el defecto retirado del generador
en H-09.

---

## 5. Modelo conceptual propuesto

```
Datos de Places  ──┐
                   ├──►  DetectedNeed[]  ──┐
Análisis Gemini  ──┘      (con origen)     │
                                           ├──►  ServiceFit[]
ProfessionalProfile.services ──────────────┘      (intersección)
                                                        │
                                                        ├──► Oportunidades para ti
                                                        ├──► Valor estimado
                                                        └──► Servicios que puedes ofrecer
```

### 5.1 `DetectedNeed`

```ts
interface DetectedNeed {
  id: NeedId;                    // vocabulario cerrado
  source: "PLACES" | "GEMINI";   // R-38: el origen se declara, no se deduce
  evidence: string;              // el dato concreto que la sostiene
}
```

**`source` es obligatorio.** Una necesidad derivada de un dato duro y otra
inferida por un modelo no tienen el mismo estatus, y la interfaz debe poder
distinguirlas.

### 5.2 Afinidad — cualitativa, no porcentual

El §7 lo pide explícitamente: *«Es preferible una señal honesta que una precisión
falsa.»*

**No hay base para un porcentaje.** Un «98 %» exigiría un modelo calibrado contra
resultados comerciales reales, y AKVEZ no tiene ni un solo dato de conversión.
Propongo tres niveles derivados de un conteo, no de una fórmula inventada:

| Nivel | Regla |
|---|---|
| **Excelente afinidad** | El servicio cubre una necesidad de origen `PLACES` (dato duro) |
| **Buena afinidad** | Cubre una necesidad de origen `GEMINI` (inferencia) |
| **Afinidad moderada** | El servicio está en el perfil pero ninguna necesidad detectada lo reclama |

Es defendible ante un jurado: cada nivel se explica en una frase y se puede
rastrear al dato que lo produjo.

### 5.3 Valor estimado — modelo mínimo

Autorizado por APS-04 §10.3, que fija incluso el formato: `USD 800 – 1,500`.

**Ningún documento del Blueprint define cómo se calcula.** Propongo el modelo
mínimo que exige el §4:

```
rango = Σ (rango base del servicio recomendado)
```

Con una tabla de rangos por servicio **explícita, versionada y editable**, no
una fórmula opaca. Reglas:

- Se muestra **solo** si hay al menos un servicio recomendado con necesidad de
  origen `PLACES`. Sin dato duro, no hay cifra.
- Se rotula **«Rango orientativo»**, nunca «puedes cobrar».
- Si no hay base suficiente: **estado vacío declarado**, no un rango por defecto.

⚠️ **Los rangos base son un parámetro de producto, no de ingeniería.** No los
invento: los debe fijar el PO. Sin ellos, esta sección no se implementa.

---

## 6. Arquitectura

Sin cambios estructurales. Encaja en el hexágono existente:

```
domain/serviceFit.ts          ← reglas puras de intersección (nuevo)
domain/detectedNeeds.ts       ← derivación desde Places + análisis (nuevo)
application/analyzeProspects  ← punto de inserción (existente)
infrastructure/…Adapter       ← Gemini con responseSchema (patrón existente)
```

**Gemini validado antes de renderizar (§8):** el patrón ya existe en
`leadAnalysisAdapter.ts:178-201`, que declara `responseSchema` con `required`.
Se replica; no se inventa nada.

**Fallback (§9):** `fallbackAnalysis.ts` es el motor determinista existente. El
Service Fit puede calcularse **íntegramente sin Gemini** cuando las necesidades
provienen de Places, porque la intersección es una regla, no una inferencia.

---

## 7. Contradicciones y decisiones pendientes (§15)

### 🔴 D-1 — El perfil multiservicio excede la V1 declarada

**APS-08 §6.6:**
> «En la V1, el enfoque estará dirigido **principalmente a negocios que puedan
> beneficiarse de servicios de diseño web**.»

H-14 §5 propone `Photography`, `AI Automation`, `SEO`, `Branding`.

**Documento a actualizar: APS-08 §6.6**, o bien acotar H-14 a diseño web en esta
iteración. **No lo decido yo.**

### 🔴 D-2 — Compatibilidad pesa el 20 % del Score

`skills` alimenta la categoría **Compatibilidad** (APS-08 §6.6 · WP-01 §7.1).
Convertirla de texto libre a lista de servicios **cambia una entrada del cálculo
del Opportunity Score**.

**ADR-14 gobierna el Perfil de Ponderación.** Tocar esa entrada sin su trámite
rompería la gobernanza. Mitigación posible: añadir `services[]` como campo
**aditivo** y dejar `skills` intacto alimentando el Score igual que hoy. Eso
evita ADR-14 en esta iteración.

### 🟠 D-3 — Rangos de valor por servicio

Parámetro de producto inexistente. Candidato natural: **APS-17 — Initial Product
Parameters**. Sin esa tabla, la sección de valor no se implementa.

### 🟡 D-4 — Dónde vive «Oportunidades para ti»

LeadCard, Opportunity View, o ambas con distinta densidad. Afecta a la jerarquía
de las dos pantallas más vistas.

---

## 8. Criterios de aceptación

Los diecisiete del §16 se adoptan sin cambios, con dos precisiones:

- «El valor estimado esté visible **cuando exista información suficiente**» se
  interpreta como: al menos una necesidad de origen `PLACES` **y** la tabla de
  rangos aprobada (D-3).
- «No existan servicios recomendados sin justificación» se garantiza por
  construcción: `DetectedNeed.evidence` es obligatorio.

---

## 9. Riesgos

| # | Riesgo | Severidad | Mitigación |
|---|---|:---:|---|
| R1 | Presentar `commonPainPoints` como hallazgos del negocio | 🔴 | Vocabulario cerrado con `evidence` obligatorio |
| R2 | Regresión en el Opportunity Score al tocar `skills` | 🔴 | `services[]` aditivo (D-2) |
| R3 | Afinidad porcentual sin base | 🟠 | Niveles cualitativos (§5.2) |
| R4 | Valor estimado leído como precio garantizado | 🟠 | «Rango orientativo» + regla de dato duro |
| R5 | Gemini devolviendo servicios fuera del perfil | 🟠 | `responseSchema` + filtro contra `services[]` |
| R6 | Múltiples CTA naranjas | 🟡 | §11: acción primaria única |
| R7 | **Nada de esto se ha validado con datos reales** | 🟠 | H-13 sigue bloqueado por credenciales |

---

## 9-bis. 🔴 BLOQUEO DE H-14.A — `flaws` no es evidencia

Detectado en la auditoría §16 de H-14.A, que obliga a detenerse si «la lógica
actual ya contiene afirmaciones que no puede demostrar».

**La contiene.** `lead.flaws[]` —único origen del bloque a transformar— es prosa
generada, no observación. Ocurre en los dos caminos:

### Camino determinista — `fallbackAnalysis.ts`

Para un negocio sin web, el único hecho observado es `websiteUri` ausente. Aun
así el motor afirma:

| Afirmación | ¿Observada? |
|---|:---:|
| «Falta de optimización para dispositivos móviles» (L51) | 🔴 nunca se mide |
| «Tiempos de carga lentos» (L52) | 🔴 nunca se mide |
| «Ausencia de llamados a la acción claros (CTAs)» (L53) | 🔴 nunca se mide |
| «Falta de presencia en Google (SEO local)» (L19) | 🔴 nunca se mide |
| «**Decenas de usuarios** buscan… y contratan a la competencia» (L44) | 🔴 cifra inventada |

**AKVEZ nunca descarga ni inspecciona el sitio web.** No hay Lighthouse, ni
fetch, ni análisis de DOM.

### Camino IA — `leadAnalysisAdapter.ts`

El prompt **ordena** producir exactamente tres defectos:

> L164: «Describe 3 debilidades claras de su web **lenta, desactualizada, sin
> llamados a la acción** o de difícil navegación.»

Gemini recibe solo `name`, `rating`, `reviewCount` y la **URL** del sitio. Nunca
su contenido. Se le pide afirmar velocidad, actualidad y ausencia de CTA sobre
una página que no ha visto — y **exactamente tres**, haya o no haya algo que
observar.

### Por qué esto bloquea el sprint

Los ejemplos que H-14.A §4 declara **NO válidos** están literalmente dentro de
`flaws` hoy:

| Prohibido por §4 | Presente en |
|---|---|
| «Su web convierte mal» | `fallbackAnalysis.ts:53` |
| «Necesita SEO» | `fallbackAnalysis.ts:19` |
| «Necesita reservas online» | `fallbackAnalysis.ts:18` |

**El reframe agrava el problema en lugar de ser neutral.** «Lo que puedes
arreglar», en gris apagado y con icono de advertencia, se lee como un
diagnóstico blando. «Oportunidades para ti», con tratamiento premium y jerarquía
elevada, se lee como una afirmación sobre la que el profesional **va a actuar y
que puede repetirle al dueño del negocio**. Subir el peso visual de una
afirmación no verificable es aumentar su daño.

Criterios de aceptación imposibles de cumplir con esta fuente: **#6** (cada
oportunidad respaldada por evidencia) y **#15** (no añadir datos ficticios).

### Salida

Corregir `flaws` exige tocar `fallbackAnalysis.ts` y el prompt de
`leadAnalysisAdapter.ts` — **backend y dominio**, que H-14.A §12 prohíbe
expresamente. De ahí el bloqueo.

## 10. Propuesta de troceo

| Fase | Alcance | Bloqueos |
|---|---|---|
| **H-14.A** | «Lo que puedes arreglar» → «Oportunidades para ti». Solo necesidades derivables. Tratamiento visual con primitivas y tokens existentes. | **Ninguno** |
| **H-14.B** | `DetectedNeed` + `ServiceFit` determinista + afinidad cualitativa. `services[]` aditivo. | D-1 |
| **H-14.C** | Valor estimado del proyecto | D-3 |
| **H-14.D** | Recomendaciones vía Gemini con `responseSchema` | H-14.B |

**H-14.A puede empezar hoy.** No necesita ninguna decisión pendiente, no toca
backend, no toca el Score y no introduce ninguna cifra.
