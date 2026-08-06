# COM-38 — Seguimiento de Propiedad de F-2

| Campo | Valor |
| --- | --- |
| Código | COM-38 / 4 |
| Clasificación | **Seguimiento de propiedad de deuda** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propiedad definida. F-2 abierta en las tres capas** |
| Fecha | 2026-08-04 |
| Antecedentes | COM-33 §5 · COM-34/3 · COM-35/3 · COM-36/3 · COM-37/4 |

> **No se han creado constraints. No se han creado migraciones. No se ha tocado ningún adapter. Cero cambios de código.**

---

# 1. Tabla de propiedad

| Capa | Responsable | Estado |
| --- | --- | :-: |
| **Garantía de identidad** *(qué identifica al agregado)* | **Architecture Team** — ADR-16 · ADR-12 | ✅ **Definida** |
| **Garantía de identidad** *(qué se exige a la persistencia)* | **Architecture Team** — **ADR-13 §12.3** | 🔴 **Pendiente — no iniciada** |
| **Requisito técnico** | **Architecture Team** — **ADS-02 §3** *(aprueba Product Office)* | 🔴 **Pendiente — bloqueada** |
| **Implementación** | **Engineering** | ⛔ **Bloqueada** |

> ⚠️ **La primera fila se desdobla, y el desdoble es el hallazgo de fondo:** *«garantía de identidad»* comprende **dos materias distintas** —qué identifica al agregado y qué se le exige a la persistencia para preservarlo—. **La primera está decidida desde hace sprints; la segunda no se ha iniciado nunca.** Fundirlas hacía parecer que la capa entera estaba resuelta.

---

# 2. Capa A — Garantía

## 2.1 A.1 — Identidad del agregado · ✅ **DEFINIDA**

| Activo | Identidad | Documento |
| --- | --- | --- |
| **A-6** | `(Lead, momento de la secuencia, número de emisión)` | **ADR-16 §4.4** |
| **A-11** | `(Lead, número de emisión)` | **ADR-16 §4.2** |
| **A-12** | `(Lead, número de secuencia)` | **ADR-16 §4.3** · CS-I5 |
| **A-1** | `(Referencia de Origen, Usuario)` | **ADR-12 §7.2** |

**Autoridad:** **DDD-01 §9.2** — *«Entidades, invariantes… → **ADR-16**, es la autoridad del modelo de dominio»* · *«Identidad del Lead y de la Empresa → **ADR-12**»*.

**El código la respeta:** el número que discrimina llega al adapter **ya decidido por el caso de uso**, derivado del historial. **ADR-13 §12.4** lo blinda: *«La identidad **no podrá depender en ningún grado** del motor de persistencia.»*

## 2.2 A.2 — Garantía exigida a la persistencia · 🔴 **PENDIENTE**

**ADR-13 §12.3 declara siete garantías. Las siete son del Lead.**

| Garantía | Alcance |
| --- | :-: |
| **G-6** — *«no coexisten dos Leads con la misma Referencia de Origen»* | **Solo A-1** |
| G-1 · G-2 · G-3 · G-4 · G-5 · G-7 | **Solo A-1** |

> ### 🔴 **No existe G-equivalente para A-6, A-11 ni A-12.**
>
> **Y el documento propietario está identificado sin ambigüedad — DDD-01 §9.2:** *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»*.

**Texto propuesto — tres filas nuevas, misma forma que G-1 a G-7. NO aplicado:**

| # | Garantía propuesta | Origen |
| --- | --- | --- |
| **G-8** | Dentro del espacio de un usuario **no coexisten dos emisiones de Propuesta con la misma terna `(Lead, momento, número de emisión)`** | ADR-16 §4.4 |
| **G-9** | **No coexisten dos emisiones de Diagnóstico con el mismo par `(Lead, número de emisión)`** | ADR-16 §4.2 |
| **G-10** | **No coexisten dos Secuencias Comerciales con el mismo par `(Lead, número de secuencia)`** | ADR-16 §4.3 · CS-I5 |

> **La numeración G-8/G-10 es tentativa.** La asigna ADR-13.

---

# 3. Capa B — Requisito técnico · 🔴 **PENDIENTE, bloqueada por A.2**

## 3.1 Estado actual · cubre solo A-1

**ADS-02 §3** — *Requisitos Impuestos por la Arquitectura*, «no negociables»:

| # | Requisito | Alcance | Origen que cita |
| --- | --- | --- | --- |
| **RQ-2** | *«**Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** | ADR-12 §12.2 · **ADR-13 §12.3, G-6** |

> **RQ-2 cita G-6 como origen. Para los activos comerciales no hay nada que citar mientras A.2 no exista.** ADS-02 declara estar *«**Gobernado por ADR-13**»*: **un requisito sin garantía que lo origine sería huérfano.**

## 3.2 ⚠️ RQ-4 no cubre esto

| **RQ-4** | *«**Escritura acumulativa**: versiones sucesivas… sin sobrescribir»* |
| --- | --- |
| Garantiza | Que las versiones **se acumulan** |
| **NO garantiza** | Que no haya **dos con el mismo número**. Un almacén puede acumular dos filas con `issue = 3` |

## 3.3 Texto propuesto para ADS-02 §3 · **NO aplicado**

| # | Requisito propuesto | Origen |
| --- | --- | --- |
| **RQ-10** | Unicidad compuesta sobre `(userId, leadId, moment, issue)` — A-6 | ADR-13 §12.3 **G-8** |
| **RQ-11** | Unicidad compuesta sobre `(userId, leadId, issue)` — A-11 | ADR-13 §12.3 **G-9** |
| **RQ-12** | Unicidad compuesta sobre `(userId, leadId, sequence)` — A-12 | ADR-13 §12.3 **G-10** |

> **`userId` entra en las tres claves** por **RQ-3** *(aislamiento entre usuarios, ADR-05 §14)*, igual que RQ-2. ⚠️ **Hoy es un placeholder de un solo inquilino — deuda F-3**, que estas claves **heredan y no resuelven**.

## 3.4 Propietario — precisión mantenida

| Campo de la cabecera de ADS-02 | Valor |
| --- | --- |
| `Responsable` | **AKVEZ Architecture Team** |
| `Aprobado por` | **AKVEZ Product Office** — GOV-01 |
| `Gobernado por` | **ADR-13** · ADR-05 · ADR-08 · ADR-12 |

> **Redacta el Architecture Team; aprueba el Product Office.** La tabla de §1 lo refleja: **la Capa B es «Architecture Team»**, coincidiendo con el encargo de este sprint y con el registro documental.

---

# 4. Capa C — Implementación · ⛔ **BLOQUEADA**

> **Especificación de lo pendiente. NADA implementado. Precondición: capas A.2 y B aprobadas.**

| # | Trabajo | Deriva de |
| :-: | --- | --- |
| **C-1** | Adapter PostgreSQL para los tres repositorios | ADS-02 §4 · ADR-09 §6 *(cambio de una línea en el Composition Root)* |
| **C-2** | Esquema conforme a los Models existentes | Models ya probados |
| **C-3** | Mappers reutilizados **sin cambios** | Funciones puras, no dependen del motor |
| **C-4** | `UNIQUE (user_id, lead_id, moment, issue)` — A-6 | **RQ-10** ⛔ |
| **C-5** | `UNIQUE (user_id, lead_id, issue)` — A-11 | **RQ-11** ⛔ |
| **C-6** | `UNIQUE (user_id, lead_id, sequence)` — A-12 | **RQ-12** ⛔ |
| **C-7** | **`save` transaccional**: derivar el número y escribir, **operación indivisible** | **RQ-1** · **R-30** · ADR-13 §11.1 |
| **C-8** | Violación de unicidad: falla **sin escritura parcial** | ADR-13 §11.1 · **R-64** |
| **C-9** | Aislamiento entre usuarios por RLS | **RQ-3** · ADS-02 §8.1 |
| **C-10** | Prueba de **unicidad bajo concurrencia** | ⛔ Sin motor no hay concurrencia que probar |
| **C-11** | Prueba de **atomicidad** | ⛔ Requiere transacciones reales |
| **C-12** | Ejecutar las suites de contrato **contra el adapter real** | ⛔ Requiere C-1 |
| **C-13** | Prueba de aislamiento entre usuarios | ⛔ Requiere RLS y **F-3** resuelta |

> ### 🔴 **C-7 es el núcleo de F-2:**
>
> **Hoy, entre leer el historial y escribir no hay atomicidad.** Dos escrituras concurrentes leerían el mismo historial, derivarían el mismo número y **producirían dos filas con la misma identidad — en silencio**.
>
> **Que no ocurra es una propiedad del entorno —un proceso, memoria—, no una garantía del diseño.**

**El hueco está declarado donde intentaría taparse:** `buyerDiagnosisRepository.contract.ts:14` · `commercialSequenceRepository.contract.ts:21` · `proposalRepository.contract.ts:18` · `inMemoryProposalAdapter.ts:54-57`. **C-12 no debe borrar esas notas: debe sustituirlas por las pruebas que las cierran.**

---

# 5. Secuencia de desbloqueo

```
A.1 identidad  ──✅ DEFINIDA
      │
A.2 garantía   ──🔴 PENDIENTE          Architecture Team · ADR-13 §12.3 · G-8/G-9/G-10
      │
B   requisito  ──🔴 BLOQUEADA por A.2   Arch. Team redacta · Product Office aprueba · ADS-02 §3 · RQ-10/11/12
      │
C   ejecución  ──⛔ BLOQUEADA por B     Engineering · C-1 a C-13
```

| # | Acción | Quién | ¿Requiere código? |
| :-: | --- | --- | :-: |
| **1** | Añadir **G-8, G-9, G-10** a ADR-13 §12.3 | **Architecture Team** | ❌ No |
| **2** | Añadir **RQ-10, RQ-11, RQ-12** a ADS-02 §3, citando origen en 1 | **Architecture Team** · aprueba **Product Office** | ❌ No |
| **3** | **C-1 a C-13** | **Engineering** | ✅ Sí — ⛔ bloqueado |

> **Los pasos 1 y 2 no requieren código y no puede ejecutarlos Ingeniería. Son los que convierten F-2 en trabajo real.**
>
> **Recomendación:** el paso 1 toca ADR-13 §12.3 — **agrupar con las otras dos propuestas sobre ADR-13** en una sola enmienda v1.3 *(COM-38/2 §7.1)*.

---

# 6. Dos bloqueos laterales, sin cambios

| # | Bloqueo | Nota |
| :-: | --- | --- |
| **1** | **Ningún documento *es* el registro de la serie F-** | Restatada en **seis** documentos con **cuatro redacciones**. El precedente es **AR-05 §5.1** para la serie A-/T-. **No hay equivalente** |
| **2** | **`F-2` es un identificador colisionado** | Deuda comercial *(4 citas en código)* vs regla **ADR-17 §8.2 F-2** *(3 citas)*. **Renombrar la comercial no rompe nada; renombrar la de ADR-17 exige enmendar un ADR** |

**Ambos deberían resolverse en el mismo acto que cree el registro. No se hacen aquí.**

---

# 7. Lo que este documento **no** hace

- ❌ **No implementa nada** · **no crea constraints, índices ni migraciones** · **no toca adapters**.
- ❌ **No modifica ADR-13, ADS-02, ADR-16 ni ningún COM anterior.**
- ❌ **No cierra F-2.**
- ❌ **No afirma ninguna garantía inexistente** *(§4, C-7)*.
- ❌ **La numeración G-8/G-10 y RQ-10/RQ-12 es tentativa.**

---

# 8. Referencias

**ADR-05 v1.4** §14 · **ADR-08 v1.2** §8, §10 · **ADR-09 v1.3** §6 · **ADR-12 v1.1** §7.2, §12.2 · **ADR-13 v1.2** §10.3, §11.1, §12.3, §12.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2 · **ADS-02 v1.1** *(cabecera)*, §3, §4, §7, §8.1 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** R-30, R-31, R-64 · **AR-05** §5.1, RC-10 · **COM-19** §7.2 · **COM-33** §5 · **COM-34/3** · **COM-35/3** · **COM-36/3** · **COM-37/4**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
