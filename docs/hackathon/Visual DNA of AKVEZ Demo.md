# Visual DNA of AKVEZ Demo

| Campo | Valor |
| --- | --- |
| Documento | **Visual DNA of AKVEZ Demo** |
| Clasificación | **Dirección de arte** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Ingeniería inversa completa** · **cero código escrito** |
| Fecha | 2026-08-05 |
| Fuente | **Referencia visual oficial** — captura «AKVEZ PRO», vista Lead Detail · 1402 × 1122 px |
| Autoridad | **Autoridad absoluta sobre composición, estilo, jerarquía, ritmo, profundidad y dirección artística** *(orden de prioridad del sprint H-07)* |

> **Todas las medidas se leen de la referencia a 1402 px de ancho.** Son proporcionales: lo que importa es la relación entre ellas, no el píxel absoluto.

---

# 1. Por qué esta interfaz se siente premium

**Antes de las medidas, el diagnóstico.** Diez mecanismos, ordenados por cuánto aportan a esa sensación.

| # | Mecanismo | Cómo opera |
| :-: | --- | --- |
| **1** | ⭐ **Un solo número manda** | El **87** ocupa ~96 px de cuerpo: **siete veces el texto base**. La mirada tiene un único destino, y ese destino es el dato que vende el producto |
| **2** | ⭐ **Tres colores, tres significados, cero excepciones** | **Naranja = marca y acción · Violeta = inteligencia · Verde = dinero y validación.** Nada más lleva color. Una interfaz que usa el color como *información* se lee como sistema, no como decoración |
| **3** | ⭐ **El dinero está en pantalla** | **«Valor potencial del proyecto · USD 800 - 1,500»** en verde, a 30 px. Es la señal más comercial de toda la captura: el producto no dice qué hace, dice **cuánto vale** |
| **4** | **Profundidad sin sombras** | Tres capas de superficie —fondo, tarjeta, tarjeta interior— separadas por **1 px de borde** y ~6 puntos de luminancia. Cero `box-shadow` pronunciado. Es lo que distingue *sobrio* de *plano* |
| **5** | **Todo es tarjeta** | La pantalla es una pila de contenedores. **Nada flota suelto sobre el fondo.** Cada bloque tiene borde, radio y aire propio |
| **6** | **Densidad alta, ruido cero** | Hay ~40 datos simultáneos y no agobia, porque cada grupo está **delimitado por superficie**, no por líneas divisorias |
| **7** | **Cada afirmación viene verificada** | Las cuatro tarjetas de razones llevan un **check verde en la esquina**. El producto no afirma: acredita |
| **8** | **Una acción primaria inconfundible** | Tres tarjetas de acción; **una sola es naranja sólida**. No hay duda de qué hacer |
| **9** | **Los contadores insinúan escala** | 218 · 156 · 310 · 94… El lateral comunica **volumen de mercado** sin una sola frase de marketing |
| **10** | **El sistema se declara vivo** | «● Agente activo • 94 oportunidades encontradas» en la cabecera. El producto trabaja aunque no lo mires |

> ### **La síntesis:** esta interfaz parece financiada porque **subordina toda la estética a una jerarquía de negocio**: primero cuánto vale, después por qué, después qué hacer. La dirección de arte no adorna el dato — **lo pone en escena.**

---

# 2. Layout y grid

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER · 92px                                                            │
│  ◉AK VEZ [PRO]      ● Agente activo • 94 oportunidades      ? ⌂ ⚙ (AK)   │
├──────────────────────────────────────────────────────────────────────────┤
│  TABS · 78px                                                              │
│  ⚑ Oportunidades │ ✉ Generar mensaje                                      │
│  ━━━━━━━━━━━━━━━ (subrayado naranja 3px)                                  │
├────────────────┬─────────────────────────────────────────────────────────┤
│                │  ← Volver al listado        5 de 94   ( ‹ ) ( › )        │
│  SIDEBAR       │  ┌───────────────────────────────────────────────────┐   │
│  288px fijo    │  │  HERO · 326px                                     │   │
│                │  │  ◯logo   Nombre del negocio      OPPORTUNITY      │   │
│  ┌──────────┐  │  │          ☎ tel  ⌖ zona              SCORE         │   │
│  │ Nicho  ⌄ │  │  │          [chip][chip][chip]          87           │   │
│  │ 🔍 buscar│  │  │          ┌── valor ─────────┐   ⬤ Excelente       │   │
│  │ ▓selec.  │  │  │          │ USD 800-1,500   │   Confianza ▬▬▬ 96%  │   │
│  │  item 218│  │  └───────────────────────────────────────────────────┘   │
│  │  ...     │  │  ┌───────────────────────────────────────────────────┐   │
│  │ Ciudad ⌃ │  │  │  ¿POR QUÉ ES UNA EXCELENTE OPORTUNIDAD?           │   │
│  │ ▓Bogotá  │  │  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   ┌─ Portafolio ─┐          │   │
│  │  ...     │  │  │  │◍✓│ │◍✓│ │◍✓│ │◍✓│   │ ▦▦  texto    │          │   │
│  │[ CTA   ] │  │  │  └──┘ └──┘ └──┘ └──┘   └──────────────┘          │   │
│  └──────────┘  │  └───────────────────────────────────────────────────┘   │
│  ┌──────────┐  │  ┌───────────────────────────────────────────────────┐   │
│  │ 💡Consejo│  │  │  ¿QUÉ PUEDES HACER AHORA?                         │   │
│  └──────────┘  │  │  [ acción ] [ acción ] [ ACCIÓN NARANJA ]         │   │
│                │  └───────────────────────────────────────────────────┘   │
│                │        [ Buscar más ]  [ Siguiente oportunidad ]         │
└────────────────┴─────────────────────────────────────────────────────────┘
```

| Medida | Valor | Nota |
| --- | :-: | --- |
| **Ancho de página** | **1402 px** | Sin `max-width` visible: ocupa la ventana |
| **Padding lateral** | **24 px** | Constante a izquierda y derecha |
| **Header** | **92 px** | Fondo ligeramente más claro que el cuerpo |
| **Barra de pestañas** | **78 px** | Separada del header por 1 px de borde |
| **Sidebar** | **288 px fijo** | No colapsa. Empieza a 24 px del borde |
| **Canal sidebar ↔ contenido** | **40 px** | |
| **Contenido** | **~1028 px fluido** | |
| **Separación entre tarjetas mayores** | **24 px** | Ritmo vertical constante |
| **Padding interno de tarjeta mayor** | **28 px** | |
| **Padding interno de tarjeta menor** | **20 px** | |

**Rejilla del contenido:** las cuatro tarjetas de razones ocupan **4 columnas iguales** (~150 px) con `gap` de **16 px**, y el panel de portafolio ocupa el ancho restante (~300 px) a la derecha. Las tres tarjetas de acción son **3 columnas iguales** con `gap` de **20 px**.

---

# 3. Escala tipográfica medida

| Rol | Tamaño | Peso | Caso | Tracking | Dónde |
| --- | :-: | :-: | --- | :-: | --- |
| **Score** | **96 px** | **900** | — | ceñido | El «87» |
| **Nombre de negocio** | **28 px** | 700 | Frase | −0.5 % | «Estudio Fotográfico La Candelaria» |
| **Cifra de valor** | **30 px** | 700 | — | normal | «USD 800 - 1,500» |
| **Título de sección** | **17 px** | 700 | **MAYÚSCULAS** | +2 % | «¿POR QUÉ ES UNA EXCELENTE OPORTUNIDAD?» |
| **Título de tarjeta lateral** | **17 px** | 600 | Frase | normal | «Selecciona tu nicho» · «Ciudad» |
| **Título de tarjeta de razón** | **14 px** | 700 | Frase | normal | «No tiene sitio web» |
| **Título de acción** | **14 px** | 700 | Frase | normal | «Generar mensaje personalizado» |
| **Contacto del negocio** | **15 px** | 400 | Frase | normal | «310 456 7890» |
| **Cuerpo** | **13 px** | 400 | Frase | normal | Textos de tarjeta |
| **Subtítulo de acción** | **12 px** | 400 | Frase | normal | «Email, WhatsApp o LinkedIn» |
| **Etiqueta en versalitas** | **12 px** | 600 | **MAYÚSCULAS** | **+8 %** | «OPPORTUNITY SCORE» |
| **Ítem de lista lateral** | **14 px** | 500 | Frase | normal | «Fotógrafos» |
| **Contador lateral** | **13 px** | 500 | — | normal | «218» |

> ### **La ratio que define el carácter: 96 / 13 = 7,4×.**
>
> **Entre el dato protagonista y el texto base hay siete veces de diferencia.** Es una escala editorial, no de formulario — y es la razón principal de que la pantalla se lea como producto y no como panel de administración.

**Dos familias:** una geométrica de alto peso para cifras y títulos; una grotesca neutra para todo lo demás. **Coincide con `font-display` / `font-sans` ya declaradas en el proyecto.**

---

# 4. Paleta leída de la referencia

## 4.1 Superficies

| Rol | Valor leído | Uso |
| --- | :-: | --- |
| **Fondo base** | **`#0A0A0F`** | Cuerpo de la aplicación. **Azulado, no gris neutro** |
| **Superficie** | **`#121218`** | Tarjetas mayores, sidebar, header |
| **Superficie elevada** | **`#1A1A24`** | Tarjetas dentro de tarjetas, chips, campos, contenedores de icono |
| **Borde** | **`#22222C`** | 1 px en todo contenedor |
| **Texto primario** | **`#FAFAFA`** | |
| **Texto secundario** | **`#9CA3AF`** | Etiquetas, contadores, cuerpo de apoyo |

> **El fondo tiene tinte azul-violáceo.** Un `#0A0A0A` neutro —el que hay hoy en el código— produce una interfaz **más apagada y menos «producto»**. Es un cambio de tres dígitos hexadecimales con efecto perceptible en toda la aplicación.

## 4.2 Los tres colores con significado

| Color | Valor | Significado | Dónde aparece **exactamente** |
| --- | :-: | --- | --- |
| 🟠 **Naranja** | **`#F97316`** | **Marca y acción** | Isotipo · pestaña activa y su subrayado · **la cifra del Score** · CTA lateral · tarjeta de acción primaria · botón «Buscar más» · icono del Consejo |
| 🟣 **Violeta** | **`#8B5CF6`** | **Inteligencia y análisis** | **Iconos de las cuatro razones** · **barra de confianza** · **fila seleccionada del lateral** · «¿POR QUÉ» del título · «Ver más fotos» |
| 🟢 **Verde** | **`#22C55E`** | **Dinero y validación** | **«Valor potencial del proyecto»** · **«USD 800 - 1,500»** · **píldora «Excelente oportunidad»** · los cuatro checks de verificación · punto de «Agente activo» |

## 4.3 Acentos puntuales

| Color | Valor | Único uso observado |
| --- | :-: | --- |
| **Ámbar** | `#F59E0B` | Estrella de la valoración |
| **Rojo** | `#EF4444` | Icono de «Sin sitio web» |

> ### **Dos hallazgos que corrigen la implementación actual:**
>
> **1 · La banda del Score es VERDE, no naranja.** «Excelente oportunidad» se pinta como **valor conseguido**, no como marca. El naranja se reserva a la cifra y a la acción.
>
> **2 · El violeta lleva toda la inteligencia.** Los cuatro iconos de razones, la barra de confianza y la selección del lateral. **Confirma el hallazgo F-2 de H-06B**, ahora con la referencia oficial delante.

---

# 5. Sistema de forma

## 5.1 Radios — ⚠️ corrección de H-06B

| Elemento | Radio leído |
| --- | :-: |
| Tarjeta mayor | **16 px** |
| Tarjeta de razón / acción | **14 px** |
| Tarjeta interior *(valor potencial)* | **12 px** |
| **Botones — todos** | **10 px** |
| Chips de datos *(«Sin sitio web», «4.8»)* | **10 px** |
| Campo de búsqueda | **10 px** |
| Fila seleccionada del lateral | **10 px** |
| **Píldora de banda** *(«Excelente oportunidad»)* | **`full`** |
| **Barra de confianza** | **`full`** |
| Contenedores de icono · avatar · botones de cabecera | **`full`** *(círculo)* |

> ### 🔴 **Corrijo una recomendación mía de H-06B.**
>
> Basándome en APS-04 §13 escribí que **botones y chips deben ser `radius-full`**. **La referencia oficial los muestra a 10 px.** Solo son completamente redondeados la píldora de banda, la barra de progreso y los contenedores circulares de icono.
>
> **Prevalece la imagen.** La regla real es: **cuanto más contenedor, más radio (16 → 14 → 12); los controles se quedan en 10; el círculo se reserva a estados y a iconos.**

## 5.2 Profundidad

**No hay sombras proyectadas.** La jerarquía es **puramente lumínica**:

```
#0A0A0F  fondo
   └── #121218 + borde #22222C     tarjeta        (+ 6 puntos de luz)
          └── #1A1A24 + borde      tarjeta interior (+ 8 puntos)
```

**Tres capas, dos bordes, cero sombra.** Es lo que hace que la interfaz se sienta **sólida y no flotante** — y es también lo que la salva de parecer una plantilla con `box-shadow` genérica.

## 5.3 Iconografía

- **Lineal, trazo uniforme, esquinas redondeadas** — coherente con Lucide, ya en el proyecto.
- **16 px** en contextos de texto y chips; **20 px** en botones y acciones.
- **Contenedores circulares** en dos variantes:
  - **56 px con tinte violeta** al 12-15 % → iconos de razones *(inteligencia)*
  - **40 px sobre superficie elevada** → iconos de acción *(neutro)*
- **El icono nunca compite con el texto:** siempre por delante y en el color del contexto.

---

# 6. Sistema de componentes

| Componente | Anatomía leída |
| --- | --- |
| **Chip de dato** | Superficie elevada · borde 1 px · radio 10 px · alto **40 px** · icono 16 px + texto 13 px · el icono lleva el color semántico, **el texto no** |
| **Píldora de banda** | `radius-full` · alto **36 px** · fondo verde al ~12 % · borde verde al ~35 % · **texto verde sólido** |
| **Tarjeta de razón** | Radio 14 px · padding 20 px · **icono circular violeta arriba y centrado** · **check verde en la esquina superior derecha** · título 14/700 centrado · cuerpo 13/400 centrado, 2 líneas |
| **Tarjeta de acción** | Radio 14 px · alto **72 px** · icono circular 40 px + bloque de dos líneas + **flecha → a la derecha**. Variante primaria: **relleno naranja sólido** |
| **Botón primario** | Naranja sólido · radio 10 px · alto **52 px** · texto 14/700 · **icono a la derecha** |
| **Botón secundario** | Superficie elevada · borde 1 px · radio 10 px · **misma altura que el primario** |
| **Fila de lista lateral** | Alto **34 px** · radio 10 px · icono 16 px + label + **contador alineado a la derecha**. Seleccionada: **fondo violeta sólido**, texto blanco |
| **Barra de progreso** | Track superficie elevada · fill **violeta** · alto **8 px** · `radius-full` · **porcentaje a la derecha, fuera de la barra** |
| **Pestaña** | Icono + texto · activa: **texto naranja + subrayado de 3 px** a ras del borde inferior de la barra |
| **Botón de cabecera** | Círculo de 40 px · sin relleno · icono 20 px en texto secundario |

---

# 7. Ritmo y composición

## 7.1 La secuencia narrativa de la pantalla

**La referencia es una vista de detalle, y su orden es un argumento comercial:**

```
QUIÉN ES        → nombre, contacto, chips de estado
CUÁNTO VALE     → USD 800 - 1,500          ← el dinero, arriba
CUÁNTO PUNTÚA   → 87 · Excelente · 96%     ← a la derecha, dominante
POR QUÉ         → 4 razones verificadas
QUÉ HACER       → 3 acciones, una primaria
```

> **El valor económico aparece antes que el porqué.** Es una decisión de dirección de arte con consecuencia comercial: **primero se establece que hay dinero, después se justifica.**

## 7.2 El eje horizontal del hero

**El hero se lee en dos columnas de peso desigual:** ~70 % identidad y valor, ~30 % puntuación. **La columna derecha es más estrecha y sin embargo domina**, porque concentra el elemento de mayor tamaño de toda la pantalla.

## 7.3 Repetición como sistema

**Cuatro razones, tres acciones, dos botones de cierre.** Cada fila es un múltiplo consistente y todos sus elementos comparten altura exacta. **La regularidad es lo que se percibe como «acabado»** — un solo elemento de altura distinta rompería la sensación.

---

# 8. Micro-UX legible en la referencia

| Detalle | Lectura |
| --- | --- |
| **Punto verde pulsante** «Agente activo» | El sistema declara actividad continua |
| **Iconos `(i)`** junto a «OPPORTUNITY SCORE», «Confianza» y la cifra de valor | **Cada dato no obvio ofrece explicación.** Señal de producto maduro |
| **Icono de marcador** junto al nombre | Acción secundaria discreta, sin robar peso |
| **Contador «5 de 94»** con flechas circulares | Navegación entre resultados **sin volver al listado** |
| **«Ver más…»** al final de la lista de ciudades | La lista no miente sobre su longitud |
| **Tarjeta de Consejo con cierre (×)** | Ayuda contextual descartable, no modal |
| **«Actualizado hace 3 días»** | Frescura del dato declarada |

---

# 9. Lo que la referencia muestra y AKVEZ **no tiene**

> ### **Este es el conflicto central del sprint, y conviene verlo antes de escribir una línea.**

| # | Elemento de la referencia | ¿Existe en AKVEZ? | Gravedad |
| :-: | --- | :-: | :-: |
| **1** | ⭐ **«Valor potencial del proyecto · USD 800 - 1,500»** | 🔴 **No existe ningún dato monetario.** Ni campo, ni cálculo, ni prompt | 🔴 **Crítico** |
| **2** | **Portafolio con fotografías del negocio** | 🔴 No se piden fotos a Places | 🟠 Alto |
| **3** | **Logotipo/avatar del negocio** | 🔴 No se obtiene | 🟡 Medio |
| **4** | **Contadores por nicho y ciudad** (218, 94…) | 🔴 No existen | 🟠 Alto |
| **5** | **«Actualizado hace 3 días»** | 🔴 No hay marca de frescura del negocio | 🟡 Medio |
| **6** | **«5 de 94» + navegación anterior/siguiente** | 🔴 No hay paginación en el detalle | 🟠 Alto |
| **7** | **Marcador / guardar** | 🔴 No existe | 🟢 Opcional |
| **8** | **«Siguiente oportunidad»** | 🔴 No existe | 🟡 Medio |
| **9** | **Zona geográfica** («Bogotá Centro») | 🟡 Solo hay la ciudad de búsqueda | 🟡 Medio |

**Y a la inversa — lo que AKVEZ tiene y la referencia no muestra:** el desglose de las **seis categorías ponderadas**, los **factores no medibles**, el **motor del análisis**, la **versión del Perfil de Ponderación** y la **reconstrucción aritmética del Score**.

> ### **La resolución honesta, y también la más fuerte para el jurado:**
>
> **Se adopta el 100 % del ADN visual y el 0 % de los datos inventados.**
>
> **Los huecos se rellenan con lo que AKVEZ sí calcula**, que es más y mejor: donde la referencia pone un portafolio, AKVEZ pone **por qué puntúa lo que puntúa**; donde pone «USD 800-1,500», AKVEZ **no pone nada hasta que exista el dato**.
>
> **Un jurado que pregunte «¿de dónde sale ese rango de precio?» y reciba silencio hunde la demo.** La disciplina de integridad que este proyecto lleva seis sprints sosteniendo **es un activo, no un obstáculo** — y el punto 1 es exactamente donde se pondría a prueba.

---

# 10. Las diez reglas del ADN, para implementar

**Si H-07 solo respeta diez cosas, son estas.**

| # | Regla |
| :-: | --- |
| **1** | **Una sola cifra domina la pantalla**, a 7× el cuerpo. Nunca dos |
| **2** | **Naranja = marca y acción. Violeta = inteligencia. Verde = dinero y validación.** Sin excepciones |
| **3** | **La banda del Score es verde**, no naranja |
| **4** | **Tres capas de superficie, dos bordes de 1 px, cero sombras** |
| **5** | **Radios: 16 contenedor · 14 tarjeta · 12 interior · 10 control.** `full` solo en píldoras, barras y círculos |
| **6** | **Todo bloque vive dentro de una tarjeta.** Nada suelto sobre el fondo |
| **7** | **Una única acción primaria naranja por pantalla** |
| **8** | **Elementos de una misma fila: altura idéntica.** Sin excepción |
| **9** | **Iconos a 16 o 20 px**, lineales, en contenedor circular cuando encabezan un bloque |
| **10** | **Todo dato no obvio ofrece explicación** — el icono `(i)` es parte del lenguaje |

---

# 11. Referencias

**Fuente primaria:** referencia visual oficial «AKVEZ PRO» — vista Lead Detail.

**Concordancia normativa:** **APS-04 §10-11** — la paleta leída **coincide con los tokens documentados** (`#F97316`, `#8B5CF6`, `#22C55E`, `#0A0A0F`, `#121218`, `#22222C`, `#FAFAFA`, `#9CA3AF`). **APS-04 es correcto; lo que divergió fue el código.**

**Discrepancia registrada:** **APS-04 §13** asigna `radius-full` a botones primarios, secundarios y chips. **La referencia los muestra a 10 px.** Conforme al orden de autoridad de H-07, **prevalece la imagen**; se propone anotar la corrección en APS-04 §27.

**Documentos relacionados:** H-06B — Visual Alignment Audit *(hallazgo F-2 confirmado; recomendación de radios corregida)* · H-04 F1-F2 · H-05A · H-05B · H-06.
