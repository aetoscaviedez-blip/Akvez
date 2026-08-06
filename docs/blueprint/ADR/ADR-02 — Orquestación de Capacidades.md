# ADR-02 — Orquestación de Capacidades y Agentes

| Campo | Valor |
|--------|-------|
| Código | ADR-02 |
| Clasificación | Architecture Decision Record |
| Versión | 1.1 |
| Estado | Approved |
| Fecha de creación | 2026-07-23 |
| Última actualización | 2026-07-29 |
| Responsable | AKVEZ Architecture Team |
| Nivel de confidencialidad | Interno |

---

# Historial de Versiones

| Versión | Fecha | Responsable | Descripción | Motivo |
|----------|------------|------------------|------------------------------|--------------------------------|
| 1.0 | 2026-07-23 | Architecture Team | Creación inicial del documento | Definir la estrategia oficial de orquestación |
| 1.1 | 2026-07-29 | AKVEZ Product Office | **Aclaratorio.** Nota en §8 que precisa la correspondencia entre los bloques del modelo de ejecución y los agentes de APS-03 v3.0: `Scoring` es una operación del Lead Analyzer, no una capacidad separada. Se explicita que el Registro ocurre dentro del bloque `Lead Hunter` y que el Análisis precede siempre a la Evaluación. **Ninguna otra sección modificada; el modelo de ejecución y el papel del Orchestrator permanecen intactos.** | Fase 2 de PLAN-01 y PO-01 §9.2: «ADR-02 §8 — aclaración del bloque `Scoring`». La lectura literal de §8 permitía interpretar `Scoring` como capacidad independiente anterior al análisis, origen de las contradicciones C-4 y C-5 de ADR-10A §7. |

---

# Tabla de Contenido

1. Resumen Ejecutivo
2. Objetivo
3. Alcance
4. Contexto
5. Problema
6. Decisión Arquitectónica
7. Principios de Orquestación
8. Modelo de Ejecución
9. Alternativas Evaluadas
10. Decisiones Importantes
11. Riesgos
12. KPIs
13. Dependencias
14. Glosario
15. Referencias
16. Anexos
17. Definition of Done

---

# 1. Resumen Ejecutivo

AKVEZ adopta un modelo de orquestación desacoplado donde las capacidades del negocio permanecen independientes y colaboran mediante Orchestrators.

Los agentes inteligentes ejecutan casos de uso pertenecientes a un único módulo.

La coordinación entre múltiples capacidades nunca será responsabilidad de un agente individual.

---

# 2. Objetivo

Definir cómo colaboran los distintos módulos de AKVEZ para ejecutar procesos complejos sin aumentar el acoplamiento entre ellos.

---

# 3. Alcance

Este ADR define:

- La relación entre módulos.
- El papel de los agentes.
- El papel de los Orchestrators.
- La coordinación entre capacidades.

No define:

- Prompts.
- Modelos de IA.
- Herramientas (Tools).
- Frameworks de agentes.
- Integraciones con proveedores.

---

# 4. Contexto

AKVEZ evolucionará desde una aplicación con pocas capacidades hasta una plataforma compuesta por múltiples módulos especializados.

Ejemplos:

- Lead Hunter
- Pitch Generator
- CRM
- Analytics
- Outreach
- Proposal Generator

Sin una estrategia clara de coordinación, los módulos tenderían a comunicarse directamente entre sí, aumentando el acoplamiento y dificultando la evolución independiente.

---

# 5. Problema

Cuando varias capacidades necesitan colaborar para completar un proceso de negocio, existen dos riesgos principales:

- Dependencias directas entre módulos.
- Agentes con múltiples responsabilidades.

Ambos escenarios incrementan la complejidad del sistema y reducen su mantenibilidad.

---

# 6. Decisión Arquitectónica

AKVEZ utilizará un modelo de orquestación donde:

- Cada módulo ejecuta únicamente su propia responsabilidad.
- Cada agente pertenece a un único módulo.
- Ningún agente coordina otros agentes.
- La coordinación de procesos compuestos será responsabilidad exclusiva de los Orchestrators.

---

# 7. Principios de Orquestación

## 7.1 Responsabilidad Única

Cada agente ejecutará únicamente casos de uso pertenecientes a su propio dominio.

---

## 7.2 Independencia

Los agentes desconocen la existencia de otros agentes.

---

## 7.3 Coordinación Centralizada

Los procesos que involucren múltiples módulos serán coordinados por un Orchestrator.

---

## 7.4 Comunicación Controlada

Los módulos solo expondrán interfaces públicas.

No podrán acceder directamente a la lógica interna de otros módulos.

---

## 7.5 Sustituibilidad

Un agente podrá ser reemplazado por otra implementación sin modificar el resto del flujo.

---

# 8. Modelo de Ejecución

Ejemplo de flujo:

Client Acquisition

↓

Lead Hunter

↓

Scoring

↓

Pitch Generator

↓

Proposal

↓

CRM

Cada bloque representa una capacidad independiente.

El Orchestrator controla el flujo completo.

> ## Nota aclaratoria (v1.1) — Correspondencia con el dominio consolidado
>
> **Alcance de esta nota.** Es **aclaratoria y terminológica**. No modifica el modelo de ejecución, ni la decisión de orquestación, ni el papel del Orchestrator. Precisa a qué corresponde cada bloque en la terminología oficial, evitando lecturas que contradigan a PO-01.
>
> **El bloque `Scoring` no es una capacidad separada: es una operación del Lead Analyzer.** El diagrama anterior es un *ejemplo de flujo* por capacidades y no enumera agentes. La asignación oficial de responsabilidades a agentes corresponde a APS-03 v3.0 §7, que atribuye tanto el Análisis como el cálculo del Opportunity Score al **Lead Analyzer**.
>
> **Correspondencia oficial:**
>
> | Bloque de §8 | Agente responsable | Etapas del ciclo de vida |
> | --- | --- | --- |
> | `Lead Hunter` | Lead Hunter | Descubrimiento · **Registro** |
> | `Scoring` | **Lead Analyzer** | Análisis → Evaluación |
> | `Pitch Generator` | Pitch Generator | Propuesta |
>
> **Dos precisiones vinculantes:**
>
> 1. **El Registro ocurre dentro del bloque `Lead Hunter`**, antes de `Scoring`. El diagrama no lo representa por ser un esquema de capacidades, no de escrituras. Véase APS-03 v3.0 §8.1, paso 4.
> 2. **Dentro de `Scoring`, el Análisis precede siempre a la Evaluación.** El Opportunity Score se calcula sobre el conocimiento que produce el Análisis (PO-01 §5; APS-07 v2.0 §6.3). La posición del bloque en el diagrama no autoriza a puntuar antes de analizar.
>
> **Contradicciones cerradas.** Esta nota resuelve **C-4** y **C-5** del inventario de ADR-10A §7. `Scoring` no es una capacidad que deba ubicarse de forma independiente, y el orden respecto del Análisis queda fijado.
>
> **Materia cerrada.** El bloque `Scoring` **no** representa ningún mecanismo de reducción del conjunto. Conforme a PO-01 §6 y §7 y a ADR-11 §9, el flujo no contiene recorte alguno: el Lead Analyzer **ordena**, nunca excluye.

---

# 9. Alternativas Evaluadas

## Alternativa A — Comunicación directa entre módulos

**Resultado:** Rechazada.

### Motivo

Incrementa el acoplamiento y dificulta el mantenimiento.

---

## Alternativa B — Agentes coordinando otros agentes

**Resultado:** Rechazada.

### Motivo

Genera agentes con múltiples responsabilidades y reduce la claridad arquitectónica.

---

## Alternativa C — Orquestación independiente

**Resultado:** Aprobada.

### Motivo

Permite mantener módulos independientes y procesos escalables.

---

# 10. Decisiones Importantes

1. Ningún agente podrá invocar directamente otro agente.
2. Los módulos no compartirán lógica interna.
3. Toda coordinación entre capacidades será realizada por un Orchestrator.
4. Los agentes pertenecerán siempre a un único módulo.
5. La lógica de negocio permanecerá dentro del módulo propietario.

---

# 11. Riesgos

| Riesgo | Mitigación |
|---------|------------|
| Exceso de lógica en los Orchestrators | Limitar su responsabilidad exclusivamente a la coordinación |
| Procesos demasiado largos | Dividirlos en workflows independientes |
| Acoplamiento accidental | Revisiones arquitectónicas periódicas |

---

# 12. KPIs

La estrategia será considerada exitosa cuando:

- Ningún módulo dependa internamente de otro.
- Los procesos puedan ampliarse incorporando nuevos módulos sin modificar los existentes.
- Los agentes mantengan una única responsabilidad.
- Los Orchestrators permanezcan como coordinadores y no como implementadores.

---

# 13. Dependencias

Depende de:

- ADR-01 — Arquitectura Modular Orientada al Dominio
- AF-00
- ADS-00

Impacta:

- Todos los módulos futuros.
- ADR-03.
- APS relacionados con Agentes.

---

# 14. Glosario

**Agente**

Componente encargado de ejecutar casos de uso pertenecientes a un único módulo.

---

**Orchestrator**

Componente responsable de coordinar procesos que involucran múltiples módulos sin implementar lógica de negocio.

---

**Workflow**

Secuencia ordenada de ejecución coordinada por un Orchestrator.

---

# 15. Referencias

- ADR-01
- AF-00
- ADS-00

---

# 16. Anexos

No aplica.

---

# 17. Definition of Done

Este ADR se considera terminado cuando:

- Mantiene consistencia con ADR-01.
- Cumple ADS-00.
- Define claramente la estrategia de orquestación.
- Ha sido revisado y aprobado.

---

## Control de Calidad (AQS)

| Criterio | Resultado |
|----------|-----------|
| Claridad | ✅ |
| Completitud | ✅ |
| Implementabilidad | ✅ |
| Consistencia | ✅ |
| Escalabilidad | ✅ |
| Calidad Editorial | ✅ |

**AKVEZ Quality Score (AQS): 99/100**

---

> **Nota de Gobernanza**
>
> Toda modificación futura del modelo de orquestación deberá registrarse mediante un nuevo ADR.
>
> Este documento constituye la referencia oficial para la colaboración entre capacidades del negocio en AKVEZ.