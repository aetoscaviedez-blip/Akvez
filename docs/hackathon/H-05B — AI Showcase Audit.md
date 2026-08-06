# H-05B — AI Showcase Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-05B — AI Showcase Audit** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y validado** · ⏸️ **Detenido. No se comienza H-06** |
| Fecha | 2026-08-05 |
| Sprint | **H-05B — AI Showcase** |
| Antecedentes | H-04 Fases 1-2 *(Opportunity View)* · H-05A · H-03B *(métricas bloqueadas)* · H-02C |

> **Solo `presentation/`.** No se tocó `server/`, ni `domain/`, ni `application/`, ni `infrastructure/`, ni prompts, ni Gemini, ni el Opportunity Score, ni Docker, ni Cloud Run, ni DTOs, ni pruebas, ni Blueprint.

---

# 1. Qué se construyó

**Una pantalla que responde una sola pregunta**, en seis pasos numerados:

> ### **«¿Por qué AKVEZ considera que este negocio es una oportunidad?»**

| Paso | Sección | Datos |
| :-: | --- | --- |
| **01** | **El negocio** | `name` · ciudad y nicho de la búsqueda · `website` · `classification` · `source` |
| **02** | **¿Qué analizó AKVEZ?** | Las dimensiones del `breakdown`, con su peso y si pudo medirse |
| **03** | **¿Qué encontró?** | `description` · `flaws` · `whyWebsiteNeeded` |
| **04** | **¿Cómo calculó el Score?** | `ScoreCategoryCard` ×N + `ScoreBreakdown` bajo revelado |
| **05** | **Resultado final** | `score` · `band` · `coverage` · `confidence` · `scoreVersion` |
| **06** | **Estado del análisis** | IA generativa **o** «no consta» — §3 |

## 1.1 Dónde vive y cómo se llega

**`src/modules/lead-hunter/presentation/AIShowcase.tsx`**, dentro del Lead Hunter.

**Recorrido:** resultado → **Opportunity View** → *«Ver cómo lo analizó AKVEZ»* → **AI Showcase**.

> **Vive en el Hunter por una razón de datos, no de comodidad:** es el único lugar del frontend donde existen **la ciudad y el nicho de la búsqueda**. Como pestaña independiente, el paso 01 habría perdido dos de sus cinco campos.

**`App.tsx` no se modificó.**

## 1.2 Qué añade sobre la Opportunity View

**Se solapan, y conviene decirlo:** los pasos 04 y 05 muestran lo que la Opportunity View ya muestra.

| Pantalla | Responde |
| --- | --- |
| **Opportunity View** | **Qué concluyó** el sistema — con resumen ejecutivo y factores |
| **AI Showcase** | **Cómo lo hizo** — qué dimensiones miró, con qué peso, con qué motor |

**Lo genuinamente nuevo son los pasos 01, 02 y 06**, y la narración como proceso recorrible en voz alta. **El solape en 04-05 es deliberado**: una pantalla sobre el cálculo del Score que no enseñe el cálculo no cumpliría el encargo.

---

# 2. 🔴 Tres datos del encargo que no existen

## 2.1 «Valor Comercial» no es una categoría del sistema

El encargo enumera en §2: *Presencia Web · Potencial de Mejora · Compatibilidad · Reputación · Identidad Digital · **Valor Comercial***.

> ### **Las seis reales de WP-01 v1.0 son las cinco primeras más «Información Comercial».** «Valor Comercial» **no aparece en ninguna línea del sistema** — verificado por búsqueda en `server/` y `src/`.

**No se corrigió escribiendo el nombre correcto: se eliminó el problema.** La pantalla **no contiene ninguna lista de categorías**: las lee del `breakdown` que llega del servidor.

> **Codificarlas en el frontend duplicaría en la interfaz una decisión de dominio** —el Perfil de Ponderación vigente— **y las dos copias divergirían en cuanto se publicara WP-02.** Así, la pantalla muestra las dimensiones que existan, se llamen como se llamen.

## 2.2 «Ciudad» y «Categoría» no son campos del negocio

**`Prospect` y `LeadResponseDTO` no tienen ciudad ni categoría.** Lo que existe son **los parámetros de la búsqueda**: `city` y el nicho seleccionado, ambos en el estado del Lead Hunter.

**Se usan, con dos cautelas:**

| Cautela | Cómo |
| --- | --- |
| **Se rotulan por lo que son** | «Ciudad de búsqueda» y «Nicho buscado» — **no «Categoría del negocio»**, que sería una afirmación sin verificar |
| **Solo se transmiten si el negocio procede de la búsqueda en curso** | Un Lead recuperado del almacenamiento local **no pertenece a esta ejecución**; atribuirle esos parámetros inventaría dos datos |

**Sin contexto de búsqueda, ambos campos rinden «No disponible».**

---

# 3. El paso 06 — la parte más delicada

**El encargo exige:** *«Mostrar claramente: IA generativa o Motor heurístico. **Nunca asumir uno u otro**.»*

**El problema:** `usedFallbackAnalysis` por Lead **no cruza el contrato público**. Solo llega `metadata.usedFallbackEngine`, que describe **la tanda entera** *(brecha documentada en H-04 F1 §8 y H-03B)*.

## 3.1 La única inferencia sólida disponible

```
usedFallbackEngine = leads.some(lead => lead.usedFallbackAnalysis === true)
```

| Señal | Qué se sigue | Qué muestra la pantalla |
| --- | --- | --- |
| **`false`** | **Ningún** negocio de la tanda usó el respaldo ⟹ **este tampoco** | ✅ **«IA generativa»** |
| **`true`** | **Alguno** lo usó, pero **no consta cuál** | ⚠️ **«No consta para este negocio»** |
| **Sin búsqueda en curso** | No hay señal | ⚠️ **«No consta para este negocio»** |

> ### **`false` sí permite afirmar el motor de este negocio.** Es cuantificación universal, no una extrapolación: si nadie usó el respaldo, este no lo usó.
>
> **`true` no permite nada**, y ahí la pantalla **dice exactamente eso**, en lugar de repartir la culpa entre todos los negocios de la lista.

**Es la misma disciplina de H-04 Fase 2 §3.2**, donde el Hero renuncia a declarar el motor. Aquí no se renuncia: **se declara cuando se puede y se declara la ignorancia cuando no.**

## 3.2 El matiz que conviene contarle al jurado

Cuando el estado es «IA generativa», la pantalla añade:

> *«El Opportunity Score, en cambio, **no lo calcula la IA**: es un modelo determinista que puntúa los hechos que la IA extrae.»*

**Es el argumento de rigor del proyecto**, y sin esa frase una pantalla titulada *AI Showcase* sugiere lo contrario.

---

# 4. Reutilización de componentes

**El encargo pide reutilizar `ScoreBreakdown` **y** `ScoreCategoryCard`, y no duplicar lógica. Las dos exigencias chocan:** ambos componentes pintan **las mismas seis categorías**, con ~90 % de solape.

**Resolución:**

| Componente | Uso | Por qué |
| --- | --- | --- |
| **`ScoreCategoryCard`** | Rejilla del paso 04, siempre visible | Es el más visual y el propósito de la pantalla es enseñar |
| **`ScoreBreakdown`** | Bajo **«Comprobar la aritmética»**, plegado | Sirve a un fin distinto —**verificar la suma**— y plegado **no compite con las tarjetas** |

> **Mostrarlos a la vez habría enseñado el mismo dato dos veces**, que es lo que este proyecto viene retirando desde H-04. **Un revelado no es una configuración** *(prohibidas por el encargo)*: es una disclosure, y no altera nada.

**Ninguno de los dos componentes se modificó.**

---

# 5. Ausencias declaradas

| Dato ausente | Qué muestra |
| --- | --- |
| Ciudad · nicho *(sin búsqueda)* | **«No disponible»** |
| `classification` · `source` | **«No disponible»** |
| `website` | **«Sin sitio web registrado»** — ausencia con **significado propio**: es el argumento comercial, no un vacío |
| `breakdown` | Pasos 02 y 04 declaran que no hay desglose y **por qué eso no significa cero** |
| `description` · `flaws` · `whyWebsiteNeeded` | Cada uno con su frase propia |
| `score` | **«—»**, y no se ofrece la comprobación aritmética |
| `band` · `coverage` · `confidence` | **«No disponible»** |
| Motor del análisis | **«No consta para este negocio»** — §3 |

---

# 6. Archivos

| # | Archivo | Cambio | Líneas |
| :-: | --- | --- | :-: |
| **1** | `src/modules/lead-hunter/presentation/AIShowcase.tsx` | 🟢 **Creado** — la pantalla | **~470** |
| **2** | `src/modules/lead-hunter/presentation/LeadHunter.tsx` | 🟡 Modificado — estado y contexto de búsqueda | **+30** |
| **3** | `src/modules/lead-hunter/presentation/OpportunityView.tsx` | 🟡 Modificado — acceso al Showcase | **+22** |
| **4** | `docs/hackathon/H-05B — AI Showcase Audit.md` | 🟢 **Creado** | — |
| **5** | `docs/hackathon/H-05A — Checklist de Demo.md` | 🟡 Actualizado — entregable 3 | — |

**Backend: cero ficheros. Cero dependencias. `index.css` sin cambios** *(se reutiliza `ak-rise`)*. **`App.tsx` sin cambios.**

---

# 7. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** — **ninguna prueba modificada** |
| `npm run build` | ✅ **Compila** |

## 7.1 Verificación de render — 29 comprobaciones

**Renderizado en Node con `react-dom/server`** *(script desechable, ejecutado y eliminado)*:

| Escenario | Comprobado | ✓ |
| --- | --- | :-: |
| **Completo, IA confirmada** | Los 6 pasos; ciudad y nicho rotulados como parámetros de búsqueda; score, band, coverage y confidence | ✅ |
| **Categorías** | Aparece **«Información Comercial»**; **NO aparece «Valor Comercial»** | ✅ |
| **Dimensiones no medibles** | Una sola marcada «no medible», la que trae `partialScore: null` | ✅ |
| **Reutilización** | `ScoreBreakdown` se revela bajo demanda y **no se pinta a la vez** que las tarjetas | ✅ |
| **Motor indeterminado** | «No consta para este negocio»; **no se atribuye a la IA**; ciudad y nicho «No disponible» | ✅ |
| **Sin breakdown / sin evaluación** | Pasos 02 y 04 declaran la ausencia; score «—»; sin oferta de aritmética | ✅ |
| **Sin sitio web** | «Sin sitio web registrado», **no «No disponible»** | ✅ |

## 7.2 🔴 No verificado visualmente

**No hay extensión de navegador conectada.** Tipografía, guía vertical de los pasos, comportamiento *responsive* y animaciones están razonados sobre el código, **no vistos**. Acumulado ya con H-04 y H-05A.

---

# 8. Cumplimiento del encargo

| Requisito | Estado |
| --- | :-: |
| Solo `presentation/` | ✅ |
| No inventar datos · reutilizar solo lo existente | ✅ §2 — incluida la corrección de dos campos del propio encargo |
| «No disponible» o no renderizar | ✅ §5 |
| Narrativa de 6 pasos | ✅ |
| Reutilizar `ScoreBreakdown` y `ScoreCategoryCard` | ✅ §4 — ambos, sin duplicar |
| **Nunca asumir el motor** | ✅ §3 |
| Demo de 2 minutos | ✅ Seis pasos, un desplazamiento continuo |
| No añadir configuraciones ni botones administrativos | ✅ Un solo revelado, sin ajustes |
| **No información técnica del backend** | ✅ **Ninguna métrica de ejecución** — siguen bloqueadas en H-03B |
| No modificar backend · endpoints · DTO · pruebas · Blueprint | ✅ |

---

# 9. Pendientes

| # | Punto | Estado |
| :-: | --- | --- |
| **1** | **Revisión visual de las tres pantallas rediseñadas** | 🔴 **Nunca hecha** — H-04, H-05A y H-05B |
| **2** | **`usedFallbackAnalysis` por Lead** | 🔴 No cruza el DTO. Resolverlo convertiría el paso 06 en afirmación siempre. **Requiere ampliar el contrato** |
| **3** | **La Biblioteca conserva la estética anterior** | 🟡 Fuera de alcance desde H-04 |
| **4** | **`animate-fade-in` muerta en 6 puntos de `lead-hunter/`** | 🟡 4 líneas en `index.css`; propuesto desde H-04 F1 |

---

# 10. Referencias

**Creado:** `src/modules/lead-hunter/presentation/AIShowcase.tsx`.
**Modificado:** `LeadHunter.tsx` · `OpportunityView.tsx`.
**Reutilizado sin tocar:** `src/shared/components/ScoreBreakdown.tsx` · `components/ScoreCategoryCard.tsx`.

**Consultado:** `server/modules/lead-analyzer/domain/weightingProfile.ts` *(WP-01, las seis categorías)* · `server/shared/contracts/prospectSearch.ts` · `src/shared/types/index.ts`.

**Blueprint:** APS-08 §6, §7.1, §8, §9, §11 · ADR-14 §6.3 · DEV-00 R-38, R-45, R-48.

**Documentos:** H-04 Fase 1 §8 · H-04 Fase 2 §3.2 · H-05A · H-03B · H-02C.
