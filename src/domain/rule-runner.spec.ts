import { DiceRoll, Rule, RuleEffects } from "@/domain/rules/rule";
import { RuleRunner } from "@/domain/rule-runner";
import { DummyGameContextBuilder } from "@/domain/rules/dummy-game-context-builder";

it("applies the correct rule", async () => {
  const invalidRule: Rule = {
    isApplicableToDiceRoll: jest.fn().mockReturnValue(false),
    applyRule: jest.fn(),
  };

  const expectedRuleEffects: RuleEffects = [];

  const validRule: Rule = {
    isApplicableToDiceRoll: jest.fn().mockReturnValue(true),
    applyRule: jest.fn().mockReturnValue(expectedRuleEffects),
  };

  const runner = new RuleRunner([invalidRule, validRule]);

  const diceRoll: DiceRoll = [1, 5, 6];
  const gameContext = DummyGameContextBuilder.aContext().build();
  const result = await runner.run(diceRoll, gameContext);

  expect(invalidRule.isApplicableToDiceRoll).toHaveBeenCalledWith(diceRoll);
  expect(validRule.isApplicableToDiceRoll).toHaveBeenCalledWith(diceRoll);

  expect(invalidRule.applyRule).not.toHaveBeenCalled();

  expect(validRule.applyRule).toHaveBeenCalledWith(gameContext);

  expect(result).toEqual(expectedRuleEffects);
});
