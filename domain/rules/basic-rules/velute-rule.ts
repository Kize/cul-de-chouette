import { DiceRoll, GameContext, Rule, RuleEffects, RuleEffetType } from '../rule';
import { HistoryLineType } from '../../../src/domain/history';

export class VeluteRule implements Rule {
  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    return isVelute(diceRoll);
  }

  applyRule({ currentPlayerName, diceRoll }: GameContext): RuleEffects {
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
