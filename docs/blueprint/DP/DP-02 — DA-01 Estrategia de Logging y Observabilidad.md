# DP-02 — DA-01: Estrategia de Logging y Observabilidad

| Campo | Valor |
| --- | --- |
| Código | DP-02 |
| Clasificación | **DP** — Decision Paper *(orden 5, consultiva)* |
| Versión | 1.1 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** — sprint GOV-03, 2026-07-29 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.3 |
| Sprint | **DEV-02.1 — Cierre de Decisiones Arquitectónicas Pendientes** |
| Resuelve | **DA-01** · desviación **A-04** · entregable **B4** de DEV-02 |

> **Naturaleza.** Decision Paper: deliberación **previa** a una decisión. Autoridad **consultiva** (ADS-00, orden 5).
>
> **No decide, no implementa y no modifica ningún documento.** Propone una arquitectura y señala exactamente qué habría que modificar y por qué. **Ningún fichero de código fue creado ni modificado.**
>
> **Se emplea el código `DP-02`** porque `DA` no pertenece a la Clasificación Oficial de ADS-00. El identificador `DA-01` se conserva en el título.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se cierra §8 con la constancia de la ratificación. **No se modifica ningún análisis, alternativa, regla propuesta ni riesgo.** | Sprint **GOV-03**, tarea 1. Verificada la ausencia de contradicción con documentos `Approved`: la propuesta es la lectura literal de **APS-16 §14**, respeta la regla disciplinaria de **ADR-04 §11**, la exclusión de `domain/` de **DEV-00 R-04** y **ADR-05 §6 P3**, y el saneamiento exigido por **APS-10**. **Autoridad que aprueba: AKVEZ Product Office.** |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Análisis de la relación entre logging y observabilidad, cuatro alternativas evaluadas y arquitectura recomendada. | DA-01 del sprint DEV-02.1. DEV-02 se detuvo en B4 por no existir decisión documentada. |

---

# 1. Contexto

**DEV-02 se detuvo en su entregable B4** —«Sistema de logging»— porque ningún documento aprobado define un subsistema de logging, y crear `shared/logging/` habría sido inventar una carpeta.

Coexisten hoy dos hechos en tensión:

| Hecho | Estado |
| --- | --- |
| **`shared/logging/`** — pedido por DEV-02 B4 | **No existe.** No lo declara ningún ADR |
| **`shared/observability/executionReport.ts`** — existe y se usa | **Real, pero no enumerado** en ADR-04 §11. Es la desviación **A-04** de DEV-01A |

## 1.1 Lo que sí está decidido, y no se había considerado

**El Blueprint sí obliga a observar. Lo hace en tres documentos aprobados:**

| Documento | Qué exige |
| --- | --- |
| **APS-16 §14 — «Observabilidad»** | «Todo componente deberá generar: **logs; métricas; eventos; errores; tiempos de respuesta**» |
| **APS-11 §4.5 — «Observabilidad»** | «Toda comunicación con servicios externos deberá generar registros que faciliten auditoría y diagnóstico» |
| **ADR-13 §11.2** | Clasifica el «Registro de ejecución de agente» (A-10) como **«observabilidad»**, diferible |

> **Éste es el hallazgo central de DA-01.** **APS-16 §14 no trata el logging como una preocupación distinta de la observabilidad: lo enumera como uno de sus cinco productos.** Una sola obligación, cinco salidas.
>
> Crear `logging/` como hermano de `observability/` **partiría en dos lo que el Blueprint declara uno**.

## 1.2 Estado real del código

`server/shared/observability/executionReport.ts`, según su propia cabecera y verificación por inspección:

| Propiedad | Estado |
| --- | --- |
| Origen normativo declarado | **APS-16 §14 · APS-11 §4.5** |
| Dependencias | **Ninguna** salvo `async_hooks` del runtime de Node |
| Ámbito | *Request-scoped* mediante `AsyncLocalStorage` |
| Efecto sobre el resultado observado | **Ninguno.** Toda función devuelve `void` y es *no-op* sin reporte activo |
| Seguridad | Sanea credenciales en el punto de registro, no en el llamador |
| Importado desde | `application/` (3), `infrastructure/` (3), `routes/` (2), `shared/ai/` (1) — **nunca desde `domain/`** |

**No es un prototipo desechable.** Es una implementación deliberada, alineada con APS-10 en cuanto a no registrar credenciales, y que no altera ninguna firma ni dirección de dependencia.

---

# 2. Análisis

## 2.1 Qué falta exactamente

No falta la decisión de **observar** —está en APS-16 §14—. Falta:

1. **La fila de `shared/observability` en la tabla de ADR-04 §11**, que enumera cinco servicios compartidos y no lo incluye.
2. **La relación entre logging y observabilidad**, que APS-16 §14 resuelve implícitamente pero ningún ADR hace explícita.
3. **La regla de acceso por capa**, que ADR-04 §11 sí especifica para los otros cinco servicios.

## 2.2 Por qué no basta con lo que hay

ADR-04 §11 no es una lista ilustrativa: asigna a cada servicio compartido una **regla de acceso** distinta —`shared/ai` solo desde `infrastructure/`; `errors`, `types`, `utils` y `config` desde cualquier capa—. Un servicio sin fila **no tiene regla de acceso declarada**, y hoy `observability/` se importa desde cuatro clases de ubicación sin norma que lo autorice ni lo limite.

## 2.3 La cuestión del proveedor

DEV-02 B4 pedía «implementar únicamente la interfaz» para permitir después Console, Pino, Winston u OpenTelemetry «sin modificar dominio».

**El requisito es correcto y ya está satisfecho en su parte esencial:** `domain/` no importa observabilidad hoy. Pero **ningún documento decide el proveedor**, y APS-16 §14 no lo exige. La sustituibilidad es un objetivo legítimo de diseño; el proveedor concreto es una decisión posterior.

---

# 3. Alternativas

## Alternativa A — Coexistencia de `logging/` y `observability/`

Dos carpetas hermanas: `logging/` para registro textual, `observability/` para métricas y trazas.

| Ventajas | Desventajas |
| --- | --- |
| Separa registro de instrumentación | **Contradice APS-16 §14**, que unifica ambos en una obligación |
| Coincide con la nomenclatura habitual de la industria | Exige **dos filas nuevas** en ADR-04 §11 |
| | Frontera ambigua: ¿un error registrado es log o evento? Ambos según APS-16 §14 |
| | **A-04 seguiría abierta**, ahora duplicada |

## Alternativa B — Observabilidad única, con el logging como una de sus salidas ✅

**Un solo servicio compartido, `shared/observability/`**, responsable de las cinco salidas de APS-16 §14. El logging es un *sink* dentro de él, no un módulo hermano.

| Ventajas | Desventajas |
| --- | --- |
| **Es la lectura literal de APS-16 §14**: una obligación, cinco productos | Requiere revisión menor de ADR-04 §11 |
| **Cierra A-04** regularizando lo que ya existe | El nombre «observabilidad» es menos familiar que «logging» para quien busque dónde escribir un log |
| No descarta el trabajo ya hecho ni exige migración | |
| Una sola frontera que auditar, una sola regla de acceso | |
| Permite sustituir el proveedor tras un único *sink* | |

## Alternativa C — Renombrar `observability/` a `logging/`

| Ventajas | Desventajas |
| --- | --- |
| Nombre más reconocible | **Reduce el nombre al menor de los cinco productos** de APS-16 §14 |
| | Métricas y tiempos de respuesta quedarían bajo un nombre que no los describe |
| | Renombrado con impacto en 9 ficheros, sin beneficio arquitectónico |

## Alternativa D — Absorber en `shared/utils/`

| Ventajas | Desventajas |
| --- | --- |
| No añade filas a ADR-04 §11 | ADR-04 §11 define `utils` como «utilidades genéricas **sin lógica de negocio**»; la observabilidad tiene estado *request-scoped*, no es una utilidad pura |
| | Oculta una preocupación que APS-16 §14 declara de primer nivel |
| | A-04 se resolvería escondiendo el problema |

---

# 4. Recomendación

> ## Alternativa B — Observabilidad única, con logging como salida.

**Fundamento:** APS-16 §14 enumera «logs, métricas, eventos, errores, tiempos de respuesta» como productos de **una sola** obligación. La arquitectura debe reflejar la decisión del Blueprint, no la taxonomía habitual de la industria.

## 4.1 Arquitectura propuesta

| Aspecto | Propuesta |
| --- | --- |
| **Responsabilidad** | Producir las cinco salidas de APS-16 §14 y los registros de comunicación externa de APS-11 §4.5. **Instrumentación pura**: nunca altera el resultado de la operación observada |
| **Ubicación** | `server/shared/observability/` — una única carpeta. **No se crea `logging/`** |
| **Estructura interna** *(sin prescribir ficheros)* | Un **contrato de sink** provider-agnóstico, una implementación por consola como sink por defecto, y el reporte de ejecución ya existente |
| **Dependencias permitidas** | Runtime de Node (`async_hooks`) y `shared/errors` para clasificar por categoría |
| **Dependencias prohibidas** | `modules/*/**` · `shared/persistence/**` · `shared/contracts/` · `shared/mappers/` · `express` · SDK de proveedores |
| **Regla de acceso** | Accesible desde `application/`, `infrastructure/`, `routes/`, `orchestrators/` y `shared/`. **Prohibida desde `domain/`** |
| **Sustituibilidad** | Cambiar Console por Pino, Winston u OpenTelemetry deberá ser un cambio **solo en el sink**. Ninguna capa observada cambia |

## 4.2 Por qué `domain/` queda excluida

Es la única regla de acceso más estricta que la del código actual, y es deliberada:

- **DEV-00 R-04** — `domain/` no importa nada externo a su módulo.
- **ADR-05 §6, Principio 3** — el dominio debe ser ejecutable sin conexión externa.
- El código actual **ya la cumple**: ninguno de los 9 importadores es `domain/`. La regla **formaliza el estado real**, no lo cambia.

## 4.3 Reglas de uso propuestas

| # | Regla |
| --- | --- |
| **O-1** | La observabilidad **nunca altera el resultado** de la operación observada. Toda función de registro devuelve `void` |
| **O-2** | Un fallo del subsistema de observabilidad **nunca propaga** ni interrumpe la operación |
| **O-3** | **Nunca se registran credenciales, prompts ni datos personales** sin sanear. El saneamiento se aplica en el punto de registro, no en el llamador *(APS-10)* |
| **O-4** | `domain/` no importa observabilidad *(DEV-00 R-04)* |
| **O-5** | El proveedor concreto reside **solo** en el sink. Ninguna capa observada lo nombra |
| **O-6** | Las trazas **no se exponen nunca al usuario** *(APS-04 §A.9, UI-9)* |

---

# 5. Impacto

## 5.1 Sobre A-04

**Se cierra.** La desviación consistía exactamente en que `shared/observability/` existía sin estar declarada. Al incorporarla a ADR-04 §11 con su regla de acceso, deja de ser desviación.

## 5.2 Sobre el código

**Ninguno inmediato.** La arquitectura propuesta **describe lo que ya existe** y le añade una regla de acceso que el código ya cumple. No exige migración ni renombrado.

El trabajo posterior —contrato de sink y sink por consola— es aditivo y no altera a los 9 importadores actuales.

## 5.3 Sobre DEV-02 B4

**B4 queda replanteado, no cancelado:** «sistema de logging» pasa a ser «contrato de sink dentro de observabilidad». Ejecutable en cuanto se apruebe esta propuesta.

---

# 6. Qué Documento Habría que Modificar

> **No se ha modificado nada.** Se propone con precisión, conforme al protocolo del sprint.

| Campo | Detalle |
| --- | --- |
| **Documento** | **ADR-04 — Backend Agent Architecture** *(v1.2, `Approved`)* |
| **Sección** | **§11 — Servicios Compartidos**, tabla de servicios |
| **Cambio** | **Añadir una fila** para `shared/observability`, con su contenido y su regla de acceso, en el mismo formato que las cinco existentes |
| **Naturaleza** | **Aditiva.** No modifica ninguna de las cinco filas actuales, ni §8, ni los principios de §7 |
| **Clasificación** | **Cambio Menor** conforme a APS-13 §9 — no altera ninguna decisión, formaliza un servicio ya existente exigido por APS-16 §14 |
| **Por qué ADR-04 y no un ADR nuevo** | La decisión de observar **ya está tomada** en APS-16 §14. Lo que falta es su ubicación arquitectónica y su regla de acceso, que es precisamente la materia de ADR-04 §11. Un ADR nuevo duplicaría el gobierno de una decisión existente |
| **Versión resultante** | ADR-04 v1.3 |

> **No basta con un documento DEV.** ADS-00 v1.3 establece que la categoría DEV **no puede introducir arquitectura** y que toda regla DEV debe derivar de un documento superior. La fila de ADR-04 §11 es el documento superior que hoy no existe.

---

# 7. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **R-1** | **Alguien crea `logging/` por costumbre** al no encontrar una carpeta con ese nombre | Media | Regla explícita en ADR-04 §11 y en DEV-00: el logging es una salida de observabilidad |
| **R-2** | **La observabilidad se filtra a `domain/`** para instrumentar una regla de negocio | Media | Regla **O-4**. Verificable por análisis de imports |
| **R-3** | **Se registran credenciales o datos personales** al añadir instrumentación nueva | **Alta** | Regla **O-3** y saneamiento en el punto de registro, como ya hace el código |
| **R-4** | **Un fallo de observabilidad rompe una operación** | **Alta** | Reglas **O-1** y **O-2**. Es la propiedad más valiosa del diseño actual y debe preservarse |
| **R-5** | **Se adopta un proveedor sin decisión** al implementar el sink | Media | El proveedor es decisión posterior. El sink por defecto es consola, sin dependencia nueva |
| **R-6** | **La aprobación se demora** y DEV-03 avanza sin instrumentación normada | Media | La propuesta describe el estado actual: el riesgo de esperar es bajo |

---

# 8. Decisión Propuesta

> **Adoptar la Alternativa B**: un único servicio compartido `shared/observability/`, responsable de las cinco salidas de APS-16 §14, con el logging como una de ellas y el proveedor confinado a un sink sustituible.
>
> **No se crea `shared/logging/`.**
>
> **Vía de formalización:** revisión menor y aditiva de **ADR-04 §11** para incorporar la fila de `shared/observability` con su regla de acceso.
>
> **Cierra:** desviación **A-04** · entregable **B4** de DEV-02 · vacío parcial de instrumentación.

## 8.1 Ratificación

> ## ✅ RATIFICADA — Product Office, 2026-07-29 (sprint GOV-03)
>
> **Se adopta la Alternativa B.** `shared/observability/` es el único servicio compartido de instrumentación; **`shared/logging/` no se crea**. Las seis reglas de uso **O-1 a O-6** quedan aprobadas.
>
> **Verificación de ausencia de contradicción:**
>
> | Documento | Resultado |
> | --- | --- |
> | **APS-16 v1.0 §14** | ✅ La propuesta es su lectura literal: una obligación, cinco salidas |
> | **APS-11 v1.0 §4.5** | ✅ Cubre los registros de comunicación externa |
> | **APS-10 v1.0** | ✅ Regla **O-3** — saneamiento en el punto de registro |
> | **APS-04 v4.0 §A.9 (UI-9)** | ✅ Regla **O-6** — las trazas no se exponen al usuario |
> | **ADR-04 v1.2 §11** | ✅ Respeta la regla disciplinaria: `shared/` sin lógica de negocio |
> | **ADR-05 v1.4 §6 P3** · **DEV-00 R-04** | ✅ Regla **O-4** — `domain/` excluida. Formaliza el estado real del código |
>
> **Ninguna contradicción detectada.**

## 8.2 Qué queda por ejecutar

> ⚠️ **La ratificación decide; no formaliza.** **ADR-04 §11 sigue sin la fila de `shared/observability`**, y por tanto **A-04 sigue formalmente abierta**.

GOV-03 prohíbe alterar cualquier ADR salvo su estado e historial, de modo que la revisión propuesta en §6 **no se ejecutó**. Queda pendiente:

| Acción | Documento | Naturaleza |
| --- | --- | --- |
| **Añadir la fila de `shared/observability`** con su regla de acceso | **ADR-04 §11** → v1.3 | Revisión **aditiva**, cambio **Menor** (APS-13 §9). Requiere sprint propio |
| Incorporar las reglas **O-1 a O-6** | **DEV-00 §3** | Categoría DEV, trámite ordinario |
| Implementar el contrato de sink y el sink por consola | Código | Replantea el **B4** de DEV-02 |

> **Nota de gobernanza.** Un **DP** tiene autoridad **consultiva** (ADS-00, orden 5). Esta ratificación fija la decisión; su fuerza normativa nacerá de la fila en ADR-04 §11. **Hasta entonces, `shared/observability/` sigue siendo una carpeta no declarada.**

---

# 9. Referencias

- **APS-16 v1.0** §14 — Observabilidad. **Fundamento principal.**
- **APS-11 v1.0** §4.5 — Observabilidad de comunicaciones externas.
- **APS-10 v1.0** — Seguridad, privacidad y confianza.
- **APS-04 v4.0** §A.9, UI-9 — la interfaz no expone trazas.
- **APS-13 v1.0** §9 — clasificación de cambios.
- **ADR-04 v1.2** §7, §8, **§11** — servicios compartidos y reglas de acceso.
- **ADR-05 v1.4** §6, Principio 3 — el dominio debe ser testeable sin conexión.
- **ADR-08 v1.2** §10 — dependencias permitidas y prohibidas.
- **ADR-13 v1.1** §11.2 — A-10 clasificado como observabilidad.
- **ADS-00 v1.3** — categoría DEV, regla **R-7**.
- **DEV-00 v1.1** §3 (R-04), §4.2.
- **DEV-01A v1.0** — desviación **A-04**.
- **DEV-01B v1.0** · **DEV-02** — entregable B4 detenido.
- **Código inspeccionado:** `server/shared/observability/executionReport.ts` y sus 9 importadores.
