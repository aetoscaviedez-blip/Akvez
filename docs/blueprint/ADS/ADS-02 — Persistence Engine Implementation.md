# ADS-02 — Implementación del Motor de Persistencia

| Campo | Valor |
| --- | --- |
| Código | ADS-02 |
| Clasificación | Documento de Implementación |
| Versión | 1.2 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-08-04 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Gobernado por | **ADR-13** · ADR-05 · ADR-08 · ADR-12 |
| Resuelve | Deuda crítica **DC-2** (AR-02 §4.1) en su parte de implementación |

> **Naturaleza del documento.** Documento de **implementación**, no de arquitectura. Selecciona la tecnología que materializa las decisiones ya adoptadas.
>
> **No rediseña nada. No modifica ADR-13, ADR-05, ADR-08 ni ADR-12.** Su única función es elegir un motor que las satisfaga y demostrar que lo hace.
>
> **Si este documento y un ADR discrepan, prevalece el ADR.** Una incompatibilidad detectada aquí obliga a cambiar de motor, nunca a modificar la arquitectura.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-08-04 | AKVEZ Architecture Team | **Sincronización de §7 con ADR-13 v1.2 y v1.3. Cambio Menor: ninguna decisión de este documento resulta afectada.** La fila *«Versión vigente distinguible»* **se desdobla en dos**: la vigencia pasa a determinarse por **mayor número de emisión** *(V-2)*, y la **conservación de la marca temporal se declara en fila propia bajo V-3**, de la que §7 carecía. La fila de garantías pasa de **siete a diez** *(G-8, G-9, G-10)*, acotando G-6 a la identidad del Lead porque G-8 la generaliza. La fila de catálogo de eventos pasa de **siete a nueve** *(E-1 a E-9, incluida la variante E-2b)*. **§7 pasa de 11 a 12 filas. No se modifica ningún otro contenido:** ni la selección de PostgreSQL de §4, ni la justificación de §5, ni el compromiso de portabilidad de §5.3, ni las alternativas de §6, ni las verificaciones de §8 y §9, ni los riesgos de §10, ni la Definition of Done de §11. **Los nueve requisitos de §3 permanecen sin cambio.** | §7 afirmaba que la versión vigente la determina **la marca temporal**, contra **ADR-13 v1.3 §10.3 V-2**, que declara que la determina el **mayor número de emisión** y que `issuedAt` **no** la determina. Contaba **siete** garantías cuando §12.3 declara **diez** desde v1.3, y **siete** eventos cuando §13.1 declara **nueve** desde **v1.2**. Este documento declara en su cabecera estar *«**Gobernado por ADR-13**»* y que *«si este documento y un ADR discrepan, **prevalece el ADR**»*; conforme a **ADS-00 R-1 y R-3**, la corrección le corresponde. Habilitado por la aplicación de **ADR-13 v1.3** al Blueprint en el sprint **COM-46**. Divergencias detectadas en **COM-40/1**, completadas en **COM-41/A** y **COM-42/A**, y auditadas íntegramente en **COM-47/1**. |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra la Definition of Done de §11. **No se modifica ningún contenido técnico:** ni la selección de §4, ni la justificación de §5, ni las alternativas de §6, ni las verificaciones de compatibilidad de §7 a §9. | Sprint **GOV-01**. Se ratifican **PostgreSQL** como motor y **Supabase** como proveedor, y se confirma el **compromiso de portabilidad** de §5.3 como restricción vinculante de implementación. La verificación de los riesgos R-1, R-2 y R-4 se asigna a **DEV-01 — Architecture Bootstrap**, por exigir implementación ejecutable. Habilitado además por la ratificación de **ADR-13 v1.1**, cuya semántica materializa. **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Selección del motor de persistencia. Justificación, verificación de compatibilidad con ADR-13 y ADR-05, y alternativas evaluadas. | Tarea 2 del sprint PC-01. ADR-13 §3.2 dejó expresamente la elección de motor fuera de su alcance, y AR-02 la clasificó como deuda crítica **DC-2**, con impacto máximo: sin motor, la Biblioteca de Leads no puede materializarse. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Alcance
3. Requisitos Impuestos por la Arquitectura
4. Motor Seleccionado
5. Justificación
6. Alternativas Evaluadas
7. Compatibilidad con ADR-13
8. Compatibilidad con ADR-05 y ADR-08
9. Compatibilidad con ADR-12
10. Riesgos
11. Definition of Done

---

# 1. Resumen Ejecutivo

**Motor seleccionado: PostgreSQL**, provisto como servicio gestionado por **Supabase**.

La elección no responde a preferencia tecnológica, sino a que **tres decisiones ya aprobadas imponen requisitos que muy pocos motores satisfacen simultáneamente**:

1. **ADR-13 §11.1** exige que la *Unidad de Registro* —determinar identidad, comprobar presencia y escribir— sea **atómica**. Sin atomicidad real, dos búsquedas concurrentes duplican Leads y se incumple el criterio de éxito de la V1 (APS-02 §9).
2. **ADR-12 §12.2** exige que dentro del espacio de un usuario **no coexistan dos Leads con la misma Referencia de Origen**. Es una restricción de unicidad compuesta que el motor debe garantizar, no la aplicación.
3. **ADR-05 §14** exige aislamiento estricto entre usuarios: «un usuario nunca puede acceder a información perteneciente a otro usuario».

PostgreSQL resuelve las tres con mecanismos nativos —transacciones ACID, índices únicos compuestos y *row-level security*—, en lugar de delegarlas en código de aplicación, que es donde este tipo de garantías se rompe.

---

# 2. Alcance

## 2.1 Incluye

- El motor de base de datos seleccionado y su proveedor.
- Las razones de la selección, contrastadas contra los requisitos de la arquitectura.
- La verificación de compatibilidad con ADR-13, ADR-05, ADR-08 y ADR-12.
- Las alternativas evaluadas y el motivo de su descarte.

## 2.2 No incluye

- Esquema físico, tablas, columnas, tipos o migraciones.
- Índices concretos más allá de los exigidos por una garantía de la arquitectura.
- ORM, *query builder* o driver.
- Estrategia de respaldo, replicación, caché o escalado.
- Dimensionamiento, costes o plan de contratación.

Todo lo anterior corresponde a la planificación técnica de la Fase 5.

---

# 3. Requisitos Impuestos por la Arquitectura

Requisitos **no negociables**. Un motor que no los satisfaga queda descartado, cualquiera que sea su mérito.

| # | Requisito | Origen |
| --- | --- | --- |
| **RQ-1** | **Atomicidad** de una operación compuesta de lectura condicional y escritura | ADR-13 §11.1 |
| **RQ-2** | **Unicidad compuesta** garantizada por el motor sobre `(Referencia de Origen, Usuario)` | ADR-12 §12.2 · ADR-13 §12.3, G-6 |
| **RQ-3** | **Aislamiento entre usuarios** verificable | ADR-05 §14 |
| **RQ-4** | **Escritura acumulativa**: versiones sucesivas de análisis, puntuación y propuesta sin sobrescribir | ADR-13 §10.3 |
| **RQ-5** | **Estabilidad de identificadores**: no reasignación ni reutilización | ADR-12 §12.1, E-3 · ADR-13 §12.3, G-3 |
| **RQ-6** | **Historial de solo crecimiento**, sin modificación retroactiva | ADR-12 E-5 · ADR-13 §12.3, G-5 |
| **RQ-7** | **Atributos opcionales** representables como ausentes, no como valores por defecto | APS-07 v2.0 §8.4 · ADR-13 §7.1 |
| **RQ-8** | **Independencia del dominio**: sustituir el motor no altera qué Leads existen | ADR-13 §12.4 · ADR-11 §7.1 |
| **RQ-9** | **Crecimiento sin techo**: la Biblioteca solo crece; ninguna limitación del motor podrá reducirla | PO-01 §4, §6 · ADR-11 §9, E-2 |

---

# 4. Motor Seleccionado

| Campo | Selección |
| --- | --- |
| **Motor** | **PostgreSQL** |
| **Modelo de datos** | Relacional, con soporte documental (`JSONB`) para atributos de evolución abierta |
| **Base de datos** | Instancia PostgreSQL gestionada, una por entorno |
| **Proveedor** | **Supabase** |
| **Alternativa de proveedor equivalente** | **Neon** — mismo motor, sin las capacidades añadidas de §5.2 |
| **Compromiso de portabilidad** | **PostgreSQL estándar.** No se utilizarán extensiones propietarias del proveedor en la capa de dominio |

---

# 5. Justificación

## 5.1 Por qué PostgreSQL

**RQ-1 y RQ-2 son el criterio decisivo, y son los que descartan a la mayoría de candidatos.**

La *Unidad de Registro* de ADR-13 §11.1 es una operación de tipo «comprueba si existe y, si no, inserta». Implementarla como dos operaciones separadas produce duplicados bajo concurrencia — el riesgo **R-2** de ADR-13. PostgreSQL permite resolverla en **una sola sentencia atómica**, apoyada en una **restricción de unicidad compuesta** que el propio motor garantiza.

Esto convierte la deduplicación —criterio de éxito de la V1 según APS-02 §9— en una **garantía estructural del almacenamiento**, no en una responsabilidad del código de aplicación. Es exactamente lo que ADR-13 §12.1 exige al declarar que «la identidad se determina antes de escribir, nunca al escribir».

**RQ-4, RQ-5 y RQ-6** se satisfacen con relaciones de uno a muchos entre el Lead y sus emisiones versionadas de análisis, puntuación y propuesta. Cada emisión es una fila nueva; ninguna sustituye a la anterior. El modelo relacional expresa esto de forma natural y verificable.

**RQ-7** se satisface con `NULL`, que distingue explícitamente «no hay dato» de «el dato es cero o vacío». Es la distinción que APS-07 v2.0 §8.4 exige y que ADR-13 §7.1 (X-3) protege: **la ausencia de sitio web es un hallazgo comercial, no un vacío que rellenar**.

**RQ-9** no plantea dificultad: PostgreSQL opera sin problemas en el orden de magnitud que la V1 puede alcanzar, y su escalado se resuelve en infraestructura sin tocar el dominio.

## 5.2 Por qué Supabase como proveedor

| Motivo | Detalle |
| --- | --- |
| **Row-Level Security nativa** | Satisface **RQ-3** en el motor, no en la aplicación. El aislamiento entre usuarios que exige ADR-05 §14 deja de depender de que cada consulta recuerde filtrar |
| **Autenticación integrada** | Cubre las necesidades de APS-10 §9 y las pantallas P-02, P-03 y P-04 de APS-04 v4.0 §A.3 sin construir un sistema propio |
| **Es PostgreSQL estándar** | No es un motor derivado. La portabilidad se conserva |
| **Operación gestionada** | Adecuado para la V1, cuyo objetivo es validar una hipótesis de producto (APS-02 §1), no operar infraestructura |

## 5.3 Compromiso de portabilidad

> **La capa de dominio no conocerá al proveedor.** Conforme a ADR-05 §6 (Principio 2) y ADR-08 §10, únicamente `shared/persistence/adapters/` podrá referirse al SDK o al driver.
>
> Ninguna capacidad propietaria de Supabase se utilizará dentro del dominio ni de la aplicación. Sustituir el proveedor por otro PostgreSQL gestionado deberá exigir cambios **exclusivamente en la capa de adaptadores**.
>
> Es la aplicación directa de **RQ-8** y del Criterio de Invariancia del Conjunto (ADR-11 §7.1).

---

# 6. Alternativas Evaluadas

| Alternativa | Evaluación |
| --- | --- |
| **MongoDB** | **Descartada.** Su modelo documental encaja con atributos flexibles, pero la unicidad compuesta y la atomicidad de la *Unidad de Registro* resultan más frágiles de garantizar en escenarios distribuidos, y el versionado acumulativo tiende a resolverse embebiendo documentos que crecen sin límite. **RQ-1 y RQ-2 quedan comprometidos**, y son innegociables |
| **Firebase / Firestore** | **Descartada.** Buen ajuste para prototipado rápido, pero las restricciones de unicidad compuesta no son nativas y deben emularse, lo que traslada al código una garantía que **RQ-2** exige del motor. Además, su modelo de consultas condicionaría el diseño del dominio, en contra de **RQ-8** y de ADR-11 §7.2 |
| **SQLite** | **Descartada.** Satisface RQ-1, RQ-2 y RQ-4 con solvencia, y sería suficiente para el volumen de la V1. Se descarta por la escritura concurrente y por la ausencia de aislamiento por usuario en el motor (**RQ-3**), que obligaría a resolver ADR-05 §14 íntegramente en la aplicación |
| **PostgreSQL vía Neon** | **Viable.** Mismo motor y misma satisfacción de los nueve requisitos. Se prefiere Supabase por §5.2 —RLS y autenticación—, que cubren además necesidades de APS-10 y APS-04. **Queda como alternativa equivalente** si el Product Office prefiere desacoplar autenticación y persistencia |

---

# 7. Compatibilidad con ADR-13

| Requisito de ADR-13 | Sección | Cómo lo satisface PostgreSQL |
| --- | --- | --- |
| **Unidad de Registro atómica** | §11.1 | Transacción con restricción de unicidad. La comprobación y la escritura son indivisibles por construcción |
| **Reconciliación atómica** | §11.1 · §9.5 | Transacción que abarca la unificación completa. Si no puede completarse, no se produce (D-10) |
| **Idempotencia del Registro** | §11.3 | La restricción de unicidad hace que repetir el registro no produzca efecto |
| **Registrar · Actualizar · Versionar** | §10.1 | `INSERT` para el Registro, `UPDATE` para atributos con traza en historial, `INSERT` en tablas hijas para versiones |
| **Ninguna destrucción de conocimiento** | §10.2 | No se emplea `DELETE` sobre Leads ni sobre versiones. Única excepción: supresión legal conforme a APS-10 |
| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión por fila.** La vigente es la de **mayor número de emisión dentro de su clave de identidad** — **no la de marca temporal más reciente**. Consulta por `MAX()` sobre esa columna, con índice compuesto |
| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas de marca temporal y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |
| **El Score conserva su perfil de usuario** | §10.3, V-4 | Se almacena junto a cada emisión de puntuación |
| **Historial de solo crecimiento** | §12.1, E-5 | Tabla de historial sin actualización ni borrado |
| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |
| **Independencia del motor** | §12.4 | §5.3 de este documento |
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |

> **Verificación de X-3.** ADR-13 §7 prohíbe persistir salidas de presentación. El almacenamiento se alimenta de la entidad de dominio, y los atributos ausentes se representan con `NULL`, **nunca con texto explicativo**.

---

# 8. Compatibilidad con ADR-05 y ADR-08

## 8.1 ADR-05

| Decisión de ADR-05 | Sección | Cumplimiento |
| --- | --- | --- |
| Los agentes nunca acceden a datos persistidos | §6, P-1 | ✅ La cadena `Agent → Application → Repository → Persistence` se mantiene íntegra |
| Persistence pertenece a Infrastructure | §6, P-2 | ✅ El SDK reside exclusivamente en la capa de adaptadores |
| El dominio debe permanecer testeable sin conexión | §6, P-3 | ✅ La Repository Interface permite sustituir el adaptador |
| Repository Pattern obligatorio | §7, D-2 | ✅ Sin cambios |
| Entidad de dominio y modelo persistente separados | §7, D-3 | ✅ Traducción mediante mappers, conforme a ADR-08 |
| Aislamiento entre usuarios | §14 | ✅ **Reforzado.** Se aplica en el motor mediante RLS, además de en la aplicación |

## 8.2 ADR-08

Las reglas de dependencia de **§10 se mantienen sin alteración**. En particular:

- El SDK o driver solo puede importarse desde `shared/persistence/adapters/`.
- `modules/*/domain/` no importa nada de `shared/persistence/`.
- `modules/*/application/` recibe la Repository Interface como dependencia, sin conocer el adaptador.

**Este documento no introduce ninguna capa nueva ni modifica ninguna frontera.**

---

# 9. Compatibilidad con ADR-12

| Regla de ADR-12 | Cumplimiento |
| --- | --- |
| Identidad = `(Referencia de Origen, Usuario)` §7.2 | ✅ Restricción de unicidad compuesta sobre ambos |
| La identidad se determina **antes** de escribir §12.1 *(vía ADR-13)* | ✅ La comprobación forma parte de la transacción, previa a la inserción |
| El identificador interno **representa** la identidad, no la constituye §12.3 | ✅ La clave técnica es interna; la comprobación opera sobre la identidad natural |
| Un Lead puede acumular varias Referencias de Origen (D-6) | ✅ Relación uno a muchos; ninguna se elimina |
| Huella de Identidad subsidiaria §7.3 | ✅ Almacenable como atributo consultable cuando falte la Referencia de Origen |
| Reconciliación sin pérdida (D-8, D-9, D-10) | ✅ Operación transaccional |
| La fecha de descubrimiento no se actualiza (E-4) | ✅ Columna inmutable por convención |

> **Riesgo R-4 de ADR-12.** Deberá medirse durante la implementación qué proporción de descubrimientos carece de Referencia de Origen. Si resultase alta, la Huella de Identidad pasaría a ser el caso normal y requeriría decisión propia. **Este documento no lo resuelve.**

---

# 10. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **La unicidad se implementa en la aplicación** en lugar de en el motor, y aparecen duplicados bajo concurrencia | **Alta** | RQ-2 y §7. Debe verificarse explícitamente antes de dar por cumplido APS-02 §9 |
| **R-2** | **Capacidades propietarias del proveedor se filtran al dominio**, comprometiendo la portabilidad | **Alta** | §5.3 y ADR-08 §10. Verificable por inspección de importaciones |
| **R-3** | **El versionado se implementa como sobrescritura** por simplicidad, destruyendo conocimiento | **Alta** | ADR-13 §10.2. Es el riesgo R-3 de ADR-13, que este documento hereda |
| **R-4** | **RLS se configura de forma incompleta** y el aislamiento entre usuarios queda solo en la aplicación | Media | RQ-3 · ADR-05 §14. Requiere verificación explícita |
| **R-5** | **Dependencia de un proveedor único** para persistencia y autenticación simultáneamente | Media | §5.3 y la alternativa Neon de §6 |
| **R-6** | **El crecimiento sin techo genera presión** para introducir políticas de purga | Media | RQ-9 · PO-01 §8 · ADR-11 §9, E-2. Se resuelve en infraestructura, nunca eliminando Leads |

---

# 11. Definition of Done

Este documento podrá considerarse completo cuando el Product Office:

1. **Ratifique PostgreSQL** como motor de persistencia de AKVEZ.
2. **Ratifique Supabase** como proveedor, o seleccione la alternativa equivalente de §6.
3. **Confirme el compromiso de portabilidad** de §5.3 como restricción vinculante de implementación.
4. **Determine cuándo se verifican los riesgos R-1, R-2 y R-4**, que solo pueden comprobarse sobre la implementación real.

Hasta que los cuatro puntos se cumplan, este documento permanece en estado **`Draft`**.

> **Nota de alcance.** Cumplidos los cuatro puntos, **DC-2 queda cerrada por completo**: ADR-13 fijó la semántica de escritura y este documento la tecnología que la materializa.

---

> ## ✅ Definition of Done — cerrada (v1.1, 2026-07-29)
>
> **Los cuatro puntos quedaron cumplidos en el sprint GOV-01.** La condición de permanencia en `Draft` dejó de tener efecto.
>
> | # | Condición | Cumplimiento |
> | --- | --- | --- |
> | 1 | Ratificación de **PostgreSQL** como motor de persistencia | **Cumplida** |
> | 2 | Ratificación del proveedor | **Cumplida — se ratifica Supabase.** Neon se conserva como alternativa equivalente de §6, no como selección |
> | 3 | Confirmación del compromiso de portabilidad de §5.3 | **Cumplida — es restricción vinculante de implementación.** Ninguna capacidad propietaria podrá usarse fuera de `shared/persistence/adapters/` |
> | 4 | Determinación del momento de verificación de R-1, R-2 y R-4 | **Cumplida — mediante asignación a DEV-01.** Solo son comprobables sobre la implementación real |
>
> **Autoridad:** AKVEZ Product Office, pronunciamiento del 2026-07-29.
>
> **DC-2 queda cerrada por completo.** ADR-13 v1.1 (`Approved`) fija la semántica; este documento la tecnología.
>
> **Recordatorio vinculante para DEV-01.** Los riesgos **R-1** (unicidad resuelta en la aplicación en vez de en el motor), **R-2** (capacidades propietarias filtradas al dominio) y **R-4** (RLS incompleta) son de severidad alta y **no son verificables documentalmente**. Su comprobación es condición de cierre de DEV-01.
