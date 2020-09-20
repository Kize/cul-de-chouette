export enum HistoryLineType {
  NEANT = "néant",
  BEVUE = "bévue",
  CHOUETTE = "chouette",
  VELUTE = "velute",
  CHOUETTE_VELUTE = "chouette velute",
  CUL_DE_CHOUETTE = "cul de chouette",
  SLOUBI = "Sloubi"
}

export interface HistoryLine {
  designation: HistoryLineType;
  amount: number;
}

export interface HistoryLineApply {
  playerName: string;
  designation: HistoryLineType;
  amount: number;
}

export interface HistoryLineAction {
  playerName: string;
  designation: HistoryLineType;
  value: number;
}

function getAmount(type: HistoryLineType, value: number): number {
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
  }

  throw new Error("Aucune valeur trouvé pour ce type d'action.");
}

export function mapHistoryActionToApply(
  action: HistoryLineAction
): HistoryLineApply {
  const amount = getAmount(action.designation, action.value);
  return {
    amount,
    playerName: action.playerName,
    designation: action.designation
  };
}
