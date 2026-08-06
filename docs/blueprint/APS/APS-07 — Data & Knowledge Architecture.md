# APS-07 — Data & Knowledge Architecture

## APS-07 — Data & Knowledge Architecture

**Versión:** 2.1

**Estado:** Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Estándar Aplicado:** ADS-00

**Autoridad de dominio:** PO-01 (Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-21 | AKVEZ Product Office | Primera definición oficial de la arquitectura de datos y conocimiento de AKVEZ. | Establecer el modelo de conocimiento del producto. |
| **2.1** | 2026-07-30 | AKVEZ Product Office | **Alineación con PO-01 v1.2.** Se separa la **emisión de la Propuesta** de la **transición a *Lead Contactado*** en tres lugares: **§6** *(diagrama APS-07-DIAG-001, ahora v2.1)*, **§7** *(los apartados «Propuesta» y «Acción»)* y **§16** *(Glosario)*. La Propuesta deja de producir cambio de estadio; la transición pasa a la **declaración del usuario**. **No se modifica ninguna otra sección:** ni §5, ni la nomenclatura oficial de **§6.1** —los cinco nombres de los estados **no cambian**—, ni §8, ni ninguna otra entrada del Glosario. | Sprint **COM-09**, tarea 3. Aplica **PO-01 v1.2 §8** y **PO-02 §5**. La definición del Glosario —«Lead Contactado: Lead para el que se ha generado una propuesta comercial»— era **la formulación más explícita de la conflación** en todo el Blueprint (COM-08). **§7 ya distinguía «Propuesta» de «Acción del usuario»: solo las ordenaba al revés**, por lo que la corrección consistió en trasladar la transición de la primera a la segunda. |
| 2.0 | 2026-07-29 | AKVEZ Product Office | **Alineación con PO-01.** Se reescriben §5 (activos Empresa y Lead), §6 (modelo conceptual), §7 (ciclo de vida) y §8 (Biblioteca de Leads), y se amplía el Glosario con las definiciones canónicas del dominio. | Fase 1 de PLAN-01. La definición de Lead de §5 v1.0 —«Empresas identificadas como oportunidades comerciales»— queda derogada por PO-01 §2. Resuelve las tensiones T1 y T2 documentadas en ADR-10 §7. |

---

> **Autoridad de este documento.** Las definiciones de dominio contenidas en §5, §6, §7 y §8 reproducen la decisión canónica de PO-01 y constituyen la **referencia oficial del dominio Empresa → Lead** dentro del Blueprint. Conforme a la jerarquía documental de ADS-00, ningún ADR ni documento derivado podrá reinterpretarlas. En caso de discrepancia entre este documento y PO-01, prevalece PO-01.

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Filosofía de los Datos
4. Principios de Arquitectura
5. Activos de Información
6. Modelo Conceptual de Datos
7. Ciclo de Vida de un Lead
8. Biblioteca de Leads
9. Gestión del Conocimiento
10. Calidad de los Datos
11. Gobernanza
12. Seguridad y Privacidad
13. Escalabilidad
14. Riesgos
15. Dependencias
16. Glosario
17. Referencias
18. Evaluación AQS

---

# 1. Resumen Ejecutivo

Los datos representan el activo estratégico más importante de AKVEZ.

La inteligencia artificial únicamente puede producir resultados de calidad cuando trabaja sobre información confiable, organizada y consistente.

Este documento establece la arquitectura conceptual que permitirá almacenar, relacionar y evolucionar toda la información generada por el producto.

Su objetivo no es definir una base de datos específica, sino construir un modelo de conocimiento capaz de crecer junto con AKVEZ.

---

# 2. Propósito del Documento

Este documento define:

- cómo se organiza la información;
- qué datos forman parte del producto;
- cómo evolucionan esos datos;
- cómo se preserva el conocimiento generado.

Toda futura implementación técnica deberá respetar estos principios.

---

# 3. Filosofía de los Datos

Para AKVEZ, los datos no son únicamente registros almacenados.

Representan conocimiento acumulado.

Cada búsqueda realizada.

Cada empresa descubierta.

Cada análisis.

Cada Opportunity Score.

Cada propuesta generada.

Cada cliente conseguido.

Todo ello incrementa el conocimiento del producto.

La plataforma deberá aprender continuamente de esa información.

---

# 4. Principios de Arquitectura

## 4.1 Una única fuente de verdad

Cada dato tendrá un único origen oficial.

Se evitarán duplicados y versiones inconsistentes.

---

## 4.2 Persistencia del conocimiento

Toda información relevante deberá conservarse para futuras consultas y análisis.

---

## 4.3 Trazabilidad

Cada dato deberá poder rastrearse hasta su origen.

---

## 4.4 Evolución sin pérdida

La estructura de datos deberá permitir incorporar nuevos atributos sin afectar la información existente.

---

## 4.5 Independencia tecnológica

El modelo conceptual deberá mantenerse válido independientemente del motor de base de datos utilizado.

---

# 5. Activos de Información

AKVEZ administrará los siguientes activos principales.

## Empresas

**Una Empresa es un negocio real que AKVEZ ha encontrado y sobre el que dispone de información pública.** (PO-01 §1)

Es un hecho del mundo, no un juicio. Que una Empresa exista en AKVEZ no significa que sea buena, mala, prometedora ni relevante: significa únicamente que AKVEZ sabe que existe y ha recogido lo que es público sobre ella.

Una Empresa no pertenece a ningún usuario. Es información del mercado.

---

## Leads

**Un Lead es una Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto.** (PO-01 §2)

La diferencia entre Empresa y Lead **no es de calidad, es de pertenencia**. La Empresa pertenece al mercado; el Lead pertenece al embudo del usuario.

Un Lead **no requiere** estar analizado, tener Opportunity Score, superar ningún umbral ni ocupar ninguna posición en un ranking. Todas esas son cosas que le ocurren **después** de ser Lead y que lo enriquecen sin cambiar lo que es.

> **Definición derogada.** La versión 1.0 de este documento definía Lead como «Empresas identificadas como oportunidades comerciales». Esa definición queda **sustituida** por la anterior, conforme a PO-01 §2. Ningún documento del Blueprint podrá seguir invocándola.

---

## Análisis

Resultados producidos por Lead Analyzer.

---

## Opportunity Scores

Evaluaciones numéricas del potencial comercial de un Lead para un usuario concreto.

El Opportunity Score es un **atributo del Lead, no un estadio de su ciclo de vida** (PO-01 §5). Su ausencia es un estado válido: un Lead recién registrado no tiene puntuación.

---

## Pitches

Propuestas comerciales generadas.

---

## Usuarios

Información relacionada con quienes utilizan la plataforma.

---

## Historial

Registro cronológico de toda actividad realizada.

---

## Métricas

Indicadores generados por APS-06.

---

# 6. Modelo Conceptual de Datos

Empresa y Lead **no son dos entidades distintas**: son el mismo sujeto en dos momentos de su relación con el usuario (PO-01 §8). El modelo conceptual describe esa evolución.

```
Empresa
   │
   │  ◆ REGISTRO          ← aquí nace el Lead
   ▼
Lead
   │
   │  ◆ ANÁLISIS
   ▼
Lead Analizado
   │
   │  ◆ EVALUACIÓN        ← se calcula el Opportunity Score
   ▼
Lead Evaluado
   │
   │  ◆ PROPUESTA        ← se diseña la secuencia y se redacta
   │                        el contacto. NO cambia el estadio
   │
   │  ◆ CONTACTO         ← el usuario emite el contacto
   │     (el usuario)       y lo declara
   ▼
Lead Contactado
   │
   ▼
Cliente Potencial  →  Cliente Confirmado
   (posterior a la V1)
```

**Identificador:** APS-07-DIAG-001

**Versión:** v2.1

**Fecha de actualización:** 2026-07-30

Cada transición agregará nuevo conocimiento sin reemplazar la información anterior.

## 6.1 Nomenclatura oficial de los estados

Los estados del modelo conceptual se denominarán exclusivamente: **Empresa**, **Lead**, **Lead Analizado**, **Lead Evaluado** y **Lead Contactado**.

Ninguna otra nomenclatura es válida. Conforme a ADS-00 (*Terminología*), un concepto tiene un único nombre oficial.

## 6.2 El Opportunity Score no es un estadio

La versión 1.0 de este documento situaba `Opportunity Score` como un estadio entre *Lead Analizado* y *Pitch*. **Esa representación queda derogada** por PO-01 §5.

El Opportunity Score es el **resultado** de la transición de Evaluación, no la transición misma. El estadio que produce dicha transición se denomina **Lead Evaluado**.

## 6.3 Orden canónico: primero Análisis, después Evaluación

El Opportunity Score se calcula **sobre** el conocimiento producido por el Análisis. Por tanto la Evaluación sigue siempre al Análisis, nunca lo precede (PO-01 §5 y §8).

> Esta regla resuelve de forma definitiva la tensión **T2** documentada en ADR-10 §7, que enfrentaba el orden de APS-07 §7 con el bloque `Scoring` de ADR-02 §8. Prevalece el orden aquí declarado.

---

# 7. Ciclo de Vida de un Lead

El ciclo de vida se compone de las siguientes etapas. Un Lead **no está obligado a recorrerlas todas**: detenerse indefinidamente en cualquier etapa es un estado válido (§7.2).

### Descubrimiento — Lead Hunter

La Empresa es encontrada en las fuentes externas. En esta etapa es información de mercado: no pertenece a ningún usuario y todavía no es un Lead.

---

### Registro — Lead Hunter

**Evento de nacimiento del Lead.**

AKVEZ comprueba que la Empresa no esté ya presente en la Biblioteca de Leads del usuario y la incorpora a ella. En ese momento exacto, y por ese solo hecho, la Empresa se convierte en Lead (PO-01 §3).

Se registran **todas** las Empresas descubiertas. El Registro no aplica ningún criterio de calidad, puntuación ni límite de cantidad.

---

### Análisis — Lead Analyzer

Se estudia la presencia digital del Lead y se detectan carencias y oportunidades de mejora. El Lead pasa a ser **Lead Analizado**.

---

### Evaluación — Lead Analyzer

Se calcula el Opportunity Score (0–100) sobre el conocimiento producido por el Análisis y se asigna su banda. El Lead pasa a ser **Lead Evaluado**.

Todos los Leads evaluados se muestran al usuario, ordenados por puntuación. Ninguno se oculta.

---

### Propuesta — Pitch Generator

Se diseña la secuencia comercial y se redacta el contacto personalizado. **El Lead no cambia de estadio.**

---

### Acción — el usuario

El usuario decide contactar o descartar el Lead.

**Si declara haber emitido un contacto, el Lead pasa a ser Lead Contactado** *(PO-01 §8 · PO-02 §5)*.

Descartar es una **decisión del usuario que se registra como conocimiento**, no una eliminación: el Lead permanece en la Biblioteca (§7.2, regla 3).

---

### Resultado

El sistema registra el desenlace para futuras mejoras.

---

## 7.1 El Registro es el único evento de cualificación

No existe ningún otro evento que convierta una Empresa en Lead.

Ni el Análisis, ni el Opportunity Score, ni la selección, ni la entrega al usuario crean, promueven o degradan a un Lead. Todos ellos **enriquecen** un Lead que ya existe.

> Esta regla resuelve de forma definitiva la tensión **T1** documentada en ADR-10 §7, que enfrentaba la definición de Lead de §5 con la posición del Registro en §7. Ambas secciones quedan ahora alineadas: el Registro es lo que crea el Lead, y por eso la Biblioteca contiene Leads.

---

## 7.2 Reglas del ciclo de vida

**1. Es un solo sujeto que evoluciona.**

Empresa y Lead no son dos cosas distintas: son la misma Empresa en dos momentos de su relación con el usuario.

---

**2. Nada se reemplaza.**

Cada etapa **añade** conocimiento. El diagnóstico no borra los datos públicos; la puntuación no borra el diagnóstico.

---

**3. Ninguna etapa expulsa.**

Un Lead que entra en la Biblioteca permanece en ella. Puede quedar el último en la lista; no puede desaparecer.

---

**4. Detenerse es válido.**

Un Lead sin analizar es un Lead. Un Lead evaluado y nunca contactado es un Lead.

---

**5. No existe Top N.**

Ninguna limitación técnica podrá determinar qué Leads existen, cuáles se registran ni cuáles se conservan (PO-01 §6).

Los límites de tanda, de llamada a proveedores externos o de paginación de interfaz son restricciones de infraestructura, legítimas y necesarias, que deben residir donde nacen: en la integración o en la interfaz. **Nunca en el dominio.**

---

**6. No existe umbral mínimo.**

Ninguna puntuación mínima excluirá a un Lead de la Biblioteca ni de la vista del usuario (PO-01 §7).

La priorización se expresa mediante **orden y etiqueta de banda**, nunca mediante exclusión. AKVEZ ordena y explica; no oculta.

---

# 8. Biblioteca de Leads

## 8.1 Qué contiene

> **La Biblioteca de Leads almacena todas las Empresas descubiertas para un usuario, cada una con todo el conocimiento acumulado sobre ella.** (PO-01 §4)
>
> **Y como el Registro es lo que convierte una Empresa en Lead (§7.1), todo lo que hay en la Biblioteca es, por definición, un Lead.**

Una única definición, sin excepciones. La Biblioteca **no** almacena solo las Empresas calificadas, ni solo las analizadas, ni solo las entregadas al usuario.

## 8.2 Qué es funcionalmente

La **memoria comercial del usuario**: todo lo que AKVEZ ha visto para él, con lo que sabe de cada cosa.

Es lo que permite afirmar «esto ya te lo mostré», «esto lo descartaste», «esto lo contactaste hace quince días».

Esta memoria completa es **condición de la deduplicación**, que APS-02 §9 declara criterio de éxito de la V1. Un mecanismo de deduplicación solo funciona si la memoria contiene todo lo visto: registrar únicamente lo bueno haría que mañana se volviese a presentar lo malo como si fuera nuevo.

## 8.3 Qué no es

**No es una lista de resultados de búsqueda ni una selección de recomendados.**

Los resultados que el usuario ve en pantalla son una **vista** sobre la Biblioteca, ordenada por prioridad. La vista cambia; la Biblioteca solo crece.

## 8.4 Contenido mínimo de cada registro

| Campo | Obligatorio | Observación |
| --- | --- | --- |
| Identificador único | Sí | Asignado en el Registro |
| Nombre | Sí | |
| Categoría | Sí | |
| Ubicación | Sí | |
| Sitio web | No | Su ausencia es información relevante para el Análisis |
| Información de contacto | No | |
| Estado del ciclo de vida | Sí | Conforme a la nomenclatura de §6.1 |
| Resultado del Análisis | No | Ausente hasta que se ejecute el Análisis |
| Opportunity Score | No | Ausente hasta que se ejecute la Evaluación. Su ausencia es un estado válido (§5) |
| Fecha de descubrimiento | Sí | |
| Fecha de última actualización | Sí | |
| Historial de modificaciones | Sí | |

Los campos marcados como no obligatorios corresponden a conocimiento que se **añade** en etapas posteriores del ciclo de vida. Su ausencia nunca impedirá que un registro exista ni que se presente al usuario.

## 8.5 Reglas de la Biblioteca

- Ningún agente podrá modificar directamente la información sin dejar trazabilidad.
- Ningún registro se elimina como consecuencia del ciclo de vida (§7.2, regla 3).
- Ninguna restricción técnica podrá determinar qué registros contiene (§7.2, regla 5).
- El nombre «Biblioteca de Leads» es correcto: contiene Leads, porque entrar en ella es precisamente lo que convierte una Empresa en Lead.

---

# 9. Gestión del Conocimiento

El conocimiento generado deberá permanecer disponible para futuras decisiones.

El sistema almacenará:

- observaciones;
- resultados de validaciones;
- mejoras detectadas;
- patrones encontrados;
- lecciones aprendidas.

El objetivo es que AKVEZ mejore continuamente a partir de la experiencia acumulada.

---

# 10. Calidad de los Datos

Toda información deberá cumplir los siguientes principios.

## Integridad

Los registros deberán estar completos.

---

## Consistencia

No podrán existir contradicciones entre datos relacionados.

---

## Exactitud

La información deberá reflejar la realidad disponible.

---

## Actualización

Los datos deberán renovarse cuando sea necesario.

---

## Trazabilidad

Toda modificación importante deberá quedar registrada.

---

# 11. Gobernanza

La información será administrada siguiendo reglas claras.

Se establecerán políticas para:

- creación;
- actualización;
- eliminación;
- auditoría;
- conservación.

Toda modificación significativa deberá quedar documentada.

---

# 12. Seguridad y Privacidad

AKVEZ protegerá la información almacenada siguiendo los principios de:

- mínimo privilegio;
- acceso controlado;
- confidencialidad;
- integridad;
- disponibilidad.

La plataforma solo utilizará información pública o autorizada por el usuario.

Toda futura integración deberá respetar la normativa aplicable en materia de protección de datos.

---

# 13. Escalabilidad

La arquitectura deberá permitir incorporar nuevos tipos de información sin alterar la estructura existente.

Ejemplos:

- contratos;
- reuniones;
- campañas;
- correos;
- documentos;
- métricas comerciales;
- nuevos sectores económicos.

La expansión deberá producirse mediante módulos independientes.

---

# 14. Riesgos

Los principales riesgos asociados a la gestión de datos son:

- información duplicada;
- datos desactualizados;
- pérdida de trazabilidad;
- crecimiento desordenado del modelo;
- dependencia de fuentes externas;
- baja calidad de información pública.

Estos riesgos deberán supervisarse continuamente.

---

# 15. Dependencias

Este documento depende de:

- **PO-01 — Decisión Canónica de Lead.** Autoridad funcional del dominio Empresa → Lead. Prevalece sobre este documento.
- AF-00 — Constitución de AKVEZ.
- AF-01 — The AKVEZ Way.
- AF-02 — Product Manifesto.
- ADS-00 — Documentation Standard.
- APS-02 — Product Scope.
- APS-03 — Agent Architecture.
- APS-06 — Success Metrics & Product Analytics.
- APS-08 — Opportunity Scoring Framework.

Los siguientes documentos **dependen de este** y deberán alinearse con las definiciones aquí establecidas: APS-02, APS-03, APS-08, ADR-02, ADR-05, ADR-10 y ADR-10A.

---

# 16. Glosario

Las definiciones del dominio Empresa → Lead reproducen PO-01 y constituyen la terminología oficial del Blueprint. Conforme a ADS-00 (*Terminología*), no existe ninguna denominación alternativa válida.

**Activo de Información:** Conjunto de datos con valor estratégico para AKVEZ.

**Empresa:** Negocio real que AKVEZ ha encontrado y sobre el que dispone de información pública. Es un hecho del mundo, no un juicio comercial. No pertenece a ningún usuario. *(PO-01 §1)*

**Lead:** Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto. No requiere análisis, puntuación ni umbral alguno. *(PO-01 §2)*

**Registro:** Evento por el que AKVEZ incorpora una Empresa a la Biblioteca de Leads de un usuario, tras comprobar que no estaba ya presente. Es el **único** evento que convierte una Empresa en Lead. Responsabilidad del Lead Hunter. *(PO-01 §3)*

**Biblioteca de Leads:** Memoria comercial del usuario. Contiene **todas** las Empresas descubiertas para él, cada una con su conocimiento acumulado. Todo su contenido es, por definición, un Lead. *(PO-01 §4)*

**Lead Analizado:** Lead enriquecido con el diagnóstico de su presencia digital.

**Lead Evaluado:** Lead Analizado al que se ha asignado un Opportunity Score y su banda correspondiente.

**Lead Contactado:** Lead respecto del cual **el usuario ha declarado haber emitido un contacto**. **Generar una propuesta no produce esta transición** *(PO-01 §8 · PO-02 §5)*.

**Opportunity Score:** Valor de 0 a 100 que expresa el potencial comercial de un Lead para un usuario concreto. Es un **atributo** del Lead, no un estadio de su ciclo de vida: no lo crea, no lo promueve y no lo expulsa. Su única función operativa es permitir ordenar. *(PO-01 §5)*

**Vista:** Presentación ordenada de un subconjunto de la Biblioteca de Leads. La vista cambia; la Biblioteca solo crece. No debe confundirse con la Biblioteca. *(§8.3)*

**Trazabilidad:** Capacidad de reconstruir el origen y evolución de un dato.

**Gobernanza de Datos:** Conjunto de políticas que regulan la administración de la información.

**Modelo Conceptual:** Representación lógica de las entidades y relaciones del producto.

---

# 17. Referencias

- PO-01 — Decisión de Producto: Definición Canónica de Lead, §1, §2, §3, §4, §5, §6, §7, §8.
- PLAN-01 — Plan de Consolidación del Blueprint, §4, §7 (Fase 1).
- ADS-00 — Documentation Standard (*Jerarquía Documental y Regla de Precedencia*).
- APS-01 — Product Vision, §5, §6, §8.2.
- APS-02 — Product Scope, §9.
- APS-03 — Agent Architecture.
- APS-06 — Success Metrics & Product Analytics.
- APS-08 — Opportunity Scoring Framework, §8.
- ADR-10 — Ubicación de la Persistencia en el Flujo de Adquisición de Leads, §7 (tensiones T1 y T2, resueltas en §6.3 y §7.1 de este documento).

---

# 18. Evaluación AQS

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