import { HistoryLineType } from "@/domain/history";

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

export enum RuleEffetType {
  ADD_GRELOTTINE = "addGrelottine",
  REMOVE_GRELOTTINE = "removeGrelottine",
  CHANGE_SCORE = "changeScore",
}

type CommonRuleEffect = { playerName: string };

type SpecificRuleEffect<T> = CommonRuleEffect & T;

export type ChangeScoreRuleEffect = SpecificRuleEffect<{
  type: RuleEffetType.CHANGE_SCORE;
  score: number;
  designation: HistoryLineType;
}>;
export type AddGrelottineRuleEffect = SpecificRuleEffect<{
  type: RuleEffetType.ADD_GRELOTTINE;
}>;

export type RemoveGrelottineRuleEffect = SpecificRuleEffect<{
  type: RuleEffetType.REMOVE_GRELOTTINE;
}>;

export type RuleEffect =
  | ChangeScoreRuleEffect
  | AddGrelottineRuleEffect
  | RemoveGrelottineRuleEffect;

export type RuleEffects = Array<RuleEffect>;
