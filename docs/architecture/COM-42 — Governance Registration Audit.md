# COM-42 — Auditoría de Registro de Gobernanza

| Campo | Valor |
| --- | --- |
| Código | COM-42 / C |
| Clasificación | **Auditoría de catalogación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔴 **Registro pendiente.** Nada movido, nada editado |
| Fecha | 2026-08-04 |
| Objeto | **ADR-19 v1.0** · **ADR-13 v1.3 Consolidated Amendment** |
| Antecedentes | COM-39 §7.2 · **COM-40/3** *(conflicto de numeración)* |

> **No se ha movido ningún documento. `docs/blueprint/` intacto — verificado.**

---

# 1. Los dos índices

| Índice | Alcance | Última sincronización | Autoridad |
| --- | --- | :-: | --- |
| **`docs/architecture/INDEX.md`** | Documentación arquitectónica de trabajo | **2026-08-04** *(COM-39)* | Architecture Team |
| **`docs/blueprint/INDEX.md`** | **Catálogo oficial del Blueprint** | **2026-07-30** *(Sprint Gobernanza Final)* | **Product Office** |

> **Son ficheros distintos y no se sustituyen.** El primero cataloga documentos de trabajo; **el segundo es el catálogo con autoridad**.

## 1.1 Estado actual

| Documento | En `docs/architecture/INDEX.md` | En `docs/blueprint/INDEX.md` |
| --- | :-: | :-: |
| **ADR-19 v1.0** | ✅ **Listado** — `Approved` | ❌ **Ausente** |
| **ADR-13 v1.3** | ✅ **Listado** — `Approved` | ❌ **Ausente** — figura **ADR-13 v1.2** |
| ADS-02 v1.2 *(propuesta)* | — | ❌ Figura **v1.1** |

---

# 2. Qué falta para registrar **ADR-19**

## 2.1 🔴 Bloqueo heredado — el número no está confirmado

**COM-40/3 §1 lo localizó y sigue vigente:**

| # | Hecho | Verificación |
| :-: | --- | :-: |
| 1 | **El último ADR catalogado en `docs/blueprint/INDEX.md` es ADR-17** | ✅ Confirmado |
| 2 | **`ADR-18 — Perfil de Estrategia.md` existe** como fichero | ✅ Confirmado |
| 3 | **ADR-18 NO aparece en el catálogo** | ✅ Confirmado |
| 4 | **ADR-18 está en `Draft`**, v0.1 | ✅ Confirmado |
| 5 | **Su número es provisional por declaración propia** | ✅ Confirmado |

**ADR-18, cabecera literal:**

> *«Código: **ADR-18** *(**provisional** — la asignación definitiva **corresponde al Product Office**)*»*

> ### **Desde el catálogo, el siguiente número libre es 18, no 19.**

## 2.2 Actos necesarios

| # | Acto | Autoridad | Estado |
| :-: | --- | --- | :-: |
| **1** | **Confirmar o reasignar el número de ADR-18** | **Product Office** | 🔴 **Bloquea** |
| **2** | **Catalogar ADR-18** con su estado `Draft`, o registrar por qué no | **Product Office** | ⛔ Tras 1 |
| **3** | **Confirmar `19`** para el ADR de la Agent API | **Product Office** | ⛔ Tras 1 |
| **4** | **Trasladar** el fichero a `docs/blueprint/ADR/` | Architecture Team | ⛔ Tras 3 |
| **5** | **Añadir fila** al catálogo | **Product Office** | ⛔ Tras 4 |
| **6** | **Marcar el traslado** en `docs/architecture/INDEX.md` | Architecture Team | ⛔ Tras 4 |

## 2.3 Fila propuesta para `docs/blueprint/INDEX.md`

```
| **ADR-19** | [**Patrón de Construcción de la Agent API**](./ADR/ADR-19%20—%20Agent%20API%20Factory%20Construction%20Pattern.md) | **1.0** | ✅ `Approved` — **seis decisiones D-1 a D-6** |
```

**Formato verificado contra las filas existentes de ADR-16 y ADR-17.**

---

# 3. Qué falta para registrar **ADR-13 v1.3**

## 3.1 Naturaleza distinta — no es un alta, es una actualización

> **ADR-13 ya está catalogado.** Lo que falta es **aplicar la enmienda al fichero y actualizar su versión**.

## 3.2 Fila actual del catálogo

```
| **ADR-13** | [**Motor Canónico de Persistencia**](./ADR/ADR-13%20—%20Canonical%20Persistence%20Engine.md) | **1.2** | ✅ `Approved` — **nueve eventos: E-1 a E-9** |
```

## 3.3 Fila propuesta

```
| **ADR-13** | [**Motor Canónico de Persistencia**](./ADR/ADR-13%20—%20Canonical%20Persistence%20Engine.md) | **1.3** | ✅ `Approved` — **nueve eventos: E-1 a E-9 · diez garantías: G-1 a G-10** |
```

## 3.4 Actos necesarios

| # | Acto | Autoridad | Estado |
| :-: | --- | --- | :-: |
| **1** | **Aplicar los tres cambios** de la enmienda a `docs/blueprint/ADR/ADR-13` — §6.2, §10.3 V-2, §12.3 | Architecture Team | 🔴 **Pendiente** |
| **2** | **Registrar la fila v1.3** en su Historial de Versiones | Architecture Team | ⛔ Tras 1 |
| **3** | **Actualizar la fila del catálogo** — versión 1.2 → **1.3** | **Product Office** | ⛔ Tras 2 |

> ### **ADR-13 v1.3 NO tiene el bloqueo de numeración de ADR-19.** No necesita número nuevo: **es una enmienda a un documento ya catalogado**. Puede ejecutarse hoy.

---

# 4. Contadores del catálogo

| Campo | Hoy | Solo ADR-13 v1.3 | + ADR-19 | + ADR-18 |
| --- | :-: | :-: | :-: | :-: |
| Documentos catalogados | **69** | 69 | **70** | **71** |
| Vigentes | 63 | 63 | 64 | 65 |
| `Approved` | 52 | 52 | **53** | 53 |
| `Draft` | 11 | 11 | 11 | **12** |
| Última actualización | 2026-07-30 | **2026-08-04** | 2026-08-04 | 2026-08-04 |

> ⚠️ **Los contadores no pueden fijarse sin resolver antes §2.1.** Dependen de si ADR-18 se cataloga en el mismo acto.

**Si además se aprueba COM-42/B:** la fila de **ADS-02** pasa de **1.1 a 1.2**. **No altera contadores** — es actualización de versión, no alta.

---

# 5. Secuencia recomendada

**Un solo acto de cierre de bloque, en este orden:**

| # | Acto | Autoridad | Bloqueado por |
| :-: | --- | --- | :-: |
| **1** | **Aplicar ADR-13 v1.3** al fichero del Blueprint | Architecture Team | — |
| **2** | **Aprobar y aplicar COM-42/B** a ADS-02 §7 | Product Office | ⛔ 1 |
| **3** | **Resolver la numeración de ADR-18** | **Product Office** | — |
| **4** | **Trasladar ADR-19** a `docs/blueprint/ADR/` | Architecture Team | ⛔ 3 |
| **5** | **Sincronizar `docs/blueprint/INDEX.md`** — ADR-13→1.3, ADS-02→1.2, alta de ADR-19, y ADR-18 si procede | **Product Office** | ⛔ 1,2,4 |
| **6** | **Marcar traslados** en `docs/architecture/INDEX.md` | Architecture Team | ⛔ 5 |

> **Los actos 1 y 3 son independientes entre sí** y pueden iniciarse en paralelo. **El 1 no está bloqueado por nada y es el más urgente**, porque el 2 depende de él.

---

# 6. Estado de las decisiones mientras tanto

| Afirmación | Estado |
| --- | :-: |
| **ADR-19 es `Approved` y vinculante** por el acto de su cabecera | ✅ **Sí** |
| **D-1 aplica a toda Agent API Factory** — y **las tres del backend ya cumplen** | ✅ **Sí** *(COM-41)* |
| **ADR-13 v1.3 es `Approved`** por el acto de su cabecera | ✅ **Sí** |
| **Ambos figuran en el catálogo del Blueprint** | ❌ **No** |
| **El número de ADR-19 es definitivo** | ⚠️ **No confirmado** |
| **El fichero de ADR-13 del Blueprint contiene los tres cambios** | ❌ **No.** Sigue en v1.2 |

> ### ⚠️ **La divergencia más incómoda: `docs/blueprint/ADR/ADR-13` sigue diciendo «Asunto · mensaje · tono» y «la más reciente».**
>
> **La enmienda está aprobada, pero el documento físico que un implementador abriría todavía no la contiene.** Es el mismo riesgo que motiva COM-42/B, un nivel más arriba.

---

# 7. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **ADR-13 v1.3 no se aplica al fichero** y el Blueprint sigue publicando las reglas derogadas | 🔴 **Alta** |
| **2** | **Nada se cataloga** y ADR-19 permanece vinculante pero **no localizable** en el Blueprint | 🔴 **Alta** |
| **3** | **ADR-19 se cataloga sin resolver ADR-18** — salto injustificado entre 17 y 19 | 🟡 Media |
| **4** | **El Product Office reasigna ADR-18** tras catalogar ADR-19 → **colisión** | 🟡 Media |
| **5** | **ADS-02 v1.2 se aprueba antes que ADR-13 v1.3**, citando secciones que el ADR físico no contiene | 🟡 Media |
| **6** | **Se traslada ADR-19 sin retirar la copia** de `docs/architecture/` → **dos versiones vivas** | 🟡 Media |

---

# 8. Conclusión

| # | Conclusión |
| :-: | --- |
| **1** | **ADR-13 v1.3 puede aplicarse hoy.** No tiene bloqueo de numeración y **desbloquea COM-42/B** |
| **2** | **ADR-19 sigue bloqueado** por la numeración de ADR-18 — decisión del **Product Office** |
| **3** | **Ambos son vinculantes** por sus actos de aprobación, **y ninguno figura en el catálogo** |
| **4** | **Nada se ha movido ni editado.** `docs/blueprint/` intacto |

---

# 9. Referencias

**ADS-00 v1.3** — *Clasificación Oficial*, R-4 · **ADR-13 v1.2** *(fila del catálogo)* · **ADR-13 v1.3 Consolidated Amendment** · **ADR-18 v0.1** *(cabecera — número provisional, `Draft`)* · **ADR-19 v1.0** *(cabecera, §14)* · **ADS-02 v1.1** · **`docs/blueprint/INDEX.md`** *(tabla ADR, tabla ADS, contadores)* · **`docs/architecture/INDEX.md`** · **COM-39** §7.1, §7.2 · **COM-40/3** · **COM-41** · **COM-42/A** · **COM-42/B**.
