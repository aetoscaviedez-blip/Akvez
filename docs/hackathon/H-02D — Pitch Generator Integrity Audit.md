# H-02D — Auditoría de Integridad del Pitch Generator

| Campo | Valor |
| --- | --- |
| Documento | **H-02D — Pitch Generator Integrity Audit** |
| Clasificación | **Auditoría de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y verificado** |
| Fecha | 2026-08-04 |
| Antecedentes | **H-02C** *(hallazgos)* · H-02B · H-02A |

---

# 1. Validaciones

| Comprobación | Antes | Después |
| --- | :-: | :-: |
| `npm run lint` | ✅ limpio | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ limpio | ✅ **limpio** |
| `npm test` | **197** · 26 ficheros | **197** · 26 ficheros |
| Pruebas modificadas | — | **0** |

**Dos errores de compilación detectados y corregidos durante el sprint:** `pitchSource` sin declarar *(TS2304 ×3)* e importación de `Lightbulb` sin uso tras retirar el bloque.

---

# 2. Archivos modificados — 4, todos en `src/`

| # | Archivo | Cambio |
| :-: | --- | --- |
| **1** | `src/shared/types/index.ts` | **+`PitchSource`** *(3 estados)* · **+`pitchSource`** · **+`isDemo`** |
| **2** | `src/modules/pitch-generator/presentation/PitchGenerator.tsx` | **I-1**, **I-2**, aviso de Lead de ejemplo, selector rotulado |
| **3** | `src/App.tsx` | **I-3** — `isDemo: true` en las muestras · corrección de sobreafirmación |
| **4** | `src/modules/lead-hunter/presentation/components/LeadCard.tsx` | Distintivo *«Dato de ejemplo»* |

> ⚠️ **Nota de ruta:** el sprint indicaba `src/components/PitchGenerator.tsx`. **La ruta real es `src/modules/pitch-generator/presentation/PitchGenerator.tsx`** — el fichero se movió en la reestructuración modular. Es el mismo componente.

## 2.1 Verificación de no intervención

| Ámbito | Estado |
| --- | :-: |
| **`server/`** *(íntegro)* | ✅ **Intacto** — verificado por fecha |
| Dominio · agentes · prompts de Gemini | ✅ **No tocados** |
| **Contratos existentes** | ✅ **No modificados** |
| `docs/blueprint/` | ✅ **Intacto** |
| Modelos nuevos | ✅ **Ninguno** |

> **No apareció ninguna necesidad de contrato nuevo.** El backend ya publicaba `metadata.isFallback` *(`outreachPitch.ts:48`)*; **el trabajo era consumirlo correctamente.**

---

# 3. I-1 — Contenido estático presentado como análisis

## 3.1 Qué se retiró

**`PitchGenerator.tsx`, bloque «Consejo Táctico de Éxito»** — comentado en el código como *«Dynamic tactical explanation»*:

> *«Este mensaje inicia directo con un halago honesto de su local en {`dateCreated ? "Colombia" : "su región"`}, transiciona al **error del menú estático** sin criticar agresivamente, y propone enviar un **boceto personalizado** para aportarle **valor premium** de manera gratuita.»*

| Defecto | Detalle |
| --- | --- |
| **Estático, no dinámico** | **No leía `generatedPitch` en ningún punto** |
| **Describía el lead de muestra** | *«el error del menú estático»* es el defecto de **«La Fogata Parrilla»** *(menú en PDF de 15 MB)* |
| **Se mostraba siempre** | Todos los leads, canales y mensajes. Una nota de LinkedIn —que **no admite ofertas ni enlaces**— quedaba descrita como *«propone enviar un boceto»* |
| **Afirmaba analizar** | Presentaba texto fijo como razonamiento del sistema |
| **`dateCreated ? "Colombia" : "su región"`** | La presencia de una fecha decidía una palabra de geografía |

## 3.2 Decisión: retirar, no reetiquetar

**El sprint permitía retirarlo o marcarlo como plantilla o ejemplo. Se retiró.**

| Motivo |
| --- |
| **Marcarlo como «sugerencia genérica» seguiría siendo falso**: el texto describe **un negocio concreto** —el del menú en PDF—, no un consejo general |
| **El valor que pretendía aportar ya existe y es real**: el **ángulo de oportunidad** del análisis, visible en la tarjeta del Lead |
| **No se sustituye por otra explicación generada**: el sistema **no produce ninguna hoy**. Inventar una sería repetir el defecto |

**En su lugar queda un comentario que documenta qué había, por qué se retiró y qué exigiría recuperarlo** —que la redacción devuelva su propia explicación: **decisión de producto, no de interfaz**.

---

# 4. I-2 — Origen del pitch, con tres estados

## 4.1 El tipo

```ts
export type PitchSource = 'AI_GENERATED' | 'FALLBACK_TEMPLATE' | 'UNAVAILABLE';
```

## 4.2 Cómo se registra

**`metadata.isFallback` ya viajaba** desde `generateOutreachPitch.ts:90` hasta el frontend por el contrato público. **Ahora se guarda como estado explícito:**

```ts
pitchSource: data.metadata?.isFallback ? "FALLBACK_TEMPLATE" : "AI_GENERATED"
```

## 4.3 🔴 Lo que sustituye — la cadena mágica

| Antes | Ahora |
| --- | --- |
| `pitchMessage: "utilizando_respaldo_local"` | `pitchSource: "FALLBACK_TEMPLATE"` |
| Detección: `pitchMessage.includes("respaldo")` | Comparación de estado |

> **Se usaba un campo destinado al mensaje como bandera, y se detectaba por subcadena.** **Cualquier pitch real que contuviera la palabra *«respaldo»* habría activado el aviso.**

## 4.4 Los cuatro casos visibles

| Estado | Cuándo | Qué se muestra |
| --- | --- | --- |
| **`AI_GENERATED`** | Gemini respondió | 🟢 *«**Redactado con IA.** Este texto lo generó el modelo a partir de los datos de este negocio.»* |
| **`FALLBACK_TEMPLATE`** | El modelo no respondió | 🟠 *«**Plantilla de respaldo — sin IA.** … **Este texto procede de una plantilla**, no de una redacción personalizada. Revísalo antes de enviarlo: **no se ha adaptado al análisis de este negocio**.»* |
| **`UNAVAILABLE`** | No hay pitch | El bloque de resultado no se renderiza |
| **`undefined`** | ⚠️ **Pitch anterior a este sprint** | ⚪ *«**Origen no registrado.** … **No consta si lo produjo la IA o una plantilla.**»* |

### ⚠️ Sobre el cuarto caso

**El sprint pedía tres estados. El cuarto no es un estado nuevo: es la ausencia de dato.**

**Los Leads guardados en `localStorage` antes de este sprint tienen `generatedPitch` pero no `pitchSource`.** Atribuirlos a la IA sería **exactamente la afirmación falsa que el sprint elimina**. `resolvePitchSource` recupera los que llevaban la cadena mágica y **declara desconocidos los demás**.

## 4.5 El texto del aviso de respaldo, corregido

| Afirmación retirada | Motivo |
| --- | --- |
| *«Debido a **límites de cuotas temporales** en el API»* | **Causa inventada.** Puede ser credencial ausente, **modelo inexistente**, red o cuota |
| *«nuestro **motor de inteligencia** de respaldo local»* | `fallbackPitch.ts` es **una plantilla** |
| *«mensaje **persuasivo optimizado** para Colombia»* | Sobreafirmación sin respaldo |
| *«**adaptado minuciosamente al dolor de este cliente**»* | 🔴 **Lo contrario de la realidad:** la plantilla se usa **porque no hubo** análisis del cliente |
| `animate-pulse` en el icono | Dramatizaba el aviso |

---

# 5. I-3 — Datos demo

## 5.1 Marca en origen

**`App.tsx`** — los dos Leads de muestra llevan **`isDemo: true`**, con una cabecera que declara qué son y por qué la marca no es decorativa.

> **No se eliminaron.** El sprint permite que existan **marcados**, y borrarlos dejaría la aplicación vacía al arrancar.

## 5.2 Dónde se declara

| Ubicación | Distintivo |
| --- | --- |
| **`LeadCard.tsx`** | 🟡 **«⚠️ Dato de ejemplo — no es un resultado real»**, primer distintivo de la tarjeta |
| **Selector del Pitch** | `⚠️ EJEMPLO` como prefijo, frente a `🗺️` en los reales |
| **Panel del Lead activo** | 🟡 *«**Lead de ejemplo.** Este negocio no procede de una búsqueda real: sus datos son ficticios. **Cualquier mensaje generado a partir de él describirá un negocio que no existe.**»* |

## 5.3 Por qué el aviso del Pitch importa

> **Generar un pitch sobre un Lead de ejemplo produce un texto convincente sobre un negocio que no existe.** Y el pitch sería **legítimamente `AI_GENERATED`** —la IA sí lo redactó—, de modo que **el indicador verde sería correcto y la demo seguiría siendo falsa**.
>
> **El origen del pitch y la veracidad del Lead son dos preguntas distintas, y ahora ambas se responden.**

## 5.4 Sobreafirmación corregida

**`App.tsx`**, cabecera de la pestaña Hunter:

| Antes | Ahora |
| --- | --- |
| *«extraer leads **verificados** con **alta viabilidad comercial**»* | *«buscar **negocios reales en Google Places** con su **Opportunity Score calculado**»* |

**El sistema no verifica negocios ni garantiza viabilidad.** El texto nuevo describe lo que sí hace.

---

# 6. I-4 — Las cuatro preguntas del jurado

| Pregunta | ¿Puede responderse sin explicación externa? |
| --- | :-: |
| **¿Análisis IA real?** | ✅ Hunter: *«Analizado con IA»* · Pitch: *«Redactado con IA»* |
| **¿Fallback heurístico?** | ✅ Hunter: *«Análisis sin IA»* · Pitch: *«Plantilla de respaldo — sin IA»* |
| **¿Plantilla genérica?** | ✅ El aviso de respaldo lo dice literalmente. **El «Consejo Táctico» estático ya no existe** |
| **¿Ausencia de información?** | ✅ Score `—` *«Sin evaluar»* · *«No se detectaron problemas»* · *«No se generó un ángulo»* · *«Origen no registrado»* |

**Y una quinta que el sprint no listaba y resultó necesaria:**

| **¿Es este negocio real?** | ✅ **«⚠️ Dato de ejemplo»** en tarjeta, selector y panel |

---

# 7. Impacto funcional

| Aspecto | Impacto |
| --- | :-: |
| Comportamiento del backend | **Ninguno** |
| Contratos HTTP | **Ninguno** |
| Generación de pitch | **Ninguno** — misma llamada, mismos datos |
| Búsqueda y análisis | **Ninguno** |
| **Interfaz** | ⚠️ **Un bloque retirado, cinco avisos añadidos** |
| Datos en `localStorage` | ⚠️ Los nuevos pitches guardan `pitchSource`; **los antiguos siguen funcionando** y se declaran de origen desconocido |

---

# 8. Riesgos restantes

| # | Riesgo | Sev. | Nota |
| :-: | --- | :-: | --- |
| **1** | **El origen del análisis no se persiste** *(H-02C C-3)* | 🔴 **Alta** | Un Lead guardado **pierde para siempre** si su análisis fue IA o heurística. **La Biblioteca no puede declararlo.** Requiere tocar `application/` y persistencia — **fuera de alcance** |
| **2** | **Modelo `gemini-3.5-flash` sin verificar** | 🔴 Alta | Si no existe, **todo** irá por respaldo. Ahora **al menos se declarará** |
| **3** | **Granularidad por lead en el análisis** | 🟡 Media | Aviso agregado, no por Lead. Requiere DTO *(ADR-06)* |
| **4** | **Sin validación con credenciales reales** | 🔴 Alta | Todo verificado por lectura y `tsc`, **no por ejecución** |
| **5** | **Cero pruebas de frontend** | 🟡 Media | Nada impide reintroducir un texto falso |
| **6** | **`LeadLibrary` no marca los Leads de ejemplo** | 🟢 Baja | Los de muestra **no se persisten en el servidor**, así que **no aparecen** en la Biblioteca. Sin riesgo hoy |

---

# 9. Estado de las tres pantallas

| Pantalla | Antes de H-02 | Ahora |
| --- | :-: | :-: |
| **1 · Lead Hunter** | 🔴 Datos inventados · aviso falso | ✅ **Íntegra** |
| **2 · Lead Library** | 🟡 Score correcto, sin origen | 🟡 **Sin cambios** — riesgo 1 |
| **3 · Pitch Generator** | 🔴 Análisis estático · aviso engañoso | ✅ **Íntegra** |

> ### **Las dos pantallas del flujo de demo —Hunter y Pitch— ya no contienen ninguna afirmación falsa.**

---

# 10. Siguiente paso recomendado

| # | Acción | Aprobación |
| :-: | --- | :-: |
| **1** | **Verificar el modelo Gemini** | ❌ No |
| **2** | **Ejecutar con credenciales** y comprobar los tres estados de §4.4 | ❌ No |
| **3** | **Persistir el origen del análisis** *(riesgo 1)* | ✅ **Sí** — toca `application/` y persistencia |
| **4** | **Primeras pruebas de frontend** *(riesgo 5)* | ❌ No |

> **Los pasos 1 y 2 son los únicos que pueden confirmar que lo implementado funciona.** Hasta entonces, **la integridad está verificada por lectura, no por ejecución**.

---

# 11. Referencias

**Modificados:** `src/shared/types/index.ts` · `src/modules/pitch-generator/presentation/PitchGenerator.tsx` · `src/App.tsx` · `src/modules/lead-hunter/presentation/components/LeadCard.tsx`

**Consultados sin modificar:** `server/shared/contracts/outreachPitch.ts:48` · `server/shared/mappers/outreachResponseMapper.ts:67` · `server/modules/pitch-generator/application/generateOutreachPitch.ts:88-90` · `server/modules/pitch-generator/domain/fallbackPitch.ts` · `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts:47`

**Documentos:** H-02C §3.3 *(C-1, C-2, C-4, C-5)* · H-02B · H-02A · DEV-00 R-38, R-45
