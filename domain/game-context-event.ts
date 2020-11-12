import { DiceRoll } from "./rules/dice-rule";

export enum GameContextEventType {
  PLAY_TURN,
  CHALLENGE_GRELOTTINE,
  APPLY_BEVUE,
}

export type UnknownGameContext =
  | PlayTurnGameContext
  | ChallengeGrelottineGameContext
  | ApplyBevueGameContext;

export class GameContextWrapper {
  constructor(private gameContext: UnknownGameContext) {}

  asPlayTurn(): PlayTurnGameContext {
    if (this.gameContext.type === GameContextEventType.PLAY_TURN) {
      return this.gameContext;
    }
    throw new Error("The given game context should be a PlayTurnGameContext");
  }

  asChallengeGrelottine(): ChallengeGrelottineGameContext {
    if (this.gameContext.type === GameContextEventType.CHALLENGE_GRELOTTINE) {
      return this.gameContext;
    }
    throw new Error(
      "The given game context should be a ChallengeGrelottineGameContext"
    );
  }

  asApplyBevue(): ApplyBevueGameContext {
    if (this.gameContext.type === GameContextEventType.APPLY_BEVUE) {
      return this.gameContext;
    }
    throw new Error("The given game context should be a ApplyBevueGameContext");
  }
}

export interface PlayTurnGameContext {
  type: GameContextEventType.PLAY_TURN;
  currentPlayerName: string;
  diceRoll: DiceRoll;
}

export interface ChallengeGrelottineGameContext {
  type: GameContextEventType.CHALLENGE_GRELOTTINE;
}

export interface ApplyBevueGameContext {
  type: GameContextEventType.APPLY_BEVUE;
  currentPlayerName: string;
}
