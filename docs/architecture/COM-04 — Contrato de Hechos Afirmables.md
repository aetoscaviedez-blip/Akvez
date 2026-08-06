# COM-04 — Contrato de Hechos Afirmables

| Campo | Valor |
| --- | --- |
| Código | COM-04 |
| Clasificación | **Análisis técnico** — no pertenece a la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Preliminar — no decide nada** |
| Fecha | 2026-08-01 |
| Responsable | Ingeniería |
| Motivo | Sprint 04 · Fase 3, Entregable 2 |
| Relacionado | COM-03 · ADR-18 *(Draft)* |

> **Este documento no decide. Clasifica lo que el Blueprint ya declara y reporta una contradicción entre esa declaración y el código actual.**
>
> La autoridad de la Regla de Evidencia es **APS-18 §11**; la de las clases de conocimiento, **APS-19 §4.2**; la de la lista cerrada, **ADR-15 §10.2**. Donde este documento y una de ellas discrepen, **prevalece la autoridad**.

---

# 1. La pregunta que resuelve

`GenerateProposal` debe construir una **lista cerrada de hechos afirmables** y verificar el texto contra ella *(ADR-15 §10 · P-I4)*. La pregunta previa es: **¿qué información del sistema puede entrar en esa lista?**

**No es una cuestión de estilo.** **P-I4** exige que ninguna afirmación de una `Proposal` carezca de evidencia en la lista, y **RE-1** que el redactor no pueda salir de ella. Si la lista se llena con material que no es un hecho observado, **el punto de control valida contra una mentira** y toda la Línea de Decisión se vuelve decorativa.

---

# 2. Las tres clases — transcritas de APS-19 §4.2 y APS-18 §11.2

| Clase | Qué es | **Qué autoriza** | Qué prohíbe |
| --- | --- | --- | --- |
| **Observable** | Valor establecido por un **hecho constatado**: un dato público inequívoco o **una manifestación del comprador** | **Puede afirmarse** en un contacto | — |
| **Inferida** | Lectura comercial construida sobre indicios | **Orienta la estrategia** | **Nunca se afirma como hecho** *(RE-2)* |
| **Desconocida** | Ni constatada ni inferible | **Puede reconocerse abiertamente** *(RE-3)* | **Nunca se rellena** |

> **APS-19 §4.3 — antes de cualquier contacto, ninguna variable del diagnóstico puede ser `Observable`**: no existe manifestación alguna. **Ninguna lectura del diagnóstico entra en la lista de hechos afirmables antes del primer contacto.**

---

# 3. Clasificación del material que el sistema produce hoy

## 3.1 Permitido afirmar — hechos constatados

Proceden del **descubrimiento** y son atributos observados, no interpretaciones:

| Dato | Origen | Por qué es afirmable |
| --- | --- | --- |
| Denominación del negocio | `Lead.name` | Dato público inequívoco |
| **Existencia o ausencia de sitio web propio** | `Lead.website` · `LeadAnalysis.hasWebsite` | Constatable por cualquiera |
| Dirección del sitio, si existe | `Lead.website` | Ídem |
| **Reputación visible** — calificación y número de reseñas | `Lead.rating` · `Lead.reviewCount` | Publicado por la fuente |
| Presencia de teléfono público | `Lead.phone` | Ídem |
| **Fuente en la que se encontró** | `Lead.source` | Hecho del descubrimiento |
| **Factores efectivamente medidos** | `ScoreBreakdownEntry.measuredFactors` | **Declaración explícita de qué se midió** *(APS-08 §11)* |

> ⚠️ **Afirmable no significa oportuno.** Que un dato pueda enunciarse no obliga a enunciarlo, y **APS-19 §4.4** prohíbe convertir un hecho en un juicio: *«el sitio no se actualiza desde hace tiempo»* es afirmable; *«su web está descuidada»* ya es una valoración.

## 3.2 Permitido como inferencia — orienta, nunca se enuncia

| Material | Origen | Qué autoriza |
| --- | --- | --- |
| Las **siete variables** del diagnóstico | `BuyerDiagnosis` | **Elegir** objetivo, enfoque y barrera |
| El **Commercial State (BD-1)** | Variable BD-1 | **Elegir el punto de entrada** |
| La **clasificación** del activo digital | `LeadAnalysis.classification` | Orientar el enfoque |
| El **Opportunity Score** y su banda | `LeadAnalysis.score` · `band` | **Priorizar**, nunca afirmar *(PO-01 §5)* |

> **RE-2 es la frontera:** *«lo inferido puede decidir el enfoque; nunca enunciarse como hecho»*. Y **APS-19 §4.4** lo blinda con una **prohibición absoluta**: el sistema **nunca** afirma que un negocio *teme*, *desconfía*, *ignora*, *se resiste* ni *está frustrado*.

## 3.3 Prohibido afirmar

| Prohibido | Fuente de la prohibición |
| --- | --- |
| **Pérdidas económicas** — «pierde X clientes al mes» | No medido. **APS-19 §6.5 · CD-07**: prohibido inferir capacidad económica o disposición a pagar |
| **Métricas no calculadas** — tráfico, conversión, posicionamiento | No observadas por AKVEZ |
| **Problemas no observados** | RE-1: la lista es cerrada |
| **Estados internos** — teme, desconfía, ignora | **APS-19 §4.4**, prohibición absoluta |
| **Comparaciones con competidores concretos** | No observadas |
| **Datos personales de terceros** | **RC-11 · APS-19 §4.5** |
| **Lo visto en el canal de contacto** | **APS-20 §3.2**: contactar por Instagram **no autoriza** a afirmar nada visto allí |
| **Urgencia temporal** cuando BD-2 es `Desconocida` | **CD-17** |

---

# 4. El hallazgo — el análisis actual no produce hechos afirmables

**Es la conclusión operativa de este documento y afecta directamente al Sprint 05.**

El Lead Analyzer persiste hoy, en `LeadAnalysis`:

```
description · flaws · angle · revenueLoss · whyWebsiteNeeded · classification
```

**Los cinco primeros son prosa redactada por un modelo generativo**, no hechos constatados. Se producen en `leadAnalysisAdapter.ts`, cuyo prompt pide literalmente *«genera un estudio de consultoría personalizado»*, e incluye instrucciones como *«explica cómo pierden clientes»* y *«detalla la pérdida financiera de forma empática»*.

**Consecuencia directa:** si esa prosa alimentase la lista cerrada, `GenerateProposal` estaría **afirmando como hecho lo que otro modelo dedujo**, incumpliendo a la vez:

- **RE-1**, porque la lista dejaría de ser cerrada y verificable;
- **RE-2**, porque lo inferido cruzaría al mensaje;
- **P-I4**, porque la afirmación no tendría evidencia real detrás;
- **APS-19 §6.5 y CD-07**, en el caso concreto de `revenueLoss`, que enuncia pérdidas económicas nunca medidas.

> **`revenueLoss` es el caso más claro y el más peligroso.** Es un campo que el sistema ya persiste, que suena a dato y que **ninguna medición sostiene**.

## 4.1 Lo que sí existe y sirve

**`ScoreBreakdownEntry.measuredFactors`** es, hoy, **el único material legible por máquina que declara qué se midió realmente**, frente a `unmeasuredFactors`. Es la semilla natural de la lista cerrada y **no hubo que inventarlo**: existe porque APS-08 §11 obliga a declarar la cobertura parcial del análisis.

---

# 5. La frontera, explícita

```text
  Lead Hunter                    ← descubre y registra. Produce ATRIBUTOS OBSERVADOS
        │
        ▼
  Lead Analyzer                  ← mide y puntúa
        │  ├─ measuredFactors ──────────────►  AFIRMABLE
        │  ├─ score · band · classification ─►  ORIENTA (nunca se afirma)
        │  └─ description, flaws, angle,
        │     revenueLoss, whyWebsiteNeeded ─►  ⛔ PROSA GENERATIVA — no afirmable
        ▼
  BuyerDiagnosis                 ← lee indicios. Sus siete variables ORIENTAN
        │                           Ninguna es Observable antes del 1.er contacto
        ▼
  Perfil de Estrategia (SP-nn)   ← el criterio. NO aporta evidencia
        │
        ▼
  Commercial Strategy            ← decide. Su base de evidencia sale de ARRIBA,
        │                           nunca del Perfil ni del redactor
        ▼
  Lista cerrada ────────────────►  el modelo redacta CON ella
        │
        ▼
  Punto de control               ← el dominio verifica CONTRA ella. Si no supera, REHACE
```

**Dos reglas que el diagrama hace visibles:**

**RA-4 — la lista se construye en el dominio y ninguna capa la amplía.** Ni el adapter, ni el canal *(APS-20 §3.2)*, ni el Perfil.

**El Perfil de Estrategia no aporta ni un solo hecho.** Decide **cómo** se aborda, nunca **qué es cierto** *(APS-18 §8.4)*.

---

# 6. Riesgos

| # | Riesgo | Severidad |
| --- | --- | --- |
| **R-1** | **Que la lista cerrada se alimente de la prosa del analizador.** Es el camino de menor resistencia —los campos existen y suenan a datos— y **vaciaría la Regla de Evidencia sin romper ninguna prueba** | 🔴 **Crítica** |
| **R-2** | **Que `revenueLoss` llegue a un mensaje.** Enuncia una pérdida económica que nadie midió | 🔴 **Crítica** |
| **R-3** | Que el punto de control se implemente como filtro con advertencia en lugar de rehacer *(ADR-15 §10)* | Alta |
| **R-4** | Que la lista se construya en `infrastructure/` por comodidad, donde ampliarla no lo revisa nadie | Alta |

---

# 7. Cuestiones que exceden a este documento

1. **¿Debe el Lead Analyzer producir una lista de hechos observados**, además de su análisis narrativo? Es **decisión de APS-08 y APS-19**, no de implementación. **Sin ella, `GenerateProposal` no puede cumplir P-I4.**
2. **¿Qué ocurre con los campos narrativos ya persistidos?** Siguen siendo útiles para la interfaz; la decisión es **si pueden o no alimentar un contacto**.
3. **¿`measuredFactors` es suficiente** como lista cerrada inicial, o necesita enriquecerse con los atributos observados del Lead?

---

# 8. Recomendación

1. **Elevar la cuestión 1 al Product Office antes de abrir el Sprint 05.** Es el bloqueo real de `GenerateProposal`, y **el ADR del Perfil de Estrategia no lo resuelve**: son dos problemas distintos que se han venido tratando como uno.
2. **Declarar explícitamente no afirmables** los cinco campos narrativos, para que ninguna implementación posterior los tome por hechos.
3. **Partir de `measuredFactors` más los atributos observados del Lead** como lista cerrada inicial.

---

# 9. Referencias

**ADR-15** §10, §10.2, RA-4 · **ADR-16** §4.4, P-I4, RC-11 · **APS-08** §11 · **APS-18** §8.4, §11.1, §11.2, §11.3, RE-1, RE-2, RE-3 · **APS-19** §4.2, §4.3, §4.4, §4.5, §6.5, CD-07, CD-17 · **APS-20** §3.2 · **PO-01** §5 · **DDD-01** §4.2 · **COM-03** · **ADR-18** *(Draft)*.
