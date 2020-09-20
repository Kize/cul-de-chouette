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
  status: GameStatus;
  name: string;
  currentPlayerName?: string;
  players: Array<Player>;
}

export interface SloubiActionPayload {
  name: string;
  score: number;
  previousPlayer?: string;
}
