
export type Gender = 'male' | 'female';

export interface ChallengeResult {
  position: string;   // 体位
  target: string;     // 重点
  prop: string;       // 手段
  intensity: string;  // 强度
  rule: string;       // 铁律
}

export interface Option {
  id: string;
  label: string;
  color: string;
}

export interface GenderedOptions {
  male: Option[];
  female: Option[];
}

export interface GameSettings {
  maleLeadTasks: string[];
  femaleLeadTasks: string[];
  commonTasks: string[];
  chanceCards: string[];
  fateCards: string[];
}
