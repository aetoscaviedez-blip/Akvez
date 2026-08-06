# COM-05 — Modelo de Hechos Afirmables · Propuesta Técnica

| Campo | Valor |
| --- | --- |
| Código | COM-05 |
| Clasificación | **Propuesta técnica** — no pertenece a la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Preliminar — no decide nada. No se ha escrito código** |
| Fecha | 2026-08-01 |
| Responsable | Ingeniería |
| Motivo | Sprint 05 · Fase 1 |
| Relacionado | COM-04 *(el problema)* · COM-03 · ADR-18 *(Draft)* |

> **Este documento contiene dos objeciones a la formulación del sprint.** Ambas se apoyan en documentos `Approved` y ambas cambian la forma del modelo, por lo que se exponen **antes** de la propuesta.

---

# 1. Objeción 1 — «Inferred Fact» no puede existir

## 1.1 Lo que dice el enunciado

El sprint propone tres conceptos: `Observed Fact`, **`Inferred Fact`** y `Unknown`, con el ejemplo *«Existe oportunidad de mejora digital»* para el segundo.

## 1.2 Lo que dice el Blueprint

| Fuente | Enunciado |
| --- | --- |
| **APS-18 §11.3, RE-2** | *«**Lo inferido no cruza al mensaje.** Puede decidir el enfoque; **nunca enunciarse como hecho**»* |
| **DDD-01 §8** | **Hecho afirmable** = *«conocimiento **Observado** que un contacto puede enunciar»* · *«**Solo lo Observado puede afirmarse; lo Inferido nunca**»* |
| **APS-19 §4.2** | La clase `Inferida` *«orienta la estrategia. **Nunca se afirma como hecho**»* |

**Un «hecho inferido» es, en el vocabulario de AKVEZ, una contradicción en los términos.** Y no es una objeción de estilo: el registro que este sprint construye se llama *de Hechos Afirmables*, y su función es alimentar la lista cerrada contra la que **el punto de control verifica**. **Un elemento inferido dentro de esa lista autoriza a afirmarlo** — exactamente lo que RE-2 prohíbe y lo que COM-04 identificó como riesgo crítico.

El ejemplo lo ilustra: *«existe oportunidad de mejora digital»* **no es constatable**. Es una lectura comercial, y su lugar es el `BuyerDiagnosis`, donde ya vive.

## 1.3 Propuesta

> **El registro contiene únicamente hechos observados. La categoría inferida no se le añade: ya existe, se llama `Inferida` y vive en el diagnóstico.**

**No se pierde nada.** Los tres estados que el sprint quiere distinguir ya están distinguidos por **APS-19 §4.2** con vocabulario aprobado:

| Enunciado del sprint | Concepto aprobado | Dónde vive hoy |
| --- | --- | --- |
| `Observed Fact` | **Observable** | ⬅️ **lo que este sprint construye** |
| `Inferred Fact` | **`Inferida`** — clase de conocimiento | `BuyerDiagnosis.variables[].knowledgeClass` |
| `Unknown` | **`Desconocida`** | Ídem |

**Introducir `FactType` con un valor `Inferred` crearía un vocabulario paralelo** al de `KnowledgeClass`, que es el modo de fallo que DDD-01 existe para evitar *(OBS-04)*.

---

# 2. Objeción 2 — el registro no puede persistirse como activo nuevo

## 2.1 Lo que dice el Blueprint

| Fuente | Enunciado |
| --- | --- |
| **DDD-01 §4.2** | Lista cerrada de hechos afirmables: *«**Se construye por emisión; no persiste aparte**»* |
| **ADR-15 §10.2 · RA-4** | *«La lista cerrada **se construye en el dominio** y ninguna capa la amplía»* |
| **ADR-13 §13.4 · D-6** | *«**Ningún evento no enumerado aquí podrá escribir en la Biblioteca**»* — el catálogo es cerrado |
| **AG-3** | Toda escritura pasa por un evento declarado |

## 2.2 La consecuencia

**Persistir los hechos como activo propio exigiría dos enmiendas a ADR-13**, que es `Approved`: un activo nuevo en §6.2 y un evento nuevo en §13.1. Y contradiría el enunciado literal de DDD-01 §4.2.

## 2.3 Propuesta

> **Los hechos se derivan, no se almacenan.**

Son una **proyección determinista de lo que ya está persistido**: los atributos de la Empresa **(A-2)** y el análisis **(A-4)**, ambos ya en la Biblioteca con su propio evento de escritura.

| Propiedad | Consecuencia |
| --- | --- |
| **No hay activo nuevo** | ADR-13 §6.2 intacto |
| **No hay evento nuevo** | §13.4 y D-6 se cumplen sin enmienda |
| **No hay repositorio nuevo** | La Fase 3 del sprint cambia de forma: ver §6 |
| **No hay desincronización posible** | Un hecho derivado no puede quedar obsoleto respecto de su origen |
| **La trazabilidad es estructural** | Cada hecho sabe de qué campo salió porque **se calcula a partir de él** |

> **Lo que el sprint pide —«una fuente confiable de hechos que GenerateProposal pueda usar»— se obtiene igual, y sin tocar el catálogo cerrado.** Lo que cambia es que la fuente es **una función pura del dominio**, no una tabla.

---

# 3. El modelo propuesto

Con las dos objeciones incorporadas.

## 3.1 `AffirmableFact` — ya existe

`domain/commercial/evidence.ts` ya lo declara, desde el Sprint 01:

```ts
export type AffirmableFact = string;
export type ClosedFactList = readonly AffirmableFact[];
```

**La propuesta es enriquecer el tipo, no crear uno paralelo.** Un hecho necesita declarar **de dónde salió** para que P-I4 sea verificable después.

## 3.2 Los cinco conceptos que el sprint nombra

| Concepto del sprint | Propuesta | Fundamento |
| --- | --- | --- |
| **`Fact`** | `AffirmableFact` — **enunciado + origen**. Solo observados | APS-18 §11.3 |
| **`FactType`** | ❌ **No se crea.** Todo lo del registro es observado; un tipo con un solo valor no informa | §1.3 |
| **`EvidenceSource`** | ✅ **Se crea.** De qué observación procede el hecho | Necesario para P-I4 |
| **`Confidence`** | ⚠️ **No por hecho.** Ver §3.4 | APS-19 §7 |
| **`MeasurementStatus`** | ✅ **Ya existe**, sin ese nombre. Ver §3.5 | APS-08 §11 |

## 3.3 `EvidenceSource` — la pieza que falta

> **De qué observación procede el hecho, en términos de dominio y sin nombrar proveedores** *(P-2 · ADR-11 §9 E-6)*.

Valores propuestos, todos correspondientes a observaciones que el sistema ya realiza:

| Valor | Qué acredita |
| --- | --- |
| `Atributo de la Empresa` | Dato del Registro: denominación, sitio web, teléfono, enlace público |
| `Reputación publicada` | Calificación y número de reseñas, tal como la fuente los publica |
| `Factor medido en la evaluación` | Un factor de `measuredFactors` — **APS-08 §11 declara qué se midió** |

**No se propone un valor para la prosa del analizador**, y esa ausencia es la decisión: `description`, `flaws`, `angle`, `revenueLoss` y `whyWebsiteNeeded` **no tienen origen que los acredite** *(COM-04 §4)*.

## 3.4 `Confidence` — por qué no va en el hecho

**APS-19 §7 sitúa la confianza en el diagnóstico completo, no en cada dato.** Y hay una razón de fondo: **un hecho observado no tiene grados**. O se constató o no se constató; si admitiera confianza parcial, dejaría de ser afirmable y sería una inferencia — de vuelta a la objeción 1.

> **`Confidence` por hecho sería el vehículo por el que una inferencia entraría al registro con una etiqueta de «baja confianza».** Se recomienda no introducirla.

## 3.5 `MeasurementStatus` — ya existe

`ScoreBreakdownEntry` ya distingue `measuredFactors` de `unmeasuredFactors`, porque **APS-08 §11 obliga a declarar la cobertura parcial**. Es exactamente un estado de medición, con autoridad y en producción. **Crear un tipo nuevo lo duplicaría.**

**Lo `unmeasured` es la fuente natural de lo `Desconocido`**, y **RE-3** exige declararlo, no disimularlo.

## 3.6 Forma propuesta

```text
AffirmableFact
  ├── statement : string          el enunciado, sin juicio (APS-19 §4.4)
  └── source    : EvidenceSource  de qué observación procede

ClosedFactList = readonly AffirmableFact[]
  └── construida por emisión, en domain/, y ninguna capa la amplía (RA-4)
```

**Sin identidad, sin ciclo de vida, sin persistencia propia.** Es un Value Object, como ya lo declara DDD-01 §4.2.

---

# 4. Qué del sistema actual se convierte en hecho

| Dato actual | Veredicto |
| --- | --- |
| `Lead.name` | ✅ Afirmable — `Atributo de la Empresa` |
| `Lead.website` · `LeadAnalysis.hasWebsite` | ✅ Afirmable |
| `Lead.phone` · `Lead.googleMapsUrl` | ✅ Afirmable |
| `Lead.rating` · `Lead.reviewCount` | ✅ Afirmable — `Reputación publicada` |
| `breakdown[].measuredFactors` | ✅ Afirmable — `Factor medido en la evaluación` |
| `breakdown[].unmeasuredFactors` | ⬜ **Desconocido explícito** — se declara, no se rellena *(RE-3)* |
| `classification` · `score` · `band` | 🟡 **Orienta, no afirma** — es lectura, no observación |
| `description` · `flaws` · `angle` · `revenueLoss` · `whyWebsiteNeeded` | ⛔ **Narrativa generativa. No afirmable** *(COM-04 §4)* |
| `Lead.source` | ⚠️ Afirmable como **Fuente** en términos de dominio, **nunca con el nombre del proveedor** *(ADR-11 §9 E-6)* |

> **`revenueLoss` merece mención aparte:** enuncia una pérdida económica que **ninguna medición sostiene**, y **CD-07** prohíbe inferir capacidad económica. Es el campo con más apariencia de dato y menos respaldo de todo el sistema.

---

# 5. Los criterios de aceptación, contra esta propuesta

| Criterio del sprint | Cómo lo cumple |
| --- | --- |
| `GenerateProposal` consume hechos sin leer narrativa libre | La derivación **no tiene acceso** a los campos narrativos: no hay `EvidenceSource` que los acredite |
| Cada afirmación tiene origen identificable | `EvidenceSource` por hecho |
| Lo desconocido permanece explícito | `unmeasuredFactors` se declara *(RE-3)* |
| No se inventan métricas económicas | `revenueLoss` queda fuera por construcción |
| Separación Observación → Diagnóstico → Hecho → Propuesta | Los hechos derivan de la **observación**, nunca del diagnóstico: son ramas hermanas, no consecutivas *(§7)* |

---

# 6. Consecuencia para la Fase 3 del sprint

**La Fase 3 pedía diseñar un contrato de repositorio. Si los hechos se derivan, no hay repositorio que diseñar** — y esa es la conclusión, no una omisión.

Lo que sí conviene, y se propone en su lugar:

1. **Una función pura de dominio** que derive la lista cerrada a partir de la observación disponible.
2. **Un contrato de comportamiento** para esa función, con el mismo rigor que las tres suites de repositorio ya existentes.
3. **Una prueba que verifique que ningún campo narrativo puede entrar**, que es la garantía que COM-04 R-1 pide y que ninguna otra capa protege.

---

# 7. Corrección al diagrama del sprint

El enunciado propone `Observación → Diagnóstico → Hecho → Propuesta`. **El hecho no deriva del diagnóstico:**

```text
                    Observación (A-2 · A-4)
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        BuyerDiagnosis          Hechos afirmables
        (lecturas Inferidas)    (solo Observado)
              │                       │
              │  orienta              │  sostiene
              └───────────┬───────────┘
                          ▼
                      Propuesta
```

**Son ramas hermanas de la misma observación, no una cadena.** Hacer que el hecho pase por el diagnóstico abriría exactamente la vía por la que una lectura inferida se convertiría en hecho — la objeción 1, por la puerta de atrás.

---

# 8. Cuestiones para el Product Office

1. **¿Se acepta que el registro contenga solo hechos observados** *(§1)*?
2. **¿Se acepta que se deriven en lugar de persistirse** *(§2)*? La alternativa exige enmendar ADR-13.
3. **¿Se confirma que los cinco campos narrativos no son afirmables** *(§4)*? Es la pregunta que COM-04 elevó y sigue abierta.
4. **¿`Lead.source` puede afirmarse**, y en qué términos, sin nombrar al proveedor?

---

# 9. Referencias

**ADR-11** §9 E-6 · **ADR-13** §6.2, §13.1, §13.4, D-6 · **ADR-15** §10.2, RA-4 · **ADR-16** P-I4 · **APS-08** §11 · **APS-18** §11.3, RE-1, RE-2, RE-3 · **APS-19** §4.2, §4.4, §7, CD-07 · **DDD-01** §4.2, §8, AG-3, OBS-04 · **COM-04**.
