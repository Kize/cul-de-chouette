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
  SOUFFLETTE = "Soufflette",
  SIROP = "Sirotage",
  SIROP_CHALLENGE = "Pari de Sirotage",
  ATTRAPE_OISEAU = "Attrape-oiseau",
}

export enum NotImplementedHistoryLineType {
  POULETTE = "La poulette",
  CIVET = "Le civet",
  GRAINES = "Graines",
  ARTICHETTE = "Artichette",
  CONTRE_SIROP = "Contre-sirop",
  SIROP_JEANNOT = "Sirop-Jeannot",
  CIVET_DOUBLE = "Civet doublé",
  PASSE_GRELOT = "Passe-grelot",
  RIGODON = "Rigodon",
  CUL_DE_CHOUETTE_DOUBLE = "Cul de chouette doublé",
  BLEU_ROUGE = "Bleu-rouge",
  PELICAN = "Pélican",
  VERDIER = "Verdier",
  ACHAT = "Achat",
  DOUBLE_ACHAT = "Double Achat",
  JARRET = "Jarret",
  FLAN = "Flan",
}

export enum GodModLineType {
  GOD_MOD = "Ligne custom",
}

export type AllHistoryLineTypes =
  | HistoryLineType
  | NotImplementedHistoryLineType
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
    turnNumber: action.turnNumber,
  };
}
