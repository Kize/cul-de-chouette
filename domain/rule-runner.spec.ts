import { RuleRunner } from "./rule-runner";
import { Rule } from "./rules/rule";
import { DiceRoll } from "./rules/dice-rule";
import { RuleEffects } from "./rules/rule-effect";
import { DummyContextBuilder } from "./tests/dummy-game-context-builder";
import { ChouetteRule } from "./rules/basic-rules/chouette-rule";
import { NeantRule } from "./rules/basic-rules/neant-rule";

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

describe("getFirstApplicableRule", () => {
  it("throws an error when no rules are applicable", () => {
    const runner = new RuleRunner([new ChouetteRule()]);

    const gameContext = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 3, 6])
      .build()
      .asPlayTurn();

    const wrapper = () => {
      runner.getFirstApplicableRule(gameContext);
    };

    expect(wrapper).toThrow();
  });

  it("returns a chouetteRule when the dice roll is a chouette", () => {
    const runner = new RuleRunner([new ChouetteRule()]);

    const gameContext = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 3, 3])
      .build()
      .asPlayTurn();

    const rule = runner.getFirstApplicableRule(gameContext);

    expect(rule).toBeInstanceOf(ChouetteRule);
  });
});
