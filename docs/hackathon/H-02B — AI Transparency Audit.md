# H-02B — Auditoría de Transparencia de IA

| Campo | Valor |
| --- | --- |
| Documento | **H-02B — AI Transparency Audit** |
| Clasificación | **Auditoría de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado** · ⚠️ **Tarea 4 NO ejecutable** — §6 |
| Fecha | 2026-08-04 |
| Antecedentes | **H-02A** *(completado, no repetido)* · H-02 · H-01 · AKVEZ-02 |

---

# 0. El hallazgo

**H-02 supuso que el distintivo de respaldo no existía. Existía — y era el problema.**

> ### **`LeadHunter.tsx` ya mostraba un aviso cuando el respaldo actuaba, y su texto afirmaba tres cosas falsas.**

**Texto anterior, literal:**

> *«**Servidor Seguro de Respaldos Activo**. Se ha alcanzado temporalmente el límite diario de cuotas de consulta en **Google Search Grounding** o el API principal de Google GenAI. El sistema ha activado autónomamente el **motor certificado de respaldo**, cargando de inmediato **perfiles comerciales de pymes colombianas 100% reales y verificadas** para que sigas prosiguiendo con tu prospección sin paradas.»*

| # | Afirmación | Realidad |
| :-: | --- | --- |
| **1** | *«cargando… perfiles comerciales de pymes colombianas 100% reales y verificadas»* | 🔴 **FALSO.** El respaldo **no carga ningún perfil**. Analiza **los mismos negocios** que devolvió Google Places, con reglas heurísticas *(`fallbackAnalysis.ts:11-37`)* |
| **2** | *«motor **certificado** de respaldo»* | 🔴 **Nada está certificado.** Es una función de dominio de ~60 líneas |
| **3** | *«límite diario de cuotas en **Google Search Grounding**»* | 🔴 **`groundingSearchAdapter` está huérfano** — el Composition Root no lo construye. **Nunca se invoca** |

**Y un cuarto problema, de fondo:**

> ### **Presentaba una degradación como una función** —*«Servidor Seguro»*, *«sin paradas»*— **y no mencionaba lo único que realmente cambia: que el análisis no lo hizo la IA.**

> **Un aviso que explica el fallo con una historia falsa es peor que no tener aviso.** Ante un jurado, la afirmación 1 es especialmente grave: sugiere que el sistema **sustituye resultados reales por una base curada**, que es exactamente la demo falsa que H-02 quería impedir.

---

# 1. Tarea 1 — Flujo completo de `usedFallbackEngine`

| # | Etapa | Fichero | Estado |
| :-: | --- | --- | :-: |
| **1** | **Origen por lead** — `usedFallbackAnalysis: false \| true` según la rama que produjo el análisis | `analyzeProspects.ts:236,272` | ✅ |
| **2** | **Registro en consola** — *«Gemini no devolvió análisis para N de N lead(s)»* | `analyzeProspects.ts:280,286-298` | ✅ |
| **3** | **Agregación** — `leads.some(l => l.usedFallbackAnalysis === true)` | `prospectSearchRoute.ts:81` | ✅ |
| **4** | **Contrato público** — `SearchResponseMetadata.usedFallbackEngine?: boolean` | `prospectSearch.ts:46-48` | ✅ |
| **5** | **Frontera HTTP** — `metadata: { usedFallbackEngine }` | `prospectSearchRoute.ts:87` | ✅ |
| **6a** | **Aplicación · búsqueda** | `searchProspects.ts:15,37` | ✅ |
| **6b** | **Aplicación · «Buscar más»** | `searchMoreProspects.ts` | 🔴 **SE PERDÍA** |
| **7** | **Estado de UI** | `LeadHunter.tsx:53,111` | ⚠️ Solo desde búsqueda inicial |
| **8** | **Render** | `LeadHunter.tsx:252` | 🔴 **Texto falso** |

## 1.1 Nota sobre el lead individual

**`leadResponseMapper.ts:38-45` NO mapea `usedFallbackAnalysis` al DTO**, y lo documenta como decisión deliberada: *«no es un campo público de LeadResponseDTO — la señal pública equivalente es `SearchResponseMetadata.usedFallbackEngine`»*.

> **Consecuencia: la señal es agregada, no por lead.** Con 10 leads de los que 2 usaron respaldo, se sabe que **alguno** lo usó, **no cuáles**. Exponerlo por lead exigiría **modificar el contrato público** — fuera del alcance de este sprint *(§5)*.

---

# 2. Tarea 2 — Dónde se perdía el dato

**Dos pérdidas, ninguna en el backend.**

## 2.1 🔴 Pérdida 1 — «Buscar más» no propagaba la señal

`SearchMoreProspectsResult` **no declaraba el campo**, y ninguno de sus cuatro `return` lo devolvía. `searchProspects` sí lo hacía desde su creación.

**Efecto:** una segunda tanda analizada por respaldo se incorporaba a la lista **sin quedar declarada**. Si la primera búsqueda usó IA, el aviso **no aparecía nunca**.

## 2.2 🔴 Pérdida 2 — el consumo sobrescribía en lugar de acumular

`handleSearchMore` *(línea 123)* **nunca tocaba `setUsedFallbackEngine`**. Y aunque lo hubiera hecho con asignación directa, habría sido incorrecto: **los resultados se acumulan** *(`setSearchResults(prev => [...prev, ...])`)*, de modo que una tanda con IA habría **borrado** la advertencia de una tanda anterior con respaldo.

> **La semántica correcta es acumulativa:** si **cualquier** tanda de la lista mostrada usó respaldo, la advertencia debe seguir en pie.

---

# 3. Tarea 3 — Qué se implementó, solo en UI

## 3.1 Ficheros modificados — 2, ambos en `src/`

| # | Fichero | Cambio |
| :-: | --- | --- |
| **1** | `src/modules/lead-hunter/application/searchMoreProspects.ts` | `usedFallbackEngine` en el tipo de resultado y en **los cuatro `return`** |
| **2** | `src/modules/lead-hunter/presentation/LeadHunter.tsx` | Acumulación de la señal · **texto veraz** · **indicador positivo** · import de `Sparkles` |

**`server/` intacto.** Verificado por fecha. **Contratos públicos sin tocar** — el dato **ya estaba publicado**; solo faltaba consumirlo.

## 3.2 Propagación completada

```ts
// searchMoreProspects.ts — los cuatro caminos de retorno
usedFallbackEngine: !!data.metadata?.usedFallbackEngine   // éxito y lista vacía
usedFallbackEngine: false                                  // error de servidor y excepción
```

## 3.3 Acumulación

```ts
setUsedFallbackEngine(prev => prev || result.usedFallbackEngine);
```

## 3.4 Texto veraz

| Elemento | Ahora |
| --- | --- |
| **Título** | *«Análisis sin IA — motor heurístico de respaldo»* |
| **Qué pasó** | *«El modelo generativo no respondió, y **al menos un negocio de esta lista se analizó con reglas heurísticas en lugar de IA**»* |
| **Qué sigue siendo cierto** | *«Los negocios **sí son reales**: proceden de Google Places»* |
| **Qué exactamente no es IA** | *«la descripción, los problemas detectados y el ángulo de oportunidad se derivaron de la presencia y el estado del sitio web, no de una lectura del negocio»* |

**Retirado:** toda mención a *«perfiles cargados»*, *«certificado»*, *«Google Search Grounding»* y al encuadre de la degradación como función. **También el `animate-pulse` del icono**, que dramatizaba el aviso.

> **Se conserva lo que sí es cierto y conviene decir: los negocios son reales.** La distinción precisa —**negocio real, análisis heurístico**— es la que un jurado necesita.

## 3.5 ⭐ Transparencia simétrica — indicador positivo

**El sprint pide hacer visible *«cuándo AKVEZ usa IA real Y cuándo usa fallback»*. Solo existía la mitad negativa.**

> *«**Analizado con IA.** Los N negocios de esta lista proceden de Google Places y fueron analizados por el modelo generativo.»*

| Ventaja | Detalle |
| --- | --- |
| **Elimina el silencio ambiguo** | Antes, «sin aviso» podía significar *IA activa* o *aún no ha pasado nada* |
| **Es verificable** | La afirmación es exactamente `usedFallbackEngine === false` sobre una lista con resultados |
| **Sirve a la demo** | El jurado ve una afirmación explícita de uso de IA, no una ausencia de advertencia |

⚠️ **Solo se muestra con resultados en pantalla** — ambos avisos viven dentro de `displayedLeads.length > 0 && !searching`, de modo que el estado inicial `false` no produce una afirmación falsa.

---

# 4. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Antes → después | **197 → 197** · **0 pruebas modificadas** |
| Ficheros de `server/` modificados | **0** |

> **Un error de compilación detectado y corregido:** `Sparkles` no estaba importado en `LeadHunter.tsx`. `tsc` lo señaló *(TS2304)* antes de cerrar.

---

# 5. Tarea 5 — Nada fuera de la UI

| Pregunta | Respuesta |
| --- | :-: |
| ¿Se modificó `domain/` del backend? | ❌ **No** |
| ¿`application/` del backend? | ❌ **No** |
| ¿`infrastructure/`? | ❌ **No** |
| ¿Contratos públicos? | ❌ **No** — `SearchResponseMetadata` ya publicaba el campo |
| ¿Modelo Gemini? | ❌ **No** — `gemini-3.5-flash` intacto en ambos adapters |
| ¿Se rompió compatibilidad? | ❌ **No** — `usedFallbackEngine` es **añadido** a un tipo interno del frontend |
| **Clasificación** | **Tipo A — Demo UX** |

> **La «necesidad demostrada» de tocar contratos no se dio.** El backend ya publicaba todo lo necesario: el trabajo era **consumirlo**.

---

# 6. ⚠️ Tarea 4 — NO ejecutable

**«Validar ejecución real con Gemini API y Places API» no se ha realizado, y no se simula un resultado.**

## 6.1 Comprobación efectuada

```
GOOGLE_PLACES_API_KEY: AUSENTE
GEMINI_API_KEY:        AUSENTE
.env:                  NO EXISTE
```

## 6.2 Por qué no basta con crear un `.env`

**`dotenv` está declarado en `package.json:19` y nunca se importa.** `"dev": "tsx server.ts"` no pasa `--env-file`.

> **Un `.env` sería ignorado.** Las variables deben **exportarse en el shell** o inyectarlas la plataforma.

## 6.3 Qué haría falta

| # | Requisito | Bloqueado por |
| :-: | --- | --- |
| **1** | `GOOGLE_PLACES_API_KEY` exportada | Credencial no disponible |
| **2** | **Places API (New)** habilitada con facturación | Configuración GCP |
| **3** | `GEMINI_API_KEY` exportada | Credencial no disponible |
| **4** | **Verificar que `gemini-3.5-flash` existe** | ⚠️ **Sin verificar desde H-01** |
| **5** | Cargar `dotenv` **o** exportar en shell | H-02 D-2, **no autorizado** |

## 6.4 Lo que la validación real debe comprobar

**Cuando haya credenciales, estos son los dos casos que este sprint deja preparados:**

| Caso | Cómo forzarlo | Resultado esperado |
| --- | --- | :-: |
| **IA activa** | Búsqueda con ambas credenciales válidas | 🟢 *«Analizado con IA»* · `usedFallbackEngine === false` |
| **Respaldo** | Búsqueda **sin** `GEMINI_API_KEY`, con Places válida | 🟠 *«Análisis sin IA»* · `usedFallbackEngine === true` |
| **Acumulación** | Buscar con IA, luego «Buscar más» sin Gemini | 🟠 **El aviso naranja debe aparecer y permanecer** |

> ### **El caso «respaldo» es hoy trivial de reproducir: basta con NO definir `GEMINI_API_KEY`**, que es el estado actual. **Con solo la clave de Places, la demo ya ejercita la ruta de respaldo y la declara correctamente.**

---

# 7. Estado de la transparencia

| Señal | Antes | Ahora |
| --- | :-: | :-: |
| Respaldo en búsqueda inicial | ⚠️ Visible, **con texto falso** | ✅ **Visible y veraz** |
| Respaldo en «Buscar más» | 🔴 **Invisible** | ✅ **Visible y acumulativo** |
| **IA activa** | 🔴 **Nunca declarada** | ✅ **Declarada** |
| Respaldo **por lead** | 🔴 No disponible | 🔴 **Sigue sin estarlo** — §7.1 |
| Fallo del pitch *(`isFallback`)* | 🔴 No mostrado | 🔴 **Sigue sin mostrarse** — §7.2 |

## 7.1 Pendiente — granularidad por lead

**Requiere mapear `usedFallbackAnalysis` a `LeadResponseDTO`: contrato público, gobernado por ADR-06.** Fuera de alcance.

**Impacto actual:** con 10 leads y 2 en respaldo, el usuario sabe que **alguno** es heurístico, no **cuáles**. **Para la demo el aviso agregado es suficiente y honesto**; para producto, no.

## 7.2 Pendiente — Pantalla 3

**`PitchGeneratorOutcome` ya declara `isFallback?: boolean`** *(`pitchGeneratorAgent.ts:47`)* y `generateOutreachPitch.ts:90` lo emite. **Verificar si `PitchGenerator.tsx` lo consume** — si no, la Pantalla 3 tiene hoy la misma ceguera que tenía la Pantalla 1.

---

# 8. Riesgo residual

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **El modelo `gemini-3.5-flash` sigue sin verificar.** Si no existe, **toda** ejecución mostrará el aviso naranja — correcto, pero la demo nunca enseñará IA | 🔴 **Alta** |
| **2** | **Sin credenciales no hay validación real.** Todo lo de este sprint está verificado por lectura y por `tsc`, **no por ejecución** | 🔴 Alta |
| **3** | **Granularidad por lead ausente** | 🟡 Media |
| **4** | **Pantalla 3 sin verificar** | 🟡 Media |
| **5** | **Cero pruebas de frontend** — nada impide que un cambio futuro reintroduzca el texto falso | 🟡 Media |

---

# 9. Siguiente paso recomendado

| # | Acción | Requiere aprobación |
| :-: | --- | :-: |
| **1** | **Verificar el modelo Gemini** | ❌ No |
| **2** | **Exportar credenciales y ejecutar los tres casos de §6.4** | ❌ No |
| **3** | **Comprobar si `PitchGenerator.tsx` usa `isFallback`** *(§7.2)* | ❌ No — auditoría |
| **4** | Granularidad por lead | ✅ **Sí — ADR-06** |

> **Los pasos 1-3 no tocan arquitectura.** El 2 es el único que puede confirmar que lo implementado funciona de verdad.

---

# 10. Referencias

**Modificados:** `src/modules/lead-hunter/application/searchMoreProspects.ts` · `src/modules/lead-hunter/presentation/LeadHunter.tsx`

**Consultados sin modificar:** `server/modules/lead-analyzer/application/analyzeProspects.ts:236,272,280,286-298` · `server/modules/lead-analyzer/domain/fallbackAnalysis.ts:11-37` · `server/routes/prospectSearchRoute.ts:81,87` · `server/shared/contracts/prospectSearch.ts:41-55` · `server/shared/mappers/leadResponseMapper.ts:38-45` · `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts:47` · `server/modules/pitch-generator/application/generateOutreachPitch.ts:90` · `server/shared/config/env.ts` · `src/modules/lead-hunter/application/searchProspects.ts:15,37` · `package.json:7,19`

**Documentos:** H-02A · H-02 §6.3 *(Bloque C)* · H-01 · AKVEZ-02 §1.2, §3 · DEV-00 **R-64** · APS-03 §12 · PO-01 §8 · ADR-06
