import { Player } from "@/domain/player";
import { LevelOneState } from "@/store/current-game/difficulty-levels/level-one.store";
import { HistoryLineType } from "@/domain/history";

export enum GameStatus {
  CREATION = "creation",
  IN_GAME = "in game",
  FINISHED = "finished"
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
  levelOne: LevelOneState;
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
  designation: HistoryLineType;
  amount: number;
  shouldDisplayTurnNumber: boolean;
}

export interface AddOperationLinesActionPayload {
  operations: Array<OperationLineActionPayload>;
  shouldHandleEndTurn: boolean;
}
