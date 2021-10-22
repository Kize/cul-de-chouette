import {
  ActiveSirotageResolution,
  SiropResolutionPayload,
  SirotageRule,
} from "./sirotage-rule";
import { Resolver } from "../rule-resolver";
import { DiceRoll, DieValue } from "../dice-rule";
import { RuleEffect, RuleEffectEvent, RuleEffects } from "../rule-effect";
import { DiceRollGameContext } from "../../game-context-event";
import { Rules } from "../rule";
import { BidType, SiropBid } from "./sirotage-rule.types";

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
  name = Rules.ATTRAPE_OISEAU;

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
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    let initialChouetteRuleEffect: RuleEffect | undefined;
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

    let attrapeOiseauRuleEffects: Array<RuleEffect>;
    if (resolution.playerWhoMakeAttrapeOiseau) {
      const sirotageRuleEffects = this.getSirotageRuleEffects(
        resolution.playerWhoMakeAttrapeOiseau,
        diceRoll,
        resolution,
        runner
      );
      attrapeOiseauRuleEffects = sirotageRuleEffects.map((ruleEffect) => {
        if (
          ruleEffect.event === RuleEffectEvent.SIROP_WON ||
          ruleEffect.event === RuleEffectEvent.SIROP_LOST
        ) {
          return {
            ...ruleEffect,
            event:
              ruleEffect.event === RuleEffectEvent.SIROP_WON
                ? RuleEffectEvent.ATTRAPE_OISEAU_WON
                : RuleEffectEvent.ATTRAPE_OISEAU_LOST,
          };
        }

        return ruleEffect;
      });

      initialChouetteRuleEffect = this.getChouetteRuleEffect(
        playerName,
        diceRoll
      );
    } else {
      attrapeOiseauRuleEffects = this.getSirotageRuleEffects(
        playerName,
        diceRoll,
        resolution,
        runner
      );
    }

    return [
      ...(initialChouetteRuleEffect ? [initialChouetteRuleEffect] : []),
      ...attrapeOiseauRuleEffects,
      ...this.getBidRuleEffects(resolution, diceRoll),
    ];
  }
}
