# H-07 Fase 4 — Typography & Readability Polish

| Campo | Valor |
| --- | --- |
| Documento | **H-07 Fase 4 — Typography & Readability** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementada · lint, 197 tests, build y revisión visual en verde** |
| Fecha | 2026-08-06 |
| Alcance | **Tipografía, espaciado y legibilidad.** Sin cambios de color, componentes, arquitectura, flujo, lógica, backend, API ni DTO |

---

# 1. El hallazgo de la auditoría

**De los ~122 elementos con tamaño declarado en las seis pantallas, 117 estaban a 12 px o menos.**

| Tamaño | Usos | |
| :-: | :-: | --- |
| `text-[9px]` | 1 | |
| `text-[10px]` | 41 | versalitas, etiquetas, apostillas |
| `text-[11px]` | 17 | apostillas de dato |
| `text-xs` **(12)** | 58 | **párrafos, descripciones, problemas detectados** |
| `text-sm` (14) | 26 | |
| `text-base` (16) | 5 | |
| 18 px y mayores | 22 | |

**El sistema era consistente, pero consistentemente ilegible a la distancia a la que se ve una demo.** El caso más grave: los párrafos largos —descripción del negocio, problemas detectados, impacto financiero— vivían a **12 px**, que es tamaño de nota al pie, no de cuerpo.

---

# 2. La escala, antes y después

**No se han subido tamaños al azar: se ha remapeado la escala en `@theme`.** Cada punto de uso conserva su papel relativo y solo cambia su magnitud — el nombre semántico manda y el píxel es una consecuencia.

| Token | Antes | Después | Line-height | Papel | Justificación |
| --- | :-: | :-: | :-: | --- | --- |
| `eyebrow` | 10 | **12** | 1.25 · `+0.1em` | Versalitas, distintivos | Única excepción a la regla de «evitar 12 px». Van en mayúsculas y con tracking: su mancha ocupa lo que un texto normal de 14 |
| `xs` | 12 | **14** | 1.55 | Texto auxiliar | Apostillas, vías de contacto, metadatos |
| `sm` | 14 | **16** | 1.65 | **Texto normal — párrafos** | Es el tamaño que el encargo fija como mínimo para textos largos |
| `base` | 16 | **17** | 1.7 | Cuerpo destacado | Mensaje generado del Pitch |
| `lg` | 18 | **20** | 1.45 | Subtítulo | |
| `xl` | 20 | **22** | 1.35 | Subtítulo mayor | |
| `2xl` | 24 | **26** | 1.25 | Título de sección | Dentro del rango 22-26 del encargo |
| `3xl` | 30 | **32** | 1.15 | | |
| `4xl` | 36 | **40** | 1.1 | Título principal | Rango 40-48 |
| `5xl` | 48 | **48** | 1 | Cifra destacada | Score de tarjeta, métricas del panel |
| `6xl` | 60 | **60** | 0.95 | **Hero Score** | Rango 56-64 |

> ### El interlineado no es uniforme, y no debe serlo
>
> **Cuanto más pequeño el texto, más aire necesita entre líneas; cuanto más grande, menos.** Un titular a 40 px con interlineado de párrafo se desmonta; un párrafo a 16 px con interlineado de titular se apelmaza. Por eso la escala va de **1.7 en el cuerpo a 0.95 en el Score**.

---

# 3. Mejoras realizadas, una por una

## 3.1 · Escala remapeada en la raíz

**59 tamaños arbitrarios** (`text-[9px]`, `[10px]`, `[11px]`) migrados a tokens. **Quedan cero valores arbitrarios en el producto.**

## 3.2 · Medida de lectura — `--container-measure: 68ch`

**El encargo pide 60-75 caracteres por línea y dice cómo conseguirlo: estrechar el contenedor, nunca bajar la tipografía.** Se declara la medida como token y se aplica a:

- La entradilla de `SectionHeader` — antes `max-w-3xl`, que **a 16 px daba ~96 caracteres por línea**. Por encima de 75, el ojo pierde el renglón al volver al margen izquierdo.
- Las descripciones de negocio de las cuatro pantallas.
- El cuerpo de todo `Callout` — el ángulo de oportunidad ocupaba 87 caracteres a ancho completo.

## 3.3 · Tarjetas de Problemas Detectados — el bloque prioritario

| | Antes | Después |
| --- | :-: | :-: |
| Cuerpo | **12 px** | **16 px** |
| Interlineado | 1.625 | **1.65** (26,4 px) |
| Padding | 20 px | **24 px** |
| Columnas | 3 | **2** |

> **Las columnas bajan de 3 a 2 por una razón medida.** Subir el cuerpo a 16 px sin tocar la rejilla dejaba **~26 caracteres por línea** —muy por debajo del ideal— y producía un texto troceado y de bandera muy irregular. A dos columnas la caja mide 367 px y da **~44 caracteres**: no llega al óptimo de un párrafo corrido, pero es el equilibrio correcto para hallazgos de 2-3 líneas dentro de una tarjeta.

## 3.4 · Contraste

`text-app-muted/70` sobre `#121218` da **3,85:1 — falla AA para texto pequeño**. Se eliminó de todo el texto que hay que leer: versiones del Perfil de Ponderación, apostillas de `StatTile`, notas de `ScoreBreakdown` y placeholders de formulario. A opacidad plena, `#9CA3AF` da **6,75:1**.

**Se conservan las opacidades bajas (`/40`, `/50`) únicamente en los marcadores de ausencia** —los «—» que sustituyen a un dato que no llegó—. Ahí la atenuación *es* el significado: no son texto que leer, son un hueco declarado.

## 3.5 · Ritmo vertical

| Bloque | Antes | Después |
| --- | :-: | :-: |
| Encabezado → contenido | `space-y-6` | **`space-y-7`** |
| Piezas del encabezado | `space-y-2` | **`space-y-3`** |
| Cuerpo de `LeadCard` | `space-y-5` / `py-6` | **`space-y-7` / `py-7`** |
| Entre secciones de pantalla | `space-y-14` | **`space-y-16`** |

**El encabezado se separa de su contenido más de lo que sus propias piezas se separan entre sí.** Es lo que hace que el ojo lea «título → cuerpo» como un bloque y no como una lista comprimida.

## 3.6 · Hero Score a 60 px

Era `text-5xl` (48) y **empataba con el nombre del negocio**, también a 48. El ADN pide que una sola cifra domine sin competencia. Verificado en pantalla: `60px`.

---

# 4. Verificación

| Paso | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **0 errores** |
| `npm test` | ✅ **197 tests · 26 archivos** |
| `npm run build` | ✅ **CSS 43,4 kB · build 2,9 s** |
| Tokens presentes en el CSS compilado | ✅ `--text-xs:.875rem` · `--text-sm:1rem` · `--text-eyebrow:.75rem` · `--text-6xl:3.75rem` · `max-w-measure` |
| Medición en el DOM — cuerpo de problema detectado | ✅ **16 px · interlineado 26,4 px · caja 367 px** |
| Medición en el DOM — Hero Score | ✅ **60 px** |
| Revisión visual — Dashboard, Lead Hunter, LeadCard, Opportunity View | ✅ |

---

# 5. Accesibilidad y distancia de lectura

| Escenario | Antes | Después |
| --- | --- | --- |
| **Portátil 1080p a 60 cm** | Párrafos a 12 px ≈ 0,3° de ángulo visual — **por debajo del umbral cómodo** | 16 px ≈ 0,4°, dentro del rango de lectura sostenida |
| **Proyector a 3 m** | Las apostillas de 10 px eran **decorativas, no legibles** | 12 px en versalitas con tracking: legibles como etiqueta |
| **Usuario con gafas / présbita** | Requería acercarse | Cuerpo a 16 px con interlineado 1.65 |

---

# 6. Lo que NO se ha tocado

- **Colores, componentes, arquitectura, flujo, lógica, backend, API y DTO** — sin excepción.
- **Ni una condición de renderizado.** Todas las reglas de integridad (R-38, R-45) conservan su lógica exacta.
- **Ningún componente nuevo.** Las 11 primitivas siguen siendo 11.

---

# 7. Deuda que sigue abierta

| # | Pendiente | Origen |
| :-: | --- | :-: |
| **1** | Barras del embudo: reglas naranjas a todo el ancho que se leen como divisores | V-03 (F2.5) |
| **2** | Chip de Score del Pitch Generator sin migrar a `Badge` | V-04 (F2.5) |
| **3** | Las cuatro cifras del panel en dos colores; ninguna domina | V-05 (F2.5) |
| **4** | «Brújula del Freelancer» sobre las vistas de detalle | **Decisión del PO** |
| **5** | Emoji dentro del dato de muestra (`classification: "🔥 Lead Excelente"`) | **Cambio de datos, no de presentación** |

---

**Fase 4 entregada y verificada. A la espera de revisión. No se continúa con la siguiente fase.**
