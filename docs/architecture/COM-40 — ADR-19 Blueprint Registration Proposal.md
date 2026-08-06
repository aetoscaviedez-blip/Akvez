# COM-40 — Propuesta de Registro de ADR-19 en el Blueprint

| Campo | Valor |
| --- | --- |
| Código | COM-40 / 3 |
| Clasificación | **Propuesta de registro documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **BLOQUEADA — conflicto de numeración detectado.** Blueprint **no modificado** |
| Fecha | 2026-08-04 |
| Objeto | `docs/architecture/ADR-19 — Agent API Factory Construction Pattern.md` v1.0 `Approved` |
| Antecedentes | **COM-39** §7.1 actos 2 y 6 · §7.2 |

> **`docs/blueprint/` no ha sido modificado. `docs/blueprint/INDEX.md` no ha sido tocado. Cero cambios de código.**

---

# 1. 🔴 Conflicto detectado — se detiene la ejecución

**Conforme a la restricción del sprint —*«Si existe una contradicción documental: 1. localizar autoridad; 2. documentar conflicto; 3. detener ejecución»*—, este documento localiza, documenta y se detiene.**

## 1.1 El conflicto

> ### **El número `19` no está confirmado como libre, y el precedente en que se apoya es él mismo provisional y no catalogado.**

**Hechos verificados:**

| # | Hecho | Verificación |
| :-: | --- | --- |
| **1** | **El último ADR catalogado en `docs/blueprint/INDEX.md` es ADR-17** | Tabla de ADR, §del catálogo |
| **2** | **`ADR-18 — Perfil de Estrategia.md` existe como fichero** en `docs/blueprint/ADR/` | Sistema de ficheros |
| **3** | **ADR-18 NO aparece en `INDEX.md`** | Búsqueda exhaustiva: sin resultados |
| **4** | **ADR-18 está en `Draft`**, v0.1 | Cabecera del documento |
| **5** | **El propio ADR-18 declara su número como provisional** | Cabecera, literal |

**Texto literal de la cabecera de ADR-18:**

> *«Código: **ADR-18** *(**provisional** — la asignación definitiva **corresponde al Product Office**)*»*
>
> *«Estado: 🟡 **Draft** — propuesta. No prevalece sobre ningún documento `Approved` *(ADS-00 R-4)*»*

## 1.2 Por qué esto bloquea el registro de ADR-19

**ADR-19 se numeró como *«el siguiente libre tras ADR-18»*.** Esa premisa se apoya en que ADR-18 ocupa el 18 — **y ADR-18 no lo ocupa aún**:

| Perspectiva | Siguiente número libre |
| --- | :-: |
| **Sistema de ficheros** *(ADR-18 existe)* | **19** |
| **Catálogo del Blueprint** *(último catalogado: ADR-17)* | **18** |

> ### **Desde el catálogo —que es el registro con autoridad— el siguiente número libre es 18, no 19.**
>
> **Y quien lo decide está declarado:** *«la asignación definitiva **corresponde al Product Office**»* *(ADR-18, cabecera)*.

## 1.3 Escenarios posibles — ninguno se resuelve aquí

| # | Escenario | Consecuencia para ADR-19 |
| :-: | --- | --- |
| **A** | El Product Office **confirma ADR-18** como definitivo y lo cataloga | **ADR-19 es correcto.** Registro directo |
| **B** | El Product Office **asigna otro número a ADR-18** al catalogarlo | **ADR-19 podría colisionar** o quedar con hueco |
| **C** | ADR-18 **permanece `Draft` sin catalogar indefinidamente** | ADR-19 se cataloga como **primer ADR con número 19 y sin 18 en el índice** — **hueco visible en el catálogo** |

> **El escenario C es el más probable si no se decide nada**, y produce un catálogo con un salto injustificado.

---

# 2. Autoridad localizada

| Materia | Autoridad | Fundamento |
| --- | --- | --- |
| **Asignación definitiva del número de ADR-18** | **AKVEZ Product Office** | **Declaración expresa de ADR-18**, cabecera |
| **Sincronización de `docs/blueprint/INDEX.md`** | **AKVEZ Product Office** | Última actualización del índice: 2026-07-30, *«Sprint Gobernanza Final»*. **El índice se sincroniza al cerrar bloque de gobernanza** |
| **Contenido y aprobación de ADR-19** | ✅ **Ya resuelto** — AKVEZ Architecture Team, 2026-08-04 | Cabecera de ADR-19 |

> ### **Lo que falta NO es la aprobación de ADR-19 — está aprobado. Es la asignación de su número dentro de un catálogo que aún no incluye a su predecesor.**

---

# 3. Dónde debe aparecer ADR-19

## 3.1 ¿Requiere entrada en el Blueprint? · ✅ **SÍ**

| Criterio | Verificación |
| --- | :-: |
| ¿Es categoría **ADR**? | ✅ Sí — *Architecture Decision Record*, orden 4 |
| ¿Está `Approved`? | ✅ Sí — 2026-08-04 |
| ¿Es vinculante sobre la implementación? | ✅ Sí — ADS-00: *«ADR… vinculante sobre la implementación»* |
| ¿Puede vivir fuera del Blueprint siendo vinculante? | ⚠️ **Es su estado actual, y es anómalo** |

> **La Clasificación Oficial de ADS-00 es cerrada y `ADR` pertenece a ella.** Un documento `Approved` de categoría ADR **que no figura en el catálogo** es citable pero no localizable: quien busque la regla de construcción de la Agent API en el Blueprint **no la encontrará**.

## 3.2 Ubicación de destino

| Elemento | Actual | Destino |
| --- | --- | --- |
| **Fichero** | `docs/architecture/ADR-19 — …md` | **`docs/blueprint/ADR/ADR-19 — …md`** |
| **Catálogo** | `docs/architecture/INDEX.md` | **`docs/blueprint/INDEX.md`**, tabla de ADR |

## 3.3 ¿Requiere modificación de índice? · ✅ **SÍ, de dos**

| Índice | Modificación |
| --- | --- |
| **`docs/blueprint/INDEX.md`** | **Alta de fila** en la tabla de ADR + actualización de contadores |
| **`docs/architecture/INDEX.md`** | Marcar el traslado, para que no queden dos copias vivas |

### Fila propuesta para `docs/blueprint/INDEX.md`

```
| **ADR-19** | [**Patrón de Construcción de la Agent API**](./ADR/ADR-19%20—%20Agent%20API%20Factory%20Construction%20Pattern.md) | **1.0** | ✅ `Approved` — **seis decisiones D-1 a D-6** |
```

### Contadores a actualizar

| Campo del índice | Hoy | Después |
| --- | :-: | :-: |
| Documentos catalogados | **69** | **70** *(+ADR-19)* · ⚠️ **71 si además se cataloga ADR-18** |
| Vigentes | 63 | 64 *(o 65)* |
| `Approved` | 52 | **53** |
| `Draft` | 11 | 11 *(o 12 con ADR-18)* |
| Última actualización | 2026-07-30 | **2026-08-04** |

> ⚠️ **Los contadores no pueden fijarse sin resolver antes §1.** Si ADR-18 se cataloga en el mismo acto, cambian dos filas más.

## 3.4 Impacto añadido — ADS-02 y ADR-13

**Si en el mismo acto se aplican las decisiones de COM-39 y COM-40:**

| Documento | Versión en índice hoy | Después |
| --- | :-: | :-: |
| **ADR-13** | 1.2 | **1.3** |
| **ADS-02** | 1.1 | **1.2** *(si se aprueba COM-40/2)* |

---

# 4. Quién tiene autoridad para aplicarlo

| Acto | Autoridad | Estado |
| --- | --- | :-: |
| **Aprobar el contenido de ADR-19** | Architecture Team | ✅ **Hecho** — 2026-08-04 |
| **Resolver la numeración de ADR-18** | **Product Office** | 🔴 **Pendiente — bloquea** |
| **Asignar número definitivo a ADR-19** | **Product Office** | 🔴 Bloqueado por lo anterior |
| **Trasladar el fichero a `docs/blueprint/ADR/`** | Architecture Team | ⛔ Tras la asignación |
| **Sincronizar `docs/blueprint/INDEX.md`** | **Product Office** | ⛔ Tras la asignación |

> **La sincronización del índice del Blueprint es un acto de cierre de bloque de gobernanza**, como registra su propia cabecera: última actualización **2026-07-30, sprint *Gobernanza Final***.

---

# 5. Propuesta

> ## **Resolver ADR-18 y ADR-19 en un mismo acto de catalogación.**

| # | Paso | Quién |
| :-: | --- | --- |
| **1** | **Confirmar o reasignar el número de ADR-18** *(su cabecera lo remite expresamente al Product Office)* | **Product Office** |
| **2** | **Catalogar ADR-18** en `docs/blueprint/INDEX.md` con su estado `Draft` — **o registrar por qué no se cataloga** | **Product Office** |
| **3** | **Confirmar `19`** para el ADR de la Agent API, o asignar el que corresponda | **Product Office** |
| **4** | **Trasladar el fichero** a `docs/blueprint/ADR/` | Architecture Team |
| **5** | **Añadir la fila de §3.3** y actualizar contadores | **Product Office** |
| **6** | **Marcar el traslado** en `docs/architecture/INDEX.md` | Architecture Team |

> **Los pasos 1 a 3 son de numeración y catalogación. Ninguno revisa el contenido de ADR-19, que está aprobado.**

---

# 6. Mientras tanto — qué es y qué no es ADR-19

| Afirmación | Estado |
| --- | :-: |
| **ADR-19 es `Approved` y vinculante** por el acto registrado en su cabecera | ✅ **Sí** |
| Su regla **D-1 aplica a toda Agent API Factory nueva** | ✅ **Sí, desde el 2026-08-04** |
| **Figura en el catálogo del Blueprint** | ❌ **No** |
| Su **número es definitivo** | ⚠️ **No confirmado** — §1 |
| **Puede citarse como norma** | ✅ Sí — **citando también esta limitación** |

> ⚠️ **Riesgo de no registrar esta limitación:** un sprint futuro cita «ADR-19» dando por hecho que está catalogado, y **la referencia no resuelve** contra el Blueprint.

---

# 7. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **ADR-19 se cataloga sin resolver ADR-18** y el catálogo queda con un **salto injustificado** entre 17 y 19 | 🟡 Media |
| **2** | **El Product Office reasigna el número de ADR-18** después de catalogar ADR-19, y **hay colisión** | 🟡 Media |
| **3** | **Nada se cataloga** y ADR-19 permanece `Approved` **fuera del Blueprint** indefinidamente: vinculante pero no localizable | 🔴 **Alta** |
| **4** | **Se traslada el fichero sin retirar la copia de `docs/architecture/`** y quedan **dos versiones vivas** | 🟡 Media |
| **5** | ⚠️ **ADR-18 lleva `Draft` sin catalogar desde antes de este bloque.** No lo causa este sprint, pero **lo hereda** | 🟡 Media |

---

# 8. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **ADR-19 debe figurar en el Blueprint.** Es ADR, está `Approved` y es vinculante |
| **2** | **Requiere alta en `docs/blueprint/INDEX.md`** y traslado a `docs/blueprint/ADR/` |
| **3** | **La autoridad es el Product Office**, tanto para el número como para la sincronización del índice |
| **4** | 🔴 **El registro está BLOQUEADO** por el conflicto de numeración con ADR-18 *(§1)* |
| **5** | **No se ha modificado ningún fichero del Blueprint.** Ejecución detenida conforme a la restricción del sprint |

---

# 9. Referencias

**ADS-00 v1.3** — *Clasificación Oficial*, *Orden de Precedencia*, R-4 · **ADR-18 v0.1** *(cabecera — número provisional, `Draft`)* · **ADR-19 v1.0** *(cabecera, §14)* · **ADR-13 v1.3 Consolidated Amendment** · **ADS-02 v1.1** · **`docs/blueprint/INDEX.md`** *(catálogo, tabla de ADR, contadores)* · **`docs/architecture/INDEX.md`** · **COM-39** §3, §7.1, §7.2.
