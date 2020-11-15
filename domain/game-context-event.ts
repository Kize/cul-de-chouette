import { DiceRoll } from "./rules/dice-rule";
import { RuleRunner } from "./rule-runner";

export type UnknownGameContext =
  | PlayTurnGameContext
  | ChallengeGrelottineGameContext
  | ApplyBevueGameContext;

export enum GameContextEvent {
  PLAY_TURN,
  CHALLENGE_GRELOTTINE,
  APPLY_BEVUE,
}

export class GameContextWrapper {
  constructor(private gameContext: UnknownGameContext) {}

  asPlayTurn(): PlayTurnGameContext {
    if (this.gameContext.event === GameContextEvent.PLAY_TURN) {
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

export interface PlayTurnGameContext {
  event: GameContextEvent.PLAY_TURN;
  currentPlayerName: string;
  diceRoll: DiceRoll;
}

export interface ChallengeGrelottineGameContext {
  event: GameContextEvent.CHALLENGE_GRELOTTINE;
  runner: RuleRunner;
}

export interface ApplyBevueGameContext {
  event: GameContextEvent.APPLY_BEVUE;
  playerWhoMadeABevue: string;
}
