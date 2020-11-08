import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "../rule";
import { Resolver } from "../rule-resolver";
import { getVeluteValue, isVelute } from "./velute-rule";
import { HistoryLineType } from "@/domain/history";

export interface SuiteResolution {
  loosingPlayerName: string;
  multiplier: number;
}

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
        designation: HistoryLineType.VELUTE,
        playerName: currentPlayerName,
        score: getVeluteValue(diceRoll),
      });
    }

    const suiteResolution = await this.resolver.getResolution();

    ruleEffects.push({
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SUITE,
      playerName: suiteResolution.loosingPlayerName,
      score: -10 * suiteResolution.multiplier,
    });

    return ruleEffects;
  }
}
