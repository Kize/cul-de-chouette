import { ChouetteRule } from "../basic-rules/chouette-rule";
import { Resolver } from "../rule-resolver";
import { getCulDeChouetteScore } from "../basic-rules/cul-de-chouette-rule";
import { DiceRoll, DieValue } from "../dice-rule";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";

export interface PlayableBid {
  type: BidType;
  isPlayable: boolean;
}

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
    const sirotageRuleEffect = this.getSirotageRuleEffect(
      resolution,
      diceRoll,
      playerName
    );
    const bidRuleEffects = this.getBidRuleEffects(resolution, diceRoll);
    return [sirotageRuleEffect, ...bidRuleEffects];
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

  protected getSirotageRuleEffect(
    resolution: ActiveSirotageResolution,
    diceRoll: DiceRoll,
    currentPlayerName: string
  ): RuleEffect {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const isSirotageWon = resolution.lastDieValue === chouetteValue;
    if (isSirotageWon) {
      return {
        event: RuleEffectEvent.SIROP_WON,
        playerName: currentPlayerName,
        score: getCulDeChouetteScore(diceRoll),
      };
    } else {
      return {
        event: RuleEffectEvent.SIROP_LOST,
        playerName: currentPlayerName,
        score: -this.getChouetteScore(diceRoll),
      };
    }
  }
}

export interface SiropBid {
  playerName: string;
  playerBid: BidType;
  isBidValidated: boolean;
}

export enum BidType {
  BEAU_SIROP = "Beau-sirop",
  COUCHE_SIROP = "Couche-sirop",
  FILE_SIROP = "File-sirop",
  LINOTTE = "Linotte",
  ALOUETTE = "Alouette",
  FAUVETTE = "Fauvette",
  MOUETTE = "Mouette",
  BERGERONNETTE = "Bergeronnette",
  CHOUETTE = "Chouette",
}

const SIROTAGE_BID_TYPES = [
  BidType.BEAU_SIROP,
  BidType.COUCHE_SIROP,
  BidType.LINOTTE,
  BidType.ALOUETTE,
  BidType.FAUVETTE,
  BidType.MOUETTE,
  BidType.BERGERONNETTE,
  BidType.CHOUETTE,
];

export const dieValueToBidType = new Map([
  [1, BidType.LINOTTE],
  [2, BidType.ALOUETTE],
  [3, BidType.FAUVETTE],
  [4, BidType.MOUETTE],
  [5, BidType.BERGERONNETTE],
  [6, BidType.CHOUETTE],
]);

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
