import { getVeluteValue } from "./velute-rule";
import { HistoryLineType } from "@/domain/history";
import { Resolver } from "../rule-resolver";
import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffects, RuleEffetType } from '../rule-effect';
import { GameContext, PlayTurnGameContext } from '../../game-context-event';

export interface ChouetteVeluteResolution {
  playerNames: Array<string>;
}

export class ChouetteVeluteRule extends DiceRule {
  constructor(private readonly resolver: Resolver<ChouetteVeluteResolution>) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === dieValue2 && dieValue1 + dieValue2 === dieValue3;
  }

  async applyRule({
    diceRoll,
    currentPlayerName,
  }: PlayTurnGameContext): Promise<RuleEffects> {
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
