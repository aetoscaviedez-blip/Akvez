# REV-02 — Revisión Documental de Q-2: ¿Qué guarda Lead Hunter?

| Campo | Valor |
| --- | --- |
| Código | REV-02 |
| Clasificación | Revisión Documental — Dominio |
| Versión | 1.1 |
| Estado | **Archived** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Estándar aplicado | ADS-00 v1.2 |
| Alcance | 17 APS · 11 ADR · ADS-00 · 3 AF · ATA-01 |
| Pregunta única | ¿Lead Hunter guarda Empresas o guarda Leads? |
| Autoridad vigente sobre esta materia | **PO-01** · APS-07 v2.0 · APS-03 v3.0 |

> Informe de evidencia. No decide, no recomienda, no interpreta intención. Cada afirmación cita documento, sección y texto literal.

---

> # ⚠ Documento archivado — Registro histórico
>
> **Este documento fue archivado tras la aprobación de PO-01.**
>
> **Se conserva exclusivamente con fines históricos y de trazabilidad.** Es el documento terminal de la investigación: el que demostró que el Blueprint era insuficiente para resolver la pregunta por sí mismo, y con ello hizo inevitable una decisión de Product Office. **Sustituido por PO-01.**
>
> **No es autoridad vigente. No debe utilizarse para diseñar arquitectura ni para fundamentar ninguna decisión.**
>
> **Advertencia específica.** Su conclusión —«**El Blueprint es insuficiente para resolverla**» (§4)— era **correcta en su fecha y dejó de serlo el 2026-07-29**. El Blueprint ya resuelve la pregunta: **el Lead Hunter registra todas las Empresas descubiertas y no duplicadas, y ese Registro es lo que las convierte en Leads** (PO-01 §3; APS-03 v3.0 §7.1 y §8.1, paso 4). Citar §4 como vigente afirmaría lo contrario de lo que hoy establece el Blueprint.
>
> **Respuesta vigente a la pregunta única del documento:**
>
> | Pregunta | Respuesta vigente |
> | --- | --- |
> | ¿Lead Hunter guarda Empresas o guarda Leads? | **Guarda Empresas, y al guardarlas se convierten en Leads.** El Registro es el evento de conversión — no hay dos cosas distintas (PO-01 §3, §4) |
> | ¿Qué contiene la Biblioteca? | **Todas** las Empresas descubiertas para el usuario. Todo su contenido es un Lead (PO-01 §4; APS-07 v2.0 §8.1) |
>
> **Qué conserva valor.** Su inventario de evidencia con cita literal, y su demostración —hoy plenamente confirmada— de que la contradicción era real y no un defecto de lectura.
>
> **Ninguna sección ha sido eliminada, reescrita ni renumerada.**

---

> ## Nota de excepción — Estado anterior no contemplado
>
> Este documento declaraba el estado **`Informe`**, que **no pertenece** a la clasificación oficial de ADS-00 (*Estados del Documento*).
>
> Su normalización a `Archived` fue una **decisión excepcional del Product Office**, ejecutada en la Fase 3 de PLAN-01. `AF-01-DIAG-001` no define transición alguna desde un estado que no reconoce. **No constituye precedente.**
>
> Corresponde a las deudas **DT-01** y **H-07**, cuyo alcance se extiende ahora a este documento. Conforme a ADS-00 v1.2 **R-6**, quedan elevadas al Product Office.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-28 | AKVEZ Architecture Team | Redacción inicial. Revisión documental exhaustiva de la pregunta Q-2 sobre 17 APS, 11 ADR, ADS-00, 3 AF y ATA-01. Concluye que el Blueprint es insuficiente para resolverla. | Determinar si el Lead Hunter almacena Empresas o Leads, cuestión de la que dependían ADR-10 y ADR-11. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Cambio de estado documental: `Informe` → `Archived`.** Se añaden la nota de archivo, la nota de excepción, este historial y la actualización de referencias en §5. **No se modifica ningún contenido histórico:** ninguna sección eliminada, reescrita ni renumerada. | Fase 3 de PLAN-01, cierre del hallazgo **H-06** de REV-03, y normalización del estado inexistente registrado como **H-07**. La pregunta quedó resuelta por **PO-01** §3 y §4. |

---

# 1. Evidencia Encontrada

## 1.1 Referencias que describen la escritura de Lead Hunter

| # | Documento | Sección | Cita textual | Interpretación mínima | Impacto sobre Q-2 |
| --- | --- | --- | --- | --- | --- |
| **A-1** | APS-03 | §7 (Lead Hunter, Responsabilidades) | «**Registrar nuevas empresas en la Biblioteca de Leads.**» | Lead Hunter escribe **empresas** en la Biblioteca | **Directo — a favor de «Empresas»** |
| **A-2** | ADR-05 | §12 (Integración con Agentes) | Lead Hunter, *Después:* «Buscar ↓ Consultar duplicados ↓ **Guardar nuevos leads** ↓ Devolver resultados» | Lead Hunter escribe **leads** | **Directo — a favor de «Leads»** |
| **A-3** | ADR-05 | §4 (Objetivos Secundarios) | «**Persistencia de Leads:** Guardar **negocios encontrados**, información comercial, scoring, análisis IA y estados.» | El encabezado dice *Leads*; el objeto es *negocios encontrados* | **Indirecto — a favor de «Leads»**. Equipara lo encontrado con lo persistido bajo el rótulo *Leads* |
| **A-4** | ADR-05 | §15 (Estrategia de Migración) | «**Fase 2:** Persistir **leads encontrados**. **Fase 3:** Persistir análisis IA.» | Los *leads encontrados* se persisten en una fase **anterior** a la del análisis | **Indirecto — a favor de «Leads»**. Ordena la persistencia del lead antes de la del análisis |
| **A-5** | ADR-05 | §11 (Repository Pattern) | LeadRepository: «Responsabilidad: **guardar leads**, buscar leads, actualizar estados.» | El repositorio guarda leads | **Indirecto — a favor de «Leads»** |
| **A-6** | ADR-05 | §10 (Modelo Conceptual Inicial) | «**Lead** — Representa una oportunidad comercial.» | Define la entidad persistida como Lead | Contextual |

## 1.2 Referencias que describen el flujo sin mencionar escritura

| # | Documento | Sección | Cita textual | Interpretación mínima | Impacto sobre Q-2 |
| --- | --- | --- | --- | --- | --- |
| **B-1** | APS-03 | §8 (Flujo de Trabajo) | «1. El usuario inicia una búsqueda. 2. Lead Hunter encuentra empresas. **3. Lead Hunter consulta la Biblioteca de Leads para evitar duplicados. 4. Las nuevas empresas pasan al Lead Analyzer.** 5. Lead Analyzer genera el Opportunity Score. 6. Los resultados pasan al Pitch Generator.» | En los seis pasos del flujo, la única interacción con la Biblioteca es de **lectura** | **Relevante — debilita A-1.** APS-03 omite la escritura en su propia descripción del flujo |
| **B-2** | APS-03 | §17.2 · Diagrama **APS-03-DIAG-002** v2.1 | `LH->>DS: Verificar duplicados` · `DS-->>LH: Respuesta duplicados` · `LH->>LA: Enviar empresas nuevas (estructura)` | El diagrama de secuencia normativo muestra **una sola flecha** entre Lead Hunter y la Biblioteca, y es de **verificación** | **Relevante — debilita A-1.** No existe ninguna flecha de escritura |
| **B-3** | APS-03 | §7 (Lead Hunter, Salidas) | «Lista estructurada de **empresas candidatas**.» | La salida son *empresas candidatas* | A favor de «Empresas» en la salida, no necesariamente en la escritura |
| **B-4** | APS-07 | §7 (Registro) | «**Registro** — La **empresa** se almacena en la Biblioteca de Leads.» | Se almacena una **empresa** | **Directo — a favor de «Empresas»** |

## 1.3 Referencias sobre el contenido de la Biblioteca de Leads

| # | Documento | Sección | Cita textual | Impacto |
| --- | --- | --- | --- | --- |
| C-1 | APS-07 | §8 | «Su función es evitar duplicados y **conservar el historial completo de cada empresa**.» | Contenido = empresas |
| C-2 | APS-07 | §8 | «Cada registro deberá incluir, como mínimo: … **Estado del análisis** … **Fecha de descubrimiento** …» | Estructura del registro |
| C-3 | APS-02 | §6 | «Almacenamiento persistente de **empresas ya analizadas**» | Contenido = empresas analizadas |
| C-4 | APS-02 | Glosario | «Base de conocimiento que almacena **empresas previamente analizadas**.» | Ídem |
| C-5 | APS-03 | Glosario | «Repositorio persistente donde se almacenan las **empresas ya procesadas**.» | Ídem |
| C-6 | APS-07 | Glosario | «Repositorio central donde se almacena el historial de **empresas analizadas**.» | Ídem |

**Observación:** las seis referencias al contenido de la Biblioteca dicen **empresas**. Ninguna dice *leads*.

## 1.4 Referencias sobre la relación entre la Biblioteca de Leads y el repositorio de ADR-05

| # | Documento | Sección | Cita textual | Impacto |
| --- | --- | --- | --- | --- |
| **D-1** | ADR-05 | §1 (Resumen Ejecutivo) | «Esto representa una limitación directa para la **evolución planteada** en el Blueprint: • **Biblioteca de Leads**. • CRM Agent. • Follow-up Agent. • Scheduler Agent. • Memoria operacional de agentes.» | **Decisivo.** ADR-05 sitúa la Biblioteca de Leads entre las **evoluciones futuras habilitadas** por la arquitectura que define — junto a agentes que no existen. No la identifica con el repositorio que especifica |
| **D-2** | ADR-04 | §3 (Alcance, No incluye) | «Persistencia ni la **futura** "Biblioteca de Leads" de APS-03.» | Califica la Biblioteca de **futura** y atribuida a APS-03 |
| **D-3** | ADR-05 | §11, §12 | Usa exclusivamente el término «**LeadRepository**». El término «Biblioteca de Leads» **no aparece** en §10, §11 ni §12 | ADR-05 nombra su almacén de otro modo al describir la operación |
| **D-4** | APS-03 | Glosario | «**Biblioteca de Leads:** Repositorio persistente donde se almacenan las empresas ya procesadas.» | APS-03 la llama *repositorio*, sin nombrar `LeadRepository` |

**Observación:** ningún documento del Blueprint declara que la «Biblioteca de Leads» y el `LeadRepository` de ADR-05 sean el mismo almacén.

## 1.5 Referencias descartadas por no aportar

| Documento | Motivo |
| --- | --- |
| AF-00, AF-01, AF-02 | Usan «empresa» en sentido coloquial (organización). Sin contenido de dominio |
| ADS-00 | Estándar documental. Sin contenido de dominio |
| APS-01, APS-04, APS-05, APS-06, APS-09 … APS-16 | Mencionan Lead Hunter o la Biblioteca sin describir la operación de escritura |
| ADR-01, ADR-02, ADR-03, ADR-06, ADR-07, ADR-08 | Mencionan los agentes o entidades sin describir qué escribe Lead Hunter |
| ATA-01 | Informe de auditoría del estado de implementación. No es fuente normativa de dominio |
| ADR-10, ADR-10A, ADR-11, DP-01, REV-01 | Documentos derivados. Excluidos por ser objeto de la revisión, no fuente |

---

# 2. Respuestas

## Pregunta 1 — ¿Existe alguna definición explícita que diga qué entidad guarda Lead Hunter?

# **Sí**

Existen **dos**, explícitas y mutuamente excluyentes:

> **APS-03 §7** — «Registrar nuevas **empresas** en la Biblioteca de Leads.»

> **ADR-05 §12** — Lead Hunter, *Después:* «Buscar ↓ Consultar duplicados ↓ Guardar nuevos **leads** ↓ Devolver resultados»

A ellas se añade una tercera, concordante con la primera:

> **APS-07 §7** — «Registro — La **empresa** se almacena en la Biblioteca de Leads.»

**Recuento:** dos referencias explícitas dicen *empresas* (APS-03 §7, APS-07 §7); una dice *leads* (ADR-05 §12), reforzada por tres indirectas dentro del mismo documento (ADR-05 §4, §11, §15).

**Confianza: Alta.** Las citas son literales y no requieren interpretación.

---

## Pregunta 2 — ¿Existe alguna definición explícita de cuándo una Empresa deja de ser Empresa y pasa a ser Lead?

# **No**

Se examinaron todos los pasajes del Blueprint que describen el recorrido de una Empresa: APS-07 §6 y §7, APS-03 §7, §8 y §17.2, APS-08 §7 y §8, ADR-05 §4, §10, §12 y §15.

**Ninguno enuncia la condición, el evento ni el momento de la transición.** APS-07 §6 declara el **orden** (`Empresa ↓ Lead`) sin declarar qué la provoca; APS-07 §7 enumera cinco etapas y **ninguna se corresponde con el estado `Lead`**.

**Confianza: Alta.** Es una demostración negativa por búsqueda exhaustiva sobre el conjunto completo de documentos que describen el recorrido.

---

## Pregunta 3 — ¿APS-03 y ADR-05 hablan exactamente del mismo concepto?

# **Indeterminado**

**Evidencia de que describen la misma operación:**

La estructura es idéntica — mismo agente, misma posición en la secuencia, mismo acto:

| APS-03 §7 | ADR-05 §12 |
| --- | --- |
| «Detectar posibles duplicados» | «Consultar duplicados» |
| «Registrar nuevas empresas en la Biblioteca de Leads» | «Guardar nuevos leads» |
| «Entregar un conjunto estructurado de empresas al siguiente agente» | «Devolver resultados» |

**Evidencia de que no se refieren al mismo almacén:**

> **D-1 · ADR-05 §1** — «Esto representa una limitación directa para la evolución planteada en el Blueprint: • **Biblioteca de Leads**. • CRM Agent. • Follow-up Agent. • Scheduler Agent.»

ADR-05 enumera la Biblioteca de Leads entre las capacidades **que su arquitectura habilitará**, en la misma lista que agentes inexistentes. No la presenta como el almacén que está especificando.

> **D-2 · ADR-04 §3** — «Persistencia ni la **futura** "Biblioteca de Leads" de APS-03.»

> **D-3** — ADR-05 §10, §11 y §12 emplean exclusivamente el término `LeadRepository`. «Biblioteca de Leads» no aparece en ninguna de las tres secciones.

**Ningún documento del Blueprint declara que la Biblioteca de Leads y el `LeadRepository` sean el mismo almacén, ni que sean distintos.**

**Conclusión de P3:** las dos afirmaciones describen operaciones estructuralmente idénticas, pero la identidad de sus objetos de destino **no está establecida documentalmente**. Determinar si hablan del mismo concepto exigiría una inferencia que esta revisión tiene prohibido realizar.

**Confianza: Media-Alta** sobre la indeterminación misma; la evidencia D-1 a D-4 es literal.

---

## Pregunta 4 — ¿La contradicción sigue existiendo después de revisar absolutamente todo el Blueprint?

# **Sí**

La revisión de la totalidad del Blueprint no la resolvió; la **amplió**.

**La contradicción original persiste**, y ninguna cita la disuelve:

> APS-03 §7: «Registrar nuevas **empresas**» · ADR-05 §12: «Guardar nuevos **leads**»

**Se añadieron dos hallazgos que la agravan:**

**Primero — APS-03 se contradice internamente.** Su §7 declara la responsabilidad de registrar, pero:

> **B-1 · APS-03 §8** — Los seis pasos del flujo describen una sola interacción con la Biblioteca: «3. Lead Hunter **consulta** la Biblioteca de Leads para evitar duplicados». No hay paso de registro.

> **B-2 · APS-03 §17.2, diagrama APS-03-DIAG-002 v2.1** — Una única flecha entre Lead Hunter y la Biblioteca: `LH->>DS: Verificar duplicados`. **Ninguna flecha de escritura.**

APS-03 afirma la escritura **una vez** (§7) y la **omite** en las dos representaciones donde describe el flujo completo.

**Segundo — el contenido declarado de la Biblioteca contradice ambas posturas por igual.** Las seis referencias a su contenido (C-1 a C-6) dicen **empresas**, nunca *leads*, incluidas cuatro que además exigen que estén **analizadas** — lo que contradice tanto a APS-03 §7 («nuevas empresas») como a ADR-05 §12 («nuevos leads»), pues ambas describen una escritura **anterior** al análisis.

**Confianza: Alta.** Todas las citas son literales.

---

# 3. Niveles de Confianza

| Respuesta | Nivel | Fundamento |
| --- | --- | --- |
| P1 — Sí, existen definiciones explícitas (dos, contradictorias) | **Alta** | Citas literales, sin interpretación |
| P2 — No existe definición del evento de transición | **Alta** | Demostración negativa exhaustiva |
| P3 — Indeterminado | **Media-Alta** | La indeterminación está demostrada por D-1 a D-4; lo indeterminado es la identidad de los almacenes |
| P4 — Sí, la contradicción permanece | **Alta** | Citas literales, más dos hallazgos nuevos que la amplían |

---

# 4. Conclusión Final

# El Blueprint es insuficiente para resolverla.

No se trata únicamente de que dos documentos se contradigan — eso podría dirimirse con una regla de precedencia. La revisión demuestra que **faltan tres elementos sin los cuales ninguna resolución documental es posible**:

1. **No está establecido que la «Biblioteca de Leads» y el `LeadRepository` sean el mismo almacén** (D-1, D-2, D-3). Sin esa identidad, las dos afirmaciones en conflicto podrían no versar sobre la misma proposición.
2. **No existe definición del evento que transforma una Empresa en Lead** (P2). Sin ella, ninguna de las dos redacciones puede validarse contra el modelo de dominio.
3. **APS-03 se contradice consigo mismo** sobre si la escritura forma parte del flujo (§7 frente a §8 y al diagrama APS-03-DIAG-002). El documento que sostiene la postura «empresas» no la sostiene de forma consistente.

A ello se añade que el Blueprint **carece de jerarquía documental declarada** —verificado en INDEX, ADS-00 y AF-00—, por lo que ni siquiera la precedencia entre APS-03 y ADR-05 puede determinarse por vía documental.

**Q-2 no admite respuesta demostrable con la documentación existente.** Su resolución requiere una decisión del Product Office, no un análisis adicional.

---

# 5. Referencias

## 5.1 Autoridad vigente (v1.1)

Documentos que **sustituyen** a éste y deben consultarse en su lugar:

- **PO-01** — Decisión de Producto: Definición Canónica de Lead §3, §4.
- **APS-03 v3.0** §7.1, §8.1, §8.2 · **APS-07 v2.0** §7.1, §8.1 · **APS-02 v2.1** §6, FR-008.
- **ADR-12** — Identidad Canónica del Lead · **ADR-13** — Motor Canónico de Persistencia.
- **PLAN-01** §7 (Fase 3) · **REV-03** (H-06, H-07) · **ADS-00 v1.2**.

## 5.2 Referencias originales (v1.0)

Se conservan sin modificar. Las citas de APS-02, APS-03, APS-07 y APS-08 remiten a las versiones vigentes en 2026-07-28, hoy corregidas.

APS-02 §6, Glosario · APS-03 §7, §8, §17.2 (APS-03-DIAG-002), Glosario · APS-07 §6, §7, §8, Glosario · APS-08 §7, §8 · ADR-04 §3 · ADR-05 §1, §2, §3, §4, §10, §11, §12, §15 · INDEX · ADS-00 · AF-00, AF-01, AF-02 · ATA-01
