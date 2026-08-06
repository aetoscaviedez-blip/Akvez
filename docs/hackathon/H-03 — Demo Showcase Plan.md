# H-03 — Plan de Demo Showcase

| Campo | Valor |
| --- | --- |
| Documento | **H-03 — Demo Showcase Plan** |
| Clasificación | **Plan de trabajo** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Plan propuesto. CERO cambios de código** |
| Fecha | 2026-08-04 |
| Antecedentes | H-02A · H-02B · H-02C · H-02D · H-01 · AKVEZ-02 |

> **Nada implementado.** Este documento no modifica código, contratos ni Blueprint.

---

# 1. Objetivo del sprint

> ### **Enseñar la inteligencia que AKVEZ ya calcula y hoy tira a la basura.**

## 1.1 El hallazgo que ordena todo el plan

**Auditando los cuatro bloques contra el código, aparece un patrón:**

| Bloque | ¿Requiere construir capacidad nueva? |
| --- | :-: |
| **1 · Reliability** | ❌ **Casi todo hecho** en H-02A/B/D |
| **2 · Lead Opportunity View** | ❌ **El dato existe y el componente también** |
| **3 · Cloud** | ⚠️ **Sí, pero es barato** — el build ya produce artefacto autónomo |
| **4 · AI Showcase** | ❌ **El dato existe** — y hay **más del que suponíamos** |

> ### **Tres de los cuatro bloques son trabajo de EXPOSICIÓN, no de construcción.**

## 1.2 🔴 Los dos activos ocultos

### Activo 1 — El desglose del Score, ya renderizado

**`LeadLibrary.tsx:168`** contiene un componente **`ScoreBreakdown`** que ya pinta, por categoría: `weight`, `partialScore`, `contribution`, `measuredFactors`, `unmeasuredFactors`, **`rationale`** — y muestra la aritmética *«contribuciones ≈ score»*.

**Funciona hoy, en la Biblioteca.** No llega a la ruta de búsqueda porque `LeadResponseDTO` no lo publica.

### Activo 2 — ⭐ El reporte de ejecución, que nadie ve

**`server/shared/observability/executionReport.ts` ya instrumenta el pipeline completo:**

| Métrica | Contenido |
| --- | --- |
| `GooglePlacesMetrics` | **sub-consultas lanzadas** · negocios encontrados · **ms** |
| `DeduplicationMetrics` | **antes → después** · ms |
| `PersistenceMetrics` | Leads registrados |
| `LeadAnalyzerMetrics` | tandas intentadas / fallidas |
| `GeminiMetrics` | **modelo** · llamadas · éxitos · **reintentos** · ms · detalle del fallo |
| `AnalysisOrigin` | IA · respaldo · mixto |

> ### **Todo eso se calcula en cada búsqueda y se escribe en `stdout` con `printExecutionReport()`. Nunca cruza HTTP.**
>
> **Para un jurado de un hackathon «API + Cloud + AI», esto es exactamente lo que quiere ver:**
>
> *«Esta búsqueda lanzó 23 consultas a Places, encontró 187 negocios, dedujo 94 únicos por Referencia de Origen, llamó a Gemini 10 veces con 2 reintentos y tardó 4,2 s.»*
>
> **Es la prueba de uso real de APIs, y ya está medida.**

---

# 2. Fases

**Cinco fases. La 0 es condición de todo lo demás.**

| Fase | Objetivo | Código | Aprobación |
| :-: | --- | :-: | :-: |
| **H-03.0** | **Runtime** — que la demo arranque | Mínimo | ⚠️ Una decisión |
| **H-03.1** | **Reliability** — estados vacíos y errores | Solo UI | ❌ No |
| **H-03.2** | **Opportunity View** — la pantalla estrella | UI + **DTO** | ✅ **Sí** |
| **H-03.3** | **AI Showcase** — el reporte de ejecución | UI + **DTO** | ✅ **Sí** |
| **H-03.4** | **Cloud** — Dockerfile y URL pública | Infra | ⚠️ Una decisión |

> **El Dashboard no es una fase propia:** se compone de datos de H-03.2 y H-03.3 y se ensambla al final *(§3.5)*.

---

# 3. Fases en detalle

## 3.1 H-03.0 — Runtime · 🔴 **BLOQUEANTE**

### Objetivo
**Que una búsqueda real funcione.** Sin esto, todo lo demás es decorar una pantalla que devuelve HTTP 400.

### Cambios

| # | Cambio | Archivo | Impacto | Arquitectura | Blueprint |
| :-: | --- | --- | :-: | :-: | :-: |
| **0.1** | **Verificar que `gemini-3.5-flash` existe** | — | 🔴 Crítico | ❌ | ❌ |
| **0.2** | **Credenciales en el proceso** — `import "dotenv/config"` en `server.ts`, **o** exportarlas en el shell | `server.ts` *(1 línea)* | 🔴 **Desbloquea la demo** | ❌ **No** | ❌ **No** |
| **0.3** | Habilitar **Places API (New)** + medir coste y duración | — | 🔴 | ❌ | ❌ |

### Criterios de aceptación
✅ Una búsqueda devuelve negocios reales · ✅ **`metadata.usedFallbackEngine === false`** en esa respuesta · ✅ Coste por búsqueda documentado · ✅ Duración cronometrada *(ritmo de demo)*.

### Riesgos
El modelo no existe *(→ cambiar una constante)* · la expansión por zonas dispara el coste *(→ acotar en H-03.4)*.

---

## 3.2 H-03.1 — Reliability

### Objetivo
**Que ningún estado de la demo sea feo o ambiguo.** H-02 eliminó las mentiras; falta pulir la ausencia.

### Cambios — **todos Tipo A, solo UI**

| # | Cambio | Archivo | Arquitectura | Blueprint |
| :-: | --- | --- | :-: | :-: |
| **1.1** | **Estado de error de búsqueda profesional** — distinguir *falta credencial* · *cuota* · *sin resultados* · *fallo de red* | `SearchErrorBanner.tsx` | ❌ | ❌ |
| **1.2** | **Estado vacío con sentido** — *«no hay negocios de ese nicho»* ≠ *«la búsqueda falló»* | `EmptyState.tsx` | ❌ | ❌ |
| **1.3** | **Estado de carga con progreso real** — la búsqueda tarda; el `SearchingLoader` debe decir qué ocurre | `SearchingLoader.tsx` | ❌ | ❌ |
| **1.4** | **Botón «Contacto» sin teléfono** — hoy copia el nombre del negocio *(H-02C C-4 residual)* | `LeadCard.tsx` | ❌ | ❌ |

### Criterios de aceptación
✅ Los cuatro modos de fallo tienen mensaje distinto y accionable · ✅ Ningún estado vacío parece un error · ✅ `lint`/`tsc`/`197` verdes.

### Riesgos
🟢 Bajos. **No toca datos ni contratos.**

---

## 3.3 H-03.2 — Lead Opportunity View · ⭐ **la pantalla estrella**

### Objetivo
**Que el jurado entienda en segundos: *«la IA encontró una oportunidad que yo no habría visto»*.**

### El trabajo real

> **No es construir la vista. Es hacer que el dato llegue.** El componente existe *(§1.2)*.

| # | Cambio | Archivo | Impacto | Arquitectura | Blueprint |
| :-: | --- | --- | :-: | :-: | :-: |
| **2.1** | 🔴 **Ampliar `LeadResponseDTO`** con `band`, `confidence`, `coverage`, `breakdown[]`, `scoreVersion` — **opcionales** | `shared/contracts/prospectSearch.ts` | 🔴 Alto | ⚠️ **Contrato público** | 🟡 **ADR-06 §10** |
| **2.2** | **Declarar y mapear** en `InternalAnalyzedLead`, con el patrón `?? null` de `leadLibraryMapper.ts:78-89` | `shared/mappers/leadResponseMapper.ts` | 🔴 | ⚠️ Mapper | ❌ |
| **2.3** | Ampliar `Prospect` y transportar en `prospectMapper` **sin inventar** | `src/shared/types` · `prospectMapper.ts` | 🟡 | ❌ | ❌ |
| **2.4** | **Extraer `ScoreBreakdown`** de `LeadLibrary.tsx` a componente compartido | `src/shared/components/` | 🟡 | ❌ — **evita duplicar** | ❌ |
| **2.5** | **Vista de oportunidad** en `LeadCard` — banda, confianza, cobertura y desglose desplegable | `LeadCard.tsx` | 🔴 **Alto visual** | ❌ | ❌ |

### Por qué 2.1 es aditivo y no rompe nada

> **`LeadLibraryItemDTO` ya expone exactamente estos campos con la misma semántica** *(`leadLibrary.ts:69-103`)*. **No se inventa contrato: se replica uno aprobado y en uso.**
>
> Todos los campos son **opcionales**, de modo que ningún consumidor actual se rompe.

### Criterios de aceptación
✅ Un lead muestra **por qué** tiene su score, con aportación por categoría y `rationale` · ✅ **`unmeasuredFactors` visible** — el sistema declara qué **no** pudo medir · ✅ `partialScore: null` se representa sin inventar *(R-38 · R-45)* · ✅ **Cero duplicación** — un solo `ScoreBreakdown` · ✅ `197` verdes.

### Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| 1 | **`partialScore: null` rompe el render** si se asume número | 🟡 |
| 2 | **Extraer el componente altera la Biblioteca** | 🟡 — mitigable: extraer sin cambiar comportamiento |
| 3 | **El desglose satura visualmente la tarjeta** | 🟡 — desplegable, cerrado por defecto |

---

## 3.4 H-03.3 — AI Showcase · ⭐ **el diferenciador**

### Objetivo
**Enseñar el pipeline, no solo el resultado.** Evitar la «magia negra» que el encargo prohíbe.

### Cambios

| # | Cambio | Archivo | Impacto | Arquitectura | Blueprint |
| :-: | --- | --- | :-: | :-: | :-: |
| **3.1** | 🔴 **Publicar el reporte de ejecución** en `SearchResponseMetadata` — consultas Places, encontrados, deduplicados, llamadas a Gemini, reintentos, **modelo**, ms | `prospectSearch.ts` + `prospectSearchRoute.ts` | 🔴 **Alto** | ⚠️ **Contrato** | 🟡 **ADR-06** |
| **3.2** | **Panel «Cómo se obtuvo esto»** bajo los resultados | `LeadHunter.tsx` | 🔴 Alto | ❌ | ❌ |
| **3.3** | **Publicar `fallbackCount`** — *«2 de 10 con respaldo»* en vez de un booleano | ídem 3.1 | 🟡 | ⚠️ Contrato | ❌ |

### Por qué 3.1 es más barato de lo que parece

> **`SearchResponseMetadata` está declarado en el propio contrato como *«contenedor extensible para señales futuras»*** *(`prospectSearch.ts:41-45`)*. **Ampliarlo es su propósito declarado.**
>
> **Y el dato ya está calculado**: `runWithExecutionReport` lo acumula durante toda la petición. Hoy solo se imprime.

### ⚠️ Lo que NO se propone

| Descartado | Motivo |
| --- | --- |
| **Mostrar el «razonamiento» del pitch** | **El sistema no lo produce.** Es lo que H-02D retiró por falso. Generarlo exigiría que la redacción devolviera su explicación — **capacidad nueva en `domain/` y en el prompt.** Fuera de alcance |
| Exponer prompts o respuestas crudas | El reporte **deliberadamente no los registra** — *«nunca el prompt ni la respuesta»* |

### Criterios de aceptación
✅ Tras una búsqueda, el jurado ve **cuántas consultas reales** se lanzaron y **cuántas llamadas a Gemini** · ✅ **El modelo usado es visible** · ✅ El panel no aparece si no hay datos · ✅ `197` verdes.

### Riesgos
🟡 **Exponer métricas de infraestructura en un contrato público** — mitigable: solo agregados, sin rutas, credenciales ni contenido.

---

## 3.5 Dashboard — ensamblaje, no fase

### Qué pide el encargo y de dónde sale

| Métrica | Fuente | ¿Existe? |
| --- | --- | :-: |
| **Negocios encontrados** | `GET /api/leads` → `total` | ✅ **Ya publicado** |
| **Oportunidades detectadas** | `GET /api/leads` → `scored` | ✅ **Ya publicado** |
| **Score promedio** | Calculable de `leads[].score` | ✅ Ya disponible |
| **Pitches generados** | `leads.filter(l => l.generatedPitch)` — cliente | ✅ Ya disponible |
| **Actividad del agente** | **Reporte de ejecución** | ⚠️ **Requiere H-03.3** |

> ### **Cuatro de las cinco métricas ya se publican.** El Dashboard es **una pantalla nueva sobre datos existentes**, no una capacidad nueva.

**Se ensambla después de H-03.2 y H-03.3.** Construirlo antes obligaría a rehacerlo.

---

## 3.6 H-03.4 — Cloud Readiness

### Qué ya está resuelto

| Requisito | Estado |
| --- | :-: |
| Artefacto autónomo | ✅ `dist/server.cjs` + estáticos |
| `PORT` del entorno | ✅ `env.ts:71` — **T-14** |
| Escucha en `0.0.0.0` | ✅ `startServer.ts:35` |
| Estáticos en producción | ✅ `NODE_ENV=production` |
| **Sin estado en disco** | ✅ Todo en memoria — **encaja con contenedor efímero** |

> **AKVEZ ya cumple los requisitos de contenedor. Falta el envoltorio.**

### Cambios

| # | Cambio | Archivo | Arquitectura | Blueprint |
| :-: | --- | --- | :-: | :-: |
| **4.1** | **`Dockerfile` multi-etapa** | `Dockerfile` *(nuevo)* | ❌ **No toca código** | ❌ |
| **4.2** | **Desplegar en Cloud Run** con las credenciales como **Secrets** | — | ❌ | ❌ |
| **4.3** | **`docs/hackathon/ARCHITECTURE.md`** — diagrama de una página para el jurado | Documento | ❌ | ❌ |
| **4.4** | Acotar zonas del nicho de demo si el coste lo exige | `zones.ts` | ⚠️ Configuración | ❌ |

### Criterios de aceptación
✅ **URL pública funcionando** · ✅ Credenciales como Secrets, **no en la imagen** · ✅ Arranque en frío medido · ✅ Diagrama de una página.

### Riesgos
🟡 **Arranque en frío** de Cloud Run + búsqueda lenta = demo lenta *(→ mantener una instancia caliente durante la presentación)*.

---

# 4. Resumen de impacto

| Fase | Ficheros | Backend | Frontend | Contrato | Blueprint |
| :-: | :-: | :-: | :-: | :-: | :-: |
| **0** Runtime | 0-1 | 0-1 | 0 | ❌ | ❌ |
| **1** Reliability | 4 | 0 | 4 | ❌ | ❌ |
| **2** Opportunity View | 5 | **2** | 3 | ⚠️ **Sí** | 🟡 **ADR-06** |
| **3** AI Showcase | 3 | **2** | 1 | ⚠️ **Sí** | 🟡 **ADR-06** |
| Dashboard | 1-2 | 0 | 1-2 | ❌ | ❌ |
| **4** Cloud | 2 | 0 | 0 | ❌ | ❌ |

## 4.1 Restricciones respetadas

| Restricción | Cumplimiento |
| --- | :-: |
| Arquitectura modular | ✅ **Ninguna fase añade capas ni agentes** |
| Separación de capas | ✅ **`domain/`, `application/` e `infrastructure/` NO se tocan en ninguna fase** |
| Contratos salvo necesidad real | ⚠️ **Dos ampliaciones, ambas aditivas** y con precedente aprobado |
| Blueprint como fuente de verdad | ✅ **No se modifica** |
| Sin APIs nuevas | ✅ **Cero endpoints nuevos** |
| Sin lógica en componentes React | ✅ El cálculo sigue en `domain/`; la UI **solo pinta** |
| Sin duplicar modelos | ✅ **2.4 extrae el componente en lugar de duplicarlo** |
| Sin mocks permanentes | ✅ Ninguno |

---

# 5. Criterio de éxito del jurado

| # | Pregunta | Cómo la responde el plan |
| :-: | --- | --- |
| **1** | **¿Qué problema resuelve?** | Dashboard + Opportunity View: *«N negocios, M con oportunidad detectada»* |
| **2** | **¿Dónde usa IA?** | **Declarado explícitamente** — H-02B/D ya lo hacen; H-03.3 añade el recuento de llamadas y el modelo |
| **3** | **¿Qué APIs utiliza?** | **H-03.3** — consultas reales a Places y llamadas a Gemini, con cifras |
| **4** | **¿Por qué es confiable?** | ⭐ **H-03.2** — el Score es **determinista y explicable**, con `rationale` y **`unmeasuredFactors`**: el sistema declara qué **no** pudo medir |
| **5** | **¿Cómo sería SaaS?** | **H-03.4** — corre en Cloud Run; `ARCHITECTURE.md` muestra la modularidad y el hueco de persistencia |

> ### **La pregunta 4 es donde AKVEZ puede ganar.** Un Score que **explica su propia cobertura y admite sus lagunas** es más convincente que un número bonito — y **ya está construido**.

---

# 6. Orden y decisiones

## 6.1 Orden recomendado

| # | Fase | Bloqueado por |
| :-: | --- | :-: |
| **1** | **H-03.0** Runtime | **Nada** |
| **2** | **H-03.4** Cloud *(en paralelo)* | Nada — no depende de UI |
| **3** | **H-03.1** Reliability | Nada |
| **4** | **H-03.2** Opportunity View | ⛔ **Aprobación del DTO** |
| **5** | **H-03.3** AI Showcase | ⛔ **Aprobación del DTO** |
| **6** | Dashboard | ⛔ Fases 4 y 5 |

> **Las fases 0, 1 y 4 no requieren ninguna aprobación** y cubren runtime, pulido y el eje Cloud.

## 6.2 Decisiones que pido

| # | Decisión | Alcance | Sin ella |
| :-: | --- | --- | --- |
| **1** | ⭐ **¿Amplío `LeadResponseDTO`** con los campos del Score? *(2.1)* | **Contrato público, aditivo.** Replica `LeadLibraryItemDTO` | **No hay pantalla estrella.** Bloquea H-03.2 |
| **2** | ⭐ **¿Amplío `SearchResponseMetadata`** con el reporte de ejecución? *(3.1)* | **Contrato público, aditivo.** Su propio texto lo declara *«contenedor extensible»* | **No hay AI Showcase.** Bloquea H-03.3 y el Dashboard |
| **3** | **¿Cargo `dotenv`** en `server.ts`, o exportas las variables? *(0.2)* | 1 línea | La demo no arranca |
| **4** | **¿Creo `Dockerfile` y despliego en Cloud Run?** *(4.1-4.2)* | Aditivo, no toca aplicación | **Eje Cloud vacío** |

> **Las decisiones 1 y 2 son la diferencia entre una demo que funciona y una que impresiona.** Ambas son **ampliaciones aditivas** de contratos, con precedente aprobado en el propio repositorio.

---

# 7. Fuera de alcance

| Descartado | Motivo |
| --- | --- |
| **Razonamiento generado del pitch** | El sistema no lo produce. **Es lo que H-02D retiró por falso.** Exigiría capacidad nueva en `domain/` y en el prompt |
| **Persistir el origen del análisis** *(H-02C C-3)* | 🔴 **Defecto real**, pero toca `application/` y persistencia. **La Biblioteca no participa en el flujo de demo** |
| **Motor de persistencia real** | En memoria basta. **F-2 Capa C** queda para el SaaS |
| **Subsistema comercial** *(`GenerateProposal`, diagnóstico, secuencia)* | **Bloqueado por B-1 y sin UI.** No participa en la demo |
| **Router en el frontend** | Las pestañas bastan. Coste sin retorno |
| **Pruebas de frontend** | ⚠️ **Deuda real** — cero cobertura del camino de demo. **No aumenta la capacidad de demostrar**, y el encargo lo excluye |
| **Multi-tenancy, auth, billing, CRM** | Congelados |

> ⚠️ **Sobre las pruebas de frontend:** se posponen conforme a la regla del sprint, **y conviene que conste que es deuda asumida**. Nada impide hoy reintroducir un dato inventado en la UI sin que ninguna prueba lo detecte.

---

# 8. Riesgos del plan

| # | Riesgo | Sev. | Mitigación |
| :-: | --- | :-: | --- |
| **1** | **Se aprueban las fases visuales y no la 0.** Demo preciosa que devuelve HTTP 400 | 🔴 **Alta** | **H-03.0 primero, sin excepción** |
| **2** | **El modelo Gemini no existe** ⇒ todo por respaldo ⇒ **la demo declara honestamente que no usa IA** | 🔴 Alta | **0.1 es la primera tarea del plan** |
| **3** | **Las ampliaciones de contrato no se aprueban** ⇒ H-03.2, H-03.3 y el Dashboard caen | 🟡 Media | §6.2 |
| **4** | **El coste de Places sorprende** en la presentación | 🟡 Media | 0.3 y 4.4 |
| **5** | **Se añaden features fuera del plan** por entusiasmo | 🟡 Media | La regla del encargo: *«¿esto aumenta la capacidad de demostrar?»* |
| **6** | **Arranque en frío de Cloud Run** ralentiza la demo | 🟡 Media | Instancia caliente durante la presentación |

---

# 9. Criterios de aceptación del sprint completo

| # | Criterio |
| :-: | --- |
| **1** | ✅ Una búsqueda real devuelve negocios reales con **`usedFallbackEngine === false`** |
| **2** | ✅ Un lead muestra **por qué** tiene su score, incluidos **los factores que no se pudieron medir** |
| **3** | ✅ El jurado ve **cuántas consultas a Places y cuántas llamadas a Gemini** produjo la búsqueda |
| **4** | ✅ **URL pública funcionando** |
| **5** | ✅ **Ninguna afirmación falsa** — se mantiene lo logrado en H-02 |
| **6** | ✅ `lint`, `tsc` y **197 pruebas** verdes en cada fase |
| **7** | ✅ **`domain/`, `application/` e `infrastructure/` sin modificar** |
| **8** | ✅ **Blueprint intacto** |

---

# 10. Referencias

**Activos identificados:** `src/modules/lead-hunter/presentation/LeadLibrary.tsx:168-215` *(`ScoreBreakdown`)* · `server/shared/observability/executionReport.ts:49-262` · `server/shared/contracts/leadLibrary.ts:69-124` *(precedente de DTO)* · `server/shared/mappers/leadLibraryMapper.ts:73-89` *(patrón `?? null`)*

**A modificar:** `server/shared/contracts/prospectSearch.ts:23-55` · `server/shared/mappers/leadResponseMapper.ts` · `server/routes/prospectSearchRoute.ts` · `src/shared/types/index.ts` · `src/modules/lead-hunter/domain/prospectMapper.ts` · `src/modules/lead-hunter/presentation/components/*` · `server.ts` · `Dockerfile` *(nuevo)*

**Sin modificar:** `server/modules/*/domain/` · `server/modules/*/application/` · `server/modules/*/infrastructure/` · `docs/blueprint/`

**Normativa:** DEV-00 R-38, R-45 · APS-08 §6, §8, §9, §11 · **ADR-06 §10** · ADR-07 §8

**Documentos:** H-02A · H-02B · H-02C · H-02D · H-01 · AKVEZ-02 · AKVEZ-HACKATHON-ROADMAP
