import { Rule } from "./rules/rule";
import { RuleEffects } from "./rules/rule-effect";
import { GameContextWrapper, UnknownGameContext } from "./game-context-event";
import { NeantRule } from "./rules/basic-rules/neant-rule";

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async handleDiceRoll(event: UnknownGameContext): Promise<RuleEffects> {
    const ruleToApply = this.rules.find((rule) =>
      rule.isApplicableToGameContext(event)
    );

    if (!ruleToApply) {
      throw new Error("No rule to apply :/");
    }

    return ruleToApply.applyRule(new GameContextWrapper(event));
  }

  isDiceRollANeant(event: UnknownGameContext): boolean {
    const ruleToApply = this.rules.find((rule) =>
      rule.isApplicableToGameContext(event)
    );

    if (!ruleToApply) {
      return false;
    }

    return ruleToApply instanceof NeantRule;
  }
}
