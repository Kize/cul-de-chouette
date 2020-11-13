import { HistoryLineAction } from "@/domain/history";

export interface SouffletteForm {
  isChallenge: boolean;
  diceThrowsNumber: number;
  challengedPlayer?: string;
  challengedPlayerAction?: HistoryLineAction;
}

export interface SouffletteActionPayload {
  challengerName: string;
  isChallenge: boolean;
  diceThrowsNumber: number;
  challengedPlayer?: string;
  challengedPlayerAction?: HistoryLineAction;
  turnNumber?: number;
}
