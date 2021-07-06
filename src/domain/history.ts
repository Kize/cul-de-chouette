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
  turnId: string;
  turnNumber?: number;
}

export interface HistoryLineApply extends HistoryLine {
  playerName: string;
}

export function getTurnId(
  turnNumber: number,
  currentPlayerName: string
): string {
  return `${turnNumber}--${currentPlayerName}`;
}
