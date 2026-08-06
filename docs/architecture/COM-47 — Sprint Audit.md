# COM-47 — Auditoría del Sprint

| Campo | Valor |
| --- | --- |
| Código | COM-47 / 2 |
| Clasificación | **Auditoría de sprint** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Sprint cerrado.** **ADS-02 v1.2 aplicada** · cero cambios de código |
| Fecha | 2026-08-04 |
| Sprint | **COM-47 — ADS-02 Canonical Synchronization** |

> ### **ADS-02 deja de contradecir a ADR-13.** La divergencia abierta desde el 2026-07-29 queda cerrada.

---

# 1. Cambios realizados

## 1.1 🔵 `docs/blueprint/ADS/ADS-02 — Persistence Engine Implementation.md`

**Respaldo: `/tmp/ADS-02.v1.1.backup.md`**

| # | Ubicación | Cambio |
| :-: | --- | --- |
| **1** | **Cabecera** | `Versión` **1.1 → 1.2** · `Última actualización` **2026-07-29 → 2026-08-04** |
| **2** | **Historial de Versiones** | ➕ **Fila v1.2** con descripción y motivo completos |
| **3** | **§7** — *«Versión vigente distinguible»* | *«Marca temporal por emisión; la vigente es la más reciente»* → **mayor número de emisión dentro de su clave de identidad**, con `MAX()` e índice compuesto |
| **4** | **§7** — **fila nueva** | ➕ *«Marca temporal y ejecución de agente conservadas»* — **V-3**, declarada **metadato que no participa en la vigencia** |
| **5** | **§7** — garantías | *«Siete garantías G-1 a G-7»* → **«Diez garantías G-1 a G-10»**, con G-8, G-9 y G-10 descritas y **G-6 acotada a la identidad del Lead** |
| **6** | **§7** — eventos | *«los siete eventos»* → **«nueve eventos E-1 a E-9»**, incluida la variante **E-2b** |

**§7 pasa de 11 a 12 filas.**

## 1.2 Documentos creados — 2

| # | Documento |
| :-: | --- |
| **1** | `COM-47 — ADS-02 Pre-Change Audit.md` — redactado **antes** de editar |
| **2** | `COM-47 — Sprint Audit.md` |

---

# 2. Documentos afectados

| Documento | Efecto |
| --- | :-: |
| **`docs/blueprint/ADS/ADS-02`** | 🔵 **Modificado — v1.1 → v1.2** |
| `docs/architecture/COM-47 — ADS-02 Pre-Change Audit.md` | ➕ Creado |
| `docs/architecture/COM-47 — Sprint Audit.md` | ➕ Creado |

# 3. Documentos NO afectados — confirmado

| Ámbito | Estado |
| --- | :-: |
| **`domain/`** · **`application/`** · **`infrastructure/`** · **`presentation/`** · **`bootstrap/`** · **`routes/`** | ✅ **Intactos** |
| **Tests** | ✅ **Intactos** — 0 modificados, 0 creados |
| **`docs/blueprint/ADR/`** — incluido ADR-13 | ✅ **Intacto** |
| **`docs/blueprint/INDEX.md`** | ✅ **Intacto** — §5 |
| **ADR-19** · **DEV-00** · **DDD-01** · **PO-02** | ✅ **Intactos** |
| ADS-02 **§1, §2, §3, §4, §5, §6, §8, §9, §10, §11** | ✅ **Sin cambio** |
| ADR nuevos · propuestas nuevas · decisiones nuevas | **0** |
| `GenerateProposal` | ✅ **Detenido** — B-1 y B-2 sin mover |

---

# 4. Verificación contra los criterios de aceptación

| # | Criterio | Comprobación | Resultado |
| :-: | --- | --- | :-: |
| **1** | ADS-02 deja de contradecir ADR-13 v1.3 | Fila de vigencia sustituida | ✅ |
| **2** | No existen referencias a *«siete garantías»* | `grep -ci "siete garantías"` | ✅ **0** |
| **3** | No existen referencias incorrectas a marca temporal como criterio de vigencia | `grep -c "Marca temporal por emisión; la vigente"` | ✅ **0** |
| **4** | Código sin modificaciones | Búsqueda por fecha sobre `server/` y `src/` | ✅ **0 ficheros** |
| **5** | Blueprint permanece intacto | — | ⚠️ **Ver §6** |

**Verificación adicional:** `grep -ci "siete eventos"` → **0**.

---

# 5. ⚠️ Acto pendiente — `docs/blueprint/INDEX.md`

**El catálogo del Blueprint sigue registrando ADS-02 en la versión anterior:**

```
| **ADS-02** | [Implementación del Motor de Persistencia](...) | 1.1 | ✅ `Approved` — PostgreSQL sobre Supabase |
```

> ### **El fichero dice v1.2; el catálogo dice v1.1.**

**Por qué no se corrigió:** la **Tarea 2** dice *«Actualizar **únicamente** ADS-02»*, y este sprint **no incluye tarea de catálogo** —a diferencia de COM-46, cuya Tarea 2 autorizaba expresamente *«INDEX del Blueprint si corresponde»*—.

> **Modificar el índice habría excedido la autorización.** Se registra como **acto pendiente de una línea**.

| Campo | Valor |
| --- | --- |
| **Acción** | Fila de ADS-02: **`1.1` → `1.2`** |
| **Propietario** | **AKVEZ Product Office** — sincronización del catálogo |
| **Severidad** | 🟢 **Baja** — divergencia de versión en el catálogo, no de contenido |

---

# 6. ⚠️ Observación sobre el criterio de aceptación 5

**El sprint contiene una tensión interna que conviene dejar registrada:**

| Elemento del encargo | Texto |
| --- | --- |
| **Restricciones** | *«NO modificar… `docs/blueprint/`. **Excepto si existe autorización explícita posterior**»* |
| **Tarea 2** | *«**Aplicar cambios en ADS-02.** Actualizar únicamente ADS-02»* |
| **Tarea 3** | *«**Incrementar versión**… Actualizar historial, fecha, motivo»* |
| **Criterio 1** | *«ADS-02 **deja de** contradecir ADR-13 v1.3»* |
| **Criterio 5** | *«**Blueprint permanece intacto**»* |

**`ADS-02` reside en `docs/blueprint/ADS/`.**

> **Lectura aplicada:** la Tarea 2 es la *«autorización explícita posterior»* que la propia restricción prevé, acotada a ADS-02 — **mismo patrón que COM-46 con ADR-13**. **Tres de los cinco criterios (1, 2, 3) solo se cumplen si el cambio se aplica.**
>
> **El criterio 5 se interpreta como *«el resto del Blueprint permanece intacto»***, y así se ha ejecutado: **el único fichero del Blueprint tocado es ADS-02**.
>
> **Se registra la tensión en lugar de resolverla en silencio.** Si la intención era preparar y no aplicar, **el respaldo `/tmp/ADS-02.v1.1.backup.md` permite revertir en un paso.**

---

# 7. Divergencias registradas y **no corregidas**

**La auditoría de §7 completa encontró dos divergencias fuera del alcance de la Tarea 2.**

| ID | Ubicación | Problema | Origen |
| :-: | --- | --- | :-: |
| **D-5** | **§3, RQ-4** | *«versiones sucesivas de **análisis, puntuación y propuesta**»* — **tres activos**. ADR-13 §10.3 versiona **cuatro**: falta el **Diagnóstico Comercial (A-11)** | **ADR-13 v1.2** |
| **D-6** | **§5.1** | La misma omisión de A-11 | **ADR-13 v1.2** |

**Por qué no se corrigieron:**

| # | Razón |
| :-: | --- |
| **1** | Están en **§3 y §5.1**, no en §7. **Los cuatro cambios de la Tarea 2 son todos de §7** |
| **2** | Derivan de **v1.2**, no de v1.3 ni de los disparadores de la Tarea 1 |
| **3** | **§3 tiene tratamiento separado y consistente** en toda la cadena: es **F-2 Capa B** |
| **4** | Corregirlas sería un **cambio no encargado** |

> ⚠️ **Consecuencia registrada: §7 queda sincronizada y §3 no.** Es alcance deliberado, no olvido — y **§7 es la sección que un implementador consulta**, de modo que el riesgo principal queda cubierto.

**También registrada, sin clasificar como divergencia:** la cabecera declara *«Estándar aplicado: **ADS-00 v1.2**»* cuando ADS-00 está en **v1.3**. **Podría ser registro histórico legítimo**; ninguna regla lo determina. **No modificada.**

---

# 8. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Pruebas iniciales → finales | **197 → 197** |
| **Ficheros `.ts` / `.tsx` modificados** | **0** |
| **Impacto funcional** | **NINGUNO** |

> **El código ya era conforme.** Los tres adapters versionados ordenan por número de emisión y ninguno por marca temporal *(COM-43 §5.2)*. **La sincronización de ADS-02 no exige ni habilita cambio de código.**

---

# 9. Efecto sobre los bloqueos

| ID | Bloqueo | Antes | Ahora |
| :-: | --- | :-: | :-: |
| **PO-c** | Aprobación y corrección de ADS-02 §7 | 🔴 Abierto | ✅ **CERRADO** |
| **COM-19 §9** | Criterio de vigencia | 🟢 Respondido | 🟢 **Reflejado ya en ADS-02** — pendiente cierre formal |
| **F-2 Capa B** | Requisitos de motor en **§3** | 🟡 Desbloqueado | 🟡 **Sin cambio** — pendiente **AT-c** |

**Sin cambio:** **PO-a** · **PO-b** · **PO-d** *(SP-01)* · **PO-e** *(B-2)* · **PO-f** *(CH-01/02/03)* · **AT-b** a **AT-h** · **ING-a** a **ING-c**.

> ### **De 16 bloqueos abiertos a 15.** Dos sprints consecutivos cerrando uno cada uno: **AT-a** en COM-46, **PO-c** en COM-47.

---

# 10. Riesgos

| # | Riesgo | Sev. |
| :-: | --- | :-: |
| **1** | **El catálogo sigue diciendo ADS-02 v1.1** *(§5)* | 🟢 Baja |
| **2** | **§3 y §5.1 conservan la enumeración de tres activos versionados** *(§7)* | 🟡 Media |
| **3** | **La propuesta v1.4 de ADR-13 sigue huérfana.** COM-45 recomendó repartirla entre DEV-00 §5.1 y ADS-02 §7; **la parte de ADS-02 §7 ya no aplica** —la fila se ha escrito sin fijar el nombre del campo—, y **queda pendiente la de DEV-00** | 🟡 Media |
| **4** | **`issue` / `emission` sigue sin resolverse** en DEV-00 §5.1 | 🟢 Baja |

> **El riesgo 3 se reduce con este sprint:** al redactar la fila de vigencia **por concepto**, sin nombrar el campo, **la recomendación de COM-45 queda ejecutada en su parte de ADS-02 sin necesidad de v1.4.**

---

# 11. Siguiente paso

**Tres actos, ninguno bloqueado, ninguno toca código:**

| # | Acto | Autoridad | Esfuerzo |
| :-: | --- | --- | :-: |
| **1** | **`INDEX.md`: ADS-02 `1.1` → `1.2`** | Product Office | **Una línea** |
| **2** | **Cerrar formalmente COM-19 §9** — abierta desde el Sprint 19, ya respondida en ADR-13 y ADS-02 | Architecture Team | Un registro |
| **3** | **Resolver `issue` / `emission` en DEV-00 §5.1** | Architecture Team | ⚠️ Arrastraría código si se unifica |

**Y a mayor plazo:** **§3 / F-2 Capa B**, bloqueado por **AT-c** *(identidad lógica de A-4/A-5, no declarada)*.

---

# 12. Referencias

**ADS-00 v1.3** R-1, R-3 · **ADS-02 v1.2** *(cabecera, Historial, §3, §5.1, §7)* · **ADR-12 v1.1** §12.1 · **ADR-13 v1.3** §10.3 *(V-2, V-3, V-4)*, §12.3 *(G-1 a G-10)*, §13.1, §13.4 · **ADR-16 v1.1** §4.2, §4.3, §4.4 · **DEV-00** §5.1 · **`docs/blueprint/INDEX.md`** · **COM-19** §9 · **COM-40/1** · **COM-41/A** · **COM-42/A** · **COM-43** §5.2 · **COM-44/3** · **COM-45/1** §2.4 · **COM-46** · **COM-46/1** · **COM-47/1**.
