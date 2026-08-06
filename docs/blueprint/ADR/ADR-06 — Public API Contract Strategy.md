# ADR-06 — Public API Contract Strategy

| Campo | Valor |
| --- | --- |
| Código | ADR-06 |
| Clasificación | Architecture Decision Record |
| Versión | 1.1 |
| Estado | Approved |
| Fecha de creación | 2026-07-23 |
| Última actualización | 2026-07-24 |
| Responsable | AKVEZ Architecture Team |
| Nivel de confidencialidad | Interno |

**Nota de sucesión documental:** este ADR formaliza y sustituye a `docs/architecture/ADS-API-01_API_Contract_Strategy.md`, cuya propia portada ya señalaba que el prefijo "ADS-API" no pertenece a la Clasificación Oficial de ADS-00 y que, por contenido, correspondía a la categoría ADR. Al crearse este ADR-06 con el mismo alcance, ADS-API-01 pasa a **Estado: Deprecated** (sección 22).

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-23 | Architecture Team | Creación inicial. Formaliza como ADR la estrategia de contratos públicos ya diseñada en ADS-API-01 y en el catálogo `API-DTO-CATALOG.md`, e incorpora las decisiones específicas de la Tarea 2 del Sprint 12 (retención temporal de `designer`, confirmación de `opportunity`, metadata extensible). | Corregir la clasificación documental señalada en ADS-API-01 y dejar vinculante la estrategia antes de crear `server/shared/contracts/`. |
| 1.1 | 2026-07-24 | Architecture Team | Cambio de estado Draft → Approved. Sin modificaciones al contenido decisional (secciones 1-22 permanecen intactas). | Sprint 12, Tareas 5, 6 y 7 ya implementaron y validaron en código de producción el contenido íntegro de este ADR; el Product Owner aprobó formalmente dicho trabajo en el cierre de Sprint 12, autorizando la actualización de estado. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Principio Fundamental
6. Capas de Datos
7. Clasificación de Información
8. Reglas de Exposición
9. Estructura de `server/shared/contracts/`
10. Contratos Definidos
11. Reglas de Aislamiento
12. Contrato de Errores
13. Versionamiento
14. Seguridad
15. Compatibilidad Futura
16. Decisiones Importantes
17. Riesgos
18. KPIs
19. Dependencias
20. Glosario
21. Referencias
22. Anexos
23. Definition of Done

---

# 1. Resumen Ejecutivo

AKVEZ expone hoy sus endpoints devolviendo estructuras internas del dominio sin ninguna capa de traducción (confirmado en la auditoría del Sprint 12, Tarea 1). Este ADR establece, de forma vinculante, que los contratos públicos de la API constituyen una capa arquitectónica independiente — con su propia carpeta, sus propias reglas de aislamiento y su propio ciclo de evolución — y define los contratos iniciales para los tres endpoints existentes.

---

# 2. Objetivo

Formalizar como decisión arquitectónica permanente:

- La separación entre modelos internos (dominio, persistencia, IA) y los contratos que AKVEZ expone externamente.
- La ubicación física y las reglas de aislamiento de dicha capa.
- Los contratos concretos para `/api/prospect/search` y `/api/prospect/outreach`.
- El formato único de error para toda la API.

---

# 3. Alcance

## Incluye

- La estrategia y el principio fundamental de contratos públicos.
- La estructura de `server/shared/contracts/` y sus reglas de aislamiento.
- La definición de los contratos `LeadResponseDTO`, `ReferenceDTO`, `SearchResponseDTO`, `OutreachRequestDTO`, `OutreachResponseDTO` y `ErrorResponseDTO`.

## No incluye

- La conexión de estos contratos a las rutas, handlers u Orchestrators existentes (Sprint futuro).
- La conexión a `server/shared/persistence/` (Sprint 11), que permanece desacoplada de esta capa hasta una decisión explícita posterior.
- Autenticación, `User` o perfiles de diseñador persistidos — quedan como fase futura (sección 15).

---

# 4. Contexto

Este ADR se apoya directamente en dos entregables previos del Sprint 12:

- **Tarea 1 — Auditoría de contratos públicos**: confirmó que `/api/prospect/search` devuelve el objeto interno de Lead Analyzer sin transformación, que `/api/prospect/outreach` recibe el `Prospect` completo del frontend, y que `debug.rawNames` constituye una fuga real de información competitiva sin control de acceso.
- **Tarea 2 — `API-DTO-CATALOG.md`**: propuso la forma concreta de cada contrato y dejó cinco decisiones pendientes. Este ADR resuelve esas decisiones de forma vinculante (sección 16).

---

# 5. Principio Fundamental

> **Los contratos externos de AKVEZ son una capa independiente. Ningún modelo interno de dominio, persistencia o inteligencia artificial debe exponerse directamente a consumidores externos.**

---

# 6. Capas de Datos

```text
Domain Entity
    ↓
Application Mapping
    ↓
Public Contract
    ↓
HTTP Response
```

- **Domain Entity**: la entidad de negocio pura (`Lead`, `LeadAnalysis`, `OutreachPitch` — Sprint 11), sin identificador ni conocimiento de HTTP.
- **Application Mapping**: la transformación (todavía no implementada) que traduce una o más entidades de dominio hacia un contrato público concreto.
- **Public Contract**: los DTO definidos en este ADR (sección 10) — independientes de dominio, aplicación, infraestructura y persistencia (sección 11).
- **HTTP Response**: la serialización final que efectivamente recibe el cliente.

---

# 7. Clasificación de Información

Se mantiene la clasificación de ADS-API-01 §8, ya aplicada en `API-DTO-CATALOG.md`:

- **Público**: todo campo presente en los contratos de la sección 10.
- **Interno**: métricas, trazas, scoring intermedio — nunca viajan en un contrato público.
- **Sensible**: `rawNames` y equivalentes — prohibidos explícitamente en cualquier contrato (Decisión Importante 5, sección 16).

---

# 8. Reglas de Exposición

Se heredan sin cambios de ADS-API-01 §9:

1. Ningún endpoint retorna un objeto interno completo.
2. Cada endpoint tiene su propio contrato — no se reutilizan `Prospect`, `PitchPayload` ni `LeadAnalysis` directamente.
3. Los contratos evolucionan independientemente del dominio.

---

# 9. Estructura de `server/shared/contracts/`

```text
server/
  shared/
    contracts/
      apiError.ts
      prospectSearch.ts
      outreachPitch.ts
```

Ubicación justificada: a diferencia de las entidades de dominio (`Lead`, `LeadAnalysis`, `OutreachPitch`), que sí pertenecen a su módulo dueño (Sprint 11, Decisión aprobada), un contrato público **no pertenece a un único módulo** — `SearchResponseDTO`, por ejemplo, compone la salida de Lead Hunter y Lead Analyzer en una sola forma HTTP. Por eso corresponde a `shared/`, siguiendo el mismo criterio ya usado para `shared/persistence/repositories/` (Sprint 11): es una capa transversal, no el concepto de negocio de un módulo específico.

---

# 10. Contratos Definidos

| Archivo | Contratos | Resumen |
| --- | --- | --- |
| `apiError.ts` | `ApiErrorCode`, `ApiError`, `ErrorResponseDTO` | Formato único de error para toda la API (sección 12). |
| `prospectSearch.ts` | `ReferenceDTO`, `LeadResponseDTO`, `SearchResponseMetadata`, `SearchResponseDTO`, `ProspectSearchResult` | Contrato de `/api/prospect/search`. |
| `outreachPitch.ts` | `DesignerProfileDTO`, `OutreachRequestDTO`, `OutreachPitchDTO`, `OutreachResponseMetadata`, `OutreachResponseDTO`, `OutreachPitchResult` | Contrato de `/api/prospect/outreach`. |

El contenido completo de cada archivo se muestra en el informe de implementación de esta misma tarea, no se duplica aquí para no crear una segunda fuente de verdad del mismo contrato (ADS-00, principio de Consistencia).

---

# 11. Reglas de Aislamiento

`server/shared/contracts/` no podrá importar, bajo ninguna circunstancia:

- `domain/`, `application/` ni `infrastructure/` de ningún módulo.
- `server/shared/persistence/` (ninguna de sus tres subcarpetas).
- Ningún SDK externo (`@google/genai`, `express`, etc.).
- Ningún módulo específico (`lead-hunter`, `lead-analyzer`, `pitch-generator`).

Dependencias permitidas exclusivamente:

- Tipos primitivos de TypeScript.
- Interfaces propias del mismo archivo.
- Otros contratos dentro de `shared/contracts/`, cuando exista una dependencia clara (ej. `prospectSearch.ts` y `outreachPitch.ts` importan `ErrorResponseDTO` desde `apiError.ts`).

---

# 12. Contrato de Errores

Formato único, sin variantes, para toda la API:

```ts
interface ErrorResponseDTO {
  success: false;
  error: {
    code: "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "AI_FAILURE" | "INTERNAL_ERROR";
    message: string;
    details: Record<string, unknown>;
  };
}
```

Catálogo cerrado de códigos (idéntico a ADS-API-01 §11) — ampliarlo requiere una nueva versión de este ADR.

---

# 13. Versionamiento

Sin cambios respecto a ADS-API-01 §12: se documenta la estrategia (`/api/v1/prospect/search`) sin implementarla todavía.

---

# 14. Seguridad

Sin cambios respecto a ADS-API-01 §13: ningún `debug` en producción, separación por tenant futura, ownership mediante `userId`, evitar fuga de información competitiva.

---

# 15. Compatibilidad Futura

Sin cambios respecto a ADS-API-01 §14: aplicación móvil, marketplace, API externa e integraciones consumen los mismos contratos definidos en la sección 10, sin conocer el modelo interno.

---

# 16. Decisiones Importantes

Resuelven, de forma vinculante, los cinco puntos que `API-DTO-CATALOG.md` había dejado abiertos:

1. **`opportunity` queda confirmado** como el nombre público del campo que internamente puede seguir llamándose `angle` en el dominio de Lead Analyzer. Es una traducción deliberada de terminología en la frontera del contrato (ADS-API-01 Regla 3), no un error de nomenclatura.
2. **`designer` se mantiene en `OutreachRequestDTO`** — no se elimina todavía. La autenticación y un futuro `User`/perfil persistido son una fase posterior; hasta entonces, el contrato debe seguir siendo funcionalmente suficiente para generar un pitch, tal como lo es el sistema actual.
3. **`SearchResponseDTO` permite `metadata` opcional y extensible** (ej. `usedFallbackEngine`), en vez de usar `message` como mecanismo de control — resuelve el hallazgo de `API-DTO-CATALOG.md` sección 3 sobre la señal de motor de respaldo perdida.
4. **`OutreachResponseDTO.metadata.isFallback`** es un booleano explícito — reemplaza el mecanismo actual de detectar el respaldo mediante un substring dentro de otro campo.
5. **Ningún contrato de esta capa incluye `debug`, `rawNames` ni ningún campo clasificado como Sensible** (sección 7) — regla sin excepciones.
6. **`id` en `LeadResponseDTO` y `leadId` en `OutreachRequestDTO`** quedan definidos como campos futuros asignados por el servidor; su implementación real depende de conectar `server/shared/persistence/` (Sprint 11), lo cual **no ocurre en este ADR**.

---

# 17. Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Los contratos queden definidos pero nunca se conecten a las rutas reales | Alto | Priorizar un Sprint de conexión inmediatamente después de aprobar este ADR |
| `designer` persista indefinidamente en el contrato de request en vez de migrar a un perfil de servidor | Medio | Revisar esta decisión explícitamente cuando exista `User` (ADR-05 §10) |
| Dos documentos (ADS-API-01 y este ADR) convivan con autoridad ambigua | Medio | Resuelto en este mismo ADR: ADS-API-01 pasa a Deprecated (sección 22) |

---

# 18. KPIs

- 0 imports de `domain/`, `infrastructure/`, `persistence/` o SDKs dentro de `shared/contracts/`.
- 100% de los contratos definidos en este ADR implementados exactamente como se especifican en la sección 10.
- 0 campos Sensibles presentes en cualquier contrato.

---

# 19. Dependencias

Depende de:

- ADR-01 — Arquitectura Modular Orientada al Dominio.
- ADR-02 — Orquestación de Capacidades y Agentes.
- ADR-04 — Backend Agent Architecture.
- ADR-05 — Persistence Architecture & Data Layer.
- ADS-00 — Documentation Standard.
- Sprint 12, Tarea 1 (auditoría) y Tarea 2 (`API-DTO-CATALOG.md`).

Impacta / habilita:

- La futura conexión de rutas y handlers a estos contratos.
- La futura conexión a `server/shared/persistence/`.
- El futuro versionamiento de la API.

---

# 20. Glosario

Se hereda el glosario de ADS-API-01 §19 (DTO, Domain Model, Contrato Público, Información Sensible) sin cambios.

---

# 21. Referencias

- ADR-01, ADR-02, ADR-04, ADR-05.
- ADS-00 — Documentation Standard.
- `docs/architecture/ADS-API-01_API_Contract_Strategy.md` (Deprecated por este ADR).
- `docs/architecture/API-DTO-CATALOG.md`.

---

# 22. Anexos

**Estado de `ADS-API-01_API_Contract_Strategy.md`**: pasa a **Deprecated** a partir de la aprobación de este ADR. Su contenido queda incorporado y superado por este documento; no debe usarse como referencia vigente (ADS-00, definición de estado "Deprecated": *"Documento reemplazado. No debe utilizarse."*).

---

# 23. Definition of Done

Este ADR se considera finalizado cuando:

- Mantiene consistencia con ADR-01, ADR-02, ADR-04 y ADR-05.
- Cumple el estándar ADS-00 en clasificación, estructura y ubicación (corrige la observación pendiente de ADS-API-01).
- Define los seis contratos de la sección 10 sin ambigüedad.
- Resuelve las cinco decisiones pendientes de `API-DTO-CATALOG.md` (sección 16).
- No implementa la conexión a rutas ni a persistencia — es exclusivamente la definición de contratos.
- Ha sido revisado y aprobado formalmente por el Product Owner.

---

## Control de Calidad (AQS)

**Pendiente de evaluación**, consistente con el criterio ya aplicado a ADR-04 v1.0 y a ADS-API-01: no corresponde autoevaluar un documento propio antes de su revisión formal.

---

> **Nota de Gobernanza**
>
> Este ADR se encuentra en estado **Approved** (v1.1, 2026-07-24). Constituye una decisión arquitectónica permanente conforme a ADS-00. Su contenido decisional (secciones 1-22) no fue modificado respecto a la versión 1.0 — la aprobación formaliza lo que ya estaba implementado y validado en producción (Sprint 12, Tareas 5, 6 y 7; ver ADR-07).
