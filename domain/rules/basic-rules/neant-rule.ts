import { DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Rules } from "../rule";

export class NeantRule extends DiceRule {
  name = Rules.NEANT;

  isApplicableToDiceRoll(): boolean {
    return true;
  }

  applyDiceRule(context: DiceRollGameContext): RuleEffects {
    return [
      {
        event: RuleEffectEvent.NEANT,
        playerName: context.playerName,
        score: 0,
      },
      {
        event: RuleEffectEvent.ADD_GRELOTTINE,
        playerName: context.playerName,
        score: 0,
      },
    ];
  }
}
