import { DiceRoll, GameContext, Rule, RuleEffects } from "@/domain/rules/rule";

export class SuiteRule implements Rule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1
  }

  applyRule(context: GameContext): RuleEffects {
    return [];
  }
}
