import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { ArtichetteResolution, ArtichetteRule } from "./artichette-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";

describe("isApplicableToDiceRoll", () => {
  it("returns false if dice make a 4, 2, 1 combination", () => {
    const rule = new ArtichetteRule({ getResolution: jest.fn() });

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 2, 1])
      .build()
      .asDiceRoll();

    expect(rule.isApplicableToGameContext(context)).toBe(false);
  });

  it("returns true when dice makes a 4, 4, 3 combination", () => {
    const rule = new ArtichetteRule({ getResolution: jest.fn() });

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 3, 4])
      .build()
      .asDiceRoll();

    expect(rule.isApplicableToGameContext(context)).toBe(true);
  });
});

describe("applyDiceRule", () => {
  it("registers a won artichette", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        isRaitournelleClaimed: true,
      } as ArtichetteResolution),
    };

    const rule = new ArtichetteRule(resolver);

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 3, 4])
      .withPlayerName("Alban")
      .build()
      .asDiceRoll();

    expect(await rule.applyDiceRule(context)).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ARTICHETTE,
      score: 16,
      playerName: "Alban",
    });
  });

  it("registers a lost artichette", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        isRaitournelleClaimed: false,
      } as ArtichetteResolution),
    };

    const rule = new ArtichetteRule(resolver);

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 3, 4])
      .withPlayerName("Alban")
      .build()
      .asDiceRoll();

    expect(await rule.applyDiceRule(context)).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ARTICHETTE,
      score: -16,
      playerName: "Alban",
    });
  });
});
