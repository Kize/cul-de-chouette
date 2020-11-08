import { HistoryLineType } from '@/domain/history';

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceRoll = [DieValue, DieValue, DieValue];

export interface Rule {
  isApplicableToDiceRoll: (diceRoll: DiceRoll) => boolean;
  applyRule: (context: GameContext) => RuleEffects | Promise<RuleEffects>;
}

export interface GameContext {
  currentPlayerName: string;
  diceRoll: DiceRoll;
}

export type RuleEffects = Array<RuleEffect>;

export type RuleEffect = { playerName: string } & (
  | { type: RuleEffetType.ADD_GRELOTTINE }
  | { type: RuleEffetType.REMOVE_GRELOTTINE }
  | { type: RuleEffetType.CHANGE_SCORE; score: number, designation: HistoryLineType }
);

export enum RuleEffetType {
  ADD_GRELOTTINE = "addGrelottine",
  REMOVE_GRELOTTINE = "removeGrelottine",
  CHANGE_SCORE = "changeScore",
}
