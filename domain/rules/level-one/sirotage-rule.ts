import { ChouetteRule } from "../basic-rules/chouette-rule";
import { Resolver } from "../rule-resolver";
import {
  DieValue,
  GameContext,
  RuleEffect,
  RuleEffects,
  RuleEffetType,
} from "../rule";
import { HistoryLineType } from "../../../src/domain/history";
import { getCulDeChouetteScore } from "../basic-rules/cul-de-chouette-rule";

export type SirotageResolution = { isSirote: false } | ActiveSirotageResolution;

export interface ActiveSirotageResolution {
  isSirote: true;
  lastDieValue: DieValue;
  bids: Array<SiropBid>;
}

export class SirotageRule extends ChouetteRule {
  constructor(private readonly sirotageResolver: Resolver<SirotageResolution>) {
    super();
  }

  async applyRule({
    currentPlayerName,
    diceRoll,
  }: GameContext): Promise<RuleEffects> {
    const resolution = await this.sirotageResolver.getResolution();

    if (!resolution.isSirote) {
      return super.applyRule({ currentPlayerName, diceRoll });
    }

    const sirotageRuleEffect: RuleEffect = {
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

    const bidRuleEffects = resolution.bids.map((bid) => {
      let score: number;

      const winningBet =
        resolution.lastDieValue === chouetteValue
          ? BidType.BEAU_SIROP
          : dieValueToBidType.get(resolution.lastDieValue);

      if (bid.playerBid === winningBet) {
        score = bid.isBidValidated ? 25 : 0;
      } else if (bid.playerBid === BidType.COUCHE_SIROP) {
        score = 0;
      } else {
        score = -5;
      }

      return {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.SIROP_CHALLENGE,
        playerName: bid.playerName,
        score,
      };
    });

    return [sirotageRuleEffect, ...bidRuleEffects];
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

export const dieValueToBidType = new Map([
  [1, BidType.LINOTTE],
  [2, BidType.ALOUETTE],
  [3, BidType.FAUVETTE],
  [4, BidType.MOUETTE],
  [5, BidType.BERGERONNETTE],
  [6, BidType.CHOUETTE],
]);
