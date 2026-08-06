# ADS-00  Documentation Standard

| Campo | Valor |
| --- | --- |
| Código | ADS-00 |
| Clasificación | AKVEZ Documentation Standard |
| Versión | 1.3 |
| Estado | Approved |
| Fecha de creación | 2026-07-21 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-21 | AKVEZ Product Office | Definición inicial del estándar documental de AKVEZ. | Establecer una norma única de calidad, estructura y trazabilidad documental. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Aditivo, de gobernanza documental.** Se incorporan las categorías PO, DP, REV, AR y PLAN a la *Clasificación Oficial* y se añade la sección *Jerarquía Documental y Regla de Precedencia*. No se modifica ningún principio, convención ni criterio de calidad preexistente. | Fase 0 de PLAN-01. Cierra el vacío V-5 identificado en AR-01 y mitiga el riesgo R-4 de PLAN-01 §6: la ausencia de una regla de precedencia declarada fue la causa raíz de las contradicciones del dominio Empresa → Lead. |
| 1.3 | 2026-07-29 | AKVEZ Product Office | **Aditivo, de gobernanza documental.** Se incorpora la categoría **DEV — Development Standard** a la *Clasificación Oficial*, con su propósito, alcance, autoridad, propietario, contenido admisible y reglas de uso. Se añade DEV al **orden 8** de la *Jerarquía Documental* —el último— y la regla **R-7**, que declara su subordinación a todas las categorías anteriores y a ADS. **No se modifica el orden de las siete categorías preexistentes, ni las reglas R-1 a R-6, ni ningún principio, convención o criterio de calidad.** | Sprint **GOV-02**. Cierre del vacío **V-7** registrado en DEV-00 §11: la categoría `DEV` se estaba utilizando sin pertenecer a la Clasificación Oficial, que es cerrada, lo que dejaba a DEV-00 sin precedencia definida dentro del Blueprint. |
| 1.2 | 2026-07-29 | AKVEZ Product Office | **Corrección del orden de precedencia.** AF asciende al nivel 1 y PO, APS y ADR descienden una posición. Se añade la regla R-6. Ningún otro contenido resulta afectado. | AF constituye el nivel constitucional del Blueprint (AF-00 *Constitución de AKVEZ*, AF-02 *Product Manifesto*). Situarlo por debajo de ADR habría permitido que una decisión de arquitectura prevaleciese sobre los principios fundacionales del proyecto. |

---

### Propósito

El ADS-00 establece el estándar oficial para la creación, mantenimiento y evolución de toda la documentación de AKVEZ.

Su objetivo es garantizar que cualquier documento, independientemente de quién lo redacte (una persona o una IA), mantenga un mismo nivel de calidad, estructura, trazabilidad y consistencia.

Este documento constituye la referencia obligatoria para todos los documentos oficiales del proyecto.

---

# Principios

Toda documentación deberá cumplir siete principios fundamentales.

## 1. Claridad

Cada documento debe poder comprenderse sin necesidad de explicaciones adicionales.

El lector nunca debe depender del autor para interpretar un requisito.

---

## 2. Consistencia

Todos los documentos utilizarán la misma terminología, estructura y estilo.

No existirán dos formas distintas de documentar el mismo concepto.

---

## 3. Trazabilidad

Toda decisión deberá poder rastrearse.

Ejemplo:

APS-03

↓

Referencia

ADR-001

↓

Fundamento

AF-00

---

## 4. Escalabilidad

Los documentos deberán seguir siendo útiles cuando AKVEZ crezca.

Nunca deberán escribirse pensando únicamente en la versión actual.

---

## 5. Implementabilidad

Todo documento técnico deberá ser suficiente para que un desarrollador implemente la funcionalidad sin depender de reuniones adicionales.

---

## 6. Mantenibilidad

La documentación deberá evolucionar junto con el producto.

Documentación desactualizada equivale a documentación incorrecta.

---

## 7. Profesionalismo

Toda documentación oficial representa a AKVEZ.

Debe poder compartirse con:

- desarrolladores;
- diseñadores;
- socios;
- colaboradores;
- inversionistas.

---

# Clasificación Oficial

AKVEZ utilizará las siguientes categorías documentales.

## AF

AKVEZ Foundation

Documentos estratégicos.

Ejemplo

AF-00

AF-01

---

## ADS

AKVEZ Documentation Standards

Normas para crear documentación.

Ejemplo

ADS-00

ADS-01

ADS-02

---

## APS

AKVEZ Product Specification

Documentación del producto.

Ejemplo

APS-05

Backend

---

## ADR

Architecture Decision Record

Registro permanente de decisiones de arquitectura.

---

## PO

Product Decision

Decisión funcional del Product Office sobre el dominio del producto.

Ejemplo

PO-01

---

## PLAN

Plan de Consolidación

Plan de trabajo documental. No decide: ordena la ejecución de decisiones ya tomadas.

Ejemplo

PLAN-01

---

## DP

Decision Paper

Documento de deliberación previo a una decisión.

Ejemplo

DP-01

---

## REV

Documento de Revisión

Inventario de evidencia documental.

Ejemplo

REV-01

REV-02

---

## AR

Assessment Report

Evaluación arquitectónica de cierre de una investigación.

Ejemplo

AR-01

---

## DEV

**Development Standard**

Contrato operativo de implementación. Traduce decisiones ya aprobadas del Blueprint en reglas verificables sobre el código.

| Campo | Valor |
| --- | --- |
| **Código** | `DEV` |
| **Nombre oficial** | **AKVEZ Development Standard** |
| **Propósito** | Operacionalizar el Blueprint: convertir decisiones aprobadas en reglas, convenciones y procesos que puedan comprobarse sobre la implementación |
| **Alcance** | Estructura del repositorio, convenciones técnicas, organización del código, revisión, validaciones, procesos de desarrollo y prácticas de ingeniería |
| **Autoridad** | **Vinculante sobre la implementación, subordinada a toda decisión previa.** Su fuerza deriva de los documentos que cita, nunca de sí misma |
| **Propietario** | **AKVEZ Architecture Team.** Requiere aprobación del AKVEZ Product Office |
| **Documentos admisibles** | Reglas de implementación, convenciones de código, checklists de revisión, definiciones de *done*, guías de proceso de desarrollo y estándares de ingeniería |

Ejemplo

DEV-00

### Reglas de uso de la categoría DEV

**Un documento DEV puede:**

1. Traducir reglas del Blueprint a reglas de implementación.
2. Establecer convenciones técnicas.
3. Definir checklists.
4. Definir procesos de desarrollo.
5. Documentar prácticas de ingeniería.

**Un documento DEV no puede:**

1. Introducir arquitectura.
2. Modificar decisiones.
3. Redefinir modelos.
4. Alterar contratos.
5. Cambiar comportamiento funcional.

> **Toda regla contenida en un documento DEV deberá citar el documento aprobado del que deriva.** Una regla sin cita no es una regla: es una decisión encubierta, y queda prohibida por la lista anterior.
>
> **Un documento DEV nunca se cita como fundamento.** Se cita el documento al que remite.
>
> **Si un documento DEV necesitase una regla que ningún documento aprobado establece**, deberá registrarla como *vacío detectado* y detenerse. **Nunca inventarla.**

---

# Jerarquía Documental y Regla de Precedencia

Esta sección establece qué documento prevalece cuando dos documentos oficiales de AKVEZ se contradicen.

Su declaración es obligatoria: la ausencia de una regla de precedencia explícita fue la causa raíz de las contradicciones detectadas en el dominio del producto, según AR-01 (vacío V-5) y PLAN-01 §6 (riesgo R-4).

---

## Orden Oficial de Precedencia

En caso de conflicto entre dos documentos, prevalece el de menor número de orden.

| Orden | Categoría | Naturaleza | Autoridad |
| --- | --- | --- | --- |
| 1 | **AF** — AKVEZ Foundation | Nivel constitucional. Establece los principios fundacionales del proyecto | **Máxima.** Ninguna decisión de producto o de arquitectura podrá contradecirla |
| 2 | **PO** — Product Decision | Decide el dominio funcional del producto | Máxima sobre el dominio. Deroga de hecho cualquier definición divergente |
| 3 | **APS** — AKVEZ Product Specification | Especifica el producto | Vinculante sobre arquitectura e implementación |
| 4 | **ADR** — Architecture Decision Record | Decide la arquitectura | Vinculante sobre la implementación |
| 5 | **DP** — Decision Paper | Deliberación previa a una decisión | Consultiva |
| 6 | **REV** — Documento de Revisión | Inventario de evidencia | Consultiva |
| 7 | **AR** — Assessment Report | Evaluación de cierre | Consultiva |
| 8 | **DEV** — Development Standard | Operacionaliza decisiones ya aprobadas | **Vinculante sobre la implementación.** Subordinada a todas las categorías anteriores y a ADS |

**DEV ocupa el último lugar del orden, y lo ocupa por definición.** No es una categoría débil: sus reglas son de obligado cumplimiento para quien escribe código. Es una categoría **derivada**: no puede contener nada que no proceda de un documento superior.

> **DEV nunca sustituye a un ADR, a un APS ni a un ADS.** Ante conflicto prevalece siempre el documento superior, y la contradicción se corrige **en el documento DEV**, jamás en su fuente.

---

## Reglas de Aplicación

**R-1. La precedencia resuelve conflictos, no sustituye documentos.**

Que un documento prevalezca no anula al otro. Obliga a corregirlo.

---

**R-2. Un documento de categoría inferior nunca podrá reinterpretar a uno superior.**

Podrá desarrollarlo, detallarlo o aplicarlo. Nunca redefinirlo.

---

**R-3. La contradicción deberá corregirse, no convivirse.**

Detectado un conflicto, el documento de menor precedencia deberá actualizarse y registrar el cambio en su Historial de Versiones.

---

**R-4. Dentro de una misma categoría prevalece el documento más reciente en estado Approved.**

Un documento en estado Draft nunca prevalecerá sobre uno Approved.

---

**R-5. Una IA nunca resolverá un conflicto documental por cuenta propia.**

Deberá señalarlo y aplicar esta jerarquía únicamente para determinar qué documento debe corregirse, conforme a *Colaboración con Inteligencia Artificial*.

---

**R-6. El nivel constitucional es indisponible.**

Ninguna decisión de producto ni de arquitectura podrá contradecir a AF. Un conflicto con AF no se resuelve por precedencia: obliga a detener la decisión y elevarla al Product Office.

---

**R-7. La categoría DEV es siempre derivada y nunca prevalece.**

Un documento DEV no prevalece sobre **ninguna** categoría: ni sobre AF, PO, APS, ADR, DP, REV o AR por precedencia, ni sobre **ADS**, que regula su forma como la de cualquier otro documento.

Su contenido se limita a operacionalizar decisiones ya aprobadas. Una regla DEV que no derive de un documento superior es **nula**, y su presencia constituye un defecto que debe corregirse en el documento DEV.

---

## Documentos Fuera de la Cadena de Precedencia

**ADS** regula la forma de la documentación, no su contenido. No compite con ninguna categoría: se aplica a todas, **incluida DEV**.

**PLAN** ordena la ejecución de decisiones ya tomadas y no decide nada por sí mismo. Carece de autoridad sobre el contenido.

> **Distinción entre ADS y DEV.** Ambas regulan *cómo se hacen las cosas*, y por eso conviene separarlas sin ambigüedad:
>
> | | **ADS** | **DEV** |
> | --- | --- | --- |
> | **Qué regula** | La **documentación**: forma, estructura, estados, trazabilidad | La **implementación**: código, estructura del repositorio, revisión |
> | **A quién obliga** | A todo documento del Blueprint | A todo cambio de código |
> | **Posición** | **Fuera** de la cadena; se aplica a todas las categorías | **Orden 8**, el último de la cadena |
> | **Naturaleza** | Norma propia sobre la forma documental | Derivada: solo traduce decisiones ajenas |
>
> **Un documento de implementación que selecciona tecnología para satisfacer un ADR es ADS** —así se clasificó ADS-02—, porque documenta una decisión y su justificación. **Un documento que convierte decisiones ya tomadas en reglas comprobables sobre el código es DEV.**

---

# Estados del Documento

Todo documento deberá encontrarse exactamente en uno de los siguientes estados.

Draft

Documento en construcción.

---

Review

Pendiente de revisión.

---

Approved

Documento aprobado.

Puede utilizarse oficialmente.

---

Deprecated

Documento reemplazado.

No debe utilizarse.

---

Archived

Documento conservado únicamente con fines históricos.

---

# Estructura Obligatoria

Todos los documentos oficiales deberán contener, cuando aplique, las siguientes secciones.

1. Portada
2. Historial de versiones
3. Tabla de contenido
4. Resumen ejecutivo
5. Objetivos
6. Alcance
7. Desarrollo
8. Decisiones importantes
9. Riesgos
10. KPIs
11. Dependencias
12. Glosario
13. Referencias
14. Anexos

La omisión de alguna sección deberá estar justificada por la naturaleza del documento.

---

# Portada Oficial

Toda portada deberá contener como mínimo:

- Nombre del documento.
- Código.
- Versión.
- Estado.
- Clasificación.
- Fecha de creación.
- Última actualización.
- Responsable.
- Nivel de confidencialidad.

---

# Convenciones de Escritura

Toda documentación deberá cumplir las siguientes normas.

## Lenguaje

Formal.

Profesional.

Preciso.

Libre de ambigüedades.

---

## Voz

Institucional.

No utilizar opiniones personales.

No utilizar lenguaje coloquial.

---

## Terminología

Un concepto tendrá un único nombre oficial.

Por ejemplo:

Siempre "Opportunity Score".

Nunca alternar con:

Lead Score.

Business Score.

Company Rating.

---

# Referencias Cruzadas

Cuando un documento haga referencia a otro deberá citarlo explícitamente.

Ejemplo:

(AF-00, Principio 4)

(APS-02, RF-014)

(ADR-003)

Esto permite rastrear el origen de cada decisión.

---

# Diagramas

Todo diagrama deberá incluir:

- título;
- identificador;
- versión;
- fecha de actualización.

Los diagramas deberán ser coherentes con el contenido del documento y mantenerse actualizados.

---

# Control de Cambios

Cada modificación deberá registrarse indicando:

- versión;
- fecha;
- responsable;
- descripción del cambio;
- motivo.

Nunca se sobrescribirá el historial.

---

# Definition of Ready (DoR)

Un documento estará listo para comenzar su redacción únicamente cuando:

- exista un objetivo definido;
- se conozca su alcance;
- exista información suficiente para desarrollarlo;
- las decisiones estratégicas relacionadas ya estén aprobadas.

---

# Definition of Done (DoD)

Un documento solo podrá considerarse terminado cuando:

- haya sido revisado;
- tenga trazabilidad;
- mantenga consistencia con el resto del Product Book;
- supere la evaluación de calidad;
- haya sido aprobado oficialmente.

---

# AKVEZ Quality Score (AQS)

Todo documento será evaluado utilizando el siguiente modelo.

| Criterio | Peso |
| --- | --- |
| Claridad | 20% |
| Completitud | 20% |
| Implementabilidad | 20% |
| Consistencia | 15% |
| Escalabilidad | 15% |
| Calidad editorial | 10% |

Resultado:

95–100 → Excelente.

90–94 → Muy bueno.

80–89 → Revisión obligatoria.

Menor de 80 → No aprobado.

---

# Colaboración con Inteligencia Artificial

Toda IA que participe en el proyecto deberá respetar las siguientes reglas:

- No inventar requisitos.
- No modificar documentos aprobados sin registrar una nueva versión.
- Mantener la trazabilidad entre documentos.
- Señalar contradicciones en lugar de resolverlas por cuenta propia.
- Justificar las decisiones técnicas.
- Respetar la terminología oficial de AKVEZ.
- Conservar el tono institucional.

---

# Gobernanza Documental

La documentación oficial constituye una fuente de verdad del proyecto.

Toda modificación deberá:

1. Identificar el documento afectado.
2. Justificar el cambio.
3. Actualizar el historial de versiones.
4. Revisar referencias cruzadas.
5. Ser aprobada antes de entrar en vigor.

---

# Visión a Largo Plazo

La documentación de AKVEZ no existe únicamente para acompañar el desarrollo de la versión actual del producto.

Existe para preservar el conocimiento de la organización, facilitar la incorporación de nuevos miembros al equipo y garantizar que las decisiones importantes permanezcan comprensibles con el paso del tiempo.

Cada documento deberá contribuir a ese objetivo.