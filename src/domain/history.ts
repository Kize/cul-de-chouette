export enum HistoryLineType {
  NEANT = "Néant",
  BEVUE = "Bévue",
  GRELOTTINE_CHALLENGE = "Défi de grelottine",
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  SUITE = "Suite",
  // TODO DAU : Remove chouette velute event
  CHOUETTE_VELUTE = "Chouette velute",
  CHOUETTE_VELUTE_NOT_CLAIMED = "Chouette velute non clammée",
  CUL_DE_CHOUETTE = "Cul de chouette",
  SLOUBI = "Sloubi",
  SOUFFLETTE = "Soufflette",
  SIROP = "Sirotage",
  SIROP_BET_WON = "Pari de Sirotage gagné",
  ATTRAPE_OISEAU = "Attrape-oiseau",
  CHOUETTE_VELUTE_WON = "Chouette velute gagnée",
  CHOUETTE_VELUTE_LOST = "Chouette velute perdue",
  GRELOTTINE_CHALLENGE_WON = "Défi de grelottine gagné",
  GRELOTTINE_CHALLENGE_LOST = "Défi de grelottine perdu",
  ATTRAPE_OISEAU_WON = "Attrape-oiseau gagné",
  ATTRAPE_OISEAU_LOST = "Attrape-oiseau perdu",
  SIROP_BET_LOST = "Pari de Sirotage perdu",
  SIROP_BET_WON_BUT_NOT_CLAIMED = "Pari de Sirotage gagné mais pas clamé",
  SIROP_WON = "Sirop gagné",
  SIROP_LOST = "Sirop perdu",
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
