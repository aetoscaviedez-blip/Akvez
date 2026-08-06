# AKVEZ — Documentación oficial del Blueprint

> **Este fichero es solo una puerta de entrada.**
>
> El catálogo oficial, con la versión y el estado de cada documento, es **[INDEX.md](./INDEX.md)**.
> El mapa tema → documento es **[ADS-01 — Implementation Contracts](./ADS/ADS-01%20—%20Implementation%20Contracts.md)**.
>
> **Ninguno de los dos decide nada.** Ante discrepancia entre un índice y un documento canónico, **prevalece el canónico**.

| Campo | Valor |
| --- | --- |
| Última actualización | **2026-07-30** |
| Documentos catalogados | **69** — 52 `Approved` · 11 `Draft` · 6 `Archived` |
| Estándar aplicado | **ADS-00 v1.3** |
| Estado de la arquitectura | ✅ **Architecture Approved** |

> **Nota de la sincronización del 2026-07-30.** Este fichero era una exportación de Notion con **21 enlaces rotos** —rutas con el identificador de página del origen— y catalogaba **20 documentos de 69**. Se reconstruye con rutas válidas. **No contiene ninguna decisión, ninguna regla y ningún contenido normativo:** es un índice de navegación.

---

## Por dónde empezar

| Si eres… | Lee, en este orden |
| --- | --- |
| **Nuevo en el proyecto** | AF-00 → APS-01 → APS-02 → **PO-01** → PO-02 → APS-03 → APS-04 Parte A |
| **Vas a escribir código** | **DEV-00** → ADS-01 → ARCH-01 → **ADR-17** → el resto de **[INDEX §8.2](./INDEX.md)** |
| **Vas a implementar el dominio comercial** | PO-02 → APS-18 → APS-19 → APS-20 → ADR-15 → ADR-16 · **[INDEX §8.2.1](./INDEX.md)** |
| **Buscas una decisión concreta** | **[ADS-01](./ADS/ADS-01%20—%20Implementation%20Contracts.md)**, o **[INDEX §9](./INDEX.md)** |

---

## AF — Fundacionales *(orden 1)*

- [AF-00 — AKVEZ Foundation: la Constitución](./AF/AF-00%20AKVEZ%20FOUNDATION.md) — `Approved`
- [AF-01 — The AKVEZ Way](./AF/AF-01%20—%20The%20AKVEZ%20Way.md) — `Draft`
- [AF-02 — The AKVEZ Product Manifesto](./AF/AF-02%20—%20The%20AKVEZ%20Product%20Manifesto.md) — `Draft`

## ADS — Estándares documentales

- [ADS-00 — Documentation Standard](./ADS/ADS-00%20Documentation%20Standard.md) — **jerarquía y precedencia**
- [ADS-01 — Implementation Contracts](./ADS/ADS-01%20—%20Implementation%20Contracts.md) — **mapa tema → documento**
- [ADS-02 — Implementación del Motor de Persistencia](./ADS/ADS-02%20—%20Persistence%20Engine%20Implementation.md) — PostgreSQL sobre Supabase

## PO — Decisiones de producto *(orden 2)*

- [PO-01 — Definición Canónica de Lead](./PO/PO-01%20—%20Product%20Decision%20-%20Canonical%20Definition%20of%20Lead.md) — **autoridad del dominio**
- [PO-02 — Alcance del Sistema Comercial](./PO/PO-02%20—%20Commercial%20System%20Scope.md) — **autoridad del sistema comercial**

## APS — Especificación del producto *(orden 3)*

- [APS-01 — Product Vision](./APS/APS-01%20—%20Product%20Vision.md)
- [APS-02 — Product Scope](./APS/APS-02%20—%20Product%20Scope.md)
- [APS-03 — Agent Architecture](./APS/APS-03%20—%20Agent%20Architecture.md)
- [APS-04 — Human Interface System](./APS/APS-04%20—%20Design%20System.md)
- [APS-05 — Product Roadmap & Evolution Strategy](./APS/APS-05%20—%20Product%20Roadmap%20&%20Evolution%20Strategy.md)
- [APS-06 — Success Metrics & Product Analytics](./APS/APS-06%20—%20Success%20Metrics%20&%20Product%20Analytics.md)
- [APS-07 — Data & Knowledge Architecture](./APS/APS-07%20—%20Data%20&%20Knowledge%20Architecture.md)
- [APS-08 — Opportunity Scoring Framework](./APS/APS-08%20—%20Opportunity%20Scoring%20Framework.md) — **Perfil WP-01**
- [APS-09 — AI Decision Framework](./APS/APS-09%20—%20AI%20Decision%20Framework.md)
- [APS-10 — Security, Privacy & Trust Framework](./APS/APS-10%20—%20Security,%20Privacy%20&%20Trust%20Framework.md)
- [APS-11 — Integration Architecture & External Services](./APS/APS-11%20—%20Integration%20Architecture%20&%20External%20Services.md)
- [APS-12 — Product Quality Assurance Framework](./APS/APS-12%20—%20Product%20Quality%20Assurance%20Framework.md)
- [APS-13 — Product Governance Framework](./APS/APS-13%20—%20Product%20Governance%20Framework.md)
- [APS-14 — Founder Validation Strategy](./APS/APS-14%20—%20Founder%20Validation%20Strategy.md)
- [APS-15 — Go-To-Market Strategy](./APS/APS-15%20—%20Go-To-Market%20Strategy.md)
- [APS-16 — Technical Architecture Blueprint](./APS/APS-16%20—%20Technical%20Architecture%20Blueprint.md)
- [APS-17 — Parámetros Iniciales del Producto](./APS/APS-17%20—%20Initial%20Product%20Parameters.md) — **21 parámetros**
- [APS-18 — Commercial Strategy Framework](./APS/APS-18%20—%20Commercial%20Strategy%20Framework.md)
- [APS-19 — Buyer Diagnosis Model](./APS/APS-19%20—%20Buyer%20Diagnosis%20Model.md)
- [APS-20 — Outreach Channels & Constraints](./APS/APS-20%20—%20Outreach%20Channels%20&%20Constraints.md)

## ADR — Decisiones de arquitectura *(orden 4)*

- [ADR-01 — Arquitectura Modular Orientada al Dominio](./ADR/ADR-01%20—%20Arquitectura%20Modular%20Orientada%20al%20Dominio.md)
- [ADR-02 — Orquestación de Capacidades y Agentes](./ADR/ADR-02%20—%20Orquestación%20de%20Capacidades.md)
- [ADR-03 — Integraciones Externas y Proveedores Tecnológicos](./ADR/ADR-03%20—%20Integraciones%20Externas%20y%20Proveedores%20Tecnológicos.md)
- [ADR-04 — Backend Agent Architecture](./ADR/ADR-04%20—%20Backend%20Agent%20Architecture.md)
- [ADR-05 — Persistence Architecture & Data Layer](./ADR/ADR-05%20—%20Persistence%20Architecture%20&%20Data%20Layer.md)
- [ADR-06 — Public API Contract Strategy](./ADR/ADR-06%20—%20Public%20API%20Contract%20Strategy.md)
- [ADR-07 — Public Contract Boundary Consolidation](./ADR/ADR-07%20—%20Public%20Contract%20Boundary%20Consolidation.md)
- [ADR-08 — Persistence Boundary & Repository Isolation](./ADR/ADR-08%20—%20Persistence%20Boundary%20&%20Repository%20Isolation.md)
- [ADR-09 — Dependency Injection Strategy](./ADR/ADR-09%20—%20Dependency%20Injection%20Strategy.md)
- [ADR-10 — Persistence Position in the Lead Acquisition Flow](./ADR/ADR-10%20—%20Persistence%20Position%20in%20the%20Lead%20Acquisition%20Flow.md) — 📦 `Archived`
- [ADR-10A — Definición Canónica de Empresa y Lead](./ADR/ADR-10A%20—%20Canonical%20Domain%20Definition%20of%20Empresa%20and%20Lead.md)
- [ADR-11 — Frontera entre Dominio e Implementación](./ADR/ADR-11%20—%20Domain%20and%20Implementation%20Boundary.md)
- [ADR-12 — Identidad Canónica del Lead](./ADR/ADR-12%20—%20Canonical%20Lead%20Identity.md)
- [ADR-13 — Motor Canónico de Persistencia](./ADR/ADR-13%20—%20Canonical%20Persistence%20Engine.md)
- [ADR-14 — Gobernanza del Opportunity Score](./ADR/ADR-14%20—%20Opportunity%20Score%20Governance.md)
- [ADR-15 — Arquitectura del Sistema de Inteligencia Comercial](./ADR/ADR-15%20—%20Commercial%20Intelligence%20Architecture.md) — **la Línea de Decisión**
- [ADR-16 — Arquitectura del Dominio Comercial](./ADR/ADR-16%20—%20Commercial%20Domain%20Model.md)
- [ADR-17 — Application Layer Architecture](./ADR/ADR-17%20—%20Application%20Layer%20Architecture.md) — **cómo se escribe un caso de uso**

## ARCH — Mapa de arquitectura física

- [ARCH-01 — Arquitectura del Sistema AKVEZ](./ARCH/ARCH-01%20—%20System%20Architecture.md) — **dónde va cada pieza**

> **«ARCH» no pertenece a la Clasificación Oficial de ADS-00**, que es cerrada. **Localiza la arquitectura; no la decide.** Ante discrepancia prevalece el ADR.

## DEV — Estándares de desarrollo *(orden 8)*

- [DEV-00 — Implementation Rules](./DEV/DEV-00%20—%20Implementation%20Rules.md) — **85 reglas, estructura y checklist de PR**
- [DEV-01 — Hallazgos del Architecture Bootstrap](./DEV/DEV-01%20—%20Hallazgos%20del%20Architecture%20Bootstrap.md)
- [DEV-01A — Informe de Auditoría Técnica](./DEV/DEV-01A%20—%20Informe%20de%20Auditoría%20Técnica.md)
- [DEV-01B — Baseline corregido](./DEV/DEV-01B%20—%20Baseline%20corregido.md)
- [DEV-02.2 — Implementación GOV-03](./DEV/DEV-02.2%20—%20Implementación%20GOV-03.md)
- [DEV-03 — MVP Flow](./DEV/DEV-03%20—%20MVP%20Flow.md)
- [DEV-04 — Lead Scoring Engine](./DEV/DEV-04%20—%20Lead%20Scoring%20Engine.md)
- [DEV-05 — Identidad, Registro Idempotente y Score Breakdown](./DEV/DEV-05%20—%20Identidad,%20Registro%20Idempotente%20y%20Publicación%20del%20Score%20Breakdown.md)

> **DEV-00 contiene las reglas; los demás son registros de ejecución y no contienen ninguna.**

## DP — Decision Papers *(orden 5, consultiva)*

- [DP-01 — Ciclo de Vida Canónico de una Oportunidad](./DP/DP-01%20—%20Canonical%20Lifecycle%20of%20an%20Opportunity.md) — 📦 `Archived`
- [DP-02 — Estrategia de Logging y Observabilidad](./DP/DP-02%20—%20DA-01%20Estrategia%20de%20Logging%20y%20Observabilidad.md)
- [DP-03 — Contrato de Resultado de la Capa Application](./DP/DP-03%20—%20DA-02%20Contrato%20de%20Resultado%20de%20la%20Capa%20Application.md)
- [DP-04 — Política de Strict Mode](./DP/DP-04%20—%20DA-03%20Política%20de%20Strict%20Mode.md)

> ⚠️ **Un DP `Approved` acredita que la decisión está tomada, no que sea exigible.** **Nunca se cita un DP como fundamento de una regla:** se cita el ADR, APS o configuración que la formaliza. *(AR-05 §4, riesgo RC-2.)*

## PLAN · REV · AR · ATA

- [PLAN-01 — Plan de Consolidación del Blueprint](./PLAN/PLAN-01%20—%20Blueprint%20Consolidation%20Plan.md)
- [REV-01 — Revisión del Dominio Canónico](./REV/REV-01%20—%20Canonical%20Domain%20Review%20of%20Empresa%20and%20Lead.md) — 📦 `Archived`
- [REV-02 — Revisión Documental de Q-2](./REV/REV-02%20—%20Documentary%20Review%20of%20Q-2%20%28What%20Lead%20Hunter%20Stores%29.md) — 📦 `Archived`
- [REV-03 — Residual Consistency Review](./REV/REV-03%20—%20Residual%20Consistency%20Review.md)
- [AR-01 — Evaluación Arquitectónica Final del Dominio](./AR/AR-01%20—%20Final%20Architectural%20Assessment%20of%20the%20Empresa%20to%20Lead%20Domain.md) — 📦 `Archived`
- [AR-02 — Blueprint Readiness Assessment](./AR/AR-02%20—%20Blueprint%20Readiness%20Assessment.md)
- [AR-03 — Blueprint v3.0, Implementation Ready](./AR/AR-03%20—%20Blueprint%20v3.0%20Implementation%20Ready.md) — **certificación vigente**
- [AR-04 — Informe GOV-01: Ratificación del Blueprint](./AR/AR-04%20—%20GOV-01%20Blueprint%20Ratification%20Report.md)
- [AR-05 — Informe de Cierre GOV-03](./AR/AR-05%20—%20GOV-03%20Closure%20Report.md) — **registro vivo de desviaciones y riesgos**
- [ATA-01 — Technical Audit Report](./ATA-01%20—%20Technical%20Audit%20Report.md) — 📦 `Archived`

---

## Fuera del catálogo

**`docs/architecture/` contiene tres ficheros que no son autoridad vigente y no deben usarse para diseñar arquitectura:** `ADS-API-01` *(`Deprecated`, sustituido por ADR-06)*, `API-DTO-CATALOG` *(`Draft`)* y `COM-02` *(`Draft`, origen funcional de APS-18)*.

**Regla fundamental.** Si existe conflicto entre el código y el Blueprint, **prevalece el Blueprint**. Quien detecte la discrepancia debe detenerse y reportarla, nunca resolverla por su cuenta.
