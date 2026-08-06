# DEV-01A — Informe de Auditoría Técnica

| Campo | Valor |
| --- | --- |
| Código | DEV-01A |
| Clasificación | **DEV** — AKVEZ Development Standard · Informe de auditoría |
| Versión | 1.0 |
| Estado | **Draft** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Requiere aprobación de | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-01A — Development Environment Bootstrap** |

> **Naturaleza.** Informe de auditoría. **No corrige código.** Ningún fichero de `src/`, `server/` ni `server.ts` fue modificado.
>
> **Cambios efectivamente realizados:** instalación de Node.js LTS en la máquina y de las 214 dependencias declaradas. Ambas autorizadas por el alcance del sprint. Se generó `node_modules/` y, como efecto del build de verificación, `dist/`.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Auditoría del entorno, instalación de dependencias, auditoría técnica con 13 hallazgos clasificados y auditoría Blueprint ↔ código de nueve unidades. Incluye el orden de corrección propuesto para DEV-01B. | Sprint DEV-01A. Desbloquear el entorno que impedía ejecutar DEV-01 y establecer la línea base real del código. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Verificación del Entorno
3. Instalación de Dependencias
4. Auditoría Técnica — Hallazgos
5. Auditoría Blueprint ↔ Código
6. Lista Priorizada de Errores
7. Lista Priorizada de Desviaciones Arquitectónicas
8. Orden de Corrección Propuesto para DEV-01B
9. Contradicciones que Requieren Decisión
10. Referencias

---

# 1. Resumen Ejecutivo

**El entorno quedó operativo.** Node.js 24.18.0 LTS y npm 11.16.0 instalados; 214 paquetes instalados sin dependencias rotas. El bloqueo **HZ-0** de DEV-01 está resuelto.

**El proyecto no compila, y la causa es una sola.** `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts` **está truncado**: el fichero termina en la línea 106 sin cerrar la función que abre en la línea 4. Tiene 42 llaves de apertura y 41 de cierre. Ese único defecto rompe simultáneamente la verificación de tipos y el bundle del servidor.

**El frontend sí compila** (`vite build` → 265.92 kB). Solo falla el bundle del backend.

**Dos hallazgos de configuración explican casi todo lo demás:**

1. **`@types/react` y `@types/react-dom` no están declarados** en `package.json`, pese a que React 19 sí es dependencia de runtime. Esto explica **528 de los 547 errores** que aparecen al activar `strict`.
2. **No existe ningún lockfile.** El proyecto nunca se había instalado, y las versiones **no están fijadas**: `package.json` usa rangos `^` y no declara `engines`.

**Dato relevante para la decisión sobre `strict` (V-3 de DEV-01):** medido sobre una copia aislada con la sintaxis reparada, **`strictNullChecks` por sí solo produce 5 errores**. Es la comprobación que protege la regla **R-38**, y su coste de adopción es trivial.

**Resultados limpios que conviene destacar:** **cero dependencias circulares**, **cero imports sin resolver** y **una sola violación de frontera** en 107 aristas de import analizadas. El backend es sólido.

---

# 2. Verificación del Entorno

## 2.1 Estado inicial

| Componente | Estado inicial |
| --- | --- |
| Node.js · npm · npx | **Ausentes** |
| pnpm · yarn · bun · deno · corepack | **Ausentes** |
| nvm · fnm · volta · scoop · choco | **Ausentes** |
| winget | Presente |
| `node_modules/` | **Ausente** |
| Lockfile *(npm, pnpm, yarn, bun)* | **Ninguno** |
| `.env` | **Ausente** — solo existe `.env.example` |

## 2.2 Acción ejecutada

**Node.js LTS 24.18.0** instalado mediante `winget install --id OpenJS.NodeJS.LTS --source winget`, con verificación de hash del instalador.

> **Nota de entorno.** La fuente `msstore` de winget falla con error de certificado TLS (`0x8a15005e` — *el certificado de servidor no coincide con ninguno de los valores esperados*). Fue necesario forzar `--source winget`. **Sugiere un proxy con inspección TLS en esta máquina o red.** No afectó a la descarga desde `nodejs.org`, pero conviene tenerlo presente si en el futuro fallan descargas de paquetes.

## 2.3 Versión de Node — no estaba determinada por el proyecto

**`package.json` no declara el campo `engines`.** El sprint exige «no asumir versiones», y en efecto no hay ninguna que asumir: el proyecto no la declara.

Se instaló **LTS** por ser la elección conservadora y compatible con Vite 6 y TypeScript 5.8. **Queda registrado como hallazgo T-08** (§4.4): la versión de Node debería declararse explícitamente.

## 2.4 Variables de entorno

`.env.example` declara tres variables; **no existe `.env`**:

| Variable | Uso | Leída en |
| --- | --- | --- |
| `GEMINI_API_KEY` | Llamadas a Gemini | `server/shared/config/env.ts` |
| `GOOGLE_PLACES_API_KEY` | Búsqueda de negocios | `server/shared/config/env.ts` |
| `APP_URL` | URL de despliegue | No se lee en el código actual |

**Consecuencia:** cualquier ejecución real de los adapters de proveedor fallará por falta de credenciales. No afecta a la compilación.

## 2.5 Configuración de Vite

`vite.config.ts` es correcto: plugins de React y Tailwind, alias `@` → raíz, y control de HMR por `DISABLE_HMR`.

> **Observación:** los comentarios del fichero se refieren a *AI Studio* y a la edición por agentes. Es residuo de la plantilla de origen, sin efecto funcional.

---

# 3. Instalación de Dependencias

## 3.1 Resultado

**`npm install` — 214 paquetes, código de salida 0.** No se actualizó ni se cambió ninguna versión, conforme al alcance.

| Verificación | Resultado |
| --- | --- |
| Instalación completa | ✅ Sin errores |
| Dependencias rotas *(`npm ls --depth=0`)* | ✅ **Ninguna** — sin `UNMET`, `invalid`, `missing` ni `extraneous` |
| Peer dependencies | ✅ Sin conflictos reportados |
| Paquetes obsoletos | ⚠️ **8** (§3.3) |
| Scripts de instalación pendientes | ⚠️ **4** (§3.2) |

## 3.2 Scripts de instalación no aprobados

npm 11 retuvo los scripts de cuatro paquetes: `@google/genai`, `esbuild` (×2) y `protobufjs`.

**No impidió el build**: el binario de esbuild funcionó igualmente. Se documenta porque en una instalación limpia en CI podría comportarse de otro modo, y porque aprobarlos es una decisión de seguridad de la cadena de suministro, no de este sprint.

## 3.3 Paquetes obsoletos

**No se actualizó ninguno**, conforme al alcance del sprint.

| Paquete | Instalado | Última |
| --- | --- | --- |
| typescript | 5.8.3 | 7.0.2 |
| vite | 6.4.3 | 8.1.5 |
| express | 4.22.2 | 5.2.1 |
| esbuild | 0.25.12 | 0.28.1 |
| lucide-react | 0.546.0 | 1.27.0 |
| @vitejs/plugin-react | 5.2.0 | 6.0.4 |
| @types/node | 22.20.1 | 26.1.2 |
| @types/express | 4.17.25 | 5.0.6 |

> **Ninguna actualización es urgente.** El salto de `express` 4 → 5 y de `typescript` 5 → 7 son cambios mayores que exigirían sprint propio.

---

# 4. Auditoría Técnica — Hallazgos

## 4.1 Crítico

### T-01 — Fichero truncado: el proyecto no compila

| Campo | Detalle |
| --- | --- |
| **Archivo** | `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts` |
| **Línea** | **106-107** *(fin de fichero)* |
| **Causa** | El fichero termina tras `}));` sin cerrar la función `searchGooglePlaces`, abierta en la línea 4. **42 llaves de apertura frente a 41 de cierre.** Truncamiento en escritura, no error lógico |
| **Blueprint** | **DEV-00 §6, DoD-1 y DoD-2** — toda tarea debe compilar y superar la verificación de tipos |
| **Riesgo** | **Máximo.** `tsc --noEmit` aborta con `TS1005` y no analiza el resto del código; `npm run build` falla al empaquetar el servidor. **Enmascara todos los demás errores de tipos** |
| **Propuesta** | Cerrar la función. Al hacerlo en una copia aislada, el parseo se completó y afloraron **T-02 y T-03**, que hasta ahora eran invisibles |

## 4.2 Alto

### T-02 — Propiedad inexistente en el resultado del Pitch Generator

| Campo | Detalle |
| --- | --- |
| **Archivo** | `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts` |
| **Línea** | **42, columna 54** |
| **Causa** | `TS2339: Property 'error' does not exist on type 'GenerateOutreachPitchResult'`. La Agent API accede a un campo que el tipo del caso de uso no declara |
| **Blueprint** | **ADR-07 §8** — `presentation/` consume el resultado interno del módulo · **DEV-00 R-07** |
| **Riesgo** | **Alto.** Es la frontera entre `application/` y la Agent API. Sugiere que el contrato de error del módulo evolucionó sin actualizar a su consumidor. En ejecución, `undefined` silencioso |
| **Propuesta** | Determinar cuál es el contrato correcto de `GenerateOutreachPitchResult` respecto a errores y alinear ambos lados. Relacionado con la taxonomía de `shared/errors/` |

### T-03 — Props incompatibles en `LeadCard`

| Campo | Detalle |
| --- | --- |
| **Archivo** | `src/modules/lead-hunter/presentation/LeadHunter.tsx` |
| **Línea** | **276, columna 21** |
| **Causa** | `TS2322`: el objeto pasado a `LeadCard` —`{ key, lead, isActive, onSelectLead }`— no es asignable a `LeadCardProps` |
| **Blueprint** | **DEV-00 §6, DoD-2** |
| **Riesgo** | **Alto.** Es un defecto real de tipos en la pantalla principal, enmascarado hasta ahora por T-01 |
| **Propuesta** | Alinear la llamada con `LeadCardProps`, o corregir la interfaz si la desactualizada es ella |

### T-04 — Faltan los tipos de React

| Campo | Detalle |
| --- | --- |
| **Archivo** | `package.json` — `devDependencies` |
| **Línea** | Bloque `devDependencies` |
| **Causa** | **`@types/react` y `@types/react-dom` no están declarados**, pese a que `react` y `react-dom` 19 sí son dependencias de runtime. Solo se declaran `@types/node` y `@types/express` |
| **Blueprint** | **DEV-00 §6, DoD-2** · **V-3** de DEV-00 §11 |
| **Riesgo** | **Alto.** Todo JSX se tipa como `any` implícito. **Es la causa de 528 de los 547 errores** que aparecen con `strict` — 499 de `TS7026` (*JSX element implicitly has type 'any'*) y 29 de `TS7016`. Mientras falten, **activar `strict` parece inviable cuando en realidad no lo es** |
| **Propuesta** | Declarar ambos paquetes en `devDependencies`, en la versión correspondiente a React 19. **Es prerrequisito de cualquier decisión sobre `strict`** |

### T-05 — Sin lockfile: las versiones no están fijadas

| Campo | Detalle |
| --- | --- |
| **Archivo** | Raíz del proyecto |
| **Línea** | — |
| **Causa** | No existe `package-lock.json` ni equivalente. Todas las dependencias usan rangos `^`, de modo que dos instalaciones en fechas distintas pueden resolver versiones distintas |
| **Blueprint** | **APS-12 §4.3** *(calidad medible)* · **DEV-00 §6, DoD-1** |
| **Riesgo** | **Alto.** Compilaciones no reproducibles. Un fallo podría deberse a una versión transitiva que nadie eligió |
| **Propuesta** | Versionar el `package-lock.json` generado por esta instalación. **Registra el estado que sí se ha verificado que instala correctamente** |

## 4.3 Medio

### T-06 — `npm run lint` no ejecuta un linter

| Campo | Detalle |
| --- | --- |
| **Archivo** | `package.json`, script `lint` |
| **Causa** | El script ejecuta `tsc --noEmit`, que es verificación de tipos, no análisis estático |
| **Blueprint** | **DEV-00 §6, DoD-4** · vacío **V-2** · riesgo **RI-6** |
| **Riesgo** | **Medio.** Se da por cubierta una verificación que no se realiza. Ninguna regla de frontera se comprueba |
| **Propuesta** | Renombrar a `typecheck` y reservar `lint` para el linter que apruebe V-2 |

### T-07 — Sin script `test` ni runner, con un test escrito

| Campo | Detalle |
| --- | --- |
| **Archivo** | `server/shared/persistence/adapters/inMemoryLeadAdapter.test.ts` |
| **Causa** | El test existe y usa `node:assert`, pero no hay script `test` ni runner declarado |
| **Blueprint** | **APS-12 §7** · vacío **V-1** · riesgo **RI-5** |
| **Riesgo** | **Medio.** El único test del proyecto no se ejecuta nunca |
| **Propuesta** | Aprobar el runner propuesto en V-1 (**Vitest**) y añadir el script |

### T-08 — La versión de Node no está declarada

| Campo | Detalle |
| --- | --- |
| **Archivo** | `package.json` |
| **Causa** | No existe el campo `engines` |
| **Blueprint** | **DEV-00 §6** |
| **Riesgo** | **Medio.** Cada entorno puede instalar una versión distinta. Se instaló LTS 24.18.0 por criterio conservador, no por indicación del proyecto |
| **Propuesta** | Declarar `engines.node` con la versión que el Product Office fije |

### T-09 — Cuatro scripts de instalación sin aprobar

| Campo | Detalle |
| --- | --- |
| **Archivo** | `node_modules` — `@google/genai`, `esbuild` (×2), `protobufjs` |
| **Causa** | npm 11 retiene por defecto los scripts de instalación |
| **Blueprint** | **APS-10** *(seguridad)* |
| **Riesgo** | **Medio.** No bloqueó el build aquí, pero puede comportarse distinto en una instalación limpia de CI |
| **Propuesta** | Revisarlos y decidir explícitamente cuáles se autorizan |

## 4.4 Bajo

### T-10 — Ocho paquetes obsoletos

Detallados en §3.3. **No se actualizaron.** Ninguno es urgente; `express` 4 → 5 y `typescript` 5 → 7 exigirían sprint propio.

### T-11 — Sin `.env`

Solo existe `.env.example`. No impide compilar; sí impide toda ejecución real contra proveedores externos.

### T-12 — Residuos de plantilla

`package.json` declara `"name": "react-example"`, y `vite.config.ts` conserva comentarios sobre *AI Studio* y edición por agentes. Sin efecto funcional; incoherente con la identidad del producto.

### T-13 — `vite` declarado dos veces

`vite@^6.2.3` figura simultáneamente en `dependencies` y en `devDependencies`. Resolvió sin conflicto, pero es una herramienta de construcción y su lugar es `devDependencies`.

---

# 5. Auditoría Blueprint ↔ Código

**Análisis estático sobre 75 ficheros y 107 aristas de import.**

## 5.1 Resultados globales

| Verificación | Resultado |
| --- | --- |
| **Dependencias circulares** | ✅ **Ninguna** |
| **Imports sin resolver / módulos faltantes** | ✅ **Ninguno** |
| **Violaciones de frontera (DEV-00 §3)** | ⚠️ **Una** — véase A-02 |
| **Quién importa `persistence/adapters/`** | ✅ Solo `bootstrap/compositionRoot.ts` y la propia carpeta |
| **SDK de base de datos fuera de `adapters/`** | ✅ Ninguno |

> El criterio de aceptación de DEV-01 «no existen dependencias circulares» **se cumple**.

## 5.2 Cumplimiento por unidad

| Unidad | Blueprint esperado | Implementación actual | Diferencia | Impacto | Veredicto |
| --- | --- | --- | --- | --- | --- |
| **`server/bootstrap/`** | ADR-09 §5.1, §5.2, §5.3, §6 — Composition Root único, aplicación parcial, sin singletons | `compositionRoot.ts` construye el grafo completo una vez; único importador de `adapters/`; no exporta estado mutable | Ninguna | — | ✅ **Cumple completamente** |
| **`server/routes/`** | ADR-07 §8 · ADR-04 §7.8 — adaptadores HTTP delgados, solo invocan Orchestrator | Sin imports de dominio, aplicación, infraestructura ni persistencia | Nomenclatura `prospect*` | Deuda **H-01** | 🟡 **Cumple parcialmente** |
| **`server/orchestrators/`** | ADR-07 §7 — no conocen HTTP ni DTO públicos | Verificado: sin `express`, sin `contracts/`, sin `mappers/` | Ninguna | — | ✅ **Cumple completamente** |
| **`server/shared/contracts/` · `mappers/`** | ADR-07 §8 — mappers declaran su propio tipo de entrada | Verificado por análisis de imports | Ninguna | — | ✅ **Cumple completamente** |
| **`server/modules/lead-hunter/`** | ADR-01 §8 — cuatro capas | Las cuatro existen | **Fichero truncado (T-01)**; nomenclatura `Prospect` | **Crítico** | 🔴 **No cumple** |
| **`server/modules/lead-analyzer/`** | ADR-08 §10 — `application/` no importa `persistence/contracts/` | `analyzeProspects.ts:10` **importa** `shared/persistence/contracts/Lead` | **Violación A-02** | Alto | 🔴 **No cumple** |
| **`server/modules/pitch-generator/`** | ADR-07 §8 — `presentation/` consume el resultado de `application/` | Error de tipos T-02 en la frontera | Contrato desalineado | Alto | 🟡 **Cumple parcialmente** |
| **`server/shared/persistence/`** | ADR-08 §6 — Contract · Model · Repository · Adapter separados | Las cuatro capas existen y están bien separadas | **`LeadStatus` contradice PO-01 §8**; `LeadRepository` no soporta ADR-12 §7.2 ni ADR-13 §11.1 | **Alto** | 🔴 **No cumple** |
| **`server/shared/observability/`** | **No declarada** en ADR-04 §8, que enumera cinco subcarpetas de `shared/` | Existe, con `executionReport.ts` | Carpeta no prevista | Medio | 🔴 **No cumple** |
| **`src/`** | ADR-01 §8 — cuatro capas por módulo | **Estructura completa y correcta**, pero `domain/`, `application/` e `infrastructure/` de `pitch-generator` contienen solo `.gitkeep`. No hay módulo `lead-analyzer`. `App.tsx` incluye datos de ejemplo incrustados | Andamiaje sin implementación | Medio | 🟡 **Cumple parcialmente** |

## 5.3 Desviaciones arquitectónicas detalladas

### A-01 — `LeadStatus` contradice el ciclo de vida canónico

**Archivo:** `server/shared/persistence/contracts/Lead.ts:7` y `models/LeadModel.ts:16`

```ts
export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';
```

**Blueprint esperado.** PO-01 §8 y APS-07 v2.0 §6.1: `Empresa → Lead → Lead Analizado → Lead Evaluado → Lead Contactado`.

**Diferencia.** Tres problemas distintos: `'Prospect'` es terminología del modelo derogado y contradice PO-01 §2; **`'Stale'` sugiere caducidad**, contra PO-01 §8 y la materia cerrada **E-5** de ADR-11 §9; `'Won'` y `'Replied'` pertenecen a un embudo que la V1 no contempla.

**Impacto: Alto.** Es la representación persistida del estadio del Lead. **Requiere decisión — véase §9.**

### A-02 — `application/` importa un Persistence Contract

**Archivo:** `server/modules/lead-analyzer/application/analyzeProspects.ts:10`

```ts
import { Lead } from "../../../shared/persistence/contracts/Lead";
```

**Blueprint esperado.** ADR-08 §10 prohíbe a `modules/*/application/` importar `shared/persistence/contracts/`. **DEV-00 R-22.**

**Matiz importante.** La línea 11, que importa `LeadRepository` desde `persistence/repositories/`, **sí está permitida**: ADR-08 §10 autoriza expresamente la Repository Interface, y el ejemplo de ADR-09 §5.2 hace exactamente eso. **La violación es solo la línea 10.**

**Por qué importa.** ADR-08 §5 y §9 establecen que la correspondencia entre la entidad de dominio y el Persistence Contract es **estructural, sin import**. `application/` debe construir y pasar **su entidad de dominio real**, no el contrato de persistencia.

**Impacto: Alto.** Es la única violación de frontera del proyecto. **Corregible sin decisión previa.**

### A-03 — `LeadRepository` no soporta la identidad canónica

**Archivo:** `server/shared/persistence/repositories/LeadRepository.ts`

Ningún método recibe usuario ni Referencia de Origen, y `save()` no expresa la Unidad de Registro atómica. El adapter documenta el hueco en su cabecera y asigna `PLACEHOLDER_USER_ID`.

**Blueprint esperado.** ADR-12 §7.2 · ADR-13 §11.1, §11.3 · ADR-05 §14.

**Impacto: Alto.** **Requiere decisión — véase §9.**

### A-04 — `server/shared/observability/` no está declarada

ADR-04 §8 enumera exactamente cinco subcarpetas de `server/shared/`: `ai/`, `errors/`, `types/`, `utils/` y `config/`. La carpeta existe y se usa desde `googlePlacesAdapter.ts`.

**Impacto: Medio.** No rompe ninguna frontera; incumple la estructura declarada. **Requiere decisión: incorporarla a ADR-04 o reubicar su contenido.**

### A-05 — Terminología `Prospect`

Presente en tipos, casos de uso y rutas. Deuda **H-01 / DI-5** de AR-02 §4.2. **DEV-00 R-59** rige para código nuevo.

**Impacto: Medio.** Arrastra la semántica del modelo derogado.

### A-06 — `src/` andamiado pero sin implementar, y con datos incrustados

**La estructura de ADR-01 §8 existe**: `src/modules/pitch-generator/` tiene `domain/`, `application/` e `infrastructure/`, igual que `src/shared/{contracts,errors,constants}`, `src/config`, `src/styles` y `src/assets`. **Todas contienen únicamente `.gitkeep`**: están andamiadas, no implementadas.

**Lo que sí es una desviación:** `src/App.tsx` contiene leads de ejemplo codificados literalmente en el fichero, y no existe módulo `lead-analyzer` en el cliente.

**Impacto: Medio.** La estructura cumple ADR-01 §8; el contenido aún no existe, que es precisamente lo que DEV-01 debía crear.

---

# 6. Lista Priorizada de Errores

| # | Hallazgo | Severidad | Bloquea |
| --- | --- | --- | --- |
| 1 | **T-01** — fichero truncado | **Crítico** | Compilación y build del servidor |
| 2 | **T-04** — faltan `@types/react` | Alto | Decisión sobre `strict` |
| 3 | **T-05** — sin lockfile | Alto | Reproducibilidad |
| 4 | **T-02** — propiedad `error` inexistente | Alto | Frontera application ↔ presentation |
| 5 | **T-03** — props de `LeadCard` | Alto | Pantalla principal |
| 6 | **T-06** — `lint` no es lint | Medio | DoD-4 |
| 7 | **T-07** — sin test runner | Medio | DoD-3 |
| 8 | **T-08** — sin `engines` | Medio | Consistencia entre entornos |
| 9 | **T-09** — scripts sin aprobar | Medio | CI |
| 10 | **T-10** a **T-13** | Bajo | Nada |

---

# 7. Lista Priorizada de Desviaciones Arquitectónicas

| # | Desviación | Severidad | ¿Requiere decisión? |
| --- | --- | --- | --- |
| 1 | **A-01** — `LeadStatus` contradice PO-01 §8 | **Alto** | **Sí** — Product Office |
| 2 | **A-03** — `LeadRepository` sin identidad canónica | **Alto** | **Sí** — Architecture Team |
| 3 | **A-02** — `application/` importa Persistence Contract | Alto | **No** — corregible |
| 4 | **A-04** — `observability/` no declarada | Medio | **Sí** — Architecture Team |
| 5 | **A-05** — terminología `Prospect` | Medio | No — planificable |
| 6 | **A-06** — `src/` incompleto | Medio | Parcial — depende de HZ-3 |

---

# 8. Orden de Corrección Propuesto para DEV-01B

**Criterio: primero lo que desbloquea verificación, después lo que no requiere decisión, y al final lo que sí la requiere.**

| Fase | Trabajo | Por qué en este orden |
| --- | --- | --- |
| **B-1** | **T-01** — cerrar `googlePlacesAdapter.ts` | Sin esto nada más es verificable. Un solo carácter |
| **B-2** | **T-04** + **T-05** — declarar `@types/react` y `@types/react-dom`; versionar el lockfile | Convierte la línea base en reproducible y hace visible el estado real de tipos |
| **B-3** | **T-02** y **T-03** — los dos errores de tipos que T-01 ocultaba | Ya son visibles y no requieren decisión |
| **B-4** | **T-06** + **T-07** — separar `typecheck` de `lint`; añadir runner | Habilita DoD-3 y DoD-4 de DEV-00 §6 |
| **B-5** | **A-02** — eliminar el import prohibido | Única violación de frontera. No requiere decisión |
| **B-6** | Decidir **`strict`** e implementarlo | Tras B-2 el coste real es medible. Conviene **antes** de escribir el esqueleto de DEV-01 |
| **B-7** | Implementar **V-4** — verificación automática de fronteras | Impide que A-02 vuelva a ocurrir sin que nadie lo note |
| **B-8** | **A-01**, **A-03**, **A-04** | **Bloqueadas hasta decisión** (§9) |
| **B-9** | **A-05** — renombrado `Prospect` → `Lead` | Deuda planificada. Conviene antes de que crezca el código |

> **B-1 a B-5 no requieren ninguna decisión y dejan el proyecto compilando, con tipos correctos y sin violaciones de frontera.**

---

# 9. Contradicciones que Requieren Decisión

**No se modificó ningún código relacionado.** Las tres ya constaban en DEV-01 y esta auditoría las confirma sobre el código real.

| # | Contradicción | Documentos en conflicto | Opciones |
| --- | --- | --- | --- |
| **A-01** | `LeadStatus` incluye `'Prospect'`, `'Stale'`, `'Won'` y `'Replied'` | **PO-01 §8** y **APS-07 v2.0 §6.1** *(cinco estadios canónicos)* frente al código · **ADR-11 §9, E-5** prohíbe la caducidad | **(a)** Sustituir el enum por los cinco estadios canónicos y representar el descarte como atributo, conforme a APS-07 v2.0 §7. **(b)** Mantener los estados comerciales y documentar su correspondencia con los canónicos en un ADR. **(c)** Decisión de Product Office sobre si la V1 necesita embudo comercial — hoy APS-02 no lo contempla |
| **A-03** | `LeadRepository` no expresa la identidad `(Referencia de Origen, Usuario)` ni el registro atómico | **ADR-12 §7.2** · **ADR-13 §11.1** · **ADR-05 §14** frente al código | **(a)** Rediseñar la Repository Interface conforme a ADR-12 y ADR-13, lo que exige antes el modelo de `User` *(pendiente desde ADR-08 §312)*. **(b)** Mantenerla y aplazar, asumiendo que el adapter de Supabase heredaría el defecto y materializaría el riesgo **R-1 de ADS-02**, que **VH-3** obliga a verificar |
| **A-04** | `server/shared/observability/` no está en ADR-04 §8 | **ADR-04 §8** frente al código | **(a)** Incorporar `observability/` a ADR-04 mediante revisión menor. **(b)** Reubicar su contenido en `shared/utils/`. **(c)** Declararla excepción documentada |

> **La opción (b) de A-03 tiene un coste concreto y conocido.** ADS-02 §10 clasifica R-1 —unicidad resuelta en la aplicación en vez de en el motor— como riesgo **alto**, y APS-02 §9 declara la deduplicación **criterio de éxito de la V1**.

---

# 10. Referencias

- **PO-01 v1.1** §2, §8 · **APS-02 v2.1** §9 · **APS-07 v2.0** §6.1, §7 · **APS-10** · **APS-12 v1.0** §4.3, §7.
- **ADR-01 v1.0** §8 · **ADR-04 v1.2** §7.8, §8 · **ADR-05 v1.4** §14 · **ADR-07 v1.1** §7, §8 · **ADR-08 v1.2** §5, §6, §9, §10, §312 · **ADR-09 v1.1** §5, §6 · **ADR-11 v2.1** §9 · **ADR-12 v1.1** §7.2 · **ADR-13 v1.1** §11.1, §11.3.
- **ADS-00 v1.3** · **ADS-02 v1.1** §10, §11.
- **AR-02** §4.2 · **AR-04 v1.0** §10.1 *(VH-3, VH-6)*.
- **DEV-00 v1.1** §3 (R-07, R-22, R-38, R-59), §6, §9 (RI-5, RI-6), §11 (V-1 a V-4).
- **DEV-01 v1.0** — Hallazgos del Architecture Bootstrap, HZ-0 a HZ-6.
- **Evidencia de ejecución:** `winget install OpenJS.NodeJS.LTS` · `npm install` · `npx tsc --noEmit` · `npx tsc --noEmit --strict` · `npm run build` · `npm ls --depth=0` · `npm outdated` · análisis estático de 75 ficheros y 107 aristas de import.
