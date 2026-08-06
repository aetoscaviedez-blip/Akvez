import { buildIdentityFingerprint } from "./leadIdentity";

/**
 * Deduplica el conjunto descubierto y aplica las exclusiones del usuario.
 *
 * ── CLAVE DE DEDUPLICACIÓN ──────────────────────────────────────────────────
 * **ADR-13 §11.3, regla I-2:** «la idempotencia se apoya **exclusivamente** en la
 * identidad de ADR-12. **No se admite ningún otro mecanismo** de detección de
 * repetición.» Por eso se agrupa por:
 *
 *   1. **Referencia de Origen** `(Fuente, Designación)` cuando la fuente la
 *      aportó — identidad canónica de la Empresa (ADR-12 §7.1).
 *   2. En su ausencia, la **Huella de Identidad** (§7.3), que es precisamente
 *      denominación y localización. No es «otro mecanismo»: es la identidad
 *      subsidiaria que ADR-12 prevé, con el carácter provisional de S-1.
 *
 * La Fuente entra en la clave porque §7.1 la declara parte **inseparable** de la
 * identidad: «dos designaciones idénticas emitidas por fuentes distintas **no**
 * son la misma Empresa mientras no se demuestre lo contrario». Su reconciliación
 * es materia de §9.5, no de esta función.
 *
 * Antes de DEV-05 se agrupaba por nombre normalizado, lo que **fusionaba
 * establecimientos reales que comparten enseña** —dos «Café Central» en barrios
 * distintos colapsaban en uno— y hacía desaparecer Leads. Contravenía la regla
 * **S-3** («ante la duda, no se fusiona», porque el falso positivo «destruye
 * información» mientras el duplicado «es visible, corregible y reversible») y
 * R-44.
 *
 * ── EXCLUSIONES ─────────────────────────────────────────────────────────────
 * `excludeNames` **no es un filtro de dominio**: son las Empresas que el usuario
 * ya tiene en pantalla, y existe para que «Buscar más» no repita lo ya mostrado.
 * No determina qué Leads existen ni retira nada de la Biblioteca (R-42 · R-44).
 */
export function deduplicateLeads(allResults: any[], excludeNames: string[]): any[] {
  const exclusionSet = new Set(excludeNames.map((n: string) => n.toLowerCase().trim()));
  const normalizedExclusionSet = new Set(
    excludeNames.map((n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, "").trim())
  );

  const uniqueLeadsMap = new Map<string, any>();
  // Empresas sin identidad determinable: no se agrupan con nada. S-3 obliga a
  // tratarlas como distintas antes que fusionarlas por aproximación.
  const unidentifiable: any[] = [];

  allResults.forEach((lead: any) => {
    const name = String(lead.name || "");
    const normName = name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const lowerName = name.toLowerCase().trim();
    if (!normName) return;

    if (exclusionSet.has(lowerName) || normalizedExclusionSet.has(normName)) {
      return;
    }

    const designation = String(lead.sourceDesignation || "").trim();
    const source = String(lead.source || "").trim();

    let key: string | null;
    if (designation !== "" && source !== "") {
      key = `ref:${source.toLowerCase()}|${designation}`;
    } else {
      // Huella de Identidad (§7.3). La localización no viaja en el candidato, de
      // modo que la huella se construye con la denominación disponible: es el
      // grado máximo de certeza alcanzable aquí, y S-1 declara su provisionalidad.
      const fingerprint = buildIdentityFingerprint(name, "");
      key = fingerprint === null ? null : `fp:${source.toLowerCase()}|${fingerprint}`;
    }

    if (key === null) {
      unidentifiable.push(lead);
      return;
    }

    const existing = uniqueLeadsMap.get(key);
    if (existing === undefined) {
      uniqueLeadsMap.set(key, lead);
      return;
    }

    // Misma identidad hallada dos veces: se conserva la variante con más
    // información comercial. «Google Maps» aporta calificación y reseñas que las
    // demás fuentes no traen.
    if (lead.source === "Google Maps" && existing.source !== "Google Maps") {
      uniqueLeadsMap.set(key, lead);
    }
  });

  return [...uniqueLeadsMap.values(), ...unidentifiable];
}
