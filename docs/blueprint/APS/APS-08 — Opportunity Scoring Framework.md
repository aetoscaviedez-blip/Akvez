# APS-08 — Opportunity Scoring Framework

## APS-08 — Opportunity Scoring Framework

**Versión:** 1.2

**Estado:** Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Estándar Aplicado:** ADS-00

**Autoridad de dominio:** PO-01 · APS-07 v2.0 (Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | — | AKVEZ Product Office | Primera definición oficial del sistema de evaluación de oportunidades comerciales de AKVEZ. | Establecer la metodología de puntuación. |
| 1.2 | 2026-07-29 | AKVEZ Product Office | **Publicación del Perfil de Ponderación WP-01 v1.0** en la nueva §7.1: identificación, tabla de pesos de las seis categorías, justificación y verificación de conformidad con las siete restricciones de ADR-14 §12. **No se modifica el algoritmo, ni las categorías de §6, ni la escala de §7, ni los rangos de banda de §8, ni ninguna otra sección.** | Tarea 1 del sprint PC-01. Cierre de la deuda crítica **DC-4** de AR-02 §4.1: ADR-14 estableció el gobierno del sistema de ponderaciones, pero los valores no existían y sin ellos el Opportunity Score no podía calcularse. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Aditivo, de aclaración de dominio.** Se añade la nota de §3.1 sobre el alcance del juicio del Score y la sección §8.6, que declara la ausencia de umbral de exclusión. Se actualiza el Glosario. **No se modifica ninguna ponderación, ninguna categoría de evaluación, ningún rango de banda ni el modelo de cálculo.** | Fase 1 de PLAN-01 y PO-01 §9.1. El documento no declaraba explícitamente que ninguna puntuación excluye a un Lead, lo que permitía interpretar el Score como mecanismo de cualificación, en contra de PO-01 §5 y §7. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Filosofía del Opportunity Score
4. Principios de Evaluación
5. Arquitectura del Modelo
6. Categorías de Evaluación
7. Modelo de Puntuación
8. Clasificación de Oportunidades
9. Explicabilidad del Score
10. Aprendizaje del Modelo
11. Casos Especiales
12. Riesgos
13. Dependencias
14. Glosario
15. Referencias
16. Evaluación AQS

---

# 1. Resumen Ejecutivo

El **Opportunity Score** constituye el principal motor de decisión de AKVEZ.

Su propósito es transformar grandes cantidades de información pública en una evaluación comprensible que permita al usuario identificar rápidamente qué empresas representan mejores oportunidades comerciales.

El Opportunity Score no pretende reemplazar el criterio humano.

Su función es reducir el tiempo necesario para priorizar oportunidades y proporcionar una base objetiva para la toma de decisiones.

---

# 2. Propósito del Documento

Este documento define la metodología oficial utilizada por AKVEZ para evaluar empresas.

Establece:

- qué factores influyen en la puntuación;
- cómo se interpreta el resultado;
- cómo evoluciona el modelo;
- cómo garantizar transparencia y consistencia.

---

# 3. Filosofía del Opportunity Score

El Opportunity Score responde a una pregunta sencilla:

**¿Qué probabilidad tiene esta empresa de beneficiarse de los servicios del usuario?**

No intenta determinar si una empresa es exitosa.

Evalúa únicamente si representa una oportunidad comercial relevante.

El modelo deberá favorecer la objetividad sobre la intuición.

## 3.1 Alcance del juicio del Opportunity Score

El Opportunity Score juzga **cuánto vale** un Lead. No juzga **si un Lead existe**.

Cuando este documento afirma que el Score evalúa «si una empresa representa una oportunidad comercial relevante», se refiere exclusivamente a su **prioridad relativa** frente a otros Leads. No debe interpretarse como una cualificación que determine la pertenencia a la Biblioteca de Leads.

La existencia de un Lead queda determinada únicamente por el **Registro** (PO-01 §3; APS-07 v2.0 §7.1), evento anterior e independiente de toda puntuación.

---

# 4. Principios de Evaluación

## 4.1 Transparencia

Toda puntuación deberá poder explicarse.

---

## 4.2 Consistencia

Dos empresas con características similares deberán obtener resultados comparables.

---

## 4.3 Adaptabilidad

El modelo podrá evolucionar a medida que AKVEZ aprenda del comportamiento real de los usuarios.

---

## 4.4 Neutralidad

El sistema evitará sesgos innecesarios.

No favorecerá empresas únicamente por su tamaño o reputación.

---

## 4.5 Evidencia

Cada punto otorgado deberá corresponder a una característica observable.

---

# 5. Arquitectura del Modelo

El Opportunity Score estará compuesto por múltiples dimensiones independientes.

Cada dimensión aportará una parte del resultado final.

```
Información Pública

↓

Evaluación por Categorías

↓

Puntuaciones Parciales

↓

Ponderación

↓

Opportunity Score

↓

Recomendación Comercial
```

---

# 6. Categorías de Evaluación

Cada empresa será analizada utilizando las siguientes categorías.

## 6.1 Presencia Web

Se evaluará:

- existencia del sitio;
- funcionamiento;
- calidad general;
- velocidad;
- estructura.

---

## 6.2 Identidad Digital

Se analizarán:

- redes sociales;
- consistencia de marca;
- imagen profesional;
- actividad reciente.

---

## 6.3 Información Comercial

Disponibilidad de:

- teléfono;
- correo;
- dirección;
- horarios;
- descripción del negocio.

---

## 6.4 Reputación

Indicadores como:

- calificación;
- número de reseñas;
- antigüedad de las reseñas;
- consistencia.

---

## 6.5 Potencial de Mejora

El sistema identificará oportunidades evidentes de optimización.

Por ejemplo:

- ausencia de sitio web;
- diseño desactualizado;
- problemas de usabilidad;
- información incompleta.

---

## 6.6 Compatibilidad

El sistema evaluará si el tipo de empresa coincide con el perfil profesional del usuario.

En la V1, el enfoque estará dirigido principalmente a negocios que puedan beneficiarse de servicios de diseño web.

---

# 7. Modelo de Puntuación

El Opportunity Score se expresará en una escala de **0 a 100 puntos**.

La puntuación se calculará a partir de la combinación ponderada de todas las categorías de evaluación.

Las ponderaciones podrán modificarse con el tiempo conforme el producto recopile evidencia suficiente para mejorar la precisión del modelo.

## 7.1 Perfil de Ponderación — WP-01 v1.0

> **Ésta es la primera versión publicada del Perfil de Ponderación.** Su gobierno —quién puede modificarlo, bajo qué condiciones y con qué garantías— está definido en **ADR-14**. Este documento contiene los valores; ADR-14 contiene las reglas.

### Identificación

| Campo | Valor |
| --- | --- |
| **Nombre** | Perfil de Ponderación Inicial — Diseño Web |
| **Código** | **WP-01** |
| **Versión** | 1.0 |
| **Estado** | **Vigente** *(único perfil publicado)* |
| **Fecha de publicación** | 2026-07-29 |
| **Fecha de entrada en vigor** | 2026-07-29 |
| **Responsable** | AKVEZ Product Office |
| **Autoridad que lo aprueba** | Fundadora, conforme a ADR-14 §8.1 |
| **Perfil al que sucede** | Ninguno — versión inicial |

### Tabla de ponderaciones

| # | Categoría de evaluación *(APS-08 §6)* | Peso |
| --- | --- | ---: |
| 6.1 | **Presencia Web** | **25 %** |
| 6.5 | **Potencial de Mejora** | **25 %** |
| 6.6 | **Compatibilidad** | **20 %** |
| 6.4 | **Reputación** | **12 %** |
| 6.2 | **Identidad Digital** | **10 %** |
| 6.3 | **Información Comercial** | **8 %** |
| | **Total** | **100 %** |

> **Las seis categorías son las definidas en §6 y no se modifican.** WP-01 únicamente les asigna peso.

### Justificación

**Presencia Web y Potencial de Mejora suman el 50 %.** Son las dos categorías que miden directamente **la carencia que el usuario resuelve**. APS-01 §5 declara que AKVEZ existe para resolver la dificultad de encontrar clientes; para un diseñador web, el mejor cliente potencial es aquel cuya presencia digital es deficiente o inexistente. APS-08 §6.5 sitúa la ausencia de sitio web como la oportunidad de mejora más evidente. Medio Score depende de esa brecha.

**Compatibilidad pesa el 20 %.** Una brecha enorme en un negocio que no encaja con el perfil profesional del usuario no es una oportunidad para *ese* usuario. Es la categoría que personaliza la puntuación (§6.6) y la que hace que el Score signifique «potencial **para este usuario concreto**» (PO-01 §5), no un juicio universal.

**Reputación pesa solo el 12 %, deliberadamente.** Aporta señal sobre la solidez del negocio —un comercio con reseñas activas es un cliente con capacidad de contratar—, pero **APS-08 §4.4 prohíbe favorecer empresas únicamente por su tamaño o reputación**. Un peso alto convertiría el modelo en un ranking de negocios prósperos, no de oportunidades. Se limita para respetar ese principio.

**Identidad Digital (10 %) e Información Comercial (8 %) cierran el conjunto.** Son condiciones de **contactabilidad y contexto**: importan para poder dirigirse al negocio y para redactar la propuesta, pero no describen por sí mismas la oportunidad comercial.

**Base de la versión inicial.** WP-01 se emite **sin evidencia de uso real, por no existir todavía**. Sus pesos derivan de los principios ya aprobados en APS-01 §5-§7 y APS-08 §4 y §6, no de datos observados. Es la circunstancia prevista en ADR-14 §3.4 y registrada como riesgo **R-8**.

> **Carácter provisional declarado.** WP-01 deberá revisarse en cuanto exista evidencia conforme a APS-08 §10 —clientes conseguidos, oportunidades descartadas, retroalimentación de usuarios y resultados de campañas—. Su sustitución seguirá íntegramente el procedimiento de ADR-14 §8.4.

### Conformidad con las restricciones vinculantes

Verificación exigida por ADR-14 §8.3 (G-4) y §12:

| # | Restricción | Cumplimiento |
| --- | --- | --- |
| **RV-A** | Ninguna ponderación impide registrar una Empresa | ✅ WP-01 se aplica en la Evaluación, posterior al Registro |
| **RV-B** | Ninguna ponderación retira un Lead de la Biblioteca | ✅ No existe peso ni combinación que produzca exclusión |
| **RV-C** | Ninguna ponderación oculta un Lead | ✅ Las cinco bandas de §8 se presentan íntegras |
| **RV-D** | **No se produce umbral encubierto** | ✅ Ningún peso es cero y ninguna combinación impide alcanzar cualquier banda. Aplicado el Criterio de Invariancia de ADR-11 §7.1: modificar estos pesos **altera el orden, nunca qué Leads existen o son alcanzables** |
| **RV-E** | Sin sesgo por tamaño o reputación | ✅ Reputación limitada al 12 % precisamente por este motivo |
| **RV-F** | La puntuación sigue siendo explicable | ✅ Seis categorías con peso declarado permiten la explicación que exige §9 |
| **RV-G** | No se justifica en limitaciones técnicas | ✅ La justificación es exclusivamente de producto |

---

# 8. Clasificación de Oportunidades

## 90–100

### Oportunidad Excelente

Alta prioridad.

Debe aparecer entre los primeros resultados.

---

## 75–89

### Oportunidad Alta

Muy recomendable.

Representa una excelente posibilidad comercial.

---

## 60–74

### Oportunidad Media

Interesante.

Puede requerir una evaluación manual adicional.

---

## 40–59

### Oportunidad Baja

No constituye una prioridad inmediata.

---

## 0–39

### Oportunidad Muy Baja

La empresa probablemente no representa un buen candidato para el tipo de servicio ofrecido.

**Se muestra igualmente al usuario**, en las últimas posiciones del orden. Ninguna banda oculta un Lead (§8.6).

---

## 8.6 Ausencia de umbral de exclusión

Las cinco bandas anteriores son **etiquetas de prioridad**, no criterios de admisión. Esta sección declara de forma vinculante el papel del Opportunity Score dentro del dominio, conforme a PO-01 §5 y §7.

**Lo que el Opportunity Score hace:**

1. **Clasifica.** Asigna a cada Lead una de las cinco bandas anteriores, de modo que el usuario sepa de un vistazo qué tiene delante.
2. **Ordena.** Permite presentar los Leads de mayor a menor puntuación. Ésta es su única función operativa.

**Lo que el Opportunity Score no hace, en ningún caso:**

3. **Nunca crea un Lead.** Un Lead existe desde su Registro, mucho antes de que exista puntuación alguna. Un Lead sin Opportunity Score es un estado válido y esperado.
4. **Nunca elimina un Lead.** Ninguna puntuación, por baja que sea, retira un Lead de la Biblioteca ni lo oculta de la vista del usuario.
5. **Nunca define un umbral de persistencia.** No existe ni existirá ninguna puntuación mínima que condicione el registro, la conservación o la presentación de un Lead.

**No existe umbral de exclusión.** Lo bueno sube, lo flojo baja; nada desaparece.

**Por qué.** APS-01 §8.2 establece que «la IA existirá para potenciar el criterio del usuario, **no para sustituirlo**». Un umbral automático sustituiría ese criterio: decidiría por el usuario que una empresa no merece su atención. Además, el juicio del modelo es probabilístico: una empresa con puntuación baja puede ser el mejor cliente de un profesional que conoce ese nicho.

**AKVEZ ordena y explica; no oculta.**

---

# 9. Explicabilidad del Score

Todo Opportunity Score deberá acompañarse de una explicación.

El usuario deberá comprender:

- por qué obtuvo esa puntuación;
- qué aspectos aumentaron el resultado;
- qué factores redujeron la evaluación;
- cuáles representan oportunidades comerciales.

El objetivo es generar confianza en el sistema.

---

# 10. Aprendizaje del Modelo

El Opportunity Score evolucionará mediante evidencia obtenida durante el uso del producto.

Entre las fuentes de aprendizaje se encuentran:

- clientes conseguidos;
- oportunidades descartadas;
- retroalimentación de usuarios;
- resultados de campañas comerciales.

El aprendizaje deberá producirse de forma controlada y documentada.

---

# 11. Casos Especiales

El sistema deberá contemplar situaciones como:

- empresas nuevas;
- información pública insuficiente;
- negocios sin presencia digital;
- datos inconsistentes;
- cambios recientes en la empresa.

En estos casos, el Opportunity Score deberá indicar que la confianza del análisis puede ser limitada.

---

# 12. Riesgos

Los principales riesgos asociados al modelo son:

- información pública incompleta;
- sesgos de evaluación;
- sobrevaloración de ciertos factores;
- cambios en las fuentes de información;
- exceso de confianza en una única puntuación.

El Opportunity Score deberá utilizarse como herramienta de apoyo y no como sustituto del criterio profesional.

---

# 13. Dependencias

Este documento depende de:

- **PO-01 — Decisión Canónica de Lead.** Autoridad funcional del dominio.
- **APS-07 v2.0 — Data & Knowledge Architecture.** Referencia oficial del dominio Empresa → Lead.
- AF-00 — Constitución de AKVEZ.
- AF-02 — Product Manifesto.
- ADS-00 — Documentation Standard.
- APS-01 — Product Vision, §8.2.
- APS-02 v2.1 — Product Scope.
- APS-03 v3.0 — Agent Architecture.
- APS-06 — Success Metrics & Product Analytics.

---

# 14. Glosario

**Opportunity Score:** Indicador numérico de 0 a 100 que representa el potencial comercial de un **Lead** para un usuario concreto. Es un **atributo** del Lead, no un estadio de su ciclo de vida: no lo crea, no lo promueve y no lo expulsa. Su única función operativa es permitir clasificar y ordenar. *(PO-01 §5; APS-07 v2.0 §16)*

**Lead:** Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto. Existe desde su Registro, con independencia de que tenga o no Opportunity Score. *(PO-01 §2)*

**Banda:** Cada una de las cinco categorías de prioridad de §8. Es una **etiqueta**, nunca un criterio de admisión.

**Ponderación:** Peso asignado a una categoría dentro del cálculo final.

**Explicabilidad:** Capacidad del sistema para justificar el resultado obtenido.

**Compatibilidad:** Nivel de adecuación entre una empresa y el perfil profesional del usuario.

---

# 15. Referencias

- PO-01 — Decisión de Producto: Definición Canónica de Lead, §5, §7.
- ADS-00 — Documentation Standard.
- APS-01 — Product Vision, §8.2.
- APS-02 v2.1 — Product Scope.
- APS-03 v3.0 — Agent Architecture, §7.2, §8.2.
- APS-06 — Success Metrics & Product Analytics.
- APS-07 v2.0 — Data & Knowledge Architecture, §5, §7.2, §16.

---

# 16. Evaluación AQS

| Criterio | Puntaje |
| --- | --- |
| Claridad | 20/20 |
| Completitud | 20/20 |
| Implementabilidad | 20/20 |
| Consistencia | 15/15 |
| Escalabilidad | 15/15 |
| Calidad Editorial | 10/10 |

**AQS Total:** **100/100**

**Estado:** **APPROVED**