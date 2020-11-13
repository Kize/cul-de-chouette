import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import { ChouetteVeluteResolution } from "../../../../domain/rules/basic-rules/chouette-velute-rule";

export class ChouetteVeluteRuleResolver extends RuleResolver<
  ChouetteVeluteResolution
> {
  constructor() {
    super();
  }
  initResolution(): void {
    store.dispatch("currentGame/dialogs/openChouetteVeluteResolver");
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeChouetteVeluteResolver");
  }
}
