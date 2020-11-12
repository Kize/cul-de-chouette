import {
  AttrapeOiseauResolution,
  AttrapeOiseauRule,
} from "./attrape-oiseau-rule";
import { HistoryLineType } from "../../../src/domain/history";
import { testSirotageRule } from "./sirotage-rule.spec";
import { RuleResolver } from "../rule-resolver";
import { BidType, SiropBid, SiropResolutionPayload } from "./sirotage-rule";
import { RuleEffect, RuleEffetType } from "../rule-effect";
import { DummyPlayTurnGameContextBuilder } from "../../tests/dummy-game-context-builder";

describe("has the sirotage behaviour if there is no attrape oiseau", () => {
  testSirotageRule((resolution) => {
    const resolver = <
      RuleResolver<AttrapeOiseauResolution, SiropResolutionPayload>
    >{};
    resolver.getResolution = jest.fn().mockResolvedValue({
      ...resolution,
      playerWhoMakeAttrapeOiseau: undefined,
    });
    return new AttrapeOiseauRule(resolver);
  });
});

it("applies the sirotage to the player who stole the sirop if attrape oiseau is lost", async () => {
  const resolution: AttrapeOiseauResolution = {
    isSirote: true,
    bids: [],
    lastDieValue: 4,
    playerWhoMakeAttrapeOiseau: "Delphin",
  };
  const resolver = {
    getResolution: jest.fn().mockResolvedValue(resolution),
  };
  const rule = new AttrapeOiseauRule(resolver);

  const ruleEffects = await rule.applyRule(
    DummyPlayTurnGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build()
  );

  expect(ruleEffects).toContainEqual<RuleEffect>({
    type: RuleEffetType.CHANGE_SCORE,
    designation: HistoryLineType.ATTRAPE_OISEAU,
    playerName: "Delphin",
    score: -9,
  });

  expect(ruleEffects).toContainEqual<RuleEffect>({
    type: RuleEffetType.CHANGE_SCORE,
    designation: HistoryLineType.ATTRAPE_OISEAU,
    playerName: "Alban",
    score: 9,
  });
});

it("applies the sirotage to the player who stole the sirop if attrape oiseau is won", async () => {
  const resolution: AttrapeOiseauResolution = {
    isSirote: true,
    bids: [],
    lastDieValue: 3,
    playerWhoMakeAttrapeOiseau: "Delphin",
  };
  const resolver = {
    getResolution: jest.fn().mockResolvedValue(resolution),
  };
  const rule = new AttrapeOiseauRule(resolver);

  const ruleEffects = await rule.applyRule(
    DummyPlayTurnGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build()
  );

  expect(ruleEffects).toContainEqual<RuleEffect>({
    type: RuleEffetType.CHANGE_SCORE,
    designation: HistoryLineType.ATTRAPE_OISEAU,
    playerName: "Delphin",
    score: 70,
  });

  expect(ruleEffects).toContainEqual<RuleEffect>({
    type: RuleEffetType.CHANGE_SCORE,
    designation: HistoryLineType.ATTRAPE_OISEAU,
    playerName: "Alban",
    score: 9,
  });
});

it("handle the fil sirop bet", async () => {
  const bids: Array<SiropBid> = [
    {
      playerName: "Alban",
      playerBid: BidType.FILE_SIROP,
      isBidValidated: false,
    },
  ];

  const resolver = {
    getResolution: jest.fn().mockResolvedValue({
      isSirote: true,
      lastDieValue: 6,
      bids,
    }),
  };
  const attrapeOiseauRule = new AttrapeOiseauRule(resolver);

  const gameContext = DummyPlayTurnGameContextBuilder.aContext()
    .withCurrentPlayerName("Alban")
    .withDiceRoll([2, 3, 2])
    .build();

  const ruleEffects = await attrapeOiseauRule.applyRule(gameContext);

  expect(ruleEffects).toContainEqual({
    type: RuleEffetType.CHANGE_SCORE,
    designation: HistoryLineType.SIROP_CHALLENGE,
    playerName: "Alban",
    score: 0,
  });
});

describe("resolver params", () => {
  it("gives the playable bids to the resolver", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({}),
    };
    const attrapeOiseauRule = new AttrapeOiseauRule(resolver);

    const gameContext = DummyPlayTurnGameContextBuilder.aContext()
      .withCurrentPlayerName("Alban")
      .withDiceRoll([3, 3, 5])
      .build();

    await attrapeOiseauRule.applyRule(gameContext);
    expect(resolver.getResolution).toHaveBeenCalledWith<
      [SiropResolutionPayload]
    >({
      playableBids: [
        { type: BidType.BEAU_SIROP, isPlayable: true },
        { type: BidType.COUCHE_SIROP, isPlayable: true },
        { type: BidType.FILE_SIROP, isPlayable: true },
        { type: BidType.LINOTTE, isPlayable: true },
        { type: BidType.ALOUETTE, isPlayable: true },
        { type: BidType.FAUVETTE, isPlayable: false },
        { type: BidType.MOUETTE, isPlayable: true },
        { type: BidType.BERGERONNETTE, isPlayable: true },
        { type: BidType.CHOUETTE, isPlayable: true },
      ],
      chouetteValue: 3,
    });
  });
});
