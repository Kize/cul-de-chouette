import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { ArtichetteResolution } from "../../../../domain/rules/level-2/artichette-rule";

export class ArtichetteRuleResolver extends RuleResolver<ArtichetteResolution> {
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openArtichetteResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeArtichetteResolver");
  }
}
