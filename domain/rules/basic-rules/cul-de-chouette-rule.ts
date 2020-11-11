import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "../rule";
import { HistoryLineType } from "../../../src/domain/history";

export class CulDeChouetteRule implements Rule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return dieValue1 === dieValue2 && dieValue1 === dieValue3;
  }

  applyRule(context: GameContext): RuleEffects {
    const score = getCulDeChouetteScore(context.diceRoll);
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

export function getCulDeChouetteScore(diceRoll: DiceRoll) {
  return 40 + 10 * diceRoll[0];
}
