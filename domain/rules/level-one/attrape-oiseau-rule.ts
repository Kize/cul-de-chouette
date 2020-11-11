import { ActiveSirotageResolution, SirotageRule } from "./sirotage-rule";
import { Resolver } from "../rule-resolver";
import {
  ChangeScoreRuleEffect,
  GameContext,
  RuleEffect,
  RuleEffects,
} from "../rule";
import { HistoryLineType } from "../../../src/domain/history";

export type AttrapeOiseauResolution =
  | { isSirote: false }
  | ActiveAttrapeOiseauResolution;

export interface ActiveAttrapeOiseauResolution
  extends ActiveSirotageResolution {
  playerWhoMakeAttrapeOiseau: string | undefined;
}

export class AttrapeOiseauRule extends SirotageRule {
  constructor(private resolver: Resolver<AttrapeOiseauResolution>) {
    super(resolver);
  }

  async applyRule({
    currentPlayerName,
    diceRoll,
  }: GameContext): Promise<RuleEffects> {
    let initialChouetteRuleEffect: RuleEffect | undefined = undefined;
    const resolution = await this.resolver.getResolution();

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
