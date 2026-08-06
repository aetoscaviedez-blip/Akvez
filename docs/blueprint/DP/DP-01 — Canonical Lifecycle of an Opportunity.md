# DP-01 — Ciclo de Vida Canónico de una Oportunidad

| Campo | Valor |
| --- | --- |
| Código | DP-01 |
| Clasificación | Decision Paper — Dominio |
| Versión | 1.1 |
| Estado | **Archived** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Requiere pronunciamiento de | ~~AKVEZ Product Office~~ — *emitido en PO-01 (Approved, 2026-07-29)* |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad vigente sobre esta materia | **PO-01** · APS-07 v2.0 · APS-03 v3.0 |

> **Sobre el nombre.** Se propone el prefijo `DP` (Decision Paper) por no existir en el Blueprint una categoría para documentos de análisis previos a un ADR. Un Decision Paper **no decide**: expone evidencia y delimita lo que aún no puede decidirse.

---

> # ⚠ Documento archivado — Registro histórico
>
> **Este documento fue archivado tras la aprobación de PO-01.**
>
> **Se conserva exclusivamente con fines históricos y de trazabilidad.** Documenta el proceso de investigación que condujo a la decisión canónica del dominio Empresa → Lead. **Sustituido por PO-01.**
>
> **No es autoridad vigente. No debe utilizarse para diseñar arquitectura ni para fundamentar ninguna decisión.**
>
> **Advertencia específica.** Este documento contiene **hipótesis, interpretaciones y cuestiones abiertas** que fueron posteriormente resueltas o refutadas. Sus §6, §8.2, §8.3 y §8.4 razonan sobre un modelo de dominio **derogado**. Citarlos como vigentes reintroduciría las contradicciones que PO-01 cerró.
>
> **Autoridad vigente:**
>
> | Materia | Documento vigente |
> | --- | --- |
> | Ciclo de vida de la Empresa y el Lead | **PO-01 §8** · APS-07 v2.0 §6, §7 |
> | Definición de Empresa, Lead y Biblioteca | **PO-01 §1-§4** · APS-07 v2.0 §5, §8 |
> | Orden Análisis → Evaluación | **PO-01 §5** · APS-07 v2.0 §6.3 |
> | Ausencia de Top N y de umbral | **PO-01 §6, §7** · APS-08 v1.1 §8.6 |
> | Las cinco cuestiones abiertas de §8.4 | **Resueltas por PO-01.** Ninguna sigue abierta |
>
> **Qué conserva valor.** Su inventario de evidencia, su clasificación por niveles de confianza y su registro de cómo se razonó. Es la explicación de **por qué** fue necesaria una decisión de Product Office.
>
> **Ninguna sección ha sido eliminada, reescrita ni renumerada.**

---

> ## Nota de excepción — Transición de estado no contemplada
>
> Este archivado se ejecutó mediante la transición `Draft → Archived`, **no contemplada por `AF-01-DIAG-001`**, que define `Draft → Review → Approved → {Deprecated, Archived}`.
>
> Es una **decisión excepcional del Product Office**, adoptada con conocimiento expreso de la limitación y con la instrucción de no modificar AF-01 en esta fase. **No constituye precedente.**
>
> Corresponde a la deuda arquitectónica **DT-01**, registrada en la nota de excepción de **ADR-10**, cuyo alcance se extiende ahora a este documento. Conforme a ADS-00 v1.2 **R-6**, la deuda queda elevada al Product Office.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | AKVEZ Architecture Team | Redacción inicial. Delimita lo demostrado, lo interpretado y lo desconocido sobre el ciclo de vida de una oportunidad; formula cinco cuestiones abiertas y tres correcciones requeridas a ADR-10A. | Dos ADR alcanzaron conclusiones opuestas por apoyarse en definiciones de dominio incompatibles entre documentos aprobados. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Cambio de estado documental: `Draft` → `Archived`.** Se añaden la nota de archivo, la nota de excepción (DT-01), este historial y la nota editorial previa a §10. Se actualizan las referencias de §9. **No se modifica ningún contenido histórico:** ninguna sección eliminada, reescrita ni renumerada. | Fase 3 de PLAN-01, cierre del hallazgo **H-06** de REV-03. Las cinco cuestiones abiertas de §8.4 quedaron resueltas por **PO-01** (Approved, 2026-07-29), que sustituye a este documento como autoridad de la materia. |

---

# 1. El Ciclo de Vida según la Evidencia

El Blueprint describe el recorrido **dos veces**, con descomposiciones distintas y no equivalentes.

**APS-07 §6 — Modelo Conceptual (estados de la entidad).** Literal: *«Cada empresa evolucionará progresivamente dentro del sistema.»*

```
Empresa → Lead → Lead Analizado → Opportunity Score → Pitch → Cliente Potencial → Cliente Confirmado
```

**APS-07 §7 — Ciclo de Vida (etapas de actividad).** Literal: *«Todo lead recorrerá las siguientes etapas.»*

```
Descubrimiento → Registro → Análisis → Evaluación → Propuesta
```

**Superposición de ambas, con la evidencia disponible:**

```text
   ETAPA (APS-07 §7)          ESTADO (APS-07 §6)         AGENTE (APS-03 §7)
   ─────────────────          ──────────────────         ──────────────────
   Descubrimiento    ───────► Empresa                    Lead Hunter
          │
          ▼
   Registro          ───────► (sin estado propio)        Lead Hunter
          │
          ▼
   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
   │  ?               ───────► Lead                      ?             │
   │            NINGÚN DOCUMENTO DEFINE ESTA TRANSICIÓN                │
   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
          │
          ▼
   Análisis          ───────► Lead Analizado             Lead Analyzer
          │
          ▼
   Evaluación        ───────► Opportunity Score          Lead Analyzer
          │
          ▼
   Propuesta         ───────► Pitch                      Pitch Generator
          │
          ▼
   (fuera de V1)     ───────► Cliente Potencial → Cliente Confirmado
```

**Hallazgo principal de este documento:** el estado `Lead` de APS-07 §6 **no tiene etapa correspondiente** en APS-07 §7, ni agente que lo provoque en APS-03 §7. La transición `Empresa → Lead` es el único paso del recorrido que ningún documento del Blueprint define.

---

# 2. Transiciones

| Transición | Qué cambia | Quién lo provoca | Documento | ¿Identidad o estado? |
| --- | --- | --- | --- | --- |
| — → **Empresa** | Aparece información pública del negocio | Lead Hunter | APS-03 §7; APS-07 §7 «Descubrimiento» | Nace la entidad |
| **Empresa** → *registrada* | La Empresa se incorpora al conocimiento permanente | Lead Hunter | APS-03 §7 «Registrar nuevas empresas»; APS-07 §7 «Registro» | **Estado** — APS-07 §6 no le asigna estado propio |
| *registrada* → **Lead** | Se le atribuye condición de oportunidad comercial | **No definido** | **Ninguno** | **No determinable** |
| **Lead** → **Lead Analizado** | Se añade conocimiento sobre presencia digital | Lead Analyzer | APS-03 §7; APS-07 §7 «Análisis» | **Estado** |
| **Lead Analizado** → **Opportunity Score** | Se añade puntuación 0-100 y banda | Lead Analyzer | APS-03 §7 «Calcular el Opportunity Score»; APS-08 §7 | **Estado** |
| **Opportunity Score** → **Pitch** | Se añade propuesta comercial | Pitch Generator | APS-03 §7; APS-07 §7 «Propuesta» | **Estado** |

Fundamento de la columna final: APS-07 §6 — *«Cada transición agregará nuevo conocimiento sin reemplazar la información anterior.»*

---

# 3. Identidad: ¿dos entidades o dos estados?

**Respuesta: un solo sujeto en distintos estados.** Nivel de evidencia: **demostrado**.

| Evidencia | Cita literal |
| --- | --- |
| APS-07 §6, encabezado | «Cada **empresa evolucionará** progresivamente dentro del sistema» |
| APS-07 §6, regla | «Cada transición agregará nuevo conocimiento **sin reemplazar la información anterior**» |
| APS-07 §8 | Un único registro por empresa, con «Estado del análisis», «Opportunity Score» e «Historial de modificaciones» como **atributos del mismo registro** |
| APS-07 §5 | «Leads — **Empresas** identificadas como oportunidades comerciales» — el género próximo de Lead es Empresa |

El verbo *evolucionar* aplicado a un mismo sujeto es incompatible con la creación de una entidad distinta. Que APS-07 §5 enumere «Empresas» y «Leads» como activos separados describe **dos conjuntos de conocimiento**, no dos entidades: todo Lead es una Empresa que ha alcanzado cierto estado.

---

# 4. Validación del argumento «Estado del análisis» de ADR-10A

**Afirmación evaluada:** *«APS-07 §8 implica que una Empresa puede existir antes del análisis porque existe el campo Estado del análisis.»*

**Clasificación: INTERPRETACIÓN POSIBLE.** No es demostración ni inferencia fuerte.

**Motivo.** «Estado del análisis» admite dos lecturas gramaticalmente equivalentes en español:

1. *Estado del proceso* — pendiente / completado. Requiere que existan registros no analizados. **Sostiene la afirmación.**
2. *Estado resultante del análisis* — la condición diagnosticada del negocio. Compatible con que todo registro esté ya analizado. **No sostiene la afirmación.**

Nada en APS-07 §8 permite elegir entre ambas. En ADR-10A califiqué este argumento como *«evidencia interna decisiva»*: **fue una sobreestimación y debe corregirse.**

**Importante — la conclusión sobrevive por otra vía.** Que el Registro precede al Análisis está sostenido por evidencia de orden explícito, independiente de este campo:

| Fuente | Cita | Nivel |
| --- | --- | --- |
| APS-07 §7 | «Todo lead recorrerá las siguientes etapas»: Descubrimiento → **Registro** → **Análisis** | **Demostrado** — secuencia literal |
| APS-03 §7 | Lead Hunter: «Registrar **nuevas** empresas en la Biblioteca de Leads» | **Demostrado** — Lead Hunter precede al Analyzer |
| APS-03 §8, paso 3 | «Lead Hunter **consulta** la Biblioteca de Leads para evitar duplicados» (paso 3, antes del paso 4) | **Demostrado** |

La tesis era correcta; el argumento elegido para sostenerla era el más débil de los disponibles.

---

# 5. APS-02 §6 frente a APS-03 §7

**Citas literales.**

> **APS-02 §6:** «Biblioteca de Leads — Almacenamiento persistente de empresas **ya analizadas** para evitar duplicados y conservar el historial.»
> **APS-03 §7:** Lead Hunter — «Registrar **nuevas empresas** en la Biblioteca de Leads.»

**¿Existe realmente una contradicción?** **Sí, pero de segundo orden.** No se contradicen sobre la misma proposición: APS-02 describe el **contenido característico**; APS-03 prescribe una **operación de escritura**. Chocan solo si se lee APS-02 como criterio de admisión.

**¿Es aparente?** **Parcialmente.** Bajo lectura descriptiva de APS-02 —«la Biblioteca es la base de conocimiento de las empresas que ya has analizado»— ambas coexisten sin conflicto: se registra al descubrir y, en régimen, el contenido útil es el analizado.

**¿Pueden coexistir?** **Sí**, bajo esa lectura, respaldada por APS-07 §8, que exige a cada registro incluir «Estado del análisis» — campo que solo es necesario si el contenido es heterogéneo en ese aspecto (nivel: interpretación, §4).

**¿Falta una definición intermedia?** **Sí, y es la carencia central.** El Blueprint nunca enuncia el **criterio de admisión** de la Biblioteca: qué condición debe cumplir una Empresa para ser registrada. APS-02 describe el contenido, APS-03 la operación, APS-07 §8 la estructura del registro. **Ninguno define la condición de entrada.**

---

# 6. ¿Qué convierte una Empresa en Lead?

Comparación, sin decidir.

| Hipótesis | Evidencia a favor | Evidencia en contra | Viabilidad |
| --- | --- | --- | --- |
| **A. Al descubrirse** | APS-02 Glosario: «Lead: Empresa identificada como **posible cliente**» — umbral bajo, satisfecho por coincidir con la búsqueda del usuario | APS-03 §7, Salidas de Lead Hunter: «Lista estructurada de **empresas candidatas**» — *candidatas*, no leads. APS-07 §6 separa Empresa de Lead | **Media** |
| **B. Al registrarse** | El activo se denomina «Biblioteca de **Leads**»: ingresar en él conferiría la condición | APS-03 §7 dice registrar «**empresas**», no leads. APS-07 §6 no asigna estado propio al Registro | **Baja-Media** |
| **C. Al analizarse** | APS-02 §6 y los glosarios de APS-02, APS-03 y APS-07 asocian la Biblioteca a «empresas **analizadas**» | **APS-07 §6 lo refuta directamente:** `Lead → Lead Analizado`. El Lead **precede** al análisis | **Baja** |
| **D. Al superar un umbral de Opportunity Score** | APS-07 §5: «identificadas como **oportunidades comerciales**» implica juicio. APS-08 §8 define cinco bandas cualitativas | **APS-07 §6 lo refuta:** `Lead → Lead Analizado → Opportunity Score`. El score llega **dos estados después** del Lead. APS-08 no define umbral de cualificación | **Baja** |
| **E. Coincidencia con el criterio comercial del usuario** | APS-08 §6.6 (Compatibilidad): «el sistema evaluará si el tipo de empresa coincide con el perfil profesional del usuario». Compatible con APS-07 §6 y con «posible cliente» | Ningún documento lo enuncia como criterio de cualificación | **Media** |

**Observación decisiva.** APS-07 §6 sitúa `Lead` **antes** de `Lead Analizado` y **antes** de `Opportunity Score`. Esto **refuta las hipótesis C y D**, que son precisamente las asumidas por ADR-10 (implícitamente) y por ADR-10A §5.5 (explícitamente). **ADR-10A §5.5 y su respuesta a la pregunta 5 son incorrectas y deben corregirse.**

Ninguna hipótesis alcanza respaldo suficiente. **La pregunta no puede responderse con la documentación actual.**

---

# 7. Priorización frente a Truncamiento

| | **Priorización** | **Truncamiento (Top N)** |
| --- | --- | --- |
| Definición | Ordenar las oportunidades por potencial comercial | Descartar las que no entran en un cupo fijo |
| Respaldo documental | APS-01 §5 («baja priorización de oportunidades» como problema a resolver) · APS-01 §6 («las mejores oportunidades») · APS-01 §7 («alta calidad») · APS-08 §8 («Debe aparecer entre los primeros resultados») · APS-03 Glosario (Lead Analyzer: «análisis **y priorización**») | **Ninguno** |
| Clasificación | **Capacidad del negocio** | **Sin fundamento documental** |

**¿El Blueprint obliga a entregar un Top N?** **No.**

**¿Obliga a ordenar?** **Sí.** APS-08 §8 es normativo: la banda 90-100 *«Debe aparecer entre los primeros resultados»*.

**Declaración explícita.** Se realizó una búsqueda sobre los diecisiete documentos APS y los nueve ADR de los patrones `top N`, `primeros`, `mejores`, `limitar`, `límite de resultados`, `cantidad de resultados`, `número de leads` y `máximo de`. **No existe ninguna referencia a un cupo, tope o cantidad máxima de leads entregados.** Las coincidencias corresponden a «mejores oportunidades» (cualitativo) o a contextos ajenos.

Adicionalmente, APS-08 §8 define bandas hasta `0-39 — Oportunidad Muy Baja`. Clasificar oportunidades que nunca se presentarían carecería de propósito: la existencia de bandas bajas es evidencia de que **el modelo previsto ordena y clasifica todo el conjunto, no lo recorta**.

---

# 8. Domain Definition

## 8.1 Hechos demostrados

Sostenidos por cita literal, sin interpretación.

1. Empresa y Lead son **estados de un mismo sujeto**, no entidades distintas. *(APS-07 §6: «cada empresa evolucionará»)*
2. Las transiciones son **acumulativas**: ninguna reemplaza información previa. *(APS-07 §6)*
3. El orden canónico de estados es `Empresa → Lead → Lead Analizado → Opportunity Score → Pitch`. *(APS-07 §6)*
4. El estado `Lead` **precede** al análisis y a la puntuación. *(APS-07 §6)*
5. El orden canónico de etapas es `Descubrimiento → Registro → Análisis → Evaluación → Propuesta`. *(APS-07 §7)*
6. El **Registro precede al Análisis**. *(APS-07 §7; APS-03 §7; APS-03 §8 pasos 3-4)*
7. El Registro es responsabilidad del **Lead Hunter**. *(APS-03 §7)*
8. El Análisis y la Evaluación son responsabilidad del **Lead Analyzer**. *(APS-03 §7)*
9. La **priorización es capacidad del negocio**. *(APS-01 §5-§7; APS-08 §8; APS-03 Glosario)*
10. El Blueprint **no contiene ninguna referencia a un Top N**. *(búsqueda exhaustiva, §7)*
11. Evitar duplicados es **criterio de éxito de la V1**. *(APS-02 §9)*
12. Cada registro de la Biblioteca debe incluir, como mínimo, once campos entre ellos «Estado del análisis», «Opportunity Score» y «Fecha de descubrimiento». *(APS-07 §8)*

## 8.2 Interpretaciones

Lecturas razonables no demostradas. **No deben citarse como hechos.**

- I-1. «Estado del análisis» denota estado del proceso y no resultado del análisis. *(§4)*
- I-2. APS-02 §6 describe el contenido característico de la Biblioteca, no su criterio de admisión. *(§5)*
- I-3. El «Registro» de APS-07 §7 incorpora la **Empresa**, no el Lead. *(§2; el nombre del activo sugiere lo contrario)*
- I-4. `Scoring` en ADR-02 §8 designa al Lead Analyzer y no a una capacidad distinta.

## 8.3 Hipótesis

Formuladas y no verificadas.

- H-1. La cualificación `Empresa → Lead` ocurre por coincidencia con el criterio comercial del usuario. *(§6, opción E)*
- H-2. La Biblioteca admite Empresas en cualquier estado, y «Estado del análisis» expresa esa heterogeneidad.

## 8.4 Cuestiones abiertas

Bloqueantes. Requieren pronunciamiento del Product Office.

| # | Cuestión | Bloquea |
| --- | --- | --- |
| Q-1 | ¿Qué condición convierte una Empresa en Lead? Ningún documento la define | ADR-10, ADR-11, toda decisión sobre el contenido de la Biblioteca |
| Q-2 | ¿Cuál es el criterio de admisión de la Biblioteca? | ADR-10 |
| Q-3 | ¿La Evaluación precede o sigue al Análisis? APS-07 §6-§7 dicen «sigue»; ADR-02 §8 sugiere «precede» | Orden canónico del flujo |
| Q-4 | ¿Se mantiene el nombre «Biblioteca de **Leads**» si su contenido son mayoritariamente **Empresas**? | Coherencia terminológica |
| Q-5 | ¿Cuál es la jerarquía documental del Blueprint? No está declarada | Toda resolución futura de contradicciones |

## 8.5 Correcciones requeridas a ADR-10A

Detectadas por este documento. **No aplicadas** — ADR-10A no debe modificarse todavía.

| Sección | Problema | Evidencia |
| --- | --- | --- |
| §4.1 | Califica el argumento «Estado del análisis» como *evidencia interna decisiva*. Es una **interpretación posible** | §4 de este documento |
| §5.5 | Define la cualificación por **umbral de banda**. Refutado: el Opportunity Score llega dos estados **después** del Lead | APS-07 §6 |
| §6, pregunta 5 | Responde «**No**» a si puede existir un Lead sin analizar. Refutado: `Lead → Lead Analizado` | APS-07 §6 |

---

# 9. Referencias

## 9.1 Autoridad vigente (v1.1)

Documentos que **sustituyen** a éste y deben consultarse en su lugar:

- **PO-01** — Decisión de Producto: Definición Canónica de Lead §1-§8. Autoridad funcional del dominio.
- **APS-07 v2.0** — Data & Knowledge Architecture §5, §6.3, §7, §8.
- **APS-03 v3.0** — Agent Architecture §7, §8.1, §8.2.
- **APS-08 v1.1** — Opportunity Scoring Framework §8.6.
- **ADR-10A v2.0** · **ADR-11 v2.0** · **ADR-12** · **ADR-13** · **ADR-14**.
- **PLAN-01** §7 (Fase 3) · **REV-03** (H-06) · **ADS-00 v1.2**.

## 9.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-02, APS-03, APS-07 y APS-08 remiten a las versiones vigentes en 2026-07-28, hoy corregidas.

APS-01 §5, §6, §7 · APS-02 §6, §9, Glosario · APS-03 §7, §8, Glosario · APS-07 §5, §6, §7, §8 · APS-08 §6.6, §7, §8 · ADR-02 §8 · ADR-10 · ADR-10A · ADS-00

---

> **Nota editorial (v1.1).** La sección siguiente se conserva **íntegra y sin modificar**, tal como fue redactada el 2026-07-28.
>
> Su declaración de estado —«**Draft**»— y su condición final —que las cinco cuestiones de §8.4 «requieren pronunciamiento del Product Office»— pertenecían al **estado histórico** del documento y **dejaron de tener efecto el 2026-07-29**.
>
> **El pronunciamiento se emitió:** es PO-01, aprobado y firmado. Las cinco cuestiones están resueltas. El estado vigente del documento es **`Archived`**, conforme a la portada y al Historial de Versiones v1.1.
>
> Esta nota no altera el contenido original. Existe únicamente para evitar que la lectura literal de §10 contradiga el estado declarado en la portada.

---

# 10. Estado

**Draft.** Este documento no decide: delimita lo demostrado, lo interpretado y lo desconocido. Las cinco cuestiones de §8.4 requieren pronunciamiento del Product Office antes de que ADR-10, ADR-10A o ADR-11 puedan avanzar.
