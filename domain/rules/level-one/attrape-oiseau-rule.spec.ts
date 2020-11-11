import {
  AttrapeOiseauResolution,
  AttrapeOiseauRule,
} from "./attrape-oiseau-rule";
import { DummyGameContextBuilder } from "../dummy-game-context-builder";
import { RuleEffect, RuleEffetType } from "../rule";
import { HistoryLineType } from "../../../src/domain/history";
import { testSirotageRule } from "./sirotage-rule.spec";
import { RuleResolver } from "../rule-resolver";

describe("has the sirotage behaviour if there is no attrape oiseau", () => {
  testSirotageRule((resolution) => {
    const resolver = <RuleResolver<AttrapeOiseauResolution>>{};
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
    DummyGameContextBuilder.aContext()
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
    DummyGameContextBuilder.aContext()
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
