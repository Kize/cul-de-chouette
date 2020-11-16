import {
  NotImplementedRuleEffectEvent,
  RuleEffectEvent,
} from "../../domain/rules/rule-effect";

export enum GodModLineType {
  GOD_MOD = "Ligne custom",
}

export type AllHistoryLineTypes =
  | RuleEffectEvent
  | NotImplementedRuleEffectEvent
  | GodModLineType;

export interface HistoryLine {
  designation: AllHistoryLineTypes;
  amount: number;
  turnNumber?: number;
}

export interface HistoryLineApply extends HistoryLine {
  playerName: string;
}
