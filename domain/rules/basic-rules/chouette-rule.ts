import {
  ChangeScoreRuleEffect,
  DiceRoll,
  DieValue,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "../rule";
import { HistoryLineType } from "../../../src/domain/history";

export class ChouetteRule implements Rule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return (
      dieValue1 === dieValue2 ||
      dieValue1 === dieValue3 ||
      dieValue2 === dieValue3
    );
  }

  protected getChouetteRuleEffect(
    playerName: string,
    diceRoll: DiceRoll
  ): ChangeScoreRuleEffect {
    const score = this.getChouetteScore(diceRoll);
    return {
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.CHOUETTE,
      playerName,
      score,
    };
  }

  async applyRule({
    currentPlayerName,
    diceRoll,
  }: GameContext): Promise<RuleEffects> {
    return [this.getChouetteRuleEffect(currentPlayerName, diceRoll)];
  }

  protected getChouetteScore(diceRoll: DiceRoll): number {
    const chouetteValue = this.getChouetteValue(diceRoll);

    return chouetteValue ** 2;
  }

  protected getChouetteValue([
    dieValue1,
    dieValue2,
    dieValue3,
  ]: DiceRoll): DieValue {
    return dieValue1 === dieValue2 || dieValue1 === dieValue3
      ? dieValue1
      : dieValue2;
  }
}
