# DEV-00 — Implementation Rules

| Campo | Valor |
| --- | --- |
| Código | DEV-00 |
| Clasificación | Contrato operativo de implementación |
| Versión | 1.4 |
| Estado | **Draft** |
| Fecha de creación | 2026-07-29 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Requiere aprobación de | AKVEZ Product Office |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | **ADS-00 v1.3** |
| Categoría | **DEV** — AKVEZ Development Standard *(orden 8, ADS-00 v1.3)* |
| Gobernado por | **Todos los ADR y APS aprobados.** Véase §10 |
| Certificación de referencia | **AR-03 v1.2** — Blueprint v3.0, *Implementation Ready* |

> ## Regla de precedencia
>
> **Si existe conflicto entre DEV-00 y cualquier ADR, prevalece el ADR.**
>
> Lo mismo frente a **AF**, **PO** y **APS**, conforme al orden de precedencia de ADS-00. DEV-00 se sitúa **por debajo de toda la cadena documental**: no decide nada, traduce.
>
> Una regla de este documento que contradiga a su fuente es **un defecto de este documento**, nunca una decisión. Debe corregirse aquí, jamás en el ADR.
>
> **Nunca cites DEV-00 como fundamento de una decisión.** Cita el documento al que remite.

> **Sobre el código `DEV`.** **DEV es una categoría oficial de la Clasificación de ADS-00 desde su v1.3** (sprint GOV-02), con el nombre **AKVEZ Development Standard**. Ocupa el **orden 8** de la Jerarquía Documental —el último— y está subordinada a todas las categorías anteriores y a ADS, conforme a la regla **R-7**.

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.4** | 2026-07-30 | AKVEZ Architecture Team | **Descenso normativo de ADR-17. Ninguna regla de autoría propia.** **§3.1 — R-05 se sincroniza**: se retira de la columna de imports permitidos `infrastructure/` del propio módulo y se añade el puerto recibido por inyección. **Alta de R-65 a R-69** en la nueva **§3.13**, que transcriben las reglas **AL-01 a AL-20** de ADR-17 en su forma comprobable sobre código. **§4.1** — la fila de `application/` refleja la nueva frontera. **§10.2** — alta de **ADR-15 v1.2, ADR-16 v1.1 y ADR-17 v1.1** y **corrección de versiones superadas** en §10.1 y §10.3. **§11** — alta de la nota sobre el frontend *(RA17-6)*. Se retira la nota de *sincronización pendiente* de §3.1, ya ejecutada. **No se modifica ninguna de las 80 reglas preexistentes** salvo R-05, cuya corrección es transcripción literal de su nueva fuente. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 9. **ADR-17 pasó a `Approved` en el paso 7**, y con ello la sincronización que la v1.3 declaró pendiente pasó a ser obligatoria. **Se ejecuta después de la ratificación y no antes**, conforme a R-7 de ADS-00: una regla DEV cuya fuente estuviese en `Draft` sería nula. |
| **1.3** | 2026-07-30 | AKVEZ Architecture Team | **Sincronización del flujo de dependencias. Ninguna regla nueva, ninguna regla modificada; las 80 de §3 permanecen intactas.** **§4.4** — se corrige el diagrama del flujo de una petición, que omitía la capa **`presentation/` (Agent API)** entre el Orchestrator y `application/`, contra las propias **R-07** y **R-11** de este documento y contra **ADR-04 §7.7-§7.8** y **ADR-09 §9**. **§3.1 y §4.1** — se incorpora la nota de **sincronización pendiente con ADR-17**, que declara qué regla gobierna hoy y qué la cambiará; **R-05 y la fila de `application/` no se tocan**. **§2.2** — el rango de ADR pasa de «ADR-01 a ADR-14» a «ADR-01 a ADR-17». **§10** — altas de referencias. **No se modifica §5, §6, §7, §8, §9 ni §11.** | Sprint *Cierre de Arquitectura Base*, punto 1. El flujo de §4.4 transcribía el diagrama de ADR-07 §7, que no representa la Agent API aunque **§8 del mismo ADR-07 sí la exige**: un desarrollador que siguiese §4.4 escribiría un Orchestrator invocando `application/` directamente, prohibido por R-07. **La nota de ADR-17 se limita a declarar el descenso pendiente:** retirar la facultad de R-05 antes de que ADR-17 sea `Approved` produciría una regla DEV sin fuente vigente, **nula por R-7 de ADS-00**. |
| **1.1** | 2026-07-29 | AKVEZ Architecture Team | **Actualización de clasificación documental.** Se cierra el vacío **V-7**: `DEV` es categoría oficial desde ADS-00 v1.3, en el orden 8 de la Jerarquía Documental. Se actualizan la portada, la nota de clasificación, §11 (V-7) y el punto 4 de §12. **No se modifica ninguna de las 70 reglas de §3, ni la estructura de §4, ni las convenciones de §5, ni la Definition of Done de §6, ni el checklist de §7, ni las verificaciones de §8.** | Sprint **GOV-02**. Actualización de referencias a la nueva clasificación, dentro del alcance autorizado. |
| **1.2** | 2026-07-29 | AKVEZ Architecture Team | **Sincronización con las decisiones ratificadas en GOV-03 y ejecutadas en DEV-02.2.** **§3** — se incorporan las seis reglas de observabilidad **O-1 a O-6**, aprobadas literalmente en DP-02 §4.3 y ratificadas en §8.1, en la nueva §3.11; y las cuatro reglas de propagación de errores **R-61 a R-64**, que traducen la tabla de DP-03 §3 (Alternativa C), en la nueva §3.12. **§4.2** — se añade `observability/` al árbol de `server/shared/`. **§6** — `DoD-2` pasa a significar verificación de tipos **con `strict`**, y `DoD-5` actualiza el rango de reglas. **§10** — altas de referencias. **§11** — se **elimina** el vacío **V-7** y se marca **V-3** como **cerrado**. **§12** — se retira el punto 4 y se actualiza el recuento. **Ninguna regla nueva de autoría propia**: las diez incorporadas transcriben decisiones ya ratificadas y citan su fuente vinculante. **No se modifica ninguna de las 70 reglas preexistentes**, ni §5, ni §7, ni §8, ni §9. | Sprint **GOV-04**, tarea 2. Ejecuta las acciones **2, 4 y 5** de AR-05 §5 y la condición **C-5** de DP-04 §4.2. Habilitado por **ADR-04 v1.3**, que aporta el fundamento vinculante de orden 4 que DP-02 §6 exigía |
| 1.0 | 2026-07-29 | AKVEZ Architecture Team | Creación inicial. Traduce las restricciones arquitectónicas aprobadas en **70 reglas** de implementación verificables —R-01 a R-60 y UI-1 a UI-10—, documenta la estructura oficial del repositorio, las convenciones, la Definition of Done de desarrollo, el checklist de Pull Request y las verificaciones heredadas de GOV-01. Registra siete vacíos detectados. | Sprint **DEV-00**. El Blueprint quedó certificado y congelado (AR-03 v1.2), pero ninguna de sus decisiones estaba expresada como regla comprobable sobre código. Sin esa traducción, cada desarrollador reinterpreta el Blueprint por su cuenta — el mecanismo que originó toda la consolidación documental. |

---

# Tabla de Contenido

1. Propósito
2. Alcance
3. Reglas Obligatorias
4. Organización del Repositorio
5. Convenciones
6. Definition of Done de Desarrollo
7. Checklist de Pull Request
8. Verificaciones Heredadas
9. Riesgos de Implementación
10. Referencias
11. Vacíos Detectados

---

# 1. Propósito

**DEV-00 gobierna exclusivamente la implementación.**

El Blueprint decide *qué* debe construirse y *por qué*. DEV-00 traduce esas decisiones en reglas que pueden **comprobarse sobre el código**, para que la distancia entre lo decidido y lo implementado sea verificable y no una cuestión de criterio individual.

## 1.1 Lo que este documento hace

- Convierte restricciones arquitectónicas aprobadas en reglas de implementación con identificador propio.
- Documenta la estructura oficial del repositorio, tal como la definen ADR-01 y ADR-04.
- Fija la Definition of Done de una tarea de desarrollo y el checklist de revisión.
- Registra las verificaciones heredadas de GOV-01 y su destinatario.

## 1.2 Lo que este documento no hace

**No decide nada.** Toda regla de §3 cita el documento que la origina. Una regla sin cita es un defecto.

**No reinterpreta.** Cuando una fuente admite lectura ambigua, DEV-00 **no la resuelve**: registra el vacío en §11 y se detiene.

**No es autoridad.** Es un mapa operativo, como ADS-01 lo es de localización.

---

# 2. Alcance

## 2.1 Qué regula

| Materia | Sección |
| --- | --- |
| Reglas de implementación derivadas de la arquitectura | §3 |
| Estructura y organización del repositorio | §4 |
| Convenciones de nombres, imports y tipos | §5 |
| Definition of Done de desarrollo | §6 |
| Revisión y validación de cambios | §7 |
| Verificaciones trasladadas a sprints de desarrollo | §8 |

## 2.2 Qué no regula

| Materia | Dónde se decide |
| --- | --- |
| **Negocio y dominio** | PO-01 · **PO-02** · APS-07 |
| **Arquitectura** | **ADR-01 a ADR-17** · ADS-02 |
| **Producto y alcance** | APS-01 · APS-02 · APS-03 |
| **Experiencia de usuario y diseño visual** | APS-04, Partes A y B |
| **Valores operativos** *(cupos, tandas, tiempos)* | **APS-17** |
| **Gobernanza documental** | ADS-00 · APS-13 |

> **Si una duda de implementación exige decidir algo de la columna derecha, no es una duda de implementación.** Detente y elévala conforme a §3.7, R-46.

---

# 3. Reglas Obligatorias

**Toda regla cita su fuente.** El incumplimiento de cualquiera de ellas es motivo suficiente para rechazar un Pull Request.

## 3.1 Fronteras entre capas

| # | Regla | Fuente |
| --- | --- | --- |
| **R-01** | Toda funcionalidad pertenece a un módulo. No existe código de negocio fuera de `modules/` | ADR-01 §10.1 |
| **R-02** | Ningún módulo accede a detalles internos de otro módulo | ADR-01 §10.2 |
| **R-03** | Los módulos se comunican **solo** mediante interfaces públicas | ADR-01 §10.3 |
| **R-04** | `domain/` no importa nada externo a su propio módulo. Sin frameworks, sin HTTP, sin persistencia, sin SDKs | ADR-07 §8 · ADR-01 §8 |
| **R-05** | `application/` importa `domain/` del **propio** módulo y **recibe por inyección los puertos que necesita**. **No importa `infrastructure/`**, ni `shared/contracts/`, ni `shared/mappers/`, ni HTTP | **ADR-17 §12 (AL-19)** · ADR-07 §8 *(resto de la fila)* |
| **R-06** | `infrastructure/` es el único lugar donde vive un SDK externo | ADR-07 §8 · ADR-03 §6 |
| **R-07** | `presentation/` (Agent API) es la única superficie del módulo que el Orchestrator conoce | ADR-04 §7.7 · §10 |
| **R-08** | Los `orchestrators/` no conocen HTTP: no reciben `Request`/`Response`, no importan `express` | ADR-07 §7 |
| **R-09** | Los `orchestrators/` no conocen DTO públicos: no importan `shared/contracts/` ni `shared/mappers/` | ADR-07 §7 |
| **R-10** | Los `orchestrators/` no contienen lógica de negocio | ADR-07 §8 |
| **R-11** | Todo workflow pasa por un Orchestrator. `routes/` **nunca** invoca un agente directamente, ni siquiera de un solo módulo | ADR-04 §7.8 · §8 |
| **R-12** | `routes/` son adaptadores HTTP delgados: reciben la petición, invocan al Orchestrator y responden mediante `shared/mappers/` y `shared/contracts/` | ADR-07 §8 |
| **R-13** | `routes/` no importa `domain/`, `application/`, `infrastructure/` ni SDKs externos | ADR-07 §8 |

> ## ✅ R-05 sincronizada con ADR-17 — v1.4
>
> **`application/` ya no importa `infrastructure/`.** La facultad que ADR-07 §8 concedía fue **retirada por ADR-17 §12**, una decisión posterior de su mismo rango. **ADR-07 §8 conserva su texto íntegro**; lo que cambió es la frontera *(ADR-17 §12.2)*.
>
> **Deuda conocida AL-19 / H-2.** El código existente **ejerce el import retirado en tres puntos**: `discoverProspects.ts`, `analyzeProspects.ts` y `generateOutreachPitch.ts`. **R-05 rige para todo código nuevo**; la corrección de los tres es trabajo del primer sprint de implementación, junto con la normalización del módulo comercial que **ADR-15 §9.5** exige. *(ADR-17 §15 · DEV-05)*
>
> **La anatomía completa de un caso de uso está en ADR-17 §5 a §9.** Las reglas comprobables sobre código se transcriben en **§3.13**.

## 3.2 Contratos públicos

| # | Regla | Fuente |
| --- | --- | --- |
| **R-14** | Un DTO público **no es** una entidad de dominio. `LeadResponseDTO` no es `Lead` | ADR-07 §7 |
| **R-15** | `shared/contracts/` importa solo tipos primitivos y otros archivos de `shared/contracts/` | ADR-07 §8 · ADR-06 §11 |
| **R-16** | Cada mapper **declara su propio tipo de entrada**. No lo importa del módulo dueño | ADR-07 §7, §8 |
| **R-17** | `shared/mappers/` no importa `domain/`, `application/` ni `infrastructure/` de ningún módulo | ADR-07 §8 |
| **R-18** | `shared/contracts/` y `shared/persistence/contracts/` **no se importan entre sí**. Resuelven fronteras distintas | ADR-08 §6, §10 |

## 3.3 Persistencia

| # | Regla | Fuente |
| --- | --- | --- |
| **R-19** | **Ningún agente accede a datos persistidos.** La cadena obligatoria es `Agent → Application → Repository → Persistence → Database` | ADR-05 §6, Principio 1 |
| **R-20** | **Repository Pattern obligatorio.** `application/` trabaja contra la Repository Interface, nunca contra una implementación | ADR-05 §7, Decisión 2 |
| **R-21** | `modules/*/domain/` no importa **nada** de `shared/persistence/` | ADR-05 §6 P2 · ADR-08 §10 |
| **R-22** | `modules/*/application/` recibe la Repository Interface **como dependencia**. No importa `adapters/`, `models/` ni `contracts/` | ADR-08 §10 |
| **R-23** | `modules/*/presentation/` no importa `shared/persistence/` en **ninguna** de sus cuatro subcarpetas — **sin excepción** | ADR-08 §10 *(corrección v1.1)* |
| **R-24** | `routes/` y `orchestrators/` no conocen persistencia en ninguna forma | ADR-05 §6 P1 · ADR-08 §10 |
| **R-25** | **El SDK o driver de base de datos solo puede importarse desde `shared/persistence/adapters/`** | ADR-08 §10 · ADS-02 §5.3 |
| **R-26** | La conversión Persistence Contract ↔ Persistence Model es responsabilidad **exclusiva** del Database Adapter | ADR-08 §7 |
| **R-27** | Entidad de dominio y modelo persistente son tipos **separados**. La correspondencia estructural no se expresa con imports | ADR-05 §7 D3 · ADR-08 §5 |
| **R-28** | **Ninguna capacidad propietaria de Supabase se usa fuera de `shared/persistence/adapters/`.** Compromiso de portabilidad vinculante | **ADS-02 §5.3** *(ratificado en GOV-01)* |
| **R-29** | **Prohibido acceder a Supabase, o a cualquier base de datos, desde la UI.** El frontend consume la API pública, nunca el motor | ADR-05 §6 P1 · ADR-07 §7 · ADS-02 §5.3 |

## 3.4 Semántica de escritura

| # | Regla | Fuente |
| --- | --- | --- |
| **R-30** | **La Unidad de Registro es atómica**: determinar identidad, comprobar presencia y escribir forman una operación indivisible | ADR-13 §11.1 |
| **R-31** | La unicidad de `(Referencia de Origen, Usuario)` la garantiza **el motor**, no el código de aplicación | ADR-12 §12.2 · ADR-13 §12.3 G-6 · ADS-02 §7 |
| **R-32** | **Registrar, actualizar, versionar. Nunca reemplazar.** No se emite `DELETE` sobre Leads ni sobre versiones | ADR-13 §10.2 |
| **R-33** | Análisis, Opportunity Score y Propuesta son **activos versionados**: cada emisión añade una fila, ninguna sustituye a la anterior | ADR-13 §10.3 |
| **R-34** | Cada emisión de Score conserva el perfil de usuario y la versión de Perfil de Ponderación con que se calculó | ADR-13 §10.3 V-4 · ADR-14 R-VIN |
| **R-35** | El identificador interno no se reasigna, no se reutiliza y no se regenera | ADR-12 §12.1 E-3 · ADR-13 §12.3 G-3 |
| **R-36** | La fecha de descubrimiento **no se actualiza** en los redescubrimientos | ADR-12 E-4 · ADR-13 §12.3 G-4 |
| **R-37** | El historial **solo crece**. Ninguna entrada se elimina ni se modifica retroactivamente | ADR-12 E-5 · ADR-13 §12.3 G-5 |
| **R-38** | Un atributo ausente se representa como **ausente**, nunca con un valor por defecto ni con texto explicativo. La falta de sitio web es un hallazgo, no un hueco | APS-07 §8.4 · ADR-13 §7.1 X-3 |
| **R-39** | **Descubrir no escribe.** Una Empresa descubierta y no registrada no existe para el sistema | ADR-13 §13.3 |
| **R-40** | Toda escritura del dominio es **idempotente** respecto de la identidad del Lead | ADR-13 §11.3 |
| **R-41** | **Se admite la ejecución diferida** de Análisis, Evaluación y Propuesta. El **orden** canónico es invariante (A-1) y una etapa fallida **nunca retira el Lead** de la Biblioteca (A-2). El Registro no es diferible | **ADR-13 §11.2** *(ratificado en GOV-01; AR-04 §6.3)* |

## 3.5 Dominio — lo que el código nunca puede hacer

**Estas cinco reglas protegen el modelo que originó toda la consolidación del Blueprint.** Su incumplimiento no es un defecto: es una regresión de dominio.

| # | Regla | Fuente |
| --- | --- | --- |
| **R-42** | **No existe Top N.** Ninguna consulta, tanda, cupo ni límite puede determinar qué Leads existen | PO-01 §6 · ADR-11 §9 E-2 |
| **R-43** | **No existe umbral de exclusión.** Ninguna puntuación condiciona el registro, la conservación ni la presentación de un Lead | PO-01 §7 · APS-08 §8.6 |
| **R-44** | **Ninguna etapa expulsa a un Lead** de la Biblioteca. La Biblioteca solo crece | PO-01 §8 · APS-07 §7.2 |
| **R-45** | Un Lead **sin análisis y sin Score es un estado válido**, no un error ni un dato incompleto | PO-01 §5 · APS-07 §8.4 |
| **R-46** | **Ninguna limitación técnica reside en el dominio.** Antes de introducir cualquier límite, cupo, tanda o recorte, aplica el Criterio de Invariancia (§3.6) | **ADR-11 §7.1, §8.1** |

## 3.6 Criterio de Invariancia del Conjunto

**Consulta obligada antes de introducir cualquier límite en el código.**

> Si este límite se duplicase, se redujese a la mitad o desapareciese, **¿tendría el usuario un conjunto de Leads distinto en su Biblioteca?**
>
> - **Sí → inadmisible.** Es una regla de dominio disfrazada de configuración.
> - **No → admisible**, en la capa que le corresponda.

| Capa | Limitaciones admisibles | Fuente |
| --- | --- | --- |
| **Dominio** | **Ninguna** | ADR-11 §8.1 |
| **Aplicación** | Ninguna sobre el conjunto | ADR-11 §8.2 |
| **Infraestructura** | Tanda, concurrencia, reintentos, caché | ADR-11 §8.3 |
| **Integración** | Cupos de proveedor, **paginación que agota la fuente** | ADR-11 §8.4 |
| **Presentación** | Paginación de respuesta, *streaming* | ADR-11 §8.5 |
| **Experiencia de Usuario** | *Lazy loading*, filtros reversibles | ADR-11 §8.6 |

> **R-47. Un cupo de proveedor obliga a paginar hasta agotar la fuente, nunca a renunciar al resto.** Si la fuente devuelve resultados de veinte en veinte, la capa de Integración repite la llamada hasta agotarlos. *(ADR-11 §8.4 · APS-17 §7)*

## 3.7 Interfaz

Las diez reglas vinculantes de APS-04 §A.9 son de aplicación directa al código de interfaz y **no admiten excepción**.

| # | Regla | Fuente |
| --- | --- | --- |
| **UI-1** | Ninguna pantalla determina qué Leads existen, se registran o se conservan | APS-04 §A.9 |
| **UI-2** | Ningún Lead se oculta por su Opportunity Score. Todas las bandas son visibles | APS-04 §A.9 |
| **UI-3** | Ningún filtro se aplica por defecto. Todo filtro es reversible e indica cuánto oculta | APS-04 §A.9 |
| **UI-4** | Paginación y desplazamiento son vistas recorribles en su totalidad. Nunca truncan el conjunto | APS-04 §A.9 |
| **UI-5** | Ninguna pantalla permite eliminar un Lead de la Biblioteca | APS-04 §A.9 |
| **UI-6** | Descartar retira el Lead de la vista principal y lo conserva en la Biblioteca, recuperable | APS-04 §A.9 |
| **UI-7** | La ausencia de análisis o puntuación se representa como estado válido, **nunca como error** | APS-04 §A.9 |
| **UI-8** | El orden por defecto es Opportunity Score descendente, y el usuario puede cambiarlo | APS-04 §A.9 |
| **UI-9** | La interfaz no expone información interna, identificadores técnicos ni trazas | APS-04 §A.9 |
| **UI-10** | Ninguna pantalla ofrece configurar umbrales, cupos o límites sobre Leads: no existen | APS-04 §A.9 |

**Reglas adicionales de implementación de interfaz:**

| # | Regla | Fuente |
| --- | --- | --- |
| **R-48** | **Prohibida la lógica de negocio en componentes.** Un componente presenta y captura interacción; no decide reglas del dominio | ADR-01 §7.1, §8 · ADR-07 §8 |
| **R-49** | Todo valor visual procede de los Design Tokens. No se introducen colores, espaciados ni tipografías literales | APS-04 Parte B §11 |

## 3.8 Parámetros operativos

| # | Regla | Fuente |
| --- | --- | --- |
| **R-50** | **Todo límite, cupo, tanda, tiempo de espera o número de reintentos usa el valor publicado en APS-17.** No se inventan valores ni se codifican literales dispersos | **APS-17 §4-§7** |
| **R-51** | Un parámetro nuevo declara su capa y supera el Criterio de Invariancia **antes** de introducirse | APS-17 §9 G-4 |
| **R-52** | **Ningún parámetro se introduce en la capa de dominio**, sin excepción | APS-17 §9 G-3 · ADR-11 §8.1 |
| **R-53** | BL-01, BL-02 y PG-03 **no son configurables**: conservación indefinida, sin límite de tamaño y versionado íntegro son consecuencias del dominio | APS-17 §5, §6 |

## 3.9 Inyección de dependencias

| # | Regla | Fuente |
| --- | --- | --- |
| **R-54** | **`server/bootstrap/` es el único Composition Root.** Es el único lugar autorizado a importar `shared/persistence/adapters/` y a construir Database Adapters concretos | ADR-09 §5.1 |
| **R-55** | **Ninguna capa distinta del Composition Root construye sus propias dependencias.** Toda capa recibe lo que necesita ya construido, por parámetro | ADR-09 §5.3 |
| **R-56** | `application/` expone una **factory** que recibe dependencias y devuelve el caso de uso ya vinculado. Las capas superiores reciben la función construida, no las dependencias | ADR-09 §5.2 |
| **R-57** | **Prohibidos**: frameworks de DI, Service Locator, Singleton global y variables globales | ADR-09 §7 |
| **R-58** | Una instancia por Repository Interface, creada una vez durante el arranque, propiedad del Composition Root | ADR-09 §6 |

## 3.10 Terminología

| # | Regla | Fuente |
| --- | --- | --- |
| **R-59** | **El código usa `Lead`, no `Prospect`.** Todo código nuevo emplea la terminología canónica del dominio | ADS-00 *(Terminología)* · PO-01 §9.3 |
| **R-60** | Los nombres del código reflejan el lenguaje del Blueprint: `Empresa`/`Lead`, Registro, Biblioteca, Opportunity Score, Perfil de Ponderación | PO-01 §1-§5 · APS-07 §16 |

> **Deuda heredada H-01 / DI-5.** El código existente denomina `Prospect` a la entidad del dominio y expone endpoints `/api/prospect/*`. **R-59 rige para todo código nuevo**; la corrección del existente se planifica en DEV-01. *(AR-02 §4.2 · ADS-01 §11.3)*

## 3.11 Observabilidad

**`shared/observability` es el único servicio compartido de instrumentación.** No existe `shared/logging/`: el logging es una de las cinco salidas de la observabilidad, no un servicio hermano.

| # | Regla | Fuente |
| --- | --- | --- |
| **O-1** | La observabilidad **nunca altera el resultado** de la operación observada. Toda función de registro devuelve `void` | **ADR-04 §11** · APS-16 §14 |
| **O-2** | Un fallo del subsistema de observabilidad **nunca propaga** ni interrumpe la operación | **ADR-04 §11** · APS-16 §14 |
| **O-3** | **Nunca se registran credenciales, prompts ni datos personales** sin sanear. El saneamiento se aplica **en el punto de registro**, no en el llamador | **ADR-04 §11** · APS-10 |
| **O-4** | `domain/` **no importa observabilidad** | **ADR-04 §11** · ADR-05 §6 P3 · *refuerza R-04* |
| **O-5** | El proveedor concreto reside **solo** en el sink. **Ninguna capa observada lo nombra** | **ADR-04 §11** |
| **O-6** | Las trazas **no se exponen nunca al usuario** | APS-04 §A.9 UI-9 · *refuerza UI-9* |

> **Deuda conocida O-5 / H-1.** El código existente invoca `console.*` directamente en **23 puntos** de `application/`, `infrastructure/` y `routes/`, de modo que capas observadas nombran el proveedor. **O-5 rige para todo código nuevo**; la corrección del existente exige antes implementar el sink y **no está planificada**. *(DEV-02.2 §8.1 · AR-05 §5 acción 6)*

## 3.12 Propagación de errores

**El fallo no viaja de una sola forma: viaja según su naturaleza.** Estas cuatro reglas cierran la divergencia por la que un módulo devolvía el error como valor y otro lo lanzaba.

**No existe un `Result<T>` común**, y no debe introducirse: cada módulo conserva el contrato de resultado propio que le atribuye ADR-07 §8. La uniformidad se obtiene de la taxonomía de `shared/errors`, no de un sobre compartido.

| # | Regla | Fuente |
| --- | --- | --- |
| **R-61** | Un **fallo esperado y significativo para el caso de uso** —entrada inválida, respaldo agotado— viaja como **valor de retorno**, dentro del contrato propio del módulo | ADR-07 §8 · APS-03 §12 |
| **R-62** | Un **fallo inesperado** —invariante roto, error interno— viaja como **excepción** de la clase correspondiente de `shared/errors` | APS-03 §12 |
| **R-63** | Un **fallo de proveedor externo** se **envuelve** en `CommunicationError` o `ExternalDataError`, **conservando `cause`**. Perder `cause` degrada el diagnóstico y es motivo de rechazo | APS-03 §12 · APS-11 §4.5 |
| **R-64** | Un **fallo parcial sobre un conjunto de Empresas nunca aborta el conjunto.** El sistema continúa procesando el resto, y **un fallo posterior jamás retira un Lead ya registrado** | **APS-03 §12** · **PO-01 §8** · ADR-13 §11.2 A-2 · *refuerza R-41, R-44* |

> **R-64 es una regla de dominio, no de estilo.** Es la más grave de las cuatro: su incumplimiento hace desaparecer Leads que el usuario ya había adquirido, y contradice a la vez PO-01 §8 y APS-03 §12.

> **Nota de trazabilidad.** Las cuatro reglas transcriben la tabla de **DP-03 §3** (Alternativa C, ratificada en §7.1). DP-03 no les asignó identificador; los códigos `R-61` a `R-64` continúan la secuencia de este documento y son **editoriales, no decisiones**. La fuente que se cita es siempre el documento vinculante —APS-03 §12, PO-01 §8, ADR-07 §8—, nunca el DP.

## 3.13 Capa de aplicación

**La capa de aplicación tiene desde ADR-17 una anatomía definida.** Esta sección transcribe sus veinte reglas **AL-01 a AL-20** en las cinco que son comprobables sobre código y no están ya cubiertas por otra regla de §3.

**La fuente completa es ADR-17 §5 a §14, y debe consultarse antes de escribir el primer caso de uso.** Aquí solo consta lo verificable en revisión.

| # | Regla | Fuente |
| --- | --- | --- |
| **R-65** | **Un caso de uso es una función asíncrona construida por factory**, en un fichero propio, con nombre en infinitivo. **No es una clase, no es un servicio y no tiene estado propio** | **ADR-17 AL-01, AL-02, AL-03** · *refuerza R-56, R-57* |
| **R-66** | **Toda dependencia externa de un caso de uso es un puerto.** El **de persistencia** vive en `shared/persistence/repositories/`; el **de proveedor** lo declara el `domain/` del módulo consumidor y **no nombra proveedor, ni expone parámetros operativos, ni expone credenciales** | **ADR-17 AL-05, AL-06, AL-07** · ADR-08 §6 · *refuerza R-50, R-52* |
| **R-67** | **`Deps` contiene solo puertos y funciones de caso de uso del propio módulo**, en un objeto único, **sin dependencias opcionales ni valores por defecto** | **ADR-17 AL-08, AL-09, AL-10** · *refuerza R-55* |
| **R-68** | **El resultado es un tipo nombrado y propio del módulo.** Con varias ramas, **unión discriminada por literal**. **No existe `Result<T>` común y no debe introducirse** | **ADR-17 AL-11, AL-12, AL-13** · ADR-07 §8 · *véase §3.12* |
| **R-69** | **Un caso de uso corresponde a una operación completa y, cuando escribe, a un solo evento** del catálogo de ADR-13 §13.1 | **ADR-17 AL-04** · ADR-13 §13.4 · ADR-16 D-6, RC-15 |

> **`R-65` a `R-69` son editoriales, no decisiones.** Continúan la secuencia de este documento y **transcriben reglas ya decididas en ADR-17**, que es la fuente que debe citarse. Ninguna añade nada que ADR-17 no diga.

> **Lo que esta sección no cubre, y hay que leer en ADR-17.** **AL-14 a AL-18** —traducción del error en el adapter, fallo parcial, invariantes, dependencia hacia `domain/` y la prueba de §11.1— **ya están cubiertas** por R-61 a R-64, R-02, R-48 y ADR-15 RA-6. **AL-19 y AL-20** son la frontera de imports y constan en **R-05** y en §4.2.

> ⚠️ **Ninguna de estas cinco reglas la verifica el compilador.** Dependen de la revisión, igual que las ochenta anteriores. Es el vacío **V-4** y el riesgo **RI-1**.

---

# 4. Organización del Repositorio

> **No se crea ninguna carpeta que no esté declarada en un ADR.** Si una necesidad no encaja en la estructura siguiente, es un vacío (§11), no una licencia para inventar.

## 4.1 Estructura de un módulo

**Idéntica en frontend y backend.** ADR-04 §7.1 exige simetría exacta con ADR-01.

```text
module/
├── domain/           reglas de negocio puras
├── application/      casos de uso
├── infrastructure/   integraciones y servicios externos
└── presentation/     interfaz del módulo
```

*(ADR-01 §8)*

| Carpeta | Responsabilidad | Puede importar | No puede importar |
| --- | --- | --- | --- |
| **`domain/`** | Reglas del negocio. Independiente de frameworks y tecnologías | Nada externo al propio módulo | `shared/contracts/`, `shared/mappers/`, `shared/persistence/`, `infrastructure/`, HTTP, SDKs |
| **`application/`** | Coordina los casos de uso del módulo. Expone factories (R-56) | `domain/` del propio módulo; los **puertos** recibidos como dependencia — Repository **Interface** y puerto de proveedor | **`infrastructure/` de cualquier módulo, incluido el propio** *(R-05 · AL-19)*; `shared/contracts/`, `shared/mappers/`, `shared/persistence/adapters/`, `models/`, `contracts/`, `shared/ai`, HTTP |
| **`infrastructure/`** | Implementa integraciones y servicios externos. **Implementa el puerto de proveedor que declara `domain/`** *(AL-07)* | SDKs externos; `shared/ai`; `domain/` del propio módulo | `shared/contracts/`, `shared/mappers/`, el driver de base de datos |
| **`presentation/`** | En backend, la **Agent API** que expone el módulo y declara sus Tools. En frontend, la interfaz de usuario del módulo | El tipo del caso de uso que expone `application/` | `shared/persistence/` **en ninguna de sus cuatro subcarpetas, sin excepción** |

*(ADR-01 §8 · ADR-04 §8, §10, §11 · ADR-07 §8 · ADR-08 §8, §10 · ADR-09 §5.2 · **ADR-17 §6, §12**)*

> **La fila de `application/` está sincronizada con ADR-17 §12** desde la v1.4. **Un caso de uso recibe su proveedor como puerto, nunca como adapter.** Véase §3.1 (R-05) y §3.13.

> **Sobre `app/`.** El sprint que originó este documento pedía una sección para una carpeta `app/`. **`app/` no existe en el Blueprint**: ADR-01 §8 define exactamente cuatro carpetas por módulo —`domain/`, `application/`, `infrastructure/`, `presentation/`— y la interfaz de usuario corresponde a `presentation/`. **No se inventa.** Registrado como vacío **V-5** (§11).

## 4.2 Backend — `server/`

```text
server/
├── modules/
│   ├── lead-hunter/      domain · application · infrastructure · presentation
│   ├── lead-analyzer/    domain · application · infrastructure · presentation
│   └── pitch-generator/  domain · application · infrastructure · presentation
├── orchestrators/        único componente autorizado a coordinar agentes
├── routes/               adaptadores HTTP delgados
├── bootstrap/            arranque y Composition Root único; construye los adapters
│                         de persistencia y de proveedor y los vincula a su puerto
└── shared/
    ├── ai/               adapter genérico de Gemini y política de reintentos
    ├── config/           lectura y validación de variables de entorno
    ├── errors/           taxonomía común de errores
    ├── types/            contratos verdaderamente cruzados entre módulos
    ├── utils/            utilidades sin lógica de negocio
    ├── contracts/        DTO públicos que cruzan la frontera HTTP
    ├── mappers/          traducción resultado interno → DTO público
    ├── observability/    instrumentación transversal; el logging es una de sus salidas
    └── persistence/
        ├── contracts/    forma de la entidad, declarada de forma independiente
        ├── repositories/ Repository Interfaces
        ├── models/       forma efectivamente almacenada
        └── adapters/     implementación; único lugar con driver de BD
```

*(ADR-04 §8, **§11** · ADR-07 §7, §8 · ADR-08 §6 · ADR-09 §5.1, **§8.1** · **ADR-17 §9.1**)*

> **`bootstrap/` puede importar `modules/*/infrastructure/`, y solo para una cosa:** construir un adapter de proveedor y **vincularlo a su puerto** *(ADR-17 **AL-20**, que extiende la tabla de ADR-09 §8)*. **Invocarlo, leer de él o componer lógica con él sigue prohibido.** Es la contrapartida obligada de R-05: si `application/` deja de importar el adapter, alguien tiene que construirlo, y **el único autorizado a construir es el Composition Root** *(R-54, R-55)*.

> **`observability/` se declara en ADR-04 §11**, no en el árbol de ADR-04 §8, que no fue modificado en su v1.3. La carpeta está **plenamente autorizada**: su regla de acceso consta en §11 y su uso se rige por §3.11. Véase la observación de §11.3 sobre el alcance del árbol de ADR-04 §8.

## 4.3 Frontend — `src/`

Aplica la estructura de módulo de §4.1, conforme a ADR-01. `src/shared/` agrupa lo transversal al cliente.

> **La estructura interna de `src/shared/` no está enumerada en ningún ADR** con el detalle con que ADR-04 §8 enumera la del backend. Registrado como vacío **V-6** (§11). Hasta que se decida, **no se crean subcarpetas nuevas en `src/shared/`**.

## 4.4 Flujo de una petición

```text
Frontend
   → HTTP Route            adaptador delgado; no conoce módulos                  R-12 · R-13
   → Orchestrator          único componente que coordina agentes                 R-08 · R-10 · R-11
   → presentation/         Agent API — única superficie que el Orchestrator ve   R-07
   → application/          caso de uso; devuelve resultado interno del módulo    R-05
   → Mapper                traduce resultado interno → DTO público               R-16 · R-17
   → DTO público           shared/contracts/                                     R-14 · R-15
   → HTTP Response
```

*(ADR-04 §7.7, §7.8 · ADR-07 §7, §8 · ADR-09 §9)*

> **Corrección de la v1.3 — el diagrama omitía una capa.** La v1.2 transcribía literalmente el diagrama de **ADR-07 §7**, que va del Orchestrator a `application/` sin representar la Agent API. **§8 del mismo ADR-07 sí la exige** —los orchestrators importan «Agent APIs (`presentation/`) de los módulos del workflow»—, y **ADR-04 §7.7, R-07 y el flujo de wiring de ADR-09 §9** coinciden.
>
> **Seguir el diagrama antiguo producía una violación de R-07 y R-11**: un Orchestrator invocando `application/` directamente. Es un defecto de este documento, corregido aquí conforme a su propia Regla de precedencia, **sin modificar ADR-07**.

## 4.5 Flujo de persistencia

```text
Domain Entity (modules/*/domain/)
   ‖  correspondencia estructural, sin import
Persistence Contract (shared/persistence/contracts/)
   ↓  usado como tipo por
Repository Interface (shared/persistence/repositories/)
   ↑  llamada por Application, que pasa su Domain Entity real
   ↓  implementada por
Database Adapter (shared/persistence/adapters/)
   ↓  mapea Contract ↔ Model
Persistence Model (shared/persistence/models/)
   ↓
PostgreSQL
```

*(ADR-08 §9 · ADS-02 §4)*

---

# 5. Convenciones

## 5.1 Nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| **Entidad de dominio** | Sustantivo del Blueprint, singular | `Lead`, `Empresa` |
| **Persistence Contract** | Nombre de la entidad, sin sufijo | `Lead` en `shared/persistence/contracts/` |
| **Persistence Model** | Sufijo `Entity` | `LeadEntity` |
| **Repository Interface** | Sufijo `Repository` | `LeadRepository` |
| **Database Adapter** | Motor + entidad + `Adapter` | `PostgresLeadAdapter` |
| **DTO público** | Sufijo `DTO` | `LeadResponseDTO` |
| **Mapper público** | Entidad + `ResponseMapper` | `leadResponseMapper` |
| **Caso de uso** | Verbo en infinitivo | `discoverProspects`, `analyzeProspects` |
| **Factory de caso de uso** | `create` + caso de uso | `createDiscoverProspects` |
| **Tipo de la función de caso de uso** | Caso de uso + `Fn` | `DiscoverProspectsFn` |
| **Agent API** | `create` + agente + `Agent` | `createLeadHunterAgent` |

*(ADR-05 §7 D3 · ADR-08 §6 · ADR-07 §8 · ADR-09 §5.2)*

> **La tabla recoge las convenciones observables en las decisiones ya aprobadas.** `Prospect` aparece en los ejemplos de ADR-09 §5.2 por ser el nombre del código existente; **el nombre canónico es `Lead`** (R-59).

## 5.2 Imports

1. **La regla de imports es la tabla de §4.1**, más ADR-08 §10 y ADR-09 §8. Ante la duda, consúltalas: son exhaustivas.
2. **Un import prohibido no se resuelve con una excepción local.** Si parece necesario, la frontera está mal situada: detente y eleva (R-46).
3. **La correspondencia estructural no se expresa con un import.** Un Persistence Contract replica la forma de la entidad sin importarla *(ADR-08 §5)*.
4. **Ningún archivo importa un SDK de base de datos fuera de `shared/persistence/adapters/`** *(R-25)*.

## 5.3 Interfaces y tipos

- **Una Repository Interface se expresa en términos de un Persistence Contract**, nunca de la entidad de dominio ni del Persistence Model *(ADR-08 §6)*.
- **Cada mapper declara su propio tipo de entrada** *(R-16)*.
- **Un DTO declara su forma pública** y no deriva de ninguna entidad interna *(R-14)*.
- **Un atributo opcional del dominio se modela como opcional**, nunca con un valor por defecto que borre la distinción entre «no hay dato» y «el dato es cero» *(R-38)*.

## 5.4 Casos de uso, servicios y repositorios

- Un **caso de uso** vive en `application/`, se construye mediante factory y devuelve un resultado interno propio del módulo *(ADR-07 §8 · ADR-09 §5.2)*.
- Un **adapter de proveedor** vive en `infrastructure/` y es la única frontera con un SDK externo *(R-06)*.
- Una **Tool de cálculo puro**, sin I/O, vive en `domain/`. Una **Tool respaldada por proveedor externo** se implementa como adapter en `infrastructure/`. En ambos casos, quien la **declara y expone** es `presentation/` *(ADR-04 §10)*.
- Un **repositorio** es una interfaz en `shared/persistence/repositories/`; su implementación es un adapter *(R-20)*.

---

# 6. Definition of Done de Desarrollo

**Una tarea no está terminada hasta que las siete condiciones se cumplen.**

| # | Condición | Cómo se comprueba |
| --- | --- | --- |
| **DoD-1** | **Compila** | `npm run build` sin errores |
| **DoD-2** | **Verificación de tipos, con `strict`** | `npm run lint` — hoy `tsc --noEmit` sobre un `tsconfig.json` con **`"strict": true`**. **Cero errores.** Véase §6.1 |
| **DoD-3** | **Tests** | Conforme a la estrategia de APS-12 §7. ⚠️ **Herramienta no decidida — vacío V-1** |
| **DoD-4** | **Lint** | ⚠️ **No existe linter en el proyecto — vacío V-2** |
| **DoD-5** | **Respeta los ADR** | Reglas **R-01 a R-69** y **O-1 a O-6** de §3, verificadas en revisión (§7) |
| **DoD-6** | **Respeta los APS** | UI-1 a UI-10, parámetros de APS-17 y criterios de APS-12 §8 |
| **DoD-7** | **Documentación actualizada** | APS-12 §8. Si el cambio afecta a una decisión, se sigue el procedimiento de AR-03 §7.2 |
| **DoD-8** | **Sin deuda técnica introducida** | Ninguna excepción local a una regla de §3; ningún `TODO` que difiera una restricción arquitectónica |

> **DoD-3 y DoD-4 no pueden exigirse hoy con una comprobación concreta**, porque el proyecto carece de test runner y de linter y ningún documento aprobado los decide. **No se inventan aquí** (§11, V-1 y V-2). Hasta que se decidan, DoD-1, DoD-2 y DoD-5 a DoD-8 son exigibles en su integridad.

## 6.1 Qué significa «con `strict`» en DoD-2

**`"strict": true` es la configuración oficial de TypeScript de AKVEZ**, activa en `tsconfig.json` desde el sprint DEV-02.2. Activa las ocho comprobaciones del conjunto, entre ellas **`strictNullChecks`** y **`noImplicitAny`**.

| Consecuencia | Detalle |
| --- | --- |
| **DoD-2 no se cumple sin `strict`** | Una verificación de tipos con `strict` desactivado **no satisface DoD-2**, aunque devuelva cero errores |
| **Protege R-38** | `strictNullChecks` es la comprobación que impide que `null` y `undefined` sean asignables a cualquier tipo, y por tanto la que sostiene la distinción entre «no hay dato» y «el dato es cero o vacío» |
| **No se activan comprobaciones adicionales** | `noUnusedLocals`, `noImplicitReturns` y `exactOptionalPropertyTypes` **quedan fuera**: son decisión separada y sí tienen coste |
| **Todo error nuevo señala código nuevo** | El punto de partida es de **cero errores**, verificado en DEV-02.2 |

> **`strict` no corrige el modelado, lo protege.** `shared/persistence/contracts/Lead.ts` sigue declarando `website: string` como obligatorio y no anulable, de modo que una Empresa sin sitio web solo puede representarse como `""` — precisamente la confusión que **R-38** prohíbe. Corregirlo depende de las desviaciones **A-01** y **A-03**, ambas abiertas. `strict` garantiza que, una vez corregido, no haya regresión.

*(DP-04 §7, condiciones C-2 a C-5 · DEV-02.2 §2, §5.2)*

## 6.2 Criterios de aceptación heredados de APS-12 §8

Toda funcionalidad cumple además: comportamiento esperado, ausencia de errores críticos, documentación actualizada, integración correcta con el resto del sistema, cumplimiento de estándares visuales, cumplimiento de principios de seguridad y aprobación en Founder Validation cuando corresponda.

---

# 7. Checklist de Pull Request

**Reutilizable. Se copia íntegro en la descripción de cada PR.**

```markdown
## Definition of Done
- [ ] Compila — `npm run build`
- [ ] Verificación de tipos — `npm run lint`
- [ ] Tests conforme a APS-12 §7            (ver DEV-00 V-1)
- [ ] Lint                                   (ver DEV-00 V-2)
- [ ] Documentación actualizada
- [ ] Sin deuda técnica introducida

## Fronteras de capa  (DEV-00 §3.1, §3.2)
- [ ] `domain/` no importa nada externo a su módulo
- [ ] `application/` no importa `infrastructure/`, contracts, mappers ni HTTP
- [ ] `presentation/` no importa `shared/persistence/` — sin excepción
- [ ] `orchestrators/` no conoce HTTP ni DTO públicos
- [ ] `routes/` solo invoca Orchestrators
- [ ] Cada mapper declara su propio tipo de entrada

## Capa de aplicación  (DEV-00 §3.13)   — solo si el PR toca `application/`
- [ ] Un fichero, un caso de uso; función por factory, sin estado
- [ ] Toda dependencia externa es un puerto, recibido en `Deps`
- [ ] El puerto de proveedor lo declara `domain/` y no nombra proveedor
- [ ] Ninguna dependencia opcional ni con valor por defecto
- [ ] Resultado nombrado, propio del módulo; unión discriminada por literal
- [ ] Una operación, un evento de ADR-13 §13.1

## Persistencia  (DEV-00 §3.3, §3.4)
- [ ] Ningún SDK de base de datos fuera de `shared/persistence/adapters/`
- [ ] Ninguna capacidad propietaria del proveedor fuera de esa carpeta
- [ ] `application/` recibe la Repository Interface por inyección
- [ ] La unicidad se garantiza en el motor, no en la aplicación
- [ ] No hay `DELETE` sobre Leads ni sobre versiones
- [ ] Versionar añade; nunca sobrescribe
- [ ] Los atributos ausentes se representan como ausentes

## Dominio  (DEV-00 §3.5, §3.6)
- [ ] No se introduce Top N, umbral ni truncamiento
- [ ] Ningún Lead puede desaparecer de la Biblioteca
- [ ] Todo límite nuevo superó el Criterio de Invariancia
- [ ] Todo límite reside fuera del dominio, en su capa
- [ ] Los cupos de proveedor paginan hasta agotar la fuente

## Interfaz  (DEV-00 §3.7)   — solo si el PR toca UI
- [ ] Ninguna pantalla oculta un Lead por su Score
- [ ] Ningún filtro por defecto; todos reversibles
- [ ] La ausencia de análisis se muestra como estado válido
- [ ] Sin lógica de negocio en componentes
- [ ] Sin valores visuales literales — solo Design Tokens

## Parámetros y DI  (DEV-00 §3.8, §3.9)
- [ ] Todo valor operativo procede de APS-17
- [ ] Ninguna capa construye sus propias dependencias
- [ ] Sin Service Locator, Singleton global ni variable global

## Terminología  (DEV-00 §3.10)
- [ ] El código nuevo usa `Lead`, no `Prospect`

## Conflictos
- [ ] Ninguna regla de DEV-00 §3 se incumple
- [ ] Si el PR exigió reinterpretar una decisión, se detuvo y se elevó
```

---

# 8. Verificaciones Heredadas

**Aprobadas por el Product Office en GOV-01 y asignadas a DEV-01 — Architecture Bootstrap.** Constancia en AR-04 §6.1 y §10.1.

| # | Verificación | Origen | Severidad |
| --- | --- | --- | --- |
| **VH-1** | **KPI de la frontera dominio/implementación**: incorporarlos a APS-06 y revisar APS-04 y APS-11 | ADR-11 §13, §14 · §19 p4 | Media |
| **VH-2** | **Riesgo R-4 de ADR-12**: medir qué proporción de descubrimientos carece de Referencia de Origen. Si resulta alta, la Huella de Identidad pasa a ser el caso normal y **requiere decisión propia** | ADR-12 §18 p5 | Media |
| **VH-3** | **Riesgo R-1 de ADS-02**: verificar que la unicidad compuesta se resuelve **en el motor**. Condición para dar por cumplido APS-02 §9 | ADS-02 §10, §11 p4 | **Alta** |
| **VH-4** | **Riesgo R-2 de ADS-02**: verificar por inspección de importaciones que ninguna capacidad propietaria del proveedor alcanza el dominio | ADS-02 §10, §11 p4 | **Alta** |
| **VH-5** | **Riesgo R-4 de ADS-02**: verificar que la Row-Level Security está completa y el aislamiento entre usuarios no depende solo de la aplicación | ADS-02 §10 · ADR-05 §14 | Media |
| **VH-6** | **Validación del código existente contra el Blueprint**, incluida la reverificación de los hallazgos de ATA-01, que está `Archived` y **no debe darse por vigente** | AR-02 §6.2 · AR-04 §10.1 | **Alta** |
| **VH-7** | **Riesgo R-3 de ADR-13**: verificar que el versionado **no** se implementó como sobrescritura | ADR-13 §10.2 · ADS-02 §10 | **Alta** |
| **VH-8** | **Reglas A-1 y A-2** de la ejecución diferida: verificar que el orden canónico se preserva y que una etapa fallida nunca retira un Lead | ADR-13 §11.2 · AR-04 §9.2 RG-4, RG-5 | **Alta** |

> **Ninguna de las ocho es verificable documentalmente.** Todas exigen comprobación sobre la implementación real. **VH-3, VH-4, VH-6, VH-7 y VH-8 son condición de cierre de DEV-01.**

---

# 9. Riesgos de Implementación

**Solo riesgos de implementación.** Los riesgos arquitectónicos están en AR-04 §9.2 y no se repiten.

| # | Riesgo | Severidad | Mitigación |
| --- | --- | --- | --- |
| **RI-1** | **Las reglas de §3 no se verifican automáticamente** y su cumplimiento depende de la disciplina del revisor. Es el modo de fallo más probable de este documento | **Alta** | §7 como checklist obligatorio. Verificación automática pendiente — vacío **V-4** |
| **RI-2** | **Se introduce una excepción local** a una regla de frontera para desbloquear una tarea, y se normaliza | **Alta** | R-46 · §5.2 punto 2 · DoD-8 |
| **RI-3** | **El código nuevo se escribe sobre la terminología `Prospect`** existente por coherencia con lo que ya hay, y la deuda H-01 se multiplica | **Alta** | R-59. Todo código nuevo usa `Lead` |
| **RI-4** | **Un valor operativo se codifica literalmente** en lugar de tomarse de APS-17, y queda disperso e invisible | Media | R-50 · checklist §7 |
| **RI-5** | **La ausencia de test runner difiere indefinidamente la escritura de pruebas**, y DoD-3 se convierte en una casilla que nadie marca | **Alta** | Vacío **V-1**. Debe decidirse antes de dar por cerrado DEV-01 |
| **RI-6** | **`tsc --noEmit` se confunde con lint** y se da por cubierta una verificación que no se está haciendo | Media | Vacío **V-2**. DoD-2 y DoD-4 están separados deliberadamente |
| **RI-7** | **Se crea una carpeta no declarada** en ningún ADR para acomodar una necesidad nueva | Media | §4 · V-5 · V-6. Una necesidad sin carpeta es un vacío, no una licencia |
| **RI-8** | **Un adapter se construye fuera del Composition Root** por comodidad, y la sustitución del motor deja de ser un cambio de una línea | Media | R-54 · R-55 · ADR-09 §6 |
| **RI-9** | **La configuración de entorno se lee directamente** desde una capa arbitraria en lugar de `shared/config/` | Media | ADR-04 §7.5, §8 |
| **RI-10** | **Un PR grande hace inviable la verificación del checklist**, y se aprueba por volumen | Media | Fraccionar. Un PR que no puede revisarse contra §7 es un PR demasiado grande |

---

# 10. Referencias

**Solo documentos vigentes.** Ningún documento `Archived` es fuente de ninguna regla de este documento.

## 10.1 Autoridad de dominio

- **PO-01 v1.2** `Approved` — §1-§8, §9.3.
- **PO-02 v1.3** `Approved` — §2, §5, §5.1 *(LS-1 a LS-5)*, §6, §7. Alcance y vocabulario del Sistema Comercial.
- **APS-07 v2.1** `Approved` — §7.2, §8, §8.4, §16.

## 10.2 Arquitectura

- **ADR-01 v1.0** — §7, §8, §10. Organización modular.
- **ADR-03 v1.0** — §6, §10. Integraciones externas.
- **ADR-04 v1.3** — §7, §8, §10, **§11**. Organización del backend, Tools y **servicios compartidos, incluida `shared/observability`** *(fuente de O-1 a O-5)*.
- **ADR-05 v1.4** — §6, §7, §8, §9, §11, §14. Persistencia y Repository Pattern.
- **ADR-06 v1.1** — §11. Aislamiento de contratos.
- **ADR-07 v1.1** — §7, §8. Frontera pública y responsabilidades por capa.
- **ADR-08 v1.2** — §5, §6, §7, §8, §9, §10. Frontera de persistencia y tabla de dependencias.
- **ADR-09 v1.3** — §5, §6, §7, §8, **§8.1**. Composition Root e inyección.
- **ADR-11 v2.1** — §7.1, §8, §9, §13. Criterio de Invariancia y reparto por capas.
- **ADR-12 v1.1** — §7, §11, §12. Identidad canónica.
- **ADR-13 v1.2** — §7, §10, §11, §12, §13. Semántica de escritura, ejecución diferida y **catálogo de nueve eventos**.
- **ADR-14 v1.2** — §7, §12. Gobernanza del Perfil de Ponderación.
- **ADR-15 v1.2** `Approved` — §8, §9, §10, §13. Línea de Decisión y reparto de las seis preocupaciones comerciales.
- **ADR-16 v1.1** `Approved` — §3, §4, §6, §7, §8. Entidades, eventos y casos de uso del dominio comercial.
- **ADR-17 v1.1** `Approved` — §5, §6, §7, §8, §9, §12, §14. **Fuente de R-05 (parcialmente), de §3.13 y de la fila de `application/` en §4.1.** Anatomía del caso de uso, puertos y dependencia hacia `infrastructure/`.

## 10.3 Producto

- **APS-02 v2.1** §9 · **APS-03 v3.1** §7, §8, **§12** *(fuente de R-61 a R-64)* · **APS-04 v4.0** §A.9 y Parte B §11 · **APS-08 v1.2** §7.1, §8.6 · **APS-10** *(fuente de O-3)* · **APS-11 v1.0** §4.5 · **APS-12 v1.0** §7, §8 · **APS-13 v1.0** §9 · **APS-16 v1.0** §14 *(fuente de O-1, O-2)* · **APS-17 v1.1** §3-§9 · **APS-18 v1.2** · **APS-19 v1.1** · **APS-20 v1.1** *(marco comercial)*.

## 10.4 Estándares y certificación

- **ADS-00 v1.3** — *Clasificación Oficial* (categoría **DEV**), *Terminología*, *Jerarquía Documental* (orden 8, regla R-7), *Estados del Documento*.
- **ADS-01 v1.4** — mapa tema → documento canónico.
- **ADS-02 v1.1** — §4, §5.3, §7, §10, §11. Motor de persistencia.
- **AR-03 v1.2** — §7, §7.2, §10. Certificación y procedimiento de excepción.
- **AR-04 v1.0** — §6.1, §6.3, §9.2, §10.1. Ratificación y verificaciones heredadas.
- **AR-05 v1.2** — §4, §5, §5.1, §8, §8.2. Registro vivo de desviaciones y riesgos abiertos.

## 10.5 Decisiones ratificadas de las que derivan §3.11, §3.12 y §6.1

> **Los DP tienen autoridad consultiva** (ADS-00, orden 5) y **no son fuente de ninguna regla**. Se citan como **trazabilidad de la deliberación**, no como fundamento. La fuente vinculante de cada regla consta en su propia fila.

- **DP-02 v1.1** — §4.1, §4.3, §6, §8.1. Observabilidad única; origen de la redacción de O-1 a O-6. **Fuerza normativa: ADR-04 §11.**
- **DP-03 v1.1** — §3, §7, §7.1. Regla de propagación de errores; sin `Result<T>` común. **Fuerza normativa: APS-03 §12 · PO-01 §8 · ADR-07 §8.**
- **DP-04 v1.1** — §2.3, §4.2 (C-1 a C-5), §7. Política de Strict Mode. **Fuerza normativa: `tsconfig.json` y §6.1 de este documento.**
- **DEV-02.2 v1.0** — §2, §5.2, §8.1. Registro de ejecución: activación de `strict` y deuda O-5.

---

# 11. Vacíos Detectados

> **Un vacío es una regla que este documento necesitaría y que ningún documento aprobado establece.** Conforme al principio del sprint, **se registra y se detiene; nunca se inventa**.

| # | Vacío | Impacto | Qué se necesita |
| --- | --- | --- | --- |
| **V-1** | **No existe test runner ni política de pruebas ejecutable.** APS-12 §7 define cuatro niveles de prueba, pero ningún documento decide herramienta, ubicación de los tests ni umbral de cobertura, y el proyecto no tiene ninguna instalada | **Alto.** DoD-3 no es exigible. Sin pruebas, VH-3 a VH-8 se verifican a mano | Decisión de producto o arquitectura que fije herramienta y criterio mínimo |
| **V-2** | **No existe linter.** El script `lint` de `package.json` ejecuta `tsc --noEmit`, que es verificación de tipos, no análisis estático. No hay ESLint, Biome ni equivalente | **Medio.** DoD-4 no es exigible, y las reglas de §3 pierden su vía natural de automatización | Decisión sobre linter y conjunto de reglas |
| **V-3** | ~~**`tsconfig.json` no activa `strict`.** Ningún documento aprobado lo exige~~ | ✅ **CERRADO — sprints GOV-03 y DEV-02.2** | **Resuelto.** **DP-04** decidió la política y la ratificó el Product Office; **DEV-02.2** activó `"strict": true` con **cero errores**. `DoD-2` significa desde entonces verificación **con `strict`** (§6.1) |
| **V-4** | **No está decidido el mecanismo de verificación de las reglas de dependencia.** ADR-08 §10 y ADR-09 §8 definen tablas exhaustivas de imports permitidos y prohibidos, pero nada comprueba su cumplimiento. ADR-11 §13 define KPI de frontera «definidos, sin implementar» | **Alto.** Es la causa directa de **RI-1**, el riesgo más probable de este documento | Decisión sobre verificación automática de fronteras. Relacionado con **VH-1** |
| **V-5** | **La carpeta `app/` no existe en el Blueprint.** ADR-01 §8 define exactamente cuatro carpetas por módulo y asigna la interfaz a `presentation/` | Bajo. Se documentó la estructura real; no se inventó `app/` | Aclaración de nomenclatura, o confirmación de que `presentation/` es la carpeta prevista |
| **V-6** | **La estructura interna de `src/shared/` no está enumerada en ningún ADR**, a diferencia de `server/shared/`, que ADR-04 §8 detalla | Bajo | Decisión equivalente a ADR-04 §8 para el cliente |
| **V-8** | **La capa `application/` del frontend no está gobernada.** **ADR-17 §3.2 excluye expresamente `src/`**: el cliente no tiene Composition Root ni puertos de persistencia, de modo que §3.13 y R-05 **no le son aplicables tal cual**. Registrado en ADR-17 como riesgo **RA17-6** | Bajo hoy, **creciente**. Afectará a la interfaz comercial, no al backend | Decisión equivalente a ADR-17 para `src/`. **Se cierra junto con V-6**, que es el mismo hueco visto desde otro ángulo |

> **V-7 fue eliminado en la v1.2 de este documento** (sprint GOV-04). Estaba cerrado desde GOV-02 y su permanencia como fila solo añadía ruido: `DEV` es categoría oficial de ADS-00 v1.3, orden 8, con la regla **R-7** de subordinación. Consta en la portada y en el Historial de Versiones. **No se renumeró ningún otro vacío**: V-7 era el último.

## 11.1 Ninguno de los seis vacíos es una contradicción

**No se detectó ninguna contradicción documental.** Las **85 reglas** de §3 —R-01 a R-69, O-1 a O-6 y UI-1 a UI-10— derivan de documentos `Approved` y son mutuamente consistentes.

Los seis vacíos son **ausencias**, no conflictos: nada de lo aprobado los contradice. Por eso este documento se emite en lugar de detenerse, conforme al criterio de aceptación del sprint.

**Dos de los siete vacíos originales están hoy cerrados:** **V-3** (`strict`, cerrado en GOV-03 y DEV-02.2) y **V-7** (clasificación de `DEV`, cerrado en GOV-02 y retirado de la tabla). **Quedan seis abiertos** —V-1, V-2, V-4, V-5, V-6 y **V-8**—, de los cuales **V-1, V-2 y V-4 son los que impiden verificar DoD-3, DoD-4 y las reglas de frontera** (§12). V-5, V-6 y V-8 son de impacto bajo hoy.

> **V-8 se da de alta en la v1.4 y no es una regresión.** No existía antes porque **ningún documento gobernaba la capa de aplicación en ninguno de los dos lados**. **ADR-17 la gobierna en el backend y declara expresamente que no gobierna el frontend** *(§3.2, RA17-6)*: el vacío no aparece, **se hace visible**. Es el mismo hueco que **V-6** y debe cerrarse con él.

## 11.2 Deuda conocida, no vacío

**H-01 / DI-5** —la entidad del código se llama `Prospect` y los endpoints siguen el patrón `/api/prospect/*`— **no es un vacío**: es una deuda ya identificada, documentada y planificada. La regla existe y es clara (R-59); lo que falta es ejecutarla sobre el código existente, trabajo asignado a DEV-01. *(AR-02 §4.2 · ADS-01 §11.3)*

**Deuda O-5** —23 invocaciones de `console.*` en capas observadas— tampoco es un vacío: la regla existe (§3.11, O-5) y su fuente es vinculante (ADR-04 §11). Falta ejecutarla, y depende del sink. *(DEV-02.2 §8.1)*

## 11.3 Observación sobre el árbol de ADR-04 §8

**No es un vacío, y no requiere decisión para que este documento sea aplicable.**

El árbol de `server/shared/` de **ADR-04 §8** enumera cinco carpetas —`ai`, `errors`, `types`, `utils`, `config`—. La estructura real, autorizada por ADR posteriores, contiene además cuatro: `contracts/` y `mappers/` (ADR-07 §7), `persistence/` (ADR-08 §6) y `observability/` (**ADR-04 §11**, desde su v1.3).

> **El árbol de ADR-04 §8 refleja el alcance de aquella decisión, no el estado actual de la arquitectura.** Cada una de las cuatro carpetas está declarada en un documento vinculante, de modo que ninguna infringe el principio de §4. La autoridad sobre los servicios compartidos es **ADR-04 §11**, no el árbol de §8.

**Se registra por transparencia**, para que nadie lea el árbol de §8 como una enumeración cerrada y concluya que `observability/`, `persistence/`, `contracts/` o `mappers/` no están autorizadas. **Actualizar ese árbol excedía el alcance de GOV-04**, cuya tarea 1 prohibía modificar cualquier sección de ADR-04 distinta de §11, y DP-02 §6 excluía expresamente §8 del cambio aprobado.

---

# 12. Definition of Done de este documento

Este documento podrá pasar a `Approved` cuando el Product Office:

1. **Ratifique las 85 reglas de §3** —R-01 a R-69, O-1 a O-6 y UI-1 a UI-10— como contrato operativo obligatorio del desarrollo.
2. **Confirme la Definition of Done de §6** —incluida la exigencia de `strict` en `DoD-2` (§6.1)— y el checklist de §7 como exigibles en toda revisión.
3. **Se pronuncie sobre los vacíos V-1, V-2 y V-4**, que son los que impiden verificar DoD-3, DoD-4 y las reglas de frontera.

Hasta entonces permanece en **`Draft`**.

> **DEV-00 no bloquea el inicio del desarrollo.** Las reglas de §3 son transcripción de decisiones ya aprobadas y vinculantes por sí mismas: su fuerza procede de los ADR y APS que citan, no de este documento.
