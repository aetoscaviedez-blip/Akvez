# COM-44 — Propuesta de Enmienda Consolidada ADR-13 v1.4

| Campo | Valor |
| --- | --- |
| Código | COM-44 / 2 |
| Clasificación | **Propuesta de enmienda** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Proposal only.** NO aplicada · NO aprobada |
| Fecha | 2026-08-04 |
| Documento objeto | **ADR-13** v1.2 → **v1.4** propuesta |
| Sustituye a | **ADR-13 v1.3 Consolidated Amendment** — §1.2 |
| Análisis de respaldo | **COM-44/1** |

> **ADR-13 no ha sido editado. `docs/blueprint/` intacto. Cero cambios de código. Ningún documento aprobado.**

---

# 1. Qué es esta propuesta

## 1.1 Relación con v1.3

**ADR-13 v1.3 fue aprobada el 2026-08-04 y NO ha llegado a aplicarse al fichero del Blueprint.** COM-43 y COM-44/1 la auditaron antes de aplicarla y encontraron dos puntos a refinar.

> ### **v1.4 no revoca v1.3: la absorbe.** Sus tres cambios se conservan; **dos se refinan** y **uno se añade condicionado**.

| Cambio de v1.3 | En v1.4 |
| --- | :-: |
| **A** — contenido canónico de A-6 | ✅ **Idéntico** |
| **B** — criterio de vigencia V-2 | 🔄 **Refinado** — enunciado por concepto |
| **C** — garantías G-8/G-9/G-10 | 🔄 **Refinado** — G-9 reconoce dos patrones |
| — | ➕ **D** — aclaración de V-3 |
| — | ⚠️ **E** — corrección de A-5 · **CONDICIONADA** |

> **Si el Architecture Team prefiere aplicar v1.3 tal cual, es legítimo:** **COM-44/1 §6 concluye que v1.3 no introduce inconsistencia.** v1.4 es una mejora, no una corrección de v1.3.

## 1.2 Alcance

**Se enmiendan §6.2, §10.3 y §12.3. Ninguna otra sección.**
**No se tocan:** §1 a §5 · §6.1 · **§6.3** · §7 a §9 · §10.1 · §10.2 · §10.4 · §11 · §12.1 · §12.2 · §12.4 · §13 · §14 y siguientes.
**Dentro de las tocadas:** las otras **once filas** de §6.2 · **V-1, V-4, V-5** · **G-1 a G-7** conservan su texto íntegro.

---

# 2. Cambio A — Contenido canónico de A-6 · ✅ **Exigido por autoridad**

## 2.1 Texto actual

```
| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |
```

## 2.2 Texto propuesto

```
| **A-6** | **Propuesta comercial** | La **estrategia comercial estructurada** y las decisiones que la componen · la **evidencia utilizada** *(lista cerrada de hechos afirmables)* · el **texto generado** · el **canal** · la **versión del criterio aplicado** *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |
```

## 2.3 Autoridad

**PO-02 §3** *(PO — **orden 2**)*: *«la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa»* · **«No es solo el texto.»**
**ADS-00 R-2:** un documento de orden 4 **no puede redefinir** a uno de orden 2. **ADS-00 R-1:** obliga a corregirlo.
**Confirmación por segunda vía:** **DDD-01 §9.1 y §2.1** — ADR-16 §4.4 es la autoridad; ADR-13 figura como *«Desarrollado en»*.

**Se mantiene sin cambio:** A-6 sigue siendo A-6, sigue siendo **versionado**, y se escribe **al generarse**.

---

# 3. Cambio B — Criterio de vigencia · 🔄 **refinado respecto de v1.3**

## 3.1 Texto actual

```
| **V-2** | Existe siempre una **versión vigente**, que es la más reciente y la que se presenta al usuario |
```

## 3.2 Texto propuesto

```
| **V-2** | Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión dentro de su clave de identidad.** El número de emisión es **monótono creciente por V-1** y **la marca temporal NO determina la vigencia**. La regla se enuncia **por concepto**: el nombre del campo que lo materializa es materia de **DEV-00 §5.1**, y hoy difiere entre activos —`issue` en A-6 y A-11, `emission` en A-4/A-5—, **sin que ello altere el cumplimiento de esta regla**. Aplica a los cuatro activos versionados de esta sección |
```

## 3.3 Qué cambia respecto de v1.3, y por qué

| | v1.3 | **v1.4** |
| --- | --- | --- |
| Enunciado | *«mayor número de emisión (**`issue`**)»* | *«mayor número de emisión»* — **sin nombre en el enunciado** |
| Nombre del campo | Implícitamente normativo | **Declarado materia de DEV-00 §5.1**, con la divergencia actual reconocida |

**Fundamento — COM-44/1 §2 y §3:**

| # | Razón | Autoridad |
| :-: | --- | --- |
| **1** | **La nomenclatura técnica es materia de DEV** | **ADS-00**, alcance de la categoría DEV · **DEV-00 §5.1** |
| **2** | **Un nombre sin etiqueta de alcance dentro de un ADR se lee como normativo** — ocurrió con ADR-09 §5.2 y costó cinco auditorías | **ADR-19 §5.1**, `Approved` |
| **3** | **A-5 cumple la semántica de V-2 con el campo `emission`** — verificado | **COM-43 §5.2** |
| **4** | Atar la regla a una representación concreta es el acoplamiento que la frontera de persistencia evita | ADR-08 §5 · **R-27** · ADR-13 §12.4 |

> ### **Con el enunciado de v1.3, A-5 parecería incumplir una regla que su semántica sí cumple. Con el de v1.4, no.**

---

# 4. Cambio D — Aclaración de V-3 · ➕ **nuevo**

## 4.1 Texto actual

```
| **V-3** | Cada versión conserva su marca temporal y la ejecución de agente que la produjo (A-10) |
```

## 4.2 Texto propuesto

```
| **V-3** | Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10). **Es metadato de trazabilidad: no participa en la determinación de la vigencia (V-2).** |
```

## 4.3 Fundamento

**V-3 no cambia de contenido: se explicita su relación con V-2.** La conflación entre *conservar* una marca temporal y *ordenar* por ella es la que produjo la divergencia de **ADS-02 §7** *(COM-42/A §4)*. **Separarlas en el propio ADR impide que se repita aguas abajo.**

---

# 5. Cambio C — Garantías de identidad · 🔄 **refinado respecto de v1.3**

## 5.1 Texto propuesto — §12.3, tras G-7

| # | Garantía | Origen |
| --- | --- | --- |
| **G-8** | **Unicidad de identidad.** El sistema **debe impedir múltiples registros con la misma identidad lógica** dentro del espacio de un usuario | ADR-16 §4.2, §4.3, §4.4 · ADR-05 §14 |
| **G-9** | **Atomicidad de la persistencia.** La creación **debe garantizar que operaciones concurrentes no produzcan duplicados**. **La derivación del número de emisión y su escritura forman una operación indivisible, con independencia de qué capa derive el número** *(§5.3)* | §11.1 · **R-30** |
| **G-10** | **Resolución determinista de conflictos.** Ante conflicto de identidad: **no duplicar · no sobrescribir silenciosamente · devolver un resultado determinista** | §10.2 · **R-64** |

## 5.2 Identidad lógica que G-8 protege

| Activo | Identidad lógica | Autoridad |
| --- | --- | --- |
| **A-1** Lead | `(Referencia de Origen, Usuario)` | ADR-12 §7.2 — **ya cubierta por G-6** |
| **A-6** | `(Usuario, Lead, momento, número de emisión)` | **ADR-16 §4.4** |
| **A-11** | `(Usuario, Lead, número de emisión)` | **ADR-16 §4.2** |
| **A-12** | `(Usuario, Lead, número de secuencia)` | **ADR-16 §4.3** · CS-I5 |
| **A-4 / A-5** | ⚠️ **No declarada por ningún documento** | — |

> ⚠️ **A-5 queda fuera de la especificación de G-8, y se registra:** **ADR-16 declara la identidad de las cinco entidades comerciales, y el Opportunity Score no es una de ellas** *(DDD-01 §2.1)*. **G-8 le aplica en su enunciado general; su clave concreta no está declarada.** Elevado en §8.

## 5.3 ⚠️ Nota que v1.3 no incluía — los dos patrones de derivación

> **El sistema deriva hoy el número de emisión de dos formas, ambas fundadas:**
>
> | Activo | Quién deriva | Autoridad |
> | :-: | --- | --- |
> | **A-4 / A-5** | **El Adapter** | **ADR-05 §7 D3** — el identificador lo asigna la persistencia |
> | **A-6 · A-11** | **El caso de uso** | **ADR-16 §4.2, §4.4** — el número **integra la identidad del agregado** |
>
> **G-9 aplica a ambos y se satisface de forma distinta en cada uno.** Enunciarla sin reconocerlo llevaría al motor real a resolver solo uno.
>
> *(COM-43 §5.3 · COM-44/1 §4.)*

## 5.4 ✅ Verificación — no se crean garantías nuevas respecto de v1.3

| Comprobación | Resultado |
| --- | :-: |
| ¿G-8, G-9, G-10 son nuevas frente a **v1.3**? | ❌ **No.** v1.3 ya las creó |
| ¿v1.4 añade alguna garantía? | ❌ **No.** Solo precisa **G-9** |
| ¿Se altera G-1 a G-7? | ❌ **No** |

---

# 6. ⚠️ Cambio E — Corrección de A-5 · **CONDICIONADO, sin autoridad**

> ## 🔴 **Este cambio NO puede aprobarse con la propuesta. Requiere un pronunciamiento previo.**

## 6.1 Qué se propondría

```
| **A-5** | **Opportunity Score** | Puntuación · banda · explicación · **el desglose por categorías · el perfil de usuario y la versión de Perfil de Ponderación con que se calculó** *(V-4 · ADR-14 R-VIN · DEV-00 R-34)* | Al completarse la Evaluación. **Versionado** |
```

## 6.2 Por qué queda condicionado

**COM-44/1 §1 lo determina:**

| Hecho | Consecuencia |
| --- | --- |
| **§6.2 no afirma nada falso sobre A-5.** Puntuación, banda y explicación **sí** son contenido del Score | No es contradicción |
| **§6.3 declara la completitud del *conjunto de Empresas*, no la de la columna «Contenido»** | **Ninguna regla declara la columna exhaustiva** |
| **ADS-00 regula conflictos entre documentos, no dentro de uno** | No hay precedencia aplicable |

> ### **Sin declarar si la columna «Contenido» es exhaustiva, completar A-5 es coherencia editorial — no corrección de defecto.**

## 6.3 Pronunciamiento previo requerido

> **¿Es exhaustiva la columna «Contenido» de ADR-13 §6.2?**

| Respuesta | Consecuencia |
| --- | --- |
| **Sí** | El Cambio E pasa a **exigido**, y **debe auditarse el resto del inventario** por el mismo criterio |
| **No** | El Cambio E se **retira**; A-5 queda correcta y la asimetría con A-11 es de estilo |

**Propietario:** **AKVEZ Architecture Team**.

> ⚠️ **Si se responde «Sí», el alcance crece:** las otras diez filas tendrían que contrastarse contra sus reglas por el mismo criterio. **COM-43 §3.1 clasificó su semántica, no su exhaustividad.**

---

# 7. Registro para el Historial de ADR-13 — v1.4

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.4** | *(a fijar)* | AKVEZ Architecture Team | **Enmienda consolidada de tres secciones. Absorbe la enmienda v1.3, no aplicada.** **§6.2** — corrección de la columna «Contenido» de **A-6**, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4. **§10.3** — se completa **V-2** declarando que la versión vigente es **la de mayor número de emisión**, enunciada **por concepto** y remitiendo el nombre del campo a DEV-00 §5.1; se precisa **V-3** como metadato de trazabilidad ajeno a la vigencia. **§12.3** — se añaden **G-8**, **G-9** y **G-10**, y G-9 reconoce los **dos patrones de derivación** vigentes. **Ninguna otra sección resulta afectada:** §6.1, **§6.3**, §10.1, §10.2, §10.4, §11, §12.1, §12.2, §12.4 y §13 permanecen íntegros; **las otras once filas de §6.2**, **V-1, V-4, V-5** y **G-1 a G-7** conservan su texto. | **§6.2** contradecía **PO-02 §3** *(orden 2)*, que declara que una Propuesta *«no es solo el texto»* — **ADS-00 R-1 y R-3**. **§10.3 V-2** carecía de criterio de orden, ambigüedad abierta desde **COM-19 §9 (Sprint 19)**, con dos rellenos divergentes; el enunciado **por concepto** evita que el nombre del campo se lea como normativo, precedente **ADR-19 §5.1**. **§12.3** carecía de garantía de identidad para los activos distintos del Lead **(F-2, Capa A.2)**. Auditorías: **COM-36/1**, **COM-43**, **COM-44/1**. |

---

# 8. Cuestiones elevadas — **no resueltas aquí**

| # | Cuestión | Propietario | Bloquea |
| :-: | --- | --- | :-: |
| **1** | **¿Es exhaustiva la columna «Contenido» de §6.2?** | **Architecture Team** | **Cambio E** |
| **2** | **¿Cuál es la identidad lógica de A-4/A-5** a efectos de G-8? | **Architecture Team** | Especificación completa de G-8 |
| **3** | **¿A-4 y A-5 deben tener repositorios separados?** *(COM-43 H-3)* | **Architecture Team** | — |
| **4** | **¿Debe unificarse `emission` → `issue`?** | **Architecture Team**, vía **DEV-00 §5.1** | — arrastraría código |

> **Ninguna impide aprobar los cambios A, B, C y D.**

---

# 9. Documentos que esta enmienda obliga a actualizar

| # | Documento | Acción | Estado |
| :-: | --- | --- | :-: |
| **1** | **`docs/blueprint/ADR/ADR-13`** | Aplicar A, B, C, D + fila v1.4 | 🔴 Pendiente |
| **2** | **ADS-02 §7** | Sincronizar — **COM-44/3** | 🔴 Pendiente |
| **3** | **COM-19 §9** | Cerrar formalmente | 🟡 Pendiente |
| **4** | **`docs/blueprint/INDEX.md`** | ADR-13: 1.2 → **1.4** | 🟡 Pendiente |
| **5** | **ADS-02 §3** | Requisitos de motor — **F-2 Capa B** | 🟡 Sprint distinto |

---

# 10. Referencias

**ADS-00 v1.3** R-1, R-2, R-3, R-7, *categoría DEV* · **PO-02 v1.3** §3 · **APS-08** §9 · **APS-13** §9 · **APS-18 v1.2** §8.1 · **ADR-05 v1.4** §7 D3, §14 · **ADR-08 v1.2** §5 · **ADR-09 v1.3** §5.2 · **ADR-12 v1.1** §7.2 · **ADR-13 v1.2** §6.2, §6.3, §10.3, §11.1, §12.3, §12.4, §13 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-14 v1.2** R-VIN · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-19 v1.0** §5.1 · **DDD-01 v1.1** §2.1, §9.1, §9.2 · **DEV-00** §5.1, R-27, R-30, R-34, R-64 · **COM-19** §9 · **COM-36/1** · **COM-42/A** · **COM-43** · **COM-44/1**.
