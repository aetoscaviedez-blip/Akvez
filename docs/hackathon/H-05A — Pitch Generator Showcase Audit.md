# H-05A — Pitch Generator Showcase Audit

| Campo | Valor |
| --- | --- |
| Documento | **H-05A — Pitch Generator Showcase Audit** |
| Clasificación | **Auditoría + registro de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y validado** · ⏸️ **Detenido. No se continúa con H-05B** |
| Fecha | 2026-08-05 |
| Sprint | **H-05A — Pitch Generator Showcase** |
| Antecedentes | H-02D — Pitch Generator Integrity Audit · H-02C — Fallback Visibility Audit · H-04 Fases 1 y 2 |

> **Solo UI.** No se tocó `server/`, ni `domain/`, ni `application/`, ni `infrastructure/`, ni prompts, ni DTOs, ni contratos, ni Cloud, ni pruebas, ni Blueprint. **El cuerpo de la petición a `/api/prospect/outreach` se conserva carácter por carácter.**

---

# 1. Auditoría de la pantalla anterior

**489 líneas en un único fichero.** Disposición: panel de control a la izquierda *(5/12)*, caja de salida a la derecha *(7/12)*.

## 1.1 🔴 El hallazgo principal — la pantalla no enseñaba el diagnóstico

> ### **`flaws` —los problemas web detectados, el hallazgo más concreto de todo el análisis— no aparecía en ninguna parte del Pitch Generator.**

La pantalla mostraba `description`, `revenueLoss` y `angle` en un recuadro de 4 líneas titulado «Análisis del Objetivo», y **el resto del análisis se perdía**. El usuario veía *qué proponer* sin ver nunca *qué se le encontró*.

**Consecuencia para la demo:** la pantalla enseñaba **la herramienta**, no el razonamiento. Un jurado veía un formulario y un cuadro de texto.

## 1.2 Datos disponibles y no mostrados

| Campo | Estado anterior | Ahora |
| --- | --- | :-: |
| **`flaws`** | 🔴 **No se mostraba** | ✅ Paso 2 |
| **`whyWebsiteNeeded`** | 🔴 **No se mostraba** | ✅ Paso 2 |
| **`score` · `band`** | 🔴 No se mostraban | ✅ Paso 1 |
| **`classification` · `source`** | 🔴 No se mostraban | ✅ Paso 1 |
| **`phone` · `googleMapsUrl` · `website`** | 🔴 No se mostraban | ✅ Pasos 1 y 5 |
| **`pitchChannel`** | 🔴 **Se guardaba y nadie lo leía** | ✅ Paso 4 — §1.4 |
| **`pitchAngle`** | 🔴 Se guarda y nadie lo lee | ⚠️ **Sigue sin usarse** — §6 |

## 1.3 Ruido, repetición y espacio sin valor

| # | Hallazgo | Tratamiento |
| :-: | --- | --- |
| **1** | **Barra de progreso falsa.** Ancho fijo al 70 % con la clase `animate-progress`, **que no existe**: una barra inmóvil que no medía nada | 🗑️ **Retirada** |
| **2** | **Afirmaciones que nadie puede sostener**: *«apertura irresistible libre de rechazo»*, *«mensajes libres de clichés comerciales»*, *«la plantilla ideal con una oferta de valor de baja fricción»*, *«Generando Persuasión…»* | ✏️ **Reescritas en términos verificables** |
| **3** | **«Paso 1: Configurar Variables»** — y **no había Paso 2** en ninguna parte de la pantalla | 🗑️ Sustituido por la numeración real de 5 pasos |
| **4** | **«Seleccionar Lead de Colombia»** — país fijado en la etiqueta | ✏️ «Negocio» |
| **5** | **Tres botones de canal copiados y pegados** — 13 líneas idénticas cada uno | ♻️ `map` sobre una constante |
| **6** | **La lógica del canal, duplicada**: el mismo ternario de tres ramas en el encabezado y en el botón de copiar | ♻️ Un único `CHANNEL_LABELS` |
| **7** | **El editor de firma ocupaba la cabecera** del panel de control, con el mismo peso visual que el negocio | 📦 Plegado en la barra de contexto |

## 1.4 🔴 Dos defectos de datos

### Defecto A — el canal mostrado no era el canal del texto

**El encabezado y el botón «Copiar» leían el selector, no el pitch.**

> **Bastaba generar un email y cambiar el selector a LinkedIn** para que la pantalla rotulase **«Outreach Optimizado para LinkedIn»** sobre un texto de correo, y para que «Copiar» **dejara de incluir el asunto**.
>
> **`pitchChannel` se guardaba desde el principio y nadie lo leía.** Ahora es la única fuente del canal mostrado.

### Defecto B — ausencias que se rendían como huecos

```tsx
&ldquo;{activeLead.description}&rdquo;      // sin descripción → comillas vacías
<strong>Ángulo Detectado:</strong> {activeLead.angle}   // sin ángulo → etiqueta colgando
```

**Ninguno de los dos iba condicionado.** Un Lead sin esos campos rendía **una etiqueta sin contenido**, que es justamente lo que el encargo prohíbe.

## 1.5 Clases CSS muertas

| Clase | Usos en esta pantalla | Estado |
| --- | :-: | --- |
| `animate-fadeIn` | 3 | ❌ **No existe.** Tailwind 4 no la trae y el proyecto no la declara |
| `animate-fade-in` | 3 | ❌ **No existe** — nombre distinto, mismo problema |
| `animate-progress` | 1 | ❌ **No existe** |
| `text-rose-450` | 1 | ❌ **No existe** — Tailwind no tiene el tono `450`. El texto «Dolor Comercial» **se veía sin color** |

**Las cuatro se retiraron de esta pantalla.** Las animaciones reales usan `ak-rise`, ya definida y bajo `motion-safe:`.

> ⚠️ **`animate-fade-in` sigue viva en 6 puntos de `lead-hunter/`**, fuera del alcance de este sprint. Registrado en §6.

---

# 2. La narrativa implementada

```
   ┌──────────────────────────────────────────────────────────────┐
   │  Generador de mensajes                                       │
   │  [Negocio ▾]                    [Firma del diseñador ▾]      │
   └──────────────────────────────────────────────────────────────┘

   01 ─── EL NEGOCIO ────────────────────────────────────────────
    │     La Fogata Parrilla
    │     [Google Maps] [Sitio web · deficiente] [🔥 Score 78 · Alta]
    │     🌐 sitio · 📞 teléfono · 📍 Maps
    │     descripción del análisis
    │
   02 ─── EL DIAGNÓSTICO ────────────────────────────────────────
    │     Problema encontrado
    │     ┌ PDF de 15MB ┐ ┌ Sin reservas ┐ ┌ Bajo contraste ┐
    │     ┌ Impacto comercial ┐ ┌ Por qué necesita web ┐
    │
   03 ─── EL ÁNGULO ─────────────────────────────────────────────
    │     Oportunidad detectada
    │     ┌ Ángulo de oportunidad ┐
    │
   04 ─── LA REDACCIÓN ──────────────────────────────────────────
    │     Pitch generado
    │     [Email] [LinkedIn] [Instagram]  · instrucciones
    │     [ Generar mensaje ]
    │     ┌ Mensaje generado · Email frío        [Copiar] ┐
    │     │ ✨ Redactado con IA                          │
    │     │ Asunto sugerido: …                           │
    │     │ cuerpo del mensaje                           │
    │
   05 ─── EL SIGUIENTE PASO ─────────────────────────────────────
          Acción recomendada
          Canal del mensaje redactado: Email frío
          ┌ Llamar ┐ ┌ Ficha de Maps ┐ ┌ Sitio web ┐
```

**El numeral y la guía vertical no son decoración:** son lo que convierte cinco bloques en una secuencia, y lo que permite narrar la pantalla en la demo sin explicar la interfaz.

## 2.1 «Acción recomendada» — qué se recomienda exactamente

> **No se recomienda ninguna hora, ninguna frecuencia ni ningún guion de seguimiento.** El sistema no mide nada de eso, y recomendarlo sería inventar.

**Lo que sí es real:** el canal con el que se redactó el texto y **las vías de contacto que el descubrimiento aportó** — teléfono, ficha de Maps y sitio web. **Las tres se muestran siempre**, las disponibles activas y las ausentes desactivadas con su motivo.

**Y una declaración que faltaba:** si el mensaje se redactó para LinkedIn o Instagram, la pantalla dice que **AKVEZ no dispone del perfil social** del negocio, porque Google Places no lo aporta. **Antes, la pantalla entregaba un mensaje de Instagram sin advertir que no había destinatario.**

---

# 3. Toda ausencia, declarada

| Dato ausente | Qué muestra la pantalla |
| --- | --- |
| `description` | «El análisis no produjo una descripción de este negocio.» |
| `flaws` vacío | «No detectó problemas web […] es un resultado, no un fallo: el mensaje tendrá que apoyarse en otro argumento.» |
| `revenueLoss` | «El análisis no estimó impacto comercial para este negocio.» |
| `whyWebsiteNeeded` | «El análisis no explicó por qué este negocio necesita un sitio web.» |
| `angle` | «No se generó un ángulo de oportunidad […] El mensaje se redactará sin él.» |
| `pitchChannel` | **«Canal no registrado»** — no se supone ninguno |
| `pitchSource` | **«Origen no registrado […] No consta si lo produjo la IA o una plantilla.»** |
| `phone` · `googleMapsUrl` | «Sin teléfono registrado» · «Sin ficha registrada» |
| `website` | **«Sin sitio web — es el argumento»** |
| `designerProfile.name` vacío | «Sin nombre de firma» |
| Sin mensaje generado | «Genera el mensaje para ver las vías de contacto disponibles.» |
| Sin Leads | «Todavía no hay negocios.» |

**Los tres avisos de integridad se conservan íntegros:** negocio de ejemplo, plantilla de respaldo y origen no registrado. **Ninguno se suavizó.**

---

# 4. Archivos

| # | Archivo | Cambio | Líneas |
| :-: | --- | --- | :-: |
| **1** | `src/modules/pitch-generator/presentation/PitchGenerator.tsx` | 🔵 **Reescrito** — narrativa de 5 pasos | **~600** *(antes 489)* |
| **2** | `…/presentation/components/NarrativeStep.tsx` | 🟢 **Creado** — paso numerado + `AbsentData` | **~85** |
| **3** | `…/presentation/components/PitchOutput.tsx` | 🟢 **Creado** — salida y origen del texto | **~155** |
| **4** | `…/presentation/components/DesignerSignaturePanel.tsx` | 🟢 **Creado** — firma plegable | **~110** |
| **5** | `docs/hackathon/H-05A — Pitch Generator Showcase Audit.md` | 🟢 **Creado** — este documento | — |
| **6** | `docs/hackathon/H-05A — Checklist de Demo.md` | 🟢 **Creado** — entregable 3 | — |

**Backend: cero ficheros tocados. Cero dependencias nuevas. `src/index.css` sin cambios** — se reutiliza `ak-rise` de H-04.

---

# 5. Validaciones

| Validación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **Sin errores** |
| `npx tsc --noEmit` | ✅ **Sin errores** |
| `npm test` | ✅ **197 / 197** · 26 ficheros — **ninguna prueba modificada** |
| `npm run build` | ✅ **Compila** |

## 5.1 Verificación de render — 33 comprobaciones

**Renderizado en Node con `react-dom/server`** *(script desechable, ejecutado y eliminado)* sobre 8 escenarios:

| Escenario | Comprobado | ✓ |
| --- | --- | :-: |
| **Narrativa completa** | Los 5 pasos presentes; `flaws` visibles; `whyWebsiteNeeded` visible; Score y banda | ✅ |
| **Pitch de LinkedIn con el selector en Email** | Rotula **«Nota de LinkedIn»**; **no muestra asunto**; declara que falta el perfil social | ✅ **Defecto A corregido** |
| **Lead sin ningún campo de análisis** | Las 5 ausencias declaradas; **ninguna comilla vacía** | ✅ **Defecto B corregido** |
| **Pitch de email** | Asunto visible; canal rotulado; vía telefónica activa | ✅ |
| **Respaldo** | «Plantilla de respaldo»; advertencia de no adaptación | ✅ |
| **Origen no registrado** | Se declara y **no se atribuye a la IA** | ✅ |
| **Pitch sin `pitchChannel`** | «Canal no registrado» | ✅ |
| **Sin Leads · Lead de ejemplo** | Estado vacío; aviso de datos ficticios conservado | ✅ |
| **Clases muertas** | `animate-fadeIn`, `animate-fade-in`, `animate-progress`, `rose-450` **ya no se emiten** | ✅ |

## 5.2 🔴 Capturas — no fue posible

**No hay extensión de navegador conectada en este entorno.** Tipografía, espaciado, la guía vertical de los pasos y el comportamiento *responsive* están razonados sobre el código, **no vistos**. Es la revisión pendiente antes de la demo.

---

# 6. Hallazgos no resueltos

| # | Hallazgo | Por qué no se tocó |
| :-: | --- | --- |
| **1** | **`pitchAngle` se guarda en cada generación y nadie lo lee.** Es el `angle` congelado en el momento de redactar | Mostrarlo junto al `angle` actual solo aporta si divergen, y hoy no pueden: se escriben a la vez. **Se propone retirarlo o darle uso; no es decisión de interfaz** |
| **2** | **`animate-fade-in` sigue muerta en 6 puntos de `lead-hunter/`** | Fuera del alcance. **Se cierra con 4 líneas en `index.css`** — ya propuesto en H-04 Fase 1 §10 |
| **3** | **El origen del análisis del negocio no se declara aquí** — solo el del pitch | `usedFallbackAnalysis` por Lead **no cruza el DTO**. Documentado en H-04 Fase 1 §8 y H-03B |
| **4** | **`status: "Pitched"` se escribe y no se muestra** | El vocabulario de `LeadStatus` está en revisión de gobernanza. **No se expone sin autorización** |
| **5** | **La petición envía `lead` completo donde el contrato declara `leadId`** | `outreachPitch.ts` declara `OutreachRequestDTO.leadId`; el cliente envía `lead`. **Es una divergencia real de contrato**, y corregirla es backend |

> **El punto 5 es el más relevante de la lista** y no pertenece a este sprint: tocarlo exigiría modificar el contrato, expresamente prohibido.

---

# 7. Verificación de las restricciones

| Restricción | Estado |
| --- | :-: |
| No crear lógica de IA · no modificar prompts | ✅ **La llamada es idéntica**, cuerpo incluido |
| No tocar dominio · `application/` · `infrastructure/` · Blueprint | ✅ `server/` sin tocar |
| No modificar backend · DTO · contratos · IA · Cloud | ✅ **Cumplida** |
| **No modificar pruebas** | ✅ **197/197 intactas** |
| No inventar información · no reutilizar textos genéricos | ✅ §1.3 punto 2 — retiradas las afirmaciones no sostenibles |
| Toda ausencia mostrada explícitamente | ✅ §3 — **12 ausencias declaradas** |
| Eliminar sensación de plantilla | ✅ Retirada la barra de progreso falsa, el «Paso 1» huérfano y las 4 clases muertas |

---

# 8. Referencias

**Creado:** `components/NarrativeStep.tsx` · `components/PitchOutput.tsx` · `components/DesignerSignaturePanel.tsx`.
**Reescrito:** `presentation/PitchGenerator.tsx`.

**Consultado, no tocado:** `server/shared/contracts/outreachPitch.ts` · `src/shared/types/index.ts` · `src/index.css`.

**Blueprint:** DEV-00 R-38, R-45, R-48 · APS-20 §RC-9.

**Documentos:** H-02D — Pitch Generator Integrity Audit · H-02C — Fallback Visibility Audit · H-04 Fase 1 §8, §10 · H-04 Fase 2 · H-03B.
