import {
  ActiveSirotageResolution,
  BidType,
  SiropBid,
  SiropResolutionPayload,
  SirotageRule,
} from "./sirotage-rule";
import { Resolver } from "../rule-resolver";
import { HistoryLineType } from "@/domain/history";
import { DiceRoll, DieValue } from "../dice-rule";
import {
  ChangeScoreRuleEffect,
  RuleEffect,
  RuleEffects,
  RuleEffetType,
} from "../rule-effect";
import { PlayTurnGameContext } from "../../game-context-event";

export type AttrapeOiseauResolution =
  | { isSirote: false }
  | ActiveAttrapeOiseauResolution;

export interface ActiveAttrapeOiseauResolution
  extends ActiveSirotageResolution {
  playerWhoMakeAttrapeOiseau: string | undefined;
}

const ATTRAPE_OISEAU_BID_TYPES = [
  BidType.BEAU_SIROP,
  BidType.COUCHE_SIROP,
  BidType.FILE_SIROP,
  BidType.LINOTTE,
  BidType.ALOUETTE,
  BidType.FAUVETTE,
  BidType.MOUETTE,
  BidType.BERGERONNETTE,
  BidType.CHOUETTE,
];

export class AttrapeOiseauRule extends SirotageRule {
  constructor(
    private attrapeOiseauResolver: Resolver<
      AttrapeOiseauResolution,
      SiropResolutionPayload
    >
  ) {
    super(attrapeOiseauResolver);
  }

  protected mapPlayerBidToRuleEffect(
    playerBid: SiropBid,
    diceRoll: DiceRoll,
    lastDieValue: DieValue
  ): RuleEffect {
    if (playerBid.playerBid === BidType.FILE_SIROP) {
      return {
        type: RuleEffetType.CHANGE_SCORE,
        designation: HistoryLineType.SIROP_CHALLENGE,
        playerName: playerBid.playerName,
        score: 0,
      };
    }

    return super.mapPlayerBidToRuleEffect(playerBid, diceRoll, lastDieValue);
  }

  async applyDiceRule({
    currentPlayerName,
    diceRoll,
  }: PlayTurnGameContext): Promise<RuleEffects> {
    let initialChouetteRuleEffect: RuleEffect | undefined = undefined;
    const chouetteValue = this.getChouetteValue(diceRoll);
    const resolution = await this.attrapeOiseauResolver.getResolution({
      chouetteValue,
      playableBids: this.getPlayableBids(
        chouetteValue,
        ATTRAPE_OISEAU_BID_TYPES
      ),
    });

    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(currentPlayerName, diceRoll)];
    }

    let attrapeOiseauRuleEffect: ChangeScoreRuleEffect;
    if (resolution.playerWhoMakeAttrapeOiseau) {
      const sirotageRuleEffect = await this.getSirotageRuleEffect(
        resolution,
        diceRoll,
        resolution.playerWhoMakeAttrapeOiseau
      );
      attrapeOiseauRuleEffect = {
        ...sirotageRuleEffect,
        designation: HistoryLineType.ATTRAPE_OISEAU,
      };
      initialChouetteRuleEffect = {
        ...this.getChouetteRuleEffect(currentPlayerName, diceRoll),
        designation: HistoryLineType.ATTRAPE_OISEAU,
      };
    } else {
      attrapeOiseauRuleEffect = await this.getSirotageRuleEffect(
        resolution,
        diceRoll,
        currentPlayerName
      );
    }

    return [
      attrapeOiseauRuleEffect,
      ...(initialChouetteRuleEffect ? [initialChouetteRuleEffect] : []),
      ...this.getBidRuleEffects(resolution, diceRoll),
    ];
  }
}
