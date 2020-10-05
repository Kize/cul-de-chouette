export enum HistoryLineType {
  NEANT = "Néant",
  BEVUE = "Bévue",
  GRELOTTINE_CHALLENGE = "Défi de grelottine",
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  SUITE = "Suite",
  CHOUETTE_VELUTE = "Chouette velute",
  CUL_DE_CHOUETTE = "Cul de chouette",
  SLOUBI = "Sloubi",
  SOUFFLETTE = "Soufflette"
}

export interface HistoryLine {
  designation: HistoryLineType;
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
  designation: HistoryLineType;
  playerName: string;
  value: number;
  turnNumber?: number;
}

export interface ChouetteVeluteHistoryLineAction {
  designation: HistoryLineType.CHOUETTE_VELUTE;
  playerName: string;
  value: number;
  shoutingPlayers: Array<string>;
  turnNumber?: number;
}

export interface SuiteHistoryLineAction {
  designation: HistoryLineType.SUITE;
  playerName: string;
  multiplier: number;
  loosingPlayerName: string;
  isVelute: boolean;
  turnNumber?: number;
}

export function getAmount(type: HistoryLineType, value: number): number {
  switch (type) {
    case HistoryLineType.NEANT:
      return 0;
    case HistoryLineType.BEVUE:
      return -5;
    case HistoryLineType.CHOUETTE:
      return value ** 2;
    case HistoryLineType.VELUTE:
    case HistoryLineType.CHOUETTE_VELUTE:
      return 2 * value ** 2;
    case HistoryLineType.CUL_DE_CHOUETTE:
      return 40 + 10 * value;
    case HistoryLineType.SUITE:
      return -value;
    case HistoryLineType.SOUFFLETTE:
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
    turnNumber: action.turnNumber
  };
}
