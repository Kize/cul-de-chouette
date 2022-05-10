import { DiceRoll, DieValue } from "./rules/dice-rule";
import { RuleRunner } from "./rule-runner";

export type UnknownGameContext =
  | DiceRollGameContext
  | ChallengeGrelottineGameContext
  | ApplyBevueGameContext
  | CivetGameContext
  | VerdierGameContext;

export enum GameContextEvent {
  DICE_ROLL,
  CHALLENGE_GRELOTTINE,
  APPLY_BEVUE,
  CIVET_BET,
  VERDIER,
}

export class GameContextWrapper {
  constructor(private gameContext: UnknownGameContext) {}

  asDiceRoll(): DiceRollGameContext {
    if (this.gameContext.event === GameContextEvent.DICE_ROLL) {
      return this.gameContext;
    }
    throw new Error("The given game context should be a PlayTurnGameContext");
  }

  asChallengeGrelottine(): ChallengeGrelottineGameContext {
    if (this.gameContext.event === GameContextEvent.CHALLENGE_GRELOTTINE) {
      return this.gameContext;
    }
    throw new Error(
      "The given game context should be a ChallengeGrelottineGameContext"
    );
  }

  asApplyBevue(): ApplyBevueGameContext {
    if (this.gameContext.event === GameContextEvent.APPLY_BEVUE) {
      return this.gameContext;
    }
    throw new Error(
      "The given game context should be an ApplyBevueGameContext"
    );
  }

  asCivet(): CivetGameContext {
    if (this.gameContext.event === GameContextEvent.CIVET_BET) {
      return this.gameContext;
    }
    throw new Error("The given game context should be a Civet");
  }

  asVerdier(): VerdierGameContext {
    if (this.gameContext.event === GameContextEvent.VERDIER) {
      return this.gameContext;
    }
    throw new Error("The given game context should be a Civet");
  }
}

export interface ApplyBevueGameContext {
  event: GameContextEvent.APPLY_BEVUE;
  playerWhoMadeABevue: string;
}

export interface ChallengeGrelottineGameContext {
  event: GameContextEvent.CHALLENGE_GRELOTTINE;
  runner: RuleRunner;
}

export interface DiceRollGameContext {
  event: GameContextEvent.DICE_ROLL;
  playerName: string;
  diceRoll: DiceRoll;
  runner: RuleRunner;
}

export interface CivetGameContext {
  event: GameContextEvent.CIVET_BET;
  runner: RuleRunner;
  playerName: string;
}

export interface VerdierGameContext {
  event: GameContextEvent.VERDIER;
  runner: RuleRunner;
  playerName: string;
  diceValues: [DieValue, DieValue];
}
