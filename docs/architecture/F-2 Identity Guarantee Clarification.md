# F-2 — Clarificación de la Garantía de Identidad

| Campo | Valor |
| --- | --- |
| Código | **F-2 Clarification** — documento de clarificación de deuda |
| Clasificación | **Aclaración técnica** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Aclara. No resuelve, no cierra y no reasigna** |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-34, tarea 3 — ambigüedad detectada en **COM-33 §5** |
| Relacionado | **COM-19 §7.2** · **COM-33 §5** · COM-06 · COM-10 §7 · COM-13 §2.4 · COM-21 §9 · COM-23 §7 |

> **Este documento no afirma ninguna garantía que no exista.** Cuando algo no está garantizado, lo dice. Cuando no hay documento que lo decida, lo dice.
>
> **Cero cambios de código.**

---

# 1. El problema, en una frase

> ### **«F-2» nombra hoy tres cosas distintas: una identidad de negocio, una garantía técnica que no existe y una responsabilidad de motor que nadie ha asignado. Y además colisiona con una regla de ADR-17 que se llama igual.**

Este documento las separa. **No las resuelve**: separarlas es el requisito previo para que alguien pueda resolverlas.

---

# 2. 🔴 Primero: el nombre está colisionado

**Dos cosas distintas se llaman `F-2`, y ambas se citan en el código.**

| | **F-2 · deuda** | **F-2 · regla** |
| --- | --- | --- |
| **Qué es** | *Unicidad de la identidad en el motor real* | *«Cada campo de `Deps` es un puerto o una función de caso de uso del propio módulo»* |
| **Naturaleza** | **Una deuda abierta** | **Una regla vigente** |
| **Dónde vive** | Serie F- de las auditorías comerciales | **ADR-17 §8.2**, `Approved` |
| **Dónde se cita en código** | `inMemoryProposalAdapter.ts:57` · `proposalRepository.contract.ts:18` · `buyerDiagnosisRepository.contract.ts:15` · `commercialSequenceRepository.contract.ts:21` | `generateDiagnosis.ts:61` · `createSequence.ts:80` · `generateOutreachPitch.ts:43` |

> **Siete citas en código, cuatro a una y tres a la otra.** Hoy el contexto desambigua —las de persistencia hablan de unicidad, las de `application/` de dependencias—. **Con el registro F- consolidado, dejará de desambiguar.**

**No se ha renombrado nada.** Renombrar un identificador de una tabla de deuda es un acto de gobernanza. Se propone en §8.

---

# 3. Las tres capas, separadas

## 3.1 Capa 1 — **Identidad de negocio** · ✅ **Decidida y publicada**

**Qué identifica unívocamente a cada agregado, según el Blueprint. Esto no es deuda: está decidido.**

| Activo | Identidad | Autoridad |
| --- | --- | --- |
| **A-1** Lead | `(Referencia de Origen, Usuario)` | **ADR-12 §7.2** |
| **A-6** Propuesta | `(Lead, momento de la secuencia, número de emisión)` | **ADR-16 §4.4** |
| **A-11** Diagnóstico | `(Lead, número de emisión)` | ADR-16 §4.2 · ADR-13 §10.3 |
| **A-12** Secuencia | `(Lead, número de secuencia)` | ADR-16 §4.3 · CS-I5 |

> **La identidad de negocio no depende del motor y no puede depender de él.**
>
> **ADR-13 §12.4:** *«La identidad del Lead no podrá depender en ningún grado del motor de persistencia… si al sustituir el motor cambiase el conjunto de Leads, la identidad estaría en el lugar equivocado.»*
>
> **Esta capa está sana.** El código la respeta: los tres números que discriminan —`issue`, `sequence`, `moment`— llegan al adapter **ya decididos por el caso de uso**, derivados del historial, y **el adapter los conserva tal cual**. Reescribirlos en persistencia haría que la identidad devuelta no fuese la que el dominio construyó.

## 3.2 Capa 2 — **Garantía técnica** · 🔴 **Inexistente para tres de los cuatro activos**

**Qué impide hoy que existan dos filas con la misma identidad.**

| Activo | Tupla | Quién la garantiza **hoy** | Estado |
| --- | --- | --- | :-: |
| **A-1** Lead | `(userId, identityKey)` | **El código** de `inMemoryLeadAdapter` | 🟡 **Parcial** |
| **A-11** Diagnóstico | `(leadId, issue)` | **Nadie** | 🔴 **Ninguna** |
| **A-12** Secuencia | `(leadId, sequence)` | **Nadie** | 🔴 **Ninguna** |
| **A-6** Propuesta | `(leadId, moment, issue)` | **Nadie** | 🔴 **Ninguna** |

### Qué significa exactamente «nadie»

**El caso de uso deriva el número del historial existente y el adapter lo escribe.** Entre la lectura del historial y la escritura **no hay atomicidad**:

> **Dos escrituras concurrentes leerían el mismo historial, derivarían el mismo número y producirían dos filas con la misma identidad — en silencio.**

**Hoy no ocurre**, y la razón es una propiedad del entorno, no una garantía del diseño: **los cuatro adapters son en memoria y el proceso es único**. Los propios adapters lo declaran *«de validación, no la persistencia definitiva»* *(ADR-08 §8 · ADR-09 §6)*.

### El caso de A-1 es distinto, y no debe confundirse

`inMemoryLeadAdapter` **sí resuelve en código** la unicidad de `(userId, identityKey)`. Eso **no es F-2**:

- Es la desviación **A-03**, 🟡 `Partially Resolved` en **AR-05 §5.1**.
- Su riesgo es **RC-10**: *«la unicidad la garantiza el código, no el motor. Con un motor real y varios procesos, dos registros concurrentes de la misma identidad podrían duplicar un Lead»*.
- **R-31** ya declara quién debe garantizarla: *«la unicidad de `(Referencia de Origen, Usuario)` la garantiza **el motor**, no el código de aplicación»*.

> **A-1 tiene resolución parcial, regla que la exige y riesgo registrado. Los tres activos comerciales no tienen ninguna de las tres cosas.**

## 3.3 Capa 3 — **Responsabilidad del motor** · 🔴 **No asignada para los activos comerciales**

**Qué exige el Blueprint al motor de persistencia — y qué no.**

**ADS-02 §3** enumera nueve requisitos **no negociables**. El de unicidad es uno solo:

| # | Requisito | Alcance literal |
| --- | --- | --- |
| **RQ-2** | *«**Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)`»* | **Solo A-1** |

**Y las siete garantías de ADR-13 §12.3 —G-1 a G-7— son todas del Lead.** La central es **G-6**: *«Dentro del espacio de un usuario no coexisten dos Leads con la misma Referencia de Origen»*. **ADS-02 §7** la confirma: *«G-6: restricción de unicidad — **es la garantía central**»*.

> ### 🔴 **Ningún documento aprobado exige al motor unicidad sobre `(leadId, issue)`, `(leadId, sequence)` ni `(leadId, moment, issue)`.**
>
> **No es que el motor no la implemente todavía: es que nadie se la ha pedido.** ADS-02 se escribió cuando el dominio comercial aún no tenía sus tres activos con identidad compuesta. **RQ-4** cubre *«escritura acumulativa: versiones sucesivas… sin sobrescribir»* — **acumulación, no unicidad**. Son cosas distintas: un almacén puede acumular perfectamente **dos versiones con el mismo número**.

---

# 4. ⚠️ Hallazgo adicional — «versión vigente» se decide de dos formas

**No forma parte del encargo, pero aparece en la misma frontera y afecta a la misma tupla.**

| Fuente | Cómo se determina la emisión vigente |
| --- | --- |
| **ADS-02 §7** *(`Approved`)* | *«Versión vigente distinguible · §10.3 V-2 · **Marca temporal por emisión**; la vigente es la más reciente»* |
| **Código** — `inMemoryProposalAdapter.findCurrentByMoment` | **La de mayor `issue`**, explícitamente **no** por `issuedAt` |

**El código razona su elección** *(COM-22 §4.2)*: `issue` es monótono creciente por `(Lead, momento)`, mientras que `issuedAt` es un valor de reloj **cuyo origen sigue abierto** — es `COM-12 RC-4`, sin resolver. Ordenar por él haría que *«cuál es la vigente»* dependiera de una cuestión sin decidir.

> **El razonamiento del código es sólido y la divergencia con ADS-02 es real.** Ambas cosas a la vez.
>
> **No se propone cambiar el código.** Se señala que **ADS-02 §7 y el adapter no dicen lo mismo**, y que **COM-19 §9** planteó exactamente esta pregunta y sigue esperando pronunciamiento. **ADS-00 R-5** impide resolverlo aquí.

---

# 5. Qué garantiza el sistema hoy — enunciado sin adornos

**Lo que SÍ se puede afirmar:**

1. **La identidad de negocio está decidida y publicada** para los cuatro activos *(§3.1)*.
2. **El código la respeta**: el número que discrimina lo decide el dominio, no la persistencia.
3. **Las emisiones se acumulan sin sobrescribirse.** `save` es append-only en A-6 y A-11; verificable por `findVersionsByMoment` *(P-I2)*.
4. **Tres suites de contrato declaran el hueco explícitamente** y explican por qué no puede cerrarse allí *(§6)*.

**Lo que NO se puede afirmar, y no debe afirmarse:**

1. ❌ Que exista unicidad garantizada sobre `(leadId, issue)`, `(leadId, sequence)` o `(leadId, moment, issue)`.
2. ❌ Que el motor real la vaya a proporcionar. **ADS-02 no la pide.**
3. ❌ Que sea comprobable en el estado actual. **Sin concurrencia no hay nada que comprobar.**
4. ❌ Que «F-2» esté asignada a alguien que pueda cerrarla hoy *(§7)*.

---

# 6. Pruebas existentes — el hueco está declarado, no tapado

| Suite de contrato | Qué declara |
| --- | --- |
| `buyerDiagnosisRepository.contract.ts:14` | *«QUÉ NO VERIFICA: la unicidad de `(leadId, issue)` bajo concurrencia (deuda F-2). No es comprobable sin un motor real»* |
| `commercialSequenceRepository.contract.ts:21` | *«La unicidad de `(leadId, sequence)` bajo concurrencia — deuda F-2»* |
| `proposalRepository.contract.ts:18` | *«la unicidad de `(leadId, moment, issue)` bajo concurrencia (deuda F-2)»* |

Y `inMemoryProposalAdapter.ts:54-57` registra la consecuencia: *«la unicidad de `(leadId, moment, issue)` debe garantizarla el motor con una restricción compuesta»*.

> **Cuatro puntos del código nombran la deuda en el sitio correcto.** Es la práctica correcta y conviene preservarla: **el hueco no está oculto, está anotado donde intentaría taparse**.

---

# 7. Propiedad — por qué «Ingeniería» es engañoso

**«Ingeniería, con ADS-02»** es la atribución constante en COM-10 §7, COM-13 §2.4, COM-21 §9 y COM-23 §7.

> ### **Pero Ingeniería no puede cerrar F-2, hoy ni en ningún sprint anterior al motor real.**

| Paso | Quién | Estado |
| :-: | --- | :-: |
| **1** | **Arquitectura** — añadir a ADS-02 §3 los requisitos de unicidad de los tres activos comerciales *(hoy solo RQ-2, y solo A-1)* | 🔴 **No hecho** |
| **2** | **Arquitectura** — añadir a ADR-13 §12.3 las garantías equivalentes a G-6 para A-6, A-11 y A-12 | 🔴 **No hecho** |
| **3** | **Ingeniería** — implementar las restricciones compuestas en el motor | ⛔ **Bloqueado por 1 y 2** |
| **4** | **Ingeniería** — probarlas contra el motor, no contra el adapter en memoria | ⛔ Bloqueado por 3 |

**«Ingeniería» describe quién ejecutará el paso 3, no quién puede desbloquear F-2.** Los pasos 1 y 2 son de Arquitectura y **ninguna auditoría los ha asignado todavía**.

---

# 8. 🔴 Por qué «actualizar F-2» sigue sin poder ejecutarse

El encargo original —**COM-19 §7.2**— pedía que F-2 mencionara la terna de A-6. Al intentarlo aparece el obstáculo que **COM-33 §5.4** ya registró y que este documento confirma:

> ### **Ningún documento *es* el registro de F-2.**

**F-2 aparece restatado, nunca declarado**, en seis documentos y **con redacciones distintas**:

| Documento | Redacción |
| --- | --- |
| **COM-06 §11** · **COM-10 §7** | *«`(leadId, issue)` y `(leadId, sequence)`»* |
| **COM-13 §2.4** | *«`(lead, momento, nº de emisión)`»* |
| **COM-19 §10** | *«unicidad de `(leadId, moment, issue)`»* |
| **COM-21 §9** · **COM-23 §7** | *«unicidad de `(leadId, moment, issue)` en el motor real»* |

> **Cuatro de los seis ya dicen la terna de A-6.** El que no la dice es el **más antiguo**. **Actualizar F-2 exige antes decidir cuál de los seis es F-2** — y eso no es ingeniería.

**El precedente existe y funciona:** la serie **A-/T-** tiene **AR-05 §5.1** como *«tabla vigente»*, con fecha de actualización y sprint responsable. **La serie F- no tiene equivalente.**

---

# 9. Qué se pide

| # | Acción | Quién | Desbloquea |
| :-: | --- | --- | --- |
| **1** | **Designar el documento registro de la serie F-**, con el patrón de AR-05 §5.1 | **Arquitectura** | Que F-2 —y F-1, F-3, F-5, F-7, F-9, F-10— tengan **una** redacción |
| **2** | **Renombrar una de las dos F-2** *(§2)*. La de ADR-17 §8.2 está `Approved` y se cita en tres ficheros; la de la serie comercial no está fijada en ninguna parte — **es la que puede renombrarse sin coste** | **Arquitectura** | Que las siete citas del código sean inequívocas |
| **3** | **Ampliar ADS-02 §3 y ADR-13 §12.3** a los tres activos comerciales *(§7, pasos 1 y 2)* | **Arquitectura** | Que F-2 llegue a ser **ejecutable** por Ingeniería |
| **4** | **Pronunciarse sobre «vigente»**: `issue` o `issuedAt` *(§4)* — **COM-19 §9** lleva abierta desde el Sprint 19 | **Arquitectura** | Cierre de COM-19 §9 |

> **Ninguna de las cuatro requiere código.** **Ninguna puede ejecutarla Ingeniería.**

---

# 10. Lo que este documento **no** hace

- ❌ **No cierra F-2.** Sigue 🟡 abierta.
- ❌ **No la reasigna.** La propiedad la decide quien lleve el registro.
- ❌ **No modifica ADS-02, ADR-13, ADR-16 ni ningún COM anterior.**
- ❌ **No renombra nada.**
- ❌ **No cambia código.** Ni un fichero, ni un comentario.
- ❌ **No resuelve la divergencia de §4.** La señala, conforme a **ADS-00 R-5**.

---

# 11. Referencias

**ADR-08** §8, §10 · **ADR-09** §6 · **ADR-12** §7.2, §12.1, §12.2, §12.3 · **ADR-13** §10.3 *(V-1, V-2)*, §11.1, §12.3 *(G-1 a G-7)*, §12.4 · **ADR-16** §4.2, §4.3, §4.4 *(P-I2)* · **ADR-17** §8.2 *(F-2 · regla)* · **ADS-00** R-3, R-4, R-5 · **ADS-02** §3 *(RQ-1 a RQ-9)*, §7, §9 · **DEV-00** R-30, R-31 · **AR-05** §5.1 *(A-03)*, RC-10 · **COM-06** · **COM-10** §7 · **COM-12** RC-4 · **COM-13** §2.4 · **COM-19** §7.2, §9, §10 · **COM-21** §9 · **COM-22** §4.2 · **COM-23** §7 · **COM-33** §5.
