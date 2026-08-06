# ADR-18 — Perfil de Estrategia

| Campo | Valor |
| --- | --- |
| Código | **ADR-18** *(provisional — la asignación definitiva corresponde al Product Office)* |
| Clasificación | Architecture Decision Record — Gobernanza de artefacto |
| Versión | 0.1 |
| Estado | 🟡 **Draft — propuesta. No prevalece sobre ningún documento `Approved`** *(ADS-00 R-4)* |
| Fecha de creación | 2026-08-01 |
| Responsable | Ingeniería |
| Aprobado por | — **pendiente de AKVEZ Product Office y Architecture Team** |
| Estándar aplicado | ADS-00 v1.3 |
| Resuelve | La gobernanza del **Perfil de Estrategia** que **ADR-15 §7.4** declara `Pospuesta` y exige resolver en ADR propio |

> **Naturaleza del documento.** ADR-15 §7.4 declaró que el Perfil de Estrategia **existe**, que su owner es el **Product Office** y que su gobernanza **exige un ADR propio**. Este documento es esa propuesta.
>
> **No inventa el problema ni la solución: los transcribe de un precedente.** ADR-14 resolvió la gobernanza del **Perfil de Ponderación** —el artefacto equivalente para el Opportunity Score— y su materialización en código ya existe y funciona. Este ADR aplica esa misma estructura al criterio comercial.
>
> **Mientras esté `Draft` no obliga a nada**, y `SIN-PERFIL-DE-ESTRATEGIA` sigue siendo la representación correcta de la ausencia.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 0.1 | 2026-08-01 | Ingeniería | Creación como propuesta. Define la naturaleza del artefacto (§5), su owner (§6), dónde vive (§7), cómo se versiona (§8), el contenido mínimo de una versión (§9) y la gobernanza de `criteriaVersion` (§10), con **doce reglas SP-01 a SP-12** (§12). | Sprint 04 · Fase 3. **ADR-15 §7.4** lo exige y **`GenerateProposal` no puede escribirse sin él**: ADR-15 §7.2 hace de la versión del Perfil una de las tres variables del determinismo de la estrategia. |

---

# 1. Resumen Ejecutivo

**AKVEZ sabe qué decide el criterio comercial y no sabe quién lo cambia ni cómo se acredita.**

El Blueprint declara que toda estrategia emitida se vincula a una versión del Perfil *(RA-7)* y que toda entidad emitida la conserva *(RC-13)*. **Ningún documento dice qué es esa versión, quién la emite ni dónde vive el artefacto.** Mientras solo se emitían diagnósticos y secuencias, la ausencia era declarable. **`GenerateProposal` la vuelve terminal.**

Cinco decisiones:

| # | Decisión | Sección |
| :-: | --- | --- |
| **1** | El Perfil es un **artefacto gobernado**, no un Value Object ni una configuración | §5 |
| **2** | Su owner es el **Product Office**, y **el código nunca emite una versión** | §6 · §10 |
| **3** | **El criterio se publica en APS-18; `domain/` lo transcribe.** Misma mecánica que APS-08 §7.1 → `weightingProfile.ts` | §7 |
| **4** | Toda versión publicada es **inmutable**. Cambiar el criterio es **publicar una versión nueva** | §8 |
| **5** | Las emisiones producidas bajo ausencia declarada **no se reetiquetan** | §10.4 |

---

# 2. Objetivo

- Cerrar la gobernanza que **ADR-15 §7.4** dejó `Pospuesta`.
- Definir **qué es** el Perfil, **quién lo cambia** y **dónde vive**, que son tres preguntas distintas.
- Reglar `criteriaVersion` de modo que **RC-13 sea verificable** y no una declaración de intenciones.
- Habilitar `GenerateProposal` sin introducir deuda arquitectónica.

---

# 3. Alcance

## 3.1 Incluye

La naturaleza del artefacto, su propiedad, su ubicación documental y en código, su régimen de versionado, el contenido mínimo de una versión y la gobernanza de `criteriaVersion`.

## 3.2 No incluye

- **El contenido del criterio comercial.** Qué objetivo corresponde a qué momento y qué enfoque a qué identidad profesional lo decide **APS-18**, que es su autoridad *(DDD-01 §9.2)*. Este ADR gobierna el artefacto, no lo escribe.
- **La `Commercial Strategy`**, que es un Value Object ya definido *(APS-18 §8 · DDD-01 §3.6)*.
- **`GenerateProposal`**, su punto de control y su lista cerrada *(ADR-15 §10 · ADR-16 §7)*.
- **La producción de hechos afirmables** *(COM-04, y en última instancia APS-08 y APS-19)*.
- **Cualquier código.** Las referencias a ficheros son descriptivas.

---

# 4. Contexto

## 4.1 Lo que ya está decidido

| Documento | Qué aporta |
| --- | --- |
| **ADR-15 §7.2** | La estrategia es **determinista** dado el mismo diagnóstico, el mismo estado y **la misma versión del Perfil**. *«Es lo que la hace explicable y comparable, y la razón de que no viva en un prompt»* |
| **ADR-15 §7.4 (RA-7)** | El Perfil existe · owner **Product Office** · **⏸️ gobernanza `Pospuesta`, exige ADR propio** · *«consumirlo y vincular a él toda estrategia emitida»* |
| **ADR-16 RC-13** | **Toda entidad emitida conserva la versión del criterio que la produjo** |
| **DDD-01 §8** | Sinónimos **prohibidos**: `Configuración`, `Parámetros`. *«Un parámetro se ajusta; esto se versiona y vincula a cada emisión»* |
| **APS-18** | **Es la autoridad del criterio comercial**: principios, estrategia, secuencia, evidencia *(DDD-01 §9.2)* |

## 4.2 El precedente que resuelve casi todo

**El mismo problema se resolvió para el Opportunity Score y funciona en producción.**

`server/modules/lead-analyzer/domain/weightingProfile.ts` declara en su cabecera:

> *«ESTE FICHERO NO DECIDE NADA. Transcribe los valores publicados en **APS-08 §7.1** y cumple el contenido mínimo que exige **ADR-14 §7.2**. Si los pesos de APS-08 cambian, este fichero NO se edita: se publica una versión nueva, porque **R-INM** declara inmutable toda versión publicada.»*

**Siete correspondencias, una a una:**

| Aspecto | Perfil de Ponderación | Perfil de Estrategia |
| --- | --- | --- |
| Qué gobierna | El cálculo del Score | El criterio comercial |
| Autoridad de gobernanza | **ADR-14** | **Este ADR** |
| Autoridad del contenido | **APS-08 §7.1** | **APS-18** |
| Versión vigente | **WP-01** | **SP-01** *(a publicar)* |
| Quién puede cambiarlo | **Product Office** *(§8.1)* | **Product Office** *(ADR-15 §7.4)* |
| Vinculación a la emisión | **R-VIN** · ADR-13 V-4 | **RC-13 · RA-7** |
| Inmutabilidad | **R-INM** | **SP-04** *(§8)* |

> **Este ADR no innova: extiende un patrón probado a un segundo artefacto.** Es la vía con menor riesgo de introducir un vocabulario paralelo, que es el modo de fallo que DDD-01 existe para evitar.

---

# 5. Decisión — qué es el Perfil de Estrategia

> **El Perfil de Estrategia es un artefacto gobernado y versionado que codifica el criterio comercial: la correspondencia entre lo que se sabe de un comprador y las decisiones que gobiernan un contacto.**

**No es un Value Object.** El Value Object es la `Commercial Strategy` —el resultado de aplicar el criterio a un contacto concreto—, y **confundirlos es el error de partida**: uno es la regla, el otro su producto.

**No es configuración.** Un parámetro se ajusta sin dejar rastro; **esto se versiona y se vincula a cada emisión** *(DDD-01 §8)*.

**No es un activo de la Biblioteca.** No describe un Lead ni pertenece a un usuario: gobierna a todos por igual. **No entra en el catálogo de ADR-13 §6.2 y no necesita evento de escritura**, de modo que la regla de cierre de §13.4 **no resulta afectada**.

## 5.1 Qué contiene y qué no produce

**El Perfil es una tabla de correspondencias, no un contenedor de datos.** De los diez contenidos de una `Commercial Strategy` *(APS-18 §8.1)*, **no aporta ninguno directamente**: aporta la regla que determina cuatro de ellos.

| Contenido de la estrategia | Papel del Perfil |
| --- | --- |
| **Objetivo** *(Micro-Yes)* · **Enfoque** · **Resultado esperado** | **Fija la correspondencia** que lo determina |
| **Barrera** | APS-18 §9.2 la tabula por momento; el Perfil **puede matizarla** *(§11, cuestión abierta 1)* |
| Base de evidencia · Emoción · Hilos · Elemento de relevancia · Canal y momento | **Ninguno** — los determinan el análisis, un conjunto cerrado, la memoria de la secuencia o APS-20 |

**Es lo que lo hace pequeño, auditable y comparable entre versiones**, y lo que justifica versionarlo en lugar de configurarlo.

---

# 6. Propiedad

> **El Perfil de Estrategia pertenece al Product Office.** *(ADR-15 §7.4 · DDD-01 §2.2)*

| Acto | Quién | Nunca |
| --- | --- | --- |
| Aprobar el criterio | **Product Office** | Ingeniería |
| Publicar una versión y su designación | **Product Office** | El código |
| Transcribirlo a `domain/` | Ingeniería | Alterando su contenido |
| Consumirlo | El dominio comercial | Ampliándolo |

---

# 7. Dónde vive — dos lugares, y ninguno es opcional

| Plano | Dónde | Qué contiene |
| --- | --- | --- |
| **Documental** | **APS-18**, su autoridad de contenido | El criterio y su designación de versión |
| **Código** | `modules/pitch-generator/domain/` | Una **transcripción** del criterio publicado, sin decidir nada |

**La transcripción no es una copia informal:** replica el mecanismo de `weightingProfile.ts`, cuyo fichero declara expresamente que no decide y que **no se edita cuando el criterio cambia** — se publica una versión nueva.

> **Por qué en `domain/` y no en `shared/config/`.** El criterio es **contenido de dominio**, no configuración de entorno. **No es un parámetro operativo** en el sentido de R-50/R-52: no limita el conjunto de Leads, y supera el Criterio de Invariancia de DEV-00 §3.6 — cambiar el criterio altera **cómo se aborda** un Lead, nunca **qué Leads existen o son alcanzables**. Es el mismo razonamiento con que APS-08 §7.1 (RV-D) situó los pesos fuera de APS-17.

---

# 8. Versionado

| # | Regla |
| --- | --- |
| **SP-03** | Una versión se identifica con una **designación asignada por el Product Office** al aprobarla. La primera es **`SP-01`**, por paralelismo con `WP-01` |
| **SP-04** | **Toda versión publicada es inmutable.** Cambiar el criterio **no edita la versión vigente: publica una nueva** |
| **SP-05** | **Ninguna versión nueva invalida las emisiones producidas con la anterior.** Se conservan íntegras y siguen siendo explicables con su propia versión — misma decisión que **ADR-14 §6.6** tomó para el Score |
| **SP-06** | **Existe siempre a lo sumo una versión vigente.** Coexisten en el registro; solo una produce estrategias nuevas |

---

# 9. Contenido mínimo de una versión

Por paralelismo con **ADR-14 §7.2**, toda versión publicada declara:

| # | Elemento |
| --- | --- |
| **C-1** | **Designación** — `SP-nn` |
| **C-2** | **Fecha de aprobación** y autoridad que la aprueba |
| **C-3** | **La correspondencia** *(diagnóstico + momento)* → objetivo · enfoque · resultado esperado |
| **C-4** | **Referencia a la sección de APS-18** que publica el criterio |
| **C-5** | **Versión a la que sucede**, si la hay |
| **C-6** | **Motivo del cambio**, si sucede a otra |
| **C-7** | **Evidencia que lo sostiene**, si sucede a otra |

> **C-5 a C-7 no se exigen a la primera versión**, exactamente como ADR-14 §7.2 exime a la suya.

---

# 10. `criteriaVersion` — gobernanza

## 10.1 Quién la genera

> **El Product Office, al aprobar una versión. Nunca el código.**

**Tres prohibiciones expresas**, alineadas con el enunciado del sprint:

| Prohibido | Por qué |
| --- | --- |
| **Generar la versión automáticamente desde código** | Un identificador que el sistema se asigna a sí mismo **no acredita ninguna decisión de gobierno**, y vaciaría RC-13 de contenido |
| **Usar una marca temporal como versión** | Una fecha registra *cuándo* se emitió, no *bajo qué criterio*. Dos emisiones del mismo día pueden responder a criterios distintos, y una versión debe poder **repetirse**, no solo ordenarse |
| **Crear un `"v1"` provisional** | Sería *«un valor por defecto que sustituye a un dato que no existe»* — **R-38 · RC-10 · BD-R2**— y produciría **apariencia de trazabilidad sin trazabilidad** |

## 10.2 Cuándo una emisión puede llevar versión válida

> **Cuando existe una versión publicada del Perfil.** No cuando existe este ADR.

Este ADR decide **qué es** el Perfil y **quién lo cambia**. **La publicación de `SP-01` es un acto posterior**, igual que `WP-01` lo fue respecto de ADR-14.

## 10.3 Cómo se representa la ausencia

> **Con el marcador `SIN-PERFIL-DE-ESTRATEGIA`, ya en uso.**

Cumple lo que **RE-3** exige —*«lo desconocido se declara, no se disimula»*—, es **imposible de confundir con una designación** y es **localizable por búsqueda exacta**, que es lo que hace la migración verificable.

## 10.4 Migración desde la ausencia

> **Las emisiones producidas bajo ausencia declarada no se reetiquetan.**

Se emitieron sin criterio versionado, y **eso es un hecho histórico**. Reetiquetarlas afirmaría que se produjeron bajo un criterio que no existía — una falsedad, contraria al **Principio 2 de AF-00**, y una destrucción de conocimiento que **ADR-13 §10.2** prohíbe: también es conocimiento saber que algo se decidió sin criterio publicado.

**Consecuencia operativa:** tras publicar `SP-01`, conviven emisiones con designación y emisiones con el marcador. **Es correcto y debe seguir siéndolo.**

---

# 11. Cuestiones abiertas que este ADR somete al Product Office

1. **¿Puede el Perfil matizar la barrera que APS-18 §9.2 tabula por momento**, o esa tabla es intocable? De la respuesta depende C-3.
2. **¿La designación es `SP-nn` o la fija APS-18 con otro esquema?** Se propone `SP-nn` por paralelismo con `WP-01`.
3. **¿Se publica el criterio en APS-18 o en un anexo propio?** Se propone APS-18, que es su autoridad.

---

# 12. Reglas Vinculantes *(propuestas)*

| # | Regla |
| --- | --- |
| **SP-01** | El Perfil de Estrategia es un **artefacto gobernado**, no un Value Object y no configuración |
| **SP-02** | **Pertenece al Product Office.** Ingeniería lo transcribe; nunca lo decide |
| **SP-03** | Toda versión lleva **designación asignada por el Product Office** |
| **SP-04** | **Toda versión publicada es inmutable** |
| **SP-05** | Una versión nueva **no invalida** las emisiones anteriores |
| **SP-06** | A lo sumo **una versión vigente** |
| **SP-07** | **El código nunca genera una versión** |
| **SP-08** | **Ninguna marca temporal es una versión** |
| **SP-09** | **No existe versión provisional.** La ausencia se declara |
| **SP-10** | **Las emisiones bajo ausencia no se reetiquetan** |
| **SP-11** | El criterio **se publica en su autoridad documental**; `domain/` **transcribe y no decide** |
| **SP-12** | El Perfil **no contiene** contacto individual, canal de envío, texto generado, propuesta, prompts, parámetros operativos, credenciales, umbrales de exclusión ni datos personales *(COM-03 §7)* |

---

# 13. Riesgos

| # | Riesgo | Severidad |
| --- | --- | --- |
| **RA18-1** | **Que el Perfil se implemente como configuración editable en caliente.** Rompería la reproducibilidad **sin que ninguna prueba lo detecte**: el sistema seguiría funcionando y las emisiones dejarían de ser explicables | **Alta** |
| **RA18-2** | **Que se apruebe este ADR y no se publique `SP-01`.** El bloqueo de `GenerateProposal` permanecería, y la apariencia de resolución es peor que la ausencia declarada | **Alta** |
| **RA18-3** | Que la transcripción a `domain/` **derive** del criterio publicado. Mitigación: la cabecera declarativa de `weightingProfile.ts` como patrón obligatorio | Media |

---

# 14. Definition of Done

1. Pronunciamiento del Product Office sobre las **tres cuestiones abiertas** de §11.
2. Ratificación o enmienda de las **doce reglas** de §12.
3. Asignación del **código oficial** del documento.
4. **Publicación de `SP-01`** — acto separado, sin el cual `GenerateProposal` sigue bloqueado.

---

# 15. Referencias

**ADR-13** §6.2, §10.2, §13.4, V-4 · **ADR-14** §6.6, §7, §7.2, §8.1, R-VIN, R-INM · **ADR-15** §7.2, §7.4, RA-7 · **ADR-16** §7, RC-13 · **APS-08** §7.1, RV-D · **APS-18** §8, §8.1, §9.2 · **AF-00** Principio 2 · **DDD-01** §2.2, §3.6, §8, §9.2 · **DEV-00** §3.6, R-38, R-50, R-52 · **COM-03**.
