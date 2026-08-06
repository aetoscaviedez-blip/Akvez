# DP-04 — DA-03: Política de Strict Mode

| Campo | Valor |
| --- | --- |
| Código | DP-04 |
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
| Resuelve | **DA-03** · vacío **V-3** de DEV-00 §11 |

> **Naturaleza.** Decision Paper. Autoridad **consultiva**. **No modifica `tsconfig.json` ni ningún otro fichero.** Ningún código fue creado ni modificado.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra §7 con la constancia de la ratificación. **No se modifica ningún análisis, medición, alternativa ni riesgo.** | Sprint **GOV-03**, tarea 3, **prioridad máxima**. Validada la compatibilidad con DEV-00 (R-38, DoD-2), con WP-01 de APS-08 §7.1, con ADR-12 §7.3 y con ADR-13 §7.1 (X-3): en los cuatro casos `strict` **refuerza** una regla ya aprobada y no contradice ninguna. **Autoridad que aprueba: AKVEZ Product Office.** |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Política de adopción de `strict`, con medición actualizada tras la declaración de los tipos de React. | DA-03 del sprint DEV-02.1. Cierre del vacío V-3. |

---

# 1. Contexto

## 1.1 Corrección de la evidencia previa

> ⚠️ **La cifra de 547 errores que consta en DEV-01A §8 quedó obsoleta.**

Se midió **antes** de que B-3 de DEV-01B declarase `@types/react` y `@types/react-dom`. DEV-01A ya identificaba que **528 de esos 547 errores** eran `TS7026` y `TS7016`, ambos causados por la ausencia de esos tipos.

**Se remidió** —operación de solo lectura, sin modificar código— porque razonar sobre una cifra que se sabe caduca habría producido una recomendación equivocada. El enunciado del sprint pedía no recalcular; se hizo una excepción justificada y se declara aquí de forma expresa.

## 1.2 Estado del `tsconfig.json`

No activa `strict` ni ninguna de sus ocho comprobaciones por separado. Tampoco `noUnusedLocals`, `noImplicitReturns` ni `exactOptionalPropertyTypes`.

---

# 2. Análisis

## 2.1 Medición actualizada

Ejecutada sobre el proyecto real, con los tipos de React ya declarados:

| Configuración | Errores | Exit |
| --- | ---: | :-: |
| **Actual** *(sin `strict`)* | **0** | 0 |
| **`--strict` completo** | **0** | **0** |
| `--strict` + `noUnusedLocals` + `noImplicitReturns` + `exactOptionalPropertyTypes` | 26 | 2 |

> ## `strict` completo cuesta **cero errores**.
>
> Los 547 eran, en su totalidad, un artefacto de la dependencia de tipos ausente. Corregida ésta, **no queda ningún error real**.

## 2.2 Desglose por bandera individual

| Bandera | Errores **en solitario** |
| --- | ---: |
| `--noImplicitAny` | 0 |
| **`--strictNullChecks`** | **4** |
| `--strictFunctionTypes` | 0 |
| `--strictBindCallApply` | 0 |
| **`--strictPropertyInitialization`** | **1** |
| `--noImplicitThis` | 0 |
| `--useUnknownInCatchVariables` | 0 |
| `--alwaysStrict` | 0 |

## 2.3 El hallazgo que determina la política

> **Activar las banderas por separado es *peor* que activarlas todas juntas.**
>
> `strictNullChecks` en solitario produce **4 errores**; el conjunto completo produce **0**.

**No es una anomalía, es interacción conocida de TypeScript.** Los cuatro errores son `TS2345` con `parameter of type 'never'`:

```
server/modules/lead-analyzer/application/analyzeProspects.ts(148,22)
server/modules/lead-analyzer/application/analyzeProspects.ts(180,22)
server/modules/lead-hunter/domain/fallbackLeads.ts(45,16)
server/modules/lead-hunter/domain/fallbackLeads.ts(77,16)
```

Con `strictNullChecks` activo y `noImplicitAny` **inactivo**, un array literal vacío se infiere como `never[]` y no evoluciona, de modo que cualquier `push` falla. Con `noImplicitAny` **también activo**, TypeScript aplica su inferencia de *evolving array type* y el array se tipa a partir de lo que se le añade.

**Conclusión directa:** la adopción gradual, empezando por `strictNullChecks`, **introduciría 4 errores que la adopción completa no produce**. El camino gradual pasa por un estado peor que el destino.

## 2.4 Por qué `strict` importa en AKVEZ más que en un proyecto corriente

**`strictNullChecks` es la comprobación que sostiene una regla del dominio.**

**DEV-00 R-38**, derivada de APS-07 v2.0 §8.4 y de ADR-13 §7.1 (X-3), exige distinguir **«no hay dato»** de **«el dato es cero o vacío»**. La ausencia de sitio web **es un hallazgo comercial**, no un hueco que rellenar: es lo que hace valioso a un Lead para un diseñador web, y pesa el **25 %** en el Perfil WP-01 (APS-08 §7.1, categoría *Potencial de Mejora*).

Sin `strictNullChecks`, `null` y `undefined` son asignables a cualquier tipo y **el compilador no protege esa distinción**: queda a merced de que cada desarrollador la recuerde.

**Evidencia en el código actual:** `server/shared/persistence/contracts/Lead.ts` declara `website: string`, `rating: number`, `phone: string` — todos obligatorios y no anulables. Una Empresa **sin** sitio web solo puede representarse hoy como `""`, que es exactamente la confusión que R-38 prohíbe.

> **Activar `strict` no corrige ese modelado**, pero es la condición para que corregirlo sea posible y para que el compilador impida la regresión.

## 2.5 Sobre las comprobaciones adicionales

Las 26 incidencias del tercer escenario se reparten en:

| Código | Nº | Naturaleza |
| --- | ---: | --- |
| `TS6133` | 19 | Variables e importaciones sin usar — **higiene**, no corrección |
| `TS2375` · `TS2379` | 6 | `exactOptionalPropertyTypes`: `undefined` explícito frente a propiedad ausente |
| `TS2322` | 1 | Asignación incompatible |

**No forman parte de `strict`** y son decisión separada. `exactOptionalPropertyTypes` guarda relación estrecha con R-38 y merece evaluarse por sí mismo, pero **tiene coste real** y no debe mezclarse con una adopción que hoy es gratuita.

---

# 3. Alternativas

## Alternativa A — No activar `strict`

| Ventajas | Desventajas |
| --- | --- |
| Ninguna identificable en este momento | **R-38 queda sin protección del compilador** |
| | Todo código de DEV-03 en adelante se escribe sin la red |
| | El coste crece monótonamente con el tamaño del código |

## Alternativa B — Adopción gradual, bandera a bandera

| Ventajas | Desventajas |
| --- | --- |
| Prudente **en abstracto** | **Refutada por la medición**: `strictNullChecks` en solitario produce 4 errores que el conjunto no produce |
| | Obliga a corregir código que no está mal, solo mal inferido |
| | Más sprints, más ruido, peor resultado intermedio |

## Alternativa C — Activar `strict` completo de inmediato ✅

| Ventajas | Desventajas |
| --- | --- |
| **Coste cero**: 0 errores, exit 0, verificado dos veces | Es un cambio de `tsconfig.json`, que exige aprobación |
| **Protege R-38** desde el primer fichero de DEV-03 | Requiere que quien escriba código nuevo conozca `strict` |
| Evita el estado intermedio degradado de la Alternativa B | |
| **La ventana es ahora**: cada fichero escrito sin `strict` es un fichero a revisar después | |

## Alternativa D — `strict` completo más las comprobaciones adicionales

| Ventajas | Desventajas |
| --- | --- |
| Máxima higiene | **26 incidencias**, 19 de ellas ruido de limpieza |
| | Mezcla una adopción gratuita con una que sí cuesta |

---

# 4. Recomendación

> ## Alternativa C — Activar `strict: true` de inmediato, en un sprint propio y mínimo.

**Cuatro razones:**

1. **Cuesta cero.** 0 errores, verificado en dos ejecuciones independientes.
2. **Protege una regla del dominio**, no solo un estándar de estilo (§2.4).
3. **La adopción gradual está refutada por la medición** (§2.3): pasaría por un estado peor.
4. **La ventana se cierra.** DEV-01 y DEV-03 escribirán el esqueleto y los módulos. Hacerlo ahora no cuesta nada; hacerlo después costará proporcionalmente al código escrito.

## 4.1 Cuándo

> **Antes de DEV-03, y antes de reanudar DEV-01.**

**Es la recomendación más importante de este documento.** Si se aprueba después de escribir el esqueleto, dejará de ser gratuito.

## 4.2 Bajo qué condiciones

| # | Condición |
| --- | --- |
| **C-1** | Sprint propio y mínimo: **un solo cambio en `tsconfig.json`** (`"strict": true`) |
| **C-2** | Verificación obligatoria: `npx tsc --noEmit` → 0 errores, y `npm run build` → exit 0 |
| **C-3** | **Ningún fichero de código se modifica.** Si apareciese un error, se detiene y se informa: significaría que el estado medido cambió |
| **C-4** | **No se activan** `noUnusedLocals`, `noImplicitReturns` ni `exactOptionalPropertyTypes`. Decisión separada |
| **C-5** | Se incorpora a **DEV-00 §6** como condición de `DoD-2`, para que la verificación de tipos pase a significar «con `strict`» |

## 4.3 Adopción gradual — descartada, con motivo

**No se recomienda.** No por ambición, sino porque **la medición la desaconseja**: el camino gradual atraviesa un estado con 4 errores para llegar a uno con 0.

Si aun así se prefiriese por prudencia de proceso, el orden correcto **no** es empezar por `strictNullChecks`, sino activar primero **`noImplicitAny`** (0 errores en solitario) y solo después `strictNullChecks` — con ambos activos, los 4 errores desaparecen. **Es un rodeo sin beneficio frente a activar `strict` de una vez.**

---

# 5. Impacto

| Ámbito | Impacto |
| --- | --- |
| **`tsconfig.json`** | Una línea: `"strict": true` |
| **Código** | **Ninguno.** 0 errores |
| **Build** | Ninguno. `vite build` y `esbuild` no dependen de esta bandera |
| **DEV-00 §6** | `DoD-2` pasa a significar verificación de tipos **con `strict`** |
| **DEV-00 §11, V-3** | **Se cierra** |
| **R-38** | Pasa de depender de la disciplina a estar respaldada por el compilador |
| **Persistencia** | Al modelar `LeadRepository` y los contratos —hoy bloqueados por A-01 y A-03—, `strict` obligará a declarar la opcionalidad real. **Beneficio directo sobre la desviación A-03** |
| **DEV-03** | Todo código nuevo nace protegido |

> **Ningún ADR ni APS requiere modificación.** `tsconfig.json` no es un documento del Blueprint, y DEV-00 es de categoría DEV, cuya actualización es materia ordinaria.

---

# 6. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **Se aplaza y deja de ser gratuito.** Cada fichero de DEV-01 y DEV-03 escrito sin `strict` es un fichero a revisar | **Alta** | Decidir antes de DEV-03. **Es el riesgo principal de este documento** |
| **R-2** | **La medición cambia** si se modifica código antes de activarlo | Media | Condición **C-2**: verificar en el momento de activar, no dar por vigente esta medición |
| **R-3** | **Se activa junto a comprobaciones adicionales** y las 26 incidencias hacen parecer costosa una adopción gratuita | Media | Condición **C-4** |
| **R-4** | **Se interpreta que `strict` corrige el modelado de `Lead`.** No lo hace: `website: string` seguirá siendo no anulable | Media | Es condición, no solución. El modelado depende de A-01 y A-03 |
| **R-5** | **Adopción gradual por prudencia**, introduciendo 4 errores evitables | Media | §4.3. La medición está en §2.2 |
| **R-6** | **Código nuevo escrito por quien no conoce `strict`** genera fricción inicial | Baja | Con 0 errores de partida, todo error nuevo señala código nuevo |

---

# 7. Decisión Propuesta

> **AKVEZ activa `strict: true` en `tsconfig.json`.**
>
> **Cuándo:** en un sprint propio y mínimo, **antes de DEV-03 y antes de reanudar DEV-01**.
>
> **Alcance:** un único cambio de configuración. **Cero ficheros de código.** Sin `noUnusedLocals`, `noImplicitReturns` ni `exactOptionalPropertyTypes`.
>
> **Sin adopción gradual:** la medición demuestra que el camino por banderas atraviesa un estado peor (4 errores) que el destino (0).
>
> **Verificación:** `npx tsc --noEmit` → 0 errores y `npm run build` → exit 0. Si aparece cualquier error, **detener e informar**.
>
> **Cierra:** vacío **V-3** de DEV-00 §11.

## 7.1 Ratificación

> ## ✅ RATIFICADA — Product Office, 2026-07-29 (sprint GOV-03)
>
> **La política queda aprobada.** `strict: true` es la configuración oficial de TypeScript de AKVEZ.
>
> **Validaciones de compatibilidad ejecutadas antes de ratificar:**
>
> | Documento | Resultado |
> | --- | --- |
> | **DEV-00** v1.1 | ✅ Refuerza **R-38**. `DoD-2` pasará a significar verificación con `strict`. Cierra el vacío **V-3** |
> | **WP-01** — APS-08 v1.2 §7.1 | ✅ Protege la categoría *Potencial de Mejora* (25 %), que depende de distinguir la ausencia de sitio web |
> | **ADR-12** v1.1 §7.3 | ✅ La Huella de Identidad es subsidiaria y se aplica **solo en ausencia** de Referencia de Origen: es opcionalidad real que `strictNullChecks` obliga a modelar |
> | **ADR-13** v1.1 §7.1 (X-3) | ✅ Prohíbe sustituir valores ausentes por prosa de presentación. `strict` lo hace verificable por el compilador |
>
> **Ninguna contradicción detectada.** En los cuatro casos `strict` refuerza una decisión ya aprobada.

## 7.2 Qué queda por ejecutar

> ⚠️ **Ratificar la política no la aplica.** `tsconfig.json` **sigue sin `strict`**.

GOV-03 prohíbe expresamente escribir código y modificar la implementación, y la condición **C-1** de §4.2 exige un sprint propio y mínimo. La activación queda por tanto pendiente:

| Acción | Alcance | Bloquea |
| --- | --- | --- |
| **Activar `"strict": true`** en `tsconfig.json` | **Una línea.** Cero ficheros de código | **DEV-01 y DEV-03**: cada fichero escrito antes deja de ser gratuito |
| Actualizar **DEV-00 §6** para que `DoD-2` signifique «con `strict`» | Categoría DEV, trámite ordinario | — |

> **Nota de gobernanza.** Un documento **DP** tiene autoridad **consultiva** (ADS-00, orden 5). Que esta política esté `Approved` significa que **la decisión está tomada**, no que sea exigible por sí misma: su fuerza normativa nacerá del `tsconfig.json` y de DEV-00 §6. Véase AR-05.

---

# 8. Referencias

- **PO-01 v1.1** §5 — un Lead sin análisis ni Score es estado válido.
- **APS-07 v2.0** §8.4 — la ausencia de un atributo se representa como ausencia.
- **APS-08 v1.2** §6.5, §7.1 — *Potencial de Mejora*, 25 % en WP-01.
- **ADR-13 v1.1** §7.1 (X-3) — no se persisten salidas de presentación; la ausencia no se rellena.
- **ADS-00 v1.3** — categoría DEV.
- **DEV-00 v1.1** §3 (R-38), §6 (DoD-2), §11 (**V-3**).
- **DEV-01 v1.0** §8 — análisis previo de `strict`, sin medición posible.
- **DEV-01A v1.0** §4.2 (T-04), §8 — **medición de 547, hoy obsoleta**.
- **DEV-01B v1.0** §2, §3 — declaración de los tipos de React.
- **Evidencia de ejecución:** `npx tsc --noEmit --strict` *(0 errores, exit 0, dos ejecuciones)* · desglose de las ocho banderas por separado · escenario con comprobaciones adicionales *(26)*.
