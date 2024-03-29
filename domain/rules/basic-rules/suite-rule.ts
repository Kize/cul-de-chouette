import { Resolver } from "../rule-resolver";
import { getVeluteValue, isVelute } from "./velute-rule";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Rules } from "../rule";

export interface SuiteResolution {
  loosingPlayerName: string;
  multiplier: number;
}

export interface SuiteResolutionPayload {
  playerName: string;
}

export class SuiteRule extends DiceRule {
  name = Rules.SUITE;

  constructor(
    private readonly resolver: Resolver<SuiteResolution, SuiteResolutionPayload>
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
  }

  async applyDiceRule({
    diceRoll,
    playerName,
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const ruleEffects: RuleEffects = [];

    if (isVelute(diceRoll) && runner.isRuleEnabled(Rules.VELUTE)) {
      ruleEffects.push({
        event: RuleEffectEvent.SUITE_VELUTE,
        playerName,
        score: getVeluteValue(diceRoll),
      });
    }

    const suiteResolution = await this.resolver.getResolution({ playerName });

    ruleEffects.push({
      event: RuleEffectEvent.SUITE,
      playerName: suiteResolution.loosingPlayerName,
      score: -10 * suiteResolution.multiplier,
    });

    return ruleEffects;
  }
}
