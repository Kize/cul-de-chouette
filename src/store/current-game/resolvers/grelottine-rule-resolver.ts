import { RuleResolver } from "../../../../domain/rule-runner/rules/rule-resolver";
import store from "@/store/app.state";
import { GrelottineResolution } from "../../../../domain/rule-runner/rules/basic-rules/grelottine-rule";

export class GrelottineRuleResolver extends RuleResolver<GrelottineResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openGrelottineResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeGrelottineResolver");
  }
}
