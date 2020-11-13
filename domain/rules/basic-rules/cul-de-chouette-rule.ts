import { HistoryLineType } from "@/domain/history";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects, RuleEffectType } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class CulDeChouetteRule extends DiceRule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return dieValue1 === dieValue2 && dieValue1 === dieValue3;
  }

  applyDiceRule(context: PlayTurnGameContext): RuleEffects {
    const score = getCulDeChouetteScore(context.diceRoll);
    return [
      {
        type: RuleEffectType.CHANGE_SCORE,
        playerName: context.currentPlayerName,
        designation: HistoryLineType.CUL_DE_CHOUETTE,
        score,
      },
    ];
  }
}

export function getCulDeChouetteScore(diceRoll: DiceRoll): number {
  return 40 + 10 * diceRoll[0];
}
