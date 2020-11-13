import { DiceRoll, DieValue } from "../../../domain/rules/dice-rule";

export type DiceForm = [DieValue | 0, DieValue | 0, DieValue | 0];

export function isDiceFormValid(diceForm: DiceForm): diceForm is DiceRoll {
  return diceForm.every((dieValue) => dieValue >= 1 && dieValue <= 6);
}

export function getInitialDiceForm(): DiceForm {
  return [0, 0, 0];
}
