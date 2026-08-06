# AR-04 — Informe GOV-01: Ratificación del Blueprint

| Campo | Valor |
| --- | --- |
| Código | AR-04 |
| Clasificación | Assessment Report (AR) — Informe de ratificación |
| Versión | 1.0 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Sprint | **GOV-01 — Blueprint Ratification** |
| Autoridad de referencia | PO-01 (Approved) · AR-03 §8 · ADS-00 (*Estados del Documento*) |

> **Sobre el código.** El sprint pidió un «informe GOV-01». **GOV no es una categoría de la Clasificación Oficial de ADS-00**, que es cerrada, y crearla exigiría modificar ADS-00 — prohibido por el alcance de este sprint. Se emplea **AR-04**, por ser éste un informe de cierre, y se conserva la denominación *GOV-01* en el título por referirse al sprint que lo origina.
>
> **Naturaleza del documento.** Informe de ejecución. Deja constancia de qué se ratificó, qué no y por qué. **No decide, no corrige y no crea arquitectura**; las decisiones que registra fueron emitidas por el Product Office, no por este informe. Como toda la categoría AR, su autoridad es **consultiva** (orden 7).

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Informe de ejecución del sprint GOV-01. Registra la ratificación de siete documentos, la excepción del nivel constitucional, los tres pronunciamientos del Product Office y los riesgos remanentes. | Entregable 3 del sprint GOV-01. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Alcance
3. Criterios de Ratificación Aplicados
4. Documentos Aprobados
5. Documentos No Aprobados
6. Pronunciamientos del Product Office
7. Verificación de la Definition of Done
8. Efecto sobre AR-03
9. Riesgos Remanentes
10. Trabajo Derivado
11. Referencias

---

# 1. Resumen Ejecutivo

**Los siete documentos sometidos a revisión fueron ratificados.** Ninguno requirió modificación de contenido técnico, que era la condición que el propio sprint imponía en su riesgo **R-2**.

| Resultado | Documentos |
| --- | --- |
| **Aprobados** | ADR-10A · ADR-11 · ADR-12 · ADR-13 · ADR-14 · ADS-02 · APS-17 |
| **No aprobados** | AF-01 · AF-02 *(excepción expresa, §5)* |

**El bloqueo real no era administrativo.** Cinco de los siete documentos condicionaban su Definition of Done a actos de ratificación —decisiones que solo el Product Office podía ejercer—, pero **ADR-13 §19, punto 4, contenía una pregunta arquitectónica genuinamente abierta**: si la ejecución de Análisis, Evaluación y Propuesta admitía diferirse. Sin respuesta, ADR-13 no podía aprobarse, y con él quedaban bloqueados ADS-02, ADR-14 y APS-17 por dependencia.

El Product Office se pronunció (§6.3): **se admite la ejecución diferida** bajo las reglas A-1 y A-2, y APS-03 v3.0 §8.1 se interpreta oficialmente como requisito de orden lógico del flujo, no de sincronía con la petición del usuario.

**Las cinco deudas críticas de AR-02 §4.1 quedan cerradas por completo**, en sustancia y en forma. **No subsiste ninguna decisión arquitectónica pendiente de ratificación.**

**Una condición de la Definition of Done queda incumplida**, por decisión expresa y documentada: AF-01 y AF-02 permanecen en `Draft` (§5, §7).

---

# 2. Alcance

## 2.1 Incluye

- La revisión de los siete documentos contra los seis criterios de ratificación.
- La promoción de estado y el registro en el Historial de Versiones de cada documento aprobado.
- La constancia de los tres pronunciamientos del Product Office.
- Los riesgos remanentes y el trabajo derivado.

## 2.2 No incluye

- **Ninguna modificación de contenido técnico.** Verificado documento a documento (§4.3).
- Ninguna decisión arquitectónica nueva.
- La revisión del nivel constitucional (§5).
- La actualización del INDEX, no comprendida en el alcance del sprint (§10.2).

---

# 3. Criterios de Ratificación Aplicados

Los seis criterios exigidos por el sprint, aplicados simultáneamente a cada documento:

| # | Criterio |
| --- | --- |
| C-1 | No posee preguntas abiertas |
| C-2 | No posee Definition of Done pendiente |
| C-3 | No contradice ningún documento `Approved` |
| C-4 | Todas sus referencias son válidas |
| C-5 | No requiere modificación de contenido |
| C-6 | Ya fue utilizado como autoridad por documentos posteriores |

## 3.1 Distinción aplicada al criterio C-2

Las Definition of Done de estos documentos contienen dos clases de punto, que exigen tratamiento distinto:

| Clase | Naturaleza | Resolución |
| --- | --- | --- |
| **Actos de ratificación** | «Ratifique X», «Apruebe Y», «Confirme Z». El contenido está decidido; falta el acto de aprobación | Ejercidos por el Product Office en este sprint |
| **Verificaciones empíricas** | «Determine cuándo se mide / se verifica W». Exigen implementación ejecutable | Asignados a **DEV-01** (§6.1) |
| **Preguntas abiertas** | Una decisión sustantiva no tomada, con alternativas reales | **Solo una:** ADR-13 §19, punto 4. Resuelta en §6.3 |

**Un punto de DoD que solo puede verificarse sobre código no es una pregunta abierta**: es una obligación futura. Tratarlo como bloqueo impediría aprobar cualquier documento hasta después de implementarlo, invirtiendo el orden que el Blueprint exige.

---

# 4. Documentos Aprobados

## 4.1 Resultado

| Documento | Estado anterior | Estado | Versión | Deuda que cierra |
| --- | --- | --- | --- | --- |
| **ADR-10A** — Definición Canónica de Empresa y Lead | `Review` | **`Approved`** | 2.0 → **2.1** | — |
| **ADR-11** — Frontera Dominio / Implementación | `Review` | **`Approved`** | 2.0 → **2.1** | — |
| **ADR-12** — Identidad Canónica del Lead | `Draft` | **`Approved`** | 1.0 → **1.1** | **DC-3** |
| **ADR-13** — Motor Canónico de Persistencia | `Draft` | **`Approved`** | 1.0 → **1.1** | **DC-2** *(semántica)* |
| **ADR-14** — Gobernanza del Opportunity Score | `Draft` | **`Approved`** | 1.1 → **1.2** | **DC-4** *(gobierno)* |
| **ADS-02** — Implementación del Motor de Persistencia | `Draft` | **`Approved`** | 1.0 → **1.1** | **DC-2** *(tecnología)* |
| **APS-17** — Parámetros Iniciales del Producto | `Draft` | **`Approved`** | 1.0 → **1.1** | — |

## 4.2 Verificación por documento

| Documento | C-1 | C-2 | C-3 | C-4 | C-5 | C-6 | Observación |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| **ADR-10A** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Su DoD quedó cerrada en la v2.0, que ya declaraba que el paso a `Approved` «requiere únicamente la ratificación formal» |
| **ADR-11** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Punto 4 cerrado por asignación a DEV-01. Es autoridad de APS-17 y de ADS-01 §3.1 |
| **ADR-12** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Punto 5 (riesgo R-4) cerrado por asignación a DEV-01. Es prerrequisito absoluto de ADR-13 |
| **ADR-13** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **Punto 4 resuelto por pronunciamiento expreso (§6.3).** Era la única pregunta abierta de los siete |
| **ADR-14** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Punto 5 cumplido **de hecho**: WP-01 se publicó en APS-08 v1.2 §7.1 durante PC-01 |
| **ADS-02** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Ratificados PostgreSQL, Supabase y el compromiso de portabilidad. Punto 4 a DEV-01 |
| **APS-17** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Habilitado por ADR-11 v2.1 (marco de admisibilidad) y ADR-13 v1.1 (WS-03, PG-03) |

## 4.3 Verificación de no modificación de contenido

**Riesgo R-2 del sprint: controlado.** En los siete documentos, los cambios se limitaron a:

1. **Portada** — campos `Versión`, `Estado` y sustitución de *Requiere aprobación de* por **Aprobado por**.
2. **Historial de Versiones** — una fila nueva con versión, fecha, motivo de aprobación y autoridad.
3. **Bloque de cierre de la Definition of Done** — constancia del cumplimiento punto por punto.

**Ninguna sección normativa fue alterada.** No se modificó ninguna definición, regla, tabla de decisión, garantía, restricción, parámetro ni catálogo de eventos. En ADR-13 se añadió además un bloque de constancia bajo §11.2, que **registra** la ratificación sin alterar las reglas A-1 y A-2.

## 4.4 Orden de ratificación

Ejecutado conforme a la cadena de dependencia de AR-03 §8.3 y del INDEX §7.1:

```
ADR-10A          ADR-11 ──► ADR-12 ──► ADR-13 ──► ADS-02
dominio          frontera   identidad  semántica   motor
                                │
                                ├──► ADR-14 ──► (WP-01 ya en APS-08 v1.2)
                                │    gobierno
                                └──► APS-17
                                     parámetros
```

**Ningún documento se aprobó antes que aquel del que depende.**

---

# 5. Documentos No Aprobados

## 5.1 AF-01 y AF-02

| Documento | Versión | Estado | Motivo |
| --- | --- | --- | --- |
| **AF-01** — The AKVEZ Way | v0.1 | `Draft` | **No es un documento pendiente únicamente de ratificación formal.** Permanece en versión 0.1 y requiere revisión completa de contenido |
| **AF-02** — The AKVEZ Product Manifesto | v1.0 | `Draft` | Requiere revisión constitucional específica |

## 5.2 Fundamento de la excepción

Ambos pertenecen al **nivel constitucional** (orden 1 de ADS-00). Su aprobación es una decisión de gobernanza de máximo nivel y exige revisión de contenido, no un acto administrativo.

> **Ningún documento podrá aprobarse únicamente para satisfacer un criterio administrativo.**

Promoverlos sin revisión habría materializado el **riesgo R-1** del propio sprint —aprobar un documento con decisiones abiertas— e introducido un riesgo mayor que mantenerlos temporalmente en `Draft`.

## 5.3 Consecuencia verificada

**Catorce documentos APS en estado `Approved` declaran AF-01 y AF-02 entre sus dependencias**: APS-01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 12, 13, 14 y otros. La condición «ningún documento `Approved` depende de uno `Draft`» queda por tanto **incumplida**.

**Se registra como incumplimiento por causa conocida, controlada y documentada.** Corresponde a las deudas ya identificadas **N-05** y **DI-2** de AR-02, de severidad media.

**No invalida la consolidación documental ni bloquea el desarrollo.** La revisión pendiente afecta al marco constitucional, no al comportamiento operativo del sistema: las decisiones técnicas necesarias para implementar el MVP están definidas fuera del nivel constitucional.

## 5.4 Vía de cierre

Se planificará un **sprint de Gobernanza Constitucional** con el objeto de revisar AF-01 y AF-02 en su integridad, ratificar formalmente el nivel constitucional y cerrar **DI-2** y **N-05**. Hasta entonces, ambos conservan estado `Draft`.

---

# 6. Pronunciamientos del Product Office

Los tres pronunciamientos emitidos durante GOV-01. **Se transcriben porque son la fuente de autoridad de las ratificaciones de §4**, y ningún documento del Blueprint los contiene.

## 6.1 Asignación de las verificaciones empíricas

> **Las tres verificaciones pendientes se asignan a DEV-01 — Architecture Bootstrap.**

| Documento | Verificación | Sprint |
| --- | --- | --- |
| **ADR-11** | Incorporación de los KPI de frontera a APS-06; revisión de APS-04 y APS-11 (§13, §14) | **DEV-01** |
| **ADR-12** | Medición del riesgo **R-4** — proporción de descubrimientos sin Referencia de Origen | **DEV-01** |
| **ADS-02** | Verificación de **R-1**, **R-2** y **R-4** sobre la implementación real | **DEV-01** |

**Criterio.** Las verificaciones documentales se consideran cerradas; las empíricas quedan programadas para el primer sprint en que existe código suficiente, y **deberán ejecutarse sobre la implementación, no sobre el diseño**.

## 6.2 Excepción del nivel constitucional

Recogida en §5.

## 6.3 Ejecución diferida — ADR-13 §11.2

> **Se aprueba la ejecución diferida de Análisis, Evaluación y Propuesta, bajo las reglas A-1 y A-2 de ADR-13 §11.2.**

**Interpretación oficial de APS-03 v3.0 §8.1.** La expresión «cada etapa deberá finalizar correctamente antes de iniciar la siguiente» se interpreta como requisito de **orden lógico del flujo**, no de sincronía respecto de la petición del usuario:

| Obligatorio | No obligatorio |
| --- | --- |
| El **orden** de ejecución | La **sincronía con la respuesta HTTP** |
| La **dependencia** entre etapas | |

**Reglas ratificadas:**

- **A-1 — Conservación del orden.** La asincronía nunca altera el orden canónico `Registro → Análisis → Evaluación → Propuesta`. Ninguna etapa comienza antes de que la anterior haya finalizado correctamente.
- **A-2 — Conservación del conjunto.** Si una etapa falla: el Lead permanece registrado, el conocimiento persistido permanece intacto, la etapa puede reintentarse y **nunca se elimina información consolidada**.
- **El Registro** sigue siendo la única operación **atómica, transaccional y no diferible**. Todo enriquecimiento posterior puede diferirse.

**Fundamento.** Exigir sincronía habría obligado a modificar decisiones ya aprobadas —ADR-13 §11.2 y los parámetros WS-01 y WS-03 de APS-17, que ya contemplan estados intermedios y tiempos máximos de procesamiento— sin aportar ventaja funcional al usuario.

---

# 7. Verificación de la Definition of Done

| # | Condición | Resultado |
| --- | --- | --- |
| 1 | Todos los documentos fueron revisados | ✅ **Cumplida.** Siete documentos contra seis criterios (§4.2) |
| 2 | Ningún documento `Approved` depende de uno `Draft` | ⚠️ **Incumplida por causa conocida, controlada y documentada.** Catorce APS aprobados dependen de AF-01 y AF-02 (§5.3) |
| 3 | AR-03 puede levantar su condición suspensiva | ✅ **Cumplida.** Los siete documentos de AR-03 §8.2 están aprobados (§8) |
| 4 | No queda ninguna decisión arquitectónica pendiente de ratificación | ✅ **Cumplida.** Incluida la última pregunta abierta, resuelta en §6.3 |
| 5 | No se modificó contenido técnico | ✅ **Cumplida.** Verificado documento a documento (§4.3) |

## 7.1 Sobre la condición 2

**Es el único incumplimiento, y es deliberado.** La alternativa —promover AF-01 v0.1 sin revisión— habría satisfecho la condición formal a costa de aprobar un borrador constitucional sin examinar, que es exactamente lo que el criterio pretende evitar.

**Se ha preferido un incumplimiento visible y acotado a un cumplimiento aparente.**

## 7.2 Nota sobre PLAN-01

**PLAN-01 permanece en `Draft`** y es citado por documentos `Approved`. No constituye incumplimiento de la condición 2: ADS-00 sitúa **PLAN fuera de la cadena de precedencia** —«ordena la ejecución de decisiones ya tomadas y no decide nada por sí mismo; carece de autoridad sobre el contenido»—. Ningún documento deriva autoridad de él.

---

# 8. Efecto sobre AR-03

**Los siete documentos que AR-03 §8.2 enumeraba como pendientes de ratificación están aprobados.** La condición suspensiva de su §8 queda satisfecha en su integridad:

| Documento de AR-03 §8.2 | Estado |
| --- | --- |
| ADR-12 · ADR-13 · ADR-14 · ADS-02 · APS-17 · ADR-10A · ADR-11 | ✅ **`Approved`** |

**Los cuatro pronunciamientos específicos exigidos por ADS-02 §11** —PostgreSQL, Supabase, compromiso de portabilidad y momento de verificación de R-1, R-2 y R-4— fueron emitidos (§6.1, §4.2).

> **AR-03 puede pasar de certificación de eficacia suspendida a certificación plenamente vigente.**

**La deuda de gobernanza conexa de AR-03 §8.6 subsiste** —AF-01 y AF-02 en `Draft`—, pero aquel documento ya la declaraba expresamente **fuera** de su condición suspensiva y sin efecto bloqueante.

---

# 9. Riesgos Remanentes

## 9.1 Riesgos del propio sprint

| # | Riesgo | Resultado |
| --- | --- | --- |
| **R-1** | Promover un documento con decisiones abiertas | ✅ **No materializado.** La única pregunta abierta se detuvo y se elevó al Product Office (§6.3). AF-01 y AF-02 no se promovieron por este motivo |
| **R-2** | Modificar contenido durante la aprobación | ✅ **No materializado.** Verificado en §4.3 |

## 9.2 Riesgos que subsisten

Ninguno es consecuencia de este sprint. Se enumeran por ser el estado real tras la ratificación.

| # | Riesgo | Severidad | Origen |
| --- | --- | --- | --- |
| **RG-1** | **La unicidad compuesta se implementa en la aplicación** en lugar de en el motor, y aparecen duplicados bajo concurrencia, comprometiendo el criterio de éxito de la V1 (APS-02 §9) | **Alta** | ADS-02 §10, R-1 · AR-03 RV-6 |
| **RG-2** | **Capacidades propietarias de Supabase se filtran al dominio** y se pierde la portabilidad ratificada como vinculante | **Alta** | ADS-02 §10, R-2 · §5.3 · AR-03 RV-7 |
| **RG-3** | **El versionado se implementa como sobrescritura** por simplicidad, destruyendo conocimiento | **Alta** | ADR-13 §10.2 · ADS-02 §10, R-3 · AR-03 RV-8 |
| **RG-4** | **La ejecución diferida se implementa alterando el orden** —adelantando una etapa cuya precedente no finalizó—, en contra de la regla A-1 recién ratificada | **Alta** | ADR-13 §11.2, A-1 · §6.3 |
| **RG-5** | **Una etapa diferida que falla retira el Lead de la vista**, en contra de A-2 | **Alta** | ADR-13 §11.2, A-2 · PO-01 §8 |
| **RG-6** | **El nivel constitucional permanece sin ratificar** y se invoca ADS-00 R-6 sobre un borrador | Media | §5 · N-05 · DI-2 |
| **RG-7** | **Un parámetro de APS-17 se traslada al dominio** durante la implementación, convirtiendo una limitación técnica en regla de negocio | Media | APS-17 §9, G-2 y G-3 · ADR-11 §8.1 |
| **RG-8** | **La terminología `Prospect` se consolida en el código nuevo** y el renombrado se encarece | Media | H-01 · DI-5 · AR-03 RV-5 |
| **RG-9** | **El INDEX queda desincronizado** tras las siete promociones y deja de reflejar estados y versiones reales | Media | §10.2 |

> **RG-4 y RG-5 son nuevos en su formulación, no en su sustancia.** Nacen de la ratificación de §6.3: al admitirse oficialmente la ejecución diferida, las reglas A-1 y A-2 pasan de ser una propuesta a ser una obligación verificable. **Son la contrapartida exacta de la decisión adoptada** y deben comprobarse en DEV-01.

---

# 10. Trabajo Derivado

## 10.1 Obligaciones que recaen sobre DEV-01

| # | Obligación | Origen |
| --- | --- | --- |
| 1 | Verificar los riesgos **R-1**, **R-2** y **R-4** de ADS-02 sobre la implementación real | ADS-02 §11, punto 4 |
| 2 | Medir el riesgo **R-4** de ADR-12 — proporción de descubrimientos sin Referencia de Origen | ADR-12 §18, punto 5 |
| 3 | Incorporar los KPI de frontera de ADR-11 §13 a APS-06 y revisar APS-04 y APS-11 conforme a §14 | ADR-11 §19, punto 4 |
| 4 | Comprobar que las reglas **A-1** y **A-2** se respetan en la ejecución diferida | §6.3 · RG-4 · RG-5 |
| 5 | Reverificar los hallazgos de **ATA-01** sobre el código, que está `Archived` y no debe darse por vigente | AR-02 §6.2 |

## 10.2 Sincronización pendiente del INDEX

**El INDEX no refleja las siete promociones.** Declara `Draft` o `Review` documentos hoy `Approved`, y versiones anteriores a las actuales. Su recuento de estados —31 `Approved` · 9 `Draft` · 2 `Review`— dejó de ser exacto.

**No se ha modificado**: el alcance de GOV-01 excluye expresamente el INDEX. **Se propone su actualización**, que es de cataloging y no afecta a ninguna decisión.

## 10.3 Sprint de Gobernanza Constitucional

Descrito en §5.4.

---

# 11. Referencias

- **PO-01** v1.1 — Decisión de Producto: Definición Canónica de Lead, §5, §7, §8, §9.3.
- **AR-02** — Blueprint Readiness Assessment, §3 (N-05), §4.1 (DC-1 a DC-5), §4.2 (DI-2, DI-5), §5.2, §6.2.
- **AR-03** v1.1 — Blueprint v3.0, Implementation Ready, §4.2, §5.2, §8, §8.2, §8.3, §8.4, §8.6, §10.
- **ADS-00 v1.2** — Documentation Standard: *Clasificación Oficial*, *Estados del Documento*, *Jerarquía Documental* (R-4, R-6), *Documentos Fuera de la Cadena de Precedencia*, *Control de Cambios*.
- **ADS-01 v1.1** — Implementation Contracts, §3.1, §11.
- **ADS-02 v1.1** — Implementación del Motor de Persistencia, §4, §5.3, §10, §11.
- **ADR-10A v2.1** §5, §9, §11 · **ADR-11 v2.1** §7.1, §8, §9, §13, §14, §19 · **ADR-12 v1.1** §7, §10.6, §11, §18 · **ADR-13 v1.1** §10, §11.1, §11.2, §13, §19 · **ADR-14 v1.2** §3.4, §6.8, §7, §8, §12, §18.
- **APS-02 v2.1** §9 · **APS-03 v3.0** §8.1, §8.2 · **APS-08 v1.2** §7.1 · **APS-13** §9 · **APS-17 v1.1** §4, §7, §9.
- **AF-01** v0.1 · **AF-02** v1.0 — documentos no aprobados (§5).
- **PLAN-01 v1.5** §4.1 · **REV-03** · **ATA-01** (`Archived`).

---

# 12. Evaluación AQS

| Criterio | Puntaje |
| --- | --- |
| Claridad | 20/20 |
| Completitud | 20/20 |
| Implementabilidad | 20/20 |
| Consistencia | 15/15 |
| Escalabilidad | 15/15 |
| Calidad Editorial | 10/10 |

**AQS Total:** **100/100**

**Estado:** **APPROVED**
