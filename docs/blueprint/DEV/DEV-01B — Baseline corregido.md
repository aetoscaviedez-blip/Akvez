# DEV-01B — Baseline corregido

| Campo | Valor |
| --- | --- |
| Código | DEV-01B |
| Clasificación | **DEV** — AKVEZ Development Standard · Informe de corrección |
| Versión | 1.0 |
| Estado | **Draft** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Requiere aprobación de | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-01B — Corrección del baseline técnico** |

> **Naturaleza.** Informe de ejecución. **No decide nada, no modifica el Blueprint y no altera ninguna decisión arquitectónica.**
>
> **Ningún documento del Blueprint fue modificado.** Los cambios se limitan a cuatro ficheros del proyecto (§2).

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Corrección del baseline: fichero truncado, error de estrechamiento de tipos, declaración de tipos de React y lockfile. Verificación completa de compilación, arranque y fronteras arquitectónicas. | Sprint DEV-01B. Dejar el proyecto compilando y verificable antes de DEV-02. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Archivos Modificados
3. Errores de TypeScript — Antes y Después
4. Resultado de `npm run build` y `tsc`
5. Verificación Arquitectónica
6. Qué se Corrigió
7. Qué Continúa Pendiente
8. Qué Queda Listo para DEV-02
9. Criterios de Aceptación
10. Referencias

---

# 1. Resumen Ejecutivo

**El proyecto compila por completo.** Frontend y backend, con código de salida 0. La aplicación arranca y responde.

**Los cinco bloqueos se resolvieron con dos ediciones de código.** Ninguna introdujo lógica nueva, cambió comportamiento ni tocó arquitectura:

| Tarea | Resultado |
| --- | --- |
| **B-1** — fichero truncado | ✅ Un carácter. Llaves 42/42 |
| **B-2** — errores reales de TypeScript | ✅ **0 errores.** Solo hizo falta corregir uno de los dos |
| **B-3** — tipos de React | ✅ `@types/react` y `@types/react-dom` declarados |
| **B-4** — lockfile | ✅ `package-lock.json` generado y en índice |
| **B-5** — verificación | ✅ Ejecutada. Una desviación conocida persiste, fuera de alcance |

**El hallazgo más útil del sprint:** el segundo error de TypeScript —`LeadHunter.tsx:276`— **no requería tocar ese fichero**. Era un síntoma de los tipos de React ausentes, y desapareció al ejecutar B-3. **Se evitó una modificación innecesaria en la pantalla principal.**

**Se confirma lo que DEV-01A ya apuntaba:** cero dependencias circulares, cero imports sin resolver y **una sola violación de frontera** en 107 aristas. El Composition Root sigue siendo el único importador de adapters.

---

# 2. Archivos Modificados

**Cuatro ficheros. Ninguno de ellos documento del Blueprint.**

| # | Archivo | Cambio | Alcance |
| --- | --- | --- | --- |
| 1 | `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts` | **+1 línea**: `}` de cierre | B-1 |
| 2 | `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts` | **1 token** (`if (result.success)` → `if (result.success === true)`) **+4 líneas de comentario** | B-2 |
| 3 | `package.json` | **+2 entradas** en `devDependencies` | B-3 |
| 4 | `package-lock.json` | **Generado** (150 KB, `lockfileVersion: 3`) y añadido al índice | B-4 |

## 2.1 Ficheros que NO se modificaron, pese a estar implicados

| Archivo | Por qué no |
| --- | --- |
| `src/modules/lead-hunter/presentation/LeadHunter.tsx` | Su error **se resolvió solo** al declarar los tipos de React. No procedía tocarlo |
| `tsconfig.json` | Prohibido por el sprint. `strict` sigue desactivado |
| `server/shared/persistence/**` | Prohibido — `LeadStatus`, `LeadRepository`, Repository Pattern |
| `server/shared/observability/` | Prohibido |
| Cualquier documento del Blueprint | Fuera de alcance |

## 2.2 Verificación de que no se alteró ninguna versión

Comparación del conjunto de dependencias declaradas, antes y después:

| Resultado | Detalle |
| --- | --- |
| **Añadidas** | `@types/react@^19.2.17` · `@types/react-dom@^19.2.3` |
| **Eliminadas o con versión alterada** | **Ninguna** |

> **npm reordenó alfabéticamente los bloques `dependencies` y `devDependencies`.** Es normalización del gestor, no un cambio de versiones: el conjunto es idéntico salvo las dos altas.

**React no se actualizó.** Los tipos se fijaron en el major 19 para corresponder con `react@^19.0.1`.

---

# 3. Errores de TypeScript — Antes y Después

| Momento | Errores | Detalle |
| --- | ---: | --- |
| **Antes del sprint** | **1** *(bloqueante)* | `TS1005` en `googlePlacesAdapter.ts:107`. **Abortaba el análisis**: el resto del proyecto no llegaba a comprobarse |
| **Tras B-1** | **2** | Afloran los errores reales que el fallo de sintaxis ocultaba: `TS2339` en `pitchGeneratorAgent.ts:42` y `TS2322` en `LeadHunter.tsx:276` |
| **Tras B-2 y B-3** | **0** | ✅ |

> **El «1 → 2 → 0» no es un retroceso.** El error inicial impedía a `tsc` analizar el proyecto; corregirlo hizo visible el estado real, que después se saneó por completo.

## 3.1 Sobre la corrección de `pitchGeneratorAgent.ts`

El tipo `GenerateOutreachPitchResult` **ya era una unión discriminada correcta**. El fallo era de estrechamiento: **con `strictNullChecks` desactivado, TypeScript no estrecha esta unión por rama de caída ni por negación.**

Se verificó empíricamente con una sonda de cinco variantes bajo la configuración exacta del proyecto:

| Formulación | ¿Compila? |
| --- | :-: |
| `if (result.success) { … } return …` *(original)* | ❌ |
| `if (result.success) { … } else { … }` | ❌ |
| `if (!result.success) { … }` | ❌ |
| **`if (result.success === true) { … }`** | ✅ |
| `if (result.success === false) { … }` | ✅ |

Se adoptó la comparación explícita con `true`, que es **la mínima intervención posible**: `success` está tipado como `true | false`, de modo que el comportamiento en ejecución es idéntico. Se dejó un comentario explicando por qué la comparación es explícita, para que nadie la «simplifique» y reintroduzca el error.

> **La causa raíz de este error es el `tsconfig` no estricto**, cuya modificación está prohibida en este sprint. Al activarse `strictNullChecks` en su momento, la comparación explícita seguirá siendo válida.

---

# 4. Resultado de `npm run build` y `tsc`

## 4.1 `npx tsc --noEmit`

```
errores: 0
```

## 4.2 `npm run build`

```
vite v6.4.3 building for production...
✓ 1691 modules transformed.
dist/index.html                   0.41 kB │ gzip:  0.28 kB
dist/assets/index-BPrT6VKV.css   38.74 kB │ gzip:  7.24 kB
dist/assets/index-C9qE3Xsy.js   265.92 kB │ gzip: 79.41 kB
✓ built in 3.12s

  dist\server.cjs       56.7kb
  dist\server.cjs.map  132.0kb
⚡ Done in 35ms

exit: 0
```

| Artefacto | Estado |
| --- | --- |
| **Frontend** *(vite)* | ✅ 265.92 kB · 1691 módulos |
| **Backend** *(esbuild)* | ✅ `dist/server.cjs` — 56.7 kB |

## 4.3 Arranque de la aplicación

| Comprobación | Resultado |
| --- | --- |
| Proceso `node dist/server.cjs` | ✅ Arranca y permanece vivo |
| `GET /api/health` | ✅ **HTTP 200** — `{"status":"ok","message":"Servidor LeadFlow activo."}` |
| `GET /` *(frontend servido)* | ✅ **HTTP 200** — 566 bytes |

---

# 5. Verificación Arquitectónica

**Análisis estático sobre 75 ficheros y 107 aristas de import.**

| # | Verificación | Resultado |
| --- | --- | --- |
| 1 | **Dependencias circulares** | ✅ **Ninguna** |
| 2 | **Imports sin resolver** | ✅ **Ninguno** |
| 3 | **Violaciones de frontera** | ⚠️ **Una** — A-02, preexistente y fuera de alcance |
| 4 | **SDK de base de datos fuera de `adapters/`** | ✅ Ninguno |

## 5.1 Confirmaciones específicas exigidas por B-5

| Elemento | Verificación | Estado |
| --- | --- | --- |
| **Composition Root** | `server/bootstrap/compositionRoot.ts` es el **único** importador de `shared/persistence/adapters/` fuera de la propia carpeta. Construye el grafo una vez y no exporta estado mutable | ✅ **Cumple** — ADR-09 §5.1, §5.3, §6 · DEV-00 R-54, R-55, R-58 |
| **Repository Pattern** | `application/` recibe la Repository Interface por inyección; ningún adapter se importa desde un módulo | ✅ **Cumple** — ADR-05 §7 D2 · DEV-00 R-20 |
| **Dependency Rule** | 14 reglas de frontera comprobadas sobre las 107 aristas. **Una violación**, la ya conocida | ⚠️ **Cumple salvo A-02** |
| **Architecture Layers** | `domain/` sin dependencias externas · `orchestrators/` sin HTTP ni DTO · `routes/` sin dominio ni persistencia · `presentation/` sin persistencia | ✅ **Cumple** — ADR-01 §8 · ADR-07 §8 · ADR-08 §10 |

## 5.2 La violación que persiste — A-02

**`server/modules/lead-analyzer/application/analyzeProspects.ts:10`**

```ts
import { Lead } from "../../../shared/persistence/contracts/Lead";
```

Prohibido por ADR-08 §10 y DEV-00 **R-22**.

> **No se corrigió, y la razón no es el alcance sino que corregirlo exige una decisión de arquitectura.**

**El módulo `lead-analyzer` no posee entidad `Lead` propia.** Su `domain/` contiene `LeadAnalysis.ts`, `fallbackAnalysis.ts` y `scoring.ts`. La entidad `Lead` vive en `modules/lead-hunter/domain/Lead.ts`.

Las tres salidas posibles chocan con una regla:

| Opción | Obstáculo |
| --- | --- |
| Importar `Lead` desde `lead-hunter/domain/` | **ADR-01 §10.2** y **DEV-00 R-02** prohíben el acceso a lo interno de otro módulo |
| Dar a `lead-analyzer` su propia entidad `Lead` | Duplica la entidad. Exige decidir la propiedad del concepto |
| Que `lead-analyzer` reciba el Lead ya registrado | Cambia el workflow — **prohibido por este sprint** |

**Requiere decisión del Architecture Team.** Conforme al protocolo, no se improvisó.

> **Nota adicional.** La línea 88 del mismo fichero asigna `status: "Prospect"`, que es la desviación **A-01** —`LeadStatus` frente a PO-01 §8—. Está expresamente excluida de este sprint.

---

# 6. Qué se Corrigió

| # | Problema | Corrección | Efecto |
| --- | --- | --- | --- |
| **T-01** | Fichero truncado; el proyecto no compilaba | Cierre de la función | `tsc` analiza todo el proyecto; el backend empaqueta |
| **T-02** | `TS2339` en la frontera application ↔ Agent API | Comparación explícita `=== true` | 0 errores, comportamiento idéntico |
| **T-03** | `TS2322` en `LeadCard` | **Ninguna corrección de código** — resuelto por T-04 | Se evitó tocar la pantalla principal |
| **T-04** | Tipos de React sin declarar | `@types/react` y `@types/react-dom` en `devDependencies` | JSX correctamente tipado |
| **T-05** | Sin lockfile; versiones no fijadas | `package-lock.json` generado y en índice | Instalación reproducible |

---

# 7. Qué Continúa Pendiente

## 7.1 Bloqueado por decisión

| # | Asunto | Quién decide |
| --- | --- | --- |
| **A-01** | `LeadStatus` incluye `'Prospect'`, `'Stale'`, `'Won'`, `'Replied'`, contra PO-01 §8 y ADR-11 §9 E-5 | **Product Office** |
| **A-02** | `application/` importa un Persistence Contract. **La corrección exige decidir dónde reside la entidad `Lead` para `lead-analyzer`** (§5.2) | **Architecture Team** |
| **A-03** | `LeadRepository` no expresa la identidad `(Referencia de Origen, Usuario)` ni la Unidad de Registro atómica | **Architecture Team** — depende del modelo de `User` |
| **A-04** | `server/shared/observability/` no está declarada en ADR-04 §8 | **Architecture Team** |

## 7.2 Excluido por el sprint, sin bloqueo

| # | Asunto | Estado |
| --- | --- | --- |
| **T-06** | `npm run lint` ejecuta `tsc --noEmit`, no un linter | Vacío **V-2** de DEV-00 |
| **T-07** | Sin test runner; existe un test que nunca se ejecuta | Vacío **V-1** |
| **V-3** | `strict` desactivado. **Con los tipos de React ya declarados, el coste real es ahora medible** | Pendiente de decisión |
| **V-4** | Sin verificación automática de fronteras. Es el riesgo **RI-1** de DEV-00 | Pendiente de decisión |
| **T-08** | Sin campo `engines`. Node instalado: **24.18.0 LTS** | Pendiente |
| **T-09** | Cuatro paquetes con scripts de instalación sin aprobar | Pendiente |
| **A-05** | Terminología `Prospect` en código y endpoints | Deuda **H-01 / DI-5** |
| **A-06** | `src/` andamiado con `.gitkeep`, sin implementar. Datos de ejemplo en `App.tsx` | Objeto de DEV-01 |
| **T-10** a **T-13** | Paquetes obsoletos, sin `.env`, residuos de plantilla, `vite` duplicado | Bajo |

## 7.3 Hallazgo nuevo de este sprint

| # | Hallazgo | Severidad |
| --- | --- | --- |
| **T-14** | **El puerto está fijado en el código.** `server/bootstrap/startServer.ts:9` declara `const PORT = 3000;` e **ignora `process.env.PORT`**. Detectado al verificar el arranque: el servidor escuchó en 3000 pese a fijarse `PORT=3199`. Impide desplegar en plataformas que asignan el puerto por entorno —incluida Cloud Run, que `.env.example` menciona | **Media** |

> Se informa; **no se corrigió**. Excede el alcance de las cinco tareas asignadas.

---

# 8. Qué Queda Listo para DEV-02

| Capacidad | Estado |
| --- | --- |
| **Compilar** | ✅ `npx tsc --noEmit` → 0 errores |
| **Construir** | ✅ `npm run build` → exit 0, frontend y backend |
| **Ejecutar** | ✅ Arranca y responde en `/api/health` y `/` |
| **Instalar de forma reproducible** | ✅ Lockfile en índice |
| **Tipado de React** | ✅ Declarado y correcto |
| **Verificar fronteras** | 🟡 Manual. La automatización es **V-4**, pendiente |
| **Ejecutar pruebas** | ❌ Sin runner — **V-1**, pendiente |

> **La línea base es ahora verificable.** Cualquier regresión introducida a partir de aquí se detecta con `tsc` y `npm run build`, cosa que antes de este sprint era imposible.

**Recomendación de orden para DEV-02:** resolver **V-3** (`strict`) antes de escribir el esqueleto de DEV-01. Con los tipos de React ya declarados, el coste es medible y cada fichero nuevo escrito sin `strict` es un fichero que habrá que revisar después.

---

# 9. Criterios de Aceptación

| Criterio | Resultado |
| --- | --- |
| Proyecto compila | ✅ 0 errores de TypeScript |
| Backend compila | ✅ `dist/server.cjs` — 56.7 kB |
| Frontend compila | ✅ 265.92 kB — 1691 módulos |
| No aparecen nuevos errores | ✅ 0 errores; sin ciclos ni imports rotos nuevos |
| No se modifica la arquitectura | ✅ Ninguna frontera, capa ni patrón alterado |
| No se modifica el Blueprint | ✅ Ningún documento tocado |
| No se modifica el dominio | ✅ `LeadStatus`, `LeadRepository` y entidades intactos |
| No se introducen funcionalidades | ✅ Dos ediciones: un `}` y un `=== true` |

**Los ocho criterios se cumplen.**

---

# 10. Referencias

- **PO-01 v1.1** §8 · **APS-02 v2.1** §9.
- **ADR-01 v1.0** §8, §10.2 · **ADR-05 v1.4** §7 · **ADR-07 v1.1** §8 · **ADR-08 v1.2** §10 · **ADR-09 v1.1** §5.1, §5.3, §6 · **ADR-11 v2.1** §9 · **ADR-12 v1.1** §7.2 · **ADR-13 v1.1** §11.1.
- **ADS-00 v1.3** · **ADS-02 v1.1**.
- **DEV-00 v1.1** §3 (R-02, R-20, R-22, R-54, R-55, R-58), §6, §9 (RI-1), §11 (V-1 a V-4).
- **DEV-01 v1.0** — Hallazgos del Architecture Bootstrap.
- **DEV-01A v1.0** — Informe de Auditoría Técnica, T-01 a T-13, A-01 a A-06.
- **Evidencia de ejecución:** `npx tsc --noEmit` · `npm run build` · `npm install --save-dev @types/react @types/react-dom` · `node dist/server.cjs` + sondas HTTP · análisis estático de 75 ficheros y 107 aristas.
