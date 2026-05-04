export type GematriaSystem =
  | "hebrewStandard"
  | "englishOrdinal"
  | "englishGematria"
  | "simple"
  | "jewish"
  | "fullReduction"
  | "reverseOrdinal"
  | "pythagorean";

export interface GematriaLetterValue {
  letter: string;
  values: Record<GematriaSystem, number>;
}

export interface GematriaResult {
  input: string;
  normalizedInput: string;
  values: Record<GematriaSystem, number>;
  letterBreakdown: GematriaLetterValue[];
}

export interface GematriaMatch {
  term: string;
  system: GematriaSystem;
  value: number;
  description: string;
}
