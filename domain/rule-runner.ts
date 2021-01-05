import { Rule } from "./rules/rule";
import { RuleEffects } from "./rules/rule-effect";
import { GameContextWrapper, UnknownGameContext } from "./game-context-event";

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

  getFirstApplicableRule(event: UnknownGameContext): Rule {
    const rule = this.rules.find((rule) =>
      rule.isApplicableToGameContext(event)
    );

    if (!rule) {
      throw new Error("There should always be at least one applicable rule.");
    }

    return rule;
  }
}
