import { DiceRoll } from "../rules/dice-rule";
import { PlayTurnGameContext } from "../game-context-event";

export class DummyPlayTurnGameContextBuilder {
  private currentPlayerName: string = "";
  private diceRoll: DiceRoll = [1, 1, 1];

  private constructor() {}

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

  build(): PlayTurnGameContext {
    return {
      currentPlayerName: this.currentPlayerName,
      diceRoll: this.diceRoll,
    };
  }
}
