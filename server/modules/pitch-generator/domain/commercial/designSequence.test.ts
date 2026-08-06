import { describe, expect, it } from "vitest";
import { Channel } from "./channel";
import { designSequence, SEQUENCE_MOMENTS } from "./designSequence";

// Verifica APS-18 §9.2 (los seis momentos y su orden) y APS-20 §7 (qué canal
// transporta cada momento, con CM-1 y CM-2).

const EMAIL: Channel[] = ["Email frío"];
const LINKEDIN: Channel[] = ["LinkedIn Connection Note"];
const INSTAGRAM: Channel[] = ["Instagram DM"];

describe("designSequence — momentos y orden (APS-18 §9.2)", () => {
  it("los seis momentos son los canónicos, en su orden", () => {
    expect(SEQUENCE_MOMENTS).toEqual([
      "Reconocimiento",
      "Evidencia",
      "Demostración",
      "Oferta",
      "Seguimiento",
      "Reactivación"
    ]);
  });

  it("con correo, el plan contiene los seis en orden", () => {
    // El correo transporta todos los momentos (APS-20 §7).
    expect(designSequence(EMAIL).map((p) => p.moment)).toEqual(SEQUENCE_MOMENTS);
  });

  it("es determinista: la misma entrada produce el mismo plan", () => {
    expect(designSequence(EMAIL)).toEqual(designSequence(EMAIL));
  });

  it("el orden no depende del orden de los canales recibidos", () => {
    const a = designSequence(["Instagram DM", "Email frío"]);
    const b = designSequence(["Email frío", "Instagram DM"]);
    expect(a.map((p) => p.moment)).toEqual(b.map((p) => p.moment));
  });
});

describe("designSequence — CE-1: solo momentos que el canal admite", () => {
  it("CM-2 — sin correo no hay Oferta", () => {
    const moments = designSequence(INSTAGRAM).map((p) => p.moment);
    expect(moments).not.toContain("Oferta");
    // La secuencia «termina antes», y es un resultado válido (APS-20 CE-1).
    expect(moments).toEqual([
      "Reconocimiento",
      "Evidencia",
      "Demostración",
      "Seguimiento",
      "Reactivación"
    ]);
  });

  it("CM-1 — la nota de LinkedIn solo transporta el Reconocimiento", () => {
    expect(designSequence(LINKEDIN).map((p) => p.moment)).toEqual(["Reconocimiento"]);
  });

  it("los canales se combinan: LinkedIn + correo alcanza los seis", () => {
    const moments = designSequence(["LinkedIn Connection Note", "Email frío"]).map((p) => p.moment);
    expect(moments).toEqual(SEQUENCE_MOMENTS);
  });

  it("sin canales alcanzables no hay plan", () => {
    expect(designSequence([])).toEqual([]);
  });
});

describe("designSequence — lo que NO decide", () => {
  it("ningún momento lleva estrategia (SC-R1)", () => {
    // La estrategia se decide contacto a contacto, antes de usarlo, y es
    // competencia de una fase posterior. Ausente es ausente (R-38).
    for (const planned of designSequence(EMAIL)) {
      expect(Object.prototype.hasOwnProperty.call(planned, "strategy")).toBe(false);
    }
  });

  it("ningún momento asigna canal", () => {
    // El canal es contenido de la Commercial Strategy (APS-18 §8.1) y cambiarlo
    // entre momentos es decisión de estrategia (CM-3), no del plan.
    for (const planned of designSequence(EMAIL)) {
      expect(Object.prototype.hasOwnProperty.call(planned, "channel")).toBe(false);
    }
  });

  it("ningún momento nace con propuestas ni resultado declarado", () => {
    for (const planned of designSequence(EMAIL)) {
      expect(planned.proposals).toEqual([]);
      // Sin ContactEvent la secuencia no avanza (CE-I2).
      expect(Object.prototype.hasOwnProperty.call(planned, "declaredOutcome")).toBe(false);
    }
  });
});
