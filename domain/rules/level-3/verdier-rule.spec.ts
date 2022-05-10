import { Resolver } from "../rule-resolver";
import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import {
  VerdierResolution,
  VerdierResolutionPayload,
  VerdierRule,
} from "./verdier-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import { RuleRunner } from "../../rule-runner";
import { VeluteRule } from "../basic-rules/velute-rule";

describe("isApplicableToGameContext", () => {
  let dummyResolver: Resolver<VerdierResolution, VerdierResolutionPayload>;
  beforeEach(() => {
    dummyResolver = {
      getResolution: jest.fn(),
    };
  });

  it("returns false when the given event is not a verdier", () => {
    const rule = new VerdierRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aDiceRollContext().build().asDiceRoll()
      )
    ).toBe(false);
  });

  it("returns true when the given event is a verdier", () => {
    const rule = new VerdierRule(dummyResolver);
    expect(
      rule.isApplicableToGameContext(
        DummyContextBuilder.aVerdierContext().build().asVerdier()
      )
    ).toBe(true);
  });
});

describe("applyRule", () => {
  it("applies the dice roll rule effets to the player", async () => {
    const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
      getResolution: jest.fn().mockResolvedValue({
        bettingPlayerNames: [],
        lastDieValue: 4,
      } as VerdierResolution),
    };

    const rule = new VerdierRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aVerdierContext()
        .withPlayerName("Alban")
        .withDiceValues([2, 4])
        .withRuleRunner(new RuleRunner([new ChouetteRule()]))
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CHOUETTE,
      playerName: "Alban",
      score: 16,
    });
  });

  it("handles bets for a won verdier", async () => {
    const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
      getResolution: jest.fn().mockResolvedValue({
        bettingPlayerNames: ["Alban", "Delphin"],
        lastDieValue: 6,
      } as VerdierResolution),
    };

    const rule = new VerdierRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aVerdierContext()
        .withPlayerName("Alban")
        .withDiceValues([2, 4])
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VERDIER_WON,
      playerName: "Alban",
      score: 25,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VERDIER_WON,
      playerName: "Delphin",
      score: 25,
    });
  });

  it("handles bets for a lost verdier", async () => {
    const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
      getResolution: jest.fn().mockResolvedValue({
        bettingPlayerNames: ["Alban", "Delphin"],
        lastDieValue: 5,
      } as VerdierResolution),
    };

    const rule = new VerdierRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aVerdierContext()
        .withPlayerName("Alban")
        .withDiceValues([2, 4])
        .build()
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VERDIER_LOST,
      playerName: "Alban",
      score: -5,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VERDIER_LOST,
      playerName: "Delphin",
      score: -5,
    });
  });
});
