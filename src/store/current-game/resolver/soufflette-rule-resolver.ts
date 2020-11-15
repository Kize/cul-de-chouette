import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { GrelottineResolution } from "../../../../domain/rules/basic-rules/grelottine-rule";
import { SouffletteResolution } from '../../../../domain/rules/level-one/soufflette-rule';

export class SouffletteRuleResolver extends RuleResolver<SouffletteResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openSouffletteResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeSouffletteResolver");
  }
}
