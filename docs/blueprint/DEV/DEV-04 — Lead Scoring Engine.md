# DEV-04 — Lead Scoring Engine

**DEV** *(orden 8)* · v1.0 · **Draft** · 2026-07-29 · AKVEZ Engineering · ADS-00 v1.3
*Registro de ejecución. No modifica ninguna decisión arquitectónica ni documental.*

## 1. Qué se implementó

**WP-01 v1.0 está operativo de extremo a extremo.** Verificado sobre HTTP real: 23 empresas → 23 registradas → **23 puntuadas** → Biblioteca ordenada por Score descendente, cada Lead vinculado a `WP-01 v1.0`.

| Alcance | Estado |
| --- | --- |
| Cálculo del Score | ✅ Seis categorías de APS-08 §6 con los pesos literales de §7.1 |
| Breakdown completo | ✅ Por categoría: peso, parcial, contribución, factores medidos y no medibles, explicación |
| Persistir `score`, `scoreVersion`, `breakdown` | ✅ Más perfil de usuario, banda, confianza, cobertura y marca temporal |
| Mostrar el Score en la Biblioteca | ✅ Score, banda, confianza y versión del Perfil |

**Pesos transcritos, no inventados** (APS-08 §7.1): Presencia Web 25 · Potencial de Mejora 25 · Compatibilidad 20 · Reputación 12 · Identidad Digital 10 · Información Comercial 8 = **100**.

**Ficheros nuevos (6):** `domain/weightingProfile.ts` (WP-01, `Object.freeze` = R-INM) · `domain/opportunityScore.ts` (cálculo puro) · `application/listLeadScores.ts` · `models/LeadAnalysisModel.ts` · `adapters/leadAnalysisMapper.ts` · `adapters/inMemoryLeadAnalysisAdapter.ts`.
**Modificados (10):** entidad y contrato `LeadAnalysis`, `LeadAnalysisRepository`, `analyzeProspects`, `LeadAnalyzerAgent`, `leadLibraryOrchestrator`, `leadLibrary` (DTO), `leadLibraryMapper`, `compositionRoot`, y los tres ficheros del frontend de la Biblioteca.

**Sustitución del scoring anterior.** `calculateScore` aplicaba una escala inventada (base 25 más bonificaciones) sin correspondencia con ninguna categoría ni peso aprobado. Se conserva **solo** para `calculatedClassification`, que alimenta el prompt de Gemini y describe el sitio observado — concepto distinto de las cinco bandas de §8.

**El Orchestrator es el único canal.** Lead Hunter aporta la Biblioteca (APS-03 §7.1); Lead Analyzer aporta el Score (§7.2); `leadLibraryOrchestrator` los une por `leadId`. **Ningún agente conoce al otro** (ADR-04 §7.6). La Biblioteca manda: se recorre la lista de Leads registrados, de modo que un Lead sin Evaluación sigue apareciendo y una emisión huérfana no puede inventar un Lead (APS-08 §8.6).

## 2. Evidencias

| Comprobación | Resultado |
| --- | --- |
| `tsc --noEmit` | ✅ **0 errores** |
| `npm run build` | ✅ exit 0 |
| Flujo HTTP completo | ✅ 23 registrados · 23 puntuados · orden descendente |
| Dependencias circulares | ✅ **0** (140 aristas) |
| Fronteras de capa | ✅ **0 violaciones nuevas** (64 ficheros) |
| Suite de scoring | ✅ **24 verificaciones** |

**Verificado en la suite:** pesos = 100 y coincidentes con §7.1 · ningún peso cero · C-1/C-3/C-4/C-5/C-8 presentes (C-6/C-7/C-9/C-10 exentos por §7.2, versión inicial) · **R-INM** el perfil es inmutable en caliente · **ADR-14 §6.3** 25 ejecuciones idénticas y el Score **se recalcula desde lo persistido (92 = 92)** · **R-VIN** toda emisión lleva su versión · las contribuciones reconstruyen el Score · los 10 límites de banda de §8 · **R-38** `rating 0` se trata como ausencia y saca el peso del divisor (100→88) sin dejar de emitir Score · **APS-08 §11** confianza declarada · **V-1/V-2/V-3** append-only con historial íntegro · **R-34** versión del Perfil **y** perfil de usuario conservados.

**Dirección del modelo confirmada:** sin web 90 > con web propia 51; en nicho 90 > fuera de nicho 86. Es lo que exige la justificación de §7.1 — «el mejor cliente potencial es aquel cuya presencia digital es deficiente o inexistente».

## 3. Desviación corregida durante el sprint

**RV-D incumplida — banda «Oportunidad Excelente» inalcanzable.** Un barrido exhaustivo de **3.456 combinaciones** midió un techo de **86 puntos**: la banda 90-100 no podía alcanzarse nunca, contra la verificación **RV-D** de APS-08 §7.1 —«ninguna combinación impide alcanzar cualquier banda»—.

**Causa:** puntuaba «información incompleta» dentro de Potencial de Mejora **y** Información Comercial como categoría propia. El mismo hecho, contado dos veces **con signo opuesto**: más datos de contacto subían una y bajaban la otra, y además concedían a la contactabilidad un peso oculto que distorsionaba los pesos declarados.

**Corrección:** el factor queda **sin medir**, declarado como tal en `unmeasuredFactors`. Techo tras la corrección: **94**; las **cinco bandas son alcanzables** (Excelente 141 casos en el barrido). Es un defecto de mis funciones por categoría, no de WP-01.

## 4. Decisiones requeridas y desviaciones detectadas

**D-1 — Las funciones de puntuación por categoría no están documentadas.** APS-08 §6 enumera **qué factores** evalúa cada categoría, pero ningún documento aprobado define **cómo** convertir los datos disponibles en la parcial 0-100. Las he derivado exclusivamente de los factores que §6 enumera y de la dirección que §7.1 justifica, limitándome a lo medible, y he dejado cada elección explícita en el código con su cita. **Requiere pronunciamiento del Product Office**, que es la autoridad de APS-08 (ADR-14 §8.1). Es también el ámbito de la corrección de §3.

**Cobertura real: 50 %.** De los 24 factores que §6 enumera, hoy solo 12 son medibles con lo que aporta el descubrimiento. No son medibles: funcionamiento y velocidad del sitio, consistencia de marca, actividad reciente, correo, horarios, descripción, antigüedad y consistencia de reseñas, problemas de usabilidad. Por eso la confianza se declara **media** y no alta (APS-08 §11): el Score es honesto sobre lo que no sabe.

**D-2 — El flujo nunca reutiliza una identidad de Lead, así que V-1 no se ejercita.** Reanalizar las mismas empresas **crea Leads nuevos** (2 → 4 en la prueba) en lugar de emitir una segunda versión sobre el Lead existente. El versionado del repositorio **funciona** —probado con el mismo `leadId`: emisiones 1 y 2, historial íntegro—, pero el flujo asigna identidad nueva en cada ejecución. Es la desviación **A-03** (`LeadRepository` no expresa la identidad `(Referencia de Origen, Usuario)`) junto con **ADR-12**: ambas abiertas y del Architecture Team. **No se decidió aquí.**

**D-3 — El breakdown se persiste pero no se publica.** APS-08 §9 exige que todo Score vaya acompañado de su explicación —qué subió, qué bajó, qué es oportunidad—. Se persiste íntegro y la Biblioteca muestra Score, banda, confianza y versión, pero **el desglose por categoría no cruza la frontera HTTP**: publicarlo exige decidir la forma del DTO de explicación, que el alcance de este sprint no cubría. §9 queda **parcialmente** satisfecho.

**Sin cambios: A-01, A-02, A-03, T-14.** Ninguna nueva. A-02 sigue siendo la única violación de frontera, y **los dos casos de uso nuevos no la amplían**: solo importan Repository Interfaces.

## 5. Riesgos heredados que conviene recordar

**R-8 de ADR-14 · carácter provisional de WP-01.** APS-08 §7.1 lo declara: los pesos «derivan de los principios ya aprobados, no de datos observados», y el perfil «deberá revisarse en cuanto exista evidencia conforme a §10». Su sustitución seguirá el procedimiento de ADR-14 §8.4, con Estrategia de Transición (C-10), que la versión inicial no necesitó.

**Persistencia en memoria.** `inMemoryLeadAnalysisAdapter` no sobrevive a un reinicio, y asigna un `userId` placeholder que **no satisface ADR-05 §14**. Bloqueante para multi-usuario, igual que su hermano de Lead.

*Referencias: APS-08 §6, §7.1 (WP-01, RV-A a RV-G), §8, §8.6, §9, §10, §11 · ADR-12 · ADR-13 §10.2, §10.3 (V-1 a V-5) · ADR-14 §6.3-§6.6, §7.1-§7.4 (C-1 a C-10, R-INM, R-VIN), §8.1, §8.4, §9.1-§9.2 · APS-17 §4 (WS-05) · APS-03 §7.1-§7.2 · ADR-04 §7.6, §10, §11 · ADR-05 §7, §14 · ADR-08 §5-§10 · ADR-09 §5-§6 · PO-01 §5, §8 · DEV-00 R-19, R-22 a R-27, R-34, R-38, R-42, R-44, R-45, R-50 a R-52, R-64, UI-2, UI-7.*
