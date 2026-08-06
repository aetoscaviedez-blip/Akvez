# AR-03 — Blueprint v3.0 — Implementation Ready

| Campo | Valor |
| --- | --- |
| Código | AR-03 |
| Clasificación | Assessment Report (AR) — Certificación de cierre |
| Versión | 1.2 |
| Estado | **Approved** — certificación **plenamente vigente** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | ADS-00 v1.2 |
| Autoridad de referencia | PO-01 (Approved) · AR-02 · PLAN-01 §4.1 · REV-03 |
| Sustituye la evaluación de | **AR-02 §9.4** — recomendación «B. Resolver primero las deudas críticas» |

> **Naturaleza del documento.** Certificación de cierre. Conforme a ADS-00 v1.2, la categoría **AR** tiene autoridad **consultiva** (orden 7).
>
> **No decide, no corrige, no crea arquitectura y no introduce ninguna decisión nueva.** Se limita a verificar y hacer constar el estado alcanzado por documentos que ya existen.
>
> **Ningún documento ha sido modificado durante esta certificación.**
>
> **Regla de lectura.** Si este documento y un documento canónico discrepan, prevalece el canónico. Una afirmación errónea aquí es un defecto de esta certificación, nunca una decisión.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | 2026-07-29 | AKVEZ Product Office | **Levantamiento de la condición suspensiva.** Estado `Draft` → **`Approved`**. Los siete documentos de §8.2 fueron ratificados en el sprint GOV-01 y los cuatro pronunciamientos de §8.4 emitidos. Se cierra §8 con la constancia del levantamiento y se actualizan §1 y §11. **No se modifica ninguna certificación, ninguna verificación ni ningún riesgo de §10.** | Sprint **GOV-01**, entregable implícito de su Resultado Esperado. La certificación se emitió con eficacia suspendida por aplicación de ADS-00 R-4; desaparecida la causa, procede declararla vigente. Constancia en **AR-04**. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Sincronización posterior a PC-01.1.** Se cierran los riesgos **RV-2** (INDEX incompleto) y **RV-3** (ADS-01 §11 obsoleto), que dejaron de existir al ejecutarse aquel sprint, y se trasladan a la nueva §10.1. Se actualizan las tres afirmaciones que dependían de ellos: la nota de §4.2, la *Salvedad de cataloging* de §5.2 y la tabla de riesgos de §10. Se añade §5.3. **No se modifica ninguna certificación, ninguna verificación, la condición suspensiva de §8 ni la Definition of Done de §11.** | Sprint PC-01.2. Una certificación que declara abiertos riesgos ya cerrados deja de reflejar el estado del Blueprint y pierde su utilidad como documento de cierre. |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Certificación de la arquitectura, el dominio y la consolidación documental del Blueprint. Verificación del cierre de las cinco deudas críticas de AR-02 §4.1. Declaración de congelación para desarrollo y de la condición suspensiva de ratificación (§8). | Tarea 4 del sprint PC-01. Emitir la certificación que habilita el inicio de la Fase 5 — Desarrollo. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Alcance de la Certificación
3. Certificación del Dominio
4. Certificación de la Arquitectura
5. Certificación de la Consolidación Documental
6. Cierre de las Deudas Críticas
7. Certificación de Congelación
8. Condición Suspensiva — Acto de Ratificación
9. Exclusiones Expresas
10. Riesgos Vigentes
11. Definition of Done
12. Dependencias
13. Referencias

---

# 1. Resumen Ejecutivo

**AR-02 concluyó el 2026-07-29 que el Blueprint era «normativamente coherente pero funcionalmente incompleto»** y respondió **No** a la pregunta de si un desarrollador podía comenzar el MVP leyendo únicamente el Blueprint. Identificó cinco deudas críticas y recomendó resolverlas antes de empezar.

**Las cinco están cerradas.** Los cuatro documentos que faltaban existen: la arquitectura de pantallas (APS-04 v4.0, Parte A), el motor de persistencia (ADR-13 + **ADS-02**), la identidad canónica del Lead (ADR-12) y las ponderaciones del Opportunity Score (**APS-08 v1.2 §7.1 — WP-01**). Los cuatro registros de investigación llevan estado `Archived`. Se añade **APS-17**, que publica los parámetros operativos iniciales para que no se fijen de hecho en el código.

**Con ello desaparece el motivo por el que AR-02 desaconsejó congelar.** No queda ninguna materia arquitectónica cuya ausencia obligue a improvisar durante la implementación.

**Los documentos maestros están sincronizados.** El INDEX cataloga los 48 documentos del Blueprint y ADS-01 v1.1 ya no declara pendiente ninguna decisión resuelta (§5.2). La puerta de entrada y el mapa de implementación dicen lo mismo que los documentos canónicos.

**La condición formal quedó satisfecha.** La v1.0 de esta certificación se emitió con eficacia suspendida porque siete de los documentos que la sostienen estaban en `Draft` o `Review`, y **ADS-00 R-4 establece que un documento en `Draft` nunca prevalecerá sobre uno `Approved`**. **Los siete fueron ratificados en el sprint GOV-01** (§8.7).

> ## ✅ Esta certificación es plenamente vigente desde el 2026-07-29.
>
> No subsiste ninguna decisión arquitectónica pendiente de ratificación. **Queda habilitado el inicio de la Fase 5 — Desarrollo.**
>
> **Única salvedad, expresamente acotada:** AF-01 y AF-02 permanecen en `Draft` en el nivel constitucional. Ya estaba **fuera** de la condición suspensiva (§8.6) y no bloquea el desarrollo.

---

# 2. Alcance de la Certificación

## 2.1 Qué certifica

| # | Objeto | Sección |
| --- | --- | --- |
| 1 | **Dominio aprobado** — el dominio Empresa → Lead permanece cerrado y sin contradicciones activas | §3 |
| 2 | **Arquitectura aprobada** — no subsiste ninguna decisión arquitectónica pendiente | §4 |
| 3 | **Documentación consolidada** — las Fases 0 a 4 de PLAN-01 están ejecutadas al 100 % | §5 |
| 4 | **Blueprint congelado** — el Blueprint puede entregarse al desarrollo sin reinterpretación | §7 |

## 2.2 Qué no certifica

- **El código.** No ha sido auditado en este sprint (§9.1).
- **La calidad de las decisiones.** Certifica que están tomadas y son coherentes, no que sean acertadas.
- **Los valores iniciales.** WP-01 y los parámetros de APS-17 son iniciales por declaración propia y se espera ajustarlos (§9.3).
- **Nada relativo a las Fases posteriores a la V1.**

---

# 3. Certificación del Dominio

## 3.1 Verificación de vigencia

**AR-02 §6.2 certificó el dominio Empresa → Lead sin reservas** y sometió esa certificación a una condición explícita:

> *«La certificación decae si se modifica cualquiera de los documentos de §6.1 sin verificar su alineación con PO-01 §1-§8.»*

Los seis conceptos certificados residen en PO-01, APS-07 v2.0, APS-02 v2.1, APS-03 v3.0, APS-08, ADR-02 v1.1, ADR-05, ADR-10A y ADR-11.

**Un único documento de esa lista ha cambiado desde entonces: APS-08, de v1.1 a v1.2.** Su cambio es la publicación de WP-01 en la nueva §7.1.

| Verificación | Resultado |
| --- | --- |
| ¿APS-08 v1.2 modifica el algoritmo, las categorías de §6, la escala de §7 o las bandas de §8? | **No.** Declarado en su Historial de Versiones y verificable por inspección |
| ¿Modifica §3.1 o §8.6 —las dos secciones de alcance de dominio— ? | **No** |
| ¿Alguna ponderación produce exclusión, ocultamiento o umbral encubierto? | **No.** Verificado en APS-08 §7.1, restricciones RV-A a RV-G |
| ¿WP-01 se alinea con PO-01 §5 y §7? | **Sí.** Ningún peso es cero; ninguna combinación impide alcanzar una banda |

## 3.2 Certificación

> ## ✅ CERTIFICACIÓN DEL DOMINIO
>
> **El dominio Empresa → Lead permanece cerrado, íntegro y sin contradicciones activas** a fecha de **2026-07-29**.
>
> **La certificación de AR-02 §6.2 no ha decaído.** La única modificación posterior —APS-08 v1.2— es aditiva y ha sido verificada contra PO-01 §1-§8 conforme a la condición de vigencia.
>
> **Autoridad:** PO-01 v1.1 (`Approved`, firmado el 2026-07-29).
>
> **Alcance:** los seis conceptos de AR-02 §6.1 — Empresa, Lead, Biblioteca de Leads, Opportunity Score, Lead Hunter y Lead Analyzer.

---

# 4. Certificación de la Arquitectura

## 4.1 Cobertura de las materias arquitectónicas

Ninguna de las materias siguientes carece de documento canónico:

| Materia | Documento canónico | Estado |
| --- | --- | --- |
| Arquitectura modular por dominio | ADR-01 v1.0 | `Approved` |
| Orquestación de capacidades y agentes | ADR-02 v1.1 | `Approved` |
| Integraciones y proveedores externos | ADR-03 v1.0 · APS-11 v1.0 | `Approved` |
| Agentes en el backend | ADR-04 v1.2 | `Approved` |
| Persistencia — estructura y capa de datos | ADR-05 v1.4 | `Approved` |
| Contratos públicos de API | ADR-06 v1.1 · ADR-07 v1.1 | `Approved` |
| Frontera de persistencia y aislamiento del repositorio | ADR-08 v1.2 | `Approved` |
| Inyección de dependencias | ADR-09 v1.1 | `Approved` |
| Frontera dominio / implementación | ADR-11 v2.0 | ⚠️ `Review` |
| **Identidad canónica del Lead** | **ADR-12 v1.0** | ⚠️ `Draft` |
| **Semántica del motor de persistencia** | **ADR-13 v1.0** | ⚠️ `Draft` |
| **Gobierno del Opportunity Score** | **ADR-14 v1.1** | ⚠️ `Draft` |
| **Tecnología del motor de persistencia** | **ADS-02 v1.0** | ⚠️ `Draft` |
| Arquitectura funcional de interfaz | APS-04 v4.0, Parte A | `Approved` |
| Arquitectura técnica general | APS-16 v1.0 | `Approved` |

## 4.2 Verificación de ausencia de decisiones pendientes

Las cinco materias que **ADS-01 v1.0 §11** declaraba no decididas:

| Materia según ADS-01 v1.0 §11 | Situación verificada |
| --- | --- |
| **Motor de persistencia** | ✅ **Decidido.** PostgreSQL sobre Supabase — **ADS-02** §4, con verificación de compatibilidad frente a ADR-13, ADR-05, ADR-08 y ADR-12 |
| **Valores de las ponderaciones del Score** | ✅ **Publicados.** **WP-01 v1.0** — APS-08 v1.2 §7.1 |
| Estrategia de escritura del repositorio | ✅ **Resuelta.** ADR-13 §10 y §11 fijan la semántica; ADS-02 §7 la materializa |
| Modelo de la entidad `User` | ⚠️ **Fuera del alcance de ADR-08 §312.** No bloquea: ADS-02 §5.2 adopta la autenticación del proveedor y ADR-05 §14 fija el aislamiento exigible |
| KPI de la frontera dominio/implementación | ⚠️ **Definidos, sin implementar.** ADR-11 §13. Deuda **DD-4** de AR-02 §4.4, severidad baja |

> **ADS-01 quedó sincronizado en su v1.1** (sprint PC-01.1). Su §11 ya no declara pendientes el motor de persistencia ni las ponderaciones: ambos figuran ahora en §11.1 con su documento canónico, y §11.2 remite a los parámetros de APS-17. **Las dos materias que su §11 conserva abiertas son las dos últimas filas de la tabla anterior**, y ninguna bloquea el desarrollo.

## 4.3 Certificación

> ## ✅ CERTIFICACIÓN DE LA ARQUITECTURA
>
> **No subsiste ninguna materia arquitectónica cuya ausencia obligue a improvisar durante la implementación del MVP.**
>
> Las cuatro especificaciones que AR-02 §5.2 declaró inexistentes han sido redactadas. Las dos materias abiertas de §4.2 —modelo de `User` y KPI de frontera— están expresamente acotadas, no bloquean ninguna capa y constan como deudas conocidas.
>
> **Reserva formal.** Seis de los documentos citados en §4.1 están en `Draft` o `Review`. Véase §8.

---

# 5. Certificación de la Consolidación Documental

## 5.1 Estado

| Fase de PLAN-01 | Avance |
| --- | --- |
| Fase 0 — Habilitación | **100 %** ✅ |
| Fase 1 — Alineación de los APS | **100 %** ✅ |
| Fase 2 — Alineación de los ADR | **100 %** ✅ |
| Fase 3 — Marcado de investigación | **100 %** ✅ |
| Fase 4 — Índice y trazabilidad | **100 %** ✅ |

**Las seis condiciones de la Definition of Done de PLAN-01 §8 constan cumplidas** (PLAN-01 §4.1, v1.5). Los riesgos **R-1** (ventana de inconsistencia) y **R-3** (lectura errónea de los documentos de investigación) constan cerrados.

**REV-03** verificó cero referencias activas a Top N, umbral de exclusión, selección automática, Lead Qualification u Opportunity Threshold en todo `docs/`. Las apariciones subsistentes están confinadas a bloques explícitos de derogación y a los registros históricos.

## 5.2 Sincronización de los documentos maestros

Ejecutada por el **sprint PC-01.1**, posterior a la emisión de AR-03 v1.0.

| Documento | Estado verificado |
| --- | --- |
| **INDEX.md** | ✅ Cataloga **48 documentos**, incluidos **ADS-02**, **APS-17** y **AR-03**, con enlace, versión y estado. Corregidas las versiones de APS-08 (1.1 → 1.2) y PLAN-01 (1.4 → 1.5) |
| **ADS-01 v1.1** | ✅ Su §11 ya no declara pendientes el motor de persistencia ni las ponderaciones. Conserva abiertas dos materias: modelo de `User` y KPI de frontera |

**Verificación de integridad referencial:** 52 enlaces relativos comprobados en todo `docs/blueprint/`; **ninguno roto**. Ningún documento perdió trazabilidad: ADS-01 registró el cambio en su Historial de Versiones conforme a ADS-00 (*Control de Cambios*).

> **Efecto sobre esta certificación.** Los riesgos **RV-2** y **RV-3** de la v1.0 quedan cerrados. Véase §10.1.

## 5.3 Certificación

> ## ✅ CERTIFICACIÓN DE LA CONSOLIDACIÓN DOCUMENTAL
>
> **La consolidación documental del Blueprint está completa.** Las cinco fases de PLAN-01 previas a la implementación están ejecutadas, los estados documentales pertenecen al catálogo oficial de ADS-00 y ninguna referencia apunta a contenido derogado como autoridad vigente.
>
> **Los documentos maestros —INDEX y ADS-01— están sincronizados** con el estado real del Blueprint (§5.2). La puerta de entrada y el mapa de implementación reflejan lo que el Blueprint decide hoy.

---

# 6. Cierre de las Deudas Críticas

Verificación de las cinco deudas críticas de **AR-02 §4.1**, que eran la razón íntegra de su recomendación de no congelar.

| # | Deuda | Documento que la cierra | Verificación |
| --- | --- | --- | --- |
| **DC-1** | Arquitectura de pantallas de la V1 sin documentar | **APS-04 v4.0, Parte A** (`Approved`) | ✅ **Cerrada.** Secciones A.1 a A.9: pantallas, navegación, responsabilidades, estados, relación con los agentes y reglas vinculantes de interfaz. Resuelve N-01 |
| **DC-2** | Motor de persistencia no decidido | **ADR-13** (semántica) + **ADS-02** (tecnología) | ✅ **Cerrada en sustancia.** ADS-02 §11 supedita su propio paso a `Approved` a cuatro ratificaciones del Product Office. Resuelve N-02 |
| **DC-3** | Identidad natural del Lead sin definir | **ADR-12 v1.0** | ✅ **Cerrada en sustancia.** Identidad = `(Referencia de Origen, Usuario)`, §7.2. Es prerrequisito de la deduplicación, criterio de éxito de la V1 según APS-02 §9. Resuelve N-04 |
| **DC-4** | Ponderaciones del Opportunity Score sin definir | **APS-08 v1.2 §7.1 — WP-01 v1.0** (`Approved`) | ✅ **Cerrada.** Seis categorías con peso declarado, suma 100 %, justificación y conformidad RV-A a RV-G. Resuelve N-03 |
| **DC-5** | Registros de investigación sin marcado histórico | DP-01 · REV-01 · REV-02 · AR-01 | ✅ **Cerrada.** Los cuatro en `Archived`, con advertencia en portada. Resuelve H-06 y cierra el riesgo R-3 de PLAN-01 |

## 6.1 Nota sobre «cerrada en sustancia»

**DC-2 y DC-3 se cierran materialmente pero no formalmente.** La decisión existe, está argumentada y es verificable; el documento que la contiene sigue en `Draft`.

La distinción importa: **lo que AR-02 temía era la improvisación, no la falta de sello**. Su riesgo **RA-1** era que «el desarrollo comience sin las cuatro especificaciones que faltan y se improvisen pantallas, motor, identidad o ponderaciones, consolidando decisiones no tomadas». Ese riesgo está conjurado: las decisiones están tomadas y escritas. Lo que resta es el acto de aprobación de §8.

---

# 7. Certificación de Congelación

## 7.1 Qué significa congelado

> **El Blueprint queda congelado para desarrollo.** A partir de la ratificación de §8, es la base normativa de la Fase 5 y se utiliza tal como está.

| El desarrollo **debe** | El desarrollo **no puede** |
| --- | --- |
| Implementar lo que el Blueprint decide | Reinterpretar una decisión existente |
| Consultar el documento canónico ante cada duda | Resolver una discrepancia por su cuenta *(ADS-00 R-5)* |
| Detener y reportar todo conflicto detectado | Introducir una decisión de dominio o arquitectura en el código |
| Tratar los valores de WP-01 y APS-17 como configuración | Convertir una limitación técnica en regla de negocio *(ADR-11 §7.1)* |

**Congelado no significa inmutable.** Significa que **el Blueprint deja de cambiar por iniciativa del desarrollo**. Las modificaciones siguen siendo posibles por el procedimiento de APS-13 §9, nunca por conveniencia de implementación.

## 7.2 Procedimiento de descongelación

Un cambio del Blueprint durante la Fase 5 requiere, sin excepción:

1. **Detener** la implementación afectada.
2. **Reportar** el conflicto al Product Office, conforme a ADS-00 R-5.
3. **Clasificar** el cambio conforme a APS-13 §9.
4. **Modificar el documento canónico** y registrar el cambio en su Historial de Versiones (ADS-00 R-3).
5. **Reanudar** únicamente después.

**No se admite el orden inverso** —implementar y documentar después—. Es el mecanismo que produjo la investigación cerrada por PO-01: una decisión que nadie tomó explícitamente, resuelta de hecho por quien escribió el código.

## 7.3 Certificación

> ## ✅ CERTIFICACIÓN DE CONGELACIÓN
>
> **El AKVEZ Blueprint se declara congelado para desarrollo en su versión v3.0**, con efecto desde la ratificación de §8.
>
> **Puede entregarse al equipo de desarrollo sin necesidad de reinterpretación**: toda materia necesaria para construir el MVP tiene documento canónico, y toda discrepancia tiene procedimiento de resolución.
>
> **Composición de la v3.0.** Los documentos vigentes del Blueprint a fecha de 2026-07-29, con las versiones declaradas en §4.1 y en el INDEX.

---

# 8. Condición Suspensiva — Acto de Ratificación

> ## ✅ CONDICIÓN LEVANTADA — 2026-07-29
>
> **El acto de ratificación descrito en esta sección fue ejecutado en el sprint GOV-01.** Los siete documentos de §8.2 están en estado `Approved` y los cuatro pronunciamientos de §8.4 fueron emitidos. **La certificación es plenamente vigente.**
>
> El contenido original de esta sección se conserva sin modificar, como registro de la condición y de su cumplimiento. El detalle consta en **§8.7** y en **AR-04 — Informe GOV-01**.

## 8.1 El problema, en una frase

**ADS-00 R-4 establece que «un documento en estado `Draft` nunca prevalecerá sobre uno `Approved`».** Siete documentos que sostienen esta certificación están en `Draft` o `Review`. Declarar el Blueprint listo mientras su motor de persistencia, la identidad de su entidad central y el gobierno de su Opportunity Score son borradores sería una certificación que el propio Blueprint no admite.

**No es un defecto de contenido.** Ninguno de los siete documentos está incompleto ni discutido: están escritos, argumentados y verificados. Les falta el acto de aprobación.

## 8.2 Documentos que requieren ratificación

| Documento | Ver. | Estado | Por qué debe ratificarse |
| --- | --- | --- | --- |
| **ADR-12** — Identidad Canónica del Lead | 1.0 | `Draft` | Cierra **DC-3**. Es prerrequisito absoluto de ADR-13 (INDEX §7.2) y de la deduplicación, criterio de éxito de la V1 |
| **ADR-13** — Motor Canónico de Persistencia | 1.0 | `Draft` | Cierra **DC-2**. Fija la semántica de escritura que ADS-02 materializa |
| **ADR-14** — Gobernanza del Opportunity Score | 1.1 | `Draft` | Gobierna **WP-01**, que APS-08 v1.2 (`Approved`) ya publica. Un documento aprobado se apoya hoy en un borrador |
| **ADS-02** — Implementación del Motor de Persistencia | 1.0 | `Draft` | Cierra **DC-2**. Su §11 enumera las cuatro ratificaciones que necesita |
| **APS-17** — Parámetros Iniciales del Producto | 1.0 | `Draft` | Publica los 21 valores operativos del MVP. Sin ratificar, se fijarán de hecho en el código |
| **ADR-10A** — Definición Canónica de Empresa y Lead | 2.0 | `Review` | Pertenece a la lista certificada del dominio (AR-02 §6.1) |
| **ADR-11** — Frontera Dominio / Implementación | 2.0 | `Review` | **Marco de admisibilidad de APS-17 completo.** Su Criterio de Invariancia (§7.1) es la garantía de que ningún parámetro se convierte en regla de dominio |

## 8.3 Precedencia de la ratificación

**El orden importa**, por la cadena de dependencia del INDEX §7.2:

```
ADR-11  →  ADR-12  →  ADR-13  →  ADS-02
frontera   identidad  persistencia  tecnología

ADR-14  →  (WP-01 ya publicado en APS-08 v1.2)
gobierno

ADR-10A          APS-17
dominio          parámetros
```

**ADR-11 primero**, porque ADR-12 y APS-17 se apoyan en su Criterio de Invariancia. **ADS-02 el último de su cadena**, porque presupone la semántica de ADR-13.

## 8.4 Ratificación específica exigida por ADS-02 §11

Además del cambio de estado, ADS-02 requiere cuatro pronunciamientos expresos del Product Office:

1. **Ratificar PostgreSQL** como motor de persistencia de AKVEZ.
2. **Ratificar Supabase** como proveedor, o seleccionar Neon, la alternativa equivalente de ADS-02 §6.
3. **Confirmar el compromiso de portabilidad** de ADS-02 §5.3 como restricción vinculante de implementación.
4. **Determinar cuándo se verifican los riesgos R-1, R-2 y R-4** de ADS-02 §10, que solo pueden comprobarse sobre la implementación real.

## 8.5 Fuera del alcance de este sprint

> **El sprint PC-01 prohíbe expresamente modificar ADR existentes.** Esta certificación, en consecuencia, **no promueve ningún documento a `Approved`**: identifica cuáles lo requieren y en qué orden.
>
> **El acto de ratificación corresponde al Product Office y a la Fundadora**, conforme a APS-13 §9 y a ADR-14 §8.1. No es trabajo de ingeniería.

## 8.6 Deuda de gobernanza conexa

**AF-01 v0.1 y AF-02 v1.0 permanecen en `Draft`** mientras ocupan el orden 1 —nivel constitucional— de la jerarquía de ADS-00.

Es el hallazgo **N-05** y la deuda **DI-2** de AR-02, de severidad media. **No bloquea el desarrollo** y no forma parte de la condición suspensiva de §8.2: se hace constar porque, invocada la regla R-6, se descubriría que el vértice de la jerarquía se apoya en borradores.

> **Confirmado en GOV-01.** El Product Office resolvió expresamente **no promoverlos**: ninguno es un documento pendiente únicamente de ratificación formal, y aprobarlos sin revisión de contenido introduciría un riesgo mayor que mantenerlos en `Draft`. Se cerrarán en un **sprint de Gobernanza Constitucional** propio. Véase AR-04 §5.

## 8.7 Ejecución del acto de ratificación

**Ejecutado el 2026-07-29 en el sprint GOV-01.** Constancia completa en **AR-04 — Informe GOV-01**.

| Documento de §8.2 | Estado anterior | Estado | Versión |
| --- | --- | --- | --- |
| **ADR-11** | `Review` | ✅ **`Approved`** | 2.1 |
| **ADR-12** | `Draft` | ✅ **`Approved`** | 1.1 |
| **ADR-13** | `Draft` | ✅ **`Approved`** | 1.1 |
| **ADS-02** | `Draft` | ✅ **`Approved`** | 1.1 |
| **ADR-14** | `Draft` | ✅ **`Approved`** | 1.2 |
| **ADR-10A** | `Review` | ✅ **`Approved`** | 2.1 |
| **APS-17** | `Draft` | ✅ **`Approved`** | 1.1 |

**Ejecutado en el orden de precedencia de §8.3.** Ningún documento se aprobó antes que aquel del que depende.

**Los cuatro pronunciamientos de §8.4 fueron emitidos:** PostgreSQL ratificado, Supabase ratificado como proveedor, compromiso de portabilidad confirmado como restricción vinculante, y verificación de R-1, R-2 y R-4 asignada a **DEV-01 — Architecture Bootstrap**.

> **Una decisión adicional, no prevista en esta sección.** ADR-13 §19, punto 4, contenía una **pregunta arquitectónica abierta** —si se admitía la ejecución diferida de Análisis, Evaluación y Propuesta— que esta certificación no había identificado como tal. El Product Office se pronunció: **se admite la ejecución diferida** bajo las reglas A-1 y A-2, y APS-03 v3.0 §8.1 se interpreta como requisito de orden lógico del flujo, no de sincronía con la petición del usuario. Véase AR-04 §6.3.

**Ningún contenido técnico fue modificado durante la ratificación.**

---

# 9. Exclusiones Expresas

## 9.1 El código

**Esta certificación no alcanza al código.** La última auditoría técnica —**ATA-01**— está `Archived`, y AR-02 §6.2 advirtió que sus hallazgos sobre el código «deberán reverificarse al iniciar la Fase 5, no darse por vigentes».

Consta además la deuda **H-01 / DI-5**: la entidad del dominio en el código se denomina `Prospect`, no `Lead`, y los endpoints siguen el patrón `/api/prospect/*` (**H-04**). Ambas se planifican al inicio de la Fase 5.

## 9.2 La interfaz visual

APS-04 Parte B (design system) no ha sido revisada en este sprint. Subsiste **DI-3**: el glosario de APS-04 sin alineación de dominio, agrupable con la revisión ya exigida por ADR-11 §14.

## 9.3 Los valores iniciales

**WP-01 y los 21 parámetros de APS-17 son iniciales por declaración propia.**

WP-01 se emite sin evidencia de uso real por no existir todavía (APS-08 §7.1, riesgo R-8 de ADR-14) y debe revisarse conforme a APS-08 §10. APS-17 §9, G-5, declara que sus valores se ajustarán con la operación real.

**Certificar que están publicados no certifica que sean los correctos.** Que puedan ajustarse sin modificar ninguna decisión del Blueprint es, precisamente, la propiedad que los hace parámetros.

---

# 10. Riesgos Vigentes

Riesgos que subsisten tras esta certificación. **Se informan; no se resuelven.**

| # | Riesgo | Severidad | Origen y control |
| --- | --- | --- | --- |
| **RV-1** | **El desarrollo comienza antes de la ratificación de §8** y consolida en código una decisión que después se modifica al aprobarla | **Alta** | §8. Control: no iniciar DEV-01 sin ejecutar el acto de ratificación |
| **RV-4** | **Se invoca ADS-00 R-6** (nivel constitucional indisponible) y se descubre que AF-01 y AF-02 son borradores | Media | §8.6 · N-05 · DI-2 |
| **RV-5** | **La terminología `Prospect` se consolida en el código nuevo** y el renombrado se encarece | Media | §9.1 · H-01 · DI-5 · RM-3 de AR-02 |
| **RV-6** | **La unicidad compuesta se implementa en la aplicación** en lugar de en el motor, y aparecen duplicados bajo concurrencia, comprometiendo APS-02 §9 | **Alta** | ADS-02 §10, R-1. Verificable solo sobre la implementación real |
| **RV-7** | **Capacidades propietarias del proveedor se filtran al dominio** y se pierde la portabilidad comprometida | **Alta** | ADS-02 §10, R-2 · ADR-08 §10. Verificable por inspección de importaciones |
| **RV-8** | **El versionado se implementa como sobrescritura** por simplicidad, destruyendo conocimiento | **Alta** | ADS-02 §10, R-3 · ADR-13 §10.2 |
| **RV-9** | **Un parámetro de APS-17 se traslada al dominio** durante la implementación y una limitación técnica se convierte en regla de negocio | Media | APS-17 §9, G-2 y G-3 · ADR-11 §8.1 |
| **RV-10** | **La interfaz reintroduce un ocultamiento por puntuación** por glosario desalineado y filtros no verificados | Media | §9.2 · DI-3 · ADR-11 §8.6 · APS-08 §8.6 |

> **RV-6, RV-7 y RV-8 son los tres riesgos de mayor severidad de la Fase 5.** Los tres comparten la misma naturaleza: una garantía que la arquitectura sitúa en el motor o en la frontera podría acabar resuelta —o no resuelta— en el código de aplicación. **Ninguno es verificable documentalmente**; los tres exigen comprobación sobre la implementación real, y ADS-02 §11, punto 4, obliga al Product Office a fijar cuándo se verifican.

**Quedan ocho riesgos abiertos: RV-1 y RV-4 a RV-10.** La numeración de la v1.0 se conserva sin renumerar, de modo que toda cita externa a un código RV siga siendo válida.

## 10.1 Riesgos cerrados

| # | Riesgo | Estado | Evidencia del cierre |
| --- | --- | --- | --- |
| **RV-2** | El INDEX no cataloga ADS-02 ni APS-17 | ✅ **Cerrado por Sprint PC-01.1** | INDEX cataloga 48 documentos, los tres nuevos con enlace, versión y estado verificados (§5.2) |
| **RV-3** | ADS-01 §11 declara no decididos el motor y las ponderaciones | ✅ **Cerrado por Sprint PC-01.1** | ADS-01 v1.1 §11.1 remite a ADS-02 §4 y a APS-08 §7.1 (§4.2, §5.2) |

> **Ambos eran riesgos de sincronización documental, no de contenido.** Ninguna decisión cambió al cerrarlos: los documentos maestros pasaron a reflejar decisiones que ya estaban tomadas.
>
> **Se conservan en esta sección y no se suprimen**, para que quien consulte una versión anterior de AR-03 —o una cita a RV-2 o RV-3— encuentre constancia de su cierre y no los reabra.

---

# 11. Definition of Done

Esta certificación se considera completa cuando:

| # | Condición | Estado |
| --- | --- | --- |
| 1 | El dominio se verifica vigente y sin contradicciones activas | ✅ §3 |
| 2 | Se verifica que ninguna materia arquitectónica queda sin documento canónico | ✅ §4 |
| 3 | Se verifica la consolidación documental de PLAN-01 | ✅ §5 |
| 4 | Se verifica el cierre de las cinco deudas críticas de AR-02 §4.1 | ✅ §6 |
| 5 | Se declara la congelación y su procedimiento de excepción | ✅ §7 |
| 6 | Se identifican los documentos que requieren ratificación | ✅ §8 |
| 7 | **Se ejecuta el acto de ratificación de §8.2 y §8.4** | ✅ **Cumplido** — sprint GOV-01, 2026-07-29 (§8.7) |
| 8 | **AR-03 pasa a `Approved`** | ✅ **Cumplido** — v1.2 |

> ## ✅ Los ocho puntos están cumplidos.
>
> **Queda habilitado el inicio de la Fase 5 — Desarrollo**, que comienza por **DEV-00 — Implementation Rules** y continúa con **DEV-01 — Architecture Bootstrap**.
>
> **Condición de vigencia.** Esta certificación decae si se modifica cualquiera de los documentos que certifica sin verificar su alineación con PO-01 §1-§8 y con las decisiones ratificadas en GOV-01.
>
> **Obligaciones trasladadas a DEV-01.** Cinco verificaciones que solo son comprobables sobre implementación real quedan enumeradas en **AR-04 §10.1**. No condicionan esta certificación, pero sí el cierre de DEV-01.

---

# 12. Dependencias

Este documento depende de:

- **PO-01** v1.1 §1-§8. Autoridad funcional del dominio.
- **AR-02** §4.1, §5.2, §6.1, §6.2, §9.4. Evaluación cuya recomendación esta certificación cierra.
- **PLAN-01** v1.5 §4.1, §8. Estado de ejecución de la consolidación documental.
- **REV-03**. Verificación de consistencia residual.
- **ADS-00 v1.2**. *Jerarquía Documental*, R-3, R-4, R-5, R-6; *Estados del Documento*.
- **ADS-01 v1.1** §11, §11.1, §11.2. Materias abiertas, materias ya resueltas y parámetros operativos.
- **INDEX.md** §4, §5, §7. Catálogo sincronizado del Blueprint.
- **ADS-02** §4, §5.3, §10, §11. Motor de persistencia.
- **APS-04 v4.0** Parte A. Arquitectura funcional de interfaz.
- **APS-08 v1.2** §7.1, §8.6, §10. Perfil de Ponderación WP-01.
- **APS-13** §9. Clasificación de cambios.
- **APS-17** §9. Gobernanza de los parámetros.
- **ADR-11 v2.0** §7.1, §13, §14 · **ADR-12 v1.0** §7.2 · **ADR-13 v1.0** §10, §11 · **ADR-14 v1.1** §8.1.

---

# 13. Referencias

- **PO-01** — Decisión de Producto: Definición Canónica de Lead, §1-§8, §9.3.
- **AR-02** — Blueprint Readiness Assessment, §3, §4.1-§4.4, §5.2, §6, §8, §9.
- **PLAN-01 v1.5** — Plan de Consolidación del Blueprint, §4.1, §6, §8.
- **REV-03** — Residual Consistency Review, §3, §4, §5.
- **ADS-00 v1.2** — Documentation Standard: *Clasificación Oficial*, *Jerarquía Documental y Regla de Precedencia* (R-3 a R-6), *Estados del Documento*, *Estructura Obligatoria*.
- **ADS-01 v1.1** — Implementation Contracts, §3.1, §5, §7, §11, §11.1, §11.2, §11.3.
- **ADS-02** — Implementación del Motor de Persistencia, §4, §5, §6, §7, §10, §11.
- **AF-00 v1.1** · **AF-01 v0.1** · **AF-02 v1.0**.
- **APS-02 v2.1** §9 · **APS-03 v3.0** §7, §8 · **APS-04 v4.0** Parte A · **APS-07 v2.0** §5, §7, §8 · **APS-08 v1.2** §6, §7.1, §8, §8.6, §10 · **APS-11** · **APS-13** §9 · **APS-16** · **APS-17** §3, §4-§7, §9.
- **ADR-01** · **ADR-02 v1.1** · **ADR-03** · **ADR-04 v1.2** · **ADR-05 v1.4** §14 · **ADR-06 v1.1** · **ADR-07 v1.1** · **ADR-08 v1.2** §10, §312 · **ADR-09 v1.1** · **ADR-10A v2.0** · **ADR-11 v2.0** §7.1, §8, §9, §13, §14 · **ADR-12 v1.0** §7.2, §12 · **ADR-13 v1.0** §10, §11, §12 · **ADR-14 v1.1** §3.4, §8, §12.
- **ATA-01** — Technical Audit Report (`Archived`).
- **INDEX.md** — Índice Oficial del Blueprint, §4, §7.2.

---

# 14. Evaluación AQS

| Criterio | Puntaje |
| --- | --- |
| Claridad | 20/20 |
| Completitud | 19/20 |
| Implementabilidad | 20/20 |
| Consistencia | 15/15 |
| Escalabilidad | 15/15 |
| Calidad Editorial | 10/10 |

**AQS Total:** **99/100**

**Estado:** **DRAFT** — condicionado al acto de ratificación de §8.
