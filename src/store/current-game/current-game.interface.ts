import { Player } from "../../../domain/player";
import { AllHistoryLineTypes } from "@/domain/history";
import { RulesState } from "@/store/current-game/rules.store";

export enum GameStatus {
  CREATION = "creation",
  IN_GAME = "in game",
  FINISHED = "finished",
}

export interface CurrentGameState {
  name: string;
  status: GameStatus;
  events: Array<string>;
  players: Array<Player>;
}

export type Scoreboard = ReadonlyArray<{
  playerName: string;
  score: number;
}>;

export interface SavedCurrentGame extends CurrentGameState {
  rules: RulesState;
}

export interface NewGameForm {
  gameName: string;
  playerNames: Array<string>;
  rules: RulesState;
}

export interface SloubiActionPayload {
  name: string;
  isSloubiCompleted: boolean;
  previousPlayer?: string;
}

export interface OperationLineActionPayload {
  playerName: string;
  designation: AllHistoryLineTypes;
  amount: number;
}

export interface AddOperationLinesActionPayload {
  operations: Array<OperationLineActionPayload>;
  shouldHandleEndTurn: boolean;
}

export const PLAYER_NAMES_LOCAL_STORAGE_KEY = "playerNames";
