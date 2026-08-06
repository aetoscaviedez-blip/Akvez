# COM-48 — Registro de Cierre de COM-19 §9, riesgo 2

| Campo | Valor |
| --- | --- |
| Código | COM-48 / 1 |
| Clasificación | **Registro de cierre** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | ✅ **Riesgo 2 CERRADO** · **§9 sigue abierto en cinco riesgos** |
| Fecha | 2026-08-04 |
| Objeto | **COM-19 §9** — *Riesgos residuales del contrato* |
| Antecedentes | COM-19 *(Sprint 19)* · COM-22 §4.2 · COM-23 §7 · COM-37/2 · COM-38/3 · COM-45/1 · **COM-46** · **COM-47** |

> **Ningún documento modificado por este registro. No se inventa ninguna decisión.**

---

# 1. ⚠️ Precisión sobre el objeto del cierre

**Los sprints anteriores han escrito reiteradamente *«cerrar COM-19 §9»*. Es impreciso, y conviene corregirlo antes de registrar nada.**

> ### **COM-19 §9 se titula *«Riesgos residuales del contrato»* y contiene OCHO riesgos. La cuestión del criterio de vigencia es el riesgo 2, no la sección.**

**Texto literal del riesgo 2:**

> | **2** | **Vigencia sin criterio declarado** | 🟡 Media | `findCurrentByMoment` promete *«la más reciente (V-2)»* **sin decir respecto de qué**: ¿mayor `issue` o mayor `issuedAt`? Con `issuedAt` de origen abierto *(RC-4)*, **conviene que el contrato lo fije** |

**Lo que se cierra aquí es ese riesgo. §9 permanece abierto** *(§5)*.

---

# 2. Qué decisión fue tomada

> ## **La versión vigente es la de mayor número de emisión. La marca temporal no la determina.**

**Instrumento:** **ADR-13 v1.3**, Cambio B — aprobada el 2026-08-04 y **aplicada al Blueprint en COM-46**.

**Texto vigente en `docs/blueprint/ADR/ADR-13`, §10.3, regla V-2:**

> *«Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión (`issue`) dentro de su clave de identidad.** El número de emisión **forma parte de la identidad del agregado** (ADR-16 §4.2, §4.4) y es **monótono creciente por V-1**. **`issuedAt` es metadato temporal y NO determina la vigencia.** Aplica a los cuatro activos versionados de esta sección.»*

## 2.1 Quién la tomó

| Rol | Actor | Acto |
| --- | --- | --- |
| **Autoridad de la materia** | **ADR-13** | *«Qué se persiste, cuándo y con qué semántica»* — **DDD-01 §9.2** |
| **Aprobación** | **AKVEZ Architecture Team** | 2026-08-04 |
| **Aplicación al Blueprint** | Sprint **COM-46** | 2026-08-04 |

---

# 3. Evidencia

| # | Evidencia | Ubicación | Verificado |
| :-: | --- | --- | :-: |
| **1** | **La regla existe en el Blueprint**, no en una enmienda pendiente | `docs/blueprint/ADR/ADR-13` §10.3 V-2 — **v1.3** | ✅ COM-46 §2 |
| **2** | **El texto anterior ya no existe** — *«la más reciente y la que se presenta»*: 0 ocurrencias | ídem | ✅ COM-46 §2 |
| **3** | **El Historial registra la enmienda** con descripción y motivo | ADR-13, fila **v1.3** | ✅ COM-46 §1.1 |
| **4** | **El catálogo refleja la versión** | `docs/blueprint/INDEX.md` — ADR-13 **1.3** | ✅ COM-46 §1.1 |
| **5** | **ADS-02 §7 ya no contradice la regla** | ADS-02 **v1.2**, fila de vigencia | ✅ COM-47 §1.1 |
| **6** | **`issuedAt` queda declarado metadato** en fila propia bajo V-3 | ADS-02 v1.2 §7 | ✅ COM-47 §1.1 |
| **7** | **El código ya era conforme**: los tres adapters versionados ordenan por número de emisión; **ninguno por marca temporal** | `inMemoryProposalAdapter` · `inMemoryBuyerDiagnosisAdapter` · `inMemoryLeadAnalysisAdapter` | ✅ **COM-43 §5.2** |

## 3.1 Trazabilidad de la resolución

| Sprint | Aportación |
| :-: | --- |
| **COM-19** | **Plantea el riesgo.** *«sin decir respecto de qué»* |
| **COM-22 §4.2** | Deriva el criterio para el adapter de A-6 y lo razona |
| **COM-23 §7** | Lo declara *«resuelto por derivación»* — ⚠️ **por el código, sin autoridad documental** |
| **COM-37/2 · COM-38/3** | Localizan la autoridad: **ADR-13 §10.3**, y constatan que **V-2 estaba incompleta** |
| **COM-44/1 · COM-45/1** | Determinan que el criterio debe enunciarse **por concepto** y que **no hay bloqueo para aplicar** |
| **COM-46** | ✅ **Aplica V-2 al Blueprint** |
| **COM-47** | ✅ **Sincroniza ADS-02 §7** |

> ⚠️ **COM-23 §7 lo dio por «resuelto» en su momento, y no lo estaba.** Lo resuelto era la implementación; **la regla no existía en ningún documento**. **Es exactamente la diferencia que este registro deja asentada.**

---

# 4. Qué documento registra el cierre

| Candidato | ¿Es el registro? | Motivo |
| --- | :-: | --- |
| **ADR-13 §10.3 V-2** | ✅ **SÍ — es la decisión misma** | Contiene la regla. **Autoridad: DDD-01 §9.2** |
| **ADR-13, Historial v1.3** | ✅ **SÍ — es el registro formal del acto** | Cita **COM-19 §9** como origen de la ambigüedad, con fecha y motivo |
| ADS-02 v1.2 §7 | ⬜ Refleja, no decide | *«Si este documento y un ADR discrepan, prevalece el ADR»* |
| **Este documento** | ⬜ **Constancia, sin autoridad** | Fuera de la Clasificación Oficial de ADS-00 |

> ### **El cierre ya está registrado donde corresponde: en el Historial de Versiones de ADR-13, fila v1.3**, cuyo motivo dice literalmente:
>
> *«§10.3 V-2 prometía «la más reciente» **sin declarar respecto de qué**, ambigüedad abierta desde **COM-19 §9** *(Sprint 19)*…»*
>
> **No hace falta ningún acto adicional.** Este documento es constancia, no instrumento.

---

# 5. ⚠️ Qué NO se cierra — §9 sigue abierto

**De los ocho riesgos de COM-19 §9:**

| # | Riesgo | Estado | Nota |
| :-: | --- | :-: | --- |
| **1** | **RC-5** — trazabilidad perdida | 🟢 **Resuelto técnicamente** | Decidido en COM-20, formalizado en COM-21, implementado y verificado. **COM-23 §7: *«un pronunciamiento; técnicamente no queda nada pendiente»*** |
| **2** | **Vigencia sin criterio declarado** | ✅ **CERRADO** | **Este documento** |
| **3** | **F-2** — unicidad de `(leadId, moment, issue)` | 🔴 **Abierto** | **Capa A.2 cerrada** por G-8/G-9/G-10 en ADR-13 v1.3. **Capas B y C siguen abiertas** |
| **4** | **F-9** — `createdAt` no observable | 🟡 Abierto | Ingeniería |
| **5** | **F-3** — `userId` placeholder | 🟡 Abierto | Ingeniería |
| **6** | **Dos repositorios sobre A-6** | 🟡 Abierto | Requiere **enmienda de ADR-08 §13** *(COM-34 §6.1)* |
| **7** | **Referencia al diagnóstico ausente** | 🟡 Abierto | COM-19 §7.3 · COM-16 §8.1 |
| **8** | **`issuedAt` persistido no cabe en la entidad** | 🟢 Baja, abierto | Ligado a `COM-12 RC-4` |

> ### **Uno cerrado de ocho. Escribir *«COM-19 §9 cerrado»* sería falso.**
>
> **El riesgo 1 está a un pronunciamiento de cerrarse** — técnicamente no queda nada pendiente desde el Sprint 15.

---

# 6. Efecto colateral — `COM-12 RC-4`

**El riesgo 2 citaba `issuedAt` *«de origen abierto (RC-4)»* como parte del problema.**

> **Con V-2 aplicada, RC-4 deja de ser bloqueante para la vigencia.** Decidir quién produce `issuedAt` **ya no altera qué versión es la vigente**.
>
> **RC-4 sigue abierta** —el origen de `issuedAt` no está decidido—, pero **su alcance se reduce**: pasa de afectar a la semántica de lectura a afectar solo a la trazabilidad temporal.

---

# 7. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **COM-19 §9, riesgo 2, queda CERRADO** |
| **2** | **La decisión es ADR-13 §10.3 V-2**, vigente en el Blueprint desde COM-46 |
| **3** | **El registro formal está en el Historial de ADR-13, fila v1.3**, que cita COM-19 §9 como origen |
| **4** | **No hace falta ningún acto adicional** para el cierre |
| **5** | ⚠️ **§9 permanece abierto en cinco riesgos** y uno pendiente de pronunciamiento |
| **6** | **`COM-12 RC-4` reduce su alcance**, sin cerrarse |

---

# 8. Referencias

**ADR-12 v1.1** §12.1 · **ADR-13 v1.3** §10.3 *(V-1, V-2, V-3)*, §12.3, *Historial* · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1 · **ADS-02 v1.2** §7 · **DDD-01 v1.1** §9.2 · **`docs/blueprint/INDEX.md`** · **COM-12** RC-4 · **COM-16** §8.1 · **COM-19** §7.3, §9, §10 · **COM-20** · **COM-21** · **COM-22** §4.2 · **COM-23** §7 · **COM-34** §6.1 · **COM-37/2** · **COM-38/3** · **COM-43** §5.2 · **COM-44/1** · **COM-45/1** · **COM-46** · **COM-47**.
