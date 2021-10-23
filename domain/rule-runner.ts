import { Rule, Rules } from "./rules/rule";
import { RuleEffects } from "./rules/rule-effect";
import { GameContextWrapper, UnknownGameContext } from "./game-context-event";

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async handleGameEvent(event: UnknownGameContext): Promise<RuleEffects> {
    return this.getFirstApplicableRule(event).applyRule(
      new GameContextWrapper(event)
    );
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

  isRuleEnabled(ruleName: Rules): boolean {
    const rule = this.rules.find((rule) => rule.name === ruleName);

    return !!rule;
  }
}
