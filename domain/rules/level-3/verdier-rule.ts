import { Rule, Rules } from "../rule";
import {
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from "../../game-context-event";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRoll, DieValue } from "../dice-rule";
import { Resolver } from "../rule-resolver";
import { isVelute } from "../basic-rules/velute-rule";
import { DiceForm } from "@/components/dice/dice-form";

export interface VerdierResolution {
  bettingPlayerNames: Array<string>;
  lastDieValue: DieValue;
}

export interface VerdierResolutionPayload {
  playerName: string;
  diceValues: [DieValue, DieValue];
}

export class VerdierRule implements Rule {
  name = Rules.VERDIER;

  constructor(
    private readonly resolver: Resolver<
      VerdierResolution,
      VerdierResolutionPayload
    >
  ) {}

  isApplicableToGameContext(context: UnknownGameContext): boolean {
    return context.event === GameContextEvent.VERDIER;
  }

  async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
    const { runner, playerName, diceValues } = context.asVerdier();

    const { bettingPlayerNames, lastDieValue } =
      await this.resolver.getResolution({
        playerName,
        diceValues,
      });

    const diceRoll: DiceRoll = [...diceValues, lastDieValue];

    const diceRollRuleEffects = await runner.handleGameEvent({
      event: GameContextEvent.DICE_ROLL,
      diceRoll,
      runner,
      playerName,
    });

    const isVerdierWon = isVelute(diceRoll);

    return [
      ...diceRollRuleEffects,
      ...bettingPlayerNames.map<RuleEffect>((bettingPlayer) => {
        if (isVerdierWon) {
          return {
            event: RuleEffectEvent.VERDIER_WON,
            score: 25,
            playerName: bettingPlayer,
          };
        }

        return {
          event: RuleEffectEvent.VERDIER_LOST,
          score: -5,
          playerName: bettingPlayer,
        };
      }),
    ];
  }
}

export function isVerdierApplicable(diceForm: DiceForm): boolean {
  const numberOfValidDieValue = diceForm.reduce((acc: number, dieFormValue) => {
    if (dieFormValue === 2 || dieFormValue === 4 || dieFormValue === 6) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return numberOfValidDieValue > 1;
}
