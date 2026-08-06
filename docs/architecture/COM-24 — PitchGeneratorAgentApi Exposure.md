# COM-24 — Superficie pública de `PitchGeneratorAgentApi`

| Campo | Valor |
| --- | --- |
| Código | COM-24 |
| Clasificación | **Contrato técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Declara la frontera. No cablea Orchestrators ni rutas** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 19 |
| Relacionado | COM-13 §5.2 · **COM-14 §2.2** · **COM-16 §6** · COM-23 §4.4 · ADR-04 §7.6 |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§3.4 íntegro** y **la fila de B-1 en §5**. Sostenían que `GenerateProposal` **no debía exponerse** porque *«publicar una operación que siempre falla presentaría un bloqueo de gobernanza como si fuera una función del producto»*.
>
> **El razonamiento confundía dos superficies.** **R-07 y ADR-04 §7.7** obligan a que la Agent API sea la única superficie que un Orchestrator conoce; **la publicación al producto es la ruta HTTP**. **COM-30** lo declaró y **COM-31 expuso la operación sin crear ninguna ruta**.
>
> **B-1 conserva un solo efecto: impedir la ruta.**
>
> **El resto del documento sigue vigente**, y es la fuente de la exposición de las dos lecturas recortadas.

> **La frontera que faltaba.** COM-23 §4.4 registró que las dos lecturas existían y **no estaban registradas**; este documento declara cómo quedan expuestas.

---

# 1. Componentes expuestos

**`PitchGeneratorAgentApi` pasa de cuatro operaciones a seis. Las dos nuevas son lecturas.**

| Operación | Qué devuelve | Autoridad |
| --- | --- | --- |
| **`readReducedDiagnosis(lead)`** | **`ReducedDiagnosis \| null`** — `variables[{id, knowledgeClass, value?}]` y `confidence` | **COM-14** |
| **`readReducedSequence(lead)`** | **`ReducedSequence \| null`** — `moment`, `previousThread?`, `previousContribution[]`, `previousOutcome?{responded}` | **COM-16** |

**Ambas son delegación pura.** No transforman, no combinan, no completan y no deciden: **devuelven la misma referencia que produjo el caso de uso**, y una prueba lo comprueba por identidad —no por equivalencia—, que es lo que hace verificable que la fachada no tiene lógica.

**`null` es estado válido en las dos**: un Lead sin diagnóstico vigente es correcto, y una secuencia sin contacto en curso no tiene nada que preparar. **La ausencia se transporta como ausencia** (R-38).

---

# 2. Componentes ocultos

**Lo que la frontera no deja pasar, y por qué.**

| Oculto | Regla |
| --- | --- |
| **`BuyerDiagnosis` (A-11)** y **`CommercialSequence` (A-12)** — los agregados | Si salieran, **el recorte tendría que hacerlo quien los recibe** —un Orchestrator, que **no contiene lógica de negocio** (R-10)— y **decidir qué puede alcanzar al mensaje volvería a ocurrir fuera del dominio**: **RA-R1 · RC-3** |
| **Cualquier Repository** | **R-23** — `presentation/` no importa `shared/persistence/`, «sin excepción» |
| **Cualquier Persistence Contract o Model** | Ídem · ADR-08 §10 |
| **Cualquier clase de `infrastructure/`** | La fachada no la nombra: los adapters se construyen en el Composition Root (ADR-17 §9.1) |
| **`commercialState` como campo suelto** | **BD-I4** — es la variable BD-1; **COM-14 §4.1** |
| **Los `indicios`** | **COM-14 §4.2** — serían una segunda vía hacia la lista cerrada (RE-1) |
| **`CommercialStrategy` y su `evidenceBase`** | **COM-16 §5.3 · §7.1** — decidir por imitación, y un segundo origen de hechos afirmables |
| **La manifestación del comprador** | **COM-16 §5.5** — contenido enunciable ajeno a la proyección |
| **El número de secuencia, el estado y las propuestas emitidas** | **COM-16 §5.1, §5.2, §5.4** · F-8 |

**Verificado sobre los imports del fichero**, no sobre su prosa: si `persistence`, `adapters`, `models`, `Repository` o `infrastructure` apareciera en uno, la prueba falla.

---

# 3. Justificación arquitectónica

## 3.1 Por qué la fachada, y no el Orchestrator

**Los tres datos que un Orchestrator necesita viven en tres sitios y ninguno puede ir a buscarlos:**

- **R-24** — un Orchestrator **no conoce persistencia**.
- **R-10** — **no contiene lógica de negocio**.
- **ADR-04 §7.6** — **ningún agente conoce ni invoca a otro**; el Orchestrator es el único canal.

**La única salida es que cada módulo exponga lo suyo, ya recortado.** Es el mismo patrón con que `listLeadScores` y `listLeadLibrary` permiten a la Biblioteca mostrar el Score **sin que ningún módulo lea el interior de otro**.

## 3.2 Por qué se expone la lectura y no el agregado

> **Si la Agent API devolviera A-11 o A-12, el impedimento seguiría abierto.**

El recorte **es una decisión** —qué puede saber un contacto del comprador y de los anteriores— y **D-1 · RA-1** la sitúan en el dominio. Exponer el agregado la desplazaría al consumidor.

**Por eso la cadena de COM-14 §2.2 termina donde termina:** `domain/` decide · `application/` lee · **`presentation/` expone lo ya recortado** · el Orchestrator **copia**.

## 3.3 Por qué son cinco parámetros posicionales y no un objeto

`createPitchGeneratorAgent` pasa de tres a cinco funciones, siguiendo la convención de `LeadHunterAgent` y `LeadAnalyzerAgent`. **El riesgo de transponer las dos lecturas lo cierra el compilador**: sus firmas coinciden, pero `ReducedDiagnosis` y `ReducedSequence` **no son mutuamente asignables** — intercambiarlas no compila.

## 3.4 Qué NO se ha expuesto, deliberadamente

> **`GenerateProposal` sigue sin operación en la Agent API.**

Se construye en el Composition Root desde el Sprint 18, pero **con B-1 abierto no puede emitir**: `selectStrategy` lanza mientras `SP-01` no se publique. **Publicar una operación que siempre falla presentaría un bloqueo de gobernanza como si fuera una función del producto** (COM-23 §7.2).

---

# 4. Riesgos

| # | Riesgo | Severidad | Nota |
| :-: | --- | :-: | --- |
| **1** | **Cinco parámetros posicionales** en la factoría del agente | 🟡 | Compila y el tipo protege la transposición, pero **el sexto empezará a doler**. Migrar a un objeto de opciones es un refactor que ningún documento pide todavía |
| **2** | **Cinco llamadas de prueba existentes tuvieron que actualizarse** | 🟢 | Añadir un parámetro obligatorio fuerza a todos los llamadores. Se usó el idioma que esas pruebas ya empleaban: **un doble que lanza si se invoca**, de modo que si un flujo ajeno leyera, lo diría |
| **3** | **Las lecturas quedan expuestas sin consumidor** | 🟡 | No hay Orchestrator que las use. Es la tercera pieza montada y sin invocar, junto a `runCommercialFacts` y `generateProposal` |
| **4** | **`ReducedSequence` transporta la memoria completa** | 🟡 | **COM-16 §8.2** sigue abierto; la frontera no lo cierra ni lo agrava |
| **5** | **Una prueba compara claves, no subcadenas** | 🟢 | La confianza declarada contiene la palabra «indicios» —prosa del dominio, no un hecho—, y buscarla en el JSON producía un falso positivo. Documentado en la propia prueba |

---

# 5. Bloqueos restantes

| Bloqueo | Propietario |
| --- | --- |
| **B-1 — `SP-01` sin publicar.** Impide emitir y desaconseja exponer `GenerateProposal` | Product Office |
| **B-2 — reintentos del punto de control** | Product Office |
| **CH-01/02/03 — longitud de canal** | Product Office, vía APS-17 |
| **COM-16 §8.2 — alcance de la memoria** | Product Office, vía APS-18 |
| **COM-16 §8.1 — de qué secuencia nació una propuesta** | Arquitectura |
| **`COM-12 RC-4` — origen de `issuedAt`** | Arquitectura |
| **COM-18 §3.3 — canal, momento y lista escritos dos veces** | Arquitectura |
| **COM-23 §4.1 — traducción duplicada entre mappers** | Ingeniería |
| **COM-23 §4.5 — COM-07 §6 sin anotar** | Arquitectura |
| **F-1 y retirada del par heredado sobre A-6** | Arquitectura |

> **Con esta frontera, las cuatro fuentes de COM-07 son alcanzables desde un Orchestrator.** Lo que falta para componer `GenerateProposalInput` **ya no es una pieza ausente: es el Orchestrator que las reúna.**

---

# 6. Referencias

**ADR-04** §7.6, §10 · **ADR-08** §10 · **ADR-09** §5.1, §6 · **ADR-15** §12, RA-1, RA-R1 · **ADR-16** §7, RC-3 · **ADR-17** §9.1, AL-06, AL-20 · **APS-03** §7.1, §7.3 · **APS-18** §9.1 · **APS-19** §4.1 · **DEV-00** §5.4, R-02, R-10, R-11, R-22, R-23, R-24, R-38, D-1, D-A1, F-8 · **COM-07** §2, §5 · **COM-13** §5.2 · **COM-14** · **COM-16** · **COM-23** §4.4, §7.2.
