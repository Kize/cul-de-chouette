import { RuleEffects } from "./rule-effect";
import { GameContextEvent, GameContext } from "../game-context-event";

export interface Rule {
  isApplicableToGameContextEvent: (context: GameContextEvent) => boolean;
  applyRule: (context: GameContext) => RuleEffects | Promise<RuleEffects>;
}
