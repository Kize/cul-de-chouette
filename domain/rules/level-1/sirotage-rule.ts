import { ChouetteRule } from "../basic-rules/chouette-rule";
import { Resolver } from "../rule-resolver";
import { getCulDeChouetteScore } from "../basic-rules/cul-de-chouette-rule";
import { DiceRoll, DieValue } from "../dice-rule";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { RuleRunner } from "../../rule-runner";
import { Rules } from "../rule";
import {
  BidType,
  dieValueToBidType,
  PlayableBid,
  SiropBid,
  SIROTAGE_BID_TYPES,
} from "./sirotage-rule.types";

export interface SiropResolutionPayload {
  playerName: string;
  playableBids: Array<PlayableBid>;
  chouetteValue: DieValue;
}

export type SirotageResolution = { isSirote: false } | ActiveSirotageResolution;

export interface ActiveSirotageResolution {
  isSirote: true;
  lastDieValue: DieValue;
  bids: Array<SiropBid>;
}

export class SirotageRule extends ChouetteRule {
  constructor(
    private readonly sirotageResolver: Resolver<
      SirotageResolution,
      SiropResolutionPayload
    >
  ) {
    super();
  }

  protected getPlayableBids(
    chouetteValue: DieValue,
    ruleBidTypes: Array<BidType>
  ): Array<PlayableBid> {
    const disableBidType = dieValueToBidType.get(chouetteValue);
    return ruleBidTypes.map((bidType) => ({
      type: bidType,
      isPlayable: bidType !== disableBidType,
    }));
  }

  async applyDiceRule({
    playerName,
    diceRoll,
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const resolution = await this.sirotageResolver.getResolution({
      playerName,
      chouetteValue,
      playableBids: this.getPlayableBids(chouetteValue, SIROTAGE_BID_TYPES),
    });

    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(playerName, diceRoll)];
    }

    const sirotageRuleEffects = this.getSirotageRuleEffects(
      playerName,
      diceRoll,
      resolution,
      runner
    );
    const bidRuleEffects = this.getBidRuleEffects(resolution, diceRoll);
    return [...sirotageRuleEffects, ...bidRuleEffects];
  }

  protected mapPlayerBidToRuleEffect(
    playerBid: SiropBid,
    diceRoll: DiceRoll,
    lastDieValue: DieValue
  ): RuleEffect {
    let score: number;

    const winningBet =
      lastDieValue === this.getChouetteValue(diceRoll)
        ? BidType.BEAU_SIROP
        : dieValueToBidType.get(lastDieValue);

    let event: RuleEffectEvent;
    if (playerBid.playerBid === winningBet) {
      score = playerBid.isBidValidated ? 25 : 0;
      event = playerBid.isBidValidated
        ? RuleEffectEvent.SIROP_BET_WON
        : RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED;
    } else if (playerBid.playerBid === BidType.COUCHE_SIROP) {
      score = 0;
      event = RuleEffectEvent.SIROP_BET_SKIPPED;
    } else {
      score = -5;
      event = RuleEffectEvent.SIROP_BET_LOST;
    }

    return {
      event,
      playerName: playerBid.playerName,
      score,
    };
  }

  protected getBidRuleEffects(
    resolution: ActiveSirotageResolution,
    diceRoll: [DieValue, DieValue, DieValue]
  ): RuleEffects {
    return resolution.bids.map((playerBid) =>
      this.mapPlayerBidToRuleEffect(
        playerBid,
        diceRoll,
        resolution.lastDieValue
      )
    );
  }

  protected getSirotageRuleEffects(
    currentPlayerName: string,
    diceRoll: DiceRoll,
    resolution: ActiveSirotageResolution,
    runner: RuleRunner
  ): Array<RuleEffect> {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const isSirotageWon = resolution.lastDieValue === chouetteValue;
    if (isSirotageWon) {
      return [
        {
          event: RuleEffectEvent.SIROP_WON,
          playerName: currentPlayerName,
          score: getCulDeChouetteScore(diceRoll),
        },
      ];
    }

    const lostSirotageRuleEffects: Array<RuleEffect> = [
      {
        event: RuleEffectEvent.SIROP_LOST,
        playerName: currentPlayerName,
        score: -this.getChouetteScore(diceRoll),
      },
    ];

    if (chouetteValue === 6 && runner.isRuleEnabled(Rules.CIVET)) {
      lostSirotageRuleEffects.push({
        event: RuleEffectEvent.ADD_CIVET,
        playerName: currentPlayerName,
        score: 0,
      });
    }

    return lostSirotageRuleEffects;
  }
}

export function isPlayerBidClaimable(
  chouetteValue: DieValue,
  playerBid: BidType,
  siropDieValue: DieValue
): boolean {
  switch (playerBid) {
    case BidType.COUCHE_SIROP:
    case BidType.FILE_SIROP:
      return false;
    case BidType.BEAU_SIROP:
      return chouetteValue === siropDieValue;
    case BidType.LINOTTE:
      return siropDieValue === 1;
    case BidType.ALOUETTE:
      return siropDieValue === 2;
    case BidType.FAUVETTE:
      return siropDieValue === 3;
    case BidType.MOUETTE:
      return siropDieValue === 4;
    case BidType.BERGERONNETTE:
      return siropDieValue === 5;
    case BidType.CHOUETTE:
      return siropDieValue === 6;
    default:
      return false;
  }
}
