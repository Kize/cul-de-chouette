import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { AttrapeOiseauResolution } from "../../../../domain/rules/level-1/attrape-oiseau-rule";
import { SiropResolutionPayload } from "../../../../domain/rules/level-1/sirotage-rule";

export class SiropRuleResolver extends RuleResolver<
  AttrapeOiseauResolution,
  SiropResolutionPayload
> {
  initResolution(payload: SiropResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openSiropResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeSiropResolver");
  }
}
