# COM-03 — Perfil de Estrategia · Análisis Técnico Preliminar

| Campo | Valor |
| --- | --- |
| Código | COM-03 |
| Clasificación | **Análisis técnico preliminar** — no pertenece a la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Preliminar — no decide nada** |
| Fecha | 2026-08-01 |
| Responsable | Ingeniería |
| Motivo | Sprint 04 · Fase 2.3. Preparar las condiciones de `GenerateProposal` |
| Ubicación | `docs/architecture/`, junto a ARCH-01 y COM-02 |

> ## Nota de cumplimiento
>
> **Este documento no decide. Analiza y propone.**
>
> **ADR-15 §7.4 declara que el Perfil de Estrategia exige un ADR propio**, y su gobernanza está **`Pospuesta`**. Ese ADR corresponde al Product Office y al Architecture Team, no a ingeniería.
>
> Se emite en `docs/architecture/` y **no en `docs/blueprint/ADR/`** deliberadamente: asignar un código oficial es un acto de gobernanza. Cuando el Product Office lo convoque, este material puede servirle de insumo.
>
> **Ninguna afirmación de aquí obliga a nadie.** Donde el Blueprint ya decide, se cita; donde no, se marca como **cuestión abierta**.

---

# 1. Por qué existe este documento

`GenerateProposal` es el único caso de uso comercial que **atraviesa la Línea de Decisión** *(ADR-16 §7)*, y el único cuya reproducibilidad depende de un artefacto que **todavía no existe**.

Hoy el sistema emite dos entidades —`BuyerDiagnosis` y `CommercialSequence`— y ambas conservan `criteriaVersion` con el valor `SIN-PERFIL-DE-ESTRATEGIA`, una **ausencia declarada**. Funciona porque ninguna de las dos *deriva* del criterio: el diagnóstico lee indicios y la secuencia lee canales.

**Con la propuesta deja de funcionar.** ADR-15 §7.2 exige que la estrategia sea determinista *«dado el mismo diagnóstico, el mismo estado y la misma versión del Perfil de Estrategia»*. Sin Perfil no hay tercera variable, y sin ella **la estrategia no es reproducible ni explicable** — que es, literalmente, su razón de ser.

---

# 2. Identidad — qué es la Commercial Strategy

## 2.1 Lo que ya está decidido, y no es cuestión abierta

| Pregunta | Respuesta | Autoridad |
| --- | --- | --- |
| ¿Es una entidad? | **No** | ADR-16 §4 define cinco y no la incluye |
| ¿Es un Aggregate Root? | **No** | DDD-01 §5.2 fija cinco raíces; no está |
| ¿Es un Value Object? | **Sí** | DDD-01 §4.2 · §3.6 |
| ¿Tiene identidad propia? | **No** | DDD-01 §3.6 |
| ¿Se persiste por separado? | **No.** Vive dentro de `Proposal` y, por contacto, dentro de `CommercialSequence` | ARCH-01 §3 · ADR-16 §4.3, §4.4 |
| ¿Algún evento la escribe? | **No** | DDD-01 §3.6 · catálogo de ADR-13 §13.1 |
| ¿Tiene ciclo de vida? | **No propio.** Es inmutable dentro de la emisión que la contiene | SC-R1 · P-I2 |

> **La pregunta «¿Value Object o Aggregate?» está cerrada desde DDD-01, y reabrirla sería un defecto.** OBS-02 registra que el enunciado original del sprint la listaba entre las entidades, y por qué no lo es.

## 2.2 La distinción que sí importa, y que se confunde con facilidad

**`Commercial Strategy` y `Perfil de Estrategia` son dos cosas distintas.**

| | **Commercial Strategy** | **Perfil de Estrategia** |
| --- | --- | --- |
| Qué es | Las decisiones que gobiernan **un** contacto | El **criterio** que produce esas decisiones |
| Alcance | Una emisión | Todo el sistema |
| Owner | Pitch Generator | **Product Office** |
| Naturaleza | Value Object dentro de `Proposal` | **Artefacto versionado e inmutable en caliente** |
| Autoridad | APS-18 §8 | **ADR-15 §7.4 — ⏸️ `Pospuesta`** |
| Analogía exacta | El desglose de un Opportunity Score | **El Perfil de Ponderación WP-01** |

**La analogía de la última fila es la clave de todo este documento** y se desarrolla en §5.

---

# 3. Reproducibilidad — el problema de `criteriaVersion`

## 3.1 Qué exige el Blueprint

**RC-13** — *«toda entidad emitida conserva la versión del criterio que la produjo»*. **RA-7** de ADR-15 §7.4 — *«consumirlo y vincular a él toda estrategia emitida»*.

El fundamento está enunciado en DDD-01 §4.2: *«sin ella, una decisión conservada no puede reproducirse»*.

## 3.2 Estado actual, y por qué es honesto pero terminal

```ts
export const CRITERIA_VERSION_ABSENT = "SIN-PERFIL-DE-ESTRATEGIA";
```

Se eligió declarar la ausencia en lugar de fabricar una versión porque inventar `"v1"` sería *«un valor por defecto que sustituye a un dato que no existe»* — prohibido por **R-38 · RC-10 · BD-R2**— y produciría **apariencia de trazabilidad sin trazabilidad**, exactamente lo que RC-13 existe para impedir.

**Es correcto hoy y deja de serlo con `GenerateProposal`**, por la razón de §1.

## 3.3 Las tres preguntas, respondidas

| Pregunta | Respuesta propuesta |
| --- | --- |
| **¿Quién genera la versión?** | **El Product Office**, al aprobar cada revisión del Perfil. **No la genera el código**: un identificador que el sistema se asigna a sí mismo no acredita ninguna decisión de gobierno. Es lo que ADR-14 §8.1 hace con el Perfil de Ponderación |
| **¿Quién la consume?** | **Dos consumidores, con propósitos distintos.** El *dominio*, para producir la estrategia de forma determinista; y *quien audita después*, para reconstruir por qué se decidió lo que se decidió. El primero la lee; el segundo la lee **desde la entidad emitida**, no desde el Perfil vigente — por eso viaja con cada emisión y no se resuelve por referencia |
| **¿Cuándo deja de ser ausencia declarada?** | **Cuando exista una primera versión aprobada del Perfil**, no cuando exista el ADR. El ADR decide **qué es** el Perfil y **quién lo cambia**; la primera versión es un acto posterior, igual que WP-01 lo fue respecto de ADR-14 |

## 3.4 Migración de lo ya emitido

Las emisiones actuales llevan `SIN-PERFIL-DE-ESTRATEGIA` y **son localizables por búsqueda exacta**, que fue el motivo de elegir un marcador y no una cadena vacía.

**Cuestión abierta:** ¿qué se hace con ellas cuando exista la primera versión? Dos posturas, ninguna decidida aquí:

- **No migrar.** Se emitieron sin criterio versionado y eso es un hecho histórico. Reetiquetarlas afirmaría que se produjeron bajo un criterio que no existía — una falsedad, y **ADR-13 §10.2 prohíbe destruir conocimiento**, incluido el conocimiento de que algo se hizo sin criterio.
- **Migrar declarando el reetiquetado**, conservando la marca original.

**La primera parece más coherente con RC-13 y con AF-00 Principio 2**, pero es decisión del Product Office.

---

# 4. Qué necesita `GenerateProposal`

## 4.1 El reparto que ADR-16 §7 ya fija

| Capa | Qué le corresponde en `GenerateProposal` |
| --- | --- |
| `domain/` | La **estrategia** · la **lista cerrada** · **el punto de control** |
| `application/` | Encadena estrategia → redacción → verificación; **rehace si no supera el control** |
| `infrastructure/` | **Redacción generativa** · persistencia de A-6 |

## 4.2 Las cuatro fuentes de entrada

| Fuente | Qué aporta | De dónde sale hoy |
| --- | --- | --- |
| **`BuyerDiagnosis` vigente** | Las siete variables con su clase, sus indicios, el **Commercial State (BD-1)** y la confianza declarada | ✅ Existe. `BuyerDiagnosisRepository.findCurrentByLeadId` |
| **`CommercialSequence`** | El **momento vigente**, el **hilo que dejó planteado** el contacto anterior y qué aportaron los anteriores — necesario para **SC-R3**: ningún contacto repite al anterior | ✅ Existe. `CommercialSequenceRepository` |
| **Perfil de Estrategia** | El **criterio**: cómo se traduce *(diagnóstico + momento)* en objetivo, barrera, emoción y enfoque | 🔴 **No existe** |
| **Lista cerrada de hechos afirmables** | Lo único que el texto puede afirmar | 🔴 **No existe productor.** Ver §6, riesgo R-2 |

## 4.3 Qué aporta exactamente el Perfil, y qué no

De los diez contenidos de una `Commercial Strategy` *(APS-18 §8.1)*, **el Perfil no produce ninguno directamente: produce la regla que los determina.**

| Contenido de la estrategia | Lo determina | Papel del Perfil |
| --- | --- | --- |
| **Objetivo** *(Micro-Yes)* | El momento y el estado | El Perfil fija **la correspondencia** |
| **Barrera** | El momento | APS-18 §9.2 ya la tabula; el Perfil podría **matizarla** por diagnóstico |
| **Base de evidencia** | El análisis | **Ninguno.** RE-1 · RA-4 |
| **Enfoque** | La identidad profesional *(BD-7)* | El Perfil fija **la correspondencia** |
| **Emoción legítima** | Conjunto cerrado de APS-18 §8.5 | **Ninguno.** La exclusión es normativa |
| **Hilos** | El contacto anterior | **Ninguno.** Es memoria de la secuencia |
| **Elemento de relevancia** | Lo no dicho aún | **Ninguno** |
| **Canal y momento** | La secuencia y APS-20 §7 | **Ninguno** |
| **Resultado esperado** | El objetivo | El Perfil fija **la forma observable** |

> **Conclusión operativa: el Perfil es una tabla de correspondencias versionada, no un contenedor de datos.** Es lo que lo hace pequeño, auditable y comparable entre versiones — y lo que justifica que se versione en lugar de configurarse.

---

# 5. La propuesta central — ADR-14 como plantilla

**El problema ya se resolvió una vez en AKVEZ, para el Opportunity Score.**

| Aspecto | Perfil de Ponderación *(resuelto)* | Perfil de Estrategia *(pendiente)* |
| --- | --- | --- |
| Qué gobierna | El cálculo del Score | El criterio comercial |
| Autoridad | **ADR-14** | **ADR pendiente** |
| Versión vigente | **WP-01** | — |
| Quién puede cambiarlo | **Product Office** *(ADR-14 §8.1)* | **Product Office** *(ADR-15 §7.4)* |
| Vinculación a la emisión | **R-VIN** · V-4 de ADR-13 §10.3 | **RC-13 · RA-7** |
| Sinónimos prohibidos | `Pesos`, `Weights` | `Configuración`, `Parámetros` |
| Recalculabilidad | ADR-14 §6.3 | Determinismo de ADR-15 §7.2 |

**Las siete filas se corresponden una a una.** Redactar el ADR del Perfil de Estrategia sobre la estructura de ADR-14 —cambiando el objeto gobernado— produciría un documento coherente con el Blueprint por construcción, y **reduciría el riesgo de introducir un vocabulario paralelo**, que es el modo de fallo que DDD-01 existe para evitar.

**Es la principal recomendación de este análisis.**

---

# 6. Riesgos

| # | Riesgo | Severidad |
| --- | --- | --- |
| **R-1** | **Que el Perfil se implemente como configuración.** DDD-01 §8 lo prohíbe expresamente: *«un parámetro se ajusta; esto se versiona y se vincula a cada emisión»*. Un fichero de configuración editable en caliente rompería la reproducibilidad sin que ninguna prueba lo detecte | **Alta** |
| **R-2** | **La lista cerrada de hechos afirmables no tiene productor**, igual que `reachableChannels` (F-7). Procede del análisis *(APS-18 §11.3)*, y hoy el Lead Analyzer produce texto narrativo —`flaws`, `angle`, `revenueLoss`— **no una lista de hechos observados**. `GenerateProposal` no puede cumplir **P-I4** sin resolverlo | **Alta** |
| **R-3** | **Que el punto de control se implemente como filtro.** DDD-01 §8: *«un filtro deja pasar con advertencia; esto rehace»*. Entregar un texto marcado como dudoso incumpliría ADR-15 §10 | **Alta** |
| **R-4** | **Que el Perfil absorba lo que no le toca.** Ver §7 | Media |
| **R-5** | **Que `criteriaVersion` se genere en código.** Un identificador autoasignado no acredita gobierno y vaciaría RC-13 | Media |

---

# 7. Límites — qué NO debe contener el Perfil

| Prohibido | Por qué |
| --- | --- |
| **Un contacto individual** | El Perfil es el criterio, no su aplicación. La estrategia de un contacto vive en su `Proposal` |
| **Un canal concreto de envío** | El canal lo decide la estrategia contacto a contacto *(CM-3)*, y **AKVEZ no envía** *(PO-02 §6.2)* |
| **El texto generado** | Es salida terminal del modelo *(RA-5)*, posterior y separada *(APS-18 §8.2)* |
| **La propuesta final** | `Proposal` es una entidad versionada con identidad propia |
| **Prompts o instrucciones para el modelo** | APS-18 §8.2. Además, ADR-15 §7.2 razona que el criterio **no vive en un prompt** |
| **Parámetros operativos** — tiempo de espera, reintentos, tamaño de tanda | Son de `infrastructure/`, con su valor en APS-17 *(P-3 · R-52)* |
| **Credenciales** | P-4 |
| **Umbrales que excluyan Leads** | **§7.5 de APS-18**: el sistema puede recomendar detener una secuencia; **nunca excluir un Lead**. Un umbral aquí reintroduciría el Top N que PO-01 §6 prohíbe |
| **Datos personales** | RC-11 |

---

# 8. Cuestiones que el ADR debe resolver y este documento no puede

1. **¿Dónde vive el artefacto?** ADR-15 §7.4 dice que existe; no dice si es un fichero versionado en el repositorio, una fila en la Biblioteca o un activo de ADR-13. **Si fuese lo tercero, el catálogo cerrado de §13.1 necesitaría enmienda.**
2. **¿Qué se hace con lo ya emitido bajo ausencia declarada?** *(§3.4)*
3. **¿El Perfil puede matizar la barrera que APS-18 §9.2 ya tabula por momento**, o esa tabla es intocable?
4. **¿Quién produce la lista cerrada de hechos afirmables?** *(R-2)*. Afecta a APS-08 y APS-19, no solo al Perfil.
5. **¿Una versión nueva del Perfil invalida las estrategias emitidas con la anterior?** ADR-14 §6.6 resolvió la pregunta equivalente para el Score: **no las destruye**. Conviene decidirlo igual, pero debe decidirse.

---

# 9. Recomendación

1. **Redactar el ADR del Perfil de Estrategia sobre la estructura de ADR-14** *(§5)*.
2. **Resolver R-2 antes o con él**: sin lista cerrada de hechos afirmables, `GenerateProposal` no puede cumplir P-I4, y el Perfil no lo arregla.
3. **No implementar `GenerateProposal` hasta que exista una primera versión aprobada del Perfil**, no solo el ADR *(§3.3)*.
4. **Mantener `SIN-PERFIL-DE-ESTRATEGIA` hasta entonces.** Es honesto, es localizable y no compromete nada.

---

# 10. Referencias

**ADR-13** §10.2, §10.3, §13.1 · **ADR-14** §6.3, §6.6, §7, §8.1, R-VIN · **ADR-15** §7.2, §7.4, §8, §10, §10.2, RA-5, RA-7 · **ADR-16** §4, §4.3, §4.4, §7, §8, RC-11, RC-13 · **ADR-17** §6.3, §7.3 · **APS-18** §8.1, §8.2, §8.4, §8.5, §9.2, §11.3, §7.5 · **APS-19** §4.2, §6 · **APS-20** §7, CM-3 · **ARCH-01** §3 · **DDD-01** §3.6, §4.2, §5.2, §8, OBS-02 · **PO-01** §6 · **PO-02** §6.2 · **DEV-00** R-38, R-52.
