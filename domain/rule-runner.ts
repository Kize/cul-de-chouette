import { DiceRoll, GameContext, Rule, RuleEffects } from "./rules/rule";

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async run(
    diceRoll: DiceRoll,
    gameContext: GameContext
  ): Promise<RuleEffects> {
    const ruleToApply = this.rules.find((rule) =>
      rule.isApplicableToDiceRoll(diceRoll)
    );

    if (!ruleToApply) {
      throw new Error("No rule to apply :/");
    }

    return ruleToApply.applyRule(gameContext);
  }
}
