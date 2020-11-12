import { DiceRoll } from "./rules/dice-rule";

export type GameContextEvent =
  | { type: GameContextEventType.PLAY_TURN; gameContext: PlayTurnGameContext }
  | {
      type: GameContextEventType.CHALLENGE_GRELOTTINE;
      gameContext: ChallengeGrelottineGameContext;
    }
  | {
      type: GameContextEventType.APPLY_BEVUE;
      gameContext: ApplyBevueGameContext;
    };

export enum GameContextEventType {
  PLAY_TURN,
  CHALLENGE_GRELOTTINE,
  APPLY_BEVUE,
}

export type GameContext =
  | PlayTurnGameContext
  | ChallengeGrelottineGameContext
  | ApplyBevueGameContext;

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
