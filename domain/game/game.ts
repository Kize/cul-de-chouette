import { Player } from "../player";
import { GameStatus } from "../../src/store/current-game/current-game.interface";
import { History } from "../history/history";

export class Game {
  status: GameStatus;
  history: History;
  players: Array<Player>;

  constructor(public name: string, players: Array<Player>) {
    this.status = GameStatus.IN_GAME;
    this.players = [...players];
    this.history = new History();
  }

  getCurrentPlayer(): Player {
    if (this.players.length === 0) {
      throw new Error("no players defined");
    }

    const playersWithTurnsNumbers = this.players.map((player) => ({
      player,
      numberOfTurnsPlayed: this.history.getNumberOfTurnsPlayed(player),
    }));

    const currentPlayer = playersWithTurnsNumbers.find(
      (playerWrapper, index, array) => {
        if (index === 0) {
          return false;
        }

        return (
          playerWrapper.numberOfTurnsPlayed <
          array[index - 1].numberOfTurnsPlayed
        );
      }
    )?.player;

    return currentPlayer ?? this.players[0];
  }

  getNumberOfTurns(): number {
    if (this.players.length === 0) {
      return 0;
    }

    const turnNumbersPerPlayer = this.players.map((player) =>
      this.history.getNumberOfTurnsPlayed(player)
    );

    if (turnNumbersPerPlayer[0] === 0) {
      return 1;
    }

    if (
      turnNumbersPerPlayer[0] ===
      turnNumbersPerPlayer[turnNumbersPerPlayer.length - 1]
    ) {
      return turnNumbersPerPlayer[0] + 1;
    }

    return turnNumbersPerPlayer[0];
  }
}
