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
        event: RuleEffectEvent.BEVUE,
        playerName: context.asApplyBevue().playerWhoMadeABevue,
        score: -5,
      },
    ];
  }
}
