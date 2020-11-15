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

export type HistoryLineAction =
  | BasicHistoryLineAction
  | ChouetteVeluteHistoryLineAction
  | SuiteHistoryLineAction;

export interface BasicHistoryLineAction {
  designation: RuleEffectEvent;
  playerName: string;
  value: number;
  turnNumber?: number;
}

export interface ChouetteVeluteHistoryLineAction {
  designation:
    | RuleEffectEvent.CHOUETTE_VELUTE_WON
    | RuleEffectEvent.CHOUETTE_VELUTE_LOST;
  playerName: string;
  value: number;
  shoutingPlayers: Array<string>;
  turnNumber?: number;
}

export interface SuiteHistoryLineAction {
  designation: RuleEffectEvent.SUITE;
  playerName: string;
  multiplier: number;
  loosingPlayerName: string;
  isVelute: boolean;
  turnNumber?: number;
}

// TODO DAU : Remove this after refactoring the bevue
export function getAmount(type: RuleEffectEvent, value: number): number {
  switch (type) {
    case RuleEffectEvent.NEANT:
      return 0;
    case RuleEffectEvent.BEVUE:
      return -5;
    case RuleEffectEvent.CHOUETTE:
      return value ** 2;
    case RuleEffectEvent.VELUTE:
    case RuleEffectEvent.CHOUETTE_VELUTE_WON:
    case RuleEffectEvent.CHOUETTE_VELUTE_LOST:
    case RuleEffectEvent.CHOUETTE_VELUTE_STOLEN:
      return 2 * value ** 2;
    case RuleEffectEvent.CUL_DE_CHOUETTE:
      return 40 + 10 * value;
    case RuleEffectEvent.SUITE:
      return -value;
    case RuleEffectEvent.SOUFFLETTE:
      return value;
  }

  throw new Error("Aucune valeur trouvé pour ce type d'action.");
}

export function mapHistoryActionToApply(
  action: BasicHistoryLineAction
): HistoryLineApply {
  const amount = getAmount(action.designation, action.value);
  return {
    amount,
    playerName: action.playerName,
    designation: action.designation,
    turnNumber: action.turnNumber,
  };
}
