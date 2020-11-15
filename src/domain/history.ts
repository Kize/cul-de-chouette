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
