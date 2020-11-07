import { DiceRoll, GameContext, Rule, RuleEffects, RuleEffetType } from '@/domain/rules/rule';
import { HistoryLineType } from '@/domain/history';

export class CulDeChouetteRule implements Rule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return dieValue1 === dieValue2 && dieValue1 === dieValue3;
  }

  applyRule(context: GameContext): RuleEffects {
    const score = 40 + 10 * context.diceRoll[0];
    return [
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: context.currentPlayerName,
        designation: HistoryLineType.CUL_DE_CHOUETTE,
        score,
      },
    ];
  }
}
