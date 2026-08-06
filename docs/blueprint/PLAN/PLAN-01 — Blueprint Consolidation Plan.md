# PLAN-01 — Plan de Consolidación del Blueprint

| Campo | Valor |
| --- | --- |
| Código | PLAN-01 |
| Clasificación | Plan de Consolidación Documental |
| Versión | 1.5 |
| Estado | Draft |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Autoridad de referencia | PO-01 |
| Estándar aplicado | ADS-00 |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | AKVEZ Architecture Team | Redacción inicial del plan de consolidación documental. | Integrar en el Blueprint las decisiones de PO-01 con la menor deuda documental posible. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Corrección terminológica.** Se sustituye el estado `Superseded` por `Archived` en §4 (tabla de documentos), §7 (criterio de finalización de la Fase 2) y §8 (Definition of Done, punto 4). Ningún otro contenido resulta afectado. | El estado `Superseded` **no pertenece** a la clasificación oficial de ADS-00 (*Estados del Documento*), que admite exactamente cinco: `Draft`, `Review`, `Approved`, `Deprecated` y `Archived`. PLAN-01 está fuera de la cadena de precedencia y no puede crear estados nuevos. Corrección documental P1.1 (inconsistencia C-3). |
| 1.2 | 2026-07-29 | AKVEZ Product Office | **Actualización de estado de ejecución.** Se añade §4.1 (avance por fase y por elemento) y el *Checklist de ejecución — Fase 2* con sus dos desviaciones documentadas (D-1 y D-2) dentro de §7. Se registra REV-03 como documento generado durante la ejecución. **No se modifica la planificación futura:** §4, §5, §6 y las Fases 0, 1, 3, 4 y 5 de §7 permanecen intactas, así como §8. | Sprint P1.3, alcance §4. Cierre de la Fase 2 de PLAN-01. |
| 1.5 | 2026-07-29 | AKVEZ Product Office | **Cierre definitivo de la consolidación documental.** Se registra la normalización final de los cinco estados documentales pendientes (ADR-05, AF-00, APS-01, APS-04, ATA-01) y se actualiza §4.1: Fase 4 al **100 %**, consolidación global al **100 %**, Fase 5 **habilitada**. **No se modifica la planificación futura:** §4, §5 y la Fase 5 de §7 permanecen intactas. | Sprint P1.6 — Normalización Documental Final. Cierre de los hallazgos **H-07** de REV-03 y **DM-1**, **DM-3** y **DM-6** de AR-02. |
| 1.4 | 2026-07-29 | AKVEZ Product Office | **Cierre de la Fase 4.** Se añade el *Checklist de ejecución — Fase 4* y el apartado de trabajo no ejecutado. Se actualiza §4.1 (Fase 4 al 97 %; los quince elementos de §4 ejecutados) y se registra **ADS-01** como documento adicional. **No se modifica la planificación futura:** §4, §5 y la Fase 5 de §7 permanecen intactas. | Sprint P1.5 (Fase 4). Cierre de la consolidación documental. Tres estados quedan sin normalizar por exceder el alcance autorizado. |
| 1.3 | 2026-07-29 | AKVEZ Product Office | **Cierre de la Fase 3.** Se añade el *Checklist de ejecución — Fase 3* con su desviación documentada (D-3) y la ampliación de la deuda DT-01. Se actualiza §4.1 (Fase 3 al 100 %; avance global 73 % → **93 %**), se declara cerrado el riesgo **R-3** de §6 y se marca cumplida la condición 5 de la Definition of Done. **No se modifica la planificación futura:** §4, §5 y las Fases 4 y 5 de §7 permanecen intactas. | Sprint P1.5, alcance §3. Cierre de la Fase 3 de PLAN-01 y del hallazgo **H-06** de REV-03. |

> **Naturaleza.** Plan de trabajo documental. No decide nada, no reabre ninguna investigación y no cuestiona PO-01, que se asume como decisión del Product Office. No modifica ningún documento: enumera qué debe modificarse, en qué orden y bajo qué criterio de finalización.

---

# 1. Objetivo

Integrar en el Blueprint las decisiones aprobadas sobre el dominio Empresa → Lead **con la menor deuda documental posible**.

La investigación produjo ocho documentos y una decisión de producto. Si esas decisiones se aplicasen de forma dispersa —cada documento cuando alguien tropiece con él— el Blueprint mantendría durante meses definiciones contradictorias entre secciones aprobadas, que es exactamente la situación que originó toda la investigación.

Este plan busca lo contrario: **una ventana de inconsistencia corta, ordenada y con criterio de cierre explícito**, tras la cual el Blueprint vuelva a ser internamente coherente.

---

# 2. Inventario Documental

| Documento | Estado | Resultado |
| --- | --- | --- |
| **ADR-10** — Ubicación de la Persistencia | Requiere revisión | Su decisión sobre posición y alcance del Registro queda **sustituida** por PO-01 §3, §4 y §8. Conservan valor su planteamiento del problema y su análisis de la Opción B |
| **ADR-10A** — Definición Canónica de Empresa y Lead | Requiere revisión | Sus definiciones quedan **sustituidas** por PO-01 §1-§4. Conservan valor su matriz de consistencia y su regla de precedencia derivada |
| **ADR-11** — Ubicación de la Capacidad de Selección | Suspendido *(Needs Rewrite)* | Su objeto queda **resuelto** por PO-01 §6 y §7. Nunca llegó a incorporarse al Blueprint como fichero |
| **DP-01** — Ciclo de Vida Canónico | Vigente como registro histórico | Su ciclo de vida queda **sustituido** por PO-01 §8. Conserva valor documental como registro del proceso |
| **REV-01** — Revisión del Dominio Canónico | Vigente como registro histórico | Inventario de evidencia. No requiere cambios; requiere **marcado de estado** |
| **REV-02** — Revisión Documental de Q-2 | Vigente como registro histórico | Documento terminal de la investigación. No requiere cambios; requiere **marcado de estado** |
| **AR-01** — Evaluación Arquitectónica Final | Cerrado | Cierre formal. No requiere cambios |
| **PO-01** — Decisión Canónica de Lead | Draft — pendiente de firma | **Autoridad funcional del dominio** una vez firmado. Fuente de toda la consolidación |

---

# 3. Decisiones ya Consolidadas

Decisiones que no requieren más investigación. Sin argumentación: solo el enunciado.

## 3.1 Dominio

| # | Decisión | Origen |
| --- | --- | --- |
| D-1 | Una Empresa es un negocio real del que AKVEZ dispone de información pública | PO-01 §1 |
| D-2 | Un Lead es una Empresa incorporada al espacio de trabajo comercial de un usuario | PO-01 §2 |
| D-3 | **El evento que convierte una Empresa en Lead es el Registro** | PO-01 §3 |
| D-4 | La Biblioteca de Leads contiene todas las Empresas descubiertas para el usuario; todo su contenido es Lead | PO-01 §4 |
| D-5 | El ciclo de vida oficial es: Empresa → Lead → Lead Analizado → Lead Evaluado → Lead Contactado | PO-01 §8 |
| D-6 | Un Lead no requiere análisis, ni Opportunity Score, ni umbral, ni posición en un ranking | PO-01 §2, §5 |
| D-7 | Empresa y Lead son estados de un mismo sujeto, no entidades distintas | PO-01 §8 |
| D-8 | Ninguna etapa expulsa a un Lead de la Biblioteca | PO-01 §8 |

## 3.2 Arquitectura

| # | Decisión | Origen |
| --- | --- | --- |
| A-1 | El Registro es responsabilidad del Lead Hunter | PO-01 §8 |
| A-2 | El Análisis y la Evaluación son responsabilidad del Lead Analyzer | PO-01 §8 |
| A-3 | **La Evaluación sigue al Análisis** — queda resuelta la contradicción de orden | PO-01 §5, §8 |
| A-4 | La priorización es capacidad del negocio y reside en el Lead Analyzer | PO-01 §7 |
| A-5 | **El truncamiento es una restricción de infraestructura y no pertenece al dominio.** Ninguna limitación técnica podrá determinar qué Leads existen | PO-01 §6 |
| A-6 | El Opportunity Score es un atributo del Lead, no una transición de estado | PO-01 §5 |

## 3.3 Producto

| # | Decisión | Origen |
| --- | --- | --- |
| P-1 | AKVEZ ordena y explica; no oculta | PO-01 §7 |
| P-2 | No existe Top N como promesa de producto | PO-01 §6 |
| P-3 | No existe umbral mínimo de exclusión | PO-01 §7 |
| P-4 | La priorización se expresa mediante orden por puntuación y etiqueta de banda | PO-01 §7 |
| P-5 | La memoria completa del descubrimiento es condición de la deduplicación, criterio de éxito de la V1 | PO-01 §3 |

---

# 4. Documentos que Deberán Actualizarse

| Documento | Tipo de cambio | Prioridad |
| --- | --- | --- |
| **APS-07** §5, §6, §7, §8, Glosario | **Sustantivo** — modelo de estados, definición del contenido de la Biblioteca, nomenclatura del ciclo | **P0** |
| **APS-03** §7, §8, §17.2 (APS-03-DIAG-002), Glosario | **Sustantivo** — responsabilidades de Lead Hunter, incorporación del paso de Registro al flujo y al diagrama | **P0** |
| **APS-02** §6, Glosario | **Sustantivo** — definición de la Biblioteca de Leads; corrección de «Lead Hunter: descubrir y analizar» | **P1** |
| **APS-08** §8 | **Aditivo** — declarar que no existe umbral de exclusión | **P1** |
| **ADR-10** | **Archived** — marcar y referir a PO-01 | **P1** |
| **ADR-10A** | **Archived** — marcar y referir a PO-01 | **P1** |
| **ADR-11** | **Retirado** — su objeto queda resuelto por PO-01 §6 y §7 | **P2** |
| **ADR-05** §12 | **Terminológico** — alineación con D-2 y D-3 | **P2** |
| **ADR-02** §8 | **Aclaratorio** — precisar el bloque `Scoring` | **P2** |
| **DP-01, REV-01, REV-02** | **Marcado de estado** — «Registro histórico. Sustituido por PO-01» | **P2** |
| **AR-01** | **Marcado de estado** — «Investigación cerrada. Resuelta por PO-01» | **P2** |
| **INDEX.md** | **Aditivo** — incorporar PO-01, AR-01, PLAN-01 y las categorías DP, REV, AR, PO, PLAN | **P1** |
| **ADS-00** | **Aditivo** — declarar la jerarquía documental *(ver §6, R-4)* | **P1** |
| **Código** | Fuera del alcance de este plan. Enumerado en PO-01 §9.3 | **P3** |

---

# 4.1 Estado de Ejecución

**Actualizado el 2026-07-29.** Refleja únicamente el avance real; no modifica la planificación de §4 ni de §7.

| Fase | Documentos | Avance |
| --- | --- | --- |
| **Fase 0** — Habilitación | PO-01 · ADS-00 | **100 %** ✅ |
| **Fase 1** — Alineación de los APS | APS-07 · APS-03 · APS-02 · APS-08 | **100 %** ✅ |
| **Fase 2** — Alineación de los ADR | ADR-10 · ADR-10A · ADR-11 · ADR-05 · ADR-02 | **100 %** ✅ |
| **Fase 3** — Marcado de investigación | DP-01 · REV-01 · REV-02 · AR-01 | **100 %** ✅ |
| **Fase 4** — Índice y trazabilidad | INDEX.md · ADS-01 | **100 %** ✅ |
| **Fase 5** — Implementación | Alcance en PO-01 §9.3 | **0 %** ⬜ — **habilitada** |

**Avance de la consolidación documental (Fases 0 a 4): 15 de 15 elementos → 100 %.**

> ## ✅ Consolidación documental completada — 2026-07-29
>
> Los quince elementos de §4 están ejecutados. Los **45 documentos** del Blueprint utilizan exclusivamente estados del catálogo oficial de ADS-00, no existen enlaces rotos y ninguna referencia apunta a contenido derogado como autoridad vigente.
>
> **Las seis condiciones de la Definition of Done (§8) están cumplidas.** Queda habilitada la **Fase 5 — Implementación**, cuyo alcance figura en PO-01 §9.3.
>
> **Documento adicional generado, no previsto en §4:** **ADS-01 — Implementation Contracts**.
>
> **Advertencia.** La habilitación es **documental**. Dos materias siguen sin decidirse y bloquean el MVP, no el Blueprint: el **motor de persistencia** y los **valores del Perfil de Ponderación**. Véase AR-02 §5.2 y ADS-01 §11.

| Elemento de §4 | Estado |
| --- | --- |
| APS-07 · APS-03 · APS-02 · APS-08 | ✅ Completados |
| ADR-10 · ADR-10A · ADR-11 · ADR-05 · ADR-02 | ✅ Completados |
| ADS-00 | ✅ Completado (v1.2) |
| PO-01 | ✅ Firmado y `Approved` (v1.1) |
| DP-01 · REV-01 · REV-02 | ✅ Completados (`Archived`, v1.1) |
| AR-01 | ✅ Completado (`Archived`, v1.1) |
| INDEX.md | ✅ Completado — reescrito como puerta de entrada oficial |
| ADS-01 *(no previsto en §4)* | ✅ Creado — mapa de implementación |
| Código | ⬜ Pendiente — Fase 5 (P3, fuera del alcance de este plan) |

**Riesgo R-1 (ventana de inconsistencia): cerrado.** Ningún documento aprobado del Blueprint contradice a PO-01 §1-§8. Verificado en **REV-03**.

**Riesgo R-3 (lectura errónea de los documentos de investigación): cerrado.** Mitigado íntegramente por la Fase 3 el 2026-07-29. Los cuatro documentos llevan estado `Archived`, advertencia de archivo en portada y declaración expresa de no ser autoridad vigente. El hallazgo **H-06** de REV-03 queda resuelto.

**Documentos generados durante la ejecución, no previstos en §4:**

- **REV-03 — Residual Consistency Review** (2026-07-29). Inventario de siete hallazgos residuales. Ninguno bloquea la Fase 5.

---

# 5. Orden Recomendado de Actualización

```
0. PO-01 firmado  +  Jerarquía documental declarada
        ↓
1. APS-07  →  APS-03  →  APS-02  →  APS-08
        ↓
2. ADR-10, ADR-10A, ADR-11, ADR-05, ADR-02
        ↓
3. DP-01, REV-01, REV-02, AR-01  (marcado de estado)
        ↓
4. INDEX.md
        ↓
5. Código
```

**Justificación del orden.**

**Los APS antes que los ADR**, porque los ADR citan a los APS como fundamento. Actualizar primero un ADR lo dejaría apoyado en secciones APS que todavía afirmarían lo contrario, creando una inconsistencia transitoria peor que la actual: un documento nuevo justificándose con evidencia derogada.

**APS-07 el primero de todos**, porque es el documento que define los activos de información, el modelo conceptual y la Biblioteca. Los demás APS lo presuponen. Es el punto de mayor apalancamiento del Blueprint.

**APS-03 inmediatamente después**, porque contiene las dos representaciones del flujo —§8 y el diagrama APS-03-DIAG-002— y es donde reside la contradicción interna más visible.

**El marcado de estado de los documentos de investigación después de los ADR**, porque hasta que los ADR estén corregidos esos documentos siguen siendo la única explicación de por qué se decidió lo que se decidió.

**INDEX al final del trabajo documental**, cuando la estructura ya no vaya a cambiar.

**El código el último, y solo entonces.** Es la única forma de garantizar que la implementación se ajusta a un Blueprint coherente y no a una versión intermedia.

---

# 6. Riesgos de Consolidación Documental

Únicamente riesgos documentales. No se incluyen riesgos técnicos.

| # | Riesgo | Severidad | Mitigación prevista |
| --- | --- | --- | --- |
| **R-1** | **Ventana de inconsistencia.** Entre la firma de PO-01 y el cierre de la Fase 2 coexistirán definiciones contradictorias en documentos aprobados | Alta | Ejecutar Fases 1 y 2 de forma consecutiva y sin interrupción; no iniciar la Fase 1 sin capacidad de completar la 2 |
| **R-2** | **Deriva de citas.** Otros documentos citan secciones que cambiarán de contenido o numeración | Media | Verificar en la Fase 4 que ninguna referencia cruzada apunte a un enunciado derogado |
| **R-3** | **Lectura errónea de los documentos de investigación.** DP-01, REV-01 y REV-02 contienen conclusiones intermedias que fueron después refutadas; sin marcado de estado podrían citarse como vigentes | **Alta** | Fase 3. Es el riesgo con mayor probabilidad de materializarse, porque son los documentos más detallados de la serie |
| **R-4** | **La jerarquía documental sigue sin declararse.** Su ausencia fue la causa raíz de las contradicciones originales; consolidar sin resolverla deja abierta la reaparición del mismo problema | **Alta** | Fase 0. Es la única mitigación estructural del conjunto |
| **R-5** | **Versionado de diagramas.** APS-03-DIAG-002 tiene identificador y versión propios; modificarlo sin incrementar la versión rompería la trazabilidad exigida por ADS-00 §3 | Media | Incrementar versión y fecha del diagrama en la Fase 1 |
| **R-6** | **Consolidación parcial.** Actualizar solo los documentos «importantes» dejaría glosarios y anexos con las definiciones antiguas — precisamente donde se originaron cuatro de las nueve contradicciones | Media | Los glosarios están enumerados explícitamente en §4 |
| **R-7** | **Adelanto del código.** Modificar la implementación antes de cerrar la Fase 2 consolidaría una interpretación intermedia | Media | El criterio de finalización de la Fase 2 es condición de entrada de la Fase 5 |

---

# 7. Plan de Ejecución

## Fase 0 — Habilitación

**Objetivo.** Establecer las dos condiciones sin las cuales la consolidación no puede iniciarse.

**Documentos afectados.** PO-01 · ADS-00

**Trabajo.** Firma de PO-01 conforme a su §11. Declaración de la jerarquía documental del Blueprint en ADS-00, resolviendo el vacío identificado como V-5 en AR-01.

**Criterio de finalización.** PO-01 firmado y ADS-00 conteniendo una regla de precedencia aplicable entre APS, ADR y documentos derivados.

## Fase 1 — Alineación de los APS

**Objetivo.** Que los documentos de producto reflejen las decisiones de PO-01.

**Documentos afectados.** APS-07 · APS-03 (incluido el diagrama APS-03-DIAG-002) · APS-02 · APS-08

**Criterio de finalización.** Ninguna sección ni glosario de los cuatro documentos contradice a PO-01 §1-§8. El flujo de APS-03 §8 y el diagrama APS-03-DIAG-002 incluyen el paso de Registro. La versión y fecha del diagrama han sido incrementadas.

## Fase 2 — Alineación de los ADR

**Objetivo.** Que las decisiones arquitectónicas se apoyen en los APS ya corregidos.

**Documentos afectados.** ADR-10 · ADR-10A · ADR-11 · ADR-05 · ADR-02

**Criterio de finalización.** ADR-10 y ADR-10A marcados como *Archived* con referencia explícita a PO-01. ADR-11 retirado. ADR-05 §12 y ADR-02 §8 alineados terminológicamente. Ningún ADR cita como fundamento un enunciado derogado en la Fase 1.

### Checklist de ejecución — Fase 2

| # | Documento | Trabajo previsto | Ejecutado | Estado |
| --- | --- | --- | --- | --- |
| 1 | **ADR-10** | Marcar `Archived` y referir a PO-01 | v1.2 · `Draft` → **`Archived`**. Nota de archivo, nota de excepción (DT-01), nota editorial ante §17, referencias §13 y §16 actualizadas. Contenido histórico íntegro | ✅ **Completado** |
| 2 | **ADR-10A** | Marcar `Archived` y referir a PO-01 | v2.0 · `Draft` → **`Review`**. **Ejecutado por alineación, no por archivado**, conforme a instrucción del Product Office: §5.2 y §5.5 derogadas, 6 de 10 respuestas de §6 corregidas, §7 cerrada, §3 marcada contexto histórico. Contenido íntegro | ✅ **Completado — con desviación documentada** |
| 3 | **ADR-11** | Retirado | v2.0 · **Reescrito por completo**, no retirado, conforme a instrucción del Product Office y a PO-01 §9.2 («Reescritura»). Nuevo objeto: frontera entre dominio e implementación. Estado `Review` | ✅ **Completado — con desviación documentada** |
| 4 | **ADR-05** §12 | Alineación terminológica | v1.3 · §10 (definición de `Lead`) y §12 (Registro; supresión de «prospecto»). Ninguna decisión arquitectónica modificada | ✅ **Completado** |
| 5 | **ADR-02** §8 | Aclaración del bloque `Scoring` | v1.1 · Nota aclaratoria en §8: `Scoring` es operación del Lead Analyzer; el Registro precede; el Análisis precede a la Evaluación. Cierra C-4 y C-5 | ✅ **Completado** |

**Verificación del criterio de finalización.** Cumplido. Ningún ADR cita como fundamento un enunciado derogado en la Fase 1. Verificado mediante barrido documental completo, registrado en **REV-03**.

### Desviaciones respecto de lo planificado

Ambas se ejecutaron por instrucción expresa del Product Office y prevalecen sobre este plan, que carece de autoridad sobre el contenido (ADS-00 v1.2, *Documentos Fuera de la Cadena de Precedencia*).

| # | Previsto | Ejecutado | Justificación |
| --- | --- | --- | --- |
| D-1 | ADR-10A → `Archived` | ADR-10A → `Review`, alineado | Conservaba validez analítica: §4.1-§4.5 fueron **confirmadas** por PO-01. Archivarlo habría retirado del Blueprint una matriz de consistencia vigente |
| D-2 | ADR-11 → retirado | ADR-11 → reescrito | **PO-01 §9.2 dice «Reescritura»**, no «retirado», y PO-01 prevalece sobre PLAN-01. Su objeto original quedó disuelto, pero PO-01 §6 abrió uno nuevo y no resuelto: dónde pueden residir las limitaciones técnicas |

## Fase 3 — Marcado de los documentos de investigación

**Objetivo.** Impedir que conclusiones intermedias ya refutadas se citen como vigentes.

**Documentos afectados.** DP-01 · REV-01 · REV-02 · AR-01

**Criterio de finalización.** Los cuatro documentos llevan en su portada un estado explícito de registro histórico y una referencia a PO-01 como autoridad vigente. Ninguno se modifica en su contenido.

### Checklist de ejecución — Fase 3

| # | Documento | Estado anterior | Estado nuevo | Versión | Marco editorial aplicado |
| --- | --- | --- | --- | --- | --- |
| 1 | **DP-01** | `Draft` | **`Archived`** | 1.0 → 1.1 | Nota de archivo · nota de excepción (DT-01) · historial · nota editorial ante §10 · §9 desdoblada |
| 2 | **REV-01** | `Informe` *(inexistente)* | **`Archived`** | 1.0 → 1.1 | Nota de archivo · nota de excepción (DT-01, H-07) · historial · §11 desdoblada |
| 3 | **REV-02** | `Informe` *(inexistente)* | **`Archived`** | 1.0 → 1.1 | Nota de archivo · nota de excepción (DT-01, H-07) · historial · §5 desdoblada |
| 4 | **AR-01** | `Cerrado` *(inexistente)* | **`Archived`** | 1.0 → 1.1 | Nota de archivo · nota de excepción (DT-01, H-07) · historial · corrección de la tabla de §9 · §11 desdoblada |

**Verificación del criterio de finalización.** Cumplido. Los cuatro llevan estado `Archived` conforme a ADS-00 v1.2 —«Documento conservado únicamente con fines históricos»—, referencia explícita a PO-01 como autoridad vigente y declaración expresa de que no deben utilizarse para diseñar arquitectura. **Ninguno fue modificado en su contenido:** ninguna sección eliminada, reescrita ni renumerada.

**Hallazgos cerrados.** **H-06** de REV-03 queda resuelto, y con él el riesgo **R-3** de §6. **H-07** queda resuelto **parcialmente**: se normalizaron los tres estados inexistentes de estos documentos (`Informe` ×2, `Cerrado`); permanecen los de AF-00, ATA-01, ADR-05 y ADR-11, aplazados al sprint de normalización documental.

### Desviación respecto de lo planificado

| # | Previsto | Ejecutado | Justificación |
| --- | --- | --- | --- |
| D-3 | «Marcado de estado» sin cambio de estado documental | Cambio de estado a `Archived` en los cuatro | El criterio de finalización exige «un estado explícito de registro histórico», y el único estado de ADS-00 con ese significado es `Archived`. Mantener `Informe` o `Cerrado` habría dejado el criterio incumplido y perpetuado H-07 |

**Deuda ampliada.** La transición a un estado terminal desde `Draft` o desde un estado inexistente no está contemplada por `AF-01-DIAG-001`. La deuda **DT-01**, registrada en la nota de excepción de ADR-10, extiende su alcance a estos cuatro documentos. Cada uno lo declara en su propia nota de excepción. Conforme a ADS-00 v1.2 **R-6**, queda elevada al Product Office.

## Fase 4 — Índice y trazabilidad

**Objetivo.** Que la estructura del Blueprint refleje su contenido real.

**Documentos afectados.** INDEX.md

**Criterio de finalización.** INDEX incorpora PO-01, AR-01 y PLAN-01, así como las categorías DP, REV, AR, PO y PLAN. Verificación de que ninguna referencia cruzada del Blueprint apunta a un enunciado derogado.

### Checklist de ejecución — Fase 4

| # | Trabajo | Resultado | Estado |
| --- | --- | --- | --- |
| 1 | **INDEX.md** — puerta de entrada oficial | Reescrito. 9 secciones: propósito · jerarquía · estructura de carpetas · índice completo de los 44 documentos con código, versión, estado y propietario · vigentes por materia · archivados y sustituidos · dependencias · orden de lectura · localizador | ✅ |
| 2 | **ADS-01 — Implementation Contracts** | Creado. Mapa tema → documento canónico en 12 secciones, con localizador de reglas vinculantes y declaración de lo no decidido | ✅ |
| 3 | **Nombres de fichero** | 4 corregidos: ADR-01 *(prefijo `#` espurio y título truncado)* · ADR-03 · ADR-05 · APS-11 | ✅ |
| 4 | **Estados documentales** | 2 normalizados en la Fase 4 (REV-03, AR-02) y **5 en el sprint de normalización final** (ADR-05, AF-00, APS-01, APS-04, ATA-01). **Cero estados inválidos** en los 45 documentos | ✅ |
| 5 | **Referencias cruzadas y enlaces** | Verificados. Sin enlaces rotos ni referencias a contenido derogado como autoridad vigente | ✅ |

**Verificación del criterio de finalización.** Cumplido. INDEX incorpora las cinco categorías nuevas y los 44 documentos. Ninguna referencia cruzada apunta a un enunciado derogado: las definiciones derogadas solo subsisten dentro de bloques explícitos de derogación, inventariados en INDEX §6.1.

### Normalización final de estados documentales

Ejecutada el 2026-07-29 en sprint posterior, tras la decisión del Product Office sobre los cinco casos que la Fase 4 dejó abiertos.

| # | Documento | Estado anterior | Estado nuevo | Ver. | Fundamento de la decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | **ADR-05** | `Approved Draft` *(híbrido)* | **`Approved`** | 1.4 | Sin condiciones de aprobación pendientes. Sus decisiones son citadas como canónicas por ADR-08 §10, ADR-13 §4.1 y ADS-01 §3 |
| 2 | **AF-00** | `Fundacional` *(inexistente)* | **`Approved`** | 1.1 | El rango constitucional lo expresan su *Clasificación* y su **orden 1** en la jerarquía de ADS-00, no su estado. `Approved` es el único estado válido de una Constitución en vigor. Se añade además el Historial de Versiones del que carecía (**N-06** de AR-02) |
| 3 | **APS-01** | `Draft` en portada · `APPROVED` en AQS | **`Approved`** | 2.2 | La v2.0 ya estaba aprobada y el delta de la v2.1 fue **aditivo** —tres diagramas en anexos—, sin alterar decisiones. Mismo criterio aplicado a APS-03 v3.0 |
| 4 | **APS-04** | `Approved` en portada · `Review` en §28 | **`Approved`** | 4.0 | De las dos condiciones que motivaban el `Review`, una quedó **resuelta** en la v4.0 (arquitectura de pantallas restituida como Parte A) y la otra —validación de valores `[ESTIMADO]`— es una verificación diferida a implementación, no una condición de aprobación |
| 5 | **ATA-01** | `Baseline` *(inexistente)* | **`Archived`** | 1.1 | Fotografía del prototipo previa a la consolidación. Sus valoraciones sobre design system y documentación quedaron superadas. Sus hallazgos sobre **código** conservan valor y deberán reverificarse al iniciar la Fase 5 |

**Verificación.** Auditoría sobre los **45 documentos** del Blueprint: **cero estados fuera del catálogo oficial de ADS-00**. Distribución resultante: 31 `Approved` · 6 `Draft` · 6 `Archived` · 2 `Review` · 0 `Deprecated`.

**Hallazgos cerrados.** **H-07** de REV-03 y **DM-1**, **DM-3** y **DM-6** de AR-02 §4.3 quedan resueltos. **N-06** de AR-02 §3 queda resuelto en su parte de Historial; AF-00 sigue sin sección de Referencias.

**Consecuencia.** El criterio de aceptación «no existan estados documentales inválidos» **se cumple**. La consolidación documental alcanza el **100 %**.

## Fase 5 — Implementación

**Objetivo.** Ajustar el código al Blueprint consolidado.

**Documentos afectados.** Ninguno. Alcance enumerado en PO-01 §9.3.

**Condición de entrada.** Fases 0 a 4 completadas.

**Criterio de finalización.** Fuera del alcance de este plan; corresponde a la planificación de sprint.

---

# 8. Definition of Done

La consolidación documental podrá considerarse terminada cuando se cumplan las seis condiciones siguientes:

1. **PO-01 está firmado** y su estado no es Draft.
2. **La jerarquía documental está declarada** en ADS-00.
3. **Ningún documento aprobado del Blueprint contradice a PO-01** §1-§8, incluidos glosarios, anexos y diagramas.
4. **Los ADR sustituidos están marcados** en estado `Archived`, con referencia explícita a PO-01, y ninguno se apoya en evidencia derogada.
5. **Los documentos de investigación están marcados** como registro histórico, sin haber sido modificados en su contenido. ✅ **Cumplida** el 2026-07-29. DP-01, REV-01, REV-02 y AR-01 en estado `Archived` (v1.1), con nota de archivo, referencia a PO-01 como autoridad vigente y declaración de no utilizarse para diseñar arquitectura. Ninguna sección eliminada, reescrita ni renumerada.
6. **INDEX.md refleja la estructura real** del Blueprint y ninguna referencia cruzada apunta a un enunciado derogado.

Cumplidas las seis, el Blueprint vuelve a ser internamente coherente sobre el dominio Empresa → Lead, y queda habilitada la Fase 5.
