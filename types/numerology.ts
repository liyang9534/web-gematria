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
