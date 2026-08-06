# COM-37 — Resolución de Ordenamiento de Versiones

| Campo | Valor |
| --- | --- |
| Código | COM-37 / 2 |
| Clasificación | **Propuesta de criterio + asignación de propiedad** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **PROPIETARIO ASIGNADO.** Criterio **propuesto, no aprobado** |
| Fecha | 2026-08-04 |
| Bloqueo | **B-5** — abierto, con propietario nominado |
| Cuestión de origen | **COM-19 §9** — abierta desde el Sprint 19 |
| Antecedentes | **COM-34/3 §4** · **COM-35/4** · **COM-36/4** |

> **Cero cambios de código.** El adapter sigue ordenando por `issue`.

---

# 1. Documento propietario de la decisión

> ## **`ADR-13 §10.3` — Responsable: AKVEZ Architecture Team · Aprobado por: AKVEZ Product Office**

**Autoridad que lo establece — DDD-01 §9.2:**

| Concepto | Autoridad única |
| --- | --- |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** |

**Cuál es la versión vigente de un activo versionado es semántica de persistencia.** No lo decide un adapter, no lo decide ADS-02 y no lo decide un documento COM.

| Rol | Actor |
| --- | --- |
| **Define el criterio** | **Architecture Team**, en ADR-13 §10.3 V-2 |
| **Aprueba** | **Product Office** *(aprobó ADR-13 en GOV-01)* |
| **Refleja el criterio en el motor** | **Architecture Team** en **ADS-02 §7** — *«Gobernado por ADR-13»* |
| **Implementa y prueba** | **Ingeniería** ⛔ bloqueada |

> ✅ **Criterio de aceptación del sprint cumplido: Proposal Version Ordering tiene propietario.**

---

# 2. Criterio oficial · 🔴 **NO EXISTE HOY**

## 2.1 El hueco, en el texto

**ADR-13 §10.3:**

| Regla | Enunciado |
| --- | --- |
| **V-1** | *«Cada emisión nueva **añade** una versión. Ninguna retira la anterior»* |
| **V-2** | *«Existe siempre una **versión vigente**, que es **la más reciente** y la que se presenta al usuario»* |
| **V-3** | *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* |

> ### **V-2 dice «la más reciente». No dice respecto de qué. Y V-3 no lo suple: exige *conservar* la marca temporal como dato, no *ordenar* por ella.**

## 2.2 Búsqueda exhaustiva de un criterio · sin resultado

| Fuente | Resultado |
| --- | --- |
| **PO-02 §3** | Regla 2: *«Regenerar **añade**… nunca sustituye»*. **Nada sobre cuál es la vigente** |
| **ADR-16 §4.2 · §4.4** | `número de emisión` aparece **como identidad**, no como criterio de orden |
| **APS-04 §A.5 (P-10)** | *Generar · Regenerar*. **Nada sobre selección de versión** |
| **APS-19 §4.3 · CE-4** | *«Prevalece la manifestación»* — **precedencia semántica, no orden temporal** |
| **ADR-13 §12.3** | Siete garantías, **todas del Lead** |

**Y quién rellena el hueco hoy:**

| | **Lectura T** | **Lectura I** |
| --- | --- | --- |
| Criterio | Mayor `issuedAt` | Mayor `issue` |
| Quién | **ADS-02 §7** — documento de implementación, *«Gobernado por ADR-13»* | **El código** — `inMemoryProposalAdapter`, `inMemoryBuyerDiagnosisAdapter` |
| Rango | ADS | Artefacto. **No es documento** |

> **Ninguna contradice a V-2. Las dos completan lo que V-2 no dice.** Por eso `ADS-00 R-4` no aplica: **no hay conflicto entre documentos, hay una regla incompleta.**

---

# 3. Criterio propuesto — para que el propietario decida

> **Propuesta. No es una decisión.**

## 3.1 Enmienda propuesta a ADR-13 §10.3 V-2

| | Texto |
| --- | --- |
| **Hoy** | **V-2** — *«Existe siempre una **versión vigente**, que es la más reciente y la que se presenta al usuario»* |
| **Propuesto** | **V-2** — *«Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión dentro de su clave de identidad**, no la de marca temporal más reciente: el número de emisión **forma parte de la identidad del agregado** *(ADR-16 §4.2, §4.4)* y es **monótono creciente por V-1**, mientras que la marca temporal es un atributo cuyo productor no está decidido *(COM-12 RC-4)*. **Aplica a los cuatro activos versionados de §10.3.»*** |

## 3.2 Fundamento

| # | Razón | Verificable en |
| :-: | --- | --- |
| **1** | **`issue` es identidad; `issuedAt` es atributo.** Ordenar por identidad no depende de ninguna decisión pendiente | **ADR-16 §4.2, §4.4** |
| **2** | **V-1 garantiza monotonía.** La marca temporal no tiene garantía equivalente | **ADR-13 §10.3 V-1** |
| **3** | **No tiene el modo de fallo de marcas empatadas** — el reloj tiene resolución finita | §5 |
| **4** | Es lo que los dos activos implementados ya hacen, consistentemente | Código |

> ⚠️ **La razón 4 va al final deliberadamente.** El sprint anterior prohibió elegir por conveniencia del código: **es corroboración, no fundamento**. **Si el Architecture Team elige la Lectura T, el código debe cambiar** — y esta propuesta no se opone.

## 3.3 Si se eligiera la Lectura T

**Dos cuestiones habría que resolver antes:**

1. **Cerrar `COM-12 RC-4`** —origen de `issuedAt`—, o la vigencia dependería de una cuestión abierta.
2. **Decidir el desempate** entre marcas temporales iguales.

---

# 4. Impacto por activo

## 4.1 A-6 — Propuesta comercial · ✅ **Alcanzado**

| | |
| --- | --- |
| **Versionado** | ✅ Sí — ADR-13 §10.3 |
| **Identidad** | `(Lead, momento de la secuencia, número de emisión)` — ADR-16 §4.4 |
| **Criterio en código** | **Mayor `issue`**, en `findCurrentByMoment` |
| **Operación afectada** | `ProposalRepository.findCurrentByMoment` — *«la emisión **vigente** de un momento concreto»* |
| **Impacto de la decisión** | **Directo.** Es el caso que originó COM-19 §9 |

## 4.2 A-11 — Diagnóstico Comercial · ✅ **Alcanzado**

| | |
| --- | --- |
| **Versionado** | ✅ Sí — ADR-13 §10.3 |
| **Identidad** | `(Lead, número de emisión)` — ADR-16 §4.2 |
| **Criterio en código** | **Mayor `issue`** — `inMemoryBuyerDiagnosisAdapter` |
| **Impacto** | **Directo, y hoy no está registrado en ninguna deuda.** Es el segundo activo que ya eligió criterio sin documento |

## 4.3 ⚠️ A-12 — Secuencia Comercial · **NO alcanzado**

> ### **A-12 no se versiona, y por tanto V-2 no le aplica.**
>
> **ADR-13 §6.2:** *«**Actualizable**, no versionado»*.
> **ADR-13 §10.3:** *«**La Secuencia Comercial (A-12) no se versiona.** Se actualiza. Es la única de las dos incorporaciones de §6.2 que no entra aquí, y la razón es de volumen: su estado cambia con cada contacto y **A-8 ya conserva íntegro el rastro de esos cambios**.»*

**El código lo respeta:** `CommercialSequenceRepository` expone **`save` y `update`**, no versiones. `update` *«conserva la identidad y la fecha de creación»* y no admite selección de vigencia.

> **El encargo del sprint pide el impacto sobre A-12. La respuesta documentada es: ninguno.** Aplicarle V-2 sería *«imponer a uno la semántica del otro»*, que es exactamente lo que ADR-13 §6.2 razona al separarlos.
>
> ⚠️ **A-12 sí tiene «momento vigente», y no debe confundirse con «versión vigente».** `currentMoment` es el contacto en curso dentro del plan; nada tiene que ver con V-2.

## 4.4 Futuros activos versionados · ⚠️ **El riesgo real**

**ADR-13 §10.3 versiona cuatro activos. Solo dos están implementados.**

| Activo | Implementado | Criterio |
| --- | :-: | --- |
| **A-6** Propuesta | ✅ | Mayor `issue` |
| **A-11** Diagnóstico | ✅ | Mayor `issue` |
| **A-4** Análisis | ❌ sin adapter versionado | — |
| **A-5** Opportunity Score | ⚠️ `inMemoryLeadAnalysisAdapter` | **No auditado** |

> ### **La ambigüedad de V-2 es sistémica, no de la Propuesta.**
>
> Los dos activos implementados eligieron la Lectura I **de forma consistente y sin documento que lo mandara**. **A-4 y A-5 llegarán a la misma bifurcación**, y **nada garantiza que elijan igual**. Por eso la enmienda de §3.1 se propone **para los cuatro**, no solo para A-6.

---

# 5. Impacto de no decidir

| # | Impacto | Severidad |
| :-: | --- | :-: |
| **1** | **El motor real puede implementar la Lectura T** —ADS-02 es su documento de referencia— **mientras el dominio asume la Lectura I**. Al sustituir el adapter, **cuál es la propuesta vigente cambiaría sin que ninguna prueba lo detectara** | 🔴 **Alta** |
| **2** | **Dos emisiones con la misma marca temporal** dejan la vigencia **indeterminada** bajo la Lectura T. La Lectura I no tiene ese modo de fallo | 🟡 Media |
| **3** | **A-4 y A-5 eligen criterio distinto** al implementarse | 🟡 Media |
| **4** | **Se cierra `COM-12 RC-4`** fijando un productor de `issuedAt` **sin advertir que decide también la vigencia** bajo la Lectura T | 🟡 Media |

> **El impacto 1 es el decisivo:** es un cambio **observable por el usuario** —qué propuesta ve— que se activaría al cambiar de adapter, **precisamente el cambio que ADR-09 §6 promete que «ninguna otra capa se entera»**.

---

# 6. Documentos a actualizar

| # | Documento | Acción | Precondición |
| :-: | --- | --- | :-: |
| **1** | **ADR-13 §10.3 V-2** | Declarar el criterio *(§3.1)* + registro en Historial | — |
| **2** | **ADS-02 §7** | Alinear con 1, o registrar por qué difiere | ⛔ Tras 1 |
| **3** | **COM-19 §9** | **Cerrar formalmente** | ⛔ Tras 1 |
| **4** | Suites de contrato de A-6 y A-11 | **Añadir prueba que discrimine el criterio** — hoy **ninguna lo hace** | ⛔ Tras 1 |
| **5** | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` | Confirmar o corregir | ⛔ Tras 1 |

> **Los puntos 4 y 5 son los únicos que tocan código, y están bloqueados. Este sprint no los ejecuta.**

---

# 7. Bloqueo B-5

| Campo | Valor |
| --- | --- |
| **Documento incompleto** | **ADR-13 §10.3, V-2** |
| **Qué falta** | El criterio de orden de vigencia |
| **Propietario** | **Architecture Team** *(define)* · **Product Office** *(aprueba)* |
| **Severidad** | 🔴 **Alta** — §5 impacto 1 |
| **Antigüedad** | Abierto desde el **Sprint 19** *(COM-19 §9)* |
| **Estado** | 🔴 **Abierto, con propietario y propuesta redactada** |

---

# 8. Referencias

**ADR-09 v1.3** §6 · **ADR-13 v1.2** §6.2, §10.1, §10.3 *(V-1 a V-5)*, §12.3 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADS-00 v1.3** R-4, R-5 · **ADS-02 v1.1** §3, §7 · **APS-04 v4.0** §A.5 · **APS-19 v1.1** §4.3, CE-4 · **PO-02 v1.3** §3 · **DDD-01 v1.1** §9.2 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-34/3** §4 · **COM-35/4** · **COM-36/4**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
