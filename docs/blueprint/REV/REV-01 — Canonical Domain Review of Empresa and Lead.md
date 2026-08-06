# REV-01 — Revisión Arquitectónica del Dominio Canónico: Empresa y Lead

| Campo | Valor |
| --- | --- |
| Código | REV-01 |
| Clasificación | Revisión Arquitectónica — Dominio |
| Versión | 1.1 |
| Estado | **Archived** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Estándar aplicado | ADS-00 v1.2 |
| Alcance de la búsqueda | 17 documentos APS · 11 ADR · ADS-00 · 3 AF |
| Autoridad vigente sobre esta materia | **PO-01** · APS-07 v2.0 · APS-03 v3.0 |

> **Naturaleza del documento.** No es un ADR y no decide nada. Es un informe de evidencia. Cada afirmación cita documento, sección y texto literal. Donde la evidencia no alcanza, se declara.

---

> # ⚠ Documento archivado — Registro histórico
>
> **Este documento fue archivado tras la aprobación de PO-01.**
>
> **Se conserva exclusivamente con fines históricos y de trazabilidad.** Es el inventario de evidencia que documentó las contradicciones del Blueprint sobre el dominio Empresa → Lead. **Sustituido por PO-01.**
>
> **No es autoridad vigente. No debe utilizarse para diseñar arquitectura ni para fundamentar ninguna decisión.**
>
> **Advertencia específica.** Sus tablas de evidencia citan **literalmente** definiciones de APS-02, APS-03 y APS-07 que fueron **derogadas** el 2026-07-29. Esas citas se conservan porque son la **prueba** de las contradicciones que el documento identificó; **no describen el Blueprint vigente**. Su §9 («Definición Canónica Propuesta») fue una propuesta, nunca una decisión, y quedó sustituida por PO-01 §1-§4.
>
> **Autoridad vigente:**
>
> | Materia | Documento vigente |
> | --- | --- |
> | Definición de Empresa, Lead y Biblioteca | **PO-01 §1-§4** · APS-07 v2.0 §5, §8 |
> | Evento que convierte una Empresa en Lead | **PO-01 §3** · APS-07 v2.0 §7.1 |
> | Ausencia de Top N y de umbral | **PO-01 §6, §7** · APS-08 v1.1 §8.6 |
> | Preguntas abiertas de §8 | **Resueltas por PO-01.** Ninguna sigue abierta |
>
> **Qué conserva valor.** El inventario exhaustivo de evidencia y su clasificación por niveles de confianza. Documenta **qué decía el Blueprint** antes de la consolidación, con cita literal — un registro que ningún otro documento reproduce.
>
> **Ninguna sección ha sido eliminada, reescrita ni renumerada.**

---

> ## Nota de excepción — Estado anterior no contemplado
>
> Este documento declaraba el estado **`Informe`**, que **no pertenece** a la clasificación oficial de ADS-00 (*Estados del Documento*): `Draft` · `Review` · `Approved` · `Deprecated` · `Archived`.
>
> Su normalización a `Archived` fue una **decisión excepcional del Product Office**, ejecutada en la Fase 3 de PLAN-01. Al no ser `Informe` un estado reconocido, `AF-01-DIAG-001` no define transición alguna desde él. **No constituye precedente.**
>
> Corresponde a las deudas **DT-01** (ADR-10, nota de excepción) y **H-07** (REV-03 §4), cuyo alcance se extiende ahora a este documento. Conforme a ADS-00 v1.2 **R-6**, quedan elevadas al Product Office.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | AKVEZ Architecture Team | Redacción inicial. Inventario exhaustivo de evidencia sobre el dominio Empresa → Lead en 17 APS, 11 ADR, ADS-00 y 3 AF, con clasificación por niveles de confianza y diez preguntas de dominio. | Determinar qué afirmaba realmente el Blueprint sobre Empresa, Lead y Biblioteca de Leads, ante conclusiones divergentes entre ADR-10 y ADR-11. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Cambio de estado documental: `Informe` → `Archived`.** Se añaden la nota de archivo, la nota de excepción, este historial y la actualización de referencias en §11. **No se modifica ningún contenido histórico:** ninguna sección eliminada, reescrita ni renumerada. | Fase 3 de PLAN-01, cierre del hallazgo **H-06** de REV-03, y normalización del estado inexistente registrado como **H-07**. La materia quedó decidida por **PO-01** (Approved, 2026-07-29). |

---

# 1. Inventario Completo de Evidencia

Búsqueda exhaustiva sobre todo el Blueprint de los términos *Empresa, Lead, Opportunity, Biblioteca de Leads, Registro, Descubrimiento, Evaluación, Opportunity Score, Pipeline, Prospecto*.

## 1.1 Definiciones de entidad

| # | Documento | Sección | Cita literal |
| --- | --- | --- | --- |
| E-1 | APS-07 | §5 | «**Empresas** — Información pública sobre negocios.» |
| E-2 | APS-07 | §5 | «**Leads** — Empresas identificadas como oportunidades comerciales.» |
| E-3 | APS-02 | Glosario | «**Lead:** Empresa identificada como posible cliente.» |
| E-4 | **ADR-05** | **§10** | «**Lead** — Representa una oportunidad comercial. Campos: `id`, `businessName`, `industry`, `location`, `website`, `socialLinks`, `opportunityScore`, `classification`, `status`, `createdAt`, `updatedAt`.» |
| E-5 | APS-07 | §5 | «**Análisis** — Resultados producidos por Lead Analyzer.» |
| E-6 | APS-07 | §5 | «**Opportunity Scores** — Evaluaciones numéricas del potencial comercial.» |

## 1.2 Modelo conceptual y ciclo de vida

| # | Documento | Sección | Cita literal |
| --- | --- | --- | --- |
| M-1 | APS-07 | §6 | «Cada **empresa evolucionará** progresivamente dentro del sistema.» |
| M-2 | APS-07 | §6 | `Empresa ↓ Lead ↓ Lead Analizado ↓ Opportunity Score ↓ Pitch ↓ Cliente Potencial ↓ Cliente Confirmado` |
| M-3 | APS-07 | §6 | «Cada transición agregará nuevo conocimiento **sin reemplazar la información anterior**.» |
| M-4 | APS-07 | §7 | «Todo lead recorrerá las siguientes etapas»: Descubrimiento · Registro · Análisis · Evaluación · Propuesta |
| M-5 | APS-07 | §7 | «**Descubrimiento** — La empresa es encontrada por Lead Hunter.» |
| M-6 | APS-07 | §7 | «**Registro** — La empresa se almacena en la Biblioteca de Leads.» |
| M-7 | APS-07 | §7 | «**Análisis** — Lead Analyzer genera información adicional.» |
| M-8 | APS-07 | §7 | «**Evaluación** — Se calcula el Opportunity Score.» |
| M-9 | APS-07 | §7 | «**Propuesta** — Pitch Generator produce una propuesta comercial.» |

## 1.3 Responsabilidades de agentes

| # | Documento | Sección | Cita literal |
| --- | --- | --- | --- |
| R-1 | APS-03 | §7 | Lead Hunter: «Buscar empresas · Obtener información pública · Detectar posibles duplicados · **Registrar nuevas empresas en la Biblioteca de Leads** · Entregar un conjunto estructurado de empresas al siguiente agente» |
| R-2 | APS-03 | §7 | Lead Hunter, Salidas: «Lista estructurada de **empresas candidatas**.» |
| R-3 | APS-03 | §7 | Lead Analyzer, Objetivo: «Evaluar el potencial comercial de cada empresa.» |
| R-4 | APS-03 | §7 | Lead Analyzer: «… **Calcular el Opportunity Score** · Generar observaciones relevantes» |
| R-5 | APS-03 | §7 | Lead Analyzer, Salidas: «**Lead completamente analizado**.» |
| R-6 | APS-03 | §8 | «3. Lead Hunter **consulta** la Biblioteca de Leads para evitar duplicados. 4. **Las nuevas empresas** pasan al Lead Analyzer.» |
| R-7 | APS-03 | Glosario | «**Lead Analyzer:** Agente encargado del análisis **y priorización** de oportunidades.» |
| R-8 | APS-02 | Glosario | «**Lead Hunter:** Agente responsable de descubrir **y analizar** empresas.» |
| R-9 | **ADR-05** | **§12** | Lead Hunter, *Después:* «Buscar ↓ Consultar duplicados ↓ **Guardar nuevos leads** ↓ Devolver resultados» |
| R-10 | **ADR-05** | **§12** | Lead Analyzer, *Después:* «Analizar ↓ Guardar análisis ↓ **Actualizar lead**» |
| R-11 | ADR-05 | §11 | LeadRepository: «Responsabilidad: **guardar leads**, buscar leads, actualizar estados.» |

## 1.4 Biblioteca de Leads

| # | Documento | Sección | Cita literal |
| --- | --- | --- | --- |
| B-1 | APS-07 | §8 | «La Biblioteca de Leads constituye el núcleo del conocimiento de AKVEZ. Su función es evitar duplicados y **conservar el historial completo de cada empresa**.» |
| B-2 | APS-07 | §8 | «Cada registro **deberá incluir**, como mínimo: Identificador único · Nombre · Categoría · Ubicación · Sitio web · Información de contacto · **Estado del análisis** · **Opportunity Score** · **Fecha de descubrimiento** · Fecha de última actualización · Historial de modificaciones.» |
| B-3 | APS-02 | §6 | «**Biblioteca de Leads** — Almacenamiento persistente de empresas **ya analizadas** para evitar duplicados y conservar el historial.» |
| B-4 | APS-02 | Glosario | «Base de conocimiento que almacena empresas **previamente analizadas**.» |
| B-5 | APS-03 | Glosario | «Repositorio persistente donde se almacenan las empresas **ya procesadas**.» |
| B-6 | APS-07 | Glosario | «Repositorio central donde se almacena el historial de **empresas analizadas**.» |
| B-7 | APS-02 | §9 | Criterio de éxito V1: «la Biblioteca de Leads **evite correctamente los duplicados**.» |

## 1.5 Priorización y puntuación

| # | Documento | Sección | Cita literal |
| --- | --- | --- | --- |
| P-1 | APS-01 | §5 | Problemas resueltos: «**baja priorización de oportunidades**» · «pérdida de tiempo en empresas con baja probabilidad de conversión» |
| P-2 | APS-01 | §6 | «qué empresas representan **las mejores oportunidades**» |
| P-3 | APS-08 | §7 | «El Opportunity Score se expresará en una escala de **0 a 100 puntos**.» |
| P-4 | APS-08 | §8 | 90-100 «Oportunidad Excelente. Alta prioridad. **Debe aparecer entre los primeros resultados.**» |
| P-5 | APS-08 | §8 | Define cinco bandas: 90-100 · 75-89 · 60-74 · **40-59 «Oportunidad Baja»** · **0-39 «Oportunidad Muy Baja»** |
| P-6 | APS-08 | §6.6 | «El sistema evaluará si el tipo de empresa coincide con el perfil profesional del usuario.» |
| P-7 | APS-08 | Glosario | «**Opportunity Score:** Indicador numérico que representa el potencial comercial de **una empresa**.» |

## 1.6 Términos sin contenido de dominio

| Término | Resultado de la búsqueda |
| --- | --- |
| **Prospecto** | Una única aparición en el Blueprint: ADR-05 §12, en una descripción del estado *anterior* del sistema («*Antes:* Analizar prospecto»). **No es término del dominio canónico.** |
| **Pipeline** | APS-05 §227 («Pipeline comercial») y ADR-05 §13, ambos referidos a **fases posteriores a la V1**. Sin definición. |
| **AF-00 / AF-01 / AF-02** | Usan «empresa» en sentido coloquial (organización), nunca como entidad de dominio. **Sin aporte.** |
| **Estados del Lead** | **Ninguna enumeración de estados existe en el Blueprint.** ADR-05 §10 declara un campo `status`, sin valores. |

---

# 2. Definiciones Encontradas, Agrupadas

## Grupo 1 — Empresa *(consistente)*

Una sola definición, sin contradicción: **E-1**. Ningún documento la contradice ni la matiza.

## Grupo 2 — Lead *(consistente en la definición)*

Tres definiciones independientes, **mutuamente compatibles**:

- **E-2** «Empresas identificadas como oportunidades comerciales» *(APS-07)*
- **E-3** «Empresa identificada como posible cliente» *(APS-02)*
- **E-4** «Representa una oportunidad comercial» *(ADR-05)*

Las tres coinciden: un Lead es una Empresa a la que se ha atribuido condición de oportunidad comercial. **No hay contradicción sobre qué es un Lead.** La contradicción está en *cuándo* se le atribuye esa condición.

## Grupo 3 — Biblioteca de Leads *(contradictorio)*

- **Registro desde el descubrimiento:** B-1, B-2, M-6, R-1, R-6, R-9
- **Registro posterior al análisis:** B-3, B-4, B-5, B-6

---

# 3. Matriz de Contradicciones

| # | Contradicción | Documentos enfrentados | Demostración |
| --- | --- | --- | --- |
| **X-1** | ¿Lead Hunter guarda **empresas** o **leads**? | **R-1** «Registrar nuevas **empresas**» *(APS-03 §7)* **vs R-9** «Guardar nuevos **leads**» *(ADR-05 §12)* | Misma operación, mismo agente, sustantivo distinto. **Contradicción directa e irreducible por interpretación.** |
| **X-2** | ¿La Biblioteca contiene todo lo descubierto o solo lo analizado? | **B-1, B-2** *(APS-07 §8)* **vs B-3, B-4, B-5, B-6** | B-1 dice «historial **completo** de cada empresa»; B-3 dice «empresas **ya analizadas**». Proposiciones incompatibles sobre el mismo conjunto. |
| **X-3** | ¿Lead Hunter analiza? | **R-8** «descubrir **y analizar**» *(APS-02 Glosario)* **vs R-1/R-3** *(APS-03 §7)* | APS-03 §7 no incluye análisis entre las responsabilidades de Lead Hunter y se lo asigna al Lead Analyzer. |
| **X-4** | ¿La Evaluación precede o sigue al Análisis? | **M-4, M-8** *(APS-07 §7: Análisis → Evaluación)* **vs ADR-02 §8** *(`Lead Hunter → Scoring → …`, sin Lead Analyzer)* | Orden incompatible. |
| **X-5** | ¿El Opportunity Score puntúa una Empresa o un Lead? | **P-7** «de una **empresa**» *(APS-08)* **vs** APS-02/APS-03 Glosarios «de un **lead**» | Sujeto distinto para el mismo indicador. |
| **X-6** | ¿El Lead Analyzer prioriza? | **R-7** «análisis **y priorización**» *(APS-03 Glosario)* **vs R-4** *(APS-03 §7: no la enumera)* | Contradicción **interna a APS-03**. |
| **X-7** | El activo se llama «Biblioteca de **Leads**» pero R-1 y M-6 dicen que almacena **empresas** | APS-07 §8 · APS-03 §7 | El nombre no describe el contenido declarado. |

**X-1 es la contradicción central**: es la única que versa directamente sobre el evento que transforma una Empresa en Lead.

---

# 4. Respuestas a las Once Preguntas

| # | Pregunta | Respuesta | Evidencia | Confianza |
| --- | --- | --- | --- | --- |
| 1 | Definición de Empresa | «Información pública sobre negocios» | E-1 | **Demostrado** |
| 2 | Definición de Lead | «Empresa identificada como oportunidad comercial / posible cliente» | E-2, E-3, E-4 (concordantes) | **Demostrado** |
| 3 | ¿Qué evento transforma Empresa en Lead? | **No existe respuesta única declarada.** Ver §5 | — | **Vacío documental** |
| 4 | ¿Qué evento produce Lead Analizado? | El **Análisis**, ejecutado por Lead Analyzer | M-4, M-7, R-5 | **Demostrado** |
| 5 | ¿Qué evento produce Opportunity Score? | La **Evaluación**, ejecutada por Lead Analyzer | M-8, R-4, P-3 | **Demostrado** |
| 6 | ¿Qué representa la Biblioteca de Leads? | «El núcleo del conocimiento de AKVEZ … el historial completo de cada empresa» | B-1 | **Demostrado en su función**; su **contenido** está en contradicción X-2 |
| 7 | ¿Algún documento exige que un Lead esté analizado? | **NO.** Búsqueda exhaustiva: ninguno. En contra: M-2 sitúa `Lead` **antes** de `Lead Analizado`; R-9 y R-10 muestran al Lead existiendo antes del análisis | M-2, R-9, R-10 | **Demostrado (negativo)** |
| 8 | ¿Algún documento exige superar un umbral? | **NO.** APS-08 §8 clasifica en cinco bandas pero **no declara ningún umbral de cualificación**; sus dos bandas inferiores describen oportunidades que siguen siendo oportunidades | P-5 | **Demostrado (negativo)** |
| 9 | ¿Algún documento exige pertenecer a un Top N? | **NO. No existe ninguna referencia a un Top N, cupo o cantidad máxima en todo el Blueprint** | Búsqueda exhaustiva sobre 17 APS + 11 ADR | **Demostrado (negativo)** |
| 10 | ¿Algún documento exige tener Opportunity Score? | **NO como requisito.** E-4 y B-2 lo listan como **campo**, no como condición de existencia. M-2 lo sitúa **dos estados después** del Lead | E-4, B-2, M-2 | **Demostrado (negativo)** |
| 11 | Línea temporal completa | Ver §6 | — | Mixta |

---

# 5. El Evento Empresa → Lead

## 5.1 Demostración de que no existe declaración explícita

Se examinaron todos los pasajes que describen el recorrido de una Empresa:

| Fuente | Qué declara | ¿Declara la transición? |
| --- | --- | --- |
| APS-07 §6 (M-2) | Que `Lead` sigue a `Empresa` | **No.** Declara el orden, no el evento |
| APS-07 §7 (M-4…M-9) | Cinco etapas | **No.** Ninguna etapa se llama «Cualificación», y ninguna produce el estado `Lead` |
| APS-03 §7 (R-1…R-5) | Responsabilidades de los tres agentes | **No.** Ninguna menciona cualificar |
| APS-03 §8 (R-6) | Seis pasos del flujo | **No.** |
| APS-08 (P-3…P-6) | Modelo de puntuación y cinco bandas | **No.** Clasifica oportunidades ya existentes |
| ADR-05 §10, §12 (E-4, R-9) | Modelo y operaciones | **No.** Usa «lead» sin definir cuándo lo es |

**Conclusión: el Blueprint no contiene ninguna declaración del evento que transforma una Empresa en Lead.** Esto no es interpretación: es la ausencia verificada de un enunciado en el conjunto completo de documentos que describen el recorrido.

## 5.2 Convergencia de evidencia indirecta

Aunque no hay declaración, la evidencia **converge** hacia el **Registro**:

| # | Evidencia a favor del Registro | Peso |
| --- | --- | --- |
| 1 | **R-9** *(ADR-05 §12)*: Lead Hunter «**Guardar nuevos leads**». Lo que Lead Hunter guarda ya se denomina *lead*, antes de cualquier análisis | **Alto** — es el enunciado más directo del Blueprint sobre qué se guarda |
| 2 | **R-10** *(ADR-05 §12)*: Lead Analyzer «**Actualizar** lead». Actualizar presupone existencia previa | **Alto** |
| 3 | **R-11** *(ADR-05 §11)*: LeadRepository «guardar **leads**» | Medio |
| 4 | **M-2** *(APS-07 §6)*: `Lead` precede a `Lead Analizado` y a `Opportunity Score` | **Alto** |
| 5 | **E-3** *(APS-02)*: «posible cliente» — umbral cualitativo bajo, satisfacible sin análisis | Medio |
| 6 | El activo se denomina «Biblioteca de **Leads**» y el Registro escribe en él (M-6) | Medio |

**Evidencia en contra:** R-1 y R-2 *(APS-03 §7)* llaman «empresas» y «empresas candidatas» a lo que Lead Hunter registra y entrega. Es la contradicción X-1.

## 5.3 Evaluación

Cinco de las seis evidencias convergentes apuntan al Registro; la evidencia contraria procede de un solo documento (APS-03 §7) y se limita a la elección del sustantivo, sin negar el momento.

**Nivel: inferencia fuerte. No demostrado.** Una inferencia fuerte no es una definición canónica: mientras X-1 no se resuelva formalmente, la transición carece de fundamento citable.

> **Corrección a DP-01 §6.** Aquel documento calificó la hipótesis «al registrarse» como de viabilidad **Baja-Media**, por no haber examinado ADR-05 §10-§12. Con R-9, R-10 y R-11 incorporadas, **es la hipótesis mejor sostenida**, y las hipótesis C (al analizarse) y D (al superar un umbral) quedan refutadas por M-2, R-9 y R-10.

---

# 6. Línea Temporal del Dominio

```text
Empresa
   │
   │  ¿QUÉ OCURRE?  ──►  NO DECLARADO EN EL BLUEPRINT
   │                     Inferencia fuerte: el REGISTRO por Lead Hunter
   │                     (R-9 «Guardar nuevos leads», M-2, R-10)
   │                     Contradicción abierta X-1 (R-1 dice «empresas»)
   ▼
Lead
   │
   │  ¿QUÉ OCURRE?  ──►  ANÁLISIS, ejecutado por Lead Analyzer
   │                     DEMOSTRADO — M-4, M-7, R-5
   ▼
Lead Analizado
   │
   │  ¿QUÉ OCURRE?  ──►  EVALUACIÓN: cálculo del Opportunity Score (0-100)
   │                     DEMOSTRADO — M-8, R-4, P-3
   │                     Contradicción abierta X-4 sobre su orden
   ▼
Opportunity Score
   │
   │  ¿QUÉ OCURRE?  ──►  PROPUESTA, generada por Pitch Generator
   │                     DEMOSTRADO — M-9, R-6
   ▼
Pitch
```

**Tres de las cuatro transiciones están demostradas. La primera no.**

---

# 7. Vacíos Documentales

| # | Vacío | Consecuencia |
| --- | --- | --- |
| V-1 | **El evento de cualificación `Empresa → Lead` no está declarado** | Es el origen documental de todas las decisiones contradictorias posteriores |
| V-2 | **La Biblioteca no tiene criterio de admisión declarado** | B-1 describe su función, B-2 la estructura del registro, R-1 la operación de escritura; ninguno la condición de entrada |
| V-3 | **No existe enumeración de estados del Lead** | ADR-05 §10 declara el campo `status` sin valores posibles |
| V-4 | **APS-08 no declara umbral de cualificación** | Define cinco bandas y su prioridad relativa, pero no qué banda constituye una oportunidad válida |
| V-5 | **El Blueprint carece de jerarquía documental declarada** | Ninguna contradicción puede resolverse formalmente. Verificado en INDEX, ADS-00 y AF-00 |

---

# 8. Preguntas Abiertas

| # | Pregunta | Requiere decisión de | Bloquea |
| --- | --- | --- | --- |
| Q-1 | ¿Qué evento transforma una Empresa en Lead? | Product Office | ADR-10, ADR-10A, ADR-11 |
| Q-2 | X-1: ¿Lead Hunter guarda empresas o leads? | Product Office | Q-1 |
| Q-3 | X-2: ¿Qué contiene la Biblioteca? | Product Office | ADR-10 |
| Q-4 | X-4: ¿La Evaluación precede o sigue al Análisis? | Arquitectura + Product Office | Orden canónico |
| Q-5 | V-5: ¿Cuál es la jerarquía documental? | Product Office | Toda resolución futura |

---

# 9. Definición Canónica Propuesta

Se propone **únicamente lo demostrable**.

## 9.1 Demostrado — apto para uso canónico

> **Empresa** — Información pública sobre negocios. *(APS-07 §5)*
> **Confianza: Demostrado.** Fuente única, sin contradicción.

> **Lead** — Empresa identificada como oportunidad comercial. *(APS-07 §5; APS-02 Glosario; ADR-05 §10)*
> **Confianza: Demostrado.** Tres fuentes independientes y concordantes.

> **Empresa y Lead son estados de un mismo sujeto, no entidades distintas.** *(APS-07 §6: «cada empresa evolucionará»; M-3)*
> **Confianza: Demostrado.**

> **Un Lead no requiere estar analizado, ni superar umbral, ni pertenecer a un Top N, ni poseer Opportunity Score.** *(Preguntas 7-10; demostraciones negativas por búsqueda exhaustiva)*
> **Confianza: Demostrado.**

> **Las transiciones son acumulativas.** *(APS-07 §6, M-3)*
> **Confianza: Demostrado.**

## 9.2 No demostrable — no apto para uso canónico

> **El evento que transforma una Empresa en Lead.**
> **Confianza: Inferencia fuerte hacia el Registro (§5.2). No demostrado.**
> **No debe adoptarse como definición canónica** hasta que el Product Office resuelva X-1.

---

# 10. Niveles de Confianza — Resumen

| Conclusión | Nivel |
| --- | --- |
| Definición de Empresa | **Demostrado** |
| Definición de Lead | **Demostrado** |
| Empresa y Lead son un mismo sujeto en distintos estados | **Demostrado** |
| Un Lead no requiere análisis / umbral / Top N / score | **Demostrado (negativo)** |
| El Análisis produce el Lead Analizado | **Demostrado** |
| La Evaluación produce el Opportunity Score | **Demostrado** |
| La Propuesta produce el Pitch | **Demostrado** |
| El Blueprint no declara el evento de cualificación | **Demostrado (negativo)** |
| La cualificación ocurre en el Registro | **Inferencia fuerte** |
| La Biblioteca registra desde el descubrimiento | **Inferencia fuerte** *(B-1, B-2, M-6, R-1, R-6, R-9 frente a B-3…B-6)* |
| «Estado del análisis» prueba la existencia de registros no analizados | **Interpretación** *(clasificado en DP-01 §4; se mantiene)* |
| El orden Análisis → Evaluación | **Indeterminado** *(X-4)* |

---

# 11. Referencias

## 11.1 Autoridad vigente (v1.1)

Documentos que **sustituyen** a éste y deben consultarse en su lugar:

- **PO-01** — Decisión de Producto: Definición Canónica de Lead §1-§8.
- **APS-07 v2.0** §5, §6.3, §7, §8, §16 · **APS-03 v3.0** §7, §8.1, §8.2 · **APS-02 v2.1** §6, §15 · **APS-08 v1.1** §8.6.
- **ADR-10A v2.0** · **ADR-11 v2.0** · **ADR-12** · **ADR-13** · **ADR-14**.
- **PLAN-01** §7 (Fase 3) · **REV-03** (H-06, H-07) · **ADS-00 v1.2**.

## 11.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-02, APS-03, APS-04, APS-07 y APS-08 remiten a las versiones vigentes en 2026-07-28, hoy corregidas. **ADR-10 se encuentra `Archived` desde el 2026-07-29.**

APS-01 §5, §6 · APS-02 §6, §9, Glosario · APS-03 §7, §8, Glosario · APS-04 Glosario · APS-05 §fase posterior · APS-07 §5, §6, §7, §8, Glosario · APS-08 §6.6, §7, §8, Glosario · ADR-02 §8 · **ADR-05 §10, §11, §12** · ADR-10 · ADR-10A · ADR-11 · DP-01 · ADS-00 · AF-00, AF-01, AF-02
