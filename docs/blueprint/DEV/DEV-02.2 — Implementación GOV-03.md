# DEV-02.2 — Implementación de las Decisiones Ratificadas en GOV-03

| Campo | Valor |
| --- | --- |
| Código | DEV-02.2 |
| Clasificación | **DEV** — AKVEZ Development Standard *(orden 8, ADS-00 v1.3)* |
| Versión | 1.0 |
| Estado | **Draft** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Engineering |
| Requiere aprobación de | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-02.2 — Implementación GOV-03** |
| Autoridad de referencia | DP-02 v1.1 · DP-03 v1.1 · DP-04 v1.1 · AR-05 v1.0 |
| Naturaleza | **Registro de ejecución.** No contiene reglas ni introduce arquitectura |

> **Este documento no decide nada.** Registra qué se ejecutó de las decisiones ratificadas en GOV-03, qué no pudo ejecutarse y por qué. Toda afirmación de alcance remite al DP que la gobierna.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Engineering | Ejecución de la acción 1 de AR-05 §5: activación de `strict: true`. Registro de las tres acciones que no corresponden a un sprint de código y de una desviación adicional no prevista en el enunciado. | Sprint DEV-02.2. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Lo Ejecutado — DP-04
3. Lo No Ejecutado, y Por Qué
4. Ficheros Modificados
5. Verificaciones
6. Reglas DEV Cumplidas
7. Desviaciones Abiertas
8. Hallazgos Reportados, No Implementados
9. Riesgos
10. Decisiones Requeridas
11. Criterios de Aceptación
12. Referencias

---

# 1. Resumen Ejecutivo

**Se ejecutó una sola de las cuatro tareas del enunciado, y es la única que los documentos ratificados permiten ejecutar como código.**

| # | Tarea del enunciado | Resultado | Fundamento |
| --- | --- | --- | --- |
| **1** | **DP-04 — Strict Mode** | ✅ **EJECUTADA.** `"strict": true` activo. **0 errores** | DP-04 §7, C-1 a C-5 |
| **2** | **DP-02 — Regularizar logging / observabilidad** | ⚠️ **Nada que ejecutar en código.** La duplicación no existe. La regularización es documental | DP-02 §5.2, §6, §8.2 |
| **3** | **DP-03 — Introducir `Result<T>`** | ⛔ **CERO cambios, por decisión ratificada.** DP-03 decidió **no crear `Result<T>`** | DP-03 §7, §7.1 |
| **4** | **Resolver A-04** | ⛔ **BLOQUEADA.** Exige modificar ADR-04 §11 | DP-02 §6 · AR-05 §5, acción 3 |

## 1.1 La precisión que gobierna este informe

> **El enunciado del sprint parte, en tres de sus cuatro puntos, de una premisa que los documentos ratificados no sostienen.**

No es un defecto del enunciado: es la consecuencia directa de lo que AR-05 §1.1 ya advirtió — **ratificar un DP fija la decisión, no la hace exigible**, y buena parte del trabajo derivado de GOV-03 es **documental, no de código**.

| Premisa del enunciado | Lo que dice el documento ratificado |
| --- | --- |
| «activar `strict` **y** `strictNullChecks`» | DP-04 §2.3 **refuta** la activación por banderas: `strictNullChecks` en solitario produce 4 errores que el conjunto no produce. C-1 exige **un solo cambio**: `"strict": true` |
| «realizar las correcciones necesarias para que el proyecto compile» | DP-04 **C-3**: «**Ningún fichero de código se modifica.** Si apareciese un error, se detiene y se informa» |
| «Introducir el contrato `Result<T>`» | DP-03 §7.1: «**No se crea `Result<T>` común**». B5 de DEV-02 quedó **desestimado** |
| «Eliminar cualquier duplicación entre logging y observability» | **La duplicación nunca existió.** `shared/logging/` no se creó jamás (DP-02 §8.1) |
| Desviaciones restantes esperadas: A-01, A-02, A-03, T-14 | **A-04 sigue abierta.** Su cierre exige ADR-04 v1.3, prohibido en un sprint de código |

**Ninguna de estas discrepancias se resolvió por iniciativa propia.** En cada caso prevaleció el documento ratificado, conforme a la regla de precedencia de DEV-00 y a las Restricciones Absolutas del proyecto.

## 1.2 Alcance real del cambio

> **Una línea en `tsconfig.json`. Cero ficheros de código.**

Es **exactamente** lo que DP-04 §4.2 C-1 exige: «Sprint propio y mínimo: un solo cambio en `tsconfig.json`».

---

# 2. Lo Ejecutado — DP-04

## 2.1 El cambio

```diff
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
+ "strict": true,
  "skipLibCheck": true,
```

## 2.2 Por qué no se añadió `strictNullChecks` por separado

El enunciado pedía activar ambas banderas. **No se añadió `strictNullChecks` como entrada propia**, por dos razones concurrentes:

1. **Es redundante.** `strict: true` la activa. Verificado sobre la configuración efectiva del compilador (§5.2): `strictNullChecks: true`.
2. **Declararla por separado insinúa la adopción gradual que DP-04 §4.3 descarta expresamente**, y contraviene C-1, que exige *un solo cambio*.

> **El requisito funcional del enunciado queda satisfecho:** `strictNullChecks` está activo y verificado. Lo que no se hizo fue expresarlo de una forma que el documento ratificado desaconseja.

## 2.3 Por qué no se corrigió ningún fichero

**No hubo nada que corregir.** La medición de DP-04 §2.1 se confirmó sobre el estado actual del repositorio:

| Comprobación | Resultado |
| --- | --- |
| `npx tsc --noEmit` **antes** del cambio | 0 errores, exit 0 |
| `npx tsc --noEmit` **después** del cambio | **0 errores, exit 0** |

La cláusula «realizar únicamente las correcciones necesarias para que el proyecto compile» quedó por tanto **vacía de contenido**. Es el resultado que DP-04 predijo y la condición C-3 exigía: si hubiese aparecido un error, este sprint se habría detenido en lugar de corregirlo.

## 2.4 Comprobaciones adicionales — no activadas

Conforme a **C-4**, **no** se activaron `noUnusedLocals`, `noImplicitReturns` ni `exactOptionalPropertyTypes`. Verificado en la configuración efectiva: las tres siguen ausentes. Las 26 incidencias de DP-04 §2.5 quedan fuera de este sprint, como decisión separada.

---

# 3. Lo No Ejecutado, y Por Qué

## 3.1 DP-02 — Logging y observabilidad

### 3.1.1 La duplicación no existe

Verificado por inspección del árbol de ficheros:

| Comprobación | Resultado |
| --- | --- |
| ¿Existe `server/shared/logging/`? | ❌ **No.** No existe, y nunca existió |
| ¿Existe algún fichero o carpeta `*logging*` / `*logger*`? | ❌ **Ninguno** en `server/` ni en `src/` |
| ¿Existe `server/shared/observability/`? | ✅ Sí — `executionReport.ts`, único fichero |

> **No hay duplicación que eliminar.** El riesgo **RC-4** de AR-05 —«se crea `shared/logging/` por costumbre»— **no se ha materializado**. La tarea se cierra por verificación, no por implementación.

### 3.1.2 La regularización pendiente es documental, no de código

DP-02 §5.2 es explícito sobre el impacto en el código:

> «**Ninguno inmediato.** La arquitectura propuesta **describe lo que ya existe** y le añade una regla de acceso que el código ya cumple. No exige migración ni renombrado.»

Se verificó que el código **ya cumple** la regla de acceso aprobada en DP-02 §4.1:

| Capa importadora | Ficheros | ¿Permitida? |
| --- | ---: | --- |
| `application/` | 3 | ✅ Sí |
| `infrastructure/` | 3 | ✅ Sí |
| `routes/` | 2 | ✅ Sí |
| `shared/ai/` | 2 | ✅ Sí |
| **`domain/`** | **0** | ✅ **Regla O-4 cumplida** |

**Total: 10 importadores.** DP-02 §1.2 registró 9; la diferencia es de recuento —`shared/ai` aporta dos ficheros, no uno—, no un importador nuevo. **Ninguno es `domain/`**, que es lo que la regla O-4 exige.

### 3.1.3 El contrato de sink — detenido

El enunciado pedía «implementar exactamente la estructura aprobada». **No existe una estructura aprobada con ese grado de concreción.** DP-02 §4.1 la enuncia expresamente **«sin prescribir ficheros»**:

> «Un **contrato de sink** provider-agnóstico, una implementación por consola como sink por defecto, y el reporte de ejecución ya existente.»

Implementarlo exigiría decidir, sin cobertura documental:

| Decisión requerida | ¿La cubre DP-02? |
| --- | --- |
| Taxonomía de severidad (niveles de log) | ❌ No |
| Forma del registro/evento que atraviesa el sink | ❌ No |
| Cómo se expresan las cinco salidas de APS-16 §14 en una sola interfaz | ❌ No |
| Si los 23 `console.*` directos migran al sink | ❌ No — **§5.2 dice que no hay migración** |

Concurren además dos razones de gobernanza:

1. **AR-05 §5 clasifica esta acción con urgencia «Baja»** (acción 6), por detrás de la fila de ADR-04 §11 que le da fundamento.
2. **DP-02 §8.2 es terminante:** «Hasta entonces, `shared/observability/` sigue siendo una carpeta no declarada». Añadir un contrato nuevo a una carpeta cuyo documento rector no existe todavía es precisamente el riesgo **RC-2**.

> **Se aplicó la cláusula de detención del enunciado.** Un sink que nada consume sería, además, deuda técnica nueva — expresamente prohibida por los criterios de aceptación.

## 3.2 DP-03 — `Result<T>`

> ## La decisión ratificada es **no crear `Result<T>`**.

DP-03 §7.1, ratificado por el Product Office el 2026-07-29:

> «**Se adopta la Alternativa C.** **No se crea `Result<T>` común.** Cada módulo conserva su contrato de resultado propio.»

El enunciado pedía introducirlo «únicamente donde el documento ratificado lo exige». **Leído con rigor, el documento ratificado no lo exige en ningún punto.** La implementación correcta de DP-03 es, por tanto, **cero líneas de código**.

Verificado: `Result<` no aparece en ningún fichero `.ts` ni `.tsx` de `server/` ni de `src/`. **El estado del código ya es el que DP-03 ratificó.**

Los contratos que DP-03 §5 ordena **conservar** siguen intactos:

| Contrato | Estado |
| --- | --- |
| `DiscoverProspectsResult` | ✅ Conservado |
| `GenerateOutreachPitchResult` | ✅ Conservado |
| `PitchGeneratorOutcome` | ✅ Conservado |

La única acción de código derivada de DP-03 —alinear la propagación de fallo de `lead-hunter`, hoy por excepción— es la **acción 7 de AR-05 §5**, urgencia «Baja», «sprint posterior», y toca `application/`, que este sprint tiene **prohibido modificar**. No se ejecutó.

## 3.3 A-04 — Bloqueada

El enunciado condicionaba la tarea: «Resolver A-04 si su solución quedó definida en DP-02. **Si requiere una decisión distinta, detenerse.**»

**La solución está definida, pero no es de código.** DP-02 §6 la especifica sin ambigüedad:

| Campo | Detalle |
| --- | --- |
| **Documento** | **ADR-04 — Backend Agent Architecture** |
| **Sección** | §11 — Servicios Compartidos |
| **Cambio** | Añadir la fila de `shared/observability` con su regla de acceso |
| **Versión resultante** | ADR-04 **v1.3** |

**No se ejecutó**, por tres restricciones concurrentes:

1. **Restricción Absoluta del proyecto:** no modificar el Blueprint ni tomar decisiones de arquitectura sin aprobación. Un ADR es documento **vinculante de orden 4**.
2. **El propio enunciado** prohíbe modificar «contratos públicos» y advierte de no introducir cambios arquitectónicos.
3. **AR-05 §5, acción 3** la asigna a un sprint propio y declara: «**A-04 permanece abierta hasta entonces**».

> **A-04 no se puede cerrar desde el código.** Es una desviación **documental**: consiste exactamente en que una carpeta que existe no está declarada en un ADR. Ningún cambio de código la resuelve.

---

# 4. Ficheros Modificados

## 4.1 Modificados por este sprint

| Fichero | Cambio | Líneas | Motivo |
| --- | --- | ---: | --- |
| `tsconfig.json` | `+ "strict": true` | **+1** | DP-04 §7 · AR-05 §5, acción 1 |

## 4.2 Creados

| Fichero | Motivo |
| --- | --- |
| `docs/blueprint/DEV/DEV-02.2 — Implementación GOV-03.md` | Este informe. Entregable 1 del sprint |

## 4.3 Eliminados

**Ninguno.**

## 4.4 Constancia expresa

> **Cero ficheros de código creados, modificados o eliminados.**

El árbol de trabajo contiene otras diferencias frente a `HEAD` —`package.json`, `server.ts`, `src/**`, la reestructuración de `server/`—. **Son preexistentes**, procedentes de DEV-01 y DEV-02, y **este sprint no las tocó**. La totalidad de su aportación al diff es la línea de `tsconfig.json`.

Se empleó una herramienta de verificación de ciclos de importación (§5.4) escrita **fuera del repositorio**, en el directorio temporal de la sesión, para no introducir ficheros no aprobados ni dependencias nuevas.

---

# 5. Verificaciones

## 5.1 Las cuatro comprobaciones obligatorias del enunciado

| # | Comprobación | Comando | Resultado |
| --- | --- | --- | --- |
| **1** | Compilación de tipos | `npx tsc --noEmit` | ✅ **0 errores**, exit **0** |
| **2** | Build completo | `npm run build` | ✅ exit **0** — `vite build` + `esbuild` |
| **3** | La aplicación inicia | `node dist/server.cjs` | ✅ Escucha en `:3000` · `GET /` → **HTTP 200** |
| **4** | Dependencias circulares | Análisis del grafo de imports | ✅ **0 ciclos** — 76 ficheros, 107 aristas |

**Cumple C-2 de DP-04 §4.2** en sus dos extremos: `tsc --noEmit` → 0 errores **y** `npm run build` → exit 0.

## 5.2 Configuración efectiva del compilador

Extraída con `npx tsc --showConfig`, no de la lectura del fichero:

| Bandera | Estado | Nota |
| --- | :-: | --- |
| `strict` | ✅ `true` | El cambio de este sprint |
| `noImplicitAny` | ✅ `true` | Implícita. **Es la que anula los 4 errores** de DP-04 §2.3 |
| `strictNullChecks` | ✅ `true` | Implícita. **Requisito del enunciado, satisfecho** |
| `strictFunctionTypes` | ✅ `true` | Implícita |
| `strictBindCallApply` | ✅ `true` | Implícita |
| `strictPropertyInitialization` | ✅ `true` | Implícita |
| `alwaysStrict` | ✅ `true` | Implícita |
| `noUnusedLocals` | ⬜ ausente | **C-4** — no activada |
| `noImplicitReturns` | ⬜ ausente | **C-4** — no activada |
| `exactOptionalPropertyTypes` | ⬜ ausente | **C-4** — no activada |

## 5.3 Ausencia de cambio funcional

> **Evidencia objetiva:** los artefactos de `vite build` conservan **hash idéntico** antes y después del cambio.

| Artefacto | Antes | Después |
| --- | --- | --- |
| `assets/index-Xy_ZDvkP.css` | 38.77 kB | **38.77 kB — mismo hash** |
| `assets/index-D0O7ouy9.js` | 265.92 kB | **265.92 kB — mismo hash** |
| `dist/server.cjs` | 56.8 kb | **56.8 kb** |

`strict` es una bandera de **verificación**, no de emisión: no altera el JavaScript producido. La identidad de los hashes lo confirma empíricamente, y sostiene el criterio «sin cambios funcionales» con evidencia y no con una afirmación.

## 5.4 Ausencia de violaciones arquitectónicas nuevas

| Comprobación | Resultado |
| --- | --- |
| Ciclos de importación | ✅ **0** |
| **O-4** — `domain/` no importa observabilidad | ✅ **0 importadores** en `server/modules/*/domain/` |
| Regla de acceso de DP-02 §4.1 | ✅ Los 10 importadores están en capas permitidas |
| `shared/logging/` creada | ✅ **No** — RC-4 no materializado |
| `Result<T>` introducido | ✅ **No** — conforme a DP-03 §7.1 |
| Dependencias nuevas en `package.json` | ✅ **Ninguna** |
| Contratos públicos alterados | ✅ **Ninguno** |

**No se introdujo ninguna violación nueva.** Este sprint no modificó ningún import.

---

# 6. Reglas DEV Cumplidas

| Regla / Criterio | Cómo se cumplió |
| --- | --- |
| **DEV-00 R-04** — `domain/` no importa nada externo a su módulo | Verificado: 0 importadores de observabilidad en `domain/`. Refuerza **O-4** |
| **DEV-00 R-38** — un atributo ausente se representa como ausente | **Pasa a estar respaldada por el compilador.** Es el beneficio de dominio que DP-04 §2.4 identifica como fundamento de la decisión |
| **DEV-00 DoD-1** — el cambio cumple su objetivo | ✅ `strict` activo |
| **DEV-00 DoD-2** — verificación de tipos | ✅ `npm run lint` (`tsc --noEmit`) → 0 errores. **Desde ahora significa «con `strict`»** |
| **DEV-00 DoD-3** — tests | ⚠️ No exigible — vacío **V-1**, sin runner decidido |
| **DEV-00 DoD-4** — lint | ⚠️ No exigible — vacío **V-2**, sin linter en el proyecto |
| **DEV-00 §11, V-3** — `tsconfig.json` no activa `strict` | ✅ **CERRADO en el código.** Su constancia documental corresponde a DEV-00 §11 |
| **DEV-00, regla de precedencia** | Aplicada en las cinco discrepancias de §1.1: prevaleció el documento ratificado, no el enunciado |
| **Restricciones Absolutas** — no modificar el Blueprint, no decidir arquitectura | ✅ Ningún ADR, APS ni ADS alterado. A-04 detenida por esta razón |

## 6.1 Sobre R-38 — precisión necesaria

`strict` **no corrige** el modelado de `Lead`. `server/shared/persistence/contracts/Lead.ts` sigue declarando `website: string`, `rating: number` y `phone: string` como obligatorios y no anulables, de modo que una Empresa sin sitio web solo puede representarse como `""` — la confusión que R-38 prohíbe.

> **Es el riesgo R-4 de DP-04, y sigue vigente.** `strict` es la **condición** para corregirlo y la garantía de que no habrá regresión, no la corrección. Ésta depende de **A-01** y **A-03**, ambas abiertas.

---

# 7. Desviaciones Abiertas

## 7.1 Listado real

> ⚠️ **Son cinco, no cuatro.** El enunciado esperaba A-01, A-02, A-03 y T-14.

| # | Desviación | Estado | Quién decide | Por qué sigue abierta |
| --- | --- | :-: | --- | --- |
| **A-01** | `LeadStatus` incluye `'Prospect'`, `'Stale'`, `'Won'`, `'Replied'`, contra PO-01 §8 y ADR-11 §9 E-5 | 🔴 Abierta | **Product Office** | Fuera de alcance. El enunciado prohíbe tocar `LeadStatus` |
| **A-02** | `application/` importa un Persistence Contract | 🔴 Abierta | **Architecture Team** | Exige decidir dónde reside la entidad `Lead` de `lead-analyzer` |
| **A-03** | `LeadRepository` no expresa la identidad `(Referencia de Origen, Usuario)` ni la Unidad de Registro atómica | 🔴 Abierta | **Architecture Team** | Fuera de alcance. El enunciado prohíbe tocar `LeadRepository` |
| **A-04** | `shared/observability/` existe sin estar declarada en ADR-04 §11 | 🔴 **Abierta** | **Architecture Team** | **Exige ADR-04 v1.3.** Ningún cambio de código la cierra — §3.3 |
| **T-14** | Puerto fijado en código; `process.env.PORT` ignorado | 🔴 Abierta | — | Fuera de alcance por instrucción expresa |

## 7.2 La discrepancia con el listado esperado

**A-04 no pudo cerrarse, y su cierre no era posible en este sprint.**

AR-05 lo había anticipado con precisión en su riesgo **RC-3**:

> «**A-04 se considera cerrada** porque DP-02 está ratificado, cuando ADR-04 §11 sigue sin la fila.»

> **Este informe evita que RC-3 se materialice.** Declarar A-04 cerrada porque DP-02 está `Approved` sería confundir una decisión tomada con una norma vigente — el riesgo **RC-2**, que AR-05 §4 califica de riesgo de gobernanza propio del cierre.

**Confirmación de T-14, sin corregirlo:** `server/bootstrap/startServer.ts:10` declara `const PORT = 3000;` y `process.env.PORT` no se lee. Verificado por inspección; **no modificado**, conforme a la instrucción «No resolver T-14».

## 7.3 Ninguna desviación nueva

**No se introdujo ninguna.** El único cambio es una bandera de compilador que no altera imports, firmas, contratos ni estructura de carpetas.

---

# 8. Hallazgos Reportados, No Implementados

> Conforme a los Principios de Trabajo: **se reportan, no se implementan.**

## 8.1 H-1 — La regla O-5 no se cumple hoy en 23 puntos

**Severidad: Media.** **No es una regresión de este sprint**, y su corrección está **excluida** del alcance.

DP-02 §4.3, regla **O-5**, aprobada en la ratificación:

> «El proveedor concreto reside **solo** en el sink. Ninguna capa observada lo nombra.»

**El código nombra el proveedor directamente en 23 puntos** de capas observadas:

| Ubicación | Llamadas `console.*` |
| --- | ---: |
| `server/modules/lead-hunter/infrastructure/groundingSearchAdapter.ts` | 6 |
| `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts` | 4 |
| `server/modules/lead-hunter/application/discoverProspects.ts` | 3 |
| `server/modules/pitch-generator/application/generateOutreachPitch.ts` | 2 |
| `server/routes/prospectSearchRoute.ts` | 2 |
| `server/modules/lead-analyzer/application/analyzeProspects.ts` | 1 |
| `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts` | 1 |
| `server/modules/pitch-generator/infrastructure/pitchGenerationAdapter.ts` | 1 |
| `server/routes/prospectOutreachRoute.ts` | 1 |
| `server/shared/ai/generateWithRetry.ts` | 1 |
| `server/bootstrap/startServer.ts` | 1 |
| **Total en capas observadas** | **23** |

*(3 llamadas más en arneses de prueba y 3 en el frontend, no contabilizadas como capa observada.)*

**Por qué no se corrigió:**

1. **DP-02 §5.2 excluye la migración:** «No exige migración ni renombrado».
2. Corregirlo exige modificar `application/`, `infrastructure/` y `routes/` — **prohibido por el enunciado**.
3. Exige antes el contrato de sink, detenido en §3.1.3.

> **Es la deuda real que DP-02 deja abierta**, y conviene que conste: la regla O-5 está aprobada y el código no la cumple. **Sustituir `console` por Pino u OpenTelemetry exigiría hoy tocar 23 puntos en tres capas**, que es exactamente la sustituibilidad que O-5 pretende garantizar. El coste crece con el código.

## 8.2 H-2 — Acciones documentales pendientes de GOV-03

**No ejecutadas: este sprint es de código, y su entregable es este informe.** Se listan para que no se pierdan.

| # | Acción | Documento | Origen |
| --- | --- | --- | --- |
| **1** | `DoD-2` pasa a significar «con `strict`» | **DEV-00 §6** | DP-04 **C-5** · AR-05 §5, acción 2 |
| **2** | Registrar **V-3** como cerrado | **DEV-00 §11** | DP-04 §5 |
| **3** | **Añadir la fila de `shared/observability`** | **ADR-04 §11** → v1.3 | DP-02 §6 · AR-05 §5, acción 3. **Cierra A-04** |
| **4** | Incorporar las reglas **O-1 a O-6** | **DEV-00 §3** | DP-02 §8.2 · AR-05 §5, acción 4 |
| **5** | Incorporar la regla de propagación de errores | **DEV-00 §3** | DP-03 §7.2 · AR-05 §5, acción 5 |

> **La acción 1 tiene una consecuencia inmediata:** `DoD-2` ya se comporta «con `strict`» en la práctica, porque `npm run lint` ejecuta `tsc --noEmit` sobre el `tsconfig.json` modificado. **DEV-00 §6 todavía no lo dice.** Conviene alinearlo pronto para que el documento no describa un estado que el código ya superó.

## 8.3 H-3 — `package.json` conserva el nombre `react-example`

**Severidad: Baja.** `package.json` declara `"name": "react-example"`, y `startServer.ts:36` imprime «Servidor **LeadFlow** corriendo…». Ninguno de los dos nombra AKVEZ. **No se modificó**: es higiene de identidad fuera del alcance aprobado.

---

# 9. Riesgos

## 9.1 Riesgos cerrados por este sprint

| # | Riesgo | Origen | Estado |
| --- | --- | --- | --- |
| **RC-1** | «`strict` se ratifica pero no se activa, y deja de ser gratuito» | AR-05 §8 · DP-04 R-1 | ✅ **CERRADO.** Activado con coste 0 |
| **R-2** (DP-04) | «La medición cambia si se modifica código antes de activarlo» | DP-04 §6 | ✅ **CERRADO.** Remedido en el momento de activar: 0 errores |
| **R-3** (DP-04) | «Se activa junto a comprobaciones adicionales» | DP-04 §6 | ✅ **CERRADO.** C-4 respetada |
| **R-5** (DP-04) | «Adopción gradual, introduciendo 4 errores evitables» | DP-04 §6 | ✅ **CERRADO.** Sin adopción gradual — §2.2 |

## 9.2 Riesgos que siguen abiertos

| # | Riesgo | Severidad | Nota |
| --- | --- | :-: | --- |
| **RC-3** | «A-04 se considera cerrada porque DP-02 está ratificado» | Media | **Mitigado por §7.2**, no cerrado. Requiere ADR-04 v1.3 |
| **RC-2** | «Un DP `Approved` se cita como norma vinculante» | **Alta** | **Es el riesgo central de este sprint.** Tres de sus cuatro tareas lo asumían |
| **RC-7** | A-01, A-02 y A-03 abiertas mientras DEV-03 avanza | **Alta** | Sin cambios. **Bloquean el modelado que R-38 necesita** (§6.1) |
| **RC-5** | La regla de propagación de errores no la verifica el compilador | **Alta** | Agravada: la regla no consta aún en DEV-00 §3 |
| **RC-9 / V-4** | Sin verificación automática de fronteras | **Alta** | La comprobación de ciclos de §5.4 fue **manual y desechable**, no un control del proyecto |
| **R-4** (DP-04) | «Se interpreta que `strict` corrige el modelado de `Lead`» | Media | **Vigente.** Explicitado en §6.1 |
| **R-1** (DP-02) | «Alguien crea `logging/` por costumbre» | Media | Vigente mientras ADR-04 §11 no lo prohíba por escrito |

## 9.3 Riesgo nuevo introducido por este sprint

| # | Riesgo | Severidad | Mitigación |
| --- | --- | :-: | --- |
| **RN-1** | **Código nuevo escrito por quien no conoce `strict`** genera fricción, ahora que la red está activa | **Baja** | Es el R-6 de DP-04, previsto y aceptado en la ratificación. Con 0 errores de partida, **todo error nuevo señala inequívocamente código nuevo** — que es la propiedad buscada |

> **Ninguna deuda técnica nueva.** No se añadió código muerto, ni dependencias, ni abstracciones sin consumidor.

---

# 10. Decisiones Requeridas

**Ninguna decisión nueva de arquitectura.** Las tres del bloque GOV-03 están tomadas. Lo que se requiere es **autorización de trámite** para descenderlas a documentos vinculantes:

| # | Qué se requiere | De quién | Bloquea |
| --- | --- | --- | --- |
| **1** | Autorizar la revisión **aditiva** de **ADR-04 §11** (fila de `shared/observability`) → v1.3. Cambio **Menor** por APS-13 §9 | **Architecture Team** | **El cierre de A-04** |
| **2** | Autorizar la actualización de **DEV-00** §3, §6 y §11 (reglas O-1 a O-6, regla de propagación, `DoD-2`, V-3) | **Product Office** | La exigibilidad de las tres decisiones |
| **3** | Decidir si el **contrato de sink** se implementa antes o después de ADR-04 v1.3, y con qué taxonomía de severidad | **Architecture Team** | H-1 (§8.1), replanteo de B4 |

> **Recomendación:** ejecutar **1 y 2 en un mismo sprint documental**. Son aditivos, no alteran ninguna decisión y cierran A-04 junto con la exigibilidad de las tres ratificaciones. La **3** debería ir después: implementar el sink antes de que exista la fila de ADR-04 §11 es precisamente el riesgo RC-2.

---

# 11. Criterios de Aceptación

| Criterio del enunciado | Resultado | Evidencia |
| --- | :-: | --- |
| `strict` activo | ✅ | §5.2 — `strict`, `strictNullChecks` y las demás verificadas en la configuración efectiva |
| El proyecto compila | ✅ | `tsc --noEmit` → **0 errores** · `npm run build` → exit **0** |
| `Result<T>` implementado donde corresponde | ✅ | **Corresponde en cero puntos.** DP-03 §7.1 ratificó no crearlo — §3.2 |
| Logging regularizado | ⚠️ **Parcial** | Sin duplicación y con O-4 cumplida (§3.1.1, §3.1.2). **La regularización formal es documental** y exige ADR-04 v1.3 |
| Sin cambios funcionales | ✅ | §5.3 — **hash idéntico** de los artefactos de build |
| Sin cambios arquitectónicos | ✅ | Ningún ADR, APS ni ADS alterado. Ningún import modificado |
| Sin deuda técnica nueva | ✅ | Cero código añadido. H-1 es **preexistente**, no introducida |
| Desviaciones restantes: A-01, A-02, A-03, T-14 | ❌ **No se cumple** | **Son cinco: A-04 incluida.** Su cierre exige ADR-04 v1.3 — §7.2 |
| Aplicación inicia | ✅ | `GET /` → **HTTP 200** |
| Sin dependencias circulares | ✅ | **0 ciclos** en 76 ficheros / 107 aristas |

## 11.1 Valoración

**Ocho de los diez criterios se cumplen íntegramente.** Los dos restantes **no son incumplimientos de ejecución**: son la consecuencia de que el enunciado esperaba de un sprint de código un resultado que solo un sprint documental puede producir.

> **La alternativa habría sido modificar ADR-04 §11 sin autorización.** Eso sí habría vulnerado una Restricción Absoluta.

---

# 12. Referencias

- **DP-02 v1.1** §1.2, §4.1, §4.3 (O-1 a O-6), §5.2, **§6**, §8.1, **§8.2** — logging y observabilidad. **Fundamento de §3.1 y §3.3.**
- **DP-03 v1.1** §5, **§7**, **§7.1**, §7.2 — sin `Result<T>` común. **Fundamento de §3.2.**
- **DP-04 v1.1** §2.1, §2.3, §2.4, §2.5, §4.2 (**C-1 a C-5**), §4.3, §5, §6, **§7**, §7.2 — Strict Mode. **Fundamento de §2.**
- **AR-05 v1.0** §1.1, §4, **§5** (acciones 1-7), §5.1, §8 (RC-1 a RC-9) — cierre de GOV-03.
- **ADR-04 v1.2** **§11** — servicios compartidos. **Documento cuya revisión cierra A-04.**
- **ADR-07 v1.1** §8 — «resultado interno propio del módulo».
- **ADR-11 v2.1** §9 E-5 · **PO-01 v1.1** §8 — origen de A-01.
- **APS-03 v3.0** §12 — cuatro categorías de error, ya en `shared/errors`.
- **APS-07 v2.0** §8.4 · **APS-08 v1.2** §7.1 (WP-01) · **APS-16 v1.0** §14 · **APS-11 v1.0** §4.5 · **APS-13 v1.0** §9.
- **ADS-00 v1.3** — Jerarquía Documental, categoría DEV (orden 8), regla R-7.
- **DEV-00 v1.1** §3 (R-04, R-38), §6 (DoD-1 a DoD-4), §9 (RI-1), §11 (V-1, V-2, **V-3**, V-4).
- **DEV-01A v1.0** — origen de A-01 a A-04 y T-14. **DEV-01B v1.0** — baseline corregido.
- **Evidencia de ejecución:** `npx tsc --noEmit` *(0 errores, antes y después)* · `npx tsc --showConfig` · `npm run build` *(exit 0, hashes idénticos)* · `node dist/server.cjs` *(HTTP 200)* · análisis de ciclos *(76 ficheros, 107 aristas, 0 ciclos)* · recuento de importadores de observabilidad *(10, ninguno en `domain/`)* · recuento de `console.*` en capas observadas *(23)*.
