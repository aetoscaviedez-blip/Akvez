# H-07C — Fase 1 · Fundación del Design System

| Campo | Valor |
| --- | --- |
| Documento | **H-07C — Fase 1 Implementation** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementada · `tsc --noEmit` y `vite build` en verde** · pendiente de aprobación para la Fase 2 |
| Fecha | 2026-08-05 |
| Origen | **H-07 — Demo Polish Audit**, Fase 1 *(aprobada por el PO)* |
| Alcance tocado | **`src/index.css` + 26 archivos de `presentation/`.** Dominio, application, infrastructure, backend, prompts, DTO y Blueprint **sin una sola línea modificada** |

---

# 1. Qué se ha corregido, y por qué importaba

## 1.1 · 🔴 El vocabulario de color no existía

**El problema.** Los dos tokens de acento mentían sobre su propio nombre:

```css
--color-accent-green:     #ff7a00;   /* era NARANJA */
--color-secondary-orange: #8b5cf6;   /* era VIOLETA */
```

**Por qué afectaba a la percepción.** No era una molestia de nomenclatura: era la **causa raíz** de que el sistema de color no existiera. Con un token llamado «verde» que pintaba naranja, cada pantalla acabó usando `accent-green` para **marca, acción, inteligencia y validación a la vez**. La regla del ADN —*tres colores, tres significados*— **no podía cumplirse porque no había vocabulario para expresarla.** El resultado era una interfaz monocroma naranja, y en una interfaz donde todo es acento, **nada es acento**.

**Cómo mejora la demo.** El jurado deja de ver una pantalla teñida y empieza a ver una pantalla **jerarquizada**. Es la condición previa de todo lo demás: sin este cambio, las fases 2 a 4 serían maquillaje.

**Vocabulario resultante** *(APS-04 §10-11, coincidente con la referencia)*:

| Token | Valor | Significado |
| --- | :-: | --- |
| `brand` | `#F97316` | Marca y acción |
| `intel` | `#8B5CF6` | Inteligencia y análisis |
| `success` | `#22C55E` | Dinero y validación |
| `warn` | `#F59E0B` | Advertencia *(acento puntual)* |
| `danger` | `#EF4444` | «Sin sitio web» *(acento puntual)* |

## 1.2 · 🟠 La profundidad estaba invertida

**El problema.** Solo existían dos superficies, y **`dark-bg` —el lienzo de la página— se usaba como fondo de contenedores anidados dentro de tarjetas**. Un bloque interior quedaba *más oscuro* que su padre.

**Por qué afectaba a la percepción.** La referencia obtiene su profundidad **sin una sola sombra**, apilando tres superficies ascendentes. Con la jerarquía invertida, las tarjetas parecían agujeros en lugar de capas: es exactamente la diferencia entre *sobrio* y *plano*.

**Cómo mejora la demo.** El contenido anidado —desglose del Score, chips, campos, contadores— pasa a **elevarse** sobre su tarjeta. Es el cambio que más contribuye a la sensación de solidez en los primeros segundos, y no cuesta un solo píxel de layout.

```
#0A0A0F  lienzo
   └── #121218 + borde #22222C     tarjeta            (+6 puntos de luz)
          └── #1A1A24 + borde      tarjeta interior   (+8 puntos)
```

**Los 47 usos de `bg-dark-bg` anidados migraron a `bg-surface-raised`.** El único uso legítimo como lienzo —`App.tsx`, `min-h-screen`— se conservó.

Además, **el lienzo pasa de `#0a0a0a` neutro a `#0A0A0F`**. Son tres dígitos hexadecimales: el tinte azul-violáceo es lo que separa «producto» de «apagado» en toda la aplicación a la vez.

## 1.3 · 🔴 Tres naranjas, y el CTA cambiaba de color a mitad del recorrido

**El problema.** `#ff7a00` (token), **`#E28A5D` (12 usos hardcodeados)** y `#ff6b35` convivían. El caso grave: **el CTA primario del Panel era `#ff7a00` y el del Lead Hunter `#E28A5D`.**

**Por qué afectaba a la percepción.** Son las **dos acciones primarias consecutivas del recorrido de la demo**. La segunda pantalla repintaba la acción principal de la primera. Ningún jurado lo verbaliza, pero es exactamente el tipo de detalle que produce la sensación de «esto lo han montado varias personas».

**Cómo mejora la demo.** El recorrido Panel → Lead Hunter deja de tener una fractura visual en su transición más importante. **Era la peor del producto, y era la primera.**

Se unificó también el tratamiento del texto: dos CTA usaban texto blanco sobre naranja (**2,9:1 de contraste — falla AA**) frente a texto oscuro en el resto (**7,9:1**). Todos usan ahora `text-dark-bg`.

## 1.4 · 🟡 Las sombras contradecían la dirección de arte

**El problema.** Cinco tratamientos de sombra (`sm`, `md`, `lg`, `inner`, y sombras de color) más las clases `.neon-glow` / `.neon-border`.

**Por qué afectaba a la percepción.** La sombra genérica es, junto al emoji, el marcador visual número uno de «plantilla». El propio nombre `neon-*` describía un lenguaje —brillo, resplandor— **que la referencia no tiene en ninguna parte**.

**Cómo mejora la demo.** La profundidad pasa a ser **puramente lumínica**: tres superficies, dos bordes de 1 px, cero sombras. Es lo que hace que una interfaz se sienta sólida en lugar de flotante.

## 1.5 · 🔴 La cabecera publicaba un dato fabricado

**El problema.**

```tsx
{leads.length * 11 + 72} oportunidades encontradas
```

**Por qué afectaba a la percepción.** Era **el único dato inventado que quedaba en AKVEZ**, en el punto de máxima exposición del producto: la cabecera, visible en las cinco pantallas durante toda la demo, y **la primera cifra que un jurado lee**.

**Cómo mejora la demo.** Sustituida por el **recuento real** de negocios en el espacio de trabajo — el mismo número que el usuario puede comprobar contando tarjetas.

> **Esto no es una concesión estética: es lo que permite que la respuesta a «¿de dónde sale ese número?» sea siempre demostrable en pantalla.** La disciplina de integridad que este proyecto sostiene desde hace seis sprints es un activo competitivo; esta línea era la única grieta que quedaba en ella.

## 1.6 · 🟠 El pie nombraba otro producto

«© 2026 **LeadFlow Colombia Suite**» y «Bautizado con Google Gemini en Español», en las cinco pantallas. **El producto se llama AKVEZ.** Corregido, y la atribución técnica pasa a declarar lo que el sistema realmente usa: *«Análisis con Google Gemini · Descubrimiento con Google Places»*.

## 1.7 · Colores crudos absorbidos

`red-400/500`, `amber-300/400/500`, `emerald-400/500`, `teal-400/500` y `orange-400/500` → tokens declarados. **Rojo queda reservado a «Sin sitio web»**, el único uso que el ADN le asigna.

---

# 2. Escalas declaradas — se aplican en fases posteriores

**Radios** *(regla: cuanto más contenedor, más radio)*:

| Token | Valor | Uso |
| --- | :-: | --- |
| `rounded-container` | 16 px | Tarjeta mayor, hero, sección |
| `rounded-card` | 14 px | Tarjeta de contenido |
| `rounded-inset` | 12 px | Contenedor dentro de tarjeta |
| `rounded-control` | 10 px | Botón, chip, campo, fila |

**Tipografía** — `text-score` (96 px / 900), `text-figure` (48 px), `text-eyebrow` (11 px / +0.12em).

> **La ratio que define el carácter: 96 / 13 ≈ 7,4×.** Es una escala editorial, no de formulario, y es la razón principal de que una pantalla se lea como producto y no como panel de administración.

**Se declaran ahora y se aplican en las Fases 2 y 4**, cuando existan las primitivas que las ocupen. Aplicarlas hoy exigiría una decisión por punto de uso —¿este `rounded-2xl` es un contenedor o un chip?— que es precisamente el trabajo de la Fase 2.

---

# 3. Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npx tsc --noEmit` | ✅ **0 errores** |
| `npx vite build` | ✅ **1707 módulos · 3,4 s** |
| Utilidades generadas *(`bg-brand`, `bg-surface-raised`, `text-warn`, `bg-success`, `text-danger`, `bg-intel`)* | ✅ **presentes en el CSS compilado** |
| Valores de token en el CSS compilado | ✅ **coinciden con APS-04** |
| Hexadecimales sueltos en `.tsx` | ✅ **0** *(quedan 2 en un comentario que documenta lo retirado)* |
| `accent-green` · `secondary-orange` · `neon-*` · `shadow-*` | ✅ **0 ocurrencias** |

**Riesgo de regresión silenciosa:** una clase de Tailwind inexistente no falla el build, simplemente no emite CSS. Por eso se comprobó **la presencia efectiva de cada utilidad nueva en el CSS compilado**, y no solo que el proyecto compilara.

---

# 4. Decisiones tomadas, y su justificación

| # | Decisión | Justificación |
| :-: | --- | --- |
| **1** | **`secondary-orange` (violeta) → `warn` (ámbar)**, en lugar de renombrarse a `intel` | Sus puntos de uso son **advertencias**: iconos de problemas detectados, banner del motor de respaldo, impacto financiero. Renombrarlo a `intel` habría dejado las advertencias pintadas de «inteligencia» — la misma mentira en sentido contrario. **El violeta queda liberado y reservado**, y la Fase 4 lo reparte |
| **2** | **`dark-bg` / `dark-surface` conservan su nombre** | No mienten. Renombrarlos habría multiplicado la superficie de cambio sin corregir ningún error de significado |
| **3** | **El reparto semántico se aplaza a la Fase 4** | La Fase 1 crea el vocabulario; asignar qué elemento recibe cada color exige decidir punto por punto. Mezclarlo aquí habría hecho imposible revisar este cambio |
| **4** | **Texto oscuro sobre naranja en todos los CTA** | 7,9:1 frente a 2,9:1. La referencia sugiere texto claro, pero **falla AA** — y un jurado técnico que abra el inspector lo comprueba en un clic |

---

# 5. Lo que esta fase NO ha tocado

- **Dominio, application, infrastructure, backend, prompts, DTO y Blueprint** — sin excepción. La migración se ejecutó exclusivamente sobre `*.tsx`.
- **Ninguna condición de renderizado ligada a integridad:** avisos de dato de ejemplo, declaraciones de ausencia, `typeof score === "number"`, estado del motor de análisis, atribución separada de factores. **Cambió su color, nunca su lógica.**
- **El sistema de animación** (`ak-rise`, `ak-bar`, `ak-ring`) y su protección `motion-safe:`.
- **Ninguna estructura, ninguna pantalla, ninguna funcionalidad, ningún campo.**

---

# 6. Estado de los hallazgos de H-07

| Hallazgo | Estado |
| --- | :-: |
| F-01 tokens invertidos · F-03 tres naranjas · F-18 cifra fabricada · F-19 pie de página | ✅ **Resuelto** |
| F-04 superficies · F-07 sombras · F-09 colores crudos | ✅ **Resuelto** |
| F-05 radios · F-06 tipografía | 🟡 **Declarado; se aplica en Fases 2 y 4** |
| F-02 banda del Score en verde, violeta para la inteligencia | 🟡 **Vocabulario listo; se reparte en la Fase 4** |
| F-08 emojis · F-10 a F-17 · F-20 a F-26 | ⬜ **Fases 2, 3, 5 y 6** |

---

**Fase 1 entregada y verificada. A la espera de aprobación para la Fase 2 — primitivas compartidas.**
