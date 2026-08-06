# ADR-13 v1.3 — Enmienda Consolidada

| Campo | Valor |
| --- | --- |
| Código | **ADR-13 v1.3 — Consolidated Amendment** |
| Clasificación | **Enmienda a Architecture Decision Record** |
| Documento enmendado | **ADR-13 — Motor Canónico de Persistencia**, v1.2 |
| Versión resultante | **ADR-13 v1.3** |
| Estado | ✅ **Approved** |
| Fecha | 2026-08-04 |
| Responsable | AKVEZ Architecture Team |
| **Approved by** | **AKVEZ Architecture Team** |
| **Date** | **2026-08-04** |
| Estándar aplicado | ADS-00 v1.3 |
| Origen | Sprint COM-39, tarea 2 |
| Levanta | **B-5** *(criterio de vigencia)* · **F-2 Capa A.2** *(garantía de identidad)* |

> **Enmienda única y consolidada.** Sustituye a tres propuestas separadas —COM-38/2, COM-38/3 y COM-38/4— que tocaban el mismo documento.
>
> **Cero cambios de código.** Ningún fichero `.ts` modificado por esta enmienda.

---

# 1. Alcance

**Tres secciones de ADR-13 se enmiendan. Ninguna otra.**

| Cambio | Sección | Naturaleza |
| :-: | --- | --- |
| **A** | **§6.2** — fila A-6, columna «Contenido» | **Corrección** de una celda |
| **B** | **§10.3** — regla V-2 | **Completar** una regla ambigua |
| **C** | **§12.3** — garantías | **Añadir** G-8, G-9, G-10 |

## 1.1 Qué NO se enmienda

**§1 a §5 · §6.1 · §6.3 · §7 a §9 · §10.1 · §10.2 · §10.4 · §11 · §12.1 · §12.2 · §12.4 · §13 · §14 y siguientes.**

**Y dentro de las tres secciones tocadas:**

- **§6.2** — las **once filas restantes** del inventario y la columna «Momento de escritura» de A-6.
- **§10.3** — **V-1, V-3, V-4 y V-5** conservan su texto íntegro, y la nota sobre A-12.
- **§12.3** — **G-1 a G-7** conservan su texto íntegro.

> **ADR-13 no se retira, no se archiva y no se marca `Deprecated`.** Su autoridad —*«qué se persiste, cuándo y con qué semántica»*, **DDD-01 §9.2**— permanece íntegra.

---

# 2. Cambio A — Canonicalización de A-6

## 2.1 Texto actual — §6.2, fila A-6

```
| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |
```

## 2.2 Texto enmendado

```
| **A-6** | **Propuesta comercial** | La **estrategia comercial estructurada** y las decisiones que la componen · la **evidencia utilizada** *(lista cerrada de hechos afirmables)* · el **texto generado** · el **canal** · la **versión del criterio aplicado** *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |
```

## 2.3 Lo que se mantiene, explícitamente

| Afirmación | Estado |
| --- | :-: |
| **La Propuesta sigue siendo A-6** | ✅ **Sin cambio** |
| **La Propuesta continúa siendo versionada** | ✅ **Sin cambio** — §10.3 |
| Momento de escritura: **al generarse** | ✅ **Sin cambio** |
| **E-5 la emite y no actualiza el estadio** | ✅ **Sin cambio** — §13.1 |

## 2.4 Justificación

### PO-02 §3 — autoridad de producto, **orden 2**

> *«Una Propuesta Comercial es el artefacto completo producido para un contacto: **la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa**.»*
>
> **«No es solo el texto.»**
>
> *«Una propuesta conservada como texto suelto **no puede explicarse después**: nadie podrá saber qué perseguía, qué evidencia la sostenía ni bajo qué criterio se decidió.»*

**ADS-00** sitúa **PO en orden 2** —*«máxima sobre el dominio. **Deroga de hecho cualquier definición divergente**»*— y **ADR en orden 4**. **R-2:** *«Un documento de categoría inferior **nunca podrá reinterpretar** a uno superior… **Nunca redefinirlo**.»*

> **«Asunto · mensaje · tono» es texto suelto con metadatos de forma — exactamente lo que PO-02 §3 declara insuficiente.**

### DDD-01 §9 — autoridad por concepto

**§9.2:** *«**Entidades, invariantes, eventos y casos de uso comerciales → ADR-16**, es la autoridad del modelo de dominio»* · *«**Qué se persiste, cuándo y con qué semántica → ADR-13**»*.

**§2.1**, fila `Proposal`: **Autoridad → ADR-16 §4.4** · *Desarrollado en* → PO-02 §3 · APS-18 §8 · **ADR-13 A-6**.

**§9.1:** *«**Autoridad** es quien decide… **qué lo delimita**. **Desarrollo** es quien detalla su contenido **sin poder cambiar sus límites**… ante discrepancia, **prevalece la autoridad, y el documento de desarrollo es el defectuoso**.»*

> **Para `Proposal`, ADR-13 figura como «Desarrollado en», no como autoridad. Su celda de contenido cambió los límites del concepto.**

### ADR-16 §4.4 — autoridad arquitectónica

> *«El artefacto de **un** contacto: **estrategia, evidencia y texto** **(PO-02 §3)**.»*
>
> **Contenido:** la estrategia *(APS-18 §8.1)* · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio.
>
> **P-I1:** *«**no es solo el texto** — sin estrategia y evidencia no puede explicarse después.»*

---

# 3. Cambio B — Ordenamiento de versiones

## 3.1 Texto actual — §10.3, V-2

```
| **V-2** | Existe siempre una **versión vigente**, que es la más reciente y la que se presenta al usuario |
```

> **«La más reciente» no declara respecto de qué.** Y **V-3** exige *conservar* la marca temporal como dato, **no ordenar por ella**. La ambigüedad la registró **COM-19 §9** en el Sprint 19 y ha permanecido abierta desde entonces.

## 3.2 Texto enmendado

```
| **V-2** | Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión (`issue`) dentro de su clave de identidad.** El número de emisión **forma parte de la identidad del agregado** (ADR-16 §4.2, §4.4) y es **monótono creciente por V-1**. **`issuedAt` es metadato temporal y NO determina la vigencia.** Aplica a los cuatro activos versionados de esta sección |
```

## 3.3 Regla normativa única

> ## **La identidad evolutiva de una emisión corresponde al número de emisión (`issue`). `issuedAt` es exclusivamente metadato temporal.**
>
> **No quedan dos criterios abiertos.** Todo componente que deba determinar la versión vigente **ordena por `issue`**.

## 3.4 Justificación

| # | Razón | Fundamento |
| :-: | --- | --- |
| **1** | **`issue` es identidad; `issuedAt` es atributo.** Ordenar por identidad no depende de ninguna decisión pendiente | **ADR-16 §4.2, §4.4** |
| **2** | **V-1 garantiza monotonía** — *«cada emisión nueva añade… ninguna retira»*. La marca temporal no tiene garantía equivalente | **ADR-13 §10.3 V-1** |
| **3** | **No tiene el modo de fallo de marcas empatadas.** El reloj tiene resolución finita; dos emisiones podrían compartir `issuedAt` y dejar la vigencia indeterminada | — |
| **4** | El origen de `issuedAt` **sigue sin decidirse** *(`COM-12 RC-4`)*. Ordenar por él haría depender la vigencia de una cuestión abierta | COM-12 RC-4 |

## 3.5 Consecuencia sobre `COM-12 RC-4`

> **RC-4 —origen de `issuedAt`— sigue abierta, y deja de ser bloqueante para la vigencia.** Con V-2 enmendada, decidir quién produce `issuedAt` **ya no altera qué versión es la vigente**.

## 3.6 Alcance por activo

| Activo | Versionado | V-2 aplica | Criterio |
| --- | :-: | :-: | --- |
| **A-4** Análisis | ✅ | ✅ | Mayor `issue` |
| **A-5** Opportunity Score | ✅ | ✅ | Mayor `issue` |
| **A-6** Propuesta | ✅ | ✅ | Mayor `issue` |
| **A-11** Diagnóstico Comercial | ✅ | ✅ | Mayor `issue` |
| **A-12** Secuencia Comercial | ❌ | ❌ **NO** | **Actualizable, no versionada** — §6.2 y §10.3 |

> ⚠️ **A-12 queda expresamente fuera.** *«**La Secuencia Comercial (A-12) no se versiona.** Se actualiza… **A-8 ya conserva íntegro el rastro de esos cambios**»* **(§10.3, sin cambios).** Su `currentMoment` es el **momento vigente del plan**, no una versión.

---

# 4. Cambio C — Garantías de identidad *(F-2)*

## 4.1 Texto añadido — §12.3, tras G-7

| # | Garantía | Origen |
| --- | --- | --- |
| **G-8** | **Unicidad de identidad.** El sistema **debe impedir múltiples registros con la misma identidad lógica** dentro del espacio de un usuario | ADR-16 §4.2, §4.3, §4.4 |
| **G-9** | **Atomicidad de la persistencia.** La creación **debe garantizar que operaciones concurrentes no produzcan duplicados** | §11.1 · R-30 |
| **G-10** | **Resolución determinista de conflictos.** Ante conflicto de identidad: **no duplicar · no sobrescribir silenciosamente · devolver un resultado determinista** | §10.2 · R-64 |

## 4.2 Especificación de la identidad lógica de G-8

**Las claves que G-8 protege, por activo:**

| Activo | Identidad lógica | Autoridad |
| --- | --- | --- |
| **A-1** Lead | `(Referencia de Origen, Usuario)` | ADR-12 §7.2 — **ya cubierta por G-6** |
| **A-6** Propuesta | `(Usuario, Lead, momento, número de emisión)` | ADR-16 §4.4 |
| **A-11** Diagnóstico | `(Usuario, Lead, número de emisión)` | ADR-16 §4.2 |
| **A-12** Secuencia | `(Usuario, Lead, número de secuencia)` | ADR-16 §4.3 · CS-I5 |

> **`Usuario` entra en las cuatro claves** por **ADR-05 §14** *(aislamiento entre usuarios)*, igual que en G-6.
>
> ⚠️ **`userId` es hoy un placeholder de un solo inquilino — deuda F-3.** Estas claves **la heredan y no la resuelven**.

## 4.3 Relación con G-6

**G-6 cubre A-1 y no se modifica.** **G-8 la generaliza a los tres activos comerciales**, que hasta ahora **no tenían garantía alguna**: las siete garantías G-1 a G-7 eran todas del Lead.

## 4.4 Qué NO hace este cambio

> **G-8, G-9 y G-10 son garantías exigidas a la persistencia. NO son implementación.**

| Elemento | Estado |
| --- | :-: |
| Requisitos del motor en **ADS-02 §3** | 🔴 **Pendiente** — §6 |
| Constraints, transacciones, esquema | ⛔ **No implementados.** F-2 Capa C |
| Adapters | ✅ **No tocados** |

---

# 5. Registro para el Historial de Versiones de ADR-13

**Fila a añadir:**

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.3** | 2026-08-04 | AKVEZ Architecture Team | **Enmienda consolidada de tres secciones.** **§6.2** — corrección de la columna «Contenido» de la fila A-6, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4. **§10.3** — se completa **V-2** declarando que la versión vigente es **la de mayor número de emisión**; `issuedAt` queda como metadato temporal. **§12.3** — se añaden **G-8** *(unicidad de identidad)*, **G-9** *(atomicidad)* y **G-10** *(resolución determinista de conflictos)*. **Ninguna otra sección resulta afectada:** §10.1, §10.2, §10.4, §11, §12.1, §12.2, §12.4 y §13 permanecen íntegros; **V-1, V-3, V-4, V-5 y G-1 a G-7 conservan su texto**. | **§6.2** contradecía **PO-02 §3** *(orden 2)*, que declara que una Propuesta *«no es solo el texto»*; conforme a **ADS-00 R-1 y R-3**, el documento de menor precedencia debe corregirse *(detectado en COM-34 §5.2, resuelto en COM-36/1)*. **§10.3** dejaba **V-2** sin criterio de orden, ambigüedad abierta desde **COM-19 §9** *(Sprint 19)* y con dos rellenos divergentes —ADS-02 §7 y el código—. **§12.3** carecía de garantía de identidad para los tres activos comerciales: **G-1 a G-7 son todas del Lead**, y **ADS-02 RQ-2 solo cubre A-1** *(deuda F-2, Capa A.2)*. Sprint **COM-39 — Architecture Governance Closure**. |

---

# 6. Documentos que esta enmienda obliga a actualizar

| # | Documento | Acción | Responsable | Estado |
| :-: | --- | --- | --- | :-: |
| **1** | **ADS-02 §3** | Añadir requisitos de motor que citen **G-8, G-9, G-10** como origen | Architecture Team · aprueba Product Office | 🔴 **Pendiente** |
| **2** | **ADS-02 §7** | Corregir *«Versión vigente distinguible… **marca temporal** por emisión»* → **mayor número de emisión**, citando V-2 enmendada | Architecture Team | 🔴 **Pendiente** |
| **3** | **COM-19 §9** | **Cerrar formalmente** — la pregunta queda respondida por §3.3 | Architecture Team | 🔴 **Pendiente** |
| **4** | **`docs/blueprint/ADR/ADR-13`** | **Aplicar los tres cambios y la fila v1.3** | Architecture Team | 🔴 **Pendiente** — §8 |

> ### ⚠️ **El punto 2 es el más urgente.** **ADS-02 §7 dice hoy lo contrario que V-2 enmendada**, y ADS-02 es el documento de referencia del motor real. Dejarlo sin corregir reintroduce exactamente la divergencia que el Cambio B cierra.

---

# 7. Impacto en el código

> **Ninguno con esta enmienda. Cero ficheros modificados.**

| Elemento | Efecto |
| --- | :-: |
| `shared/persistence/contracts/Proposal.ts` | ✅ **Ya conforme** con el Cambio A — replica ADR-16 §4.4 |
| `inMemoryProposalAdapter.findCurrentByMoment` | ✅ **Ya conforme** con el Cambio B — ordena por mayor `issue` |
| `inMemoryBuyerDiagnosisAdapter` | ✅ **Ya conforme** con el Cambio B |
| `contracts/OutreachPitch.ts` · `domain/OutreachPitch.ts` · `OutreachPitchRepository.ts` | ⚠️ **Pierden respaldo canónico** por el Cambio A — **pero NO se retiran**: **ADR-08 §13 sigue nombrando el repositorio como trabajo pendiente** *(COM-34 §6.1)* |
| Constraints y transacciones de G-8/G-9/G-10 | ⛔ **No implementadas.** Requieren ADS-02 §3 *(§6, punto 1)* |

**197 pruebas verdes. Ningún fichero de código modificado.**

## 7.1 ⚠️ Dos decisiones de código quedan regularizadas

**El Cambio B convierte en norma lo que el código ya hacía sin autoridad:**

| Decisión | Antes | Ahora |
| --- | :-: | :-: |
| Ordenar por `issue` en `findCurrentByMoment` | 🔴 Aplicada **sin respaldo documental** *(B-5)* | ✅ **Conforme a V-2 enmendada** |

> **Es regularización, no validación retroactiva.** La decisión se toma ahora, por su propio fundamento *(§3.4)*, y el código resulta conforme. **Si el fundamento hubiera llevado a `issuedAt`, el código habría tenido que cambiar.**

---

# 8. ⚠️ Nota de ubicación

**Este documento es la enmienda, no el ADR enmendado.**

`docs/blueprint/ADR/ADR-13 — Canonical Persistence Engine.md` **no ha sido modificado en este sprint**: el sprint restringe la modificación a documentación arquitectónica en `docs/architecture/`.

> **Aplicar los tres cambios al fichero del Blueprint y registrar la fila v1.3 en su Historial es un acto pendiente** *(§6, punto 4)*, que corresponde al Architecture Team con la aprobación registrada en la cabecera de esta enmienda.
>
> **Se registra para que la diferencia no se descubra más tarde.**

---

# 9. Referencias

**ADS-00 v1.3** — *Orden Oficial de Precedencia*, R-1, R-2, R-3, R-5, R-7 · **PO-02 v1.3** §3 · **APS-13** §9 · **APS-18 v1.2** §8, §8.1 · **APS-19 v1.1** §4.3 · **ADR-05 v1.4** §14 · **ADR-08 v1.2** §13 · **ADR-09 v1.3** §6 · **ADR-12 v1.1** §7.2, §12.2 · **ADR-13 v1.2** §6.2, §10.1, §10.2, §10.3, §11.1, §12.1, §12.3, §12.4, §13 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **ADS-01 v1.4** §3.1 · **ADS-02 v1.1** §3, §7 · **ARCH-01 v1.3** · **DDD-01 v1.1** §2.1, §4.2, §9.1, §9.2 · **DEV-00** R-30, R-31, R-64 · **AR-05** §5.1, RC-10 · **COM-12** RC-4 · **COM-19** §9, §10 · **COM-22** §4.2 · **COM-34** a **COM-38**.
