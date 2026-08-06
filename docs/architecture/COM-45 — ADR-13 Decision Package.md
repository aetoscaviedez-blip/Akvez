# COM-45 — Paquete de Decisión sobre ADR-13

| Campo | Valor |
| --- | --- |
| Código | COM-45 / 1 |
| Clasificación | **Paquete de decisión** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Listo para pronunciamiento.** Nada aplicado, nada aprobado |
| Fecha | 2026-08-04 |
| Objeto | **ADR-13 v1.3** *(`Approved`, no aplicada)* frente a **v1.4** *(propuesta)* |
| Antecedentes | COM-36/1 · COM-42/A · **COM-43** · **COM-44/1** · **COM-44/2** · COM-44/3 |

> **`docs/blueprint/` intacto. Cero cambios de código. Ninguna enmienda aplicada, ningún documento aprobado.**
>
> **Este documento no crea propuestas nuevas.** Compara las dos existentes y prepara la decisión.

---

# 1. Punto de partida

| Instrumento | Estado | Aplicado |
| --- | :-: | :-: |
| **ADR-13 v1.3 — Consolidated Amendment** | ✅ **`Approved`** 2026-08-04 | ❌ **No** |
| **ADR-13 v1.4 — Consolidated Amendment Proposal** | 🟡 Propuesta *(COM-44/2)* | ❌ No |

> **Ninguna de las dos ha llegado al fichero del Blueprint.** `docs/blueprint/ADR/ADR-13` sigue en **v1.2**, publicando *«Asunto · mensaje · tono»* y *«la más reciente»*.

---

# 2. Tarea 1 — Comparación v1.3 / v1.4

## 2.1 Qué resuelve cada una

| **v1.3 resuelve** | **v1.4 añade** |
| --- | --- |
| **A-6** contradecía PO-02 §3 *(orden 2)* | **V-2** no debería fijar el nombre del campo |
| **V-2** no declaraba criterio de vigencia | **G-9** no reconoce que hay **dos patrones** de derivación |
| **§12.3** carecía de garantía de identidad para los activos no-Lead | **V-3** no declara su relación con V-2 |
| — | **A-5** omite lo que V-4 exige conservar *(condicionado)* |

## 2.2 Tabla comparativa

| Tema | v1.3 | v1.4 | Recomendación |
| --- | --- | --- | --- |
| **A-6 · contenido canónico** | ✅ Corrige la celda | ✅ **Idéntico** | ✅ **Aplicar. Es lo único exigido por autoridad** *(PO-02 §3 · ADS-00 R-1/R-2)* |
| **V-2 · criterio de vigencia** | ✅ Fija *«mayor número de emisión (`issue`)»* | 🔄 Enuncia **por concepto**; remite el nombre a DEV-00 §5.1 | 🟡 **Mejora real, pero el lugar del nombre es DEV-00.** Puede resolverse ahí sin tocar el ADR |
| **V-3 · marca temporal** | — | ➕ La declara ajena a la vigencia | 🟢 **Marginal.** La conflación se corrige en **ADS-02 §7 C-2**, que es donde se produjo |
| **G-8 · unicidad** | ✅ Creada | ✅ Idéntica | ✅ Aplicar |
| **G-9 · atomicidad** | ✅ Creada | 🔄 Añade nota de **dos patrones** | 🟡 **La nota es valiosa — y su sitio es ADS-02, no ADR-13.** §2.4 |
| **G-10 · conflicto determinista** | ✅ Creada | ✅ Idéntica | ✅ Aplicar |
| **A-5 · contenido** | — | ⚠️ Corrección **condicionada** | 🔴 **RETIRAR.** Sin autoridad, y arrastrarla como «condicionada» dentro de una enmienda es fuente de confusión |

## 2.3 ¿v1.4 reemplaza, complementa o sobra?

> ## **Reemplaza. No complementa.**

**No son acumulables:** ambas enmiendan las mismas tres secciones. **Se aplica una u otra**, y **COM-44/2 §1.1 lo declara: *«v1.4 no revoca v1.3: la absorbe»*.**

**Y sobre si introduce cambios innecesarios — revisión crítica de la propia propuesta:**

| Cambio de v1.4 | ¿Necesario para que v1.3 sea correcta? | Veredicto |
| --- | :-: | :-: |
| **B** — V-2 por concepto | ❌ No | 🟡 **Mejora. Redirigible a DEV-00** |
| **C** — nota de G-9 | ❌ No | 🟡 **Mejora. Redirigible a ADS-02 §7** |
| **D** — aclaración de V-3 | ❌ No | 🟢 **Marginal.** Se solapa con ADS-02 §7 C-2 |
| **E** — corrección de A-5 | ❌ **No, y sin autoridad** | 🔴 **Innecesario. Debe retirarse** |

> ### **Ninguno de los cuatro es necesario para que v1.3 sea correcta.** v1.3 corrige lo que declara corregir, y **COM-44/1 §1.5 estableció que no introduce inconsistencia**.

## 2.4 🔄 Hallazgo — dos de las tres mejoras van a otro documento

**Al comparar por materia, dos refinamientos de v1.4 resultan estar mal ubicados:**

| Refinamiento | Materia | Documento que le corresponde |
| --- | --- | --- |
| **Nombre del campo** *(`issue` / `emission`)* | **Convención técnica** | **DEV-00 §5.1** — ADS-00 asigna a DEV *«convenciones técnicas»* y *«convenciones de código»* |
| **Los dos patrones de derivación** | **Cómo el motor satisface la garantía** | **ADS-02 §7** — su columna es literalmente *«Cómo lo satisface PostgreSQL»*; **ADR-13 §12.3 declara la garantía, no su implementación** |

> ### **G-9 enuncia *qué* se garantiza. Que existan dos patrones de derivación es *cómo* se satisface — y eso es materia de ADS-02, no de ADR-13.**
>
> **Es la misma distinción que COM-44/3 §4.2 aplicó para separar ADS-02 §3 de §7.**

**Consecuencia:** **v1.4 pierde dos de sus tres justificaciones**, que quedan mejor atendidas en sus documentos propios y **sin bloquear la aplicación de v1.3**.

---

# 3. Tarea 2 — ¿Existe bloqueo real para aplicar v1.3?

| # | Pregunta | Clasificación | Fundamento |
| :-: | --- | :-: | --- |
| **1** | ¿Existe alguna **contradicción vigente** que impida aplicar v1.3? | 🟢 **NO BLOQUEANTE** | La única contradicción es **A-6 contra PO-02 §3**, y **v1.3 es precisamente su corrección** |
| **2** | ¿**A-5** impide aplicar v1.3? | 🟢 **NO BLOQUEANTE** | **ADR-13 §6.3** declara la completitud **del conjunto de Empresas**, no de la columna «Contenido». **Ninguna regla la declara exhaustiva** *(COM-44/1 §1)* |
| **3** | ¿**V-2** necesita obligatoriamente cambiarse antes? | 🟢 **NO BLOQUEANTE** | Su enunciado es *«mayor número de emisión»*; **`(issue)` es paréntesis, no la regla**. **A-5 cumple la semántica** *(COM-43 §5.2)* |
| **4** | ¿**G-9** necesita esperar a v1.4? | 🟢 **NO BLOQUEANTE** | G-9 en v1.3 **no es incorrecta**: es menos específica. Y la especificidad que falta **es materia de ADS-02 §7** *(§2.4)* |

## 3.1 Puntos que requieren autoridad — 🟡 **sin bloquear**

| # | Punto | Propietario | ¿Bloquea aplicar v1.3? |
| :-: | --- | --- | :-: |
| **AT-b** | ¿Es exhaustiva la columna «Contenido» de §6.2? | Architecture Team | ❌ **No** — solo condiciona el Cambio E, que se propone retirar |
| **AT-c** | Identidad lógica de A-4/A-5 a efectos de G-8 | Architecture Team | ❌ **No** — G-8 aplica en su enunciado general |
| **AT-e** | ¿Unificar `emission` → `issue`? | Architecture Team, vía **DEV-00 §5.1** | ❌ **No** |

## 3.2 Conclusión de la Tarea 2

> ## 🟢 **NO EXISTE BLOQUEO REAL PARA APLICAR ADR-13 v1.3.**
>
> **Los cuatro puntos examinados son no bloqueantes.** Los tres que requieren autoridad **pueden resolverse después, en sus documentos propios, sin revisar el ADR.**

---

# 4. Tarea 3 — Las dos opciones

## 4.1 Opción A — **Aplicar ADR-13 v1.3**

### Ventajas

| # | Ventaja |
| :-: | --- |
| **1** | **Ya está aprobada.** No requiere ningún acto de aprobación adicional |
| **2** | **Corrige hoy la única contradicción vigente** — A-6 contra PO-02 §3 |
| **3** | **Desbloquea inmediatamente cuatro actos**: ADS-02 §7, ADS-02 §3 *(F-2 Capa B)*, cierre de COM-19 §9 y sincronización del índice |
| **4** | **Detiene la acumulación.** Hoy hay dos instrumentos sobre el mismo documento y ninguno aplicado |
| **5** | **Las mejoras de v1.4 no se pierden**: se redirigen a DEV-00 §5.1 y ADS-02 §7, donde les corresponde *(§2.4)* |

### Riesgos

| # | Riesgo | Sev. | Mitigación |
| :-: | --- | :-: | --- |
| **1** | **`(issue)` en V-2 se lee como nombre obligatorio** y A-5 parece incumplir | 🟡 Media | **A-5 cumple la semántica** *(COM-43 §5.2)*. Se cierra en **DEV-00 §5.1** |
| **2** | **G-9 se implementa asumiendo un solo patrón** de derivación | 🟡 Media | Se cierra en **ADS-02 §7**, que es donde se describe el «cómo» |
| **3** | **A-5 queda con celda más corta que A-11** | 🟢 Baja | **No es defecto** mientras §6.2 no se declare exhaustiva *(AT-b)* |

### Pendientes que deja

**AT-b** *(exhaustividad de §6.2)* · **AT-c** *(identidad de A-4/A-5)* · **AT-e** *(nombre del campo)* · nota de patrones en **ADS-02 §7**.
**Ninguno bloquea nada.**

## 4.2 Opción B — **Aprobar v1.4 y aplicarla directamente**

### Ventajas

| # | Ventaja |
| :-: | --- |
| **1** | **Cierra el riesgo 1 de la Opción A dentro del propio ADR** |
| **2** | **G-9 nace reconociendo los dos patrones** |
| **3** | **V-3 queda explícitamente separada de V-2** |
| **4** | **Un solo acto** produce el texto definitivo |

### Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **Exige un acto de aprobación más**, y la cadena lleva **cuatro sprints esperando aplicación** | 🔴 **Alta** |
| **2** | **Sitúa en ADR-13 materia de otros documentos** — nombre de campo *(DEV-00)* y patrones de implementación *(ADS-02 §7)* — **contra la división de ADS-00** | 🟡 Media |
| **3** | **Arrastra el Cambio E condicionado**, sin autoridad, dentro de una enmienda | 🟡 Media |
| **4** | **Revisar una enmienda ya aprobada sienta precedente**: cada auditoría posterior podría producir una v1.5 | 🟡 Media |

### Pendientes que deja

**AT-b** *(condiciona el Cambio E)* · **AT-c**. Y **la aprobación misma**.

---

# 5. Recomendación técnica del Architecture Team

> ## 🟡 **PROPUESTA — no es decisión**

> ### **Opción A: aplicar ADR-13 v1.3, y redirigir las mejoras de v1.4 a sus documentos propios.**

## 5.1 Fundamento

| # | Razón | Autoridad |
| :-: | --- | --- |
| **1** | **No existe bloqueo real** *(§3)*. Los cuatro puntos son no bloqueantes | COM-44/1 · COM-43 |
| **2** | **v1.3 corrige la única contradicción vigente**, que es de orden 2 contra orden 4 | PO-02 §3 · ADS-00 R-1/R-2 |
| **3** | **Dos de las tres mejoras de v1.4 pertenecen a otros documentos** | ADS-00 *(alcance DEV)* · ADS-02 §7 |
| **4** | **El Cambio E carece de autoridad** y debe retirarse, no condicionarse | COM-44/1 §1.5 |
| **5** | **La acumulación es un riesgo en sí** — dos instrumentos, cero aplicaciones, cuatro sprints | COM-44/4 §7 riesgo 6 |

## 5.2 Qué se propone hacer con v1.4

> **No se descarta: se reparte.**

| Contenido de v1.4 | Destino propuesto |
| --- | --- |
| **A** — A-6 | ✅ **Ya está en v1.3** |
| **B** — nombre del campo | → **DEV-00 §5.1**, como convención |
| **C** — dos patrones de derivación | → **ADS-02 §7**, columna *«cómo lo satisface»* |
| **D** — V-3 ajena a la vigencia | → **ADS-02 §7 C-2**, que ya lo declara |
| **E** — A-5 | ❌ **Retirar.** Sin autoridad |

**Resultado:** **v1.4 queda sin contenido propio**, y **COM-44/2 pasa a registro de análisis** en lugar de instrumento pendiente.

## 5.3 ⚠️ Naturaleza de esta recomendación

> **Es una propuesta técnica, no una decisión.** El acto de aplicar la enmienda **no le corresponde a quien la redacta**.
>
> **Y conviene precisar a quién va dirigida**, porque el registro reparte la competencia:
>
> | Rol | Actor | Fundamento |
> | --- | --- | --- |
> | **Aplicar la enmienda al fichero** | **AKVEZ Architecture Team** | `Responsable` de ADR-13 |
> | **Aprobar** | **AKVEZ Product Office** | Aprobó ADR-13 v1.2 en **GOV-01** |
>
> **Si aplicar una enmienda ya aprobada exige nuevo pronunciamiento del Product Office, o basta el registro del Architecture Team, lo decide el procedimiento de gobernanza — no este documento.** Se señala porque **v1.3 ya cuenta con aprobación registrada**, de modo que el acto pendiente **parece** ser de aplicación, no de aprobación.

---

# 6. Tarea 4 — ADS-02

> **ADS-02 no se modifica. Solo se registra su dependencia.**

## 6.1 Cambios que necesita

**Cuatro, todos en §7 — detallados en COM-44/3 §2:**

| # | Cambio | Autoridad |
| :-: | --- | --- |
| **C-1** | Vigencia por número de emisión, no por marca temporal | ADR-13 §10.3 V-2 |
| **C-2** | **Fila propia para V-3** — hoy no existe | ADR-13 §10.3 V-3 |
| **C-3** | Garantías: **siete → diez** | ADR-13 §12.3 |
| **C-4** | Eventos: **siete → nueve (E-1 a E-9)** | **ADR-13 v1.2** §13.1 |

**Y uno en §3, de otro alcance:** requisitos de motor derivados de G-8/G-9/G-10 — **F-2 Capa B**, sprint distinto.

## 6.2 Dependencia con ADR-13

| Cambio | ¿Depende de v1.3/v1.4? |
| :-: | --- |
| **C-1** | ✅ **Sí** — cita V-2 enmendada |
| **C-2** | ❌ **No** — V-3 es vigente desde **v1.2** |
| **C-3** | ✅ **Sí** — cita G-8/G-9/G-10 |
| **C-4** | ❌ **No** — desfase de **v1.2**, abierto desde el 2026-07-30 |

> ### **C-2 y C-4 no dependen de ninguna de las dos enmiendas.** Podrían corregirse hoy.
>
> **No se recomienda separarlos:** partir la corrección de §7 en dos actos dejaría la sección **parcialmente sincronizada**, que COM-42/B riesgo 2 identifica como peor que no sincronizarla.

## 6.3 ¿Debe esperar a v1.3 o a v1.4?

> ## **A la que se aplique. Le es indiferente cuál.**

**Los textos que ADS-02 §7 necesita citar —V-2 con criterio de emisión, y G-8/G-9/G-10— están en ambas.** Las diferencias de v1.4 **no alcanzan a lo que §7 cita**:

| Diferencia de v1.4 | ¿Afecta al texto de ADS-02 §7? |
| --- | :-: |
| V-2 por concepto, sin nombre | ❌ **No** — **COM-44/3 C-1 ya evita fijar el nombre**, cualquiera que sea el enunciado del ADR |
| Nota de dos patrones en G-9 | ⚠️ **Solo si se aplica v1.4.** Si se aplica v1.3, **la nota va igualmente a §7** *(§5.2)* |
| V-3 explícita | ❌ No — **C-2 ya crea la fila** |
| Cambio E *(A-5)* | ❌ No — §7 no describe contenido de activos |

**Precondición única: que el fichero del Blueprint contenga la enmienda antes de que ADS-02 la cite.**

---

# 7. La decisión que se pide

> ### **Una sola: ¿Opción A u Opción B?**

| | **A — aplicar v1.3** | **B — aprobar y aplicar v1.4** |
| --- | :-: | :-: |
| Actos de aprobación necesarios | **0** | **1** |
| ¿Corrige la contradicción vigente? | ✅ | ✅ |
| ¿Deja materia en el documento equivocado? | ❌ No | ⚠️ Sí — §4.2 riesgo 2 |
| ¿Arrastra un cambio sin autoridad? | ❌ No | ⚠️ Sí — Cambio E |
| Desbloquea ADS-02 | ✅ **Inmediato** | Tras aprobación |
| **Recomendación técnica** | ✅ **Propuesta** | — |

---

# 8. Referencias

**ADS-00 v1.3** — *Orden de Precedencia*, R-1, R-2, R-3, R-7, *categoría DEV* · **PO-02 v1.3** §3 · **ADR-05 v1.4** §7 D3 · **ADR-12 v1.1** §12.1 · **ADR-13 v1.2** §6.2, §6.3, §10.3, §12.3, §13.1 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-14 v1.2** R-VIN · **ADR-16 v1.1** §4.2, §4.4 · **ADR-19 v1.0** §5.1 · **ADS-02 v1.1** §3, §7 · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **DEV-00** §5.1, R-34 · **COM-19** §9 · **COM-36/1** · **COM-42/A** · **COM-42/B** · **COM-43** §5.2, §5.3 · **COM-44/1** §1, §2, §3 · **COM-44/2** · **COM-44/3** · **COM-44/4** §7.
