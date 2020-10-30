import { SuiteRule } from "@/domain/rules/basic-rules/suite-rule";
import { DummyGameContextBuilder } from "@/domain/rules/dummy-game-context-builder";
import { RuleEffects, RuleEffetType } from "@/domain/rules/rule";

describe("isApplicableToDiceRoll", () => {
  let rule: SuiteRule;

  beforeEach(() => {
    rule = new SuiteRule({ getSuiteResolution: jest.fn() });
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
      getSuiteResolution: jest
        .fn()
        .mockResolvedValue({ loosingPlayerName: "Alban", multiplier: 1 }),
    };

    const rule = new SuiteRule(resolver);

    expect(
      await rule.applyRule(DummyGameContextBuilder.aContext().build())
    ).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: "Alban",
        score: -10,
      },
    ] as RuleEffects);
  });

  it("registers a change of score of -40 for a given player and a multiplier of 4", async () => {
    const resolver = {
      getSuiteResolution: jest
        .fn()
        .mockResolvedValue({ loosingPlayerName: "Delphin", multiplier: 4 }),
    };

    const rule = new SuiteRule(resolver);

    expect(
      await rule.applyRule(DummyGameContextBuilder.aContext().build())
    ).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: "Delphin",
        score: -40,
      },
    ] as RuleEffects);
  });
});
