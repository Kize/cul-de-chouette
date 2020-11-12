import { NeantRule } from "./neant-rule";
import { HistoryLineType } from "../../../src/domain/history";
import { RuleEffect, RuleEffetType } from "../rule-effect";
import { DummyPlayTurnGameContextBuilder } from "../../tests/dummy-game-context-builder";

describe("isApplicableToDiceRoll", () => {
  it("returns always true", function () {
    const rule = new NeantRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 1])).toBe(true);
  });
});

describe("applyRule", () => {
  it("applies a grelottine to the current player", () => {
    const effects = new NeantRule().applyRule(
      DummyPlayTurnGameContextBuilder.aContext()
        .withCurrentPlayerName("Alban")
        .build()
    );

    expect(effects).toContainEqual<RuleEffect>({
      type: RuleEffetType.ADD_GRELOTTINE,
      playerName: "Alban",
    });
  });

  it("registers a change of score the the current player", async () => {
    const effects = new NeantRule().applyRule(
      DummyPlayTurnGameContextBuilder.aContext()
        .withCurrentPlayerName("Alban")
        .build()
    );

    expect(effects).toContainEqual<RuleEffect>({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.NEANT,
      playerName: "Alban",
      score: 0,
    });
  });
});
