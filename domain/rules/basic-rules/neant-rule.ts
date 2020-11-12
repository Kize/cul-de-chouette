import { HistoryLineType } from '@/domain/history';
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects, RuleEffetType } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class NeantRule extends DiceRule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyRule(context: PlayTurnGameContext): RuleEffects {
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
