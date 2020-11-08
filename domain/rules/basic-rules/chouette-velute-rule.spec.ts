import { ChouetteVeluteResolution, ChouetteVeluteRule } from './chouette-velute-rule';
import { DummyGameContextBuilder } from "../dummy-game-context-builder";
import { RuleEffects, RuleEffetType } from "../rule";
import { HistoryLineType } from "../../../src/domain/history";

describe("isApplicableToDiceRoll", () => {
  it("returns true if two dice have the same value and those two dice sum equals the third one", () => {
    const rule = new ChouetteVeluteRule({ getResolution: jest.fn() });

    expect(rule.isApplicableToDiceRoll([1, 1, 2])).toBe(true);
  });

  it("returns false otherwise", () => {
    const rule = new ChouetteVeluteRule({ getResolution: jest.fn() });

    expect(rule.isApplicableToDiceRoll([2, 2, 3])).toBe(false);
  });
});

describe("applyRule", () => {
  it("returns a positive change of score for the current player if he claims the chouette velute", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        playerNames: ["Alban"],
      } as ChouetteVeluteResolution),
    };

    const rule = new ChouetteVeluteRule(resolver);

    expect(
      await rule.applyRule(
        DummyGameContextBuilder.aContext()
          .withCurrentPlayerName("Alban")
          .withDiceRoll([2, 2, 4])
          .build()
      )
    ).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: "Alban",
        score: 32,
      },
    ] as RuleEffects);
  });

  it("returns a positive change of score for a claimer, and a neutral change of score for the current player", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        playerNames: ["Delphin"],
      } as ChouetteVeluteResolution),
    };

    const rule = new ChouetteVeluteRule(resolver);

    expect(
      await rule.applyRule(
        DummyGameContextBuilder.aContext()
          .withCurrentPlayerName("Alban")
          .withDiceRoll([2, 2, 4])
          .build()
      )
    ).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: "Alban",
        score: 0,
      },
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: "Delphin",
        score: 32,
      },
    ] as RuleEffects);
  });

  it("returns a negative change of score for every claimers", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        playerNames: ["Alban", "Delphin"],
      } as ChouetteVeluteResolution),
    };

    const rule = new ChouetteVeluteRule(resolver);

    expect(
      await rule.applyRule(
        DummyGameContextBuilder.aContext()
          .withCurrentPlayerName("Alban")
          .withDiceRoll([3, 3, 6])
          .build()
      )
    ).toEqual([
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: "Alban",
        score: -72,
      },
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: "Delphin",
        score: -72,
      },
    ] as RuleEffects);
  });
});
