import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class NeantRule extends DiceRule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyDiceRule(context: PlayTurnGameContext): RuleEffects {
    return [
      {
        event: RuleEffectEvent.ADD_GRELOTTINE,
        playerName: context.currentPlayerName,
        score: 0,
      },
      {
        event: RuleEffectEvent.NEANT,
        playerName: context.currentPlayerName,
        score: 0,
      },
    ];
  }
}
