# ADR-13 — Motor Canónico de Persistencia

| Campo | Valor |
| --- | --- |
| Código | ADR-13 |
| Clasificación | Architecture Decision Record — Persistencia |
| Versión | 1.3 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-08-04 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-01, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Autoridad de dominio | **PO-01 v1.2** (Approved) · **PO-02** · APS-07 v2.1 · **ADR-12** |
| Resuelve | Deuda crítica **DC-2** (AR-02 §4.1) |

> **Naturaleza del documento.** Define **cómo el dominio persiste**, no **sobre qué**. No elige tecnología, motor, esquema, índices, ORM ni caché. Esas decisiones son de implementación, dependen de ésta y quedan expresamente fuera de su alcance (§3.2).
>
> **Relación con ADR-05.** No lo sustituye. ADR-05 decidió la **estructura** de la capa de persistencia —Repository Pattern, separación dominio/modelo, ubicación en Infrastructure—; ADR-08 decidió sus **fronteras**. Este ADR decide su **semántica**: qué se escribe, cuándo, qué nunca, y con qué garantías.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.3** | 2026-08-04 | AKVEZ Architecture Team | **Enmienda consolidada de tres secciones.** **§6.2** — corrección de la columna «Contenido» de la fila **A-6**, que describía la Propuesta bajo el modelo anterior a ADR-16 §4.4. **§10.3** — se completa **V-2** declarando que la versión vigente es **la de mayor número de emisión**; `issuedAt` queda como metadato temporal que no determina la vigencia. **§12.3** — se añaden **G-8** *(unicidad de identidad)*, **G-9** *(atomicidad de la persistencia)* y **G-10** *(resolución determinista de conflictos)*. **Ninguna otra sección resulta afectada:** §6.1, §6.3, §10.1, §10.2, §10.4, §11, §12.1, §12.2, §12.4 y §13 permanecen íntegros; **las otras once filas de §6.2**, **V-1, V-3, V-4, V-5** y **G-1 a G-7** conservan su texto. | **§6.2** contradecía **PO-02 §3** *(orden 2)*, que declara que una Propuesta Comercial es *«la estrategia que lo decide, la evidencia que lo sostiene y el texto que lo expresa»* y que **«no es solo el texto»**; conforme a **ADS-00 R-1 y R-3**, el documento de menor precedencia debe corregirse. **§10.3 V-2** prometía *«la más reciente»* **sin declarar respecto de qué**, ambigüedad abierta desde **COM-19 §9** *(Sprint 19)* y con dos rellenos divergentes —ADS-02 §7 por marca temporal y el código por número de emisión—. **§12.3** carecía de garantía de identidad para los activos distintos del Lead: **G-1 a G-7 son todas de A-1** y **ADS-02 RQ-2 solo cubre `(Referencia de Origen, Usuario)`** *(deuda F-2, Capa A.2)*. Enmienda aprobada el 2026-08-04 y aplicada en el sprint **COM-46**; análisis previo en **COM-36/1**, **COM-43**, **COM-44** y **COM-45**. |
| **1.2** | 2026-07-30 | AKVEZ Architecture Team | **Extensión del dominio comercial y corrección de E-5.** **§6.2** incorpora **A-11** *(Diagnóstico Comercial, versionado)* y **A-12** *(Secuencia Comercial, actualizable)*. **§10.3** pasa de tres activos versionados a **cuatro**. **§13.1** corrige **E-5** —**deja de actualizar el estadio**; se le retira A-3— e incorpora **E-7**, **E-8** y **E-9**. **§13.3** documenta los cuatro. Se corrige la fila del Pitch Generator en §12.2. **Ninguna decisión previa resulta revertida:** ni la Unidad de Registro de §11.1, ni la regla de no destrucción de §10.2, ni las siete garantías de §12.3, ni la regla de cierre de §13.4 —que **se cumple**: esta enmienda es el acto que ella misma exige—. | Sprint de **Estabilización del Dominio Comercial**, decisión 2. La corrección de **E-5** aplica **PO-01 v1.2 §8** y **PO-02 §5**: emitir una Propuesta no contacta a nadie, y el estadio no puede escribirlo un agente. Las cuatro incorporaciones **resuelven la cuestión Q-1** de APS-19 §12 y ADR-15 §11: APS-18 §7.4 y §9.5 exigen funcionalmente que el diagnóstico y la secuencia **sobrevivan entre contactos**, y §13.4 lo impedía hasta esta enmienda. **Cambio Menor** conforme a APS-13 §9: aditivo salvo la rectificación de E-5. |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra la Definition of Done de §19 con el pronunciamiento expreso sobre asincronía que reservaba §11.2. **No se modifica ningún contenido técnico:** ni la Unidad de Registro de §11.1, ni la estrategia de escritura de §10, ni las siete garantías de §12.3, ni el catálogo de eventos de §13. | Sprint **GOV-01**. Los puntos 1, 2, 3 y 5 de §19 son actos de ratificación. El punto 4 queda resuelto por pronunciamiento expreso: **se admite la ejecución diferida** de Análisis, Evaluación y Propuesta bajo las reglas A-1 y A-2, y APS-03 v3.0 §8.1 se interpreta oficialmente como requisito de **orden lógico del flujo**, no de sincronía respecto de la petición del usuario. El Registro sigue siendo la única operación atómica, transaccional y no diferible. **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Creación inicial. Define qué se persiste, cuándo, qué nunca debe persistirse y qué puede reconstruirse; el reparto de responsabilidades de escritura; la estrategia de escritura acumulativa; el modelo de consistencia; y el catálogo de eventos del dominio con su semántica de persistencia. | Deuda crítica **DC-2** de AR-02 §4.1. Previsto como necesario en ADR-10 §11.4 punto 3, que advertía que adoptar un motor antes de esta decisión «heredaría un repositorio cuyo significado no está decidido». Ese significado quedó fijado por PO-01 y la identidad por ADR-12; procede ahora decidir la semántica de escritura. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Qué se Persiste
7. Qué Nunca Debe Persistirse
8. Qué Puede Reconstruirse
9. Responsabilidades de Escritura
10. Estrategia de Escritura
11. Modelo de Consistencia
12. Relación con ADR-12
13. Catálogo de Eventos del Dominio
14. Consecuencias
15. Riesgos
16. Dependencias
17. Glosario
18. Referencias
19. Definition of Done

---

# 1. Resumen Ejecutivo

PO-01 fijó **qué** contiene la Biblioteca de Leads: todas las Empresas descubiertas, cada una con su conocimiento acumulado. ADR-12 fijó **quién es quién**: la identidad natural que permite reconocer un Lead entre descubrimientos. Falta decidir **cómo se escribe**.

Este ADR lo resuelve mediante cuatro decisiones:

1. **La Biblioteca es el único estado durable del dominio** (§6.1). Todo lo demás —vistas, ordenaciones, resultados de una búsqueda— es proyección efímera y no se persiste.
2. **La escritura es acumulativa: se registra, se actualiza y se versiona; nunca se reemplaza ni se destruye conocimiento de dominio** (§10). Es la aplicación literal de PO-01 §8.
3. **La única operación atómica del dominio es el Registro** (§11.1), porque es donde nace la identidad y donde se garantiza la unicidad que exige ADR-12 §12.2. Todo lo posterior enriquece un Lead que ya existe y admite ejecución diferida.
4. **La identidad se determina antes de escribir, nunca al escribir** (§12). Es la condición sin la cual la deduplicación no puede funcionar, y el defecto exacto que presenta la implementación actual.

---

# 2. Objetivo

Definir la semántica de persistencia del dominio de AKVEZ sin decidir tecnología. En concreto:

> **Qué se persiste · Cuándo se persiste · Qué nunca debe persistirse · Qué puede reconstruirse · Qué constituye una operación atómica · Qué eventos generan escritura · Qué eventos solo generan lectura.**

---

# 3. Alcance

## 3.1 Incluye

- El inventario de lo que constituye estado durable del dominio (§6) y de lo que no (§7, §8).
- El reparto de responsabilidades de escritura entre los tres agentes, la Biblioteca y el Workspace (§9).
- La estrategia de escritura: registrar, actualizar, versionar (§10).
- El modelo de consistencia: atomicidad, asincronía e idempotencia (§11).
- Las garantías que la persistencia debe a la identidad definida en ADR-12 (§12).
- El catálogo de eventos del dominio y su semántica de persistencia (§13).

## 3.2 No incluye

Este ADR **no decide, y ninguna de sus conclusiones debe interpretarse como decisión sobre**:

- **Motor de base de datos.** Ni PostgreSQL, ni MongoDB, ni Supabase, ni Firebase, ni ningún otro.
- Modelo relacional o documental, tablas, colecciones, esquemas o migraciones.
- Índices, claves primarias o foráneas, particionado o *sharding*.
- ORM, *query builder*, driver o SDK.
- Caché, replicación, respaldo o recuperación ante desastre.
- Rendimiento, volumen, latencia o coste.
- Retención y supresión de datos personales, que corresponde a APS-10.

Todo lo anterior es **implementación**. Depende de esta decisión, no al revés.

## 3.3 Materias cerradas

No se reabre ninguna materia de ADR-11 §9. En particular, **ninguna consideración de persistencia podrá determinar qué Leads existen, se registran o se conservan** (E-1 a E-6).

---

# 4. Contexto

## 4.1 Qué ya está decidido

| Documento | Decisión vigente |
| --- | --- |
| **PO-01 §3, §4** | Se registran **todas** las Empresas descubiertas y no duplicadas. La Biblioteca las contiene todas |
| **PO-01 §8** | «Nada se reemplaza. Cada etapa **añade** conocimiento» · «Ninguna etapa expulsa» |
| **APS-03 v3.0 §8.1** | El Registro es el paso 4 del flujo, ejecutado por el Lead Hunter antes del Análisis |
| **APS-07 v2.0 §8.4** | El análisis y el Opportunity Score son **opcionales**; su ausencia es estado válido |
| **ADR-05 §6** | Los agentes nunca acceden a datos persistidos. Persistence pertenece a Infrastructure |
| **ADR-05 §7** | Repository Pattern obligatorio. Entidad de dominio y modelo persistente separados por mappers |
| **ADR-08 §10** | Reglas de dependencia entre capas. `modules/*/domain/` no importa nada de `shared/persistence/` |
| **ADR-11 §7.3** | El dominio opera sobre el conjunto completo. La fragmentación es interna a la capa técnica |
| **ADR-12 §7, §12** | La identidad del Lead es `(Referencia de Origen, Usuario)`. Cinco elementos deben permanecer estables |

## 4.2 Qué advirtió ADR-10

ADR-10 §11.4, punto 3, condicionó expresamente la adopción de un motor de persistencia:

> «Debe ejecutarse **después** de este ADR: de lo contrario, el motor definitivo heredaría un repositorio cuyo significado no está decidido.»

Ese significado quedó decidido por PO-01 y desarrollado en APS-07 v2.0 §8. La condición se cumple y este ADR puede emitirse.

## 4.3 Qué queda sin decidir

Ningún documento establece **cuándo** se escribe cada cosa, **con qué garantías**, ni **qué ocurre al reejecutar** una operación ya realizada. ADR-05 §7 enumera operaciones de repositorio —`save()`, `findById()`, `findByUser()`, `updateStatus()`— sin fijar su semántica.

---

# 5. Problema

**El Blueprint sabe qué guardar y no sabe cómo escribirlo.**

**P-1 — La regla «nada se reemplaza» no tiene traducción operativa.** PO-01 §8 lo exige, pero una operación de guardado convencional sobrescribe por defecto. Sin decisión expresa, la implementación destruirá conocimiento cumpliendo su comportamiento normal.

**P-2 — No hay criterio de atomicidad.** El Registro comprueba identidad y escribe. Si ambas operaciones no son indivisibles, dos búsquedas concurrentes del mismo usuario pueden registrar dos veces la misma Empresa, incumpliendo ADR-12 §12.2 y el criterio de éxito de APS-02 §9.

**P-3 — No hay criterio de reejecución.** Si una búsqueda se repite, o un análisis se solicita dos veces, nada indica si debe producirse un registro nuevo, una actualización o ninguna escritura.

**P-4 — El límite entre estado durable y proyección no está trazado.** APS-07 v2.0 §8.3 distingue la Biblioteca de la vista, pero ningún documento dice qué debe escribirse y qué debe recalcularse. Persistir una vista consolidaría un recorte, en contra de ADR-11.

---

# 6. Qué se Persiste

## 6.1 Principio rector

> **La Biblioteca de Leads es el único estado durable del dominio.**

Todo lo que deba sobrevivir a una ejecución pertenece a la Biblioteca. Todo lo que no pertenezca a la Biblioteca es efímero y debe poder desaparecer sin pérdida.

## 6.2 Inventario de estado durable

| # | Activo | Contenido | Momento de escritura |
| --- | --- | --- | --- |
| **A-1** | **Identidad del Lead** | Referencia de Origen · Usuario · Identificador interno | Registro. **Nunca se modifica** (ADR-12 §12.1) |
| **A-2** | **Atributos de la Empresa** | Nombre · categoría · localización · contacto · sitio web · reputación | Registro y cada actualización posterior |
| **A-3** | **Estadio del ciclo de vida** | Lead · Analizado · Evaluado · Contactado | Al completarse cada transición |
| **A-4** | **Análisis** | Diagnóstico de presencia digital · carencias · oportunidades | Al completarse el Análisis. **Versionado** (§10.3) |
| **A-5** | **Opportunity Score** | Puntuación · banda · explicación | Al completarse la Evaluación. **Versionado** |
| **A-6** | **Propuesta comercial** | La **estrategia comercial estructurada** y las decisiones que la componen · la **evidencia utilizada** *(lista cerrada de hechos afirmables)* · el **texto generado** · el **canal** · la **versión del criterio aplicado** *(ADR-16 §4.4, en desarrollo de PO-02 §3)* | Al generarse. **Versionada** |
| **A-7** | **Decisiones del usuario** | Descarte · recuperación · notas | Al producirse |
| **A-8** | **Historial del Lead** | Registro cronológico de todo lo anterior | Con cada evento. **Solo crece** |
| **A-9** | **Usuario y su perfil profesional** | Credenciales · servicios · cliente objetivo · ámbito | Alta y cada modificación |
| **A-10** | **Ejecuciones de agente** | Agente · entrada · salida · marca temporal | Al finalizar cada ejecución |
| **A-11** | **Diagnóstico Comercial** | Las siete variables de APS-19 §6 con su clase de conocimiento, sus indicios y su confianza · el **Commercial State** · la versión del criterio comercial | Al emitirse. **Versionado** (§10.3) |
| **A-12** | **Secuencia Comercial** | Plan de momentos · momento vigente · por cada contacto, su estrategia y el resultado declarado | Al diseñarse y en cada actualización. **Actualizable**, no versionado |

**A-9** sustenta la categoría *Compatibilidad* del Opportunity Score (APS-08 §6.6). **A-10** corresponde al activo `AgentExecution` ya previsto en ADR-05 §10 y al activo *Historial* de APS-07 v2.0 §5.

> **Sobre A-11 y A-12.** Son **dos activos y no uno** porque necesitan **semánticas de escritura distintas** (§10.1). El Diagnóstico **se versiona**: una manifestación del comprador sustituye la lectura anterior sin destruirla (APS-19 CE-4 y CE-7). La Secuencia **se actualiza**: su estado evoluciona con cada contacto, y versionarla en cada uno multiplicaría el volumen sin aportar nada, porque **A-8 ya conserva el historial**. Fundirlos impondría a uno la semántica del otro.
>
> **El Commercial State no es un activo propio.** Es la variable **BD-1** del Diagnóstico (APS-19 §5.1) y reside dentro de A-11. **No debe confundirse con A-3**, el estadio del ciclo de vida: aquél describe lo que el comprador sabe; éste, lo que AKVEZ ha hecho con el Lead (PO-02 §5.1, LS-5).

## 6.3 Regla de completitud

> **Se persiste el conjunto completo de Empresas descubiertas y no duplicadas. Sin excepción, sin cupo y sin condición de calidad.**

Ninguna consideración de volumen, coste o rendimiento podrá reducir ese conjunto (PO-01 §6; ADR-11 §9, E-2). Si el volumen resulta problemático, se resuelve en Infraestructura —nunca registrando menos.

---

# 7. Qué Nunca Debe Persistirse

| # | No se persiste | Fundamento |
| --- | --- | --- |
| **X-1** | **Vistas, ordenaciones y rankings** | La vista es una proyección; la Biblioteca es la fuente. APS-07 v2.0 §8.3 |
| **X-2** | **Cualquier subconjunto derivado de una limitación técnica** | Consolidaría un recorte en el dominio. ADR-11 §9, E-2 y E-4 |
| **X-3** | **Salidas de presentación en lugar de datos** | El análisis sustituye valores ausentes por texto destinado a la interfaz. Persistirlo almacenaría **prosa donde el contrato espera datos** — defecto identificado en ADR-10 §8.2 |
| **X-4** | **Estado transitorio de ejecución** | Progreso, reintentos y control de tanda pertenecen a Infraestructura. ADR-11 §8.3 |
| **X-5** | **Datos derivados recalculables** | Bandas, recuentos y agregados. Véase §8 |
| **X-6** | **Credenciales en claro y secretos de integración** | APS-10 |
| **X-7** | **Información no pública de terceros** | APS-02 §10: solo información pública. APS-07 v2.0 §12 |
| **X-8** | **Identificadores o rutas internas expuestas al exterior** | ADR-07 |

## 7.1 Precisión sobre X-3

Es el error que ADR-10 documentó y que este ADR previene expresamente:

> **La persistencia se alimenta de la entidad de dominio, nunca de la salida que un agente construye para el usuario.**

Un negocio sin sitio web y sin teléfono debe conservar esos campos **vacíos**, no frases explicativas. La ausencia es un dato (APS-07 v2.0 §8.4); convertirla en texto la destruye como dato.

---

# 8. Qué Puede Reconstruirse

Lo reconstruible **no se persiste** (X-5). Se recalcula bajo demanda.

| # | Elemento | Se reconstruye a partir de |
| --- | --- | --- |
| **R-1** | **Orden de presentación** | El Opportunity Score de cada Lead |
| **R-2** | **Banda de oportunidad** | El Opportunity Score, según los rangos de APS-08 §8 |
| **R-3** | **Recuentos y distribución por banda** | El conjunto de Leads del usuario |
| **R-4** | **Resultado de una búsqueda** | Los Leads registrados en esa ejecución |
| **R-5** | **Vistas filtradas** | La Biblioteca y los filtros activos del usuario |

## 8.1 Qué NO puede reconstruirse

Los siguientes elementos **deben persistirse**, porque su recálculo no reproduciría el valor original:

| Elemento | Por qué |
| --- | --- |
| **El Análisis** | Refleja el estado del mundo en el momento en que se realizó. Un negocio que hoy tiene sitio web pudo no tenerlo entonces |
| **El Opportunity Score** | Depende del perfil del usuario **en el momento de la evaluación**. APS-04 v4.0 §A.5 (P-11) prohíbe el recálculo retroactivo |
| **La Propuesta** | Producto de un modelo generativo. No es determinista |
| **Las decisiones del usuario** | No son derivables de ningún dato |
| **El Historial** | Es la memoria misma |

**Regla de discriminación.** Se persiste lo que **el tiempo puede volver irrepetible**; se recalcula lo que es función determinista del estado actual.

---

# 9. Responsabilidades de Escritura

## 9.1 Reparto oficial

| Componente | ¿Escribe? | Qué escribe | Qué nunca escribe |
| --- | --- | --- | --- |
| **Lead Hunter** | **Sí** | **El Registro** (A-1, A-2, A-3, A-8) y la actualización de atributos en redescubrimientos | Análisis, puntuación, propuesta ni decisiones del usuario |
| **Lead Analyzer** | **Sí** | Análisis (A-4), Opportunity Score (A-5), transiciones de estadio (A-3) | Identidad, ni atributos públicos de la Empresa |
| **Pitch Generator** | **Sí** | Propuesta (A-6) · Diagnóstico Comercial (A-11) · Secuencia Comercial (A-12) | Cualquier otro activo. **En particular, el estadio (A-3)** |
| **Biblioteca** | **Es el destino** | No es un actor: es el estado durable sobre el que los demás escriben | — |
| **Workspace** | **No** | **Nada.** Es una proyección efímera de lo ya registrado | Todo. No tiene estado durable propio |

## 9.2 Reglas de responsabilidad

**W-1. El Lead Hunter es el único que crea Leads.** Ningún otro componente puede dar existencia a un Lead (PO-01 §3; APS-03 v3.0 §7.1).

**W-2. Cada agente escribe solo lo que produce.** Ninguno modifica activos de otro. El Lead Analyzer no corrige el nombre de la Empresa; el Pitch Generator no altera la puntuación.

**W-3. El Workspace no persiste nada.** Es la aplicación de APS-07 v2.0 §8.3 y de APS-04 v4.0 §A.3.4: lo que el Workspace muestra ya está en la Biblioteca desde el Registro. Si el Workspace desapareciera por completo, no se perdería ningún dato.

**W-4. Ningún agente accede directamente al almacenamiento.** Se mantiene íntegro ADR-05 §6, Principio 1: `Agent → Application → Repository → Persistence`.

**W-5. Las decisiones del usuario no las escribe ningún agente.** Descarte, recuperación y notas proceden de la interfaz y se registran como tales (A-7).

---

# 10. Estrategia de Escritura

## 10.1 Las tres operaciones admitidas

> **Registrar · Actualizar · Versionar.**
>
> **No existe una cuarta.** En particular, no existen reemplazo ni supresión de conocimiento de dominio.

| Operación | Qué hace | Cuándo |
| --- | --- | --- |
| **Registrar** | Da existencia a un Lead que no existía | Solo en el Registro, y solo si la identidad no está presente |
| **Actualizar** | Cambia el valor vigente de un atributo, conservando el anterior en el historial | Redescubrimiento con datos distintos · decisión del usuario · transición de estadio |
| **Versionar** | Añade una emisión nueva sin retirar la anterior | Análisis, Opportunity Score y Propuesta |

## 10.2 Regla de no destrucción

> **Ninguna operación de persistencia podrá eliminar conocimiento de dominio ya adquirido.**

Es la traducción operativa de PO-01 §8 y alcanza a cuatro supuestos:

| Supuesto | Regla |
| --- | --- |
| **Supresión de un Lead** | **Prohibida.** «Ninguna etapa expulsa» (PO-01 §8). El descarte es un atributo, no una eliminación |
| **Sobrescritura de un análisis** | **Prohibida.** Se emite una versión nueva (§10.3) |
| **Sobrescritura de una puntuación** | **Prohibida.** Ídem |
| **Pérdida de un atributo anterior** | **Prohibida.** La actualización conserva el valor previo en el historial (ADR-12 D-5) |

**Precisión.** Esta regla protege el **conocimiento de dominio**. No impide la supresión de datos personales cuando el usuario ejerza sus derechos conforme a APS-10: esa es una obligación legal, ajena a esta decisión y prevalente sobre ella.

## 10.3 Versionado

**Se versionan cuatro activos: Análisis (A-4), Opportunity Score (A-5), Propuesta (A-6) y Diagnóstico Comercial (A-11).**

> **La Secuencia Comercial (A-12) no se versiona.** Se actualiza. Es la única de las dos incorporaciones de §6.2 que no entra aquí, y la razón es de volumen: su estado cambia con cada contacto y **A-8 ya conserva íntegro el rastro de esos cambios**.

| Regla | Enunciado |
| --- | --- |
| **V-1** | Cada emisión nueva **añade** una versión. Ninguna retira la anterior |
| **V-2** | Existe siempre una **versión vigente**, que es la que se presenta al usuario. **La vigente es la de mayor número de emisión (`issue`) dentro de su clave de identidad.** El número de emisión **forma parte de la identidad del agregado** (ADR-16 §4.2, §4.4) y es **monótono creciente por V-1**. **`issuedAt` es metadato temporal y NO determina la vigencia.** Aplica a los cuatro activos versionados de esta sección |
| **V-3** | Cada versión conserva su marca temporal y la ejecución de agente que la produjo (A-10) |
| **V-4** | El Opportunity Score conserva **el perfil de usuario con el que se calculó**, sin el cual la puntuación no es interpretable a posteriori |
| **V-5** | Una versión nueva **nunca altera la identidad** ni el estadio ya alcanzado |

**Por qué se versiona el Análisis.** ADR-12 D-7 establece que un cambio de sitio web invalida el diagnóstico previo. «Invalidar» significa que deja de ser vigente, **no que se borre**: la comparación entre el diagnóstico anterior y el nuevo es conocimiento comercial —muestra si el negocio mejoró o empeoró—.

**Por qué se versiona la Propuesta.** APS-04 v4.0 §A.5 (P-10) permite regenerar. Sin versionado, regenerar destruiría una propuesta que el usuario podía preferir.

**Por qué se versiona el Diagnóstico Comercial.** APS-19 §4.3 establece que **una manifestación del comprador prevalece sobre toda lectura inferida**. «Prevalecer» significa que la sustituye, **no que la borre**: comparar el diagnóstico anterior con el corregido por el propio comprador es el conocimiento comercial más valioso que el sistema puede adquirir (APS-19 CE-4).

## 10.4 Actualización de atributos

**Regla U-1.** Un redescubrimiento con datos distintos actualiza el atributo y registra el cambio (ADR-12 D-4).

**Regla U-2.** La actualización de un atributo **no invalida** por sí sola el análisis ni la puntuación, salvo en el supuesto de ADR-12 D-7.

**Regla U-3.** La fecha de descubrimiento **nunca se actualiza** (ADR-12 §8.3, E-4).

**Regla U-4.** Un valor ausente en un redescubrimiento **no borra** un valor conocido. La ausencia en la fuente no es una afirmación de inexistencia.

> **U-4 es una regla de seguridad de datos.** Sin ella, una respuesta parcial de la fuente vaciaría atributos correctos ya conocidos.

---

# 11. Modelo de Consistencia

## 11.1 Operaciones atómicas

> **La Unidad de Registro es la única operación del dominio que debe ser atómica.**

Comprende, de forma **indivisible**:

1. La determinación de la identidad de la Empresa conforme a ADR-12 §7.
2. La comprobación de si esa identidad ya está presente en la Biblioteca del usuario.
3. La escritura del Lead, **si y solo si** no estaba presente.

**Por qué debe serlo.** Si la comprobación y la escritura pueden intercalarse, dos ejecuciones concurrentes del mismo usuario registrarán dos veces la misma Empresa. Se incumpliría ADR-12 §12.2 y, con ello, el criterio de éxito de la V1 (APS-02 §9).

**Segunda operación atómica: la Reconciliación** (ADR-12 §9.5). La unificación de dos Leads debe completarse por entero o no producirse: una unificación a medias dejaría conocimiento huérfano, en contra de D-10.

**Ninguna otra operación requiere atomicidad**, porque todas las demás enriquecen un Lead que ya existe y cuya identidad ya está fijada.

## 11.2 Operaciones que pueden ser asíncronas

| Operación | Condición |
| --- | --- |
| **Análisis** | Puede diferirse. Un Lead sin analizar es estado válido (PO-01 §5) |
| **Evaluación** | Puede diferirse, **siempre después del Análisis** (APS-07 v2.0 §6.3) |
| **Generación de propuesta** | Puede diferirse. Requiere Lead Evaluado |
| **Registro de ejecución de agente** (A-10) | Puede diferirse. Es observabilidad |

**Regla A-1 — La asincronía nunca altera el orden.** El orden canónico del ciclo de vida es invariante. Diferir una etapa no autoriza a adelantar la siguiente.

**Regla A-2 — La asincronía nunca altera el conjunto.** Si una etapa diferida falla, el Lead permanece en su estadio anterior. **Nunca desaparece de la Biblioteca** (PO-01 §8).

> **Nota de compatibilidad.** APS-03 v3.0 §8.1 establece que «cada etapa deberá finalizar correctamente antes de iniciar la siguiente». Las reglas A-1 y A-2 la respetan: se preserva el **orden**, no la **sincronía respecto de la petición del usuario**. La ejecución diferida es admisible; la alteración del orden no. **Este punto requiere ratificación expresa del Product Office** (§19, punto 4).

> ## ✅ Ratificación expresa — v1.1, 2026-07-29
>
> **El Product Office se pronunció en el sprint GOV-01: se admite la ejecución diferida** de Análisis, Evaluación y Propuesta, bajo las reglas A-1 y A-2.
>
> **Interpretación oficial de APS-03 v3.0 §8.1.** La expresión «cada etapa deberá finalizar correctamente antes de iniciar la siguiente» es un requisito de **orden lógico del flujo**, no de sincronía respecto de la petición del usuario. En consecuencia:
>
> - el **orden** de ejecución es obligatorio;
> - la **dependencia** entre etapas es obligatoria;
> - la **sincronía con la respuesta HTTP no es obligatoria**.
>
> **El Registro no queda afectado:** sigue siendo la única operación atómica, transaccional y **no diferible** (§11.1). Todo enriquecimiento posterior puede ejecutarse de forma diferida.
>
> Esta ratificación cierra el punto 4 de §19. **Ningún contenido técnico fue modificado.**

## 11.3 Operaciones idempotentes

> **Toda operación de escritura del dominio deberá ser idempotente respecto de la identidad del Lead.**

| Operación | Comportamiento al repetirse |
| --- | --- |
| **Registro** | **No produce efecto.** La identidad ya está presente; se actualizan atributos si difieren (§10.4) |
| **Análisis** | Produce una **versión nueva**, no un Lead nuevo |
| **Evaluación** | Ídem |
| **Generación de propuesta** | Ídem |
| **Descarte** | No produce efecto si ya estaba descartado |
| **Reconciliación** | No produce efecto si ya se reconcilió |

**Regla I-1.** Repetir una búsqueda completa **no puede alterar el conjunto de Leads del usuario**, salvo por las Empresas nuevas que aparezcan.

**Regla I-2.** La idempotencia se apoya **exclusivamente** en la identidad de ADR-12. No se admite ningún otro mecanismo de detección de repetición.

---

# 12. Relación con ADR-12

## 12.1 Regla de precedencia

> **La identidad se determina antes de escribir, nunca al escribir.**

Es la garantía central que la persistencia debe al dominio.

**Corolario A.** El identificador que la capa de persistencia asigna **representa** la identidad; no la constituye (ADR-12 §12.3). Puede cambiar de formato o de mecanismo sin afectar a la identidad, siempre que se conserve su correspondencia con la Referencia de Origen.

**Corolario B.** La comprobación de presencia (§11.1, paso 2) se realiza **sobre la identidad natural**, nunca sobre el identificador interno. Comprobar por identificador interno es lógicamente imposible: el de un Lead recién descubierto aún no existe.

## 12.2 El defecto actual que esta regla corrige

La implementación vigente asigna identidad **en el momento de guardar** (verificado en ADR-12 §4.3). Bajo esa mecánica, la deduplicación **no puede funcionar en ningún caso**: cada escritura produce una identidad nueva por construcción.

Es el riesgo **R-3** de ADR-12, y esta sección es su mitigación arquitectónica.

## 12.3 Garantías exigidas a la persistencia

| # | Garantía | Origen |
| --- | --- | --- |
| **G-1** | La Referencia de Origen se conserva íntegra durante toda la vida del Lead y nunca se sobrescribe | ADR-12 E-1 |
| **G-2** | El usuario propietario no cambia nunca | ADR-12 E-2 |
| **G-3** | El identificador interno no se reasigna, no se reutiliza y no se regenera | ADR-12 E-3 |
| **G-4** | La fecha de descubrimiento no se actualiza en los redescubrimientos | ADR-12 E-4 |
| **G-5** | El historial solo crece; ninguna entrada se elimina ni se modifica retroactivamente | ADR-12 E-5 |
| **G-6** | Dentro del espacio de un usuario no coexisten dos Leads con la misma Referencia de Origen | ADR-12 §12.2 |
| **G-7** | Un Lead puede acumular varias Referencias de Origen; ninguna se elimina | ADR-12 D-6 |
| **G-8** | **Unicidad de identidad.** El sistema **debe impedir múltiples registros con la misma identidad lógica** dentro del espacio de un usuario | ADR-16 §4.2, §4.3, §4.4 |
| **G-9** | **Atomicidad de la persistencia.** La creación **debe garantizar que operaciones concurrentes no produzcan duplicados** | §11.1 · R-30 |
| **G-10** | **Resolución determinista de conflictos.** Ante conflicto de identidad: **no duplicar · no sobrescribir silenciosamente · devolver un resultado determinista** | §10.2 · R-64 |

## 12.4 Independencia del motor

> **La identidad del Lead no podrá depender en ningún grado del motor de persistencia.**

Un cambio de motor no podrá alterar qué Leads existen, cuáles son el mismo ni cuál es su historia. Es la aplicación del Criterio de Invariancia del Conjunto (ADR-11 §7.1) a la capa de datos: si al sustituir el motor cambiase el conjunto de Leads, la identidad estaría en el lugar equivocado.

---

# 13. Catálogo de Eventos del Dominio

## 13.1 Tabla de eventos

| # | Evento | Agente | ¿Escribe? | ¿Actualiza? | ¿Versiona? | Activos afectados |
| --- | --- | --- | :-: | :-: | :-: | --- |
| **E-1** | **Empresa descubierta** | Lead Hunter | **No** | No | No | **Ninguno.** Solo lectura de la Biblioteca para comprobar identidad |
| **E-2** | **Lead registrado** | Lead Hunter | **Sí** | No | No | A-1, A-2, A-3, A-8 |
| **E-2b** | **Lead redescubierto** | Lead Hunter | No | **Sí** | No | A-2, A-8 |
| **E-3** | **Lead analizado** | Lead Analyzer | Sí | **Sí** *(estadio)* | **Sí** | A-3, A-4, A-8, A-10 |
| **E-4** | **Score calculado** | Lead Analyzer | Sí | **Sí** *(estadio)* | **Sí** | A-3, A-5, A-8, A-10 |
| **E-5** | **Propuesta comercial emitida** | Pitch Generator | Sí | **No** | **Sí** | A-6, A-8, A-10 |
| **E-6** | **Decisión del usuario registrada** | — *(usuario)* | Sí | **Sí** | No | A-7, A-8 |
| **E-7** | **Diagnóstico comercial emitido** | Pitch Generator | Sí | No | **Sí** | A-11, A-8, A-10 |
| **E-8** | **Secuencia comercial diseñada o actualizada** | Pitch Generator | Sí | **Sí** | No | A-12, A-8, A-10 |
| **E-9** | **Contacto declarado** | — *(usuario)* | Sí | **Sí** *(estadio)* | **Condicional** | A-3, A-11, A-12, A-8 |

## 13.2 Eventos que solo generan lectura

| Evento | Naturaleza |
| --- | --- |
| **E-1 Empresa descubierta** | Una Empresa descubierta y **aún no registrada no existe para el sistema**. Solo se lee la Biblioteca para comprobar su identidad |
| **Consulta de la Biblioteca** | Lectura pura |
| **Apertura del Workspace** | Proyección de lo ya registrado (W-3) |
| **Ordenación, filtrado y paginación** | Reconstruibles (§8, R-1 y R-5) |
| **Consulta del Dashboard** | Recuentos recalculados (R-3) |

## 13.3 Precisiones

**Sobre E-1.** Es el evento más importante del catálogo y el que más se presta a error. **Descubrir no escribe.** El paso que da existencia es el Registro (E-2), y entre ambos media la comprobación de identidad. Confundirlos reintroduciría la escritura sin deduplicación que presenta la implementación actual.

**Sobre E-2 y E-2b.** Son el mismo hecho del mundo —AKVEZ encuentra una Empresa— con dos resultados distintos según la identidad esté presente o no. Su discriminación es la Unidad de Registro (§11.1). **E-2b es la razón de existir de ADR-12.**

**Sobre E-3 y E-4.** Actualizan el estadio y **versionan** su activo. Nunca reemplazan la emisión anterior (§10.3).

**Sobre E-5 — corregido en la v1.2.** **Emitir una Propuesta ya no actualiza el estadio.** Versiona A-6 y nada más. La razón la fija **PO-01 v1.2 §8** y la desarrolla **PO-02 §5**: contactar es un acto en el mundo que AKVEZ **no realiza y no puede observar**. Marcar *Contactado* al redactar un texto hacía que la Biblioteca afirmara algo que nadie había comprobado, y bastaba abrir una propuesta y descartarla para corromper el estadio de un Lead. **Una Propuesta emitida y no enviada es un estado válido.**

**Sobre E-6.** No lo produce ningún agente, sino la decisión del usuario. Incluye descarte, recuperación y notas. **El descarte actualiza un atributo; no elimina nada** (PO-01 §8; ADR-12 §10.7).

**Sobre E-7 y E-8.** Los produce el agente comercial y no tocan el estadio. **E-7 versiona** el Diagnóstico; **E-8 actualiza** la Secuencia. La asimetría es deliberada y se justifica en §6.2 y §10.3.

**Sobre E-9 — la segunda transición no ejecutada por un agente.** Lo produce **el usuario**, igual que E-6, y es **el único evento que puede llevar un Lead a `Contacted`** (PO-02 §5, §5.1).

**Su versionado es condicional**, y es la única condicionalidad del catálogo junto a la de E-2/E-2b:

| Lo que el usuario declara | Efecto |
| --- | --- |
| **No respondió** | Actualiza A-12 y A-8. **No versiona** |
| **Respondió**, sin contenido aprovechable | Actualiza A-3, A-12 y A-8. **No versiona** |
| **Respondió con una manifestación** | Actualiza A-3, A-12 y A-8, **y versiona A-11**: la manifestación puede convertir una variable del Diagnóstico de *Inferida* en *Observable* (APS-19 §4.3) |

**Por qué no se amplió E-6 en su lugar.** E-6 declara *«¿Versiona? No»*. Un evento que puede versionar A-11 rompería esa declaración. **E-2 y E-2b sientan el precedente**: un mismo hecho del mundo con dos resultados distintos se modela como eventos discriminados, no como uno ambiguo.

## 13.4 Regla de cierre del catálogo

> **Ningún evento no enumerado aquí podrá escribir en la Biblioteca.**

Incorporar un evento de escritura nuevo exigirá enmendar este ADR. La regla impide que la superficie de escritura crezca de forma incontrolada, que es el mecanismo por el que un modelo pierde coherencia.

---

# 14. Consecuencias

## 14.1 Positivas

- **PO-01 §8 adquiere traducción operativa.** «Nada se reemplaza» deja de ser un principio y pasa a ser una regla de escritura verificable (§10.2).
- **La deduplicación se vuelve construible.** La Unidad de Registro (§11.1) define exactamente qué debe ser indivisible y por qué.
- **El motor de persistencia puede elegirse sin riesgo.** Se cumple la condición que ADR-10 §11.4 impuso: el significado del repositorio está decidido antes que la tecnología.
- **La frontera entre estado durable y proyección queda trazada.** §6, §7 y §8 impiden que una vista se consolide como dato, defecto que ADR-10 §8.2 había identificado.
- **La reejecución deja de ser peligrosa.** La idempotencia (§11.3) garantiza que repetir una búsqueda no altere el conjunto de Leads.
- **El Opportunity Score se vuelve interpretable a posteriori**, al conservar el perfil con el que se calculó (V-4).
- **No se modifica ninguna decisión vigente.** ADR-05, ADR-08 y ADR-09 permanecen íntegros; este ADR añade semántica a la estructura que ya definieron.

## 14.2 Negativas

- **El volumen de datos crece más deprisa.** El versionado conserva todas las emisiones de análisis, puntuación y propuesta. Es coste consciente de §10.2 y debe resolverse en Infraestructura, nunca reduciendo lo que se conserva.
- **La atomicidad de la Unidad de Registro impone una restricción real** a la capa de datos, que condicionará la elección de motor.
- **La prohibición de destruir conocimiento complica la corrección de errores.** Un dato erróneamente registrado no puede eliminarse; solo corregirse dejando rastro.
- **El versionado exige distinguir versión vigente de histórica** en toda lectura, lo que añade complejidad a la capa de acceso.
- **Este ADR no reduce el trabajo pendiente de elegir motor:** lo habilita, pero la elección sigue siendo una decisión posterior.

---

# 15. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **La implementación conserva la asignación de identidad en la escritura**, y la deduplicación nunca llega a funcionar | **Alta** | §12.1 y §12.2. Es el defecto vigente verificado en ADR-12 §4.3 |
| **R-2** | **La Unidad de Registro se implementa sin atomicidad** y aparecen duplicados bajo concurrencia | **Alta** | §11.1. Debe verificarse explícitamente antes de dar por cumplido APS-02 §9 |
| **R-3** | **El versionado se omite por simplicidad** y las emisiones sobrescriben a las anteriores, destruyendo conocimiento | **Alta** | §10.2 y §10.3. Es el incumplimiento más probable, porque sobrescribir es el comportamiento por defecto de cualquier almacenamiento |
| **R-4** | **Se persiste la salida de presentación** en lugar de la entidad de dominio, almacenando prosa donde se esperan datos | Media | X-3 y §7.1. Defecto ya observado y documentado en ADR-10 §8.2 |
| **R-5** | **U-4 se omite** y un redescubrimiento parcial vacía atributos correctos ya conocidos | Media | §10.4, U-4 |
| **R-6** | **El crecimiento del volumen motiva una política de purga** que elimina Leads o versiones antiguas | Media | §6.3 y §10.2. Vulneraría PO-01 §8 y ADR-11 §9, E-2 y E-5 |
| **R-7** | **La asincronía altera el orden canónico** y se puntúa antes de analizar | Media | A-1. Requiere ratificación del Product Office (§11.2, nota) |
| **R-8** | **Aparecen escrituras fuera del catálogo** de §13 y la superficie de persistencia crece sin control | Baja | §13.4 |

---

# 16. Dependencias

**Depende de:**

- **PO-01** §3, §4, §5, §6, §8. Autoridad funcional del dominio.
- **ADR-12** §7, §9, §12. Identidad canónica del Lead. **Prerrequisito absoluto de este ADR.**
- **APS-07 v2.0** §5, §7.2, §8.1, §8.3, §8.4. Contenido de la Biblioteca y opcionalidad de atributos.
- **APS-03 v3.0** §7, §8.1, §8.2. Reparto de responsabilidades entre agentes y orden del flujo.
- **APS-02 v2.1** §9, FR-006, FR-008. Criterio de éxito de la V1.
- **APS-08 v1.1** §6.6, §8. Dependencia del Score respecto del perfil y rangos de banda.
- **APS-10** — Security, Privacy & Trust Framework. Prevalece sobre §10.2 en materia de datos personales.
- **ADR-05 v1.3** §6, §7, §9, §10, §12. Estructura de la capa de persistencia. **No se modifica.**
- **ADR-08** §8, §10. Fronteras y reglas de dependencia entre capas. **No se modifican.**
- **ADR-11** §7.1, §7.3, §8.3, §9. Frontera dominio/implementación.
- **ADR-10** *(Archived)* §8.2, §11.4 punto 3. Origen documental de esta decisión.

**Condiciona a:**

- La **elección del motor de persistencia**, que deberá satisfacer la atomicidad de §11.1 y las siete garantías de §12.3.
- El **esquema de datos**, el versionado físico y la estrategia de lectura de versiones vigentes.
- La implementación del caso de uso de descubrimiento, del orquestador y del adaptador de persistencia, enumerados en PO-01 §9.3.

**No afecta a:** ADR-01, ADR-02, ADR-04, ADR-06, ADR-07 ni ADR-09.

---

# 17. Glosario

| Término | Definición |
| --- | --- |
| **Estado durable** | Información que sobrevive a una ejecución y pertenece a la Biblioteca de Leads (§6.1) |
| **Proyección** | Representación efímera derivada del estado durable. No se persiste (§7, §8) |
| **Unidad de Registro** | Operación indivisible que determina la identidad, comprueba su presencia y, en su caso, escribe el Lead (§11.1) |
| **Versión vigente** | Emisión más reciente de un activo versionado. Es la que se presenta al usuario (V-2) |
| **Idempotencia** | Propiedad por la que repetir una operación no produce efecto adicional sobre el conjunto de Leads (§11.3) |
| **Activo versionado** | Análisis, Opportunity Score y Propuesta. Se acumulan por emisiones sucesivas (§10.3) |
| **Conocimiento de dominio** | Toda información adquirida sobre un Lead que no puede recalcularse. Protegida por §10.2 |

---

# 18. Referencias

- **PO-01** — Decisión de Producto: Definición Canónica de Lead, §3, §4, §5, §6, §8, §9.3.
- **ADR-12** — Identidad Canónica del Lead, §4.3, §7, §8.3, §9, §10.7, §12.
- **APS-02 v2.1** — Product Scope, §9, §10, FR-006, FR-008.
- **APS-03 v3.0** — Agent Architecture, §7, §8.1, §8.2.
- **APS-04 v4.0** — Human Interface System, §A.3.4, §A.5, §A.9.
- **APS-07 v2.0** — Data & Knowledge Architecture, §5, §7.2, §8.1, §8.3, §8.4, §12.
- **APS-08 v1.1** — Opportunity Scoring Framework, §6.6, §8.
- **APS-10** — Security, Privacy & Trust Framework.
- **ADS-00 v1.2** — Documentation Standard.
- **ADR-05 v1.3** — Persistence Architecture & Data Layer, §6, §7, §9, §10, §12.
- **ADR-08** — Persistence Boundary & Repository Isolation, §8, §10.
- **ADR-10** — Ubicación de la Persistencia *(Archived)*, §8.2, §11.4.
- **ADR-11** — Frontera entre Dominio e Implementación, §7.1, §7.3, §8.3, §9.
- **AR-02** — Blueprint Readiness Assessment, §4.1 (DC-2), §5.2.

---

# 19. Definition of Done

Este ADR podrá considerarse completo cuando el Product Office:

1. **Ratifique que la Biblioteca es el único estado durable del dominio** (§6.1) y que el Workspace no persiste nada (W-3).
2. **Apruebe la estrategia de escritura acumulativa** de §10, y en particular el **versionado** de Análisis, Opportunity Score y Propuesta, asumiendo su coste en volumen.
3. **Confirme que la Unidad de Registro es la única operación atómica exigida** (§11.1), junto con la Reconciliación.
4. **Se pronuncie expresamente sobre la asincronía** (§11.2): si se admite la ejecución diferida de Análisis, Evaluación y Propuesta preservando el orden canónico, o si APS-03 v3.0 §8.1 debe leerse como exigencia de ejecución síncrona.
5. **Ratifique el catálogo de eventos de §13 como cerrado** (§13.4).

Hasta que los cinco puntos se cumplan, este documento permanece en estado **`Draft`** y no habilita ninguna implementación.

> **Nota sobre el alcance.** Cumplidos los cinco puntos, queda habilitada la elección del motor de persistencia — decisión posterior que este ADR **no toma** y que deberá satisfacer la atomicidad de §11.1 y las siete garantías de §12.3.

---

> ## ✅ Definition of Done — cerrada (v1.1, 2026-07-29)
>
> **Los cinco puntos quedaron cumplidos en el sprint GOV-01.** La condición de permanencia en `Draft` dejó de tener efecto y el documento **habilita implementación**.
>
> | # | Condición | Cumplimiento |
> | --- | --- | --- |
> | 1 | Ratificación de la Biblioteca como único estado durable (§6.1) y de W-3 | **Cumplida.** El Workspace no persiste nada |
> | 2 | Aprobación de la escritura acumulativa de §10, con su coste en volumen | **Cumplida.** Versionado de Análisis, Score y Propuesta asumido |
> | 3 | Confirmación de la Unidad de Registro como única operación atómica (§11.1) | **Cumplida.** Junto con la Reconciliación |
> | 4 | **Pronunciamiento expreso sobre la asincronía (§11.2)** | **Cumplida — se admite la ejecución diferida.** APS-03 v3.0 §8.1 se interpreta como orden lógico, no como sincronía con la petición. Véase el bloque de ratificación de §11.2 |
> | 5 | Ratificación del catálogo de eventos de §13 como cerrado | **Cumplida.** Los siete eventos son lista cerrada (§13.4) |
>
> **Autoridad:** AKVEZ Product Office, pronunciamiento del 2026-07-29.
>
> **Efecto sobre DC-2.** Queda habilitada la elección del motor, ya materializada en **ADS-02**. Con ambos documentos aprobados, la deuda crítica **DC-2** de AR-02 §4.1 queda cerrada por completo.
