import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "../rule";
import { getVeluteValue } from "./velute-rule";
import { HistoryLineType } from '@/domain/history';
import { Resolver } from '../rule-resolver';

export interface ChouetteVeluteResolution {
  playerNames: Array<string>;
}

export class ChouetteVeluteRule implements Rule {
  constructor(private readonly resolver: Resolver<ChouetteVeluteResolution>) {}

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === dieValue2 && dieValue1 + dieValue2 === dieValue3;
  }

  async applyRule({
    diceRoll,
    currentPlayerName,
  }: GameContext): Promise<RuleEffects> {
    const { playerNames } = await this.resolver.getResolution();

    const effects: RuleEffects = [];

    if (!playerNames.includes(currentPlayerName)) {
      effects.push({
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        playerName: currentPlayerName,
        score: 0,
      });
    }

    const veluteValue = getVeluteValue(diceRoll);
    const score = playerNames.length === 1 ? veluteValue : -veluteValue;

    playerNames.forEach((playerName) => {
      effects.push({
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE,
        score,
        playerName,
      });
    });

    return effects;
  }
}
