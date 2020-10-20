import { DiceForm } from "@/domain/dice/compute-dice-result";
import { HistoryLineType } from "@/domain/history";

function getChouetteNumber([
  dieValue1,
  dieValue2,
  dieValue3
]: DiceForm): number {
  if (dieValue1 === dieValue2 || dieValue1 === dieValue3) {
    return dieValue1;
  }

  return dieValue2;
}

function getVeluteNumber(diceForm: DiceForm): number {
  return [...diceForm].sort().pop()!;
}

function getCulDeChouetteNumber([firstValue]: DiceForm): number {
  return firstValue;
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
