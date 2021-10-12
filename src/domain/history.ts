import {
  NotImplementedRuleEffectEvent,
  RuleEffectEvent,
} from "../../domain/rules/rule-effect";
import { nanoid } from "nanoid";

export enum GodModLineType {
  GOD_MOD = "Ligne custom",
}

export type AllHistoryLineTypes =
  | RuleEffectEvent
  | NotImplementedRuleEffectEvent
  | GodModLineType;

export interface HistoryLine {
  eventId: string;
  designation: AllHistoryLineTypes;
  amount: number;
}

export interface HistoryLineApply extends HistoryLine {
  playerName: string;
}

export function getNewEventId(): string {
  return nanoid(8);
}
