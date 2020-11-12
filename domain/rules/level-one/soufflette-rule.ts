import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class SouffletteRule extends DiceRule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 1 && dieValue2 === 2 && dieValue3 === 4;
  }

  applyDiceRule(context: PlayTurnGameContext): RuleEffects {
    return [];
  }
}
