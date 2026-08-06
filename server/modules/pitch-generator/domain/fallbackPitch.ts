export function generateFallbackPitch(designer: any, lead: any, channel: string) {
  const designerName = designer.name || "Diseñador freelance";
  const designerStyle = designer.style || "diseño moderno y minimalista";
  const businessName = lead.name;
  
  let subjectLine = "";
  let message = "";
  let strategyExplanation = "Esta propuesta de outreach se ha estructurado con técnicas de copy de alta conversión diseñadas especialmente para negocios de Colombia.";

  const flawsStr = Array.isArray(lead.flaws) && lead.flaws.length > 0 
    ? lead.flaws.map((f: string) => `• ${f}`).join("\n")
    : "• Falta de canal interactivo de conversión.";

  if (channel.toLowerCase() === "whatsapp") {
    message = `¡Hola! Me topé con el perfil de *${businessName}* en internet y me encantó la gran reputación y calidad del trabajo que tienen. ¡Muchos éxitos con su proyecto! 👏\n\nAnalizando su presencia digital, noté un punto clave donde podrían estar perdiendo clientes potenciales:\n${flawsStr}\n\nHoy en día, la rapidez es todo. He creado un boceto rápido e interactivo de una página web con estilo *${designerStyle}*, especialmente pensado para facilitar que sus clientes les coticen o programen reservas de inmediato sin perder tiempo.\n\n¿Te interesaría que te comparta el borrador visual rápido y sin ningún compromiso para ver qué opinas?\n\nUn saludo,\n*${designerName}*`;
  } else if (channel.toLowerCase() === "email" || channel.toLowerCase() === "correo") {
    subjectLine = `Propuesta de conversión digital y diseño para ${businessName} 📈`;
    message = `Estimado equipo de ${businessName},\n\nEspero que estén teniendo una excelente semana. Les escribo porque descubrí su marca y me llamó poderosamente la atención la calidad de sus servicios en Colombia.\n\nRevisando su presencia digital detalladamente, identifiqué algunas oportunidades tácticas que podrían estar limitando su captación de clientes de forma automática:\n\n${flawsStr}\n\nEn mi experiencia, ofrecer un portal web rápido y responsivo ayuda a mitigar la fricción de compra y puede incrementar las reservas hasta en un 40%.\n\nComo especialista, preparé de forma proactiva un boceto visual preliminar con estilo ${designerStyle} diseñado exclusivamente para expandir el prestigio gráfico y los canales de contacto de su negocio.\n\n¿Me permitirían enviarles el link de la propuesta gráfica para que la revisen de manera gratuita y sin ningún compromiso?\n\nAtentamente,\n\n${designerName}`;
  } else {
    // DM or generic
    message = `¡Hola! Qué gran trabajo hacen en *${businessName}*. Me llamó mucho la atención la calidad de sus servicios en redes.\n\nAnalizando su presencia digital por encima, identifiqué algunas oportunidades que podrían multiplicar sus reservas y clientes sin aumentar su publicidad:\n${flawsStr}\n\nMe dedico profesionalmente al diseño web corporativo. He diseñado de forma gratuita un borrador preliminar con estilo *${designerStyle}* ideal para su nicho. ¿Te gustaría que te comparta el enlace sin compromiso para ver si es algo que les sume valor?\n\n¡Un fuerte saludo!\n*${designerName}*`;
  }

  return {
    subjectLine,
    message,
    strategyExplanation
  };
}
