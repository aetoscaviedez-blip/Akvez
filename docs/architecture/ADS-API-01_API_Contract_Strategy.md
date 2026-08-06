# ADS-API-01 — API Contract Strategy

| Campo | Valor |
| --- | --- |
| Código | ADS-API-01 |
| Clasificación | API Contract Strategy (ver nota de cumplimiento ADS-00 al final de la portada) |
| Versión | 1.0 |
| Estado | **Deprecated** — sustituido por ADR-06 (ver nota abajo) |
| Fecha de creación | 2026-07-23 |
| Última actualización | 2026-07-23 |
| Responsable | AKVEZ Architecture Team |
| Nivel de confidencialidad | Interno |

**Nota de cumplimiento ADS-00 (histórica):** el estándar ADS-00, sección "Clasificación Oficial", define únicamente cuatro categorías documentales: AF, ADS, APS y ADR. El prefijo "ADS-API" no corresponde a ninguna de ellas. Por contenido, este documento encajaba con mayor precisión en la categoría **ADR**. Esta observación quedó resuelta: el Sprint 12 (Tarea 2 — Public Contracts Layer) solicitó formalizar la misma estrategia como **ADR-06 — Public API Contract Strategy**, siguiendo correctamente ADS-00. Este documento queda **Deprecated** a partir de la aprobación de ADR-06 y se conserva únicamente con fines históricos — no debe usarse como referencia vigente.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-23 | Architecture Team | Creación inicial, en borrador. Define la estrategia formal de contratos públicos de API. | Formalizar la separación entre modelos internos (dominio, persistencia, IA) y lo que AKVEZ expone a consumidores externos, a partir de los hallazgos del Sprint 12 (Tarea 1 — Auditoría de contratos públicos). |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Relación con ADR Existentes
5. Contexto
6. Principio Fundamental
7. Capas de Datos
8. Clasificación de Información
9. Reglas de Exposición
10. Contrato Actual vs. Futuro
11. Error Contract
12. Versionamiento
13. Seguridad
14. Compatibilidad Futura
15. Decisiones Importantes
16. Riesgos
17. KPIs
18. Dependencias
19. Glosario
20. Referencias
21. Anexos
22. Definition of Done

---

# 1. Resumen Ejecutivo

AKVEZ expone hoy sus tres endpoints (`/api/health`, `/api/prospect/search`, `/api/prospect/outreach`) devolviendo, sin ninguna capa intermedia, estructuras internas creadas durante la evolución inicial del MVP (`Prospect`, `PitchPayload`) — confirmado con evidencia concreta en la auditoría del Sprint 12, Tarea 1.

Este documento define la estrategia oficial mediante la cual AKVEZ separará, de forma permanente, lo que el sistema calcula internamente de lo que decide exponer a cualquier consumidor externo. No implementa dicha separación — establece las reglas, capas y contratos que la futura implementación deberá seguir.

---

# 2. Objetivo

Definir la primera versión formal de los contratos públicos de AKVEZ, estableciendo:

- Qué información entra al sistema.
- Qué información sale del sistema.
- Qué información es pública.
- Qué información es interna.
- Cómo se representan los errores de forma consistente.
- Cómo evolucionarán los contratos sin romper a los consumidores futuros.

---

# 3. Alcance

## Incluye

- La estrategia de separación entre modelos internos y contratos externos.
- La clasificación de información en Público / Interno / Sensible.
- Las capas conceptuales de transformación de datos, desde el dominio hasta la respuesta HTTP.
- Las reglas obligatorias de exposición de datos.
- El formato estándar de error para toda la API.
- Los lineamientos de versionamiento y de seguridad del contrato.

## No incluye

- La implementación de los DTOs descritos (queda para un Sprint de implementación posterior).
- La elección de una librería o framework de validación de esquemas.
- La implementación de autenticación, autorización o multi-tenancy (se referencian como trabajo futuro habilitado por este documento, no definido aquí).
- El versionamiento de rutas (`/api/v1/...`) — se documenta la estrategia, explícitamente sin implementarla (sección 12).

---

# 4. Relación con ADR Existentes

| Documento | Relación con este documento |
| --- | --- |
| **ADR-01 — Arquitectura Modular Orientada al Dominio** | Este documento extiende la capa `presentation` de cada módulo, definiendo la forma exacta de lo que esa capa expone hacia el exterior del sistema, sin alterar la separación de capas ya establecida. |
| **ADR-02 — Orquestación de Capacidades y Agentes** | Los DTOs de respuesta deben construirse a partir de lo que devuelven los Orchestrators — nunca directamente de un Agent ni de sus capas internas. |
| **ADR-04 — Backend Agent Architecture** | ADR-04 formaliza qué es la "Agent API" (capa `presentation` de cada módulo). Este documento define un nivel adicional, más externo: la forma final que esa API adopta al cruzar la frontera HTTP hacia un consumidor. |
| **ADR-05 — Persistence Architecture & Data Layer** | Este documento reutiliza literalmente la separación de capas que ADR-05 §7, Decisión 3, ya estableció (Domain Entity vs. Persistence Entity), añadiendo una tercera capa explícita: el DTO de API (sección 7). |

**Nota:** la instrucción original de este Sprint refería a "ADR-01 Clean Architecture", "ADR-02 Agent Architecture" y "ADR-05 Persistence Foundation". Cito aquí los títulos exactos y vigentes de esos documentos para mantener la trazabilidad exigida por ADS-00 (Principio 3), e incorporo también ADR-04 por ser, en título y contenido, el más directamente relacionado con "Agent Architecture".

---

# 5. Contexto

La auditoría del Sprint 12 (Tarea 1 — Auditoría de contratos públicos) confirmó, con evidencia directa sobre el código actual, que AKVEZ expone estructuras internas sin ninguna capa de traducción:

- `/api/prospect/search` devuelve el arreglo `leads` producido internamente por Lead Analyzer, sin ningún DTO intermedio.
- `/api/prospect/outreach` recibe como `lead` el objeto `Prospect` completo del frontend, incluyendo campos que el servidor nunca utiliza.

Esto genera cuatro riesgos concretos, ya observados y no hipotéticos:

1. **Acoplamiento frontend-backend**: cualquier cambio en la forma interna de un `Prospect` (agregar, quitar o renombrar un campo) se propaga automáticamente al contrato HTTP, sin ningún punto de control intermedio.
2. **Exposición accidental de información interna**: el campo `debug.rawNames` de `/api/prospect/search` expone hoy, a cualquier usuario sin autenticación, la lista completa de negocios descubiertos —incluidos los descartados— revelando el panorama competitivo completo detrás de cada búsqueda (hallazgo Sprint 12, Tarea 1).
3. **Dificultad para evolucionar agentes**: al no existir un DTO propio por endpoint, cualquier cambio interno en Lead Analyzer o Pitch Generator (ej. agregar un campo de análisis nuevo) se refleja automáticamente en la respuesta pública, sin una decisión explícita de si ese campo debe exponerse.
4. **Dificultad para introducir persistencia**: las entidades de dominio creadas en el Sprint 11 (`Lead`, `LeadAnalysis`, `OutreachPitch`) no llevan identificador — hoy el `id` y `dateCreated` de cada lead los genera el propio navegador al recibir la respuesta, no el servidor. Sin un DTO de respuesta que declare explícitamente estos campos como responsabilidad del servidor, la integración de persistencia carece de un contrato claro que la fuerce a asignarlos.

---

# 6. Principio Fundamental

> **Los contratos externos de AKVEZ son una capa independiente. Ningún modelo interno de dominio, persistencia o inteligencia artificial debe exponerse directamente a consumidores externos.**

Este principio es vinculante para todo endpoint presente y futuro de AKVEZ, sin excepción.

---

# 7. Capas de Datos

## 7.1 Flujo de salida (dominio → cliente)

```text
Domain Model
    ↓
Application DTO
    ↓
API Response DTO
    ↓
Frontend
```

- **Domain Model**: la entidad de negocio pura (ej. `Lead`, `LeadAnalysis`, `OutreachPitch` del Sprint 11) — sin identificador, sin conocimiento de HTTP, IA ni almacenamiento (ADR-01, ADR-05 §9).
- **Application DTO**: la forma que usa un caso de uso para coordinar entre capas internas — puede incluir campos operativos (ej. `calculatedClassification` intermedio de Lead Analyzer) que no necesariamente cruzan la frontera del sistema.
- **API Response DTO**: la forma final y deliberada que efectivamente viaja por HTTP — resultado de aplicar la clasificación de la sección 8 sobre el Application DTO.
- **Frontend**: consumidor del API Response DTO — nunca del Domain Model ni del Application DTO directamente.

## 7.2 Flujo de entrada (persistencia → dominio)

```text
Database
    ↓
Persistence Entity
    ↓
Repository
    ↓
Domain Entity
```

Esta capa ya fue establecida formalmente en ADR-05 §7 (Decisión 1 y Decisión 3) y §9. Se cita aquí para dejar explícita la simetría: así como la persistencia nunca expone su modelo de almacenamiento directamente al dominio, el dominio nunca debe exponer su modelo directamente al exterior del sistema.

---

# 8. Clasificación de Información

Toda pieza de información que un endpoint de AKVEZ pueda llegar a exponer se clasifica en exactamente una de estas tres categorías.

## 8.1 Público

Información que el usuario del SaaS necesita recibir para operar el producto.

**Ejemplos confirmados hoy** (Sprint 12, Tarea 1): nombre del negocio, `website`, `score`, `classification`, `description`, `flaws`, `angle`, `revenueLoss`, `whyWebsiteNeeded`, `pitch.subjectLine`, `pitch.message`, `isFallback`.

## 8.2 Interno

Información necesaria para la operación del sistema, pero sin valor directo para el usuario final del producto.

**Ejemplos confirmados hoy**: `debug.totalReturned`, `debug.filteredOut`, `debug.passedFilter` (métricas de la búsqueda), `pitch.strategyExplanation` (generado por la IA pero nunca leído por el frontend), trazas de log, scoring intermedio antes del análisis final.

## 8.3 Sensible

Información que **nunca** debe exponerse a un consumidor externo, bajo ninguna circunstancia.

**Ejemplos confirmados hoy**: `debug.rawNames` (lista completa de negocios descubiertos, incluidos los descartados — hallazgo de mayor severidad del Sprint 12, Tarea 1). **Ejemplos estructurales, aplicables a todo el sistema**: información de infraestructura (nombres de variables de entorno, como ya ocurre hoy en el mensaje de error de `GOOGLE_PLACES_API_KEY`), claves y credenciales, configuración interna del servidor, prompts privados de IA (el prompt completo enviado a Gemini nunca debe formar parte de ninguna respuesta).

---

# 9. Reglas de Exposición

## Regla 1 — Nunca retornar objetos internos completos

Incorrecto:

```ts
return prospect;
```

Correcto:

```ts
return mapToLeadResponseDTO(prospect);
```

Ningún endpoint retornará jamás una entidad de dominio, una entidad de persistencia o la respuesta cruda de un proveedor de IA.

## Regla 2 — Cada endpoint tiene su propio DTO

No se reutilizarán directamente como contrato de respuesta:

- `Prospect`
- `PitchPayload`
- `LeadAnalysis`

Cada endpoint define su propio DTO de entrada y de salida, incluso si su contenido es parecido al de otro. La duplicación deliberada de forma es preferible al acoplamiento accidental entre endpoints distintos.

## Regla 3 — Los DTO evolucionan independientemente del dominio

Un cambio en una entidad de dominio (ej. agregar un campo a `Lead`) **no** debe reflejarse automáticamente en ningún DTO de API. Incorporar un campo nuevo al contrato público es siempre una decisión explícita, nunca un efecto colateral.

---

# 10. Contrato Actual vs. Futuro

| Endpoint | Actual | Futuro |
| --- | --- | --- |
| `POST /api/prospect/search` (response) | Arreglo `leads` = objetos `Prospect` internos de Lead Analyzer, sin transformación | `LeadResponseDTO[]` — solo campos clasificados como Público (sección 8.1); `debug` deja de viajar en el body HTTP |
| `POST /api/prospect/outreach` (request) | `lead` = objeto `Prospect` completo enviado por el frontend | `OutreachRequestDTO` — únicamente los campos que el servidor efectivamente usa (`name`, `description`, `flaws`, `revenueLoss`, `angle`) |
| `POST /api/prospect/outreach` (response) | `pitch` = `PitchPayload` interno completo | `OutreachResponseDTO` — `subjectLine`, `message`, `isFallback`; `strategyExplanation` se excluye del contrato público (sección 8.2) |
| Errores (ambos endpoints) | Dos formas inconsistentes: `{ error }` en validaciones 400, `{ success:false, error }` en errores 500 | Formato único, ver sección 11 |

---

# 11. Error Contract

Toda respuesta de error de la API seguirá, sin excepción, la siguiente forma:

```json
{
  "success": false,
  "error": {
    "code": "",
    "message": "",
    "details": {}
  }
}
```

## Catálogo oficial de códigos

| Código | Uso previsto |
| --- | --- |
| `VALIDATION_ERROR` | Datos de entrada faltantes o inválidos (ej. `industry`/`location` ausentes hoy en `/api/prospect/search`) |
| `NOT_FOUND` | El recurso solicitado no existe (aplicable una vez exista persistencia con identificadores de servidor, Sprint 11) |
| `UNAUTHORIZED` | El consumidor no está autenticado o no tiene permiso sobre el recurso (aplicable cuando exista autenticación, sección 13) |
| `AI_FAILURE` | Fallo del proveedor de IA que no pudo resolverse ni siquiera con el mecanismo de respaldo determinístico existente |
| `INTERNAL_ERROR` | Cualquier error no clasificado en las categorías anteriores |

Este catálogo es cerrado. Ampliarlo requiere una nueva versión de este documento (ADS-00, "Gobernanza Documental").

---

# 12. Versionamiento

Estrategia futura de versionamiento de rutas:

```text
/api/v1/prospect/search
/api/v1/prospect/outreach
```

**No se implementa en esta versión del documento ni en ningún Sprint actual.** Se documenta únicamente para que la introducción futura de un `/api/v2/...` no requiera una decisión arquitectónica nueva — la estrategia ya queda establecida.

---

# 13. Seguridad

- **Ningún campo `debug` se expondrá en producción** a través del contrato público — corrige directamente el hallazgo de mayor severidad del Sprint 12 (Tarea 1).
- **Separación por tenant (futura)**: cuando exista más de un usuario en AKVEZ, ningún DTO de respuesta podrá construirse sin verificar la pertenencia del recurso al usuario solicitante (ADR-05 §14, "Un usuario nunca puede acceder a información perteneciente a otro usuario").
- **Ownership mediante `userId`**: una vez exista el modelo `User` (ADR-05 §10), todo DTO de un recurso persistido deberá poder trazarse a su propietario.
- **Evitar fuga de información competitiva**: ningún DTO público incluirá listados completos de descubrimiento ni conteos de negocios descartados — es, en esencia, la regla general que generaliza el hallazgo de `rawNames`.

---

# 14. Compatibilidad Futura

La separación de capas de este documento (sección 7) debe permitir, sin rediseño arquitectónico, la incorporación de:

- **Aplicación móvil**: consume los mismos DTO de API Response que el frontend web actual, sin necesidad de conocer el modelo de dominio.
- **Marketplace**: un futuro marketplace de leads o de diseñadores puede consumir subconjuntos de los mismos DTO sin acceso a información Interna o Sensible.
- **API externa**: terceros integrando con AKVEZ reciben únicamente contratos Público, nunca estructuras internas — el principio fundamental (sección 6) se cumple igual para un consumidor externo que para el propio frontend.
- **Integraciones**: cualquier integración futura (CRM, email, scheduler — ADR-05 §13) consume los mismos DTO de dominio ya establecidos, sin depender de la forma interna de persistencia.

---

# 15. Decisiones Importantes

1. Los contratos externos de AKVEZ constituyen una capa independiente del dominio, la persistencia y la IA (sección 6).
2. Cada endpoint expone su propio DTO de request y de respuesta; no se reutilizan `Prospect`, `PitchPayload` ni `LeadAnalysis` directamente (sección 9, Regla 2).
3. Todo error de la API sigue el formato único `{ success:false, error:{ code, message, details } }` (sección 11).
4. El catálogo de códigos de error es cerrado y solo se amplía mediante una nueva versión de este documento.
5. Ningún campo clasificado como Sensible puede aparecer en ninguna respuesta pública, sin excepción (sección 8.3).
6. El versionamiento de rutas queda definido pero no se implementa hasta que exista una necesidad real de romper compatibilidad (sección 12).

---

# 16. Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Definir esta estrategia sin ejecutarla deja sin resolver la fuga activa de `debug.rawNames` | Alto | Priorizar un Sprint de implementación inmediatamente después de aprobar este documento |
| Los DTO se implementen de forma inconsistente entre los tres módulos (Lead Hunter, Lead Analyzer, Pitch Generator) | Medio | Revisión arquitectónica obligatoria antes de aprobar cada DTO nuevo (heredado de ADS-00, "Consistencia") |
| El catálogo de códigos de error resulte insuficiente en la práctica | Bajo | Está diseñado para ampliarse mediante nueva versión, no mediante excepciones ad hoc |
| La ubicación y clasificación documental de este archivo (sección "Nota de cumplimiento ADS-00" en la portada) genere confusión sobre su autoridad frente a los ADR existentes | Medio | Señalada explícitamente para revisión; no se resuelve por cuenta propia, conforme a ADS-00 |

---

# 17. KPIs

- 0 endpoints retornando un modelo de dominio, de persistencia o de IA sin transformar.
- 100% de las respuestas de error siguiendo el formato único de la sección 11.
- 0 campos clasificados como Sensible presentes en cualquier respuesta pública.
- 100% de los DTO de respuesta documentados antes de su implementación (Regla 2, sección 9).

---

# 18. Dependencias

Este documento depende de:

- ADR-01 — Arquitectura Modular Orientada al Dominio.
- ADR-02 — Orquestación de Capacidades y Agentes.
- ADR-04 — Backend Agent Architecture.
- ADR-05 — Persistence Architecture & Data Layer.
- ADS-00 — Documentation Standard.
- Informe de auditoría, Sprint 12 — Tarea 1 (Auditoría de contratos públicos).

Este documento habilita:

- La implementación de los DTOs descritos en la sección 10.
- El futuro versionamiento de la API (sección 12).
- La futura autenticación y separación multi-tenant (sección 13).

---

# 19. Glosario

**DTO (Data Transfer Object):** estructura de datos diseñada exclusivamente para transportar información a través de una frontera del sistema (ej. HTTP), independiente de cualquier modelo interno.

**Domain Model:** entidad de negocio pura, definida en la capa `domain` de un módulo (ADR-01).

**Contrato Público:** la forma exacta, documentada y estable de una request o response HTTP que AKVEZ expone a consumidores externos.

**Información Sensible:** cualquier dato que, de exponerse, comprometa la seguridad, la posición competitiva o la operación interna de AKVEZ.

---

# 20. Referencias

- ADR-01 — Arquitectura Modular Orientada al Dominio.
- ADR-02 — Orquestación de Capacidades y Agentes.
- ADR-04 — Backend Agent Architecture.
- ADR-05 — Persistence Architecture & Data Layer.
- ADS-00 — Documentation Standard.
- Sprint 12, Tarea 1 — Auditoría de contratos públicos (informe conversacional, sin documento formal asociado aún).

---

# 21. Anexos

No aplica.

---

# 22. Definition of Done

Este documento se considera finalizado cuando:

- Mantiene consistencia con ADR-01, ADR-02, ADR-04 y ADR-05.
- Cumple el estándar ADS-00 en estructura (con la excepción de clasificación/ubicación, señalada explícitamente en la portada para tu revisión).
- Define la clasificación completa de información y el contrato de error sin ambigüedad.
- No implementa código — es exclusivamente una estrategia.
- Ha sido revisado y aprobado formalmente por el Product Owner.

---

## Control de Calidad (AQS)

**Pendiente de evaluación.** Este documento fue redactado como propuesta técnica dentro de un Sprint de diseño de contratos; no corresponde autoevaluarlo con un puntaje AQS antes de su revisión y aprobación formal.

---

> **Nota de Gobernanza**
>
> Este documento se encuentra en estado **Draft**. No debe tratarse como decisión arquitectónica vinculante, ni usarse como base para implementar DTOs, hasta recibir aprobación formal explícita — incluyendo una resolución explícita sobre la observación de clasificación/ubicación documental señalada en la portada.
