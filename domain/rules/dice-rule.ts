import { Rule } from "./rule";
import { RuleEffects } from "./rule-effect";
import {
  GameContext,
  GameContextEvent,
  GameContextEventType,
  PlayTurnGameContext,
} from "../game-context-event";

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [DieValue, DieValue, DieValue];

export abstract class DiceRule implements Rule {
  abstract isApplicableToDiceRoll(diceRoll: DiceRoll): boolean;

  abstract applyDiceRule(
    context: PlayTurnGameContext
  ): RuleEffects | Promise<RuleEffects>;

  isApplicableToGameContextEvent(event: GameContextEvent): boolean {
    if (event.type === GameContextEventType.PLAY_TURN) {
      return this.isApplicableToDiceRoll(event.gameContext.diceRoll);
    }
    return false;
  }

  applyRule(context: GameContext): RuleEffects | Promise<RuleEffects> {
    if (isPlayTurnGameContext(context)) {
      return this.applyDiceRule(context);
    }

    return [];
  }
}

function isPlayTurnGameContext(
  gameContext: GameContext
): gameContext is PlayTurnGameContext {
  return gameContext.type === GameContextEventType.PLAY_TURN;
}
