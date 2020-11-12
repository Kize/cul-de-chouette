import { RuleRunner } from "./rule-runner";
import { Rule} from "./rules/rule";
import { DiceRoll } from './rules/dice-rule';
import { RuleEffects } from './rules/rule-effect';
import { DummyPlayTurnGameContextBuilder } from './tests/dummy-game-context-builder';

describe("handleDiceRoll", () => {
  it("applies the correct rule", async () => {
    const invalidRule: Rule = {
      isApplicableToGameContextEvent: jest.fn().mockReturnValue(false),
      applyRule: jest.fn(),
    };

    const expectedRuleEffects: RuleEffects = [];

    const validRule: Rule = {
      isApplicableToGameContextEvent: jest.fn().mockReturnValue(true),
      applyRule: jest.fn().mockReturnValue(expectedRuleEffects),
    };

    const runner = new RuleRunner([invalidRule, validRule]);

    const diceRoll: DiceRoll = [1, 5, 6];
    const gameContext = DummyPlayTurnGameContextBuilder.aContext()
      .withDiceRoll(diceRoll)
      .build();
    const result = await runner.handleDiceRoll(gameContext);

    expect(invalidRule.isApplicableToGameContextEvent).toHaveBeenCalledWith(
      diceRoll
    );
    expect(validRule.isApplicableToGameContextEvent).toHaveBeenCalledWith(diceRoll);

    expect(invalidRule.applyRule).not.toHaveBeenCalled();

    expect(validRule.applyRule).toHaveBeenCalledWith(gameContext);

    expect(result).toEqual(expectedRuleEffects);
  });
});
