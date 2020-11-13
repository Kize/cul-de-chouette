import { Resolver } from "../rule-resolver";
import { getVeluteValue, isVelute } from "./velute-rule";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export interface SuiteResolution {
  loosingPlayerName: string;
  multiplier: number;
}

export class SuiteRule extends DiceRule {
  constructor(private readonly resolver: Resolver<SuiteResolution>) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
  }

  async applyDiceRule({
    diceRoll,
    currentPlayerName,
  }: PlayTurnGameContext): Promise<RuleEffects> {
    const ruleEffects: RuleEffects = [];

    if (isVelute(diceRoll)) {
      ruleEffects.push({
        event: RuleEffectEvent.VELUTE,
        playerName: currentPlayerName,
        score: getVeluteValue(diceRoll),
      });
    }

    const suiteResolution = await this.resolver.getResolution();

    ruleEffects.push({
      event: RuleEffectEvent.SUITE,
      playerName: suiteResolution.loosingPlayerName,
      score: -10 * suiteResolution.multiplier,
    });

    return ruleEffects;
  }
}
