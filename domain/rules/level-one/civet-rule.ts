import { Rule } from "../rule";
import { RuleEffectEvent, RuleEffects } from "../rule-effect";
import {
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from "../../game-context-event";
import { Resolver } from "../rule-resolver";
import { DiceRoll } from "../dice-rule";

export interface CivetResolution {
  diceRoll: DiceRoll;
  betAmount: number;
  playerBet: CivetBet;
}

export enum CivetBet {
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  CHOUETTE_VELUTE = "Chouette-Velute",
  CUL_DE_CHOUETTE = "Cul de chouette",
  SUITE = "Suite",
  SOUFFLETTE = "Soufflette",
  BLEU_ROUGE = "Bleu-Rouge",
  SIROP_GRELOT = "Sirop-Grelot",
  // ARTICHETTE = "Artichette",
  // PELICAN = "Pélican",
  // FLAN = "Flan",
}

export interface CivetResolutionPayload {
  playerName: string;
}

export class CivetRule implements Rule {
  constructor(
    private readonly resolver: Resolver<CivetResolution, CivetResolutionPayload>
  ) {}

  isApplicableToGameContext(context: UnknownGameContext): boolean {
    return context.event === GameContextEvent.CIVET_BET;
  }

  async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
    const { runner, playerName } = context.asCivet();

    const { diceRoll, playerBet, betAmount } =
      await this.resolver.getResolution({ playerName });

    const diceRollRuleEffects = await runner.handleGameEvent({
      event: GameContextEvent.DICE_ROLL,
      diceRoll,
      playerName,
      runner,
    });

    const isCivetWon = civetBetToRuleEffectsToCheck[playerBet].has(
      diceRollRuleEffects[0].event
    );
    const civetRuleEffects: RuleEffects = [
      { event: RuleEffectEvent.REMOVE_CIVET, playerName, score: 0 },
    ];

    if (isCivetWon) {
      civetRuleEffects.push({
        event: RuleEffectEvent.CIVET_WON,
        playerName,
        score: betAmount,
      });
    } else {
      civetRuleEffects.push({
        event: RuleEffectEvent.CIVET_LOST,
        playerName,
        score: -betAmount,
      });
    }

    return [...civetRuleEffects, ...diceRollRuleEffects];
  }
}

const civetBetToRuleEffectsToCheck: Record<CivetBet, Set<RuleEffectEvent>> = {
  [CivetBet.SUITE]: new Set([
    RuleEffectEvent.SUITE,
    RuleEffectEvent.SUITE_VELUTE,
  ]),
  [CivetBet.CHOUETTE]: new Set([RuleEffectEvent.CHOUETTE]),
  [CivetBet.CHOUETTE_VELUTE]: new Set([
    RuleEffectEvent.CHOUETTE_VELUTE_WON,
    RuleEffectEvent.CHOUETTE_VELUTE_LOST,
    RuleEffectEvent.CHOUETTE_VELUTE_STOLEN,
  ]),
  [CivetBet.CUL_DE_CHOUETTE]: new Set([RuleEffectEvent.CUL_DE_CHOUETTE]),
  [CivetBet.VELUTE]: new Set([
    RuleEffectEvent.VELUTE,
    RuleEffectEvent.SUITE_VELUTE,
  ]),
  [CivetBet.SIROP_GRELOT]: new Set([RuleEffectEvent.SIROP_WON]),
  [CivetBet.SOUFFLETTE]: new Set([
    RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE,
    RuleEffectEvent.SOUFFLETTE_WON,
    RuleEffectEvent.SOUFFLETTE_LOST,
  ]),
  [CivetBet.BLEU_ROUGE]: new Set([RuleEffectEvent.BLEU_ROUGE]),
};
