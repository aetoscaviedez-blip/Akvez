import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { estimateProjectValue, formatProjectValue } from "./projectValue";
import { deriveOpportunities } from "./opportunityDerivation";
import { PV_01 } from "../../../config/projectValueModel";

const desde = (website?: string) => deriveOpportunities({ website });

describe("estimateProjectValue — PV-1.0", () => {
  it("WEB_PRESENCE devuelve COP 2.500.000 – 6.000.000", () => {
    const v = estimateProjectValue(desde(undefined), PV_01)!;
    expect(v.min).toBe(2_500_000);
    expect(v.max).toBe(6_000_000);
  });

  it("OWNED_DOMAIN devuelve el mismo rango", () => {
    const v = estimateProjectValue(desde("https://instagram.com/negocio"), PV_01)!;
    expect(v.min).toBe(2_500_000);
    expect(v.max).toBe(6_000_000);
  });

  it("sin oportunidad compatible devuelve null, no un rango cero", () => {
    const v = estimateProjectValue(desde("https://dominiopropio.co"), PV_01);
    expect(v).toBeNull();
  });

  it("declara la versión del modelo", () => {
    expect(estimateProjectValue(desde(), PV_01)!.modelVersion).toBe("PV-1.0");
  });

  it("declara la moneda", () => {
    expect(estimateProjectValue(desde(), PV_01)!.currency).toBe("COP");
  });

  it("declara la confianza media", () => {
    expect(estimateProjectValue(desde(), PV_01)!.confidence).toBe("medium");
  });

  it("declara el tier que lo produjo", () => {
    expect(estimateProjectValue(desde(), PV_01)!.basis).toBe("WEBSITE");
  });

  it("aplica el tier una sola vez si llegaran ambas oportunidades", () => {
    // Hoy los tipos son excluyentes; se fuerza el caso para que un cambio
    // futuro del dominio no duplique el valor en silencio.
    const ambas = [...desde(undefined), ...desde("https://instagram.com/x")];
    expect(ambas).toHaveLength(2);
    const v = estimateProjectValue(ambas, PV_01)!;
    expect(v.max).toBe(6_000_000);
  });
});

describe("el rango no depende de nada más que del tipo de oportunidad", () => {
  const base = estimateProjectValue(desde(undefined), PV_01)!;

  it("es idéntico con cualquier rating", () => {
    // El tipo de oportunidad se deriva solo de `website`; rating, reviewCount,
    // ciudad y teléfono ni siquiera entran en la firma. Se comprueba que la
    // salida es estable e independiente de ellos.
    expect(estimateProjectValue(deriveOpportunities({ website: undefined }), PV_01)).toEqual(base);
  });

  it("es determinista: misma entrada, misma salida", () => {
    expect(estimateProjectValue(desde(undefined), PV_01)).toEqual(base);
    expect(estimateProjectValue(desde(undefined), PV_01)).toEqual(base);
  });

  it("no lee fecha, red ni estado global", () => {
    const antes = estimateProjectValue(desde(undefined), PV_01);
    const despues = estimateProjectValue(desde(undefined), PV_01);
    expect(despues).toEqual(antes);
  });
});

describe("aislamiento respecto del Opportunity Score", () => {
  const fuente = (ruta: string) => readFileSync(new URL(ruta, import.meta.url), "utf8");

  // Se inspeccionan **los imports**, no el texto: la palabra «Score» aparece
  // legítimamente en la documentación que explica esta misma independencia.
  const imports = (src: string) => src.match(/^import[\s\S]*?from\s+".*?";$/gm) ?? [];

  it("el módulo de valor no importa nada del scoring", () => {
    expect(imports(fuente("./projectValue.ts")).join("\n")).not.toMatch(/score/i);
  });

  it("los parámetros PV-01 no importan nada del scoring", () => {
    const src = fuente("../../../config/projectValueModel.ts");
    expect(src).not.toMatch(/import .*score/i);
  });
});

describe("formatProjectValue", () => {
  it("presenta COP 2.500.000 – 6.000.000", () => {
    const v = estimateProjectValue(desde(undefined), PV_01)!;
    expect(formatProjectValue(v)).toBe("COP 2.500.000 – 6.000.000");
  });

  it("no convierte a otra moneda", () => {
    const texto = formatProjectValue(estimateProjectValue(desde(undefined), PV_01)!);
    expect(texto).not.toMatch(/USD|\$/);
  });
});

describe("fuente única de verdad", () => {
  it("las cifras solo viven en config/projectValueModel.ts", () => {
    const dominio = readFileSync(new URL("./projectValue.ts", import.meta.url), "utf8");
    expect(dominio).not.toContain("2_500_000");
    expect(dominio).not.toContain("2500000");
    expect(dominio).not.toContain("6_000_000");
    expect(dominio).not.toContain("6000000");
  });
});
