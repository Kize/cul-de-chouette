import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";

export class CulDeChouetteRule extends DiceRule {
  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return dieValue1 === dieValue2 && dieValue1 === dieValue3;
  }

  applyDiceRule(context: DiceRollGameContext): RuleEffects {
    const score = getCulDeChouetteScore(context.diceRoll);
    return [
      {
        playerName: context.playerName,
        event: RuleEffectEvent.CUL_DE_CHOUETTE,
        score,
      },
    ];
  }
}

export function getCulDeChouetteScore(diceRoll: DiceRoll): number {
  return 40 + 10 * diceRoll[0];
}
