import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { SuiteResolution } from "../../../../domain/rules/basic-rules/suite-rule";

export class SuiteRuleResolver extends RuleResolver<SuiteResolution> {
  constructor() {
    super();
  }

  initResolution(): void {
    store.dispatch("currentGame/dialogs/openSuiteResolver");
  }
}
