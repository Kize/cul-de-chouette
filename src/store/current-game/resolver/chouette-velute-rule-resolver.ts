import { RuleResolver } from "@/store/current-game/resolver/rule-resolver";
import store from "@/store/app.state";

export interface ChouetteVeluteResolution {
  playerNames: Array<string>;
}

export class ChouetteVeluteRuleResolver extends RuleResolver<ChouetteVeluteResolution> {
  constructor() {
    super();
  }

  initResolution(): void {
    store.dispatch("currentGame/dialogs/openChouetteVeluteResolver");
  }
}
