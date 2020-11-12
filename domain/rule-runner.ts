import { Rule } from "./rules/rule";
import { RuleEffects } from "./rules/rule-effect";
import { GameContext, GameContextEvent } from "./game-context-event";

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async handleDiceRoll(event: GameContextEvent): Promise<RuleEffects> {
    const ruleToApply = this.rules.find((rule) =>
      rule.isApplicableToGameContextEvent(event)
    );

    if (!ruleToApply) {
      throw new Error("No rule to apply :/");
    }

    return ruleToApply.applyRule(event.gameContext);
  }
}
