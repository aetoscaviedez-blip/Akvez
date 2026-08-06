// Identidad canónica de la Empresa y del Lead (ADR-12 §7).
//
// Cálculo puro, sin I/O — vive en `domain/` (ADR-04 §10) y no importa nada
// externo a su módulo (R-04).
//
// ADR-12 §7.1 — «La identidad de una Empresa es su **Referencia de Origen**: la
// designación estable que la fuente de descubrimiento asigna al establecimiento
// concreto», compuesta de dos elementos **inseparables**: Fuente y Designación.
// «Dos designaciones idénticas emitidas por fuentes distintas **no** son la misma
// Empresa mientras no se demuestre lo contrario.»
//
// ADR-12 §7.2 — `Lead ≡ (Referencia de Origen de la Empresa, Usuario)`. La
// deduplicación **siempre opera dentro del espacio de un único usuario**, nunca
// entre usuarios.

/**
 * Referencia de Origen: identidad natural de la Empresa.
 *
 * Ambos campos son inseparables (§7.1). `source` **forma parte** de la identidad,
 * no es un metadato.
 */
export interface SourceReference {
  source: string;
  designation: string;
}

/**
 * Identidad de una Empresa descubierta.
 *
 * Exactamente **una** de las dos vías está presente: la Referencia de Origen, o
 * —en su ausencia— la Huella de Identidad. Nunca ambas, nunca ninguna. Es la
 * regla **S-1** de §7.3: la huella «solo se aplica en ausencia de Referencia de
 * Origen. Nunca la sustituye ni prevalece sobre ella».
 */
export type EmpresaIdentity =
  | { kind: "sourceReference"; reference: SourceReference }
  | { kind: "fingerprint"; fingerprint: string };

/** Normaliza texto para comparar sin ruido de mayúsculas, tildes ni puntuación. */
function normalize(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Construye la Huella de Identidad: «los atributos más estables disponibles: la
 * denominación del negocio y su localización geográfica» (§7.3).
 *
 * Devuelve `null` cuando falta la denominación. Sin ella no hay huella posible, y
 * **inventar una sería peor que no tenerla**: la regla **S-3** ordena que, ante la
 * duda, dos registros se traten como Leads distintos, porque «un falso positivo
 * fusiona dos negocios reales y destruye información», mientras que un duplicado
 * «es visible, corregible y reversible».
 */
export function buildIdentityFingerprint(name: string, location: string): string | null {
  const normalizedName = normalize(name);
  if (normalizedName === "") return null;

  const normalizedLocation = normalize(location);
  return normalizedLocation === ""
    ? `name:${normalizedName}`
    : `name:${normalizedName}|loc:${normalizedLocation}`;
}

/**
 * Determina la identidad de una Empresa descubierta.
 *
 * Prioridad estricta impuesta por **S-1**: si la fuente aportó designación
 * estable, ésa es la identidad. La huella es el mecanismo **degradado y
 * expresamente provisional** que solo entra en su ausencia.
 *
 * Devuelve `null` cuando no puede establecerse ninguna identidad. Ese caso **no
 * se resuelve inventando una**: el llamador debe tratar la Empresa como no
 * identificable, y por S-3 eso significa registrarla sin poder reconocerla en
 * descubrimientos futuros — nunca fusionarla con otra por aproximación.
 */
export function resolveEmpresaIdentity(
  discovered: { sourceDesignation?: string; name: string; source: string },
  location: string
): EmpresaIdentity | null {
  const designation = (discovered.sourceDesignation || "").trim();
  const source = (discovered.source || "").trim();

  if (designation !== "" && source !== "") {
    return { kind: "sourceReference", reference: { source, designation } };
  }

  const fingerprint = buildIdentityFingerprint(discovered.name, location);
  return fingerprint === null ? null : { kind: "fingerprint", fingerprint };
}

/**
 * Clave de comparación de una identidad, para deduplicar dentro del espacio de un
 * usuario.
 *
 * La Fuente se incorpora a la clave de la Referencia de Origen porque §7.1 la
 * declara parte inseparable de la identidad: sin ella, dos designaciones iguales
 * de fuentes distintas colisionarían y fusionarían Empresas diferentes.
 */
export function identityKey(identity: EmpresaIdentity): string {
  return identity.kind === "sourceReference"
    ? `ref:${normalize(identity.reference.source)}|${identity.reference.designation.trim()}`
    : `fp:${identity.fingerprint}`;
}
