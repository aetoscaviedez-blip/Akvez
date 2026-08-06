# COM-47 — Auditoría Previa de ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-47 / 1 |
| Clasificación | **Auditoría previa a modificación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Auditoría cerrada.** Redactada **antes** de editar |
| Fecha | 2026-08-04 |
| Documento auditado | **ADS-02 v1.1** — 268 líneas, íntegro |
| Autoridad de contraste | **ADR-13 v1.3** *(aplicada al Blueprint en COM-46)* |

---

# 1. Estado actual

| Campo | Valor |
| --- | :-: |
| Versión | **1.1** |
| Estado | `Approved` |
| Última actualización | **2026-07-29** |
| Gobernado por | **ADR-13** · ADR-05 · ADR-08 · ADR-12 |

> **ADS-02 v1.1 es del 2026-07-29. ADR-13 pasó a v1.2 el 2026-07-30 y a v1.3 el 2026-08-04.**
>
> ### **ADS-02 no se ha resincronizado con ADR-13 desde hace dos enmiendas.** Es la causa raíz de todas las divergencias de §3.

**Y su propia cabecera fija la regla que las resuelve:**

> *«**Si este documento y un ADR discrepan, prevalece el ADR.** Una incompatibilidad detectada aquí obliga a cambiar de motor, nunca a modificar la arquitectura.»*

---

# 2. Divergencias encontradas — 6

| ID | Ubicación | Origen del desfase | ¿En el alcance de la Tarea 2? |
| :-: | --- | :-: | :-: |
| **D-1** | **§7** — «Versión vigente distinguible» | **ADR-13 v1.3** | ✅ **Sí** — *Vigencia* |
| **D-2** | **§7** — falta fila para **V-3** | ADR-13 v1.2 | ✅ **Sí** — *V-3* |
| **D-3** | **§7** — «Siete garantías G-1 a G-7» | **ADR-13 v1.3** | ✅ **Sí** — *Garantías* |
| **D-4** | **§7** — «los siete eventos» | ADR-13 **v1.2** | ✅ **Sí** — *Eventos* |
| **D-5** | **§3 RQ-4** — «análisis, puntuación y propuesta» | ADR-13 **v1.2** | ❌ **No** — §6 |
| **D-6** | **§5.1** — misma omisión que D-5 | ADR-13 **v1.2** | ❌ **No** — §6 |

---

# 3. Divergencias en el alcance — cambios necesarios

## 3.1 D-1 — Criterio de vigencia · **§7, línea 172**

**Texto actual:**

```
| **Versión vigente distinguible** | §10.3, V-2 | Marca temporal por emisión; la vigente es la más reciente |
```

**Autoridad — `ADR-13 v1.3 §10.3 V-2`, ya en el Blueprint:**

> *«La vigente es la de **mayor número de emisión (`issue`) dentro de su clave de identidad**… **`issuedAt` es metadato temporal y NO determina la vigencia**.»*

> ### 🔴 **ADS-02 afirma exactamente lo contrario que su documento gobernante.**

**Y la fila conflaciona dos reglas:**

| Fragmento | Regla | Veredicto |
| --- | --- | :-: |
| *«Marca temporal por emisión»* | **V-3** — conservación | ✅ Correcto — **debe preservarse** |
| *«la vigente es la más reciente»* | **V-2** — vigencia | 🔴 Contrario a la regla vigente |

**Cambio necesario:** sustituir el texto de la columna, **sin fijar el nombre del campo** *(COM-45/1 §2.4 — la nomenclatura es materia de DEV-00 §5.1)*.

## 3.2 D-2 — Falta fila para V-3 · **§7**

**Búsqueda exhaustiva de §7: `V-3` no aparece en ninguna de las once filas.** La conservación temporal solo existe **dentro** de la fila de V-2.

> ⚠️ **Corregir D-1 sin añadir esta fila eliminaría la única constancia de V-3 en toda la sección.**

**Autoridad:** **ADR-13 §10.3 V-3** — vigente **sin cambios** desde v1.2.
**Cambio necesario:** **fila nueva**, separada del ordenamiento.

## 3.3 D-3 — Número de garantías · **§7, línea 175**

**Texto actual:**

```
| **Siete garantías G-1 a G-7** | §12.3 | … **G-6: restricción de unicidad — es la garantía central.** … |
```

**Autoridad:** **ADR-13 v1.3 §12.3** declara ahora **diez** — G-8, G-9, G-10 añadidas en COM-46.
**Cambio necesario:** **siete → diez**, describiendo cómo PostgreSQL satisface las tres nuevas.

⚠️ **Matiz:** *«G-6… es la garantía central»* debe acotarse a *«sobre la identidad del Lead»*, porque **G-8 la generaliza a los demás agregados**. **G-6 permanece íntegra**: es precisión de alcance, no cambio de regla.

## 3.4 D-4 — Número de eventos · **§7, línea 177**

**Texto actual:**

```
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **siete** eventos de ADR-13 §13 |
```

**Autoridad:** **ADR-13 §13.1** declara **diez filas** — E-1, E-2, **E-2b**, E-3, E-4, E-5, E-6, **E-7**, **E-8**, **E-9** — que el catálogo del Blueprint resume como *«nueve eventos: E-1 a E-9»*.

> ⚠️ **D-4 no deriva de v1.3.** E-7, E-8 y E-9 los incorporó **ADR-13 v1.2** el 2026-07-30. **Abierta desde entonces.**

**Cambio necesario:** **siete → nueve (E-1 a E-9)**, mencionando la variante E-2b.

---

# 4. Referencias verificadas como **correctas** — no se tocan

| Ubicación | Contenido | Verificación |
| --- | --- | :-: |
| **§7** — «El Score conserva su perfil de usuario» | `§10.3, V-4` | ✅ **V-4 no fue enmendada** |
| **§7** — «Historial de solo crecimiento» | `§12.1, E-5` | ✅ **Resuelta en COM-42/A §7**: remite a **ADR-12 §12.1 E-5**, coincidencia literal. **Ambigua, no errónea** |
| **§7** — Unidad de Registro · Reconciliación · Idempotencia · Registrar/Actualizar/Versionar · Ninguna destrucción · Independencia | §11.1, §9.5, §11.3, §10.1, §10.2, §12.4 | ✅ **Seis filas vigentes** |
| **§3** — RQ-1, RQ-2, RQ-3, RQ-5 a RQ-9 | Varias | ✅ Vigentes |
| **§8** *(ADR-05, ADR-08)* · **§9** *(ADR-12)* | — | ✅ **Sin relación con la enmienda** |
| **§1, §2, §4, §5.2, §5.3, §6, §10, §11** | — | ✅ **Sin relación.** PostgreSQL y Supabase no se revisan |

---

# 5. Referencias donde ADR-13 v1.3 **no obliga** a cambio

| Elemento nuevo | ¿Obliga a tocar ADS-02? | Motivo |
| --- | :-: | --- |
| **G-8** *(unicidad de identidad)* | ✅ **Sí** — vía **D-3** | Aparece en el recuento de §7 |
| **G-9** *(atomicidad)* | ✅ **Sí** — vía **D-3** | Ídem |
| **G-10** *(conflicto determinista)* | ✅ **Sí** — vía **D-3** | Ídem |
| **§3 — requisitos de motor** para G-8/G-9/G-10 | ❌ **No en este sprint** | Es **F-2 Capa B**. **§7 describe *cómo* se satisface; §3 *exige*** — alcances distintos *(COM-44/3 §4.2)*. Bloqueado además por **AT-c** *(identidad lógica de A-4/A-5, no declarada)* |

---

# 6. ⚠️ Divergencias FUERA del alcance — registradas, **no corregidas**

## 6.1 D-5 — §3, RQ-4: tres activos versionados en vez de cuatro

**Texto actual, línea 95:**

```
| **RQ-4** | **Escritura acumulativa**: versiones sucesivas de análisis, puntuación y propuesta sin sobrescribir | ADR-13 §10.3 |
```

**ADR-13 §10.3, texto vigente:** *«Se versionan **cuatro** activos: Análisis (A-4), Opportunity Score (A-5), Propuesta (A-6) y **Diagnóstico Comercial (A-11)**.»*

> ### **RQ-4 enumera tres. Omite el Diagnóstico Comercial.**

## 6.2 D-6 — §5.1: la misma omisión

**Texto actual, línea 127:** *«**RQ-4, RQ-5 y RQ-6** se satisfacen con relaciones de uno a muchos entre el Lead y sus emisiones versionadas de **análisis, puntuación y propuesta**.»*

**Misma omisión de A-11.**

## 6.3 Por qué NO se corrigen en este sprint

| # | Razón |
| :-: | --- |
| **1** | **Están en §3 y §5.1, no en §7.** La Tarea 2 enumera cuatro cambios y **los cuatro son de §7** |
| **2** | **Derivan de ADR-13 v1.2**, no de v1.3 ni de V-2/V-3/G-8-10/eventos — **fuera de los disparadores de la Tarea 1** |
| **3** | **§3 tiene tratamiento separado y consistente** en toda la cadena: es **F-2 Capa B** *(COM-44/3 §4.2 · COM-46/1 §4.1)* |
| **4** | **Corregirlas sería un cambio no encargado.** El sprint prohíbe crear decisiones nuevas |

> ⚠️ **Consecuencia que conviene registrar:** tras este sprint, **§7 quedará sincronizada y §3 no**. Es el resultado de un alcance deliberado, **no un olvido** — y **§7 es la sección que un implementador consulta para saber cómo satisfacer cada requisito**.
>
> **Se elevan como candidatas al sprint que aborde §3 / F-2 Capa B.**

---

# 7. Observación adicional — sin clasificar como divergencia

**Cabecera, línea 14:** `| Estándar aplicado | ADS-00 v1.2 |`

**ADS-00 está hoy en v1.3.** Otros documentos del Blueprint declaran *«Estándar aplicado: ADS-00 v1.3»*.

> **No se clasifica como divergencia:** el campo podría registrar **el estándar vigente al redactarse**, que es información histórica legítima. **Ninguna regla determina cuál de las dos lecturas es la correcta.**
>
> **Se registra. No se modifica.**

---

# 8. Cambios necesarios — resumen ejecutable

| # | Sección | Acción | Autoridad |
| :-: | :-: | --- | --- |
| **1** | §7 | **Sustituir** fila de vigencia — criterio por número de emisión | ADR-13 v1.3 §10.3 V-2 |
| **2** | §7 | **Añadir** fila de conservación temporal — V-3 | ADR-13 §10.3 V-3 |
| **3** | §7 | **Sustituir** fila de garantías — siete → **diez** | ADR-13 v1.3 §12.3 |
| **4** | §7 | **Sustituir** fila de eventos — siete → **nueve** | ADR-13 v1.2 §13.1 · §13.4 |
| **5** | Cabecera | **Versión 1.1 → 1.2** · fecha **2026-08-04** | Regla propia del documento |
| **6** | Historial | **Añadir fila v1.2** con descripción y motivo | ADS-00 R-3 |

**Resultado sobre §7: de 11 a 12 filas.**

---

# 9. Referencias

**ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.1** *(íntegro)* · **ADR-05 v1.4** §14 · **ADR-11 v2.1** §7.1 · **ADR-12 v1.1** §12.1 *(E-5)*, §12.2 · **ADR-13 v1.3** §10.1, §10.2, §10.3 *(V-1 a V-5)*, §11.1, §12.3 *(G-1 a G-10)*, §12.4, §13.1, §13.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **APS-07 v2.0** §8.4 · **DEV-00** §5.1 · **`docs/blueprint/INDEX.md`** · **COM-42/A** §7 · **COM-44/3** · **COM-45/1** §2.4 · **COM-46** · **COM-46/1**.
