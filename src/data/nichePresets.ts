import { NichePreset } from "../types";

export const NICHE_PRESETS: NichePreset[] = [
  {
    id: "cafeterias-restaurantes",
    industry: "Cafeterías y Restaurantes",
    suggestedAesthetic: "Fotografía cálida y apetitosa, diseño editorial minimalista, colores tierra y neutros que transmitan sabor y experiencia.",
    commonPainPoints: [
      "Menú en PDF estático que no carga bien en celular",
      "Sin sistema de reservas online — el cliente tiene que llamar",
      "Diseño desactualizado que no refleja la calidad del lugar"
    ],
    recommendedAngle: "Reemplazar el menú PDF por uno interactivo y móvil, agregar reservas en línea y destacar la experiencia visual del lugar para atraer más comensales.",
    sampleKeywords: ["Restaurante", "Cafetería", "Brunch", "Comida colombiana"]
  },
  {
    id: "medicos-esteticos",
    industry: "Médicos Estéticos y Clínicas de Belleza",
    suggestedAesthetic: "Diseño limpio y premium, colores blancos y dorados, fotografía de resultados reales, transmite confianza y lujo accesible.",
    commonPainPoints: [
      "No muestra resultados antes/después ni testimonios de pacientes",
      "Sin formulario de cita online — pierden pacientes que no quieren llamar",
      "Diseño genérico que no diferencia la clínica de la competencia"
    ],
    recommendedAngle: "Crear una presencia digital que transmita confianza médica y lujo, con galería de resultados, citas online y testimonios verificados que conviertan visitantes en pacientes.",
    sampleKeywords: ["Medicina estética", "Clínica de belleza", "Botox", "Rellenos", "Rejuvenecimiento"]
  },
  {
    id: "odontologos",
    industry: "Odontólogos y Clínicas Dentales",
    suggestedAesthetic: "Diseño fresco y confiable, azules y blancos, fotografía de sonrisas reales, sensación de higiene y profesionalismo.",
    commonPainPoints: [
      "Sin botón de WhatsApp visible ni formulario de cita rápida",
      "No tiene galería de tratamientos ni casos de éxito",
      "Diseño desactualizado que genera desconfianza en el paciente"
    ],
    recommendedAngle: "Implementar citas online, WhatsApp directo desde el hero, y galería de transformaciones dentales para reducir la fricción y aumentar consultas.",
    sampleKeywords: ["Odontólogo", "Clínica dental", "Ortodoncia", "Blanqueamiento dental"]
  },
  {
    id: "medicos-generales",
    industry: "Médicos y Clínicas de Salud",
    suggestedAesthetic: "Diseño accesible y humano, colores verdes y azules suaves, tipografía clara, transmite cuidado y confianza.",
    commonPainPoints: [
      "Sin sistema de agendamiento de citas online",
      "Información de servicios difícil de encontrar en móvil",
      "No tiene sección de preguntas frecuentes ni información clara de precios"
    ],
    recommendedAngle: "Simplificar el acceso a citas, mostrar los servicios claramente y crear una experiencia digital que reduzca la ansiedad del paciente antes de llegar al consultorio.",
    sampleKeywords: ["Médico general", "Clínica de salud", "Pediatra", "Medicina familiar"]
  },
  {
    id: "abogados",
    industry: "Abogados y Firmas Jurídicas",
    suggestedAesthetic: "Diseño elegante y autoritario, colores oscuros y dorados, tipografía serif, transmite experiencia y seriedad profesional.",
    commonPainPoints: [
      "Texto denso e ilegible que hace difícil entender sus servicios",
      "Sin formulario de consulta inicial gratuita — barrera de entrada alta",
      "Diseño genérico que no diferencia su especialidad jurídica"
    ],
    recommendedAngle: "Posicionar su expertise con un diseño de autoridad, casos de éxito destacados y una consulta inicial online sin fricción que convierta visitantes en clientes.",
    sampleKeywords: ["Abogado", "Firma jurídica", "Derecho laboral", "Derecho de familia", "Abogado penalista"]
  },
  {
    id: "contadores",
    industry: "Contadores y Firmas Contables",
    suggestedAesthetic: "Diseño profesional y ordenado, azules corporativos, iconografía clara, transmite precisión y confianza financiera.",
    commonPainPoints: [
      "Sin descripción clara de servicios y precios",
      "No tiene formulario de contacto ni cotización online",
      "Diseño aburrido que no comunica el valor de su trabajo"
    ],
    recommendedAngle: "Crear una presencia digital que comunique claramente el valor de sus servicios contables, con cotización online y casos de ahorro fiscal para atraer empresas y emprendedores.",
    sampleKeywords: ["Contador", "Firma contable", "Contaduría", "Declaración de renta", "Revisoría fiscal"]
  },
  {
    id: "fotografos",
    industry: "Fotógrafos Profesionales",
    suggestedAesthetic: "Portafolio visual impactante, diseño minimal que no compite con las fotos, fondos negros o blancos, galería inmersiva.",
    commonPainPoints: [
      "Portafolio en Instagram sin sitio web propio — falta de profesionalismo",
      "Sin sistema de cotización o agendamiento de sesiones online",
      "Galería lenta que no carga bien en móvil"
    ],
    recommendedAngle: "Crear un portafolio web inmersivo con galería optimizada, formulario de cotización por tipo de sesión y blog que mejore su posicionamiento en Google.",
    sampleKeywords: ["Fotógrafo de bodas", "Fotografía comercial", "Fotógrafo de eventos", "Fotografía de producto"]
  },
  {
    id: "eventos",
    industry: "Organizadores de Eventos y Bodas",
    suggestedAesthetic: "Diseño elegante y emocional, fotografía de eventos reales, colores suaves y románticos o vibrantes según el nicho.",
    commonPainPoints: [
      "Sin galería de eventos realizados que inspire confianza",
      "No tiene formulario de cotización detallado por tipo de evento",
      "Diseño genérico que no refleja la personalidad de la empresa"
    ],
    recommendedAngle: "Mostrar el trabajo real con galerías impactantes, testimonios de clientes felices y un proceso claro de contratación que convierta visitas en consultas.",
    sampleKeywords: ["Organizador de bodas", "Planner de eventos", "Decoración de eventos", "Bodas en Colombia"]
  },
  {
    id: "coaches",
    industry: "Coaches y Consultores",
    suggestedAesthetic: "Diseño inspirador y personal, fotografía auténtica del coach, colores cálidos o vibrantes, transmite transformación y energía.",
    commonPainPoints: [
      "Sin página de ventas clara para sus programas o servicios",
      "No tiene testimonios ni casos de éxito visibles",
      "Diseño poco profesional que no genera confianza suficiente para comprar"
    ],
    recommendedAngle: "Crear una landing page de alta conversión que cuente la historia del coach, muestre transformaciones reales y tenga un CTA claro para agendar una sesión gratuita.",
    sampleKeywords: ["Coach de vida", "Coach de negocios", "Consultor empresarial", "Coach de liderazgo"]
  },
  {
    id: "gimnasios",
    industry: "Gimnasios y Entrenadores Personales",
    suggestedAesthetic: "Diseño energético y motivador, fotografía de acción, colores vibrantes o dark con neón, transmite fuerza y transformación.",
    commonPainPoints: [
      "Sin sistema de agendamiento de clases online",
      "No muestra precios ni planes de membresía claramente",
      "Diseño desactualizado que no motiva al visitante a unirse"
    ],
    recommendedAngle: "Simplificar la inscripción a clases, mostrar testimonios de transformación y crear una página de membresías clara que convierta visitantes en socios.",
    sampleKeywords: ["Gimnasio", "Entrenador personal", "CrossFit", "Yoga", "Pilates"]
  },
  {
    id: "inmobiliarias",
    industry: "Inmobiliarias y Constructoras",
    suggestedAesthetic: "Diseño premium y espacioso, fotografía arquitectónica de alta calidad, colores oscuros elegantes o blancos minimalistas.",
    commonPainPoints: [
      "Portafolio de propiedades lento con fotos sin optimizar",
      "Sin filtros de búsqueda o cotizador online de proyectos",
      "Diseño genérico igual al de todas las inmobiliarias"
    ],
    recommendedAngle: "Crear una experiencia de búsqueda de propiedades fluida, con galerías inmersivas y formularios de interés que capturen leads calificados automáticamente.",
    sampleKeywords: ["Inmobiliaria", "Constructora", "Venta de apartamentos", "Proyectos de vivienda"]
  },
  {
    id: "spas-estetica",
    industry: "Spas y Centros de Estética",
    suggestedAesthetic: "Diseño relajante y lujoso, fotografía de ambiente cálido, colores tierra y dorados, transmite bienestar y exclusividad.",
    commonPainPoints: [
      "Sin sistema de reservas de servicios online",
      "No muestra el menú de tratamientos con precios claros",
      "Diseño que no transmite la experiencia sensorial del lugar"
    ],
    recommendedAngle: "Crear una experiencia digital que se sienta tan relajante como el spa mismo, con reservas online, menú de servicios visual y gift cards digitales.",
    sampleKeywords: ["Spa", "Centro de estética", "Masajes", "Tratamientos faciales", "Belleza"]
  }
];
