export function generateFallbackAnalysis(place: any, industry: string, location: string, designerStyle: string) {
  const name = place.name;
  const source = place.source || "Google Maps";
  const hasWeb = !!(place.website && place.website.trim() !== "" && !place.website.toLowerCase().includes("sin sitio web"));
  
  let description = `${name} es un negocio referente de ${industry} en ${location}, ofreciendo servicios locales con atención al público.`;
  let flaws: string[] = [];
  let revenueLoss = "";
  let angle = "";
  let whyWebsiteNeeded = "";
  let classification = place.calculatedClassification || "Sin sitio web";

  if (source === "Instagram" || source === "Facebook") {
    classification = "Sitio web básico";
    description = `Establecimiento de ${industry} en ${location} con fuerte presencia en ${source}, interactuando con su comunidad de clientes en redes.`;
    flaws = [
      `Dependencia absoluta de los cambios de algoritmo de ${source}, limitando el alcance orgánico de sus publicaciones de manera drástica.`,
      "Ausencia de un menú o catálogo interactivo con sistema de pedidos/reservas estructurado y autogestionable.",
      "Falta de presencia en Google (SEO local), lo que hace que pierda clientes que buscan activamente en la web."
    ];
    revenueLoss = `Pierde un volumen considerable de ventas diarias al obligar a los interesados en ${location} a enviar un mensaje directo (DM) o esperar respuesta manual en WhatsApp para conocer precios o cotizar.`;
    angle = `Diseñar una página de aterrizaje (Landing Page) optimizada y moderna con estilo "${designerStyle || "moderno y minimalista"}", enfocada en la reserva directa y sincronizada con sus redes sociales.`;
    whyWebsiteNeeded = `Superar las limitaciones operativas de ${source} con un canal de ventas propio, rápido, automatizado y disponible las 24 horas.`;
  } else if (source === "Directorio") {
    classification = "Sitio web básico";
    description = `Comercio de ${industry} listado en plataformas de directorios comerciales de ${location}, buscando visibilidad en búsquedas locales.`;
    flaws = [
      "Nula diferenciación de marca al estar expuesto exactamente igual que toda su competencia directa en la misma lista telefónica o web.",
      "Incapacidad de recolectar datos de clientes (leads propios) o de realizar campañas de marketing digital independientes.",
      "Ausencia de un dominio propio, lo que reduce la confianza y la percepción de profesionalismo corporativo."
    ];
    revenueLoss = `El tráfico de clientes calificados en el directorio se desvía constantemente a otros competidores locales que sí cuentan con un sitio web independiente y profesional.`;
    angle = `Crear un sitio web corporativo premium con estilo "${designerStyle || "moderno y minimalista"}" que posicione al negocio como el líder indiscutible del sector "${industry}" en ${location}.`;
    whyWebsiteNeeded = `Independizarse de listados impersonales y consolidar una marca robusta con un dominio exclusivo y de alta recordación.`;
  } else {
    // Google Maps
    if (classification === "Sin sitio web") {
      description = `Negocio físico verificado de ${industry} en ${location} con una ficha activa en Google Maps pero sin presencia web institucional.`;
      flaws = [
        "Inexistencia de un portafolio de servicios o catálogo digital que los usuarios puedan consultar de manera autónoma.",
        "Falta de canales automatizados de prospección, dependiendo exclusivamente de llamadas telefónicas o visitas físicas.",
        "Pérdida de credibilidad digital frente a competidores que sí proyectan una imagen sólida en la web."
      ];
      revenueLoss = `Decenas de usuarios buscan "${industry} en ${location}" en Google y terminan contratando a la competencia debido a la falta de información digital rápida de este negocio.`;
      angle = `Construir un sitio web responsivo desde cero con estilo "${designerStyle || "moderno y minimalista"}" que sirva como su principal imán de clientes digitales.`;
      whyWebsiteNeeded = `Pasar de la invisibilidad digital a tener un escaparate online profesional para captar leads en automático.`;
    } else {
      // web deficiente / básica
      description = `Establecimiento de ${industry} en ${location} que cuenta con un sitio web básico o desactualizado (${place.website}).`;
      flaws = [
        "Falta de optimización para dispositivos móviles, dificultando la navegación rápida del usuario común.",
        "Tiempos de carga lentos y un diseño visual que ya no representa la calidad real de sus servicios.",
        "Ausencia de llamados a la acción claros (CTAs) para agendar citas, cotizar servicios o comprar en línea."
      ];
      revenueLoss = `Desperdicio de pauta publicitaria y tráfico orgánico al dirigir a los clientes a un sitio lento y poco atractivo que no genera confianza de pago.`;
      angle = `Ejecutar un rediseño completo de su sitio web actual adoptando una estética "${designerStyle || "moderno y minimalista"}" y una arquitectura de conversión superior.`;
      whyWebsiteNeeded = `Modernizar la infraestructura digital para proyectar prestigio y multiplicar la tasa de conversión de visitantes a clientes actuales.`;
    }
  }

  return {
    description,
    flaws,
    revenueLoss,
    angle,
    whyWebsiteNeeded,
    classification
  };
}
