# AR-05 — Informe de Cierre GOV-03

| Campo | Valor |
| --- | --- |
| Código | AR-05 |
| Clasificación | Assessment Report (AR) — Informe de cierre de bloque |
| Versión | 1.2 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **GOV-03 — Ratificación de DEV-02.1** *(actualizado en GOV-04)* |
| Autoridad de referencia | AR-03 v1.2 · AR-04 v1.0 · DP-02 · DP-03 · DP-04 |

> **Naturaleza.** Informe de cierre. Autoridad **consultiva** (ADS-00, orden 7). **No introduce ninguna decisión nueva**: registra las ratificadas y verifica la consistencia del catálogo.
>
> **Ningún fichero de código fue creado ni modificado. Ningún ADR, APS ni ADS fue alterado.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-07-30 | AKVEZ Product Office | **Sincronización del registro vivo de desviaciones y de los riesgos abiertos.** **§5.1** — **A-01, A-02 y T-14 pasan a `Closed`**, con su evidencia; **A-03 pasa a `Partially Resolved`**, con la mitad que el código resolvió y la que depende del motor. **§5** — las acciones 6 y 7 conservan su estado; se añade la acción **8**, la corrección de los tres imports que ADR-17 AL-19 retira. **§8** — **RC-1 y RC-7 se cierran**; **RC-2, RC-4, RC-5, RC-6, RC-8 y RC-9 se mantienen intactos**; se dan de alta **RC-10 y RC-11**. **§8.2** — nueva, con la actualización de estado de este sprint. **No se modifica ningún análisis, validación ni criterio de aceptación de GOV-03:** §1 a §4, §6, §7 y §9 permanecen literalmente intactos. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 9. **Es el bloque de gobernanza que la cadencia exigía**: DEV-05 §6 inventarió cinco sincronizaciones pendientes que ningún sprint de implementación podía ejecutar, y **PO-02 v1.3 §12.2 cerró A-01**. Este informe es el registro vivo *(§5.1)*, y su actualización es el acto que hace formales esos cierres. |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Registro del descenso normativo de las tres decisiones ratificadas.** Se cierra el riesgo **RC-3** y se registra la desviación **A-04** como **`Closed`**, al incorporarse la fila de `shared/observability` a **ADR-04 §11** (v1.3). Se actualiza el estado de ejecución de las acciones 1 a 5 de §5 y se añade la nota de actualización de §1.1. **Los ocho riesgos restantes de §8 se mantienen intactos**, y no se modifica ningún análisis, validación ni criterio de aceptación de GOV-03. | Sprint **GOV-04**, tarea 3. Las acciones derivadas que este informe dejó pendientes han sido ejecutadas en **DEV-02.2** *(acción 1)* y **GOV-04** *(acciones 2 a 5)*. |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Cierre del bloque de gobernanza GOV-03: ratificación de DP-02, DP-03 y DP-04, sincronización del INDEX y validación completa del catálogo. | Entregable 5 del sprint GOV-03. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Documentos Ratificados
3. Cambios de Estado
4. Alcance Real de una Ratificación DP
5. Acciones Derivadas Pendientes
6. Sincronización del INDEX
7. Validación
8. Riesgos Abiertos
9. Criterios de Aceptación
10. Referencias

---

# 1. Resumen Ejecutivo

**Los tres Decision Papers quedaron ratificados** sin que apareciese ninguna contradicción con documentos `Approved`. Las validaciones de compatibilidad exigidas por el sprint se ejecutaron documento a documento y constan en cada DP.

| Documento | Decisión ratificada |
| --- | --- |
| **DP-02** | Observabilidad única. **No se crea `shared/logging/`** |
| **DP-03** | **No se adopta `Result<T>` común.** Regla de propagación de errores sobre `shared/errors` |
| **DP-04** | **`strict: true`** es la configuración oficial de TypeScript de AKVEZ |

**El catálogo quedó sincronizado.** 57 documentos, cero sin catalogar, cero enlaces rotos, cero discrepancias de estado o versión.

## 1.1 La precisión que gobierna este cierre

> **Ratificar un DP fija la decisión; no la hace exigible.**

**DP tiene autoridad consultiva** (ADS-00, orden 5). Un DP `Approved` significa que la deliberación concluyó y la opción está elegida — **no** que exista una norma que obligue a nadie. La fuerza normativa nace del documento que formaliza la decisión: un ADR, DEV-00, o la configuración del proyecto.

**Consecuencia práctica, y es la más importante de este informe:**

- **`tsconfig.json` sigue sin `strict`.**
- **ADR-04 §11 sigue sin la fila de `shared/observability`**, y por tanto **A-04 sigue formalmente abierta**.

Ambas son consecuencia directa de las restricciones de GOV-03, que prohíben escribir código y alterar cualquier ADR. **No son omisiones**: son el trabajo derivado que el bloque siguiente debe ejecutar (§5).

> ## ✅ Actualización — sprints DEV-02.2 y GOV-04
>
> **Las dos consecuencias descritas arriba quedaron resueltas.** Se conserva su redacción original porque describe con exactitud el estado **al cierre de GOV-03**, que es lo que este informe certifica.
>
> | Consecuencia | Resuelta en | Cómo |
> | --- | --- | --- |
> | `tsconfig.json` sin `strict` | **DEV-02.2** | `"strict": true` activo. **0 errores**, build exit 0, artefactos de hash idéntico |
> | ADR-04 §11 sin la fila · **A-04 abierta** | **GOV-04** | **ADR-04 v1.3** incorpora `shared/observability` con su regla de acceso. **A-04 → `Closed`** *(§5.1)* · **RC-3 → cerrado** *(§8)* |
>
> **La tesis de §1.1 no cambia, se confirma:** ratificar un DP no lo hace exigible. Hicieron falta **dos sprints posteriores** —uno de configuración y uno documental— para que las tres decisiones adquiriesen fuerza normativa. Ese intervalo es precisamente el riesgo **RC-2**, que **sigue abierto** como advertencia permanente.

---

# 2. Documentos Ratificados

## 2.1 DP-04 — Política de Strict Mode *(prioridad máxima)*

| Campo | Detalle |
| --- | --- |
| **Decisión** | Activar `strict: true`. Sin adopción gradual |
| **Evidencia decisiva** | `strict` completo → **0 errores**, exit 0, verificado en dos ejecuciones independientes. `strictNullChecks` en solitario → **4 errores**: el camino gradual atraviesa un estado peor que el destino |
| **Validaciones exigidas** | **DEV-00** ✅ refuerza R-38 · **WP-01** (APS-08 §7.1) ✅ protege *Potencial de Mejora*, 25 % · **ADR-12 §7.3** ✅ la Huella subsidiaria es opcionalidad real · **ADR-13 §7.1 (X-3)** ✅ prohíbe rellenar ausencias con prosa |
| **Contradicciones** | **Ninguna.** En los cuatro casos `strict` refuerza una decisión ya aprobada |
| **Cierra** | Vacío **V-3** de DEV-00 §11 |

## 2.2 DP-02 — Logging y Observabilidad

| Campo | Detalle |
| --- | --- |
| **Decisión** | Alternativa B: un único `shared/observability/` con el logging como una de sus cinco salidas. Reglas **O-1 a O-6** aprobadas |
| **Fundamento** | **APS-16 §14** enumera «logs, métricas, eventos, errores, tiempos de respuesta» como productos de **una sola** obligación. Crear `logging/` habría partido en dos lo que el Blueprint declara uno |
| **Validaciones** | APS-16 §14 ✅ · APS-11 §4.5 ✅ · APS-10 ✅ (O-3) · APS-04 §A.9 UI-9 ✅ (O-6) · ADR-04 §11 ✅ · ADR-05 §6 P3 y DEV-00 R-04 ✅ (O-4) |
| **Contradicciones** | **Ninguna** |
| **Replantea** | Entregable **B4** de DEV-02, que deja de ser «sistema de logging» y pasa a ser «contrato de sink dentro de observabilidad» |

## 2.3 DP-03 — Contrato de Resultado de Application

| Campo | Detalle |
| --- | --- |
| **Decisión** | Alternativa C: contratos propios por módulo, más una regla de propagación de errores. **Sin `Result<T>` común** |
| **Fundamento** | **ADR-07 §8** ya decide que `application/` devuelve «un resultado interno propio del módulo». El problema real era la inconsistencia de convención de fallo, no la forma del tipo |
| **Validaciones exigidas** | **ADR-08 §10** ✅ ningún tipo compartido nuevo cruza la frontera · **ADR-09 §5.2** ✅ las factories y el closure no se alteran · **APS-03 §12** ✅ y reforzado: preserva «continuar procesando el resto de empresas» |
| **Contradicciones** | **Ninguna** |
| **Desestima** | Entregable **B5** de DEV-02, tal como fue enunciado |
| **Ventaja de gobernanza** | **Ningún ADR requiere modificación** |

---

# 3. Cambios de Estado

| Documento | Antes | Después | Versión |
| --- | --- | --- | --- |
| **DP-02** | `Draft` | ✅ **`Approved`** | 1.0 → **1.1** |
| **DP-03** | `Draft` | ✅ **`Approved`** | 1.0 → **1.1** |
| **DP-04** | `Draft` | ✅ **`Approved`** | 1.0 → **1.1** |
| **AR-05** | — | ✅ **`Approved`** | **1.0** *(nuevo)* |
| **INDEX.md** | Desincronizado | ✅ Sincronizado | — |

**En cada DP se registró:** fila nueva en el Historial de Versiones con fecha, motivo y autoridad, y una subsección de ratificación con la tabla de validaciones ejecutadas.

**No se modificó contenido técnico en ninguno de los tres:** ni análisis, ni alternativas, ni reglas propuestas, ni riesgos.

---

# 4. Alcance Real de una Ratificación DP

Esta sección existe para que nadie atribuya a un DP `Approved` una fuerza que la jerarquía no le concede.

| Categoría | Orden | Autoridad |
| --- | :-: | --- |
| **APS** | 3 | Vinculante sobre arquitectura e implementación |
| **ADR** | 4 | Vinculante sobre la implementación |
| **DP** | **5** | **Consultiva** |
| **DEV** | 8 | Vinculante sobre la implementación, subordinada a todas las anteriores |

**Un DP `Approved` acredita que la decisión está tomada.** Para que obligue, debe descender a un documento vinculante:

| Decisión | Documento que le dará fuerza |
| --- | --- |
| `strict: true` | **`tsconfig.json`** + **DEV-00 §6** (`DoD-2`) |
| Observabilidad única | **ADR-04 §11** (fila nueva) + **DEV-00 §3** (reglas O-1 a O-6) |
| Regla de propagación de errores | **DEV-00 §3** |

> **Ninguno de esos descensos podía ejecutarse en GOV-03**, cuyas restricciones prohíben escribir código, modificar DEV y alterar cualquier ADR salvo su estado e historial.

---

# 5. Acciones Derivadas Pendientes

**Ordenadas por urgencia.** Ninguna es una decisión: las tres decisiones ya están tomadas.

| # | Acción | Documento | Urgencia | Estado |
| --- | --- | --- | --- | :-: |
| **1** | **Activar `"strict": true`** | `tsconfig.json` | **Alta — la ventana se cierra.** Hoy cuesta 0 errores. Cada fichero que escriban DEV-01 o DEV-03 antes de activarlo deja de ser gratuito | ✅ **Ejecutada — DEV-02.2.** 0 errores |
| **2** | Actualizar `DoD-2` para que signifique «con `strict`» | DEV-00 §6 | Media | ✅ **Ejecutada — GOV-04.** DEV-00 v1.2 §6.1 |
| **3** | **Añadir la fila de `shared/observability`** con su regla de acceso | **ADR-04 §11** → v1.3. Cambio **Menor** (APS-13 §9), aditivo | Media — **A-04 permanece abierta hasta entonces** | ✅ **Ejecutada — GOV-04.** ADR-04 **v1.3**. **Cierra A-04** |
| **4** | Incorporar las reglas **O-1 a O-6** | DEV-00 §3 | Media | ✅ **Ejecutada — GOV-04.** DEV-00 v1.2 **§3.11** |
| **5** | Incorporar la regla de propagación de errores | DEV-00 §3 | Media | ✅ **Ejecutada — GOV-04.** DEV-00 v1.2 **§3.12**, R-61 a R-64 |
| **6** | Implementar el contrato de sink y el sink por consola | Código | Baja — replantea B4 | 🔴 **Pendiente.** Requiere decidir taxonomía de severidad y forma del evento |
| **7** | Alinear la propagación de fallo de `lead-hunter` | Código | Baja | 🔴 **Pendiente.** Ahora exigible por **R-61** |
| **8** | **Retirar de `application/` los tres imports de `infrastructure/`** y sustituirlos por puertos | Código | **Alta — la ventana se cierra.** Hoy son tres puntos; cada caso de uso comercial que se escriba antes añade uno | 🔴 **Pendiente.** Exigible desde **ADR-17 AL-19** y **DEV-00 R-05**. Debe ejecutarse **con** la normalización del módulo comercial de ADR-15 §9.5, no después |

> **La acción 1 es de una línea y no toca ningún fichero de código.** Debería ser el primer sprint posterior a este cierre.

> **Cinco de las siete acciones están ejecutadas.** Las tres decisiones ratificadas en GOV-03 **han descendido ya a documentos vinculantes**: `tsconfig.json`, ADR-04 §11 y DEV-00 §3 y §6. Las dos pendientes son **de código y de urgencia baja**, y ninguna bloquea el inicio de DEV-03.
>
> **La acción 6 requiere una decisión que ningún documento aprobado contiene** —la taxonomía de severidad y la forma del registro que atraviesa el sink—. Registrado en DEV-02.2 §3.1.3 y §10, punto 3.

## 5.1 Desviaciones que siguen bloqueadas por decisión

**No forman parte de GOV-03** y siguen tal como las dejó DEV-01B:

> **Actualizado el 2026-07-30** — Sprint *Gobernanza Final (Architecture Freeze)*. **Ésta es la tabla vigente.**

| # | Desviación | Quién decide | Estado | Cerrada en |
| --- | --- | --- | :-: | --- |
| **A-01** | ~~`LeadStatus` incluye `'Prospect'`, `'Stale'`, `'Won'`, `'Replied'`, contra PO-01 §8 y ADR-11 §9 E-5~~ | Product Office | ✅ **`Closed`** | **PO-02 v1.3 §5.1** — cuatro estados oficiales y reglas LS-1 a LS-5 |
| **A-02** | ~~`application/` importa un Persistence Contract~~ | Architecture Team | ✅ **`Closed`** | **DEV-05 §1.1** — el Registro vuelve al Lead Hunter; el import desaparece por sí solo |
| **A-03** | `LeadRepository` no expresa la identidad `(Referencia de Origen, Usuario)` ni la Unidad de Registro atómica | Architecture Team | 🟡 **`Partially Resolved`** | **DEV-05 §1.2 y §3.1** — resuelta la mitad de código; **la garantía del motor, no** |
| **A-04** | ~~`shared/observability/` existe sin estar declarada en ADR-04 §11~~ | Architecture Team | ✅ **`Closed`** | ADR-04 v1.3 §11 *(GOV-04)* |
| **T-14** | ~~Puerto fijado en código; `process.env.PORT` ignorado~~ | — | ✅ **`Closed`** | **DEV-05 §1.3** — `shared/config/env.ts`, `getPort()` |

> ## ✅ A-01 — `Closed` (Sprint *Gobernanza Final*, paso 1)
>
> **PO-02 v1.3 §5.1 fija los cuatro estados oficiales** —`Lead · Analyzed · Scored · Contacted`— y retira los seis anteriores con el motivo de cada uno.
>
> **Solo el Product Office podía cerrarla, y ésta es la razón:** `Stale` afecta a la **materia cerrada E-5 de ADR-11 §9**, que **ningún ADR ni documento DEV puede reabrir**. PO-02 es orden 2 y tiene ese rango.
>
> ⚠️ **La desviación documental está cerrada; la deuda de código, no.** `LeadStatus` sigue declarando los seis valores derogados. **El cierre de A-01 es precisamente lo que hace exigible su corrección**, que corresponde al primer sprint de implementación. *(PO-02 §12.2)*

> ## ✅ A-02 y T-14 — `Closed` (Sprint *Gobernanza Final*, paso 9)
>
> **Ambas estaban corregidas en el código desde DEV-05 y solo esperaban su registro formal.** DEV-05 §3 lo declaró expresamente: *«A-02 y T-14 están corregidas en el código, no `Closed` documentalmente […] un sprint de implementación no cambia el estado formal de una desviación»*. **Este sprint de gobernanza es el acto que faltaba.**
>
> | Desviación | Evidencia |
> | --- | --- |
> | **A-02** | El barrido de **DEV-05 §2.1** sobre 91 ficheros y 141 aristas arroja **cero violaciones de frontera**. Era la única que quedaba desde DEV-01A §5 |
> | **T-14** | **DEV-05 §2.2**: el servidor escucha en el `PORT` del entorno (4319), no en 3000. La lectura vive en `shared/config/env.ts`, única frontera con `process.env` |

> ## 🟡 A-03 — `Partially Resolved` (Sprint *Gobernanza Final*, paso 9)
>
> **No se cierra, y el motivo es sustantivo.**
>
> | Mitad | Estado |
> | --- | :-: |
> | **La identidad se expresa en el repositorio** — `register`, `findByIdentity`, y `identityKey`/`identitySource`/`identityDesignation` en el Persistence Contract | ✅ **Resuelta** — DEV-05 §1.2 |
> | **La unicidad la garantiza el motor y el Registro es atómico** — **R-30 y R-31** | 🔴 **No resuelta.** `inMemoryLeadAdapter` lo resuelve con un `Map` en un solo proceso: **funciona, pero no es la garantía que ADS-02 §5 (RQ-2) y la verificación heredada VH-3 exigen** |
>
> **Su cierre llega con el motor real** *(ADS-02)*, y corresponde al Architecture Team. **Es la única desviación que sigue abierta.**

**Queda una desviación sin cerrar: A-03, parcialmente resuelta.**

> ## ✅ A-04 — `Closed` (sprint GOV-04)
>
> **Resuelta.** **ADR-04 v1.3** incorpora `shared/observability` a la tabla de servicios compartidos de §11, con su contenido y su regla de acceso, y declara expresamente que **`shared/logging/` no se crea**. Las reglas **O-1 a O-6** constan en **DEV-00 §3.11**, citando ADR-04 §11 como fuente vinculante.
>
> **La desviación consistía exactamente en que la carpeta existía sin estar declarada.** Declarada la carpeta, deja de ser desviación. **No hizo falta ningún cambio de código**: el código ya cumplía la regla de acceso aprobada — verificado en DEV-02.2 §5.4, con **cero importadores desde `domain/`**.
>
> ~~**Quedan cuatro desviaciones abiertas: A-01, A-02, A-03 y T-14.**~~ — **Superado el 2026-07-30.** Véase la tabla vigente arriba: **queda A-03**.

**AF-01 y AF-02** siguen en `Draft` por la excepción constitucional ratificada en GOV-01 (AR-04 §5).

---

# 6. Sincronización del INDEX

Ejecutada por corresponder: **cierre de bloque de gobernanza**.

| Cambio | Detalle |
| --- | --- |
| **Recuentos** | 50 → **57** documentos · vigentes 44 → **51** · `Approved` 40 → **44** · `Draft` 4 → **7** |
| **§3 — Estructura de carpetas** | `DP/` 1 → 4 · `AR/` 4 → 5 · `DEV/` 1 → 4 |
| **§4.6 — DEV** | Altas de **DEV-01**, **DEV-01A** y **DEV-01B**, con nota de que son registros de ejecución y **no contienen reglas** |
| **§4.7 — DP** *(nueva sección)* | DP pasa a tener sección propia, con los cuatro documentos y la nota sobre su autoridad consultiva |
| **§4.8** | Antes §4.7. Pasa a titularse «PLAN · REV · AR · ATA»; `DP-01` se traslada a §4.7 |
| **Alta de AR-05** | En §4.8 |

**Motivo de la sección DP propia:** hasta ahora DP compartía sección con PLAN, REV, AR y ATA porque solo existía `DP-01`, archivado. Con tres DP vigentes y `Approved`, agruparlos con documentos archivados dificultaba localizarlos y ocultaba su naturaleza consultiva.

---

# 7. Validación

## 7.1 Resultados

| Comprobación | Resultado |
| --- | --- |
| **Enlaces relativos** en todo `docs/blueprint/` | ✅ **61 verificados · 0 rotos** |
| **Filas del INDEX contrastadas fichero a fichero** | ✅ **57 · 0 discrepancias** de estado o versión |
| **Documentos sin catalogar** | ✅ **0** |
| **Recuento declarado frente al real** | ✅ Coincide exactamente: **44 `Approved` · 7 `Draft` · 0 `Review` · 6 `Archived` = 57** |
| **Numeración de secciones** | ✅ §4.1 a §4.9 sin colisiones |
| **Referencias cruzadas** | ✅ Ajustadas a la renumeración |
| **Estados inválidos** | ✅ **0** — todos pertenecen al catálogo de ADS-00 |
| **Código modificado** | ✅ **Ninguno** |
| **ADR, APS o ADS alterados** | ✅ **Ninguno** |

## 7.2 Inconsistencias encontradas y corregidas — 2

Ambas detectadas por la validación automática, no por lectura:

| # | Inconsistencia | Corrección |
| --- | --- | --- |
| **1** | **Colisión de numeración**: al crear la sección propia de DP, quedaron **dos secciones §4.8** — «PLAN · REV · AR · ATA» y «Otros» | «Otros» pasa a **§4.9** |
| **2** | **El verificador no distinguía los sufijos de letra** en los códigos DEV: buscaba `DEV-01` y daba por verificados `DEV-01A` y `DEV-01B` sin contrastarlos. Contrastaba 55 filas de 57 y lo reportaba como completo — **un falso positivo del propio control** | Corregido el patrón a `DEV-\d+[A-Z]?`. La comprobación cubre ahora las **57** filas |

> **La segunda es la más relevante de las dos**, porque afectaba a la fiabilidad de la validación, no al catálogo. Un control que informa «todo correcto» sin haber mirado dos documentos es peor que no tenerlo.

## 7.3 Método

El contraste no fue manual: se extrajo estado y versión de la portada de cada uno de los 57 documentos y se comparó contra su fila del INDEX, y se resolvió cada enlace relativo contra el sistema de ficheros. Tras corregir las dos inconsistencias, la validación se ejecutó de nuevo por completo.

---

# 8. Riesgos Abiertos

| # | Riesgo | Severidad | Origen |
| --- | --- | --- | --- |
| **RC-1** | **`strict` se ratifica pero no se activa**, y deja de ser gratuito al escribirse el esqueleto | **Alta** | §5, acción 1 · DP-04 R-1 |
| **RC-2** | **Un DP `Approved` se cita como norma vinculante** sin haber descendido a un documento de orden superior | **Alta** | §4. Es el riesgo de gobernanza propio de este cierre |
| **RC-3** | ~~**A-04 se considera cerrada** porque DP-02 está ratificado, cuando ADR-04 §11 sigue sin la fila~~ | ✅ **CERRADO** | **Sprint GOV-04.** Resuelto en su raíz: **ADR-04 v1.3 tiene la fila**, y A-04 está **`Closed`** (§5.1). El riesgo consistía en dar por cerrado lo que no lo estaba; hoy lo está de verdad |
| **RC-4** | **Se crea `shared/logging/` por costumbre** al no encontrar carpeta con ese nombre | Media | DP-02 R-1 |
| **RC-5** | **La regla de propagación de errores no se cumple**, al no verificarla el compilador | **Alta** | DP-03 R-1 · RI-1 de DEV-00 |
| **RC-6** | **Un fallo parcial aborta el conjunto de Empresas**, contra APS-03 §12 y PO-01 §8 | **Alta** | DP-03 R-4 |
| **RC-7** | **Las desviaciones A-01, A-02 y A-03 siguen abiertas** y DEV-03 avanza sobre ellas | **Alta** | §5.1 |
| **RC-8** | **Nivel constitucional sin ratificar** — AF-01 y AF-02 en `Draft` | Media | AR-04 §5 |
| **RC-9** | **Sin verificación automática de fronteras** (V-4) ni runner de pruebas (V-1) | **Alta** | DEV-00 §11 |

> **RC-1 y RC-2 son los dos riesgos propios de este cierre.** Los demás se heredan y ya constaban.

## 8.1 Actualización de estado — sprint GOV-04

**Solo RC-3 se cierra en esta revisión.** Los ocho riesgos restantes **se mantienen intactos**, conforme al alcance autorizado de GOV-04.

| Riesgo | Estado | Nota |
| --- | :-: | --- |
| **RC-3** | ✅ **Cerrado** | ADR-04 v1.3 · A-04 `Closed` |
| RC-1, RC-2, RC-4 a RC-9 | 🔴 **Sin cambios** | Redacción y severidad intactas |

> **Observación sobre RC-1, no ejecutada.** RC-1 —«`strict` se ratifica pero no se activa»— **está materialmente resuelto**: DEV-02.2 activó `strict` con cero errores y lo registró como cerrado en su §9.1. **No se ha modificado aquí** porque la tarea 3 de GOV-04 autorizaba cerrar **únicamente RC-3** y ordenaba mantener intactos los demás. **Se registra para pronunciamiento del Product Office**, no se decide.
>
> **RC-2 debe permanecer abierto por diseño.** No es un riesgo de una desviación concreta, sino la advertencia permanente de que un DP `Approved` no es norma exigible. Cerrarlo sería perder la lección de este bloque.

## 8.2 Actualización de estado — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30

| Riesgo | Estado | Nota |
| --- | :-: | --- |
| **RC-1** | ✅ **Cerrado** | **Pronunciamiento ejecutado.** `strict: true` está activo con **0 errores** desde DEV-02.2 y verificado de nuevo en **DEV-05 §2**. §8.1 lo dejó registrado «para pronunciamiento del Product Office»; **éste es el bloque de gobernanza que podía darlo** |
| **RC-7** | ✅ **Cerrado** | El riesgo era *«A-01, A-02 y A-03 siguen abiertas y DEV-03 avanza sobre ellas»*. **A-01 y A-02 están `Closed`** y **A-03 es hoy `Partially Resolved`**, con la mitad pendiente acotada al motor real. **Se sustituye por RC-10**, que enuncia con precisión lo que queda |
| **RC-3** | ✅ Cerrado *(GOV-04)* | Sin cambio |
| **RC-2, RC-4, RC-5, RC-6, RC-8, RC-9** | 🔴 **Sin cambios** | Redacción y severidad intactas |

**Dos riesgos nuevos, ambos derivados de este sprint:**

| # | Riesgo | Severidad | Origen |
| --- | --- | :-: | --- |
| **RC-10** | **A-03 se da por cerrada porque el repositorio ya expresa la identidad**, cuando **R-30 y R-31 siguen sin cumplirse**: la unicidad la garantiza el código, no el motor. Con un motor real y varios procesos, dos registros concurrentes de la misma identidad podrían duplicar un Lead | **Alta** | §5.1 · DEV-05 §3.1 y RD-3 · **VH-3** |
| **RC-11** | **La Opción B se ratifica y no se ejecuta**, y el primer caso de uso comercial se escribe con el patrón antiguo. **Hoy son tres imports; cada caso de uso nuevo añade uno** | **Alta** | §5, acción 8 · **ADR-17 RA17-1** · ADR-15 §9.5 |

> **RC-2 sigue abierto, y este sprint refuerza su vigencia en lugar de debilitarla.** **PO-02 v1.3 §12.4 registró el hallazgo H-24**: cinco documentos —PO-01 v1.2, APS-07 v2.1, APS-03 v3.1, ADS-01 v1.2 y v1.3, ADR-13 v1.2— se emitieron **citando a PO-02 como autoridad mientras PO-02 estaba en `Draft`**, contra el punto 10 de su propio §10. **Es RC-2 materializado.** La ratificación de hoy sanea el resultado, no el procedimiento.
>
> **RC-9 tampoco se cierra, y conviene decir por qué no puede cerrarse hoy.** Los vacíos **V-1** *(sin runner de pruebas)* y **V-4** *(sin verificación automática de fronteras)* siguen abiertos, y **DEV-00 pasó de 80 a 85 reglas** en este sprint. **Más reglas sin verificación automática es más superficie para RI-1**, no menos.

---

# 9. Criterios de Aceptación

| Criterio | Resultado |
| --- | --- |
| DP-02 `Approved` | ✅ v1.1 |
| DP-03 `Approved` | ✅ v1.1 |
| DP-04 `Approved` | ✅ v1.1 |
| INDEX sincronizado | ✅ 57 documentos |
| AR-05 emitido | ✅ Este documento |
| Cero enlaces rotos | ✅ 57 verificados |
| Cero discrepancias de estado | ✅ 57 filas contrastadas |
| Ningún documento sin catalogar | ✅ 0 |
| Ninguna modificación funcional | ✅ Cero ficheros de código |
| Ningún cambio arquitectónico | ✅ Ningún ADR, APS ni ADS alterado |

**Los diez criterios se cumplen.**

> **Salvedad expresa, no incumplimiento:** ninguna de las tres decisiones ratificadas ha descendido todavía a un documento vinculante (§4, §5). Era **imposible** dentro de las restricciones de GOV-03 y constituye el trabajo del bloque siguiente.

> ## ✅ Salvedad levantada — sprints DEV-02.2 y GOV-04
>
> **Las tres decisiones han descendido ya a documentos vinculantes**, y la salvedad queda sin efecto:
>
> | Decisión | Documento que le da fuerza | Sprint |
> | --- | --- | --- |
> | `strict: true` | **`tsconfig.json`** + **DEV-00 §6.1** (`DoD-2`) | DEV-02.2 · GOV-04 |
> | Observabilidad única | **ADR-04 §11** (v1.3) + **DEV-00 §3.11** (O-1 a O-6) | GOV-04 |
> | Regla de propagación de errores | **DEV-00 §3.12** (R-61 a R-64) | GOV-04 |
>
> **El bloque de gobernanza abierto en GOV-03 queda materialmente completo.** Restan dos acciones de código de urgencia baja (§5, acciones 6 y 7), ninguna bloqueante para DEV-03.

---

# 10. Referencias

- **PO-01 v1.2** §8 · **PO-02 v1.3** §5.1, §12.2 *(cierre de A-01)* · **APS-02 v2.1** §9 · **APS-03 v3.1** §12 · **APS-04 v4.0** §A.9 (UI-9) · **APS-08 v1.2** §6.5, §7.1 · **APS-10** · **APS-11 v1.0** §4.5 · **APS-13 v1.0** §9 · **APS-16 v1.0** §14.
- **ADR-04 v1.3** §11 *(fila de `shared/observability`; **cierra A-04**)* · **ADR-05 v1.4** §6 P3 · **ADR-07 v1.1** §8 · **ADR-08 v1.2** §10 · **ADR-09 v1.3** §5.2, §8.1 · **ADR-11 v2.1** §9 · **ADR-12 v1.1** §7.3 · **ADR-13 v1.2** §7.1 (X-3), §11.2 (A-2), §13.1.
- **ADR-15 v1.2** · **ADR-16 v1.1** · **ADR-17 v1.1** §12, §14 *(AL-19, AL-20 — origen de la acción 8 y del riesgo RC-11)* · **ARCH-01 v1.3**.
- **ADS-00 v1.3** — Clasificación Oficial, Jerarquía Documental, regla R-7, Estados del Documento.
- **ADS-01 v1.4** · **ADS-02 v1.1** §5 (RQ-2), §10 *(origen de RC-10)*.
- **DP-02 v1.1** · **DP-03 v1.1** · **DP-04 v1.1** — documentos ratificados.
- **DEV-00 v1.4** §3.11 (O-1 a O-6), §3.12 (R-61 a R-64), §3.13 (R-65 a R-69), §6.1 (`DoD-2` con `strict`), §9 (RI-1), §11 (V-1, V-2, V-4, V-8).
- **DEV-01 v1.0** · **DEV-01A v1.0** · **DEV-01B v1.0** · **DEV-02.2 v1.0** *(activación de `strict`)* · **DEV-03 v1.0** · **DEV-04 v1.0** · **DEV-05 v1.0** §1, §2, §3, §6 *(evidencia del cierre de A-02 y T-14; §6 inventarió esta sincronización)*.
- **AR-02** §4.2 · **AR-03 v1.2** §7 · **AR-04 v1.0** §5, §10.1.
- **INDEX.md** — catálogo sincronizado el 2026-07-30: **69 documentos**.

> **Las versiones citadas son las vigentes al 2026-07-30.** Las que aparecen en §1 a §7 corresponden al estado **al cierre de GOV-03**, que es lo que este informe certifica, y **no deben actualizarse**: alterarlas falsearía el registro histórico. Las actualizaciones posteriores constan en §5.1, §8.1 y §8.2.
