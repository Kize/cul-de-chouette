import { Resolver } from "../rule-resolver";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { CivetBet, CivetResolution, CivetRule } from "./civet-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";
import { VeluteRule } from "../basic-rules/velute-rule";
import { RuleRunner } from "../../rule-runner";
import {
  BleuRougeResolution,
  BleuRougeRule,
} from "../level-three/bleu-rouge-rule";

describe("isApplicableToGameContext", () => {
  let dummyResolver: Resolver<CivetResolution>;
  beforeEach(() => {
    dummyResolver = {
      getResolution: jest.fn(),
    };
  });

  it("returns false when the given event is not a civet", () => {
    const rule = new CivetRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aDiceRollContext().build().asDiceRoll()
      )
    ).toBe(false);
  });

  it("returns true when the given event is a civet", () => {
    const rule = new CivetRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aCivetContext().build().asCivet()
      )
    ).toBe(true);
  });
});

describe("applyRule", () => {
  it("removes the civet for the player", async () => {
    const resolver: Resolver<CivetResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        playerName: "Alban",
        betAmount: 1,
        playerBet: CivetBet.VELUTE,
        diceRoll: [3, 3, 3],
      } as CivetResolution),
    };

    const rule = new CivetRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext().build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.REMOVE_CIVET,
      playerName: "Alban",
      score: 0,
    });
  });

  it("handles a lost civet bet", async () => {
    const resolver: Resolver<CivetResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        playerName: "Alban",
        betAmount: 42,
        playerBet: CivetBet.VELUTE,
        diceRoll: [3, 3, 3],
      } as CivetResolution),
    };

    const rule = new CivetRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext().build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CIVET_LOST,
      playerName: "Alban",
      score: -42,
    });
  });

  it("handles a won civet bet", async () => {
    const resolver: Resolver<CivetResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        playerName: "Alban",
        betAmount: 102,
        playerBet: CivetBet.VELUTE,
        diceRoll: [2, 3, 5],
      } as CivetResolution),
    };

    const rule = new CivetRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext()
        .withRuleRunner(new RuleRunner([new VeluteRule()]))
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CIVET_WON,
      playerName: "Alban",
      score: 102,
    });
  });

  it("applies the dice roll rule effets to the player", async () => {
    const resolver: Resolver<CivetResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        playerName: "Alban",
        betAmount: 102,
        playerBet: CivetBet.VELUTE,
        diceRoll: [2, 3, 5],
      } as CivetResolution),
    };

    const rule = new CivetRule(resolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext()
        .withRuleRunner(new RuleRunner([new VeluteRule()]))
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VELUTE,
      playerName: "Alban",
      score: 50,
    });
  });

  it("handle a lost civet bet when betting on a velute, and resulting into a bleu-rouge with a velute", async () => {
    const civetResolver: Resolver<CivetResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        playerName: "Alban",
        betAmount: 102,
        playerBet: CivetBet.VELUTE,
        diceRoll: [3, 4, 3],
      } as CivetResolution),
    };

    const bleuRougeResolver: Resolver<BleuRougeResolution> = {
      getResolution: jest.fn().mockResolvedValue({
        diceRoll: [2, 3, 5],
        bids: [{ playerName: "Alban", bet: 10 }],
      } as BleuRougeResolution),
    };

    const rule = new CivetRule(civetResolver);
    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext()
        .withRuleRunner(
          new RuleRunner([
            new BleuRougeRule(bleuRougeResolver),
            new VeluteRule(),
          ])
        )
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CIVET_LOST,
      playerName: "Alban",
      score: -102,
    });
  });
});
