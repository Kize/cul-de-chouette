import { DummyGameContextBuilder } from '@/domain/rules/dummy-game-context-builder';
import { RuleEffects, RuleEffetType } from '@/domain/rules/rule';
import { ChouetteRule } from '@/domain/rules/basic-rules/chouette-rule';
import { HistoryLineType } from '@/domain/history';

describe("isApplicableToDiceRoll", () => {
  it("returns true if two dice have the same value", () => {
    const rule = new ChouetteRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 5])).toBe(true);
  });

  it("returns false if at least all dice are different", () => {
    const rule = new ChouetteRule();

    expect(rule.isApplicableToDiceRoll([1, 2, 3])).toBe(false);
  });
});

describe("applyRule", () => {
  it("registers a change of score of 25 for a chouette of 5", () => {
    const effects = new ChouetteRule().applyRule(
      DummyGameContextBuilder.aContext()
        .withCurrentPlayerName("Alban")
        .withDiceRoll([5, 5, 2])
        .build()
    );

    expect(effects).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE,
        playerName: "Alban",
        score: 25,
      },
    ] as RuleEffects);
  });
});
