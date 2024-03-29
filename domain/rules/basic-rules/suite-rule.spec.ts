import { SuiteRule } from "./suite-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { VeluteRule } from "./velute-rule";
import { RuleRunner } from "../../rule-runner";

describe("isApplicableToDiceRoll", () => {
  let rule: SuiteRule;

  beforeEach(() => {
    rule = new SuiteRule({ getResolution: jest.fn() });
  });

  it("returns true if dice follows each others", () => {
    expect(rule.isApplicableToDiceRoll([1, 3, 2])).toBe(true);
  });

  it("returns false dice don't follow each other", () => {
    expect(rule.isApplicableToDiceRoll([1, 3, 6])).toBe(false);
  });
});

describe("applyRule", () => {
  it("registers a change of score of -10 for a given player", async () => {
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ loosingPlayerName: "Alban", multiplier: 1 }),
    };

    const rule = new SuiteRule(resolver);

    expect(
      await rule.applyRule(DummyContextBuilder.aDiceRollContext().build())
    ).toEqual<RuleEffects>([
      {
        event: RuleEffectEvent.SUITE,
        playerName: "Alban",
        score: -10,
      },
    ]);
  });

  it("registers a change of score of -40 for a given player and a multiplier of 4", async () => {
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ loosingPlayerName: "Delphin", multiplier: 4 }),
    };

    const rule = new SuiteRule(resolver);

    expect(
      await rule.applyRule(DummyContextBuilder.aDiceRollContext().build())
    ).toEqual<RuleEffects>([
      {
        event: RuleEffectEvent.SUITE,
        playerName: "Delphin",
        score: -40,
      },
    ]);
  });

  it("registers a change of score of -10 for a given player, and applies the velute for the currentPlayer on 1,2,3", async () => {
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ loosingPlayerName: "Delphin", multiplier: 1 }),
    };

    const rule = new SuiteRule(resolver);

    expect(
      await rule.applyRule(
        DummyContextBuilder.aDiceRollContext()
          .withDiceRoll([1, 2, 3])
          .withPlayerName("Alban")
          .withRuleRunner(new RuleRunner([new VeluteRule()]))
          .build()
      )
    ).toEqual<RuleEffects>([
      {
        event: RuleEffectEvent.SUITE_VELUTE,
        playerName: "Alban",
        score: 18,
      },
      {
        event: RuleEffectEvent.SUITE,
        playerName: "Delphin",
        score: -10,
      },
    ]);
  });
});
