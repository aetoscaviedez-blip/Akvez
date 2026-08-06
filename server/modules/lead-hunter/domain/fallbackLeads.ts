// [CÓDIGO MUERTO — no invocado en el flujo actual, preservado tal cual por decisión del Sprint 8]
// Generadores de leads sintéticos usados como fallback de las fuentes de grounding social/directorio,
// que a su vez tampoco se invocan hoy (ver infrastructure/groundingSearchAdapter.ts).

export function generateFallbackSocialLeads(industry: string, location: string): any[] {
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

export function generateFallbackDirectoryLeads(industry: string, location: string): any[] {
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
