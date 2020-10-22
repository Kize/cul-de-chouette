import { Player } from "@/domain/player";
import { AllHistoryLineTypes } from "@/domain/history";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";

export enum GameStatus {
  CREATION = "creation",
  IN_GAME = "in game",
  FINISHED = "finished",
}

export interface CurrentGameState {
  name: string;
  status: GameStatus;
  players: Array<Player>;
  currentPlayerName: string;
  turnNumber: number;
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
  levelOne: {
    isSouffletteEnabled: boolean;
  };
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
  shouldDisplayTurnNumber: boolean;
}

export interface AddOperationLinesActionPayload {
  operations: Array<OperationLineActionPayload>;
  shouldHandleEndTurn: boolean;
}
