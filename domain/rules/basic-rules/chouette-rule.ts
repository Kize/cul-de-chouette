import { HistoryLineType } from "@/domain/history";
import { DiceRoll, DiceRule, DieValue } from '../dice-rule';
import { ChangeScoreRuleEffect, RuleEffects, RuleEffetType } from '../rule-effect';
import { GameContext, PlayTurnGameContext } from '../../game-context-event';

export class ChouetteRule extends DiceRule {
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

  async applyDiceRule({
    currentPlayerName,
    diceRoll,
  }: PlayTurnGameContext): Promise<RuleEffects> {
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
