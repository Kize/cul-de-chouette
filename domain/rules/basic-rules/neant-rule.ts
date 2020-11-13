import { HistoryLineType } from "@/domain/history";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects, RuleEffectType } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class NeantRule extends DiceRule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyDiceRule(context: PlayTurnGameContext): RuleEffects {
    return [
      {
        type: RuleEffectType.ADD_GRELOTTINE,
        playerName: context.currentPlayerName,
      },
      {
        type: RuleEffectType.CHANGE_SCORE,
        designation: HistoryLineType.NEANT,
        playerName: context.currentPlayerName,
        score: 0,
      },
    ];
  }
}
