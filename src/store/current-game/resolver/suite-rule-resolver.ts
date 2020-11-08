import { RuleResolver } from "@/store/current-game/resolver/rule-resolver";
import store from "@/store/app.state";

export interface SuiteResolution {
  loosingPlayerName: string;
  multiplier: number;
}

export class SuiteRuleResolver extends RuleResolver<SuiteResolution> {
  constructor() {
    super();
  }

  initResolution(): void {
    store.dispatch("currentGame/dialogs/openSuiteResolver");
  }
}
