# ADR-17 — Application Layer Architecture

| Campo | Valor |
| --- | --- |
| Código | ADR-17 |
| Clasificación | Architecture Decision Record — Arquitectura de capa |
| Versión | 1.1 |
| Estado | ✅ **Approved** |
| Fecha de creación | 2026-07-30 |
| Última actualización | 2026-07-30 |
| Responsable | AKVEZ Architecture Team |
| Aprobado por | **AKVEZ Product Office** y **Architecture Team** — Sprint *Gobernanza Final (Architecture Freeze)*, 2026-07-30 |
| Nivel de confidencialidad | Interno |
| Estándar aplicado | **ADS-00 v1.3** |
| Categoría | **ADR** — Architecture Decision Record *(orden 4, ADS-00)* |
| Resuelve | Cómo se implementa un caso de uso en AKVEZ: estructura, puertos, contratos, factories, composición, errores y dependencias |

> **Naturaleza del documento.** ADR-01 definió **qué capas existen**. ADR-07 definió **qué puede importar cada una**. ADR-09 definió **cómo se inyecta una dependencia**. Ninguno definió **cómo se escribe un caso de uso**, y esa ausencia es la última pieza estructural que falta antes de escribir código de dominio comercial.
>
> **Este ADR no modifica ningún ADR anterior.** Donde necesita apoyarse en uno, lo hace por referencia. Donde necesita ir más allá, **extiende** su tabla añadiendo filas —el mismo mecanismo que ADR-09 §8 aplicó sobre ADR-08 §10—, nunca reescribiendo las existentes.
>
> **Una única decisión de este ADR restringe una permisión anterior:** §12 retira a `application/` la facultad de importar `modules/*/infrastructure/` que ADR-07 §8 le concedía. **No reinterpreta ADR-07: decide después que él, con su mismo rango.** Era el punto que exigía pronunciamiento expreso del Product Office, **y quedó ratificado el 2026-07-30** (§21, §22).
>
> ✅ **Desde su ratificación, la Opción B —dependencia hexagonal estricta— es la arquitectura oficial de AKVEZ.**

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
| --- | --- | --- | --- | --- |
| **1.1** | 2026-07-30 | AKVEZ Product Office · Architecture Team | **Ratificación formal.** Estado `Draft` → **`Approved`**. Se incorpora **§22** con la constancia de la ratificación y el pronunciamiento expreso sobre **AL-19 y AL-20**, que era el punto 3 de §21. **Se cierran los cinco puntos de §21.** **La Opción B pasa a ser arquitectura oficial** y **la sincronización de DEV-00 §3.1 (R-05) y §4.1 queda habilitada y ejecutada** en el paso 9 del mismo sprint. Se retira la marca *(pendiente de ratificación)* de la prohibición 7 de §13 y de las reglas **AL-19 y AL-20** de §14. Se actualizan las versiones citadas en §18 y §20. **No se modifica ninguna decisión:** ni §5, ni §6, ni §7, ni §8, ni §9, ni §10, ni §11, ni §12, ni ninguna de las veinte reglas. | Sprint **Gobernanza Final (Architecture Freeze)**, paso 7. **Último bloqueo arquitectónico del proyecto.** ADR-15 v1.2 y ADR-16 v1.1 quedaron `Approved` en los pasos 5 y 6, y ambos presuponían el puerto que este ADR hace exigible. |
| 1.0 | 2026-07-30 | AKVEZ Architecture Team | Creación inicial. Define la anatomía de un caso de uso (§5), la tipología y ubicación de los puertos (§6), el contrato de resultado (§7), la forma de las factories (§8), la composición y su extensión de la tabla de ADR-09 §8 (§9), el manejo de errores dentro de la capa (§10) y las dos direcciones de dependencia —hacia `domain/` (§11) y hacia `infrastructure/` (§12)—, con **veinte reglas vinculantes AL-01 a AL-20** (§14). | Sprint **Cierre de Arquitectura Base**, punto 2. **ARCH-01 §10 lo declara condicionante** de la implementación del Commercial Diagnosis Engine, y **ADR-15 §20 y ADR-16 §2** dependen de que la dependencia de `application/` sobre la redacción generativa sea un puerto y no un adapter. Sin este documento, el primer caso de uso comercial que se escriba fija el patrón por omisión — que es exactamente el mecanismo que originó la consolidación documental de AKVEZ. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto — la pieza que falta
5. Decisión — anatomía de un caso de uso
6. Puertos
7. Contratos de resultado
8. Factories
9. Composición
10. Manejo de errores
11. Dependencia hacia Domain
12. Dependencia hacia Infrastructure
13. Lo que un caso de uso nunca hace
14. Reglas Vinculantes
15. Impacto en el código existente
16. Riesgos
17. KPIs
18. Dependencias
19. Glosario
20. Referencias
21. Definition of Done
22. Ratificación

> **Secciones omitidas.** Se omiten «Anexos» y «Diagramas» extensos: el único diagrama necesario —el grafo de composición— está en §9.2 con su identificador, conforme a ADS-00 (*Estructura Obligatoria*: «La omisión de alguna sección deberá estar justificada por la naturaleza del documento»).

---

# 1. Resumen Ejecutivo

**AKVEZ sabe dónde vive un caso de uso y no sabe cómo se escribe.**

`application/` aparece en nueve documentos aprobados y en ninguno queda definida su forma. ADR-07 §8 dice que «devuelve un resultado interno propio del módulo»; ADR-09 §5.2 muestra una factory como ejemplo ilustrativo, declarando expresamente que **no es implementación**; DEV-00 §5.4 recoge una frase por elemento. De ahí no se deduce cómo se escribe el siguiente caso de uso, y **los tres módulos existentes lo resolvieron de tres maneras distintas** — inventario en DP-03 §1.1.

Este ADR cierra esa ausencia con cinco decisiones:

| # | Decisión | Sección |
| :-: | --- | --- |
| **1** | Un caso de uso es **una función construida por factory**, con un fichero, un nombre en infinitivo y una sola responsabilidad | §5 |
| **2** | Toda dependencia externa de un caso de uso es **un puerto**. Existen exactamente **dos tipos**, con ubicación distinta y ya decidida | §6 |
| **3** | El resultado es **propio del módulo**, con forma reglada. **No se crea `Result<T>` común** | §7 |
| **4** | El **Composition Root** construye el adapter y lo vincula al puerto. `application/` recibe la abstracción | §9 |
| **5** | **`application/` deja de importar `modules/*/infrastructure/`** | §12 |

**La quinta es la única que cambia algo.** Las cuatro primeras transcriben o desarrollan decisiones ya aprobadas. La quinta ejerce la Opción B que **ARCH-01 §6.0** adoptó sin autoridad para hacerla exigible, y es **la razón de ser normativa de este documento**: sin un ADR que la decida, esa opción no obliga a nadie y `application/` seguiría pudiendo importar un adapter concreto.

**Coste medido, no estimado:** hoy se ejerce esa permisión en **tres puntos** —`discoverProspects.ts`, `analyzeProspects.ts`, `generateOutreachPitch.ts`—, cada uno con un único import. La sustitución es un puerto por módulo y su vinculación en el Composition Root.

---

# 2. Objetivo

- **Definir la estructura física y la firma de un caso de uso**, de modo que dos desarrolladores escriban el mismo código ante el mismo requisito.
- **Definir qué es un puerto en AKVEZ, cuántos tipos hay y dónde se declara cada uno**, cerrando la ambigüedad que ARCH-01 §6.1 DR-6 introdujo al atribuir a `domain/` la declaración de **todo** puerto.
- **Definir la forma del contrato de resultado**, sin introducir el `Result<T>` común que DP-03 desestimó.
- **Definir cómo se construye y se compone** un caso de uso, extendiendo la tabla de ADR-09 §8 con la única fila que la Opción B necesita.
- **Definir el manejo de errores dentro de la capa**, aplicando R-61 a R-64 al punto exacto donde un fallo cruza la frontera.
- **Fijar las dos direcciones de dependencia** de `application/`: hacia `domain/` y hacia `infrastructure/`.

---

# 3. Alcance

## 3.1 Incluye

- La anatomía, la nomenclatura y la firma canónica de un caso de uso.
- La tipología de puertos, su ubicación y su regla de declaración.
- La forma del contrato de resultado y sus restricciones de tipo.
- La forma de las factories y del objeto de dependencias.
- La extensión de la tabla de dependencias de ADR-09 §8 para los puertos de proveedor.
- La aplicación de R-61 a R-64 dentro de `application/`.
- Las prohibiciones que definen la capa por lo que no hace (§13).

## 3.2 No incluye

- **Ninguna modificación de ADR-01, ADR-04, ADR-05, ADR-06, ADR-07, ADR-08, ADR-09, ADR-13, ADR-15 ni ADR-16.** Este ADR los referencia y extiende; no reescribe ninguna de sus tablas.
- **El criterio comercial ni ninguna regla de dominio.** Corresponden a APS-18, APS-19, APS-20, ADR-15 y ADR-16.
- **El esquema de persistencia y el motor** *(ADR-13 · ADS-02)*.
- **Los orchestrators, las rutas HTTP y los contratos públicos** *(ADR-04 §7.8 · ADR-06 · ADR-07)*. Este ADR termina en la frontera superior de `application/`.
- **La capa `application/` del frontend.** `src/` sigue la estructura de módulo de ADR-01 §8, pero su cliente no tiene Composition Root ni puertos de persistencia. Registrado como limitación en §16, RA17-6.
- **La gobernanza del Perfil de Estrategia** *(ADR-15 §7.4)*, que sigue requiriendo ADR propio.
- **Cualquier código.** Las firmas de §5.3, §7.3 y §8.2 son **ilustrativas del diseño**, conforme al mismo criterio que ADR-09 §3 aplicó a las suyas.

---

# 4. Contexto — la pieza que falta

## 4.1 Lo que ya está decidido

| Documento | Qué aporta sobre `application/` |
| --- | --- |
| **ADR-01 §8** | La capa existe y «coordina los casos de uso del módulo» |
| **ADR-07 §8** | Puede importar `domain/` e `infrastructure/` del propio módulo. Devuelve «un resultado interno propio del módulo». No conoce contratos públicos, mappers ni HTTP |
| **ADR-08 §10** | Recibe la Repository Interface **como dependencia**. No importa `adapters/`, `models/` ni `contracts/` de persistencia |
| **ADR-09 §5.2, §5.3** | Expone una **factory** que recibe dependencias y devuelve la función ya vinculada. **Ninguna capa distinta del Composition Root construye sus propias dependencias** |
| **ADR-04 §11** | `shared/ai` es accesible **únicamente desde `infrastructure/`**. `shared/observability` sí es accesible desde `application/` |
| **ADR-11 §8.2** | `application/` no admite **ninguna** limitación sobre el conjunto de Leads |
| **ADR-15 §9.2 · ADR-16 D-2** | **Coordina; no decide.** Una condición que altere el sentido comercial pertenece a `domain/` |
| **APS-03 §12** | Cuatro categorías de error. Un fallo parcial **nunca aborta el conjunto** |
| **DEV-00 §3.12** | R-61 a R-64: cuándo el fallo viaja como valor y cuándo como excepción |

## 4.2 Lo que ninguno decide

**Seis preguntas que un desarrollador se hace al escribir el primer caso de uso y que hoy no tienen respuesta documental:**

1. ¿Un caso de uso es una función, una clase o un objeto?
2. ¿Cómo se llama el fichero y cuántos casos de uso caben en él?
3. Cuando un caso de uso necesita un proveedor externo, ¿recibe el adapter, lo importa, o recibe una interfaz? Y si es una interfaz, **¿dónde se declara?**
4. ¿Qué forma tiene el resultado, más allá de «propio del módulo»?
5. ¿Qué recibe exactamente la factory: parámetros sueltos o un objeto de dependencias?
6. ¿Dónde se envuelve el error del proveedor: en el adapter o en el caso de uso?

**Las seis se han venido respondiendo de hecho, tres veces y de tres maneras** (DP-03 §1.1). Este ADR las responde de una.

## 4.3 La divergencia heredada de ARCH-01

**ARCH-01 §6.0 adoptó la «Opción B — dependencia hexagonal estricta»** y su §8.2 registró honestamente que la decisión **no está en vigor**: DEV-00 §4.1 sigue autorizando el import y, por jerarquía documental, prevalece.

**ARCH-01 no podía hacer más.** No pertenece a la Clasificación Oficial de ADS-00, que es cerrada, y su propia nota de cumplimiento declara que **«no decide arquitectura: la localiza»**. Una decisión tomada allí es, en el mejor de los casos, una recomendación.

> **Este ADR es el vehículo normativo que ARCH-01 §6.0 identificó y no podía ser.**

**Y arrastra un defecto que hay que corregir al descender.** ARCH-01 §6.1 **DR-6** enuncia: *«Todo puerto lo declara `domain/` y lo implementa `infrastructure/`»*. **Es falso para el puerto de persistencia**: ADR-08 §6 sitúa las Repository Interfaces en `shared/persistence/repositories/`, y ADR-08 §10 prohíbe expresamente que esa carpeta importe `modules/*/domain/`. Aplicar DR-6 literalmente obligaría a mover las Repository Interfaces al dominio de cada módulo, **contra un ADR `Approved`**.

**§6.3 de este documento resuelve la ambigüedad distinguiendo los dos tipos de puerto.**

---

# 5. Decisión — anatomía de un caso de uso

## 5.1 Qué es un caso de uso

> **Un caso de uso es una función asíncrona, construida por una factory, que coordina una operación completa del módulo y devuelve un resultado propio del módulo.**

**No es una clase.** No hay estado entre invocaciones: todo lo que necesita lo recibe, por dependencia en la construcción o por argumento en la llamada. Un caso de uso con estado propio sería un Singleton encubierto, prohibido por R-57.

**No es un servicio.** Un servicio agrupa operaciones afines; un caso de uso **es una operación**. La agrupación de varias operaciones en una unidad es la vía por la que aparecen los componentes que RC-15 de ADR-16 prohíbe.

**No es un orquestador.** Coordina piezas **de su propio módulo**. Coordinar agentes distintos es competencia exclusiva de `orchestrators/` *(R-11 · ADR-04 §7.8)*.

## 5.2 Estructura física y nomenclatura

| Elemento | Regla | Fuente |
| --- | --- | --- |
| **Ubicación** | `modules/<módulo>/application/` | ADR-01 §8 |
| **Un fichero, un caso de uso** | El fichero se llama como el caso de uso | §14, AL-02 |
| **Nombre del caso de uso** | **Verbo en infinitivo**, en el lenguaje del Blueprint | DEV-00 §5.1 · R-60 |
| **Nombre de la factory** | `create` + caso de uso | DEV-00 §5.1 · ADR-09 §5.2 |
| **Nombre del tipo de la función** | Caso de uso + `Fn` | DEV-00 §5.1 |
| **Nombre del resultado** | Caso de uso + `Result` | §7.2 |
| **Nombre del objeto de dependencias** | Caso de uso + `Deps` | §8.2 |

**Ejemplo de nomenclatura completa**, con los nombres que ADR-16 §7 fija para el dominio comercial:

```text
modules/pitch-generator/application/generateProposal.ts
   ├── type  GenerateProposalDeps
   ├── type  GenerateProposalFn
   ├── type  GenerateProposalResult
   └── fn    createGenerateProposal(deps: GenerateProposalDeps): GenerateProposalFn
```

> **El nombre canónico del caso de uso lo fija el documento que lo define, no este ADR.** Para el dominio comercial son los cuatro de **ADR-16 §7**: `GenerateDiagnosis`, `CreateSequence`, `GenerateProposal`, `RegisterContact`.

## 5.3 Firma canónica

**Ilustrativa del diseño, no implementación** *(mismo criterio que ADR-09 §3)*:

```text
// modules/<módulo>/application/<casoDeUso>.ts

export type <CasoDeUso>Deps = {
  <puerto>: <PuertoInterface>;      // solo puertos y otras funciones de caso de uso
};

export type <CasoDeUso>Fn =
  (input: <CasoDeUso>Input) => Promise<<CasoDeUso>Result>;

export function create<CasoDeUso>(
  deps: <CasoDeUso>Deps
): <CasoDeUso>Fn { ... }
```

**Tres propiedades exigibles de esta firma:**

| Propiedad | Por qué |
| --- | --- |
| **`deps` es un objeto único con nombres** | El grafo de composición se lee en el Composition Root sin contar posiciones. Es la mitigación real de R1 y R3 de ADR-09 §11 |
| **La entrada es un objeto único** | Añadir un dato de entrada no cambia la aridad ni rompe a los llamadores, que son `presentation/` |
| **El tipo `Fn` no menciona ninguna dependencia** | Es la propiedad que permite a `presentation/` transportar un caso de uso con persistencia dentro sin conocer que la persistencia existe *(ADR-09 §5.2)* |

## 5.4 Una sola responsabilidad

**Un caso de uso corresponde a una operación completa y a un solo evento de escritura del catálogo cerrado de ADR-13 §13.1**, cuando escriba.

**Correspondencia vigente del dominio comercial** *(ADR-16 §7)*: `GenerateDiagnosis` → **E-7** · `CreateSequence` → **E-8** · `GenerateProposal` → **E-5** · `RegisterContact` → **E-9**.

> **Un caso de uso que produjese dos eventos estaría fundiendo dos operaciones**, y haría irreconocible qué escritura corresponde a qué decisión — precisamente lo que **RC-15** de ADR-16 prohíbe y lo que **D-6** exige poder trazar.
>
> **La condicionalidad no es multiplicidad.** `RegisterContact` versiona A-11 solo si hubo manifestación *(ADR-16 §6.1)*: sigue siendo **un** evento, E-9, con semántica condicional.

---

# 6. Puertos

## 6.1 Definición

> **Un puerto es una interfaz que declara lo que un caso de uso necesita del exterior, expresada en términos del propio módulo y sin nombrar a ningún proveedor.**

**Un puerto no es un adapter, y la diferencia es verificable:** si la interfaz nombra un proveedor —`Gemini`, `GooglePlaces`, `Supabase`—, en su nombre, en sus tipos o en su semántica, **no es un puerto**. Es un adapter con otro nombre, y propaga al dominio capacidades del proveedor, prohibido por **ADR-11 §9 E-6**.

## 6.2 Existen exactamente dos tipos

| Tipo | Qué abstrae | Quién lo declara | Dónde vive | Fuente |
| --- | --- | --- | --- | --- |
| **Puerto de persistencia** | Lectura y escritura de un activo de ADR-13 | La capa de persistencia compartida | **`shared/persistence/repositories/`** | **ADR-08 §6, §10** — *sin cambio* |
| **Puerto de proveedor** | Un servicio externo: descubrimiento, redacción generativa, enriquecimiento | **El `domain/` del módulo dueño** | `modules/<módulo>/domain/` | **§6.3** *(decisión de este ADR)* |

**No existe un tercer tipo.** Una dependencia de `application/` que no sea un puerto de persistencia, un puerto de proveedor u otra función de caso de uso **del mismo módulo** es una violación de frontera, no una categoría nueva *(§14, AL-08)*.

> **Por qué dos y no uno.** Se intentó unificarlos y no puede hacerse sin romper un ADR `Approved`. **ADR-08 §10 prohíbe a `shared/persistence/repositories/` importar `modules/*/domain/`** y sitúa la Repository Interface en términos de un **Persistence Contract**, declarado de forma independiente de la entidad de dominio *(ADR-08 §5, §6)*. Un puerto de persistencia declarado en `domain/` invertiría esa relación y obligaría a enmendar ADR-08 §5, §6 y §10.
>
> **La asimetría no es un defecto de diseño: es la consecuencia de que la persistencia es transversal a los módulos y el proveedor no.** Un `LeadRepository` sirve a más de un módulo; un puerto de redacción sirve solo al suyo.

## 6.3 Dónde se declara el puerto de proveedor

> **Decisión: el puerto de proveedor se declara en el `domain/` del módulo que lo consume, y se expresa exclusivamente en tipos de ese `domain/` y primitivos.**

**Tres fundamentos:**

1. **Es lo que hace verificable la Línea de Decisión.** ADR-15 §8 exige que `infrastructure/` reciba decisiones cerradas y no produzca ninguna. Si el contrato de esa entrega lo declara el propio `domain/`, **ampliarlo exige tocar el dominio** — y un cambio en el dominio se revisa. Declarado en `application/` o en `infrastructure/`, ampliarlo es un cambio local que nadie mira. Es la mitigación estructural de **RA-R2** de ADR-15 y de **R-3** de ADR-16.
2. **Es lo que ADR-16 ya presupone.** Su §2 declara que la dependencia de `GenerateProposal` sobre la redacción es *«un puerto declarado por `domain/`»*. Decidirlo aquí no innova: **hace exigible una presuposición que hoy no lo es**.
3. **No infringe R-04.** Una interfaz es una declaración de tipos. Declarar `interface RedaccionPort { redactar(e: Estrategia, hechos: HechoAfirmable[]): Promise<Texto> }` no importa nada externo al módulo: importa tipos de su propio `domain/`.

**Restricciones del puerto de proveedor** *(las cuatro son verificables por lectura de la interfaz)*:

| # | Restricción | Fuente |
| --- | --- | --- |
| **P-1** | Sus tipos proceden **solo** de `domain/` del propio módulo y de primitivos | R-04 · §6.1 |
| **P-2** | **No nombra ningún proveedor**, ni en el identificador ni en los tipos | ADR-11 §9 E-6 |
| **P-3** | **No expone ningún parámetro operativo** —tiempo de espera, reintentos, tamaño de tanda, cupo—: son limitaciones técnicas y viven en el adapter, con su valor en APS-17 | **APS-17 G-3 · ADR-11 §8.1, §8.3 · R-52** |
| **P-4** | **No expone credenciales.** Una clave de API no atraviesa un puerto: la recibe el adapter del Composition Root desde `shared/config/` | ADR-04 §11 · APS-10 · RI-9 |

> **P-3 y P-4 son las dos que más se incumplen.** La firma que hoy tiene `discoverProspects` —que recibe `apiKey` como argumento, tal como aparece en el ejemplo ilustrativo de ADR-09 §5.2— las infringe ambas: hace viajar una credencial por la capa de aplicación y ata su firma a la existencia de un proveedor con clave.

## 6.4 Quién implementa un puerto

| Puerto | Lo implementa | Fuente |
| --- | --- | --- |
| **De persistencia** | Un Database Adapter en `shared/persistence/adapters/` — **único lugar con driver de BD** | ADR-08 §10 · R-25 |
| **De proveedor** | Un adapter en `modules/<módulo>/infrastructure/`, que es la única frontera con un SDK externo | ADR-07 §8 · R-06 · ADR-03 §6 |

**El adapter de proveedor puede usar `shared/ai`**, cuyo acceso ADR-04 §11 restringe precisamente a `infrastructure/`. **Nunca lo usa `application/`**, y este ADR no altera esa regla: la refuerza al retirar el import.

---

# 7. Contratos de resultado

## 7.1 No se crea un `Result<T>` común

> **Cada módulo conserva su contrato de resultado propio.** Este ADR **no** introduce un sobre compartido y **no** debe introducirse después sin decisión propia.

**Fundamento vinculante: ADR-07 §8** — «devolviendo un resultado interno propio del módulo». **Trazabilidad de la deliberación: DP-03 §3, Alternativa C**, ratificada en §7.1 y ya descendida a **DEV-00 §3.12**. *(Conforme a AR-05 §4 y a la advertencia RC-2, el DP se cita como trazabilidad y nunca como fundamento.)*

**Lo que este ADR añade a esa decisión** es la única pieza que le faltaba: **DP-03 desestimó el sobre común pero no regló la forma del resultado propio**, de modo que «propio del módulo» seguía admitiendo tres formas distintas. §7.2 y §7.3 la reglan.

## 7.2 Forma del resultado

| # | Regla | Fuente |
| --- | --- | --- |
| **C-1** | El resultado es un **tipo nombrado y exportado**, `<CasoDeUso>Result`. **No se devuelve una estructura anónima** | §5.2 · ADS-00 *(Terminología)* |
| **C-2** | Sus tipos proceden de `domain/` del propio módulo y de primitivos. **Nunca** de `shared/contracts/`, `shared/mappers/`, `shared/persistence/` ni de otro módulo | R-05 · R-14 · R-22 · ADR-08 §10 |
| **C-3** | **Un fallo esperado y significativo para el caso de uso es una rama del resultado**, no una excepción | **R-61** · APS-03 §12 |
| **C-4** | Cuando hay más de una rama, se expresa como **unión discriminada por un campo literal**, nunca por la presencia o ausencia de una propiedad | §7.3 |
| **C-5** | **Un atributo ausente se representa como ausente.** Ningún valor por defecto sustituye a un dato que no existe | **R-38** · §6.1 de DEV-00 *(`strict`)* |
| **C-6** | Un resultado sobre un **conjunto** de Empresas distingue lo obtenido de lo fallido y **nunca omite silenciosamente** un elemento fallido | **R-64** · APS-03 §12 · PO-01 §8 |

## 7.3 Forma canónica de la unión

**Ilustrativa:**

```text
export type <CasoDeUso>Result =
  | { outcome: 'success'; ... }
  | { outcome: '<fallo esperado y nombrado>'; ... };
```

**Por qué discriminada y por qué literal.** Con `"strict": true` activo *(DEV-00 §6.1)*, una unión discriminada por literal es **exhaustiva y verificada por el compilador**: olvidar una rama es un error de tipos, no un fallo en producción. Una discriminación por presencia de propiedad —`if (r.error)`— no lo es, y además **convierte un valor legítimo `0`, `""` o `null` en una rama equivocada**, que es el mismo defecto que **R-38** persigue y que DEV-05 §4.2 documentó ya dos veces sobre el Score.

> **`outcome` y no `success`.** Un booleano solo admite dos ramas y obliga a subdividir el fallo dentro de una de ellas — que es exactamente cómo `PitchGeneratorOutcome` acabó teniendo tres ramas en `presentation/` mientras `application/` tenía dos *(DP-03 §1.1)*. **Un discriminante literal admite tantas ramas como fallos esperados haya, sin capas de traducción.**

## 7.4 Lo que el resultado no lleva nunca

| Prohibido | Por qué |
| --- | --- |
| **Un DTO público** | `application/` no conoce `shared/contracts/` *(R-05, R-14)*. La traducción es del mapper |
| **Un Persistence Contract o un Persistence Model** | R-22 · ADR-08 §10. **Es la desviación A-02**, corregida en código en DEV-05 §1.1 |
| **Un tipo del SDK del proveedor** | Filtraría una capacidad del proveedor a las capas superiores *(ADR-11 §9 E-6)* |
| **Una traza, un identificador técnico o un dato de diagnóstico destinado al usuario** | **UI-9 · O-6** |
| **Un recorte del conjunto** — `topN`, `truncated`, `omitted` sin causa | **R-42 · R-44 · ADR-11 §8.2** |

---

# 8. Factories

## 8.1 La factory es la única forma de construcción

> **`application/` expone una factory que recibe sus dependencias y devuelve la función de caso de uso ya vinculada.** *(ADR-09 §5.2 · R-56)*

**Este ADR no la redefine: la regla ya existe.** Lo que añade es la forma del parámetro y tres prohibiciones que hoy no constan en ningún sitio.

## 8.2 Forma del objeto de dependencias

| # | Regla | Fuente |
| --- | --- | --- |
| **F-1** | La factory recibe **un único parámetro**: un objeto `<CasoDeUso>Deps` con nombres | §5.3 |
| **F-2** | Cada campo de `Deps` es **un puerto o una función de caso de uso del propio módulo**. Nada más | §6.2 · §14 AL-08 |
| **F-3** | **Ninguna dependencia es opcional ni tiene valor por defecto.** Un valor por defecto es una construcción dentro de `application/`, prohibida por **R-55** | ADR-09 §5.3 · R-55 |
| **F-4** | La factory **no ejecuta trabajo**: no abre conexiones, no lee configuración, no invoca al proveedor. Solo cierra sobre sus dependencias y devuelve | ADR-09 §5.2, §6 |
| **F-5** | La factory **no valida** sus dependencias en tiempo de ejecución. El compilador con `strict` es la verificación | DEV-00 §6.1 |

> **F-3 es la más fácil de infringir sin darse cuenta.** `deps.redaccion ?? new GeminiRedaccionAdapter()` parece una comodidad y es una violación de R-55 y de §12: introduce en `application/` el conocimiento del adapter concreto, y con él el import que este ADR retira.

## 8.3 Un caso de uso puede depender de otro

**Solo del mismo módulo, y recibido como dependencia**, nunca importado y llamado directamente.

> **Es la única forma admisible de reutilización dentro de `application/`.** Importar otro caso de uso lo ataría a su implementación concreta y haría el módulo inverificable sin ejecutar la cadena entera — el mismo motivo por el que la Opción B se adopta para los proveedores.
>
> **Entre módulos distintos no existe esta posibilidad.** Un caso de uso jamás invoca a otro módulo: lo hace un Orchestrator *(R-02 · R-11 · ADR-04 §7.6 · ADR-15 RA-8)*.

---

# 9. Composición

## 9.1 Extensión de la tabla de ADR-09 §8

**Este ADR no modifica la tabla de ADR-09 §8. La extiende**, exactamente como ADR-09 §8 extendió la de ADR-08 §10 sin alterarla.

**ADR-09 §8 declara que `server/bootstrap/` no puede importar `modules/*/infrastructure/`.** Esa prohibición fue correcta bajo la arquitectura vigente al escribirse: `application/` importaba su propio adapter, y el Composition Root no tenía nada que construir allí. **Bajo la Opción B ya no puede sostenerse:** si `application/` recibe un puerto, alguien tiene que construir el adapter que lo implementa, y **el único lugar autorizado a construir es el Composition Root** *(ADR-09 §5.1, §5.3 · R-54, R-55)*.

> **Fila que se añade a la tabla de ADR-09 §8:**
>
> | Capa | Puede importar | No puede importar |
> | --- | --- | --- |
> | `server/bootstrap/` *(Composition Root)* | Todo lo que ya declara ADR-09 §8, **más `modules/*/infrastructure/` exclusivamente para construir adapters de proveedor y vincularlos a su puerto** | Todo lo que ya declara ADR-09 §8. **`modules/*/domain/` sigue prohibido**, salvo el **tipo** del puerto que necesita para tipar la vinculación |

**Todas las demás filas de ADR-09 §8 permanecen exactamente como están.** En particular se confirman sin cambio: `shared/persistence/adapters/` solo se importa desde `bootstrap/` *(R-54)*, y `modules/*/presentation/` no importa `shared/persistence/` **sin excepción** *(R-23)*.

> **La excepción es acotada y verificable por grep:** un import de `modules/*/infrastructure/` desde `bootstrap/` solo es admisible si su único uso es construir un adapter y pasarlo como valor de un campo de `Deps`. Cualquier otro uso —invocarlo, leer de él, componer lógica con él— es una violación *(§17, KPI-4)*.

## 9.2 Grafo de composición

```text
server/bootstrap/  (Composition Root — único constructor)
  │
  ├─ construye  DatabaseAdapter                 ─implementa→ Repository Interface
  │                                                          (shared/persistence/repositories/)
  ├─ construye  ProviderAdapter                 ─implementa→ Puerto de proveedor
  │             (modules/*/infrastructure/)                  (modules/*/domain/)
  │
  ├─ create<CasoDeUso>({ repo, puerto })        → <CasoDeUso>Fn
  │        application/ — conoce ambas interfaces, ningún adapter
  │
  ├─ create<Agente>Agent(casoDeUsoFn)           → Agent API
  │        presentation/ — no conoce persistencia ni proveedor en ninguna forma
  │
  ├─ create<Workflow>(agents)                   → Workflow
  │        orchestrators/ — no conoce HTTP, DTO ni persistencia
  │
  └─ registerRoutes(app, { workflow })          → Express
           routes/ — adaptador HTTP delgado
```

**Identificador:** ADR-17-DIAG-001 · **Versión:** v1.0 · **Fecha de actualización:** 2026-07-30

**Dirección de la dependencia:** lo concreto se inyecta desde arriba; el conocimiento no fluye hacia abajo. **La única diferencia respecto del grafo de ADR-09 §9 es la segunda línea** — el adapter de proveedor pasa a construirse donde ya se construía el de persistencia.

## 9.3 Ciclo de vida del adapter de proveedor

**Idéntico al del Database Adapter** *(ADR-09 §6)*, y se declara por extensión, no por analogía:

| Aspecto | Decisión |
| --- | --- |
| **Creación** | Una vez, durante el arranque, en el Composition Root |
| **Propiedad** | Del Composition Root |
| **Alcance** | Toda la vida del proceso |
| **Multiplicidad** | Una instancia por puerto |
| **Sustitución** | Cambiar de proveedor es un cambio de **una línea** en el Composition Root. Ninguna otra capa se entera |
| **Configuración** | El adapter recibe del Composition Root lo que necesite de `shared/config/`. **Ninguna capa lee `process.env` fuera de ahí** *(ADR-04 §11 · RI-9 · DEV-05 §1.3)* |

---

# 10. Manejo de errores

## 10.1 La regla vigente se aplica sin cambios

**R-61 a R-64 de DEV-00 §3.12 son la norma**, y derivan de APS-03 §12, PO-01 §8 y ADR-07 §8. **Este ADR no las altera.** Lo que hace es **situarlas** en los puntos concretos de la capa donde hoy no está claro cuál se aplica.

## 10.2 Dónde ocurre cada cosa

| Punto de la cadena | Qué ocurre | Fuente |
| --- | --- | --- |
| **El SDK del proveedor falla** | El **adapter** lo envuelve en `CommunicationError` o `ExternalDataError`, **conservando `cause`**. No lo hace el caso de uso | **R-63** · APS-11 §4.5 |
| **El puerto propaga el fallo** | Como excepción envuelta, o como valor si el puerto lo declara en su contrato. **La decisión consta en la interfaz del puerto**, no en el criterio de quien la usa | **R-61, R-62** |
| **El caso de uso lo recibe** | Decide si es **esperado y significativo** —entonces es una rama de su `Result`, C-3— o **inesperado** —entonces se propaga como excepción | **R-61, R-62** · §7.2 |
| **Un invariante del dominio se rompe** | Excepción de `shared/errors`. **Nunca una rama de resultado**: un invariante roto no es un desenlace previsto | **R-62** |
| **Falla el elemento *n* de un conjunto** | **El conjunto continúa.** El resultado declara qué se obtuvo y qué falló, y **un fallo posterior jamás retira un Lead ya registrado** | **R-64** · **PO-01 §8** · ADR-13 §11.2 A-2 |
| **Se quiere dejar constancia** | `shared/observability`, que **nunca altera el resultado** ni interrumpe la operación | **O-1, O-2** · ADR-04 §11 |

## 10.3 La frontera de traducción está en el adapter, no en el caso de uso

> **Un caso de uso nunca captura un error del SDK de un proveedor, porque nunca ve uno.** Ve lo que su puerto declara.

**Es una consecuencia directa de §12**, y la razón por la que retirar el import mejora el manejo de errores además de la testabilidad: mientras `application/` importa el adapter, **el `try/catch` que traduce el error del proveedor acaba escrito en el caso de uso**, y con él el conocimiento de qué errores produce ese proveedor concreto.

## 10.4 Lo que nunca hace un caso de uso con un error

| Prohibido | Por qué |
| --- | --- |
| **Tragarse un fallo** — capturarlo y continuar sin dejarlo en el resultado ni registrarlo | Convierte un fallo en un dato ausente indistinguible de un dato inexistente *(R-38)* |
| **Perder `cause` al reenvolver** | **R-63.** «Motivo de rechazo» en su enunciado literal |
| **Abortar el conjunto por un fallo parcial** | **R-64 · PO-01 §8.** Es una regresión de dominio, no un defecto de estilo |
| **Rellenar con un valor por defecto lo que falló** | **R-38 · UI-7.** El defecto que DEV-05 §4.2 documentó dos veces |
| **Exponer la traza o el mensaje del proveedor** en el resultado | **UI-9 · O-6 · APS-10** |

---

# 11. Dependencia hacia Domain

> **`application/` depende de `domain/` de su propio módulo, sin restricción, y de ningún otro `domain/`.**

| # | Regla | Fuente |
| --- | --- | --- |
| **D-A1** | Importa libremente `domain/` **del propio módulo** | ADR-07 §8 · ADR-01 §8 |
| **D-A2** | **No importa `domain/` de otro módulo.** La comunicación entre módulos pasa por el Orchestrator | **R-02 · R-03** · ADR-04 §7.6 |
| **D-A3** | **No contiene ninguna regla de negocio.** Encadena decisiones que toma el dominio | **R-48** · ADR-15 RA-6 · ADR-16 D-2 |
| **D-A4** | **No introduce ninguna limitación sobre el conjunto** — ni cupo, ni tanda, ni recorte, ni umbral | **ADR-11 §8.2 · R-42, R-43, R-46** |
| **D-A5** | Si un caso de uso contiene una condición que **altera el sentido comercial** de una operación, esa condición **pertenece a `domain/`** y debe trasladarse | ADR-15 §9.2 RA-6 · ADR-16 D-2 |

## 11.1 La prueba de D-A5

**D-A5 es inaplicable sin un criterio, porque «coordinar» y «decidir» se parecen mucho en el código.** La prueba:

> **¿Cambiaría la respuesta si la condición se escribiese al revés?**
>
> - **Cambiaría lo que AKVEZ decide sobre un negocio** —qué objetivo persigue, qué evidencia es afirmable, si un Lead transita de estadio— → **es dominio.** Trasládese.
> - **Cambiaría solo el orden, el momento o la forma de invocar** → es coordinación. Puede quedarse.

**Ejemplo del reparto** *(ADR-16 §7)*: que una declaración de contacto produzca `Contacted` **es regla comercial y vive en `domain/`**; que `RegisterContact` la aplique después de leer la secuencia y antes de entregar para persistir **es coordinación**.

> **D-A5 es la fuga más probable de toda la arquitectura comercial**, declarada como tal por partida triple: **RA-R1** de ADR-15, **R-2** de ADR-16 y **RC-3** de ADR-16 §8. Se disfraza de orquestación y no la detecta ningún compilador.

---

# 12. Dependencia hacia Infrastructure

## 12.1 Decisión

> **`application/` no importa `modules/*/infrastructure/`.**
>
> **Toda dependencia de un caso de uso sobre un servicio externo se expresa como puerto y se recibe por inyección desde el Composition Root.**

**Se ejerce así, en el nivel normativo que corresponde, la Opción B que ARCH-01 §6.0 adoptó sin autoridad para hacerla exigible** *(§4.3)*.

## 12.2 Relación con ADR-07 §8 — es una restricción, no una reinterpretación

**Debe quedar dicho sin ambigüedad, porque de ello depende que este ADR sea legítimo:**

| | |
| --- | --- |
| **Qué dice ADR-07 §8** | `application/` **puede** importar `domain/` e `infrastructure/` del propio módulo |
| **Qué hace este ADR** | Retira la segunda mitad de esa **facultad**. No convierte en prohibido nada que ADR-07 exigiese, porque **ADR-07 no obliga a ese import en ningún punto** |
| **Qué no hace** | **No modifica el texto de ADR-07 §8**, no lo reinterpreta y no lo deroga. El resto de su fila —lo que `application/` no puede importar— queda intacto |
| **Con qué autoridad** | **ADR-17 es un ADR, orden 4, el mismo rango que ADR-07.** Una decisión posterior que restringe una facultad concedida por una anterior es el mecanismo ordinario del registro de decisiones, no una infracción de **R-2**, que prohíbe a un documento **inferior** reinterpretar a uno superior |

> ⚠️ **Es la única decisión de este documento que altera una frontera ya aprobada, y por eso se somete expresamente al Product Office** *(§21, punto 3)*. **Hasta su ratificación, la fila de ADR-07 §8 y la de DEV-00 §4.1 siguen vigentes tal como están**, conforme a **ADS-00 R-4**: un documento `Draft` nunca prevalece sobre uno `Approved`.

## 12.3 Qué cambia y qué no

| | Antes | Después |
| --- | --- | --- |
| **Quién declara lo que se necesita del exterior** | El adapter, de hecho | **El `domain/` del módulo**, en el puerto |
| **Qué importa `application/`** | El adapter concreto | Nada de `infrastructure/`. El **tipo** del puerto, desde su propio `domain/` |
| **Quién construye el adapter** | Nadie: se importa como función de módulo | **El Composition Root** *(R-54, R-55)* |
| **Dónde vive el adapter** | `modules/*/infrastructure/` | **Igual.** No se mueve ningún fichero de sitio |
| **Quién puede usar `shared/ai`** | Solo `infrastructure/` | **Igual** *(ADR-04 §11)* |
| **La frontera de persistencia** | Repository Interface por inyección | **Igual** *(ADR-08 §10 · R-22)* |

## 12.4 Coste y beneficio, medidos

**Coste inmediato — tres puntos, verificados sobre el árbol de trabajo:**

| Módulo | Import que desaparece de `application/` |
| --- | --- |
| `lead-hunter` | `discoverProspects.ts` → `../infrastructure/googlePlacesAdapter` |
| `lead-analyzer` | `analyzeProspects.ts` → `../infrastructure/leadAnalysisAdapter` |
| `pitch-generator` | `generateOutreachPitch.ts` → `../infrastructure/pitchGenerationAdapter` |

Un puerto por módulo, su implementación declarada en el adapter existente y una línea de vinculación en el Composition Root. **Ningún fichero cambia de carpeta y ningún contrato público se altera.**

**Beneficio permanente:**

1. **Los 15 criterios de aceptación de ADR-16 §10.1 pasan a ser comprobables sin invocar un modelo generativo.** Hoy varios no lo son.
2. **La Línea de Decisión deja de ser una regla de revisión y pasa a ser una propiedad del grafo de dependencias.** Ampliar la lista cerrada de hechos afirmables desde `infrastructure/` exige cambiar un puerto declarado en `domain/`, no una línea en un adapter.
3. **Sustituir un proveedor deja de tocar `application/`.**
4. **El error del proveedor se traduce donde debe** *(§10.3)*.

**Riesgo asumido:** más indirección. Se acepta porque los proveedores son pocos y estables, y porque **el precedente de la persistencia demuestra que en este repositorio el patrón no degrada la legibilidad**: el Composition Root ya construye adapters de persistencia y nadie ha reportado coste por ello.

---

# 13. Lo que un caso de uso nunca hace

**La capa se define tanto por lo que hace como por lo que tiene prohibido.** Doce prohibiciones, todas con fuente vinculante:

| # | Nunca | Fuente |
| --- | --- | --- |
| 1 | **Decide una regla de negocio** | R-48 · ADR-15 RA-6 · ADR-16 D-2 |
| 2 | **Conoce HTTP** — no recibe `Request`/`Response`, no importa `express` | R-05 · ADR-07 §8 |
| 3 | **Conoce un DTO público o un mapper** | R-05 · R-14 |
| 4 | **Importa `shared/persistence/adapters/`, `models/` o `contracts/`** | **R-22** · ADR-08 §10 |
| 5 | **Importa un SDK externo, ni directa ni indirectamente** | R-06 · ADR-03 §6 |
| 6 | **Importa `shared/ai`** | **ADR-04 §11** |
| 7 | **Importa `modules/*/infrastructure/`** | **§12 · AL-19** *(en vigor desde la ratificación de la v1.1)* |
| 8 | **Construye una dependencia propia** | **R-55** · ADR-09 §5.3 |
| 9 | **Lee configuración o `process.env`** | ADR-04 §11 · RI-9 |
| 10 | **Introduce un cupo, una tanda, un recorte o un umbral sobre el conjunto** | **ADR-11 §8.2 · R-42, R-43, R-46, R-52** |
| 11 | **Invoca a otro módulo o a otro agente** | R-02 · R-11 · ADR-04 §7.6 · ADR-15 RA-8 |
| 12 | **Escribe fuera de un evento del catálogo de ADR-13 §13.1** | **ADR-13 §13.4** · ADR-16 D-6 |

---

# 14. Reglas Vinculantes

**Veinte reglas.** Se identifican **AL-01 a AL-20** —*Application Layer*— para no colisionar con las series existentes: `R-nn`, `O-n` y `UI-n` de DEV-00, `RA-n` de ADR-15, `RC-n`/`CA-16-nn` de ADR-16 y `DR-n` de ARCH-01.

| # | Regla | Fuente |
| --- | --- | --- |
| **AL-01** | Un caso de uso es **una función asíncrona construida por factory**. No es una clase, no es un servicio y no tiene estado propio | §5.1 · R-57 |
| **AL-02** | **Un fichero, un caso de uso.** El fichero se llama como el caso de uso, en infinitivo | §5.2 · DEV-00 §5.1 |
| **AL-03** | La nomenclatura es `create<X>` / `<X>Fn` / `<X>Deps` / `<X>Result`, **sin excepción** | §5.2 · DEV-00 §5.1 |
| **AL-04** | Un caso de uso corresponde a **una operación completa y, cuando escribe, a un solo evento** de ADR-13 §13.1 | §5.4 · ADR-16 D-6, RC-15 |
| **AL-05** | Toda dependencia externa se expresa como **puerto** | §6.1 |
| **AL-06** | El **puerto de persistencia** vive en `shared/persistence/repositories/`. **No se traslada a `domain/`** | **ADR-08 §6, §10** |
| **AL-07** | El **puerto de proveedor** lo declara el **`domain/` del módulo consumidor**, y cumple P-1 a P-4 | §6.3 · ADR-16 §2 |
| **AL-08** | `Deps` contiene **solo** puertos y funciones de caso de uso del propio módulo. Cualquier otra cosa es una violación de frontera | §8.2 F-2 |
| **AL-09** | **Ninguna dependencia es opcional ni tiene valor por defecto** | §8.2 F-3 · **R-55** |
| **AL-10** | La factory **no ejecuta trabajo ni valida en tiempo de ejecución** | §8.2 F-4, F-5 |
| **AL-11** | El resultado es un **tipo nombrado, propio del módulo**. **No existe `Result<T>` común** y no debe introducirse | §7.1 · **ADR-07 §8** |
| **AL-12** | Un resultado con varias ramas es una **unión discriminada por literal** | §7.3 · DEV-00 §6.1 |
| **AL-13** | El resultado **no transporta** DTO, Persistence Contract, tipo de SDK, traza ni recorte del conjunto | §7.4 |
| **AL-14** | **El adapter envuelve el error del proveedor conservando `cause`. El caso de uso nunca ve un error de SDK** | §10.3 · **R-63** |
| **AL-15** | **Un fallo parcial nunca aborta el conjunto**, y un fallo posterior **jamás retira un Lead ya registrado** | **R-64 · PO-01 §8** · ADR-13 §11.2 A-2 |
| **AL-16** | Un invariante roto **se lanza**; nunca es una rama de resultado | §10.2 · **R-62** |
| **AL-17** | `application/` importa `domain/` **del propio módulo** y de ningún otro | §11 · R-02 |
| **AL-18** | Una condición que **altera el sentido comercial** de una operación pertenece a `domain/` — prueba en §11.1 | ADR-15 RA-6 · ADR-16 D-2 |
| **AL-19** | **`application/` no importa `modules/*/infrastructure/`** | **§12** — ✅ **en vigor** |
| **AL-20** | El Composition Root **puede importar `modules/*/infrastructure/` exclusivamente para construir adapters de proveedor** y vincularlos a su puerto | **§9.1** *(extiende ADR-09 §8)* — ✅ **en vigor** |

> **AL-19 y AL-20 son la misma decisión vista desde los dos lados de la frontera, y entran en vigor juntas o no entran.** Ratificar una sin la otra dejaría un adapter que nadie puede construir.
>
> ✅ **Ambas fueron ratificadas conjuntamente el 2026-07-30** *(§22.1)*. **Las veinte reglas AL-01 a AL-20 son exigibles.**

---

# 15. Impacto en el código existente

**Este ADR es de diseño. No modifica código.** El impacto se materializa en la tarea que lo ejecute.

| Ámbito | Cambio previsto | Naturaleza |
| --- | --- | --- |
| `modules/*/domain/` *(×3)* | Alta de un puerto de proveedor por módulo | Aditivo |
| `modules/lead-hunter/application/discoverProspects.ts` | Retira el import del adapter; recibe el puerto. **Deja de recibir `apiKey`** *(P-4)* | Estructural |
| `modules/lead-analyzer/application/analyzeProspects.ts` | Ídem | Estructural |
| `modules/pitch-generator/application/generateOutreachPitch.ts` | Ídem | Estructural |
| `modules/*/infrastructure/*Adapter.ts` *(×3)* | Declaran que implementan su puerto. **No cambian de carpeta ni de lógica** | Declarativo |
| `bootstrap/compositionRoot.ts` | Construye los tres adapters y los vincula | Estructural |
| `shared/config/` | Entrega al Composition Root las credenciales que hoy viajan por `application/` | Estructural |

**No se altera:** ningún contrato público, ningún DTO, ninguna ruta HTTP, ningún Orchestrator, ninguna Agent API, ninguna pantalla y ninguna regla de dominio.

> **Prerrequisito declarado en ADR-15 §9.5:** el módulo comercial debe normalizarse —dejar de ser un `const` exportado y construirse desde el Composition Root— **antes que nada**. Este ADR no lo sustituye: lo presupone.

---

# 16. Riesgos

| # | Riesgo | Severidad | Mitigación |
| --- | --- | :-: | --- |
| **RA17-1** | **AL-19 se ratifica y no se ejecuta**, y el primer caso de uso comercial se escribe con el patrón antiguo, multiplicando la deuda | **Alta** | §15. Es el mismo modo de fallo que **RC-1** de AR-05: una decisión ratificada que no desciende. Debe ejecutarse **antes** del primer caso de uso comercial |
| **RA17-2** | **El puerto de proveedor se declara en `application/`** por proximidad, y se pierde el fundamento 1 de §6.3 | **Alta** | AL-07. Verificable por grep: toda interfaz de puerto reside en `domain/` |
| **RA17-3** | **El criterio comercial se filtra a `application/`** disfrazado de coordinación | **Alta** | AL-18 · §11.1. Ya declarado por ADR-15 RA-R1 y ADR-16 R-2. **Ningún compilador lo detecta** |
| **RA17-4** | **El puerto se declara con la forma del proveedor** —mismos parámetros, mismos tipos— y la abstracción es aparente | Media-alta | P-1 a P-4 de §6.3. Un puerto que solo un proveedor puede implementar no es un puerto |
| **RA17-5** | **La verbosidad del threading de dependencias** invita a introducir un contenedor de DI | Media | **R-57.** Aceptado conscientemente en ADR-09 §11 R3, sin cambio |
| **RA17-6** | **El frontend queda fuera de este ADR** y `src/*/application/` evoluciona con otro patrón | Media | §3.2. `src/shared/` ya es el vacío **V-6** de DEV-00 §11. Requiere decisión equivalente para el cliente |
| **RA17-7** | **Ninguna de las 20 reglas se verifica automáticamente** | **Alta** | Es el vacío **V-4** de DEV-00 §11 y el riesgo **RI-1**, heredados. Este ADR **no los cierra** y no debe presentarse como si lo hiciera |
| **RA17-8** | **AL-20 se usa como puerta trasera**: `bootstrap/` importa `infrastructure/` y acaba componiendo lógica allí | Media | §9.1, nota. **KPI-4** lo acota a construcción y vinculación |

---

# 17. KPIs

**Verificables por grep, en la línea de ADR-06, ADR-07, ADR-08 y ADR-09 §12:**

| # | Indicador | Objetivo |
| :-: | --- | :-: |
| **KPI-1** | Imports de `modules/*/infrastructure/` desde `modules/*/application/` | **0** |
| **KPI-2** | Interfaces de puerto de proveedor declaradas fuera de `modules/*/domain/` | **0** |
| **KPI-3** | Casos de uso que no se construyen por factory | **0** |
| **KPI-4** | Usos de un import de `infrastructure/` en `bootstrap/` distintos de construir y vincular | **0** |
| **KPI-5** | Tipos de resultado anónimos —no nombrados y exportados— en `application/` | **0** |
| **KPI-6** | Definiciones de un `Result<T>` común en `shared/` | **0** |
| **KPI-7** | Lecturas de `process.env` fuera de `shared/config/` | **0** *(ya verificado en DEV-05 §2)* |
| **KPI-8** | Dependencias nuevas en `package.json` atribuibles a este ADR | **0** |
| **KPI-9** | Líneas a modificar para sustituir un proveedor externo | **1**, en el Composition Root |

---

# 18. Dependencias

**Depende de:** **ADR-01** §8, §10 · **ADR-03** §6, §10 · **ADR-04 v1.3** §7.6, §7.7, §7.8, §10, §11 · **ADR-07 v1.1** §8 *(véase §12.2)* · **ADR-08 v1.2** §5, §6, §10 · **ADR-09 v1.3** §5, §6, §8, §8.1, §9 *(véase §9.1)* · **ADR-11 v2.1** §8.1, §8.2, §9 · **ADR-13 v1.2** §13.1, §13.4 · **ADR-15 v1.2** §8, §9.2, §9.5, §10 · **ADR-16 v1.1** §2, §6, §7, §8 · **APS-03 v3.1** §12 · **APS-10** · **APS-11** §4.5 · **APS-17 v1.1** §8, §9 · **PO-01 v1.2** §8 · **PO-02 v1.3** · **ADS-00** v1.3 · **DEV-00 v1.4** §3, §4.1, §5.1, §6.1.

**Trazabilidad de la deliberación**, sin fuerza normativa *(AR-05 §4 · RC-2)*: **DP-03 v1.1** §3, §7.1 · **ARCH-01 v1.3** §6.0, §6.1, §8.2 · **DEV-05 v1.0** §1, §2, §4.

**Condiciona a:**

- **DEV-00 §3.1 (R-05) y §4.1** — ✅ **sincronización ejecutada** en **DEV-00 v1.4**, tras la ratificación de §12.
- **ARCH-01 §6.1 (DR-3, DR-6) y §8.2** — ✅ **cerradas** en **ARCH-01 v1.3**.
- **ADR-09 §8** — ✅ **extendida** por §9.1. La nota de alcance consta en **ADR-09 v1.3 §8.1**.
- **ADR-15 §9.2** y **ADR-16 §2, §7** — ✅ su presuposición de puerto **pasa a estar fundada**.
- La implementación del **Commercial Diagnosis Engine** y de todo caso de uso posterior.

---

# 19. Glosario

**Caso de uso:** función asíncrona construida por factory que coordina una operación completa de un módulo y devuelve un resultado propio. *(§5.1)*

**Puerto:** interfaz que declara lo que un caso de uso necesita del exterior, en términos del propio módulo y sin nombrar proveedor. *(§6.1)*

**Puerto de persistencia:** Repository Interface. Vive en `shared/persistence/repositories/`. *(§6.2 · ADR-08 §6)*

**Puerto de proveedor:** interfaz de un servicio externo, declarada en el `domain/` del módulo consumidor. *(§6.3)*

**Adapter:** implementación concreta de un puerto. De persistencia en `shared/persistence/adapters/`; de proveedor en `modules/*/infrastructure/`. *(§6.4)*

**Objeto de dependencias (`Deps`):** único parámetro de una factory. Contiene solo puertos y funciones de caso de uso del propio módulo. *(§8.2)*

**Contrato de resultado:** tipo nombrado que devuelve un caso de uso, propio del módulo. *(§7)*

**Unión discriminada:** resultado de varias ramas distinguidas por un campo literal, exhaustivo bajo `strict`. *(§7.3)*

**Fallo esperado:** desenlace previsto por el caso de uso. Viaja como rama del resultado. *(R-61 · §10.2)*

**Fallo inesperado:** invariante roto o error interno. Viaja como excepción de `shared/errors`. *(R-62 · §10.2)*

---

# 20. Referencias

- **PO-01 v1.2** — §8. Ninguna etapa expulsa a un Lead. · **PO-02 v1.3** — alcance del sistema comercial.
- **APS-03 v3.1** — §12. Categorías de error y continuidad ante fallo parcial. **Fuente de R-61 a R-64.**
- **APS-10** · **APS-11 v1.0** §4.5 · **APS-17 v1.1** §8, §9.
- **ADR-01 v1.0** · **ADR-03 v1.0** · **ADR-04 v1.3** · **ADR-07 v1.1** · **ADR-08 v1.2** · **ADR-09 v1.3** · **ADR-11 v2.1** · **ADR-13 v1.2** · **ADR-15 v1.2** · **ADR-16 v1.1**.
- **ADS-00 v1.3** — Clasificación Oficial, Jerarquía Documental, reglas R-2 y R-4, Estructura Obligatoria.
- **DEV-00 v1.4** — §3.1, §3.9, §3.12, §4.1, §5.1, §5.4, §6.1, §11 *(V-4, V-6)*, §9 *(RI-1)*.
- **ARCH-01 v1.3** *(fuera de la Clasificación Oficial)* — §6.0, §6.1, §8.2. **Origen de la Opción B; sin fuerza normativa propia.**
- **DP-03 v1.1** *(consultivo)* — §3, §7.1. Trazabilidad de la decisión de no crear `Result<T>`.
- **DEV-05 v1.0** — §1, §2.1, §4.2. Estado verificado del código.
- **Código inspeccionado:** `server/modules/*/application/*.ts` · `server/bootstrap/compositionRoot.ts`.

---

# 21. Definition of Done

> ## ✅ Los cinco puntos quedan cumplidos — 2026-07-30. Véase §22.

1. ✅ **Ratificada la anatomía del caso de uso** de §5 y las veinte reglas **AL-01 a AL-20** de §14 como contrato de la capa de aplicación. — *§22.2*
2. ✅ **Ratificada la tipología de puertos de §6**, y en particular **AL-06**: el puerto de persistencia **no** se traslada a `domain/`. **ARCH-01 §6.1 DR-6 quedó corregido** en su v1.2. — *§22.3*
3. ✅ **Pronunciamiento expreso sobre §12 (AL-19 y AL-20)**, la única decisión que restringe una facultad de un ADR `Approved` — ADR-07 §8. **Ratificadas conjuntamente.** — *§22.1*
4. ✅ **Autorizada y ejecutada** la sincronización de **DEV-00 §3.1 (R-05) y §4.1** — **DEV-00 v1.4**, paso 9 del mismo sprint, **después** de esta ratificación y no antes. — *§22.4*
5. ✅ **Confirmado que el frontend queda fuera de alcance** *(RA17-6)*. — *§22.5*

**Este ADR está en `Approved`.** **ADR-07 §8 conserva su texto íntegro**; lo que cambia es que una decisión posterior de su mismo rango ha retirado una de las facultades que concedía *(§12.2)*.

> **Lo que este ADR no resuelve, y debe seguir diciéndose.** No cierra **V-1** *(sin runner de pruebas)*, **V-2** *(sin linter)* ni **V-4** *(sin verificación automática de fronteras)*. **Sus veinte reglas dependen hoy de la disciplina del revisor**, igual que las ochenta de DEV-00 §3. Presentarlas como garantizadas sería falso: **son exigibles, no comprobadas.** La ratificación no altera este hecho.

---

# 22. Ratificación

> ## ✅ RATIFICADO — AKVEZ Product Office y Architecture Team, 2026-07-30
>
> Sprint **Gobernanza Final (Architecture Freeze)**, paso 7. **Último bloqueo arquitectónico del proyecto.**

## 22.1 AL-19 y AL-20 — pronunciamiento expreso

> **Se ratifican conjuntamente. La Opción B —dependencia hexagonal estricta— es desde hoy la arquitectura oficial de AKVEZ.**

| Regla | Contenido | Estado |
| --- | --- | :-: |
| **AL-19** | `application/` **no importa** `modules/*/infrastructure/`. Toda dependencia sobre un servicio externo se expresa como **puerto** y se recibe por inyección | ✅ **En vigor** |
| **AL-20** | El Composition Root **puede importar `modules/*/infrastructure/` exclusivamente** para construir adapters de proveedor y vincularlos a su puerto | ✅ **En vigor** |

**Relación con ADR-07 §8 — ratificada la lectura de §12.2.** ADR-07 §8 **concedía una facultad y no imponía ninguna obligación**. Este ADR, de su mismo rango y posterior, la retira. **No hay reinterpretación y no se infringe R-2**, que prohíbe a un documento *inferior* reinterpretar a uno superior. **El texto de ADR-07 §8 no se modifica.**

**Relación con ADR-09 §8 — ratificada la extensión de §9.1.** La tabla de ADR-09 §8 **no se modifica**: se le añade una fila, con el mismo mecanismo con que ADR-09 §8 extendió la de ADR-08 §10. La nota de alcance consta en **ADR-09 v1.3 §8.1**.

**Coste verificado, no estimado:** tres imports en `discoverProspects.ts`, `analyzeProspects.ts` y `generateOutreachPitch.ts`. **Ningún fichero cambia de carpeta; ningún contrato público se altera.**

## 22.2 El patrón definitivo de casos de uso — ratificado

| Comprobación | Resultado |
| --- | :-: |
| **Un caso de uso es una función asíncrona construida por factory**, sin estado propio *(AL-01)* | ✅ |
| **Un fichero, un caso de uso**, en infinitivo *(AL-02)* | ✅ |
| **Nomenclatura `create<X>` / `<X>Fn` / `<X>Deps` / `<X>Result`** *(AL-03)* | ✅ Coherente con DEV-00 §5.1 y ADR-09 §5.2 |
| **Una operación, un evento** de ADR-13 §13.1 *(AL-04)* | ✅ Coincide con **ADR-16 D-6** y **RC-15** |
| **El contrato de resultado es propio del módulo. No se crea `Result<T>` común** *(AL-11)* | ✅ **ADR-07 §8** se conserva literalmente. **DP-03 no se cita como fundamento** *(AR-05 §4)* |
| **Unión discriminada por literal**, exhaustiva bajo `strict` *(AL-12)* | ✅ Se apoya en DEV-00 §6.1 |
| **Ninguna dependencia opcional ni con valor por defecto** *(AL-09)* | ✅ Refuerza **R-55** |
| **El adapter envuelve el error del proveedor conservando `cause`; el caso de uso nunca ve un error de SDK** *(AL-14)* | ✅ Refuerza **R-63** |
| **Un fallo parcial nunca aborta el conjunto** *(AL-15)* | ✅ **R-64 · PO-01 §8 · ADR-13 §11.2 A-2.** Es regla de dominio, no de estilo |

## 22.3 Los puertos — tipología ratificada

> **Existen exactamente dos tipos de puerto, con ubicación distinta y ya decidida.**

| Puerto | Dónde se declara | Resultado |
| --- | --- | :-: |
| **De persistencia** — Repository Interface | **`shared/persistence/repositories/`**, sin cambio | ✅ **AL-06.** **ADR-08 §5, §6 y §10 quedan intactos** |
| **De proveedor** | **`domain/` del módulo consumidor**, con P-1 a P-4 | ✅ **AL-07.** Es lo que **ADR-16 §2 ya presuponía** |

**Se ratifica expresamente la corrección de ARCH-01 DR-6.** Su redacción original —*«todo puerto lo declara `domain/`»*— **era falsa para el puerto de persistencia** y, leída literalmente, habría obligado a trasladar las Repository Interfaces al dominio de cada módulo, **contra un ADR `Approved`**. **La asimetría entre los dos puertos es deliberada:** la persistencia es transversal a los módulos y el proveedor no.

**P-3 y P-4 se ratifican como las restricciones críticas:** un puerto **no expone parámetros operativos** *(APS-17 G-3 · R-52)* ni **credenciales** *(APS-10 · RI-9)*. La firma actual de `discoverProspects`, que recibe `apiKey`, **infringe ambas** y debe corregirse al implementar.

## 22.4 El Composition Root — ratificado

| Comprobación | Resultado |
| --- | :-: |
| **`server/bootstrap/` sigue siendo el único Composition Root** *(ADR-09 §5.1 · R-54)* | ✅ **Sin cambio** |
| **Ninguna capa distinta de él construye sus dependencias** *(R-55)* | ✅ Reforzado por **AL-09** |
| **El adapter de proveedor tiene el mismo ciclo de vida que el de persistencia** *(§9.3)* | ✅ Declarado por extensión, no por analogía |
| **Sustituir un proveedor es un cambio de una línea** *(KPI-9)* | ✅ |
| **`modules/*/presentation/` sigue sin importar `shared/persistence/`, sin excepción** *(R-23)* | ✅ **Intacto** |
| **La excepción de AL-20 es acotada y verificable por grep** *(KPI-4)* | ✅ Solo construir y vincular |

**Sincronización habilitada.** Con este ADR en `Approved`, **DEV-00 §3.1 (R-05) y §4.1 pueden sincronizarse** y se sincronizaron en el paso 9. **No antes**: una regla DEV cuya fuente estuviera en `Draft` sería nula por **R-7** de ADS-00.

## 22.5 Alcance del frontend — confirmado

**El frontend queda fuera de alcance** *(§3.2 · RA17-6)*. `src/*/application/` **no está gobernado por este ADR**: el cliente no tiene Composition Root ni puertos de persistencia.

**Se registra como acción de arquitectura pendiente, no bloqueante**, junto al vacío **V-6** de DEV-00 §11 —la estructura interna de `src/shared/`—. **Ambas afectarán a la interfaz comercial y ninguna afecta al backend.**

## 22.6 Riesgos al ratificar

**RA17-1 a RA17-8 se mantienen intactos.** Dos se ratifican expresamente como los que gobiernan el sprint siguiente:

- **RA17-1** —*se ratifica y no se ejecuta*— es hoy el riesgo dominante. **ADR-15 §9.5 obliga a reconstruir el módulo comercial desde el Composition Root antes que nada**, y AL-19 cambia cómo ese módulo recibe su proveedor. **Hacer ambas cosas a la vez cuesta lo mismo que hacer una.**
- **RA17-7** —ninguna de las veinte reglas se verifica automáticamente— **no se cierra con esta ratificación y no debe presentarse como cerrado.** Es el vacío **V-4** de DEV-00.

## 22.7 Alcance de esta ratificación

**No se modifica ninguna decisión.** Los cambios de la v1.1 son: estado, historial, retirada de las marcas *(pendiente de ratificación)* en §13 y §14, cierre de los cinco puntos de §21, versiones citadas en §18 y §20 y esta sección.
