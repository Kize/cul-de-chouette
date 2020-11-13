import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { SuiteResolution } from "../../../../domain/rules/basic-rules/suite-rule";
import {GrelottineResolution} from "../../../../domain/rules/basic-rules/grelottine-rule";

export class GrelottineRuleResolver extends RuleResolver<GrelottineResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openGrelottineResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeGrelottineResolver");
  }
}
