# H-02C — Auditoría de Visibilidad del Fallback

| Campo | Valor |
| --- | --- |
| Documento | **H-02C — Fallback Visibility Audit** |
| Clasificación | **Auditoría** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟢 **Auditoría cerrada.** **Cero cambios de código** |
| Fecha | 2026-08-04 |
| Antecedentes | H-02B *(Lead Hunter corregido)* · H-02A · H-02 · H-01 |

---

# 1. Resumen ejecutivo

| Dimensión | Estado |
| --- | :-: |
| **Transparencia IA** | 🟡 **Parcial** — corregida en Lead Hunter *(H-02B)*; **ausente en Lead Library**; **engañosa en Pitch Generator** |
| **Transparencia fallback** | 🔴 **Insuficiente** — la señal **es efímera**: se pierde al guardar el Lead, y en el Pitch se presenta como función premium |
| **Riesgo demo** | 🔴 **ALTO** — §3.3 documenta **cuatro** riesgos, uno de ellos **crítico y no detectado hasta hoy** |

> ### **El hallazgo que define esta auditoría:**
>
> **`PitchGenerator.tsx:381-390` muestra un bloque titulado «Consejo Táctico de Éxito», comentado en el código como *«Dynamic tactical explanation»*, cuyo contenido es TEXTO ESTÁTICO** que describe el problema del **menú en PDF del lead de muestra «La Fogata Parrilla»**.
>
> **Se renderiza para todos los leads, todos los canales y todos los mensajes**, afirmando analizar un texto que nunca lee.

---

# 2. Cadena auditada

| Capa | Archivo | Estado |
| --- | --- | :-: |
| **Agent** | `pitchGeneratorAgent.ts:47` — `isFallback?: boolean` en `PitchGeneratorOutcome` | ✅ **Correcto** |
| **Application** *(análisis)* | `analyzeProspects.ts:236,272` — `usedFallbackAnalysis` por lead | ✅ Correcto |
| **Application** *(pitch)* | `generateOutreachPitch.ts:88-90` — `isFallback: true` en la rama de respaldo | ✅ Correcto |
| **Application** *(persistencia)* | `analyzeProspects.ts:315-331` — **16 campos guardados** | 🔴 **`usedFallbackAnalysis` NO se guarda** |
| **DTO** *(búsqueda)* | `prospectSearch.ts:46-48` — `SearchResponseMetadata.usedFallbackEngine` | ⚠️ **Solo agregado**, no por lead |
| **DTO** *(pitch)* | `outreachPitch.ts:48` — `isFallback: boolean` | ✅ Correcto |
| **DTO** *(biblioteca)* | `leadLibrary.ts` — **sin campo de origen** | 🔴 **Ausente** |
| **Mapper** *(búsqueda)* | `leadResponseMapper.ts:38-45` — **no mapea** `usedFallbackAnalysis`, y lo documenta | ⚠️ Deliberado |
| **Mapper** *(pitch)* | `outreachResponseMapper.ts:67` — `isFallback: !!outcome.isFallback` | ✅ Correcto |
| **Mapper** *(biblioteca)* | `leadLibraryMapper.ts:78-89` — sin origen porque **no se persiste** | 🔴 Consecuencia |
| **Frontend** *(Hunter)* | `LeadHunter.tsx` + `searchProspects` + `searchMoreProspects` | ✅ **Corregido en H-02B** |
| **Frontend** *(Library)* | `LeadLibrary.tsx` — **no puede mostrarlo** | 🔴 **Sin dato** |
| **Frontend** *(Pitch)* | `PitchGenerator.tsx:59,356-366,381-390` | 🔴 **Engañoso** |

---

# 3. Hallazgos

## 3.1 ✅ Correcto

| # | Hallazgo | Evidencia |
| :-: | --- | --- |
| **A-1** | **El origen se determina en el punto correcto**: la rama que produce el análisis lo marca, sin inferencias | `analyzeProspects.ts:236,272` |
| **A-2** | **La agregación se propaga, no se infiere** | `prospectSearchRoute.ts:76-81` |
| **A-3** | **Cadena del pitch completa hasta el frontend** — Agent → Application → DTO → Mapper → UI | `pitchGeneratorAgent.ts:47` → `outreachResponseMapper.ts:67` |
| **A-4** | **Lead Hunter declara ambos estados con texto veraz** | H-02B |
| **A-5** | **Registro en consola con recuento exacto** | `analyzeProspects.ts:280,286-298` |
| **A-6** | **`LeadLibrary` maneja la ausencia de Score correctamente** — `typeof === "number"`, «—» | `LeadLibrary.tsx:242,323` |

## 3.2 ⚠️ Información existente pero no visible

| # | Hallazgo | Archivo · Línea | Riesgo |
| :-: | --- | --- | :-: |
| **B-1** | **`usedFallbackAnalysis` existe por lead y no cruza el DTO.** El mapper lo documenta como decisión deliberada | `leadResponseMapper.ts:38-45` | 🟡 Granularidad |
| **B-2** | **`fallbackCount` conoce el número exacto** *(«N de N»)* y solo llega a consola | `analyzeProspects.ts:280` | 🟡 Precisión perdida |
| **B-3** | **`confidence` y `coverage`** —la honestidad declarada del Score— no cruzan el DTO de búsqueda | `prospectSearch.ts:23-39` | 🟡 H-02 Bloque B |

## 3.3 🔴 Riesgo de demo engañosa

### C-1 — 🔴 **CRÍTICO · «Consejo Táctico de Éxito» es texto estático**

**`PitchGenerator.tsx:381-390`**

```
{/* Dynamic tactical explanation */}
…«Consejo Táctico de Éxito»…
"Este mensaje inicia directo con un halago honesto de su local en
 {activeLead.dateCreated ? "Colombia" : "su región"}, transiciona al error
 del menú estático sin criticar agresivamente, y propone enviar un boceto
 personalizado para aportarle valor premium de manera gratuita."
```

| Problema | Detalle |
| --- | --- |
| **El comentario dice *«Dynamic»*; el contenido es estático** | No lee `generatedPitch` en ningún punto |
| **Describe el lead de muestra** | *«el error del **menú estático**»* es el defecto de **«La Fogata Parrilla»** *(`App.tsx:19`: menú en PDF de 15 MB)* |
| **Se muestra para todos los leads y canales** | Una nota de LinkedIn —que **no admite ofertas ni enlaces**— sería descrita como *«propone enviar un boceto»* |
| **Afirma analizar un texto que no lee** | Es una **explicación fabricada presentada como razonamiento del sistema** |
| **`dateCreated ? "Colombia" : "su región"`** | La presencia de una fecha decide una palabra de geografía. **Sin significado** |

> ### **Un jurado que compare este «consejo» con el mensaje generado detectará que no se corresponden. Es el riesgo más grave del sistema visible.**

### C-2 — 🔴 **El aviso de respaldo del Pitch repite el patrón ya corregido en el Hunter**

**`PitchGenerator.tsx:356-366`** — *«Redactor de Respaldo Activo»*:

> *«**Debido a límites de cuotas temporales en el API**, nuestro **motor de inteligencia de respaldo local** ha redactado un mensaje **persuasivo optimizado para Colombia adaptado minuciosamente al dolor de este cliente**.»*

| Afirmación | Realidad |
| --- | --- |
| *«límites de cuotas temporales»* | 🔴 **Causa inventada.** Puede ser clave ausente, **modelo inexistente**, red o cuota. El sistema no lo sabe |
| *«motor de **inteligencia**»* | 🔴 `fallbackPitch.ts` es una **plantilla**, no inteligencia |
| *«**persuasivo optimizado** para Colombia»* | 🔴 Sobreafirmación sin respaldo |
| *«**adaptado minuciosamente** al dolor de este cliente»* | 🔴 **Lo contrario de lo que ocurre**: se usa la plantilla precisamente porque no hubo análisis del cliente |
| Encuadre | 🔴 **Degradación presentada como función premium** — mismo defecto que H-02B corrigió |

### C-3 — 🔴 **El origen del análisis NO se persiste: la Biblioteca no puede declararlo**

| Capa | Estado |
| --- | :-: |
| `analyzeProspects.ts:315-331` guarda **16 campos** | 🔴 **`usedFallbackAnalysis` no está entre ellos** |
| `contracts/LeadAnalysis.ts` | 🔴 **Sin campo de origen** |
| `LeadLibraryItemDTO` | 🔴 **Sin campo de origen** |
| `LeadLibrary.tsx` | 🔴 **No puede mostrarlo — no lo recibe** |

> ### **La señal es EFÍMERA.** Vive solo en la respuesta de búsqueda. **En cuanto el Lead se guarda, se pierde para siempre.**
>
> **La Biblioteca es donde los Leads viven a largo plazo, y es precisamente donde el origen es indistinguible.** Un Lead analizado por heurística y otro por IA se ven **idénticos** allí.

### C-4 — 🟡 **Detección del respaldo del Pitch por cadena mágica**

**`PitchGenerator.tsx:59`** escribe `pitchMessage: "utilizando_respaldo_local"` y **`:356`** lo detecta con `.includes("respaldo")`.

| Problema | Detalle |
| --- | --- |
| Un campo destinado al **mensaje** se usa como **bandera** | `pitchMessage` en `Prospect` |
| **Detección por subcadena** | Cualquier texto que contenga *«respaldo»* activaría el aviso |
| **Se persiste en `localStorage`** | La bandera sobrevive; el estado real, no |

### C-5 — 🟡 **Sobreafirmación en la cabecera principal**

**`App.tsx:229`** — *«escanea en tiempo real para extraer leads **verificados** con **alta viabilidad comercial**»*.

**El sistema no verifica leads ni garantiza viabilidad.** Devuelve negocios de Places con un Score calculado.

---

# 4. Respuestas a las tareas

## 4.1 Tarea 1 — Origen del fallback

| Pregunta | Respuesta |
| --- | --- |
| **¿Dónde se determina?** | `analyzeProspects.ts` — rama con IA `:236`, rama de respaldo `:272` |
| **¿Qué propiedad?** | `usedFallbackAnalysis: boolean` por lead · `metadata.usedFallbackEngine` agregado · `metadata.isFallback` en el pitch |
| **¿Global o individual?** | **Individual internamente, global públicamente.** El DTO solo publica el agregado |
| **¿Se conserva al guardar?** | 🔴 **NO.** No se persiste *(C-3)* |

## 4.2 Tarea 2 — Lead Hunter

| Criterio | Estado |
| --- | :-: |
| Muestra análisis de IA cuando existe | ✅ **Sí** *(H-02B)* |
| Aviso claro de fallback | ✅ **Sí, veraz** *(H-02B)* |
| Ausencia cuando no hay análisis | ✅ **Sí** *(H-02A)* |
| Textos que exageren | ✅ **Retirados** |
| Heurística presentada como IA | ✅ **Corregido** |
| Datos inventados | ✅ **Eliminados** |
| Etiquetas ambiguas | ✅ **Score y estado web separados** |

> **Lead Hunter es hoy la capa más sana. Sirve de referencia para las otras dos.**

## 4.3 Tarea 3 — Lead Library

| Pregunta | Respuesta |
| --- | :-: |
| **¿Un lead guardado conserva el origen?** | 🔴 **NO** |
| **¿El usuario puede saberlo después?** | 🔴 **NO.** Ni en la UI, ni en el DTO, ni en la base |

**Lo que la Biblioteca sí hace bien:** expone el Score completo *(`band`, `breakdown`, `confidence`, `coverage`, `scoreVersion`)* y **maneja la ausencia correctamente**. **Su defecto es exclusivamente el origen del análisis.**

## 4.4 Tarea 4 — Pitch Generator

| Criterio | Estado |
| --- | :-: |
| ¿Una propuesta con fallback se distingue? | ⚠️ **Sí, pero con texto engañoso** *(C-2)* |
| ¿Afirma capacidades inexistentes? | 🔴 **SÍ** — C-1 y C-2 |

## 4.5 Tarea 5 — Granularidad

**Escenario: 10 leads · 2 fallback · 8 IA.**

> ## 🟡 **MEJORABLE — solo existe aviso global**

**El usuario sabe que *alguno* fue heurístico. No sabe *cuáles*.** El dato existe por lead *(`usedFallbackAnalysis`)*, y **el mapper lo retiene deliberadamente**.

⚠️ **No es 🔴 porque existe diferenciación a nivel de búsqueda, y el aviso es ahora veraz.** **No es 🟢 porque cada lead no tiene estado propio visible.**

**Nota:** `fallbackCount` conoce el número exacto *(«2 de 10»)* y **solo llega a consola**. **Publicar el recuento no exige cambiar el contrato**: `SearchResponseMetadata` está declarado *«contenedor extensible»*.

## 4.6 Tarea 6 — Textos públicos

| Término | Hallazgo |
| --- | :-: |
| **«certificado»** | ✅ **Eliminado** en H-02B |
| **«100% reales y verificadas»** | ✅ **Eliminado** en H-02B |
| **«verificados»** | 🔴 **`App.tsx:229`** — *«leads verificados con alta viabilidad comercial»* |
| **«motor»** | 🔴 **`PitchGenerator.tsx:363`** — *«motor de inteligencia de respaldo local»* |
| **«inteligencia»** | 🔴 Ídem — la plantilla no es inteligencia |
| **«premium»** | 🟡 `PitchGenerator.tsx:388` *(dentro de C-1)* · resto es estilo del usuario, aceptable |
| **«IA» / «Gemini»** | ✅ Uso correcto donde aparece |
| **«automático»** | ✅ Sin hallazgos |

---

# 5. Cambios recomendados

## 5.1 Sin código

| # | Acción | Motivo |
| :-: | --- | --- |
| **S-1** | **No usar «La Fogata Parrilla» en la demo** hasta corregir C-1 | El «consejo táctico» coincidiría por casualidad y ocultaría el defecto |
| **S-2** | **Verificar el modelo `gemini-3.5-flash`** | Si no existe, **todo** irá por respaldo |
| **S-3** | **Guion de demo que no abra la Biblioteca** para hablar de IA | El origen no es distinguible allí *(C-3)* |

## 5.2 Requieren implementación

**Ordenados por riesgo. Ninguno implementado.**

| # | Cambio | Archivo | Tipo | ¿Contrato? |
| :-: | --- | --- | :-: | :-: |
| **I-1** | 🔴 **Retirar o hacer real el «Consejo Táctico»** | `PitchGenerator.tsx:381-390` | **A** | ❌ **No** |
| **I-2** | 🔴 **Reescribir el aviso de respaldo del Pitch** con el criterio de H-02B | `PitchGenerator.tsx:356-366` | **A** | ❌ **No** |
| **I-3** | 🔴 **Corregir `App.tsx:229`** — retirar *«verificados»* y *«alta viabilidad»* | `App.tsx` | **A** | ❌ **No** |
| **I-4** | 🟡 **Indicador positivo en el Pitch** *(«Redactado con IA»)*, simétrico al del Hunter | `PitchGenerator.tsx` | **A** | ❌ No |
| **I-5** | 🟡 **Sustituir la cadena mágica** por un campo booleano propio | `PitchGenerator.tsx` + `types` | **A** | ❌ No |
| **I-6** | 🟡 **Publicar `fallbackCount`** en `SearchResponseMetadata` | `prospectSearch.ts` + ruta | **C** | ⚠️ **Aditivo** |
| **I-7** | 🟡 **Origen por lead** en `LeadResponseDTO` | mapper + DTO | **C** | ⚠️ **ADR-06** |
| **I-8** | 🔴 **Persistir el origen del análisis** | `LeadAnalysis` contract + `analyzeProspects` + biblioteca | **C** | ⚠️ **Toca `application/` y persistencia** |

> ### **I-1, I-2 e I-3 son Tipo A, solo frontend, sin contrato y sin arquitectura. Cubren los tres riesgos 🔴 visibles.**
>
> **I-8 es el único que toca `application/` y persistencia** — requiere análisis propio, **fuera del alcance de un sprint de demo**.

---

# 6. Decisión final

## 6.1 ¿Puede AKVEZ demostrar transparencia de IA actualmente?

> ## 🟡 **PARCIALMENTE — solo en Lead Hunter.**

| Pantalla | ¿Transparente? |
| --- | :-: |
| **1 · Lead Hunter** | ✅ **Sí** — declara IA y respaldo con texto veraz |
| **2 · Lead Library** | 🔴 **No** — el origen **no existe** en sus datos |
| **3 · Pitch Generator** | 🔴 **No** — **afirma capacidades inexistentes** |

## 6.2 ¿Existe riesgo de que un jurado interprete fallback como IA real?

> ## 🔴 **SÍ, y por dos vías distintas.**

| Vía | Descripción |
| :-: | --- |
| **1 · Activa** | El aviso del Pitch **afirma** que un motor *«de inteligencia»* redactó algo *«adaptado minuciosamente al dolor de este cliente»*. **No solo no desmiente: afirma lo contrario de la realidad** |
| **2 · Estructural** | El **«Consejo Táctico»** presenta un texto estático como análisis del mensaje generado. **Un jurado que lea ambos verá que no se corresponden** |

> **La vía 2 es la más peligrosa: no requiere que el respaldo se active.** **Ocurre siempre, incluso con Gemini funcionando perfectamente.**

## 6.3 Siguiente sprint recomendado

> ### **H-02D — Pitch Generator Integrity**

| Alcance | Detalle |
| --- | --- |
| **Contenido** | **I-1, I-2, I-3, I-4** |
| **Tipo** | **A — solo frontend** |
| **Ficheros** | `PitchGenerator.tsx` · `App.tsx` |
| **Contratos** | ❌ **Ninguno** |
| **Arquitectura** | ❌ **Ninguna** |
| **Aprobación previa** | ❌ **No requiere** |

**Justificación:** cierra **los tres riesgos 🔴 visibles** con el mismo criterio ya aplicado y validado en H-02B, sin tocar contratos ni arquitectura. **Deja el sistema visible coherente en las tres pantallas.**

**Después, y con decisión propia:** **I-8** *(persistir el origen)* es el único defecto estructural, y **exige análisis de impacto sobre `application/` y persistencia**.

---

# 7. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| **Cambios de código** | **0** — verificado por fecha |
| **Blueprint** | ✅ **Intacto** |
| **Pruebas modificadas** | **0** |

---

# 8. Referencias

`server/modules/lead-analyzer/application/analyzeProspects.ts:236,272,280,286-298,315-331` · `server/modules/lead-analyzer/domain/fallbackAnalysis.ts` · `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts:47` · `server/modules/pitch-generator/application/generateOutreachPitch.ts:88-90` · `server/modules/pitch-generator/domain/fallbackPitch.ts` · `server/routes/prospectSearchRoute.ts:76-81,87` · `server/routes/prospectOutreachRoute.ts:30` · `server/shared/contracts/prospectSearch.ts:41-55` · `server/shared/contracts/outreachPitch.ts:48` · `server/shared/contracts/leadLibrary.ts` · `server/shared/persistence/contracts/LeadAnalysis.ts` · `server/shared/mappers/leadResponseMapper.ts:38-45` · `server/shared/mappers/outreachResponseMapper.ts:20,27,67` · `server/shared/mappers/leadLibraryMapper.ts:78-89` · `src/App.tsx:19,229` · `src/modules/lead-hunter/presentation/LeadHunter.tsx` · `src/modules/lead-hunter/presentation/LeadLibrary.tsx:233,242,323` · `src/modules/pitch-generator/presentation/PitchGenerator.tsx:59,356-366,378-390` · `src/shared/types/index.ts:41`

**Documentos:** H-02B · H-02A · H-02 · H-01 · AKVEZ-02 · DEV-00 R-38, R-45, R-64 · ADR-06
