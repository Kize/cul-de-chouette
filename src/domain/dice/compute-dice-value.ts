import { DiceForm } from "@/domain/dice/compute-dice-result";
import { HistoryLineType } from "@/domain/history";

function getChouetteNumber([
  dieIndex1,
  dieIndex2,
  dieIndex3
]: DiceForm): number {
  if (dieIndex1 === dieIndex2 || dieIndex1 === dieIndex3) {
    return dieIndex1 + 1;
  }

  return dieIndex2 + 1;
}

function getVeluteNumber(diceForm: DiceForm): number {
  return [...diceForm].sort().pop()! + 1;
}

function getCulDeChouetteNumber([index1]: DiceForm): number {
  return index1 + 1;
}

export function computeDiceValue(
  diceForm: DiceForm,
  type: HistoryLineType
): number {
  switch (type) {
    case HistoryLineType.CHOUETTE:
      return getChouetteNumber(diceForm);
    case HistoryLineType.VELUTE:
    case HistoryLineType.CHOUETTE_VELUTE:
      return getVeluteNumber(diceForm);
    case HistoryLineType.CUL_DE_CHOUETTE:
      return getCulDeChouetteNumber(diceForm);
    default:
      return 0;
  }
}
