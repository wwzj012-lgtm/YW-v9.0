
export type Gender = 'male' | 'female';

export interface ChallengeResult {
  position: string;   // 浣撲綅
  target: string;     // 閲嶇偣
  prop: string;       // 鎵嬫
  intensity: string;  // 寮哄害
  rule: string;       // 閾佸緥
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
