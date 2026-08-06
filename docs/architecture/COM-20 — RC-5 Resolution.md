# COM-20 — Resolución de `COM-12 RC-5`

| Campo | Valor |
| --- | --- |
| Código | COM-20 |
| Clasificación | **Resolución arquitectónica** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Decide qué debe sobrevivir. No implementa y no enmienda ningún ADR** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 12 — RC-5 Resolution |
| Relacionado | COM-12 RC-5 · COM-19 · ADR-12 §7 · ADR-16 §4.4 · APS-18 §11 |

> **Cero código.** La decisión se enuncia en §6 y se responde de forma inequívoca en §7.

---

# 1. La pregunta

> **¿Qué debe conservar una `Proposal` emitida de cada hecho afirmable con el que se redactó?**

**COM-19 midió la pérdida**: un `AffirmableFact` tiene cuatro campos —`lead`, `kind`, `statement`, `source`— y la frontera de persistencia conserva **solo el enunciado**. Este documento decide **cuál es el conjunto definitivo**, derivándolo del Blueprint y no del código.

**El criterio no es «qué participa en una decisión»** —eso gobierna las entradas *(F-8)*— sino **qué hace verificable después una regla aprobada**. Un registro de evidencia existe para ser auditado, no para decidir.

---

# 2. Qué debe sobrevivir de cada hecho

## 2.1 `statement` — **obligatorio**

| Regla | Qué exige |
| --- | --- |
| **P-I4** *(ADR-16 §4.4)* | *«Ninguna afirmación suya carece de evidencia en la lista cerrada»* |
| **CA-18** *(APS-18 §12)* | *«Ningún texto afirma un hecho fuera de la lista cerrada»* — **cómo se comprueba: contraste texto ↔ lista** |

**El contraste que ambas exigen es entre el texto emitido y los enunciados.** Sin enunciados no hay contraste posible, y P-I4 dejaría de ser una propiedad para volverse una intención.

## 2.2 `source` — **obligatorio**

**Es el campo con el respaldo normativo más fuerte de los cuatro, y el único que hoy se pierde teniendo una regla que lo exige.**

| Regla | Qué exige |
| --- | --- |
| **APS-18 §11.1** | *«Toda afirmación comercial sobre un negocio debe poder **rastrearse hasta un hallazgo del análisis**»* |
| **ADR-12 §7.4** | *«El dominio no adopta el identificador de un proveedor: **exige que exista uno y lo conserva**»* |
| **CA-09** | *«Toda afirmación de un contacto se corresponde con un hallazgo **observado**»* — **cómo se comprueba: contraste afirmación ↔ evidencia** |
| **P-I1** | Una `Proposal` debe **poder explicarse después**, *«que es exactamente lo que la hace útil»* |

> **El rastro *es* `source`.** §11.1 no pide que la afirmación sea cierta: pide que **pueda rastrearse**, y rastrear exige saber **de qué observación y de qué Fuente** salió. Conservar el enunciado sin su origen conserva la afirmación y **destruye la propiedad que la regla nombra**.

**ADR-12 §7.4 emplea el verbo «conserva», no «recibe»**: la conservación es la regla, no un efecto colateral de tenerlo en memoria.

## 2.3 `kind` — **recomendado; no exigido por regla**

**Ninguna regla aprobada obliga a conservar su valor.** Su garantía es **estructural y anterior**: `FactKind` **no tiene miembro inferido**, de modo que **RE-2** —*«lo inferido no cruza al mensaje»*— queda satisfecha **en el momento de construir el hecho**, no al leerlo.

**Se recomienda igualmente, y el motivo está en §3.2:** no es plenamente reconstruible, y recuperarlo exigiría **interpretar el enunciado**.

## 2.4 `lead` — **no debe conservarse por hecho**

**AG-1** —*«toda identidad comercial incluye al `Lead`»*— **ya se satisface en la identidad del agregado**: `ProposalId` lo lleva. Repetirlo en cada hecho **multiplica por N un dato que la fila ya declara una vez**, y §3.1 demuestra que es derivable.

---

# 3. Qué puede reconstruirse — demostrado

## 3.1 `lead` — **reconstruible siempre**

**Demostración**, en tres pasos verificables:

1. La proyección recibe **un solo `ObservedInput`**, que declara **un solo `lead`**.
2. **Todo hecho que produce copia ese valor**; no existe camino por el que un hecho de otro Lead entre en la lista.
3. La emisión persiste **la lista de esa propuesta**, cuya identidad declara **el mismo Lead**.

> **Por tanto: `∀ hecho ∈ Proposal.affirmableFacts : hecho.lead = Proposal.leadId`.**

**Recuperarlo no es rellenar una ausencia:** el dato **está en la fila**, una vez, y la igualdad es demostrable. **Derivar no es inventar** — **R-38** prohíbe *«sustituir un dato inexistente»*, y éste existe.

## 3.2 `kind` — **reconstruible solo en parte**

**La proyección produce estas parejas, y solo estas:**

| `kind` | `source.observation` |
| --- | --- |
| `presencia_web` | `atributo_de_empresa` |
| `contacto_publico` | `atributo_de_empresa` |
| `reputacion_publicada` | `reputacion_publicada` |
| `factor_medido` | `evaluacion` |

**Consecuencia exacta:**

| Si `observation` vale… | `kind` queda… |
| --- | --- |
| `reputacion_publicada` | ✅ **Determinado** — solo hay un `kind` posible |
| `evaluacion` | ✅ **Determinado** |
| `atributo_de_empresa` | ⛔ **Ambiguo** — `presencia_web` o `contacto_publico` |

**En el caso ambiguo, la única vía sería leer el enunciado y juzgar de qué habla** — es decir, **interpretar**. Un registro de evidencia que exige interpretarse **deja de ser un registro de evidencia**: es la reintroducción de la inferencia en el único artefacto cuyo propósito es que nada se infiera *(RE-2)*.

> **Por eso `kind` se recomienda pese a no ser exigido: conservarlo cuesta un valor de un conjunto cerrado de cuatro y evita que un auditor tenga que interpretar.**

---

# 4. Qué no podrá reconstruirse nunca

## 4.1 `source` — **imposible, por dos vías independientes**

### Prueba 1 — no está en el enunciado, **por contrato**

**El contrato de comportamiento de los hechos afirmables prohíbe expresamente que el enunciado contenga la Fuente**, y falla si la contiene: *«el enunciado no puede convertir la Fuente en argumento»*. Su razón es normativa —**«Google Maps demuestra que…» convertiría al proveedor en argumento comercial**— y su efecto colateral es definitivo:

> **La Fuente no puede leerse de vuelta desde el enunciado, porque el sistema garantiza que no está ahí.**

**No es una limitación práctica: es una imposibilidad garantizada.**

### Prueba 2 — rehacer la proyección no devuelve la misma lista

La proyección es determinista, luego la tentación es **reejecutarla**. **No sirve**, y el motivo es el mismo que justifica conservar la lista:

Se alimenta de **atributos de la Empresa (A-2)** y **factores medidos de la evaluación (A-4)**, y **ambos cambian con el tiempo**: un negocio publica un sitio web, cambia su teléfono, acumula reseñas. **Reejecutarla produce la lista de hoy, no la de la emisión** — y **P-I4 pregunta por la lista contra la que se verificó aquel texto**, no por la lista actual.

## 4.2 La lista de la emisión, si no se conserva íntegra

**Por la Prueba 2, ninguna reconstrucción posterior es fiel.** El estado del mundo en el instante de emitir **no vuelve**, y **ADR-13 §10.2 —regla de no destrucción— y V-1 existen precisamente para que no haga falta que vuelva**.

## 4.3 Lo que **esta decisión no reconstruye, y no pretende**

> **Reconstruir el hecho no es reconstruir la decisión.**

**COM-19 §6.3 y §7.3** señalaron que la emisión **no referencia qué emisión del diagnóstico se leyó**, de modo que la reproducibilidad de **ADR-15 §7.2** sigue apoyada en una inferencia temporal. **Ninguna de las cinco alternativas de §5 lo cambia**, y **RC-5 no debe recibir crédito por resolverlo**: es una cuestión distinta, abierta y con propietario propio.

---

# 5. Alternativas

## 5.1 Comparación

| | **A · solo `statement`** | **B · `statement` + `kind`** | **C · `statement` + `source`** | **D · objeto completo** | **E · DTO reducido** |
| --- | :-: | :-: | :-: | :-: | :-: |
| **P-I4** — contraste texto ↔ lista | 🟡 Parcial | 🟡 Parcial | ✅ **Íntegro** | ✅ Íntegro | ✅ Íntegro |
| **APS-18 §11.1** — rastreo hasta el hallazgo | ⛔ **No** | ⛔ **No** | ✅ **Sí** | ✅ Sí | ✅ Sí |
| **CA-09** — afirmación ↔ hallazgo observado | ⛔ No | 🟡 Parcial | ✅ Sí | ✅ Sí | ✅ Sí |
| **RE-2** — verificable tras recargar | ⛔ No | ✅ Sí | 🟡 Parcial *(§3.2)* | ✅ Sí | ✅ Sí |
| **Trazabilidad** | ⛔ Nula | ⛔ Nula | ✅ Completa | ✅ Completa | ✅ Completa |
| **Reproducibilidad de la decisión** | ⛔ No | ⛔ No | ⛔ **No** | ⛔ No | ⛔ No |
| **Auditoría sin interpretar** | ⛔ No | 🟡 Parcial | 🟡 Casi | ✅ Sí | ✅ Sí |
| **Redundancia introducida** | ✅ Ninguna | ✅ Ninguna | ✅ Ninguna | ⛔ **`lead` N veces** | ✅ Ninguna |
| **Coste de esquema** | ✅ Nulo | 🟡 Bajo | 🟡 Bajo | 🟡 Bajo | 🟡 Bajo |

> **La fila de reproducibilidad es idéntica en las cinco**: ninguna alternativa la toca *(§4.3)*.

## 5.2 Por qué se descarta cada una

**A · solo el enunciado** *(situación actual)*. Ventaja: no cambia nada. Desventaja: **incumple APS-18 §11.1**, la regla que da sentido a la Regla de Evidencia entera, y deja P-I4 verificable a medias. **Sería defendible solo si el contrato declarase la pérdida expresamente** —para que quien lea la fila sepa que la trazabilidad no está—, y **hoy no la declara: se lee como si nada se hubiera perdido**. Es la peor propiedad de esta opción: **el defecto es invisible**.

**B · enunciado + clase.** Ventaja: recupera RE-2 tras recargar. Desventaja: **no aporta ningún rastro**. `kind` dice **qué tipo de observación fue**, nunca **de dónde salió**, de modo que **§11.1 sigue incumplida**. **Añade coste sin resolver la regla que motivó RC-5.**

**C · enunciado + origen.** Ventaja: **satisface todas las reglas exigibles**. Desventaja: deja `kind` **ambiguo en el caso `atributo_de_empresa`** *(§3.2)*, y recuperarlo obligaría a interpretar el enunciado.

**D · objeto completo.** Ventaja: nada que derivar. Desventaja: **repite `lead` en cada hecho**, un dato que la fila ya declara en su identidad y que §3.1 demuestra derivable. **Es redundancia deliberada en el único registro que existe para ser auditado**, y contradice la parsimonia con que el resto del modelo evita duplicar.

**E · DTO reducido.** **No es una quinta opción: es la forma de expresar C o D en la frontera.** Su valor está en el nombre —declara que lo persistido **no es** el `AffirmableFact` del dominio, sino su proyección conservable—, y **su contenido sigue siendo la pregunta de C frente a D**.

---

# 6. Recomendación arquitectónica

> ## **Conservar `statement`, `kind` y `source` de cada hecho afirmable.**
>
> ## **Esto es: el hecho íntegro, menos `lead`.**

**Es la opción C reforzada con `kind`, expresada como E:** un elemento propio de la frontera de persistencia, que **declara ser la proyección conservable de un `AffirmableFact`** y no el hecho de dominio.

## 6.1 Por qué

1. **`source` es innegociable.** Es lo único que hace verificable **APS-18 §11.1** después de recargar, **ADR-12 §7.4 usa el verbo conservar**, y §4.1 demuestra que **no se recupera por ninguna vía** — ni desde el enunciado, que por contrato no lo contiene, ni rehaciendo la proyección, que devolvería otra lista.
2. **`statement` es el objeto del contraste** que P-I4 y CA-18 exigen.
3. **`kind` se conserva pese a no exigirlo ninguna regla**, porque §3.2 demuestra que **es ambiguo en dos de sus cuatro valores** y recuperarlo obligaría a **interpretar el enunciado** — exactamente lo que un registro de evidencia no debe requerir.
4. **`lead` no se conserva** porque §3.1 **demuestra** que es derivable de la identidad del agregado. **Derivar no es inventar**, y **R-38 prohíbe lo segundo, no lo primero**.

## 6.2 Alcance

**La decisión gobierna las dos apariciones de la lista en la fila** —la del agregado y la que viaja dentro de la estrategia— **con el mismo elemento**. Que ambas deban seguir existiendo por separado **es una cuestión distinta**, abierta en **COM-18 §3.3**, y **este documento no la toca**.

## 6.3 Qué NO exige esta decisión

> **Ningún ADR se enmienda.**

**ADR-16 §4.4 ya declara la lista como `ClosedFactList`**, esto es, hechos completos: **la entidad de dominio nunca perdió nada**. Lo que está desalineado es **la frontera de persistencia**, que replicó la entidad reduciéndola a cadenas *(COM-19 §7.1)*. **Esta decisión alinea la frontera con la entidad que ya estaba aprobada** — no cambia el modelo, lo restituye.

## 6.4 Riesgos que elimina

| Riesgo | Cómo se elimina |
| --- | --- |
| **APS-18 §11.1 inverificable tras recargar** | El rastro se conserva |
| **P-I4 verificable a medias** | El contraste pasa a ser completo: enunciado **y** procedencia |
| **RE-2 inverificable tras recargar** | La clase observada se conserva |
| **Auditoría que exige interpretar** | Ningún campo debe deducirse leyendo prosa |
| **Irreversibilidad** | **No existe ninguna emisión persistida** —no hay adapter y B-1 impide emitir—, de modo que **hoy no hay nada que migrar**. Con la primera fila escrita, el origen perdido **no se reconstruye** |

## 6.5 Riesgos que acepta

| Riesgo | Por qué se acepta |
| --- | --- |
| **La fila crece**: tres campos por hecho en lugar de una cadena | **RE-5** ya asume listas cortas —*«tres hechos verificables convierten mejor que diez plausibles»*—. El volumen es pequeño y **la alternativa es perder la trazabilidad** |
| **El elemento persistido deja de ser un primitivo** | Cualquier motor real deberá modelar una lista estructurada. **Es materia de ADS-02**, y no altera ninguna regla de dominio |
| **`lead` se deriva, no se lee** | Demostrado en §3.1. Si alguna vez la proyección admitiera hechos de más de un Lead, **la demostración caería y la decisión debería revisarse** |
| **La lista sigue escribiéndose dos veces** | **COM-18 §3.3**, cuestión distinta y abierta |
| **La decisión sigue sin ser reproducible por referencia** | §4.3. **RC-5 no lo resuelve y no pretende resolverlo** |

---

# 7. Respuesta inequívoca

| Pregunta | Respuesta |
| --- | --- |
| **¿Qué se persiste de cada hecho?** | **`statement`, `kind` y `source`** *(`source` con sus dos partes: la observación y la Fuente)* |
| **¿Qué no se persiste?** | **`lead`** |
| **¿Por qué?** | `statement` y `source` los **exigen** P-I4, CA-18, APS-18 §11.1, CA-09, ADR-12 §7.4 y P-I1. `kind` **no lo exige ninguna regla**, pero es **ambiguo en dos de sus cuatro valores** y recuperarlo obligaría a interpretar. `lead` **es derivable con demostración** |
| **¿Qué permite reconstruir?** | **El hecho afirmable íntegro**, con `lead` derivado de la identidad del agregado — y con ello **la `Proposal` completa** que COM-19 §6 declaraba irreconstruible |
| **¿Qué no permitirá nunca reconstruir?** | **La lista tal como sería hoy** —ni falta que hace— y, sobre todo, **qué emisión del diagnóstico se leyó**: eso **no depende de RC-5** y sigue abierto *(COM-19 §7.3)* |
| **¿Cuál es la decisión recomendada?** | **El hecho íntegro menos `lead`**, declarado en la frontera como proyección conservable y **no** como el `AffirmableFact` del dominio |

---

# 8. Qué no decide este documento

- **No decide si `affirmableFacts` y `strategy.evidenceBase` deben seguir siendo dos campos** — COM-18 §3.3.
- **No decide el origen de `issuedAt`** — `COM-12 RC-4`.
- **No decide si la emisión debe referenciar el diagnóstico ni la secuencia** — COM-19 §7.3 · COM-16 §8.1.
- **No desbloquea B-1 ni B-2**, que son de Product Office.
- **No enmienda ningún ADR** *(§6.3)*.

---

# 9. Referencias

**ADR-12** §7.1, §7.4 · **ADR-13** §10.2, §10.3, V-1 · **ADR-15** §7.2 · **ADR-16** §4.4, P-I1, P-I4, AG-1 · **APS-08** §11 · **APS-18** §11.1, §11.2, §11.3, RE-1, RE-2, RE-5, CA-09, CA-18 · **DDD-01** §4.2, §8 · **DEV-00** R-38, F-8 · **COM-04** · **COM-12** RC-4, RC-5 · **COM-16** §8.1 · **COM-18** §3.3 · **COM-19** §4, §6, §7.
