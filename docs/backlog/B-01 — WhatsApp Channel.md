# B-01 — WhatsApp Channel

**Estado:** backlog · **posterior a la hackathon**
**Origen:** detectado en H-12.2 · alcance decidido en H-12.3 (opción a)
**Prioridad:** por definir

> No implementar. Este documento especifica trabajo futuro.

---

## Objetivo

Añadir WhatsApp como cuarto canal del Pitch Generator, de modo que un diseñador
pueda generar un mensaje adaptado a ese canal y abrir la conversación con el
negocio desde AKVEZ.

Hoy el generador ofrece **Email, LinkedIn e Instagram**. WhatsApp es el canal de
contacto comercial dominante en Colombia, que es el mercado del producto, y es
además el único de los cuatro para el que **Google Places entrega el dato de
contacto directamente** (`nationalPhoneNumber`). Es, por tanto, el canal con
menos fricción entre el análisis y el primer contacto real.

---

## Alcance

### Dentro

1. **Cuarto canal en el selector** del Pitch Generator, con su icono, junto a los
   tres existentes.
2. **Normalización del teléfono** a formato internacional E.164 desde el
   `nationalPhoneNumber` que devuelve Places.
3. **Enlace de apertura** (`wa.me/<E164>?text=<mensaje>`), como acción explícita
   del usuario — nunca un envío automático.
4. **Estado de ausencia**: qué ve el usuario cuando el negocio no tiene teléfono
   registrado. Debe declararse, no desaparecer (R-38).
5. **Adaptación del prompt** al registro del canal: WhatsApp es más breve y más
   informal que un email en frío.

### Fuera

- Envío automático de mensajes. AKVEZ **presenta y no decide** (R-48); el usuario
  pulsa y revisa antes de enviar.
- Integración con la WhatsApp Business API.
- Seguimiento del estado del mensaje (entregado, leído, respondido).
- Plantillas, secuencias o automatizaciones.
- Cualquier forma de contacto masivo.

---

## Dependencias

| # | Dependencia | Estado hoy |
|---|-------------|-----------|
| 1 | `places.nationalPhoneNumber` en el `FieldMask` | ✅ **ya se solicita** |
| 2 | Que el teléfono sobreviva el mapeo a `Prospect` | ⚠️ **por verificar** |
| 3 | Rama `whatsapp` en el respaldo determinista | ✅ **ya existe** en `fallbackPitch.ts` |
| 4 | Contrato del canal en el DTO de generación | ⚠️ **por verificar** |
| 5 | Criterio de normalización para Colombia (+57) | ❌ **no existe** |

El punto 3 es relevante: **media funcionalidad ya está construida.** El backend
contempla el canal; lo que falta es la mitad de arriba —selector, teléfono
normalizado y enlace— más la decisión sobre la ausencia de teléfono.

---

## Riesgos

| # | Riesgo | Impacto | Mitigación propuesta |
|---|--------|---------|---------------------|
| R1 | **Teléfonos en formatos heterogéneos.** Places devuelve el formato nacional, que varía en separadores, prefijos y longitud. | Enlaces rotos que abren WhatsApp sin destinatario. | Normalizar a E.164 y **no ofrecer el canal** si la normalización falla, en lugar de ofrecer un enlace roto. |
| R2 | **Negocios sin teléfono.** Es un caso frecuente, no excepcional. | El canal aparece muerto en parte del catálogo. | Declarar la ausencia explícitamente, igual que el resto del producto. |
| R3 | **Percepción de spam.** Un mensaje comercial no solicitado por WhatsApp es más intrusivo que un email. | Daño reputacional para el usuario del producto, que es quien firma. | El mensaje se abre en WhatsApp **redactado pero sin enviar**. La decisión de enviar es siempre del usuario. |
| R4 | **Teléfono personal, no comercial.** Muchos negocios pequeños registran un móvil particular. | Contactar a una persona en su número privado. | Advertencia en la interfaz antes de abrir el canal. |
| R5 | **Marco legal.** La Ley 1581 de 2012 (protección de datos, Colombia) regula el uso de datos personales con fines comerciales. | Riesgo legal para el usuario final. | **Requiere criterio del PO antes de implementar.** No es una decisión de ingeniería. |

---

## Criterios de aceptación

```
□ WhatsApp aparece como cuarto canal del Pitch Generator
□ El mensaje generado tiene el registro propio del canal (breve, informal)
□ El teléfono se normaliza a E.164 partiendo del dato de Places
□ Un negocio con teléfono válido abre wa.me con el mensaje precargado
□ Un negocio sin teléfono declara la ausencia y no ofrece el canal
□ Un teléfono que no se puede normalizar declara la ausencia y no ofrece el canal
□ El enlace NUNCA envía: abre WhatsApp con el mensaje redactado y sin enviar
□ El usuario ve una advertencia antes de abrir el canal (R4)
□ El respaldo determinista funciona para este canal sin Gemini
□ El mensaje no afirma nada fuera de la lista de problemas (integridad H-09)
□ Existe cobertura de tests para la normalización, incluidos los casos que fallan
□ El criterio legal (R5) está resuelto y documentado por el PO
```

---

## Nota

El último criterio **no es técnico y bloquea a los demás**. Contactar comercios
por WhatsApp con datos obtenidos de una API es una decisión de producto con
implicaciones legales, no una tarea de implementación. Debe resolverse antes de
abrir el sprint.
