# COM-37 — Requisitos de Implementación de F-2

| Campo | Valor |
| --- | --- |
| Código | COM-37 / 4 |
| Clasificación | **Especificación de requisitos por capa** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Requisitos redactados. NADA implementado** |
| Fecha | 2026-08-04 |
| Bloqueo | **F-2** — abierto en las tres capas |
| Antecedentes | **COM-33 §5** · **COM-34/3** · **COM-35/3** · **COM-36/3** |

> **No se han creado índices, constraints ni migraciones. No se ha tocado ningún adapter. Cero cambios de código.**

---

# 1. Mapa de las tres capas

| Capa | Materia | Propietario | Documento | Estado |
| :-: | --- | --- | --- | :-: |
| **A.1** | Identidad del agregado | Architecture Team | ADR-16 · ADR-12 | ✅ **Decidida** |
| **A.2** | **Garantía exigida a la persistencia** | **Architecture Team** | **ADR-13 §12.3** | 🔴 **No iniciada** |
| **B** | Requisito impuesto al motor | **Architecture Team** redacta · **Product Office** aprueba | **ADS-02 §3** | ⛔ Bloqueada por A.2 |
| **C** | Implementación y pruebas | **Ingeniería** | Adapter de motor real | ⛔ Bloqueada por B |

---

# 2. Capa A — Decisión arquitectónica

## 2.1 Quién define la garantía

> ## **`ADR-13 §12.3` — AKVEZ Architecture Team.**

**Autoridad — DDD-01 §9.2:** *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»*.

**Y el precedente está en el propio §12.3:** las siete garantías **G-1 a G-7** son exactamente esto — exigencias a la persistencia derivadas de una identidad de dominio. **G-6** es la central: *«Dentro del espacio de un usuario **no coexisten dos Leads** con la misma Referencia de Origen»*.

> ### 🔴 **No existe G-equivalente para A-6, A-11 ni A-12. Ése es el hueco de la Capa A.**

## 2.2 A.1 — La identidad · ✅ decidida, no requiere trabajo

| Activo | Identidad | Documento |
| --- | --- | --- |
| **A-6** | `(Lead, momento de la secuencia, número de emisión)` | ADR-16 §4.4 |
| **A-11** | `(Lead, número de emisión)` | ADR-16 §4.2 |
| **A-12** | `(Lead, número de secuencia)` | ADR-16 §4.3 · CS-I5 |
| **A-1** | `(Referencia de Origen, Usuario)` | ADR-12 §7.2 |

## 2.3 A.2 — Texto propuesto para ADR-13 §12.3 · **no aplicado**

**Tres filas nuevas, con la misma forma que G-1 a G-7:**

| # | Garantía propuesta | Origen |
| --- | --- | --- |
| **G-8** | Dentro del espacio de un usuario **no coexisten dos emisiones de Propuesta con la misma terna `(Lead, momento, número de emisión)`** | ADR-16 §4.4 |
| **G-9** | Dentro del espacio de un usuario **no coexisten dos emisiones de Diagnóstico con el mismo par `(Lead, número de emisión)`** | ADR-16 §4.2 |
| **G-10** | Dentro del espacio de un usuario **no coexisten dos Secuencias Comerciales con el mismo par `(Lead, número de secuencia)`** | ADR-16 §4.3 · CS-I5 |

> **La numeración G-8 a G-10 es tentativa.** Asignarla corresponde a ADR-13.

---

# 3. Capa B — Requisitos del motor

## 3.1 Dónde viven

**`ADS-02 §3` — *Requisitos Impuestos por la Arquitectura*, «no negociables».** Redacta el **Architecture Team** *(`Responsable` de ADS-02)*; aprueba el **Product Office** *(GOV-01)*.

## 3.2 Estado actual · cubre solo A-1

| # | Requisito | Alcance | Origen que cita |
| --- | --- | --- | --- |
| **RQ-2** | *«**Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** | ADR-12 §12.2 · **ADR-13 §12.3, G-6** |

> **RQ-2 cita G-6 como origen.** Para los activos comerciales **no hay nada que citar** mientras la Capa A no exista. **Un requisito de motor sin garantía que lo origine sería huérfano**, y ADS-02 declara estar *«**Gobernado por ADR-13**»*.

## 3.3 ⚠️ RQ-4 no cubre esto

| **RQ-4** | *«**Escritura acumulativa**: versiones sucesivas de análisis, puntuación y propuesta sin sobrescribir»* |
| --- | --- |
| Garantiza | Que las versiones **se acumulan** |
| **NO garantiza** | Que no haya **dos con el mismo número**. Un almacén puede acumular perfectamente dos filas con `issue = 3` |

## 3.4 Texto propuesto para ADS-02 §3 · **no aplicado**

| # | Requisito propuesto | Origen |
| --- | --- | --- |
| **RQ-10** | **Unicidad compuesta** garantizada por el motor sobre `(userId, leadId, moment, issue)` para A-6 | ADR-13 §12.3 **G-8** |
| **RQ-11** | **Unicidad compuesta** sobre `(userId, leadId, issue)` para A-11 | ADR-13 §12.3 **G-9** |
| **RQ-12** | **Unicidad compuesta** sobre `(userId, leadId, sequence)` para A-12 | ADR-13 §12.3 **G-10** |

> **`userId` entra en las tres claves** por **RQ-3** *(aislamiento entre usuarios, ADR-05 §14)*, igual que en RQ-2. ⚠️ **Hoy es un placeholder de un solo inquilino — deuda F-3**, que estas tres claves **heredan y no resuelven**.

---

# 4. Capa C — Implementación futura

> **Especificación de lo que habrá que hacer. NADA de esto se implementa en este sprint.**
> **Precondición absoluta: capas A.2 y B aprobadas.**

## 4.1 Persistencia real

| # | Trabajo | Nota |
| :-: | --- | --- |
| C-1 | **Adapter PostgreSQL** para `ProposalRepository`, `BuyerDiagnosisRepository`, `CommercialSequenceRepository` | Sustituye los adapters en memoria. **ADR-09 §6: cambio de una línea en el Composition Root** |
| C-2 | **Esquema** de las tablas, conforme a `ProposalModel`, `BuyerDiagnosisModel`, `CommercialSequenceModel` | Los Models ya existen y están probados |
| C-3 | **Mappers reutilizados sin cambios** — `proposalMapper`, `commercialSequenceMapper`, `commercialStrategyMapper` | Son funciones puras; no dependen del motor |

## 4.2 Constraints

| # | Trabajo | Deriva de |
| :-: | --- | --- |
| C-4 | `UNIQUE (user_id, lead_id, moment, issue)` sobre la tabla de A-6 | **RQ-10** |
| C-5 | `UNIQUE (user_id, lead_id, issue)` sobre la tabla de A-11 | **RQ-11** |
| C-6 | `UNIQUE (user_id, lead_id, sequence)` sobre la tabla de A-12 | **RQ-12** |

> ⚠️ **Ninguna de estas tres constraints puede escribirse hoy.** No existe el requisito que las origine *(Capa B)* ni la garantía que lo origine a él *(Capa A.2)*. **Escribirlas ahora sería decidir arquitectura desde el código.**

## 4.3 Transacciones

| # | Trabajo | Deriva de |
| :-: | --- | --- |
| C-7 | **`save` transaccional**: derivar el número de emisión del historial y escribir deben ser **una operación indivisible** | **RQ-1** *(atomicidad)* · **R-30** · ADR-13 §11.1 |
| C-8 | **Comportamiento ante violación de unicidad**: la operación falla y **no deja escritura parcial** | ADR-13 §11.1 · **R-64** *(un fallo no retira lo ya registrado)* |
| C-9 | **Aislamiento entre usuarios** por RLS, además de en la aplicación | **RQ-3** · ADS-02 §8.1 |

> ### 🔴 **C-7 es el núcleo de F-2, y conviene enunciarlo sin adornos.**
>
> **Hoy, entre leer el historial y escribir no hay atomicidad.** El caso de uso deriva el número y el adapter lo escribe. **Dos escrituras concurrentes leerían el mismo historial, derivarían el mismo número y producirían dos filas con la misma identidad — en silencio.**
>
> **Que hoy no ocurra es una propiedad del entorno —un proceso, memoria—, no una garantía del diseño.**

## 4.4 Pruebas

| # | Trabajo | Por qué hoy no es escribible |
| :-: | --- | --- |
| C-10 | **Prueba de unicidad bajo concurrencia**: dos escrituras simultáneas de la misma identidad → una falla | **Sin motor y con un proceso, no hay concurrencia que probar** |
| C-11 | **Prueba de atomicidad**: una escritura interrumpida no deja fila parcial | Requiere transacciones reales |
| C-12 | **Ejecutar las cuatro suites de contrato existentes contra el adapter real** | Requiere C-1 |
| C-13 | **Prueba de aislamiento entre usuarios** | Requiere RLS · ⚠️ y que **F-3** *(`userId` placeholder)* esté resuelta |

### El hueco ya está declarado donde intentaría taparse

| Fichero | Qué declara |
| --- | --- |
| `buyerDiagnosisRepository.contract.ts:14` | *«QUÉ NO VERIFICA: la unicidad de `(leadId, issue)` bajo concurrencia (deuda F-2). **No es comprobable sin un motor real**»* |
| `commercialSequenceRepository.contract.ts:21` | *«La unicidad de `(leadId, sequence)` bajo concurrencia — deuda F-2»* |
| `proposalRepository.contract.ts:18` | *«la unicidad de `(leadId, moment, issue)` bajo concurrencia (deuda F-2)»* |
| `inMemoryProposalAdapter.ts:54-57` | *«debe garantizarla el motor con una **restricción compuesta**»* |

> **Es la práctica correcta y conviene preservarla: el hueco no está oculto, está anotado.** **C-12 no debe borrar esas notas: debe sustituirlas por las pruebas que las cierran.**

## 4.5 Dependencias cruzadas de la Capa C

| Deuda | Relación con F-2 |
| --- | :-: |
| **F-3** — `userId` placeholder de un solo inquilino | ⚠️ **C-4 a C-6 y C-13 la heredan.** Las claves compuestas la incluyen |
| **F-9** — `createdAt` no observable desde el contrato | 🟢 Independiente |
| **B-5** — criterio de vigencia sin declarar | ⚠️ **Toca las mismas tablas.** Conviene decidirlo **antes** de C-1 |

---

# 5. Secuencia y bloqueos

```
A.1 identidad  ──✅ decidida
      │
A.2 garantía   ──🔴 NO INICIADA        Architecture Team · ADR-13 §12.3
      │
B   requisito  ──⛔ bloqueada por A.2   Arch. Team redacta · Product Office aprueba · ADS-02 §3
      │
C   ejecución  ──⛔ bloqueada por B     Ingeniería · C-1 a C-13
```

| # | Acción para desbloquear | Quién |
| :-: | --- | --- |
| **1** | **Capa A.2** — añadir G-8, G-9, G-10 a ADR-13 §12.3 *(§2.3)* | **Architecture Team** |
| **2** | **Capa B** — añadir RQ-10, RQ-11, RQ-12 a ADS-02 §3 *(§3.4)*, citando origen en 1 | **Architecture Team** redacta · **Product Office** aprueba |
| **3** | **Capa C** — C-1 a C-13 | **Ingeniería** |

> **Los pasos 1 y 2 no requieren código y no puede ejecutarlos Ingeniería. Son los que convierten F-2 en trabajo real.**

---

# 6. Dos bloqueos laterales que siguen abiertos

| # | Bloqueo | Nota |
| :-: | --- | --- |
| **1** | **Ningún documento *es* el registro de la serie F-** | F-2 aparece restatada en **seis** documentos con **cuatro redacciones**. El precedente es **AR-05 §5.1** para la serie A-/T-. **No existe equivalente** |
| **2** | **`F-2` es un identificador colisionado** | La deuda comercial y la regla **ADR-17 §8.2 F-2** comparten nombre. **4 citas en código** para la primera, **3** para la segunda. Renombrar la comercial no rompe nada; renombrar la de ADR-17 exige enmendar un ADR |

**Ambos deberían resolverse en el mismo acto que cree el registro. No se hacen aquí.**

---

# 7. Lo que este documento **no** hace

- ❌ **No implementa nada.**
- ❌ **No crea índices, constraints, migraciones ni esquemas.**
- ❌ **No toca adapters** ni ningún otro código.
- ❌ **No modifica ADR-13, ADS-02, ADR-16 ni ningún COM anterior.**
- ❌ **No cierra F-2.**
- ❌ **No afirma ninguna garantía inexistente** *(§4.3)*.
- ❌ **La numeración G-8/G-10 y RQ-10/RQ-12 es tentativa**: la asignan sus documentos propietarios.

---

# 8. Referencias

**ADR-05 v1.4** §14 · **ADR-08 v1.2** §8, §10 · **ADR-09 v1.3** §6 · **ADR-12 v1.1** §7.2, §12.2 · **ADR-13 v1.2** §10.3, §11.1, §12.3 *(G-1 a G-7)*, §12.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADR-17 v1.1** §8.2 · **ADS-02 v1.1** §3 *(RQ-1 a RQ-9)*, §7, §8.1, §9 · **DDD-01 v1.1** §9.1, §9.2 · **DEV-00** R-30, R-31, R-64 · **AR-05** §5.1, RC-10 · **COM-19** §7.2 · **COM-33** §5 · **COM-34/3** · **COM-35/3** · **COM-36/3**.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
