import { Rule } from "../rule";
import { RuleEffects } from "../rule-effect";
import {
  GameContextWrapper,
  UnknownGameContext,
} from "../../game-context-event";

export class GrelottineRule implements Rule {
  isApplicableToGameContext(_context: UnknownGameContext): boolean {
    return false;
  }

  applyRule(_context: GameContextWrapper): RuleEffects | Promise<RuleEffects> {
    return [];
  }
}
