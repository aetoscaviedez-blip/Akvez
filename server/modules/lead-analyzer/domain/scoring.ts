export function calculateScore(rating: number, reviewCount: number, website: string): { score: number; calculatedClassification: 'Sin sitio web' | 'Sitio web básico' | 'Sitio web deficiente' } {
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
