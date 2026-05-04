export type AngelNumberCategory =
  | "single"
  | "double"
  | "triple"
  | "quad"
  | "mirror"
  | "sequence"
  | "special";

export type AngelNumberMeaningKey =
  | "love"
  | "career"
  | "money"
  | "spiritual"
  | "health"
  | "twinFlame";

export interface AngelNumberMeaningSet {
  love: string;
  career: string;
  money: string;
  spiritual: string;
  health: string;
  twinFlame: string;
}

export interface AngelNumberGematriaValues {
  hebrew: number;
  english: number;
  simple: number;
  jewish: number;
  reduction: number;
}

export interface AngelNumberNumerology {
  rootNumber: number;
  rootMeaning: string;
  calculation: string;
}

export interface AngelNumberReference {
  verse: string;
  text: string;
  relevance: string;
}

export interface AngelNumberFAQ {
  question: string;
  answer: string;
}

export interface AngelNumberMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface AngelNumber {
  number: string;
  slug: string;
  title: string;
  shortMeaning: string;
  summary: string;
  meanings: AngelNumberMeaningSet;
  gematriaValues: AngelNumberGematriaValues;
  numerology: AngelNumberNumerology;
  biblicalReferences: AngelNumberReference[];
  affirmation: string;
  relatedNumbers: string[];
  faqs: AngelNumberFAQ[];
  meta: AngelNumberMeta;
  category: AngelNumberCategory;
  isPriority: boolean;
  lastUpdated: string;
}

export type CuratedAngelNumber = AngelNumber;

export type AngelNumberPatternKind =
  | "single"
  | "repeat"
  | "mirror"
  | "sequence"
  | "special"
  | "general";

export interface AngelNumberPattern {
  kind: AngelNumberPatternKind;
  label: string;
  description: string;
}

export interface AngelNumberSeoPolicy {
  shouldIndex: boolean;
  reason: string;
}

export interface GeneratedAngelNumberReading extends AngelNumber {
  source: "generated";
  pattern: AngelNumberPattern;
  seo: AngelNumberSeoPolicy;
}

export interface CuratedAngelNumberReading extends AngelNumber {
  source: "curated";
  pattern: AngelNumberPattern;
  seo: AngelNumberSeoPolicy;
}

export type AngelNumberReading =
  | CuratedAngelNumberReading
  | GeneratedAngelNumberReading;
