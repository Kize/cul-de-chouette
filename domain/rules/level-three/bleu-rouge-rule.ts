import { DiceRoll } from "../dice-rule";
import { DiceRollGameContext } from "../../game-context-event";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { Resolver } from "../rule-resolver";
import { ChouetteRule } from "../basic-rules/chouette-rule";

export interface BleuRougeResolution {
  diceRoll: DiceRoll;
  bids: Array<BleuRougeBid>;
}

export class BleuRougeRule extends ChouetteRule {
  constructor(private readonly resolver: Resolver<BleuRougeResolution>) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 3 && dieValue2 === 3 && dieValue3 === 4;
  }

  async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
    const [chouetteRuleEffect] = await super.applyDiceRule(context);

    const initialBleuRougeRulEffect: RuleEffect = {
      ...chouetteRuleEffect,
      event: RuleEffectEvent.BLEU_ROUGE,
    };

    const { bids, diceRoll } = await this.resolver.getResolution();

    const addJarretRuleEffects: RuleEffects = [];
    const secondRollContext: DiceRollGameContext = { ...context, diceRoll };
    if (context.runner.isDiceRollANeant(secondRollContext)) {
      addJarretRuleEffects.push({
        event: RuleEffectEvent.ADD_JARRET,
        playerName: context.playerName,
        score: 0,
      });
    }

    const diceRollSum = diceRoll.reduce((sum, dieValue) => sum + dieValue, 0);
    const winningBid = bids.find((bid) => bid.bet === diceRollSum);

    if (!winningBid) {
      return [...addJarretRuleEffects, initialBleuRougeRulEffect];
    }

    const bleuRougeBidRuleEffect: RuleEffect = {
      event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
      playerName: winningBid.playerName,
      score: 36 + 2 * winningBid.bet,
    };

    const winningBetGameContext: DiceRollGameContext = {
      ...context,
      playerName: winningBid.playerName,
      diceRoll,
    };
    const winningBidCombinationRuleEffects = await context.runner.handleDiceRoll(
      winningBetGameContext
    );

    const finalRuleEffects = [
      initialBleuRougeRulEffect,
      bleuRougeBidRuleEffect,
      ...addJarretRuleEffects,
      ...winningBidCombinationRuleEffects,
    ];

    return finalRuleEffects.filter(
      (ruleEffect) => ruleEffect.event !== RuleEffectEvent.ADD_GRELOTTINE
    );
  }
}

export interface BleuRougeBid {
  playerName: string;
  bet: BleuRougeBetValue;
}

export type BleuRougeBetValue =
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;
