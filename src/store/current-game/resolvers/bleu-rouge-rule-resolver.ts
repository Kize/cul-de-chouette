import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { BleuRougeResolution } from "../../../../domain/rules/level-three/bleu-rouge-rule";

export class BleuRougeRuleResolver extends RuleResolver<BleuRougeResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openBleuRougeResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeBleuRougeResolver");
  }
}
