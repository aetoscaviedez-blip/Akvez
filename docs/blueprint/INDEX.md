# AKVEZ Blueprint — Índice Oficial

> **Este documento es la puerta de entrada al Blueprint de AKVEZ.**
>
> Si buscas una decisión concreta y sabes de qué trata, ve directamente a **[ADS-01 — Implementation Contracts](./ADS/ADS-01%20—%20Implementation%20Contracts.md)**: es el mapa tema → documento.
>
> Si no sabes por dónde empezar, ve a **§8 — Orden recomendado de lectura**.

| Campo | Valor |
| --- | --- |
| Última actualización | **2026-08-04** |
| Documentos catalogados | **69** *(más este índice y el README)* |
| Vigentes | **63** — **52** `Approved` · **11** `Draft` · **0** `Review` |
| Archivados | **6** |
| Estados inválidos | **0** |
| Estándar aplicado | **ADS-00 v1.3** — 10 categorías documentales |
| Autoridad de dominio | **PO-01 v1.2** (Approved) · **PO-02 v1.3** (Approved) — *sistema comercial* |
| Certificación vigente | **AR-03 v1.2** — Blueprint v3.0, *Implementation Ready* (`Approved`) |
| Estado de la arquitectura | ✅ **Architecture Approved** — Sprint *Gobernanza Final*, 2026-07-30 |

> ## ✅ Architecture Freeze — la arquitectura comercial queda cerrada
>
> **Sincronización del 2026-07-30, posterior al sprint *Gobernanza Final (Architecture Freeze)*.** **Ocho documentos pasaron a `Approved`** en orden de dependencia estricto, sin que ninguno se aprobase antes que aquel del que deriva:
>
> **PO-02 → APS-18 → APS-19 → APS-20 → ADR-15 → ADR-16 → ADR-17 → ARCH-01**
>
> | Decisión | Dónde adquiere fuerza normativa |
> | --- | --- |
> | **Los cuatro estados oficiales del Lead** — `Lead · Analyzed · Scored · Contacted` | **PO-02 v1.3 §5.1** *(LS-1 a LS-5)*. **Cierra A-01** |
> | **Dependencia hexagonal estricta** — `application/` no importa `infrastructure/` | **ADR-17 v1.1 §12** *(AL-19, AL-20)* + **DEV-00 v1.4 §3.1 (R-05) y §3.13** |
> | **Anatomía del caso de uso, puertos y contratos** | **ADR-17 v1.1 §5 a §9** + **DEV-00 v1.4 §3.13** *(R-65 a R-69)* |
> | **Línea de Decisión y dominio comercial** | **ADR-15 v1.2 §8** · **ADR-16 v1.1 §3 a §8** |
>
> **Se catalogan once documentos que faltaban** —PO-02, APS-18, APS-19, APS-20, ADR-15, ADR-16, ADR-17, ARCH-01, DEV-03, DEV-04 y DEV-05— y se corrigen **siete versiones desincronizadas**. **DEV-00 contiene ahora 85 reglas** —R-01 a R-69, O-1 a O-6 y UI-1 a UI-10—.
>
> **Desviaciones: A-01, A-02 y T-14 pasan a `Closed`; A-03 queda `Partially Resolved`** *(AR-05 v1.2 §5.1)*. **Es la única que sigue abierta**, y su cierre llega con el motor real de ADS-02.
>
> ⚠️ **La advertencia RC-2 sigue vigente y este sprint la refuerza.** Un `Draft` `Approved` no es lo mismo que una norma exigible: **cinco documentos se emitieron citando a PO-02 mientras PO-02 estaba en `Draft`** — hallazgo **H-24**, registrado en PO-02 §12.4. **Cítese siempre el documento vinculante.**

> ## ✅ Blueprint v3.0 — ratificado y congelado documentalmente
>
> **Sincronización del 2026-07-29 (posterior a GOV-01).** Los siete documentos que estaban pendientes de ratificación —**ADR-10A, ADR-11, ADR-12, ADR-13, ADR-14, ADS-02 y APS-17**— pasaron a `Approved`. Se incorpora al catálogo **AR-04 — Informe GOV-01** y **AR-03** pasa a `Approved` con su condición suspensiva levantada.
>
> **No queda ninguna decisión arquitectónica pendiente de ratificación.** Ningún documento vigente está en `Review`.
>
> **Única excepción, expresa y documentada:** **AF-01** (v0.1) y **AF-02** (v1.0) permanecen en `Draft` en el nivel constitucional, por requerir revisión de contenido y no mera ratificación formal. Se cerrarán en un sprint de Gobernanza Constitucional propio. Véase **AR-04 §5**.
>
> **A partir de aquí, todo cambio arquitectónico sigue el proceso normal de gobernanza** — ADR nuevo o revisión mayor conforme a APS-13 §9. Véase **AR-03 §7.2**.

> ## ✅ Consolidación GOV-04 — las decisiones de GOV-03 ya son exigibles
>
> *(Registro histórico. Las versiones citadas son las de aquella fecha; las vigentes están en §4.)*
>
> **Sincronización del 2026-07-29 (posterior a GOV-04).** Las tres decisiones ratificadas en GOV-03 han **descendido a documentos vinculantes**, que es lo que las hace obligatorias:
>
> | Decisión | Dónde adquiere fuerza normativa |
> | --- | --- |
> | **Observabilidad única** — no se crea `shared/logging/` | **ADR-04 v1.3 §11** + **DEV-00 v1.2 §3.11** *(O-1 a O-6)* |
> | **Sin `Result<T>` común** — regla de propagación de errores | **DEV-00 v1.2 §3.12** *(R-61 a R-64)* |
> | **`strict: true`** | **`tsconfig.json`** *(DEV-02.2)* + **DEV-00 v1.2 §6.1** *(`DoD-2`)* |
>
> **La desviación A-04 queda `Closed`** y el riesgo **RC-3 cerrado** *(AR-05 §5.1, §8.1)*. ~~Quedan cuatro desviaciones abiertas: A-01, A-02, A-03 y T-14.~~ — **Superado el 2026-07-30: queda A-03.** Véase el banner superior y **AR-05 v1.2 §5.1**.
>
> ~~**DEV-00 contiene ahora 80 reglas**~~ — **85 desde la v1.4**, R-01 a R-69. El vacío **V-3** está cerrado y **V-7 fue eliminado**.
>
> ⚠️ **Advertencia permanente (AR-05 §8, RC-2).** Un **DP** `Approved` acredita que la decisión **está tomada**, no que sea exigible. **Nunca se cita un DP como fundamento de una regla:** se cita el ADR, APS o configuración que la formaliza. Véase **AR-05 §4**.

---

# Tabla de Contenido

1. Propósito del Blueprint
2. Jerarquía Documental
3. Estructura de Carpetas
4. Índice Completo de Documentos
5. Documentos Vigentes por Materia
6. Documentos Archivados y Sustituidos
7. Relaciones de Dependencia
8. Orden Recomendado de Lectura
9. Cómo Buscar una Decisión

---

# 1. Propósito del Blueprint

El **AKVEZ Blueprint** es la *Single Source of Truth* del proyecto. Contiene la visión, el alcance, el dominio, la arquitectura y las decisiones técnicas de AKVEZ.

**Regla fundamental.** Si existe un conflicto entre el código y el Blueprint, **prevalece el Blueprint**. Quien detecte la discrepancia debe detenerse y reportarla, nunca resolverla por su cuenta.

El Blueprint no documenta la versión actual del producto: **preserva el conocimiento de la organización** para que las decisiones importantes sigan siendo comprensibles con el tiempo.

---

# 2. Jerarquía Documental

Declarada en **ADS-00 v1.2** (*Jerarquía Documental y Regla de Precedencia*). En caso de conflicto entre dos documentos, **prevalece el de menor número de orden**.

| Orden | Categoría | Naturaleza | Autoridad |
| --- | --- | --- | --- |
| **1** | **AF** — AKVEZ Foundation | Nivel constitucional | **Máxima.** Ninguna decisión puede contradecirla |
| **2** | **PO** — Product Decision | Decide el dominio funcional | Máxima sobre el dominio |
| **3** | **APS** — Product Specification | Especifica el producto | Vinculante sobre arquitectura e implementación |
| **4** | **ADR** — Architecture Decision Record | Decide la arquitectura | Vinculante sobre la implementación |
| **5** | **DP** — Decision Paper | Deliberación previa | Consultiva |
| **6** | **REV** — Documento de Revisión | Inventario de evidencia | Consultiva |
| **7** | **AR** — Assessment Report | Evaluación de cierre | Consultiva |
| **8** | **DEV** — Development Standard | Operacionaliza decisiones ya aprobadas | **Vinculante sobre la implementación.** Subordinada a todas las anteriores y a ADS |

**Fuera de la cadena.** **ADS** regula la forma, no el contenido: se aplica a todas, **incluida DEV**. **PLAN** ordena la ejecución y no decide nada. **ARCH** no pertenece a la Clasificación Oficial, que es cerrada: **localiza la arquitectura, no la decide**, y ante discrepancia prevalece el ADR.

**DEV es derivada por definición** (R-7): sus reglas obligan a quien escribe código, pero ninguna puede existir sin proceder de un documento superior. **Nunca sustituye a un ADR, un APS ni un ADS.**

Las dos reglas más utilizadas: **R-2**, un documento inferior nunca reinterpreta a uno superior. **R-6**, un conflicto con AF no se resuelve por precedencia — obliga a detener y elevar al Product Office.

## 2.1 Estados documentales

Los cinco únicos admitidos por ADS-00:

| Estado | Significado |
| --- | --- |
| `Draft` | En construcción. **Nunca prevalece sobre un `Approved`** (R-4) |
| `Review` | Pendiente de revisión |
| `Approved` | Aprobado. Puede utilizarse oficialmente |
| `Deprecated` | Reemplazado. No debe utilizarse |
| `Archived` | Conservado únicamente con fines históricos |

---

# 3. Estructura de Carpetas

```
docs/blueprint/
├── AF/       Fundacionales — constitución, forma de trabajo, manifiesto (3)
├── ADS/      Estándares documentales y documentos de implementación (3)
├── PO/       Decisiones de producto sobre el dominio (2)
├── APS/      Especificación del producto (20 documentos)
├── ADR/      Decisiones de arquitectura (18 documentos)
├── ARCH/     Mapa de arquitectura física (1) — fuera de la Clasificación Oficial
├── PLAN/     Planes de consolidación (1)
├── DP/       Decision Papers — deliberaciones previas a decisión (4)
├── REV/      Revisiones documentales (3)
├── AR/       Assessment Reports y certificaciones (5)
├── DEV/      Estándares de desarrollo y registros de ejecución (8)
├── ATA-01 — Technical Audit Report.md
├── INDEX.md  Este documento
└── README.md
```

> **Sobre `ARCH/`.** **«ARCH» no pertenece a la Clasificación Oficial de ADS-00, que es cerrada.** ARCH-01 **no decide arquitectura: la localiza**, y ante discrepancia **prevalece el ADR**. Se cataloga aquí por ser un documento oficial del Blueprint, con el mismo criterio que **ADS-API-01** y **AR-04**.

> **Sobre `docs/architecture/`.** Existen **tres ficheros fuera de `docs/blueprint/`** que **no son autoridad vigente y no se catalogan**: `ADS-API-01` *(`Deprecated`, sustituido por ADR-06)*, `API-DTO-CATALOG` *(`Draft`, inventario de trabajo)* y `COM-02` *(`Draft`, origen funcional de APS-18; citado como documento de trabajo)*. **Ninguno debe utilizarse para diseñar arquitectura.**

---

# 4. Índice Completo de Documentos

**Propietario documental:** AKVEZ Product Office, salvo los ADR, cuyo responsable es el **AKVEZ Architecture Team**.

## 4.1 AF — Foundation *(orden 1)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| AF-00 | [AKVEZ Foundation — The Constitution](./AF/AF-00%20AKVEZ%20FOUNDATION.md) | 1.1 | `Approved` |
| AF-01 | [The AKVEZ Way](./AF/AF-01%20—%20The%20AKVEZ%20Way.md) | 0.1 | `Draft` |
| AF-02 | [The AKVEZ Product Manifesto](./AF/AF-02%20—%20The%20AKVEZ%20Product%20Manifesto.md) | 1.0 | `Draft` |

## 4.2 ADS — Documentation Standards

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| ADS-00 | [Documentation Standard](./ADS/ADS-00%20Documentation%20Standard.md) | 1.3 | `Approved` |
| ADS-01 | [Implementation Contracts](./ADS/ADS-01%20—%20Implementation%20Contracts.md) | **1.4** | `Approved` |
| **ADS-02** | [**Implementación del Motor de Persistencia**](./ADS/ADS-02%20—%20Persistence%20Engine%20Implementation.md) | **1.2** | ✅ `Approved` — **PostgreSQL sobre Supabase** |

> **Nota sobre ADS-02.** Es un documento de **implementación**, no de arquitectura: selecciona la tecnología que materializa ADR-13, ADR-05, ADR-08 y ADR-12, sin modificar ninguno. Ante discrepancia, **prevalece el ADR**.

## 4.3 PO — Product Decisions *(orden 2)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| **PO-01** | [**Definición Canónica de Lead**](./PO/PO-01%20—%20Product%20Decision%20-%20Canonical%20Definition%20of%20Lead.md) | **1.2** | ✅ `Approved` — **autoridad del dominio** |
| **PO-02** | [**Alcance del Sistema Comercial**](./PO/PO-02%20—%20Commercial%20System%20Scope.md) | **1.3** | ✅ `Approved` — **autoridad del sistema comercial** |

> **Nota sobre PO-02.** **Sustituye en autoridad a PO-01 §8**, exclusivamente en cuanto al evento que produce la transición a *Lead Contactado*: **la produce la declaración del usuario, nunca la emisión de una Propuesta**. El resto de PO-01 permanece íntegro. Su **§5.1 fija los cuatro estados oficiales del Lead** y **cierra la desviación A-01**. Es orden 2, y por eso pudo resolver el conflicto **Q-5** entre dos APS que ningún documento inferior podía dirimir.

## 4.4 APS — Product Specification *(orden 3)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| APS-01 | [Product Vision](./APS/APS-01%20—%20Product%20Vision.md) | 2.2 | `Approved` |
| APS-02 | [Product Scope](./APS/APS-02%20—%20Product%20Scope.md) | 2.1 | `Approved` |
| APS-03 | [Agent Architecture](./APS/APS-03%20—%20Agent%20Architecture.md) | **3.1** | `Approved` — **salida doble del agente comercial** |
| APS-04 | [Human Interface System](./APS/APS-04%20—%20Design%20System.md) | 4.0 | `Approved` |
| APS-05 | [Product Roadmap & Evolution Strategy](./APS/APS-05%20—%20Product%20Roadmap%20&%20Evolution%20Strategy.md) | 1.0 | `Approved` |
| APS-06 | [Success Metrics & Product Analytics](./APS/APS-06%20—%20Success%20Metrics%20&%20Product%20Analytics.md) | 1.0 | `Approved` |
| APS-07 | [Data & Knowledge Architecture](./APS/APS-07%20—%20Data%20&%20Knowledge%20Architecture.md) | **2.1** | `Approved` — **referencia del dominio** |
| APS-08 | [Opportunity Scoring Framework](./APS/APS-08%20—%20Opportunity%20Scoring%20Framework.md) | 1.2 | `Approved` — **contiene el Perfil WP-01** |
| APS-09 | [AI Decision Framework](./APS/APS-09%20—%20AI%20Decision%20Framework.md) | 1.0 | `Approved` |
| APS-10 | [Security, Privacy & Trust Framework](./APS/APS-10%20—%20Security,%20Privacy%20&%20Trust%20Framework.md) | 1.0 | `Approved` |
| APS-11 | [Integration Architecture & External Services](./APS/APS-11%20—%20Integration%20Architecture%20&%20External%20Services.md) | 1.0 | `Approved` |
| APS-12 | [Product Quality Assurance Framework](./APS/APS-12%20—%20Product%20Quality%20Assurance%20Framework.md) | 1.0 | `Approved` |
| APS-13 | [Product Governance Framework](./APS/APS-13%20—%20Product%20Governance%20Framework.md) | 1.0 | `Approved` |
| APS-14 | [Founder Validation Strategy](./APS/APS-14%20—%20Founder%20Validation%20Strategy.md) | 1.0 | `Approved` |
| APS-15 | [Go-To-Market Strategy](./APS/APS-15%20—%20Go-To-Market%20Strategy.md) | 1.0 | `Approved` |
| APS-16 | [Technical Architecture Blueprint](./APS/APS-16%20—%20Technical%20Architecture%20Blueprint.md) | 1.0 | `Approved` |
| **APS-17** | [**Parámetros Iniciales del Producto**](./APS/APS-17%20—%20Initial%20Product%20Parameters.md) | 1.1 | ✅ `Approved` — **21 parámetros vigentes** |
| **APS-18** | [**Commercial Strategy Framework**](./APS/APS-18%20—%20Commercial%20Strategy%20Framework.md) | **1.2** | ✅ `Approved` — **cómo vende AKVEZ** |
| **APS-19** | [**Buyer Diagnosis Model**](./APS/APS-19%20—%20Buyer%20Diagnosis%20Model.md) | **1.1** | ✅ `Approved` — **siete variables del diagnóstico** |
| **APS-20** | [**Outreach Channels & Constraints**](./APS/APS-20%20—%20Outreach%20Channels%20&%20Constraints.md) | **1.1** | ✅ `Approved` — **tres canales y sus restricciones** |

> **Nota sobre APS-18, APS-19 y APS-20.** Ratificados en el sprint *Gobernanza Final* (2026-07-30), pasos 2 a 4. Forman el **marco comercial** del que derivan ADR-15 y ADR-16. **APS-18 es el equivalente comercial de APS-08**: fija el criterio, no la implementación.
>
> ⚠️ **Dos acciones de producto quedan registradas, ninguna de arquitectura** *(APS-20 §12)*: **Q-3** — publicar `CH-01` a `CH-03` en **APS-17 §6**, sin lo cual **el criterio CC-02 no puede comprobarse**; y **Q-4** — incorporar contacto en frío y condiciones de uso de plataformas a **APS-10**, riesgo preexistente ya registrado como **RG-5** en APS-18 §14.

> **Nota sobre APS-17.** El sprint que lo originó proponía el código `APS-12`, ya asignado a *Product Quality Assurance Framework*. Se emplea **APS-17**, el siguiente disponible. Contiene **21 parámetros configurables**; ninguno reside en la capa de dominio.

> **Nota sobre APS-04.** El nombre del fichero conserva «Design System» por compatibilidad con enlaces existentes. Su título oficial desde la v4.0 es **Human Interface System**, y se organiza en dos partes: **A** — arquitectura de pantallas; **B** — design system.

## 4.5 ADR — Architecture Decision Records *(orden 4)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| ADR-01 | [Arquitectura Modular Orientada al Dominio](./ADR/ADR-01%20—%20Arquitectura%20Modular%20Orientada%20al%20Dominio.md) | 1.0 | `Approved` |
| ADR-02 | [Orquestación de Capacidades y Agentes](./ADR/ADR-02%20—%20Orquestación%20de%20Capacidades.md) | 1.1 | `Approved` |
| ADR-03 | [Integraciones Externas y Proveedores Tecnológicos](./ADR/ADR-03%20—%20Integraciones%20Externas%20y%20Proveedores%20Tecnológicos.md) | 1.0 | `Approved` |
| **ADR-04** | [**Backend Agent Architecture**](./ADR/ADR-04%20—%20Backend%20Agent%20Architecture.md) | 1.3 | ✅ `Approved` — **declara `shared/observability`** |
| ADR-05 | [Persistence Architecture & Data Layer](./ADR/ADR-05%20—%20Persistence%20Architecture%20&%20Data%20Layer.md) | 1.4 | `Approved` |
| ADR-06 | [Public API Contract Strategy](./ADR/ADR-06%20—%20Public%20API%20Contract%20Strategy.md) | 1.1 | `Approved` |
| ADR-07 | [Public Contract Boundary Consolidation](./ADR/ADR-07%20—%20Public%20Contract%20Boundary%20Consolidation.md) | 1.1 | `Approved` |
| ADR-08 | [Persistence Boundary & Repository Isolation](./ADR/ADR-08%20—%20Persistence%20Boundary%20&%20Repository%20Isolation.md) | 1.2 | `Approved` |
| ADR-09 | [Dependency Injection Strategy](./ADR/ADR-09%20—%20Dependency%20Injection%20Strategy.md) | **1.3** | `Approved` |
| ADR-10 | [Ubicación de la Persistencia en el Flujo de Adquisición](./ADR/ADR-10%20—%20Persistence%20Position%20in%20the%20Lead%20Acquisition%20Flow.md) | 1.2 | 📦 `Archived` |
| ADR-10A | [Definición Canónica de Empresa y Lead](./ADR/ADR-10A%20—%20Canonical%20Domain%20Definition%20of%20Empresa%20and%20Lead.md) | 2.1 | ✅ `Approved` |
| **ADR-11** | [**Frontera entre Dominio e Implementación**](./ADR/ADR-11%20—%20Domain%20and%20Implementation%20Boundary.md) | 2.1 | ✅ `Approved` |
| **ADR-12** | [**Identidad Canónica del Lead**](./ADR/ADR-12%20—%20Canonical%20Lead%20Identity.md) | 1.1 | ✅ `Approved` |
| **ADR-13** | [**Motor Canónico de Persistencia**](./ADR/ADR-13%20—%20Canonical%20Persistence%20Engine.md) | **1.3** | ✅ `Approved` — **nueve eventos: E-1 a E-9 · diez garantías: G-1 a G-10** |
| **ADR-14** | [**Gobernanza del Opportunity Score**](./ADR/ADR-14%20—%20Opportunity%20Score%20Governance.md) | 1.2 | ✅ `Approved` |
| **ADR-15** | [**Arquitectura del Sistema de Inteligencia Comercial**](./ADR/ADR-15%20—%20Commercial%20Intelligence%20Architecture.md) | **1.2** | ✅ `Approved` — **la Línea de Decisión** |
| **ADR-16** | [**Arquitectura del Dominio Comercial**](./ADR/ADR-16%20—%20Commercial%20Domain%20Model.md) | **1.1** | ✅ `Approved` — **cinco entidades, cuatro casos de uso** |
| **ADR-17** | [**Application Layer Architecture**](./ADR/ADR-17%20—%20Application%20Layer%20Architecture.md) | **1.1** | ✅ `Approved` — **20 reglas AL-01 a AL-20** |

> **ADR-10A, ADR-11, ADR-12, ADR-13 y ADR-14 fueron ratificados en el sprint GOV-01** (2026-07-29), sin modificación de contenido técnico. Constancia en **AR-04**.

> **Nota sobre ADR-15, ADR-16 y ADR-17.** Ratificados en el sprint *Gobernanza Final* (2026-07-30), pasos 5 a 7.
>
> **ADR-15** decide **dónde vive cada preocupación** del sistema comercial y establece la **Línea de Decisión**: *todo lo que decide vive en `domain/`; todo lo que expresa o comunica, en `infrastructure/`*. El **ADR de gobernanza del Perfil de Estrategia queda `Pospuesto`** con disparador expreso — se exige **antes de emitir la primera estrategia**, es decir antes de implementar `GenerateProposal` *(§7.4)*.
>
> **ADR-16** decide **sobre qué objetos opera**: cinco entidades, su correspondencia con los nueve eventos de ADR-13 §13.1 y los cuatro casos de uso —`GenerateDiagnosis`, `CreateSequence`, `GenerateProposal`, `RegisterContact`—, cuya **nomenclatura es la canónica**.
>
> **ADR-17** decide **cómo se implementa un caso de uso**: anatomía, puertos, contratos, factories, composición y manejo de errores. **Su §12 retira a `application/` la facultad de importar `infrastructure/` que ADR-07 §8 concedía** —una decisión posterior de su mismo rango, no una reinterpretación—, y **hace oficial la dependencia hexagonal estricta**. **ADR-07 §8 y ADR-09 §8 conservan su texto íntegro.**

> **Nota sobre ADR-04 v1.3.** Revisión **aditiva** de §11 ejecutada en el sprint **GOV-04**: incorpora el servicio compartido **`shared/observability`** con su contenido y su regla de acceso —**prohibida desde `domain/`**— y declara que **`shared/logging/` no se crea**, porque APS-16 §14 enumera el logging como una de las cinco salidas de la observabilidad y no como preocupación aparte. **Cambio Menor** (APS-13 §9): no altera ninguna decisión previa, ni §7, ni §8, ni las cinco filas preexistentes de §11. **Cierra la desviación A-04.**

## 4.6 ARCH — Mapa de arquitectura física *(fuera de la Clasificación Oficial)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| **ARCH-01** | [**Arquitectura del Sistema AKVEZ**](./ARCH/ARCH-01%20—%20System%20Architecture.md) | **1.3** | ✅ `Approved` — **Mapa oficial de arquitectura** |

> **«ARCH» no pertenece a la Clasificación Oficial de ADS-00, que es cerrada.** **ARCH-01 no decide arquitectura: la localiza.** Cada afirmación remite al ADR que la decidió, y **ante discrepancia prevalece el ADR**. Precedente: **ADS-API-01** y **AR-04**.
>
> **Responde a «¿dónde va cada pieza?»** — las cinco carpetas y su contenido admitido, la frontera de `domain/`, la ubicación de las seis capacidades comerciales, los cuatro casos de uso, los adapters y el diagrama oficial de dependencia. **Sus tres validaciones de §7** están pensadas para que un desarrollador nuevo ubique cualquier pieza sin preguntar.
>
> **Desde su v1.3 no contiene ninguna decisión abierta.**

## 4.7 DEV — Development Standards *(orden 8)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| **DEV-00** | [**Implementation Rules**](./DEV/DEV-00%20—%20Implementation%20Rules.md) | **1.4** | `Draft` — **85 reglas** |
| DEV-01 | [Hallazgos del Architecture Bootstrap](./DEV/DEV-01%20—%20Hallazgos%20del%20Architecture%20Bootstrap.md) | 1.0 | `Draft` |
| DEV-01A | [Informe de Auditoría Técnica](./DEV/DEV-01A%20—%20Informe%20de%20Auditoría%20Técnica.md) | 1.0 | `Draft` |
| DEV-01B | [Baseline corregido](./DEV/DEV-01B%20—%20Baseline%20corregido.md) | 1.0 | `Draft` |
| **DEV-02.2** | [**Implementación GOV-03**](./DEV/DEV-02.2%20—%20Implementación%20GOV-03.md) | 1.0 | `Draft` |
| **DEV-03** | [**MVP Flow**](./DEV/DEV-03%20—%20MVP%20Flow.md) | 1.0 | `Draft` |
| **DEV-04** | [**Lead Scoring Engine**](./DEV/DEV-04%20—%20Lead%20Scoring%20Engine.md) | 1.0 | `Draft` |
| **DEV-05** | [**Identidad, Registro Idempotente y Score Breakdown**](./DEV/DEV-05%20—%20Identidad,%20Registro%20Idempotente%20y%20Publicación%20del%20Score%20Breakdown.md) | 1.0 | `Draft` |

> **Categoría incorporada a ADS-00 en su v1.3** (sprint GOV-02). **DEV es derivada**: traduce decisiones ya aprobadas en reglas comprobables sobre el código y **nunca prevalece** sobre ninguna otra categoría (R-7).
>
> **DEV-00** contiene **80 reglas** de implementación —**R-01 a R-64**, **O-1 a O-6** y **UI-1 a UI-10**—, la estructura oficial del repositorio, las convenciones, la Definition of Done de desarrollo y el checklist de Pull Request. Cada regla cita el documento del que deriva.
>
> **DEV-01, DEV-01A, DEV-01B, DEV-02.2, DEV-03, DEV-04 y DEV-05** son registros de ejecución de los sprints homónimos: hallazgos que detuvieron el Architecture Bootstrap, auditoría técnica, corrección del baseline, activación de `strict`, flujo MVP completo, motor de Score y cierre de identidad y Registro idempotente. **No contienen reglas**; su valor es de trazabilidad.

> **Nota sobre DEV-00 v1.4.** Descenso normativo de **ADR-17**, ejecutado en el sprint *Gobernanza Final* **después** de su ratificación y no antes *(R-7 de ADS-00)*. **R-05 se sincroniza** —`application/` deja de importar `infrastructure/`— y se incorpora **§3.13** con **R-65 a R-69**, transcripción de las veinte reglas AL de ADR-17. **DEV-00 pasa de 80 a 85 reglas.** Se da de alta el vacío **V-8**: la capa `application/` del frontend no está gobernada, porque **ADR-17 §3.2 excluye `src/`**.
>
> **Versiones anteriores.** La **v1.2** incorporó §3.11 (O-1 a O-6), §3.12 (R-61 a R-64) y §6.1 (`DoD-2` con `strict`), cerrando **V-3** y eliminando **V-7**. La **v1.3** corrigió el flujo de §4.4, que omitía la capa `presentation/`.

> **Nota sobre DEV-02.2.** Registro de ejecución del sprint homónimo, que aplicó **DP-04**: `"strict": true` en `tsconfig.json`, con **cero errores** y artefactos de build de hash idéntico. Documenta además por qué **DP-03 no requería código alguno** —la decisión ratificada fue **no crear `Result<T>`**— y por qué **A-04 no podía cerrarse desde el código**, lo que motivó este sprint GOV-04.

## 4.8 DP — Decision Papers *(orden 5)*

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| DP-01 | [Ciclo de Vida Canónico de una Oportunidad](./DP/DP-01%20—%20Canonical%20Lifecycle%20of%20an%20Opportunity.md) | 1.1 | 📦 `Archived` |
| **DP-02** | [**DA-01 — Estrategia de Logging y Observabilidad**](./DP/DP-02%20—%20DA-01%20Estrategia%20de%20Logging%20y%20Observabilidad.md) | 1.1 | ✅ `Approved` |
| **DP-03** | [**DA-02 — Contrato de Resultado de la Capa Application**](./DP/DP-03%20—%20DA-02%20Contrato%20de%20Resultado%20de%20la%20Capa%20Application.md) | 1.1 | ✅ `Approved` |
| **DP-04** | [**DA-03 — Política de Strict Mode**](./DP/DP-04%20—%20DA-03%20Política%20de%20Strict%20Mode.md) | 1.1 | ✅ `Approved` |

> **Los tres DP vigentes fueron ratificados en el sprint GOV-03** (2026-07-29). Constancia en **AR-05**.
>
> **Autoridad consultiva** (ADS-00, orden 5). Una decisión ratificada en un DP **está tomada, pero no es exigible por sí misma**: su fuerza normativa nace del documento que la formaliza — un ADR, DEV-00 o la configuración del proyecto. Véase AR-05 §4.
>
> **Las tres decisiones ya descendieron** (sprint GOV-04): **DP-02 → ADR-04 §11 y DEV-00 §3.11** · **DP-03 → DEV-00 §3.12** · **DP-04 → `tsconfig.json` y DEV-00 §6.1**. **Cítese siempre el documento vinculante, nunca el DP.**

## 4.9 PLAN · REV · AR · ATA

| Código | Documento | Ver. | Estado |
| --- | --- | --- | --- |
| PLAN-01 | [Plan de Consolidación del Blueprint](./PLAN/PLAN-01%20—%20Blueprint%20Consolidation%20Plan.md) | 1.5 | `Draft` |
| REV-01 | [Revisión del Dominio Canónico: Empresa y Lead](./REV/REV-01%20—%20Canonical%20Domain%20Review%20of%20Empresa%20and%20Lead.md) | 1.1 | 📦 `Archived` |
| REV-02 | [Revisión Documental de Q-2](./REV/REV-02%20—%20Documentary%20Review%20of%20Q-2%20%28What%20Lead%20Hunter%20Stores%29.md) | 1.1 | 📦 `Archived` |
| REV-03 | [Residual Consistency Review](./REV/REV-03%20—%20Residual%20Consistency%20Review.md) | 1.0 | `Approved` |
| AR-01 | [Evaluación Arquitectónica Final del Dominio](./AR/AR-01%20—%20Final%20Architectural%20Assessment%20of%20the%20Empresa%20to%20Lead%20Domain.md) | 1.1 | 📦 `Archived` |
| AR-02 | [Blueprint Readiness Assessment](./AR/AR-02%20—%20Blueprint%20Readiness%20Assessment.md) | 1.0 | `Approved` |
| **AR-03** | [**Blueprint v3.0 — Implementation Ready**](./AR/AR-03%20—%20Blueprint%20v3.0%20Implementation%20Ready.md) | 1.2 | ✅ `Approved` — **certificación plenamente vigente** |
| **AR-04** | [**Informe GOV-01: Ratificación del Blueprint**](./AR/AR-04%20—%20GOV-01%20Blueprint%20Ratification%20Report.md) | 1.0 | ✅ `Approved` |
| **AR-05** | [**Informe de Cierre GOV-03**](./AR/AR-05%20—%20GOV-03%20Closure%20Report.md) | 1.1 | ✅ `Approved` — **A-04 `Closed`** |
| ATA-01 | [Technical Audit Report](./ATA-01%20—%20Technical%20Audit%20Report.md) | 1.1 | 📦 `Archived` |

> **Nota sobre AR-03.** Cierra la recomendación de AR-02 §9.4 y certifica dominio, arquitectura, consolidación documental y congelación del Blueprint. Su condición suspensiva fue **levantada el 2026-07-29** tras el sprint GOV-01 (§8.7). Como toda la categoría AR, su autoridad es **consultiva**: no decide nada.

> **Nota sobre AR-04.** Informe de ejecución del sprint **GOV-01**. Registra la ratificación de los siete documentos, la excepción del nivel constitucional, los tres pronunciamientos del Product Office y las obligaciones trasladadas a DEV-01. El código es `AR-04` y no `GOV-01` porque **GOV no pertenece a la Clasificación Oficial de ADS-00**, que es cerrada.

## 4.10 Otros

- [README — Documentación oficial del Blueprint](./README.md)

---

# 5. Documentos Vigentes por Materia

## 5.1 Dominio Empresa → Lead

| Materia | Documento vigente |
| --- | --- |
| **Empresa, Lead, Registro y Biblioteca de Leads** | **PO-01** §1-§4 · APS-07 §5, §8 |
| Ciclo de vida y sus reglas | PO-01 §8 · APS-07 §6, §7 |
| **Estados oficiales del Lead** — `Lead · Analyzed · Scored · Contacted` | **PO-02 §5.1** *(LS-1 a LS-5)* |
| **Cuándo un Lead está Contactado** | **PO-02 §5** — *lo declara el usuario, nunca la emisión de una Propuesta* |
| Identidad del Lead y deduplicación | **ADR-12** |
| Ausencia de Top N y de umbral | PO-01 §6, §7 · APS-08 §8.6 · ADR-11 §9 |

## 5.2 Producto

| Materia | Documento vigente |
| --- | --- |
| Visión y problema | APS-01 |
| Alcance de la V1, inclusiones y exclusiones | APS-02 |
| Agentes, responsabilidades y flujo canónico | APS-03 |
| Pantallas, navegación y design system | APS-04 |
| Roadmap · Métricas · IA · Seguridad · Integraciones · QA · Gobernanza | APS-05 · 06 · 09 · 10 · 11 · 12 · 13 |
| Opportunity Score — modelo, bandas, explicabilidad | APS-08 |
| **Perfil de Ponderación WP-01 — valores oficiales** | **APS-08 §7.1** |
| **Parámetros operativos iniciales del MVP** | **APS-17** |
| Validación y salida al mercado | APS-14 · APS-15 |
| **Alcance del Sistema Comercial en la V1** | **PO-02** §6 |
| **Cómo vende AKVEZ** — principios, estrategia, secuencia | **APS-18** |
| **Diagnóstico del comprador** — siete variables y Modelo de Consciencia | **APS-19** |
| **Canales de contacto y sus restricciones** | **APS-20** |

## 5.3 Arquitectura

| Materia | Documento vigente |
| --- | --- |
| Arquitectura modular por capas | ADR-01 |
| **Dónde va cada pieza** *(mapa físico)* | **ARCH-01** |
| Orquestación de capacidades | ADR-02 |
| Proveedores externos | ADR-03 · APS-11 |
| Agentes en el backend | ADR-04 |
| Persistencia — estructura · frontera · semántica | ADR-05 · ADR-08 · **ADR-13** |
| **Persistencia — motor y proveedor** *(implementación)* | **ADS-02** |
| Contratos públicos de API | ADR-06 · ADR-07 |
| Inyección de dependencias | ADR-09 |
| **Anatomía del caso de uso, puertos, contratos y factories** | **ADR-17** |
| **Dependencia de `application/` hacia `infrastructure/`** | **ADR-17 §12** *(AL-19, AL-20)* |
| Frontera dominio/implementación | **ADR-11** |
| **Línea de Decisión del sistema comercial** | **ADR-15 §8** |
| **Entidades, eventos y casos de uso comerciales** | **ADR-16** |
| Gobernanza del Opportunity Score | **ADR-14** |
| **Gobernanza del Perfil de Estrategia** | ⏸️ **`Pospuesto`** — ADR propio, exigible **antes de emitir la primera estrategia** *(ADR-15 §7.4)* |
| Arquitectura técnica general | APS-16 |

## 5.4 Implementación

| Materia | Documento vigente |
| --- | --- |
| **Reglas de implementación, convenciones y checklist de PR** | **DEV-00** — **85 reglas** |
| **Estructura oficial del repositorio** | **DEV-00 §4** *(deriva de ADR-01 §8 y ADR-04 §8, §11)* · **ARCH-01 §1** *(localización)* |
| **Cómo se escribe un caso de uso** | **ADR-17 §5 a §9** · **DEV-00 §3.13** *(R-65 a R-69)* |
| **Servicios compartidos del backend y sus reglas de acceso** | **ADR-04 §11** |
| **Observabilidad y logging** | **ADR-04 §11** · **DEV-00 §3.11** *(O-1 a O-6)* |
| **Propagación de errores** *(sin `Result<T>` común)* | **DEV-00 §3.12** *(R-61 a R-64)* · APS-03 §12 · **ADR-17 §10** |
| **Rigor del compilador** — `strict` | **`tsconfig.json`** · **DEV-00 §6.1** |
| **Definition of Done de desarrollo** | **DEV-00 §6** |
| **Verificaciones heredadas asignadas a DEV-01** | **DEV-00 §8** · AR-04 §10.1 |
| **Registros de ejecución de sprints de implementación** | DEV-01 · DEV-01A · DEV-01B · DEV-02.2 · **DEV-03** · **DEV-04** · **DEV-05** |

## 5.5 Estado del Blueprint

| Materia | Documento vigente |
| --- | --- |
| Evaluación de preparación y deuda documental | AR-02 |
| **Certificación v3.0 — congelación y procedimiento de excepción** | **AR-03** §7 |
| **Ratificación: qué se aprobó, qué no y por qué** | **AR-04** |
| **Obligaciones de verificación trasladadas a DEV-01** | **AR-04 §10.1** |
| **Cierre de GOV-03 y descenso normativo de los DP** | **AR-05** §4, §5 |
| **Desviaciones** — registro vivo. **Abierta: A-03** *(`Partially Resolved`)* | **AR-05 §5.1** |
| **Riesgos de gobernanza abiertos** | **AR-05 §8, §8.2** |
| Estado de ejecución de la consolidación | PLAN-01 §4.1 |
| Consistencia residual verificada | REV-03 |

---

# 6. Documentos Archivados y Sustituidos

> **Los seis documentos siguientes están en estado `Archived`. No son autoridad vigente y no deben utilizarse para diseñar arquitectura.**

## 6.1 Documentos de la investigación del dominio

Se conservan como registro del proceso que condujo a PO-01.

| Documento | Sustituido por | Qué conserva valor |
| --- | --- | --- |
| **ADR-10** | PO-01 §3, §4 | Planteamiento del problema (§4, §5), análisis de las cuatro alternativas (§8), matriz de impacto (§9) |
| **DP-01** | PO-01 §8 | Inventario de evidencia y clasificación por niveles de confianza |
| **REV-01** | PO-01 §1-§4 | Registro literal de lo que decía el Blueprint antes de la consolidación |
| **REV-02** | PO-01 §3, §4 | Demostración de que la contradicción era real. Su conclusión fue correcta en su fecha |
| **AR-01** | PO-01 §1-§8 · ADS-00 v1.2 | Refutaciones R-01 a R-08 e identificación del vacío V-5 |

## 6.2 Línea base técnica

| Documento | Naturaleza | Qué conserva valor |
| --- | --- | --- |
| **ATA-01** | Primera auditoría técnica. Fotografía del prototipo previa a la consolidación | Sus hallazgos sobre el **código**, que no ha sido modificado. **Deberán reverificarse al iniciar la Fase 5**, no darse por vigentes. Sus valoraciones sobre documentación y design system quedaron superadas |

## 6.3 Definiciones derogadas

**Ya no son válidas.** Solo aparecen en el Blueprint dentro de bloques explícitos de derogación:

| Definición derogada | Estaba en | Sustituida por |
| --- | --- | --- |
| «Lead: Empresas identificadas como oportunidades comerciales» | APS-07 §5 v1.0 | PO-01 §2 |
| «Lead: Empresa identificada como posible cliente» | APS-02 Glosario v2.0 | PO-01 §2 |
| «Biblioteca: empresas ya analizadas / ya procesadas» | APS-02 §6 · APS-03 Glosario · APS-07 Glosario | PO-01 §4 |
| «Lead Hunter: descubrir **y analizar** empresas» | APS-02 Glosario v2.0 | APS-03 §7.1 |
| «Una Empresa se convierte en Lead al alcanzar una banda» | ADR-10A §5.5 v1.0 | PO-01 §3 |
| Recomendación de la Opción D | ADR-10 §10 | PO-01 §3 — se adoptó la Opción A |

---

# 7. Relaciones de Dependencia

## 7.1 Cadena de autoridad del dominio

```
AF-00 · AF-01 · AF-02          Nivel constitucional
        │
        ▼
      PO-01                    Decide el dominio Empresa → Lead
        │
        ├──► APS-07            Referencia oficial del dominio
        │       │
        │       ├──► APS-02    Alcance
        │       ├──► APS-03    Agentes y flujo
        │       ├──► APS-04    Interfaz
        │       └──► APS-08    Opportunity Score
        │
        └──► ADR-11 ──► ADR-12 ──► ADR-13 ──► ADS-02
             frontera   identidad  semántica    motor
                                       │
                                       └──► ADR-14 ──► APS-08 §7.1
                                            gobernanza    WP-01
```

**Éste fue también el orden de ratificación** seguido en GOV-01, conforme a AR-03 §8.3: ningún documento se aprobó antes que aquel del que depende. Constancia en **AR-04 §4.4**.

## 7.2 Dependencias clave

| Documento | Depende de | Condiciona a |
| --- | --- | --- |
| **PO-01** | AF-00 · APS-01 · APS-02 | Todo el dominio |
| **APS-07** | PO-01 | APS-02 · APS-03 · APS-08 · ADR-05 · ADR-12 · ADR-13 |
| **APS-03** | PO-01 · APS-07 | ADR-02 · ADR-04 · APS-04 |
| **APS-04** | PO-01 · APS-03 · APS-07 · APS-08 · ADR-11 | Implementación del frontend |
| **ADR-11** | PO-01 · APS-03 · APS-07 | Toda decisión sobre límites técnicos |
| **ADR-12** | PO-01 · APS-02 §9 · ADR-11 | **ADR-13** — prerrequisito absoluto |
| **ADR-13** | PO-01 · **ADR-12** · ADR-05 · ADR-08 · ADR-11 | Elección del motor de persistencia |
| **ADR-14** | APS-08 · APS-13 · ADR-13 | Publicación del Perfil de Ponderación |
| **ADS-02** | **ADR-13** · ADR-05 · ADR-08 · ADR-12 | Esquema, migraciones y adaptadores de la Fase 5 |
| **APS-17** | PO-01 · **ADR-11** · APS-07 · APS-03 · APS-04 · ADR-13 | Valores operativos de toda la implementación |
| **AR-03** | AR-02 · PLAN-01 · REV-03 · todos los anteriores | Habilitación de la Fase 5 — Desarrollo |
| **AR-04** | AR-03 §8 · los siete documentos ratificados | Constancia de la ratificación y obligaciones de DEV-01 |
| **PO-02** | AF-00 · **PO-01** · APS-02 · APS-09 | APS-18 · APS-19 · APS-20 · APS-03 · ADR-13 · **todo el sistema comercial** |
| **APS-18** | PO-01 · **PO-02** · APS-07 · APS-08 · APS-09 | **APS-19** · **APS-20** · ADR-15 |
| **APS-19** | **APS-18** · APS-08 | **APS-20** · ADR-16 |
| **APS-20** | **APS-18** · **APS-19** · APS-17 · APS-11 | ADR-16 · la redacción y su verificación |
| **ADR-15** | PO-02 · APS-18 · APS-19 · APS-20 · ADR-01 · ADR-04 · ADR-13 | **ADR-16** · el ADR del Perfil de Estrategia *(`Pospuesto`)* |
| **ADR-16** | **ADR-15** · ADR-12 · ADR-13 · PO-02 | El esquema de persistencia comercial · ADS-02 |
| **ADR-17** | ADR-01 · ADR-04 · ADR-07 · ADR-08 · **ADR-09** · ADR-15 · ADR-16 | **DEV-00 §3.1, §3.13 y §4.1** · **ARCH-01 §6** · toda implementación de casos de uso |
| **ARCH-01** | ADR-01 · ADR-04 · ADR-08 · ADR-09 · ADR-15 · ADR-16 · **ADR-17** | Nada. **Es un mapa: localiza, no decide** |

## 7.3 Cadena de autoridad del sistema comercial

```
      PO-01 ────────► PO-02            Decide el alcance comercial
                        │              (sustituye a PO-01 §8 en la transición
                        │               a Lead Contactado, y solo en eso)
                        ▼
              APS-18 ──► APS-19 ──► APS-20
              criterio   diagnóstico  canales
                        │
                        ▼
                     ADR-15 ──► ADR-16
                  dónde vive   sobre qué opera
                        │
                        ▼
                     ADR-17 ──► ARCH-01
                  cómo se       dónde va
                  implementa    cada pieza
```

**Éste fue el orden de ratificación** del sprint *Gobernanza Final* (2026-07-30): **ningún documento se aprobó antes que aquel del que depende**, conforme a AR-03 §8.3.

---

# 8. Orden Recomendado de Lectura

## 8.1 Para incorporarse al proyecto

| # | Documento | Por qué |
| --- | --- | --- |
| 1 | **AF-00** | Qué es AKVEZ y por qué existe |
| 2 | **APS-01** | Visión y problema que resuelve |
| 3 | **APS-02** | Qué entra y qué no entra en la V1 |
| 4 | **PO-01** | **El documento más importante.** Qué es una Empresa, un Lead y la Biblioteca |
| 5 | **PO-02** | Qué es el Sistema Comercial, y por qué diseñar no es enviar |
| 6 | **APS-03** | Los tres agentes y el flujo canónico |
| 7 | **APS-04** Parte A | Las trece pantallas y su navegación |

## 8.2 Para implementar

| # | Documento |
| --- | --- |
| 0 | **DEV-00 — Implementation Rules** *(85 reglas, estructura, convenciones y checklist)* |
| 1 | **ADS-01 — Implementation Contracts** *(mapa tema → documento)* |
| 2 | ADR-01 · ADR-04 — organización del código y agentes |
| 3 | **ARCH-01** — dónde va cada pieza, y las tres validaciones de §7 |
| 4 | **ADR-17** — **cómo se escribe un caso de uso.** Léelo antes del primero |
| 5 | **ADR-11** — dónde puede residir cada limitación técnica |
| 6 | **ADR-12** · **ADR-13** — identidad y semántica de persistencia |
| 7 | **ADS-02** — motor, proveedor y compromiso de portabilidad |
| 8 | ADR-05 · ADR-08 · ADR-09 — estructura, frontera e inyección |
| 9 | ADR-06 · ADR-07 — contratos públicos de API |
| 10 | APS-08 §7.1 · **ADR-14** — Opportunity Score, WP-01 y su gobierno |
| 11 | **APS-17** — parámetros operativos antes de fijar cualquier valor |
| 12 | APS-04 Parte B — design system |

## 8.2.1 Para implementar el dominio comercial

**Además de lo anterior, y en este orden:**

| # | Documento |
| --- | --- |
| 1 | **PO-02** — alcance, la Prueba del Disparador y los cuatro estados del Lead |
| 2 | **APS-18** — los ocho principios, la Estrategia y la Secuencia |
| 3 | **APS-19** — las siete variables y el Modelo de Consciencia |
| 4 | **APS-20** — los tres canales y sus restricciones |
| 5 | **ADR-15** — la **Línea de Decisión** y las seis preocupaciones |
| 6 | **ADR-16** — las cinco entidades, los nueve eventos y los cuatro casos de uso |

> ⏸️ **`GenerateProposal` no puede completarse todavía.** Exige el **ADR de gobernanza del Perfil de Estrategia**, `Pospuesto` con disparador expreso *(ADR-15 §7.4)*. **`GenerateDiagnosis` y `CreateSequence` están desbloqueados.**

> **Antes de empezar, lee AR-03 §7:** qué significa que el Blueprint esté congelado y qué hacer ante una discrepancia. **AR-04 §10.1:** las cinco verificaciones que DEV-01 debe ejecutar sobre la implementación real. **Y AR-05 §5, acción 8:** los tres imports que ADR-17 AL-19 retira, y que deben corregirse **con** la normalización del módulo comercial, no después.

## 8.3 Para entender por qué el dominio es como es

Solo si necesitas el contexto histórico. **Ninguno es autoridad vigente:**

ADR-10 → DP-01 → REV-01 → REV-02 → AR-01

---

# 9. Cómo Buscar una Decisión

| Si buscas… | Ve a |
| --- | --- |
| Cualquier tema, por nombre | **[ADS-01 — Implementation Contracts](./ADS/ADS-01%20—%20Implementation%20Contracts.md)** |
| Una definición del dominio | PO-01, o el glosario de APS-07 §16 |
| Qué hace un agente | APS-03 §7 |
| Qué muestra una pantalla y qué no permite | APS-04 §A.5 |
| Si algo está dentro del alcance de la V1 | APS-02 §6 y §7 |
| Qué documento prevalece ante un conflicto | ADS-00, *Jerarquía Documental* |
| El estado de la consolidación | PLAN-01 §4.1 |
| Qué deudas quedan abiertas | AR-02 §4 · **AR-03 §10** |
| **Sobre qué base de datos se persiste** | **ADS-02 §4** |
| **Cuánto pesa cada categoría del Score** | **APS-08 §7.1** |
| **Qué límite, cupo o tanda puedo usar, y de cuánto** | **APS-17** *(prueba de admisibilidad en §3)* |
| **Si el Blueprint está listo para desarrollo** | **AR-03 §7** — sí, certificación vigente |
| **Si una etapa puede ejecutarse de forma diferida** | **ADR-13 §11.2** *(sí, bajo A-1 y A-2)* · AR-04 §6.3 |
| **Qué se ratificó en GOV-01 y qué quedó fuera** | **AR-04 §4 y §5** |
| **Cómo debo escribir el código, y qué no puedo hacer** | **DEV-00 §3** |
| **Dónde va cada archivo** | **DEV-00 §4** · **ARCH-01 §1** |
| **Cómo se escribe un caso de uso** | **ADR-17 §5 a §9** · DEV-00 §3.13 |
| **Si `application/` puede importar `infrastructure/`** | **No** — ADR-17 §12 *(AL-19)* · DEV-00 R-05 |
| **Dónde declaro un puerto** | **ADR-17 §6.2** — de proveedor en `domain/`; de persistencia en `shared/persistence/repositories/` |
| **Cuándo un Lead está Contactado** | **PO-02 §5** — *lo declara el usuario* |
| **Qué estados admite un Lead** | **PO-02 §5.1** — cuatro, y la lista es cerrada |
| **Qué decide `domain/` y qué solo comunica** | **ADR-15 §8** *(Línea de Decisión)* · ARCH-01 §2 |
| **Qué entidades y eventos tiene el dominio comercial** | **ADR-16 §4 y §6** |
| **Qué reviso antes de aprobar un PR** | **DEV-00 §7** |
| **Qué desviaciones y riesgos siguen abiertos** | **AR-05 §5.1 y §8.2** |
| **Por qué AF-01 y AF-02 siguen en `Draft`** | **AR-04 §5** |
