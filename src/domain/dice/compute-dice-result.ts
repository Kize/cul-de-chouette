import { HistoryLineType } from "@/domain/history";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";
import { computeLevelOneDiceResult } from "@/domain/dice/compute-dice-result-level-one";
import { DiceRoll } from "../../../domain/rules/dice-rule";

export type DiceForm = [number, number, number] | DiceRoll;

export function isDiceFormValid(diceForm: DiceForm): diceForm is DiceRoll {
  return diceForm.every((dieValue) => dieValue >= 1 && dieValue <= 6);
}

function isChouette([dieValue1, dieValue2, dieValue3]: DiceForm): boolean {
  return (
    dieValue1 === dieValue2 ||
    dieValue1 === dieValue3 ||
    dieValue2 === dieValue3
  );
}

export function isVelute([dieValue1, dieValue2, dieValue3]: DiceForm): boolean {
  const firstCase = dieValue1 + dieValue2 === dieValue3;
  const secondCase = dieValue1 + dieValue3 === dieValue2;
  const thirdCase = dieValue2 + dieValue3 === dieValue1;

  return firstCase || secondCase || thirdCase;
}

function isChouetteVelute(diceForm: DiceForm): boolean {
  return isChouette(diceForm) && isVelute(diceForm);
}

function isSuite(diceForm: DiceForm): boolean {
  const possibleSuites = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
  ];

  return possibleSuites.some((validSuite) => {
    return validSuite.every(
      (validSuiteNumber, index) => validSuiteNumber === diceForm[index]
    );
  });
}

function isCulDeChouette([dieValue1, dieValue2, dieValue3]: DiceForm): boolean {
  return dieValue1 === dieValue2 && dieValue1 === dieValue3;
}

export function computeDiceResult(
  diceForm: DiceForm,
  rules: RulesState
): HistoryLineType {
  if (isCulDeChouette(diceForm)) {
    return HistoryLineType.CUL_DE_CHOUETTE;
  }

  if (isSuite(diceForm)) {
    return HistoryLineType.SUITE;
  }

  if (isChouetteVelute(diceForm)) {
    return HistoryLineType.CHOUETTE_VELUTE;
  }

  const levelOneResult = computeLevelOneDiceResult(diceForm, rules.levelOne);
  if (levelOneResult !== undefined) {
    return levelOneResult;
  }

  if (isChouette(diceForm)) {
    return HistoryLineType.CHOUETTE;
  }

  if (isVelute(diceForm)) {
    return HistoryLineType.VELUTE;
  }

  return HistoryLineType.NEANT;
}
