import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Rules } from "../rule";

export class CulDeChouetteRule extends DiceRule {
  name = Rules.CUL_DE_CHOUETTE;

  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return dieValue1 === dieValue2 && dieValue1 === dieValue3;
  }

  applyDiceRule(context: DiceRollGameContext): RuleEffects {
    const score = getCulDeChouetteScore(context.diceRoll);
    return [
      {
        event: RuleEffectEvent.CUL_DE_CHOUETTE,
        playerName: context.playerName,
        score,
      },
    ];
  }
}

export function getCulDeChouetteScore(diceRoll: DiceRoll): number {
  return 40 + 10 * diceRoll[0];
}
