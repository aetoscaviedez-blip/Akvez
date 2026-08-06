# COM-44 — Análisis de Correcciones Pendientes de ADR-13

| Campo | Valor |
| --- | --- |
| Código | COM-44 / 1 |
| Clasificación | **Análisis documental** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Análisis cerrado.** Una determinación · **una reclasificación** · dos recomendaciones |
| Fecha | 2026-08-04 |
| Objeto | Hallazgos **H-4**, **H-6** y **H-7** de COM-43 |
| Antecedentes | **COM-43** · COM-36/1 · COM-42/A |

> **`docs/blueprint/` intacto. Cero cambios de código. Ninguna decisión aprobada.**

---

# 1. Pregunta 1 — ¿A-5 necesita la misma corrección que A-6?

> ## ⚠️ **NO ESTÁ DETERMINADO — y la respuesta corrige la clasificación de COM-43.**

## 1.1 La cuestión previa que COM-43 no planteó

**Ambos hallazgos parten de la misma observación** —la columna «Contenido» de §6.2 dice menos de lo que otras reglas exigen—, **pero eso solo es un defecto si la columna pretende ser exhaustiva.**

**COM-43 asumió que sí. No lo verificó.**

## 1.2 Qué dice la regla que debería declararlo

**`ADR-13 §6.3 — Regla de completitud`**, texto íntegro:

> *«**Se persiste el conjunto completo de Empresas descubiertas y no duplicadas. Sin excepción, sin cupo y sin condición de calidad.**
>
> Ninguna consideración de volumen, coste o rendimiento podrá reducir ese conjunto (PO-01 §6; ADR-11 §9, E-2). Si el volumen resulta problemático, se resuelve en Infraestructura —nunca registrando menos.»*

> ### **§6.3 declara la completitud del *conjunto de Empresas*, no la de la columna «Contenido».**
>
> **Ninguna sección de ADR-13 declara que la columna «Contenido» de §6.2 sea exhaustiva.**

## 1.3 Los dos casos NO son de la misma clase

| | **A-6** | **A-5** |
| --- | --- | --- |
| **Texto de §6.2** | *«Asunto · mensaje · tono»* | *«Puntuación · banda · explicación»* |
| **Regla contrastada** | **PO-02 §3** — *«no es solo el texto»* | **ADR-13 §10.3 V-4** — conserva *«el perfil de usuario»* |
| **Categoría de la regla** | **PO — orden 2** | **ADR — orden 4, el mismo documento** |
| **¿Afirma algo falso?** | ✅ **Sí.** *«Tono»* no es contenido de `Proposal`, y **omite la evidencia**, que PO-02 §3 declara constitutiva | ❌ **No.** Puntuación, banda y explicación **sí** son contenido del Score |
| **Naturaleza** | 🔴 **Contradicción** | ⚠️ **Incompletitud** |
| **Regla que la resuelve** | **ADS-00 R-1 · R-2** — un documento de orden 4 no puede redefinir a uno de orden 2 | ❌ **Ninguna.** ADS-00 regula conflictos **entre** documentos, no dentro de uno |

> ### **A-6 es una contradicción con un documento superior. A-5 es una lista más corta que otra lista del mismo documento.**
>
> **ADS-00 no contiene ninguna regla para la inconsistencia interna de un documento consigo mismo.** No hay precedencia que aplicar: **§6.2 y §10.3 son la misma sección del mismo ADR aprobado por la misma autoridad en el mismo acto.**

## 1.4 El argumento de simetría, y por qué no basta

**La fila de A-11 SÍ incluye *«la versión del criterio comercial»***. Si la columna fuese meramente indicativa, cabría preguntar por qué A-11 lo incluye y A-5 no.

> ⚠️ **Es un indicio de intención, no una autoridad.** Concluir de ahí que la columna pretende ser exhaustiva **sería resolver por inferencia**, que este sprint prohíbe expresamente.

## 1.5 Determinación

| Pregunta | Respuesta |
| --- | :-: |
| ¿La columna «Contenido» de §6.2 es exhaustiva? | ⚠️ **No declarado** |
| ¿La omisión de A-5 contradice alguna regla? | ❌ **No** |
| ¿Existe autoridad que exija corregir A-5? | ❌ **NO** |
| ¿Existe autoridad que exija corregir A-6? | ✅ **Sí** — PO-02 §3 vía ADS-00 R-1/R-2 |

> ### 🔄 **Reclasificación de COM-43 H-4**
>
> **COM-43 §4.4 lo clasificó como *«🔴 Divergencia documental confirmada»*. Con §6.3 leída, esa clasificación no se sostiene.**
>
> **Clasificación correcta: ⚠️ Ambigüedad pendiente** — *«¿es exhaustiva la columna «Contenido» de §6.2?»*.
>
> **Consecuencia directa sobre la recomendación de COM-43 §7:** *«incorporar la corrección de A-5 antes de aplicar v1.3»* **pierde su carácter obligatorio.** Sigue siendo **recomendable por coherencia**; **no es exigible por autoridad.**

**Propietario de la ambigüedad:** **AKVEZ Architecture Team** — `Responsable` de ADR-13.

---

# 2. Pregunta 2 — ¿V-2 necesita aclaración sobre `issue`?

> ## ✅ **SÍ. Y el fundamento es un precedente documentado del propio proyecto.**

## 2.1 El riesgo concreto

**Texto propuesto para V-2 en ADR-13 v1.3:** *«la de **mayor número de emisión (`issue`)**»*.

| Activo | Campo | ¿Cumple la semántica? | ¿Cumple el nombre? |
| :-: | :-: | :-: | :-: |
| A-6 · A-11 | `issue` | ✅ | ✅ |
| **A-5** | **`emission`** | ✅ **Sí** *(COM-43 §5)* | ❌ **No** |

> **Aplicada literalmente, V-2 haría que A-5 pareciese incumplir una regla que su semántica sí cumple.**

## 2.2 El precedente, y está documentado

**El proyecto ya sufrió exactamente este fallo:**

| Hecho | Fuente |
| --- | --- |
| **ADR-09 §5.2** contiene un ejemplo de factoría, **sin etiqueta de alcance** más allá de *«forma ilustrativa»* | ADR-09 §5.2 |
| **Se leyó durante sprints como si fijara una firma** | COM-33 §3.3 · COM-36/2 §2.1.1 |
| **Hicieron falta cinco auditorías** para establecer que no era normativo | COM-34 a COM-38 |
| **ADR-19 §5.1 incorporó una advertencia explícita por esa razón**: *«Esta advertencia es deliberada. El único ejemplo previo de una factoría de `presentation/` —ADR-09 §5.2— se leyó durante sprints como si fijara una firma, y no lo hacía»* | **ADR-19 v1.0** `Approved` |

> ### **ADR-19 §5.1 es autoridad `Approved` que documenta el fallo y la práctica que lo evita: etiquetar el alcance de todo ejemplo o nombre técnico dentro de un ADR.**
>
> **No es una preferencia de redacción: es una lección que el proyecto ya pagó y registró en un ADR aprobado.**

## 2.3 Determinación

✅ **V-2 debe aclarar que `issue` ilustra el concepto y no fija el nombre del campo** — **o retirar el nombre**, conforme a la Pregunta 3.

---

# 3. Pregunta 3 — ¿Por concepto de emisión o por nombre técnico?

> ## ✅ **POR CONCEPTO. El nombre técnico no es materia de un ADR.**

## 3.1 Dónde vive la nomenclatura, según ADS-00

**ADS-00, categoría DEV:**

| Campo | Texto |
| --- | --- |
| **Propósito** | *«Operacionalizar el Blueprint: convertir decisiones aprobadas en reglas, **convenciones** y procesos que puedan comprobarse sobre la implementación»* |
| **Alcance** | *«Estructura del repositorio, **convenciones técnicas**, organización del código…»* |
| **Documentos admisibles** | *«Reglas de implementación, **convenciones de código**…»* |

**Y la convención existe:** **DEV-00 §5.1 — *Nombres***, con su tabla *(Entidad de dominio · Persistence Contract · Persistence Model · Repository Interface · Database Adapter · DTO · Mapper · Caso de uso · Factory · Agent API)*.

> ### **La nomenclatura técnica es materia de DEV. Fijar el nombre de un campo dentro de ADR-13 sitúa materia de orden 8 en un documento de orden 4.**

## 3.2 Coherencia con la independencia del motor

**ADR-13 §12.4:** *«La identidad del Lead **no podrá depender en ningún grado** del motor de persistencia.»*
**DEV-00 R-27:** *«Entidad de dominio y modelo persistente son tipos **separados**. La correspondencia estructural no se expresa con imports.»*

> **Una regla de vigencia enunciada por nombre de campo ata la semántica a una representación concreta** — el mismo acoplamiento que ADR-08 §5 y R-27 evitan en la frontera de persistencia.

## 3.3 Determinación

| Cuestión | Respuesta | Fundamento |
| --- | :-: | --- |
| ¿V-2 debe enunciarse por **concepto**? | ✅ **Sí** | ADS-00 *(DEV)* · ADR-13 §12.4 · R-27 |
| ¿Puede citar un nombre? | ✅ **Sí, si etiqueta su alcance** | Precedente ADR-19 §5.1 |
| ¿Dónde se fija el nombre, si se quiere unificar? | **DEV-00 §5.1** | ADS-00, alcance de DEV |
| ¿Debe unificarse `emission` → `issue`? | ⚠️ **No determinado** | **Ninguna autoridad lo exige.** Sería decisión nueva |

> **Unificar el nombre es una decisión de DEV-00, no una corrección de ADR-13.** Si el Architecture Team la quiere, **el lugar es DEV-00 §5.1**, y arrastraría cambio de código en `LeadAnalysis`, su modelo, su mapper y su adapter — **fuera del alcance de la enmienda**.

---

# 4. H-6 — Los dos patrones de derivación *(sin cambios)*

**COM-43 §5.3 lo clasificó como ambigüedad. El análisis lo confirma sin variación.**

| Activo | Quién deriva el número | Autoridad |
| :-: | --- | --- |
| **A-5** | **El Adapter** | **ADR-05 §7 D3** — el identificador lo asigna la persistencia |
| **A-6 · A-11** | **El caso de uso** | **ADR-16 §4.2, §4.4** — el número **forma parte de la identidad del agregado** |

> **No es contradicción:** **ADR-16 declara la identidad de las cinco entidades comerciales**, y el Opportunity Score **no es una de ellas** *(DDD-01 §2.1)*. **Ningún documento declara que el número de emisión del Score forme parte de su identidad.**

**Relevancia para v1.4:** **G-9** *(atomicidad)* **se enuncia en singular** y hay **dos patrones** que la satisfacen de forma distinta. **Se recomienda que G-9 lo reconozca explícitamente** *(§5, R-3)*.

**Propietario:** **AKVEZ Architecture Team** — alcanza a §12.3 G-9 y a **F-2 Capa B**.

---

# 5. Recomendaciones

| # | Recomendación | ¿Exigida por autoridad? | Propietario |
| :-: | --- | :-: | --- |
| **R-1** | **Corregir A-6** en §6.2 | ✅ **SÍ** — PO-02 §3 vía ADS-00 R-1/R-2 | Architecture Team |
| **R-2** | **Enunciar V-2 por concepto**, con el nombre etiquetado como ilustrativo o retirado | ⚠️ **No exigida.** Fundada en **ADR-19 §5.1** *(precedente `Approved`)* | Architecture Team |
| **R-3** | **Reconocer en G-9 los dos patrones** de derivación | ❌ No exigida | Architecture Team |
| **R-4** | **Completar A-5** con perfil de usuario y versión de Perfil de Ponderación | ❌ **NO exigida** — §1.5 | Architecture Team |
| **R-5** | **Pronunciarse sobre la exhaustividad de la columna «Contenido»** de §6.2 | — | **Architecture Team** |

> ### **R-5 es la que desbloquea R-4.** Mientras no se declare si la columna es exhaustiva, **completar A-5 es coherencia editorial, no corrección de defecto** — y **este sprint no puede decidirlo**.

---

# 6. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **A-6 debe corregirse.** Autoridad: PO-02 §3, orden 2 |
| **2** | **A-5 NO tiene autoridad que exija corrección.** COM-43 H-4 queda **reclasificado** de divergencia a **ambigüedad** |
| **3** | **V-2 debe enunciarse por concepto de emisión**, no por nombre de campo |
| **4** | **La nomenclatura es materia de DEV-00 §5.1**, no de ADR-13 |
| **5** | **Aplicar v1.3 tal como está NO introduce inconsistencia**, contra lo que COM-43 §6 riesgo 1 sugería |
| **6** | **Queda una ambigüedad abierta y sin propietario previo: la exhaustividad de §6.2** |

---

# 7. Referencias

**ADS-00 v1.3** — *Orden de Precedencia*, R-1, R-2, R-3, R-7, *categoría DEV* · **PO-01 v1.2** §5, §6 · **PO-02 v1.3** §3 · **ADR-05 v1.4** §7 D3 · **ADR-08 v1.2** §5 · **ADR-09 v1.3** §5.2 · **ADR-11 v2.1** §9 · **ADR-13 v1.2** §6.2, §6.3, §10.3 *(V-2, V-3, V-4)*, §12.3, §12.4 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-14 v1.2** R-VIN · **ADR-16 v1.1** §4.2, §4.4 · **ADR-19 v1.0** §5.1 · **DDD-01 v1.1** §2.1, §9.2 · **DEV-00** §5.1, R-27, R-34 · **COM-33** §3.3 · **COM-36/1** · **COM-36/2** §2.1.1 · **COM-43** §4.4, §5.3, §5.4, §6, §7.
