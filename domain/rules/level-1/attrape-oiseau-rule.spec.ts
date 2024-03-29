import {
  AttrapeOiseauResolution,
  AttrapeOiseauRule,
} from "./attrape-oiseau-rule";
import { testSirotageRule } from "./sirotage-rule.spec";
import { RuleResolver } from "../rule-resolver";
import { SiropResolutionPayload } from "./sirotage-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { BidType, SiropBid } from "./sirotage-rule.types";

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
    DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build()
  );

  expect(ruleEffects).toContainEqual<RuleEffect>({
    event: RuleEffectEvent.ATTRAPE_OISEAU_LOST,
    playerName: "Delphin",
    score: -9,
  });

  expect(ruleEffects).toContainEqual<RuleEffect>({
    event: RuleEffectEvent.CHOUETTE,
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
    DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build()
  );

  expect(ruleEffects).toContainEqual<RuleEffect>({
    event: RuleEffectEvent.ATTRAPE_OISEAU_WON,
    playerName: "Delphin",
    score: 70,
  });

  expect(ruleEffects).toContainEqual<RuleEffect>({
    event: RuleEffectEvent.CHOUETTE,
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

  const gameContext = DummyContextBuilder.aDiceRollContext()
    .withPlayerName("Alban")
    .withDiceRoll([2, 3, 2])
    .build();

  const ruleEffects = await attrapeOiseauRule.applyRule(gameContext);

  expect(ruleEffects).toContainEqual({
    event: RuleEffectEvent.SIROP_BET_WON,
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

    const gameContext = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 5])
      .build();

    await attrapeOiseauRule.applyRule(gameContext);
    expect(resolver.getResolution).toHaveBeenCalledWith<
      [SiropResolutionPayload]
    >({
      playerName: "Alban",
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
