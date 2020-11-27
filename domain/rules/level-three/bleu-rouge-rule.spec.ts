import { DummyContextBuilder } from "../../tests/dummy-game-context-builder";
import { BleuRougeResolution, BleuRougeRule } from "./bleu-rouge-rule";
import { RuleEffect, RuleEffectEvent } from "../rule-effect";
import { RuleRunner } from "../../rule-runner";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import { CulDeChouetteRule } from "../basic-rules/cul-de-chouette-rule";
import { NeantRule } from "../basic-rules/neant-rule";

describe("isApplicableToGameContext", () => {
  it("returns true if dice make a 4, 3, 3 combination", () => {
    const rule = new BleuRougeRule({ getResolution: jest.fn() });

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([3, 4, 3])
      .build()
      .asPlayTurn();

    expect(rule.isApplicableToGameContext(context)).toBe(true);
  });
});

describe("applyRule", () => {
  it("registers the initial chouette for the current player as a Bleu-Rouge", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        bids: [],
        diceRoll: [1, 5, 6],
      } as BleuRougeResolution),
    };

    const rule = new BleuRougeRule(resolver);

    const context = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build();

    expect(await rule.applyRule(context)).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.BLEU_ROUGE,
      playerName: "Alban",
      score: 9,
    });
  });

  it("registers a bleu-rouge bet won by the current player", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        diceRoll: [2, 2, 2],
        bids: [
          { playerName: "Delphin", bet: 5 },
          { playerName: "Alban", bet: 6 },
        ],
      } as BleuRougeResolution),
    };

    const rule = new BleuRougeRule(resolver);

    const context = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
      playerName: "Delphin",
      score: 46,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
      playerName: "Alban",
      score: 48,
    });
  });

  it("registers a bleu-rouge bet won by the current player with the last dice combination rule effects", async () => {
    const resolver = {
      getResolution: jest.fn().mockResolvedValue({
        diceRoll: [2, 2, 2],
        bids: [{ playerName: "Alban", bet: 6 }],
      } as BleuRougeResolution),
    };

    const aRuleEffect: RuleEffect = {
      event: RuleEffectEvent.CUL_DE_CHOUETTE,
      playerName: "Alban",
      score: 60,
    };

    const rule = new BleuRougeRule(resolver);
    const runnerMock = {} as RuleRunner;
    runnerMock.handleDiceRoll = jest.fn().mockResolvedValue([aRuleEffect]);
    runnerMock.getFirstApplicableRule = jest
      .fn()
      .mockResolvedValue(new CulDeChouetteRule());

    const context = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .withRuleRunner(runnerMock)
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>(aRuleEffect);
  });

  it("registers an add jarret effect for the current player if the combination is a Neant, without adding a grelottine, when the last bet is not won by someone", async () => {
    /* Case scenario:
     *  Alban rolls a Bleu-Rouge
     *  Delphin bets 10 | Alban bets whatever false...
     *  Alban rolls another Bleu-Rouge
     *  Delphin wins the bet, the second Bleu-rouge is applied to Delphin
     *  Alban & Delphin bet whatever false
     *  Delphin rolls a Neant, nobody wins the bet
     *  Delphin wins a Jarret, Alban doesn't
     * */
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValueOnce({
          diceRoll: [3, 3, 4],
          bids: [
            { playerName: "Delphin", bet: 10 },
            { playerName: "Alban", bet: 6 },
          ],
        })
        .mockResolvedValueOnce({
          diceRoll: [1, 3, 5],
          bids: [
            { playerName: "Delphin", bet: 3 },
            { playerName: "Alban", bet: 4 },
          ],
        }),
    };

    const rule = new BleuRougeRule(resolver);
    const runner = new RuleRunner([
      new BleuRougeRule(resolver),
      new NeantRule(),
    ]);

    const context = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .withRuleRunner(runner)
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.BLEU_ROUGE,
      playerName: "Delphin",
      score: 9,
    });

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_GRELOTTINE,
      playerName: "Delphin",
      score: 0,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_JARRET,
      playerName: "Delphin",
      score: 0,
    });

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_JARRET,
      playerName: "Alban",
      score: 0,
    });
  });

  it("registers an add jarret effect for the current player if the combination is a Neant, without adding a grelottine, when the last bet is won by the first current player", async () => {
    /* Case scenario:
     *  Alban rolls a Bleu-Rouge
     *  Delphin bets 10 | Alban bets whatever false...
     *  Alban rolls another Bleu-Rouge
     *  Delphin wins the bet, the second Bleu-rouge is applied to Delphin
     *  Alban bets 11 | Delphin bets whatever false
     *  Delphin rolls a Neant, Alban wins the bet
     *  Delphin wins a Jarret, Alban doesn't
     * */
    const resolver = {
      getResolution: jest
        .fn()
        .mockResolvedValueOnce({
          diceRoll: [3, 3, 4],
          bids: [
            { playerName: "Delphin", bet: 10 },
            { playerName: "Alban", bet: 6 },
          ],
        })
        .mockResolvedValueOnce({
          diceRoll: [6, 4, 1],
          bids: [
            { playerName: "Delphin", bet: 3 },
            { playerName: "Alban", bet: 11 },
          ],
        }),
    };

    const rule = new BleuRougeRule(resolver);
    const runner = new RuleRunner([
      new BleuRougeRule(resolver),
      new NeantRule(),
    ]);

    const context = DummyContextBuilder.aDiceRollContext()
      .withPlayerName("Alban")
      .withDiceRoll([3, 3, 4])
      .withRuleRunner(runner)
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_GRELOTTINE,
      playerName: "Delphin",
      score: 0,
    });

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_GRELOTTINE,
      playerName: "Alban",
      score: 0,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_JARRET,
      playerName: "Delphin",
      score: 0,
    });

    expect(ruleEffects).not.toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_JARRET,
      playerName: "Alban",
      score: 0,
    });
  });
});
