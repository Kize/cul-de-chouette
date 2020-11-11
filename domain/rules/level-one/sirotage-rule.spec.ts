import { BidType, SiropBid, SirotageRule } from "./sirotage-rule";
import { DummyGameContextBuilder } from "../dummy-game-context-builder";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import { RuleEffetType } from "../rule";
import { HistoryLineType } from "../../../src/domain/history";

describe("applyRule", () => {
  it("applies the chouette rule when there is no sirotage", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({ isSirote: false }),
    };
    const sirotageRule = new SirotageRule(resolver);
    const chouetteRule = new ChouetteRule();

    const gameContext = DummyGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([2, 3, 2])
      .build();

    expect(await sirotageRule.applyRule(gameContext)).toEqual(
      await chouetteRule.applyRule(gameContext)
    );
  });

  it("registers a negative change of score for the player when the sirotage is failed", async () => {
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ isSirote: true, lastDieValue: 4, bids: [] }),
    };
    const sirotageRule = new SirotageRule(resolver);

    const gameContext = DummyGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([2, 3, 2])
      .build();

    expect(await sirotageRule.applyRule(gameContext)).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP,
      playerName: "Alban",
      score: -4,
    });
  });

  it("registers a positive change of score for the player when the sirotage is won", async () => {
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ isSirote: true, lastDieValue: 2, bids: [] }),
    };
    const sirotageRule = new SirotageRule(resolver);

    const gameContext = DummyGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([2, 3, 2])
      .build();

    expect(await sirotageRule.applyRule(gameContext)).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP,
      playerName: "Alban",
      score: 60,
    });
  });

  it("registers a change of score for each player's bet", async () => {
    const bids: Array<SiropBid> = [
      {
        playerName: "Alban",
        playerBid: BidType.MOUETTE,
        isBidValidated: false,
      },
      {
        playerName: "DelphinWinner",
        playerBid: BidType.CHOUETTE,
        isBidValidated: true,
      },
      {
        playerName: "NathanTooSlowToWin",
        playerBid: BidType.CHOUETTE,
        isBidValidated: false,
      },
      {
        playerName: "JulesNotBetting",
        playerBid: BidType.COUCHE_SIROP,
        isBidValidated: false,
      },
    ];

    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ isSirote: true, lastDieValue: 6, bids }),
    };
    const sirotageRule = new SirotageRule(resolver);

    const gameContext = DummyGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([2, 3, 2])
      .build();

    const ruleEffects = await sirotageRule.applyRule(gameContext);
    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "Alban",
      score: -5,
    });

    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "DelphinWinner",
      score: 25,
    });

    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "NathanTooSlowToWin",
      score: 0,
    });

    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "JulesNotBetting",
      score: 0,
    });
  });

  it("registers a change of score for each player's bet on a beau sirop", async () => {
    const bids: Array<SiropBid> = [
      {
        playerName: "Alban",
        playerBid: BidType.BEAU_SIROP,
        isBidValidated: true,
      },
      {
        playerName: "DelphinTooSlow",
        playerBid: BidType.BEAU_SIROP,
        isBidValidated: false,
      },
    ];

    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValue({ isSirote: true, lastDieValue: 3, bids }),
    };
    const sirotageRule = new SirotageRule(resolver);

    const gameContext = DummyGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([3, 3, 5])
      .build();

    const ruleEffects = await sirotageRule.applyRule(gameContext);
    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "Alban",
      score: 25,
    });

    expect(ruleEffects).toContainEqual({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
      playerName: "DelphinTooSlow",
      score: 0,
    });
  });
});
