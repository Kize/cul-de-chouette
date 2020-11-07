import { DiceRoll, GameContext, Rule, RuleEffects, RuleEffetType } from '@/domain/rules/rule';
import { HistoryLineType } from '@/domain/history';

export class ChouetteRule implements Rule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return (
      dieValue1 === dieValue2 ||
      dieValue1 === dieValue3 ||
      dieValue2 === dieValue3
    );
  }

  applyRule({ currentPlayerName, diceRoll }: GameContext): RuleEffects {
    const [dieValue1, dieValue2, dieValue3] = diceRoll;
    const chouetteValue =
      dieValue1 === dieValue2 || dieValue1 === dieValue3
        ? dieValue1
        : dieValue2;

    const score = chouetteValue ** 2;
    return [
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE,
        playerName: currentPlayerName,
        score,
      },
    ];
  }
}
