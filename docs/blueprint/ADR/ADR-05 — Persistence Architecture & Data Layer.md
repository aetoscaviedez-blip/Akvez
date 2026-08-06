# AKVEZ Blueprint
## ADR-05 — Persistence Architecture & Data Layer
### Architecture Decision Record

---

## Portada

| Información | Detalle |
| :--- | :--- |
| **Nombre del documento:** | Persistence Architecture & Data Layer |
| **Código:** | ADR-05 |
| **Categoría:** | Architecture Decision Record |
| **Versión:** | 1.4 |
| **Estado:** | Approved |
| **Proyecto:** | AKVEZ SaaS Platform |
| **Responsable:** | AKVEZ Product & Architecture Team |
| **Fecha:** | 2026 |
| **Clasificación:** | Documento interno de arquitectura |

> "Una plataforma inteligente no solo necesita encontrar oportunidades; necesita recordar, aprender y evolucionar a partir de cada interacción."

---

## Historial de Versiones

| Versión | Fecha | Estado | Responsable | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | 2026 | Draft | AKVEZ Architecture Team | Definición inicial de la arquitectura de persistencia |
| 1.1 | 2026-07-24 | Approved Draft | AKVEZ Architecture Team | Nota editorial en sección 21 (Anexos) aclarando que la capa de Public Contracts / API Mappers está fuera del alcance de este documento y está definida en ADR-06/ADR-07 — evita que el diagrama "Arquitectura objetivo AKVEZ" se interprete como el flujo completo. Sin cambios a ninguna decisión de persistencia (secciones 1-20 intactas). |
| 1.2 | 2026-07-24 | Approved Draft | AKVEZ Architecture Team | Nota en sección 11 (Repository Pattern) remitiendo a ADR-08 para el mecanismo exacto de acceso entre `shared/persistence/repositories/` y la entidad de dominio de un módulo. Sin cambios a ninguna decisión de persistencia (secciones 1-20 intactas); ADR-08 precisa un mecanismo que esta sección dejaba abierto, no lo contradice. |
| 1.4 | 2026-07-29 | Approved | AKVEZ Product Office | **Normalización del estado documental: `Approved Draft` → `Approved`.** Ningún contenido modificado: ninguna sección, decisión, capa, modelo, riesgo ni KPI resulta afectado. | `Approved Draft` **no pertenece** a la clasificación oficial de ADS-00 (*Estados del Documento*), que admite exactamente cinco: `Draft`, `Review`, `Approved`, `Deprecated` y `Archived`. Era un estado híbrido sin definición normativa. **Se resuelve a favor de `Approved`** porque el documento no tiene ninguna condición de aprobación pendiente, sus decisiones están vigentes y son citadas como canónicas por ADR-08 §10, ADR-13 §4.1 y ADS-01 §3. Hallazgo **H-07** de REV-03. |
| 1.3 | 2026-07-29 | Approved Draft | AKVEZ Product Office | **Alineación terminológica con PO-01.** Sección 10: se sustituye la definición de `Lead` («Representa una oportunidad comercial») por la canónica y se declara la opcionalidad de `opportunityScore` y `classification`. Sección 12: «Guardar nuevos leads» → «Registrar todas las Empresas no duplicadas»; «Analizar prospecto» → «Analizar el Lead». **Ninguna decisión arquitectónica modificada:** capas, Repository Pattern, modelo de campos, seguridad, migración, riesgos y KPIs permanecen intactos. | Fase 2 de PLAN-01 y PO-01 §9.2: «ADR-05 §12 — alineación terminológica». La definición de `Lead` de la sección 10 quedó derogada por PO-01 §2, y `prospecto` no pertenece a la terminología oficial de ADS-00. |

---

## Tabla de Contenido

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Contexto Arquitectónico](#2-contexto-arquitectónico)
3. [Problema Identificado](#3-problema-identificado)
4. [Objetivos](#4-objetivos)
5. [Alcance](#5-alcance)
6. [Principios Arquitectónicos](#6-principios-arquitectónicos)
7. [Decisión Arquitectónica](#7-decisión-arquitectónica)
8. [Arquitectura de Persistencia Propuesta](#8-arquitectura-de-persistencia-propuesta)
9. [Capas y Responsabilidades](#9-capas-y-responsabilidades)
10. [Modelo Conceptual Inicial](#10-modelo-conceptual-inicial)
11. [Repository Pattern](#11-repository-pattern)
12. [Integración con Agentes](#12-integración-con-agentes)
13. [Evolución hacia CRM y Automatización](#13-evolución-hacia-crm-y-automatización)
14. [Seguridad y Privacidad](#14-seguridad-y-privacidad)
15. [Estrategia de Migración](#15-estrategia-de-migración)
16. [Riesgos](#16-riesgos)
17. [Métricas y KPIs](#17-métricas-y-kpis)
18. [Dependencias](#18-dependencias)
19. [Glosario](#19-glosario)
20. [Referencias](#20-referencias)
21. [Anexos](#21-anexos)

---

### 1. Resumen Ejecutivo

AKVEZ actualmente posee una arquitectura modular basada en agentes inteligentes. Los módulos actuales son:

* Lead Hunter Agent.
* Lead Analyzer Agent.
* Pitch Generator Agent.

Cada módulo sigue la arquitectura: Domain, Application, Infrastructure, Presentation. Esta arquitectura permite crear nuevos agentes sin modificar agentes existentes.

Sin embargo, durante la auditoría arquitectónica del Sprint 9 se identificó una limitación estructural: **AKVEZ actualmente no posee una capa de persistencia.**

El sistema puede:
* Encontrar negocios.
* Analizar oportunidades.
* Generar mensajes.

Pero **no puede**:
* Recordar leads anteriores.
* Guardar historial.
* Almacenar interacciones.
* Mantener estado entre ejecuciones.
* Construir memoria comercial.

Esto representa una limitación directa para la evolución planteada en el Blueprint:
* Biblioteca de Leads.
* CRM Agent.
* Follow-up Agent.
* Scheduler Agent.
* Memoria operacional de agentes.

Este ADR define la arquitectura oficial de persistencia de AKVEZ. La decisión principal es:
> La persistencia será una capacidad de infraestructura desacoplada mediante Repository Pattern, donde ningún agente tendrá acceso directo al almacenamiento.

### 2. Contexto Arquitectónico

Este ADR complementa las decisiones existentes:

* **ADR-01 — Modular Architecture:** Define separación de responsabilidades y módulos independientes.
* **ADR-02 — Agent Orchestration:** Define que los procesos compuestos deben ser coordinados mediante Orchestrators.
* **ADR-03 — Infrastructure Architecture:** Define que servicios externos y detalles técnicos deben permanecer aislados.
* **ADR-04 — Agent Architecture:** Define el patrón: `Domain → Application → Infrastructure → Presentation`.

La nueva arquitectura de persistencia debe integrarse sin romper estos principios.

### 3. Problema Identificado

Actualmente AKVEZ funciona como un sistema sin estado. Cada ejecución comienza desde cero.

**Ejemplo:**
Un diseñador ejecuta Lead Hunter. AKVEZ encuentra 50 negocios, puntuaciones, análisis y mensajes. Después de finalizar, toda esa información desaparece.

Cuando el usuario vuelve mañana, AKVEZ no sabe:
* Qué negocios encontró antes.
* Cuáles fueron contactados.
* Cuáles respondieron.
* Cuáles rechazaron.
* Cuáles ya son clientes.

Esto impide evolucionar hacia una plataforma SaaS completa.

### 4. Objetivos

**Objetivo Principal**
Crear una arquitectura de persistencia escalable que permita a AKVEZ almacenar conocimiento comercial y evolucionar hacia una plataforma inteligente de gestión de clientes.

**Objetivos Secundarios**

* **Persistencia de Leads:** Guardar negocios encontrados, información comercial, scoring, análisis IA y estados.
* **Memoria Operacional:** Permitir que agentes futuros consulten información histórica.
  * *Lead Hunter:* "Este negocio ya fue encontrado anteriormente."
  * *Pitch Generator:* "Este cliente recibió una propuesta hace 15 días."
  * *Follow-up Agent:* "Enviar seguimiento porque no hubo respuesta."
* **Desacoplamiento:** Los agentes nunca deben conocer la base de datos, ORM, SQL o proveedor tecnológico.
* **Escalabilidad:** La arquitectura debe soportar crecimiento de usuarios, millones de leads, nuevos agentes y auditoría.

### 5. Alcance

**Incluye**
Este ADR define la ubicación de la persistencia, responsabilidades, patrones de acceso, modelos iniciales, integración con agentes y reglas arquitectónicas.

**No incluye**
Este ADR no define el proveedor específico de base de datos, infraestructura cloud, modelo definitivo del CRM ni la interfaz visual. Estas decisiones deberán documentarse posteriormente.

### 6. Principios Arquitectónicos

**Principio 1:** Los agentes nunca acceden directamente a datos persistidos.
* *Incorrecto:* `Agent → Database`
* *Correcto:* `Agent → Application → Repository → Persistence → Database`

**Principio 2:** Persistence pertenece a Infrastructure.
La base de datos es un detalle técnico. El dominio debe funcionar sin conocerla.

**Principio 3:** El dominio debe permanecer testeable.
Una regla de negocio debe poder ejecutarse sin conexión externa.

**Principio 4:** Los datos son un activo estratégico del producto.
AKVEZ debe construir memoria propia.

### 7. Decisión Arquitectónica

**Decisión 1:** Crear una capa de persistencia independiente.
Estructura propuesta:
```text
server/
  shared/
    persistence/
      repositories/
      models/
      adapters/
```

**Decisión 2:** Implementar Repository Pattern.
Los casos de uso trabajarán contra interfaces.

Ejemplo `LeadRepository`:
* `save()`
* `findById()`
* `findByUser()`
* `updateStatus()`

La implementación real será responsabilidad de Infrastructure.

**Decisión 3:** Separar entidades de dominio y modelos persistentes.

Ejemplo:
* **Dominio:** `Lead` (businessName, score, classification)
* **Persistencia:** `LeadEntity` (id, user_id, created_at, metadata)

La transformación será mediante mappers.

### 8. Arquitectura de Persistencia Propuesta

Arquitectura objetivo:
```text
Usuario
↓
Routes
↓
Orchestrators
↓
Agents
↓
Application
↓
Domain
↓
Repository Interface
↓
Persistence Adapter
↓
Database
```

### 9. Capas y Responsabilidades

* **Domain:** Responsable de reglas de negocio, entidades y lógica pura. No conoce base de datos, APIs ni almacenamiento.
* **Application:** Responsable de ejecutar casos de uso y coordinar repositorios. Ejemplo: `GuardarLeadUseCase`.
* **Infrastructure:** Responsable de conexión, ORM, consultas e implementación de repositorios.
* **Persistence:** Responsable de modelos almacenados, migraciones y acceso físico a datos.

### 10. Modelo Conceptual Inicial

**Lead**
Representa una Empresa incorporada al espacio de trabajo comercial de un usuario. *(PO-01 §2; APS-07 v2.0 §5)*
Campos: `id`, `businessName`, `industry`, `location`, `website`, `socialLinks`, `opportunityScore`, `classification`, `status`, `createdAt`, `updatedAt`.

> **Corrección de dominio (v1.3).** La v1.2 definía Lead como «Representa una oportunidad comercial». Esa definición queda **sustituida** conforme a PO-01 §2. No se modifica ningún campo del modelo.
>
> **Consecuencia sobre el modelo, sin cambios estructurales:** `opportunityScore` y `classification` son **opcionales**. Un Lead recién registrado carece de ambos y ése es un estado válido (APS-07 v2.0 §8.4). El conjunto que este modelo representa es el definido en APS-07 v2.0 §8.1: **todas** las Empresas descubiertas para el usuario.

**User**
Representa al profesional que utiliza AKVEZ.
Campos: `id`, `email`, `subscriptionPlan`, `createdAt`.

**Interaction**
Representa comunicaciones realizadas.
Campos: `id`, `leadId`, `type`, `channel`, `message`, `createdAt`.

**AgentExecution**
Representa actividad de agentes.
Campos: `id`, `agentName`, `input`, `output`, `timestamp`.

### 11. Repository Pattern

Ejemplo `LeadRepository`:
Responsabilidad: guardar leads, buscar leads, actualizar estados.

Los agentes **nunca** llaman: `Database.query()`
Los agentes llaman: `leadRepository.find()`

> **Nota (v1.2, 2026-07-24):** esta sección no especifica cómo `shared/persistence/repositories/` obtiene la forma de la entidad de dominio (p. ej. `Lead`) sin acoplarse a la estructura interna de un módulo específico. Ese mecanismo — y la separación entre entidad de dominio, Persistence Model, Repository Interface y Database Adapter — quedan definidos en **ADR-08 — Persistence Boundary & Repository Isolation**. Esta nota es aclaratoria; no modifica el Repository Pattern aprobado en esta sección.

### 12. Integración con Agentes

* **Lead Hunter:**
  * *Antes:* Buscar → devolver
  * *Después:* Buscar ↓ Consultar duplicados ↓ **Registrar todas las Empresas no duplicadas** ↓ Devolver los Leads registrados

* **Lead Analyzer:**
  * *Antes:* Analizar prospecto
  * *Después:* Analizar el Lead ↓ Guardar análisis ↓ Calcular el Opportunity Score ↓ Actualizar el Lead

* **Pitch Generator:**
  * *Antes:* Generar mensaje
  * *Después:* Generar mensaje ↓ Guardar interacción ↓ Actualizar historial

> **Alineación terminológica (v1.3).** Correcciones de nomenclatura, sin cambio alguno en la integración técnica descrita:
>
> - **Lead Hunter.** «Guardar nuevos leads» → «**Registrar** todas las Empresas no duplicadas». El término oficial de la escritura es **Registro**, y es el evento que convierte una Empresa en Lead (PO-01 §3; APS-03 v3.0 §7.1). La escritura es **exhaustiva**: alcanza a todas las Empresas descubiertas y no duplicadas.
> - **Lead Analyzer.** «Analizar prospecto» → «Analizar el Lead». *Prospecto* no pertenece a la terminología oficial (ADS-00, *Terminología*). Se explicita además que el Opportunity Score se calcula **después** del análisis, conforme al orden canónico de APS-07 v2.0 §6.3.
>
> El orden de operaciones de esta sección ya era correcto: la persistencia del Lead Hunter precede al análisis. PO-01 §3 lo confirma.

### 13. Evolución hacia CRM y Automatización

Esta arquitectura habilita:
* **CRM Agent:** Responsabilidades: gestión de clientes, estados comerciales, pipeline.
* **Follow-up Agent:** Responsabilidades: recordatorios, seguimiento automático, secuencias.
* **Scheduler Agent:** Responsabilidades: tareas programadas, ejecución automática.

### 14. Seguridad y Privacidad

La capa de persistencia debe garantizar:
* Separación por usuario.
* Autorización.
* Auditoría.
* Protección de datos.

Regla fundamental:
> Un usuario nunca puede acceder a información perteneciente a otro usuario.

### 15. Estrategia de Migración

La implementación será incremental.
* **Fase 1:** Crear infraestructura base.
* **Fase 2:** Persistir leads encontrados.
* **Fase 3:** Persistir análisis IA.
* **Fase 4:** Persistir interacciones.
* **Fase 5:** Construir CRM.

### 16. Riesgos

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| Elegir tecnología demasiado pronto | Alto | Mantener arquitectura independiente |
| Acoplar agentes a DB | Alto | Repository Pattern obligatorio |
| Modelo inicial incorrecto | Medio | Evolución incremental |
| Falta de estrategia migratoria | Medio | Definir antes de producción |

### 17. Métricas y KPIs

* **Arquitectura:** 0 accesos directos de agentes a base de datos. 100% acceso mediante repositorios.
* **Producto:** Leads almacenados, leads reutilizados, interacciones registradas.
* **Operación:** Tiempo promedio de consulta, duplicados evitados, historial disponible.

### 18. Dependencias

**Depende de:**
* ADR-01.
* ADR-02.
* ADR-03.
* ADR-04.

**Habilita:**
* APS-03 CRM.
* Follow-up Agent.
* Scheduler Agent.

### 19. Glosario

* **Persistence:** Capacidad de almacenar información entre ejecuciones.
* **Repository:** Abstracción entre lógica de negocio y almacenamiento.
* **Entity:** Objeto con identidad dentro del sistema.
* **Mapper:** Transformador entre modelos.

### 20. Referencias

* AKVEZ Blueprint.
* ADS-00 Documentation Standard.
* ADR-01 Modular Architecture.
* ADR-02 Agent Orchestration.
* ADR-03 Infrastructure Architecture.
* ADR-04 Agent Architecture.

### 21. Anexos

**Regla fundamental**
> "Ningún agente debe saber dónde viven los datos."

**Arquitectura objetivo AKVEZ**
```text
User
↓
Routes
↓
Orchestrators
↓
Agents
↓
Application
↓
Domain
↓
Infrastructure
↓
Persistence
↓
Database
```

> **Nota editorial (v1.1, 2026-07-24):** este diagrama describe exclusivamente la ruta de persistencia y no incluye la capa de Public Contracts / API Mappers (`server/shared/contracts/`, `server/shared/mappers/`) que traduce el resultado de `Application`/`Domain` hacia la respuesta HTTP pública. Esa capa está fuera del alcance de este documento (sección 5, "No incluye") y se encuentra definida en **ADR-06 — Public API Contract Strategy** y **ADR-07 — Public Contract Boundary Consolidation**. Esta nota es puramente aclaratoria; no modifica ninguna decisión de persistencia de este ADR.

**Estado Final**
ADR-05 establece la base arquitectónica necesaria para que AKVEZ evolucione desde un sistema de agentes sin memoria hacia una plataforma SaaS inteligente capaz de almacenar conocimiento, gestionar relaciones comerciales y soportar futuros agentes autónomos. La persistencia deja de ser únicamente una necesidad técnica y pasa a convertirse en una capacidad estratégica del producto.
