import { DiceRoll, GameContext, Rule, RuleEffects } from "@/domain/rules/rule";

export class ChouetteVeluteRule implements Rule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === dieValue2 && dieValue1 + dieValue2 === dieValue3;
  }

  applyRule(context: GameContext): RuleEffects {
    return [];
  }
}
