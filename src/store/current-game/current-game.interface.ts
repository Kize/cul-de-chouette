import { Player } from "@/domain/player";
import { LevelOneState } from "@/store/current-game/difficulty-levels/level-one.store";

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
  score: number;
  previousPlayer?: string;
}
