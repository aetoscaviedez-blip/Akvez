# H-07 F5 — Demo Polish Final

| Campo | Valor |
| --- | --- |
| Documento | **H-07 F5 — Demo Polish Final** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementada · lint, 197 tests, build y recorrido completo en verde** |
| Fecha | 2026-08-06 |
| Alcance | **Solo UX / UI / experiencia.** Sin backend, dominio, DTO, lógica, agentes ni prompts |

---

# 1. Prioridad 1 — Legibilidad · los siete hallazgos de F4.5, cerrados

| # | Hallazgo | Antes | Después |
| :-: | --- | --- | --- |
| **R-01** | Descripción del negocio en `LeadCard` | **14 px · ~110 cpl** · más pequeña que las tarjetas de debajo | **16 px · 68ch** |
| **R-02** | Declaraciones de ausencia *(6 usos)* | **14 px · 125-135 cpl** | **16 px · 68ch**, título a 20 px |
| **R-03** | Subtítulos de `ActionCard` | **14 px · 123 cpl** | **16 px · 68ch**, título a 20 px |
| **R-04** | `text-[10.5px]` en cursiva | **11 px** | **14 px**, sin cursiva |
| **R-05** | `leading-snug` anulaba la escala | lh **1.38** | lh **1.55** |
| **R-06** | Nombre de tarjeta = título de sección | ambos **26 px w700** | tarjeta a **22 px** |
| **R-07** | Brújula se llevaba la primera mirada | **y ≈ 200** | **y ≈ 2758** — al pie |
| **R-08** | Títulos de `Callout` bajo cuerpos de 16 px | **12 px** | **14 px** |

## Verificación medida en el DOM, a 1920×1080

| Pantalla | Bloques por encima de 80 caracteres/línea |
| --- | :-: |
| Executive Dashboard | **0** |
| Lead Hunter | **0** |
| Opportunity View | **0** *(salvo un rótulo de una línea, que no envuelve)* |
| AI Showcase | **0** |
| Pitch Generator | **0** |

**Ningún párrafo del producto queda por debajo de 16 px.** El 14 px sobrevive solo en apostillas y metadatos, y el 12 px solo en versalitas.

---

# 2. Prioridad 7 — Coherencia de color, corregida en tres sitios

**El reparto semántico se estaba incumpliendo en elementos que no eran ni marca, ni acción, ni Score:**

| Elemento | Era | Es | Por qué |
| --- | :-: | :-: | --- |
| **Barras del embudo** | 🟠 naranja, **fuera** de la tarjeta y a sangre | 🟣 violeta, **dentro** de la tarjeta | Tres tramos al 100 % producían tres reglas naranjas que se leían como **divisores, no como medidas**. Una proporción no es marca ni acción: es análisis |
| **Las cuatro cifras del panel** | naranja, naranja, **violeta**, naranja | **todas blancas**; el tono viaja en el icono | El reparto parecía arbitrario y **ninguna de las cuatro dominaba**. `StatTile` gana `emphasis`, reservado a la cifra que sí *es* su tono: el Opportunity Score |
| **Chip de Score del Pitch** | tintado a mano, junto a chips neutros | `Badge tone="brand"` | Era el último chip escrito a mano del producto |

---

# 3. Prioridad 6 — Consistencia · los tres últimos restos

- **`ResultsHeader`** era la cuarta anatomía de encabezado superviviente *(display, mayúsculas y tamaño propios)* → ahora usa `Eyebrow`.
- **El aviso de dato de ejemplo del Dashboard** era el último bloque de integridad escrito a mano → ahora usa `Callout`.
- **Las pestañas** iban en `uppercase tracking-wider` con **los cuatro iconos en naranja**, también los inactivos, lo que anulaba la señal de «pestaña activa» → caja de frase, y **solo la activa lleva color**.

---

# 4. Prioridad 3 — Jerarquía · la prueba de 5 segundos, repetida

| Pantalla | Antes | Ahora | Qué se mira, en orden |
| --- | :-: | :-: | --- |
| **Executive Dashboard** | ✅ | ✅ | Titular → cuatro cifras → CTA naranja |
| **Opportunity View** | ✅ | ✅ | **85 a 60 px** → nombre → franja de calidad |
| **Lead Hunter** | 🟠 | ✅ | Titular → filtros y resultados → Score |
| **Pitch Generator** | 🟠 | ✅ | Titular → negocio → pasos numerados |
| **AI Showcase** | 🟠 | ✅ | Portada → pasos → resultado |

> **Las tres pantallas que fallaban lo hacían por la misma causa: la Brújula del Freelancer se llevaba la primera mirada.** Al bajarla al pie, las tres pasan a abrir por su titular.

## Sobre la Brújula — qué se cambió y qué no

**No se ha retirado ni un carácter de su contenido.** Eso habría sido una decisión de producto, y sigue siendo suya. Lo que cambió es **su peso y su posición**: pasa a renderizarse al final del área de trabajo, con tratamiento de nota al pie y su texto acotado a la medida de lectura.

Se usa `order-last`, de modo que **se mueve visualmente sin alterar el orden del DOM**: un lector de pantalla la sigue encontrando junto a la navegación, que es donde le corresponde.

---

# 5. Prioridad 4 — Espaciado

| Bloque | Antes | Después |
| --- | :-: | :-: |
| `main` — separación entre bloques | `space-y-8` · `py-8` | **`gap-10` · `py-10`** |
| Encabezado → contenido | `space-y-6` | **`space-y-7`** |
| Cuerpo de `LeadCard` | `space-y-5` | **`space-y-7`** |
| Tarjeta del embudo | fila comprimida | **`space-y-5`**, barra en su propia fila |
| `EmptyState` inline | `px-6` | **`px-7`**, título separado |

---

# 6. Validación

| Paso | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **0 errores** |
| `npm test` | ✅ **197 tests · 26 archivos** |
| `npm run build` | ✅ **CSS 43,6 kB · JS 332,7 kB** |
| **Recorrido completo de la demo** | ✅ **las cinco pantallas, en orden** |
| Medición en el DOM de las cinco pantallas | ✅ **0 bloques > 80 cpl · 0 texto < 14 px** |

---

# 7. Lo que NO se ha tocado

- **Backend, dominio, DTO, lógica, agentes y prompts** — sin excepción.
- **Ninguna condición de renderizado.** Todas las reglas de integridad (R-38, R-45) conservan su lógica exacta.
- **Ningún componente nuevo.** Las 11 primitivas siguen siendo 11; `StatTile` solo gana un parámetro.

---

# 8. Lo único que queda abierto

**Un solo punto, y es una decisión de datos, no de interfaz:**

Los Leads de muestra llevan el emoji **dentro del dato** — `classification: "🔥 Lead Excelente"` en `CL_SAMPLE_LEADS`. El componente ya no genera ningún emoji, pero lo pinta porque viene en el contenido. **Tocarlo es editar datos de ejemplo, no presentación**, y por eso no lo he hecho sin autorización. Es un cambio de dos cadenas si lo aprueba.

---

**Fase 5 entregada. Demo recorrida entera y coherente.**
