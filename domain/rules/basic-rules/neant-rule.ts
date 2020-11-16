import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";

export class NeantRule extends DiceRule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyDiceRule(context: DiceRollGameContext): RuleEffects {
    return [
      {
        event: RuleEffectEvent.ADD_GRELOTTINE,
        playerName: context.playerName,
        score: 0,
      },
      {
        event: RuleEffectEvent.NEANT,
        playerName: context.playerName,
        score: 0,
      },
    ];
  }
}
