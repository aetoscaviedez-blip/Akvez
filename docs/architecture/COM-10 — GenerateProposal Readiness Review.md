# COM-10 — `GenerateProposal` Readiness Review

| Campo | Valor |
| --- | --- |
| Código | COM-10 |
| Clasificación | **Revisión de preparación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Informe. No aprueba nada** |
| Fecha | 2026-08-01 |
| Motivo | Sprint 08 |
| Relacionado | COM-03 · COM-04 · COM-06 · COM-07 · COM-08 · COM-09 · ADR-18 *(Draft)* |

> **Contiene una corrección de evaluación propia.** COM-04 §6 R-2 y COM-06 §4 R-2 calificaron el productor de hechos observados como **bloqueo 🔴**. **Ese juicio era correcto cuando se emitió y ha dejado de serlo**, porque el Sprint 05 construyó la proyección que faltaba. Se corrige en §3.

---

# 1. Decisiones cerradas

**Cerradas significa: decididas, implementadas y verificadas por prueba.** No por documentación.

| # | Decisión | Verificación |
| :-: | --- | --- |
| **1** | **`GenerateProposal` no busca información.** Todo entra por argumento | COM-07 §6 · COM-09 §6 — `Deps` excluye los repositorios de diagnóstico y secuencia |
| **2** | **Fuente única de hechos afirmables:** la proyección | `affirmableFacts.contract.ts` — falla si un campo narrativo entra |
| **3** | **Los hechos no tienen inferencia** | `FactKind` no tiene valor inferido |
| **4** | **Los hechos no tienen `confidence`** | No se declara. Un hecho observado no tiene grados |
| **5** | **Los hechos no persisten, no crean evento ni agregado** | Proyección determinista sobre A-2 y A-4 |
| **6** | **Los hechos son inmutables tras la entrega** | `readonly` + `Object.freeze`, con dos pruebas |
| **7** | **No existe estrategia por defecto** | `CreateSequence` deja toda `strategy` ausente, con prueba |
| **8** | **`criteriaVersion` no nace en código** | Constante que **declara ausencia**; ninguna línea la genera |
| **9** | **Autoridad de `ObservedInput`: el Orchestrator** | COM-06 §2.1 — cuatro reglas convergen y dejan un solo componente posible |
| **10** | **Contrato de entrada y salida de `GenerateProposal`** | COM-07 §6 · COM-09 §4 |
| **11** | **La salida no es un «borrador»** | COM-09 §4.1 — `Proposal` no tiene estado de borrador; P-I5 ya cubre el caso |

---

# 2. Bloqueo 1 — Perfil de Estrategia

## 2.1 Las cuatro preguntas

| # | Pregunta | Respuesta | Quién decide |
| :-: | --- | --- | --- |
| **1** | **¿Debe aprobarse ADR-18?** | **Sí, y su contenido no requiere enmienda técnica** — la auditoría de COM-06 §1 lo verificó contra los cuatro criterios. Pero **no puede aprobarse sin responder antes sus tres cuestiones abiertas** | **Product Office** |
| **2** | **¿Quién publica `SP-01`?** | **No está abierta: ya está decidida.** **ADR-15 §7.4** atribuye el Perfil al **Product Office**, y DDD-01 §2.2 lo confirma | *(decidido)* |
| **3** | **¿Dónde vive oficialmente?** | **En dos planos, y ninguno es opcional:** el criterio se publica en **APS-18**, su autoridad de contenido *(DDD-01 §9.2)*; `domain/` lo **transcribe** sin decidir. **Es el precedente exacto de `weightingProfile.ts` respecto de APS-08 §7.1** | **Arquitectura** — respondida |
| **4** | **¿Qué es de Product Office y qué de código?** | **Producto:** el criterio, la designación, la aprobación y la sucesión de versiones. **Código:** transcribir, vincular cada emisión a la designación y declarar la ausencia cuando no hay versión. **Nunca:** generar versión, derivarla de fecha o hash, inventar `"v1"`, editar una publicada, ampliar la tabla | **Arquitectura** — respondida, detalle en COM-08 §3 |

## 2.2 Estado

🔴 **Abierto.** Faltan los cuatro actos de COM-08 §1, y **el cuarto —publicar `SP-01`— es el único que desbloquea**.

## 2.3 Por qué este sí bloquea, cuando la ausencia se toleró en los otros dos casos de uso

**Es la pregunta que decide todo este informe.**

`GenerateDiagnosis` y `CreateSequence` emiten hoy con `SIN-PERFIL-DE-ESTRATEGIA` y se aceptó. **La diferencia no es de grado:**

| | Diagnóstico y secuencia | **Propuesta** |
| --- | --- | --- |
| ¿Qué determina la salida? | Los **indicios** y los **canales** | **El criterio comercial** |
| Papel de `criteriaVersion` | **Etiqueta** de trazabilidad | **Variable de la decisión** *(ADR-15 §7.2)* |
| Sin Perfil… | La salida es la misma | **La estrategia no es reproducible** |

**ADR-15 §7.2** exige que la estrategia sea determinista *«dado el mismo diagnóstico, el mismo estado y **la misma versión del Perfil**»*. Sin la tercera variable no hay determinismo, y **P-I1** dice que sin estrategia explicable una `Proposal` *«no puede explicarse después, que es exactamente lo que la hace útil»*.

> **Emitir propuestas sin Perfil no produciría propuestas peores: produciría propuestas inexplicables.**

---

# 3. Bloqueo 2 — Productor de hechos observados · **reevaluado**

## 3.1 Las cuatro preguntas

| # | Pregunta | Respuesta |
| :-: | --- | --- |
| **1** | **¿Cuál es la fuente oficial?** | **`generateAffirmableFacts`**, alimentada por atributos de la Empresa **(A-2)** y factores medidos de la evaluación **(A-4)** |
| **2** | **¿Quién tiene autoridad?** | **El Orchestrator** compone; **el `domain/` comercial deriva**. Ninguno de los dos módulos de origen participa en la derivación |
| **3** | **¿Qué campos se permiten?** | `lead` · `source` · `website` · `phone` · `rating` · `reviewCount` · `measuredFactors` — **los seis observados** |
| **4** | **¿Qué campos se prohíben?** | Los cinco narrativos · `score` · `band` · `classification` · `unmeasuredFactors` · las variables del diagnóstico · `status`. **Detalle y regla de cada uno en COM-06 §2.3** |

**Las cuatro respetan ADR-04, D-A2, R-24 y la separación de agentes**, verificado en COM-06 §2.1.

## 3.2 Corrección de evaluación

> **Este bloqueo estaba mal calificado, y lo califiqué yo.**

COM-04 §6 sostuvo que *«sin lista cerrada, `GenerateProposal` no puede cumplir P-I4»*. **Era cierto en el Sprint 04, cuando no existía ninguna lista.** El Sprint 05 la construyó, y con ella el argumento decae:

| Regla | ¿Se cumple hoy? |
| --- | :-: |
| **P-I4** — ninguna afirmación sin evidencia en la lista | ✅ La lista existe y es verificable |
| **RE-1** — la lista es cerrada y ninguna capa la amplía | ✅ Contrato de comportamiento |
| **RE-2** — lo inferido no cruza al mensaje | ✅ No hay clase inferida |
| **RE-3** — lo desconocido se declara | ✅ `unmeasuredFactors` no entra |

**Y la delgadez de la lista no es un defecto: está prevista y aceptada por el Blueprint.**

> **RE-5** — *«El sistema dirá menos cosas, y serán ciertas. Es una consecuencia aceptada: en frío, **tres hechos verificables convierten mejor que diez plausibles**»*.
>
> **APS-18 §11.4** advierte precisamente de lo contrario —compensar la cobertura delgada con inferencias—, que es lo que la proyección impide.

## 3.3 Estado

🟡 **Ya no es un bloqueo. Es una limitación conocida y aceptada.**

**Lo que sigue abierto es una decisión de producto, no de arquitectura:** si el Lead Analyzer debe **enriquecer** la lista produciendo hechos observados propios *(COM-04 §7.1)*. **Mejoraría la calidad de los contactos; no condiciona su corrección.** Corresponde a **APS-08 y APS-19**.

---

# 4. Bloqueo 3 — **no identificado hasta ahora**

> **Reintentos del punto de control.**

**ADR-15 §10** exige que un texto que no supere el control **se rehaga**. Rehacer indefinidamente no es opción, y **ningún documento aprobado fija cuántas veces**.

Es un **parámetro operativo**: su valor pertenece a **APS-17**, y **R-52** prohíbe inventarlo. Sin él, `GenerateProposal` no puede escribir su bucle sin tomar una decisión que no le corresponde.

**Es pequeño comparado con `SP-01`, pero es real y tiene el mismo carácter: producto, no ingeniería.**

🔴 **Abierto.** Propietario: **Product Office**, vía APS-17.

---

# 5. Riesgos evaluados

| Riesgo | Severidad | Evaluación |
| --- | :-: | --- |
| **Implementar `GenerateProposal` antes de ADR-18** | 🔴 **Crítica** | Toda propuesta emitida llevaría `SIN-PERFIL-DE-ESTRATEGIA`. **No serían propuestas malas: serían propuestas que nadie puede explicar** *(§2.3)*. Y **ADR-18 §10.4 propone no reetiquetarlas**, de modo que el defecto sería **permanente e histórico**, no corregible después |
| **Permitir estrategia por defecto** | 🔴 **Crítica** | Sería una decisión comercial **sin criterio y sin autor**, indistinguible después de una decidida. Viola **RC-10 · BD-R2 · R-38** y vacía **ADR-15 §7.2**. **Es el atajo natural si se implementa sin Perfil** — y por eso el riesgo anterior lo arrastra |
| **Permitir narrativa IA como evidencia** | 🟢 **Mitigada** | **Estructuralmente imposible hoy**: `ObservedInput` no declara esos campos y el contrato de comportamiento falla si aparecen. Era 🔴 en COM-04; la mitigación es código, no disciplina |
| **Mezclar `BuyerDiagnosis` con hechos** | 🟡 **Media** | COM-07 §2.2 excluye los indicios para conservar **una lista de origen único**. **La vía sigue siendo tentadora** —APS-19 §4.1 dice que el indicio es un hecho— y **ninguna prueba lo impide todavía**, porque el consumidor no existe. **Debe cubrirse el día que se escriba** |

---

# 6. Recomendación final

## ¿AKVEZ está listo arquitectónicamente para implementar `GenerateProposal`?

> ## 🟡 **Arquitectónicamente sí. Operativamente no.**

**No falta ninguna decisión de arquitectura.** Entrada, salida, dependencias, errores, reparto por capas, punto de control y fuente de evidencia están definidos, y once decisiones están cerradas **con verificación en código**.

**Faltan dos decisiones de producto, y ninguna se resuelve escribiendo código:**

| # | Qué falta | Propietario | Sin ello |
| :-: | --- | --- | --- |
| **1** | **Publicar `SP-01`** | **Product Office** | Las propuestas emitidas serían **inexplicables**, y de forma **permanente** |
| **2** | **Fijar el número de reintentos del punto de control** | **Product Office**, vía APS-17 | El caso de uso decidiría un parámetro que no le corresponde *(R-52)* |

**La segunda es menor y podría resolverse en una línea de APS-17. La primera es el bloqueo real.**

## 6.1 Qué NO falta, pese a lo que informes anteriores decían

- **El productor de hechos observados no bloquea** *(§3.2)*. Enriquecer la lista es una mejora de producto, no una condición de corrección.
- **F-10 no bloquea.** El Orchestrator repara la ausencia mal codificada; el defecto de origen persiste pero no alcanza a los hechos.
- **ADR-18 no necesita enmienda técnica.** Necesita respuestas.

---

# 7. Deuda actualizada

| ID | Descripción | Estado | Propietario |
| --- | --- | :-: | --- |
| **F-2** | Unicidad `(leadId, issue)` / `(leadId, sequence)` en el motor real | 🟡 | Ingeniería, con ADS-02 |
| **F-3** | `userId` placeholder de un solo inquilino | 🟡 | Ingeniería |
| **F-5** | Vocabulario con tildes en el contrato público | 🟡 | Product Office, vía ADR-06 |
| **F-7** | `reachableChannels` sin productor real | 🔴 | Product Office — afecta a `lead-hunter` |
| **F-9** | `createdAt` no observable desde el contrato de repositorio | 🟡 | Ingeniería |
| **F-10** | Ausencia codificada como `""` y `0` en el origen | 🔴 | Product Office — afecta a `lead-hunter` |
| **B-1** | **`SP-01` sin publicar** | 🔴 | **Product Office** |
| **B-2** | **Reintentos del punto de control sin valor aprobado** | 🔴 | **Product Office**, vía APS-17 |
| **B-3** | Enriquecer la lista de hechos observados | 🟡 *(era 🔴)* | Product Office, vía APS-08/APS-19 |

**Ninguna deuda se cierra en este sprint.** **B-3 se rebaja de severidad con la evidencia de §3.2** — que es distinto de cerrarla.

---

# 8. Referencias

**ADR-04** · **ADR-15** §7.2, §7.4, §10, §12 · **ADR-16** P-I1, P-I4, P-I5 · **ADR-18** *(Draft)* §10.4 · **APS-08** §7.1, §11 · **APS-17** · **APS-18** §11.4, RE-1, RE-2, RE-3, RE-5 · **APS-19** §4.1 · **DDD-01** §2.2, §9.2 · **DEV-00** R-24, R-38, R-52, D-A2 · **COM-03** a **COM-09**.
