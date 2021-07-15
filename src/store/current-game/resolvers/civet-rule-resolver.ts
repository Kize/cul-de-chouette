import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import {
  CivetResolution,
  CivetResolutionPayload,
} from "../../../../domain/rules/level-one/civet-rule";

export class CivetRuleResolver extends RuleResolver<
  CivetResolution,
  CivetResolutionPayload
> {
  initResolution(payload: CivetResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openCivetResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeCivetResolver");
  }
}
