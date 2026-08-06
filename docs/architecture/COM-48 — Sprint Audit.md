# COM-48 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-48 / 3 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado.** Catálogo sincronizado · un riesgo cerrado · una propuesta detenida |
| Fecha | 2026-08-04 |
| Sprint | **COM-48 — Governance Cleanup** |

---

# 1. Cambios realizados

## 1.1 🔵 Blueprint — 1 fichero, 1 línea

**`docs/blueprint/INDEX.md`** — respaldo: `/tmp/INDEX.com48.backup.md`

| Antes | Después |
| --- | --- |
| `| **ADS-02** | […] | 1.1 | ✅ Approved — **PostgreSQL sobre Supabase** |` | `| **ADS-02** | […] | **1.2** | ✅ Approved — **PostgreSQL sobre Supabase** |` |

**Descriptor: sin cambio.** ADS-02 v1.2 sincronizó §7 con ADR-13; **no alteró qué decide el documento** —PostgreSQL sobre Supabase—, que es lo que el descriptor resume.

**Ningún otro registro del índice modificado.** Contadores *(69 / 63 / 52 / 11)* intactos: ninguna alta, ninguna baja, ningún cambio de estado. `Última actualización` ya estaba en **2026-08-04** desde COM-46.

## 1.2 Documentos creados — 3

| # | Documento | Resultado |
| :-: | --- | --- |
| **1** | `COM-48 — COM-19 Closure Record.md` | ✅ **Riesgo 2 cerrado** · §9 sigue abierto |
| **2** | `COM-48 — Version Field Naming Analysis.md` | 🔴 **Detenido** — propuesta registrada |
| **3** | `COM-48 — Sprint Audit.md` | Este documento |

---

# 2. Cambios NO realizados

| Ámbito | Estado |
| --- | :-: |
| **`domain/`** · **`application/`** · **`infrastructure/`** · **`presentation/`** · **`bootstrap/`** · **`routes/`** | ✅ **Intactos** |
| **Tests** | ✅ **Intactos** — 0 modificados, 0 creados |
| **ADR-13** | ✅ **No modificado** |
| **ADS-02** | ✅ **No modificado** |
| **DEV-00** | ✅ **NO modificado** — §4 |
| ADR nuevos | **0** |
| Decisiones nuevas | **0** |
| `GenerateProposal` | ✅ **Detenido** |

> **La excepción prevista** —*«salvo que una inconsistencia evidente obligue a detener el sprint»*— **no se activó.** No apareció ninguna inconsistencia en ADR-13 ni en ADS-02.

---

# 3. Tarea 2 — cierre de COM-19

## 3.1 ⚠️ Precisión aportada

**Los sprints anteriores escribieron *«cerrar COM-19 §9»*. Es impreciso.**

> ### **§9 se titula *«Riesgos residuales del contrato»* y contiene OCHO riesgos.** Lo cerrado es el **riesgo 2 — *«Vigencia sin criterio declarado»***.

| # | Riesgo | Estado |
| :-: | --- | :-: |
| 1 | RC-5 — trazabilidad | 🟢 Resuelto técnicamente · a un pronunciamiento |
| **2** | **Vigencia sin criterio declarado** | ✅ **CERRADO** |
| 3 | F-2 — unicidad | 🔴 Abierto *(Capa A.2 cerrada; B y C no)* |
| 4 · 5 · 7 · 8 | F-9 · F-3 · referencia al diagnóstico · `issuedAt` en la entidad | 🟡 Abiertos |
| 6 | Dos repositorios sobre A-6 | 🟡 Abierto *(requiere ADR-08 §13)* |

> **Uno cerrado de ocho.** Escribir *«COM-19 §9 cerrado»* sería falso.

## 3.2 Dónde queda registrado el cierre

> **Ya estaba registrado donde corresponde: en el `Historial de Versiones` de ADR-13, fila v1.3**, cuyo motivo cita literalmente *«ambigüedad abierta desde **COM-19 §9** (Sprint 19)»*.
>
> **No hacía falta ningún acto adicional.** `COM-48/1` es **constancia**, no instrumento.

## 3.3 Hallazgo de trazabilidad

> **COM-23 §7 declaró esta cuestión *«resuelta por derivación»* en su momento — y no lo estaba.** Lo resuelto era **la implementación**; **la regla no existía en ningún documento** hasta ADR-13 v1.3.
>
> **Es la diferencia que este cierre deja asentada**, y la razón por la que un «resuelto en código» no cierra un riesgo de contrato.

## 3.4 Efecto colateral

**`COM-12 RC-4`** —origen de `issuedAt`— **reduce su alcance**: ya no es bloqueante para la vigencia. **Sigue abierta** para la trazabilidad temporal.

---

# 4. Tarea 3 — `issue` / `emission` · 🔴 **DETENIDO**

## 4.1 Determinación

> ## **La convención debe vivir en `DEV-00 §5.1 — Nombres`.**

**Fundamento:** **ADS-00** asigna a la categoría **DEV** *«convenciones técnicas»* y *«convenciones de código»*, y **DEV-00 §5.1 es la tabla de nombres del proyecto**.

**Descartados, con motivo:** **ADR-13** *(la nomenclatura no es materia de ADR)* · **ADS-02** *(describe el motor, no los campos del contrato)* · **ADR-08 §6** *(nombra el contrato, no sus campos)* · **ADS-01 §3.2** *(mapa, no autoridad)* · **ARCH-01** *(no es autoridad)*.

## 4.2 Por qué se detuvo

**La Tarea 3 lo condicionaba: *«Si requiere modificar DEV-00: DETENER y registrar propuesta.»* Lo requiere.**

| Hecho | Verificado |
| --- | :-: |
| **DEV-00 §5.1 tiene once entradas, todas de *artefactos*** —ficheros, tipos, funciones— | ✅ |
| **Ninguna nombra un *campo dentro de un contrato*** | ✅ |
| **§5.3 tampoco** — sus cuatro reglas tratan de derivación y estructura | ✅ |

> ### ⚠️ **No es «añadir una fila»: extiende §5.1 del nivel de artefacto al de miembro.** Es una decisión de alcance sobre DEV-00, y debe tomarse a sabiendas.

## 4.3 Estado

**Cuatro opciones registradas —unificar en `issue`, unificar en `emission`, declarar ambos admisibles, no añadir regla— y ninguna elegida.**

⚠️ **Tensión sin resolver:** **el Blueprint dice *«número de emisión»***, que se traduce como `emission`; **pero el paréntesis de V-2 y dos de los tres activos dicen `issue`**. Ninguna autoridad determina cuál prevalece.

**Propietario:** **AKVEZ Architecture Team**. **Severidad 🟢 baja** — **no hay defecto de conformidad**: los tres activos cumplen V-2.

---

# 5. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Pruebas iniciales → finales | **197 → 197** |
| **Ficheros `.ts` / `.tsx` modificados** | **0** — verificado por fecha |
| **Impacto funcional** | **NINGUNO** |

---

# 6. Bloqueos restantes — **15**

## 6.1 Product Office — 5

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **PO-a** | Numeración ADR-18 / ADR-19 | 🟡 |
| **PO-b** | Registro de **ADR-19** en el Blueprint | 🟡 |
| **PO-d** | **`SP-01`** — B-1 | 🔴 |
| **PO-e** | Reintentos del punto de control — B-2 | 🔴 |
| **PO-f** | Longitud de canal — CH-01/02/03 | 🔴 |

> **PO-c *(aprobación de ADS-02 §7)* se cerró en COM-47.**

## 6.2 Architecture Team — 7

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **AT-b** | Exhaustividad de la columna «Contenido» de ADR-13 §6.2 | 🟡 |
| **AT-c** | Identidad lógica de A-4/A-5 para G-8 — **bloquea F-2 Capa B** | 🟡 |
| **AT-d** | ¿A-4 y A-5 con repositorios separados? | 🟡 |
| **AT-e** | **`issue` / `emission` en DEV-00 §5.1** — 🔴 **propuesta registrada hoy** | 🟢 |
| **AT-f** | Enmienda de **ADR-08 §13** | 🟡 |
| **AT-g** | Registro de la serie F- · colisión de `F-2` | 🟡 |
| **AT-h** | Vocabulario de estadios — con Product Office | 🟡 |

## 6.3 Ingeniería — 3

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **ING-a** | `LeadStatus` con los seis valores derogados *(A-01)* | 🟡 |
| **ING-b** | **F-2 Capa C** — constraints, transacciones, concurrencia | 🟡 ⛔ |
| **ING-c** | F-3 · F-9 | 🟡 |

## 6.4 Deuda documental de §3 de ADS-02

**Registrada en COM-47 §7, sin propietario asignado:** **§3 RQ-4** y **§5.1** enumeran **tres** activos versionados; ADR-13 §10.3 versiona **cuatro**. Deriva de **ADR-13 v1.2**.

> **Corresponde al sprint que aborde §3 / F-2 Capa B**, bloqueado por **AT-c**.

---

# 7. Criterios de aceptación

| # | Criterio | Estado |
| :-: | --- | :-: |
| **1** | ADS-02 catalogado correctamente | ✅ **INDEX: 1.1 → 1.2** |
| **2** | COM-19 con registro formal de cierre o bloqueo explícito | ✅ **Riesgo 2 cerrado** · **los otros siete, con estado explícito** |
| **3** | `issue`/`emission` con propietario documental claro | ✅ **DEV-00 §5.1 · Architecture Team** |
| **4** | No se crean ADR nuevos | ✅ **0** |
| **5** | No se modifica código | ✅ **0 ficheros** |

---

# 8. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **La propuesta de DEV-00 queda sin decidir** y el próximo activo versionado añade una tercera forma de nombrar el campo | 🟢 Baja |
| **2** | **§3 y §5.1 de ADS-02 conservan la enumeración de tres activos** | 🟡 Media |
| **3** | **La propuesta ADR-13 v1.4 sigue sin archivar.** Su contenido quedó repartido o descartado en COM-45 y COM-47; **si no se archiva, figurará como instrumento pendiente sobre un documento ya enmendado** | 🟡 Media |
| **4** | **Se lee *«COM-19 §9 cerrado»*** en lugar de *«riesgo 2 cerrado»* | 🟢 Baja *(mitigado por COM-48/1 §1 y §5)* |

---

# 9. Siguiente paso

**Tres actos, ninguno bloqueado, ninguno toca código:**

| # | Acto | Autoridad | Nota |
| :-: | --- | --- | :-: |
| **1** | **Archivar formalmente la propuesta ADR-13 v1.4** | Architecture Team | Su contenido ya está repartido o descartado *(riesgo 3)* |
| **2** | **Decidir `issue` / `emission`** en DEV-00 §5.1 | Architecture Team | ⚠️ Opciones A y B arrastran código |
| **3** | **Resolver AT-c** — identidad lógica de A-4/A-5 | Architecture Team | **Desbloquea F-2 Capa B** |

**Y a mayor plazo, los tres bloqueos de emisión —`SP-01`, B-2 y CH-01/02/03— siguen siendo del Product Office.** Ninguno se ha movido.

---

# 10. Referencias

**ADS-00 v1.3** — *categoría DEV*, R-1, R-3, R-7 · **ADS-01 v1.4** §3.1, §3.2 · **ADS-02 v1.2** §3, §5.1, §7 · **ADR-08 v1.2** §6, §13 · **ADR-12 v1.1** §12.1 · **ADR-13 v1.3** §6.2, §10.3, §12.3, *Historial* · **ADR-16 v1.1** §4.2, §4.4 · **ARCH-01 v1.3** · **DDD-01 v1.1** §9.2 · **DEV-00** §5.1, §5.3 · **`docs/blueprint/INDEX.md`** · **COM-12** RC-4 · **COM-19** §9 · **COM-22** §4.2 · **COM-23** §7 · **COM-43** §5.2 · **COM-45/1** · **COM-46** · **COM-47** · **COM-48/1** · **COM-48/2**.
