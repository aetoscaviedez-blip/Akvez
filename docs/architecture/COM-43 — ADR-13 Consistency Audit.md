# COM-43 — Auditoría de Consistencia de ADR-13

| Campo | Valor |
| --- | --- |
| Código | COM-43 |
| Clasificación | **Auditoría de consistencia documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Auditoría cerrada.** Cero cambios · **7 hallazgos** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-43 — previo a la aplicación de **ADR-13 v1.3** |
| Antecedentes | COM-36/1 · COM-42/A · COM-42/C |

> **`docs/blueprint/` intacto. Cero cambios de código. Ningún ADR aplicado, ningún documento aprobado.**
>
> **Ninguna conclusión de este documento depende de interpretación.** Donde la autoridad no alcanza, se clasifica como **Ambigüedad** o **Falta de autoridad** y **se detiene la decisión**.

---

# 1. Alcance

| Incluye | Excluye |
| --- | --- |
| **Las once filas de ADR-13 §6.2** no auditadas *(A-6 se auditó en COM-36/1)* | Aplicar cualquier corrección |
| **Todos los activos versionados** y sus adapters, contra **V-2** y **V-3** | Modificar código |
| Contraste con **ADS-02**, **DDD-01**, **PO-01/PO-02**, **ADR-05/12/14/16** | Aprobar documentos |

---

# 2. Documentos revisados

**ADR-13 v1.2** §6.2, §10.1, §10.3, §12.1, §12.3, §13.1 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-05 v1.4** §7 D3, §14 · **ADR-12 v1.1** §12.1 · **ADR-14 v1.2** R-VIN · **ADR-16 v1.1** §4.2 a §4.5 · **PO-01 v1.2** §5, §8 · **PO-02 v1.3** §5, §5.1 · **DDD-01 v1.1** §2.1, §8, §9.2 · **ADS-02 v1.1** §3, §7 · **DEV-00** R-34, R-38, R-45 · **AR-05** §5.1 · **APS-08** §6, §9.

**Código auditado:** `contracts/` *(Lead, LeadAnalysis, ContactEvent, User, Proposal, BuyerDiagnosis, CommercialSequence)* · `repositories/` *(ocho)* · `adapters/` *(cinco en memoria)*.

---

# 3. Tarea 1 — Inventario de ADR-13 §6.2, once filas

## 3.1 Tabla de clasificación

| Activo | Concepto | Autoridad del concepto | Persistencia | Clasificación |
| :-: | --- | --- | :-: | :-: |
| **A-1** | Identidad del Lead | **ADR-12 §7.2** *(DDD-01 §9.2)* | `Lead` | ✅ **Conforme** |
| **A-2** | Atributos de la Empresa | **PO-01** *(DDD-01 §9.2)* | `Lead` | ✅ **Conforme** |
| **A-3** | Estadio del ciclo de vida | **PO-02 §5.1** *(DDD-01 §9.2)* | `Lead` | ⚠️ **H-1 Ambigüedad** + 🔴 **H-2 divergencia de código** *(ya registrada)* |
| **A-4** | Análisis | PO-01 · APS-07 | `LeadAnalysis` *(fusionado)* | ⚠️ **H-3 Ambigüedad** |
| **A-5** | Opportunity Score | **PO-01 §5** *(DDD-01 §9.2)* | `LeadAnalysis` *(fusionado)* | 🔴 **H-4 Divergencia** + ⚠️ **H-3** |
| **A-7** | Decisiones del usuario | PO-01 §8 · ADR-13 E-6 | `ContactEvent` *(parcial)* | ⚠️ **H-5 Falta de autoridad** |
| **A-8** | Historial del Lead | ADR-12 §12.1 E-5 · ADR-13 G-5 | ❌ **Ninguna** | ⚠️ **H-5 Falta de autoridad** |
| **A-9** | Usuario y perfil profesional | ADR-05 §14 · APS-08 §6.6 | `User` *(sin repositorio)* | ⚠️ **H-5 Falta de autoridad** |
| **A-10** | Ejecuciones de agente | ADR-05 §10 · APS-07 §5 | ❌ **Ninguna** | ⚠️ **H-5 Falta de autoridad** |
| **A-11** | Diagnóstico Comercial | **ADR-16 §4.2** *(DDD-01 §9.2)* | `BuyerDiagnosis` | ✅ **Conforme** |
| **A-12** | Secuencia Comercial | **ADR-16 §4.3** *(DDD-01 §9.2)* | `CommercialSequence` | ✅ **Conforme** |

**Resumen:** **4 conformes · 2 divergencias · 5 ambigüedades / falta de autoridad.**

---

# 4. Hallazgos

## 4.1 ⚠️ H-1 — A-3: vocabulario de estadios *(Ambigüedad pendiente)*

| Fuente | Qué declara |
| --- | --- |
| **ADR-13 §6.2, A-3** | *«Lead · **Analizado** · **Evaluado** · **Contactado**»* |
| **DDD-01 §8** *(glosario **ratificado**)* | *«Cuatro valores: **`Lead · Analyzed · Scored · Contacted`**»* — autoridad **PO-02 §5.1 · PO-01 §8** |

**Los cuatro conceptos coinciden uno a uno.** La diferencia es de **idioma**, no de semántica.

> ### **Por qué NO se clasifica como divergencia:**
>
> **DDD-01 §8 enumera nueve sinónimos prohibidos** —*Buying Stage · Contact Stage · Contact Status · Prospect · Audited · Pitched · Replied · Won · Stale*—. **Las formas castellanas «Analizado», «Evaluado» y «Contactado» NO figuran en esa lista.**
>
> **DDD-01 fue ratificado como *«vocabulario obligatorio de todo documento, código y conversación»***, lo que **podría** alcanzar a las formas castellanas. **Podría, y no consta.**
>
> **No existe autoridad que resuelva si la ratificación impone la forma inglesa o solo prohíbe los nueve sinónimos listados. Se registra y se detiene.**

**Propietario:** **AKVEZ Product Office** — es quien ratificó DDD-01 §8 y quien decide PO-02 §5.1.

## 4.2 🔴 H-2 — A-3: el código declara los seis valores derogados *(ya registrada)*

**`shared/persistence/contracts/Lead.ts:7`:**

```ts
export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';
```

> **Son exactamente los seis que DDD-01 §8 declara prohibidos y que PO-02 §5.1 retiró.** Ninguno de los cuatro oficiales aparece.

**No es hallazgo nuevo.** Está registrado como **desviación A-01** en **AR-05 §5.1**:

> *«**La desviación documental está cerrada; la deuda de código, no.** `LeadStatus` sigue declarando los seis valores derogados. **El cierre de A-01 es precisamente lo que hace exigible su corrección**, que corresponde al primer sprint de implementación» (PO-02 §12.2)*.

**Propietario:** **Ingeniería**, con autorización específica.
⚠️ **Tocarlo alcanza a `RegisterContact` y a CE-I1** — exige alcance propio, no puede colarse en un sprint de auditoría.

## 4.3 ⚠️ H-3 — A-4 y A-5 fusionados en un solo contrato *(Ambigüedad pendiente)*

**ADR-13 §6.2 los declara como dos activos distintos, ambos versionados:**

| Activo | Contenido declarado |
| --- | --- |
| **A-4** | Diagnóstico de presencia digital · carencias · oportunidades |
| **A-5** | Puntuación · banda · explicación |

**El código tiene uno solo:** `LeadAnalysisRepository` sobre el contrato `LeadAnalysis`, que **contiene ambos**:

| Campos de A-4 | Campos de A-5 |
| --- | --- |
| `description` · `flaws` · `angle` · `revenueLoss` · `whyWebsiteNeeded` · `hasWebsite` | `score` · `classification` · `scoreVersion` · `band` · `breakdown` · `confidence` · `coverage` · `userProfile` · `calculatedAt` |

**Consecuencia:** **un único contador `emission` versiona los dos activos a la vez.** A-4 **no tiene versionado independiente**.

> ### **Por qué NO se clasifica como divergencia:**
>
> **Ningún documento exige que A-4 y A-5 tengan repositorios separados**, y ninguno autoriza fusionarlos.
>
> **Existe precedente de la pregunta, y se resolvió en sentido contrario para otro par:** ADR-13 §6.2 razona expresamente que **A-11 y A-12 son *«dos activos y no uno»* porque necesitan *«semánticas de escritura distintas»***. **A-4 y A-5 comparten semántica —ambos versionados—, de modo que ese argumento no los separa… ni los une.**
>
> **La cuestión no se ha planteado nunca. Se registra y se detiene.**

**Propietario:** **AKVEZ Architecture Team** — `Responsable` de ADR-13.

## 4.4 🔴 H-4 — A-5: el contenido declarado omite lo que V-4 exige conservar

**Es una inconsistencia interna de ADR-13: §6.2 contra §10.3.**

| Fuente | Qué declara sobre A-5 |
| --- | --- |
| **ADR-13 §6.2** | *«**Puntuación · banda · explicación**»* |
| **ADR-13 §10.3 V-4** | *«El Opportunity Score conserva **el perfil de usuario con el que se calculó**, sin el cual la puntuación **no es interpretable a posteriori**»* |
| **DEV-00 R-34** | *«Cada emisión de Score conserva **el perfil de usuario y la versión de Perfil de Ponderación** con que se calculó»* — origen: **ADR-13 §10.3 V-4 · ADR-14 R-VIN** |

> ### **§6.2 omite dos elementos que el propio ADR-13 exige conservar en §10.3.**

**El código sí los conserva** — `contracts/LeadAnalysis.ts` declara `userProfile`, `scoreVersion`, `breakdown`, `confidence`, `coverage` y `calculatedAt`, con la nota: *«**AMPLIADO EN DEV-04** — se incorporan los campos que **DEV-00 R-34** exige»*.

**Y la asimetría lo confirma:** la fila de **A-11 SÍ incluye** *«la **versión del criterio comercial**»* en su columna de contenido. **A-5 no incluye su equivalente.**

> ### **Es la misma clase de defecto que COM-36/1 confirmó en A-6:** la columna «Contenido» de §6.2 **describe el activo por debajo de lo que sus propias reglas exigen**.

**Clasificación: 🔴 Divergencia documental confirmada.** La autoridad que la resuelve —**ADR-13 §10.3 V-4**— está **dentro del mismo documento**, de modo que no hay conflicto de precedencia: **§6.2 es la celda defectuosa**.

**Propietario:** **AKVEZ Architecture Team**.

## 4.5 ⚠️ H-5 — Cuatro activos sin cobertura de persistencia *(Falta de autoridad)*

| Activo | Contrato | Repositorio | Adapter |
| :-: | :-: | :-: | :-: |
| **A-7** Decisiones del usuario | `ContactEvent` *(parcial)* | `ContactEventRepository` | ❌ **Ninguno** |
| **A-8** Historial del Lead | ❌ **Ninguno** | ❌ **Ninguno** | ❌ **Ninguno** |
| **A-9** Usuario y perfil | `User` | ❌ **Ninguno** | ❌ **Ninguno** |
| **A-10** Ejecuciones de agente | ❌ **Ninguno** | ❌ **Ninguno** | ❌ **Ninguno** |

> **A-8 es el más señalado:** ADR-13 lo describe como *«Registro cronológico de todo lo anterior… **Solo crece**»*, **G-5** lo garantiza y **ADS-02 §7** declara *«Tabla de historial sin actualización ni borrado»* — **y no existe ni contrato**.

> ### **No se clasifica como divergencia:** ningún documento fija **cuándo** deben implementarse. **ADS-02 §2.2** delimita expresamente lo que no incluye, y el proyecto avanza por sprints con alcance aprobado.
>
> **Se registra como falta de autoridad sobre el calendario**, no como defecto.

**Propietario:** **AKVEZ Product Office** *(priorización)* · **Architecture Team** *(diseño)*.

---

# 5. Tarea 2 — Activos versionados contra V-2 y V-3

## 5.1 Los cuatro activos versionados

**ADR-13 §10.3:** *«Se versionan cuatro activos: **A-4**, **A-5**, **A-6** y **A-11**.»*

| Activo | Adapter | ¿Ordena por nº de emisión? | ¿Ordena por marca temporal? | Campo | V-2 | V-3 |
| :-: | --- | :-: | :-: | :-: | :-: | :-: |
| **A-4** | *(fusionado en A-5)* | ✅ Sí | ❌ No | `emission` | ✅ | ✅ |
| **A-5** | `inMemoryLeadAnalysisAdapter` | ✅ **Sí** | ❌ **No** | `emission` | ✅ | ✅ |
| **A-6** | `inMemoryProposalAdapter` | ✅ Sí | ❌ No | `issue` | ✅ | ✅ |
| **A-11** | `inMemoryBuyerDiagnosisAdapter` | ✅ Sí | ❌ No | `issue` | ✅ | ✅ |
| A-12 | `inMemoryCommercialSequenceAdapter` | — | — | — | **N/A** — no versionado | — |

## 5.2 Respuesta a las cuatro preguntas del sprint

| Pregunta | Respuesta |
| --- | :-: |
| **¿Ordenan por `issue`?** | ✅ **Sí — por número de emisión, los tres adapters versionados** |
| **¿Conservan `issuedAt` como metadato?** | ✅ **Sí.** A-6: `issuedAt`. A-5: `calculatedAt`. **Ninguno se usa para ordenar** |
| **¿Existe alguna implementación basada en marca temporal?** | ❌ **NINGUNA** |
| **¿Divergencia entre dominio e infraestructura?** | ⚠️ **Sí, una — H-6** |

**Evidencia de A-5** — `inMemoryLeadAnalysisAdapter.ts:57-63`:

```
// V-2 — la vigente es la más reciente, es decir, la de mayor `emission`.
const current = versions.reduce((latest, model) =>
  model.emission > latest.emission ? model : latest
);
```

`findCurrentForAllLeads` aplica el mismo criterio *(líneas 68-77)*.

> ### ✅ **A-5 es CONFORME a V-2 y V-3.** El riesgo que COM-40/1 §3 dejó abierto —*«A-5 no auditado»*— **queda cerrado sin divergencia de criterio.**

## 5.3 ⚠️ H-6 — Dos patrones opuestos para derivar el número de emisión

| Activo | Quién lo decide | Justificación citada en el código |
| :-: | --- | --- |
| **A-5** | **El Adapter** | *«el llamador **no puede fijarlo**, de modo que la secuencia **no puede falsearse** ni colisionar (V-1)»* · **ADR-05 §7 D3** |
| **A-6** | **El caso de uso** | *«**forma parte de la identidad del agregado** —`(Lead, momento, número de emisión)`, ADR-16 §4.4—… reescribirlo aquí haría que la identidad devuelta no fuese la que el dominio construyó»* |
| **A-11** | **El caso de uso** | Idéntica justificación · **ADR-16 §4.2** |

> ### **Dos patrones opuestos, cada uno con fundamento documental propio y correcto.**
>
> **No es una contradicción:** **ADR-16 declara la identidad de las cinco entidades comerciales** —A-6, A-11, A-12 entre ellas—, e **incluye el número de emisión en esa identidad**. **El Opportunity Score NO es una entidad comercial de ADR-16**, de modo que **ningún documento declara que su número de emisión forme parte de su identidad**. A-5 puede legítimamente delegarlo al adapter.

### Por qué importa, y no es una curiosidad

> **ADR-13 v1.3 acaba de añadir G-9 — *«Atomicidad de la persistencia: la creación debe garantizar que operaciones concurrentes no produzcan duplicados»*.**
>
> **El patrón de A-5 es estructuralmente más atómico**: derivar y escribir ocurren **dentro del adapter**, en un solo lugar. **El de A-6 y A-11 separa la derivación (caso de uso) de la escritura (adapter)** — que es exactamente el hueco que **F-2** describe.
>
> **Quien implemente G-9 sobre el motor real encontrará dos patrones distintos que resolver de forma distinta, y ningún documento lo advierte.**

**Clasificación: ⚠️ Ambigüedad pendiente / Falta de autoridad.**
**Propietario:** **AKVEZ Architecture Team** — alcanza a **ADR-13 §12.3 G-9** y a la **Capa B de F-2** *(ADS-02 §3)*.

## 5.4 ⚠️ H-7 — Nomenclatura del campo: `emission` frente a `issue`

**ADR-13 v1.3 V-2 enmendada:** *«la de **mayor número de emisión (`issue`)**»*.

| Activo | Campo en el contrato |
| :-: | :-: |
| **A-5** | `emission` |
| A-6 · A-11 | `issue` |

> **El contenido normativo de V-2 es *«mayor número de emisión»*; `(issue)` es una ilustración del nombre.** **DEV-00 §5.1** *(convenciones de nombres)* **no cubre este campo.**
>
> **No existe autoridad que fije el nombre.** Se registra; **no se propone renombrar**.

⚠️ **Nota de riesgo:** aplicar V-2 v1.3 literalmente —*«`issue`»*— podría leerse como que **A-5 la incumple**, cuando **su semántica es conforme**. **Conviene que la enmienda lo aclare antes de aplicarse.**

**Propietario:** **AKVEZ Architecture Team**.

---

# 6. Riesgos

| # | Riesgo | Sev. | Origen |
| :-: | --- | :-: | :-: |
| **1** | **ADR-13 v1.3 se aplica sin corregir A-5.** Se corrige la celda de A-6 y **queda la de A-5 con el mismo defecto**, sugiriendo que §6.2 se revisó entera | 🔴 **Alta** | H-4 |
| **2** | **V-2 v1.3 se aplica literalmente con `issue`** y **A-5 parece incumplir** una regla que su semántica sí cumple | 🟡 Media | H-7 |
| **3** | **G-9 se implementa asumiendo un solo patrón de derivación**, cuando hay dos | 🟡 Media | H-6 |
| **4** | **A-4 se da por versionado independientemente** cuando comparte contador con A-5 | 🟡 Media | H-3 |
| **5** | **El vocabulario de estadios se sincroniza en un documento y no en el otro** | 🟡 Media | H-1 · H-2 |
| **6** | **A-8 se implementa tarde**, y el historial de los eventos ya ocurridos **no puede reconstruirse** — *«solo crece»* no repara lo no escrito | 🟡 Media | H-5 |

---

# 7. Recomendaciones

> **Propuestas. Ninguna se aplica en este sprint.**

| # | Recomendación | Propietario | Momento |
| :-: | --- | --- | :-: |
| **1** | **Incorporar la corrección de A-5 a ADR-13 v1.3** *(H-4)* antes de aplicarla — misma clase de defecto que A-6, mismo documento, mismo acto | **Architecture Team** | ⚠️ **Antes de aplicar v1.3** |
| **2** | **Aclarar en V-2 que el criterio es el número de emisión**, sea cual sea el nombre del campo *(H-7)* | **Architecture Team** | ⚠️ **Antes de aplicar v1.3** |
| **3** | **Pronunciarse sobre A-4/A-5 fusionados** *(H-3)* | **Architecture Team** | Sprint propio |
| **4** | **Declarar en G-9 los dos patrones de derivación** y cómo se resuelve cada uno *(H-6)* | **Architecture Team** | Con **F-2 Capa B** |
| **5** | **Resolver el vocabulario de estadios** *(H-1)* | **Product Office** | Sprint de gobernanza |
| **6** | **`LeadStatus` con los cuatro valores oficiales** *(H-2 · A-01)* | **Ingeniería**, con alcance propio | Sprint propio — **alcanza a CE-I1** |
| **7** | **Priorizar A-8, A-9, A-10, A-7** *(H-5)* | **Product Office** | Planificación |

> ### **Las recomendaciones 1 y 2 son las únicas con plazo: afectan al contenido de una enmienda ya aprobada pero aún no aplicada.**
>
> **Aplicar v1.3 tal como está hoy NO es incorrecto** —corrige lo que declara corregir—, **pero deja A-5 con el defecto que A-6 acaba de perder**, y ese desequilibrio es peor que el estado actual: **sugiere que §6.2 fue revisada entera cuando solo se revisó una fila.**

---

# 8. Criterios de cierre

| # | Criterio | Estado |
| :-: | --- | :-: |
| **1** | Todas las filas de §6.2 clasificadas | ✅ **11 de 11** *(A-6 en COM-36/1)* |
| **2** | Todos los activos versionados comparados | ✅ **A-4, A-5, A-6, A-11** + A-12 verificado como no versionado |
| **3** | Ninguna conclusión depende de interpretación | ✅ **5 hallazgos clasificados como ambigüedad o falta de autoridad, sin resolver** |
| **4** | Cambios futuros separados como propuesta | ✅ **§7 — siete recomendaciones, ninguna aplicada** |

## 8.1 Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Ficheros `.ts` / `.tsx` modificados | **0** |
| `docs/blueprint/` modificado | **0** |

---

# 9. Referencias

**ADR-05 v1.4** §7 D3, §10, §14 · **ADR-12 v1.1** §7.2, §12.1 *(E-5)* · **ADR-13 v1.2** §6.2, §10.1, §10.3 *(V-1 a V-5)*, §12.1, §12.3 *(G-1 a G-7)*, §13.1 · **ADR-13 v1.3 Consolidated Amendment** Cambios A, B, C *(G-8, G-9, G-10)* · **ADR-14 v1.2** §6.3, §6.4, §6.6, R-VIN · **ADR-16 v1.1** §4.2, §4.3, §4.4, §4.5 · **PO-01 v1.2** §5, §8 · **PO-02 v1.3** §5, §5.1, §12.2 · **APS-07 v2.0** §5 · **APS-08** §6, §6.6, §9 · **ADS-02 v1.1** §2.2, §3, §7 · **DDD-01 v1.1** §2.1, §8, §9.2 · **DEV-00** §5.1, R-34, R-38, R-42, R-44, R-45 · **DEV-04** · **AR-05** §5.1 *(A-01)* · **COM-36/1** · **COM-40/1** §3 · **COM-42/A** · **COM-42/C**.
