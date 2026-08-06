# COM-35 — Decisión sobre el Patrón de Construcción de Agent API

| Campo | Valor |
| --- | --- |
| Código | COM-35 / 2 |
| Clasificación | **Dictamen sobre propuesta de ADR** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Dictamen emitido: APTO PARA APROBACIÓN**, con dos actos procedimentales previos |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-35, tarea 2 |
| Objeto | `docs/architecture/ADR-XX — Agent API Factory Construction Pattern.md` v0.1 `Draft` |
| Relacionado | **COM-33 §3.3** *(el hallazgo)* · **COM-34 tarea 2** *(la propuesta)* |

> **Cero cambios de código.** No se ha migrado ninguna Agent API.
>
> ⚠️ **Este documento no ratifica.** Emite un dictamen técnico y deja el acto de ratificación a la autoridad que lo tiene. **§7 explica por qué la distinción no es formalismo.**

---

# 1. Dictamen

> ## ✅ **APROBAR** — el contenido es apto. La aprobación formal queda condicionada a dos actos procedimentales, **ninguno de contenido**.

| Opción | Veredicto |
| --- | :-: |
| **Aprobación** *(como ADR-19)* | ✅ **Recomendada** |
| Rechazo | ❌ Descartado — §3 |
| Revisión de contenido | ❌ **Innecesaria.** La única cuestión abierta se resuelve en §4 |

---

# 2. Qué se ha verificado

**Se han comprobado las seis decisiones propuestas contra su fundamento declarado.** Ninguna introduce materia nueva.

| # | Decisión propuesta | Fundamento | ¿Es materia nueva? |
| :-: | --- | --- | :-: |
| **D-1** | Factory con un único parámetro nominal | Análogo a ADR-17 §8.2 F-1, con justificación propia medida | ⚠️ **Sí — es lo único nuevo.** §3.1 |
| **D-2** | Ninguna dependencia opcional ni por defecto | **R-55** · ADR-09 §5.3 | ❌ No |
| **D-3** | La factory no ejecuta trabajo ni valida | ADR-09 §5.2, §6 · DEV-00 §6.1 | ❌ No |
| **D-4** | Composition Root, único constructor | **R-54 · R-55 · R-57** · ADR-09 §5.1 | ❌ No |
| **D-5** | Agent API, frontera pública del módulo | **R-07 · R-23** · ADR-04 §7.7 | ❌ No |
| **D-6** | Un Orchestrator nunca alcanza `application/` | **R-07** · ADR-04 §7.7, §7.8 | ❌ No |

> **Cinco de las seis son enunciados de reglas ya vigentes, aplicadas a una capa que ninguna nombraba explícitamente.** Solo **D-1** decide algo que no estaba decidido.

---

# 3. Por qué no se rechaza

## 3.1 D-1 llena un hueco real, y el hueco está probado

**El hueco:** ningún documento publica la firma de la factoría de `presentation/`. **ADR-17 §8.2 gobierna `application/`**; **DEV-00 §5.1 solo fija el nombre**.

**El coste de no tenerlo, medido y ya pagado:**

| Evidencia | Fuente |
| --- | --- |
| Cuatro de seis dependencias comparten forma `(input) => Promise<Result>`; **intercambiar dos compilaba sin error** | COM-33 §3.1 |
| En pruebas, los dobles son `as any` / `as never`: **el compilador no distinguía ninguna de las seis** | COM-33 §3.1 |
| **Las mismas cinco llamadas hubo que tocarlas en los Sprints 19 y 31** | handoff §4.7 |
| Una suite pasaba literalmente `fail as any` seis veces | COM-33 §3.1 |

**El defecto que D-1 previene es de una clase que el compilador con `strict` no detecta.** No es preferencia de estilo.

## 3.2 No contradice ningún documento vigente

Verificado contra ADR-04, ADR-08, ADR-09 y ADR-17: **el documento no modifica ninguno**, y usa el mecanismo de extensión que **ADR-09 §8.1** estableció sobre ADR-08 §10 y que **ADR-17 §9.1** replicó sobre ADR-09 §8 — *«añadiendo una fila, sin modificar ninguna de las existentes»*.

## 3.3 La alternativa de no hacer nada ya se evaluó y falló

**ADR-XX §11 alternativa A** es el estado actual: produjo **COM-33 §3.3** —una migración técnicamente correcta **sin documento que la respaldara**—. El próximo agente que se escriba no tendría regla que consultar.

---

# 4. ✅ Resolución de la cuestión abierta de ADR-XX §8

**ADR-XX §8 dejó abierta la tensión con el ejemplo de ADR-09 §5.2:**

```
export function createLeadHunterAgent(discoverProspects: DiscoverProspectsFn) { ... }
```

> ### **Se resuelve por el texto literal de ADR-09, no por interpretación.**

**ADR-09 §5.2 encabeza ese bloque así:**

> *«**Forma ilustrativa del patrón (no es implementación)**»*

**Y su enunciado decisional, en el mismo §5.2, dice:**

> *«**`modules/*/application/` expone una factory** que recibe sus dependencias y devuelve la función de caso de uso ya vinculada. Las capas superiores reciben la función construida, no las dependencias.»*

| Constatación | Consecuencia |
| --- | --- |
| **El enunciado decisional de §5.2 nombra `application/`.** No nombra `presentation/` | §5.2 **no decide** la firma de la Agent API |
| **El bloque se declara a sí mismo «no es implementación»** | El ejemplo ilustra **el mecanismo de closure**, que es lo que §5.2 explica: *«la dependencia queda capturada… y desaparece de la superficie de tipos»* |
| **El código real diverge del ejemplo desde hace sprints** — `createLeadHunterAgent` recibe **dos** parámetros, el ejemplo muestra **uno**, y ninguna auditoría lo señaló nunca | Confirma que **nadie lo ha tratado como normativo** |

> ### **Veredicto: la lectura A de ADR-XX §8 es la correcta, y lo es por autodeclaración de ADR-09.**
>
> **No hay tensión que resolver, y ADR-09 no necesita nota de superación.** Se recomienda **incorporar esta constatación al cuerpo de ADR-19 y retirar §8 como cuestión abierta**.

**Las lecturas B y C se descartan:**

| Lectura | Por qué se descarta |
| --- | --- |
| **B** — el ejemplo fija una forma y D-1 lo supera | Contradice el texto literal *«no es implementación»* |
| **C** — D-1 debería aplicar solo a partir de dos parámetros | **Introduce un umbral que ningún documento sostiene**, y sería materia nueva. Además, un umbral por número de parámetros es frágil: el problema no es la cantidad sino la **indistinguibilidad de tipos**, que ya existe con dos funciones de la misma forma |

---

# 5. Condiciones para la aprobación formal

**Ninguna es de contenido.**

| # | Acto | Quién | Por qué es necesario |
| :-: | --- | --- | --- |
| **1** | **Asignar el número — `ADR-19`** y catalogarlo en `INDEX.md` | **Architecture Team** · sincronización del INDEX | El catálogo es cerrado; un ADR sin número no es citable |
| **2** | **Trasladar el fichero a `docs/blueprint/ADR/`** y fijar `Estado: Approved` con la aprobación registrada | **Architecture Team** | ADS-00: mientras esté en `Draft` **no prevalece sobre nada** |

## 5.1 Cambio de contenido recomendado antes de aprobar

| # | Cambio | Motivo |
| :-: | --- | --- |
| **1** | **Retirar §8** *(cuestión abierta)* y sustituirlo por la constatación de §4 de este dictamen | La cuestión queda resuelta por el texto de ADR-09 |
| **2** | En §10, **retirar el riesgo 3** *(«la tensión con ADR-09 §5.2 no se resuelve»)* | Deja de aplicar |

**Es una simplificación, no una revisión.** No altera D-1 a D-6.

---

# 6. Secuencia posterior — y su orden importa

| # | Acto | Precondición |
| :-: | --- | --- |
| **1** | Aprobar ADR-19 | §5 |
| **2** | **Añadir R-a a R-d a DEV-00 §3**, con numeración que asigne DEV-00 | ⛔ **Solo tras 1** |
| **3** | Migrar `createLeadHunterAgent` y `createLeadAnalyzerAgent` | ⛔ **Solo tras 1**, en un sprint que lo incluya en su alcance |

> ### ⚠️ **El paso 2 antes del paso 1 produce reglas nulas.**
>
> **ADS-00 R-7:** *«Una regla DEV que no derive de un documento superior es **nula**, y su presencia constituye **un defecto** que debe corregirse en el documento DEV.»*

> **Sobre el paso 3.** Hasta que ADR-19 esté `Approved`, **`createLeadHunterAgent` y `createLeadAnalyzerAgent` no están en infracción**. Migrarlas antes sería aplicar una norma que aún no obliga.

---

# 7. Por qué este documento no ratifica

**ADR-19 sería un documento de categoría ADR — orden 4, *«vinculante sobre la implementación»*.** Los ADR del Blueprint registran quién los aprueba: ADR-13, ADR-16 y ADR-17 fueron aprobados por el **Product Office**; ADR-08, por el **Product Owner** en cierre de sprint.

**Ninguno se aprueba a sí mismo, y ninguno lo aprueba quien lo redacta.**

> **Este dictamen aporta lo que un ingeniero puede aportar: verificación del contenido contra su fundamento, resolución de la cuestión abierta con texto documental, y la lista exacta de lo que falta.** **El acto de ratificación no es suyo.**

**Bloque de firma, para el registro:**

| Campo | Valor |
| --- | --- |
| Dictamen técnico | ✅ **Apto para aprobación** — 2026-08-04 |
| Número asignado | ⬜ Pendiente |
| Catalogado en INDEX | ⬜ Pendiente |
| Trasladado al Blueprint | ⬜ Pendiente |
| **Aprobado por** | ⬜ **Pendiente — AKVEZ Architecture Team** |

---

# 8. Riesgos del dictamen

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **Se aprueba y no se ejecuta la migración de §6 paso 3.** Las tres Agent API quedan divergentes **con una norma que lo prohíbe** — hoy la divergencia no infringe nada | 🔴 Alta |
| **2** | **Se cita ADR-19 como vinculante antes de ratificarlo.** Es **RC-2** de AR-05 en su forma más débil | 🔴 Alta |
| **3** | **Se escriben R-a a R-d en DEV-00 antes de la aprobación** y nacen nulas *(ADS-00 R-7)* | 🟡 Media |
| **4** | **Este dictamen se toma por la ratificación.** No lo es *(§7)* | 🟡 Media |

---

# 9. Referencias

**ADR-04 v1.3** §7.7, §7.8, §17 · **ADR-08 v1.2** §10 · **ADR-09 v1.3** §5.1, §5.2, §5.3, §6, §8, §8.1 · **ADR-17 v1.1** §8.2, §9.1 · **ADS-00 v1.3** *Estados del Documento*, R-4, R-7 · **DEV-00** §5.1, §6.1, R-07, R-23, R-54, R-55, R-56, R-57 · **AR-05** RC-2 · **COM-30** · **COM-31** · **COM-33** §3 · **COM-34** tarea 2.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
