import store from "@/store/app.state";
import { RuleResolver } from "../../../../domain/rule-runner/rules/rule-resolver";
import {
  VerdierResolution,
  VerdierResolutionPayload,
} from "../../../../domain/rule-runner/rules/level-3/verdier-rule";

export class VerdierRuleResolver extends RuleResolver<
  VerdierResolution,
  VerdierResolutionPayload
> {
  initResolution(payload: VerdierResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openVerdierResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeVerdierResolver");
  }
}
