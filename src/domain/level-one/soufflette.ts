import { HistoryLineAction } from "@/domain/history";
import { GrelottineChallenges } from "@/domain/grelottine";

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

export interface GrelottineSouffletteActionPayload {
  challenge: GrelottineChallenges;
  grelottin: string;
  challengedPlayer: string;
  challengedPlayerActionPayload: SouffletteActionPayload;
  gambledAmount: number;
}
