import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "@/domain/rules/rule";
import { SuiteResolution } from "@/store/current-game/resolver/suite-rule-resolver";
import { Resolver } from "@/store/current-game/resolver/rule-resolver";
import {
  getVeluteValue,
  isVelute,
} from "@/domain/rules/basic-rules/velute-rule";

export class SuiteRule implements Rule {
  constructor(private readonly resolver: Resolver<SuiteResolution>) {}

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
  }

  async applyRule({
    diceRoll,
    currentPlayerName,
  }: GameContext): Promise<RuleEffects> {
    const ruleEffects: RuleEffects = [];

    if (isVelute(diceRoll)) {
      ruleEffects.push({
        type: RuleEffetType.CHANGE_SCORE,
        playerName: currentPlayerName,
        score: getVeluteValue(diceRoll),
      });
    }

    const suiteResolution = await this.resolver.getResolution();

    ruleEffects.push({
      type: RuleEffetType.CHANGE_SCORE,
      playerName: suiteResolution.loosingPlayerName,
      score: -10 * suiteResolution.multiplier,
    });

    return ruleEffects;
  }
}
