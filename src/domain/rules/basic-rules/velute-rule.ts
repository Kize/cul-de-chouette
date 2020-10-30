import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "@/domain/rules/rule";

export class VeluteRule implements Rule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const sortedValues = [...diceRoll].sort();
    return sortedValues[0] + sortedValues[1] === sortedValues[2];
  }

  applyRule({ currentPlayerName, diceRoll }: GameContext): RuleEffects {
    const veluteValue = [...diceRoll].sort().pop();

    const score = 2 * (veluteValue || 0) ** 2;
    return [
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: currentPlayerName,
        score,
      },
    ];
  }
}
