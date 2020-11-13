import {
  GrelottineBet,
  GrelottineResolution,
  GrelottineRule,
} from "./grelottine-rule";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { HistoryLineType } from "../../../src/domain/history";
import { RuleEffect, RuleEffectType } from "../rule-effect";
import { Resolver } from "../rule-resolver";
import { RuleRunner } from "../../rule-runner";
import { ChouetteRule } from "./chouette-rule";

describe("isApplicableToGameContext", () => {
  let dummyResolver: Resolver<GrelottineResolution>;
  beforeEach(() => {
    dummyResolver = {
      getResolution: jest.fn(),
    };
  });
  it("returns false when the given event is not a grelottine", () => {
    const rule = new GrelottineRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aPlayTurnContext().build().asPlayTurn()
      )
    ).toBe(false);
  });

  it("returns true when the given event is  a grelottine", () => {
    const rule = new GrelottineRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aGrelottineContext().build().asChallengeGrelottine()
      )
    ).toBe(true);
  });
});

describe("applyRule", () => {
  it("handles a lost grelottine challenge", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        grelottinPlayer: "Alban",
        challengedPlayer: "Delphin",
        grelottinBet: GrelottineBet.CHOUETTE,
        diceRoll: [1, 6, 4],
        gambledAmount: 12,
      }),
    };

    const rule = new GrelottineRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aGrelottineContext().build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      type: RuleEffectType.CHANGE_SCORE,
      designation: HistoryLineType.GRELOTTINE_CHALLENGE_WON,
      playerName: "Alban",
      score: 12,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      type: RuleEffectType.CHANGE_SCORE,
      designation: HistoryLineType.GRELOTTINE_CHALLENGE_LOST,
      playerName: "Delphin",
      score: -12,
    });
  });

  it("removes the grelottine for the grelottin", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        grelottinPlayer: "Alban",
        challengedPlayer: "Delphin",
        grelottinBet: GrelottineBet.CHOUETTE,
        diceRoll: [1, 6, 4],
        gambledAmount: 12,
      }),
    };

    const rule = new GrelottineRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aGrelottineContext().build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      type: RuleEffectType.REMOVE_GRELOTTINE,
      playerName: "Alban",
    });
  });

  it("handles a won grelottine challenge", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        grelottinPlayer: "Alban",
        challengedPlayer: "Delphin",
        grelottinBet: GrelottineBet.CHOUETTE,
        diceRoll: [1, 1, 4],
        gambledAmount: 32,
      }),
    };

    const rule = new GrelottineRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aGrelottineContext()
        .withRuleRunner(new RuleRunner([new ChouetteRule()]))
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      type: RuleEffectType.CHANGE_SCORE,
      designation: HistoryLineType.GRELOTTINE_CHALLENGE_LOST,
      playerName: "Alban",
      score: -32,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      type: RuleEffectType.CHANGE_SCORE,
      designation: HistoryLineType.GRELOTTINE_CHALLENGE_WON,
      playerName: "Delphin",
      score: 32,
    });
  });

  it("it applies the dice roll rule effects to the challenged player", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        grelottinPlayer: "Alban",
        challengedPlayer: "Delphin",
        grelottinBet: GrelottineBet.CHOUETTE,
        diceRoll: [3, 3, 3],
        gambledAmount: 12,
      }),
    };

    const rule = new GrelottineRule(resolver);
    const ruleRunner = <RuleRunner>{};
    const aRuleEffect = {
      type: RuleEffectType.CHANGE_SCORE,
      designation: HistoryLineType.CUL_DE_CHOUETTE,
      playerName: "Delphin",
      score: 70,
    };
    ruleRunner.handleDiceRoll = jest.fn().mockResolvedValue([aRuleEffect]);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aGrelottineContext()
        .withRuleRunner(ruleRunner)
        .build()
    );
    expect(ruleRunner.handleDiceRoll).toHaveBeenCalledWith(
      DummyContextBuilder.aPlayTurnContext()
        .withCurrentPlayerName("Delphin")
        .withDiceRoll([3, 3, 3])
        .build()
        .asPlayTurn()
    );
    expect(ruleEffects).toContainEqual<RuleEffect>(aRuleEffect);
  });
});
