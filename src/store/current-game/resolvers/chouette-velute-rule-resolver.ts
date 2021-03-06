import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import {
  ChouetteVeluteResolution,
  ChouetteVeluteResolutionPayload,
} from "../../../../domain/rules/basic-rules/chouette-velute-rule";

export class ChouetteVeluteRuleResolver extends RuleResolver<
  ChouetteVeluteResolution,
  ChouetteVeluteResolutionPayload
> {
  constructor() {
    super();
  }

  initResolution(payload: ChouetteVeluteResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openChouetteVeluteResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeChouetteVeluteResolver");
  }
}
