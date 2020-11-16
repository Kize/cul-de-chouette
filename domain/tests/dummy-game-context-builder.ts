import { DiceRoll } from "../rules/dice-rule";
import { GameContextEvent, GameContextWrapper } from "../game-context-event";
import { RuleRunner } from "../rule-runner";
import { NeantRule } from "../rules/basic-rules/neant-rule";

export class DummyContextBuilder {
  static aDiceRollContext(): DummyDiceRollContextBuilder {
    return new DummyDiceRollContextBuilder();
  }

  static aGrelottineContext(): DummyGrelottineContextBuilder {
    return new DummyGrelottineContextBuilder();
  }

  static aBevueContext(): DummyBevueContextBuilder {
    return new DummyBevueContextBuilder();
  }
}

class DummyDiceRollContextBuilder {
  private playerName = "";
  private diceRoll: DiceRoll = [1, 1, 1];
  private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);

  withPlayerName(playerName: string): this {
    this.playerName = playerName;
    return this;
  }

  withDiceRoll(diceRoll: DiceRoll): this {
    this.diceRoll = diceRoll;
    return this;
  }

  withRuleRunner(ruleRunner: RuleRunner): this {
    this.ruleRunner = ruleRunner;
    return this;
  }

  build(): GameContextWrapper {
    return new GameContextWrapper({
      event: GameContextEvent.DICE_ROLL,
      playerName: this.playerName,
      diceRoll: this.diceRoll,
      runner: this.ruleRunner,
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
