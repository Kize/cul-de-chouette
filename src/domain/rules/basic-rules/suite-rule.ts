import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "@/domain/rules/rule";

export interface SuiteResolver {
  getSuiteResolution: () => Promise<SuiteResolution>;
}

export interface SuiteResolution {
  loosingPlayerName: string;
  multiplier: number;
}

export class SuiteRule implements Rule {
  constructor(private readonly resolver: SuiteResolver) {}

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
  }

  async applyRule(_: GameContext): Promise<RuleEffects> {
    const suiteResolution = await this.resolver.getSuiteResolution();

    return [
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: suiteResolution.loosingPlayerName,
        score: -10 * suiteResolution.multiplier,
      },
    ];
  }
}
