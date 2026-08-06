# DEV-01 — Hallazgos del Architecture Bootstrap

| Campo | Valor |
| --- | --- |
| Código | DEV-01 |
| Clasificación | **DEV** — AKVEZ Development Standard · Registro de Hallazgos |
| Versión | 1.0 |
| Estado | **Draft** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Requiere aprobación de | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-01 — Architecture Bootstrap** |

> **Naturaleza del documento.** Es el **Hallazgo** que exige el protocolo del sprint DEV-01:
>
> > *«Si durante el desarrollo aparece una contradicción: DETENERSE. Crear un Hallazgo. No improvisar una solución.»*
>
> **No resuelve ninguna contradicción. No decide nada. No propone arquitectura.** Enumera lo que impide ejecutar el sprint tal como fue especificado y qué decisión se necesita para desbloquearlo.
>
> **Ningún fichero de código fue creado ni modificado durante DEV-01.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Registro de un bloqueo de entorno, seis contradicciones y tres divergencias código/Blueprint detectadas al iniciar el Architecture Bootstrap. Incluye las cuatro verificaciones V-1 a V-4 solicitadas por el sprint. | Protocolo de DEV-01. La construcción del esqueleto se detuvo antes de escribir código para no consolidarlo sobre cimientos contradictorios. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Bloqueo de Entorno
3. Contradicciones Detectadas
4. Divergencias Código ↔ Blueprint
5. Qué Puede Ejecutarse sin Decisión Adicional
6. Verificación V-1 — Sistema de Pruebas
7. Verificación V-2 — Lint
8. Verificación V-3 — TypeScript `strict`
9. Verificación V-4 — Verificación Automática de Arquitectura
10. Impacto sobre los Criterios de Aceptación
11. Decisiones Requeridas
12. Referencias

---

# 1. Resumen Ejecutivo

**DEV-01 se detuvo antes de crear código.** No por falta de alcance, sino porque escribir el esqueleto definitivo del proyecto exigía, en cinco de sus diez entregables, tomar decisiones que ningún documento aprobado contiene o resolver contradicciones con documentos que sí lo están.

**Dos hallazgos son de naturaleza distinta y ambos bloquean:**

1. **No existe ningún runtime de JavaScript en el entorno** —ni `node`, `npm`, `pnpm`, `yarn` o `bun`— ni la carpeta `node_modules`. Tres de los siete criterios de aceptación del sprint son literalmente inverificables (§2, §10).
2. **El entregable 10 exige crear un Event Bus que ninguna decisión aprobada define**, y cuya existencia contradice ADR-04 §7.6 y §7.8 (§3, HZ-1).

**Junto a ellos, cinco contradicciones más** afectan a los entregables 2, 4, 5 y 6.

**Lo que sí se hizo.** Las cuatro verificaciones V-1 a V-4 solicitadas por el sprint están completas (§6-§9), y el inventario del código existente frente al Blueprint —obligación **VH-6** heredada de GOV-01— está ejecutado (§4).

> **El esqueleto del backend ya existe y es de calidad notable.** `server/` implementa la estructura de ADR-04 §8, el Composition Root de ADR-09 §5.1 y la separación Contract/Model/Repository/Adapter de ADR-08 §6, y **documenta honestamente sus propias lagunas** en comentarios. El sprint DEV-01 lo daba por inexistente; en gran parte no lo está.

---

# 2. Bloqueo de Entorno

## HZ-0 — No existe runtime de JavaScript

| Campo | Detalle |
| --- | --- |
| **Severidad** | **Bloqueante** |
| **Evidencia** | `where.exe node npm pnpm yarn bun` no devuelve resultados. `node_modules/` no existe. No hay instalación de Node.js en `C:\Program Files` ni en `%LOCALAPPDATA%\Programs` |
| **Consecuencia** | No es posible compilar, ejecutar `tsc`, instalar dependencias, arrancar la aplicación ni detectar dependencias circulares |

**Criterios de aceptación afectados:** «todos los módulos compilan», «la aplicación inicia correctamente» y «no existen dependencias circulares» **no pueden verificarse**.

> **Escribir el esqueleto completo sin poder compilarlo ni una vez produciría un entregable cuya corrección nadie habría comprobado.** DEV-00 §6 exige `DoD-1` (compila) y `DoD-2` (verificación de tipos) como condiciones de toda tarea; ninguna es satisfacible hoy.

**Qué se necesita:** instalar Node.js —la versión la fija el proyecto, no este documento— y ejecutar la instalación de dependencias.

---

# 3. Contradicciones Detectadas

## HZ-1 — El Event Bus no está definido y contradice ADR-04

**Entregable 10:** *«Crear el Event Bus. Registrar únicamente los eventos definidos. Sin listeners de negocio.»*

| Campo | Detalle |
| --- | --- |
| **Severidad** | **Bloqueante** |
| **Qué se pidió** | Un Event Bus como componente de la arquitectura base |
| **Qué dice el Blueprint** | **Ningún documento aprobado define un Event Bus**: ni su ubicación, ni su contrato, ni su ciclo de vida, ni sus reglas de dependencia |

**Lo que sí existe, y no es lo mismo.** ADR-13 §13 define un **Catálogo de Eventos del Dominio** (E-1 a E-6). Es una **tabla de semántica de persistencia** —qué operación escribe, cuál actualiza y cuál versiona—, no un mecanismo de publicación y suscripción en tiempo de ejecución. ADR-13 §13.4 lo declara catálogo **cerrado**, no bus.

**Por qué contradice, y no solo falta:**

| Regla aprobada | Conflicto |
| --- | --- |
| **ADR-04 §7.6** — «Comunicación exclusivamente por Orchestrator» | Un Event Bus sería un **segundo canal de comunicación** entre módulos, en paralelo al Orchestrator |
| **ADR-04 §7.8** — «Orquestación obligatoria y exclusiva» | Un bus permite coordinación implícita sin Orchestrator |
| **ADR-04 §8** | La estructura del backend **no contempla ninguna carpeta** para un bus de eventos |
| **DEV-00 R-01, R-03** | Toda comunicación entre módulos pasa por interfaces públicas |
| **ADS-00 v1.3**, categoría DEV | Un documento DEV **no puede introducir arquitectura** |

> **Crear el Event Bus sería introducir un mecanismo arquitectónico nuevo.** El sprint lo prohíbe expresamente: *«Está prohibido rediseñar arquitectura»*. **No se creó.**

**Qué se necesita:** un **ADR** que decida si AKVEZ incorpora un Event Bus, y en tal caso su ubicación, contrato y relación con el Orchestrator. O bien la confirmación de que el entregable 10 se refería al catálogo de ADR-13 §13, que **ya existe y no requiere código**.

---

## HZ-2 — «Contenedor» de inyección de dependencias

**Entregable 6:** *«Implementar el contenedor completo.»*

| Campo | Detalle |
| --- | --- |
| **Severidad** | Media — **resoluble por precedencia** |
| **Conflicto** | **ADR-09 §7 prohíbe expresamente** los contenedores de DI, los Service Locator, los Singleton globales y las variables globales. Textualmente: *«No existe `container.get(...)`»* |

**El resto del entregable no contradice nada.** «Todas las dependencias deberán resolverse desde un único punto» es exactamente ADR-09 §5.1 (Composition Root único), y «no utilizar singletons distribuidos» es ADR-09 §5.3 y §7.

> **Prevalece el ADR** (DEV-00, regla de precedencia). El mecanismo aprobado es **aplicación parcial mediante closures**, no un contenedor.

**Estado real:** `server/bootstrap/compositionRoot.ts` **ya lo implementa**, y correctamente: construye el grafo completo una sola vez, es el único importador de `shared/persistence/adapters/`, y no exporta estado mutable. Cumple ADR-09 §5.1, §5.2, §5.3 y §6.

**Qué se necesita:** confirmación de que «contenedor» debe leerse como **Composition Root**. Si la intención era un contenedor real, requiere modificar ADR-09 — decisión de arquitectura, no de implementación.

---

## HZ-3 — Routing, layouts, providers y DI en el frontend

**Entregable 5:** *«Presentation: routing, layouts, providers, dependency injection.»*

| Campo | Detalle |
| --- | --- |
| **Severidad** | **Bloqueante** |
| **Qué falta** | Ningún documento aprobado decide **ninguno** de los cuatro |

| Elemento | Situación |
| --- | --- |
| **Routing** | **No hay librería de enrutado decidida** ni instalada. APS-04 §A.4 define el flujo de navegación entre las trece pantallas como **especificación de producto**, no como estructura de código. Elegir un router es una decisión de arquitectura con dependencia nueva |
| **Layouts** | Ningún ADR define una estructura de layouts. APS-04 Parte B especifica el sistema visual, no la composición de componentes |
| **Providers** | Ningún ADR los contempla. Introducir contexto global roza el patrón que ADR-09 §7 prohíbe |
| **DI en frontend** | **ADR-09 §5.1 define el Composition Root para el backend únicamente** (`server/bootstrap/`). No existe decisión equivalente para `src/` |

**Relación con un vacío ya registrado.** DEV-00 §11, **V-6**, registró que la estructura interna de `src/shared/` no está enumerada en ningún ADR, a diferencia de `server/shared/`, que ADR-04 §8 detalla. **HZ-3 es la manifestación práctica de ese vacío.**

**Qué se necesita:** un ADR que defina la arquitectura del cliente —Composition Root del frontend, enrutado y composición—, equivalente a lo que ADR-04 hace con el backend.

---

## HZ-4 — `LeadStatus` contradice el ciclo de vida canónico de PO-01

| Campo | Detalle |
| --- | --- |
| **Severidad** | **Alta** |
| **Dónde** | `server/shared/persistence/contracts/Lead.ts` y `server/shared/persistence/models/LeadModel.ts` |

**Lo que declara el código:**

```ts
export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';
```

**Lo que decide el Blueprint.** PO-01 §8 fija el ciclo de vida canónico, desarrollado en APS-07 v2.0 §6.1:

```
Empresa → Lead → Lead Analizado → Lead Evaluado → Lead Contactado
```

**Tres problemas distintos:**

1. **`'Prospect'` como estadio.** `Prospect` es la terminología del modelo derogado. PO-01 §2 establece que un Lead **existe desde su Registro**; no hay un estadio previo llamado *Prospect* dentro del Lead.
2. **`'Stale'` sugiere caducidad.** PO-01 §8 declara que **ninguna etapa expulsa a un Lead**, y APS-07 v2.0 §7.2 lo refuerza. Un estadio de obsolescencia es la vía por la que reaparecería una política de purga, prohibida por ADR-11 §9, **E-5**.
3. **`'Won'` y `'Replied'`** pertenecen a un embudo comercial que el ciclo canónico no contempla en la V1.

> **Es una contradicción activa entre código y Blueprint.** Conforme a ADS-00 y al protocolo del sprint, **no se corrigió**: alinear el enum equivale a redefinir el modelo de estados, prohibido por *«No modificar el modelo»* y *«No redefinir modelos»*.

**Qué se necesita:** decisión del Product Office sobre la correspondencia entre `LeadStatus` y los cinco estadios de PO-01 §8, y si el descarte de APS-07 v2.0 §7 se representa como estadio o como atributo independiente.

---

## HZ-5 — `LeadRepository` no soporta la identidad canónica ni la Unidad de Registro

| Campo | Detalle |
| --- | --- |
| **Severidad** | **Alta** |
| **Dónde** | `server/shared/persistence/repositories/LeadRepository.ts` |

**Interfaz actual:**

```ts
save(lead: Lead): Promise<Identified<Lead>>;
findById(id: string): Promise<Identified<Lead> | null>;
findByStatus(status: LeadStatus): Promise<Identified<Lead>[]>;
updateStatus(id: string, status: LeadStatus): Promise<void>;
```

**Lo que exigen los ADR ratificados en GOV-01:**

| Exigencia | Sección | Situación |
| --- | --- | --- |
| Identidad = **(Referencia de Origen, Usuario)** | ADR-12 §7.2 | ❌ Ningún método recibe usuario ni Referencia de Origen |
| **Unidad de Registro atómica** — comprobar y escribir de forma indivisible | ADR-13 §11.1 | ❌ `save()` no expresa la condición «si y solo si no estaba presente» |
| **Aislamiento entre usuarios** | ADR-05 §14 | ❌ No hay ámbito de usuario en la interfaz |
| Un Lead acumula **varias Referencias de Origen** | ADR-12, D-6 | ❌ No representado |
| **Idempotencia del Registro** | ADR-13 §11.3 | ❌ No expresable |

**El propio código lo reconoce.** `inMemoryLeadAdapter.ts` documenta en cabecera:

> *«KNOWN GAP (flagged, not silently resolved): `LeadRepository.save(lead: Lead)` does not accept a userId… This does NOT satisfy ADR-05 §14.»*

Asigna un `PLACEHOLDER_USER_ID = "single-tenant-placeholder"` a todo Lead guardado.

**Por qué no lo corregí.** Rediseñar la Repository Interface para admitir identidad canónica y registro atómico es **una decisión de contrato de persistencia**, no una tarea de esqueleto. El sprint prohíbe *«mover responsabilidades entre módulos»* y *«redefinir modelos»*.

**Qué se necesita:** decisión sobre la forma de la Repository Interface conforme a ADR-12 §7.2 y ADR-13 §11.1. **Es prerrequisito del entregable 4** (persistencia y skeleton de Supabase): implementar un adapter de Supabase contra una interfaz que no expresa la unicidad compuesta materializaría el riesgo **R-1 de ADS-02**, de severidad alta, que es precisamente lo que **VH-3** obliga a verificar en este sprint.

---

## HZ-6 — El modelo de `User` sigue sin decidirse

| Campo | Detalle |
| --- | --- |
| **Severidad** | Media |
| **Dónde** | `server/shared/persistence/contracts/User.ts` — contiene un único campo, `email` |

ADR-08 §312 declara el modelo de `User` **fuera de su alcance**, y ADS-01 §11 lo mantiene entre las dos materias abiertas. ADS-02 §5.2 adopta la autenticación de Supabase, pero **no define la entidad**.

**Consecuencia directa:** sin `User` no hay ámbito de usuario, y sin ámbito de usuario **HZ-5 no puede resolverse**, porque la identidad canónica del Lead es un par que incluye al usuario.

---

# 4. Divergencias Código ↔ Blueprint

**Inventario parcial de la obligación VH-6** heredada de GOV-01 (AR-04 §10.1): validar el código existente contra el Blueprint. Se informa; **no se corrige**.

| # | Divergencia | Estado |
| --- | --- | --- |
| **DV-1** | **`server/shared/observability/` no está declarada en ADR-04 §8**, que enumera exactamente cinco subcarpetas de `shared/`: `ai/`, `errors/`, `types/`, `utils/` y `config/` | Carpeta real, no prevista. Contiene `executionReport.ts` |
| **DV-2** | **Terminología `Prospect` en todo el código**: `Prospect` como tipo del frontend, `discoverProspects`, `analyzeProspects`, rutas `prospectSearchRoute` y `prospectOutreachRoute` | Deuda **H-01 / DI-5** ya identificada en AR-02 §4.2. DEV-00 **R-59** rige para código nuevo |
| **DV-3** | **`src/` no replica la estructura modular completa.** `pitch-generator` tiene solo `presentation/`; no existe módulo `lead-analyzer` en el cliente; `src/App.tsx` contiene datos de ejemplo incrustados | ADR-01 §8 exige las cuatro capas por módulo |
| **DV-4** | **Existe `inMemoryLeadAdapter.test.ts`** pero **no hay test runner** que pueda ejecutarlo | Relacionado con V-1 (§6) |

> **DV-1 a DV-4 no bloquean por sí solos.** Se registran porque VH-6 obliga a inventariarlos y porque **ATA-01 está `Archived`**: sus hallazgos sobre el código **deben reverificarse, no darse por vigentes** (AR-02 §6.2).

---

# 5. Qué Puede Ejecutarse sin Decisión Adicional

Para que el desbloqueo sea inmediato, se deja constancia de qué entregables **no** dependen de ninguna decisión pendiente:

| Entregable | Situación |
| --- | --- |
| **1 — Estructura de carpetas** | ✅ **Ejecutable.** `server/` ya cumple ADR-04 §8 salvo DV-1. Falta completar `src/` conforme a ADR-01 §8 (DV-3) |
| **2 — Dominio** | ⚠️ **Parcial.** Las entidades son creables; **los estadios no**, hasta resolver HZ-4 |
| **3 — Application** | ✅ **Ejecutable.** Las factories de ADR-09 §5.2 no dependen de ningún hallazgo |
| **4 — Infrastructure / Supabase** | ❌ **Bloqueado por HZ-5 y HZ-6** |
| **5 — Presentation** | ❌ **Bloqueado por HZ-3** |
| **6 — Dependency Injection** | ✅ **Ya implementado** en `compositionRoot.ts`. Solo requiere confirmar HZ-2 |
| **7 — Persistencia** | ❌ **Bloqueado por HZ-5** |
| **8 — Score** | ✅ **Ejecutable.** Interfaces, contratos y puntos de extensión; ponderaciones **WP-01** desde APS-08 §7.1 |
| **9 — Agentes** | ✅ **Ejecutable.** Los contratos públicos de las Agent API ya existen en `modules/*/presentation/` |
| **10 — Event Bus** | ❌ **Bloqueado por HZ-1** |

**Cuatro entregables completos y uno parcial pueden ejecutarse en cuanto exista entorno de compilación (HZ-0).**

---

# 6. Verificación V-1 — Sistema de Pruebas

## 6.1 Estado actual

| Aspecto | Situación |
| --- | --- |
| **Framework instalado** | **Ninguno.** `package.json` no declara ningún test runner |
| **Script `test`** | **No existe** |
| **Tests escritos** | **Uno**: `server/shared/persistence/adapters/inMemoryLeadAdapter.test.ts` — **no ejecutable** |
| **Cobertura** | **0 %**, por imposibilidad de ejecución |
| **Exigencia documental** | APS-12 §7 define cuatro niveles: unitarias, integración, sistema y experiencia |

## 6.2 Framework recomendado

**Vitest.**

| Motivo | Detalle |
| --- | --- |
| **Comparte configuración con Vite** | El proyecto ya usa Vite 6 (`vite.config.ts`). Vitest reutiliza `resolve.alias` y el pipeline de TypeScript sin duplicar configuración |
| **Sin transpilador adicional** | Jest exigiría `ts-jest` o Babel; Vitest lee TypeScript directamente |
| **API compatible con Jest** | El test existente no necesitaría reescribirse |
| **Un solo runner para cliente y servidor** | Evita dos configuraciones para `src/` y `server/` |

**Alternativa evaluada:** el runner nativo de Node (`node:test`) evitaría toda dependencia nueva, pero no cubre el frontend ni resuelve los alias de Vite.

## 6.3 Cobertura inicial propuesta

**No se propone un porcentaje global**, que premiaría cubrir lo trivial. Se propone cobertura **por criticidad**:

| Prioridad | Qué cubrir | Por qué |
| --- | --- | --- |
| **P0** | Deduplicación e identidad del Lead | APS-02 §9 la declara **criterio de éxito de la V1** |
| **P0** | Unidad de Registro — atomicidad e idempotencia | ADR-13 §11.1, §11.3 · riesgo **R-1** de ADS-02 |
| **P0** | Que ninguna operación reduzca el conjunto de Leads | PO-01 §6, §8 · DEV-00 R-42 a R-45 |
| **P1** | Cálculo del Opportunity Score y bandas | APS-08 §7, §8 |
| **P1** | Mappers Contract ↔ Model y hacia DTO público | ADR-08 §7 · ADR-07 §8 |
| **P2** | Reglas de interfaz UI-1 a UI-10 | APS-04 §A.9 |

## 6.4 Estrategia

Los cuatro niveles de APS-12 §7 se corresponden así:

| Nivel APS-12 | Alcance técnico |
| --- | --- |
| **Unitarias** | `domain/` de cada módulo. Sin I/O — ADR-05 §6, Principio 3, exige que el dominio sea testeable sin conexión |
| **Integración** | `application/` contra un adapter en memoria, y adapters contra el motor real |
| **Sistema** | Flujo completo `routes → orchestrator → agentes` |
| **Experiencia** | Manual, con Founder Validation (APS-14) |

> **No se instaló nada.** La elección de framework es una dependencia nueva y, conforme al sprint, **requiere aprobación**.

---

# 7. Verificación V-2 — Lint

## 7.1 Estado actual

| Aspecto | Situación |
| --- | --- |
| **Linter instalado** | **Ninguno.** No hay ESLint, Biome ni equivalente |
| **Script `lint`** | Existe, pero ejecuta **`tsc --noEmit`** |
| **Configuración** | Inexistente |

> **`tsc --noEmit` es verificación de tipos, no análisis estático.** Detecta que un tipo no encaja; **no** detecta que una capa importe lo que tiene prohibido. Confundirlos es el riesgo **RI-6** de DEV-00 §9.

## 7.2 Propuesta

**ESLint 9** con configuración plana (`eslint.config.js`), sobre `typescript-eslint`.

| Motivo | Detalle |
| --- | --- |
| **Es el único con ecosistema para V-4** | La verificación de fronteras (§9) depende de reglas de import que hoy solo existen maduras en ESLint |
| **Configuración plana** | Permite reglas distintas por ruta — imprescindible: `domain/` y `routes/` no admiten lo mismo |
| **Alternativa: Biome** | Mucho más rápido, pero **sin equivalente a `import/no-restricted-paths`**, que es la razón principal para introducir un linter aquí |

## 7.3 Reglas propuestas

| Grupo | Regla | Fundamento |
| --- | --- | --- |
| **Fronteras** | `import/no-restricted-paths` con las zonas de ADR-08 §10, ADR-09 §8 y ADR-07 §8 | **Es el núcleo.** Véase §9 |
| **Ciclos** | `import/no-cycle` | Criterio de aceptación «no existen dependencias circulares» |
| **Tipos** | `@typescript-eslint/no-explicit-any`, `no-floating-promises` | Persistencia y agentes son asíncronos |
| **Higiene** | `no-unused-vars`, `consistent-type-imports` | — |
| **Terminología** | `no-restricted-syntax` sobre el identificador `Prospect` en código nuevo | DEV-00 **R-59** |

> **Separar los scripts.** `typecheck` para `tsc --noEmit` y `lint` para ESLint. Hoy el nombre `lint` designa lo que no es.

---

# 8. Verificación V-3 — TypeScript `strict`

## 8.1 Estado actual

`tsconfig.json` **no activa `strict`** ni ninguna de sus comprobaciones por separado. Tampoco `noUnusedLocals`, `noImplicitReturns` ni `exactOptionalPropertyTypes`.

## 8.2 Impacto medido

> ⚠️ **El impacto numérico no pudo medirse.** Requiere ejecutar `tsc --noEmit --strict`, imposible sin runtime (**HZ-0**). Lo que sigue es análisis estático del código, no un recuento de errores.

## 8.3 Por qué importa aquí más que en un proyecto corriente

**`strictNullChecks` es la comprobación que sostiene una regla del dominio.**

DEV-00 **R-38**, derivada de APS-07 v2.0 §8.4 y ADR-13 §7.1 (X-3), exige distinguir **«no hay dato»** de **«el dato es cero o vacío»**. La ausencia de sitio web es un **hallazgo comercial**, no un hueco que rellenar: es literalmente lo que hace valioso a un Lead para un diseñador web (APS-08 §6.5, con peso del 25 % en WP-01).

Sin `strictNullChecks`, `null` y `undefined` son asignables a cualquier tipo, y esa distinción **no la protege el compilador**. Queda a merced de que cada desarrollador la recuerde.

**Ejemplo del código actual.** `contracts/Lead.ts` declara `website: string`, `rating: number`, `phone: string` — todos obligatorios y no anulables. Una Empresa **sin** sitio web solo puede representarse como `""`, que es exactamente la confusión que R-38 prohíbe.

## 8.4 Impacto esperado

| Área | Impacto |
| --- | --- |
| `server/shared/persistence/` | **Alto y deseable.** Obliga a modelar la opcionalidad real de los atributos |
| `server/modules/*/domain/` | Medio. Lógica pura, sin I/O |
| `server/modules/*/infrastructure/` | **Alto.** Las respuestas de proveedores externos son parcialmente opcionales por naturaleza |
| `src/` | Medio-alto. Props de React y estado |

## 8.5 Recomendación

**Activar `strict: true`**, y hacerlo **antes** de escribir el esqueleto, no después: cada fichero creado sin él es un fichero que habrá que revisar.

Si el volumen resultase inasumible, la vía gradual es activar primero **`strictNullChecks`**, que es la que protege R-38, y después el resto.

> **No se modificó `tsconfig.json`.** El sprint lo prohíbe expresamente: *«No modificar sin aprobación.»* Registrado como vacío **V-3** en DEV-00 §11.

---

# 9. Verificación V-4 — Verificación Automática de Arquitectura

## 9.1 Qué hay que verificar

Tres cuerpos de reglas, todos ya aprobados y hoy sin comprobación alguna:

| Origen | Contenido |
| --- | --- |
| **ADR-08 §10** | Ocho filas de dependencias permitidas y prohibidas para la capa de persistencia |
| **ADR-09 §8** | La fila del Composition Root |
| **ADR-07 §8** | Siete filas para routes, mappers, contracts, orchestrators, application, domain e infrastructure |

Traducidas a **DEV-00 §3.1 a §3.3** como reglas R-01 a R-29.

> **Es el riesgo RI-1 de DEV-00 §9**, y su §11 lo registra como vacío **V-4**: *«las reglas de §3 no se verifican automáticamente y su cumplimiento depende de la disciplina del revisor»*. Es el modo de fallo más probable de todo el contrato de implementación.

## 9.2 Herramientas propuestas

| # | Herramienta | Qué cubre | Valoración |
| --- | --- | --- | --- |
| **1** | **`eslint-plugin-import` — `import/no-restricted-paths`** | Zonas de importación por ruta de origen y destino | **Recomendada.** Expresa casi literalmente las tablas de ADR-08 §10 y ADR-07 §8. Falla en el momento de escribir, no en revisión |
| **2** | **`import/no-cycle`** | Dependencias circulares | **Recomendada.** Cubre un criterio de aceptación del sprint |
| **3** | **`dependency-cruiser`** | Reglas de arquitectura declarativas, con grafo y validación en CI | **Recomendada como complemento.** Más expresiva para reglas negativas del tipo «solo `adapters/` puede importar el driver», y genera el diagrama de fronteras |
| **4** | **Import maps de TypeScript** | — | **Descartada.** `paths` restringe resolución, no autoriza ni prohíbe por capa |
| **5** | **Test de arquitectura propio** | — | **Descartada para la V1.** Reimplementa lo que las dos anteriores ya hacen |

## 9.3 Cobertura estimada de las reglas de DEV-00

| Reglas | Verificable automáticamente |
| --- | --- |
| **R-01 a R-29** *(fronteras, contratos, persistencia)* | ✅ **Sí**, casi en su totalidad, con las herramientas 1 y 3 |
| **R-54 a R-58** *(inyección de dependencias)* | 🟡 **Parcial.** El import del Adapter sí; la ausencia de Singleton exige revisión |
| **R-30 a R-41** *(semántica de escritura)* | ❌ **No.** Es comportamiento — corresponde a tests (V-1) |
| **R-42 a R-47** *(dominio e invariancia)* | ❌ **No.** Exige juicio. Es el checklist de DEV-00 §7 |
| **UI-1 a UI-10** | ❌ **No.** Revisión humana |
| **R-59** *(terminología)* | ✅ **Sí**, con `no-restricted-syntax` |

> **Ninguna herramienta sustituye al checklist de DEV-00 §7.** Automatizar las fronteras libera la revisión humana para lo que **solo** ella puede juzgar: que ningún cambio reduzca el conjunto de Leads del usuario.

**No se implementó nada.** El sprint lo pide expresamente: *«Proponer herramientas. No implementarlas todavía.»*

---

# 10. Impacto sobre los Criterios de Aceptación

| # | Criterio | Estado |
| --- | --- | --- |
| 1 | Toda la arquitectura existe | ❌ **No.** Cinco entregables bloqueados (§5) |
| 2 | Todos los módulos compilan | ⛔ **Inverificable** — HZ-0 |
| 3 | No existen dependencias circulares | ⛔ **Inverificable** — HZ-0 · V-4 sin implementar |
| 4 | Ninguna capa viola DEV-00 | ⛔ **Inverificable automáticamente** — V-4 |
| 5 | No existe lógica de negocio | ⚠️ **Ya existe** en el código actual: `scoring.ts`, `deduplicateLeads.ts`, `zones.ts`. Precede a este sprint |
| 6 | Todos los contratos públicos están definidos | ⚠️ **Parcial.** Los de API existen; los de persistencia contradicen ADR-12 (HZ-5) |
| 7 | La aplicación inicia correctamente | ⛔ **Inverificable** — HZ-0 |

**El sprint no puede darse por terminado.**

---

# 11. Decisiones Requeridas

Ordenadas por lo que desbloquean:

| # | Decisión | Desbloquea | Quién |
| --- | --- | --- | --- |
| **D-1** | **Instalar Node.js y las dependencias del proyecto** | Todo el sprint. Sin esto no hay nada verificable | Operativa |
| **D-2** | **¿Existe un Event Bus en AKVEZ?** Si sí, requiere ADR propio. Si el entregable 10 se refería al catálogo de ADR-13 §13, confirmarlo | Entregable 10 | **ADR nuevo** |
| **D-3** | **Arquitectura del cliente**: Composition Root del frontend, enrutado y composición, equivalente a ADR-04 para el backend | Entregable 5 · vacío V-6 | **ADR nuevo** |
| **D-4** | **Correspondencia entre `LeadStatus` y los cinco estadios de PO-01 §8** | Entregables 2, 4, 7 | **Product Office** |
| **D-5** | **Forma de la Repository Interface** conforme a ADR-12 §7.2 y ADR-13 §11.1 | Entregables 4, 7 | **Architecture Team** |
| **D-6** | **Modelo de `User`** — pendiente desde ADR-08 §312 | D-5, y con ella la persistencia | **Product Office** |
| **D-7** | Confirmar que «contenedor» de DI se lee como **Composition Root** | Entregable 6 *(ya implementado)* | Confirmación |
| **D-8** | **Activar `strict: true`** | Calidad de todo el esqueleto. **Conviene decidirlo antes de escribirlo** | **Product Office** |
| **D-9** | Aprobar **Vitest** y **ESLint 9** como dependencias nuevas | V-1 · V-2 · V-4 | **Product Office** |

> **D-1, D-8 y D-9 conviene resolverlas antes de reanudar.** Escribir el esqueleto sin compilador, sin `strict` y sin verificación de fronteras produciría exactamente el código que DEV-00 existe para evitar.

---

# 12. Referencias

- **PO-01 v1.1** §2, §6, §8 — ciclo de vida canónico.
- **APS-02 v2.1** §9 · **APS-04 v4.0** §A.4, §A.9 · **APS-07 v2.0** §6.1, §7.2, §8.4 · **APS-08 v1.2** §6.5, §7.1 · **APS-12 v1.0** §7, §8 · **APS-14**.
- **ADR-01 v1.0** §8, §10 · **ADR-04 v1.2** §7.6, §7.8, §8 · **ADR-05 v1.4** §6, §14 · **ADR-07 v1.1** §8 · **ADR-08 v1.2** §6, §10, §312 · **ADR-09 v1.1** §5, §6, §7, §8 · **ADR-11 v2.1** §9 · **ADR-12 v1.1** §7.2, D-6 · **ADR-13 v1.1** §7.1, §11.1, §11.3, §13, §13.4.
- **ADS-00 v1.3** — Clasificación Oficial, categoría DEV; regla R-7.
- **ADS-01 v1.1** §11 · **ADS-02 v1.1** §5.2, §10, §11.
- **AR-02** §4.2, §6.2 · **AR-03 v1.2** §7 · **AR-04 v1.0** §10.1.
- **DEV-00 v1.1** §3, §6, §7, §9 (RI-1, RI-6), §11 (V-1 a V-4, V-6).
- **Código inspeccionado:** `server/bootstrap/compositionRoot.ts` · `server/shared/persistence/**` · `server/modules/**` · `src/App.tsx` · `package.json` · `tsconfig.json`.
