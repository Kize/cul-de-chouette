import { Rule } from "../rule";
import {
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from "../../game-context-event";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";

export class BevueRule implements Rule {
  isApplicableToGameContext(context: UnknownGameContext): boolean {
    return context.event === GameContextEvent.APPLY_BEVUE;
  }

  applyRule(context: GameContextWrapper): RuleEffects {
    return [
      {
        playerName: context.asApplyBevue().playerWhoMadeABevue,
        event: RuleEffectEvent.BEVUE,
        score: -5,
      },
    ];
  }
}
