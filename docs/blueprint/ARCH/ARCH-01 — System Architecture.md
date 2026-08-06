# ARCH-01 — Arquitectura del Sistema AKVEZ

| Campo | Valor |
| --- | --- |
| Código | ARCH-01 |
| Clasificación | **Mapa de arquitectura física** — ver nota de cumplimiento ADS-00 |
| Versión | 1.3 |
| Estado | ✅ **Approved** — **Mapa oficial de arquitectura** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** y **Architecture Team** — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30 |
| Subordinado a | **ADR-01 · ADR-04 · ADR-08 · ADR-09 · ADR-15 · ADR-16 · ADR-17 · DEV-00 §4** |
| Origen | Sprint *Architecture Boundary Stabilization* |

> ## Este documento no contiene ninguna decisión abierta
>
> **ARCH-01 es el mapa oficial de la arquitectura física de AKVEZ.** Localiza; **no decide**. Toda afirmación remite al ADR que la decidió, y **ante discrepancia prevalece el ADR**.
>
> **Las dos divergencias que la v1.1 dejaba abiertas quedaron cerradas** *(§8)*: la estrictez de la dependencia, por **ADR-17 §12**; el nombre de la capa, por adopción definitiva de **`presentation/`**, que es el de ADR-01 §8. **Ninguna sección de este documento remite ya a una decisión pendiente.**

**Nota de cumplimiento ADS-00.** La Clasificación Oficial de ADS-00 es **cerrada** y «ARCH» no pertenece a ella. **Este documento no decide arquitectura: la localiza.** Cada afirmación remite al ADR que la decidió; ante discrepancia **prevalece el ADR**, y el documento defectuoso es éste. Precedente: **ADS-API-01** y **AR-04**.

> **Sustituye al borrador `docs/architecture/ARCH-01`** del sprint anterior, retirado para que no coexistan dos documentos con el mismo código.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.3** | 2026-07-30 | AKVEZ Product Office · Architecture Team | **Aprobación como Mapa oficial de arquitectura. Se elimina toda referencia a decisiones pendientes.** Estado `Draft` → **`Approved`**. **§1.2** — la nota sobre la fila de `application/` pasa de «pendiente» a la prohibición vigente por **ADR-17 AL-19**. **§4** — se adopta la **nomenclatura canónica de ADR-16 §7** para los cuatro casos de uso: `GenerateDiagnosis`, `CreateSequence`, `GenerateProposal` y `RegisterContact`. La v1.2 usaba tres nombres distintos, contra ADS-00 *Terminología*; **prevalece el ADR**. **§6.0 y §6.1** — la Opción B y DR-3 pasan de decididas a **vigentes**; se retira la marca `Draft` de ADR-17. **§8.1** — el nombre de la capa se cierra: **`presentation/` es el definitivo**. **§8.2** — cerrada: el descenso normativo está ejecutado. **§9** — DoD completa. **§10** — versiones actualizadas. **No se modifica §2, §3, §5, §7 ni ninguna validación.** | Sprint **Gobernanza Final (Architecture Freeze)**, paso 8. Un mapa que remite a decisiones abiertas induce el error que su propia *Regla de uso* previene. **Los siete ADR de los que depende están `Approved`**, de modo que ninguna afirmación de este documento remite ya a un `Draft`. |
| **1.2** | 2026-07-30 | AKVEZ Architecture Team | **Sincronización con ADR-08, ADR-09 y ADR-17.** Cuatro correcciones, todas por contradicción demostrable con un documento de rango superior, **ninguna decisional**. **§1.2** — se retiran los *adapters de persistencia* del contenido admitido de `infrastructure/`: viven en `shared/persistence/adapters/` *(R-25 · ADR-08 §10)*, como el propio §5 ya declaraba. **§6.0** — la tabla de documentos afectados nombra **ADR-17** como vehículo normativo de la Opción B e incorpora **ADR-09 §8**, que la tabla original omitía y sin cuya extensión la decisión es inejecutable. **§6.1** — se corrige **DR-6**, que atribuía a `domain/` la declaración de **todo** puerto, contra **ADR-08 §6 y §10**; se distingue puerto de persistencia y puerto de proveedor conforme a **ADR-17 §6.2**. **§8.2** y **§9** — se elimina la contradicción interna: §8.2 declaraba la divergencia resuelta mientras §9 la enumeraba entre las abiertas. **No se modifica §2, §3, §4, §5, §7, ninguna validación ni la decisión de §6.0.** | Sprint *Cierre de Arquitectura Base*, punto 1. La v1.1 adoptó la Opción B en un documento que **no pertenece a la Clasificación Oficial de ADS-00** y que declara no decidir arquitectura. **DR-6, leído literalmente, obligaba a trasladar las Repository Interfaces al dominio de cada módulo, contra un ADR `Approved`.** La corrección era condición para que los tres documentos del flujo de dependencias describiesen la misma arquitectura. |
| **1.1** | 2026-07-30 | AKVEZ Architecture Team | **Cierre de las decisiones abiertas.** **§6.0** adopta la **Opción B — dependencia hexagonal estricta**: `application/` depende únicamente de puertos y no importa ningún adapter concreto. Se conserva el nombre **`presentation/`**. **§2.0** publica la Línea de Decisión con las materias que decide `domain/` y las que expresa `infrastructure/`. **§6.1** incorpora la regla **DR-6** y corrige **DR-3**. **§8.2** pasa de divergencia abierta a **resuelta**, con la sincronización de DEV-00 §4.1 pendiente de descenso normativo. | Sprint *Cierre de Arquitectura Base*. La estrictez de dependencia y el nombre de la capa eran **decisiones independientes** que el enunciado agrupaba: se resuelven por separado. **El coste de B resultó menor de lo estimado**: AKVEZ ya aplica puertos a la persistencia, y la permisividad de DEV-00 §4.1 solo se ejerce en **tres adapters de proveedor**. |
| 1.0 | 2026-07-30 | AKVEZ Architecture Team | Arquitectura física del sistema: responsabilidad de las cinco carpetas, frontera de `domain/`, ubicación de las seis capacidades comerciales, cuatro casos de uso con entrada, salida, dependencias y evento, adapters de infraestructura, regla de dependencia y tres validaciones. | Sprint *Architecture Boundary Stabilization*. **ADR-15** decidió dónde vive cada preocupación y **ADR-16** sobre qué objetos opera; faltaba la **estructura física verificable**. Registra en **§8** una divergencia real entre el diagrama de dependencia solicitado y DEV-00 §4.1. |

---

# Tabla de Contenido

1. Estructura principal de módulos
2. Frontera de `domain/`
3. Commercial Intelligence Boundary
4. Casos de uso — `application/`
5. `infrastructure/`
6. Regla de dependencia
7. Validaciones obligatorias
8. Divergencias registradas
9. Definition of Done

---

# 1. Estructura principal de módulos

## 1.1 Las cinco carpetas y el eje que las contiene

Las cinco carpetas solicitadas **son exactamente las capas de ADR-01 §8**, con un cambio de nombre y una adición:

| Solicitado | Canónico | Relación |
| --- | --- | --- |
| `domain/` | `domain/` | **Idéntico** |
| `application/` | `application/` | **Idéntico** |
| `infrastructure/` | `infrastructure/` | **Idéntico** |
| `interfaces/` | **`presentation/`** | **Misma capa, otro nombre** — §8.1 |
| `shared/` | `shared/` | **Ya existe** en DEV-00 §4.2 |

**Viven dentro de un módulo, no por encima de él.** ADR-01 §10.1 es terminante: *«toda funcionalidad pertenece a un módulo; no existe código de negocio fuera de `modules/`»*. Las capas son el eje **horizontal**; el módulo, el **vertical**. Ambos existen simultáneamente.

```text
server/                              BACKEND
├── modules/
│   ├── lead-hunter/
│   ├── lead-analyzer/
│   └── pitch-generator/             ← el Sistema Comercial vive aquí
│       ├── domain/                  decide
│       ├── application/             coordina
│       ├── infrastructure/          comunica
│       └── presentation/            expone  (= interfaces/)
├── orchestrators/                   único componente que coordina agentes
├── routes/                          adaptadores HTTP delgados
├── bootstrap/                       Composition Root único
└── shared/                          ai · config · errors · types · utils
                                     contracts · mappers · observability
                                     persistence/{contracts,repositories,models,adapters}

src/                                 FRONTEND — misma estructura de módulo
```

> **Por qué el eje de módulo no es opcional.** Sin él, la regla que impide que un agente conozca a otro *(ADR-04 §7.6)* **deja de ser comprobable**: si `domain/leads/` y `domain/intelligence/` fueran carpetas hermanas, nada distinguiría un import legítimo de una violación de frontera. **El aislamiento entre agentes es una propiedad de la estructura, no del criterio del revisor.**

## 1.2 Responsabilidad, contenido admitido y contenido prohibido

| Carpeta | Responsabilidad | Puede contener | **Prohibido** |
| --- | --- | --- | --- |
| **`domain/`** | **Decide.** Reglas de negocio puras | Entidades · reglas comerciales · políticas · servicios de dominio · value objects · decisiones | §2 |
| **`application/`** | **Coordina.** Encadena decisiones que toma el dominio | Casos de uso · factories que reciben dependencias *(R-56)* | Criterio comercial · `shared/contracts/` · `shared/mappers/` · `adapters/`, `models/`, `contracts/` de persistencia · HTTP |
| **`infrastructure/`** | **Comunica.** Implementa lo que el dominio decidió | Adapters de proveedor · valores operativos | **Toda decisión comercial** · `shared/contracts/` · `shared/mappers/` · **el driver de base de datos y todo adapter de persistencia** *(R-25 · ADR-08 §10)* |
| **`presentation/`** *(interfaces)* | **Expone.** Agent API en backend; interfaz en frontend | El tipo del caso de uso que expone `application/` | `shared/persistence/` **en ninguna de sus cuatro subcarpetas, sin excepción** *(R-23)* · lógica de negocio *(R-48)* |
| **`shared/`** | Servicios transversales sin lógica de negocio | Las nueve subcarpetas de DEV-00 §4.2 | Lógica de negocio de ningún módulo · reglas comerciales |

*(ADR-01 §8 · ADR-04 §8, §10, §11 · ADR-07 §8 · ADR-08 §8, §10 · ADR-09 §5.2 · DEV-00 §4.1)*

> **Dos precisiones sobre la fila de `infrastructure/`, corregidas en la v1.2.**
>
> **La persistencia no vive en `modules/*/infrastructure/`.** Vive en `shared/persistence/adapters/`, único lugar del sistema autorizado a importar el driver de base de datos *(R-25 · ADR-08 §10 · ADS-02 §5.3)*. **§5 de este documento ya lo decía**; la fila de §1.2 lo contradecía.
>
> **Sobre la fila de `application/`.** Su columna de prohibiciones **incluye `modules/*/infrastructure/` desde la ratificación de ADR-17 §12** *(regla **AL-19**)*. Un caso de uso recibe su proveedor **como puerto**, nunca como adapter. **La facultad que ADR-07 §8 concedía quedó retirada por una decisión posterior de su mismo rango.** Véase §6.0 y §8.2.

---

# 2. Frontera de `domain/`

> **`domain/` decide. Nada más decide.**

## 2.0 La Línea de Decisión

**Enunciado oficial** *(ADR-15 §8)*:

> **Todo lo que decide vive en `domain/`. Todo lo que expresa o comunica vive en `infrastructure/`.**

### `domain/` decide

| Materia | Documento que la define |
| --- | --- |
| **Reglas comerciales** | APS-18 §4 — los ocho principios |
| **Scoring** | APS-08 §6-§8 · el Perfil de Ponderación · **reside en el `domain/` del Lead Analyzer**, no en el comercial |
| **Diagnóstico** | APS-19 §5-§6 — las siete variables y el Modelo de Consciencia |
| **Estrategia** | APS-18 §5, §8 — objetivo, barrera, evidencia, emoción, hilo |
| **Validaciones** | ADR-15 §10.3 — el **punto de control** de todo texto |
| **Estados permitidos** | PO-02 §5.1 — `Lead · Analyzed · Scored · Contacted` |
| **Condiciones de transición** | PO-02 §5 — **solo una declaración de contacto produce `Contacted`** |

### `infrastructure/` expresa

| Materia | Dónde |
| --- | --- |
| **Llamadas externas** | `modules/*/infrastructure/` |
| **Persistencia** | `shared/persistence/adapters/` — **único lugar con driver de BD** *(R-25)* |
| **APIs** *(consumo)* | `modules/*/infrastructure/` |
| **Proveedores de IA** | `shared/ai/` + adapter del módulo — **accesible solo desde `infrastructure/`** *(ADR-04 §11)* |
| **Envío de datos** | **No existe en la V1** — §5, `messaging/` |

### Regla obligatoria

> **`infrastructure/` nunca decide una regla comercial.**
>
> Puede fallar, puede tardar, puede devolver algo inesperado. **No puede cambiar qué persigue un contacto, qué evidencia es afirmable, qué barrera se ataca ni si un `Lead` cambia de estado.**

**Corolario de dos sentidos.** Si una regla comercial acaba en `infrastructure/`, el diseño está mal. **Y si un detalle técnico —un límite de proveedor, un formato, un tiempo de espera— acaba en `domain/`, también** *(APS-17 G-3 · ADR-11 §8.1)*. **La frontera se cruza en ambas direcciones y ambas son defectos.**

## 2.1 Contiene

| Elemento | Ejemplo en el dominio comercial |
| --- | --- |
| **Entidades** | `BuyerDiagnosis` · `CommercialSequence` · `Proposal` · `ContactEvent` *(ADR-16 §4)* |
| **Reglas comerciales** | Los ocho principios de APS-18 §4 · la escalera de micro-yes · las cinco barreras |
| **Políticas** | Regla de Evidencia · Progressive Relevance · precedencia de la manifestación |
| **Servicios de dominio** | Cálculo del diagnóstico · decisión de estrategia · **punto de control** |
| **Value objects** | Clase de conocimiento · barrera · canal *(como restricción, no como valor)* |
| **Decisiones** | Qué objetivo persigue un contacto · qué evidencia es afirmable · si una declaración produce transición |

## 2.2 No contiene

| Prohibido | Por qué |
| --- | --- |
| **Llamadas a API** | ADR-15 D-1 · R-04 |
| **Bases de datos** | **R-21** — `domain/` no importa **nada** de `shared/persistence/` |
| **Interfaz de usuario** | R-04 · R-48 |
| **SDK externos** | **R-06** · R-04 |
| **Prompts** | ADR-15 §8 — un prompt es expresión, no decisión |
| **Formatos de transporte** | **R-15 · R-18** — los DTO son de `shared/contracts/` |
| **Observabilidad** | **O-4** |
| **Parámetros configurables** | **APS-17 G-3 · ADR-11 §8.1** — sin excepción |

## 2.3 La distinción que más se confunde

**La regla de canal es dominio; el valor numérico no.**

| Qué | Dónde | Origen |
| --- | --- | --- |
| *«Una nota de conexión transporta exactamente un hecho observado»* | **`domain/`** | Regla comercial — APS-20 §6.2 |
| *«El límite del canal es N caracteres»* | **Infraestructura**, con el valor en APS-17 | Limitación impuesta por un tercero — R-50 · ADR-11 §8.1 |

Situar el número en `domain/` violaría APS-17 G-3. Situar la regla en `infrastructure/` violaría la Línea de Decisión. **El reparto es obligatorio en ambos sentidos** *(ADR-16 D-3)*.

---

# 3. Commercial Intelligence Boundary

Ubicación de las seis capacidades, con su trazabilidad completa.

| Capacidad | Dueño | Capa | Entidad *(ADR-16)* | Evento *(ADR-13)* | Decide |
| --- | --- | --- | --- | :-: | :-: |
| **Lead Diagnosis** | Sistema Comercial | **`domain/`** | `BuyerDiagnosis` | **E-7** | ✅ |
| **Opportunity Score** | **Lead Analyzer** | `domain/` *(otro módulo)* | — *(A-5)* | E-4 | ✅ |
| **Commercial Strategy** | Sistema Comercial | **`domain/`** | *(parte de `Proposal`)* | **E-5** | ✅ |
| **Sequence Design** | Sistema Comercial | **`domain/`** | `CommercialSequence` | **E-8** | ✅ |
| **Proposal Rules** | Sistema Comercial | **`domain/`** | `Proposal` | **E-5** | ✅ |
| **Contact Declaration** | **El usuario** | `domain/` decide el efecto | `ContactEvent` | **E-9** | ✅ |

**Cinco de las seis viven en `domain/` del sistema comercial.** La sexta —el Opportunity Score— **pertenece a otro agente**.

## 3.1 Consecuencia: el Orchestrator es obligatorio

**ADR-04 §7.6: ningún agente conoce ni invoca a otro.** El diagnóstico necesita la evidencia y el Score del **Lead Analyzer**, de modo que **un Orchestrator los reúne y se los entrega ya unidos** *(ADR-15 §12)*.

**`domain/` recibe la evidencia como entrada; nunca la busca.** Es lo que le permite ser puro.

## 3.2 Lo único que no decide

**La redacción del texto.** Es la preocupación 6 de ADR-15 §7.1, vive en `infrastructure/` y **recibe las decisiones ya tomadas** más la lista cerrada de hechos afirmables. **No puede añadir un solo hecho** *(ADR-15 §10.2)*.

---

# 4. Casos de uso — `application/`

Cuatro. **Todos coordinan; ninguno decide** *(ADR-16 D-2 · RA-6)*.

> **Los nombres canónicos los fija ADR-16 §7**, y son los que se usan aquí desde la v1.3. La v1.2 empleaba `GenerateCommercialDiagnosis`, `DesignCommercialSequence` y `RegisterContactDeclaration`: **tres nombres distintos para las mismas tres unidades**, contra ADS-00 *Terminología*. **Prevalece el ADR**; este documento es un mapa.
>
> **Su anatomía —firma, factory, contrato de resultado y puertos— la decide ADR-17 §5 a §8.**

## 4.1 `GenerateDiagnosis`

| | |
| --- | --- |
| **Entrada** | `Lead` · evidencia del análisis · Opportunity Score y su desglose — **todo recibido ya unido por el Orchestrator** |
| **Salida** | `BuyerDiagnosis` — siete variables con su clase, sus indicios y la confianza declarada |
| **Dependencias permitidas** | `domain/` del propio módulo · Repository Interface **recibida por inyección** |
| **Evento generado** | **E-7** — versiona **A-11** |

## 4.2 `CreateSequence`

| | |
| --- | --- |
| **Entrada** | `Lead` · `BuyerDiagnosis` vigente |
| **Salida** | `CommercialSequence` — plan de momentos y momento vigente |
| **Dependencias permitidas** | `domain/` del propio módulo · Repository Interface |
| **Evento generado** | **E-8** — actualiza **A-12** |

## 4.3 `GenerateProposal`

| | |
| --- | --- |
| **Entrada** | `Lead` · `BuyerDiagnosis` · `CommercialSequence` · momento a preparar |
| **Salida** | `Proposal` — estrategia, lista cerrada de hechos afirmables, texto y canal |
| **Dependencias permitidas** | `domain/` *(estrategia · lista cerrada · **punto de control**)* · **el puerto de redacción, declarado por `domain/`** *(ADR-17 §6.3 · AL-07, AL-19)* · Repository Interface |
| **Evento generado** | **E-5** — versiona **A-6**. **No toca el estadio** |

> **Es el único caso de uso que atraviesa la Línea de Decisión, y en un solo sentido:**
> `domain/` construye la lista cerrada → `infrastructure/` redacta con ella → `domain/` **verifica contra ella**.
> **Un texto que no supera el control se rehace; no se entrega con advertencia** *(ADR-15 §10.3)*.

## 4.4 `RegisterContact`

| | |
| --- | --- |
| **Entrada** | `Lead` · momento de la secuencia · **declaración del usuario** *(resultado y manifestación, si la hubo)* |
| **Salida** | `ContactEvent` · secuencia actualizada · diagnóstico versionado **si hubo manifestación** |
| **Dependencias permitidas** | `domain/` *(decide si hay transición y si hay manifestación)* · Repository Interfaces |
| **Evento generado** | **E-9** — actualiza **A-3, A-12, A-8**; versiona **A-11** condicionalmente |

> **Es el único caso de uso que puede llevar un `Lead` a `Contacted`** *(ADR-16 CE-I1)*. **No decide por su cuenta**: la regla «una declaración de contacto produce `Contacted`» es **regla comercial y vive en `domain/`**. El caso de uso solo la aplica.

---

# 5. `infrastructure/`

> **Implementa las decisiones del dominio. Nunca decide.**

| Adapter | Dónde reside | Qué implementa | **Nunca** |
| --- | --- | --- | --- |
| **`persistence/`** | **`shared/persistence/adapters/`** | Escritura y lectura de los activos de ADR-13. **Único lugar con driver de BD** *(R-25)* | Decide qué se escribe. Solo lo escribe |
| **`ai/`** | `modules/*/infrastructure/` + **`shared/ai/`** | La redacción generativa | Decide objetivo, barrera, evidencia ni estrategia |
| **`external/`** | `modules/*/infrastructure/` | Proveedores de descubrimiento y datos | Propaga capacidades del proveedor al dominio *(ADR-11 §9 E-6)* |
| **`messaging/`** | **No existe en la V1** | — | **Nada: AKVEZ no envía** *(PO-02 §2 · APS-09 Nivel 2)* |

> **`messaging/` se declara vacía deliberadamente.** El envío es Nivel 3 y está fuera de la V1. Crear la carpeta invitaría a llenarla, y **RI-7** de DEV-00 advierte de exactamente eso: una necesidad sin carpeta es un vacío, no una licencia. **Cuando el envío se autorice, requerirá decisión de producto previa.**

**`shared/persistence/adapters/` solo puede construirse desde `bootstrap/`** *(R-54)*. Sustituir el motor es un cambio de una línea en el Composition Root *(ADR-09 §6)*.

---

# 6. Regla de dependencia

## 6.0 Arquitectura oficial — Opción B, **en vigor**

> ## ✅ **Dependencia hexagonal estricta. Arquitectura oficial de AKVEZ desde el 2026-07-30.**
>
> **`application/` depende únicamente de puertos. Ningún caso de uso importa un adapter concreto.**
>
> **El nombre de la capa es `presentation/`.**
>
> **Norma que lo hace exigible: ADR-17 §12, reglas AL-19 y AL-20** *(`Approved`)*. **Este documento la localiza; no la decide.**

### Por qué B, y por qué su coste es menor de lo que aparenta

**AKVEZ ya aplica la Opción B a la persistencia.** Las Repository Interfaces se reciben por inyección *(R-22, R-56)* y **ningún caso de uso importa un adapter de base de datos** *(R-54)*. La permisividad de DEV-00 §4.1 solo se ejerce hoy en **tres adapters de proveedor**: descubrimiento en el Lead Hunter, y el proveedor generativo en el Lead Analyzer y en el Pitch Generator.

**La decisión no cambia una arquitectura: elimina una excepción.** El repositorio ya es hexagonal en su frontera más crítica; la de proveedores quedó fuera por razones históricas, no por decisión.

**Tres motivos que la inclinan:**

1. **La Línea de Decisión lo exige de hecho.** El riesgo mayor de ADR-15 y ADR-16 es que el criterio se filtre a `infrastructure/` o que la lista cerrada de hechos afirmables se amplíe allí. **Un puerto convierte ese contrato en algo explícito y revisable**; un import directo lo deja al criterio del revisor.
2. **El motor comercial debe poder verificarse sin invocar un modelo.** ADR-16 define 15 criterios de aceptación; **varios son incomprobables si `GenerateProposal` depende de un adapter concreto**.
3. **El coste ya está parcialmente comprometido.** ADR-15 §9.5 obliga a reconstruir el módulo comercial desde el Composition Root **antes de cualquier otra cosa**; introducir su puerto en ese mismo movimiento no añade trabajo apreciable.

### Por qué se conserva `presentation/`

**El nombre y la estrictez son decisiones independientes**, y el enunciado las agrupaba. Se puede adoptar la dependencia hexagonal conservando la nomenclatura de ADR-01 §8, y es lo que se hace: **renombrar la capa exigiría revisar ADR-01 y ADR-04**, que son `Approved`, sin ganancia arquitectónica alguna. Es materia de un acto de *naming* propio — §8.1.

### Documentos afectados

> **Corrección de la v1.2.** La tabla original situaba el «único cambio normativo real» en **DEV-00 §4.1**. **Es incorrecto y hay que decirlo con precisión, porque de ello depende que la decisión llegue a ser exigible.**
>
> **DEV-00 no puede retirar esa autorización**, porque no la concede: la concede **ADR-07 §8**, un ADR `Approved`. Una regla DEV que contradiga su fuente es **nula** por **R-7** de ADS-00, y corregirla en DEV-00 sería un defecto, no una sincronización. **El cambio normativo real es un ADR**, y la tabla omitía además **ADR-09 §8**, sin cuya extensión la Opción B es sencillamente inejecutable.

| Documento | Qué exigía | Estado |
| --- | --- | :-: |
| **ADR-17 §12** | **Decidir** la retirada. **Vehículo normativo de la Opción B**, y el único acto capaz de restringir la facultad que ADR-07 §8 concedía | ✅ **Ejecutado** — ADR-17 v1.1 `Approved`, AL-19 |
| **ADR-17 §9.1** | **Extender la tabla de ADR-09 §8**: `bootstrap/` debe poder importar `modules/*/infrastructure/` para construir el adapter de proveedor y vincularlo a su puerto | ✅ **Ejecutado** — AL-20. Nota de alcance en **ADR-09 v1.3 §8.1** |
| **DEV-00 §3.1 (R-05) y §4.1** | Sincronizar **después** de ratificarse ADR-17, nunca antes | ✅ **Ejecutado** — **DEV-00 v1.4** |
| **ADR-15 §9.2** | `application/` no importa adapters concretos | ✅ **Fundado** — ADR-15 v1.2 §21.5 |
| **ADR-16 §2, §7** | La dependencia de `GenerateProposal` es un **puerto de redacción**, no el adapter | ✅ **Fundado** — ADR-16 v1.1 §13.2 |

**Ninguno se modificó desde este documento.** ARCH-01 registró la decisión; **su descenso normativo fue ADR-17**, y está completo.

### Impacto futuro

**Coste inmediato:** un puerto por proveedor —tres— y su construcción en el Composition Root. **Nada más.**

**Beneficio permanente:** sustituir un proveedor deja de tocar `application/`; el módulo comercial se verifica sin invocar ningún modelo; y **la Línea de Decisión pasa de ser una regla de revisión a ser una propiedad del grafo de dependencias**.

**Riesgo asumido:** más indirección. Se acepta porque el número de proveedores es pequeño y estable, y porque el precedente de la persistencia demuestra que en este repositorio el patrón no degrada la legibilidad.

## 6.1 El diagrama oficial

```
        presentation/
                │
                ▼
          application/  ──────► «puertos»
                │                    ├── de proveedor    → los declara domain/
                │                    └── de persistencia → shared/persistence/repositories/
                ▼                        ▲
            domain/   ◄──────────────────┘ implementa: infrastructure/  (proveedor)
                                            shared/persistence/adapters/ (persistencia)
```

**Las flechas indican «depende de».** `domain/` **no apunta a nada**: es el único componente sin dependencias salientes, y esa es la propiedad que lo hace puro y reproducible.

**`application/` no apunta a `infrastructure/`.** Apunta a un puerto que `infrastructure/` implementa. **El Composition Root los une** *(ADR-09 §5.1)*.

> **Los puertos no viven todos en el mismo sitio, y la v1.1 lo daba por supuesto.** El **puerto de proveedor** lo declara el `domain/` del módulo consumidor; el **puerto de persistencia** es la Repository Interface y vive en **`shared/persistence/repositories/`**, donde **ADR-08 §6** la sitúa. La tipología completa está en **ADR-17 §6.2**.

| Regla | Enunciado | Origen |
| --- | --- | --- |
| **DR-1** | **`domain/` no depende de nada externo a su módulo.** Ni infraestructura, ni persistencia, ni HTTP, ni SDK, ni observabilidad | **R-04 · R-21 · O-4** |
| **DR-2** | **`infrastructure/` depende de `domain/`**, nunca al revés | ADR-15 §8 |
| **DR-3** | **`application/` depende de `domain/` y de puertos.** **No importa ningún adapter concreto** — ni de persistencia ni de proveedor | **ADR-17 §12 (AL-19)** · R-22 · R-56 · **DEV-00 v1.4 R-05**. ✅ **Vigente en sus dos mitades** |
| **DR-4** | **`presentation/` depende solo del tipo del caso de uso** que expone `application/` | R-07 · R-23 |
| **DR-5** | **Ninguna dependencia cruza entre módulos.** La comunicación pasa por el Orchestrator | ADR-04 §7.6 · R-02 |
| **DR-6** | **Un puerto se declara fuera de quien lo implementa, y ninguna capa intermedia lo define.** El **puerto de proveedor** lo declara el `domain/` del módulo consumidor y lo implementa `modules/*/infrastructure/`. El **puerto de persistencia** es la Repository Interface, vive en **`shared/persistence/repositories/`** y lo implementa `shared/persistence/adapters/` | **ADR-08 §6, §10** *(persistencia)* · **ADR-17 §6.2, §6.3** *(proveedor)* |

> ## Corrección de DR-6 — v1.2
>
> **La redacción de la v1.1 —«todo puerto lo declara `domain/`»— es falsa para el puerto de persistencia y no debe citarse.**
>
> **ADR-08 §6** sitúa la Repository Interface en `shared/persistence/repositories/` y la expresa en términos de un **Persistence Contract**, declarado con independencia de la entidad de dominio *(ADR-08 §5)*. **ADR-08 §10 prohíbe expresamente** que esa carpeta importe `modules/*/domain/`. Aplicar DR-6 literalmente obligaría a trasladar las Repository Interfaces al dominio de cada módulo y a enmendar **§5, §6 y §10 de un ADR `Approved`**.
>
> **La asimetría no es un defecto: es la consecuencia de que la persistencia es transversal a los módulos y el proveedor no.** Un `LeadRepository` sirve a más de un módulo; un puerto de redacción sirve solo al suyo. *(ADR-17 §6.2)*

## 6.2 Qué impide esta dirección

| Se impide | Cómo |
| --- | --- |
| **Que `domain/` conozca infraestructura** | DR-1. Sin dependencias salientes, no hay por dónde |
| **Que una regla comercial acabe en un servicio externo** | DR-2 — la dependencia va en sentido contrario |
| **Que un prompt defina lógica comercial** | El prompt vive en `infrastructure/`, que **recibe** decisiones y no las produce. El **punto de control** en `domain/` verifica el resultado |

---

# 7. Validaciones obligatorias

## V-ARCH-01 — «¿Dónde pongo una regla que decide si un Lead debe recibir contacto?»

> **En `domain/`.** Sin excepción.

Es una **regla comercial**: decide. Y es una regla concreta con una restricción propia — **puede recomendar detener una secuencia, nunca excluir un Lead** *(APS-18 §7.5 · ADR-16 RC-12)*. Un umbral de exclusión está prohibido por PO-01 §7.

**✅ La respuesta no depende de infraestructura.**

## V-ARCH-02 — «¿Dónde guardo el resultado generado por una IA?»

> **Lo produce `infrastructure/`. Lo coordina `application/`. Lo persiste `shared/persistence/adapters/`. Y nunca es una regla.**

| Fase | Dónde |
| --- | --- |
| Producción del texto | `infrastructure/` |
| **Verificación de admisibilidad** | **`domain/`** — punto de control |
| Coordinación y entrega para persistir | `application/` |
| Escritura | `shared/persistence/adapters/` — evento **E-5** |

**Un resultado de IA nunca se convierte en regla.** Puede rechazarse en el punto de control, pero **no puede modificar una decisión** *(ADR-15 RA-5)*.

**✅ La respuesta no depende de infraestructura para decidir nada.**

## V-ARCH-03 — «¿Dónde vive el texto final de una propuesta?»

> **La `Proposal` es una entidad de dominio que contiene estrategia, evidencia y texto. El texto se produce en `infrastructure/`, se admite o se rechaza en `domain/`, y se representa en persistencia.**

**Una precisión necesaria.** El enunciado del sprint decía *«resultado generado por dominio»*. **`domain/` no genera texto**: eso contradiría ADR-15 §10.1 —el modelo redacta—. Lo exacto es:

| | Quién |
| --- | --- |
| **Decide qué debe decir** | `domain/` — estrategia y lista cerrada |
| **Produce el texto** | `infrastructure/` |
| **Decide si es admisible** | **`domain/`** — punto de control |
| **Lo conserva** | `shared/persistence/adapters/` — A-6, versionado |

**El texto se produce fuera del dominio, pero no se decide fuera del dominio.** Esa distinción es toda la arquitectura comercial en una frase.

**✅ La respuesta no depende de infraestructura para decidir nada.**

---

# 8. Divergencias registradas

## 8.1 `interfaces/` frente a `presentation/` — ✅ **cerrada: `presentation/`**

> **El nombre oficial de la capa es `presentation/`. No hay divergencia abierta.**

El sprint de origen nombraba `interfaces/`; **ADR-01 §8 y ADR-04 §8 nombran `presentation/`**, y ambos son `Approved`. **Es la misma capa con la misma responsabilidad.**

**Se cierra adoptando el nombre canónico, no proponiendo su cambio.** Renombrar exigiría revisar dos ADR `Approved` **sin ganancia arquitectónica alguna** *(§6.0)*, y ARCH-01 no puede renombrar una capa *(R-2)*. **DEV-00 §4.1 ya resolvió un caso idéntico** —la carpeta `app/`, rechazada y anotada como vacío **V-5**—.

**Si en el futuro se quisiera renombrar, sería materia de un acto de *naming* propio**, como el de «Pitch Generator» *(PO-02 §1)*. **No es una decisión pendiente de este documento ni del Architecture Freeze.**

## 8.2 Dependencia estricta — ✅ **cerrada: descenso normativo ejecutado**

> **La Opción B es arquitectura oficial y es exigible. No queda nada pendiente.**

| | |
| --- | --- |
| **Qué está decidido** | La Opción B: `application/` depende únicamente de puertos *(§6.0)* |
| **Qué lo hace exigible** | **ADR-17 §12 — AL-19 y AL-20**, `Approved` desde el 2026-07-30 |
| **Qué rige en DEV** | **DEV-00 v1.4 R-05 y §4.1**, sincronizados **después** de la ratificación |
| **Cómo quedó ADR-07 §8** | **Con su texto íntegro.** Una decisión posterior de su mismo rango retiró una de las facultades que concedía. **No fue reinterpretado** *(ADR-17 §12.2)* |
| **Cómo quedó ADR-09 §8** | **Con su tabla intacta**, extendida con una fila por ADR-17 §9.1. Nota de alcance en **ADR-09 v1.3 §8.1** |

> **La v1.1 atribuía la discrepancia a DEV-00, y era un error de diagnóstico que conviene conservar como lección.** DEV-00 no autorizaba el import: lo **transcribía** de ADR-07 §8, citándolo. Un documento de orden 8 no puede retirar una facultad concedida por uno de orden 4 — **R-7 de ADS-00 declara nula la regla DEV que no derive de su fuente**. Corregir DEV-00 antes de ADR-17 no habría sincronizado nada: habría introducido un defecto en el documento equivocado, y habría sido exactamente el riesgo **RC-2** de AR-05.
>
> **El orden correcto se siguió:** decidió el ADR, y DEV-00 transcribió después.

**La implementación de casos de uso queda habilitada.** El patrón que fijará el primero es el de **ADR-17 §5 a §9**, y ya es norma.

## 8.3 El eje de módulo se conserva

La estructura del sprint enumeraba las cinco carpetas en la raíz de `src/`. **Se adoptan íntegras, dentro del eje de módulo** que ADR-01 §10.1, ADR-04 §8, DEV-00 §4 y ADR-15 RA-13 exigen. **Ninguna capacidad se pierde** — §1.1 muestra la correspondencia.

**`src/` es el frontend; el backend es `server/`.** Es la separación vigente en DEV-00 §4.2 y §4.3.

---

# 9. Definition of Done

| # | Criterio | Estado | Dónde |
| :-: | --- | :-: | --- |
| 1 | Existe estructura modular definida | ✅ | §1.1 |
| 2 | Las responsabilidades están separadas | ✅ | §1.2 |
| 3 | `domain/` no depende de infraestructura | ✅ | §2.2 · DR-1 |
| 4 | Commercial Intelligence tiene frontera clara | ✅ | §3 |
| 5 | Los casos de uso tienen ubicación definida | ✅ | §4 |
| 6 | Un desarrollador nuevo ubica cualquier pieza sin preguntar | ✅ | §7 — las tres validaciones |
| 7 | No existen decisiones comerciales fuera de `domain/` | ✅ | §3 — cinco de seis en `domain/`; la sexta es de otro agente |

| 8 | **No remite a ninguna decisión abierta** | ✅ | §8.1 y §8.2, ambas cerradas |

> ## ✅ Los ocho criterios se cumplen. ARCH-01 queda `Approved` como **Mapa oficial de arquitectura**.
>
> **Las dos divergencias que la v1.1 dejaba abiertas están cerradas:**
>
> | Asunto | Cómo se cerró |
> | --- | --- |
> | **El nombre de la capa** *(§8.1)* | **Adoptando el canónico, `presentation/`**, que es el de ADR-01 §8 y ADR-04 §8. No era una decisión de arquitectura, sino una nomenclatura que este mapa no podía cambiar |
> | **La estrictez de la dependencia** *(§6.0, §8.2)* | **Por descenso normativo a ADR-17 §12**, `Approved`, y su transcripción en DEV-00 v1.4 |
>
> **Historia de la corrección, conservada como lección de gobernanza.** La v1.1 marcaba §8.2 como «resuelta» en su encabezado y la enumeraba a la vez entre las divergencias abiertas — **dos afirmaciones que no podían ser ciertas simultáneamente**. La v1.2 deshizo la ambigüedad distinguiendo *decisión* de *norma*; **la v1.3 la cierra porque la norma ya existe.**

---

# 10. Dependencias y referencias

**Decide sobre esta materia:** ADR-01 v1.0 §8, §10 · ADR-04 v1.3 §7.6, §8, §10, §11 · ADR-07 v1.1 §7, §8 · **ADR-08 v1.2 §5, §6, §10** · **ADR-09 v1.3 §5, §6, §8, §8.1** · ADR-11 v2.1 §8.1, §9 · **ADR-13 v1.2** §6.2, §13.1 · **ADR-15 v1.2** §7, §8, §9, §10, §12 · **ADR-16 v1.1** §3, §4, §6, §7, §8 · **ADR-17 v1.1** §5, §6, §9.1, §12, §14 · **DEV-00 v1.4** §3.1, §4.

**Autoridad de dominio:** PO-01 v1.2 · PO-02 v1.3 · APS-03 v3.1 · APS-07 v2.1 · APS-08 v1.2 · APS-09 · APS-17 v1.1 · APS-18 v1.2 · APS-19 v1.1 · APS-20 v1.1. **Todos `Approved`.**

**Condiciona a:** la implementación del *Commercial Diagnosis Engine* y de todo caso de uso posterior.

**Depende de, para que su §6.0 sea exigible:** **ADR-17 — Application Layer Architecture** *(`Approved`)*. **La relación se invirtió en la v1.2 y se confirma aquí:** ARCH-01 no condiciona a ADR-17 — **es ADR-17 quien da fuerza normativa a la decisión que ARCH-01 §6.0 registró.**
