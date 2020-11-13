import { getVeluteValue } from "./velute-rule";
import { HistoryLineType } from "@/domain/history";
import { Resolver } from "../rule-resolver";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffects, RuleEffectType } from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

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

  async applyDiceRule({
    diceRoll,
    currentPlayerName,
  }: PlayTurnGameContext): Promise<RuleEffects> {
    const { playerNames } = await this.resolver.getResolution();

    const effects: RuleEffects = [];

    if (!playerNames.includes(currentPlayerName)) {
      effects.push({
        type: RuleEffectType.CHANGE_SCORE,
        designation: HistoryLineType.CHOUETTE_VELUTE_NOT_CLAIMED,
        playerName: currentPlayerName,
        score: 0,
      });
    }

    const veluteValue = getVeluteValue(diceRoll);
    const isChouetteVeluteWon = playerNames.length === 1;
    const score = isChouetteVeluteWon ? veluteValue : -veluteValue;
    const event = isChouetteVeluteWon
      ? HistoryLineType.CHOUETTE_VELUTE_WON
      : HistoryLineType.CHOUETTE_VELUTE_LOST;

    playerNames.forEach((playerName) => {
      effects.push({
        type: RuleEffectType.CHANGE_SCORE,
        designation: event,
        score,
        playerName,
      });
    });

    return effects;
  }
}
