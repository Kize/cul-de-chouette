import { Rule } from "../rule";
import { RuleEffects } from "../rule-effect";
import { GameContext, GameContextEvent } from "../../game-context-event";

export class GrelottineRule implements Rule {
  isApplicableToGameContextEvent(context: GameContextEvent): boolean {
    return false;
  }

  applyRule(context: GameContext): RuleEffects | Promise<RuleEffects> {
    return [];
  }
}
