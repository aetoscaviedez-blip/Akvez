# PO-01 — Decisión de Producto: Definición Canónica de Lead

| Campo | Valor |
| --- | --- |
| Código | PO-01 |
| Clasificación | Product Decision — Autoridad Funcional del Dominio |
| Versión | 1.2 |
| Estado | **Approved** |
| Fecha de creación | 2026-07-28 |
| Última actualización | 2026-07-30 |
| Redactado por | AKVEZ Architecture Team |
| Aprobado por | Product Office |
| Autoridad sobre | Dominio Empresa → Lead |
| Sustituye en autoridad a | Toda interpretación previa contenida en ADR-10, ADR-10A, ADR-11, DP-01, REV-01, REV-02, AR-01 |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-07-30 | Product Office | **Corrección puntual de §8.** Se separa la **emisión de la Propuesta** de la **transición a *Lead Contactado***: la Propuesta ya no produce cambio de estadio, y la transición la produce **la declaración del usuario**. El rótulo del estadio terminal pasa de «Lead con propuesta comercial generada» a «Lead respecto del cual el usuario ha declarado haber emitido un contacto». **Es el único cambio del documento:** §1 a §7, las cuatro *Reglas del ciclo* de §8, §9, §10 y §11 permanecen literalmente intactos. **Ninguna definición del dominio resulta modificada.** | Sprint **COM-09**, tarea 2. Aplica **PO-02 §5**: contactar es un acto en el mundo que AKVEZ **no realiza y no puede observar**, de modo que la única fuente veraz es la declaración del usuario. Marcar *Contactado* al generar un texto hacía que la Biblioteca afirmara algo que nadie había comprobado. **§8 era la raíz documental de esa conflación** (COM-08): APS-07, APS-03, ADR-13 y ADS-01 la transcribieron desde aquí. |
| 1.0 | 2026-07-28 | Architecture Team | Redacción inicial de la decisión canónica del dominio Empresa → Lead. | Cierre de la investigación documentada en DP-01, REV-01, REV-02 y AR-01. |
| 1.1 | 2026-07-29 | Product Office | **Aprobación formal.** Cambio de estado `Draft` → `Approved` y cumplimentación de la tabla de firmas (§11). **Ninguna decisión, definición ni sección de contenido ha sido modificada.** | Habilitar la Fase 0 de PLAN-01. Conforme a §11, los cambios enumerados en §9 no podían iniciarse antes de la firma. |

> **Naturaleza del documento.** Este documento **decide**. No analiza, no compara alternativas y no deja cuestiones abiertas. Una vez firmado, constituye la fuente canónica del dominio Empresa → Lead y prevalece sobre cualquier definición divergente del Blueprint hasta que estos se actualicen conforme a §9.

---

# 1. ¿Qué es una Empresa?

> **Una Empresa es un negocio real que AKVEZ ha encontrado y sobre el que dispone de información pública.**

Es un hecho del mundo, no un juicio. Que una Empresa exista en AKVEZ no significa que sea buena, mala, prometedora ni relevante. Significa únicamente que AKVEZ sabe que existe y ha recogido lo que es público sobre ella: nombre, ubicación, categoría, sitio web si lo tiene, datos de contacto y reputación visible.

Una Empresa no pertenece a nadie. Es información del mercado.

---

# 2. ¿Qué es un Lead?

> **Un Lead es una Empresa que AKVEZ ha incorporado al espacio de trabajo comercial de un usuario concreto.**

En términos que cualquier Product Manager reconoce: un Lead es **una Empresa que ha entrado en tu embudo**. No es una promesa de que vaya a convertir. No es una garantía de calidad. Es una Empresa sobre la que AKVEZ va a trabajar para ti: analizarla, puntuarla, priorizarla y, si decides, redactar tu primer contacto.

La diferencia entre Empresa y Lead **no es de calidad, es de pertenencia**. La Empresa pertenece al mercado; el Lead pertenece a tu embudo.

Un Lead **no necesita** estar analizado, tener puntuación, superar ningún umbral ni ocupar ninguna posición en un ranking. Todo eso son cosas que le ocurren **después** de ser Lead, y que lo enriquecen sin cambiar lo que es.

---

# 3. ¿Cuál es el evento que convierte una Empresa en Lead?

> ## **El Registro.**
>
> **Una Empresa se convierte en Lead en el momento exacto en que AKVEZ la incorpora a la Biblioteca de Leads del usuario, inmediatamente después de descubrirla y comprobar que no estaba ya presente.**

Esta es la única definición válida. No existen otras.

## Justificación de producto

**Porque el usuario no nos pide un filtro, nos pide memoria.** APS-01 §5 declara que AKVEZ existe para resolver, entre otros problemas, la «pérdida de tiempo en empresas con baja probabilidad de conversión». Para no hacerle perder tiempo con una empresa mediocre, AKVEZ tiene que **recordar que ya la valoró como mediocre**. Si solo registrásemos lo bueno, mañana volveríamos a presentarle lo malo como si fuera nuevo. El olvido selectivo produce exactamente el problema que prometimos eliminar.

**Porque evitar duplicados es criterio de éxito de la V1.** APS-02 §9 lo declara así. Un mecanismo de deduplicación solo funciona si la memoria contiene todo lo visto. Cualificar antes de registrar rompería la funcionalidad que define el éxito del producto.

**Porque el juicio comercial llega después, no antes.** Analizar y puntuar son operaciones que AKVEZ realiza **sobre** un Lead. Exigir que una Empresa esté ya juzgada para ser Lead invertiría el orden del trabajo: no se puede analizar lo que aún no ha entrado.

**Porque es el momento en que aparece una relación.** Antes del Registro, la Empresa es información de mercado, igual para todos. Después del Registro, es *tu* lead: tiene historial contigo, estado contigo y trazabilidad contigo. Ese cambio de pertenencia es el hecho relevante para el producto, y ocurre al registrar.

---

# 4. ¿Qué representa la Biblioteca de Leads?

> **La Biblioteca de Leads almacena todas las Empresas descubiertas para un usuario, cada una con todo el conocimiento acumulado sobre ella.**
>
> **Y como el Registro es lo que convierte una Empresa en Lead (§3), todo lo que hay en la Biblioteca es, por definición, un Lead.**

Una única definición, sin excepciones. La Biblioteca **no** almacena solo empresas calificadas, ni solo las analizadas, ni solo las entregadas al usuario.

**Qué es funcionalmente:** la memoria comercial del usuario. Todo lo que AKVEZ ha visto para él, con lo que sabe de cada cosa. Es lo que permite decir «esto ya te lo mostré», «esto lo descartaste», «esto lo contactaste hace quince días».

**Qué no es:** no es una lista de resultados de búsqueda ni una selección de recomendados. Los resultados que el usuario ve en pantalla son una **vista** sobre la Biblioteca, ordenada por prioridad. La vista cambia; la Biblioteca solo crece.

**El nombre es correcto.** Contiene Leads, porque entrar en ella es precisamente lo que convierte una Empresa en Lead.

---

# 5. ¿Qué representa el Opportunity Score?

**Cuándo aparece.** Después del Análisis. El orden oficial es: primero AKVEZ analiza la presencia digital de la Empresa, y con ese conocimiento calcula la puntuación. Un Lead recién registrado **no tiene** Opportunity Score, y eso es un estado válido y esperado.

**Qué significa.** Un número de 0 a 100 que expresa cuánto potencial comercial tiene ese Lead **para este usuario concreto**, según los criterios de APS-08. Se traduce a cinco bandas legibles, de «Oportunidad Excelente» a «Oportunidad Muy Baja».

**Qué cambia en el ciclo de vida.** **No cambia lo que el Lead es; cambia lo que el Lead vale.** No lo promueve, no lo degrada y no lo expulsa. Es un atributo que se le añade, y su única función operativa es **permitir ordenar**: un Lead con puntuación alta aparece antes que uno con puntuación baja.

Un Lead sin puntuación sigue siendo un Lead. Un Lead con puntuación 12 sigue siendo un Lead.

---

# 6. ¿Debe existir Top N?

> # **No.**

No existe, no debe existir y no formará parte del dominio de AKVEZ.

**Por qué pertenece únicamente a la infraestructura.** AKVEZ nunca ha prometido al usuario «diez oportunidades». Ha prometido que sepa **cuáles son las mejores** (APS-01 §6) y que no pierda tiempo con las peores. Eso se cumple **ordenando**, no recortando.

Cualquier número que limite cuántos leads se procesan en una tanda, cuántos se analizan por llamada a un proveedor externo o cuántos se pintan en una pantalla es una **restricción de una herramienta**, no una regla del negocio. Esas restricciones son legítimas y necesarias, pero deben vivir donde nacen: en la integración o en la interfaz.

**Regla vinculante:** ninguna limitación técnica podrá determinar qué Leads existen, cuáles se registran ni cuáles se conservan. Si mañana cambiamos de proveedor de análisis y su tanda admite el doble, el conjunto de Leads del usuario **no debe cambiar**.

---

# 7. ¿Debe existir un umbral mínimo?

> # **No.**

Ninguna puntuación mínima excluirá a un Lead de la Biblioteca ni de la vista del usuario.

**Cómo se prioriza entonces.** Por **orden y etiqueta**, no por exclusión:

1. Los Leads se presentan ordenados de mayor a menor Opportunity Score. APS-08 §8 ya lo exige para la banda alta: «Debe aparecer entre los primeros resultados».
2. Cada Lead muestra su banda —de «Excelente» a «Muy Baja»—, de modo que el usuario sabe en un vistazo qué tiene delante.
3. Lo bueno sube, lo flojo baja. Nada desaparece.

**Por qué no ocultamos.** APS-01 §8.2 es explícito: «La IA existirá para potenciar el criterio del usuario, **no para sustituirlo**». Un umbral automático sustituye el criterio del usuario: decide por él que una empresa no merece su atención. AKVEZ ordena y explica; el usuario decide.

Además, el juicio de AKVEZ es probabilístico. Una empresa con puntuación baja puede ser el mejor cliente de un diseñador que conoce ese nicho. Ocultársela sería un error del que nunca nos enteraríamos.

---

# 8. Ciclo de Vida Oficial

```text
        EMPRESA
   Negocio real encontrado por AKVEZ.
   Información pública. Sin juicio comercial.
             │
             │   ◆ REGISTRO — Lead Hunter
             │     Se comprueba que no esté ya en la Biblioteca
             │     y se incorpora al espacio del usuario.
             │     ← AQUÍ NACE EL LEAD
             ▼
          LEAD
   Empresa incorporada al embudo del usuario.
   Sin análisis. Sin puntuación. Estado válido.
             │
             │   ◆ ANÁLISIS — Lead Analyzer
             │     Se estudia su presencia digital y se detectan
             │     carencias y oportunidades de mejora.
             ▼
     LEAD ANALIZADO
   Lead enriquecido con el diagnóstico de AKVEZ.
             │
             │   ◆ EVALUACIÓN — Lead Analyzer
             │     Se calcula el Opportunity Score (0-100)
             │     y se asigna su banda.
             ▼
     LEAD EVALUADO
   Lead con puntuación y banda. Ordenable y priorizable.
   ── Todos los Leads evaluados se muestran al usuario,
      ordenados por puntuación. Ninguno se oculta. ──
             │
             │   ◆ PROPUESTA — Pitch Generator
             │     Se diseña la secuencia y se redacta el contacto.
             │     El Lead NO cambia de estadio.
             │
             │   ◆ CONTACTO — el usuario
             │     El usuario emite el contacto y lo declara.
             ▼
     LEAD CONTACTADO
   Lead respecto del cual el usuario ha declarado
   haber emitido un contacto.
             │
             ▼
   (Fases posteriores a la V1: seguimiento, cliente potencial,
    cliente confirmado — fuera del alcance de esta decisión)
```

**Reglas del ciclo:**

- **Es un solo sujeto que evoluciona.** Empresa y Lead no son dos cosas distintas: son la misma Empresa en dos momentos de su relación con el usuario.
- **Nada se reemplaza.** Cada etapa **añade** conocimiento. El diagnóstico no borra los datos públicos; la puntuación no borra el diagnóstico.
- **Ninguna etapa expulsa.** Un Lead que entra en la Biblioteca permanece en ella. Puede quedar el último en la lista; no puede desaparecer.
- **Detenerse es válido.** Un Lead puede quedarse indefinidamente en cualquier estado. Un Lead sin analizar es un Lead. Un Lead evaluado y nunca contactado es un Lead.

---

# 9. Impacto Esperado

Enumeración, sin describir el modo de ejecución.

## 9.1 APS que deberán actualizarse

| Documento | Sección |
| --- | --- |
| **APS-02** | §6 (definición de Biblioteca de Leads) · Glosario (Biblioteca de Leads; Lead Hunter) |
| **APS-03** | §7 (responsabilidades de Lead Hunter y salidas) · §8 (el flujo debe incluir el Registro) · §17.2, diagrama APS-03-DIAG-002 (debe reflejar la escritura) · Glosario (Biblioteca de Leads) |
| **APS-07** | §6 (nomenclatura de estados) · §8 y Glosario (definición del contenido de la Biblioteca) |
| **APS-08** | Incorporar que no existe umbral de exclusión |

## 9.2 ADR que deberán revisarse

| Documento | Motivo |
| --- | --- |
| **ADR-10** | Su decisión sobre la posición y el alcance del Registro queda sustituida por §3 y §4 |
| **ADR-10A** | Sus definiciones quedan sustituidas por §1, §2 y §3 |
| **ADR-11** | Reescritura; §6 resuelve su objeto |
| **ADR-02** | §8 — aclaración del bloque `Scoring` |
| **ADR-05** | §12 — alineación terminológica |

## 9.3 Código afectado

- Caso de uso de descubrimiento.
- Caso de uso de análisis.
- Agent API del Lead Analyzer.
- Orchestrator de adquisición.
- Composition Root.
- Adaptador de persistencia de Leads.

## 9.4 Consecuencia que debe declararse expresamente

**Esta decisión revierte el alcance de H-04.** H-04 estableció que se registrasen únicamente los Leads entregados al usuario. Conforme a §3 y §4, deben registrarse **todas** las Empresas descubiertas. El Registro vuelve además al Lead Hunter, conforme a §8.

H-04 permanece operativo y sin modificar hasta que esta decisión se apruebe y se planifique su ejecución.

---

# 10. Decisión Final

> **Una Empresa es un negocio real del que AKVEZ dispone de información pública.**
>
> **Una Empresa se convierte en Lead en el momento del Registro: cuando AKVEZ la incorpora a la Biblioteca de Leads del usuario, tras descubrirla y comprobar que no estaba ya presente. Ese es el único evento de cualificación.**
>
> **La Biblioteca de Leads contiene todas las Empresas descubiertas para el usuario, cada una con su conocimiento acumulado. Todo lo que contiene es un Lead.**
>
> **El Análisis y el Opportunity Score enriquecen al Lead y determinan su prioridad. No lo crean, no lo promueven y no lo expulsan.**
>
> **No existe Top N. No existe umbral mínimo. AKVEZ ordena y explica; no oculta.**

Esta decisión es única, no admite alternativas y no deja cuestiones abiertas. Una vez firmada, cualquier definición divergente del Blueprint queda derogada de hecho y deberá corregirse conforme a §9.

---

# 11. Firma

| Rol | Nombre | Fecha | Firma |
| --- | --- | --- | --- |
| Product Owner | Jessika | 2026-07-29 | Firmado |
| Architecture Team | AKVEZ Architecture Team | 2026-07-29 | Firmado |

Los cambios sobre APS, ADR y código enumerados en §9 **no podrán iniciarse** antes de la firma de este documento.

> **Estado de la condición.** Cumplida el 2026-07-29. Este documento queda **Approved** y constituye la fuente canónica del dominio Empresa → Lead. Los cambios enumerados en §9 quedan habilitados y se ejecutarán conforme a PLAN-01.
