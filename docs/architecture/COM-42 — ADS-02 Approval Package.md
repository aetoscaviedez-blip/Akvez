# COM-42 — Paquete de Aprobación de ADS-02

| Campo | Valor |
| --- | --- |
| Código | COM-42 / B |
| Clasificación | **Paquete de aprobación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Listo para pronunciamiento. ADS-02 NO modificado** |
| Fecha | 2026-08-04 |
| Documento objeto | **ADS-02 v1.1** → **v1.2** propuesta |
| Aprueba | **AKVEZ Product Office** |
| Redacta | **AKVEZ Architecture Team** |
| Detalle técnico | **COM-42/A** |

> **ADS-02 no ha sido editado. `docs/blueprint/` intacto. Cero cambios de código.**

---

# 1. Cambios propuestos

**Cuatro, todos en `ADS-02 §7`. De 11 filas a 12.**

| # | Acción | Fila |
| :-: | --- | --- |
| **1** | **Sustituir** | Versión vigente distinguible → criterio **`MAX(issue)`** |
| **2** | **Añadir** | *«Marca temporal y ejecución de agente conservadas»* — **V-3, fila nueva** |
| **3** | **Sustituir** | Siete garantías G-1 a G-7 → **Diez garantías G-1 a G-10** |
| **4** | **Sustituir** | Catálogo de eventos: **siete → nueve (E-1 a E-9)** |

**Ningún otro cambio en ninguna sección de ADS-02.**

## 1.1 Texto exacto — bloque sustitutivo de §7

```
| **Versión vigente distinguible** | §10.3, V-2 | **Columna de número de emisión (`issue`) por fila.** La vigente es la de **mayor `issue` dentro de su clave de identidad** — no la de marca temporal más reciente. Consulta por `MAX(issue)` sobre la clave, con índice compuesto |
| **Marca temporal y ejecución de agente conservadas** | §10.3, V-3 | Columnas `issued_at` y referencia a la ejecución (A-10) por emisión. **Metadato de trazabilidad: no participa en la determinación de la vigencia** |
| **Diez garantías G-1 a G-10** | §12.3 | G-1, G-2, G-4: columnas inmutables por convención y verificables. G-3: identificadores no reutilizados. G-5: solo `INSERT`. **G-6: restricción de unicidad sobre la identidad del Lead.** G-7: relación uno a muchos de referencias de origen. **G-8: restricción de unicidad compuesta sobre la identidad lógica de cada agregado. G-9: transacción que hace indivisibles la derivación del número de emisión y su escritura. G-10: la violación de unicidad falla de forma determinista, sin escritura parcial ni sobrescritura** |
| **Catálogo cerrado de eventos** | §13.4 | Ninguna escritura fuera de los **nueve eventos E-1 a E-9** de ADR-13 §13.1 —incluida la variante **E-2b**— |
```

---

# 2. Autoridad que los origina

| # | Cambio | Autoridad | Estado | Fecha |
| :-: | --- | --- | :-: | :-: |
| **1** | Criterio `MAX(issue)` | **ADR-13 v1.3 §10.3 V-2** | ✅ `Approved` | 2026-08-04 |
| **2** | Fila de V-3 | **ADR-13 §10.3 V-3** *(vigente desde v1.2, sin cambios)* | ✅ `Approved` | 2026-07-30 |
| **3** | G-1 a G-10 | **ADR-13 v1.3 §12.3** | ✅ `Approved` | 2026-08-04 |
| **4** | E-1 a E-9 | **ADR-13 v1.2 §13.1 · §13.4** | ✅ `Approved` | 2026-07-30 |

## 2.1 Regla de precedencia aplicada

**ADS-02, cabecera:** *«**Gobernado por ADR-13** · ADR-05 · ADR-08 · ADR-12»*.

**ADS-00 R-1:** *«La precedencia resuelve conflictos, no sustituye documentos. Que un documento prevalezca **no anula al otro. Obliga a corregirlo**.»*

> ### **Los cuatro cambios corrigen ADS-02 para que refleje a su documento gobernante. Ninguno modifica ADR-13.**

## 2.2 ✅ Verificación — no se crea nada

| Comprobación | Resultado |
| --- | :-: |
| ¿Se crean **reglas**? | ❌ **No** |
| ¿Se crean **garantías**? | ❌ **No.** G-8/G-9/G-10 las creó ADR-13 v1.3 |
| ¿Se crean **requisitos**? | ❌ **No.** §3 no se toca |
| ¿Se crean **eventos**? | ❌ **No.** E-7/E-8/E-9 los creó ADR-13 v1.2 |
| ¿Se crean **abstracciones**? | ❌ **No** |
| ¿Se modifica algún documento `Approved` sin autoridad? | ❌ **No.** Nada aplicado |

---

# 3. Impacto

## 3.1 En ADS-02

| Sección | Impacto |
| --- | :-: |
| **§7** | ⚠️ **3 sustituciones + 1 alta** — de 11 a 12 filas |
| §1, §2 | ✅ Ninguno |
| §3 *(RQ-1 a RQ-9)* | ✅ **Ninguno en este paquete** — la ampliación es **F-2 Capa B** |
| **§4, §5, §6** *(motor, justificación, alternativas)* | ✅ **Ninguno.** **PostgreSQL y Supabase no se revisan** |
| §8, §9, §10, §11 | ✅ Ninguno |

> **La selección de motor no se cuestiona.** PostgreSQL satisface el criterio nuevo con **una columna entera e índice compuesto** — **más simple** que ordenar por marca temporal.

## 3.2 En código

> **Ninguno.** Ambos adapters versionados **ya ordenan por `issue`** *(COM-40/1 §3)*. **197 pruebas verdes, sin cambios.**

## 3.3 En otros documentos

| Documento | Impacto |
| --- | :-: |
| **ADR-13** · **ADR-16** · **PO-02** · **DDD-01** | ✅ Ninguno — **son la autoridad** |
| **ADS-01 §3.2** | ✅ Ninguno — no describe el criterio de vigencia |
| **ARCH-01** | ✅ Ninguno |
| **`docs/blueprint/INDEX.md`** | ⚠️ **Versión de ADS-02: 1.1 → 1.2** |

---

# 4. Riesgos

| # | Riesgo | Sev. | Nota |
| :-: | --- | :-: | --- |
| **1** | **El paquete no se aprueba.** §7 sigue diciendo «marca temporal», y **quien implemente el motor leerá §7, no el código** — reintroduciendo la divergencia que ADR-13 v1.3 cerró | 🔴 **Alta** | Es el riesgo que motiva el sprint |
| **2** | **Se aprueba solo el cambio 1** y las filas de garantías y eventos quedan desactualizadas, **sugiriendo que §7 se revisó entera** | 🟡 Media | Los cuatro cambios van juntos |
| **3** | **El cambio 1 se aplica sin el 2** y **V-3 pierde su única constancia en §7** | 🟡 Media | Por eso la fila de V-3 es alta, no sustitución |
| **4** | **Se confunde este paquete con la Capa B de F-2.** **§7 describe cómo se satisface; §3 exige** | 🟢 Baja | §3 no se toca |
| **5** | **ADS-02 se aprueba antes que la aplicación de ADR-13 v1.3 al fichero del Blueprint**, y ADS-02 v1.2 cita secciones que el ADR físico aún no contiene | 🟡 Media | **Aplicar ADR-13 v1.3 primero** — §6 |

---

# 5. Versión propuesta

> ## **ADS-02 v1.2**

## 5.1 Fila para el Historial de Versiones de ADS-02

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.2** | *(a fijar)* | AKVEZ Architecture Team | **Sincronización de §7 con ADR-13 v1.2 y v1.3.** La fila *«Versión vigente distinguible»* **se desdobla en dos**: la vigencia pasa a determinarse por **mayor número de emisión (`issue`)** conforme a **V-2 enmendada**, y la **conservación de la marca temporal se declara en fila propia bajo V-3**, de la que carecía. La fila de garantías pasa de **siete a diez** *(G-8, G-9, G-10)*. La fila de catálogo de eventos pasa de **siete a nueve** *(E-1 a E-9)*. **§7 pasa de 11 a 12 filas. Ningún contenido de §1 a §6 ni de §8 a §11 resulta afectado**: ni la selección de PostgreSQL, ni el compromiso de portabilidad de §5.3, ni las alternativas de §6, ni las verificaciones de compatibilidad con ADR-05, ADR-08 y ADR-12. | §7 afirmaba que la versión vigente se determina por **marca temporal**, contra **ADR-13 v1.3 §10.3 V-2**; contaba **siete** garantías cuando §12.3 declara **diez**; y **siete** eventos cuando §13.1 declara **nueve** desde **ADR-13 v1.2**. ADS-02 está *«Gobernado por ADR-13»*, de modo que la corrección le corresponde *(ADS-00 R-1)*. Detectado en **COM-40/1**, completado en **COM-41/A** y **COM-42/A**. |

## 5.2 Naturaleza del cambio

| Criterio | Valoración |
| --- | :-: |
| ¿Modifica alguna decisión de ADS-02? | ❌ **No** |
| ¿Modifica la selección de motor? | ❌ **No** |
| ¿Es aditivo o correctivo? | **Correctivo de sincronización** |
| Clasificación sugerida | **Cambio Menor** — precedente: ADR-13 v1.2 se registró así *(APS-13 §9)* |

---

# 6. Orden de aplicación recomendado

| # | Acto | Motivo del orden |
| :-: | --- | --- |
| **1** | **Aplicar ADR-13 v1.3** al fichero del Blueprint | ADS-02 v1.2 **cita V-2 enmendada y G-8/G-9/G-10** — deben existir en el ADR físico |
| **2** | **Aprobar y aplicar este paquete** a ADS-02 §7 | — |
| **3** | Sincronizar `docs/blueprint/INDEX.md`: **ADR-13 → 1.3**, **ADS-02 → 1.2** | — |

> ⚠️ **Invertir 1 y 2 deja ADS-02 v1.2 citando secciones que su documento gobernante aún no contiene** *(riesgo 5)*.

---

# 7. Pronunciamiento requerido

| Rol | Actor | Fundamento |
| --- | --- | --- |
| **Redacta** | **AKVEZ Architecture Team** | `Responsable` de ADS-02 |
| **Aprueba** | **AKVEZ Product Office** | Aprobó ADS-02 v1.1 en **GOV-01**, 2026-07-29 |

**Bloque de firma:**

| Campo | Valor |
| --- | :-: |
| Contenido verificado | ✅ **Sí** — COM-42/A |
| Cambios que crean norma | **0** |
| Documentos `Approved` alterados | **0** |
| **Aprobado por** | ⬜ **Pendiente — AKVEZ Product Office** |

---

# 8. Referencias

**ADR-05 v1.4** §14 · **ADR-08 v1.2** §10 · **ADR-12 v1.1** §7.2, §12.1, §12.3 · **ADR-13 v1.2** §10.3, §12.3, §13.1, §13.4 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-16 v1.1** §4.2, §4.4 · **ADS-00 v1.3** R-1, R-3 · **ADS-01 v1.4** §3.2 · **ADS-02 v1.1** *(cabecera)*, §3 a §11 · **APS-13** §9 · **PO-02 v1.3** §3 · **DDD-01 v1.1** §9.2 · **COM-40/1** · **COM-41/A** · **COM-42/A**.
