# API DTO Catalog — AKVEZ

| Campo | Valor |
| --- | --- |
| Código | API-DTO-CATALOG |
| Estado | Draft |
| Fecha de creación | 2026-07-23 |
| Responsable | AKVEZ Architecture Team |
| Depende de | ADS-API-01 — API Contract Strategy · Sprint 12, Tarea 1 (Auditoría de contratos públicos) |

**Propósito.** Este documento es el catálogo de referencia de los DTO (Data Transfer Object) públicos de AKVEZ, aplicando las reglas ya definidas en ADS-API-01 (secciones 8 y 9) sobre los tres endpoints existentes. **Es diseño exclusivamente — no contiene ni implica implementación.** Ningún archivo de código fue creado ni modificado para producir este catálogo.

Cada DTO se presenta primero en la forma exacta que se aportó como base, y luego, cuando corresponde, extendido para ser consistente con la clasificación de campos ya aprobada en el Sprint 12 (Tarea 1). Toda extensión o desviación respecto a la forma original queda marcada explícitamente — no se asume nada en silencio.

---

## 1. `LeadResponseDTO`

### Forma base aportada

```ts
{
  id: string;
  name: string;
  website: string;
  score: number;
  opportunity: string;
  flaws: string[];
}
```

### Forma completa propuesta

```ts
interface LeadResponseDTO {
  id: string;
  name: string;
  website: string;
  googleMapsUrl: string;
  phone: string;
  rating: number;
  reviewCount: number;
  source: string;
  description: string;
  flaws: string[];
  opportunity: string;
  classification: string;
  revenueLoss: string;
  whyWebsiteNeeded: string;
  score: number;
}
```

### Notas de diseño

- **Campos agregados a la forma base**: `googleMapsUrl`, `phone`, `rating`, `reviewCount`, `source`, `description`, `classification`, `revenueLoss`, `whyWebsiteNeeded`. Los nueve están clasificados como **Público** en la auditoría del Sprint 12 (Tarea 1) y hoy los consume directamente `LeadCard.tsx` en el frontend. Si la intención era un contrato deliberadamente más reducido que el actual, dímelo explícitamente — tal como está, la forma base sola dejaría sin datos a buena parte de la tarjeta de lead que ya existe en producción.
- **`opportunity: string`** — no corresponde a ningún nombre de campo existente hoy. Lo interpreto como el reemplazo del campo interno `angle` ("Ángulo de Oportunidad para Diseñador"), porque es el único campo de texto libre que describe una oportunidad comercial. **Queda como interpretación, no como hecho confirmado.** Si es así, marco esto como un cambio de terminología deliberado de cara al DTO público — coherente con ADS-API-01 Regla 3 ("los DTO evolucionan independientemente del dominio") — pero entra en tensión con el principio de terminología única de ADS-00 ("un concepto tendrá un único nombre oficial"): internamente seguiría llamándose `angle` en `LeadAnalysis` (Sprint 11) y en el código del módulo Lead Analyzer, mientras que el contrato público lo llamaría `opportunity`. Recomiendo decidir y registrar explícitamente esta correspondencia antes de implementarla.
- **`id: string`** — este campo **no existe hoy en ninguna respuesta real del servidor**. Actualmente lo genera el propio navegador al recibir la respuesta (hallazgo del Sprint 12, Tarea 1). Incluirlo en este DTO es correcto de cara al futuro, pero **este DTO no puede implementarse tal cual hasta que la persistencia del Sprint 11 (`LeadRepository`) esté conectada a Lead Hunter/Lead Analyzer** — hoy no existe ningún punto del sistema que asigne un `id` de servidor.
- **Excluidos deliberadamente** (Interno, según ADS-API-01 §8.2, sin consumidor en el frontend hoy): `hasWebsite` (el frontend ya lo ignora, decide con una comprobación de texto sobre `website`).

---

## 2. `ReferenceDTO` (no definido explícitamente en la tarea, agregado por necesidad)

`SearchResponseDTO` depende de `ReferenceDTO[]`, pero no se aportó su forma. La completo con la que ya existe hoy en producción, sin cambios:

```ts
interface ReferenceDTO {
  title: string;
  url: string;
}
```

---

## 3. `SearchResponseDTO`

### Forma propuesta (idéntica a la aportada)

```ts
interface SearchResponseDTO {
  success: boolean;
  leads: LeadResponseDTO[];
  references: ReferenceDTO[];
}
```

### Notas de diseño

- **Confirmación positiva**: esta forma ya cumple la recomendación 3 de ADS-API-01 (sección 13) — no incluye `debug`. Corrige por diseño el hallazgo de mayor severidad del Sprint 12 (Tarea 1) (`debug.rawNames`).
- **`message` queda fuera del contrato**, consistente con el hallazgo de que su contenido real nunca se muestra al usuario hoy (Sprint 12, Tarea 1) — solo se usaba para detectar, mediante `.includes("Activado motor")`, si se había activado el motor de respaldo de búsqueda.
- **Riesgo abierto**: al quitar `message`, se pierde también esa señal de "motor de respaldo activo" en la búsqueda, y esta forma no la reemplaza por nada explícito. `OutreachResponseDTO` sí resuelve el caso equivalente para outreach con `metadata.isFallback` (booleano limpio). Recomiendo la misma solución aquí — por ejemplo `metadata: { usedFallbackEngine: boolean }` — para no perder esa información de cara al usuario sin decidirlo a propósito. No lo agregué a la forma propuesta porque no fue parte de lo aportado; lo dejo como recomendación explícita, no como hecho.
- **Caso "sin resultados"**: hoy el servidor responde con un mensaje distinto según si la búsqueda fue una ampliación (`excludeNames.length > 0`) o una búsqueda inicial. Sin `message`, este DTO no distingue ambos casos — el frontend tendría que decidirlo por su cuenta con la información que ya tiene localmente (lo cual, de hecho, ya es coherente con `EmptyState.tsx`, que hoy genera su propio texto y nunca leyó el `message` del servidor). No es una contradicción, pero vale la pena confirmarlo como decisión consciente.

---

## 4. `OutreachRequestDTO`

### Forma propuesta (idéntica a la aportada)

```ts
interface OutreachRequestDTO {
  leadId: string;
  channel: string;
  customInstructions?: string;
}
```

### Notas de diseño

- **Excelente corrección del sobre-envío**: reemplaza el objeto `Prospect` completo que hoy viaja como `lead` (hallazgo 3, Sprint 12 Tarea 1) por una simple referencia `leadId`. Es exactamente la recomendación 6 de ADS-API-01.
- **Dependencia dura, no implementable todavía**: igual que `LeadResponseDTO.id`, `leadId` solo tiene sentido si el lead referenciado ya fue persistido con un identificador de servidor — depende de conectar el Sprint 11.
- **Hallazgo funcional real — falta `designer`.** El generador de outreach de hoy necesita seis campos del perfil del diseñador (`name`, `style`, `skills`, `tone`, `caseStudies`, `targetNiche`) para construir el prompt — están interpolados directamente en `pitchGenerationAdapter.ts`. Esta forma de DTO no los incluye en ningún lado. Dos resoluciones posibles, ninguna decidida aquí:
  1. Agregar un objeto `designer` a este DTO, tal como se envía hoy.
  2. Asumir que el perfil del diseñador pasa a vivir del lado del servidor, asociado a un futuro usuario autenticado (`User`, ADR-05 §10) — pero el modelo `User` de ADR-05 no incluye hoy esos seis campos, así que esta opción requeriría antes una extensión de ese modelo, no solo de este DTO.
  
  Sin resolver esto, `OutreachRequestDTO` tal como está **no puede generar un pitch personalizado** — es el hallazgo más importante de este catálogo.

---

## 5. `OutreachResponseDTO`

### Forma propuesta (idéntica a la aportada)

```ts
interface OutreachResponseDTO {
  success: boolean;
  pitch: {
    subjectLine: string;
    message: string;
  };
  metadata: {
    isFallback: boolean;
  };
}
```

### Notas de diseño

- **Correcto y completo.** `strategyExplanation` queda fuera, consistente con el hallazgo de que el frontend lo recibe hoy pero nunca lo lee (Sprint 12, Tarea 1).
- **Mejora real sobre el comportamiento actual**: `metadata.isFallback` como booleano explícito reemplaza el mecanismo frágil de hoy, donde el frontend detecta el respaldo revisando si `pitchMessage` contiene la palabra `"respaldo"` como substring. Esta forma resuelve ese hallazgo de raíz.

---

## 6. `ErrorResponseDTO` (referenciado, no redefinido)

Todo DTO de respuesta anterior usa `success: boolean` como discriminante. El caso `success: false` ya tiene una forma oficial, definida en **ADS-API-01, sección 11** — no se repite aquí para no crear dos fuentes de verdad del mismo contrato (ADS-00, principio de Consistencia):

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

---

## 7. Tabla resumen — clasificación por campo (ADS-API-01 §8)

| DTO | Campo | Clasificación |
| --- | --- | --- |
| `LeadResponseDTO` | `id`, `name`, `website`, `googleMapsUrl`, `phone`, `rating`, `reviewCount`, `source`, `description`, `flaws`, `opportunity`, `classification`, `revenueLoss`, `whyWebsiteNeeded`, `score` | Público |
| `ReferenceDTO` | `title`, `url` | Público |
| `SearchResponseDTO` | `success`, `leads`, `references` | Público |
| `OutreachRequestDTO` | `leadId`, `channel`, `customInstructions` | Público (datos que el propio usuario aporta) |
| `OutreachResponseDTO` | `pitch.subjectLine`, `pitch.message`, `metadata.isFallback` | Público |
| `ErrorResponseDTO` | `error.code`, `error.message` | Público |
| `ErrorResponseDTO` | `error.details` | **Interno por defecto** — debe revisarse caso por caso antes de poblarlo; no debe contener trazas de stack ni información de infraestructura (ADS-API-01 §8.3) |

---

## 8. Hallazgos y decisiones pendientes (resumen)

1. **`opportunity`** — confirmar si reemplaza a `angle` tal como lo interpreté, o si se refiere a otra cosa.
2. **`designer` ausente de `OutreachRequestDTO`** — sin resolver esto, el DTO no es funcionalmente suficiente para generar un pitch hoy. Es el hallazgo más importante de este documento.
3. **Señal de "motor de respaldo" en búsqueda** — `SearchResponseDTO` no tiene equivalente a `metadata.isFallback` de outreach; recomendado pero no decidido.
4. **`id` y `leadId` no son implementables todavía** — ambos DTO dependen de conectar la persistencia del Sprint 11, que hoy sigue desconectada de los tres módulos existentes.
5. **`LeadResponseDTO` extendido más allá de la forma base aportada** — confirmar si la ampliación a los 15 campos es la intención, o si se buscaba deliberadamente un contrato más reducido que el actual.

## 9. Próximos pasos (no ejecutados en este documento)

- Resolver los 5 puntos de la sección 8.
- Decidir la ubicación física de los DTOs en el código (ej. `server/shared/dto/` o dentro de `presentation/` de cada módulo — no evaluado aquí, es una decisión de un Sprint de implementación).
- Recién entonces, crear los tipos TypeScript reales — **no se crea código en este documento**, conforme a la instrucción de esta tarea.
