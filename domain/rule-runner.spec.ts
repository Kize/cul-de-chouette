import { RuleRunner } from "./rule-runner";
import { Rule } from "./rules/rule";
import { DiceRoll } from "./rules/dice-rule";
import { RuleEffects } from "./rules/rule-effect";
import { DummyContextBuilder } from "./tests/dummy-game-context-builder";

describe("handleDiceRoll", () => {
  it("applies the correct rule", async () => {
    const invalidRule: Rule = {
      isApplicableToGameContext: jest.fn().mockReturnValue(false),
      applyRule: jest.fn(),
    };

    const expectedRuleEffects: RuleEffects = [];

    const validRule: Rule = {
      isApplicableToGameContext: jest.fn().mockReturnValue(true),
      applyRule: jest.fn().mockReturnValue(expectedRuleEffects),
    };

    const runner = new RuleRunner([invalidRule, validRule]);

    const diceRoll: DiceRoll = [1, 5, 6];
    const gameContext = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll(diceRoll)
      .build();
    const result = await runner.handleDiceRoll(gameContext.asPlayTurn());

    expect(invalidRule.isApplicableToGameContext).toHaveBeenCalledWith(
      gameContext.asPlayTurn()
    );
    expect(validRule.isApplicableToGameContext).toHaveBeenCalledWith(
      gameContext.asPlayTurn()
    );

    expect(invalidRule.applyRule).not.toHaveBeenCalled();

    expect(validRule.applyRule).toHaveBeenCalledWith(gameContext);

    expect(result).toEqual(expectedRuleEffects);
  });
});
