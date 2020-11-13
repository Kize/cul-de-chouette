import { Rule } from "../rule";
import {
  ChangeScoreRuleEffect,
  RuleEffects,
  RuleEffectType,
} from "../rule-effect";
import {
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from "../../game-context-event";
import { Resolver } from "../rule-resolver";
import { DiceRoll } from "../dice-rule";
import { HistoryLineType } from "@/domain/history";

export interface GrelottineResolution {
  grelottinPlayer: string;
  challengedPlayer: string;
  grelottinBet: GrelottineBet;
  gambledAmount: number;
  diceRoll: DiceRoll;
}

export class GrelottineRule implements Rule {
  constructor(private readonly resolver: Resolver<GrelottineResolution>) {}

  isApplicableToGameContext(context: UnknownGameContext): boolean {
    return context.event === GameContextEvent.CHALLENGE_GRELOTTINE;
  }

  async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
    const resolution = await this.resolver.getResolution();

    const lastCombinationRuleEffects = await context
      .asChallengeGrelottine()
      .runner.handleDiceRoll({
        event: GameContextEvent.PLAY_TURN,
        currentPlayerName: resolution.challengedPlayer,
        diceRoll: resolution.diceRoll,
      });

    // TODO DAU : remove the `as ChangeScoreRuleEffect` when all rule effects would have the same shape
    const isGrelottineWon = lastCombinationRuleEffects.some(
      (lastCombinationRuleEffect) =>
        grelottineBetToRuleEffectsToCheck[resolution.grelottinBet].has(
          (lastCombinationRuleEffect as ChangeScoreRuleEffect).designation
        )
    );

    const getLoserScore = () => -resolution.gambledAmount;
    const getWinnerScore = () => resolution.gambledAmount;

    return [
      {
        type: RuleEffectType.REMOVE_GRELOTTINE,
        playerName: resolution.grelottinPlayer,
      },
      ...lastCombinationRuleEffects,
      {
        type: RuleEffectType.CHANGE_SCORE,
        designation: isGrelottineWon
          ? HistoryLineType.GRELOTTINE_CHALLENGE_LOST
          : HistoryLineType.GRELOTTINE_CHALLENGE_WON,
        playerName: resolution.grelottinPlayer,
        score: isGrelottineWon ? getLoserScore() : getWinnerScore(),
      },
      {
        type: RuleEffectType.CHANGE_SCORE,
        designation: isGrelottineWon
          ? HistoryLineType.GRELOTTINE_CHALLENGE_WON
          : HistoryLineType.GRELOTTINE_CHALLENGE_LOST,
        playerName: resolution.challengedPlayer,
        score: isGrelottineWon ? getWinnerScore() : getLoserScore(),
      },
    ];
  }
}

export enum GrelottineBet {
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  CUL_DE_CHOUETTE = "Cul de chouette",
  CHOUETTE_VELUTE = "Chouette-velute",
  SIROP_GRELOT = "Sirop-grelot",
}

const grelottineBetToRuleEffectsToCheck: Record<
  GrelottineBet,
  Set<HistoryLineType>
> = {
  [GrelottineBet.CHOUETTE]: new Set([HistoryLineType.CHOUETTE]),
  [GrelottineBet.CHOUETTE_VELUTE]: new Set([
    HistoryLineType.CHOUETTE_VELUTE_WON,
    HistoryLineType.CHOUETTE_VELUTE_LOST,
  ]),
  [GrelottineBet.CUL_DE_CHOUETTE]: new Set([HistoryLineType.CUL_DE_CHOUETTE]),
  [GrelottineBet.VELUTE]: new Set([HistoryLineType.VELUTE]),
  [GrelottineBet.SIROP_GRELOT]: new Set([HistoryLineType.SIROP_WON]),
};

export function getMaxGrelottinePossibleAmount(
  lowestScore: number,
  challenge: GrelottineBet
): number {
  let percentage: number;
  switch (challenge) {
    case GrelottineBet.CHOUETTE:
      percentage = 0.33;
      break;
    case GrelottineBet.VELUTE:
      percentage = 0.25;
      break;
    case GrelottineBet.CUL_DE_CHOUETTE:
      percentage = 0.12;
      break;
    case GrelottineBet.CHOUETTE_VELUTE:
      percentage = 0.06;
      break;
    case GrelottineBet.SIROP_GRELOT:
      percentage = 0.03;
      break;
  }
  return Math.ceil(lowestScore * percentage);
}
