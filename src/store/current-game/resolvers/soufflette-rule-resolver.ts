import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { SouffletteResolution } from "../../../../domain/rules/level-one/soufflette-rule";

export class SouffletteRuleResolver extends RuleResolver<SouffletteResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openSouffletteResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeSouffletteResolver");
  }
}
