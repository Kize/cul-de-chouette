import { RuleEffects } from "./rule-effect";
import { GameContextWrapper, UnknownGameContext } from "../game-context-event";

export interface Rule {
  isApplicableToGameContext: (context: UnknownGameContext) => boolean;
  applyRule: (
    context: GameContextWrapper
  ) => RuleEffects | Promise<RuleEffects>;
}
