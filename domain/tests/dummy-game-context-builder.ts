import { DiceRoll } from "../rules/dice-rule";
import {
  GameContextEventType,
  GameContextWrapper,
} from "../game-context-event";

export class DummyPlayTurnGameContextBuilder {
  private currentPlayerName = "";
  private diceRoll: DiceRoll = [1, 1, 1];

  static aContext(): DummyPlayTurnGameContextBuilder {
    return new DummyPlayTurnGameContextBuilder();
  }

  withCurrentPlayerName(playerName: string): this {
    this.currentPlayerName = playerName;
    return this;
  }

  withDiceRoll(diceRoll: DiceRoll): this {
    this.diceRoll = diceRoll;
    return this;
  }

  build(): GameContextWrapper {
    return new GameContextWrapper({
      type: GameContextEventType.PLAY_TURN,
      currentPlayerName: this.currentPlayerName,
      diceRoll: this.diceRoll,
    });
  }
}
