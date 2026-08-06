# H-05A — Checklist de Demo

| Campo | Valor |
| --- | --- |
| Documento | **H-05A — Checklist de Demo** |
| Clasificación | **Documento operativo** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Vivo** — se actualiza al cierre de cada sprint de demo |
| Fecha | 2026-08-05 · **actualizado en H-05B** |
| Origen | **No existía checklist de demo.** Este documento lo crea consolidando los avisos dispersos en H-01, H-03A, H-04 Fases 1-2 y H-05A |
| Última actualización | **H-05B** — se añade el AI Showcase: §2.3, §3, §4, §5 y §7 |

> **Para qué sirve:** que nadie tenga que releer nueve auditorías la mañana de la demo. Aquí está **solo lo que hay que hacer o comprobar**, en orden.

---

# 1. 🔴 Los cuatro puntos que hunden la demo

**Si solo se comprueban cuatro cosas, son estas.**

| # | Punto | Por qué | Origen |
| :-: | --- | --- | :-: |
| **1** | **Hacer una búsqueda real ANTES de enseñar la Opportunity View y el AI Showcase** | Los negocios de ejemplo de `App.tsx` **no traen `breakdown`**: abrir uno deja ambas pantallas llenas de estados vacíos. **Y sin búsqueda en curso, el AI Showcase no puede mostrar ciudad, nicho ni el motor del análisis** | H-04 F1 R-3 · H-05B §2.2, §3 |
| **2** | **Verificar que `metadata.usedFallbackEngine === false`** en esa búsqueda | Un despliegue sin credenciales **responde HTTP 200 igualmente**, con análisis heurístico. **Parece sano y no lo está** | H-03A R-8 |
| **3** | **No enseñar un negocio marcado «⚠️ EJEMPLO»** | Todo mensaje generado a partir de él **describe un negocio que no existe**. La interfaz lo avisa; el guion no debería llegar ahí | H-05A §3 |
| **4** | **Confirmar que el modelo de Gemini existe** | Si no, todo cae al respaldo y la demo entera pasa a ser heurística | H-01 · Roadmap R-2 |

---

# 2. Antes del día — preparación

## 2.1 Credenciales y APIs

- [ ] `GEMINI_API_KEY` y `GOOGLE_PLACES_API_KEY` llegan al proceso
- [ ] ⚠️ **`dotenv` NO se carga**: un `.env` no surte efecto. Exportar en el shell, o autorizar la carga *(decisión abierta desde H-01.2)*
- [ ] **Places API (New)** habilitada **con facturación**
- [ ] **Modelo de Gemini verificado como existente**
- [ ] Cuota de Places suficiente para los ensayos **y** para el día

## 2.2 Si se despliega en Cloud Run

- [ ] Seguir el procedimiento de **H-03A §7** *(7 pasos)*
- [ ] `GET /api/health` → 200
- [ ] `GET /` devuelve la SPA con estilos → confirma `NODE_ENV=production`
- [ ] 🔴 **Búsqueda real con `usedFallbackEngine === false`** — la única prueba de que las claves llegaron
- [ ] `--min-instances=1` un rato antes, para evitar el arranque en frío
- [ ] URL pública anotada en el guion

## 2.3 Revisión visual pendiente — **no se ha hecho nunca**

> 🔴 **Ninguna de las pantallas rediseñadas en H-04 y H-05A se ha visto en un navegador.** No hay extensión conectada en el entorno de desarrollo: todo está verificado por tipos, por render en Node y por compilación, **no por vista**.

- [ ] `npm run dev` y recorrer las tres pantallas
- [ ] **Opportunity View**: hero, anillo del Score, 6 tarjetas de categoría, cobertura, factores medidos y faltantes
- [ ] **AI Showcase**: los 6 pasos, las dimensiones evaluadas, el revelado «Comprobar la aritmética» y el bloque de estado del análisis
- [ ] **Pitch Generator**: los 5 pasos, la guía vertical, la salida del mensaje
- [ ] **Anchos**: móvil, tableta y escritorio — las rejillas declaran 1/2/3 columnas sin probarse
- [ ] Animaciones: entrada en cascada, barras, anillo
- [ ] Sin errores en la consola del navegador

## 2.4 Medición

- [ ] **Cronometrar una búsqueda completa** — marca el ritmo de la demo en vivo
- [ ] Contar llamadas a Places por búsqueda *(coste)*
- [ ] Elegir **nicho y ciudad** con mejores resultados medidos

---

# 3. El día — antes de empezar

- [ ] Red probada **en el recinto**, o *hotspot* propio listo
- [ ] Aplicación abierta y **con una búsqueda real ya hecha**
- [ ] Un negocio con **breakdown completo** localizado para abrir en la Opportunity View
- [ ] 🔴 **Comprobado que el AI Showcase de ese negocio dice «IA generativa»** y no «No consta». Si dice «No consta», **alguna tanda de la búsqueda usó el respaldo**: repetir la búsqueda antes de la demo
- [ ] Un mensaje **ya generado** sobre ese negocio, por si la red falla en directo
- [ ] 🔴 **Grabación de respaldo** del flujo completo *(H-04 del roadmap, tarea 4.2)*
- [ ] `localStorage` revisado: sin restos de pruebas anteriores
- [ ] Petición de calentamiento lanzada si el servicio está en Cloud Run

---

# 4. El guion, contra los cuatro ejes del jurado

| Eje | Momento de la demo | Qué se enseña |
| --- | --- | --- |
| **API** | Búsqueda | Negocios reales de Google Places, con expansión por zonas y deduplicación por identidad |
| **AI** | Opportunity View | El desglose del Score con su `rationale` por categoría — **y la frase que lo explica**: *«un Score alto mide oportunidad comercial para ti, no calidad del negocio»* |
| **AI** | **AI Showcase** | **El recorrido de 2 minutos**: qué dimensiones miró, qué encontró, cómo pesó cada una, y **con qué motor**. Es la pantalla que responde *«¿por qué es una oportunidad?»* de principio a fin |
| **AI** | Pitch Generator | Paso 2 → 3 → 4: **problema encontrado → oportunidad → mensaje**. El mensaje sale del diagnóstico que se acaba de ver |
| **Cloud** | URL pública | Cloud Run, imagen multi-stage, secretos en Secret Manager *(H-03A)* |
| **UX** | Todo el recorrido | Tres pantallas, cinco pasos narrados, **y las ausencias declaradas en vez de rellenadas** |

## 4.1 La frase que conviene tener preparada

> **«El Score no lo inventa la IA.»** Es un modelo determinista de seis categorías ponderadas: la IA extrae los hechos, el modelo puntúa, y **la suma de las contribuciones reconstruye el número en pantalla**.

**Y la que evita el malentendido más probable:**

> **Un Score alto significa más oportunidad comercial, no mejor negocio.** Una web ausente **sube** la puntuación: es exactamente el trabajo que se puede vender.

---

# 5. Qué NO enseñar

| # | Evitar | Por qué |
| :-: | --- | --- |
| **1** | **Negocios «⚠️ EJEMPLO»** | Datos ficticios; cualquier mensaje sobre ellos describe un negocio inexistente |
| **2** | **La Biblioteca junto a la Opportunity View** | Conserva la estética anterior: dos presentaciones distintas del mismo Score *(H-04 F2 R-5)* |
| **3** | **Reiniciar el servicio en directo** | La persistencia es en memoria: **la Biblioteca se vacía** *(H-03A R-7)* |
| **4** | **Métricas de ejecución** *(consultas, tiempos, modelo)* | **No cruzan el DTO.** Bloqueadas en H-03B a la espera de decisión |
| **5** | **Prometer que la IA analizó un negocio concreto cuando el Showcase dice «No consta»** | `usedFallbackAnalysis` por Lead no llega al frontend. **Si el paso 06 dice «IA generativa», sí puede afirmarse**: significa que ninguna tanda usó el respaldo *(H-05B §3)* |

---

# 6. Si algo falla en directo

| Síntoma | Respuesta inmediata |
| --- | --- |
| **Aparece el aviso naranja de respaldo** | **Decirlo, no ocultarlo**: *«el modelo no respondió y el sistema lo está declarando en pantalla — esa transparencia es deliberada»*. Es un punto a favor, no en contra |
| **La búsqueda tarda demasiado** | Narrar el desglose del negocio ya abierto mientras termina |
| **No hay red** | Grabación de respaldo *(§3)* |
| **Cuota de Places agotada** | Recorrer resultados ya cargados; **no relanzar búsquedas** |
| **La pantalla se ve vacía al abrir un negocio** | Es un negocio de ejemplo o sin evaluar: **volver atrás y abrir uno de la búsqueda real** |

---

# 7. Cierre de sprints — estado de las pantallas

| Pantalla | Estado | Sprint |
| --- | :-: | :-: |
| **Lead Hunter** *(búsqueda y resultados)* | 🟢 Funcional, con declaración de origen del análisis | H-02C |
| **Opportunity View** | 🟢 **Rediseñada** — hero, resumen ejecutivo, 6 tarjetas, factores medidos y faltantes | H-04 F1 · F2 |
| **AI Showcase** | 🟢 **Nueva** — 6 pasos: negocio, dimensiones, hallazgos, cálculo, resultado y motor | **H-05B** |
| **Pitch Generator** | 🟢 **Reorganizado** en narrativa de 5 pasos | **H-05A** |
| **Biblioteca** | 🟡 **Sin rediseñar** — estética anterior | — |
| **Despliegue Cloud Run** | 🟢 **Documentado y listo** · ⏸️ **sin desplegar** | H-03A |

---

# 8. Referencias

H-01 — Demo Readiness Audit · H-02C — Fallback Visibility Audit · **H-03A — Cloud Deployment Audit §7, §8, §9** · H-03B — Sprint Audit · **H-04 Fase 1 §8, §10 · H-04 Fase 2 §6** · **H-05A — Pitch Generator Showcase Audit** · AKVEZ-HACKATHON-ROADMAP §5 (H-04).
