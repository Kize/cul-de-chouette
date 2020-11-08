import { DiceRoll, GameContext, Rule, RuleEffects, RuleEffetType } from '../rule';
import { HistoryLineType } from '../../../src/domain/history';

export class NeantRule implements Rule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyRule(context: GameContext): RuleEffects {
    return [
      {
        type: RuleEffetType.ADD_GRELOTTINE,
        playerName: context.currentPlayerName,
      },
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.NEANT,
        playerName: context.currentPlayerName,
        score: 0,
      },
    ];
  }
}