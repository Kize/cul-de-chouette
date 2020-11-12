import { HistoryLineType } from "@/domain/history";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects, RuleEffetType } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export class VeluteRule extends DiceRule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    return isVelute(diceRoll);
  }

  applyDiceRule({
    currentPlayerName,
    diceRoll,
  }: PlayTurnGameContext): RuleEffects {
    const score = getVeluteValue(diceRoll);

    return [
      {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.VELUTE,
        playerName: currentPlayerName,
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
