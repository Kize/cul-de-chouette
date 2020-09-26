import { Player } from "@/domain/player";

export enum GameStatus {
  CREATION = "creation",
  IN_GAME = "in game",
  FINISHED = "finished"
}

export interface StartGameData {
  gameName: string;
  playerNames: Array<string>;
}

export interface CurrentGameState {
  name: string;
  status: GameStatus;
  players: Array<Player>;
  currentPlayerName: string;
  turnNumber: number;
}

export interface SloubiActionPayload {
  name: string;
  score: number;
  previousPlayer?: string;
}
