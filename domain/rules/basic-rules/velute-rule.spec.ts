import { VeluteRule } from './velute-rule';
import { HistoryLineType } from '../../../src/domain/history';
import { RuleEffects, RuleEffetType } from '../rule-effect';
import { DummyPlayTurnGameContextBuilder } from '../../tests/dummy-game-context-builder';

describe("isApplicableToDiceRoll", () => {
  it("returns true if two dice sum equals the third one", () => {
    const rule = new VeluteRule();

    expect(rule.isApplicableToDiceRoll([4, 1, 5])).toBe(true);
  });

  it("returns false if there is no way two dice sum equals the third one", () => {
    const rule = new VeluteRule();

    expect(rule.isApplicableToDiceRoll([1, 6, 3])).toBe(false);
  });
});

describe("applyRule", () => {
  it("registers a change of score of 32 for a velute of 4", () => {
    const effects = new VeluteRule().applyRule(
      DummyPlayTurnGameContextBuilder.aContext()
        .withCurrentPlayerName("Alban")
        .withDiceRoll([3, 4, 1])
        .build()
    );

    expect(effects).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: "Alban",
        designation: HistoryLineType.VELUTE,
        score: 32,
      },
    ] as RuleEffects);
  });
});
