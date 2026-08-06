# COM-35 — Registro del Conflicto `issuedAt` vs `issue`

| Campo | Valor |
| --- | --- |
| Código | COM-35 / 4 |
| Clasificación | **Registro de conflicto** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Registrado y tipificado. NO resuelto** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-35, tarea 4 |
| Cuestión de origen | **COM-19 §9** — abierta desde el Sprint 19 · **COM-19 §10** hallazgo 2 |
| Relacionado | **COM-34/3 §4** *(donde se detectó)* · COM-22 §4.2 · COM-12 RC-4 |

> **Cero cambios de código. Ninguna decisión tomada.**
>
> **Este documento registra. No elige criterio, y explica en §6 por qué no puede.**

---

# 1. Reencuadre: dónde está realmente el defecto

**COM-34/3 §4 lo planteó como «ADS-02 §7 dice una cosa y el código hace otra».** Al ir a la fuente, el planteamiento cambia:

> ### **El defecto no está en ADS-02 ni en el código. Está en que la regla que ambos dicen cumplir no declara el criterio.**

**ADR-13 §10.3, V-2 — la autoridad:**

> *«Existe siempre una **versión vigente**, que es **la más reciente** y la que se presenta al usuario.»*

**«La más reciente» — ¿respecto de qué?** V-2 no lo dice. **Y V-3, que sí menciona la marca temporal, la exige como dato a conservar, no como criterio de orden:**

> **V-3:** *«Cada versión **conserva** su marca temporal y la ejecución de agente que la produjo (A-10).»*

**COM-19 §10, hallazgo 2, ya lo había dicho** —y sigue siendo la formulación exacta—:

> *«`findCurrentByMoment` promete «la más reciente (V-2)» **sin decir respecto de qué**: ¿mayor `issue` o mayor `issuedAt`? Con `issuedAt` de origen abierto *(RC-4)*, **conviene que el contrato lo fije**.»*

---

# 2. Las dos lecturas, y quién sostiene cada una

| | **Lectura T — marca temporal** | **Lectura I — número de emisión** |
| --- | --- | --- |
| **Criterio** | Mayor `issuedAt` | Mayor `issue` |
| **Quién la sostiene** | **ADS-02 §7** *(`Approved`)*: *«Versión vigente distinguible · §10.3 V-2 · **Marca temporal por emisión**; la vigente es la más reciente»* | **El código**: `inMemoryProposalAdapter.findCurrentByMoment` y `inMemoryBuyerDiagnosisAdapter`. Razonado en **COM-22 §4.2** |
| **Rango del documento** | ADS — *Documento de Implementación*, **«Gobernado por ADR-13»** | Artefacto de implementación. **No es documento** |
| **¿Deriva de V-2?** | ⚠️ **Lo completa.** V-2 no dice «marca temporal» | ⚠️ **Lo completa.** V-2 no dice «número de emisión» |

> ### **Ninguna de las dos contradice a ADR-13 V-2. Las dos rellenan el mismo hueco, de forma distinta.**
>
> **Por eso no es un conflicto de precedencia y ADS-00 R-4 no lo resuelve:** no hay dos documentos diciendo cosas incompatibles sobre la misma materia decidida. **Hay una materia sin decidir y dos rellenos.**

---

# 3. El argumento del código, transcrito

**No se transcribe para respaldarlo, sino porque el decisor debe tenerlo delante.** `inMemoryProposalAdapter.ts:70-78`:

> *«**No se ordena por `issuedAt`** y la razón es de garantías: `issue` es monótono creciente por `(Lead, momento)` —lo deriva el caso de uso del historial y V-1 · P-I2 aseguran que solo se añade—, mientras que la marca temporal es un valor de reloj **cuyo origen sigue abierto**. Ordenar por ella haría que «cuál es la vigente» dependiera de una cuestión sin decidir.»*

**Los dos hechos que invoca son verificables:**

| Hecho | Verificación |
| --- | :-: |
| **`issue` forma parte de la identidad de A-6** — `(Lead, momento, número de emisión)` | ✅ **ADR-16 §4.4** |
| **El origen de `issuedAt` está sin decidir** | ✅ **COM-12 RC-4**, abierta |

> ⚠️ **Y hay una asimetría que conviene registrar: `issue` es identidad; `issuedAt` es atributo.** Ordenar por un atributo cuyo productor no se ha decidido hace que la vigencia dependa de esa decisión pendiente. **Es una observación, no una resolución.**

---

# 4. Alcance real — no es solo A-6

**ADR-13 §10.3 versiona cuatro activos, y V-2 les aplica a los cuatro por igual.**

| Activo | ¿Implementado? | Criterio en código |
| --- | :-: | --- |
| **A-6** Propuesta | ✅ | **Mayor `issue`** |
| **A-11** Diagnóstico Comercial | ✅ | **Mayor `issue`** |
| **A-4** Análisis | ❌ Sin adapter versionado | — |
| **A-5** Opportunity Score | ⚠️ `inMemoryLeadAnalysisAdapter` | **No auditado en este sprint** |

> **La ambigüedad de V-2 es sistémica, no de la Propuesta.** Los dos activos implementados eligieron la Lectura I **de forma consistente**, sin documento que lo mandara. **A-4 y A-5 llegarán a la misma bifurcación** y no hay nada que garantice que elijan igual.

---

# 5. Impacto si el conflicto no se resuelve

| # | Impacto | Severidad |
| :-: | --- | :-: |
| **1** | **El motor real puede implementar la Lectura T** —ADS-02 es su documento de referencia y dice «marca temporal»— **mientras el dominio asume la Lectura I**. Al sustituir el adapter, *«cuál es la propuesta vigente»* **cambiaría sin que ninguna prueba lo detectara**: las suites de contrato actuales verifican el adapter en memoria | 🔴 **Alta** |
| **2** | **Dos emisiones con la misma marca temporal** —posible: el reloj tiene resolución finita y `issuedAt` se asigna al emitir— **dejan la vigencia indeterminada bajo la Lectura T** | 🟡 Media |
| **3** | **A-4 y A-5 eligen criterio distinto** al llegar su implementación *(§4)* | 🟡 Media |
| **4** | **Se resuelve RC-4 fijando un productor de `issuedAt` sin advertir que decide también la vigencia** bajo la Lectura T | 🟡 Media |

> **El impacto 1 es el que hace que esto no pueda quedar abierto indefinidamente.** Es un cambio de comportamiento observable por el usuario —qué propuesta ve— que se activaría al cambiar de adapter, que es precisamente el cambio que **ADR-09 §6** promete que *«ninguna otra capa se entera»*.

---

# 6. Por qué este documento no elige

**Tres razones, y las tres son de gobernanza:**

| # | Razón |
| :-: | --- |
| **1** | **La materia es de ADR-13.** **DDD-01 §9.2**: *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»*. Cuál es la versión vigente es semántica de persistencia |
| **2** | **Elegir criterio no es corregir una contradicción: es completar una regla.** No hay documento defectuoso que la jerarquía identifique — hay una regla incompleta. **ADS-00 R-5** solo autoriza a *«aplicar esta jerarquía para determinar qué documento debe corregirse»*, y aquí la jerarquía señala a ADR-13 **como autor**, no como defectuoso |
| **3** | **El Sprint COM-35 lo excluye expresamente:** *«No resolver contradicciones por inferencia»* y *«No implementar»* |

---

# 7. Qué se pide

| # | Acción | Quién | Nota |
| :-: | --- | --- | --- |
| **1** | **Completar ADR-13 §10.3 V-2** declarando el criterio de vigencia — **por identidad de emisión o por marca temporal**— y si aplica igual a los cuatro activos versionados | **Architecture Team** | Es la decisión de fondo. **Todo lo demás se deriva** |
| **2** | **Alinear ADS-02 §7** con lo decidido en 1, o registrar por qué difiere | **Architecture Team** | ADS-02 declara estar *«Gobernado por ADR-13»* |
| **3** | **Cerrar formalmente COM-19 §9**, abierta desde el Sprint 19 | **Architecture Team** | Es literalmente esta pregunta |
| **4** | **Solo después:** confirmar o corregir el código, y **añadir a las suites de contrato una prueba que discrimine el criterio** — hoy ninguna lo hace | **Ingeniería** | ⛔ Bloqueado por 1 |

> **El punto 4 es lo único que toca código, y está bloqueado.** Ninguna de las tres primeras lo requiere.

## 7.1 Lo que Ingeniería recomienda tener en cuenta, sin decidir

- **Si se elige la Lectura I**, el código actual queda confirmado y **ADS-02 §7 debe corregirse**.
- **Si se elige la Lectura T**, hay que **resolver antes COM-12 RC-4** —origen de `issuedAt`—, porque la vigencia pasaría a depender de una cuestión abierta, y hay que **decidir el desempate** entre marcas iguales *(§5, impacto 2)*.
- **En ambos casos**, la decisión debería enunciarse **para los cuatro activos versionados**, no solo para A-6 *(§4)*.

---

# 8. Lo que este documento **no** hace

- ❌ **No elige criterio.**
- ❌ **No modifica ADR-13, ADS-02 ni ningún COM anterior.**
- ❌ **No cambia código.** El adapter sigue ordenando por `issue`.
- ❌ **No declara defectuoso a ADS-02 §7.** Completó un hueco; que lo hiciera de forma distinta al código es el hallazgo, no una infracción.
- ❌ **No cierra COM-19 §9.**
- ❌ **No audita A-4 ni A-5** *(§4)*.

---

# 9. Referencias

**ADR-09 v1.3** §6 · **ADR-13 v1.2** §10.3 *(V-1 a V-5)*, §12.3 · **ADR-16 v1.1** §4.4 *(P-I2)* · **ADS-00 v1.3** R-4, R-5 · **ADS-02 v1.1** §7 · **DDD-01 v1.1** §9.2 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-34/3** §4.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
