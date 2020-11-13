import { Rule } from "./rule";
import { RuleEffects } from "./rule-effect";
import {
  GameContextEvent,
  GameContextWrapper,
  PlayTurnGameContext,
  UnknownGameContext,
} from "../game-context-event";

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [DieValue, DieValue, DieValue];

export abstract class DiceRule implements Rule {
  abstract isApplicableToDiceRoll(diceRoll: DiceRoll): boolean;

  abstract applyDiceRule(
    context: PlayTurnGameContext
  ): RuleEffects | Promise<RuleEffects>;

  isApplicableToGameContext(context: UnknownGameContext): boolean {
    if (context.event === GameContextEvent.PLAY_TURN) {
      return this.isApplicableToDiceRoll(context.diceRoll);
    }
    return false;
  }

  applyRule(context: GameContextWrapper): RuleEffects | Promise<RuleEffects> {
    return this.applyDiceRule(context.asPlayTurn());
  }
}
