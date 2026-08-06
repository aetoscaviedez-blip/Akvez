# REV-03 — Revisión de Consistencia Residual

| Campo | Valor |
| --- | --- |
| Código | REV-03 |
| Clasificación | Documento de Revisión (REV) |
| Versión | 1.0 |
| Estado | Approved |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad de referencia | PO-01 (Approved) |

> **Naturaleza del documento.** Inventario de evidencia. **No decide, no corrige y no reinterpreta nada.** Conforme a ADS-00 v1.2, la categoría REV tiene autoridad **consultiva** (orden 6). Ningún documento de los aquí listados ha sido modificado durante esta revisión.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Barrido completo del Blueprint en busca de residuos del modelo de dominio anterior a PO-01. | Sprint P1.3, alcance §3. Verificar que el cierre de la Fase 2 de PLAN-01 no deja definiciones derogadas activas. |

---

# 1. Objetivo

Localizar y clasificar, **sin corregirlos**, los residuos del modelo de dominio anterior a PO-01 que permanezcan en el Blueprint tras el cierre de la Fase 2 de PLAN-01.

# 2. Alcance

## 2.1 Patrones buscados

| # | Patrón |
| --- | --- |
| 1 | Definiciones antiguas de **Lead** |
| 2 | Definiciones antiguas de **Biblioteca de Leads** |
| 3 | Referencias a **Top N** |
| 4 | Referencias a **Lead Qualification** |
| 5 | Referencias a **Opportunity Threshold** |
| 6 | Referencias a **selección automática** |

## 2.2 Universo revisado

Todo `docs/` en formato Markdown: 17 APS · 12 ADR · 3 AF · ADS-00 · PO-01 · PLAN-01 · DP-01 · REV-01 · REV-02 · AR-01 · ATA-01 · INDEX · README · `docs/architecture/`.

## 2.3 Exclusiones justificadas

**Documentos consolidados.** PO-01, PLAN-01, ADS-00, APS-02, APS-03, APS-07, APS-08, ADR-02, ADR-05, ADR-10, ADR-10A y ADR-11 contienen los patrones buscados **únicamente dentro de bloques explícitos de derogación** («Definición derogada», «Criterio derogado», «Materia excluida»). Su presencia es deliberada y necesaria para la trazabilidad. **No constituyen hallazgo.**

**Registros históricos.** DP-01, REV-01, REV-02 y AR-01 citan literalmente las definiciones antiguas como **evidencia** de las contradicciones que documentaron. Alterarlas destruiría su valor probatorio. **No constituyen hallazgo de contenido**, aunque sí de marcado de estado (H-06).

---

# 3. Resultado

> **Ninguna definición derogada permanece activa en un documento normativo del Blueprint.**

Se identifican **siete hallazgos residuales**, ninguno de gravedad crítica. Cinco son de terminología o de gobernanza; dos afectan a la fase de implementación.

## 3.1 Cuadro resumen

| # | Hallazgo | Ubicación | Patrón | Gravedad |
| --- | --- | --- | --- | --- |
| **H-01** | La entidad de dominio del código se llama `Prospect`, no `Lead` | Código | 1 | **Alta** |
| **H-02** | Descripción de un filtrado previo a la entrega | ADR-07 §89 | 6 | Media |
| **H-03** | Definición de Opportunity Score sin alineación de dominio | APS-04 §586 (Glosario) | — | Media |
| **H-04** | Endpoints y DTO nombrados `prospect` | ADR-06, ADR-07, ADS-API-01, API-DTO-CATALOG | 1 | Media |
| **H-05** | «Descartar un lead» sin precisar que no es eliminación | APS-09 §9 | — | Baja |
| **H-06** | Registros de investigación sin marcado de estado histórico | DP-01, REV-01, REV-02, AR-01 | 1, 2 | **Alta** |
| **H-07** | Estados documentales fuera de la clasificación oficial | 7 documentos | — | Media |

---

# 4. Hallazgos detallados

## H-01 — La entidad de dominio del código se llama `Prospect`

**Ubicación exacta.**

- `src/shared/types/index.ts` — tipo `Prospect`
- `src/modules/lead-hunter/domain/prospectMapper.ts`
- `src/modules/lead-hunter/application/searchProspects.ts`
- `src/modules/lead-hunter/application/searchMoreProspects.ts`
- Citados en ADR-07 §200-§211 y ADR-04 §362

**Gravedad: Alta.** Es el residuo más relevante del inventario.

**Análisis.** ADS-00 (*Terminología*) exige que un concepto tenga **un único nombre oficial**. El nombre canónico de la entidad es **Lead** (PO-01 §2; APS-07 v2.0 §5). *Prospect* es una denominación alternativa no reconocida por el Blueprint, y arrastra además la semántica del modelo anterior: un *prospect* es un candidato pendiente de calificar, que es precisamente la noción que PO-01 §3 derogó.

**Propuesta de resolución.** Renombrar la entidad de dominio y sus artefactos derivados a `Lead` durante la Fase 5 (implementación). Está comprendido en el alcance ya enumerado en **PO-01 §9.3** («Caso de uso de descubrimiento», «Adaptador de persistencia de Leads»). No requiere decisión nueva.

**Advertencia.** El renombrado alcanza a la frontera pública (H-04) y debe planificarse conjuntamente con ella.

---

## H-02 — Descripción de un filtrado previo a la entrega

**Ubicación exacta.** `ADR-07 — Public Contract Boundary Consolidation.md`, §89.

**Texto.** «…`debug` con `rawNames`: los nombres crudos de todos los negocios encontrados **antes de filtrar**…»

**Gravedad: Media.**

**Análisis.** Describe el comportamiento **histórico** del sistema, en el contexto de una fuga de información ya corregida. No es una decisión ni una norma. Sin embargo, la expresión «antes de filtrar» presupone un filtrado que PO-01 §6 eliminó del dominio, y podría citarse erróneamente como evidencia de que el filtrado forma parte del diseño.

**Propuesta de resolución.** Añadir una nota aclaratoria en ADR-07 §89 indicando que el filtrado descrito corresponde al comportamiento anterior a PO-01 y que no representa el flujo vigente. **No modificar el texto original**, por tratarse de la descripción de un hallazgo de auditoría.

---

## H-03 — Definición de Opportunity Score sin alineación de dominio

**Ubicación exacta.** `APS-04 — Design System.md`, §586 (Glosario).

**Texto.** «**Opportunity Score:** Métrica numérica que indica la viabilidad comercial de un lead.»

**Gravedad: Media.**

**Análisis.** No contradice frontalmente a PO-01, pero omite las tres precisiones que APS-08 v1.1 §14 y APS-07 v2.0 §16 ya incorporan: que es un **atributo** y no un estadio, que su ausencia es un estado válido, y que no condiciona la existencia del Lead. Un glosario incompleto en un documento de diseño es la vía por la que la interfaz podría reintroducir un ocultamiento por puntuación.

**Propuesta de resolución.** Alinear el glosario de APS-04 con APS-08 v1.1 §14. Agrupar con la revisión de APS-04 que **ADR-11 §14 ya declaró necesaria** por otro motivo —la reversibilidad de los filtros de interfaz (ADR-11 §8.6)—. Ambas afectan al mismo documento y deben ejecutarse juntas.

---

## H-04 — Endpoints y DTO nombrados `prospect`

**Ubicación exacta.**

- `ADR-06 — Public API Contract Strategy.md` §67, §92, §137, §149, §162-163, §207
- `ADR-07 — Public Contract Boundary Consolidation.md` §89, §98, §108, §118, §172, §177-178
- `docs/architecture/ADS-API-01_API_Contract_Strategy.md` (Deprecated) §55, §111-112, §228-230, §269-270
- `docs/architecture/API-DTO-CATALOG.md` §111

**Gravedad: Media.**

**Análisis.** Afecta a rutas públicas (`/api/prospect/search`, `/api/prospect/outreach`) y a nombres de fichero de contrato (`prospectSearch.ts`). Es la manifestación de H-01 en la frontera pública. A diferencia de H-01, **su corrección no es puramente interna**: cambiar una ruta pública rompe compatibilidad con el frontend.

**Propuesta de resolución.** No corregir de forma aislada. Incorporar el renombrado a la estrategia de versionado que **ADR-06 §207 ya prevé** (`/api/v1/…`, documentada y no implementada). Es el único momento en que puede cambiarse sin ruptura.

**Observación.** El DTO de respuesta ya usa la terminología correcta (`LeadResponseDTO`, `data.leads`). La divergencia se concentra en la ruta y en los nombres de fichero, no en el contrato.

---

## H-05 — «Descartar un lead» sin precisar que no es eliminación

**Ubicación exacta.** `APS-09 — AI Decision Framework.md`, §9 (Supervisión Humana), línea 236.

**Texto.** «- descartar un lead;»

**Gravedad: Baja.**

**Análisis.** **No es una contradicción.** El descarte por decisión del usuario está expresamente previsto en APS-07 v2.0 §7 (etapa *Acción*), que precisa que se registra como conocimiento y **no** elimina el Lead de la Biblioteca. El contexto de APS-09 §9 —supervisión humana— es además el correcto.

Se registra únicamente porque el término aislado admite lectura como eliminación.

**Propuesta de resolución.** Opcional. Añadir la coletilla «— sin eliminarlo de la Biblioteca» con referencia a APS-07 v2.0 §7. Puede aplazarse indefinidamente sin riesgo.

---

## H-06 — Registros de investigación sin marcado de estado histórico

**Ubicación exacta.** `DP-01`, `REV-01`, `REV-02`, `AR-01`.

**Gravedad: Alta.**

**Análisis.** Los cuatro contienen literalmente las definiciones derogadas de Lead y de Biblioteca de Leads, así como conclusiones intermedias posteriormente refutadas —entre ellas el criterio de cualificación por banda y la premisa de que un Lead nace al analizarse—. Ninguno lleva en portada una advertencia de que su contenido fue sustituido por PO-01.

**Este hallazgo no es nuevo:** corresponde exactamente al riesgo **R-3** de PLAN-01 §6, calificado allí de severidad **Alta** y descrito como «el riesgo con mayor probabilidad de materializarse, porque son los documentos más detallados de la serie».

**Propuesta de resolución.** Ninguna acción adicional. Es el objeto íntegro de la **Fase 3 de PLAN-01**, ya planificada. Se registra aquí para confirmar que el riesgo sigue vivo y que la Fase 3 no debe aplazarse.

---

## H-07 — Estados documentales fuera de la clasificación oficial

**Ubicación exacta.**

| Documento | Estado declarado |
| --- | --- |
| AF-00 | `Fundacional` |
| AR-01 | `Cerrado` |
| REV-01 | `Informe` |
| REV-02 | `Informe` |
| ATA-01 | `Baseline` |
| ADR-05 | `Approved Draft` |
| ADR-11 *(referencia en PLAN-01 §2 y AR-01)* | `Suspendido (Needs Rewrite)` |

Además: **APS-01** declara `Draft` en portada y `APPROVED` en su sección AQS; **APS-04** declara `Approved` en portada y `Review` en la suya.

**Gravedad: Media.**

**Análisis.** ADS-00 (*Estados del Documento*) admite **exactamente cinco**: `Draft`, `Review`, `Approved`, `Deprecated`, `Archived`. Ninguno de los siete valores anteriores pertenece a esa lista. Las dos discrepancias portada/AQS son de la misma clase que la corregida en APS-03 v3.0.

**Nota.** El estado de este propio documento, `Informe`, incurre en el mismo defecto. Se ha conservado por coherencia con REV-01 y REV-02 y para no anticipar la normalización.

> **Actualización (Fase 4, 2026-07-29).** Corregido. Este documento pasa a `Approved`. REV-01 y REV-02 pasaron a `Archived` en la Fase 3. Los estados de **ADR-05, AF-00 y ATA-01** permanecen sin normalizar; su corrección requiere una decisión del Product Office y se detalla en el informe de la Fase 4.

**Propuesta de resolución.** Ninguna en este sprint. Materia ya **aplazada por decisión expresa del Product Office** a un sprint exclusivo de normalización documental. Debe abordarse junto con la deuda **DT-01** (ADR-10, nota de excepción): el ciclo de vida de `AF-01-DIAG-001` no admite transición desde `Draft` a un estado terminal, lo que condicionará cómo se normalicen varios de estos documentos.

---

# 5. Conclusión

**El dominio Empresa → Lead está consolidado.** Ningún documento normativo del Blueprint contiene una definición derogada de Lead ni de Biblioteca de Leads fuera de un bloque explícito de derogación. No se ha encontrado **ninguna** referencia activa a Top N, Lead Qualification, Opportunity Threshold ni selección automática.

Los siete hallazgos se distribuyen así:

| Destino | Hallazgos |
| --- | --- |
| **Fase 3 de PLAN-01** (ya planificada) | H-06 |
| **Fase 5 — Implementación** (PO-01 §9.3) | H-01, H-04 |
| **Revisión de APS-04** (ya exigida por ADR-11 §14) | H-03 |
| **Sprint de normalización documental** (aplazado por el Product Office) | H-07 |
| **Sin urgencia** | H-02, H-05 |

**Ningún hallazgo bloquea la entrada en fase de implementación.** H-01 y H-04 deberán resolverse **dentro** de ella, no antes.

---

# 6. Referencias

- **PO-01** — Decisión de Producto: Definición Canónica de Lead, §2, §3, §6, §7, §9.3.
- **PLAN-01** — Plan de Consolidación del Blueprint, §6 (R-3), §7 (Fases 3 y 5).
- **ADS-00 v1.2** — Documentation Standard: *Terminología*, *Estados del Documento*, *Jerarquía Documental*.
- **APS-04** §586 · **APS-07 v2.0** §5, §7, §16 · **APS-08 v1.1** §14 · **APS-09** §9.
- **ADR-06** §207 · **ADR-07** §89 · **ADR-10** (nota de excepción, DT-01) · **ADR-11** §8.6, §14.
- **AF-01** — Anexo A.1, `AF-01-DIAG-001`.
