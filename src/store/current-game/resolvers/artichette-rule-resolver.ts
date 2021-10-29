import { RuleResolver } from "../../../../domain/rules/rule-resolver";
import store from "@/store/app.state";
import {
  ArtichetteResolution,
  ArtichetteResolutionPayload,
} from "../../../../domain/rules/level-2/artichette-rule";

export class ArtichetteRuleResolver extends RuleResolver<
  ArtichetteResolution,
  ArtichetteResolutionPayload
> {
  initResolution(payload: ArtichetteResolutionPayload): void {
    store.dispatch("currentGame/dialogs/openArtichetteResolver", payload);
  }

  endResolution(): void {
    store.dispatch("currentGame/dialogs/closeArtichetteResolver");
  }
}
