import { ChouetteRule } from "../basic-rules/chouette-rule";
import { Resolver } from "../rule-resolver";
import { HistoryLineType } from "@/domain/history";
import { getCulDeChouetteScore } from "../basic-rules/cul-de-chouette-rule";
import { DiceRoll, DieValue } from "../dice-rule";
import {
  ChangeScoreRuleEffect,
  RuleEffect,
  RuleEffects,
  RuleEffetType,
} from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export interface PlayableBid {
  type: BidType;
  isPlayable: boolean;
}

export interface SiropResolutionPayload {
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
    currentPlayerName,
    diceRoll,
  }: PlayTurnGameContext): Promise<RuleEffects> {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const resolution = await this.sirotageResolver.getResolution({
      chouetteValue,
      playableBids: this.getPlayableBids(chouetteValue, SIROTAGE_BID_TYPES),
    });
    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(currentPlayerName, diceRoll)];
    }
    const sirotageRuleEffect = this.getSirotageRuleEffect(
      resolution,
      diceRoll,
      currentPlayerName
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

    if (playerBid.playerBid === winningBet) {
      score = playerBid.isBidValidated ? 25 : 0;
    } else if (playerBid.playerBid === BidType.COUCHE_SIROP) {
      score = 0;
    } else {
      score = -5;
    }

    return {
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP_CHALLENGE,
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
  ): ChangeScoreRuleEffect {
    const sirotageRuleEffect: ChangeScoreRuleEffect = {
      type: RuleEffetType.CHANGE_SCORE,
      designation: HistoryLineType.SIROP,
      playerName: currentPlayerName,
      score: 0,
    };

    const chouetteValue = this.getChouetteValue(diceRoll);
    const isSirotageWon = resolution.lastDieValue === chouetteValue;

    if (isSirotageWon) {
      sirotageRuleEffect.score = getCulDeChouetteScore(diceRoll);
    } else {
      sirotageRuleEffect.score = -this.getChouetteScore(diceRoll);
    }
    return sirotageRuleEffect;
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
