# APS-17 — Parámetros Iniciales del Producto

**Versión:** 1.1

**Estado:** Approved

**Clasificación:** Interno

**Propietario:** AKVEZ Product Office

**Aprobado por:** **AKVEZ Product Office** — sprint GOV-01, 2026-07-29

**Estándar Aplicado:** ADS-00 v1.2

**Autoridad de dominio:** PO-01 (Approved) · APS-07 v2.0 · **ADR-11 v2.1 (Approved)**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-29 | AKVEZ Product Office | **Ratificación formal.** Estado `Draft` → **`Approved`**. **No se modifica ningún parámetro, ninguna capa declarada ni ninguna regla de gobernanza:** los 21 valores de §4 a §7 y las cinco reglas G-1 a G-5 permanecen intactos. | Sprint **GOV-01**. Habilitado por la ratificación de **ADR-11 v2.1**, cuyo Criterio de Invariancia del Conjunto es el marco de admisibilidad de todo este documento, y de **ADR-13 v1.1**, del que dependen WS-03 y PG-03. La ratificación de la ejecución diferida de ADR-13 §11.2 confirma la coherencia de **WS-03**: al agotarse la duración máxima, los Leads registrados permanecen y los pendientes conservan su estadio. **Autoridad que aprueba: AKVEZ Product Office**, pronunciamiento del 2026-07-29. |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Creación inicial. Publica los parámetros configurables del MVP para Workspace, Biblioteca, Pitch Generator y sistema, con su capa de residencia y su verificación frente al Criterio de Invariancia del Conjunto. | Tarea 3 del sprint PC-01. Evitar que valores operativos no publicados se fijen de hecho durante la implementación, que es el mecanismo por el que una restricción técnica termina convirtiéndose en regla de negocio. |

> **Sobre el código.** El sprint proponía `APS-12`, pero ese código **ya está asignado** a *Product Quality Assurance Framework* (v1.0, Approved). Se emplea **APS-17**, el siguiente disponible, para no duplicar códigos documentales.

---

# Tabla de Contenido

1. Propósito
2. Alcance
3. Regla de Admisibilidad
4. Parámetros del Workspace
5. Parámetros de la Biblioteca de Leads
6. Parámetros del Pitch Generator
7. Parámetros del Sistema
8. Tabla Consolidada
9. Gobernanza de los Parámetros
10. Dependencias
11. Referencias

---

# 1. Propósito

Publicar los **valores operativos iniciales** del MVP, de modo que ninguno quede sin definir y termine fijándose de hecho en el código.

Este documento contiene **configuración**, no lógica y no arquitectura. Un parámetro puede cambiarse sin modificar ninguna decisión del Blueprint; si cambiarlo exigiera modificar una decisión, no es un parámetro y no pertenece aquí.

---

# 2. Alcance

## 2.1 Incluye

Valores configurables de Workspace, Biblioteca de Leads, Pitch Generator y sistema, con indicación de la capa en la que residen y de su verificación frente a ADR-11.

## 2.2 No incluye

- Arquitectura, lógica de negocio y reglas del dominio.
- Motor de persistencia, esquema de datos e índices — corresponden a **ADS-02**.
- Ponderaciones del Opportunity Score — corresponden a **APS-08 §7.1**.
- Diseño visual y maquetación — corresponden a APS-04.

---

# 3. Regla de Admisibilidad

> **Todo parámetro de este documento es una limitación técnica y debe residir fuera del dominio.**

Conforme al **Criterio de Invariancia del Conjunto** (ADR-11 §7.1), cada parámetro se somete a una prueba antes de publicarse:

> *Si este valor se duplicase, se redujese a la mitad o desapareciese, ¿tendría el usuario un conjunto de Leads distinto en su Biblioteca?*

- **Sí** → **Inadmisible.** Sería una regla de dominio disfrazada de configuración.
- **No** → **Admisible**, en la capa que le corresponda según ADR-11 §8.

**Cada parámetro de §4 a §7 declara su capa y el resultado de esta prueba.** Ninguno la incumple.

## 3.1 Dos parámetros propuestos que no pueden publicarse tal como se enunciaron

El encargo de este sprint proponía dos parámetros que **vulneran el dominio en su formulación literal**. Se documentan aquí en lugar de omitirse en silencio.

### «Máximo de Leads por ejecución»

**Inadmisible como límite sobre Leads.** Un tope de cuántos Leads produce una búsqueda es, exactamente, un Top N — eliminado del dominio por **PO-01 §6** y declarado materia cerrada **E-2** en ADR-11 §9. Falla la prueba de §3: al cambiarlo, cambiaría el conjunto de Leads del usuario.

**Sustituido por `WS-01 — Tamaño de tanda de procesamiento`** (§4): fragmenta el trabajo internamente y **recompone el conjunto completo** antes de devolver el control, conforme a ADR-11 §7.3 y §8.3. Todas las Empresas descubiertas y no duplicadas se registran, con independencia de su valor.

### «Política de conservación» y «tamaño inicial» de la Biblioteca

**Inadmisibles.** Una política de conservación que elimine Leads antiguos vulnera **PO-01 §8** —«ninguna etapa expulsa»—, la regla 3 de APS-07 v2.0 §7.2, la regla de no destrucción de ADR-13 §10.2 y la materia cerrada **E-5** de ADR-11 §9.

**La política de conservación de la Biblioteca es: conservación indefinida y sin límite de tamaño.** No es un parámetro configurable, sino una consecuencia del dominio (§5). La única supresión admisible es la derivada de los derechos del usuario sobre sus datos personales conforme a APS-10, que es una obligación legal ajena a esta configuración.

---

# 4. Parámetros del Workspace

| Código | Parámetro | Valor inicial | Capa | ¿Cambia el conjunto de Leads? |
| --- | --- | ---: | --- | --- |
| **WS-01** | Tamaño de tanda de procesamiento | **10 Leads** | Infraestructura | **No** — se recompone el conjunto completo |
| **WS-02** | Análisis simultáneos por ejecución | **5** | Infraestructura | **No** |
| **WS-03** | Duración máxima de una ejecución | **180 s** | Infraestructura | **No** — el trabajo completado persiste |
| **WS-04** | Resultados por página en la vista | **25** | Experiencia de Usuario | **No** — vista recorrible en su totalidad |
| **WS-05** | Orden por defecto | **Opportunity Score descendente** | Experiencia de Usuario | **No** |
| **WS-06** | Filtros activos por defecto | **Ninguno** | Experiencia de Usuario | **No** |

**WS-01.** Tamaño de cada tanda enviada al Lead Analyzer. **No limita cuántas Empresas se registran**: el Registro ocurre antes, en el Lead Hunter, y alcanza a todas (APS-03 v3.0 §8.1, paso 4).

**WS-03.** Si la duración se agota, los Leads ya registrados **permanecen** y los pendientes de analizar conservan su estadio. Ningún Lead desaparece (ADR-13 §11.2, regla A-2).

**WS-06.** Valor obligatorio, no preferencia: **ningún filtro se aplica por defecto** (APS-04 v4.0 §A.9, UI-3; ADR-11 §8.6).

---

# 5. Parámetros de la Biblioteca de Leads

| Código | Parámetro | Valor inicial | Capa | ¿Cambia el conjunto de Leads? |
| --- | --- | ---: | --- | --- |
| **BL-01** | Política de conservación | **Indefinida** | **Dominio — no configurable** | — |
| **BL-02** | Tamaño máximo | **Sin límite** | **Dominio — no configurable** | — |
| **BL-03** | Elementos por página | **50** | Experiencia de Usuario | **No** |
| **BL-04** | Leads descartados visibles por defecto | **No** *(reversible)* | Experiencia de Usuario | **No** — permanecen y son recuperables |

> **BL-01 y BL-02 no son parámetros.** Se enumeran para dejar constancia de que **no existe valor configurable** que los altere. La Biblioteca conserva todo indefinidamente y solo crece (PO-01 §4 y §8; APS-07 v2.0 §8).

**BL-04.** Los Leads descartados se ocultan de la vista principal por decisión previa del usuario, y **el filtro es reversible** conforme a UI-3. El Lead permanece en la Biblioteca y es recuperable (APS-07 v2.0 §7; ADR-12 §8.2).

---

# 6. Parámetros del Pitch Generator

| Código | Parámetro | Valor inicial | Capa | ¿Cambia el conjunto de Leads? |
| --- | --- | ---: | --- | --- |
| **PG-01** | Propuestas simultáneas en generación | **1 por usuario** | Infraestructura | **No** |
| **PG-02** | Política de regeneración | **Permitida, sin límite** | Aplicación | **No** |
| **PG-03** | Versiones de propuesta conservadas | **Todas** | **Dominio — no configurable** | — |
| **PG-04** | Duración máxima de una generación | **60 s** | Infraestructura | **No** |

**PG-02.** APS-04 v4.0 §A.5 (P-10) permite regenerar. No se fija tope: un límite de regeneraciones sería una restricción de producto no decidida, y este documento no crea decisiones.

**PG-03.** No es configurable. Toda emisión se conserva conforme al versionado de ADR-13 §10.3 (V-1). Regenerar **añade** una versión; nunca sustituye a la anterior.

---

# 7. Parámetros del Sistema

| Código | Parámetro | Valor inicial | Capa | ¿Cambia el conjunto de Leads? |
| --- | --- | ---: | --- | --- |
| **SY-01** | Tiempo de espera — proveedor de descubrimiento | **15 s** | Integración | **No** |
| **SY-02** | Tiempo de espera — proveedor de IA | **45 s** | Integración | **No** |
| **SY-03** | Reintentos ante fallo recuperable | **3** | Infraestructura | **No** |
| **SY-04** | Espera entre reintentos | **Progresiva: 1 s · 2 s · 4 s** | Infraestructura | **No** |
| **SY-05** | Peticiones por minuto al proveedor de descubrimiento | **60** | Integración | **No** — se pagina hasta agotar |
| **SY-06** | Elementos por llamada al proveedor de descubrimiento | **20** | Integración | **No** — se pagina hasta agotar |
| **SY-07** | Duración de la sesión de usuario | **7 días** | Infraestructura | **No** |

**SY-05 y SY-06** son los parámetros de mayor riesgo del documento. Son límites impuestos por el proveedor, y **ADR-11 §8.4 obliga a agotar la fuente mediante paginación, nunca a renunciar al resto**. Si la fuente devuelve resultados de veinte en veinte, la capa de Integración repite la llamada hasta agotarlos.

> **Renunciar al resto por respetar un cupo convertiría una restricción de proveedor en una regla de negocio**, que es precisamente el defecto que originó toda la consolidación del Blueprint.

---

# 8. Parámetros del Modelo de Valor de Proyecto

> **Añadido en H-14.C.** Diseño en `H-14.B — Project Value Model.md`; origen de las cifras en `H-14.B.1 — PV-D1 Proposal.md`.

| Código | Parámetro | Valor inicial | Capa | ¿Cambia el conjunto de Leads? |
| --- | --- | ---: | --- | --- |
| **PV-01** | Rango de valor potencial · tier «Sitio web» | **COP 2.500.000 – 6.000.000** | Experiencia de Usuario | **No** — no filtra, no ordena, no descarta |
| **PV-02** | Moneda de presentación | **COP** | Experiencia de Usuario | **No** |
| **PV-03** | Confianza declarada del modelo | **Media** | Experiencia de Usuario | **No** |

**Prueba del §3.** Si PV-01 se duplicase, se redujese a la mitad o desapareciese, el usuario tendría **exactamente el mismo conjunto de Leads** en su Biblioteca: el rango se presenta junto a una oportunidad ya derivada y no participa en el descubrimiento, la deduplicación, el registro ni la ordenación. → **Admisible**, en la capa de Experiencia de Usuario conforme a G-3.

**PV-01.** Un solo tier, activado por los tipos de oportunidad `WEB_PRESENCE` y `OWNED_DOMAIN`. Ambos comparten rango porque significan el mismo trabajo —construir un sitio— y ninguna fuente de mercado cotiza por separado la migración desde una red social. Diferenciarlos exigiría inventar la distancia entre ambos.

**PV-03.** La confianza es **Media y no Alta**: las cifras proceden de precios publicados, no de transacciones verificadas, y en su mayoría publicados por quien vende el servicio. No podrá elevarse hasta que existan proyectos cerrados que las confirmen.

> ⚠️ **La admisibilidad de PV-01 es condicional.** Si el rango llegara alguna vez a ordenar, filtrar o puntuar Leads, dejaría de superar la prueba del §3 y pasaría a ser regla de dominio disfrazada de configuración. El valor potencial y el Opportunity Score son magnitudes paralelas: APS-08 y WP-01 no lo incorporan, y ADR-14 no se ve afectado.

---

# 8bis. Tabla Consolidada

| Capa | Parámetros | Naturaleza |
| --- | --- | --- |
| **Dominio** | BL-01 · BL-02 · PG-03 | **No configurables.** Consecuencias del dominio, enumeradas para constancia |
| **Aplicación** | PG-02 | Coordinación, sin reducción del conjunto |
| **Infraestructura** | WS-01 · WS-02 · WS-03 · PG-01 · PG-04 · SY-03 · SY-04 · SY-07 | Tanda, concurrencia, espera, reintentos |
| **Integración** | SY-01 · SY-02 · SY-05 · SY-06 | Cupos de proveedor. Obligan a paginar, nunca a truncar |
| **Experiencia de Usuario** | WS-04 · WS-05 · WS-06 · BL-03 · BL-04 · **PV-01 · PV-02 · PV-03** | Vistas recorribles, filtros reversibles y presentación del valor orientativo |

**Total: 24 parámetros. Ninguno reside en el dominio.** Los tres declarados en la fila de Dominio no son configurables: se enumeran para dejar constancia de que no existe valor que los altere.

---

# 9. Gobernanza de los Parámetros

**G-1.** Modificar el valor de un parámetro es un cambio **Menor** conforme a APS-13 §9, salvo que altere la capa en la que reside, en cuyo caso es **Mayor**.

**G-2.** Ningún parámetro podrá trasladarse a una capa distinta de la declarada en §8 sin superar de nuevo la prueba de §3.

**G-3.** **Ningún parámetro nuevo podrá introducirse en la capa de dominio.** ADR-11 §8.1 lo prohíbe sin excepción.

**G-4.** Todo parámetro propuesto deberá declarar su capa y el resultado de la prueba del Criterio de Invariancia antes de publicarse.

**G-5.** Los valores de este documento son **iniciales**. Se espera ajustarlos con la operación real; ese ajuste no requiere modificar ninguna decisión del Blueprint — que es precisamente la propiedad que los hace parámetros.

---

# 10. Dependencias

Este documento depende de:

- **PO-01** §3, §4, §6, §7, §8. Autoridad funcional del dominio.
- **ADR-11** §7.1, §7.3, §8, §9. **Criterio de Invariancia y reparto por capas. Marco de admisibilidad de todo este documento.**
- **APS-07 v2.0** §7.2, §8. Contenido de la Biblioteca y reglas del ciclo de vida.
- **APS-03 v3.0** §8.1, §8.2. Flujo canónico y prohibiciones.
- **APS-04 v4.0** §A.9. Reglas vinculantes de interfaz.
- **ADR-13** §10.3, §11.2. Versionado y asincronía.
- **ADR-12** §8.2. El descarte no altera la identidad.
- **APS-10**. Derechos del usuario sobre sus datos personales.
- **APS-13** §9. Clasificación de cambios.
- **ADS-02 v1.1 (Approved)**. Motor de persistencia.

---

> ## ✅ Ratificación formal — v1.1, 2026-07-29
>
> **El Product Office ratificó este documento en el sprint GOV-01.** Estado `Draft` → **`Approved`**.
>
> **Los 21 parámetros quedan oficialmente publicados** y son de aplicación obligatoria desde el inicio del desarrollo. Ninguno reside en la capa de dominio.
>
> **Los valores siguen siendo iniciales** (§9, G-5): se espera ajustarlos con la operación real, y ese ajuste **no requiere modificar ninguna decisión del Blueprint**. Es la propiedad que los hace parámetros, y la ratificación no la altera.
>
> **BL-01, BL-02 y PG-03 no son configurables** y su ratificación no los convierte en tales: siguen siendo consecuencias del dominio.

---

# 11. Referencias

- PO-01 — Decisión de Producto: Definición Canónica de Lead, §3, §4, §6, §7, §8.
- ADR-11 — Frontera entre Dominio e Implementación, §7.1, §7.3, §8, §9.
- ADR-12 — Identidad Canónica del Lead, §8.2.
- ADR-13 — Motor Canónico de Persistencia, §10.2, §10.3, §11.2.
- ADS-02 — Implementación del Motor de Persistencia.
- APS-03 v3.0 §8.1, §8.2 · APS-04 v4.0 §A.5, §A.9 · APS-07 v2.0 §7.2, §8 · APS-08 v1.2 §7.1 · APS-10 · APS-13 §9.
- ADS-00 v1.2 — Documentation Standard.
