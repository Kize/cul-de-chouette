import { HistoryLineType } from "@/domain/history";

export type DiceForm = [number, number, number];

export function isDiceFormValid(diceForm: DiceForm): boolean {
  return diceForm.every(
    dieValueIndex => dieValueIndex >= 0 && dieValueIndex < 7
  );
}

function isChouette([dieIndex1, dieIndex2, dieIndex3]: DiceForm): boolean {
  return (
    dieIndex1 === dieIndex2 ||
    dieIndex1 === dieIndex3 ||
    dieIndex2 === dieIndex3
  );
}

export function isVelute([dieIndex1, dieIndex2, dieIndex3]: DiceForm): boolean {
  const [v1, v2, v3] = [dieIndex1 + 1, dieIndex2 + 1, dieIndex3 + 1];
  const firstCase = v1 + v2 === v3;
  const secondCase = v1 + v3 === v2;
  const thirdCase = v2 + v3 === v1;

  return firstCase || secondCase || thirdCase;
}

function isChouetteVelute(diceForm: DiceForm): boolean {
  return isChouette(diceForm) && isVelute(diceForm);
}

function isSuite([dieIndex1, dieIndex2, dieIndex3]: DiceForm): boolean {
  const values = [dieIndex1 + 1, dieIndex2 + 1, dieIndex3 + 1].sort();
  const possibleSuites = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6]
  ];

  return possibleSuites.some(validSuite => {
    return validSuite.every(
      (validSuiteNumber, index) => validSuiteNumber === values[index]
    );
  });
}

function isCulDeChouette([dieIndex1, dieIndex2, dieIndex3]: DiceForm): boolean {
  return dieIndex1 === dieIndex2 && dieIndex1 === dieIndex3;
}

export function computeDiceResult(diceForm: DiceForm): HistoryLineType {
  if (isCulDeChouette(diceForm)) {
    return HistoryLineType.CUL_DE_CHOUETTE;
  }

  if (isSuite(diceForm)) {
    return HistoryLineType.SUITE;
  }

  if (isChouetteVelute(diceForm)) {
    return HistoryLineType.CHOUETTE_VELUTE;
  }

  if (isChouette(diceForm)) {
    return HistoryLineType.CHOUETTE;
  }

  if (isVelute(diceForm)) {
    return HistoryLineType.VELUTE;
  }

  return HistoryLineType.NEANT;
}
