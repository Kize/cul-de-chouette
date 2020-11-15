import { NeantRule } from "./neant-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";

describe("isApplicableToDiceRoll", () => {
  it("returns always true", function () {
    const rule = new NeantRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 1])).toBe(true);
  });
});

describe("applyRule", () => {
  it("applies a grelottine to the current player", () => {
    const effects = new NeantRule().applyRule(
      DummyContextBuilder.aPlayTurnContext()
        .withCurrentPlayerName("Alban")
        .build()
    );

    expect(effects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_GRELOTTINE,
      playerName: "Alban",
      score: 0,
    });
  });

  it("registers a change of score the the current player", async () => {
    const effects = new NeantRule().applyRule(
      DummyContextBuilder.aPlayTurnContext()
        .withCurrentPlayerName("Alban")
        .build()
    );

    expect(effects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.NEANT,
      playerName: "Alban",
      score: 0,
    });
  });
});
