# APS-02 — Product Scope

## APS-02 — Product Scope

**Versión:** 2.1

**Estado:** Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Estándar Aplicado:** ADS-00

**Autoridad de dominio:** PO-01 · APS-07 v2.0 (Approved)

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | — | AKVEZ Product Office | Definición inicial del alcance del producto. | Establecer el alcance de la V1. |
| 2.0 | — | AKVEZ Product Office | Reestructuración completa bajo el estándar ADS-00. | Cumplimiento del estándar documental. |
| 2.1 | 2026-07-29 | AKVEZ Product Office | **Consolidación de dominio.** Se corrigen §6 (Biblioteca de Leads), §8 (FR-008) y §15 (Glosario: Lead, Lead Hunter, Biblioteca de Leads). **El resto del documento permanece intacto:** no se altera el alcance, ni los objetivos, ni las funcionalidades incluidas o excluidas, ni los requisitos, ni las restricciones, ni los criterios de éxito o de salida. | Fase 1 de PLAN-01. Las definiciones de Lead y de Biblioteca de Leads de la v2.0 quedaron derogadas por PO-01 §2 y §4 y por APS-07 v2.0 §5 y §8. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Propósito del Documento
3. Definición del Alcance
4. Objetivos de la V1
5. Principios del Alcance
6. Funcionalidades Incluidas
7. Funcionalidades Excluidas
8. Requisitos Funcionales
9. Requisitos No Funcionales
10. Restricciones del Producto
11. Criterios de Éxito
12. Criterios de Salida de la V1
13. Riesgos
14. Dependencias
15. Glosario
16. Referencias
17. Evaluación AQS

---

# 1. Resumen Ejecutivo

Este documento define el alcance oficial de la primera versión de AKVEZ.

Su propósito es establecer con precisión qué resolverá el producto durante la etapa inicial de validación, qué capacidades estarán disponibles para los usuarios y qué funcionalidades quedarán deliberadamente fuera del lanzamiento.

La V1 no pretende construir una plataforma completa de ventas.

Su objetivo es validar una hipótesis concreta:

**La inteligencia artificial puede ayudar a un diseñador web a encontrar mejores oportunidades comerciales en menos tiempo que los métodos tradicionales.**

Todas las decisiones de producto deberán alinearse con esta hipótesis.

---

# 2. Propósito del Documento

Este documento existe para eliminar ambigüedades sobre el alcance del producto.

Define:

- qué construirá AKVEZ;
- qué no construirá;
- cuáles son las prioridades;
- cuáles son los límites de la primera versión;
- cuándo una funcionalidad debe considerarse fuera del alcance.

Su objetivo es mantener el enfoque del equipo durante toda la etapa de desarrollo.

---

# 3. Definición del Alcance

La primera versión de AKVEZ se enfocará exclusivamente en resolver la fase de descubrimiento y análisis de oportunidades comerciales para diseñadores web independientes.

El producto finalizará su responsabilidad una vez entregue al usuario un lead analizado, priorizado y acompañado de una propuesta comercial inicial.

Las etapas posteriores del proceso comercial permanecerán fuera del alcance de esta versión.

---

# 4. Objetivos de la V1

La primera versión deberá permitir que un usuario pueda:

- descubrir empresas con potencial de convertirse en clientes;
- analizar automáticamente su presencia digital;
- identificar oportunidades de mejora;
- conocer el nivel de prioridad de cada empresa mediante un Opportunity Score;
- generar una propuesta comercial personalizada;
- conservar un historial de los leads encontrados.

El éxito de la V1 dependerá de ejecutar estas funciones de manera sencilla, confiable y consistente.

---

# 5. Principios del Alcance

El alcance de AKVEZ estará guiado por los siguientes principios:

## 5.1 Enfoque antes que amplitud

Es preferible resolver perfectamente un problema específico que resolver parcialmente muchos problemas.

---

## 5.2 Validación antes que expansión

Ninguna funcionalidad será incorporada únicamente porque sea técnicamente posible.

Toda expansión deberá justificarse mediante evidencia obtenida del uso real del producto.

---

## 5.3 Simplicidad operativa

Cada nueva característica añadirá complejidad.

Solo permanecerán aquellas cuyo valor para el usuario sea claramente superior al costo de mantenerlas.

---

## 5.4 Arquitectura preparada para crecer

Aunque la V1 tendrá un alcance reducido, la arquitectura deberá facilitar futuras ampliaciones sin requerir una reconstrucción completa del sistema.

---

# 6. Funcionalidades Incluidas

La primera versión de AKVEZ incluirá las siguientes capacidades:

## Descubrimiento de empresas

Obtención automatizada de negocios utilizando Google Maps como fuente principal.

---

## Biblioteca de Leads

Almacenamiento persistente de **todas** las Empresas descubiertas para el usuario, cada una con su conocimiento acumulado, para evitar duplicados y conservar el historial.

Todo lo que contiene es, por definición, un Lead: el Registro en la Biblioteca es precisamente el evento que convierte una Empresa en Lead (APS-07 v2.0 §8.1).

> **Definición derogada.** La versión 2.0 describía la Biblioteca como «Almacenamiento persistente de **empresas ya analizadas**». Esa descripción queda **sustituida** por la anterior, conforme a PO-01 §4. La Biblioteca no almacena solo las Empresas analizadas: almacena todas las descubiertas.

---

## Análisis de presencia digital

Evaluación automática de:

- existencia de sitio web;
- calidad general del sitio;
- información pública disponible;
- redes sociales asociadas;
- datos de contacto.

---

## Evaluación comercial

Análisis del potencial de cada empresa utilizando múltiples criterios definidos por AKVEZ.

---

## Opportunity Score

Asignación de una puntuación entre 0 y 100 que represente el potencial comercial del lead.

---

## Pitch Generator

Generación automática de una propuesta comercial personalizada basada en el análisis realizado.

---

## Gestión básica del historial

Visualización de oportunidades previamente descubiertas.

---

# 7. Funcionalidades Excluidas

Las siguientes capacidades no formarán parte de la primera versión:

- CRM.
- Automatización de seguimiento.
- Automatización de correos electrónicos.
- Agenda comercial.
- Gestión de contratos.
- Facturación.
- Integración con plataformas de ventas.
- Colaboración entre múltiples usuarios.
- Aplicación móvil.
- Dashboard financiero.
- Automatización completa del proceso comercial.
- Análisis de múltiples industrias con reglas específicas.

Estas funcionalidades podrán formar parte del roadmap futuro, pero no condicionarán el lanzamiento de la V1.

---

# 8. Requisitos Funcionales

La V1 deberá cumplir, como mínimo, los siguientes requisitos funcionales:

**FR-001** El usuario podrá iniciar una búsqueda de empresas.

**FR-002** El sistema analizará automáticamente cada empresa encontrada.

**FR-003** El sistema identificará si existe un sitio web.

**FR-004** El sistema recopilará información pública relevante.

**FR-005** El sistema calculará un Opportunity Score.

**FR-006** El sistema almacenará el resultado del análisis.

**FR-007** El usuario podrá consultar nuevamente un lead previamente descubierto.

**FR-008** El sistema evitará registrar por duplicado una Empresa ya presente en la Biblioteca de Leads.

> **Corrección terminológica (v2.1).** La v2.0 enunciaba «evitará mostrar empresas ya analizadas». La deduplicación opera sobre el contenido completo de la Biblioteca —todas las Empresas registradas—, no únicamente sobre las analizadas (PO-01 §3; APS-07 v2.0 §8.2). El alcance del requisito no varía.

**FR-009** El sistema generará una propuesta comercial inicial.

**FR-010** El usuario podrá visualizar toda la información recopilada antes de decidir contactar al cliente.

---

# 9. Requisitos No Funcionales

La primera versión deberá cumplir los siguientes estándares:

**NFR-001** Interfaz intuitiva.

**NFR-002** Tiempo de respuesta adecuado para mantener una experiencia fluida.

**NFR-003** Arquitectura modular basada en agentes.

**NFR-004** Escalabilidad para incorporar nuevos módulos.

**NFR-005** Persistencia de la información.

**NFR-006** Consistencia de los datos.

**NFR-007** Diseño preparado para futuras integraciones.

**NFR-008** Experiencia de usuario simple y sin fricción.

---

# 10. Restricciones del Producto

Durante la primera versión se establecen las siguientes restricciones:

- Google Maps será la única fuente principal de descubrimiento de empresas.
- El producto estará optimizado para diseñadores web.
- No existirá gestión comercial posterior al descubrimiento del lead.
- El Opportunity Score utilizará únicamente información disponible públicamente.
- La calidad del análisis dependerá de la disponibilidad de información pública.

Estas restricciones son deliberadas y responden al objetivo de validar la propuesta principal de valor.

---

# 11. Criterios de Éxito

La V1 será considerada exitosa si permite demostrar que los usuarios pueden descubrir oportunidades comerciales de forma más rápida y estructurada que mediante un proceso manual.

Se evaluarán indicadores como:

- cantidad de leads descubiertos;
- calidad promedio de los Opportunity Score;
- utilización del Pitch Generator;
- reutilización de la Biblioteca de Leads;
- satisfacción del usuario durante el proceso de descubrimiento.

---

# 12. Criterios de Salida de la V1

La primera versión podrá considerarse finalizada cuando:

- los tres agentes principales funcionen de forma estable;
- el flujo completo de descubrimiento esté operativo;
- el Opportunity Score produzca resultados consistentes;
- el Pitch Generator genere propuestas utilizables;
- la Biblioteca de Leads evite correctamente los duplicados;
- la fundadora haya validado el producto consiguiendo clientes reales mediante AKVEZ.

---

# 13. Riesgos

Los principales riesgos identificados son:

- Dependencia de Google Maps.
- Cambios en políticas de acceso a datos.
- Baja calidad de información pública.
- Opportunity Score poco preciso.
- Crecimiento prematuro del alcance.
- Incorporación excesiva de funcionalidades antes de validar la propuesta principal.

---

# 14. Dependencias

Este documento depende de:

- **PO-01 — Decisión Canónica de Lead.** Autoridad funcional del dominio.
- **APS-07 v2.0 — Data & Knowledge Architecture.** Referencia oficial del dominio Empresa → Lead.
- AF-00 — Constitución de AKVEZ.
- AF-01 — The AKVEZ Way.
- AF-02 — Product Manifesto.
- ADS-00 — Documentation Standard.
- APS-01 — Product Vision.

Los documentos posteriores deberán respetar el alcance definido aquí.

---

# 15. Glosario

Las definiciones del dominio proceden de APS-07 v2.0 §16, que reproduce PO-01. En caso de discrepancia prevalece APS-07.

**Empresa:** Negocio real que AKVEZ ha encontrado y sobre el que dispone de información pública. No pertenece a ningún usuario. *(PO-01 §1)*

**Lead:** Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto. No requiere análisis, puntuación ni umbral alguno. *(PO-01 §2)*

**Registro:** Evento por el que el Lead Hunter incorpora una Empresa a la Biblioteca de Leads del usuario, tras comprobar que no estaba ya presente. Es el **único** evento que convierte una Empresa en Lead. *(PO-01 §3)*

**Opportunity Score:** Valor numérico entre 0 y 100 que representa el potencial comercial de un Lead. Es un **atributo** del Lead: no lo crea, no lo promueve y no lo expulsa. *(PO-01 §5)*

**Lead Hunter:** Agente responsable de **descubrir y registrar** Empresas en la Biblioteca de Leads. No analiza, no juzga y no selecciona. *(APS-03 v3.0 §7.1)*

**Lead Analyzer:** Agente responsable del Análisis, la Evaluación y la ordenación de los Leads registrados. *(APS-03 v3.0 §7.2)*

**Pitch Generator:** Agente encargado de generar propuestas comerciales.

**Biblioteca de Leads:** Base de conocimiento que almacena **todas** las Empresas descubiertas para el usuario, cada una con su conocimiento acumulado. Todo su contenido es un Lead. *(PO-01 §4)*

**V1:** Primera versión pública del producto enfocada en validar la propuesta de valor.

> **Definiciones derogadas (v2.0).** «Lead: Empresa identificada como posible cliente» · «Lead Hunter: Agente responsable de descubrir **y analizar** empresas» · «Biblioteca de Leads: Base de conocimiento que almacena empresas **previamente analizadas**». Las tres quedan sustituidas conforme a PO-01 §2, §4 y a APS-03 v3.0 §7.1. El Lead Hunter nunca ha tenido responsabilidad de análisis: esa capacidad reside en el Lead Analyzer.

---

# 16. Referencias

- PO-01 — Decisión de Producto: Definición Canónica de Lead, §1, §2, §3, §4, §5.
- ADS-00 — Documentation Standard.
- APS-01 — Product Vision.
- APS-03 v3.0 — Agent Architecture, §7.1, §7.2.
- APS-04 — Human Interface System.
- APS-07 v2.0 — Data & Knowledge Architecture, §5, §8, §16.

---

# 17. Evaluación AQS

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