import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import {
  SuiteResolution,
  SuiteResolutionPayload,
} from "../../../../domain/rules/basic-rules/suite-rule";

export class SuiteRuleResolver extends RuleResolver<
  SuiteResolution,
  SuiteResolutionPayload
> {
  initResolution(payload: SuiteResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openSuiteResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeSuiteResolver");
  }
}
