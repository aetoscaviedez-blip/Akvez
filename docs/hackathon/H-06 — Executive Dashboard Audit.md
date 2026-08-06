# H-06 — Executive Dashboard Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-06 — Executive Dashboard Audit** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y validado** · ⏸️ **Detenido a la espera de revisión** |
| Fecha | 2026-08-05 |
| Sprint | **H-06 — Executive Dashboard** |
| Antecedentes | H-05B *(AI Showcase)* · H-05A · H-04 F1-F2 · H-03B *(métricas de ejecución bloqueadas)* |

> **Solo frontend.** No se tocó `server/`, ni dominio, ni el Opportunity Score, ni prompts, ni agentes, ni APIs, ni contratos, ni Blueprint, ni pruebas.

---

# 1. Auditoría previa — qué métricas existían de verdad

**Antes de construir nada se verificó cada cifra pedida.** Tres de las solicitadas **no existían**.

| Métrica pedida | ¿Existía? | Resolución |
| --- | :-: | --- |
| **Búsquedas realizadas** | 🔴 **No.** No hay contador ni registro: `LeadHunter` solo guarda un `hasSearched` booleano | ⚠️ **Se añade un recuento de sesión** — §2 |
| **Leads encontrados** | ✅ Sí — `leads.length` | Directo |
| **Leads analizados** | ⚠️ **No como campo.** Hay que definir qué cuenta | Definido y **rotulado en pantalla** — §3 |
| **Oportunidades detectadas** | ⚠️ **No como campo**, y contarlas por umbral sería inventar un criterio | Redefinido como **«Con Opportunity Score»** — §3.2 |
| **Actividad reciente (timeline)** | 🔴 **No hay registro de eventos** ni marcas horarias fiables | Se presenta como **hechos del estado actual** — §4 |
| **Estado del sistema** | ⚠️ Solo parcialmente verificable | Cuatro estados con su evidencia; lo no comprobado se declara — §5 |

---

# 2. ⚠️ Lo único que este sprint añade y que antes no existía

**«Búsquedas realizadas» no se podía obtener de nada.** Las alternativas eran inventar el número —prohibido— o dejar la casilla vacía en el Hero de una pantalla cuya primera exigencia es precisamente esa cifra.

**Se optó por contar búsquedas que realmente ocurren:**

```ts
// App.tsx
const [searchHistory, setSearchHistory] = React.useState<SearchSummary[]>([]);
```

`LeadHunter` invoca `onSearchCompleted(summary)` tras cada búsqueda con resultado — **también en «Buscar más», que es otra ejecución real contra las APIs**.

| Propiedad | Valor |
| --- | --- |
| **¿Es un dato inventado?** | ❌ **No.** Cuenta ejecuciones que ocurrieron |
| **¿Es telemetría del backend?** | ❌ **No.** No toca `executionReport` ni el DTO *(sigue bloqueado en H-03B)* |
| **¿Persiste?** | 🔴 **No. Vive en memoria y muere con la pestaña** |
| **¿Se rotula?** | ✅ **«Ejecutadas en esta sesión»**, no «históricas» |

> ### **Es la única desviación de «trabaja solo sobre información que ya existe», y se declara como tal.**
>
> **Coste de revertirla: 5 líneas.** Si el criterio es que ninguna instrumentación nueva entra en este sprint, la casilla pasa a estado vacío y el resto del panel no se ve afectado.

**El mismo mecanismo alimenta además el estado de Places y Gemini (§5) y la actividad (§4)**, que sin él quedarían en «Sin comprobar» permanentemente.

---

# 3. Las cifras, y su definición

**Cada recuento lleva escrita su definición debajo, en pantalla.** Una cifra que no se puede comprobar no informa: decora.

| En el Hero | Cuenta | Definición mostrada |
| --- | --- | --- |
| **Búsquedas** | `searchHistory.length` | *«Ejecutadas en esta sesión»* |
| **Negocios encontrados** | `leads.length` | *«En tu espacio de trabajo»* |
| **Analizados** | `description` presente **o** `flaws.length > 0` | *«Con descripción o problemas detectados»* |
| **Con Opportunity Score** | `typeof score === "number"` | *«Con Evaluación emitida»* |

**`typeof`, nunca `!!`:** `0` es una puntuación real y `null` una ausencia legítima **(R-45)**.

## 3.1 🔴 La advertencia de datos de ejemplo

**Si el espacio de trabajo contiene negocios de muestra, las cuatro cifras los incluyen.** El panel lo dice:

> *«1 de estos 2 negocios son datos de ejemplo. No proceden de una búsqueda real y están incluidos en todas las cifras de esta pantalla.»*

> **Sin ese aviso, un panel que anuncia «4 negocios encontrados» sobre dos leads de muestra sería una afirmación falsa sobre cuánto trabajo real hay hecho** — y en una demo es exactamente el tipo de cifra que un jurado pregunta.

## 3.2 Por qué «Oportunidades detectadas» pasó a ser «Con Opportunity Score»

**Contar «oportunidades» exige un umbral, y fijarlo en el frontend habría infringido APS-08 §8.6:** las bandas son *«etiquetas de prioridad, nunca criterios de admisión»*.

**En su lugar:** el Hero cuenta las Evaluaciones emitidas —en este dominio, **un Score emitido *es* una oportunidad detectada**— y el embudo muestra el **reparto por banda** usando las etiquetas que asignó el dominio, sin agrupar ni descartar. La pantalla lo remata:

> *«El nivel es una etiqueta de prioridad, nunca un filtro: ningún negocio se descarta por su puntuación.»*

---

# 4. Embudo y actividad — sin fabricar nada

## 4.1 El embudo no tiene tasas de conversión

**Cuatro tramos, en cifras absolutas y «N de M».** La barra es proporcional al tramo anterior, de modo que representa exactamente el «N de M» escrito al lado.

> **No hay porcentajes de conversión, ni tendencias, ni comparativas.** AKVEZ **no guarda histórico**: un «+12 % esta semana» no tendría con qué compararse. **Verificado sobre el texto renderizado:** el embudo no emite ningún porcentaje como texto.

## 4.2 La actividad no es una cronología

**No existe registro de eventos.** `dateCreated` es una cadena de presentación *(«Ago 5»)*, no una marca ordenable.

**Por eso la sección no promete una línea de tiempo:**

> *«Hechos comprobables del estado actual. AKVEZ no lleva registro de eventos, así que aquí no hay marcas horarias: hay lo que hay ahora.»*

**La única fecha real que aparece es `calculatedAt`** —marca ISO de emisión del Score, que sí llega del servidor— como *«Última Evaluación emitida»*.

**Cada renglón es verificable contando tarjetas:** última búsqueda con su nicho, ciudad y cifra; recuentos por etapa; y, si procede, el aviso de que el respaldo intervino.

---

# 5. Estado del sistema — cero luces verdes por defecto

**Solo hay dos fuentes legítimas de evidencia desde el navegador:**

| Fuente | Qué acredita |
| --- | --- |
| `GET /api/health` — **endpoint que ya existía** | Que **el servidor responde**. Nada más |
| El resumen de la última búsqueda | Qué **ocurrió realmente** la última vez que se usaron las APIs |

| Componente | Con búsqueda en la sesión | Sin búsqueda |
| --- | --- | --- |
| **Servidor AKVEZ** | Responde / no responde a la comprobación | *(comprobación activa siempre)* |
| **Google Places** | *«La última búsqueda devolvió N negocios»* | **«Sin comprobar»** |
| **Gemini** | *«Analizó todos los negocios»* o *«al menos uno no lo analizó el modelo»* | **«Sin comprobar»** |
| **Motor de respaldo** | *«No intervino»* o *«Activo en la última búsqueda»* | **«Sin comprobar»** |

> ### **Un panel de estado que pinta cuatro luces verdes por defecto no informa de que todo va bien: informa de que nadie comprobó nada.**
>
> **`unknown` y `warn` no se pintan en rojo:** un dato que no consta no es una avería.

**Y el alcance de la señal de Gemini se respeta:** `usedFallbackEngine` describe **la tanda**, no un negocio, y el texto dice *«al menos un negocio»* — la misma disciplina de H-05B §3.

---

# 6. Reutilización

| Componente | Uso | Modificado |
| --- | --- | :-: |
| **`LeadCard`** | Sección «Últimos negocios», tres tarjetas | ❌ **No** |
| **`ak-rise` · `ak-bar`** | Entradas escalonadas y barras del embudo | ❌ **No** |

**`LeadCard` se reutiliza tal cual**, con sus dos acciones ya cableadas: abre la Opportunity View y lleva al generador de mensajes. **Una copia adaptada habría creado dos tarjetas que divergirían a la primera modificación** — el mismo criterio de H-03-F2.

**«Últimos» es real:** `App.handleAddLeads` antepone los nuevos (`[...filtered, ...prev]`), de modo que **el orden del arreglo es el de incorporación**. No se inventa ninguna ordenación temporal que el dato no soporte.

## 6.1 Acoplamiento asumido

`ExecutiveDashboard` **importa `LeadCard` desde `lead-hunter/presentation/`**. Es un acoplamiento entre módulos de frontend.

**La alternativa —extraer `LeadCard` a `shared/components/`, como se hizo con `ScoreBreakdown` en H-03-F2— es la correcta a medio plazo**, pero toca dos importadores más y este sprint no la autoriza. **Se registra como propuesta**, §9.

---

# 7. Archivos

| # | Archivo | Cambio | Líneas |
| :-: | --- | --- | :-: |
| **1** | `src/modules/dashboard/presentation/ExecutiveDashboard.tsx` | 🟢 **Creado** | **554** |
| **2** | `…/dashboard/presentation/components/FunnelStage.tsx` | 🟢 **Creado** | **76** |
| **3** | `…/dashboard/presentation/components/SystemStatus.tsx` | 🟢 **Creado** | **74** |
| **4** | `src/App.tsx` | 🟡 Modificado — pestaña, estado de sesión, navegación | **+45** |
| **5** | `src/modules/lead-hunter/presentation/LeadHunter.tsx` | 🟡 Modificado — informa de sus búsquedas, atiende peticiones de apertura | **+40** |
| **6** | `src/shared/types/index.ts` | 🟡 Modificado — tipo `SearchSummary` | **+24** |
| **7** | `docs/hackathon/H-06 — Executive Dashboard Audit.md` | 🟢 **Creado** | — |

**Total: ~810 líneas.** **Backend: cero ficheros. Dependencias: cero. `index.css`: sin cambios.**

## 7.1 Navegación añadida

- **Nueva pestaña «Panel», primera y por defecto.** El panel es el punto de entrada del flujo.
- **CTA «Buscar nuevas oportunidades»** → pestaña Lead Hunter.
- **`LeadCard` → Opportunity View**: el panel pide al Hunter abrir ese negocio *(`requestedLeadId`, consumido una sola vez para que volver a la pestaña no lo reabra)*.
- **La «Brújula del Freelancer» no se rinde en el Panel**: esa pantalla trae su propio encabezado y su propia llamada a la acción.

## 7.2 Ordenación de las secciones

**El CTA se colocó en el Hero, no al final como listaba el encargo.** El propio encargo lo define como *«el punto de entrada del flujo»*, y enterrarlo bajo cinco secciones lo haría inalcanzable en una demo de dos minutos. **Las secciones 2-5 conservan su orden.**

---

# 8. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** — **ninguna prueba modificada** |
| `npm run build` | ✅ **Compila** |

## 8.1 Verificación de render — 31 comprobaciones

**Renderizado en Node con `react-dom/server`** *(scripts desechables, ejecutados y eliminados)*, sobre 5 escenarios:

| Escenario | Comprobado | ✓ |
| --- | --- | :-: |
| **Sesión con datos reales** | Recuentos correctos; embudo con «N de M»; reparto por banda; actividad con la búsqueda real y `calculatedAt` | ✅ |
| **Sin búsquedas en la sesión** | Gemini y respaldo en **«Sin comprobar»**; **no se afirma que Gemini funcionó**; sin recuento inventado | ✅ |
| **Espacio de trabajo vacío** | Titular, embudo, actividad y listado con estado vacío declarado; **los ceros se muestran**, no se ocultan | ✅ |
| **Datos de ejemplo mezclados** | Advierte cuántos son y que están incluidos en todas las cifras | ✅ |
| **Respaldo activo** | *«Al menos un negocio no lo analizó el modelo»* — alcance de tanda respetado | ✅ |

**Comprobación específica sobre el texto visible del embudo** *(atributos HTML descartados)*:

- ✅ **No emite ningún porcentaje como texto**
- ✅ Usa «N de M», cifras absolutas comprobables
- ✅ La única mención a «conversión» es el descargo que las niega
- ✅ **Sin tendencias, comparativas temporales ni variaciones porcentuales**

> **Una primera aserción marcó falso positivo** —buscaba `%` en el HTML crudo, donde aparece en los anchos CSS, y `conversión`, que aparece en el propio descargo—. **Se rehízo sobre el texto visible**, y la propiedad real quedó verificada.

## 8.2 🔴 Capturas — no fue posible

**No hay extensión de navegador conectada en este entorno.** Tipografía, espaciado, tarjetas y animaciones están razonados sobre el código, **no vistos**.

**La deuda ya acumula cuatro pantallas** — H-04, H-05A, H-05B y H-06.

---

# 9. Propuestas no implementadas

| # | Propuesta | Coste |
| :-: | --- | :-: |
| **1** | **Extraer `LeadCard` a `shared/components/`** y retirar el acoplamiento entre módulos *(§6.1)* | ~3 ficheros |
| **2** | **Persistir `searchHistory`** en `localStorage` para que el recuento sobreviva a la recarga | ~6 líneas |
| **3** | **`animate-fade-in` sigue muerta** en 6 puntos de `lead-hunter/` | 4 líneas |
| **4** | **La Biblioteca conserva la estética anterior** | Desde H-04 |
| **5** | **Métricas de ejecución en el panel** *(consultas, tiempos, modelo)* | **Bloqueadas en H-03B** — requieren decisión sobre O-6 |

---

# 10. Cumplimiento del encargo

| Requisito | Estado |
| --- | :-: |
| Solo frontend | ✅ |
| No modificar dominio · Score · prompts · agentes · backend · APIs · Blueprint | ✅ |
| **Nunca inventar datos ni simular métricas** | ✅ §3, §4 — con la desviación declarada de §2 |
| Estado vacío cuando el dato no existe | ✅ §8.1 |
| Las 6 secciones | ✅ — CTA reubicado, §7.2 |
| Reutilizar componentes existentes | ✅ §6 — `LeadCard` sin modificar |
| No crear endpoints · no tocar contratos · no modificar pruebas | ✅ |

---

# 11. Referencias

**Creado:** `modules/dashboard/presentation/ExecutiveDashboard.tsx` · `components/FunnelStage.tsx` · `components/SystemStatus.tsx`.
**Modificado:** `App.tsx` · `LeadHunter.tsx` · `shared/types/index.ts`.
**Reutilizado sin tocar:** `LeadCard.tsx` · animaciones `ak-rise` y `ak-bar`.

**Blueprint:** APS-08 §8.6 *(las bandas no son criterio de admisión)* · DEV-00 R-38, R-45, R-48.

**Documentos:** H-05B §3 · H-05A — Checklist de Demo · H-04 F1 §8 · H-03B — Sprint Audit · H-03-F2.
