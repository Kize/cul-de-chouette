import { DiceRoll, GameContext } from "./rule";

export class DummyGameContextBuilder {
  private currentPlayerName: string = "";
  private diceRoll: DiceRoll = [1, 1, 1];

  private constructor() {}

  static aContext(): DummyGameContextBuilder {
    return new DummyGameContextBuilder();
  }

  withCurrentPlayerName(playerName: string): this {
    this.currentPlayerName = playerName;
    return this;
  }

  withDiceRoll(diceRoll: DiceRoll): this {
    this.diceRoll = diceRoll;
    return this;
  }

  build(): GameContext {
    return {
      currentPlayerName: this.currentPlayerName,
      diceRoll: this.diceRoll,
    };
  }
}
