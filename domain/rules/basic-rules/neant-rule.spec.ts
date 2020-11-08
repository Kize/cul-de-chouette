import { NeantRule } from "./neant-rule";
import { RuleEffect, RuleEffetType } from "../rule";
import { DummyGameContextBuilder } from "../dummy-game-context-builder";
import { HistoryLineType } from "../../../src/domain/history";

describe("isApplicableToDiceRoll", () => {
  it("returns always true", function () {
    const rule = new NeantRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 1])).toBe(true);
  });
});

describe("applyRule", () => {
  it("applies a grelottine to the current player", () => {
    const effects = new NeantRule().applyRule(
      DummyGameContextBuilder.aContext().withCurrentPlayerName("Alban").build()
    );

    const grelottineEffect = effects.find(
      (effect) => effect.type === RuleEffetType.ADD_GRELOTTINE
    );

    expect(grelottineEffect).toEqual({
      type: RuleEffetType.ADD_GRELOTTINE,
      playerName: "Alban",
    });
  });

  it("registers a change of score the the current player", () => {
    const effects = new NeantRule().applyRule(
      DummyGameContextBuilder.aContext().withCurrentPlayerName("Alban").build()
    );

    const neantRollEffect = effects.find(
      (effect) => effect.type === RuleEffetType.CHANGE_SCORE
    );

    expect(neantRollEffect).toEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.NEANT,
      playerName: "Alban",
      score: 0,
    } as RuleEffect);
  });
});
