import { CulDeChouetteRule } from '@/domain/rules/basic-rules/cul-de-chouette-rule';
import { DummyGameContextBuilder } from '@/domain/rules/dummy-game-context-builder';
import { RuleEffects, RuleEffetType } from '@/domain/rules/rule';
import { HistoryLineType } from '@/domain/history';

describe("isApplicableToDiceRoll", () => {
  it("returns true if all dice have the same value", () => {
    const rule = new CulDeChouetteRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 1])).toBe(true);
  });

  it("returns false if at least two dice are different", () => {
    const rule = new CulDeChouetteRule();

    expect(rule.isApplicableToDiceRoll([1, 2, 1])).toBe(false);
  });
});

describe("applyRule", () => {
  it("registers a change of score of 60 for a cul de chouette of 2", () => {
    const effects = new CulDeChouetteRule().applyRule(
      DummyGameContextBuilder.aContext()
        .withCurrentPlayerName("Alban")
        .withDiceRoll([2, 2, 2])
        .build()
    );

    expect(effects).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CUL_DE_CHOUETTE,
        playerName: "Alban",
        score: 60,
      }
    ] as RuleEffects);
  });
});
