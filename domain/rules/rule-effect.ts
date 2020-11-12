import { HistoryLineType } from "@/domain/history";

export type RuleEffects = Array<RuleEffect>;

export type RuleEffect =
  | ChangeScoreRuleEffect
  | AddGrelottineRuleEffect
  | RemoveGrelottineRuleEffect;

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

export enum RuleEffetType {
  ADD_GRELOTTINE = "addGrelottine",
  REMOVE_GRELOTTINE = "removeGrelottine",
  CHANGE_SCORE = "changeScore",
}

type SpecificRuleEffect<T> = CommonRuleEffect & T;
type CommonRuleEffect = { playerName: string };
