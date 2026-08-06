# COM-12 — Observaciones Arquitectónicas de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-12 |
| Clasificación | **Registro de observaciones** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Registra. No decide, no resuelve y no aprueba nada** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 10 · Ajuste final previo a la Fase 3 |
| Relacionado | COM-07 · COM-09 · COM-10 · COM-11 · ADR-08 · ADR-13 |

> **Este documento no propone solución.** Deja constancia de dos observaciones surgidas al implementar el flujo de `GenerateProposal`, con su evidencia y su propietario, **para que se decidan cuando corresponda y no antes**.

---

## ⚠️ Sobre los códigos `RC-4` y `RC-5`

**Ambos ya existen en el Blueprint, con tres significados distintos entre sí:**

| Documento | `RC-4` | `RC-5` |
| --- | --- | --- |
| **ADR-16 §14** | Prohibida la lógica comercial en `routes/` | Prohibida la lógica de negocio en componentes de interfaz |
| **APS-20 §7** | Ninguna información condicionada a que el receptor responda | Ninguna referencia temporal sin indicio que la sostenga |
| **AR-05 §8** | Se crea `shared/logging/` por costumbre | La regla de propagación de errores no se cumple |

**El Blueprint ya reutiliza los códigos `RC-n` por documento**, y la práctica establecida es citarlos cualificados —*«ADR-16 RC-4»*, *«AR-05 RC-5»*—. Se conservan por tanto los códigos indicados, **acotados a este documento**: en adelante, **`COM-12 RC-4`** y **`COM-12 RC-5`**. Citarlos sin cualificar sería ambiguo.

---

# 1. `COM-12 RC-4` — Origen definitivo de `issuedAt`

## 1.1 Qué se observa

**Dos casos de uso hermanos fechan sus emisiones de forma distinta.**

| | `GenerateDiagnosis` | `GenerateProposal` |
| --- | --- | --- |
| Origen de la marca | **Argumento de entrada** — `GenerateDiagnosisInput.issuedAt` | **El reloj**, leído en `application/` |
| Justificación en código | *«Lo aporta quien invoca: el dominio es puro»* | COM-07 §6 no la declara y el contrato de persistencia la exige |

## 1.2 Por qué ocurre

**ADR-13 V-3 exige que cada emisión conserve su marca temporal**, y el Persistence Contract de A-6 la declara obligatoria. **COM-07 §6 cierra la entrada en cinco campos y ninguno es la fecha**, y el Sprint 10 prohibió expresamente añadir parámetros. Las dos únicas salidas eran ampliar el contrato de entrada o leer el reloj en `application/`; se tomó la segunda **por no enmendar COM-07 desde la implementación**.

## 1.3 Qué NO es

- **No es un incumplimiento.** Ninguna prohibición de ADR-17 §13 cubre el reloj: la novena se refiere a **configuración y `process.env`**, no al tiempo.
- **No compromete el determinismo que ADR-15 §7.2 exige.** Ese determinismo es de **la estrategia** —mismo diagnóstico, mismo estado, misma versión del Perfil—, y la marca temporal no interviene en ella.
- **No afecta al dominio.** El reloj **no entra en `domain/`**: `selectStrategy` y el punto de control siguen siendo cálculos puros.

## 1.4 Qué falta decidir

> **¿Es `issuedAt` un dato de entrada del caso de uso o una marca que la capa de coordinación pone al emitir?**

De la respuesta se sigue si **COM-07 §6 debe declarar un sexto campo** —alineando `GenerateProposal` con `GenerateDiagnosis`— o si el precedente que debe revisarse es el contrario.

**Propietario: Arquitectura**, vía COM-07.

## 1.5 Qué no debe hacerse mientras tanto

| Prohibido hoy | Por qué |
| --- | --- |
| Fabricar una segunda marca temporal en cualquier otra capa | Habría dos relojes y dos verdades sobre cuándo se emitió |
| Leer el reloj desde `domain/` | Dejaría de ser un cálculo puro (DEV-00 §5.4) |
| Derivar la versión del criterio de la fecha | **COM-11 §3.3** lo prohíbe expresamente |

---

# 2. `COM-12 RC-5` — Trazabilidad del Persistence Contract respecto a `AffirmableFact`

## 2.1 Qué se observa

**Un hecho afirmable pierde tres cuartas partes de sí mismo al persistirse.**

| | Dominio — `AffirmableFact` | Persistencia — `Proposal` |
| --- | --- | --- |
| Enunciado | `statement` | ✅ **sobrevive** |
| Lead | `lead` | ⚠️ solo el del agregado |
| Clase de observación | `kind` | ⛔ **se pierde** |
| Origen y Fuente | `source.observation` · `source.source` | ⛔ **se pierde** |

Ocurre **en dos campos a la vez**: `Proposal.affirmableFacts: string[]` y `CommercialStrategy.evidenceBase: string[]`.

## 2.2 Por qué importa

**COM-09 §4.2** sostiene que la lista viaja con la emisión porque *«es lo que hace **P-I4** comprobable después — sin ella, nadie puede verificar que ninguna afirmación carecía de respaldo»*.

**Tras recargar desde persistencia esa comprobación es solo parcial:**

| Pregunta | ¿Se puede responder con lo persistido? |
| --- | :-: |
| ¿El texto afirma algo fuera de la lista? *(P-I4 · CA-18)* | ✅ Sí |
| ¿De qué observación procede cada enunciado? | ⛔ **No** |
| ¿Toda afirmación se rastrea hasta un hallazgo del análisis? *(APS-18 §11.1)* | ⛔ **No, hasta el final** |

**En memoria la trazabilidad es completa; en persistencia, no.** La diferencia solo se manifiesta en una auditoría posterior —que es exactamente el momento para el que la lista se conserva—.

## 2.3 Qué NO es

- **No afecta a la emisión.** Durante el flujo la lista completa viaja íntegra: se redacta y se verifica contra `AffirmableFact` con su origen intacto.
- **No es una desviación de la implementación.** El Persistence Contract está **aprobado** y su forma se replicó deliberadamente de la entidad (ADR-08 §10 · DEV-00 §5.2). **Modificarlo desde un sprint de implementación sería enmendar un contrato aprobado.**
- **No lo agrava la Regla de Evidencia.** `EvidenceSource` es **metadato de trazabilidad, jamás argumento comercial**: su ausencia no permite afirmar nada de más.

## 2.4 Qué falta decidir

> **¿Debe A-6 conservar `kind` y `source` por hecho, o basta con el enunciado?**

Si la respuesta es que sí, el cambio alcanza al Persistence Contract de `Proposal`, al de `CommercialStrategy` y a su mapper — y a las emisiones ya escritas, que **no podrían completarse retroactivamente**: el origen perdido no se reconstruye.

**Propietario: Arquitectura**, vía ADR-08 y ADS-02, con la evidencia de COM-04 y COM-05.

## 2.5 Qué no debe hacerse mientras tanto

| Prohibido hoy | Por qué |
| --- | --- |
| Reconstruir `kind` o `source` al leer de persistencia | **R-38** — sería rellenar un dato inexistente con uno plausible |
| Codificar el origen dentro del `statement` | El enunciado **nunca convierte la Fuente en argumento** (`evidence.ts`), y el contrato de comportamiento falla si lo hace |
| Persistir la lista por separado | **DDD-01 §4.2** — la lista **no persiste aparte**: viaja dentro de la `Proposal` que la usó |

---

# 3. Lo que este ajuste sí resolvió

**La duplicidad de la lista de hechos afirmables.** El flujo leía `input.evidence.facts` en cuatro puntos posteriores a la decisión, de modo que **una estrategia que hubiese acotado su base de evidencia habría sido redactada y verificada contra otra lista**, sin que ningún tipo lo impidiera.

**A partir de la decisión existe una sola lista: `strategy.evidenceBase`.** No es una preferencia de implementación: **ADR-16 §7** atribuye al dominio *«la estrategia · la lista cerrada · el punto de control»*, y **APS-18 §8.1** declara la base de evidencia **contenido de la estrategia**.

**No se modificó ningún puerto ni ningún contrato**, y la semántica es la misma: `ProposalDraftingPort` sigue recibiendo estrategia y lista, como **COM-09 §6** exige — lo que cambia es que ya no hay dos referencias que puedan divergir.

---

# 4. Estado

**Ninguna de las dos observaciones bloquea la Fase 3.** No son bloqueos de gobernanza como B-1 y B-2 *(COM-11 §1)*: son **decisiones de arquitectura pendientes cuya ausencia no impide implementar**, y ambas quedan aquí registradas para que se resuelvan en su momento y no en el de una implementación.

---

# 5. Referencias

**ADR-08** §5, §10 · **ADR-13** §10.3, V-3 · **ADR-15** §7.2 · **ADR-16** §7, §14, §4.4, P-I4 · **ADR-17** §13 · **APS-18** §8.1, §11.1, CA-18 · **APS-20** §7 · **AR-05** §8 · **DDD-01** §4.2 · **DEV-00** §5.2, §5.4, R-38 · **COM-04** · **COM-05** · **COM-07** §6 · **COM-09** §4.2, §6 · **COM-11** §1, §3.3.
