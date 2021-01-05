import {
  ActiveSirotageResolution,
  BidType,
  SiropBid,
  SiropResolutionPayload,
  SirotageRule,
} from "./sirotage-rule";
import { Resolver } from "../rule-resolver";
import { DiceRoll, DieValue } from "../dice-rule";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";

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
        event: RuleEffectEvent.SIROP_BET_WON,
        playerName: playerBid.playerName,
        score: 0,
      };
    }

    return super.mapPlayerBidToRuleEffect(playerBid, diceRoll, lastDieValue);
  }

  async applyDiceRule({
    playerName,
    diceRoll,
  }: DiceRollGameContext): Promise<RuleEffects> {
    let initialChouetteRuleEffect: RuleEffect | undefined = undefined;
    const chouetteValue = this.getChouetteValue(diceRoll);
    const resolution = await this.attrapeOiseauResolver.getResolution({
      playerName,
      chouetteValue,
      playableBids: this.getPlayableBids(
        chouetteValue,
        ATTRAPE_OISEAU_BID_TYPES
      ),
    });

    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(playerName, diceRoll)];
    }

    let attrapeOiseauRuleEffect: RuleEffect;
    if (resolution.playerWhoMakeAttrapeOiseau) {
      const sirotageRuleEffect = await this.getSirotageRuleEffect(
        resolution,
        diceRoll,
        resolution.playerWhoMakeAttrapeOiseau
      );
      attrapeOiseauRuleEffect = {
        ...sirotageRuleEffect,
        event:
          sirotageRuleEffect.event === RuleEffectEvent.SIROP_WON
            ? RuleEffectEvent.ATTRAPE_OISEAU_WON
            : RuleEffectEvent.ATTRAPE_OISEAU_LOST,
      };
      initialChouetteRuleEffect = this.getChouetteRuleEffect(
        playerName,
        diceRoll
      );
    } else {
      attrapeOiseauRuleEffect = await this.getSirotageRuleEffect(
        resolution,
        diceRoll,
        playerName
      );
    }

    return [
      attrapeOiseauRuleEffect,
      ...(initialChouetteRuleEffect ? [initialChouetteRuleEffect] : []),
      ...this.getBidRuleEffects(resolution, diceRoll),
    ];
  }
}
