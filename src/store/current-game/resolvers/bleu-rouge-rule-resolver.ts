import { RuleResolver } from "../../../../domain/rule-runner/rules/rule-resolver";
import store from "@/store/app.state";
import { BleuRougeResolution } from "../../../../domain/rule-runner/rules/level-3/bleu-rouge-rule";

export class BleuRougeRuleResolver extends RuleResolver<BleuRougeResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openBleuRougeResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeBleuRougeResolver");
  }
}
