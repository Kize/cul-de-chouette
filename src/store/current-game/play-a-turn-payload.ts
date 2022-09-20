import { GameContextEvent } from "../../../domain/game-context-event";
import { DiceRoll, DieValue } from "../../../domain/rules/dice-rule";

export type PlayATurnPayload =
  | PlayADiceRollPayload
  | PlayACivetPayload
  | StartVerdierPayload;

export interface PlayADiceRollPayload {
  event: GameContextEvent.DICE_ROLL;
  diceRoll: DiceRoll;
}

export interface PlayACivetPayload {
  event: GameContextEvent.CIVET_BET;
}

export interface StartVerdierPayload {
  event: GameContextEvent.VERDIER;
  diceValues: [DieValue, DieValue];
}
