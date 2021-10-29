import { DiceRoll, DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { DiceRollGameContext } from "../../game-context-event";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { Resolver } from "../rule-resolver";

export interface ArtichetteResolution {
  isRaitournelleClaimed: boolean;
}

export interface ArtichetteResolutionPayload {
  playerName: string;
}

export class ArtichetteRule extends DiceRule {
  name = Rules.ARTICHETTE;

  constructor(
    private readonly resolver: Resolver<
      ArtichetteResolution,
      ArtichetteResolutionPayload
    >
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 3 && dieValue2 === 4 && dieValue3 === 4;
  }

  async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
    const { isRaitournelleClaimed } = await this.resolver.getResolution({
      playerName: context.playerName,
    });

    return [
      {
        event: RuleEffectEvent.ARTICHETTE,
        score: isRaitournelleClaimed ? 16 : -16,
        playerName: context.playerName,
      },
    ];
  }
}
