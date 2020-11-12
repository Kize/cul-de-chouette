import { Rule } from "./rule";
import { RuleEffects } from "./rule-effect";
import {
  GameContext,
  GameContextEvent,
  GameContextEventType, PlayTurnGameContext,
} from '../game-context-event';

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [DieValue, DieValue, DieValue];

export abstract class DiceRule implements Rule {
  abstract isApplicableToDiceRoll(diceRoll: DiceRoll): boolean;

  abstract applyRule(context: GameContext): RuleEffects | Promise<RuleEffects>;

  isApplicableToGameContextEvent(event: GameContextEvent): boolean {
    if (event.type === GameContextEventType.PLAY_TURN) {
      return this.isApplicableToDiceRoll(event.gameContext.diceRoll);
    }
    return false;
  }
}
