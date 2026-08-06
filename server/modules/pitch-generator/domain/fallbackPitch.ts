/**
 * Plantilla de respaldo — el texto que se envía cuando el modelo no responde.
 *
 * ── ⚠️ POR QUÉ SE REESCRIBIÓ ENTERA (H-09 · Prioridad 1) ─────────────────────
 *
 * La versión anterior hacía **tres afirmaciones que AKVEZ no puede sostener**, y
 * las tres las habría firmado el usuario delante de un negocio real:
 *
 * 1. **«He creado un boceto», «preparé un boceto visual preliminar», «he
 *    diseñado un borrador».** **AKVEZ no produce ningún boceto.** Quien enviara
 *    ese mensaje estaría prometiendo un entregable inexistente a un tercero.
 *
 * 2. **«puede incrementar las reservas hasta en un 40 %»** y **«podrían
 *    multiplicar sus reservas y clientes».** Cifras y promesas sin ningún dato
 *    detrás.
 *
 * 3. **«me llamó poderosamente la atención la calidad de sus servicios».** El
 *    respaldo no ha leído nada del negocio: actúa precisamente cuando el
 *    análisis del modelo **no** está disponible.
 *
 * **Lo único que el respaldo sabe con certeza son los problemas detectados**
 * —que llegan del análisis— y los datos de la firma. La plantilla nueva se
 * limita a eso: presenta al remitente, enumera lo observado y **pide permiso
 * para conversar**. No promete nada que no exista.
 *
 * El texto es más corto y más sobrio que el anterior. Es el precio de que sea
 * verdad, y es un precio que este producto ya decidió pagar hace seis sprints.
 */
export function generateFallbackPitch(designer: any, lead: any, channel: string) {
  const designerName = designer.name || "Diseñador freelance";
  const businessName = lead.name;

  let subjectLine = "";
  let message = "";

  // **Sin adjetivos sobre el resultado.** El texto anterior afirmaba usar
  // «técnicas de copy de alta conversión», que no es comprobable.
  const strategyExplanation =
    "Texto de respaldo: se redactó a partir de los problemas detectados en el análisis, sin intervención del modelo generativo.";

  const hasFlaws = Array.isArray(lead.flaws) && lead.flaws.length > 0;
  const flawsStr = hasFlaws
    ? lead.flaws.map((f: string) => `• ${f}`).join("\n")
    : "";

  // **Si no hay hallazgos, no se inventa ninguno.** El mensaje se apoya
  // entonces en el único hecho disponible: no tienen sitio web propio.
  const observed = hasFlaws
    ? `Revisando su presencia digital anoté lo siguiente:\n\n${flawsStr}`
    : "Revisando su presencia digital vi que todavía no cuentan con un sitio web propio.";

  if (channel.toLowerCase() === "whatsapp") {
    message =
      `¡Hola! Escribo desde ${designerName}. Me encontré con *${businessName}* buscando negocios de la zona.\n\n` +
      `${observed}\n\n` +
      `Me dedico al diseño y desarrollo de sitios web, y creo que hay margen para mejorar ahí. ` +
      `¿Les interesaría que lo comentemos sin compromiso?\n\n` +
      `Un saludo,\n*${designerName}*`;
  } else if (channel.toLowerCase() === "email" || channel.toLowerCase() === "correo") {
    subjectLine = `Sobre la web de ${businessName}`;
    message =
      `Estimado equipo de ${businessName},\n\n` +
      `Les escribo porque me encontré con su negocio buscando empresas de su sector en Colombia.\n\n` +
      `${observed}\n\n` +
      `Me dedico al diseño y desarrollo de sitios web para negocios como el suyo. ` +
      `Si les parece, puedo contarles con más detalle qué haría en su caso concreto — sin compromiso por su parte.\n\n` +
      `¿Les interesa que hablemos?\n\n` +
      `Atentamente,\n\n${designerName}`;
  } else {
    // DM o canal genérico.
    message =
      `¡Hola! Me encontré con *${businessName}* buscando negocios del sector.\n\n` +
      `${observed}\n\n` +
      `Me dedico al diseño web y creo que puedo ayudarles con eso. ` +
      `¿Les interesaría que lo comentemos?\n\n` +
      `Un saludo,\n*${designerName}*`;
  }

  return {
    subjectLine,
    message,
    strategyExplanation
  };
}
