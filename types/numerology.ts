export interface NumerologyCalculation {
  value: number;
  rawValue: number;
  calculation: string;
  meaning: string;
}

export interface NumerologyProfileInput {
  fullName: string;
  birthday: string;
}

export interface NumerologyProfile {
  fullName: string;
  birthday: string;
  lifePath: NumerologyCalculation;
  expression: NumerologyCalculation;
  soulUrge: NumerologyCalculation;
  personality: NumerologyCalculation;
  birthdayNumber: NumerologyCalculation;
}

export interface MyAngelNumberProfileInput {
  fullName?: string;
  birthday?: string;
}

export type MyAngelNumberMethod = "birthday" | "name";

export interface MyAngelNumberResult extends NumerologyCalculation {
  method: MyAngelNumberMethod;
  label: string;
  description: string;
}

export interface MyAngelNumberProfile {
  fullName: string;
  birthday: string;
  primary: MyAngelNumberResult | null;
  birthdayResult?: MyAngelNumberResult;
  nameResult?: MyAngelNumberResult;
  results: MyAngelNumberResult[];
}
