# COM-11 — `GenerateProposal` Governance Closure

| Campo | Valor |
| --- | --- |
| Código | COM-11 |
| Clasificación | **Cierre de gobernanza** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Informe. No aprueba nada y no crea ADR** |
| Fecha | 2026-08-01 |
| Motivo | Sprint 09 |
| Relacionado | COM-08 *(checklist)* · COM-09 *(diseño)* · COM-10 *(readiness)* |

> **Aportación nueva de este documento: §3 y §4.**
>
> Las tablas de bloqueos, decisiones y riesgos **consolidan** COM-08 y COM-10 sin repetirlas. **Lo que no existía es el contenido mínimo de `SP-01`** *(§3)* **y el análisis de dónde vive la política de reintentos** *(§4)*, donde aparece una colisión de vocabulario que conviene resolver antes de escribir código.

---

# 1. Estado de bloqueos

| Bloqueo | Propietario | Impacto si no se resuelve | Decisión requerida |
| --- | --- | --- | --- |
| **B-1 · `SP-01` sin publicar** | **Product Office** | 🔴 Toda propuesta emitida sería **inexplicable** —la estrategia no sería reproducible *(ADR-15 §7.2)*— y, por ADR-18 §10.4, **el defecto sería permanente** | Responder las 3 cuestiones de ADR-18 §11, ratificar SP-01…SP-12, asignar código y **publicar la primera versión** |
| **B-2 · Reintentos del punto de control** | **Product Office** | 🔴 El caso de uso decidiría un parámetro que no le corresponde *(R-52)*, o rehará indefinidamente | Fijar el número y **dónde se publica** *(§4)* |
| **B-3 · Enriquecer la lista de hechos** | Product Office, vía APS-08/APS-19 | 🟡 Los contactos afirmarán poco. **No impide emitir** *(RE-5)* | Si el Lead Analyzer debe producir hechos observados propios |

**B-1 y B-2 bloquean. B-3 no** *(COM-10 §3.2)*.

---

# 2. Decisiones cerradas, separadas por naturaleza

## 2.1 Arquitectura — cerradas y verificadas en código

Once decisiones, enumeradas en **COM-10 §1** con su verificación. En síntesis: `GenerateProposal` **no busca** información, **solo afirma** lo observado, **no recibe** la estrategia sino que la produce, **no persiste** hechos, y **su entrada y salida están definidas** *(COM-07 · COM-09)*.

**No requieren nada de Product Office.**

## 2.2 Producto — decididas

| Decisión | Dónde consta |
| --- | --- |
| El Perfil pertenece al **Product Office** | ADR-15 §7.4 · DDD-01 §2.2 |
| El criterio comercial lo decide **APS-18** | DDD-01 §9.2 |
| **No existe estrategia por defecto** | Verificado en código *(COM-08 §4.3)* |
| **Las emisiones bajo ausencia no se reetiquetan** | Propuesto en ADR-18 §10.4 — **pendiente de confirmación** |

## 2.3 Producto — pendientes

**Las tres cuestiones de ADR-18 §11**, más las dos de su §10.4 y §SP-05, listadas en **COM-08 §2**. Ninguna es técnica.

> **No quedan decisiones comerciales ocultas.** Todas las abiertas están enumeradas aquí o en COM-08 §2.

---

# 3. Contenido mínimo de `SP-01`

**Es la pieza que faltaba.** ADR-18 §9 define el **sobre** —C-1 a C-7: designación, fecha, autoridad, referencia, sucesión—. **No define qué debe decir la primera versión** para que `GenerateProposal` funcione.

## 3.1 Lo que `SP-01` NO necesita decidir

**La mayor parte del criterio ya está publicada**, y `SP-01` **no debe reabrirla**:

| Ya decidido | Dónde |
| --- | --- |
| Los seis **momentos**, su orden, su objetivo y su barrera | **APS-18 §9.2** |
| Los cinco **Micro-Yes** y que no se salta ninguno | **APS-18 §4.5** |
| Las cinco **barreras** y que solo se ataca una por contacto | **APS-18 §5.1** |
| Las **emociones admisibles** y las excluidas por diseño | **APS-18 §8.5** |
| Qué **canal** transporta cada momento | **APS-20 §7** |
| Qué **restringe** cada variable `Desconocida` | **APS-19 §8.2** |
| La forma **observable y binaria** del resultado esperado | **APS-18 §5.2** |

> **Consecuencia práctica: `SP-01` es pequeño.** Casi todo lo que un contacto necesita ya está publicado y es invariable.

## 3.2 Lo que `SP-01` sí debe decidir

**Tres correspondencias**, y solo se necesitan porque **APS-18 fija el objetivo por *momento*, no por *estado del comprador***:

| # | Correspondencia | Por qué hace falta |
| :-: | --- | --- |
| **C-3a** | **`CommercialState` (BD-1) → punto de entrada** | APS-18 §7.2 describe qué necesita cada estado para avanzar, pero **no dice por qué momento entrar** cuando el comprador ya está avanzado. Sin esto, toda secuencia empieza en Reconocimiento aunque el comprador esté *Consciente de la Solución* |
| **C-3b** | **`BD-7` identidad profesional → enfoque** | APS-19 §6.7 dice que BD-7 *«determina qué se reconoce antes de observar nada crítico»*. **Qué se reconoce en cada caso no está publicado** |
| **C-3c** | **Objetivo del momento → forma del resultado esperado** | APS-18 §5.2 exige que sea observable y binario, y da ejemplos. **Falta la correspondencia sistemática** |

## 3.3 Qué transcribirá el código, y qué nunca

| ✅ Transcribe | ⛔ Nunca |
| --- | --- |
| Las tres correspondencias C-3a/b/c | Ampliarlas o completarlas |
| La designación `SP-01` como constante literal | Generarla, derivarla o versionarla |
| La vinculación de cada emisión a la designación *(RC-13)* | Editar una versión publicada |

**Con la cabecera declarativa del precedente:** *«ESTE FICHERO NO DECIDE NADA»* *(`weightingProfile.ts`)*.

## 3.4 Verificación de suficiencia

> **Si `SP-01` publica C-3a, C-3b y C-3c, `GenerateProposal` puede producir una estrategia completa.**

Los diez contenidos de APS-18 §8.1 quedarían determinados: **objetivo** (C-3a + momento), **barrera** (APS-18 §9.2), **base de evidencia** (la lista cerrada), **enfoque** (C-3b), **emoción** (§8.5), **hilos** (la secuencia), **elemento de relevancia** (SC-R3), **canal y momento** (APS-20 §7 + la secuencia) y **resultado esperado** (C-3c).

**Ninguno queda sin origen.**

---

# 4. Política de reintentos del punto de control

## 4.1 Una colisión de vocabulario que hay que resolver primero

> ⚠️ **«Reintento» significa dos cosas distintas en AKVEZ, y confundirlas llevaría el parámetro al sitio equivocado.**

| | **Reintento de proveedor** | **Reintento del punto de control** |
| --- | --- | --- |
| Qué falla | La llamada: red, cuota, indisponibilidad | **El texto no supera la verificación del dominio** |
| Quién decide reintentar | El adapter | **`application/`**, tras decidir el dominio *(ADR-16 §7)* |
| Naturaleza | **Limitación técnica** | **Límite de cuánto insiste el sistema en decir algo dentro de su evidencia** |
| Dónde vive hoy | `shared/ai/generateWithRetry.ts` | No existe |
| Autoridad del valor | **APS-17** *(R-50 · R-52)* | **§4.2** |

**ADR-17 P-3 enumera «reintentos» entre los parámetros operativos que viven en el adapter.** Esa frase se refiere al primero. **Aplicarla al segundo sería un error**: si el adapter reintentase por su cuenta, **el dominio no volvería a verificar cada texto nuevo**, y el punto de control dejaría de ser un punto de control.

## 4.2 Dónde debe vivir

**Tres candidatos, y dos se descartan por regla:**

| Candidato | Veredicto |
| --- | :-: |
| **En el adapter**, como los de `generateWithRetry` | ⛔ El dominio no revisaría los intentos intermedios *(§4.1)* |
| **En `Deps` del caso de uso** | ⛔ **AL-08** — `Deps` contiene **solo** puertos y funciones de caso de uso. Un número no es ninguna de las dos |
| **Transcrito en `domain/`**, desde su documento de autoridad | ✅ **Es el único compatible.** Mismo mecanismo que `weightingProfile.ts` |

**Y `application/` no puede leerlo de configuración:** ADR-17 §13, prohibición 9 — *«lee configuración o `process.env`»*.

## 4.3 Qué documento tiene autoridad

**Recomendación: APS-18**, no APS-17.

**Razón:** APS-17 gobierna parámetros que **superan el Criterio de Invariancia** de DEV-00 §3.6 —cambiarlos no altera qué Leads existen ni qué se les dice—. **Este no lo supera del todo**: el número de intentos determina **con qué frecuencia el sistema renuncia a hablar de un negocio** por no poder decir nada sostenible. Eso es criterio comercial, no capacidad técnica.

> **Si `SP-01` lo publica, el parámetro queda vinculado a la versión del criterio** — y entonces *«cuántas veces insistimos»* se vuelve **reproducible y comparable entre versiones**, igual que el resto de la estrategia. **Es la ubicación que más coherencia produce.**

## 4.4 Qué NO debe existir en código todavía

| Prohibido hoy | Por qué |
| --- | --- |
| Una constante de reintentos, con cualquier valor | **R-52** — ningún valor aprobado |
| Un valor por defecto *(«3 si no se configura»)* | **R-38** — sustituir un dato inexistente |
| Un bucle sin límite | Convertiría el agotamiento en un cuelgue |
| Reintentar en el adapter | §4.1 |

## 4.5 Lo que sí está decidido

**Qué ocurre al agotarse: rama `control_failed` del resultado** *(COM-09 §4.2)*. **No se entrega texto con advertencia** — *«un filtro deja pasar con advertencia; **esto rehace**»* *(DDD-01 §8 · ADR-15 §10)*.

**Es decisión de arquitectura y ya está tomada.** Solo falta el número.

---

# 5. Riesgos

| Riesgo | Severidad | Evaluación |
| --- | :-: | --- |
| **Implementar sin `SP-01`** | 🔴 | Propuestas **inexplicables y de forma permanente** *(COM-10 §5)*. **El riesgo no es la calidad: es que nadie podrá reconstruir por qué se dijo lo que se dijo** |
| **Crear estrategia por defecto** | 🔴 | Decisión comercial **sin criterio y sin autor**. **Es el atajo natural si se implementa sin Perfil**, y por eso el riesgo anterior lo arrastra |
| **Fijar reintentos en código** | 🟡 | Un número inventado **parecería una decisión tomada**. Es reversible —una constante—, pero **quedaría vinculado a emisiones reales** y su cambio posterior alteraría el comportamiento sin que ninguna versión lo registre |

---

# 6. Criterio de desbloqueo

## ¿Qué condiciones exactas permiten iniciar el Sprint de `GenerateProposal`?

**Cuatro. Ninguna es de ingeniería.**

| # | Condición | Verificable por |
| :-: | --- | --- |
| **1** | **ADR-18 aprobado**, con respuesta a sus tres cuestiones abiertas | Estado `Approved` del documento |
| **2** | **`SP-01` publicado** con C-1…C-7 de ADR-18 §9 **y las tres correspondencias de §3.2** | Existencia del documento y su designación |
| **3** | **Número de reintentos del punto de control publicado**, con su documento de autoridad decidido *(§4.3)* | Valor citable |
| **4** | **Confirmación de que las emisiones bajo ausencia no se reetiquetan** *(ADR-18 §10.4)* | Pronunciamiento |

**Cumplidas las cuatro, no queda ninguna decisión pendiente** y el sprint puede abrirse.

## 6.1 Lo que NO es condición

- **Enriquecer la lista de hechos** *(B-3)*. Mejora los contactos; no condiciona su corrección *(RE-5)*.
- **Resolver F-10.** El Orchestrator ya repara la ausencia mal codificada.
- **Resolver F-7.** `reachableChannels` afecta a `CreateSequence`, no a `GenerateProposal`.

**Incluirlas retrasaría el sprint sin reducir ningún riesgo.**

---

# 7. Referencias

**ADR-15** §7.2, §7.4, §10 · **ADR-16** §7 · **ADR-17** §13, AL-08, P-3 · **ADR-18** *(Draft)* §9, §10.4, §11, SP-05 · **APS-08** §7.1 · **APS-17** · **APS-18** §4.5, §5.1, §5.2, §7.2, §8.1, §8.5, §9.2, RE-5, SC-R3 · **APS-19** §6.7, §8.2 · **APS-20** §7 · **DDD-01** §2.2, §8, §9.2 · **DEV-00** §3.6, R-38, R-50, R-52 · **COM-07** a **COM-10**.
