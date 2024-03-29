import { getVeluteValue } from "./velute-rule";
import { Resolver } from "../rule-resolver";
import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Rules } from "../rule";

export interface ChouetteVeluteResolution {
  playerNames: Array<string>;
}

export interface ChouetteVeluteResolutionPayload {
  playerName: string;
}

export class ChouetteVeluteRule extends DiceRule {
  name = Rules.CHOUETTE_VELUTE;

  constructor(
    private readonly resolver: Resolver<
      ChouetteVeluteResolution,
      ChouetteVeluteResolutionPayload
    >
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === dieValue2 && dieValue1 + dieValue2 === dieValue3;
  }

  async applyDiceRule({
    diceRoll,
    playerName,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const { playerNames } = await this.resolver.getResolution({ playerName });

    const effects: RuleEffects = [];

    if (!playerNames.includes(playerName)) {
      effects.push({
        event: RuleEffectEvent.CHOUETTE_VELUTE_STOLEN,
        playerName,
        score: 0,
      });
    }

    const veluteValue = getVeluteValue(diceRoll);
    const isChouetteVeluteWon = playerNames.length === 1;
    const score = isChouetteVeluteWon ? veluteValue : -veluteValue;
    const event = isChouetteVeluteWon
      ? RuleEffectEvent.CHOUETTE_VELUTE_WON
      : RuleEffectEvent.CHOUETTE_VELUTE_LOST;

    playerNames.forEach((playerName) => {
      effects.push({
        event,
        score,
        playerName,
      });
    });

    return effects;
  }
}
