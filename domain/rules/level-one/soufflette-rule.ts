import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffects } from '../rule-effect';
import { GameContext } from '../../game-context-event';

export class SouffletteRule extends DiceRule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 1 && dieValue2 === 2 && dieValue3 === 4;
  }

  applyRule(context: GameContext): RuleEffects {
    return [];
  }
}
