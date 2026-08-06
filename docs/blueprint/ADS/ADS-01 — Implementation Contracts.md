# ADS-01 — Implementation Contracts

| Campo | Valor |
| --- | --- |
| Código | ADS-01 |
| Clasificación | AKVEZ Documentation Standard — Mapa de Implementación |
| Versión | 1.4 |
| Estado | Approved |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | **ADS-00 v1.3** |

> **Naturaleza del documento.** Es un **mapa de localización**, no una fuente de verdad.
>
> **No introduce arquitectura nueva. No modifica ninguna decisión. No define nada.** Su única función es responder a la pregunta *«¿dónde está decidido esto?»* en el menor tiempo posible.
>
> **Regla de uso.** Si este documento y el documento canónico discrepan, **prevalece el canónico, sin excepción**. Una entrada errónea aquí es un defecto de este índice, nunca una decisión.
>
> **Nunca cites ADS-01 como fundamento.** Cita el documento al que remite.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.4** | 2026-07-30 | AKVEZ Product Office | **Sincronización con el estado documental posterior al Architecture Freeze. Ninguna decisión, ninguna regla, ninguna definición nueva.** **§3** — altas de **ARCH-01**, **ADR-15**, **ADR-16** y **ADR-17**, ausentes del mapa; nueva **§3.2** con la localización de la capa de aplicación y los puertos. **§4** — alta de la fila del **Sistema Comercial** y de sus documentos. **§8** — se corrige la referencia rota *«ADR-06 §207»*, que no existe: ADR-06 tiene 23 secciones. **§10** — *Reglas de precedencia* pasa de **«R-1 a R-6»** a **«R-1 a R-7»**: faltaba precisamente **R-7**, la que gobierna la categoría DEV a la que este mapa sirve; altas de las series **AL**, **LS**, **RA**, **RC** y **CA-16**. **§11** — se corrige la referencia rota *«ADR-08 §312»* y se **retira la nota que declaraba ADS-02 y APS-17 en `Draft`**, cuando ambos son `Approved` desde GOV-01. **§11.1** — altas. **Portada** — estándar aplicado v1.2 → **v1.3**. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 9, con alcance ampliado autorizado por el Product Office. **Este documento es el mapa «¿dónde está decidido esto?»**: tras aprobarse ocho documentos nuevos, un mapa que no los localiza y que declara `Draft` lo que está `Approved` **induce exactamente el error que su propia *Regla de uso* previene**. Se sincroniza en último lugar, después de los documentos canónicos. |
| **1.3** | 2026-07-30 | AKVEZ Product Office | **Sincronización de §5.2 con ADR-13 v1.2.** El catálogo de eventos declaraba que *«Pitch generado»* **actualiza el estadio**, que dejó de ser cierto. Se corrige la fila —ahora **«Propuesta comercial emitida»**, sin actualización— y se incorporan **E-7, E-8 y E-9**. **No se modifica ninguna otra tabla ni regla.** | Sprint de **Estabilización del Dominio Comercial**. Defecto detectado en la verificación posterior a la enmienda de ADR-13: la v1.2 corrigió §4.1 pero **§5.2 conservaba la misma conflación**. Un mapa que remite a una semántica derogada induce precisamente el error que su *Regla de uso* previene. |
| **1.2** | 2026-07-30 | AKVEZ Product Office | **Sincronización de §4.1.** La fila del **Pitch Generator** dejaba de reflejar el canon tras PO-01 v1.2, APS-07 v2.1 y APS-03 v3.1: atribuía al agente la escritura del **estadio**, que ya no le corresponde. Se corrige su producción —*Secuencia diseñada · Propuesta*— y se añade una fila para la **declaración del usuario**, que es quien produce *Lead Contactado*. **No se modifica ninguna otra tabla de localización ni ninguna regla.** | Sprint **COM-09**, tarea 5. Este documento es el mapa «¿dónde está decidido esto?»: una fila desactualizada remite a una definición derogada, que es exactamente el defecto que su propia *Regla de uso* previene. **Se sincroniza en último lugar**, después de los cinco documentos canónicos, conforme al orden de PO-02 §9.1. |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Sincronización documental.** Se retiran de §11 el *Motor de persistencia* y los *Valores de las ponderaciones del Score*, que dejan de estar pendientes, y se sustituyen por remisión a **ADS-02** y a **APS-08 §7.1**. Se actualizan las dos entradas ⚠️ que remitían a esas filas — §5 (*Motor de base de datos*) y §7 (*Valores concretos de las ponderaciones*) — y se añade **APS-17** a §3.1. **No se modifica ninguna otra sección, ninguna tabla de localización ni ninguna regla.** | Tarea 2 del sprint PC-01.1. Este documento es el mapa «¿dónde está decidido esto?»: declarar pendiente una decisión ya tomada induce precisamente la improvisación que AR-02 (riesgo RA-1) buscaba evitar. |
| 1.0 | 2026-07-29 | AKVEZ Product Office | Creación inicial. Mapa completo tema → documento canónico para dominio, arquitectura, agentes, persistencia, navegación, Opportunity Score, contratos públicos, seguridad y gobernanza. | Fase 4 de PLAN-01. El Blueprint alcanzó 44 documentos y localizar una decisión concreta exigía conocer previamente su estructura. Este documento elimina ese requisito previo. |

---

# Tabla de Contenido

1. Cómo usar este documento
2. Dominio
3. Arquitectura
4. Agentes
5. Persistencia
6. Navegación e Interfaz
7. Opportunity Score
8. Contratos Públicos y API
9. Seguridad, Calidad y Gobernanza
10. Reglas Vinculantes — Localizador Rápido
11. Qué NO está decidido todavía
12. Referencias

---

# 1. Cómo usar este documento

1. Busca tu tema en la tabla correspondiente.
2. Abre el documento canónico indicado, en la sección señalada.
3. Si necesitas contexto histórico —*por qué* se decidió así—, consulta la columna de antecedentes, cuando exista.

**Convención de las tablas.**

| Símbolo | Significado |
| --- | --- |
| **Negrita** | Documento canónico. Es la autoridad de esa materia |
| 📦 | Documento `Archived`. **Solo contexto histórico; nunca autoridad** |
| ⚠️ | Materia **no decidida todavía**. Véase §11 |

---

# 2. Dominio

## 2.1 Conceptos

| Concepto | Documento canónico | Sección |
| --- | --- | --- |
| **Empresa** | **PO-01** | §1 · APS-07 §5, §16 |
| **Lead** | **PO-01** | §2 · APS-07 §5, §16 |
| **Registro** *(evento que crea el Lead)* | **PO-01** | §3 · APS-07 §7.1 |
| **Biblioteca de Leads** | **PO-01** | §4 · APS-07 §8 |
| **Opportunity Score** *(qué es)* | **PO-01** | §5 · APS-07 §16 |
| **Vista** *(≠ Biblioteca)* | **APS-07** | §8.3 |
| **Identidad del Lead** | **ADR-12** | §7 |
| Ciclo de vida y sus reglas | **PO-01** | §8 · APS-07 §6, §7, §7.2 |
| Nomenclatura oficial de los estadios | **APS-07** | §6.1 |
| Orden Análisis → Evaluación | **PO-01** | §5, §8 · APS-07 §6.3 |

## 2.2 Reglas del dominio que no admiten excepción

| Regla | Documento canónico |
| --- | --- |
| Se registran **todas** las Empresas descubiertas y no duplicadas | **PO-01 §3** · APS-03 §8.1 |
| Todo lo que hay en la Biblioteca es un Lead | **PO-01 §4** |
| **No existe Top N** | **PO-01 §6** · APS-03 §8.2 · ADR-11 §9 |
| **No existe umbral de exclusión** | **PO-01 §7** · APS-08 §8.6 |
| Ninguna etapa expulsa a un Lead | **PO-01 §8** · APS-07 §7.2 |
| Nada se reemplaza; cada etapa añade conocimiento | **PO-01 §8** · ADR-13 §10.2 |
| Un Lead sin análisis y sin Score es estado válido | **PO-01 §5** · APS-07 §8.4 |

## 2.3 Antecedentes históricos

| Materia | Documento 📦 |
| --- | --- |
| Por qué fue necesaria una decisión de Product Office | 📦 AR-01 · 📦 REV-02 |
| Qué decía el Blueprint antes de la consolidación | 📦 REV-01 |
| Alternativas de persistencia evaluadas | 📦 ADR-10 §8 |
| Ciclo de vida — análisis previo | 📦 DP-01 |

---

# 3. Arquitectura

| Tema | Documento canónico | Sección |
| --- | --- | --- |
| Arquitectura modular por capas | **ADR-01** | Completo |
| Orquestación de capacidades | **ADR-02** | §7, §8 |
| Agentes en el backend | **ADR-04** | Completo |
| Persistencia — estructura | **ADR-05** | §6, §7, §9 |
| Persistencia — frontera y dependencias | **ADR-08** | §8, §10 |
| Persistencia — semántica de escritura | **ADR-13** | Completo |
| Inyección de dependencias | **ADR-09** | Completo |
| **Frontera dominio / implementación** | **ADR-11** | §7, §8, §9 |
| **Anatomía del caso de uso, puertos y contratos** | **ADR-17** | §5, §6, §7, §8 |
| **Dependencia de `application/` hacia `infrastructure/`** | **ADR-17** | **§12** *(AL-19, AL-20)* |
| **Dónde va cada pieza** *(mapa físico)* | **ARCH-01** | §1, §5, §6 |
| **Línea de Decisión del sistema comercial** | **ADR-15** | **§8** |
| **Entidades, eventos y casos de uso comerciales** | **ADR-16** | §4, §6, §7 |
| Proveedores externos | **ADR-03** · APS-11 | — |
| Arquitectura técnica general | **APS-16** | Completo |

> **ARCH-01 no es autoridad: es un mapa físico**, como éste lo es temático. **Ante discrepancia prevalece el ADR.** «ARCH» no pertenece a la Clasificación Oficial de ADS-00, que es cerrada.

## 3.2 La capa de aplicación — dónde está cada cosa

| Pregunta | Documento canónico | Sección |
| --- | --- | --- |
| **¿Qué forma tiene un caso de uso?** | **ADR-17** | §5 — función asíncrona por factory, un fichero, un evento |
| **¿Qué recibe la factory?** | **ADR-17** | §8 — un objeto `Deps`, sin dependencias opcionales |
| **¿Qué devuelve?** | **ADR-17** | §7 — tipo propio del módulo, unión discriminada. **Sin `Result<T>` común** |
| **¿Dónde se declara un puerto?** | **ADR-17** | **§6.2** — de proveedor en `domain/`; de persistencia en `shared/persistence/repositories/` |
| **¿Quién construye el adapter?** | **ADR-09 §5.1** · **ADR-17 §9** | El **Composition Root**, y solo él |
| **¿Cómo viaja un error?** | **ADR-17 §10** · **DEV-00 §3.12** | R-61 a R-64. El **adapter** envuelve; el caso de uso nunca ve un error de SDK |
| **Reglas comprobables sobre código** | **DEV-00** | **§3.13** *(R-65 a R-69)* · §3.1 *(R-05)* |

> **`application/` no importa `infrastructure/`.** Es la regla **AL-19** de ADR-17 §12, en vigor desde el 2026-07-30. **Retira una facultad que ADR-07 §8 concedía**, mediante una decisión posterior de su mismo rango; **ADR-07 §8 conserva su texto íntegro**.

## 3.1 Dónde puede residir una limitación técnica

Consulta obligada antes de introducir cualquier límite, cupo, tanda o recorte: **ADR-11 §8**.

| Capa | Limitaciones admisibles | Referencia |
| --- | --- | --- |
| **Dominio** | **Ninguna** | ADR-11 §8.1 |
| **Aplicación** | Ninguna sobre el conjunto | ADR-11 §8.2 |
| **Infraestructura** | Tanda, concurrencia, reintentos, caché | ADR-11 §8.3 |
| **Integración** | Cupos de proveedor, paginación de la fuente | ADR-11 §8.4 |
| **Presentación** | Paginación de respuesta, *streaming* | ADR-11 §8.5 |
| **Experiencia de Usuario** | *Lazy loading*, filtros reversibles | ADR-11 §8.6 |

**Prueba de admisibilidad** — *Criterio de Invariancia del Conjunto*, ADR-11 §7.1:

> Si el límite se duplicase o desapareciese, ¿tendría el usuario un conjunto de Leads distinto? **Sí → inadmisible. No → admisible, en su capa.**

**Los valores concretos ya están publicados: no los inventes.** Los 21 parámetros del MVP, con su capa declarada y el resultado de esta prueba para cada uno, están en **APS-17**. Véase §11.2.

---

# 4. Agentes

| Agente | Documento canónico | Sección |
| --- | --- | --- |
| **Lead Hunter** | **APS-03** | §7.1 |
| **Lead Analyzer** | **APS-03** | §7.2 |
| **Pitch Generator** *(Sistema Comercial)* | **APS-03** | §7.3 · **PO-02** §1, §6 |
| Flujo canónico entre agentes | **APS-03** | §8.1 |
| Prohibiciones del flujo | **APS-03** | §8.2 |
| Ubicación en el backend | **ADR-04** | Completo |
| Correspondencia con bloques de orquestación | **ADR-02** | §8, nota aclaratoria |
| Escritura de cada agente | **ADR-13** | §9 |

## 4.0 El Sistema Comercial

| Materia | Documento canónico | Sección |
| --- | --- | --- |
| **Alcance de la V1: qué hace y qué no** | **PO-02** | §6 |
| **Diseñar ≠ ejecutar ≠ automatizar** — *Prueba del Disparador* | **PO-02** | **§2.1** |
| **Cuándo un Lead está Contactado** | **PO-02** | **§5** — *lo declara el usuario* |
| **Estados oficiales del Lead** | **PO-02** | **§5.1** *(LS-1 a LS-5)* |
| **Cómo vende AKVEZ** — ocho principios, Estrategia, Secuencia | **APS-18** | §4, §5, §8, §9 |
| **Regla de Evidencia** | **APS-18** | §11 |
| **Diagnóstico del comprador** — siete variables, Modelo de Consciencia | **APS-19** | §5, §6 |
| **Canales y sus restricciones** | **APS-20** | §5, §6, §7 |
| **Dónde vive cada preocupación** — Línea de Decisión | **ADR-15** | §7, **§8** |
| **El punto de control del texto** | **ADR-15** | **§10** — reside en `domain/` |
| **Entidades del dominio comercial** | **ADR-16** | §4 |
| **Casos de uso comerciales** | **ADR-16** | §7 |

> ⏸️ **La gobernanza del Perfil de Estrategia está `Pospuesta`** con disparador expreso: se exige **antes de emitir la primera estrategia**, es decir antes de implementar `GenerateProposal` *(ADR-15 §7.4)*. **`GenerateDiagnosis` y `CreateSequence` no la necesitan.**

## 4.1 Quién hace qué

| Agente | Ejecuta | Produce | Escribe |
| --- | --- | --- | --- |
| **Lead Hunter** | Descubrimiento · **Registro** | Lead | Identidad, atributos, estadio, historial |
| **Lead Analyzer** | Análisis · Evaluación · Ordenación | Lead Analizado → Lead Evaluado | Análisis, Opportunity Score, estadio |
| **Pitch Generator** *(Sistema Comercial)* | Diagnóstico · Estrategia · Secuencia · Propuesta | Secuencia diseñada · Propuesta | Propuesta *(**no** el estadio)* |
| **— *(el usuario)*** | Declaración de contacto | **Lead Contactado** | Estadio |

> **Corrección frecuente.** El bloque `Scoring` de ADR-02 §8 **no es una capacidad separada**: es una operación del **Lead Analyzer**. Véase ADR-02 §8, nota aclaratoria.

---

# 5. Persistencia

| Operación | Documento canónico | Sección |
| --- | --- | --- |
| **Registro** | **ADR-13** | §11.1 *(Unidad de Registro)* · §13, E-2 |
| **Actualización** | **ADR-13** | §10.4 |
| **Versionado** | **ADR-13** | §10.3 |
| **Identidad** | **ADR-12** | §7, §9 |
| Deduplicación | **ADR-12** | §9 |
| Qué se persiste | **ADR-13** | §6 |
| Qué nunca se persiste | **ADR-13** | §7 |
| Qué puede reconstruirse | **ADR-13** | §8 |
| Atomicidad e idempotencia | **ADR-13** | §11 |
| Eventos del dominio | **ADR-13** | §13 |
| Repository Pattern | **ADR-05** | §7 |
| Reglas de dependencia entre capas | **ADR-08** | §10 |
| **Motor de base de datos y proveedor** | **ADS-02** | §4 · §5 |
| Compromiso de portabilidad del proveedor | **ADS-02** | §5.3 |

## 5.1 Identidad — resumen

| Pregunta | Respuesta | Referencia |
| --- | --- | --- |
| ¿Qué identifica a una Empresa? | Su **Referencia de Origen** | ADR-12 §7.1 |
| ¿Qué identifica a un Lead? | El par **(Referencia de Origen, Usuario)** | ADR-12 §7.2 |
| ¿Qué cambios conservan la identidad? | Doce supuestos | ADR-12 §11.1 |
| ¿Qué cambios crean identidad nueva? | **Solo tres** | ADR-12 §11.2 |
| ¿Una sucursal es la misma Empresa? | **No.** Empresa distinta, Lead distinto | ADR-12 §10.6 |
| ¿Y si la Empresa cierra? | El Lead **permanece** en la Biblioteca | ADR-12 §10.7 |

## 5.2 Catálogo de eventos

| Evento | Escribe | Actualiza | Versiona | Referencia |
| --- | :-: | :-: | :-: | --- |
| Empresa descubierta | **No** | No | No | ADR-13 §13, E-1 |
| Lead registrado | **Sí** | No | No | ADR-13 §13, E-2 |
| Lead redescubierto | No | **Sí** | No | ADR-13 §13, E-2b |
| Lead analizado | Sí | Sí | **Sí** | ADR-13 §13, E-3 |
| Score calculado | Sí | Sí | **Sí** | ADR-13 §13, E-4 |
| Propuesta comercial emitida | Sí | **No** | **Sí** | ADR-13 §13, E-5 |
| Decisión del usuario registrada | Sí | Sí | No | ADR-13 §13, E-6 |
| Diagnóstico comercial emitido | Sí | No | **Sí** | ADR-13 §13, E-7 |
| Secuencia comercial diseñada o actualizada | Sí | **Sí** | No | ADR-13 §13, E-8 |
| **Contacto declarado** | Sí | **Sí** *(estadio)* | Condicional | ADR-13 §13, E-9 |

> **Descubrir no escribe.** Una Empresa descubierta y no registrada no existe para el sistema. ADR-13 §13.3.

---

# 6. Navegación e Interfaz

| Tema | Documento canónico | Sección |
| --- | --- | --- |
| **Todas las pantallas** | **APS-04** | §A.3 |
| Flujo de navegación | **APS-04** | §A.4 |
| Responsabilidad de cada pantalla | **APS-04** | §A.5 |
| Relación pantalla → agente | **APS-04** | §A.6 |
| Estados de pantalla | **APS-04** | §A.7 |
| Componentes conceptuales | **APS-04** | §A.8 |
| **Reglas vinculantes de interfaz** | **APS-04** | §A.9 |
| Design system — color, tipografía, tokens | **APS-04** | Parte B, §9-§21 |

## 6.1 Las trece pantallas

| Código | Pantalla | Zona | Agentes |
| --- | --- | --- | --- |
| P-01 | Landing | Pública | — |
| P-02 | Login | Pública | — |
| P-03 | Registro | Pública | — |
| P-04 | Recuperar Contraseña | Pública | — |
| P-05 | Onboarding | Incorporación | — |
| P-06 | **Dashboard** | Producto | — |
| P-07 | **Workspace** | Producto | Lead Hunter · Lead Analyzer |
| P-08 | **Biblioteca** | Producto | — |
| P-09 | Lead Detail | Producto | Lead Analyzer |
| P-10 | Pitch Workspace | Producto | Pitch Generator |
| P-11 | Perfil | Cuenta | — |
| P-12 | Configuración | Cuenta | — |
| P-13 | Error / No Encontrado | Transversal | — |

> **Solo tres pantallas invocan agentes:** P-07, P-09 y P-10. Las diez restantes, ninguno.
>
> **Workspace ≠ Biblioteca.** El Workspace muestra el resultado de **una ejecución**; la Biblioteca contiene **todo**. APS-04 §A.3.4.

---

# 7. Opportunity Score

| Tema | Documento canónico | Sección |
| --- | --- | --- |
| **Modelo y filosofía** | **APS-08** | §3, §5 |
| Categorías de evaluación | **APS-08** | §6 |
| Escala y combinación ponderada | **APS-08** | §7 |
| **Bandas** | **APS-08** | §8 |
| Ausencia de umbral de exclusión | **APS-08** | §8.6 |
| Explicabilidad | **APS-08** | §9 |
| Aprendizaje del modelo | **APS-08** | §10 |
| **Gobernanza** | **ADR-14** | Completo |
| **Perfil de Ponderación** | **ADR-14** | §7 |
| Comparabilidad entre versiones | **ADR-14** | §10 |
| Scores históricos | **ADR-14** | §11 |
| Persistencia y versionado del Score | **ADR-13** | §10.3 |
| Alcance del juicio del Score | **APS-08** | §3.1 |
| **Valores concretos de las ponderaciones** | **APS-08** — Perfil **WP-01 v1.0** | **§7.1** |

## 7.1 Lo que el Score hace y no hace

| Hace | No hace |
| --- | --- |
| **Clasifica** en una de cinco bandas | **Nunca crea** un Lead |
| **Ordena** de mayor a menor | **Nunca elimina** un Lead |
| | **Nunca define** un umbral de persistencia |

Referencia: APS-08 §8.6 · PO-01 §5, §7.

---

# 8. Contratos Públicos y API

| Tema | Documento canónico | Sección |
| --- | --- | --- |
| Estrategia de contratos públicos | **ADR-06** | Completo |
| Consolidación de la frontera pública | **ADR-07** | Completo |
| Ubicación de los DTO y mappers | **ADR-07** | §8 |
| Versionado de la API | **ADR-06** | **§13** — *Versionamiento* |
| Integraciones externas | **ADR-03** · **APS-11** | — |

> **Corrección de la v1.4.** La entrada remitía a *«ADR-06 §207»*, **una sección que no existe**: ADR-06 tiene 23. **207 era el número de línea** del párrafo de versionamiento en el fichero exportado. La sección correcta es **§13**.

---

# 9. Seguridad, Calidad y Gobernanza

| Tema | Documento canónico |
| --- | --- |
| Seguridad, privacidad y confianza | **APS-10** |
| Aislamiento entre usuarios | **ADR-05** §14 |
| Calidad del producto | **APS-12** |
| Gobernanza del producto y gestión de cambios | **APS-13** |
| Marco de decisión de IA | **APS-09** |
| Métricas y analítica | **APS-06** |
| Roadmap y evolución | **APS-05** |
| Validación de la fundadora | **APS-14** |
| Salida al mercado | **APS-15** |
| **Estándar documental y jerarquía** | **ADS-00** |

---

# 10. Reglas Vinculantes — Localizador Rápido

Reglas que **no admiten excepción**. Consúltalas antes de implementar.

| Conjunto | Dónde | Qué regula |
| --- | --- | --- |
| **Reglas del ciclo de vida** (6) | APS-07 §7.2 | Sujeto único · nada se reemplaza · ninguna etapa expulsa · detenerse es válido · no hay Top N · no hay umbral |
| **Prohibiciones del flujo** (P-1 a P-5) | APS-03 §8.2 | No hay selección · no hay Top N · no hay persistencia parcial · no hay umbral · la Evaluación nunca precede al Análisis |
| **Reglas de interfaz** (UI-1 a UI-10) | APS-04 §A.9 | Qué no puede hacer nunca una pantalla |
| **Materias cerradas** (E-1 a E-6) | ADR-11 §9 | Lo que jamás podrá volver al dominio |
| **Reglas de invariancia** (I-1 a I-12, N-1 a N-3) | ADR-12 §11 | Qué conserva y qué crea identidad |
| **Estrategia de escritura** | ADR-13 §10.2 | Registrar · actualizar · versionar. Nunca reemplazar |
| **Restricciones del Score** (RV-A a RV-G) | ADR-14 §12 | Qué no puede hacer nunca una ponderación |
| **Reglas de precedencia** (**R-1 a R-7**) | ADS-00 | Qué documento prevalece ante un conflicto. **R-7 gobierna la categoría DEV** |
| **Reglas de implementación** (R-01 a R-69, O-1 a O-6, UI-1 a UI-10) | DEV-00 §3 | **85 reglas comprobables sobre código** |
| **Reglas de la capa de aplicación** (**AL-01 a AL-20**) | ADR-17 §14 | Cómo se escribe un caso de uso |
| **Estados del Lead** (**LS-1 a LS-5**) | PO-02 §5.1 | Cuáles son y qué no puede hacer un estado |
| **Restricciones comerciales de arquitectura** (**RA-1 a RA-13**) | ADR-15 §13 | Qué no puede cruzar la Línea de Decisión |
| **Restricciones del dominio comercial** (**RC-1 a RC-15**) | ADR-16 §8 | Qué no puede hacer nunca una entidad comercial |
| **Criterios de aceptación comerciales** (**CA-16-01 a CA-16-15**) | ADR-16 §10.1 | Cómo se comprueba que la Línea se respeta |

> ⚠️ **Los códigos se repiten entre documentos y hay que citarlos siempre con su origen.** `RC-1` designa una restricción en **ADR-16 §8** y un riesgo en **AR-05 §8**; `R-1` a `R-9` designan riesgos en ADR-16 §9 y reglas en ADS-00; `E-1` a `E-6` designan materias cerradas en **ADR-11 §9** y eventos de escritura en **ADR-13 §13.1**. **No es una contradicción, pero una cita sin documento es ambigua.**

---

# 11. Qué NO está decidido todavía

> **Estas materias no tienen documento canónico.** No deben resolverse improvisando durante la implementación: requieren decisión previa.

| ⚠️ Materia | Estado | Referencia |
| --- | --- | --- |
| Modelo de la entidad `User` | Fuera del alcance de ADR-08. No bloquea: ADS-02 §5.2 adopta la autenticación del proveedor y ADR-05 §14 fija el aislamiento exigible. **`userId` es hoy un literal** | **ADR-08 §3** *(alcance)* · ADS-02 §5.2 · DEV-05 RD-2 |
| KPI de la frontera dominio/implementación | Definidos, sin implementar | ADR-11 §13 · AR-02 §4.4 (DD-4) |
| **Gobernanza del Perfil de Estrategia** | ⏸️ **`Pospuesto` con disparador**, no indefinido: se exige **antes de emitir la primera estrategia**. `GenerateDiagnosis` y `CreateSequence` no lo necesitan | **ADR-15 §7.4** · RA-R6 |
| **Parámetros de canal `CH-01` a `CH-03`** | Su **capa ya está decidida** *(Infraestructura, ADR-11 §8.3)* y superan la prueba de invariancia. **Falta publicarlos en APS-17 §6**, y hasta entonces **CC-02 no puede comprobarse** | **APS-20 §12 (Q-3)** · R-50 |
| **Contacto en frío, base legal y condiciones de uso de plataformas** | Ningún documento aprobado lo cubre. **Preexistente** | **APS-18 RG-5** · **APS-20 §12 (Q-4)** · APS-10 |
| **Capa `application/` del frontend** | **ADR-17 §3.2 excluye `src/`.** Afectará a la interfaz comercial, no al backend | **DEV-00 V-8** · ADR-17 RA17-6 |
| **Verificación automática de fronteras y runner de pruebas** | **Ninguna de las 85 reglas de DEV-00 ni de las 20 de ADR-17 se comprueba automáticamente** | **DEV-00 V-1, V-2, V-4** · RI-1 · AR-05 RC-9 |

> **Corrección de la v1.4.** La fila de `User` remitía a *«ADR-08 §312»*, **una sección que no existe**: ADR-08 tiene 17. Era un número de línea del fichero exportado. El alcance se declara en **ADR-08 §3**.

## 11.1 Materias que han dejado de estar pendientes

**Ya tienen documento canónico.** Se conservan aquí porque ediciones anteriores de este mapa las declaraban no decididas.

| Materia | Documento canónico | Sección |
| --- | --- | --- |
| **Motor de persistencia** | **ADS-02** — PostgreSQL, provisto por Supabase | §4 *(selección)* · §5 *(justificación)* · §6 *(alternativas)* |
| **Valores de las ponderaciones del Score** | **APS-08** — Perfil **WP-01 v1.0** | **§7.1** |
| Estrategia de escritura del repositorio | **ADR-13** *(semántica)* · **ADS-02** *(materialización)* | ADR-13 §10, §11 · ADS-02 §7 |
| **Persistencia del diagnóstico y de la secuencia comerciales** | **ADR-13 v1.2** — activos **A-11** y **A-12**, eventos **E-7**, **E-8** y **E-9** | ADR-13 §6.2, §13.1 |
| **Cuándo un Lead pasa a `Contacted`** | **PO-02** — *lo declara el usuario*. **Emitir una Propuesta no cambia el estadio** | §5 · §5.1 |
| **Los valores del estadio del Lead** | **PO-02 §5.1** — cuatro, lista cerrada. **A-01 `Closed`** | LS-1 a LS-5 |
| **Salida del agente comercial** *(doble: Secuencia y Propuesta)* | **PO-02 §8** · **APS-03 v3.1 §7.3** | **Q-5 `Closed`** |
| **Dependencia de `application/` hacia `infrastructure/`** | **ADR-17 §12** — *no la hay: se recibe un puerto* | AL-19 · AL-20 |
| **Contrato de resultado de la capa de aplicación** | **ADR-07 §8** *(fundamento)* · **ADR-17 §7** *(forma)* | **Sin `Result<T>` común** |

> **Corrección de la v1.4.** La nota anterior declaraba que **«ADS-02 y APS-17 están en estado `Draft`, pendientes de ratificación»**. **Ambos son `Approved` desde el sprint GOV-01** (2026-07-29); constancia en **AR-04**. Declarar pendiente una decisión ya tomada induce la improvisación que **AR-02, riesgo RA-1**, buscaba evitar — el defecto que la propia *Regla de uso* de este documento previene.
>
> **Recuérdese ADS-00 R-4:** un documento en `Draft` nunca prevalece sobre uno `Approved`. **Los once `Draft` vigentes están enumerados en el INDEX**, y ninguno decide arquitectura: son el nivel constitucional *(AF-01, AF-02)*, PLAN-01 y los siete registros de ejecución de la categoría DEV.

## 11.2 Parámetros operativos

**No son decisiones pendientes: son configuración publicada.** Antes de fijar cualquier límite, cupo, tanda, tiempo de espera o número de reintentos, consulta **APS-17**.

| Ámbito | Códigos | Referencia |
| --- | --- | --- |
| Workspace | WS-01 … WS-06 | APS-17 §4 |
| Biblioteca de Leads | BL-01 … BL-04 | APS-17 §5 |
| Pitch Generator | PG-01 … PG-04 | APS-17 §6 |
| Sistema, integraciones y reintentos | SY-01 … SY-07 | APS-17 §7 |

> **BL-01, BL-02 y PG-03 no son configurables.** Son consecuencias del dominio —conservación indefinida, sin límite de tamaño y versionado íntegro— y se enumeran para dejar constancia de que no existe valor que las altere. APS-17 §5 y §6.

## 11.3 Deudas conocidas de implementación

| Deuda | Descripción | Referencia |
| --- | --- | --- |
| **H-01** | La entidad del código se llama `Prospect`, no `Lead` | REV-03 §4 |
| **H-04** | Endpoints `/api/prospect/*`. Solo corregible con el versionado `/api/v1/` | REV-03 §4 · ADR-06 §207 |

---

# 12. Referencias

Este documento remite a la totalidad del Blueprint. El índice completo, con versión y estado de cada documento, está en **[INDEX.md](../INDEX.md)**.

Documentos citados con mayor frecuencia: **PO-01** · **APS-02** · **APS-03** · **APS-04** · **APS-07** · **APS-08** · **ADR-11** · **ADR-12** · **ADR-13** · **ADR-14** · **ADS-00**.
