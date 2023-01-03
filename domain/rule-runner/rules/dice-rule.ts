import { Rule, Rules } from "./rule";
import { RuleEffects } from "./rule-effect";
import {
  DiceRollGameContext,
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from "../game-context-event";

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [DieValue, DieValue, DieValue];

export abstract class DiceRule implements Rule {
  abstract name: Rules;

  abstract isApplicableToDiceRoll(diceRoll: DiceRoll): boolean;

  abstract applyDiceRule(
    context: DiceRollGameContext
  ): RuleEffects | Promise<RuleEffects>;

  isApplicableToGameContext(gameContext: UnknownGameContext): boolean {
    if (gameContext.event === GameContextEvent.DICE_ROLL) {
      return this.isApplicableToDiceRoll(gameContext.diceRoll);
    }
    return false;
  }

  applyRule(
    gameContextWrapper: GameContextWrapper
  ): RuleEffects | Promise<RuleEffects> {
    return this.applyDiceRule(gameContextWrapper.asDiceRoll());
  }
}
