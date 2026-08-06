# COM-36 — Decisión de Ordenamiento de Versiones de la Propuesta

| Campo | Valor |
| --- | --- |
| Código | COM-36 / 4 |
| Clasificación | **Propuesta `Draft` + registro de bloqueo** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **NO RESUELTO.** Ningún documento aprobado contiene la respuesta |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-36, tarea 4 |
| Cuestión de origen | **COM-19 §9** — abierta desde el Sprint 19 |
| Antecedentes | **COM-34/3 §4** · **COM-35/4** |

> **Cero cambios de código.** El adapter sigue ordenando por `issue`.

---

# 1. Respuesta a la pregunta del sprint

**El sprint pregunta: ¿A) `issue`, B) `issuedAt`, o C) otro criterio documentado?**

> ## 🔴 **Ninguna de las tres. La respuesta no existe en el Blueprint.**

| Opción | ¿Respaldada por documento aprobado? |
| :-: | --- |
| **A — `issue`** | ❌ **No.** Ningún documento lo declara. Lo elige el código, razonadamente *(§4)* |
| **B — `issuedAt`** | ❌ **No como autoridad.** Lo dice **ADS-02 §7**, que es documento de implementación **gobernado por ADR-13** y que **completa** una regla que no lo especifica |
| **C — otro criterio documentado** | ❌ **No existe.** Búsqueda exhaustiva en PO, APS y ADR: ningún documento define el criterio de vigencia de un activo versionado |

**Conforme a la restricción final del sprint** —*«Si durante el sprint aparece cualquier decisión sin autoridad explícita: NO resolver. Crear Proposal Draft. Registrar bloqueo. Detenerse»*—, este documento **propone** y **se detiene**.

---

# 2. Investigación

## 2.1 Precisión sobre las fuentes citadas en el encargo

> ⚠️ **El sprint pide investigar «ADS-02 V-2» y «ADS-02 V-3». **V-2 y V-3 no son de ADS-02: son de ADR-13 §10.3.** ADS-02 §7 las **referencia** al declarar cómo PostgreSQL las satisfaría. La distinción es exactamente lo que resuelve la tarea, porque **cambia cuál es la autoridad**.

## 2.2 La autoridad: ADR-13 §10.3 — y está incompleta

**Texto literal de las cinco reglas de versionado:**

| Regla | Enunciado |
| --- | --- |
| **V-1** | *«Cada emisión nueva **añade** una versión. Ninguna retira la anterior»* |
| **V-2** | *«Existe siempre una **versión vigente**, que es **la más reciente** y la que se presenta al usuario»* |
| **V-3** | *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* |
| **V-4** | *(Opportunity Score y su perfil de usuario)* |
| **V-5** | *«Una versión nueva **nunca altera la identidad** ni el estadio ya alcanzado»* |

> ### **V-2 dice «la más reciente». No dice respecto de qué.**
>
> **Y V-3 no lo suple:** exige **conservar** la marca temporal como dato — junto a la ejecución de agente—, **no ordenar por ella**. Conservar un dato y ordenar por un dato son cosas distintas, y V-3 solo enuncia la primera.

**COM-19 §10, hallazgo 2, ya lo había formulado con precisión, y sigue vigente:**

> *«`findCurrentByMoment` promete «la más reciente (V-2)» **sin decir respecto de qué**: ¿mayor `issue` o mayor `issuedAt`? Con `issuedAt` de origen abierto *(RC-4)*, **conviene que el contrato lo fije**.»*

## 2.3 Búsqueda de un criterio en otro lugar · **sin resultado**

| Dónde se buscó | Resultado |
| --- | --- |
| **PO-02 §3** *(qué es una Propuesta)* | Regla 2: *«Regenerar **añade** una versión; nunca sustituye»*. **Nada sobre cuál es la vigente** |
| **ADR-16 §4.4** | `número de emisión` aparece **como parte de la identidad**, no como criterio de orden |
| **ADR-16 §4.2** *(A-11)* | Ídem |
| **APS-04 §A.5 (P-10)** | Permite *Generar · Regenerar*. **Nada sobre selección de versión** |
| **APS-19 §4.3 · CE-4** | *«Prevalece la manifestación… la lectura anterior se sustituye y queda constancia»*. **Regla de precedencia semántica, no de orden temporal** |
| **ADR-13 §12.3** *(G-1 a G-7)* | Siete garantías, **todas del Lead**. Ninguna sobre vigencia de versiones |

> **Ningún documento de las categorías PO, APS o ADR define el criterio.**

## 2.4 Quién rellena hoy el hueco, y con qué rango

| | **Lectura T — marca temporal** | **Lectura I — número de emisión** |
| --- | --- | --- |
| **Criterio** | Mayor `issuedAt` | Mayor `issue` |
| **Quién** | **ADS-02 §7**: *«Versión vigente distinguible · §10.3 V-2 · **Marca temporal por emisión**; la vigente es la más reciente»* | **El código**: `inMemoryProposalAdapter` y `inMemoryBuyerDiagnosisAdapter` |
| **Rango** | ADS — *Documento de Implementación*, **«Gobernado por ADR-13»** | Artefacto. **No es documento** |
| **Relación con V-2** | **Lo completa** | **Lo completa** |

> ### **Ninguna contradice a V-2. Las dos rellenan el mismo hueco de forma distinta.**
>
> **Por eso ADS-00 R-4 no aplica:** no hay dos documentos incompatibles sobre una materia decidida. **Hay una materia sin decidir.**

---

# 3. Alcance — no es solo A-6

**ADR-13 §10.3 versiona cuatro activos y V-2 les aplica por igual.**

| Activo | Implementado | Criterio en código |
| --- | :-: | --- |
| **A-6** Propuesta | ✅ | **Mayor `issue`** |
| **A-11** Diagnóstico | ✅ | **Mayor `issue`** |
| **A-4** Análisis | ❌ sin adapter versionado | — |
| **A-5** Opportunity Score | ⚠️ `inMemoryLeadAnalysisAdapter` | **No auditado** |

> **La ambigüedad de V-2 es sistémica.** Los dos activos implementados eligieron la Lectura I **de forma consistente y sin documento que lo mandara**. **A-4 y A-5 llegarán a la misma bifurcación**, y nada garantiza que elijan igual.

---

# 4. El argumento del código — transcrito, no adoptado

**El sprint advierte: *«No elegir por conveniencia del código.»* Se transcribe porque el decisor debe tenerlo delante, no como fundamento.**

`inMemoryProposalAdapter.ts:70-78`:

> *«**No se ordena por `issuedAt`** y la razón es de garantías: `issue` es monótono creciente por `(Lead, momento)` —lo deriva el caso de uso del historial y V-1 · P-I2 aseguran que solo se añade—, mientras que la marca temporal es un valor de reloj **cuyo origen sigue abierto**. Ordenar por ella haría que «cuál es la vigente» dependiera de una cuestión sin decidir.»*

**Los dos hechos que invoca son verificables:**

| Hecho | Verificación |
| --- | :-: |
| `issue` **forma parte de la identidad de A-6** | ✅ **ADR-16 §4.4** |
| El **origen de `issuedAt` está sin decidir** | ✅ **COM-12 RC-4**, abierta |

> **Es un argumento fuerte y sigue sin ser autoridad.** Un adapter no decide semántica de persistencia: **DDD-01 §9.2** la atribuye a **ADR-13**.

---

# 5. Impacto

| # | Impacto | Severidad |
| :-: | --- | :-: |
| **1** | **El motor real puede implementar la Lectura T** —ADS-02 es su documento de referencia y dice «marca temporal»— **mientras el dominio asume la Lectura I**. Al sustituir el adapter, **cuál es la propuesta vigente cambiaría** sin que ninguna prueba lo detectara: las suites verifican el adapter en memoria | 🔴 **Alta** |
| **2** | **Dos emisiones con la misma marca temporal** —posible: el reloj tiene resolución finita— **dejan la vigencia indeterminada** bajo la Lectura T. La Lectura I no tiene ese modo de fallo | 🟡 Media |
| **3** | **A-4 y A-5 eligen criterio distinto** al implementarse *(§3)* | 🟡 Media |
| **4** | **Se resuelve `COM-12 RC-4`** fijando un productor de `issuedAt` **sin advertir que decide también la vigencia** bajo la Lectura T | 🟡 Media |

> **El impacto 1 es el que impide dejar esto abierto indefinidamente.** Es un cambio de comportamiento **observable por el usuario** —qué propuesta ve— que se activaría al cambiar de adapter: precisamente el cambio que **ADR-09 §6** promete que *«ninguna otra capa se entera»*.

---

# 6. Propuesta `Draft` — para que el Architecture Team decida

> **No es una decisión. Es el texto que se somete.**

## 6.1 Enmienda propuesta a ADR-13 §10.3, V-2

| | Texto |
| --- | --- |
| **Hoy** | **V-2** — *«Existe siempre una **versión vigente**, que es la más reciente y la que se presenta al usuario»* |
| **Propuesto** | **V-2** — *«Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión dentro de su clave de identidad**, no la de marca temporal más reciente: el número de emisión forma parte de la identidad del agregado *(ADR-16 §4.2, §4.4)* y es monótono creciente por V-1, mientras que la marca temporal es un atributo cuyo productor no está decidido. **Aplica a los cuatro activos versionados de §10.3.»*** |

## 6.2 Fundamento de la propuesta

| # | Razón | Verificable en |
| :-: | --- | --- |
| **1** | **`issue` es identidad; `issuedAt` es atributo.** Ordenar por identidad no depende de ninguna decisión pendiente | **ADR-16 §4.2, §4.4** |
| **2** | **V-1 garantiza monotonía**: *«cada emisión nueva añade… ninguna retira»*. La marca temporal no tiene garantía equivalente | **ADR-13 §10.3 V-1** |
| **3** | **No tiene el modo de fallo de las marcas empatadas** *(§5, impacto 2)* | — |
| **4** | **Es lo que los dos activos implementados ya hacen**, de forma consistente | Código |

> ⚠️ **La razón 4 se lista al final deliberadamente.** El sprint prohíbe elegir por conveniencia del código: **es corroboración, no fundamento.** Si el Architecture Team eligiera la Lectura T, **el código debe cambiar** — y este documento no se opondría.

## 6.3 Si en cambio se eligiera la Lectura T

**Dos cuestiones habría que resolver antes, y conviene que consten:**

1. **Resolver `COM-12 RC-4`** —origen de `issuedAt`—, porque la vigencia pasaría a depender de una cuestión abierta.
2. **Decidir el desempate** entre marcas temporales iguales *(§5, impacto 2)*.

## 6.4 Alineación de ADS-02 §7

**Cualquiera que sea la decisión, ADS-02 §7 debe alinearse o registrar por qué difiere.** ADS-02 declara estar *«Gobernado por ADR-13»*.

---

# 7. Bloqueo registrado

| Campo | Valor |
| --- | --- |
| **Bloqueo** | **B-5** *(propuesto)* — **criterio de vigencia de versión sin declarar** |
| **Documento incompleto** | **ADR-13 §10.3, V-2** |
| **Qué impide** | Que el motor real implemente la vigencia sin riesgo de divergencia · que las suites de contrato prueben el criterio · el cierre de **COM-19 §9** |
| **Quién puede levantarlo** | **AKVEZ Architecture Team** — `Responsable` de ADR-13. Su aprobación original fue del **Product Office** *(GOV-01)* |
| **Severidad** | 🔴 **Alta** — §5, impacto 1 |
| **Antigüedad** | **Abierto desde el Sprint 19** *(COM-19 §9)* |

---

# 8. Documentos a actualizar

| # | Documento | Acción | Precondición |
| :-: | --- | --- | :-: |
| **1** | **ADR-13 §10.3, V-2** | Declarar el criterio *(§6.1)* + registro en Historial | — |
| **2** | **ADS-02 §7** | Alinear con 1, o registrar por qué difiere | ⛔ Tras 1 |
| **3** | **COM-19 §9** | **Cerrar formalmente** | ⛔ Tras 1 |
| **4** | Suites de contrato de A-6 y A-11 | **Añadir prueba que discrimine el criterio** — hoy **ninguna lo hace** | ⛔ Tras 1 |
| **5** | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` | Confirmar o corregir | ⛔ Tras 1 |

> **Los puntos 4 y 5 son los únicos que tocan código, y están bloqueados.** **Este sprint no los ejecuta.**

---

# 9. Lo que este documento **no** hace

- ❌ **No elige criterio.** §6 es una **propuesta**, no una decisión.
- ❌ **No modifica ADR-13, ADS-02 ni ningún COM anterior.**
- ❌ **No cambia código.**
- ❌ **No declara defectuoso a ADS-02 §7.** Completó un hueco; que lo hiciera distinto al código es el hallazgo, no una infracción.
- ❌ **No cierra COM-19 §9.**
- ❌ **No audita A-4 ni A-5** *(§3)*.

---

# 10. Referencias

**ADR-09 v1.3** §6 · **ADR-12 v1.1** §12.1 · **ADR-13 v1.2** §10.3 *(V-1 a V-5)*, §12.3 · **ADR-16 v1.1** §4.2, §4.4 *(P-I2)* · **ADS-00 v1.3** R-4, R-5 · **ADS-02 v1.1** *(cabecera)*, §3, §7 · **APS-04 v4.0** §A.5 *(P-10)* · **APS-19 v1.1** §4.3, CE-4 · **PO-02 v1.3** §3 · **DDD-01 v1.1** §9.2 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-34/3** §4 · **COM-35/4**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
