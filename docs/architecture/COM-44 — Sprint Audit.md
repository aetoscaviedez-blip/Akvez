# COM-44 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-44 / 4 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado.** Cero cambios de código · cero cambios de Blueprint |
| Fecha | 2026-08-04 |
| Sprint | **COM-44 — ADR-13 v1.3 Preparation + Remaining Decision Cleanup** |

---

# 1. Documentos creados — 4

| # | Documento | Resultado |
| :-: | --- | --- |
| **1** | `COM-44 — ADR-13 Remaining Corrections Analysis.md` | **3 determinaciones** · **1 reclasificación de COM-43** |
| **2** | `COM-44 — ADR-13 Consolidated Amendment Proposal.md` | 🟡 **v1.4 propuesta** — 4 cambios firmes + 1 condicionado |
| **3** | `COM-44 — ADS-02 Change Impact.md` | **4 obligatorios · 2 recomendados · 2 de Product Office** |
| **4** | `COM-44 — Sprint Audit.md` | Este documento |

# 2. Documentos modificados — **0**

# 3. Cambios de código — **0**

| Ámbito | Estado |
| --- | :-: |
| `domain/` · `application/` · `infrastructure/` · `presentation/` · `bootstrap/` · `routes/` | ✅ **Intactos** |
| **`docs/blueprint/`** | ✅ **Intacto** — verificado por fecha |
| ADR nuevos creados | **0** |
| Documentos aprobados | **0** |

---

# 4. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Pruebas iniciales → finales | **197 → 197** |
| Ficheros `.ts` / `.tsx` modificados | **0** |

---

# 5. Decisiones y determinaciones

## 5.1 Las tres preguntas de la Tarea 1

| # | Pregunta | Respuesta | Fundamento |
| :-: | --- | :-: | --- |
| **1** | ¿A-5 necesita la misma corrección que A-6? | ⚠️ **NO DETERMINADO — sin autoridad que la exija** | **ADR-13 §6.3** no declara exhaustiva la columna «Contenido» |
| **2** | ¿V-2 necesita aclaración sobre `issue`? | ✅ **SÍ** | Precedente **ADR-19 §5.1**, `Approved` |
| **3** | ¿Por concepto o por nombre técnico? | ✅ **Por concepto** | **ADS-00**, alcance de DEV · **DEV-00 §5.1** |

## 5.2 🔄 Reclasificación de COM-43 H-4

> **COM-43 §4.4 clasificó la omisión de A-5 como *«🔴 Divergencia documental confirmada»*. La lectura de §6.3 no lo sostiene.**

| | **A-6** | **A-5** |
| --- | --- | --- |
| Regla contrastada | **PO-02 §3** — **orden 2** | **ADR-13 §10.3 V-4** — **el mismo documento** |
| ¿Afirma algo falso? | ✅ **Sí** — *«tono»* no es contenido de `Proposal`, y omite la evidencia que PO-02 §3 declara constitutiva | ❌ **No** — puntuación, banda y explicación **sí** lo son |
| Naturaleza | 🔴 **Contradicción** | ⚠️ **Incompletitud** |
| Regla que resuelve | **ADS-00 R-1 · R-2** | ❌ **Ninguna** — ADS-00 regula conflictos **entre** documentos, no dentro de uno |

**`ADR-13 §6.3 — Regla de completitud`, texto íntegro:** *«Se persiste **el conjunto completo de Empresas** descubiertas y no duplicadas…»*

> ### **§6.3 declara la completitud del conjunto de Empresas, no la de la columna «Contenido». Ninguna sección de ADR-13 declara esa columna exhaustiva.**

**Consecuencia directa:** la recomendación 1 de **COM-43 §7** —*«incorporar la corrección de A-5 antes de aplicar v1.3»*— **pierde su carácter obligatorio**. Y con ella, el **riesgo 1 de COM-43 §6**: **aplicar v1.3 tal como está NO introduce inconsistencia.**

## 5.3 Qué contiene la propuesta v1.4

| Cambio | Estado | ¿Exigido por autoridad? |
| :-: | --- | :-: |
| **A** — contenido canónico de A-6 | Idéntico a v1.3 | ✅ **Sí** — PO-02 §3 |
| **B** — V-2 por concepto, sin fijar nombre | 🔄 Refinado | ⚠️ No — fundado en ADR-19 §5.1 |
| **C** — G-8/G-9/G-10, con G-9 reconociendo dos patrones | 🔄 Refinado | ⚠️ Precisión, no creación |
| **D** — V-3 como metadato ajeno a la vigencia | ➕ Nuevo | ⚠️ No — evita la conflación que produjo la divergencia de ADS-02 §7 |
| **E** — corrección de A-5 | ⚠️ **CONDICIONADO** | ❌ **NO** — §5.2 |

> **v1.4 no revoca v1.3: la absorbe.** **Si el Architecture Team prefiere aplicar v1.3 tal cual, es legítimo.**

---

# 6. Estado de bloqueos *(Tarea 4)*

**Ninguno se cierra en este sprint.**

## 6.1 Bloqueados por **Product Office**

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **PO-a** | **Numeración de ADR-18 / ADR-19** — ADR-18 declara su número provisional y no está catalogado | 🟡 |
| **PO-b** | **Registro en el Blueprint** — alta de ADR-19, sincronización de `docs/blueprint/INDEX.md` | 🟡 |
| **PO-c** | **Aprobación de ADS-02** — corrección de §7 *(C-1 a C-4)* | 🔴 **Alta** |
| **PO-d** | **`SP-01`** — B-1 | 🔴 |
| **PO-e** | **Reintentos del punto de control** — B-2, vía APS-17 | 🔴 |
| **PO-f** | **Longitud de canal** — CH-01/02/03 | 🔴 |

## 6.2 Bloqueados por **Architecture Team**

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **AT-a** | **Aplicación de ADR-13 v1.3 o v1.4** al fichero del Blueprint | 🔴 **Alta** |
| **AT-b** | **¿Es exhaustiva la columna «Contenido» de §6.2?** — condiciona el Cambio E | 🟡 |
| **AT-c** | **Identidad lógica de A-4/A-5** a efectos de G-8 | 🟡 |
| **AT-d** | **¿A-4 y A-5 con repositorios separados?** *(COM-43 H-3)* | 🟡 |
| **AT-e** | **¿Unificar `emission` → `issue`?** — vía DEV-00 §5.1; arrastraría código | 🟢 |
| **AT-f** | **Enmienda de ADR-08 §13** — retirada del par heredado sobre A-6 | 🟡 |
| **AT-g** | **Registro de la serie F-** y colisión del identificador `F-2` | 🟡 |
| **AT-h** | **Vocabulario de estadios** *(COM-43 H-1)* — con Product Office | 🟡 |

## 6.3 Bloqueados por **Ingeniería**, con alcance propio

| ID | Bloqueo | Sev. |
| :-: | --- | :-: |
| **ING-a** | **`LeadStatus` con los seis valores derogados** — desviación **A-01**. ⚠️ Alcanza a **CE-I1** y `RegisterContact` | 🟡 |
| **ING-b** | **F-2 Capa C** — constraints, transacciones, pruebas de concurrencia | 🟡 ⛔ |
| **ING-c** | **F-3** · **F-9** | 🟡 |

> ### ✅ **Los diecisiete bloqueos tienen propietario.**

---

# 7. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **ADR-13 no se aplica al fichero.** El Blueprint sigue publicando *«Asunto · mensaje · tono»* y *«la más reciente»* | 🔴 **Alta** |
| **2** | **ADS-02 §7 no se corrige.** Quien implemente el motor **lee §7, no el código** | 🔴 **Alta** |
| **3** | **Se aplica v1.3 con el enunciado literal `issue`** y **A-5 parece incumplir** una regla que su semántica cumple | 🟡 Media |
| **4** | **Se responde «Sí» a AT-b** y el alcance crece: las otras diez filas exigirían auditoría de exhaustividad | 🟡 Media |
| **5** | **Se mezcla la corrección de ADS-02 §7 con los requisitos de §3** *(F-2 Capa B)* y la aprobación se bloquea por una cuestión ajena | 🟡 Media |
| **6** | **La acumulación de propuestas sin aplicar crece**: hoy hay **dos enmiendas aprobadas o propuestas sobre ADR-13** *(v1.3 y v1.4)* **y ninguna aplicada** | 🟡 Media |

> ⚠️ **El riesgo 6 es nuevo de este sprint y conviene nombrarlo:** v1.3 fue aprobada y no aplicada; v1.4 la absorbe y tampoco está aplicada. **Un tercer ciclo de refinamiento sin aplicación produciría tres versiones de una misma enmienda compitiendo entre sí.**

---

# 8. Criterio de finalización

| # | Criterio | Estado |
| :-: | --- | :-: |
| **1** | Correcciones pendientes de ADR-13 completamente especificadas | ✅ **COM-44/1 + COM-44/2** — texto exacto para A, B, C, D; E condicionado con su pregunta previa |
| **2** | ADS-02 con impacto documentado | ✅ **COM-44/3** — 4 obligatorios, 2 recomendados, 2 de Product Office |
| **3** | Ningún cambio funcional | ✅ **0 ficheros** |
| **4** | Todos los bloqueos con propietario | ✅ **17, clasificados en §6** |
| **5** | lint · tsc · tests verdes | ✅ **197/197** |

---

# 9. Siguiente decisión necesaria

> ## **Una sola, y desbloquea la cadena entera:**
>
> ### **¿Se aplica ADR-13 v1.3 tal cual, o se aprueba primero v1.4?**

| Opción | Consecuencia |
| --- | --- |
| **Aplicar v1.3** | ✅ **Legítimo — no introduce inconsistencia** *(§5.2)*. Desbloquea ADS-02 de inmediato. ⚠️ Deja el enunciado literal `issue` *(riesgo 3)* y sin la nota de G-9 |
| **Aprobar v1.4 y aplicarla** | ✅ Resuelve el riesgo 3 y precisa G-9. ⚠️ Exige un acto de aprobación más |
| **Aplicar v1.3 y refinar después** | ⚠️ **No recomendado** — produciría un tercer ciclo sobre el mismo documento *(riesgo 6)* |

**Ambas primeras son de la competencia del Architecture Team y no requieren Product Office.**

> **La respuesta a AT-b —exhaustividad de §6.2— NO bloquea ninguna de las dos.** Solo condiciona el Cambio E, que puede quedar fuera.

---

# 10. Referencias

**ADS-00 v1.3** R-1, R-2, R-3, R-7, *categoría DEV* · **PO-02 v1.3** §3, §5.1 · **APS-17** · **ADR-05 v1.4** §7 D3 · **ADR-09 v1.3** §5.2 · **ADR-12 v1.1** §12.1 · **ADR-13 v1.2** §6.2, §6.3, §10.3, §12.3, §13.1 · **ADR-13 v1.3 Consolidated Amendment** · **ADR-16 v1.1** §4.2, §4.4 · **ADR-19 v1.0** §5.1 · **ADS-02 v1.1** §3, §7 · **DDD-01 v1.1** §2.1, §8, §9.2 · **DEV-00** §5.1, R-27, R-34 · **AR-05** §5.1 · **COM-19** §9 · **COM-36/1** · **COM-42/A** · **COM-43** · **COM-44/1** a **COM-44/3**.
