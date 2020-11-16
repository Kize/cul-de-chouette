import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";

export class VeluteRule extends DiceRule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    return isVelute(diceRoll);
  }

  applyDiceRule({
    playerName,
    diceRoll,
  }: DiceRollGameContext): RuleEffects {
    const score = getVeluteValue(diceRoll);

    return [
      {
        event: RuleEffectEvent.VELUTE,
        playerName,
        score,
      },
    ];
  }
}

export function isVelute(diceRoll: DiceRoll): boolean {
  const sortedValues = [...diceRoll].sort();
  return sortedValues[0] + sortedValues[1] === sortedValues[2];
}

export function getVeluteValue(diceRoll: DiceRoll): number {
  const veluteValue = [...diceRoll].sort().pop();

  return 2 * (veluteValue || 0) ** 2;
}
