# AR-01 — Evaluación Arquitectónica Final del Dominio Empresa → Lead

| Campo | Valor |
| --- | --- |
| Código | AR-01 |
| Clasificación | Architectural Assessment — Cierre de Investigación |
| Versión | 1.1 |
| Estado | **Archived** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Dirigido a | AKVEZ Product Office |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad vigente sobre esta materia | **PO-01** · APS-07 v2.0 · APS-03 v3.0 |

> **Naturaleza.** Documento de cierre. No aporta evidencia nueva, no reinterpreta documentos, no formula hipótesis y no intenta resolver las preguntas abiertas. Consolida el conocimiento producido por seis documentos previos y transfiere formalmente las decisiones pendientes al Product Office.

---

> # ⚠ Documento archivado — Investigación cerrada y resuelta
>
> **Este documento fue archivado tras la aprobación de PO-01.**
>
> **Se conserva exclusivamente con fines históricos y de trazabilidad.** Es el cierre formal de la investigación arquitectónica sobre el dominio Empresa → Lead y el documento que transfirió las decisiones pendientes al Product Office. **Investigación cerrada. Resuelta por PO-01.**
>
> **No es autoridad vigente. No debe utilizarse para diseñar arquitectura ni para fundamentar ninguna decisión.**
>
> **Advertencia específica.** Su §6 enumera **preguntas bloqueadas**, su §7 **decisiones arquitectónicas pendientes** y su §9 el **estado final de los documentos** en la fecha de redacción. **Los tres quedaron obsoletos el 2026-07-29.** Ninguna pregunta sigue bloqueada, ninguna decisión sigue pendiente y ningún estado de §9 refleja la situación actual. Citarlos como vigentes describiría un Blueprint que ya no existe.
>
> **Estado real de lo que este documento dejó abierto:**
>
> | Materia | Situación vigente |
> | --- | --- |
> | Las cinco preguntas de §6, con prioridad sobre **Q-5** | **Todas resueltas** por PO-01 §1-§8 |
> | Vacío **V-5** — jerarquía documental no declarada | **Subsanado.** ADS-00 v1.2, *Jerarquía Documental y Regla de Precedencia* |
> | Decisiones pendientes de §7 | **Emitidas.** PO-01 · ADR-11 v2.0 · ADR-12 · ADR-13 · ADR-14 |
> | Estado de los documentos (§9) | **Obsoleto.** Véase la corrección de §9 al final de esa sección |
> | **H-04** *(implementación)* — «Vigente — temporal» | **Revertida** por PO-01 §9.4. Su ejecución corresponde a la Fase 5 de PLAN-01 |
>
> **Qué conserva valor.** Su consolidación de la investigación, sus refutaciones **R-01 a R-08** —cuatro de las cuales anticiparon correctamente lo que PO-01 decidió— y su identificación del vacío V-5, que resultó ser la causa raíz de todo el problema.
>
> **Ninguna sección ha sido eliminada, reescrita ni renumerada.**

---

> ## Nota de excepción — Estado anterior no contemplado
>
> Este documento declaraba el estado **`Cerrado`**, que **no pertenece** a la clasificación oficial de ADS-00 (*Estados del Documento*): `Draft` · `Review` · `Approved` · `Deprecated` · `Archived`.
>
> Su normalización a `Archived` fue una **decisión excepcional del Product Office**, ejecutada en la Fase 3 de PLAN-01. `AF-01-DIAG-001` no define transición alguna desde un estado que no reconoce. **No constituye precedente.**
>
> Corresponde a las deudas **DT-01** (ADR-10, nota de excepción) y **H-07** (REV-03 §4), cuyo alcance se extiende ahora a este documento. Conforme a ADS-00 v1.2 **R-6**, quedan elevadas al Product Office.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | AKVEZ Architecture Team | Redacción inicial. Consolida seis documentos de investigación, registra ocho refutaciones (R-01 a R-08), identifica cinco vacíos —entre ellos V-5, la ausencia de jerarquía documental— y transfiere cinco preguntas al Product Office. | Cerrar formalmente la investigación arquitectónica sobre el dominio Empresa → Lead y delimitar qué solo podía decidir el Product Office. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Cambio de estado documental: `Cerrado` → `Archived`.** Se añaden la nota de archivo, la nota de excepción, este historial, la corrección de estado al final de §9 y la actualización de referencias en §11. **No se modifica ningún contenido histórico:** ninguna sección eliminada, reescrita ni renumerada. | Fase 3 de PLAN-01, cierre del hallazgo **H-06** de REV-03, y normalización del estado inexistente registrado como **H-07**. Las cinco preguntas transferidas al Product Office quedaron resueltas por **PO-01** (Approved, 2026-07-29). |

---

# 1. Resumen Ejecutivo

## 1.1 Qué originó la investigación

Una auditoría de persistencia detectó que el flujo de adquisición almacenaba todos los negocios descubiertos (~74 por búsqueda) y entregaba solo una fracción (10), dejando entre el 85 % y el 90 % de los registros sin uso posible.

El diagnóstico inicial fue de implementación. Resultó ser de dominio: **el Blueprint nunca define qué convierte una Empresa en un Lead**, y sin esa definición no puede determinarse qué debe almacenarse.

## 1.2 Documentos producidos

| Documento | Propósito | Aportación principal |
| --- | --- | --- |
| **ADR-10** | Ubicación de la persistencia en el flujo | Estableció que la posición depende del significado del repositorio |
| **ADR-10A** | Definición canónica de Empresa y Lead | Matriz de consistencia; regla de precedencia derivada |
| **ADR-11** | Ubicación de la capacidad de selección | Identificó el truncamiento como operación sin respaldo documental |
| **DP-01** | Ciclo de vida canónico | Demostró que la transición `Empresa → Lead` carece de etapa y de agente |
| **REV-01** | Revisión del dominio canónico | Redujo el problema completo a una única contradicción |
| **REV-02** | Revisión documental de Q-2 | Demostró que el Blueprint es insuficiente para resolverla |

## 1.3 Qué quedó resuelto

Doce hechos con nivel **demostrado** (§2), entre ellos las definiciones de Empresa y de Lead, la naturaleza de la relación entre ambas y tres de las cuatro transiciones del ciclo de vida.

## 1.4 Qué permanece abierto

Dos preguntas bloqueadas (§6) y seis vacíos documentales (§5). Todos convergen en un mismo punto: **el momento en que una Empresa se convierte en Lead**.

---

# 2. Hallazgos Confirmados

Solo hechos demostrados por cita literal. Sin interpretación.

| # | Hallazgo | Documento · Sección | Cita resumida |
| --- | --- | --- | --- |
| H-01 | Definición de Empresa | APS-07 §5 | «Información pública sobre negocios» |
| H-02 | Definición de Lead — tres fuentes **concordantes** | APS-07 §5 · APS-02 Glosario · ADR-05 §10 | «Empresas identificadas como oportunidades comerciales» · «posible cliente» · «Representa una oportunidad comercial» |
| H-03 | Empresa y Lead son **estados de un mismo sujeto**, no entidades distintas | APS-07 §6 | «Cada **empresa evolucionará** progresivamente dentro del sistema» |
| H-04 | Las transiciones son **acumulativas** | APS-07 §6 | «sin reemplazar la información anterior» |
| H-05 | Orden canónico de **estados** | APS-07 §6 | `Empresa → Lead → Lead Analizado → Opportunity Score → Pitch` |
| H-06 | Orden canónico de **etapas** | APS-07 §7 | `Descubrimiento → Registro → Análisis → Evaluación → Propuesta` |
| H-07 | El **Registro precede al Análisis** | APS-07 §7 · APS-03 §7, §8 | Secuencia literal; Lead Hunter precede al Lead Analyzer |
| H-08 | Análisis y Evaluación pertenecen al **Lead Analyzer** | APS-03 §7 | «Calcular el Opportunity Score» |
| H-09 | La **priorización es capacidad del negocio** | APS-01 §5-§7 · APS-08 §8 · APS-03 Glosario | «baja priorización de oportunidades» · «Debe aparecer entre los primeros resultados» · «análisis y priorización» |
| H-10 | Un Lead **no requiere** estar analizado, ni superar umbral, ni pertenecer a un Top N, ni poseer Opportunity Score | Búsqueda exhaustiva (17 APS · 11 ADR) | Cuatro demostraciones negativas |
| H-11 | Evitar duplicados es **criterio de éxito de la V1** | APS-02 §9 | «la Biblioteca de Leads evite correctamente los duplicados» |
| H-12 | Cada registro de la Biblioteca debe incluir **once campos mínimos** | APS-07 §8 | Incluye «Estado del análisis», «Opportunity Score», «Fecha de descubrimiento» |
| H-13 | El diagrama normativo de APS-03 **no contiene ninguna escritura** de Lead Hunter a la Biblioteca | APS-03 §17.2 · APS-03-DIAG-002 v2.1 | Única flecha: `LH->>DS: Verificar duplicados` |
| H-14 | ADR-05 sitúa la Biblioteca de Leads entre las **evoluciones futuras** habilitadas por su arquitectura | ADR-05 §1 | Listada junto a «CRM Agent», «Follow-up Agent», «Scheduler Agent» |
| H-15 | **Ningún documento declara** que la Biblioteca de Leads y el `LeadRepository` sean el mismo almacén | ADR-05 §10-§12 · ADR-04 §3 | ADR-05 emplea solo `LeadRepository`; ADR-04 la llama «la **futura** Biblioteca de Leads de APS-03» |
| H-16 | Las seis referencias al **contenido** de la Biblioteca dicen «empresas»; ninguna dice «leads» | APS-02 §6 y Glosario · APS-03 Glosario · APS-07 §8 y Glosario | — |

---

# 3. Hallazgos Refutados

Hipótesis descartadas durante la investigación, con el motivo documental de su descarte.

| # | Hipótesis refutada | Motivo del descarte | Sostenida originalmente en |
| --- | --- | --- | --- |
| R-01 | **Un Lead nace al analizarse** | APS-07 §6 sitúa `Lead` **antes** de `Lead Analizado`. ADR-05 §12 muestra al Lead Analyzer «**Actualizar** lead», lo que presupone su existencia previa | ADR-10 (implícito) |
| R-02 | **Un Lead nace al superar un umbral de Opportunity Score** | APS-07 §6 sitúa el Opportunity Score **dos estados después** del Lead. APS-08 define cinco bandas pero **no declara ningún umbral de cualificación** | ADR-10A §5.5 |
| R-03 | **El Top N forma parte del Blueprint** | Búsqueda exhaustiva sobre 17 APS y 11 ADR con ocho patrones distintos: **cero referencias** a cupo, tope o cantidad máxima. APS-08 §8 define bandas hasta `0-39`, lo que sería inútil si esas oportunidades nunca se presentaran | Implementación vigente |
| R-04 | **La selección/priorización no es una capacidad del negocio** | APS-01 §5 declara «baja priorización de oportunidades» como problema que AKVEZ resuelve; APS-01 §6 promete «las mejores oportunidades»; APS-08 §8 norma el orden de presentación | ADR-11 §4 — **premisa central del documento** |
| R-05 | **El bloque `Scoring` de ADR-02 §8 carece de implementación** | APS-03 §7 asigna «Calcular el Opportunity Score» al Lead Analyzer. La capacidad ya reside donde el Blueprint la sitúa | ADR-10 §4.3 |
| R-06 | **El campo «Estado del análisis» demuestra que existen registros no analizados** | El término admite dos lecturas gramaticalmente equivalentes en español —estado del proceso o estado resultante— y APS-07 §8 no permite elegir. **Degradado de «evidencia decisiva» a interpretación** | ADR-10A §4.1 |
| R-07 | **La Biblioteca debe contener todo lo descubierto (divergencia D-2)** | APS-02 §6 y tres glosarios dicen «empresas ya analizadas». Es una **contradicción no resuelta del Blueprint**, no una divergencia de la implementación | ADR-11 §9.1 |
| R-08 | **La hipótesis «el Lead nace al registrarse» tiene viabilidad baja-media** | ADR-05 §4, §11, §12 y §15 la sostienen de forma convergente. Reclasificada como **la mejor sostenida**, aunque sigue sin ser demostrada | DP-01 §6 |

---

# 4. Contradicciones Documentales Reales

Solo contradicciones confirmadas por cita literal. No se incluyen hipótesis.

| # | Contradicción | Documentos | Naturaleza | Impacto arquitectónico |
| --- | --- | --- | --- | --- |
| **X-1** | ¿Lead Hunter guarda **empresas** o **leads**? | APS-03 §7 vs ADR-05 §12 | Mismo agente, misma posición en la secuencia, mismo acto; **sustantivo distinto** | **Bloqueante.** Es la contradicción central de toda la investigación |
| **X-2** | ¿La Biblioteca contiene todo lo descubierto o solo lo analizado? | APS-07 §8 vs APS-02 §6, APS-02/APS-03/APS-07 Glosarios | «historial **completo** de cada empresa» frente a «empresas **ya analizadas**» | **Bloqueante.** Determina el contenido del núcleo de conocimiento |
| **X-3** | ¿Lead Hunter analiza? | APS-02 Glosario vs APS-03 §7 | «descubrir **y analizar**» frente a responsabilidades que no incluyen análisis | Medio. Afecta la frontera entre agentes |
| **X-4** | ¿La Evaluación precede o sigue al Análisis? | APS-07 §6-§7 vs ADR-02 §8 | Orden incompatible entre estados/etapas y modelo de ejecución | Alto. Condiciona el orden canónico del flujo |
| **X-5** | ¿El Opportunity Score puntúa una Empresa o un Lead? | APS-08 Glosario vs APS-02/APS-03 Glosarios | Sujeto distinto para el mismo indicador | Bajo |
| **X-6** | ¿El Lead Analyzer prioriza? | APS-03 Glosario vs APS-03 §7 | **Contradicción interna de APS-03** | Bajo |
| **X-7** | El activo se llama «Biblioteca de **Leads**» pero su contenido declarado son **empresas** | APS-03 §7, APS-07 §7-§8 | El nombre no describe el contenido | Medio. Terminológico |
| **X-8** | ¿La escritura forma parte del flujo de APS-03? | APS-03 §7 vs APS-03 §8 y §17.2 | **Contradicción interna de APS-03.** §7 declara la responsabilidad de registrar; §8 (seis pasos) y el diagrama APS-03-DIAG-002 **la omiten** | **Alto.** Debilita a APS-03 como fuente para resolver X-1 |
| **X-9** | ¿Biblioteca de Leads y `LeadRepository` son el mismo almacén? | ADR-05 §1 vs ADR-05 §10-§12 · ADR-04 §3 | ADR-05 la lista como evolución **futura** y a la vez especifica un repositorio de leads sin declarar su identidad | **Bloqueante.** Sin esta identidad, X-1 podría no versar sobre la misma proposición |

---

# 5. Vacíos Documentales

Aquello que el Blueprint **nunca define**. No se proponen soluciones.

| # | Vacío | Verificado en |
| --- | --- | --- |
| **V-1** | **El evento que transforma una Empresa en Lead.** Ningún documento lo enuncia. APS-07 §6 declara el orden sin declarar la causa; APS-07 §7 enumera cinco etapas y ninguna produce el estado `Lead` | APS-07 §6-§7 · APS-03 §7-§8, §17.2 · APS-08 · ADR-05 §4, §10, §12, §15 |
| **V-2** | **El criterio de admisión de la Biblioteca de Leads.** APS-02 describe el contenido, APS-03 la operación, APS-07 §8 la estructura del registro; ninguno la condición de entrada | APS-02 §6 · APS-03 §7 · APS-07 §8 |
| **V-3** | **La enumeración de estados del Lead.** ADR-05 §10 declara el campo `status` sin valores posibles | ADR-05 §10 |
| **V-4** | **El umbral oficial de cualificación.** APS-08 §8 define cinco bandas y su prioridad relativa, pero no qué banda constituye una oportunidad válida | APS-08 §8 |
| **V-5** | **La jerarquía documental del Blueprint.** No existe declaración de precedencia entre documentos | INDEX · ADS-00 · AF-00 |
| **V-6** | **La identidad entre la Biblioteca de Leads y el repositorio de ADR-05** | ADR-04 §3 · ADR-05 §1, §10-§12 |

---

# 6. Preguntas Bloqueadas

> **Las siguientes preguntas NO pueden responderse mediante análisis documental. Requieren decisión del Product Office.**

| # | Pregunta | Motivo del bloqueo |
| --- | --- | --- |
| **Q-1** | ¿Qué evento transforma una Empresa en Lead? | V-1. El Blueprint no lo enuncia en ninguno de los seis pasajes que describen el recorrido |
| **Q-2** | ¿Lead Hunter guarda Empresas o Leads? | X-1, agravada por X-8 (APS-03 se contradice a sí mismo) y X-9 (la identidad de los almacenes no está declarada) |
| **Q-3** | ¿Qué contiene la Biblioteca de Leads? | X-2. Dos posturas, ambas en documentos aprobados |
| **Q-4** | ¿La Evaluación precede o sigue al Análisis? | X-4 |
| **Q-5** | ¿Cuál es la jerarquía documental del Blueprint? | V-5. Su ausencia impide dirimir **cualquier** contradicción por vía documental |

**Nota sobre Q-5.** Es la única pregunta cuya resolución desbloquea parcialmente a las demás: con una jerarquía declarada, X-1 a X-9 pasarían a ser dirimibles por precedencia. Sin ella, ninguna lo es.

---

# 7. Decisiones Arquitectónicas Pendientes

Decisiones que **no deben tomarse** hasta que las preguntas de §6 estén resueltas.

| # | Decisión | Bloqueada por |
| --- | --- | --- |
| P-01 | **Revisión de ADR-10** — posición del Registro y contenido de la Biblioteca | Q-1, Q-3 |
| P-02 | **Corrección de ADR-10A** — tres correcciones identificadas en DP-01 §8.5 | Q-1 |
| P-03 | **Reescritura de ADR-11** — sobre base documental completa | Q-1, Q-3 |
| P-04 | **Revisión de H-04** — quién ejecuta el Registro y sobre qué conjunto | Q-1, Q-2, Q-3 |
| P-05 | **Política de persistencia** — qué se almacena y cuándo | Q-1, Q-2, Q-3 |
| P-06 | **Política de la Biblioteca de Leads** — criterio de admisión y contenido | Q-2, Q-3, V-2 |
| P-07 | **Política de cualificación** — umbral o criterio | Q-1, V-4 |
| P-08 | **Identidad natural de la Empresa** — prerrequisito de la deduplicación exigida por APS-02 §9 | Q-1 |
| P-09 | **Motor de persistencia definitivo** | Todas las anteriores |
| P-10 | **Jerarquía documental del Blueprint** | Q-5 — es la única que **puede** abordarse de inmediato |

---

# 8. Recomendación Oficial

> # Suspender el análisis documental.

La investigación agotó la fuente. Seis documentos y una revisión completa de los 17 APS, los 11 ADR, ADS-00, los 3 AF y ATA-01 han producido dieciséis hallazgos demostrados, ocho hipótesis refutadas, nueve contradicciones confirmadas y seis vacíos.

**Continuar no aumentaría el conocimiento.** Las preguntas bloqueadas lo están porque el Blueprint **no contiene** la información necesaria, no porque no haya sido leída. Todo análisis adicional produciría necesariamente **nuevas interpretaciones sobre la misma evidencia agotada** — y la investigación ya demostró el coste de ese camino: de las ocho hipótesis refutadas en §3, **seis procedían de documentos propios** que interpretaron evidencia parcial como si fuera concluyente.

El trabajo deja de ser arquitectónico. **Q-1 y Q-2 son decisiones de negocio** sobre qué representa el conocimiento comercial de AKVEZ, y corresponden al Product Office.

**Estado del sistema durante la suspensión.** La implementación vigente (H-04) permanece operativa y sin modificar. No presenta ningún síntoma observable para el usuario. Los tres hallazgos con impacto visible —H-01, H-02 y H-03 de la auditoría original— fueron cerrados y verificados con anterioridad y son independientes de esta investigación.

---

# 9. Estado Final de los Documentos

| Documento | Estado | Motivo |
| --- | --- | --- |
| **ADR-10** — Ubicación de la Persistencia | **Requiere revisión** | §4.3 invalidado (R-05); premisa de cualificación posicional refutada (R-02). Su planteamiento y su análisis de la Opción B permanecen válidos |
| **ADR-10A** — Definición Canónica de Empresa y Lead | **Requiere revisión** | Tres correcciones identificadas en DP-01 §8.5: §4.1 (R-06), §5.5 (R-02) y la respuesta a la pregunta 5 (R-01). Su matriz de consistencia y su regla de precedencia permanecen válidas |
| **ADR-11** — Ubicación de la Capacidad de Selección | **Suspendido** *(Needs Rewrite)* | Premisa central refutada (R-04). No llegó a incorporarse al Blueprint como fichero. Conservan validez su evidencia de APS-03, su análisis de Clean Architecture y las divergencias D-1 y D-3 |
| **DP-01** — Ciclo de Vida Canónico | **Vigente con corrección** | Su §6 infravaloró la hipótesis del Registro (R-08). El resto —diagrama del ciclo, identidad de la entidad y clasificación de niveles de evidencia— permanece válido |
| **REV-01** — Revisión del Dominio Canónico | **Vigente con corrección** | Calificó la convergencia hacia el Registro como inferencia fuerte; REV-02 demostró después que la identidad de los almacenes no está declarada (X-9), lo que la matiza. El inventario de evidencia permanece válido |
| **REV-02** — Revisión Documental de Q-2 | **Vigente** | Sin correcciones. Es el documento terminal de la investigación |
| **AR-01** — este documento | **Cerrado** | Cierre formal |
| **H-04** *(implementación)* | **Vigente — temporal** | Operativa y sin modificar. Sujeta a P-04 |

> ### ⛔ Tabla obsoleta — Estado real a 2026-07-29 (v1.1)
>
> **La tabla anterior describe la situación del 2026-07-28 y se conserva como registro histórico. Ninguna de sus ocho filas refleja el estado actual.**
>
> | Documento | Estado en v1.0 | **Estado real vigente** |
> | --- | --- | --- |
> | **ADR-10** | Requiere revisión | **`Archived`** (v1.2) |
> | **ADR-10A** | Requiere revisión | **`Review`** (v2.0) — alineado con PO-01, no archivado |
> | **ADR-11** | Suspendido *(Needs Rewrite)* | **`Review`** (v2.0) — **reescrito por completo**, nuevo objeto: frontera dominio/implementación |
> | **DP-01** | Vigente con corrección | **`Archived`** (v1.1) |
> | **REV-01** | Vigente con corrección | **`Archived`** (v1.1) |
> | **REV-02** | Vigente | **`Archived`** (v1.1) |
> | **AR-01** *(este documento)* | Cerrado | **`Archived`** (v1.1) |
> | **H-04** *(implementación)* | Vigente — temporal | **Revertida** por PO-01 §9.4. Ejecución en la Fase 5 de PLAN-01 |
>
> **Documentos posteriores no contemplados en la v1.0:** ADR-12 (Identidad Canónica del Lead) · ADR-13 (Motor Canónico de Persistencia) · ADR-14 (Gobernanza del Opportunity Score) · REV-03 · AR-02 · PO-01 · PLAN-01.

---

# 10. Cierre

Esta evaluación cierra formalmente la investigación arquitectónica sobre el dominio **Empresa → Lead**.

No se emitirán nuevos ADR, REV ni Decision Papers sobre esta materia. La reanudación queda condicionada al pronunciamiento del Product Office sobre las cinco preguntas de §6, con prioridad sobre **Q-5** por ser la única que desbloquea a las demás.

---

# 11. Referencias

## 11.1 Autoridad vigente (v1.1)

Documentos que **sustituyen** a éste y deben consultarse en su lugar:

- **PO-01** — Decisión de Producto: Definición Canónica de Lead §1-§8, §9.4.
- **ADS-00 v1.2** — *Jerarquía Documental y Regla de Precedencia*. **Subsana el vacío V-5** identificado por este documento.
- **APS-07 v2.0** · **APS-03 v3.0** · **APS-02 v2.1** · **APS-08 v1.1** · **APS-04 v4.0**.
- **ADR-10A v2.0** · **ADR-11 v2.0** · **ADR-12** · **ADR-13** · **ADR-14**.
- **PLAN-01** §4.1, §7 (Fase 3) · **REV-03** (H-06, H-07) · **AR-02** — Blueprint Readiness Assessment.

## 11.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-02, APS-03, APS-07 y APS-08 remiten a las versiones vigentes en 2026-07-28, hoy corregidas.

**Documentos de la investigación:** ADR-10 · ADR-10A · ADR-11 · DP-01 · REV-01 · REV-02

**Fuentes del Blueprint:** APS-01 §5, §6, §7 · APS-02 §6, §9, Glosario · APS-03 §7, §8, §17.2 (APS-03-DIAG-002), Glosario · APS-07 §5, §6, §7, §8, Glosario · APS-08 §7, §8, Glosario · ADR-02 §8 · ADR-04 §3 · ADR-05 §1, §4, §10, §11, §12, §15 · INDEX · ADS-00 · AF-00, AF-01, AF-02 · ATA-01
