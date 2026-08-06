# DP-03 — DA-02: Contrato de Resultado de la Capa Application

| Campo | Valor |
| --- | --- |
| Código | DP-03 |
| Clasificación | **DP** — Decision Paper *(orden 5, consultiva)* |
| Versión | 1.1 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-03, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-02.1** |
| Resuelve | **DA-02** · entregable **B5** de DEV-02 |

> **Naturaleza.** Decision Paper. Autoridad **consultiva**. **No decide, no implementa y no modifica ningún documento.** Ningún fichero de código fue creado ni modificado.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra §7 con la constancia de la ratificación. **No se modifica ningún análisis, alternativa ni riesgo, y ningún contrato de código.** | Sprint **GOV-03**, tarea 2. Validada la compatibilidad con **ADR-08 §10**, **ADR-09 §5.2** y **APS-03 §12**, además de la alineación con **ADR-07 §8**. **Autoridad que aprueba: AKVEZ Product Office.** |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Inventario de los contratos de resultado existentes, tres alternativas evaluadas y recomendación. | DA-02 del sprint DEV-02.1. DEV-02 se detuvo en B5. |

---

# Tabla de Contenido

1. Contexto
2. Análisis
3. Alternativas
4. Recomendación
5. Impacto
6. Riesgos
7. Decisión Propuesta
8. Referencias

---

# 1. Contexto

**DEV-02 se detuvo en B5** —«Sistema de `Result<T>` común… Debe utilizarse en Application»— porque ningún documento aprobado define un contrato de resultado único, e imponerlo habría cambiado la forma de los contratos de la capa de aplicación en los tres módulos.

## 1.1 Inventario real

| Módulo | Contrato de retorno de `application/` | Forma |
| --- | --- | --- |
| **lead-hunter** | `DiscoverProspectsResult` *(interface)* | Objeto con `leads` y `references`. **Sin canal de error** — el fallo se propaga por excepción |
| **lead-analyzer** | *Sin tipo nombrado.* `createAnalyzeProspects` devuelve una estructura inline | — |
| **pitch-generator** | `GenerateOutreachPitchResult` *(union)* | `{ success: true; pitch }` \| `{ success: false; error }` |

**En la capa `presentation/`** existe además `PitchGeneratorOutcome`, con **tres** ramas: `validation_error`, `generation_error`, `success`.

> **Los tres módulos resuelven el mismo problema de tres maneras distintas**, y uno de ellos no lo resuelve en absoluto: `lead-hunter` señala el fallo lanzando.

## 1.2 Lo que el Blueprint ya dice

**ADR-07 §8** define la responsabilidad de la capa:

> «**application** — Ejecutar el caso de uso del módulo (p. ej. `analyzeProspects`, `generateOutreachPitch`), **devolviendo un resultado interno propio del módulo**.»

**ADR-04 §11** define qué puede ser compartido:

> «`shared/types` — Contratos de datos **verdaderamente compartidos** entre más de un módulo.»

**APS-03 §12** define las cuatro categorías de error, ya implementadas en `shared/errors` durante DEV-02.

---

# 2. Análisis

## 2.1 ¿Contradice un `Result<T>` compartido a ADR-07 §8?

**No necesariamente, y conviene ser preciso porque de ello depende la decisión.**

ADR-07 §8 dice «un resultado interno **propio del módulo**». Un `Result<T>` compartido tiene dos partes:

| Parte | ¿De quién es? |
| --- | --- |
| **El sobre** — la distinción éxito/fallo | Compartido |
| **La carga `T`** — `PitchPayload`, `DiscoverProspectsResult`… | **Propia del módulo** |

Si solo se comparte el sobre, la carga sigue siendo del módulo y **ADR-07 §8 se respeta**. Un `Result<T>` no es, por sí mismo, una violación.

**Pero sí introduce acoplamiento**: un cambio en el sobre afecta a los tres módulos a la vez, que es exactamente lo que ADR-01 §7.4 (bajo acoplamiento) y §7.5 (evolución independiente) buscan evitar.

## 2.2 El problema real no es la falta de un sobre común

**Es la inconsistencia en el tratamiento del fallo.** `pitch-generator` devuelve el error como valor; `lead-hunter` lo lanza. Esa divergencia:

- obliga a quien consume a conocer la convención de cada módulo;
- hace que `PitchGeneratorOutcome` tenga que **traducir** entre convenciones en la capa `presentation/`;
- y **no se resuelve con un tipo**, sino con una regla sobre cuándo se lanza y cuándo se devuelve.

> **Un `Result<T>` uniforme sin esa regla solo uniformaría la sintaxis**, dejando intacta la decisión de fondo.

## 2.3 Lo que `shared/errors` ya aporta

DEV-02 implementó la taxonomía de APS-03 §12: `InputError`, `ExternalDataError`, `AgentInternalError`, `CommunicationError`.

**Eso cubre buena parte de lo que B5 perseguía.** Un error ya es clasificable de forma uniforme sin necesidad de un sobre común: `categoryOf(e)` da la categoría en cualquier capa. La pregunta que queda es únicamente **si el fallo viaja como valor de retorno o como excepción**.

## 2.4 Coste de migración

Adoptar `Result<T>` obligatorio exigiría tocar los tres módulos en `application/` y sus consumidores en `presentation/`, `orchestrators/` y `routes/`. **Es refactorización de código de negocio**, expresamente excluida de DEV-02 y de DEV-03 según su propio enunciado.

---

# 3. Alternativas

## Alternativa A — Mantener contratos específicos por módulo

| Ventajas | Desventajas |
| --- | --- |
| **Es la posición actual de ADR-07 §8**: resultado propio del módulo | **No resuelve la inconsistencia** entre lanzar y devolver |
| Acoplamiento mínimo; cada módulo evoluciona solo | `presentation/` seguirá traduciendo convenciones |
| Coste cero, riesgo cero | Cada módulo nuevo reinventa la convención |

## Alternativa B — `Result<T>` estándar y obligatorio en toda Application

| Ventajas | Desventajas |
| --- | --- |
| Uniformidad sintáctica en los tres módulos | **Acopla los tres módulos a un tipo común**, contra ADR-01 §7.4 y §7.5 |
| Un solo patrón que aprender | **Exige refactorizar código de negocio**, excluido del alcance actual |
| Fuerza a tratar el fallo explícitamente | **No resuelve la pregunta de fondo** (§2.2) sin una regla adicional |
| | Requiere decisión sobre `shared/types`, y probablemente un ADR |

## Alternativa C — Regla de propagación de errores, sin sobre común ✅

**No se crea `Result<T>`.** Se declara **cuándo el fallo viaja como excepción y cuándo como valor**, apoyándose en la taxonomía de `shared/errors` que ya existe. Cada módulo conserva su contrato propio conforme a ADR-07 §8.

Regla propuesta:

| Situación | Cómo se propaga |
| --- | --- |
| **Fallo esperado y significativo para el caso de uso** *(entrada inválida, respaldo agotado)* | **Valor de retorno**, en el contrato propio del módulo |
| **Fallo inesperado** *(invariante roto, error interno)* | **Excepción** de la clase de `shared/errors` correspondiente |
| **Fallo de proveedor externo** | Se **envuelve** en `CommunicationError` o `ExternalDataError`, conservando `cause` |
| **Fallo parcial sobre un conjunto de Empresas** | **Nunca aborta el conjunto** *(APS-03 §12; PO-01 §8)* |

| Ventajas | Desventajas |
| --- | --- |
| **Resuelve el problema real** — la inconsistencia — sin introducir acoplamiento | No aporta uniformidad sintáctica: los contratos siguen siendo distintos |
| **Respeta ADR-07 §8** sin necesidad de interpretarlo | Exige disciplina en la revisión, no la garantiza el compilador |
| **Aprovecha `shared/errors`**, ya implementado y derivado de APS-03 §12 | |
| **Coste de migración bajo**: solo `lead-hunter` alinea su propagación | |
| Formalizable como reglas en **DEV-00**, sin ADR nuevo | |

---

# 4. Recomendación

> ## Alternativa C — Regla de propagación de errores, sin `Result<T>` común.
>
> **Y, en consecuencia, se recomienda no ejecutar B5 tal como fue enunciado.**

**Tres razones, en orden de peso:**

1. **El Blueprint ya decidió** que el resultado de `application/` es propio del módulo (ADR-07 §8). Imponer un sobre común no lo contradice frontalmente, pero **va contra su intención** y contra ADR-01 §7.4 y §7.5, sin que ningún documento lo pida.
2. **`Result<T>` no resuelve el problema real.** La divergencia es de *convención de fallo*, no de *forma de tipo*. Un sobre uniforme sobre convenciones divergentes produce uniformidad aparente.
3. **`shared/errors` ya cubre la parte que sí estaba justificada**, y deriva de APS-03 §12 — un documento aprobado, no de una preferencia.

## 4.1 Si el Product Office prefiriese la Alternativa B

Sería legítimo, pero exigiría:

- un **ADR nuevo** que decida el contrato de resultado de la capa de aplicación, por afectar a la frontera de tres módulos;
- ubicar el tipo en `shared/types` conforme a ADR-04 §11;
- un **sprint de migración propio**, por tocar código de negocio;
- y aceptar el acoplamiento como coste declarado.

**No debería hacerse dentro de un sprint de infraestructura.**

---

# 5. Impacto

| Ámbito | Impacto de la recomendación |
| --- | --- |
| **Código** | **Ninguno inmediato.** No se crea ningún tipo ni se refactoriza nada |
| **`shared/errors`** | Se confirma como pieza suficiente. Sin cambios |
| **Contratos existentes** | `DiscoverProspectsResult`, `GenerateOutreachPitchResult` y `PitchGeneratorOutcome` **se conservan** |
| **Deuda futura** | Se cierra la ambigüedad de convención, que era la deuda real |
| **DEV-00** | Requeriría **añadir reglas** de propagación de errores, derivadas de APS-03 §12. Es materia propia de DEV: traduce una decisión existente, no crea arquitectura |
| **`lead-hunter`** | Único módulo que necesitaría alinear su propagación. **Sprint posterior, no éste** |

> **Ningún ADR necesita modificarse** si se adopta la Alternativa C. Es su principal ventaja de gobernanza frente a la B.

---

# 6. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **La regla de propagación no se cumple** por no verificarla el compilador | **Alta** | Reglas explícitas en DEV-00 §3 y en el checklist de §7. Es el mismo riesgo **RI-1** que ya afecta a todas las reglas de frontera |
| **R-2** | **Cada módulo nuevo inventa su convención** al no existir un tipo que la imponga | Media | La regla, no el tipo, es lo que se hereda. Debe constar en DEV-00 |
| **R-3** | **Se envuelve un error perdiendo `cause`**, y el diagnóstico se degrada | Media | `AkvezError` acepta `cause`. Verificable en revisión |
| **R-4** | **Un fallo parcial aborta el conjunto de Empresas**, contra APS-03 §12 y PO-01 §8 | **Alta** | Regla explícita. **Es el riesgo de dominio, no de estilo**: un Lead registrado no puede perderse por un fallo posterior *(ADR-13 §11.2, A-2)* |
| **R-5** | **Se decide B en el futuro** y la migración es más costosa por haber crecido el código | Media | Si se prefiere B, conviene decidirlo **antes** de DEV-03 |

---

# 7. Decisión Propuesta

> **No se adopta un `Result<T>` común. Se adopta la Alternativa C:** cada módulo conserva su contrato de resultado propio, conforme a ADR-07 §8, y se declara una **regla de propagación de errores** apoyada en la taxonomía de `shared/errors` derivada de APS-03 §12.
>
> **B5 de DEV-02 queda desestimado tal como fue enunciado**, y sustituido por la formalización de esa regla en **DEV-00 §3**.
>
> **Ningún ADR requiere modificación.**

## 7.1 Ratificación

> ## ✅ RATIFICADA — Product Office, 2026-07-29 (sprint GOV-03)
>
> **Se adopta la Alternativa C.** **No se crea `Result<T>` común.** Cada módulo conserva su contrato de resultado propio y se adopta la regla de propagación de errores de §3.
>
> **Validaciones de compatibilidad exigidas por GOV-03:**
>
> | Documento | Resultado |
> | --- | --- |
> | **ADR-08 v1.2 §10** | ✅ **Compatible.** No se introduce ningún tipo compartido nuevo que cruce la frontera de persistencia. La tabla de dependencias permitidas y prohibidas queda intacta |
> | **ADR-09 v1.1 §5.2** | ✅ **Compatible.** `application/` sigue exponiendo factories que devuelven el caso de uso ya vinculado; el mecanismo de closure no se altera |
> | **APS-03 v3.0 §12** | ✅ **Compatible y reforzado.** La regla se apoya en las cuatro categorías de APS-03 §12, ya implementadas en `shared/errors`, y preserva expresamente «el sistema deberá continuar procesando el resto de empresas» |
> | **ADR-07 v1.1 §8** | ✅ **Alineado.** «Resultado interno propio del módulo» se conserva literalmente |
> | **PO-01 v1.1 §8** · **ADR-13 v1.1 §11.2 (A-2)** | ✅ Regla explícita: un fallo posterior **nunca retira** un Lead ya registrado |
>
> **Ninguna contradicción detectada.**
>
> **`shared/errors`, implementado en DEV-02, se confirma como pieza suficiente.** No requiere cambios.

## 7.2 Qué queda por ejecutar

**Ningún ADR requiere modificación** — es la principal ventaja de gobernanza de esta decisión. Quedan dos acciones, ambas de trámite ordinario:

| Acción | Documento | Naturaleza |
| --- | --- | --- |
| Incorporar la **regla de propagación de errores** de §3 | **DEV-00 §3** | Categoría DEV: traduce APS-03 §12, no crea arquitectura |
| Alinear la propagación de **`lead-hunter`**, único módulo que hoy señala el fallo lanzando | Código | Sprint posterior. **No urgente** |

> **`B5` de DEV-02 queda formalmente desestimado** tal como fue enunciado, y sustituido por la regla de §3.

---

# 8. Referencias

- **PO-01 v1.1** §8 — ninguna etapa expulsa a un Lead.
- **APS-03 v3.0** §12 — cuatro categorías de error; continuidad ante fallo parcial.
- **ADR-01 v1.0** §7.4, §7.5 — bajo acoplamiento y evolución independiente.
- **ADR-04 v1.2** §11 — `shared/types` y servicios compartidos.
- **ADR-07 v1.1** §8 — «resultado interno propio del módulo». **Fundamento principal.**
- **ADR-13 v1.1** §11.2, regla A-2 — un fallo no retira un Lead.
- **ADS-00 v1.3** — categoría DEV, regla R-7.
- **DEV-00 v1.1** §3, §7, §9 (RI-1).
- **DEV-02** — entregable B5 detenido.
- **Código inspeccionado:** `server/modules/*/application/*.ts` · `pitchGeneratorAgent.ts` · `server/shared/errors/index.ts`.
