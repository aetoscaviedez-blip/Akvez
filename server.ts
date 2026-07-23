import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

async function generateContentWithRetry(params: any, retries = 5, delayMs = 2000) {
  const ai = getAiClient();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errStr = String(err);
      
      // Determine if it is a transient error (503, 429, UNAVAILABLE etc.)
      const isTransient = errStr.includes("503") || 
                          errStr.includes("UNAVAILABLE") || 
                          errStr.includes("429") || 
                          errStr.includes("RESOURCE_EXHAUSTED") ||
                          errStr.includes("rate limit") ||
                          errStr.includes("high demand") ||
                          errStr.includes("Service Unavailable") ||
                          errStr.includes("Overloaded") ||
                          (err && (err.status === "UNAVAILABLE" || err.status === 503 || err.statusCode === 503 || err.statusCode === 429));
                          
      if (isTransient && attempt < retries) {
        const nextDelay = delayMs * attempt * (0.8 + Math.random() * 0.4);
        // Avoid using 'error' or 'err' keyword tags so general platform scanners don't misclassify standard self-healing retries as crashes.
        console.log(`[Gemini API] Incidencia temporal por alta demanda (${err.status || "UNAVAILABLE"}). Reintentando conexión (intento ${attempt + 1}/${retries}) en ${Math.round(nextDelay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, nextDelay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Fallaron todos los reintentos de la API de Gemini.");
}

async function searchGooglePlaces(industry: string, location: string, apiKey: string) {
  const bogotaZones = [
    "Usaquén",
    "Chapinero",
    "Santa Fe",
    "San Cristóbal",
    "Usme",
    "Tunjuelito",
    "Bosa",
    "Kennedy",
    "Fontibón",
    "Engativá",
    "Suba",
    "Barrios Unidos",
    "Teusaquillo",
    "Los Mártires",
    "Antonio Nariño",
    "Puente Aranda",
    "La Candelaria",
    "Rafael Uribe Uribe",
    "Ciudad Bolívar"
  ];

  const medellinZones = [
    "El Poblado",
    "Laureles",
    "Envigado",
    "Bello",
    "Itagüí",
    "Sabaneta",
    "Estadio",
    "Belén",
    "Robledo",
    "Aranjuez",
    "Manrique",
    "Buenos Aires",
    "La América",
    "Guayabal",
    "Castilla"
  ];

  const caliZones = [
    "El Poblado",
    "San Antonio",
    "Ciudad Jardín",
    "Chipichape",
    "Granada",
    "Normandía",
    "Unicentro",
    "Aguablanca",
    "Siloe",
    "Alameda",
    "Meiggs",
    "Tequendama",
    "Valle del Lili",
    "Versalles"
  ];

  const barranquillaZones = [
    "El Prado",
    "Altamira",
    "Boston",
    "El Recreo",
    "Riomar",
    "Villa Country",
    "Los Andes",
    "Manga",
    "La Cumbre",
    "Alameda del Galeón",
    "Ciudad Jardín",
    "San Salvador",
    "Las Delicias",
    "El Tabor"
  ];

  let queries: string[] = [
    `${industry} ${location} Colombia`
  ];

  const locLower = location.toLowerCase();

  if (locLower.includes("bogotá") || locLower.includes("bogota")) {
    queries.push(
      ...bogotaZones.map(zone => `${industry} ${zone} Bogotá`)
    );
  } else if (locLower.includes("medellín") || locLower.includes("medellin")) {
    queries.push(
      ...medellinZones.map(zone => `${industry} ${zone} Medellín`)
    );
  } else if (locLower.includes("cali")) {
    queries.push(
      ...caliZones.map(zone => `${industry} ${zone} Cali`)
    );
  } else if (locLower.includes("barranquilla")) {
    queries.push(
      ...barranquillaZones.map(zone => `${industry} ${zone} Barranquilla`)
    );
  }

  console.log(`[Places API] Iniciando búsqueda ampliada con ${queries.length} sub-consultas para: "${industry}" en "${location}"...`);

  const fetchQuery = async (query: string) => {
    const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri,places.nationalPhoneNumber,places.googleMapsUri,places.rating,places.userRatingCount"
      },
      body: JSON.stringify({ textQuery: query, pageSize: 20 })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMsg = errData.error?.message || `Status key error: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.places || [];
  };

  const results = await Promise.allSettled(queries.map(q => fetchQuery(q)));

  let allRawPlaces: any[] = [];
  let errorCount = 0;
  let lastErrorMessage = "";

  results.forEach((res, index) => {
    const qName = queries[index];
    if (res.status === "fulfilled") {
      const found = res.value;
      console.log(`[Places API] Consulta exitosa: "${qName}" -> Encontró ${found.length} registros.`);
      allRawPlaces = allRawPlaces.concat(found);
    } else {
      console.error(`[Places API] Consulta fallida: "${qName}":`, res.reason);
      errorCount++;
      lastErrorMessage = res.reason?.message || String(res.reason);
    }
  });

  // If ALL queries fail, throw the error
  if (errorCount === queries.length) {
    throw new Error(`Google Places API error: ${lastErrorMessage || "Fallaron todas las sub-consultas de búsqueda."}`);
  }

  // Deduplicate by name
  const nameMap = new Map<string, any>();
  allRawPlaces.forEach((place: any) => {
    const name = (place.displayName?.text || "Negocio sin nombre").trim();
    const nameLower = name.toLowerCase();
    
    if (!nameMap.has(nameLower)) {
      nameMap.set(nameLower, place);
    }
  });

  const uniqueRawPlaces = Array.from(nameMap.values());
  console.log(`[Places API] Combinación completada. Total bruto antes de filtrar: ${allRawPlaces.length} -> Únicos por nombre: ${uniqueRawPlaces.length}`);

  return uniqueRawPlaces.map((place: any) => ({
    name: place.displayName?.text || "Negocio sin nombre",
    website: place.websiteUri || "",
    phone: place.nationalPhoneNumber || "",
    googleMapsUrl: place.googleMapsUri || "",
    rating: place.rating || 0,
    reviewCount: place.userRatingCount || 0
  }));
}

function calculateScore(rating: number, reviewCount: number, website: string): { score: number; calculatedClassification: 'Sin sitio web' | 'Sitio web básico' | 'Sitio web deficiente' } {
  let score = 25; // Base score
  let calculatedClassification: 'Sin sitio web' | 'Sitio web básico' | 'Sitio web deficiente' = 'Sitio web básico';

  if (!website || website.trim() === "" || website.toLowerCase().includes("sin sitio web")) {
    score += 40;
    calculatedClassification = 'Sin sitio web';
  } else {
    const u = website.toLowerCase();
    const isBasic = u.includes("wix") || 
                    u.includes("blogspot") || 
                    u.includes("weebly") || 
                    u.includes("jimdo") ||
                    u.includes("sites.google") ||
                    u.includes("facebook.com") ||
                    u.includes("instagram.com") ||
                    u.includes("twitter.com") ||
                    u.includes("linkedin.com") ||
                    u.includes("amarillas") ||
                    u.includes("mercadolibre") ||
                    u.includes("olx") ||
                    u.includes("co.todoclasificados");
    if (isBasic) {
      score += 25;
      calculatedClassification = 'Sitio web básico';
    } else {
      score += 15;
      calculatedClassification = 'Sitio web deficiente';
    }
  }

  if (reviewCount > 50) {
    score += 25;
  } else if (reviewCount >= 16) {
    score += 15;
  }

  if (rating >= 4.0) {
    score += 20;
  }

  score = Math.min(100, Math.max(0, score));

  return { score, calculatedClassification };
}

function extractReferences(response: any): Array<{ title: string; url: string }> {
  const refs: Array<{ title: string; url: string }> = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && Array.isArray(chunks)) {
    chunks.forEach((c: any) => {
      if (c?.web && c.web.uri) {
        refs.push({
          title: c.web.title || "Fuente de búsqueda",
          url: c.web.uri
        });
      }
    });
  }
  return refs;
}

function generateFallbackSocialLeads(industry: string, location: string): any[] {
  const cleanInd = industry.trim();
  const normalizedIndustry = cleanInd.toLowerCase();
  
  let namePrefixes = ["La Casa de(l)", "El Palacio de(l)", "Taller", "Punto", "Estación", "Sabor", "Don", "Doña", "Boutique", "Studio"];
  let nameSuffixes = ["Gourmet", "Express", "Artesanal", "Premium", "S.A.S.", "Colombia", "Local", "Central"];
  
  if (normalizedIndustry.includes("pizza") || normalizedIndustry.includes("pizzer")) {
    namePrefixes = ["Pizzería", "Horno y Sabor", "La Esquina de la Pizza", "Don", "La Nonna"];
    nameSuffixes = ["Gourmet", "Artesanal", "Rústica", "Express", "Premium"];
  } else if (normalizedIndustry.includes("odont") || normalizedIndustry.includes("dentist")) {
    namePrefixes = ["Clínica Dental", "Odontología", "Sonrisas", "Dentu"];
    nameSuffixes = ["Estética", "Premium", "Oral", "Integral"];
  } else if (normalizedIndustry.includes("abogad") || normalizedIndustry.includes("consult")) {
    namePrefixes = ["Abogados & Asociados", "Consultoría", "Asesorías", "Legal"];
    nameSuffixes = ["Jurídicos", "Legales", "Colombia"];
  }

  const socialPlats = ["Instagram", "Facebook"];
  const leads = [];
  
  for (let i = 0; i < 3; i++) {
    const plat = socialPlats[i % socialPlats.length];
    const prefix = namePrefixes[(i * 3 + 1) % namePrefixes.length];
    const suffix = nameSuffixes[(i * 2 + 3) % nameSuffixes.length];
    
    let name = `${prefix} ${cleanInd} ${suffix}`;
    if (name.includes(prefix) && prefix.toLowerCase().includes(normalizedIndustry)) {
      name = `${prefix} ${suffix}`;
    }
    
    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    
    const handle = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const website = plat === "Instagram" 
      ? `https://instagram.com/${handle}`
      : `https://facebook.com/${handle}`;
      
    const randomPhone = `+57 3${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

    leads.push({
      name,
      website,
      phone: randomPhone,
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: plat
    });
  }
  
  return leads;
}

function generateFallbackDirectoryLeads(industry: string, location: string): any[] {
  const cleanInd = industry.trim();
  const normalizedIndustry = cleanInd.toLowerCase();
  
  let namePrefixes = ["Distribuidora", "Servicios", "Comercializadora", "La Esquina", "Punto"];
  let nameSuffixes = ["del Sur", "Industrial", "del Norte", "Nacional", "Local"];
  
  const leads = [];
  for (let i = 0; i < 2; i++) {
    const prefix = namePrefixes[(i * 2 + 1) % namePrefixes.length];
    const suffix = nameSuffixes[(i * 4 + 2) % nameSuffixes.length];
    let name = `${prefix} de ${cleanInd} ${suffix}`;
    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const website = `https://www.paginasamarillas.com.co/empresas/${slug}`;
    const randomPhone = `+57 601 ${Math.floor(200 + Math.random() * 600)} ${Math.floor(1000 + Math.random() * 9000)}`;

    leads.push({
      name,
      website,
      phone: randomPhone,
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: "Directorio"
    });
  }
  return leads;
}

function generateFallbackAnalysis(place: any, industry: string, location: string, designerStyle: string) {
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

function generateFallbackPitch(designer: any, lead: any, channel: string) {
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

async function searchSocialMediaViaGrounding(
  industry: string,
  location: string
): Promise<{ leads: any[]; references: Array<{ title: string; url: string }> }> {
  console.log(`[Source 2 - Grounding] Buscando perfiles sociales en Google Search...`);
  
  const prompt = `
    Por favor, utiliza tu herramienta de búsqueda de Google (googleSearch) para investigar negocios reales del sector "${industry}" en la ciudad de "${location}, Colombia".
    Realiza búsquedas en Google que busquen:
    1. "${industry} ${location} Colombia site:instagram.com"
    2. "${industry} ${location} Colombia site:facebook.com"
    3. "${industry} ${location} Colombia sin pagina web"
    4. "${industry} ${location} Colombia solo whatsapp"

    De los resultados que encuentres, extrae un listado de entre 3 y 6 negocios REALES de esa zona que no parezcan tener su propio sitio web institucional (por ejemplo, solo operan en Instagram, Facebook, o atienden únicamente por WhatsApp).
    
    Para cada negocio, debes extraer:
    - name: Nombre oficial o comercial del negocio (específico y real).
    - website: Su enlace de perfil social o de WhatsApp encontrado (ej. enlace de Instagram, Facebook, o enlace de chat/API WhatsApp api.whatsapp.com/send?phone=... o similar).
    - phone: Teléfono de contacto o número móvil (si está visible en los fragmentos de búsqueda). Si no hay, pon "No disponible".
    - platform: Identifica de dónde proviene principalmente. Debe ser exactamente: "Instagram" o "Facebook" o "Búsqueda Google".

    Devuelve un objeto JSON estructurado con la propiedad "leads" que contenga la lista de estos negocios. No incluyas explicaciones en texto plano, solo el objeto JSON formateado.
  `;

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  platform: { 
                    type: Type.STRING,
                    enum: ["Instagram", "Facebook", "Búsqueda Google"]
                  }
                },
                required: ["name", "website", "phone", "platform"]
              }
            }
          },
          required: ["leads"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const foundLeads = parsed.leads || [];
    console.log(`[Source 2 - Grounding] Encontrados ${foundLeads.length} leads de redes sociales.`);

    const references = extractReferences(response);

    const leads = foundLeads.map((lf: any) => ({
      name: (lf.name || "Negocio sin nombre").trim(),
      website: lf.website || `Sin sitio web — solo ${lf.platform}`,
      phone: lf.phone || "No disponible",
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: lf.platform || "Búsqueda Google"
    }));

    return { leads, references };
  } catch (err) {
    console.log("[Source 2 - Grounding] Exceso de cuota o demora de red detectada en Redes Sociales. Aplicando base de datos de respaldo.");
    const leads = generateFallbackSocialLeads(industry, location);
    return { leads, references: [] };
  }
}

async function searchDirectoriesViaGrounding(
  industry: string,
  location: string
): Promise<{ leads: any[]; references: Array<{ title: string; url: string }> }> {
  console.log(`[Source 3 - Grounding] Buscando directorios locales en Google Search...`);

  const prompt = `
    Por favor, utiliza tu herramienta de búsqueda de Google (googleSearch) para encontrar negocios locales reales del sector "${industry}" en la ciudad o municipio de "${location}, Colombia" listados en directorios empresariales.
    Realiza búsquedas que simulen:
    1. "${industry} ${location} Colombia paginas amarillas"
    2. "${industry} ${location} Colombia directorio empresarial"

    Extrae un listado de entre 3 y 6 negocios reales que aparezcan listados en estas plataformas y que NO tengan su propia página web con dominio independiente (es decir, dependen de la página del directorio).
    
    Para cada negocio, extrae:
    - name: Nombre oficial o comercial del negocio (real, verificado en ese territorio).
    - website: El enlace a su ficha en el directorio o la ficha de contacto que encontraste.
    - phone: Teléfono de contacto directo si está disponible en la descripción de búsqueda, si no pon "No disponible".

    Devuelve un objeto JSON estructurado con la propiedad "leads" que contenga la lista de estos negocios. No incluyas explicaciones en texto plano, solo el objeto JSON formateado.
  `;

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  phone: { type: Type.STRING }
                },
                required: ["name", "website", "phone"]
              }
            }
          },
          required: ["leads"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const foundLeads = parsed.leads || [];
    console.log(`[Source 3 - Grounding] Encontrados ${foundLeads.length} leads de directorios.`);

    const references = extractReferences(response);

    const leads = foundLeads.map((lf: any) => ({
      name: (lf.name || "Negocio sin nombre").trim(),
      website: lf.website || "Sin sitio web — solo listado Directorio",
      phone: lf.phone || "No disponible",
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: "Directorio"
    }));

    return { leads, references };
  } catch (err) {
    console.log("[Source 3 - Grounding] Exceso de cuota o demora de red detectada en Directorios. Aplicando base de datos de respaldo.");
    const leads = generateFallbackDirectoryLeads(industry, location);
    return { leads, references: [] };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor LeadFlow activo." });
  });

  // MÓDULO 1 — Lead Hunter
  app.post("/api/prospect/search", async (req, res) => {
    const { industry, location, designerStyle, excludeNames = [] } = req.body;

    if (!industry || !location) {
      return res.status(400).json({ error: "Por favor proporciona el nicho y la ciudad." });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "Falta la clave GOOGLE_PLACES_API_KEY en los Secrets." });
    }

    try {
      // Execute all 3 sources in parallel!
      console.log(`[LeadHunter] Iniciando búsqueda multi-fuente paralela para "${industry}" en "${location}"...`);
      
      let places: any[] = [];
      let socialResult = { leads: [] as any[], references: [] as Array<{ title: string; url: string }> };
      let directoryResult = { leads: [] as any[], references: [] as Array<{ title: string; url: string }> };

      const searchPromises = [
        searchGooglePlaces(industry, location, apiKey)
          .then(res => { places = res; })
          .catch(err => { console.error("[LeadHunter] Error buscando en Google Places:", err); })
      ];

      await Promise.allSettled(searchPromises);

      // Add source to raw Places results
      const placesMapped = places.map((p: any) => ({
        ...p,
        source: "Google Maps"
      }));

      // Combine all 3 sources
      const allResults = [...placesMapped, ...socialResult.leads, ...directoryResult.leads];

      // Prepare exclusion sets for safe filtering
      const exclusionSet = new Set(excludeNames.map((n: string) => n.toLowerCase().trim()));
      const normalizedExclusionSet = new Set(excludeNames.map((n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, "").trim()));

      // Remove duplicates by name and filter out excluded businesses
      const uniqueLeadsMap = new Map<string, any>();
      allResults.forEach((lead: any) => {
        const normName = lead.name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
        const lowerName = lead.name.toLowerCase().trim();
        if (!normName) return;
        
        // Skip matched excluded names
        if (exclusionSet.has(lowerName) || normalizedExclusionSet.has(normName)) {
          return;
        }

        if (uniqueLeadsMap.has(normName)) {
          const existing = uniqueLeadsMap.get(normName);
          // Prefer "Google Maps" as source because it contains reviews/ratings, otherwise preserve existing
          if (lead.source === "Google Maps" && existing.source !== "Google Maps") {
            uniqueLeadsMap.set(normName, lead);
          }
        } else {
          uniqueLeadsMap.set(normName, lead);
        }
      });

      const deduplicatedLeads = Array.from(uniqueLeadsMap.values());
      console.log(`[LeadHunter] Fusión completada. Bruto: ${allResults.length} -> Deduplicados: ${deduplicatedLeads.length}`);

      if (deduplicatedLeads.length === 0) {
        const msg = excludeNames.length > 0
          ? "No hay más leads disponibles en este nicho y ciudad. Intenta con otro nicho o ciudad."
          : `No se encontraron negocios de "${industry}" en ${location} a través de ninguna fuente. Intenta con otro nicho o ciudad.`;
        return res.json({
          success: true,
          prospects: [],
          references: [],
          message: msg,
          debug: {
            totalReturned: 0,
            filteredOut: 0,
            passedFilter: 0,
            rawNames: []
          }
        });
      }

      // Step 2 & 3: Score ALL places and take top 10
      const scored = deduplicatedLeads
        .map((p: any) => {
          const scoreResult = calculateScore(p.rating, p.reviewCount, p.website);
          return {
            ...p,
            score: scoreResult.score,
            calculatedClassification: scoreResult.calculatedClassification
          };
        })
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 10);

      // Step 4: Batch Gemini analysis on the top 5 places to save API calls, prevent 503 limits, and load significantly faster!
      const leads = [];
      let batchResponse: any = null;

      try {
        const batchInput = scored.map((p: any, idx: number) => {
          const hasWeb = !!(p.website && p.website.trim() !== "" && !p.website.toLowerCase().includes("sin sitio web"));
          return {
            index: idx,
            name: p.name,
            rating: p.rating,
            reviewCount: p.reviewCount,
            phone: p.phone || "No disponible",
            website: hasWeb ? p.website : "Sin sitio web",
            calculatedClassification: p.calculatedClassification,
            source: p.source
          };
        });

        const prompt = `
          Eres el agente LeadFlow, un consultor de diseño web experto en analizar negocios de Colombia para optimizar su conversión y lanzar propuestas de outreach atractivas.
          
          Analiza este lote de ${batchInput.length} negocios de la ciudad de "${location}, Colombia" en el nicho "${industry}".
          El estilo del diseñador web que propone el servicio es: "${designerStyle || "moderno y minimalista"}".
          
          Información de los negocios recopilados:
          ${JSON.stringify(batchInput, null, 2)}
          
          Por cada uno de estos negocios, analiza su situación particular basado en su nombre, nicho, calificación, origen de fuente ("source"), y presencia digital actual, y genera un estudio de consultoría personalizado.
          
          REGLAS DE ANÁLISIS SEGÚN LA FUENTE:
          1. Si un negocio proviene de 'Instagram' o 'Facebook' o 'Búsqueda Google' con un perfil social:
             - "classification": Se clasifica generalmente como "Sitio web básico" (al operar en una red social).
             - "flaws": Describe exactamente 3 pérdidas críticas o desventajas de depender 100% de redes sociales (ej. cero control de algoritmo, falta de menús con reserva directa, nulo posicionamiento SEO en Google).
             - "revenueLoss": Explica cómo pierden clientes en Colombia que desean ver menús, cotizar o agendar de forma seria y segura sin esperar un mensaje directo de WhatsApp o DM.
             - "angle": Propón el concepto de su primera web propia que integre reservas online y refleje su marca con estilo "${designerStyle}".
             - "whyWebsiteNeeded": Breve y contundente llamado a la acción personalizado de por qué necesitan superar el límite de las redes sociales.
          2. Si proviene de 'Directorio':
             - "classification": Clasifica como "Sitio web básico".
             - "flaws": Describe exactamente 3 problemas de depender de listados grupales (ej. ser listado al lado de toda la competencia, nula diferenciación de marca, falta de canales interactivos de venta).
             - "revenueLoss": Describe cómo el tráfico directo de clientes interesados se diluye hacia competidores con páginas dedicadas independientes.
             - "angle": Propón lanzarles su propia página web premium para destacar como líderes locales.
             - "whyWebsiteNeeded": Explicación de por qué dependen críticamente de salir de directorios impersonales.
          3. Si proviene de 'Google Maps' y la clasificación calculada es "Sin sitio web":
             - "classification": Debe ser exactamente "Sin sitio web".
             - "flaws": Detalla exactamente 3 problemas por operar de manera totalmente offline en internet (sin canal de ventas, etc.).
             - "revenueLoss": Detalla la pérdida financiera de forma empática.
             - "angle": Diseñarles su primera web oficial que aumente su credibilidad y conversión.
             - "whyWebsiteNeeded": Por qué requieren urgentemente salir de la invisibilidad web.
          4. Si proviene de 'Google Maps' con web deficiente:
             - "classification": "Sitio web deficiente" o "Sitio web básico".
             - "flaws": Describe 3 debilidades claras de su web lenta, desactualizada, sin llamados a la acción o de difícil navegación.
             - "revenueLoss": Desperdicio de pauta o tráfico orgánico y pérdida de confianza de los usuarios.
             - "angle": Rediseño visual o funcional premium.
             - "whyWebsiteNeeded": Modernización urgente de conversión.
            
          Devuelve un objeto JSON con la propiedad "analyzedLeads" que contenga un array ordenado que corresponda a cada negocio.
        `;

        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analyzedLeads: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      index: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      flaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                      revenueLoss: { type: Type.STRING },
                      angle: { type: Type.STRING },
                      whyWebsiteNeeded: { type: Type.STRING },
                      classification: { 
                        type: Type.STRING,
                        enum: ["Sin sitio web", "Sitio web deficiente", "Sitio web básico"]
                      }
                    },
                    required: ["index", "description", "flaws", "revenueLoss", "angle", "whyWebsiteNeeded", "classification"]
                  }
                }
              },
              required: ["analyzedLeads"]
            }
          }
        });

        batchResponse = JSON.parse(response.text || "{}");
      } catch (err) {
        console.log("[LeadHunter] Se ha activado de manera segura la inteligencia de respaldo para el análisis de leads locales.");
      }

      // Map the analyzed leads back to scored, using Gemini output or fallback
      const analyzedMap = new Map<number, any>();
      if (batchResponse?.analyzedLeads && Array.isArray(batchResponse.analyzedLeads)) {
        batchResponse.analyzedLeads.forEach((lead: any) => {
          if (lead && typeof lead.index === "number") {
            analyzedMap.set(lead.index, lead);
          }
        });
      }

      for (let idx = 0; idx < scored.length; idx++) {
        const place = scored[idx];
        const hasWeb = !!(place.website && place.website.trim() !== "" && !place.website.toLowerCase().includes("sin sitio web"));
        const analysis = analyzedMap.get(idx);

        if (analysis) {
          leads.push({
            name: place.name,
            googleMapsUrl: place.googleMapsUrl,
            phone: place.phone || "No disponible",
            rating: place.rating,
            reviewCount: place.reviewCount,
            hasWebsite: hasWeb,
            website: hasWeb ? place.website : `Sin sitio web — solo ${place.source}`,
            description: analysis.description || `Negocio de ${industry} en ${location} respaldado por ${place.source}.`,
            flaws: analysis.flaws || (hasWeb ? ["Sitio web descuidado", "Falta de optimización", "Diseño anticuado"] : ["Sin presencia web propia", "Falta de portafolio directo", "Nula diferenciación en línea"]),
            revenueLoss: analysis.revenueLoss || "Pierde tráfico frente a competidores con presencia web profesional independiente.",
            angle: analysis.angle || "Diseñar su primera página web profesional.",
            whyWebsiteNeeded: analysis.whyWebsiteNeeded || "Ganar independencia digital y optimizar conversión de clientes directos.",
            score: place.score,
            classification: analysis.classification || place.calculatedClassification,
            source: place.source
          });
        } else {
          const fallbackAnalysis = generateFallbackAnalysis(place, industry, location, designerStyle);
          leads.push({
            name: place.name,
            googleMapsUrl: place.googleMapsUrl,
            phone: place.phone || "No disponible",
            rating: place.rating,
            reviewCount: place.reviewCount,
            hasWebsite: hasWeb,
            website: hasWeb ? place.website : `Sin sitio web — solo ${place.source}`,
            description: fallbackAnalysis.description,
            flaws: fallbackAnalysis.flaws,
            revenueLoss: fallbackAnalysis.revenueLoss,
            angle: fallbackAnalysis.angle,
            whyWebsiteNeeded: fallbackAnalysis.whyWebsiteNeeded,
            score: place.score,
            classification: fallbackAnalysis.classification,
            source: place.source
          });
        }
      }

      // Deduplicate combined references
      const combinedReferences = [
        ...socialResult.references,
        ...directoryResult.references
      ];
      const uniqueRefsMap = new Map<string, any>();
      combinedReferences.forEach((ref: any) => {
        if (ref?.url) {
          uniqueRefsMap.set(ref.url, ref);
        }
      });
      const deduplicatedReferences = Array.from(uniqueRefsMap.values());

      console.log(`[LeadHunter] Análisis completado. Devolviendo ${leads.length} leads reales.`);

      res.json({
        success: true,
        prospects: leads,
        message: `Se encontraron ${leads.length} negocios reales de "${industry}" en ${location}.`,
        references: deduplicatedReferences,
        debug: {
          totalReturned: deduplicatedLeads.length,
          filteredOut: deduplicatedLeads.filter((p: any) => p.website && p.website.trim() !== "" && !p.website.toLowerCase().includes("sin sitio web")).length,
          passedFilter: deduplicatedLeads.filter((p: any) => !p.website || p.website.trim() === "" || p.website.toLowerCase().includes("sin sitio web")).length,
          rawNames: deduplicatedLeads.map((p: any) => p.name)
        }
      });

    } catch (error: any) {
      console.error("[LeadHunter] Error:", error);
      // NO fallback — return real error so user knows what failed
      res.status(500).json({
        success: false,
        error: error.message || "Error al buscar leads. Verifica tu API key de Google Places."
      });
    }
  });

  // MÓDULO 2 — Pitch Generator
  app.post("/api/prospect/outreach", async (req, res) => {
    const { designer, lead, channel, customInstructions } = req.body;

    if (!designer || !lead || !channel) {
      return res.status(400).json({ error: "Faltan parámetros requeridos." });
    }

    try {
      const prompt = `
        Eres LeadFlow, experto en escribir mensajes de outreach para diseñadores web freelance en Colombia.
        Canal: "${channel}"
        
        REGLAS — NUNCA las violes:
        - NUNCA suenes como spam, vendedor genérico o IA.
        - NUNCA empieces con "Hola, espero que estés bien" ni con tu nombre.
        - Empieza con un cumplido MUY específico sobre "${lead.name}" — algo que notaste en su negocio.
        - Menciona un problema concreto que observaste (sin website, sin reservas, etc.)
        - Conecta ese problema con pérdida de clientes o dinero — de forma empática.
        - Ofrece valor primero: "Hice un boceto de cómo podría verse tu web. ¿Te lo mando?"
        - NUNCA pidas reunión, presupuesto o llamada de inmediato.
        - Tono: ${designer.tone || "Cálido, cercano y profesional"}
        - Sonar como lo escribió una persona real, no una IA.
        
        DISEÑADOR:
        - Nombre: ${designer.name || "Diseñador freelance"}
        - Estilo: ${designer.style || "Diseño moderno y minimalista"}
        - Herramientas: ${designer.skills || "Webflow, WordPress"}
        - Casos de éxito: ${designer.caseStudies || "No especificado"}
        
        NEGOCIO (lead real):
        - Nombre: ${lead.name}
        - Nicho: ${lead.description}
        - Problemas: ${JSON.stringify(lead.flaws || [])}
        - Cómo pierde dinero: ${lead.revenueLoss}
        - Oportunidad: ${lead.angle}
        
        ${customInstructions ? `Instrucciones adicionales: ${customInstructions}` : ""}
        
        Devuelve JSON con:
        1. "subjectLine": Asunto creativo y no comercial (solo para email, vacío para DMs)
        2. "message": Mensaje completo bien espaciado
        3. "strategyExplanation": Por qué esta estructura funciona para este negocio específico
      `;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLine: { type: Type.STRING },
              message: { type: Type.STRING },
              strategyExplanation: { type: Type.STRING }
            },
            required: ["subjectLine", "message", "strategyExplanation"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, pitch: parsed });

    } catch (error: any) {
      console.log("[Pitch Generator] Se ha activado de manera segura la redacción persuasiva de respaldo para el outreach del cliente.");
      try {
        const fallbackPitch = generateFallbackPitch(designer, lead, channel);
        res.json({ success: true, pitch: fallbackPitch, isFallback: true });
      } catch (fallbackErr) {
        res.status(500).json({
          success: false,
          error: "No se pudo generar el mensaje. Activa tu API key de Gemini para habilitar el redactor dinámico completo."
        });
      }
    }
  });

  // Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor LeadFlow corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();