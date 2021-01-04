import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import {
  SouffletteResolution,
  SouffletteResolutionPayload,
} from "../../../../domain/rules/level-one/soufflette-rule";

export class SouffletteRuleResolver extends RuleResolver<
  SouffletteResolution,
  SouffletteResolutionPayload
> {
  initResolution(payload: SouffletteResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openSouffletteResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeSouffletteResolver");
  }
}
