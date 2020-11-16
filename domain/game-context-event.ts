import { DiceRoll } from "./rules/dice-rule";
import { RuleRunner } from "./rule-runner";

export type UnknownGameContext =
  | DiceRollGameContext
  | ChallengeGrelottineGameContext
  | ApplyBevueGameContext;

export enum GameContextEvent {
  DICE_ROLL,
  CHALLENGE_GRELOTTINE,
  APPLY_BEVUE,
}

export class GameContextWrapper {
  constructor(private gameContext: UnknownGameContext) {}

  asPlayTurn(): DiceRollGameContext {
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
    throw new Error("The given game context should be a ApplyBevueGameContext");
  }
}

export interface DiceRollGameContext {
  event: GameContextEvent.DICE_ROLL;
  playerName: string;
  diceRoll: DiceRoll;
  runner: RuleRunner;
}

export interface ChallengeGrelottineGameContext {
  event: GameContextEvent.CHALLENGE_GRELOTTINE;
  runner: RuleRunner;
}

export interface ApplyBevueGameContext {
  event: GameContextEvent.APPLY_BEVUE;
  playerWhoMadeABevue: string;
}
