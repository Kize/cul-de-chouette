import { DiceRoll } from "../rules/dice-rule";
import { GameContextEvent, GameContextWrapper } from "../game-context-event";
import { RuleRunner } from "../rule-runner";
import { NeantRule } from "../rules/basic-rules/neant-rule";

export class DummyContextBuilder {
  static aPlayTurnContext(): DummyPlayTurnContextBuilder {
    return new DummyPlayTurnContextBuilder();
  }

  static aGrelottineContext(): DummyGrelottineContextBuilder {
    return new DummyGrelottineContextBuilder();
  }

  static aBevueContext(): DummyBevueContextBuilder {
    return new DummyBevueContextBuilder();
  }
}

class DummyPlayTurnContextBuilder {
  private currentPlayerName = "";
  private diceRoll: DiceRoll = [1, 1, 1];

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
      event: GameContextEvent.PLAY_TURN,
      currentPlayerName: this.currentPlayerName,
      diceRoll: this.diceRoll,
    });
  }
}

class DummyGrelottineContextBuilder {
  private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);

  withRuleRunner(ruleRunner: RuleRunner): this {
    this.ruleRunner = ruleRunner;
    return this;
  }

  build(): GameContextWrapper {
    return new GameContextWrapper({
      event: GameContextEvent.CHALLENGE_GRELOTTINE,
      runner: this.ruleRunner,
    });
  }
}

class DummyBevueContextBuilder {
  private playerWhoMadeABevue = "APlayerName";

  withPlayerWhoMadeABevue(playerWhoMadeABevue: string): this {
    this.playerWhoMadeABevue = playerWhoMadeABevue;
    return this;
  }

  build(): GameContextWrapper {
    return new GameContextWrapper({
      event: GameContextEvent.APPLY_BEVUE,
      playerWhoMadeABevue: this.playerWhoMadeABevue,
    });
  }
}
