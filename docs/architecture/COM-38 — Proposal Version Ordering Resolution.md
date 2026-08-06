# COM-38 — Resolución del Ordenamiento de Versiones

| Campo | Valor |
| --- | --- |
| Código | COM-38 / 3 |
| Clasificación | **Asignación de propiedad + propuesta de criterio** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propietario definido.** Criterio **propuesto, NO aprobado** |
| Fecha | 2026-08-04 |
| Bloqueo | **B-5** — abierto |
| Antecedentes | COM-19 §9 *(Sprint 19)* · COM-34/3 §4 · COM-35/4 · COM-36/4 · COM-37/2 |

> **Cero cambios de código.** El adapter sigue ordenando por `issue`, **y este documento no convierte eso en regla**.

---

# 1. ¿Cuál documento tiene autoridad?

> ## **`ADR-13 §10.3`.**

**Fundamento — DDD-01 §9.2**, tabla de autoridad por concepto:

| Concepto | Autoridad única |
| --- | --- |
| **Qué se persiste, cuándo y con qué semántica** | **ADR-13** |

**Cuál es la versión vigente de un activo versionado es semántica de persistencia.**

## 1.1 Quién NO tiene autoridad sobre esto

| Candidato | Por qué no |
| --- | --- |
| **ADS-02 §7** | Documento de implementación, cabecera *«**Gobernado por ADR-13**»*. **Completa** V-2 con «marca temporal»; no la decide |
| **El código** *(`inMemoryProposalAdapter`)* | **No es documento.** Un adapter no decide semántica de persistencia |
| **ARCH-01** | *«**No es autoridad: es un mapa físico**… ante discrepancia prevalece el ADR»* — **ADS-01 §3.1** |
| **Cualquier documento COM** | Fuera de la Clasificación Oficial de ADS-00 |

## 1.2 ⚠️ Y ADR-13 §10.3 está incompleta

| Regla | Enunciado |
| --- | --- |
| **V-1** | *«Cada emisión nueva **añade** una versión. Ninguna retira la anterior»* |
| **V-2** | *«Existe siempre una **versión vigente**, que es **la más reciente** y la que se presenta al usuario»* |
| **V-3** | *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10)»* |

> ### **V-2 dice «la más reciente» y no dice respecto de qué. V-3 no lo suple: exige *conservar* la marca temporal como dato, no *ordenar* por ella.**

**Búsqueda exhaustiva de un criterio en otra parte — sin resultado:**

| Fuente | Resultado |
| --- | --- |
| **PO-02 §3** | *«Regenerar **añade**… nunca sustituye»*. **Nada sobre cuál es la vigente** |
| **ADR-16 §4.2 · §4.4** | `número de emisión` aparece **como identidad**, no como criterio de orden |
| **APS-04 §A.5 (P-10)** | *Generar · Regenerar*. Nada sobre selección de versión |
| **APS-19 §4.3 · CE-4** | *«Prevalece la manifestación»* — **precedencia semántica, no orden temporal** |
| **ADR-13 §12.3** | Siete garantías, **todas del Lead** |

---

# 2. ¿Quién es propietario de la decisión?

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Define el criterio** | **AKVEZ Architecture Team** | `Responsable` de ADR-13 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADR-13 v1.2 en GOV-01 |
| **Refleja en el motor** | **Architecture Team**, en **ADS-02 §7** | *«Gobernado por ADR-13»* |
| **Implementa y prueba** | **Ingeniería** | ⛔ **Bloqueada** por lo anterior |

> ✅ **Criterio de aceptación cumplido: el versionado tiene propietario definido.**

---

# 3. ¿Qué activos usan versionado?

**ADR-13 §10.3:** *«Se versionan **cuatro** activos: Análisis (A-4), Opportunity Score (A-5), Propuesta (A-6) y Diagnóstico Comercial (A-11).»*

| Activo | Versionado | Implementado | Criterio en código |
| --- | :-: | :-: | --- |
| **A-4** Análisis | ✅ | ❌ sin adapter versionado | — |
| **A-5** Opportunity Score | ✅ | ⚠️ `inMemoryLeadAnalysisAdapter` | **No auditado** |
| **A-6** Propuesta | ✅ | ✅ | **Mayor `issue`** |
| **A-11** Diagnóstico Comercial | ✅ | ✅ | **Mayor `issue`** |

---

# 4. ¿Qué activos NO usan versionado?

| Activo | Semántica | Fundamento |
| --- | --- | --- |
| **A-12** Secuencia Comercial | **Actualizable** | **ADR-13 §6.2 y §10.3** |
| **A-1, A-2, A-3, A-7, A-9** | Registro / actualización | ADR-13 §6.2, §10.1 |
| **A-8** Historial · **A-10** Ejecuciones | **Solo crecen** | ADR-13 §6.2 · G-5 |

---

# 5. Separación por activo

## 5.1 A-6 — Propuesta comercial · ✅ **alcanzado por V-2**

| | |
| --- | --- |
| **Identidad** | `(Lead, momento de la secuencia, número de emisión)` — ADR-16 §4.4 |
| **Operación afectada** | `ProposalRepository.findCurrentByMoment` — *«la emisión **vigente** de un momento concreto»* |
| **Criterio en código** | **Mayor `issue`**, **no** por `issuedAt` |
| **Impacto** | **Directo.** Es el caso que originó **COM-19 §9** |

## 5.2 ⚠️ A-11 — **Diagnóstico Comercial**, no «Evidence» · ✅ **alcanzado por V-2**

> **Precisión sobre el encargo: A-11 es el `BuyerDiagnosis` — el Diagnóstico Comercial.** *(ADR-13 §6.2 · ADR-16 §4.2 · DDD-01 §2.1.)*
>
> **La evidencia no es un activo.** *«La lista cerrada de hechos afirmables»* es **contenido de A-6** *(ADR-16 §4.4)* y de la estrategia que A-12 conserva por contacto. **DDD-01 §4.2:** *«se construye por emisión; no persiste aparte»*. **No tiene versionado propio porque no tiene existencia propia.**

| | |
| --- | --- |
| **Identidad** | `(Lead, número de emisión)` — ADR-16 §4.2 |
| **Criterio en código** | **Mayor `issue`** — `inMemoryBuyerDiagnosisAdapter` |
| **Impacto** | **Directo. Y hoy no consta en ninguna deuda registrada**: es el segundo activo que eligió criterio sin documento |

## 5.3 ⚠️ A-12 — Secuencia Comercial · ❌ **NO alcanzado por V-2**

> ### **A-12 no se versiona. V-2 no le aplica.**
>
> **ADR-13 §6.2:** *«**Actualizable**, no versionado»*.
>
> **ADR-13 §10.3:** *«**La Secuencia Comercial (A-12) no se versiona.** Se actualiza. Es la única de las dos incorporaciones de §6.2 que **no entra aquí**, y la razón es de volumen: su estado cambia con cada contacto y **A-8 ya conserva íntegro el rastro de esos cambios**.»*

**El código lo respeta:** `CommercialSequenceRepository` expone **`save` y `update`**, no versiones. `update` conserva identidad y fecha de creación, y **no admite selección de vigencia**.

> **Aplicarle V-2 sería *«imponer a uno la semántica del otro»*** — exactamente lo que ADR-13 §6.2 razona al separar A-11 de A-12.
>
> ⚠️ **No confundir `currentMoment` con «versión vigente».** El «momento vigente» de A-12 es el contacto en curso dentro del plan; **nada tiene que ver con V-2**.

## 5.4 Futuros activos versionados — el riesgo real

> **La ambigüedad de V-2 es sistémica, no de la Propuesta.** **A-6 y A-11 eligieron la misma lectura de forma consistente y sin documento que lo mandara.** **A-4 y A-5 llegarán a la misma bifurcación**, y **nada garantiza que elijan igual.**

---

# 6. Criterio propuesto — **propuesta, no norma**

## 6.1 Enmienda propuesta a ADR-13 §10.3 V-2

| | Texto |
| --- | --- |
| **Hoy** | **V-2** — *«Existe siempre una **versión vigente**, que es la más reciente y la que se presenta al usuario»* |
| **Propuesto** | **V-2** — *«Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión dentro de su clave de identidad**, no la de marca temporal más reciente: el número de emisión **forma parte de la identidad del agregado** *(ADR-16 §4.2, §4.4)* y es **monótono creciente por V-1**, mientras que la marca temporal es un atributo cuyo productor no está decidido *(COM-12 RC-4)*. **Aplica a los cuatro activos versionados de esta sección.»*** |

## 6.2 Fundamento

| # | Razón | Verificable en |
| :-: | --- | --- |
| **1** | **`issue` es identidad; `issuedAt` es atributo.** Ordenar por identidad no depende de ninguna decisión pendiente | ADR-16 §4.2, §4.4 |
| **2** | **V-1 garantiza monotonía.** La marca temporal no tiene garantía equivalente | ADR-13 §10.3 V-1 |
| **3** | **No tiene el modo de fallo de marcas empatadas** — el reloj tiene resolución finita | §7 |
| **4** | Es lo que los dos activos implementados ya hacen | Código |

> ⚠️ **La razón 4 va al final deliberadamente. Es corroboración, no fundamento.** **Si el Architecture Team elige la marca temporal, el código debe cambiar** — y esta propuesta no se opone.

## 6.3 Si se eligiera la marca temporal

1. **Cerrar `COM-12 RC-4`** —origen de `issuedAt`—, o la vigencia dependería de una cuestión abierta.
2. **Decidir el desempate** entre marcas iguales.

---

# 7. Impacto de no decidir

| # | Impacto | Severidad |
| :-: | --- | :-: |
| **1** | **El motor real puede implementar la marca temporal** —ADS-02 §7 es su documento de referencia— **mientras el dominio asume `issue`**. Al sustituir el adapter, **cuál es la propuesta vigente cambiaría sin que ninguna prueba lo detectara** | 🔴 **Alta** |
| **2** | **Dos emisiones con la misma marca temporal** dejan la vigencia **indeterminada**. `issue` no tiene ese modo de fallo | 🟡 Media |
| **3** | **A-4 y A-5 eligen criterio distinto** al implementarse | 🟡 Media |
| **4** | **Se cierra `COM-12 RC-4`** sin advertir que decide también la vigencia | 🟡 Media |

> **El impacto 1 es el decisivo:** cambio **observable por el usuario** que se activaría al cambiar de adapter — **precisamente el cambio que ADR-09 §6 promete que «ninguna otra capa se entera»**.

---

# 8. Documentos a actualizar

| # | Documento | Acción | Precondición |
| :-: | --- | --- | :-: |
| **1** | **ADR-13 §10.3 V-2** | Declarar el criterio *(§6.1)* + registro | — |
| **2** | **ADS-02 §7** | Alinear con 1, o registrar por qué difiere | ⛔ Tras 1 |
| **3** | **COM-19 §9** | **Cerrar formalmente** | ⛔ Tras 1 |
| **4** | Suites de contrato de A-6 y A-11 | **Prueba que discrimine el criterio** — hoy ninguna lo hace | ⛔ Tras 1 |
| **5** | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` | Confirmar o corregir | ⛔ Tras 1 |

> **4 y 5 tocan código y están bloqueados. Este sprint no los ejecuta.**

---

# 9. Ficha del bloqueo B-5

| Campo | Valor |
| --- | --- |
| **Documento incompleto** | **ADR-13 §10.3, V-2** |
| **Qué falta** | El criterio de orden de vigencia |
| **Propietario** | **Architecture Team** *(define)* · **Product Office** *(aprueba)* |
| **Severidad** | 🔴 **Alta** |
| **Antigüedad** | Abierto desde el **Sprint 19** *(COM-19 §9)* |
| **Estado** | 🔴 **Abierto, con propietario y enmienda redactada** |

---

# 10. Referencias

**ADR-09 v1.3** §6 · **ADR-13 v1.2** §6.2, §10.1, §10.3, §12.3 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADS-00 v1.3** R-4, R-5 · **ADS-01 v1.4** §3.1, §3.2 · **ADS-02 v1.1** §3, §7 · **APS-04 v4.0** §A.5 · **APS-19 v1.1** §4.3, CE-4 · **PO-02 v1.3** §3 · **ARCH-01 v1.3** · **DDD-01 v1.1** §2.1, §4.2, §9.2 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-35/4** · **COM-36/4** · **COM-37/2**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
