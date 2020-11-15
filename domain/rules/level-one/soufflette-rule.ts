import { DiceRoll, DiceRule } from "../dice-rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Resolver } from "../rule-resolver";

export interface SouffletteResolution {
  isChallenge: boolean;
  challengedPlayer: string;
  diceThrowsNumber: 1 | 2 | 3;
  diceRoll: DiceRoll;
}

export class SouffletteRule extends DiceRule {
  constructor(private readonly resolver: Resolver<SouffletteResolution>) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === 1 && dieValue2 === 2 && dieValue3 === 4;
  }

  async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
    const resolution = await this.resolver.getResolution();

    if (!resolution.isChallenge) {
      return [
        {
          event: RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE,
          playerName: context.playerName,
          score: 0,
        },
      ];
    }

    const isChallengeWonByChallengedPlayer = this.isApplicableToDiceRoll(
      resolution.diceRoll
    );

    if (isChallengeWonByChallengedPlayer) {
      const challengeScore = (3 - resolution.diceThrowsNumber) * 10 + 30;
      return [
        {
          event: RuleEffectEvent.SOUFFLETTE_WON,
          playerName: resolution.challengedPlayer,
          score: challengeScore,
        },
        {
          event: RuleEffectEvent.SOUFFLETTE_LOST,
          playerName: context.playerName,
          score: -challengeScore,
        },
      ];
    }

    const challengedPlayerContext: DiceRollGameContext = {
      ...context,
      playerName: resolution.challengedPlayer,
      diceRoll: resolution.diceRoll,
    };

    const lastDiceRollRuleEffects = await context.runner.handleDiceRoll(
      challengedPlayerContext
    );

    return [
      ...lastDiceRollRuleEffects,
      {
        event: RuleEffectEvent.SOUFFLETTE_WON,
        playerName: context.playerName,
        score: 30,
      },
      {
        event: RuleEffectEvent.SOUFFLETTE_LOST,
        playerName: resolution.challengedPlayer,
        score: -30,
      },
    ];
  }
}
