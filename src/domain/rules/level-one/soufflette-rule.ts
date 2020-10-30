import { DiceRoll, GameContext, Rule, RuleEffects } from "@/domain/rules/rule";

export class SouffletteRule implements Rule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 1 && dieValue2 === 2 && dieValue3 === 4;
  }

  applyRule(context: GameContext): RuleEffects {
    return [];
  }
}
